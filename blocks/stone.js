/* HEWN STONE — stone

   The stone of that world is limestone: warm, bedded, and soft enough that
   men cut it with bronze. It is what every wall from Yeriḥo to Yerushalayim
   is made of, and the commonest hard thing a traveller will break.

   One block, one file. Add a file, add a line to world/manifest.js, and the
   thing exists — the same rule every country, creature and landmark keeps. */
EARTH.block({
  id:'stone', name:'Hewn Stone',
  tex:{all:'stone'},
  hardness:3.4,         /* seconds to break it by hand */
  tool:'pick', drops:'stone',
  opaque:true, gravity:false
});
