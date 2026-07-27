/* THE MACAQUE — the monkey met from the tropic forest to the snow of the
   north, pink-faced and short-tailed, and it will take what you are eating
   out of your hand. */
EARTH.beast({
name:'macaque',
realm:'land',
metres:0.6,
build:function(T){
  const g=T.group(); const coat=0x9a8a70, face=0xd08a80;
  const body=T.box(0.8,0.9,1.5,coat); body.position.y=1.2; g.add(body);
  const head=T.box(0.72,0.7,0.7,coat); head.position.set(0,1.85,0.95); g.add(head);
  const fc=T.box(0.5,0.55,0.25,face); fc.position.set(0,1.8,1.35); g.add(fc);
  const muz=T.box(0.34,0.3,0.28,face); muz.position.set(0,1.62,1.5); g.add(muz);
  for(const s of [1,-1]){ const ear=T.box(0.16,0.26,0.2,face); ear.position.set(s*0.4,1.95,0.9); g.add(ear);
    const eye=T.box(0.13,0.12,0.1,0x140f0a); eye.position.set(s*0.18,1.92,1.48); g.add(eye);
    const arm=T.box(0.24,0.9,0.26,coat); arm.geometry.translate(0,-0.45,0);
    arm.position.set(s*0.5,1.5,0.4); arm.userData.ph=(s>0)?0:Math.PI; g.add(arm); }
  const tail=T.box(0.18,0.5,0.18,coat); tail.position.set(0,1.5,-0.85); tail.rotation.x=0.5; g.add(tail);
  T.legs4(g,0.28,0.5,0.9,coat,0.24);
  g.userData.head=head;
  return g;
}});
