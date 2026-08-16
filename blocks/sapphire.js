/* SAPPHIRE — a stone of the breastplate

   §4: "rare, deep, worth the descent". It grows in the walls of the deep
   chambers and nowhere else, which is what makes going down into them worth
   the candle. Named as SHEMOTH names it — see tools/extract-besorah.js.

   One block, one file. Add a file, add a line to world/manifest.js. */
EARTH.block({
  id:'sapphire', name:'Sapphire',
  tex:{all:'sapphire'},
  hardness:5.0,         /* seconds to break it by hand — it is not soft */
  tool:'pick', drops:'sapphire',
  opaque:true, gravity:false,
  verse:{ t:'the second row is a turquoise, a sapphire and a diamond;',
          ref:'SHEMOTH 28:18' }
});
