# True measures: Yahrushalayim, the two Houses, and the wonders

Game scale: S = 6.5 units/m. Block B = 6 units = 0.923 m. Cubit: the **royal/long cubit is 0.525 m** (Ritmeyer; "cubits of the old standard", 2 Chr 3:3; Ezekiel's "cubit and a handbreadth", Ezek 40:5). The **common cubit is about 0.445 m**: the Siloam tunnel inscription gives 1,200 cubits, and the tunnel measures 533 m. Figures below use 0.525 m unless marked. Multiply by 0.85 for the common cubit.

## 0. A blocking constraint (read first)

**Decided in Round 137:** the earth is drawn at the same measure as the people (ROADMAP-LIVING-WORLD.md, Phase T), so everything below is built true and in its true place. The options at the end of this section are kept for the record.

`llToWorld` (js/engine.js:1747) lays the map at about **9–11 units per km**. Sets are built at **6,500 units per km**. Measured from the Yahru anchor, in world units:

| Place | Distance from anchor | Same distance in set-metres |
|---|---|---|
| Mediterranean coast (Tel Aviv) | ~554 u | ~85 m |
| Traveller's home | 502 u | ~77 m |
| North tip of the Dead Sea | ~275 u | ~42 m |
| Landmark "The Walls of Yahriḥo" | 231 u | ~35 m |

- Jericho sits at set-metres (+19, −30) from the anchor, which is inside today's walls (hw 46, hd 58). This is probably an overlap already; check it in the game.
- A true Temple Mount (about 300 × 488 m = 1,950 × 3,170 u) is bigger than the whole Coast–Jordan span on this map.
- A true Herodian city (about 1.2 × 1.6 km incl. Gethsemane and Olivet) would be about 8,000 × 10,000 u.

So "true to life" for the whole city cannot fit the map as projected. The owner has to choose:

- **(a) Build everything true and accept the overlap.** This needs these changes:
  - Moriyah `flat:560` and `flank:420` (world/landmarks.js:53) grown to at least 2,000 u for the Mount alone, or about 6,000 u for the city.
  - Suppress or move nearby landmarks such as Jericho.
  - Raise the clearance radii:
    - `ravineKeepOff` yahru 1000 (engine.js:2498)
    - the 900-unit exclusion (engine.js:2665)
    - story/places.js: `yahruPos r:760` (line 83) and the `clear:820` values (lines 30–36)
- **(b) Recommended compromise.** Build the Temple Mount, sanctuary, courts, Antonia and every building at true size. Compress only the distances between quarters and the wall circuit, by a plan factor k ≈ 0.35–0.5.
- **(c) Build the true city as a separate set** away from the map (the story engine already raises sets at anchors).

## 1. Solomon's Temple and palace (1 Kgs 6–7; 2 Chr 3–4)

| Element | Cubits (ref) | Metres @0.525 (@0.445) |
|---|---|---|
| House interior | 60 × 20, h 30 (1 Kgs 6:2) | 31.5 × 10.5 × 15.75 (26.7 × 8.9 × 13.4) |
| Hekal (holy place) | 40 long (6:17) | 21.0 |
| Debir (inner sanctuary), a cube | 20 × 20 × 20 (6:20) | 10.5 cube |
| Porch (ulam) | 20 wide × 10 deep (6:3); 2 Chr 3:4 "120" high, usually emended to 20 or 30 | 10.5 × 5.25, h 10.5–15.75 |
| Side chambers, 3 storeys on N, S, W | inside widths 5 / 6 / 7 (rebated walls), each 5 high (6:6, 10) | 2.6 / 3.15 / 3.7 wide, about 9.5 m total height |
| Walls (not given; Ezekiel 41:5, 9 gives 6 and 5) | 6 inner, about 5 outer | 3.15 / 2.6 |
| **Whole building, outside** | about 92 × 52 | **about 48 × 27 m, about 17 m high**; porch adds about 5 m at the front |
| Cherubim in the debir | 10 high, wings 10 each (6:23–27) | 5.25 high, 10.5 total span |
| Yakin and Boaz | shaft 18 + capital 5 (7:15–16); circumference 12; 2 Chr 3:15 "35" = both shafts | **12.1 m high, about 2.0 m diameter** (hollow, 4 fingers thick: Jer 52:21) |
| Bronze sea | 10 across, 5 high, 30 round, on 12 oxen (7:23–25), at the SE of the house (7:39) | 5.25 dia × 2.6 m, on oxen about 1.5 m |
| 10 lavers / stands | stands 4 × 4 × 3 (7:27), 5 on N, 5 on S (7:39) | 2.1 × 2.1 × 1.6 |
| Bronze altar | 20 × 20 × 10 (2 Chr 4:1) | **10.5 × 10.5 × 5.25** |
| Inner court | walls of 3 courses dressed stone and 1 of cedar (6:36). Size not given; Ezekiel's is 100 × 100 before the house (Ezek 40:47) | about 52.5 sq + the house yard: about 115 × 70 m overall |
| Great / outer court | 7:12; Ezek 42:20 and Middot 2:1 give 500 × 500 | **262.5 m square** (Ritmeyer's pre-Herodian square, Hezekiah-era or earlier) |
| House of the Forest of Lebanon | 100 × 50 × 30; 45 cedar pillars, 15 per row (7:2–3) | **52.5 × 26.25 × 15.75** |
| Hall of Pillars (+ porch) | 50 × 30 (7:6) | 26.25 × 15.75 |
| Hall of the Throne; his house; Pharaoh's daughter's house | sizes not given (7:7–8) | about 26 × 26 each (assumption) |

The palace stood south of the House, on the Ophel, between the Temple and the City of David. It took 13 years to build (7:1). Its foundation stones were 10 and 8 cubits, about 5.25 and 4.2 m (7:10).

**The city of the kings**
- **David/Solomon:** the City of David ridge is about 600 × 120–150 m (4–6 ha). With the Ophel and the Temple area, the whole is about 12–16 ha.
- **Hezekiah (c. 701 BCE):** the western hill was walled in, giving about **60 ha (150 acres)**. The Broad Wall (Neh 3:8) is **7 m thick**, survives along about 65 m, and was perhaps 8 m high.
  - Population: Broshi estimates about 25,000; lower estimates run to about 15,000.
  - The circuit was about 3–3.5 km, and the city's envelope about 1,000 m N–S × 650 m E–W. The circuit and envelope figures are my estimates from the map.

## 2. Herod's Temple Mount and Temple

**The platform (a trapezoid)**
- Sides: W **488 m**, E **470 m**, N **313–315 m**, S **280 m**. Area about 14 ha (Ritmeyer: W 1,590 ft, S 912 ft, E 1,536 ft).
- **Heights:**
  - Western Wall: about 32 m from its footing at the Kotel, 17 courses below today's street.
  - SW corner: about 30 m above the Herodian street.
  - SE corner, "the pinnacle" (Matt 4:5): roughly 40–50 m above the Qidron. This is an estimate.
- The Master Course stone is 13.55 × 3.3 m.
- Robinson's Arch: about 15.2 m span, about 12.8 m wide, carrying a stair to the Royal Stoa.

**Royal Stoa**
- Length: Josephus says 1 stadion (185 m), but it probably ran the **whole south side, about 280 m** (Encyclopaedia Judaica).
- Columns: **162**, in 4 rows of about 40.
- Halls: nave **13.5 m** wide, about 30 m high (60 cubits). Two side aisles **9 m** wide, about 15 m high (20 × 30 cubits). Total about 32 m deep.
- The other porticoes, including Solomon's Portico on the east (Jn 10:23; Acts 3:11), were double colonnades about 15 m deep, with monolith columns of 25 cubits (about 12.5 m).

**Inner enclosure (Mishnah Middot), in metres**

*Middot 2:3 (the outer edge)*
- Soreg: a lattice 10 handbreadths high (about 0.9 m).
- Chel: a terrace 10 cubits (5.25 m) wide, reached by 12 steps of ½ cubit, so **+3.15 m**.

*Women's Court (Middot 2:5)*
- 135 × 135 cubits = **70.9 m square**.
- Four unroofed corner chambers, each 40 × 40 cubits (21 m).
- Treasury chests along it (Mark 12:41).

*Nicanor Gate*
- 15 semicircular steps of ½ cubit, so **+3.9 m**.
- Gates are 20 × 10 cubits (10.5 h × 5.25 w m).

*Azarah (Middot 5:1), 187 E–W × 135 N–S cubits = **98.2 × 70.9 m**. From east to west:*

| Strip | Cubits | Metres |
|---|---|---|
| Court of Israel | 11 | 5.8 |
| Court of Priests (raised 2.5 cubits, +1.3 m; Middot 2:6) | 11 | 5.8 |
| Altar | 32 | 16.8 |
| Altar to porch | 22 | 11.55 |
| Sanctuary | 100 | 52.5 |
| Behind the sanctuary | 11 | 5.8 |

*Altar (Middot 3:1)*
- Base **32 × 32 cubits (16.8 m)**, stepping in to 30, 28 and 26 at the horns. About 10 cubits high (5.25 m).
- Ramp on the south side: 32 × 16 cubits (16.8 × 8.4 m).

*Sanctuary (Middot 4:6–7)*
- **100 × 100 cubits, 100 high = 52.5 m**.
- The porch is **100 cubits wide (52.5 m)**. Its shoulders stand 15 cubits out on each side of a body 70 cubits wide (36.75 m).
- 12 steps (6 cubits = **+3.15 m**) lead up from the Court of Priests.
- Lengthwise, from east to west:

| Part | Cubits | Metres |
|---|---|---|
| Porch wall | 5 | 2.6 |
| Porch | 11 | 5.8 |
| Wall | 6 | 3.15 |
| **Holy Place** (20 wide, 40 high) | 40 | **21** (10.5 wide, 21 high) |
| Amah traksin (the veil space) | 1 | 0.5 |
| **Holy of Holies** (20 wide) | 20 | **10.5** (10.5 wide) |
| Wall | 6 | 3.15 |
| Side chamber (38 cells in 3 storeys) | 6 | 3.15 |
| Outer wall | 5 | 2.6 |

- Porch opening 20 × 40 cubits (10.5 w × 21 h m). Hekhal door 10 × 20 cubits (5.25 × 10.5 m).

**Floor levels above the Court of the Gentiles**

| Level | Height above the Court of the Gentiles |
|---|---|
| Chel and Women's Court | +3.15 |
| Court of Israel | +7.1 |
| Court of Priests | +8.4 |
| Sanctuary floor | +11.6 |
| Sanctuary roof | **about +64 m** |

**Antonia**
- Josephus: walls 40 cubits (about 21 m) on a rock 50 cubits high. Three towers of 50 cubits (about 26 m; 22 m at the common cubit). The **SE tower was 70 cubits** (about 37 / 31 m).
- Footprint: the old Vincent reconstruction (about 150 × 80 m, with a courtyard) is now doubted. A rock-scarp estimate is **about 115 m E–W × 35–42 m N–S**, at the NW corner and north of the platform. Murphy-O'Connor holds it was half the size of Netzer's model.
- Stairs led down to the porticoes (Acts 21:35, 40).

**The city in Herod's day**
- **About 93 ha** (230 acres, Broshi), with about 40,000 people.
- With Agrippa's Third Wall (41–44 CE): about 180 ha and about 80,000 people.
- Josephus gives the circuit at 70 CE as **33 stadia (about 6 km)**.
- The First Wall ran from the Hippicus tower (Herod's palace, at the Jaffa Gate) east to the Mount. The Second Wall started at the Gennath gate and ran north and then east to the Antonia. Golgotha lay outside it.

**Buildable layout, frame T** (metres; origin at the Mount's SW corner on the esplanade; x is east of the west wall, n is north of the south wall). Positions were taken from the Dome of the Rock and Middot. Expect about ±15 m.

*The Mount and its edges*
- Walls: SW (0,0); SE (280,0); NE (315,469); NW (0,488). The north wall slopes.
- Royal Stoa: x 0–280, n 0–32. Column rows at n ≈ 1.5, 10.5, 24, 32.
- West and east porticoes run 15 m inward from their walls. The north portico is n ≈ 455–470.
- Huldah gates: Double Gate at x ≈ 85–98, Triple Gate at x ≈ 190–205. Their tunnels reach the esplanade at about n 60–70.
- Southern stairway: about 64 m wide, in front of the Double Gate.
- Robinson's Arch: just west of the SW corner, landing on the Stoa.

*The inner courts (axis along n = 235; the sanctuary faces east)*
- Holy of Holies centre: (80, 235).
- Sanctuary body: x 66–118.5. Porch: x 110–118.5, n 209–261.
- Holy Place: x 86–107. HoH: x 75–85.5.
- Azarah: x 60–158.4, n 199.5–270.5.
- Altar: x 130–147, n 226.6–243.4. Ramp south to n 210.
- Nicanor Gate: x 158–161.
- Women's Court: x 161.4–232.3.
- East gate: about x 233–236.
- Chel and soreg: about 6 m out from the walls all round.

*Outside the Mount*
- Antonia: x −5–110, n 482–525. Towers at the corners; the SE tower is the tallest.
- Lower city / Tyropoeon street: along the west wall, about 20 m below the esplanade.

Positions of other places in frame T, taken from the modern map (about ±30 m):

| Place | Position (x, n) |
|---|---|
| Golgotha / Holy Sepulchre | about (−460, 290) |
| Herod's palace and towers (Jaffa Gate) | x −650 to −520, n −240 to 90 |
| Upper-City mansions (600 m² Palatial Mansion) | about x −250 to −100, n −50 to 100 |
| Mount Zion / Cenacle | about (−480, −330) |
| Siloam pool | about (160, −600) |
| Gethsemane | about (500, 390) |
| Olivet summit (about 80 m higher) | about (900, 290) |

## 3. Houses

- **Four-room house (Iron Age):** footprint **10–12 × 8–10 m**, usually 50–110 m².
  - Two storeys. Animals and stores are below; people live upstairs, with the middle space often open.
  - Roof: flat, of beams, brush and rolled clay, used for living. A parapet was required (Deut 22:8; Josh 2:6; 1 Sam 9:25).
  - Total height about 5–6 m. Houses in crowded Jerusalem ran about 50–80 m².
- **Herodian Jerusalem:**
  - Upper-City mansions run **200–600 m²** a floor on 2 storeys. The Palatial Mansion is 600 m²; the Herodian Quarter has 6–7 houses on 2,700 m².
  - Lower-city houses run about 50–150 m², with courtyards and upper rooms.
- The game's `api.house` sizes, 6–8 m, are right for plain houses. The step up would be 8–12 m lots, with a few 15–25 m mansions in the upper city.

## 4. The wonders: coded size vs true

All the wonders are built in js/engine.js:

| Function | Line |
|---|---|
| `lmPyramid` | 16549 |
| `lmZiggurat` | 16553 |
| `lmTemple` | 16560 (the fallback for every `kind:'temple'`) |
| `lmStoneCircle` | 16572 |
| `lmWall` | 16577 |
| `lmLighthouse` | 16584 |
| `lmGate` | 16589 |
| `lmCity` | 16594 |
| `lmStatue` | 16602 |

- They are registered in `LM_BUILDERS` (16606), called in `spawnLandmark` (about 17005), and listed again in `stampDiff` runners (about 21341).
- The `s` size factor comes from world/landmarks.js:19–41.
- Sizes are multiples of B: the pyramid's half-base is `B*7.5*s`, and the temple's `wx=B*6.5*s`, `colH=B*3.6*s`.

| Landmark (landmarks.js line, builder) | Coded now | True | ×linear |
|---|---|---|---|
| Giza (19, pyramid s1.3) | base 18.7 m, h 13.1 m | base 230.3 m, h 146.6 m | ×12 |
| Caral (40, pyramid s0.8) | 11.8 m, h 8.3 m | Pirámide Mayor about 154 × 138 m (some give 160 × 150), about 28–30 m | ×13 / ×3.5 |
| Ur (20, ziggurat) | 13.8 m sq, h 7.8 m | 64 × 45 m, about 30 m (est.; 3 stages) | ×4.6 / ×3.8 |
| Etemenanki (21, ziggurat) | same 13.8 m / 7.8 m | 91 × 91 m, 91 m by the Esagila tablet, 7 stages (height possibly overstated) | ×6.6 / ×11.7 |
| Parthenon (24, temple s1) | stylobate 13.8 × 9.6 m, columns 3.3 m, total 5.4 m | 69.5 × 30.9 m, columns 10.4 m, about 13.7 m | ×5 / ×2.5 |
| Artemis (23, temple s1.2) | 16.2 × 11.2 m, columns 4.0 m | about 115–137 × 55–69 m; 127 columns of about 18 m | ×8 / ×4.5 |
| Petra (30, temple s1) | generic 13.8 m temple | Khazneh: rock-cut facade about 25 m wide × 40 m high (needs its own builder) | n/a |
| Persepolis (31, temple s1.3) | 17.4 × 11.9 m, columns 4.3 m | terrace about 455 × 300 m; Apadana hall 60 m square, about 110 m with porticoes; 72 columns of about 19–20 m | ×6 / ×4.6 |
| Karnak (32, temple s1.4) | 18.6 × 12.7 m, columns 4.65 m | Great Hypostyle 102 × 53 m; 134 columns, the central 12 about 21 m, the rest about 10–15 m | ×5.5 / ×4.5 |
| Baalbek (33, temple s1) | 13.8 × 9.6 m | Temple of Jupiter about 88 × 48 m, 54–58 columns of about 20 m, on a podium of 800-t trilithon blocks | ×6 |
| Stonehenge, Göbekli (25–26, stonecircle) | dia 9.6 m, uprights 2.4 m | Stonehenge sarsen ring about 30–33 m, uprights about 4.1 m, trilithons to 7.3 m. Göbekli enclosures 10–30 m, pillars to 5.5 m | ×3.3 / ×1.7–2 |
| Great Wall (27, wall s3) | 61 m long, 2.2 m high | Ming wall 7–8 m high, 4–5 m wide on top, towers about 12 m | height ×3.5 |
| Pharos (29, lighthouse) | base 5.5 m, h 13.4 m | about 100–118 m (est.), base about 30 m square, 3 tiers (square, octagon, round) | ×8 |
| Nineveh, Mycenae, Hattusa (22, 36, 37, gate) | 8.1 m wide, 5.3 m high, passage 3.0 × 3.1 m | Mycenae Lion Gate: opening about 3 × 3 m, lintel about 4.5 m. **Already about true.** Nineveh: 12 km wall circuit, 15 gates, wall about 15–25 m high. Ishtar Gate (Babylon), smaller front gate only: 14.7 m high × 26.4 m wide | Nineveh ×3–5 |
| Jericho, Mohenjo-daro, Knossos, Megiddo, Carthage (28, 34, 35, 38, 39, city) | ring 18.5 m across, 1.7 m wall | Jericho tell about 2.5–4 ha; Megiddo about 5–6 ha; Knossos palace about 150 m across; Mohenjo-daro about 250 ha | ×10–100 |
| Olmec heads (41, statue) | 3.1 m high | 1.5–3.4 m. **Already about true.** | 1 |

If the wonders are scaled up, these other numbers must grow too:
- `landmarkSolidAt` and `landmarkTopAt` only check within 420 u (about 65 m) (engine.js:17077, 17090).
- The spawn trigger is 1600 u, plus 500 before the landmark is dropped (about 17121).
- The label sits at `B*16+24` (about 18.5 m) (about 17059).
- Scroll and story keep-out radii are 170/220/340 (engine.js:10628, 10696) and `r:300` (story/places.js:76).
- A solid true Great Pyramid would be about 3.3 M blocks, so build shells or step courses.
- At map scale, a true Giza (1,500 u a side) would also cover about 150 "map-km".

## 5. Recommendation for world/yahrushalayim.js

**Marks the plan emits now, and where each should go** (frame T, then mapped through the chosen game offset; suggested: game x = x_T − 60, game z = −n_T − 20, which keeps the anchor in the lower city SW of the Mount):

| Mark | Where it should go |
|---|---|
| `hekal` | the porch front: kings (116, 235); herodes (120, 235) |
| `hekalView` | the esplanade before the courts, about (250, 235) |
| `pinnacle` + `pinnacleY` | herodes: the SE corner (280, 0) at about +40 m (the true "pinnacle"), or the porch roof at +64. kings: the porch top, +17 |
| `holyPlace` | the centre of the hekal |
| `incenseAltar` / `incense` | 2 m west of the veil line |
| `lampstand` | the south side of the hekal (Ex 26:35) |
| `porchFront` | the porch front |
| `altarFront` | the altar's east face (x about 148 or 135) |
| `foundation` (return) | the house footprint, built at the same place (Ezra 3) |
| `gateIn`, `gateOut` | a city gate. Kings: the Valley gate, SW. Herodes: the Gennath / Jaffa gate |
| `pool`, `poolEnd`, `ahaz`, `field` | the upper pool, about 150–250 m outside the gate |
| `studyDesk`, `studyDoor`, `studyIn`, `studyShelf` | the lower city |
| `street` | a street in the lower city |
| `square` | the lower-city square, near the anchor |
| `westQuarter` | the western hill (x −500 to −50) |

`hekal`, `hekalView`, `street` and `square` are written as literals (yahrushalayim.js:194–195). They should come from the layout variables.

**Story literals that must move with the city.** These are in story/settings.js and are positioned relative to the anchor:
- **yahrushalayim (kings):** the palace and Aḥaz's stair (lines 30–39) move to the Ophel palace, at about x 150–260, n −60 to 55.
- **olivet:** the mound at (158, −42), and Gethsemane at 62–80 (lines 722–745), move to about (500, 390) and (900, 290).
- **courts:** the tables, doves and treasury, plus 10 marks (lines 773–789), move to the Court of the Gentiles south-west of the inner courts. The treasury goes in the Women's Court.
- **praetorium / prison:** the Antonia hall and Pavement at x −40 to −22, z −73 to −52 (lines 836–866) move to the new Antonia.
- **golgotha:** about (−66, −34) (lines 880–917) moves to about (−460, 290).
- **upperroom** (12–22, 26–34) and **highpriest** (4–22, 24–36) move to the upper city / Mount Zion.

Many scene actors also use literal `at:[x,z]`. For example, 07-passion has 53 and 03-coming has 70. Converting them to mark-relative form (`at:['mark',dx,dz]`, which is already supported) would make any later rescale safe.

**Concrete numbers** (true; with option (b), apply k only to the spacing between quarters):
- **Kings (Solomon / Hezekiah)**
  - Outer court: the 262.5 m square at x 35–297.5, n 60–322.5.
  - Inner court: x 60–175, n 200–270. Walls about 3 m (3 courses + cedar).
  - House: x 66.3–115.5, n 221.4–248.6, floor +3 m, roof +20 m. Side chambers about 9.5 m. Porch about 10.5–16 m.
  - Pillars: Ø 2.0 × 12.1 m at (116.5, 231) and (116.5, 239).
  - Altar: 10.5 × 10.5 × 5.25 m at x 124–134.5.
  - Sea: at (118, 214).
  - Palace complex on the Ophel: Forest House 52.5 × 26 × 16 m.
  - City walls: 60 ha. Walls 7 m thick and 8–10 m high, with towers to about 12 m. The City of David spur runs n 0 to −600 at x 190–330. The western hill runs x −600 to 0, n −450 to 150.
- **Herodes:** the platform in §2 (280/315 × 470/488 m).
  - Esplanade +20 m above the west street. Walls run 30 m (SW) to about 45 m (SE) above the outer ground.
  - The courts, sanctuary (52.5 m cube, roof +64 m), altar and Antonia as listed above.
  - City walls: First / Second Wall, about 93 ha; circuit about 4.5–6 km. Herod's palace has three towers (Phasael 90 cubits, about 45 m by Josephus).

## Sources

- BAS: [Temple Mount in the Herodian period](https://www.biblicalarchaeology.org/daily/biblical-sites-places/temple-at-jerusalem/the-temple-mount-in-the-herodian-period/), [Where's the square](https://library.biblicalarchaeology.org/sidebar/wheres-the-square), [The Antonia's better halved](https://library.biblicalarchaeology.org/sidebar/the-antonias-better-halved/), [Jerusalem's population](https://old.biblicalarchaeology.org/node/120050)
- [Encyclopedia.com, Temple Mount](https://www.encyclopedia.com/religion/encyclopedias-almanacs-transcripts-and-maps/temple-mount)
- [Ritmeyer, BAR 15:6 (1989)](https://cojs.org/kathleen-ritmeyer-and-leen-ritmeyer-reconstructing-herods-temple-mount-in-jerusalem-biblical-archaeology-review-15-6-1989/)
- [Encyclopaedia Judaica: Temple / Royal Stoa (JVL)](https://jewishvirtuallibrary.org/jsource/judaica/ejud_0002_0003_0_02141.html)
- [Jewish Encyclopedia, Temple of Herod](https://www.jewishencyclopedia.com/articles/14304-temple-of-herod)
- Mishnah Middot: [Loyola sources](https://avande1.sites.luc.edu/jerusalem/sources/middot.htm), [sacred-texts plan](https://sacred-texts.com/book/the-talmud/shell/plan-of-the-temple-complex), [mishnah.org](https://www.mishnah.org/?p=2680)
- [Madain: Antonia according to Josephus](https://madainproject.com/antonia_fortress_according_to_josephus)
- [T. Sagiv](https://www.ldolphin.org/templemount.org%20files/tempmt.html)
- [The Kotel facts](https://thekotel.org/en/facts-and-figures/)
- [IAA, Jerusalem walls, Herodian period](https://www.antiquities.org.il/jerusalemwalls/hstry_05_eng.asp)
- Broad Wall: [JVL](https://www.jewishvirtuallibrary.org/the-broad-wall), [City of David timeline](https://timeline.cityofdavid.org.il/event/the-broad-wall-an-archaeological-revolution)
- [Encyclopedia of the Bible, Weights and Measures](https://www.biblegateway.com/resources/encyclopedia-of-the-bible/Weights-Measures)
- [Bible Odyssey, Siloam](https://www.bibleodyssey.org/articles/the-siloam-inscription-and-hezekiahs-tunnel/)
- [1 Kings 7 (WEB)](https://ebible.org/web/1KI07.htm)
- Four-room house: [Armstrong Institute](https://armstronginstitute.org/1072), [Posen Library](https://posenlibrary.com/node/9449)
- Herodian Quarter: [Israel MFA](https://embassies.gov.il/MFA/IsraelExperience/history/Pages/Jerusalem%20-%20The%20Upper%20City%20during%20the%20Second%20Templ.aspx), [Ritmeyer interview](https://www.thegospelcoalition.org/blogs/justin-taylor/is-this-the-high-priestly-palace-where-jesus-stood-trial/)
- [Etemenanki, French Ministry of Culture](https://archeologie.culture.gouv.fr/orient-cuneiforme/en/architecture-ziggurat)
- Ur: [Structurae](https://structurae.net/en/structures/ziggurat-of-ur)
- Karnak: [Guinness](https://www.guinnessworldrecords.com/world-records/largest-hypostyle-(pillared)-hall), [Madain](https://madainproject.com/great_hypostyle_hall)
- Apadana: [Livius](https://livius.org/articles/place/persepolis/persepolis-photos/persepolis-apadana)
- Ishtar Gate: [World History](https://worldhistory.org/Ishtar_Gate), [Google Arts record](https://artsandculture.google.com/asset/ishtar-gate-reconstruction-of-the-outer-gate-unknown/DwG4vt3_ylapbQ)
- Nineveh: [Livius](https://livius.org/articles/place/nineveh-mosul), [ORACC RINAP](https://oracc.museum.upenn.edu/rinap/rinap3/rinap31introduction/buildingactivitiesatnineveh/index.html)
- Pharos: [World History](https://www.worldhistory.org/Lighthouse_of_Alexandria/)
- Artemis: [WorldAtlas](https://www.worldatlas.com/places/the-seven-wonders-of-the-ancient-world.html)
- Caral: [Rough Guides](https://www.roughguides.com/peru/lima-and-around/caral/), [History.com](https://history.com/articles/caral-peru-norte-chico-oldest-civilization-western-hemisphere)
- Stonehenge: [Smarthistory](https://smarthistory.org/?p=4329)
- Baalbek: [World History](https://www.worldhistory.org/Baalbek/)

**Not re-verified this session.** Wikipedia and several other sites were blocked for page fetch, so I worked from search summaries. These values are standard reference figures I did not check again:
- Great Pyramid; Parthenon; Petra's Khazneh
- Baalbek's footprint; Lion Gate details; Göbekli Tepe; the Olmec heads; the Great Wall
- The SE-corner height; the frame-T positions of the Rock and the city places
