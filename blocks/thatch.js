/* ================= THATCH =================
   Straw and reed laid in overlapping courses: the roof of the round houses
   of the north and of the huts of the south, steep so the rain runs off it.

   One block, one file. Add a file, add a line to world/manifest.js. */
EARTH.block({
  id:'thatch', name:'Thatch',
  tex:{all:'thatch'},
  hardness:0.6,
  tool:'knife', drops:'thatch',
  opaque:true, gravity:false
});
