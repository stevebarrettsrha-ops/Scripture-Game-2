/* THE LOBSTER — the armoured walker of the bed: great claws carried before
   it, long feelers over its back, keeping to the rocks and going about its
   business by night. See creatures/README.md. */
EARTH.beast({
name:'lobster',
realm:'sea',
metres:0.5,
axis:'z',
build:function(T){
  const g=T.group();
  const shell=T.tex(function(gg){ T.speckle(gg,[128,52,40],16,[104,42,34],0.4); });
  const m=T.mat(shell);
  const body=new T.THREE.Mesh(new T.THREE.BoxGeometry(1.0,0.7,1.8),m);
  body.position.y=0.55; g.add(body);
  const tail=new T.THREE.Mesh(new T.THREE.BoxGeometry(0.8,0.4,1.2),m);
  tail.position.set(0,0.45,-1.4); g.add(tail);
  const fan=new T.THREE.Mesh(new T.THREE.BoxGeometry(1.0,0.16,0.5),m);
  fan.position.set(0,0.4,-2.1); g.add(fan);
  /* the claws */
  for(const s of [1,-1]){
    const arm=new T.THREE.Mesh(new T.THREE.BoxGeometry(0.3,0.3,0.8),m);
    arm.position.set(s*0.5,0.5,1.2); g.add(arm);
    const claw=new T.THREE.Mesh(new T.THREE.BoxGeometry(0.55,0.4,0.9),m);
    claw.position.set(s*0.55,0.5,1.9); g.add(claw);
    /* the feelers */
    const fe=new T.THREE.Mesh(new T.THREE.BoxGeometry(0.07,0.07,2.2),T.matc(0x8a4030));
    fe.position.set(s*0.25,0.95,0.6); fe.rotation.x=-0.5; fe.rotation.y=s*0.3; g.add(fe);
    /* the legs */
    for(let i=0;i<3;i++){ const leg=new T.THREE.Mesh(new T.THREE.BoxGeometry(0.5,0.12,0.12),m);
      leg.position.set(s*0.7,0.25,0.5-i*0.5); leg.rotation.z=s*0.5; g.add(leg); } }
  const eye=new T.THREE.Mesh(new T.THREE.BoxGeometry(0.12,0.12,0.12),T.matc(0x14100c));
  eye.position.set(0.25,0.85,0.95); g.add(eye);
  const eye2=eye.clone(); eye2.position.x=-0.25; g.add(eye2);
  return g;
}});
