/* SEED CORN — seed

   The one substance of the sowing, and it is deliberately ONE: in the
   satchel it is the seed, and set down on tilled ground it IS the sown
   cell — the same rule the bucket keeps, where the vessel and its water
   are one thing in two states. WHICH corn comes up is not written here or
   anywhere: the sown cell bears what its own country sows, asked of
   js/crop.js exactly as a village field asks it, so a seed sown in Egypt
   comes up wheat and the same seed sown in Java comes up rice.

   THE FIELDS IT DECLARES, AND WHAT EACH ONE MEANS TO THE ENGINE
   sown      it stands in its cell as a growing plant, not a cube: drawn as
             the land's own crop reading the year, walked through, and it
             comes away at a touch
   bed       what it must stand on — a seed will take no ground but the
             tilled bed the hoe turns
   increase  what a FULL-GROWN plant gives over the seed that went in when
             it is reaped; a young shoot gives only the seed back

   One block, one file. Add a file, add a line to world/manifest.js, and the
   thing exists — the same rule every country, creature and landmark keeps.
   (It is appended at the END of the manifest, out of alphabet, on purpose:
   a block's number is its place in that list, and the numbers live in
   every save's edit records.) */
EARTH.block({
  id:'seed', name:'Seed Corn',
  tex:{all:'seedT'},
  hardness:0.05,        /* a plant comes away at a touch */
  tool:null, drops:'seed',
  sown:true, bed:'soil', increase:3,
  opaque:false, gravity:false,
  verse:{ t:'Sow your seed in the morning and until evening do not let your hand rest; since you do not know which prosper, this or that, or whether both alike are good.',
          ref:'QOHELETH 11:6' }
});
