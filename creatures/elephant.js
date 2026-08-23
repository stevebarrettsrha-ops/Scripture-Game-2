/* THE ELEPHANT — thirty-six lands name it, and the greatest beast that walks
   this earth was fourteen boxes: a body, a head, a trunk, two eyes, a tail,
   two ears, two tusks and eight leg meshes. That is the whole animal.

   What an elephant is: the TRUNK, which is not a post but seven tapering
   lengths curling down and under, with the two fingers at the tip of it; the
   DOMED SKULL with the hollow above each eye; the ears, which are the size of
   doors and are its shape from every angle; the tusks curving OUT and UP and
   in again; the sway back between shoulder and hip; the columnar legs with
   five toenails apiece; the wrinkled folds of the hide.

   The trunk and the tusks hang on the HEAD, so they swing with it — and are
   welded into it, so they cost nothing. The ears keep their own meshes,
   because the engine fans them.

   Ninety-one parts, and it is drawn in thirteen meshes.

   Built nose toward +z, feet at y=0. */
EARTH.beast({
name:'elephant',
realm:'land',
metres:3.2,
build:function(T){
  const g=T.group();
  const hide=0x8f8f96, dark=0x6b6b73, deep=0x55555c, pale=0xa3a3aa,
        ivory=0xefe8d8, nail=0xd8d4c8;

  /* ---- THE BODY ---- highest at the shoulder, swaybacked, and highest again
     over the hip: three lengths and the line between them is the animal */
  const fore=T.box(4.10,4.30,2.80,hide); fore.position.set(0,6.30, 2.20); g.add(fore);
  const mid =T.box(4.30,4.05,2.90,hide); mid .position.set(0,6.05,-0.40); g.add(mid);
  const hind=T.box(4.20,4.25,2.70,hide); hind.position.set(0,6.20,-3.00); g.add(hind);
  T.on(g,T.box(3.60,0.70,2.20,dark), 0,8.55, 2.30);          /* the shoulder */
  T.on(g,T.box(3.40,0.65,1.90,dark), 0,8.40,-3.10);          /* the hip */
  T.on(g,T.box(3.90,0.90,1.60,pale), 0,4.15,-0.40);          /* the pale belly */
  /* ---- THE WRINKLES ---- ten folds across the flank, which is what makes a
     grey wall read as an animal's hide */
  for(const s of [1,-1]) for(let i=0;i<5;i++)
    T.on(g,T.box(0.16,3.00,0.34,deep), s*2.12, 6.10, 2.90-i*1.45).rotation.x=(i-2)*0.05;
  T.on(g,T.box(3.20,0.30,0.30,deep), 0,7.90, 3.55);          /* a fold at the chest */

  /* ---- THE HEAD ---- domed, hollow above the eye, and it carries everything */
  const head=T.box(3.00,2.70,2.40,hide); head.position.set(0,7.60,4.60); g.add(head);
  const H=(m,x,y,z)=>{ m.position.set(x,y,z); head.add(m); return m; };
  H(T.box(2.30,0.90,1.90,hide),   0, 1.60,-0.10);            /* the dome */
  H(T.box(1.10,0.55,1.30,hide),   0, 2.20,-0.10);            /* and the crown of it */
  for(const s of [1,-1]){
    H(T.box(0.75,0.50,0.55,deep), s*0.95, 0.55, 1.05);       /* the hollow above the eye */
    H(T.box(0.34,0.32,0.20,0x241c14), s*0.98, 0.20, 1.24);   /* the eye */
    H(T.box(0.12,0.10,0.09,0xcdb98a), s*1.02, 0.26, 1.31);
  }
  /* ---- THE TUSKS ---- out, then up, then in: three lengths apiece */
  for(const s of [1,-1]){
    const t1=T.limb(0.44,1.30,0.44,ivory,0,1.45,s*0.30);
    t1.position.set(s*0.85,-0.95,0.95); head.add(t1);
    const t2=T.limb(0.38,1.10,0.38,ivory,1.30,-0.55,s*0.20); t1.add(t2);
    t2.add(T.limb(0.28,0.85,0.28,ivory,1.10,-0.60,s*-0.25));
  }
  /* ---- THE TRUNK ---- seven lengths, each shorter and thinner and each
     curling a little further under, and two fingers at the end of it */
  let tr=head, y0=-1.20, first=true;
  for(let i=0;i<7;i++){
    const w=1.10-i*0.10, h=0.95-i*0.05;
    const seg=T.limb(w,h,w,i%2?dark:hide, first?0:(0.95-(i-1)*0.05), first?0:0.15, 0);
    if(first){ seg.position.set(0,y0,1.15); seg.rotation.x=2.35; first=false; }
    tr.add(seg); tr=seg;
  }
  T.on(tr,T.box(0.22,0.26,0.16,pale), -0.10,0.62,0.10);      /* the two fingers */
  T.on(tr,T.box(0.20,0.20,0.14,pale),  0.11,0.60,0.10);

  /* ---- THE EARS ---- the size of doors, and the engine fans them */
  const ears=[];
  for(const s of [1,-1]){
    /* the ear hangs from the top of the skull and FANS OUT AND BACK. Laid
       flat along the head it disappears inside the shoulder, which is where
       the first cut of it went; hung at three-quarters it is the animal. */
    const e=T.box(0.36,4.10,2.70,dark); e.geometry.translate(s*0.18,-1.85,-0.40);
    e.position.set(s*1.58,1.45,0.35); e.rotation.y=s*0.50; e.rotation.z=s*-0.16;
    head.add(e); ears.push(e);
    T.on(e,T.box(0.20,3.10,1.90,pale), s*0.30,-1.80,-0.40);  /* the pale inner */
    T.on(e,T.box(0.28,0.95,0.80,dark), s*0.22,-3.55,-1.05);  /* the ragged lobe */
  }

  /* ---- THE TAIL ---- thin, long, and a brush of black bristle on the end */
  const tail=T.limb(0.34,1.40,0.34,dark,0,3.05); tail.position.set(0,7.60,-4.40); g.add(tail);
  const t2=T.limb(0.30,1.20,0.30,dark,1.40,0.12); tail.add(t2);
  t2.add(T.limb(0.40,0.85,0.28,0x201c18,1.20,0));

  /* ---- THE COLUMNAR LEGS ---- and five toenails on every foot */
  T.legs4(g,1.55,2.55,4.60,hide,1.55);
  for(const L of (g.userData.legs||[])){
    const shin=L.userData.knee; if(!shin) continue;
    T.on(shin,T.box(1.75,0.55,1.75,dark), 0,-2.05,0);        /* the foot pad */
    for(let t=0;t<5;t++)
      T.on(shin,T.box(0.22,0.22,0.18,nail), (t-2)*0.31,-2.10,0.86);
  }

  g.userData.head=head;
  g.userData.tail=tail;
  g.userData.ears=ears;
  return g;
}});
