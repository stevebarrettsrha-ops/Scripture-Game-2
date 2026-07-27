/* THE MACKEREL — barred green-blue over silver, and never still. She runs
   the temperate seas in fast loose shoals, high in the water.
   See creatures/README.md. Change `metres` to change her size. */
EARTH.beast({
name:'mackerel',
realm:'sea',
metres:0.38,
axis:'z',
build:function(T){
  const g=T.group(); g.rotation.order='YXZ';
  const hide=T.tex(function(gg){
    T.speckle(gg,[198,208,216],10,[180,192,202],0.3);
    for(let x=0;x<16;x++) for(let y=0;y<7;y++){
      const bar=(Math.floor(x/2)%2===0)?[38,86,74]:[62,126,104];
      T.px(gg,x,y,T.rgb(bar[0],bar[1],bar[2])); }                    /* the tiger bars */
    for(let x=0;x<16;x++) for(let y=12;y<16;y++) T.px(gg,x,y,T.rgb(238,242,246)); });
  const mat=T.mat(hide);
  const body=new T.THREE.Mesh(new T.THREE.BoxGeometry(0.7,1.2,3.4),mat); g.add(body);
  const head=new T.THREE.Mesh(new T.THREE.BoxGeometry(0.6,1.0,0.9),mat);
  head.position.z=2.0; g.add(head);
  const finM=T.matc(0x4c6f74);
  const tail=new T.THREE.Mesh(new T.THREE.BoxGeometry(0.16,1.4,0.9),finM);
  tail.position.z=-2.1; g.add(tail);
  /* the little finlets down to the tail — the mark of a mackerel */
  for(let k=0;k<3;k++){ const f=new T.THREE.Mesh(new T.THREE.BoxGeometry(0.12,0.22,0.22),finM);
    f.position.set(0,0.62,-1.0-k*0.42); g.add(f); }
  const dors=new T.THREE.Mesh(new T.THREE.BoxGeometry(0.14,0.6,0.7),finM);
  dors.position.set(0,0.85,0.5); g.add(dors);
  const eye=new T.THREE.Mesh(new T.THREE.BoxGeometry(0.26,0.26,0.22),T.matc(0x14100c));
  eye.position.set(0.33,0.24,2.3); g.add(eye);
  const eye2=eye.clone(); eye2.position.x=-0.33; g.add(eye2);
  g.userData={tail};
  return g;
}});
