/* BANDED CLAY — clay-band

   The red and white strata of the badlands, laid down one wet season at a
   time and cut open again by the wind. Every band is a year nobody counted.

   One block, one file. Add a file, add a line to world/manifest.js, and the
   thing exists — the same rule every country, creature and landmark keeps. */
EARTH.block({
  id:'clay-band', name:'Banded Clay',
  tex:{top:'badTop',side:'badSide'},
  hardness:1.1,         /* seconds to break it by hand */
  tool:'spade', drops:'clay-band',
  opaque:true, gravity:false
});
