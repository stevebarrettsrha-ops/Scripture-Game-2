/* ============================================================
   THE FALLING WATERS OF THE EARTH — one file, and it is all data
   ------------------------------------------------------------
   "The floods have lifted up, O YHWH, the floods have lifted up their voice;
    the floods lift up their waves."                        — TEHILLIM 93:3

   Every fall here stands at its TRUE latitude and longitude, with its TRUE
   height and breadth. Add a line and the fall exists; nothing in js/ knows
   any one of them by name. That is the same rule world/landmarks.js keeps
   for the summits and the works of the ancients, and it is kept here.

   ---- WHAT A WATERFALL ACTUALLY LOOKS LIKE, WHICH IS THE POINT ----
   They are not all one thing. The form is the difference between a fall that
   reads as a real place and a blue stripe painted down a cliff, so the form
   is DATA and the builder is told which:

     plunge    the water leaves the rock at the lip and touches nothing until
               the pool. One clean column, spray at the foot, and a hollow
               cut back behind it. Angel, Yosemite Upper, Gocta.
     horsetail some contact with the rock the whole way down, so the column
               keeps the shape of the face — narrower, and it FEATHERS.
               Seljalandsfoss, Sutherland.
     cataract  a wide wall of water over a long straight lip, more breadth
               than height. Niagara, Victoria, Iguazu, Dettifoss.
     tiered    it comes down in steps, with a pool on each. Plitvice,
               Erawan, Kuang Si — and these are the ones that read best in
               blocks, because a step IS a block.
     fan       it widens as it falls, spreading over the rock. Ouzoud.
     chute     forced through a narrow gut of rock and shot out. Gullfoss.

   ---- AND THEY STAND IN WOOD ----
   A fall in a bare field is a garden feature. Every one of these cuts
   through country that is WET — the spray keeps it so — and the growth in
   the gorge is always heavier than the growth on the plain above it: big
   timber close to the water, bush and fern under it, moss on the wet rock.
   `wood` names the growth of the gorge, out of world/flora.js's own kinds,
   and `girth` says how big the timber runs: 1 ordinary, 2 great trees.
   Nothing is invented here — every name is a kind that file already grows.

   ---- THE FIELDS ----
     n      the name, as it is known
     lat    · lon   the true place on the earth
     drop   the true height of the fall, in METRES. The engine scales it by
            the same measure it scales the mountains, so a fall keeps its
            right proportion to every summit in the world.
     width  the true breadth of the lip, in metres. Victoria is a mile wide
            and Angel is a thread; a builder that ignores this makes them
            the same fall twice.
     form   one of the six above
     tiers  for `tiered` only — how many steps it comes down in
     wood   the growth of the gorge, and `girth` how big the timber runs
   ============================================================ */

/* ---- THE GREAT FALLS OF THE SOUTH AND THE NEW WORLD ---- */
EARTH.waterfall({n:"Salto Angel — the Fall from the Table", lat:5.9701, lon:-62.5362,
  drop:979, width:150, form:'plunge',
  wood:['ceiba','brazilnut','rubber','cacao','bamboo','fern','orchid'], girth:2});
EARTH.waterfall({n:"Kaieteur of the Potaro", lat:5.1781, lon:-59.4839,
  drop:226, width:113, form:'plunge',
  wood:['ceiba','brazilnut','rubber','fern','bamboo'], girth:2});
EARTH.waterfall({n:"Gocta of the Cloud Forest", lat:-6.0300, lon:-77.8900,
  drop:771, width:30, form:'horsetail',
  wood:['cinchona','fern','orchid','bamboo'], girth:1});
EARTH.waterfall({n:"Iguazu — the Great Water", lat:-25.6953, lon:-54.4367,
  drop:82, width:2700, form:'cataract',
  wood:['ceiba','rubber','palmito','fern','bamboo'], girth:2});
EARTH.waterfall({n:"Niagara of the Thundering Water", lat:43.0799, lon:-79.0747,
  drop:51, width:1200, form:'cataract',
  wood:['maple','oak','beech','birch','hemlock','fern'], girth:1});
EARTH.waterfall({n:"Yosemite of the High Sierra", lat:37.7566, lon:-119.5969,
  drop:739, width:20, form:'plunge',
  wood:['pine','sequoia','cedar','oak','fern'], girth:2});
EARTH.waterfall({n:"Multnomah of the Columbia", lat:45.5762, lon:-122.1158,
  drop:189, width:14, form:'tiered', tiers:2,
  wood:['douglasfir','cedar','maple','fern','moss'], girth:2});
EARTH.waterfall({n:"Shoshone — the Niagara of the West", lat:42.5936, lon:-114.4008,
  drop:65, width:275, form:'cataract',
  wood:['juniper','sagebrush','cottonwood','willow'], girth:1});
EARTH.waterfall({n:"Havasu of the Red Rock", lat:36.2552, lon:-112.6981,
  drop:30, width:15, form:'plunge',
  wood:['cottonwood','willow','juniper','prickly'], girth:1});

/* ---- AFRICA ---- */
EARTH.waterfall({n:"Mosi-oa-Tunya — the Smoke that Thunders", lat:-17.9243, lon:25.8572,
  drop:108, width:1708, form:'cataract',
  wood:['baobab','mopane','fig','palm','fern','acacia'], girth:2});
EARTH.waterfall({n:"Tugela of the Drakensberg", lat:-28.7500, lon:28.9333,
  drop:948, width:15, form:'horsetail',
  wood:['protea','yellowwood','fern','heather'], girth:1});
