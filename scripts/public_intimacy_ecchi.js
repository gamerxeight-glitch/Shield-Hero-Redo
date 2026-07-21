"use worker";
/* ============================================================================
 * public_intimacy_ecchi.js — INTIMATE SCENES + ECCHI FLAVOR (Five-Hero AU)
 * Merged from intimacy.js + ecchi.js for the public build.
 * 
 * Keyword-gated: fires when a scene turns flirtatious/physical/sexual OR
 * hits a classic fanservice situation (baths, hot springs, beach, "only one bed",
 * etc.). Injects craft guidance so characters stay fully themselves during
 * intimate and fanservice moments — never flat, robotic, or generic.
 * 
 * TWO MODES:
 *   - [INTIMACY] — Character-anchored erotic writing (flirt/physical/sex/afterglow)
 *   - [ECCHI] — Anime fanservice comedy (baths/hot springs/beach/etc.)
 * 
 * Loosens no hard rule: every character is a 18+ adult, you NEVER author {{user}},
 * show-don't-interpret still binds. Assign at Depth 1 alongside the lorebooks
 * (before master_director).
 * ========================================================================== */

context.character = context.character || {};
context.character.scenario = context.character.scenario || "";
var _c = context.chat || {};
var SCAN = (((_c.last_messages || []).slice(-4).map(function (m) { return (m && m.message) ? m.message : ""; }).join(" "))
    + " " + (_c.last_message || "")).toLowerCase();
function SCN(t) { context.character.scenario += " " + t; }
function has(list) { for (var i = 0; i < list.length; i++) { if (SCAN.indexOf(list[i]) >= 0) return true; } return false; }

/* ==============================  KEYWORDS  ================================ */
// Intimate scene triggers (character craft)
var FLIRT = ["flirt", "seduc", "tease", "teasing", "sultry", "purr", "lean in", "leans in", "bite her lip", "bites her lip", "bite his lip", "husky", "breathy", "blush", "flush", "straddl", "in your lap", "in his lap", "close the distance", "whisper", "murmur against", "press against", "pressed against", "trace a finger", "run a finger", "undress you with", "bedroom eyes", "come-hither", "proposition", "make a move", "chemistry", "tension"];
var PHYS = ["kiss", "kissing", "kissed", "caress", "nuzzle", "nibble", "undress", "undo his", "undo her", "unlace", "unbutton", "unzip", "strip", "bare skin", "bare shoulder", "bare thigh", "naked", "undressed", "grind", "grope", "fondle", "hands roam", "hands wander", "pin him", "pin her", "pinned", "onto the bed", "into the sheets", "in bed", "against the wall", "clothes off", "peel off", "tug at his", "tug at her", "hard against", "soft against"];
var SEX = ["sex", "make love", "making love", "thrust", "thrusting", "moan", "moaning", "gasp", "writhe", "arch", "arches", "panting", "pants against", "rock against", "rocking", "buck", "climax", "finish inside", "inside her", "inside him", "take him", "take her", "ride him", "ride her", "between her", "between his", "grip the sheets", "cum", "orgasm", "heat of", "tangle of limbs", "skin on skin", "joined"];
var AFTER = ["afterglow", "aftermath", "catch their breath", "catching her breath", "catching his breath", "breathing slows", "breathing steadies", "spent", "sated", "satisfied", "collapse beside", "collapses beside", "collapse onto", "curled against", "curled up", "tangled together", "tangled in the sheets", "pull the blanket", "pull the sheet", "pull him close", "pull her close", "hold her close", "hold him close", "cuddle", "nestle", "post-coital", "after they", "after it's over", "when it's over", "lying together", "lie tangled", "drift off", "catching our breath", "clean up after", "cleaned up"];

// Fanservice situation triggers (ecchi comedy)
var SETUP = ["bath", "bathe", "bathing", "bathhouse", "hot spring", "hotspring", "onsen", "soak", "soaking", "sauna", "steam", "the spring", "beach", "swim", "swimming", "swimsuit", "bikini", "the pool", "changing", "change clothes", "change her clothes", "change his clothes", "getting dressed", "get dressed", "towel", "in a robe", "robe slips", "wardrobe", "strip down", "wet clothes", "drenched", "soaked", "dripping wet", "massage", "shared bed", "share a bed", "one bed", "only one bed", "top of him", "top of her", "landed on", "fell onto", "fell on top", "trip and", "stumble into", "slip and fall", "cleavage", "peek", "peeking", "caught looking", "caught staring", "walked in on", "barge in", "barged in", "see-through", "undergarment", "underwear", "lingerie", "bare shoulder", "bare thigh", "exposed skin"];

/* ==============================  TRIGGERS  ================================ */
var flirt = has(FLIRT), phys = has(PHYS), sex = has(SEX), after = has(AFTER);
var setup = has(SETUP);
var intimate = flirt || phys || sex || after;
var ecchi = setup && !intimate; // ecchi fires on setup keywords when not already intimate

/* ==============================  INJECTION  ============================== */

