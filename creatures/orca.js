/* THE KILLER WHALE — black above, white beneath, the white eye-patch and the
   grey saddle behind the great standing dorsal. The bull's fin stands nearly
   two metres, which is why he is known a long way off.
   See creatures/README.md. Change `metres` to change his size. */
EARTH.beast({
name:'orca',
realm:'sea',
metres:8,                    /* a full-grown bull */
build:function(T){
  const g=T.group(); g.rotation.order='YXZ';
  const BLACK=0x12161c, WHITE=0xf2f5f8;
  const topTex=T.tex(function(gg){ T.speckle(gg,[18,22,28],7,[12,16,20],0.35); });
  const belTex=T.tex(function(gg){ T.speckle(gg,[238,242,246],6,[224,230,236],0.3); });
  /* the flank: black over, white beneath, with the eye-patch and the grey
     saddle written straight into the hide */
  const sideTex=T.tex(function(gg){
    T.speckle(gg,[18,22,28],7,[12,16,20],0.35);
    for(let x=0;x<16;x++){ const cut=11+Math.round(T.hash(x*1.9,2.7)*1);
      for(let y=cut;y<16;y++){ const c=T.jit([238,242,246],6,x*5+y); T.px(gg,x,y,T.rgb(c[0],c[1],c[2])); } }
    gg.fillStyle='rgb(238,242,246)'; gg.fillRect(11,4,3,2);           /* the eye-patch */
    gg.fillStyle='rgb(96,106,118)'; gg.fillRect(2,3,4,2); });         /* the saddle */
  const top=T.mat(topTex), belly=T.mat(belTex), side=T.mat(sideTex);

  const body=T.faces(5.4,6.2,15,[side,side,top,belly,top,top]); g.add(body);
  const head=T.faces(4.6,5.2,5.2,[side,side,top,belly,top,top]);
  head.position.set(0,-0.3,9.6); g.add(head);
  const brow=T.box(3.6,1.4,3.0,BLACK); brow.position.set(0,2.4,10.2); g.add(brow);
  const chin=T.box(3.4,1.2,3.6,WHITE); chin.position.set(0,-2.7,10.4); g.add(chin);
  for(const s of [1,-1]){ const eye=T.box(0.5,0.5,0.5,0x05070a);
    eye.position.set(s*2.35,0.5,11.2); g.add(eye); }
  /* the tall dorsal — the mark of the bull */
  const dorsal=T.box(0.9,6.4,3.0,BLACK);
  dorsal.position.set(0,5.4,0.6); dorsal.rotation.x=-0.14; g.add(dorsal);
  /* the round paddle flippers */
  for(const s of [1,-1]){ const pec=T.box(3.6,0.8,2.8,BLACK);
    pec.position.set(s*3.4,-2.2,5.4); pec.rotation.z=s*0.42; pec.rotation.y=s*0.18; g.add(pec); }
  const ped=T.faces(2.4,3.0,4.6,[side,side,top,belly,top,top]);
  ped.position.set(0,0.2,-9.2); g.add(ped);
  const fluke=T.box(8.4,0.9,3.0,BLACK); fluke.position.set(0,0.4,-11.8); g.add(fluke);
  const notch=T.box(0.9,1.0,1.6,BLACK); notch.position.set(0,0.4,-13.0); g.add(notch);
  return g;
}});
