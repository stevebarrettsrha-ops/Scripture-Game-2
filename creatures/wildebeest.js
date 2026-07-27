/* THE WILDEBEEST — the gnu, heavy in the shoulder and thin behind, with the
   beard under the jaw. These are the herds that darken the plain when they
   move, and the lion follows them across it. */
EARTH.beast({
name:'wildebeest',
realm:'land',
metres:2.2,
build:function(T){
  const g=T.group(); const hide=0x4a4a52, dark=0x2e2e36;
  const body=T.box(2.0,2.4,4.4,hide); body.position.y=3.9; g.add(body);
  const hump=T.box(2.1,1.1,2.0,hide); hump.position.set(0,5.4,1.4); g.add(hump);
  const neck=T.box(1.3,2.0,1.3,hide); neck.position.set(0,5.2,2.6); neck.rotation.x=-0.7; g.add(neck);
  const head=T.box(1.2,1.2,2.4,dark); head.position.set(0,5.6,3.9); g.add(head);
  const beard=T.box(0.5,1.3,1.4,0x1e1e24); beard.position.set(0,4.6,3.9); g.add(beard);
  const mane=T.box(0.4,1.0,2.2,0x1e1e24); mane.position.set(0,6.2,2.4); g.add(mane);
  for(const s of [1,-1]){ const h1=T.box(0.9,0.32,0.32,0x3a3128); h1.position.set(s*0.9,6.3,3.4); g.add(h1);
    const h2=T.box(0.32,0.7,0.32,0x3a3128); h2.position.set(s*1.35,6.6,3.4); h2.rotation.z=-s*0.4; g.add(h2);
    const eye=T.box(0.22,0.22,0.2,0x0e0a08); eye.position.set(s*0.6,5.8,4.7); g.add(eye); }
  const tail=T.box(0.32,2.2,0.32,0x14141a); tail.geometry.translate(0,-1.1,0);
  tail.position.set(0,4.4,-2.3); tail.rotation.x=0.2; g.add(tail);
  T.legs4(g,0.78,1.6,3.1,0x3e3e46,0.66);
  return g;
}});
