/* ============================================================
   THE FLORA OF THE EARTH — every tree, herb and bearing thing
   ------------------------------------------------------------
   "And the earth brought forth grass, the herb yielding seed after his kind,
    and the tree yielding fruit, whose seed was in itself, after his kind."

   THE FAULT THIS FILE MENDS. There were FOUR plants in the whole world: a
   round green tree, a palm, a cherry in blossom, and a thorn. Every wood from
   Norway to Java was the same tree repeated, no country grew anything of its
   own, and there was not one apple, olive, date, coffee bush, vine or ear of
   corn on the entire earth. A traveller who crossed an ocean landed in the
   same forest he left.

   Now every land keeps its own growth. `world/flora.js` names, for each
   nation on the chart, what actually grows in it; this file knows how to
   BUILD what is named, and how to choose between them for a given piece of
   ground.

   ---- THE TWO FILES, AND WHICH IS WHICH ----
   world/flora.js  the data. What grows where. Edit it freely.
   js/flora.js     this file. The forms — how a conifer differs from a palm
                   from a baobab — and the choosing.
   js/grass.js     the SWARD, and only the sward: the low turf a beast eats.
                   Grass is a thing the herds live on and is asked about sixty
                   times a second, so it keeps its own small fast file. This
                   one is about everything WOODY and everything BEARING.

   ---- A HUNDRED SPECIES, AND NO NEW MATERIALS ----
   Leaf, bark, blade and fruit are each drawn ONCE, in grey. Every species
   tints its own faces as they are laid down (the mesher takes a colour where
   it used to take a shade). So the number of kinds of tree in the world costs
   nothing whatever in draw calls, and a new species is a line of data.
   ============================================================ */
