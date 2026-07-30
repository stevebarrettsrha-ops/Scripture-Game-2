/* THE ANGELFISH — the tall banner of the reef: a disc of a fish, deeper
   than it is long, barred yellow and blue, picking at the coral heads.
   See creatures/README.md. Change `metres` to change its size. */
EARTH.beast({
name:'angelfish',
realm:'sea',
metres:0.35,
axis:'z',
build:function(T){
  const g=T.group();
  const hide=T.tex(function(gg){
    T.speckle(gg,[228,196,60],14,[210,178,48],0.35);
    gg.fillStyle='rgb(48,96,188)';
    for(const x of [2,6,10,14]) gg.fillRect(x,0,2,16); });
  const m=T.mat(hide);
  const body=new T.THREE.Mesh(new T.THREE.BoxGeometry(0.5,2.2,2.0),m); g.add(body);
  const head=new T.THREE.Mesh(new T.THREE.BoxGeometry(0.45,1.1,0.6),m);
  head.position.set(0,0,1.25); g.add(head);
  const eye=new T.THREE.Mesh(new T.THREE.BoxGeometry(0.16,0.16,0.16),T.matc(0x14100c));
  eye.position.set(0.26,0.3,1.35); g.add(eye);
  const eye2=eye.clone(); eye2.position.x=-0.26; g.add(eye2);
  const fmat=T.matc(0x3a6ac8);
  const top=new T.THREE.Mesh(new T.THREE.BoxGeometry(0.16,0.9,1.4),fmat);
  top.position.set(0,1.5,-0.3); top.rotation.x=-0.3; g.add(top);
  const low=new T.THREE.Mesh(new T.THREE.BoxGeometry(0.16,0.9,1.2),fmat);
  low.position.set(0,-1.5,-0.2); low.rotation.x=0.3; g.add(low);
  const tail=new T.THREE.Mesh(new T.THREE.BoxGeometry(0.16,1.1,0.7),fmat);
  tail.position.set(0,0,-1.3); g.add(tail);
  g.userData={tail};
  return g;
}});
