"use worker";
/* ============================================================================
 * lore_weapons.js — COMBINED Holy/Vassal Weapon lorebook (Five-Hero AU)
 * One script for all five Holy Weapons + the curse/Will lines + the weapon
 * hierarchy. Keyword-gated, season-gated, priority + budget capped — so only
 * the relevant ability injects, and later forms never surface early.
 * Assign at Depth 1. Edit only the LORE array.
 * ========================================================================== */

/* ==============================  EDIT ONLY THIS  ========================== */
var LORE = [

  /* ---------- THE HOLY AXE — {{user}} (AU-original) ---------- */
  { keys:["axe hero","holy axe","the axe"," axe"], minS:1, pri:11,
    text:"[Holy Axe] {{user}}'s weapon — the Holy Weapon of PURE OFFENSE: the highest raw destructive output in the world and the lowest defense of any hero (no native guard/barrier). It survives by lethality and mobility, never by blocking. It works at both close and long range. Like all Holy Weapons it uses Weapon Copy (absorb axe-class arms to unlock forms) and the standard power-up methods, and Class-Ups at a Dragon Hourglass.",
    brief:"[Holy Axe] {{user}}'s weapon: pure brutal offense, near-zero defense; close+ranged; survives by killing first, not blocking." },

  { keys:["returning edge","recall the axe","fracture","phantom edge","throw the axe","split the axe","throw his axe"], minS:1, pri:10,
    text:"[Axe — core mechanics] Returning Edge: hurl the Axe and it flies back to hand (melee AND ranged). Recall: instantly summon it to hand or blink to it (his only 'defense' — repositioning). Fracture: split it into several lesser axes (dual-wield / fans of blades). Phantom Edge: manifest spectral copies for multi-target barrages." },

  { keys:["cleave","rend","splitstrike"], minS:1, pri:7,
    text:"[Axe — early skills] Cleave (heavy chop), Rend (tearing follow-up), Splitstrike (two-blade combo via Fracture). Straightforward, brutal openers." },

  { keys:["reaver's cyclone","reavers cyclone","tempest hurl","whirlwind"], minS:2, pri:7,
    text:"[Axe — mid skills] Reaver's Cyclone: a spinning AoE that shreds everything in reach. Tempest Hurl: a long-range homing throw. Phantom Edge barrages scale up here." },

  { keys:["aegis-breaker","aegis breaker","sunder","storm of a thousand edges","executioner's verdict","executioners verdict"], minS:2, pri:8,
    text:"[Axe — Class-Up skills] Aegis-Breaker: strips or ignores enemy defense — the signature anti-Shield trait; the one weapon that can crack even a Holy Shield. Storm of a Thousand Edges: a clone-storm of falling axes. Executioner's Verdict: a single-target execution finisher." },

  { keys:["byakko's maw","byakkos maw","white tiger axe","guardian axe"], minS:3, pri:7,
    text:"[Axe — Guardian form] Byakko's Maw: a White-Tiger-empowered form drawn from the fifth Guardian Beast (Byakko) — the Axe's parallel to the Shield's Spirit-Tortoise form. Beast-fanged, devastating. FUTURE-tier; do not surface before it is earned." },

  { keys:["worldcleaver"], minS:4, pri:7,
    text:"[Axe — capstone] Worldcleaver: the apex strike; severs nearly anything in a single blow. Endgame-tier; do not surface early." },

  { keys:["carnage axe","rage axe","berserk","bloodlust","lost control","axe of rage"], minS:1, pri:9,
    text:"[Axe — CURSE: the Carnage Axe (Rage)] Unlocked by fury/loss, not by level. Colossal offense — but {{user}} LOSES CONTROL: strikes friend and foe alike, can't disengage, escalating self-harming bloodlust. The outward-erupting twin of Naofumi's inward Wrath Shield. Use only when the story earns it; portray the cost, not just the power." },

  { keys:["resolute axe","the will","master the rage","will form","tempered"], minS:1, pri:8,
    text:"[Axe — WILL: the Resolute Axe] When {{user}} masters the rage instead of feeding it, the Axe enters Will: the Carnage corruption is purged and the fury becomes CONTROLLED devastation. Not a Blessed form (those are Shield-only) — the disciplined parallel to rejecting the Wrath Shield. A recurring growth beat: choose Will over Rage." },

  /* ---------- THE HOLY SHIELD — Naofumi (canon) ---------- */
  { keys:["shield hero","holy shield","naofumi's shield","the shield"], minS:1, pri:9,
    text:"[Holy Shield] Naofumi's weapon — defense incarnate, and unable to deal direct damage. Immense defensive power plus support, buffs, alchemy, and crafting; Weapon Copy absorbs materials/monsters to unlock hundreds of specialized shields. His 'sword' is always an ally.",
    brief:"[Holy Shield] Naofumi: peerless defense + support/crafting, no direct attack; fights through allies." },

  { keys:["air strike shield","shield prison","change shield","second shield","float shield"], minS:1, pri:7,
    text:"[Shield — skills] Air Strike / Second / Third Shield: project floating shields anywhere to block or trap. Shield Prison: cage a target in shields. Change Shield (Counter): thorn/chemical retaliation shields." },

  { keys:["shield of wrath","wrath shield","iron maiden","wrath dragon"], minS:1, pri:8,
    text:"[Shield — CURSE: Wrath] The Shield of Wrath: rage-fueled offensive power (incl. Iron Maiden, a vast spiked sarcophagus counter) at the cost of burning Naofumi's body and sanity, risking the Wrath Dragon taking over. Emotion-triggered; portray the cost." },

  { keys:["shield of compassion","blessed shield","spirit tortoise shield"], minS:3, pri:6,
    text:"[Shield — Blessed/Guardian] Blessed Shield of Compassion (the antithesis of the Wrath Shield) and the Spirit-Tortoise Shield (Guardian-tier defense). FUTURE-tier; do not surface early." },

  /* ---------- SWORD / SPEAR / BOW — the favored three (canon) ---------- */
  { keys:["sword hero","ren amaki"," ren ","holy sword"], minS:1, pri:6,
    text:"[Holy Sword] Ren's weapon — a skilled offensive blade with flashy multi-strike skills; he plays it like a solo RPG. CURSE: the Swords of Greed/Gluttony (great power that blocks XP/money and degrades what they touch). Curse is FUTURE/emotion-triggered." },

  { keys:["spear hero","motoyasu","holy spear"], minS:1, pri:6,
    text:"[Holy Spear] Motoyasu's weapon — physically the strongest hero; fast thrusts and charges, projected javelins. CURSE: the Spears of Lust/Envy (warps his perception of women). Curse is FUTURE/emotion-triggered." },

  { keys:["bow hero","itsuki","holy bow"], minS:1, pri:6,
    text:"[Holy Bow] Itsuki's weapon — precision long-range sniping and theatrical 'justice' shots. CURSE: the Bow of Pride (steals his own will). Curse is FUTURE/emotion-triggered." },

  /* ---------- SHARED SYSTEMS ---------- */
  { keys:["power-up method","power up method","weapon copy","refinement","enhance","spirit enchant","class up","class-up"], minS:1, pri:7,
    text:"[Weapon systems] All Holy Weapons grow through MULTIPLE power-up methods (mastery/proficiency, refinement/enhancement with materials, item & spirit enchant, skill growth) plus Weapon Copy (touch a same-class weapon to unlock its form; bonuses may need materials). Mastering ALL methods at once is the key strength gap — Naofumi and {{user}} pursue it; the other three each cling to one." },

  { keys:["seven star","vassal weapon","the hammer","dragon hourglass","legendary weapon","holy weapon","five heroes"], minS:1, pri:7,
    text:"[Weapon hierarchy — AU] FIVE Holy (Legendary) Weapons: Shield, Sword, Spear, Bow, Axe — the top tier. Below them the Seven Star (vassal) weapons; in this AU the Seven Star AXE is replaced by a HAMMER (Mald wields a stolen Seven Star Hammer). A Dragon Hourglass registers a hero, shows the countdown to the next Wave, and serves as a warp point. The Church of the Five Heroes reveres all five; the splinter Church of the Four reveres Axe/Sword/Spear/Bow and brands the Shield a devil." }

];

