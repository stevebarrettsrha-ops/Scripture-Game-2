/* THE HOWLER MONKEY — the loudest land animal there is: you hear the troop
   three miles off across the canopy before you see one of them. Prehensile
   tail, and a great throat-box under the jaw. */
EARTH.beast({
name:'howler',
realm:'land',
metres:0.62,
build:function(T){
  const g=T.group(); const fur=0x6b2e1a, k=0x241410;
  const body=T.box(0.8,1.0,1.4,fur); body.position.y=1.2; g.add(body);
  const head=T.box(0.7,0.65,0.7,fur); head.position.set(0,1.95,1.15); g.add(head);
  const face=T.box(0.45,0.45,0.22,k); face.position.set(0,1.9,1.52); g.add(face);
  const throat=T.box(0.6,0.6,0.55,fur); throat.position.set(0,1.42,1.15); g.add(throat);
  const beard=T.box(0.5,0.4,0.3,k); beard.position.set(0,1.33,1.45); g.add(beard);
  for(const s of [1,-1]){ const eye=T.box(0.12,0.11,0.1,0x100a08); eye.position.set(s*0.16,2.0,1.64); g.add(eye);
    const arm=T.box(0.24,1.0,0.26,fur); arm.geometry.translate(0,-0.5,0);
    arm.position.set(s*0.5,1.6,0.3); arm.userData.ph=(s>0)?0:Math.PI; g.add(arm); }
  /* the tail, curled and carrying his whole weight when he wants it to */
  const tail=T.group(); tail.position.set(0,1.4,-0.7);
  for(let i=0;i<5;i++){ const seg=T.box(0.2,0.24,0.34,fur);
    seg.position.set(0,0.16*i*i*0.2,-0.3*i+0.06*i*i); tail.add(seg); }
  g.add(tail);
  T.legs4(g,0.28,0.5,0.9,fur,0.24);
  g.userData.head=head;
  return g;
}});
