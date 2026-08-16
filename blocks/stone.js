/* UNHEWN STONE — the living rock, as it comes out of the ground

   The stone of that world is limestone: warm, bedded, and soft enough that
   men cut it with bronze. It is what every hill is made of and what every
   shaft is driven through, and it is the commonest hard thing a traveller
   will break.

   AND IT IS UNHEWN, which is not a flourish. §4: *"hewn stone, unhewn stone
   (an altar of hewn stone is forbidden — that ought to matter in the
   recipe)"*. It matters here. This block is the rock AS FOUND; dressing it
   is a WORK a man does to it with an iron, and what that work gives is
   `hewn-stone`, a different block with a different face. The altar of
   world/works.js takes this one and refuses that one, and it can only do
   that because the two are truly distinct things in the world rather than
   one thing with two names.

   Its id is still `stone` and always will be: an id is never renumbered nor
   renamed, and every save ever written, every structure that stamps stone
   and every line of KIND_BLOCK depends on it. What changed is what a man
   READS when he holds it, which is what was wrong.

   One block, one file. Add a file, add a line to world/manifest.js, and the
   thing exists — the same rule every country, creature and landmark keeps. */
EARTH.block({
  id:'stone', name:'Unhewn Stone',
  tex:{all:'stone'},
  hardness:3.4,         /* seconds to break it by hand */
  tool:'pick', drops:'stone',
  opaque:true, gravity:false
});
