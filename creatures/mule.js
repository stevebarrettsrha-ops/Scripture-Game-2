/* THE MULE — the get of a donkey upon a mare, and the pack-beast of every
   hill road in the world: a horse's body and depth of chest on a donkey's
   long ears and dark points, with the coarse upright mane the hybrid always
   carries. Sure-footed where a horse will not go, and rideable. */
EARTH.beast({
name:'mule',
realm:'land',
metres:1.45,
axis:'y',
build:function(T){
  const g=T.group();
  const hide=0x6b4a33, dark=0x3a2a1e, muz=0xa9917c, mane=0x2a1d14;
  /* the barrel — deeper than a donkey's, as the horse-blood makes it */
  const body=T.box(1.5,1.7,3.6,hide); body.position.y=3.5; g.add(body);
  const chest=T.box(1.55,1.3,1.2,hide); chest.position.set(0,3.6,1.5); g.add(chest);
  const belly=T.box(1.4,0.5,3.2,dark); belly.position.set(0,2.75,0); g.add(belly);
  /* neck and head, carried lower than a horse's */
  const neck=T.box(1.0,1.7,1.1,hide); neck.position.set(0,4.6,1.7); neck.rotation.x=-0.28; g.add(neck);
  const head=T.box(0.85,0.95,1.7,hide); head.position.set(0,5.4,2.5); head.rotation.x=0.34; g.add(head);
  const nose=T.box(0.8,0.6,0.7,muz); nose.position.set(0,5.05,3.3); g.add(nose);
  const nostril=T.box(0.7,0.2,0.2,0x1a120c); nostril.position.set(0,5.0,3.62); g.add(nostril);
  /* THE EARS — the whole tell of a mule: long as a donkey's, set high */
  for(const s of [1,-1]){
    const ear=T.box(0.3,1.25,0.4,hide); ear.position.set(s*0.34,6.3,2.3); ear.rotation.z=s*0.16; g.add(ear);
    const inner=T.box(0.16,1.0,0.2,muz); inner.position.set(s*0.34,6.3,2.44); inner.rotation.z=s*0.16; g.add(inner);
    const eye=T.box(0.16,0.18,0.14,0x0e0a08); eye.position.set(s*0.44,5.6,2.9); g.add(eye);
  }
  /* the coarse standing mane, and the tufted tail */
  for(let i=0;i<6;i++){ const tuft=T.box(0.26,0.55,0.34,mane);
    tuft.position.set(0,5.35-i*0.16,2.15-i*0.42); g.add(tuft); }
  const dock=T.box(0.4,0.55,0.45,hide); dock.position.set(0,4.1,-1.9); g.add(dock);
  const tail=T.box(0.36,1.5,0.36,mane); tail.position.set(0,3.2,-2.05); g.add(tail);
  /* the dark points, and legs under it */
  T.legs4(g,0.55,1.25,3.5,hide,0.5);
  for(const L of (g.userData.legs||[])){
    const hoof=T.box(0.6,0.45,0.62,0x241a12); hoof.position.set(0,-3.28,0); L.add(hoof); }
  g.userData.head=head;
  return g;
}});
