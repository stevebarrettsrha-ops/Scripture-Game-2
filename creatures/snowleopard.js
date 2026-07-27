/* THE SNOW LEOPARD — smoke-pale and rosetted, with a tail nearly as long as
   itself for the balance on the crags. It keeps above the tree line and is
   almost never seen. */
EARTH.beast({
name:'snowleopard',
realm:'land',
metres:1.3,
build:function(T){
  const g=T.group();
  const coatT=T.tex(function(gg){ T.speckle(gg,[210,208,200],14,[186,186,182],0.4);
    for(let k=0;k<12;k++){ const x=Math.floor(T.hash(k,4.9)*14), y=Math.floor(T.hash(k,7.3)*14);
      gg.fillStyle='rgb(60,58,56)'; gg.fillRect(x,y,2,2);
      gg.fillStyle='rgb(150,148,144)'; gg.fillRect(x+1,y+1,1,1); } });
  const coat=T.mat(coatT);
  const body=new T.THREE.Mesh(new T.THREE.BoxGeometry(1.5,1.5,3.2),coat); body.position.y=2.4; g.add(body);
  const head=new T.THREE.Mesh(new T.THREE.BoxGeometry(1.2,1.1,1.2),coat); head.position.set(0,2.9,2.0); g.add(head);
  const snout=T.box(0.7,0.55,0.6,0xf0eeea); snout.position.set(0,2.7,2.7); g.add(snout);
  for(const s of [1,-1]){ const ear=T.box(0.36,0.36,0.24,0x4a4844); ear.position.set(s*0.42,3.5,1.9); g.add(ear);
    const eye=T.box(0.2,0.18,0.16,0x8ab4c0); eye.position.set(s*0.32,3.05,2.55); g.add(eye); }
  /* the great tail — it is what keeps him on the rock */
  const tail=new T.THREE.Mesh(new T.THREE.BoxGeometry(0.6,0.6,3.0),coat);
  tail.position.set(0,2.6,-2.6); tail.rotation.x=0.35; g.add(tail);
  T.legs4(g,0.55,1.1,1.9,0xd2d0c8,0.6);
  g.userData.head=head;
  return g;
}});
