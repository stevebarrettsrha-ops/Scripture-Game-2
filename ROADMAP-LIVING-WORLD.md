# The living world — findings and plan (Round 137)

The traveller asked for the voyage to feel like "the world went on without me". In practice that means:

- every soul works by day and goes home at evening, on foot or riding a donkey or horse;
- beasts go home to their own places, and fish to their shelter when the night hunters come out;
- people in towns and villages give the player jobs;
- there are three kinds of settlement: a dense walled city, a growing trade town, and the rural countryside;
- the land is visibly changed by people: levelled squares, cleared ground, stumps, and a sharp edge between wild forest and settled land;
- every land of the Bible days feels different through its own trades.

Then, once that is done:

- Every scroll, from Berĕshith to Ḥazon, plays as a cutscene made in the style of **Scripture-Game** (stevebarrettsrha-ops/Scripture-Game). Nothing from this game's story mode is used in the voyage.
- Some scrolls are found where their events happened. Others are given only by townsfolk around the world, for work done for them.
- The gathered scrolls can be put together and played as one film of the whole Bible.

Everything below was checked: four read-throughs of the code, plus a day kept in Yasharal's town in the running game.

## What is there today

### People

| Asked for | Today |
|---|---|
| A work for every soul in the day | **Yes**, within a village. 11 trades: teacher, children, herder, hunter, farmer, water-bearer, feeder, vendor, fisher, shopper, folk. Each has its own hours (js/behavior.js `FOLK`) and its own day of tasks (`nextTask`). |
| Home in the evening | **Partly.** Everyone goes to bed on time: in the measured day all 33 of Yasharal's people were up at 18:00, 23 at 20:00 and none at 21:30. But only 18 of 33 had reached their own door by 02:00. The rest lay where they stopped, stuck on stepped ground or doorsteps (AUDIT notes the same for test 63). |
| Ride a donkey or horse home | **No.** No villager rides. Village donkeys and camels are only penned or wander. There are no caravans on land; the merchant ships are the only travellers. |
| The world goes on without me | **No.** A village exists only within about 1,600 units of the traveller. It is rebuilt fresh on every visit, with everyone standing at their work whatever the hour. Nothing about the people is kept. On the "live" clock the calendar day never turns. |
| Jobs from people | **No.** Talking gives a trade line, then a rumour of the nearest unvisited land, then "Go in peace". There are no quests, errands, deliveries or rewards. |

### Animals and fish

| Asked for | Today |
|---|---|
| Wild beasts go home | **Partly.** 60 kinds have a home in the behaviour data: den, burrow, tree, rock, water or ice. They do walk to bed at their hour. But the "home" is usually a spot hashed near where the beast was spawned, not a place it keeps. Only 10 built dens exist at a time, near the player. A hippo's "water" bed is a dry spot. |
| Village livestock home at night | **No.** Village beasts follow no hours. The flock is never driven into the pen at dusk. |
| Fish to shelter at night | **Barely.** Some shoals and lanternfish rise at night, reef fish swim slower, and coral glows. No fish has a home. None hides in coral or kelp. Sharks, though marked nocturnal, behave the same day and night. |

### Settlements and the land

| Asked for | Today |
|---|---|
| City, trade town, countryside | **One settlement per land**: a village of 8–11 houses, or one of 18 "cities" (at most 36 lots on a grid). There are no hamlets, farmsteads, field systems or roads between towns. Only Yahrushalayim has walls. |
| Ground flattened and levelled | **Only near the centre.** The ground is level within about 8 blocks of the centre and eased beyond. Squares and paths only change the top block and follow the bumps. |
| Cleared of vegetation | **Only on house lots.** Trees grow in squares, fields and pens. Within 380 units the undergrowth is thinned. |
| Stumps, felled forest, a sharp edge | **None.** There are no stumps anywhere, and the forest runs straight into town. |

### Lands that differ

