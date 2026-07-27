/* THE ARMADILLO — banded plate over the back from nose to tail, and it rolls
   up into a shell when it is frightened. */
EARTH.beast({
name:'armadillo',
realm:'land',
metres:0.75,
build:function(T){
  const g=T.group(); const plate=0xa89a86, skin=0xd8c8b0;
  const body=T.box(0.9,0.7,1.6,skin); body.position.y=0.65; g.add(body);
  const shell=T.box(1.0,0.5,0.7,plate); shell.position.set(0,1.05,-0.5); g.add(shell);
  for(let i=0;i<5;i++){ const bd=T.box(0.96,0.28,0.22,plate); bd.position.set(0,1.05,0.0+i*0.26); g.add(bd); }
  const cap=T.box(0.7,0.4,0.5,plate); cap.position.set(0,1.0,1.35); g.add(cap);
  const head=T.box(0.5,0.42,0.8,skin); head.position.set(0,0.6,1.5); g.add(head);
  const snout=T.box(0.24,0.22,0.4,skin); snout.position.set(0,0.55,2.0); g.add(snout);
  for(const s of [1,-1]){ const ear=T.box(0.14,0.32,0.14,skin); ear.position.set(s*0.24,0.95,1.35); g.add(ear);
    const eye=T.box(0.1,0.1,0.08,0x100c08); eye.position.set(s*0.2,0.7,1.8); g.add(eye); }
  const tail=T.box(0.24,0.24,1.2,plate); tail.position.set(0,0.6,-1.3); g.add(tail);
  T.legs4(g,0.32,0.55,0.4,skin,0.2);
  return g;
}});
