/* ICE — ice

   The wall at the rim is six hundred blocks of it. Under a low sun it stands
   blue-white and luminous and it never goes brown at dusk, which is why the
   ice keeps a light of its own in this world.

   One block, one file. Add a file, add a line to world/manifest.js, and the
   thing exists — the same rule every country, creature and landmark keeps. */
EARTH.block({
  id:'ice', name:'Ice',
  tex:{all:'ice'},
  hardness:1.2,         /* seconds to break it by hand */
  tool:'pick', drops:'ice',
  opaque:true, gravity:false
});
