/* THE LEOPARD — rosettes, heavy jaw, short legs, and it drags its kill up a
   tree. It is met everywhere from the plain to the mountain flank, and it is
   never seen unless it wants to be. */
EARTH.beast({
name:'leopard',
realm:'land',
metres:1.6,
build:function(T){
  const g=T.group();
  const coatT=T.tex(function(gg){ T.speckle(gg,[204,164,86],16);
    for(let k=0;k<14;k++){ const x=Math.floor(T.hash(k,2.1)*14), y=Math.floor(T.hash(k,6.7)*14);
      gg.fillStyle='rgb(46,34,20)'; gg.fillRect(x,y,2,2);
      gg.fillStyle='rgb(150,116,58)'; gg.fillRect(x+1,y+1,1,1); } });
  const coat=T.mat(coatT);
  const body=new T.THREE.Mesh(new T.THREE.BoxGeometry(1.6,1.6,3.6),coat); body.position.y=2.3; g.add(body);
  const head=new T.THREE.Mesh(new T.THREE.BoxGeometry(1.3,1.2,1.3),coat); head.position.set(0,2.8,2.2); g.add(head);
  const snout=T.box(0.75,0.6,0.6,0xe4d2ac); snout.position.set(0,2.6,3.0); g.add(snout);
  for(const s of [1,-1]){ const ear=T.box(0.4,0.42,0.26,0x2e2418); ear.position.set(s*0.45,3.5,2.1); g.add(ear);
    const eye=T.box(0.22,0.2,0.18,0x2c3a10); eye.position.set(s*0.36,2.98,2.8); g.add(eye); }
  const tail=new T.THREE.Mesh(new T.THREE.BoxGeometry(0.42,0.42,2.6),coat);
  tail.position.set(0,2.5,-2.6); tail.rotation.x=0.3; g.add(tail);
  T.legs4(g,0.6,1.2,1.9,0xc79f5e,0.55);
  g.userData.head=head;
  return g;
}});
