/* CARVED BOARD — carved-panel

   The second remove, and the whole argument for a bench: a board that has
   been worked, and then worked again. Nothing a man does standing in a field
   gets him here — he wants a place to put the board down and a knife in his
   hand, and that is what a bench is for.

   WHAT IS CUT INTO IT. The verse names three things: keruḇim, palm trees and
   open flowers. The face draws the palm and the flower and leaves the
   keruḇim to the words — a keruḇ in sixteen pixels would be a smudge making
   a claim this game has no business making. The reason is written here and
   again beside the texture, because it is a decision and not an oversight.

   One block, one file, appended at the END of world/manifest.js — a block's
   number is its place in that list, and those numbers live in every save. */
EARTH.block({
  id:'carved-panel', name:'Carved Board',
  tex:{all:'carved'},
  hardness:1.6,         /* seconds to break it by hand */
  tool:'axe', drops:'carved-panel',
  opaque:true, gravity:false,
  verse:{ t:'And he carved all the walls of the House all around, both inside and outside, with carved figures of keruḇim and palm trees and open flowers.',
          ref:'MELAKIM ALEPH 6:29' }
});
