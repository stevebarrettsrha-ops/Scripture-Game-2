/* THE CHEETAH — spotted, small-headed, and built as one long spring. The
   tear-lines run from the eyes to the mouth. It stalks through the tall
   grass like the lion, and then it is simply gone. */
EARTH.beast({
name:'cheetah',
realm:'land',
metres:1.4,
build:function(T){
  const g=T.group();
  const coatT=T.tex(function(gg){ T.speckle(gg,[214,178,110],14);
    gg.fillStyle='rgb(38,30,22)';
    for(let k=0;k<20;k++){ gg.fillRect(Math.floor(T.hash(k,1.7)*15),Math.floor(T.hash(k,4.3)*15),1,1); } });
  const coat=T.mat(coatT);
  const body=new T.THREE.Mesh(new T.THREE.BoxGeometry(1.3,1.4,3.4),coat); body.position.y=2.4; g.add(body);
  const head=new T.THREE.Mesh(new T.THREE.BoxGeometry(1.0,1.0,1.1),coat); head.position.set(0,2.9,2.0); g.add(head);
  const snout=T.box(0.6,0.5,0.6,0xe8d5ac); snout.position.set(0,2.7,2.7); g.add(snout);
  for(const s of [1,-1]){ const ear=T.box(0.34,0.4,0.24,0x9a7a48); ear.position.set(s*0.36,3.5,1.9); g.add(ear);
    const eye=T.box(0.2,0.18,0.16,0x1a1208); eye.position.set(s*0.3,3.05,2.5); g.add(eye);
    const tear=T.box(0.12,0.55,0.12,0x2a2018); tear.position.set(s*0.3,2.72,2.62); g.add(tear); }
  const tail=new T.THREE.Mesh(new T.THREE.BoxGeometry(0.4,0.4,2.4),coat);
  tail.position.set(0,2.5,-2.4); tail.rotation.x=0.25; g.add(tail);
  const tip=T.box(0.42,0.42,0.5,0xf2ece0); tip.position.set(0,2.2,-3.6); g.add(tip);
  T.legs4(g,0.5,1.2,2.1,0xd6b26e,0.42);
  g.userData.head=head;
  return g;
}});
