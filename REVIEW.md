# THE VOYAGE — Full World-Sandbox Review

*Reviewed on branch `claude/sandbox-world-review-l396hy`. The game was run end-to-end in a headless
browser as part of this review: title screen → set sail → sail → go ashore → village at night →
world map. Everything below marked **confirmed** was observed live, not just read from the code.*

*Note: YouTube is blocked from this review sandbox, so the four linked videos could not be watched
directly. The review instead measures the game against Assassin's Creed IV: Black Flag's known
world-design principles (scale compression, seamless ship↔shore, wind, encounter density) and
against Minecraft's visual grammar (16×16 nearest-filtered textures, blocky characters, furniture),
which is what those videos cover.*

---

## 1. Verdict

This is a far stronger foundation than a single 1,378-line HTML file has any right to be. It boots,
renders a coherent Minecraft-styled voxel Earth, and the core Black Flag fantasy — *stand at the
helm, cross a real ocean, step ashore in a new land* — already works. The scriptural "circle of the
earth" framing (azimuthal disc, ice-wall rim, sun and moon circling between the tropics, 364-day
year) is executed consistently across the sky, the map, and the HUD, and it gives the game an
identity no generic sailing sandbox has.

The three things standing between this and the vision are:

1. **Five concrete bugs** (§3) — two of them badly undermine the experience (the ship renders
   solid black; coastal country names are frequently wrong).
2. **No rivers** (§5) — river traversal is in the stated vision and is entirely absent.
3. **An empty ocean** (§6) — real-world distances at a fixed boat speed mean up to an hour of
   sailing with nothing to encounter. Black Flag's core lesson is that the sea itself must be
   content.

---

## 2. What already works (confirmed by running it)

- **Boot chain**: CDN three.js r128 with local-file fallback and a graceful error card.
- **World generation**: 176 real countries (Natural Earth-style polygons) rasterised to an ID map,
  fractal-warped coastlines so vector edges read as organic block coasts, biome bands by latitude
  (snow / tundra / temperate / desert / tropic), beaches, ice shelf with floes, and the rim wall.
- **The projection is mathematically correct.** Country centroids decode back to their true
  latitude/longitude (verified numerically: Israel 32.0N 35.1E, Japan 35.9N 135.8E, US 40.5N 90.4W).
  This is a genuine azimuthal-equidistant Earth, not an approximation.
- **Ship ↔ shore ↔ ship transitions** (E key / ⚓ button) work, including landing on village piers.
- **Villages** spawn in every country: houses with stepped roofs and glass, well, farms with
  irrigation channels, animal pens, hay, lamp posts that only glow at night, wandering robed
  villagers and animals (with a latitude/biome-aware roster — camels in deserts, sheep in the north).
- **Day/night** is position-dependent (flat-earth model: it is night where the sun is far away
  across the disc), stars circle the pole, torch glow fades in — the night village screenshot is
  genuinely atmospheric.
- **The firmament view** (scroll all the way out) is an elegant map/"synchronize" mechanic, and the
  circular world map with the sun marker and player arrow is beautiful.
- **Performance architecture is sound**: merged geometry per material per chunk, per-face Minecraft
  light values baked as vertex colors, one shared material set tinted for time-of-day
  (`setBlockLight`), chunk build budget per frame, chunk + village disposal on distance. No leaks
  spotted in the disposal paths.

---

## 3. Confirmed bugs (fix these first)

### B1 — The ship renders as a black silhouette  ⚠ worst visual bug
`texBox()` (index.html:607) builds the hull, bow, stern, rims, mast, boom and flag from
`THREE.BoxGeometry` using the shared chunk materials (`MAT.planks`, `MAT.logSide`…). Those
materials have `vertexColors: true` (index.html:255), but `BoxGeometry` has no `color` attribute —
so the GPU multiplies the texture by an undefined attribute that reads as black. Result: the entire
ship except the sail (which has its own non-vertex-color material) is black. Confirmed in the
sailing screenshot.

**Fix**: give `texBox` its own materials cloned *without* `vertexColors` (push them into `LIT` so
they still tint with time-of-day), or add a filled color attribute to the box geometry.

### B2 — Wrong country names along every coast  ⚠ worst gameplay bug
Confirmed live: sailing < 5 minutes from the starting waters off Israel and stepping ashore, the
HUD read **"SOUTH AFRICA"**. Cause: `countryAtUV` (index.html:294) reads exact red values from a
canvas the country polygons were painted onto — but canvas polygon fills are **anti-aliased**, so
every coastline pixel is a blend. Israel is ID 77; a beach pixel at ~34% coverage reads red = 26 =
South Africa. Since going ashore on coasts is the whole game, wrong names will appear constantly,
and `cellRaw`'s domain-warped sampling makes the blended band effectively 10–20 km wide in-world.
It also occasionally mis-assigns village sites (`computeSites` requires an exact ID match, so some
coastal candidates silently fail).

