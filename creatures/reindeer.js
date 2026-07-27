/* THE REINDEER — the one deer where both the bull and the cow carry antlers,
   and the only one that men have ever made a herd of. It paws the snow away
   to get at the moss beneath. */
EARTH.beast({
name:'reindeer',
realm:'land',
metres:2.0,
build:function(T){
  const g=T.group(); const hide=0x8a7860, pale=0xe4ded0;
  const body=T.box(1.5,1.8,3.4,hide); body.position.y=3.4; g.add(body);
  const neck=T.box(1.0,1.7,1.0,pale); neck.position.set(0,4.6,1.7); neck.rotation.x=-0.45; g.add(neck);
  const head=T.box(0.9,1.0,1.8,hide); head.position.set(0,5.5,2.6); g.add(head);
  const muz=T.box(0.8,0.6,0.5,pale); muz.position.set(0,5.25,3.5); g.add(muz);
  for(const s of [1,-1]){
    const beam=T.box(0.22,2.2,0.22,0x9a8a6a); beam.geometry.translate(0,1.1,0);
    beam.position.set(s*0.4,6.1,2.4); beam.rotation.z=s*0.3; beam.rotation.x=-0.2; g.add(beam);
    const br=T.box(1.2,0.2,0.2,0x9a8a6a); br.position.set(s*1.3,7.6,2.0); g.add(br);
    const br2=T.box(0.2,0.9,0.2,0x9a8a6a); br2.position.set(s*1.0,7.0,2.9); br2.rotation.x=0.4; g.add(br2);
    const ear=T.box(0.45,0.28,0.26,hide); ear.position.set(s*0.55,5.8,2.3); g.add(ear);
    const eye=T.box(0.18,0.18,0.14,0x0e0a08); eye.position.set(s*0.45,5.6,3.3); g.add(eye); }
  const tail=T.box(0.24,0.5,0.24,pale); tail.position.set(0,3.6,-1.8); g.add(tail);
  T.legs4(g,0.6,1.3,2.6,pale,0.5);
  return g;
}});
