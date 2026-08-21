# THE VOYAGE — the build plan, answering the brief

*Written from the repository root after reading `REVIEW.md`, `AUDIT.md` (23 rounds),
`index.html`, `js/engine.js` (12,422 lines), `countries/README.md`, `creatures/README.md`,
`world/{scrolls,scenes,landmarks,flora,fauna,rivers,deeps}.js` and
`scripture-unfolds/js/{story,stage,besorah,unfold}.js`.*

*Line numbers in this document are against `js/engine.js` **as it stood before Phase 0**
unless marked otherwise; Phase 0 grew the file by ~120 lines at the top, so anything below
the texture block has moved down by roughly that much. Current line numbers are given in
§2 where they matter.*

---

## 0. What I understand this to be

A no-build-step browser game on three.js r128, vendored locally, opened from `file://`.
The world is the scriptural earth: an azimuthal-equidistant disc, north pole at the centre,
`r = (90 − lat)/180`, `u = r·sin(lon)`, `v = r·cos(lon)`, `R_WORLD = 180000`, `B = 6` units to
the block, `CH = 16` blocks to the chunk. The projection is exact and decodes back to true
lat/lon; nothing in this plan touches it.

**The architecture is a registry and a pile of data files.** `index.html` declares
`window.EARTH` and then loads ~362 `<script src>` tags in a fixed order; each declares one
thing — a country, a city, a beast, a landmark, a river, a trench, a scene, a scroll — and
`js/engine.js` runs last and knows none of them by name. Add a file, add a line, the thing
exists. Every system below keeps that property or it is wrong.

The engine's own seams, as the comment banners mark them: textures → terrain → the named
places → beaches → the shoal map → **the chunk mesher** → the land going down to the bed →
the far land → renderer/sky/sea → waves → the host of heaven → winds → storms → the hour →
the ship → the crew → the traveller → the living things → the villages and cities → the
labours of the people → trade → fishing → the spear → Yahrushalayim → the wonders → controls
→ movement → the saddle → flight → the cutscene engine → the log → modes → the firmament
view → camera → HUD → the maps → persistence → sound → the living world → launch → the menu
→ the great loop.

---

## 1. The palette — Phase 0, and it has shipped

`world/palette.js` is new and is now the only file in the project holding a raw colour.
It names **pigments** — the earths, stones, roots and shells the ancient world actually
ground to paint with — and then names every block colour as a recipe over them, so the whole
earth can be re-graded from one file.

### The pigments

| group | names |
|---|---|
| whites & greys | `chalk` `bone` `lime` `alabaster` `salt` `ash` `slate` `charcoal` `lampblack` `bitumen` |
| earths | `ochre` `darkOchre` `rawSienna` `burntSienna` `rawUmber` `burntUmber` `redOchre` `clay` `terracotta` |
| greens | `terreVerte` `olivine` `malachite` `verdigris` `sap` |
| blues | `lapis` `azurite` `indigo` `teal` |
| reds & purples | `madder` `cinnabar` `tyrian` `scarlet` |
| yellows | `saffron` `orpiment` |
| stones | `limestone` `sandstone` `basalt` `flint` `marble` |
| metals | `gold` `silver` `copper` `bronze` `iron` `tin` `lead` |
| breastplate | `onyx` `sapphire` `jasper` `topaz` `emerald` `sardius` |
| cold | `glacier` `rime` `snow` |

with `mix(a,b,t)`, `shade(c,f)`, `lift(c,t)` and `warm(c,t)` — the last being the one that
matters most here, since the whole difference between a limestone country and a granite one
is a warm shift at constant value.

### Before and after — every texture in the engine

| texture | was | now | recipe | why |
|---|---|---|---|---|
| `grassTop` | `124,178,86` | `119,131,87` | `mix(terreVerte,olivine,.35)` | Mediterranean olive, not an English lawn |
| `grassTopTr` | `96,190,92` | `81,118,69` | `shade(mix(sap,malachite,.45),.94)` | rain forest reads **dark**, never acid |
| `grassTopTu` | `136,148,96` | `138,144,104` | `mix(olivine,ash,.34)` | tundra, dulled |
| `grassTopSv` | `190,166,96` | `192,157,88` | `mix(ochre,darkOchre,.18)` | the plain was already right — barely moved |
| `grassSide` | `134,96,67` | `137,105,74` | `mix(rawUmber,clay,.30)` | with a `terreVerte` lip |
| `grassSideSv` | `142,102,64` | `164,106,74` | `mix(clay,redOchre,.28)` | red dirt under dun stubble |
| `dirt` | `134,96,67` | `135,104,73` | `mix(rawUmber,clay,.24)` | more value spread |
| `path` | `148,124,82` | `166,141,95` | `mix(darkOchre,ash,.30)` | trodden pale |
| `soil` | `96,66,42` | `85,58,40` | `shade(burntUmber,.92)` | with drawn furrows |
| `sand` | `219,207,163` | `192,163,113` | `mix(sandstone,ochre,.26)` | warmer, browner — desert, not bleached bone |
| `stone` | `125,125,125` | `146,138,122` | `limestone`, + pale bedding veins | **the stone of that world is limestone** |
| `cobble` | `92,92,92` | `150,142,127` on dark mortar | `mix(limestone,ash,.18)` | hewn courses, not crushed gravel |
| `snow` | `240,246,250` | `236,242,248` | `snow` | |
| `ice` | `160,190,230` | `156,186,222` | `glacier` + `rime` glints | |
| `water` | `52,94,168` | `46,102,128` | `teal` | teal-leaning; not cobalt |
| `surf` | fixed white-blue | `lift(teal,.86)` | | |
| `planks` | `168,134,80` | `183,140,77` | `mix(rawSienna,ochre,.34)` | + a true run of grain |
| `roof` | `122,88,54` | `138,90,58` | `mix(burntSienna,rawUmber,.36)` | fired clay tile |
| `logSide` | `104,82,50` | `113,87,61` | `mix(rawUmber,burntUmber,.34)` | deep fissures + fine checking |
| `logTop` | `104,82,50` | `139,113,74` | `mix(rawUmber,ochre,.20)` | + drawn annual rings |
| `leaves` | `64,120,44` | `104,127,74` | `mix(sap,terreVerte,.42)` | + per-species tint (already in the flora) |
| `leavesTr` | `52,138,52` | `87,126,72` | `mix(sap,malachite,.42)` | |
| `acacia` | `104,126,66` | `127,137,104` | `mix(terreVerte,ash,.22)` | thin and grey against the sky |
| `cherry` | `244,170,205` | `210,175,170` | `mix(madder,chalk,.66)` | madder, not bubblegum |
| `tallgrass` | `92,160,64` | `109,128,80` | `mix(terreVerte,sap,.34)` | |
| `savgrass` | `196,172,96` | `204,175,115` | `mix(ochre,bone,.20)` | |
| `flowerR` | `200,44,36` | `190,64,46` | `cinnabar` | |
| `flowerY` | `232,208,60` | `222,176,70` | `saffron` | |
| `crop` | `96,178,66` | `131,137,72` | `mix(sap,ochre,.34)` | |
| `haySide`/`hayTop` | `196,160,58` | `204,166,86` | `mix(ochre,saffron,.26)` | |
| `wool` | `236,233,226` | `230,223,206` | `bone` + a **woven** over-and-under | |
| `glass` | `200,225,235` | `193,207,196` @ .30 | `mix(verdigris,chalk,.72)` | old glass is green |
| `badTop` | `201,120,66` | `174,104,67` | `mix(terracotta,burntSienna,.30)` | |
| `badSide` | 5 fixed bands | 5 pigment bands | terracotta/sienna/sandstone/bone/redOchre | |
| `benchTop`/`benchSide` | `168,134,80` | `183,140,77` | `mix(rawSienna,ochre,.34)` + `iron` | |
| `door` | `124,94,56` | `mix(rawUmber,rawSienna,.35)` | + `bronze` handle, `indigo` glass | |
| `kelp` | `40,118,64`/`58,164,90` | terre verte + malachite | | §8: the feeling, not the palette |
| `seagrass` | `70,168,86` | malachite + sap | | |
| `sponge` | `224,176,64` | `mix(ochre,saffron,.3)` | | |
| `coral` | grey master | **kept grey** | | every head is tinted as it is laid — a reef in a hundred colours for one material |
| `sun` | fixed yellows | `saffron` → `bone` | | |
| `moon` | fixed greys | `slate` → `chalk`, `glacier` mare | | |

Woods are named too (`PALETTE.wood`) — cedar, acacia/shittim, olive, fir, gopher, almug,
oak, sycamore, palm, each with a plank and a bark — ready for Phase 4's material economy.

### Texel resolution: 16 → 32

Done, and done in a way that keeps the hand-drawn composition. `mkTex` now allocates a
`32×32` canvas (`TEXEL=32`, `TS=2`) and applies `ctx.scale(TS,TS)` **before** calling the
draw function, so every hand-placed seam, mortar line, plank edge and growth ring in the
file still lands exactly where it was put. What runs at the true 32 is the **grain**:
`speckle` and its kin lay one true pixel at a time (`FG = 1/TS`), so the noise in every
surface is four times finer. `NearestFilter` is kept; the crispness is good, the coarseness
was what was borrowed.

The extra resolution has been spent, not banked: real mortar in cobble, a run of grain
along every plank, deep fissures with fine checking between them in bark, annual rings on a
cut log, an over-and-under weave in wool, bedding veins in limestone, a midrib in the leaf
master.

