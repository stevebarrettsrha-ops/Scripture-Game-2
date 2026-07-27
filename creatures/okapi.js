/* THE OKAPI — the forest giraffe of the Congo, dark as wet bark with white
   bands on the haunch and the leg. It was not known to the world at all
   until men went in and found it. */
EARTH.beast({
name:'okapi',
realm:'land',
metres:2.2,
build:function(T){
  const g=T.group(); const hide=0x4a2f22, band=0xf0ece2, face=0x6b4a34;
  const body=T.box(1.8,2.2,4.0,hide); body.position.y=3.8; g.add(body);
  for(let i=0;i<4;i++){ const b=T.box(1.85,0.35,0.5,band); b.position.set(0,3.4+i*0.5,-1.6-i*0.05); g.add(b); }
  const neck=T.box(1.1,2.6,1.1,hide); neck.geometry.translate(0,1.3,0);
  neck.position.set(0,4.6,1.9); neck.rotation.x=-0.35; g.add(neck);
  const head=T.box(0.9,1.0,1.9,face); head.position.set(0,7.1,3.1); g.add(head);
  const muz=T.box(0.8,0.6,0.5,0x2e2018); muz.position.set(0,6.9,4.1); g.add(muz);
  for(const s of [1,-1]){ const os=T.box(0.2,0.6,0.2,hide); os.position.set(s*0.3,7.8,2.7); g.add(os);
    const ear=T.box(0.6,0.35,0.4,hide); ear.position.set(s*0.7,7.4,2.6); g.add(ear);
    const eye=T.box(0.2,0.2,0.16,0x0e0a08); eye.position.set(s*0.45,7.3,3.7); g.add(eye); }
  const tail=T.box(0.26,1.6,0.26,hide); tail.geometry.translate(0,-0.8,0);
  tail.position.set(0,4.2,-2.1); g.add(tail);
  T.legs4(g,0.7,1.4,3.0,band,0.6);
  return g;
}});
