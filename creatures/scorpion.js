/* THE SCORPION — the creeping thing of the waste, with the sting carried over
   its own back. "Behold, I give you authority to tread on serpents and
   scorpions." It lies under a stone all day and comes out in the cool. */
EARTH.beast({
name:'scorpion',
realm:'land',
metres:0.12,
build:function(T){
  const g=T.group(); const shell=0x8a6a30, dark=0x5a4420, legs=[];
  const body=T.box(1.1,0.5,1.8,shell); body.position.y=0.55; g.add(body);
  const head=T.box(0.9,0.4,0.7,shell); head.position.set(0,0.55,1.2); g.add(head);
  for(const s of [1,-1]){ const eye=T.box(0.14,0.12,0.12,0x0a0806); eye.position.set(s*0.24,0.76,1.3); g.add(eye);
    /* the two claws, held out in front */
    const arm=T.box(0.24,0.24,0.9,dark); arm.position.set(s*0.7,0.5,1.6); arm.rotation.y=-s*0.35; g.add(arm);
    const claw=T.box(0.5,0.34,0.7,shell); claw.position.set(s*1.05,0.5,2.2); g.add(claw);
    const nip=T.box(0.2,0.2,0.5,dark); nip.position.set(s*1.2,0.58,2.6); g.add(nip);
    /* four legs a side */
    for(let i=0;i<4;i++){
      const L=T.box(0.14,0.4,0.14,dark); L.geometry.translate(0,-0.2,0);
      L.position.set(s*0.66,0.5,0.7-i*0.5); L.userData.ph=((i+(s>0?0:1))%2)?0:Math.PI;
      g.add(L); legs.push(L); } }
  /* the tail, carried up over the back, with the sting on the end */
  for(let i=0;i<5;i++){ const t=T.box(0.34-i*0.03,0.34,0.42,shell);
    t.position.set(0, 0.55+i*i*0.13, -1.0-i*0.34+i*i*0.09); g.add(t); }
  const bulb=T.box(0.36,0.4,0.4,dark); bulb.position.set(0,3.0,-1.5); g.add(bulb);
  const sting=T.box(0.16,0.4,0.16,0x2a1c10); sting.position.set(0,2.7,-1.15); sting.rotation.x=0.5; g.add(sting);
  g.userData={legs};
  return g;
}});
