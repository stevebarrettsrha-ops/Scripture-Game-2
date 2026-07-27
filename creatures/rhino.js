/* THE RHINOCEROS — two horns on the nose, ears like funnels, and armour
   plate over the shoulder. A wide territory, so there are never many. */
EARTH.beast({
name:'rhino',
realm:'land',
metres:3.7,
build:function(T){
  const g=T.group(); const hide=0x8b8a86, dark=0x6e6d69;
  const body=T.box(3.4,3.2,6.4,hide); body.position.y=4.8; g.add(body);
  const plate=T.box(3.5,1.0,2.2,dark); plate.position.set(0,6.0,0.8); g.add(plate);
  const head=T.box(2.2,2.0,3.0,hide); head.position.set(0,4.6,4.4); head.rotation.x=0.2; g.add(head);
  const h1=T.box(0.7,2.0,0.9,0xd8cfbc); h1.position.set(0,5.6,5.9); h1.rotation.x=-0.35; g.add(h1);
  const h2=T.box(0.55,1.0,0.7,0xd8cfbc); h2.position.set(0,5.6,4.7); h2.rotation.x=-0.2; g.add(h2);
  for(const s of [1,-1]){ const ear=T.box(0.5,1.0,0.7,hide); ear.position.set(s*0.9,6.1,3.4); g.add(ear);
    const eye=T.box(0.26,0.26,0.22,0x100d0a); eye.position.set(s*1.0,5.0,5.2); g.add(eye); }
  const tail=T.box(0.36,1.8,0.36,dark); tail.geometry.translate(0,-0.9,0);
  tail.position.set(0,5.0,-3.3); tail.rotation.x=0.3; g.add(tail);
  T.legs4(g,1.25,2.2,3.3,dark,1.2);
  g.userData.head=head;
  return g;
}});
