/* LEAF — leaves

   The canopy. It bars no light and stops no arrow, and it is the fastest
   thing in the world to clear.

   One block, one file. Add a file, add a line to world/manifest.js, and the
   thing exists — the same rule every country, creature and landmark keeps. */
EARTH.block({
  id:'leaves', name:'Leaf',
  tex:{all:'leaves'},
  hardness:0.3,         /* seconds to break it by hand */
  tool:null, drops:null,
  opaque:false, gravity:false
});
