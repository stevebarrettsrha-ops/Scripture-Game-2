/* THE HIPPOPOTAMUS — the river horse. It keeps the banks of the great warm
   rivers and no other water, and its whole head is a mouth. */
EARTH.beast({
name:'hippo',
realm:'land',
metres:3.9,
build:function(T){
  const g=T.group(); const hide=0x8a5f5c, pale=0xb08a84;
  const body=T.box(3.6,3.0,6.0,hide); body.position.y=3.6; g.add(body);
  const belly=T.box(3.4,0.9,5.6,pale); belly.position.set(0,2.5,0); g.add(belly);
  const head=T.box(3.0,2.0,3.2,hide); head.position.set(0,3.9,4.4); g.add(head);
  const jaw=T.box(2.8,0.9,3.0,pale); jaw.geometry.translate(0,0,1.5);
  jaw.position.set(0,3.0,3.0); g.add(jaw);
  const snout=T.box(3.1,1.1,0.9,hide); snout.position.set(0,4.4,5.7); g.add(snout);
  for(const s of [1,-1]){ const nos=T.box(0.5,0.3,0.4,0x3a2422); nos.position.set(s*0.8,5.1,5.9); g.add(nos);
    const ear=T.box(0.5,0.5,0.4,hide); ear.position.set(s*1.1,5.1,3.4); g.add(ear);
    const eye=T.box(0.35,0.35,0.3,0x120c0a); eye.position.set(s*1.2,5.0,4.6); g.add(eye);
    const tsk=T.box(0.3,0.5,0.3,0xf0e8d4); tsk.position.set(s*1.1,3.4,5.6); g.add(tsk); }
  const tail=T.box(0.5,0.5,1.2,hide); tail.position.set(0,3.6,-3.3); g.add(tail);
  T.legs4(g,1.25,2.0,1.9,0x7a5350,1.15);
  g.userData.jaw=jaw;
  g.userData.head=head;
  return g;
}});
