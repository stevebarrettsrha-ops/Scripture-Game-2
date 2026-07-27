/* THE PRONGHORN — the fastest thing in the new world, and faster than
   anything now alive there needs it to be: it was built to outrun a cat that
   has been extinct ten thousand years. The horns fork forward. */
EARTH.beast({
name:'pronghorn',
realm:'land',
metres:1.4,
build:function(T){
  const g=T.group(); const tan=0xc7a068, w=0xf2ece0, k=0x2a221a;
  const body=T.box(1.2,1.4,2.6,tan); body.position.y=2.7; g.add(body);
  const belly=T.box(1.1,0.45,2.4,w); belly.position.set(0,2.1,0); g.add(belly);
  const rump=T.box(1.15,0.9,0.4,w); rump.position.set(0,2.9,-1.3); g.add(rump);
  const neck=T.box(0.7,1.4,0.7,tan); neck.position.set(0,3.6,1.2); neck.rotation.x=-0.45; g.add(neck);
  const bar=T.box(0.74,0.3,0.72,w); bar.position.set(0,3.5,1.4); g.add(bar);
  const head=T.box(0.66,0.72,1.3,tan); head.position.set(0,4.3,1.9); g.add(head);
  const muz=T.box(0.58,0.46,0.4,k); muz.position.set(0,4.05,2.5); g.add(muz);
  for(const s of [1,-1]){ const h=T.box(0.16,1.0,0.16,k); h.geometry.translate(0,0.5,0);
    h.position.set(s*0.24,4.7,1.8); g.add(h);
    const prong=T.box(0.16,0.16,0.5,k); prong.position.set(s*0.24,5.3,2.1); g.add(prong);
    const ear=T.box(0.42,0.26,0.24,tan); ear.position.set(s*0.5,4.6,1.7); g.add(ear);
    const eye=T.box(0.16,0.16,0.13,0x0e0a08); eye.position.set(s*0.35,4.4,2.35); g.add(eye); }
  T.legs4(g,0.44,0.95,2.2,tan,0.34);
  g.userData.head=head;
  return g;
}});
