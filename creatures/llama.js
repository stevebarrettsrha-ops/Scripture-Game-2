/* THE LLAMA — the pack beast of the high Andes, woolly, long-necked, with
   banana ears that curve toward one another. Measured by its height. */
EARTH.beast({
name:'llama',
realm:'land',
metres:1.8,
axis:'y',
build:function(T){
  const g=T.group(); const wool=0xd8c8a8, dark=0x6b5236;
  const body=T.box(1.6,2.0,3.2,wool); body.position.y=4.2; g.add(body);
  const neck=T.box(0.9,3.2,0.9,wool); neck.geometry.translate(0,1.6,0);
  neck.position.set(0,5.0,1.3); neck.rotation.x=-0.2; g.add(neck);
  const head=T.box(0.8,0.9,1.4,wool); head.position.set(0,8.5,2.2); g.add(head);
  const muz=T.box(0.66,0.6,0.4,dark); muz.position.set(0,8.25,2.9); g.add(muz);
  for(const s of [1,-1]){ const ear=T.box(0.2,0.9,0.24,wool);
    ear.position.set(s*0.34,9.2,2.0); ear.rotation.z=-s*0.2; g.add(ear);
    const eye=T.box(0.18,0.18,0.14,0x0e0a08); eye.position.set(s*0.42,8.6,2.7); g.add(eye); }
  const tail=T.box(0.3,0.6,0.3,wool); tail.position.set(0,4.6,-1.8); g.add(tail);
  T.legs4(g,0.6,1.2,3.2,wool,0.5);
  return g;
}});
