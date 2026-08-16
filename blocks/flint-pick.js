/* A PICK OF FLINT — a tool, and a tool is a thing you HOLD

   Flint lashed to a haft of riven plank. It is what makes the rock of the
   hills worth walking into: held, the stone gives in a fraction of the time
   a bare hand takes.

   IT IS NOT SET DOWN. `place:false` — a pick is not a cubic metre of
   pick, and a world where a man paves his yard with hoes is not this
   one. It is made at world/works.js and it serves in the hand.

   One block, one file. Add a file, add a line to world/manifest.js. */
EARTH.block({
  id:'flint-pick', name:'A Pick of Flint',
  tex:{all:'flintPick'},
  hardness:1.0,
  tool:null, drops:'flint-pick',
  serves:'pick',       /* what it serves as in the hand */
  place:false,
  opaque:true, gravity:false
});
