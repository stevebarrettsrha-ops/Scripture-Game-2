/* THE RIVER DOLPHIN — the boto, pink as the water it lives in is brown,
   with a long beak of a snout and a hump instead of a fin. It swims a
   thousand miles of river and never sees the sea. */
EARTH.beast({
name:'riverdolphin',
realm:'sea',
metres:2.4,
build:function(T){
  const g=T.group(); const pink=0xc98a92, pale=0xe0b4b8;
  const body=T.box(1.8,1.8,5.4,pink); g.add(body);
  const belly=T.box(1.5,0.6,4.8,pale); belly.position.y=-0.7; g.add(belly);
  const head=T.box(1.4,1.4,1.6,pink); head.position.z=3.4; g.add(head);
  const melon=T.box(1.0,0.7,1.0,pale); melon.position.set(0,0.7,3.6); g.add(melon);
  const beak=T.box(0.6,0.5,2.2,pink); beak.position.set(0,-0.2,5.0); g.add(beak);
  for(const s of [1,-1]){ const eye=T.box(0.22,0.22,0.2,0x140f0e); eye.position.set(s*0.72,0.3,3.8); g.add(eye);
    const fl=T.box(1.8,0.3,1.2,pink); fl.position.set(s*1.2,-0.6,1.4); fl.rotation.z=s*0.3; g.add(fl); }
  const hump=T.box(0.5,0.7,2.0,pink); hump.position.set(0,1.1,-0.4); g.add(hump);
  const ped=T.box(0.8,0.9,1.4,pink); ped.position.z=-3.2; g.add(ped);
  const tail=T.group(); tail.position.z=-3.9;
  const fluke=T.box(3.0,0.3,1.1,pink); fluke.position.z=-0.55; tail.add(fluke); g.add(tail);
  g.userData={tail};
  return g;
}});