**Texture memory measured:** 16×16 RGBA = 1,024 B a face; 32×32 = 4,096 B. With ~240
textures resident at a village station that is **0.24 MB → 0.98 MB**, a rise of three
quarters of a megabyte across the whole game. It is nothing, and 24 is not needed as a
fallback. (Measured `renderer.info.memory.textures` at each station; the count itself is
unchanged, only the size.)

### The hewn edge

A one-true-pixel rim baked into the texture at load: darker along the bottom and right,
lighter along the top and left, so every block reads as lit from the upper left. It is
applied to **worked** materials only — stone, cobble, planks, roof, log, bench, hay, wool,
ice, badlands cliff, the flora's solid master — and **withheld from loose ground** (sand,
every grass, dirt, path, snow) and from everything drawn with a hole in it (leaf canopies,
blades, flowers, panes), where a rim would draw a box in mid-air or lay a tile grid across
an open desert.

*This is a deliberate departure from the brief's §2.1.4, which asks for the rim on every
block. Rimming sand and grass was tried first and shipped to a screenshot: it reads as
bathroom tiling across every dune and meadow in the world. A dressed stone has an arris; a
dune does not. The AO pass below does the work of separating ground blocks instead, and
does it correctly, because it responds to the actual shape of the land.*

---

## 2. The terrain representation, and everything the span change touches

### As it stands

`cellRaw(ix,iz)` — **js/engine.js:940** (current numbering) — is a pure function of the
column index returning `{h, kind, tree, ci}` or `null` for open water: **one height and one
surface kind per column**, nothing more. `cellCompute` (**1162**) wraps it to apply village
flattening; `cell` (**1153**) memoises the result in `CELL_CACHE` once `computeSites()` has
run and the terrain is immutable.

Consequences, exactly as the brief says: there are no caves. What `rangeShapeAt` (**680**)
calls a cave is a slot canyon — the height function subtracted inside a vein-shaped noise
band, open to the sky along its whole length. No overhangs, no arches, no tunnels, no
chambers, no sea caves. And no mining, because there is no third axis to remove a block
from.

### Every function the span change touches

There are 87 sites reading `.h` or `.h*B`. They are **not** 87 equal problems — they fall
into four groups, and only one of them is dangerous:

**(a) The single funnel — this is where the work is.**

| fn | line | what it must become |
|---|---|---|
| `groundInfo(x,z)` | 9561 | the walker's *only* ground query. Must take a reference Y and answer "the top of the solid span **at or below** this Y", plus "is there a ceiling above". |
| `walkTick` | 9599 | already funnels through `groundInfo`; needs a head-room test on the rise and a ceiling clamp on the jump |
| `solidTopAt(x,z,refY)` | 9025 | already takes `refY` — extend from the column top to the span top under `refY` |
| `emitColumn` | 1371 | emit faces at every span boundary, not only at `h`; floor faces on the underside of a ceiling; **AO baked in the same pass** *(the AO half is already done)* |
| `buildChunk` | 1611 | unchanged in shape; `cell()` now may carry spans |

**(b) Surface-standing queries — CORRECT AS THEY ARE and must not be touched.**
`topY` (1186), `landAtWorld` (1187), `nearestGround` (3162), `beastMayStand` (5979), every
villager/beast/bird placement (~50 sites between 5947 and 6931), every village and city
builder (7153–7410), `treeTopAt` (9393), `houseTopAt` (9379). All of these mean *"the open
sky surface of this column"*, and after the span change `h` still **is** that. A cave under
a meadow does not move the meadow. Rewriting these would be the fastest way to break
Rounds 20 and 23.

**(c) Sea-floor joins — unaffected.** `bedBlockAt` (1591), `seaFootAt` (1595),
`chunkShelfHere`, the shelf terraces in `buildChunk`. Caves are gated to land above the
waterline in Phase 1; sea caves are Phase 5 and get their own gate.

**(d) Structure collision — unaffected by spans, replaced wholesale in Phase 3.**
`blockedBySolid` (9407), `blockedByStructure`, `landmarkTopAt` (9014), `landmarkSolidAt`.

**The one-line summary: `h` keeps its meaning — the sky surface. `spans` is a new,
almost-always-`null` field describing where that column has been hollowed out. Nothing that
only wants the surface needs to change at all.**

---

## 3. The span encoding, and what it costs

```js
// cellRaw returns { h, kind, tree, ci, spans }
//   spans: null            → solid from bedrock to h. The whole ordinary world.
//          Int16Array[2n]  → sorted, disjoint, half-open AIR runs in BLOCKS:
//                            [lo0,hi0, lo1,hi1, …], each 0 ≤ lo < hi ≤ h
```

Two decisions the brief leaves open, and my answers:

1. **Store the holes, not the solids.** The brief's `[[yLo,yHi,blockId],…]` describes solid
   runs. Air runs are strictly cheaper: the common carved column has exactly one hole and
   two solid runs, so holes are half the data. `blockId` is not needed in Phase 1 — the
   material of a carved wall is the column's own `kind` — and when Phase 2's registry
   arrives, a **placed** block is an edit, not a span, so it never belongs here either.
2. **`Int16Array`, not nested arrays.** A block index fits in 16 bits at every elevation in
   the world (Everest is 221 blocks at `MTN_M_PER_BLOCK`; the ice wall crown is 610). One
   flat typed array per carved column is one allocation, not *n*.

### Memory, measured against the three cases the brief asks for

A chunk is 16×16 = 256 columns. Every cell already carries a `{h,kind,tree,ci}` object
(~64 B with the header and the interned `kind` string), so the chunk's existing cost is
~16 KB and is unchanged.

| chunk | carved columns | spans cost | note |
|---|---|---|---|
| **open ocean** | 0 | **0 bytes** | `cellRaw` returns `null` before the cave gate is ever reached |
| **plain** | 0 | **0 bytes** | the 2D gate (below) answers *no* for the whole chunk in 25 samples |
| **cave-riddled mountain** | ~110 of 256, mean 1.4 holes | 110 × (2 × 1.4 × 2 B + 40 B header) ≈ **5.0 KB** | +31 % on that chunk, and only on that chunk |

The worldwide figure is what matters: caves are seeded at `kind:'range'` landmarks, named
mountains and a sparse scatter, which is **well under 1 %** of the disc's columns. The
ordinary world stays byte-for-byte as cheap as it is today, which is the property the brief
asks for and the reason `null` is the encoding of "solid".

---

## 4. Cave generation, and how the 3D evaluation is gated

**The gate is the whole design.** Sampling 3D noise over a 60,000-block disc is not
possible, so 3D noise is only ever evaluated where a cheap 2D test has already said yes.
Three tiers, each cutting the survivors by an order of magnitude:

1. **Region gate — per chunk, 1 test.** `CAVEFIELD` is a coarse 2D value-noise field plus
   an explicit seed list: every `world/landmarks.js` entry with `kind:'range'` or
   `kind:'mount'` contributes a disc of influence, and a sparse worldwide scatter
   (`fbm(x*0.004,z*0.004) > 0.88`) contributes the rest. `chunkHasCaves(cx,cz)` samples it
   at 5×5 points exactly as `chunkHasRiver` already does (1611's neighbour). **Nearly the
   whole earth stops here**, and `cellRaw` never allocates.
2. **Column gate — per column, 1 test, only inside a cave region.** A 2D ridged-fBm
   *worm field*: `w = 1 - |2·fbm(x·0.021, z·0.021) - 1|`. Only `w > 0.86` — a thin vein
   pattern — can carry a tunnel. This is what makes caves run in **passages** rather than
   sponge.
3. **Volume — per column, ≤ `h/3` samples, only for columns past the gate.** Within a
   surviving column the 3D field is sampled at a stride of 3 blocks and refined at the
   crossings, not at every block. Depth window: from 4 blocks under the surface down to
   bedrock, so a cave never opens a hole in a meadow by accident — a cave **mouth** is
   placed deliberately, where the worm field meets a cliff face (a column whose four
   neighbours differ in `h` by more than 6).

Chambers form where two worms cross (`w1 > 0.86 && w2 > 0.86` on two decorrelated fields),
widened by a low-frequency radius field. Vertical shafts are the same worm field evaluated
on `(x, y)` instead of `(x, z)`, gated to one column in ~4,000.

**Cost, honestly stated:** in an ungated world this would be the most expensive thing in
the engine. Gated, the added work for an ocean or plains chunk is **25 `vnoise` calls**,
which is the same order as `chunkHasRiver`, already paid on every chunk today. Acceptance
test 12 exists precisely to hold this claim to account.

### Light underground

The engine bakes per-face light as vertex colour and tints the whole set by hour with
`setBlockLight`. Underground needs a **sky-exposure term per span**, baked at mesh time:

- skylight = 15 at the top of each column, flooding down to the first ceiling;
- under a ceiling, the value is the max of the horizontal neighbours' values minus 2 per
  block, computed by a small BFS over the chunk's own columns (a 16×16×h flood is far too
  much; it is done per *span*, of which a carved chunk has ~150);
- a cave mouth is bright, the third chamber in is black.

A held **torch** (flickering `PointLight`, radius ~9 blocks) and a **lantern** (steadier,
wider) are the answer to a cave you cannot see in. `torchMat` already exists as a
full-bright material at the top of the file.

---

## 5. The edit overlay

```
procedural spans  →  apply structure stamps  →  apply player edits  →  mesh
```

**Key format.** `EDITS: Map<string, Uint16Array|Map<number,number>>` keyed
`cx+','+cz` — the same key `chunks` already uses, so nothing new has to be parsed. Within a
chunk the local index is `(ly * CH + lz) * CH + lx` clamped to a per-chunk `yBase`, stored
sparse as a `Map<number,number>` while the chunk is being edited and run-length encoded on
write. **A chunk with no edits holds no entry at all.**

