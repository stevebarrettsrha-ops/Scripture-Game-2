/* A BUCKET — the hand's own way into the water

   IT IS NOT SET DOWN. `place:false`, as every held thing in this world is: a
   bucket is not a cubic metre of bucket. What it does is done with it in the
   hand, at the block the arm is pointing at.

   AND THE ENGINE KNOWS NO BUCKET BY NAME. It knows only `serves:'bucket'` —
   the same datum a pick and an axe carry — and `fills`, which names what this
   thing BECOMES when it is dipped. Everything else about the act (the water
   is a source, a source is a deed, the stream that runs out of it is not) is
   js/water.js's business and was there before this file.

   One block, one file. Add a file, add a line to world/manifest.js. */
EARTH.block({
  id:'bucket', name:'A Bucket',
  tex:{all:'bucket'},
  hardness:1.0,
  tool:null, drops:'bucket',
  serves:'bucket',     /* what it serves as in the hand */
  fills:'water-bucket',/* and what it becomes when it is dipped in water */
  place:false,
  opaque:true, gravity:false
});
