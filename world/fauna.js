/* ============================================================
   THE BEASTS OF EVERY LAND — one file, and it is all data
   ------------------------------------------------------------
   "And God made the beast of the earth after his kind, and cattle after
    their kind, and every thing that creepeth upon the earth after his kind."

   THE FAULT THIS FILE MENDS. Every creature on the whole earth was drawn
   from one of five short lists by the CLIMATE alone — so the same dozen
   beasts stood in every country in the world, an elephant was as likely in
   Peru as in Kenya, and no land had anything of its own. A traveller who
   crossed an ocean found the same field he left.

   Now every land keeps its own beasts. Come ashore in Kenya and the plain
   carries elephant, giraffe, zebra, wildebeest, gazelle, buffalo, rhino,
   warthog, ostrich, baboon — and the lion and the cheetah that hunt them.
   Come ashore in Australia and it is kangaroo, emu, koala, wombat, dingo,
   cassowary. In Canada, moose, bison, black bear, wolf, beaver. Nothing
   stands where it does not belong.

   ---- HOW A BEAST IS CHOSEN FOR A SPOT ----
   1. the LAND the spot lies in is looked up in `lands` below;
   2. every beast on that list that will stand on THIS ground (the biome
      underfoot, the height, whether a river runs by) is kept;
   3. one is drawn from what is left by a number seeded on the place — so
      the same field always bears the same kind, and a herd stands together.
   4. a land with no list of its own (and the uncharted isles) falls back to
      `wilds`, which is the old climate table, kept for exactly that.

   ---- HOW TO ADD A BEAST ----
   Build it in creatures/<name>.js with realm:'land', add a line to `keeps`
   saying what ground it will stand on, and name it in whichever lands bear
   it. That is the whole of it.
   ============================================================ */
