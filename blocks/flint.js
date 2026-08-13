/* FLINT — the dark stone that breaks in shells

   Struck, it gives an edge sharper than any bronze, and it gives fire. It
   lies in the chalk and the limestone, in nodules, not in seams.

   One block, one file. Add a file, add a line to world/manifest.js. */
EARTH.block({
  id:'flint', name:'Flint',
  tex:{all:'flint'},
  hardness:2.0,
  tool:'pick', drops:'flint',
  opaque:true, gravity:false,
  verse:{ t:'Who brought you water out of the rock of flint.',
          ref:'DEḆARIM 8:15' }
});
