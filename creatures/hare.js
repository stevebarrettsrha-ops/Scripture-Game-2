/* THE HARE — in the fields and on the tundra, and it was eight boxes.

   What a hare is: the EARS, a third of the animal's whole length, black at
   the tips, carried back along the spine when it crouches; the HIND LEG,
   which is twice the fore and folded under so the beast is always half in the
   act of leaving; the arched back; the white scut under a black-topped tail;
   the split lip and the whiskers; the eye set far round on the side of the
   head so it sees behind itself; the pale ring round it.

   Forty-nine parts, drawn in twelve meshes.

   Built nose toward +z, feet at y=0. */
EARTH.beast({
name:'hare',
realm:'land',
metres:0.4,
build:function(T){
  const g=T.group();
  const fur=0xb8a184, lt=0xc8b494, dark=0x8a7060, pale=0xefe8dc,
        tip=0x2a231c, eye=0x1a1410;

  /* ---- THE BODY ---- and the back is ARCHED, highest over the haunch */
  T.on(g,T.box(1.00,0.95,1.10,fur), 0,1.30, 0.55);
  T.on(g,T.box(1.10,1.05,1.05,fur), 0,1.35,-0.45);
  T.on(g,T.box(1.15,1.20,0.95,fur), 0,1.45,-1.35);           /* the haunch, and it is the highest */
  T.on(g,T.box(0.95,0.35,2.10,pale),0,0.85,-0.35);           /* the pale belly */
  for(const s of [1,-1]) T.on(g,T.box(0.16,0.70,0.75,lt), s*0.56,1.30,-1.30);

  /* ---- THE HEAD ---- small, with the eye set far round on the side */
  const head=T.box(0.72,0.72,0.85,lt); head.position.set(0,1.75,1.15); g.add(head);
  const H=(m,x,y,z)=>{ m.position.set(x,y,z); head.add(m); return m; };
  H(T.box(0.46,0.42,0.42,lt),    0,-0.14, 0.56);             /* the muzzle */
  H(T.box(0.22,0.16,0.12,dark),  0,-0.10, 0.80);             /* the nose */
  for(const s of [1,-1]) H(T.box(0.09,0.14,0.10,pale), s*0.09,-0.24,0.72);   /* the split lip */
  for(const s of [1,-1]) for(let w=0;w<3;w++)
    H(T.box(0.34,0.03,0.03,pale), s*0.36,-0.06+w*0.07,0.66).rotation.z=s*(0.2-w*0.16);
  const jaw=T.box(0.36,0.16,0.44,pale); jaw.geometry.translate(0,0,0.22);
  H(jaw, 0,-0.32, 0.26);
  for(const s of [1,-1]){
    H(T.box(0.28,0.28,0.22,pale), s*0.34, 0.12, 0.06);       /* the pale ring */
    H(T.box(0.22,0.22,0.16,eye),  s*0.38, 0.12, 0.10);
  }
  /* ---- THE EARS ---- a third of the animal, black at the tips, and they
     move: two lengths apiece so the tip leans back */
  const ears=[];
  for(const s of [1,-1]){
    const e=T.limb(0.34,0.85,0.20,lt,0,-0.20,-s*0.16);
    e.position.set(s*0.20,0.34,-0.20); head.add(e); ears.push(e);
    const e2=T.limb(0.32,0.75,0.19,lt,0.85,-0.18,-s*0.14); e.add(e2);
    T.on(e,T.box(0.20,0.58,0.10,dark), 0,0.42,0.09);
    T.on(e2,T.box(0.19,0.50,0.09,dark),0,0.36,0.09);
    T.on(e2,T.box(0.34,0.22,0.21,tip), 0,0.68,0);            /* the black tip */
  }

  /* ---- THE SCUT ---- black above, white beneath, and it is all you see of
     a hare going away from you */
  const tail=T.limb(0.34,0.40,0.30,tip,0,-0.35); tail.position.set(0,1.55,-1.85); g.add(tail);
  T.on(tail,T.box(0.32,0.30,0.24,pale), 0,0.14,-0.10);

  /* ---- THE LEGS ---- and the hind is twice the fore, and folded */
  const legs=[];
  for(const sx of [1,-1]) for(const sz of [1,-1]){
    const fore=sz>0;
    const h=fore?0.75:1.30;
    const L=T.limb(fore?0.22:0.34, h*0.55, fore?0.22:0.42, fur, 0, 0);
    L.geometry.translate(0,-h*0.55,0); L.position.set(sx*(fore?0.38:0.50), h, sz*0.85);
    L.userData.ph=(sx*sz>0)?0:Math.PI;
    L.userData.foot=(sx>0?0:1)+(sz>0?0:2);
    const S=T.limb(fore?0.20:0.28, h*0.5, fore?0.20:0.34, fur, 0, 0);
    S.geometry.translate(0,-h*0.5,0); S.position.set(0,-h*0.53,0); L.add(S); L.userData.knee=S;
    /* the foot: long behind, short in front, and it lies FLAT on the ground */
    T.on(S,T.box(fore?0.22:0.30, 0.16, fore?0.34:0.85, fur), 0,-h*0.5-0.05, fore?0.10:0.26);
    g.add(L); legs.push(L);
  }
  g.userData.legs=legs;
  g.userData.head=head;
  g.userData.jaw=jaw;
  g.userData.tail=tail;
  g.userData.ears=ears;
  return g;
}});
