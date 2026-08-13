/* IRON ORE — a land whose stones are iron

   The commonest of the metals worth the digging, and the one the tools of
   the works are made of.

   One block, one file. Add a file, add a line to world/manifest.js. */
EARTH.block({
  id:'iron-ore', name:'Iron in the Rock',
  tex:{all:'ironOre'},
  hardness:3.5,
  tool:'pick', drops:'iron-ore',
  opaque:true, gravity:false,
  verse:{ t:'a land whose stones are iron and out of whose hills you dig copper.',
          ref:'DEḆARIM 8:9' }
});
