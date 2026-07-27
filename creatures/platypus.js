/* THE PLATYPUS — a beast that lays eggs, has a bill like a duck, a tail like
   a beaver, webbed feet, and a spur of venom on the ankle. When the first
   skin reached England they thought somebody had sewn it together. */
EARTH.beast({
name:'platypus',
realm:'land',
metres:0.5,
build:function(T){
  const g=T.group(); const coat=0x4a3626, bill=0x2e2420;
  const body=T.box(1.0,0.6,1.9,coat); body.position.y=0.5; g.add(body);
  const head=T.box(0.8,0.5,0.7,coat); head.position.set(0,0.6,1.3); g.add(head);
  const bl=T.box(0.9,0.2,1.0,bill); bl.position.set(0,0.5,2.1); g.add(bl);
  for(const s of [1,-1]){ const eye=T.box(0.1,0.1,0.08,0x0a0806); eye.position.set(s*0.26,0.78,1.5); g.add(eye);
    const web=T.box(0.5,0.12,0.5,bill); web.position.set(s*0.6,0.16,0.7); g.add(web);
    const web2=T.box(0.45,0.12,0.45,bill); web2.position.set(s*0.55,0.16,-0.6); g.add(web2); }
  const tail=T.box(0.9,0.24,1.1,coat); tail.position.set(0,0.4,-1.5); g.add(tail);
  T.legs4(g,0.42,0.65,0.28,coat,0.22);
  g.userData.head=head;
  return g;
}});
