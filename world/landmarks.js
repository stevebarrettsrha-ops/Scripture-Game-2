/* The named places of the true earth — every entry stands at its real
   latitude and longitude. Edit or add freely; the game rebuilds on reload.

   kind:'mount'  — raises the very land into a summit
       elev : the summit's TRUE height above the sea, in metres. The engine
              scales it (MTN_M_PER_BLOCK), so every mountain in the world
              keeps its right proportion to every other, and the whole range
              of the earth is retuned from that one constant.
       r    : radius of the MASSIF in world units (1 block = 6 units = 1 km).
              Not the peak — the whole swelling of the land about it: the
              plateau under Everest, the Alps under Mont Blanc. The summit
              itself is raised sharply within it.
       peak : (old) height in blocks — still honoured where no elev is given
   other kinds — built as structures when the traveller draws near:
       pyramid · ziggurat · temple · stonecircle · wall · lighthouse ·
       gate · city · statue          (s : optional size factor)          */

/* ---- the works of the ancients, as they stood BCE ---- */
EARTH.landmark({n:"The Pyramids of Giza", lat:29.98, lon:31.13, kind:'pyramid', s:1.3,
  /* (tm: the true measure in metres, raised when the earth is drawn at its own — ROADMAP Phase T7:
     Khufu 230.3 m square and 146.6 high, Khafre 215.3 and 143.5, Menkaure 103.4 and 65.5, each at its
     own place about the mark) */
  tm:{parts:[{dx:404,dz:89,base:230.3,h:146.6},{dx:77,dz:433,base:215.3,h:143.5},{dx:-164,dz:834,base:103.4,h:65.5}]}});
EARTH.landmark({n:"The Ziggurat of Ur", lat:30.96, lon:46.10, kind:'ziggurat', tm:{form:'ur',clear:[-50,-65,50,40],top:32,tiers:[[64,46,11],[38,26,6],[20,14,5]]}});
EARTH.landmark({n:"Baḇal (Baḇylon) — Etemenanki", lat:32.54, lon:44.42, kind:'ziggurat',
  tm:{form:'babylon',clear:[-60,-60,60,105],top:95,tiers:[[91,91,33],[78,78,18],[60,60,6],[51,51,6],[42,42,6],[33,33,6],[24,24,15]]}});   /* (the Esagila tablet) */
EARTH.landmark({n:"The Gates of Ninewĕh", lat:36.36, lon:43.15, kind:'gate', tm:{w:40,h:20,d:22}});
EARTH.landmark({n:"The Temple of Artemis at Ephesus", lat:37.95, lon:27.36, kind:'temple', s:1.2, tm:{form:'artemis',clear:[-125,-50,80,50],top:34,L:137,W:69,colH:18,step:6.2}});
EARTH.landmark({n:"The Parthenon of Athens", lat:37.97, lon:23.73, kind:'temple', tm:{form:'parthenon',clear:[-45,-25,45,25],top:22,L:69.5,W:30.9,colH:10.4,step:4.3}});
EARTH.landmark({n:"The Standing Stones of Stonehenge", lat:51.18, lon:-1.83, kind:'stonecircle', tm:{R:16.5,n:30,h:4.1,w:2.1,t:1.1,lintel:true}});
EARTH.landmark({n:"Gobekli Tepe", lat:37.22, lon:38.92, kind:'stonecircle', tm:{R:10,n:12,h:5.5,w:1.4,t:0.6}});
EARTH.landmark({n:"The Great Wall", lat:40.43, lon:116.57, kind:'wall', s:3, tm:{L:2400,h:7.8,w:6.5,every:120}});
EARTH.landmark({n:"The Walls of Yahriḥo", lat:31.87, lon:35.44, kind:'city', tm:{R:120,h:7,houses:40}});
EARTH.landmark({n:"The Lighthouse of Alexandria", lat:31.21, lon:29.89, kind:'lighthouse', tm:{w1:30,h1:60,w2:18,h2:30,w3:9,h3:15}});
EARTH.landmark({n:"Petra of the Rock", lat:30.33, lon:35.44, kind:'temple', tm:{form:'petra',clear:[-60,-50,140,50],top:56,L:25,W:20,colH:12,step:5}});
EARTH.landmark({n:"Persepolis of Persia", lat:29.93, lon:52.89, kind:'temple', s:1.3, tm:{form:'persepolis',clear:[-170,-235,155,230],top:42,L:112,W:112,colH:20,step:8.6}});
EARTH.landmark({n:"The Temple of Karnak at No-Amon", lat:25.72, lon:32.66, kind:'temple', s:1.4, tm:{form:'karnak',clear:[-215,-180,265,262],top:38,L:103,W:52,colH:21,step:6.3}});
EARTH.landmark({n:"Baalbek of the Great Stones", lat:34.01, lon:36.20, kind:'temple', tm:{form:'baalbek',clear:[-55,-60,280,125],top:46,L:88,W:48,colH:20,step:5.6}});
EARTH.landmark({n:"Mohenjo-daro on the Indus", lat:27.33, lon:68.14, kind:'city', tm:{R:400,h:6,houses:90}});
EARTH.landmark({n:"Knossos of Kaphtor", lat:35.30, lon:25.16, kind:'city', tm:{R:90,h:5,houses:40}});
EARTH.landmark({n:"The Lion Gate of Mycenae", lat:37.73, lon:22.76, kind:'gate', tm:{w:10,h:7,d:5}});
EARTH.landmark({n:"The Gates of Hattusa", lat:40.02, lon:34.62, kind:'gate', tm:{w:14,h:10,d:9}});
EARTH.landmark({n:"Megiddo of the Plain", lat:32.58, lon:35.18, kind:'city', tm:{R:110,h:8,houses:40}});
EARTH.landmark({n:"Carthage of the Sea", lat:36.85, lon:10.32, kind:'city', tm:{R:450,h:12,houses:120}});
EARTH.landmark({n:"Caral of the Sacred Fire", lat:-10.89, lon:-77.52, kind:'pyramid', s:0.8, tm:{parts:[{dx:0,dz:0,base:155,h:28}]}});
EARTH.landmark({n:"The Great Heads of the Olmec", lat:18.10, lon:-94.04, kind:'statue', tm:{h:3}});

