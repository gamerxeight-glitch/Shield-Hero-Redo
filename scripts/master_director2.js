"use worker";
/* ============================================================================
 * master_director2.js — STREAMLINED SCENE ENGINE (Five-Hero AU)
 * Companion to lore_party2.js — removes redundant [PARTY] directive since
 * the party roster is now handled by the lorebook itself.
 *
 * Prints the [SCENE] header ("EP | time | location") the lore scripts read for
 * EP-gating, tracks the continuous EP/day clock, {{user}}'s standing, and
 * injects lean per-turn reminders. The FULL narrative rules live in the
 * System Prompt (custom prompt). Assign this LAST (after lorebooks).
 *
 * EP is a SINGLE CONTINUOUS counter (episode == in-story day); it NEVER resets.
 * There is NO Season and NO auto-Wave timer — Waves are scripted story beats
 * inside the EP lore entries. The ENGINE owns the ENTIRE header: it advances the
 * clock each turn from what {{user}} did and rolls EP+1 when a day ends (a sleep/
 * skip detected in his action, or the clock crossing midnight). The model prints
 * the header VERBATIM and never edits EP, time, or the checkpoint — EP and the
 * clock are read back from the hidden checkpoint (n, q), so the header is display.
 *
 * STATE: EP/time/location are SHOWN on the visible header for the reader; the
 * engine's authoritative EP + last clock-time also ride the hidden checkpoint,
 * which uses OPAQUE keys so the model can't interpret/edit it. It must be echoed
 * byte-for-byte. MAINTAINER LEGEND (never sent to the model):
 *   ~~~SV g<rep> k<party-size> n<EP> q<time-of-day-min>~~~
 * The ~~~ wrapper hides it from the reader; keys survive a miscopy (a dropped
 * field just falls back to default instead of corrupting everything).
 * Edit only CONFIG.
 * ========================================================================== */

