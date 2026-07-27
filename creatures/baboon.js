/* THE BABOON — dog-faced, walking on all fours with the tail kinked up. They
   go in troops over the rocks and the plain and come down to the water. */
EARTH.beast({
name:'baboon',
realm:'land',
metres:1.0,
build:function(T){
  const g=T.group(); const coat=0x8a7b5e, face=0x33302c;
  const body=T.box(1.1,1.2,2.2,coat); body.position.y=1.8; g.add(body);
  const cape=T.box(1.35,1.0,1.2,0x9e8f70); cape.position.set(0,2.4,0.7); g.add(cape);
  const head=T.box(0.9,0.9,0.9,coat); head.position.set(0,2.5,1.5); g.add(head);
  const muz=T.box(0.55,0.55,0.9,face); muz.position.set(0,2.25,2.2); g.add(muz);
  for(const s of [1,-1]){ const eye=T.box(0.17,0.16,0.14,0x0e0c08); eye.position.set(s*0.26,2.6,1.9); g.add(eye);
    const ear=T.box(0.2,0.3,0.2,face); ear.position.set(s*0.5,2.6,1.4); g.add(ear); }
  const tail=T.box(0.24,1.1,0.24,coat); tail.position.set(0,2.3,-1.2); g.add(tail);
  const tail2=T.box(0.22,0.22,1.0,coat); tail2.position.set(0,2.7,-1.7); g.add(tail2);
  T.legs4(g,0.42,0.8,1.3,0x776950,0.36);
  return g;
}});
