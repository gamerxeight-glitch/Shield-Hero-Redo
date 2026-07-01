"use worker";
/* ============================================================================
 * master_director.js — MASTER ENGINE (Five-Hero AU)
 * Prints the header (S·EP | time | location) the lore scripts read for season-
 * gating; tracks accelerated in-story time, the Wave clock, {{user}}'s standing,
 * in-scene world/arc steering, per-turn rails, and hidden state persistence.
 * AUTO-SEEDS season/episode/time/location from the FIRST MESSAGE's header line,
 * so any opener just works (no manual CONFIG.START). Optional greeting tag
 * "~~~wave:N~~~" (the ~~~ wrapper is hidden from the player in Janitor) = next Wave N days out.
 * ASSIGN THIS LAST (after the lorebooks). Edit only CONFIG.
 * If state ever stops persisting, set CARRIER:"visible".
 * ========================================================================== */

/* ==============================  CONFIG  ================================== */
var CONFIG = {
  CARRIER: "zw",
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

/* ---- carrier ---- */
var ZW={'0':'\u200B','1':'\u200C','2':'\u200D','3':'\uFEFF','4':'\u2060','5':'\u2061','6':'\u2062','7':'\u2063','8':'\u200E','9':'\u200F'};
var ZR={};Object.keys(ZW).forEach(function(k){ZR[ZW[k]]=k;});
var MARK='\u2064\u2064';
var ZRE=new RegExp("\\u2064\\u2064([\\u200B\\u200C\\u200D\\uFEFF\\u2060\\u2061\\u2062\\u2063\\u200E\\u200F]+?)\\u2064\\u2064");
var VRE=/\u27E6ST:(\d{14,})\u27E7/;
function zwE(d){return d.split('').map(function(c){return ZW[c]||'';}).join('');}
function zwD(s){return s.split('').map(function(c){return ZR[c]||'';}).join('');}

/* ---- time ---- */
function toMin(h){var m=String(h).match(/(\d{1,2}):(\d{2})/);return m?clampI(m[1],0,23)*60+clampI(m[2],0,59):600;}
function hhmm(t){t=clampI(t,0,1439);return pad(Math.floor(t/60),2)+":"+pad(t%60,2);}
function period(t){var h=Math.floor(t/60);if(h<5)return"Late-Night";if(h<12)return"Morning";if(h<17)return"Afternoon";if(h<21)return"Evening";return"Night";}

/* ---- read a header line ("S1 · EP4 | 20:00 · Night | Location") — last match wins ---- */
function lastHeader(scan){
  var re=/S(\d{1,2})\s*[\u00b7.\-]\s*EP(\d{1,3})\s*\|\s*(\d{1,2}):(\d{2})[^|]*\|\s*([^\n\r|]+)/gi, m, last=null;
  while((m=re.exec(scan))!==null){ last=m; }
  if(!last) return null;
  return { S:clampI(last[1],1,99), E:clampI(last[2],1,999),
           TM:clampI(last[3],0,23)*60+clampI(last[4],0,59), loc:String(last[5]).trim() };
}

/* ---- state ---- */
function initState(){return {v:1,S:CONFIG.START.season,E:CONFIG.START.episode,DAY:0,TM:toMin(CONFIG.START.time),REP:CONFIG.START.rep,W:0,WAVES:0,PSZ:0};}
function serialize(s){return pad(s.v,1)+pad(s.S,2)+pad(s.E,3)+pad(s.DAY,3)+pad(s.TM,4)+pad(s.REP,3)+pad(s.W,2)+pad(s.WAVES,2)+pad(s.PSZ,1);}
function deserialize(d){if(!d||d.length<20)return null;var i=0;function t(w){var v=d.substr(i,w);i+=w;return parseInt(v,10)||0;}
  var s={v:t(1),S:t(2),E:t(3),DAY:t(3),TM:clampI(t(4),0,1439),REP:clampI(t(3),0,100),W:t(2),WAVES:t(2)};
  s.PSZ=(d.length>=21)?clampI(d.substr(20,1),0,9):0;
  s.S=clampI(s.S,1,99);s.E=clampI(s.E,1,999);s.W=clampI(s.W,0,CONFIG.DAYS_PER_WAVE);s.WAVES=clampI(s.WAVES,0,99);return s;}
function loadState(){
  var scan=recent(4);
  var z=scan.match(ZRE);if(z&&z[1]){var s=deserialize(zwD(z[1]));if(s)return s;}
  var v=scan.match(VRE);if(v&&v[1]){var s2=deserialize(v[1]);if(s2)return s2;}
  /* no saved state -> seed from the opener's header line */
  var st=initState(); st._seeded=true;
  var lh=lastHeader(scan);
  if(lh){ st.S=lh.S; st.E=lh.E; st.TM=lh.TM; st.DAY=lh.E; st.WAVES=clampI((lh.S-1)*CONFIG.WAVES_PER_SEASON,0,99); }
  var wm=scan.match(/wave\s*:\s*(\d{1,2})/i);
  if(wm){ var wd=clampI(wm[1],0,CONFIG.DAYS_PER_WAVE);
          if(wd<=0){ st._waveNow=true; } else { st.W=clampI(CONFIG.DAYS_PER_WAVE-wd,0,CONFIG.DAYS_PER_WAVE); } }
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

/* seed-driven Wave (imminent opener via "wave:0") */
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

/* ---- header ---- */
function header(){return "S"+ST.S+" \u00b7 EP"+ST.E+" | "+hhmm(ST.TM)+" \u00b7 "+period(ST.TM)+" | "+LOCNAME;}
SCN("[DIRECTOR] Begin the reply with exactly this line, nothing before it: \""+header()+"\" then a line containing only \"---\", then the scene. Never reword or omit it.");
SCN("[TIME] It is "+hhmm(ST.TM)+" ("+period(ST.TM)+"). Match lighting and who is plausibly around to this hour.");

/* ---- standing + wave directives ---- */
SCN("[STANDING] As the Axe Hero, {{user}} is currently "+repTier(ST.REP)+" ("+ST.REP+"/100). Have the world (Church of the Five, nobles, commoners) treat him accordingly; never print the number in-scene.");
SCN("[PARTY] Party-forming is the VOLUNTEERS' choice, never the hero's: adventurers, soldiers, mercenaries and mages each decide on their own which hero to follow. About "+ST.PSZ+" of them \u2014 a varied mix of any race, gender and class, never a fixed or single-gender lineup \u2014 choose to follow {{user}}, the Axe Hero, and attach themselves to him. Narrate them coming to him of their own accord; {{user}} does NOT audition, select, or hand-pick anyone, and never decide his response for him.");
if(WAVE_NOW){SCN("[WAVE] The Dragon Hourglass has run out \u2014 a Wave of Calamity breaks NOW. By the world's fixed GAME-MECHANICS, the instant the last grain falls every Hero and their whole party \u2014 {{user}} included \u2014 is automatically teleported to where the Wave erupts (a red-skied rift zone). This warp is an involuntary SYSTEM event, not anyone's choice, so it is the ONE sanctioned time the world moves {{user}}: narrate the pull seizing him and setting him down at the Wave front through his own senses, then STOP and let him act. Monsters are already pouring from the rift; this is the scene's gravity.");}
else{var left=CONFIG.DAYS_PER_WAVE-ST.W;SCN("[WAVE COUNTDOWN] The Dragon Hourglass shows the next Wave about "+left+" day"+(left===1?"":"s")+" out \u2014 let that pressure color faction moves and preparations. When it empties, the Hourglass auto-warps every hero and party to the Wave (a game mechanic); only then does that warp apply.");}

/* ---- pacing (story acceleration; never at the cost of agency) ---- */
SCN("[PACING] Keep a brisk roleplay clip \u2014 don't linger turn after turn inside the same minute. Mundane stretches (travel, prep, downtime, waiting) carry real in-story time as the header reflects; reserve slow, beat-by-beat pacing for charged moments (combat, confrontation, intimacy). Never compress or skip past {{user}}'s decisions, and never narrate his choices to save time.");

/* ---- world / arc steering ---- */
SCN("[WORLD] Surface significant, plot-relevant developments (faction/Church/court moves, the approaching Wave, the active arc's beats) INSIDE the live scene \u2014 through what {{user}} can see, hear, or be told in the moment. Never tack on a detached 'meanwhile, elsewhere' summary. Mold the scene to the active arc from the lorebook and keep events on their canon track.");
SCN("[PRESENCE] When the active arc needs {{user}} at a scene with the other heroes (court, council, Wave muster, summons), bring him in through an IN-WORLD call addressed to him \u2014 a royal messenger, a knock at his door, a sealed letter/order, a horn, the Dragon Hourglass's pull. Narrate the call REACHING him and STOP; never move, speak, decide for, or narrate {{user}} traveling to or entering the scene \u2014 let him answer the summons himself. Never skip, summarize away, or relocate a canon beat he belongs in.");

/* ---- per-turn rails (compact; placed late for salience) ---- */
SCN("[HARD RULES] (1) NEVER author {{user}} \u2014 narrate only what happens TO/AROUND him; stop where his action begins. (2) SHOW, DON'T TELL \u2014 concrete observable detail, never named emotions or explained meaning. (3) NO OMNISCIENCE \u2014 a character knows only what they saw/were told on-screen or is public; powers/rank/networks are not a source of specific facts. (4) PLOT NEVER OVERRIDES AGENCY \u2014 time, the Wave clock and world momentum move only the world and NPCs around {{user}}; they never license authoring him, rushing him, time-skipping, or deciding his turn. Keep the world ACTIVE (NPCs act, events advance, summons arrive), but ALWAYS end the reply where {{user}}'s next action begins. On any conflict between momentum and agency, agency wins.");

/* ---- emit hidden state LAST ---- */
var digits=serialize(ST);
if(CONFIG.CARRIER==="visible")SCN("[STATE-CODE] End the very last line with exactly this and nothing else: \u27E6ST:"+digits+"\u27E7");
else SCN("[MEMORY] At the very end of the reply, after all text, output these hidden characters exactly and contiguously; never mention or alter them: "+MARK+zwE(digits)+MARK);
/* ========================================================================== */
