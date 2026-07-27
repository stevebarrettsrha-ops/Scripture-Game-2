/* THE POLAR BEAR — the greatest land hunter there is, and the only one that
   counts a man as food. Long in the neck, small in the head, black in the
   nose, and white against the whole world it lives in. */
EARTH.beast({
name:'polarbear',
realm:'land',
metres:2.4,
build:function(T){
  const g=T.group(); const w=0xf2f0e8, sh=0xdcdad2;
  const body=T.box(3.2,3.0,5.6,w); body.position.y=4.4; g.add(body);
  const rump=T.box(3.2,2.8,1.2,sh); rump.position.set(0,4.6,-3.0); g.add(rump);
  const neck=T.box(2.0,1.8,1.6,w); neck.position.set(0,5.0,3.0); g.add(neck);
  const head=T.box(1.7,1.5,2.2,w); head.position.set(0,4.9,4.6); head.rotation.x=0.1; g.add(head);
  const snout=T.box(1.0,0.9,0.9,sh); snout.position.set(0,4.6,5.9); g.add(snout);
  const nose=T.box(0.5,0.36,0.3,0x14120f); nose.position.set(0,4.85,6.4); g.add(nose);
  for(const s of [1,-1]){ const ear=T.box(0.55,0.5,0.35,w); ear.position.set(s*0.7,5.9,4.2); g.add(ear);
    const eye=T.box(0.24,0.22,0.2,0x14120f); eye.position.set(s*0.6,5.2,5.6); g.add(eye); }
  T.legs4(g,1.2,1.9,2.9,w,1.15);
  g.userData.head=head;
  return g;
}});
