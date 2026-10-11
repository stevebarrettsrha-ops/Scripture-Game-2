/* GLAZED BRICK — brick fired with a blue glaze, as the shrine on the top of Etemenanki was faced
   and the gate of Ishtar after it.

   One block, one file. Add a file, add a line to world/manifest.js. */
EARTH.block({
  id:'glazed-brick', name:'Glazed Brick',
  tex:{all:'glazedBrick'},
  hardness:2.5,
  tool:'pick', drops:'glazed-brick',
  opaque:true, gravity:false
});
