/* THE WOLVERINE — the glutton. A weasel the size of a dog, with a pale band
   down each flank, and it will drive a bear off a carcase. */
EARTH.beast({
name:'wolverine',
realm:'land',
metres:1.0,
build:function(T){
  const g=T.group(); const dark=0x33251c, band=0xa8834e, pale=0xd8c4a0;
  const body=T.box(1.3,1.2,2.4,dark); body.position.y=1.5; g.add(body);
  for(const s of [1,-1]){ const b=T.box(0.2,0.5,2.2,band); b.position.set(s*0.6,1.7,-0.1); g.add(b); }
  const hump=T.box(1.3,0.6,1.2,dark); hump.position.set(0,2.2,0.6); g.add(hump);
  const head=T.box(1.0,0.9,1.0,dark); head.position.set(0,1.9,1.6); g.add(head);
  const face=T.box(0.7,0.5,0.5,pale); face.position.set(0,1.75,2.06); g.add(face);
  const nose=T.box(0.22,0.18,0.16,0x100c0a); nose.position.set(0,1.8,2.34); g.add(nose);
  for(const s of [1,-1]){ const ear=T.box(0.26,0.22,0.16,dark); ear.position.set(s*0.34,2.42,1.5); g.add(ear);
    const eye=T.box(0.15,0.14,0.12,0x0a0806); eye.position.set(s*0.28,2.05,2.02); g.add(eye); }
  const tail=T.box(0.55,0.55,1.1,dark); tail.position.set(0,1.7,-1.6); tail.rotation.x=0.35; g.add(tail);
  T.legs4(g,0.44,0.8,1.1,0x241a14,0.42);
  return g;
}});
