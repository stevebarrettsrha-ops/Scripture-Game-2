/* THE KOALA — grey, round-eared, with a great spoon of a nose, sitting in
   the fork of a gum tree doing nothing whatever for twenty hours a day. */
EARTH.beast({
name:'koala',
realm:'land',
metres:0.75,
axis:'y',
build:function(T){
  const g=T.group(); const grey=0x9a9a96, w=0xe8e6e0, k=0x2a2724;
  const body=T.box(1.3,1.5,1.1,grey); body.position.y=1.4; g.add(body);
  const chest=T.box(0.9,1.0,0.3,w); chest.position.set(0,1.4,0.6); g.add(chest);
  const head=T.box(1.1,1.0,1.0,grey); head.position.set(0,2.6,0.1); g.add(head);
  const nose=T.box(0.45,0.6,0.4,k); nose.position.set(0,2.4,0.65); g.add(nose);
  for(const s of [1,-1]){ const ear=T.box(0.55,0.6,0.4,grey); ear.position.set(s*0.8,2.85,0); g.add(ear);
    const fluff=T.box(0.66,0.7,0.24,w); fluff.position.set(s*0.9,2.85,0.16); g.add(fluff);
    const eye=T.box(0.16,0.16,0.14,0x100c0a); eye.position.set(s*0.3,2.72,0.56); g.add(eye);
    const arm=T.box(0.3,0.9,0.32,grey); arm.geometry.translate(0,-0.45,0);
    arm.position.set(s*0.75,2.0,0.25); arm.userData.ph=(s>0)?0:Math.PI; g.add(arm); }
  T.legs4(g,0.42,0.25,0.7,grey,0.36);
  return g;
}});
