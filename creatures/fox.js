/* THE RED FOX — the widest-ranging wild dog on the earth, met from the
   desert to the tundra. White at the throat, black at the stocking, and the
   brush is half of him. */
EARTH.beast({
name:'fox',
realm:'land',
metres:1.1,
build:function(T){
  const g=T.group(); const rust=0xc05e28, w=0xf2ece2, k=0x241c18;
  const body=T.box(0.9,0.9,2.0,rust); body.position.y=1.5; g.add(body);
  const belly=T.box(0.8,0.34,1.8,w); belly.position.set(0,1.15,0); g.add(belly);
  const head=T.box(0.8,0.75,0.8,rust); head.position.set(0,1.85,1.3); g.add(head);
  const snout=T.box(0.36,0.34,0.7,rust); snout.position.set(0,1.7,1.95); g.add(snout);
  const chin=T.box(0.34,0.2,0.6,w); chin.position.set(0,1.52,1.9); g.add(chin);
  const nose=T.box(0.18,0.16,0.14,k); nose.position.set(0,1.74,2.32); g.add(nose);
  for(const s of [1,-1]){ const ear=T.box(0.3,0.6,0.2,rust); ear.position.set(s*0.32,2.4,1.2); g.add(ear);
    const eart=T.box(0.32,0.22,0.22,k); eart.position.set(s*0.32,2.66,1.2); g.add(eart);
    const eye=T.box(0.15,0.14,0.12,0x2a1e0a); eye.position.set(s*0.26,2.0,1.68); g.add(eye); }
  const tail=T.box(0.5,0.5,1.6,rust); tail.position.set(0,1.6,-1.7); tail.rotation.x=0.3; g.add(tail);
  const tip=T.box(0.52,0.52,0.4,w); tip.position.set(0,1.35,-2.6); g.add(tip);
  T.legs4(g,0.32,0.7,1.2,k,0.28);
  return g;
}});
