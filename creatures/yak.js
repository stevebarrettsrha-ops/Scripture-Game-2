/* THE YAK — shaggy to the ground, and it lives higher than anything else
   that has hooves. Below three thousand metres it suffers; above it, it
   carries the loads of every man on the roof of the world. */
EARTH.beast({
name:'yak',
realm:'land',
metres:3.0,
build:function(T){
  const g=T.group(); const fur=0x2e2622, horn=0xcfc4ac;
  const body=T.box(3.0,2.8,5.2,fur); body.position.y=4.4; g.add(body);
  const hump=T.box(2.9,1.1,2.0,fur); hump.position.set(0,6.0,1.4); g.add(hump);
  /* the skirt of long hair down both flanks */
  for(const s of [1,-1]){ const skirt=T.box(0.5,2.4,4.8,0x241d1a); skirt.position.set(s*1.6,3.4,0); g.add(skirt); }
  const head=T.box(1.7,1.6,2.0,fur); head.position.set(0,5.0,3.5); g.add(head);
  const muz=T.box(1.2,0.8,0.6,0x6a5c50); muz.position.set(0,4.6,4.6); g.add(muz);
  for(const s of [1,-1]){ const h1=T.box(1.2,0.4,0.4,horn); h1.position.set(s*1.2,5.8,3.3); h1.rotation.z=s*0.3; g.add(h1);
    const h2=T.box(0.4,0.9,0.4,horn); h2.position.set(s*1.8,6.3,3.3); h2.rotation.z=s*0.15; g.add(h2);
    const eye=T.box(0.24,0.24,0.2,0x0c0a08); eye.position.set(s*0.66,5.2,4.5); g.add(eye); }
  const tail=T.box(0.7,1.9,0.7,0x241d1a); tail.geometry.translate(0,-0.95,0);
  tail.position.set(0,4.6,-2.7); g.add(tail);
  T.legs4(g,1.05,1.7,3.0,0x241d1a,0.95);
  g.userData.head=head;
  return g;
}});
