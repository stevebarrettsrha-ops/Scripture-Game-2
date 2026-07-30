/* THE HERRING — the silver of the cold seas: the great schooling fish of
   the north, in walls a million strong, and half of everything that swims,
   flies or hauls a net lives on it. See creatures/README.md. */
EARTH.beast({
name:'herring',
realm:'sea',
metres:0.3,
axis:'z',
build:function(T){
  const g=T.group();
  const hide=T.tex(function(gg){
    T.speckle(gg,[188,200,212],10,[168,182,196],0.35);
    gg.fillStyle='rgb(74,96,120)'; gg.fillRect(0,0,16,5); });
  const m=T.mat(hide);
  const body=new T.THREE.Mesh(new T.THREE.BoxGeometry(0.5,0.9,2.4),m); g.add(body);
  const head=new T.THREE.Mesh(new T.THREE.BoxGeometry(0.42,0.7,0.5),m);
  head.position.set(0,0,1.4); g.add(head);
  const eye=new T.THREE.Mesh(new T.THREE.BoxGeometry(0.14,0.14,0.14),T.matc(0x14100c));
  eye.position.set(0.24,0.15,1.5); g.add(eye);
  const eye2=eye.clone(); eye2.position.x=-0.24; g.add(eye2);
  const fmat=T.matc(0x7a92a8);
  const tail=new T.THREE.Mesh(new T.THREE.BoxGeometry(0.12,0.8,0.55),fmat);
  tail.position.set(0,0,-1.45); g.add(tail);
  const top=new T.THREE.Mesh(new T.THREE.BoxGeometry(0.1,0.4,0.7),fmat);
  top.position.set(0,0.6,-0.1); g.add(top);
  g.userData={tail};
  return g;
}});
