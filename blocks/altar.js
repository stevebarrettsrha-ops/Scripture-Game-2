/* AN ALTAR OF UNHEWN STONE

   Twelve stones as they came out of the ground. A chisel taken to any one of
   them and it is not an altar — which world/works.js enforces, and which is
   the only reason this block is worth having.

   One block, one file. Add a file, add a line to world/manifest.js. */
EARTH.block({
  id:'altar', name:'An Altar of Unhewn Stone',
  tex:{all:'altar'},
  hardness:4.0,
  tool:'pick', drops:'altar',
  opaque:true, gravity:false,
  verse:{ t:"And if you make Me an mizbe'ach of stone, do not build it of cut stone",
          ref:'SHEMOTH 20:25' }
});
