/* A FURNACE — the fire the ORE wants, and it is built of BRICK

   The kiln's pattern one step up: the second thing in this game that is a
   PLACE rather than a thing. Its body is the very brick the kiln bakes —
   the first time one work's product is another work's material — and its
   fire burns hotter, because "iron is taken from the earth" is not done
   over a clay-fire. Set one down and stand near it, and the smelting opens.

   The account knows this furnace by name: the iron furnace of Mitsrayim.

   One block, one file. Add a file, add a line to world/manifest.js.
   (Appended at the END of the manifest, out of alphabet, on purpose: a
   block's number is its place in that list.) */
EARTH.block({
  id:'furnace', name:'A Furnace',
  tex:{ all:'furnSide', top:'furnTop' },
  hardness:3.6,
  tool:'pick', drops:'furnace',
  light:11,             /* it burns hotter than the kiln's 9 */
  opaque:true, gravity:false,
  verse:{ t:'“But (YAHUAH) HWHY has taken you and brought you out of the iron furnace, out of Mitsrayim, to be His people, an inheritance, as it is today.',
          ref:'DEḆARIM 4:20' }
});
