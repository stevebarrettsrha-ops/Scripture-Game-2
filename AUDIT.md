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

## 4. Second round of recommendations → all executed ✅

1. **Trade loop** ✅ — coins ("shekels", starting purse of 30) and a 24-unit cargo
   manifest, saved with the voyage (save v6). Every market stall opens a trading panel
   (`F — trade at the stall`): eight goods (grain, oil, wine, salt, cedar, cloth, spices,
   purple dye) priced by a fixed per-land factor (0.6×–1.6×), so every land is cheap in
   some things and dear in others — buy low, carry it over the deep in the hold, sell
   high. Fish of your own catching sell at every market. Purse and manifest show in the
   ship's log.
2. **Named NPC dialogue** ✅ — every villager bears a seeded name (Yoram, Tamar,
   Elazar, Miryam…) shown with their calling. Speaking again goes deeper: two lines of
   their trade, then a **rumour** — the compass direction and distance to the nearest
   coast you have *not* yet visited — then a farewell.
3. **Hailing the traders** ✅ — from the helm or deck, a merchantman within hail shows
   `F — hail the merchantman`: she backs her sails and heaves to alongside, and the same
   trading panel opens at sea — at her prices (she buys cheap and sells dear).
4. **Player hunting** ✅ — `Q` (or the 🗡 button) casts a spear along your gaze; it
   arcs, takes hares, deer, fowl, pigs — or a wolf threatening the pen — tallies game in
   the log, and stands planted in the earth where it misses.
5. **Weather-driven tasks** ✅ — when a storm cell passes over a village the lanes
   empty: folk hurry indoors to their own hearths (the fisherman leaves the pier), and the
   beasts huddle at the pen until the sky clears.
6. **Mid-ocean landfalls** ✅ (delivered as **uncharted isles** rather than the 50 m
   dataset) — rare procedural islets now rise from the open deep between the great
   coasts: sandy cays with palms in the warm belts, bare northern rocks elsewhere. They
   appear on no chart and bear no nation — the HUD names them only **AN UNCHARTED
   ISLE** when you stand on one.

Also in this round: **the beam widened 1.4×** (the hull is now scaled 2.8× across to
2.0× along), with the deck bounds, hold aisle, hatch, crew stations, wheel zone, boarding
points and cameras all rescaled to match — she sits notably broader on the screen.

## 4b. Round 3 — real water ✅

- **A shoal map of the whole disc** (chamfer distance-to-land of the country map,
  blurred smooth) now drives the water shader: every coast and river carries a band of
  **clear turquoise shallows**, rolling off into the **dark of the true deep**.
- **Light passes through the shallows**: water transparency follows real depth, and the
  sandy shelf (now three terraces sloping to ~9 blocks down, and no longer hidden by the
  old sea-bed plane, which sits properly deep) is **visible through the water** along
  every strand — while the deep keeps its darkness and its near-opacity.
- **Reflections**: a much stronger fresnel term truly mirrors the sky at grazing angles
  (with a mirror-skin rise in opacity), the sun's specular path burns brighter on the
  swell, and a caustic sparkle plays where the light reaches the sand.
- **Shore-lapping surf**: lines of white wash march down the shoal gradient — each line
  of foam wraps the coastline and runs up the strand in turn, broken ragged by the water
  texture so no two waves break alike — with a standing, breathing line of wash right at
  the water's edge.
- **The swimmer's eye dips under**: the swim camera now rides low along the waterline,
  and when a swell rolls over it the whole world turns to water-light — turquoise fog,
  the pier piles and the sea floor looming, the surface seen from beneath — until the
  wave passes.
- **A stone standing in the glass**: every landmass now continues below the waterline —
  coastal flanks plunge past the surface down to the bed of the sea, the sandy shelf is
  built of solid terraces rooted in the bed (never a floating sheet), and pier piles
  stand on the bottom. Seen from under the swell, the land connects to the sea floor the
  way a stone sits in a glass of water.
- **One sea, one bed**: the free-dive world and the coastal shallows are unified. The
  dive layer's procedural seabed now reads the same shoal field as the surface water, so
  the floor rises to meet the shelf at every land's foot and slopes away seamlessly into
  the kelp, coral and wreck basins (verified profile: −12 at the strand → −65 at 500 →
  −112 at 1400). No ridge breaches the surface near a coast, and **the land's flank
  stops the swimmer** — no passing through the stone into the island.
- **Swim straight down into the deep**: hold SHIFT while swimming and you slip beneath
  the waves in place into the dive world; SPACE at the surface brings you back up to
  swimming. Strand → shallows → kelp deep → surface, one unbroken body of water.
- Verified from the beach, from a low aerial over a bay (sand terraces clearly visible
  through turquoise water, surf lines breaking along the shore), over the open deep
  (dark), at evening, from under the swell, and along the submerged coast in dive; the
  cargo hold is unaffected.

## 4c. Round 4 — living waters ✅

- **Breath**: diving now drains a breath bar (~75 s; shown under the HUD while below).
  A warning comes as the chest tightens; if the breath fails you break for the surface,
  gasping — never drowned, only driven up. Breath refills quickly above water.
- **The immortal breath** (🫧 button): a toggle — "the breath of the Almighty gives me
  life" (Iyob 33:4) — frees the diver of air altogether, to rove the deep at leisure.
  The choice is saved with the voyage.
- **The shallows teem in plain sight**: fish schools, turtles and dolphins now swim on
  whether or not anyone dives, visible from the deck, the strand and the air through the
  clear coastal water (verified: 30 fish and 6 dolphins live at the surface view).
- **Spear-fishing**: the spear (Q) hunts beneath the waves — slowed and drawn down by
  the water, true to the diver's tilt — taking fish, squid and puffers, each added to
  the fish tally and sellable at any market. Its flight is substepped so it can never
  skip through a quarry on a slow frame; it plants in the sea bed or the coast flank
  where it misses.

## 5. Further recommendations (future work)

1. **Cargo physically visible in the hold** — stack crates as the manifest fills.
2. **Port fees and rare goods** — one land-exclusive good per region for long routes.
3. **Reputation with villages** — spear a village's penned beast and the vendor's
   prices turn against you; drive off a wolf and they improve.
4. **Deeper quests** — a villager asks for a good from a named far land; deliver for a
   reward and a verse.
5. **Small-island real data** (50 m coastlines) if charted, nameable islands are wanted
   to complement the uncharted ones.
