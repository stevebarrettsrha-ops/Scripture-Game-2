/* SEED WHEAT — a handful of grain kept back from the grinding

   The other half of the harvest: what is not eaten is sown. It is not SET
   DOWN — `place:false`, a seed is not a cubic metre of seed — it is put IN
   the ground: held over tilled ground, it sows, and the standing crop keeps
   the land's own calendar (world/crops.js, the same registry the village
   fields read).

   `sows` names the crop KIND, not a block — the engine looks the kind up in
   world/crops.js and the sown ground carries it, so the engine never knows
   wheat by name here any more than it does in a village field.

   It is come by at the threshing (world/works.js), never out of the free
   hand's stores — a man who could take seed out of the air would never
   thresh. One block, one file. */
EARTH.block({
  id:'seed-wheat', name:'Seed Wheat',
  tex:{all:'seedGrain'},
  hardness:0.2,
  tool:null, drops:'seed-wheat',
  sows:'wheat',        /* the kind it puts in tilled ground (§17.4) */
  place:false,
  opaque:true, gravity:false,
  verse:{ t:'“For as the rain comes down and the snow from the shamayim and do not return there, but water the earth and make it bring forth and bud and give seed to the sower and bread to the eater,',
          ref:'YASHAYAHU 55:10' }
});
