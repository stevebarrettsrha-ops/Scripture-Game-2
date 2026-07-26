/* THE GREAT SQUID of the deep — mantle, head and six long arms.
   `tents` is handed back so the engine can work the arms.
   See creatures/README.md. Change `metres` to change its size.
   (A giant squid runs 10-13 m with the two long hunting arms; this is the
   body-and-arms measure, which is what the eye reads underwater.) */
EARTH.beast({
name:'squid',
realm:'sea',
metres:6,
axis:'y',                    /* a squid hangs, and is measured head to arm-tip */
build:function(T){
  const g=T.group();
  const mant=T.box(2.4,3.2,2.4,0x6a4a86); g.add(mant);
  const head=T.box(2.0,1.2,2.0,0x7a5a96); head.position.y=-1.9; g.add(head);
  const tents=[];
  for(let i=0;i<6;i++){ const a=i/6*6.28;
    const tb=T.box(0.5,2.6,0.5,0x5a3a76);
    tb.position.set(Math.cos(a)*0.8,-3.4,Math.sin(a)*0.8); g.add(tb); tents.push(tb); }
  const eL=T.box(0.5,0.5,0.4,0xffffff); eL.position.set(0.9,0.3,1.2); g.add(eL);
  const eR=eL.clone(); eR.position.x=-0.9; g.add(eR);
  g.userData={tents}; return g;
}});
