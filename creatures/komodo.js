/* THE MONITOR — the great lizard of the eastern isles, three metres of it,
   with a forked tongue always out. It lies still and then it does not. */
EARTH.beast({
name:'komodo',
realm:'land',
metres:2.6,
build:function(T){
  const g=T.group(); const hide=0x5c5a4a, dark=0x3e3c32, legs=[];
  const body=T.box(1.8,1.2,4.0,hide); body.position.y=1.4; g.add(body);
  for(let i=0;i<7;i++){ const sc=T.box(1.85,0.22,0.4,dark); sc.position.set(0,1.95,-1.6+i*0.6); g.add(sc); }
  const neck=T.box(1.2,0.9,1.2,hide); neck.position.set(0,1.4,2.5); g.add(neck);
  const head=T.box(1.0,0.8,1.8,hide); head.position.set(0,1.35,3.8); g.add(head);
  const jaw=T.box(0.9,0.35,1.6,0x6e6c5c); jaw.geometry.translate(0,0,0.8);
  jaw.position.set(0,1.0,3.1); g.add(jaw);
  const tongue=T.box(0.12,0.08,0.9,0xc0405a); tongue.position.set(0,1.15,5.1); g.add(tongue);
  for(const s of [1,-1]){ const eye=T.box(0.2,0.2,0.18,0xd8b83a); eye.position.set(s*0.45,1.7,4.2); g.add(eye); }
  const t1=T.box(1.2,0.9,2.4,hide); t1.position.set(0,1.35,-3.1); g.add(t1);
  const t2=T.box(0.7,0.6,2.6,dark); t2.position.set(0,1.35,-5.4); g.add(t2);
  for(const sx of [1,-1]) for(const sz of [1.4,-1.5]){
    const L=T.box(0.6,0.9,0.6,dark); L.geometry.translate(0,-0.45,0);
    L.position.set(sx*1.15,0.95,sz); L.userData.ph=(sx*sz>0)?0:Math.PI; g.add(L); legs.push(L); }
  g.userData={legs,jaw,tail:t2};
  return g;
}});
