/* THE SHEEP — fifty-nine lands name it, and it stood in every village on this
   earth as one wool-textured box with a head on it.

   A sheep is not a box. A sheep is a FLEECE — a mass of separate locks that
   catches the light differently everywhere, hanging over legs that are much
   thinner than the body above them and a face that is a different colour and
   texture altogether. That is what makes the animal read, and it is exactly
   what a box cannot do at any resolution.

   So the fleece here is grown, not drawn: two dozen locks of four creams,
   jittered over the barrel and standing out past its outline, with the tight
   short wool of the poll and cheeks separate again. Eighty-odd parts. It welds
   to eleven meshes, which is one more than the box-with-a-head cost, because
   what stays separate is what MOVES — the head, the jaw, two ears, the tail
   and the eight bones of the legs.

   Built nose toward +z, feet at y=0. */
EARTH.beast({
name:'sheep',
realm:'land',
metres:0.9,
build:function(T){
  const g=T.group();
  /* four creams, and the fleece is dealt out among them: one flat colour over
     the whole of a sheep is the thing that made it read as a crate */
  const W=[0xe7ded0,0xdcd2c2,0xefe8dc,0xd2c7b6];
  const face=0xf2ece0, skin=0xcdbfa9, dark=0x8d8271, hoof=0x33291f;

  /* ---- THE CARCASS UNDER THE WOOL ---- nobody sees it; it is what the
     fleece is hung on, and what keeps the beast solid when a lock is thin */
  T.on(g,T.box(1.75,1.80,3.70,W[1]), 0,3.20,-0.10);
  T.on(g,T.box(1.55,0.50,3.20,skin), 0,2.25,-0.15);          /* the bare belly */

  /* ---- THE FLEECE ---- some seventy locks, four creams, hung over the
     barrel and standing PAST its outline. A lock inside the silhouette is a
     stain on a box; a lock that breaks the outline is wool. */
  let li=0;
  for(let k=0;k<13;k++){
    const z=1.25-k*0.30;
    for(const s of [1,-1]){
      /* over the back, along the flank, under the brisket — the last course
         only where the belly is deep enough to carry it */
      const rows=[[s*(0.30+0.28*T.hash(k,1.3)), 4.30, 0.62],
                  [s*(1.02),                    3.05+1.15*T.hash(k,4.7), 0.72],
                  [s*(0.46),                    2.28, 0.52]];
      for(let c=0;c<3;c++){
        if(c===2&&(k%2||k>9)) continue;
        const u=T.hash(li*1.7,3.1), v=T.hash(li*2.9,7.3);
        const lock=T.box(0.50+u*0.30, rows[c][2]+v*0.28, 0.46+u*0.24, W[li%4]);
        lock.position.set(rows[c][0], rows[c][1], z+(v-0.5)*0.16);
        lock.rotation.z=(u-0.5)*0.30; lock.rotation.x=(v-0.5)*0.22;
        g.add(lock); li++;
      }
    }
  }
  /* the ruff at the throat, where a fleece is always deepest */
  for(const s of [1,-1]) T.on(g,T.box(0.55,0.85,0.55,W[(s>0)?0:2]), s*0.40,3.35,1.80);

  /* ---- THE NECK ---- short and thick, and woolly to the poll */
  const nk=T.limb(1.00,1.05,1.00,W[2],0,0.45); nk.position.set(0,4.05,1.55); g.add(nk);

  /* ---- THE HEAD ---- a different colour and a different texture, which is
     half of why a sheep looks like a sheep and not like a small cloud */
  const head=T.box(0.90,0.95,1.25,face); head.position.set(0,4.90,2.70); g.add(head);
  const H=(m,x,y,z)=>{ m.position.set(x,y,z); head.add(m); return m; };
  H(T.box(0.86,0.42,0.55,W[0]),   0, 0.42,-0.20);            /* the woolly poll */
  for(const s of [1,-1]) H(T.box(0.22,0.55,0.40,W[3]), s*0.40, 0.24,-0.05);  /* cheek wool */
  H(T.box(0.60,0.50,0.55,face),   0,-0.16, 0.80);            /* the muzzle */
  H(T.box(0.42,0.26,0.16,skin),   0,-0.12, 1.12);            /* the nose */
  for(const s of [1,-1]) H(T.box(0.09,0.08,0.08,0x4a3c30), s*0.13,-0.12,1.19);
  const jaw=T.box(0.48,0.24,0.58,face); jaw.geometry.translate(0,0,0.29);
  H(jaw, 0,-0.48, 0.30);
  /* the eye, and a sheep's pupil is a bar as a goat's is — set it in a dark
     lid, because a pale eye on a pale face is no eye at all */
  for(const s of [1,-1]){
    H(T.box(0.28,0.26,0.14,0x3d3025), s*0.40, 0.08, 0.48);
    H(T.box(0.20,0.09,0.09,0x120d08), s*0.42, 0.08, 0.56);
  }
  /* ---- THE EARS, HELD OUT SIDEWAYS AND A LITTLE DOWN, AND THEY MOVE ---- */
  const ears=[];
  for(const s of [1,-1]){
    const e=T.box(0.62,0.24,0.34,face); e.geometry.translate(s*0.31,0,0);
    e.position.set(s*0.40,0.10,-0.15); e.rotation.z=s*-0.25; e.rotation.y=s*0.35;
    head.add(e); ears.push(e);
    T.on(e,T.box(0.40,0.09,0.20,skin), s*0.32,-0.10,0.01);
  }

  /* ---- THE TAIL ---- short, woolly, and it HANGS: that is the one line
     that tells a sheep from a goat across a field */
  const tail=T.limb(0.42,0.62,0.38,W[0],0,-0.25);
  tail.position.set(0,3.55,-2.05); tail.rotation.x=2.75; g.add(tail);
  T.on(tail,T.box(0.34,0.30,0.32,W[3]), 0,0.60,0);

  /* ---- THE LEGS ---- bare, thin, dark below the knee, and cloven */
  T.legs4(g,0.72,1.25,2.35,skin,0.42);
  for(const L of (g.userData.legs||[])){
    const shin=L.userData.knee; if(!shin) continue;
    T.on(shin,T.box(0.40,0.66,0.40,dark), 0,-0.62,0);
    for(const c of [1,-1]) T.on(shin,T.box(0.18,0.34,0.40,hoof), c*0.10,-1.12,0.03);
  }

  g.userData.head=head;
  g.userData.jaw=jaw;
  g.userData.tail=tail;
  g.userData.ears=ears;
  return g;
}});
