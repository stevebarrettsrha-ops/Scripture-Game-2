/* COURSED STONE — cobble

   Stone dressed and laid in courses with mortar run between. Not crushed
   gravel — a MASON'S work, which is why it costs more to break than the
   living rock it was quarried from and less than to cut it again.

   One block, one file. Add a file, add a line to world/manifest.js, and the
   thing exists — the same rule every country, creature and landmark keeps. */
EARTH.block({
  id:'cobble', name:'Coursed Stone',
  tex:{all:'cobble'},
  hardness:3.0,         /* seconds to break it by hand */
  tool:'pick', drops:'cobble',
  opaque:true, gravity:false
});