**`setBlock(wx,wy,wz,id)` is the single mutation entry point.** It writes the edit, marks
the chunk dirty, and marks the neighbouring chunk dirty if the block sits on a boundary.
Nothing else in the engine may write terrain. `id = 0` is air.

**Two layers, kept strictly apart:**

| layer | written by | persisted | dropped on unload | wins |
|---|---|---|---|---|
| structure stamps | `emitHouse`, `lmPyramid`, … on first chunk build | **no** — regenerable | yes | loses |
| player edits | the hand, in `setBlock` | **yes** | no | **always** |

A player edit is stored as `(index → id)` in a *separate* map from the structure stamp map.
At mesh time the order is procedural → stamps → player, so a plank the player broke out of
a house stays broken even though the house re-stamps itself every time the chunk loads.
This is the design that makes acceptance tests 8 and 9 pass without writing every village on
earth to disk.

**IndexedDB, not localStorage**, exactly as the brief says. One object store `edits`,
`keyPath: 'k'` (`"cx,cz"`), record `{k, v: 1, rle: Uint8Array}`. RLE: varint run length,
varint block id, over the sparse index space. `version` is stamped at the database level
*and* in every record from day one. localStorage keeps what it keeps now — position, log,
scrolls, reputation — because that is small, synchronous-safe state.

**Bounds: keep everything, and say so.** A player edits a vanishing fraction of a
60,000-block disc; an hour of hard digging is a few hundred kilobytes RLE'd. There is no
distance eviction. This is written down here so nobody adds one later thinking it was an
oversight.

---

## 6. Phase 3 — which builder first, and how a converted village is verified

**First: `emitWell`.** It is the smallest self-contained builder in the game (a ring of
cobble, a roof, two posts), it appears in every village on earth, and it is a *box of
blocks* with no doorway logic, no furniture and no roof rake. If the stamp machinery is
wrong, it is wrong here in twenty blocks rather than in a temple.

**Then, in this order:** `emitPen` → `emitFarm` → `emitStall` → `buildPier` → `emitHouse`
(the hard one: doorway, windows, interior, stepped roof) → `emitFurniture` → `lmStoneCircle`
→ `lmWall` → `lmGate` → `lmLighthouse` → `lmPyramid` → `lmZiggurat` → `lmTemple` →
`lmStatue` → `lmCity` → `buildYahru`.

**How a converted village is verified identical *before* it is mined.** This is the part
that must not be hand-waved:

1. **A geometric diff harness.** Before conversion, build a village into a `G` bucket and
   write out a canonical sorted list of `(material, x0,y0,z0, x1,y1,z1)` boxes. After
   conversion, mesh the stamped blocks and write the same list. The stamp is correct when
   the two lists describe the same occupied volume per material — not the same triangles
   (a stamped wall merges into greedy runs and legitimately has *fewer*), so the comparison
   is done on a **voxel occupancy set**: rasterise both to the block grid and assert set
   equality. This is exact, and it catches the off-by-one at every corner.
2. **A screenshot pair** at a fixed camera for every converted builder, in `AUDIT.md`.
3. **Collision parity:** sample 2,000 points through the village volume and assert
   `blockedByStructure` (old) and `solidAt` (new) agree.
4. **Then**, and only then, break a wall block and assert the hole is real (test 8) and dig
   the ground from under it and assert the house does not fall (test 9).

**The ship, the creatures, the villagers and the traveller stay decoration.** They move;
they are not on the block grid. This is not negotiable and is worth a comment at each site.

---

## 7. The scale question (§11) — I agree, with one amendment

`js/engine.js:34` reads `const R_WORLD=180000, B=6 /* rim = 30,000 km, 1 block = 1 km */`,
while the traveller is ~12 units — **two blocks** — and every village, temple and ship is
built at that human scale. Elsewhere a 96-unit chunk is called "ninety-six metres".

**I agree with you: do not fix it.** The compression is what lets a whole earth fit in a
browser, and the two readings never meet in the same sentence. But the comment as it stands
is not a naming of the tension, it is one half of it — which is exactly how a future
contributor "corrects" it and shatters the world. My amendment: the comment at line 34
should state **both** measures and which one each system reads, thus:

> A block is **two measures at once, and this is deliberate.**
> *As a body walks it*, a block is a **metre**: the traveller stands two blocks, a beast is
> built to its true adult length in blocks (`U_PER_M`), the depth gauge reads metres of
> block, the ice wall is 610 blocks for 2,000 feet, and a mountain is scaled by
> `MTN_M_PER_BLOCK`.
> *As the chart reads it*, a block is a **kilometre**: the rim stands at 30,000 km, the
> compass reports kilometres, and a crossing is a real ocean's worth of sailing.
> These never meet. Walking measure governs everything within sight; chart measure governs
> everything between sights. **Do not "reconcile" them** — reconciling them either shrinks
> the earth to a pond or makes a day's sail take a day.

The moment the player can build, a ten-block house is a ten-kilometre house *on the chart*
— and that is fine, because the chart never draws houses. What would **not** be fine is the
free-hand mode letting someone lay a thousand blocks in a line and finding it spans a
continent; so the one concrete consequence I would add in Phase 4 is that the chart's
distance readout keeps chart measure and the block-placement reach keeps walking measure,
and the HUD never shows both at once.

---

## 8. The headless test harness

`tools/harness.js` and `tools/shots.js` are committed and running. The harness boots
`index.html` from `file://` in headless Chromium (swiftshader), waits for the menu, sets
sail, and exposes the existing `window.__VDBG` / `window.__WORLD` debug handles. `shots.js`
stands at six fixed stations — a village, the cedar coast, open sand, closed rain forest,
alpine rock, a cold coast — pins the hour to local noon, shoots each, and **times two
hundred frames standing still** at each, reporting mean, p95, triangles and draw calls. That
is the frame budget the brief asks to be watched like a hawk, and it is now one command.

Acceptance tests 1–12 are written as `tools/acceptance.js`, one function per test, each
returning `{n, ok, got}`. Tests **10 and 12 pass today** — the occlusion is measurably baked
into 90,352 vertices of built grass (darkest corner 0.550, where every one of them was
exactly 1.000 before), and ocean and plains chunks build at 2.253 and 2.131 ms against a
2.152 / 1.970 baseline taken from a `git worktree` of the commit before Phase 0. Tests 1–9
and 11 report PENDING and name exactly what they wait on; they will stay that way, by
design, until Phases 1–3 land. A red test that says what it wants is worth more than an
absent one.

---

## 9. Where I think the brief is wrong

Five things, in descending order of how much I would want to be argued with.

1. **The chamfer must not go on loose ground.** §2.1.4 says "draw a 1px darker rim on every
   block texture". I did that first. Sand and grass become bathroom tiling — a hard
   rectilinear grid across every dune and meadow, which is *more* Minecraft-grid than what
   it replaced, not less. The rim now goes on worked materials only. **Shipped that way;
   the screenshots are in `AUDIT.md` Round 24.**

2. **Spans should store air, not solids.** §3.1 specifies `[[yLo,yHi,blockId],…]` solid
   runs. Air runs are half the data for the common carved column and need no `blockId` at
   all. The `null`-means-solid property the brief rightly insists on is preserved either
   way. See §3 above.

3. **"Convert `buildPier` to blocks" fights "the ship stays decoration".** A pier is on the
   grid and should be stamped — agreed. But the pier is also the thing `goAshoreFromShip`
   uses `deckMap` to find, and `deckMap` is a parallel truth about where a pier's planks
   are. Converting the pier without also making `deckMap` a *read* of the block volume
   leaves two tables to drift apart — the exact failure `_solidRec` was introduced to stop.
   I would convert the pier **last** of the village builders, together with `deckMap`.

4. **Test 11's 1.5× frame budget is too loose for an edited chunk and too tight for a
   cave.** An edited chunk differs from an unedited one by one remesh, not by any per-frame
   cost — it should be held to **1.05×** steady-state, with the remesh measured separately
   as a one-frame spike budget (my proposal: ≤ 8 ms, since the existing chunk budget is a
   14 ms slice). A cave interior, on the other hand, legitimately draws more faces than open
   ground *and* runs a torch light; 1.5× may be optimistic on a phone and I would rather
   discover that than promise it.

5. **Phase 6 asks to rebuild the village animals at true scale — that is a Phase 3
   dependency, not a Phase 6 item.** `creatures/README.md` records land beasts drawn at half
   life size because the hand-built village cattle predate the system. Pens, byres and
   gates are sized to the half-scale animals, and Phase 3 converts pens and byres to block
   stamps. Doing the stature change *after* Phase 3 means stamping every pen in the world at
   the wrong size and then re-stamping it. It should happen either before Phase 3 or as part
   of it.

One further note, not a disagreement: **§10's manifest loader must come before the block
files, and I would put it before Phase 1 rather than in Phase 2.** `index.html` is at 362
script tags today; every phase from here adds more, and the loader is an afternoon's work
that gets cheaper the sooner it is done.

---

## 10. What is done, and what is next

**Done and verified live in a headless browser (Round 24 in `AUDIT.md`):**

- `world/palette.js`, and every colour in the engine drawn from it
- 32×32 texels, with the extra resolution actually spent
- the hewn edge on worked materials
- **vertex-baked ambient occlusion** at block corners, in the mesher pass, per §2.1.3
- two live bugs found by the harness and fixed (`setLocalHour` NaN-ing the world clock;
  `audioTick` throwing out of the render loop on a non-finite gain)
- `tools/harness.js`, `tools/shots.js`, `tools/acceptance.js`

