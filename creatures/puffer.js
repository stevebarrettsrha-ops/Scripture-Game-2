/* THE PUFFER — a spined little ball of a fish, all bluster.
   See creatures/README.md. Change `metres` to change its size. */
EARTH.beast({
name:'puffer',
realm:'sea',
metres:0.45,
build:function(T){
  const g=T.group();
  g.add(T.box(2.2,2.2,2.4,0xe0b83a));
  for(let i=0;i<10;i++){ const a=i/10*6.28;
    const sp=T.box(0.3,0.3,0.9,0xd0a02a);
    sp.position.set(Math.cos(a)*1.4,Math.sin(a)*1.4,0); sp.rotation.z=a; g.add(sp); }
  const eL=T.box(0.4,0.4,0.3,0x201818); eL.position.set(0.7,0.4,1.3); g.add(eL);
  const eR=eL.clone(); eR.position.x=-0.7; g.add(eR);
  return g;
}});
