/* THE EMU — the second tallest bird there is, shaggy-feathered, blue about
   the neck, and it can put a foot through a fence. */
EARTH.beast({
name:'emu',
realm:'land',
metres:1.8,
axis:'y',
build:function(T){
  const g=T.group(); const plume=0x6b5f4e, skin=0x4a6a8a, legs=[];
  const body=T.box(2.0,2.2,3.0,plume); body.position.y=5.6; g.add(body);
  const ruff=T.box(1.4,0.9,1.4,plume); ruff.position.set(0,6.6,0.7); g.add(ruff);
  const neck=T.box(0.7,3.0,0.7,plume); neck.geometry.translate(0,1.5,0);
  neck.position.set(0,6.6,0.9); neck.rotation.x=-0.12; g.add(neck);
  const bare=T.box(0.5,1.2,0.5,skin); bare.position.set(0,9.0,1.2); g.add(bare);
  const head=T.box(0.55,0.6,0.9,skin); head.position.set(0,9.9,1.4); g.add(head);
  const beak=T.box(0.3,0.25,0.6,0x3a3028); beak.position.set(0,9.75,2.0); g.add(beak);
  for(const s of [1,-1]){ const eye=T.box(0.16,0.16,0.13,0x18120c); eye.position.set(s*0.24,10.05,1.7); g.add(eye);
    const L=T.box(0.44,3.6,0.44,0x6a6258); L.geometry.translate(0,-1.8,0);
    L.position.set(s*0.6,4.6,0); L.userData.ph=(s>0)?0:Math.PI; g.add(L); legs.push(L);
    const foot=T.box(0.5,0.3,1.1,0x6a6258); foot.position.set(s*0.6,1.15,0.3); g.add(foot); }
  g.userData={legs};
  return g;
}});
