"use worker";
/* ============================================================================
 * master_director.js — SCENE ENGINE (Five-Hero AU)
 * Prints the [SCENE] header (S·EP | time | location) the lore scripts read for
 * season-gating; tracks accelerated in-story time, the Wave clock, {{user}}'s
 * standing + party size, and injects a lean per-turn FRAME reminder. The FULL
 * narrative rules live in the System Prompt (custom prompt) — this only carries
 * live data + a compact reminder. Assign this LAST (after the lorebooks).
 *
 * STATE: S/E/time/location ride the VISIBLE header (human-readable, robust).
 * Only the hidden stats ride a short labeled tag the reply ends with:
 *   ~~~ST R<rep> W<wave-countdown> V<waves-survived> P<party-size> D<day>~~~
 * The ~~~ wrapper hides it from the reader; labels survive a miscopy (a dropped
 * field just falls back to default instead of corrupting everything).
 * Optional greeting tag "~~~wave:N~~~" = next Wave N days out (wave:0 = now).
 * Edit only CONFIG.
 * ========================================================================== */

/* ==============================  CONFIG  ================================== */
var CONFIG = {
  START: { time: "18:00", season: 1, episode: 1, rep: 82 },   // fallback only; greeting header overrides
  DAYS_PER_WAVE: 7,          // RP pace: a Wave at most ~7 in-story days apart
  WAVES_PER_SEASON: 3,       // season advances every few Waves (keeps arc gating stable, not day-count)
  WAKE_MIN: 7*60,            // 07:00 — a rolled day starts here
  DAY_END_MIN: 24*60,        // time past midnight rolls into the next day (story acceleration)
  LOCATION_CUES: {           // used to RE-LOCATE the header when {{user}} clearly moves
    "Throne Hall":["throne hall","audience hall","summoning chamber"],
    "Castle Town":["castle town","the market","the tavern","the blacksmith","the inn","town square"],
    "Melromarc Castle":["the castle","the palace","the court","throne room","banquet hall","grand hall"],
    "The Road":["the road","on the way","set out","ride out","caravan","heading to"],
    "Wave Rift":["wave rift","the rift","red sky"],
    "Lurolona Village":["the village","lurolona","my territory","the manor"],
    "Wilderness":["the forest","the mountains","the cave","dungeon","the wilds","the plains","ruins"],
    "Dragon Hourglass":["dragon hourglass","the hourglass"]
  }
};
/* ========================================================================== */


/* ===========================  ENGINE — LEAVE ALONE  ======================= */
context.character = context.character || {};
context.character.scenario = context.character.scenario || "";
var _c = context.chat || {};
var MSGS = _c.last_messages || [];
var LAST = (_c.last_message || "");
var UTXT = LAST.toLowerCase();
function SCN(t){ context.character.scenario += " " + t; }
function pad(n,w){n=String(Math.max(0,parseInt(n,10)||0));return n.length>=w?n.slice(-w):"0".repeat(w-n.length)+n;}
function clampI(n,lo,hi){n=parseInt(n,10);if(isNaN(n))n=lo;return n<lo?lo:(n>hi?hi:n);}
function uHas(list){for(var i=0;i<list.length;i++){if(UTXT.indexOf(list[i])>=0)return true;}return false;}
function recent(d){var o="",s=Math.max(0,MSGS.length-(d||4));for(var i=s;i<MSGS.length;i++){var m=MSGS[i];o+=" "+((m&&m.message)?m.message:"");}return o;}

/* ---- time ---- */
function toMin(h){var m=String(h).match(/(\d{1,2}):(\d{2})/);return m?clampI(m[1],0,23)*60+clampI(m[2],0,59):600;}
function hhmm(t){t=clampI(t,0,1439);return pad(Math.floor(t/60),2)+":"+pad(t%60,2);}
function period(t){var h=Math.floor(t/60);if(h<5)return"Late-Night";if(h<12)return"Morning";if(h<17)return"Afternoon";if(h<21)return"Evening";return"Night";}

/* ---- read the header line ("S1 · EP4 | 20:00 · Night | Location") — last match wins ---- */
function lastHeader(scan){
  var re=/S(\d{1,2})\s*[\u00b7.\-]\s*EP(\d{1,3})\s*\|\s*(\d{1,2}):(\d{2})[^|]*\|\s*([^\n\r|]+)/gi, m, last=null;
  while((m=re.exec(scan))!==null){ last=m; }
  if(!last) return null;
  return { S:clampI(last[1],1,99), E:clampI(last[2],1,999),
           TM:clampI(last[3],0,23)*60+clampI(last[4],0,59), loc:String(last[5]).trim() };
}

