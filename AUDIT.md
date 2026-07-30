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

## 5. Further recommendations (future work)

1. **Cargo physically visible in the hold** — stack crates as the manifest fills.
2. **Port fees and rare goods** — one land-exclusive good per region for long routes.
3. **Reputation with villages** — spear a village's penned beast and the vendor's
   prices turn against you; drive off a wolf and they improve.
4. **Deeper quests** — a villager asks for a good from a named far land; deliver for a
   reward and a verse.
5. **Small-island real data** (50 m coastlines) if charted, nameable islands are wanted
   to complement the uncharted ones.
