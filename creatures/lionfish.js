/* THE LIONFISH — the striped hunter of the reef, hanging almost still over
   the coral with its fan of venomous spines spread wide. It hovers, and at
   dusk it hunts the small fish into a corner and takes them.
   See creatures/README.md. Change `metres` to change its size. */
EARTH.beast({
name:'lionfish',
realm:'sea',
metres:0.38,
axis:'z',
build:function(T){
  const g=T.group();
  const hide=T.tex(function(gg){
    T.speckle(gg,[190,84,64],12,[170,70,54],0.35);
    gg.fillStyle='rgb(238,230,214)';
    for(const x of [2,5,8,11,14]) gg.fillRect(x,0,1,16); });
  const m=T.mat(hide);
  const body=new T.THREE.Mesh(new T.THREE.BoxGeometry(0.8,1.2,2.2),m); g.add(body);
  const head=new T.THREE.Mesh(new T.THREE.BoxGeometry(0.7,1.0,0.7),m);
  head.position.set(0,0,1.35); g.add(head);
  const eye=new T.THREE.Mesh(new T.THREE.BoxGeometry(0.16,0.16,0.16),T.matc(0x14100c));
  eye.position.set(0.38,0.3,1.45); g.add(eye);
  const eye2=eye.clone(); eye2.position.x=-0.38; g.add(eye2);
  /* the fan of spines — the whole glory of the beast */
  const smat=T.matc(0xd8c8b0);
  for(let i=0;i<7;i++){ const a=(i/6-0.5)*1.9;
    const sp=new T.THREE.Mesh(new T.THREE.BoxGeometry(0.09,1.5,0.09),smat);
    sp.geometry.translate(0,0.75,0);
    sp.position.set(0,0.55,0.6-i*0.28); sp.rotation.x=-a*0.5; sp.rotation.z=(T.hash(i,3)-0.5)*0.3;
    g.add(sp); }
  for(const s of [1,-1]){ for(let i=0;i<4;i++){
    const sp=new T.THREE.Mesh(new T.THREE.BoxGeometry(0.09,1.1,0.09),smat);
    sp.geometry.translate(0,0.55,0);
    sp.position.set(s*0.45,-0.1,0.7-i*0.4); sp.rotation.z=s*(0.8+i*0.12);
    g.add(sp); } }
  const tail=new T.THREE.Mesh(new T.THREE.BoxGeometry(0.16,0.9,0.6),smat);
  tail.position.set(0,0,-1.4); g.add(tail);
  g.userData={tail};
  return g;
}});
