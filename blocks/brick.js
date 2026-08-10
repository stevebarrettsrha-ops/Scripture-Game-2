/* BAKED BRICK — brick

   “Come, let us make bricks and bake them thoroughly.” Clay squared in a
   mould and burnt hard — the material of Baḇel, and the first thing men
   ever made in order to build higher than the stone of their own country
   would let them.

   One block, one file. Add a file, add a line to world/manifest.js, and the
   thing exists — the same rule every country, creature and landmark keeps. */
EARTH.block({
  id:'brick', name:'Baked Brick',
  tex:{all:'brick'},
  hardness:2.6,         /* seconds to break it by hand */
  tool:'pick', drops:'brick',
  opaque:true, gravity:false,
  verse:{ t:'And they said to each other, “Come, let us make bricks and bake them thoroughly.” And they had brick for stone and they had asphalt for mortar.',
          ref:'BERĔSHITH 11:3' }
});
