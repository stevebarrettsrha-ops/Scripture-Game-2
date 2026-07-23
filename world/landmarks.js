/* The named places of the true earth — every entry stands at its real
   latitude and longitude. Edit or add freely; the game rebuilds on reload.

   kind:'mount'  — raises the very land into a summit
       peak : height in blocks (snow caps above 11)
       r    : radius of the massif in world units (1 block = 6 units)
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
EARTH.landmark({n:"Mount Ararat", lat:39.70, lon:44.30, kind:'mount', peak:24, r:150});
EARTH.landmark({n:"Mount Sinai", lat:28.54, lon:33.97, kind:'mount', peak:13, r:100});
EARTH.landmark({n:"Mount Hermon", lat:33.42, lon:35.86, kind:'mount', peak:15, r:110});
EARTH.landmark({n:"Mount Olympus", lat:40.09, lon:22.36, kind:'mount', peak:17, r:120});
EARTH.landmark({n:"Mount Everest", lat:27.99, lon:86.93, kind:'mount', peak:34, r:200});
EARTH.landmark({n:"Mount Fuji", lat:35.36, lon:138.73, kind:'mount', peak:20, r:130});
EARTH.landmark({n:"Kilimanjaro", lat:-3.07, lon:37.35, kind:'mount', peak:22, r:160});
EARTH.landmark({n:"Mont Blanc", lat:45.83, lon:6.86, kind:'mount', peak:19, r:130});
EARTH.landmark({n:"Denali", lat:63.07, lon:-151.0, kind:'mount', peak:23, r:160});
EARTH.landmark({n:"Aconcagua", lat:-32.65, lon:-70.01, kind:'mount', peak:25, r:160});
EARTH.landmark({n:"Table Mountain", lat:-33.96, lon:18.40, kind:'mount', peak:9, r:90});
EARTH.landmark({n:"Uluru", lat:-25.34, lon:131.03, kind:'mount', peak:8, r:60});
EARTH.landmark({n:"Mount Zaphon", lat:35.95, lon:35.97, kind:'mount', peak:12, r:90});
