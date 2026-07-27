/* THE SPOTTED HYENA — high at the shoulder and low at the rump, with the
   crest along the neck. They hunt in a body and come to a kill together. */
EARTH.beast({
name:'hyena',
realm:'land',
metres:1.5,
build:function(T){
  const g=T.group();
  const coatT=T.tex(function(gg){ T.speckle(gg,[168,146,110],18);
    gg.fillStyle='rgb(54,42,30)';
    for(let k=0;k<12;k++) gg.fillRect(Math.floor(T.hash(k,3.7)*15),Math.floor(T.hash(k,8.1)*15),2,2); });
  const coat=T.mat(coatT);
  const body=new T.THREE.Mesh(new T.THREE.BoxGeometry(1.4,1.6,3.2),coat); body.position.y=2.5; g.add(body);
  const hump=new T.THREE.Mesh(new T.THREE.BoxGeometry(1.5,0.8,1.6),coat); hump.position.set(0,3.5,1.0); g.add(hump);
  const crest=T.box(0.3,0.7,2.2,0x3a2e20); crest.position.set(0,3.9,0.9); g.add(crest);
  const neck=new T.THREE.Mesh(new T.THREE.BoxGeometry(1.0,1.0,1.0),coat); neck.position.set(0,3.2,2.0); g.add(neck);
  const head=new T.THREE.Mesh(new T.THREE.BoxGeometry(1.1,1.1,1.4),coat); head.position.set(0,3.0,2.8); g.add(head);
  const snout=T.box(0.6,0.5,0.7,0x3e3226); snout.position.set(0,2.8,3.7); g.add(snout);
  for(const s of [1,-1]){ const ear=T.box(0.5,0.7,0.3,0x6a5a42); ear.position.set(s*0.42,3.9,2.6); g.add(ear);
    const eye=T.box(0.2,0.2,0.16,0x14100a); eye.position.set(s*0.34,3.2,3.4); g.add(eye); }
  const tail=T.box(0.42,0.42,1.3,0x3a2e20); tail.position.set(0,2.6,-2.2); tail.rotation.x=0.5; g.add(tail);
  T.legs4(g,0.55,1.1,2.2,0x9a8464,0.5);
  return g;
}});
