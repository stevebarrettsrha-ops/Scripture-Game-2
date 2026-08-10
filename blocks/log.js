/* TIMBER — log

   The bole of a tree, bark still on it and the rings showing at the cut.
   Every plank in the world was one of these first.

   One block, one file. Add a file, add a line to world/manifest.js, and the
   thing exists — the same rule every country, creature and landmark keeps. */
EARTH.block({
  id:'log', name:'Timber',
  tex:{top:'logTop',side:'logSide'},
  hardness:2.0,         /* seconds to break it by hand */
  tool:'axe', drops:'log',
  opaque:true, gravity:false
});
