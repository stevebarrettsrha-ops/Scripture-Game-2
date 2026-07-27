/* THE WHITE WOLF of the high arctic — heavier in the coat than its grey
   kindred, shorter in the ear and the muzzle, and it hunts the musk ox. */
EARTH.beast({
name:'arcticwolf',
realm:'land',
metres:1.5,
build:function(T){
  const g=T.group(); const w=0xf2f0ea, sh=0xdad8d0;
  const body=T.box(1.9,1.8,3.6,w); body.position.y=2.4; g.add(body);
  const ruff=T.box(2.1,1.8,0.9,w); ruff.position.set(0,2.6,1.8); g.add(ruff);
  const head=T.box(1.3,1.3,1.4,w); head.position.set(0,2.9,2.5); g.add(head);
  const snout=T.box(0.7,0.6,0.8,sh); snout.position.set(0,2.7,3.4); g.add(snout);
  const nose=T.box(0.26,0.2,0.16,0x1a1a1c); nose.position.set(0,2.78,3.86); g.add(nose);
  for(const s of [1,-1]){ const ear=T.box(0.4,0.55,0.28,w); ear.position.set(s*0.5,3.68,2.4); g.add(ear);
    const eye=T.box(0.18,0.16,0.14,0xc8b040); eye.position.set(s*0.36,3.1,3.16); g.add(eye); }
  const tail=T.box(0.7,0.7,1.7,w); tail.position.set(0,2.7,-2.3); tail.rotation.x=0.35; g.add(tail);
  T.legs4(g,0.66,1.3,2.1,w,0.62);
  return g;
}});
