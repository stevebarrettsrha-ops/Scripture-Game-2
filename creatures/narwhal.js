/* THE NARWHAL — the unicorn of the frozen sea, mottled grey, with the long
   straight spiral tusk of the bull. He has no dorsal fin at all: nothing to
   catch under the ice.
   The tusk is counted in `metres` — it is half again as long as he looks.
   See creatures/README.md. Change `metres` to change his size. */
EARTH.beast({
name:'narwhal',
realm:'sea',
metres:7,                    /* body and tusk together; the body alone is ~4.5 */
build:function(T){
  const g=T.group(); g.rotation.order='YXZ';
  const mottle=T.tex(function(gg){
    T.speckle(gg,[122,132,146],10,[104,114,128],0.3);
    gg.fillStyle='rgb(58,66,78)';
    for(let k=0;k<10;k++){ const x=Math.floor(T.hash(k,2.1)*15), y=Math.floor(T.hash(k,6.3)*15);
      gg.fillRect(x,y,2,1); } });
  const belTex=T.tex(function(gg){ T.speckle(gg,[224,228,234],6,[210,216,224],0.3); });
  const top=T.mat(mottle), belly=T.mat(belTex), side=T.mat(mottle);
  const FIN=0x6d7887;

  const body=T.faces(3.6,4.0,11,[side,side,top,belly,top,top]); g.add(body);
  const head=T.faces(3.0,3.2,3.4,[side,side,top,belly,top,top]);
  head.position.set(0,-0.2,7.0); g.add(head);
  const melon=T.box(2.4,1.6,2.0,0x9aa4b2); melon.position.set(0,1.4,7.6); g.add(melon);
  for(const s of [1,-1]){ const eye=T.box(0.4,0.4,0.4,0x0a0f14);
    eye.position.set(s*1.5,0.3,8.2); g.add(eye); }
  /* THE TUSK — a left canine grown straight out, taken in short segments so
     the spiral can be twisted into it */
  for(let i=0;i<7;i++){
    const seg=T.box(0.52-i*0.03,0.52-i*0.03,1.5,i%2?0xefeade:0xe2dcce);
    seg.position.set(-0.55,0.1,9.4+i*1.5); seg.rotation.z=i*0.22; g.add(seg); }
  const tip=T.box(0.26,0.26,0.9,0xf6f2e8); tip.position.set(-0.55,0.1,20.0); g.add(tip);
  /* no dorsal — only a low ridge along the back, as the narwhal has */
  const ridge=T.box(0.7,0.5,5.0,FIN); ridge.position.set(0,2.2,-1.4); g.add(ridge);
  for(const s of [1,-1]){ const pec=T.box(2.0,0.5,1.6,FIN);
    pec.position.set(s*2.1,-1.4,3.6); pec.rotation.z=s*0.3; g.add(pec); }
  const ped=T.faces(1.8,2.2,3.4,[side,side,top,belly,top,top]);
  ped.position.set(0,0.1,-6.8); g.add(ped);
  const fluke=T.box(5.6,0.7,2.4,FIN); fluke.position.set(0,0.3,-8.8); g.add(fluke);
  return g;
}});