Two further items from §2 were cheap enough to take now and are in as well: the **haze
graded per country and per hour** (§2.1.5) and **`js/gait.js` — six true quadruped gaits**
(§2.3.2), chosen by speed in the beast's own body lengths, with `pace:true` the only thing
any species says about its own going and it says it in data.

**Phase 1 is now in as well** (Round 25 in `AUDIT.md`): `js/caves.js`, air-run spans on
`cellRaw`, gated tube-carved caves with 129 walk-in mouths among the named ranges alone,
span-aware meshing with baked underground light, span-aware collision through the single
`groundInfo` funnel, and a torch carried as a shader uniform rather than a scene light.
Acceptance 1, 2, 3, 4, 10, 11 and 12 pass; 5–9 remain PENDING on Phases 2 and 3.

Two things in §3 above were revised by building it, and the revisions are the honest
record: the bore of a passage is the **distance to the vein**, not a threshold on a ridged
field — thresholded thin enough to avoid a sponge, the band on the ground is 0.7 blocks
wide, which is a slot; and an air run stops **three** blocks short of the surface, not one,
because one block of roof reads as a covered trench rather than a cave.

**Next, in the brief's own order:** Phase 2 — the manifest loader, the block registry under
`blocks/`, `setBlock`, the edit overlay, dirty-chunk remeshing and IndexedDB. Tests 5, 6, 7
and the edited-chunk half of 11.

§9 above still stands and I would still rather be argued with on it — particularly on
`buildPier` and `deckMap` (§9.3) and on the true-stature animals being a Phase 3 dependency
rather than a Phase 6 item (§9.5), both of which bite in the phase after next.

---

## 11. Phase 4 — the hand and the hoard: the order, and why it is that order

Phases 0–3 are in `AUDIT.md` with screenshots (Rounds 24–32). Phase 3 closed with the
geometric diff at 14 pass · 0 fail and the game's own suite at 12 pass · 0 fail · 0
pending, so by §12's rule this phase may begin.

**The happy fact this phase starts from:** the block registry already declares
`hardness`, `tool`, `drops`, `gravity`, `liquid`, `light` and `verse` — written in Phase 2
against exactly this day and, until now, read by nothing. Phase 4 is in large part the
*using* of what is already declared, which is why the early steps are small.

### The order

Each step is bootable on its own, each is verifiable on its own, and each is only ever
allowed to depend on the ones above it.

**1. The reach and the mark.** Voxel DDA raycast from the eye, reach ~5 blocks, returning
the hit cell AND the face. A thin gold outline on the aimed block — this game's gold, not
a black wireframe. *Changes nothing in the world.* It is the ground everything else stands
on and it can be proved by itself: aim at a known block, assert the cell and the face.

**2. The blow.** Hold to break. Progress scales with `hardness` and the held tool.
Fracture drawn as cracks spreading from the point struck. On completion `setBlock(…,0)` —
which exists, is one door, and is already covered by tests 5 and 7.

**3. The drop, and the gathering.** A broken block yields its `drops` as a thing that falls,
settles on the ground and is taken up on approach. A small item-entity system, and the
first place the traveller's `verse` on a block can be spoken.

**4. The satchel.** The inventory as DATA only — stacks, counts, ids, capacity. No UI at
all. It goes into the save beside the block edits, which is already versioned and has a
migration path.

**5. The belt, and the page.** Only now the UI, and per §2.2 this is where the phase is won
or lost: **a row of clay tokens on a leather belt**, and a satchel that opens as an
illuminated page. Number keys, wheel, and the twin-zone touch scheme extended without
becoming unusable — which the brief rightly calls a real design problem, so it gets its
own step rather than being an afterthought of step 4.

**6. The placing.** Against the hit face, on the air side. **Refuses to place inside the
traveller, a villager or a beast** — the brief flags this as immediately world-breaking and
it is, so it is written with the test beside it.

**7. The material economy.** ✅ *Round 39.* `world/minerals.js` on the same per-land data
pattern as `world/fauna.js`: gold in Havilah, copper in the Aravah, bitumen at the Dead
Sea, alabaster in Egypt — distributed by land AND by depth, into the caves Phase 1 dug.
Eight substances, 63 holdings across 44 lands, six new `blocks/` files. **What the ground
taught it:** the rock is only as thick as the land is high — there is no underworld — so
the deep metals are metals of the HILLS, and the bands are written knowing it. **And the
mesher had to be taught to draw them:** it took every face's material from the terrain
kind and never asked the block model, so a seam was breakable and invisible. The flank
bands are cut at the seam now, and the floor and roof of a passage take the stone they
are cut in.

**8. Gravity, and finite water.** ✅ *Round 40.* Sand falls when unsupported — and the
same rule answers a bank BUILT on nothing as answers one dug out from under. Water is
moved and never made: as much after a flow as before it, down first, then to a fall, then
out flat under the weight over it. Both hang off the one door and only on an EMPTIED cell,
so a world nobody is digging pays nothing.

**N blocks, and it took a measurement to find I had not written it.** I reasoned the rules
must settle and put the reasoning in a comment; the first pool measured drained seven
blocks at a cost of a thousand moves. Down lowers the water, a step sideways does not.
Every parcel carries a reach now — a fall gives it back, a step across spends one — which
is what §11 asked for in the first place. Measured, and then **stopped**: 394 moves to
breach a pool of twenty-seven, 133.81 ms/frame against 130.55 standing still.

*Gravel is not shipped, and water is not swum in — both named in AUDIT Round 40 §9 with
the reason, rather than left to be found missing.*

**9. The named works.** ✅ *Round 41.* `world/works.js`, one `EARTH.work({…})` apiece —
**thirteen**, each with its verse quoted exactly. The altar of unhewn stone **that refuses
hewn stone**; the hewing that makes hewn stone a thing to refuse; the mason's courses;
knives of flint and four tools of flint and riven plank; a kiln, and the works of the fire
that need one — brick, tile and glass, because *"bake them thoroughly"* is a method and
not a flourish. Not a tech tree: the whole list is on the page from the first minute,
greyed where he lacks, in madder where he is refused.

**And the living rock was renamed to what it is.** It shipped as "Hewn Stone" — the
world's own bedrock, described as though a mason had dressed it — which made the altar's
refusal meaningless. It is **Unhewn Stone** now (id unchanged, so every save and every
structure is untouched), and hewn stone is what a work makes of it.

*The tent of goat hair, the ark of gopher wood and the smelting of metal are named in
AUDIT Round 41 §7 as waiting on materials the world has not got, rather than shipped as
recipes nobody can attempt.*

**10. The free hand.** ✅ *Round 42.* Unlimited blocks, flight, instant break, same world,
same save — **and it is not a third mode**. The second mode at the menu already existed
and had since long before there was a hand: FREE ROAM, which gives the air, the sun, the
hour and the season. A third would have left a man choosing between flying and building,
which is backwards. So the free hand is what free roam BECOMES now that there is a hand:
the same flag, the same line in the log, three more freedoms — a laid block costs
nothing, a blow takes at a touch and leaves no litter, and **the Stores** open on the
page with every stone in the world laid out to be picked up (and no tool among them: a
tool is made at the works, and a man who could take a pick out of the air would never
make one).

*Same world, same save was already true and had never been said:* beginning anew washes
the LOG and has never touched the block edits, which are keyed to the world and not to
the voyage. A place built with the free hand stands there on the next voyage.

**PHASE 4 IS COMPLETE.** Acceptance 23 pass · 0 fail · 0 pending.

### Two things I will not do, and say so now

**I will not build the whole catalogue of substances in §4.** The brief names metals,
stones, woods, breastplate gems, cloth, dyes and spices — well over sixty blocks. Making
sixty blocks nobody can use is exactly the "placeholder content" §14 forbids. The rule I
will hold to: **a substance ships when a work needs it, an ore ships when a land holds
it.** The rest is a list in `world/minerals.js` waiting for its work.

**I will not let the interaction loop reach the sea, the ship or the beasts.** Break and
place act on the block world only. The ship, the creatures, the villagers and the traveller
stay decoration, as §6 of this plan already committed for Phase 3 and for the same reason.

### The tests, written before the features

As with 1–12, in `tools/acceptance.js`, PENDING until their step lands:

13. the mark falls on the block the eye is on, and on the right face of it
14. a blow of the hand breaks a block in the time its `hardness` says, and no faster
15. what is broken becomes a thing on the ground, and comes into the satchel
16. the satchel stacks, and survives a reload
17. a block placed against a face stands on the air side of it
18. no block may be placed inside the traveller, a villager or a beast
19. sand falls when the ground is taken from under it, and stops when it lands
20. an altar of unhewn stone refuses hewn stone

### What it must not cost

The measurement rule of Round 28 onward stands: the stations before and after, in
`AUDIT.md`, and the raycast is per-frame work in the hot path — it is one DDA walk of five
cells and it will be measured, not assumed.

## 12. Phase 5 — the mountains and the deep: the order, and what was measured first

*"Overhangs, arches, undercut cliffs, tunnels through ridges, crystal chambers, sea caves,
ore distribution by land and depth, summits that are real climbs."*

**One of the seven is already done.** Ore distribution by land and by depth shipped as
Phase 4 step 7 (`world/minerals.js`, AUDIT Round 39), and the mesher was taught to draw
the seams in the same round. Struck off rather than done twice.

**AND ANOTHER WAS ALREADY TRUE, WHICH IS WHY IT IS NOT A STEP.** My instinct was to open
the phase with *"summits that are real climbs"*, on the assumption that a mountain in a
block world is a wall. It was measured before it was built — a flood fill over the ground
under the walker's OWN climb rule, four courses at a stride, from the rim of a
three-hundred-block square inward to each peak — and the assumption was wrong twice over.

