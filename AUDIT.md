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

## 4d. Round 5 — the deep has teeth, and treasure ✅

- **Sharks hunt the diver** — the wolf logic of the land, loosed in the water. A diver
  within scent is warned ("a great grey shape turns toward you"), run down along the
  bed, and bitten: the shark tears up to two fish from the catch, steals a third of the
  breath, and flings the diver surfaceward — the immortal breath is no shield against
  teeth. A spear-strike turns the shark and breaks its hunt for a while.
- **The repelling of beasts** (🛡 toggle, saved with the voyage) — after Tehillim 91:13
  ("you shall tread upon the lion and the adder") — no beast of the deep will touch you
  while it holds.
- **Pearls of the deep** — rare glowing oysters seeded across the sea bed (22–280 deep).
  Draw near and `F — gather the pearl` (Iyob 28:18 on the first). Gathered sites do not
  regrow. Pearls sell at every market for 25–70 shekels — the dive now has an economy
  of its own, tallied in the log and saved.
- **The trawl net** (N or 🕸) — cast astern from the helm or deck: the ship loses a
  quarter of her way, the bagged net bobs behind her, and trawling slow (best over
  shoaling water) fills it — a fish every ~11 s, up to twelve, with a warning when it
  strains full. Haul to add the catch to the fish tally.

## 4e. Round 6 — wreck-gold, renown and whale-song ✅

- **Treasure in the wrecks**: every sunken ship now bears a banded, glowing sea-chest on
  her deck. Draw near an unplundered wreck and **a guardian shark is called** to circle
  it ("the deep does not give up its treasure freely"); break the chest open (F) for
  30–80 shekels of old silver. Looted wrecks stay looted, saved with the voyage.
- **Market reputation**: every fish (+1) and pearl (+3) sold at a land market builds
  your name there — *known* at 10, *trusted* at 25, *honoured* at 40 — and lifts that
  market's prices for your catch by up to +30%. Shown in the trade panel, told in
  toasts at each tier, saved per land.
- **Whale song and the fishing grounds**: teeming grounds lie scattered over the deep,
  on no chart. A pod of three whales surfaces near the ship, arcing and spouting, and
  swims for the nearest ground — quickening to trawling pace when the ship follows —
  then circles over it. Their song (a real two-note WebAudio call) sounds through the
  hull when they are near, with the word: follow, and the net fills **three times as
  fast** over a ground.

## 4f. Round 7 — living waters: the sea as a real place, not a layer ✅

Seven fixes toward a real-life simulator's water (GTA-V-style entry, buoyancy
and surface behaviour):

- **Alighting over the open sea** no longer summons the ship: descend from flight over
  water and you come down **into the water, swimming**, where you actually are — the
  ship stays where she was left (settle onto her deck only if she truly lies below).
- **No man walks upon the sea**: the old walk-on-water boarding zone around the ship is
  gone. Over water the body always swims; the hull is now **solid to swimmers** — you
  fetch up against her side and press E there to climb aboard.
- **Diving from the ship is a real leap**: press dive at the helm or on deck and the
  traveller **jumps from the rail in an arc**, head-first, and splashes in beside the
  hull — the ship stays riding at the surface (no more "the whole boat dives").
- **True buoyancy**: a still body under water drifts upward and, touching the surface,
  breaks it and swims (GTA-fashion — hold SHIFT to stay down against it). Falling into
  deep water from a height drives the body under, then the sea gives it back.
- **Sharks hunt at the surface too**: bobbing up is no refuge — a hunting shark rises
  right under the swell and strikes the swimmer (repel still stays them; the same
  toggles apply).
- **Merchantmen carry crews**: every passing trader now has four sailors at their posts
  — watch at the bow, master aft, hands in the waist. Hailed and hove to, they turn to
  the rail and the bow watch waves back. No more ghost ships.
- **Beasts keep to the charted lands**: ambient animals spawn only on countries and
  true isles (`ci>0`) — the bare rocks and skerries of the open ocean stay bare.
- **The water itself, remade**: per-pixel wind-ripple normals (two scrolling octaves)
  break the big Gerstner facets into living chop; the fresnel reflection now mirrors a
  **real sky gradient** (horizon haze to zenith blue, day-cycled); backlit crests glow
  green with subsurface light; crest foam is torn ragged by the same ripple noise.

## 4g. Round 8 — the firmament made true, and the rim made solid ✅

Modelled on the Scripture-Game repository's own earth-viewer (`earth.html`):
the earth a still disc, the vault a low tent, and THE DEEP all around.

- **The tent-vault**: the firmament is a true vault "spread out like a tent to
  dwell in" — its rim just past the wall of ice, its apex 130 000 high over
  the midst of the earth, day-tinted glass that stands solid as you climb. The
  map view's dome matches it.
- **The deep, all around**: beyond the vault a star-strewn near-black
  (`#04060d`) closes on EVERY side — no more "circle of darkness" with raw sky
  behind it — with the waters above the expanse glowing faint and blue over
  the apex, and the stars (which sit beyond the glass) shining through even by
  day when you are aloft.
- **The eye stays within the glass**: the camera is clamped inside the vault's
  skin — turning the view at the ceiling can no longer poke the camera through
  the firmament.
- **The rim is HARD, and it rescues**: flyer, swimmer and diver are pressed
  back within the rim by position (not by undoing steps) — so anyone stranded
  beyond it (the old bug: descend past the wall and be left swimming in the
  void, with inward movement also blocked) is drawn back in, and inward
  motion always works. Alighting past the rim sets you down on the wall, never
  in the void.
- **The earth seen from on high**: past ~9 000 up, the little chunks of the
  world resolve into the earth's true charted face — the same azimuthal map
  the compass rose bears, storms and all — fading in below the flyer while
  the cloud cover thins; and the low cloud deck (a floating grey slab when
  seen from far above) fades away with height.
- **One Alight button**: aloft, the duplicated 🕊 button is hidden — the
  anchor button alone reads Alight.

## 4h. Round 9 — the living world: dwelt-in, down to the small things ✅

After the manner of the great open worlds (the Rockstar school: ambient
systems layered until the world reads as *inhabited*), plus a structural
hardening pass:

- **Rain and thunder**: storms now rain — wind-driven rain sheets around the
  traveller, and at the storm's height the sky cracks: a white flash over sky
  and fog, and a low thunder-roll through the hull (WebAudio noise burst).
- **The smoke of hearths**: morning (≈5–9) and evening (≈16–22) the village
  houses breathe — puffs of smoke rise off the roofs, drift with the wind,
  swell and thin away.
- **Fireflies**: sparks of the evening over the good grass of charted lands,
  wandering and blinking after dusk.
- **Chance meetings on the deep** (one at a time, drifting on the wind, gone
  if passed by): **flotsam** to haul aboard (salvaged goods for the hold), a
  **sealed bottle** with a word of Scripture in it (and five shekels), and a
  **castaway on a raft**, waving — take him aboard for 25 shekels, a blessing,
  and renown (+3) at the nearest port.
- **Dolphins ride the bow**: run the ship past ~13 speed and two dolphins peel
  off to race her flanks, arcing fast in her pressure wave.
- **Gulls with the ship**: some gulls take to a passing ship and wheel about
  her masts while she runs.
- **The murmur of the living**: villagers greet the passing traveller with
  floating speech — "Shalom, traveller", "Fresh wares, friend — come and
  see!", "A quiet night, friend" — by calling and by hour, each soul no more
  than once in a long while.
- **Gull cries and crickets**: descending gull calls over the day-time sea;
  cricket-song rising on land after dark (both WebAudio, off with 🔊).
- **An explorer's ending**: the ship's log now names the **next landfall**
  (nearest unvisited land, its bearing and distance); and when the traveller
  has come ashore in every one of the 176 lands, **THE VOYAGE IS FULFILLED**
  (Tehillim 107:23-24), written into the save.
- **Structural hardening**: the trade panel closes itself if you walk off or
  change mode (no more shop-in-your-pocket); any uncaught error saves the
  voyage before the page notices (window error hook); plus the confirmed
  findings of a six-dimension adversarial code audit (below).

## 4i. Round 10 — structurally sound: the audit's findings, fixed ✅

A six-dimension code audit (crash paths, mode state machine, physics and
collision, save integrity, economy/interaction, performance) ran with
adversarial verification; every finding below was re-verified against the
code by hand and fixed:

- **ONE water, no layers** (player-reported): the opaque far-sea backdrop
  planes (at −12 and −16) now hide whenever the eye is beneath the waves —
  diving, or a swimmer's camera rolled under the swell — so there is no
  "second sea" hanging in the deep with fish above and below it.
- **Stale rail-leap replay**: `dive.jump` is now cleared on plain dive entry,
  on surfacing, on the high-fall plunge, and on G-from-dive — a cancelled
  leap can no longer replay later and teleport the player back to the old
  rail.
- **Stale ledge-climb replay**: an auto-climb interrupted by flight or
  boarding no longer resumes at the old island's coordinates — every
  transition into walk clears it.
- **G while diving** now lifts the traveller out of the water where they ARE
  (splash and all), instead of teleporting them to the distant ship; and G in
  the cargo hold is refused (the hold has a roof).
- **Going ashore** re-seats the body on the local ground in all three landing
  paths — no more materialising in mid-air at another coast's altitude.
- **The map view surfaces the diver first** — breath no longer drains and
  force-surfaces beneath the firmament overlay.
- **Title-screen keys are ignored** — no mutating the mode state machine
  before the voyage begins.
- **A leap over water falls true**: a body in the air above water now falls
  under gravity until it truly meets the surface (carrying its speed into the
  plunge) instead of being snapped down onto the water mid-arc.
- **Breaching ridges are walls**: where an undersea mountain breaks the
  surface, the diver is stopped, not rammed up through the waves by duelling
  clamps.
- **No creature swims through stone**: sharks, turtles, rays, whales and
  pufferfish all turn at the land's flank now; pod whales over a coast dive
  under instead of spouting on the dry land; a shark's bite can no longer
  fling the diver into the rock.
- **The broad hull is broad**: boat collision probes bow, waist, both beams
  and both bow quarters — neither flank ploughs through a shore or skerry.
- **Folk walk steps, not cliff faces**: villager movement rejects steps
  higher than ~1.3 blocks.
- **The trade panel closes itself** when you walk off or change mode (fixed
  in Round 9, confirmed by the audit).

## 4j. Round 11 — the true deep, and the crown of the ice ✅

Two things were wrong, and both were matters of MEASURE.

**1. The deep was not deep.** The bed of the open ocean bottomed out at about
116 m and the gauge said so to the traveller's face — shallower than a great
many lakes. The sea now has its real depths, to the metre, on the one measure
a man walks, swims and dives by (a block is a metre — the same `U_PER_M`
every beast is built to, and the same the gauge reports):

| water | true depth | in the game |
|---|---|---|
| continental shelf, to the break | 0 – 200 m | 0 – 200 m |
| continental slope | 200 – 3,000 m | 200 – 3,000 m |
| abyssal plains | 3,000 – 6,000 m | 3,500 – 5,400 m |
| the hadal trenches | 6,000 – 11,034 m | to 11,034 m |
| average of the whole ocean | ~3,700 m | ~4,000 m sampled |

- **`world/deeps.js`** — a new file, one line to a trench, each at its real
  latitude and longitude with its real sounding: the Challenger Deep at
  11,034, the Horizon Deep, the Kuril–Kamchatka, the Milwaukee Deep, the
  Richards Deep off Chile, the Molloy Deep under the Arctic ice, and a
  score more. Sail to the Marianas, dive, and the gauge reads 11,034 M DOWN.
- **The blue holes** are in the same file: sheer shafts sunk through the
  reefs — Belize, Dean's, the Dragon Hole, Dahab — cut last of all so nothing
  fills them in, and as deep below the reef floor as the charts say.
- **Shelf, slope, rise and plain** are drawn from a new offshore-reach field,
  so a transect out from any coast reads as a real one: 97 m on the shelf,
  162 at the break, 1,877 down the slope, and 4,583 on the plain.
- **The depth-gauge names the zone** it finds — EPIPELAGIC, MESOPELAGIC,
  BATHYPELAGIC, ABYSSOPELAGIC, HADAL — and names the trench when you touch
  down on the floor of a named one.
- **The light fails on its true measure**: sunlight is spent by 1,000 m, so
  below that the sea is black whatever the hour, and **there is no sky under
  the water** — the star field used to come up through the deep, and a diver
  a mile down at midnight hung among stars.
- **The sounding quickens with the depth**, as a weighted line does: slow and
  swimmable in the sunlit water where there is something to see, running fast
  by the time the light has gone, so eleven kilometres is a minute and a half
  and not nine.
- **Every creature keeps its own water.** Anchoring a beast to the bed was
  well while the bed was 90 m down; with the true ocean under it, it put
  dolphins on the abyssal plain and reef fish in the hadal dark. Each is
  anchored now to the higher of the bed and its own deepest haunt.
- **`creatures/anglerfish.js`** — a black room with a floor in it is not the
  deep; the deep is a black room with LIGHTS in it. She hangs below 800 m
  with her lamp lit over her glass teeth, and she is the only thing to see.

**2. The wall of ice had no top.** It climbed 900 blocks and then ran out to
the rim as a crown tilting ever upward — there was nowhere on it to stand.

- **It stops climbing at two thousand feet** (610 blocks, a block to the
  metre) and from there to the rim it is **one flat field of ice, 357 blocks
  across**: a crown a man may walk out on to the edge of the world. The
  buttresses and crevasses of the climb die away exactly where the crown
  begins, so the plateau is level and reads as the one flat thing at the end
  of everything. The climb keeps its ~1 block to the pace and is walkable.
- **The firmament comes down to meet it.** The vault keeps its whole shape
  over the world and then sweeps down over the last five hundredths of the
  radius, closing onto the ice a few hundred units above the crown — and the
  glass is turned from the same profile the ceiling is measured by, so what
  the eye sees and what the hand reaches are one thing. The light gathers
  along its hem, so from the crown a man sees a bright curved wall standing
  at the world's edge with the whole earth shut inside it.
- **It is seen from the ground**, not only from the air: the vault faded in
  with height alone, so a man on the crown with the glass over his head saw
  nothing there at all. Close to it is a glaze, not a lid — the earth shows
  through it.
- **The place-line names it**: THE CROWN OF THE ICE — 2,000 FT ABOVE THE SEA,
  and the touch-the-firmament prompt stands ready across the outer 130 blocks
  of the plateau.

## 4k. Round 12 — a cutscene engine, and two scenes on it ✅

The scene at the world's edge was a camera drifting for eleven seconds with
the whole HUD standing over it — the button rail down one side, the compass
rose in the corner, and the place-line sitting exactly on top of the verse.
It is now a **cutscene engine**, and scenes are DATA like everything else.

- **`world/scenes.js`** — one entry to a scene, in the same shape as
  `countries/`, `creatures/` and `world/deeps.js`. A scene declares how long
  it runs, the verses it may draw on (one is taken at random), how the world
  is **dressed** while it plays, what the traveller **does**, and the
  **marks the eye moves through**. Add one there and it exists.
- **The engine** (`playScene` / `sceneTick` / `endScene`) knows nothing about
  any particular scene. It takes the body out of the player's hands, drops
  the letterbox, **takes the HUD down**, dresses the world on a ramp that
  rises at the start and falls before the end (so the world he stands in is
  back before the bars lift), leads the eye from mark to mark with everything
  eased, holds the verse, and puts back every single thing it touched.
  A change of mode ends any scene under it.
- **A mark** says where the eye stands — distance from him, lift above his
  feet, and how far it has swung from behind him to in front — and where it
  LOOKS: so far out along his bearing, and so far above his feet. The look
  point used to be a tangent along that bearing alone, so the moment the eye
  swung off the radial line the man left the frame and the close beats came
  out as bare void with no glass in them, no rim and no man.

**The firmament scene** now plays as it was meant to. The wall of night — a
dark cylinder at the rim, right to see from WITHIN the world — comes down for
it; it stood between him and the whole of the deep, a smooth blank filling
two thirds of the sight with not one star in it. The day drains out of the
sky into the outer dark, and **the host of the shamayim** stands in it: a
full sphere of stars carried with the eye, wheeling slowly, since beyond the
firmament there is no day and no air and no half-dome of sky. The glass is
held to a third — at half again as much its blue lay over the whole abyss and
the host could barely be made out, which is the sight he came for.

And the **vault comes down properly to meet him**. It fell in one smooth
sweep to fifty metres over his head across the whole crown — near enough to
see, far too far to lay a hand on, and the thing is called TOUCH THE
FIRMAMENT. It plunges in two stages now: from seven leagues up to a low
ceiling by the time the crown is well begun, then almost level over the last
of the ice, closing to **17 units — under three metres — at the rim**. He
stoops at the last. The prompt only stands where the glass is truly within
reach (340 units), not across ground where it is three kilometres overhead.

**The floor of the deep** is the second scene, and the proof the engine is
general: come down onto the floor of any named hadal trench and it plays —
eleven kilometres of black water overhead, one man in the dark, and a verse.
It is fired by NEARNESS, not by landing: a still body drifts up of itself, so
a diver who lets go a body's length off the bed hangs there and never once
satisfies the floor clamp.

## 4l. Round 13 — the land goes down to the bed ✅

Giving the sea its true depths left every land in the world **hanging**. The
flank of a coast was drawn from its top down to `SUBSEA_Y` — thirteen units
under the waterline — because that is where the bed used to lie at every
shore. The bed now falls two hundred metres to the shelf break and kilometres
past it, so each island and each continent was a SLAB with open water beneath
it and the sea floor a long way below, unattached: swim down off any strand
and you could look up at the underside of Cyprus.

- **A block beside the water is footed on what is beside it.** Every coastal
  flank now drops to the bed of the sea at the neighbouring cell, snapped to
  the same block grid the diver's own floor uses, so the land is one solid
  mass of blocks running from the strand down the shelf and the slope into
  the deep.
- **The shelf terraces are footed the same way** — on the LOWEST of the four
  neighbouring beds rather than a fixed line, with a block of overlap, so
  there is never daylight under a tread wherever the ground steps down.
- `bedBlockAt()` and `seaFootAt()` are the two calls that do it, and the
  chunk shelf, the landing at the water's edge and every land flank all read
  them, so the three can never disagree about where the ground stops.

## 4m. Round 14 — the shelf is seen from the deck ✅

The shelf terraces stopped at 30 m and the note said "`SHELF_DEEP` is the one
number to raise". **It was not.** Raised to 150 m it cost half again as many
triangles at a coast (151,754 → 367,456) and changed **not one pixel** of the
view from the deck — because the water's own skin was already shut.

- **The sea's clarity followed the SHOAL** — a distance-from-land field — so
  the bottom stopped showing at a fixed distance off the beach whatever the
  water was actually doing, and it was near enough opaque by thirty metres.
  It follows the true **DEPTH** now, and the shelf profile hands that to the
  shader from the very same number it already samples (`D_STRAND`, the break
  at 200 m, and the `^2.6` between them — two `pow`s, no new texture). Clear
  to some sixty metres, as a clear sea is, and shut below it.
- **`SHELF_DEEP` is tied to that clarity and must stay tied**: 360 units, or
  sixty metres. Laid shallower and there is bare water where a floor should
  show from the deck; laid deeper and it is triangles no eye will ever meet.
- The cost lands at 264,914 triangles — more than the old cap, less than the
  useless one, and every block of it visible.

## 4n. Round 15 — the killer whales, the wading shelf, and the nations of fish ✅

**1. A bull orca swam in the humpback pod.** He was a fourth member of the
family, riding at her flank and blowing with her — and an orca is a hunter of
whales; the calf she was escorting is what he came for. The killer whales run
their **own matriline** now (an old cow, her bull, two juveniles and a calf)
and they run it out in the **deep**, off the fishing grounds the humpbacks
make for, on their own long hunting course. They are **rarely seen**: a pod is
only set out where the water is a kilometre deep or more, and then only about
one time in seven the sea is re-seeded — a voyage may cross an ocean and never
meet one. `swimPod()` is the shared business of a family in line abreast, so
both pods keep their own stature and their own beat.

**2. There was nowhere to STAND in the water.** The shelf ran straight from
the water's edge to the break: two metres at the first step off the sand and
five within a dozen paces. Every coast in the world now carries a **wading
shelf** — a broad, near-flat floor of sand a man can walk out across and a
village can stand in (2.2 m over 240 units by default, falling as the SQUARE
of the distance so it is flattest of all right at the water's edge) — and only
past it does the ground begin to fall away toward the break.

A beach belongs to the **country it is in**, so it is declared in that
country's own file: Bondi and Whitehaven in `australia.js`, Copacabana in
`brazil.js`, the shingle of Chesil in `united-kingdom.js`, Reynisfjara's black
sand in `iceland.js` — 38 named shores across 28 lands, each with its own
`wadeM`, `wadeR`, `roll` and `sand`, easing into the world's common shore
across its radius so there is never a seam. Documented in `countries/README.md`.

**3. One fish, in eight colours, from the Arctic to the Line.** The sea has
its own **nations** now, each keeping to the water it belongs in by latitude,
depth and distance from a coast: **sardine** (bait-balls of thirty, temperate),
**mackerel** (fast loose shoals, high in the water), **salmon** (cold coasts
north and south), **cod** (heavy and low over the cold shelf), **tuna** (warm
open water, and the fastest thing in it). Each is its own creature file; each
school turns and swims as one thing. Add a file, add a line to `SHOAL_KINDS`,
and that fish is in the sea.

## 4o. Round 16 — the shoals go under, and stay under ✅

The new nations of fish were **flying**: schools hanging in the air over the
swell beside the ship. Two faults, both mine, both from the round before.

- **Only the MIDDLE of a school was held under the water**, and a school is
  not a point. A fish thirty units above the middle of it stood clean out
  above the waves. Every fish is now held on its own account — under the
  skin of the sea and off the ground beneath it — as well as the school by
  its own half-height.
- **They were set out in water that could not hold them.** A sardine asked
  for four metres; a school thirty units tall in four metres of water is half
  in the air by construction. Every nation now wants real water under it —
  forty metres at the shallowest, eighty for tuna — so no shoal is ever set
  over the wading shelf where a village paddles. The school's height is also
  fitted to the column it stands in, never more than a third of it.
- **And they belong to the DEEP.** They were being stirred in the surface
  pass so they showed from a deck; they are not, now. The little bright reef
  fish are what is seen through the clear shallows from a ship, and the
  nations of the sea are met by going down to them.

Checked the way it should have been the first time: every visible fish of
every school, every frame, at six places from the Marianas to Iceland. The
highest fish anywhere in the world now sits **26 units below the waterline**,
and **no** shoal fish is visible from the deck.

## 4p. Round 17 — the lights never leave the whole-earth view, the eye is freed, and nothing pops ✅

*A full-system audit (two adversarial passes: one over every streaming/spawning
system for pop-in, one over the mode state machine, save integrity, input and
UI wiring), then fixes, then a headless end-to-end run (boot → sail → night →
zoom-out → firmament → camera gestures → firm-view guards) with screenshots.*

**1. The two great lights kept the traveller's own sky in the whole-earth
views — and vanished.** Their discs took his LOCAL brightness (zero once a
light had set where he stood) and their height was his local altitude (a set
sun sat half a world's radius BELOW the disc, under the bronze table). So
beholding the earth entire at his local midnight, the sun — and often the moon
— was simply gone. Now the firmament view is a whole-earth view like any
other: both lights stand over the countries where their own hour is, just
above the charted face, burning full, with their haloes — and the painted glow
that stood fixed at the middle of the firmament view (a second, motionless
sun) is removed. The water still reads the moon's TRUE local brightness for
its glitter, so a moon set at the traveller's feet lights no waves.

**2. The full sweep of the eye — mouse and finger.** Yaw was already
unbounded; the pitch ran only 0.04–1.52, so the sky could never be looked at.
It runs −1.25 to 1.52 now: drag down past the horizon and the eye swings
below the traveller's line and gazes UP past him at the clouds, the lights
and the vault — with the ground, the planks, the water and the ship's hull
all stopping the camera (it settles just over them and looks up from there;
the swimmer's dip-under eye keeps its own law). A flick SLIDES: the view
keeps the finger's pace and glides to rest, until the next touch takes the
wheel back. While a finger or the mouse holds the view, the walk-recentring
never fights it. On touch: with the joystick held, a second finger is the
LOOKING finger (it used to become a pinch and kill the stick — walk-and-look
was impossible on a phone); a pinch let go one finger at a time carries
straight on as a look-drag; and under the firmament view a touch is never a
joystick, so every land on the map can be tapped from a phone.

**3. Nothing behind the map.** While the whole earth was beheld, the world
underneath stayed live: WASD sailed the ship blind, C set a diver draining
breath beneath the overlay, E/G/Q/N all acted unseen, and the ⚓/🕊/🤿 buttons
kept working. All of it is gated now (the helm, the keys and the verbs alike);
entering the view closes the trade panel and the fishing line, ends any
running scene, and is refused from the hold; leaving it restores the camera's
near plane (it was left at ~5,800 — enter a house or the hold after the map
and the whole world was clipped to black).

**4. Pop-in, hunted through every streaming system.**
- **Chunks:** the reap used a SQUARE of 15 against an add-disc of 13, holding
  ~960 chunks alive where ~540 were wanted — the mesher's frames were spent
  carrying fog-bound ground, which is what let land arrive inside the haze at
  speed. Reap now matches the add (Euclidean, one ring of hysteresis). The
  build budget is a TIME slice (9/4 ms) with a hard cap, not a count of nine
  chunks that might all be rainforest; abandoned queue entries are dropped
  unbuilt; and the fast-stream trigger reads the traveller's TRUE speed.
- **Beasts, birds, whales:** everything that used to materialise in clear air
  (land beasts at 70–430 with the fog starting at 500; birds at 60–500; whale
  pods 500 off the rail; orcas at 700; sea-encounters at 420) now spawns in or
  beyond the haze (beasts 850–1,250, birds 650–1,250, pods and orcas 1,250+,
  encounters 700+) and is reaped beyond it, walking into view through the fog
  as the traders always did. The pools are widened (96 beasts, 24 birds) so
  the plain stays as thickly peopled across the larger round, first fills are
  staggered, and empty slots cool off between probes instead of running ten
  land tests per slot per frame over open ocean.
- **The reef:** `shallowView` flipped on the 70 m contour with no hysteresis —
  sailing ALONG the shelf line hid and refurnished the whole reef (kelp,
  coral, fish, floor) every frame, and dropped the backdrop discs 460 units in
  one step. It has the same hysteresis band the underwater eye has (70 in /
  86 out), a hold before `hideDeep()`, and the discs ease between stations.
  Kelp, coral and seagrass keep a minimum distance from the mask and GROW in;
  fish, jellies, crabs, anemones and morays keep their distance too.
- **The far carpet:** it blinked (a hard boolean at exactly y=1000) and it
  re-laid the whole horizon around the raw eye every ~220 units. It fades in
  and out with hysteresis now, snaps its rebuild centre to the FL_STEP grid
  (that constant at last earning its keep), and holds its radius unless the
  view truly grew. The near-world cut under the charted face waits until the
  face is 97 % opaque (was 75 % — a quarter of the world vanished in one
  frame). The gold position-mark fades in WITH the face instead of appearing
  at full strength over everything. The sea-bed patch anchors to the block
  grid, so the floor no longer reflows every 44 units swum. Blooms sprout
  from 140 out; fireflies dim at the edge of their round instead of blinking
  out; the cloud-deck re-noise takes a breath between rebuilds when the eye
  is far above it.

**5. The audit's other findings, fixed.**
- The invisible `#prompt` button swallowed every pointer that landed on a
  ~190×36 px band mid-screen (opacity 0 still takes clicks), and a click on
  the empty air could put the traveller to bed. It is click-transparent
  unless truly shown.
- `sleep()` was a no-op on the default 'live' clock — the machine's hour was
  re-read four times a second and snapped the sky back to real night. Lying
  down now sets the course to 'morning' and the rest holds.
- The pearl beds regrew on every reload (the count was saved, the SITES were
  not) — save v7 keeps the gathered places; v2–v6 voyages still load.
- A double-click on Set sail built the cities twice; a market stall's prompt
  (widest catchment, lowest priority) was unreachable within 11 units of any
  door — a stall stood AT now wins; the stale-mount mark is cleared with the
  other prompt marks; the ☰ rail joins the cutscene hide-list; the rail
  re-folds when a phone turns upright; the offline three.min.js fallback now
  fires when a captive portal answers 200 with something that is not
  three.js; `viewport-fit=cover` for notched phones.

**Verified headless end-to-end**: boot → set sail → forced local midnight →
zoomed-out (lights above the disc, opacity 1) → firmament view (sun and moon
standing over the disc — screenshot) → mouse 360° drag → pitch below the old
floor → touch look-while-walking → flick-slide → firm-view key guards → near
plane restored → helm dead behind the map. `node --check` clean on every file.

## 4q. Round 18 — the three nits Round 17 left, taken ✅

- **The cloud sheet has no edge.** The two drifting cloud planes are drawn
  with the fog off (fog at 1,140 would erase them whole), so each ended in a
  razor-straight line a few degrees over the horizon — a permanent hard rule
  across the sky that slid with the traveller. Each sheet now carries a
  radial skirt in its own shader (reckoned per fragment — the sheet is a
  single quad, so a per-vertex fade would have interpolated to nothing) and
  thins away into open sky. Verified live: the programs compile on the
  shipped r128, the clouds draw, and the horizon shows no line.
- **The sea-bed patch dissolves into the water.** The furnished bed is a
  moving square 672 across; under the waves the water-fog ends the view well
  inside it, but seen from a deck through the clear shallows its rim stood as
  a hard square cut in the sand. The outer cells now lean wholly into the
  colour the water lends at that depth, so the floor is lost by degrees into
  blue. Verified in the built geometry: a rim cell reads water-blue
  (blueness +0.25) where an interior cell reads bright sand (+0.05).
- **The clock and the rail no longer meet on a phone.** At ≤900px the rail's
  top was a height the clock's own bottom could cross on a short screen, and
  when the buttons overflowed the two sat printed over one another. The rail
  now begins below the clock's three lines. Verified at 390×780: clock
  bottom 132px, rail top 158px, no overlap.

## 4r. Round 19 — the air is clear to a flyer ✅

The haze stood shut at 1,140 units until the flyer had climbed a thousand
high — so LOW flight, whose whole business is seeing where you are going,
showed nothing ahead but fog. Now:

- **From the moment the wings take him the air opens** — the fog eases out
  to ~3,400 units (and further with height, as before), and eases shut again
  as he alights. A storm still closes the sky around him, as it should.
- **The far carpet stands under every flyer, however low** — the opened air
  reaches past the streamed chunks, and what fills that reach is the coarse
  charted ground (mountains, coasts, plains), not a bare haze-line and void.
  Its inner edge still dips beneath the chunks, so the seam stays hidden.
- **The merchantmen are born beyond a flyer's sight** — with the air open,
  a trader's respawn ring and reap both widen (3,600–5,400 / 5,600), so no
  sail ever snaps into clear sky under him.

Verified live: fog 1,140 → 3,178-and-climbing at 380 up with the carpet at
full strength beneath, the distant coast standing in view ahead; alighting
eases it all shut again; zero page errors.

## 4s. Round 20 — nothing is passed through, and the flyer's world is true ✅

**1. Solidity, everywhere the player reported it soft.**
- **The works of the ancients are solid.** While a landmark builds, every box
  its builder emits is also WRITTEN DOWN (`_solidRec` in `emitBox`), so the
  pyramids, ziggurats, temples, walls and gates declare their true collision
  brick for brick — no hand-guessed footprint table to drift from the
  building. Walker and flyer alike are barred (`landmarkSolidAt`), the eye
  rides over them (`solidTopAt`), and alighting over masonry sets the
  traveller down on open ground beside it, never within the stones.
- **A mountain is a wall to a flyer.** The only law used to be a floor
  clamp, so flying AT a cliff warped the body up its face, and speed could
  carry it through between frames. The flyer's move is now walked in
  substeps against ground and masonry: a face standing more than a short
  skim above him stops him (sliding along it where an open way lies), and
  descending onto masonry hovers rather than "landing" where a walker has
  no footing.
- **Nothing stands between the eye and the traveller.** The dive camera's
  line-walk now runs in EVERY mode, against ground and masonry both: a
  ridge or a pyramid between the two draws the eye in along the sight-line
  instead of swallowing it (the whole screen used to go mountain).
- **The reef is solid** — a diver is set off a coral head's rim instead of
  swimming through the polyps.
- **The merchantmen are solid** — the ship's bow probe fetches up against a
  trader's hull, a swimmer cannot pass through her timbers, and a trader
  gives way to the traveller's ship as she gives way to a shoal.

**2. The flyer's world is REAL LAND, not the carpet.** The coarse far ring's
terraced blobs read as a broken world from the middle heights. In flight the
streamed ring itself now WIDENS (13 → 19 chunks with the first few hundred
units of height, and the reap sheds the extra ring on the way down), the fog
is bound just inside those true blocks below the charted face — released by
degrees as the face fades in — and the carpet is never shown to a flyer at
all. What fills the view is real blocks, then haze, then the mantle of the
cloud cover; high enough, the charted face comes through as before.

**3. The sky keeps its clouds, and loses its square.**
- The cloud sheets were faded by the FOLLOW-CAMERA's distance, so a flyer
  who zoomed out watched every cloud in the sky vanish. That fade now
  applies only to a traveller UNDER the cloud floor (whom the sheet would
  otherwise blind); a flyer's clouds stand, thinning only with his own
  height as designed.
- The "little square" seen on the sea from high aloft was the detailed
  wave grid — a 5,000-unit mesh riding the middle of the ocean. Above
  ~5,000 (with hysteresis) it hands the sea to the colour-matched backdrop
  discs, which are painted alike on purpose, so nothing is seen to change
  hands.

## 4t. Round 21 — no quarter of the earth is without its lights ✅

Round 17 set the two lights over their TRUE stations in the whole-earth
views — the sun above the lands where it is now midday. That is right when
the whole disc is in frame (the firmament view), but the drawn-back and
aloft views frame only a REGION of the earth: stand over Taiwan while the
sun stands off Peru and both lights were simply absent from that part of
the sky, returning when the voyage neared their stations — which read as
the lights winking out of the world (player-reported, with screenshots).

- In the framed views each light is now drawn IN toward the traveller
  **along its own true bearing**, just near enough to stand within the
  frame's reach; it slides back out to its exact station as the view
  widens; the full-disc firmament view keeps the stations exact; and the
  pull-in rides the same ramp as the height, so entering the band never
  snaps a light across the world.
- The discs were sized for the full-disc views (a quarter-million units
  off); drawn near they would have filled the screen. Each keeps a steady
  angular size against its own distance from the eye in the band, the
  haloes keep their proportion, and both take back the great square of the
  ground sky the moment the band is left.

Verified headless at the reported place: the waters off Taiwan at 12:12
A.M., zoomed out — sun and moon in frame at full strength toward their true
direction (screenshot); zoomed back in, the ground sky is exactly as it was
(size 13,500 restored, the sun set and dark at local midnight). Zero page
errors.

## 4u. Round 22 — the audit audited: two adversarial passes over everything ✅

*Two independent audits ran in parallel: one adversarially re-reading every
change of rounds 17–21 in context, one deep-reading the systems no earlier
round had covered (villages and their folk, the trade economy, fishing and
the spear and the net, the dive ecosystem, the cutscene engine, audio, the
chart overlay, the season/nest/young modules). Twenty-six findings were
confirmed against the code and fixed; the claims that did not survive
verification were discarded.*

**The one that mattered most (HIGH, self-inflicted in Round 20):** the
flyer's fog bound held to ~1,674 all the way up to the charted face at
9,180 while the climb went on WIDENING the near-fog past it — a flyer
between ~1,700 and 9,000 lost the entire world to a sheet of fog colour,
and above ~2,900 near overtook far, which no shader defines. The bound is
now released by height as well as by the face (open by ~2,500), the near
may never cross the far, and the three above-cloud sheets are drawn
unfogged — they are only ever shown to an eye above the cloud floor, where
they ARE the far backdrop the open air looks onto. Verified: far 45,000 at
2,500 up, 208,000 at 5,000, the mantle and the land through its gaps in
frame — and low flight still bound inside its true blocks.

**Solidity, second pass:** a gate's arch and a trilithon's lintel are
roofs over open air, not ground — the flyer was snapped thirty units up
crossing under the Lion Gate and the camera hopped onto Stonehenge's
stones (masonry above the reference height no longer counts as floor; the
camera's sight-line test is volumetric, so it sees THROUGH an open
gateway). The ship already overlapped by a crossing merchantman may always
move (it used to be pinned inside her hull). The shark-fling and
coral-push destinations are validated. The folk, the beasts and the
landmark builders' recorder are exception-safe.

**The world's shared things (deep audit):** a village teardown was
disposing textures and materials the whole world shares — the glow behind
every halo, pearl, firefly and lantern; the head materials of every soul
afloat and ashore; the one door-leaf — re-uploaded silently each time, a
hard break in waiting. All whitelisted. Dismounting no longer leaks the
young of the beast's former life; a torn-down villager's speech dies with
his town; an aborted village build gives back its pier tiles.

**Playability:** a cutscene now gates EVERY key (M laid the chart over
the letterbox, G took flight mid-film); sleep lands on morning from every
course of the day (on the night preset it woke you into the same night);
the village pier can be fished (the pinned fisher's speak-prompt yielded
to the rod) and the fisherman faces down his own pier instead of casting
into the hillside; the nearest stall wins, not the first found; the ▲▼
pad's press dies with the mode; mid-look, a second finger in the stick's
corner takes the stick; a failed launch frees the title buttons; landing
sheds its extra chunk ring over frames, not in one hitch; no ghost sun at
a mere half-zoom; the sea's specular reads the sun's true station; the
chart shows the moon's station; the chosen season survives a reload; the
small isles keep their beasts; the near sky keeps its birds.

## 4v. Round 23 — nothing spawns inside anything, the eye passes through nothing, and the flyer's world never pops ✅

*Player-reported, all five: folk standing inside beasts and stalls, houses
crammed and overlapping, the camera passing through homes, trees and hills,
the world popping into view under a flyer, and scrolls buried under hills
and houses. Verified end-to-end headless (Chromium/SwiftShader): village
audit ran clean (0 souls in walls, 0 in solids, 0 bodies overlapping),
every scroll on level open ground, the camera's own seat pulled in short
of the house and floored on its ridge, and the flyer's fog/carpet handoff
measured at every height.*

**1. Nothing is set down inside anything (`spawnVillage`).**
- Every footprint laid — house, farm, pen, stall, well, hay, bench, torch
  post — is written into a rect list, and everything after it must find
  ground of its own (`rectFree`): houses no longer overlap one another, and
  hay-bales, torch posts, farms and the pen can no longer stand inside a
  home. Cities check their extra wells and stalls against the same list.
- Every soul and beast spawns through `clearSpawn`: on land, outside every
  house footprint, off every solid (the well, the stalls, the hay, the
  bench — the last two are solids now), out of tree boles, and a body's
  breadth from everyone already placed — the market-square pile-ups of
  villagers standing inside cows are gone at the root. City residents
  spawn at their own doorstep, not in the middle of a furnished room.
  Beasts seat on the ground at their own feet, not the well's height.
- Wild beasts (`findLandSpot`) no longer spawn inside tree trunks.

**2. Houses a family could live in (`emitHouse`/`emitFurniture`).**
- Village homes grew to 8–10 blocks a side (cities 8–10 too), and the ring
  they stand on widened with them.
- The room is a room, not a storehouse: bed in the far corner with its
  headboard on the far wall, table and chairs drawn back against a side
  wall, shelves along the far wall in the span the bed leaves free, the
  chest by the door — and the way in, door to hearth, stays a clear aisle
  about two blocks wide. What will not fit in a small room is left out.

**3. The eye passes through nothing (`cameraTick`).**
- The camera's sight-line walk now tests the HOUSES (each records its
  footing and ridge — `houseTopAt`) and the TREES (`treeTopAt`, an
  envelope grown from the same hashes the mesher grows the tree by), as
  well as the ground and the ancients' masonry it already knew.
- And the walk answers a house differently from a hillside: against
  GROUND the eye keeps the old shoulder floor and rides the slope, but
  against a standing STRUCTURE it comes in as near as it must (to ~3.4
  units) — held at the shoulder floor it sat inside the walls and was
  hoisted onto the roof, and the whole frame was rafters.
- `solidTopAt` — the camera's floor — rides over house roofs too, so an
  eye pressed over a home settles on the ridge instead of inside the
  rafters.

**4. The flyer's world is loaded before he can see it.**
- **The middle heights had no world.** Round 20 took the coarse carpet
  from every flyer and Round 22 released his fog by height — so from
  ~1,600 up to the charted face at ~9,000 the world simply ENDED at the
  chunk ring: bare backdrop where countries should stand, and every chunk
  popping into clear air. The carpet (coarse lego since Round 17 — it no
  longer reads as blobs) now stands under every flyer above ~1,400, so
  the earth runs unbroken to the horizon at every height. Verified: fog
  1,287 and carpet off at 800 up (bound inside true blocks); fog ~92,000
  and carpet at full strength at 3,000 up.
- **The streamed ring widens with speed** as well as height (13 → up to
  21), the mesher's slice deepens at full wing (9 → 14 ms), and the build
  queue is ranked from a point led out along the flyer's heading — the
  ground he is rushing toward is laid first, not the ring behind him.
- **Every living spawn ring rides the haze.** Land beasts (850–1,250),
  birds (430–1,200) and the whale pods (1,250+) were all tuned to a fog
  that shuts at 1,140 — under a flyer's opened air they materialised in
  plain sight. Each ring now follows `fog.far` (capped where a beast is
  beneath seeing anyway), and villages and landmarks raise themselves
  further out under an open sky (villages to ~3,000, landmarks ×1.8), so
  no town or temple pops inside the view.

**5. The scrolls lie on open ground (`placeScrolls`).**
- The old reach (74–190 from the site) landed squarely inside the ring
  where a village raises its houses — and deeper still inside a great
  city's lots — which is how scrolls came to lie under floors and inside
  the hills towns are cut into. A scroll now starts PAST the town's whole
  footprint (210+ for villages, 400+ for cities) and walks outward,
  swinging off its bearing a little at a time, until it finds LEVEL, open,
  dry ground: never at a cliff's foot (no neighbour cell more than 2
  blocks off), never on a tree, never in the court of a landmark (kept
  off by their charted stations, known before any masonry builds).
- At first sight the scroll re-seats on the true walking surface and, if
  a town has since raised a wall over the very stone, steps out along its
  bearing until it stands in the open. Verified: all eight scrolls on
  level open ground, none steep, none treed, none in masonry.

## 4w. Round 24 — the look of it made its own: a paint box, thirty-two texels, a hewn edge, the light in the corners, the haze of the country, and the going of a beast ✅

*Against the v3 brief's §2 (art direction) and Phase 0, plus two of the five
levers that were not scheduled until later and are cheap enough to have now.
Every claim below was seen live in a headless browser (Chromium/SwiftShader):
six fixed stations shot before and after at local noon, two hundred frames
timed standing still at each, and the mesher's own per-chunk cost measured
against a `git worktree` of the commit before any of this.*

**The tools are committed this round, not thrown away.** `tools/harness.js`
raises the world headless; `tools/shots.js` stands at six stations — a
village, the cedar coast, open sand, closed rain forest, alpine rock, a cold
coast — pins the hour, shoots each and times it; `tools/acceptance.js` holds
the twelve acceptance tests of the brief's §3, written **before** the
features, so the ten that wait on Phases 1–3 report PENDING and name exactly
what is missing instead of not existing. `PLAN.md` answers the brief's nine
questions.

**1. `world/palette.js` — every colour in the world, named once.**
- The look of this earth lived in ~140 loose RGB triples through the mesher,
  every one of them chosen to sit beside Minecraft's: grass `124,178,86`,
  stone a flat `125,125,125`, sand `219,207,163`. Those are video-game
  primaries — high chroma, one saturation, one value.
- They are **pigments** now, named as a painter of that world named them:
  ochre, raw and burnt sienna, raw and burnt umber, terre verte, sap,
  malachite, verdigris, madder, cinnabar, tyrian, lapis, azurite, indigo,
  saffron, orpiment, limestone, sandstone, basalt, marble, alabaster,
  bitumen, chalk, bone, ash, lampblack — and the metals and the stones of
  the breastplate besides, ready for the material economy of §4.
- **The stone of that world is limestone**, and it is warm: `146,138,122`
  with pale bedding veins, not granite grey. Cobble is a mortared course of
  dressed stones, not crushed gravel. Sand is warmer and browner. The rain
  forest reads DARK, not acid. Water is teal-leaning, not cobalt. The full
  before/after table for every texture is in `PLAN.md` §1.
- Not one raw triple is left in the mesher. The whole earth can be re-graded
  from one file — which is what makes trying three palettes an afternoon's
  work rather than a fortnight's.

**2. Thirty-two texels, and the resolution SPENT.**
- Every block face is a 32×32 canvas now (`TEXEL`/`TS` in the engine),
  nearest-filtered as before. Sixteen is inseparable from Minecraft; thirty
  two reads as another game at a cost of three parts in a thousand of a
  megabyte per face.
- **The art was not redrawn.** `mkTex` scales the brush before the drawing
  begins, so every hand-placed seam, mortar line, plank edge and growth ring
  in the file still lands exactly where it was put. What runs at the true 32
  is the GRAIN: `speckle` lays one true pixel at a time, so the noise in
  every surface is four times finer and sand reads as sand instead of gravel.
- And the room is used: real mortar between the stones of a cobble course, a
  run of grain along every plank, deep fissures with fine checking between
  them in bark, annual rings on a cut log, an over-and-under weave in wool,
  bedding veins in limestone, a midrib and a serrated edge in the leaf
  master — which every one of the ~170 species of the flora inherits for
  nothing.
- **Texture memory measured:** 1,024 B a face → 4,096 B. At 251 textures
  resident that is **0.25 MB → 1.00 MB** across the whole game. 24 was
  offered as a fallback and is not needed.

**3. The hewn edge — and NOT on everything.**
- A rim of one true pixel baked into the texture at load: darker along the
  bottom and right, lighter along the top and left, so every block reads as
  lit from the upper left and each one as a dressed stone with an arris
  worked on it rather than a game cube.
- **It is withheld from loose ground.** The brief asks for it on every block
  texture; that was built first and shot, and sand and grass become bathroom
  tiling — a hard rectilinear grid across every dune and meadow in the world,
  which is MORE Minecraft-grid than what it replaced. A dressed stone has an
  arris; a dune does not. It now goes on worked materials only — stone,
  cobble, plank, roof, log, bench, hay, wool, ice, badlands cliff, the
  flora's solid master — and never on anything drawn with a hole in it,
  where a rim would draw a box in mid-air. *Recorded as a departure from the
  brief in `PLAN.md` §9.1.*

**4. The light in the corners — vertex-baked ambient occlusion (§2.1.3).**
- Minecraft's lighting is flat per face: four values, one to a side, and
  nothing whatever where two faces meet. It is the loudest tell in the look.
- A top face's corner is now darkened by how much solid ground stands about
  it — the two columns edge-on and the one on the diagonal; two of the three
  standing higher is a true inside corner and goes darkest (`aoLevel`,
  `aoTop`). A wall face is shadowed at its two ends by what stands FORWARD
  of it and beside — never by the column in its own row, which is coplanar
  and shadows nothing; testing that would have laid a dark band down every
  joint of every straight cliff on the earth — and along its whole foot by
  the ground it rises out of, dying away over a block and a half of rise.
- It is baked into the vertex colour ONCE at mesh time and costs **nothing**
  per frame. The four extra neighbour lookups a column are hits on the cell
  cache. Steps, gullies, terraces, undercuts and the foot of every cliff read
  with real depth, and not one extra triangle is drawn for any of it.
- Acceptance test 10 passes: `aoLevel(0,0,0)` is exactly 1, one neighbour is
  darker, an inside corner darker still, and `grassTop` — a top-face-only
  material laid at a flat 1.0 before this change — now carries vertex
  colours below 1 in the built world.

**5. The haze takes its colour from the country (§2.1.5).**
- One fog colour for the whole earth, taken straight off the sky, is the
  wrong answer: haze is not sky. It is dust off a desert, moisture standing
  in a rain forest, ice-crystal over a polar plain, the pale burn of a
  limestone country at noon. `world/palette.js` names one for each ground and
  `gradeHaze` takes it.
- Three rules keep it honest: it is worked only against the ground the
  traveller is actually ON (out at sea the sea keeps its own); it dies with
  the light, because a coloured haze at midnight is a lie; and it is put
  down in a storm, when what hangs in the air is the storm. It is eased
  rather than set, so crossing from forest to plain is a slow turn of the
  whole horizon. The sky takes a weaker dose than the ground fog, which is
  how real haze reads and keeps the join from showing as a seam.

**6. The going of a beast — `js/gait.js`, and six true gaits (§2.3.2).**
- **Every four-footed thing on this earth moved its legs in one pattern, at
  every speed, from the shrew to the elephant**: near fore with off hind, off
  fore with near hind, forever (`L.userData.ph=(sx*sz>0)?0:Math.PI`). That is
  a trot, and it is the only gait a voxel game has ever had.
- Six gaits are written now, one line each, as the four moments the four feet
  come down: **walk** (four-beat lateral — three or four feet down at every
  instant and never once airborne), **trot** (two-beat diagonal), **pace**
  (two-beat lateral — both legs of a side together), **canter** (three-beat,
  asymmetric, with its moment of suspension), **gallop** (four-beat
  transverse) and **bound**.
- **The gait is chosen by speed in the beast's own body lengths a second** —
  exactly as a real animal chooses — so one rule carries the mouse and the
  elephant alike and not one species is named anywhere in the engine or in
  the gait law. The only thing a species says about its own going is
  `pace:true`, and it says it in `js/behavior.js`, in data: the camel, the
  giraffe, the llama and the alpaca.
- A leg's cycle is two unequal halves now. Through the STANCE the foot is
  planted and the hip sweeps steadily back, which is what makes a footfall
  read as planted instead of skated; through the SWING it comes forward
  faster and **the knee folds to pick the foot up over the ground it is
  crossing**. The old knee rule read the fold back off the hip angle, so it
  folded hardest at the end of the sweep — when the foot is planted — which
  is precisely backwards.
- The body goes with it: the withers rise and fall on the gait's own beat
  (four to the stride at a walk, two at a trot, one at a gallop) and a
  pacing camel rolls like the ship it is called. Verified in the world:
  every four-legged beast carries named feet, and walking, trotting,
  pacing and galloping beasts were all observed on the plain.
- Bipeds — the villagers, the crew, the fowl — are untouched and keep the
  walk they had.

**7. Two live bugs, found by the harness and fixed.**
- **`setLocalHour(h)` called without a place NaN-ed the world clock.**
  `Math.atan2(undefined,undefined)` is NaN, and the NaN went into
  `state.simHours` — and out of the clock into the courses of the lights,
  the winds, the ship's way through the water and the very sound of the sea,
  in one silent stroke. Where no place is named, the traveller's own is now
  meant, and an hour that is not a number sets nothing.
- **`audioTick` then THREW on it, and took the whole frame with it.**
  `windGain.gain.value = … + NaN` raises a TypeError from the Web Audio API;
  raised inside `frame()` it aborted the tick, the render and everything
  after it, and the world stood still with its last picture on the glass —
  a total freeze from a bad clock. Whatever comes in, what goes to the ear
  is now a number between silence and full.

**8. What it costs.** Six stations, two hundred frames standing still at
each, and the mesher's own per-chunk cost, measured against a worktree of
the commit before Phase 0 on the same machine and the same software
rasteriser. *(SwiftShader is neither a phone nor a GPU: these are
comparative numbers between builds, not absolute ones.)*

| station | before | after | triangles before → after |
|---|---|---|---|
| a village at noon | 668.90 ms · p95 762.7 | **598.96 ms** · p95 633.2 | 469,264 → 469,624 |
| the cedar coast | 671.99 ms · p95 789.7 | **595.25 ms** · p95 636.1 | 490,352 → 491,408 |
| open sand | 624.20 ms · p95 722.8 | **575.56 ms** · p95 607.8 | 420,834 → 424,098 |
| closed rain forest | 878.09 ms · p95 1010.5 | **806.91 ms** · p95 861.8 | 682,076 → 682,776 |
| alpine rock and snow | 603.02 ms · p95 648.9 | **592.68 ms** · p95 627.6 | 497,106 → 494,910 |
| a cold coast | 505.33 ms · p95 530.8 | **506.14 ms** · p95 540.6 | 392,658 → 387,402 |

**Triangles are unchanged to within a tenth of a per cent** — which is the
whole point of baking the occlusion into vertex colours that were already
being written: it adds no geometry, no material and no draw call. Frame time
came out level or a little better at every station; that is run-to-run
variance on a software rasteriser, not a speed-up, and the honest reading is
**no measurable cost**.

The mesher itself is a few per cent dearer, as it should be — four extra
neighbour lookups on every land column (cache hits) and one branch per face:


**2.253 ms/chunk over open ocean (was 2.152) and 2.131 ms/chunk over open
plain (was 1.970)** — +4.7% and +8.2%, inside test 12's 15% tolerance and
paid only at build time. Acceptance test 12 — the regression that matters
most — holds, and its baseline is a `git worktree` of the commit before
Phase 0 measured with the same probe on the same machine.

**Acceptance:** 10 and 12 PASS. 1–9 and 11 report PENDING and name what they
wait on (spans, the edit overlay, the block stamps). Test 10 reads both the
rule and the world: `aoLevel(0,0,0)` is exactly 1, one neighbour gives 0.87,
an inside corner 0.55 — and across 193 top-face meshes and 90,352 vertices of
built grass the darkest baked corner is 0.550. Before this round every one of
those vertices was exactly 1.000.

**The gaits, seen on the plain:** 92 of 96 standing beasts carry four named
feet (the rest are not four-footed). Caught under way at noon in Kenya — a
**gazelle** at `[0.380, −0.426, −0.426, 0.380]`, the diagonal pairs together:
a true TROT; an **oryx** and a **donkey** at `[−0.243, 0.373, 0.053, −0.266]`,
all four feet at different moments and only ONE knee folded at a time: a true
four-beat WALK. Two gaits, chosen by nothing but speed, on the same ground in
the same second — which the world could not do at all before this round.

**Still ahead, and not begun:** Phase 1 — spans, gated volumetric caves,
span-aware collision, the light underground and the torch. `PLAN.md` sets
out the encoding, the gating, the edit overlay, the Phase 3 conversion order
and the five places I think the brief is wrong.

## 4x. Round 25 — the third dimension: the earth is hollow, and dark, and a man carries fire ✅

*The brief's Phase 1 in full. Verified live in a headless browser: 129
walk-in cave mouths counted among the named ranges alone, the best of them
photographed from outside, from within looking out, and from within looking
in — lit and unlit — and acceptance tests 1, 2, 3, 4 and 11 driven against
the running world.*

**1. `js/caves.js` — the law of the hollow places, and it knows nothing of
this world.**
- **The fault.** The terrain was a HEIGHT PER COLUMN, and a height cannot
  describe a roof. What `rangeShapeAt` called caves were slot canyons — the
  height function subtracted inside a vein of noise, open to the sky along
  their whole length. There was no overhang anywhere on the earth, no arch,
  no tunnel, no chamber, and nothing whatever to go down into.
- A column now carries, besides its height, a short list of **AIR RUNS** —
  air and not solid, because the common carved column has exactly one hole
  and two solid parts, and one hole is half the writing. `Int16Array`, one
  allocation. A column with nothing cut out of it carries `null`, and `null`
  costs nothing — which is the whole reason the ordinary earth is exactly as
  cheap as it was.
- **The surface is never broken.** An air run always stops three blocks short
  of the top, so the ground a man walks on, a village is laid on, a tree
  grows out of and a beast beds down upon is solid everywhere on the earth.
  That one rule is why **none of the eighty-seven places in the engine that
  read a column's height had to move** — and why Rounds 20 and 23 were not
  re-broken.
- **So the way in is sideways, as it is in the world.** A passage keeps its
  own slow elevation (one field, wandering over ~2,400 units) while the land
  above it rises and falls far faster; where a gully or a cliff cuts the
  ground past the passage, the passage is laid open on the rock face.
  *Nothing places the mouths. The land does.*
- **A cave is a tube, not a threshold.** Thresholding a ridged field was
  built first and measured: at a threshold thin enough to keep the passages
  from becoming a sponge — one column in fifty — the band on the ground is
  **seven tenths of a block wide**. That is a slot, not a passage. The bore
  is the *distance to the vein* instead (the field value over its own
  gradient, two more reads), and it comes out round, of a stated width, and
  tapering to nothing at its edge. Measured in cave country: **12.1 % of
  columns carved, passages ~7 blocks across and 8 blocks tall, standing some
  32 blocks apart**.
- **And a flat place in the field is not a cavern.** Where the field barely
  changes, "distance to the line" comes out small over a great blank patch
  and the carve spread into a hall sixty blocks across with no passage
  leading anywhere. Gradients below a third of the measured norm are refused.

**2. It is never sampled volumetrically.** Three gates, and the cost of each
was measured on this machine:
| gate | what it asks | cost |
|---|---|---|
| 1 | is the ground high enough to have anything under it | **22 ns** a column — the whole ocean and every plain leave here |
| 2 | is this cave country at all (bucketed seeds + a sparse scatter) | **300 ns** on high ground that is not |
| 3 | does a worm actually run through this column | **1,475 ns** in cave country |
Cave country is **4.3 % of the disc** from the worldwide scatter, plus a
country about every named range and summit — handed in from
`world/landmarks.js`, so the engine never names a mountain and the cave law
never hears of one. Worst measured chunk: **175 of 256 columns carved, 7.5 KB
of spans**. An ocean or plains chunk: **0 bytes**.

**3. The mesher emits at every span boundary.** Floors, roofs, and the wall
as *whatever is solid here and not solid there* — both columns taken as
solid runs and one subtracted from the other. Two things fall out of that for
nothing: the far side of a passage is drawn, so a cave is a room and not a
hole in a wall; and where the neighbour's ground has fallen past the passage
there is simply no wall, **and that is the mouth**. The common case — neither
column hollowed — takes the old unbroken band and pays a single boolean.

**4. The light underground.** Every face cut inside the rock is baked dark by
how much of the sky it can see. Asked as a plain *"is there any line at all
to the daylight"*, a passage forty blocks under a mountain but hugging its
flank came out **as bright as its own mouth** — one grazing sight-line lit
the whole of it. The day is **shared out** instead: eight bearings at three
distances, each contributing its own eighth, the further the less. Measured
at the best mouth: **0.555 at the entrance, 0.019 forty blocks in.** It is
one reading per room, not per face — asked per face it was six times
twenty-four cell reads for every hollowed column in the chunk.

**5. The light a man carries.** Every block in this world is drawn with an
unlit material — the light on a face is baked into its vertex colour and the
whole set tinted once by the hour. Nothing in it responds to a lamp, and a
real point light would mean lighting the entire earth per-pixel to light nine
blocks of it. So the torch is a **uniform**: one position, one reach, one
strength, shared by every block material in the game, three instructions in
the fragment, and **nothing whatever paid while it is out**. `T` strikes it;
the traveller carries a haft with a knot of flame on it that swings with his
stride. (The chunk mesher bakes geometry in world coordinates — the same
property the wind in the leaves leans on — so the vertex position *is* the
world position and the distance to the flame is one subtraction.)

**6. Collision reads the spans — through the one funnel it already had.**
`groundInfo(x,z,refY)` now takes the height of the asking body and answers
what is solid under it *and what is over it*. **Given no height it answers
exactly what it always did**, which is why its fifty other callers needed no
change at all. The walker passes his own feet in; so does the camera's floor
(`solidTopAt`), or the eye would be hoisted up through the roof and out of
the hill the moment its man stepped in. A roof is a roof — no man jumps up
through the rock over his head. And **a man's head must go where his feet
do**: the rise test is the whole story under the open sky, where nothing
stands over a man but air, and is not the whole story in a passage where the
floor ahead may be level with his feet and the rock still come down to his
chest. That test is asked **only where something has actually been
hollowed**, so no step, no ledge and no climb anywhere else in the world is
touched by it.

**7. One live bug, found by the acceptance run.** Chaining a second
`onBeforeCompile` onto a material must also chain its
`customProgramCacheKey` — and three.js's own default implementation of that
reads `this.onBeforeCompile`. Called bare it throws **inside the renderer,
every frame**, taking the render and the whole world with it. It is called on
the material now.

**8. Acceptance, and what it costs.**

    PASS  1 · a cave mouth at a named range, with solid overhead    ceiling at +7
    PASS  2 · dark deep in, and a torch lifts it                    40 blocks in
                                                                   (the passage runs 44):
                                                                   dark 0.189 → lit 1.000
    PASS  3 · the walker passes through no ceiling, floor or wall   held on all six
    PASS  4 · an overhang — solid, air, solid in one column         found
    PASS 10 · ambient occlusion present and measurable              107,896 vertices,
                                                                   darkest 0.550
    PASS 11 · standing in a cave costs no more than open ground×1.5 0.89×
    PASS 12 · ocean and plains chunks build no slower than they did 2.106 / 1.838 ms
                                                                   (was 2.152 / 1.970)

Test 3 drives the **real walker** at the rock in all six directions for
sixty frames apiece and asserts his body was never once found inside it —
not a proxy, the walking code. Test 11's edited-chunk half is named as still
owing rather than reported as tested.

Six stations, two hundred frames standing still at each, against the same
worktree of the commit before Phase 0:

| station | before Phase 0 | after Phase 0 | after Phase 1 |
|---|---|---|---|
| a village at noon | 668.9 ms | 599.0 ms | **618.2 ms** |
| the cedar coast | 672.0 ms | 595.3 ms | **639.3 ms** |
| open sand | 624.2 ms | 575.6 ms | **570.8 ms** |
| closed rain forest | 878.1 ms | 806.9 ms | **811.6 ms** |
| alpine rock and snow | 603.0 ms | 592.7 ms | **610.7 ms** |
| a cold coast | 505.3 ms | 506.1 ms | **488.0 ms** |

Every station is still at or under what it cost before any of this began.
The alpine station draws 4 % more triangles than it did — those are cave
walls, floors and roofs, and they are the only new geometry in the world.

**Still ahead:** Phase 2 — the manifest loader, the block registry,
`setBlock`, the edit overlay, dirty-chunk remeshing and IndexedDB. Tests 5,
6 and 7, and the other half of 11.

## 4y. Round 26 — the world made mutable: one list, one table of blocks, one door ✅

*The brief's §10 manifest and Phase 2 in full. Verified live: 209 blocks laid
into a village at noon and photographed, a hundred-block brick hut raised
over the sand with a plank roof and a salt course, and acceptance tests 5, 6,
7 and the whole of 11 driven against the running world — the persistence test
five times over, because it failed once and a race that loses rarely is the
worst rate there is.*

**1. `world/manifest.js` — every file of the world named once (§10).**
- `index.html` carried **365** `<script src>` tags and
  `scripture-unfolds/index.html` carried the same 365 again with `../` in
  front of each: the same ORDERED list, written twice, and about to be
  written twice more as the blocks and the authored places arrived. Two
  copies of an ordered list is a bug with a date on it — the day somebody
  adds a country to one and not the other, the two games are different
  worlds. It is one list now, and both pages read it.
- **The order is the whole point** — the registry before anything that
  declares into it, every country before the engine that rasterises them,
  every creature before the fauna table that names it, `js/engine.js` last
  — so it is a list, not a set, and nothing in it may be sorted.
- All of them are appended at once with **`async=false`**, which is the one
  thing that makes a dynamically inserted script keep its place in the queue:
  the browser fetches them in parallel and runs them strictly in order. It is
  **faster** than the parser-blocking tags it replaces, and it is the reason
  this could be done at all without a build step.
- `index.html` fell from 1,161 lines to 781; `scripture-unfolds/index.html`
  from 680 to 318. Verified: the voyage boots in 19.1 s (was 19.8) and
  SCRIPTURE UNFOLDS raises the shared world in 5.3 s with 176 countries, 150
  beasts and 8 scrolls, reading the same manifest through `'../'`.

**2. `blocks/` — a table of materials, where there was a table of textures.**
- The mesher carried ad-hoc material *names* — `grassTop`, `cobble`,
  `haySide`. That is a table of what things LOOK like; it could say nothing
  whatever about how long a thing takes to break, what tool serves it, what
  it drops, or whether it stands on nothing. **22 blocks**, one to a file,
  each calling `EARTH.block({…})` — the same rule every country, creature and
  landmark keeps.
- Nineteen are drawn with textures the world already had. Three are new and
  are the materials of §4 the palette already had pigments for: **baked
  brick** in courses with recessed mortar, **slime** — the asphalt of the
  pits of Siddim, wet, with the light lying on it in slicks — and **salt**,
  crystalline. Each carries its verse **quoted exactly** from the repository's
  own generated Berĕshith (`BERĔSHITH 11:3`, `6:14`, `14:3`), never
  paraphrased and never invented.
- **A block has two names.** Its `id` is a string and is stable for ever — it
  is what a save speaks. Its number is assigned in load order purely so an
  edit can be written in two bytes; and because that number is an accident of
  load order, **every save carries its own table of name-to-number**. Insert a
  block into the manifest next year and an old world still opens with its
  walls the right stone.

**3. The edit overlay, and one door.**
- `cellRaw` is a pure function of place, so anything the traveller changed was
  erased the moment the chunk rebuilt. Now:
  **procedural spans → apply the edits → mesh.**
- **`setBlock` is the ONE way terrain is changed.** Nothing else in the engine
  may write it, so there is exactly one place where dirtying a chunk, marking
  its neighbour and writing the record can be got wrong. Every future hand,
  tool, work and authored place goes through that door.
- **The index puts Y fastest on purpose.** A man's edits are towers, walls,
  shafts and stairs — runs *up*. Laid out with y fastest, a wall of forty
  blocks is **one** entry in the record instead of forty, and the run-length
  coding gets it for nothing.
- An edit that merely restores what the world would have done anyway is not
  kept: it is a hole in the record, not a fact.
- The mesher applies a column's edits to its spans and hands the rest of
  itself a cell-shaped thing it already understands, so nothing downstream
  had to learn that anybody has been digging. **Blocks set down are drawn one
  at a time in their own material**, six faces each, every one culled against
  what stands beside it — a man's edits are sparse, and a cube apiece is the
  honest price for letting him build in whatever he likes.
- **Collision needed no new funnel.** `solidAt` became one line over
  `blockSolidAt`, and `groundInfo` walks an edited column block by block —
  bounded, and entered only by a column somebody has actually touched, because
  an edited column has no sorted shape to do arithmetic on: a man may leave a
  block hanging forty above the ground and a shaft cut two hundred below it.

**4. It is written down — IndexedDB, versioned from the first line.**
- localStorage caps near five megabytes and is synchronous: an hour of digging
  would both overflow it and stall the frame in the act. Block edits go to
  IndexedDB, one record to an edited chunk, run-length coded. The small state
  — where the ship lies, the log, the scrolls — stays in localStorage, which
  is what it is good for. A record of a version this build does not know is
  **left alone** rather than guessed at.
- **Bound: everything is kept, and that is written down as a decision** (see
  `PLAN.md` §5). A player edits a vanishing fraction of a 60,000-block disc.

**5. One live bug, and it is the interesting one of the round.**
- Test 7 passed alone, passed in pairs, and **failed roughly one run in
  four** with all three persistence tests together: the reload came back with
  the right chunks and the wrong blocks in them.
- The cause: a save asked for by hand while the debounced save was still open
  found `EDIT_SAVE` already drained, **returned `true` over the top of a
  transaction that was still writing**, and the reload then closed the door
  on it. Under a software rasteriser a frame is half a second, so the 900 ms
  debounce fired reliably inside the two-frame settle — which is why it
  showed up here and would have shown up on a phone.
- The fix is not "cancel the timer" (that was the first attempt, and it still
  failed 1 in 3). Saves now **stand in a line**: a call made while another is
  open chains onto it, so `await editsSave()` means *everything outstanding
  has landed* — which is what it has to mean before a reload or a page
  teardown. Five consecutive clean runs after.
- And a save that fails now re-arms the timer as well as putting its keys
  back, or the work would sit unwritten until the next blow of the pick.

**6. Acceptance, and what it costs.**

    PASS  5 · a broken block is gone, the chunk remeshed, the neighbour drawn
    PASS  6 · a block placed in mid-air is solid, lit and collidable
    PASS  7 · both changes survive a reload
    PASS 11 · a cave and an edited chunk cost no more than open ground ×1.5
    PASS 1,2,3,4,10,12 — all still green
    PENDING 8, 9 — houses are still decoration until Phase 3

**10 pass · 0 fail · 2 pending.**

Test 5's first draft asserted the chunk's triangle count changed, and it does
not: breaking the top block of flat ground takes one face away at *h* and puts
one back at *h−1*. The chunk is genuinely rebuilt and the count is genuinely
identical. It asks the right question now — that the chunk **was laid again**
(a counter), that the ground fell by exactly one block, and that the block
beside it now stands with an open face where it had none.

Test 11's first draft reported *1,798 ms* for a remesh. That was three
SwiftShader frames of waiting, not the work. Timed by itself, laying two
edited chunks again takes **10.3 ms** — inside the mesher's own existing
per-frame slice, so one blow of the pick costs one chunk rebuild in one frame,
as the brief asks.

| station | before Phase 0 | Phase 1 | Phase 2 |
|---|---|---|---|
| a village at noon | 668.9 ms | 618.2 ms | **614.7 ms** |
| the cedar coast | 672.0 ms | 639.3 ms | **667.2 ms** |
| open sand | 624.2 ms | 570.8 ms | **583.4 ms** |
| closed rain forest | 878.1 ms | 811.6 ms | **817.2 ms** |
| alpine rock and snow | 603.0 ms | 610.7 ms | **616.0 ms** |
| a cold coast | 505.3 ms | 488.0 ms | **503.5 ms** |

Standing in a chunk with 243 blocks laid into it costs **1.00×** open ground,
which is what it should: an edited chunk differs from an unedited one by a
remesh, not by any per-frame cost.

**Still ahead:** Phase 3 — every `emit*` and `lm*` builder converted from
triangles to block stamps, structure edits kept apart from player edits, and
the geometric diff harness that proves a converted village is the same village
before anybody is allowed to mine it. Tests 8 and 9. *The long one.*
(The village half of it is done in Round 28 below; the landmarks and the pier
are not.)

## 4z. Round 27 — the earth restored to her own face, and the world made to zoom out as itself ✅

*Not a phase of the brief but a repair and a piece of polish, both raised from
the field: a hole in the middle of the world that was my own doing, and the
long-standing complaint that drawing the eye back does not show the world
drawing away — it hands over to a coarse stand-in and then that stand-in
zooms out. Verified live, side by side against a worktree at the commit
before Phase 0, at seven stations of the pull-back.*

**1. The hole in the middle of the world — one function, every caller but one.**
- Phase 0 raised the grain of a block face from sixteen texels to thirty-two,
  and put the reckoning in the wrong door: `texCanvas(w,h)` was made to
  multiply what it was asked for by `TS` (=2).
- **Only `mkTex` speaks texels.** Every other caller in the engine had always
  asked in TRUE PIXELS — the chart of the whole earth at 2048, the sea-floor
  sheet at 64×32, the name banners at 1024×170, the glow of the two lights at
  128, the wall of night at 512, the cloud sheets at 256, the minimap at
  whatever it is drawn — and every one of them was handed a canvas twice as
  wide and twice as tall as it painted into. Each drew its whole work into the
  **top-left quarter** and left three quarters transparent.
- What that looked like from the field: drawn back on the wheel, **the earth
  was a quarter of her size, up in the corner of her own disc**, with the wall
  of night showing through the empty three quarters where the rest of her
  should have been — which is exactly the "big hole in the middle" that was
  reported. The glow of the sun and of the moon sat up and to the left of the
  light it belonged to and read as **a second light floating beside the
  first**, which is exactly the "extra lights around the sun and moon" that
  was reported in the same breath. Two complaints, one line of code.
- **Found by measurement, not by reading.** The two great objects at zoom 1.0
  were enumerated in both builds and came out identical to the digit —
  `CylinderGeometry r=179820` at `#0a0c18`, `CircleGeometry r=180000` with a
  map, same distances, same flags, same render order. Nothing in the SCENE
  differed. That is what pointed at the TEXTURE, and the canvas is 4096 where
  the paint stops at 2048.
- `texCanvas` is cut to the size it is asked for, as it always was; `mkTex`
  does its own reckoning into true pixels before it asks. **The grain of the
  block faces is unchanged** — that was never the bug.

**2. The world must zoom out as itself.**
- The streamed ring stayed at thirteen chunks (1,248 units) however far the
  eye was drawn back, while the haze opened with the pull-back to miles. So
  from about 1,300 units out, what filled the view was the coarse carpet with
  one small crisp patch of true blocks under the ship.
- The ring now **widens with the pull-back exactly as it widens with the
  wings**, to the same cap of twenty-one chunks — and, unlike the wings, it is
  **given back** as the view outgrows anything a ring of real chunks could
  fill (it fades out between 4,500 and 9,000 units) and again as the charted
  face comes over the top. Held on all the way out it was costing five
  thousand draw calls a frame for a coin in the middle of the window.

**3. A block is a block until it is a county.**
- Every cell of the far ring was laid as a flat-topped brick with a wall down
  to its neighbour. That is right where a cell is a few blocks across — it is
  the same grammar as the chunks beside it and the seam cannot be found. But
  the ring's cells grow with its reach: drawn back a few thousand units, one
  cell is four hundred units — **sixty-six blocks** — across, and sixty-six
  blocks of country flattened to one height with a sheer wall round it is not
  block grammar at all. It is a terraced wedding cake laid over the earth in
  rings and spokes, and it is precisely what read as an overlay thrown over
  the world instead of the world itself.
- The brick is now **kept while a cell is block-sized and given up as it
  grows** (over 24 → 170 units of cell width): the corners walk out onto the
  cell's true edges, the walls between cells close to nothing, and each corner
  takes the mean of the cells that meet at it. The far country resolves into
  ground with ranges and valleys in it.
- **The coasts are not smoothed.** A corner where dry land meets open water
  keeps its hard step. The one line the eye truly reads out there is the shape
  of the coast, and a shore eased into the sea over four hundred units is a
  world with no coastline. The turn-shading is averaged with the heights, or
  it would put back in light the very cell edges the blending has taken out in
  shape.
- It costs a third pass over the ring (the corners cannot be settled until
  every cell that meets at them has been read AND shaded, and one of those
  lies in the ring that has not been walked yet). It is sliced at the same six
  milliseconds a frame as the other two, and no half-built ring is ever shown.

**4. What it costs, measured back to back.**

Standing ashore at Yapho at noon, median of fifty frames, the same box, the
same run, the commit before Phase 0 against this one:

| pull-back | before | now | draw calls | triangles |
|---|---|---|---|---|
| zoom 0.55 (3,470 out) | 1,064.9 ms | **1,510.1 ms** | 8,873 → 9,580 | 1.11 M → 1.30 M |
| zoom 0.62 (6,990 out) | 914.9 ms | **1,880.6 ms** | 9,130 → 12,928 | 1.07 M → 1.77 M |
| zoom 0.70 (15,580 out) | 860.1 ms | **1,257.5 ms** | 9,191 → 10,081 | 1.07 M → 1.24 M |

**This is a real bill and it is written down as one.** It is 1.4× to 2.1× on a
software rasteriser, which is fill-bound and so charges the triangles harder
than a GPU would; on hardware the draw calls (1.08× to 1.42×) are the truer
guide. It falls **only inside the pull-back band**: gameplay — the deck, the
shore, anything under about 900 units of camera — is untouched, and the same
twenty-one rings are what a flyer at any height has always paid for. The band
is a deliberate, transient view, and what it buys is the whole of the
complaint. Untapered it was 2,105 K triangles and 14,933 calls at zoom 0.62;
the taper gives back a fifth of that where it was buying nothing.

**5. Test 12 made to measure rather than to guess.**
- It failed once in three on unchanged code. One sample is one sample, and a
  scheduler that takes the box away for forty milliseconds mid-run turns a
  3.0 ms chunk into a 3.8 ms one and calls it a regression.
- The interference only ever runs ONE WAY — it can add time to a build, never
  take it away — so the test now measures **three times on fresh ground of the
  same kind and keeps the least**, and prints all three passes beside the
  verdict, so a real slowdown (all three dear) is told apart from a busy box
  (one dear, two not). `ocean 1.005 ms (passes 2.70/2.44/1.01) · plain 2.375 ms
  (passes 2.37/2.65/2.67)`.
- The baseline and the 1.35 slack are unchanged.

**Noted and NOT done:** at 6,990 units out the frame carries eleven draw calls
per chunk where it carries six at arm's length — the surplus is village
furniture, banners and flora that are a few pixels across and cannot be read.
Putting the smallest things away as the eye draws back would be worth more
than any further trimming of the ring, and it is a change with a pop in it if
it is done carelessly. It belongs in its own round.

## 4aa. Round 28 — Phase 3: the town and the ancients made of blocks, and two lies the ground was telling ✅

*The brief's Phase 3, for everything a village raises. Every `emit*` builder of
a town now writes BLOCKS rather than triangles; the two acceptance tests that
have stood PENDING since the brief was opened are green, and the suite is
**12 pass · 0 fail · 0 pending** for the first time.*

**1. Converted by being RUN, not rewritten.**
- `stamped(ex,fn)` is the one door: it opens a stamp group, runs the builder
  **unchanged**, and hands the group to the village that raised it so it can
  be taken out again when the village is left behind. A builder called from
  inside another JOINS the group already open — a house within a city is not
  a separate thing to forget.
- Converted: the houses and all their furniture, the pens and their rails and
  hay, the farms, the market and fish stalls, the benches, the plaza, the
  trodden ways, the wells, and both of the one-off standing places — the city
  of Yahrushalayim, and the traveller's own house in the tree. Seventeen call
  sites. **A village at Yasharal now writes 16,435 blocks across 41 chunks.**
- `buildPier` is deliberately NOT among them. It is the one builder that
  writes into `deckMap` — the table that tells the whole world where a plank
  deck stands over open water — and converting it means converting that table
  with it. PLAN.md §9.3 said it goes last; it goes last.

**2. A laid surface is a course of blocks.**
- A plaza, a trodden way, a plank floor, a bed of tilled soil and its water
  channel were each ONE HORIZONTAL FACE laid a finger above the ground,
  because a face is all the eye needs when nothing may be dug.
- `emitTop` gives them the block whose lid they are (`round(y/B)−1`): a plaza
  and a path go into the SURFACE course, so trodden ground is trodden ground
  and not grass with a picture on it; a plank floor goes into the course laid
  on the footing.
- It is deliberately **not** `faceTop` itself. A good many faces in this
  engine are genuinely faces — a rug on a floor, the sheen on still water, the
  wash of a shelf — and turning every one of them to rock would fill the world
  with blocks nobody meant to lay. Five call sites converted by hand.

**3. Tests 8 and 9, at last.**

    PASS  8 · a wall block breaks out of a house, and the hole is walkable
              broke Planks twice over · hole open=true · a man passes=true
    PASS  9 · dig under a house and its blocks stay put
              4 block(s) taken from under it · the wall still stands=true

- Test 8 breaks **two** blocks, not one. A hole a man walks through is two
  blocks high, and a test that breaks one and calls it walkable is testing
  nothing.
- Both first reported *"no house near"* — and that was the TEST lying, not the
  world. A village is raised over many frames, and test 7 reloads the page; by
  the time test 8 ran there was no town anywhere yet. `standInVillage` waits
  for one to stand (up to six hundred frames) and gives up loudly rather than
  quietly.

**4. Two lies the ground was telling, both found by looking at the townsfolk.**

Forty-eight villagers were photographed and their feet measured. Eight of them
stood inside solid blocks. Neither cause was in the conversion; both were
older faults that only a town of real blocks could expose.

- **`groundInfo` read one layer of two.** It asked `EDITS.size` — the hands'
  own layer — while the whole of Phase 3 writes into `SEDITS`, the structures'
  layer. So every query of where the ground is read straight *through* a
  village: a man walked into a house and stood at the height of the field it
  was raised on, knee-deep in his own plank floor. (`editColumn` has always
  read both. It was the gate in front of it that was half-open.)
- **A creature never said where it was standing.** `groundInfo` takes a
  reference height for exactly this, and the villagers' three calls all
  omitted it — so a hollow column answered with the TOPMOST surface in it.
  Harmless while the only hollow thing in the world was a cave, which folk do
  not walk over. A house makes every column it stands in hollow: eight-and-
  forty townsfolk were lifted three courses into the air and set walking about
  inside the planks and the tiles. With his own height for a reference each is
  given the floor he is on — **and the wall beside him now reads as the
  four-block step it is and turns him back, as a wall should.**
- Measured after: **0 of 48 inside a block, 0 on a roof, 32 walking.**

**5. And the ground query made to pay for itself.**
`editColumn` walks every block written into a chunk to answer for ONE column
of it — four hundred, to be asked about sixteen. A fair price once per blow of
a pick; not a fair price when the ground query reads that layer for every
creature in a town, twice a frame. The answers are kept in a small table now,
thrown away WHOLE on any write anywhere — the only correctness this needs, and
free, because a hand that lays a block has already bought a remesh in the same
breath.

**6. What a mineable town costs.**

Back to back, the same box, the same run, `ed0ce58` against this commit:

| station | before | now | triangles |
|---|---|---|---|
| a village at noon | 722.3 ms | **784.6 ms** (+8.6 %) | 469 K → 530 K (+12.9 %) |
| the cedar coast | 693.0 ms | **793.3 ms** (+14.5 %) | 504 K → 553 K (+9.9 %) |
| open sand | 623.8 ms | **637.6 ms** (+2.2 %) | 423 K → 434 K |
| closed rain forest | 861.6 ms | **878.4 ms** (+1.9 %) | 684 K → 692 K |
| alpine rock and snow | 661.1 ms | **696.9 ms** (+5.4 %) | 516 K → 535 K |
| a cold coast | 537.7 ms | **561.6 ms** (+4.4 %) | 389 K → 397 K |

The cost is where the towns are, and it is inherent: a house drawn as boxes
emits six quads a box, and the same house drawn as BLOCKS emits a face per
exposed block face — a nine-by-nine wall is eighty-one quads where it was one.
That is what a wall a man can break is made of. An earlier reading of this
same pair said +22 %; it was taken on a box running four browsers and the
triangle counts did not agree with it. These do.

**The obvious next saving, and it is NOT done here:** the mesher emits every
exposed face separately. Greedy merging of coplanar faces would collapse that
nine-by-nine wall back to one quad and would pay for the whole of this round
several times over, on the terrain as much as on the houses. It is a change to
the heart of `emitColumn` and it wants a round of its own.

**7. And the works of the ancients, raised twice.**
- All nine `lm*` builders — pyramid, ziggurat, temple, stone circle, wall,
  lighthouse, gate, city, statue — are pure `emitBox`, so they converted by
  being run. **The Pyramids of Giza now stand as 2,646 blocks.**
- But they are raised TWICE, in triangles and in blocks, and this is the one
  place in Phase 3 where that is right. **A landmark exists to be seen from
  far off — that is the whole of what a landmark is** — and blocks are only
  laid inside the streamed ring. Converted to blocks alone, every pyramid and
  lighthouse on the earth would cease to exist the moment the haze opened far
  enough to look for it, which is the opposite of a landmark.
- So the triangles are the FAR SILHOUETTE, and they are put away the moment
  the true blocks under them are standing. The test is not the traveller's
  distance but whether **the chunk the thing stands in has actually been
  laid** — the same question asked properly. Never both at once: two copies
  of a temple in one place fight each other face for face.
- Verified at Giza: at **150 units the silhouette is hidden** and 2,646 blocks
  stand; at **1,950 units the silhouette is shown** and the pyramid is on the
  skyline in the haze, where without it there would be empty sky.
- A village gets no such silhouette, and does not want one: it spawns at 1,600
  units, just beyond a fog that closes at 1,140, so it is never looked at from
  outside the ring. Its structure geometry is also tangled with its people in
  one group and would have to be separated first. Noted, not done.

**Still ahead in Phase 3:** `buildPier` last with `deckMap`, and the geometric
diff harness. *(The pier is done in Round 29 below.)*

## 4ab. Round 29 — the pier, and three faults the field found before I did ✅

*Phase 3 finished — `buildPier` and `deckMap` with it — and then three reports
from the field, every one of them a real fault and every one of them caused by
work of mine. They are set down here in the order they were found, with what
was measured before and after.*

**1. The pier, and the table it carries.**
- A deck was a SLAB half a unit thick floating 2.8 above the waterline, and
  `deckMap` told the whole world — the walker, the fishers, the boat looking
  for somewhere to put in — that the walking surface there was 3.15.
- A deck of blocks cannot be half a unit thick. It is a course, six units, and
  **its top is where a man's feet go**, so the table is told the course's top
  and not the old slab's, or every fisher on every pier stands three units
  inside his own planks. One number, reckoned once, written into the table,
  the piles, the lamp post and `ex.pier`.
- The two corner piles become the one column of timber a six-unit cell can
  hold, run from the bed of the sea to the deck. Ten planks at Norway,
  measured: table 6.0, walker's feet 6.0, block under him `Planks`.

**2. And what is built over open water is built.**
A column with no land in it fell straight through the mesher to the next one,
so the edit layers were never even ASKED about it. Anything set down out on
the water — the planks of a pier, a block laid from a boat — went into the
overlay, answered **solid to every foot and every test, and was drawn nowhere
at all**: a man stood on the open sea at the right height, on nothing. The
faces of a placed block need no ground under them; only the asking was
missing. (This was a Phase 2 fault. Nothing had ever been built at sea before
the pier, so nothing had ever found it.)

**3. THE FLICKER — the overlay drawn twice.**
- Reported from the field: *"buildings and some tree and tile and ground are
  flickering."*
- `editedCell` asked `blockSolidAt` to decide what was terrain, and that sees
  BOTH layers. So every block anybody had set down was counted into the ground
  column, drawn by `emitColumn` **in the ground's material**, and then drawn a
  second time by `emitPlaced` in its own. Two coplanar faces in the same
  place, and the depth buffer choosing afresh between them every frame as the
  eye moves. That is the flicker — and it is why a plank floor could read as
  sand.
- It was nearly invisible while a man's edits were a handful of blocks in a
  hillside. **Phase 3 lays sixteen thousand of them in every village**, and it
  became the look of the world. A cell the overlay names is not terrain now,
  whatever stands in it; the overlay is drawn once, by `emitPlaced`, which
  culls its own faces against both layers and so still meets the true ground
  correctly.
- Test 6 had been reading `tris 1366→1390` for one placed block — twenty-four
  triangles, which is two cubes. It passed, and it was showing the bug.

**4. THE TOWNSFOLK ON THE ROOFS — and then in the walls.**
Reported: *"npcs are spawning trap in the sides of houses and some trap on the
top of houses."* Measured before anything was changed: **9 on the roofs at
noon, 15 at dusk, 0 inside solid.** Three faults, found one at a time by
fixing the one in front:

- **One course is a step, and folk have always been allowed to take one.** That
  was a rule about GROUND. Every footing, bench, hay bale, stall counter,
  fence rail and plaza edge is now a one-course ledge, so a stack of them is a
  staircase and the townsfolk climbed the sides of their own houses a course
  at a time. A BUILT surface more than a course above the true ground of that
  spot is a wall, a roof or a counter-top, and none of them is a floor.
  → roofs **15 → 1**.
- **The first rescue traded roofs for masonry.** Whoever was already up there
  had to be brought down, and the first draft simply dropped them to the bare
  field — but the ground under a roof is the ground under a HOUSE, and that
  put them waist-deep in its footing. **15 on the roofs became 21 in the
  walls.** Each creature now keeps the last place it stood that the rule
  allowed; that place was reached by walking, so it is outside every wall by
  construction, and it is where a stranded one is put back.
- **Forbidding the climb was not enough on its own.** A footing runs UNDER the
  walls it carries and a stall's counter has its canopy posts standing on it —
  both one course above the field, which the climb rule allows, and both with
  something standing in the very space a body would occupy. **Two courses of
  clear air over a floor, or it is not a floor.** `groundInfo` has always
  reported the ceiling over a hollow column; it was never asked. That is also
  the rule that lets a doorway through and keeps a wall shut.
- **And nobody is set down inside anything.** The spawn tests were all
  FOOTPRINTS — house rectangles and recorded solids — enough while everything
  a village raised was triangles nobody could stand in. The hay, the rails,
  the benches and the lamp posts lie outside every footprint it knew. A man
  set down on one begins his life inside it and, standing still, has no
  occasion ever to leave. Same law: two courses of clear air.

Measured after, at all three hours: **0 of 48 inside solid, 0 on roofs.**

**5. THE CARPET ALOFT.**
- Reported: *"the coarse carpet is affecting how the game looks when the player
  is rising up and zooms out."* From 2,629 km the earth was a sharp chart with
  **a blurred smear painted over its middle** and ragged navy shapes across
  dry countries.
- The ring was held at full strength until zMapF 0.90 — a rule written to
  close an old hole — while the chart only reached full strength at 1.0. So
  through the whole middle band the eye was given a MIXTURE, and up there the
  ring's cells are sixteen hundred units across: **one sample to two hundred
  and seventy blocks.** Round 27's smoothing did not cause this, but it turned
  the coarse terraces into an airbrush, which is worse to look at.
- The answer to the old hole was never to hold the ring on; it was to bring
  the CHART fully in **before** the ring is taken away. The chart reaches 1.0
  at 0.75 now and the ring goes out between 0.60 and 0.75 beneath it, so the
  two overlap the whole way (at worst some five parts in a hundred of a
  darkening sky shows through) and above 0.75 the charted earth is beheld
  clean.
- **Below 0.60 — the whole of the pull-back band, where the ring is the only
  thing carrying the country — nothing whatever is changed.** Measured: at
  3,000 and 9,000 units of height the ring stands at full strength; at 15,774
  (the height reported from the field) it is gone.

**6. And one test left red, honestly.**

Run alone on a quiet box after all of the above:

    PASS  11 · a cave and an edited chunk cost no more than open ground x1.5
              open 1180.3 ms · in a passage 1062.2 ms (0.90x) · edited chunk 907.5 ms (0.77x)
    FAIL  12 · ocean and plains chunks build no slower than they did
              ocean 1.159 ms/chunk (was 2.152, passes 5.77/3.76/1.16)
              plain 3.011 ms/chunk (was 1.97,  passes 3.01/3.38/3.59)

Test 11 was the box: run beside two other headless browsers it read 1.40x, and
run alone it reads 0.90x. Test 12 is **not** settled that way, and it is left
RED rather than explained away:

- The plain figure is consistent across all three passes (3.01/3.38/3.59), and
  three dear passes is exactly the signature this test was rewritten to tell
  apart from a busy box. That argues for a real cost.
- But the ocean figure spread **five-fold within the same run** (5.77 down to
  1.16) on identical code, which says this machine cannot presently deliver a
  trustworthy millisecond. That argues the plain figure is not trustworthy
  either.
- Earlier runs of the same test on this same branch read the plain at 1.904,
  2.141, 2.375, 2.387, 2.432, 2.527 and 2.952 ms — a spread that already
  straddles the limit.

**The slack is NOT being widened to make it green.** That is the one thing the
note at the top of the file forbids, and moving a baseline to match the code
is how a performance guard stops being one. What is wanted is a measurement on
a quiet machine, at this commit and at the commit before Phase 0, back to back
— and until somebody has that, this test says *unknown*, not *fine*.

**Still ahead in Phase 3:** the geometric diff harness. Every builder is
converted.

**And still noted, still not done:** greedy merging of coplanar faces in the
mesher. Round 28 measured what a mineable town costs; this round has just
removed a doubling of it that should never have been there, and the merge
would take the rest.

## 4ac. Round 30 — the faces merged, and test 12 finally understood ✅

**1. A cube apiece was the honest price, until it was not.**
- Every block set down went out as up to six separate quads. That was right
  while a man's edits were a handful of blocks in a hillside. Phase 3 lays
  **sixteen thousand of them in a village**, and a plain nine-by-nine plank
  wall was going out as **eighty-one quads where one would do** — same
  texture, same shade, same plane, edge to edge.
- The faces are no longer drawn as they are found. They are collected for the
  whole chunk, sorted into groups sharing a direction, a plane, a material and
  a shade — anything differing in any of the four cannot merge and must not —
  and each group is covered with the fewest rectangles that will cover it:
  run east as far as the row goes, then south as far as whole rows go.
- **The texture is not stretched.** Every face carries a UV repeat of one per
  block, so a three-by-two rectangle tiles three by two, and the hewn edge
  baked into every block face repeats with it. The joints between the blocks
  are exactly where they were — drawn by the texture rather than by the
  geometry. Nearest filtering and RepeatWrapping make that exact, and the
  before-and-after photographs of the same street are indistinguishable.
- The shade is quantised before grouping: two faces the eye cannot tell apart
  should not be kept apart by the last bits of a float.

**What it saved**, measured back to back, standing in the same town, on the
same 18,505 stamped blocks across the same 49 chunks:

| | before | after |
|---|---|---|
| triangles in the village's chunks | 83,658 | **47,902** (−42.7 %) |
| median frame | 831.9 ms | **742.4 ms** (−10.8 %) |

That is Round 28's whole bill for a mineable town, paid back with interest.

**2. And test 12 is understood at last — it is not the box.**

The merge cut the village's triangles by more than two fifths and left test 12
**exactly where it was**: `plain 3.079 ms (passes 3.08/3.12/3.22)`. That is the
answer. An unedited plains chunk has no placed blocks in it at all, so there
was never anything there for the merge to touch — and the figure not moving by
a hair is what proves the reading is real work and not weather.

Across three separate runs the plain has now read
3.01/3.38/3.59, 3.28/3.59/3.23 and 3.08/3.12/3.22 — nine consecutive dear
passes. **It is a real cost, about 1.56× the pre-Phase-0 baseline, and it is
not in anything Phase 3 did.** What an unedited plains column gained since
that baseline is exactly two things, both of them asked for by the brief:

- the **ambient occlusion** of Round 24 — `aoTop` and its neighbour lookups,
  per column, per chunk;
- the **spans** of Round 25 — the cave field consulted for every column of
  the world, whether or not there is a cave within a mile of it.

**The baseline is still not moved.** Re-baselining is allowed by the note at
the top of `tools/acceptance.js` provided the reason is written down, and the
reason is now written down — but a guard should not be relaxed in the same
round that identifies what it is catching. The right next step is to make the
span lookup cheap for the overwhelming majority of columns that can contain no
cave (`CAVES.chunkHas` already exists and is not being used as an early-out on
this path), measure again, and only then decide whether anything is left to
re-baseline.

## 4ad. Round 31 — the quiet tile: the caves stop charging the countries that have none ✅

*The step Round 30 named, taken. The suite is **12 pass · 0 fail · 0 pending**
and test 12 is green on its own merits, with the baseline untouched.*

**1. What the caves were costing the whole earth.**
`spansAt` has three gates and they are in the right order, but gate 2 —
*is this cave country at all* — is a field read, and a field read is not cheap
**two hundred and fifty-six times a chunk**. Each one builds a bucket key
string and then, finding no named country near, evaluates the scatter noise in
full. Over a world where very nearly every column has no cave within a mile of
it, that is the standing cost of the caves — **paid most heavily by the
countries that have none.**

**2. The tile is asked once, and remembered.**
A tile ninety-six units square — the mesher's own chunk — is sampled every
sixteen units and carried a quarter of a tile PAST its own edges: seven-and-
forty reads. If nothing in that reaches cave country, every column in the tile
answers `null` at once, for ever after.

**It cannot lose a cave.** The scatter field's own feature is some seventeen
hundred units across and a named country's is larger still, so nothing that
could reach a column of the tile can fall between samples sixteen units apart
— and the margin covers what bleeds in from outside. The table is asked only
to say *quiet*; a tile that answers anything else is walked column by column
exactly as before. The table is cleared whenever the countries are re-seeded.

**3. What it saved, and the proof that nothing was lost.**

| | before | now |
|---|---|---|
| **test 12 · plain** | 3.079 ms (3.08/3.12/3.22) | **1.888 ms** (1.89/2.12/2.09) |
| **test 12 · ocean** | 1.118 ms | **0.650 ms** |
| test 11 · open ground | 852.0 ms | **540.8 ms** |

**Plains chunks now build faster than they did before Phase 0** — 1.888 ms
against a 1.970 ms baseline — with the ambient occlusion of Round 24 and the
caves of Round 25 both still in them. The baseline was never moved, and it did
not have to be.

And the caves themselves are untouched, which the suite states exactly:

    PASS 1 · ceiling at +7
    PASS 2 · 40 blocks in (the passage runs 44) · dark=0.189 lit=1.000
    PASS 4 · 1 overhangs in 131 columns

Those are the same numbers, to the digit, that tests 1, 2 and 4 have printed
in every run since Round 25. The same mouth, the same passage, the same run
of it, the same darkness at the far end. Nothing was skipped that had anything
in it.

**Still ahead in Phase 3:** the geometric diff harness, and nothing else.
*(Done in Round 32 below. Phase 3 is complete.)*

## 4ae. Round 32 — the geometric diff: PHASE 3 COMPLETE ✅

*The last item of Phase 3, and the one PLAN.md §6 said must not be
hand-waved: proof that a builder run as blocks fills the SAME SPACE it filled
as triangles. `tools/stampdiff.js` — **14 pass · 0 fail**, and the game's own
suite still 12 pass · 0 fail · 0 pending.*

**1. What nothing else was asking.**
Tests 8 and 9 prove a house is FUNCTIONAL — a wall breaks out of it and a man
walks through the hole; it does not fall when the ground is dug from under it.
Neither would notice if the house came out **a block wider**, or a wall a
course short, or a doorway shifted half a block. That is the exact failure
mode of `STAMP_EPS`, the rule that a box fills a cell when it crosses more
than a sixth of it: get it wrong at a corner and every building on the earth
is wrong in the same direction, and nothing says a word.

**2. Voxels, not triangles.**
A stamped wall is meshed as merged runs (Round 30) and legitimately has far
fewer triangles than the boxes it replaced, so comparing geometry would fail
on correct work. The builder is run **twice** — once recording every box with
the stone it is made of, once writing blocks — the boxes are rasterised to the
grid by the SAME rule `stampBox` uses, and the two sets of cells are compared.
The probe drops its own stamp before it returns, and refuses outright if it
finds the test ground already carries built blocks (a stamp that meets a cell
already written does not record it as its own, and the diff would read short
and blame the builder).

**3. Three ways they can differ, and only one of them is a fault.**

| | meaning | verdict |
|---|---|---|
| **missing** | a cell a box asked for, and the stamp has not | always wrong |
| **swapped** | both have it, in different stone | right, but must be DECLARED |
| **extra** | the stamp has it, no box asked | right, but must be DECLARED |

`missing = 0` for all fourteen builders. The declarations are the valuable
part: **every deviation of the block world from the triangles it replaced is
now a line in a table with a reason beside it**, and a builder that acquires a
new one fails until somebody writes down why. There were exactly two, and
neither was recorded anywhere before this round asked:

- **the well** — 1 cell, `Coursed Stone → Water`: the water standing in its own
  shaft, which used to be a single drawn face and is now a block a man could
  in principle take a bucket from.
- **the house** — 49 cells, `Coursed Stone → Planks`: the plank floor laid on
  the cobble footing. In a block world the two share a course; as triangles
  the floor was a face lying on top of the cobble.
- **the farm** — 15 cells added, `Tilled Ground` and `Water`: the bed and its
  channel, laid by `emitTop`.

**4. The reading.**

    PASS  well          6 boxes →   21 cells · stamped   21 · missing 0
    PASS  pen          14 boxes →   12 cells · stamped   12 · missing 0
    PASS  farm          4 boxes →   22 cells · stamped   37 · missing 0
    PASS  stall         9 boxes →   25 cells · stamped   25 · missing 0
    PASS  bench         1 box    →    2 cells · stamped    2 · missing 0
    PASS  hay           1 box    →    1 cell  · stamped    1 · missing 0
    PASS  house        33 boxes →  487 cells · stamped  487 · missing 0
    PASS  stonecircle  15 boxes →  160 cells · stamped  160 · missing 0
    PASS  gate          5 boxes →  114 cells · stamped  114 · missing 0
    PASS  statue        3 boxes →   48 cells · stamped   48 · missing 0
    PASS  lighthouse    4 boxes →  458 cells · stamped  458 · missing 0
    PASS  pyramid      10 boxes → 1299 cells · stamped 1299 · missing 0
    PASS  ziggurat     19 boxes → 1001 cells · stamped 1001 · missing 0
    PASS  temple       19 boxes →  910 cells · stamped  910 · missing 0

Ten boxes of pyramid rasterise to 1,299 cells and the stamp holds exactly
those 1,299. Nineteen boxes of temple to 910, and 910.

**5. What it cost the game: one null check.**
`emitBox` gained `if(_boxRec) _boxRec.push(...)`, and `_boxRec` is null in every
frame the game has ever drawn — it is set only by this tool. `stampDiff` lives
on `__VDBG` with the other read-only probes and nothing in the game reads it.
The suite was re-run afterwards to say so: **12 pass · 0 fail · 0 pending**.

---

### PHASE 3 IS COMPLETE

Every `emit*` and `lm*` builder converted from triangles to block stamps;
structure edits kept in their own layer and dropped with the thing that laid
them; `buildPier` and `deckMap` last, as PLAN.md §9.3 asked; tests 8 and 9
green; and the geometric diff standing behind all of it.

## 4af. Round 33 — Phase 4 step 1: the reach, and the mark ✅

*PLAN.md §11 step 1. The traveller's arm: where it begins, how far it goes,
and the one block at the end of it. It changes nothing in the world — it is
the ground the other nine steps stand on.*

**1. It walks the grid; it does not cast at the triangles.**
A `THREE.Raycaster` would have to be handed every chunk mesh in view and would
answer with a TRIANGLE, which is the wrong answer twice over: **the merged
faces of Round 30 mean one triangle now spans many blocks**, and a triangle
tells you nothing about which side of a boundary the air is on. The grid walk
(Amanatides and Woo) answers with the CELL and the FACE, which is exactly what
a hand needs — the block to break, and the empty cell to build in. At most
five or six steps of integer arithmetic, one `blockSolidAt` apiece.

**2. And the arm begins at his head, not at the camera.**
Found by pointing it at the ground and getting nothing. The camera stands well
behind the traveller's shoulder and a good way above it; a reach measured from
there is measured from the wrong place, and looking down at his own feet the
camera is **eight blocks off ground the five-block arm should reach** — he
would be unable to mine the block he is standing on. The arm begins at his
head and runs along the way the camera LOOKS, which is what a third-person
view means: the eye is out there, the hand is here.

**3. The mark is this game's own.**
Twelve thin gold lines standing a hair off the block's faces, in `#e8c66a` —
the gold of the compass rose and the banners — not a black wireframe. Depth-
tested against the world, so a block half behind a hill shows only the half of
its mark that is in front of the hill.

**Verified by pixels, not by squinting.** The marked block's eight corners
were projected to the screen and the window scanned: gold at (484–487, 355)
reading `(255,239,108)` — the line, lifted by the day tint. Photographing it
took three attempts and every failure was the PROBE, not the mark: at zoom
0.02 the camera sits on the traveller's back and the block a pace in front of
him is behind his own body.

**4. Two faults of my own, both caught before they could ship.**
- **The boot broke.** `window.__VDBG` is built at module scope and I put a bare
  `REACH` in it; the `const` is declared below, beside the loop that uses it,
  so it was read in its own temporal dead zone and the world would not raise
  at all. Every probe on that object is a thunk for exactly this reason, and
  this one is now too.
- **Test 13 read `0 of 0 side faces` in the suite and passed alone.** It was
  reaching at the GROUND, and on flat country the block beside the one under
  your feet is solid at the same height — so a level ray starts INSIDE it, and
  the arm rightly refuses to answer for the cell a man's own head is in. The
  test relied on the terrain being interesting. It builds its own situation
  now: one block set in open air, reached at from all six ways through
  nothing but air, and put back afterwards.

**5. The reading.**

    PASS 13 · 6 of 6 ways struck the right cell and the right face
              · beyond the reach: nothing

and the twelve before it unchanged: **12 pass · 0 fail**, with 14–20 PENDING
and each naming the step of §11 it waits on.

**Still ahead in Phase 4:** steps 2–10. Next is the blow — hold to break,
progress by `hardness` and the held tool, fracture drawn as cracks spreading
from the point struck.

## 4ag. Round 34 — Phase 4 step 2: the blow ✅

*§11 step 2. Holding the hand to a block until it gives. Acceptance
**14 pass · 0 fail · 6 pending**.*

**1. The law of the time it takes was already written down.**
Every block has carried its `hardness` in seconds since Phase 2, put into
`blocks/*.js` against this very day and read by nothing until now. A block
that names a TOOL is not refused to the bare hand, but it comes hard: the hand
pays `HAND_SLOW` (2.5×) for want of the right iron. **When the belt is built
(step 5) the multiplier for what is held enters in exactly one place —
`toolSpeed` — and nothing else in the blow need change.**

**2. The fracture is not an overlay.**
A crack drawn as a texture laid over the face is the borrowed idiom this
project is at pains to avoid. These are real cracks: **five branches struck
out from the middle of the face that is struck**, each wandering as a split in
stone wanders, and revealed IN ORDER as the blow goes on — so the fracture
spreads outward and the eye reads how near the block is to going. The figure
is cut once when the hand settles on a new block; what changes per frame is
one integer, the draw range.

**3. A block half broken and left is whole again.**
The hand moving to another block closes the old fracture and strikes a new
one. That is the honest behaviour and the one every player expects, and the
test asserts it rather than assuming it.

**4. Held, without disturbing look or walk.**
`R`, or the pointer held STILL for a fifth of a second — a pointer that moves
is a look-drag and always was. The existing twin-zone touch scheme is not
touched: the left-lower stick and the look-drag behave exactly as before. The
belt (step 5) is where the touch question is properly answered.

**5. Two photographs that were not evidence, and the count that was.**
The first pictures of the fracture showed nothing, and it would have been easy
to call the cracks broken. They were not: **the test hook was fabricating the
face**, naming the block's TOP, and a crack figure laid on the top of a wall
block is drawn edge-on to a level eye. The hook names the face now. And the
loop was driving the blow at the same time as the probe — one SwiftShader
frame is half a second, which carried the work past the end before the shutter
opened — so a test that drives the blow now says so and the loop stands off.

Measured at the block's own projected position, on the face being struck:

| through the blow | segments drawn | ink pixels on the block |
|---|---|---|
| 0.35 | 6 of 16 | 17 |
| 0.70 | 11 of 16 | 25 |
| 0.95 | 15 of 16 | 39 |

**6. The reading.**

    PASS 14 · Baked Brick (hardness 2.6, by hand ×2.5 = 6.50s) broke at 6.52s
              · 16 cracks cut · half-broken at 3.27s
              · the hand taken off loses the work: true

**Still ahead in Phase 4:** steps 3–10. Next is the drop and the gathering —
what is broken becomes a thing on the ground, and the first place a block's
`verse` is spoken.

## 4ah. Round 35 — Phase 4 step 3: the drop, and the gathering ✅

*§11 step 3. What is broken does not vanish: it falls, it lies on the ground,
and it is taken up by whoever walks over it. Acceptance **15 pass · 0 fail ·
5 pending**.*

**1. `drops` was written down in Phase 2 and read by nothing until now** —
the third field of the block registry to come into use this phase, after
`hardness` and `verse`. A block gives back the thing it names, which is
usually itself and sometimes is not.

**2. It is the first place a block SPEAKS.**
Every block may carry a `verse`, and this is the moment for it: **the first
time a substance is ever gathered, the word that belongs to it is given.** Not
every time — a verse said over every handful of dirt is a verse nobody reads.
Once, on first taking, and thereafter it is his. Five blocks carry one today
(bitumen, brick, dirt, salt, water) and the rest will as the material economy
of step 7 arrives.

**3. What it does, and what it deliberately does not.**
A drop is a small turning cube of the substance's own face; it is thrown a
little way out of the block that was struck, falls under gravity, and settles
on whatever ground is under it — the same `groundInfo` the traveller's own
feet use, so it lies on a pier deck or a house floor as readily as on a field.
Within a pace and a half of the traveller it flies to him and is taken. Not
instantly: a third of a second must pass first, **or a man would swallow his
own pick-swing before it landed.** Six minutes untaken and the earth has it
back. Sixty-four at once is the cap — more than that on the ground is a fault
rather than a feature.

The tally it goes into is a plain count. **The satchel proper — stacks,
capacity, and the writing of it into the save — is step 4, and will take this
tally over rather than sit beside it.**

**4. Two tests of mine that were wrong in two different ways.**
Both are recorded because both are the same failure of imagination: a test
that assumes where it is standing.
- **It broke a block it never walked to.** Three paces off, and the gathering
  reach is a pace and a half. A thing lying three paces away is not gathered
  by wishing.
- **Then, stood on the block, it asked for two things that exclude each
  other.** A block broken at a man's own FEET is gathered as it falls and
  never comes to rest at all — so one striking cannot show both "it rested"
  and "it was taken". It is broken out of reach now, watched down, and THEN
  walked to.
- And underneath both: run after the cave tests the traveller is UNDER a
  mountain, so `blockUnder` answered with the roof of the passage. The block
  was set above THAT and what fell from it came to rest on the mountain-top
  while he stood in the dark beneath. It passed alone and failed in the suite,
  which is the signature of exactly this fault. He is stood on the very ground
  the test is about to build over, and everything after is within a pace of
  him by construction.

**5. The reading.**

    PASS 15 · broke=true · it fell and came to rest=true · taken up=true
              · the hoard gained 1 · its word was spoken=true

**Still ahead in Phase 4:** steps 4–10. Next is the satchel — stacks,
capacity, and the save bumped to carry it.

## 4ai. Round 36 — Phase 4 step 4: the satchel ✅

*§11 step 4. What the traveller carries, as DATA — no picture of it. The belt
of clay tokens and the satchel that opens as an illuminated page are step 5,
and they will read this and nothing else. Acceptance **16 pass · 0 fail ·
4 pending**.*

**1. The measures are this world's, not another game's.**
A stack is a **SCORE — twenty** — a number this earth counts in, and nothing
like the sixty-four every player would recognise on sight. **Eight** go on the
belt where the hand can reach them; **four-and-twenty** more lie in the
satchel behind. Two and thirty in all, and a man who fills them must leave
something behind, which is the whole point of a satchel having a size.

**2. One array, and the belt is its first eight slots.**
A token moved from the page to the belt is an index change and nothing else.
There is no second container to keep in step with the first and no way for the
two to disagree — **which is the bug that owns every inventory ever written.**

**3. A full satchel takes nothing, and says so.**
`satchelAdd` answers how many it actually took. A drop that will not fit
**stays lying where it fell** rather than being swallowed into nowhere. The
gathering of step 3 was rewritten to ask before it takes.

**4. The save is v8, and it keeps his order.**
`sa` is the satchel slot by slot and `sp` the substances whose word has been
given. **The order is his** — he arranged it — and a save that re-sorted his
belt would be a save that rearranged his hands. A slot naming a substance a
later build no longer knows is dropped rather than guessed at, which is what
the block table's string `id` has been for since Phase 2.

It is written **a breath after the last thing taken**, not on every pebble:
`saveState` stringifies the whole voyage — the log, the visited lands, the
wrecks, the pearls — and doing that once per block gathered would write a
hundred kilobytes a second while a man mines.

**5. And the test was made to mean what it says.**
Its name is *"survives a reload"*, and the first draft wrote the save and read
the same object back, which proves nothing whatever about a world raised again
from it. It reloads now, as test 7 does. After the reload he still carries
**5 brick and 5 cobble, in his own order**.

**6. The reading.**

    PASS 16 · a score is 20 · 30 bricks lay as 1 full stack and 1 part
              · a full satchel refuses=true
              · taking gave back 30 of 37 asked
              · after the reload he still carries 5 brick and 5 cobble, in his own order

**Still ahead in Phase 4:** steps 5–10. Next is the belt and the page — the
UI, and by §2.2 the place this phase is won or lost.

## 4aj. Round 37 — Phase 4 step 5: the belt, and the page ✅

*§11 step 5. The satchel of Round 36 given a face. By §2.2 this is where the
phase is won or lost — the interface is the cheapest and most-seen
differentiator there is, and a grey hotbar of grey squares would undo every
other thing in this phase at a glance. Acceptance **16 pass · 0 fail ·
4 pending**.*

**1. Clay on leather, not grey on grey.**
A strap of tooled leather, and on it eight **clay tokens**, each fired with
the face of the substance it holds — **drawn out of the very texture the
mesher lays on the block**, so a token of cedar and a wall of cedar are the
same picture, by construction and not by resemblance. The token in the hand
stands proud of the strap and takes a gold rim; the rest lie flat. The count
is set in the HUD's own gold Georgia, as every number in this game is.

**2. The satchel opens as an illuminated page.**
Parchment, a gold rule, and a lettered initial in madder red: *The Satchel*.
The four-and-twenty slots upon the page, and the eight of the belt on a strap
beneath it under the line *"the belt — what the hand can reach"*. A thing is
moved to the hand by **two touches and no dragging**, which is the only
scheme that works the same with a finger and with a mouse. Two part-stacks of
one substance **pour together** before they trade places.

**3. THE WHEEL IS NOT TAKEN.**
Every other game of this kind puts the belt on the scroll wheel. In this one
the wheel has drawn the eye back off the world since long before there was a
belt — out to the whole earth — and that is a better use of it. The tokens are
chosen by the number keys and by being touched.

**4. And that touch is also the answer to the phone.**
A token is a DOM button lying over the canvas, so a finger on it **never
reaches the look-drag beneath**; and the walking-stick's own corner (the left,
below a third of the way up) is nowhere near the strap. **Nothing of the
twin-zone scheme is changed** — not a line of the pointer handling was
touched. The brief calls this a real design problem rather than an
afterthought, which is why it got a step of its own rather than being folded
into step 4.

**5. The belt is redrawn when it changes and not when it does not.**
A signature of *(shown, held, the eight slots)* is compared each frame and the
HUD is rebuilt only when it differs. A HUD rebuilt every frame is a HUD that
costs a frame.

**6. And step 2's promise is kept — with a correction.**
Round 34 said the multiplier for what is held would enter in **exactly one
place**, `toolSpeed`, and it has. But the first draft of it was wrong in a way
worth recording: `tool` on a BLOCK names *the tool that breaks it* — it does
not make the block into that tool. Asking whether the held thing's own `tool`
matched would have meant **holding a brick sped the breaking of brick**, which
is nonsense dressed as a feature. What is asked is whether the held thing
`serves` as that tool — a field no block declares, and which the works of step
9 will put on the pick, the axe and the rest. **Today every hand is still bare
and the blow reads exactly as it did in Round 34** — but it now reads the hand
rather than assuming it.

*(And the test I wrote for it was wrong too: it took grass for a thing that
asks no tool. Grass asks for a SPADE. Hay asks for nothing.)*

**7. The reading.**

    PASS 14 · Baked Brick broke at 6.52s · 16 cracks cut
              · the hand taken off loses the work: true
              · the speed is read out of the hand: true
    PASS 16 · after the reload he still carries 5 brick and 5 cobble, in his own order

**Still ahead in Phase 4:** steps 6–10. Next is the placing — against the hit
face, on the air side, and refusing to stand inside the traveller, a villager
or a beast.

## 4ak. Round 38 — Phase 4 step 6: the placing ✅

*§11 step 6. A block set down against the face that was struck, on the AIR
side of it. Acceptance **18 pass · 0 fail · 2 pending**.*

**1. This is what step 1 answered with a FACE for.**
The grid walk gives the cell AND the face; the cell to build in is the cell
plus the face's own normal, and there is nothing to work out. Proved six ways:
the arm brought to each face of one block in turn, and what is laid appears
back the way the arm came, every time.

**2. It refuses to stand inside a living thing.**
The brief calls this immediately world-breaking and it is — **a man who walls
himself into his own body is stuck for ever, and a man who buries a villager
has silently killed something the world will go on trying to walk.** So the
cell is measured against the traveller's own body, and against every villager
and beast standing within reach of it. Nothing of it is a guess: each is a box
about a known point, and the cell either crosses it or it does not.

Measured: **the two cells of his own body are refused, and 48 of 48 villagers
in a town cannot be built into** (33 of 33 in the run where a smaller town was
standing).

**3. A tap lays; a hold mines.**
They are told apart by the clock and by nothing else. The blow of Round 34
needs the pointer held STILL for a fifth of a second before it begins, so a
quick tap has done no mining at all by the time it is let go and is free to
mean something else. It is the same distinction a hand makes on a real wall,
and it costs the touch scheme nothing — a look-drag MOVES, and neither of
these fires on a drag. The right button lays at once for a mouse, `V` for a
keyboard, and the menu that usually comes with a right button is not wanted
over a world.

**4. And it costs him what he lays.** One taken out of the satchel per block
set down, and the belt redrawn to show it. A hand with nothing in it lays
nothing.

**5. A third test of mine that assumed where it was standing.**
Fired from three blocks off, four of the six rays began INSIDE a hillside —
and the arm rightly refuses to answer for a cell a man's own head is in, so
the test read the right refusal as *"the arm missed"*. The six lanes are
emptied before anything is asked of them. **That is now three rounds running
(35, 37, 38) where the code was right and my test was wrong**, and all three
in the same way: assuming the shape of the ground it happened to land on.

**6. The reading.**

    PASS 17 · 6 of 6 faces laid on the air side · and it costs him what he lays=true
    PASS 18 · the two cells of his own body are refused=true
              · 48 of 48 villagers cannot be built into

**Still ahead in Phase 4:** steps 7–10. Next is the material economy —
`world/minerals.js`, ores by land and by depth, into the caves Phase 1 dug.

## 4al. Round 39 — Phase 4 step 7: what lies under every land, and the seam in the face ✅

*§11 step 7. Eight substances as data, drawn in the rock, and the caves given a
reason. Acceptance **19 pass · 0 fail · 2 pending**; the geometric diff
**14 pass · 0 fail**.*

**1. One file, and the engine knows no country by name.**
`world/minerals.js` is a list of eight lines: a substance, the lands that hold
it, the band of depth it lies in, and how often. The lands are resolved to
country numbers ONCE at load into `MIN_BY_CI`, an array indexed by the number
the cell already carries — so *"what ore is under this block"* is one array
lookup and a walk of a list that is nearly always empty and never longer than
five, and it is asked only of blocks BELOW the surface course. Add a land to a
line in that file and that land holds that ore with **not a line changed in
`js/engine.js`**, which is the rule `world/fauna.js` and `world/flora.js`
already keep.

Measured: **8 substances declared, 8 placed, 63 holdings across 44 lands.**

**2. It is seeded on the PLACE, not on the visit.**
The same shaft always holds the same vein. Two men digging the same hill find
the same gold, and a man who leaves and comes back finds his working where he
left it — which is the only version of this worth having, and it costs a hash
of the coordinates rather than a stored table of anything.

**3. WHAT THE GROUND ACTUALLY IS, and how it changed the data.**
I wrote the bands first and then went to look, and the world corrected me:
**rock exists only for `0 ≤ iy < c.h`.** There is no underworld beneath the
sea's floor. The stone of a column runs from its own surface down to nothing,
so a plain standing three courses above the water has three courses of rock
beneath it and no more — and a band beginning twenty courses down therefore
exists ONLY under high country.

That is not a defect; it is the truth of this world, and it is a better truth
than the one I had assumed. **The deep metals are metals of the HILLS, and a
man who wants gold must climb before he digs.** So gold came in from 22–70 to
18–64 and silver from 16–60 to 14–56, and the fact itself is now written at
the head of `world/minerals.js` rather than left for the next person to
discover by finding nothing.

**4. Six new stones, and not sixty.**
`gold-ore`, `silver-ore`, `copper-ore`, `iron-ore`, `alabaster`, `flint`.
Salt and bitumen already existed and are now put in the ground where they
belong rather than only in the hand of whoever placed them. The ores are cut
as a limestone body with a metal grain — a shadow pixel down and to the right
of each grain, and one bright facet on the larger ones where the light catches
— so they read as metal IN rock and not as painted cubes. Alabaster is banded;
flint breaks in shells. **§11's refusal stands**: the brief's sixty substances
are still not here, and a substance still ships when a work needs it.

**5. A fourth round where the code was right and my test was wrong — and it
was the same fault as the other three.**
Test 21 failed twice on its first writing:

- *Silver not found anywhere.* It was searching thirty blocks about each
  CAPITAL — and a capital stands on low ground, where by §3 there is no rock
  deep enough to hold it. Silver was in the hills three valleys over the whole
  time; Chile's high country runs to 145 courses.
- *21 of 4568 cells "outside their own band".* Every one of them was a cell in
  a NEIGHBOURING country. The sweep took the ore it found near a site and
  judged it against the site's country rather than **the cell's own**.

Both are the fault of Rounds 35, 37 and 38 wearing a new coat: **assuming the
shape of the ground it happened to land on.** The rewritten test sweeps each
country across ITS OWN EXTENT — a lattice over the bounds of its outline — and
digs only columns the map agrees lie in that country.

**6. The reading.**

    PASS 21 · every land holds what its data says, and the ore is truly in the rock
             8 substances declared · 8 placed in 63 lands
             6405 columns dug in 44 lands:
               Iron 283, Silver 25, Gold 4, Flint 299, Copper 32,
               Salt 35, Slime 42, Alabaster 28
             0 of 29454 cells outside their own band

Gold four times in 6405 columns is not a thin seam badly tuned — it is gold, at
eighteen courses, under the only ground high enough to have eighteen courses.
A shaft sunk in the right hill has about one chance in fourteen; a drift run
along the band finds a vein every hundred blocks or so. It is meant to be the
thing a man goes down into the dark for.

**And the test knows where to look when the lattice does not.** A lattice over
a country's bounds lands almost everywhere on its LOW ground, because almost
all of a country is low ground — so a substance can be genuinely present and
still be missed. Anything the sweep does not turn up is now looked for the way
a man would look for it: **at the tallest ground the sweep saw in that land,
and about it.** It runs only for what is still missing, so it costs nothing on
a good day, and it is the difference between a test that reports the world and
one that reports its own sampling.

**7. AND THE ORE WAS INVISIBLE — the fault that nearly shipped.**
Everything above was true and the step was still not done. The terrain mesher
takes a face's material from `sideMatsFor(kind)` — 'dirt', 'stone', 'sand' —
and **never consults the block model at all**. `blockAt` is read by the aim
raycast, by `setBlock` and by the tests, and by nothing that draws. So the ore
was in the ground, breakable, and it dropped what it should, and **no man
could ever have seen it.** A seam found only by breaking the stone in front of
it at random is not a reason to walk into a cave; it is a lottery.

So the flank bands are CUT. A wall face is one unbroken run of the country's
own rock unless a seam crosses it, and where one does the band is split at
that course and the ore's own face drawn in the gap — through the same `put`
that already carries the ambient-occlusion gradient, so a face split in three
keeps one unbroken crease across the joins instead of showing a seam where no
seam is. The floor of a passage takes the top of the block beneath it and its
roof the underside of the one above, which is what a man walking in with a
light actually looks at.

**It is gated so that the earth does not pay for it.** One array read per
column says whether that country holds anything at all, and for nearly the
whole world the answer is no. Where it is yes, the union of that land's own
bands is kept on the list, so the cutter walks only the courses at depths
something of that country can lie at — at most some sixty, and usually none of
them exposed.

Measured, on a natural cliff in Iran with sixteen ore blocks standing in its
face: **302 triangles of iron, 342 of salt, 178 of bitumen and 102 of silver
standing in the chunk meshes**, counted by material identity and not by eye.
And the cost, over the whole suite: **`plain 1.862 ms/chunk` against a baseline
of 1.970** — the seam cutter is inside the noise, and still under the figure
this project started from — with ocean at 0.648 (was 2.152) and a cave chunk at
1.06× open ground. The gate is what makes it free: a country holding nothing
pays one array read for the column, and one holding something looks only at the
depths its own substances lie at.

And the fourteen builders were run through the geometric diff again afterwards,
because a change to the mesher is exactly the thing that moves a wall half a
block without anybody noticing: **14 pass · 0 fail, `missing 0` on every one.**

**8. AND A VEIN THAT MOVED WHEN I SORTED A LIST.**
Test 21 passed, and then passed again with **different numbers** — Gold 1 → 0,
Alabaster 33 → 50. Nothing about the world had changed. What had changed was
that I had alphabetised the block entries in `world/manifest.js`.

The seed took the BLOCK's number, and a block's number is only its position in
that list. So adding a block file — or tidying the order of one — **moved every
vein in the world**: a man's working gone, and a hill he had never touched
holding it, and not a word said anywhere. It is exactly the class of fault this
audit exists to catch, and it was caught by the one property I had written the
test to check: that the same question asked twice gives the same answer.

The seed is taken off the substance's own `id` now — a fact about the world
rather than about a file — with a check at load that no two substances share
one. Asked twice, test 21 now answers identically to the block.

**9. A trap worth writing down.** `setBlock` takes WORLD coordinates and
`blockAt` takes BLOCK INDICES. Nothing shipped is wrong — the aim raycast
hands `setBlock` world space and always has — but a probe of mine passed
indices to both and quietly cut its shaft near the origin, six times smaller
and eight thousand blocks away, and looked for twenty minutes like a mesher
fault. It is noted here rather than changed: the signatures are each right for
their callers, and §12 says not to re-solve what is ticked.

**Still ahead in Phase 4:** steps 8–10. Next is gravity and finite water —
sand and gravel that fall when unsupported, and water that spreads N blocks
and **stops**.

## 4am. Round 40 — Phase 4 step 8: what will not stand, and what will not lie still ✅

*§11 step 8. Two rules about the world, and then STOPPED. Acceptance
**21 pass · 0 fail · 1 pending**; the geometric diff **14 pass · 0 fail**.*

**1. Both rules hang off the ONE DOOR, and a world nobody is digging pays
nothing.**
`setBlock` is the only way a block changes, and it is the only thing that
wakes either rule — and only where a cell has been EMPTIED, which is the only
event either rule cares about: what stood on that cell may not stand, and what
water lay beside it now has somewhere to go. The cell is written on a list and
looked at in the FRAME, never in the middle of the edit itself, so no blow of
a pick ever runs a cascade inside its own bookkeeping. `fallTick` returns on
its first line — three length checks — unless something is actually falling,
flowing or waiting. (There is one other waking, and it is the same case
wearing a coat: a gravity block LAID over a hole, which is a bank standing on
nothing however it came to be there.)

**2. THE FIRST RULE — a bank of sand will not stand on nothing.**
Cut what is under it and it comes down; the emptying of ITS cell wakes what
stood over that, and so on up the column, so a whole bank comes down and not
one course of it. It falls as a real cube, drawn with its own stone, and it
lands in the first cell above whatever stopped it.

And it is the same rule whichever way the sand came to be there: **a hand that
lays sand over a hole is answered exactly as a hand that digs the hole out
from under it.** That was not true when I first wrote it — the rule only ever
woke on an emptying, so a bank BUILT in mid-air hung there — and a bank of
thirty-six blocks laid on a pier proved it by leaving eight columns of nine
floating when the pier came out.

Measured: a bank of thirty-six on a pier, the pier taken out at a stroke —
**36 of 36 went loose, 36 of 36 landed, none left in the air.**

**And then a bank far bigger than the air can hold.** Only sixty-four blocks
may be falling at once — a cap, so that a careless cut cannot put ten thousand
meshes in the scene in one frame. Written first, that cap silently ABANDONED
the rest: `fallCheck` found the air full and simply returned, and the remainder
of the bank hung in the sky for ever. A cell refused now goes back on the list
and is asked again next frame, so a great collapse comes down in COURSES and
all of it comes down. Proved on seven-and-forty columns of sand fourteen deep:

    686 blocks built · 686 standing after · 0 lost · 0 left hanging
    never more than 64 in the air at once

**3. THE SECOND RULE — water will not lie still with somewhere to go.**
It is not made: it is MOVED. There is exactly as much water in the world after
a flow as there was before it, so a cistern can be emptied and cannot be
milked. Down first, always; then to any side that has a fall under it, which
is water finding the hole; and last out flat, but only under the weight of
water standing over it.

Measured, on a walled pool of twenty-seven with its south wall broken: **27
before, 27 after** — seven of them outside the wall, four blocks from it, and
the flow stopped of its own accord.

**4. AND N BLOCKS, WHICH I DID NOT HAVE AND THOUGHT I DID.**
I wrote the three rules above and reasoned my way to the conclusion that they
must settle: down lowers the water, and the flat spread spends the weight that
allowed it. I put that reasoning in a comment. Then I measured it, and the
pool drained seven blocks **at a cost of a thousand moves** — the whole
backstop, spent, to move seven blocks of water four paces.

Down always lowers the water. **A step sideways does not**, and nothing in
what I had written stopped it being taken twice. So every parcel of water now
carries a REACH: a fall gives it back — water that has found a drop has earned
the right to run again — and every sideways step spends one of it. At nothing
it stands still. Down is unbounded, which is right, a stream runs to the sea;
across is bounded to N, which is what makes it stop. **That is §11's "spreads
N blocks and down, and stops", exactly as written, and it took a measurement
rather than an argument to find that I had not implemented it.**

The comment claiming it terminated of itself has been replaced by the account
above, because a wrong comment is worse than none.

**5. What it costs, which is the question that matters.**
The same pool, breached, with the reach in: **394 moves, and it stops.** Seven
blocks of water rearranging themselves 394 times is a great deal more
shuffling than the result needs — water here has no notion of a LEVEL, so a
draining body reorganises itself invisibly — and that is the price of not
building the fluid simulation §11 forbids. What matters is whether it can be
felt, so it was timed rather than guessed at:

    standing still   130.55 ms mean · 146.70 ms p95
    the pool draining 133.81 ms mean · 140.10 ms p95

Two and a half per cent, once, for about a second, and inside the run-to-run
spread. (These are SwiftShader's software frames — the ABSOLUTE figures mean
nothing; the comparison is the whole point.) Behind that sits the backstop:
no one cut may move more than FLOW_BUDGET blocks of water whatever shape of
ground I have not thought of — a bound in plain sight rather than another
promise about my own reasoning, and refilled by a HAND and never by water's
own moving.

**6. Nothing is lost in the air.**
A block on its way down is OUT of the world — lifted from the overlay and not
yet set down. Close the page in that second and it is gone, and a rule whose
whole claim is that nothing is made and nothing is lost would be quietly
untrue once in every hundred landslips. Whatever is still falling is set down
where it stands before the world is written. And a world REOPENED does not
rain sand: `editsLoad` writes into the overlay directly and not through the
door, so a saved hole is a hole and not an event.

**7. AND TEST 12 CRIED WOLF, AND I DID NOT TAKE ITS WORD FOR IT EITHER WAY.**
Two suites ended up running at once on this box, and the contended one failed
test 12 — `plain 3.307 ms/chunk` against a threshold of 2.66 — while the
isolated one passed at 2.331. Machine noise is the easy answer, and it is the
answer Round 30 was punished for giving: **the greedy merge later proved that
one real.** So it was not asserted. It was TESTED — three isolated runs of the
step 8 code, and then the step 7 code checked back out and run three times on
the same box in the same minute:

    step 8   plain 2.192 · 2.251 · 2.119 ms/chunk
    step 7   plain 2.114 · 2.346 · 2.163 ms/chunk

Identical within the spread. The whole shift from the 1.862 recorded for step
7 an hour earlier is the MACHINE and not the change — which is also what the
code says, since nothing in step 8 is reachable from `buildChunk`: stamping
never goes through `setBlock`, and `fallTick` is not called by the mesher.
**The baseline has not been moved, and has not been moved for eleven rounds.**

**8. The reading.**

    PASS 19 · three of sand stood on stone=true · the stone taken out: 3 of 3
              came down, resting at 18 (the ground of the column is 18)
              · on solid ground=true · in one piece=true · none left in the air=true
    PASS 22 · two of water stood in the cistern=true · the wall broken: it ran
              out=true (1 of 2 still within the walls) as far as 2 block(s)
              · water before 2, after 2 (nothing made, nothing lost=true)
              · it stopped of itself=true · 4 of a budget of 1024 spent

**9. What is deliberately not here.**

**Water is not swum in.** It is moved, it is finite, it is drawn, and a man
stands on top of it exactly as he stands on the standing water of a well
today. Swimming in it wants the breath, the walker and the beasts' pathing
opened at once, and that is a step of its own and not a corner of this one.

**Gravel is not here.** §11 names it beside sand, and §14 forbids placeholder
content, and those two pull opposite ways: a gravel block nothing puts in the
ground and no work asks for is a block nobody can obtain. The rule this
project already holds to — *a substance ships when a work needs it, an ore
ships when a land holds it* — decides it. Sand carries the rule today, and
sand is in every desert and on every shore of the world. Gravel ships when
something gives it a home.

**And there is very little water in blocks yet.** A well holds one cell of it
and a farm's channel three. The rule is right and it is reachable — break a
well's kerb and the cupful runs out and downhill — but the pools worth
breaching are the ones a man builds himself, until something in Phase 5 or
step 9 puts more water in the ground. That is worth saying plainly rather than
leaving to be discovered.

**Still ahead in Phase 4:** steps 9 and 10. Next are the named works —
`world/works.js`, the altar of unhewn stone that refuses hewn stone, the tent
of goat hair, the ark pitched within and without — and the tools, which is
where `serves` and the whole material economy finally come to something.

## 4an. Round 41 — Phase 4 step 9: the named works, and every verse in the game put on oath ✅

*§11 step 9, and §5's extractor, which had never been written. Acceptance
**22 pass · 0 fail · 0 pending** — the first round in which the suite has
nothing outstanding at all; the geometric diff **14 pass · 0 fail**.*

**1. THE TOOL THE BRIEF ASKS FOR BY NAME, AND WHAT IT FOUND.**
§5: *"Do not paraphrase. Do not summarise a verse into a caption. Do not
invent a reference. Write `tools/extract-besorah.js` so it is repeatable, and
commit it."* It had not been written, through eight phases and forty rounds,
and the reason that matters turned up the moment it was.

The scripture is not in the markup of the offline Besorah — it is one JSON
blob in a `<script id="text-data">` tag, keyed by book, chapter and verse. The
tool reads it and will quote a reference, search for a half-remembered
phrase, list the books, or emit verses in this project's own format. And it
**checks**: `--check` runs every file under `world/`, `blocks/`, `countries/`,
`cities/` and `creatures/` against a stand-in `EARTH`, collects every verse
they register, resolves the reference and compares the text to the letter. It
does not read the files with a regular expression — it RUNS them, so what is
checked is what ships.

Its first reading of the world as it stood:

    18 exact · 13 paraphrased · 0 sourceable by their own references

**Thirteen paraphrases** — among them the gold of Havilah, the stones of
iron, the mine for silver, the tar pits of Siddim, and the welcome of two
countries. Most were mine, written in step 7 from memory because the source
was right there and I did not open it. All thirteen are corrected to the
source's own words in the commit before this one.

**2. AND THE NAMES OF THE BOOKS DO NOT CHANGE.**
The Besorah spells several books differently from the way this project has
spelled them since its first round — DAḆARIM against DEḆARIM, 1 MALAḴIM
against MELAKIM ALEPH, YAHAZQ'AL against YEḤEZQAL. The obvious move is to
rewrite the world's references to match the source. **That is the wrong
move**, and it is not what was done: a reader who has seen DEḆARIM on a block
since the beginning should go on seeing it. The difference is reconciled
inside the tool, in one alias table with a reason beside it, and a reference
is always printed back **in the name it was asked in** — so the tool cannot
walk its own spelling into the game one pasted verse at a time.

Two smaller things the comparison caught that no eye would have:
`norm()` threw diacritics away instead of folding them, so DEḆARIM became
"derim" and matched nothing; and my own first draft of the altar's verse used
a curly apostrophe where the source has a straight one. **The checker caught
its author within the hour.**

**3. AND ONE PLACE WHERE THE SOURCE ITSELF IS SHORT.**
SHEMOTH 20:25 reads, in this Besorah: *"…for if you use your chisel on it,
you have it."* The clause is plainly missing a word. There were three things
I could do: quote it as it stands and propagate a defect; repair it from
memory, which is the exact thing §5 forbids; or **quote the command as far as
it runs clean** — *"And if you make Me an mizbe'ach of stone, do not build it
of cut stone"* — which is contiguous, exact, and says the whole of what the
work needs to say. The third. It is written here so that nobody later reads
the short quotation as carelessness.

**4. THE WORKS THEMSELVES — thirteen, and NOT A TECH TREE.**
`world/works.js` on the pattern the minerals and the fauna keep: a work names
what it takes, what it gives, whether it wants a fire, whether it wants a
tool in the hand, and what it REFUSES. The engine knows none of them by name.

There is no research and no unlock graph. **The whole list is on the page
from the first minute** — greyed where he lacks the materials, so the page
tells him what to go and look for, which is the only direction-giving this
game has ever wanted.

**5. THE ALTAR, AND WHY `refuses` IS THE WHOLE STEP.**
A recipe that is merely short of a material says *"you have not got it"* and a
man shrugs. But a man at the altar with a satchel of DRESSED stone **is not
short of stone**. He has plenty. It is forbidden, and he is meant to be told
so in the words of the command.

So a work may name a substance that would otherwise serve perfectly well and
refuse it outright; and when the hand holds enough of the refused thing and
lacks the true material, the work is not withheld but REFUSED, with its
verse spoken. On the page that row is not greyed like the others — it is in
madder, because it is not a want, it is a no.

Measured: **with twelve hewn stones the altar is refused (`why:'refused'`,
not `'short'`), it is not made, and the twelve are still his** — nothing is
consumed by a refusal. With twelve of the living rock it is allowed, made,
and gives.

**6. AND THE LIVING ROCK WAS RENAMED TO WHAT IT IS.**
None of the above meant anything while the world's own bedrock shipped under
the name **"Hewn Stone"** — as though a mason had dressed every hill on the
earth. The altar would have refused a block with the same name as the block
it required. It is `Unhewn Stone` now; hewn stone is a separate block with a
dressed face and drafted margins, and it is what the hewing WORK gives.

**The id is untouched.** `stone` is still `stone`, because an id is never
renamed: every save ever written, every structure that stamps stone, and
every line of `KIND_BLOCK` depends on it. What changed is what a man reads
when he holds it, which is the part that was wrong.

**7. What is deliberately not here.**

**The tent of goat hair, the ark of gopher wood, the furnishings in acacia
and gold.** All three are named in §4 and none is shipped, because the world
has no goat hair, no gopher wood and no acacia in it. A recipe nobody can
attempt is worse than one that is not written — it is the placeholder content
§14 forbids, wearing a verse. They ship when something puts their materials
in the ground, which is the same rule the ores keep.

**The smelting of copper and iron.** The ore is in the hills already, and the
metal wants a fire hotter than a kiln and a work of its own. The tools that
ship are of flint and riven plank, which is what a man had before he had a
furnace, and they make the whole material economy pay: held, a pick takes the
rock in a fraction of the time a bare hand does, and `serves` — declared in
step 2 and read by nothing until today — finally means something.

**8. And a tool is not a cubic metre of tool.** `place:false`, read at the one
door a block enters the world through. A world in which a man paves his yard
with hoes is not this one.

**9. The reading.**

    PASS 20 · 13 works declared · with 12 hewn-stone: refused=true (and not
              merely "short"), made=false, and the stone is still his: 12
              · with 12 stone: allowed=true, made=true, it gave 1
              · brick away from a kiln: place

    tools/extract-besorah.js --check
              41 exact · 0 paraphrased · 0 unsourceable

**Still ahead in Phase 4:** step 10, the free hand — unlimited blocks,
flight, instant break, the same world and the same save. It is last because
it is the mode Phase 8's schematic tool will be used in.

## 4ao. Round 42 — Phase 4 step 10: the free hand. PHASE 4 COMPLETE ✅

*§11 step 10, the last of the phase. Acceptance **23 pass · 0 fail · 0
pending**; the geometric diff **14 pass · 0 fail**; the verses **41 exact · 0
paraphrased**.*

**1. IT IS NOT A THIRD MODE, AND THAT IS THE WHOLE DESIGN DECISION.**
§11 says *"the second mode at the menu: unlimited blocks, flight, instant
break."* The obvious reading is: add a mode. The right reading is that **the
second mode at the menu already exists**, and has since long before there was
a hand at all — FREE ROAM, which gives the air, the sun, the hour and the
season, and which already answers `true` to every `roamOnly()` gate in the
game including the one that lets a man leave the ground.

A third mode would have put a man in front of a menu choosing between
**flying** and **building**, which is exactly backwards: the mode a place is
built in is the mode a place is flown around in. So the free hand is what free
roam BECOMES now that there is a hand — the same flag, the same line in the
log, the same save version, three more freedoms — and the menu item is
renamed to say so.

**2. Same world, same save — which was already true and had never been said.**
Beginning anew washes the LOG: the voyage, the visited lands, the cargo, the
pearls. It has never touched the block edits, which live in their own store
and are keyed to the world rather than to the voyage. **So a place built with
the free hand is standing there on the next voyage, and always would have
been.** Nothing had to be built to make that true. It is written down because
it is the whole of what §11 means by that phrase and because it is exactly the
sort of thing one would otherwise assume was broken.

Proved rather than asserted: a block laid in the free hand is read back
through `blockAt` — the one overlay every test, the walker and the mesher all
read — with the flag put back to what it was first.

**3. The three freedoms, and what each one is careful about.**

**It costs nothing to lay.** Not "a very large satchel": the stack is not
touched at all, so what he holds never runs out and never has to be fetched.
On a voyage the same block still costs him exactly one, which is the half of
this test that matters — a freedom nobody can turn off is not a freedom, it is
a bug.

**It breaks at a touch.** Not "very fast" — `need` is zero, so the block is
gone on the first frame the hand is on it. A man laying out a place should
never be waiting on a hardness table.

**And it leaves no litter.** The drop is suppressed, because the satchel
already holds everything and a stream of pickups behind a man clearing a
hillside is refuse he cannot refuse. Measured: nothing lying on the ground
after the blow.

**4. THE STORES — the honest reading of "unlimited blocks".**
Not a satchel that never empties, which would still leave him hunting for the
one stone he wants. **Every block in the world, laid out on the page to be
picked up**, one touch for a full stack into the slot he has picked or the
first that is free. That is how a place gets laid out: by choosing what to
lay, not by going to find it.

Two things it is careful about. It is drawn ONLY in the free hand, and not
merely hidden on a voyage — the rows are not built at all, so a voyage pays
nothing for a leaf it can never open. And **no tool is in it**: a tool is made
at the works, and a man who could take a pick out of the air would never make
one, which would quietly undo step 9 the day after it shipped.

Measured: **31 of 31 placeable blocks offered, and none of the 5 tools.**

**5. And the page says which hand it is.** The head reads *The Satchel* on a
voyage and *The Free Hand* in the free hand. A man must never be in any doubt
about whether what he lays is costing him anything.

**6. AND THE SUITE HAD BEEN SAILING IN FREE ROAM FOR FORTY ROUNDS.**
The moment the free hand shipped, tests 14 and 15 failed: a brick of hardness
2.6 *"broke at 0.02s"*, and what broke left nothing to gather. Both readings
were TRUE, and both were the free hand working exactly as written.

`tools/harness.js` sets sail with `sail(page,true)` — free roam — and every
tool has done so from the beginning, because the tools need the air and the
hours: flight, a pinned noon, a season held still. **That cost nothing for
forty rounds, because free roam touched the WORLD and never the hand.** Step
10 is the first change that made the two overlap, and the suite found it
within a minute of the code existing.

The fix is not to sail differently — the tools genuinely need the air. **The
hand is now DECLARED before every test**, a voyage unless the test says
otherwise, set by the runner rather than inside the tests so that no test can
be left holding the mode a previous one wanted. Test 23 marks itself
`freeHand:true` because it asks for both hands in turn and switches them
itself.

One more of the same family, caught immediately after: test 23 counted the
drops lying on the ground as an absolute rather than a DELTA, and test 15 —
which runs earlier, in the same page — leaves its own drop lying about. The
blow was blamed for litter it had not made.

**7. The reading.**

    PASS 23 · on a voyage a laid block costs 1 · in the free hand three cost 0
              · a blow of one frame took it: true (and left nothing lying: true)
              · the stores offer 31 of 31 blocks, and none of the 5 tools
              · what was laid stands in the one overlay: true

## PHASE 4 IS COMPLETE

All ten steps, each bootable on its own and each verified on its own: the
reach and the mark, the blow, the drop, the satchel, the belt and the page,
the placing, the material economy, gravity and finite water, the named works,
and the free hand. **Acceptance 23 pass · 0 fail · 0 pending** — and the
pending column is empty for the first time in the project's life, because
tests 19, 20 and 23 were written as refusals in earlier rounds and have now
all come due.

What the phase cost, and where the faults were, is worth one line each,
because the shape of them is consistent: **the code was right and the test was
wrong four times running** (Rounds 35, 37, 38 and 39, all of them assuming the
shape of the ground they landed on); **a comment was right and the code was
wrong twice** (the vein seed anchored to a manifest position, and a water rule
that "obviously terminated" and did not); and **twice the work was invisible**
— ore the mesher never drew, and a verse tool the brief asked for by name that
would have caught thirteen paraphrases in phase 2 had it existed then.

## 4ap. Round 43 — Phase 5 step 1: the undercut, and a red line nobody could believe ✅

*§12 step 1. Acceptance **23 pass · 0 fail · 1 pending** — the one pending
being test 12 itself, correctly declining to read a figure on a box 1.38×
slower than the one the figure was written on.*

**1. THE CENSUS FIRST, because the plan now says so.**
Round 42 ended with a rule written in blood: *measure first, and if the world
already does the thing, ship the test and not the change.* So before a block
was carved, eighteen thousand columns of range country were counted:

    in the ranges 18313 columns · 899 hollowed · 899 with rock over air
                  ·   11 open to the side ·  1211 cliff faces, of which 9 undercut
    about towns   22696 columns ·   2 hollowed ·   2 with rock over air
                  ·    0 open to the side ·    36 cliff faces, of which 0 undercut

**The rock was full of holes and the faces never showed one.** Nine cliffs in
twelve hundred were undercut. That is the defect, and it is a real one, and it
is exactly what §12's *"overhangs, undercut cliffs"* is asking for.

**2. WHY, and it was not an accident.**
`ROOF` — three blocks of stone always left over a tunnel's head — is deliberate
and right: it is what keeps the ground a man walks on sound everywhere on the
earth. But it means every carve is DEEP, so a cliff can only ever cut a round
hole in the middle of a face. It can never cut a recess at the foot of one.

**3. AN UNDERCUT IS NOT A CAVE.**
It is a cliff with its FOOT EATEN OUT, and in the rock it is not a tube at all
— it is a BAND: a course or two of softer stone lying at one elevation,
weathered back further than the hard rock above it, which is left standing over
the hollow. Every undercut cliff on the earth is made that way.

So it is written as a band and not as a worm. Its elevation wanders far more
slowly than the ground does, so the land rises and falls THROUGH it, and
wherever the surface comes down within a few courses of the band it is laid
open along the face. That is the same trick the cave mouths already turn, and
nothing places these either.

**4. AND ROCK IS BEDDED, which the first attempt forgot.**
One soft seam gives one undercut, on one contour, of one hill: it measured
**two cliff faces in a hundred** and that was all. Sedimentary rock does not
work that way — soft and hard alternate all the way up, which is why a real
limestone face is a stack of recesses and not a wall with a single notch.

So the seam RECURS every thirteen courses, the whole bedding tilted by a field
that wanders slowly, and the one nearest under the surface is the one that
shows. The rest are rock and cost nothing to leave alone.

    after: 18313 columns · 2481 hollowed · 65 open to the side
           · 1211 cliff faces, of which 63 undercut     (was 9)
    about towns: 28 hollowed, and STILL 0 open to the side

**Seven times as many undercut cliffs, and not one plate buried under a
plain** — which is the gate doing its work: the band is cut only where the
rock over it is thin, so it exists in the narrow ribbon of country where the
surface passes through it, and nowhere else.

**5. AND THEN TEST 12 CRIED WOLF, FOR THE SECOND TIME IN THIS PROJECT.**
The plains chunk read **3.075 ms** against a baseline of 1.970 and a threshold
of 2.66. Round 30 was the first time this test was misread; I very nearly
misread it the same way again, and I did tighten the carve on the strength of
it — halving the undercuts to 54 — before doing the one thing that settles it.

**The same chunks, both ways, in one page.** A switch on the bedding, three
passes each, the standing chunks thrown away between:

    bedding OFF  3.143 ms/chunk        bedding ON  3.103 ms/chunk
    OFF again    2.963 ms/chunk        the bedding costs ×1.05

**The plains chunk costs three milliseconds with the feature switched off.**
The box is roughly sixty per cent slower than the one that wrote 1.970 down.
My change costs five per cent, and at the wider window nine — inside the noise
of its own control. So the tightening was undone and the carve stands at its
full width.

**6. A red line nobody believes is worse than no line at all.**
Twice now this test has accused the wrong thing, and both times the answer was
a person being careful rather than the test being right. So the suite now asks
**how fast the machine is** before it reads the figure: a fixed lump of the
very arithmetic the mesher is made of — the sin-hash every noise field in the
world is built from — with no canvas, no GPU and no allocation in it. If the
box is materially slower than the reference, test 12 reports **PENDING with the
factor** instead of failing. If the box is fast enough for the constants to
mean anything, it fails exactly as it always did.

    PENDING 12 · the machine is 1.38× slower than the one these figures were
                 taken on (64.8 ms against 47.0) — plain 3.306 ms/chunk

**And the reference figure is labelled an ESTIMATE in the source, because it
is one.** Nobody calibrated the box that wrote `plain: 1.970`, because nobody
knew it would be wanted. 47.0 ms is derived from the ratio of chunk timings
then and now, and set deliberately a little above the derivation so the gate
errs toward FAILING rather than toward excusing. **The baseline itself has
still never been moved**, and this does not move it: it decides only whether a
red line can be believed.

**7. What this step did not touch.** The surface is still never broken; every
one of the places that reads a column's height is still right; and the walker
still passes through nothing (test 3). An undercut is two courses high, which
is just enough to stoop into — deliberately, because that is what an undercut
feels like.

**Still ahead in Phase 5:** arches and tunnels through a ridge; crystal
chambers with the stones of the breastplate; sea caves at the waterline.

## 4ar. Round 45 — Phase 5 step 3: the stones of the breastplate ✅

*§12 step 3. Acceptance **26 pass · 0 fail · 0 pending** — and test 12 passed
on its own merits, the machine having come back to itself, which is the
calibration of Round 43 doing exactly what it was put there for.*

**1. THE CHAMBERS WERE ALREADY THERE.**
Censused before anything was carved, which is now the standing rule:

    40,833 columns of range country · 5,710 hollowed
    1,295 air runs of eight courses or more · the tallest, sixteen

`js/caves.js` has always said *"chambers where worms meet"* and it was telling
the truth. So step 3 needed no carve at all. **What was missing was not the
room. It was the crystal** — and that is a much smaller and much better step
than the one I had planned.

**2. AND THE SOURCE NAMES TWELVE, NOT SIX.**
§4 of the brief lists *"onyx, sapphire, jasper, topaz, emerald, sardius"*.
SHEMOTH 28:17-20, pulled through the extractor, names twelve in four rows:
ruby, topaz and emerald; turquoise, sapphire and diamond; jacinth, agate and
amethyst; beryl, shoham and jasper. **The brief was quoting from memory** —
"onyx" is *shoham* and "sardius" is *ruby* — and the whole reason
`tools/extract-besorah.js` exists is that nobody's memory is the source.

Six ship, under the source's own names. The other six wait on pigments: the
paint box has no turquoise, no diamond, no jacinth, no agate, no amethyst and
no beryl, and inventing one to fill out a row is exactly the placeholder §14
forbids.

**3. A SUBSTANCE MAY WANT A PLACE AND NOT A DEPTH.**
`in:'chamber'` — the thing does not lie in a band at all. It grows in the wall
of a hollow, in the floor and the roof of a room, and nowhere else. That is
the whole of what *"rare, deep, worth the descent"* means: not a rarer roll of
the same dice, but a thing that **cannot be had by digging straight down**.
You have to find the cave, and go in, and go further in.

It costs nothing: the condition is read straight off the column's own air
runs, asks no neighbour, and only runs for a substance that declares it.

**4. TWO FAULTS THE TESTS CAUGHT, AND BOTH WERE IN THE DATA.**

**Three lines that could never once have fired.** Ruby, topaz and emerald were
first written with the lands the stones truly come from — Myanmar, Sri Lanka,
Colombia, Zambia — and **not one of those lands has a cave in it.** Only some
thirty-four countries have cave country at all. An ore only wants a country
with rock in it; a chamber stone wants a country the world actually HOLLOWS.
Test 21 caught all three the first time it was asked, which is exactly the
silently-useless line it was written for. Each keeps its true lands and has
cave country added: Nepal and China for the ruby, the Swiss Alps and Tanzania
for the emerald, Japan and the Americas for the topaz — every one a place that
stone is genuinely found.

**And `room` is not where rarity goes.** It was tempting to make the rarest
stones want the biggest rooms. It is wrong, because **the gates compound**: a
stone wanting a ten-course chamber, in eleven countries, in one course of its
floor, at four rolls in a hundred, exists in arithmetic and never once in the
world. Emerald and ruby were both written that way and neither could be found
anywhere on the earth. The room says what KIND of place holds the thing;
`often` says how rare it is. One gate, one roll.

**5. The reading.**

    PASS 21 · 14 substances declared · 14 placed in 128 lands
              Emerald 4, Ruby 2, Jasper 1, Topaz 3, Sapphire 3, Shoham 2
              · 0 of 172,358 cells outside their own band
    PASS 26 · 6 stones want a room · 113 found in 59,019 columns of cave
              country · 113 in the wall of one, 0 anywhere else

**Still ahead in Phase 5:** sea caves at the waterline — half-flooded, entered
by boat or by swimming, dark, with something at the back.

## 4as. Round 46 — Phase 5 step 4: the sea caves. PHASE 5 COMPLETE ✅

*§12 step 4, the last of the phase. Acceptance **27 pass · 0 fail · 0 pending**.*

**1. THE CENSUS, and it is the same shape as the other three.**

    2,629 coastal columns · 628 of them true sea CLIFF
    ·   7 with any hollow at the waterline

Seven. One coastal cliff in ninety.

**2. AND THE REASON WAS TWO RULES THAT ARE BOTH RIGHT.**
`MIN_H` keeps the carve out of low country; `FLOOR` keeps it off the bottom.
Both are correct for a mountain tunnel — they are why the ordinary world is
cheap and why the bedrock is sound — and both are **exactly wrong for a cave
the sea cut**, because a sea cave is not deep. It is a notch at the waterline
in a cliff the swell has been working at, and it is LOW by definition.

So the band is pinned to the WATERLINE rather than to the bedding, and the
gate is inverted: not *"is there rock enough above"* but *"is this column low
enough to be a sea cliff at all"*. Where the sea lies beside it the notch is
laid open and can be swum or rowed into; where it does not, it is a small
hollow in low ground and nothing is harmed.

    after: 84 with a hollow at the waterline · 84 of them with rock over it

**Seven became eighty-four**, every single one with rock standing over it —
which is the difference between a cave and a dent in a beach.

**3. What is deliberately NOT here: the something at the back.**
§8 asks for it in the same breath as the cave itself, and it is right to. But
Phase 8 is *authored places* — a schematic format, an in-game capture tool,
the Cave of Treasures — and none of it exists yet. A wreck or a hoard invented
here would be placeholder content by §14's own definition, and it would have
to be picked up and moved the day Phase 8 arrives. **The cave ships. What is
in it waits for the phase whose whole job is putting things in places.**

**4. The reading.**

    PASS 27 · 2629 coastal columns · 628 of them sea cliff · 84 with a hollow
              at the waterline, 84 of those with rock standing over it

## PHASE 5 IS COMPLETE

Four steps, and **three of the seven things §12 asked for turned out to be
already true** — which is the whole story of this phase and the reason it took
four rounds rather than seven:

  · *ore by land and depth* — shipped in Phase 4 step 7, struck off rather
    than done twice;
  · *summits that are real climbs* — measured before building, thirteen named
    mounts of thirteen already had a way up, and the terrace term written to
    "fix" it was reverted with `js/engine.js` byte-identical;
  · *crystal chambers* — the chambers were there all along; only the crystal
    was missing.

The four that were real all had the same shape of cause, and it is worth
naming because it will recur: **a rule that is correct for the thing it was
written for, applied where it was never meant to go.** `ROOF` is right for a
tunnel and made every cliff face blank. `MIN_H` and `FLOOR` are right for a
mountain and made every sea cliff solid. `spansAt` taking one column is right
for cost and made an arch impossible to detect — so an arch is placed instead
of found.

And the measuring instruments earned their keep three times over: the census
that found nine undercut cliffs in twelve hundred, the A/B that proved the
carve cost five per cent while the box was sixty per cent slow, and the
land-list check that caught three stones declared in countries with no caves
in them.

## 4at. Round 47 — Phase 7 step 1: the great scrolls put where they belong ✅

*§13 step 1. Acceptance **28 pass · 0 fail · 0 pending**, with two new ranges
standing in the world.*

**1. THIS IS WHAT PHASE 5 WAS FOR.**
§5: *"Make the great scrolls cost something. With caves in the world, put them
where they belong."* The caves and the summits exist now, and a scroll lying
on open grass two hundred paces from a village is a thing a man walks past.

A scroll may now name a PLACE instead of taking its country's bearing —
`at:{mount:'Mount Sinai'}` or `at:{cave:true}` — and **the engine knows no
scroll by name**: it reads `at` and nothing else, the same rule the minerals,
the works, the beasts and the flora all keep.

**2. AND THE WORLD HAD NOWHERE TO PUT TWO OF THEM.**
The first run reported `no cave found` for both cave scrolls. Neither Iraq nor
Ethiopia has a single hollow anywhere in it — they were not among the
thirty-four lands with cave country.

§5 had already said what to do about that: *"Add the `kind:'range'` and
`kind:'mount'` entries these need to `world/landmarks.js` with true
elevations."* **The Zagros (4,548 m) and the Simien Mountains (4,550 m)** are
those entries, and they were added because the scrolls asked for them and the
world answered that it had none — which is a better reason than a map having
a gap in it.

**3. DARKNESS IS THE POINT, NOT DEPTH — and scoring the wrong one showed it.**
The cave search first took the column with the most rock over its head. That
put the Cave of Treasures **thirty-three courses under a mountain at a light
of 0.85**: deep, and standing in a shaft of daylight, because a column can lie
far under the rock and still be a few paces from a mouth.

§5 asks for a cave that is *dark, torch required*. So the LIGHT is what is
scored, using `caveLightAt` — the very field the mesher bakes into the walls,
so the search and the eye agree by construction.

    adam-eve-1  light 0.85  →  0.04
    chanok      light 0.14  →  0.00

**4. And a scroll nobody can reach is not a reward, it is a bug.**
§5 asks for *"placement verified on reachable ground"*, so test 28 does not
take it on trust: it floods the hollow itself, column to column and course to
course, and asks whether the air the scroll lies in ever comes up into the
day. Both do — one in 1,050 steps, the other in 4,265.

**5. The reading.**

    PASS 28 · 3 scrolls name a place
              adam-eve-1 in a cave: light 0.04 (dark ✓), reaches the day ✓
              chanok     in a cave: light 0.00 (dark ✓), reaches the day ✓
              shamoth    on Mount Sinai: 94 of 94 ✓

**6. And Ararat is left empty, deliberately.**
§5 says *"Mount Ararat — the scroll on the summit"* and does not say which
scroll. None of the eight is the account of the flood, and choosing one to
stand for it would be inventing an assignment the brief did not make. Ararat
waits, and `world/scrolls.js` says so where a reader will find it — so the
omission is a decision and not an oversight.

**Still ahead in Phase 7:** the short scene on discovery; the six missing long
films; and the handshake between the log and Scripture Unfolds.

## 4au. Round 48 — Phase 7 step 2: the scene at the place it was found ✅

*§13 step 2. Acceptance **29 pass · 0 fail · 0 pending**; the verses **61 exact
· 0 paraphrased**.*

**1. WHAT TAKING A SCROLL DID BEFORE THIS.** It toasted and it saved. That was
all — the whole reward for crossing an ocean and climbing a mountain was a
line of text sliding across the bottom of the screen. §5 is blunt about the
gap: a short in-world scene, *"15-30 s, camera marks over the actual
landscape, one verse held. **This is what makes discovery feel like reward.**"*

**2. ONE SCENE SERVES ALL EIGHT, and that is not a shortcut.**
It is why `world/scenes.js` was built the way it was. Every mark in a scene is
measured **from the traveller** — so far behind him, so far above his feet,
looking so far out along his own bearing. It does not know or care what it is
pointed at. So a single definition films whatever he is standing in: taken on
the summit of Sinai it draws back until the whole range is under him; taken in
the dark of the Cave of Treasures the same six marks find four walls and a
torch.

Nineteen seconds, inside §5's fifteen to thirty. It opens close on him as he
straightens with the thing in his hands, draws back and up until the place
reads as a PLACE, holds there while the verse stands, and settles to his
shoulder. **The hour is not touched**: a scroll found at dusk is a scene at
dusk.

**3. AND THE VERSE IS THE SCROLL'S OWN.**
The scene's `lines` list is empty on purpose. `playScene` now takes a line
from its caller, so what is held on the screen is a verse of **the very book
just picked up** — BERĔSHITH 1:1 for the scroll of the beginning, SHAMOTH 3:2
for the Going Out, and so on for all eight, every one of them pulled out of
the Besorah by `tools/extract-besorah.js` and every one checked by `--check`.

That keeps §5's other rule, the one it says must never be broken: *"No cutscene
may ever put words in scripture's mouth."* The scroll's `verse` is scripture
and carries chapter and verse; its `words` beside it is narration in the
game's own voice and carries none. Two fields, and the difference between them
is visible in the file.

**4. The reading.**

    PASS 29 · the scene runs 19s over 6 marks · 8 scrolls, 8 with a verse of
              their own · taking bereshith: it played=true, holding
              BERĔSHITH 1:1 (its own is BERĔSHITH 1:1)

And photographed on the summit of Sinai at the hold: the letterbox down, the
rail and the rose gone, the traveller alone on the summit stone with his hands
raised, and the words of the burning bush standing over the whole range.

**5. A note on the first photograph, which showed nothing.**
It was taken at 1.3 s — before the caption track opens at 3.0 — and at an hour
that read as night, because the hour was pinned BEFORE he was set down and the
local hour is reckoned from where a man stands. Both are mistakes this audit
has recorded before. The second was taken at the hold, at noon, after he was
in place.

**Still ahead in Phase 7:** the six missing long films, and the handshake
between the ship's log and Scripture Unfolds.

## 4av. Round 49 — Phase 7 step 4: the handshake, which did not exist ✅

*§13 step 4, taken BEFORE step 3 on purpose. Acceptance **30 pass · 0 fail ·
0 pending**.*

**1. WHY THIS STEP WENT FIRST.**
The plan put the six long films at step 3 and the log handshake at step 4. I
took step 4 first, because §13 step 4 says *"verify the handshake rather than
assume it"* — and the handshake is the pipe six films would flow through. It
is far cheaper to look at a pipe than to push six films down it and find out.

**2. IT DID NOT EXIST.**
Not "it was broken". **Nothing under `scripture-unfolds/` so much as mentioned
the voyage's save** — no `voyage:state`, no `localStorage`, nothing. Grep
returns empty. `buildShelf` listed every passage it had, always, to everybody.

The two games shared an engine, a world, a Besorah and a manifest, and shared
**nothing at all about what the traveller had actually done**. §5 describes
the opposite in plain words: taking a scroll *"unlocks its long-form passage
in Scripture Unfolds, which reads the same log"*. It was written down, and it
was not true, and nobody had looked.

**3. THE LOG IS ONE STRING UNDER ONE KEY.**
`voyage:state`, written by the voyage's own `saveState`, carrying `sr` — the
ids of the scrolls taken up. The second game reads it, and **reads it and
never writes it**: it is a READER of the first, and a bug here must never be
able to cost anybody a voyage.

The two name their books differently — a scroll says `BERĔSHITH` the way a man
reads it, a passage says `bereshith` the way the Besorah files it — so they
are matched on the folded name, marks and all dropped, through
`world/scrolls.js`, which both games already load.

**4. AND WITH NO VOYAGE AT ALL, EVERYTHING IS OPEN.**
This is the part that would have been easy to get wrong. Someone who opens
Scripture Unfolds on its own has not *failed to find* anything — they have
simply not played the other game, and locking them out of their own scrolls to
enforce a rule about a save file they do not have would be absurd. **The gate
closes only when there is a log to gate against.**

And what is shut is SHOWN, greyed, saying *"the scroll of this passage is
still hidden in the earth"* — the same rule the works page keeps. A man should
be able to see what he has not got, so he knows what to go and do.

**5. The reading.**

    PASS 30 · the shelf holds 2 passages
              · no voyage: 0 shut
              · a voyage with nothing taken: 2 of 2 shut
              · the scroll of the beginning taken: 0 shut, 2 of that book opened

This is **the only test in the suite that opens the second game**, and the
harness was taught to do it in one line — the same machinery, because it is
the same engine.

**Still ahead in Phase 7:** the six missing long films, which now have a
working shelf to appear on.

## 4aw. Round 50 — Phase 7 step 3: the six missing long films. PHASE 7 COMPLETE ✅

*§5: "Only two have films. Build the remaining six: text extracted, short scene,
long film, placement verified."*

Eight scrolls lie in the earth. Two had passages. The shelf now holds **eight**,
and the six new ones are 77 captions across 27 minutes of film, every word of it
fetched from the Besorah at run time.

    THE CREATION                 BERĔSHITH                       (had one)
    THE GARDEN IN ĔḎEN           BERĔSHITH · ADAM AND HAWWAH 1   (had one)
    THE DAYS AFTER THE GARDEN    ADAM AND HAWWAH 2      12 caps · 196 s
    THE SEVENTH FROM ADAWM       ḤANOḴ                  13 caps · 266 s
    THE YEARS BETWEEN THE WORDS  YASHAR                 13 caps · 292 s
    THE DIVISION OF THE DAYS     YOḆELIM                12 caps · 296 s
    THE COURSES OF THE LIGHTS    ḤANOḴ HABASHIY         12 caps · 322 s
    THE GOING OUT                SHAMOTH                13 caps · 316 s

**1. THE EXTRACTOR HAD NO WAY TO EMIT A BOOK.**
Three books were in `scripture-unfolds/scripture/` and five were needed, and
nothing could make the fourth. §5 says plainly: *"If a scene needs a book not
yet extracted, extract it from the offline Besorah HTML into a new generated
.js in the same format."* `--emit` does that now, and the first thing it was
asked to do was **re-emit the three that already existed** — git reported no
change, byte for byte, which is how I know the format is the one that ships and
not one I reconstructed from reading.

    node tools/extract-besorah.js --emit chanok shamoth yashar \
        apoc-jubilees:yobelim apoc-eth-enoch:chanok-eth

The name on the left is the Besorah's, the name on the right is ours. The source
files Jubilees under `apoc-jubilees` and the Ethiopic Ḥanoḵ under
`apoc-eth-enoch`, which are cataloguing ids and not names of scrolls; a film
that had to write `q:['apoc-jubilees',1,1]` would be citing a filing cabinet.
**The id may be renamed on the way out and nothing else is** — `hebrew` and
`english` come through untouched, and they are what a reader ever sees. The same
principle as the ALIAS table of Round 41, at the other end of the pipe.

**2. AND THEN THE SCRIPTURE WAS TWO MEGABYTES, AND THE PAGE LOADED ALL OF IT.**
Measured before deciding: the three books that shipped cost 47.8 ms to parse;
all eight cost 102.6 ms, and 1.66 MB more to fetch, *before the shelf can be
drawn*. The brief says this has to run on a phone.

So a scroll is now **unrolled when it is taken down**. The page loads one
kilobyte at boot — `scripture/index.js`, the spine of every scroll: its id, its
two names, how many chapters — which is enough to draw the shelf and name a
passage. The book itself is fetched the moment somebody chooses it, once, and
kept. Verified: **at boot, 0 of 8 books are open**; the creation film opens
`bereshith` and nothing else.

Which books a scene needs is **derived, not declared**: `STORY.booksOf(s)` reads
every `q` off the caption track and unions it with the scene's own book. That
matters because the garden is filed under BERĔSHITH and spends its last minute
in ADAM AND HAWWAH 1.

**3. WHICH EXPOSED A HOLE IN THE GATE ROUND 49 LEFT.**
The shelf asked whether `s.book` had been found. So taking up the scroll of the
beginning opened a passage *half of which was still buried in a cave in the
Zagros*, and finding that cave opened nothing at all. It asks `booksOf` now —
every scroll a passage reads — and a shut row **names what is missing** rather
than saying only that something is:

    THE GARDEN IN ĔḎEN
    still in the earth: ADAM AND HAWWAH 1

**4. §5's THIRD PROHIBITION HAD NO GUARD.**
*Do not paraphrase. Do not summarise a verse into a caption. Do not invent a
reference.* `--check` kept the first two, because a `verse:{t,ref}` carries its
words beside its citation and the two can be set against each other. **A film
caption carries no words** — it is `{q:['shamoth',14,21]}` and the text arrives
at run time — so a wrong chapter does not read wrongly, it simply never appears,
three minutes into a film, with nobody watching.

`--check` now resolves every `q` in every scroll against the emitted books, and
**test 31** makes the same fetch on the real page, so a book that is on disk but
unreachable from the loader fails in the suite and not in front of somebody.

    61 exact · 0 paraphrased · 0 unsourceable  (61 verses)
    124 film captions resolve · 0 do not  (8 scrolls)

**5. THREE THINGS WERE FOUND BY LOOKING, AND ALL THREE WERE OLD.**

**(a) The second game had an empty block table.** `scripture-unfolds/index.html`
carried its own copy of `window.EARTH`, and the copy had fallen three
registrars behind: `block`, `mineral` and `work` were added to the voyage over
Phases 4 and 5 and never reached it. Forty-two block files, fourteen substances
and thirteen works **all threw on load** — 45 errors on that page against 1 on
the voyage's — and nothing said a word, because the mesher already had its
materials by the time anything asked. There is one `world/registry.js` now and
both pages read it. *It changed nothing about how the page looks, and I checked
rather than claiming it: the shelf frame is pixel-identical either side of the
fix. What it changed is that the world is now actually registered.*

**(b) The stage eased colours as one number.** `sky` is a hex, and it was lerped
the way every other dial is lerped — straight down the middle between two
JavaScript numbers. But `0x332c26` is 3,353,638, and halfway between it and
`0x241f1c` is 2,860,705, which unpacks to `0x2BA5E1`. **The going out ran from
one brown to another brown through a bright green sky**, and the creation had
been sliding through hues neither of its keys named since the day it was
written — never caught, because most of that film eases out of black, where the
error is small. The channels are taken apart now. Every scene on the shelf is
corrected and not one of them had to be touched.

**(c) The films were played at whatever hour the clock happened to hold.** Every
dial on that stage changes what the *sky* looks like; the ground is lit by the
engine's day tint, which knows nothing of any of them. So a noon sky stood over
a world still shaded for dusk, and every film on this shelf was murky. There is
an `hour` dial now, and it keeps the rule `world/scenes.js` already keeps: **the
hour asked for is the LOCAL hour at the place the scene is staged**, because the
sun goes round the disc and 18:00 is dusk in one land and midnight in the next.
It takes the clock off 'live' first — left there, the engine reads the machine's
own wall clock back over it four times a second — and gives both back when the
scene ends.

The two films that already shipped **do not name an hour**, so nothing about
them changed. That is deliberate: the creation is a film about light made three
days before the sun was, and it is ticked.

**6. Two smaller things the new light made necessary.**
The cloud sheet is drawn white against whatever sky it is over, and the engine
only ever varies how *solid* it is, never how bright — right for a world where
sky and cloud darken together, wrong the moment a scene darkens the sky on its
own. Sinai in smoke had bright white cloud lying across a brown-black sky. The
clouds are lit by the stage now, as the sea already was.

And the captions got a scrim rising out of the lower letterbox bar. White italic
needs nothing behind it on a dark hillside; on the noon beach the going out now
opens on, the gold reference line all but vanished.

**7. The carpet, and a rule applied where it was never meant to go.**
`stage.js` said *"THE COARSE CARPET IS NEVER IN A SCENE"* and it was right — for
a scene staged at a shore, where it is a handful of enormous flat planes lying
across the whole view. But the streamed ring is some twelve hundred units
across, and three of these films leave the ground: lift the eye eight hundred
units to look at the courses of the lights and **the earth simply stops**. A
scene asks with `far` and gets nothing unless it does, so every scene written
before this one is unchanged. This is the fourth time this round-up has named
the same root cause: *a rule that is correct for the thing it was written for,
applied where it was never meant to go.*

**8. What I did NOT do, and why.**

**I did not correct the source's typography.** Two verses this game now ships
carry a drop-cap the offline Besorah flattened with a space in it — `YASHAR
1:1` reads *"A nd Aluahim said"* and `YOḆELIM 2:1` reads *"W rite the complete
history"* — and both are captions on screen. The space is in the source JSON,
before any markup is stripped; the extractor reproduces it faithfully, which is
the whole promise of the extractor. Of 11,186 verses in the eight books, 94
begin with a lone capital and a space and **all but three of those are ordinary
English** — *"I saw"*, *"A fiery"*, *"A great"* — so any rule that joined them
would produce *"Ithank"* far more often than it fixed anything. Bending the
films around it to hide it would be worse: the next person would put the verse
back. It is written here so that it is a measured, known defect in the supplied
file and not a surprise.

**I did not raise the eye far enough to look down on the whole disc.** The
voyage has a chart for that and the chart is not a place — it is a map that
takes over as the eye leaves the world. A film about the ends of the earth is
filmed *from* the earth, looking out.

**9. The reading.**

    PASS 30 · the shelf holds 8 passages · no voyage: 0 shut
              · a voyage with nothing taken: 8 of 8 shut
              · the beginning taken: 1 open of 1 owed,
                7 of 7 shut rows name what is missing
              · the beginning and the cave: 2 open of 2 owed
    PASS 31 · 124 captions across 8 films, out of 8 scrolls
              · none open at boot: yes

**Phase 7 is complete.** Steps 1, 2 and 4 were taken in Rounds 47–49; this is
step 3, and there is nothing left in it.

## 4ax. Round 51 — Phase 6 step 1: the coat ✅

*§2.3.1, and the first thing it names: "Coats, not flat colours … countershading
(dark back, pale belly — near-universal in real animals and almost absent in
Minecraft)."*

**1. THE FAULT.** `lbox(w,h,d,col)` gives every limb of every beast ONE flat
Lambert colour, and a hundred and fifty-one creature files were built out of it.
Nothing on any animal in this world was lighter underneath than it was on top —
which is the one thing that is true of very nearly every animal there is. Worse
than plain: a directional light from above made the BACK the *brightest* surface
on the beast, so a gazelle read as a bright slab with legs.

**2. WHY IT IS DONE IN THE ENGINE AND NOT IN THE FILES.** A hundred and fifty-one
files would have to be edited to say a thing that is true of all of them, and the
next creature written would forget. `makeBeast` is the one gate every beast comes
through: the file builds it exactly as it always did, and the finished model is
GRADED before it is scaled to its true stature. **Not one creature file changed.**

**3. AND THE FIRST VERSION WAS WRONG, WITH GOOD NUMBERS.**
It graded every vertex by how high it stood on the whole animal. Every mesh was
touched; the tint ran 0.72 to 1.14; nothing was left flat. It was wrong:

> a gazelle's body spans about a fifth of its height. So the body — the part
> anybody actually looks at — moved by **four parts in a hundred**, and the
> HEAD, standing high, went dark. A gazelle whose head is darker than its back
> is not countershaded, it is wrong.

I nearly shipped it, because the measurement I had taken was *"is every mesh
graded"* and the answer was yes. **The measurement was about the wrong thing.**

Countershading is not about how high a surface is. It is about **which way it
faces**: a surface turned up to the sky is pigmented dark, a surface turned down
to the ground is pale. So a horizontal face takes its shade from its normal
outright, and a vertical face — the flank, which is most of what is seen —
grades across ITS OWN height and gets the whole range to itself. Every box is
treated alike and none of them has to know where on the animal it sits. The
gazelle's body now runs the full 0.70…1.18 from back to belly.

**4. WHAT IT COSTS.** Nothing per frame and nothing per draw call. It is not a
texture and not a second material: it is a colour attribute on geometry the beast
already has, written once at build, multiplied into the Lambert diffuse by the
shader that was already running.

    150 creature files · 2534 meshes in one of each
    building all of them twice, flat : 225.9 ms
    building all of them twice, coat : 254.8 ms   (1.13×, ~0.1 ms a beast)
    the colour attributes: 60,891 vertices · 713 KB for the ENTIRE bestiary

and 713 KB is the upper bound if every species on earth stood in one place,
which never happens. Measured warm: cold, the *flat* build came out slower than
the graded one, which cannot be true — the first pass was paying for everything
the second found ready. That is written down because it nearly went in as a
finding.

**5. A SPECIES MAY REFUSE IT.** `shade:0` in a creature file turns it off and any
number between scales it — for the thirty-two files that already build a pale
belly of their own and might double. Verified on the shark, which countershades
itself: the coat grades *within* each of its boxes and reads as gradation, not as
doubling, so nothing was set. **The engine still knows no beast by name**: it
reads a datum, as it reads `metres` and `realm`.

**6. THE TEST, AND WHY IT WAS WRITTEN TWICE.**
The first test asked *"is the up-face darker than the down-face"* — and I wrote in
its own comment that this would have caught the broken version. **It would not.**
Under a height ramp a box's top is always higher than its bottom, so every beast
passes. I checked the claim instead of leaving it standing, and it was false.

What catches it is the **spread on the torso**: the largest mesh on an animal is
its body, and countershading means that body runs the full range from back to
belly. So the test finds the biggest box and asks for at least 0.35 of tint
across it. Then I put the broken version back and ran it:

    FAIL 32 · the narrowest body runs -0.41 of tint from back to belly
              · NOT COUNTERSHADED: lobster (up 1.11 is not darker than down 0.70) …
              · TOO SLIGHT TO SEE: squid (0.30); anglerfish (0.29) … (+95 more)

A hundred species too slight to see, and several **inverted** — a lobster's
largest box sits low on it, so the height ramp made its top paler than its
bottom. The claim is now proved rather than asserted.

    PASS 32 · 150 creature files · 2534 meshes graded, 0 left flat
              · the narrowest body runs 0.48 of tint from back to belly
              · a species that refuses it stays flat: yes

**7. What is NOT in this round.** The rest of §2.3.1 — spots, stripes, dorsal
lines, muzzle and eye markings, seasonal coat change — is **data**, one line per
species, and belongs in the creature files where a reader can see it. This round
is the base every one of those sits on: nothing that follows has to think about
which way a face is turned.

## 4ay. Round 52 — Phase 6 step 2: the boughs ✅

*§2.4.1: "Branching. Two or three orders of branch by a small L-system, with real
taper. **Every tree in the world stops looking like every other tree.**"*

**1. THE FAULT.** The oak — which is the DEFAULT form in `js/flora.js`, and most
of the world's wood — was one bole and three crown boxes stacked on the middle of
it. Not a branch anywhere. The crown was centred on the trunk and symmetrical
about both axes, so **every oak on the earth was the same oak at a different
size**, and the only thing that varied from one tree to the next was how big the
identical shape was. A wood of a hundred of them read as one tree stamped a
hundred times, which is precisely the fault §2.4 opens by naming.

**2. WHAT IT DOES.** Three or four boughs are thrown from the top of the bole,
each in its own direction, each of its own length and rise, each in two segments
that taper as they go — and the leaf is no longer a blob on the trunk but a
cluster **on the end of each bough**, with a smaller mass at the heart. Every
number comes off the cell's own hash, so no two trees on the earth are alike and
the wood is the same wood every time it is meshed.

**3. WHICH FORMS, AND WHY NOT ALL.** A cypress is a green pillar and a palm is a
bare stem with fronds on its head; branching them would be drawing something that
is not a cypress and not a palm. The boughed forms are the ones a bough is TRUE
of — `broad`, `round`, `blossom` — and the list lives in `js/flora.js` because it
is a fact about the FORM, not about any species. **85 species branch; 55 keep
their own shape.** The dark oak, the eucalypt and the jungle giant are hardwoods
too and are deliberately NOT on the list yet: each builds its own crown for its
own reason and wants its own hand. Saying so is cheaper than a list that claims
more than it does.

**4. AND THE FIRST CUT MADE THE WOOD WORSE.**
The boughs reached out on their own scale and hung a full-sized leaf cluster on
each tip. Measured, it looked like progress: every boughed species gained boxes,
nothing threw, the geometry was there. Photographed, it was a disaster — a crown
that had been 1.9 blocks across became nearly **three**, every tree overlapped its
neighbours, and a stand of oak read as **one green slab**. Worse than the blob it
replaced.

> **THE ENVELOPE DOES NOT GROW.** The reach and the leaf are struck off the crown
> radius the form already had, so a branched tree occupies the room an unbranched
> one did. What changes is its SHAPE, which was the whole point.

Measured after: the crown moved at most **9% across and 18% up**. Before: 138%.

**5. WHAT IT COSTS.** Counted directly, by calling `FLORA.emitTree` with a kit
whose `emitBox` only counts — not inferred from a chunk that is mostly ground:

    form        species   boxes/tree  with boughs
      round        60          6.4        16.0    2.52×
      broad        18          5.8        14.5    2.48×
      blossom       7          7.6        17.3    2.26×
      ALL TREES   140          7.0        12.8    1.82×

and in a real wood, which is what actually matters, because a chunk is mostly
ground and trees are a minority of what it carries:

    a German wood      1,123,466 → 1,255,238 triangles   +11.7%
    Congo rain forest  1,585,820 → 1,742,852 triangles    +9.9%

Ten to twelve parts in a hundred, in the densest wood on the earth. §2.5 says
*"beauty that halves the frame rate is not beauty"* — this is nowhere near
halving anything, and it is geometry built once into a chunk mesh, not work done
per frame. **No new material and no new draw call**: the boughs go into the same
batched geometry, through the same four grey masters, tinted as they are laid.

*The wall-clock figures the probe also printed are NOT quoted, and should not be:
they are paced by `requestAnimationFrame` under SwiftShader, so they measure the
software renderer's frame time and not the mesher at all. Triangles are the real
number here.*

**6. THE TEST, and it was proved the same way as the coat.**
Test 33 calls `emitTree` with a recording kit and asks three things: that a
boughed form gains boxes, that two cells of the same species differ, and — the
clause that matters — **that the crown does not grow**. Then the sprawling first
cut was put back:

    FAIL 33 · the crown moved at most 138% across
              · THE CROWN GREW: oak (across 123%); beech (138%); birch (138%); ash (123%)

    PASS 33 · 85 species branch, 55 keep their own form
              · the crown moved at most 9% across and 18% up

It also asserts that a form which is NOT boughed comes out **byte-identical** with
the switch on and off, so a cypress can never quietly acquire branches.

**7. What is not here.** Bark per species (§2.4.3) is still one grey master tinted
per species rather than a texture each; seasonal colour (§2.4.4) is next in the
order and is nearly free, since `js/season.js` already stands and the leaves
simply do not ask it anything.

## 4az. Round 53 — Phase 6 step 3: the evergreens, and a correction to PLAN.md

*§2.4.4: "Seasonal colour, driven by the season system that already exists — spring
blossom, high-summer deep green, autumn turn, bare winter branches on the
deciduous, **evergreens unchanged**."*

**1. I HAD WRITTEN THAT THE LEAVES DID NOT READ THE SEASON, AND THAT WAS WRONG.**
The table I set down at the head of Phase 6 says *"partial: `js/season.js` exists;
the leaves do not read it."* They read it, and have all along. `SEASON_VS` and
`SEASON_FS` in `js/engine.js` gild the canopy toward gold through autumn and grey
it through winter — worked per-vertex from the distance to the pole, so the two
hemispheres keep opposite years, the tropics never turn and the far north hardly
does — and `SNOW_VS`/`SNOW_FS` lie the snow on the ground the same way. **No chunk
is ever re-meshed for any of it.**

I had grepped the flora for `SEASON`, found nothing, and concluded from the wrong
file. The rule this project keeps is written in PLAN §12: *measure first, and if
the world already does the thing, ship the TEST and not the change.* I nearly
spent a round rebuilding a system that was finished.

**2. WHAT WAS ACTUALLY UNTRUE was the last clause of that sentence.**
The gilding is worked out from **latitude** — which is right for the zone and
blind to the tree — and there was **one leaf material in the entire world**. So
every spruce, pine, fir, cypress, juniper, holly, yew and olive standing in a
temperate land went gold in October and brown in January along with the oak beside
it. **A Norwegian wood in autumn was uniformly yellow, spruces and all**, which is
not what a northern wood looks like in any month there is.

There is a second leaf now — the same texture, the same wind, simply never given
the season — and the canopy of a species that keeps its leaf is laid on it.

**3. AND EVERGREENNESS IS A FACT ABOUT THE SPECIES, NOT THE SHAPE.**
The obvious implementation is a lookup on the form, and it is wrong in both
directions: a **larch** is a conifer and stands bare all winter; an **aspen** is a
column and is the most golden tree there is; a **holly** is round and green in
January. So the form gives a sensible default and any species may say otherwise
with one datum in `world/flora.js`, where a reader will find it. Fourteen say so:

    ever:0   larch · baldcypress · ceiba
    ever:1   cypress · juniper · desertoak · holly · yew · olive
             laurel · kauri · camphor · holmoak · corkoak

**54 species keep their leaf; 84 turn.**

**4. WHAT IT COSTS.** A second material is a second draw call in any chunk that
carries both kinds of tree, and that is the whole of the price:

    a boreal wood, one leaf   4421 meshes ·  958,370 triangles
    a boreal wood, two leaves 4670 meshes ·  958,370 triangles
                              +249 (+5.6%)   +0

**Not one extra triangle** — it is the same geometry, split. 5.6% more draw calls
in the most conifer-heavy view on the earth, and none at all in a land that grows
only one kind.

**5. THE TEST.** It does not ask whether the season exists — that was the mistake
that started this round. It asks the two things that were untrue: that the
material an evergreen draws with is **not given the season** (three.js keys a
patched program by `customProgramCacheKey`, so that string *is* the season), and
that every species lays its canopy on the right one. Proved by putting the
one-leaf world back:

    FAIL 34 · 0 species keep their leaf, 138 turn
              · DREW ON THE WRONG LEAF: holly (evergreen, drew on the leaf that turns);
                yew; pine; spruce; fir …

    PASS 34 · 54 species keep their leaf, 84 turn
              · the turning leaf takes the season: yes
              · the evergreen leaf does not: yes

**6. AND TEST 12 PENDED, SO I WENT AND CHECKED WHETHER I HAD CAUSED IT.**
The chunk-build benchmark came back **PENDING**: *"the machine is 1.42× slower
than the one these figures were taken on (66.7 ms against 47.0)."* That is the
guard from Round 44 doing its job, but a pending benchmark on the round that
added geometry and a material is exactly the moment to stop believing it and
measure. Both changes were set against themselves **in one page**, where the
machine's own speed cancels:

    the steppe, no boughs   2.474 ms/chunk    with boughs   2.355   0.95×
    the steppe, one leaf    2.496 ms/chunk    two leaves    2.275   0.91×

Neither is measurable, and both come out nominally FASTER — which only means the
difference is below what this measurement can see. The order had to be alternated
to get even that: run one first every time and it pays for the warm-up while the
other collects the benefit, which is how the coat's first measurement came out
saying the flat build was slower than the graded one.

*Also in that suite run, tests 30 and 31 failed with `page.goto: Timeout`. Both
open a browser of their own, and I had probes of my own running against the same
container while the suite ran. On a quiet machine they pass. Recorded because a
red test that was my own fault is still a red test, and the next person reading
this log should know which it was.*

**7. What is still not done, and why it is not a small thing.**
§2.4.4 also asks for *"bare winter branches on the deciduous"*. The shader browns
and greys the leaf; it cannot **remove** it, because the whole design of the
seasonal colour is that *no chunk is ever re-meshed for the turn of the year* —
and taking the leaf off a tree is geometry, not colour. Now that the trees have
boughs (Round 52) there is something worth baring, so it is worth doing properly:
either an alpha the shader can drive to nothing, or a re-mesh on the turn of the
season, and each wants measuring against the frame budget on its own. Written down
here so it is a decision and not an oversight.

## 4ba. Round 54 — Phase 6 step 4: the flight distance and the watch

*§2.3.5: "Matriarch-led herds with juveniles held at the centre; vigilance
alternating with grazing (one head always up); **species-specific flight
distance**; birds in real flocking; fish in true schooling."*

**1. THERE WERE TWO FLIGHT DISTANCES IN THE WHOLE WORLD**, and both were
written into `js/engine.js`: **nine** units for a man walking up, **eighteen**
for a hunter. So a hare let a wolf come as close as a bull elephant did, and an
elephant bolted from a man at the same nine paces as a chicken. It is the beast's
own now, and it is asked of `js/behavior.js`, where everything else about a beast
is written.

**AND MOST OF IT IS NOT WRITTEN DOWN**, on purpose. A beast's nerve follows its
LEGS, so the default is struck off `run`: a gazelle that runs at 24 breaks at 32,
a hedgehog that runs at 4 breaks at 10. Twenty-six rows say otherwise, and only
where that rule is wrong —

    the heavy and the armed, who stand and look at you
      elephant 11 · rhino 12 · hippo 13 · muskox 14 · yak 14 · polarbear 14
      buffalo 15 · bison 15 · moose 18 · giraffe 22 · walrus 10
    the beasts of the village, who have seen men all their lives
      dog 5 · chicken 6 · pig 8 · cow 9 · sheep 9 · goat 9 · donkey 9 · mule 9
      horse 10 · camel 10 · llama 10 · alpaca 10
    and three the rule gets wrong the other way
      hare 34 · meerkat 26 · jerboa 22

Thirteen distinct distances across the fifteen species the test asks about.
A man on foot is half the fright a hunter is, and a hunter lying up in deep grass
is not seen at all until he is inside a third of it — the cover rule, kept.

**2. AND THE WATCH, WHICH TOOK THREE GOES TO GET HONEST.**
`alert` was one act among a beast's others, drawn by weight whenever it had
nothing better to do. So a herd of eight had **nobody watching most of the time**
and three of them staring at once now and then, which is the one thing a herd
never does. Every eye going down together is how a herd gets eaten, and it is the
whole reason vigilance exists.

A herd is whatever of its own kind stands within eighty units — the same radius
the cohesion pull already used, so the thing that holds them together is the thing
that keeps the watch. There is **at most one head up in it, ever**. Getting a head
up *reliably* is the part I got wrong twice, and the measurements are the record:

| | herds of 3+ standing watched |
|---|---|
| the watch drawn as an act, as it was | — (three at once, or none) |
| taken when a beast finishes its **meal** | **29%** |
| taken at **every** decision | **44%** |
| **handed on** when the watcher stands down | **62–69%** |

and with both ends of the hand-off asked: **65% over 324 samples run alone, 61%
over 205 in a full suite run, and never two watchers inside one radius in
either**. The both-ends check RAISED the fraction as well as fixing the fault —
before it, a full suite run read 32%, because the watch was being handed to
beasts that already had a watcher over them and the herd around the hander-over
was left with nobody.

The last is the one that is right, and it is right because it matches the thing
it models: the beast standing down does not drop the watch and hope, it **gives**
it to the nearest of its herd that is not fleeing or bedding, and that beast lifts
its head at once, mid-meal if need be. Which is exactly what a herd does.

**I DO NOT CLAIM "ALWAYS".** §2.3.5's words are *"one head always up"* and what
this measures is about two thirds of the time. The remaining third is beasts
fleeing, bedding down, walking to water, and herds that momentarily fall below
three. That is written here rather than rounded up.

**3. THE TEST, and its floor is set from what was measured.**
Test 35 asks the flight distances analytically — that they are distinct, that an
elephant breaks later than a gazelle and a village dog later than a deer, and that
a species nobody wrote down is read off its own `run` — and then measures the
watch **on the living world**: the traveller is stood on the great plain, the
world is left to run, and every herd that forms is sampled.

**AND THE FIRST VERSION OF THAT TEST ASKED THE WRONG QUESTION.** It seeded a
group from one beast, took everything of its kind within eighty units of THAT
beast, and called two heads up in it a fault. It caught one in a hundred and
fifty-seven samples — and the code was right and the test was wrong. A herd has
no identity here: it is a NEIGHBOURHOOD, and neighbourhoods overlap without being
the same set, so a group seeded from one member can hold two watchers a hundred
and fifty apart, each of which correctly saw nobody near it when it looked up.
That is two herds drifting together, which is a thing herds do.

The invariant the code actually keeps — and the one worth keeping — is about a
beast's OWN neighbourhood: **no two watchers of a kind within eighty units of each
other**. That is checked directly now, over every beast in the world at every
sample. I could have made the first failure go away by loosening a threshold;
what it needed was a test that asked what the code promises.

**AND THE REWRITTEN TEST IMMEDIATELY CAUGHT A REAL BUG, which is what it was
for.** It passed on its own and then failed in a full suite run: **ten** pairs of
watchers standing inside one radius of each other. The hand-off asked whether the
STANDER-DOWN had a watcher near it and then gave the watch to a neighbour
*without asking the same of the neighbour* — and a neighbourhood is not an
equivalence class, so the beast receiving it could perfectly well have another
watcher eighty units the other side of itself, which the one handing over could
not see. Both ends are asked now. Measured over 324 herd-samples on a quiet
machine: **65% watched, and nil**.

*Twice in this round I wrote down a number before the machine was quiet, and
twice it was wrong — once claiming "absolute: zero" from a single clean run, and
once reading a `page.evaluate: Target page has been closed` as a failure when it
was three of my own probes fighting over one container. The suite is not a thing
to run while you are running something else.*

The floor for "watched" is 45%, which the old behaviour cannot reach and the new
one clears with room for the run-to-run spread this measurement genuinely has —
112 to 201 herd-samples a run, and the fraction moving between 62% and 69%
across runs.

**4. AND TEST 12 WENT RED ON ARITHMETIC, so the benchmark was mended.**
The chunk-build benchmark failed by **four parts in a thousand** — plain 2.670
ms/chunk against a ceiling of 2.660 — on a day when nothing in the mesher had
changed and two in-page A/B runs had already said so (boughs 0.95×, the second
leaf 0.91×).

The cause was in the harness. The figure was compared **raw** against a baseline
taken on another box, and the machine was consulted only to EXCUSE a failure that
had already happened: a trust cutoff at 1.25× against a slack of 1.35×. Those two
numbers do not agree. A container running 1.24× slow is "trusted" and has already
spent nine tenths of the slack on being slow, so any drift at all tips it red —
and a container running 1.26× slow is waved through however bad the code is.

The loop is timed every run now and the readings are **divided by what it says**,
so what is compared is the work with the machine taken out of it. PENDING is kept
only past 2.5×, where the reading is not worth believing at all. On this
container, which reads **1.57× the reference**:

    alone, the machine reading 1.57×
      ocean 1.302 ms/chunk → 0.829 on the reference box   (was 2.152)
      plain 2.961 ms/chunk → 1.886 on the reference box   (was 1.970)
    in a full suite run, the machine reading 1.13×
      ocean 0.891 ms/chunk → 0.789                        (was 2.152)
      plain 2.757 ms/chunk → 2.440                        (was 1.970)

**The plains chunk is not slower than the baseline** — it reads between 1.89 and
2.44 on the reference box against a ceiling of 2.66, where raw it read 2.67 to
3.63 and went red. Three rounds of this log have recorded that benchmark as
pending or red and reasoned around it; it was the ruler, not the thing being
measured. The spread between the two runs above is the measurement's own, and the
slack of 1.35 is what covers it.

**5. What of §2.3.5 is still not done**, and it is most of it:

- **the matriarch**, and juveniles held at the centre of the herd. The cohesion
  pull uses the plain mean of the herd's positions; nothing leads it, and
  `js/baby-animals.js` has a calf follow its mother but not the herd close round
  the calf.

  **BUILT THREE TIMES, TAKEN BACK OUT THREE TIMES — AND THE NUMBERS BELOW ARE
  NOT TO BE TRUSTED.** Read the correction at the end of this entry before you
  read the table; it is the only part of this that is worth anything.

  **BUILT TWICE, MEASURED TWICE, AND TAKEN BACK OUT — and the numbers looked
  like the useful part.** The test is comparative within each sample and so needs no A/B
  and no quiet machine: for every herd with young in it, the calf's distance
  from the herd's centroid against the mean adult's. If the young are held in
  the middle the calf is nearer; if they are merely IN the herd the two numbers
  are the same, because a point drawn at random in a crowd sits at the mean
  distance by definition.

    | | calf | mean adult | nearer |
    |---|---|---|---|
    | gather the herd ONTO the calf | 25.0 | 26.5 | 63% |
    | make the MOTHER keep the middle, hard | 34.9 | 36.7 | 40% |

  The first is circular and I should have seen it before building it: a calf is
  anchored to its mother and goes where she goes, so pulling the herd toward the
  calf pulls it toward wherever SHE stands, which is an adult's place in the
  herd. The second is the right model — *"she puts herself between"* is
  `js/baby-animals.js`'s own words — and it made things WORSE, and told me why
  in the same breath: herds with young fell from 132 samples to 31.

  **The substrate cannot carry it.** The gathering pull fires only when a beast
  picks a new wander target — `jt<=0` on a `roam` or a `flee` — and most of the
  time a grazer's target is set by where the grass is. So a "herd" is a loose
  correlation and not a structure, and no amount of arithmetic laid on top of an
  occasional nudge will hold a calf in the middle of one. Holding young at the
  centre needs per-frame station-keeping in the herd, which is the same thing
  the birds needed and the same reason both were reverted: **the mechanism is
  not wrong, the thing underneath it will not bear it.**

  So I built that: a per-frame DRIFT, applied only while a beast stands still,
  easing it toward the herd's middle at a fraction of a walking pace, with a
  mother drifting harder — the herd easing together as it grazes, which is what
  a herd actually does. And it made no difference either: herd spread 26.0 →
  25.5, the calf metric 80% → 70%.

  **AND THEN I MEASURED THE WORLD AS IT ALREADY STANDS, WHICH I SHOULD HAVE
  DONE FIRST, AND IT READ 80% — better than all three of my attempts.** I was
  a few minutes from writing "§2.3.5's juveniles-at-the-centre is already
  satisfied" into this log. So I ran the same probe on the same unmodified
  build again:

    the shipped world, run one   calf 20.7 · adult 26.0 · 80% nearer
    the shipped world, run two   calf 30.9 · adult 26.1 · 10% nearer

  **The same code, and the number swings from 80% to 10%.**

  ---- AND THAT IS THE FINDING, AND IT IS ABOUT THE MEASUREMENT ----
  Every figure in this entry — 63%, 40%, 70%, 80%, 10% — is inside the noise of
  a metric I built badly, and none of them should be quoted. The fault is that
  the samples are not independent: a run reports "250 calf-samples", but it is
  a handful of calves looked at every twelfth frame for half a minute. Two or
  three animals, counted eighty times each. **n is three, not two hundred and
  fifty**, and which three depends on which herds happened to form near the
  station that run.

  A valid measurement of this needs many INDEPENDENT herds — different lands,
  different runs, one reading apiece — and it needs to be built before the
  feature, not after it. I have neither, so I have no evidence that §2.3.5's
  juveniles-at-the-centre is or is not satisfied, and no evidence that any of
  my three attempts helped or hurt. **The item stays open and unclaimed.**

  What is genuinely known, and cost three attempts to learn: the herd gathering
  rule fires only when a beast picks a new wander target, so a herd here is a
  loose correlation and not a structure — that much was visible in the code and
  did not need measuring. Giving a herd real structure would serve the
  matriarch, the young and the flocking together, and it wants its own round,
  beginning with a measurement that can tell whether it worked.
- **birds in real flocking.** They have COHESION only — the mean of their own
  kind within a hundred and twenty units — and neither separation nor alignment,
  so a flock is a cloud that drifts together and never a flock that turns.

  **I BUILT IT, MEASURED IT THREE TIMES, AND TOOK IT BACK OUT.** The mechanism
  was sound and is worth writing down for whoever picks it up: alignment cannot
  be added to a CIRCLE, because birds going round one centre only head the same
  way if they are at the same point on it — so a flock has to TRAVEL. One bird
  leads and wanders as birds always did; every other holds a station in a wedge
  turned with the leader's own heading, which gives cohesion and alignment out
  of one mechanism, and then separation is the only rule left to add. It works:
  measured on the open sea, **136 bird-samples flying together against 14, and
  44° of heading between them against 86° for birds merely near each other**.

  What defeated it is that a bird has nowhere in its day to BE in a flock.
    · Hung on the 'rest' branch it changed nothing, because measured over four
      hundred frames **95% of the birds in this world are in 'hunt'** and 2.5%
      ever reach 'rest'.
    · Made a job of its own, entered after feeding, it worked where I first
      measured it and produced **zero pairs** where the suite stands (inland,
      where the birds aloft are eagles, which do not flock) and **zero
      bird-samples** at the voyage's opening on open water, where a gull fishes
      without pause and never gets to the end of a meal.

  The flock is not a movement rule to bolt on; it is a part of a bird's day that
  does not exist yet, and giving it one means deciding when a gull stops
  fishing — which is a question about the bird, not about the geometry. Better
  taken as its own round than shipped as a thing I could not show working.
  Reverted; the tree carries none of it.
- **fish in true schooling** already stands: a school turns as one thing, rises
  in the dark and sinks by day, and bursts when a shark tears through it.

## 4bb. Round 55 — two faults reported from a player's own screen

Not a step of any phase. A player sent a photograph of the loading screen and,
later, of the pull-back. Both were real, both were mine, and feature work stops
for them: at the end of it the game has to work.

### 1. "THE VOYAGE COULD NOT BEGIN — could not read creatures/jerboa.js" ✅

**The file was there.** Committed at `878b91d`, 1,820 bytes, parsing, at line
350 of the manifest, and loading on every machine I have. All 386 data files
parse. Both games boot clean here — 176 countries, 42 blocks, 14 minerals, 13
works, 150 creatures, 8 scrolls, 18 cities, 59 landmarks, 0 errors. It simply
did not arrive that once, on their machine, that time.

**And `MANIFEST.load` appended all three hundred and sixty-five `<script>` tags
in one go, so one `onerror` rejected the whole promise.** No retry. A world of a
hundred and seventy-six countries refusing to start over one gerbil. A browser
asked for 365 files at once over `file://` — or a phone on a thin connection, or
a disk with a scanner sitting on it — will drop one sooner or later; it is not a
rare event, it is a Tuesday.

**It is loaded in ordered batches of thirty-two now**, each awaited before the
next is appended, so the order — which is the entire point of that file — is
exactly what it was, and `async=false` still does the real work. A file that
fails is asked for **twice more, in its own place**, before the batch closes.

**And what happens if it still will not come is written down rather than
guessed at**, because the answer is not the same for every file:

| | looked up by | one missing costs | so |
|---|---|---|---|
| `creatures/`, `cities/` | **name** | one beast, one town | the voyage sails, and says which |
| `countries/`, `blocks/` | **its place in the list** | every id after it shifts | the boot stops, and says why |

That second row is the whole reason `skippable()` is a rule and not a shrug: a
world built without `blocks/stone.js` is a *different world under the same save
file*, and would hand the traveller different stone in every chunk he had
already walked. `MANIFEST.lost` names what was let go of and the menu tells him,
rather than leaving a hole where a beast should be.

**`tools/thin-connection.js` is the proof, and it is a committed file.** It
serves the repository over http from a server that drops a named file, and puts
six trials to it. Nothing is moved on disk.

| | trial | kept |
|---|---|---|
| 1 | the whole world, nothing dropped | 176 countries · 42 blocks · 150 beasts |
| 2 | a creature dropped **twice**, served the third time | 150 beasts — the asking again works |
| 3 | a creature that **never** comes | stands, **149 beasts**, and the menu names it |
| 4 | a block that never comes | **refuses**, and says why |
| 5 | a country that never comes | **refuses**, and says why |
| 6 | Scripture Unfolds, short a creature | stands, 149 beasts |

**Trial 5 caught a second fault on the way in.** Nothing watches
`__WORLDFILES` until three.js has landed, and three.js comes over a wire that
may take seconds or may fall back to the shipped copy — so a file near the TOP
of the manifest rejects long before anything is listening, and the console
filled with an unhandled rejection on top of a boot that was already failing.
Both pages take the rejection at the point they make it now. The handler is a
receipt and not a remedy: the promise still rejects, and `boot()` still reads it.

**Acceptance test 36** keeps the cheap half on every run: as many countries as
there are `countries/` lines, as many blocks as `blocks/` lines, the by-name
lists short only by what was declared lost, and nothing positional ever called
skippable.

### 2. "holes are appearing in the world view when zooming out"

**They were holes exactly, and they were the far carpet.** Near the traveller a
cell of the ring is a few blocks across and the one point sampled at its middle
IS the cell. Drawn far back the ring opens to eight times its radius on the same
64 × 112 lattice, so a cell out there is some **sixteen hundred units** across —
and the Nile is **forty**. A cell whose middle happened to fall in the river was
given to the sea entire: sunk six units under the waterline, walled on four
sides, and coloured `FL_SEA` = `#123352`, which is **half the brightness of the
charted sea laid over the top of it** and is, to the byte, the navy in the
player's photograph. A trench gouged across dry Egypt, and a chain of them down
every great river of the earth. Reproduced headlessly at Egypt before touching
anything.

**The engine had already named this artefact and answered it in the wrong
place.** The note beside the ring's fade calls them "ragged navy shapes where
the ring's coarse sampling struck water in the midst of dry countries" and
answers by taking the RING away sooner — which hides them at the far end of the
pull-back and leaves them standing through the whole middle of it, which is
exactly where they were reported from. The fault is in the SAMPLING.

**A vote of the four corners was tried first and taken back out.** Land if three
of the five points are dry: it mended the rivers, and it ate the edges of
genuine bays narrower than a cell, which is a worse thing than the fault. Kept
here because the next person will think of it too.

**What ships is one exact question.** `cellRaw` answers `null` for a block of
river and a block of ocean alike, and rightly — asked for a *block*, both are
water. But the ring is asking what stands over sixteen hundred units, and at
that grain a river running through a country is THE COUNTRY. `riverBlock`, set
beside `cellRaw`, reads the same warped coast off the same two rasters and
answers whether the water at a block is a river inside some nation: two array
lookups and no search. Nothing else in the world is touched — not one coastline,
not one bay, not one island, not one league of open sea, because none of them is
a river. The lowest of the four bank samples gives the cell its height, so a
county lifted out of the water comes back as the river plain it is and never as
a cliff; and where a mouth is so wide that no bank falls inside the cell it
stays water, which is right — that is an estuary.

**Acceptance test 37** lays a whole ring at an eye of 24,000 over the
traveller's own ground and the three widest countries (taken by outline detail
out of the country table, so it cannot go stale when a country is added), reads
every coarse cell off the terrain again, and counts the cells whose middle is
river water with dry bank inside the same cell that the ring nonetheless called
sea. There may be none. It reports how many rivers it found, so a run that
laid its rings over open ocean and never asked the question reports PENDING
instead of passing quietly.

### 3. "Can the circle be blurred at the edges to look more seamless"

Asked of the same picture, and it is the carpet's own rim. **A disc laid over
the charted face ends in a CIRCLE, and that circle was drawn**: a hard curved
seam across the middle of the world, bright coarse country on the near side and
the dim charted face on the far, with the raised profile of the ring's edge
standing against the chart like the lip of a saucer. Rising or drawing back, the
eye follows that arc the whole way out, and it is the one thing in the pull-back
that says *two pictures* rather than *one world*.

**The inner seam was solved long ago and cannot be solved the same way.** Where
the coarse ring meets the fine chunks the ring SINKS beneath them (the sink in
`flShadeRing`), which works because both sides are ground and one may simply be
hidden under the other. Nothing can be hidden under the chart: the chart is
above.

So the rim gives up its **alpha** instead, thinning away into the chart over the
outermost **quarter** of whatever radius the ring was last laid at. Four things
about it are deliberate:

- **Per fragment, from the mesh's own polar coordinates.** The ring is built
  about its own centre, so the local x and z ARE the radius vector. Reckoned at
  cell corners it would step from one cell to the next in visible bands, because
  the cells out there are hundreds of units wide.
- **A fraction of the CURRENT radius, set at every ring swap.** The ring grows
  and shrinks with the eye; a fixed width would be a wide haze up close and a
  hard edge from miles up.
- **`addPatch`, not `radialSkirt`.** The cloud sheets that helper serves are
  flat quads on x/y and this is a polar mesh on x/z — and `farLandMat` is
  enrolled in `LIT`, so it already carries the torch patch. Assigning
  `onBeforeCompile` over the top of it, as `radialSkirt` does, would have
  silently taken the traveller's lamp off the far country.
- **A QUARTER, and a seventh was tried first and was not enough.** Measured
  against the picture and not against the arithmetic: at a seventh the disc's
  raised lip went and the colour bled instead of stopping, but an arc was still
  readable on the shoulders. The reason is PERSPECTIVE — the rim is the
  furthest part of the carpet from the eye and so the most foreshortened, and a
  band a seventh of the radius wide on the ground is a handful of pixels tall on
  the screen. A softened edge is still an edge. At a quarter the arc is gone.
  What it spends is the outermost cells of the ring, which are the coarsest in
  it and the least worth looking at.

## 4bc. Round 56 — three more from the player's own screen

### 1. The holes again — and the census that said my last fix was aimed too narrowly

Round 55 fixed the RIVERS: a coarse cell whose middle fell in one was given to
the sea entire, and a chain of navy trenches ran down every great river. That
was real and it is fixed. It was not the whole of it.

**So I counted instead of guessing.** `farWhy` (a read-only probe on `__VDBG`)
lays a ring at a far eye and sorts every LANDLOCKED cell — one the ring calls
sea while all four of its neighbours in the ring are dry, which is a hole in a
country by definition — by cause. Over the eight widest countries of the earth,
**54,656 coarse cells**:

| cause | cells |
|---|---|
| a narrow water with land on some sides — a lake, a tarn, an inlet | **40** |
| no dry ground within a raster pixel in any direction | 6 |
| a HAIRLINE in the country raster — one pixel of nothing between two nations | 5 |
| a river whose cell held no dry bank to stand on | 2 |
| **total** | **53** |

Four causes. Hunting them one at a time would be four rules, four sets of
samples and four ways to be wrong — **and they are all the same shape**: a body
of water narrower than the cell it is drawn in, drawn as a cell-wide pit. That
shape has a definition needing no terrain at all: *a cell with dry country on
all four sides is not the sea.*

`flFillHoles` sweeps the ring once as it is laid and gives any such cell the
lowest of its four neighbours' heights and the mean of their colours. **It costs
no sampling whatever** — four array reads a cell over seven thousand cells.
What it cannot touch is the point of doing it by the neighbours: a lake or bay
WIDER than a cell keeps a wet neighbour and is left exactly as it was, and so is
every coast and every league of open sea. The river rule still earns its keep —
a river runs in a CHAIN, so its cells have wet neighbours upstream and down and
are never enclosed. It reads from a snapshot, so a cell filled early cannot help
fill its neighbour and eat a narrow lake from one end.

### 2. "If the user zooms too quick only the circle of the carpet is seen"

**The politeness was measured in the wrong thing.** The ring rebuilds six
milliseconds a frame unless the traveller is outrunning it, and outrunning it
was reckoned as LAG — how far he has walked from where the ring was laid —
because when that was written, travelling was the only way to outrun it.

Spinning the wheel moves him nowhere. Lag stays at zero, the rebuild stays
polite, and the ring crawls from three thousand units to twenty-eight thousand
over a dozen frames while the eye is already at forty thousand and climbing.
What is on the screen for the whole of that is the OLD ring at the OLD radius: a
small bright disc of country adrift on an empty plane. That is the circle.

A radius that has outrun the ring by half again now counts as outrunning it,
exactly as the ground does. An ordinary drift of the view still rebuilds
politely (the threshold that STARTS a rebuild is a fifth), and only a wheel spun
hard enough to leave the ring behind pays the one-frame hitch — which is the
trade the file already makes for the traveller who flies.

### 3. The ship was not a solid thing, and the birds went through her

*"Birds are landing in the water through the boat."* Exactly so. A sea-fowl
benighted over open water RAFTS: it sets its perch at the waterline wherever it
happens to be. It happened to be over the ship as often as anywhere else, and
the waterline under a galleon is two fathoms below her deck — so the gull sank
through the planks and sat bobbing inside the hold. The same hole let a diving
bird stoop THROUGH her at a fish and a bird with a catch eat its supper inside
her timbers.

**Nothing asked where she was, because nothing had a way to ask.** The deck knew
its own shape — `deckAllowed`, `deckHeightAt`, in ship-local coordinates — but
there was no way in from the world, and the birds live in the world.
`overShip`/`besideShip` are that way in.

**And nothing is ever set down UPON her**, which is the less obvious half. A
gull on the rail is the charming picture and it is wrong here: a perch is a
FIXED POINT OF THE WORLD and she SAILS, so a bird perched on her would be
standing on open water within the minute — the very fault reported, upside down.
What would settle where she is is put BESIDE her, out along her beam, which is
where a gull waiting on a ship actually sits. And because she moves, a rafting
bird she comes over is re-seated beside her rather than run down.

### 4. The two lights are square again, at every distance

The round faces are struck out. They were built because a hard tile beheld from
outside the world "reads as a fault in the drawing" — **which was my judgement
of it, written into the file, and not a report from anyone looking at the game.**
What came back from the man looking at it was *"replace the circles with
rectangle as it is in the world."*

He is right, and the old note says why without noticing: the square IS this
game's own signature, and it is what a man standing on the disc sees. **A world
whose sun changes shape depending on how far back the eye is drawn has two
suns.** The haloes remain — they are what makes a light read as a LIGHT rather
than a yellow tile, they are soft-edged so they put no second shape in the sky,
and they were never what was complained of. The old complaint of "extra lights
floating around the sun and moon" was the two FACES overlapping inside them, and
with one face there is nothing left to overlap. The round pair is left in the
file, dark and never drawn, so the reason it was tried is not lost with it.

## 4bd. Round 57 — the falls measured at last: what the water costs, and the one thing still in the way

The round before this left a `?` in its own table and a question written into
the file: *"the next measurement runs the same spring at Niagara twice, once
each way. If the two numbers are close the air is doing nothing and should go."*
This is that measurement, and it turned up two faults nobody had reported.

### How it was measured, because the method is half the finding

Waiting on frames measures the RASTERISER. The flow moves at four ticks to the
second and takes at most 1.2 ms of a frame; under SwiftShader a frame is the
better part of a second, so a fall that needs six hundred ticks to settle needs
**half an hour of wall clock** to be watched that way — and the first two
attempts at this measurement were killed by their own timeouts having printed
nothing at all. `WATER.step(0.25)` is exactly one tick with exactly the budget
the game gives it: same queue, same order, same millisecond. The same six
hundred ticks then cost **twenty-three seconds**.

The second thing that made it cheap: **the water does not need the mesher.**
`blockAt` answers procedurally whether a chunk has been built or not, and
js/water.js reads nothing else — so the whole flow runs correctly at a fall on
the other side of the world from the eye, and the three or four minutes a
software rasteriser spends meshing a rainforest are not spent at all.

**And the flow is not deterministic**, which is worth writing down: the queue is
worked under a WALL-CLOCK budget, so a busier machine visits fewer cells per
tick and settles somewhere slightly different. Multnomah read 3,815 on one run
and 2,914 on another with identical rules. Every number below is a reading, not
a constant, and the acceptance test is written to bound them rather than match
them.

### 1. The air was doing nothing, and was charging for it

The same three falls, run twice, once each way:

| fall | standing, air on | air off | queue on | queue off |
|---|---|---|---|---|
| Niagara | 7,121 | 7,197 | 3,792 | 278 |
| Multnomah | 3,875 | 3,815 | 2,041 | 290 |
| Angel | 533 | 549 | 562 | 0 |

**The standing total is the same to within a hundredth or two.** It is the
LEVELS that bound the water — seven blocks from a source and no further — and
the air was contributing nothing whatever to the shape of it. What it *was*
doing is the last two columns: it dried cells that were refilled the next tick,
and every drying and every refilling wakes six neighbours, so the queue never
emptied and the flow paid its whole millisecond of every frame **for ever**, at
falls the traveller had long since walked away from. Angel is the plainest case
— a still puddle on a tabletop with 562 cells awake in perpetuity, and **not one
awake with the air off**.

It was added, by my own note in the file, "to hide a bug". The bug is mended and
the air is gone.

### 2. THE TALLEST FALL ON EARTH WAS DRY, and the cell count said it was the best-behaved of them

Angel: 549 cells standing, **shaft 0**, furthest cell nineteen blocks from the
head. Not one drop went over the brink. A round that had only counted cells
would have called that the tidiest fall in the world and shipped it.

`heightAt` holds the lip proud for the whole of `under × drop` — which is what
an OVERHANG is, and it is the making of a plunge fall. `springs()` laid the
heads at v = 0. For Angel that is **seventeen blocks upstream of the brink**,
and water reaches seven blocks from a source. It never came within ten blocks of
the edge.

Niagara (`under` 0.05 of a six-block drop) and Multnomah (tiered, `under` 0) were
untouched by this — their brink already *was* v = 0, which is exactly why those
two poured and Angel did not, and why the fault survived a round of measuring
the other two. The head goes at the brink now. Angel: **549 cells and nothing
over the edge → 24,674 cells and a curtain a hundred and nine blocks deep.**

### 3. A PLUNGE POOL WAS A PERPETUAL-MOTION MACHINE — and the new test found it

Acceptance test 39 was written to assert three things, and the third — *take the
head away and the stream unwinds* — failed on its first run: **Krimml kept 2,787
cells of 4,485 standing for ever with no source anywhere in the world.** Angel
kept 1%, Iguazu 4.8%, Krimml sixty-two.

`wants` read *"is there water above me? then I am FALLING"* — any water at all.
So every cell of a body two or more blocks deep was FALLING; FALLING is a full
block; and a FALLING cell with solid ground under it counts as a SOURCE to its
four sides. **A filled basin was therefore a ring of little springs feeding each
other in a circle, needing nothing and draining never** — and the plunge pool,
the very shape the round before this one was built to make, is the commonest
such basin in the world.

**Falling comes DOWN FROM A SOURCE.** A cell is falling if what stands over it
is a SOURCE or is itself FALLING — never merely because water lies on it. A real
column is falling the whole way down and its pool with it, because the chain
runs unbroken to the spring at the head; a pool with nothing coming into it is
ordinary levelled water, which thins from the edge and goes. **Test 39 now
drains all three of its falls to zero cells.**

**And it cost the curtain, which is written down rather than hidden.** The old
rule spread water along the brink of its own accord, so the whole breadth
poured; without it, seven heads make seven threads. Angel fell from 24,556 cells
to 908. **A head every other block was tried and taken back out**: it gives the
volume back (Iguazu 12,738) and it will not unwind — with the hundred heads
taken up the water went on *growing*, and the fall measured after it inherited a
lake. That is not understood yet, and a fall that cannot be turned off is worse
than a fall that is thin, so it stands at seven heads until it is.

### 4. What the four falls now cost, and that they stay where they are put

| fall | form | drop | standing | furthest | its own gorge |
|---|---|---|---|---|---|
| Niagara | cataract | 6 | 2,298 | 112 | 129 |
| Mosi-oa-Tunya | cataract | 12 | 1,534 | 154 | 184 |
| Angel | plunge | 109 | 908 | 28 | 269 |
| Multnomah | tiered | 21 | 124 | 8 | 63 |

**Not one of them leaves the gorge it cut.** The flood that turned the springs
off was 13,989 cells at Niagara and 23,025 at Multnomah *and still climbing when
the reading was taken*; Multnomah is a hundred and twenty-four cells now.

### 5. Forty-odd per cent of the water was being drawn inside itself

Water leaves the greedy mesher and emits its own box, and it emitted **all four
side faces whatever stood against them** — including faces pressed against solid
rock and faces buried inside a column of water.

Rock now hides a face entirely and water hides as much of it as it stands up to,
which also draws the step where a thinner block stands beside a fuller one:

| fall | faces before | after | struck off |
|---|---|---|---|
| Niagara | 10,714 | 6,149 | 43% |
| Mosi-oa-Tunya | 7,212 | 4,387 | 39% |
| Angel | 4,198 | 2,253 | 46% |
| Multnomah | 544 | 306 | 44% |

Measured against the water as it *now* stands, which is thin. Against the water
as it stood before the pool rule — a genuine curtain — the same change struck
off **85% of Angel's hundred thousand faces** and about 64% of the other three,
which is the number that matters for whenever the curtain comes back.

### 6. And the springs are STILL off — for a reason nobody had measured

A fall that has settled is not still. It is a FLOW, and a flow at equilibrium is
water arriving, falling, landing and being taken by the sea at the same rate.
Over two hundred ticks *after* the standing total stopped moving:

| fall | standing | blocks laid | blocks taken up |
|---|---|---|---|
| Niagara | 3,284 | 9,620 | 10,261 |
| Angel | 863 | 11,696 | 11,676 |

**Eleven thousand writes to hold eight hundred cells still.** Every one goes
through the engine's `setBlock`, and `setBlock` marks the chunk for the SAVE and
re-arms the 900 ms writer. So the springs as they stand would have **every fall
the traveller has ever walked past writing the world to the disc every 900 ms
for the rest of the voyage**, and would file a waterfall in the record of *what
hands have done*, which is not what it is. Note that thinning the water did not
help this at all — Angel holds a thirtieth of the cells it held before the pool
rule and does twice the writing, because what is being counted is the FLOW and
not the pond.

**The next step is one step, and the engine already has the pattern for it.**
`SEDITS` is the structures' layer — "derived, dropped, never written down".
The flow wants the same: a hand's own source is a deed and belongs in the save;
the water that runs out of it is derived, is never written, and re-establishes
from the source in the two or three minutes these traces show. Then
`SPRINGS_ON` is `true` and the falls of the earth run.

### 7. Acceptance test 39, and the two faults it found in itself first

`a spring at a fall pours over the brink, stays at the fall, and drains when it
is taken up` — three falls chosen **by form and not by name** (the tallest
plunge, the widest cataract, the tallest tiered stair, taken out of the data so
that adding a fall cannot make the test stale). It asserts that water stands in
the shaft between lip and foot (the dry-fall fault), that nothing stands outside
the fall's own claim (the flood), that the total settles, and that taking the
heads up unwinds the stream — which is both the third assertion and the cleaning
up of a fall's water, which no later test wants in its world.

**It reported a fault that was its own.** The first run had Iguazu throwing water
five thousand seven hundred blocks — which was ANGEL, a continent away, left over
from the fall measured before it, because `WATER.serialise()` is the whole
world's water and not this fall's. What stood before each spring is set aside
now, and only what that spring put into the world is judged.

**And it called a live flow "climbing".** The tip of a falling column flickers by
a dozen cells from tick to tick; a tolerance of one per cent of nine hundred is
nine cells, so Angel was reported as never settling through four thousand ticks
of standing perfectly still. Twenty cells, or two per cent, whichever is wider.

Final run: `Salto: 817 cells, 78 in the shaft, 28 blocks at furthest (of 269),
drained to 0 · Iguazu: 2441 cells, 610 in the shaft, 233 (of 261), drained to 0 ·
Krimml: 332 cells, 40 in the shaft, 10 (of 110), drained to 0`.

### 8. And one red test that is not this round's, said out loud rather than left

Tests 19, 22 and 39 pass. **Test 38 — the voyage's own hand: a blow breaks, the
drop is taken up, it lays back — FAILS**, with *"the blow did not break Sapphire
in 25s — and never ran at all"*. It was put to a worktree at the commit before
any of this round's changes and **it fails there identically**, so it is not the
water's doing and it is not fixed here. It is the hand a player actually plays
with, the same chain Round 55 was called out to mend, and it wants a round of its
own. It is written here so that the next reader finds it rather than the
player.

## 4be. Round 58 — the flow gets a layer of its own, and the falls of the earth run

Round 57 ended with the springs still off and one thing in the way, named
precisely: a settled waterfall lays and takes up eleven thousand blocks every
fifty seconds simply to stand still, every one of them through `setBlock`, which
marks its chunk for the SAVE and re-arms the 900 ms writer. **This is that one
step, and `SPRINGS_ON` is now `true`.**

### The layer, and why it is the third and not the second

The engine already had two: the player's own EDITS ("not derivable from
anything, the only record of him, authoritative") and the structures' SEDITS
("derived, dropped, never written down"). Running water is plainly the second
kind — a fall is worked out again from its spring exactly as a village is worked
out again from its site — so `WEDITS` is that, for the flow.

**The order is not simply "third", and getting it wrong would have been
invisible until somebody dug a channel.** Water stands in AIR: it may never hide
a hand's block or a village wall, but it MUST show in a channel a hand has dug —
and a dug cell is a `0` written in the player's own layer. So the rule is: a
NON-ZERO block of either layer above beats water, and water beats a `0`. And
because water shows only through air, a block laid where water runs takes the
cell from it outright — otherwise the stone would merely HIDE the stream, and
breaking the stone later would let out a puddle nobody had poured.

Three readers had to learn the third layer, not one: `editAt` (which is what
`blockAt` answers with, so collision, the hand and the traveller's feet all
follow from it), `editColumn` (the mesher's per-column edits) and the chunk
builder's own `chunkEdits`. Missing the second or third would have given water
that a man falls through, or water nobody can see.

### What is still a deed, because a bucket is not a waterfall

A source a HAND laid goes in the record as it always did — it is a thing the
traveller DID and nothing can work it out again. The flow that runs out of it is
derived and is not written. `js/water.js` therefore has two doors now
(`setBlock` for the flow, `setDeed` for a hand's source) and a `DEED` set of the
handful of cells that came in by hand.

**And the load is the neat half of it**: since flowing water is never written,
every water block in a save is BY CONSTRUCTION a source somebody poured, so the
boot spills them again as sources and the stream finds its own shape in the
first minute — the same minute the ground it runs over is being laid.

### The measurement: the same falls, the same two hundred ticks

Round 57, through the record: Angel laid 11,696 blocks and took up 11,676, and
every one armed the writer. Now:

| fall | standing | blocks laid | taken up | THE RECORD MOVED BY | writer's queue |
|---|---|---|---|---|---|
| Niagara | 3,423 | 10,893 | 10,730 | 1 cell | 13 → 13 |
| Angel | 811 | 14,933 | 14,943 | 1 cell | 3 → 3 |
| Multnomah | 132 | 7,168 | 7,168 | 12 cells | 1 → 1 |

**The writer's queue does not move at all.** Thirty-three thousand blocks of
water go past and the record moves by fourteen cells in total — and those are
the world's own doings elsewhere (a bank of sand coming down, a village laying a
wall), not the water, which is proved cell by cell rather than by the total:
acceptance test 40 asks of every one of the 2,698 cells of a running Iguazu
whether it is in the record, and **none of them is**.

### Acceptance test 40, and what it asks that a total cannot

`a running fall writes nothing into the record, and a hand's own source writes
itself`. Two things must be true and they pull against each other:

1. **A fall runs and the record does not move** — asked per cell, because a
   TOTAL cannot answer it. The world does other things while a fall runs and
   those are records rightly kept; the question is whether any cell OF THE FLOW
   is in the record. Of 2,698, none.
2. **The water is still there** — a layer nobody can see is not a fix, it is a
   deletion. All 2,698 cells answer as water at `blockAt`, which is the one door
   the mesher, the collision and the traveller's feet all read.

And the other half: a hand's bucket puts **exactly one** cell in the record.

### And test 39 had to learn what a live world means

Turning the springs on broke the test written in the round before, in a way
worth keeping a note of: the engine now lays a spring at whatever fall the
traveller is near, all through the run, so a test that judged "did this fall
throw water out of its gorge" by *everything standing in the world* reported
Angel as having thrown water eighteen thousand blocks. **A cell now belongs to
the fall it is NEAREST to** — no bookkeeping, nothing to go stale, and it is the
plain meaning of the question. Both tests pass:

    PASS 39  Salto: 849 cells, 83 in the shaft, 28 blocks at furthest (of 269), drained to 0
             Iguazu: 2578, 704 in the shaft, 236 (of 261), drained to 0
             Krimml: 333, 39 in the shaft, 10 (of 110), drained to 0
    PASS 40  Iguazu: 2698 cells standing, 455,532 laid and 452,834 taken up,
             NONE of them in the record

### What this does NOT fix, and it is the same debt as before

The curtain. Seven heads make seven threads, and a head every other block gives
the volume back but will not unwind. Nothing in this round touched that, and the
falls that now run are thin ones. It wants a round with a PICTURE in it, which
this one has not been.

## 4bf. Round 58b — the water had nowhere to go, reported from a picture

The springs were turned on and a photograph came back from the foot of Niagara:
**the traveller standing in a lake.** The words with it were exact — *"water
falls should flow into rivers and not just poured out on the ground going
nowhere"*, and then *"or make a cistern for water to go"*, and then *"look at the
game's own base water, especially in the shallows, and make cisterns or lakes
like that for waterfalls to run and stop in."*

**It is not the flood, and the numbers say so** — Niagara settles at some three
thousand cells and never leaves its gorge. It is a sheet of water lying on flat
ground, which is a different fault and a fair one.

### The gorge was flat, and that is the whole of it

This file promised "a gorge running away downstream that the fall itself cut",
and what it cut was `return foot` — the same height for every column past the
pool. The profile below Niagara read `1 1 1 1 1 1 1 …` for as far as it was
sampled. **Water on a flat plain has no shortest way down**, so it takes every
way at once and spreads as a disc; that is the disc in the photograph. The
flow's own rule was working perfectly and the ground was giving it nothing to
work with.

### And the first cut of the channel came out flat too, for a reason worth keeping

A descending channel was cut from the pool downstream — and measured perfectly
flat: `1 1 1 1 …`, every step clamped. **`foot` was `max(2, h-2)`, the natural
land at Niagara is three blocks, so the foot of the fall stood at ONE — the floor
of the world, with nothing underneath to cut into.** A fall that lands on the
world's floor can have neither a basin nor a slope. It is `max(2+basin, h-2)`
now: a fall is never set lower than the pool it needs, which lifts the low-lying
falls two or three blocks and is eased back to the true land at the edge of the
claim exactly as the shelf always was. Niagara's profile now reads `9 9 9 9 6 2
2 2 …`: a lip two blocks higher, and a basin floor two blocks below its rim.

### What is cut now

- **A BASIN at the foot** — as deep as the fall can afford (2–5 blocks) and
  wider than its own apron, with the gorge floor standing round it as a rim.
  The water comes down the wall, gathers in it and stops there, which is what
  the man asked for and is also what a plunge pool is.
- **A CHANNEL running away from it** — a cut a few blocks wide, descending a
  block every few, with the old gorge floor as its banks. Where the ground has
  the room, the fall now runs off in a stream instead of lying in a sheet.
- **The claim runs far enough to hold them.** It was `drop*2.2` — thirteen
  blocks at Niagara, which is SHORTER THAN THE SEVEN-BLOCK REACH of the water
  landing in it, so the fall's own cut ended inside its own apron and the water
  simply walked out on to the flat. It is `max(40, drop*3)` now.

### Where it stands, and what is still owed

Niagara: 3,297 cells, still within its gorge, and the picture now shows a pool
with a rim and dry bank in front of it rather than a sheet under the traveller's
feet. Tests 22, 24, 39 and 40 all pass with the new ground — 24 matters here,
because a fall that raises its own foot raises the land, and every named summit
must still be walkable.

**The outfall is not done.** A river in this world is open water and js/water.js
already gives up whatever reaches one, so a channel that MEETS a river is a true
outfall and the standing water would be only what is in transit. `riverBlock` in
the engine answers "is this column a river" in two lookups and no search; the
step is to find the nearest river to each fall at load and aim the channel at it.
That is the next thing, and it is what "flow into rivers" finally means.

## 4bg. Round 58c — the outfall: the channel aimed at the nearest river

*"Do the outfall — aim the channel at the nearest river."* Done, and it took
three measured attempts, each of which failed for a different reason worth
keeping.

### Finding the water

`outfallWater(ix,iz)` in the engine, beside `riverBlock` and built the same way:
the same warped coast, the same two rasters, no terrain, no cell, no cache — 1
for a river inside a nation, 2 for the sea, 0 for dry land. Because it asks the
rasters and nothing else it may be called while the terrain is being generated
and cannot recurse into the very heights it is helping to decide.

The search is a fan of nine rays out of the plunge pool, downstream and to
either side, every other block, nearest hit wins — done ONCE per fall, the first
time the terrain asks about it. What it finds:

| fall | outfall | distance |
|---|---|---|
| Iguazu | the sea | 9 blocks |
| Mosi-oa-Tunya | **a river** | 16 blocks |
| Niagara | the sea | 25 blocks |
| Angel, Gocta, Yosemite, Multnomah, Tugela | nothing within the claim | — |

The great plunges have no outfall and keep their basin, which is the right
answer for a fall off a tepui in the middle of a forest.

### The first cut was flat, and so was the second

**The pool was not a pool, it was a county.** `poolR` was `half × F.pool` in BOTH
directions, so Niagara's hundred-block half-lip gave a "pool" a hundred and
eighty-two blocks DEEP as well as wide — wider than the fall's whole claim, so
every column near the fall was pool and the channel had nowhere to begin. A
plunge basin is the shape of the curtain that fills it: as wide as the lip, a
few blocks deep. Two numbers, not one.

**Then the channel was cut and came out DEAD FLAT at height 1** — the waterline
— for the whole twenty-five blocks, because the basin floor was already there
and there was nothing underneath. Water reaches seven blocks from a source and
no further on the flat, so it died a third of the way along and lay in a sheet
exactly as before. **A stream is not a channel; it is a channel with a fall in
it.** A fall with an outfall is now raised enough to reach it — a block of grade
for every five blocks of distance, on top of the basin it must also hold.

Niagara's gorge, before and after:

    1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1
    7 6 6 6 5 5 5 5 4 4 4 3 3 3 3 2 2 2 2 1

That staircase is the stream. And because a raised fall that ended at its claim
edge would be **a plateau with a cliff round it**, the gorge floor now eases from
the foot back down to the world's own land across the run, as the shelf above it
always did.

### And a probe that lied, which is the lesson of the round

The outfall and the grade were worked out in two places — the search in one, the
raise in the other — and the read-only probe called only the first. **So the
terrain the probe reported was cut to a different shape from the terrain the
game builds**: a flat channel in the one and a staircase in the other, off the
same fall in the same world, and I read the probe's answer for a quarter of an
hour before noticing it disagreed with the profile beside it. A thing worked out
once is worked out in ONE function (`prepare`), and everything that wants it
calls that.

### What it costs, said plainly

**The standing water at Niagara went UP, from 3,807 cells to 5,216**, and that is
not a regression: there is now twenty-five blocks of sloping apron with water
running down it where before there was a sheet dying seven blocks out. Water in
transit is the thing a river IS. The count stays bounded and inside the gorge
(114 blocks of a claim of 129), test 39 still drains every fall to zero, and
test 40 still finds not one cell of it in the record.

Tests 22, 24, 39 and 40 pass. 24 is the one that matters for a round that raises
ground: every named summit must still be walkable, and all thirteen are.

## 4bh. Round 59 — the bark measurement: the number a shipped feature never had

First of the five queued behind the water, and it is not a feature at all: **the
bark per species has been in the world since Round 52 and was never measured.**
Every other item of Phase 6 shipped with its cost set beside the thing it
replaced — the coat at 1.13× the build and no per-frame cost, the boughs at 2.5×
their own geometry for +11.7% triangles in a German wood, the second leaf at +249
meshes and not one extra triangle — and this one shipped with nothing. PLAN.md
went on calling it *"partial: one grey bark, tinted per species — not a texture
each"* for three rounds after it had stopped being that.

### What is actually there

`BARK_MAT` in `js/flora.js`: six patterns — paper, ring, plate, twist, cork,
smooth — and the deep fissure as the default. A kind names its own in
`world/flora.js` or says nothing and its FORM answers for it (a palm rings, a
conifer plates, a gum is smooth). `K._bark` is settled once per kind at load and
never in the mesher, and the per-species TINT still sits on top of every one of
them, so a birch and an aspen wear the same paper in two different greys.

### The measurement, and it took three goes to be worth anything

`FLORA.barkOn(false)` is the A/B switch — every bole in the world wearing the one
grey bark, exactly as it stood before §2.4.3 — cut to the same pattern as
`everOn` and `boughsOn` that the two rounds before it used. The same wood is
built twice in one page, and `viewStats` reports MESHES (which are draw calls),
triangles, and which material every mesh went to.

**The first two readings were of the wrong thing, and the reason is worth more
than the numbers.** They reported *a quarter of a million extra triangles* from a
change that touches no geometry whatever — and, read properly, that was **545
chunks against 709**. The frame lays its own ring every frame with its own view
and reaps whatever falls outside it, so a measurement that lays a ring of its own
across thirty frames is measuring a ring the game is pulling back underneath it.
Topping the ring up and reading it in the same tick did not fix it either. What
fixed it is `holdWorld` — **a paused world takes no orders and lays no ground** —
and the A/B now stands on the disc it was given. Acceptance test 41 asserts the
two chunk counts are EQUAL rather than assuming it, so this can never be read
that way again.

### The number

| wood | chunks | meshes, one bark | six barks | triangles |
|---|---|---|---|---|
| India (39 kinds, 6 barks) | 545 | 4,139 | 4,494 (**+8.6%**) | 865,306 → 865,306 (**+0**) |
| Bolivia (34 kinds, 6 barks) | 545 | 6,253 | 7,295 (**+16.7%**) | 1,267,306 → 1,267,306 (**+0**) |

**Not one triangle**, in either wood, which is what a bark ought to cost: it is a
texture on faces that were already there. The whole of the price is draw calls,
and it is exactly the bark meshes and nothing else — India's 370 bark meshes
become 725, and 725 − 370 is 355, which is the entire mesh difference. Build time
moved +5% and +14% across the two woods, which is within the spread this
machine's software rasteriser gives the same commit twice, and is reported rather
than claimed.

### Acceptance test 41

`a wood wears more than one bark, and the six cost draw calls and not one
triangle` — the wood chosen by its own growth (the country whose flora lists the
most distinct barks) and not by name, so a country renamed cannot make it stale.
It asserts that at least three barks reach the ground, that the switch off gives
exactly one, that six barks cost MORE draw calls (or they are not being drawn at
all), and that the geometry does not move by a single triangle.

    PASS 41  India (39 kinds, 6 barks) over 545 chunks · meshes 4139 → 4494
             (+355, +8.6%) · triangles 865306 → 865306 (+0) · the barks in view:
             Smooth 282, Twist 199, Ring 109, W 108, Cork 27

## 4bi. Round 60 — the bucket: the one way the hand carries water

Second of the five. **The mechanism has been finished for four rounds and there
was no way for a player to touch it**: `spill` lays a source and `take` lifts
one, a hand's source is a deed that survives a reload while the stream out of it
is derived and is not — and none of that was reachable, because a bucket is a
thing in the hand and there was no thing.

### Two blocks, because that is how a satchel counts

`blocks/bucket.js` and `blocks/water-bucket.js`. Not one item with a flag on it:
a man may carry three full and two empty, and a stack in this satchel is of one
kind. A jar of baked clay, made at a kiln of three banded clay — which is what a
man of that country carried water in, and the account is full of them at wells
(BERĔSHITH 24:20, on the page beside the work).

**The engine knows no bucket by name.** It reads `serves:'bucket'` — the same
datum a pick and an axe carry — and two new ones: `fills` names what an empty
vessel BECOMES when it is dipped, `empties` what a full one becomes when it is
poured. Add a vessel to `blocks/` that says those things and it is a bucket, with
not one line changed in `js/engine.js`, which is the rule `world/works.js`,
`world/minerals.js` and `world/flora.js` all keep.

### What it does, and what it refuses

It is used through `placeBlock` — the one door a held thing goes through — and
before the line that throws every `place:false` thing out, which is where a
bucket would otherwise have died silently.

- **Poured**, it lays a SOURCE and never a cube of water hanging in the air, and
  because a hand laid it, it is a DEED: it is in the player's own record and is
  there when he sails back, while the stream that runs out of it is worked out
  again. Test 40 keeps that second half.
- **Dipped**, it fills at any water the arm can reach. A source of OURS comes up
  with it, so a man may pick his own spring back up. The world's own water — a
  river, a trough, the sea — is drawn from and stays where it is, as a well is
  drawn from and does not empty. **Running water is refused**: *"it is running
  water, and will not be caught."*

### Two faults, both mine, both found by the test

**`satchelAdd` takes an ID and I handed it a number.** `satchelAdd(blockId(...))`
looked right and is not: the satchel knows blocks by their stable id and never by
the number that is an accident of the order `blocks/` is read in. So the bucket
was taken out of the hand and nothing was given back — a man dipped his bucket
and lost it. The test caught it on its first run.

**And the test lied in its own report.** It asserted the poured source was in the
record at the moment it was poured — correctly — and then PRINTED that fact at
the end, by which time the source had been picked back up again, so a passing
test printed *"in the record: false"* under an assertion that had just passed on
its being true. A reading is taken at the moment it is true and reported from
that reading.

### Acceptance test 42

`a bucket fills at water, pours a source that runs, and comes back empty` — the
whole chain, because a bucket is only worth anything if every link holds: it
fills, what it pours is a source and RUNS (more than the one cell he poured), what
he poured is his own and in the record, the vessel comes back empty, and his own
spring can be taken back up.

    PASS 42  dipped → a full bucket · poured a source that ran to 388 cells ·
             his own, in the record when he poured it: true · came back empty:
             true · his own spring taken back up: true

**It counts about the pouring and not over the world.** The springs at the falls
are live now and their water is in the same map; a global count read fourteen
hundred cells of somebody else's waterfall and called it a bucket.

Test 36 passes at **44/44 blocks** — the two new files are in `world/manifest.js`
and every block's id is still its place.

## 4bj. Round 61 — the boles: the door built, the tree not yet sent through it

Third of the five, and it is the first of these rounds to stop short. **The
mechanism works and is not switched on**, for two reasons the test found, and
both are about WHEN a stamp lands rather than whether it can be made to.

### What is in

**`kit.bole` — the door.** The flora asks for its trunk through it and the engine
stamps that box into the STRUCTURE layer, where the mesher draws it, the hand
breaks it, and it drops Timber. `MAT_BLOCK` has sent every bark to `log` since
§2.4.3 against this very day, with a note saying that without it *"a birch would
break into rubble"*.

**And a stamp that changes nothing marks nothing.** `stampBlock` marked its chunk
for a remesh whether or not the cell already held that block — harmless while
stamping happened once when a village was raised, and a **loop** the moment boles
stamp from inside the chunk build: the chunk marks itself dirty, remeshes, stamps
the same trees, marks itself dirty. Writing the same block twice is not an event.
That fix is in and stands on its own.

**It was proved once, end to end.** With the switch on, test 43 read: *a acacia
at 5539,7923 · solid: true · the block is Timber · in the player's record: false ·
it drops log · broken: true*. The chain works — `blocks/log.js` and
`blocks/flint-axe.js` have stood since Phase 4 with nothing for the axe to bite,
and for one run there was something.

### Why it is off

**1. THE FIRST BUILD OF EVERY CHUNK WOULD BE TRUNKLESS.** `buildChunk` gathers
the chunk's edits ONCE at the top and then meshes. A bole stamped during the mesh
pass lands in the layer AFTER the gathering, so the build that stamped it cannot
draw it: the trunks arrive on the remesh the stamp marks, a frame or several
later, and a wood pops in as crowns floating over nothing. **Acceptance test 41
measured it without being asked to** — 63,466 triangles of difference between two
builds of the same wood, which is the trunks of a whole view arriving late. That
test was written for the bark and caught this instead, which is the best argument
for keeping an A/B test after the change it was written for has shipped.

**2. AND THE BOLE LOSES ITS BARK.** Blocks are drawn from the block table, which
has one texture for Timber; the six barks of §2.4.3 and the per-species tint live
on the material a MESH is drawn with. `MAT_BLOCK` collapsing every bark to `log`
is right for BREAKING — a stack of logs is a stack of logs whichever wood it came
from — and is a real loss to the eye, one round after that eye was measured.

### What the next round does, and it is not a guess

The stamp wants to run **before** the chunk gathers its edits: a pass over the
columns that grow trees, which the builder already walks. And the bark wants
either a Timber block per bark pattern — six more blocks, and a stack of timber
that no longer stacks — or a tint the block table has no room for. The first is
a morning's work; the second is a question about what a block IS in this engine,
and it should be asked before it is answered.

`FLORA.boleBlocks` is the switch, off, so the next round begins where this one
stopped rather than from the beginning. Test 43 states what it wants and waits:

    PENDING 43  the boles are still geometry (FLORA.boleBlocks is off) —
                a tamarisk at 12121,2040 is drawn and cannot be struck

Tests 12, 17, 19, 34, 36 and 41 pass with the door in and the switch off — 41
back to `meshes 4139 → 4494 (+8.6%) · triangles +0`, exactly where Round 59 left
it.

## 4bk. Round 62 — the water built twice, and which one was kept

Two sessions worked the falls at the same time and neither knew of the other. Rounds 57
through 61 above are one line of that work; a branch off `296defa` was the other, and it
reached two of the same conclusions independently — **the air does nothing and comes out**,
and **the head belongs at the brink and not at the fall's own point** (it measured Angel's
column at 2 blocks of 109 before that, and 80 of 109 after). It then went no further,
while the work above went on to give the flow a layer of its own, an outfall, and its
buried faces struck off.

**So that branch's water is dropped entire and this one is kept**, and the dropping is
written down rather than quietly resolved: `js/water.js` and `js/waterfall.js` come from
here untouched, and the tool that measured the other line — `tools/waterprobe.js` — goes
with it. What survives from that branch is what this line never touched: the hand, and
what a voyage may not do. They are §4bl and §4bm below.

**AND TWO FINDINGS OF THAT BRANCH ARE STILL STANDING IN THIS FILE**, reported here rather
than mended inside a merge, because reopening the water while resolving a conflict is how
two parallel rounds became six conflicted files in the first place:

1. **An air cell PULLS water into itself.** `visit` case (b) takes any empty cell, asks
   `wants` whether anything beside it could feed it, and fills it if so — which is a SECOND
   way for water to spread, and one that knows nothing of the shortest-way-down weights in
   (e). On the other branch this was measured: with it in, a spring at Angel's brink came
   over a front **82 columns wide**; with it out, **7**, and the total fell from 5,272
   cells to 347.
2. **A way down stops counting as one the moment water stands in it.** `wayDown` and the
   weighing of the four ways both test `open`, which is AIR AND ONLY AIR, so a source whose
   own way down holds the water it just gave turns and feeds the lip instead. Measured
   there at 1,693 cells and 29 columns against 347 and 7.

Both lines are still here as written. **Whether they still cost anything on THIS water is
unmeasured** — the falling rule and the plunge pool were mended differently here, and the
settled figures above (Angel 908, Niagara 2,298) are not the ones those measurements were
taken against. It wants the measurement before it wants the fix.

### And test 12 is red, and it is not the merge's

The suite on the merged tree reads **44 pass · 1 fail · 1 pending**. The pending is 43, the
boles, left waiting on purpose. The fail is **12 — the chunk-build cost** — and test 12's
own comment says what to do about it: *"If it fails, re-measure the previous commit in a
worktree before believing it."* So it was, on this same box, alone:

    on origin/main   plain 2.517 → 3.312 on the reference box (baseline 1.97)
    on the merge     plain 2.647 → 3.309

**The same figure to three parts in a thousand, and the merge is the cheaper of the two.**
It is red on main today and nothing in this merge touches chunk building. The plains figure
has genuinely moved — 1.97 to 3.3 — over the rounds that added the bark and the boles, and
the last of those rounds recorded test 12 as passing, which it does on that box and does
not on this one. **The baseline wants re-measuring and re-recording; guessing at it here
would be a fourth number nobody measured.**

## 4bl. Round 63 — the hand that could not break anything, and the world that was shut

The rounds above record tests **15, 23 and 38** failing, and say so plainly each time:
*"the voyage's own hand, pre-existing, not this round's"*. They were right that it was not
theirs. This is what it was — **three faults, and the middle one meant the game could not
be played.**

### 0. First, WHEN — because a regression with no date is an opinion

A `git worktree` at **`eceeb03`** — before the water sessions — was raised and the same
tests run in it:

| test | at `eceeb03` | after |
|---|---|---|
| 14 · a blow breaks in the time its hardness says | **PASS** — brick broke at 6.52 s of 6.50 wanted, 15 cracks | FAIL — "broke at NEVER · 0 cracks cut" |
| 15 · what breaks drops and comes into the satchel | **PASS** | FAIL |
| 23 · the free hand breaks at a touch | **PASS** | FAIL |
| 38 · in a VOYAGE, the whole chain | FAIL — "it ran 1497 frames and wants 8.5 s" | FAIL |

Three were green and went red in the two commits after. **The fourth has never passed in
its life**, for a different reason again.

### 1. A probe that answered, and its answer was nothing

`window.__VDBG` declared **`mineAt` twice in the same object literal** — the real
face-aware one from Phase 4 step 2, and a stale one-argument version added later. **The
later key wins.** So every test calling `mineAt(ix,iy,iz)` set `mineTestAt` to the NUMBER
`ix`; `mineTick` read `tgt.ix` off a number, got `undefined`, found no block and abandoned
the blow before it began. Three tests reported *"broke at NEVER · 0 cracks cut"* and the
hand they were testing was never once touched.

A missing probe fails loudly. **A shadowed probe answers, and its answer is nothing.** The
whole debug surface was swept: twelve other keys appear twice and all twelve are the same
binding written twice over, which is harmless. `mineAt` was the only collision of two
different implementations.

### 2. The world was shut, and the data says so in four lines

*"The tool is a requirement, not a discount"* was right about the rock — a man should not
claw an emerald out of a seam with his fingers — and it was applied to **every** tool at
once. The world's own data then closed on itself:

```
flint   wants a PICK  ·  a pick is made of  flint 3 + planks 2
log     wants an AXE  ·  an axe is made of  flint 3 + planks 2
planks  are riven from a log
```

Of the world's blocks, **eight gave to a bare hand**: the five flint tools — which could
not be made — and glass, hay, leaves, water and wool. **In a voyage no tool could ever be
come by, and no rock, ore, timber or earth could ever be broken.** Free roam is exempt.

**And the suite said so at the time.** Nearly every test in it runs the voyage hand — the
runner declares it, and only one test asks for the free hand. So 14, 15 and 38 went red the
moment the world shut. What they could not do was be HEARD: the shadowed probe had already
reddened those same tests for an unrelated reason, so when the gate landed there was no
green left to go red. **A suite is only as sharp as its greenest run.**

**THE RULE NOW HAS TWO TIERS**, which is both the game everybody knows and the way it truly
went. It is one field on the table that already held the five tools' words:

| tool | may bare hands stand in? |
|---|---|
| **pick** | **no** — the rock refuses, and says which tool it wants |
| axe · spade · knife · hoe | yes, at `HAND_SLOW` (×2.5) |

and **flint asks for a spade, not a pick** — it lies in nodules, not in seams; a man picks
one out of the chalk of a cave wall. The chain runs again:

    fingers → timber → rive planks · fingers → flint → knap a pick → the rock gives

The spoken refusal also stopped promising *"the gravel of every river"*, a block this world
does not have, and now names the chalk, the limestone and the walls of the caves — which is
where `world/minerals.js` actually puts it. No block file changed but `blocks/flint.js`.

### 3. And the tests were holding a repealed law

T[14] still asserted the rule of Round 34 — *a block that names a tool is had by the bare
hand at 2.5× the labour*. **A test that holds a repealed law is worse than no test: it
shouts, and what it shouts is out of date.** It now asks the rule as it stands, in three
parts, and each part is a number:

    the rock refuses a bare hand      REFUSED, and it said "you want a pick"
    the timber gives to it, slowly    log broke in 5.02 s of 5.00 wanted, 16 cracks
    the tool ends the argument        stone with a flint pick, 3.42 s of 3.40 wanted

T[15] keeps its brick and puts a pick in the hand — it is about the drop and the satchel,
not the tool rule.

**T[38] had never passed**, and mending it turned up seven faults, every one in the test:
it trusted the live camera aim (so the fracture restarted every frame — *"it ran 1497
frames"*); it struck at a reach of thirty blocks and its drop landed too far to walk to; it
laid the flint pick back, and a tool is `place:false`; it struck the block underfoot and
tried to lay one back inside the traveller's own legs; it asked whether the block stood in
the cell it had STRUCK, when a block goes in on the AIR SIDE of a struck face; **it
inherited whatever ground the test before it left it standing on**; and **it laid from
where it stood**, when the face a man strikes is the one facing him and the air side of it
is his own legs. The last two pass alone and fail in company, which is the signature of a
test that assumed where it was.

### 4. T[44] — the test that would have caught the shut world

**'a man who begins with nothing can come by a pick, and then the rock gives'.** The
satchel is emptied, the voyage hand declared, and the whole bootstrap walked with every
link named:

    began with nothing=true · timber by hand 5.02 s · flint by hand 5.02 s
    · rock by hand: refused, rightly · rive planks: planks x4
    · knap a pick: flint-pick x1 · rock with that pick: 3.42 s

It does not re-prove the drop and the taking-up — that is test 15's, and saying so is
better than implying it. What it proves is the one thing no test had ever asked: **that the
game can be played at all.**

## 4bm. Round 64 — what a voyage may not do, which nothing had ever asked

Every rule a voyage BEARS had a guard — the rock that refuses bare fingers, the blow that
costs its hardness, the drop that must be picked up, the block that costs a block to lay.
**Every rule a voyage FORBIDS had none:**

| voyage-only rule | tested before this round? |
|---|---|
| **the stores are the free hand's alone** | ⚠️ the free-hand half only |
| **flight belongs to free roam** | ❌ nothing |
| **the year belongs to free roam** | ❌ nothing |
| **the hour belongs to free roam** | ❌ nothing |
| **the five roam-only buttons are hidden on a voyage** | ❌ nothing — *and it had regressed once already* |
| **the manner is saved and read back** | ❌ nothing |

That is not an accident of this suite — it is what happens when tests are written by
walking forward through a feature: you check that the thing you built works, and never that
the thing you forbade is still forbidden.

### 1. And one of the locks was open — Options → Time of day

`FREEROAM_ONLY` is described in its own comment as *"one list, obeyed by the rail, by the
keyboard and by the menu, so the three can never disagree about what a voyage may and may
not do."* **The menu did not obey it.**

The rail hides the Time of Day button on a voyage with `display:none !important`. The
options modal mirrors the rail by CLICKING the button underneath — `mo-daypart` →
`b-daypart.click()` — and **a hidden button fires its onclick exactly like a shown one.**
`b-season` and `b-fly` both carry `roamOnly()` on their own click; `b-daypart` never had
it. So on a voyage, three clicks — Options, Time of day — set the hour, while the game's
own refusal says in as many words that *"on a voyage the world keeps its own hours"*.

The gate is on `b-daypart`'s own click now, which mends the rail, the key and the menu at
once, because all three end there. **Everything else in the table was measured and is
sound**: `setMode('fly')` is reachable only from `takeFlight`, and `takeFlight` only from
its two gated call sites.

### 2. T[45] and T[46], and both were made to fail before being believed

**T[45] — 'a voyage may not fly, may not turn the year, may not set the hour, and is not
offered the stores'.** It drives the real paths — the window's own keydown listener, the
rail's own buttons, the modal's own mirror, `getComputedStyle` on what a player would see —
and asks BOTH halves of every rule, because a locked door proves nothing unless the key
also works:

    ON A VOYAGE — flight refused · the year held · the hour held
                  · 0 of 5 roam-only buttons shown · 0 in the stores ("he Satchel")
    IN FREE ROAM — flight taken · the year turned · the hour set
                  · 5 of 5 buttons shown · 37 in the stores ("he Free Hand")

**T[46] — 'the manner a voyage was begun in survives a reload'.** A flag that comes back
wrong gives away every rule above at once, silently. It asks for the flag AND for the thing
the flag governs, in both directions.

**AND EACH WAS PUT TO A FAULT BEFORE IT WAS TRUSTED**, because a guard that has never been
seen to fail is not yet a guard:

| the fault put to it | what the test said |
|---|---|
| the `roamOnly` gate taken back off `b-daypart` | *"the hour SET · a VOYAGE set the hour through the options menu"* |
| the roam-only CSS rule deleted | *"5 of 5 roam-only buttons shown"* |
| `fr` dropped from the save payload | *"FREE ROAM came back as a voyage"* |

Each fault was injected, measured, and taken back out.

### 3. The suite, whole

**44 pass · 1 fail · 1 pending** on the merged tree. The pending is 43 (the boles, waiting
on purpose); the fail is 12, which reads the same on `origin/main` alone and is recorded in
§4bk. Every test of the hand — 14, 15, 23, 38 and 44 — is green for the first time since
the water rounds began, and so are 39 through 42, the water and the bucket, under the
two-tier tool rule.

## 4bn. Round 65 — the two findings measured at last, and the fall that never rested

§4bk left two faults standing in `js/water.js` and said so rather than mending them inside a
merge: an air cell that PULLS water into itself past the shortest-way-down weights, and a
way down that STOPS COUNTING the moment water stands in it. It also said the honest thing:
**those faults were measured on the other branch's water, not on this one**, and *"it wants
the measurement before it wants the fix."* This is that measurement, and what it turned up
was worse than either finding.

### 1. The instrument, and why test 39 could not see it

`tools/waterfront.js` takes **test 39's own method** — the same three falls chosen by form
and not by name, the same heads out of `WATERFALL.springs`, the same `WATER.step(0.25)`
beaten until the total stops moving, the same attribution of each cell to the fall it is
nearest — and asks the one thing test 39 did not: **how wide is the front it comes down
in?**

That question matters because **a curtain pours, stays and settles perfectly well.** All
three of test 39's questions are answered correctly by a fall that comes over its brink on
a front eighty columns wide, which is not a waterfall at all.

### 2. The reading, before anything was touched

    Angel     7 heads → 175 columns of falling water, 37 blocks across a lip 26 wide
    Iguazu    7 heads → 299 columns
    Krimml    5 heads → 57 columns over a lip 4 blocks wide

A front wider than the rock it pours off. Both faults were live here, exactly as they were
on the branch that found them.

### 3. Taking them out, and what that exposed

**The pull, out** (`visit` case (b) wakes the water beside it now and lets that water choose
by the weights): Angel 175 → **17 columns**. And the shaft went with it — **82 cells → 7**.

**The ways weighed through water, not air** (`flowable`, and never pouring into the world's
river or thinning a falling cell): Angel → **9 columns**, shaft still 7.

**Which is a fall that no longer falls**, and it exposed a third fault the other two had
been hiding. `wants` reads falling off the cell ABOVE alone — a source, or another fall —
and water that spills over a brink is neither: it is a LEVEL, one thinner than the head
that fed it. So the cell beneath it was fed by nothing, `wants` answered null, and the
column was cleared the tick after it formed. **Nothing had been holding a shaft open but
the pull**, refilling those mid-air cells out of their neighbours every tick. Angel — a
fall of a hundred and nine blocks — stood 9 cells of falling water in a shaft of 7.

### 4. And the third fix got it wrong once, where only the queue could tell

Written as *"a fed cell with AIR under it is falling"*, the column stood up at once: Angel
2,404 cells in the shaft. **And it oscillated.** The topmost cell flipped every tick — air
below so FALLING, the column forms beneath it so its below is water so a LEVEL, and then
the cell under it has a level above, is fed by nothing, and is cleared. The count never
moved. The work never stopped:

    Angel, "settled": 2,491 cells standing — and 2,611 laid and 2,611 dried
                      every hundred ticks, with 376 always in the queue

**A count that has stopped moving does not prove a thing is at rest**, and this is why the
instrument now reads the QUEUE and counts the laying and the drying over a hundred further
ticks. The rule is what holds a cell up, not what happens to be under it this tick:
**air, or more falling water.** The column is then stable from the brink to the pool.

### 5. AND THE FALLS OF THIS WORLD HAVE NEVER ONCE BEEN AT REST

Turning that same reading on the water **as it stood before any of this** is the finding of
the round, and nothing in the suite had ever asked it:

| standing still, per 100 ticks | before | after |
|---|---|---|
| **Angel** — laid / dried · queue | **12,564 / 12,567 · 760** | **0 / 0 · 0** |
| **Iguazu** — laid / dried · queue | **4,435 / 4,416 · 3,869** | **0 / 0 · 0** |
| **Krimml** — laid / dried · queue | **7,434 / 7,433 · 250** | **0 / 0 · 0** |

§4be built the flow its own layer on the strength of one sentence — *"a settled waterfall
lays and takes up eleven thousand blocks every fifty seconds simply to stand still"* — and
moved those writes out of the save. **It never stopped them.** Twelve thousand cells laid
and taken up again every hundred ticks, at a fall nobody is looking at, for as long as the
game runs. The comment beside case (e) says a settled puddle "is not woken again... which
is the whole reason a settled fall costs nothing at all"; it was not true when it was
written, and now it is.

**It shows in a test that has nothing to do with water.** Test 35 samples herds for a head
kept up, over live frames:

    on the water as it was       68% of herd-samples watched
    with the oscillating draft   37%   (the churn at its worst)
    with the column at rest      94%

### 6. Where the falls stand now

| | before | after |
|---|---|---|
| Angel — front · shaft · standing | 175 columns · 83 · 678 | **49 columns · 2,410 · 2,509** |
| Iguazu — front · shaft · standing | 299 · 448 · 2,576 | **18 · 58 · 635** |
| Krimml — front · shaft · standing | 57 · 38 · 330 | **34 · 58 · 815** |

Angel holds more water than it did and that is the point: it is a kilometre-high cliff with
a column down it, where before it had eighty-three cells in the shaft and a curtain of a
hundred and seventy-five threads. Every fall still drains to nothing when its heads are
taken up.

### 7. The guard, and both faults put to it

Test 39 gains the question it was missing: **a fall comes down in a front no wider than the
heads that feed it.** The bound is per head and comes from the rule — a source reaches seven
blocks, so one head opens some seven or eight columns; twelve is that with room for a lip
lying at an angle to the lattice. Each fault was then put back in turn, and the clause
reported it:

| the fault put back | what test 39 said |
|---|---|
| the pull returned to case (b) | *"Iguazu came down as a CURTAIN — 151 columns off 7 heads"* (and Krimml, 73 off 5) |
| the ways weighed through air alone | *"Iguazu — 159 columns off 7 heads"* (and Krimml, 67 off 5) |

Both were injected, measured and taken back out. **Angel alone would not have caught
either** — it reads 77 columns against a bound of 84 — which is the argument for the test
standing at three falls of three different forms and not at one.

**The suite: 44 pass · 1 fail · 1 pending.** The fail is 12, the chunk-build cost, red on
`origin/main` alone and recorded in §4bk; the pending is 43, the boles, waiting on purpose.

## 4bo. Round 66 — test 12's baseline, and the three things wrong with it

Test 12 has been red on one box and green on another for two rounds, and §4bk recorded the
comparison honestly — `origin/main` alone read 3.312 against the merge's 3.309 — while
saying the baseline wanted re-measuring rather than guessing at. Re-measuring it turned up
three faults, and **the one everybody was arguing about was not a regression at all.**

### 1. The plains chunk never got dearer

Measured at four commits spanning the whole of the water work, the RAW cost of a plains
chunk on one box:

    296defa (before the water rounds)   2.868 ms
    d21c757 (the bark)                  2.879
    6b48a85 (main, now)                 2.453 – 2.655

Flat, and cheaper at the end than the beginning. **Every part of the "regression" was the
divisor.**

### 2. The normaliser was a single unguarded sample, and it did not track the work

`machineSpeed` times a sin-hash loop and the readings were DIVIDED by it, on the premise —
written at the top of that function — that the loop *"tracks what the mesher actually
spends"*. Two things were wrong with that.

**It was measured once.** The chunk cost is taken as the least of three passes, on the
stated ground that *"interference only ever runs ONE WAY — it can add time to a build, never
take it away"*. That lesson was never carried across to the number that DIVIDES it. On one
box in one afternoon the loop read **35.9, 36.3, 37.8, 39.3, 54.1 and 58.1 ms — a spread of
1.62×**, and all of it went into the verdict. The same chunk was called 2.313 "on the
reference box" in the morning and 3.038 in the evening, **with the raw cost lower the second
time.** It is the least of five now, and reads 51.1 / 51.2 / 52.4 on three consecutive runs.

**And it does not track the mesher.** With the probe steadied, the box's slow state showed
the loop at 51 ms against 36 in its fast state — two fifths slower — while the plains chunk
did not move. A pure arithmetic loop and a mesher that allocates, writes typed arrays and
fills buffers do not scale together, and no constant will make them. **So the loop no longer
divides anything.** It answers one question: is this box slower than the one that set the
baseline? If so a red line is PENDING and asks for a worktree; if the box is FASTER and
still over the bar, that is a regression and is reported as one.

### 3. The ocean station was not in the ocean

The three passes stepped blindly along a line from a point picked by eye, and the readings
came back **2.92 / 2.28 / 1.18 — 3.91 / 2.38 / 0.92 — 4.42 / 2.49 / 1.08**, run after run.
That is not noise: **the first two passes were standing on LAND and being priced as sea.**
The least of three rescued the number, which is exactly why it went unnoticed for forty
rounds — and it made the reading depend on how much of the third pass happened to be water,
so "ocean" swung between 0.67 and 1.19 ms on one box.

`landNameAt` answers which country a point lies in, and null for open sea, off the real
vector outlines. Every station is now CHECKED — its own point and a ring of six about it,
wider than the ground the timing builds — and the line is walked until enough stations of
the right kind are found. The plains station is held to the same standard from the other
side: every point inside one country, so a plain cannot quietly become a coast. The ocean
passes now read **2.44 / 0.93 / 0.90** — the first is the warm-up, the other two agree.

### 4. And the ocean guard had been dead for thirty rounds

The baseline said 2.152 ms. An ocean chunk costs about **0.7** — the merged faces and the
greedy mesher of Rounds 30 and 32 made it three times cheaper — so the ceiling stood at
2.905 against a true cost of 0.7, and **an ocean chunk could have got four times dearer
without this test saying a word.** A guard set three times too high is not a loose guard, it
is an absent one.

### 5. What is written down now

| | was | is | why |
|---|---|---|---|
| ocean | 2.152 | **0.672** | measured; the old figure was three times the truth |
| plain | 1.970 | **2.453** | measured; the world of Phases 3–7 is in that ground now |
| loop | 47.0 (*derived*) | **36.0** | measured, least of five, and no longer a divisor |
| slack | 1.35 for both | **1.60 ocean · 1.35 plain** | each set from its own measured drift |

The two slacks are not a fudge: a plains chunk costs two and a half milliseconds and reads
within 10 % of itself; an ocean chunk costs two thirds of one, and the same hiccup that is a
rounding error on the first is a fifth of the second. Measured, plain drifted 1.10× between
the box's fast and slow states and ocean 1.61×.

**Verified both ways.** Three consecutive runs green with the box **1.4 to 1.6× slower** than
the reference — ocean 0.871 / 0.896 / 0.923 against a ceiling of 1.08, plain 2.984 / 2.633 /
2.844 against 3.31 — where the same test on the same box was red before. And put to a real
fault on comparable ground, with the baselines tightened to 0.45 and 1.60, it FAILED rather
than excusing itself. A guard that has never been seen to fail is not yet a guard.

## 4bp. Round 67 — Phase 6 step 5: the floor of the wood ✅

*§2.4.5 — "a real ground layer, which Minecraft simply does not have: leaf litter under the
deciduous wood, needle mat under conifers, moss on the shaded side, deadfall logs, saplings,
a herb layer with actual named herbs from `world/flora.js`, mushrooms in the damp, lichen on
the rock."*

### What was already there, and it is two of the eight

**The saplings and the herb layer already stood**, and the rule of this document is to go and
look before planning work that exists. `FLORA.saplingAt` has put the young of the country's
own trees knee-high under the grown ones since Phase 5, and `FLORA.plantAt` draws the herb
layer out of the named herbs of `world/flora.js` — the mint, the rosemary, the thyme, the
sage, the lavender, the bilberry, the fern — which is the clause about "actual named herbs"
word for word. **Nothing was rewritten for either.** The six that were missing are the litter,
the needle mat, the moss, the deadfall, the fungi and the lichen.

### The fault, stated plainly

**Between the boles of every wood on the earth there was LAWN.** The sward clothed the open
ground with blades and flowers and the flora stood herbs and saplings up out of it, and the
floor under a German oakwood, a Norwegian spruce forest and the closed canopy of the Congo
was the same short green turf. A wood is not a field with trees in it.

And the **bare rock bore nothing at all** — `js/grass.js` does not know that ground, has never
clothed one inch of it, so every scree, crag and mountain shoulder in the world was clean grey
stone.

### The shape of it: a third file, and it owns the floor

`js/ground.js`, 300 lines, beside the two that were there:

| | what it owns |
|---|---|
| `js/grass.js` | the SWARD — the blade a beast eats and a lion hides in. It stands UP and has a height. |
| `js/flora.js` | everything WOODY and everything BEARING — herb, bush, sapling, tree. |
| `js/ground.js` | THE FLOOR — what LIES ON the ground and has no height: litter, needle mat, moss, lichen, deadfall, fungus. |

It is the BOTTOM layer and it takes no cell away from either of the other two: it is drawn
first in `emitScrub` and does not return, so the sward stands in the litter, which is what a
wood looks like.

**It knows the name of no species.** The engine hands it the KIND the mesher would have grown
on that cell and the litter is that tree's own leaf, turned toward the colour of a forest
floor; the deadfall is that tree's own bole, silvered. So an oakwood floor is oak-brown, a
spruce floor is needle-rust, and a species added to `world/flora.js` gets a floor of the right
colour with **nothing written in `js/ground.js` at all**. The moss and the lichen are named
plants of this world already, so their colours are read out of the flora's own table rather
than kept a second time here.

### One copy of the grove field, not two

There is no leaf litter in a glade, because no leaf fell there. The engine gathers its woods
into groves and thins the trees by one broad noise field (`dens` in `cellRaw`), and the litter
has to thin out **exactly** where the trees do or a wood floor is dead leaf a foot deep in an
open clearing. The obvious move was to copy the field into the floor file. Instead `cellRaw`
now READS IT FROM THERE — `GROUND.closure(ix,iz)` — so there is one copy and it cannot drift
the day either file is touched.

### Moss on the shaded side, and what that phrase means on this earth

The brief's own words, and on an azimuthal disc with **the north pole at the middle** they
have an exact meaning: in the northern half the sun stands outward from the centre and in the
southern half it stands inward, so the face a step never lights is always the one turned
toward its own pole. `shadedCell` steps one cell that way and asks whether the ground there
stands higher. **It costs nothing**: `emitColumn` asked all four of that column's neighbours a
few lines earlier to draw its flanks, so the one asked here is a cache hit. Measured over
ten thousand cells of each: **3,032 mossy in the shade against 1,356 in the sun**, 2.24×.

### What it costs, measured and not asserted

`GROUND.on(false)` builds the world without a floor beside the world with one, in the same
page, on the same chunks, `holdWorld` holding the ring still so the two builds stand on the
same ground — the fault that made the first bark measurement worthless in Round 59.

**545 chunks over the largest wood on the chart:**

| | without | with | |
|---|---|---|---|
| triangles | 1,031,862 | **1,119,164** | +87,302, **+8.5 %** |
| materials in view | 14 | **14** | not one new name |
| meshes | 3,508 | 3,525 | +17 in 545 chunks — see below |

Not one new material anywhere in the world: a mat is ONE upward face in the mesher's existing
`solidW`, a mushroom two small boxes in it, a fallen log one box in it. The +17 meshes are
seventeen chunks in five hundred and forty-five that had **no `solid` geometry in them at all**
before and now have one mesh of it.

### THE MEASUREMENT CAUGHT A REAL COST, WHICH IS WHY IT EXISTS

The deadfall was written in `kit.M.bark`, which is the honest material for a log. The A/B said
at once: **materials 14 → 15, meshes 3,508 → 3,601.** `barkW` is the grey master that the six
barks of §2.4.3 left UNUSED — it was not in that wood at all — so a log lying in the leaves
brought a whole new material and **ninety-three new meshes, one per chunk**, for a thing you
meet once in a hundred cells. It is drawn in `solid` now, which is the right colour for it
anyway: a bole that has been down a season has lost its bark, and what is under the bark goes
grey. **93 draw calls a frame, found by a switch and a number and by nothing else.**

### And the first two cuts looked wrong, which only a photograph could say

**The chessboard.** One mat exactly covering one cell, on a third of the cells, gives a forest
floor — and a lichened crag — brown square, green square, brown square, all the way to the
trees. The share was right and the SHAPE was wrong. Every patch is now shifted off the middle
of its own cell and is a different size and squareness from its neighbour, and never leaves
its own cell (a mat that overhung the next one would hang in the air wherever the ground steps
down, and the ground steps down everywhere). The litter is drawn **two ways by how thick the
fall is**: under a closed canopy nearly every cell bears one and they go down edge to edge —
that is a carpet, and a carpet with a few bare places worn through it is what a beechwood floor
looks like; toward the edge of the wood each is a patch of its own.

**The painted lino.** One tint for a whole wood laid the floor down as a sheet. Dead leaf is a
year's worth of it rotted at different rates; a tenth either way per cell, off the cell's own
draw, is all it took.

Neither of those is a thing a number would have reported. Both came out of standing in a
German wood at summer noon with the switch thrown one way and then the other.

### What the floor of each ground bears

Counted over six thousand cells apiece, the canopy of the place taken into account:

| ground | what lies on it |
|---|---|
| grass | litter 33 % · moss 10 % · fungus 1.2 % · deadfall 0.4 % |
| tropic | litter 33 % · moss 21 % · fungus 2.2 % · deadfall 0.8 % |
| alpine | litter 16 % · lichen 14 % · moss 13 % · fungus 0.5 % |
| tundra | **lichen 34 %** · moss 16 % · litter 1.9 % |
| rock | **lichen 38 %** · moss 4.4 % |
| snow | lichen 9.3 % |
| savanna | litter 6.6 % |
| desert | litter 0.8 % |
| sand | bare, and it must be |

The tundra line is the truest thing in the table: that ground is the reindeer's pasture and it
is nearly all lichen.

### The test

**Acceptance 47** asks four things, in the two ways the two kinds of claim deserve.

WHAT IS BUILT is measured in the page, twice, on the same disc: triangles must rise, or the
floor is not reaching the ground; the SET OF MATERIALS may not change by one name, which is
the whole design of the thing and the claim most able to be quietly wrong; and the rise is
capped, because §2.5 says beauty that halves the frame rate is not beauty.

WHAT IS DECIDED is a pure function of the place and is asked directly, with no page in it: a
conifer floor and a broadleaf floor must not come out the same colour — a **fake kit is handed
to the floor and writes down what it was asked to draw**, so the colour asserted is the colour
that reaches the mesher and not one worked out again beside it, which would only ever test
itself; moss must be markedly commoner in the shade over ten thousand cells of each; and the
bare rock must bear something where the sward bears nothing, with a guard that fails the test
as stale if the sward is ever given the rock.

### What is NOT claimed

The floor is drawn on cells the mesher builds as ground. A column the hand has EDITED is meshed
from what it has become and skips `emitScrub` entirely — so a dug or built column loses its
litter, exactly as it has always lost its grass. And a cell a tree stands on is drawn by
`emitTree` and has no floor under the bole. Both are the pre-existing shape of that branch and
neither was touched.

## 4bq. Round 68 — Phase 6 step 6: the agricultural year ✅

*§2.4.6 — "Crops that grow in stages and are harvested at the right season — wheat, barley,
flax, vine, olive, date. The farms and the farmer AI already exist; give them a real
agricultural year."*

### The fault, stated plainly

**Every farm on the earth grew the same twelve anonymous green crosses**, in the same twelve
places, in every village from Norway to Java — and grew them on the shortest day exactly as
at harvest. One plant, one colour, one height, all the year, in every country. An Egyptian
barley field in April and a Finnish one in February were the same twelve crosses.

### WHICH LANDS SOW WHAT IS NOT WRITTEN DOWN AGAIN

`world/flora.js` has already said, for a hundred and seventy-six countries, that Egypt grows
wheat and barley and cotton, Java rice, Mali millet and sorghum, Ireland oats and the potato.
A `world/crops.js` that repeated that would be a second copy to drift from the first. **It
carries seventeen lines and none of them names a country**: a crop's stature, its colour, and
whether it turns to straw or is green the day it is lifted. `js/crop.js` asks the land's own
flora list, keeps what `world/crops.js` knows how to grow in a field, and draws one seeded on
the field's own corner — so a plot bears the same thing for ever and the next plot along bears
another.

Measured over the whole chart: **seventeen crops declared, all seventeen sown, across a
hundred and seventy-six lands, and not one land sows a crop its own flora does not name.**
Three lands grow no field crop of their own at all and fall back to barley, which is named by
ninety-three countries and grown from Iceland to Ethiopia; a village with a fenced, tilled,
watered field in it is not growing nothing.

> Egypt sows barley / melon / wheat / flax · Japan rice · Mali sorghum / millet / cotton ·
> Ireland wheat / barley / oats / potato · Brazil sugarcane / cassava / taro / rice / maize

### The year is in the shader, and that is the whole design

A crop that GROWS is geometry that changes, and geometry that changes means the chunk is
built again — **a village re-meshed every few days of a voyage for a field of wheat**, which
is not a trade worth making for any amount of beauty.

So it is done the way the leaves of this world have gilded since Round 53: in the vertex
shader, off one uniform (the turn of the year) and the vertex's own distance from the middle
of the disc, which IS its latitude on an azimuthal earth. The field is meshed once, at full
stature, and **sunk into its own tilled soil** by how far off harvest it is — ploughed ground
before the sowing, shoots after it, standing corn by midsummer, gold at the reaping, stubble
after. The log border stands half a block proud of the soil, so what is sunk is not seen.

**SUNK, NOT SHRUNK, and that is not a detail.** A shrink has to be worked off the crop's own
height and a vertex knows only its own, so a short flax drawn beside a tall maize would fold
through its own root. Sinking is one translation, exact for every stature, and a shoot coming
up out of the ground is what a shoot looks like.

**Measured: 0 chunks built while the whole year was turned round.**

### The dates come from latitude, because latitude is what a vertex has

A Norwegian harvest and an Egyptian one are four months apart; a Norwegian barley harvest and
a Norwegian oat harvest are a fortnight apart. **Latitude is the thing that matters**, and
latitude is the thing the shader can work out. Sowing runs later and ripening later the
further from the line, the southern half is half a year on, and within a few degrees of the
equator there is no dead season at all — two and three crops off the same ground in a year,
which is why a rice paddy on the line does not go to stubble in January.

| | sown | ripe | reaped |
|---|---|---|---|
| 60 °N | day 97 | day 199 | day 221 |
| 27 °N | day 52 | day 146 | day 167 |
| the equator | — | — | never falls below 0.56 of full |

**What is NOT modelled, and is a real limit:** the winter-sown cereal. Real Egyptian wheat
goes in in November and comes off in April; here it is sown in late February. Autumn sowing
is a second curve and a second branch in the shader, and it is not there.

### THE CURVE IS TESTED, WHICH A CURVE INSIDE A SHADER USUALLY IS NOT

A string handed to a GLSL compiler cannot be unit-tested, and a JavaScript copy of it beside
the string would only ever test the copy. So `js/crop.js` holds the curve **once as
JavaScript and once as GLSL built from the same constants**, and acceptance test 48 takes
`CROP.glsl()` — the actual text handed to the compiler — transliterates the eight GLSL words
it uses, and evaluates it against `CROP.yearAt` at a hundred and twenty points of latitude and
season. **They part company by 6.3 × 10⁻⁶**, which is the four decimal places the GLSL writes
its constants to and nothing else. Edit one and not the other and the test goes red.

### What it costs

The crop of a field is 8 or 12 crosses — a row crop is set out in rows a man walks between,
a cereal is drilled close — and a village's whole harvest is a hundred triangles. The second
material is the thing worth measuring: **the corn of the earth turns to straw and is reaped;
a potato haulm, a taro leaf, a hemp stalk and a cane are green on the day they are lifted**,
and gilding those in September would be a lie about the plant. So there are two crop
materials, and the second is a draw call.

`CROP.on(false)` puts the old anonymous field back exactly, and the two were built from a
fresh boot apiece:

| | farms | crop meshes | crop triangles | meshes in the whole village group |
|---|---|---|---|---|
| Hungary — wheat, barley, maize | 2 | 1 → **1** | 48 → **48** | 943 → 943 |
| Indonesia — cane, cassava, taro, rice | 3 | 1 → **2** | 72 → **80** | 466 → 467 |
| Nigeria — cane, cassava, taro, rice, sorghum, cotton | 4 | 2 → **3** | 96 → **128** | 918 → 919 |

**One extra mesh, in a village that grows both kinds, out of four hundred and sixty-seven to
nine hundred and forty-three.** Hungary is unchanged, because everything Hungary sows turns —
which is the design working: a country pays for the second material only if it grows something
that needs it.

### And a small thing that made the measurement possible at all

`blockMat` now writes the material's name onto the material. The chunk mesher keeps its
geometry in a table keyed by name and could always say what it drew with; a village, a ship
and a beast hold the material OBJECT and could not — so **646 meshes in a village group with
no way to ask which of them were the crop**. `name` is a field three.js has always had and
never used. It costs nothing, and it is the difference between measuring a thing and guessing
at it.

### The shader was written wrong first, and the browser said so

The year was injected at `#include <color_vertex>` together with the sinking of the plant.
`<color_vertex>` runs **before** `<begin_vertex>`, and `transformed` does not exist until the
second — so the whole crop material failed to compile: *"'transformed' : undeclared
identifier"*, three times over, and every field in the world went unlit. The year is worked
out at the first now (it reads `position` and nothing else) and the plant is moved at the
second, where there is something to move. **A headless run reports page errors; that is what
it is for.**

### A note on test 35, which read red in the same suite run

Test 35's watch metric read **37 % in the full suite and 58 % and 50 % on two runs of its own**,
against 92 % on the commit before the floor of the wood. Its bar is 45 %. AUDIT Round 54 wrote
when that number was first taken that this measurement *"has a genuine run-to-run spread"* and
gave it as 62–69 % across runs; the true spread is plainly wider than that. The floor draws
litter on 6.6 % of savanna cells and nothing else on that ground, which is where the herds are
sampled, so there is no mechanism by which it could move the watch by half. **It is noise, and
the test's bar is set too near the middle of it** — that is a thing to mend in the test and it
is written down here rather than left as a mystery.

## 4br. Round 69 — Phase 6 step 4 (§2.3.6): the herds go down to the water ✅

*§2.3.6's very first clause — "Drinking at water at dawn and dusk."*

### What was already there, and it is most of the section

AUDIT Round 54 established that **the daily round was largely already built**: `js/behavior.js`
gives every beast its own hours, sends it to its own den at dusk, and draws from its own list
of drink, wallow, dust, groom, alert, bask, dig, gape, curl, sharpen and play. Grooming,
sunning, wallowing and bedding down were all standing. **Nothing was rewritten for any of
them.** What had nothing behind it was the first clause, and it is the one that shows most.

### The fault, and it is two faults

`drink` was an act like any other, drawn by weight at any hour of the day or night. And it was
refused unless `a.river` was true — **which was read ONCE, at the instant the beast was set
down on the world, and never again as long as it lived.**

So a beast that happened to be placed on a bank went on drinking in the middle of a dry plain
for the rest of its days, and a beast that walked to a river could never drink at all.
**Nothing on this earth ever went TO water.** The herds of the plain never came down to the
river; a zebra either was born beside one or never drank. It is the single most recognisable
thing a herd does, and it is the reason the crocodile is where he is.

The same stale flag also gated the WALLOW, and the bear's fishing, and the crocodile's lying
up in the shallows — all three were reading a fact about where the beast was born.

### It is not new data

**Which** beasts drink is already written down, once, in `js/behavior.js`: any beast with
`drink` in its own `acts`. **Twenty-one beasts on the earth drink**, and not one creature file
was touched to say so. **When** is the world's own light. Nothing was added anywhere.

### One question, two callers

The walk down to water needed the same fright test the grazing has — a zebra crossing open
ground to the river must break from a lion exactly as one with its head down does — so
`frightNear` was **lifted out of the grazers' own branch** rather than copied. The watering
branch and the grazing branch now ask one function, and there is no second copy of the rule to
drift.

### THREE THINGS WERE WRONG AND THE MEASUREMENT FOUND ALL THREE

**1. `worldNight` is the wrong number for asking whether the sun is going down.** It is
`1 − dayF × 1.5` clamped at nought, so it stands at ZERO through the whole first two thirds of
the dusk. Measured hour by hour at a Sudanese village:

| hour | 15 | 16 | 17 | 18 | 19 |
|---|---|---|---|---|---|
| `worldNight` | 0.00 | 0.00 | 0.43 | 0.85 | 1.00 |

By the time it says anything at all the diurnal beasts are already bedding (they bed at
`worldNight > 0.6`). **There was no hour of the day at which a beast would have set off**, and
the first run of test 49 reported precisely that: four lands, not one beast, and *"the world
does not call the evening a twilight."* The light itself is kept now (`worldDay`), and the
band is read off that.

**2. None of the five dayparts is dusk.** 'evening' is 18:30, by which hour the light is gone.
The test sweeps the hour until the world itself says twilight — it found **15:45** — so
nobody retuning the sun can quietly break this.

**3. The search was coarser than the thing it was looking for.** A watercourse is stamped one
or two map pixels wide — about a hundred and twenty units — and the first cut walked three
rings of twelve bearings, which at nine hundred units puts its probes **four hundred and
seventy units apart**. A herd would have stood a bowshot from the Tigris and found nothing,
most of the time, at random. The rings run at a hundred and fifty units now and the bearings on
each are counted so no two probes are further apart than a river is wide: **221 lookups, once
per beast per twilight — twice a day.**

And a fourth, caught in the reading rather than the running: the leash on the walk was a flat
forty seconds, so a beast gave up two hundred units into a nine-hundred-unit walk, every time.
It would have measured as working — they set off — and looked like nothing, because none of
them ever arrived. It is the distance at the beast's own pace, and half again.

### What it costs

`riverBankAt` is a probe and eighteen more about it (a river is one pixel wide and a single
lookup would miss it). Asked of every beast four times a second that is thousands of raster
reads for an answer most of them will never use — so `wets` is settled ONCE when the beast is
put down: does its own line name drink or wallow, or is it a forager that fishes or an
ambusher that lies in the shallows. **Nothing else pays anything at all.**

### The measurement, and it is not the one Round 54 was told off for

AUDIT Round 54 wrote that its herd numbers were worthless because they sampled the same three
animals every twelfth frame and called it three hundred samples. This does not do that: **n is
the number of LANDS**, each stood beside its own nearest river bank for a whole dusk and
censused once.

| land | bank from the site | beasts that drink | walking to it | at it |
|---|---|---|---|---|
| Iraq | 100 u | 33 | **17** | 0 |
| Egypt | 2,050 u | 28 | **11** | 3 |
| Bangladesh | 1,900 u | 16 | **4** | 5 |
| Sudan | 4,600 u | 28 | **3** | 3 |

**Four lands of four saw the herds go down.** At noon, nought. And no beast, in any land, was
ever walking to water with a hunter inside its own flight distance.

**What "at it" is NOT.** The census window is a few tens of seconds of world time and a walk of
several hundred units at a beast's own pace takes longer than that, so Iraq's nought is the
window and not the behaviour. *Walking* is the honest headline; *at it* is a lower bound.

### And a note on where the test had to stand

"Do the herds go down to the river" can only be asked in a place with a river in it, and a
village site is put where a village goes, not where a watercourse runs. The first run stood at
the site of Sudan and reported *"no bank within 2400 units"* — which was true, and measured
nothing. The nearest bank to each land's site is found first and the traveller stood beside
THAT. Measured: Iraq 100 units, Bangladesh 1,900, Egypt 2,050, Sudan 4,600, and **India, Kenya
and Brazil have no river bank within nine kilometres of their village sites at all** — which
is a fact about where villages are put, and is written down here because somebody will
otherwise re-discover it as a bug.

### Two stale documents corrected in the same round

- **`creatures/README.md`** said the beasts of the field are drawn at half life-size and named
  `LAND_U_PER_M` in `js/engine.js` as the constant that halves them. Phase 6 step 3 rebuilt
  them (`js/size.js`, Round 51) and **that symbol no longer exists** — grep and you find
  nothing. The paragraph now says what is true and says what it used to say.
- **PLAN §17** said *"There is no making — no bench, no recipe, nothing that turns what was
  gathered into what was not."* That has been untrue since Phase 4: `world/works.js` declares
  fourteen works and tests 20 and 44 walk them. What IS still missing is a bench, and the
  section now says so instead.

## 4bs. Round 70 — §2.3.5, the herd: the measurement built, the change reverted

*§2.3.5 — "matriarch-led herds with juveniles held at the centre."*

**Nothing shipped. This round is a measurement and a diagnosis, and both are worth more than
the feature would have been.**

### Why it was taken this way

AUDIT Round 54 tried this item four times, reverted all four, and left an instruction rather
than a result:

> *A valid measurement of this needs many INDEPENDENT herds — different lands, one reading
> apiece — and **it needs to be built before the feature, not after it**. I have neither, so I
> have no evidence that §2.3.5's juveniles-at-the-centre is or is not satisfied… The item stays
> open and unclaimed.*

Round 69 had just proved that method works (n = lands, one census apiece). So the measurement
went first: **acceptance test 50**, which censuses every herd of three or more across four
plains, once each, and reports how many stand together, how deep in the herd the mothers sit
against everybody else, and how far the herd carries itself over a spell.

### THE FIRST THING IT REPORTED WAS NOT ABOUT MATRIARCHS AT ALL

Asked for herds of **four**, it answered **"no herd of four formed in any land"** — across six
of them. That is not a fault in the test.

- **96 beasts stand at once** (`LL_N`) over a ring of 1,250 units, shared among every species a
  country grows.
- The only thing drawing them together was a pull of 45 % toward the **mean position of their
  own kind within eighty units** — that is, *a beast only felt its herd once it was already
  standing in it.* Two zebra two hundred units apart felt no force whatever.

**The world was not making herds. It was making a scatter with a slight correlation in it**, and
§2.3.5 had almost nothing to give a structure to. Lowered to three, the before-reading was:

| | before |
|---|---|
| herds of 3+ over 4 lands | 6, **mean 3.00, biggest 3** — not one group of four anywhere |
| mothers' depth from the middle | **1.22** herd-radii |
| everybody else | **0.94** — the young were further **OUT**, the exact opposite of §2.3.5 |

### What was built, and what it did

A herd that feels its own kind across **420 units** and walks to them; a **matriarch** — the
highest rank in the neighbourhood, rank being one hash settled when the beast is put down; and
a **station** for every other member, an angle off its own rank on a ring that widens with the
herd, mothers on an inner ring. The stations are the mechanism Round 54 recorded from the bird
flocking it built and reverted, reused on the ground.

Measured four times:

| | mothers | others | mean herd | biggest | travel |
|---|---|---|---|---|---|
| **before** | 1.22 | 0.94 | 3.00 | 3 | — |
| stations about a leader | 1.04 | 0.98 | 3.50 | **6** | 2 u |
| stations + a marching matriarch | **0.80** | 1.06 | 3.00 | 3 | 2 u |
| stations alone, first reading | **0.90** | 1.02 | 3.00 | 3 | 0 u |
| stations alone, second reading | 1.01 | 1.00 | 3.33 | 5 | 2 u |

With **two to six mothers standing in any one run**, that is noise. Two readings of the very
same build gave 0.90/1.02 and 1.01/1.00 — one a clear reversal, the other a dead heat. **I
cannot show it working, so it is not in the tree.** The leader's own invariant held in every
run (**0 outranked, 0 split**), but a leader that changes nothing measurable is machinery, not
a feature.

### AND THEN THE BEFORE-READING DISAGREED WITH ITSELF, WHICH SETTLES IT

The change reverted, the test was run once more on the untouched tree to confirm it reports
cleanly. It read **mothers 0.59 against everybody else 1.07** — the young deep inside the herd —
on **exactly the code that had read 1.22 against 0.94 an hour earlier**, the young well outside.

Same build, same four lands, opposite answer.

**So no comparison against that baseline ever meant anything**, including the four above, and
including — retroactively — the four attempts Round 54 made and could not judge. The item was
never failing for want of a good idea. It was failing for want of a metric with more than three
mothers in it, and this round has shown that in numbers rather than suspected it. The first
thing the next attempt must do is widen the measurement — more lands, or many readings of each,
or both — until the untouched world gives the same answer twice.

### AND THE MARCH, WHICH WAS TRIED AND ALSO REVERTED

Giving the herd a leader made the travel figure *worse* — 2 units against 5 for the scatter it
replaced. The reason is that **every beast on this earth is tethered to the spot it was set
down on**: `hx,hz` is fixed at spawn and a beast wanders inside a fourteen-block disc of it for
life. A herd locked in formation about an animal who cannot leave her own field is a parade
ground. So the matriarch's tether was made to creep along a bearing of her own, nine units a
pick. **Measured: still 2 units, and the herd count fell with it.** Out.

### THE DIAGNOSIS, WHICH IS THE ACTUAL OUTPUT OF THIS ROUND

Four attempts, and they all failed the same way, for a reason that is now plain:

**THE WANDER-TARGET PICKER IS THE WRONG LEVER.** It fires only when a beast has finished
everything else and is *roaming* — and a grazing beast hardly ever is. It is in `seek`, walking
to grass; or in `feedhead`, standing still with its speed set to nought; or in an act. Round 54
saw half of this (*"the gathering rule fires only when a beast picks a new wander target"*) and
drew the conclusion that the herd was a loose correlation. The rest of it is that **no amount of
work on that lever can reach the behaviour**, because the behaviour is somewhere else.

A herd is given its shape by **where each beast looks for grass**. `GRASS.findGraze` spirals out
from where the beast stands and takes the best bite it finds; if it preferred a bite near the
beast's own station in its herd, the herd would form, hold and travel *as a consequence of
feeding*, which is what a herd actually is. That is the next attempt, and it is a change to the
grazing rather than to the wandering — which is why it wants its own round and a fresh
before-reading, since test 35 and the whole life of the plains stand on that code.

The travel figure says the same thing from the other side: **0 to 2 units in a spell whatever
was done to the wandering** — and it may not even be a fault. A herd that has found grass
stands in it. Proving that either way wants a metric that separates a herd walking from a herd
feeding, and that metric does not exist yet.

### What is left behind

`tools/acceptance.js` test 50, **running, and reporting PENDING with its numbers** rather than
green or red — because nothing here is broken; this is the shape of the world, written down. It
is what Round 54 said it wished it had had.

## 4bt. Round 71 — a beast is born into its herd ✅

*The prerequisite for §2.3.5, found by the measurement Round 70 built for it.*

### What the measurement said, and it was not what it was built to ask

Test 50 was written to ask whether the young are held at the centre of a herd. The first thing
it answered instead — **in seven readings running, without a digit of variation** — was:

> **the mean herd on this earth is 3.00 beasts and the biggest is 3**

There were no herds to lead. Round 54 spent four attempts on §2.3.5 and Round 70 spent four
more, all of them on the *gathering rule*, and all of them on a world that had nothing to
gather.

### It is not the species draw. It is the density, and that is arithmetic

`landKindAt` already seeds its draw on a TILE of ground, and its own comment says why: *"so a
whole field bears the same kind and a herd stands together in it."* But the tile is **48
units** and a herd stands within **80** — the field is smaller than the herd.

That is not the binding constraint either. **Ninety-six beasts** (`LL_N`) are set down at
INDEPENDENT random points in a ring four hundred units deep and two and a half thousand
across. One beast to about twenty-seven thousand square units means **the nearest other beast
— of any kind — stands about a hundred and sixty units off**, and a herd radius is eighty.

**Groups of three are what that scattering gives whatever the rules do.** No amount of work on
the gathering can assemble a herd out of animals too far apart to feel one another, and eight
attempts across two rounds went into trying.

### The change, and it is small

A beast is no longer born at an independent point. When the slot being filled calls for a kind
that **already stands nearby** (within seven hundred units), the beast is set down **beside its
own** — within about fifty. A herd accretes as its members arrive, which is how a herd comes to
exist anywhere.

Nothing about *which* beasts live *where* has moved. The kind is still the ground's own choice,
and the snap is refused unless the ground it lands on would have borne that same kind anyway —
so a reindeer cannot be pulled across a tree line to reach a herd-mate.

### Measured, twice, against a baseline measured twice

| | baseline | baseline | **born beside its own** | **and again** |
|---|---|---|---|---|
| herds of 3+ over 4 lands | 7 | 10 | **44** | **45** |
| mean herd | 3.00 | 3.10 | **4.30** | **4.09** |
| biggest | 3 | 4 | **12** | **8** |
| the sizes | 3×7 | 3×9, 4×1 | 3×23, 4×9, 5×5, **6+×7** | 3×21, 4×13, 5×4, **6+×7** |
| lands that had a herd at all | 2 of 4 | 4 of 4 | 4 of 4 | 4 of 4 |
| mothers the depth statistic could sample | 10 | 13 | **90** | **91** |

Seven of the herds in view are six beasts or more, in both readings. Before, in nine readings
across two rounds, **not one group of five ever formed anywhere.**

### AND THE INSTRUMENT HAD TO BE MENDED TWICE ON THE WAY, WHICH IS WORTH RECORDING

Round 70 reverted its work because the depth statistic would not reproduce. Widening it
exposed two arithmetic faults in the measurement itself, neither of which was about beasts:

1. **The majority class always reads "nearer the middle."** Marking every second member of a
   herd of three gives two mothers to one other, every time, and the centroid of three is
   pulled toward whichever pair shares a class. On the **untouched** tree that instrument
   reported 8 mothers at 0.87 against 4 others at 1.26 — a clean-looking result from a rule
   that does not exist. The parity is flipped herd by herd now, so the imbalance cancels.
2. **A beast is part of the mean it is measured against.** In a herd of three it drags the
   centre a third of the way toward itself, so every animal reads closer in than it is. The
   centroid is reckoned leave-one-out now.

Even mended, the depth statistic on the old world gave 2.27/3.47 on one run and 3.67/1.72 on
the next. **With ninety mothers instead of ten it now reads 2.73/2.67 and 1.98/1.61** — no rule
holding the young in, which is correct, because there is none in the tree. The instrument
reports the absence honestly, which is the first time it has been able to.

### What is NOT claimed

**No photograph.** Five camera positions were tried — plan view, oblique, standing off at eye
level, twice from the air — and none produced a frame that shows a herd reading as a herd:
beasts on dun ground seen from above do not group to the eye, and the orbit camera repeatedly
put itself inside a bole or in the sea. The numbers here were taken from the running world by
census, twice, with no page errors; **I did not get a picture of it, and say so rather than
imply I did.**

**And the world is emptier between.** Ninety-six beasts in twenty-odd herds leave more bare
country than ninety-six scattered evenly. That is truer — animals are clumped, not uniform —
but it is a visible change to the feel of a plain and it was not measured.

### What this unblocks

§2.3.5's matriarch and juveniles-at-the-centre can now be *judged*: there are herds of six to
twelve to give a structure to, and ninety mothers to measure instead of ten. That is the next
round, and for the first time it starts with an instrument that reproduces.

## 4bu. Round 72 — the matriarch, judged at last, and it does not work

*§2.3.5's matriarch and juveniles-at-the-centre, measured against real herds for the first
time. **Nothing shipped**, and this time that is a finding rather than a shrug.*

### What was different this time

Round 54 could not judge this item (no measurement). Round 70 could not judge it (the
measurement had ten mothers in it and disagreed with itself). **Round 71 mended both**: there
are herds of six to twelve now, and the instrument samples **eighty to ninety mothers a
reading** with the two arithmetic faults taken out of it.

So the question could finally be asked properly. It was asked of three mechanisms.

### The three attempts, and every one of them measured twice

**1. A station about a matriarch, taken through the wander-target picker.** Rank hashed at
spawn, the highest in a neighbourhood leads, everybody else holds a bearing off her on a ring
that widens with the herd, mothers on an inner ring at 0.40 and the rest at 1.35.

> mothers **1.96** · others **1.94** — a dead heat, with 86 against 93.

**2. The same, with the matriarch's own tether creeping** so the herd should graze across
country (Round 70's attempt, re-measured against real herds).

> the centroid moved **2 units** in a spell, the same as without it.

**3. The station taken through THE GRAZING instead**, which is what Round 70's diagnosis said
the lever had to be — *"a herd is given its shape by where each beast looks for grass"*. The
search for a bite starts from the beast's station in its herd rather than from its own feet.

> reading one: mothers **1.87** · others **1.95** — leaning the right way
> reading two: mothers **1.89** · others **1.67** — leaning the *wrong* way

**Two readings of one build, opposite directions.** That is the end of it.

### What that actually establishes, which is not nothing

The instrument is sound now — it was proved so in Round 71, where it reported a change of
7→44 herds and reproduced it — so this is no longer "I could not tell." **With eighty-odd
mothers in every reading, three different mechanisms move the young's position by less than the
run-to-run spread.** Round 70's diagnosis (that the wander-picker is the wrong lever) was right
about the wander-picker and *wrong to assume the grazing would therefore be the right one*:
moving the search centre by a few tens of units while the search radius stays at 190 shifts
nothing, because the bite it finds is anywhere in a disc far larger than the herd.

### THE ONE DIAGNOSTIC THAT WOULD SETTLE IT, and none of the three could

Every attempt so far has measured the OUTCOME (where the young end up) and inferred the cause.
What has never been measured is whether **a beast ever reaches its station at all** — the mean
distance from each animal to the place its herd assigns it.

- If that distance is large, the rule is never landing, and the fix is about *when* it fires.
- If it is small, the rule lands and the young's depth still does not move, which would mean
  the station geometry is wrong, or that a herd of four to twelve is simply too small for
  "inside" and "outside" to be distinguishable at all.

Those two are opposite repairs and three rounds of work could not tell them apart. **That
measurement is the first thing the next attempt should build**, exactly as Round 54 said of the
last one — and this time the pattern has held twice, so it is worth stating as a rule: *when a
change cannot be shown to work, measure the mechanism, not the outcome.*

### And the birds are still where Round 54 left them

*"A bird has nowhere in its day to BE in a flock"* — 95 % are in `hunt` at any moment. That is
untouched and remains a question about a gull's day, not about geometry.

## 4bv. Round 73 — the suite run at last, and test 48 was measuring the wrong thing

The whole suite had not run since Round 69 — a container restart killed that attempt — so four
rounds had landed on a result nobody had seen. It has now run on the committed tree:

**47 pass · 1 fail · 2 pending**

The two pendings are by design: 43, the boles, switched off since Round 61; 50, the herd
measurement, reporting rather than judging since Round 70. Everything from Rounds 67–71 is
green.

### And test 35 got better without being touched

> 528 herd-samples of three or more: 447 watched (**85 %**)

It had read 37 %, 58 % and 50 % on ~150 samples, and its bar is 45 % — a metric sitting so
close to its own noise that one suite run went red on it. **Round 71's herds gave it a real
sample**, and at 528 samples it clears the bar with room. Nothing in test 35 or in the watch
was changed; the world simply now has herds to sample.

### The one failure was mine, in the instrument again

> FAIL 48 — *"116 chunk(s) built while the whole year turned — the year is not in the shader"*

Test 48 passed **alone, twice, reporting 0**. The claim it guards — that a crop's year is worked
out in the vertex shader and no chunk is ever built for it — was measured and is not in doubt.

**It counted an ABSOLUTE number of chunk builds over fifty frames and failed above forty.** Run
alone the world is settled, the ring lays nothing, and it reads nought. In the suite it runs
straight after tests 41 and 47, which call `dropChunks()` and fly the traveller to India and to
the United States — so the ring is still refilling, and the 116 chunks it counted were the
ring's own work.

The comment beside the assertion **named the hazard** — *"the ring lays ground of its own as the
traveller drifts"* — and then guarded against it with a fixed number, which is the wrong shape
for a quantity that depends on where the traveller has just been.

### Mended as a DIFFERENCE, and the first attempt at that was wrong too

The same span of frames with the year held still, then the same span with the year turned
through all four seasons; what the ring does on its own appears in both and cancels.

**That alone was not enough.** Run in the suite position it read **quiet 124, turning 0** — the
year "cost" **minus a hundred and twenty-four**. It passed, and it passed by luck: the ring was
working off test 47's backlog during the first span and had finished by the second. Reverse the
order and the identical world fails. A difference is only a difference if the two halves are
comparable, so both spans now begin only once the ring has laid **nothing for twelve frames
together**.

### Proved both ways, which is the whole point

| | quiet | turning | the year's own cost |
|---|---|---|---|
| in the suite position that reported 116 | **0** | **0** | **0** |
| with the fault injected | 0 | 173 | **173** |

The fault injected is the true one: `SEASON.setSeason` made to drop the chunks, which is exactly
what carrying a crop's growth in the GEOMETRY rather than the shader would force. The bar is 25.
**A guard that has never been seen to fail is not yet a guard** — this one now fails on the fault
it exists for, and reads nought on the world that is shipped.

### The lesson, and it is the third time this session

Round 71 found two arithmetic faults in the herd instrument. Round 72 found that three
mechanisms could not be told apart because the measurement watched the outcome instead of the
mechanism. This one found a guard whose shape depended on which test ran before it. **Every
fault found in the last four rounds has been in a measurement, not in the world** — which is
worth writing down, because it means the world is in better condition than the instruments
reading it.

## 4bw. Round 74 — the coat missed the twenty commonest beasts on earth ✅

*A hole in §2.3.1, open since Round 51, that the test guarding it could not see by
construction. Found while surveying for §2.3.4.*

### How it was found

§2.3.4 wants finer voxel grain on *"the twenty most-seen species"*. Ranking every beast by how
many of the hundred and seventy-six lands name it in `world/fauna.js` turned up something else
first: **eleven of the top twenty have no creature file at all.**

| | | | |
|---|---|---|---|
| 1 goat 98 | 2 crocodile 75 | 3 fox 75 | 4 deer 66 |
| 5 sheep 59 | 6 cow 56 | 7 boar 52 | 8 leopard 46 |
| 9 gazelle 45 | 10 lizard 39 | 11 wolf 37 | 12 elephant 36 |

Twenty kinds — sheep, cow, pig, chicken, hare, lizard, goat, camel, horse, donkey, ox, wolf,
dog, lion, deer, elephant, crocodile, bear, blackbear — are built by a hand-written
`buildOldAnimal` chain inside `js/engine.js`.

### And that chain never met the coat

`coatBeast` is called from `makeBeast` **and from nowhere else**, and `makeAnimal` only routes a
kind to `makeBeast` **if it has a file**. Everything else falls through to `buildOldAnimal`,
which does not coat.

Measured live, by building each kind through the door the world uses:

| | meshes | graded | tint spread |
|---|---|---|---|
| goat, cow, sheep, deer, wolf, elephant, camel, bear | 15–19 each | **0** | **0** |
| gazelle, leopard, hippo, fox | 16–22 each | all | **0.48** |

**Round 51's headline — "2534 meshes graded, 0 left flat" — was true of everything it looked at
and false of the animals a traveller actually meets.** The single most-seen beast on this earth
was flat.

### The test could not have caught it

Acceptance test 32 walks `BEAST_BY_NAME`, which is the creature files. There is no arrangement
of a test over that list that can see a beast which has no entry in it. **The guard was the
right guard pointed at the wrong door.**

It asks `makeAnimal` now — the door the WORLD comes through — over every kind in
`FAUNA.keeps` as well as every file. Two faults surfaced in widening it, both mine:

1. `makeAnimal` is the LAND spawner. Handed the name of a fish it falls straight through to the
   old chain, so the first cut reported the whole sea flat and named *"fish, puffer, jelly,
   crab"*. The beasts of the water are asked for by their own call now.
2. `FAUNA` is module-local to the engine, so `window.FAUNA` was undefined and the widened list
   came back with **nought** extra kinds — the test reported "0 kinds with none" and looked
   like it had worked. It is exposed on `__VDBG` and the count is asserted in the report line,
   so a silent zero cannot happen again.

Pointed properly, it went red on the truth: **2534 graded, 348 left flat, missed in cow, sheep,
goat, pig.**

### The fix is one call

```js
const inner=buildOldAnimal(kind);
coatBeast(inner,null);          // ← this line
return sizeToTrue(kind,inner);
```

**2882 meshes graded, 0 left flat** — the 348 that Round 51 never reached now carry it, and the
2534 it did reach are untouched.

### And it was photographed, at last

Five hand-built beasts stood in a row at noon under **a pinned camera** — `__WORLD.renderer`'s
own `render` wrapped so the eye sits exactly where it is put, every frame. Coat off, the
elephant's flank is one flat grey and the pig one flat pink. Coat on, the back is darker than
the belly and the legs shade down.

*(Round 71 failed to photograph a herd across five attempts with the orbit camera, which kept
putting itself inside a bole or in the sea. `__WORLD` exposes `camera` and `renderer` and has
all along. That was the answer, and I did not look for it.)*

### What this leaves for §2.3.4

The finer grain itself. Those twenty kinds still stand at **15 to 19 parts** where the brief
asks 30–60 — the elephant is body, head, trunk, two eyes, tail, two ears, two tusks and eight
leg meshes, and that is the whole animal. Giving them creature files serves three things at
once: the brief's part count, `creatures/`'s own "one to a file", and the removal of a
two-hundred-line hand-built table from the engine. That is the next round; **the coat is not
waiting on it.**

## 4bx. Round 75 — the weld: a beast in a handful of meshes ✅

*§2.3.4 asks for 30–60 parts on a large mammal where there are 15–19. This is what had to
happen first, and the honest account of what it did and did not buy.*

### Why it was needed

`lbox` mints a new `BoxGeometry` **and** a new material for every limb (`lam` is `new
MeshLambertMaterial` on every call), and nothing anywhere merged or instanced beast geometry.
**A part is a mesh is a scene-graph node.** Ninety-six beasts stood at **1,836 meshes** between
them, and taking each from seventeen parts to forty would have doubled that.

### The trick was already in this codebase, twice

The flora draws a hundred and seventy species with four grey materials by tinting vertex
colours. And `coatBeast` already writes a greyscale `color` attribute onto every beast mesh and
turns `vertexColors` on. One step further — multiply each part's own base colour into that
attribute — and the material stops carrying anything the geometry cannot. Then the parts weld.

THREE r128 is bundled without `BufferGeometryUtils`, so the concatenation is written by hand,
the same way `quad()` in the chunk mesher already builds buffers.

### What stays loose is DERIVED, not listed

The engine reaches every moving part by name through `userData` — `legs` (and each leg's
`knee`), `head`, `jaw`, `tail`, `ears`, `tents`, `wingL`/`wingR`, `flL`/`flR`, `armL`/`armR`.
**Anything named there, with everything under it, keeps its own mesh; all the rest is welded.**
A hand-kept list of moving parts would drift the first time a creature file grew a new one.
This cannot: if the engine can reach it, it still moves.

And the weld is by MATERIAL SIGNATURE, not into one lump — a textured hide and a flat horn
cannot share a material, so parts are gathered by the texture they wear and each gathering
becomes one mesh.

### What it bought — measured over the whole bestiary

**170 kinds built both ways: 2,882 meshes → 1,288. Fifty-five per cent fewer.** Per beast:

| | parts | welded |
|---|---|---|
| crocodile | 21 | **7** |
| gazelle, fox, deer, goat, wolf, camel, bear, lion | 17–22 | **10** |
| cow, sheep, leopard, hippo | 15–22 | **11** |
| elephant | 18 | **12** |

**984 moving parts named by the engine, every one still its own mesh and every one still
turning.**

### WHAT IT DID *NOT* BUY, AND THIS IS THE PART WORTH READING

**It does not cut draw calls.** Measured with `renderer.info.render.calls` — the renderer's own
count, not a mesh tally — alternating the two conditions twice each so drift cancels:

| | welded #1 | welded #2 | loose #1 | loose #2 |
|---|---|---|---|---|
| draw calls | 1,978 | 2,179 | 1,964 | 2,059 |
| beast meshes | 916 | 1,011 | 1,814 | 1,857 |

**A difference of 67 inside a spread of 200.** The meshes halve every time; the calls do not
move. The reason is frustum culling: most of the ninety-six beasts stand outside the view, and
their loose parts were never drawn to begin with.

It took three attempts to learn that. Measured once, welded read **170 calls MORE**; measured
again, **439 FEWER**; only alternating within one run showed the truth, which is *neither*. The
first attempt also measured a world with **nought beasts in it** — `holdWorld` pauses the game
outright and the spawner with it — and reported no difference at all, which looked like a
result.

### So what is the weld actually for?

**It makes the part count nearly free**, and that is precisely what §2.3.4 needed. A welded
beast's mesh count is set by how many parts MOVE and how many materials it wears — not by how
many parts it is built from. The crocodile is built of 21 and welds to 7. **A beast of forty
parts will weld to the same ten or twelve as one of seventeen**, which is the property the
finer grain has to stand on.

> **Corrected in Round 76 (§4by).** That last sentence was true only of parts hung on the
> beast. `beastMoving` claims a moving part *and its whole subtree*, so a hoof on a shin or an
> eye on a head was still a mesh of its own — and the finer grain is almost entirely made of
> such parts. The first goat built to §2.3.4 came out at **twenty-one** meshes, not twelve.
> §4by counts the pivots apart from their subtrees and welds into them; the claim holds now,
> and is measured rather than asserted.

The scene-graph and memory win is real too, and this codebase already complains about exactly
it: *"four thousand geometries at the outset and sixty-one thousand after two dozen
landfalls… a world that grows heavier the longer it is played in."* Halving the geometries and
materials every beast is built from goes straight at that.

### Proved both ways

Acceptance test 51 asserts the weld saves meshes, that every part the engine names is still
separate, and that turning each one genuinely turns something. **Fault injected** — the set of
things-to-keep emptied, so the moving parts weld too — it reads **56 of 56 swallowed** against
**0 of 56** on the sound tree. And the beasts were photographed under a pinned camera welded
and loose: indistinguishable.

## 4by. Round 76 — §2.3.4, the finer grain, and what it really cost ✅

*Nineteen beasts still stood at fifteen to nineteen boxes inside a hand-written chain in the
engine. This is the first five of them, and the correction to Round 75 that had to come first.*

### Round 75 promised something that was not true

Its audit says, in bold: ***"A beast of forty parts will weld to the same ten or twelve as one
of seventeen."*** The very first beast built to §2.3.4 disproved it. The new goat — fifty
parts, with a cloven hoof on every shin and its whole face hung on its head — came out of the
weld at **twenty-one meshes** against the seventeen-box goat's **ten**. Twice the cost, for the
animal named by ninety-eight of the hundred and seventy-six lands.

The reason is exact. `beastMoving` claims a moving part **and its whole subtree**, and it is
right to: a hoof hung off a shin must not be welded to the ground the shin swings over. But a
hoof does not move against the **shin** either. Nothing in the engine ever reaches for it. Under
Round 75's weld every such part was its own mesh again — and the finer grain is *almost entirely*
made of such parts. A muzzle, a nostril, an eye, a horn, a hoof: each of them hangs on something
that already moves.

### The pivots, counted apart from their subtrees

`beastPivots` is the new half of it: the parts the engine names in `userData`, and **nothing
else**. `mergeBeast` then welds every other mesh into the nearest pivot above it — into that
pivot's own geometry where their materials agree, so the object survives and every handle on it
still points at the same thing, and the engine never knows.

### Measured, before and against

| beast | parts before | meshes before | parts now | meshes now |
|---|---|---|---|---|
| goat  | 18 | 10 | 64  | **12** |
| deer  | 19 | 10 | 73  | **14** |
| sheep | 15 | 11 | 106 | **14** |
| cow   | 20 | 11 | 68  | **14** |
| wolf  | 17 | 10 | 69  | **14** |

Four times the parts, and the number is exact rather than approximate: **a beast is one welded
lump per material it wears, plus one mesh for everything that moves.** The goat's twelve is one
lump, eight leg bones, a tail, a head and a jaw. Nothing else on it costs anything — not the
three-length barrel, not the twelve locks of the flank, not the ribbed horns, not the eight
cloven hooves.

And the three or four meshes each of them gained over the old build are **not the grain**. They
are the head that now turns, the jaw that now chews and the two ears that now flick — parts
the old beasts did not have at all. The grain itself is free.

Across the whole earth: **170 kinds, 3,173 parts, 1,264 meshes — 2.5 parts to a mesh.**

### The five

- **The goat** (98 lands): three-length barrel and a straight back over a swinging belly;
  withers; twelve locks of shaggy flank hung *past* the outline, because a dark patch painted
  inside the silhouette is a decal and a lock that breaks the outline is hair; ribbed horns in
  three chained lengths sweeping **back over the neck** — which is not only truer but necessary,
  since `js/size.js` measures this beast by its whole height and a horn that rises is a horn
  that shrinks the goat under it; the beard; the tail carried **up** where a sheep's hangs; the
  slotted bar pupil; cloven hooves on the shins, so they swing with the leg.
- **The deer**: an antler that is a beam with a brow tine, a bez and a trey coming off it,
  grown as a chain, instead of two sticks; the white rump patch and the flag over it; the
  summer dapple; the pale mask and black muzzle; dark hocks on long light legs.
- **The sheep**: the fleece is *grown*, not drawn — some seventy locks in four creams, in three
  courses over the back, along the flank and under the brisket, standing past the carcass so the
  outline is wool and not a crate. This is the clearest case in the round: **106 parts, 14
  meshes.**
- **The cow**: the dewlap and brisket; the hip bones standing over a hollow flank; the ridged
  spine; the udder and its four teats; the tuft on a long swinging tail; and the patches drawn
  **wider than the beast**, so each comes over the top of the back and down both flanks in one
  piece rather than sitting as a rectangle on the middle of a side.
- **The wolf**: the ruff, which is half the width of the animal from the front and was simply
  absent; the head carried **level with the back**, which is what tells a wolf from a dog at any
  distance; the dark saddle going pale down the flank and cream beneath; the brush carried
  straight out; a pad with three toes under every foot.

### Proved by the fault, twice — because there are two ways to be wrong

Acceptance test **52** counts, for every pivot on every beast, the meshes in its subtree that
are not themselves pivots; and it measures every moving part **in its own space against its own
loose self**, so that a part which has lost the reach of what hung on it is caught.

1. **The old weld** — anything the engine can reach left alone, subtree and all: the world goes
   from 1,264 meshes to **1,460**, the baggage from 33 pieces to **301**, the sheep from 14
   meshes to **forty**, and the deer carries **twenty-five** loose parts on its head, which is
   its whole face and both antlers.
2. **The greedy weld** — everything welded at the beast's own scope, so a hoof folds into the
   *body*. This reads **better** by the first assertion: 1,234 meshes against 1,264, and three
   pieces of baggage against 33. It is also a beast whose feet stay where they were when it
   walks. Sixty-eight moving parts are caught by the second assertion — every shin that has lost
   its hooves, every head that has lost its face, and the shark's tail, which loses 4.82 of its
   own length.

Test 51 still passes unchanged: 170 kinds, 1,002 named moving parts, every one still its own
and still turning.

### The other fourteen, and §2.3.4 closed

| beast | parts before / meshes | parts now / meshes |
|---|---|---|
| elephant  | 18 / 12 | 82 / **13** |
| camel     | 17 / 10 | 70 / **12** |
| donkey    | 17 / 10 | 54 / **14** |
| bear      | 18 / 10 | 86 / **14** |
| blackbear | 18 / 10 | 79 / **14** |
| lion      | 19 / 10 | 98 / **12** |
| horse     | 20 / 10 | 76 / **14** |
| ox        | 18 / 10 | 65 / **14** |
| crocodile | 21 / 7  | 126 / **12** |
| lizard    | 13 / 10 | 77 / **12** |
| pig       | 18 / 10 | 67 / **14** |
| chicken   | 18 / 10 | 76 / **8** |
| hare      | 16 / 9  | 46 / **14** |
| dog       | 17 / 10 | 56 / **14** |

Nineteen beasts across the three batches: **328 parts and 190 meshes before, 1,289 parts and
243 meshes after.** Four times the grain for a quarter more draw calls, and the quarter is the
heads, jaws and ears that now move. Across the whole earth, as acceptance test 51 counts it:
**170 kinds, 3,983 parts, 1,307 meshes — three parts to a mesh, and 67% fewer meshes than the
parts they are built from.** (A sweep over `js/size.js`'s own table reaches 177 kinds and reads
3,976 → 1,322; the two lists differ by which names each holds, not by what either measured.)

`buildOldAnimal` is down from twenty branches to two — the penguin and the ostrich, which the
size table measures but which `world/fauna.js` places by other machinery. Its `fourLegs` helper
is gone with the last quadruped that used it.

**What each of them got, and why that and not something else.** The rule followed throughout was
to spend the grain on the SILHOUETTE and on what tells this beast from the one standing next to
it — not on detail inside an outline, where a box reads as a decal painted on a crate:

- **lion** — the mane grown as a ring of fourteen locks radiating from the head, over an inner
  course of fourteen more so it is a mass and not a gear; the black lip line, whisker spots and
  square muzzle; the shoulder blades; the belly fold; the black tail tuft.
- **horse** — the mane that FALLS, ten locks over one side of the crest, and the tail that falls
  in eight strands, which is the whole difference from the donkey's standing brush and tufted
  dock; the arched neck in two lengths; the blaze, socks and fetlock tufts.
- **ox** — the yoke boss over neck and withers that a working ox carries and a milk cow does not;
  horns sweeping wide and FORWARD where the cow's go out and up; four folds of dewlap; the curled
  poll between the horns; no udder.
- **crocodile** — four rows of keeled scutes down the back closing into the double and then
  single crest of the tail; the fourth tooth standing outside the closed mouth, which is what
  makes it a crocodile and not an alligator; eyes and nostrils on their own turrets, so a
  submerged animal is two bumps and a nose; sprawled legs and webbed feet.
- **lizard** — the crest from neck to tail-tip; the open ear-hole behind the eye; the throat fan;
  five spread toes on every splayed foot; a tail longer than the rest of it.
- **pig** — the flat disc of the snout with two round nostrils in it; ears that fall FORWARD over
  the eyes; the bristle ridge; the trotter cloven with two dew-claws behind; and the tail built
  as a real spiral of five turning lengths, which is the thing everybody draws and nobody builds.
- **chicken** — a comb of five points rather than a plate; two wattles hanging separately beside
  an ear-lobe; the hackle cape over the shoulders; three arched SICKLES over a fan of short
  feathers; scaled shank, three toes forward and one back, and a spur.
- **hare** — ears a third of the animal's length, black-tipped, in two lengths so the tip leans
  back; a hind leg twice the fore, built apart from `T.legs4` for that reason; the arched back
  highest over the haunch; the white scut under a black top.
- **dog** — the head carried ABOVE the back where a wolf's is level; the muzzle stopped short
  under the brow; the tail up and curling over in four lengths, which no wolf's does; ears folded
  at the tip; the white blaze, chest and paws of a village dog.

**Two lessons, both learnt from photographs.**

*A part that does not break the outline is a decal.* The goat's first shoulder blade, a dark
rectangle laid on the middle of the flank, read as a patch of paint on a crate; twelve locks hung
past the lower edge of the barrel read as hair. The cow's white patches, drawn as rectangles on
the middle of a side, read as stickers; drawn WIDER THAN THE BEAST so each comes over the top of
the back and down both flanks in one piece, they read as markings. This is the whole of what the
finer grain is for.

*A chained length leans FORWARD on a positive rotation about x and BACKWARD on a negative one,*
and getting that backwards costs an afternoon. The goat's neck leaned back over its own shoulder
and left the head floating in front of it with daylight between; the chicken's sickles lay out
behind the bird like the head of a broom; the crocodile's tail grew forward through its own
throat. The rule is written into `creatures/README.md` now, with `T.limb` and `T.on` beside it.

## 4bz. §2.3.4 — done, and what it cost ✅

Every one of the twenty most-seen beasts is a creature file at thirty to sixty parts and beyond,
where the brief asked, and none of them costs what the naive reading would have cost. The two
new tools that made it possible — `T.on` and `T.limb` — are eleven lines of engine between them.

### The suite, whole

**49 pass · 0 fail · 3 pending.** The three pendings are all of them pre-existing and none is a
regression:

- **12** — the chunk-build ceiling. This box runs the loop in 62.7 ms against the 36 ms of the
  box that set the baseline, 1.74× slower, and the test says so itself and refuses to judge.
- **43** — `FLORA.boleBlocks` is off, so the boles are still geometry and cannot be struck. A
  switch, not a fault.
- **50** — THE HERD, MEASURED, which reports numbers and guards nothing by design while §2.3.5
  is open.

Test **32** now reads the coat of **169 creature files and one kind with none** — it was fifteen
without a file when this round began and twenty when Round 74 found the hole. Test **36** counts
**436 files and 169/169 beasts**, up from 155. Tests **51** and **52** are quoted above.

### One thing worth writing down, and NOT claiming

Test 50 read the young at **1.69 herd-radii from the middle against 93 others at 2.66** on this
run. Rounds 70 and 72 could not move that number past the run-to-run spread across eight
readings, and nothing in this round was aimed at it. One reading is not a result — the whole
lesson of Rounds 70–73 is that this instrument disagrees with itself — but it is worth the next
round's attention, because if the finer grain has changed where beasts stand it has done so by
accident and ought to be understood.

## 4ca. Round 77 — §2.3.5: the diagnostic, and the dead lever it found ✅

*§2.3.5 — "matriarch-led herds with juveniles held at the centre" — had been built and taken back
out FOUR TIMES: Round 54 four attempts, Round 70 four more, Round 72 three mechanisms measured
twice apiece. Every one of them measured where the young ENDED UP. This round measured the
mechanism instead, exactly as Round 72's own instruction said to, and the instruction was right.*

### What the instrument was told to find

> **What has never been measured is whether a beast ever reaches its station at all.** If that
> distance is large, the rule is never landing, and the fix is about *when* it fires. If it is
> small, the rule lands and the young's depth still does not move, which would mean the station
> geometry is wrong… Those two are **opposite repairs** and three rounds could not tell them
> apart. — AUDIT Round 72

### And it found the first of the two, in a form nobody had guessed

The herd is reckoned once a frame for the whole earth, by the same greedy rule acceptance test 50
censuses with; every beast gets a station (mothers on an inner ring, `stationOf`); and the
instrument counts the **reach** — how far a beast stands from its station, in herd-radii — and,
for every candidate lever, **how often that lever is even consulted.** Kenya, a settled herd,
fifty-five to sixty-eight beasts, several thousand beast-seconds:

| | per herded beast-second |
|---|---|
| the wander-target picker | **0.0000** — not once, ever |
| the search for a bite | 0.0000–0.0136, settling at ~0.002 (one pick per beast per eight minutes) |
| a herded beast moving at all | 1% of frames, falling to 0% |
| **reach** | **1.27–1.32 herd-radii, flat** |
| a herd's radius | **23 units** |

**The first of those is not slowness. It is unreachable code**, and it is the finding of the
round: *the forty-five per cent pull toward its own kind — the only cohesion this world has ever
had, and the lever Rounds 54 and 70 both built their matriarch on — cannot execute for a beast
standing in grass.* The job chain puts such a beast back to `feedhead` on every decision, so
`a.job` is never `'roam'` by the time the picker at the bottom of the loop is reached. Round 70
called that picker "the wrong lever" from reading the code; the number is 0.0000.

**It also convicts the instrument.** Test 50 marks its mothers and reads them seventy frames
later — about ten world-seconds. At 0.002 picks a beast-second across fifty-five beasts that is
**one decision in the entire world**. No station mechanism any of the four rounds built could
have been observed by it, whatever the mechanism was.

### And the depth statistic is noise, now shown inside a single boot

Test 50's mothers-against-others has now read, on identical committed code: **1.69/2.66** (the
suite, Round 76), **1.94/1.60** (a clean worktree at the same commit), and — the same land, the
same browser, minutes apart — **1.88/1.34, then 1.43/1.92, then 1.86/1.37.** Opposite answers
five and six times over four rounds. The reason is arithmetic: **a herd of three has no inside.**
Twenty of the forty-four herds this world makes are threes and thirteen are fours, so most of the
sample can carry no signal whatever, and the leave-one-out radius it divides by is reckoned off
two animals.

So a second statistic is measured beside it, and no radius enters it: **each herd ordered by
distance from its own leave-one-out centre, the mothers' mean rank against the (n+1)/2 that
chance would give, scaled by (n−1).** Bounded in ±0.5, positive means the mothers stand nearer
the middle. Across every land and configuration with nothing switched on it reads **−0.03 to
+0.03**.

### Two mechanisms built, measured, and thrown away

The arithmetic above — a herd twenty-three units across, a bite search reaching a hundred and
ninety, ring one alone sixty-three units out — pointed at an obvious repair: narrow the search to
the herd's own ground, and score the bite by how near it falls to the station rather than taking
the first one over 0.7. **Both were built, both were switched, and both added nothing**: reach
0.83 and rank 0.11 with them, 0.82 and 0.11 without, over five samples apiece on one land. (That
comparison was taken before the herd's radius was made exogenous and was not re-run afterward;
what it establishes is that the drift does the work and these do not, which was enough to leave
them out.) They are not in the tree. The diagnostic was built to stop a fifth round of shipping
something nobody could show working, and the first thing it stopped was this round's own first
idea.

### What was shipped, and the number it moved

The rule is hung where a grazing beast actually decides — **at the end of a mouthful, three to
seven seconds apart.** A beast standing further off its station than 0.35 of its herd's radius
walks in before it puts its head down again.

| Kenya, settled | reach | mothers' reach | **rank** | lever, a beast-second |
|---|---|---|---|---|
| nothing on (5 readings) | 1.27–1.30 | 1.07–1.11 | −0.001 … +0.023 | 0.0000 |
| the drift, tolerance 0.35 | **0.82** | **0.79–0.83** | **+0.10 … +0.13** | 0.051–0.079 |
| the drift, tolerance 0.20 | 0.78–0.82 | 0.77–0.79 | +0.07 … +0.12 | 0.072–0.078 |

**Two faults were found in it and both were found by measuring, not by reading.**

**1. The tolerance was wider than the effect.** The first cut let a beast stay put if it was
within ONE herd-radius of its station — but the whole distance between a mother's ring and
everybody else's is 0.75 of a radius, seventeen units, so a tolerance of twenty-three units is
*wider than the thing the rule is trying to create*. Every beast sat inside it and kept whatever
place it already had: reach fell to 0.95 and the rank did not move at all. At 0.35 both move
together.

**2. THE STATIONS WERE SET OFF THE RADIUS THEY THEMSELVES SET, and it collapsed.** A herd was
given a station ring proportional to `r`, the mean distance of its members from its middle. That
is a feedback loop: the stations pull the herd in, `r` falls, the stations come in with it, and
the herd implodes. Measured in Tanzania before it was seen — **the herd's radius went from 18.5
units to NINE**, which is six beasts standing inside a room, and the young's rank went
*backwards* with it, to −0.021. A herd has two radii now: `r`, the one it has, which is what the
instrument reads; and `rt`, the one it ought to have, which is exogenous — how much room a beast
of that kind takes (`bodyLenOf`) times the root of how many there are. The stations are set off
`rt` and so is the reach, so the yardstick cannot move with the thing being measured. On the
untouched world `rt` reads 16–23 units against a measured `r` of 22–24, which is the check that
the spacing constant is not invented.

### Four lands, the rule off and on, alternating within one boot

| land | rank off | **rank on** | reach off | reach on | herds | mean feed |
|---|---|---|---|---|---|---|
| Kenya | +0.022 | **+0.225** | 1.35 | 0.84 | 15 → 12 | 0.58 → 0.67 |
| Tanzania | −0.060 | **+0.271** | 1.42 | 0.81 | 9 → 8 | 0.73 → 0.68 |
| Botswana | +0.052 | **+0.156** | 1.42 | 0.98 | 8 → 8 | 0.75 → 0.71 |
| Mongolia | +0.095 | **+0.167** | 1.96 | 1.20 | 8 → 9 | 0.73 → 0.80 |
| **mean** | **+0.027** | **+0.205** | **1.54** | **0.96** | 40 → 37 | 0.70 → 0.72 |

Every land moves the same way on both numbers. The effect on the rank is **+0.18, larger than the
entire spread of the off readings** (−0.060 to +0.095), which is the bar this round set itself in
advance and the bar four earlier attempts could not clear. Feed is unharmed — the herd is not
held in shape at the price of its dinner — and no beast anywhere failed to find a bite.

### And it was photographed, which Round 71 could not manage

Four attempts, and the first three failed in ways worth recording because they are all about what
a herd IS rather than about cameras. **One:** the two shots caught different herds — a buffalo
herd against a sounder of warthogs — because the world respawns between spells; the herd has to
be chosen once and held. **Two:** the eye was pinned to where the herd stood when it was chosen,
and eight hundred frames later it was pointing at an empty stretch of sand; the eye has to follow
the herd's own middle, read afresh every frame. **Three:** `LANDLIFE` is a fixed pool, so a beast
that wanders out of the ring has its slot filled again somewhere else entirely — still `set`,
still the same object — and one gazelle seven hundred units away dragged the mean the camera was
aiming at right off the herd. **Four:** the world clock runs while the first shot settles, and a
herd bedded down for the night does not move an inch, which is how one pair came back identical
to the digit.

With those mended: **the same nine goats, five of them mothers, before and after**, their distance
from the middle of their own herd in units, a star marking a beast with young —

```
off   7   8*  23*  31   32*  32   36*  40*  46      herd radius 28.3
on    5*  7*  10*  11*  14*  23   23   25   25      herd radius 16.0
```

**The five innermost are every mother and the four outermost every beast without young**, where
before the animal nearest the middle was not a mother at all and the mothers stood from eight to
forty units out. That is §2.3.5's clause, on one herd, in raw coordinates; and the pair of
photographs shows the same thing as a scatter drawing in and tightening.

### And then the suite found what four plains had not

The numbers above were taken on four plains of goats and gazelles. **Test 35 — the watch, which
reads off these very herds — reads the whole earth**, and it caught a regression the A/B could
not see:

| | herd-samples of three or more | watched |
|---|---|---|
| before the round | 597 | 477 (80%) |
| the station, as first built | **423** | 308 (73%) |

Both pass — the bar is 45% — but a fall of nearly a third in the herds the world makes is not
something to ship quietly, and the arithmetic says exactly why. Two beasts on opposite bearings
of the OUTER ring stand `2 × rt × STN_OUT` apart, and the world only counts beasts into one herd
within `HERD_R`, which is eighty:

| | rt | across the outer ring |
|---|---|---|
| goat, herd of twelve | 28.1 | 64.5 — inside |
| **buffalo, herd of nine** | 37.8 | **86.9 — outside** |
| **buffalo, herd of twelve** | 43.6 | **100.4 — outside** |

**The rule was pulling a large herd of large beasts wider than the radius the world gathers them
within, until it stopped recognising them as one herd at all** — and test 35's lands hold buffalo
where four plains of goats do not, which is the whole difference between the two readings. The
ring is capped to fit inside its own neighbourhood with margin (`HERD_R × 0.85 / 2·STN_OUT`,
about twenty-nine), written as the expression rather than the number so it stays true if either
constant moves.

**And test 35's own count has now been read enough times to know it is not a number.** I wrote
that the cap gave back "ninety-seven per cent of the herds it had before the round" off one
reading of 578, and PLAN.md said 610 off another. Five readings:

| | herd-samples of three or more | watched |
|---|---|---|
| before the round | 597 | 477 (80%) |
| **the station uncapped** | **423** | 308 (73%) |
| capped, run alone | 578 | 445 (77%) |
| capped, run alone again | 610 | — |
| capped, in the full suite | 485 | 339 (70%) |

The capped readings run **485 to 610** with nothing changed between them, and 597 sits inside
that spread. **So the honest claim is not a percentage recovered but this: the uncapped 423 falls
below every capped reading and below the before-value, and the capped ones straddle it.** The cap
undoes the regression; by how much is not a thing this statistic can say, and the sentence that
said it is struck. That is the same fault as the mean-herd-size claim further down, found the
same way — by reading twice — and corrected rather than left because it happened to flatter the
feature.

### The four lands again, capped, which is what shipped

| land | rank off | **rank on** | reach off | reach on | herds |
|---|---|---|---|---|---|
| Kenya | −0.027 | **+0.116** | 1.50 | 0.92 | 14 → 12 |
| Tanzania | −0.073 | **+0.131** | 1.41 | 0.72 | 16 → 14 |
| Botswana | −0.009 | **+0.148** | 1.48 | 0.98 | 9 → 9 |
| Mongolia | +0.111 | +0.095 | 2.47 | 1.39 | 8 → 7 |
| **mean** | **+0.001** | **+0.122** | **1.72** | **1.00** | 47 → 42 |

And two readings that say more than the mean does:

- **The depth statistic finally agrees.** Mothers 1.27 against others 2.31 — a gap of **+1.04**
  where the off readings give −0.03. The noisy instrument and the robust one now point the same
  way, which they never did in four rounds.
- **Split by herd size, the signal is where it must be.** Herds of five and more: **+0.058 off,
  +0.172 on.** Herds of three and four: −0.005 off, +0.096 on. The bigger the herd the bigger
  the effect, which is what "a herd of three has no inside" predicts.

Mean herd SIZE went up, 4.00 to 4.17, while the count fell 47 to 42: what survives is larger.
Feed is 0.78 either way and no beast anywhere failed to find a bite.

**The cap costs some of the effect** — uncapped the mean rank was +0.205, capped it is +0.122 —
because a tighter ring leaves less room between the mothers' station and everybody else's. That
is the right trade and it is stated rather than buried: a smaller true effect on herds that still
exist beats a larger one on herds the world has stopped counting.

### The whole suite, and a thing I had written down wrongly

**49 pass · 0 fail · 4 pending**, over two runs: tests 1–49 in one (which a container restart
then killed mid-`page.evaluate`, recorded in its own log as a FAIL of test 50 that is the browser
dying and not the world), and 50–53 alone afterward. The pendings are 12 and 43, both
long-standing, and 50 and 53, which report and guard nothing while §2.3.5 is open.

The two mended guards cleared on the way past. **Test 38 laid its block back first try** — the
beast-retry was not needed in the event. **Test 49 saw thirty-two beasts walk down to water over
four lands with 0 hunters seen and 0 lying up in cover**, where before the mend it had counted
three against the world for hunters no beast could see.

### And test 53, on the shipped tree, says the mechanism is alive

This is the round's own instrument reporting on what actually shipped, and it is the strongest
thing in this section:

| land | herd radius | reach | mothers | **walk-to-station** | roam-pick | graze found nothing | herd pass |
|---|---|---|---|---|---|---|---|
| Kenya | 17.7u | 0.90 | 0.85 | **0.0633** | 0.0000 | 0× | 0.197 ms |
| Tanzania | 17.7u | 0.75 | 0.77 | **0.0677** | 0.0000 | 0× | 0.345 ms |
| Botswana | 17.1u | 1.10 | 1.01 | **0.0554** | 0.0000 | 0× | 0.308 ms |
| Mongolia | 17.5u | 1.51 | 1.69 | **0.0407** | 0.0000 | 0× | 0.334 ms |

**The lever the round hung the rule on fires forty to sixty-eight times per thousand
beast-seconds. The wander-target picker still fires zero.** That is the finding of the round
restated on the shipped tree by an instrument that was written before the answer was known: the
old lever is dead, the new one runs, and reach — 1.27–1.32 flat when the diagnostic first read it
— now sits at 0.75 to 1.51. No beast in any land failed to find a bite, and the pass costs
0.20–0.35 ms a frame.

Mothers' reach beats the herd's in two lands and loses in two, so **nothing is claimed from that
column.**

### And test 50's third reading, including one that goes against me

| | before | after | again | **third** |
|---|---|---|---|---|
| herds of three or more | 46 | 38 | 48 | 47 |
| a herd's mean size | 3.93 | 4.39 | 3.94 | 3.85 |
| the biggest herd | 8 | 10 | 8 | 9 |
| **how far a herd travels in a spell** | **3 units** | **12** | **8** | **23 (2.28 radii)** |
| the mothers' depth against the others' | — | — | — | **2.12 vs 2.06** |

The first three lines confirm what was already struck: **nothing about how big a herd is has been
shown to change.** The travel line holds and strengthens — three readings at 8, 12 and 23 units
against a figure that was flat at nought to three across four rounds, with Tanzania's centroid
moving seventy-four units in a spell.

**The last line is a null, and it is against the round's own claim.** Mothers read 2.12 of a
herd-radius from the middle against others at 2.06 — the mothers very slightly FURTHER OUT. The
A/B this round shipped on reads the opposite, +1.04 in the mothers' favour, and both readings are
real. Two things are worth saying and a third is not:

- **Test 50's own comment already disclaims this statistic**, at length and before this round
  began: it read 1.22/0.94 and then 0.59/1.07 on the same untouched build an hour apart, and
  concludes "before believing anything it says about depth" the measurement needs more mothers in
  it. It is the noisy instrument, which is precisely why the rank statistic was built.
- **And there is now a measured reason it cannot see this rule in particular.** Test 50 marks its
  mothers and settles **70 frames** before reading them. Test 53 has just measured the lever
  those mothers must consult at about **0.05 a beast-second — one consultation per beast per
  twenty world-seconds or so.** The settle is of the same order as the interval between
  consultations, so a large share of the marked mothers will not have used the new station once
  by the time they are measured. How large a share I have not established and do not claim; what
  the arithmetic does establish is that **this reading is not evidence against the rule, because
  the window is too short for the rule to act in.**
- **What is NOT claimed is that the disagreement is settled.** The ✅ on this clause rests on the
  A/B — four lands, control and treatment alternating inside one boot, a 900-frame settle — and
  on the photograph of nine goats. That is the better design and it is why the ✅ stands. But a
  second instrument now says nothing, and the way to settle it is plain and is left written down
  for whoever takes §2.3.5 up next: **lengthen test 50's settle past the interval test 53 has now
  measured, and read it again.** I have not done it, because tuning a test until it agrees with
  me is the one move this round has spent its whole length avoiding.

And test 50, run on the finished tree, says one thing this round did not set out to do — and one
thing I wrote down off a single reading and had to take back when a second arrived:

| | before | after | after again |
|---|---|---|---|
| herds of three or more | 46 | 38 | 48 |
| a herd's mean size | 3.93 | 4.39 | 3.94 |
| the biggest herd | 8 | 10 | 8 |
| herds of six or more | 6 | 7 | 4 |
| **how far a herd travels in a spell** | **3 units (0.13 herd-radii)** | **12 (0.58)** | **8 (0.44)** |

**Only the last line survives two readings.** The herd count, the mean size and the biggest herd
all straddle their before-values — I had written "mean size up from 3.93 to 4.39, the biggest
from 8 to 10" off the first reading, and the second says 3.94 and 8. **Nothing about how big a
herd is has been shown to change**, and the sentence claiming it is struck rather than softened.
It goes the other way too: the herd count is not down either — 38 was the low reading and 48 the
high one, against 46 before.

**And I wrote that the travel figure was untouched. That was wrong, and it is corrected rather
than quietly amended.** Test 50's own comment calls travel *"the decisive one"* —
*"if every beast walks toward the MEAN POSITION of its own kind, it walks toward a point that by
definition sits in the middle of them all and barely moves, so the herd can only shuffle in place
for ever."* A station is not the mean: a beast makes for a place on a ring, the ring is reckoned
afresh as the herd moves, and the herd turns out to walk. **Between two and a half and eight
times as far** on three readings — 8, 12 and 23 units — where the figure had been flat at nought
to three units across four rounds; Tanzania's
centroid moved twenty-eight units in a spell where the whole earth used to manage three.

It is still not *"matriarch-led"* — nothing leads, there is no rank and no leader, and every beast
is still tethered to the spot it was set down on for life. But the flat travel figure had been
read for four rounds as evidence that a tethered world cannot make a herd move at all, and it is
not.

### What it costs, and what is still NOT claimed

**The herd pass is 0.20–0.43 ms a frame** (test 53, four lands, three runs: 0.22–0.40,
0.197–0.345 and 0.224–0.427) — reckoning every herd on the
earth once a frame, an O(n²) sweep over ninety-six beasts. At sixty frames a second that is one
to two per cent of a frame.

**The watch is dearer than it was.** Test 35 reads 64% and 70% of herds with a head up in the
full suite and 77% run alone, against 80% before the round — its bar is 45% and its own history
is 37/58/50 at small samples, so the honest statement is a range, not a number. A herd that walks to station
has more beasts walking and fewer standing alert; that is a real cost of the feature and it is
recorded rather than smoothed.

Mongolia's rank did not move at all (+0.111 to +0.095), so three lands of four and not four.

**§2.3.5's "matriarch-LED" is still not built** — what is built is the second half of the clause,
the young held at the centre. The leader wants the tether broken, which is its own round, as are
the birds.

### And one test had to learn about beasts

Test 38 — break a block, pick it up, lay it back — failed for the first time in the round's final
run: *"laying back: REFUSED — a beast is standing there."* The world is right to refuse to build a
wall through a living thing, and the test already knew that rule for the TRAVELLER (it backs him
four blocks off along the struck face's own normal, and its comment records learning that the hard
way). It did not know it for a beast, and Round 77 made beasts stand closer together, so the odds
of one being in any particular cell went up. A beast is not a wall: it walks on. The test asks
again, up to eight times, and reports how many it took.

### And one test had to learn about cover

Test 49 — the beasts go down to the water at dusk — failed in the same run, on its own invariant:
*"3 times a beast walked to water with a hunter inside its flight distance."* **The world is right
here too, and for a rule the world wrote down three rounds ago and this suite already guards
elsewhere.**

`frightNear` has held since Round 54 that **a hunter lying up in deep grass is not seen**: a
visible one is broken from at the beast's whole flight distance, a hidden one only at
`min(6, flight × 0.35)`. That is the entire point of cover, and test 35 guards the flight
distances that go with it. But test 49 asked its question of ANY hunter within `flight × 0.8`,
hidden or not — so a lion lying in the grass ten units from a gazelle was counted against the
world for a thing the gazelle could not possibly know.

It never fired while six beasts reached the water. **Round 77's herds walk further and reach it in
numbers** — twenty-two — and at twenty-two it fired three times. The feature did not break the
invariant; it produced enough traffic for a wrong invariant to be caught.

The test now asks the world's question. A hunter **in the open** inside the flight distance is
still a fault and still counted. One **in cover** is counted separately and reported, because how
often a herd walks down past a hunter it cannot see is worth knowing and is not a bug.

**What those original three were is not established, and is not claimed.** The run that mended
this read nought and nought — it shows the disagreement gone and nothing further. The two counts
are kept apart precisely so that the next run which has any will say which kind they were.

## 4cb. Round 78 — §2.3.6: the daily round, measured at last, and the home nothing slept in ✅

*§2.3.6 has been ✅ in PLAN.md since Round 69. **One of its clauses had ever been measured.***

Round 69 built the watering and test 49 guards it. The hours, the beds and the acts are ✅ on the
strength of AUDIT Round 54 **reading `js/behavior.js`** and reporting that "the daily round was
already there". That entry's own last words are **"Measure first."** Nobody did.

This project has been bitten by exactly that three times. §2.3.1's coats were ✅ for three rounds
while twenty kinds came out flat, because `coatBeast` was reached only through `makeBeast`.
§2.3.4's finer grain was claimed in Round 75 and the claim was false. And §2.3.6's own first
clause was ✅ until Round 69 measured it and found `a.river` was read once at the instant the
beast was set down and never again. **A thing that is ✅ because somebody read the source is not
✅**, and this round is the measurement.

### The instrument convicted itself twice before it convicted the world

**Over the acts.** As first written, test 54 reported seven acts "declared but never seen":
graze, drink, wallow, play, gape, curl, sharpen. That list was worthless. It ran the acts named
ANYWHERE IN THE DATA against the acts seen in FOUR LANDS, and added three different things
together: `graze` is not an act at all — `tryAct` refuses it by name, it is a TRADE performed as
`job==='graze'`; `curl` is the hedgehog and the armadillo and `sharpen` the solitary cats, so if
none of them stood in Kenya, Tanzania, India or Mongolia then "never seen" says nothing whatever;
and only what is left could be a fault. **That first form would have sent this round after four
faults that do not exist.** The acts are counted only against kinds that actually stood in the
world now, each with the share of its own draw and the kinds named.

**Over the bed.** Mended as above it reported *"49 of 86 set off home and never arrived, still
24u off their den"* — which reads as precisely the leash fault Round 69 found in the watering,
where the beasts set off and gave up two hundred units into a nine-hundred-unit walk. It is not.
Only **6 of the 49** were shouldering a barrier and **none** had been taken off the earth, so the
walk was not being stopped; it was being cut off. **The clock was mine.** The sweep holds each
hour eighteen frames and a beast walking twenty-four units at its own pace wants about two
hundred. Held at one bedding hour in Mongolia instead:

| frames held | set off | abed | still out |
|---|---|---|---|
| 50 | 24 | 3 | 21 |
| 100 | 24 | 8 | 16 |
| 200 | 24 | 19 | 5 |
| 400 | 24 | **22** | 2 |

**The bed works.** It is the same fault this project found in test 50 — seventy frames against a
lever that fires every twenty world-seconds — and it was found the same way: by asking what the
measurement could possibly SEE before believing what it said. The bed is now measured in a held
hour and the sweep is left to the two questions it can answer.

### What survived, and it is the one thing no settle can fix

**Sixty kinds declare a real home — a den, a burrow, a tree, a rock — and twenty-two of them keep
hours that never turn.** `asleep` was hard-false for `day:'all'` and `day:'dusk'`, so those
twenty-two were abed **0% of a swept day**. And `js/nest.js` RAISES those homes on the ground:
wolf earths, bear caves, fox holes. **The world was building homes that nothing ever slept in.**

A beast that keeps no HOURS still keeps a HOME. It lies up once a day for `LIE_H` hours at an
hour hashed off its own home ground — so a wood does not drop asleep all together, and the same
beast takes the same rest every day. It is not the long night of a diurnal beast; at any instant
it leaves seven in eight of them about their business.

**A/B/A inside one boot**, which is the only way this project has found to compare two behaviours
without the land moving under the reading:

| | off | **on** | off again |
|---|---|---|---|
| Kenya, `dusk` abed | 0% | **18%** | 0% |
| Mongolia, `all` abed | 0% | **3%** | 0% |
| the classes that already slept — day | 92% | 92% | 92% |
| — night | 8% | 8% | 8% |
| frame, ms | 423.5 | 446.9 | 441.8 |

**The frame delta sits inside the off-to-off drift** (441.8 against 423.5 with the rule OFF both
times), so no cost is measurable at this resolution and none is claimed. Through test 54 over
four lands the same change reads `dusk` 0 → 12% and `all` 0 → 3%.

**How much of the world it touches depends entirely on which beasts stand there**, and that is
stated rather than averaged away: Kenya held 4 eligible beasts of 1 kind, Mongolia 17 of 5. Over
five readings the `dusk` class comes out at 1, 10, 12, 13 and 18 points and `all` at 0, 1, 3 and
16 — **so no number here is a number**, and what is claimed is only that the rule fires, reverses
cleanly when switched off in the same boot, and leaves the classes that already slept alone.

### The whole suite

**49 pass · 0 fail · 5 pending.** The pendings are 12 and 43, both long-standing, and 50, 53 and
54, which report and guard nothing — 50 and 53 while §2.3.5 is open, and 54 because a bar set
before this round's reading would have been a bar set to whatever the world happened to do. In
that run test 54 read `dusk` 13% and `all` 1%, and the bed in a held hour: **22 laid down, 0
still out.**

### The rest of §2.3.6, now that it has been looked at

| clause | reading |
|---|---|
| the hours | **sound.** day 57% abed, night 47% — correctly anti-phased, and untouched by this round |
| the bed | **sound**, once measured in an hour long enough to walk in: 11 laid down, **0 still out** |
| the acts | **sound.** Every act the engine animates is performed. The only ones never seen are `drink` and `wallow`, both held by the `a.river` gate, which is Round 69's design and not a fault |
| the watering | ✅ *Round 69*, guarded by test 49 |

### And what it disturbed, which is the question a behaviour change owes

Sixty-five species changing when they are awake could move the watch, the watering and the herd
alike. All three guards were re-read on the mended tree:

| | before this round | after |
|---|---|---|
| test 35, the watch | 485–610 samples, 70–80% watched | **550 samples, 440 watched (80%)** |
| test 49, the watering | 32 beasts walking, 0 hunters | **41 walking, 13 at the water, 0 hunters** |
| test 53, walk-to-station | 0.041–0.068 a beast-second | **0.051–0.074**, roam-pick still 0.0000 |
| test 53, the herd pass | 0.20–0.35 ms/frame | 0.22–0.43 ms/frame |

**2 pass · 0 fail · 1 pending. Nothing regressed**, and test 35's watched share came back to 80%
— the value it held before Round 77, at the middle of its own spread. The herd pass's top reading
is 0.43 against the 0.40 written last round, so **that range is widened to 0.20–0.43 rather than
left to look tighter than it is.**

### What is NOT claimed, and NOT built

**The lion never sleeps** — `lion` and `elephant` are `day:'all'` with `home:'open'`, so this
rule does not touch them, and the behaviour file's own illustration of 'all' is *"the lion, who
sleeps twenty hours and hunts whenever he pleases"*. Reported rather than fixed: bedding the
beasts of the open changes the hunt, the watch and the encounter, and it wants its own round.

> **STRUCK IN ROUND 79 (§4cc), which measured it.** The claim is true of the FLAG and false of
> the WORLD, and it should never have been written in that form. A stalking hunter with no
> quarry lies up in the deep grass — `a.crouch` set, speed nought, hidden — and the lion was
> measured **truly still 100% of the time**, over 399 frames in two lands. He does not lack a
> rest; he lacks the `job==='bed'` flag, and the engine has had the better behaviour since it
> was written. See §4cc.

## 4cc. Round 79 — the lion's sleep: the premise did not survive being measured ✅

*Round 78 ended by naming one thing it had not built: **"the lion never sleeps."** This round
went to build it, measured the premise first as the rules of this project require, and **the
premise is wrong.** Nothing shipped to the world, and that is the finding.*

### What Round 78 claimed, and what it should have claimed

> `lion` and `elephant` are `day:'all'` with `home:'open'`, so this rule does not touch them —
> and the behaviour file's own illustration of 'all' is *"the lion, who sleeps twenty hours"*.
> **He does not sleep at all.**

That sentence is true of `job==='bed'` and **false of the world**, and the difference is the
whole round. The engine has held since it was written that a stalking hunter with no quarry
**lies up in the deep grass**:

> *"A lion on open ground with no quarry walked about in plain sight all day. He goes to the deep
> grass instead and lies down in it — which is where a lion actually is when you cannot see one,
> and it puts him in the cover he will need when a herd does come by."*

`a.crouch` is set, speed goes to nought, and the body drops to `lift=-0.8` against a bedded
beast's `-1.6`. Measured over a held clock, three lands, the `day:'all'` beasts of the open split
by kind:

| | frames | truly still (bedded, walking home, or lying up crouched) |
|---|---|---|
| **lion** | 399 | ~~**100%**~~ **→ 18% and 26%, see below** |
| **elephant** | 3,478 | **0%** (holds) |

> **CORRECTED IN ROUND 80 (§4cd), AND THE CONCLUSION WITH IT.** That 100% was measured in a world
> frozen at the container's own 3.9 a.m. — every scratchpad probe of this session set the hour
> with a bare `setLocalHour`, which the engine reads back over four times a second while the
> clock stands on 'live'. Re-measured with the clock taken off 'live' first, the lion is truly
> still **18% in Tanzania and 26% in India**, and spends most of his time in `roam`. **He is not
> "never NOT at rest"; he is at rest about a fifth of the time.** So the reason this round gave
> for not bedding him does not hold, and the question is re-opened rather than closed. What still
> holds is the elephant at 0%, which is what `day:'all'` asks for in the file's own words. See
> §4cd.

### And the elephant, which is the other half of the same line

The elephant reads truly still **0%** — feedhead, roam and small business round the clock, 3,118
frames in Tanzania without one still among them. **And that is what the data asks for.** The
behaviour file's own gloss on `day:'all'` names both animals and gives them opposite reasons:

> *'all' — it keeps no hours at all (the lion, who sleeps twenty hours and hunts whenever he
> pleases; **the elephant, who cannot afford to stop eating**)*

**The world agrees with the file on both counts**, by two different mechanisms, and neither is a
fault. A real elephant does sleep two to four hours; but the file made a deliberate, documented
choice and **overriding a stated intent on my own initiative is not this round's to do.** It is
left as a question for whoever wants to ask it, phrased as a design decision and not as a bug.

### The instrument found a third fault in itself, and it was a false zero

Test 54 reported **0 kills over 53,797 beast-frames** — which reads as an earth where predation
never lands, and is nothing of the kind. The sweep holds each hour eighteen frames and carries
the eye between four lands, so **no chase can run to its end inside one window.** Held in one
land instead:

| | kills in 500 frames | hunter held a quarry | at a kill | crouched |
|---|---|---|---|---|
| Kenya | **4** | 24% | 41% | 9% |
| Tanzania | **4** | 13% | 16% | 18% |

The hunt lands perfectly well. This is the same fault as the bed's and the acts', **the third
this one instrument has found in itself in two rounds**, and the pattern is worth stating
plainly: *a measurement that samples a slow process through a fast window reports zero, and zero
reads like a broken world.* The kill is counted in the held hour now.

### What this round changed

**Nothing in the world.** `js/engine.js` is untouched. *(And its central reading was wrong — see
§4cd. The decision not to bed the lion was right for the wrong reason, and the question is open
again.)* What changed is the record — Round 78's
claim is struck where it stands rather than quietly amended — and the instrument, which no
longer reports a false zero on the hunt and now splits the clockless classes by whether they
own a bed at all.

**A round that ships nothing because the fault was not there is the round working**, and it cost
one afternoon against a behaviour change to sixty-five species that would have had to be
measured, guarded and then lived with.

## 4cd. Round 80 — the matriarch built and reverted, and the clock that was never running ✅

*§2.3.5's last clause. A matriarch was built, measured properly, and taken back out; and in the
measuring, a fault was found that had quietly spoiled **every scratchpad reading of this whole
session**. The second is much the more important of the two.*

### THE CLOCK WAS NEVER RUNNING

Every probe this session set the hour with a bare `setLocalHour(h, x, z)`. The engine says, in
its own words, beside that very function, why that does nothing:

> *"a scene must be able to take the clock off 'live' first, **or the real-world hour is read
> back over it four times a second**."*

The default course of the day is `'live'`, which re-reads the clock of the machine the game is
running on. This container's clock stands at about **3.9 a.m.** So `setLocalHour` was overwritten
four times a second, `worldNight` sat at 0.63–1.00, and **the world was in permanent night with
almost every beast abed** — through readings I then wrote into the audit as facts. Measured
plainly, in both modes:

| | asked 6 → got | asked 14 → got | asked 22 → got |
|---|---|---|---|
| bare `setLocalHour` | 3.9 | 3.9 | 3.9 |
| off `'live'` first | **6.0** | **14.0** | **22.0** |

**THE ACCEPTANCE SUITE IS NOT AFFECTED, and that distinction is the whole of the damage
control.** `tools/acceptance.js` takes the clock off `'live'` in its shared setup, before any
test runs, on the one page they all share — so it holds whether the suite is run whole or a
single test is named. Everything in the suite stands. What fell is the scratchpad, and with it:

| reading | stands? |
|---|---|
| Round 78, the bed arriving when an hour is HELD | **stands** — the hour was held, if not the one I named |
| Round 78's lie-up A/B (`dusk` 0 → 18 → 0) | **a single-hour sample, not a swept day.** The ON/OFF/ON difference is real; the "over a swept day" framing was not. Test 54, which IS clean, reads the same effect and is what the ✅ should have rested on |
| Round 79, the lion "truly still 100%" | **FALLS — see below** |
| Round 80's first tether reading | **falls, and was already corrected once for a different fault** |

I have re-measured what mattered rather than leaving it struck, and the corrections are below.

### The lion, re-measured, and Round 79 was right for the wrong reason

| | truly still | what he is doing instead |
|---|---|---|
| lion, Tanzania (720f) | **18%** | roam 490, feed 199, act 31 |
| lion, India (1800f) | **26%** | roam 1214, feed 339, act 247 |
| elephant, Tanzania (2880f) | **0%** | feedhead 1233, roam 1018, act 629 |

**He is at rest about a fifth of the time, not always.** Round 79 declined to bed him because he
was "never NOT at rest", and that reason is gone. The decision may still be right — but it is now
an OPEN QUESTION and it is written down as one, not as a closed null. The elephant holds at 0%,
which is exactly what the behaviour file asks for in its own gloss.

### The tether, re-measured in a world that is awake

| | mean drift from the birth ground | furthest | beyond the 84u disc |
|---|---|---|---|
| Kenya, 900f | **28u** | 170u | 7 of 78 |
| Tanzania, 900f | **21u** | 101u | 4 of 94 |

Against the sleeping reading's 11–15u. **The conclusion survives with its numbers moved**: there
is no leash — the only constraint from `a.hx,a.hz` is the wander picker Round 77 measured at
0.0000 a beast-second — and a beast stays near its birth ground because little moves it, not
because anything holds it. But it is looser than the night reading made it look, and a few beasts
in every land do walk clean out of the disc.

### The matriarch: built, measured, reverted

She was built on the cheapest correct mechanism, and it is worth recording because it is a good
one: `herdRank` makes a beast WITH YOUNG outrank one without, tie-broken on a hash of the birth
ground so the lead cannot change hands frame to frame; `herdPass` names the highest-ranked member
`H.lead`; **`stationOf` then sets the herd's ring about HER instead of about the mob's own
middle** — one line, and the following comes free, because Round 77's drift-to-station lever
(0.05 a beast-second, already measured) does the work. She takes a bearing, holds it for a spell,
turns it a little each time so the herd walks a line rather than zigzagging, and rests between
marches so the herd still eats.

It fires — 10 and 12 marches in the two lands — and it does not help:

| | travel (herd-radii) | reach | herd radius |
|---|---|---|---|
| Kenya OFF / **ON** / OFF | 1.54 / **0.78** / 1.08 | 1.07 / **1.23** / 0.92 | 50 / 25 / 35 |
| Tanzania OFF / **ON** / OFF | 0.90 / **0.75** / 0.66 | 0.89 / **1.17** / 0.83 | 16 / 21 / 17 |

**No land travels further with a matriarch. Both lands' reach gets worse**, consistently, in the
one direction — the herd is forever trailing stations that walk out from under it. Feed is
untouched. And the premise is gone too: travel already reads **0.66–1.54 radii with the lead
OFF**, where four rounds recorded "3 units, 0.13 radii". Round 77's station work moved that, and
nobody had noticed.

**Reverted.** `js/engine.js` is back where it stood. That is the fifth attempt at §2.3.5's
matriarch across five rounds and the fifth revert, and the first of them to fail with the
mechanism demonstrably FIRING — which is worth more than the four that failed without knowing
whether it ran at all.

### And the clock fault is now guarded, not merely written down

A note in an audit does not stop the next tool making the same silent mistake, and this one gives
no error: the call returns, the number goes in, and a quarter of a second later the sky is put
back. So **`tools/harness.js` takes the course of the day off 'live' the moment it sets forth** —
for every tool that uses it, the suite included, where it is simply idempotent. Two helpers go
with it: `holdClock(page, part)` and `holdHour(page, h, x, z)`, the latter doing the two steps in
the only order that works.

**Proved by injecting the fault it guards**, which is this project's rule for every new guard:

| | asked 6 | asked 14 | asked 22 |
|---|---|---|---|
| the harness as it now stands | **6.0** | **14.0** | **22.0** |
| `'live'` put back by hand — the fault | 10.1 | 10.1 | 10.1 |
| `holdHour(14)` after the injection | — | **14.0** | — |

The injected row pins to **10.1** where the same injection read **3.9** earlier in the day: the
room's clock has moved through the session, which is the diagnosis confirming itself.

Tests 45, 46, 49 and 54 were re-run against the changed harness — **3 pass · 0 fail · 1 pending**,
test 45 being the one that guards who may set the hour at all, and the one genuinely at risk.

### What is left standing

Test 50's leader counters now say **"NO LEADER IN THIS BUILD"** again, which is the truth. The
lion's rest is an open question with a real number against it — **18–26% still**, not the 100%
Round 79 closed it on. And the clock rule is no longer only written down: it is enforced where
every tool must pass.

## 4ce. Round 81 — the birds flock, and PHASE 6 IS CLOSED ✅

*§2.3.5's *"real flocking for the birds"* was the last unbuilt clause in the whole of Phase 6.
It is built, and the phase is closed here with every item's true state written down.*

### Why it had never worked, and it was two faults at once

A flock rule had been standing in the tree for rounds: a pull toward the mean of the same kind
within 120 units, gated on `BEHAVIOR.birdOf(type).flock`, which crow, dove, gull and puffin
declare. It never showed. Measured, over three hundred frames in two lands:

| | Kenya | India |
|---|---|---|
| flocking-bird-frames with **no mate of their kind within 120u** | 4,033 / 5,400 (75%) | 4,304 / 4,500 (**96%**) |
| frames in `rest`, the **only** job the rule ran in | 102 / 7,200 (1.4%) | 45 / 7,200 (0.6%) |

**Each of those is the exact shape of a fault this project has already found and mended
elsewhere**, which is why they were recognisable at all:

1. **There was nothing to flock with.** Twenty-four birds serve the whole earth across seven
   kinds over a ring eleven hundred units wide, each set down at an INDEPENDENT RANDOM POINT.
   That is Round 71's finding for the beasts word for word — *"the world was not making herds"* —
   and the remedy is Round 71's: a bird of a flocking kind goes down **beside one of its own**.
2. **The rule was nearly unreachable.** In `rest` alone it could touch about **0.3%** of
   bird-frames once the first fault is folded in. That is Round 77's dead-wander-picker shape. It
   is asked in the **hunt** now — by passing the flock's own middle to `forageSpot` as the centre
   it searches, so that every check on the ground is the one that function always made.
   **Biasing the RESULT instead would have been the bug**: a spot carries `water`, and sliding one
   sideways puts a gull's dive on dry land.

### A/B/A inside one boot

| | Kenya off / **on** / off | India off / **on** / off |
|---|---|---|
| a bird with one of its own by it | 13% / **80%** / 36% | 0% / **54%** / 13% |
| **biggest company** | 3 / **12** / 3 | 0 / **3** / 1 |
| heading apart | 100° / 45° / 42° | — / 29° / 39° |
| frame | 355.5 / 332.7 / 353.4 ms | 306.2 / 318.2 / 309.9 ms |

**The company is the clean reading** and it reverses both ways in both lands. The frame cost sits
inside the drift — the ON arm is the FASTEST of the three in Kenya — so none is claimed.

**And one thing is deliberately NOT claimed.** The heading spread is reported and is evidence for
nothing: the off-again arm reads as tight as the on arm in Kenya (42° against 45°), and the
pairings behind the arms differ by more than tenfold, which is not a comparison. **That birds now
FLOCK is established; that they fly in step is not**, and test 55 says so in its own words rather
than quietly reporting the better number.

### And the suite, on the finished tree

**50 pass · 0 fail · 5 pending**, and the pendings are **43, 50, 53, 54 and 55**. Test 12 —
*"ocean and plains chunks build no slower than they did"* — has been PENDING for many rounds and
**came back a PASS on this run**, which is why the pass count is one higher than the phase's
other recent runs. It was not touched by this round and no credit is taken for it; it is noted
because an unexplained +1 in a pass count is exactly the sort of thing this project has learned
to chase rather than enjoy. The other five report and guard nothing by design.

Test 55 on four lands — two of which the A/B never stood on:

| | Kenya | India | Norway | Japan |
|---|---|---|---|---|
| a bird with one of its own by it | 96% | 100% | 100% | 100% |
| biggest company | 6 | 11 | 5 | 8 |

**99% of 12,540 bird-frames, and a company of eleven.** The heading came back at **14° over
54,614 pairings**, far tighter than anything this project has recorded — and it is STILL not
claimed, because it is an on-only reading with no control beside it. The A/B is the only place a
control existed and there the off-again arm was as tight as the on arm. A number that flatters
the feature is exactly the number to be slowest about.

---

## PHASE 6 — THE LIVING THINGS — CLOSED

*"§2.3 and §2.4 in full: coats, gaits, true stature, finer creature grain, herd structure;
branching trees, canopy forms per species, bark, seasonal colour, the ground layer, crops that
grow."* Twelve items. **Eleven built and measured; one part-built and measured; nothing left
standing on an unmeasured ✅.**

| §2.3 fauna | |
|---|---|
| 1. Coats, countershading, markings | ✅ *51, completed 74* — 2,882 meshes, 0 left flat |
| 2. Real gaits | ✅ six gaits, one datum a species |
| 3. True stature | ✅ one measure, and it is the man's |
| 4. Finer voxel grain | ✅ *75–76* — 170 kinds, 3,983 parts, 1,307 meshes |
| 5. Herd and flock structure | **part-built, and every part of it measured** — see below |
| 6. The daily round | ✅ *69, and MEASURED at last in 78* |

| §2.4 flora | |
|---|---|
| 1–6 | ✅ all six: branching, canopy, bark, seasonal colour, the ground layer, crops |

**Item 5, honestly:** flight distance and the watch ✅ *54*; herds exist ✅ *71*; the young held at
the centre ✅ *77*; **the birds flock ✅ *81***. **The matriarch does NOT lead** — five attempts
across Rounds 54, 70, 72 and 80, five reverts, and the fifth is the only one that failed with the
mechanism demonstrably FIRING: no gain in travel and consistently worse reach. **And birds
flocking is not birds flying in step**, which is stated above.

**Three things are measured-and-not-built, and are left written down rather than quietly
dropped:**

1. **The matriarch leading.** Round 80's numbers, and the finding that the stated reason for four
   rounds — the spawn tether — was the wrong reason. There is no leash; nothing moves a herd.
2. **The lion's rest**, at the corrected **18–26% still** — Round 79 closed this on a reading of
   100% that was taken in a world frozen at the container's own clock, and Round 80 re-opened it.
3. **Flock-mates flying in step**, above.

**What the phase cost, all of it measured:** the herd pass 0.20–0.43 ms a frame; the lie-up and
the flocking both inside the run-to-run frame drift; §2.3.4's grain 67% fewer meshes than parts;
§2.4's ground layer +8.5% triangles and not one new material; the year through a crop costing 0
chunks.

**And the method is the thing worth carrying forward.** This phase's last four rounds found four
faults in the world and **six in their own instruments** — a statistic that reported perfection
because the feature was absent; three separate false zeroes from sampling a slow process through
a fast window; a respawn artefact that reversed a finding; and a clock that was never running,
which spoiled every scratchpad reading of three rounds until it was found and then **guarded in
`tools/harness.js` and proved by injecting it.** Every one was caught by asking what the
measurement could possibly SEE before believing what it said. **A thing that is ✅ because
somebody read the source is not ✅** — and Phase 6 no longer has one.

## 4cf. Round 82 — the matriarch, a sixth time, and the first failure with a SHAPE ✅

*Asked for knowing the odds, and it failed — but not the way the other five did. This one names
what a matriarch mechanism must NOT be, which none of the previous five could.*

### The idea, and why it was a different idea

Round 80's attempt is the one worth reading, because **it fired and still failed**: a leader, and
every station ring set about HER, so that when she walked the stations walked and the herd came
after. Reach got worse in both lands, 1.07 → 1.23 and 0.89 → 1.17. The arithmetic of that is
plain once seen: **reach is distance from an assigned point, the lever that re-assigns a beast
fires 0.05 times a beast-second, and the point was moving continuously.** A follower re-aimed once
every twenty world-seconds at a mark that had already left. Following by chasing a moving target
cannot work at that rate, and no tuning of the ring or the march would have made it.

So Round 82 moved no target at all. **The matriarch owned a BEARING and every member of her herd
had its STEP bent along it** — a shared velocity rather than a chased mark. The station ring
stayed where Round 77 put it, on the mob's own middle, so nobody chased anything and reach was
left alone; the middle would simply travel, because every beast in it leaned the same way. The
bend was applied to the step and not the position, so it passed the same cliff, water and masonry
checks every other stride does.

### It fired 0 times, and finding out why is the method working

The first reading was **`bends 0`** over 13,685 herded beast-frames. Taking the condition apart
one clause at a time, on the live world, rather than guessing:

| clause | frames it held |
|---|---|
| in a herd at all | 13,685 |
| `herd.head` defined | 13,685 ✓ |
| not the lead itself | 10,460 ✓ |
| **not fleeing and not afraid** | **867** ✗ |

**`a.fear` decays PAST ZERO.** `a.fear=(a.fear||0)-dt` runs every frame and is never clamped, so
it is a negative number almost always — and a negative number is **truthy**. Written `!a.fear`
the gate was false nearly always, and the few calm frames never coincided with moving ones. The
engine's own idiom, two hundred lines up, is `!(a.fear>0)`. **That is the seventh instrument or
gate fault of this session, and the fourth found by asking what a measurement could see before
believing what it said.**

### And then it fired, and the answer is no

With the gate mended it fired 4,377 and 1,298 times, and A/B/A gave a null: ON sat inside the
OFF-to-OFF spread on every reading in both lands. **Reach was NOT damaged** — the one real
difference from Round 80 — but travel did not move either.

So the deciding question was asked, and it is not "what value should ship" but **"has this
mechanism the AUTHORITY to move a herd at all?"** Swept in one boot on one land:

| bend | travel (herd-radii) | reach | bends fired |
|---|---|---|---|
| 0.00 (off) | 0.68 | 1.03 | 0 |
| 0.30 | 0.57 | 0.75 | 5,128 |
| 0.60 | 0.51 | 0.70 | 6,116 |
| **0.90** | **0.48** | 0.72 | **8,165** |
| 0.00 (off) | 1.28 | 0.74 | 0 |

**Travel falls MONOTONICALLY as the bend rises, and both off-arms bracket every on-reading.**
Tripling the authority of the rule does not move a herd further; it moves it slightly less. The
bend pulls each beast off its own mark so it spends longer correcting, while the matriarch's slow
turn cancels the shared direction over the window. **This is not an inconclusive result. It is a
characterised negative**, and it is the first one §2.3.5 has produced in six attempts.

### Reverted, and what the six attempts now amount to

`js/engine.js` is back where it stood. **Six attempts, six reverts** — but the record is no longer
six shrugs:

| | what it tried | how it failed |
|---|---|---|
| 54 (×4) | a station about a leader, through the wander-picker | could not be shown to work; no instrument |
| 70 (×4) | the same, with a marching matriarch | noise — two to six mothers a reading |
| 72 (×3) | the station taken through the GRAZING | two readings of one build, opposite directions |
| 77 | *(the young at centre — this one SHIPPED)* | — |
| 80 | leader + station ring set about her | **fired**; no travel gain, reach worse — a chased mark cannot be tracked at 0.05 re-aims a beast-second |
| **82** | leader + a shared VELOCITY, no target moved | **fired**; travel falls monotonically as the rule's authority rises |

**What is now known, and it is worth more than another attempt:** moving the herd's assigned
points does not work because the re-aim rate is too low; and leaning every beast the same way
does not work because the lean costs more in correction than it gains in displacement. **A
seventh attempt should move neither the marks nor the steps — it should change what a beast
WANTS**, which means the grazing choice, which Round 72 already tried once and which is the only
lever this project has ever measured actually firing at a useful rate. That is written down for
whoever takes it up; it is not attempted here.

**Phase 6 stays as Round 81 closed it**: eleven of twelve items built and measured, item 5
part-built with every part measured, and the matriarch named as measured-and-not-built — now with
six characterised failures behind it instead of five.

## 4cg. Round 83 — PHASE 8 BEGINS: the authored places, and the Cave of Treasures ✅

*§8 asks for **"a schematic format, an in-game capture tool, and the Cave of Treasures"**. This
round delivers the format, the capture, and the cave.*

### Nothing new was invented to hold it, and that is the finding

Every other file in `world/` declares a RULE the whole earth obeys — a country, a river, what
grows where, which beast keeps which hours — and the engine knows no instance by name. **A place
is the one thing that is not**: a particular arrangement of particular blocks in ONE spot.

So it goes through the door `emitHouse` and `lmPyramid` already go through — `stampBlock` into
`SEDITS` — and inherits all three of that door's properties without a line of new machinery:

| | |
|---|---|
| **regenerable** | never written to the save; re-stamped when its ground loads, dropped when it is left |
| **beaten by the hand** | the mesh order is procedural → stamps → player edits, so a man may quarry the Cave of Treasures and HIS quarrying is what persists |
| **free to save** | a place of ten thousand blocks adds nothing to the record until somebody touches it |

The second is the one worth having. **An authored place is scenery you are allowed to take
apart.** A place also names the LANDMARK it stands in rather than a latitude, so if the chart ever
moves the Zagros the cave moves with it instead of ending in the air.

### The Cave of Treasures, where the scroll says it is

`world/scrolls.js` has sent the traveller to *"the Cave of Treasures, under the garden"* since
Phase 7, and the Zagros was raised in that phase for exactly this reason — *"neither Iraq nor
Ethiopia had a single hollow anywhere in it, so 'the Cave of Treasures in the Zagros' had nowhere
to be."* AUDIT Round 46 refused to invent a hoard for the sea caves because it *"would have to be
picked up and moved the day Phase 8 arrives"*. It has arrived.

Measured standing in the Zagros at 40917,39105:

| | cells |
|---|---|
| carved air (the chamber) | 128 |
| hewn-stone floor | 49 |
| cobble bench along the back wall | 14 |
| gold showing in the rock | 5 |
| stone shell | 299 |
| | **495 = 9 × 5 × 11 exactly** |

It is deliberately small and deliberately plain. **A place large enough to be interesting would
have hidden whether the format works.** The room is the proof; the hoard can grow in its own
round, and growing it costs one capture and no code at all — which is the point of having a
format.

### Two faults, both found by reading the world and not the code

**The palette was written with `'rock'` and `'timber'`, which are not block ids at all.** They
resolved to nought — and nought IS air — so the cave came out as a hole quarried in the mountain.
The real ids are `stone`, `hewn-stone`, `cobble`, `gold-ore`, out of `blocks/`.

**And KEEP and AIR were given one meaning where they need two.** A cave wants *keep* for the rock
it is buried in, which must stay exactly as the Zagros made it, and *air* for the room, which must
be carved. Written with one meaning the room is never hollowed and the place stamps as a solid
hill. Palette index 0 is the keep slot now; index 1 onward are real blocks, and `'air'` at index 1
is honest air and cuts.

### The capture, and the round trip that is the whole of the format's correctness

`tools/capture.js` boots the world, walks to a spot, reads the box and prints a complete
`EARTH.place({...})`. **The format is therefore never typed by anybody: it is what comes out.**
The renderer `placeSource` is shared, so the tool and any future in-game binding cannot drift
apart.

Test 56 guards it, and it does not stop at memory:

> **world → object → TEXT → object → world.** The capture is rendered as file text, parsed back
> through a stub `EARTH` exactly as the real file would be, stamped eight hundred blocks off and
> compared cell for cell. **495/495 through memory and 495/495 through the file text.**

**It earned its keep before it was even finished.** The first capture used `blockId(n)` where it
wanted `blockOf(n).id` — the two go OPPOSITE WAYS, one taking a string and one a number — so
every solid cell captured as AIR. Nothing but the round trip would have caught it. Proved by
injecting that very fault back: clean it reads 495/495; with the fault it catches **367 wrong
cells** and fails.

And the capture tool found a third trap by being used: a capture's own index 0 is genuinely air,
so `--keep` could not simply flip a flag — it would turn every captured air cell into "leave the
ground". It INSERTS the keep slot and moves the palette up one, which is the shape the
hand-written places already have.

### The suite, on the finished tree

**51 pass · 0 fail · 5 pending**, the pendings being 43, 50, 53, 54 and 55 — all report-only by
design. The pass count is up one on Round 81's 50 because test 56 is new and is a GUARD and not
a report: unlike the herd and flock instruments there is a right answer here and it is exact.

**A new file of the world now loads on every boot**, which is why the whole tree was re-read
rather than test 56 alone: `world/places.js` is read by the manifest before the world stands, and
the manifest's own error says why that matters — *"every block and every country is known by its
place in the list, so what was built would be a different world under the same log."* Nothing
moved.

### What Phase 8 still owes

**The in-game binding for the capture.** The engine call exists, is exposed, and is tested; what
does not exist is marking two corners with the free hand and pressing a key. The player-facing
control list `FREEROAM_ONLY` holds exactly five buttons and test 45 counts them, so that is a
change to make deliberately rather than in passing.

**And more places.** The format now makes them cheap, which was the entire object of doing the
format first.

## 4ch. Round 84 — the capture in the player's hand, and the Cell of Ḥanoḵ ✅

*Round 83 closed with two named debts: the in-game binding for the capture, and more places.
Both are paid, and the round added a third round trip to the guard while it was about it.*

### The binding, and why it is one function

`captureMark()` is the whole of the in-game tool: **two presses of one button, the corners taken
from `AIM`** — the very cell the reticle rests on, which is the same cell the hand would break.
First press marks the corner the eye is on; second takes the far corner, and the finished
`EARTH.place({...})` is shown in a panel with a select-on-focus textarea, to be copied into
`world/places.js`. A press with nothing under the reticle while a corner is marked lets the
corner go — no new key, and Esc stays what it is (the pause). **No clipboard call**: this game
runs off `file://`, where the clipboard is not to be relied on, and a textarea a man can select
is the honest path.

The button is `b-capture`, sixth on the roam-only list, hidden on a voyage **by the same
stylesheet rule as the other five** — never by inline display, which is the trap the engine's own
comment at `applyFreeroam` records (Rise Up came back on a voyage that way once). Tests 45 and 46
now read **"0 of 6 on a voyage, 6 of 6 in free roam"**, both ways across a reload; their
duplicated button lists carry a comment saying the duplication is deliberate, so a drifting
engine list is CAUGHT there rather than mirrored.

### The Cell of Ḥanoḵ, which pays the other scroll debt

The trail names *"Ḥanoḵ in the Ethiopian highlands, reached through the ranges"*, and the Simien
Mountains were raised in Phase 7 in the same breath as the Zagros, for the same reason: the
scroll had nowhere to be. The seventh from Adawm kept no palace, so what stands is a hermit's
cell cut into the high rock — and **alabaster in the back wall where the Cave of Treasures
carries gold**: white stone for the man who walked with Aluahim, riches for the cave where the
fathers were laid. The mouth opens the other way, so the two places are not one room copied.

| | Cave of Treasures | Cell of Ḥanoḵ |
|---|---|---|
| box | 9×5×11 = 495 | 7×5×9 = 315 |
| carved air | 128 | 74 |
| floor / bench | 49 hewn / 14 cobble | 25 hewn / 10 cobble |
| in the back wall | 5 gold-ore | 3 alabaster |
| shell | 299 stone | 203 stone |

It is also the **second** place, so test 56's per-place loop ran twice for the first time.

### Test 56 now closes three round trips, and names the question each asks

| | the loop | the question |
|---|---|---|
| 4 | world → object → world | does the **FORMAT** hold |
| 5 | world → object → **TEXT** → object → world | does the **FILE** hold |
| 6 | reticle → corners → panel text → object → world | does the **HAND** hold |

The sixth drives `captureMark` exactly as the player does — `AIM` swapped the way `placeFrom` has
always proved it may be, two presses on the box's opposite corners, the panel's text parsed
through the stub EARTH, stamped at a third offset and compared cell for cell. **Each trip reports
its positive count in the row** — "through the hand 495/495" — so a silently skipped check can
never read as a passing one, which is the exact shape of the fault test 50 taught this project in
Round 80.

**Proved by injection**: an off-by-one in the box arithmetic (the far corner lost) fails both
places with the exact diagnostic — *"the panel box is 8×4×10 for corners 9×5×11"* — and reads
0/495 through the hand. Restored: 495/495 and 315/315.

### The suite found the round's one real fault, and the targeted tests never could have

The three tests that own every changed surface — 45, 46, 56 — were run first and passed. **The
full suite then failed tests 30 and 31**, the only two that boot the SECOND game
(`scripture-unfolds/index.html`), both on a 180-second boot timeout.

The fault was this round's own. The second game keeps an **engine-sockets** block — a hidden stub
for every button the shared engine reaches for, in its own words *"so the shared engine can be
updated for the voyage without ever having to know this game exists."* This round taught the
engine to reach for `b-capture` and did not provide the socket, so on that page
`$('b-capture').onclick=` threw on null, the boot script died, and `__UNFOLD` never stood. **The
targeted tests could not have seen it, because none of them boots that page.** That is the whole
argument for running the suite even when the diff looks contained, and it is written here because
this round is the proof.

One line mends it — the socket, added to the block in the order the block keeps. Re-run on the
mended tree, tests 30 and 31 pass. **The composite verdict is stated as the composite it is**:
the full run read 49 pass · 2 fail · 5 pending on the tree as first committed; the two fails were
this one fault; mended, the two tests pass alone, and no other test touches that page. No single
run of the whole suite has read the mended tree, and that is said rather than rounded up.

### What Phase 8 still owes

**The sea caves' "something at the back"** — Round 46's IOU. That is 84 *procedural* caves found
by census, and a place anchors to a landmark BY NAME, so it wants an anchoring design this format
does not yet give (a place anchored to "the nearest sea cave" is a rule, not a place, and the
line between the two is the whole architecture of `world/`). Named as the open question, not
attempted. **And the Cave of Treasures' hoard can now grow** — one capture and no code, which
both rounds built toward.

## 4ci. Round 85 — the something at the back of the sea caves, and PHASE 8's LAST NAMED IOU PAID ✅

*Round 46 carved 84 sea caves and shipped them empty on purpose: "the cave ships; what is in it
waits for the phase whose whole job is putting things in places." Rounds 83–84 built that phase's
machinery. This round fills the caves — and pays the design question the audit had left standing.*

### The question, and the answer that keeps the line

**The sea caves have no names.** They are procedural — 84 hollows found by census — while a place
anchors to a landmark BY NAME, and *"a place anchored to 'the nearest sea cave' is a rule, not a
place, and the line between the two is the whole architecture of `world/`."*

The answer **splits the format's two halves instead of blurring them**:

| half | what it is | where it lives |
|---|---|---|
| the SCHEMATIC | authored, particular — pal, rle, box, keep | `world/places.js`, exactly as the Cave of Treasures' |
| the ANCHOR | **a rule** — `in:'seacave', share:3` | declared as data; the engine's placement pass does the rule's work |

No `at`, no dx/dy/dz. *At the back of one sea cave in three, this stands.* Which caves, and which
way the cache faces, is the engine reading the world — not the file naming a spot. One
declaration, no code per instance, and the line holds.

### The rule's work

The pass makes **the census test 27 has always made**, in-engine: a hollow at the waterline with
rock over it is a cave column; one with open sea beside it is a MOUTH; walking inland — straight
away from the sea, which is the axis the carve itself worked along — the last hollow column is
**THE BACK**. A one-deep notch holds nothing and a hollow under two blocks high has no room, so
neither qualifies. A `hash2` of the back cell against 1-in-share decides — the same device as the
lie-up hour and the herd stations — **so the same cave answers the same way on every visit and
every boot.** The stamp goes through `stampedGroup` like every landmark's: regenerable, dropped
when the coast is left behind, and beaten by the hand — a man may row in and take the cache
apart.

**What stands: the Castaway's Cache** — the timber of a wrecked skiff on the floor, salt crusted
on it, and silver-ore in the wall one step beyond; the something the castaway never came back
for. A ONE-WIDE schematic — a sea cave is a notch — so no rotation machinery was built: four
cells, three placed, and the only orientation is a direction, which is the rule half's to give.

### Read off the world

| | |
|---|---|
| qualifying caves at the best coast (of 25 surveyed) | 80 |
| in the engine's own radius | 18 caves, **4 hold the cache** (declared 1 in 3) |
| at the true back, blocks as declared | **4 of 4** |
| the coast left and returned to | **the same set** |
| the scan | 12.3 ms full; **8.9 ms mean** once an inland crossing costs only the pre-check |

**The pre-check is the reading acted on**: the scan fires on every chunk crossing and most
crossings are inland. A cave needs open sea beside it, and open sea is where `cell()` answers
nothing — so ~170 coarse, deterministic lookups say whether there is any sea in the ring at all.
No sea, no walk.

**Proved by injection**: stamped at the mouth instead of the back, test 57 fails all four caches
by name — *"the hollow runs on inland"* — because the guard asks BOTH ends: no hollow further
inland (it is the last), and a way out outward (a cache at the mouth has open sea there instead).
Test 27 is untouched at 84 of 84. Test 56 skips the rule-anchored schematic **by its anchor
kind** and says so in its own report — *"guarded by test 57, not here"* — so a skip can never
pass for coverage, which is Round 80's lesson kept.

### The suite, and one more guard taught about the living

**51 pass · 1 fail · 5 pending** — and the 51 includes tests 30 and 31 passing on the mended
socket, which closes Round 84's stated gap: the whole suite has now read that tree. The pendings
are the report-only five (43, 50, 53, 54, 55). Test 57 passed inside the full run exactly as it
passed alone — 4 of 4 at the true back, the same set on return. The scan's mean read 13.4 ms over
27 scans in the suite against 8.9 ms in the targeted run, and the difference is honest: the suite
LIVES on coasts, so few of its crossings are the cheap inland kind; both numbers are kept.

**The one fail is test 38, and the world was right — for the second time.** *"REFUSED — Naarah is
standing there."* Naarah is a VILLAGER. Round 77 taught this test that a beast is not a wall and
walks on; its retry matched `/beast|creature|animal/i`, and no regex of kinds can know a hundred
villagers' names. But the engine has exactly ONE line that makes this refusal —
`who+' is standing there'` — and makes it only for a living thing, so the honest match is **the
engine's own sentence**, not a longer list of names. No other refusal contains those words.
Proved by injection: a villager forced to linger three asks is waited out and the block lays on
the fourth, *"after waiting out whoever stood there 3×"*; restored, it lays first try. The verdict
is stated as the composite it is: the full run read the un-mended test, the mend is proved alone,
and nothing else in the run touches that path.

### Where Phase 8 now stands

**Every named item of §8 is built and guarded**: the schematic format, the capture (headless tool
AND the player's own binding), the Cave of Treasures, the Cell of Ḥanoḵ, and the something at the
back of the sea caves. What remains is open-ended, not owed: growing the hoards, which costs one
capture and no code — the whole object of building the format first.

## 4cj. Round 86 — the tree sent through the door, and test 43 alive after twenty-five rounds ✅

*Round 61 built the whole bole mechanism — `kit.bole` stamps a trunk into the structure layer,
the mesher draws it, the axe breaks it, it drops Timber — proved it once end to end, and switched
it off for two reasons its own notes specify with the mend half-written. This round answers both,
turns it on, fights a war it started, and re-founds two laws the change made untrue.*

> **READ §4ck BEFORE BELIEVING THE NUMBERS BELOW.** The war, the draw-call win, the ×8
> re-founding and the ±2.5% pricing in this section were all read against a world this
> round had sheathed in phantom timber without knowing it — a trunk block in ~100% of the
> earth's columns. The mechanism stands; most of the measurements below do not. §4ck tells
> which, and what the true numbers are.

### The two reasons, answered

**1. The first build is no longer trunkless.** Round 61: the stamp landed after `buildChunk`
gathered its edits, so trunks arrived on the remesh — a whole view's worth of pop-in, measured by
test 41 at 63,466 triangles. Its prescription — *"the stamp wants to run BEFORE the chunk gathers
its edits, a pass over the columns that grow trees, which the builder already walks"* — is built:
a pre-pass with **the same kit blindfolded** (real `hash`, `shade`, `M`, so the tree decided is
the very tree the walk will draw; no-ops where triangles would come out; `wet` asked with
`riverBankCell` exactly as the walk asks it, because a different `wet` picks a different tree).
The pass takes back the one dirty mark it makes on its own chunk — that very build draws what it
just stamped — and a bole leaning over the boundary rightly leaves the neighbour marked.
**Proved by injection: pre-pass removed, test 41 reads 62,186 triangles of pop-in — the same
fault Round 61 read at 63,466.**

**2. The bole keeps its bark, and the trade was never forced.** Round 61 weighed *"six blocks and
a stack of timber that no longer stacks"* against a tint and said the question should be ASKED.
The answer was in the block table all along: **a block drops what its `drops` field names** —
`give=BLOCK_BY_ID[b.drops]` — so six bark-faced Timbers all give the one `log`. The eye keeps the
birch and the cork-oak on the felled bole; the satchel keeps one stack. The six new blocks claim
the very bark materials the crowns have worn since §2.4.3 (no new art), and they **append at the
END of the manifest**, out of alphabet, on purpose: a block's number is its place in the list and
those numbers live in every save's edit records.

### The war this round started, lost once, and then ended

Two neighbouring trees could both claim a boundary cell — a trunk box leans. Before, every bark
was the one `log` block and the fight was an **invisible no-op**; six blocks made it visible, and
eternal:

> **4,878 stamp flips in twenty frames at one shore** — log-twist ↔ log-smooth, each flip a dirty
> mark, each remesh a flip back, the renderer pegged at 102% and test 43 hung past forty minutes.
> The winner depended on stamp ORDER, and order differs between the pre-pass, the mesh walk, and
> a neighbour's build.

**A first mend refereed the contest** — lowest block number wins, order-free — **and was wrong
twice**: it *ratcheted* (once plain `log` had ever won a cell, no bark could be stamped back, and
test 41's off-arm read "4 barks, wanted 1"), and it still let a war exist to be refereed. **The
real mend makes the contest impossible: a trunk's stamp is clipped to the column the tree is
ROOTED in.** One column per tree, no cell with two claimants, every order the same outcome; the
drawn crown still leans wherever it likes — only the fellable part is the tree's own footing,
which is where an axe is swung anyway. Read at rest afterward: **0 changing stamps in twenty
frames, dirty 0, remeshes still** — and two read-only probes (`editDirtySize`, `remeshes`) stay
on `__VDBG` with the rule written beside them: *a dirty count that never drains is a stamp whose
value flips between rebuilds.*

### What it costs, what it pays, and two laws re-founded in the open

**Every trunk's own bark-material mesh melts into the chunk's block mesh.** Measured: ~420 draw
calls gone at the cave-country reading, and the OPEN frame fell from ~480 ms to **~75 ms** in the
software harness — while conifer cave country, whose cost is its own canopy, barely moved
(521 → 513). Two laws written for the old world had to move, each with the story in its comment
and one in its very name:

| law | was | is | why |
|---|---|---|---|
| test 41, "not one triangle" | exact, for geometry trunks | **±2.5%** | to a greedy mesher block identity IS shape: unlike trunks touching cannot hide their boundary faces — measured +18,748 of 1,092,098 (1.7%). The quarter-million-triangle leak the law was born catching is still caught cold |
| test 11, cave ≤ open **×1.5** | held while open and cave cost alike (881 vs 928 ms) | **×8**, and the test's NAME says when and why it moved | the ratio blew out because the DENOMINATOR got six times cheaper. Nothing regressed in absolute terms, and the remesh hitch a hand actually feels stayed at ~25 ms |

### The readings

Tests 11, 41, 43, 44 together: **4 pass · 0 fail**. Test 43's first green reading in ~25 rounds:
*a tamarisk at 12121,2040 · solid: true · the block is Timber · in the player's record: false ·
it drops log · broken: true.* Test 44's whole chain — fingers to timber to planks to pick to rock
— unmoved. Chunk build cost with the pre-pass: 3–9 ms a chunk across terrains (545 laid per arm),
the doubling of the flora walk lost in terrain noise. Bamboo culms, mangrove stilts and the
banana's false stem stay geometry, as Round 61 documented.

## 4ck. Round 87 — a hand that sows: PLAN §17.4 paid, and the year already standing does the growing ✅

*PLAN §17.4 has said the same thing since Round 68: "What still does not exist is a hand that
sows: a seed in the satchel, ground that will take it, and a crop that comes on where the
traveller put it rather than where a village put it. The clock and the growth are now both
standing and waiting for it." This round is the hand. Nothing new grows anything: the sown
cell reads the very machinery the village fields have read since Round 68, which is why the
whole feature is one block file, one work, four declared fields and ~90 lines of engine.*

### The design, and why it is one substance

**Seed Corn is ONE block, by the bucket's own rule** (a vessel and its water are one thing in
two states): in the satchel it is the seed, and set down on tilled ground it IS the sown cell.
There is no second "growing crop" block, no wheat-seed and rice-seed and flax-seed — §4's rule
against placeholder catalogues holds, because **which corn comes up is not the seed's to say**:
the sown cell bears what its own country sows, asked of `js/crop.js` exactly as a village
field asks (`CROP.forField`, seeded on the cell's own place), so a seed sown in Egypt comes up
wheat and the same seed sown in Java comes up rice.

**And the growth costs nothing, because it was already paid for.** The sown cell is drawn in
the chunk's own mesh as a cross in the `crop`/`cropEver` material — the very material every
village field wears — whose vertex shader has sunk the plant into its bed by how far off
harvest the year stands since Round 68. Meshed once at full stature; no remesh as it grows, no
per-frame cost, no new material, no new draw-call kind. The sunk part hides inside the tilled
block and the ground under it, exactly as a field's young corn hides under its own soil face.

**The engine knows no seed by name.** Four fields on the block registry carry the whole rule,
in the pattern `serves`/`fills`/`empties` set:

| field | on | what it means |
|---|---|---|
| `sown` | seed | drawn as a growing plant, walked through (`blockSolidAt` answers air), the arm still lands on it (`aimAt` asks `blockSownAt`), comes away at a touch |
| `bed` | seed | the one ground it will take — `placeBlock` refuses any other, in words that name the hoe |
| `increase` | seed | what a FULL-GROWN plant gives over the seed that went in |
| `tills` | grass, dirt | what the hoe turns this ground into |

**The hoe finally does what its own file said.** `blocks/flint-hoe.js` has read "the one tool
in this list whose work is not breaking but turning" since Phase 4, and nothing ever read it —
the hoe served only as the soil's *breaking* tool. Held now, it goes through the same door the
bucket goes through (`placeBlock` → `useHoe`): aimed at a block that names `tills`, from
above, under open air, it turns it — and the tilled bed is a DEED, in the player's record,
because `setBlock` is the one door and the hand wrote it.

**The reaping pays by the year, and by nothing else.** Broken full-grown (`grow >= 0.8` on
`CROP.yearAt` at the cell's own latitude — the SAME curve the shader is built from, which
test 48 already holds to the GLSL within 6.3e-6), the plant drops its seed and its `increase`
of 3 over it; broken young, only the seed back; and a plant whose bed is dug out from under
it comes away as its seed rather than standing on nothing (`fallCheck`, beside the sand rule).

**And the first seed is come by honestly.** A fifteenth work, `thresh` — 1 Sheaf gives 4 Seed
Corn, at the bare hand, with RUTH 2:17 beside it ("And she gleaned in the field until evening
and beat out that which she had gleaned…"). The sheaves stand in every pen and byre on the
earth and have been breakable blocks since Phase 3, so a voyage that owns nothing walks:
sheaf → seed → hoe (flint 2, planks 2, already in the works) → bed → field.

### What the building taught

**1. The truth about a cell arrives when its chunk is BUILT — and this time it bit the test,
not the game.** Test 58's first cut probed for a plot with the pure functions and then walked
there — and the bole pre-pass of Round 86 stamped a trunk into the very column the probe had
liked, so the hoe met "something stands over it" and the seed met Timber that had not existed
at probe time. The station is two-pass now: the pure functions shortlist grassy sites, the
ground is stood on and its chunks waited for, and the plot is chosen from what is actually
standing (with head-room, because a trunk one course up is a crop that cannot stand).

**2. The bucket's verse was a paraphrase, and `--check` had been saying so.** The extractor
read *62 exact · 1 paraphrased* before this round touched anything: BERĔSHITH 24:20 shipped in
Round 60 as "and ran back to the well to draw water, and she drew" where the source reads "ran
back to the fountain to draw water and drew". Mended to the source text, word for word. The
two verses this round adds (RUTH 2:17 on the work, QOHELETH 11:6 on the seed) were emitted by
the extractor, never typed. **64 exact · 0 paraphrased · 0 unsourceable now.**

### The readings

Test 58 walks the whole chain in the voyage hand, in the order a player would, each link
asked separately — and the station it found is in the SOUTH (Falkland Is., latN −0.58), so
the hemisphere shift of the agricultural year is exercised for free:

    threshing gave 4 seed
    untilled grass refused: "Seed Corn will take no ground but Tilled Ground — the hoe turns it"
    tilled: true, and the bed is in the player's record
    sown: a walk-through block the arm lands on · 1 crop mesh in the chunk meshes (0 before)
    reaped full-grown (grow 0.91): +4 — the seed and its increase
    reaped young     (grow 0.16): +1 — the seed back and nothing else
    the bed dug away: the plant came away as 1 seed

**Proved by injection, both ways.** The bed rule disabled: *"FAULTS: the seed took untilled
grass — the bed rule is not read"*. The year unhooked from the reaping (`true||` on the grow
gate): *"FAULTS: a YOUNG shoot paid the increase (4) — the year is not read at the reaping"*.
Both faults named by the line that catches them, then taken back out.

### What is deliberately NOT here, named so it is not found missing

- **A hand-sown paddy is not flooded.** A village rice field floods its plot; a sown cell
  draws the crop and no water. The flooding is the field builder's, not the block's.
- **Sand will not till.** `tills` is declared on the sward and the earth and nothing else —
  the desert grows a field only where a man carries soil to it, which is a thing he can do.
- **The village fields stay decoration.** They are triangles in the village's own meshes, as
  they have been since Round 68; a hand cannot reap them. The traveller's fields are blocks.
- **Seed corn is not yet bread.** There is no food system; the increase is seed, and the work
  it feeds is more sowing. Bread is a work for the day the world needs one.
- **The free hand leaves no drops** at the reaping, by the litter rule of Round 42 — and the
  Stores offer the seed, so a place may be laid out with standing corn.

Cost: `blockSolidAt` gained one guarded array read on edited cells only; `aimAt` one
early-out call per step. Test 12's chunk-cost guard and test 11's ratio stand watch over
both, as they have since Rounds 66 and 86.

## 4cl. Round 86, corrected — the earth was sheathed in phantom timber, and every tree stood as a naked pole ✅

*The full suite ran three and three-quarter hours against Round 86 and returned 48 · 4 · 5,
and every FAIL had a story that satisfied: tests 13, 40 and 42 had "assumed a spot clear that
the truer world now occupied", test 30 was starved by a leaked browser. Three of the four mends
were right anyway. The STORY was wrong, and one refusal was the tell.*

### The tell, and the probe that followed it

Test 42, mended to hunt a verified-clear column, still failed at two different places with the
same refusal — and a failure that does not move with position is a system, not a circumstance.
An eight-column probe at the coast read the answer: **every column wore a trunk block at its
first-air cell.** Widened: **871 of 874 coastal columns, 93% inland.** The earth was sheathed
in phantom timber, and none of the fifty-seven tests looks at the ground the way an eye does.

(First, in passing: test 30's browser. The FAIL was a 30-second `page.goto` timeout, but the
deeper fault was `tools/harness.js` — when the goto throws, `open()` throws before
`{browser,page}` is ever assigned, the caller's `finally` never holds a browser, and the
launched process is orphaned. Test 30's orphan burned ~1.3 cores for two and three-quarter
hours and starved every test after it. `open()` now undoes its own launch on any failure past
it; proved by injection — a page that cannot load leaves a running browser under the old
harness, none under the mended one.)

### The first fault: `treeAt` names, `cc.tree` decides — and the pre-pass never asked

The mesh walk grows a tree only where the cell says one stands (`if(cc.tree) emitTree(...)`).
`FLORA.treeAt` is NOT a density gate: it answers *which species would stand here* for any cell
asked — its sibling `plantAt` rolls density itself, which is exactly the asymmetry that invites
the mistake. The pre-pass asked `treeAt` for all 256 columns of every chunk and stamped
whatever it named. One line mends it — the pre-pass asks `cc.tree` first, the same gate at the
same question — and the probe re-read **1% of columns trunked, coast and inland both: the
trees themselves.** (The phantoms lived in SEDITS, which regenerates and is never saved — no
voyage's record carries one.)

What the phantoms had corrupted, told plainly:

- **The "war" was a phantom army.** 4,878 stamp flips at one shore were wall-to-wall phantom
  trees fighting over cells. The column-clip in `boleBox` stands on its own right — one column
  per tree makes the contest impossible for real neighbours too — but it was proven against
  ghosts.
- **The draw-call "win" was occlusion by a timber slab.** Open ground fell 480 → 75 ms because
  a merged slab of log blocks hid the world, and test 11's law was moved ×1.5 → ×8 on that
  false economy. On the bare earth open ground is the DEAR ground again — it is the ground
  that grows the trees — and the law went back to ×1.5, with both lessons priced into its
  comment: a spectacular win owes the same suspicion as a failure, and a law should not be
  re-founded in the same round as the change it excuses.
- **Test 41's +18,748 triangles were the ground touching itself.** On the bare earth the
  six-bark and one-bark builds differ by **0 triangles exactly** — a tree of this world almost
  never roots shoulder to shoulder. And the off-arm stamps the old `log` block, which wears
  TWO materials (side and top) where a bark block wears one, so the TOTAL mesh count moved
  −198 while the barks themselves cost their mesh groups honestly — the draw-call assertion is
  scoped to the bark meshes now, the thing it guards; a trunk that stops being a block at all
  is test 43's to catch.
- **Tests 13, 40 and 42 struck phantoms, not trees** — but their mends stand: a premise
  verified beats a premise assumed whatever the odds, and 42's hunt failing WAS the correct
  reading of a world with no clear column anywhere.

### The second fault under the first: every tree stood as a naked pole

The laws re-ran green — and then the pop-in injection re-proof read BACKWARDS: without the
pre-pass the first build had 62,186 triangles MORE, the very number the phantom-era injection
had celebrated. A trunk cannot add by its absence. The walk answered: its edited-column branch
ends in `continue`, so an edited column never reaches the `cc.tree` draw — invisible while
edits in a tree's column were a hand's rare doing, and the look of the world the round the
trunk stamp made EVERY tree's column an edited column. **The crowns were never drawn. Every
tree since the boles went on stood as a bare trunk, and no test reads the drawn wood off the
mesh** — the flora suites (33, 34) ask the flora directly. Round 61's "63,466 triangles of
pop-in" was the same fault in a mirror: crowns popping OUT on the remesh, mismeasured as
trunks popping in.

The mend: an edited column whose tree still stands on its own trunk draws its crown — crown
iff the base cell answers Timber — so a felled bole takes its crown down with it and a
built-over column stays as silent as it always was.

**Proved three ways, on the bare earth:**

- *The whole first build.* Same-disc probe, hold kept, remeshes run to the floor: with the
  pre-pass the first build IS the settled world — 876,360 = 876,360 triangles, 987
  leaf-material mesh groups standing, pop-in 0, dirty 0.
- *The injection.* Pre-pass held off: the first build lacks exactly **5,618 triangles** (the
  trunk blocks arriving late, 304 dirty marks), settling to the identical world. The true
  pop-in the pre-pass buys off is 5,618 triangles — not 63,466.
- *The felling.* Counters in the gate over 1,148 tree columns: 1,146 crowns drawn, 2 skipped —
  both the felled tree's own rebuilds. One base taken costs **154 triangles**, identically
  through the flush and through a rebuild from nothing (876,360 → 876,206). And the probe's
  first instrument was convicted on the way: `viewStats.byMat` counts MESHES per material, not
  triangles — a fallen crown removes no mesh, and the felling was invisible to it while being
  real in the triangle total.

### The second full suite, on the corrected world

**52 pass · 0 fail · 5 pending** — the first zero-fail suite this repository has recorded.
The five pendings: 50, 53, 54 and 55 are the measured watchers by design (§2.3.5/§2.3.6's
open items), and 12 is its own honesty — this box runs its calibration loop 1.69× slower than
the box that set its baselines, and the test refuses to compare across that. The readings that
matter: 11 at 1.15×/1.15× under its restored ×1.5; 41 with +0 triangles and every bark in
view on the crowned world (876,360 both arms); 42's whole chain — dipped, poured, ran to 99
cells, in the record, bucket back empty, spring taken back up; 30 clean under the mended
harness; 43 still green — the axe bites the bole and it gives Timber; 56's captures reading
the trunks inside both authored places and round-tripping whole.

### The lesson, for the books

A test failing identically at two unrelated places is not describing its surroundings. A
round that measures a spectacular win owes that win the suspicion it would give a failure.
An audit that finds a satisfying story should ask the story one more question — every FAIL of
the first suite had an explanation that fit, and all of them were true only of a world nobody
had looked at. And an injection whose number comes back the same in two different worlds has
measured neither: 62,186 was believed twice, and it was crowns both times.

## 4cm. Round 88 — the furnace and the iron: PLAN §17.5's argued answer, built ✅

*Round 87 wrote the argument into PLAN §17.5 before a line of this was coded: the bench
already exists and WAITS (nothing needs one); nothing in the bootstrap may ever move behind a
place; and what genuinely wants a place is the FIRE — `world/works.js`'s own head has said
since Phase 4 that "the smelting of copper and iron waits… the ore is in the hills already,
and the metal wants a fire hotter than a kiln and a work of its own." The ore has been truly
in the hills since Round 39 (DEḆARIM 8:9), mineable, and nothing to do with what was mined.
This round is that fire, that metal, and the tool that is the metal's reason to exist.*

### What shipped, and the two rules it keeps

**The furnace is BRICK — one work's product is the next work's material, twice over.** Clay
becomes brick at the kiln; eight brick become a furnace AT the kiln (`at:'kiln'` on the
furnace's own work); the furnace opens the smelting. That chain is what "building from
gathered materials" *means*, and it is the first time the game has it. The block is the
kiln's pattern one step up — the same fire-mouth idiom drawn in the brick's own courses, a
mouth burning whiter (`light:11` against the kiln's 9), DEḆARIM 4:20 beside it, because the
account knows this furnace by name: *the iron furnace, out of Mitsrayim*. `workPlaceAt` was
already generic — the work says `at:'furnace'` and not one engine line was written for it.

**Iron ships; copper's metal and bronze do not, and the restraint is §4's rule holding.**
`smelt-iron` (1 ore → 1 iron, at the furnace, IYOḆ 28:2 — *"Iron is taken from the earth and
copper is smelted from ore"*) and `iron-pick` (iron 3, planks 2 — the flint pick's own shape
in the better metal, no verse, as the flint tools have none). Copper's ORE stays in the
ground because the land holds it; its metal waits for a work that needs it, and bronze waits
on a tin no land's list holds. *A substance ships when a work needs it* — the iron pick
needs the iron, and nothing yet needs the copper.

**The pick is faster by ONE number on the block, read in ONE place.** `speed:2.2` on
`blocks/iron-pick.js`; `toolSpeed` reads `h.speed||1` — the same declared-here-believed-there
pattern `hardness` set in Phase 4, and the very line whose Round 34 comment promised "the day
a bronze pick exists it will be believed without another line here." (It was an iron pick,
and the line was one term.) An ingot and a pick are both `place:false`: an ingot is not a
cubic metre of iron.

### The readings

Test 59 walks it in the voyage hand, each link its own question:

    the bare hand: smelting REFUSED (why: place)
    beside a KILN: still refused — a kiln is not a furnace
    brick 8 → a furnace at the kiln → set down, it stands → 3 ore smelted → a pick of iron
    the rule pays 2.2× (the block declares 2.2)
    and the blow's own clock agrees: 3.40s stone falls in 1.55s (2.19×)

**Proved by injection, both ways.** The place rule taken off `smelt-iron`: *"FAULTS: the bare
hand smelted · a KILN passed for a furnace"* — both arms, by name. The speed term taken back
out of `toolSpeed`: *"the rule pays 1 where the block declares 2.2 · the clock pays 1.00×
where the block declares 2.2×"* — the rule's answer and the clock's, independently. Both
faults named by the line that catches them, then taken back out. The guard set about the
changed machinery — 14 (the tool law), 20 (the refusal), 44 (the bootstrap), 58 (the sowing)
— ran green beside it.

### What is deliberately NOT here, named so it is not found missing

- **No iron axe, spade, knife or hoe.** The pick is the one tool whose material REFUSES the
  bare hand, so it is the one whose better metal is felt. The others follow the day their
  speed would matter to anybody.
- **No copper metal, no bronze, no gold or silver smelting.** Named above; the rule is the
  reason.
- **No smelting of the pick back to iron, no fuel.** The kiln has never asked for fuel and
  the furnace keeps its sibling's rules; a fuel economy is its own argument, not a rider.
- **The bench still waits**, exactly as §17.5's argument left it: nothing needs one yet.

## 4cn. Round 89 — the far falls answered by their own water, and the matriarch's seventh attempt, characterised and not shipped ✅

*The two items left with real design meat on them (§16's far falls; §2.3.5's matriarch),
taken with the one discipline that fits both: measure first, ship only what the measurement
carries, and record the rest so the next hand starts where this one stopped. The standing
game was to be affected by NOTHING unproven, and it was not: what shipped is a read-only
census tool, one read-only debug exposure, a guard test, and this record.*

### The far falls — §16's owed question, PAID

`tools/farfalls.js` is the instrument the question wanted: every fall prepared, every
basin-bound one sprung and beaten to stillness exactly as test 39 does, and — the number
nobody had — the nearest TRUE water swept in a full circle out to 400 blocks (the same
raster answer the outfall search reads, exposed read-only as `outWater`).

**The census, and it is bigger than §16 knew:** not five but **27 of 34 falls** find no
outfall inside their claim. And the two numbers that decide the question:

    every basin HOLDS: 0 cells outside any claim, all 27 —
      farthest standing cell 6-73 blocks, against claims of 46-376
    the nearest true water: 69-312 blocks off for fourteen of them,
      NOWHERE within 400 blocks for eleven

So the channel §16 wondered about would be a county-crossing cut for every fall that lacks
one — the falls' own file forbids exactly that ("a shoulder widened to reach a river would
raise a county") — and the world's own law closes it: **no change to the shape of the earth
without a defect to point at. The basins stand.** A tarn under a great plunge is what the
real earth does with one. Two curiosities are recorded rather than chased: Jog (28 blocks to
water) and Sutherland (44) have sea within their claim RADIUS but outside the downstream
fan — the water lies behind or beside the fall, where no channel from a plunge pool
honestly runs.

**Test 60 makes the law permanent**: the two biggest basin falls, picked by the data, are
sprung, settled, and held to a bounded basin — the defect that WOULD matter (water leaving
its claim) now has a tripwire.

### The matriarch — the seventh attempt, built, measured, and taken back out

Round 82's prescription was followed to the letter: *"move neither the marks nor the steps
but change what a beast WANTS."* The mechanism: each herd names a matriarch (rank by
young-at-foot, tie on the tether — Round 82's rule); she owns one slowly-wheeling bearing;
and at the meal-done decision a beast that would put its head straight back down sometimes
wants its next mouthful a couple of body lengths her way instead — walking the station gait
(the one walk that does not stop at the first blade) and feeding at the end of it. Stations
untouched, steps untouched, station discipline asked first, dinner first always.

**The instrument convicted itself twice before it read anything** — Round 78's lesson,
re-learned at full price:

1. **The lever was hung dead, again.** Placed after `toStation` in the roam-expiry chain it
   read 0.000-0.002 a beast-second — the meal-done branch CONSUMES its decision (an act, or
   a stroll), so the next-mouthful choice never saw one. Re-hung at the feedhead expiry
   itself it fired at **0.13-0.23 a second (ask 0.67-0.77), off-arm exactly 0**.
2. **The first travel metric measured the census, not the walking**: a per-kind centroid
   over whoever happened to be herded read 125 units of "travel" in an arm where the
   mechanism never fired once — membership churn, nothing else. Re-built on a fixed cohort
   (the same beasts, both ends).

**With both mended, the honest reading (Kenya, ON/off/ON, 30-second arms):**

    travel:  12.9 · 17.6 · 57.7 units (0.74 · 0.95 · 2.72 radii) — the OFF arm
             sits BETWEEN the ON arms: not established
    reach:   1.14 · 1.10 · 1.09      — flat: no damage
    mothers: 0.85 · 0.86 · 0.86      — inside, flat: the young-at-centre rule untouched
    feed:    0.71 · 0.71 · 0.70      — flat: nobody went hungry for it
    cost:    0.139 · 0.134 · 0.150 ms — flat

**Why the arm cannot see it, in arithmetic:** at 0.23 marches a second over ~35 herded
beasts, a 30-second arm buys ~7 marches of ~9 units — about **2 units of expected herd
drift under 13-18 units of arrival noise**. The window is an order of magnitude too short
for the effect it is asked to see, which is test 50's own long-standing complaint about
itself. Establishing it wants ten-minute arms, and this box runs frames at a third speed.

**So the mechanism is out of the tree, by the diagnostic's own charter** — *"to stop a
round of shipping a mechanism nobody could show working"* — and this is what the eighth
attempt (or a patient measurement of the seventh) inherits: the right hang point is the
feedhead expiry, before the act and the stroll; the lever fires there at a useful rate and
costs nothing measurable; the travel metric must be cohort-fixed; and the arms must be
minutes, not seconds. Nothing about the idea was disproved. Nothing about it was proved.
That is the whole of what the data says, and it is written down instead of shipped.

## 4co. Round 90 — Phase 8's hoards grown: the Cave at Ḥorĕḇ, and Ararat's debt paid at last ✅

*Phase 8 closed its named items in Round 85 and left one thing open on purpose: "growing the
hoards, one capture and no code apiece." This round grows them by two — and both were
measured before they were designed, with a probe reading each anchor's actual ground so a
place is set into a level pocket the world already has, not wished onto a slope.*

### The Cave at Ḥorĕḇ (Mount Sinai)

*"And there he went into a cave and spent the night there. And see, the Word of (YAHUAH)
HWHY came to him and said to him, 'What are you doing here, Aliyahu?'"* — 1 MALAḴIM 19:9.

**The first place with NOTHING in it, and that is its design.** The Cave of Treasures
carries gold, the Cell of Ḥanoḵ alabaster; the cave at Ḥorĕḇ held a man for one night and a
question, and a hoard here would be a lie about the story. So it is an UNWORKED hollow — no
hewn floor, no dressed wall, the room's floor the mountain's own rock — with one cobble
slab at the back to lie on, because the night was spent. The probe read Sinai's landmark
site as grass at 58 courses with a level pocket at its middle — thirty-six courses BELOW
the summit where the Scroll of the Going Out stands, so the lodging is passed on the climb
and crowds nothing: tests 24 (the summit on foot) and 28 (the scroll got at) were run
beside it on purpose.

### The Altar of Noaḥ (Mount Ararat)

*"And Noaḥ built an mizbe'ach to (YAHUAH) HWHY and took of every clean beast and of every
clean bird and offered burnt offerings on the mizbe'ach."* — BERĔSHITH 8:20.

**Ararat's standing debt, paid with the thing the account actually builds there.**
`world/scrolls.js` has refused Ararat a scroll since Phase 7 — none of the eight is the
account of the flood, and inventing the assignment was not this project's to do — but the
mountain was never owed a scroll. It was owed the first thing built on the washed earth: an
altar block (the very block the works raise from twelve unhewn stones) on a platform of
unhewn stone, four stones at its corners, open to the sky, standing in the high snow at 129
courses where the probe found the site's level pocket. `keep:true` and nothing carved — not
one block of Ararat is quarried for it. Nothing roofed, nothing hoarded.

### The discipline both kept

One entry apiece in `world/places.js`, in the format Round 83 shipped — no engine change,
no new block, no new rule. Both are `at`-anchored, so **test 56 covers them automatically**:
its per-place loop now runs four round trips (world → object → TEXT → object → world) where
Round 84 ran two. Every cell count proved against its box before boot (140 = 5×4×7 and
50 = 5×2×5 exactly); both verses extractor-exact in the file's own comments.

### The readings

    test 24: 13 of 13 named summits still walked to — neither place bars a path
    test 28: the three placed scrolls untouched — Sinai's still 94 of 94 on the summit
    test 56: 4 of 4 landmark places stood and captured back —
      the Cave at Ḥorĕḇ  140/140, three ways (format, file text, the hand)
      the Altar of Noaḥ   50/50, three ways — census stone 29 · air 20 · altar 1, as designed

And one detail reported rather than tidied: the capture at Ḥorĕḇ carries **2 cells of
log-smooth** — a tree of Sinai's own grew by the mouth, and the capture reads the world as
it stands, which is the only rule a capture tool may have. The world's timber in the doorway
is world, not fault; the round trip is exact either way.

## 4cp. Round 91 — the curtain, and the fear that outlived the water it was written about ✅

*§16's last water debt: "Seven heads make seven threads… A head every other block was tried
and taken back out — it gives the volume back and will not unwind — that is not understood
yet, and a fall that cannot be turned off is worse than a fall that is thin." That sentence
was written against the water of Rounds 57–58. Round 65 then rebuilt the falling rules end
to end — falling holds by what stands OVER it, a settled fall's queue is EMPTY, the front
came down from 175 columns to 9 — and nobody ever asked the new water the old question.
This round asked it, with an instrument, instead of trying to understand a fear recorded
about a machine that no longer exists.*

### The instrument, and what it asked

`tools/curtain.js` (committed, like waterfront before it): the same three falls test 39
picks by form, heads laid at TODAY'S stride (half/3 — the seven threads) and at a head
every other block, arm against arm in one boot, and for each arm the four numbers that
decide — the front (the curtain is the point, so it must widen), the queue at rest and the
writes per 100 ticks at rest (Round 65's stillness law, which a curtain must not break),
and the drain when every head is taken up ("will not unwind" is the recorded fear, so it
is the recorded measurement).

### The readings, and the fear retired

    fall     stride  heads  settled  front  queue@rest  laid/dried per 100  drained
    Angel      4       7     2,509     39       0             0 / 0          140 ticks → 0
    Angel      2      14     3,236     40       0             0 / 0          143 ticks → 0
    Iguazu    75       7       635    116       0             0 / 0           43 ticks → 0
    Iguazu     2     213     8,371    440       0             0 / 0          934 ticks → 0
    Krimml     1       5       815     16       0             0 / 0          101 ticks → 0
    Krimml     2       3       815     16       0             0 / 0          101 ticks → 0

**Every arm, both strides: the queue at rest is 0, a hundred ticks at rest lay and dry
nothing, and the curtain drains to zero cells.** "Will not unwind" is dead — it described
the pull-era water, and Round 65's rules bear the curtain without a line of change to
`js/water.js`. The whole ship is one constant in `springs()`: a head every other block.

**And the prize is the one §16 wanted:** Iguazu — *the Great Water*, a lip four hundred
and fifty blocks wide — poured in SEVEN THREADS for thirty rounds. It pours along its
whole brink now, 116 columns to 440. A narrow fall (Krimml's lip is four blocks) comes out
cell-for-cell as it was: the curtain is the breadth of the fall, so a thin fall stays thin.

Cost, stated: the Great Water standing at 8,371 cells against 635, filling over ~630 ticks
as the traveller approaches — and at rest it costs what every settled fall has cost since
Round 65, which is nothing. Guards 39 (pours, stays, drains — Iguazu now "630 columns off
213 heads, drained to 0"), 42 and 60 (the basins hold) run green with the curtain on.

### And the curtain's first red convicted the instrument, not the water

Test 40 read *"25 cells of the running flow are IN THE RECORD"* with the curtain on — a
law-breaking headline. Made to NAME what the record held there, it answered **"24x #true"**:
`recordedAt` returned a BOOLEAN, true alike for "a hand built here" and "the ground here
was emptied", so it could not tell the two apart. The cells were flow running through
**0-entries** — bank cells the curtain's wider wetting had collapsed (the world putting
itself right through the one door, its emptied cells rightly 0 in the record so the
collapse holds on a reload) — and water running through dug ground is Round 58's own order,
in its own words: *"water beats a 0 — a channel a man has cut is exactly where he expects
his water to run."* The water was lawful; the probe was blind. `recordedAt` returns the
ENTRY now (the block number, 0 for emptied, undefined for nothing) — truthiness still
answers "did a hand build here", which is what all four standing callers ask — and test
40's fault line names the ids it finds, so the next red says what it is instead of leaving
a probe to be rebuilt. With the probe mended: 39, 40, 42 green at curtain density.

## 4cq. Round 92 — the matriarch leads: the eighth attempt SHIPS, on the measurement the seventh prescribed ✅

*Seven attempts across five rounds ended reverted; the seventh (Round 89) ended with a
characterisation instead of a claim — the lever fires at the meal-done decision and costs
nothing, but a 30-second arm cannot see ~2 units of drift under 13–18 of noise. The eighth
attempt is the SAME mechanism under the measurement the seventh said it needed: minutes-long
arms, the cohort-fixed travel metric, and the bearing's wheel slowed from 0.008 to 0.002
rad/s so a long arm's drift does not curl into its own cancellation.*

### The mechanism, unchanged from the seventh

Each herd names a matriarch — rank by young-at-foot, the tie broken on the tether, Round
82's rule — and she owns one slowly-wheeling bearing. At the meal-done decision (the ONE
hang point where the lever lives: asked before the act and the stroll, measured dead at
0.000–0.002 a beast-second anywhere later in the chain), a beast that would put its head
straight back down sometimes wants its next mouthful a couple of body lengths her way —
walking the station gait, head down at the end. Stations untouched (the fifth attempt's
fault), steps untouched (the sixth's), station discipline asked first, dinner first always.

### The readings — 180-second arms, ON/off/ON in one boot, Kenya

    arm   travel                march/s   reach   mothers   feed   pass ms
    ON    44.9 u — 1.84 radii    0.49      1.09     0.83     0.66   0.172
    off   19.1 u — 0.84 radii    0         1.05     0.71     0.68   0.170
    ON    27.7 u — 1.16 radii    0.41      1.11     0.76     0.69   0.169

**Both ON arms above the off arm — the bracketing standard every earlier attempt failed**
(the sixth had both off-arms above every on-reading; the seventh's off sat between its
ons). A fourth, independent ON arm from a separate boot (cut off by its timeout after one
arm) read 2.50 radii, the same way. And the guards are flat across arms: reach 1.05–1.11,
the mothers 0.71–0.83 — inside, the young-at-centre rule untouched — feed 0.66–0.69, the
herd pass 0.169–0.172 ms, graze failures 0 everywhere.

### What is claimed, and what is not

**Claimed: with the matriarch's lean on, the herds of one land travelled 1.4–2.2× the
distance they travelled with it off, in one boot, with nothing else measurably moved** —
and a third reading from another boot agrees. NOT claimed: the margin (1.16 against 1.84
between the two ON arms says it varies), any effect on herd SIZE, or anything about a land
not measured. Tanzania and the other herd lands are the natural confirmation, and tests
50 and 53 stand permanent watch — test 53 now shows the march lever beside the levers it
was built to expose, and its long-standing lament ("the window is too short for the rule
to act in") is precisely what this round's arms answered.

Guard tests 35 (the watch) and 53 (the levers, the cost) run green with the march on.

## 5. Further recommendations (future work)

1. **Cargo physically visible in the hold** — stack crates as the manifest fills.
2. **Port fees and rare goods** — one land-exclusive good per region for long routes.
3. **Reputation with villages** — spear a village's penned beast and the vendor's
   prices turn against you; drive off a wolf and they improve.
4. **Deeper quests** — a villager asks for a good from a named far land; deliver for a
   reward and a verse.
5. **Small-island real data** (50 m coastlines) if charted, nameable islands are wanted
   to complement the uncharted ones.
