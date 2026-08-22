/* THE OX — the beast that pulls the plough in every village on this earth,
   and it was eleven boxes.

   What an ox is, and what tells it from the cow it stands beside: the YOKE
   BOSS, the great slab of muscle over the neck and withers that a working ox
   carries and a milk cow does not; the horns sweeping WIDE and forward rather
   than up; the massive dewlap; the short thick neck; the heavy square head;
   the deep straight back and the immense shoulder; the poll of curled hair
   between the horns; no udder.

   Sixty-odd parts, drawn in thirteen meshes.

   Built nose toward +z, feet at y=0. */
EARTH.beast({
name:'ox',
realm:'land',
metres:1.5,
build:function(T){
  const g=T.group();
  const hide=0x5a4436, dark=0x3a2a1e, deep=0x4a3628, muz=0xc8bcae,
        horn=0xe8e0d0, hoof=0x231c16, curl=0x2c2018;

  /* ---- THE BODY ---- immense at the shoulder, deep and straight-backed */
  const fore=T.box(3.55,3.40,2.40,hide); fore.position.set(0,4.90, 2.05); g.add(fore);
  const mid =T.box(3.45,3.20,2.60,hide); mid .position.set(0,4.75,-0.55); g.add(mid);
  const hind=T.box(3.05,2.90,2.20,hide); hind.position.set(0,4.70,-3.05); g.add(hind);
  const croup=T.box(2.70,2.70,1.00,hide); croup.position.set(0,4.75,-4.30); g.add(croup);
  /* ---- THE YOKE BOSS ---- the working ox's own mark, three courses of it */
  T.on(g,T.box(2.90,0.95,2.30,deep), 0,6.90, 2.10);
  T.on(g,T.box(2.20,0.80,1.80,deep), 0,7.55, 2.00);
  T.on(g,T.box(1.30,0.55,1.10,dark), 0,8.00, 1.70);
  T.on(g,T.box(2.60,0.40,6.00,dark), 0,6.45,-1.30);          /* the spine */
  for(const s of [1,-1]){
    T.on(g,T.box(0.30,1.60,1.90,deep), s*1.74,5.60, 1.90);   /* the shoulder */
    T.on(g,T.box(0.50,0.70,0.80,hide), s*1.30,6.20,-3.00);   /* the hip bone */
  }
  /* ---- THE DEWLAP ---- and it is massive: four folds down the throat */
  for(let i=0;i<4;i++) T.on(g,T.box(1.10-i*0.14,0.85,0.55,hide),
                            0, 4.55-i*0.62, 3.35-i*0.16).rotation.x=-0.20;

  /* ---- THE NECK ---- short, thick, and barely a neck at all */
  const nk=T.limb(2.10,1.50,2.00,hide,0,0.95); nk.position.set(0,5.65,2.90); g.add(nk);

  /* ---- THE HEAD ---- square and heavy */
  const head=T.box(2.00,2.05,2.00,hide); head.position.set(0,6.05,4.95); g.add(head);
  const H=(m,x,y,z)=>{ m.position.set(x,y,z); head.add(m); return m; };
  H(T.box(1.85,0.45,0.85,dark),   0, 1.05,-0.30);            /* the poll */
  for(let i=0;i<5;i++) H(T.box(0.30,0.26,0.28,curl), (i-2)*0.34, 1.30,-0.30);  /* curled hair */
  H(T.box(1.35,0.85,0.55,muz),    0,-0.55, 1.00);            /* the muzzle */
  for(const s of [1,-1]) H(T.box(0.28,0.28,0.16,0x50403a), s*0.36,-0.45,1.26);
  const jaw=T.box(1.15,0.50,1.00,muz); jaw.geometry.translate(0,0,0.50);
  H(jaw, 0,-0.90, 0.35);
  for(const s of [1,-1]){
    H(T.box(0.36,0.36,0.20,0x120c08), s*0.72, 0.28, 0.70);
    H(T.box(0.14,0.10,0.08,0xcfc4b4), s*0.76, 0.36, 0.76);
    /* ---- THE HORN ---- OUT and FORWARD, in three, and it is the ox's own
       line: the cow's go out and up. */
    const h1=T.limb(0.52,1.30,0.52,horn,0,0.10,s*1.42); h1.position.set(s*0.85,0.85,-0.25);
    head.add(h1);
    const h2=T.limb(0.42,1.10,0.42,horn,1.30,0.50,s*-0.42); h1.add(h2);
    h2.add(T.limb(0.30,0.80,0.30,horn,1.10,0.50,s*-0.34));
  }
  const ears=[];
  for(const s of [1,-1]){
    const e=T.box(0.80,0.36,0.52,hide); e.geometry.translate(s*0.40,0,0);
    e.position.set(s*0.92,0.42,-0.35); e.rotation.z=s*-0.22; e.rotation.y=s*0.40;
    head.add(e); ears.push(e);
    T.on(e,T.box(0.52,0.14,0.32,muz), s*0.44,-0.14,0.02);
  }

  /* ---- THE TAIL ---- long, with a heavy black switch */
  const tail=T.limb(0.36,1.40,0.36,hide,0,2.90); tail.position.set(0,5.65,-4.85); g.add(tail);
  const t2=T.limb(0.30,1.20,0.30,hide,1.40,0.12); tail.add(t2);
  t2.add(T.limb(0.46,0.90,0.42,dark,1.20,0));

  /* ---- THE LEGS ---- short, thick, and cloven */
  T.legs4(g,1.30,2.35,2.75,hide,0.90);
  for(const L of (g.userData.legs||[])){
    const shin=L.userData.knee; if(!shin) continue;
    T.on(shin,T.box(0.72,0.60,0.72,dark), 0,-1.05,0);
    for(const c of [1,-1]) T.on(shin,T.box(0.32,0.44,0.62,hoof), c*0.18,-1.48,0.05);
  }

  g.userData.head=head;
  g.userData.jaw=jaw;
  g.userData.tail=tail;
  g.userData.ears=ears;
  return g;
}});
