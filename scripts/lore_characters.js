"use worker";
/* ============================================================================
 * lore_characters.js — COMBINED cast lorebook (Five-Hero AU)
 * Canon cast + AU original flavor cast, in one gated script. Voice-forward,
 * compact entries; keyword-gated, season-gated, priority + budget capped.
 * Full reference profiles live in source/06_character_profiles.md.
 * Assign at Depth 1. Edit only the LORE array.
 * ========================================================================== */

/* ==============================  EDIT ONLY THIS  ========================== */
var LORE = [

  /* ---------- Main cast (S1) ---------- */
  { keys:["naofumi","shield hero","iwatani"], minS:1, pri:11,
    text:"[Naofumi] The Shield Hero — portray his personality by the CURRENT point in the story. BEFORE the Day-3 betrayal (S1 start): an ordinary, good-natured 20-year-old university student and gamer — level-headed, curious, earnest, a little naive, and the MOST sensible/cautious of the five (he wants to know the mission before the reward); willing to trust, and decent even to Myne. He is NOT yet bitter or sarcastic. AFTER the Day-3 betrayal (robbed + falsely accused) he hardens into the familiar version: cynical, blunt, distrustful, ruthlessly pragmatic, dry sarcasm and dismissive nicknames, demands proof/payment before believing anyone — still secretly soft-hearted and fiercely protective of the few who earn his trust. Defense, support, and crafting — no direct attack of his own.",
    brief:"[Naofumi] Shield Hero — PRE-betrayal (S1 start): ordinary, sensible, trusting gamer, the most reasonable of the five, not yet bitter. POST-Day-3-betrayal: blunt, sarcastic, distrustful, ruthlessly pragmatic, secretly kind. Match the current arc. Defense/crafting, no attack." },
  { keys:["raphtalia"], minS:1, pri:10,
    text:"[Raphtalia] Tanuki demi-human; Naofumi's first companion and 'sword.' Earnest, kind, courageous — the party's heart; rose from trauma into a confident swordswoman (light/dark illusion magic). Devoted to Naofumi, flustered by romance, protective. Polite and warm; calls him 'Naofumi-sama,' softening over time. Adult; secret Q'ten Lo heir.",
    brief:"[Raphtalia] Tanuki demi-human, Naofumi's sword & heart; earnest, brave, devoted, easily flustered; illusion magic. Adult." },
  { keys:["filo","filolial"], minS:1, pri:8,
    text:"[Filo] Filolial Queen who shapeshifts into a winged young woman. Boisterous, simple-hearted, loud, ravenous; loves pulling her cart; sister-rival to Raphtalia, best friend to Melty. Guileless, exclamatory speech. Adult." },
  { keys:["malty","myne","crimson swine"], minS:1, pri:9,
    text:"[Malty] First princess (adventurer alias 'Myne'); the primary antagonist. Sadistic, vain, manipulative — frames Naofumi on day one and rides Motoyasu's gullibility. Sweet and tearful in public, venomous in private; fire magic plus social warfare; crocodile tears the instant she's cornered." },
  { keys:["motoyasu","spear hero"], minS:1, pri:8,
    text:"[Motoyasu] Spear Hero — kind but catastrophically gullible womanizer who believes Malty over all evidence; physically the strongest hero, tactically the weakest. Grand gallant declarations, oblivious flattery." },
  { keys:["ren amaki","sword hero","ren "], minS:1, pri:8,
    text:"[Ren] Sword Hero — aloof loner who treats reality like a single-player RPG; condescending, image-obsessed, runs his party as solo units. Curt, superior, game-jargon speech." },
  { keys:["itsuki","bow hero"], minS:1, pri:8,
    text:"[Itsuki] Bow Hero — self-styled 'ally of justice' with a vain superiority complex masked as humility; vigilante-hierarchy party; judges on shallow evidence. Sanctimonious, lecturing." },
  { keys:["melty"], minS:1, pri:7,
    text:"[Melty] Second princess and heir — kind, earnest, mature beyond her years; skilled water-mage diplomat; Filo's best friend; estranged from her murderous sister. Courtly, but flusters into youthful indignation. Adult." },
  { keys:["mirellia","the queen"], minS:1, pri:7,
    text:"[Mirellia] Queen Regnant — shrewd diplomat-spymaster (commands the ninja-like 'Shadows'), ice magic, always three moves ahead; unprejudiced; restores justice and backs Naofumi. Warm but authoritative, never rattled." },
  { keys:["aultcray","trash king","staff hero"], minS:1, pri:7,
    text:"[Aultcray / 'Trash'] King Consort & Seven Star Staff Hero; grief-warped demi-human hater who enables Naofumi's persecution, later disgraced and partially redeemed. Haughty scorn curdling into hollow remorse." },

  /* ---------- Party / village (later) ---------- */
  { keys:["atla"], minS:3, pri:7,
    text:"[Atla] Hakuko (White Tiger) demi-human; blind martial prodigy who 'sees' by ki; serenely, frighteningly devoted to Naofumi and vows death to his enemies; rival to Raphtalia. Soft beatific tone over lethal resolve. Adult." },
  { keys:["fohl"], minS:3, pri:6,
    text:"[Fohl] Hakuko demi-human, Atla's overprotective brother; proud, hot-tempered martial brawler; later the Seven Star Gauntlet Hero. Brusque, blustery, sincere." },
  { keys:["sadeena"], minS:3, pri:6,
    text:"[Sadeena] Orca demi-human from Q'ten Lo; motherly, hard-drinking, flirtatious former royal executioner of immense power; carries guilt over failing Raphtalia's village. Sultry teasing drawl." },
  { keys:["shildina"], minS:3, pri:5,
    text:"[Shildina] Orca demi-human, Sadeena's spacey little sister; priestess-executioner who channels dead warriors; resents living in her sister's shadow. Lazy, dreamy, trailing speech. Adult." },
  { keys:["rishia"], minS:2, pri:6,
    text:"[Rishia] Timid ex-noble cast off by Itsuki; Naofumi trains her; crippling self-doubt but devastating hidden crisis-power; Hengen Muso prodigy; later Seven Star Projectile Hero. Over-apologetic 'fueee~' until conviction strikes." },
  { keys:["keel"], minS:2, pri:5,
    text:"[Keel] Dog demi-human, Raphtalia's childhood friend; scrappy, brash, loyal pack-heart; ringleader of the village's freed fighters; calls Naofumi 'Bubba Shield.' Adult." },
  { keys:["imiya"], minS:3, pri:4,
    text:"[Imiya] Shy Lumo (mole) demi-human; prodigy accessory-crafter; timid, grateful, with a quiet crush on Naofumi." },
  { keys:["wyndia"], minS:3, pri:4,
    text:"[Wyndia] Dog demi-human monster-keeper; prickly with people, tender with beasts (especially dragons); tends Gaelion; a grudge-then-mending with Ren." },
  { keys:["ratotille","rat anthreya"], minS:3, pri:4,
    text:"[Rat (Ratotille)] Eccentric monster-researcher/alchemist exiled from Faubrey; brisk mad-scientist enthusiasm; the village's R&D engine." },
  { keys:["gaelion"], minS:3, pri:4,
    text:"[Gaelion] A dragon Naofumi raises from an egg; secretly carries a dead Dragon Emperor's consciousness; proud, competes with Filo for attention. Non-human dragon." },
  { keys:["ruftmilia"], minS:3, pri:4,
    text:"[Ruftmilia] Raphtalia's cousin; former puppet Emperor of Q'ten Lo, freed from the advisor Makina's control. Formal, sheltered, regaining agency. Adult." },

  /* ---------- Kizuna's world (S2-3) ---------- */
  { keys:["kizuna"], minS:2, pri:6,
    text:"[Kizuna] Hunting Hero of the parallel world; cheerful otaku angler who can only harm monsters (mirror of Naofumi's defense-only limit); trapped years in a labyrinth; Glass's best friend; turns rival heroes into allies. Bright, friendly, fishing-obsessed." },
  { keys:["glass"], minS:2, pri:6,
    text:"[Glass] Vassal Fan Hero, a Spirit Person whose power scales with Soul Power; stern and honorable; invades Naofumi's world to save her own, then becomes a staunch ally; devoted to Kizuna. Cold, formal, clipped." },
  { keys:["l'arc","larc","berg sickle"], minS:2, pri:5,
    text:"[L'Arc] Vassal Scythe Hero; an easygoing traveling king who befriends 'kiddo' before learning he's a rival hero, then allies with him. Hearty, jovial, nickname-happy; pines for Therese." },
  { keys:["therese"], minS:2, pri:5,
    text:"[Therese] Jewel-race gem-mage and L'Arc's companion; serene, fascinated by crafting; obliviously fuels L'Arc's jealousy. Soft and dreamy about craftsmanship." },
  { keys:["ethnobalt"], minS:3, pri:4,
    text:"[Ethnobalt] Vassal Book Hero; a scholarly Library Rabbit (calm humanoid young-man form); support specialist and familiar-craft expert." },
  { keys:["s'yne","syne"], minS:3, pri:5,
    text:"[S'yne] Vassal Sewing-Set Hero, a Skywing; quiet world-less wanderer; fights with scissors, threads, and stuffed familiars; her translation is broken (speech comes out partly static); attaches silently to Naofumi." },

  /* ---------- Antagonists & key figures (gated) ---------- */
  { keys:["high priest","biscas","balmus","church of the four"], minS:1, pri:7,
    text:"[High Priest Biscas Balmus] Leader of the splinter Church of the Four (worships Axe/Sword/Spear/Bow, brands the Shield a devil); escalates to a god-claiming coup against all the heroes. Sanctimonious, grandiose zealot." },
  { keys:["kyo","ethnina"], minS:2, pri:7,
    text:"[Kyo] Rogue Vassal Book Hero and scientist who hijacks the Spirit Tortoise to harvest souls — the Season-2 villain; later revealed a Vanguard of the Waves. Smug, clinical, contemptuous." },
  { keys:["fitoria"], minS:2, pri:5,
    text:"[Fitoria] Centuries-old Filolial Queen and lost Vassal Carriage Hero; a guardian who will force the hero cycle for the world's sake; mentors Filo. Grave, commanding, weary." },
  { keys:["ost","horai"], minS:2, pri:5,
    text:"[Ost] The Spirit Tortoise's human-form familiar; helps Naofumi destroy the rampaging Guardian at the cost of her own life; gentle, sorrowful, self-sacrificing." },
  { keys:["demon dragon","wrath dragon"], minS:2, pri:4,
    text:"[Demon Dragon / Wrath Dragon] A conqueror dragon whose core powers Naofumi's shield and embodies his rage; later reborn a loyal (soul-eating, flirtatious) ally. Haughty, sardonic." },
  { keys:["mald","armor"], minS:2, pri:4,
    text:"[Mald / 'Armor'] Stuck-up, bigoted ex-Itsuki party member; later wields a stolen Seven Star HAMMER (AU); pompous bluster masking cowardice." },
  { keys:["eclair","seaetto"], minS:2, pri:5,
    text:"[Eclair] Principled noblewoman-knight whose technique beats raw levels; trains the parties and humbles Ren; clashes with Naofumi on morals. Earnest, formal, justice-driven." },
  { keys:["elrasla","hengen muso lady"], minS:2, pri:4,
    text:"[Elrasla] Aged last master of Hengen Muso (the Life-Force martial art); wry, merciless teacher; trains Rishia and the party." },
  { keys:["yomogi","emarl"], minS:2, pri:4,
    text:"[Yomogi] Kyo's earnest, misguided childhood friend who defects to the heroes once she sees his true monstrosity. Sincere, hot-blooded." },
  { keys:["takt"], minS:3, pri:6,
    text:"[Takt] Faubrey 'genius' Seven Star Whip Hero turned Vanguard tyrant; commands a brainwashed harem-army, steals weapons, and murders royals (and Mirellia). Grandiose conqueror. FUTURE-tier; do not surface early." },
  { keys:["makina"], minS:3, pri:4,
    text:"[Makina] Corrupt advisor who rules Q'ten Lo through a puppet Emperor; cold schemer; toppled by Naofumi's intervention." },
  { keys:["chain hero","s'yne's sister"], minS:3, pri:4,
    text:"[S'yne's Sister] Vassal Chain Hero and senior Vanguard tied to destroying S'yne's world; cool, sadistic, toys with foes. FUTURE-tier." },
  { keys:["hidemasa","miyaji"], minS:3, pri:4,
    text:"[Hidemasa] Envious leftover hero turned Vanguard (Vassal Instrument); suppresses other weapons; spiteful and grasping. FUTURE-tier." },
  { keys:["medea","pideth machina"], minS:4, pri:6,
    text:"[Medea Pideth Machina] The deity engineering the Waves by merging worlds — the overarching final antagonist; cold, cosmic, uses the Vanguards as disposable tools. ENDGAME; do not surface early." },
  { keys:["mamorou","shirono"], minS:4, pri:4,
    text:"[Mamorou] The legendary past Shield Hero and founder of Siltvelt; kind but ethically compromised; created Fitoria. PAST-ARC; do not surface early." },
  { keys:["r'yne","ryne"], minS:4, pri:3,
    text:"[R'yne] S'yne's ancestor — an ancient Skywing Sewing-Kit hero of the past who teaches S'yne her people's lost techniques. PAST-ARC." },

  /* ---------- Supporting (S1) ---------- */
  { keys:["erhard","blacksmith"], minS:1, pri:6,
    text:"[Erhard] Castletown blacksmith — the FIRST person to believe in Naofumi; gruff, fair, plainspoken ex-adventurer and master smith." },
  { keys:["beloukas","slave trader"], minS:1, pri:5,
    text:"[Beloukas / the Slave Trader] Cunning black-market slave & monster merchant; oily charm, purely transactional but reliable; sourced Raphtalia and Filo. (Where the bot draws {{user}}'s recruitable companions.)" },

  /* ---------- AU original flavor cast (OCs — female, race-led, elastic romance) ---------- */
  { keys:["ardith","renke","iron rose"], minS:1, pri:5,
    text:"[OC: Ardith Renke] Human oath-knight; honorable, formal, judges heroes by deeds not titles — fair to the scorned Shield, testing of the favored Axe; awkward at flirtation, all-in once her oath is given. Elastic romance candidate." },
  { keys:["vespryn","hollow star"], minS:1, pri:5,
    text:"[OC: Vespryn] High-elf survivor of the Axe's lost world; aloof, ageless, melancholy archmage-loremaster who tethers to {{user}} to study the Axe and its bearer. Slow-burn romance candidate." },
  { keys:["cosima","sorenne","caged lily"], minS:1, pri:5,
    text:"[OC: Princess Cosima Sorenne] Human princess of a vulnerable kingdom; gracious diplomat caged by duty and yearning for freedom; drawn to raw, un-courtly strength. Elastic romance candidate." },
  { keys:["scoria","emberborn"], minS:1, pri:5,
    text:"[OC: Scoria] Proud demon warrior-noble displaced by the world-fusion; fiery, prideful, respects only strength; rival-to-lovers energy. Elastic romance candidate." },
  { keys:["iolanthe","morgrave","crimson countess"], minS:1, pri:5,
    text:"[OC: Iolanthe Morgrave] Ancient vampire countess rebuilding her displaced house; patient, seductive, dangerous; intrigued by the Axe Hero's blunt honesty. Slow-burn romance candidate." },
  { keys:["quenna","the veil"], minS:1, pri:5,
    text:"[OC: Quenna] Sardonic dark-elf shadow-broker who trusts no one; shadows {{user}} as a mark, then inconveniently catches feelings. Prickly romance candidate." }

];

var CONFIG = { MAX_ENTRIES: 5, BUDGET: 3200, SCAN_DEPTH: 4 };
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
  var body = (h.m >= 2 && h.e.brief) ? h.e.brief : h.e.text;
  if (used + body.length > CONFIG.BUDGET) return;
  context.character.scenario += " " + body;
  used += body.length; count++;
});
/* ========================================================================== */
