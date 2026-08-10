/* TILLED GROUND — soil

   Broken with the hoe and left in furrows, ready for the seed. It is the
   only ground the wheat, the barley and the flax will take.

   One block, one file. Add a file, add a line to world/manifest.js, and the
   thing exists — the same rule every country, creature and landmark keeps. */
EARTH.block({
  id:'soil', name:'Tilled Ground',
  tex:{top:'soil',side:'dirt',bottom:'dirt'},
  hardness:0.8,         /* seconds to break it by hand */
  tool:'hoe', drops:'dirt',
  opaque:true, gravity:false
});
