/* PANELLED BOARD — panel

   The first thing in this world that stands between a plank and a building.
   A riven plank is what a log gives; a panelled board is what a man makes of
   the plank, standing at a bench, and there was nowhere to make one until
   there was a bench to stand at.

   It reads as boards on end where a plank reads as courses across — which is
   how the House was paneled, floor to ceiling, on the inside.

   One block, one file. Add a file, add a line to world/manifest.js, and the
   thing exists — the same rule every country, creature and landmark keeps.
   (Appended at the END of the manifest, out of alphabet, on purpose: a
   block's number is its place in that list, and those numbers live in every
   save's edit records.) */
EARTH.block({
  id:'panel', name:'Panelled Board',
  tex:{all:'panel'},
  hardness:1.6,         /* seconds to break it by hand */
  tool:'axe', drops:'panel',
  opaque:true, gravity:false,
  verse:{ t:'And he built the walls of the House inside with cedar boards, from the floor of the House to the ceiling he panelled them on the inside with wood and covered the floor of the House with planks of cypress.',
          ref:'MELAKIM ALEPH 6:15' }
});
