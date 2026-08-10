/* PANE — glass

   Sand burnt until it runs. Old glass is green and never quite clear, and it
   lets the light through without letting the weather in — which is the whole
   of why a window is worth the trouble.
   It shatters: broken, there is nothing left to pick up.

   One block, one file. Add a file, add a line to world/manifest.js, and the
   thing exists — the same rule every country, creature and landmark keeps. */
EARTH.block({
  id:'glass', name:'Pane',
  tex:{all:'glass'},
  hardness:0.5,         /* seconds to break it by hand */
  tool:null, drops:null,
  opaque:false, gravity:false
});
