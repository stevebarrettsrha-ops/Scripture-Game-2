/* THE SKUNK — black, with the white stripe forked down the back, and a tail
   it puts straight up as a last warning before it does the other thing. */
EARTH.beast({
name:'skunk',
realm:'land',
metres:0.6,
build:function(T){
  const g=T.group(); const k=0x1a1816, w=0xf0eee8;
  const body=T.box(0.8,0.7,1.6,k); body.position.y=0.8; g.add(body);
  for(const s of [1,-1]){ const stripe=T.box(0.2,0.2,1.5,w); stripe.position.set(s*0.24,1.12,-0.1); g.add(stripe); }
  const cap=T.box(0.3,0.2,0.6,w); cap.position.set(0,1.12,0.85); g.add(cap);
  const head=T.box(0.6,0.55,0.7,k); head.position.set(0,1.0,1.1); g.add(head);
  const blaze=T.box(0.16,0.5,0.5,w); blaze.position.set(0,1.15,1.25); g.add(blaze);
  const snout=T.box(0.26,0.22,0.34,k); snout.position.set(0,0.85,1.55); g.add(snout);
  for(const s of [1,-1]){ const eye=T.box(0.1,0.1,0.08,0x080606); eye.position.set(s*0.2,1.08,1.42); g.add(eye);
    const ear=T.box(0.18,0.16,0.12,k); ear.position.set(s*0.22,1.34,1.0); g.add(ear); }
  const tail=T.box(0.7,1.5,0.5,k); tail.geometry.translate(0,0.75,0);
  tail.position.set(0,0.9,-0.9); tail.rotation.x=0.3; g.add(tail);
  const tw=T.box(0.3,1.4,0.52,w); tw.geometry.translate(0,0.7,0);
  tw.position.set(0,0.95,-0.9); tw.rotation.x=0.3; g.add(tw);
  T.legs4(g,0.28,0.55,0.45,k,0.22);
  return g;
}});
