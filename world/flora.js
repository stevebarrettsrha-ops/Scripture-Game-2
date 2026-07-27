/* ============================================================
   THE GROWTH OF EVERY LAND — one file, and it is all data
   ------------------------------------------------------------
   "And out of the ground made YHWH Aluah to grow every tree that is pleasant
    to the sight, and good for food."

   THE FAULT THIS FILE MENDS. There were FOUR growing things in the whole
   world — a round green tree, a palm, a cherry in blossom, and a thorn — and
   every wood from Norway to Java was the same tree repeated. No country grew
   anything of its own. There was not one olive, date, apple, vine, coffee
   bush or ear of corn on the entire earth.

   Now every land keeps its own growth. Come ashore in Greece and it is olive,
   fig, vine, cypress and stone pine; in Japan, cedar, bamboo, cherry and tea;
   in Brazil, rubber, brazil nut, cacao and the great buttressed ceiba; in
   Norway, spruce, birch, pine and the bilberry under them.

   ---- HOW A PLANT IS CHOSEN FOR A SPOT ----
   The same way a beast is (see world/fauna.js — the two files are twins):
   the LAND is looked up in `lands`, everything on its list that will grow on
   THIS ground is kept, and one is drawn by a number seeded on the place. So
   the same field always bears the same wood, and a stand of pine runs fifty
   metres before it gives way to birch.

   ---- HOW TO ADD A PLANT ----
   Give it a line in `kinds` — its FORM, its colours, its stature — and name
   it in whichever lands grow it. Nothing else. The forms are listed in
   js/flora.js, which is the file that knows how to build them.

   ---- THE PALETTES ----
   Most countries in a region grow most of the same things, so the common
   growth of each region is named ONCE below and each land adds what is its
   own. Read a country's line as "the region, and these besides".
   ============================================================ */

/* ---------------- THE REGIONAL PALETTES ---------------- */
/* the deciduous wood of the temperate north, and the fields under it */
const TEMPERATE=['oak','darkoak','sycamore','beech','birch','ash','elm','hazel','rowan','hawthorn','linden',
  'bramble','holly','fern','clover','wheat','barley','poppy','nettle','elderberry',
  'pear','gooseberry','currant','broom','alder','mint','willow','reed','bulrush',
  'watercress','sedge','waterlily'];
/* the boreal forest — spruce, pine and birch, and berries in the moss */
const BOREAL=['spruce','pine','birch','larch','rowan','juniper','willow','alder',
  'bilberry','lingonberry','heather','moss','fern','cottongrass','barley','currant',
  'reed','sedge','watercress','cranberry'];
/* the tundra beyond the trees: nothing stands above the knee */
const TUNDRA=['dwarfbirch','arcticwillow','crowberry','cloudberry','lingonberry',
  'heather','moss','lichen','reindeermoss','cottongrass',
  'arcticpoppy','saxifrage','mosscampion','fireweed','bearberry','labradortea'];
/* the sea of the middle earth — the oldest orchard in the world */
const MEDIT=['olive','fig','grapevine','almond','cypress','stonepine','laurel',
  'corkoak','holmoak','pomegranate','carob','myrtle','oleander','rosemary','lavender',
  'thyme','sage','oregano','boxwood','quince','wheat','barley','poppy'];
/* ---- THE WASTES, AND THEY ARE NOT ONE WASTE ----
   The Sahara and Arabia; the cold gravel from Persia to the Gobi; the mesa
   country of the new world; and the red centre of the great south land. They
   grow nothing whatever in common but the tamarisk, the saltbush and the
   thistle, and to give them one list is to put a saguaro cactus in Mongolia,
   which is exactly what used to happen. */
const DESERTS=['datepalm','acacia','tamarisk','doum','saltbush','myrrh',
  'frankincense','aloe','thistle','barley','melon','ghaf','sidr','colocynth',
  'whitebroom','camelthorn','reed','papyrus','bulrush'];
/* from Persia to the Gobi — a COLD waste, and it looks like one */
const DESERT_ASIA=['saxaul','tamarisk','desertpoplar','camelthorn','wormwood',
  'ephedra','feathergrass','tumbleweed','saltbush','thistle','juniper','melon',
  'barley','reed','sedge'];
/* the mesa and the basin of the new world */
const DESERT_AMER=['saguaro','pricklypear','barrelcactus','ocotillo','joshua',
  'yucca','agave','mesquite','creosote','sagebrush','saltbush','cottonwood','thistle'];
/* and the red centre */
const DESERT_AUS=['mulga','desertoak','ghostgum','spinifex','mallee','saltbush',
  'pricklypear','wattle','thistle'];
/* the rain forest of the equator */
const RAINFOREST=['ceiba','jungle','rosewood','ironwood','mahogany','rubber','banyan','bodhi','treefern','fern',
  'banana','papaya','mango','cacao','coffee','moss','pandanus','sugarcane',
  'guava','cassava','waterlily','orchid','mangrove','sedge','lotus','taro','rice'];
/* the plain of the south — thorn, palm and the great bole of the baobab */
const SAVANNAH=['acacia','umbrellathorn','mopane','tamboti','baobab','marula','shea','sausagetree',
  'doum','sorghum','millet','aloe','sagebrush','reed','sedge','papyrus','lotus'];
/* the monsoon lands of the east */
const MONSOON=['teak','sal','neem','ironwood','jungle','banyan','bodhi','bamboo','mango','banana',
  'coconut','tamarind','rice','sugarcane','cotton','turmeric','mangrove','lotus','sedge','taro'];
/* the isles and shores of the warm sea */
const ISLES=['coconut','pandanus','banana','papaya','mango','breadfruit',
  'mangrove','taro','sugarcane','hibiscus','fern','reed','sedge'];
/* the high country above the tree line */
const ALPINE_P=['juniper','dwarfbirch','heather','moss','lichen','thyme','gentian'];