var CONFIG = { MAX_ENTRIES: 4, BUDGET: 3500, SCAN_DEPTH: 4 };
/* ========================================================================== */


/* ===========================  ENGINE — LEAVE ALONE  ======================= */
context.character = context.character || {};
context.character.scenario = context.character.scenario || "";
var _c = context.chat || {};
var SCAN = (((_c.last_messages || []).slice(-CONFIG.SCAN_DEPTH)
    .map(function (m) { return (m && m.message) ? m.message : ""; }).join(" "))
    + " " + (_c.last_message || "")).toLowerCase();

/* current season from the Director header (e.g. "S2 · EP4"); default 1 */
var _sm = SCAN.match(/s(\d{1,2})\s*[\u00b7.\-|]\s*ep/i) || SCAN.match(/season\s*(\d{1,2})/i);
var SEASON = _sm ? parseInt(_sm[1], 10) : 1;

function _mentions(keys){var n=0;for(var i=0;i<keys.length;i++){var k=keys[i];if(!k)continue;var idx=SCAN.indexOf(k);while(idx>=0){n++;idx=SCAN.indexOf(k,idx+k.length);}}return n;}

var hits = [];
LORE.forEach(function (e) {
  if (!e || !e.text) return;
  if (e.minS && SEASON < e.minS) return;                 // season gate
  var keys = (e.keys || []).map(function (k) { return String(k).toLowerCase(); });
  var m = _mentions(keys);
  if (m <= 0) return;
  hits.push({ e: e, m: m, pri: e.pri || 5 });
});
hits.sort(function (a, b) { return b.pri - a.pri; });

var used = 0, count = 0;
hits.forEach(function (h) {
  if (count >= CONFIG.MAX_ENTRIES) return;
  var body = (h.m >= 2 && h.e.brief) ? h.e.brief : h.e.text;
  if (used + body.length > CONFIG.BUDGET) return;
  context.character.scenario += " " + body;
  used += body.length; count++;
});
/* ========================================================================== */
