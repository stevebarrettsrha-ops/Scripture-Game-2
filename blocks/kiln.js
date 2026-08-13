/* A KILN — the fire a work is done at

   The only thing in this game that is a PLACE rather than a thing. Brick,
   tile and glass are not made in a man's hands: "let us make bricks and bake
   them thoroughly" is a method, and this is where it is done. Set one down
   and stand near it, and the works of the fire open.

   One block, one file. Add a file, add a line to world/manifest.js. */
EARTH.block({
  id:'kiln', name:'A Kiln',
  tex:{ all:'kilnSide', top:'kilnTop' },
  hardness:3.2,
  tool:'pick', drops:'kiln',
  light:9,              /* it is burning */
  opaque:true, gravity:false,
  verse:{ t:'And they said to each other, “Come, let us make bricks and bake them thoroughly.” And they had brick for stone and they had asphalt for mortar.',
          ref:'BERĔSHITH 11:3' }
});
