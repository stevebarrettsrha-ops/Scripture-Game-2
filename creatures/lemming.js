/* THE LEMMING — a handful of fur with almost no tail, and the whole of the
   arctic stands on its back: the fox, the ermine, the owl and the skua all
   live or go hungry by how many of them there were this year. */
EARTH.beast({
name:'lemming',
realm:'land',
metres:0.13,
build:function(T){
  const g=T.group(); const coat=0xa8895c, pale=0xe0d0b0, k=0x2a2018;
  const body=T.box(0.9,0.8,1.3,coat); body.position.y=0.55; g.add(body);
  const back=T.box(0.5,0.3,1.1,k); back.position.set(0,0.9,-0.05); g.add(back);
  const head=T.box(0.7,0.6,0.6,coat); head.position.set(0,0.62,0.85); g.add(head);
  const muz=T.box(0.34,0.3,0.3,pale); muz.position.set(0,0.5,1.2); g.add(muz);
  const nose=T.box(0.12,0.1,0.1,0x1a1210); nose.position.set(0,0.54,1.38); g.add(nose);
  for(const s of [1,-1]){ const eye=T.box(0.12,0.11,0.1,0x0a0806); eye.position.set(s*0.2,0.74,1.1); g.add(eye);
    const ear=T.box(0.16,0.14,0.1,coat); ear.position.set(s*0.28,0.88,0.75); g.add(ear);
    const wh=T.box(0.4,0.04,0.04,0xe8e0d0); wh.position.set(s*0.3,0.5,1.25); g.add(wh); }
  const tail=T.box(0.14,0.14,0.25,coat); tail.position.set(0,0.55,-0.75); g.add(tail);
  T.legs4(g,0.28,0.42,0.28,pale,0.18);
  return g;
}});
