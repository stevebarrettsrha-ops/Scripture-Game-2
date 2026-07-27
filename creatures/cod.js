/* THE COD — the fish the northern fleets were built for. Heavy, mottled and
   slow, hanging low over the cold shelf with her chin-barbel down.
   See creatures/README.md. Change `metres` to change her size. */
EARTH.beast({
name:'cod',
realm:'sea',
metres:1.0,
axis:'z',
build:function(T){
  const g=T.group(); g.rotation.order='YXZ';
  const hide=T.tex(function(gg){
    T.speckle(gg,[142,132,96],16,[120,112,80],0.4);
    for(let k=0;k<26;k++){ const x=Math.floor(T.hash(k,1.9)*16), y=Math.floor(T.hash(k,4.3)*13);
      T.px(gg,x,y,T.rgb(168,158,116)); }                              /* the mottling */
    for(let x=0;x<16;x++) T.px(gg,x,9,T.rgb(226,226,218)); });        /* the pale lateral line */
  const mat=T.mat(hide);
  const body=new T.THREE.Mesh(new T.THREE.BoxGeometry(1.2,2.0,4.4),mat); g.add(body);
  const head=new T.THREE.Mesh(new T.THREE.BoxGeometry(1.1,1.8,1.5),mat);
  head.position.z=2.8; g.add(head);
  const barb=new T.THREE.Mesh(new T.THREE.BoxGeometry(0.12,0.5,0.12),T.matc(0xb0a478));
  barb.position.set(0,-1.1,3.4); g.add(barb);                          /* the chin barbel */
  const finM=T.matc(0x8c8460);
  const tail=new T.THREE.Mesh(new T.THREE.BoxGeometry(0.22,1.9,0.9),finM);
  tail.position.z=-2.7; g.add(tail);
  for(let k=0;k<3;k++){ const d=new T.THREE.Mesh(new T.THREE.BoxGeometry(0.16,0.55,0.9),finM);
    d.position.set(0,1.25,1.2-k*1.3); g.add(d); }                      /* three dorsals */
  const pL=new T.THREE.Mesh(new T.THREE.BoxGeometry(0.8,0.16,0.7),finM);
  pL.position.set(0.7,-0.7,1.8); pL.rotation.z=-0.25; g.add(pL);
  const pR=pL.clone(); pR.position.x=-0.7; pR.rotation.z=0.25; g.add(pR);
  const eye=new T.THREE.Mesh(new T.THREE.BoxGeometry(0.34,0.34,0.28),T.matc(0x141008));
  eye.position.set(0.58,0.55,3.2); g.add(eye);
  const eye2=eye.clone(); eye2.position.x=-0.58; g.add(eye2);
  g.userData={tail};
  return g;
}});
