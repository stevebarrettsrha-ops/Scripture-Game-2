/* THE MANTA RAY — a great flying diamond of the open water.
   `wingL`/`wingR` are handed back so the engine can beat them.
   Measured across the WINGS, not nose to tail — hence axis 'x'.
   See creatures/README.md. Change `metres` to change its size. */
EARTH.beast({
name:'ray',
realm:'sea',
metres:5.5,                  /* wingtip to wingtip */
axis:'x',
build:function(T){
  const g=T.group();
  const topTex=T.tex(function(gg){
    T.speckle(gg,[58,76,96],10,[48,66,86],0.3);
    gg.fillStyle='rgb(206,218,230)';
    for(let k=0;k<7;k++){ const x=1+Math.floor(T.hash(k,3)*14), y=1+Math.floor(T.hash(k,7)*14);
      gg.fillRect(x,y,1,1); } });
  const belTex=T.tex(function(gg){ T.speckle(gg,[224,230,236],7,[210,218,226],0.3); });
  const topM=T.mat(topTex), belM=T.mat(belTex);

  const body=T.faces(4,0.7,4.6,[topM,topM,topM,belM,topM,topM]); g.add(body);
  const wingL=T.faces(3.2,0.35,3.6,[topM,topM,topM,belM,topM,topM]);
  wingL.position.set(3.4,0,0); g.add(wingL);
  const wingR=wingL.clone(); wingR.position.x=-3.4; g.add(wingR);
  /* the cephalic lobes a manta carries either side of its mouth */
  for(const s of [1,-1]){ const lobe=T.box(0.6,0.4,1.4,0x3a4e64);
    lobe.position.set(s*1.5,0.1,2.7); g.add(lobe); }
  for(const s of [1,-1]){ const eye=T.box(0.35,0.35,0.35,0x10161e);
    eye.position.set(s*0.9,0.5,2.0); g.add(eye); }
  const tail=T.box(0.3,0.3,5.4,0x2c3c50); tail.position.set(0,0,-4.4); g.add(tail);
  const barb=T.box(0.5,0.2,0.9,0x9aa6b4); barb.position.set(0,0.15,-2.4); g.add(barb);
  g.userData={wingL,wingR}; return g;
}});
