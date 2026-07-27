/* THE JERBOA — two long legs, a tail twice its own length with a flag on the
   end, and ears out of all proportion. It goes over the sand in bounds, at
   night, and drinks nothing at all its whole life. */
EARTH.beast({
name:'jerboa',
realm:'land',
metres:0.15,
build:function(T){
  const g=T.group(); const sand=0xd8bc8a, pale=0xf2ead8, legs=[];
  const body=T.box(0.9,0.95,1.1,sand); body.position.y=1.05; g.add(body);
  const belly=T.box(0.7,0.4,0.9,pale); belly.position.set(0,0.72,0.1); g.add(belly);
  const head=T.box(0.75,0.7,0.7,sand); head.position.set(0,1.75,0.5); g.add(head);
  const muz=T.box(0.4,0.34,0.35,pale); muz.position.set(0,1.6,0.95); g.add(muz);
  const nose=T.box(0.14,0.12,0.12,0x1a1210); nose.position.set(0,1.64,1.18); g.add(nose);
  for(const s of [1,-1]){ const ear=T.box(0.2,1.1,0.35,sand); ear.position.set(s*0.34,2.55,0.35); g.add(ear);
    const eye=T.box(0.24,0.22,0.18,0x0c0a08); eye.position.set(s*0.28,1.85,0.82); g.add(eye);
    const wh=T.box(0.7,0.05,0.05,0xe8e0d0); wh.position.set(s*0.45,1.58,1.0); g.add(wh);
    const arm=T.box(0.14,0.4,0.14,sand); arm.position.set(s*0.34,1.0,0.55); g.add(arm);
    /* the great hind legs it travels on */
    const L=T.box(0.26,1.0,0.3,sand); L.geometry.translate(0,-0.5,0);
    L.position.set(s*0.36,1.05,-0.15); L.userData.ph=(s>0)?0:Math.PI; g.add(L); legs.push(L);
    const foot=T.box(0.24,0.16,0.7,pale); foot.position.set(s*0.36,0.1,0.15); g.add(foot); }
  /* the tail — longer than the whole beast, with a black-and-white flag */
  const t1=T.box(0.16,0.16,2.0,sand); t1.position.set(0,1.1,-1.5); t1.rotation.x=0.25; g.add(t1);
  const t2=T.box(0.2,0.2,0.5,0x2a2118); t2.position.set(0,1.6,-2.6); g.add(t2);
  const t3=T.box(0.22,0.22,0.4,pale); t3.position.set(0,1.72,-3.0); g.add(t3);
  g.userData={legs};
  return g;
}});
