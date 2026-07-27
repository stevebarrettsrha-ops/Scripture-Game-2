/* THE PIRANHA — a hand's breadth of fish with a jaw out of all proportion to
   it, and it does not go anywhere alone. */
EARTH.beast({
name:'piranha',
realm:'sea',
metres:0.3,
build:function(T){
  const g=T.group();
  const sideT=T.tex(function(gg){ T.speckle(gg,[140,148,156],16,[112,120,130],0.35);
    gg.fillStyle='rgb(190,90,50)'; gg.fillRect(0,10,16,6); });
  const side=T.mat(sideT), bel=T.mat(T.tex(function(gg){ T.speckle(gg,[198,110,64],14); }));
  const body=T.faces(0.7,2.2,2.4,[side,side,side,bel,side,side]); g.add(body);
  const head=T.faces(0.65,1.7,1.0,[side,side,side,bel,side,side]); head.position.set(0,-0.2,1.6); g.add(head);
  const jaw=T.box(0.6,0.6,0.7,0x8a5a3a); jaw.position.set(0,-0.9,1.9); g.add(jaw);
  const teeth=T.box(0.5,0.2,0.5,0xf2efe4); teeth.position.set(0,-0.6,2.05); g.add(teeth);
  for(const s of [1,-1]){ const eye=T.box(0.22,0.22,0.18,0x14100c); eye.position.set(s*0.36,0.35,1.9); g.add(eye); }
  const dors=T.box(0.14,0.5,0.8,0x6a727a); dors.position.set(0,1.3,-0.1); g.add(dors);
  const tail=T.group(); tail.position.z=-1.3;
  const fl=T.box(0.14,1.5,0.7,0x8a5a3a); fl.position.z=-0.35; tail.add(fl); g.add(tail);
  g.userData={tail};
  return g;
}});
