/* SHEAF — hay

   The harvest bound and stacked. It feeds the byre through the winter, and
   it is the one solid block in the world a man can fall onto and stand up.

   One block, one file. Add a file, add a line to world/manifest.js, and the
   thing exists — the same rule every country, creature and landmark keeps. */
EARTH.block({
  id:'hay', name:'Sheaf',
  tex:{top:'hayTop',side:'haySide'},
  hardness:0.6,         /* seconds to break it by hand */
  tool:null, drops:'hay',
  opaque:true, gravity:false
});
