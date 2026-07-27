/* THE MAMMOTH — the woolly one of the far north: a coat to the ground, a
   dome on the crown of its head, small ears held close (there is nothing to
   be gained by a great ear where the air freezes), a hump of fat over the
   shoulder, and two tusks that sweep out, round and back on themselves. */
EARTH.beast({
name:'mammoth',
realm:'land',
metres:5.4,
build:function(T){
  const g=T.group(); const fur=0x6a4a30, dark=0x4a3220, tusk=0xefe6d0;
  const body=T.box(4.2,4.0,6.6,fur); body.position.y=6.2; g.add(body);
  /* the hump over the shoulder, and the dome on the head — the two humps
     that tell a mammoth from an elephant at any distance */
  const hump=T.box(3.8,1.8,2.6,fur); hump.position.set(0,8.6,1.6); g.add(hump);
  /* the skirt of long hair down both flanks, to the knee */
  for(const s of [1,-1]){ const skirt=T.box(0.7,3.6,6.2,dark); skirt.position.set(s*2.2,4.6,0); g.add(skirt); }
  const rump=T.box(4.0,3.4,1.0,dark); rump.position.set(0,6.0,-3.5); g.add(rump);
  const head=T.box(2.8,2.6,2.4,fur); head.position.set(0,7.4,4.2); g.add(head);
  const dome=T.box(2.0,1.4,1.8,fur); dome.position.set(0,9.0,4.0); g.add(dome);
  const trunk=T.box(1.0,3.6,1.0,fur); trunk.geometry.translate(0,-1.8,0);
  trunk.position.set(0,7.0,5.4); trunk.rotation.x=0.3; g.add(trunk);
  const tip=T.box(0.7,0.8,0.8,dark); tip.position.set(0,3.6,6.5); g.add(tip);
  for(const s of [1,-1]){
    const ear=T.box(0.4,1.2,1.0,dark); ear.position.set(s*1.5,7.9,3.3); g.add(ear);
    const eye=T.box(0.28,0.28,0.24,0x120d0a); eye.position.set(s*1.1,7.9,5.3); g.add(eye);
    /* the tusk: out, round, and back — four blocks stepping through the curve */
    const t1=T.box(0.5,0.5,1.8,tusk); t1.position.set(s*1.0,5.9,5.6); g.add(t1);
    const t2=T.box(0.5,1.2,0.5,tusk); t2.position.set(s*1.45,6.4,6.5); g.add(t2);
    const t3=T.box(0.5,0.5,1.4,tusk); t3.position.set(s*1.45,7.2,5.9); g.add(t3);
    const t4=T.box(0.5,0.9,0.5,tusk); t4.position.set(s*1.45,7.6,5.0); g.add(t4); }
  const tail=T.box(0.5,1.6,0.5,dark); tail.geometry.translate(0,-0.8,0); tail.position.set(0,6.4,-3.8); g.add(tail);
  T.legs4(g,1.5,2.4,4.2,dark,1.5);
  g.userData.head=head;
  return g;
}});
