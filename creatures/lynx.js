/* THE LYNX — tufted ears, a ruff of whiskers, and enormous feet for the
   snow. A short tail with a black end, and it is gone before you see it. */
EARTH.beast({
name:'lynx',
realm:'land',
metres:1.0,
build:function(T){
  const g=T.group(); const coat=0xbba181, k=0x2a2420;
  const body=T.box(1.1,1.1,2.2,coat); body.position.y=2.0; g.add(body);
  for(let i=0;i<6;i++){ const sp=T.box(1.14,0.22,0.22,0x8a7052);
    sp.position.set(0,1.8+T.hash(i,2.2)*0.7,-0.8+i*0.35); g.add(sp); }
  const head=T.box(0.9,0.85,0.9,coat); head.position.set(0,2.5,1.4); g.add(head);
  const snout=T.box(0.5,0.4,0.4,0xefe8dc); snout.position.set(0,2.32,1.94); g.add(snout);
  for(const s of [1,-1]){ const ruff=T.box(0.25,0.7,0.35,0xefe8dc); ruff.position.set(s*0.55,2.3,1.5); g.add(ruff);
    const ear=T.box(0.28,0.34,0.2,coat); ear.position.set(s*0.32,3.0,1.35); g.add(ear);
    const tuft=T.box(0.1,0.4,0.1,k); tuft.position.set(s*0.32,3.35,1.35); g.add(tuft);
    const eye=T.box(0.16,0.15,0.13,0xc8b040); eye.position.set(s*0.26,2.6,1.84); g.add(eye); }
  const tail=T.box(0.3,0.3,0.6,coat); tail.position.set(0,2.2,-1.4); tail.rotation.x=0.4; g.add(tail);
  const tip=T.box(0.32,0.32,0.3,k); tip.position.set(0,2.1,-1.75); g.add(tip);
  T.legs4(g,0.4,0.75,1.6,coat,0.42);
  g.userData.head=head;
  return g;
}});
