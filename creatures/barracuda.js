/* THE BARRACUDA — a long silver bar of teeth that hangs perfectly still in
   the water and then is somewhere else. */
EARTH.beast({
name:'barracuda',
realm:'sea',
metres:1.4,
build:function(T){
  const g=T.group();
  const sideT=T.tex(function(gg){ T.speckle(gg,[178,186,196],14,[150,160,172],0.35);
    gg.fillStyle='rgb(70,78,88)'; for(const y of [3,7,11]) gg.fillRect(0,y,16,1); });
  const side=T.mat(sideT), bel=T.mat(T.tex(function(gg){ T.speckle(gg,[224,228,232],8); }));
  const body=T.faces(1.0,1.6,6.0,[side,side,side,bel,side,side]); g.add(body);
  const head=T.faces(0.9,1.3,2.2,[side,side,side,bel,side,side]); head.position.z=4.0; g.add(head);
  const jaw=T.box(0.7,0.5,1.4,0x8a939c); jaw.position.set(0,-0.5,5.3); g.add(jaw);
  const teeth=T.box(0.5,0.16,1.2,0xf0eee6); teeth.position.set(0,-0.15,5.4); g.add(teeth);
  for(const s of [1,-1]){ const eye=T.box(0.34,0.34,0.3,0x0c0e12); eye.position.set(s*0.48,0.3,4.6); g.add(eye); }
  const d1=T.box(0.2,0.9,1.0,0x6a747e); d1.position.set(0,1.2,1.0); g.add(d1);
  const d2=T.box(0.2,0.8,0.9,0x6a747e); d2.position.set(0,1.15,-2.0); g.add(d2);
  const tail=T.group(); tail.position.z=-3.2;
  const fl=T.box(0.2,2.2,1.2,0x6a747e); fl.position.z=-0.6; tail.add(fl); g.add(tail);
  g.userData={tail};
  return g;
}});
