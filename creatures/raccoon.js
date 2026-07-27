/* THE RACCOON — the black mask over the eyes and the ringed tail, and hands
   that will open anything that has a lid on it. */
EARTH.beast({
name:'raccoon',
realm:'land',
metres:0.75,
build:function(T){
  const g=T.group(); const grey=0x7e7a72, k=0x22201e, w=0xe8e4dc;
  const body=T.box(0.95,0.85,1.7,grey); body.position.y=1.0; g.add(body);
  const head=T.box(0.8,0.7,0.75,grey); head.position.set(0,1.35,1.2); g.add(head);
  const face=T.box(0.6,0.4,0.24,w); face.position.set(0,1.35,1.62); g.add(face);
  const mask=T.box(0.66,0.26,0.26,k); mask.position.set(0,1.44,1.63); g.add(mask);
  const snout=T.box(0.3,0.26,0.34,w); snout.position.set(0,1.18,1.72); g.add(snout);
  const nose=T.box(0.14,0.12,0.1,k); nose.position.set(0,1.2,1.94); g.add(nose);
  for(const s of [1,-1]){ const ear=T.box(0.26,0.26,0.16,grey); ear.position.set(s*0.3,1.78,1.1); g.add(ear);
    const eye=T.box(0.11,0.1,0.09,0x0a0806); eye.position.set(s*0.2,1.44,1.76); g.add(eye); }
  const tail=T.group(); tail.position.set(0,1.1,-0.9);
  for(let i=0;i<5;i++){ const seg=T.box(0.42,0.42,0.34,(i%2)?k:0x9a9288);
    seg.position.set(0,-0.06*i,-0.34*i); tail.add(seg); }
  g.add(tail);
  T.legs4(g,0.32,0.6,0.7,k,0.28);
  g.userData.head=head;
  return g;
}});
