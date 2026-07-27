/* THE TROUT — of the cold running water, speckled red and black over an
   olive back, and it holds station in the current facing upstream. */
EARTH.beast({
name:'trout',
realm:'sea',
metres:0.45,
build:function(T){
  const g=T.group();
  const sideT=T.tex(function(gg){ T.speckle(gg,[112,124,78],18,[88,100,62],0.35);
    for(let k=0;k<9;k++) T.px(gg,Math.floor(T.hash(k,3.1)*16),Math.floor(T.hash(k,5.7)*10)+3,'rgb(190,60,50)');
    for(let k=0;k<7;k++) T.px(gg,Math.floor(T.hash(k,8.3)*16),Math.floor(T.hash(k,2.9)*8)+2,'rgb(30,32,26)'); });
  const side=T.mat(sideT), bel=T.mat(T.tex(function(gg){ T.speckle(gg,[224,220,206],10); }));
  const body=T.faces(0.9,1.7,3.6,[side,side,side,bel,side,side]); g.add(body);
  const head=T.faces(0.8,1.4,1.2,[side,side,side,bel,side,side]); head.position.z=2.3; g.add(head);
  for(const s of [1,-1]){ const eye=T.box(0.26,0.26,0.22,0x0c0a08); eye.position.set(s*0.42,0.3,2.6); g.add(eye); }
  const dors=T.box(0.16,0.7,0.9,0x6a7248); dors.position.set(0,1.1,0.3); g.add(dors);
  const adip=T.box(0.14,0.35,0.4,0x6a7248); adip.position.set(0,1.0,-1.3); g.add(adip);
  const tail=T.group(); tail.position.z=-1.9;
  const fl=T.box(0.16,1.6,0.9,0x6a7248); fl.position.z=-0.45; tail.add(fl); g.add(tail);
  g.userData={tail};
  return g;
}});
