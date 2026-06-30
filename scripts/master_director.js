"use worker";
/* ============================================================================
 * master_director.js — MASTER ENGINE (Five-Hero AU)
 * Header (S·EP | time | location) that the lore scripts read for season-gating,
 * realistic time, episode/season progression, the Wave doom-clock, {{user}}'s
 * reputation standing, offscreen world-movement, per-turn rails, and hidden
 * state persistence. ASSIGN THIS LAST (after the lorebooks). Edit only CONFIG.
 * If state ever stops persisting, set CARRIER:"visible".
 * ========================================================================== */

/* ==============================  CONFIG  ================================== */
var CONFIG = {
  CARRIER: "zw",
  START: { time: "10:00", season: 1, episode: 1, rep: 82 },   // S1E1 summoning; revered (rep 82/100)
  EPISODES_PER_SEASON: 12,
  WAVE_MAX: 6,                                                 // AU: Waves come faster (fills every ~6 episodes)
  LOCATIONS: ["Throne Hall","Castle Town","Melromarc Castle","The Road","Wave Rift","Lurolona Village","Wilderness","Elsewhere"],
  LOCATION_CUES: {
    "Throne Hall":["throne","throne hall","audience hall","summoning chamber"],
    "Castle Town":["castle town","market","tavern","blacksmith","the inn","town square"],
    "Melromarc Castle":["castle","palace","court","the king","the queen"],
    "The Road":["the road","on the way","travel","carriage","caravan","heading to","journey"],
    "Wave Rift":["wave rift","the wave","rift","red sky","hourglass empties"],
    "Lurolona Village":["village","lurolona","the manor","my territory"],
    "Wilderness":["forest","mountains","cave","dungeon","wilds","plains","ruins"]
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
function recent(d){var o="",s=Math.max(0,MSGS.length-(d||8));for(var i=s;i<MSGS.length;i++){var m=MSGS[i];o+=" "+((m&&m.message)?m.message:"");}return o;}

/* ---- carrier ---- */
var ZW={'0':'\u200B','1':'\u200C','2':'\u200D','3':'\uFEFF','4':'\u2060','5':'\u2061','6':'\u2062','7':'\u2063','8':'\u200E','9':'\u200F'};
var ZR={};Object.keys(ZW).forEach(function(k){ZR[ZW[k]]=k;});
var MARK='\u2064\u2064';
var ZRE=new RegExp("\\u2064\\u2064([\\u200B\\u200C\\u200D\\uFEFF\\u2060\\u2061\\u2062\\u2063\\u200E\\u200F]+?)\\u2064\\u2064");
var VRE=/\u27E6ST:(\d{12,})\u27E7/;
function zwE(d){return d.split('').map(function(c){return ZW[c]||'';}).join('');}
function zwD(s){return s.split('').map(function(c){return ZR[c]||'';}).join('');}

/* ---- time ---- */
function toMin(h){var m=String(h).match(/(\d{1,2}):(\d{2})/);return m?clampI(m[1],0,23)*60+clampI(m[2],0,59):600;}
function hhmm(t){t=clampI(t,0,1439);return pad(Math.floor(t/60),2)+":"+pad(t%60,2);}
function period(t){var h=Math.floor(t/60);if(h<5)return"Late-Night";if(h<12)return"Morning";if(h<17)return"Afternoon";if(h<21)return"Evening";return"Night";}

/* ---- state ---- */
function initState(){return {v:1,S:CONFIG.START.season,E:CONFIG.START.episode,DAY:0,TM:toMin(CONFIG.START.time),L:0,REP:CONFIG.START.rep,W:0};}
function serialize(s){return pad(s.v,1)+pad(s.S,2)+pad(s.E,2)+pad(s.DAY,3)+pad(s.TM,4)+pad(s.L,2)+pad(s.REP,3)+pad(s.W,2);}
function deserialize(d){if(!d||d.length<19)return null;var i=0;function t(w){var v=d.substr(i,w);i+=w;return parseInt(v,10)||0;}
  var s={v:t(1),S:t(2),E:t(2),DAY:t(3),TM:clampI(t(4),0,1439),L:t(2),REP:clampI(t(3),0,100),W:t(2)};
  s.S=clampI(s.S,1,99);s.E=clampI(s.E,1,99);s.L=clampI(s.L,0,CONFIG.LOCATIONS.length-1);s.W=clampI(s.W,0,CONFIG.WAVE_MAX);return s;}
function loadState(){var scan=recent(8);var z=scan.match(ZRE);if(z&&z[1]){var s=deserialize(zwD(z[1]));if(s)return s;}var v=scan.match(VRE);if(v&&v[1]){var s2=deserialize(v[1]);if(s2)return s2;}return initState();}

var ST=loadState();

/* ---- time advance ---- */
function advance(prev){var cur=clampI(prev,0,1439);
  if(uHas(["go to sleep","fall asleep","go to bed","call it a night","next morning","the next day","next day","wake up","make camp"]))return{tm:7*60,end:true};
  var am=UTXT.match(/\b(\d{1,2})(?::(\d{2}))?\s*(am|pm)\b/);if(am){var h=+am[1],mm=am[2]?+am[2]:0;if(am[3]==="pm"&&h<12)h+=12;if(am[3]==="am"&&h===12)h=0;return{tm:clampI(h,0,23)*60+mm,end:false};}
  if(uHas(["that night","tonight","by nightfall"]))return{tm:Math.max(21*60,cur),end:false};
  if(uHas(["after dinner"]))return{tm:Math.max(20*60,cur),end:false};
  if(uHas(["next wave","the wave hits","wave begins"]))return{tm:cur+30,end:false};
  var inc=0;
  if(uHas(["train","spar","practice","drill"]))inc=Math.max(inc,90);
  if(uHas(["travel","journey","ride out","set out","march"]))inc=Math.max(inc,120);
  if(uHas(["eat","meal","feast","tavern","drink"]))inc=Math.max(inc,40);
  if(uHas(["walk","head to","go to","make my way","enter"]))inc=Math.max(inc,15);
  if(uHas(["rest","sit","wait"]))inc=Math.max(inc,20);
  if(inc>0)return{tm:cur+inc,end:false};
  var base;if(uHas(["fight","attack","strike","charge","slay","battle","cleave"]))base=2;else if(uHas(["kiss","embrace","whisper","hold"]))base=5;else{var L=UTXT.length;base=L<120?4:(L<400?9:15);}
  return{tm:cur+base,end:false};
}
var A=advance(ST.TM), rolled=false;
if(A.end){ST.DAY=clampI(ST.DAY+1,0,999);ST.TM=A.tm;ST.E=ST.E+1;rolled=true;
  if(ST.E>CONFIG.EPISODES_PER_SEASON){ST.S=clampI(ST.S+1,1,99);ST.E=1;}
}else{ST.TM=clampI(Math.min(A.tm,1439),0,1439);}

/* ---- location ---- */
var moved=uHas(["go to","head to","walk to","arrive","enter","into the","at the","back to","reach the"]);
if(moved||rolled){var ls=CONFIG.LOCATIONS;for(var li=0;li<ls.length;li++){if(uHas(CONFIG.LOCATION_CUES[ls[li]]||[])){ST.L=li;break;}}}

/* ---- Wave doom-clock (advances each episode; detonates at max) ---- */
var WAVE_NOW=false;
if(rolled){ST.W=clampI(ST.W+1,0,CONFIG.WAVE_MAX);if(ST.W>=CONFIG.WAVE_MAX){WAVE_NOW=true;ST.W=0;}}
if(uHas(["next wave","the wave hits","wave begins","hourglass empties"])){WAVE_NOW=true;ST.W=0;}

/* ---- reputation nudges (light; {{user}} starts revered) ---- */
if(uHas(["save","protect","defend","rescue","spare","help the","heal","honor"]))ST.REP=clampI(ST.REP+2,0,100);
if(uHas(["betray","slaughter","enslave","torture","abandon them","murder","cruel"]))ST.REP=clampI(ST.REP-3,0,100);
function repTier(r){if(r>=80)return"revered hero";if(r>=60)return"respected and favored";if(r>=40)return"watched with mixed feelings";if(r>=20)return"distrusted";return"feared/reviled";}

/* ---- header ---- */
function header(){return "S"+ST.S+" \u00b7 EP"+ST.E+" | "+hhmm(ST.TM)+" \u00b7 "+period(ST.TM)+" | "+CONFIG.LOCATIONS[ST.L];}
SCN("[DIRECTOR] Begin the reply with exactly this line, nothing before it: \""+header()+"\" then a line containing only \"---\", then the scene. Never reword or omit it.");
SCN("[TIME] It is "+hhmm(ST.TM)+" ("+period(ST.TM)+"). Match lighting and who is plausibly around to this hour.");

/* ---- standing + wave directives ---- */
SCN("[STANDING] As the Axe Hero, {{user}} is currently "+repTier(ST.REP)+" ("+ST.REP+"/100). Have the world (Church of the Five, nobles, commoners) treat him accordingly; never print the number in-scene.");
if(WAVE_NOW){SCN("[WAVE] A Wave of Calamity breaks THIS episode: the sky cracks red, monsters pour from the rift, and the heroes are pulled to confront it. Make it the scene's gravity.");}
else{var left=CONFIG.WAVE_MAX-ST.W;SCN("[WAVE COUNTDOWN] The Dragon Hourglass shows the next Wave roughly "+left+" episode"+(left===1?"":"s")+" away — let that pressure color faction moves and preparations.");}

/* ---- offscreen ---- */
SCN("[OFFSCREEN] End the reply with a line containing only '---', then 1\u20133 sentences of what's happening elsewhere (the other four heroes' parties, Melromarc's court and the Churches, scheming nobles, the next Wave drawing closer). Reveal faction/plot movement freely; never relocate or contradict anyone on-screen in the current scene.");

/* ---- per-turn rails (compact; placed late for salience) ---- */
SCN("[HARD RULES] (1) NEVER author {{user}} \u2014 narrate only what happens TO/AROUND him; stop where his action begins. (2) SHOW, DON'T TELL \u2014 concrete observable detail, never named emotions or explained meaning. (3) NO OMNISCIENCE \u2014 a character knows only what they saw/were told on-screen or is public; powers/rank/networks are not a source of specific facts.");

/* ---- emit hidden state LAST ---- */
var digits=serialize(ST);
if(CONFIG.CARRIER==="visible")SCN("[STATE-CODE] End the very last line with exactly this and nothing else: \u27E6ST:"+digits+"\u27E7");
else SCN("[MEMORY] At the very end of the reply, after all text, output these hidden characters exactly and contiguously; never mention or alter them: "+MARK+zwE(digits)+MARK);
/* ========================================================================== */
