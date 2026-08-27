/* TIMBER — the smooth-bark bole (§2.4.3 kept on the felled tree)

   The same Timber as blocks/log.js, wearing its own tree's bark. Round 61
   switched the boles off partly because a bole drawn as a block lost its
   bark — one block, one face, six barks collapsed to it. Round 86 found the
   trade was never forced: a block DROPS what its `drops` names, so six
   bark-faced blocks all give the one Timber, and a stack of logs is still a
   stack of logs whichever wood it came from. The eye keeps the birch and
   the cork-oak; the satchel keeps one kind.

   The face is the very material the crown's geometry has worn since
   §2.4.3 — barkSmooth — so the felled bole and the standing one are one look. */
EARTH.block({
  id:'log-smooth', name:'Timber',
  tex:{all:'barkSmooth'},
  hardness:2.0,
  tool:'axe', drops:'log',
  opaque:true, gravity:false
});
