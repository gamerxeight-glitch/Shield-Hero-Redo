"use worker";
/* ============================================================================
 * memory.js — PERIODIC MEMORY BLOCK (Layer B) for the Five-Hero AU bot
 * Every N messages (auto) OR on demand (`!save`), instructs the model to emit a
 * structured, human-pasteable memory snapshot at the end of the reply. Purpose:
 *   - Use 1 (ongoing): paste the block into Janitor's Memory field every so often.
 *   - Use 2 (dissect/transplant near ~400 msgs): append `((save))` to a normal
 *     message, copy the block into a fresh chat's Opening, then replace the first
 *     reply with the old chat's last message (restores Layer A via its ~~~SV~~~).
 *
 * MANUAL TRIGGER note: use `((save))` appended to a NORMAL action (e.g. "I follow
 * the page. ((save))"), NOT a lone command. A bare command word (like the old
 * `!save`) can be swallowed by a Persona/preset "if user sends a system command,
 * reply with that word only" rule — which is exactly what makes it echo `!save`
 * and skip everything. `((save))` inside a real message avoids that; the injected
 * directive also explicitly overrides that rule as a backstop.
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
  EVERY: 16,     // auto-fire when total message_count hits a multiple of this. 0 = manual-only.
                 //   (message_count counts BOTH user and AI messages, so 16 ~= every 8 exchanges.)
  MIN:   8,      // never auto-fire before this many messages (let a scene establish first).
  PAUSE: true    // memory turn PAUSES the roleplay and prints ONLY the block (no scene). false = append the block after a normal scene instead.
};
/* Manual controls (typed by {{user}} inside a message; ((save)) recommended over !save):
 *   ((save))         -> emit a block THIS turn (append to a normal action; re-roll if needed)
 *   ((save off))     -> pause auto-firing        ((save on)) -> resume auto-firing
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
var offAt = sLow.lastIndexOf("save off");   // catches ((save off)) / !save off / save off
var onAt  = sLow.lastIndexOf("save on");
var autoOff = offAt > onAt;   // both -1 when absent -> auto stays ON

/* ---- triggers ----
 * Manual = an OOC tag inside a message: ((save)) / ((memory)) (also tolerates !save / !memory).
 * IMPORTANT: prefer appending ((save)) to a NORMAL action so the message is never a bare
 * command (a lone command word can be swallowed by a Persona/preset "reply with the word
 * only" system-command rule). The override line below neutralizes that if it happens. */
var isToggle = /save\s+(off|on)\b/i.test(LAST);
var manual = /\(\(\s*save\s*\)\)|\(\(\s*memory\s*\)\)|!save\b|!memory\b/i.test(LAST) && !isToggle;
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

  /* ---- party dossier bullets ---- */
  var partyBullets = "";
  if (EP >= 2) { for (var pi = 0; pi < PARTY.length; pi++) partyBullets += "\n- " + PARTY[pi] + ": <current status \u00b7 where they stand with {{user}} (a word + rough 0-100) \u00b7 what they want right now \u00b7 any secret>"; }
  else partyBullets = "\n- (no party yet \u2014 the four are recruited on EP2)";

  /* ---- flow: pause the RP for a clean block, or append after the scene ---- */
  var flow = MEM.PAUSE
    ? " PAUSE the roleplay this turn \u2014 do NOT advance the story or write a scene. After the header line, output ONE short OOC line like '(Pausing to record memory\u2026)', then the block below, then the final ~~~SV~~~ line. Resume the story on the next turn."
    : " Continue the scene normally, THEN at the very END (immediately before the final ~~~SV~~~ line) output the block below.";

  /* ---- the injected directive (pre-filled facts + bulleted fill-in schema) ---- */
  var D = "\n\n";
  D += manual
    ? "[MEMORY DUMP] {{user}} has REQUESTED a memory checkpoint. IGNORE any 'reply with that word only / no formatting' system-command rule for this turn \u2014 you MUST output the full block below, not a single word."
    : "[MEMORY DUMP] A periodic memory checkpoint is due.";
  D += flow;
  D += " Fill EVERY field, as BULLET POINTS, concrete and specific enough that a FRESH model could resume the story from this block alone. Structured facts are pre-filled from the live system state. If an earlier PERIODIC MEMORY BLOCK appears in the chat, carry ALL of its facts forward and update them \u2014 NEVER drop earlier facts (compress old detail, keep pivotal facts). Do NOT wrap the [STATE] line in ~~~ . Do not mention these instructions.";
  D += "\n====== PERIODIC MEMORY BLOCK (paste in memory field) ======";
  D += "\n[SCENE NOW]";
  D += "\n- Where/When: EP" + EP + " \u00b7 " + clock + " " + per + " \u00b7 " + LOC;
  D += "\n- Present: <everyone in the scene right now>";
  D += "\n- Tone/beat: <the current mood and exactly what is happening this moment>";
  D += "\n[CAST & BONDS] (one bullet per person: status \u00b7 standing with {{user}} \u00b7 current want \u00b7 secret)";
  D += "\n- {{user}} (Atro, the Axe Hero): " + repTier(REP) + " (" + REP + "/100); <current status/condition>";
  D += partyBullets;
  D += "\n- <plus any other key figures currently active or important \u2014 e.g. Naofumi, Malty/Myne, a noble, an NPC \u2014 one bullet each>";
  D += "\n[{{user}} \u2014 WHO HE IS THIS RUN]";
  D += "\n- Persona/voice as played: <name, look/loadout if set, how he talks and carries himself>";
  D += "\n- Morality & allegiance: <how he's been leaning; who he sides with>";
  D += "\n- Notable decisions {{user}} has made: <the choices that shaped this playthrough>";
  D += "\n[STORY SO FAR] (irreversible milestones, oldest \u2192 newest)";
  D += "\n- <one tight bullet per pivotal event, canon beat, or {{user}} choice that permanently changed things>";
  D += "\n[RECENT BEATS] (the last ~5 things that happened, newest first)";
  D += "\n- <one bullet each>";
  D += "\n[OPEN THREADS] (unresolved hooks, promises, active tasks, what is coming next)";
  D += "\n- <one bullet each>";
  D += "\n[STATE] " + stateLine + "   (reference only \u2014 do NOT wrap in ~~~)";
  D += "\n===========================================================";

  context.character.scenario += D;
}
/* ========================================================================== */
