/* THE SEAL — at home in the water and helpless out of it. It hauls out on
   the floes to sleep, and it is what the polar bear is waiting for.
   See creatures/README.md. */
EARTH.beast({
name:'seal',
realm:'sea',
metres:1.8,
build:function(T){
  const g=T.group();
  const hideT=T.tex(function(gg){ T.speckle(gg,[110,116,124],16,[86,92,100],0.35);
    for(let k=0;k<10;k++) T.px(gg,Math.floor(T.hash(k,2.2)*16),Math.floor(T.hash(k,6.6)*16),'rgb(60,66,72)'); });
  const hide=T.mat(hideT);
  const body=new T.THREE.Mesh(new T.THREE.BoxGeometry(2.4,2.2,6.4),hide); g.add(body);
  const belly=T.box(2.0,0.7,5.8,0xd8d4cc); belly.position.y=-0.9; g.add(belly);
  const head=new T.THREE.Mesh(new T.THREE.BoxGeometry(1.8,1.6,1.8),hide); head.position.set(0,0.4,3.9); g.add(head);
  const muz=T.box(1.0,0.8,0.7,0x9aa0a8); muz.position.set(0,0.1,4.9); g.add(muz);
  const nose=T.box(0.36,0.26,0.2,0x14120f); nose.position.set(0,0.3,5.3); g.add(nose);
  for(const s of [1,-1]){ const eye=T.box(0.38,0.36,0.3,0x0a0808); eye.position.set(s*0.6,0.7,4.6); g.add(eye);
    const whis=T.box(1.2,0.06,0.06,0xe8e4dc); whis.position.set(s*0.8,0.05,4.9); g.add(whis);
    const fl=T.box(0.4,1.4,1.6,0x6a7078); fl.position.set(s*1.4,-0.4,1.2); fl.rotation.z=s*0.3; g.add(fl); }
  const hindL=T.box(0.5,1.8,1.8,0x6a7078); hindL.position.set(0.7,0,-3.6); hindL.rotation.z=0.4; g.add(hindL);
  const hindR=T.box(0.5,1.8,1.8,0x6a7078); hindR.position.set(-0.7,0,-3.6); hindR.rotation.z=-0.4; g.add(hindR);
  g.userData={flL:hindL,flR:hindR};
  return g;
}});
