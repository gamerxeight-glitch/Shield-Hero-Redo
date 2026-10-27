# Keyword-Triggered Plot Injector — Walkthrough & Template (JanitorAI Scripts)

A standalone script that watches the recent chat for **trigger words** and, when one appears, quietly injects the matching **plot content** into the bot's scenario as reference for the LLM. No director script, header line, or checkpoint required.

This document is written so it can be handed to **any LLM** along with your plot notes, and it can produce a working script. Section 8 is a copy-paste brief for that LLM.

---

## 1. How it works

Every time the bot is about to reply, the script runs once, from scratch:

1. **Scan** — joins the last `SCAN_DEPTH` messages (user *and* bot) into one lowercase, punctuation-normalized string.
2. **Match** — for each plot entry, counts how many times any of its `keys` appear. An entry with zero hits is ignored. An entry whose `not` keys appear is also ignored.
3. **Rank** — sorts the matched entries by `pri` (highest first), then by how many hits they had.
4. **Budget** — goes down the ranked list and injects each entry's `text`. If the full `text` would go over `BUDGET`, it uses the shorter `brief` instead. If even that doesn't fit, the entry is skipped. Nothing is ever cut off mid-sentence. It stops after `MAX_ENTRIES`.
5. **Inject** — appends a one-line framing `HEADER` plus the chosen entries to `context.character.scenario`. The model sees this as reference for this one reply. The reader never sees it.

**Important behaviors to understand:**

- **No memory.** Each turn is a fresh run, so the script can't "remember" that a plot already happened. An entry fires only while its keywords are in the last `SCAN_DEPTH` messages, and fades once they scroll out.
- **It scans the bot's own replies too.** If the model keeps naming the plot's people or places, the entry keeps firing. That's how a plot "sticks" while it's being talked about. It's also a trap (see 4.6).
- **Injected content is NOT scanned.** It goes into the scenario, not the chat, so entries can't trigger each other directly. They only chain if the *model* writes another entry's keyword into its reply.
- **Progression without state = staged entries.** To make a plot unfold over the course of the chat, split it into stages (setup → clue → reveal), each with its own triggers that only come up once the story gets there.

---

## 2. Platform assumptions

Based on working JanitorAI scripts (the Shield-Hero-Redo lorebooks):

| Item | Used as |
|---|---|
| `"use worker";` | Required first line |
| `context.chat.last_messages` | Array of `{ message: "..." }`, the recent history |
| `context.chat.last_message` | String, the newest message |
| `context.character.scenario` | String you append to. This is what the model reads |
| `{{user}}` inside injected text | Gets replaced with the user's persona name |

Write the code in **plain ES5**: `var`, `function`, `for` loops. No arrow functions, `let/const`, template literals, `Object.fromEntries`, and so on. This matches the scripts already known to work and avoids engine compatibility surprises.

---

## 3. The template

Only edit `CONFIG` and `PLOTS`. Leave the engine alone.

