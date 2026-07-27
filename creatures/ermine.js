/* THE ERMINE — the stoat in its winter coat: white from nose to rump with
   the black tip of the tail left on it, and small enough to go down a
   lemming's own hole after it. */
EARTH.beast({
name:'ermine',
realm:'land',
metres:0.28,
build:function(T){
  const g=T.group(); const w=0xf6f4ee, k=0x18150f;
  const body=T.box(0.7,0.6,2.0,w); body.position.y=0.75; g.add(body);
  const head=T.box(0.6,0.5,0.7,w); head.position.set(0,0.95,1.25); g.add(head);
  const nose=T.box(0.16,0.14,0.12,0x241a16); nose.position.set(0,0.86,1.64); g.add(nose);
  for(const s of [1,-1]){ const ear=T.box(0.2,0.16,0.12,w); ear.position.set(s*0.24,1.24,1.1); g.add(ear);
    const eye=T.box(0.12,0.11,0.1,0x0a0806); eye.position.set(s*0.22,1.02,1.5); g.add(eye); }
  const tail=T.box(0.28,0.28,0.9,w); tail.position.set(0,0.8,-1.4); tail.rotation.x=0.3; g.add(tail);
  const tip=T.box(0.3,0.3,0.35,k); tip.position.set(0,0.62,-1.95); g.add(tip);
  T.legs4(g,0.24,0.6,0.42,w,0.2);
  return g;
}});
