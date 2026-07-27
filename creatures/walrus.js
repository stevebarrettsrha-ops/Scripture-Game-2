/* THE WALRUS — a ton of it, hide like a wall, and the two tusks it hangs
   from the ice by to haul itself out. */
EARTH.beast({
name:'walrus',
realm:'sea',
metres:3.2,
build:function(T){
  const g=T.group(); const hide=0x9a6a58, dark=0x7a4e40;
  const body=T.box(3.4,3.0,7.0,hide); g.add(body);
  const head=T.box(2.6,2.2,2.2,hide); head.position.set(0,0.4,4.2); g.add(head);
  const muz=T.box(2.2,1.5,1.2,0xb08272); muz.position.set(0,-0.4,5.0); g.add(muz);
  for(const s of [1,-1]){ const tsk=T.box(0.4,2.6,0.4,0xefe8d4); tsk.geometry.translate(0,-1.3,0);
    tsk.position.set(s*0.6,-0.9,5.2); g.add(tsk);
    const eye=T.box(0.32,0.3,0.26,0x0e0a08); eye.position.set(s*0.9,0.9,5.0); g.add(eye);
    const whis=T.box(1.4,0.08,0.08,0xd8cfc0); whis.position.set(s*1.0,-0.5,5.4); g.add(whis);
    const fl=T.box(0.5,1.6,2.0,dark); fl.position.set(s*1.9,-0.8,1.6); fl.rotation.z=s*0.3; g.add(fl); }
  const hindL=T.box(0.6,2.0,2.0,dark); hindL.position.set(0.9,-0.4,-3.9); g.add(hindL);
  const hindR=T.box(0.6,2.0,2.0,dark); hindR.position.set(-0.9,-0.4,-3.9); g.add(hindR);
  g.userData={flL:hindL,flR:hindR};
  return g;
}});
