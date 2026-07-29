/* THE BAT — it hangs from the roof of the cave by day in its thousands, and
   at dusk the whole roof lifts off and pours out of the mouth in a river. */
EARTH.beast({
name:'bat',
realm:'land',
metres:0.22,
build:function(T){
  const g=T.group(); const fur=0x3b2a22, skin=0x5a3a34;
  const body=T.box(0.5,0.8,0.4,fur); body.position.y=0.6; g.add(body);
  const head=T.box(0.44,0.4,0.4,fur); head.position.set(0,1.15,0.06); g.add(head);
  for(const s of [1,-1]){ const ear=T.box(0.16,0.42,0.1,skin); ear.position.set(s*0.16,1.5,0); g.add(ear);
    const eye=T.box(0.08,0.08,0.06,0x120c0a); eye.position.set(s*0.12,1.18,0.22); g.add(eye); }
  const nose=T.box(0.16,0.1,0.1,skin); nose.position.set(0,1.02,0.24); g.add(nose);
  /* the wings — a bat's wing is a HAND, and it folds against the body at rest */
  const wings=[];
  for(const s of [1,-1]){ const w=T.box(1.5,0.7,0.08,skin);
    w.geometry.translate(s*0.75,0,0); w.position.set(s*0.24,0.85,0); g.add(w); wings.push(w); }
  const feet=T.box(0.3,0.16,0.2,skin); feet.position.set(0,0.12,0); g.add(feet);
  g.userData={head,wings};
  return g;
}});
