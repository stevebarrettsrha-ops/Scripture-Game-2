/* THE FLYING FISH — the fish with wings: it runs from the tuna and the
   dorado by leaving the sea altogether, spreading its great pectorals and
   sailing a bowshot over the swell. The engine throws them from the bow
   wave, as the true sea does.
   See creatures/README.md. Change `metres` to change its size. */
EARTH.beast({
name:'flyingfish',
realm:'sea',
metres:0.45,
axis:'z',
build:function(T){
  const g=T.group();
  const hide=T.tex(function(gg){ T.speckle(gg,[74,110,150],12,[60,94,132],0.35); });
  const m=T.mat(hide);
  const body=new T.THREE.Mesh(new T.THREE.BoxGeometry(0.7,0.8,2.4),m); g.add(body);
  const head=new T.THREE.Mesh(new T.THREE.BoxGeometry(0.6,0.65,0.6),m);
  head.position.set(0,0,1.4); g.add(head);
  const eye=new T.THREE.Mesh(new T.THREE.BoxGeometry(0.18,0.18,0.18),T.matc(0x14100c));
  eye.position.set(0.32,0.2,1.5); g.add(eye);
  const eye2=eye.clone(); eye2.position.x=-0.32; g.add(eye2);
  /* the wings — pectorals grown to sails */
  const wmat=T.glass(0xb8d4e8,0.75);
  const wingL=new T.THREE.Mesh(new T.THREE.BoxGeometry(2.2,0.1,1.1),wmat);
  wingL.geometry.translate(1.1,0,0); wingL.position.set(0.3,0.15,0.7);
  wingL.rotation.z=-0.25; g.add(wingL);
  const wingR=new T.THREE.Mesh(new T.THREE.BoxGeometry(2.2,0.1,1.1),wmat);
  wingR.geometry.translate(-1.1,0,0); wingR.position.set(-0.3,0.15,0.7);
  wingR.rotation.z=0.25; g.add(wingR);
  const tail=new T.THREE.Mesh(new T.THREE.BoxGeometry(0.14,0.9,0.6),T.matc(0x4a6a8a));
  tail.position.set(0,-0.1,-1.5); g.add(tail);
  g.userData={tail,wingL,wingR};
  return g;
}});
