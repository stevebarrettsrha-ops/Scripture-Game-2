/* THE DEEPS OF THE TRUE SEA — every trench at its real latitude and
   longitude, with its real sounding in metres. The engine sinks the bed of
   the ocean to meet them, so the deepest place in the game is the deepest
   place there is: the Challenger Deep, 11,034 m down.

   m : the TRUE depth of the deep, in metres below the waterline. (The
       Challenger Deep is given at 11,034 — the sounding the old charts and
       the trench diagrams carry; the modern multibeam figure is 10,935, and
       either may be set here.)
   r : how wide the trough is, in world units (1 block = 6 units = 1 km).
       A trench is a long slot in truth; here it is a broad trough with a
       narrow gut cut down the middle of it.

   A block is a METRE in the reckoning a man swims and dives by — the same
   measure every beast is built to — so these numbers are laid on the world
   unchanged, and the depth-gauge reports what it truly finds.          */

/* ---- the Pacific: the deepest water on the face of the earth ---- */
EARTH.deep({n:"The Challenger Deep — Mariana Trench", lat:11.37,  lon:142.59, m:11034, r:820});
EARTH.deep({n:"The Sirena Deep",                      lat:12.06,  lon:144.75, m:10714, r:560});
EARTH.deep({n:"The Horizon Deep — Tonga Trench",      lat:-23.28, lon:-174.75,m:10817, r:780});
EARTH.deep({n:"The Galathea Depth — Philippine Trench",lat:10.32, lon:126.65, m:10540, r:760});
EARTH.deep({n:"The Kuril–Kamchatka Trench",      lat:44.10,  lon:150.50, m:10542, r:800});
EARTH.deep({n:"The Kermadec Trench",                  lat:-31.90, lon:-177.30,m:10047, r:760});
EARTH.deep({n:"The Izu–Ogasawara Trench",        lat:29.80,  lon:142.60, m:9780,  r:700});
EARTH.deep({n:"The Planet Deep — New Britain Trench", lat:-6.60,  lon:153.00, m:8940,  r:620});
EARTH.deep({n:"The Bougainville Trench",              lat:-6.30,  lon:154.50, m:9140,  r:600});
EARTH.deep({n:"The Japan Trench",                     lat:36.10,  lon:142.70, m:8412,  r:700});
EARTH.deep({n:"The Aleutian Trench",                  lat:51.00,  lon:-175.00,m:7679,  r:820});
EARTH.deep({n:"The Richards Deep — Atacama Trench",   lat:-23.30, lon:-71.30, m:8065,  r:760});
EARTH.deep({n:"The Middle America Trench",            lat:14.50,  lon:-94.50, m:6669,  r:640});
EARTH.deep({n:"The Yap Trench",                       lat:8.50,   lon:138.10, m:8527,  r:520});
EARTH.deep({n:"The Palau Trench",                     lat:7.60,   lon:135.10, m:8054,  r:480});
EARTH.deep({n:"The Vityaz Deep — New Hebrides Trench",lat:-16.20, lon:168.00, m:7156,  r:560});

/* ---- the Atlantic ---- */
EARTH.deep({n:"The Milwaukee Deep — Puerto Rico Trench",lat:19.70,lon:-66.50, m:8376,  r:720});
EARTH.deep({n:"The Meteor Deep — South Sandwich Trench",lat:-55.50,lon:-25.30,m:8266,  r:740});
EARTH.deep({n:"The Romanche Trench",                  lat:0.20,   lon:-18.50, m:7761,  r:600});
EARTH.deep({n:"The Cayman Trough",                    lat:19.00,  lon:-80.00, m:7686,  r:520});
EARTH.deep({n:"The Brazil Basin",                     lat:-20.00, lon:-25.00, m:6100,  r:1400});
EARTH.deep({n:"The Sargasso Deep",                    lat:28.00,  lon:-55.00, m:6000,  r:1500});

/* ---- the Indian Ocean ---- */
EARTH.deep({n:"The Sunda Deep — Java Trench",         lat:-10.30, lon:110.00, m:7290,  r:780});
EARTH.deep({n:"The Diamantina Fracture Zone",         lat:-35.00, lon:104.00, m:8047,  r:820});
EARTH.deep({n:"The Wharton Deep",                     lat:-13.50, lon:97.00,  m:6500,  r:900});

/* ---- the cold seas, north and south ---- */
EARTH.deep({n:"The Molloy Deep",                      lat:79.13,  lon:2.80,   m:5550,  r:420});
EARTH.deep({n:"The Litke Deep",                       lat:82.40,  lon:19.50,  m:5449,  r:460});
EARTH.deep({n:"The Factorian Deep — Southern Ocean",  lat:-60.30, lon:-25.30, m:7432,  r:640});
EARTH.deep({n:"The Weddell Abyss",                    lat:-65.00, lon:-40.00, m:6500,  r:1100});

/* ---- THE BLUE HOLES ----
   Not trenches but SHAFTS: round wells sunk straight down through a reef,
   their mouths ringed with coral and their water going from turquoise to
   ink in the space of a stroke. They are cut sheer, and they are cut into
   the shelf where the shelf is otherwise a few fathoms deep — which is the
   whole of why they look as they do from above.
   m : the depth of the shaft in metres.  r : the mouth, in world units. */
EARTH.hole({n:"The Great Blue Hole of Belize",  lat:17.316, lon:-87.535, m:124, r:96});
EARTH.hole({n:"Dean's Blue Hole",               lat:23.784, lon:-74.892, m:202, r:64});
EARTH.hole({n:"The Dragon Hole — Yongle Atoll", lat:16.527, lon:111.766, m:300, r:78});
EARTH.hole({n:"The Blue Hole of Dahab",         lat:28.572, lon:34.537,  m:130, r:58});
EARTH.hole({n:"Taam Ja' of Chetumal Bay",       lat:18.500, lon:-88.000, m:420, r:70});
EARTH.hole({n:"The Blue Hole of Gozo",          lat:36.049, lon:14.189,  m:60,  r:44});
