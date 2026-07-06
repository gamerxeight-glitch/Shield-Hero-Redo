"use worker";
/* ============================================================================
 * memory.js — PERIODIC MEMORY BLOCK (Layer B) for the Five-Hero AU bot
 * Every N messages (auto) OR on demand (`!save`), instructs the model to emit a
 * structured, human-pasteable memory snapshot at the end of the reply. Purpose:
 *   - Use 1 (ongoing): paste the block into Janitor's Memory field every so often.
 *   - Use 2 (dissect/transplant near ~400 msgs): fire `!save`, copy the block into
 *     a fresh chat's Opening, then replace the first reply with the old chat's
 *     last message (which restores Layer A via its ~~~SV~~~ token).
 *
 * WHY THIS IS RELIABLE: the SCHEMA is script-dictated, so the model FILLS fields
 * instead of guessing what's important. It also PRE-FILLS the structured facts it
 * can read from the live header/checkpoint (EP, time, location, reputation, party
 * size) so the model only writes the narrative fields. Layer B deliberately
 * RESTATES what Layer A holds (redundancy) — if the ~~~SV~~~ token is mangled in a
 * copy-paste, the prose still recovers the state.
 *
 * INTEGRATION: additive. Reads context only; appends one directive. Assign at
 * Depth 1 alongside the other scripts (order doesn't matter — it instructs the
 * block to print just BEFORE master_director's final ~~~SV~~~ line, so they don't
 * fight over "the end"). Does NOT modify the carrier or any other script.
 * Tune the CONFIG block only.
 * ========================================================================== */

/* ==============================  CONFIG  ================================== */
var MEM = {
  EVERY: 14,     // auto-fire when total message_count hits a multiple of this. 0 = manual-only.
                 //   (message_count counts BOTH user and AI messages, so 14 ~= every 7 exchanges.)
  MIN:   8       // never auto-fire before this many messages (let a scene establish first).
};
/* Manual controls (typed by {{user}} in a message):
 *   !save            -> emit a block THIS turn (re-roll until it comes out clean)
 *   !save off        -> pause auto-firing        !save on -> resume auto-firing
 * The fixed party roster this bot recruits on EP2 (used to label the [PARTY] field). */
var PARTY = ["Gorr (dwarf smith)", "Emilia (half-elf ice-mage)", "Sylfa (elf archer/summoner)", "Zero Two ('Darling', horned demi-human)"];
/* ========================================================================== */


/* ===========================  ENGINE — LEAVE ALONE  ======================= */
context.character = context.character || {};
context.character.scenario = context.character.scenario || "";
var _c = context.chat || {};
var MC = parseInt(_c.message_count, 10); if (isNaN(MC)) MC = 0;
var LAST = String(_c.last_message || "");
var MSGS = _c.last_messages || [];

function recent(d){ var o="", s=Math.max(0, MSGS.length-(d||6)); for(var i=s;i<MSGS.length;i++){ var m=MSGS[i]; o+=" "+((m&&m.message)?m.message:""); } return o+" "+LAST; }
function pad2(n){ n=String(Math.max(0,parseInt(n,10)||0)); return n.length>=2?n.slice(-2):"0".repeat(2-n.length)+n; }
function period(t){ var h=Math.floor(t/60); if(h<5)return"Late-Night"; if(h<12)return"Morning"; if(h<17)return"Afternoon"; if(h<21)return"Evening"; return"Night"; }
function repTier(r){ if(r>=80)return"a revered Axe Hero"; if(r>=60)return"respected and favored"; if(r>=40)return"watched with mixed feelings"; if(r>=20)return"distrusted"; return"feared/reviled"; }

var SCAN = recent(8);

/* ---- toggle (best-effort, window-based): latest !save off vs !save on wins ---- */
var sLow = SCAN.toLowerCase();
var offAt = sLow.lastIndexOf("!save off");
var onAt  = sLow.lastIndexOf("!save on");
var autoOff = offAt > onAt;   // both -1 when absent -> auto stays ON