First over the anonymous ranges: seven in eight already reached. Then, aimed correctly at
the mounts the brief NAMES and Phase 7 will put scrolls upon:

    Mount Ararat  167 · YES     Mount Everest 243 · YES     Denali      157 · YES
    Mount Sinai    94 · YES     Kilimanjaro   149 · YES     Aconcagua   207 · YES
    Mount Hermon   95 · YES     Mont Blanc    131 · YES     Mount Fuji  141 · YES
    Mount Olympus  83 · YES     Table Mountain 48 · YES     Uluru        68 · YES
                                                            Mount Zaphon 49 · YES

**Thirteen of thirteen, with the terrain untouched.** Everest at two hundred and forty
three courses has a way up it, and so does Ararat.

I had written a bench term into `cellRaw` before measuring properly — a terrace on high
ground, meant to break the flanks into shelves. It moved summits by a course or two across
the whole earth and fixed nothing, because there was nothing to fix. **It has been taken
out again.** A change to the shape of the world needs a defect to point at, and §12's rule
about not re-solving what is ticked applies just as much to things nobody thought to tick.

What the measurement left behind is worth more than the change would have been:
**acceptance test 24, "every named summit can be reached on foot"** — which will fail the
day a terrain change quietly walls off Ararat, and will fail BEFORE Phase 7 puts a scroll
on top of it.

*(One anonymous range still has an unreachable top: a three-block-wide spire standing
sixty-four courses out of ground at height eight, found by cross-section. That is a
pinnacle, not a mountain without a path, and pinnacles are welcome. Recorded so it is not
re-discovered as a bug.)*

### The order

**1. Overhangs and undercut cliffs.** ✅ *Round 43.* Censused first: nine cliff faces in
twelve hundred were undercut, because `ROOF` keeps every carve deep and a cliff can only
cut a round hole in the middle of a face. An undercut is not a cave — it is a BAND of
softer stone weathered back with the hard rock left standing over it, and rock is BEDDED,
so the band recurs every thirteen courses and every face gets a stack of recesses.
**Nine undercut cliffs became sixty-three, with no plate buried under any plain.**
And test 12 cried wolf for the second time in the project's life; it now measures the
machine before it reads its own figure.

**2. Arches, and tunnels through a ridge.** ✅ *Round 44.* Censused first: **zero** arches
in forty thousand columns of range country. Nothing was aiming at one and nothing could —
an arch is a NEIGHBOURHOOD fact and `spansAt` is handed one column, which is what keeps it
cheap. So it is not detected, it is PLACED, exactly as the blue holes are. And an arch and
a tunnel are ONE THING: a horizontal bore is a way through where the ridge is thick and an
arch where it is thin, and the land decides which. **13 bores driven, 7 come out the other
side**, the thickest crossing 27 steps of rock.

**3. Crystal chambers.** ✅ *Round 45.* Censused first, and **the chambers were already
there** — 1,295 air runs of eight courses or more, the tallest sixteen. What was missing
was not the room but the CRYSTAL. Six stones of the breastplate ship, named as SHEMOTH 28
names them (shoham, not onyx; ruby, not sardius — the brief was quoting from memory, and
the source names twelve). `in:'chamber'` is a new kind of rule in `world/minerals.js`: not
a band of depth in a land, but the floor and the roof of a room, so no amount of digging
straight down turns one up. **113 stones found, 113 in the wall of a chamber, none
anywhere else.**

**4. Sea caves at the waterline.** ✅ *Round 46.* Censused first: of 2,629 coastal columns
and 628 of them true sea cliff, **seven** had any hollow at the waterline. `MIN_H` keeps
the carve out of low country and `FLOOR` keeps it off the bottom — both right for a
mountain tunnel and both exactly wrong for a cave the sea cut, which is LOW by definition.
A band pinned to the waterline rather than to the bedding, gated on the column being low.
**Seven became eighty-four, every one with rock standing over it.** *The something at the
back is NOT here* — §8 asks for it and Phase 8 is where it belongs, with a schematic
format and a capture tool; a hoard invented now would be placeholder that had to move.

**PHASE 5 IS COMPLETE.**

### What I will not do

**I will not change the shape of the world without a defect to point at.** The bench term
above is the cautionary case: written on an assumption, measured afterwards, reverted.
Measure first — and if the world already does the thing, ship the TEST and not the change.

**I will not carve a staircase.** A path cut to a summit is a level designer's answer to a
terrain problem; it would read as built, and nothing built it.

## 13. Phase 7 — the scrolls: the order — **COMPLETE** ✅

*"Six new films, BESORAH extraction, short in-world scenes on discovery, the great scrolls
relocated into the caves and summits Phase 5 built."*

**The extraction is already done.** `tools/extract-besorah.js` shipped in Round 41 — §5 asks
for it by name and it had never been written. It quotes, searches, lists the books, emits
this project's own format, and **checks every verse the world ships against the source**.
Struck off rather than done twice.

### The order

**1. The great scrolls put where they belong.** ✅ *Round 47.* §5: *"Make the great scrolls
cost something."* Phase 5 built the caves and the summits for exactly this. A scroll may
now name a PLACE — `at:{mount:…}` or `at:{cave:true}` — and the engine knows no scroll by
name, it reads `at`. **The Scroll of the Going Out stands at 94 of 94 on Sinai; the Cave
of Treasures and Ḥanoḵ lie in the dark at light 0.04 and 0.00, both reachable.**

**2. The short scene on discovery.** ✅ *Round 48.* Nineteen seconds, six marks, over the
actual landscape, holding the scroll's own verse. **One scene serves all eight** — every
mark is measured from the traveller, so it films whatever he is standing in: the whole
range from the summit of Sinai, four walls and a torch in the Cave of Treasures. Each
scroll now carries a verse from its OWN book, sourced through the extractor and checked by
`--check`; `words` beside it stays narration in the game's voice with no chapter and
verse, which is the distinction §5 insists on.

**3. The six missing long films.** ✅ *Round 50.* Only two of eight had them; the shelf
holds **eight** now — 77 new captions across 27 minutes. `--emit` was added to the
extractor because §5 asks for it and nothing could make a fourth book; it re-emitted the
three that already existed **byte for byte**, which is how I know the format is the one
that ships. Then the scripture was two megabytes, so **a scroll is unrolled when it is
taken down**: one kilobyte of spine at boot, the book fetched when it is chosen, measured
at **0 of 8 open at boot**. Which books a scene reads is derived off its own caption
track, which closed a hole Round 49 left — the garden is filed under BERĔSHITH and ends in
ADAM AND HAWWAH 1, so finding one scroll opened half a film. And §5's *"do not invent a
reference"* had no guard at all over captions, because a caption carries no words to check
against: `--check` resolves all 124 of them now, and test 31 makes the same fetch on the
real page.

Three old faults came out of looking: the second game carried its own copy of the world
registry and had fallen **three registrars behind** (42 blocks, 14 substances and 13 works
all threw on load, silently); the stage eased the sky's hex as one integer, so *every*
film slid through hues neither of its keys named; and the films were played at whatever
hour the world clock held, because every stage dial paints the sky and the ground is lit
by the engine's day tint. There is one `world/registry.js`, colours ease per channel, and
`hour` is a dial.

**4. The log and Scripture Unfolds.** ✅ *Round 49, taken BEFORE step 3 — it is the pipe
six films would flow through, and it was cheap to measure.* **It did not exist.** Nothing
under `scripture-unfolds/` so much as mentioned the voyage's save; the shelf listed every
passage it had, always, to everybody. The two games shared an engine, a world and a
Besorah and shared nothing about what the traveller had done. It reads `voyage:state` now
— reads and never writes — and a passage whose scroll is still in the earth is shown and
greyed and says why. **With no voyage at all, everything is open**: someone who has not
played the other game has not failed to find anything.

### What I will not do

**I will not assign a scroll to Ararat.** §5 says *"Mount Ararat — the scroll on the
summit"* and does not say which. None of the eight is the account of the flood, and
choosing one to stand for it would be inventing an assignment the brief did not make.
Ararat waits for a scroll that belongs on it, and `world/scrolls.js` says so where a
reader will find it.

---

## 14. Phase 6 — the living things: the order, and what was already there

*"§2.3 and §2.4 in full: coats, gaits, true stature, finer creature grain, herd structure;
branching trees, canopy forms per species, bark, seasonal colour, the ground layer, crops
that grow."*

Phase 7 was taken out of order because it was asked for. This is the earliest phase still
open, and **two of its twelve items are already done** — so before planning anything I
went and looked, rather than planning work that exists:

| §2.3 fauna | state |
|---|---|
| 1. Coats, countershading, markings | **nothing.** `lbox` gives every limb one flat Lambert colour |
| 2. Real gaits | ✅ `js/gait.js`, six gaits, chosen by speed, one datum per species in `js/behavior.js` |
| 3. True stature | ✅ `js/size.js` — the half-scale field beasts are gone, one measure and it is the man's |
| 4. Finer voxel grain | partial: two-bone limbs with knees, but 12–15 parts on the large mammals |
| 5. Herd and flock structure | partial: roles and flight in `js/behavior.js`, no matriarch, no vigilance |
| 6. The daily round | partial: `day:` and `acts:` exist, no drinking, wallowing, bedding |

