/* GOLD ORE — the gold of Havilah, still in the rock

   "And the gold of that land is good." It is named in the second chapter of
   the whole book, before any city or any nation, and it is the reason a man
   goes down into the dark.

   One block, one file. Add a file, add a line to world/manifest.js, and the
   thing exists — the same rule every country, creature and landmark keeps. */
EARTH.block({
  id:'gold-ore', name:'Gold in the Rock',
  tex:{all:'goldOre'},
  hardness:4.5,         /* seconds to break it by hand */
  tool:'pick', drops:'gold-ore',
  opaque:true, gravity:false,
  verse:{ t:'And the gold of that land is good. Bdellium and the onyx stone are there.',
          ref:'BERĔSHITH 2:12' }
});
