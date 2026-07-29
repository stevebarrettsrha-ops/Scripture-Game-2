/* THE BLIND CAVE FISH — a river fish sealed in the dark so long that it lost
   its eyes and its colour both, and finds its way by the pressure of the water
   on its skin. Its own kind still swims in the rivers outside, silver and
   seeing; these are the ones that could not get out. */
EARTH.beast({
name:'blindfish',
realm:'sea',
metres:0.09,
build:function(T){
  const g=T.group(); const pale=0xf2dcd2, pink=0xe0b0a6;
  const body=T.box(0.3,0.34,0.9,pale); body.position.y=0.2; g.add(body);
  const head=T.box(0.28,0.3,0.3,pink); head.position.set(0,0.2,0.56); g.add(head);
  /* where the eyes would be, there is only skin grown over */
  for(const s of [1,-1]){ const blank=T.box(0.06,0.12,0.06,pale); blank.position.set(s*0.14,0.24,0.66); g.add(blank); }
  const tail=T.box(0.08,0.4,0.3,pink); tail.position.set(0,0.2,-0.6); g.add(tail);
  const fin=T.box(0.06,0.24,0.3,pink); fin.position.set(0,0.44,0); g.add(fin);
  g.userData={tail};
  return g;
}});
