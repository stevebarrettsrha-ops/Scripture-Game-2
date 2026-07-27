/* THE SLEEPER SHARK of Greenland — it swims slower than a man walks, lives
   in the black cold under the ice for four hundred years, and is blind in
   both eyes from a worm that hangs off them. */
EARTH.beast({
name:'greenlandshark',
realm:'sea',
metres:5.0,
build:function(T){
  const g=T.group();
  const hideT=T.tex(function(gg){ T.speckle(gg,[86,90,96],18,[68,72,80],0.4); });
  const hide=T.mat(hideT), pale=T.mat(T.tex(function(gg){ T.speckle(gg,[136,138,140],12); }));
  const body=T.faces(3.0,3.2,10.0,[hide,hide,hide,pale,hide,hide]); g.add(body);
  const head=T.faces(2.6,2.6,3.0,[hide,hide,hide,pale,hide,hide]); head.position.z=6.0; g.add(head);
  const snout=T.box(1.8,1.4,1.4,0x6a6e74); snout.position.set(0,0.4,7.8); g.add(snout);
  const mouth=T.box(2.0,0.5,1.0,0x2a2c30); mouth.position.set(0,-0.8,7.6); g.add(mouth);
  for(const s of [1,-1]){ const eye=T.box(0.4,0.4,0.34,0xb8c0b0); eye.position.set(s*1.2,0.5,7.0); g.add(eye);
    /* the worm that hangs off the eye and blinds it */
    const worm=T.box(0.16,0.16,0.9,0xd8d0b0); worm.position.set(s*1.2,0.4,7.7); g.add(worm);
    const pec=T.box(2.6,0.4,1.8,0x6a6e74); pec.position.set(s*1.9,-1.0,2.6); pec.rotation.z=s*0.24; g.add(pec); }
  /* the dorsals are small and set far back — it is all body */
  const d1=T.box(0.4,1.0,1.4,0x6a6e74); d1.position.set(0,1.9,-1.0); g.add(d1);
  const d2=T.box(0.34,0.7,1.0,0x6a6e74); d2.position.set(0,1.8,-3.6); g.add(d2);
  const tail=T.group(); tail.position.z=-5.4;
  const up=T.box(0.4,3.2,2.2,0x6a6e74); up.position.set(0,1.2,-1.2); tail.add(up);
  const lo=T.box(0.4,1.4,1.4,0x6a6e74); lo.position.set(0,-0.8,-0.8); tail.add(lo); g.add(tail);
  g.userData={tail};
  return g;
}});