**Fix options** (cheapest first):
1. After `getImageData`, run a one-time repair pass: for each nonzero pixel whose 4 neighbours
   don't agree with it, replace it with the majority *exact* value among neighbours (edge blends are
   ~1px wide, so this converges in one pass).
2. Or verify the sampled candidate with a point-in-polygon test against that country's rings
   (`co.p` is already in memory) and fall back to nearest-centroid when the test fails.

### B3 — Shared mutable cell object corrupts meshing and decoration
`cellRaw` returns one shared `COL` object (index.html:301, 333) that every call overwrites. Two
downstream consumers keep a reference across further `cell()` calls:

- **`emitColumn`** (index.html:438): after `const nc = cell(ix+dx, iz+dz)`, `nc` and `cc` are the
  *same object*, so `cc.h <= nh` is always true and **side faces between adjacent land columns are
  never emitted**. Inland cliffs and hills have no walls — terraces float (visible in the
  side-view screenshot; coasts look fine only because a sea neighbour returns `null`, leaving `COL`
  untouched).
- **`buildChunk`** (index.html:487–494): `yT = cc.h*B` and the `cc.tree`/`cc.kind` checks run
  *after* `emitColumn` has clobbered `COL` with a neighbour's data — trees, flowers, tall grass and
  boulders are placed using the *south neighbour's* height and biome, so they float/sink a block
  and spawn by the wrong cell's rules.

**Fix**: have `cell()`/`cellRaw()` return a fresh `{h, kind, tree, ci}` (the allocation cost is
trivial at this scale), or snapshot the four fields at the top of `emitColumn`/`buildChunk`.

