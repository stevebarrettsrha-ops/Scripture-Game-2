/* COPPER ORE — the copper of the Aravah

   Out of the hills of that valley it is dug, and the mines of Timna are the
   oldest workings in the land. It is the metal the first tools are of.

   One block, one file. Add a file, add a line to world/manifest.js. */
EARTH.block({
  id:'copper-ore', name:'Copper in the Rock',
  tex:{all:'copperOre'},
  hardness:3.2,
  tool:'pick', drops:'copper-ore',
  opaque:true, gravity:false,
  verse:{ t:'a land whose stones are iron and out of whose hills you dig copper.',
          ref:'DEḆARIM 8:9' }
});