/* ---- hidden stat tag: ~~~ST R.. W.. V.. P.. D..~~~ (labeled -> miscopy-tolerant) ---- */
function statTag(scan){ var m=scan.match(/~~~\s*ST\b([^~]*)~~~/); return m?m[1]:null; }
function lbl(s,ch,def){ if(!s)return def; var m=s.match(new RegExp(ch+"(\\d{1,4})")); return m?parseInt(m[1],10):def; }

/* ---- load state: S/E/TM from the header, stats from the tag (defaults on turn 1) ---- */
function loadState(){
  var scan=recent(4), lh=lastHeader(scan), tag=statTag(scan), st={};
  if(lh){ st.S=lh.S; st.E=lh.E; st.TM=lh.TM; }
  else { st.S=CONFIG.START.season; st.E=CONFIG.START.episode; st.TM=toMin(CONFIG.START.time); }
  st.REP=clampI(lbl(tag,"R",CONFIG.START.rep),0,100);
  st.W  =clampI(lbl(tag,"W",0),0,CONFIG.DAYS_PER_WAVE);
  st.WAVES=clampI(lbl(tag,"V",0),0,99);
  st.PSZ=clampI(lbl(tag,"P",0),0,9);
  st.DAY=clampI(lbl(tag,"D",0),0,9999);
  if(!tag){ /* first turn — seed from header + optional greeting wave tag */
    st.WAVES = lh ? clampI((lh.S-1)*CONFIG.WAVES_PER_SEASON,0,99) : 0;
    st.W = 0;
    var wm=scan.match(/wave\s*:\s*(\d{1,2})/i);
    if(wm){ var wd=clampI(wm[1],0,CONFIG.DAYS_PER_WAVE);
            if(wd<=0){ st._waveNow=true; } else { st.W=clampI(CONFIG.DAYS_PER_WAVE-wd,0,CONFIG.DAYS_PER_WAVE); } }
  }
  return st;
}

var ST=loadState();
if(!ST.PSZ){ST.PSZ=3+Math.floor(Math.random()*5);}   // one-time roll: {{user}}'s party size, 3..7

/* ---- time advance (accelerated; charged scenes stay fine-grained) ---- */
function advance(prev){var cur=clampI(prev,0,1439);
  if(uHas(["go to sleep","fall asleep","go to bed","call it a night","next morning","the next day","next day","wake up","make camp","turn in"]))return{tm:CONFIG.WAKE_MIN,end:true};
  var am=UTXT.match(/\b(\d{1,2})(?::(\d{2}))?\s*(am|pm)\b/);if(am){var h=+am[1],mm=am[2]?+am[2]:0;if(am[3]==="pm"&&h<12)h+=12;if(am[3]==="am"&&h===12)h=0;return{tm:clampI(h,0,23)*60+mm,end:false};}
  if(uHas(["that night","tonight","by nightfall","this evening"]))return{tm:Math.max(21*60,cur),end:false};
  if(uHas(["after dinner","after the meal"]))return{tm:Math.max(20*60,cur),end:false};
  var inc;
  if(uHas(["kiss","embrace","whisper","caress","make out","makeout","hold her","hold him","cradle"]))inc=10;
  else if(uHas(["fight","attack","strike","charge","slay","battle","cleave","duel","clash","parry","cast"]))inc=10;
  else if(uHas(["train","spar","practice","drill","level up","grind"]))inc=150;
  else if(uHas(["travel","journey","ride out","set out","march","head out","on the road","set off","depart"]))inc=300;
  else if(uHas(["eat","meal","feast","tavern","dine","breakfast","lunch","supper","drink"]))inc=90;
  else if(uHas(["shop","market","browse","gather","prepare","forge","craft","restock","buy","sell","barter"]))inc=90;
  else if(uHas(["rest","wait","nap","relax","sit","linger"]))inc=90;
  else { var L=UTXT.length; inc=L<120?45:(L<400?75:120); }
  return{tm:cur+inc,end:false};
}

/* ---- day roll + season/Wave bookkeeping ---- */
var WAVE_NOW=false;
function maybeSeason(){var ns=1+Math.floor(ST.WAVES/CONFIG.WAVES_PER_SEASON);if(ns>ST.S){ST.S=clampI(ns,1,99);ST.E=1;}}
function rollDay(){ST.DAY=clampI(ST.DAY+1,0,9999);ST.E=clampI(ST.E+1,1,999);ST.W=clampI(ST.W+1,0,CONFIG.DAYS_PER_WAVE);
  if(ST.W>=CONFIG.DAYS_PER_WAVE){WAVE_NOW=true;ST.W=0;ST.WAVES=clampI(ST.WAVES+1,0,99);maybeSeason();}}

var A=advance(ST.TM);
if(A.end){rollDay();ST.TM=A.tm;}
else if(A.tm>=CONFIG.DAY_END_MIN){rollDay();ST.TM=CONFIG.WAKE_MIN;}
else{ST.TM=clampI(A.tm,0,1439);}

