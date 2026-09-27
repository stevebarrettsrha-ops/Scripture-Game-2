/* ================= DEEP STONE =================
   The rock under the level of the sea. The limestone of the hills is warm
   and bedded; below the sea's level the ground turns to basalt, dark and
   close-grained, and it takes longer to cut — so a shaft reads, and is
   felt, as going DOWN into something older.

   One block, one file. Add a file, add a line to world/manifest.js, and the
   thing exists — the same rule every country, creature and landmark keeps. */
EARTH.block({
  id:'deep-stone', name:'Deep Stone',
  tex:{all:'deepStone'},
  hardness:4.6,         /* seconds to break it by hand */
  tool:'pick', drops:'deep-stone',
  opaque:true, gravity:false
});
