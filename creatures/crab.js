/* THE CRAB — sidling over the sand on the shelf.
   See creatures/README.md. Change `metres` to change its size.
   (For a giant spider crab, set metres to 3 and axis to 'x'.) */
EARTH.beast({
name:'crab',
realm:'sea',
metres:0.45,                 /* claw to claw */
axis:'x',
build:function(T){
  const g=T.group();
  const body=T.box(2.4,1.2,1.8,0xd0472e); body.position.y=0.8; g.add(body);
  for(const s of [1,-1]){
    const claw=T.box(1.0,0.9,0.9,0xe0583a); claw.position.set(s*1.8,0.9,0.9); g.add(claw);
    for(let i=0;i<3;i++){ const leg=T.box(1.2,0.25,0.25,0xb03a24);
      leg.position.set(s*1.6,0.5,-0.2-i*0.6); leg.rotation.z=s*0.3; g.add(leg); } }
  for(const s of [1,-1]){ const eye=T.box(0.3,0.6,0.3,0x201818);
    eye.position.set(s*0.5,1.6,0.9); g.add(eye); }
  return g;
}});
