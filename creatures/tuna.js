/* THE TUNA — blue-black above, silver beneath, built like a spear and warm
   in her own blood. She crosses whole oceans and is the fastest thing the
   open sea has. See creatures/README.md. Change `metres` to change her size.
   (2.2 m is a good bluefin; the giants reach three.) */
EARTH.beast({
name:'tuna',
realm:'sea',
metres:2.2,
axis:'z',
build:function(T){
  const g=T.group(); g.rotation.order='YXZ';
  const hide=T.tex(function(gg){
    T.speckle(gg,[188,198,208],10,[170,182,194],0.3);
    for(let x=0;x<16;x++) for(let y=0;y<6;y++) T.px(gg,x,y,T.rgb(26,50,84));    /* the blue-black back */
    for(let x=0;x<16;x++) for(let y=6;y<8;y++) T.px(gg,x,y,T.rgb(72,110,150));
    for(let x=0;x<16;x++) for(let y=13;y<16;y++) T.px(gg,x,y,T.rgb(240,244,248)); });
  const mat=T.mat(hide);
  /* the spindle: deep at the shoulder, drawn to nothing at the tail */
  const body=new T.THREE.Mesh(new T.THREE.BoxGeometry(1.5,2.4,4.0),mat); g.add(body);
  const shoulder=new T.THREE.Mesh(new T.THREE.BoxGeometry(1.3,2.0,1.4),mat);
  shoulder.position.z=2.5; g.add(shoulder);
  const snout=new T.THREE.Mesh(new T.THREE.BoxGeometry(0.8,1.1,1.3),mat);
  snout.position.z=3.7; g.add(snout);
  const peduncle=new T.THREE.Mesh(new T.THREE.BoxGeometry(0.5,0.7,1.6),mat);
  peduncle.position.z=-2.6; g.add(peduncle);
  const finM=T.matc(0x2a4a70), yel=T.matc(0xe0c24a);
  /* the great lunate tail */
  const tail=T.group();
  const tu=new T.THREE.Mesh(new T.THREE.BoxGeometry(0.22,1.6,0.9),finM);
  tu.position.set(0,0.9,-0.4); tu.rotation.x=0.35; tail.add(tu);
  const td=tu.clone(); td.position.y=-0.9; td.rotation.x=-0.35; tail.add(td);
  tail.position.z=-3.6; g.add(tail);
  const dors=new T.THREE.Mesh(new T.THREE.BoxGeometry(0.18,1.1,1.0),finM);
  dors.position.set(0,1.6,1.0); g.add(dors);
  /* the yellow finlets, and the long sickle pectorals */
  for(let k=0;k<5;k++){ const f=new T.THREE.Mesh(new T.THREE.BoxGeometry(0.14,0.26,0.24),yel);
    f.position.set(0,1.0,-1.0-k*0.42); g.add(f);
    const f2=f.clone(); f2.position.y=-1.0; g.add(f2); }
  const pL=new T.THREE.Mesh(new T.THREE.BoxGeometry(1.6,0.18,0.7),finM);
  pL.position.set(1.0,-0.4,1.7); pL.rotation.z=-0.35; pL.rotation.y=0.3; g.add(pL);
  const pR=pL.clone(); pR.position.x=-1.0; pR.rotation.z=0.35; pR.rotation.y=-0.3; g.add(pR);
  const eye=new T.THREE.Mesh(new T.THREE.BoxGeometry(0.4,0.4,0.3),T.matc(0x0e0c08));
  eye.position.set(0.66,0.5,3.3); g.add(eye);
  const eye2=eye.clone(); eye2.position.x=-0.66; g.add(eye2);
  g.userData={tail};
  return g;
}});
