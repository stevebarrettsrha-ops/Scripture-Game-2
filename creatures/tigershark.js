/* THE TIGER SHARK — the striped scavenger-hunter of the warm seas: blunter
   in the nose than the great white, barred down the flanks, and it eats
   anything the sea will give it. It hunts by night, close inshore.
   `tail` is handed back so the engine can drive it.
   See creatures/README.md. Change `metres` to change its size. */
EARTH.beast({
name:'tigershark',
realm:'sea',
metres:4.9,
axis:'z',
build:function(T){
  const g=T.group();
  const top=T.tex(function(gg){
    T.speckle(gg,[74,88,84],10,[62,76,72],0.35);
    gg.fillStyle='rgba(34,44,42,0.85)';
    for(const x of [2,5,8,11,14]) gg.fillRect(x,0,1,16); });
  const bel=T.tex(function(gg){ T.speckle(gg,[214,220,222],8,[198,206,208],0.3); });
  const m=T.mat(top), bm=T.mat(bel);
  const body=new T.THREE.Mesh(new T.THREE.BoxGeometry(1.7,1.9,6.0),m); g.add(body);
  const belly=new T.THREE.Mesh(new T.THREE.BoxGeometry(1.5,0.7,5.4),bm);
  belly.position.y=-1.1; g.add(belly);
  /* the blunt head and the wide mouth */
  const head=new T.THREE.Mesh(new T.THREE.BoxGeometry(1.5,1.3,1.6),m);
  head.position.set(0,-0.1,3.4); g.add(head);
  const mouth=new T.THREE.Mesh(new T.THREE.BoxGeometry(1.2,0.4,0.7),T.matc(0x30201c));
  mouth.position.set(0,-0.75,3.9); g.add(mouth);
  const tmat=T.matc(0xe8f0ec);
  for(let i=0;i<5;i++){ const t2=new T.THREE.Mesh(new T.THREE.BoxGeometry(0.12,0.3,0.12),tmat);
    t2.position.set(-0.5+i*0.25,-0.55,4.15); g.add(t2); }
  const eye=new T.THREE.Mesh(new T.THREE.BoxGeometry(0.26,0.26,0.26),T.matc(0x14100c));
  eye.position.set(0.78,0.3,3.3); g.add(eye);
  const eye2=eye.clone(); eye2.position.x=-0.78; g.add(eye2);
  /* fins and the swept tail */
  const fmat=T.matc(0x4a5a56);
  const dors=new T.THREE.Mesh(new T.THREE.BoxGeometry(0.3,1.5,1.5),fmat);
  dors.position.set(0,1.6,0.4); dors.rotation.x=0.35; g.add(dors);
  const pfL=new T.THREE.Mesh(new T.THREE.BoxGeometry(2.0,0.24,1.0),fmat);
  pfL.position.set(1.3,-0.7,1.6); pfL.rotation.z=-0.45; g.add(pfL);
  const pfR=pfL.clone(); pfR.position.x=-1.3; pfR.rotation.z=0.45; g.add(pfR);
  const tail=T.group();
  const tUp=new T.THREE.Mesh(new T.THREE.BoxGeometry(0.26,2.1,1.0),fmat);
  tUp.position.set(0,0.8,-0.5); tUp.rotation.x=0.45; tail.add(tUp);
  const tDn=new T.THREE.Mesh(new T.THREE.BoxGeometry(0.26,1.1,0.7),fmat);
  tDn.position.set(0,-0.5,-0.3); tDn.rotation.x=-0.35; tail.add(tDn);
  tail.position.set(0,0,-3.1); g.add(tail);
  g.userData={tail};
  return g;
}});
