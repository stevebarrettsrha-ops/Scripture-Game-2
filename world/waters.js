/* ================= THE NATIONS OF FISH, AND WHERE THEY SWIM =================
   The shoals of the open sea and the fish of the near shore, each with the
   latitudes it keeps to. Two kinds of entry share this table:

   THE SHOALING NATIONS — drawn in the water as real schools (the sea-life
   engine builds each one from its creature file and swims it inside its own
   band). n how many are shown, m [shallow,deep] the soundings it wants,
   tight how close it holds, spd how fast it runs, R how far off it may stand,
   bed true for a bottom-feeder. These seven lived as a literal inside
   js/engine.js from the day the shoals were built (Round 99 moved them here,
   changing no number) — add a creature file, add a line here, and that fish
   is in the sea.

   THE INSHORE KINDS — inshore:true — are the catch of the coasts: what a man
   with a rod on a shore or a pier draws up where no great shoal stands. They
   are names with waters, not schools; no creature file is asked for. These
   eight were the rod's old FISH_NAMES literal, which named a musht off
   Greenland as readily as off Kinnereth; each keeps its own band now.

   THE ROD READS THIS TABLE (catchAt in js/engine.js): what comes up on the
   line at any spot is a nation whose band covers that spot — shoaling or
   inshore alike — and nothing else. */
/* ---- the shoaling nations of the open sea ---- */
EARTH.shoal({ name:'sardine', n:26, lat:[-58,62],  m:[40,600],  tight:0.90, spd:17, R:220 });
EARTH.shoal({ name:'mackerel',n:16, lat:[-52,66],  m:[45,700],  tight:0.62, spd:21, R:250 });
EARTH.shoal({ name:'salmon',  n:9,  lat:[38,72],   m:[40,400],  tight:0.45, spd:19, R:240 });
EARTH.shoal({ name:'salmon',  n:7,  lat:[-72,-38], m:[40,400],  tight:0.45, spd:19, R:240 });
EARTH.shoal({ name:'cod',     n:6,  lat:[42,76],   m:[60,900],  tight:0.25, spd:9,  R:230, bed:true });
EARTH.shoal({ name:'tuna',    n:4,  lat:[-42,42],  m:[80,2000], tight:0.35, spd:30, R:300 });
/* the silver the whole sea lives on: the herring of the cold shelves and
   the anchovy of the warm coasts, in the tightest bait-balls of all */
EARTH.shoal({ name:'herring', n:22, lat:[36,74],   m:[40,500],  tight:0.88, spd:16, R:220 });
EARTH.shoal({ name:'herring', n:14, lat:[-64,-36], m:[40,500],  tight:0.88, spd:16, R:220 });
EARTH.shoal({ name:'anchovy', n:26, lat:[-46,48],  m:[40,300],  tight:0.94, spd:14, R:200 });
/* ---- the inshore catch of the coasts ---- */
EARTH.shoal({ name:'bream',          lat:[-50,55], inshore:true });
EARTH.shoal({ name:'mullet',         lat:[-55,60], inshore:true });
EARTH.shoal({ name:'carp',           lat:[-40,60], inshore:true });
EARTH.shoal({ name:'musht',          lat:[-15,38], inshore:true });   /* the fish of Kinnereth keeps warm water */
EARTH.shoal({ name:'barbel',         lat:[-35,55], inshore:true });
EARTH.shoal({ name:'grey eel',       lat:[-55,65], inshore:true });
EARTH.shoal({ name:'silver sardine', lat:[-58,62], inshore:true });
EARTH.shoal({ name:'great catfish',  lat:[-35,50], inshore:true });
