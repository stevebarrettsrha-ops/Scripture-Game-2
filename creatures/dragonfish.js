/* THE BLACK DRAGONFISH — black as the water it lives in, a glowing barbel
   swung from its chin, and a light no other creature down there can see:
   it shines RED, and the red lights up prey that believe themselves
   invisible. The stealth bomber of the bathypelagic.
   See creatures/README.md. */
EARTH.beast({
name:'dragonfish',
realm:'sea',
metres:0.4,
axis:'z',
build:function(T){
  const g=T.group();
  const hide=T.tex(function(gg){ T.speckle(gg,[16,18,24],8,[10,12,18],0.4); });
  const m=T.mat(hide);
  const body=new T.THREE.Mesh(new T.THREE.BoxGeometry(0.4,0.6,3.0),m); g.add(body);
  const head=new T.THREE.Mesh(new T.THREE.BoxGeometry(0.38,0.5,0.7),m);
  head.position.set(0,0,1.7); g.add(head);
  const jaw=new T.THREE.Mesh(new T.THREE.BoxGeometry(0.32,0.16,0.6),m);
  jaw.position.set(0,-0.3,1.8); jaw.rotation.x=0.3; g.add(jaw);
  const tmat=T.matc(0xd8e2e0);
  for(let i=0;i<3;i++){ const t2=new T.THREE.Mesh(new T.THREE.BoxGeometry(0.06,0.3,0.06),tmat);
    t2.position.set(0.1-i*0.1,-0.12,2.05); g.add(t2); }
  const eye=new T.THREE.Mesh(new T.THREE.BoxGeometry(0.16,0.16,0.16),T.matc(0xc85a4a));
  eye.position.set(0.22,0.15,1.7); g.add(eye);
  const eye2=eye.clone(); eye2.position.x=-0.22; g.add(eye2);
  /* the barbel, hung from the chin, with its red lamp */
  const rod=T.group();
  const stalk=new T.THREE.Mesh(new T.THREE.BoxGeometry(0.05,0.9,0.05),T.matc(0x22262e));
  stalk.geometry.translate(0,-0.45,0); rod.add(stalk);
  const lure=new T.THREE.Mesh(new T.THREE.BoxGeometry(0.18,0.18,0.18),
    new T.THREE.MeshBasicMaterial({color:0xff5a48,fog:true}));
  lure.position.set(0,-0.95,0); rod.add(lure);
  rod.position.set(0,-0.35,1.75); g.add(rod);
  g.userData={rod,lure};
  const tail=new T.THREE.Mesh(new T.THREE.BoxGeometry(0.08,0.5,0.5),T.matc(0x22262e));
  tail.position.set(0,0,-1.8); g.add(tail);
  g.userData.tail=tail;
  return g;
}});
