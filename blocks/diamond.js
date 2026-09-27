/* ================= DIAMOND =================
   The third stone of the second row of the breastplate, and the hardest
   thing in the ground. It lies only in the last few courses above the
   foundations of the earth, in small veins and seldom — the rarest ore of
   all, as it is in the real earth and in the other game alike — and it
   will not give to a pick of flint. It wants IRON (`tier:2`).

   One block, one file. Add a file, add a line to world/manifest.js. */
EARTH.block({
  id:'diamond', name:'Diamond',
  tex:{all:'diamond'},
  hardness:7.5,         /* seconds to break it by hand — the hardest stone there is */
  tool:'pick', tier:2, drops:'diamond',
  opaque:true, gravity:false,
  verse:{ t:'The sin of Yahuḏah is written with a pen of iron, engraved with the point of a diamond on the tablet of their heart and on the horns of your mizbe\'achot,',
          ref:'YIRMAYAHU 17:1' }
});
