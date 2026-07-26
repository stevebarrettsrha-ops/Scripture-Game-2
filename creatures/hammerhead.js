/* THE HAMMERHEAD — known at a glance by the great crossbar of a head, with an
   eye out at either end of it.
   `tail` is handed back so the engine can drive it.
   See creatures/README.md. Change `metres` to change its size. */
EARTH.beast({
name:'hammerhead',
realm:'sea',
metres:4.6,
build:function(T){
  const g=T.group();
  const topTex=T.tex(function(gg){ T.speckle(gg,[86,102,96],12,[72,88,82],0.3); });
  const belTex=T.tex(function(gg){ T.speckle(gg,[228,232,230],7,[214,220,218],0.3); });
  const sideTex=T.tex(function(gg){
    T.speckle(gg,[92,108,100],12,[78,94,88],0.3);
    for(let x=0;x<16;x++){ const cut=10+Math.round(T.hash(x*2.1,3.3)*2);
      for(let y=cut;y<16;y++){ const c=T.jit([228,232,230],7,x*4+y); T.px(gg,x,y,T.rgb(c[0],c[1],c[2])); } } });
  const top=T.mat(topTex), belly=T.mat(belTex), side=T.mat(sideTex);
  const FIN=0x54655e;

  const body=T.faces(3.0,3.4,9.5,[side,side,top,belly,top,top]); g.add(body);
  /* THE HAMMER — a wide flat crossbar, the eyes at its two ends */
  const hammer=T.faces(8.2,1.5,2.6,[side,side,top,belly,top,top]);
  hammer.position.set(0,-0.3,6.2); g.add(hammer);
  const mouth=T.box(2.2,0.5,1.6,0x1d2622); mouth.position.set(0,-1.1,6.0); g.add(mouth);
  for(const s of [1,-1]){ const eye=T.box(0.7,0.7,0.7,0x0a0f14);
    eye.position.set(s*3.9,-0.3,6.3); g.add(eye); }
  const dorsal=T.box(0.5,4.2,2.2,FIN);
  dorsal.position.set(0,3.2,1.4); dorsal.rotation.x=-0.3; g.add(dorsal);
  for(const s of [1,-1]){ const pec=T.box(3.4,0.4,1.6,FIN);
    pec.position.set(s*2.8,-1.6,3.0); pec.rotation.z=s*0.5; pec.rotation.y=s*0.2; g.add(pec); }
  for(const s of [1,-1]){ const pv=T.box(1.2,0.3,0.9,FIN);
    pv.position.set(s*1.2,-1.8,-2.4); pv.rotation.z=s*0.4; g.add(pv); }
  const tail=T.group(); tail.position.set(0,0,-4.8);
  const ped=T.faces(1.4,1.9,2.6,[side,side,top,belly,top,top]);
  ped.position.set(0,0,-1.2); tail.add(ped);
  const lobeU=T.box(0.45,4.0,1.6,FIN); lobeU.position.set(0,2.4,-2.8); lobeU.rotation.x=0.48; tail.add(lobeU);
  const lobeD=T.box(0.45,1.8,1.2,FIN); lobeD.position.set(0,-1.3,-2.4); lobeD.rotation.x=-0.44; tail.add(lobeD);
  g.add(tail);
  g.userData={tail}; return g;
}});
