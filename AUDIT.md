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

## 5. Further recommendations (future work)

1. **Cargo physically visible in the hold** — stack crates as the manifest fills.
2. **Port fees and rare goods** — one land-exclusive good per region for long routes.
3. **Reputation with villages** — spear a village's penned beast and the vendor's
   prices turn against you; drive off a wolf and they improve.
4. **Deeper quests** — a villager asks for a good from a named far land; deliver for a
   reward and a verse.
5. **Small-island real data** (50 m coastlines) if charted, nameable islands are wanted
   to complement the uncharted ones.
