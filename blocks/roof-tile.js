/* FIRED TILE — roof-tile

   Clay shaped, dried and burnt hard. Every roof in every village is stepped
   with these, and they shed the rain because they overlap and for no other
   reason.

   One block, one file. Add a file, add a line to world/manifest.js, and the
   thing exists — the same rule every country, creature and landmark keeps. */
EARTH.block({
  id:'roof-tile', name:'Fired Tile',
  tex:{all:'roof'},
  hardness:1.6,         /* seconds to break it by hand */
  tool:'pick', drops:'roof-tile',
  opaque:true, gravity:false
});
