/* ================= EVERY LAND ITS OWN (Phase D) =================
   "Tarshish was your merchant because of your great wealth. They gave you
    silver, iron, tin and lead for your merchandise."       YEḤEZQĔL 27:12

   THE FAULT THIS FILE MENDS. Every land on the earth was the same land with a
   different coast: the same eleven callings in every town, the same seven
   robes, the same greeting, the same three goods on every stall, the same
   sheep and pigs in every pen, and the same fourteen names — so that the
   traveller came ashore in Japan and was greeted by Yoram. And the markets
   were priced by a throw of the dice: the purple of Tsor dearer in Tsor than
   in Norway, the cedar of Leḇanon cheaper on the rivers of Baḇal than under
   the trees it was cut from.

   Each land now says, in its own entry:
     n      the land as its file in countries/ names it (the key; never shown
            in place of the land's own name, only beside it)
     old    what the account calls it — Mitsrayim, Baḇal, Tsor and Tsiḏon,
            Kittim, Yawan, Tarshish, Sheḇa, Kush, Paras, Aram, Eḏom and Mo’aḇ.
            A land the Scriptures never name keeps its own name, and has none.
     makes  the goods of world/goods.js that are its own: cheap at its markets
     wants  the goods it has not and must buy: dear at its markets
     men, women   the trades of its households (of the eight the yards have
            tools for: potter, carpenter, woodcutter, mason; weaver, baker,
            spinner, gleaner) — the gleaner is a custom of Yasharal's fields
     works  the WORKSHOPS its towns raise at their edge, by the names in
            world/workshops.js; `{k, town}` raises one only in the town named,
            or in the land's chief town where that one is not standing
     greet  what its people call out to a passing stranger
     cry    what its market-folk cry from the stall
     talk   what its people say when spoken to
     dress  the colours its people wear (each a robe)
     flock  the beasts of its pens and pastures
     ride   the beast a household keeps for the road (null: none is ridden)

   A land with no entry keeps the old ways of the world, and its prices are
   reckoned by how far it lies from the lands that make each thing (js/lands.js).
   The NAMES of every people, and the land each is spoken in, are at the foot.
   ================================================================= */

/* ---------------- YASHARAL, AND YAHUḎAH ---------------- */
EARTH.land({
  n:'Yasharal',
  makes:['oil','wine','grain'], wants:['cedar','dye','glass'],
  men:['potter','carpenter','woodcutter','mason'], women:['weaver','baker','spinner','gleaner'],
  works:['olive-press','wine-press'],
  greet:['Shalom, traveller.','Peace to you and to your house.','Shalom — the olives are heavy this year.'],
  cry:['Oil of the first pressing!','Wine of the hills, and bread of the valley!'],
  talk:['“Shalom, traveller from the sea — peace to you and to your house.”',
        '“The olives hang heavy this year; the presses will run from the feast of booths until the rains.”',
        '“The cedar for the roof-beams comes down from Tsor, and we send them oil and wheat for it — so it was in the days of Shelomoh.”'],
  dress:[0x8a6a4a,0xc8b490,0x6a5a40,0x9a8a6a,0x3a4a7a,0xa89878],
  flock:['sheep','sheep','goat','goat','chicken','chicken','donkey'], ride:'donkey'
});
EARTH.land({
  n:'Yahudah',
  makes:['oil','wine','salt'], wants:['cedar','cloth','dye'],
  men:['potter','carpenter','woodcutter','mason'], women:['weaver','baker','spinner','gleaner'],
  works:['olive-press','wine-press'],
  greet:['Shalom, traveller.','Peace be upon you.','Shalom — have you come up for the feast?'],
  cry:['Salt of the Salt Sea, and oil of the hill country!','Wine from the presses of Ḥeḇron!'],
  talk:['“Shalom. You have come up from the coast? It is a long climb to the hills of Yahuḏah.”',
        '“The salt is cut out of the shore of the Salt Sea, where nothing lives — and every pot in the land wants it.”'],
  dress:[0x8a6a4a,0xc8b490,0x6a5a40,0x9a8a6a,0x3a4a7a,0xa89878],
  flock:['sheep','sheep','goat','goat','chicken','donkey'], ride:'donkey'
});

/* ---------------- TSOR AND TSIḎON ---------------- */
EARTH.land({
  n:'Lebanon', old:'Tsor and Tsiḏon',
  makes:['dye','glass','cedar'], wants:['grain','oil','wine'],
  men:['carpenter','woodcutter','mason'], women:['weaver','spinner','baker'],
  works:[{k:'dye-works',town:'Tsor'},{k:'glass-furnace',town:'Tsiḏon'},'cedar-camp'],
  greet:['Peace, stranger of the sea.','You smell the vats? That is the smell of silver.','Welcome to the harbour of the world.'],
  cry:['Purple of Tsor — the dye of kings, twice dipped!','Glass of Tsiḏon, clear as water!','Cedar of Leḇanon, sound to the heart!'],
  talk:['“Welcome, friend. Every ship of the Great Sea puts in here sooner or later — and goes away with purple.”',
        '“Ten thousand shells for one robe’s worth of purple. That heap by the vats is a hundred years of it.”',
        '“The cedars come down from the mountain to the sea, and go in rafts to Yapho for the House in Yahrushalayim.”',
        '“Wheat and oil we buy from Yasharal; our land is all rock and harbour.”'],
  dress:[0x5a2050,0x6e2a5e,0x8a3a3a,0xc8b88a,0x4a3a6a,0x7a5a6a],
  flock:['goat','goat','sheep','chicken','donkey'], ride:'donkey'
});

/* ---------------- MITSRAYIM ---------------- */
EARTH.land({
  n:'Egypt', old:'Mitsrayim',
  makes:['grain','linen'], wants:['cedar','oil','incense'],
  men:['potter','mason','carpenter'], women:['weaver','spinner','baker'],
  works:['linen-works','papyrus'],
  greet:['Life, health and strength to you!','Welcome, stranger from the sea.','The river rose well this year.'],
  cry:['Fine linen of Mitsrayim, white as the light!','Wheat of the black land — bread for the world!'],
  talk:['“Life, health and strength to you, stranger. The river rose well this year; the granaries will be full.”',
        '“The flax is pulled, soaked in the pools and beaten, and the women spin it finer than a hair. No land weaves linen like ours.”',
        '“We have reeds without end, and bread for every nation — but not one cedar. The beams of our houses come by sea from Leḇanon.”'],
  dress:[0xe8e2d0,0xeae6d8,0xd8ccb0,0xf0ebe0,0xd8d0bc,0x3a5a8a],
  flock:['cow','cow','goat','sheep','donkey','chicken'], ride:'donkey'
});

