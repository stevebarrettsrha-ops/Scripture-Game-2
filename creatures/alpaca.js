/* THE ALPACA — smaller than the llama and shorn for its fleece, so it goes
   about looking like a cloud on four sticks with a startled face. */
EARTH.beast({
name:'alpaca',
realm:'land',
metres:1.4,
axis:'y',
build:function(T){
  const g=T.group(); const wool=0xefe4d2, face=0x9a8a70;
  const body=T.box(1.8,2.2,2.8,wool); body.position.y=3.6; g.add(body);
  const neck=T.box(1.1,2.6,1.1,wool); neck.geometry.translate(0,1.3,0);
  neck.position.set(0,4.4,1.0); neck.rotation.x=-0.12; g.add(neck);
  const head=T.box(0.8,0.8,1.2,face); head.position.set(0,7.3,1.6); g.add(head);
  const fringe=T.box(1.0,0.7,1.0,wool); fringe.position.set(0,7.8,1.4); g.add(fringe);
  const muz=T.box(0.6,0.5,0.4,face); muz.position.set(0,7.1,2.2); g.add(muz);
  for(const s of [1,-1]){ const ear=T.box(0.2,0.6,0.2,wool); ear.position.set(s*0.34,8.2,1.35); g.add(ear);
    const eye=T.box(0.16,0.16,0.13,0x0e0a08); eye.position.set(s*0.34,7.4,2.05); g.add(eye); }
  T.legs4(g,0.6,1.0,2.6,wool,0.46);
  return g;
}});
