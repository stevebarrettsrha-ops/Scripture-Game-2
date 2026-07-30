/* THE OCEAN SUNFISH (MOLA MOLA) — the swimming head: a great grey disc that
   ends where any other fish begins its tail, taller than it is long, waving
   two long fins and lying flat at the surface to sun itself — which is the
   whole of its name. The heaviest bony fish in the sea.
   See creatures/README.md. Change `metres` to change its size. */
EARTH.beast({
name:'sunfish',
realm:'sea',
metres:3.1,
axis:'y',
build:function(T){
  const g=T.group();
  const hide=T.tex(function(gg){ T.speckle(gg,[124,132,140],14,[104,112,122],0.4); });
  const m=T.mat(hide);
  const body=new T.THREE.Mesh(new T.THREE.BoxGeometry(1.2,3.4,3.0),m); g.add(body);
  const brow=new T.THREE.Mesh(new T.THREE.BoxGeometry(1.0,2.2,1.0),m);
  brow.position.set(0,0,1.9); g.add(brow);
  const mouth=new T.THREE.Mesh(new T.THREE.BoxGeometry(0.6,0.6,0.4),T.matc(0x4a5058));
  mouth.position.set(0,-0.2,2.5); g.add(mouth);
  const eye=new T.THREE.Mesh(new T.THREE.BoxGeometry(0.3,0.3,0.3),T.matc(0x14100c));
  eye.position.set(0.55,0.6,2.1); g.add(eye);
  const eye2=eye.clone(); eye2.position.x=-0.55; g.add(eye2);
  /* the two long vanes, up and down, and the frill where a tail ought to be */
  const fmat=T.matc(0x8a929a);
  const up=new T.THREE.Mesh(new T.THREE.BoxGeometry(0.4,2.6,1.0),fmat);
  up.position.set(0,3.0,-0.4); g.add(up);
  const dn=new T.THREE.Mesh(new T.THREE.BoxGeometry(0.4,2.6,1.0),fmat);
  dn.position.set(0,-3.0,-0.4); g.add(dn);
  const clav=new T.THREE.Mesh(new T.THREE.BoxGeometry(0.5,3.6,0.5),fmat);
  clav.position.set(0,0,-1.7); g.add(clav);
  g.userData={flL:up,flR:dn};
  return g;
}});
