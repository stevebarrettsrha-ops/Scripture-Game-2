/* THE COW — fifty-six lands name it, and it stood in every village on this
   earth as a box with a hide texture painted on: body, head, muzzle, two
   horns, two ears, two eyes, two nostrils, a tail and eight legs.

   What a cow is that a box is not: the DEWLAP swinging under the throat and
   the brisket in front of it; the hip bones standing out over a hollow flank;
   the spine ridged along the top of the back; the udder; the tuft on the end
   of a long swinging tail; the great wet muzzle; and the patches — which are
   not a texture on a hide but the hide itself, in pieces, so that the edge of
   a patch falls where the light falls and not where a canvas was painted.

   Sixty-two parts. The patches, the hips, the ridge and the dewlap are all
   welded into one mesh with the body, so what it costs above the old box is
   the JAW that chews and the TWO EARS that flick.

   Built nose toward +z, feet at y=0. */
EARTH.beast({
name:'cow',
realm:'land',
metres:1.4,
build:function(T){
  const g=T.group();
  const hide=0x6b4a34, white=0xe6e1d6, dark=0x3e2b1e,
        muz=0xc9b6a4, horn=0xded4bc, hoof=0x2b2118, udder=0xd7a89c;

  /* ---- THE BODY ---- deep and square at the chest, hollow at the flank */
  const chest =T.box(2.85,3.00,2.20,hide); chest .position.set(0,4.40, 1.85); g.add(chest);
  const barrel=T.box(2.95,2.85,2.80,hide); barrel.position.set(0,4.30,-0.70); g.add(barrel);
  const loin  =T.box(2.55,2.45,2.10,hide); loin  .position.set(0,4.40,-3.10); g.add(loin);
  const croup =T.box(2.20,2.20,1.00,hide); croup .position.set(0,4.65,-4.35); g.add(croup);
  T.on(g,T.box(2.30,0.42,5.60,dark), 0,5.90,-1.10);          /* the ridged spine */
  T.on(g,T.box(1.70,0.60,1.30,hide), 0,3.20, 2.65);          /* the brisket */
  /* ---- THE HIP BONES ---- the two knuckles that stand out over the hollow
     of the flank, and the surest sign at a distance that a cow is a cow */
  for(const s of [1,-1]){
    T.on(g,T.box(0.55,0.60,0.70,hide), s*1.05,5.70,-2.90);
    T.on(g,T.box(0.45,0.85,0.55,hide), s*1.20,4.70,-3.95);   /* the point of the buttock */
  }
  /* ---- THE HIDE IN PIECES ---- eight white patches laid ON the beast and
     standing a hair proud of it, so a patch edge is a real edge */
  /* A patch is drawn WIDER than the beast is, so it comes over the top of the
     back and down both flanks in one piece. A rectangle laid flat on the
     middle of a side is a decal and reads as one; a patch that goes over an
     edge is a marking on an animal. */
  const P=[[ 0.10,5.35, 1.20, 3.15,1.35,1.15],   /* over the withers and down */
           [ 0.00,4.00,-0.60, 3.20,1.55,1.75],   /* the great one on the barrel */
           [ 0.35,5.05,-3.00, 2.75,1.25,1.15],   /* over the hip */
           [ 0.00,3.00,-0.90, 2.10,0.55,3.20],   /* the pale underline */
           [ 0.00,5.85, 2.30, 1.35,0.90,0.60],   /* the blaze on the crest */
           [ 1.30,4.35,-1.60, 0.70,0.95,0.95],
           [-1.30,4.85, 1.10, 0.70,0.80,0.80],
           [ 1.20,3.35,-3.85, 0.85,0.75,0.70]];
  for(const p of P) T.on(g,T.box(p[3],p[4],p[5],white), p[0],p[1],p[2]);
  /* the udder, and four teats under it */
  T.on(g,T.box(1.30,0.85,1.30,udder), 0,3.10,-3.10);
  for(const s of [1,-1]) for(const z of [-2.75,-3.45])
    T.on(g,T.box(0.18,0.42,0.18,udder), s*0.36,2.55,z);

  /* ---- THE NECK, AND THE DEWLAP THAT SWINGS UNDER IT ---- */
  const nk=T.limb(1.70,1.50,1.70,hide,0,0.62); nk.position.set(0,5.05,2.55); g.add(nk);
  T.on(nk,T.box(0.85,1.30,0.70,hide),0,0.60,0.80).rotation.x=0.35;
  T.on(g,T.box(0.72,1.10,1.70,hide), 0,3.55,2.70).rotation.x=-0.30;

  /* ---- THE HEAD ---- */
  const head=T.box(1.70,1.75,1.75,hide); head.position.set(0,6.05,4.05); g.add(head);
  const H=(m,x,y,z)=>{ m.position.set(x,y,z); head.add(m); return m; };
  H(T.box(1.60,0.38,0.62,dark),   0, 0.80,-0.15);            /* the dark poll */
  H(T.box(0.62,1.30,0.22,white),  0, 0.05, 0.86);            /* the white blaze */
  H(T.box(1.25,0.90,0.60,muz),    0,-0.46, 1.00);            /* the great wet muzzle */
  for(const s of [1,-1]) H(T.box(0.26,0.26,0.16,0x4b3a30), s*0.34,-0.34,1.30);
  const jaw=T.box(1.00,0.45,0.90,muz); jaw.geometry.translate(0,0,0.45);
  H(jaw, 0,-0.80, 0.30);
  for(const s of [1,-1]){
    H(T.box(0.34,0.34,0.18,0x120c08), s*0.62, 0.30, 0.62);   /* the eye */
    H(T.box(0.14,0.08,0.07,0xcfc4b4), s*0.66, 0.38, 0.68);
    /* the horn: two lengths, out and then up, as a dairy cow's are */
    const h1=T.limb(0.34,0.80,0.34,horn,0,0,s*1.25); h1.position.set(s*0.66,0.74,-0.20);
    head.add(h1);
    h1.add(T.limb(0.26,0.70,0.26,horn,0.80,0,s*-0.95));
  }
  const ears=[];
  for(const s of [1,-1]){
    const e=T.box(0.80,0.34,0.50,hide); e.geometry.translate(s*0.40,0,0);
    e.position.set(s*0.78,0.36,-0.20); e.rotation.z=s*-0.20; e.rotation.y=s*0.40;
    head.add(e); ears.push(e);
    T.on(e,T.box(0.52,0.12,0.32,muz), s*0.42,-0.14,0.02);
  }

  /* ---- THE TAIL ---- long, swinging, with the tuft on the end of it */
  const tail=T.limb(0.34,1.20,0.34,hide,0,2.85); tail.position.set(0,5.35,-4.70); g.add(tail);
  const t2=T.limb(0.28,1.05,0.28,hide,1.20,0.15); tail.add(t2);
  t2.add(T.limb(0.40,0.70,0.40,dark,1.05,0));

  /* ---- THE LEGS ---- and the cloven hoof under each */
  T.legs4(g,1.10,2.85,2.90,hide,0.72);
  for(const L of (g.userData.legs||[])){
    const shin=L.userData.knee; if(!shin) continue;
    T.on(shin,T.box(0.60,0.70,0.60,white), 0,-1.05,0);       /* the white sock */
    for(const c of [1,-1]) T.on(shin,T.box(0.28,0.42,0.60,hoof), c*0.16,-1.50,0.04);
  }

  g.userData.head=head;
  g.userData.jaw=jaw;
  g.userData.tail=tail;
  g.userData.ears=ears;
  return g;
}});
