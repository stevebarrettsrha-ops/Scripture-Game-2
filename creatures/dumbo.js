/* THE DUMBO OCTOPUS — the deepest-living octopus there is: a soft little
   bell of a body with two round fins on its head like elephant ears, rowing
   itself gently over the abyssal plain kilometres down.
   `tents` is handed back so the engine can curl the arms;
   `wingL`/`wingR` so it can flap the ears.
   See creatures/README.md. */
EARTH.beast({
name:'dumbo',
realm:'sea',
metres:0.3,
axis:'z',
build:function(T){
  const g=T.group();
  const hide=T.tex(function(gg){ T.speckle(gg,[196,140,150],14,[176,120,134],0.35); });
  const m=T.mat(hide);
  const body=new T.THREE.Mesh(new T.THREE.BoxGeometry(1.2,1.1,1.4),m); g.add(body);
  /* the ears */
  const wingL=new T.THREE.Mesh(new T.THREE.BoxGeometry(0.7,0.5,0.16),m);
  wingL.position.set(0.75,0.4,0.2); g.add(wingL);
  const wingR=wingL.clone(); wingR.position.x=-0.75; g.add(wingR);
  const eye=new T.THREE.Mesh(new T.THREE.BoxGeometry(0.16,0.16,0.16),T.matc(0x14100c));
  eye.position.set(0.4,0.2,0.72); g.add(eye);
  const eye2=eye.clone(); eye2.position.x=-0.4; g.add(eye2);
  /* the short webbed arms */
  const tents=[];
  for(let i=0;i<6;i++){ const a=(i/6-0.5)*2.6;
    const arm=new T.THREE.Mesh(new T.THREE.BoxGeometry(0.2,0.2,0.9),m);
    arm.geometry.translate(0,0,0.45);
    arm.position.set(Math.sin(a)*0.4,-0.5,0.5); arm.rotation.y=a*0.5; arm.rotation.x=0.5;
    g.add(arm); tents.push(arm); }
  g.userData={tents,wingL,wingR};
  return g;
}});
