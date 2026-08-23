/* THE GOAT — named by ninety-eight of the hundred and seventy-six lands, which
   makes it the commonest beast on this earth by a long way, and until now it
   was seventeen boxes hand-written inside the engine.

   What makes a goat a goat, and none of it was there: the RIBBED HORNS swept
   back over the neck in three tapering lengths; the SLOTTED PUPIL, a bar and
   not a dot, which is the eeriest thing about the animal and unmistakable
   close to; the beard; the short tail carried UP where a sheep's hangs down;
   the high withers and the straight back; the cloven hoof; and the shaggy
   hang of the flank, twelve locks of four lengths. §2.3.4 asks thirty to
   sixty parts where there were twelve to fifteen: this is fifty-two.

   AND THE WHOLE FACE IS HUNG ON THE HEAD, not on the beast. That is not
   tidiness. The engine turns `userData.head` when a beast grazes or grooms,
   and the old goat's head turned and left its own eyes behind. Hung on the
   head the face turns with it AND costs nothing — a part that does not move
   against the part it hangs from is welded into it, so the whole of this
   comes to twelve meshes where the seventeen-box goat came to ten.

   Built nose toward +z, feet at y=0. js/size.js gives it its true stature
   (0.9 m), so the numbers here need only be in proportion with each other —
   but the measure is the beast's whole HEIGHT, horns and all, so a horn that
   rises is a horn that shrinks the goat under it. These sweep back. */
