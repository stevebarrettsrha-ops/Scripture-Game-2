/* THE DONKEY — thirty-five lands name it, and it carried the loads of all of
   them as nine boxes with two long ears.

   What a donkey is, and what tells it from the horse it was built out of: the
   EARS, which are half again the length of a horse's and are the whole
   silhouette; the upright brush of a mane that does not fall over; the cross
   — the dark stripe down the spine and the bar across the withers, which is
   the marking every grey donkey on this earth carries; the pale muzzle,
   eye-rings and belly; the tuft-ended tail of an ox rather than the fall of a
   horse's; the big head on a short thick neck; the neat upright hooves.

   Sixty-one parts, fourteen meshes.

   Built nose toward +z, feet at y=0. */
EARTH.beast({
name:'donkey',
realm:'land',
metres:1.25,
build:function(T){
  const g=T.group();
  const grey=0x9a938a, dark=0x4f4842, pale=0xd8d2c8, mane=0x5a534a,
        hoof=0x2e2a24;

  /* ---- THE BODY ---- straight-backed, round-barrelled, short-coupled */
  const chest =T.box(1.85,2.30,1.75,grey); chest .position.set(0,4.05, 1.45); g.add(chest);
  const barrel=T.box(1.95,2.20,2.00,grey); barrel.position.set(0,3.95,-0.50); g.add(barrel);
  const loin  =T.box(1.70,1.95,1.70,grey); loin  .position.set(0,4.00,-2.20); g.add(loin);
  const croup =T.box(1.55,1.75,0.85,grey); croup .position.set(0,4.10,-3.35); g.add(croup);
  T.on(g,T.box(1.70,0.60,4.20,pale), 0,2.90,-0.55);          /* the pale belly */
  /* ---- THE CROSS ---- the stripe down the spine and the bar over the
     withers. Every grey donkey wears it, and nothing else on this earth does. */
  T.on(g,T.box(0.34,0.34,5.90,dark), 0,5.02,-0.60);
  T.on(g,T.box(2.02,0.30,0.46,dark), 0,4.92, 1.30);
  for(const s of [1,-1]) T.on(g,T.box(0.26,1.30,0.46,dark), s*0.90,4.30,1.30).rotation.z=s*0.24;

  /* ---- THE NECK ---- short and thick, and the mane stands UP off it */
  const nk=T.limb(1.15,1.65,1.25,grey,0,0.52); nk.position.set(0,4.70,1.70); g.add(nk);
  for(let i=0;i<6;i++) T.on(nk,T.box(0.26,0.46+((i*3)%3)*0.12,0.30,mane), 0,0.28+i*0.25,-0.22-i*0.05);

  /* ---- THE HEAD ---- big, long, and pale about the muzzle and the eye */
  const head=T.box(0.92,1.05,1.85,grey); head.position.set(0,6.10,2.95); g.add(head);
  const H=(m,x,y,z)=>{ m.position.set(x,y,z); head.add(m); return m; };
  H(T.box(0.94,0.30,0.70,dark),   0, 0.62,-0.35);            /* the poll */
  H(T.box(0.78,0.70,0.55,pale),   0,-0.26, 1.10);            /* the pale muzzle */
  for(const s of [1,-1]) H(T.box(0.14,0.18,0.12,0x3a332c), s*0.22,-0.14,1.36);
  const jaw=T.box(0.66,0.36,0.90,pale); jaw.geometry.translate(0,0,0.45);
  H(jaw, 0,-0.62, 0.42);
  for(const s of [1,-1]){
    H(T.box(0.46,0.42,0.24,pale),    s*0.44, 0.22, 0.44);    /* the pale eye-ring */
    H(T.box(0.26,0.26,0.16,0x120c08),s*0.48, 0.22, 0.55);
  }
  /* ---- THE EARS ---- and they are the animal. Two lengths apiece, so the
     tip leans out, and pale within. The engine flicks them. */
  const ears=[];
  for(const s of [1,-1]){
    const e=T.limb(0.32,0.90,0.42,grey,0,-0.12,-s*0.22);
    e.position.set(s*0.30,0.50,-0.55); head.add(e); ears.push(e);
    const e2=T.limb(0.28,0.75,0.36,grey,0.90,0,-s*0.20); e.add(e2);
    T.on(e2,T.box(0.15,0.52,0.20,pale), 0,0.38,0.13);
    T.on(e,T.box(0.17,0.58,0.22,pale), 0,0.42,0.15);
    T.on(e2,T.box(0.30,0.20,0.36,dark), 0,0.70,0);           /* the black tip */
  }

  /* ---- THE TAIL ---- a bare stem with a tuft on the end, not a fall */
  const tail=T.limb(0.28,1.20,0.28,grey,0,2.75); tail.position.set(0,4.85,-3.70); g.add(tail);
  tail.add(T.limb(0.40,0.95,0.34,dark,1.20,0.10));

  /* ---- THE LEGS ---- short, hard, and the hoof is upright and neat */
  T.legs4(g,0.72,1.45,3.00,grey,0.58);
  for(const L of (g.userData.legs||[])){
    const shin=L.userData.knee; if(!shin) continue;
    T.on(shin,T.box(0.48,0.85,0.48,dark), 0,-1.05,0);        /* the dark cannon */
    T.on(shin,T.box(0.58,0.42,0.60,hoof), 0,-1.62,0.04);
  }

  g.userData.head=head;
  g.userData.jaw=jaw;
  g.userData.tail=tail;
  g.userData.ears=ears;
  return g;
}});
