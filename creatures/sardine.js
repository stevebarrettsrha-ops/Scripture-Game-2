/* THE SARDINE — the least fish of the sea and the most of it. They run in
   bait-balls of thousands off every temperate coast, turning all at once so
   the whole school flashes silver and is gone again.
   See creatures/README.md. Change `metres` to change her size. */
EARTH.beast({
name:'sardine',
realm:'sea',
metres:0.20,
axis:'z',
build:function(T){
  const g=T.group(); g.rotation.order='YXZ';
  /* silver flank, dark back, a row of black spots along the side */
  const hide=T.tex(function(gg){
    T.speckle(gg,[196,206,216],10,[176,188,200],0.35);
    for(let x=0;x<16;x++) for(let y=0;y<5;y++) T.px(gg,x,y,T.rgb(58,86,110));   /* the back */
    for(let x=1;x<16;x+=4) T.px(gg,x,8,T.rgb(40,52,64));                        /* the spots */
    for(let x=0;x<16;x++) for(let y=13;y<16;y++) T.px(gg,x,y,T.rgb(232,238,244)); });
  const mat=T.mat(hide);
  const body=new T.THREE.Mesh(new T.THREE.BoxGeometry(0.6,1.0,3.0),mat); g.add(body);
  const head=new T.THREE.Mesh(new T.THREE.BoxGeometry(0.5,0.8,0.7),mat);
  head.position.z=1.7; g.add(head);
  const tail=new T.THREE.Mesh(new T.THREE.BoxGeometry(0.14,1.1,0.8),T.matc(0x9fb0be));
  tail.position.z=-1.8; g.add(tail);
  const fin=new T.THREE.Mesh(new T.THREE.BoxGeometry(0.12,0.5,0.7),T.matc(0x9fb0be));
  fin.position.set(0,0.7,0.1); g.add(fin);
  g.userData={tail};
  return g;
}});
