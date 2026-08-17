/* A BUCKET OF WATER — the same bucket, carrying

   "And he said, Draw out now, and bear unto the governor of the feast."

   THE OTHER HALF of blocks/bucket.js, and it is a second thing rather than a
   flag on the first because that is how the satchel counts: a man may carry
   three full and two empty, and a stack is of one kind.

   `empties` names what it becomes when it is poured out. The pouring itself
   lays a SOURCE — never a cube of water hanging in the air — which is
   js/water.js's whole business, and because a hand laid it, it is a DEED and
   is in the world when he sails back. What runs out of it is not, and is
   worked out again from the source. */
EARTH.block({
  id:'water-bucket', name:'A Bucket of Water',
  tex:{all:'bucketFull'},
  hardness:1.0,
  tool:null, drops:'water-bucket',
  serves:'bucket',
  empties:'bucket',    /* what it becomes when it is poured out */
  place:false,
  opaque:true, gravity:false
});
