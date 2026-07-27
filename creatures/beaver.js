/* THE BEAVER — the only beast besides man that builds itself a country: it
   fells the trees, dams the stream and floods the valley, and everything
   after that lives in what it made. The tail is a flat paddle. */
EARTH.beast({
name:'beaver',
realm:'land',
metres:1.1,
build:function(T){
  const g=T.group(); const coat=0x5a3a24, dark=0x3a2418;
  const body=T.box(1.3,1.2,2.2,coat); body.position.y=1.1; g.add(body);
  const head=T.box(0.95,0.85,1.0,coat); head.position.set(0,1.35,1.5); g.add(head);
  const muz=T.box(0.6,0.5,0.35,0x7a5a3c); muz.position.set(0,1.15,2.1); g.add(muz);
  const teeth=T.box(0.3,0.28,0.16,0xe8c84a); teeth.position.set(0,1.0,2.28); g.add(teeth);
  for(const s of [1,-1]){ const ear=T.box(0.22,0.2,0.14,dark); ear.position.set(s*0.4,1.85,1.35); g.add(ear);
    const eye=T.box(0.13,0.12,0.1,0x0c0a08); eye.position.set(s*0.3,1.5,1.96); g.add(eye); }
  /* the paddle */
  const tail=T.box(1.1,0.22,1.8,0x2e2018); tail.position.set(0,0.5,-2.0); g.add(tail);
  T.legs4(g,0.45,0.7,0.6,dark,0.36);
  g.userData.head=head;
  return g;
}});
