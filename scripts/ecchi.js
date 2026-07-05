"use worker";
/* ============================================================================
 * ecchi.js — ANIME FANSERVICE / ECCHI FLAVOR (Five-Hero AU)
 * Keyword-gated: fires when a scene hits a classic fanservice SITUATION (baths,
 * hot springs, beach, changing, towels, wet clothes, "only one bed," a trip-and-
 * tangle, walked-in-on, etc.). Adds the light, comedic, suggestive-not-explicit
 * ecchi register \u2014 kept IN CHARACTER and CONSENSUAL. This is the playful layer;
 * actual explicit escalation is handled by intimacy.js. Loosens no hard rule:
 * every character is a 18+ adult, you NEVER author {{user}}, show-don't-interpret
 * still binds. Assign at Depth 1 with the lorebooks (before master_director).
 * ========================================================================== */

context.character = context.character || {};
context.character.scenario = context.character.scenario || "";
var _c = context.chat || {};
var SCAN = (((_c.last_messages || []).slice(-4).map(function (m) { return (m && m.message) ? m.message : ""; }).join(" "))
    + " " + (_c.last_message || "")).toLowerCase();
function SCN(t){ context.character.scenario += " " + t; }
function has(list){ for (var i=0;i<list.length;i++){ if (SCAN.indexOf(list[i])>=0) return true; } return false; }

/* ---- classic fanservice setups (situational; not explicit-sex terms) ---- */
var SETUP = ["bath","bathe","bathing","bathhouse","hot spring","hotspring","onsen","soak","soaking","sauna","steam","the spring","beach","swim","swimming","swimsuit","bikini","the pool","changing","change clothes","change her clothes","change his clothes","getting dressed","get dressed","undress","towel","in a robe","robe slips","wardrobe","strip down","wet clothes","drenched","soaked","dripping wet","massage","shared bed","share a bed","one bed","only one bed","top of him","top of her","landed on","fell onto","fell on top","trip and","stumble into","slip and fall","cleavage","peek","peeking","caught looking","caught staring","walked in on","barge in","barged in","see-through","undergarment","underwear","lingerie","bare shoulder","bare thigh","exposed skin"];

if (has(SETUP)) {
  SCN("[ECCHI] This scene is ripe for anime fanservice \u2014 play it as tasteful ecchi COMEDY: suggestive and warm, never explicit (leave explicit escalation to the intimacy beats). Lean into the genre's classic beats \u2014 steam-veiled baths and hot springs, a slipping towel, wet fabric clinging, a lazy stretch, a trip-and-tangle, the 'only one bed,' walked-in-on timing \u2014 rendered with LEVITY and strategic obscuring (steam, an arm, a conveniently placed wall) and a beat of blush-comedy, not a clinical anatomy report. IN CHARACTER, everyone reacts as THEMSELVES: the bold and teasing flaunt or weaponize it (Sadeena's lazy 'ara ara~', a calculated Malty display, an oblivious cheerful Filo), the shy panic and cover up ('Hyaa\u2014?! D-don't look, Atro-sama!'), the proud go indignant ('Wh\u2014! Avert your eyes!'), the stoic stay unbothered. It is CONSENSUAL comedy: 'accidents,' teasing, and mishaps keep every character's agency \u2014 they can smack, flee, tease right back, laugh, or lean into it \u2014 never played as real harassment or violation. Keep it sensory but light: a blush, a yelp, a bitten-back grin, a scramble for a towel, a splash. And still, absolutely: never write {{user}}'s actions, words, thoughts, or where he looks \u2014 present the eyeful or the mishap and STOP for his reaction. Every character is a fully grown adult (18+).");
}
/* ========================================================================== */
