/* THE WARTHOG — tusked, warted, and it runs with its tail straight up like a
   flag. It roots the plain on its knees and backs into a burrow at night. */
EARTH.beast({
name:'warthog',
realm:'land',
metres:1.4,
build:function(T){
  const g=T.group(); const hide=0x6b5a4a, mane=0x2e2620;
  const body=T.box(1.3,1.5,3.0,hide); body.position.y=2.1; g.add(body);
  const crest=T.box(0.35,0.8,2.4,mane); crest.position.set(0,3.1,0.3); g.add(crest);
  const head=T.box(1.1,1.1,1.6,hide); head.position.set(0,2.3,2.2); g.add(head);
  const snout=T.box(0.8,0.6,0.7,0x8a7460); snout.position.set(0,2.0,3.2); g.add(snout);
  for(const s of [1,-1]){ const tsk=T.box(0.24,0.9,0.24,0xefe6d0);
    tsk.position.set(s*0.5,2.4,3.0); tsk.rotation.z=s*0.5; tsk.rotation.x=-0.3; g.add(tsk);
    const wart=T.box(0.3,0.3,0.3,0x7a6654); wart.position.set(s*0.6,2.3,2.6); g.add(wart);
    const ear=T.box(0.3,0.5,0.24,hide); ear.position.set(s*0.44,3.0,1.9); g.add(ear);
    const eye=T.box(0.18,0.18,0.16,0x120e0a); eye.position.set(s*0.4,2.6,2.8); g.add(eye); }
  const tail=T.box(0.2,1.6,0.2,mane); tail.position.set(0,3.0,-1.6); g.add(tail);
  T.legs4(g,0.5,1.0,1.5,0x5a4c40,0.44);
  g.userData.head=head;
  return g;
}});
