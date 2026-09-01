/* SOWN GROUND, WHEAT — tilled earth with the seed in it

   The crop is not a block standing ON this; it is the crop OF this block.
   The mesher draws the standing corn as cross geometry over the sown cell
   (the same crosses, the same `crop` material and the same vertex-shader
   year as every village field), so a hand-sown crop is sunk out of season,
   rises at the latitude's own seedtime, gilds when it ripens, and costs the
   frame nothing — the year lives in the shader, not in a rebuild.

   `crop` names the kind in world/crops.js; `drops` gives the seed back when
   the ground is broken — a man who digs up his field is out his labour, not
   his seed. The faces are tilled ground still: the corn is the cross, and
   the block under it stays a field. */
EARTH.block({
  id:'soil-wheat', name:'Sown Wheat',
  tex:{top:'soil',side:'dirt',bottom:'dirt'},
  hardness:0.5,
  tool:null, drops:'seed-wheat',
  crop:'wheat',        /* the kind standing in it (§17.4) */
  opaque:true, gravity:false,
  verse:{ t:'as long as the earth remains, seedtime and harvest and cold and heat and winter and summer and day and night shall not cease.”',
          ref:'BERĔSHITH 8:22' }
});
