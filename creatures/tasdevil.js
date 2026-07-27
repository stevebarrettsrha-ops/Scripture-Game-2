/* THE TASMANIAN DEVIL — black, with a white bar at the chest, a head far too
   big for it, and the strongest bite for its size of any beast alive. */
EARTH.beast({
name:'tasdevil',
realm:'land',
metres:0.7,
build:function(T){
  const g=T.group(); const k=0x1c1a18, w=0xf0eee8, pink=0xc07a72;
  const body=T.box(1.0,0.9,1.7,k); body.position.y=0.95; g.add(body);
  const bar=T.box(1.04,0.32,0.5,w); bar.position.set(0,1.05,0.7); g.add(bar);
  const head=T.box(1.0,0.9,1.0,k); head.position.set(0,1.15,1.35); g.add(head);
  const muz=T.box(0.5,0.4,0.35,k); muz.position.set(0,0.95,1.95); g.add(muz);
  const jaw=T.box(0.7,0.3,0.7,pink); jaw.geometry.translate(0,0,0.35);
  jaw.position.set(0,0.82,1.4); g.add(jaw);
  for(const s of [1,-1]){ const ear=T.box(0.34,0.36,0.2,pink); ear.position.set(s*0.42,1.72,1.3); g.add(ear);
    const eye=T.box(0.13,0.12,0.1,0x080606); eye.position.set(s*0.28,1.3,1.82); g.add(eye); }
  const tail=T.box(0.42,0.42,1.0,k); tail.position.set(0,0.9,-1.2); g.add(tail);
  T.legs4(g,0.36,0.62,0.6,k,0.3);
  g.userData.jaw=jaw;
  g.userData.head=head;
  return g;
}});
