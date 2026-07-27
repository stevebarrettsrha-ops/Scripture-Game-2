/* THE OCTOPUS — eight arms, three hearts, and it changes colour with the
   rock it sits on. It goes over the reef bed at night and puts an arm into
   everything. */
EARTH.beast({
name:'octopus',
realm:'sea',
metres:1.2,
build:function(T){
  const g=T.group(); const skin=0xa04a5a, pale=0xd08a92, tents=[];
  const mantle=T.box(2.2,2.6,2.6,skin); mantle.position.y=1.6; g.add(mantle);
  const head=T.box(2.0,1.4,2.0,skin); head.position.y=0.2; g.add(head);
  for(const s of [1,-1]){ const eye=T.box(0.7,0.6,0.4,0xe8d86a); eye.position.set(s*0.9,0.4,0.9); g.add(eye);
    const pup=T.box(0.4,0.2,0.2,0x0c0a08); pup.position.set(s*0.9,0.4,1.06); g.add(pup); }
  for(let i=0;i<8;i++){ const a=i/8*6.283;
    const arm=T.group(); arm.position.set(Math.cos(a)*0.8,-0.4,Math.sin(a)*0.8);
    for(let k=0;k<4;k++){ const seg=T.box(0.5-k*0.08,0.5,0.5-k*0.08,(k%2)?pale:skin);
      seg.position.set(Math.cos(a)*k*0.55,-k*0.42,Math.sin(a)*k*0.55); arm.add(seg); }
    g.add(arm); tents.push(arm); }
  g.userData={tents};
  return g;
}});
