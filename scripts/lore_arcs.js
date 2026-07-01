"use worker";
/* ============================================================================
 * lore_arcs.js — ARC SPINE + key scripted beats (Five-Hero AU)
 * Accurate canon arc summaries (paraphrased) so the AI runs the early plot
 * correctly and downstream arcs stay on the rails. Season-gated, keyword-gated,
 * priority + budget capped. Assign at Depth 1. Edit only the LORE array.
 * ========================================================================== */

/* ==============================  EDIT ONLY THIS  ========================== */
var LORE = [

  /* ---- Day 1: the summoning audience ---- */
  { keys:["name yourselves","just summoned","newly summoned","why were we summoned","why we were summoned","examine your status","check your status","repel one another","what are the waves","what is the wave"], minS:1, pri:9,
    text:"[OPENING — S1E1, Day 1, play as lived scene, no info-dump] After the five heroes name themselves: (1) The king/court explain the summons — the recurring Waves of Calamity threaten to destroy this world, and the five Holy Heroes were called to repel them. (2) The heroes open their STATUS (a game-like menu only each can see) and learn their Holy Weapon and starting abilities. (3) The court states the core rule: the Holy Weapons repel one another by nature — a hero cannot wield, hold, or approach another's weapon, so the five can never combine and must EACH raise their own party. (4) Each hero is granted an initial war-chest and a monthly stipend of roughly 800-1000 silver coins. (5) The day is spent: the king bids them rest tonight and set out tomorrow, and will gather capable people so each hero may recruit a party. Keep {{user}} free to act." },

  /* ---- Day 2 night / Day 3 morning: the (fixed-canon) betrayal of Naofumi ---- */
  { keys:["party recruitment","recruit a party","volunteers","choose a hero","choose their hero","no one joined","inn","quarters","drinks","got him drunk","robbed","stolen","false accusation","accused","accusation","rape","assault","kangaroo court","summoned to court","royal summons","day 2 night","day 3","second day","the next morning","myne"], minS:1, pri:9,
    text:"[BETRAYAL SEQUENCE — S1; the betrayal is DAY 2 NIGHT, the court is DAY 3 MORNING; fixed canon, happens regardless of {{user}}] DAY 2 (recruitment): the crown presents adventurers, soldiers and mercenaries, and each volunteer CHOOSES the hero they want to follow on their own — none are assigned. They flock to the celebrated heroes; NOT ONE chooses the despised Shield. The red-haired 'Myne Sophia' (secretly first princess Malty in disguise) first attaches herself to Motoyasu's (Spear) party. For {{user}} (Axe): like the other favored heroes, volunteers flock to him — a varied pool of adventurers, soldiers, mercenaries and mages of any race, gender and class. The number who ultimately join settles at the party size the Director provides (see [PARTY]); present candidates and let {{user}} choose who joins, never assigning or finalizing his party for him. When recruitment ends with NO ONE for Naofumi, Myne abruptly leaves Motoyasu and 'pities' her way into the Shield's empty party instead. DAY 2 NIGHT (the betrayal): that evening Myne comes to Naofumi's inn quarters, talks and drinks with him late; once he is asleep she takes his coin and equipment and slips away. DAY 3 MORNING: Naofumi wakes stripped of everything; meanwhile Myne has run to Motoyasu and the court accusing Naofumi of attempting to rape her. The crown summons EVERY hero to the throne hall at once — wherever {{user}} is, a royal messenger/summons reaches him to appear immediately (narrate the call arriving; never move or speak for {{user}}, let him answer it). Once {{user}} is present, the kangaroo court convenes: Naofumi is condemned on Myne's word alone, Motoyasu and the court turn on him, his name is ruined. Afterward only the blacksmith Erhard treats him fairly; unable to recruit anyone, Naofumi buys the demi-human Raphtalia to serve as his sword. NOTE: {{user}}'s presence does not change these events." },

  /* ---- Season arcs (spine) ---- */
  { keys:["season 1","awakening arc","first wave","church coup","high priest","mirellia returns"], minS:1, pri:7,
    text:"[Arc — Season 1: Awakening] After the Day-3 betrayal, the scorned Naofumi rebuilds with Raphtalia, proving himself fighting the Waves and aiding commoners while the other heroes blunder; he hatches the filolial Filo. The splinter Church of the Four escalates — framing Naofumi over Princess Melty, then attempting a coup with its High Priest declaring himself a god. Queen Mirellia returns, the High Priest falls, the Church is outlawed, and Malty & King Aultcray are disgraced (renamed 'Bitch' and 'Trash'). {{user}} (Axe) lives this season as one of the favored four, free to side with or against any of it." },

  { keys:["cal mira","spirit tortoise","kyo","kizuna's world arc","season 2","other world heroes"], minS:2, pri:7,
    text:"[Arc — Season 2] The Cal Mira activation islands (rapid training/leveling), where the other-world heroes (Glass, and L'Arc & Therese in disguise) test themselves against Naofumi. The Guardian Beast Spirit Tortoise then awakens and rampages — secretly hijacked by the rogue scholar Kyo to harvest souls — crushing the other heroes' parties (pushing them toward their cursed weapons). With the Tortoise's familiar Ost, Naofumi's side destroys it, but Kyo flees with the stolen energy into the parallel world. Naofumi is dragged after him, frees the trapped Hunting Hero Kizuna, turns former enemies into allies, and kills Kyo." },

  { keys:["q'ten lo arc","phoenix arc","village arc","season 3","reform","siltvelt"], minS:3, pri:7,
    text:"[Arc — Season 3] Pardoned at home, Naofumi rebuilds a village of freed demi-humans (recruiting Atla, Fohl, Sadeena and others) and reforms Melromarc's treatment of demi-humans. The party voyages to isolationist Q'ten Lo, uncovers Raphtalia's royal heritage, and topples its corrupt regime. The Guardian Beast Phoenix is faced (Atla's sacrifice). Behind it all the Vanguards of the Waves — and the traitor Takt of Faubrey — begin moving toward open war." },

  { keys:["vanguard arc","faubrey war","takt arc","final arc","the past arc","medea arc"], minS:4, pri:6,
    text:"[Arc — beyond] Takt's coup and war on Melromarc; deeper Vanguard conflict across both worlds; the journey into the distant past (Mamorou and the origin of Siltvelt/Fitoria); and the march toward the true enemy behind the Waves, the deity Medea. Endgame guidelines — gate strictly to its season." }

];

var CONFIG = { MAX_ENTRIES: 2, BUDGET: 2800, SCAN_DEPTH: 4 };
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
