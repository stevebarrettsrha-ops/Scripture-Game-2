/* THE CAVE CRICKET — pale, humpbacked, and all legs and feelers. It leaves the
   cave at night to feed and comes back before light, and what it carries in is
   most of what the deeper dark ever gets to eat. */
EARTH.beast({
name:'cavecricket',
realm:'land',
metres:0.03,
build:function(T){
  const g=T.group(); const pale=0xc8b48c, dark=0x8a7454;
  const body=T.box(0.34,0.44,0.6,pale); body.position.y=0.5; g.add(body);
  const head=T.box(0.26,0.24,0.24,dark); head.position.set(0,0.62,0.42); g.add(head);
  /* the feelers, longer than the whole animal, sweeping the dark ahead of it */
  for(const s of [1,-1]){ const a=T.box(0.04,0.04,1.7,dark);
    a.geometry.translate(0,0,0.85); a.position.set(s*0.09,0.66,0.5); a.rotation.y=s*0.22; g.add(a); }
  /* the great hind legs it jumps blind with */
  for(const s of [1,-1]){ const th=T.box(0.12,0.5,0.16,pale);
    th.position.set(s*0.22,0.5,-0.2); th.rotation.z=s*0.4; g.add(th);
    const sh=T.box(0.07,0.7,0.07,dark); sh.position.set(s*0.4,0.3,-0.3); sh.rotation.z=s*-0.2; g.add(sh); }
  for(const s of [1,-1]) for(const z of [0.2,0.0]){
    const L=T.box(0.06,0.4,0.06,dark); L.position.set(s*0.24,0.32,z); L.rotation.z=s*0.5; g.add(L); }
  g.userData={head};
  return g;
}});
