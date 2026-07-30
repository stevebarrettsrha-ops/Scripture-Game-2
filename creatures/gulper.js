/* THE GULPER EEL — a mouth with a tail on it: the jaws are most of the
   animal, hinged to swallow things bigger than itself, and the whip of a
   tail ends in a small pink light. It drifts open-mouthed through the
   bathypelagic and takes what comes.
   See creatures/README.md. */
EARTH.beast({
name:'gulper',
realm:'sea',
metres:0.75,
axis:'z',
build:function(T){
  const g=T.group();
  const hide=T.tex(function(gg){ T.speckle(gg,[24,26,34],8,[16,18,26],0.4); });
  const m=T.mat(hide);
  /* the vast jaws — the whole front of the animal */
  const upper=new T.THREE.Mesh(new T.THREE.BoxGeometry(1.1,0.4,1.8),m);
  upper.position.set(0,0.3,1.2); upper.rotation.x=-0.15; g.add(upper);
  const jaw=new T.THREE.Mesh(new T.THREE.BoxGeometry(1.1,0.4,1.8),m);
  jaw.position.set(0,-0.45,1.2); jaw.rotation.x=0.35; g.add(jaw);
  const throat=new T.THREE.Mesh(new T.THREE.BoxGeometry(0.9,0.9,0.9),m);
  throat.position.set(0,-0.1,0.2); g.add(throat);
  const eye=new T.THREE.Mesh(new T.THREE.BoxGeometry(0.12,0.12,0.12),T.matc(0x9fc8d8));
  eye.position.set(0.3,0.5,1.9); g.add(eye);
  const eye2=eye.clone(); eye2.position.x=-0.3; g.add(eye2);
  /* the dwindling body and the whip tail */
  const b1=new T.THREE.Mesh(new T.THREE.BoxGeometry(0.4,0.4,1.4),m);
  b1.position.set(0,-0.05,-0.9); g.add(b1);
  const b2=new T.THREE.Mesh(new T.THREE.BoxGeometry(0.2,0.2,1.6),m);
  b2.position.set(0,0,-2.3); g.add(b2);
  const tail=new T.THREE.Mesh(new T.THREE.BoxGeometry(0.1,0.1,1.4),m);
  tail.position.set(0,0.05,-3.7); g.add(tail);
  /* the pink lamp at the tip of the whip */
  const lure=new T.THREE.Mesh(new T.THREE.BoxGeometry(0.18,0.18,0.18),
    new T.THREE.MeshBasicMaterial({color:0xff8fb0,fog:true}));
  lure.position.set(0,0.05,-4.4); g.add(lure);
  g.userData={tail,jaw,lure};
  return g;
}});
