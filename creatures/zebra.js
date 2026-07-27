/* THE ZEBRA — the striped horse of the plain, and never met alone: they graze
   the sward in a body, and when the lion breaks cover they go all together. */
EARTH.beast({
name:'zebra',
realm:'land',
metres:2.4,
build:function(T){
  const g=T.group();
  const hideT=T.tex(function(gg){ gg.fillStyle='rgb(238,236,230)'; gg.fillRect(0,0,16,16);
    gg.fillStyle='rgb(26,24,26)';
    for(let k=0;k<7;k++){ const x=Math.floor(T.hash(k,2.3)*15);
      gg.fillRect(x,0,1+Math.floor(T.hash(k,5.1)*2),16); } });
  const hide=T.mat(hideT);
  const body=new T.THREE.Mesh(new T.THREE.BoxGeometry(2.2,2.6,5.4),hide); body.position.y=4.2; g.add(body);
  const neck=new T.THREE.Mesh(new T.THREE.BoxGeometry(1.3,2.6,1.3),hide);
  neck.position.set(0,5.6,2.4); neck.rotation.x=-0.5; g.add(neck);
  const head=new T.THREE.Mesh(new T.THREE.BoxGeometry(1.2,1.5,2.4),hide); head.position.set(0,6.6,3.4); g.add(head);
  const muz=T.box(1.1,0.9,0.7,0x3a3430); muz.position.set(0,6.2,4.5); g.add(muz);
  const mane=T.box(0.4,1.0,2.4,0x1a1618); mane.position.set(0,6.6,2.2); mane.rotation.x=-0.5; g.add(mane);
  for(const s of [1,-1]){ const ear=T.box(0.32,0.8,0.32,0xeeece6); ear.position.set(s*0.42,7.5,3.0); g.add(ear);
    const eye=T.box(0.24,0.24,0.2,0x100c08); eye.position.set(s*0.6,6.8,4.2); g.add(eye); }
  const tail=T.box(0.35,1.9,0.35,0x1a1618); tail.geometry.translate(0,-0.95,0);
  tail.position.set(0,4.8,-2.9); tail.rotation.x=0.35; g.add(tail);
  T.legs4(g,0.85,1.9,3.4,0xe8e6e0,0.7);
  g.userData.head=head;
  return g;
}});
