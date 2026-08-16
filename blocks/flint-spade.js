/* A SPADE OF FLINT — a tool, and a tool is a thing you HOLD

   For the ground — the earth, the sand and the soil, which are soft and
   slow and are exactly what a man moves most of.

   IT IS NOT SET DOWN. `place:false` — a pick is not a cubic metre of
   pick, and a world where a man paves his yard with hoes is not this
   one. It is made at world/works.js and it serves in the hand.

   One block, one file. Add a file, add a line to world/manifest.js. */
EARTH.block({
  id:'flint-spade', name:'A Spade of Flint',
  tex:{all:'flintSpade'},
  hardness:1.0,
  tool:null, drops:'flint-spade',
  serves:'spade',       /* what it serves as in the hand */
  place:false,
  opaque:true, gravity:false
});