EARTH.fauna({

/* ---- WHAT EACH BEAST IS ABOUT ----
   graze  heads down in the grass, herding, fleeing, bedding down at night
   stalk  creeps in low through the cover and then charges
   pack   hunts with its fellows and gathers to the kill
   forage digs, roots, fishes, and browses
   ambush lies still and takes whatever comes within reach
   bask   suns itself on a stone and scuttles
   (anything not named here grazes.) */
roles:{
  lion:'stalk', tiger:'stalk', leopard:'stalk', jaguar:'stalk', cheetah:'stalk',
  cougar:'stalk', snowleopard:'stalk', lynx:'stalk', fox:'stalk', arcticfox:'stalk',
  wolf:'pack', hyena:'pack', dingo:'pack', jackal:'pack', coyote:'pack', dog:'pack',
  bear:'forage', blackbear:'forage', polarbear:'forage', boar:'forage', badger:'forage',
  raccoon:'forage', skunk:'forage', panda:'forage', redpanda:'forage', gorilla:'forage',
  chimpanzee:'forage', baboon:'forage', macaque:'forage', howler:'forage', sloth:'forage',
  anteater:'forage', armadillo:'forage', hedgehog:'forage', meerkat:'forage',
  wombat:'forage', koala:'forage', tasdevil:'forage', otter:'forage', beaver:'forage',
  platypus:'forage', warthog:'forage', orangutan:'forage', lemur:'forage',
  crocodile:'ambush', komodo:'ambush',
  lizard:'bask',
},

/* ---- WHAT IS HUNTED ----
   The beasts a hunter will run down, and that flee what hunts them. */
prey:['sheep','goat','pig','chicken','hare','deer','donkey','cow','horse','ostrich',
  'zebra','wildebeest','gazelle','oryx','warthog','buffalo','waterbuffalo','saiga',
  'pronghorn','reindeer','moose','bison','chamois','llama','alpaca','capybara',
  'kangaroo','emu','tapir','yak','ox','giraffe','okapi','boar','hedgehog','peacock'],

/* ---- WHERE EACH WILL STAND ----
   g    the grounds it will set foot on. A beast is never placed on ground
        that is not on its list, whatever land it is in.
   h    OPTIONAL [lo,hi] — how high above the sea it keeps, in blocks.
   riv  OPTIONAL true — it keeps to the banks of rivers and to nothing else.
   w    OPTIONAL how often it is met, against its fellows (1 by default).
        Great territorial beasts are set low, so there are never many. */
keeps:{
  /* cattle, flocks and the beasts of the household */
  cow:{g:['grass','tropic','savanna','tundra']}, sheep:{g:['grass','alpine','tundra','savanna']},
  goat:{g:['grass','alpine','rock','desert','badlands','savanna']},
  pig:{g:['grass','tropic']}, chicken:{g:['grass','tropic','savanna']},
  horse:{g:['grass','savanna','tundra']}, donkey:{g:['grass','desert','savanna','badlands']},
  ox:{g:['grass','tundra','savanna']}, dog:{g:['grass','tropic','savanna','tundra','desert'],w:0.5},
  /* the beasts of the temperate field and wood */
  deer:{g:['grass','alpine','tundra','tropic']}, hare:{g:['grass','tundra','alpine','desert','savanna']},
  boar:{g:['grass','tropic','alpine']}, fox:{g:['grass','tundra','alpine','desert'],w:0.5},
  badger:{g:['grass','alpine'],w:0.6}, hedgehog:{g:['grass'],w:0.6},
  lynx:{g:['grass','tundra','alpine'],w:0.22}, wolf:{g:['grass','tundra','alpine','rock','savanna'],w:0.4},
  bison:{g:['grass','tundra'],w:1.8}, moose:{g:['grass','tundra','alpine'],w:1.0},
  reindeer:{g:['tundra','snow','alpine','grass'],w:1.8}, chamois:{g:['alpine','rock'],h:[26,999]},
  lizard:{g:['rock','desert','badlands','sand','savanna','alpine']},
  /* the plain of the south, and all that is upon it */
  elephant:{g:['savanna','tropic','grass'],h:[0,26],w:0.8}, giraffe:{g:['savanna','grass'],h:[0,24],w:1.2},
  zebra:{g:['savanna','grass'],w:2.4}, wildebeest:{g:['savanna','grass'],w:2.4},
  gazelle:{g:['savanna','grass','desert'],w:2.4}, oryx:{g:['savanna','desert','badlands','sand'],w:1.6},
  buffalo:{g:['savanna','grass','tropic'],w:1.5}, rhino:{g:['savanna','grass'],h:[0,24],w:0.25},
  warthog:{g:['savanna','grass','tropic']}, ostrich:{g:['savanna','desert','sand','badlands','grass'],w:0.8},
  lion:{g:['savanna','grass','desert','badlands'],w:0.22},
  cheetah:{g:['savanna','grass','desert'],w:0.18},
  leopard:{g:['savanna','tropic','grass','rock','alpine'],w:0.2},
  hyena:{g:['savanna','grass','desert','badlands'],w:0.3},
  jackal:{g:['savanna','desert','grass','badlands'],w:0.4},
  baboon:{g:['savanna','rock','grass','alpine'],w:0.9}, meerkat:{g:['desert','savanna','sand','badlands'],w:0.7},
  hippo:{g:['savanna','tropic','grass'],h:[0,22],riv:true}, crocodile:{g:['tropic','grass','savanna','desert','sand'],h:[0,20],riv:true},
  camel:{g:['desert','sand','badlands','savanna']},
  /* the forests of the tropics */
  gorilla:{g:['tropic'],w:0.4}, chimpanzee:{g:['tropic']}, okapi:{g:['tropic'],w:0.4},
  lemur:{g:['tropic','grass']}, orangutan:{g:['tropic'],w:0.5}, macaque:{g:['tropic','grass','alpine','rock'],h:[0,30]},
  howler:{g:['tropic']}, sloth:{g:['tropic'],w:0.6}, anteater:{g:['tropic','savanna','grass']},
  armadillo:{g:['tropic','savanna','grass','desert']}, tapir:{g:['tropic','grass']},
  jaguar:{g:['tropic','savanna','grass'],w:0.2}, capybara:{g:['tropic','grass','savanna'],riv:true,w:1.6},
  peacock:{g:['tropic','grass','savanna']}, komodo:{g:['tropic','savanna','sand'],w:0.3},
  /* the east and the high country of Asia */
  tiger:{g:['tropic','grass','tundra','alpine'],w:0.2}, panda:{g:['alpine','grass'],h:[16,999],w:0.5},
  redpanda:{g:['alpine','tropic'],h:[14,999],w:0.6}, snowleopard:{g:['rock','alpine','snow'],h:[34,999],w:0.18},
  yak:{g:['alpine','rock','tundra'],h:[26,999]}, saiga:{g:['grass','desert','tundra']},
  waterbuffalo:{g:['tropic','grass','savanna'],riv:true},
  /* the new world */
  cougar:{g:['grass','alpine','rock','tropic','desert'],w:0.2},
  coyote:{g:['grass','desert','badlands','savanna'],w:0.45},
  pronghorn:{g:['grass','desert','badlands']}, llama:{g:['alpine','rock','grass','desert'],h:[20,999]},
  alpaca:{g:['alpine','rock','grass'],h:[20,999]}, raccoon:{g:['grass','tropic']},
  skunk:{g:['grass','tropic','desert']}, blackbear:{g:['grass','alpine','tropic'],w:0.3},
  /* the great south land */
  kangaroo:{g:['grass','desert','badlands','savanna','sand'],w:1.8}, emu:{g:['grass','desert','badlands','savanna'],w:1.0},
  koala:{g:['grass','tropic']}, wombat:{g:['grass','alpine','tropic']},
  dingo:{g:['desert','grass','badlands','savanna','sand'],w:0.4},
  cassowary:{g:['tropic']}, kiwi:{g:['tropic','grass','alpine']}, tasdevil:{g:['grass','alpine','tropic'],w:0.6},
  /* the cold and the ice */
  bear:{g:['grass','tundra','alpine','snow'],w:0.25},
  polarbear:{g:['snow','floe','wall','tundra'],w:0.3}, arcticfox:{g:['snow','tundra','floe'],w:0.6},
  muskox:{g:['tundra','snow']}, penguin:{g:['floe','wall','snow']},
  /* the beasts of the running water */
  otter:{g:['grass','tropic','tundra','alpine','savanna'],riv:true},
  beaver:{g:['grass','tundra','alpine'],riv:true},
  platypus:{g:['grass','tropic','alpine'],riv:true},
},

/* ---- AND WHERE THERE IS NO LIST ----
   The uncharted isles of the deep, the ice, and any land whose own list has
   not been written yet. This is the old climate table, and it is the floor
   under everything, never the first answer. */
wilds:{
  grass  :['cow','sheep','horse','donkey','pig','deer','wolf','dog','chicken','hare','goat','ox','fox','boar'],
  tropic :['pig','chicken','goat','deer','boar','macaque','peacock'],
  savanna:['ostrich','lion','elephant','zebra','gazelle','wildebeest','giraffe','warthog','hyena'],
  desert :['camel','ostrich','lion','goat','donkey','lizard','hare','oryx','jackal'],
  badlands:['goat','lizard','hare','coyote','ostrich'],
  sand   :['goat','lizard','hare','camel'],
  tundra :['wolf','deer','hare','ox','goat','reindeer','fox','muskox'],
  alpine :['goat','goat','deer','wolf','hare','chamois'],
  rock   :['goat','lizard','deer','wolf'],
  snow   :['polarbear','arcticfox','reindeer','muskox'],
  floe   :['penguin'], wall:['penguin'],
},

/* ---- THE LANDS, AND WHAT WALKS IN EACH ----
   The order is the order of the earth: Africa, then Asia, Europe, the
   Americas, and the isles of the sea. A name here must be the land's own
   name as its file in countries/ gives it. */
lands:{

/* ---------------- AFRICA ---------------- */
/* THE EAST AFRICAN PLAIN — the great herds, and everything that follows
   them. This is the ground the whole system was built to carry. */
'Kenya':['elephant','giraffe','zebra','wildebeest','gazelle','buffalo','rhino','warthog',
  'ostrich','baboon','lion','cheetah','leopard','hyena','jackal','hippo','crocodile','meerkat','goat','cow'],
'Tanzania':['elephant','giraffe','zebra','wildebeest','gazelle','buffalo','rhino','warthog',
  'ostrich','baboon','lion','cheetah','leopard','hyena','jackal','hippo','crocodile','chimpanzee','goat'],
'Uganda':['elephant','giraffe','buffalo','warthog','hippo','crocodile','gorilla','chimpanzee',
  'baboon','lion','leopard','zebra','ostrich','goat','cow'],
'Rwanda':['gorilla','chimpanzee','buffalo','elephant','baboon','leopard','hippo','goat','cow'],
'Burundi':['hippo','crocodile','buffalo','baboon','leopard','goat','cow','chimpanzee'],
'Ethiopia':['gazelle','oryx','baboon','hyena','jackal','lion','leopard','ostrich','warthog',
  'camel','goat','donkey','cow','zebra'],
'Eritrea':['camel','gazelle','oryx','ostrich','hyena','jackal','goat','donkey','baboon'],
'Djibouti':['camel','gazelle','oryx','jackal','hyena','goat','donkey','ostrich'],
'Somalia':['camel','gazelle','oryx','ostrich','hyena','jackal','leopard','goat','donkey','warthog'],
'Somaliland':['camel','gazelle','oryx','ostrich','hyena','jackal','goat','donkey'],
'S. Sudan':['elephant','giraffe','buffalo','gazelle','zebra','lion','hyena','hippo','crocodile',
  'ostrich','warthog','wildebeest','cow'],
'Sudan':['camel','gazelle','oryx','ostrich','hyena','jackal','lion','crocodile','hippo','goat','donkey'],
'Egypt':['camel','donkey','goat','jackal','gazelle','oryx','crocodile','hyena','lizard','ostrich'],
'Libya':['camel','goat','donkey','gazelle','oryx','jackal','lizard','ostrich'],
'Tunisia':['camel','goat','donkey','sheep','jackal','gazelle','fox','lizard'],
'Algeria':['camel','goat','donkey','sheep','gazelle','oryx','jackal','fox','lizard','ostrich'],
'Morocco':['camel','goat','donkey','sheep','macaque','fox','jackal','gazelle','lizard'],
'W. Sahara':['camel','goat','gazelle','oryx','jackal','lizard','ostrich'],
'Mauritania':['camel','goat','donkey','gazelle','oryx','jackal','ostrich','lizard'],
'Mali':['camel','goat','donkey','cow','gazelle','oryx','elephant','lion','hyena','ostrich','hippo','crocodile'],
'Niger':['camel','goat','donkey','cow','gazelle','oryx','giraffe','hyena','ostrich','lion','crocodile'],
'Chad':['camel','goat','cow','gazelle','oryx','elephant','giraffe','lion','hyena','ostrich','hippo','crocodile'],
'Senegal':['cow','goat','donkey','warthog','baboon','hyena','crocodile','hippo','gazelle','ostrich'],
'Gambia':['baboon','warthog','hippo','crocodile','goat','cow','chimpanzee'],
'Guinea-Bissau':['chimpanzee','baboon','hippo','crocodile','warthog','goat','buffalo'],
'Guinea':['chimpanzee','baboon','warthog','buffalo','leopard','hippo','crocodile','goat'],
'Sierra Leone':['chimpanzee','warthog','buffalo','leopard','hippo','crocodile','goat','peacock'],
'Liberia':['chimpanzee','okapi','buffalo','leopard','warthog','hippo','crocodile','goat'],
"Côte d'Ivoire":['elephant','chimpanzee','buffalo','leopard','warthog','hippo','crocodile','baboon','goat'],
'Ghana':['elephant','buffalo','warthog','baboon','leopard','hippo','crocodile','goat','cow','chimpanzee'],
'Togo':['elephant','buffalo','warthog','baboon','hippo','crocodile','goat','cow'],
'Benin':['elephant','buffalo','lion','warthog','baboon','hippo','crocodile','goat','cow'],
'Burkina Faso':['elephant','buffalo','lion','warthog','hyena','hippo','crocodile','cow','goat','donkey'],
'Nigeria':['elephant','buffalo','warthog','baboon','chimpanzee','lion','leopard','hippo','crocodile','goat','cow'],
'Cameroon':['elephant','gorilla','chimpanzee','buffalo','leopard','warthog','hippo','crocodile','baboon','goat'],
'Central African Rep.':['elephant','gorilla','chimpanzee','buffalo','leopard','warthog','hippo','crocodile','giraffe','lion'],
'Eq. Guinea':['gorilla','chimpanzee','leopard','warthog','crocodile','goat'],
'Gabon':['gorilla','chimpanzee','elephant','buffalo','leopard','hippo','crocodile','warthog'],
'Congo':['gorilla','chimpanzee','elephant','okapi','buffalo','leopard','hippo','crocodile'],
'Dem. Rep. Congo':['gorilla','chimpanzee','okapi','elephant','buffalo','leopard','hippo','crocodile',
  'warthog','baboon','zebra','lion'],
'Angola':['elephant','giraffe','zebra','gazelle','oryx','buffalo','lion','leopard','hyena','warthog',
  'hippo','crocodile','ostrich','goat','cow'],
'Zambia':['elephant','giraffe','zebra','buffalo','wildebeest','gazelle','lion','leopard','cheetah',
  'hyena','hippo','crocodile','warthog','baboon','rhino'],
'Zimbabwe':['elephant','giraffe','zebra','buffalo','wildebeest','rhino','lion','leopard','cheetah',
  'hyena','hippo','crocodile','warthog','baboon','ostrich'],
'Malawi':['elephant','hippo','crocodile','buffalo','zebra','leopard','hyena','baboon','warthog','goat'],
'Mozambique':['elephant','buffalo','zebra','wildebeest','gazelle','lion','leopard','hyena','hippo',
  'crocodile','warthog','baboon','ostrich'],
'Botswana':['elephant','giraffe','zebra','wildebeest','gazelle','oryx','buffalo','lion','cheetah',
  'leopard','hyena','hippo','crocodile','ostrich','meerkat','warthog'],
'Namibia':['oryx','gazelle','zebra','giraffe','elephant','lion','cheetah','hyena','jackal','ostrich',
  'meerkat','rhino','goat'],
'South Africa':['zebra','wildebeest','gazelle','oryx','buffalo','elephant','rhino','giraffe','lion',
  'leopard','cheetah','hyena','baboon','ostrich','meerkat','warthog','sheep','penguin'],
'Lesotho':['sheep','goat','cow','horse','baboon','jackal','oryx'],
'eSwatini':['zebra','wildebeest','warthog','baboon','hippo','crocodile','cow','goat','rhino'],
'Madagascar':['lemur','crocodile','goat','cow','komodo','lizard'],

/* ---------------- ASIA ---------------- */
'Russia':['bear','wolf','moose','reindeer','boar','fox','lynx','hare','tiger','saiga','muskox',
  'arcticfox','polarbear','bison','beaver','otter','deer'],
'Kazakhstan':['saiga','horse','camel','wolf','fox','hare','snowleopard','deer','sheep','goat'],
'Uzbekistan':['camel','horse','sheep','goat','fox','wolf','gazelle','lizard','donkey'],
'Turkmenistan':['camel','gazelle','fox','wolf','goat','lizard','donkey','sheep'],
'Kyrgyzstan':['snowleopard','yak','sheep','goat','horse','wolf','deer','fox','chamois'],
'Tajikistan':['snowleopard','yak','goat','sheep','horse','wolf','fox','chamois'],
'Mongolia':['horse','camel','yak','sheep','goat','wolf','saiga','snowleopard','fox','hare'],
'China':['panda','redpanda','tiger','yak','snowleopard','macaque','boar','deer','leopard','goat',
  'sheep','horse','peacock','otter','cow'],
'Taiwan':['macaque','boar','deer','goat','leopard','otter'],
'North Korea':['tiger','bear','boar','deer','fox','goat','leopard'],
'South Korea':['boar','deer','macaque','fox','goat','otter','bear'],
'Japan':['macaque','deer','boar','fox','badger','bear','hare','otter','tasdevil'],
'Nepal':['tiger','rhino','elephant','yak','snowleopard','leopard','macaque','deer','goat','redpanda'],
'Bhutan':['yak','redpanda','tiger','leopard','macaque','deer','goat','snowleopard'],
'India':['tiger','elephant','rhino','leopard','waterbuffalo','macaque','peacock','deer','cow',
  'goat','crocodile','sloth','camel','gazelle','lion','otter'],
'Pakistan':['camel','goat','sheep','donkey','leopard','snowleopard','goat','gazelle','crocodile','macaque'],
'Bangladesh':['tiger','waterbuffalo','macaque','deer','crocodile','cow','goat','peacock','otter'],
'Sri Lanka':['elephant','leopard','macaque','peacock','waterbuffalo','crocodile','cow','deer'],
'Myanmar':['tiger','elephant','waterbuffalo','macaque','leopard','deer','peacock','crocodile','boar'],
'Thailand':['elephant','tiger','macaque','waterbuffalo','leopard','deer','peacock','crocodile','boar'],
'Laos':['elephant','tiger','macaque','waterbuffalo','deer','boar','leopard','crocodile'],
'Cambodia':['elephant','waterbuffalo','macaque','deer','leopard','crocodile','peacock','boar'],
'Vietnam':['macaque','waterbuffalo','elephant','tiger','deer','boar','crocodile','peacock'],
'Malaysia':['orangutan','tiger','elephant','tapir','macaque','leopard','boar','crocodile','komodo'],
'Brunei':['orangutan','macaque','tapir','crocodile','boar'],
'Indonesia':['orangutan','komodo','tiger','elephant','tapir','macaque','waterbuffalo','boar','crocodile','cassowary'],
'Timor-Leste':['macaque','crocodile','goat','waterbuffalo','boar'],
'Philippines':['macaque','waterbuffalo','boar','crocodile','deer','peacock'],
'Afghanistan':['goat','sheep','camel','snowleopard','wolf','fox','leopard','donkey','chamois'],
'Iran':['goat','sheep','camel','leopard','wolf','fox','gazelle','donkey','lizard','bear'],
'Iraq':['camel','goat','sheep','donkey','jackal','gazelle','fox','lizard','hyena'],
'Syria':['camel','goat','sheep','donkey','jackal','gazelle','fox','hyena','lizard'],
'Lebanon':['goat','sheep','fox','jackal','hyena','donkey','lizard'],
'Yasharal':['sheep','goat','donkey','camel','gazelle','jackal','hyena','fox','lizard','ox','leopard'],
'Yahudah':['sheep','goat','donkey','camel','gazelle','jackal','hyena','fox','lizard','ox'],
'Jordan':['camel','goat','sheep','donkey','gazelle','oryx','jackal','fox','lizard','hyena'],
'Saudi Arabia':['camel','goat','oryx','gazelle','jackal','hyena','lizard','donkey','leopard'],
'Yemen':['camel','goat','donkey','baboon','gazelle','oryx','jackal','lizard','leopard'],
'Oman':['camel','goat','oryx','gazelle','jackal','lizard','donkey','leopard'],
'United Arab Emirates':['camel','goat','oryx','gazelle','jackal','lizard'],
'Qatar':['camel','goat','oryx','gazelle','lizard'],
'Kuwait':['camel','goat','sheep','gazelle','jackal','lizard'],
'Turkey':['goat','sheep','cow','donkey','boar','bear','wolf','fox','deer','chamois','lynx'],
'Cyprus':['goat','sheep','donkey','fox','hare','lizard'],
'N. Cyprus':['goat','sheep','donkey','fox','hare','lizard'],
'Georgia':['bear','wolf','boar','deer','chamois','fox','goat','lynx'],
'Armenia':['goat','sheep','wolf','bear','fox','boar','chamois','leopard'],
'Azerbaijan':['goat','sheep','wolf','bear','boar','deer','fox','gazelle'],

/* ---------------- EUROPE ---------------- */
'Norway':['reindeer','moose','bear','wolf','lynx','fox','hare','sheep','otter','arcticfox','muskox'],
'Sweden':['moose','reindeer','bear','wolf','lynx','fox','boar','hare','beaver','otter','deer'],
'Finland':['moose','reindeer','bear','wolf','lynx','fox','hare','beaver','otter'],
'Iceland':['sheep','horse','arcticfox','reindeer','hare'],
'Denmark':['deer','boar','fox','hare','cow','pig','badger','otter'],
'Estonia':['moose','bear','wolf','lynx','boar','beaver','fox','deer'],
'Latvia':['moose','wolf','lynx','boar','beaver','deer','fox','badger'],
'Lithuania':['moose','wolf','boar','bison','beaver','deer','fox','badger'],
'Belarus':['bison','moose','wolf','boar','beaver','lynx','deer','fox'],
'Poland':['bison','moose','wolf','boar','deer','lynx','fox','beaver','badger','hare'],
'Ukraine':['boar','deer','wolf','fox','hare','bison','beaver','cow','horse'],
'Moldova':['boar','deer','fox','hare','cow','sheep','badger'],
'Romania':['bear','wolf','lynx','boar','deer','chamois','fox','sheep','badger'],
'Bulgaria':['bear','wolf','boar','deer','chamois','fox','sheep','goat','badger'],
'Serbia':['boar','deer','wolf','bear','fox','sheep','badger','hare'],
'Kosovo':['boar','deer','wolf','bear','fox','sheep','goat'],
'North Macedonia':['bear','wolf','boar','deer','chamois','fox','sheep','goat','lynx'],
'Albania':['bear','wolf','boar','deer','chamois','fox','goat','sheep','lynx'],
'Montenegro':['bear','wolf','boar','chamois','deer','fox','goat'],
'Bosnia and Herz.':['bear','wolf','boar','deer','chamois','fox','sheep','lynx'],
'Croatia':['bear','wolf','boar','deer','chamois','fox','sheep','lynx'],
'Slovenia':['bear','wolf','boar','deer','chamois','fox','badger','lynx'],
'Hungary':['boar','deer','fox','hare','cow','horse','badger','beaver'],
'Slovakia':['bear','wolf','lynx','boar','deer','chamois','fox','badger'],
'Czechia':['boar','deer','fox','lynx','hare','badger','beaver','sheep'],
'Austria':['chamois','deer','boar','fox','badger','cow','sheep','bear','lynx'],
'Switzerland':['chamois','deer','boar','fox','badger','cow','goat','sheep','lynx'],
'Germany':['boar','deer','fox','badger','hare','cow','sheep','beaver','lynx','hedgehog'],
'Netherlands':['cow','sheep','deer','fox','hare','badger','hedgehog','otter'],
'Belgium':['boar','deer','fox','badger','cow','sheep','hare','hedgehog'],
'Luxembourg':['boar','deer','fox','badger','hare','cow','hedgehog'],
'France':['boar','deer','fox','badger','chamois','cow','sheep','hare','hedgehog','lynx'],
'Spain':['boar','deer','goat','sheep','fox','lynx','bear','chamois','hare','cow','horse'],
'Portugal':['boar','deer','goat','sheep','fox','lynx','hare','cow'],
'Italy':['boar','deer','chamois','wolf','fox','bear','goat','sheep','cow','hedgehog'],
'Greece':['goat','sheep','boar','deer','bear','fox','chamois','donkey','hare'],
'United Kingdom':['sheep','cow','deer','fox','badger','hare','horse','hedgehog','otter','pig'],
'Ireland':['sheep','cow','deer','fox','badger','hare','horse','otter'],

/* ---------------- THE AMERICAS ---------------- */
'Greenland':['polarbear','muskox','arcticfox','reindeer','sheep','wolf'],
'Canada':['moose','bison','blackbear','bear','wolf','reindeer','beaver','fox','lynx','cougar',
  'muskox','polarbear','arcticfox','deer','otter','raccoon','hare'],
'United States of America':['bison','moose','blackbear','bear','wolf','cougar','coyote','deer',
  'pronghorn','beaver','raccoon','skunk','fox','armadillo','crocodile','hare','horse','cow','lizard'],
'Mexico':['jaguar','cougar','coyote','armadillo','deer','anteater','raccoon','skunk','lizard',
  'howler','tapir','crocodile','cow','goat','donkey'],
'Guatemala':['jaguar','tapir','howler','anteater','armadillo','crocodile','deer','cougar','sloth'],
'Belize':['jaguar','tapir','howler','crocodile','anteater','armadillo','sloth','deer'],
'Honduras':['jaguar','tapir','howler','crocodile','anteater','sloth','armadillo','deer'],
'El Salvador':['howler','armadillo','anteater','crocodile','deer','cougar'],
'Nicaragua':['jaguar','tapir','howler','sloth','anteater','crocodile','armadillo','deer'],
'Costa Rica':['jaguar','tapir','sloth','howler','anteater','crocodile','armadillo','cougar'],
'Panama':['jaguar','tapir','sloth','howler','anteater','crocodile','armadillo','capybara'],
'Colombia':['jaguar','tapir','sloth','howler','anteater','capybara','crocodile','armadillo','cougar','llama'],
'Venezuela':['jaguar','capybara','anteater','sloth','howler','crocodile','armadillo','tapir'],
'Guyana':['jaguar','capybara','anteater','sloth','howler','crocodile','tapir','armadillo'],
'Suriname':['jaguar','capybara','sloth','howler','anteater','crocodile','tapir'],
'Ecuador':['jaguar','llama','alpaca','sloth','howler','anteater','capybara','tapir','crocodile'],
'Peru':['llama','alpaca','jaguar','cougar','sloth','howler','anteater','capybara','tapir','armadillo'],
'Bolivia':['llama','alpaca','jaguar','capybara','anteater','armadillo','howler','cougar','tapir'],
'Brazil':['jaguar','capybara','sloth','anteater','howler','tapir','armadillo','crocodile','cougar','otter'],
'Paraguay':['jaguar','capybara','anteater','armadillo','tapir','howler','cougar'],
'Uruguay':['capybara','armadillo','cow','horse','sheep','fox','anteater'],
'Argentina':['llama','alpaca','cougar','armadillo','capybara','fox','cow','horse','sheep','anteater','penguin'],
'Chile':['llama','alpaca','cougar','fox','armadillo','sheep','cow','horse','chamois','penguin'],
'Cuba':['crocodile','lizard','cow','pig','goat','howler'],
'Haiti':['goat','pig','cow','lizard','crocodile'],
'Dominican Rep.':['goat','pig','cow','crocodile','lizard'],
'Jamaica':['goat','pig','cow','crocodile','lizard'],
'Puerto Rico':['goat','pig','cow','lizard','macaque'],
'Bahamas':['lizard','crocodile','pig','goat'],
'Trinidad and Tobago':['howler','capybara','anteater','crocodile','armadillo','goat'],
'Falkland Is.':['penguin','sheep','fox','arcticfox'],
'Fr. S. Antarctic Lands':['penguin','sheep','arcticfox'],

/* ---------------- THE GREAT SOUTH LAND AND THE ISLES ---------------- */
'Australia':['kangaroo','emu','koala','wombat','dingo','crocodile','platypus','tasdevil',
  'cassowary','sheep','cow','lizard','komodo'],
'New Zealand':['sheep','cow','kiwi','deer','goat','penguin','otter'],
'Papua New Guinea':['cassowary','crocodile','tasdevil','koala','wombat','macaque','peacock','pig'],
'Solomon Is.':['crocodile','pig','lizard','cassowary'],
'Vanuatu':['pig','cow','lizard','crocodile'],
'Fiji':['pig','goat','cow','lizard'],
'New Caledonia':['kiwi','goat','pig','lizard','cow'],
},

});
