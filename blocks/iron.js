/* IRON — iron

   The metal itself, off the smelting — not the ore, which lies in the
   hills of the lands DEḆARIM 8:9 names and has since Round 39. It ships
   now and not before because the catalogue rule of §4 finally has its
   reason: A SUBSTANCE SHIPS WHEN A WORK NEEDS IT, and the iron pick needs
   this. (Copper's ore is in the ground because the land holds it; its
   metal still waits for a work that wants it, and bronze waits on a tin
   no land's list holds.)

   IT IS NOT SET DOWN. `place:false` — an ingot is not a cubic metre of
   iron; it is carried, and it is spent at the works.

   One block, one file. Add a file, add a line to world/manifest.js. */
EARTH.block({
  id:'iron', name:'Iron',
  tex:{all:'ironBar'},
  hardness:1.0,
  tool:null, drops:'iron',
  place:false,
  opaque:true, gravity:false,
  verse:{ t:'Iron is taken from the earth and copper is smelted from ore.',
          ref:'IYOḆ 28:2' }
});
