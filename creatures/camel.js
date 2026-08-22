/* THE CAMEL — thirty-six lands name it, and it crossed every desert on this
   earth as ten boxes with a lump on its back.

   What a camel is: the HUMP, which is not a box but a cone of fat that leans;
   the long S of the neck; the small head with the split lip, the slit
   nostrils and the double row of lashes; the KNEE AND ELBOW PADS and the
   great chest pad it kneels on, which are bare hard callus and a different
   colour from everything else; the shag of long hair at the throat, the
   shoulder and the top of the hump, which is what a camel sheds in spring;
   the broad two-toed foot that spreads on sand; the tail with its tassel.

   Sixty-eight parts, thirteen meshes.

   Built nose toward +z, feet at y=0. */
EARTH.beast({
name:'camel',
realm:'land',
metres:2.15,
build:function(T){
  const g=T.group();
  const sand=0xc8a06a, deep=0xa87f4c, shag=0x8a6435, pale=0xdcc09a,
        callus=0x6b5233, hoof=0x4a3c2a;

  /* ---- THE BODY ---- narrow, deep, and tucked hard at the loin */
  const chest =T.box(2.55,3.10,2.40,sand); chest .position.set(0,5.10, 1.85); g.add(chest);
  const barrel=T.box(2.60,2.85,2.60,sand); barrel.position.set(0,4.95,-0.75); g.add(barrel);
  const loin  =T.box(2.15,2.30,2.10,sand); loin  .position.set(0,5.05,-3.10); g.add(loin);
  const croup =T.box(1.95,2.00,1.00,sand); croup .position.set(0,5.15,-4.40); g.add(croup);
  T.on(g,T.box(2.30,0.70,5.00,pale), 0,3.70,-1.00);          /* the pale belly */
  /* ---- THE HUMP ---- three courses narrowing to a leaning crest */
  T.on(g,T.box(2.45,0.90,3.20,sand), 0,6.60,-0.20);
  T.on(g,T.box(2.00,0.85,2.50,deep), 0,7.30,-0.35);
  T.on(g,T.box(1.40,0.80,1.70,shag), 0,7.90,-0.55).rotation.x=-0.14;
  /* the spring shag: over the hump, at the shoulder and down the throat */
  for(let i=0;i<5;i++) T.on(g,T.box(1.25,0.50,0.44,shag), (i%2?0.28:-0.28),8.20,0.20-i*0.36);
  for(const s of [1,-1]) for(let i=0;i<3;i++)
    T.on(g,T.box(0.20,0.95,0.50,shag), s*1.30, 5.60-i*0.30, 2.15-i*0.42).rotation.z=s*0.22;
  /* ---- THE CHEST PAD ---- the callus it kneels on, and it is bare */
  T.on(g,T.box(1.60,0.90,1.00,callus), 0,3.40,2.20);

  /* ---- THE NECK ---- an S: up and forward, then up and back, then forward */
  const n1=T.limb(1.35,1.90,1.35,sand,0,0.34); n1.position.set(0,6.00,1.95); g.add(n1);
  const n2=T.limb(1.15,1.75,1.15,sand,1.90,-0.62); n1.add(n2);
  const n3=T.limb(0.95,1.30,0.95,sand,1.75,0.55); n2.add(n3);
  T.on(n1,T.box(0.70,1.40,0.55,shag),0,0.85,0.72);           /* the throat shag */

  /* ---- THE HEAD ---- small for the animal, and all of it is the face */
  const head=T.box(0.95,1.05,1.75,sand); head.position.set(0,9.50,3.15); g.add(head);
  const H=(m,x,y,z)=>{ m.position.set(x,y,z); head.add(m); return m; };
  H(T.box(0.88,0.28,0.60,deep),   0, 0.48,-0.20);            /* the poll */
  H(T.box(0.78,0.60,0.70,pale),   0,-0.18, 0.95);            /* the muzzle */
  /* THE SPLIT LIP — a camel's upper lip is in two halves, and it is the one
     thing about the face nobody mistakes */
  for(const s of [1,-1]) H(T.box(0.30,0.34,0.24,pale), s*0.19,-0.42,1.28);
  for(const s of [1,-1]) H(T.box(0.10,0.20,0.10,0x4a3a28), s*0.20,-0.10,1.28);  /* slit nostrils */
  const jaw=T.box(0.60,0.34,0.85,pale); jaw.geometry.translate(0,0,0.42);
  H(jaw, 0,-0.55, 0.34);
  for(const s of [1,-1]){
    H(T.box(0.30,0.30,0.18,0x201810), s*0.42, 0.18, 0.52);   /* the eye */
    H(T.box(0.44,0.10,0.30,shag),     s*0.44, 0.40, 0.50);   /* and the long lashes */
    H(T.box(0.40,0.10,0.26,shag),     s*0.44,-0.02, 0.52);
    const e=T.box(0.42,0.22,0.30,sand); e.position.set(s*0.44,0.46,-0.30);
    e.rotation.z=s*0.4; head.add(e);
  }

  /* ---- THE TAIL ---- short, with a black tassel */
  const tail=T.limb(0.30,1.05,0.30,sand,0,2.90); tail.position.set(0,6.20,-4.85); g.add(tail);
  tail.add(T.limb(0.34,0.75,0.24,0x3a2c1c,1.05,0.10));

  /* ---- THE LEGS ---- long, and bare hard callus on every joint, and the
     broad two-toed foot that lets it walk on sand */
  T.legs4(g,1.00,2.30,4.20,sand,0.80);
  for(const L of (g.userData.legs||[])){
    T.on(L,T.box(0.92,0.70,0.42,callus), 0,-1.85,0.30);      /* the knee pad */
    const shin=L.userData.knee; if(!shin) continue;
    T.on(shin,T.box(0.72,0.55,0.72,pale), 0,-1.55,0);
    T.on(shin,T.box(1.05,0.34,1.10,hoof), 0,-1.95,0.14);     /* the broad foot */
    for(const c of [1,-1]) T.on(shin,T.box(0.26,0.24,0.26,pale), c*0.26,-2.02,0.58);
  }

  g.userData.head=head;
  g.userData.jaw=jaw;
  g.userData.tail=tail;
  return g;
}});
