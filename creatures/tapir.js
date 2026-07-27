/* THE TAPIR — an old beast, older than the horse and the rhinoceros both,
   with a little trunk of a nose it uses like a hand. It walks the forest
   floor and swims the rivers. */
EARTH.beast({
name:'tapir',
realm:'land',
metres:2.0,
build:function(T){
  const g=T.group(); const hide=0x3a332e, pale=0xd8d2c6;
  const body=T.box(1.7,1.9,3.6,hide); body.position.y=2.9; g.add(body);
  const crest=T.box(0.4,0.5,2.0,0x201b18); crest.position.set(0,4.05,0.6); g.add(crest);
  const head=T.box(1.2,1.3,1.6,hide); head.position.set(0,2.9,2.5); head.rotation.x=0.15; g.add(head);
  const snout=T.box(0.6,0.7,1.0,0x2a2420); snout.position.set(0,2.55,3.6); snout.rotation.x=0.35; g.add(snout);
  for(const s of [1,-1]){ const ear=T.box(0.3,0.5,0.24,hide); ear.position.set(s*0.5,3.7,2.2); g.add(ear);
    const rim=T.box(0.32,0.2,0.26,pale); rim.position.set(s*0.5,3.95,2.2); g.add(rim);
    const eye=T.box(0.18,0.18,0.14,0x0e0a08); eye.position.set(s*0.5,3.1,3.1); g.add(eye); }
  T.legs4(g,0.6,1.2,2.0,0x2e2824,0.6);
  g.userData.head=head;
  return g;
}});
