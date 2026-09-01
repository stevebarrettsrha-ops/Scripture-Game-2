/* TIMBER — the paper-bark bole (§2.4.3 kept on the felled tree)

   The same Timber as blocks/log.js, wearing its own tree's bark. Round 61
   switched the boles off partly because a bole drawn as a block lost its
   bark — one block, one face, six barks collapsed to it. Round 86 found the
   trade was never forced: a block DROPS what its `drops` names, so six
   bark-faced blocks all give the one Timber, and a stack of logs is still a
   stack of logs whichever wood it came from. The eye keeps the birch and
   the cork-oak; the satchel keeps one kind.

   The face is the very material the crown's geometry has worn since
   §2.4.3 — barkPaper — so the felled bole and the standing one are one look. */
EARTH.block({
  id:'log-paper', name:'Timber',
  tex:{all:'barkPaper'},
  hardness:2.0,
  tool:'axe', drops:'log',
  /* NO WOOD NAMED HERE EITHER, and here it is not a want but a fact: the
     paper bark is the birch's, which the account does not name, and a
     birch bole is genuinely near-white. The texture is drawn pale and grey
     already, so grey is the truth of it and a tint would be a lie. */
  opaque:true, gravity:false
});
