"use worker";
/* ============================================================================
 * intimacy.js — KEEP CHARACTERS ALIVE in intimate scenes (Five-Hero AU)
 * Keyword-gated: fires ONLY when a scene turns flirtatious/physical/sexual or
 * enters the afterglow. Injects craft guidance so no character or NPC ever goes
 * flat, robotic, or generic while flirting, seducing, having sex, or after it —
 * they stay fully THEMSELVES, emotionally present, reactive, and imperfectly
 * real. This does NOT loosen any hard rule: every character is a 18+ adult, you
 * NEVER speak/move/decide for {{user}}, and show-don't-interpret still binds.
 * Assign at Depth 1 alongside the lorebooks (before master_director).
 * ========================================================================== */

context.character = context.character || {};
context.character.scenario = context.character.scenario || "";
var _c = context.chat || {};
var SCAN = (((_c.last_messages || []).slice(-4).map(function (m) { return (m && m.message) ? m.message : ""; }).join(" "))
    + " " + (_c.last_message || "")).toLowerCase();
function SCN(t){ context.character.scenario += " " + t; }
function has(list){ for (var i=0;i<list.length;i++){ if (SCAN.indexOf(list[i])>=0) return true; } return false; }

/* ---- tiers (broad on purpose; only fires when the scene is already intimate) ---- */
var FLIRT = ["flirt","seduc","tease","teasing","sultry","purr","lean in","leans in","bite her lip","bites her lip","bite his lip","lip","husky","breathy","blush","flush","straddl","in your lap","in his lap","close the distance","whisper","murmur against","press against","pressed against","trace a finger","run a finger","undress you with","bedroom eyes","come-hither","proposition","make a move","chemistry","tension"];
var PHYS  = ["kiss","kissing","kissed","caress","nuzzle","nibble","undress","undo his","undo her","unlace","unbutton","unzip","strip","bare skin","bare shoulder","bare thigh","naked","undressed","grind","grope","fondle","hands roam","hands wander","pin him","pin her","pinned","onto the bed","into the sheets","in bed","against the wall","clothes off","peel off","tug at his","tug at her","hard against","soft against"];
var SEX   = ["sex","make love","making love","thrust","thrusting","moan","moaning","gasp","writhe","arch","arches","panting","pants against","rock against","rocking","buck","climax","finish inside","inside her","inside him","take him","take her","ride him","ride her","between her","between his","grip the sheets","cum","orgasm","heat of","tangle of limbs","skin on skin","joined"];
var AFTER = ["afterglow","aftermath","catch their breath","catching her breath","catching his breath","breathing slows","breathing steadies","spent","sated","satisfied","collapse beside","collapses beside","collapse onto","curled against","curled up","tangled together","tangled in the sheets","pull the blanket","pull the sheet","pull him close","pull her close","hold her close","hold him close","cuddle","nestle","post-coital","after they","after it's over","when it's over","lying together","lie tangled","drift off","catching our breath","clean up after","cleaned up"];

var flirt = has(FLIRT), phys = has(PHYS), sex = has(SEX), after = has(AFTER);

if (flirt || phys || sex || after) {
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
/* ========================================================================== */
