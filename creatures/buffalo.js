/* THE CAPE BUFFALO — black, and the boss of the horns meets across the brow
   like a helmet. Not a beast to walk up to: the lions take the calves and
   leave the bulls alone. */
EARTH.beast({
name:'buffalo',
realm:'land',
metres:3.0,
build:function(T){
  const g=T.group(); const hide=0x2a2622, horn=0x6e6154;
  const body=T.box(3.0,2.8,5.6,hide); body.position.y=4.4; g.add(body);
  const hump=T.box(2.9,1.0,2.4,hide); hump.position.set(0,6.0,1.4); g.add(hump);
  const head=T.box(2.0,1.9,2.2,0x1e1a17); head.position.set(0,4.9,3.7); g.add(head);
  const muz=T.box(1.5,0.9,0.6,0x3a332c); muz.position.set(0,4.4,4.9); g.add(muz);
  /* the boss, and the horns sweeping down and out and up again */
  const boss=T.box(2.1,0.7,1.2,horn); boss.position.set(0,5.9,3.6); g.add(boss);
  for(const s of [1,-1]){ const h1=T.box(1.5,0.5,0.6,horn); h1.position.set(s*1.6,5.6,3.5); h1.rotation.z=s*0.5; g.add(h1);
    const h2=T.box(0.5,1.1,0.55,horn); h2.position.set(s*2.2,6.1,3.5); h2.rotation.z=s*0.25; g.add(h2);
    const ear=T.box(0.9,0.4,0.4,hide); ear.position.set(s*1.3,5.1,3.4); g.add(ear);
    const eye=T.box(0.25,0.25,0.2,0x0c0906); eye.position.set(s*0.75,5.1,4.7); g.add(eye); }
  const tail=T.box(0.34,2.4,0.34,0x14110e); tail.geometry.translate(0,-1.2,0);
  tail.position.set(0,4.8,-2.9); tail.rotation.x=0.2; g.add(tail);
  T.legs4(g,1.15,1.9,3.0,0x201c19,0.95);
  g.userData.head=head;
  return g;
}});
