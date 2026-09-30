/* ================= THE FOUNDATIONS OF THE EARTH =================
   The floor under every land, some fifty courses beneath the level of the
   sea. It is the one block no hand breaks and no tool serves: the engine
   refuses it by its `unbreakable` word, and the mesher never needs to draw
   what lies under it, because nothing does.

   One block, one file. Add a file, add a line to world/manifest.js, and the
   thing exists — the same rule every country, creature and landmark keeps. */
EARTH.block({
  id:'bedrock', name:'The Foundations of the Earth',
  tex:{all:'bedrock'},
  hardness:9999,
  tool:'pick', drops:null,
  unbreakable:true,
  place:false,
  opaque:true, gravity:false,
  verse:{ t:'Where were you when I laid the foundations of the earth? Declare, if you have understanding.',
          ref:'IYOḆ 38:4' }
});
