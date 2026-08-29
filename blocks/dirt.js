/* EARTH — dirt

   “For dust you are and to dust you return.” The ground under everything:
   turned for a field, heaped for a bank, and the first thing any man digs.

   One block, one file. Add a file, add a line to world/manifest.js, and the
   thing exists — the same rule every country, creature and landmark keeps. */
EARTH.block({
  id:'dirt', name:'Earth',
  tex:{all:'dirt'},
  hardness:0.9,         /* seconds to break it by hand */
  tool:'spade', drops:'dirt',
  tills:'soil',         /* what the hoe turns it to */
  opaque:true, gravity:false,
  verse:{ t:'“By the sweat of your face you are to eat bread until you return to the ground, for out of it you were taken. For dust you are and to dust you return.”',
          ref:'BERĔSHITH 3:19' }
});
