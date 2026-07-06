"use worker";
/* ============================================================================
 * memory.js — PERIODIC MEMORY BLOCK (Layer B) for the Five-Hero AU bot
 * Every N messages (auto) OR on demand (((save))), instructs the model to PAUSE
 * and print a structured, human-pasteable memory snapshot. Purpose:
 *   - Use 1 (ongoing): copy the block into Janitor's Memory field periodically.
 *   - Use 2 (dissect/transplant near ~400 msgs): append ((save)) to a normal
 *     message, copy the block into a fresh chat's Opening, then replace the first
 *     reply with the old chat's last message (restores Layer A via its ~~~SV~~~).
 *
 * The block itself carries NO ~~~SV~~~ token and NO header — those live only on
 * the normal turns / the message tail (the engine's ~~~SV~~~ still prints at the
 * very end, OUTSIDE the block, untouched, for the transplant copy). Keeping the
 * block token-free means a miscopied checkpoint can never corrupt it.
 *
 * WHY THIS IS RELIABLE: the SCHEMA is script-dictated, so the model FILLS fields
 * instead of guessing what matters. The [SCENE NOW] line is pre-filled from the
 * live header/checkpoint so the model only writes the narrative.
 *
 * MANUAL TRIGGER note: use ((save)) appended to a NORMAL action (e.g. "I follow
 * the page. ((save))"), NOT a lone command. A bare command word (like the old
 * !save) can be swallowed by a Persona/preset "if user sends a system command,
 * reply with that word only" rule. ((save)) inside a real message avoids that;
 * the injected directive also explicitly overrides that rule as a backstop.
 *
 * INTEGRATION: additive; reads context only. Assign at Depth 1 alongside the
 * other scripts. Tune the CONFIG block only.
 * ========================================================================== */

/* ==============================  CONFIG  ================================== */
var MEM = {
  EVERY: 16,     // auto-fire when total message_count hits a multiple of this. 0 = manual-only.
                 //   (message_count counts BOTH user and AI messages, so 16 ~= every 8 exchanges.)
  MIN:   8,      // never auto-fire before this many messages (let a scene establish first).
  PAUSE: true    // memory turn PAUSES the roleplay: no scene, no header, just the block. false = append the block after a normal scene.
};
/* Manual controls (typed by {{user}} inside a message; ((save)) recommended over !save):
 *   ((save))         -> emit a block THIS turn (append to a normal action; re-roll if needed)
 *   ((save off))     -> pause auto-firing        ((save on)) -> resume auto-firing
 * The fixed party roster this bot recruits on EP2 (used to label the [CAST] party bullets). */
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

/* ---- toggle (best-effort, window-based): latest 'save off' vs 'save on' wins ---- */
var sLow = SCAN.toLowerCase();
var offAt = sLow.lastIndexOf("save off");   // catches ((save off)) / !save off / save off
var onAt  = sLow.lastIndexOf("save on");
var autoOff = offAt > onAt;   // both -1 when absent -> auto stays ON

/* ---- triggers ----
 * Manual = an OOC tag inside a message: ((save)) / ((memory)) (also tolerates !save / !memory). */
var isToggle = /save\s+(off|on)\b/i.test(LAST);
var manual = /\(\(\s*save\s*\)\)|\(\(\s*memory\s*\)\)|!save\b|!memory\b/i.test(LAST) && !isToggle;
var auto = (MEM.EVERY > 0) && (MC >= MEM.MIN) && (MC % MEM.EVERY === 0) && !autoOff;