| §2.4 flora | state |
|---|---|
| 1. Branching | **nothing.** A bole and a canopy; no branch orders anywhere in `js/flora.js` |
| 2. Canopy per species | ✅ `form:` in `world/flora.js`, a dozen forms built in `js/flora.js` |
| 3. Bark per species | ✅ *Round 59, and it was built in Round 52 and left unmeasured* — six barks assigned by kind in `js/flora.js`, the tint still on top, +8.6–16.7% draw calls and **not one triangle** |
| 4. Seasonal colour | ✅ *and it already was* — see the correction below |
| 5. A real ground layer | ✅ *Round 67* — `js/ground.js`, the third file of the ground: litter of the tree's own leaf, needle mat, moss on the shaded side, lichen on the bare rock, deadfall, fungi. **+8.5% triangles and not one new material** |
| 6. Crops in stages | ✅ *Round 68* — `world/crops.js` + `js/crop.js`: a field bears its own country's corn out of the flora that was already there, and the year is in the vertex shader. **0 chunks built for the whole turn of the year** |

### The order

**1. The coat.** ✅ *Round 51.* §2.3.1, and the headline of it is *countershading* —
*"near-universal in real animals and almost absent in Minecraft."* It went first because
it is the only item here that touches **all 150 species at once without editing one
creature file**: the beast is built as it always was, and `makeBeast` grades the finished
model. **150 files, 2534 meshes, 0 left flat, at 1.13× the build cost and no per-frame
cost at all.** The first cut graded by HEIGHT on the animal and had good numbers and was
wrong — a gazelle's body spans a fifth of its height, so the body moved four parts in a
hundred and the head went dark. Countershading is about which way a face is turned, not
how high it is. The test was written twice for the same reason, and the second one was
proved by putting the broken version back and watching it fail. Markings — spots, stripes,
dorsal lines — are data and come after, per species.

**2. Branching.** ✅ *Round 52.* §2.4.1. The other change that alters every one of a thing
at a stroke: *"Every tree in the world stops looking like every other tree."* **85 species
branch, 55 keep their own form** — a cypress is a green pillar and a palm is a stem with
fronds, and branching those would be drawing something else. Cost, counted directly and
then in a real wood: the boughed forms are **2.5× their own geometry**, which comes to
**+11.7% triangles in a German wood and +9.9% in the Congo**, built once into the chunk
mesh with no new material and no new draw call. The first cut made the wood WORSE — the
boughs reached on their own scale and a crown 1.9 blocks across became nearly three, so a
stand of oak read as one green slab. The envelope is struck off the crown radius the form
already had; the test guards it, and was proved by putting the sprawl back.

**3. Seasonal colour.** ✅ *Round 53, and mostly by correcting this document.* I wrote in
the table above that *"`js/season.js` exists; the leaves do not read it."* **That was
wrong.** `SEASON_VS`/`SEASON_FS` in `js/engine.js` have gilded the canopy toward gold
through autumn and greyed it through winter all along — per hemisphere, per zone, in the
shader, with no chunk ever re-meshed — and the ground takes its snow the same way. I had
grepped the flora for `SEASON`, found nothing, and concluded from the wrong file. Measure
first, and if the world already does the thing, ship the TEST and not the change.

What WAS untrue is §2.4.4's last clause, *"evergreens unchanged"*: the gilding is worked
out from LATITUDE — right for the zone, blind to the tree — and there was **one leaf
material in the world**, so every spruce, pine, cypress and olive in a temperate land went
gold in October with the oak beside it. A Norwegian wood in autumn was uniformly yellow.
There is a second leaf now, the same texture and sway but never given the season, and
which trees take it is data: the form gives a default and fourteen species say otherwise,
because a larch is a conifer and bare all winter and an aspen is a column and the most
golden tree there is. **54 species keep their leaf, 84 turn**, for +249 meshes in a boreal
view (+5.6% draw calls) and **not one extra triangle**.

**4. Herd structure and the daily round.** *Round 54 — partly, and the audit says which
parts.* **The daily round was already there**: `js/behavior.js` has every beast keeping its
own hours, walking to its own den at dusk, and drawing from its own list of drink, wallow,
dust, groom, alert, bask, dig and play. Measure first.

What was untrue: **there were two flight distances in the whole world** — nine units for a
man and eighteen for a hunter, written into the engine — so a hare let a wolf come as close
as a bull elephant did. It is the beast's own now, struck off its `run` by default with
twenty-six rows saying otherwise where that rule is wrong. And **the watch**: `alert` was
drawn as an act, so a herd had nobody up most of the time and three staring at once now and
then. A herd now keeps **at most one head up, ever**, and the watcher **hands it on** when
it stands down — 29% watched when hung on the end of a meal, 44% asked at every decision,
**62–69% handed on**. I do not claim "always"; the audit gives the number, and the record of the test I first wrote wrong.

**Still open in §2.3.5:** the matriarch, juveniles at the centre, and real flocking for the
birds. Four attempts this round, all reverted. What is genuinely known is that the herd
gathering rule fires only when a beast picks a new wander target — visible in the code, and
it needed no measuring — so a herd here is a loose correlation and not a structure.

**What is NOT known is whether any of it helped**, because the metric I built for it is
worthless: it reports hundreds of "calf-samples" that are two or three animals looked at
every twelfth frame, so n is three, and the same unmodified build read **80% one run and
10% the next**. Before this item is touched again it needs a measurement over many
INDEPENDENT herds — different lands, one reading apiece — built first. AUDIT Round 54
carries the whole of it, including the two mechanisms that are worth keeping. Fish schooling already stands. **The flocking was built and taken
back out** — the mechanism works (a flock must TRAVEL, since alignment cannot be added to a
circle; measured at 44° of heading between flock-mates against 86°), but a bird has nowhere
in its day to BE in a flock: 95% of them are in 'hunt' at any moment, and a gull on open
water never reaches the end of a meal. That is a question about the bird's day, not about
the geometry, and it wants its own round. AUDIT Round 54 carries the working mechanism for
whoever takes it up.

**5. The floor of the wood.** ✅ *Round 67.* §2.4.5, and it is the one item in that section
the game this is measured against does not attempt at all. **Two of its eight clauses were
already standing** and were left alone — the saplings (`FLORA.saplingAt`, Phase 5) and the
herb layer out of the named herbs of `world/flora.js` (`FLORA.plantAt`). The six that were
missing are litter, needle mat, moss, deadfall, fungi and lichen, and they are `js/ground.js`
— a third file beside the sward and the flora, owning what LIES ON the ground as against what
stands up out of it. It knows the name of no species: the engine hands it the kind the mesher
would have grown there and the litter is that tree's own leaf, turned. **545 chunks: +87,302
triangles (+8.5%), fourteen materials before and fourteen after.** The measurement earned its
keep at once — the deadfall drawn in `bark` pulled in `barkW`, a grey master the six barks of
§2.4.3 had left unused, for **93 new draw calls a frame** on a thing met once in a hundred
cells. And two faults no number would have reported came out of a photograph: a wood floor of
full-cell mats at a third coverage is a CHESSBOARD, and one tint for a whole wood is painted
lino. AUDIT Round 67 carries all of it.

**6. The agricultural year.** ✅ *Round 68.* §2.4.6. Every farm on the earth grew the same
twelve anonymous green crosses, on the shortest day exactly as at harvest. **Which lands sow
what is not written down again**: `world/flora.js` already said it for a hundred and
seventy-six countries, so `world/crops.js` carries seventeen lines and none of them names a
country, and the guard that matters is that **no land sows a crop its own flora does not
name** — measured over the whole chart. The YEAR is in the vertex shader, because a crop that
grows is geometry that changes and geometry that changes means the chunk is built again: the
field is meshed once at full stature and SUNK into its own soil by how far off harvest it is.
**0 chunks built while the whole year was turned round.** The curve is held once as JavaScript
and once as GLSL from the same constants, and test 48 transliterates the shipped shader text
and puts it against the tested curve at a hundred and twenty points — they part by 6.3 × 10⁻⁶.
Cost: one extra mesh in a village that grows both a crop that turns and one that does not, out
of 467–943 in the group. Not modelled: the autumn-sown cereal. AUDIT Round 68.

**7. Finer grain on the twenty most-seen species.** Last, and explicitly not all 151 —
the brief says so, and it is the item most able to cost frames for the least reach.

### What I will not do

**I will not re-grade the 32 creature files that already build a belly of their own
colour.** They shade themselves discretely — a pale box under a dark one — and the pass in
step 1 grades *within* each box, which reads as gradation and not as doubling. Where it
does double, the beast's own file says so with one datum and the engine goes on knowing no
beast by name.

## 15. Round 55 — two faults reported from a player's own screen

Not a phase. A player sent photographs of their own screen, and feature work stops for
that: at the end of it the game has to work.

**1. "THE VOYAGE COULD NOT BEGIN — could not read creatures/jerboa.js"** ✅

The file was there and always had been. `MANIFEST.load` appended all three hundred and
sixty-five `<script>` tags in one go, so **one `onerror` rejected the whole promise** — no
retry, and a world of a hundred and seventy-six countries refusing to start over one
gerbil. It loads in ordered batches of thirty-two now, each file asked for three times, and
what may be let go of is written down rather than guessed at: a **creature or a city** is
looked up by NAME and costs one beast or one town, so the voyage sails and names it; a
**country or a block** is POSITIONAL — its id is the file's place in the list — so one
missing would build a different world under the same save file, and that stops the boot and
says why. `tools/thin-connection.js` serves the repository from a server that drops a named
file and puts six trials to it; acceptance test 36 keeps the cheap half on every run.

**2. "holes are appearing in the world view when zooming out"**

