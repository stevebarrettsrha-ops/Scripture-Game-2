/* THE WATER BUFFALO — slate-grey, with horns swept back in a great crescent.
   It stands in the river to the shoulder in the heat of the day, and it
   draws the plough in half the fields of the east. */
EARTH.beast({
name:'waterbuffalo',
realm:'land',
metres:2.8,
build:function(T){
  const g=T.group(); const hide=0x4a4a4e, horn=0x77706a;
  const body=T.box(2.8,2.6,5.4,hide); body.position.y=4.2; g.add(body);
  const head=T.box(1.8,1.7,2.0,hide); head.position.set(0,4.6,3.6); head.rotation.x=0.15; g.add(head);
  const muz=T.box(1.4,0.8,0.6,0x6a635c); muz.position.set(0,4.0,4.7); g.add(muz);
  for(const s of [1,-1]){
    const h1=T.box(1.8,0.42,0.5,horn); h1.position.set(s*1.5,5.4,3.2); h1.rotation.z=s*0.25; g.add(h1);
    const h2=T.box(0.5,0.42,1.6,horn); h2.position.set(s*2.3,5.85,2.4); h2.rotation.x=0.3; g.add(h2);
    const ear=T.box(0.8,0.4,0.4,hide); ear.position.set(s*1.15,4.9,3.3); g.add(ear);
    const eye=T.box(0.24,0.24,0.2,0x0e0b09); eye.position.set(s*0.7,4.9,4.5); g.add(eye); }
  const tail=T.box(0.32,2.4,0.32,hide); tail.geometry.translate(0,-1.2,0);
  tail.position.set(0,4.5,-2.8); tail.rotation.x=0.2; g.add(tail);
  T.legs4(g,1.05,1.8,2.9,0x3e3e42,0.9);
  return g;
}});