| Asked for | Today |
|---|---|
| Trades by land | **The same everywhere.** The roles, tools, speech, stall goods and name pool are identical worldwide (there is a "Yoram" in Japan). |
| Prices | **Random by land.** Purple dye is dearer in Tsor (Lebanon) than in Norway, and cedar is cheaper in Iraq than in Lebanon. |
| Biblical names and ancient cities | **Mostly missing.** Only "Yasharal" and "Yahudah" use their names. Babel, Ur, Nineweh, Karnak, Petra and Persepolis share 4 generic templates. Tsor's harbour, Tsidon, Dammeseq, Noph and Rome are missing. Only Yahrushalayim is built as itself. |
| What already differs | Plants and crops, wild beasts, ores, skin and hair, the house style (5 styles by region), and the ground haze. |

### Scrolls and cutscenes

- **The scrolls:** there are 24, all Old Testament or other early writings, and none from the New Testament. All 24 lie on the ground to be found. None is given by anyone.
- **What a scroll scene shows today:** taking one plays a 19-second scene. The camera circles the traveller as he lifts it, and one verse is shown. There are no other figures and no voice.
- **Scripture-Game, the model to follow.** Its cutscenes are a painted 2D stage drawn on a canvas (`cinema.js`), with no 3D engine. Each verse is one slide:
  - One continuous take per verse, with one gentle camera move, almost always a slow push in.
  - The verse is split into parts at its pauses. Each part is held while its voice speaks, then the slide cross-dissolves into the next. There are no hard cuts.
  - The caption is at the bottom, in gold-referenced italic over a dark band. A title card opens each telling.
  - The narrator reads, each speaker has his own voice, and YAHUAH's voice is the deepest and is given to no one else. Soft piano plays underneath.
  - YAHUAH is shown only as light, cloud and fire. Mal'akim are brown men without wings. Everyone is brown-skinned. Violence is never drawn: Golyath simply falls.
  - Each slide is written as data: the place, the hour, the weather, the camera, the cast with their poses, crowds, props and effects.
- **What Scripture-Game covers:**
  - All 39 books of the Tanakh have a page, and every story and prophetic book has staged slides (2,111 slides, about 9 hours voiced). There are 38,549 recorded voice clips.
  - There is nothing from Mattithyahu to Ḥazon: no page, no slide and no voice.
  - Most climaxes are voiced but not staged: a chapter's stage holds its opening and closing verses, and the climax is told in the playable scene.
  - For this game's 24 scrolls, 9 have their own verse staged in Scripture-Game, 13 have the chapter staged around them, and 2 (Yashar 1:2 and Yoḇelim 1:1) have only nearby material.
- **One rule Scripture-Game does not keep:** it draws the Servant and the Son of Enosh with faces. In this game Yahusha's face is never shown, so the new player must guard it on every frame.

## Can it be done?

Yes, all of it. The engine already has the parts to build on: hours per trade, doors and homes, beds for beasts, a scene player with shots, captions and title cards, and Scripture-Game's slides and recorded voices to follow.

There are two real limits:

1. **The frame rate.** Denser cities and more people cost blocks to stamp and figures to draw. The answer is the budgets the engine already uses: build in slices, simplify far figures, and build only what is near.
2. **Time.** This is several rounds of work. Each is shipped on its own and measured like the last ones.

"The world went on without me" does not need the whole earth simulated while the traveller is away. It needs every place to be *where its clock says*: arrive at midnight and the town is asleep in its beds; arrive at noon and the fields are worked. The day counter moves the slow things on: the trade town grows, and crops ripen. That is cheap and it is honest.

## The plan, in order

### Phase A — the day goes on (people) · DONE in Round 137

- **A1. Wake where the clock says.** When a village is raised, each soul is set down where its schedule puts it at that hour: abed at night, at work by day, on the road at dawn and dusk. The same date always gives the same village.
- **A2. Everyone reaches home.** Find and fix where the 15 of 33 stall on the way home (stepped ground and doorsteps). Target: all asleep indoors by midnight.
- **A3. Work outside the walls.** Farmers go to the fields, herders to pasture, fishers to the pier and boat, and hunters out at dawn. All come back at dusk.
- **A4. Riders.** Households in fitting lands keep a donkey, mule, horse or camel, tethered at the door at night. The rider mounts there and rides out to the fields or market, and back.
- **A5. The flock keeps hours.** The herder drives the sheep and goats out to graze at dawn and into the fold at dusk. Hens go to the coop. Draught beasts are tethered at home.
- **A6. Small truths:**
  - Sleepers do not answer when spoken to.
  - Stalls close at night as the vendor packs up.
  - The children's lesson hours come from the table.
  - A soul with no house beds down by the well.
