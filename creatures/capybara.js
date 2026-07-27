/* THE CAPYBARA — the greatest rodent there is, a barrel on short legs with a
   blunt square head. It keeps the river bank and slips into the water at any
   alarm, and everything gets on with it. */
EARTH.beast({
name:'capybara',
realm:'land',
metres:1.2,
build:function(T){
  const g=T.group(); const coat=0x9a6f3c, dark=0x6b4a26;
  const body=T.box(1.4,1.4,2.6,coat); body.position.y=1.5; g.add(body);
  const head=T.box(1.0,0.95,1.4,coat); head.position.set(0,1.7,1.9); g.add(head);
  const muz=T.box(0.8,0.6,0.4,dark); muz.position.set(0,1.5,2.7); g.add(muz);
  for(const s of [1,-1]){ const ear=T.box(0.24,0.24,0.18,dark); ear.position.set(s*0.36,2.25,1.7); g.add(ear);
    const eye=T.box(0.16,0.16,0.13,0x0e0a08); eye.position.set(s*0.36,2.0,2.4); g.add(eye); }
  T.legs4(g,0.5,0.9,0.9,dark,0.42);
  g.userData.head=head;
  return g;
}});
