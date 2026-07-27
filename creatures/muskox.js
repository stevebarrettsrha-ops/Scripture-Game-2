/* THE MUSK OX — a survivor out of the ice age, hung about with a skirt of
   hair to the hoof, and the horns meet in a helmet across the brow. When
   wolves come the herd stands in a ring with the calves inside it. */
EARTH.beast({
name:'muskox',
realm:'land',
metres:2.2,
build:function(T){
  const g=T.group(); const fur=0x3a2e24, skirt=0x241c16, horn=0xc0b498;
  const body=T.box(2.6,2.4,4.2,fur); body.position.y=4.0; g.add(body);
  const hump=T.box(2.6,1.0,1.8,fur); hump.position.set(0,5.4,1.2); g.add(hump);
  for(const s of [1,-1]){ const sk=T.box(0.5,2.6,4.4,skirt); sk.position.set(s*1.4,3.0,-0.2); g.add(sk); }
  const head=T.box(1.6,1.5,1.8,fur); head.position.set(0,4.4,3.1); g.add(head);
  const muz=T.box(1.0,0.7,0.5,0x6a5c4c); muz.position.set(0,4.0,4.1); g.add(muz);
  const boss=T.box(1.8,0.7,1.0,horn); boss.position.set(0,5.2,3.0); g.add(boss);
  for(const s of [1,-1]){ const h1=T.box(0.9,0.4,0.5,horn); h1.position.set(s*1.2,4.9,3.0); h1.rotation.z=s*0.6; g.add(h1);
    const h2=T.box(0.4,0.7,0.45,horn); h2.position.set(s*1.6,5.1,3.0); h2.rotation.z=s*0.2; g.add(h2);
    const eye=T.box(0.22,0.22,0.18,0x0c0a08); eye.position.set(s*0.62,4.6,3.9); g.add(eye); }
  T.legs4(g,0.9,1.5,2.0,skirt,0.8);
  g.userData.head=head;
  return g;
}});
