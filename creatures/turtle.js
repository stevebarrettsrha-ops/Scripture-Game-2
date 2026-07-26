/* THE SEA TURTLE — a plated shell, and slow front flippers that row.
   `flL`/`flR` are handed back so the engine can row them.
   See creatures/README.md. Change `metres` to change its size. */
EARTH.beast({
name:'turtle',
realm:'sea',
metres:1.8,                  /* a leatherback's shell and head */
build:function(T){
  const g=T.group();
  const shellTex=T.tex(function(gg){
    T.speckle(gg,[64,112,70],12,[54,98,60],0.3);
    gg.strokeStyle='rgb(36,64,40)'; gg.lineWidth=1; gg.strokeRect(0.5,0.5,15,15);
    [5.5,10.5].forEach(function(x){ gg.beginPath(); gg.moveTo(x,1); gg.lineTo(x,15); gg.stroke(); });
    [5.5,10.5].forEach(function(y){ gg.beginPath(); gg.moveTo(1,y); gg.lineTo(15,y); gg.stroke(); }); });
  const bellyTex=T.tex(function(gg){
    T.speckle(gg,[214,204,160],10,[198,188,146],0.3);
    gg.strokeStyle='rgb(150,140,102)'; gg.lineWidth=1;
    [4.5,8.5,12.5].forEach(function(y){ gg.beginPath(); gg.moveTo(0,y); gg.lineTo(16,y); gg.stroke(); });
    gg.beginPath(); gg.moveTo(8.5,0); gg.lineTo(8.5,16); gg.stroke(); });
  const skinTex=T.tex(function(gg){ T.speckle(gg,[96,134,74],16,[78,114,60],0.35); });
  const shellM=T.mat(shellTex), bellyM=T.mat(bellyTex), skinM=T.mat(skinTex);

  const shell=T.faces(3.6,1.5,4.4,[skinM,skinM,shellM,bellyM,skinM,skinM]); g.add(shell);
  const crown=T.faces(2.6,0.7,3.2,[skinM,skinM,shellM,shellM,skinM,skinM]);
  crown.position.y=1.0; g.add(crown);
  const head=new T.THREE.Mesh(new T.THREE.BoxGeometry(1.1,1.0,1.5),skinM);
  head.position.set(0,-0.1,2.9); g.add(head);
  for(const s of [1,-1]){ const eye=T.box(0.28,0.28,0.28,0x10161e);
    eye.position.set(s*0.58,0.12,3.35); g.add(eye); }
  const flL=new T.THREE.Mesh(new T.THREE.BoxGeometry(2.0,0.35,1.1),skinM);
  flL.position.set(2.2,-0.3,1.2); g.add(flL);
  const flR=flL.clone(); flR.position.x=-2.2; g.add(flR);
  const bkL=new T.THREE.Mesh(new T.THREE.BoxGeometry(1.3,0.35,1.0),skinM);
  bkL.position.set(1.9,-0.3,-1.7); g.add(bkL);
  const bkR=bkL.clone(); bkR.position.x=-1.9; g.add(bkR);
  g.userData={flL,flR}; return g;
}});
