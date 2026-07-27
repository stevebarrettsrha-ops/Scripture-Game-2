/* THE ORYX — the antelope of the waste, pale as the sand with a black mask,
   and two straight horns as long as it is tall. It goes where there is no
   water at all and does not die of it. */
EARTH.beast({
name:'oryx',
realm:'land',
metres:1.9,
build:function(T){
  const g=T.group(); const hide=0xe6ddca, mark=0x2b2620;
  const body=T.box(1.5,1.8,3.4,hide); body.position.y=3.2; g.add(body);
  const flank=T.box(1.56,0.35,3.2,mark); flank.position.set(0,2.5,0); g.add(flank);
  const neck=T.box(0.9,1.8,0.9,hide); neck.position.set(0,4.3,1.5); neck.rotation.x=-0.5; g.add(neck);
  const head=T.box(0.8,0.9,1.7,hide); head.position.set(0,5.2,2.4); g.add(head);
  const mask=T.box(0.84,0.5,1.2,mark); mask.position.set(0,5.3,2.7); g.add(mask);
  const muz=T.box(0.7,0.5,0.4,mark); muz.position.set(0,4.95,3.2); g.add(muz);
  for(const s of [1,-1]){ const horn=T.box(0.2,3.4,0.2,0x241f18); horn.geometry.translate(0,1.7,0);
    horn.position.set(s*0.26,5.6,2.0); horn.rotation.x=0.42; horn.rotation.z=s*0.06; g.add(horn);
    const ear=T.box(0.55,0.3,0.3,hide); ear.position.set(s*0.6,5.4,2.1); g.add(ear);
    const eye=T.box(0.18,0.18,0.14,0x0c0a08); eye.position.set(s*0.42,5.3,3.0); g.add(eye); }
  const tail=T.box(0.24,1.6,0.24,mark); tail.geometry.translate(0,-0.8,0);
  tail.position.set(0,3.5,-1.8); g.add(tail);
  T.legs4(g,0.6,1.2,2.5,hide,0.5);
  g.userData.head=head;
  return g;
}});
