/* SILVER ORE — silver in the rock

   The metal of the ransom and of the reckoning: a shekel of silver is what a
   thing is weighed against, and a field is bought with it.

   One block, one file. Add a file, add a line to world/manifest.js. */
EARTH.block({
  id:'silver-ore', name:'Silver in the Rock',
  tex:{all:'silverOre'},
  hardness:3.8,
  tool:'pick', drops:'silver-ore',
  opaque:true, gravity:false,
  verse:{ t:'For there is a mine for silver, and a place for gold that they refine.',
          ref:'IYOḆ 28:1' }
});
