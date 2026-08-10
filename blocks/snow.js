/* SNOW — snow

   The softest solid thing in the world. A man clears it with his hands.

   One block, one file. Add a file, add a line to world/manifest.js, and the
   thing exists — the same rule every country, creature and landmark keeps. */
EARTH.block({
  id:'snow', name:'Snow',
  tex:{all:'snow'},
  hardness:0.4,         /* seconds to break it by hand */
  tool:'spade', drops:'snow',
  opaque:true, gravity:false
});