(function(){
'use strict';

/* ---- THE FORMS ----
   A species is not a model; it is a FORM with numbers on it. There are only
   so many shapes a tree can be, and every tree on the earth is one of them:

     broad     the oak — three tiers, wide at the shoulder
     round     the beech, the lime — one great soft dome
     conifer   the pine, the spruce — stacked skirts, tapering to a spire
     column    the cypress, the poplar — a green pillar
     palm      a bare bole and fronds thrown out from the head
     thorn     the acacia — a flat table of leaf on a bare stem
     blossom   the cherry, the almond — a soft cloud, in flower
     bamboo    a clump of thin culms with leaf at the joints
     cactus    a column with two arms, and no leaf at all
     baobab    an enormous bole and a stub of crown, like a root in the air
     banana    no wood in it — great drooping blades from a false stem
     mangrove  low crown on a cage of stilt roots, standing in the water
     fern      the tree fern — a slender bole and a spray of fronds
     gum       the eucalypt — a tall pale bole, the crown high and thin
     spread    the banyan, the ceiba — buttressed, and wider than it is tall
     darkoak   a bole four square and a canopy down to the ground
     jungle    bare for six of its seven parts, and open only at the crown

   And for the low growth:
     shrub     a woody bush (berries hang in it if the kind bears them)
     herb      a cross-blade — corn, flax, lavender, a flowering herb
     cane      a clump of straight canes — reed, papyrus, sugar cane
     pad       the prickly pear — flat pads set edge on edge
     rosette   the agave, the aloe — blades thrown out from one crown
   ============================================================ */

const B=6;                     /* units to the block — a block is a metre */

/* ---- THE DATA ---- filled by world/flora.js through the engine ---- */
let D={kinds:{}, lands:{}, wilds:{}};
const listCache=new Map();
function load(d){
  D={kinds:(d&&d.kinds)||{}, lands:(d&&d.lands)||{}, wilds:(d&&d.wilds)||{}};
  listCache.clear();
  /* every colour a species names is turned into a tint ONCE, here, and never
     again — the mesher must not be dividing by 255 in its inner loop */
  for(const n in D.kinds){ const K=D.kinds[n]; K.name=n;
    K._leaf=tintOf(K.leaf); K._bole=tintOf(K.bole===undefined?0x6b4a2a:K.bole);
    K._fruit=K.fruit===undefined?null:tintOf(K.fruit);
    K._flower=K.flower===undefined?null:tintOf(K.flower);
    if(K.h===undefined) K.h=1; if(K.w===undefined) K.w=1;
    if(K.wt===undefined) K.wt=1;
    K.layer=K.layer||(LOW[K.form]?'plant':'tree');
    K._ever=(K.ever!==undefined)?!!K.ever:!!EVER_FORM[K.form];
    K._bark=barkOf(K); }                 /* §2.4.3 — settled once, never in the mesher */
}
const LOW={shrub:1,herb:1,cane:1,pad:1,rosette:1};
/* ---- WHICH TREES DO NOT TURN ----
   §2.4.4 wants the autumn colour with *"evergreens unchanged"*, and the
   gilding is worked out in the shader from LATITUDE — right for the zone,
   and blind to the tree. So a pine, a cypress and an olive standing in a
   temperate land went gold in October along with the oak beside them.

   EVERGREENNESS IS A FACT ABOUT THE SPECIES, NOT THE FORM. A larch is a
   conifer and bare all winter; an aspen is a column and the most golden tree
   there is; a holly is round and green in January. So the FORM gives a
   sensible default and any species may say otherwise with one datum —
   `ever:1` or `ever:0` in world/flora.js, where a reader can see it. */
const EVER_FORM={conifer:1, palm:1, cactus:1, pad:1, rosette:1, bamboo:1,
  jungle:1, mangrove:1, banana:1, fern:1, gum:1, thorn:1, spread:1};
/* the A/B switch: off, every leaf in the world is the one that turns, which
   is exactly how it stood before. A second material has to be paid for in
   draw calls and the price has to be measured, not assumed. */
let EVER=true;
/* ---- §2.4.3 — THE BARK OF EACH KIND ----
   The brief asks for a texture per species. A texture per species is a
   MATERIAL per species, and the one rule this whole file is built on is that
   a hundred and seventy species share four grey materials and tint their own
   faces — which is why a new species costs nothing at all. So the bark is
   ASSIGNED, exactly as the canopy form is assigned in §2.4.2, and for exactly
   the same reason. Six patterns, and the per-species TINT still sits on top
   of every one of them: a birch and an aspen wear the same paper in two
   different greys, as they do.

     paper   the birch — lenticels lying across a pale sheet
     ring    the palm, the tree fern — the scars of fallen fronds
     plate   the pine, the plane — broad plates with dark seams
     twist   the olive, the yew — the grain running round the bole
     cork    the cork oak, the redwood — wide soft-sided furrows
     smooth  the beech, the gum — near-bare, faintly streaked
     bark    the deep fissures — the oak, the ash, and the default

   A KIND SAYS `bark:'paper'` IN world/flora.js OR SAYS NOTHING, in which case
   its FORM answers for it below — a palm rings, a conifer plates, a gum is
   smooth. That way the whole earth is barked by adding one table, and a
   species that wants its own says so in its own line, where a reader sees it
   beside its leaf colour. Nothing here knows a species by name. */
const BARK_MAT={paper:'barkPaper', ring:'barkRing', plate:'barkPlate',
  twist:'barkTwist', cork:'barkCork', smooth:'barkSmooth', bark:'barkW'};
const BARK_FORM={palm:'ring', fern:'ring', banana:'ring', bamboo:'ring',
  conifer:'plate', column:'plate',
  gum:'smooth', round:'smooth', blossom:'smooth',
  thorn:'twist', spread:'cork', baobab:'cork', mangrove:'cork',
  jungle:'plate', darkoak:'bark', broad:'bark', cactus:'smooth'};
function barkOf(K){
  const w=K.bark||BARK_FORM[K.form]||'bark';
  return BARK_MAT[w]||'barkW';
}
function tintOf(hex){ return [((hex>>16)&255)/255, ((hex>>8)&255)/255, (hex&255)/255]; }

/* ---- WHAT WILL GROW HERE ----
   The ground underfoot, how high it stands, and whether the sun of this
   latitude is its own. A kind names the grounds it takes and nothing else
   will be planted on them. */
function fits(K,ground,hb,wet){
  if(K.g && K.g.indexOf(ground)<0) return false;
  if(K.hh && (hb<K.hh[0]||hb>K.hh[1])) return false;
  /* THE WATER'S EDGE. A kind marked `riv` grows on a river bank and nowhere
     else on the earth — the reed, the papyrus, the bulrush, the water lily,
     the paddy, the mangrove. Away from running water they simply are not
     there, which is why a river used to look exactly like the field beside
     it: nothing whatever knew where the water was. */
  if(K.riv && !wet) return false;
  return true;
}
/* THE LIST IS WORKED OUT ONCE PER COUNTRY, PER GROUND, PER BAND OF HEIGHT.
   The mesher asks this question for every treed cell in every chunk it
   builds; filtering a country's whole growth each time would be the most
   expensive thing in the game. Bands of six blocks are fine enough — no
   tree line moves inside one. */
/* on the bank, a kind that loves water is met this many times as often. The
   willow, the alder, the poplar, the date palm at the oasis — they grow away
   from water too, but where there IS water they crowd it. */
const WET_FAVOUR=5;
function gather(names,layer,ground,hb,wet){
  const out=[]; let w=0;
  for(const n of names){ const K=D.kinds[n]; if(!K||K.layer!==layer) continue;
    if(!fits(K,ground,hb,wet)) continue;
    out.push(K); w+=(wet&&(K.wet||K.riv))?K.wt*WET_FAVOUR:K.wt; }
  return out.length?{a:out,w:w,wet:!!wet}:null;
}
function listFor(land,ground,hb,layer,wet){
  const band=Math.min(12,Math.max(0,Math.floor(hb/6)));
  const key=land+'|'+ground+'|'+band+'|'+layer+(wet?'|w':'');
  let L=listCache.get(key);
  if(L!==undefined) return L;
  const names=(land&&D.lands[land])||D.wilds[ground]||null;
  L=names?gather(names,layer,ground,band*6+3,wet):null;
  /* a land whose own list grows nothing on this ground still has the climate
     to fall back on — a village on bare rock in Kenya is not treeless because
     Kenya's list is all lowland */
  if(!L&&land&&D.wilds[ground]) L=gather(D.wilds[ground],layer,ground,band*6+3,wet);
  if(listCache.size>4000) listCache.clear();
  listCache.set(key,L||null);
  return L||null;
}
function draw(L,j){ let r=j*L.w;
  for(const K of L.a){ r-=(L.wet&&(K.wet||K.riv))?K.wt*WET_FAVOUR:K.wt; if(r<=0) return K; }
  return L.a[L.a.length-1]; }

/* ---- WHICH TREE STANDS ON THIS CELL ----
   Seeded on a TILE of ground, not on the cell — a wood is one kind of wood
   with others mixed through it, not a different species every six metres.
   The tile is eight cells across, so a stand of pine runs about fifty
   metres before it gives way to birch. */
function treeAt(land,ground,hb,ix,iz,hash,wet){
  const L=listFor(land,ground,hb,'tree',wet); if(!L) return null;
  const j=hash(Math.floor(ix/8)*1.7+3.1, Math.floor(iz/8)*2.3-7.7);
  /* and one cell in six takes its OWN draw, so the stand is mixed and not a
     plantation of one thing */
  const m=hash(ix*5.3-1.1,iz*3.9+6.2);
  const k=(m<0.17)?hash(ix*0.91,iz*1.13):j;
  return draw(L,k);
}
/* ---- AND WHAT LOW THING STANDS ON IT ----
   Sparser than the grass, and drawn against its own number, so the herb layer
   and the sward do not fight over the same cells. `wild` is how far the
   ground lies from a settled place — a village keeps its own ground cut. */
/* how thickly the low growth stands on each ground. A meadow is full of it;
   a beach, a scree and a salt waste are all but bare, and must LOOK bare —
   at one rate for the whole earth the strand of every Greek island came up
   knee-deep in saltbush. */
const PLANT_DENS={grass:1, tropic:1, savanna:0.8, alpine:0.7, tundra:0.55,
  desert:0.4, badlands:0.3, rock:0.25, sand:0.16, snow:0.12};
function plantAt(land,ground,hb,ix,iz,hash,wild,wet){
  let d=PLANT_DENS[ground]; if(d===undefined) return null;
  /* A BANK IS LUSH, whatever the country it runs through. The one green
     thread across a desert is the one place in it that is not a desert. */
  if(wet) d=Math.max(d,0.9)*1.8;
  const L=listFor(land,ground,hb,'plant',wet); if(!L) return null;
  const j=hash(ix*2.7+13.9,iz*1.9-4.3);
  if(j>=0.085*d*(wild===undefined?1:wild)) return null;
  return draw(L,hash(Math.floor(ix/5)*3.3-2.2,Math.floor(iz/5)*1.7+8.8));
}
/* ---- AND THE YOUNG GROWTH ----
   A wood in which every tree is full-grown is a plantation. A sapling is a
   TREE of this country, drawn knee-high: the same species that stands grown
   all round it, so the young oak is under the oaks and the young date palm
   at the oasis. Its own sparse draw again, after the herbs have had theirs. */
function saplingAt(land,ground,hb,ix,iz,hash,wild,wet){
  const d=PLANT_DENS[ground]; if(d===undefined) return null;
  const L=listFor(land,ground,hb,'tree',wet); if(!L) return null;
  const j=hash(ix*1.13-21.7,iz*3.41+17.3);
  if(j>=0.018*d*(wild===undefined?1:wild)) return null;
  /* it is drawn from the SAME tile-seed the grown wood is, so the seedlings
     under a stand of pine are pine */
  return draw(L,hash(Math.floor(ix/8)*1.7+3.1, Math.floor(iz/8)*2.3-7.7));
}

/* ============================================================
   THE BUILDING — every form, in blocks
   `kit` is what the engine lends this file: {emitBox, cross, hash, B, M}
   where M names the four grey materials everything is drawn with.
   ============================================================ */

/* the fruit, hung where the kind hangs it. A fruit tree that does not show
   its fruit is just a tree, and the whole point of an orchard is that you can
   see from across the field what it is. */
function fruitOn(kit,K,x,z,y0,y1,r,S){
  if(!K._fruit) return;
  const {emitBox,hash,M}=kit;
  /* AND NOT TOO MANY OF THEM. Every fruit is a six-sided box, so a dozen on
     a tree is seventy-two faces for a handful of pixels — an orchard would
     cost more to draw than the wood it stands in. Five or six reads as laden
     from any distance you will ever see it at. */
  const n=Math.max(3,Math.min(7,Math.round((K.fn||5)*S)));
  const s=B*(K.fs||0.3)*S;
  for(let i=0;i<n;i++){
    const a=hash(x*0.13+i*7.7, z*0.11-i*3.3)*6.283;
    /* ON THE OUTSIDE OF THE CROWN, and low in it. Hung at half the radius it
       was swallowed whole by the leaf and an orchard looked like a wood —
       which is the one thing an orchard must never look like. It is set just
       PROUD of the leaf now, and toward the underside, where fruit hangs. */
    const rr=r*(0.92+0.22*hash(x*0.07-i*2.1,z*0.09+i*5.5));
    const fy=y0+(y1-y0)*0.35*hash(x*0.05+i,z*0.03-i);
    const fx=x+Math.cos(a)*rr, fz=z+Math.sin(a)*rr;
    emitBox(kit.G, fx-s,fy-s,fz-s, fx+s,fy+s,fz+s, M.solid,M.solid,M.solid, K._fruit);
  }
}
/* a bole, tapering or straight */
function bole(kit,K,x,z,yT,h,w){
  const BK=K._bark||kit.M.bark;   /* §2.4.3 — this kind's own bark */
  const {emitBox,M}=kit;
  emitBox(kit.G, x-w,yT,z-w, x+w,yT+h,z+w, BK,BK,null, K._bole);
}

/* ============================================================
   THE BOUGHS — §2.4.1, and the reason every wood looked the same
   ------------------------------------------------------------
   *"Branching. Two or three orders of branch by a small L-system, with real
   taper. Every tree in the world stops looking like every other tree."*

   THE FAULT. The oak — which is the DEFAULT form, and most of the world's
   wood — was one bole and three crown boxes stacked on the middle of it,
   with not a branch anywhere. Every oak in the world was therefore the same
   oak at a different size: the crown was centred on the trunk, symmetrical
   about both axes, and the only thing that varied between one tree and the
   next was how big the identical shape was. A wood of a hundred of them read
   as one tree stamped a hundred times, which is exactly Minecraft's fault
   and exactly what §2.4 says to stop doing.

   WHAT IT DOES. Three or four boughs are thrown out from the top of the
   bole, each in its own direction, each of its own length and rise, each in
   TWO segments that taper as they go — and the leaf is no longer a blob on
   the trunk but a cluster ON THE END OF EACH BOUGH, with a smaller mass at
   the heart. Every number in it comes off the cell's own hash, so no two
   trees on the earth are alike and the wood is the same wood every time it
   is meshed.

   WHICH FORMS GET THEM, AND WHY NOT ALL. A cypress is a green pillar and a
   palm is a bare stem with fronds on the head; branching them would be
   drawing something that is not a cypress and not a palm. The forms that get
   boughs are the ones a bough is TRUE of — the hardwoods — and the list is
   here, not in world/flora.js, because it is a fact about the FORM and not
   about any species. Add `broad` to a new species and it branches; nothing
   else has to be said.

   AND IT IS SWITCHED, because it costs geometry and the brief is plain that
   beauty which halves the frame rate is not beauty. See AUDIT for what it
   measured at.
   ============================================================ */
/* the forms a bough is TRUE of, and that are wired for one. The dark oak,
   the gum and the jungle giant are hardwoods too and are not here yet: each
   builds its own crown for its own reason and wants its own hand. Saying so
   here is cheaper than a list that claims more than it does. */
const BOUGHED={broad:1, round:1, blossom:1};
let BOUGHS=true;
/* THE ENVELOPE DOES NOT GROW. This is the one number that matters and the
   first cut got it wrong: the boughs reached out on their own scale and hung
   a full-sized cluster on each tip, so a crown that had been 1.9 blocks
   across became nearly 3, every tree in the wood overlapped its neighbours,
   and a stand of oak read as ONE GREEN SLAB — worse than the blob it
   replaced. The reach and the leaf are struck off the crown radius the form
   already had, so a branched tree occupies the same room an unbranched one
   did. What changes is its SHAPE, which was the point. */
function boughsOn(kit,K,x,z,yB,tw,rad,ix,iz,out){
  const BK=K._bark||kit.M.bark;   /* §2.4.3 — this kind's own bark */
  const {emitBox,hash,M}=kit;
  const n=3+(hash(ix*0.41+3.7,iz*0.53-2.9)>0.52?1:0);
  const a0=hash(ix*0.77-1.1,iz*0.29+4.3)*6.283;
  for(let i=0;i<n;i++){
    /* evenly round, then knocked off true — a tree with its boughs at exact
       thirds is as regular as no boughs at all */
    const a=a0+i*(6.283/n)+(hash(ix+i*5.1,iz-i*3.3)-0.5)*0.85;
    const ca=Math.cos(a), sa=Math.sin(a);
    let px=x, pz=z, py=yB, r=tw*0.58;
    const reach=rad*(0.19+0.15*hash(ix*2.1+i*1.7,iz*1.7-i*2.3));
    const rise =rad*(0.15+0.19*hash(ix*1.3-i*3.1,iz*2.7+i*1.1));
    for(let k=0;k<2;k++){
      const nx=px+ca*reach, nz=pz+sa*reach, ny=py+rise*(k?0.60:1);
      emitBox(kit.G, Math.min(px,nx)-r, py-r*0.5, Math.min(pz,nz)-r,
                     Math.max(px,nx)+r, ny+r*0.5, Math.max(pz,nz)+r,
              BK,BK,BK, K._bole);
      px=nx; pz=nz; py=ny; r*=0.58;
    }
    out.push({x:px, z:pz, y:py});
  }
}
/* and the leaf, hung on the ends of them — small enough that the tips and
   the heart together come to about the crown the form always had */
function leafOnBoughs(kit,K,tips,rad,lm,LF){
  const {emitBox}=kit;
  const s=rad*0.42;
  for(const t of tips)
    emitBox(kit.G, t.x-s,t.y-s*0.66,t.z-s, t.x+s,t.y+s*0.74,t.z+s, lm,lm,lm, LF);
}

function emitTree(kit,K,ix,iz,cc){
  const BK=K._bark||kit.M.bark;   /* §2.4.3 — this kind's own bark */
  const {emitBox,hash,M}=kit;
  const x=(ix+0.5)*B, z=(iz+0.5)*B, yT=cc.h*B;
  /* a long tail toward the giants: most are middling, a few tower */
  const q=hash(ix*0.73+11.3,iz*0.91-5.7);
  const S=(0.62+Math.pow(q,0.55)*1.25+(hash(ix*3.1,iz*2.3)>0.965?0.85:0))*K.h;
  const W=S*K.w;
  const LF=K._leaf;
  /* the evergreen's leaf is the same leaf, drawn with the material that is
     never given the season — see js/engine.js */
  const lm=(EVER&&K._ever&&M.ever)?M.ever:M.leaf;
  const F=K.form;

  if(F==='conifer'){
    /* THE PINE — a straight bole running the whole height, and skirts of
       needle stacked round it, each narrower than the one below, to a spire */
    const H=B*5.2*S, tw=B*(0.22+0.13*S);
    bole(kit,K,x,z,yT,H,tw);
    const tiers=4+Math.floor(hash(ix*1.3,iz*2.9)*3);
    const y0=yT+H*(K.bare===undefined?0.28:K.bare);
    for(let i=0;i<tiers;i++){
      const t=i/(tiers-1||1);
      const r=B*(1.75-1.45*t)*W, hgt=(H-(y0-yT))/tiers*1.15;
      const yy=y0+(H-(y0-yT))*t*0.92;
      emitBox(kit.G, x-r,yy,z-r, x+r,yy+hgt,z+r, lm,lm,lm, LF);
    }
    emitBox(kit.G, x-B*0.3*W,yT+H,z-B*0.3*W, x+B*0.3*W,yT+H+B*0.7*W,z+B*0.3*W, lm,lm,lm, LF);
    fruitOn(kit,K,x,z,y0,yT+H*0.8,B*1.0*W,S);
    return;
  }
  if(F==='column'){
    /* THE CYPRESS — a green pillar. It is all crown and no shape at all, and
       three of them on a headland make the whole coast Mediterranean. */
    const H=B*5.6*S, tw=B*0.2*S;
    bole(kit,K,x,z,yT,H*0.35,tw);
    const r=B*0.7*W;
    emitBox(kit.G, x-r,yT+H*0.12,z-r, x+r,yT+H*0.92,z+r, lm,lm,lm, LF);
    emitBox(kit.G, x-r*0.55,yT+H*0.92,z-r*0.55, x+r*0.55,yT+H*1.08,z+r*0.55, lm,lm,lm, LF);
    return;
  }
  if(F==='palm'){
    /* a bare bole and fronds thrown out from the head, and the nuts or the
       dates under them where the kind bears */
    const H=B*4.6*S, tw=B*(0.24+0.14*S);
    bole(kit,K,x,z,yT,H,tw);
    const r=B*1.7*W, t=B*0.5*W;
    emitBox(kit.G, x-r,yT+H,z-t, x+r,yT+H+B*0.6*W,z+t, lm,lm,lm, LF);
    emitBox(kit.G, x-t,yT+H,z-r, x+t,yT+H+B*0.6*W,z+r, lm,lm,lm, LF);
    /* the diagonal pair, so the head is a star and not a cross */
    const d=r*0.62;
    emitBox(kit.G, x-d,yT+H-B*0.12*W,z-d, x+d,yT+H+B*0.4*W,z+d, lm,lm,lm, LF);
    fruitOn(kit,K,x,z,yT+H-B*0.5*W,yT+H,B*0.55*W,S);
    return;
  }
  if(F==='thorn'){
    /* THE THORN TREE — the acacia, and the whole silhouette of the plain. The
       bole runs up bare and then throws its branches out FLAT at the top into
       a table of leaf a giraffe can just reach the underside of. */
    const H=B*4.0*S, tw=B*(0.28+0.18*S);
    bole(kit,K,x,z,yT,H,tw);
    for(const d of [[1,0],[-1,0],[0,1],[0,-1]])
      emitBox(kit.G, x+d[0]*B*0.4*W-B*0.16*W, yT+H-B*0.5*W, z+d[1]*B*0.4*W-B*0.16*W,
                     x+d[0]*B*1.1*W+B*0.16*W, yT+H+B*0.1*W, z+d[1]*B*1.1*W+B*0.16*W,
                     BK,BK,null, K._bole);
    emitBox(kit.G, x-B*1.9*W,yT+H,z-B*1.9*W, x+B*1.9*W,yT+H+B*0.45*W,z+B*1.9*W, lm,lm,lm, LF);
    emitBox(kit.G, x-B*1.2*W,yT+H+B*0.45*W,z-B*1.2*W, x+B*1.2*W,yT+H+B*0.75*W,z+B*1.2*W, lm,lm,lm, LF);
    fruitOn(kit,K,x,z,yT+H,yT+H+B*0.4*W,B*1.4*W,S);
    return;
  }
  if(F==='baobab'){
    /* THE BAOBAB — the fattest bole on the earth under a stub of crown, so
       that it looks for all the world like a tree planted upside down. */
    const H=B*3.4*S, tw=B*(0.95+0.35*S);
    emitBox(kit.G, x-tw,yT,z-tw, x+tw,yT+H*0.72,z+tw, BK,BK,null, K._bole);
    emitBox(kit.G, x-tw*0.62,yT+H*0.72,z-tw*0.62, x+tw*0.62,yT+H,z+tw*0.62, BK,BK,null, K._bole);
    /* the boughs go up and OUT, and the leaf sits on the ends of them like a
       handful of twigs held up — which is exactly what a baobab looks like */
    for(const d of [[1,0],[-1,0],[0,1],[0,-1],[1,1],[-1,-1],[1,-1],[-1,1]]){
      const ax=x+d[0]*tw*1.25, az=z+d[1]*tw*1.25;
      emitBox(kit.G, Math.min(x,ax)-B*0.16*W, yT+H, Math.min(z,az)-B*0.16*W,
                     Math.max(x,ax)+B*0.16*W, yT+H+B*1.0*W, Math.max(z,az)+B*0.16*W,
                     BK,BK,null, K._bole);
      emitBox(kit.G, ax-B*0.95*W,yT+H+B*0.85*W,az-B*0.95*W,
                     ax+B*0.95*W,yT+H+B*1.35*W,az+B*0.95*W, lm,lm,lm, LF); }
    emitBox(kit.G, x-tw*1.1,yT+H+B*0.9*W,z-tw*1.1, x+tw*1.1,yT+H+B*1.3*W,z+tw*1.1, lm,lm,lm, LF);
    fruitOn(kit,K,x,z,yT+H+B*0.6*W,yT+H+B*1.0*W,tw*1.4,S);
    return;
  }
  if(F==='banana'){
    /* NO WOOD IN IT AT ALL — a false stem of rolled leaf, and great blades
       drooping off the head of it. And the hand of fruit beneath them. */
    const H=B*2.4*S, tw=B*0.3*S;
    emitBox(kit.G, x-tw,yT,z-tw, x+tw,yT+H,z+tw, lm,lm,null, K._bole);
    /* four blades, each thrown out along ITS OWN axis and drooping. (They
       were all laid across the same one, so a banana was a plank.) */
    const r=B*1.6*W, hb=B*0.22*W, nar=B*0.42*W;
    for(const d of [[1,0],[-1,0],[0,1],[0,-1]]){
      const ex=x+d[0]*r, ez=z+d[1]*r;
      emitBox(kit.G, Math.min(x,ex)-(d[0]?0:nar), yT+H-B*0.5*W, Math.min(z,ez)-(d[1]?0:nar),
                     Math.max(x,ex)+(d[0]?0:nar), yT+H-B*0.5*W+hb*2, Math.max(z,ez)+(d[1]?0:nar),
                     lm,lm,lm, LF);
      /* and the tip of each blade hangs down */
      emitBox(kit.G, ex-nar*0.7, yT+H-B*1.1*W, ez-nar*0.7,
                     ex+nar*0.7, yT+H-B*0.5*W, ez+nar*0.7, lm,lm,lm, LF); }
    emitBox(kit.G, x-nar,yT+H-B*0.2*W,z-nar, x+nar,yT+H+B*0.4*W,z+nar, lm,lm,lm, LF);
    if(K._fruit) emitBox(kit.G, x-B*0.34,yT+H-B*0.95,z-B*0.34, x+B*0.34,yT+H-B*0.3,z+B*0.34,
                         M.solid,M.solid,M.solid, K._fruit);
    return;
  }
  if(F==='mangrove'){
    /* it stands in the water on a cage of stilt roots, and that cage is the
       only reason the coast it grows on holds together at all */
    const H=B*3.0*S, tw=B*0.28*S;
    for(const d of [[1,1],[1,-1],[-1,1],[-1,-1]]){
      const rx=x+d[0]*B*0.75*W, rz=z+d[1]*B*0.75*W;
      emitBox(kit.G, rx-B*0.13,yT-B*1.2,rz-B*0.13, rx+B*0.13,yT+H*0.42,rz+B*0.13, BK,BK,null, K._bole); }
    bole(kit,K,x,z,yT+H*0.30,H*0.7,tw);
    const r=B*1.5*W;
    emitBox(kit.G, x-r,yT+H,z-r, x+r,yT+H+B*0.85*W,z+r, lm,lm,lm, LF);
    return;
  }
  if(F==='bamboo'){
    /* not one plant but a CLUMP of them — thin culms of different heights out
       of the same root, and the leaf only at the joints */
    const n=4+Math.floor(hash(ix*2.1,iz*4.3)*4);
    for(let i=0;i<n;i++){
      const a=hash(ix+i*3.7,iz-i*1.9)*6.283, rr=B*(0.3+1.1*hash(ix-i,iz+i))*W;
      const cx=x+Math.cos(a)*rr, cz=z+Math.sin(a)*rr;
      const H=B*(4.0+3.0*hash(ix*1.7+i,iz*2.3-i))*S, tw=B*0.15;
      emitBox(kit.G, cx-tw,yT,cz-tw, cx+tw,yT+H,cz+tw, BK,BK,null, K._bole);
      for(let k=2;k<5;k++){ const yy=yT+H*(k/5);
        emitBox(kit.G, cx-B*0.42,yy,cz-B*0.42, cx+B*0.42,yy+B*0.28,cz+B*0.42, lm,lm,lm, LF); }
      emitBox(kit.G, cx-B*0.5,yT+H-B*0.3,cz-B*0.5, cx+B*0.5,yT+H+B*0.35,cz+B*0.5, lm,lm,lm, LF);
    }
    return;
  }
  if(F==='cactus'){
    /* a column with two arms and no leaf on it anywhere. It is drawn in the
       leaf material so it keeps the sway — a saguaro in a gale does move. */
    const H=B*(2.6+2.4*S), r=B*0.36*S;
    emitBox(kit.G, x-r,yT,z-r, x+r,yT+H,z+r, BK,BK,null, K._leaf);
    for(const s of [1,-1]){ if(hash(ix*1.9+s,iz*2.7)<0.42) continue;
      const ax=x+s*B*0.75*S, yy=yT+H*0.42;
      emitBox(kit.G, x+(s>0?r:-B*0.9*S),yy,z-r*0.8, x+(s>0?B*0.9*S:-r),yy+B*0.34,z+r*0.8, BK,BK,null, K._leaf);
      emitBox(kit.G, ax-r*0.8,yy,z-r*0.8, ax+r*0.8,yy+H*0.42,z+r*0.8, BK,BK,null, K._leaf); }
    fruitOn(kit,K,x,z,yT+H*0.85,yT+H,r*1.2,S*0.6);
    return;
  }
  if(F==='fern'){
    /* THE TREE FERN — a slender scaly bole and one spray of frond, and the
       forests it grows in have not changed since before there were flowers */
    const H=B*3.0*S, tw=B*0.2*S;
    bole(kit,K,x,z,yT,H,tw);
    const r=B*1.5*W;
    emitBox(kit.G, x-r,yT+H,z-B*0.4*W, x+r,yT+H+B*0.35*W,z+B*0.4*W, lm,lm,lm, LF);
    emitBox(kit.G, x-B*0.4*W,yT+H,z-r, x+B*0.4*W,yT+H+B*0.35*W,z+r, lm,lm,lm, LF);
    emitBox(kit.G, x-B*0.7*W,yT+H+B*0.2*W,z-B*0.7*W, x+B*0.7*W,yT+H+B*0.6*W,z+B*0.7*W, lm,lm,lm, LF);
    return;
  }
  if(F==='gum'){
    /* THE EUCALYPT — a tall pale bole with the bark hanging off it in
       ribbons, and the crown carried high and thin, so the light comes
       straight through a forest of them onto the ground */
    const H=B*6.2*S, tw=B*(0.24+0.14*S);
    bole(kit,K,x,z,yT,H,tw);
    for(const d of [[1,1],[-1,1],[1,-1],[-1,-1]]){
      const bx=x+d[0]*B*0.9*W, bz=z+d[1]*B*0.9*W;
      emitBox(kit.G, Math.min(x,bx)-B*0.1,yT+H*0.74,Math.min(z,bz)-B*0.1,
                     Math.max(x,bx)+B*0.1,yT+H*0.86,Math.max(z,bz)+B*0.1, BK,BK,null, K._bole);
      emitBox(kit.G, bx-B*0.85*W,yT+H*0.84,bz-B*0.85*W, bx+B*0.85*W,yT+H*1.02,bz+B*0.85*W, lm,lm,lm, LF); }
    emitBox(kit.G, x-B*0.9*W,yT+H*0.96,z-B*0.9*W, x+B*0.9*W,yT+H*1.12,z+B*0.9*W, lm,lm,lm, LF);
    return;
  }
  if(F==='spread'){
    /* THE BANYAN, THE CEIBA, THE FIG OF THE TROPICS — buttressed at the
       foot, wider than it is tall, and letting its own branches down to the
       ground to root again. One tree, and it reads as a grove. */
    const H=B*3.8*S, tw=B*(0.5+0.3*S);
    bole(kit,K,x,z,yT,H,tw);
    for(const d of [[1,0],[-1,0],[0,1],[0,-1]]){          /* the buttresses */
      const bx=x+d[0]*tw*1.5, bz=z+d[1]*tw*1.5;
      emitBox(kit.G, bx-B*0.22,yT,bz-B*0.22, bx+B*0.22,yT+H*0.34,bz+B*0.22, BK,BK,null, K._bole); }
    const r=B*2.5*W;
    emitBox(kit.G, x-r,yT+H,z-r, x+r,yT+H+B*0.8*W,z+r, lm,lm,lm, LF);
    emitBox(kit.G, x-r*0.62,yT+H+B*0.8*W,z-r*0.62, x+r*0.62,yT+H+B*1.25*W,z+r*0.62, lm,lm,lm, LF);
    /* and the banyan and its kin — and ONLY they — let branches down to the
       ground to root again. A mahogany on stilts is not a mahogany. */
    if(K.props) for(const d of [[1,1],[-1,-1],[1,-1]]){
      const px=x+d[0]*r*0.66, pz=z+d[1]*r*0.66;
      emitBox(kit.G, px-B*0.15,yT,pz-B*0.15, px+B*0.15,yT+H+B*0.3,pz+B*0.15, BK,BK,null, K._bole); }
    fruitOn(kit,K,x,z,yT+H,yT+H+B*0.7*W,r*0.8,S);
    return;
  }
  if(F==='darkoak'){
    /* THE DARK OAK — a bole four square instead of one, and a canopy that
       comes down almost to the ground and puts the wood under it in shadow.
       Where these stand you cannot see far, and that is the point of them. */
    const H=B*3.0*S, tw=B*(0.52+0.26*S);
    emitBox(kit.G, x-tw,yT,z-tw, x+tw,yT+H,z+tw, BK,BK,null, K._bole);
    const r=B*2.3*W;
    emitBox(kit.G, x-r,yT+H-B*1.1*W,z-r, x+r,yT+H+B*0.2*W,z+r, lm,lm,lm, LF);
    emitBox(kit.G, x-r*0.72,yT+H+B*0.2*W,z-r*0.72, x+r*0.72,yT+H+B*0.7*W,z+r*0.72, lm,lm,lm, LF);
    /* and the boughs that reach out under the skirt of it */
    for(const d of [[1,1],[-1,1],[1,-1],[-1,-1]]){
      const bx=x+d[0]*r*0.72, bz=z+d[1]*r*0.72;
      emitBox(kit.G, bx-B*0.7*W,yT+H-B*1.5*W,bz-B*0.7*W, bx+B*0.7*W,yT+H-B*0.9*W,bz+B*0.7*W, lm,lm,lm, LF); }
    fruitOn(kit,K,x,z,yT+H-B*1.3*W,yT+H,r*0.9,S);
    return;
  }
  if(F==='jungle'){
    /* THE JUNGLE GIANT — it runs up bare for most of its length and only
       opens out at the very top, because everything below is somebody else's
       canopy. Vines come down off the crown. */
    const H=B*7.0*S, tw=B*(0.34+0.22*S);
    bole(kit,K,x,z,yT,H,tw);
    const r=B*2.0*W;
    emitBox(kit.G, x-r,yT+H-B*0.5*W,z-r, x+r,yT+H+B*0.4*W,z+r, lm,lm,lm, LF);
    emitBox(kit.G, x-r*0.6,yT+H+B*0.4*W,z-r*0.6, x+r*0.6,yT+H+B*0.95*W,z+r*0.6, lm,lm,lm, LF);
    for(const d of [[1,0],[0,1],[-1,0],[0,-1]]){          /* the vines let down */
      const vx=x+d[0]*r*0.8, vz=z+d[1]*r*0.8;
      const vl=B*(1.2+2.2*hash(ix+d[0]*3.1,iz+d[1]*7.7));
      emitBox(kit.G, vx-B*0.1,yT+H-B*0.5*W-vl,vz-B*0.1, vx+B*0.1,yT+H-B*0.5*W,vz+B*0.1, lm,lm,lm, LF); }
    fruitOn(kit,K,x,z,yT+H-B*0.4*W,yT+H+B*0.3*W,r*0.9,S);
    return;
  }
  if(F==='round'||F==='blossom'){
    /* one great soft dome — the beech, the lime, and the orchard tree in
       flower. The blossom kinds carry their flower colour in the leaf. */
    const H=B*3.4*S*(F==='blossom'?0.9:1), tw=B*(0.28+0.2*S);
    bole(kit,K,x,z,yT,H,tw);
    const r=B*1.9*W;
    if(BOUGHS&&BOUGHED[F]){
      /* the dome is broken open: a smaller heart, and the rest of the leaf
         carried out on the boughs, so the crown sits where the wood is */
      const tips=[];
      boughsOn(kit,K,x,z,yT+H-B*0.30*W,tw,r,ix,iz,tips);
      emitBox(kit.G, x-r*0.55,yT+H-B*0.40*W,z-r*0.55, x+r*0.55,yT+H+B*0.58*W,z+r*0.55, lm,lm,lm, LF);
      leafOnBoughs(kit,K,tips,r,lm,LF);
      fruitOn(kit,K,x,z,yT+H-B*0.5*W,yT+H+B*0.6*W,r*0.9,S);
      return;
    }
    emitBox(kit.G, x-r,yT+H-B*0.5*W,z-r, x+r,yT+H+B*0.5*W,z+r, lm,lm,lm, LF);
    emitBox(kit.G, x-r*0.6,yT+H+B*0.5*W,z-r*0.6, x+r*0.6,yT+H+B*1.15*W,z+r*0.6, lm,lm,lm, LF);
    fruitOn(kit,K,x,z,yT+H-B*0.5*W,yT+H+B*0.6*W,r*0.85,S);
    return;
  }
  /* ---- THE OAK, AND EVERYTHING SHAPED LIKE ONE ---- three tiers, wide at
     the shoulder. This is the default, and most of the world's wood is it. */
  const H=B*3.6*S, tw=B*(0.30+0.20*S);
  bole(kit,K,x,z,yT,H,tw);
  if(BOUGHS&&BOUGHED[F]){
    /* THE OAK, BRANCHED. The three stacked tiers went with the boughs: they
       were what a crown looks like when there is nothing to hang it on. */
    const cr=B*1.45*W;                  /* the room the three old tiers filled */
    const tips=[];
    boughsOn(kit,K,x,z,yT+H-B*0.95*W,tw,cr,ix,iz,tips);
    emitBox(kit.G, x-cr*0.56,yT+H-B*1.05*W,z-cr*0.56, x+cr*0.56,yT+H+B*0.45*W,z+cr*0.56, lm,lm,lm, LF);
    leafOnBoughs(kit,K,tips,cr,lm,LF);
    fruitOn(kit,K,x,z,yT+H-B*1.0*W,yT+H+B*0.5*W,B*1.35*W,S);
    return;
  }
  emitBox(kit.G, x-B*1.05*W,yT+H-B*1.5*W,z-B*1.05*W, x+B*1.05*W,yT+H-B*0.8*W,z+B*1.05*W, lm,lm,lm, LF);
  emitBox(kit.G, x-B*1.55*W,yT+H-B*0.9*W,z-B*1.55*W, x+B*1.55*W,yT+H+B*0.35*W,z+B*1.55*W, lm,lm,lm, LF);
  emitBox(kit.G, x-B*0.8*W, yT+H+B*0.35*W,z-B*0.8*W,  x+B*0.8*W, yT+H+B*1.25*W,z+B*0.8*W,  lm,lm,lm, LF);
  fruitOn(kit,K,x,z,yT+H-B*1.2*W,yT+H+B*0.4*W,B*1.35*W,S);
}

/* ============================================================
   THE LOW GROWTH — bushes, herbs, canes, pads and rosettes
   ============================================================ */
function emitPlant(kit,K,ix,iz,cc){
  const BK=K._bark||kit.M.bark;   /* §2.4.3 — this kind's own bark */
  const {emitBox,cross,hash,M}=kit;
  const x=(ix+0.5)*B, z=(iz+0.5)*B, yT=cc.h*B;
  const s=hash(ix*1.31-4.4,iz*1.77+8.1);
  const S=(0.7+0.6*s)*K.h;
  const F=K.form;

  if(F==='shrub'){
    /* a woody bush — and if the kind bears, the fruit is ON it, so a bramble
       in autumn is a bramble and not a green lump */
    const r=B*(0.4+0.34*s)*K.w, hh=B*(0.55+0.7*s)*K.h;
    emitBox(kit.G, x-r,yT,z-r, x+r,yT+hh,z+r, M.leaf,M.leaf,null, K._leaf);
    if(s>0.6) emitBox(kit.G, x-r*0.55,yT+hh,z-r*0.55, x+r*0.55,yT+hh+B*0.35,z+r*0.55, M.leaf,M.leaf,M.leaf, K._leaf);
    if(K._fruit) fruitOn({G:kit.G,emitBox,hash,M},K,x,z,yT+hh*0.35,yT+hh,r*0.95,0.55);
    return;
  }
  if(F==='cane'){
    /* reed, papyrus, sugar cane — straight canes out of wet ground, with the
       head on the top of each one */
    const n=3+Math.floor(hash(ix*3.1,iz*1.7)*4);
    for(let i=0;i<n;i++){
      const a=hash(ix+i*2.3,iz-i*4.1)*6.283, rr=B*0.4*hash(ix-i*1.3,iz+i*0.7);
      const cx=x+Math.cos(a)*rr, cz=z+Math.sin(a)*rr;
      const hh=B*(1.1+1.5*hash(ix*1.1+i,iz*1.9-i))*K.h;
      emitBox(kit.G, cx-B*0.07,yT,cz-B*0.07, cx+B*0.07,yT+hh,cz+B*0.07, BK,BK,null, K._bole);
      emitBox(kit.G, cx-B*0.2,yT+hh-B*0.1,cz-B*0.2, cx+B*0.2,yT+hh+B*0.4,cz+B*0.2,
              M.leaf,M.leaf,M.leaf, K._flower||K._leaf); }
    return;
  }
  if(F==='pad'){
    /* the prickly pear — flat pads set edge on edge, and the fruit sitting on
       the rim of the topmost */
    let py=yT, n=2+Math.floor(s*3);
    for(let i=0;i<n;i++){
      const w=B*(0.5-0.07*i)*K.w, hh=B*(0.62-0.08*i)*K.h, t=B*0.13;
      const rot=(i%2)===0;
      emitBox(kit.G, x-(rot?w:t),py,z-(rot?t:w), x+(rot?w:t),py+hh,z+(rot?t:w), M.leaf,M.leaf,M.leaf, K._leaf);
      py+=hh*0.86; }
    if(K._fruit) fruitOn({G:kit.G,emitBox,hash,M},K,x,z,py,py+B*0.2,B*0.3,0.5);
    return;
  }
  if(F==='rosette'){
    /* the agave, the aloe — stiff blades thrown out from one crown, and the
       flower spike standing up out of the middle of it */
    /* the blades stand UP and out from one crown, and they are the plant —
       they were a ring of stubs under a lamp-post before */
    const n=8, bh=B*(0.9+0.7*s)*K.h, r=B*(0.5+0.3*s)*K.w;
    for(let i=0;i<n;i++){ const a=i/n*6.283;
      const tipx=x+Math.cos(a)*r, tipz=z+Math.sin(a)*r;
      emitBox(kit.G, Math.min(x,tipx)-B*0.09, yT, Math.min(z,tipz)-B*0.09,
                     Math.max(x,tipx)+B*0.09, yT+bh*(0.45+0.45*((i%3)/2)), Math.max(z,tipz)+B*0.09,
                     M.leaf,M.leaf,M.leaf, K._leaf); }
    emitBox(kit.G, x-B*0.2,yT,z-B*0.2, x+B*0.2,yT+bh*0.35,z+B*0.2, M.leaf,M.leaf,M.leaf, K._leaf);
    if(K._flower){
      emitBox(kit.G, x-B*0.08,yT,z-B*0.08, x+B*0.08,yT+bh+B*1.1*K.h,z+B*0.08, BK,BK,null, K._bole);
      emitBox(kit.G, x-B*0.26,yT+bh+B*0.8*K.h,z-B*0.26, x+B*0.26,yT+bh+B*1.3*K.h,z+B*0.26,
              M.solid,M.solid,M.solid, K._flower); }
    return;
  }
  /* ---- THE HERB ---- a cross-blade: corn in the ear, flax in flower,
     lavender, hyssop, a thistle. The commonest thing that grows. */
  cross(kit.G,M.plant, x,z,yT, B*(0.8+0.4*s)*K.w, B*(0.6+0.7*s)*K.h, kit.shade(K._leaf,0.95));
  if(K._flower){
    const fh=B*(0.6+0.7*s)*K.h;
    emitBox(kit.G, x-B*0.17,yT+fh*0.82,z-B*0.17, x+B*0.17,yT+fh*1.06,z+B*0.17,
            M.solid,M.solid,M.solid, K._flower);
  }
}

/* ---- HOW A SAPLING IS DRAWN ----
   Not a shrunk copy of the grown tree — a young one has its own shape: a
   whippy stem and a small head, and you can tell the kind by its colour and
   by what its elders standing over it are. The needle kinds come up as a
   little spire, the palms as a tuft of frond straight out of the ground with
   no stem at all (which is exactly how a palm begins), and everything else
   as a stem with a leafy head on it. */
function emitSapling(kit,K,ix,iz,cc){
  const BK=K._bark||kit.M.bark;   /* §2.4.3 — this kind's own bark */
  const {emitBox,hash,M}=kit;
  const x=(ix+0.5)*B, z=(iz+0.5)*B, yT=cc.h*B;
  const s=hash(ix*1.7+5.5,iz*2.3-9.9);
  const H=B*(0.5+0.75*s);                       /* knee to waist */
  const LF=K._leaf, lm=(EVER&&K._ever&&M.ever)?M.ever:M.leaf, F=K.form;
  if(F==='palm'||F==='banana'||F==='fern'){
    /* straight out of the ground — fronds and nothing else */
    const r=B*(0.34+0.24*s);
    emitBox(kit.G, x-B*0.09,yT,z-B*0.09, x+B*0.09,yT+H*0.5,z+B*0.09, BK,BK,null, K._bole);
    emitBox(kit.G, x-r,yT+H*0.42,z-B*0.13, x+r,yT+H*0.62,z+B*0.13, lm,lm,lm, LF);
    emitBox(kit.G, x-B*0.13,yT+H*0.42,z-r, x+B*0.13,yT+H*0.62,z+r, lm,lm,lm, LF);
    return;
  }
  if(F==='cactus'||F==='baobab'){
    /* a young saguaro is a thumb of green; a young baobab a stick with a
       tuft, and both of them take a century to be anything else */
    emitBox(kit.G, x-B*0.16,yT,z-B*0.16, x+B*0.16,yT+H*0.9,z+B*0.16,
            BK,BK,null, F==='cactus'?K._leaf:K._bole);
    if(F==='baobab') emitBox(kit.G, x-B*0.3,yT+H*0.8,z-B*0.3, x+B*0.3,yT+H*1.1,z+B*0.3, lm,lm,lm, LF);
    return;
  }
  emitBox(kit.G, x-B*0.1,yT,z-B*0.1, x+B*0.1,yT+H*0.55,z+B*0.1, BK,BK,null, K._bole);
  if(F==='conifer'||F==='column'){
    const r=B*(0.28+0.16*s);
    emitBox(kit.G, x-r,yT+H*0.35,z-r, x+r,yT+H*0.8,z+r, lm,lm,lm, LF);
    emitBox(kit.G, x-r*0.5,yT+H*0.8,z-r*0.5, x+r*0.5,yT+H*1.15,z+r*0.5, lm,lm,lm, LF);
    return;
  }
  const r=B*(0.36+0.26*s);
  emitBox(kit.G, x-r,yT+H*0.5,z-r, x+r,yT+H*1.0,z+r, lm,lm,lm, LF);
  emitBox(kit.G, x-r*0.5,yT+H*1.0,z-r*0.5, x+r*0.5,yT+H*1.2,z+r*0.5, lm,lm,lm, LF);
}

/* ---- HOW HIGH THE CROWN OF THIS TREE STANDS ----
   Asked by anything that must put something IN a tree — and until it existed
   the one thing that did (the nests of the birds) guessed at a flat three and
   a third blocks for every tree in the world, so a nest hung in mid air over
   an olive and sat buried in the bole of a jungle giant. Returns the height
   above the ground, in UNITS, at which the leaf begins; 0 if the form has no
   crown to speak of (a cactus, a clump of bamboo). */
function crownY(K,ix,iz,hash){
  if(!K) return 0;
  const q=hash(ix*0.73+11.3,iz*0.91-5.7);
  const S=(0.62+Math.pow(q,0.55)*1.25+(hash(ix*3.1,iz*2.3)>0.965?0.85:0))*K.h;
  const F=K.form;
  switch(F){
    case 'conifer': return B*5.2*S*(K.bare===undefined?0.28:K.bare)+B*0.4;
    case 'column':  return B*5.6*S*0.35;
    case 'palm':    return B*4.6*S;
    case 'thorn':   return B*4.0*S;
    case 'baobab':  return B*3.4*S;
    case 'banana':  return B*2.4*S*0.8;
    case 'mangrove':return B*3.0*S;
    case 'fern':    return B*3.0*S;
    case 'gum':     return B*6.2*S*0.84;
    case 'spread':  return B*3.8*S;
    case 'darkoak': return B*3.0*S-B*0.6;
    case 'jungle':  return B*7.0*S-B*0.5*S*K.w;
    case 'round': case 'blossom': return B*3.4*S*(F==='blossom'?0.9:1)-B*0.4;
    case 'cactus': case 'bamboo': return 0;
    default:        return B*3.6*S-B*0.9;      /* the oak and its kin */
  }
}

window.FLORA={
  load, treeAt, plantAt, saplingAt, emitTree, emitPlant, emitSapling, crownY,
  tintOf, kinds:()=>D.kinds, lands:()=>D.lands,
  /* whether a species keeps its leaf through the winter, for the suite */
  everOf:n=>{ const K=D.kinds[n]; return K?!!K._ever:null; },
  everOn:v=>{ if(v!==undefined) EVER=!!v; return EVER; },
  /* the boughs, and the switch that sets a branched wood beside the wood it
     replaced in ONE page — geometry has to be measured, not asserted */
  boughed:()=>BOUGHED,
  boughsOn:v=>{ if(v!==undefined) BOUGHS=!!v; return BOUGHS; },
  /* the four grey things everything in the world is drawn with. The engine
     mints them; this file only ever names them. */
  MATERIALS:['leaf','bark','plant','solid'],
};
})();
