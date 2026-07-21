# THE VOYAGE — Gameplay Audit, Recommendations & Execution

*Audited and executed on branch `claude/gameplay-audit-features-g0cpfz`. The game was run
end-to-end in a headless browser before and after every change: title → set sail → deck →
cargo hold → ashore → village by day → swimming → fishing. Everything marked ✅ below is
implemented on this branch and was verified live with screenshots; nothing here is
speculative.*

---

## 1. What the audit found

The engine already had a strong skeleton — a mathematically correct azimuthal Earth, a
seamless ship↔shore loop, wind bands, rivers, storms, a dive layer and a fly layer. But
measured against "make the game as real as possible", these were the gaps:

| # | Finding | Severity |
|---|---------|----------|
| A1 | **Surface swimming looked like drowning.** Entering water left the body bolt-upright, bobbing at chest height with flailing arms — no prone stroke, no buoyancy, no splash. | High |
| A2 | **The world felt dead.** Villagers wandered to random points and stopped. Nobody tilled, fetched, fed, herded, hunted, sold, bought, fished or played. Animals ignored wolves, hunters and the player. | High |
| A3 | **Towns were a small speck** — 3–5 huts in a tight ring; cities capped at ~10 homes with a thin market. | High |
| A4 | **The ship was small and hollow-less** — a short brig with no crew, no interior, no cargo space; it could not have read as a vessel for twelve. | High |
| A5 | **The player's hair was a ragged fringe**, not the clean straight Steve cut. | Medium |
| A6 | **No player verbs beyond walking** — no fishing, no speaking to people, nothing to *do* ashore besides open doors. | High |
| A7 | **The open sea had no other sails** — no passing ships between landfalls. | Medium |
| A8 | **Physics gaps** — no water-entry splash, no haul-out onto low shores from a swim, no buoyancy model at the surface. | Medium |

---

## 2. Recommendations → all executed ✅

### R1 — Real swimming physics ✅ (fixes A1, A8)
- The body now floats **at the wave surface** (it samples the same Gerstner field the ship
  rides) instead of standing on the seabed line.
- Swimming forward: **prone front-crawl** — the body lies flat in the water, arms wheel
  over alternately, legs flutter-kick, and kick-spray splashes trail behind.
- At rest: **treading water** — upright but sunk to the shoulders, sculling arms, slow
  kick, head above the swell. No more "standing drowning".
- **Splash bursts** on every water entry (bigger for a plunge), on dives, on casts and on
  catches — a pooled sprite system (`splash()`/`splashTick`).
- Swimmers can now **haul out onto low shores** (up to ~2 blocks) instead of being walled
  in by the beach.

### R2 — A living world: intelligence, tasks, completion and routes ✅ (fixes A2)
A task engine (`nextTask` → walk route → do the work → next task) replaced random
wandering. Every villager now holds a calling with real waypoints and working animations:

- **Farmers** walk their own field's rows and swing the hoe (one farmer per farm).
- **Women carry water** — well → home → well, jar on the head, pausing to fill.
- **A feeder scatters grain** at the pen — and the **chickens flock to her** while she feeds.
- **The herder watches the flock**: any sheep/goat/cow that strays too far from the pen is
  walked down and *driven* home (the beast turns and trots penward).
- **The hunter patrols the outskirts** with his spear and **stalks hares and deer**; prey
  that notices him bolts.
- **Wolves hunt the pigs** (and sheep, chickens, hares): a wolf skulks in from the hills,
  picks the nearest prey, runs it down; the prey flees in panic and bolts for the pen; the
  herder and hunter **drive the wolf off** if they get near. The same predator/prey chase
  runs in the open wilds (wolves and lions vs. the ambient herds).
- **Children play tag** — real chase-and-catch with role-swapping and a hop on the tag —
  and gather to the **teacher for the morning lesson** (08:00–13:00 schedule).
- **Vendors stand at their stalls and hawk goods**; **shoppers** walk home → stall →
  stall → home rounds. Every village now has a market stall or two, not only cities.
