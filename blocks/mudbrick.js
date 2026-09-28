/* ================= MUD BRICK =================
   The wall of nearly every house of the ancient world: the land's own earth
   mixed with chopped straw, pressed in a mould and dried in the sun, laid on
   a footing of stone so the ground-damp does not dissolve it. The villages
   of the east, Egypt, the Two Rivers, Persia and the dry lands of the west
   are built of it.

   One block, one file. Add a file, add a line to world/manifest.js. */
EARTH.block({
  id:'mudbrick', name:'Mud Brick',
  tex:{all:'mudbrick'},
  hardness:1.6,
  tool:'pick', drops:'mudbrick',
  opaque:true, gravity:false,
  verse:{ t:'“You are no longer to give the people straw to make bricks as before. Let them go and gather straw for themselves.',
          ref:'SHAMOTH 5:7' }
});
