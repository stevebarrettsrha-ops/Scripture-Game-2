/* THE CHAMOIS — of the crags above the tree line, with two little hooked
   horns and a black stripe through the eye. It stands on ledges a man
   could not put one foot on. */
EARTH.beast({
name:'chamois',
realm:'land',
metres:1.3,
build:function(T){
  const g=T.group(); const coat=0x7a5a34, pale=0xe6dcc4, k=0x241c14;
  const body=T.box(1.1,1.3,2.4,coat); body.position.y=2.4; g.add(body);
  const neck=T.box(0.7,1.2,0.7,coat); neck.position.set(0,3.3,1.2); neck.rotation.x=-0.5; g.add(neck);
  const head=T.box(0.66,0.72,1.2,pale); head.position.set(0,3.9,1.9); g.add(head);
  for(const s of [1,-1]){ const stripe=T.box(0.7,0.28,1.1,k); stripe.position.set(s*0.02,4.05,1.95); g.add(stripe);
    const h=T.box(0.14,0.8,0.14,k); h.geometry.translate(0,0.4,0); h.position.set(s*0.2,4.35,1.5); g.add(h);
    const hook=T.box(0.14,0.14,0.35,k); hook.position.set(s*0.2,5.1,1.35); g.add(hook);
    const ear=T.box(0.4,0.22,0.22,coat); ear.position.set(s*0.48,4.2,1.5); g.add(ear);
    const eye=T.box(0.14,0.14,0.12,0x0c0a08); eye.position.set(s*0.34,4.05,2.3); g.add(eye); }
  const muz=T.box(0.55,0.4,0.3,k); muz.position.set(0,3.7,2.5); g.add(muz);
  const tail=T.box(0.2,0.4,0.2,k); tail.position.set(0,2.6,-1.3); g.add(tail);
  T.legs4(g,0.42,0.85,1.9,coat,0.34);
  g.userData.head=head;
  return g;
}});