/* ---------------- BAḆAL, THE LAND OF THE KASDIM ---------------- */
EARTH.land({
  n:'Iraq', old:'Baḇal', also:['Kasdim','Ashshur','Shinar'],
  makes:['bitumen','grain'], wants:['cedar','copper','oil'],
  men:['potter','mason','carpenter'], women:['weaver','spinner','baker'],
  works:['bitumen-pit','brick-kiln'],
  greet:['Peace, stranger.','Mind the pits — the slime boils up here.','Welcome between the rivers.'],
  cry:['Slime from the pits, for your seams and your walls!','Barley and dates of the two rivers!'],
  talk:['“Peace to you. Brick for stone, and slime for mortar — so this land has built since the tower.”',
        '“The slime wells up black out of the ground. Boil it with sand and it holds a boat or a wall against any water.”',
        '“There is no stone here and no timber — only clay and the river. Cedar comes down the Euphrates from the west, and dear.”'],
  dress:[0x8a3a2a,0x2a4a7a,0xa88a4a,0x6a2a3a,0xc0a060,0x7a6a50],
  flock:['sheep','sheep','goat','waterbuffalo','donkey','chicken'], ride:'donkey'
});

/* ---------------- EḎOM AND MO’AḆ ---------------- */
EARTH.land({
  n:'Jordan', old:'Eḏom and Mo’aḇ',
  makes:['copper','salt'], wants:['grain','oil','cloth'],
  men:['mason','potter','woodcutter'], women:['weaver','spinner','baker'],
  works:['copper-smelter'],
  greet:['Peace to you.','The smoke on the hill is the copper fires.','Welcome to the red country.'],
  cry:['Copper of the hills of Eḏom, smelted this week!','Salt of the shore, white and clean!'],
  talk:['“Peace. The smoke you see in the hills is the copper fires of Punon — they never go out.”',
        '“Green stone out of the mountain, a fire blown hot with the skins, and the red metal runs out at the bottom.”',
        '“We have copper and salt, and flocks on the high pasture; the grain we buy from the lowland.”'],
  dress:[0x9a5a3a,0x7a4a30,0xb88a5a,0x5a4a3a,0x8a6a4a],
  flock:['goat','goat','sheep','camel','chicken'], ride:'camel'
});

/* ---------------- KITTIM ---------------- */
EARTH.land({
  n:'Cyprus', old:'Kittim',
  makes:['copper','wine'], wants:['grain','cloth','dye'],
  men:['potter','mason','woodcutter'], women:['weaver','spinner','baker'],
  works:['copper-smelter'],
  greet:['Welcome to Kittim, friend.','Peace to you, sailor.','The island of copper greets you.'],
  cry:['Copper of Kittim, the best in all the sea!','Wine of the island, sweet and strong!'],
  talk:['“Welcome to Kittim — every ship of the Great Sea that wants copper comes to us.”',
        '“The ore is dug in the hills and smelted down by the fires; the slag lies in black heaps taller than a house.”'],
  dress:[0xd8ccb0,0x3a6a8a,0x8a5a3a,0xc8a050,0x6a5a48],
  flock:['goat','sheep','pig','donkey','chicken'], ride:'donkey'
});
EARTH.land({
  n:'N. Cyprus', old:'Kittim',
  makes:['copper','wine'], wants:['grain','cloth','dye'],
  men:['potter','mason','woodcutter'], women:['weaver','spinner','baker'],
  works:['copper-smelter'],
  greet:['Welcome to Kittim, friend.','Peace to you, sailor.'],
  cry:['Copper of Kittim!','Wine of the island!'],
  dress:[0xd8ccb0,0x3a6a8a,0x8a5a3a,0xc8a050,0x6a5a48],
  flock:['goat','sheep','pig','donkey','chicken'], ride:'donkey'
});

/* ---------------- SHEḆA, AND THE INCENSE COAST ---------------- */
EARTH.land({
  n:'Yemen', old:'Sheḇa',
  makes:['incense','spice'], wants:['grain','cloth','copper'],
  men:['mason','potter','carpenter'], women:['weaver','spinner','baker'],
  works:['incense-store'],
  greet:['Peace upon you.','All the caravans of incense set out from here.','Welcome to Sheḇa.'],
  cry:['Frankincense, the tears of the trees!','Myrrh and spices for the kings of the north!'],
  talk:['“Peace upon you. The incense is cut from the trees in the hills and bled into tears, and the camels carry it north for seventy days.”',
        '“They burn it in every temple from Mitsrayim to Baḇal, and pay for it in gold.”',
        '“A queen of this land went up to see Shelomoh once, with camels bearing spices and gold. They still tell of it.”'],
  dress:[0x2a3060,0xc89030,0x8a2a2a,0xd8c8a0,0x4a3a2a],
  flock:['goat','goat','sheep','camel','chicken'], ride:'camel'
});
EARTH.land({
  n:'Oman',
  makes:['incense','copper'], wants:['grain','cloth','oil'],
  works:['incense-store'],
  greet:['Peace upon you.','Welcome to the incense coast.'],
  cry:['Frankincense of the southern hills!','Copper of the mountains!'],
  dress:[0x2a3060,0xc89030,0x8a2a2a,0xd8c8a0,0xe6e0d0],
  flock:['goat','goat','camel','sheep','chicken'], ride:'camel'
});
EARTH.land({
  n:'Saudi Arabia', old:'Arabia',
  makes:['spice'], wants:['grain','cloth','oil','wine'],
  greet:['Peace upon you.','Welcome to the tents of Qĕḏar.'],
  cry:['Spices from the south, by camel!'],
  talk:['“Peace upon you. The caravans come up out of the south through our wells, and we take our share of every load.”'],
  dress:[0xe6e0d0,0x4a3a2a,0x8a6a4a,0x2a2a3a,0xc8b490],
  flock:['camel','camel','goat','sheep','chicken'], ride:'camel'
});

/* ---------------- KUSH ---------------- */
EARTH.land({
  n:'Sudan', old:'Kush',
  makes:['spice'], wants:['cloth','oil','glass'],
  greet:['Peace, stranger.','Welcome to Kush.'],
  cry:['Ebony and spices from beyond the cataracts!'],
  talk:['“Welcome to Kush. Gold, ebony and ivory go down the river to Mitsrayim from here, and linen and oil come back.”'],
  dress:[0xe8e0d0,0xb07a3a,0x8a3a2a,0xd8c098,0x3a3a3a],
  flock:['cow','cow','goat','sheep','camel','chicken'], ride:'donkey'
});
EARTH.land({
  n:'Ethiopia', old:'Kush',
  makes:['incense','spice'], wants:['salt','cloth','oil'],
  greet:['Peace, stranger.','Welcome to the high country of Kush.'],
  cry:['Myrrh of the highlands!'],
  talk:['“Welcome. Up here a bar of salt buys more than silver — bring salt and you will go home rich.”'],
  dress:[0xe8e0d0,0xb07a3a,0x8a3a2a,0xd8c098,0xe8e4d8],
  flock:['cow','cow','goat','sheep','donkey','chicken'], ride:'donkey'
});
EARTH.land({ n:'Eritrea', makes:['salt','incense'], wants:['cloth','grain'] });
EARTH.land({ n:'Somalia', makes:['incense','spice'], wants:['cloth','grain'] });
EARTH.land({ n:'Somaliland', makes:['incense','spice'], wants:['cloth','grain'] });

