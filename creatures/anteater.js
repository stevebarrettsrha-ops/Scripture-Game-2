/* THE GIANT ANTEATER — a tube of a head with no teeth in it at all, a
   diagonal band down the shoulder, and a tail like a banner. It walks on its
   knuckles to keep the digging claws off the ground. */
EARTH.beast({
name:'anteater',
realm:'land',
metres:2.0,
build:function(T){
  const g=T.group(); const coat=0x5a4a3c, w=0xe0d8c8, k=0x201a16;
  const body=T.box(1.3,1.5,2.6,coat); body.position.y=2.0; g.add(body);
  const band=T.box(1.36,0.9,1.0,k); band.position.set(0,2.2,0.7); band.rotation.x=0.4; g.add(band);
  const edge=T.box(1.4,0.3,1.05,w); edge.position.set(0,2.55,0.85); edge.rotation.x=0.4; g.add(edge);
  const head=T.box(0.6,0.6,1.4,coat); head.position.set(0,2.2,2.0); head.rotation.x=0.25; g.add(head);
  /* the snout — half the length of the beast */
  const snout=T.box(0.34,0.34,2.2,coat); snout.position.set(0,1.7,3.3); snout.rotation.x=0.25; g.add(snout);
  const tongue=T.box(0.1,0.1,0.7,0xc0607a); tongue.position.set(0,1.32,4.6); g.add(tongue);
  for(const s of [1,-1]){ const eye=T.box(0.12,0.12,0.1,0x0e0a08); eye.position.set(s*0.26,2.35,2.3); g.add(eye);
    const ear=T.box(0.16,0.2,0.14,coat); ear.position.set(s*0.28,2.6,1.7); g.add(ear); }
  /* the banner of a tail */
  const tail=T.box(1.5,1.2,1.9,0x4a3c30); tail.position.set(0,2.1,-2.2); g.add(tail);
  T.legs4(g,0.48,0.9,1.3,k,0.44);
  return g;
}});
