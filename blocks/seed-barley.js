/* SEED BARLEY — the poorer man's corn, and the first of the year to come in

   Barley ripens before wheat — Ruth reached Bĕyth Leḥem at the beginning of
   the barley harvest and stayed through the wheat's — and the land's own
   calendar in world/crops.js keeps that year for whatever is sown of this.
   `place:false`: a seed is put IN tilled ground, not set on it. Come by at
   the threshing (world/works.js). One block, one file. */
EARTH.block({
  id:'seed-barley', name:'Seed Barley',
  tex:{all:'seedGrain'},
  hardness:0.2,
  tool:null, drops:'seed-barley',
  sows:'barley',       /* the kind it puts in tilled ground (§17.4) */
  place:false,
  opaque:true, gravity:false,
  verse:{ t:'Thus Na‛omi returned and Ruth the Mo’aḇitess her daughter-in-law with her, who returned from the fields of Mo’aḇ and they came to Bĕyth Leḥem at the beginning of barley harvest.',
          ref:'RUTH 1:22' }
});
