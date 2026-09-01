/* SOWN GROUND, BARLEY — tilled earth with the seed in it

   As blocks/soil-wheat.js, for the barley: the standing corn is cross
   geometry the mesher draws over the sown cell with the village fields' own
   `crop` material, so the vertex-shader year rules it — sown any day, risen
   at the latitude's seedtime, gilded when ripe. Broken, it gives the seed
   back. */
EARTH.block({
  id:'soil-barley', name:'Sown Barley',
  tex:{top:'soil',side:'dirt',bottom:'dirt'},
  hardness:0.5,
  tool:null, drops:'seed-barley',
  crop:'barley',       /* the kind standing in it (§17.4) */
  opaque:true, gravity:false,
  verse:{ t:'“For in this the word is true, ‘One sows and another reaps.’',
          ref:'YAHUCHANON 4:37' }
});
