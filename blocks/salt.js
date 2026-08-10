/* SALT — salt

   Crusted white along the shores of the Salt Sea, where nothing lives in the
   water and nothing grows on the strand.

   One block, one file. Add a file, add a line to world/manifest.js, and the
   thing exists — the same rule every country, creature and landmark keeps. */
EARTH.block({
  id:'salt', name:'Salt',
  tex:{all:'salt'},
  hardness:1.0,         /* seconds to break it by hand */
  tool:'pick', drops:'salt',
  opaque:true, gravity:false,
  verse:{ t:'All these joined together in the Valley of Siddim, that is the Salt Sea.',
          ref:'BERĔSHITH 14:3' }
});
