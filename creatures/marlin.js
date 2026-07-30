/* THE BLUE MARLIN — the spear of the open sea: cobalt over silver, the bill
   a third of the fish, and the tall sickle dorsal. One of the fastest things
   in the water, and it runs the warm pelagic far from any land.
   See creatures/README.md. Change `metres` to change its size. */
EARTH.beast({
name:'marlin',
realm:'sea',
metres:4.3,
axis:'z',
build:function(T){
  const g=T.group();
  const top=T.tex(function(gg){ T.speckle(gg,[36,74,150],10,[28,60,128],0.35); });
  const bel=T.tex(function(gg){ T.speckle(gg,[214,224,232],8,[196,208,218],0.3); });
  const m=T.mat(top), bm=T.mat(bel);
  const body=new T.THREE.Mesh(new T.THREE.BoxGeometry(1.4,2.0,6.0),m); g.add(body);
  const belly=new T.THREE.Mesh(new T.THREE.BoxGeometry(1.2,0.7,5.4),bm);
  belly.position.y=-1.1; g.add(belly);
  const head=new T.THREE.Mesh(new T.THREE.BoxGeometry(1.1,1.4,1.4),m);
  head.position.set(0,0,3.4); g.add(head);
  /* the bill */
  const bill=new T.THREE.Mesh(new T.THREE.BoxGeometry(0.3,0.3,2.6),T.matc(0x2a3a56));
  bill.position.set(0,0.2,5.2); g.add(bill);
  const eye=new T.THREE.Mesh(new T.THREE.BoxGeometry(0.3,0.3,0.3),T.matc(0x14100c));
  eye.position.set(0.6,0.3,3.5); g.add(eye);
  const eye2=eye.clone(); eye2.position.x=-0.6; g.add(eye2);
  /* the sickle dorsal and the great forked tail */
  const fmat=T.matc(0x2a4a8a);
  const dors=new T.THREE.Mesh(new T.THREE.BoxGeometry(0.24,1.8,2.2),fmat);
  dors.position.set(0,1.7,1.2); dors.rotation.x=0.3; g.add(dors);
  const tail=T.group();
  const tf1=new T.THREE.Mesh(new T.THREE.BoxGeometry(0.22,2.6,0.9),fmat);
  tf1.rotation.x=0.5; tf1.position.set(0,0.5,-0.4); tail.add(tf1);
  const tf2=new T.THREE.Mesh(new T.THREE.BoxGeometry(0.22,2.6,0.9),fmat);
  tf2.rotation.x=-0.5; tf2.position.set(0,-0.5,-0.4); tail.add(tf2);
  tail.position.set(0,0,-3.2); g.add(tail);
  const pfL=new T.THREE.Mesh(new T.THREE.BoxGeometry(1.6,0.2,0.8),fmat);
  pfL.position.set(1.0,-0.6,1.8); pfL.rotation.z=-0.5; g.add(pfL);
  const pfR=pfL.clone(); pfR.position.x=-1.0; pfR.rotation.z=0.5; g.add(pfR);
  g.userData={tail};
  return g;
}});