/* seed-driven Wave (imminent opener via ~~~wave:0~~~) */
if(ST._waveNow && !WAVE_NOW){WAVE_NOW=true;ST.W=0;ST.WAVES=clampI(ST.WAVES+1,0,99);maybeSeason();}
/* explicit in-fiction Wave trigger */
if(uHas(["next wave","the wave hits","wave begins","hourglass empties","the wave breaks"])){WAVE_NOW=true;ST.W=0;}

/* ---- location (from last header; re-located on clear movement; Wave overrides) ---- */
var lh2=lastHeader(recent(4));
var LOCNAME=(lh2&&lh2.loc)?lh2.loc:"Melromarc Castle";
if(uHas(["go to","head to","walk to","arrive","enter","into the","back to","reach the","return to","head for","make my way"])){
  for(var nm in CONFIG.LOCATION_CUES){ if(uHas(CONFIG.LOCATION_CUES[nm])){LOCNAME=nm;break;} }
}
if(WAVE_NOW)LOCNAME="Wave Rift";

/* ---- reputation nudges (light; {{user}} starts revered) ---- */
if(uHas(["save","protect","defend","rescue","spare","help the","heal","honor"]))ST.REP=clampI(ST.REP+2,0,100);
if(uHas(["betray","slaughter","enslave","torture","abandon them","murder","cruel"]))ST.REP=clampI(ST.REP-3,0,100);
function repTier(r){if(r>=80)return"revered hero";if(r>=60)return"respected and favored";if(r>=40)return"watched with mixed feelings";if(r>=20)return"distrusted";return"feared/reviled";}

/* ---- header (S/E/time/location — the visible, authoritative state) ---- */
function header(){return "S"+ST.S+" \u00b7 EP"+ST.E+" | "+hhmm(ST.TM)+" \u00b7 "+period(ST.TM)+" | "+LOCNAME;}
SCN("[SCENE] Begin the reply with exactly this line, nothing before it: \""+header()+"\" then a line containing only \"---\", then the scene. Never reword or omit it.");
SCN("[TIME] It is "+hhmm(ST.TM)+" ("+period(ST.TM)+"). Match lighting and who is plausibly around to this hour.");

/* ---- live data directives ---- */
SCN("[STANDING] As the Axe Hero, {{user}} is currently "+repTier(ST.REP)+" ("+ST.REP+"/100). Have the world (Church of the Five, nobles, commoners) treat him accordingly; never print the number in-scene.");
SCN("[PARTY] Recruitment is the VOLUNTEERS' choice, not the hero's: about "+ST.PSZ+" people (varied race/gender/class, never a fixed or single-gender lineup) choose to follow {{user}} of their own accord and attach themselves to him. He does not audition or hand-pick them; never decide his response for him.");
if(WAVE_NOW){SCN("[WAVE] The Dragon Hourglass has run out \u2014 a Wave of Calamity breaks NOW. By the world's fixed GAME-MECHANICS, the instant the last grain falls every Hero and their whole party \u2014 {{user}} included \u2014 is automatically teleported to where the Wave erupts (a red-skied rift). This warp is an involuntary SYSTEM event, not a choice, so it is the ONE time the world moves {{user}}: render the pull seizing him and setting him at the Wave front through his senses, then STOP for his action. Monsters already pour from the rift; make it the scene's gravity.");}
else{var left=CONFIG.DAYS_PER_WAVE-ST.W;SCN("[WAVE COUNTDOWN] The Dragon Hourglass shows the next Wave about "+left+" day"+(left===1?"":"s")+" out \u2014 let that pressure color faction moves and preparations. When it empties, the Hourglass auto-warps every hero and party to the Wave (game mechanic); only then does that warp apply.");}

/* ---- lean FRAME reminder (full rules live in the System Prompt) ---- */
SCN("[FRAME] You are the living world + improv scene partner. The world and its people act on their own around {{user}} in the PRESENT moment \u2014 but you NEVER write, move, speak, think, or decide for him (not even a step, not even on a stated intent), you NEVER cut/fade/skip/flash-forward, and you END on the world acting on him, never on a 'what do you do?'. When a scene needs him present, the world SUMMONS him in-world (messenger, knock, horn) and you stop for him to answer. Every character knows ONLY what they personally witnessed; {{user}}'s status screen, thoughts, and private acts are invisible to all. Full rules: the System Prompt.");

/* ---- emit hidden stats LAST (labeled; ~~~ wrapper hides it) ---- */
var TAG="~~~ST R"+ST.REP+" W"+ST.W+" V"+ST.WAVES+" P"+ST.PSZ+" D"+ST.DAY+"~~~";
SCN("[STATE] At the very END of the reply, after all prose, output this tag EXACTLY and never alter, translate, space out, or mention it (the ~~~ wrapper auto-hides it from the reader): "+TAG);
/* ========================================================================== */
