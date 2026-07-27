/* THE BLACKBUCK — of the dry plains of India: the buck near black above and
   white beneath, with two horns wound in a long open spiral, and the fastest
   thing on that whole subcontinent. */
EARTH.beast({
name:'blackbuck',
realm:'land',
metres:1.2,
build:function(T){
  const g=T.group(); const dark=0x3a2c22, w=0xf2ece0;
  const body=T.box(1.1,1.3,2.4,dark); body.position.y=2.5; g.add(body);
  const belly=T.box(1.05,0.5,2.2,w); belly.position.set(0,1.95,0); g.add(belly);
  const neck=T.box(0.7,1.4,0.7,dark); neck.position.set(0,3.4,1.1); neck.rotation.x=-0.5; g.add(neck);
  const head=T.box(0.66,0.72,1.3,dark); head.position.set(0,4.05,1.85); g.add(head);
  const chin=T.box(0.6,0.4,0.9,w); chin.position.set(0,3.8,2.05); g.add(chin);
  const muz=T.box(0.55,0.4,0.35,0x201810); muz.position.set(0,3.9,2.5); g.add(muz);
  /* the horns, wound open and standing well apart */
  for(const s of [1,-1]) for(let i=0;i<5;i++){
    const a=i*0.8*s;
    const seg=T.box(0.16,0.4,0.16,0x241c16);
    seg.position.set(s*(0.22+i*0.09)+Math.sin(a)*0.12, 4.5+i*0.38, 1.6+Math.cos(a)*0.1-i*0.06);
    seg.rotation.z=s*0.14; g.add(seg); }
  for(const s of [1,-1]){ const ring=T.box(0.34,0.3,0.3,w); ring.position.set(s*0.3,4.2,2.2); g.add(ring);
    const ear=T.box(0.44,0.26,0.24,dark); ear.position.set(s*0.5,4.3,1.6); g.add(ear);
    const eye=T.box(0.16,0.16,0.13,0x0c0a08); eye.position.set(s*0.35,4.2,2.34); g.add(eye); }
  const tail=T.box(0.2,0.6,0.2,w); tail.position.set(0,2.7,-1.35); g.add(tail);
  T.legs4(g,0.44,0.95,2.0,dark,0.34);
  g.userData.head=head;
  return g;
}});
