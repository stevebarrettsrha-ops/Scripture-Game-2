/* THE TRIPOD FISH — the fisherman of the abyssal plain: it stands on three
   stiffened fin-rays like a camera on its legs, face to the current, and
   waits for the drift to bring it supper. It can stand for hours; mostly
   it does nothing else. See creatures/README.md. */
EARTH.beast({
name:'tripodfish',
realm:'sea',
metres:0.35,
axis:'z',
build:function(T){
  const g=T.group();
  const hide=T.tex(function(gg){ T.speckle(gg,[140,128,120],12,[120,110,104],0.35); });
  const m=T.mat(hide);
  const body=new T.THREE.Mesh(new T.THREE.BoxGeometry(0.5,0.7,2.2),m);
  body.position.y=1.6; g.add(body);
  const head=new T.THREE.Mesh(new T.THREE.BoxGeometry(0.44,0.55,0.5),m);
  head.position.set(0,1.6,1.3); g.add(head);
  const eye=new T.THREE.Mesh(new T.THREE.BoxGeometry(0.12,0.12,0.12),T.matc(0x2a3038));
  eye.position.set(0.24,1.75,1.4); g.add(eye);
  const eye2=eye.clone(); eye2.position.x=-0.24; g.add(eye2);
  /* the three stilts: two pelvic, one from the tail */
  const smat=T.matc(0xb0a498);
  for(const s of [1,-1]){
    const leg=new T.THREE.Mesh(new T.THREE.BoxGeometry(0.1,1.8,0.1),smat);
    leg.geometry.translate(0,-0.9,0);
    leg.position.set(s*0.3,1.5,0.5); leg.rotation.z=s*0.35; g.add(leg); }
  const tleg=new T.THREE.Mesh(new T.THREE.BoxGeometry(0.1,2.0,0.1),smat);
  tleg.geometry.translate(0,-1.0,0);
  tleg.position.set(0,1.6,-1.0); tleg.rotation.x=-0.5; g.add(tleg);
  /* the long feeler-fins held out into the current */
  for(const s of [1,-1]){
    const fe=new T.THREE.Mesh(new T.THREE.BoxGeometry(0.07,1.4,0.07),smat);
    fe.geometry.translate(0,0.7,0);
    fe.position.set(s*0.28,1.9,0.9); fe.rotation.z=-s*0.7; g.add(fe); }
  const tail=new T.THREE.Mesh(new T.THREE.BoxGeometry(0.1,0.5,0.4),smat);
  tail.position.set(0,1.6,-1.3); g.add(tail);
  g.userData={tail};
  return g;
}});
