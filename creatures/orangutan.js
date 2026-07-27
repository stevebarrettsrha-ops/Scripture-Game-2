/* THE ORANGUTAN — the man of the forest, long-armed, russet-haired, and the
   old males carry the broad cheek-flanges either side of the face. */
EARTH.beast({
name:'orangutan',
realm:'land',
metres:1.35,
axis:'y',
build:function(T){
  const g=T.group(); const fur=0x9c4a1e, skin=0x2e211a;
  const body=T.box(1.8,2.0,1.5,fur); body.position.y=2.6; g.add(body);
  const head=T.box(1.1,1.0,1.1,fur); head.position.set(0,4.1,0.15); g.add(head);
  const face=T.box(0.8,0.8,0.3,skin); face.position.set(0,4.0,0.72); g.add(face);
  for(const s of [1,-1]){ const flange=T.box(0.4,0.9,0.5,fur); flange.position.set(s*0.72,4.0,0.4); g.add(flange);
    const eye=T.box(0.16,0.14,0.12,0x100c08); eye.position.set(s*0.22,4.16,0.88); g.add(eye);
    /* the arms are longer than the whole of him */
    const arm=T.box(0.55,2.9,0.6,fur); arm.geometry.translate(0,-1.45,0);
    arm.position.set(s*1.1,3.5,0.1); arm.userData.ph=(s>0)?0:Math.PI; g.add(arm);
    const hand=T.box(0.5,0.6,0.5,skin); hand.position.set(s*1.1,0.7,0.1); g.add(hand); }
  const muz=T.box(0.5,0.4,0.25,skin); muz.position.set(0,3.75,0.82); g.add(muz);
  T.legs4(g,0.5,0.3,1.6,fur,0.6);
  g.userData.head=head;
  return g;
}});
