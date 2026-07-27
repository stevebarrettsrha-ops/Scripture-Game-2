/* THE ARCTIC FOX — the same beast in a winter coat: round-eared, short-
   muzzled, white from nose to brush, and it follows the bear over the ice to
   eat what the bear leaves. */
EARTH.beast({
name:'arcticfox',
realm:'land',
metres:0.72,
build:function(T){
  const g=T.group(); const w=0xf4f2ee, sh=0xd8dae0;
  const body=T.box(0.95,0.95,1.8,w); body.position.y=1.4; g.add(body);
  const head=T.box(0.8,0.75,0.75,w); head.position.set(0,1.8,1.2); g.add(head);
  const snout=T.box(0.34,0.3,0.5,w); snout.position.set(0,1.66,1.75); g.add(snout);
  const nose=T.box(0.16,0.14,0.12,0x1a1a1c); nose.position.set(0,1.7,2.02); g.add(nose);
  for(const s of [1,-1]){ const ear=T.box(0.3,0.32,0.2,w); ear.position.set(s*0.3,2.28,1.15); g.add(ear);
    const eye=T.box(0.14,0.13,0.11,0x14181c); eye.position.set(s*0.25,1.92,1.55); g.add(eye); }
  const tail=T.box(0.55,0.55,1.4,sh); tail.position.set(0,1.5,-1.5); tail.rotation.x=0.25; g.add(tail);
  T.legs4(g,0.3,0.65,1.05,w,0.28);
  g.userData.head=head;
  return g;
}});
