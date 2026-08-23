/* THE BLACK BEAR — smaller than the brown, and standing beside it the
   difference is not the colour at all. Both of them were the same fourteen
   boxes with a colour swapped, which is exactly the trap §2.3.4 is against:
   two beasts are not one beast in two paints.

   NO SHOULDER HUMP — the black bear's highest point is its RUMP, and the
   brown bear's is its shoulder, and that one line tells them apart at any
   distance and in any light. A STRAIGHT PROFILE from brow to nose where the
   brown is dished. TALL OVAL EARS, held up and forward, where the brown's are
   small and round and set wide. SHORT CURVED CLAWS, because this one climbs
   and the brown one digs. A TAN MUZZLE and, on many, the white blaze on the
   chest. A shorter, glossier coat that does not hang in falls off the flank.

   Sixty-six parts, twelve meshes.

   Built nose toward +z, feet at y=0. */
EARTH.beast({
name:'blackbear',
realm:'land',
metres:0.9,
build:function(T){
  const g=T.group();
  const fur=0x241f1d, sheen=0x35302c, muz=0xa08a5e, blaze=0xd9cdb4,
        claw=0x1a1512, pad=0x120f0d;

  /* ---- THE BODY ---- and it rises TOWARD THE BACK, which the brown does not */
  const fore=T.box(2.85,2.70,2.10,fur); fore.position.set(0,4.20, 1.60); g.add(fore);
  const mid =T.box(3.00,2.85,2.10,fur); mid .position.set(0,4.30,-0.40); g.add(mid);
  const hind=T.box(3.05,3.00,2.00,fur); hind.position.set(0,4.45,-2.30); g.add(hind);
  const rump=T.box(2.75,2.70,1.10,fur); rump.position.set(0,4.45,-3.45); g.add(rump);
  T.on(g,T.box(2.40,0.55,1.60,sheen), 0,5.95,-2.35);         /* the high point, over the hip */
  /* the coat is short and glossy: it is lit, not hung. Six panels of sheen
     along the top of the flank do the work the brown bear's falls do. */
  for(const s of [1,-1]) for(let i=0;i<3;i++)
    T.on(g,T.box(0.20,1.30,1.30,sheen), s*1.45, 5.05, 1.55-i*1.65);
  T.on(g,T.box(1.20,1.10,0.30,blaze), 0,4.15,2.70);          /* the white chest blaze */

  /* ---- THE HEAD ---- and the profile from brow to nose is STRAIGHT */
  const head=T.box(1.85,1.65,1.85,fur); head.position.set(0,5.05,3.50); g.add(head);
  const H=(m,x,y,z)=>{ m.position.set(x,y,z); head.add(m); return m; };
  H(T.box(1.70,0.42,1.30,fur),    0, 0.90,-0.10);            /* the low flat brow */
  H(T.box(1.30,0.90,0.70,muz),    0, 0.18, 1.10);            /* and it runs straight on */
  H(T.box(1.10,0.85,0.75,muz),    0,-0.10, 1.65);
  H(T.box(0.54,0.40,0.28,0x0e0c0a),0, 0.06, 2.10);           /* the nose */
  const jaw=T.box(0.95,0.44,0.95,muz); jaw.geometry.translate(0,0,0.47);
  H(jaw, 0,-0.62, 0.95);
  for(const s of [1,-1]){
    H(T.box(0.26,0.24,0.18,0x0e0b09), s*0.60, 0.32, 1.05);
    H(T.box(0.10,0.08,0.07,0x9a9084), s*0.63, 0.37, 1.11);
  }
  /* ---- THE EARS ---- tall ovals, held UP and forward, and they flick */
  const ears=[];
  for(const s of [1,-1]){
    const e=T.box(0.62,0.95,0.36,fur); e.geometry.translate(0,0.48,0);
    e.position.set(s*0.62,0.78,-0.35); e.rotation.z=s*0.14; e.rotation.x=-0.18;
    head.add(e); ears.push(e);
    T.on(e,T.box(0.34,0.60,0.18,sheen), 0,0.46,0.14);
  }

  const tail=T.limb(0.48,0.50,0.40,fur,0,2.60); tail.position.set(0,4.65,-3.95); g.add(tail);

  /* ---- THE LEGS ---- and the claws are SHORT AND CURVED: this one climbs */
  T.legs4(g,1.10,1.65,2.60,fur,1.05);
  for(const L of (g.userData.legs||[])){
    const shin=L.userData.knee; if(!shin) continue;
    T.on(shin,T.box(1.10,0.40,1.30,pad), 0,-1.15,0.20);
    for(let t=0;t<5;t++){
      T.on(shin,T.box(0.19,0.22,0.22,fur), (t-2)*0.22,-1.13,0.78);
      T.on(shin,T.box(0.13,0.20,0.16,claw),(t-2)*0.22,-1.20,0.92).rotation.x=-0.85; }
  }

  g.userData.head=head;
  g.userData.jaw=jaw;
  g.userData.tail=tail;
  g.userData.ears=ears;
  return g;
}});
