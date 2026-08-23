/* THE CHICKEN — in every yard on this earth, and it was eleven boxes with a
   red slab for a comb.

   What a chicken is: the COMB, which is a row of five points and not a plate;
   the two wattles hanging separately under the beak; the ear-lobe beside
   them; the SICKLE FEATHERS of the tail, three long curved ones over a fan of
   short ones, arched up and back; the neck hackle, a cape of pointed feathers
   falling over the shoulders; the wing folded flat along the flank with the
   primaries showing past it; the scaled yellow shank with three forward toes
   and one back, and a spur; the beak in two halves.

   Sixty-two parts, drawn in twelve meshes.

   Built beak toward +z, feet at y=0. */
EARTH.beast({
name:'chicken',
realm:'land',
metres:0.42,
build:function(T){
  const g=T.group();
  const white=0xeeeeea, shade=0xdcdcd6, dim=0xc8c8c2, comb=0xc23a2a,
        deep=0x8e2a1e, beak=0xdf9c2a, shank=0xd8a848, lobe=0xf0e8d8;

  /* ---- THE BODY ---- a deep egg carried forward over the legs */
  T.on(g,T.box(1.55,1.50,1.75,white), 0,2.20, 0.05);
  T.on(g,T.box(1.35,1.15,1.15,shade), 0,2.10,-1.00);         /* the cushion */
  T.on(g,T.box(1.20,0.55,1.50,dim),   0,1.52, 0.10);         /* the keel */

  /* ---- THE WINGS ---- folded flat along the flank, primaries showing past */
  for(const s of [1,-1]){
    T.on(g,T.box(0.28,1.05,1.55,shade), s*0.90,2.10, 0.10);
    for(let i=0;i<4;i++)
      T.on(g,T.box(0.20,0.30,0.85,dim), s*0.94,1.72-i*0.10,-0.75-i*0.14).rotation.x=-0.18;
  }

  /* ---- THE NECK, AND THE HACKLE OVER IT ---- a cape of pointed feathers */
  const nk=T.limb(0.80,1.15,0.80,white,0,0.30); nk.position.set(0,2.75,0.70); g.add(nk);
  for(let i=0;i<7;i++){ const a=(i/6)*Math.PI-Math.PI/2;
    T.on(nk,T.box(0.28,0.70,0.30, i%2?shade:dim),
         Math.sin(a)*0.52, 0.18, -0.10-Math.cos(a)*0.30).rotation.z=Math.sin(a)*0.30; }

  /* ---- THE HEAD ---- and all the red of it */
  const head=T.box(0.82,0.92,0.82,white); head.position.set(0,4.20,1.15); g.add(head);
  const H=(m,x,y,z)=>{ m.position.set(x,y,z); head.add(m); return m; };
  /* THE COMB — five points, and it is the bird's whole outline above */
  for(let i=0;i<5;i++)
    H(T.box(0.16,0.26+(i===2?0.16:(i===1||i===3?0.08:0)),0.20,comb), 0, 0.62, 0.40-i*0.20);
  H(T.box(0.16,0.16,0.90,comb),   0, 0.48, 0.00);            /* the blade it stands on */
  /* the beak, in two halves */
  H(T.box(0.34,0.16,0.46,beak),   0, 0.02, 0.58);
  H(T.box(0.30,0.13,0.40,0xc98a1e),0,-0.13, 0.55);
  /* the wattles hang SEPARATELY, and the ear-lobe is beside them */
  for(const s of [1,-1]){
    H(T.box(0.14,0.36,0.20,deep),  s*0.13,-0.44, 0.36);
    H(T.box(0.16,0.20,0.14,lobe),  s*0.40,-0.22, 0.10);
    H(T.box(0.20,0.20,0.14,0xd8a028), s*0.38, 0.14, 0.36);   /* the eye ring */
    H(T.box(0.11,0.11,0.09,0x18120a), s*0.40, 0.14, 0.43);
  }
  const jaw=T.box(0.28,0.10,0.36,0xc98a1e); jaw.geometry.translate(0,0,0.18);
  H(jaw, 0,-0.14, 0.40);

  /* ---- THE TAIL ---- a fan of short feathers with three long SICKLES arched
     up and back over it, which is the bird's whole silhouette behind */
  const tail=T.limb(0.70,0.50,0.55,shade,0,-0.75); tail.position.set(0,2.30,-1.45); g.add(tail);
  for(let i=0;i<5;i++){ const f=T.limb(0.16,1.00,0.36,i%2?white:shade,0.42,0.45,(i-2)*0.14);
    f.position.x=(i-2)*0.17; tail.add(f); }
  /* the sickles arch UP and back OVER the fan; leaned the other way they lie
     out behind the bird like the head of a broom */
  for(let i=0;i<3;i++){
    const sk=T.limb(0.15,0.95,0.44, dim, 0.45, 0.28, (i-1)*0.24);
    tail.add(sk);
    const s2=T.limb(0.13,0.85,0.38,shade,0.95,0.55); sk.add(s2);
    s2.add(T.limb(0.11,0.70,0.32,dim,0.85,0.62));
  }

  /* ---- THE LEGS ---- scaled yellow shanks, three toes forward and one back,
     and a spur on the inside */
  const legs=[];
  for(const s of [1,-1]){
    const L=T.limb(0.34,0.55,0.34,white,0,0); L.position.set(s*0.40,1.55,0.10);
    L.userData.ph=(s>0)?0:Math.PI; L.userData.foot=(s>0?0:1);
    const S=T.limb(0.24,1.05,0.24,shank,0,0); S.position.set(0,-1.05,0);
    S.geometry.translate(0,0,0); L.add(S); L.userData.knee=S;
    for(let i=0;i<4;i++) T.on(S,T.box(0.26,0.06,0.26,0xb88a30), 0,0.14+i*0.18,0);
    for(let k=0;k<3;k++) T.on(S,T.box(0.09,0.09,0.40,shank), (k-1)*0.13,-0.02,0.24);
    T.on(S,T.box(0.09,0.09,0.24,shank), 0,-0.02,-0.16);      /* the back toe */
    T.on(S,T.box(0.08,0.08,0.18,0xb88a30), -s*0.16,0.34,-0.02).rotation.y=s*0.5;  /* the spur */
    g.add(L); legs.push(L);
  }
  g.userData.legs=legs;
  g.userData.head=head;
  g.userData.jaw=jaw;
  g.userData.tail=tail;
  return g;
}});
