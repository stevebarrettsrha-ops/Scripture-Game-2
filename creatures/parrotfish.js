/* THE PARROTFISH — the gaudy grazier of the reef: beak of fused teeth,
   turquoise and rose in patches, rasping the algae off the coral all day —
   and the sand of every white beach on the earth is what it leaves behind.
   See creatures/README.md. Change `metres` to change its size. */
EARTH.beast({
name:'parrotfish',
realm:'sea',
metres:0.5,
axis:'z',
build:function(T){
  const g=T.group();
  const hide=T.tex(function(gg){
    T.speckle(gg,[54,178,164],16,[42,150,140],0.4);
    gg.fillStyle='rgb(198,108,140)';
    for(let k=0;k<9;k++){ const x=Math.floor(T.hash(k,2.3)*15), y=Math.floor(T.hash(k,6.1)*15);
      gg.fillRect(x,y,2,1); } });
  const m=T.mat(hide);
  const body=new T.THREE.Mesh(new T.THREE.BoxGeometry(1.1,1.5,3.0),m); g.add(body);
  const head=new T.THREE.Mesh(new T.THREE.BoxGeometry(1.0,1.2,0.8),m);
  head.position.set(0,0,1.8); g.add(head);
  const beak=new T.THREE.Mesh(new T.THREE.BoxGeometry(0.6,0.6,0.35),T.matc(0xe8e2d0));
  beak.position.set(0,-0.15,2.3); g.add(beak);
  const eye=new T.THREE.Mesh(new T.THREE.BoxGeometry(0.2,0.2,0.2),T.matc(0x14100c));
  eye.position.set(0.52,0.35,1.85); g.add(eye);
  const eye2=eye.clone(); eye2.position.x=-0.52; g.add(eye2);
  const fmat=T.matc(0xd88aa8);
  const tail=new T.THREE.Mesh(new T.THREE.BoxGeometry(0.24,1.3,0.9),fmat);
  tail.position.set(0,0,-1.9); g.add(tail);
  const top=new T.THREE.Mesh(new T.THREE.BoxGeometry(0.2,0.6,2.2),fmat);
  top.position.set(0,1.0,0); g.add(top);
  const pfL=new T.THREE.Mesh(new T.THREE.BoxGeometry(0.9,0.16,0.7),fmat);
  pfL.position.set(0.8,-0.2,0.9); pfL.rotation.z=-0.4; g.add(pfL);
  const pfR=pfL.clone(); pfR.position.x=-0.8; pfR.rotation.z=0.4; g.add(pfR);
  g.userData={tail};
  return g;
}});
