/* THE DINGO — the wild dog of the great south land, sandy-gold, prick-eared,
   and it hunts in a small pack over country nothing else will cross. */
EARTH.beast({
name:'dingo',
realm:'land',
metres:1.2,
build:function(T){
  const g=T.group(); const coat=0xc98f4a, w=0xf0e4d0;
  const body=T.box(1.1,1.1,2.6,coat); body.position.y=2.0; g.add(body);
  const belly=T.box(1.0,0.34,2.3,w); belly.position.set(0,1.62,0); g.add(belly);
  const head=T.box(0.9,0.9,1.0,coat); head.position.set(0,2.4,1.8); g.add(head);
  const snout=T.box(0.44,0.4,0.8,coat); snout.position.set(0,2.2,2.5); g.add(snout);
  const nose=T.box(0.2,0.18,0.14,0x1a1410); nose.position.set(0,2.26,2.94); g.add(nose);
  for(const s of [1,-1]){ const ear=T.box(0.3,0.6,0.22,coat); ear.position.set(s*0.36,3.0,1.7); g.add(ear);
    const eye=T.box(0.16,0.15,0.13,0x9a7a20); eye.position.set(s*0.3,2.54,2.24); g.add(eye); }
  const tail=T.box(0.44,0.44,1.5,coat); tail.position.set(0,2.1,-1.9); tail.rotation.x=0.4; g.add(tail);
  const tip=T.box(0.46,0.46,0.3,w); tip.position.set(0,1.75,-2.7); g.add(tip);
  T.legs4(g,0.4,0.85,1.7,coat,0.34);
  g.userData.head=head;
  return g;
}});
