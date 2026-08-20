/* FLINT — the dark stone that breaks in shells

   Struck, it gives an edge sharper than any bronze, and it gives fire. It
   lies in the chalk and the limestone, in NODULES, NOT IN SEAMS — and that is
   why it asks for a spade and not a pick.

   IT IS THE FIRST THING A MAN HAS, AND EVERYTHING ELSE HANGS ON IT. A pick is
   made of flint; so is an axe, a spade, a knife. While this named a pick, the
   world was closed on itself — the flint wanted the pick that wanted the
   flint — and in a whole voyage no tool could be made and no rock, ore,
   timber or earth could be broken at all. A nodule is picked out of the chalk
   of a cave wall with the fingers, slowly, or dug out with a spade at once,
   and that is exactly what the tool tiers in js/engine.js now say.

   One block, one file. Add a file, add a line to world/manifest.js. */
EARTH.block({
  id:'flint', name:'Flint',
  tex:{all:'flint'},
  hardness:2.0,
  tool:'spade', drops:'flint',
  opaque:true, gravity:false,
  verse:{ t:'who brought water for you out of the flinty rock',
          ref:'DEḆARIM 8:15' }
});
