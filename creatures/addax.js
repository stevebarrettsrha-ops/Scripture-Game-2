/* THE ADDAX — white as the sand it stands on, with two horns twisted like a
   screw. It lives in the deepest of the Sahara where nothing else will, and
   it too never drinks. */
EARTH.beast({
name:'addax',
realm:'land',
metres:1.6,
build:function(T){
  const g=T.group(); const w=0xf0ead6, tan=0xb89a68, dark=0x3a2e22;
  const body=T.box(1.5,1.7,3.2,w); body.position.y=3.0; g.add(body);
  const shoulder=T.box(1.55,0.9,1.4,tan); shoulder.position.set(0,3.7,0.9); g.add(shoulder);
  const neck=T.box(0.9,1.6,0.9,tan); neck.position.set(0,4.1,1.4); neck.rotation.x=-0.5; g.add(neck);
  const head=T.box(0.8,0.9,1.6,w); head.position.set(0,4.9,2.3); g.add(head);
  const mask=T.box(0.84,0.5,0.8,dark); mask.position.set(0,5.05,2.6); g.add(mask);
  const patch=T.box(0.5,0.34,0.4,w); patch.position.set(0,5.15,2.95); g.add(patch);
  const muz=T.box(0.7,0.5,0.4,dark); muz.position.set(0,4.65,3.0); g.add(muz);
  /* the horns — a spiral, drawn as a stack of blocks stepping round */
  for(const s of [1,-1]) for(let i=0;i<6;i++){
    const a=i*0.9*s, r=0.22+i*0.05;
    const seg=T.box(0.2,0.42,0.2,0x3a3028);
    seg.position.set(s*0.26+Math.sin(a)*r, 5.4+i*0.4, 1.95+Math.cos(a)*r*0.6);
    g.add(seg); }
  for(const s of [1,-1]){ const ear=T.box(0.5,0.28,0.28,w); ear.position.set(s*0.55,5.1,2.0); g.add(ear);
    const eye=T.box(0.17,0.17,0.14,0x0c0a08); eye.position.set(s*0.42,5.0,2.9); g.add(eye); }
  const tail=T.box(0.22,1.2,0.22,w); tail.geometry.translate(0,-0.6,0); tail.position.set(0,3.3,-1.7); g.add(tail);
  T.legs4(g,0.6,1.2,2.3,w,0.5);
  g.userData.head=head;
  return g;
}});
