/* THE OTTER — long, low, and made entirely of water. It keeps the banks of
   the rivers, fishes them, and slides down them for no reason at all. */
EARTH.beast({
name:'otter',
realm:'land',
metres:1.2,
build:function(T){
  const g=T.group(); const coat=0x5a4432, pale=0xbfa88a;
  const body=T.box(0.9,0.8,2.6,coat); body.position.y=0.85; g.add(body);
  const head=T.box(0.8,0.65,0.8,coat); head.position.set(0,1.05,1.7); g.add(head);
  const chin=T.box(0.6,0.3,0.5,pale); chin.position.set(0,0.8,1.95); g.add(chin);
  const nose=T.box(0.22,0.16,0.14,0x18120e); nose.position.set(0,1.05,2.14); g.add(nose);
  for(const s of [1,-1]){ const ear=T.box(0.18,0.16,0.14,coat); ear.position.set(s*0.3,1.42,1.55); g.add(ear);
    const eye=T.box(0.13,0.12,0.1,0x0c0a08); eye.position.set(s*0.26,1.2,2.0); g.add(eye);
    const whis=T.box(0.5,0.06,0.06,0xe0d8cc); whis.position.set(s*0.4,0.98,2.0); g.add(whis); }
  const tail=T.box(0.5,0.35,1.8,coat); tail.position.set(0,0.75,-2.1); g.add(tail);
  T.legs4(g,0.34,0.85,0.45,coat,0.3);
  g.userData.head=head;
  return g;
}});