/* ---------------- PARAS, ARAM, AND ASIA ---------------- */
EARTH.land({
  n:'Iran', old:'Paras',
  makes:['cloth','copper'], wants:['incense','dye','oil'],
  greet:['Peace, traveller.','Welcome to Paras.','The king’s road runs through here.'],
  cry:['Fine cloth of Paras, woven with every colour!','Copper of the mountains!'],
  talk:['“Welcome to Paras. The king’s road runs from here to the sea, with a post-house every day’s ride.”'],
  dress:[0x6a2a6a,0xc8962a,0x9a2a2a,0x3a6a4a,0x2a3a7a],
  flock:['sheep','goat','camel','horse','chicken'], ride:'horse'
});
EARTH.land({
  n:'Syria', old:'Aram',
  makes:['wine','cloth'], wants:['dye','incense','copper'],
  greet:['Peace, friend.','Welcome to Aram.'],
  cry:['Wine of Ḥelbon, and white wool!'],
  talk:['“Peace. Damascus trades with all the world — the wine of Ḥelbon and white wool go out from here to Tsor.”'],
  dress:[0x7a4a3a,0x8a6a3a,0x4a5a7a,0xb8a080,0x6a3a3a],
  flock:['sheep','sheep','goat','camel','donkey','chicken'], ride:'donkey'
});
EARTH.land({
  n:'Turkey', old:'Asia',
  makes:['copper','grain'], wants:['dye','incense','spice'],
  greet:['Chaire, stranger!','Peace to you.'],
  dress:[0xd8ccb0,0x8a3a2a,0x3a5a7a,0x9a7a4a,0x6a5a48],
  flock:['sheep','goat','cow','horse','chicken'], ride:'horse'
});
EARTH.land({ n:'Armenia', old:'Ararat', makes:['copper','wine'], wants:['oil','dye','salt'],
  flock:['sheep','goat','cow','horse','chicken'], ride:'horse' });
EARTH.land({ n:'Georgia', makes:['wine'], wants:['oil','salt','dye'] });
EARTH.land({ n:'Libya', old:'Put', makes:['grain','salt'], wants:['oil','wine','cloth'],
  flock:['goat','sheep','camel','chicken'], ride:'camel' });
EARTH.land({ n:'Tunisia', makes:['dye','oil','grain'], wants:['copper','glass','incense'],
  works:['dye-works'], dress:[0x5a2050,0x6e2a5e,0xc8b88a,0x8a3a3a,0xe6e0d0] });
EARTH.land({ n:'Morocco', makes:['salt','dye'], wants:['oil','wine','glass'] });

/* ---------------- YAWAN, ROME AND TARSHISH ---------------- */
EARTH.land({
  n:'Greece', old:'Yawan',
  makes:['oil','wine'], wants:['grain','dye','incense'],
  men:['potter','mason','carpenter'], women:['weaver','spinner','baker'],
  works:['olive-press'],
  greet:['Chaire, stranger!','Welcome to Yawan.','Come and sit — there is wine.'],
  cry:['Oil of Attica, and wine of the islands!','Painted cups, and oil to fill them!'],
  talk:['“Chaire, stranger! Come, sit — there is wine, and the oil is new.”',
        '“The hills give olives and vines and very little else. Our wheat comes by ship from Mitsrayim and the Black Sea.”'],
  dress:[0xe6e0d0,0xc89a3a,0x3a5a8a,0x9a3a2a,0xd8d0b8],
  flock:['goat','sheep','sheep','pig','donkey','chicken'], ride:'donkey'
});
EARTH.land({ n:'North Macedonia', makes:['grain'], wants:['oil','wine','dye'] });
EARTH.land({
  n:'Italy',
  makes:['wine','oil'], wants:['grain','spice','dye'],
  men:['mason','carpenter','potter'], women:['weaver','spinner','baker'],
  works:['wine-press'],
  greet:['Salve, traveller.','Welcome to Italy.','All roads run to Rome, friend.'],
  cry:['Falernian wine, the best in the world!','Oil of Campania!'],
  talk:['“Salve, traveller. The grain ships of Alexandria feed Rome — without them the city would starve in a month.”',
        '“Pepper from India is worth its weight in silver here. Bring spice and you may name your price.”'],
  dress:[0xe8e4d8,0xb03a2a,0x7a5a3a,0xd8ccb0,0x5a4a3a],
  flock:['sheep','pig','cow','goat','chicken'], ride:'horse'
});
EARTH.land({
  n:'Spain', old:'Tarshish',
  makes:['copper','oil','salt'], wants:['dye','glass','spice'],
  greet:['Welcome to Tarshish, sailor.','Peace to you.'],
  cry:['Silver, copper and oil of Tarshish!'],
  talk:['“Welcome to Tarshish — the end of the sea. The ships of Tsor come all this way for our silver and copper.”'],
  dress:[0x8a4a2a,0x5a5a6a,0xa89070,0x3a3a4a,0xc8b490],
  flock:['sheep','pig','cow','goat','chicken'], ride:'horse'
});
EARTH.land({ n:'Portugal', makes:['salt','copper'], wants:['dye','glass','wine'] });

/* ---------------- THE NORTH ---------------- */
EARTH.land({
  n:'Norway',
  makes:['salt'], wants:['wine','oil','grain','spice'],
  greet:['Heill, stranger — come in from the wind.','Welcome to the north.'],
  cry:['Salt of the sea, boiled on the shore!'],
  talk:['“Heill, stranger. The summer is short here; we fish, we boil salt, and we wait for the ships that bring wine and grain.”'],
  dress:[0x6a5a48,0x7a3a2a,0x3a4a6a,0x5a6a3a,0x9a8a70],
  flock:['sheep','sheep','cow','goat','reindeer','chicken'], ride:'horse'
});
EARTH.land({ n:'Sweden', makes:['copper'], wants:['wine','oil','spice'] });
EARTH.land({ n:'Denmark', makes:['salt'], wants:['wine','oil','glass'] });
EARTH.land({ n:'Iceland', makes:['salt'], wants:['grain','wine','cedar'] });
EARTH.land({ n:'Finland', wants:['salt','grain','wine'] });
EARTH.land({ n:'Russia', makes:['salt'], wants:['wine','oil','spice'] });
EARTH.land({ n:'Poland', makes:['salt','grain'], wants:['wine','oil','spice'] });
EARTH.land({ n:'Austria', makes:['salt','copper'], wants:['wine','oil','glass'] });
EARTH.land({ n:'Germany', makes:['grain'], wants:['wine','oil','glass'] });
EARTH.land({ n:'France', makes:['grain','salt'], wants:['wine','oil','dye'] });
EARTH.land({ n:'United Kingdom', makes:['copper'], wants:['wine','oil','glass'] });
EARTH.land({ n:'Ireland', makes:['grain'], wants:['wine','salt','glass'] });