- **A fisherman stands at the pier's end** with rod, line and bobber, casting all day.
- **Men and women walk about** — folk of both builds (women with long hair and full-length
  robes) stroll, shop and stand to talk.
- **Everyone goes home at dusk** to their own hearth (villagers now pass through their own
  doorways instead of being stuck at walls), and animals flee the player when crowded.

### R3 — Real interaction mechanics ✅ (fixes A6)
- **Speak with anyone** — walk up to a villager: `F — speak`. They stop, turn to face you,
  and answer with lines fitted to their calling (herder, hunter, vendor, child, sailor…).
- **Player fishing** — stand on a strand or pier facing open water: `F — cast a line`.
  A rod, line and bobber appear; the float bobs, then plunges (`F — STRIKE!`); catches are
  named (bream, mullet, musht, barbel…) and counted in the ship's log. Fish escape if you
  are slow; moving or jumping reels you in.
- One prompt system now prioritises: sleep → doors → hold hatch → speak → fish.

### R4 — A much greater ship: twelve souls and a cargo hold ✅ (fixes A4)
- The ship is **doubled in every dimension** (~110 m galleon) — draft, collision probe,
  boarding ranges, wake and cameras all rescaled.
- **A walkable cargo hold below deck**: an open hatchway amidships with a ladder
  (`F — go below to the hold` / `F — climb up to the deck`), plank floor, hull ribs, rows
  of stacked **barrels, crates and grain-sacks**, and ever-burning lanterns, seen in
  first person. The sea no longer washes through the hull below the waterline.
- **A crew of six keeps the deck alive**: a lookout at the bow shading his eyes, a mate on
  the quarterdeck scanning the sea, and hands who walk the waist and haul on lines.
- **Benches along the bulwarks** — seats for twelve and more besides the crew.

### R5 — Steve hair ✅ (fixes A5)
The traveller's head is redrawn Minecraft-Steve-fashion: dark brown hair in a **clean,
straight fringe** with sideburns, a full bowl on top and round the back, white eyes with
violet-blue pupils, the nose and mouth in their places.

### R6 — Bigger, denser towns ✅ (fixes A3)
- Villages: **6–9 houses** (was 3–5) on a wider ring, **2–3 farms**, market stalls, more
  hay, more lamp posts, a pen — and ~15–18 people plus ~7–11 beasts each.
- Cities: **14+ homes** by default, larger plazas, stalls registered as real workplaces
  with vendors and shoppers.

### R7 — Sails on the horizon ✅ (fixes A7)
Two lesser **trader ships** ply the same seas — they appear on the horizon, hold their
course, steer off the shoals, heave on the same swell, and pass by. The deep is not empty.

---

## 3. Verification

- `node --check` passes; the game was booted headless (Chromium/Playwright) with **zero
  page errors** through: title → sail → deck walk → hatch → hold → ashore → village
  (18 people, wolf present, stalls/farms/pen confirmed in the live village record) →
  open-water swim (crawl + tread verified) → fishing (cast prompt, bite, catch counters).
- The offline `three.min.js` fallback path was exercised (CDN blocked in the sandbox) and
  works.
- Saves were bumped to v5 (adds the fish tally) and remain backward-compatible with v2–v4.

## 4. Further recommendations (not yet executed — future work)

1. **Trade loop**: buy cargo cheap at one city's stalls, sell dear at another — the hold
   already exists to carry it; add a coin count to the log.
2. **Named NPC dialogue trees** — two or three exchanges deep, with a rumour system that
   points to the nearest undiscovered land.
3. **Boarding the traders** — hail a passing ship, come alongside, trade at sea.
4. **Player hunting** — a throwable spear using the hunter's stalk/flee logic already in place.
5. **Weather-driven tasks** — folk shelter indoors during storms; fishermen stay home.
6. **Small-island data upgrade** (50 m coastlines) — the one remaining item from the older
   review, for richer mid-ocean landfalls.
