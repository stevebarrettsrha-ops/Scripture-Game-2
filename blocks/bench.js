/* WORKBENCH — bench

   A carpenter's bench with the tools laid on it. What is made in this world
   is made standing at one of these.

   One block, one file. Add a file, add a line to world/manifest.js, and the
   thing exists — the same rule every country, creature and landmark keeps. */
EARTH.block({
  id:'bench', name:'Workbench',
  tex:{top:'benchTop',side:'benchSide'},
  hardness:1.9,         /* seconds to break it by hand */
  tool:'axe', drops:'bench',
  opaque:true, gravity:false
});
