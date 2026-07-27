/* THE STURGEON — armoured in rows of bony scutes, with a snout like a
   ploughshare and barbels under it. It has been the same fish since before
   there were flowers on the earth. */
EARTH.beast({
name:'sturgeon',
realm:'sea',
metres:2.2,
build:function(T){
  const g=T.group();
  const sideT=T.tex(function(gg){ T.speckle(gg,[96,104,92],16,[76,84,74],0.35); });
  const side=T.mat(sideT), bel=T.mat(T.tex(function(gg){ T.speckle(gg,[206,204,186],10); }));
  const body=T.faces(1.2,1.5,6.4,[side,side,side,bel,side,side]); g.add(body);
  /* the rows of scutes down the back and the flanks */
  for(let i=0;i<8;i++){ const sc=T.box(0.3,0.3,0.3,0xc8c4a8); sc.position.set(0,0.85,-2.6+i*0.75); g.add(sc);
    for(const s of [1,-1]){ const sc2=T.box(0.26,0.26,0.26,0xc8c4a8); sc2.position.set(s*0.66,0.1,-2.4+i*0.72); g.add(sc2); } }
  const head=T.faces(1.0,1.1,1.6,[side,side,side,bel,side,side]); head.position.z=4.0; g.add(head);
  const snout=T.box(0.5,0.4,1.8,0x8a8e7c); snout.position.set(0,0.1,5.6); g.add(snout);
  for(const s of [1,-1]){ const eye=T.box(0.2,0.2,0.18,0x0e0c0a); eye.position.set(s*0.5,0.3,4.4); g.add(eye);
    const wh=T.box(0.08,0.5,0.08,0x8a8e7c); wh.position.set(s*0.2,-0.4,5.4); g.add(wh); }
  const tail=T.group(); tail.position.z=-3.3;
  const up=T.box(0.16,1.0,2.0,0x6a7060); up.position.set(0,0.9,-0.9); tail.add(up);
  const lo=T.box(0.16,1.0,0.9,0x6a7060); lo.position.set(0,-0.4,-0.5); tail.add(lo); g.add(tail);
  g.userData={tail};
  return g;
}});