/* ---- the named summits — the land itself rises to meet them ---- */
EARTH.landmark({n:"Mount Ararat", lat:39.70, lon:44.30, kind:'mount', elev:5137, r:520});
EARTH.landmark({n:"Mount Sinai", lat:28.54, lon:33.97, kind:'mount', elev:2285, r:260});
/* MOUNT MORIYAH — "Shelomoh began to build the House of (YAHUAH) HWHY at Yahrushalayim on
   Mount Moriyah" (2 DIḆRĔ HAYAMIM 3:1). The city of the great king stands upon a great
   mountain: its crown is level and broad enough for the whole city (world/yahrushalayim.js,
   which both games raise on it) — the walls, the houses, the courts of the Hĕḵal and the upper
   pool — and its flanks fall away on every side to the valleys below. */
/* (ox, oz: the crown is centred on the middle of the city, a little north of her anchor; its
   flanks fall about one in three) */
EARTH.landmark({n:"Mount Moriyah", lat:31.78, lon:35.23, kind:'mount', peak:22, r:200, flat:560, flank:420, ox:0, oz:-130});
EARTH.landmark({n:"Mount Hermon", lat:33.42, lon:35.86, kind:'mount', elev:2814, r:300});
EARTH.landmark({n:"Mount Olympus", lat:40.09, lon:22.36, kind:'mount', elev:2917, r:330});
EARTH.landmark({n:"Mount Everest", lat:27.99, lon:86.93, kind:'mount', elev:8849, r:5400});
EARTH.landmark({n:"Mount Fuji", lat:35.36, lon:138.73, kind:'mount', elev:3776, r:240});
EARTH.landmark({n:"Kilimanjaro", lat:-3.07, lon:37.35, kind:'mount', elev:5895, r:330});
EARTH.landmark({n:"Mont Blanc", lat:45.83, lon:6.86, kind:'mount', elev:4808, r:1800});
EARTH.landmark({n:"Denali", lat:63.07, lon:-151.0, kind:'mount', elev:6190, r:1800});
EARTH.landmark({n:"Aconcagua", lat:-32.65, lon:-70.01, kind:'mount', elev:6961, r:4200});
EARTH.landmark({n:"Table Mountain", lat:-33.96, lon:18.40, kind:'mount', elev:1085, r:90, steep:1});
EARTH.landmark({n:"Uluru", lat:-25.34, lon:131.03, kind:'mount', elev:863, r:60, steep:1});
EARTH.landmark({n:"Mount Zaphon", lat:35.95, lon:35.97, kind:'mount', elev:1717, r:150});

/* ---- THE SECRET RANGES — mountain country, not one summit ----
   kind:'range' raises a whole FIELD of jagged peaks (ridge-noise over the
   massif, so a dozen crests and the valleys between), cut through with
   slot-canyon CAVES the traveller can walk into and lose the sky in,
   sunk with mountain BLUE HOLES, and hung with waterfalls off the cliff
   faces. secret:1 — no name-banner, no chart mark: they are found by
   going there, which is the whole point of a secret place.
       style:'cliff' — green hill-country broken by sheer grey cliff faces
                       and ledges (the classic extreme hills)
       style:'stony' — bare jagged grey peaks, snow where the height takes
                       them */
/* (coordinates are nudged from the true ones where the chart draws an
   island a little off its geographic seat — the range must stand on the
   island as DRAWN, or it stands in the sea) */
/* ---- THE TWO RANGES THE GREAT SCROLLS NEED (§5, Phase 7) ----
   §5: "Add the kind:'range' and kind:'mount' entries these need to
   world/landmarks.js with true elevations." These are those entries, and they
   were added because the scrolls asked for them and the world answered that
   it had no cave to put them in: neither Iraq nor Ethiopia had a single
   hollow anywhere in it, so "the Cave of Treasures in the Zagros" and
   "Ḥanoḵ in the Ethiopian highlands" had nowhere to be.
   Both carry their TRUE elevations; MTN_M_PER_BLOCK keeps them in proportion
   with every other height on the earth. */