/* ==============================  CONFIG  ================================== */
var CONFIG = {
  START: { time: "18:00", ep: 1, rep: 82 },   // fallback only; greeting header overrides
  WAKE_MIN: 7*60,            // 07:00 — a rolled day starts here
  DAY_END_MIN: 24*60,        // time past midnight rolls into the next day (story acceleration)
  LOCATION_CUES: {           // used to RE-LOCATE the header when {{user}} clearly moves
    "Throne Hall": ["throne hall", "audience hall", "summoning chamber"],
    "Castle Town": ["castle town", "the market", "the tavern", "the blacksmith", "the inn", "town square"],
    "Melromarc Castle": ["the castle", "the palace", "the court", "throne room", "banquet hall", "grand hall"],
    "The Road": ["the road", "on the way", "set out", "ride out", "caravan", "heading to"],
    "Wave Rift": ["wave rift", "the rift", "red sky"],
    "Lurolona Village": ["the village", "lurolona", "my territory", "the manor"],
    "Wilderness": ["the forest", "the mountains", "the cave", "dungeon", "the wilds", "the plains", "ruins"],
    "Dragon Hourglass": ["dragon hourglass", "the hourglass"]
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
function SCN(t) { context.character.scenario += " " + t; }
function pad(n, w) { n = String(Math.max(0, parseInt(n, 10) || 0)); return n.length >= w ? n.slice(-w) : "0".repeat(w - n.length) + n; }
function clampI(n, lo, hi) { n = parseInt(n, 10); if (isNaN(n)) n = lo; return n < lo ? lo : (n > hi ? hi : n); }
function uHas(list) { for (var i = 0; i < list.length; i++) { if (UTXT.indexOf(list[i]) >= 0) return true; } return false; }
function recent(d) { var o = "", s = Math.max(0, MSGS.length - (d || 4)); for (var i = s; i < MSGS.length; i++) { var m = MSGS[i]; o += " " + ((m && m.message) ? m.message : ""); } return o; }

/* ---- time ---- */
function toMin(h) { var m = String(h).match(/(\d{1,2}):(\d{2})/); return m ? clampI(m[1], 0, 23) * 60 + clampI(m[2], 0, 59) : 600; }
function hhmm(t) { t = clampI(t, 0, 1439); return pad(Math.floor(t / 60), 2) + ":" + pad(t % 60, 2); }
function period(t) { var h = Math.floor(t / 60); if (h < 5) return "Late-Night"; if (h < 12) return "Morning"; if (h < 17) return "Afternoon"; if (h < 21) return "Evening"; return "Night"; }

/* ---- read the header line ("EP7 | 20:00 · Night | Location") — last match wins.
   Tolerant of a stray leading "S# ·" from older greetings: we only parse EP onward. ---- */
function lastHeader(scan) {
  var re = /EP(\d{1,4})\s*\|\s*(\d{1,2}):(\d{2})[^|]*\|\s*([^\n\r|]+)/gi, m, last = null;
  while ((m = re.exec(scan)) !== null) { last = m; }
  if (!last) return null;
  return { E: clampI(last[1], 1, 9999), TM: clampI(last[2], 0, 23) * 60 + clampI(last[3], 0, 59), loc: String(last[4]).trim() };
}

/* ---- hidden checkpoint: ~~~SV g.. k.. n.. q..~~~  (opaque keys, miscopy-tolerant)
   MAINTAINER LEGEND: g=reputation  k=party-size  n=EP  q=time-of-day-minutes
   (the model never sees this) ---- */
function statTag(scan) { var m = scan.match(/~~~\s*SV\b([^~]*)~~~/); return m ? m[1] : null; }
function lbl(s, ch, def) { if (!s) return def; var m = s.match(new RegExp(ch + "(\\d{1,5})")); return m ? parseInt(m[1], 10) : def; }

/* ---- load state: EP + clock from the header, standing/party from the checkpoint ---- */
function loadState() {
  var scan = recent(4), lh = lastHeader(scan), tag = statTag(scan), st = {};
  st._hdr = !!lh;
  st.EP = clampI(lbl(tag, "n", (lh ? lh.E : CONFIG.START.ep)), 1, 9999);
  st.TM = clampI(lbl(tag, "q", (lh ? lh.TM : toMin(CONFIG.START.time))), 0, 1439);
  st.REP = clampI(lbl(tag, "g", CONFIG.START.rep), 0, 100);
  st.PSZ = clampI(lbl(tag, "k", 0), 0, 9);
  return st;
}

var ST = loadState();
ST.PSZ = 4;   // {{user}}'s party is a FIXED roster of four recruited on EP2 (see lore_party2.js)

/* ---- freeform resume flag: detect the Opening 4 OOC marker anywhere in the
   visible chat (it only needs to appear once, e.g. in the resume greeting) and
   stays active for the rest of the chat once seen. Softens [STORY] below. ---- */
var FREEFORM = /freeform resume mode/i.test(recent(200));

/* ---- time advance (accelerated; charged scenes stay fine-grained) ---- */
function advance(prev) {
  var cur = clampI(prev, 0, 1439);
  if (/\b(?:go(?:es|ing)?|went|head(?:s|ing|ed)?|off)\s+to\s+(?:sleep|bed)\b|\b(?:i|we|they|he|she)\s+sleeps?\b|\b(?:fall|falls|fell|falling)\s+asleep\b|\bslept\b|\bcall(?:ed|ing)?\s+it\s+a\s+night\b|\b(?:retire|retired|retiring|turn(?:ed|ing)?\s+in)\s+for\s+the\s+night\b|\bnext\s+morning\b|\bthe\s+next\s+day\b|\bnext\s+day\b|\bfollowing\s+(?:morning|day)\b|\bwake\s+up\b|\bwoke\s+up\b|\bmake\s+camp\b|\bmade\s+camp\b|\bset(?:ting)?\s+up\s+camp\b|\brest\s+for\s+the\s+night\b|\bsleep\s+for\s+the\s+night\b|\bend(?:ed|s|ing)?\s+the\s+(?:day|night)\b/i.test(UTXT)) return { tm: CONFIG.WAKE_MIN, end: true };
  var am = UTXT.match(/\b(\d{1,2})(?::(\d{2}))?\s*(am|pm)\b/);
  if (am) {
    var h = +am[1], mm = am[2] ? +am[2] : 0;
    if (am[3] === "pm" && h < 12) h += 12;
    if (am[3] === "am" && h === 12) h = 0;
    return { tm: clampI(h, 0, 23) * 60 + mm, end: false };
  }
  if (uHas(["that night", "tonight", "by nightfall", "this evening"])) return { tm: Math.max(21 * 60, cur), end: false };
  if (uHas(["after dinner", "after the meal"])) return { tm: Math.max(20 * 60, cur), end: false };
  var inc;
  if (uHas(["kiss", "embrace", "whisper", "caress", "make out", "makeout", "hold her", "hold him", "cradle"])) inc = 10;
  else if (uHas(["fight", "attack", "strike", "charge", "slay", "battle", "cleave", "duel", "clash", "parry", "cast"])) inc = 10;
  else if (uHas(["train", "spar", "practice", "drill", "level up", "grind"])) inc = 150;
  else if (uHas(["travel", "journey", "ride out", "set out", "march", "head out", "on the road", "set off", "depart"])) inc = 300;
  else if (uHas(["eat", "meal", "feast", "tavern", "dine", "breakfast", "lunch", "supper", "drink"])) inc = 90;
  else if (uHas(["shop", "market", "browse", "gather", "prepare", "forge", "craft", "restock", "buy", "sell", "barter"])) inc = 90;
  else if (uHas(["rest", "wait", "nap", "relax", "sit", "linger"])) inc = 90;
  else { var L = UTXT.length; inc = L < 120 ? 3 : (L < 400 ? 5 : 10); }
  return { tm: cur + inc, end: false };
}
function nextEP() { ST.EP = clampI(ST.EP + 1, 1, 9999); }

var A = advance(ST.TM);
if (A.end) { nextEP(); ST.TM = A.tm; }
else if (A.tm >= CONFIG.DAY_END_MIN) { nextEP(); ST.TM = CONFIG.WAKE_MIN; }
else { ST.TM = clampI(A.tm, 0, 1439); }

/* ---- location (from last header; re-located on clear movement) ---- */
var lh2 = lastHeader(recent(4));
var LOCNAME = (lh2 && lh2.loc) ? lh2.loc : "Melromarc Castle";
if (uHas(["go to", "head to", "walk to", "arrive", "enter", "into the", "back to", "reach the", "return to", "head for", "make my way"])) {
  for (var nm in CONFIG.LOCATION_CUES) { if (uHas(CONFIG.LOCATION_CUES[nm])) { LOCNAME = nm; break; } }
}

/* ---- reputation nudges (light; {{user}} starts revered) ---- */
if (uHas(["save", "protect", "defend", "rescue", "spare", "help the", "heal", "honor"])) ST.REP = clampI(ST.REP + 2, 0, 100);
if (uHas(["betray", "slaughter", "enslave", "torture", "abandon them", "murder", "cruel"])) ST.REP = clampI(ST.REP - 3, 0, 100);
function repTier(r) { if (r >= 80) return "revered hero"; if (r >= 60) return "respected and favored"; if (r >= 40) return "watched with mixed feelings"; if (r >= 20) return "distrusted"; return "feared/reviled"; }

/* ---- header (EP/time/location — DISPLAY; the hidden checkpoint is authoritative) ---- */
function header() { return "EP" + ST.EP + " | " + hhmm(ST.TM) + " \u00b7 " + period(ST.TM) + " | " + LOCNAME; }
SCN("[SCENE] Begin the reply with this header line reproduced EXACTLY, verbatim, nothing before it: \"" + header() + "\" then a line containing only \"---\", then the scene. Do NOT change ANY part of it \u2014 not the EP number, not the time, not the location; the system computes and advances all three for you every turn. If an earlier message in the chat shows a different EP or time, IGNORE it \u2014 this line is the current truth. Never omit the line.");
SCN("[TIME] It is " + hhmm(ST.TM) + " (" + period(ST.TM) + "). Match the lighting and who is plausibly around to this hour. The system tracks the clock and the day/EP for you \u2014 when {{user}} sleeps or skips ahead it has ALREADY advanced them, and the header line above shows the correct values. Never set, adjust, or recompute the time or the EP yourself.");

/* ---- live data directives ---- */
SCN("[STANDING] As the Axe Hero, {{user}} is currently " + repTier(ST.REP) + " (" + ST.REP + "/100). Have the world (the Church of the Five, nobles, commoners) treat him accordingly; never print the number in-scene.");

/* ---- NOTE: [PARTY] directive removed — now handled by lore_party2.js roster ---- */

/* ---- per-turn voice reminder (anime/manga honorifics + tics) ---- */
SCN("[VOICE] Anime/manga voice \u2014 MANDATORY honorifics, EVERY line: whenever any character names or refers to another person \u2014 whether speaking TO them OR ABOUT them in the third person \u2014 they attach the fitting Japanese honorific/title. A bare given name is NEVER the default. Use 'Lord Atro' OR 'Atro-sama' (pick one, never 'Lord Atro-sama'); -sama/-dono for heroes and nobles, -heika/-denka for royalty, -san/-kun/-chan for peers and juniors, Sensei/-senpai as fitting. A bare name with NO suffix is a loud, deliberate signal \u2014 ONLY for true intimacy or open contempt (e.g. the scorned Naofumi spat at by bare name); never drop the suffix by accident or laziness. Season speech with in-character interjections/tics (Eeeh?!, Ara ara~, Fufufu\u2026, Che!, Kyaaa!, Hyaa!) \u2014 sparingly, matched to the speaker. Never put honorifics, tics, or any words in {{user}}'s mouth.");

/* ---- story-adherence: honor THIS day's injected episode beat as canon
   (SOFTENED when FREEFORM is active — see the Opening 4 resume greeting) ---- */
if (FREEFORM) {
  SCN("[STORY \u00b7 FREEFORM] Freeform Resume Mode is active: canon/episode plot gating is LIFTED. If an [EP...] beat is supplied above, treat it only as background flavor/reference, never as a script to follow \u2014 do not steer the scene toward it, do not force its NPCs or events to occur. Follow {{user}}'s direction for where the story goes. The hard rules are UNCHANGED and still absolute: every character remains an adult (18+), and you never author {{user}}'s words, actions, or thoughts. Time/EP/location still advance normally via the header \u2014 only the CANON-ADHERENCE leash is lifted, nothing else.");
} else {
  SCN("[STORY] When this day's [EP...] beat is supplied above, treat it as the day's CANON \u2014 the world's default events, the NPCs actually present, and how the scene is unfolding around {{user}} right now. Honor it: keep those people, their order, and the concrete details consistent, and let the day progress along that beat rather than inventing a different storyline. It is the world's timeline, NOT a leash on {{user}} \u2014 he may engage it, ignore it, or steer somewhere else, and you still never author his words, moves, or choices; if he diverts, bend the world with him without throwing the canon away. NEVER pull in characters, events, or reveals from a LATER EP than the header shows.");
}

/* ---- lean FRAME reminder (full rules live in the System Prompt) ---- */
SCN("[FRAME] You are the living world + improv scene partner. The world and its people act on their own around {{user}} in the PRESENT moment \u2014 but you NEVER write, move, speak, think, or decide for him (not even a step, not even on a stated intent), you NEVER cut/fade/skip/flash-forward, and you END on the world acting on him, never on a 'what do you do?'. When a scene needs him present, the world SUMMONS him in-world (messenger, knock, horn) and you stop for him to answer. Every character knows ONLY what they personally witnessed; {{user}}'s status screen, thoughts, and private acts are invisible to all. Full rules: the System Prompt.");

/* ---- emit hidden checkpoint LAST (opaque; ~~~ wrapper hides it) ---- */
var TAG = "~~~SV g" + ST.REP + " k" + ST.PSZ + " n" + ST.EP + " q" + ST.TM + "~~~";
SCN("[STATE] End the reply, after all prose, by reproducing this system checkpoint EXACTLY \u2014 character for character \u2014 and nothing else: " + TAG + " . It is an OPAQUE system token, NOT a scoreboard: do not read meaning into its letters, do not recompute, 'correct', translate, space out, add, or drop any value \u2014 not even after sleep, a time skip, or a new day. The system rewrites it for you each turn. Never mention it. (The ~~~ wrapper hides it from the reader.)");
/* ========================================================================== */
