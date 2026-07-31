/* THE PENGUIN — the fowl of the ice, which has wings and does not fly with
   them. Black across the back and the flippers, white from the throat down,
   an orange bill and orange feet, and a yellow flash over the eye. It stands
   upright as a man does, rocks from foot to foot when it walks, and goes
   belly-down on the ice when it is in a hurry.

   The whole world was already expecting it: js/size.js gives its height,
   js/behavior.js gives it its hours and its play, and world/fauna.js sets it
   on the floes, along the wall of ice, and in eight lands from the Falklands
   to New Zealand. Only the bird itself was never written — so every one of
   those places had a penguin named for it and nothing standing there. */
EARTH.beast({
name:'penguin',
realm:'land',
metres:1.15,
axis:'y',
build:function(T){
  const g=T.group();
  const BACK=0x1b1d24, BELLY=0xf2efe6, BILL=0xe0731f, FOOT=0xe0731f, CREST=0xe8c531;
  const legs=[];

  /* ---- the body: black behind, white before ---- */
  const body=T.box(1.5,2.5,1.15,BACK); body.position.y=2.35; g.add(body);
  const front=T.box(1.16,2.15,0.22,BELLY); front.position.set(0,2.32,0.60); g.add(front);
  /* the white runs up under the chin, as it does on a real bird */
  const bib=T.box(0.9,0.55,0.2,BELLY); bib.position.set(0,3.42,0.55); g.add(bib);

  /* ---- the head ---- */
  const head=T.box(1.15,1.05,1.0,BACK); head.position.y=4.05; g.add(head);
  const face=T.box(0.62,0.5,0.18,BELLY); face.position.set(0,3.92,0.52); g.add(face);
  const bill=T.box(0.34,0.3,0.62,BILL); bill.position.set(0,3.95,0.82); g.add(bill);
  for(const s of [1,-1]){
    const eye=T.box(0.16,0.18,0.12,0x0d0d11); eye.position.set(s*0.3,4.24,0.5); g.add(eye);
    /* the yellow flash over the eye */
    const cr=T.box(0.34,0.16,0.34,CREST); cr.position.set(s*0.42,4.46,0.18); g.add(cr);
  }

  /* ---- the flippers: they hang, and they SWING when it walks ---- */
  const flip=[];
  for(const s of [1,-1]){
    const f=T.box(0.24,1.85,0.78,BACK);
    f.geometry.translate(0,-0.92,0);          /* hinged at the shoulder */
    f.position.set(s*0.83,3.32,0);
    f.rotation.z=s*0.13;
    f.userData.ph=(s>0)?0:Math.PI;
    g.add(f); flip.push(f);
  }

  /* ---- the feet, set well forward, which is why it rocks ---- */
  for(const s of [1,-1]){
    const L=T.box(0.4,0.85,0.4,FOOT);
    L.geometry.translate(0,-0.42,0);
    L.position.set(s*0.4,1.1,0.05);
    L.userData.ph=(s>0)?0:Math.PI;
    g.add(L); legs.push(L);
    const foot=T.box(0.5,0.22,0.95,FOOT); foot.position.set(s*0.4,0.11,0.34); g.add(foot);
  }
  /* the little stiff tail it props itself on */
  const tail=T.box(0.7,0.3,0.6,BACK); tail.position.set(0,1.35,-0.72); tail.rotation.x=0.4; g.add(tail);

  /* legs drive the waddle; the flippers are handed to the same clock so they
     swing against the stride, as they do on the ice */
  g.userData={legs, arms:flip};
  return g;
}});
