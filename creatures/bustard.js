/* THE BUSTARD — the great bird of the waste, sand-barred so that it is a
   stone until it moves, and heavy enough that it would rather walk. */
EARTH.beast({
name:'bustard',
realm:'land',
metres:0.9,
axis:'y',
build:function(T){
  const g=T.group(); const legs=[];
  const plumeT=T.tex(function(gg){ T.speckle(gg,[196,172,124],20,[168,144,98],0.4);
    gg.fillStyle='rgb(58,48,36)';
    for(let k=0;k<7;k++) gg.fillRect(0,Math.floor(T.hash(k,3.3)*15),16,1); });
  const plume=T.mat(plumeT);
  const body=new T.THREE.Mesh(new T.THREE.BoxGeometry(1.6,1.5,2.6),plume); body.position.y=2.6; g.add(body);
  for(const s of [1,-1]){ const wing=new T.THREE.Mesh(new T.THREE.BoxGeometry(0.3,1.1,2.0),plume);
    wing.position.set(s*0.92,2.6,-0.1); g.add(wing); }
  const neck=T.box(0.5,1.7,0.5,0xe0d4b8); neck.geometry.translate(0,0.85,0);
  neck.position.set(0,3.2,0.9); neck.rotation.x=-0.12; g.add(neck);
  /* the ruff of white feathers down the throat */
  for(const s of [1,-1]){ const ruff=T.box(0.24,1.2,0.34,0xf0ece0); ruff.position.set(s*0.34,3.9,1.05); g.add(ruff); }
  const head=T.box(0.5,0.5,0.7,0xd8ccb0); head.position.set(0,5.0,1.15); g.add(head);
  const crest=T.box(0.34,0.4,0.34,0x2a2620); crest.position.set(0,5.4,1.0); g.add(crest);
  const beak=T.box(0.24,0.2,0.5,0x6a6250); beak.position.set(0,4.9,1.6); g.add(beak);
  for(const s of [1,-1]){ const eye=T.box(0.14,0.14,0.12,0x120e0a); eye.position.set(s*0.22,5.1,1.4); g.add(eye);
    const L=T.box(0.24,1.7,0.24,0xc8bc9c); L.geometry.translate(0,-0.85,0);
    L.position.set(s*0.42,1.85,0); L.userData.ph=(s>0)?0:Math.PI; g.add(L); legs.push(L);
    const foot=T.box(0.3,0.16,0.6,0xc8bc9c); foot.position.set(s*0.42,0.08,0.18); g.add(foot); }
  g.userData={legs};
  return g;
}});
