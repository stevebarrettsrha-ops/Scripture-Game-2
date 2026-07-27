/* THE CHIMPANZEE — smaller, quicker, and its ears stand out from its head.
   It goes on all fours and sits up to work at whatever it has found. */
EARTH.beast({
name:'chimpanzee',
realm:'land',
metres:1.3,
axis:'y',
build:function(T){
  const g=T.group(); const fur=0x241f1c, skin=0x6b4f3a;
  const body=T.box(1.5,1.7,1.4,fur); body.position.y=2.3; g.add(body);
  const head=T.box(1.0,0.95,1.0,fur); head.position.set(0,3.6,0.15); g.add(head);
  const face=T.box(0.8,0.7,0.3,skin); face.position.set(0,3.5,0.68); g.add(face);
  const muz=T.box(0.5,0.4,0.25,skin); muz.position.set(0,3.28,0.8); g.add(muz);
  for(const s of [1,-1]){ const ear=T.box(0.22,0.45,0.4,skin); ear.position.set(s*0.6,3.62,0.1); g.add(ear);
    const eye=T.box(0.16,0.14,0.12,0x120e0a); eye.position.set(s*0.22,3.66,0.83); g.add(eye);
    const arm=T.box(0.5,1.9,0.55,fur); arm.geometry.translate(0,-0.95,0);
    arm.position.set(s*0.95,3.1,0.2); arm.userData.ph=(s>0)?0:Math.PI; g.add(arm);
    const hand=T.box(0.5,0.35,0.6,skin); hand.position.set(s*0.95,1.05,0.4); g.add(hand); }
  T.legs4(g,0.45,0.35,1.4,fur,0.55);
  g.userData.head=head;
  return g;
}});