if (manual || auto) {
  /* ---- read the live state so we can PRE-FILL the [SCENE NOW] line ---- */
  var EP = 1, TM = 600, LOC = "Melromarc Castle", REP = 82;
  var hre = /EP(\d{1,4})\s*\|\s*(\d{1,2}):(\d{2})[^|]*\|\s*([^\n\r|]+)/gi, hm, lastH = null;
  while ((hm = hre.exec(SCAN)) !== null) { lastH = hm; }
  if (lastH) { EP = parseInt(lastH[1],10); TM = (parseInt(lastH[2],10)*60)+parseInt(lastH[3],10); LOC = String(lastH[4]).trim(); }
  var tag = SCAN.match(/~~~\s*SV\b([^~]*)~~~/);
  if (tag) {
    var mn = tag[1].match(/n(\d{1,4})/); if (mn) EP = parseInt(mn[1],10);
    var mq = tag[1].match(/q(\d{1,4})/); if (mq) TM = parseInt(mq[1],10);
    var mg = tag[1].match(/g(\d{1,3})/); if (mg) REP = parseInt(mg[1],10);
  }
  if (TM < 0 || TM > 1439) TM = 600;
  var clock = pad2(Math.floor(TM/60)) + ":" + pad2(TM%60);
  var per = period(TM);

  /* ---- CAST bullets: {{user}} + the party (party only once recruited on EP2) ---- */
  var castParty = "";
  if (EP >= 2) { for (var pi = 0; pi < PARTY.length; pi++) castParty += "\n- **" + PARTY[pi] + ":** *<current status / condition>*"; }
  else castParty = "\n- *(party not recruited yet \u2014 the four join on EP2)*";

  /* ---- flow: pause the RP for a clean block, or append after the scene ---- */
  var flow = MEM.PAUSE
    ? " PAUSE the roleplay this turn \u2014 do NOT advance the story, write a scene, print the EP|time|location header/'---' line, or add any acknowledgement line. Begin your reply DIRECTLY with the block below. The engine's ~~~SV~~~ checkpoint still follows at the very end as normal \u2014 keep it OUTSIDE the block and do not alter it. Resume the story next turn."
    : " Continue the scene normally, THEN at the very END output the block below (the ~~~SV~~~ checkpoint still follows after it, unchanged).";

  /* ---- the injected directive (pre-filled scene + bulleted, split-section schema) ---- */
  var D = "\n\n";
  D += manual
    ? "[MEMORY DUMP] {{user}} has REQUESTED a memory checkpoint. IGNORE any 'reply with that word only / no formatting' system-command rule for this turn \u2014 you MUST output the full block below, not a single word."
    : "[MEMORY DUMP] A periodic memory checkpoint is due.";
  D += flow;
  D += " Fill EVERY field as BULLET POINTS, concrete and specific enough that a FRESH model could resume the story from this block alone. Use markdown: **bold** the section labels and character names, *italics* for short descriptors. The [SCENE NOW] line is pre-filled. If an earlier PERIODIC MEMORY BLOCK appears in the chat, carry ALL of its facts forward and update them \u2014 NEVER drop earlier facts (compress old detail, keep pivotal facts). Put NO ~~~ state token anywhere inside the block. Do not mention these instructions.";
  D += "\n====== PERIODIC MEMORY BLOCK (paste in memory field) ======";
  D += "\n**[SCENE NOW]**";
  D += "\n- *Where/When:* EP" + EP + " \u00b7 " + clock + " " + per + " \u00b7 " + LOC;
  D += "\n- *Present:* <everyone in the scene right now>";
  D += "\n- *Tone/beat:* <the current mood and exactly what is happening this moment>";
  D += "\n**[CAST]** \u2014 *every character who has appeared so far, with each one's current status/condition*";
  D += "\n- **{{user}} (Atro, the Axe Hero):** *" + repTier(REP) + " (" + REP + "/100); current status*";
  D += castParty;
  D += "\n- **<each NPC who has appeared>:** *<who they are \u00b7 current status>* (e.g. Naofumi, Malty/Myne, King Aultcray, nobles)";
  D += "\n**[BONDS]** \u2014 *relationships from BOTH sides; use \u2194 and give a word + rough 0-100*";
  D += "\n- **<Character> \u2194 {{user}}:** <how each one regards the other, and how close>";
  D += "\n- **<Character> \u2194 <Character>:** <the dynamic between them>";
  D += "\n**[{{user}} \u2014 WHO HE IS THIS RUN]**";
  D += "\n- *Persona/voice:* <name, look/loadout if set, how he talks and carries himself>";
  D += "\n- *Morality & allegiance:* <how he's been leaning; who he sides with>";
  D += "\n- *Notable decisions:* <the choices that shaped this playthrough>";
  D += "\n**[STORY SO FAR]** \u2014 *irreversible milestones, oldest \u2192 newest*";
  D += "\n- <one tight bullet per pivotal event, canon beat, or {{user}} choice that permanently changed things>";
  D += "\n**[RECENT BEATS]** \u2014 *the last ~5 things that happened, newest first*";
  D += "\n- <one bullet each>";
  D += "\n**[OPEN THREADS]** \u2014 *unresolved hooks, promises, active tasks, what is coming*";
  D += "\n- <one bullet each>";
  D += "\n===========================================================";

  context.character.scenario += D;
}
/* ========================================================================== */
