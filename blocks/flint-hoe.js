/* A HOE OF FLINT — a tool, and a tool is a thing you HOLD

   For the tilled bed. The one tool in this list whose work is not
   breaking but turning.

   IT IS NOT SET DOWN. `place:false` — a pick is not a cubic metre of
   pick, and a world where a man paves his yard with hoes is not this
   one. It is made at world/works.js and it serves in the hand.

   One block, one file. Add a file, add a line to world/manifest.js. */
EARTH.block({
  id:'flint-hoe', name:'A Hoe of Flint',
  tex:{all:'flintHoe'},
  hardness:1.0,
  tool:null, drops:'flint-hoe',
  serves:'hoe',       /* what it serves as in the hand */
  place:false,
  opaque:true, gravity:false
});
