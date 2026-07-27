/* THE MEERKAT — it stands bolt upright on the mound with its paws together
   and watches the sky, while the rest of the gang digs. */
EARTH.beast({
name:'meerkat',
realm:'land',
metres:0.5,
axis:'y',
build:function(T){
  const g=T.group(); const coat=0xbfa279, dark=0x5a4a34;
  const body=T.box(0.7,1.7,0.8,coat); body.position.y=1.4; g.add(body);
  const belly=T.box(0.55,1.2,0.2,0xe6d5b4); belly.position.set(0,1.4,0.42); g.add(belly);
  const head=T.box(0.65,0.6,0.7,coat); head.position.set(0,2.5,0.05); g.add(head);
  const muz=T.box(0.35,0.3,0.35,0xdcc9a6); muz.position.set(0,2.35,0.5); g.add(muz);
  const nose=T.box(0.16,0.14,0.14,0x14100c); nose.position.set(0,2.42,0.7); g.add(nose);
  for(const s of [1,-1]){ const eye=T.box(0.22,0.2,0.16,dark); eye.position.set(s*0.2,2.6,0.36); g.add(eye);
    const ear=T.box(0.2,0.2,0.14,dark); ear.position.set(s*0.36,2.72,-0.05); g.add(ear);
    const arm=T.box(0.18,0.7,0.18,coat); arm.position.set(s*0.3,1.75,0.4); g.add(arm); }
  const tail=T.box(0.18,1.3,0.18,coat); tail.geometry.translate(0,-0.65,0);
  tail.position.set(0,1.0,-0.5); tail.rotation.x=0.5; g.add(tail);
  const tip=T.box(0.2,0.3,0.2,0x2e2418); tip.position.set(0,0.2,-1.05); g.add(tip);
  T.legs4(g,0.24,0.16,0.6,coat,0.2);
  g.userData.head=head;
  return g;
}});
