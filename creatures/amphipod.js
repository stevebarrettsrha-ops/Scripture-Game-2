/* THE HADAL AMPHIPOD — the shrimp of the trench floors: pale, big-eyed,
   and swarming. Drop anything edible into the deepest water on earth and
   these arrive in minutes, in hundreds. The floor of every trench belongs
   to them. See creatures/README.md. */
EARTH.beast({
name:'amphipod',
realm:'sea',
metres:0.1,
axis:'z',
build:function(T){
  const g=T.group();
  const shell=T.tex(function(gg){ T.speckle(gg,[224,214,196],10,[206,196,180],0.3); });
  const m=T.mat(shell);
  /* the arched, plated back */
  for(let i=0;i<4;i++){
    const seg=new T.THREE.Mesh(new T.THREE.BoxGeometry(0.6,0.5,0.5),m);
    seg.position.set(0,0.4+Math.sin(i/3*Math.PI)*0.2,0.7-i*0.45); g.add(seg); }
  const eye=new T.THREE.Mesh(new T.THREE.BoxGeometry(0.14,0.14,0.1),T.matc(0x2a2430));
  eye.position.set(0.2,0.5,1.0); g.add(eye);
  const eye2=eye.clone(); eye2.position.x=-0.2; g.add(eye2);
  /* the legs beneath */
  for(const s of [1,-1]) for(let i=0;i<3;i++){
    const leg=new T.THREE.Mesh(new T.THREE.BoxGeometry(0.08,0.3,0.08),T.matc(0xc8b8a0));
    leg.position.set(s*0.28,0.12,0.5-i*0.4); leg.rotation.z=s*0.3; g.add(leg); }
  /* the antennae */
  for(const s of [1,-1]){
    const an=new T.THREE.Mesh(new T.THREE.BoxGeometry(0.05,0.05,0.7),T.matc(0xc8b8a0));
    an.position.set(s*0.12,0.5,1.35); an.rotation.y=s*0.2; g.add(an); }
  return g;
}});
