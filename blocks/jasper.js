/* JASPER — a stone of the breastplate

   §4: "rare, deep, worth the descent". It grows in the walls of the deep
   chambers and nowhere else, which is what makes going down into them worth
   the candle. Named as SHEMOTH names it — see tools/extract-besorah.js.

   One block, one file. Add a file, add a line to world/manifest.js. */
EARTH.block({
  id:'jasper', name:'Jasper',
  tex:{all:'jasper'},
  hardness:5.0,         /* seconds to break it by hand — it is not soft */
  tool:'pick', drops:'jasper',
  opaque:true, gravity:false,
  verse:{ t:'the fourth row is a beryl and a shoham and a jasper. They are set in gold settings.',
          ref:'SHEMOTH 28:20' }
});
