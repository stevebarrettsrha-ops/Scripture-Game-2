/* THE WILD ASS — the onager of Persia, the kulan of the Gobi. "Who has sent
   out the wild ass free? whose house I have made the wilderness, and the
   barren land his dwellings." Sand-coloured, with a dark stripe down the
   spine and a stiff upright mane, and no man has ever broken one. */
EARTH.beast({
name:'wildass',
realm:'land',
metres:2.1,
build:function(T){
  const g=T.group(); const coat=0xc9a86a, pale=0xf0e6d2, dark=0x4a3a28;
  const body=T.box(1.6,2.0,4.2,coat); body.position.y=3.6; g.add(body);
  const belly=T.box(1.5,0.6,3.8,pale); belly.position.set(0,2.9,0); g.add(belly);
  const stripe=T.box(0.3,0.3,4.0,dark); stripe.position.set(0,4.55,0); g.add(stripe);
  const neck=T.box(1.0,2.0,1.0,coat); neck.position.set(0,4.8,1.9); neck.rotation.x=-0.5; g.add(neck);
  const mane=T.box(0.34,0.9,1.9,dark); mane.position.set(0,5.5,1.75); mane.rotation.x=-0.5; g.add(mane);
  const head=T.box(0.95,1.2,2.0,coat); head.position.set(0,5.7,2.9); g.add(head);
  const muz=T.box(0.85,0.6,0.5,pale); muz.position.set(0,5.3,3.85); g.add(muz);
  for(const s of [1,-1]){ const ear=T.box(0.3,1.2,0.3,coat); ear.position.set(s*0.36,6.7,2.5); g.add(ear);
    const tip=T.box(0.32,0.3,0.32,dark); tip.position.set(s*0.36,7.25,2.5); g.add(tip);
    const eye=T.box(0.2,0.2,0.16,0x0e0a08); eye.position.set(s*0.5,5.9,3.6); g.add(eye); }
  const tail=T.box(0.28,1.5,0.28,coat); tail.geometry.translate(0,-0.75,0);
  tail.position.set(0,3.9,-2.3); g.add(tail);
  const tuft=T.box(0.34,0.8,0.34,dark); tuft.position.set(0,2.6,-2.3); g.add(tuft);
  T.legs4(g,0.72,1.5,3.0,coat,0.6);
  return g;
}});
