/* THE SERPENT OF THE WASTE — the horned viper, which lies buried to the eyes
   in the sand of the track and is not seen until it is trodden on. "Dan shall
   be a serpent by the way, an adder in the path, that bites the horse heels."
   It moves in an S, and there was not one serpent in the whole world before. */
EARTH.beast({
name:'viper',
realm:'land',
metres:0.7,
build:function(T){
  const g=T.group(); const sand=0xcfb184, dark=0x8a7048, legs=[];
  /* the body — a chain of blocks laid in a wave, so it reads as coiled */
  const seg=[];
  for(let i=0;i<9;i++){
    const t=i/8;
    const s2=T.box(0.9-t*0.45,0.55-t*0.2,1.0,(i%2)?sand:dark);
    s2.position.set(Math.sin(i*0.9)*0.85, 0.3, -i*0.95+2.6);
    g.add(s2); seg.push(s2); }
  const head=T.box(1.05,0.5,1.0,sand); head.position.set(Math.sin(-0.9)*0.85,0.34,3.5); g.add(head);
  const jaw=T.box(0.9,0.22,0.9,0xb09468); jaw.position.set(Math.sin(-0.9)*0.85,0.1,3.5); g.add(jaw);
  for(const s of [1,-1]){
    const eye=T.box(0.2,0.2,0.18,0xd8c040); eye.position.set(Math.sin(-0.9)*0.85+s*0.34,0.52,3.7); g.add(eye);
    const pup=T.box(0.06,0.16,0.1,0x0a0806); pup.position.set(Math.sin(-0.9)*0.85+s*0.34,0.52,3.8); g.add(pup);
    /* the horn over each eye — the whole name of the beast */
    const horn=T.box(0.14,0.28,0.14,dark); horn.position.set(Math.sin(-0.9)*0.85+s*0.3,0.72,3.62); g.add(horn); }
  const tongue=T.box(0.08,0.06,0.6,0x8a2030); tongue.position.set(Math.sin(-0.9)*0.85,0.28,4.2); g.add(tongue);
  g.userData={legs,tail:seg[8]};
  return g;
}});
