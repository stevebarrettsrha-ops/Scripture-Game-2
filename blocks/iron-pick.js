/* A PICK OF IRON — the same tool in a better metal

   The reason the smelting exists. `serves:'pick'` exactly as the flint
   pick serves, and `speed` is the whole of the difference: the rock gives
   to it a little over twice as fast. Declared here, believed in exactly
   one place (`toolSpeed`), the same pattern `hardness` set — no tier
   table, no upgrade tree, one number on the thing itself.

   IT IS NOT SET DOWN. `place:false` — a pick is not a cubic metre of
   pick. It is made at world/works.js and it serves in the hand.

   One block, one file. Add a file, add a line to world/manifest.js. */
EARTH.block({
  id:'iron-pick', name:'A Pick of Iron',
  tex:{all:'ironPick'},
  hardness:1.0,
  tool:null, drops:'iron-pick',
  serves:'pick', speed:2.2,
  place:false,
  opaque:true, gravity:false
});
