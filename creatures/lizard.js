/* THE LIZARD — thirty-nine lands name it, and it ran over the hot rocks of
   all of them as thirteen boxes.

   What a lizard is: the CREST of scales down the spine and out along the
   tail; the great round ear-hole behind the eye, which nothing else on this
   earth has open to the air; the throat fan it puts out on a rock in the sun;
   the SPLAYED FEET with five long spread toes apiece, which is how it stands
   on nothing; the beaded skin; the tail that is longer than the whole rest of
   the animal; the eyelid that closes, unlike a snake's.

   Fifty-one parts, drawn in eleven meshes.

   Built nose toward +z, feet at y=0. */
EARTH.beast({
name:'lizard',
realm:'land',
metres:0.25,
build:function(T){
  const g=T.group();
  const green=0x6f7a44, lt=0x7a854c, dark=0x4a5230, pale=0xb0b489,
        fan=0xb8663a, eye=0xd9c93f;

  /* ---- THE BODY ---- flattened, and beaded along the flank */
  T.on(g,T.box(0.80,0.52,1.30,green), 0,0.62, 0.35);
  T.on(g,T.box(0.72,0.48,1.10,green), 0,0.60,-0.75);
  T.on(g,T.box(0.66,0.20,2.30,pale),  0,0.40,-0.10);         /* the pale belly */
  for(const s of [1,-1]) for(let i=0;i<6;i++)
    T.on(g,T.box(0.10,0.16,0.20, i%2?lt:dark), s*0.40, 0.66, 0.85-i*0.32);
  /* ---- THE CREST ---- and it runs from the neck to the tip of the tail */
  for(let i=0;i<8;i++) T.on(g,T.box(0.10,0.20+((i*3)%3)*0.06,0.16,dark), 0,0.94, 0.95-i*0.28);

  /* ---- THE HEAD ---- wedge-shaped, with the ear-hole open behind the eye */
  const head=T.box(0.66,0.44,0.80,lt); head.position.set(0,0.72,1.45); g.add(head);
  const H=(m,x,y,z)=>{ m.position.set(x,y,z); head.add(m); return m; };
  H(T.box(0.46,0.30,0.42,lt),    0,-0.06, 0.56);             /* the snout */
  H(T.box(0.26,0.16,0.12,dark),  0,-0.02, 0.80);
  const jaw=T.box(0.50,0.16,0.72,pale); jaw.geometry.translate(0,0,0.36);
  H(jaw, 0,-0.24, 0.10);
  for(const s of [1,-1]){
    H(T.box(0.20,0.20,0.18,eye),      s*0.30, 0.10, 0.16);   /* the eye */
    H(T.box(0.10,0.14,0.10,0x0e0e08), s*0.34, 0.10, 0.24);
    H(T.box(0.24,0.10,0.20,dark),     s*0.30, 0.22, 0.14);   /* the lid */
    H(T.box(0.16,0.18,0.14,0x2a2c18), s*0.32, 0.02,-0.20);   /* THE EAR-HOLE */
  }
  /* the throat fan, put out on a rock in the sun */
  T.on(g,T.box(0.12,0.34,0.46,fan), 0,0.40,1.28).rotation.x=0.30;

  /* ---- THE TAIL ---- longer than all the rest of it, in five lengths */
  const tail=T.limb(0.34,0.90,0.30,green,0,-1.57); tail.position.set(0,0.60,-1.25); g.add(tail);
  let t=tail, w=0.30, ln=0.85, th=0.26;
  for(let i=0;i<4;i++){
    const seg=T.limb(w,ln,th, i%2?green:lt, i===0?0.90:ln/0.90, 0);
    t.add(seg); t=seg;
    T.on(seg,T.box(0.08,0.34,0.16,dark), 0, ln*0.5, th*0.58);   /* the crest runs on */
    w*=0.82; ln*=0.90; th*=0.84;
  }

  /* ---- THE FEET ---- splayed out sideways with five long toes apiece */
  T.legs4(g,0.42,0.55,0.62,lt,0.20);
  for(const L of (g.userData.legs||[])){
    L.rotation.z=(L.position.x>0?-0.65:0.65);
    const shin=L.userData.knee; if(!shin) continue;
    T.on(shin,T.box(0.28,0.08,0.28,pale), 0,-0.30,0.08);
    for(let k=0;k<5;k++){
      const toe=T.box(0.05,0.05,0.24,pale);
      toe.position.set((k-2)*0.09,-0.31,0.28); toe.rotation.y=(k-2)*0.24;
      shin.add(toe); }
  }

  g.userData.head=head;
  g.userData.jaw=jaw;
  g.userData.tail=tail;
  return g;
}});
