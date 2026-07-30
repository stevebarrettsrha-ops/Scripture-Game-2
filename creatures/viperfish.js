/* THE VIPERFISH — the fangs of the twilight: teeth so long they cannot fit
   in the mouth, a hinged head that throws itself open, and a lit lure on
   the first spine of its back. It hangs in the dark and strikes whatever
   the lamp brings close.
   See creatures/README.md. */
EARTH.beast({
name:'viperfish',
realm:'sea',
metres:0.35,
axis:'z',
build:function(T){
  const g=T.group();
  const hide=T.tex(function(gg){ T.speckle(gg,[38,52,70],12,[28,42,58],0.4); });
  const m=T.mat(hide);
  const body=new T.THREE.Mesh(new T.THREE.BoxGeometry(0.55,0.8,2.6),m); g.add(body);
  const head=new T.THREE.Mesh(new T.THREE.BoxGeometry(0.5,0.7,0.8),m);
  head.position.set(0,0.05,1.6); g.add(head);
  /* the jaw and the impossible teeth */
  const jaw=new T.THREE.Mesh(new T.THREE.BoxGeometry(0.45,0.24,0.8),m);
  jaw.position.set(0,-0.4,1.7); jaw.rotation.x=0.35; g.add(jaw);
  const tmat=T.matc(0xe8f2f0);
  for(let i=0;i<3;i++){
    const up=new T.THREE.Mesh(new T.THREE.BoxGeometry(0.07,0.5,0.07),tmat);
    up.position.set(0.15-i*0.15,-0.05,2.0); up.rotation.x=0.2; g.add(up);
    const dn=new T.THREE.Mesh(new T.THREE.BoxGeometry(0.07,0.45,0.07),tmat);
    dn.position.set(0.15-i*0.15,-0.5,2.05); dn.rotation.x=-0.2; g.add(dn); }
  const eye=new T.THREE.Mesh(new T.THREE.BoxGeometry(0.2,0.2,0.2),T.matc(0x9fd8c8));
  eye.position.set(0.28,0.25,1.6); g.add(eye);
  const eye2=eye.clone(); eye2.position.x=-0.28; g.add(eye2);
  /* the lit lure on the long first fin-ray */
  const rod=T.group();
  const ray=new T.THREE.Mesh(new T.THREE.BoxGeometry(0.07,1.1,0.07),T.matc(0x2a3a4c));
  ray.geometry.translate(0,0.55,0); rod.add(ray);
  const lure=new T.THREE.Mesh(new T.THREE.BoxGeometry(0.22,0.22,0.22),
    new T.THREE.MeshBasicMaterial({color:0x9ff6e2,fog:true}));
  lure.position.set(0,1.2,0); rod.add(lure);
  rod.position.set(0,0.4,0.9); rod.rotation.x=0.5; g.add(rod);
  g.userData={rod,lure};
  const tail=new T.THREE.Mesh(new T.THREE.BoxGeometry(0.1,0.6,0.5),T.matc(0x2a3a4c));
  tail.position.set(0,0,-1.6); g.add(tail);
  g.userData.tail=tail;
  return g;
}});
