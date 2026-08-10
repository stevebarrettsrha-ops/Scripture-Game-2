/* PLANKS — planks

   Timber sawn and laid. Decks, floors, doors, piers and the hulls of ships.

   One block, one file. Add a file, add a line to world/manifest.js, and the
   thing exists — the same rule every country, creature and landmark keeps. */
EARTH.block({
  id:'planks', name:'Planks',
  tex:{all:'planks'},
  hardness:1.8,         /* seconds to break it by hand */
  tool:'axe', drops:'planks',
  opaque:true, gravity:false
});
