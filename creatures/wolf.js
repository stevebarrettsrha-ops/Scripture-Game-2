/* THE WOLF — thirty-seven lands name it, and it hunted across all of them as
   sixteen boxes: a body, a head, a snout, a nose, two eyes, two ears, a tail
   and eight legs, all one flat grey.

   A wolf is a SILHOUETTE before it is anything else — that is how it is known
   at dusk across a clearing, and every line of that silhouette was missing:
   the ruff standing out behind the ears and along the throat, which is half
   the width of the animal seen from the front; the deep narrow chest and the
   tucked belly behind it; the low head carried level with the back, not above
   it, which is what tells a wolf from a dog at any distance; the long jaw
   that opens; the brush of the tail, carried straight out and never curled.

   And the coat is not one grey. It is a dark saddle over the shoulders and
   back, going pale down the flanks and cream at the throat, belly and the
   inside of the legs — which is the countershading of Round 51 done in the
   file, over the top of the countershading the engine grades in.

   Fifty-eight parts, welding to fourteen meshes.

   Built nose toward +z, feet at y=0. */
EARTH.beast({
name:'wolf',
realm:'land',
metres:0.8,
build:function(T){
  const g=T.group();
  const grey=0x8a8f96, dark=0x4c5158, pale=0xc3bdb1, cream=0xe0d8c8,
        muz=0x6a6f76, pad=0x2b2822;

  /* ---- THE BODY ---- deep and narrow at the chest, tucked at the loin.
     A wolf is a wedge seen from above and a wedge seen from the side. */
  const chest =T.box(1.55,1.85,1.45,grey); chest .position.set(0,2.55, 1.05); g.add(chest);
  const barrel=T.box(1.45,1.60,1.50,grey); barrel.position.set(0,2.45,-0.35); g.add(barrel);
  const loin  =T.box(1.20,1.30,1.15,grey); loin  .position.set(0,2.50,-1.50); g.add(loin);
  const croup =T.box(1.15,1.20,0.65,grey); croup .position.set(0,2.65,-2.10); g.add(croup);
  /* THE SADDLE — dark over the shoulders and along the spine, and it comes
     over the top and down both flanks in one piece, so its edge is an edge */
  T.on(g,T.box(1.62,0.90,2.10,dark), 0,3.05, 0.55);
  T.on(g,T.box(1.30,0.70,1.75,dark), 0,3.00,-1.25);
  T.on(g,T.box(1.50,0.60,3.50,pale), 0,2.05,-0.30);          /* pale down the flank */
  T.on(g,T.box(1.10,0.45,3.10,cream),0,1.82,-0.35);          /* cream underneath */

  /* ---- THE RUFF ---- eight locks standing out behind the ears and down the
     throat. This is the wolf's width, and a wolf without it is a dog. */
  for(const s of [1,-1]) for(let i=0;i<5;i++){
    const ln=0.70+(i%3)*0.26;
    const lock=T.box(0.24,ln,0.46, i%2?dark:grey);
    lock.position.set(s*(0.74+(i%2)*0.06), 3.30-i*0.34, 1.70-i*0.10);
    lock.rotation.z=s*0.38; lock.rotation.x=-0.18; g.add(lock); }
  /* and two over the top of the shoulder, so the ruff shows from every side */
  for(const s of [1,-1]) T.on(g,T.box(0.44,0.60,0.50,dark), s*0.34,3.55,1.35).rotation.z=s*0.25;
  T.on(g,T.box(0.85,0.75,0.55,cream), 0,2.45,1.95);          /* the cream throat */

  /* ---- THE NECK ---- short, thick, and carried LEVEL: the head does not
     stand above the back as a dog's does */
  const nk=T.limb(0.95,0.95,1.00,grey,0,0.95); nk.position.set(0,3.05,1.45); g.add(nk);

  /* ---- THE HEAD ---- */
  const head=T.box(1.05,1.00,1.15,grey); head.position.set(0,3.20,2.55); g.add(head);
  const H=(m,x,y,z)=>{ m.position.set(x,y,z); head.add(m); return m; };
  H(T.box(1.00,0.30,0.60,dark),   0, 0.42,-0.20);            /* the dark crown */
  H(T.box(0.55,0.48,0.85,muz),    0,-0.14, 0.90);            /* the long snout */
  H(T.box(0.42,0.30,0.36,pale),   0,-0.34, 0.95);            /* the pale under-jaw line */
  H(T.box(0.30,0.22,0.16,0x14100c),0,-0.06, 1.36);           /* the nose */
  /* the jaw hinges at the back and opens the whole length of the snout */
  const jaw=T.box(0.44,0.24,0.80,muz); jaw.geometry.translate(0,0,0.40);
  H(jaw, 0,-0.42, 0.42);
  for(const s of [1,-1]){
    /* the eye is amber, set forward and close: a hunter looks along its nose */
    H(T.box(0.22,0.20,0.14,0xd9c93f), s*0.30, 0.12, 0.52);
    H(T.box(0.09,0.11,0.08,0x120c08), s*0.30, 0.12, 0.59);
    H(T.box(0.26,0.18,0.20,cream),    s*0.30,-0.02, 0.58);   /* the pale eyebrow spot */
  }
  /* ---- THE EARS ---- short, thick, rounded, carried forward, and they move */
  const ears=[];
  for(const s of [1,-1]){
    const e=T.box(0.36,0.52,0.30,grey); e.geometry.translate(0,0.26,0);
    e.position.set(s*0.34,0.46,-0.15); e.rotation.z=s*0.20; e.rotation.x=-0.12;
    head.add(e); ears.push(e);
    T.on(e,T.box(0.20,0.34,0.14,pale), 0,0.24,0.10);
  }

  /* ---- THE BRUSH ---- carried straight out behind, and never over the back */
  const tail=T.limb(0.44,0.70,0.44,grey,0,-1.20);
  tail.position.set(0,2.75,-2.50); g.add(tail);
  const t2=T.limb(0.48,0.62,0.48,grey,0.70,-0.25); tail.add(t2);
  t2.add(T.limb(0.34,0.42,0.34,dark,0.62,-0.20));

  /* ---- THE LEGS ---- long, straight, close together, cream inside, and the
     foot is a pad with four toes on it */
  T.legs4(g,0.52,1.10,2.45,grey,0.42);
  for(const L of (g.userData.legs||[])){
    const shin=L.userData.knee; if(!shin) continue;
    T.on(shin,T.box(0.36,0.80,0.36,pale), 0,-0.72,0);
    T.on(shin,T.box(0.42,0.22,0.58,pad),  0,-1.12,0.10);     /* the pad */
    for(let t=0;t<3;t++) T.on(shin,T.box(0.11,0.14,0.16,pad), (t-1)*0.13,-1.16,0.36);
  }

  g.userData.head=head;
  g.userData.jaw=jaw;
  g.userData.tail=tail;
  g.userData.ears=ears;
  return g;
}});