- **A7. Travellers on the road.** Caravans of donkeys and camels, riders and walkers, travel between settlements (needs C3's roads).

### Phase B — work from the people

- **B1. Jobs by trade.** Each trade offers jobs that fit it:
  - Farmer: "bring 10 grain from the threshing floor"
  - Vendor: "carry this cloth to the market of …"
  - Herder: "find my strayed sheep"
  - Hunter: "the wolf at the fold"
  - Water-bearer: "fill the jars"
  - Builder: "cut 20 cedar", or "repair the wall"
- **B2. Talking.** The player can **speak, ask for work, or trade**. Jobs are tracked in THE LOG and kept in the save. The reward is shekels and the village's goodwill.
- **B3. Scrolls as rewards.** Some scrolls of Phase F are never found lying anywhere. Townsfolk give them, after a job or a chain of jobs, in a land that fits the book: a scribe in Yahudah, an elder in Babel, a merchant in Tsor.

### Phase C — settlements and the land they change · C1, C2 and C4 done in Round 137; C3 (more places per land, roads) to come

- **C1. Three kinds of place:**
  - **Rural countryside:** farmsteads, field strips, orchards and vineyards, threshing floors, stone field walls, shepherds' folds, terraces.
  - **Growing trade town:** a market square, caravanserai, storehouses, workshops, docks, and building sites that progress day by day.
  - **Dense walled city:** walls, gates and towers, close streets, quarters by trade, temple or palace, several squares.
- **C2. The ground shows the hand of man:**
  - Squares, markets and streets are truly levelled by cut and fill, with retaining walls on terraces.
  - The settled ground is cleared of trees and scrub.
  - A ring of stumps and bare patches marks where the forest was felled.
  - Fields and pasture lie beyond it, and the wild forest begins at a sharp, visible line.
- **C3. More than one place per land.** A capital, towns and hamlets, joined by roads, within the building budgets.
- **C4. Growth.** The trade town gains houses and stalls as the days pass.

### Phase D — every land its own

- **D1. Each land's own data:**
  - the ancient name (Mitsrayim, Ashshur, Babel, Tsor, Tsidon, Kittim, Yawan, Tarshish, Sheba, Kush, Paras …);
  - its trades, and what it makes and wants;
  - its workshops, stall goods, speech, names, dress colours and livestock.
- **D2. Workshops you can see:**
  - dye vats and shell middens at Tsor;
  - glass furnaces at Tsidon;
  - flax, linen looms and papyrus in Mitsrayim;
  - olive and wine presses in Yasharal;
  - cedar camps in Lebanon;
  - copper smelting in Edom and Kittim;
  - incense caravans from Sheba;
  - bitumen pits and brick kilns in Babel.
- **D3. Prices that follow the trade.** A good is cheap where it is made and dear where it is wanted, so real trade routes pay.
- **D4. The ancient cities built as themselves**, authored like `world/yahrushalayim.js`: Babel, Nineweh, Ur, Noph and No-Amon, Tsor, Tsidon, Dammeseq, Rome.

### Phase E — animals and fish keep house

- **E1. Real homes for wild beasts.** Each one's home is fixed in its own territory and kept, not hashed near where it was spawned. Water beasts bed in water, rock beasts on rock, burrowers underground.
- **E2. Livestock** (the same work as A5).
- **E3. The sea by night.** Reef fish shelter in coral, rock and kelp. The night hunters roam: reef and tiger sharks, morays, octopus. Shoals tighten, and the day fish come out again at dawn.

### Phase F — the scrolls as films, Berĕshith to Ḥazon, and the whole Bible as one film (after A–E)

**Nothing from this game's story mode ("The Fullness of Time") is used in the voyage.** The films are built new, in Scripture-Game's style, inside the voyage's own 3D world.

- **F1. A film player in Scripture-Game's style.**
  - It is built inside the voyage's existing scene machine (shots, captions, title cards, fades, skip).
  - It keeps Scripture-Game's slide format as the way films are written: place, hour, weather, camera, cast, poses, crowds, props and effects per verse.
  - The 2D stage is laid onto the real land at the scroll's place: across the screen becomes across the camera's view, and depth becomes distance.
  - It keeps Scripture-Game's pacing: one take per verse, a slow push in, parts held while each voice speaks, cross-dissolves, the caption panel and title cards in its look, and its piano music (`music.js`, brought over almost as it is).
  - It adds the rules this game keeps: Yahusha's face blank and guarded from the camera on every frame, YAHUAH shown only as light, cloud and fire, mal'akim as brown men lit from within, the people brown, and violence read in the caption, never drawn.
  - New pieces in the voyage engine: about 40 props (altar, ark, tent, lampstand, throne, well, gate, ship, furnace, den, ladder, ziggurat and more), about 25 effects (glory, rays, pillar of fire, cloud, rain, locusts), and the interiors (palace, temple, tent, prison, cave, lions' den, furnace, tomb, vision).
- **F2. The voices.**
  - A tool imports Scripture-Game's recorded voice clips for each verse used, keeping only those clips (about 5–10 MB for the first 24 scrolls).
  - The words shown are always the Besorah's own, checked by `tools/extract-besorah.js --check`. Scripture-Game shows the Name in a shortened form that the check rejects, so its text is used only to find the right clip.
  - The New Testament has no recordings in Scripture-Game. Its voices must be made with Scripture-Game's own voice pipeline, which needs its voice model to hand.
- **F3. One scroll per event, Berĕshith to Ḥazon.** About 60–90 events in the Besorah's order: about 45 from the Tanakh and 25–30 from the New Testament, with an optional bridge from the Maqqabim between the Testaments.
  - The 24 scrolls there now come first. For 9 of them, Scripture-Game's own slides are adapted. For 13, the climax verse is staged new around Scripture-Game's chapter. For Yashar and Yoḇelim, new stages are made beside the nearby material.
  - Then new scrolls for the rest of the Tanakh, and the whole New Testament, all staged new in the same style.
  - Each film is set at its true place in the voyage world, dressed for its period, and can be skipped and replayed.
- **F4. Found, or earned from the people.**
  - Some scrolls lie where their events happened and are found.
  - Others cannot be found lying anywhere. They are given by townsfolk around the world as the reward for work done for them (Phase B's jobs): a scribe, an elder, a priest, a merchant or a widow, in a land that fits the book.
  - The split is chosen per scroll and kept in the scroll list. The Scroll Library tells the player which kind each missing scroll is, and where to look or whom to help.
- **F5. The Scroll Library and "Play the whole Bible".**
  - THE LOG lists every scroll in the Besorah's order, from Berĕshith to Ḥazon. Each gathered one can be played.
  - **Play the whole Bible** plays every gathered scroll's film back to back, in order.
  - Each verse moves on by itself when its voice ends. A title card marks each age.
  - Scrolls not yet gathered appear as gap cards that say where the scroll lies, or who in which land will give it.
  - With 60–90 events at 1.5–3 minutes each, the whole film runs about 2.5–4 hours.
- **F6. Checked words.** Every caption is checked against the Besorah by `tools/extract-besorah.js --check`.

## How each phase is proven

Each phase ships with a probe that runs in the actual game, as the rounds before did:

- **Phase A:** the town is kept through a whole day and counted at each hour: who is at work, on the road, riding, or abed indoors.
- **Phase B:** a job is taken, done and paid.
- **Phase C:** the flatness of squares, the share of cleared ground, and the stumps are measured.
- **Phase D:** prices are compared by land.
- **Phase E:** beasts and fish are counted at their homes or shelters by night.
- **Phase F:** every scroll's film plays end to end, with the face rule kept on every frame and every caption passing the Besorah check.

Before and after screenshots come with each round.
