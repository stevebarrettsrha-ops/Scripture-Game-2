/* THE HORSE — and it was ten boxes with a plank for a mane.

   What a horse is: the MANE, which FALLS — a dozen locks lying over one side
   of the crest, not a slab standing on it; the TAIL, which falls too, and in
   strands; the long sloping shoulder and the arch of the neck; the jaw
   standing round at the cheek; the mobile ears; the blaze down the face and
   the white socks; the hard single hoof with the fetlock tuft above it; the
   deep girth and the drawn-up flank.

   Seventy-odd parts, drawn in fourteen meshes.

   Built nose toward +z, feet at y=0. */
EARTH.beast({
name:'horse',
realm:'land',
metres:1.6,
build:function(T){
  const g=T.group();
  const bay=0x6a4a2e, dark=0x4a3320, deep=0x573c25, hair=0x2e2018,
        white=0xe8e0d0, muz=0x3a2a1a, hoof=0x2a2420;

  /* ---- THE BODY ---- deep at the girth, drawn up at the flank */
  const chest =T.box(2.30,3.10,2.45,bay); chest .position.set(0,5.05, 2.05); g.add(chest);
  const barrel=T.box(2.40,2.95,2.70,bay); barrel.position.set(0,4.95,-0.55); g.add(barrel);
  const loin  =T.box(2.05,2.45,2.30,bay); loin  .position.set(0,5.10,-3.05); g.add(loin);
  const croup =T.box(2.00,2.30,1.30,bay); croup .position.set(0,5.20,-4.60); g.add(croup);
  T.on(g,T.box(2.15,0.60,5.20,deep), 0,3.55,-0.90);          /* the underline */
  T.on(g,T.box(1.95,0.55,2.00,bay),  0,6.60,-4.10);          /* the croup's top */
  for(const s of [1,-1]){
    T.on(g,T.box(0.26,1.55,1.70,deep), s*1.14,5.55,1.50);    /* the sloping shoulder */
    T.on(g,T.box(0.24,1.35,1.20,deep), s*1.00,5.80,-3.70);   /* the point of the hip */
  }

  /* ---- THE NECK ---- arched: two lengths, the second standing up more */
  const n1=T.limb(1.30,2.00,1.50,bay,0,0.55); n1.position.set(0,5.85,2.30); g.add(n1);
  const n2=T.limb(1.10,1.50,1.30,bay,2.00,0.25); n1.add(n2);
  /* THE MANE FALLS. Twelve locks over ONE side of the crest, of three lengths
     — which is the whole difference between a horse's mane and a donkey's. */
  for(let i=0;i<10;i++){
    const ln=1.05+((i*7)%3)*0.48;
    const m2=T.limb(0.30,ln,0.46,i%2?hair:0x241a12,0,0.15,0.62+ (i%2)*0.14);
    m2.position.set(-0.60, 1.72-i*0.19, -0.52+i*0.03); n1.add(m2);
  }
  T.on(n1,T.box(0.46,1.55,0.40,hair), -0.22,0.95,-0.50);     /* the crest itself */

  /* ---- THE HEAD ---- long, with the round jaw at the cheek */
  const head=T.box(1.10,1.55,2.65,bay); head.position.set(0,8.05,3.70); g.add(head);
  const H=(m,x,y,z)=>{ m.position.set(x,y,z); head.add(m); return m; };
  H(T.box(1.00,0.36,0.80,dark),   0, 0.78,-0.55);            /* the poll */
  for(const s of [1,-1]) H(T.box(0.30,0.90,0.85,deep), s*0.48,-0.20,-0.55);  /* the cheek */
  H(T.box(0.80,0.70,0.55,bay),    0,-0.42, 1.20);            /* the muzzle */
  H(T.box(0.64,0.40,0.24,muz),    0,-0.52, 1.55);            /* the soft nose */
  for(const s of [1,-1]) H(T.box(0.16,0.20,0.14,0x18120c), s*0.22,-0.34,1.52);
  H(T.box(0.42,1.70,0.20,white),  0, 0.18, 1.22);            /* the blaze */
  const jaw=T.box(0.70,0.42,1.00,bay); jaw.geometry.translate(0,0,0.50);
  H(jaw, 0,-0.78, 0.52);
  for(const s of [1,-1]){
    H(T.box(0.30,0.30,0.20,0x120c08), s*0.48, 0.32, 0.55);   /* the eye */
    H(T.box(0.12,0.10,0.08,0xcbbfa8), s*0.51, 0.38, 0.62);
    H(T.box(0.36,0.16,0.28,dark),     s*0.48, 0.52, 0.56);   /* the lid */
  }
  /* the ears: small, pointed, and the engine flicks them */
  const ears=[];
  for(const s of [1,-1]){
    const e=T.limb(0.28,0.62,0.34,bay,0,-0.15,-s*0.18);
    e.position.set(s*0.34,0.72,-0.75); head.add(e); ears.push(e);
    T.on(e,T.box(0.15,0.44,0.20,dark), 0,0.32,0.10);
  }

  /* ---- THE TAIL ---- and it FALLS, in strands */
  const tail=T.limb(0.40,0.70,0.40,hair,0,-0.30); tail.position.set(0,6.20,-5.15); g.add(tail);
  for(let i=0;i<8;i++){
    const ln=2.60+T.hash(i*2.3,5.1)*1.30;
    T.on(tail,T.box(0.28,ln,0.30,i%3?hair:0x241a12),
         (i-3.5)*0.15, 0.55-ln*0.46, -0.16-(i%2)*0.14).rotation.x=-0.16; }

  /* ---- THE LEGS ---- long and hard, with white socks, a fetlock tuft and
     the single round hoof */
  T.legs4(g,0.90,2.55,3.70,bay,0.64);
  for(const L of (g.userData.legs||[])){
    const shin=L.userData.knee; if(!shin) continue;
    T.on(shin,T.box(0.50,1.10,0.50,dark),  0,-1.10,0);       /* the cannon */
    T.on(shin,T.box(0.56,0.55,0.56,white), 0,-1.72,0);       /* the sock */
    T.on(shin,T.box(0.44,0.34,0.30,white), 0,-1.82,-0.24);   /* the fetlock tuft */
    T.on(shin,T.box(0.62,0.42,0.66,hoof),  0,-2.14,0.04);
  }

  g.userData.head=head;
  g.userData.jaw=jaw;
  g.userData.tail=tail;
  g.userData.ears=ears;
  return g;
}});
