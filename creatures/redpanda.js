/* THE RED PANDA — russet, white-faced, with a great banded brush of a tail.
   It keeps the high forest and is out at dusk. */
EARTH.beast({
name:'redpanda',
realm:'land',
metres:0.62,
build:function(T){
  const g=T.group(); const rust=0xb4562a, w=0xf2ece0, k=0x2a1e18;
  const body=T.box(0.9,0.85,1.7,rust); body.position.y=1.1; g.add(body);
  const belly=T.box(0.8,0.4,1.5,k); belly.position.set(0,0.75,0); g.add(belly);
  const head=T.box(0.9,0.78,0.8,w); head.position.set(0,1.6,1.1); g.add(head);
  const crown=T.box(0.92,0.3,0.8,rust); crown.position.set(0,2.0,1.05); g.add(crown);
  const muz=T.box(0.4,0.34,0.35,w); muz.position.set(0,1.42,1.62); g.add(muz);
  const nose=T.box(0.18,0.16,0.14,0x110d0a); nose.position.set(0,1.48,1.84); g.add(nose);
  for(const s of [1,-1]){ const ear=T.box(0.32,0.34,0.2,w); ear.position.set(s*0.4,2.1,1.0); g.add(ear);
    const tear=T.box(0.2,0.4,0.2,rust); tear.position.set(s*0.28,1.5,1.5); g.add(tear);
    const eye=T.box(0.16,0.14,0.12,0x0e0a08); eye.position.set(s*0.26,1.72,1.52); g.add(eye); }
  const tail=T.group(); tail.position.set(0,1.2,-0.9);
  for(let i=0;i<5;i++){ const seg=T.box(0.44,0.44,0.4,(i%2)?rust:0x6b3a1e);
    seg.position.set(0,0.1*i,-0.4*i); tail.add(seg); }
  g.add(tail);
  T.legs4(g,0.3,0.6,0.75,k,0.28);
  return g;
}});
