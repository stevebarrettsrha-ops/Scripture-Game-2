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
EARTH.landmark({n:"The Pyramids of Giza", lat:29.98, lon:31.13, kind:'pyramid', s:1.3});
EARTH.landmark({n:"The Ziggurat of Ur", lat:30.96, lon:46.10, kind:'ziggurat'});
EARTH.landmark({n:"Babel — Etemenanki of Babylon", lat:32.54, lon:44.42, kind:'ziggurat'});
EARTH.landmark({n:"The Gates of Nineveh", lat:36.36, lon:43.15, kind:'gate'});
EARTH.landmark({n:"The Temple of Artemis at Ephesus", lat:37.95, lon:27.36, kind:'temple', s:1.2});
EARTH.landmark({n:"The Parthenon of Athens", lat:37.97, lon:23.73, kind:'temple'});
EARTH.landmark({n:"The Standing Stones of Stonehenge", lat:51.18, lon:-1.83, kind:'stonecircle'});
EARTH.landmark({n:"Gobekli Tepe", lat:37.22, lon:38.92, kind:'stonecircle'});
EARTH.landmark({n:"The Great Wall", lat:40.43, lon:116.57, kind:'wall', s:3});
EARTH.landmark({n:"The Walls of Yericho", lat:31.87, lon:35.44, kind:'city'});
EARTH.landmark({n:"The Lighthouse of Alexandria", lat:31.21, lon:29.89, kind:'lighthouse'});
EARTH.landmark({n:"Petra of the Rock", lat:30.33, lon:35.44, kind:'temple'});
EARTH.landmark({n:"Persepolis of Persia", lat:29.93, lon:52.89, kind:'temple', s:1.3});
EARTH.landmark({n:"The Temple of Karnak at No-Amon", lat:25.72, lon:32.66, kind:'temple', s:1.4});
EARTH.landmark({n:"Baalbek of the Great Stones", lat:34.01, lon:36.20, kind:'temple'});
EARTH.landmark({n:"Mohenjo-daro on the Indus", lat:27.33, lon:68.14, kind:'city'});
EARTH.landmark({n:"Knossos of Kaphtor", lat:35.30, lon:25.16, kind:'city'});
EARTH.landmark({n:"The Lion Gate of Mycenae", lat:37.73, lon:22.76, kind:'gate'});
EARTH.landmark({n:"The Gates of Hattusa", lat:40.02, lon:34.62, kind:'gate'});
EARTH.landmark({n:"Megiddo of the Plain", lat:32.58, lon:35.18, kind:'city'});
EARTH.landmark({n:"Carthage of the Sea", lat:36.85, lon:10.32, kind:'city'});
EARTH.landmark({n:"Caral of the Sacred Fire", lat:-10.89, lon:-77.52, kind:'pyramid', s:0.8});
EARTH.landmark({n:"The Great Heads of the Olmec", lat:18.10, lon:-94.04, kind:'statue'});

/* ---- the named summits — the land itself rises to meet them ---- */
EARTH.landmark({n:"Mount Ararat", lat:39.70, lon:44.30, kind:'mount', elev:5137, r:520});
EARTH.landmark({n:"Mount Sinai", lat:28.54, lon:33.97, kind:'mount', elev:2285, r:260});
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
EARTH.landmark({n:"The Blue Mountains", lat:18.10, lon:-76.90, kind:'range', elev:2256, r:1400, style:'cliff', secret:1});
EARTH.landmark({n:"The Northern Range", lat:10.37, lon:-61.33, kind:'range', elev:1740, r:1000, style:'cliff', secret:1});
EARTH.landmark({n:"The Hida Mountains", lat:36.22, lon:137.60, kind:'range', elev:3800, r:1600, style:'stony', secret:1});

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
