/* THE GORILLA — the silverback of the tropic forest, walking on his knuckles,
   with the great crest on the crown of his head. Measured by his height. */
EARTH.beast({
name:'gorilla',
realm:'land',
metres:1.65,
axis:'y',
build:function(T){
  const g=T.group(); const fur=0x2a2724, silver=0x8e8c88, skin=0x141210;
  const body=T.box(2.4,2.4,1.9,fur); body.position.y=3.2; g.add(body);
  const back=T.box(2.2,1.6,0.5,silver); back.position.set(0,3.6,-1.0); g.add(back);
  const chest=T.box(1.9,1.6,0.4,0x1e1c1a); chest.position.set(0,3.1,1.0); g.add(chest);
  const head=T.box(1.3,1.2,1.3,fur); head.position.set(0,5.0,0.2); g.add(head);
  const crest=T.box(0.9,0.5,0.9,fur); crest.position.set(0,5.7,0.1); g.add(crest);
  const face=T.box(1.0,0.8,0.3,skin); face.position.set(0,4.85,0.85); g.add(face);
  const brow=T.box(1.1,0.3,0.4,fur); brow.position.set(0,5.35,0.75); g.add(brow);
  for(const s of [1,-1]){ const eye=T.box(0.18,0.16,0.14,0x6a4a24); eye.position.set(s*0.28,5.0,1.0); g.add(eye);
    /* the long arms he walks upon */
    const arm=T.box(0.75,2.6,0.8,fur); arm.geometry.translate(0,-1.3,0);
    arm.position.set(s*1.45,4.2,0.3); arm.rotation.x=-0.12; arm.userData.ph=(s>0)?0:Math.PI; g.add(arm);
    const fist=T.box(0.8,0.5,0.9,skin); fist.position.set(s*1.45,1.35,0.6); g.add(fist); }
  T.legs4(g,0.7,0.4,2.0,fur,0.85);
  return g;
}});
