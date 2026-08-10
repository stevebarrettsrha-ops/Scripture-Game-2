/* TRODDEN WAY — path

   Where enough feet have gone, the grass gives up. Every village on the
   earth is joined to its well and its fields by this and nothing else.

   One block, one file. Add a file, add a line to world/manifest.js, and the
   thing exists — the same rule every country, creature and landmark keeps. */
EARTH.block({
  id:'path', name:'Trodden Way',
  tex:{top:'path',side:'dirt',bottom:'dirt'},
  hardness:0.85,         /* seconds to break it by hand */
  tool:'spade', drops:'dirt',
  opaque:true, gravity:false
});
