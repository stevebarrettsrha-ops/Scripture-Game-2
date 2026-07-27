/* THE BELUGA — the white whale of the ice, with a melon on its brow it can
   change the shape of, and no fin on its back at all, the better to come up
   under a floe. They are called the canaries of the sea for the noise of them.
   See creatures/README.md. */
EARTH.beast({
name:'beluga',
realm:'sea',
metres:4.2,
build:function(T){
  const g=T.group(); const w=0xf0f2f0, sh=0xd8dcdc;
  const body=T.box(2.6,2.8,8.0,w); g.add(body);
  const head=T.box(2.2,2.3,2.2,w); head.position.z=5.0; g.add(head);
  const melon=T.box(1.7,1.2,1.8,w); melon.position.set(0,1.0,5.2); g.add(melon);
  const snout=T.box(1.2,0.9,0.9,sh); snout.position.set(0,-0.4,6.3); g.add(snout);
  /* the ridge along the back where a fin would be on any other whale */
  const ridge=T.box(0.4,0.4,3.4,sh); ridge.position.set(0,1.5,-0.6); g.add(ridge);
  for(const s of [1,-1]){ const eye=T.box(0.28,0.26,0.24,0x14100e); eye.position.set(s*1.05,0.5,5.4); g.add(eye);
    const fl=T.box(2.2,0.4,1.6,w); fl.position.set(s*1.6,-0.9,2.2); fl.rotation.z=s*0.28; g.add(fl); }
  const ped=T.box(1.1,1.3,1.8,w); ped.position.z=-4.7; g.add(ped);
  const tail=T.group(); tail.position.z=-5.5;
  const fluke=T.box(4.6,0.45,1.6,w); fluke.position.z=-0.8; tail.add(fluke); g.add(tail);
  g.userData={tail};
  return g;
}});
