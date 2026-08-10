/* WATER — water

   “Let the waters under the shamayim be gathered together into one place.”
   It is not broken and it is not placed by hand; it flows, and §6 gives it
   its finite spread.

   One block, one file. Add a file, add a line to world/manifest.js, and the
   thing exists — the same rule every country, creature and landmark keeps. */
EARTH.block({
  id:'water', name:'Water',
  tex:{all:'waterB'},
  hardness:null,        /* it is not broken by hand at all */
  tool:null, drops:null,
  opaque:false, gravity:false, liquid:true,
  verse:{ t:'And Aluahim said, “Let the waters under the shamayim be gathered together into one place and let the dry land appear.” And it came to be so.',
          ref:'BERĔSHITH 1:9' }
});
