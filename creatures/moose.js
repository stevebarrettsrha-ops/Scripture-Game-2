/* THE MOOSE — the tallest deer there is, with palmate antlers spread like
   two hands, a bell of skin under the throat, and a nose made for stripping
   weed off the bottom of a lake. */
EARTH.beast({
name:'moose',
realm:'land',
metres:2.9,
build:function(T){
  const g=T.group(); const hide=0x4a3626, pale=0xa08a68;
  const body=T.box(2.0,2.6,4.8,hide); body.position.y=6.0; g.add(body);
  const hump=T.box(2.1,1.2,2.0,hide); hump.position.set(0,7.6,1.4); g.add(hump);
  const neck=T.box(1.4,2.2,1.4,hide); neck.position.set(0,7.6,3.0); neck.rotation.x=-0.35; g.add(neck);
  const head=T.box(1.2,1.3,2.6,hide); head.position.set(0,8.6,4.3); head.rotation.x=0.3; g.add(head);
  const muz=T.box(1.0,1.0,0.9,0x2e2118); muz.position.set(0,8.1,5.5); g.add(muz);
  const bell=T.box(0.5,1.4,0.7,hide); bell.position.set(0,6.9,3.6); g.add(bell);
  for(const s of [1,-1]){
    const palm=T.box(2.4,0.3,2.0,pale); palm.position.set(s*1.7,9.9,3.6); palm.rotation.z=s*0.25; g.add(palm);
    for(let i=0;i<3;i++){ const tine=T.box(0.3,0.9,0.3,pale); tine.position.set(s*(1.0+i*0.7),10.4,3.0+i*0.5); g.add(tine); }
    const ear=T.box(0.28,0.7,0.4,hide); ear.position.set(s*0.75,9.2,3.6); g.add(ear);
    const eye=T.box(0.2,0.2,0.16,0x0e0a08); eye.position.set(s*0.6,8.9,4.9); g.add(eye); }
  const tail=T.box(0.3,0.5,0.3,pale); tail.position.set(0,6.6,-2.5); g.add(tail);
  T.legs4(g,0.75,1.7,4.6,0x2e2118,0.65);
  g.userData.head=head;
  return g;
}});
