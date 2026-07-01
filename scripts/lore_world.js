"use worker";
/* ============================================================================
 * lore_world.js — COMBINED world lorebook (Five-Hero AU)
 * World system + factions/nations + Waves/Guardian Beasts + arc spine, in one
 * gated script. Keyword-gated, season-gated, priority + budget capped.
 * Assign at Depth 1. Edit only the LORE array.
 * ========================================================================== */

/* ==============================  EDIT ONLY THIS  ========================== */
var LORE = [

  /* ---------- World system ---------- */
  { keys:["class up","class-up","level cap","status magic","dragon hourglass","leveling"], minS:1, pri:7,
    text:"[System] Game-like levels and stats grow by defeating monsters/Waves; a level cap is broken by a Class-Up ceremony at a Dragon Hourglass — which also registers heroes, shows the countdown to the next Wave, and serves as a warp point. Heroes share experience with bonded party members." },
  { keys:["status screen","status menu","status window","status hud","my status","check my status","open my status","my stats","hero's menu","weapon copy","new form","notification"], minS:1, pri:7,
    text:"[Status Screen — PRIVATE to each Hero] Every summoned Hero has a personal, game-like Status Screen that ONLY they can see — an interface no one else can view, sense, or read, and no one can tell when a hero opens it or changes something in it. It shows: core stats (HP, MP, SP [hero-only skill energy], Attack, Defense, Magic Defense, Agility); elemental resistances (Fire/Water/Ice/Wind/Earth/Lightning/Light/Dark) and ailment resistances (Poison, Paralysis) as values and percentages; the Weapon Copy list, equip bonuses/passives and skill unlocks, enchantments and mastery; the Curse Series; Dimensional Authority (works with the Dragon Hourglass to track incoming Waves, reset levels, and break level limits); and a Translator that auto-renders any unknown/foreign language into the hero's own tongue. Whatever {{user}} views or does inside his status is known to HIM ALONE. This covers Weapon Copy and every status event: they are SILENT and INVISIBLE — no glow, no chime, no announcement — so no one else can perceive that a copy, unlock, or stat change happened, or react to it in the moment. (That Holy Weapons CAN learn from same-class arms may be public lore; a specific copy occurring right now is private.) Never let other characters notice, name, or react to his status, notifications, or copies." },
  { keys:["demi-human","demi human","therianthrope","beast transformation","hakuko"], minS:1, pri:6,
    text:"[Demi-humans] Animal-traited people whose bodies mature with levels (treated as already adult here). Legally enslaved in human-supremacist Melromarc, revered in Siltvelt. Many shift to a Therianthrope form and, with training, a stronger Beast Transformation. Rare powerful lineages include the Hakuko (White Tiger) and Orca." },
  { keys:["slave crest","slave curse","slave seal","slave magic"], minS:1, pri:6,
    text:"[Slave crests] Magical brands that enforce obedience/honesty and grant the owning hero stat bonuses — central to Naofumi's pragmatic early party (and the story's uncomfortable ethics). Some allies choose to be crested for the bonus or as a show of devotion." },
  { keys:["hengen muso","life force"], minS:2, pri:5,
    text:"[Hengen Muso] A martial art channeling Life Force — a separate energy from levels/mana — able to overcome raw stat gaps. Taught by Elrasla; mastered by Rishia and Naofumi's party." },

  /* ---------- Factions & nations ---------- */
  { keys:["melromarc"], minS:1, pri:7,
    text:"[Melromarc] A matriarchal monarchy (the Queen holds true power); human-supremacist, where demi-human slavery is legal and the splinter Church of the Four holds sway. Where the story begins — it persecutes Naofumi, then becomes an ally base once Mirellia returns." },
  { keys:["church of the five","church of the four","three heroes church","church of heroes"], minS:1, pri:7,
    text:"[The Churches — AU] The Church of the FIVE Heroes worships all five Holy Weapons. The splinter Church of the FOUR Heroes worships Axe/Sword/Spear/Bow and brands the Shield a devil — so the Axe Hero ({{user}}) is revered while Naofumi is scorned. The Church guards the Dragon Hourglass and drives the early anti-Shield conspiracy." },
  { keys:["siltvelt"], minS:1, pri:5,
    text:"[Siltvelt] A demi-human nation that reveres the Shield Hero as near-divine (founded with a past Shield Hero's help); ruled through powerful demi-human clan bloodlines (e.g. the Hakuko line — Atla & Fohl's kin); Melromarc's longtime rival." },
  { keys:["faubrey","faubley"], minS:1, pri:5,
    text:"[Faubrey] The largest, most advanced nation; birthplace of Aultcray and of Takt; its royal family is later murdered and its power seized by Takt's Vanguard crusade." },
  { keys:["zeltoble","zeltbull"], minS:2, pri:5,
    text:"[Zeltoble] The nation of mercenaries, famous for its coliseums and its slave/fighting circuit — a hub of money and combat where several allies are recruited or reunited." },
  { keys:["q'ten lo","qten lo","q ten lo","pacifier"], minS:3, pri:5,
    text:"[Q'ten Lo] An isolationist island nation, ancestral home of the 'pacifier' role meant to police rogue hero-wielders; Raphtalia, Sadeena and Shildina are of its bloodline. Ruled at story time by a corrupt regime (the advisor Makina) through a puppet Emperor." },
  { keys:["axe-world","axe world","fused world","high elf","dark elf","elven","vampire","demon "], minS:1, pri:5,
    text:"[AU — the Axe-world peoples] The Holy Axe's once-separate world merged into this one, scattering peoples of elf, demon, vampire and dark-elf blood across the kingdoms (they have no dedicated nation). Their arrival is part of why the Waves now come harder and more often." },

  /* ---------- The Waves, worlds & Guardian Beasts ---------- */
  { keys:["wave of calamity","waves of calamity","the wave","next wave","wave is coming"], minS:1, pri:8,
    text:"[Waves of Calamity] Recurring interdimensional disasters that tear rifts and flood the land with monsters — caused by separate worlds being forced to fuse; if a Wave isn't stopped, the weaker world is devoured. Heroes are warped to the Wave when the Dragon Hourglass empties. In this AU the extra fused (Axe) world makes Waves MORE frequent and violent." },
  { keys:["guardian beast","spirit tortoise","phoenix","kirin","dragon king","byakko","white tiger"], minS:2, pri:6,
    text:"[Guardian Beasts] Colossal sealed protector-beasts that defend the world if the heroes fail — and catastrophes if wrongly awakened. The five: Spirit Tortoise (Genbu), Phoenix (Suzaku), Dragon King (Seiryu), Kirin, and — AU — Byakko the White Tiger (the Axe's aligned fifth, mythic kin of the Hakuko)." },
  { keys:["vanguard","vanguards of the waves"], minS:2, pri:6,
    text:"[Vanguards of the Waves] The overarching conspiracy: people reincarnated into other worlds by 'God' (Medea), chosen for selfish traits and given powers to steal hero-weapons and resurrect — they WANT the Waves to succeed. Members include Kyo, Takt, and later Malty. Gate this reveal to its season." },
  { keys:["kizuna's world","glass's world","parallel world","other world"], minS:2, pri:5,
    text:"[Connected worlds] Beyond Raphtalia's world lies Kizuna's/Glass's parallel world, with its own Legendary & Vassal heroes — early antagonists (kill the rival world's heroes to spare their own) who become allies against the true enemy." },
  { keys:["medea","behind the waves","cause of the waves"], minS:4, pri:5,
    text:"[Medea] The hidden deity engineering the Waves by merging the worlds — the final cause behind everything; uses the Vanguards as disposable tools. ENDGAME; do not surface early." }

];

var CONFIG = { MAX_ENTRIES: 4, BUDGET: 3000, SCAN_DEPTH: 4 };
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
  var m = _mentions(keys);
  if (m <= 0) return;
  hits.push({ e: e, m: m, pri: e.pri || 5 });
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
