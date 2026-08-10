/* SLIME — bitumen

   The asphalt of the pits of Siddim: black, sticky, and the mortar that held
   Baḇel together. It is also what the ark was covered with, inside and out.

   One block, one file. Add a file, add a line to world/manifest.js, and the
   thing exists — the same rule every country, creature and landmark keeps. */
EARTH.block({
  id:'bitumen', name:'Slime',
  tex:{all:'bitumen'},
  hardness:1.4,         /* seconds to break it by hand */
  tool:'spade', drops:'bitumen',
  opaque:true, gravity:false,
  verse:{ t:'“Make yourself an ark of gopherwood. Make rooms in the ark and cover it inside and outside with tar.',
          ref:'BERĔSHITH 6:14' }
});
