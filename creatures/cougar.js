/* THE COUGAR — the puma, the mountain lion, the same beast under fifty
   names. Plain tawny, no mane, no spots, and it ranges from the Yukon to
   Patagonia — the widest range of any land beast in the new world. */
EARTH.beast({
name:'cougar',
realm:'land',
metres:1.9,
build:function(T){
  const g=T.group(); const coat=0xb08a5c, pale=0xe8dcc4;
  const body=T.box(1.5,1.5,3.4,coat); body.position.y=2.6; g.add(body);
  const belly=T.box(1.35,0.45,3.0,pale); belly.position.set(0,1.95,0); g.add(belly);
  const head=T.box(1.15,1.1,1.2,coat); head.position.set(0,3.1,2.2); g.add(head);
  const snout=T.box(0.62,0.5,0.55,pale); snout.position.set(0,2.9,2.9); g.add(snout);
  const nose=T.box(0.24,0.18,0.16,0x3a2018); nose.position.set(0,3.02,3.2); g.add(nose);
  for(const s of [1,-1]){ const ear=T.box(0.36,0.4,0.24,coat); ear.position.set(s*0.42,3.75,2.1); g.add(ear);
    const eye=T.box(0.2,0.18,0.16,0xc0a838); eye.position.set(s*0.34,3.28,2.76); g.add(eye); }
  const tail=T.box(0.44,0.44,3.0,coat); tail.position.set(0,2.7,-2.8); tail.rotation.x=0.3; g.add(tail);
  T.legs4(g,0.58,1.15,2.2,coat,0.58);
  g.userData.head=head;
  return g;
}});
