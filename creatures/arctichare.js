/* THE ARCTIC HARE — twice the hare of the field and white all winter, with
   short black-tipped ears. It sits up on its hind legs to see over the snow,
   and in a hard season a hundred of them will herd together. */
EARTH.beast({
name:'arctichare',
realm:'land',
metres:0.6,
build:function(T){
  const g=T.group(); const w=0xf4f2ec, k=0x201c18;
  const body=T.box(1.3,1.4,2.0,w); body.position.y=1.3; g.add(body);
  const head=T.box(1.0,1.0,1.0,w); head.position.set(0,2.2,1.05); g.add(head);
  const muz=T.box(0.5,0.42,0.4,w); muz.position.set(0,2.0,1.6); g.add(muz);
  const nose=T.box(0.16,0.14,0.12,0xc08a90); nose.position.set(0,2.04,1.82); g.add(nose);
  for(const s of [1,-1]){ const ear=T.box(0.3,1.0,0.28,w); ear.position.set(s*0.32,3.05,0.95); g.add(ear);
    const tip=T.box(0.32,0.28,0.3,k); tip.position.set(s*0.32,3.5,0.95); g.add(tip);
    const eye=T.box(0.18,0.17,0.14,0x141010); eye.position.set(s*0.42,2.35,1.4); g.add(eye);
    const wh=T.box(0.7,0.05,0.05,0xe8e6e0); wh.position.set(s*0.5,2.0,1.6); g.add(wh); }
  const tail=T.box(0.5,0.5,0.4,w); tail.position.set(0,1.5,-1.1); g.add(tail);
  T.legs4(g,0.44,0.7,0.9,w,0.4);
  return g;
}});