/* ---------------- THE FAR EAST, AND THE ISLES OF SPICE ---------------- */
EARTH.land({
  n:'Japan',
  makes:['copper','salt'], wants:['glass','spice','dye'],
  greet:['Welcome, traveller from beyond the sea.','Peace to you.'],
  cry:['Copper of the mountains, salt of the sea!'],
  talk:['“Welcome, traveller. A ship from beyond the sea — that is a thing to tell the children.”',
        '“Glass beads from the west are prized above jade here. We have copper enough, and salt.”'],
  dress:[0x2a3a5a,0x3a4a6a,0x6a5a4a,0x8a8478,0x4a3a2a],
  flock:['chicken','chicken','ox','horse','pig'], ride:'horse'
});
EARTH.land({
  n:'China',
  makes:['cloth','salt'], wants:['glass','incense','spice'],
  greet:['Welcome, traveller.','Peace to you, stranger of the west.'],
  cry:['Silk, finer than any cloth in the world!'],
  talk:['“Welcome, stranger from the west. The silk goes out along the long road, and glass and incense come back.”'],
  dress:[0x2a3a6a,0x8a2a2a,0x3a3a3a,0xa08a50,0x4a5a4a],
  flock:['pig','pig','chicken','waterbuffalo','ox','goat'], ride:'horse'
});
EARTH.land({ n:'South Korea', makes:['copper'], wants:['glass','spice'] });
EARTH.land({ n:'North Korea', makes:['copper'], wants:['glass','spice'] });
EARTH.land({
  n:'India',
  makes:['spice','cloth'], wants:['wine','glass'],
  greet:['Welcome, traveller.','Peace be with you.'],
  cry:['Pepper and cinnamon — the spices of the world!','Cotton cloth, fine as smoke!'],
  talk:['“Welcome. The ships of the west come on the monsoon wind for pepper, and pay in gold and wine.”'],
  dress:[0xd88a20,0xe8e0d0,0xa02a2a,0x3a7a4a,0xc8a050],
  flock:['cow','cow','waterbuffalo','goat','chicken']
});
EARTH.land({ n:'Pakistan', makes:['cloth','salt','grain'], wants:['wine','glass'] });
EARTH.land({ n:'Sri Lanka', makes:['spice'], wants:['wine','glass','cloth'] });
EARTH.land({ n:'Indonesia', makes:['spice'], wants:['cloth','glass','copper'] });

/* ---------------- THE NEW WORLD ---------------- */
EARTH.land({ n:'Chile', makes:['copper','salt'], wants:['cloth','oil'] });
EARTH.land({ n:'Peru', makes:['cloth','copper'], wants:['salt','glass'],
  flock:['llama','llama','alpaca','alpaca','dog'], ride:null });
EARTH.land({ n:'Bolivia', makes:['salt'], wants:['cloth','grain'],
  flock:['llama','llama','alpaca','alpaca','dog'], ride:null });
EARTH.land({ n:'United States of America', makes:['copper','grain'], wants:['glass','cloth'] });
EARTH.land({ n:'Mexico', makes:['salt'], wants:['copper','glass'] });

/* =================== THE TONGUES OF THE EARTH ===================
   "From these the coastland peoples of the nations were separated into their
   lands, everyone according to his language,"             BERĔSHITH 10:5
   Each people's own names, men's and women's, and the lands it is spoken in
   (each land in one tongue only). A tongue may carry the dress, the beasts
   and the greeting of the lands that have no entry of their own above, for a
   people dresses and keeps beasts much alike. Old names are given as the
   Besorah gives them where it gives them at all. A land in no tongue's list
   keeps the old fourteen names of the engine. */
EARTH.tongue({ k:'hebrew', lands:['Yasharal','Yahudah'],
  m:['Yoram','Boaz','Elazar','Achim','Zebadyah','Malachi','Othniel','Yair','Shammah','Ittai','Carmi','Nachum','Eran','Palti','Yonathan','Ḥanan'],
  f:['Miryam','Tamar','Zilpah','Achsah','Yael','Chuldah','Serach','Naarah','Avigail','Devorah','Keturah','Adah','Bilhah','Peninnah','Milkah','Ruth'] });
EARTH.tongue({ k:'phoenician', lands:['Lebanon','Tunisia'],
  m:['Ḥiram','Ethba‛al','Abibaal','Mattan','Hanno','Magon','Gisco','Himilco','Bomilcar','Ḥamilkar','Abdi','Shipitbaal','Azruba‛al'],
  f:['Elissa','Arishat','Batnoam','Ḥimilkat','Sophoniba','Izeḇal','Ḥotmilk','Shalmat','Ḥanat','Na‛amah','Abibaalat','Ozmilk'] });
EARTH.tongue({ k:'egyptian', lands:['Egypt'],
  m:['Nakht','Kha','Hori','Ineni','Menna','Sennefer','Ahmose','Djehuty','Paneḥesy','Senusret','Userhat','Minnakht','Huy','Penne'],
  f:['Asenath','Nofret','Tiye','Iset','Henut','Nebet','Meryt','Takhat','Hatnefer','Tuya','Sitre','Nefertari','Henuttawy','Raia'] });
EARTH.tongue({ k:'akkadian', lands:['Iraq'],
  m:['Iddina','Nidintu','Balatu','Shumaya','Kudurru','Zakiru','Ilu-bani','Rimutu','Itti-Nabu','Bel-ibni','Kalbaya','Ahu-iddina','Ea-nasir','Arad-Gula'],
  f:['Amtia','Tabni','Gagaya','Belessunu','Nidinti','Kabta','Iltani','Lamassi','Erishti-Aya','Ahassunu','Hunabatu','Bitinnuri'] });
EARTH.tongue({ k:'aramaic', lands:['Syria'],
  m:['Laḇan','Na‛aman','Rezin','Ḥaza’al','Tabrimmon','Zakkur','Bar-rakib','Reḥoḇ','Hadad','Abda','Bethu’al','Mar-ishu'],
  f:['Riḇqah','Raḥal','Leah','Ma‛aḵah','Martha','Milkah','Zilpah','Bilhah','Abda','Shalumith','Ḥanna','Tabitha'] });
EARTH.tongue({ k:'edomite', lands:['Jordan'],
  m:['Hadad','Mĕysha','Balaq','Eglon','Bela','Yoḇaḇ','Ḥusham','Teman','Qenaz','Re‛uw’ĕl','Shamlah','Hadar'],
  f:['Ruth','Orpah','Oholiḇamah','Basemath','Aḏah','Timna','Na‛amah','Mehetaḇal','Matreḏ','Mezahaḇ'] });
EARTH.tongue({ k:'kittim', lands:['Cyprus','N. Cyprus'],
  m:['Onasilos','Evagoras','Stasandros','Nikokles','Kinyras','Barnaḇah','Mnason','Pnytagoras','Aristokypros','Onesagoras','Stasikrates','Timokles'],
  f:['Kypria','Stasikypra','Timokrateia','Nikasia','Aristonike','Onasiphila','Philokypra','Theodora','Euagora','Kleonike'] });