### B4 — Saving does nothing in a normal browser
`saveState`/`loadSaved` (index.html:1288–1291) write to `window.storage`, which does not exist on
GitHub Pages or any standard browser (it's a sandboxed-artifact API). Progress silently never
saves and "⛵ Continue the voyage" can never appear.
**Fix**: fall back to `localStorage` (`try { localStorage.setItem(...) } catch {}`). Also worth
saving the walk position + mode — currently a player who quits ashore resumes on the boat.

### B5 — The "⟵ Berĕshith" button reloads the page it's on
`location.href='index.html'` (index.html:1308) navigates to itself. If this is meant to return to
a hub/menu from another project, point it there; otherwise remove it — as shipped it silently
discards the current session (in combination with B4, all progress).

### Smaller confirmed issues
- **Reverse collision**: `boatTick` (index.html:1092–1094) checks the bow 16 units *ahead* even
  when sailing astern — reversing pushes the stern through land.
- **Sea shimmer**: the ocean texture repeats 10,000× with `NearestFilter` and no mipmaps
  (index.html:272) — the distant sea aliases into noise (visible in screenshots). Enable mipmaps +
  linear-mipmap filtering for the sea clone only, or fade the detail texture by distance.
- **Firmament z-fighting risk**: the map disc sits at y=2 over the sea plane at y≈0.35 with a
  384,000-unit far plane — depth precision at that range invites flicker. Hide `sea`/`seaDeep`
  (and land chunks) while the firmament view is active; it also saves the entire scene draw.
- **`three.min.js` fallback isn't in the repo.** The error card tells users to place it beside the
  file — commit it (r128, ~600 KB) and the game becomes fully offline-capable and immune to CDN
  outages. (The smoke test in this review ran exactly that way.)
- **Label cache never evicts**: each country label is a 1024×170 canvas texture cached forever
  (index.html:1016). Harmless now; cap it if labels ever get bigger.

---

## 4. Geography check — in-game vs. Google-Maps distances

World model: disc radius 20,000 km (UV 1.0), 1 block = 1 km, boat speed 40 units/s = **6.7 km/s**
(≈ 20 km/s with trade winds). Measured between country centroids in the shipped data:

| Voyage | In-game | Real (great-circle) | Ratio | Sail time (plain / wind) |
|---|---|---|---|---|
| Morocco → Spain | 1,374 km | 1,343 km | 1.02 | 3.4 min / 1.1 min |
| Norway → Iceland | 1,672 km | 1,629 km | 1.03 | 4.2 min / 1.4 min |
| UK → USA | 6,656 km | 6,333 km | 1.05 | 16.6 min / 5.5 min |
| Cuba → Bahamas | 380 km | 352 km | 1.08 | 1.0 min / 0.3 min |
| Israel → Greece | 1,526 km | 1,386 km | 1.10 | 3.8 min / 1.3 min |
| Spain → Brazil | 8,694 km | 7,584 km | 1.15 | 21.7 min / 7.2 min |
| Japan → South Korea | 874 km | 754 km | 1.16 | 2.2 min / 0.7 min |
| Indonesia → Australia | 3,123 km | 2,474 km | 1.26 | 7.8 min / 2.6 min |
| Madagascar → Mozambique | 2,512 km | 1,276 km | **1.97** | 6.3 min / 2.1 min |
| Australia → New Zealand | 9,735 km | 4,450 km | **2.19** | 24.3 min / 8.1 min |
| South Africa → Argentina | 19,211 km | 8,206 km | **2.34** | 48 min / 16 min |
| Chile → New Zealand | 23,729 km | 9,119 km | **2.60** | 59 min / 20 min |

Two findings:

1. **The northern hemisphere is excellent** — within 1–16% of Google-Maps reality. Anyone sailing
   the Mediterranean, Atlantic or Caribbean gets authentic distances.
2. **The southern hemisphere is stretched 2–2.6×.** This is not a bug — it is the inescapable
   geometry of an azimuthal-equidistant disc (east–west distances inflate with distance from the
   centre, and trans-Pacific routes must go *around* the disc instead of across). Options:
   - **Own it as lore** (defensible: this *is* the "circle of the earth" cosmology — the far south
     is a genuinely vaster deep), and compensate with stronger trade winds in the southern bands so
     travel *time* stays fair even though distance doesn't; or
   - Add fast travel (§6) so the long hauls are opt-in.

Also note: **the "course" speed setting only accelerates the sun, not the ship**
(`SPEEDS` feeds `simHours` in the frame loop, `boatTick` ignores it). Players will set
"a day in six breaths" expecting a faster voyage and get faster sunsets instead. Either couple
boat speed to it or rename/clarify it.

---

## 5. The missing pillar: rivers

The stated vision is *"traverse by sea **and rivers** to new land"* — and there are currently no
rivers anywhere: `EARTH_DATA` contains only `countries` and `verses`, land cells are solid, and
`blockedForBoat` stops the ship at every coastline.

This is very achievable with the existing architecture, and it would be the single most
distinguishing feature of the game:

1. Add `EARTH_DATA.rivers`: polylines in the same UV space (Natural Earth's 110m rivers dataset
   gives the Nile, Amazon, Mississippi, Danube, Yangtze, Congo, Volga, etc. — a few KB).
2. Rasterise them onto the existing ID canvas (or a parallel one) as water, 1–2 px wide.
3. In `cellRaw`, return `null` (water) for river cells — chunks, piers, `blockedForBoat` and the
   maps all inherit the behaviour automatically. Widen by 1 block using the same domain-warp noise
   so banks look natural.
4. Sailing from the Mediterranean up the Nile past riverside villages is exactly the Black Flag
   river-mission fantasy, and it doubles the value of landlocked countries, which currently can
   only be reached on foot.

Related gap: the 110m country dataset has almost **no small islands** — no Azores, Canaries,
Maldives, no Pacific atolls between the majors. For an ocean explorer, island chains are the reward
mid-voyage. Consider upgrading coastlines to the 50m dataset (or hand-adding ~20 key island groups
as extra polygons) — it directly addresses the empty-ocean problem below.

---

## 6. Black Flag lessons (world design)

Black Flag's Caribbean works because of three decisions this game can borrow without abandoning
its 1:1-scale identity:

1. **The sea is content.** In Black Flag you are never more than ~30 seconds from *something*:
   a ship, a wreck, a whale, a fort, weather. Here, the UK→US run is 16 empty minutes and
   Chile→NZ is an empty hour. Cheapest wins, in order:
   - **Directional trade winds as a system, not a toggle.** The current "trade winds ×3" button is
     a cheat toggle. On this disc the real wind system maps beautifully to radius bands: easterlies
     in the tropic band, westerlies in the mid-latitudes, polar easterlies near the rim — make ship
     speed depend on heading vs. wind (run/reach/beat), show a wind pennant on the mast, and route
     choice suddenly matters exactly like real age-of-sail routes (out on the trades, home on the
     westerlies). This is the highest gameplay-per-line-of-code feature available.
   - **Weather**: rolling storm cells (dark fog, rain streaks, bigger bob amplitude, ×0.5 speed),
     visible on the map, worth steering around.
   - **Encounters**: the occasional passing trader (a second boat mesh on a straight course),
     drifting debris/floating scrolls carrying a verse, whales/ice floes to weave through.
   - **Fast travel, themed**: from the firmament view, tap a country you have *already visited* to
     set sail there instantly (or at 10× speed "with a strong wind"). This preserves first-visit
     authenticity while making the 2.6×-stretched southern routes replayable.
2. **Seamlessness sells scale.** Ship→shore is already seamless (good). Guard it: never add a
   loading screen between deck and beach; add a small swim radius around the walker so stepping
   off a pier isn't a hard wall.
3. **Progression = exploration made legible.** Black Flag's map fills with icons; here the natural
   equivalent is a **ship's log**: countries visited (n/176), verses found, distance sailed —
   currently only 12 verses exist and most trigger conditions are location-agnostic. One verse per
   country (discovered at the village well) turns the whole disc into a collect-them-all voyage and
   fits the scripture theme perfectly.

---

## 7. Minecraft look (characters, objects, furniture)

The block texturing is genuinely good — 16×16 nearest-filtered canvases, per-face light values
(1.0 / 0.8 / 0.62 / 0.5), stepped plank roofs, glowing torches. Against the referenced
Minecraft-style character/furniture builds, the gaps are:

1. **Houses are solid blocks — there are no interiors.** The door is a decal on a filled box; you
   cannot enter any building, and there is no furniture inside because there is no inside.
   Making houses hollow (floor + 4 walls with a door gap + roof) and furnishing them —
   stair-block chairs, slab table, bed, interior torch — is *the* upgrade that would make the
   villages read as Minecraft rather than as dioramas. The chunk-mesher primitives
   (`emitBox`/`faceTop`/`quad`) are already sufficient for all of it.
2. **Character texture coverage.** Only faces get pixel textures; bodies, arms and legs are flat
   Lambert colors. Minecraft characters read through 16×16 texture detail on *every* face —
   generating simple robe/tunic textures (folds, belt, hem stripes) via the existing `mkTex`
   machinery would be ~30 lines.
3. **Limb pivots.** Legs/arms rotate about their box centres, so swinging limbs sink into the body
   and ground. Minecraft pivots limbs at the hip/shoulder — translate each limb geometry so the
   origin sits at its top before rotating.
4. **No collision with structures or entities** — the walker phases through houses, trees, wells
   and villagers. Even coarse cylinder-vs-box pushback around village structures would ground the
   world.
5. Nice-to-haves in the same spirit: villager head-turn toward the player, door that "opens"
   (swap decal) when the player is near, chickens that flee, and one bench you can actually sit on
   (lock walker to seat + lower camera) — a very cheap, very Minecraft moment.

---

## 8. Architecture notes

- The single-file design is a legitimate choice for portability, but split `EARTH_DATA` into
  `earth-data.js` (150 KB of the 227 KB file) so the code diff history stays readable, and commit
  `three.min.js` (see B7). Total repo stays 3 files + README.
- `cell()` recomputes noise + site-flattening on every query with no caching; each column is
  queried ~5× during meshing (self + 4 neighbours) plus every walker/villager/label tick. A tiny
  LRU (or per-chunk row cache) keyed on `ix,iz` would cut chunk build cost several-fold — do it
  *after* fixing B3, which requires per-call objects anyway.
- `updateVillages` / `updateLabels` scan all 176 countries per tick — fine at this count, just
  don't grow it linearly (a spatial grid exists already for sites; reuse it if the country count
  ever multiplies).
- Mobile: the twin-zone touch scheme (left thumb = helm, drag = look) is sound, but there is no
  pinch zoom, so the firmament can only be reached via its button — add two-finger pinch mapped to
  `camDist`.

---

## 9. Prioritised roadmap

**P0 — bugs (a weekend):** B1 black ship · B2 coastal country names · B3 cliff faces + floating
trees · B4 localStorage saves · B5 back button · commit `three.min.js`.

**P1 — the voyage (the Black Flag core):** directional wind bands + sail trim · make "course"
speed (or a new mechanic) actually move the ship faster · rivers (§5) · storm cells · ship's log
with per-country verses · firmament fast travel to visited lands.

**P2 — the lands (the Minecraft core):** hollow + furnished houses · textured character skins ·
limb pivots + structure collision · small-island data upgrade · ambient audio (waves, gulls,
wind, evening hymn at villages).

With P0 + P1 done, this is a real game with a hook nobody else has: *sail the literal scriptural
earth, at true scale, from your browser.*
