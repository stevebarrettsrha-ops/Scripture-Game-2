/* THE GAZELLE — light, fawn above and white beneath, with the black band
   along the flank and the lyre horns. It is what everything on the plain is
   trying to catch, and it can outrun all of them but the cheetah. */
EARTH.beast({
name:'gazelle',
realm:'land',
metres:1.4,
build:function(T){
  const g=T.group(); const fawn=0xc79a5c, pale=0xf0e6d4;
  const body=T.box(1.2,1.3,2.6,fawn); body.position.y=2.5; g.add(body);
  const band=T.box(1.28,0.4,2.4,0x2a221c); band.position.set(0,2.1,0); g.add(band);
  const belly=T.box(1.15,0.4,2.3,pale); belly.position.set(0,1.85,0); g.add(belly);
  const neck=T.box(0.7,1.5,0.7,fawn); neck.position.set(0,3.4,1.2); neck.rotation.x=-0.55; g.add(neck);
  const head=T.box(0.66,0.72,1.3,fawn); head.position.set(0,4.1,1.9); g.add(head);
  const muz=T.box(0.6,0.5,0.4,pale); muz.position.set(0,3.95,2.5); g.add(muz);
  for(const s of [1,-1]){ const horn=T.box(0.18,1.2,0.18,0x2e2620);
    horn.position.set(s*0.24,4.9,1.8); horn.rotation.z=s*0.22; horn.rotation.x=0.3; g.add(horn);
    const ear=T.box(0.5,0.3,0.28,fawn); ear.position.set(s*0.55,4.4,1.7); g.add(ear);
    const eye=T.box(0.16,0.16,0.14,0x0e0a08); eye.position.set(s*0.34,4.2,2.3); g.add(eye); }
  const tail=T.box(0.22,0.7,0.22,0x2a221c); tail.position.set(0,2.6,-1.4); g.add(tail);
  T.legs4(g,0.45,0.95,2.0,fawn,0.36);
  return g;
}});