```js
"use worker";
/* ============================================================================
 * plot_injector.js — KEYWORD-TRIGGERED PLOT INJECTOR (standalone)
 * Scans the last few chat messages for trigger words. When an entry's keyword
 * appears, its content is appended to the scenario as hidden reference for the
 * model. No header, checkpoint, or director script required.
 * Edit only CONFIG and PLOTS. Assign at Depth 1.
 * ========================================================================== */

/* ==============================  EDIT ONLY THIS  ========================== */
var CONFIG = {
  SCAN_DEPTH: 4,      // recent messages scanned for keywords (user + bot)
  MAX_ENTRIES: 3,     // most entries injected in one turn
  BUDGET: 3000,       // most plot-content characters per turn, HEADER not counted (~4 chars = 1 token)
  HEADER: "[PLOT REFERENCE] Background for the current scene. Weave it in naturally; never quote it, never mention it, and never use it to act, speak, or decide for {{user}}."
};

var PLOTS = [

  /* ---------- PLOT: The Missing Caravan (stage 1 — setup) ---------- */
  { name: "Missing Caravan — setup",
    keys: ["caravan", "merchant guild", "halvard", "silver road"],
    not:  [],
    pri:  8,
    text: "[Plot — The Missing Caravan] Three nights ago a six-wagon caravan of the Merchant Guild vanished on the Silver Road between Ashford and Dunmere. Guild master Halvard Brennick, a heavyset man who sweats when he lies, has posted a 50-gold reward for news of it. Town gossip blames the Redcap bandits, and the town guard has stopped looking. Halvard is visibly afraid of something beyond lost profit: he deflects every question about what the wagons carried and wants the matter settled quietly and fast. The road's last waystation keeper, old Marta, saw the wagons leave at dusk, escorted by hooded riders who wore no Guild badges. Default flow: Halvard pushes the reward on anyone capable, Marta talks only if treated kindly, and the bandit story falls apart under real scrutiny. {{user}} may take the job, ignore it, or dig in their own way; the world reacts, it never decides for {{user}}.",
    brief: "[Plot — The Missing Caravan] A Guild caravan vanished on the Silver Road 3 nights ago. Halvard Brennick offers 50 gold, blames bandits, and nervously dodges questions about its cargo. Old Marta at the waystation saw hooded riders with no Guild badges escort it at dusk." },

  /* ---------- PLOT: The Missing Caravan (stage 2 — reveal) ---------- */
  { name: "Missing Caravan — reveal",
    keys: ["manifest", "false bottom", "hidden cargo", "grey cloak", "gray cloak"],
    not:  [],
    pri:  9,
    text: "[Plot — The Caravan's Real Cargo] The wagons had false bottoms carrying crates of blackpowder that Halvard was secretly smuggling to Baron Ostrel, who is quietly arming for a coup. The grey-cloaked riders are Ostrel's men; they 'lost' the caravan on purpose and moved the powder to the abandoned Kessler quarry. Halvard is terrified because the Baron now holds his debts and his silence. Reveal this ONLY as fast as {{user}} uncovers it in-scene (a recovered manifest, a found false bottom, a captured rider). Characters admit only what they personally know: Halvard knows the cargo and the buyer; the riders know the quarry; Marta knows neither.",
    brief: "[Plot — The Caravan's Real Cargo] False-bottom wagons smuggled blackpowder for Baron Ostrel's coup. His grey-cloaked men hid it at Kessler quarry. Halvard is blackmailed. Reveal only as {{user}} uncovers it." },

  /* ---------- EXAMPLE: exclusion keys ---------- */
  { name: "The Thorn Crown",
    keys: ["thorn crown", "the crown"],
    not:  ["crown prince", "crowned"],
    pri:  6,
    text: "[Lore — The Thorn Crown] A blackened iron circlet said to grant its wearer command over the dead at the cost of one living memory per use. Last seen in the vault beneath Dunmere's ruined chapel. Most people think it is a children's tale.",
    brief: "[Lore — The Thorn Crown] Iron circlet; commands the dead, costs one memory per use; rumored in Dunmere's chapel vault." }

];
/* ========================================================================== */


/* ===========================  ENGINE — LEAVE ALONE  ======================= */
context.character = context.character || {};
context.character.scenario = context.character.scenario || "";

/* lowercase; unify curly quotes; turn punctuation into spaces; collapse spaces */
function norm(s) {
  return String(s || "").toLowerCase()
    .replace(/[\u2018\u2019\u02bc`]/g, "'")
    .replace(/[\u201c\u201d]/g, '"')
    .replace(/[.,!?;:"()\[\]{}<>*_~=+\/\\|#@\-\u2013\u2014\u2026]/g, " ")
    .replace(/\s+/g, " ");
}

var _c = context.chat || {};
var _msgs = _c.last_messages || [];
var _parts = [];
for (var i = Math.max(0, _msgs.length - CONFIG.SCAN_DEPTH); i < _msgs.length; i++) {
  var _m = _msgs[i];
  _parts.push(_m && _m.message ? _m.message : "");
}
_parts.push(_c.last_message || "");
var SCAN = " " + norm(_parts.join(" ")) + " ";   /* padded so " word " keys match at the edges */

function countHits(keys) {
  var n = 0;
  keys = keys || [];
  for (var a = 0; a < keys.length; a++) {
    var k = norm(keys[a]);
    if (!k.replace(/\s/g, "")) continue;           /* ignore blank keys */
    var at = SCAN.indexOf(k);
    while (at >= 0) { n++; at = SCAN.indexOf(k, at + k.length); }
  }
  return n;
}

var hits = [];
for (var j = 0; j < PLOTS.length; j++) {
  var e = PLOTS[j];
  if (!e || !e.text) continue;
  var n = countHits(e.keys);
  if (n <= 0) continue;
  if (e.not && countHits(e.not) > 0) continue;
  hits.push({ e: e, n: n, pri: e.pri || 5, idx: j });
}
hits.sort(function (a, b) { return (b.pri - a.pri) || (b.n - a.n) || (a.idx - b.idx); });

var used = 0, out = [];
for (var h = 0; h < hits.length && out.length < CONFIG.MAX_ENTRIES; h++) {
  var full = hits[h].e.text, brief = hits[h].e.brief || "";
  var body = "";
  if (used + full.length <= CONFIG.BUDGET) body = full;                       /* prefer full */
  else if (brief && used + brief.length <= CONFIG.BUDGET) body = brief;       /* fall back */
  else continue;                                                             /* never truncate */
  out.push(body);
  used += body.length;
}
if (out.length) {
  context.character.scenario += "\n\n" + (CONFIG.HEADER ? CONFIG.HEADER + "\n" : "") + out.join("\n\n");
}
/* ========================================================================== */
```

### Entry fields

| Field | Required | Meaning |
|---|---|---|
| `name` | no | Label for you. The script ignores it. |
| `keys` | **yes** | Trigger words/phrases. If **any** of them appears, the entry fires. |
| `not` | no | Exclusion words. If any appears, the entry is suppressed this turn. |
| `pri` | **yes** | Priority 1–11. Higher wins when too many entries fire. |
| `text` | **yes** | The full reference content. |
| `brief` | recommended | A short fallback used when the budget is tight. |

---

## 4. Picking trigger words

The engine does a **plain substring search** on normalized text: lowercase, curly apostrophes unified, punctuation turned into spaces. So `"silver road"` matches *"Silver Road,"* and *"the silver-road"* alike. Everything below follows from that.

### 4.1 What makes a good trigger
1. **Proper nouns first:** character names, place names, faction names, named items, named events. They're specific, so there are few false triggers.
2. **Distinctive multi-word phrases** next: `"false bottom"`, `"merchant guild"`, `"blood moon"`.
3. **Plain nouns last, and only if they're unusual in this setting.** `"caravan"` works in a city-intrigue bot but not in a desert-trader bot, where it comes up every turn.

### 4.2 Cover how people will actually say it
For each entry, list the ways **both the user and the bot** might bring up the topic:
- Full name, first name, surname, title, nickname: `"halvard"`, `"brennick"`, `"guild master"`.
- Common misspellings or variants: `"grey cloak"` **and** `"gray cloak"`.
- Natural phrasing the user would type: `"the reward"`, `"the missing wagons"`.

Aim for **3–8 keys** per entry. Fewer than that misses mentions. More than that usually means some of them are too generic.

### 4.3 Substring traps, and how to fix them
A substring matches **inside** other words:

| Key | Accidentally matches | Fix |
|---|---|---|
| `"king"` | taking, asking, kingdom | Use `"the king"` / `"king aldric"`, or pad it: `" king "` |
| `"ren"` | children, current | Pad it: `" ren "` (spaces = whole word) |
| `"art"` | start, heart, party | Use a longer phrase |
| `"ash"` | wash, dash, Ashford | `" ash "` or `"ash cult"` |

Rules:
- **Keys under 5 letters must be space-padded** (`" ren "`) or be part of a phrase.
- **Padding means whole word only.** `" king "` won't match *"kings"*. Add the plural as its own key if you want it.
- **No padding = also matches longer forms**, which is sometimes what you want: `"smuggl"` matches smuggle, smuggler, smuggling.
- Punctuation turns into a space, so `" ren "` still matches *"Ren,"*, *"Ren."*, and *"—Ren—"*.

### 4.4 Use `not` for known collisions
If a good key has one bad meaning, exclude that meaning instead of dropping the key. For example, `"the crown"` with `not: ["crown prince", "crowned"]`. Use this sparingly, because a `not` hit blocks the whole entry for that turn.

### 4.5 Apostrophes
Models often output curly apostrophes (’). The engine converts them, so `"marta's"` matches *"Marta’s"*. Simpler still: leave possessives out of keys entirely. `"marta"` already matches *"Marta's"*.

### 4.6 The leak rule (most important for plots)
Because the bot's replies are scanned too, **an entry's `text` must never contain the trigger words of a later stage.** If the setup text says "the cargo manifest," the model will probably write "manifest," and that fires the reveal right away.

- In the setup, hint at it ("he dodges every question about what the wagons carried") without using the reveal's keys.
- Reveal keys should be words that only come up **once the story reaches that point**: the clue, the discovery, the confrontation.

### 4.7 Quick self-test
For every key, ask: *"Would this show up in an ordinary reply that has nothing to do with this plot?"* If yes, make it more specific, pad it, or drop it.

---

## 5. Writing the content (`text` and `brief`)

The model gets this text with nothing around it, mid-scene, possibly next to two other entries. Write it so it **can't be misread on its own**.

### 5.1 Structure for `text`
Write it in this order, as one paragraph or a few short sentences:

1. **Label:** `[Plot — Name]` or `[Lore — Name]` at the very start, so the model knows what kind of info this is.
2. **What's true right now:** the situation, in present tense, as facts.
3. **Who's involved:** full names, a one-line description, and **what each one wants**.
4. **Where/when:** a concrete place and timeframe.
5. **Stakes / pressure:** what goes wrong if nobody acts.
6. **Default flow:** how the world moves if {{user}} doesn't step in. Describe the NPCs' actions, not {{user}}'s.
7. **Secrets & reveal conditions:** what must stay hidden, and exactly what in-scene event unlocks it.
8. **Hard limits (optional):** "{{user}} may engage, ignore, or redirect this; never act for {{user}}."

### 5.2 Rules
- **Facts, not prose.** It's a reference sheet, not narration. Concrete details beat adjectives: "sweats when he lies" is better than "suspicious."
- **Fully self-contained.** Repeat names instead of using "he/she" where it could be unclear. Never write "see above," "as mentioned," or refer to other entries.
- **Never script {{user}}.** No "{{user}} decides to…" and no "{{user}} feels…". Offer options ("{{user}} may…") or describe only the world.
- **Knowledge boundaries.** Say who knows what, so NPCs don't share information they couldn't have.
- **Directives: few, explicit, and attached to a condition.** "Reveal ONLY when {{user}} finds the manifest" works. A vague "be mysterious" doesn't.
- **No meta.** Never mention keywords, scripts, entries, or "the system."
- **Don't fight the system prompt.** Plot entries add world facts. Tone, format, and agency rules belong in the custom prompt.
- **Mind the leak rule (4.6).**

### 5.3 `brief`
A compressed version of `text`: same label, then only the facts that matter most (who, what, the key secret, the reveal condition). It's used when several entries fire at once.

### 5.4 Length guide

| Field | Target | Hard ceiling |
|---|---|---|
| `text` | 400–1,200 chars | Must be less than `BUDGET` |
| `brief` | 100–300 chars | About ¼ of `text` |

### 5.5 Bad vs. good

**Bad:**
> The caravan is a big mystery! Halvard is very suspicious and hiding something dark. The user will investigate and discover the shocking truth about the manifest.

What's wrong: no label, vague adjectives, scripts {{user}}, and it leaks the reveal keyword "manifest."

**Good:** see the "Missing Caravan — setup" entry in the template above.

---

## 6. Priorities & tuning

### Priority bands
| `pri` | Use for |
|---|---|
| 10–11 | Main plot reveals; facts that must win when there's a conflict |
| 7–9 | Active plot threads, major NPCs tied to a plot |
| 4–6 | Side plots, flavor lore, rumors |
| 1–3 | Nice-to-have background |

Give a reveal stage a **higher** `pri` than its setup. When both fire, the newer truth should win the budget.

### CONFIG
| Setting | Typical | Higher means | Lower means |
|---|---|---|---|
| `SCAN_DEPTH` | 3–6 | Plots stay active longer after they're mentioned | Plots fade quickly, fewer stale injections |
| `MAX_ENTRIES` | 2–4 | More context, more chance of confusing the model | Tighter focus |
| `BUDGET` | 2,000–4,000 chars | Richer reference, more tokens used | Leaner, `brief`s get used more often |

If you run several lorebook scripts on one bot (characters, world, plots), they all add to the same scenario. Keep the **combined** budgets reasonable for the model's context.

---

## 7. Testing checklist

- [ ] The file starts with `"use worker";` and passes `node --check plot_injector.js`.
- [ ] Every string is valid JS: inner `"` escaped as `\"`, line breaks written as `\n`, no raw line breaks inside strings.
- [ ] Every key is lowercase; keys under 5 letters are space-padded or part of a phrase.
- [ ] No key commonly shows up in unrelated replies (4.7).
- [ ] No entry's `text`/`brief` contains a later stage's keys (4.6). Check it mechanically: normalize each entry's content the same way the engine does and search it for every *other* entry's keys. Even near-misses count, because `"grey cloaks"` contains the key `"grey cloak"`. Only the **earlier → later** direction is a problem. A reveal that names the setup's people (e.g. "Halvard") just makes the setup fire too, which is fine, because the reveal outranks it.
- [ ] Every `text` and `brief` starts with a `[Plot — …]` / `[Lore — …]` label.
- [ ] No entry writes {{user}}'s actions, words, thoughts, or feelings.
- [ ] Every `text` is shorter than `BUDGET`; every `brief` is clearly shorter than its `text`.
- [ ] Live test: mention each plot's keyword in chat and confirm the bot clearly uses the content. Then mention something unrelated for `SCAN_DEPTH` turns and confirm the plot fades.

---

## 8. Brief for an LLM building the script (copy-paste)

> You are building a JanitorAI keyword-triggered plot injector script.
>
> **Use the template in Section 3 exactly.** Copy the ENGINE block word for word. Only fill in `CONFIG` and `PLOTS`. Plain ES5 only.
>
> **Input:** the user's plot notes (below). If the notes are missing who/what/where/stakes/secrets for a plot, ask before writing.
>
> **Process:**
> 1. Split each plot into stages (setup → clue(s) → reveal → aftermath), one entry per stage. Standalone lore (items, places, factions) gets one entry each.
> 2. Pick 3–8 trigger keys per entry following Section 4. Proper nouns first, cover variants, pad short words, and add `not` keys for known collisions.
> 3. Write `text` following Section 5.1–5.2, and a `brief` per 5.3, within the 5.4 lengths.
> 4. Assign `pri` per Section 6. Reveals rank above their setups.
> 5. Enforce the leak rule: no entry's content contains a later stage's keys.
> 6. Run the Section 7 checklist and fix anything that fails.
>
> **Output:** (a) the complete script file; (b) a short table listing each entry → its keys → what fires it in-story; (c) any collisions or assumptions you weren't sure about.
>
> **User's plot notes:**
> *(paste here)*

---

## 9. Limits & upgrade path

- **No "already happened" memory.** If a plot needs to stay resolved (for example, the caravan is found and should never resurface as a mystery), add an `aftermath` entry triggered by resolution words, give it a higher `pri`, and keep the setup's keys narrow. For real persistent state, pair this script with a state-tracking script like Shield-Hero-Redo's `master_director.js`, which writes a checkpoint every turn that other scripts can read.
- **No time/phase gating** in this template. That's also what the director pattern adds (Shield-Hero-Redo gates entries with `minEP`).
- **Substring matching isn't semantic.** "The wagons that disappeared" won't fire `"caravan"` unless you add `"wagons"`. Cover phrasing on purpose.
