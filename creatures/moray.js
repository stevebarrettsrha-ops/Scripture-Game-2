/* THE MORAY EEL — the jaws in the rock: it keeps a hole in the reef and
   hangs out of it to the waist, mouth opening and closing on its breath,
   and hunts the crevices by night. The engine anchors it at a coral head
   with the head riding out of the den.
   `jaw` is handed back so the engine can work the mouth.
   See creatures/README.md. Change `metres` to change its size. */
EARTH.beast({
name:'moray',
realm:'sea',
metres:1.5,
axis:'z',
build:function(T){
  const g=T.group();
  const hide=T.tex(function(gg){ T.speckle(gg,[92,110,66],16,[74,92,54],0.4); });
  const m=T.mat(hide);
  /* the body, thick and ribbon-flat, in three sweeps */
  const b1=new T.THREE.Mesh(new T.THREE.BoxGeometry(0.7,1.1,2.4),m); b1.position.set(0,0,-1.0); g.add(b1);
  const b2=new T.THREE.Mesh(new T.THREE.BoxGeometry(0.6,1.0,1.6),m); b2.position.set(0.2,0,0.8); b2.rotation.y=0.2; g.add(b2);
  const head=new T.THREE.Mesh(new T.THREE.BoxGeometry(0.6,0.8,1.1),m);
  head.position.set(0.1,0.1,1.9); g.add(head);
  /* the jaw, hinged, with the glass teeth */
  const jaw=T.group();
  const jbox=new T.THREE.Mesh(new T.THREE.BoxGeometry(0.55,0.3,1.0),m);
  jbox.position.set(0,-0.15,0.5); jaw.add(jbox);
  const tmat=T.matc(0xe8f0ec);
  for(let i=0;i<4;i++){ const t2=new T.THREE.Mesh(new T.THREE.BoxGeometry(0.08,0.22,0.08),tmat);
    t2.position.set((T.hash(i,2)-0.5)*0.4,0.05,0.25+i*0.2); jaw.add(t2); }
  jaw.position.set(0.1,-0.2,1.9); g.add(jaw);
  const eye=new T.THREE.Mesh(new T.THREE.BoxGeometry(0.14,0.14,0.14),T.matc(0xd8d060));
  eye.position.set(0.45,0.35,2.1); g.add(eye);
  const eye2=eye.clone(); eye2.position.x=-0.25; g.add(eye2);
  const fin=new T.THREE.Mesh(new T.THREE.BoxGeometry(0.12,0.5,3.6),T.matc(0x6a8050));
  fin.position.set(0,0.7,-0.2); g.add(fin);
  g.userData={jaw};
  return g;
}});
