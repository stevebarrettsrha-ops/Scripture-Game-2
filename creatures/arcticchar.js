/* THE ARCTIC CHAR — the northernmost freshwater fish there is, olive above
   and burning orange beneath when it comes up the rivers to spawn. */
EARTH.beast({
name:'arcticchar',
realm:'sea',
metres:0.6,
build:function(T){
  const g=T.group();
  const sideT=T.tex(function(gg){ T.speckle(gg,[84,104,96],18,[66,84,78],0.35);
    for(let k=0;k<10;k++) T.px(gg,Math.floor(T.hash(k,2.9)*16),Math.floor(T.hash(k,6.1)*10)+3,'rgb(240,200,150)'); });
  const side=T.mat(sideT), bel=T.mat(T.tex(function(gg){ T.speckle(gg,[214,110,50],16); }));
  const body=T.faces(0.9,1.8,4.0,[side,side,side,bel,side,side]); g.add(body);
  const head=T.faces(0.8,1.5,1.3,[side,side,side,bel,side,side]); head.position.z=2.5; g.add(head);
  for(const s of [1,-1]){ const eye=T.box(0.26,0.26,0.22,0x0c0a08); eye.position.set(s*0.42,0.34,2.8); g.add(eye);
    const pec=T.box(0.7,0.14,0.6,0xd8703a); pec.position.set(s*0.5,-0.6,1.6); g.add(pec); }
  const dors=T.box(0.16,0.7,0.9,0x5a7068); dors.position.set(0,1.2,0.4); g.add(dors);
  const adip=T.box(0.14,0.32,0.4,0x5a7068); adip.position.set(0,1.1,-1.4); g.add(adip);
  const anal=T.box(0.14,0.5,0.7,0xd8703a); anal.position.set(0,-1.1,-1.2); g.add(anal);
  const tail=T.group(); tail.position.z=-2.1;
  const fl=T.box(0.16,1.7,1.0,0x5a7068); fl.position.z=-0.5; tail.add(fl); g.add(tail);
  g.userData={tail};
  return g;
}});
