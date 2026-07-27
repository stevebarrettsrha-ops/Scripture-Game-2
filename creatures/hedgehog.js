/* THE HEDGEHOG — a handful of spines with a wet nose at one end. It goes
   about the hedge-bottoms after dark and rolls into a ball at a footfall. */
EARTH.beast({
name:'hedgehog',
realm:'land',
metres:0.25,
build:function(T){
  const g=T.group(); const spine=0x6a5a44, skin=0xb89a7a;
  const body=T.box(1.0,0.8,1.4,spine); body.position.y=0.6; g.add(body);
  /* the spines, standing up out of the back */
  for(let k=0;k<14;k++){ const sp=T.box(0.14,0.3,0.14,0x2e2620);
    sp.position.set(-0.4+T.hash(k,1.7)*0.8, 1.0+T.hash(k,3.9)*0.12, -0.6+T.hash(k,5.3)*1.2);
    g.add(sp); }
  const head=T.box(0.5,0.45,0.5,skin); head.position.set(0,0.55,0.9); g.add(head);
  const snout=T.box(0.24,0.22,0.3,skin); snout.position.set(0,0.45,1.25); g.add(snout);
  const nose=T.box(0.12,0.1,0.1,0x141010); nose.position.set(0,0.47,1.42); g.add(nose);
  for(const s of [1,-1]){ const eye=T.box(0.1,0.1,0.08,0x0c0a08); eye.position.set(s*0.16,0.63,1.12); g.add(eye);
    const ear=T.box(0.14,0.14,0.1,skin); ear.position.set(s*0.22,0.76,0.78); g.add(ear); }
  T.legs4(g,0.26,0.42,0.28,skin,0.16);
  return g;
}});
