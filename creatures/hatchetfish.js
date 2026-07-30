/* THE HATCHETFISH — a blade of silver in the twilight zone: deep-keeled,
   thin as a leaf, its upturned eyes reading the last of the light overhead
   and its belly-lamps erasing its own shadow to whatever looks up at it.
   See creatures/README.md. */
EARTH.beast({
name:'hatchetfish',
realm:'sea',
metres:0.1,
axis:'z',
build:function(T){
  const g=T.group();
  const hide=T.tex(function(gg){ T.speckle(gg,[190,200,214],10,[168,182,200],0.3); });
  const m=T.mat(hide);
  /* the hatchet-blade body: deep, and paper-thin */
  const body=new T.THREE.Mesh(new T.THREE.BoxGeometry(0.24,1.5,1.5),m); g.add(body);
  const keel=new T.THREE.Mesh(new T.THREE.BoxGeometry(0.2,0.7,0.9),m);
  keel.position.set(0,-1.0,0.1); g.add(keel);
  const tailStalk=new T.THREE.Mesh(new T.THREE.BoxGeometry(0.16,0.4,0.7),m);
  tailStalk.position.set(0,0.1,-1.0); g.add(tailStalk);
  /* the upturned eyes */
  const eye=new T.THREE.Mesh(new T.THREE.BoxGeometry(0.18,0.18,0.18),T.matc(0x14100c));
  eye.position.set(0.12,0.6,0.6); g.add(eye);
  const eye2=eye.clone(); eye2.position.x=-0.12; g.add(eye2);
  /* the belly lamps */
  const pmat=new T.THREE.MeshBasicMaterial({color:0xa8e0f8,fog:true});
  for(let i=0;i<3;i++){ const p=new T.THREE.Mesh(new T.THREE.BoxGeometry(0.12,0.14,0.14),pmat);
    p.position.set(0,-1.3,0.5-i*0.4); g.add(p); }
  const tail=new T.THREE.Mesh(new T.THREE.BoxGeometry(0.1,0.5,0.4),T.matc(0x9aacc0));
  tail.position.set(0,0.1,-1.5); g.add(tail);
  g.userData={tail};
  return g;
}});
