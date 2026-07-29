/* THE OLM — the white blind salamander of the Balkan karst. It has no eyes to
   speak of and no colour at all, it can go ten years without eating, and it
   lives a hundred. Nothing else in the sealed dark lives so long. */
EARTH.beast({
name:'olm',
realm:'land',
metres:0.28,
build:function(T){
  const g=T.group(); const flesh=0xf0e2dc, gill=0xd6606a;
  const body=T.box(0.34,0.3,1.5,flesh); body.position.y=0.2; g.add(body);
  const head=T.box(0.36,0.28,0.42,flesh); head.position.set(0,0.2,0.92); g.add(head);
  const snout=T.box(0.24,0.2,0.24,flesh); snout.position.set(0,0.2,1.2); g.add(snout);
  /* the feathered outer gills, which it never loses — it stays a larva all its life */
  for(const s of [1,-1]) for(let i=0;i<3;i++){
    const f=T.box(0.1,0.1,0.22,gill); f.position.set(s*0.22,0.3-i*0.09,0.72); g.add(f); }
  const tail=T.box(0.16,0.42,0.8,flesh); tail.position.set(0,0.22,-1.05); g.add(tail);
  /* four small weak limbs — three toes before, two behind */
  for(const s of [1,-1]) for(const z of [0.5,-0.5]){
    const L=T.box(0.1,0.1,0.34,flesh); L.geometry.translate(s*0.17,0,0);
    L.position.set(s*0.17,0.1,z); g.add(L); }
  g.userData={head,tail};
  return g;
}});
