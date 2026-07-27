/* THE JAGUAR — heavier than the leopard, with a blunter head and a bite that
   goes through the skull. It swims the great rivers and it is not afraid of
   the water at all. */
EARTH.beast({
name:'jaguar',
realm:'land',
metres:1.8,
build:function(T){
  const g=T.group();
  const coatT=T.tex(function(gg){ T.speckle(gg,[214,164,72],16);
    for(let k=0;k<11;k++){ const x=Math.floor(T.hash(k,5.3)*13), y=Math.floor(T.hash(k,2.9)*13);
      gg.fillStyle='rgb(36,26,16)'; gg.fillRect(x,y,3,3);
      gg.fillStyle='rgb(196,148,64)'; gg.fillRect(x+1,y+1,1,1);
      gg.fillStyle='rgb(36,26,16)'; gg.fillRect(x+1,y+1,1,1); } });
  const coat=T.mat(coatT);
  const body=new T.THREE.Mesh(new T.THREE.BoxGeometry(1.8,1.7,3.4),coat); body.position.y=2.4; g.add(body);
  const head=new T.THREE.Mesh(new T.THREE.BoxGeometry(1.5,1.4,1.5),coat); head.position.set(0,2.9,2.2); g.add(head);
  const snout=T.box(0.85,0.65,0.6,0xefe4cc); snout.position.set(0,2.65,3.05); g.add(snout);
  for(const s of [1,-1]){ const ear=T.box(0.4,0.4,0.26,0x2e2214); ear.position.set(s*0.5,3.6,2.1); g.add(ear);
    const eye=T.box(0.22,0.2,0.18,0xc8a83a); eye.position.set(s*0.4,3.1,2.86); g.add(eye); }
  const tail=new T.THREE.Mesh(new T.THREE.BoxGeometry(0.46,0.46,2.2),coat);
  tail.position.set(0,2.6,-2.5); tail.rotation.x=0.35; g.add(tail);
  T.legs4(g,0.66,1.15,1.9,0xd6a448,0.66);
  g.userData.head=head;
  return g;
}});
