/* THE DOLPHIN — beaked, bright-bellied, and never still.
   She rides the ship's bow wave when the wind is up.
   See creatures/README.md. Change `metres` to change her size. */
EARTH.beast({
name:'dolphin',
realm:'sea',
metres:3.2,                  /* a full-grown bottlenose */
build:function(T){
  const g=T.group(); g.rotation.order='YXZ';
  const topTex=T.tex(function(gg){ T.speckle(gg,[116,138,156],10,[102,124,142],0.3); });
  const belTex=T.tex(function(gg){ T.speckle(gg,[232,238,244],6,[218,226,234],0.3); });
  const sideTex=T.tex(function(gg){
    T.speckle(gg,[134,152,168],10,[120,138,156],0.3);
    for(let y=12;y<16;y++) for(let x=0;x<16;x++){
      const c=T.jit([228,234,240],8,x+y*16); T.px(gg,x,y,T.rgb(c[0],c[1],c[2])); } });
  const top=T.mat(topTex), belly=T.mat(belTex), side=T.mat(sideTex);
  const FIN=0x7e94a8;

  const body=T.faces(2.2,2.4,7,[side,side,top,belly,top,top]); g.add(body);
  const head=T.faces(1.9,2.0,1.8,[side,side,top,belly,top,top]);
  head.position.set(0,-0.1,4.2); g.add(head);
  const beak=T.box(1.0,0.8,1.7,0xb9c4cf); beak.position.set(0,-0.5,5.6); g.add(beak);
  for(const s of [1,-1]){ const eye=T.box(0.35,0.35,0.35,0x10161e);
    eye.position.set(s*1.0,0.35,4.6); g.add(eye); }
  const dorsal=T.box(0.4,1.9,1.6,FIN);
  dorsal.position.set(0,1.9,0.4); dorsal.rotation.x=-0.35; g.add(dorsal);
  for(const s of [1,-1]){ const flip=T.box(1.8,0.3,1.0,FIN);
    flip.position.set(s*1.5,-1.1,2.6); flip.rotation.z=s*0.5; g.add(flip); }
  const fluke=T.box(3.4,0.4,1.5,FIN); fluke.position.set(0,0.1,-4.1); g.add(fluke);
  return g;
}});