EARTH.flora({

/* ============================================================
   EVERY GROWING THING, AND WHAT IT IS
   ------------------------------------------------------------
   form   which shape it takes — see js/flora.js for the list. Anything not
          a tree form (shrub, herb, cane, pad, rosette) is LOW GROWTH and is
          drawn in among the grass instead of standing as a tree.
   bole   the colour of the wood. leaf the colour of the leaf.
   fruit  OPTIONAL — the colour of what it bears; hung where the form hangs
          it, so an orchard reads as an orchard from across the field.
   flower OPTIONAL — for herbs and rosettes, the colour of the bloom.
   h / w  how tall and how broad, against its fellows of the same form.
   wt     how often it is met on ground it will take (1 by default).
   g      THE GROUNDS IT WILL GROW ON. It is never planted on any other.
   hh     OPTIONAL [lo,hi] — how high above the sea it grows, in blocks.
   fn/fs  how many fruits, and how big.
   riv    OPTIONAL true — it grows on a RIVER BANK and nowhere else on the
          earth: the reed, the papyrus, the bulrush, the water lily, the
          paddy, the mangrove. (The same flag the beasts use in fauna.js.)
   wet    OPTIONAL true — it grows away from water too, but where there IS
          water it crowds it: the willow, the alder, the poplar, the date
          palm at the oasis.
   ============================================================ */
kinds:{

/* ---- THE DECIDUOUS WOOD OF THE TEMPERATE NORTH ---- */
oak      :{form:'broad', bole:0x6b4a2a, leaf:0x3e7a2c, g:['grass','alpine'], wt:1.6},
beech    :{form:'round', bole:0x8a7a68, leaf:0x5a9a3a, g:['grass','alpine']},
birch    :{form:'round', bole:0xe4e0d4, leaf:0x7fbf4a, h:0.9, w:0.72, g:['grass','tundra','alpine'], wt:1.4},
ash      :{form:'broad', bole:0x7a6a58, leaf:0x5e8f3c, g:['grass','alpine']},
elm      :{form:'round', bole:0x6b5540, leaf:0x4a7f30, g:['grass']},
maple    :{form:'broad', bole:0x6a4a30, leaf:0x4f8a34, g:['grass','alpine'], wt:1.2},
sugarmaple:{form:'broad',bole:0x6a4a30, leaf:0xd2732a, g:['grass','alpine']},
linden   :{form:'round', bole:0x6a5238, leaf:0x63a03c, g:['grass']},
hornbeam :{form:'round', bole:0x8a8272, leaf:0x4e8a34, g:['grass']},
willow   :{wet:true, form:'round', bole:0x7a6a4a, leaf:0x8fb054, h:0.85, w:1.3, g:['grass','tundra']},
poplar   :{wet:true, form:'column',bole:0x9a8a72, leaf:0x6fa040, g:['grass']},
aspen    :{form:'column',bole:0xd8d4c4, leaf:0x8fbf46, g:['grass','alpine','tundra']},
alder    :{wet:true, form:'round', bole:0x5a4a3a, leaf:0x3f7a34, g:['grass','tundra']},
chestnut :{form:'broad', bole:0x5f4630, leaf:0x437c2a, fruit:0x7a6a2a, g:['grass']},
walnut   :{form:'broad', bole:0x4a3a2a, leaf:0x4a8034, fruit:0x6a5a30, g:['grass']},
hickory  :{form:'broad', bole:0x6a5238, leaf:0x4f8a34, fruit:0x7a6a3a, g:['grass']},
pecan    :{form:'broad', bole:0x6a5238, leaf:0x4a8034, fruit:0x8a6a40, g:['grass']},
rowan    :{form:'round', bole:0x7a6a5a, leaf:0x5e8f3c, fruit:0xc03020, h:0.7, g:['grass','tundra','alpine']},
holly    :{form:'round', bole:0x5a4a3a, leaf:0x1f5a24, fruit:0xc02818, h:0.6, g:['grass']},
yew      :{form:'round', bole:0x6a3a2a, leaf:0x1e4a26, h:0.7, g:['grass','alpine']},
cottonwood:{wet:true, form:'round',bole:0x8a7a62, leaf:0x7aa83a, g:['grass','desert','badlands']},
magnolia :{form:'blossom',bole:0x7a6a58,leaf:0xf0ece0, h:0.8, g:['grass','tropic']},
ginkgo   :{form:'round', bole:0x7a6a58, leaf:0xd8c83a, h:1.1, g:['grass']},

/* ---- THE CONIFERS ---- */
pine     :{form:'conifer',bole:0x7a4a28, leaf:0x2f6a34, g:['grass','alpine','tundra'], wt:1.6},
spruce   :{form:'conifer',bole:0x5a3a26, leaf:0x22562c, h:1.15, g:['grass','alpine','tundra'], wt:1.6},
fir      :{form:'conifer',bole:0x4a3624, leaf:0x2a5e38, g:['grass','alpine']},
larch    :{form:'conifer',bole:0x6a4a2e, leaf:0x7aa83a, g:['grass','alpine','tundra']},
hemlock  :{form:'conifer',bole:0x5a4030, leaf:0x2a5230, g:['grass','alpine']},
douglasfir:{form:'conifer',bole:0x6a4830,leaf:0x2e6234, h:1.5, g:['grass','alpine']},
cedar    :{form:'conifer',bole:0x6a4630, leaf:0x2e5e3a, h:1.2, w:1.35, g:['grass','alpine'], wt:0.7},
cypress  :{form:'column', bole:0x5a4630, leaf:0x2a4e30, g:['grass','alpine']},
baldcypress:{wet:true, form:'conifer',bole:0x7a5a3a,leaf:0x6a8a4a, g:['grass','tropic']},
juniper  :{form:'column', bole:0x6a5238, leaf:0x4a6a4a, fruit:0x3a4a7a, h:0.55, g:['grass','alpine','rock','tundra','desert']},
redwood  :{form:'conifer',bole:0x8a3a24, leaf:0x2a5a34, h:2.2, w:0.85, g:['grass'], wt:0.5},
sequoia  :{form:'conifer',bole:0x8a4028, leaf:0x2e5e34, h:2.4, w:1.1, g:['grass','alpine'], wt:0.4},
araucaria:{form:'conifer',bole:0x5a4a3a, leaf:0x2a5e2a, h:1.6, w:0.7, g:['grass','alpine']},
podocarp :{form:'conifer',bole:0x6a5040, leaf:0x2e6a34, g:['grass','tropic','alpine']},
kauri    :{form:'round',  bole:0x9a8a72, leaf:0x2e6a30, h:2.0, w:1.2, g:['grass','tropic'], wt:0.4},
stonepine:{form:'thorn',  bole:0x8a5a30, leaf:0x35682f, g:['grass','sand']},

/* ---- THE SEA OF THE MIDDLE EARTH ---- */
olive    :{form:'round', bole:0x8a8270, leaf:0x8a9a6a, fruit:0x3a4a2a, h:0.7, w:0.9, g:['grass','alpine','desert'], wt:1.5},
fig      :{form:'round', bole:0x9a8a74, leaf:0x4a8a3a, fruit:0x6a3a5a, h:0.7, g:['grass','desert']},
grapevine:{form:'shrub', bole:0x6a4a30, leaf:0x5a8a3a, fruit:0x5a2a6a, h:0.8, g:['grass'], wt:1.4},
almond   :{form:'blossom',bole:0x7a5a3a,leaf:0xf0c8d8, fruit:0x9a8a5a, h:0.7, g:['grass','desert']},
pomegranate:{form:'round',bole:0x8a6a4a,leaf:0x3f7a3a, fruit:0xc03828, h:0.6, g:['grass','desert']},
carob    :{form:'round', bole:0x6a5238, leaf:0x3a6a34, fruit:0x4a3020, h:0.7, g:['grass','desert']},
corkoak  :{form:'broad', bole:0xa06a3a, leaf:0x4a7a34, h:0.85, g:['grass']},
laurel   :{form:'round', bole:0x6a5238, leaf:0x2e6a34, h:0.6, g:['grass']},
myrtle   :{form:'shrub', leaf:0x2e6a3a, fruit:0x2a2a4a, g:['grass','desert']},
oleander :{form:'shrub', leaf:0x3a7a3a, flower:0xe07aa0, g:['grass','desert']},

/* ---- THE ORCHARD ---- */
apple    :{form:'blossom',bole:0x6a4a30,leaf:0x4a8a3a, fruit:0xc82a24, h:0.75, g:['grass'], wt:1.2},
pear     :{form:'blossom',bole:0x6a4a30,leaf:0x4a8a3a, fruit:0xc8c04a, h:0.8, g:['grass']},
plum     :{form:'round', bole:0x6a4a30, leaf:0x4a7a3a, fruit:0x5a2a6a, h:0.65, g:['grass']},
cherry   :{form:'blossom',bole:0x6a4a30,leaf:0xf2b6cc, fruit:0xc0202a, h:0.75, g:['grass'], wt:1.2},
peach    :{form:'blossom',bole:0x6a4a30,leaf:0xf0a8b8, fruit:0xe89040, h:0.7, g:['grass']},
apricot  :{form:'blossom',bole:0x6a4a30,leaf:0xf0c0c8, fruit:0xe8a030, h:0.7, g:['grass','desert']},
quince   :{form:'round', bole:0x6a4a30, leaf:0x4a8a3a, fruit:0xd8c040, h:0.6, g:['grass']},
mulberry :{form:'round', bole:0x6a5238, leaf:0x4a8a3a, fruit:0x3a1030, h:0.7, g:['grass','tropic']},
persimmon:{form:'round', bole:0x6a5238, leaf:0x4a8034, fruit:0xe07020, h:0.7, g:['grass']},
orange   :{form:'round', bole:0x6a4a30, leaf:0x2f6a2e, fruit:0xe88418, h:0.6, g:['grass','tropic']},
lemon    :{form:'round', bole:0x6a4a30, leaf:0x2f6a2e, fruit:0xe8d020, h:0.6, g:['grass','tropic']},
lime     :{form:'round', bole:0x6a4a30, leaf:0x2f6a2e, fruit:0x9ac82a, h:0.55, g:['grass','tropic']},
grapefruit:{form:'round',bole:0x6a4a30, leaf:0x2f6a2e, fruit:0xe8c860, h:0.65, g:['grass','tropic']},

/* ---- THE TROPICS ---- */
coconut  :{form:'palm', bole:0x9a7a52, leaf:0x4f8f3a, fruit:0x8a6a3a, fn:4, fs:0.34, g:['tropic','sand'], wt:1.6},
oilpalm  :{wet:true, form:'palm', bole:0x7a5a3a, leaf:0x3f7a2e, fruit:0xc04a20, g:['tropic']},
datepalm :{wet:true, form:'palm', bole:0xa08a5e, leaf:0x7a9a4a, fruit:0xa06a28, fn:6, g:['desert','sand','savanna'], wt:1.6},
doum     :{wet:true, form:'palm', bole:0x9a7a52, leaf:0x7a9a54, fruit:0xa07a30, h:0.8, g:['desert','savanna','sand']},
areca    :{wet:true, form:'palm', bole:0x9a8a62, leaf:0x4a8a3a, h:1.2, w:0.6, g:['tropic']},
sago     :{wet:true, form:'palm', bole:0x8a7a52, leaf:0x4a8a3a, g:['tropic']},
pandanus :{form:'palm', bole:0x8a7a5a, leaf:0x4a8a4a, h:0.7, g:['tropic','sand']},
banana   :{wet:true, form:'banana',bole:0x6a8a4a,leaf:0x5aa03a, fruit:0xd8c02a, g:['tropic','savanna'], wt:1.4},
papaya   :{form:'palm', bole:0x8a8a62, leaf:0x4f9a3a, fruit:0xe0a038, h:0.7, w:0.7, g:['tropic']},
mango    :{form:'round',bole:0x6a5238, leaf:0x2f6a2a, fruit:0xd8a028, w:1.2, g:['tropic','savanna'], wt:1.2},
breadfruit:{form:'round',bole:0x8a7a5a,leaf:0x2e6a2e, fruit:0x8aa83a, g:['tropic']},
jackfruit:{form:'round',bole:0x7a6a4a, leaf:0x2a6a2a, fruit:0x9a9a30, fn:3, fs:0.4, g:['tropic']},
guava    :{form:'round',bole:0x9a8a72, leaf:0x4a8a3a, fruit:0xd8d060, h:0.6, g:['tropic']},
avocado  :{form:'round',bole:0x6a5238, leaf:0x2e6a2e, fruit:0x3a5a28, g:['tropic']},
cacao    :{form:'round',bole:0x6a4a30, leaf:0x2a6a2a, fruit:0xc06020, h:0.55, g:['tropic']},
coffee   :{form:'shrub',bole:0x5a4030, leaf:0x2a6a2e, fruit:0xc02818, g:['tropic','alpine'], wt:1.2},
tea      :{form:'shrub',bole:0x5a4030, leaf:0x2a6a2e, h:0.6, g:['tropic','alpine','grass']},
rubber   :{form:'round',bole:0x9a8a72, leaf:0x2a6a2e, h:1.3, g:['tropic']},
teak     :{form:'broad',bole:0x8a6a48, leaf:0x4a7a30, h:1.4, g:['tropic','savanna']},
sal      :{form:'broad',bole:0x7a5a3a, leaf:0x3f7a30, h:1.4, g:['tropic']},
mahogany :{form:'spread',bole:0x7a4a30,leaf:0x2a5e2a, h:1.5, g:['tropic'], wt:0.7},
ebony    :{form:'broad',bole:0x2a2018, leaf:0x24521f, h:1.2, g:['tropic'], wt:0.6},
ceiba    :{form:'spread',props:true, bole:0x9a9a86,leaf:0x3a7a34, h:1.8, w:1.2, g:['tropic'], wt:0.5},
brazilnut:{form:'broad',bole:0x8a7a5a, leaf:0x2e6a2e, fruit:0x6a5030, h:1.8, g:['tropic'], wt:0.5},
cashew   :{form:'round',bole:0x7a6a4a, leaf:0x3a7a30, fruit:0xd8b030, h:0.7, g:['tropic','savanna']},
durian   :{form:'round',bole:0x6a5238, leaf:0x2a6a2a, fruit:0x9a9a3a, fn:3, fs:0.36, g:['tropic']},
rambutan :{form:'round',bole:0x6a5238, leaf:0x2a6a2a, fruit:0xc82828, h:0.7, g:['tropic']},
lychee   :{form:'round',bole:0x6a5238, leaf:0x2a6a2a, fruit:0xc04030, h:0.7, g:['tropic']},
longan   :{form:'round',bole:0x6a5238, leaf:0x2a6a2a, fruit:0xb08a5a, h:0.7, g:['tropic']},
mangosteen:{form:'round',bole:0x5a4030,leaf:0x24581f, fruit:0x4a1a2a, h:0.7, g:['tropic']},
starfruit:{form:'round',bole:0x7a6a4a, leaf:0x3a7a30, fruit:0xd8c828, h:0.6, g:['tropic']},
tamarind :{form:'round',bole:0x6a5238, leaf:0x4a8a3a, fruit:0x6a4a28, w:1.1, g:['tropic','savanna']},
banyan   :{form:'spread',props:true, bole:0x8a7a62,leaf:0x2e6a2e, fruit:0xc03020, g:['tropic','savanna'], wt:0.8},
bodhi    :{form:'spread',props:true, bole:0x9a8a72,leaf:0x4a8a3a, g:['tropic','savanna','grass'], wt:0.8},
neem     :{form:'round',bole:0x7a6a52, leaf:0x3f7a34, g:['tropic','savanna','desert']},
camphor  :{form:'round',bole:0x7a6a58, leaf:0x3a7a3a, h:1.1, g:['tropic','grass']},
cinnamon :{form:'round',bole:0x8a6a4a, leaf:0x3a7a34, h:0.8, g:['tropic']},
clove    :{form:'round',bole:0x6a5238, leaf:0x2a6a2a, fruit:0x8a2a1a, h:0.8, g:['tropic']},
nutmeg   :{form:'round',bole:0x6a5238, leaf:0x2a6a2a, fruit:0xc8a050, h:0.8, g:['tropic']},
sandalwood:{form:'round',bole:0x9a8a6a,leaf:0x5a8a4a, h:0.7, g:['tropic','savanna']},
mangrove :{riv:true, form:'mangrove',bole:0x6a5238,leaf:0x2e6a3a, g:['tropic','sand','savanna'], wt:1.2},
treefern :{form:'fern', bole:0x6a5a42, leaf:0x3f8a3a, g:['tropic','grass'], wt:1.2},
bamboo   :{form:'bamboo',bole:0xc8c060, leaf:0x6aa83a, g:['tropic','grass','alpine'], wt:1.4},

/* ---- THE PLAIN OF THE SOUTH ---- */
acacia   :{form:'thorn', bole:0x6a5236, leaf:0x6f9a4a, g:['savanna','desert','grass'], wt:2.0},
umbrellathorn:{form:'thorn',bole:0x7a6242,leaf:0x7aa050, w:1.3, g:['savanna','desert']},
baobab   :{form:'baobab',bole:0x9a8a72, leaf:0x5a8a3a, fruit:0x8a7a4a, g:['savanna'], wt:0.7},
marula   :{form:'round', bole:0x8a7a62, leaf:0x5a8a3a, fruit:0xd8c860, g:['savanna']},
shea     :{form:'round', bole:0x6a5a42, leaf:0x5a8a3a, fruit:0x8a6a3a, g:['savanna']},
sausagetree:{form:'round',bole:0x7a6a52,leaf:0x4a8a3a, fruit:0x6a5a30, fn:3, fs:0.5, g:['savanna']},
argan    :{form:'round', bole:0x8a7a5a, leaf:0x7a9a5a, fruit:0xc8a838, h:0.7, g:['desert','savanna']},
tamarisk :{wet:true, form:'round', bole:0x8a7a62, leaf:0x8aa080, h:0.7, g:['desert','sand','badlands','savanna']},
frankincense:{form:'shrub',leaf:0x8aa07a, h:0.8, g:['desert','badlands','rock']},
myrrh    :{form:'shrub', leaf:0x8a9a72, h:0.7, g:['desert','badlands','rock']},

/* ---- THE DRY COUNTRY OF THE NEW WORLD ---- */
saguaro  :{form:'cactus',bole:0x3f6a3a, leaf:0x3f6a3a, fruit:0xc02828, g:['desert','badlands'], wt:1.2},
joshua   :{form:'cactus',bole:0x5a5a3a, leaf:0x4a6a3a, h:0.8, g:['desert','badlands']},
pricklypear:{form:'pad', leaf:0x5a8a4a, fruit:0xc02850, g:['desert','badlands','sand','savanna']},
agave    :{form:'rosette',leaf:0x7aa07a, flower:0xd8c84a, bole:0x8a7a4a, g:['desert','badlands','rock']},
aloe     :{form:'rosette',leaf:0x6a9a6a, flower:0xd85a2a, bole:0x7a6a3a, h:0.5, g:['desert','savanna','rock','badlands']},
yucca    :{form:'rosette',leaf:0x6a8a5a, flower:0xf0f0e0, bole:0x8a7a5a, g:['desert','badlands']},
mesquite :{form:'thorn', bole:0x5a4630, leaf:0x6a9a4a, h:0.65, g:['desert','badlands','savanna']},
creosote :{form:'shrub', leaf:0x5a7a3a, flower:0xd8c83a, g:['desert','badlands']},
sagebrush:{form:'shrub', leaf:0x9aa08a, g:['desert','badlands','grass']},
saltbush :{form:'shrub', leaf:0xa0a894, g:['desert','badlands','sand']},
quebracho:{form:'broad', bole:0x5a3a28, leaf:0x4a7a34, g:['savanna','grass']},
algarrobo:{form:'thorn', bole:0x6a5238, leaf:0x6a9a4a, g:['savanna','desert','grass']},

/* ---- THE GREAT SOUTH LAND ---- */
eucalyptus:{form:'gum', bole:0xc8c0b0, leaf:0x7a9a72, g:['grass','savanna','alpine'], wt:1.8},
ghostgum :{form:'gum', bole:0xe8e4d8, leaf:0x8aa87a, g:['savanna','desert','grass']},
wattle   :{form:'thorn',bole:0x6a5a42, leaf:0x8aa84a, fruit:0xe8c828, fn:8, fs:0.2, h:0.7, g:['grass','savanna','desert']},
banksia  :{form:'round',bole:0x7a6a52, leaf:0x6a8a5a, fruit:0xc8a030, h:0.7, g:['grass','sand','savanna']},
bottlebrush:{form:'shrub',leaf:0x4a7a3a, flower:0xc82828, g:['grass','savanna']},
mallee   :{form:'shrub', leaf:0x8a9a72, g:['desert','badlands','savanna','grass']},
spinifex :{form:'herb',  leaf:0xc0b060, g:['desert','badlands','sand','savanna']},
pohutukawa:{form:'spread',props:true, bole:0x7a6a52,leaf:0x3a6a3a, fruit:0xc02828, h:0.9, g:['grass','sand']},
kowhai   :{form:'round', bole:0x7a6a52, leaf:0x5a8a4a, fruit:0xe8c020, h:0.7, g:['grass']},
macadamia:{form:'round', bole:0x6a5238, leaf:0x3a7a34, fruit:0x8a7a5a, h:0.7, g:['grass','tropic']},

/* ---- THE COLD AND THE ICE ---- */
dwarfbirch:{form:'shrub', leaf:0x8aa84a, h:0.5, g:['tundra','alpine','snow']},
arcticwillow:{form:'shrub',leaf:0x9ab070, h:0.4, g:['tundra','alpine','snow']},
crowberry:{form:'shrub', leaf:0x4a6a44, fruit:0x1a1a2a, h:0.35, g:['tundra','alpine','snow']},
cloudberry:{form:'herb', leaf:0x5a8a4a, flower:0xe8a838, h:0.4, g:['tundra','alpine']},
lingonberry:{form:'shrub',leaf:0x3a6a34, fruit:0xc02828, h:0.35, g:['tundra','alpine','grass']},
bilberry :{form:'shrub', leaf:0x4a7a3a, fruit:0x3a3a6a, h:0.4, g:['tundra','alpine','grass']},
reindeermoss:{form:'herb',leaf:0xc8ccc0, h:0.3, g:['tundra','snow','rock','alpine']},
lichen   :{form:'herb',  leaf:0xb8c0a8, h:0.25, g:['tundra','snow','rock','alpine']},
cottongrass:{form:'herb',leaf:0x8a9a6a, flower:0xf0f0ea, h:0.6, g:['tundra','grass','alpine']},

/* ---- THE BERRY AND THE BUSH ---- */
bramble  :{form:'shrub', leaf:0x3a6a2e, fruit:0x2a1030, g:['grass','tropic','alpine'], wt:1.4},
raspberry:{form:'shrub', leaf:0x4a7a3a, fruit:0xc03050, g:['grass','alpine']},
blueberry:{form:'shrub', leaf:0x4a7a44, fruit:0x3a4a8a, h:0.5, g:['grass','alpine','tundra']},
cranberry:{wet:true, form:'shrub', leaf:0x3a6a3a, fruit:0xc02020, h:0.35, g:['grass','tundra']},
gooseberry:{form:'shrub',leaf:0x4a7a3a, fruit:0x9ac04a, h:0.5, g:['grass']},
currant  :{form:'shrub', leaf:0x4a7a3a, fruit:0x8a1020, h:0.55, g:['grass','alpine']},
elderberry:{form:'shrub',leaf:0x3f7a34, fruit:0x201028, h:1.1, g:['grass']},
hawthorn :{form:'shrub', leaf:0x3a6a2e, fruit:0xb02818, h:1.0, g:['grass','alpine']},
blackthorn:{form:'shrub',leaf:0x3a6a2e, fruit:0x3a2a5a, h:0.9, g:['grass']},
hazel    :{form:'shrub', leaf:0x4a8a34, fruit:0x8a6a3a, h:1.2, g:['grass']},
gorse    :{form:'shrub', leaf:0x4a6a30, flower:0xe8c020, g:['grass','alpine','sand']},
broom    :{form:'shrub', leaf:0x5a7a34, flower:0xe8c828, g:['grass','alpine','sand']},
heather  :{form:'shrub', leaf:0x6a7a4a, flower:0xa04a8a, h:0.4, g:['grass','tundra','alpine','rock']},
rhododendron:{form:'shrub',leaf:0x2e6a30,flower:0xc04a8a, h:1.1, g:['grass','alpine','tropic']},
azalea   :{form:'shrub', leaf:0x3a7a3a, flower:0xe07aa0, h:0.6, g:['grass','alpine']},
boxwood  :{form:'shrub', leaf:0x2e6a2e, h:0.5, g:['grass','alpine']},
hibiscus :{form:'shrub', leaf:0x3a7a3a, flower:0xd8384a, g:['tropic','sand','savanna']},
cotton   :{form:'shrub', leaf:0x4a7a3a, fruit:0xf0f0ea, h:0.6, g:['grass','savanna','tropic']},
cassava  :{form:'shrub', leaf:0x5a9a3a, h:0.9, g:['tropic','savanna']},

/* ---- THE HERB YIELDING SEED ---- */
wheat    :{form:'herb', leaf:0xd8c060, h:1.0, g:['grass','savanna'], wt:1.6},
barley   :{form:'herb', leaf:0xd8c878, h:0.95, g:['grass','tundra','alpine','desert'], wt:1.4},
rye      :{form:'herb', leaf:0xc8bc70, h:1.2, g:['grass','tundra']},
oats     :{form:'herb', leaf:0xd0c880, h:0.95, g:['grass','tundra']},
rice     :{riv:true, form:'herb', leaf:0x8ac04a, h:0.8, g:['tropic','grass','savanna'], wt:1.4},
maize    :{form:'herb', leaf:0x6aa83a, flower:0xd8c060, h:1.4, g:['grass','tropic','savanna']},
millet   :{form:'herb', leaf:0xc8b850, h:1.0, g:['savanna','desert','grass']},
sorghum  :{form:'herb', leaf:0xb8a848, flower:0x9a6a30, h:1.3, g:['savanna','desert','grass']},
quinoa   :{form:'herb', leaf:0x7a9a4a, flower:0xc04a2a, h:0.9, g:['alpine','grass','rock']},
potato   :{form:'herb', leaf:0x4a7a3a, flower:0xd0c8e0, h:0.6, g:['alpine','grass']},
tomato   :{form:'herb', leaf:0x4a7a3a, flower:0xc82820, h:0.7, g:['grass','tropic']},
flax     :{form:'herb', leaf:0x7a9a6a, flower:0x7a9ad8, h:0.8, g:['grass']},
hemp     :{form:'herb', leaf:0x5a9a4a, h:1.3, g:['grass','tropic']},
tobacco  :{form:'herb', leaf:0x6a9a4a, flower:0xe8b0c0, h:1.1, g:['grass','tropic','savanna']},
sunflower:{form:'herb', leaf:0x5a8a3a, flower:0xe8c020, h:1.5, g:['grass','savanna']},
turmeric :{form:'herb', leaf:0x5aa03a, flower:0xe8b830, h:0.8, g:['tropic']},
taro     :{riv:true, form:'herb', leaf:0x4a9a4a, h:0.9, g:['tropic','sand']},
pineapple:{form:'rosette',leaf:0x6a9a4a, flower:0xd8b02a, bole:0x7a8a4a, h:0.5, g:['tropic','savanna']},
sugarcane:{wet:true, form:'cane', bole:0x9a8a4a, leaf:0x8ac04a, flower:0xc8d08a, h:1.6, g:['tropic','savanna','grass']},
papyrus  :{riv:true, form:'cane', bole:0x8a9a52, leaf:0x7aa83a, flower:0x9ab84a, h:1.5, g:['tropic','savanna','desert','grass']},
reed     :{riv:true, form:'cane', bole:0x9a8a6a, leaf:0x8aa060, flower:0x9a8a6a, h:1.1, g:['grass','tundra','tropic','savanna']},
bulrush  :{riv:true, form:'cane', bole:0x7a8a4a, leaf:0x6a9a4a, flower:0x5a3a20, h:1.2, g:['grass','tundra','tropic']},
lavender :{form:'herb', leaf:0x8a9a7a, flower:0x8a6ac0, h:0.6, g:['grass','desert','alpine']},
rosemary :{form:'herb', leaf:0x6a8a6a, flower:0x7a8ac0, h:0.6, g:['grass','desert','rock']},
thyme    :{form:'herb', leaf:0x7a8a5a, flower:0xb07ac0, h:0.4, g:['grass','desert','rock','alpine']},
sage     :{form:'herb', leaf:0x9aa88a, flower:0x9a7ac0, h:0.55, g:['grass','desert','alpine']},
mint     :{wet:true, form:'herb', leaf:0x4a9a5a, h:0.5, g:['grass','tropic']},
hyssop   :{form:'herb', leaf:0x7a9a6a, flower:0x6a5ac0, h:0.6, g:['grass','desert','rock']},
coriander:{form:'herb', leaf:0x6a9a5a, flower:0xf0f0e0, h:0.5, g:['grass','desert']},
cumin    :{form:'herb', leaf:0x8a9a6a, flower:0xe0e0c0, h:0.5, g:['desert','grass']},
saffron  :{form:'herb', leaf:0x6a8a5a, flower:0x8a4ac0, h:0.35, g:['grass','desert','alpine']},
poppy    :{form:'herb', leaf:0x6a8a4a, flower:0xc82020, h:0.6, g:['grass','desert']},
thistle  :{form:'herb', leaf:0x7a8a5a, flower:0x9a5aa0, h:0.8, g:['grass','desert','savanna','badlands','alpine']},
tulip    :{form:'herb', leaf:0x5a8a4a, flower:0xc82848, h:0.5, g:['grass','alpine']},
gentian  :{form:'herb', leaf:0x5a8a4a, flower:0x2a4ac0, h:0.35, g:['alpine','rock','tundra']},
clover   :{form:'herb', leaf:0x4a8a3a, flower:0xe0e0f0, h:0.35, g:['grass','alpine'], wt:1.4},
nettle   :{wet:true, form:'herb', leaf:0x3a7a34, h:0.7, g:['grass','tropic']},
fern     :{form:'herb', leaf:0x3a7a3a, h:0.8, g:['grass','tropic','alpine'], wt:1.4},
moss     :{form:'herb', leaf:0x4a8a4a, h:0.25, g:['grass','tropic','tundra','alpine','rock']},
lotus    :{riv:true, form:'herb', leaf:0x4a8a4a, flower:0xf0a8c8, h:0.5, g:['tropic','savanna','grass']},
waterlily:{riv:true, form:'herb', leaf:0x4a8a4a, flower:0xf0f0f0, h:0.3, g:['tropic','grass']},
/* ---- AND THE HEAVY TIMBER ----
   The dark oak, whose canopy comes down to the ground and puts the wood
   beneath it in shadow; the jungle giant, bare for six of its seven parts;
   and the rest of the great boles men have always cut for building. */
darkoak  :{form:'darkoak',bole:0x3e2c1c, leaf:0x2a5c22, g:['grass','alpine'], wt:0.8},
jungle   :{form:'jungle', bole:0x6a5236, leaf:0x2e7a26, g:['tropic'], wt:1.2},
sycamore :{form:'broad',  bole:0x9a8a72, leaf:0x4a8434, h:1.2, w:1.15, g:['grass','alpine']},
planetree:{wet:true, form:'broad',  bole:0xd0c8b8, leaf:0x5a9038, h:1.2, g:['grass']},
sweetgum :{form:'round',  bole:0x6a5238, leaf:0xc0603a, g:['grass','tropic']},
mopane   :{form:'thorn',  bole:0x6a5238, leaf:0x7a9a48, h:0.8, g:['savanna','desert']},
ironwood :{form:'broad',  bole:0x4a3a2c, leaf:0x2e6a2a, h:1.1, g:['tropic','grass']},
rosewood :{form:'spread', bole:0x7a3a2a, leaf:0x2e6a2e, h:1.3, g:['tropic'], wt:0.7},
tamboti  :{form:'round',  bole:0x5a4630, leaf:0x5a8a3a, h:0.8, g:['savanna','tropic']},
blackwood:{form:'thorn',  bole:0x3e3228, leaf:0x6a8a52, h:0.9, g:['grass','savanna']},

/* ---- THE WASTE OF THE EAST ----
   From Persia to the Gobi is not the Sahara and does not grow like it. It is
   a COLD waste: salt pan, gravel and clay under a bitter wind, and what
   holds on there is the saxaul, the camel thorn, the wormwood and the
   feather grass — and the tumbleweed, which lets go in the autumn and rolls
   till something stops it. (Before this, the eastern deserts were given
   whatever the climate table had, which was the AMERICAN waste: there were
   saguaro cactus in Mongolia and prickly pear in Syria.) */
camelthorn:{form:'shrub', leaf:0x8a9a62, flower:0xc8a83a, h:0.7, g:['desert','badlands','sand','savanna']},
wormwood :{form:'shrub', leaf:0xa8ac96, h:0.5, g:['desert','badlands','grass','rock']},
ephedra  :{form:'shrub', leaf:0x7a8a5a, fruit:0xc03828, h:0.6, g:['desert','badlands','rock','alpine']},
feathergrass:{form:'herb',leaf:0xd8cca0, flower:0xefe8d0, h:0.9, g:['desert','grass','badlands','alpine']},
tumbleweed:{form:'shrub',leaf:0xc4b48a, h:0.55, w:1.2, g:['desert','badlands','sand','grass']},
desertpoplar:{form:'round',bole:0xa89878, leaf:0xc8c060, h:0.9, wet:true, g:['desert','sand','badlands']},
/* ---- AND THE WASTE OF ARABIA ----
   The ghaf and the sidr are the two trees a man of the desert knows by name;
   the colocynth is the wild gourd of the wilderness; the desert rose and the
   dragon's blood are of Arabia Felix and the isle of Socotra and nowhere
   else on the earth. */
ghaf     :{form:'thorn', bole:0x7a6a4a, leaf:0x8aa060, h:0.8, g:['desert','sand','badlands']},
sidr     :{form:'round', bole:0x8a7a5a, leaf:0x6a9a4a, fruit:0xc8a030, h:0.7, g:['desert','sand','savanna','badlands']},
colocynth:{form:'herb',  leaf:0x7a9a4a, fruit:0xc8d060, h:0.35, g:['desert','sand','badlands']},
desertrose:{form:'shrub',leaf:0x6a8a5a, flower:0xd8486a, h:0.6, g:['desert','rock','badlands']},
dragonblood:{form:'spread',bole:0x8a7a62,leaf:0x4a7a4a, h:0.7, w:0.9, g:['rock','desert','badlands'], wt:0.4},
whitebroom:{form:'shrub', leaf:0xa8b08a, flower:0xf0eee4, h:0.7, g:['desert','sand','badlands','rock']},
/* ---- AND OF THE AMERICAN AND THE AUSTRALIAN WASTE ---- */
ocotillo :{form:'rosette',leaf:0x6a7a44, flower:0xc82828, bole:0x6a5a3a, h:1.6, g:['desert','badlands','rock']},
barrelcactus:{form:'shrub',leaf:0x5a8a44, flower:0xd8b02a, h:0.5, g:['desert','badlands','rock']},
mulga    :{form:'thorn', bole:0x5a4a34, leaf:0x8a9a68, h:0.65, g:['desert','badlands','savanna','sand']},
desertoak:{form:'column',bole:0x6a5a44, leaf:0x5a6a4a, h:1.1, g:['desert','sand','badlands']},

/* ---- THE FLOWERS OF THE TUNDRA ----
   Nothing there stands above the knee and everything there flowers, hard and
   all at once, in the six weeks it has. The arctic poppy turns its cup to
   follow the sun round the whole sky; the saxifrage grows out of bare rock
   and is the northernmost flowering thing on the earth; the fireweed comes
   up purple over any ground that has been burnt or broken. */
arcticpoppy:{form:'herb', leaf:0x7a8a5a, flower:0xf0d84a, h:0.4, g:['tundra','snow','alpine','rock']},
saxifrage:{form:'herb', leaf:0x6a8a5a, flower:0xe8b0c8, h:0.3, g:['tundra','snow','alpine','rock']},
mosscampion:{form:'herb',leaf:0x5a8a4a, flower:0xd06a9a, h:0.28, g:['tundra','alpine','rock','snow']},
fireweed :{form:'herb', leaf:0x6a9a5a, flower:0xc04a8a, h:1.0, g:['tundra','grass','alpine']},
bearberry:{form:'shrub',leaf:0x4a7a44, fruit:0xc02828, h:0.3, g:['tundra','snow','alpine','rock','grass']},
labradortea:{form:'shrub',leaf:0x5a7a52, flower:0xf0eee6, h:0.45, g:['tundra','snow','alpine']},

/* ---- THE PLANTS OF THE WATER'S EDGE ----
   These grow on a river bank and nowhere else on the earth. Name them in a
   country and they will be met only where its rivers run. */
watercress:{form:'herb', leaf:0x4a9a4a, flower:0xf0f0e8, h:0.35, riv:true, g:['grass','tropic','alpine','tundra']},
sedge    :{form:'cane', bole:0x7a8a52, leaf:0x6a9a4a, flower:0x8a7a52, h:0.8, riv:true, g:['grass','tundra','tropic','savanna','alpine']},

/* ---- AND THE REST OF WHAT MEN SOW AND GATHER ---- */
teff     :{form:'herb', leaf:0xc8b868, h:0.8, g:['grass','savanna','alpine']},
yam      :{form:'herb', leaf:0x4a8a3a, h:0.8, g:['tropic','savanna']},
vanilla  :{form:'herb', leaf:0x4a9a4a, flower:0xe8e0b0, h:0.7, g:['tropic']},
pepper   :{form:'herb', leaf:0x3a7a34, fruit:0x2a1a14, h:0.9, g:['tropic']},
sesame   :{form:'herb', leaf:0x6a9a4a, flower:0xf0e8d8, h:0.8, g:['tropic','savanna','desert']},
jute     :{wet:true, form:'herb', leaf:0x6aa03a, h:1.2, g:['tropic','grass']},
ginseng  :{form:'herb', leaf:0x4a8a44, fruit:0xc02828, h:0.4, g:['grass','alpine']},
melon    :{form:'herb', leaf:0x6a9a4a, fruit:0x8ac04a, h:0.35, g:['desert','grass','sand']},
paprika  :{form:'herb', leaf:0x4a7a3a, fruit:0xc82818, h:0.6, g:['grass','savanna']},
hops     :{form:'herb', leaf:0x6a9a4a, flower:0xc8d88a, h:1.3, g:['grass']},
oregano  :{form:'herb', leaf:0x7a9a5a, flower:0xd0c0e0, h:0.4, g:['grass','desert','rock']},
edelweiss:{form:'herb', leaf:0x9aa88a, flower:0xf4f4ec, h:0.3, g:['alpine','rock']},
orchid   :{form:'herb', leaf:0x3a7a3a, flower:0xd07ac8, h:0.4, g:['tropic','alpine']},
kava     :{form:'shrub',leaf:0x4a8a44, h:0.8, g:['tropic','sand']},
rose     :{form:'shrub',leaf:0x3a6a2e, flower:0xd8486a, h:0.6, g:['grass','alpine']},
protea   :{form:'shrub',leaf:0x7a8a6a, flower:0xd8788a, h:0.8, g:['grass','savanna','rock']},
saxaul   :{form:'thorn',bole:0x9a8a6a, leaf:0x8a9a68, h:0.55, g:['desert','badlands','sand']},
pistachio:{form:'round',bole:0x8a7a5a, leaf:0x6a8a4a, fruit:0xc8b878, h:0.6, g:['desert','grass','badlands']},
holmoak  :{form:'broad',bole:0x6a5238, leaf:0x35682f, h:0.85, g:['grass','desert']},
yellowwood:{form:'conifer',bole:0x7a6a52,leaf:0x2e6a34, h:1.4, g:['grass','alpine','tropic']},
},


/* ============================================================
   AND WHERE THERE IS NO LIST — the climate's own growth. The
   uncharted isles of the deep, and any land not yet written.
   ============================================================ */
wilds:{
  grass  :['oak','darkoak','birch','pine','ash','hazel','bramble','fern','clover','wheat','poppy','nettle','moss',
           'willow','reed','bulrush','sedge','watercress'],
  tropic :['coconut','jungle','banana','mango','banyan','treefern','fern','moss','papaya','mangrove','rice',
           'sedge','lotus','taro'],
  savanna:['acacia','umbrellathorn','mopane','baobab','datepalm','sorghum','millet','aloe','thistle',
           'reed','papyrus','sedge','lotus'],
  /* THE FALLBACK MUST BE OF NO COUNTRY AT ALL. It stands under the uncharted
     isles and any land not yet written, and it used to be the American waste
     — so every desert on the earth without its own list grew saguaro. These
     four grow on every dry continent there is. */
  desert :['tamarisk','saltbush','thistle','tumbleweed','feathergrass','melon'],
  badlands:['tamarisk','saltbush','thistle','tumbleweed','wormwood'],
  sand   :['coconut','pandanus','mangrove','saltbush','tamarisk','thistle'],
  tundra :['dwarfbirch','arcticwillow','crowberry','lingonberry','lichen','reindeermoss','moss','cottongrass',
           'sedge','willow','reed','arcticpoppy','saxifrage','mosscampion','fireweed','bearberry','labradortea'],
  alpine :['pine','spruce','juniper','dwarfbirch','heather','moss','lichen','gentian','thyme'],
  rock   :['juniper','heather','lichen','moss','thyme','wormwood','ephedra','saxifrage','mosscampion'],
  /* even the snow is not bare: there is lichen on every stone that shows
     through it, and where the drift thins the poppy and the saxifrage come */
  snow   :['arcticwillow','lichen','reindeermoss','moss','arcticpoppy','saxifrage','mosscampion','bearberry','dwarfbirch'],
},

/* ============================================================
   THE LANDS, AND WHAT GROWS IN EACH
   Read each line as: the region's common growth, and these besides.
   ============================================================ */
lands:{

/* ---------------- AFRICA ---------------- */
'Kenya':SAVANNAH.concat(['coffee','tea','banana','maize','papyrus','fern','bamboo','mango']),
'Tanzania':SAVANNAH.concat(['coffee','banana','clove','coconut','mango','maize','fern','bamboo']),
'Uganda':SAVANNAH.concat(['coffee','banana','papyrus','mango','ceiba','fern','tea','maize']),
'Rwanda':['coffee','tea','banana','bamboo','fern','moss','maize','ceiba','treefern','sorghum'],
'Burundi':['coffee','tea','banana','bamboo','fern','maize','papyrus','sorghum','mango'],
'Ethiopia':SAVANNAH.concat(['coffee','frankincense','myrrh','barley','wheat','teff','juniper','aloe']),
'Eritrea':DESERTS.concat(['sorghum','millet','frankincense','aloe','acacia','doum']),
'Djibouti':DESERTS.concat(['frankincense','myrrh','doum','aloe','saltbush']),
'Somalia':DESERTS.concat(['frankincense','myrrh','doum','acacia','aloe','sorghum','banana','dragonblood']),
'Somaliland':DESERTS.concat(['frankincense','myrrh','acacia','aloe','sorghum']),
'S. Sudan':SAVANNAH.concat(['papyrus','sorghum','reed','mango','shea','acacia']),
'Sudan':DESERTS.concat(['sorghum','millet','papyrus','doum','acacia','mango','cotton']),
'Egypt':DESERTS.concat(['papyrus','datepalm','reed','bulrush','wheat','barley','fig','pomegranate','cumin','flax','lotus','waterlily',
  'colocynth','whitebroom','sidr','wormwood']),
'Libya':DESERTS.concat(['olive','fig','datepalm','barley','saltbush']),
'Tunisia':MEDIT.concat(['datepalm','fig','olive','pomegranate','cumin','tamarisk']),
'Algeria':MEDIT.concat(['datepalm','corkoak','cedar','fig','tamarisk','saltbush']),
'Morocco':MEDIT.concat(['argan','datepalm','cedar','orange','fig','saffron','tamarisk','mint','coriander']),
'W. Sahara':DESERTS.concat(['argan','saltbush','tamarisk']),
'Mauritania':DESERTS.concat(['acacia','doum','millet','saltbush']),
'Mali':SAVANNAH.concat(['shea','millet','sorghum','datepalm','mango','cotton','papyrus']),
'Niger':SAVANNAH.concat(['millet','sorghum','datepalm','doum','acacia','cotton']),
'Chad':SAVANNAH.concat(['millet','sorghum','datepalm','papyrus','acacia','cotton']),
'Senegal':SAVANNAH.concat(['baobab','millet','mango','cashew','oilpalm','cotton','rice']),
'Gambia':SAVANNAH.concat(['oilpalm','mango','cashew','rice','banana','baobab']),
'Guinea-Bissau':RAINFOREST.concat(['oilpalm','cashew','rice','mango','baobab']),
'Guinea':RAINFOREST.concat(['oilpalm','coffee','rice','mango','banana','teak']),
'Sierra Leone':RAINFOREST.concat(['oilpalm','cacao','coffee','rice','mango','ebony']),
'Liberia':RAINFOREST.concat(['rubber','oilpalm','cacao','coffee','ebony','mahogany']),
"Côte d'Ivoire":RAINFOREST.concat(['cacao','coffee','oilpalm','rubber','mahogany','teak','yam']),
'Ghana':RAINFOREST.concat(['cacao','oilpalm','shea','mahogany','rubber','maize']),
'Togo':RAINFOREST.concat(['cacao','oilpalm','shea','cotton','maize','teak']),
'Benin':SAVANNAH.concat(['oilpalm','cacao','shea','cotton','maize','mango','teak']),
'Burkina Faso':SAVANNAH.concat(['shea','millet','sorghum','cotton','mango','acacia']),
'Nigeria':RAINFOREST.concat(['oilpalm','cacao','yam','mahogany','ebony','sorghum','cotton','shea']),
'Cameroon':RAINFOREST.concat(['cacao','coffee','oilpalm','ebony','mahogany','banana','ceiba']),
'Central African Rep.':RAINFOREST.concat(['ebony','mahogany','coffee','cotton','sorghum','ceiba']),
'Eq. Guinea':RAINFOREST.concat(['cacao','coffee','oilpalm','mahogany','ebony']),
'Gabon':RAINFOREST.concat(['ebony','mahogany','oilpalm','rubber','ceiba','cacao']),
'Congo':RAINFOREST.concat(['ebony','mahogany','oilpalm','cacao','ceiba','rubber']),
'Dem. Rep. Congo':RAINFOREST.concat(['ebony','mahogany','oilpalm','rubber','coffee','cacao','ceiba','bamboo']),
'Angola':SAVANNAH.concat(['coffee','baobab','mahogany','cotton','maize','banana','sorghum']),
'Zambia':SAVANNAH.concat(['teak','baobab','maize','tobacco','cotton','mango','sausagetree']),
'Zimbabwe':SAVANNAH.concat(['teak','baobab','maize','tobacco','cotton','marula','aloe']),
'Malawi':SAVANNAH.concat(['tea','tobacco','maize','baobab','mango','banana']),
'Mozambique':SAVANNAH.concat(['cashew','coconut','mangrove','baobab','cotton','maize','mango']),
'Botswana':SAVANNAH.concat(['baobab','marula','mesquite','sorghum','aloe','saltbush']),
'Namibia':DESERTS.concat(['baobab','aloe','saltbush','marula','acacia','sorghum']),
'South Africa':['acacia','baobab','marula','mopane','tamboti','protea','grapevine','orange','olive','aloe','heather',
  'yellowwood','sorghum','maize','wheat','fern','saltbush'],
'Lesotho':ALPINE_P.concat(['maize','sorghum','wheat','aloe','thistle','clover']),
'eSwatini':SAVANNAH.concat(['sugarcane','maize','cotton','mango','marula','pineapple']),
'Madagascar':RAINFOREST.concat(['baobab','vanilla','clove','coffee','rice','banana','pandanus','treefern']),

/* ---------------- ASIA ---------------- */
'Russia':BOREAL.concat(['fir','aspen','oak','rye','oats','flax','sunflower','bilberry','elderberry',
  'arcticwillow','dwarfbirch','crowberry','cloudberry','arcticpoppy','saxifrage','mosscampion','fireweed','bearberry','labradortea','reindeermoss','lichen']),
'Kazakhstan':DESERT_ASIA.concat(['wheat','apple','poplar','birch','pine']),
'Uzbekistan':DESERT_ASIA.concat(['cotton','mulberry','apricot','grapevine','poplar','pistachio','wheat']),
'Turkmenistan':DESERT_ASIA.concat(['cotton','grapevine','poplar','pistachio','wheat']),
'Kyrgyzstan':ALPINE_P.concat(['walnut','apple','spruce','juniper','barley','poplar','tulip']),
'Tajikistan':ALPINE_P.concat(['apricot','mulberry','walnut','juniper','barley','poplar','cotton']),
'Mongolia':DESERT_ASIA.concat(['larch','pine','birch','lichen','heather','moss','poplar']),
'China':['bamboo','ginkgo','camphor','tea','rice','mulberry','peach','persimmon','pine','spruce',
  'cypress','wheat','cotton','hemp','lotus','waterlily','fern','moss','rhododendron','apple','pear','ginseng',
  /* and the Gobi and the Taklamakan, which are also China */
  'saxaul','tamarisk','desertpoplar','camelthorn','wormwood','ephedra','feathergrass',
  'tumbleweed','saltbush','juniper','melon','thistle'],
'Taiwan':['bamboo','camphor','tea','rice','banana','pineapple','mango','treefern','fern','sugarcane','moss'],
'North Korea':['pine','oak','birch','maple','rice','ginseng','fern','moss','barley','apple'],
'South Korea':['pine','oak','maple','bamboo','rice','tea','persimmon','apple','fern','moss','azalea'],
'Japan':['cedar','cherry','bamboo','maple','pine','tea','rice','persimmon','plum','azalea','fern','moss','ginkgo','camphor'],
'Nepal':ALPINE_P.concat(['rhododendron','pine','fir','bamboo','rice','tea','barley','maize','fern']),
'Bhutan':ALPINE_P.concat(['rhododendron','fir','pine','bamboo','rice','maize','fern','moss']),
'India':MONSOON.concat(['sal','sandalwood','cotton','tea','turmeric','pepper','mangrove','lotus','papaya',
  /* and the Thar, which is also India */
  'acacia','sidr','ghaf','camelthorn','tamarisk','colocynth','saltbush','thistle','neem','datepalm']),
'Pakistan':DESERT_ASIA.concat(['cotton','wheat','sugarcane','mango','datepalm','orange','acacia','sidr','neem']),
'Bangladesh':MONSOON.concat(['mangrove','jute','rice','jackfruit','banana','tea','papaya']),
'Sri Lanka':MONSOON.concat(['cinnamon','tea','rubber','coconut','clove','nutmeg','pepper','banyan']),
'Myanmar':MONSOON.concat(['teak','bamboo','rubber','sesame','banyan','mangrove','jackfruit']),
'Thailand':MONSOON.concat(['rubber','durian','mangosteen','rambutan','longan','lime','teak','pineapple','mangrove']),
'Laos':MONSOON.concat(['teak','bamboo','coffee','rubber','banana','jackfruit']),
'Cambodia':MONSOON.concat(['rubber','banyan','mangrove','jackfruit','pineapple','sugarcane']),
'Vietnam':MONSOON.concat(['coffee','rubber','rice','lychee','longan','mangrove','bamboo','tea']),
'Malaysia':RAINFOREST.concat(['oilpalm','rubber','durian','rambutan','mangosteen','starfruit','areca','mangrove','sago']),
'Brunei':RAINFOREST.concat(['oilpalm','rubber','durian','sago','mangrove','areca']),
'Indonesia':RAINFOREST.concat(['oilpalm','rubber','clove','nutmeg','coffee','durian','sago','mangrove','rice','teak']),
'Timor-Leste':RAINFOREST.concat(['coffee','sandalwood','coconut','maize','mangrove']),
'Philippines':RAINFOREST.concat(['coconut','rice','sugarcane','mango','banana','mangrove','bamboo','pineapple','starfruit']),
'Afghanistan':DESERT_ASIA.concat(['grapevine','pomegranate','almond','apricot','mulberry','saffron','poplar','pistachio','wheat']),
'Iran':DESERT_ASIA.concat(['pistachio','pomegranate','datepalm','grapevine','saffron','walnut','cypress','wheat','fig','papyrus']),
'Iraq':DESERTS.concat(['datepalm','reed','papyrus','wheat','barley','pomegranate','fig','tamarisk']),
'Syria':MEDIT.concat(['datepalm','pistachio','cotton','wheat','apricot','tamarisk',
  'whitebroom','colocynth','camelthorn','saltbush','wormwood','thistle']),
'Lebanon':MEDIT.concat(['cedar','apple','cherry','pine','oak','grapevine','hyssop','whitebroom','wormwood']),
'Yasharal':MEDIT.concat(['datepalm','fig','pomegranate','olive','grapevine','wheat','barley','hyssop','tamarisk','almond','myrrh','frankincense',
  /* and the WILDERNESS of it, which is half the land: the shittah tree, the
     broom Aliyahu lay down under, the wild gourds of the pot, the lote */
  'acacia','whitebroom','colocynth','sidr','camelthorn','saltbush','thistle','wormwood']),
'Yahudah':MEDIT.concat(['datepalm','fig','pomegranate','olive','grapevine','wheat','barley','hyssop','almond','tamarisk','myrrh',
  'acacia','whitebroom','colocynth','sidr','camelthorn','saltbush','thistle','wormwood']),
'Jordan':DESERTS.concat(['olive','fig','grapevine','datepalm','pomegranate','hyssop','tamarisk','wheat',
  'whitebroom','colocynth','sidr','wormwood']),
'Saudi Arabia':DESERTS.concat(['datepalm','frankincense','myrrh','acacia','tamarisk','coffee','aloe']),
'Yemen':DESERTS.concat(['coffee','frankincense','myrrh','datepalm','acacia','aloe','sorghum','dragonblood','desertrose']),
'Oman':DESERTS.concat(['frankincense','datepalm','mango','acacia','aloe','banana','ghaf','sidr','desertrose']),
'United Arab Emirates':DESERTS.concat(['datepalm','mangrove','acacia','ghaf','sidr','desertrose']),
'Qatar':DESERTS.concat(['datepalm','mangrove','saltbush','acacia']),
'Kuwait':DESERTS.concat(['datepalm','saltbush','tamarisk','acacia']),
'Turkey':MEDIT.concat(['hazel','apricot','fig','walnut','cherry','quince','cotton','cedar','pine','oak','tea']),
'Cyprus':MEDIT.concat(['carob','cypress','pine','orange','grapevine','almond']),
'N. Cyprus':MEDIT.concat(['carob','cypress','pine','orange','grapevine']),
'Georgia':TEMPERATE.concat(['grapevine','tea','hazel','walnut','spruce','fir','rhododendron','orange']),
'Armenia':TEMPERATE.concat(['apricot','grapevine','walnut','pomegranate','oak','juniper','wheat']),
'Azerbaijan':TEMPERATE.concat(['pomegranate','grapevine','hazel','tea','cotton','wheat','saffron']),

/* ---------------- EUROPE ---------------- */
'Norway':BOREAL.concat(['cloudberry','heather','moss','oats','arcticwillow','aspen','arcticpoppy','saxifrage','mosscampion','fireweed','bearberry','dwarfbirch','crowberry','labradortea']),
'Sweden':BOREAL.concat(['oak','beech','cloudberry','moss','oats','rye','aspen','fireweed','bearberry','crowberry','labradortea','dwarfbirch']),
'Finland':BOREAL.concat(['cloudberry','moss','lingonberry','rye','oats','aspen','fireweed','bearberry','crowberry','labradortea','dwarfbirch']),
'Iceland':TUNDRA.concat(['birch','arcticwillow','moss','lichen','barley','heather','arcticpoppy','saxifrage','fireweed']),
'Denmark':TEMPERATE.concat(['beech','spruce','rye','barley','wheat','clover','heather']),
'Estonia':BOREAL.concat(['oak','aspen','rye','flax','bilberry','moss']),
'Latvia':BOREAL.concat(['oak','aspen','rye','flax','bilberry','moss']),
'Lithuania':BOREAL.concat(['oak','ash','rye','flax','bilberry','elderberry']),
'Belarus':BOREAL.concat(['oak','hornbeam','rye','flax','potato','bilberry','elderberry']),
'Poland':TEMPERATE.concat(['spruce','pine','rye','potato','bilberry','hornbeam','apple']),
'Ukraine':TEMPERATE.concat(['sunflower','wheat','rye','hemp','poplar','oak','apple','cherry','grapevine']),
'Moldova':TEMPERATE.concat(['grapevine','walnut','sunflower','wheat','plum','apple']),
'Romania':TEMPERATE.concat(['spruce','fir','grapevine','plum','sunflower','maize','walnut']),
'Bulgaria':TEMPERATE.concat(['grapevine','rose','sunflower','plum','walnut','fir','tobacco']),
'Serbia':TEMPERATE.concat(['plum','grapevine','maize','walnut','raspberry','fir']),
'Kosovo':TEMPERATE.concat(['plum','grapevine','maize','walnut','fir']),
'North Macedonia':MEDIT.concat(['tobacco','grapevine','plum','walnut','pine','apple']),
'Albania':MEDIT.concat(['olive','grapevine','fig','chestnut','pine','beech']),
'Montenegro':MEDIT.concat(['olive','grapevine','fig','beech','pine','pomegranate']),
'Bosnia and Herz.':TEMPERATE.concat(['plum','beech','spruce','grapevine','fir','raspberry']),
'Croatia':MEDIT.concat(['beech','fir','grapevine','olive','fig','lavender','rosemary']),
'Slovenia':TEMPERATE.concat(['beech','spruce','fir','grapevine','apple','hops']),
'Hungary':TEMPERATE.concat(['grapevine','wheat','maize','sunflower','apricot','poplar','paprika']),
'Slovakia':TEMPERATE.concat(['spruce','fir','grapevine','plum','maize','bilberry']),
'Czechia':TEMPERATE.concat(['spruce','pine','barley','rye','apple','plum','bilberry']),
'Austria':TEMPERATE.concat(['spruce','fir','larch','apple','grapevine','gentian','edelweiss']),
'Switzerland':TEMPERATE.concat(['spruce','fir','larch','gentian','apple','grapevine','clover']),
'Germany':TEMPERATE.concat(['spruce','pine','beech','apple','grapevine','rye','potato','heather']),
'Netherlands':TEMPERATE.concat(['tulip','willow','reed','bulrush','wheat','potato','clover','poplar']),
'Belgium':TEMPERATE.concat(['beech','poplar','wheat','potato','apple','clover']),
'Luxembourg':TEMPERATE.concat(['beech','spruce','grapevine','apple','wheat']),
'France':TEMPERATE.concat(['grapevine','lavender','chestnut','walnut','planetree','poplar','sunflower','olive','plum','apple','cypress']),
'Spain':MEDIT.concat(['orange','lemon','corkoak','saffron','almond','wheat','sunflower','holmoak']),
'Portugal':MEDIT.concat(['corkoak','orange','grapevine','olive','pine','fig','almond']),
'Italy':MEDIT.concat(['grapevine','olive','cypress','stonepine','lemon','orange','chestnut','beech','fir','tomato']),
'Greece':MEDIT.concat(['olive','grapevine','fig','cypress','stonepine','pomegranate','thyme','oregano']),
'United Kingdom':TEMPERATE.concat(['heather','gorse','blackthorn','yew','apple','wheat','barley','bilberry','moss']),
'Ireland':TEMPERATE.concat(['heather','gorse','blackthorn','moss','clover','oats','potato','willow']),

/* ---------------- THE AMERICAS ---------------- */
'Greenland':TUNDRA.concat(['arcticwillow','dwarfbirch','moss','lichen','crowberry','arcticpoppy','saxifrage','mosscampion']),
'Canada':BOREAL.concat(['sugarmaple','fir','douglasfir','hemlock','aspen','cranberry','blueberry','wheat','oats','cottongrass',
  'arcticwillow','dwarfbirch','crowberry','cloudberry','arcticpoppy','saxifrage','fireweed','bearberry','labradortea','reindeermoss','lichen']),
'United States of America':TEMPERATE.concat(['sugarmaple','sweetgum','planetree','hickory','pecan','redwood','sequoia','douglasfir',
  'saguaro','joshua','pricklypear','barrelcactus','ocotillo','creosote','sagebrush','agave','mesquite','yucca','cottonwood','maize','cotton','tobacco',
  'blueberry','magnolia','baldcypress','hemlock','grapefruit','bulrush']),
'Mexico':DESERT_AMER.concat(['maize','avocado','cacao','vanilla','lime',
  'pine','oak','tomato','coffee','banana','mango','papaya']),
'Guatemala':RAINFOREST.concat(['coffee','maize','avocado','cacao','banana','ceiba','pine']),
'Belize':RAINFOREST.concat(['mahogany','cacao','banana','coconut','mangrove','ceiba']),
'Honduras':RAINFOREST.concat(['coffee','banana','mahogany','pine','cacao','maize']),
'El Salvador':RAINFOREST.concat(['coffee','maize','banana','ceiba','sugarcane']),
'Nicaragua':RAINFOREST.concat(['coffee','banana','mahogany','maize','cacao','ceiba']),
'Costa Rica':RAINFOREST.concat(['coffee','banana','pineapple','cacao','ceiba','treefern','orchid']),
'Panama':RAINFOREST.concat(['banana','coffee','cacao','mahogany','ceiba','mangrove','pineapple']),
'Colombia':RAINFOREST.concat(['coffee','banana','sugarcane','cacao','ceiba','quinoa','potato','orchid']),
'Venezuela':RAINFOREST.concat(['cacao','coffee','maize','sugarcane','mangrove','ceiba','mango']),
'Guyana':RAINFOREST.concat(['sugarcane','rice','mahogany','ceiba','mangrove','brazilnut']),
'Suriname':RAINFOREST.concat(['sugarcane','rice','mahogany','ceiba','mangrove','brazilnut']),
'Ecuador':RAINFOREST.concat(['cacao','banana','coffee','quinoa','potato','ceiba','sugarcane']),
'Peru':RAINFOREST.concat(['quinoa','potato','maize','coffee','cacao','brazilnut','ceiba','rubber']),
'Bolivia':RAINFOREST.concat(['quinoa','potato','coffee','brazilnut','rubber','maize','algarrobo']),
'Brazil':RAINFOREST.concat(['brazilnut','rubber','coffee','sugarcane','cacao','ceiba','mahogany','araucaria','maize','cashew']),
'Paraguay':['quebracho','algarrobo','maize','sugarcane','cotton','tea','datepalm','thistle','fern','mango'],
'Uruguay':TEMPERATE.concat(['algarrobo','wheat','maize','sunflower','grapevine','thistle','clover']),
'Argentina':['algarrobo','quebracho','araucaria','wheat','maize','sunflower','grapevine','thistle',
  'poplar','willow','clover','saltbush','pricklypear','barrelcactus','quinoa','feathergrass'],
'Chile':['araucaria','podocarp','grapevine','wheat','potato','quinoa','saltbush','pricklypear',
  'barrelcactus','ocotillo','moss','fern','lichen','tumbleweed'],
'Cuba':ISLES.concat(['sugarcane','tobacco','coffee','mahogany','mangrove','pineapple']),
'Haiti':ISLES.concat(['coffee','sugarcane','mango','mahogany','maize']),
'Dominican Rep.':ISLES.concat(['sugarcane','cacao','coffee','mahogany','mango','tobacco']),
'Jamaica':ISLES.concat(['sugarcane','coffee','banana','mahogany','pineapple','mango']),
'Puerto Rico':ISLES.concat(['sugarcane','coffee','mango','ceiba','pineapple']),
'Bahamas':ISLES.concat(['mangrove','coconut','pandanus','pineapple','saltbush']),
'Trinidad and Tobago':ISLES.concat(['cacao','sugarcane','coconut','mangrove','ceiba']),
'Falkland Is.':TUNDRA.concat(['heather','moss','lichen','cottongrass','thistle','saxifrage','mosscampion']),
'Fr. S. Antarctic Lands':TUNDRA.concat(['moss','lichen','reindeermoss','saxifrage','mosscampion']),

/* ---------------- THE GREAT SOUTH LAND AND THE ISLES ---------------- */
'Australia':DESERT_AUS.concat(['eucalyptus','blackwood','banksia','bottlebrush',
  'macadamia','mangrove','treefern','fern','wheat','grapevine']),
'New Zealand':['kauri','podocarp','pohutukawa','kowhai','treefern','fern','moss','lichen','clover','wheat','apple','grapevine'],
'Papua New Guinea':RAINFOREST.concat(['sago','coconut','coffee','cacao','mangrove','pandanus','taro','bamboo']),
'Solomon Is.':ISLES.concat(['sago','cacao','coconut','mangrove','pandanus','taro']),
'Vanuatu':ISLES.concat(['coconut','cacao','taro','kava','mangrove','pandanus']),
'Fiji':ISLES.concat(['sugarcane','coconut','taro','mangrove','pandanus','banana']),
'New Caledonia':ISLES.concat(['araucaria','coconut','mangrove','pandanus','treefern','fern']),
},

});
