/* THE CROCODILE — seventy-five lands name it, and it lay in the shallows of
   all their rivers as twenty boxes.

   What a crocodile is: the ARMOUR, four rows of keeled scutes down the back
   and two more down the tail, rising into the double crest that runs to the
   tip; the long narrow jaw with the FOURTH TOOTH standing outside the closed
   mouth, which is the mark of a crocodile and not an alligator; the eyes and
   the nostrils raised on their own turrets, so a submerged animal is two
   bumps and a nose and nothing else; the sprawled legs with webbed hind feet;
   the pale throat and belly plates; the ear flaps behind the eyes.

   Seventy-odd parts, and it is drawn in nine meshes.

   Built nose toward +z, feet at y=0. */
EARTH.beast({
name:'crocodile',
realm:'land',
metres:4.5,
build:function(T){
  const g=T.group();
  const dk=0x455631, lt=0x63754a, bl=0xa9ad7c, dark=0x2f3c22,
        tooth=0xe8e4d2, eye=0xd9c93f;

  /* ---- THE BODY ---- long and low, and wider than it is deep */
  T.on(g,T.box(2.60,1.55,3.20,dk),  0,1.55, 0.90);
  T.on(g,T.box(2.40,1.45,2.80,dk),  0,1.50,-2.10);
  T.on(g,T.box(2.20,0.55,5.60,bl),  0,0.78,-0.30);           /* the belly plates */
  for(let i=0;i<7;i++) T.on(g,T.box(2.10,0.16,0.40,lt), 0,0.52,2.20-i*0.80);

  /* ---- THE ARMOUR ---- four rows of keeled scutes down the back */
  for(let i=0;i<8;i++) for(const c of [-1.5,-0.5,0.5,1.5]){
    const h=0.42+(Math.abs(c)<1?0.16:0);
    T.on(g,T.box(0.46,h,0.52, i%2?lt:dark), c*0.52, 2.28+h*0.2, 2.30-i*0.78);
  }

  /* ---- THE HEAD ---- and it is a quarter of the animal */
  const head=T.box(1.90,1.10,1.60,dk); head.position.set(0,1.70,4.30); g.add(head);
  const H=(m,x,y,z)=>{ m.position.set(x,y,z); head.add(m); return m; };
  H(T.box(1.45,0.75,2.90,dk),    0,-0.12, 2.30);             /* the long snout */
  H(T.box(1.05,0.55,1.20,dk),    0,-0.10, 4.20);             /* and the swelling at the nose */
  /* the eye turrets — two bumps and nothing else when it is under */
  for(const s of [1,-1]){
    H(T.box(0.55,0.50,0.60,dk),   s*0.58, 0.62, 0.15);
    H(T.box(0.34,0.26,0.36,eye),  s*0.58, 0.88, 0.22);
    H(T.box(0.30,0.10,0.12,0x0e0e0a), s*0.58, 0.92, 0.40);   /* the slit pupil, upright */
    H(T.box(0.42,0.22,0.40,dark), s*0.62, 0.42,-0.55);       /* the ear flap */
    /* the teeth along the upper jaw, and the FOURTH one is long */
    for(let t=0;t<6;t++)
      H(T.box(0.14,t===3?0.42:0.24,0.16,tooth), s*0.66,-0.52,1.30+t*0.60);
  }
  H(T.box(0.44,0.30,0.34,dk),    0, 0.42, 4.55);             /* the nostril turret */
  for(const s of [1,-1]) H(T.box(0.12,0.10,0.12,0x1a1a12), s*0.13, 0.56, 4.60);
  /* the lower jaw, hinged at the back and pale beneath */
  const jaw=T.box(1.30,0.50,4.00,bl); jaw.geometry.translate(0,0,2.00);
  H(jaw, 0,-0.62, 0.50);
  for(const s of [1,-1]) for(let t=0;t<6;t++)
    T.on(jaw,T.box(0.12,0.22,0.14,tooth), s*0.55, 0.32, 0.70+t*0.60);

  /* ---- THE TAIL ---- and it is half the beast: five lengths, and the
     double crest of scutes closes into one along it */
  const tail=T.limb(1.90,2.40,1.35,dk,0,-1.57);
  tail.position.set(0,1.55,-3.30); g.add(tail);
  let t=tail, w=1.65, ln=2.20, th=1.20;
  for(let i=0;i<4;i++){
    const seg=T.limb(w,ln,th, i%2?dk:lt, i===0?2.40:ln/0.92, 0);
    t.add(seg); t=seg;
    /* the crest: two rows of scutes near the body, closing into one at the tip */
    /* a tail length is a limb turned on its side: its own +y runs BACKWARD
       along the tail and its own +z stands UP, so the crest goes on z */
    if(i<2){ for(const c of [-1,1]){
        T.on(seg,T.box(0.32,0.62,0.44,dark), c*0.26, ln*0.28, th*0.52);
        T.on(seg,T.box(0.30,0.58,0.40,dark), c*0.26, ln*0.72, th*0.50); } }
    else   { T.on(seg,T.box(0.28,0.64,0.52,dark), 0, ln*0.30, th*0.55);
             T.on(seg,T.box(0.26,0.60,0.46,dark), 0, ln*0.72, th*0.52); }
    w*=0.80; ln*=0.92; th*=0.82;
  }

  /* ---- THE LEGS ---- sprawled out sideways, not under: it walks low */
  T.legs4(g,1.35,2.10,1.55,lt,0.72);
  for(const L of (g.userData.legs||[])){
    L.rotation.z=(L.position.x>0?-0.55:0.55);
    const shin=L.userData.knee; if(!shin) continue;
    T.on(shin,T.box(0.90,0.22,0.95,bl), 0,-0.75,0.20);       /* the webbed foot */
    for(let k=0;k<4;k++) T.on(shin,T.box(0.14,0.14,0.30,dark), (k-1.5)*0.22,-0.76,0.62);
  }

  g.userData.head=head;
  g.userData.jaw=jaw;
  g.userData.tail=tail;
  return g;
}});
