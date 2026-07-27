/* THE WILD BOAR — bristled, tusked, heavy at the shoulder. It roots the
   forest floor for mast and comes out into the fields at dusk. */
EARTH.beast({
name:'boar',
realm:'land',
metres:1.6,
build:function(T){
  const g=T.group(); const hide=0x4a3d30, bris=0x2e251c;
  const body=T.box(1.5,1.7,3.0,hide); body.position.y=2.3; g.add(body);
  const shoulder=T.box(1.6,1.0,1.4,hide); shoulder.position.set(0,3.3,0.9); g.add(shoulder);
  const crest=T.box(0.35,0.6,2.4,bris); crest.position.set(0,3.9,0.4); g.add(crest);
  const head=T.box(1.0,1.1,1.8,bris); head.position.set(0,2.6,2.4); head.rotation.x=0.2; g.add(head);
  const snout=T.box(0.6,0.5,0.6,0x8a7060); snout.position.set(0,2.15,3.4); g.add(snout);
  for(const s of [1,-1]){ const tsk=T.box(0.18,0.6,0.18,0xefe6d0);
    tsk.position.set(s*0.34,2.4,3.2); tsk.rotation.z=s*0.5; tsk.rotation.x=-0.4; g.add(tsk);
    const ear=T.box(0.28,0.5,0.24,bris); ear.position.set(s*0.42,3.4,2.1); g.add(ear);
    const eye=T.box(0.16,0.16,0.14,0x0e0a08); eye.position.set(s*0.4,3.0,3.0); g.add(eye); }
  const tail=T.box(0.16,0.8,0.16,bris); tail.position.set(0,2.6,-1.6); g.add(tail);
  T.legs4(g,0.55,1.05,1.6,0x2e251c,0.5);
  return g;
}});
