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

**7. The material economy.** `world/minerals.js` on the same per-land data pattern as
`world/fauna.js`: gold in Havilah, copper in the Aravah, bitumen at the Dead Sea,
alabaster in Egypt, cedar in Lebanon — distributed by land AND by depth, into the caves
Phase 1 dug. New `blocks/` files for what the works actually need.

**8. Gravity, and finite water.** Sand and gravel fall when unsupported. Water spreads N
blocks and down, and stops. Measured, and then **stopped** — the brief calls fluid
simulation a rabbit hole and it is right.

**9. The named works.** `world/works.js`, one `EARTH.work({…})` apiece, ten to twenty, each
with its verse: the altar of unhewn stone **that refuses hewn stone**, the tent of goat
hair, the ark of gopher wood pitched within and without, the tower of brick and slime, the
tools. Not a tech tree.

**10. The free hand.** The second mode at the menu: unlimited blocks, flight, instant
break. Same world, same save. It is last because it is the mode in which Phase 8's
schematic tool will be used, and it wants everything above it to exist first.

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
