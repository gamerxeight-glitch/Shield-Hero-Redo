"use worker";
/* ============================================================================
 * lore_arcs.js — ARC SPINE lorebook (Five-Hero AU)
 * Season-by-season story spine, season-gated so future arcs never leak early.
 * Keyword-gated, priority + budget capped. Assign at Depth 1. Edit only LORE.
 * ========================================================================== */

/* ==============================  EDIT ONLY THIS  ========================== */
var LORE = [

  { keys:["name yourselves","just summoned","newly summoned","why were we summoned","why we were summoned","examine your status","check your status","repel one another","first day in this world","throne hall","what are the waves","what is the wave"], minS:1, pri:9,
    text:"[OPENING SEQUENCE — S1E1, play these beats in order as lived scene, never as an info-dump] After the five heroes have named themselves: (1) The king and court explain the summons — the recurring Waves of Calamity threaten to destroy this world, and the five Holy Heroes were called across worlds to repel them. (2) The heroes are told to open their STATUS — a game-like menu only each hero can see — and learn their Holy Weapon and its starting abilities. (3) Establish the core rule, as the court states it: the Holy Weapons repel one another by nature — a hero cannot wield, hold, or even draw near another hero's weapon, so the five can never combine forces and must EACH raise their own party. (4) The day is already spent; the king bids the heroes rest tonight and set out tomorrow, and promises to gather capable people from across the realm so each hero may choose companions and form a party. Keep {{user}} free to act throughout; never speak or decide for him." },

  { keys:["summoning","the betrayal","first wave","church coup","season 1","awakening arc"], minS:1, pri:7,
    text:"[Arc — Season 1] Five heroes are summoned. Naofumi is robbed and falsely accused (unaltered canon); as the despised Shield he buys Raphtalia, hatches Filo, and wins the commoners' goodwill. The other heroes flounder; the splinter Church of the Four escalates toward a coup. Mirellia returns, the High Priest falls, and Malty & Aultcray are disgraced. {{user}} (Axe) is courted by the favored camp throughout." },

  { keys:["cal mira","spirit tortoise","kyo arc","season 2","kizuna's world arc"], minS:2, pri:7,
    text:"[Arc — Season 2] Cal Mira training, then the other-world heroes' first strikes; the Guardian Beast Spirit Tortoise rampages under the rogue Kyo, crushing the other heroes' parties. Naofumi (and any allies) are cast into Kizuna's parallel world, free her, and kill Kyo — turning enemies into allies against the true cause of the Waves." },

  { keys:["q'ten lo arc","phoenix arc","village arc","season 3"], minS:3, pri:7,
    text:"[Arc — Season 3] Rebuilding the village of freed demi-humans; recruiting Atla, Fohl, Sadeena and more; the journey to Q'ten Lo and Raphtalia's royal heritage; the Phoenix Guardian battle and Atla's sacrifice; the Vanguard threat gathering toward Faubrey and Takt." },

  { keys:["vanguard arc","faubrey war","takt arc","final arc","the past arc","medea arc"], minS:4, pri:6,
    text:"[Arc — beyond] Takt's coup and the war on Melromarc; deeper Vanguard conflict across both worlds; the journey into the distant past (Mamorou and the origin of Siltvelt/Fitoria); and the march toward the true enemy behind the Waves, the deity Medea. Endgame guidelines — gate strictly to its season." }

];

var CONFIG = { MAX_ENTRIES: 2, BUDGET: 2000, SCAN_DEPTH: 6 };
/* ========================================================================== */


/* ===========================  ENGINE — LEAVE ALONE  ======================= */
context.character = context.character || {};
context.character.scenario = context.character.scenario || "";
var _c = context.chat || {};
var SCAN = (((_c.last_messages || []).slice(-CONFIG.SCAN_DEPTH)
    .map(function (m) { return (m && m.message) ? m.message : ""; }).join(" "))
    + " " + (_c.last_message || "")).toLowerCase();
var _sm = SCAN.match(/s(\d{1,2})\s*[\u00b7.\-|]\s*ep/i) || SCAN.match(/season\s*(\d{1,2})/i);
var SEASON = _sm ? parseInt(_sm[1], 10) : 1;
function _mentions(keys){var n=0;for(var i=0;i<keys.length;i++){var k=keys[i];if(!k)continue;var idx=SCAN.indexOf(k);while(idx>=0){n++;idx=SCAN.indexOf(k,idx+k.length);}}return n;}
var hits = [];
LORE.forEach(function (e) {
  if (!e || !e.text) return;
  if (e.minS && SEASON < e.minS) return;
  var keys = (e.keys || []).map(function (k) { return String(k).toLowerCase(); });
  if (_mentions(keys) <= 0) return;
  hits.push({ e: e, pri: e.pri || 5 });
});
hits.sort(function (a, b) { return b.pri - a.pri; });
var used = 0, count = 0;
hits.forEach(function (h) {
  if (count >= CONFIG.MAX_ENTRIES) return;
  var body = h.e.text;
  if (used + body.length > CONFIG.BUDGET) return;
  context.character.scenario += " " + body;
  used += body.length; count++;
});
/* ========================================================================== */