EARTH.tongue({ k:'sabaean', lands:['Yemen'],
  m:['Karib’il','Yatha‛amar','Sumhu‛ali','Ilsharaḥ','Dhamar‛ali','Yada‛il','Nashakarib','Wahab’il','Abikarib','Thawban','Yakrubmalik','Sa‛adum'],
  f:['Bilqis','Bar’at','Ghalibat','Raymat','Lam’at','Haḏiyat','Sa‛adat','Na‛imat','Malikat','Thahabat'] });
EARTH.tongue({ k:'arabian', lands:['Saudi Arabia','Oman','United Arab Emirates','Qatar','Kuwait'],
  m:['Geshem','Qĕḏar','Neḇayoth','Aḏbe’al','Miḇsam','Mishma','Dumah','Massa','Tĕma','Naphish','Qĕḏemah','Zabdi'],
  f:['Basemath','Maḥalath','Zabibe','Shamsi','Yatie','Te’elhunu','Tabua','Adiya','Salma','Rimah'] });
EARTH.tongue({ k:'persian', lands:['Iran','Afghanistan','Tajikistan'],
  m:['Koresh','Dareyawesh','Mithreḏath','Artaḥshashta','Hutana','Vidarna','Arshama','Farnaka','Bagabukhsha','Utana','Bardiya','Vishtaspa'],
  f:['Vashti','Atossa','Parmys','Irdabama','Artystone','Roxana','Parysatis','Amestris','Damaspia','Apama','Stateira','Rhodogune'] });
EARTH.tongue({ k:'kushite', lands:['Sudan','Ethiopia','Eritrea','S. Sudan'],
  m:['Eḇeḏ-Meleḵ','Zeraḥ','Tirhaqah','Piye','Shabaka','Aspelta','Natakamani','Arkamani','Harsiotef','Alara','Kashta','Nastasen'],
  f:['Kandake','Amanirenas','Amanishakheto','Amanitore','Shanakdakhete','Nawidemak','Khensa','Pebatjma','Tabiry','Naparaye'] });
EARTH.tongue({ k:'greek', lands:['Greece','Turkey','North Macedonia'], hail:'Chaire, stranger!',
  m:['Alexandros','Nikolaos','Philippos','Andreas','Stephanos','Timotheos','Demetrios','Erastos','Sosthenes','Aristarchos','Theophilos','Dionysios','Lysias','Kallias'],
  f:['Lydia','Damaris','Phoebe','Eunike','Lois','Chloe','Syntyche','Euodia','Persis','Tryphaina','Rhode','Dorkas','Thekla','Sophia'] });
EARTH.tongue({ k:'latin', lands:['Italy'], hail:'Salve, traveller.',
  m:['Gaius','Lucius','Marcus','Quintus','Titus','Publius','Aulus','Sextus','Cornelius','Julius','Claudius','Aquila','Rufus','Crispus'],
  f:['Priscilla','Julia','Claudia','Junia','Tertia','Livia','Cornelia','Octavia','Aurelia','Valeria','Drusilla','Lucilla','Tullia','Fabia'] });
EARTH.tongue({ k:'iberian', lands:['Spain','Portugal'],
  m:['Arganthonios','Indibilis','Mandonius','Istolatios','Viriathus','Gargoris','Habis','Allucius','Orison','Ildirtar','Bilistage','Edeco'],
  f:['Himilce','Belesa','Neitinke','Ildurtiga','Sosinbe','Bastegi','Iltiradin','Urkebe','Tannegis','Unsibe'] });
EARTH.tongue({ k:'berber', lands:['Morocco','Algeria','Libya','W. Sahara','Mauritania'],
  m:['Massinissa','Jugurtha','Syphax','Juba','Micipsa','Gaia','Tacfarinas','Aksel','Gulussa','Bocchus','Hiempsal','Adherbal'],
  f:['Dihya','Tin Hinan','Tiziri','Tanirt','Tadla','Tamenzut','Tafsut','Tilelli','Dassine','Tadellat'] });
EARTH.tongue({ k:'celtic', lands:['United Kingdom','Ireland','France','Belgium','Luxembourg','Switzerland','Austria','Falkland Is.'],
  dress:[0x5a6a3a,0x7a3a2a,0x3a4a6a,0x8a7a5a,0x6a4a3a], ride:'horse',
  m:['Cunobelinus','Caratacus','Vercingetorix','Brennus','Dumnorix','Cassivellaunus','Togodumnus','Ambiorix','Conall','Niall','Fergus','Diviciacus','Orgetorix','Commius'],
  f:['Boudica','Cartimandua','Brigid','Aine','Deirdre','Medb','Eithne','Onomaris','Camma','Chiomara','Branwen','Niamh','Grainne','Rhiannon'] });
EARTH.tongue({ k:'germanic', lands:['Germany','Netherlands'],
  dress:[0x6a5a48,0x5a4a3a,0x3a4a5a,0x7a6a4a,0x8a3a2a], ride:'horse',
  m:['Arminius','Segestes','Maroboduus','Theudebert','Hrodulf','Gunther','Sigimund','Adalbert','Ermanaric','Hildebrand','Ansgar','Inguiomer'],
  f:['Thusnelda','Hildegard','Gerlinde','Adelheid','Brunhild','Gisela','Kriemhild','Mathilda','Irmgard','Veleda','Ganna','Gerberga'] });
EARTH.tongue({ k:'norse', lands:['Norway','Sweden','Denmark','Iceland'], hail:'Heill, stranger.',
  dress:[0x6a5a48,0x7a3a2a,0x3a4a6a,0x5a6a3a,0x9a8a70], ride:'horse',
  m:['Harald','Olav','Sigurd','Eirik','Bjorn','Leif','Ragnar','Gunnar','Halvard','Thorstein','Arne','Knut','Haakon','Ulf'],
  f:['Ingrid','Sigrid','Astrid','Gudrun','Ragnhild','Solveig','Thora','Helga','Freydis','Aslaug','Gunnhild','Ingebjorg','Tove','Sigrun'] });
EARTH.tongue({ k:'finnic', lands:['Finland','Estonia'],
  m:['Väinö','Ilmari','Kaleva','Ahti','Tapio','Lemminki','Kauko','Toivo','Urho','Lembitu','Meelis','Kalev'],
  f:['Aino','Lempi','Tuuli','Marjatta','Kyllikki','Ilma','Sinikka','Helmi','Linda','Siiri','Pilvi','Laine'] });
EARTH.tongue({ k:'baltic', lands:['Latvia','Lithuania'],
  m:['Mindaugas','Gediminas','Algirdas','Kęstutis','Vytautas','Traidenis','Vytenis','Namejs','Viesturs','Talivaldis','Visvaldis','Jogaila'],
  f:['Birutė','Aldona','Rimgailė','Danutė','Gražina','Morta','Jūratė','Austra','Laima','Dace','Ieva','Rasa'] });
