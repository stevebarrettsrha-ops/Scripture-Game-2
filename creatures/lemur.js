/* THE RING-TAILED LEMUR — of Madagascar and of nowhere else in the world.
   Grey, black-masked, and the tail is banded and carried straight up. */
EARTH.beast({
name:'lemur',
realm:'land',
metres:0.9,
build:function(T){
  const g=T.group(); const coat=0x9aa0a4, pale=0xe8e6e0;
  const body=T.box(0.8,0.9,1.7,coat); body.position.y=1.4; g.add(body);
  const belly=T.box(0.7,0.4,1.5,pale); belly.position.set(0,1.05,0); g.add(belly);
  const head=T.box(0.7,0.65,0.7,pale); head.position.set(0,2.0,1.1); g.add(head);
  const muz=T.box(0.35,0.3,0.4,0x2a2622); muz.position.set(0,1.85,1.6); g.add(muz);
  for(const s of [1,-1]){ const mask=T.box(0.26,0.3,0.24,0x2a2622); mask.position.set(s*0.22,2.05,1.42); g.add(mask);
    const eye=T.box(0.16,0.16,0.12,0xd8a22a); eye.position.set(s*0.22,2.06,1.5); g.add(eye);
    const ear=T.box(0.22,0.3,0.16,pale); ear.position.set(s*0.34,2.35,1.05); g.add(ear); }
  /* the banded tail, straight up as a standard */
  const tail=T.group(); tail.position.set(0,1.7,-0.9);
  for(let i=0;i<7;i++){ const seg=T.box(0.3,0.42,0.3,(i%2)?0x1c1a18:pale);
    seg.position.set(0,0.3+i*0.42,-0.1*i); tail.add(seg); }
  g.add(tail);
  T.legs4(g,0.28,0.6,1.0,coat,0.24);
  g.userData.head=head;
  return g;
}});
