/* THE CARACAL — the desert lynx, red-gold, with long black tufts standing off
   the tips of its ears. It takes birds out of the air on the leap. */
EARTH.beast({
name:'caracal',
realm:'land',
metres:0.9,
build:function(T){
  const g=T.group(); const coat=0xc08a4a, pale=0xead8ba, k=0x1e1814;
  const body=T.box(1.1,1.1,2.2,coat); body.position.y=2.0; g.add(body);
  const belly=T.box(1.0,0.4,2.0,pale); belly.position.set(0,1.6,0); g.add(belly);
  const head=T.box(0.95,0.9,0.95,coat); head.position.set(0,2.5,1.4); g.add(head);
  const snout=T.box(0.5,0.42,0.4,pale); snout.position.set(0,2.32,1.92); g.add(snout);
  const nose=T.box(0.2,0.16,0.14,0x3a2018); nose.position.set(0,2.4,2.14); g.add(nose);
  for(const s of [1,-1]){ const ear=T.box(0.3,0.55,0.22,k); ear.position.set(s*0.34,3.15,1.35); g.add(ear);
    /* the tufts — the whole signature of the beast */
    const tuft=T.box(0.1,0.65,0.1,k); tuft.position.set(s*0.34,3.7,1.3); tuft.rotation.z=s*0.12; g.add(tuft);
    const eye=T.box(0.18,0.16,0.14,0xc8a838); eye.position.set(s*0.28,2.6,1.84); g.add(eye);
    const line=T.box(0.1,0.36,0.1,k); line.position.set(s*0.28,2.86,1.78); g.add(line); }
  const tail=T.box(0.3,0.3,1.1,coat); tail.position.set(0,2.1,-1.5); tail.rotation.x=0.4; g.add(tail);
  T.legs4(g,0.42,0.85,1.7,coat,0.4);
  return g;
}});