EARTH.beast({
name:'goat',
realm:'land',
metres:0.9,
build:function(T){
  const g=T.group();
  /* A goat is not a white sheep. The commonest hide across these lands is a
     warm brown going near black in the shag of the flank, with the cream kept
     for the muzzle, the belly and the beard — which is also what makes it
     read as a DIFFERENT beast from the sheep at fifty paces. */
  const hair=0x9a7a52, dark=0x4e4029, shade=0x7a5f3e,
        pale=0xc6b28c, horn=0x584a35, hoof=0x2a231b;

  /* ---- THE BARREL, AND IT IS NOT ONE BOX ----
     A goat is deep at the shoulder and light at the loin, and the line of the
     back is straight while the belly swings. Four lengths do what one could
     not, each narrower than the one in front of it, so the beast tapers from
     the chest to the tail as a living thing does. */
  const chest =T.box(2.00,2.10,1.50,hair); chest .position.set(0,3.25, 1.05); g.add(chest);
  const barrel=T.box(2.05,2.00,1.60,hair); barrel.position.set(0,3.20,-0.40); g.add(barrel);
  const loin  =T.box(1.70,1.75,1.25,hair); loin  .position.set(0,3.25,-1.55); g.add(loin);
  const croup =T.box(1.40,1.30,0.70,hair); croup .position.set(0,3.55,-2.10); g.add(croup);
  /* the withers — the hump over the shoulder that a goat has and a sheep does
     not, and the reason its back reads as a straight line from the side */
  T.on(g,T.box(1.60,0.45,1.30,hair), 0,4.30,0.70);
  /* the belly is TUCKED UP between the flanks, not slung under them, and it
     is cream and not white: a white belly on a brown goat reads as a bandage */
  T.on(g,T.box(1.55,0.55,2.90,pale), 0,2.45,-0.30);
  T.on(g,T.box(0.75,0.60,0.45,pale), 0,2.85, 1.62);        /* the dewlap */

  /* ---- THE SHAGGY HANG ALONG THE FLANK ----
     Twelve locks, six a side, of four lengths and two depths, hung off the
     LOWER EDGE of the barrel and reaching past it. This is where §2.3.4's
     finer grain actually goes: not into bigger pieces but into more and
     smaller ones, and onto the SILHOUETTE, where they show. A dark patch
     painted inside the outline of the flank is a decal; a lock that breaks
     the outline is hair. */
  for(const s of [1,-1]) for(let i=0;i<6;i++){
    const ln=0.50+((i*5)%4)*0.26;
    const lock=T.box(0.16,ln,0.40,i%3?dark:shade);
    lock.position.set(s*(1.00+(i%2)*0.05), 2.28-ln*0.42, 1.35-i*0.60);
    lock.rotation.z=s*0.12; g.add(lock); }
  /* and a heavier one at the point of the shoulder, where a goat's coat is
     thickest and where the leg breaks the line of the body */
  for(const s of [1,-1]){ const ruff=T.box(0.22,1.05,0.55,shade);
    ruff.position.set(s*1.02,2.85,1.10); ruff.rotation.z=s*0.16; g.add(ruff); }

  /* ---- THE NECK, TWO LENGTHS, JOINED ON THE END OF EACH OTHER ----
     A length leans FORWARD on a positive rotation about x and backward on a
     negative one, which is worth writing down: the neck leans forward and
     the horns lean back, and they are built by the same call. */
  const nk1=T.limb(1.05,1.15,1.05,hair,0,0.55);
  nk1.position.set(0,4.05,1.55); g.add(nk1);
  const nk2=T.limb(0.92,0.95,0.95,hair,1.15,0.40); nk1.add(nk2);
  T.on(nk1,T.box(0.60,0.85,0.35,pale),0,0.55,0.62);        /* the pale throat */

  /* ---- THE HEAD, AND EVERYTHING FROM HERE TURNS WITH IT ---- */
  const head=T.box(0.95,1.00,1.35,hair); head.position.set(0,5.20,3.00); g.add(head);
  const H=(m,x,y,z)=>{ m.position.set(x,y,z); head.add(m); return m; };
  H(T.box(0.88,0.26,0.45,dark),   0, 0.46, 0.05);          /* the brow */
  H(T.box(0.66,0.55,0.62,shade),  0,-0.22, 0.86);          /* the muzzle */
  H(T.box(0.44,0.26,0.18,0x35291d),0,-0.14, 1.22);         /* the nose */
  for(const s of [1,-1]) H(T.box(0.10,0.09,0.10,0x191108), s*0.14,-0.14,1.30);  /* nostrils */
  /* THE BEARD — the one silhouette nothing else on the plain has */
  H(T.box(0.28,0.70,0.28,dark),   0,-0.84, 0.50).rotation.x=0.22;
  /* the jaw hinges at its BACK, so the mouth opens instead of sliding */
  const jaw=T.box(0.52,0.28,0.60,pale); jaw.geometry.translate(0,0,0.30);
  H(jaw, 0,-0.52, 0.30);

  /* ---- THE HORNS, RIBBED AND SWEPT BACK ----
     Three lengths apiece, each shorter and thinner than the last, and each
     JOINED ON THE END OF THE ONE BEFORE and leaned a little further over — so
     the horn curves instead of stepping. */
  for(const s of [1,-1]){
    const b=T.limb(0.28,0.62,0.30,horn,0,-0.72); b.position.set(s*0.32,0.48,-0.05);
    head.add(b);
    const m=T.limb(0.24,0.58,0.26,horn,0.62,-0.72); b.add(m);
    m.add(T.limb(0.18,0.52,0.20,horn,0.58,-0.60));
    /* the ear, and the inside of it is pale */
    const ear=T.box(0.80,0.26,0.40,hair); ear.geometry.translate(s*0.40,0,0);
    ear.position.set(s*0.42,0.20,-0.05); ear.rotation.z=s*0.50; ear.rotation.y=s*0.30;
    head.add(ear);
    T.on(ear,T.box(0.40,0.09,0.18,pale), s*0.44,-0.11,0.01);   /* pale within */
    /* THE EYE, AND THE PUPIL IS A BAR. A goat's pupil is a horizontal slot,
       and at any distance you can read it, it is the whole face. */
    H(T.box(0.26,0.26,0.14,0xd9b83f), s*0.44, 0.14, 0.60);
    H(T.box(0.21,0.08,0.09,0x141008), s*0.44, 0.14, 0.68);
  }

  /* ---- THE TAIL, CARRIED UP ---- a sheep's hangs; a goat's does not.
     It swings from its BASE, which is where a tail is joined on. */
  const tail=T.limb(0.28,0.58,0.28,hair,0,-0.85);
  tail.position.set(0,3.95,-2.35); g.add(tail);
  tail.add(T.limb(0.24,0.30,0.24,dark,0.58,0.15));

  /* ---- AND IT STANDS ON CLOVEN HOOVES ----
     The hoof hangs off the SHIN, so it swings with the leg and is not a block
     stuck to the ground. Each is split in two, which is what cloven means. */
  T.legs4(g,0.80,1.25,2.70,hair,0.46);
  for(const L of (g.userData.legs||[])){
    const shin=L.userData.knee; if(!shin) continue;
    for(const c of [1,-1]) T.on(shin,T.box(0.20,0.40,0.46,hoof), c*0.12,-1.22,0.04);
  }

  g.userData.head=head;
  g.userData.jaw=jaw;
  g.userData.tail=tail;
  return g;
}});
