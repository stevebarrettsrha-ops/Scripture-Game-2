/* THE SWORDFISH — a bill like a blade, a high stiff dorsal, and it goes
   through the water faster than anything else with fins. */
EARTH.beast({
name:'swordfish',
realm:'sea',
metres:3.0,
build:function(T){
  const g=T.group();
  const topT=T.tex(function(gg){ T.speckle(gg,[46,64,96],12,[36,52,80],0.35); });
  const belT=T.tex(function(gg){ T.speckle(gg,[214,218,224],10,[194,200,210],0.3); });
  const top=T.mat(topT), bel=T.mat(belT);
  const body=T.faces(2.6,3.2,9.0,[top,top,top,bel,top,top]); g.add(body);
  const head=T.faces(2.2,2.6,2.6,[top,top,top,bel,top,top]); head.position.z=5.4; g.add(head);
  const bill=T.box(0.42,0.34,5.0,0x2a3a52); bill.position.z=9.2; g.add(bill);
  for(const s of [1,-1]){ const eye=T.box(0.5,0.5,0.4,0x0e1218); eye.position.set(s*1.1,0.5,6.0); g.add(eye); }
  const dors=T.box(0.3,3.4,2.6,0x2a3a52); dors.position.set(0,3.0,2.2); g.add(dors);
  for(const s of [1,-1]){ const pec=T.box(2.6,0.24,1.4,0x36486a); pec.position.set(s*1.6,-0.6,2.6); pec.rotation.z=s*0.3; g.add(pec); }
  const ped=T.faces(1.0,1.2,2.0,[top,top,top,bel,top,top]); ped.position.z=-5.6; g.add(ped);
  const tail=T.group(); tail.position.z=-6.4;
  const fl=T.box(0.3,4.4,1.8,0x2a3a52); fl.position.z=-0.9; tail.add(fl); g.add(tail);
  g.userData={tail};
  return g;
}});
