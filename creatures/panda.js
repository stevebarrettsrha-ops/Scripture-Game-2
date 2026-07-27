/* THE GIANT PANDA — of the bamboo on the flanks of the mountains of the
   east, black-legged, black-eared, black-eyed, and white everywhere else.
   It sits down to eat and does very little else. */
EARTH.beast({
name:'panda',
realm:'land',
metres:1.6,
build:function(T){
  const g=T.group(); const w=0xf0eee6, k=0x1a1816;
  const body=T.box(2.4,2.3,3.6,w); body.position.y=2.9; g.add(body);
  const band=T.box(2.45,1.2,1.3,k); band.position.set(0,3.2,0.9); g.add(band);
  const head=T.box(1.9,1.7,1.7,w); head.position.set(0,4.3,2.3); g.add(head);
  const muz=T.box(0.9,0.7,0.6,w); muz.position.set(0,3.9,3.3); g.add(muz);
  const nose=T.box(0.4,0.3,0.25,k); nose.position.set(0,4.05,3.62); g.add(nose);
  for(const s of [1,-1]){ const ear=T.box(0.62,0.6,0.35,k); ear.position.set(s*0.78,5.2,2.1); g.add(ear);
    const patch=T.box(0.62,0.6,0.3,k); patch.position.set(s*0.5,4.5,3.16); g.add(patch);
    const eye=T.box(0.2,0.2,0.16,0x0a0806); eye.position.set(s*0.5,4.5,3.34); g.add(eye); }
  T.legs4(g,0.85,1.2,1.7,k,0.95);
  g.userData.head=head;
  return g;
}});
