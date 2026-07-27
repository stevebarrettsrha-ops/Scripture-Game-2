/* THE BADGER — low, grey and heavy, with the two black bars down a white
   face. It digs, and what it digs it keeps for generations. */
EARTH.beast({
name:'badger',
realm:'land',
metres:0.8,
build:function(T){
  const g=T.group(); const grey=0x9a9a94, w=0xf0eee8, k=0x201e1c;
  const body=T.box(1.0,0.85,2.0,grey); body.position.y=1.0; g.add(body);
  const head=T.box(0.7,0.6,1.0,w); head.position.set(0,1.15,1.45); g.add(head);
  for(const s of [1,-1]){ const bar=T.box(0.2,0.62,1.0,k); bar.position.set(s*0.24,1.15,1.45); g.add(bar);
    const ear=T.box(0.18,0.16,0.14,w); ear.position.set(s*0.3,1.5,1.15); g.add(ear); }
  const nose=T.box(0.18,0.15,0.14,k); nose.position.set(0,1.05,1.97); g.add(nose);
  const tail=T.box(0.34,0.34,0.6,grey); tail.position.set(0,1.05,-1.2); g.add(tail);
  T.legs4(g,0.36,0.7,0.6,k,0.32);
  g.userData.head=head;
  return g;
}});
