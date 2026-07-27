/* THE PEACOCK — blue of neck, crowned with a fan of feathers on his head,
   and dragging behind him the great eyed train that made him a byword. */
EARTH.beast({
name:'peacock',
realm:'land',
metres:1.1,
build:function(T){
  const g=T.group(); const blue=0x1a5a8a, green=0x2a7a58, legs=[];
  const body=T.box(1.1,1.2,1.8,green); body.position.y=2.0; g.add(body);
  const neck=T.box(0.55,1.6,0.55,blue); neck.geometry.translate(0,0.8,0);
  neck.position.set(0,2.4,0.7); neck.rotation.x=-0.18; g.add(neck);
  const head=T.box(0.5,0.5,0.7,blue); head.position.set(0,4.2,1.05); g.add(head);
  const beak=T.box(0.2,0.18,0.4,0xd8c88a); beak.position.set(0,4.1,1.5); g.add(beak);
  for(const s of [1,-1]){ const eye=T.box(0.12,0.12,0.1,0x0c0a08); eye.position.set(s*0.2,4.3,1.3); g.add(eye);
    /* the crest — three little feathers on stalks */
    const cr=T.box(0.07,0.4,0.07,blue); cr.position.set(s*0.14,4.7,0.95); g.add(cr);
    const tip=T.box(0.16,0.16,0.1,green); tip.position.set(s*0.14,4.95,0.95); g.add(tip); }
  const cr0=T.box(0.07,0.4,0.07,blue); cr0.position.set(0,4.7,0.95); g.add(cr0);
  /* the train: a fan of eyed feathers carried down behind him */
  for(let i=-3;i<=3;i++){ const f=T.box(0.34,0.12,3.4,green);
    f.position.set(i*0.34,1.7-Math.abs(i)*0.1,-2.4); f.rotation.y=i*0.11; g.add(f);
    const ey=T.box(0.3,0.16,0.3,0x2a3a8a); ey.position.set(i*0.52,1.66-Math.abs(i)*0.1,-3.7); g.add(ey);
    const ey2=T.box(0.16,0.18,0.16,0x8a7a1a); ey2.position.set(i*0.52,1.7-Math.abs(i)*0.1,-3.7); g.add(ey2); }
  for(const s of [1,-1]){ const L=T.box(0.2,1.4,0.2,0x9a8a6a); L.geometry.translate(0,-0.7,0);
    L.position.set(s*0.32,1.4,0.1); L.userData.ph=(s>0)?0:Math.PI; g.add(L); legs.push(L); }
  g.userData={legs};
  return g;
}});
