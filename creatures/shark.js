/* THE GREAT SHARK — grey above, white beneath, and the tail that wags.
   `tail` is handed back so the engine can drive it.
   See creatures/README.md. Change `metres` to change its size. */
EARTH.beast({
name:'shark',
realm:'sea',
metres:5.2,                  /* a full-grown great white */
build:function(T){
  const g=T.group();
  const topTex=T.tex(function(gg){ T.speckle(gg,[52,84,110],14,[42,72,96],0.3); });
  const belTex=T.tex(function(gg){ T.speckle(gg,[226,234,240],8,[210,220,228],0.3); });
  /* the flank: dark over, pale under, the line between them ragged, and the
     gill slits set forward on whichever side this texture faces */
  function flank(gillsRight){ return T.tex(function(gg){
    T.speckle(gg,[74,104,130],12,[62,92,118],0.3);
    for(let y=11;y<16;y++) for(let x=0;x<16;x++){
      if(y>11+(x%3===0?1:0)){ const c=T.jit([224,232,238],8,x+y*16); T.px(gg,x,y,T.rgb(c[0],c[1],c[2])); } }
    gg.fillStyle='rgb(30,44,58)';
    (gillsRight?[11,12,13]:[2,3,4]).forEach(function(x){ gg.fillRect(x,4,1,6); }); }); }
  const faceTex=T.tex(function(gg){
    T.speckle(gg,[52,84,110],10);
    gg.fillStyle='rgb(18,24,32)'; gg.fillRect(1,9,14,5);            /* the open mouth */
    gg.fillStyle='rgb(148,32,38)'; gg.fillRect(2,10,12,3);          /* red within */
    gg.fillStyle='rgb(242,246,250)';                                 /* the teeth */
    for(let x=2;x<14;x+=2){ gg.fillRect(x,9,1,2); gg.fillRect(x+1,12,1,2); } });
  const top=T.mat(topTex), belly=T.mat(belTex);
  const sL=T.mat(flank(true)), sR=T.mat(flank(false)), face=T.mat(faceTex);
  const FIN=0x33506a;

  const body=T.faces(3.6,3.6,9,[sR,sL,top,belly,top,top]); g.add(body);
  const head=T.faces(3.0,2.9,3.2,[sR,sL,top,belly,face,top]);
  head.position.set(0,-0.2,6.0); g.add(head);
  const snout=T.faces(2.4,1.1,1.7,[top,top,top,belly,top,top]);
  snout.position.set(0,1.05,6.9); g.add(snout);
  for(const s of [1,-1]){ const eye=T.box(0.45,0.45,0.45,0x0a0f14);
    eye.position.set(s*1.55,0.95,5.5); g.add(eye); }
  const dorsal=T.box(0.5,3.4,2.8,FIN);
  dorsal.position.set(0,3.1,0.4); dorsal.rotation.x=-0.42; g.add(dorsal);
  for(const s of [1,-1]){ const pec=T.box(3.8,0.4,1.8,FIN);
    pec.position.set(s*3.2,-1.6,3.2); pec.rotation.z=s*0.55; pec.rotation.y=s*0.22; g.add(pec); }
  for(const s of [1,-1]){ const pv=T.box(1.4,0.35,1.0,FIN);
    pv.position.set(s*1.3,-1.9,-2.2); pv.rotation.z=s*0.4; g.add(pv); }
  /* the tail: peduncle and the two-lobed caudal fin, grouped so it can wag */
  const tail=T.group(); tail.position.set(0,0,-4.5);
  const ped=T.faces(1.7,2.1,2.8,[sR,sL,top,belly,top,top]);
  ped.position.set(0,0,-1.2); tail.add(ped);
  const lobeU=T.box(0.5,3.6,1.7,FIN); lobeU.position.set(0,2.2,-2.6); lobeU.rotation.x=0.5; tail.add(lobeU);
  const lobeD=T.box(0.5,2.1,1.3,FIN); lobeD.position.set(0,-1.5,-2.4); lobeD.rotation.x=-0.45; tail.add(lobeD);
  g.add(tail);
  g.userData={tail}; return g;
}});