EARTH.waterfall({n:"Tis Issat — the Water that Smokes", lat:11.4886, lon:37.5892,
  drop:42, width:400, form:'cataract',
  wood:['fig','acacia','papyrus','coffee'], girth:1});
EARTH.waterfall({n:"Kalandula of the Lucala", lat:-9.0744, lon:16.0031,
  drop:105, width:400, form:'cataract',
  wood:['mahogany','fig','palm','fern'], girth:2});
EARTH.waterfall({n:"Murchison — the Nile through the Gate", lat:2.2783, lon:31.6867,
  drop:43, width:7, form:'chute',
  wood:['acacia','fig','papyrus','borassus'], girth:1});
EARTH.waterfall({n:"Ouzoud of the Atlas", lat:32.0158, lon:-6.7192,
  drop:110, width:40, form:'fan', tiers:3,
  wood:['olive','carob','fig','oleander','pomegranate'], girth:1});

/* ---- THE LANDS OF THE SCRIPTURE ---- */
/* The falls of the promised land are small beside Victoria and they are not
   small in the book. A man walking up the Nahal David hears this one before
   he sees it, and that is what a waterfall IS. */
EARTH.waterfall({n:"The Fall of Ein Gedi in the Wilderness", lat:31.4614, lon:35.3886,
  drop:30, width:6, form:'plunge',
  wood:['datepalm','acacia','tamarisk','oleander','reed'], girth:1});
EARTH.waterfall({n:"Baatara — the Fall into the Rock", lat:34.1156, lon:35.8756,
  drop:255, width:10, form:'plunge',
  wood:['cedar','oak','fig','fern'], girth:2});
EARTH.waterfall({n:"The Springs of Banias at the Foot of Hermon", lat:33.2482, lon:35.6944,
  drop:18, width:20, form:'tiered', tiers:3,
  wood:['oak','plane','laurel','fig','fern','reed'], girth:1});

/* ---- EUROPE AND THE NORTH ---- */
EARTH.waterfall({n:"Dettifoss — the Falling Water", lat:65.8148, lon:-16.3844,
  drop:44, width:100, form:'cataract',
  wood:['birch','willow','moss','heather'], girth:1});
EARTH.waterfall({n:"Gullfoss — the Golden Fall", lat:64.3271, lon:-20.1199,
  drop:32, width:70, form:'chute', tiers:2,
  wood:['birch','willow','moss','heather'], girth:1});
EARTH.waterfall({n:"Seljalandsfoss, that a man walks behind", lat:63.6156, lon:-19.9886,
  drop:60, width:10, form:'horsetail',
  wood:['birch','willow','moss','fern'], girth:1});
EARTH.waterfall({n:"Skogafoss of the Cliff", lat:63.5321, lon:-19.5114,
  drop:60, width:25, form:'plunge',
  wood:['birch','willow','moss','heather'], girth:1});
EARTH.waterfall({n:"The Rhine Fall at Schaffhausen", lat:47.6779, lon:8.6152,
  drop:23, width:150, form:'cataract',
  wood:['beech','oak','spruce','hazel','fern'], girth:1});
EARTH.waterfall({n:"The Lakes of Plitvice", lat:44.8654, lon:15.5820,
  drop:78, width:60, form:'tiered', tiers:6,
  wood:['beech','fir','spruce','hornbeam','moss','fern'], girth:1});
EARTH.waterfall({n:"Krimml of the Tauern", lat:47.2003, lon:12.1683,
  drop:380, width:20, form:'tiered', tiers:3,
  wood:['spruce','larch','pine','bilberry','fern'], girth:1});
EARTH.waterfall({n:"Vettisfossen of the Fjord Country", lat:61.3167, lon:8.0333,
  drop:275, width:8, form:'plunge',
  wood:['spruce','birch','pine','bilberry','moss'], girth:1});

/* ---- ASIA AND THE ISLES ---- */
EARTH.waterfall({n:"Nohkalikai of the Wettest Hills", lat:25.2760, lon:91.6857,
  drop:340, width:20, form:'plunge',
  wood:['bamboo','fig','fern','orchid','tea'], girth:2});
EARTH.waterfall({n:"Jog of the Sharavati", lat:14.2294, lon:74.8127,
  drop:253, width:472, form:'plunge',
  wood:['teak','bamboo','fig','sandalwood','fern'], girth:2});
EARTH.waterfall({n:"Huangguoshu of the Baishui", lat:25.9906, lon:105.6667,
  drop:78, width:101, form:'cataract',
  wood:['bamboo','camphor','fig','fern','tea'], girth:1});
EARTH.waterfall({n:"Detian on the Border River", lat:22.8556, lon:106.7222,
  drop:30, width:200, form:'tiered', tiers:3,
  wood:['bamboo','banyan','fig','fern'], girth:2});
EARTH.waterfall({n:"Kuang Si of the Blue Pools", lat:19.7489, lon:101.9917,
  drop:60, width:30, form:'tiered', tiers:4,
  wood:['teak','bamboo','fig','fern','banana'], girth:1});
EARTH.waterfall({n:"Erawan of the Seven Steps", lat:14.3733, lon:99.1444,
  drop:80, width:20, form:'tiered', tiers:7,
  wood:['teak','bamboo','fig','fern','banana'], girth:1});
EARTH.waterfall({n:"Sutherland of the Southern Alps", lat:-44.8167, lon:167.7333,
  drop:580, width:12, form:'horsetail', tiers:3,
  wood:['beech','podocarp','treefern','moss'], girth:2});
EARTH.waterfall({n:"Kegon of Nikko", lat:36.7392, lon:139.5031,
  drop:97, width:7, form:'plunge',
  wood:['cedar','maple','beech','bamboo','fern'], girth:1});
