/* THE PTARMIGAN — the grouse of the tundra, and the only bird that goes white
   for the winter, feathers down to the toes and all. It sits still on the
   snow until you are a pace away and then goes off like a thrown stone. */
EARTH.beast({
name:'ptarmigan',
realm:'land',
metres:0.36,
build:function(T){
  const g=T.group(); const w=0xf4f2ec, k=0x1c1a18, legs=[];
  const body=T.box(1.5,1.4,2.0,w); body.position.y=1.2; g.add(body);
  for(const s of [1,-1]){ const wing=T.box(0.3,0.9,1.5,0xe4e2da); wing.position.set(s*0.86,1.25,-0.05); g.add(wing); }
  const head=T.box(0.8,0.75,0.8,w); head.position.set(0,2.15,0.75); g.add(head);
  const beak=T.box(0.26,0.22,0.36,k); beak.position.set(0,2.05,1.24); g.add(beak);
  for(const s of [1,-1]){ const eye=T.box(0.16,0.15,0.13,k); eye.position.set(s*0.3,2.28,1.0); g.add(eye);
    /* the red comb over the eye, which is the one colour on the whole bird */
    const comb=T.box(0.22,0.14,0.2,0xc02828); comb.position.set(s*0.3,2.5,0.9); g.add(comb);
    const L=T.box(0.26,0.5,0.26,w); L.geometry.translate(0,-0.25,0);
    L.position.set(s*0.34,0.6,0); L.userData.ph=(s>0)?0:Math.PI; g.add(L); legs.push(L);
    const foot=T.box(0.3,0.14,0.5,w); foot.position.set(s*0.34,0.08,0.16); g.add(foot); }
  const tail=T.box(1.0,0.24,0.9,k); tail.position.set(0,1.35,-1.3); g.add(tail);
  g.userData={legs};
  return g;
}});
