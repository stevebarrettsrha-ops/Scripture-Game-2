/* THE BISON — a wall of hair at the shoulder and nothing behind it. They
   went over the plains in millions, and where they graze the sward is kept
   short and the ground is broken. */
EARTH.beast({
name:'bison',
realm:'land',
metres:3.0,
build:function(T){
  const g=T.group(); const fur=0x4a3524, dark=0x2e2118, horn=0x22201c;
  const body=T.box(2.6,2.4,4.6,fur); body.position.y=4.0; g.add(body);
  /* the hump — the whole front of the beast */
  const hump=T.box(2.8,2.0,2.6,dark); hump.position.set(0,5.6,1.2); g.add(hump);
  const cape=T.box(2.9,1.6,1.0,dark); cape.position.set(0,4.4,2.2); g.add(cape);
  const head=T.box(1.7,1.8,1.7,dark); head.position.set(0,4.0,3.3); g.add(head);
  const beard=T.box(0.7,1.2,0.9,dark); beard.position.set(0,3.0,3.4); g.add(beard);
  const muz=T.box(1.1,0.8,0.5,0x5a4a3c); muz.position.set(0,3.7,4.2); g.add(muz);
  for(const s of [1,-1]){ const h1=T.box(0.7,0.32,0.32,horn); h1.position.set(s*1.0,4.7,3.2); g.add(h1);
    const h2=T.box(0.3,0.55,0.32,horn); h2.position.set(s*1.3,4.95,3.2); h2.rotation.z=-s*0.3; g.add(h2);
    const eye=T.box(0.22,0.22,0.18,0x0c0906); eye.position.set(s*0.66,4.3,4.1); g.add(eye); }
  const tail=T.box(0.28,1.6,0.28,dark); tail.geometry.translate(0,-0.8,0);
  tail.position.set(0,4.2,-2.4); g.add(tail);
  T.legs4(g,0.95,1.6,2.6,dark,0.85);
  g.userData.head=head;
  return g;
}});
