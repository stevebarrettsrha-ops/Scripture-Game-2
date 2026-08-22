/* THE PIG — in the pens of every village, and it was ten boxes.

   What a pig is: the SNOUT, a flat disc on the end of a blunt cylinder with
   two round nostrils in it, which is the whole face; the great flopping ears
   that fall FORWARD over the eyes, so that a pig sees the ground and little
   else; the deep barrel carried low on short legs; the ridge of coarse
   bristle along the spine; the CLOVEN TROTTER with the two dew-claws behind
   it; the curled tail, which is a spiral and not a stub; the jowl; the sparse
   hair over a pink hide.

   Fifty-eight parts, drawn in fourteen meshes.

   Built nose toward +z, feet at y=0. */
EARTH.beast({
name:'pig',
realm:'land',
metres:0.75,
build:function(T){
  const g=T.group();
  const pink=0xefa2a2, deep=0xdf9494, dark=0xc87878, snout=0xe58a8a,
        bristle=0xb08a86, trot=0x4a3a36;

  /* ---- THE BODY ---- deep, low, and widest at the shoulder */
  const chest =T.box(2.60,2.35,1.80,pink); chest .position.set(0,3.05, 1.20); g.add(chest);
  const barrel=T.box(2.70,2.30,1.90,pink); barrel.position.set(0,2.95,-0.60); g.add(barrel);
  const ham   =T.box(2.55,2.35,1.60,pink); ham   .position.set(0,3.00,-2.15); g.add(ham);
  T.on(g,T.box(2.30,0.55,4.20,deep), 0,1.90,-0.50);          /* the low belly */
  for(const s of [1,-1]) for(const z of [-1.10,-2.30])
    T.on(g,T.box(0.20,0.30,0.20,dark), s*0.60,1.66,z);       /* the teats */
  /* ---- THE BRISTLE ---- a ridge of coarse hair along the whole spine */
  for(let i=0;i<10;i++) T.on(g,T.box(0.14,0.34+((i*7)%3)*0.14,0.22,bristle),
                             (i%2?0.10:-0.10), 4.25, 1.90-i*0.44);

  /* ---- THE HEAD ---- a wedge with no neck to speak of */
  const head=T.box(1.60,1.65,1.60,pink); head.position.set(0,2.95,3.10); g.add(head);
  const H=(m,x,y,z)=>{ m.position.set(x,y,z); head.add(m); return m; };
  for(const s of [1,-1]) H(T.box(0.55,0.85,0.70,deep), s*0.72,-0.55, 0.30);  /* the jowls */
  /* ---- THE SNOUT ---- a cylinder with a flat disc on the end of it */
  H(T.box(0.95,0.80,1.05,snout),  0,-0.18, 1.05);
  H(T.box(0.88,0.76,0.16,dark),   0,-0.18, 1.62);            /* the flat disc */
  for(const s of [1,-1]) H(T.box(0.18,0.22,0.10,0x8a5050), s*0.22,-0.18,1.70);
  const jaw=T.box(0.80,0.34,0.80,deep); jaw.geometry.translate(0,0,0.40);
  H(jaw, 0,-0.72, 0.42);
  for(const s of [1,-1]){
    H(T.box(0.24,0.20,0.16,0x2a1e1c), s*0.56, 0.32, 0.62);   /* the small eye */
    H(T.box(0.34,0.12,0.22,dark),     s*0.56, 0.46, 0.60);   /* the lash */
  }
  /* ---- THE EARS ---- and they FALL FORWARD over the eyes */
  const ears=[];
  for(const s of [1,-1]){
    const e=T.limb(0.72,1.05,0.30,deep,0,2.05,-s*0.30);
    e.position.set(s*0.55,0.90,0.35); head.add(e); ears.push(e);
    T.on(e,T.box(0.50,0.70,0.14,dark), 0,0.55,-0.14);
  }

  /* ---- THE TAIL ---- and it is a SPIRAL: five short lengths, each turned
     further, which is the one thing everybody draws and nobody builds */
  const tail=T.limb(0.28,0.55,0.28,pink,0,-1.10); tail.position.set(0,3.65,-2.90); g.add(tail);
  let t=tail;
  for(let i=0;i<4;i++){
    const seg=T.limb(0.26-i*0.02,0.50,0.26-i*0.02,i%2?pink:deep,0.53-i*0.01,1.05,0.65);
    t.add(seg); t=seg;
  }

  /* ---- THE LEGS ---- short, and the trotter is cloven with two dew-claws */
  T.legs4(g,0.92,1.35,1.70,pink,0.62);
  for(const L of (g.userData.legs||[])){
    const shin=L.userData.knee; if(!shin) continue;
    T.on(shin,T.box(0.50,0.42,0.50,dark), 0,-0.62,0);
    for(const c of [1,-1]) T.on(shin,T.box(0.24,0.40,0.50,trot), c*0.14,-0.98,0.06);
    for(const c of [1,-1]) T.on(shin,T.box(0.14,0.22,0.16,trot), c*0.22,-0.72,-0.24);  /* dew-claws */
  }

  g.userData.head=head;
  g.userData.jaw=jaw;
  g.userData.tail=tail;
  g.userData.ears=ears;
  return g;
}});
