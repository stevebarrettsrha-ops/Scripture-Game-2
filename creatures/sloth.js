/* THE SLOTH — hanging under a branch by two hooks of claws, moving so slowly
   that green weed grows in its hair. It comes to the ground once a week and
   regrets it. */
EARTH.beast({
name:'sloth',
realm:'land',
metres:0.7,
build:function(T){
  const g=T.group(); const fur=0x8a8264, moss=0x6b7a4a, face=0xc0a882;
  const body=T.box(1.0,1.0,1.9,fur); body.position.y=0.95; g.add(body);
  for(const sx of [0.32,-0.32]){ const green=T.box(0.34,0.22,1.5,moss);
    green.position.set(sx,1.38,-0.15); g.add(green); }
  const head=T.box(0.8,0.75,0.75,fur); head.position.set(0,1.15,1.25); g.add(head);
  const fc=T.box(0.55,0.55,0.25,face); fc.position.set(0,1.1,1.6); g.add(fc);
  for(const s of [1,-1]){ const eye=T.box(0.16,0.14,0.12,0x140f0a); eye.position.set(s*0.18,1.2,1.72); g.add(eye);
    const patch=T.box(0.3,0.2,0.2,0x5a4a34); patch.position.set(s*0.2,1.06,1.7); g.add(patch);
    const claw=T.box(0.16,0.5,0.16,0x3e3428); claw.position.set(s*0.5,0.45,1.0); g.add(claw); }
  const muz=T.box(0.3,0.24,0.2,0x3e3428); muz.position.set(0,0.95,1.72); g.add(muz);
  T.legs4(g,0.4,0.7,0.55,fur,0.34);
  g.userData.head=head;
  return g;
}});
