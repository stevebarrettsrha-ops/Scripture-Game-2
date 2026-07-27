/* THE COYOTE — smaller than the wolf, narrower in the muzzle, and it has
   done far better out of the coming of men than the wolf ever did. */
EARTH.beast({
name:'coyote',
realm:'land',
metres:1.2,
build:function(T){
  const g=T.group(); const coat=0xa08a68, pale=0xe0d6c2;
  const body=T.box(1.1,1.1,2.6,coat); body.position.y=1.9; g.add(body);
  const belly=T.box(1.0,0.36,2.3,pale); belly.position.set(0,1.5,0); g.add(belly);
  const head=T.box(0.9,0.9,1.0,coat); head.position.set(0,2.3,1.8); g.add(head);
  const snout=T.box(0.44,0.4,0.85,coat); snout.position.set(0,2.1,2.5); g.add(snout);
  const nose=T.box(0.2,0.18,0.14,0x1a1410); nose.position.set(0,2.16,2.98); g.add(nose);
  for(const s of [1,-1]){ const ear=T.box(0.3,0.66,0.22,coat); ear.position.set(s*0.36,2.95,1.7); g.add(ear);
    const eye=T.box(0.16,0.15,0.13,0xc0a038); eye.position.set(s*0.3,2.45,2.24); g.add(eye); }
  const tail=T.box(0.46,0.46,1.5,coat); tail.position.set(0,1.9,-1.9); tail.rotation.x=0.55; g.add(tail);
  const tip=T.box(0.48,0.48,0.3,0x2a2018); tip.position.set(0,1.45,-2.7); g.add(tip);
  T.legs4(g,0.4,0.85,1.6,coat,0.34);
  return g;
}});
