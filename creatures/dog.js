/* THE DOG — in every village on this earth, and it was eleven boxes.

   What a dog is, and what tells it from the wolf in the wood beyond the
   fence: the head carried ABOVE the line of the back, not level with it; the
   short broad muzzle stopped sharply under the brow, where a wolf's runs
   straight out; the tail carried UP AND OVER, curling toward the back, which
   no wolf's ever does; the ears folded over at the tip; the white blaze,
   chest and paws of a village dog; the shorter leg and the deeper, rounder
   chest; and no ruff at all.

   Fifty-four parts, drawn in fourteen meshes.

   Built nose toward +z, feet at y=0. */
EARTH.beast({
name:'dog',
realm:'land',
metres:0.6,
build:function(T){
  const g=T.group();
  const tan=0xb98a52, deep=0x8a6238, dark=0x5f4325, white=0xe8e2d4,
        nose=0x14100c, pad=0x2b2119;

  /* ---- THE BODY ---- round-chested and short-coupled */
  const chest =T.box(1.55,1.60,1.30,tan); chest .position.set(0,2.35, 0.95); g.add(chest);
  const barrel=T.box(1.45,1.45,1.20,tan); barrel.position.set(0,2.30,-0.35); g.add(barrel);
  const loin  =T.box(1.20,1.20,1.05,tan); loin  .position.set(0,2.35,-1.45); g.add(loin);
  const croup =T.box(1.15,1.15,0.60,tan); croup .position.set(0,2.45,-2.05); g.add(croup);
  T.on(g,T.box(1.20,0.42,2.60,white), 0,1.72,-0.30);         /* the white underside */
  T.on(g,T.box(0.95,0.90,0.30,white), 0,2.20, 1.62);         /* the white chest */
  T.on(g,T.box(1.30,0.55,1.70,deep),  0,3.05, 0.30);         /* the saddle */

  /* ---- THE NECK ---- and the head stands ABOVE the back, not level */
  const nk=T.limb(0.92,1.10,0.95,tan,0,0.35); nk.position.set(0,2.95,1.20); g.add(nk);

  /* ---- THE HEAD ---- and the muzzle STOPS under the brow */
  const head=T.box(1.05,1.00,1.00,tan); head.position.set(0,4.00,1.75); g.add(head);
  const H=(m,x,y,z)=>{ m.position.set(x,y,z); head.add(m); return m; };
  H(T.box(1.00,0.34,0.60,deep),   0, 0.42,-0.18);            /* the brow */
  H(T.box(0.52,0.44,0.70,deep),   0,-0.16, 0.78);            /* the short broad muzzle */
  H(T.box(0.36,0.60,0.18,white),  0, 0.20, 0.55);            /* the blaze */
  H(T.box(0.26,0.18,0.14,nose),   0,-0.06, 1.16);
  const jaw=T.box(0.42,0.22,0.64,white); jaw.geometry.translate(0,0,0.32);
  H(jaw, 0,-0.40, 0.36);
  for(const s of [1,-1]){
    H(T.box(0.20,0.20,0.14,0x2a1c10), s*0.30, 0.14, 0.44);   /* the brown eye */
    H(T.box(0.08,0.09,0.07,0x0e0a06), s*0.31, 0.14, 0.50);
    H(T.box(0.24,0.14,0.18,deep),     s*0.30, 0.28, 0.46);
  }
  /* ---- THE EARS ---- up, then FOLDED OVER at the tip */
  const ears=[];
  for(const s of [1,-1]){
    const e=T.limb(0.34,0.44,0.24,tan,0,-0.10,-s*0.20);
    e.position.set(s*0.36,0.44,-0.10); head.add(e); ears.push(e);
    e.add(T.limb(0.32,0.40,0.22,deep,0.44,1.15,0));          /* and it flops */
  }

  /* ---- THE TAIL ---- UP AND OVER, curling toward the back. A wolf's never
     does this, and it is the surest thing to look at across a field. */
  const tail=T.limb(0.34,0.62,0.34,tan,0,-0.55); tail.position.set(0,2.75,-2.35); g.add(tail);
  const t2=T.limb(0.32,0.58,0.32,tan,0.62,-0.75); tail.add(t2);
  const t3=T.limb(0.30,0.54,0.30,tan,0.58,-0.80); t2.add(t3);
  t3.add(T.limb(0.26,0.44,0.26,white,0.54,-0.70));

  /* ---- THE LEGS ---- short, with white paws */
  T.legs4(g,0.48,0.90,1.65,tan,0.38);
  for(const L of (g.userData.legs||[])){
    const shin=L.userData.knee; if(!shin) continue;
    T.on(shin,T.box(0.36,0.42,0.36,white), 0,-0.62,0);
    T.on(shin,T.box(0.40,0.20,0.48,pad),   0,-0.82,0.10);
    for(let k=0;k<3;k++) T.on(shin,T.box(0.11,0.13,0.14,white), (k-1)*0.12,-0.84,0.32);
  }

  g.userData.head=head;
  g.userData.jaw=jaw;
  g.userData.tail=tail;
  g.userData.ears=ears;
  return g;
}});
