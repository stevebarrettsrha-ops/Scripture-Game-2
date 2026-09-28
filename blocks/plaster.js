/* ================= LIME PLASTER =================
   The white wash of lime laid over brick and over rubble — the face of the
   houses of Egypt and of the better houses everywhere, and the daub over the
   wattle in the north.

   One block, one file. Add a file, add a line to world/manifest.js. */
EARTH.block({
  id:'plaster', name:'Plastered Wall',
  tex:{all:'plaster'},
  hardness:1.4,
  tool:'pick', drops:'plaster',
  opaque:true, gravity:false,
  verse:{ t:'“And they shall take other stones and put them in the place of those stones and take other mortar and plaster the house.',
          ref:'WAYYIQRA 14:42' }
});