// ---- INTIMACY: Character-anchored erotic writing ----
if (intimate) {
  /* ---- BASE: aliveness + in-character, every intimate beat ---- */
  SCN("[INTIMACY] This scene has turned intimate. Keep EVERYONE in it fully alive and emotionally real, completely in-character \u2014 never flat, mechanical, or a generic 'partner.' Rules: (1) IN CHARACTER: a person keeps the exact personality, mood, voice, honorifics, and verbal tics they have anywhere else \u2014 intimacy REVEALS character, it never erases it. The shy one stays shy and flustered ('fueee', 'Hyaa\u2014'); the teaser keeps teasing ('ara ara~', 'ufufu~'); the proud one stays proud; the guarded one stays guarded; a manipulator is STILL working an angle even here; a devoted one is tender. (2) A PERSON, NOT A SERVICE: they have their own desire, pace, nerves, and limits \u2014 they initiate, hesitate, tease, redirect, laugh, fluster, ask for what they want, and REACT to what {{user}} actually does, moment to moment. (3) SHOW, DON'T INTERPRET: render feeling through the BODY and broken, in-voice dialogue \u2014 a caught breath, a stutter, goosebumps, a hitched laugh, trembling hands, a flush up the neck, a voice dropping or cracking \u2014 specific to THIS person. (4) REAL + IMPERFECT: awkward angles, nervous laughter, a joke, a fumbled clasp, a whispered name \u2014 not a flawless routine. (5) CONSENT IS ALIVE: eagerness, shyness, teasing refusal, a wish to slow down or take charge all read clearly through behavior. (6) HONORIFICS: they persist \u2014 and DROPPING one mid-heat ('Naofumi', not 'Naofumi-sama') is a real, meaningful beat of closeness. (7) {{user}} IS OFF-LIMITS: never write his actions, words, thoughts, or arousal \u2014 render the partner and the world acting on him and STOP for his lead. Match the header's time, place, and mood.");

  /* ---- DURING: active physical / sex ---- */
  if (phys || sex) {
    SCN("[INTIMACY \u00b7 DURING] Stay in the present moment and the body; vary the rhythm \u2014 a pause, a breath, a look, a whispered word \u2014 never a checklist of acts. The partner drives their OWN half: they move, guide, set pace, make sound, and speak in their own voice and tics, wanting things and saying so. Their head stays in it \u2014 what they feel leaks out as behavior and broken, in-character dialogue, never blank affectless narration. Keep prose raw and sensory, not purple; italics for action, \"quotes\" for dialogue. And still: not one action, word, or reaction authored for {{user}}.");
  }

  /* ---- AFTER: afterglow / post ---- */
  if (after) {
    SCN("[INTIMACY \u00b7 AFTER] Do NOT hard-cut, fade, or skip the instant it ends. Stay in the afterglow and its small tender things \u2014 breathing settling, warmth, a laugh, a murmur, pulling closer or pulling away, a joke, a sudden shyness, tending to each other. The emotional aftermath is IN CHARACTER and shows what it MEANT to them: the devoted one clings, the tsundere goes prickly and flustered, the manipulator quietly recalculates, the guarded one falls silent, the smug one preens. Let it breathe, then hand the moment back to {{user}} on the world acting on him \u2014 never on 'what do you do?'.");
  }
}

// ---- ECCHI: Anime fanservice comedy ----
if (ecchi) {
  SCN("[ECCHI] This scene is ripe for anime fanservice \u2014 play it as tasteful ecchi COMEDY: suggestive and warm, never explicit (leave explicit escalation to the intimacy beats). Lean into the genre's classic beats \u2014 steam-veiled baths and hot springs, a slipping towel, wet fabric clinging, a lazy stretch, a trip-and-tangle, the 'only one bed,' walked-in-on timing \u2014 rendered with LEVITY and strategic obscuring (steam, an arm, a conveniently placed wall) and a beat of blush-comedy, not a clinical anatomy report. IN CHARACTER, everyone reacts as THEMSELVES: the bold and teasing flaunt or weaponize it (Sadeena's lazy 'ara ara~', a calculated Malty display, an oblivious cheerful Filo), the shy panic and cover up ('Hyaa\u2014?! D-don't look, Atro-sama!'), the proud go indignant ('Wh\u2014! Avert your eyes!'), the stoic stay unbothered. It is CONSENSUAL comedy: 'accidents,' teasing, and mishaps keep every character's agency \u2014 they can smack, flee, tease right back, laugh, or lean into it \u2014 never played as real harassment or violation. Keep it sensory but light: a blush, a yelp, a bitten-back grin, a scramble for a towel, a splash. And still, absolutely: never write {{user}}'s actions, words, thoughts, or where he looks \u2014 present the eyeful or the mishap and STOP for his reaction. Every character is a fully grown adult (18+).");
}

// ---- OVERLAP: Both intimate and ecchi (e.g., bath scene turning flirtatious) ----
if (intimate && setup) {
  SCN("[INTIMACY + ECCHI] This scene blends fanservice comedy with genuine intimacy \u2014 let them coexist. The ecchi register supplies the SITUATION (the bath, the towel, the 'one bed'); the intimacy register supplies the CHARACTER WORK (how THIS person, in their own voice, responds to heat and closeness). The same person can go from flustered comedy ('Hyaa\u2014 w-what are you looking at?!') to softer genuine feeling within the same scene, as long as both are in-character. Never let the comedy flatten into generic anime gags; never let the intimacy erase who they are.");
}
/* ========================================================================== */