EARTH.tongue({ k:'slavic', lands:['Russia','Ukraine','Belarus','Poland','Czechia','Slovakia','Serbia','Croatia','Slovenia','Bosnia and Herz.','Bulgaria'],
  dress:[0xd8ccb0,0x8a2a2a,0x5a4a3a,0x3a4a6a,0x7a6a4a], ride:'horse',
  m:['Vladimir','Yaroslav','Svyatoslav','Boleslav','Mstislav','Rostislav','Borislav','Dobrynya','Mieszko','Vratislav','Zdeslav','Radomir'],
  f:['Lyudmila','Olga','Dobrava','Zvenislava','Rogneda','Predslava','Milena','Dragomira','Vesna','Bogna','Mlada','Radmila'] });
EARTH.tongue({ k:'magyar', lands:['Hungary'],
  m:['Árpád','Álmos','Géza','Kálmán','Koppány','Levente','Zoltán','Taksony','Huba','Előd','Bulcsú','Tas'],
  f:['Emese','Sarolt','Réka','Csenge','Enikő','Gizella','Etelka','Piroska','Ilona','Hajna','Csilla','Tünde'] });
EARTH.tongue({ k:'dacian', lands:['Romania','Moldova'],
  m:['Decebalus','Burebista','Dromichaetes','Scorilo','Comosicus','Duras','Diegis','Rholes','Dapyx','Zyraxes','Oroles','Cotiso'],
  f:['Dochia','Zia','Doina','Ilinca','Rodica','Sânziana','Ileana','Mioara','Tomira','Zina'] });
EARTH.tongue({ k:'illyrian', lands:['Albania','Kosovo','Montenegro'],
  m:['Bardylis','Glaukias','Agron','Gentius','Pleuratus','Monunius','Bato','Epicadus','Scerdilaidas','Longarus','Grabos','Dazos'],
  f:['Teuta','Etuta','Triteuta','Birkenna','Audata','Cynane','Tatta','Zanatis','Plaria','Vesa'] });
EARTH.tongue({ k:'armenian', lands:['Armenia'],
  m:['Hayk','Aram','Tigran','Artashes','Vardan','Ashot','Smbat','Gagik','Arshak','Trdat','Bagrat','Sahak'],
  f:['Satenik','Zabel','Arsine','Parandzem','Shushanik','Mariam','Anush','Nune','Erato','Sirarpi','Haykanush','Astghik'] });
EARTH.tongue({ k:'kartvelian', lands:['Georgia'],
  m:['Parnavaz','Mirian','Vakhtang','Bagrat','Davit','Saurmag','Pharasmanes','Aderki','Guaram','Archil','Levan','Ioane'],
  f:['Tamar','Nino','Ketevan','Rusudan','Mzia','Nana','Tinatin','Eteri','Natela','Manana','Lela','Darejan'] });
EARTH.tongue({ k:'turkic', lands:['Kazakhstan','Kyrgyzstan','Uzbekistan','Turkmenistan','Azerbaijan'], ride:'horse',
  m:['Bilge','Kultegin','Tonyukuk','Alp','Arslan','Tughril','Bumin','Istemi','Bayan','Kutlug','Tengiz','Batyr'],
  f:['Ay','Altynai','Bopai','Tomyris','Aisulu','Tolkyn','Ayana','Gulnara','Saule','Aigerim','Zarina','Dilnaz'],
  flock:['sheep','sheep','horse','goat','camel'] });
EARTH.tongue({ k:'mongol', lands:['Mongolia'], ride:'horse',
  m:['Temujin','Jochi','Ogedei','Tolui','Subutai','Jebe','Batu','Bo’orchu','Jelme','Muqali','Khasar','Belgutei'],
  f:['Borte','Hoelun','Khulan','Sorghaghtani','Alaqai','Toregene','Checheyigen','Khutulun','Yesui','Yesugen','Tolun','Oghul'],
  flock:['sheep','sheep','goat','horse','yak','camel'] });
EARTH.tongue({ k:'han', lands:['China','Taiwan'],
  m:['Wei','Jian','Ming','Hao','Cheng','Liang','Zhao','Qiang','Bo','Xuan','Kang','Feng','Yuan','Tao'],
  f:['Mei','Lan','Hua','Xiu','Ying','Fang','Yan','Jing','Li','Zhen','Yun','Ling','Hui','Xia'] });
EARTH.tongue({ k:'japanese', lands:['Japan'],
  m:['Taro','Jiro','Kenji','Hiroshi','Takeshi','Masaru','Tadashi','Haruki','Nobu','Isamu','Sadao','Kiyoshi','Akira','Saburo'],
  f:['Hanako','Yuki','Akiko','Sakura','Haruko','Michiko','Tomoe','Kaede','Aiko','Fumiko','Sachiko','Midori','Kiku','Chiyo'] });
EARTH.tongue({ k:'korean', lands:['South Korea','North Korea'],
  dress:[0xe8e4d8,0x3a4a6a,0x8a3a3a,0x6a5a4a], ride:'horse',
  m:['Jumong','Eulji','Gyebaek','Seol','Dong-hyun','Min-ho','Sung-min','Ji-hoon','Young-soo','Tae-yang','Jae-won','Hyun-woo'],
  f:['Seondeok','Soseono','Hye-jin','Min-ji','Eun-ji','Su-bin','Ji-yeon','Ha-eun','Yu-na','Seo-yeon','Mi-ran','Jin-hee'] });
EARTH.tongue({ k:'indic', lands:['India','Nepal','Sri Lanka','Bangladesh','Pakistan'],
  dress:[0xd88a20,0xe8e0d0,0xa02a2a,0x3a7a4a,0xc8a050],
  m:['Arjuna','Chandragupta','Ashoka','Vikram','Ravi','Ananda','Kumar','Rohan','Harsha','Bindusara','Sanjay','Devadatta','Kapila','Mahendra'],
  f:['Sita','Draupadi','Savitri','Gargi','Maitreyi','Padmini','Kamala','Mira','Anjali','Uma','Radha','Priya','Sanghamitta','Yasodhara'] });
EARTH.tongue({ k:'tibetan', lands:['Bhutan'],
  m:['Tenzin','Dorje','Pema','Sonam','Karma','Tashi','Jigme','Ugyen','Namgyal','Wangchuk','Kinley','Norbu'],
  f:['Dolma','Yangchen','Choden','Deki','Lhamo','Dechen','Tshering','Kunzang','Yeshey','Zangmo','Chimi','Dema'],
  flock:['yak','yak','goat','sheep','chicken'] });
EARTH.tongue({ k:'viet', lands:['Vietnam'],
  m:['Quang','Minh','Duc','Hung','Long','Tuan','Phong','Thanh','Bao','Vinh','Hai','Son'],
  f:['Lan','Mai','Hoa','Thu','Huong','Linh','Ngoc','Trang','Chi','Anh','Thao','Trac'],
  flock:['pig','chicken','chicken','waterbuffalo','ox'] });
