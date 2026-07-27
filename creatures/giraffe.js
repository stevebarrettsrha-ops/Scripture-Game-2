/* THE GIRAFFE — the tallest thing that walks, and on the plain of the east
   you see the head and the neck of her over the thorn before anything else.
   Measured by her HEIGHT (axis 'y'), because that is what a giraffe is. */
EARTH.beast({
name:'giraffe',
realm:'land',
metres:5.2,
axis:'y',
build:function(T){
  const g=T.group(); const hide=0xd8a24a, patch=0x8a5a24, leg=0xe0b96e;
  const body=T.box(2.6,3.0,5.4,hide); body.position.y=9.4; g.add(body);
  /* the patches of her coat, blocked out on the flank */
  for(let i=0;i<7;i++){ const p=T.box(2.75,0.9,0.9,patch);
    p.position.set(0,8.6+T.hash(i,3.1)*2.0,-2.0+i*0.72); g.add(p); }
  const withers=T.box(2.4,1.4,2.0,hide); withers.position.set(0,10.9,2.0); g.add(withers);
  const neck=T.box(1.5,7.0,1.5,hide); neck.geometry.translate(0,3.5,0);
  neck.position.set(0,10.6,2.4); neck.rotation.x=-0.22; g.add(neck);
  for(let i=0;i<5;i++){ const p=T.box(1.6,0.7,1.6,patch);
    p.position.set(0,12.2+i*1.3,3.0+i*0.30); p.rotation.x=-0.22; g.add(p); }
  const head=T.box(1.2,1.3,2.4,hide); head.position.set(0,18.4,4.4); g.add(head);
  const muz=T.box(1.0,0.9,0.7,0x6f4a22); muz.position.set(0,18.2,5.6); g.add(muz);
  for(const s of [1,-1]){ const os=T.box(0.28,0.9,0.28,0x6f4a22);
    os.position.set(s*0.34,19.4,4.2); g.add(os);
    const kn=T.box(0.42,0.34,0.42,0x2b2018); kn.position.set(s*0.34,19.9,4.2); g.add(kn);
    const ear=T.box(0.8,0.35,0.5,hide); ear.position.set(s*0.9,18.8,4.0); g.add(ear);
    const eye=T.box(0.26,0.26,0.2,0x100c08); eye.position.set(s*0.62,18.7,5.2); g.add(eye); }
  const tail=T.box(0.3,2.6,0.3,hide); tail.geometry.translate(0,-1.3,0);
  tail.position.set(0,9.6,-2.8); tail.rotation.x=0.25; g.add(tail);
  T.legs4(g,1.1,1.9,8.0,leg,0.85);
  return g;
}});
