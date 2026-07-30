/* THE SPERM WHALE — the great diver: the squared head a third of the whole
   beast, the narrow underslung jaw, and the deepest working lungs on earth.
   He breathes at the top and then sounds a mile and more into the black
   after the great squid — which is the engine's own drama: meet him down in
   the dark and he is hunting.
   See creatures/README.md. Change `metres` to change his size. */
EARTH.beast({
name:'spermwhale',
realm:'sea',
metres:16,
axis:'z',
build:function(T){
  const g=T.group();
  const hide=T.tex(function(gg){ T.speckle(gg,[74,80,88],10,[62,68,76],0.4); });
  const m=T.mat(hide);
  /* the head — the great blunt case, square at the front */
  const head=new T.THREE.Mesh(new T.THREE.BoxGeometry(3.4,3.6,6.0),m);
  head.position.set(0,0.3,3.6); g.add(head);
  /* the body, tapering behind */
  const body=new T.THREE.Mesh(new T.THREE.BoxGeometry(3.0,3.2,6.0),m);
  body.position.set(0,0,-1.4); g.add(body);
  const rear=new T.THREE.Mesh(new T.THREE.BoxGeometry(2.0,2.2,3.4),m);
  rear.position.set(0,0.1,-5.6); g.add(rear);
  /* the narrow jaw, slung under the case */
  const jaw=new T.THREE.Mesh(new T.THREE.BoxGeometry(1.0,0.7,4.6),T.matc(0x9aa2aa));
  jaw.position.set(0,-1.9,3.6); g.add(jaw);
  const eye=new T.THREE.Mesh(new T.THREE.BoxGeometry(0.4,0.4,0.4),T.matc(0x14100c));
  eye.position.set(1.75,-0.6,1.4); g.add(eye);
  const eye2=eye.clone(); eye2.position.x=-1.75; g.add(eye2);
  /* the flukes and the low hump — no true dorsal on a sperm whale */
  const fmat=T.matc(0x565c64);
  const hump=new T.THREE.Mesh(new T.THREE.BoxGeometry(1.2,0.7,1.6),fmat);
  hump.position.set(0,1.8,-3.4); g.add(hump);
  const tail=T.group();
  const flu=new T.THREE.Mesh(new T.THREE.BoxGeometry(5.4,0.5,1.8),fmat);
  flu.position.set(0,0,-0.9); tail.add(flu);
  tail.position.set(0,0.4,-7.3); g.add(tail);
  const flL=new T.THREE.Mesh(new T.THREE.BoxGeometry(2.0,0.4,1.1),fmat);
  flL.position.set(1.9,-1.3,2.0); flL.rotation.z=-0.3; g.add(flL);
  const flR=flL.clone(); flR.position.x=-1.9; flR.rotation.z=0.3; g.add(flR);
  g.userData={tail,flL,flR};
  return g;
}});
