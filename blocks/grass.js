/* SWARD — grass

   Earth with the green still on it. Broken, it is only earth again — the
   sward is a skin, not a substance, which is why it drops what is under it.

   One block, one file. Add a file, add a line to world/manifest.js, and the
   thing exists — the same rule every country, creature and landmark keeps. */
EARTH.block({
  id:'grass', name:'Sward',
  tex:{top:'grassTop',side:'grassSide',bottom:'dirt'},
  hardness:0.9,         /* seconds to break it by hand */
  tool:'spade', drops:'dirt',
  hoed:'soil',          /* what the hoe makes of it (§17.4) */
  opaque:true, gravity:false
});
