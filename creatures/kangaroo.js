/* THE KANGAROO — it does not walk at all: it stands on a tripod of two feet
   and a tail, and it travels in bounds. Measured by its height. */
EARTH.beast({
name:'kangaroo',
realm:'land',
metres:1.6,
axis:'y',
build:function(T){
  const g=T.group(); const coat=0xa07a52, pale=0xd8c6a8, legs=[];
  const body=T.box(1.3,2.2,1.4,coat); body.position.y=3.4; body.rotation.x=0.25; g.add(body);
  const chest=T.box(1.0,1.2,0.4,pale); chest.position.set(0,3.9,0.85); g.add(chest);
  const head=T.box(0.7,0.7,1.1,coat); head.position.set(0,5.0,0.7); g.add(head);
  const muz=T.box(0.5,0.42,0.4,pale); muz.position.set(0,4.85,1.35); g.add(muz);
  const nose=T.box(0.2,0.16,0.14,0x1a1410); nose.position.set(0,4.9,1.58); g.add(nose);
  for(const s of [1,-1]){ const ear=T.box(0.24,0.8,0.3,coat); ear.position.set(s*0.3,5.6,0.5); g.add(ear);
    const eye=T.box(0.14,0.14,0.12,0x0e0a08); eye.position.set(s*0.24,5.1,1.2); g.add(eye);
    const arm=T.box(0.24,1.0,0.26,coat); arm.geometry.translate(0,-0.5,0);
    arm.position.set(s*0.7,4.1,0.5); arm.rotation.x=-0.5; g.add(arm);
    /* the great hind legs, and the flat feet under them */
    const L=T.box(0.5,2.4,0.55,coat); L.geometry.translate(0,-1.2,0);
    L.position.set(s*0.5,2.6,-0.2); L.userData.ph=(s>0)?0:Math.PI; g.add(L); legs.push(L);
    const foot=T.box(0.5,0.35,1.5,coat); foot.position.set(s*0.5,0.18,0.3); g.add(foot); }
  /* the tail, thick at the root and lying along the ground behind */
  const tail=T.box(0.6,0.7,2.6,coat); tail.position.set(0,1.4,-1.9); tail.rotation.x=-0.28; g.add(tail);
  const tip=T.box(0.4,0.4,1.2,coat); tip.position.set(0,0.5,-3.4); g.add(tip);
  g.userData={legs};
  return g;
}});
