/* THE GIANT ISOPOD — the woodlouse grown to a loaf of bread: armoured in
   overlapping plates, fourteen legs, walking the abyssal mud and waiting —
   sometimes years — for something dead to come down from above.
   See creatures/README.md. */
EARTH.beast({
name:'isopod',
realm:'sea',
metres:0.35,
axis:'z',
build:function(T){
  const g=T.group();
  const shell=T.tex(function(gg){ T.speckle(gg,[168,158,150],12,[146,138,132],0.4); });
  const m=T.mat(shell);
  /* the plated back, in overlapping segments */
  for(let i=0;i<5;i++){
    const seg=new T.THREE.Mesh(new T.THREE.BoxGeometry(1.1-i*0.06,0.5,0.6),m);
    seg.position.set(0,0.45,0.9-i*0.5); g.add(seg); }
  const head=new T.THREE.Mesh(new T.THREE.BoxGeometry(0.8,0.45,0.5),m);
  head.position.set(0,0.4,1.35); g.add(head);
  const eye=new T.THREE.Mesh(new T.THREE.BoxGeometry(0.18,0.14,0.14),T.matc(0x3a4448));
  eye.position.set(0.3,0.55,1.55); g.add(eye);
  const eye2=eye.clone(); eye2.position.x=-0.3; g.add(eye2);
  /* the legs, seven a side */
  for(const s of [1,-1]) for(let i=0;i<5;i++){
    const leg=new T.THREE.Mesh(new T.THREE.BoxGeometry(0.35,0.1,0.1),T.matc(0xb8aca0));
    leg.position.set(s*0.62,0.15,1.0-i*0.5); leg.rotation.z=s*0.6; g.add(leg); }
  const tail=new T.THREE.Mesh(new T.THREE.BoxGeometry(0.7,0.3,0.5),m);
  tail.position.set(0,0.35,-1.6); g.add(tail);
  return g;
}});
