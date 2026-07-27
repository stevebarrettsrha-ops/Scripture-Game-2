/* THE SALMON — silver out of the sea, and she comes back to the river she
   was spawned in. Found off the cold coasts and thick at every river mouth.
   See creatures/README.md. Change `metres` to change her size. */
EARTH.beast({
name:'salmon',
realm:'sea',
metres:0.85,
axis:'z',
build:function(T){
  const g=T.group(); g.rotation.order='YXZ';
  const hide=T.tex(function(gg){
    T.speckle(gg,[176,186,196],12,[158,170,182],0.3);
    for(let x=0;x<16;x++) for(let y=0;y<5;y++) T.px(gg,x,y,T.rgb(74,94,112));   /* steel back */
    for(let x=0;x<16;x++) for(let y=9;y<12;y++) T.px(gg,x,y,T.rgb(210,142,132)); /* the rose stripe */
    for(let k=0;k<10;k++){ const x=Math.floor(T.hash(k,2.7)*16), y=Math.floor(T.hash(k,5.1)*6);
      T.px(gg,x,y,T.rgb(46,58,70)); } });                                        /* the black flecks */
  const mat=T.mat(hide);
  const body=new T.THREE.Mesh(new T.THREE.BoxGeometry(0.9,1.7,4.2),mat); g.add(body);
  const head=new T.THREE.Mesh(new T.THREE.BoxGeometry(0.8,1.3,1.2),mat);
  head.position.z=2.5; g.add(head);
  const jaw=new T.THREE.Mesh(new T.THREE.BoxGeometry(0.6,0.4,0.9),mat);
  jaw.position.set(0,-0.55,2.9); g.add(jaw);                                     /* the kype */
  const finM=T.matc(0x8e9daa);
  const tail=new T.THREE.Mesh(new T.THREE.BoxGeometry(0.2,2.0,1.1),finM);
  tail.position.z=-2.6; g.add(tail);
  const dors=new T.THREE.Mesh(new T.THREE.BoxGeometry(0.16,0.8,1.1),finM);
  dors.position.set(0,1.1,0.2); g.add(dors);
  const adip=new T.THREE.Mesh(new T.THREE.BoxGeometry(0.14,0.35,0.4),finM);
  adip.position.set(0,1.0,-1.7); g.add(adip);                                    /* the adipose fin */
  const pL=new T.THREE.Mesh(new T.THREE.BoxGeometry(0.7,0.15,0.6),finM);
  pL.position.set(0.55,-0.6,1.5); pL.rotation.z=-0.3; g.add(pL);
  const pR=pL.clone(); pR.position.x=-0.55; pR.rotation.z=0.3; g.add(pR);
  const eye=new T.THREE.Mesh(new T.THREE.BoxGeometry(0.3,0.3,0.25),T.matc(0x14100c));
  eye.position.set(0.42,0.35,2.9); g.add(eye);
  const eye2=eye.clone(); eye2.position.x=-0.42; g.add(eye2);
  g.userData={tail};
  return g;
}});