EARTH.tongue({ k:'tai', lands:['Thailand','Laos'],
  m:['Somchai','Sombat','Prasert','Chai','Kittisak','Narong','Thong','Boon','Somsak','Wichai','Anan','Sakda'],
  f:['Malee','Ratana','Siriporn','Kanya','Nok','Dao','Pim','Suda','Wanna','Ploy','Achara','Busaba'],
  flock:['pig','chicken','chicken','waterbuffalo','ox'] });
EARTH.tongue({ k:'khmer', lands:['Cambodia'],
  m:['Jayavarman','Suryavarman','Yasovarman','Indravarman','Sok','Vuthy','Dara','Sophal','Vannak','Chea','Rith','Samnang'],
  f:['Sopheap','Chenda','Kanika','Bopha','Sothea','Phalla','Rachana','Sokha','Thida','Kunthea','Indradevi','Malis'],
  flock:['pig','chicken','chicken','waterbuffalo','ox'] });
EARTH.tongue({ k:'burmese', lands:['Myanmar'],
  m:['Anawrahta','Kyansittha','Aung','Kyaw','Min','Thein','Htun','Zaw','Naing','Tun','Myint','Soe'],
  f:['Hla','Khin','Mya','Su','Thida','Nwe','Yin','Aye','Thandar','Nilar','Moe','Sanda'] });
EARTH.tongue({ k:'malay', lands:['Malaysia','Indonesia','Brunei','Timor-Leste'],
  m:['Parameswara','Gajah','Wira','Bayu','Adi','Agung','Bima','Budi','Dharma','Eka','Putra','Surya'],
  f:['Dewi','Sari','Ayu','Kartika','Melati','Putri','Ratna','Sekar','Wulan','Intan','Indah','Kencana'],
  flock:['chicken','chicken','waterbuffalo','goat','pig'] });
EARTH.tongue({ k:'tagalog', lands:['Philippines'],
  m:['Lapu-Lapu','Humabon','Sulayman','Lakandula','Bagani','Dakila','Bayani','Makisig','Tagumpay','Dumangsil','Balagtas','Kalantiaw'],
  f:['Urduja','Amihan','Dalisay','Ligaya','Mayumi','Tala','Hiraya','Liwayway','Marikit','Luningning','Sinag','Dayang'],
  flock:['chicken','chicken','waterbuffalo','pig','goat'] });
EARTH.tongue({ k:'somali', lands:['Somalia','Somaliland','Djibouti'],
  m:['Warsame','Guuleed','Faarax','Samatar','Dhoodaan','Gacal','Cigaal','Xirsi','Jaamac','Waabari','Geedi','Barre'],
  f:['Ubax','Hodan','Ladan','Deeqa','Ayaan','Ardo','Hibo','Ruun','Sagal','Idil','Muna','Nimco'],
  flock:['camel','camel','goat','sheep','goat'], ride:'camel' });
EARTH.tongue({ k:'swahili', lands:['Kenya','Tanzania','Uganda'],
  m:['Jomo','Baraka','Juma','Kamau','Mwangi','Otieno','Odhiambo','Kipchoge','Mutua','Wanyama','Jabari','Mugisha'],
  f:['Wanjiru','Nyokabi','Achieng','Zawadi','Neema','Imani','Wambui','Akinyi','Nafula','Amani','Nakato','Furaha'],
  flock:['cow','cow','goat','sheep','chicken'] });
EARTH.tongue({ k:'kinyarwanda', lands:['Rwanda','Burundi'],
  m:['Mugabo','Habimana','Gihanga','Ruganzu','Kigeli','Mibambwe','Ntare','Mwezi','Ndori','Gasana','Kamana','Ganza'],
  f:['Uwimana','Mukamana','Kanjogera','Ingabire','Umutoni','Uwase','Keza','Mutesi','Ineza','Gatesi','Kirezi','Teta'],
  flock:['cow','cow','goat','sheep','chicken'] });
EARTH.tongue({ k:'kongo', lands:['Angola','Congo','Dem. Rep. Congo','Gabon','Eq. Guinea','Central African Rep.','Cameroon'],
  m:['Mvemba','Lukeni','Mbemba','Nkuwu','Kiluanji','Mpanzu','Ngola','Makoko','Kasongo','Ilunga','Kalala','Lumbu'],
  f:['Nzinga','Kimpa','Mbandi','Kambu','Funji','Nsimba','Nkenge','Mbali','Kiese','Zola','Tshilanda','Malaika'] });
EARTH.tongue({ k:'nguni', lands:['South Africa','eSwatini','Lesotho','Botswana','Namibia'],
  m:['Shaka','Dingane','Mthunzi','Sipho','Themba','Sizwe','Bongani','Sandile','Moshoeshoe','Khama','Cetshwayo','Thabo'],
  f:['Nandi','Thandiwe','Nomvula','Lindiwe','Zanele','Lerato','Nokuthula','Busisiwe','Ayanda','Naledi','Zodwa','Dineo'],
  flock:['cow','cow','goat','sheep','chicken'] });
EARTH.tongue({ k:'shona', lands:['Zimbabwe','Zambia','Malawi','Mozambique'],
  m:['Tendai','Tatenda','Farai','Tafadzwa','Kudzai','Mutota','Nyatsimba','Chaminuka','Tonderai','Simba','Tapiwa','Munashe'],
  f:['Chipo','Rudo','Nyasha','Tsitsi','Rufaro','Vimbai','Nehanda','Chiedza','Fadzai','Ruvimbo','Shamiso','Tariro'],
  flock:['cow','cow','goat','sheep','chicken'] });
EARTH.tongue({ k:'malagasy', lands:['Madagascar'],
  m:['Rado','Rakoto','Hery','Andry','Tahiry','Fanilo','Mamy','Rija','Ralambo','Nirina','Faniry','Toky'],
  f:['Rasoa','Fara','Ranavalona','Voahirana','Hanitra','Lalao','Miora','Onja','Soa','Volana','Zo','Haingo'],
  flock:['cow','cow','chicken','pig','goat'] });
EARTH.tongue({ k:'mande', lands:['Mali','Senegal','Gambia','Guinea','Guinea-Bissau','Burkina Faso','Niger','Sierra Leone','Liberia',"Côte d'Ivoire",'Chad'],
  m:['Sundiata','Musa','Bakary','Sekou','Mamadi','Sumanguru','Fakoli','Tiramakan','Abubakari','Soumaoro','Balla','Lansana'],
  f:['Sogolon','Kadiatou','Aminata','Fatoumata','Kankou','Mariama','Djeneba','Assitan','Oumou','Kani','Salimata','Bintou'] });
EARTH.tongue({ k:'akan', lands:['Ghana','Togo','Benin'],
  m:['Kwame','Kofi','Kwaku','Yaw','Kwasi','Kwabena','Kojo','Osei','Opoku','Anokye','Ofori','Agyeman'],
  f:['Ama','Akosua','Adwoa','Abena','Efua','Akua','Yaa','Afua','Esi','Adjoa','Serwaa','Akyaa'] });
