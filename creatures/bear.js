/* THE BROWN BEAR — thirty-two lands name it, and it foraged the northern
   woods of all of them as fourteen boxes.

   What a brown bear is, and every one of these is what tells it from the
   black bear standing beside it in `creatures/blackbear.js`: the SHOULDER
   HUMP, which is pure muscle for digging and is the surest mark of the
   species; the DISHED FACE, hollow between a heavy brow and a short broad
   muzzle; the long straight claws it cannot climb with; the small round ears
   set wide and low on a massive head; the shaggy fall of hair off the flank
   and the haunch; and a rump that stands LOWER than the shoulder, which is
   the line of the whole animal.

   Seventy-two parts, twelve meshes.

   Built nose toward +z, feet at y=0. */
EARTH.beast({
name:'bear',
realm:'land',
metres:1.0,
build:function(T){
  const g=T.group();
  const fur=0x6d4526, dark=0x452a16, muz=0xbfa273, pale=0x8a6238,
        claw=0xd8cfc0, pad=0x2b211a;

  /* ---- THE BODY ---- highest at the shoulder and falling away to the rump */
  const fore=T.box(3.20,3.10,2.30,fur); fore.position.set(0,4.70, 1.75); g.add(fore);
  const mid =T.box(3.30,2.90,2.20,fur); mid .position.set(0,4.50,-0.35); g.add(mid);
  const hind=T.box(3.05,2.70,2.00,fur); hind.position.set(0,4.30,-2.30); g.add(hind);
  const rump=T.box(2.70,2.40,1.10,fur); rump.position.set(0,4.20,-3.60); g.add(rump);
  /* ---- THE HUMP ---- and it is the species. Three courses, so it is a rise
     and not a crate set on the back. */
  T.on(g,T.box(2.90,0.75,2.00,fur), 0,6.35, 1.55);
  T.on(g,T.box(2.20,0.60,1.50,fur), 0,6.90, 1.45);
  T.on(g,T.box(1.30,0.45,0.95,dark),0,7.25, 1.40);
  /* ---- THE SHAG ---- twelve falls of hair off the flank and the haunch,
     hung past the outline so the silhouette itself is hair */
  for(const s of [1,-1]) for(let i=0;i<6;i++){
    const ln=0.85+((i*5)%4)*0.34;
    T.on(g,T.box(0.26,ln,0.62, i%2?dark:pale), s*(1.58+(i%2)*0.08),
         3.35-ln*0.34, 2.20-i*1.05).rotation.z=s*0.14; }

  /* ---- THE HEAD ---- massive, low, and DISHED between brow and muzzle */
  const head=T.box(2.20,2.00,2.00,fur); head.position.set(0,5.35,3.80); g.add(head);
  const H=(m,x,y,z)=>{ m.position.set(x,y,z); head.add(m); return m; };
  H(T.box(2.05,0.55,1.10,fur),    0, 1.00,-0.20);            /* the heavy brow */
  H(T.box(1.30,0.55,0.65,dark),   0, 0.30, 0.90);            /* the hollow of the dish */
  H(T.box(1.35,1.05,1.20,muz),    0,-0.30, 1.35);            /* the short broad muzzle */
  H(T.box(0.66,0.48,0.34,0x18140f),0,-0.05, 2.02);           /* the nose */
  const jaw=T.box(1.10,0.50,1.05,muz); jaw.geometry.translate(0,0,0.52);
  H(jaw, 0,-0.82, 0.85);
  for(const s of [1,-1]){
    H(T.box(0.30,0.28,0.20,0x120e0a), s*0.72, 0.42, 1.10);   /* the small eye */
    H(T.box(0.11,0.09,0.08,0xbcae96), s*0.75, 0.48, 1.16);
  }
  /* the ears: small, round, wide-set and LOW, and the engine flicks them */
  const ears=[];
  for(const s of [1,-1]){
    const e=T.box(0.72,0.72,0.42,fur); e.geometry.translate(0,0.36,0);
    e.position.set(s*0.92,1.10,-0.55); e.rotation.z=s*0.28; head.add(e); ears.push(e);
    T.on(e,T.box(0.42,0.42,0.20,dark), 0,0.34,0.16);
  }

  /* ---- THE TAIL ---- and there is barely one */
  const tail=T.limb(0.55,0.55,0.45,fur,0,2.60); tail.position.set(0,4.55,-4.10); g.add(tail);

  /* ---- THE LEGS ---- and the long straight claws of a digger */
  T.legs4(g,1.20,1.75,2.90,fur,1.15);
  for(const L of (g.userData.legs||[])){
    const shin=L.userData.knee; if(!shin) continue;
    T.on(shin,T.box(1.20,0.42,1.45,pad), 0,-1.30,0.22);      /* the flat sole */
    for(let t=0;t<5;t++){
      T.on(shin,T.box(0.20,0.24,0.24,fur), (t-2)*0.24,-1.28,0.86);
      T.on(shin,T.box(0.14,0.16,0.34,claw),(t-2)*0.24,-1.30,1.10).rotation.x=-0.30; }
  }

  g.userData.head=head;
  g.userData.jaw=jaw;
  g.userData.tail=tail;
  g.userData.ears=ears;
  return g;
}});
