/* TIMBER — the olive bole

   An old olive's trunk: grain twisting round the bole like a rope (barkTwist), the grey-brown bark
   of the olive out of world/palette.js. It drops the one Timber, as every bark-faced log does.

   Appended to world/manifest.js after the last block, by its append-only rule. */
EARTH.block({
  id:'log-olive', name:'Timber',
  tex:{all:'barkTwist'},
  hardness:2.0,
  tool:'axe', drops:'log',
  tint:PALETTE.wood.olive.bark,
  opaque:true, gravity:false
});