EARTH.tongue({ k:'nigerian', lands:['Nigeria'],
  m:['Adebayo','Olumide','Oduduwa','Oranmiyan','Chukwuemeka','Obinna','Nnamdi','Babatunde','Ayodele','Kayode','Emeka','Ikenna'],
  f:['Moremi','Amina','Folake','Adaeze','Ngozi','Chiamaka','Funmilayo','Yetunde','Abiola','Nkechi','Ifeoma','Bisi'] });
EARTH.tongue({ k:'nahua', lands:['Mexico','El Salvador','Nicaragua'], ride:null,
  m:['Cuauhtemoc','Itzcoatl','Tlacaelel','Nezahualcoyotl','Ahuitzotl','Tizoc','Axayacatl','Cuitlahuac','Chimalpopoca','Huitzilihuitl','Acamapichtli','Ixtlilxochitl'],
  f:['Xochitl','Citlali','Tecuichpo','Papantzin','Yolotl','Necahual','Atototztli','Ilancueitl','Quetzalxochitl','Tlazohtzin','Miahuaxihuitl','Itzel'],
  flock:['dog','dog','chicken'] });
EARTH.tongue({ k:'maya', lands:['Guatemala','Belize','Honduras'], ride:null,
  m:['Pakal','Kinich','Yax','Balam','Chan','Kan','Itzam','Yaxun','Kakupacal','Tutul','Ajaw','Chak'],
  f:['Sak K’uk’','Yohl Ik’nal','Ix Chan','Itzel','Nikte','Saasil','Ixik','Zazil','Yatzil','Sac Nicte','Ixkem','Chabi'],
  flock:['dog','dog','chicken'] });
EARTH.tongue({ k:'chibcha', lands:['Colombia','Panama','Costa Rica'], ride:null,
  m:['Tisquesusa','Nemequene','Sagipa','Quemuenchatocha','Aquiminzaque','Saguamanchica','Tundama','Goranchacha','Ubaque','Sugamuxi'],
  f:['Bachue','Furatena','Siecha','Tota','Sua','Guaya','Yaya','Nencata','Saba','Zipa'] });
EARTH.tongue({ k:'taino', lands:['Cuba','Haiti','Dominican Rep.','Puerto Rico','Jamaica','Bahamas','Trinidad and Tobago','Venezuela','Guyana','Suriname'], ride:null,
  m:['Hatuey','Guarionex','Caonabo','Guacanagarix','Agüeybaná','Mayobanex','Cotubanamá','Enriquillo','Urayoán','Guamá','Behechio','Hayuya'],
  f:['Anacaona','Higüemota','Yuisa','Guanina','Iguanamá','Casiguaya','Onaney','Yarey','Taína','Yari','Inaru','Aymaco'],
  flock:['dog','dog','chicken'] });
EARTH.tongue({ k:'quechua', lands:['Peru','Bolivia','Ecuador'], ride:null,
  m:['Manco','Pachacutec','Tupac','Huayna','Atahualpa','Sinchi','Yupanqui','Amaru','Huascar','Titu','Rumi','Waman'],
  f:['Ocllo','Cusi','Chasca','Killa','Sisa','Nina','Qori','Chimpu','Ima','Tika','Wayta','Yupa'],
  flock:['llama','llama','alpaca','alpaca','dog'] });
EARTH.tongue({ k:'mapuche', lands:['Chile','Argentina'], ride:'horse',
  m:['Lautaro','Caupolican','Galvarino','Colocolo','Michimalonco','Pelantaro','Tucapel','Lientur','Quilapan','Lemucan','Ainavillo','Calfucura'],
  f:['Janequeo','Guacolda','Fresia','Ayelen','Rayen','Millaray','Amancay','Llanka','Relmu','Ailen','Liwen','Suyai'],
  flock:['llama','sheep','goat','horse','chicken'] });
EARTH.tongue({ k:'tupi', lands:['Brazil','Paraguay','Uruguay'], ride:null,
  m:['Arariboia','Cunhambebe','Tibiriçá','Piquerobi','Jaguaré','Aimberê','Sepé','Caiubi','Araribá','Poti','Ubirajara','Tabajara'],
  f:['Bartira','Paraguaçu','Moema','Jaci','Iracema','Potira','Jurema','Araci','Moacira','Juçara','Iandara','Inaiá'],
  flock:['dog','dog','chicken'] });
EARTH.tongue({ k:'algonquian', lands:['United States of America','Canada'], ride:null,
  m:['Tisquantum','Massasoit','Metacom','Tecumseh','Wingina','Hiawatha','Ninigret','Canonchet','Uncas','Miantonomi','Pontiac','Samoset'],
  f:['Matoaka','Weetamoo','Awashonks','Quaiapen','Wenona','Nokomis','Amonute','Kateri','Sacagawea','Ahyoka','Nonhelema','Halona'],
  flock:['dog','dog','chicken'] });
EARTH.tongue({ k:'inuit', lands:['Greenland'], ride:null,
  m:['Aputsiaq','Inuk','Malik','Nuka','Kunuk','Pavia','Ulloriaq','Qillaq','Minik','Kaali','Ivik','Sakaeraq'],
  f:['Pipaluk','Aviaja','Naja','Ivalu','Paninnguaq','Arnaq','Nivi','Ane','Kiista','Aleqa','Sila','Qupanuk'],
  flock:['dog','dog','dog'] });
EARTH.tongue({ k:'aboriginal', lands:['Australia'], ride:null,
  m:['Bennelong','Pemulwuy','Yagan','Windradyne','Jandamarra','Tedbury','Mullawirraburka','Arabanoo','Colebee','Yemmerrawanne','Musquito','Midgegooroo'],
  f:['Truganini','Barangaroo','Patyegarang','Tarenorerer','Kalinda','Mundara','Lowanna','Marlee','Yindi','Kirra','Alinta','Jedda'],
  flock:['dog','dog'] });
EARTH.tongue({ k:'maori', lands:['New Zealand'], ride:null,
  m:['Tama','Rangi','Hongi','Ruatara','Tawhiao','Rewi','Kupe','Toi','Whatonga','Tamati','Hone','Mahuta'],
  f:['Aroha','Hine','Ngaio','Moana','Kahurangi','Huia','Kiri','Marama','Ataahua','Tui','Anahera','Whetu'],
  flock:['dog','dog','pig'] });
EARTH.tongue({ k:'melanesian', lands:['Papua New Guinea','Solomon Is.','Vanuatu','New Caledonia','Fiji'], ride:null,
  m:['Cakobau','Seru','Atai','Kasa','Vaka','Tuka','Bai','Naiogo','Kiapa','Tomasi','Ratu','Mosese'],
  f:['Adi','Litia','Salote','Vika','Kesa','Makereta','Losana','Ulamila','Tima','Mere','Seini','Lusia'],
  flock:['pig','pig','chicken','dog'] });
