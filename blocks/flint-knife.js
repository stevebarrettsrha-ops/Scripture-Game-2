/* KNIVES OF FLINT — a tool, and a tool is a thing you HOLD

   Struck from a nodule, it takes an edge no bronze will hold, and it is
   commanded by name. It breaks nothing faster than a hand does — it is not
   for stone — but it is the first made thing in the world.

   IT IS NOT SET DOWN. `place:false` — a pick is not a cubic metre of
   pick, and a world where a man paves his yard with hoes is not this
   one. It is made at world/works.js and it serves in the hand.

   One block, one file. Add a file, add a line to world/manifest.js. */
EARTH.block({
  id:'flint-knife', name:'Knives of Flint',
  tex:{all:'flintKnife'},
  hardness:1.0,
  tool:null, drops:'flint-knife',
  serves:'knife',       /* what it serves as in the hand */
  place:false,
  opaque:true, gravity:false,
  verse:{ t:'Make knives of flint for yourself and circumcise the sons of Yasharal again the second time.',
          ref:'YEHOSHUA 5:2' }
});
