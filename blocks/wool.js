/* FLEECE — wool

   Off the sheep's back, washed and beaten into a felt. The tents of the
   nomads are made of the black goat-hair; this is the white of the flocks.

   One block, one file. Add a file, add a line to world/manifest.js, and the
   thing exists — the same rule every country, creature and landmark keeps. */
EARTH.block({
  id:'wool', name:'Fleece',
  tex:{all:'wool'},
  hardness:0.7,         /* seconds to break it by hand */
  tool:null, drops:'wool',
  opaque:true, gravity:false
});
