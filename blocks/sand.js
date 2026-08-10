/* SAND — sand

   It will not stand on nothing. Dig out what is under a bank of it and the
   whole bank comes down, which is the first thing the desert teaches.

   One block, one file. Add a file, add a line to world/manifest.js, and the
   thing exists — the same rule every country, creature and landmark keeps. */
EARTH.block({
  id:'sand', name:'Sand',
  tex:{all:'sand'},
  hardness:0.7,         /* seconds to break it by hand */
  tool:'spade', drops:'sand',
  opaque:true, gravity:true
});
