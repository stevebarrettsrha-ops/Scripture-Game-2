/* THE LION — and it was a box with a smaller box for a mane.

   What a lion is: the MANE, which is not a collar but a mass that frames the
   whole head and runs back over the shoulder and down the chest, in a dozen
   locks of three darknesses so it reads as hair; the heavy square muzzle with
   the black lip line and the whisker spots; the deep chest on a light loin;
   the shoulder blades that stand proud when it walks; the belly fold that
   swings; the tail with the black tuft; the great padded foot with claws
   sheathed in it.

   The mane is on the HEAD, not on the beast, so it turns with the face.

   Eighty-odd parts, and it is drawn in thirteen meshes.

   Built nose toward +z, feet at y=0. */
EARTH.beast({
name:'lion',
realm:'land',
metres:1.15,
build:function(T){
  const g=T.group();
  const tawny=0xcaa25a, deep=0xb08a48, pale=0xe0c894,
        mane=0x8a5a2a, maneD=0x5e3a18, maneL=0xa06c34,
        muz=0xd8b878, pad=0x2b2119, lip=0x241a12;

  /* ---- THE BODY ---- deep at the chest, light at the loin */
  const chest =T.box(2.25,2.35,1.80,tawny); chest .position.set(0,3.35, 1.35); g.add(chest);
  const barrel=T.box(2.15,2.15,1.90,tawny); barrel.position.set(0,3.25,-0.50); g.add(barrel);
  const loin  =T.box(1.85,1.85,1.60,tawny); loin  .position.set(0,3.25,-2.10); g.add(loin);
  const croup =T.box(1.75,1.75,0.85,tawny); croup .position.set(0,3.35,-3.15); g.add(croup);
  T.on(g,T.box(1.80,0.55,3.60,pale), 0,2.30,-0.70);          /* the pale belly */
  T.on(g,T.box(1.60,0.50,1.10,pale), 0,2.15,-2.20).rotation.x=0.16;   /* the belly fold */
  for(const s of [1,-1]){
    T.on(g,T.box(0.22,0.90,0.95,deep), s*1.06,3.85, 1.15);   /* the shoulder blade */
    T.on(g,T.box(0.20,0.80,0.80,deep), s*0.90,3.90,-2.55);   /* and the point of the hip */
  }

  /* ---- THE NECK ---- short and thick, and buried in mane */
  const nk=T.limb(1.30,1.45,1.30,tawny,0,0.62); nk.position.set(0,4.20,1.85); g.add(nk);

  /* ---- THE HEAD ---- and the mane is grown on it */
  const head=T.box(1.60,1.55,1.60,tawny); head.position.set(0,5.20,3.35); g.add(head);
  const H=(m,x,y,z)=>{ m.position.set(x,y,z); head.add(m); return m; };
  H(T.box(1.20,0.80,0.85,muz),    0,-0.35, 0.95);            /* the square muzzle */
  H(T.box(0.62,0.34,0.55,muz),    0,-0.16, 1.30);
  H(T.box(0.36,0.26,0.18,lip),    0,-0.10, 1.56);            /* the nose */
  H(T.box(0.80,0.16,0.30,lip),    0,-0.55, 1.32);            /* the black lip line */
  for(const s of [1,-1]) for(let w=0;w<3;w++)
    H(T.box(0.07,0.07,0.06,lip), s*(0.22+w*0.13),-0.32,1.40);/* the whisker spots */
  const jaw=T.box(0.95,0.40,0.85,muz); jaw.geometry.translate(0,0,0.42);
  H(jaw, 0,-0.72, 0.62);
  for(const s of [1,-1]){
    H(T.box(0.30,0.26,0.18,0xc8a52e), s*0.44, 0.16, 0.72);   /* the amber eye */
    H(T.box(0.14,0.13,0.09,0x120c08), s*0.44, 0.14, 0.79);
    H(T.box(0.34,0.22,0.24,pale),     s*0.44, 0.34, 0.74);   /* the pale brow */
    const e=T.box(0.34,0.36,0.24,tawny); e.position.set(s*0.68,0.74,-0.10);
    head.add(e); T.on(e,T.box(0.20,0.20,0.14,lip), 0,0.02,0.10);
  }
  /* ---- THE MANE ---- fourteen locks in three darknesses over an inner course of fourteen more, framing the face,
     running back over the crown and down the chest. Nothing else on the plain
     has a head this shape; it is the whole animal at a distance. */
  const LOCK=[maneD,mane,maneL];
  for(let i=0;i<14;i++){
    const th=(i/14)*Math.PI*2;
    /* A lock stands out RADIALLY from the head, so the mane is a disc round
       the face and not a stack of planks on top of it. `T.limb` points a
       length along +y, and turning it by z sends +y to (-sin, cos) — so the
       angle that puts a lock out along (cos th, sin th) is th - pi/2, and NOT
       pi/2 - th, which mirrors the ring and stands the whole mane on end. */
    const ln=0.95+T.hash(i*3.1,1.7)*0.85;
    const m2=T.limb(0.52,ln,0.62,LOCK[i%3],0,0,th-Math.PI/2);
    m2.position.set(Math.cos(th)*0.66, Math.sin(th)*0.62, -0.26-(i%2)*0.16);
    head.add(m2);
    /* and an inner course, short and thick, so the mane is a MASS and not a
       ring of spikes with daylight between them */
    const th2=th+Math.PI/14;
    const m3=T.limb(0.62,0.72,0.70,LOCK[(i+2)%3],0,0,th2-Math.PI/2);
    m3.position.set(Math.cos(th2)*0.34, Math.sin(th2)*0.32, -0.34);
    head.add(m3);
  }
  H(T.box(1.55,0.75,0.95,maneD), 0, 0.55,-0.85);             /* the mass behind */
  H(T.box(1.05,1.10,0.55,mane),  0,-0.55,-0.95);             /* and under the throat */
  /* and it runs back over the shoulder, which is on the BEAST, not the head */
  for(let i=0;i<4;i++) T.on(g,T.box(1.70-i*0.24,0.60,0.62,i%2?mane:maneD),
                            0,4.85-i*0.14,2.15-i*0.60);

  /* ---- THE TAIL ---- long, low, with the black tuft only lions have */
  const tail=T.limb(0.34,1.35,0.34,tawny,0,2.35); tail.position.set(0,3.65,-3.55); g.add(tail);
  const t2=T.limb(0.30,1.20,0.30,tawny,1.35,0.45); tail.add(t2);
  t2.add(T.limb(0.42,0.65,0.42,0x241a12,1.20,0.20));

  /* ---- THE LEGS ---- and the great padded foot */
  T.legs4(g,0.82,1.50,2.65,tawny,0.72);
  for(const L of (g.userData.legs||[])){
    const shin=L.userData.knee; if(!shin) continue;
    T.on(shin,T.box(0.82,0.34,0.95,pad), 0,-1.22,0.16);
    for(let t=0;t<4;t++) T.on(shin,T.box(0.17,0.20,0.22,tawny), (t-1.5)*0.21,-1.20,0.62);
  }

  g.userData.head=head;
  g.userData.jaw=jaw;
  g.userData.tail=tail;
  return g;
}});