EARTH.landmark({n:"The Zagros", lat:33.40, lon:46.30, kind:'range', elev:4548, r:2100, style:'stony', secret:1});
/* ---- AND THE GARDEN'S RANGE ----
   The garden of Ĕḏen is set in the south of Africa (the player's reading;
   AUDIT Round 107), and the Cave of Treasures under it needs rock to be cut
   into, as the Zagros gave it before. The Drakensberg: the high basalt wall
   of KwaZulu-Natal, 3,450 m at Mafadi, cliffs over green valleys. */
EARTH.landmark({n:"The Drakensberg", lat:-28.95, lon:29.55, kind:'range', elev:3450, r:1700, style:'cliff', secret:1});
EARTH.landmark({n:"The Simien Mountains", lat:13.19, lon:38.37, kind:'range', elev:4550, r:1500, style:'stony', secret:1});
EARTH.landmark({n:"The Blue Mountains", lat:18.10, lon:-76.90, kind:'range', elev:2256, r:1400, style:'cliff', secret:1});
EARTH.landmark({n:"The Northern Range", lat:10.37, lon:-61.33, kind:'range', elev:940, r:1000, style:'cliff', secret:1});
/* snowcap:1 — RESEARCHED, not guessed: a range famous for standing white
   though it sits under the world's permanent-snow line (which models
   year-round glacier country). The Hida are the "Japan Alps", snowbound
   most of the year; Paektu is literally the "ever-white mountain". The
   Caribbean ranges carry NO snow, because in truth they never do — Pico
   Duarte sees a morning frost at most. */
EARTH.landmark({n:"The Hida Mountains", lat:36.22, lon:137.60, kind:'range', elev:3190, r:1600, style:'stony', secret:1, snowcap:1});
/* ---- the rest of the Caribbean, each island's TRUE mountains ---- */
EARTH.landmark({n:"The Sierra Maestra", lat:20.41, lon:-76.76, kind:'range', elev:1974, r:1100, style:'cliff', secret:1});
EARTH.landmark({n:"The Cordillera Central", lat:19.03, lon:-71.01, kind:'range', elev:3098, r:1300, style:'cliff', secret:1});
EARTH.landmark({n:"The Massif de la Selle", lat:18.64, lon:-71.87, kind:'range', elev:2680, r:1000, style:'cliff', secret:1});
EARTH.landmark({n:"The Sierra de Luquillo", lat:18.26, lon:-66.18, kind:'range', elev:1080, r:700, style:'cliff', secret:1});
EARTH.landmark({n:"The Maya Mountains", lat:16.62, lon:-88.99, kind:'range', elev:1124, r:900, style:'cliff', secret:1});
/* ---- and the east: China, the Koreas, Taiwan ---- */
EARTH.landmark({n:"Huangshan", lat:30.12, lon:118.17, kind:'range', elev:1864, r:1100, style:'cliff', secret:1});
EARTH.landmark({n:"Gongga Shan", lat:29.60, lon:101.88, kind:'range', elev:7556, r:3000, style:'stony', secret:1});
EARTH.landmark({n:"Mount Paektu", lat:41.99, lon:128.05, kind:'range', elev:2744, r:1200, style:'stony', secret:1, snowcap:1});
EARTH.landmark({n:"Seoraksan", lat:37.88, lon:128.14, kind:'range', elev:1708, r:900, style:'stony', secret:1});
EARTH.landmark({n:"Yushan", lat:23.56, lon:120.87, kind:'range', elev:3952, r:1100, style:'stony', secret:1});

/* ---- THE SECRET FALLS OF THE CARIBBEAN ----
   kind:'falls' — each at the true place of a real fall, in the land it
   belongs to: the cliff head is raised, the lagoon sunk, and the water
   hung on it when the traveller draws near. elev = the TRUE drop in
   metres, which sets the height of the cliff. All secret:1. */
EARTH.landmark({n:"Dunn's River Falls",  lat:18.16, lon:-77.24, kind:'falls', elev:55,  secret:1});
EARTH.landmark({n:"Reach Falls",         lat:18.10, lon:-76.75, kind:'falls', elev:70,  secret:1});
EARTH.landmark({n:"Maracas Falls",       lat:10.38, lon:-61.28, kind:'falls', elev:91,  secret:1});
EARTH.landmark({n:"El Limon Falls",      lat:18.93, lon:-69.62, kind:'falls', elev:52,  secret:1});
EARTH.landmark({n:"La Mina Falls",       lat:18.26, lon:-66.14, kind:'falls', elev:35,  secret:1});
EARTH.landmark({n:"Saut-d'Eau",          lat:18.90, lon:-72.12, kind:'falls', elev:60,  secret:1});
EARTH.landmark({n:"Salto del Caburni",   lat:22.20, lon:-79.95, kind:'falls', elev:62,  secret:1});
EARTH.landmark({n:"Kaieteur Falls",      lat:5.18,  lon:-59.48, kind:'falls', elev:226, secret:1});
