/* THE CASSOWARY — black-plumed, blue-necked, red-wattled, with a horn of a
   casque on its head and a dagger on the inside toe of each foot. The most
   dangerous bird alive. */
EARTH.beast({
name:'cassowary',
realm:'land',
metres:1.7,
axis:'y',
build:function(T){
  const g=T.group(); const plume=0x18161a, blue=0x2a6aa8, red=0xb02a2a, legs=[];
  const body=T.box(2.0,2.4,2.8,plume); body.position.y=5.0; g.add(body);
  const neck=T.box(0.75,2.6,0.75,blue); neck.geometry.translate(0,1.3,0);
  neck.position.set(0,6.0,0.8); neck.rotation.x=-0.1; g.add(neck);
  const nape=T.box(0.8,1.2,0.4,0x8a3aa8); nape.position.set(0,7.4,0.45); g.add(nape);
  for(const s of [1,-1]){ const wat=T.box(0.3,1.1,0.3,red); wat.position.set(s*0.24,6.4,1.2); g.add(wat); }
  const head=T.box(0.7,0.7,0.9,blue); head.position.set(0,8.9,1.1); g.add(head);
  const casque=T.box(0.4,1.1,0.9,0x9a7a48); casque.position.set(0,9.6,0.9); casque.rotation.x=-0.2; g.add(casque);
  const beak=T.box(0.3,0.3,0.7,0x6a6258); beak.position.set(0,8.75,1.75); g.add(beak);
  for(const s of [1,-1]){ const eye=T.box(0.16,0.16,0.13,0x140f0a); eye.position.set(s*0.28,9.05,1.4); g.add(eye);
    const L=T.box(0.5,3.2,0.5,0x5a5450); L.geometry.translate(0,-1.6,0);
    L.position.set(s*0.62,4.2,0); L.userData.ph=(s>0)?0:Math.PI; g.add(L); legs.push(L);
    const foot=T.box(0.55,0.32,1.2,0x5a5450); foot.position.set(s*0.62,1.0,0.35); g.add(foot);
    const claw=T.box(0.16,0.2,0.5,0xd8cfbc); claw.position.set(s*0.35,1.0,1.0); g.add(claw); }
  g.userData={legs};
  return g;
}});
