/* THE GRENADIER (RATTAIL) — the commonest fish of the deep floor: a great
   blunt head with big eyes tapering away to a long rat's tail of a body,
   cruising a hand's breadth over the abyssal mud, smelling for what has
   fallen from the world above. See creatures/README.md. */
EARTH.beast({
name:'grenadier',
realm:'sea',
metres:0.9,
axis:'z',
build:function(T){
  const g=T.group();
  const hide=T.tex(function(gg){ T.speckle(gg,[96,102,112],12,[80,88,98],0.35); });
  const m=T.mat(hide);
  const head=new T.THREE.Mesh(new T.THREE.BoxGeometry(0.9,1.1,1.4),m);
  head.position.set(0,0,1.5); g.add(head);
  const eye=new T.THREE.Mesh(new T.THREE.BoxGeometry(0.3,0.3,0.2),T.matc(0x14100c));
  eye.position.set(0.48,0.25,1.7); g.add(eye);
  const eye2=eye.clone(); eye2.position.x=-0.48; g.add(eye2);
  const snout=new T.THREE.Mesh(new T.THREE.BoxGeometry(0.5,0.4,0.5),m);
  snout.position.set(0,-0.1,2.35); g.add(snout);
  /* the body dwindling to the rat tail */
  const b1=new T.THREE.Mesh(new T.THREE.BoxGeometry(0.7,0.9,1.6),m);
  b1.position.set(0,0,0.1); g.add(b1);
  const b2=new T.THREE.Mesh(new T.THREE.BoxGeometry(0.45,0.6,1.6),m);
  b2.position.set(0,0.05,-1.4); g.add(b2);
  const tail=new T.THREE.Mesh(new T.THREE.BoxGeometry(0.2,0.3,1.8),m);
  tail.position.set(0,0.1,-3.0); g.add(tail);
  const dors=new T.THREE.Mesh(new T.THREE.BoxGeometry(0.12,0.6,0.9),T.matc(0x6a7280));
  dors.position.set(0,0.8,0.4); g.add(dors);
  g.userData={tail};
  return g;
}});
