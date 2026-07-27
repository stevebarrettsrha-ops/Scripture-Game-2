/* THE MANATEE — the sea cow, grazing the weed in the warm shallows and the
   river mouths, and so slow and so gentle that sailors took it for a mermaid
   and were clearly a long way from home. */
EARTH.beast({
name:'manatee',
realm:'sea',
metres:3.0,
build:function(T){
  const g=T.group(); const hide=0x8a8a80, pale=0xa8a89c;
  const body=T.box(3.2,3.0,7.0,hide); g.add(body);
  const head=T.box(2.4,2.2,2.0,hide); head.position.set(0,0.2,4.2); g.add(head);
  const muz=T.box(1.8,1.4,0.9,pale); muz.position.set(0,-0.4,5.2); g.add(muz);
  for(const s of [1,-1]){ const eye=T.box(0.3,0.28,0.24,0x0e0c0a); eye.position.set(s*0.9,0.6,5.0); g.add(eye);
    const fl=T.box(0.5,1.4,2.2,pale); fl.position.set(s*1.8,-0.8,2.0); fl.rotation.z=s*0.25; g.add(fl); }
  const ped=T.box(2.0,1.6,1.6,hide); ped.position.z=-4.2; g.add(ped);
  const paddle=T.box(4.4,0.5,2.6,pale); paddle.position.z=-6.0; g.add(paddle);
  g.userData={};
  return g;
}});
