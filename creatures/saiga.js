/* THE SAIGA — the antelope of the northern steppe, with a swollen ram's nose
   that warms the winter air before it reaches the lungs. Nothing else looks
   remotely like it. */
EARTH.beast({
name:'saiga',
realm:'land',
metres:1.4,
build:function(T){
  const g=T.group(); const coat=0xd6c8a4, horn=0xe8e2cc;
  const body=T.box(1.2,1.4,2.8,coat); body.position.y=2.6; g.add(body);
  const neck=T.box(0.75,1.3,0.75,coat); neck.position.set(0,3.6,1.2); neck.rotation.x=-0.5; g.add(neck);
  const head=T.box(0.75,0.8,1.2,coat); head.position.set(0,4.2,1.9); g.add(head);
  /* the nose — the whole point of a saiga */
  const nose=T.box(0.8,0.9,0.8,0xc0b291); nose.position.set(0,3.95,2.6); g.add(nose);
  const nos=T.box(0.5,0.24,0.2,0x3a3228); nos.position.set(0,3.75,3.0); g.add(nos);
  for(const s of [1,-1]){ const h=T.box(0.18,1.3,0.18,horn); h.geometry.translate(0,0.65,0);
    h.position.set(s*0.24,4.6,1.7); h.rotation.z=s*0.12; g.add(h);
    const ear=T.box(0.4,0.26,0.24,coat); ear.position.set(s*0.5,4.4,1.6); g.add(ear);
    const eye=T.box(0.16,0.16,0.13,0x0e0a08); eye.position.set(s*0.38,4.3,2.35); g.add(eye); }
  const tail=T.box(0.2,0.5,0.2,coat); tail.position.set(0,2.8,-1.5); g.add(tail);
  T.legs4(g,0.44,0.95,2.0,0xe0d4b4,0.36);
  return g;
}});
