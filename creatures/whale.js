/* THE GREAT WHALE — the largest thing that has ever lived, and the pods of
   them cross the deep on their own roads. Throat grooves down the belly, the
   long knuckled flippers, and the blow-hole that breaks the surface first.
   See creatures/README.md. Change `metres` to change her size.
   (16 m is a humpback. For a blue whale set metres to 26 — nothing else in
   the file need change; the engine scales her to whatever you ask.) */
EARTH.beast({
name:'whale',
realm:'sea',
metres:16,
build:function(T){
  const g=T.group(); g.rotation.order='YXZ';
  const topTex=T.tex(function(gg){
    T.speckle(gg,[54,74,94],10,[46,64,84],0.3);
    for(let k=0;k<6;k++){ const x=Math.floor(T.hash(k,3.3)*16), y=Math.floor(T.hash(k,7.7)*16);
      T.px(gg,x,y,'rgb(78,98,118)'); } });
  const belTex=T.tex(function(gg){
    T.speckle(gg,[198,208,218],8,[184,196,208],0.3);
    gg.fillStyle='rgb(158,170,184)';
    [2,6,10,14].forEach(function(y){ gg.fillRect(0,y,16,1); }); });   /* throat grooves */
  const sideTex=T.tex(function(gg){
    T.speckle(gg,[62,84,104],10,[52,74,94],0.3);
    for(let y=12;y<16;y++) for(let x=0;x<16;x++){
      const c=T.jit([194,204,216],8,x*3+y); T.px(gg,x,y,T.rgb(c[0],c[1],c[2])); } });
  const top=T.mat(topTex), belly=T.mat(belTex), side=T.mat(sideTex);
  const FIN=0x2e455c;

  const body=T.faces(9,9.5,26,[side,side,top,belly,top,top]); g.add(body);
  const head=T.faces(8,7.6,9,[side,side,top,belly,top,top]);
  head.position.set(0,-0.7,16.5); g.add(head);
  for(const s of [1,-1]){ const eye=T.box(0.7,0.7,0.7,0x0a0f14);
    eye.position.set(s*4.1,-1.6,13.8); g.add(eye); }
  const blow=T.box(1.3,0.4,1.3,0x1c2c3c); blow.position.set(0,4.9,10); g.add(blow);
  /* the knuckles along the humpback's rostrum */
  for(let i=0;i<4;i++){ const k=T.box(0.9,0.5,0.9,0x44607c);
    k.position.set(0,4.3,13.5+i*1.9); g.add(k); }
  for(const s of [1,-1]){ const fl=T.box(4.6,0.7,2.4,FIN);
    fl.position.set(s*6,-3.6,8); fl.rotation.z=s*0.35; g.add(fl); }
  const fin=T.box(0.8,2.8,3.4,FIN); fin.position.set(0,5.6,-6); fin.rotation.x=-0.3; g.add(fin);
  const ped=T.faces(3.8,4.6,6,[side,side,top,belly,top,top]);
  ped.position.set(0,0.4,-15.5); g.add(ped);
  const fluke=T.box(12,1.1,4,FIN); fluke.position.set(0,0.9,-19.6); g.add(fluke);
  return g;
}});
