# 07 — AU "Redo" Design Doc (the Five-Hero AU)

The finalized design for the rebuild. Faithful to canon **except** for one change:
a **fifth Holy Weapon (the Axe)** and a **fifth summoned hero ({{user}})**. Everything
the canon does, it still does — only now there is a fifth.

---

## 1. Core premise
- **Five Holy (Legendary) Weapons:** Shield, Sword, Spear, Bow, **Axe**.
- **{{user}} = the fifth summoned hero, the Axe Hero.** Summoned from Earth, male,
  knew this world as a video game (like the other four — though his version's
  details are his own). Behavior, alignment, party, and romance are **player-defined**;
  only his anchors are fixed (he IS the Axe Hero, summoned at the S1E1 ritual).
- **Always-five world:** five Holy Weapons have been known throughout history; the
  summoning ritual calls five. The fifth hero is normal lore, not an anomaly.
- **Faithful + elastic:** every canon arc still happens, unaltered (the betrayal of
  Naofumi included — that plays out exactly as written). The plot is
  railroaded-but-elastic (the DxD model): the player can complicate/redirect, but
  canon advances on its own.

## 2. Knock-on changes from the fifth weapon
- **Seven Star Weapons:** the Axe is promoted to Holy tier, so the old Seven Star
  Axe is **replaced by a Hammer**. (Mald now wields a stolen Seven Star **Hammer**.)
- **Religion:**
  - Church of the **Four Heroes** → Church of the **Five Heroes** (worships all five).
  - Splinter Church of the **Three Heroes** → splinter Church of the **Four Heroes**:
    worships **Axe / Sword / Spear / Bow**, still brands the **Shield** a devil.
  - **Consequence:** the Axe Hero starts **revered/favored** alongside Sword/Spear/Bow;
    Naofumi remains the scorned outcast. {{user}} begins in the privileged camp but is
    free to side with anyone — including Naofumi.
- **Cosmology:** the Axe had its **own, originally-unfused world**, later merged with
  the shield+bow world and the sword+spear world. The extra fusion makes this world
  **more unstable — Waves are more frequent and more violent** than in canon.
- **Guardian Beasts:** canon has four (Spirit Tortoise/Genbu, Phoenix/Suzaku,
  Dragon King/Seiryū, Kirin). The AU adds the **fifth and final Symbol — Byakko, the
  White Tiger.** The **Hakuko ("White Tiger") demi-humans** (Atla, Fohl) are framed as
  its mythic kin/namesake, quietly tying their bloodline to the new beast.

## 3. {{user}} — the Axe Hero (anchors)
- Summoned-from-Earth male; the fifth Holy Hero.
- Starts **revered** by the Church of Five and the mainstream public (unlike Naofumi).
- **Player-defined:** personality, morality, who he allies with, his party, and his
  romances. The bot fixes only that he is the Axe Hero present from the summoning.
- **Party:** not pre-written. The bot **dynamically assigns available canon NPCs** to
  {{user}} during the canon recruitment beats (slave market, etc.).
- **[OPEN ITEM]** Optional: 5–6 light, non-party-locked **original NPCs** for world
  flavor (a rival adventurer, a merchant, a knight, etc.). Awaiting final yes/no.

## 4. The Holy Axe — full spec
**Identity:** the Holy Weapon of pure offense — the "executioner's edge," the exact
inverse of the Shield. The **highest raw destructive output in the world** and the
**lowest defense of any hero** (no native guard/barrier). It doesn't need a defender:
its survival is *preemption and lethality* — kill it before it lands. The drama/cost
lives in the **Rage curse**, not in fragility.

**Shared systems (same as all Holy Weapons):** Weapon Copy (absorbs axe-class arms —
hatchets, battleaxes, halberds, cleavers, war-picks — to unlock forms/passives), the
full multi-method power-up system (mastery/refinement/enchant/skill growth), and
Class-Up at a Dragon Hourglass.

**Core signature mechanics:**
- **Returning Edge** — hurl the Axe; it flies back to hand (melee *and* ranged).
- **Recall** — instantly summon the Axe to hand, or blink to it (his "mobility defense").
- **Fracture** — split into multiple lesser axes (dual-wield / fans of blades).
- **Phantom Edge** — manifest spectral copies for multi-target barrages.

**Skill progression (named):**
- *Early:* **Cleave**, **Rend**, **Returning Edge**, **Splitstrike**.
- *Mid:* **Reaver's Cyclone** (AoE whirlwind), **Tempest Hurl** (long-range homing throw),
  **Phantom Edge** (clone barrage).
- *Class-Up:* **Aegis-Breaker** (strips/ignores enemy defense — the signature anti-Shield
  trait, the one weapon that can crack even a Shield), **Storm of a Thousand Edges**
  (clone storm), **Executioner's Verdict** (single-target execution finisher).
- *Guardian-tier:* **Byakko's Maw** — a White-Tiger-empowered form drawn from the fifth
  Guardian Beast (the Axe's parallel to Naofumi's Spirit Tortoise Shield).
- *Capstone:* **Worldcleaver** — the apex strike; severs almost anything in one blow.

**Curse Series — the Carnage Axe (Rage):** unlocked through fury/loss. Colossal offense,
but {{user}} **loses control** — strikes friend and foe, can't disengage, escalating
self-harming bloodlust. The outward-erupting twin of Naofumi's inward Wrath Shield.

**"Will" — the Resolute Axe:** when {{user}} **masters** the rage instead of feeding it,
the Axe enters **Will**, purging the Carnage corruption and converting that fury into
*controlled* devastation. Not a Blessed form (those stay Shield-only) — the disciplined
parallel to rejecting the Wrath Shield, and a recurring growth beat: choose Will over Rage.

## 5. Tone & content
- **Canon tone preserved:** heavy drama — betrayal, prejudice, slavery, war; grim early,
  warming over time. Dark themes kept intact.
- **Added layer:** an optional **harem/romance route with ecchi elements** for {{user}}.
  Romance availability is **AI/elastic-defined**; canon pairings (esp. Naofumi ↔ Raphtalia)
  stay intact unless the player actively, persistently diverges.
- **All characters are adults (18+).** (Per the compendium's adult policy.)

## 6. Scope
- **Open at the classic Season-1, Episode-1 summoning.** Single-player {{user}}.
- **Fully map Seasons 1–2;** provide guidelines/spine for the rest (through the later
  arcs toward the Vanguards/Medea).

## 7. Build plan (for the GO phase — not yet started)
- **Card:** {{user}} anchors (Axe Hero, summoned, revered start, player-defined) + the
  reusable rule blocks + voice/tone. Five-hero framing.
- **ONE combined weapons lorebook script** (`lore_weapons.js`): all five Holy Weapons'
  abilities + the Carnage/Will lines + (briefly) the Seven Star/Hammer + vassal context,
  gated so each ability injects only when it's relevant in RP — one script firing, not five.
- **Other lore scripts** (built on the universal template): characters, world system,
  factions/nations, waves/worlds, arcs/timeline — adapted for the five-hero AU.
- **Master engine (PRO):** Wave **clock** (the doom-countdown), **reputation/standing**
  meter (Axe Hero revered vs. Naofumi scorned), relationship meters, time/header,
  arc/flag progression; offscreen world-movement; comedic/dramatic pacing per tone.
- **Greetings:** the S1E1 summoning (the five heroes called together).

---

## Status
Design **locked** except the one open item: **5–6 optional flavor OCs — yes or no.**
Awaiting the GO to begin building (card → combined weapons lorebook → other lore →
master engine → greetings).
