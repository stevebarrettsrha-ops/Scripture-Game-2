/* THE WHALE SHARK — the largest fish in the sea, and a harmless one: a broad
   flat head, a mouth that spans it wall to wall, and the checkerboard of pale
   spots and lines every one of them wears differently.
   `tail` is handed back so the engine can drive it.
   See creatures/README.md. Change `metres` to change its size. */
EARTH.beast({
name:'whaleshark',
realm:'sea',
metres:11,                   /* a full-grown one; the greatest run past 18 */
build:function(T){
  const g=T.group();
  /* the spotted hide — pale dots on slate, ruled off in faint lines */
  const spot=T.tex(function(gg){
    T.speckle(gg,[44,58,76],9,[36,50,66],0.3);
    gg.fillStyle='rgba(206,218,230,0.35)';
    for(const x of [3,8,13]) gg.fillRect(x,0,1,16);
    for(const y of [3,8,13]) gg.fillRect(0,y,16,1);
    gg.fillStyle='rgb(214,226,238)';
    for(let k=0;k<14;k++){ const x=Math.floor(T.hash(k,1.7)*15), y=Math.floor(T.hash(k,5.9)*15);
      gg.fillRect(x,y,1,1); } });
  const belTex=T.tex(function(gg){ T.speckle(gg,[228,234,240],6,[214,222,230],0.3); });
  const mouthTex=T.tex(function(gg){
    T.speckle(gg,[44,58,76],9,[36,50,66],0.3);
    gg.fillStyle='rgb(22,28,36)'; gg.fillRect(0,9,16,4);           /* the great gape */
    gg.fillStyle='rgb(150,164,180)'; gg.fillRect(0,12,16,1); });
  const top=T.mat(spot), belly=T.mat(belTex), side=T.mat(spot), face=T.mat(mouthTex);
  const FIN=0x2b3c50;

  const body=T.faces(6.4,6.8,16,[side,side,top,belly,top,top]); g.add(body);
  /* the head is WIDE and flat — the mark of the beast */
  const head=T.faces(7.2,4.6,5.0,[side,side,top,belly,face,top]);
  head.position.set(0,-0.6,10.0); g.add(head);
  for(const s of [1,-1]){ const eye=T.box(0.6,0.6,0.5,0x0a0f14);
    eye.position.set(s*3.5,-0.4,12.0); g.add(eye); }
  /* five gill slits down each side */
  for(const s of [1,-1]) for(let i=0;i<5;i++){
    const gill=T.box(0.25,2.6,0.5,0x22303f);
    gill.position.set(s*3.25,-0.4,6.6-i*1.0); g.add(gill); }
  const dorsal=T.box(0.7,4.4,3.2,FIN);
  dorsal.position.set(0,5.2,-0.6); dorsal.rotation.x=-0.34; g.add(dorsal);
  const dorsal2=T.box(0.5,1.6,1.4,FIN); dorsal2.position.set(0,4.0,-7.0); g.add(dorsal2);
  for(const s of [1,-1]){ const pec=T.box(6.0,0.6,2.6,FIN);
    pec.position.set(s*5.0,-2.6,4.6); pec.rotation.z=s*0.5; pec.rotation.y=s*0.2; g.add(pec); }
  for(const s of [1,-1]){ const pv=T.box(2.0,0.45,1.4,FIN);
    pv.position.set(s*2.4,-3.0,-4.6); pv.rotation.z=s*0.36; g.add(pv); }
  /* the tall upright tail of a whale shark, the upper lobe far the longer */
  const tail=T.group(); tail.position.set(0,0,-8.0);
  const ped=T.faces(2.6,3.2,3.4,[side,side,top,belly,top,top]);
  ped.position.set(0,0,-1.4); tail.add(ped);
  const lobeU=T.box(0.7,7.0,2.4,FIN); lobeU.position.set(0,3.6,-3.6); lobeU.rotation.x=0.34; tail.add(lobeU);
  const lobeD=T.box(0.7,3.0,1.8,FIN); lobeD.position.set(0,-1.8,-3.2); lobeD.rotation.x=-0.36; tail.add(lobeD);
  g.add(tail);
  g.userData={tail}; return g;
}});
