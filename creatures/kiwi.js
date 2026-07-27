/* THE KIWI — a bird with no wings to speak of, hair for feathers, nostrils
   at the very tip of a long bill, and it goes about the forest floor at
   night smelling for worms. */
EARTH.beast({
name:'kiwi',
realm:'land',
metres:0.5,
build:function(T){
  const g=T.group(); const coat=0x7a6650, legs=[];
  const body=T.box(1.2,1.2,1.7,coat); body.position.y=1.1; g.add(body);
  const head=T.box(0.6,0.6,0.6,coat); head.position.set(0,1.55,0.95); g.add(head);
  const bill=T.box(0.16,0.16,1.5,0xc8b090); bill.position.set(0,1.35,1.9); bill.rotation.x=0.25; g.add(bill);
  for(const s of [1,-1]){ const eye=T.box(0.12,0.12,0.1,0x0c0a08); eye.position.set(s*0.2,1.68,1.22); g.add(eye);
    const L=T.box(0.24,0.7,0.24,0xa08a68); L.geometry.translate(0,-0.35,0);
    L.position.set(s*0.36,0.7,0); L.userData.ph=(s>0)?0:Math.PI; g.add(L); legs.push(L);
    const foot=T.box(0.3,0.16,0.5,0xa08a68); foot.position.set(s*0.36,0.08,0.16); g.add(foot); }
  g.userData={legs};
  return g;
}});
