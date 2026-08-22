/* THE DEER — sixty-six lands name it, from the oak woods of the north to the
   edge of the savanna, and it was eighteen boxes: a body, a neck, a head, two
   eyes, a nose, two spikes for antlers, two ears, a tail and eight legs.

   What a deer is, and what none of that had: the ANTLER, which is not a spike
   but a beam with tines coming off it, and which is the whole reason you know
   the animal at half a mile; the white rump patch and the flag of the tail
   lifted over it as it goes; the great cupped ears carried apart, which move;
   the black muzzle on a pale mask; and the long light legs under a body that
   is deep at the chest and tucked at the loin.

   The antlers are grown as a chain — beam, beam, beam, with a brow tine, a
   bez tine and a trey coming off them — so they curve back and out instead
   of standing up like two sticks. And they are hung on the HEAD, so they turn
   when the head turns, and are welded into it, so they cost nothing.

   Built nose toward +z, feet at y=0. Fifty-four parts; eleven meshes. */
EARTH.beast({
name:'deer',
realm:'land',
metres:1.1,
build:function(T){
  const g=T.group();
  const coat=0x8f6238, dark=0x5c3f24, pale=0xd9c3a2, rump=0xe8dcc4,
        beam=0x6b5638, hoof=0x241c14, mask=0x33261a;

  /* ---- THE BODY ---- deep at the chest, tucked at the loin, and the back
     nearly level: a deer is not a barrel on legs but a wedge on them. */
  const chest =T.box(1.95,2.15,1.55,coat); chest .position.set(0,3.70, 1.15); g.add(chest);
  const barrel=T.box(1.90,1.95,1.65,coat); barrel.position.set(0,3.65,-0.40); g.add(barrel);
  const loin  =T.box(1.60,1.65,1.35,coat); loin  .position.set(0,3.70,-1.60); g.add(loin);
  const croup =T.box(1.45,1.45,0.75,coat); croup .position.set(0,3.95,-2.20); g.add(croup);
  T.on(g,T.box(1.55,0.40,1.35,coat), 0,4.80, 0.85);          /* the withers */
  T.on(g,T.box(1.45,0.50,2.90,pale), 0,2.95,-0.35);          /* the pale belly */
  /* ---- THE WHITE RUMP ---- the patch you see going away from you, and the
     one mark that tells a deer from everything else in the wood */
  T.on(g,T.box(1.30,1.10,0.20,rump), 0,3.95,-2.62);
  for(const s of [1,-1]) T.on(g,T.box(0.14,0.80,0.30,rump), s*0.66,3.80,-2.46);
  /* the summer dapple, four flecks a side along the top of the flank */
  for(const s of [1,-1]) for(let i=0;i<4;i++)
    T.on(g,T.box(0.14,0.26,0.30,pale), s*0.97, 4.05-(i%2)*0.45, 0.75-i*0.72);

  /* ---- THE NECK ---- two lengths, and a ruff of longer hair at the throat */
  const nk1=T.limb(0.95,1.30,0.95,coat,0,0.50); nk1.position.set(0,4.55,1.70); g.add(nk1);
  const nk2=T.limb(0.82,1.10,0.85,coat,1.30,0.32); nk1.add(nk2);
  T.on(nk1,T.box(0.55,1.05,0.32,pale),0,0.65,0.55);          /* the pale throat */
  for(const s of [1,-1]) T.on(nk1,T.box(0.16,0.85,0.32,dark), s*0.50,0.45,0.44);

  /* ---- THE HEAD, AND ALL THE FACE UPON IT ---- */
  const head=T.box(0.85,0.92,1.45,coat); head.position.set(0,6.35,2.85); g.add(head);
  const H=(m,x,y,z)=>{ m.position.set(x,y,z); head.add(m); return m; };
  H(T.box(0.78,0.24,0.50,dark),   0, 0.42, 0.05);            /* the brow */
  H(T.box(0.58,0.52,0.62,pale),   0,-0.20, 0.92);            /* the pale mask */
  H(T.box(0.44,0.30,0.20,mask),   0,-0.16, 1.30);            /* the black muzzle */
  for(const s of [1,-1]) H(T.box(0.09,0.09,0.09,0x120c08), s*0.14,-0.14,1.39);
  const jaw=T.box(0.50,0.26,0.66,pale); jaw.geometry.translate(0,0,0.33);
  H(jaw, 0,-0.50, 0.34);
  /* the eye set well back on the side of the head, as a hunted thing's is */
  for(const s of [1,-1]){
    H(T.box(0.24,0.24,0.16,0x120c08), s*0.40, 0.10, 0.42);
    H(T.box(0.10,0.06,0.06,0xd8cbb0), s*0.44, 0.16, 0.48);   /* the one wet glint */
  }
  /* ---- THE EARS, CARRIED APART, AND THEY MOVE ---- */
  const ears=[];
  for(const s of [1,-1]){
    const e=T.box(0.85,0.34,0.55,coat); e.geometry.translate(s*0.42,0,0);
    e.position.set(s*0.36,0.22,-0.20); e.rotation.z=s*0.40; e.rotation.y=s*0.45;
    head.add(e); ears.push(e);
    T.on(e,T.box(0.58,0.12,0.36,pale), s*0.44,-0.14,0.02);
  }

  /* ---- THE ANTLERS ---- a beam in three lengths, sweeping back and out,
     with a brow tine over the eye, a bez above it and a trey at the top. The
     stag carries them; they are the silhouette of the whole animal. */
  for(const s of [1,-1]){
    const b1=T.limb(0.20,0.85,0.20,beam,0,-0.30,s*0.30);
    b1.position.set(s*0.30,0.44,-0.10); head.add(b1);
    b1.add(T.limb(0.14,0.62,0.14,beam,0.18,0.95,s*0.15));           /* brow tine */
    const b2=T.limb(0.18,0.75,0.18,beam,0.85,-0.22,s*0.22); b1.add(b2);
    b2.add(T.limb(0.13,0.55,0.13,beam,0.30,0.85,s*0.20));           /* bez tine */
    const b3=T.limb(0.15,0.62,0.15,beam,0.75,-0.20,s*0.20); b2.add(b3);
    b3.add(T.limb(0.11,0.44,0.11,beam,0.24,0.75,s*0.25));           /* trey */
    b3.add(T.limb(0.11,0.40,0.11,beam,0.62,-0.35,s*0.30));          /* the crown */
  }

  /* ---- THE FLAG ---- carried down at rest and thrown up when it runs */
  const tail=T.limb(0.30,0.62,0.26,coat,0,-0.35);
  tail.position.set(0,4.05,-2.55); g.add(tail);
  T.on(tail,T.box(0.34,0.50,0.20,rump), 0,0.30,-0.14);

  /* ---- THE LONG LIGHT LEGS, AND THE CLOVEN HOOF ---- */
  T.legs4(g,0.78,1.35,3.20,coat,0.44);
  for(const L of (g.userData.legs||[])){
    const shin=L.userData.knee; if(!shin) continue;
    T.on(shin,T.box(0.40,0.55,0.42,dark), 0,-0.30,0.00);     /* the dark hock */
    for(const c of [1,-1]) T.on(shin,T.box(0.18,0.38,0.42,hoof), c*0.11,-1.46,0.03);
  }

  g.userData.head=head;
  g.userData.jaw=jaw;
  g.userData.tail=tail;
  g.userData.ears=ears;
  return g;
}});