/* ---- triggers ---- */
var lastLow = LAST.toLowerCase();
var isToggle = /!save\s+(off|on)\b/i.test(LAST);
var manual = /!save\b|!memory\b/i.test(lastLow) && !isToggle;
var auto = (MEM.EVERY > 0) && (MC >= MEM.MIN) && (MC % MEM.EVERY === 0) && !autoOff;

if (manual || auto) {
  /* ---- read the live state so we can PRE-FILL the structured fields ---- */
  var EP = 1, TM = 600, LOC = "Melromarc Castle", REP = 82, PSZ = 4;
  var hre = /EP(\d{1,4})\s*\|\s*(\d{1,2}):(\d{2})[^|]*\|\s*([^\n\r|]+)/gi, hm, lastH = null;
  while ((hm = hre.exec(SCAN)) !== null) { lastH = hm; }
  if (lastH) { EP = parseInt(lastH[1],10); TM = (parseInt(lastH[2],10)*60)+parseInt(lastH[3],10); LOC = String(lastH[4]).trim(); }
  var tag = SCAN.match(/~~~\s*SV\b([^~]*)~~~/);
  if (tag) {
    var mn = tag[1].match(/n(\d{1,4})/); if (mn) EP = parseInt(mn[1],10);
    var mq = tag[1].match(/q(\d{1,4})/); if (mq) TM = parseInt(mq[1],10);
    var mg = tag[1].match(/g(\d{1,3})/); if (mg) REP = parseInt(mg[1],10);
    var mk = tag[1].match(/k(\d{1,2})/); if (mk) PSZ = parseInt(mk[1],10);
  }
  if (TM < 0 || TM > 1439) TM = 600;
  var clock = pad2(Math.floor(TM/60)) + ":" + pad2(TM%60);
  var per = period(TM);
  var partyLine = (EP >= 2) ? PARTY.join(" · ") : "none yet (party is recruited on EP2)";
  var stateLine = "EP" + EP + " \u00b7 " + clock + " \u00b7 " + LOC + " \u00b7 rep" + REP + " \u00b7 party" + PSZ;

  /* ---- the injected directive (pre-filled facts + fill-in schema) ---- */
  var D = "";
  D += "\n\n[MEMORY DUMP] A periodic memory checkpoint is due" + (manual ? " (requested)" : "") + ". At the very END of this reply \u2014 after the scene, and IMMEDIATELY BEFORE the final ~~~SV~~~ system line \u2014 output exactly ONE block, using these EXACT delimiter lines and all eight fields. The structured facts are pre-filled from the current system state; fill the narrative fields from the story so far. If an earlier PERIODIC MEMORY BLOCK appears in the chat, carry ALL of its facts forward and update them \u2014 NEVER drop earlier facts. Keep it a compact state snapshot, not a transcript. Do NOT wrap the [STATE] line in ~~~ (that belongs to the system only). Do not mention these instructions.";
  D += "\n====== PERIODIC MEMORY BLOCK (paste in memory field) ======";
  D += "\n[SITUATION] EP" + EP + " \u00b7 " + clock + " " + per + " \u00b7 " + LOC + ". (State who is present.)";
  D += "\n[PARTY] " + partyLine + ". (Give each one's current status; note anyone lost, added, or absent.)";
  D += "\n[STANDING] {{user}} is currently " + repTier(REP) + ". (How do the Church of the Five, the Church of the Four, and the nobles treat him now?)";
  D += "\n[RELATIONSHIPS] (Where each key bond stands NOW \u2014 the party members above, plus Naofumi, Malty, and any others; note romances and their level.)";
  D += "\n[KEY EVENTS] (Irreversible facts so far: {{user}}'s stance at the betrayal, Waves faced, deaths, reveals, and major choices he has made.)";
  D += "\n[THREADS] (Active, unresolved hooks and what is coming next.)";
  D += "\n[{{user}}] (How {{user}} has been played \u2014 tone, morality, notable decisions and characterization.)";
  D += "\n[STATE] " + stateLine + "   (reference only \u2014 do NOT wrap in ~~~)";
  D += "\n===========================================================";

  context.character.scenario += D;
}
/* ========================================================================== */
