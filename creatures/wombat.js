/* THE WOMBAT — a barrel of muscle that digs like a machine, and the only
   creature on the earth whose droppings come out square. */
EARTH.beast({
name:'wombat',
realm:'land',
metres:1.0,
build:function(T){
  const g=T.group(); const coat=0x8a7860, dark=0x5a4c3c;
  const body=T.box(1.5,1.2,2.2,coat); body.position.y=1.0; g.add(body);
  const head=T.box(1.1,0.9,1.0,coat); head.position.set(0,1.1,1.5); g.add(head);
  const muz=T.box(0.6,0.5,0.35,dark); muz.position.set(0,0.95,2.1); g.add(muz);
  const nose=T.box(0.3,0.2,0.16,0x1a1512); nose.position.set(0,1.02,2.32); g.add(nose);
  for(const s of [1,-1]){ const ear=T.box(0.32,0.34,0.2,coat); ear.position.set(s*0.44,1.68,1.4); g.add(ear);
    const eye=T.box(0.14,0.14,0.12,0x0e0a08); eye.position.set(s*0.3,1.24,1.94); g.add(eye); }
  T.legs4(g,0.5,0.8,0.5,dark,0.4);
  g.userData.head=head;
  return g;
}});
