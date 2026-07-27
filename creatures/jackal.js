/* THE JACKAL — thin, sharp-eared, gold along the flank, and it works the
   edges of every kill it did not make. */
EARTH.beast({
name:'jackal',
realm:'land',
metres:1.0,
build:function(T){
  const g=T.group(); const coat=0xa5825a, back=0x4a4038;
  const body=T.box(1.0,1.0,2.4,coat); body.position.y=1.8; g.add(body);
  const saddle=T.box(1.05,0.5,1.8,back); saddle.position.set(0,2.2,-0.2); g.add(saddle);
  const head=T.box(0.85,0.85,1.0,coat); head.position.set(0,2.1,1.6); g.add(head);
  const snout=T.box(0.45,0.4,0.7,coat); snout.position.set(0,1.95,2.3); g.add(snout);
  const nose=T.box(0.2,0.18,0.16,0x14100c); nose.position.set(0,2.02,2.68); g.add(nose);
  for(const s of [1,-1]){ const ear=T.box(0.3,0.7,0.22,coat); ear.position.set(s*0.36,2.75,1.5); g.add(ear);
    const eye=T.box(0.16,0.15,0.13,0x1a1208); eye.position.set(s*0.28,2.25,2.05); g.add(eye); }
  const tail=T.box(0.4,0.4,1.3,back); tail.position.set(0,1.9,-1.6); tail.rotation.x=0.4; g.add(tail);
  T.legs4(g,0.38,0.8,1.5,coat,0.32);
  g.userData.head=head;
  return g;
}});