The far carpet reads the land at the MIDDLE of each cell and nowhere else. Drawn far back
a cell is some sixteen hundred units across and the Nile is forty, so a cell whose middle
fell in the river was given to the sea entire — six units under the waterline, walled, and
painted `FL_SEA`, which is half the brightness of the charted sea over it. A navy trench
across dry Egypt.

**The engine had already named the artefact and answered it in the wrong place**: the note
beside the ring's fade calls them "ragged navy shapes where the ring's coarse sampling
struck water in the midst of dry countries" and answers by taking the RING away sooner,
which hides them at the far end of the pull-back and leaves them standing through the whole
middle of it — which is where they were reported from. **The fault is in the sampling.**

`riverBlock`, set beside `cellRaw`, answers whether the water at a block is a river inside
some nation: the same warped coast, the same two rasters, two lookups and no search. A
coarse cell whose middle is such a block stands as that country's ground at the height of
the lowest bank inside it. **Nothing else is touched** — not a coastline, not a bay, not an
island, not a league of open sea, because none of them is a river. A vote of the four
corners was tried first and taken back out: it mended the rivers and ate the edges of
genuine bays narrower than a cell. Acceptance test 37 lays whole rings at an eye of 24,000
and counts the river cells with dry bank inside them that the ring nonetheless called sea.

---

## 16. The falling waters — where the work stands, and the one thing left

