/* BASALT — the black stone of the lake of Galil

   The towns about the Sea of Galil — Kephar Naḥum, Korazin, Bĕyth Tsaiḏa — were built of
   the black volcanic stone of that shore: rough field-stones pitted by the fire, laid in
   courses with mud between. Harder to break than limestone, and darker than any wall of
   Yahuḏah.

   One block, one file. Add a file, add a line to world/manifest.js. */
EARTH.block({
  id:'basalt', name:'Basalt',
  tex:{all:'basalt'},
  hardness:3.4,
  tool:'pick', drops:'basalt',
  opaque:true, gravity:false
});
