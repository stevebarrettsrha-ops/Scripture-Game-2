/* THE CATFISH — flat-headed, whiskered, lying on the bottom of the muddy
   river where there is nothing to see and it does not need to. */
EARTH.beast({
name:'catfish',
realm:'sea',
metres:1.2,
build:function(T){
  const g=T.group();
  const sideT=T.tex(function(gg){ T.speckle(gg,[92,84,62],20,[70,64,48],0.4); });
  const side=T.mat(sideT), bel=T.mat(T.tex(function(gg){ T.speckle(gg,[198,190,166],12); }));
  const body=T.faces(1.4,1.4,4.2,[side,side,side,bel,side,side]); g.add(body);
  const head=T.faces(1.8,1.0,1.8,[side,side,side,bel,side,side]); head.position.set(0,-0.2,2.8); g.add(head);
  for(const s of [1,-1]){ const eye=T.box(0.24,0.22,0.2,0x0c0a08); eye.position.set(s*0.6,0.34,3.2); g.add(eye);
    /* the barbels */
    const wh=T.box(0.1,0.1,2.2,0x6a6250); wh.position.set(s*0.7,-0.3,4.4); wh.rotation.y=-s*0.25; g.add(wh);
    const wh2=T.box(0.08,0.08,1.2,0x6a6250); wh2.position.set(s*0.4,-0.6,4.0); g.add(wh2);
    const pec=T.box(1.4,0.16,0.9,0x6a6250); pec.position.set(s*1.0,-0.6,1.9); pec.rotation.z=s*0.2; g.add(pec); }
  const dors=T.box(0.16,0.9,0.7,0x6a6250); dors.position.set(0,1.0,1.0); g.add(dors);
  const tail=T.group(); tail.position.z=-2.2;
  const fl=T.box(0.16,1.8,1.0,0x6a6250); fl.position.z=-0.5; tail.add(fl); g.add(tail);
  g.userData={tail};
  return g;
}});
