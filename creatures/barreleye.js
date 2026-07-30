/* THE BARRELEYE — the fish with the glass head: a transparent dome over the
   skull, and inside it two green barrel eyes aimed straight up, reading the
   silhouettes of whatever passes overhead. It hangs almost perfectly still.
   See creatures/README.md. */
EARTH.beast({
name:'barreleye',
realm:'sea',
metres:0.15,
axis:'z',
build:function(T){
  const g=T.group();
  const hide=T.tex(function(gg){ T.speckle(gg,[52,64,74],10,[42,54,64],0.35); });
  const m=T.mat(hide);
  const body=new T.THREE.Mesh(new T.THREE.BoxGeometry(0.7,0.9,1.8),m); g.add(body);
  /* the glass dome, and the green barrels inside it looking up */
  const dome=new T.THREE.Mesh(new T.THREE.BoxGeometry(0.68,0.55,0.9),T.glass(0x9fc8d8,0.35));
  dome.position.set(0,0.65,0.9); g.add(dome);
  const bmat=new T.THREE.MeshBasicMaterial({color:0x5ad078,fog:true});
  const barL=new T.THREE.Mesh(new T.THREE.BoxGeometry(0.2,0.3,0.2),bmat);
  barL.position.set(0.16,0.6,0.9); g.add(barL);
  const barR=barL.clone(); barR.position.x=-0.16; g.add(barR);
  const mouth=new T.THREE.Mesh(new T.THREE.BoxGeometry(0.3,0.24,0.3),m);
  mouth.position.set(0,-0.1,1.05); g.add(mouth);
  const fmat=T.matc(0x3a4a58);
  const tail=new T.THREE.Mesh(new T.THREE.BoxGeometry(0.12,0.7,0.5),fmat);
  tail.position.set(0,0,-1.15); g.add(tail);
  const pfL=new T.THREE.Mesh(new T.THREE.BoxGeometry(0.7,0.1,0.4),fmat);
  pfL.position.set(0.55,-0.2,0.3); g.add(pfL);
  const pfR=pfL.clone(); pfR.position.x=-0.55; g.add(pfR);
  g.userData={tail};
  return g;
}});