Not a phase either. A player asked for waterfalls, and the falls of the earth were cut into
the rock (§15's rounds), given a flow to run down them, and then **turned off** because the
first spring laid at Niagara put fourteen thousand cells of standing water into the world.
Rounds 56–57 are the answering of that, and this is where it stands.

**Mended, and each one measured before and after.** The wall that was a forty-five degree
ramp; the falling column that sprayed seven blocks sideways out of its own middle; the
sheet that took every direction instead of the way down; the sea, which is now a sink; the
world's own rivers, which were feeding our water as though every one of them were an
infinite spring; the level rule, which now draws a block at the height its level gives it
rather than a full cube; and the plunge pool, which is one block of grace at the meeting so
that a fall standing on a river is not robbed of its own bottom.

**Three more found in Round 57, and not one of them had been reported by anyone.** The
air — evaporation — was doing nothing to the standing total (within a hundredth or two, at
three falls, run both ways) while keeping thousands of cells awake for ever; it is gone.
**The tallest fall on earth was dry**: the springs were laid at the fall's origin, but a
plunge holds its lip proud for `under × drop` blocks past that, so Angel's heads stood
seventeen blocks back from its brink and 549 cells of water sat on the tabletop. And **a
plunge pool was a perpetual-motion machine** — any cell with water over it counted as
FALLING, a landed FALLING cell feeds its sides like a spring, so a basin two deep was a
ring of little springs needing no source and draining never. Krimml kept 2,787 cells of
4,485 standing with nothing in the world feeding them. Falling comes down from a SOURCE
now, and every fall unwinds to nothing when its head is taken up.

**Where the numbers stand.** Niagara 2,298 cells, Mosi-oa-Tunya 1,534, Angel 908,
Multnomah 124 — settled, **not one of them outside the gorge it cut**, and acceptance
test 39 drains all three of its falls to zero. Forty-odd per cent of the water's faces
were being drawn inside itself and are struck off (eighty-five per cent of Angel's, back
when Angel was a curtain).

**And the curtain is the debt this leaves.** The pool rule cost it: the old rule spread
water along the brink of its own accord and the whole breadth poured, and seven heads now
make seven threads. A head every other block was tried and taken back out — it gives the
volume back and will not unwind. A fall that cannot be turned off is worse than a fall
that is thin, so it stands at seven until that is understood.

### The one thing that was left, and it is done — the springs are ON

A settled fall is not a still fall. Measured over two hundred ticks after the standing total
had stopped moving, Angel laid 11,696 blocks and took up 11,676 — **eleven thousand writes
to hold eight hundred and sixty-three cells still**, and thinning the water did not help it
at all, because what is counted is the FLOW and not the pond. Every write marked its chunk
for the SAVE and re-armed the writer, so the springs would have had every fall the traveller
ever passed writing the world to the disc every 900 ms for the rest of the voyage, and would
have filed a waterfall in the record of *what hands have done*.

**Round 58 gave the flow a layer of its own** — `WEDITS`, beside the structures' `SEDITS`,
*derived, dropped, never written down*. It is drawn, it is walked into, it is collided with,
and it is not in the save. A fall is worked out again from its spring the next time the
traveller comes near, exactly as a village is worked out again from its site.

The order is the part that wanted care, and getting it wrong would have been invisible until
somebody dug a channel: water stands in AIR, so a non-zero block of the player's or the
structures' layer beats water, and **water beats a `0`** — because a dug cell is a `0` in the
player's own layer, and a channel a man has cut is exactly where he expects his water to run.
A block laid where water runs takes the cell outright, or the stone would merely hide the
stream and breaking it later would let out a puddle nobody poured.

**A hand's own source is still a deed** and still goes in the record; only the flow is
derived. And since the flow is never written, every water block in a save is by construction
a source somebody poured — so the boot spills them again and the stream re-forms in the
first minute of the voyage.

**What it measures at.** Thirty-three thousand blocks of water laid and taken up across three
falls; **the writer's queue does not move once**, and the record moves by fourteen cells in
all — the world's own doings elsewhere, not the water, which acceptance test 40 proves cell
by cell rather than by a total: of 2,698 cells of a running Iguazu, **none is in the record**.

`SPRINGS_ON` is `true`. Thirty-four falls, and the spring is laid as the traveller comes
within seven hundred units of one.

### The foot of the fall, reported from a picture

A photograph came back from Niagara with the springs live: **the traveller standing in a
lake.** Not the flood — it settles at three thousand cells and stays in its gorge — but a
sheet of water lying on flat ground, which is a fair complaint and a different one.

The gorge was the reason. This file's own promise was "a gorge running away downstream that
the fall itself cut", and what it cut was FLAT — the same height for every column past the
pool, so the profile below Niagara read `1 1 1 1 1 …`. **Water on a flat plain has no
shortest way down**, so it takes every way at once and lies in a disc. The flow was working
exactly as written and the ground gave it nothing to work with.

There is a **basin** at the foot now — two to five blocks deep, wider than the fall's own
apron, with the gorge floor standing round it as a rim — and a **channel** running away from
it, descending, with banks. And the fall is raised enough to hold them: `foot` was
`max(2, h-2)`, and at Niagara that is ONE, the floor of the world, with nothing underneath
to cut into — which is why the first channel came out as flat as the plain it was meant to
drain. Niagara reads `9 9 9 9 6 2 2 2 …` now.

### The outfall — done

`outfallWater` in the engine answers "river, sea, or dry land" from the rasters alone, and a
fan of nine rays out of each plunge pool finds the nearest water: **Iguazu the sea at 9
blocks, Mosi-oa-Tunya a RIVER at 16, Niagara the sea at 25.** The great plunges — Angel,
Gocta, Yosemite, Tugela — find nothing within their claim and keep their basin, which is the
right answer for a fall off a tepui.

Two attempts failed first and both are written into the file. The "pool" was `half × F.pool`
in both directions, so Niagara's was a hundred and eighty-two blocks deep as well as wide —
wider than the whole claim, leaving the channel nowhere to begin. And the channel, once it
had somewhere to begin, came out **dead flat at the waterline**, because the basin floor was
already there and there was nothing underneath: water reaches seven blocks on the flat and
died a third of the way along. **A stream is not a channel; it is a channel with a fall in
it.** A fall with an outfall is raised a block of grade for every five blocks of distance,
and its gorge floor eases back to the world's own land across the run so that a raised fall
is not a plateau with a cliff round it.

Niagara's gorge reads `7 6 6 6 5 5 5 5 4 4 4 3 3 3 3 2 2 2 2 1` where it read `1 1 1 1 …`.
The standing water there went UP, 3,807 cells to 5,216, and that is the point rather than a
cost: there is twenty-five blocks of running stream where there was a sheet dying seven
blocks out. Water in transit is what a river is.

### What is still owed

**The far falls.** Five of the great plunges find no water within their claim and end in a
basin. Whether they should reach further — a channel of a hundred blocks to the nearest
river, with the grade that implies — is a question about how much ground a fall may be
allowed to reshape, and it wants a picture before it wants a number.

**The curtain.** Seven heads make seven threads, and the falls that now run are thin ones. A
head every other block gives the volume back and will not unwind — that is not understood
yet, and a fall that cannot be turned off is worse than a fall that is thin.

---

## 17. What is queued behind the water, and the state each one is actually in

Named so it is a record and not a memory. Each was checked against the code today
rather than recalled, because two of them turned out to be further along than this
document said and one turned out to be a missing NUMBER rather than a missing feature.

### 1. The bark measurement — ✅ *Round 59*

**§2.4.3 was built in Round 52 and never measured**, and PLAN §14's table went on
calling it *"partial: one grey bark"* for three rounds after it had stopped being that.
`FLORA.barkOn` is the A/B switch now, cut to the same pattern as `everOn` and `boughsOn`,
and the same wood is built twice in one page: **+8.6% draw calls in India, +16.7% in
Bolivia, and NOT ONE TRIANGLE in either.** The whole of the price is bark meshes and
nothing else. Acceptance test 41 guards it.

The reading took three goes, and the reason is worth more than the number: the first two
reported a quarter of a million extra triangles from a change that touches no geometry,
because the frame lays its own ring every frame and reaps whatever falls outside it, so
the two builds stood on 545 chunks and 709. `holdWorld` stops the world laying ground of
its own while a measurement is taken, and the test asserts the two chunk counts are equal
rather than assuming it.

### 2. Tree boles as mineable blocks — *begun, and stopped on purpose (Round 61)*

The door is built and proved: `kit.bole` stamps a trunk into the structure layer, the
mesher draws it, the axe breaks it, it drops Timber — read once, end to end, off a real
acacia. `FLORA.boleBlocks` is the switch and it is **off**, for two reasons the tests
found rather than I did:

**The first build of every chunk would be trunkless.** `buildChunk` gathers its edits once
at the top and then meshes, so a bole stamped during that pass cannot be drawn by the build
that stamped it — the trunks arrive on the remesh, and a wood pops in as crowns over
nothing. Test 41, written for the bark, measured it as 63,466 triangles of difference
between two builds of the same wood.

**And the bole loses its bark.** Blocks are drawn from the block table, which has one
texture for Timber; the six barks live on the material a mesh is drawn with. Right for
breaking, a real loss to the eye.

The next round: stamp BEFORE the chunk gathers its edits — a pass over the columns that
grow trees, which the builder already walks — and then decide the bark, which is either six
Timber blocks (and a stack of timber that no longer stacks) or a tint the block table has no
room for. The second is a question about what a block IS here, and wants asking before it is
answered.

### 3. The bucket — ✅ *Round 60*

`blocks/bucket.js` and `blocks/water-bucket.js` — two blocks and not one with a flag,
because a stack in this satchel is of one kind and a man may carry three full and two
empty. A jar of baked clay, made at a kiln of three banded clay, with the words it is
drawn from beside it. The engine knows no bucket by name: `serves:'bucket'`, and `fills`
and `empties` naming what each becomes.

Poured, it lays a SOURCE and it is a DEED — in the record, and there when he sails back,
while the stream out of it is worked out again. Dipped, it takes a source of ours up (so
a man may pick his own spring back up) and merely draws from the world's own water, as a
well is drawn from and does not empty. Running water is refused. Acceptance test 42 walks
the whole chain.

### 4. Planting

`blocks/soil.js` exists. Farms and farmers exist in the villages. What does not
exist is a hand that sows: a seed in the satchel, ground that will take it, and a
crop that comes on with the season the world already keeps (`js/season.js` gilds
the canopy per hemisphere and per zone, and the agricultural year would read off
the same clock).

### 5. Building from gathered materials

The satchel stacks, survives a reload, and pays for what it lays; the free hand
lays without cost. **There is no making** — no bench, no recipe, nothing that turns
what was gathered into what was not. This is the largest of the five and the one
that most wants its shape argued before any of it is built.

### And then Phases 8, 9 and 10

**Phase 8 is authored places** — a schematic format, an in-game capture tool, and
the Cave of Treasures. AUDIT Round 46 already refused to invent a hoard for the sea
caves on the grounds that it *"would have to be picked up and moved the day Phase 8
arrives"*, so there is at least one thing waiting on it by name.

**Phases 9 and 10 are named in the brief and are not restated in this repository**,
and I will not guess at them here: whatever is written down about them should be
what the brief says, in the brief's own words, and it belongs in this section as
soon as it is to hand.

### The order I would take them in, and why

**The bark measurement first** — it is an afternoon, it closes a Phase 6 item that
is shipped but unproven, and this project's whole rule is that nothing stands in
the record unmeasured. **Then the bucket**, because the water it pours now runs
properly and the item is small. **Then the boles**, which is a known conversion
with a known pattern and a real gain: an axe that works. **Then planting**, which
wants the season and the soil that already exist. **Building last of the five**,
because it is the one that should be designed in writing before it is coded.


## 18. Rounds 62–64 — the water built twice, the hand mended, and what a voyage may not do

**The water was built twice.** Two sessions worked the falls at the same time and neither
knew of the other. §16 and §17 above are one line of it; a branch off `296defa` was the
other, and it reached two of the same conclusions independently — the air does nothing and
comes out, and the head belongs at the brink (Angel's column: 2 blocks of 109 before, 80
after). It went no further, while this line went on to the flow's own layer, the outfall
and the buried faces. **So that branch's water is dropped entire, including the tool that
measured it**, and the dropping is written down rather than quietly resolved. Two of its
findings are still standing in `js/water.js` and are recorded in AUDIT §4bk — an air cell
that PULLS water into itself past the shortest-way-down weights, and a way down that stops
counting the moment water stands in it. Both want measuring on THIS water before they want
fixing.

**What survived that branch is what this line never touched.**

**The hand could not break anything.** The rounds above record tests 15, 23 and 38 failing
and say each time, rightly, that it was not theirs. It was three faults. A stale
one-argument `mineAt` sat below the real one in the same object literal and THE LATER KEY
WINS, so every test that named a block set the target to a number and the blow was
abandoned before it began — a shadowed probe answers, and its answer is nothing. Then "the
tool is a requirement, not a discount" was applied to every tool at once and the data
closed on itself: flint wants a pick, a pick is made of flint; timber wants an axe, an axe
is made of timber. **In a voyage no tool could ever be come by.** The rule has two tiers
now — the ROCK refuses the bare hand, timber and earth give to it at ×2.5 — and flint asks
for a spade, because it lies in nodules and not in seams. **Test 44** walks the whole
bootstrap from an empty satchel, which is the one thing no test had ever asked: that the
game can be played at all.

**And every rule a voyage FORBIDS had no test whatever** — flight, the year, the hour, the
stores, and the manner itself surviving a reload. One of those locks was open:
`FREEROAM_ONLY` is called "one list, obeyed by the rail, by the keyboard and by the menu",
and the menu did not obey it — the options modal mirrors the rail by CLICKING the button
underneath, and a hidden button fires its onclick like any other, so Options → Time of day
set the hour on a voyage. **Tests 45 and 46** hold all of it, both halves of every rule,
and both were put to a real fault before they were trusted.

## 19. Round 65 — the two water findings, measured on this water at last

§18 left two faults standing in `js/water.js` and said the honest thing about them: they
were measured on the *other* branch's water, so they wanted a measurement here before they
wanted a fix. Taking that measurement turned up something worse than either.

**The instrument** is `tools/waterfront.js`, and it is test 39's own method — the same three
falls by form, the same heads, the same `WATER.step(0.25)` beaten to stillness — asking the
one question test 39 did not: **how wide a front does the fall come down in?** That question
matters because a curtain pours, stays and settles perfectly well, which is all test 39 ever
asked. Before anything was touched, Angel's seven heads came down in **175 columns across a
lip 26 blocks wide**.

**Taking the two faults out narrowed the front to 9 columns and dried the fall** — 82 cells
in the shaft became 7. That exposed a third: `wants` reads falling off the cell above alone,
and water spilling over a brink is a LEVEL, not a source or a fall, so the cell beneath it
was cleared the tick after it formed. **Nothing had been holding a shaft open but the pull**,
refilling mid-air cells out of their neighbours every tick. The rule that mends it is what
holds a cell up rather than what is under it this tick: air, or more falling water.

**And the finding of the round is one nobody had ever asked for.** Standing still, per
hundred ticks, Angel was **laying and drying 12,564 cells with 760 always in the queue**;
Iguazu 4,435 with a queue of 3,869. §16 built the flow its own layer because a settled fall
"lays and takes up eleven thousand blocks every fifty seconds simply to stand still" — and
moved those writes out of the save without ever stopping them. They are stopped now: every
fall reads **queue 0, laid 0, dried 0**. It shows in a test with nothing to do with water —
test 35's herd watch went 68% → 94%.

Test 39 now asks about the front, with a bound taken from the rule (a source reaches seven
blocks, so a head opens seven or eight columns), and both faults were put back in turn to
prove it reports them.

## 20. Round 66 — test 12's baseline, and the three things wrong with it

Test 12 had been red on one box and green on another for two rounds. Re-measuring the
baseline turned up three faults, and **the one everybody was arguing about was not a
regression at all.**

**The plains chunk never got dearer.** Measured at four commits across the whole of the
water work, the raw cost read 2.868, 2.879 and 2.453–2.655 ms — flat, and cheaper at the end
than the beginning. Every part of the "regression" was the divisor.

**The normaliser was one unguarded sample, and it did not track the work.** The chunk cost
is taken as the least of three passes because interference only ever adds time — and that
lesson was never carried across to the number that DIVIDED it. On one box in one afternoon
the loop read 35.9 to 58.1 ms, a spread of 1.62×, and all of it landed in the verdict: the
same chunk was called 2.313 in the morning and 3.038 in the evening with the raw cost lower
the second time. It is the least of five now. And with it steadied, the loop turned out to
run two fifths slower in the box's slow state while the chunk cost did not move at all — a
pure arithmetic loop and a mesher that allocates and fills buffers do not scale together. So
**it no longer divides anything**; it only answers whether this box is slower than the one
that set the baseline, and a red line from a slower box is PENDING and asks for a worktree.

**And the ocean station was not in the ocean.** Its three passes read 2.92 / 2.28 / 1.18 run
after run: the first two were standing on land and being priced as sea, and the least of
three rescued the number, which is why nobody noticed for forty rounds. Stations are checked
against `landNameAt` now — the point and a ring about it — and the plains station is held to
the same standard from the other side.

**The ocean guard had been dead for thirty rounds besides**: the baseline said 2.152 where
the true cost is about 0.7, so an ocean chunk could have got four times dearer in silence.

What is written down now is ocean **0.672**, plain **2.453**, loop **36.0**, and a slack of
**1.60 for ocean and 1.35 for plain** — each from its own measured drift, because a two-thirds
of a millisecond reading and a two-and-a-half millisecond one do not carry the same noise.
Verified three runs green with the box 1.4–1.6× slower than the reference, and put to a real
fault on comparable ground to see it fail.
