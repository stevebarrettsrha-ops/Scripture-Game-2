/* LEAF — olive leaves

   The olive's crown as a block: the grey leaf the whole flora wears, but its own and open (leafOlive,
   js/engine.js — its holes gathered into gaps, so the low sun comes through the crown in shafts),
   tinted the olive's own grey-green, silver where the wind turns the leaves. The groves of the Mount
   of Olives and Gat-Shemen are built of it (story/world.js, W.olive).

   Appended to world/manifest.js after the last block, by its append-only rule. */
EARTH.block({
  id:'leaves-olive', name:'Olive leaf',
  tex:{all:'leafOlive'},
  hardness:0.3,
  tool:null, drops:null,
  tint:[118,136,96],
  opaque:false, gravity:false
});
