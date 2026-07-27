/* THE TIGER — striped orange, white beneath, and the largest cat there is.
   It hunts alone and it hunts from cover, so the tall grass is its whole
   trade. */
EARTH.beast({
name:'tiger',
realm:'land',
metres:2.8,
build:function(T){
  const g=T.group();
  const coatT=T.tex(function(gg){ T.speckle(gg,[218,132,42],16);
    gg.fillStyle='rgb(28,20,14)';
    for(let k=0;k<6;k++){ const x=Math.floor(T.hash(k,3.3)*15); gg.fillRect(x,0,1,16); }
    for(let k=0;k<3;k++){ const x=Math.floor(T.hash(k,9.1)*14); gg.fillRect(x,2,2,12); } });
  const coat=T.mat(coatT);
  const body=new T.THREE.Mesh(new T.THREE.BoxGeometry(1.8,1.8,4.2),coat); body.position.y=2.9; g.add(body);
  const belly=T.box(1.6,0.5,3.8,0xf2eadc); belly.position.set(0,2.1,0); g.add(belly);
  const head=new T.THREE.Mesh(new T.THREE.BoxGeometry(1.5,1.4,1.5),coat); head.position.set(0,3.4,2.6); g.add(head);
  const ruff=T.box(1.7,1.3,0.4,0xf2eadc); ruff.position.set(0,3.2,2.0); g.add(ruff);
  const snout=T.box(0.85,0.7,0.7,0xf2eadc); snout.position.set(0,3.15,3.5); g.add(snout);
  const nose=T.box(0.3,0.24,0.2,0x2a1a14); nose.position.set(0,3.3,3.86); g.add(nose);
  for(const s of [1,-1]){ const ear=T.box(0.42,0.44,0.3,0x2a1e14); ear.position.set(s*0.5,4.2,2.5); g.add(ear);
    const eye=T.box(0.24,0.2,0.18,0xd8b03a); eye.position.set(s*0.4,3.6,3.32); g.add(eye); }
  const tail=new T.THREE.Mesh(new T.THREE.BoxGeometry(0.46,0.46,3.0),coat);
  tail.position.set(0,3.0,-3.1); tail.rotation.x=0.25; g.add(tail);
  T.legs4(g,0.7,1.4,2.3,0xd8842a,0.66);
  return g;
}});
