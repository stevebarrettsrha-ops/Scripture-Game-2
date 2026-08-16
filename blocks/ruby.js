/* RUBY — a stone of the breastplate

   §4: "rare, deep, worth the descent". It grows in the walls of the deep
   chambers and nowhere else, which is what makes going down into them worth
   the candle. Named as SHEMOTH names it — see tools/extract-besorah.js.

   One block, one file. Add a file, add a line to world/manifest.js. */
EARTH.block({
  id:'ruby', name:'Ruby',
  tex:{all:'ruby'},
  hardness:5.0,         /* seconds to break it by hand — it is not soft */
  tool:'pick', drops:'ruby',
  opaque:true, gravity:false,
  verse:{ t:'The first row is a ruby, a topaz and an emerald;',
          ref:'SHEMOTH 28:17' }
});
