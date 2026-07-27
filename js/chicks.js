/* ============================================================
   THE YOUNG IN THE NEST — chicks, and what they do all day
   ------------------------------------------------------------
   "As an eagle stirs up her nest, flutters over her young, spreads abroad
    her wings, takes them, bears them on her wings."

   THE FAULT THIS FILE MENDS. Every nest on the earth held exactly two chicks
   and both of them were the same brown box, whether the nest belonged to a
   dove, an eagle, an ostrich or a penguin. They did one thing: they went up
   and down when a parent came in.

   A chick now belongs to its KIND. An owlet is a ball of white down with two
   enormous eyes; an eaglet is dark and already has a beak on it; an ostrich
   chick is a striped thing on legs that is up and walking the day it hatches;
   a penguin chick is grey and stands on its own feet in a huddle. And they
   keep a day: they sleep, they wake, they beg when a parent comes in, they
   settle down under the wing at nightfall, and the ones that can walk get
   out of the nest and go a little way and come back.

   ---- WHAT DECIDES A CHICK ----
   `KINDS` below, keyed by the bird. Anything not named gets the plain
   nestling, which is the right answer for most small birds.
   ============================================================ */
(function(){
'use strict';

const B=6;

/* ---- WHAT EACH KIND'S YOUNG LOOKS LIKE ----
   down    the colour of the down it is covered in
   bill    the colour of the beak
   size    how big, against the plain nestling
   eyes    OPTIONAL colour — a chick with eyes open (owls, ostriches); a
           songbird's nestling is blind for a week and has none drawn
   legs    OPTIONAL true — it stands on its own feet OUT of the nest the day
           it hatches (an ostrich, an emu, a ptarmigan, a penguin)
   stripe  OPTIONAL colour — the camouflage bars of a ground-nesting chick */
const KINDS={
  crow    :{down:0x6a6258, bill:0x2a2620, size:1.0},
  dove    :{down:0xd8cfbc, bill:0x6a625a, size:0.85},
  gull    :{down:0xd0c8a8, bill:0x3a352c, size:1.0, stripe:0x6a6248, legs:true, eyes:0x100c0a},
  eagle   :{down:0xe8e4d8, bill:0xe0b040, size:1.35, eyes:0x2a2018},
  owl     :{down:0xf2f0ea, bill:0x2a2620, size:1.2, eyes:0xe8c020},
  puffin  :{down:0x3a3630, bill:0x2a2620, size:0.8},
  ostrich :{down:0xd8bc84, bill:0xc8a058, size:1.3, legs:true, stripe:0x6a5230, eyes:0x100c0a},
  emu     :{down:0xd0c0a0, bill:0x5a5248, size:1.15, legs:true, stripe:0x3a3228, eyes:0x100c0a},
  cassowary:{down:0xc8b078,bill:0x5a5248, size:1.1, legs:true, stripe:0x4a3a24, eyes:0x100c0a},
  bustard :{down:0xd0bc90, bill:0x6a6250, size:0.95, legs:true, stripe:0x5a4a34, eyes:0x120e0a},
  ptarmigan:{down:0xd8c8a0,bill:0x2a2620, size:0.7, legs:true, stripe:0x5a4a34, eyes:0x100c0a},
  peacock :{down:0xd8c898, bill:0xc8b070, size:0.8, legs:true, eyes:0x100c0a},
  chicken :{down:0xe8d86a, bill:0xd8a83a, size:0.7, legs:true, eyes:0x100c0a},
  kiwi    :{down:0x8a7a62, bill:0xc8b090, size:0.85, legs:true, eyes:0x100c0a},
  penguin :{down:0x8a8f96, bill:0x2a2620, size:1.25, legs:true, eyes:0x0a0a0a},
};
const PLAIN={down:0x9c8b68, bill:0xd8a030, size:1.0};
function kindOf(bird){ return KINDS[bird]||PLAIN; }

/* ---- BUILD ONE CHICK ----
   `T` is the same creature toolkit the beasts are built with. Returns a group
   with {body, beak, head} on userData so the engine can work it. */
function makeChick(T,bird){
  const K=kindOf(bird), s=K.size, g=T.group();
  /* a nestling is nearly all head, and that is what makes it read as young */
  const body=T.box(0.62*s,0.5*s,0.7*s,K.down); body.position.y=0.3*s; g.add(body);
  if(K.stripe) for(let i=0;i<3;i++){
    const bar=T.box(0.64*s,0.09*s,0.14*s,K.stripe); bar.position.set(0,0.32*s,-0.22*s+i*0.22*s); g.add(bar); }
  const head=T.box(0.55*s,0.5*s,0.5*s,K.down); head.position.set(0,0.8*s,0.16*s); g.add(head);
  const beak=T.box(0.2*s,0.17*s,0.28*s,K.bill); beak.position.set(0,0.74*s,0.48*s); g.add(beak);
  if(K.eyes) for(const sd of [1,-1]){
    const e=T.box(0.14*s,0.14*s,0.1*s,K.eyes); e.position.set(sd*0.17*s,0.88*s,0.36*s); g.add(e); }
  /* the stubs it will one day fly with */
  for(const sd of [1,-1]){ const w=T.box(0.12*s,0.26*s,0.4*s,K.down);
    w.position.set(sd*0.36*s,0.34*s,0.02*s); g.add(w); }
  const legs=[];
  if(K.legs) for(const sd of [1,-1]){
    const L=T.box(0.11*s,0.34*s,0.11*s,K.bill); L.geometry.translate(0,-0.17*s,0);
    L.position.set(sd*0.18*s,0.34*s,0); L.userData.ph=(sd>0)?0:Math.PI; g.add(L); legs.push(L);
    const f=T.box(0.16*s,0.07*s,0.22*s,K.bill); f.position.set(sd*0.18*s,0.02*s,0.07*s); g.add(f); }
  g.userData={body,head,beak,legs,walks:!!K.legs,size:s};
  return g;
}

/* ---- AND WHAT A CHICK DOES ----
   Called every frame for one chick. Returns nothing; it works the model.
     ch    the chick's own state {ph, out, ox, oz, t}
     fed   how long since a parent came in with food (seconds, counting down)
     night whether it is dark
   A nestling that cannot walk begs, huddles and sleeps. One that CAN walk
   gets out of the scrape by day, goes a few paces, and comes back — which is
   what every ground-nesting chick on the earth does within a day of hatching,
   and is why you almost never see one in the nest. */
function tickChick(ch,m,fed,night,dt,t){
  const u=m.userData, s=u.size;
  ch.ph=(ch.ph||Math.random()*6.283);
  if(night){
    /* down under the wing, and the head tucked in */
    m.position.y=ch.baseY-0.12*s;
    u.head.position.y=0.58*s; u.beak.position.y=0.54*s;
    m.rotation.y=ch.ph;
    return;
  }
  if(fed>0){
    /* THE BEGGING — up on the legs, neck to full stretch, gape wide open and
       the whole body shaking with it. It is the loudest thing in the wood. */
    const up=0.42+0.26*Math.sin(t*13+ch.ph);
    m.position.y=ch.baseY+up*0.35*s;
    u.head.position.y=(0.8+up)*s; u.beak.position.y=(0.74+up)*s;
    u.beak.rotation.x=-0.5-0.3*Math.sin(t*13+ch.ph);
    m.rotation.y=ch.face||0;
    return;
  }
  u.beak.rotation.x=0;
  u.head.position.y=0.8*s; u.beak.position.y=0.74*s;
  if(u.walks){
    /* it gets out and goes a little way, and comes back */
    ch.t=(ch.t||0)-dt;
    if(ch.t<=0){ ch.t=2+Math.random()*4;
      const a=Math.random()*6.283, r=(0.4+Math.random()*1.6)*B*s;
      ch.ox=Math.cos(a)*r; ch.oz=Math.sin(a)*r; }
    const dx=(ch.ox||0)-(ch.cx||0), dz=(ch.oz||0)-(ch.cz||0);
    const d=Math.hypot(dx,dz);
    if(d>0.4){ const sp=Math.min(d, 3.2*dt);
      ch.cx=(ch.cx||0)+dx/d*sp; ch.cz=(ch.cz||0)+dz/d*sp;
      m.rotation.y=Math.atan2(dx,dz);
      for(const L of u.legs) L.rotation.x=Math.sin(t*11+(L.userData.ph||0))*0.6; }
    else for(const L of u.legs) L.rotation.x=0;
    m.position.set(ch.nx+(ch.cx||0), ch.baseY, ch.nz+(ch.cz||0));
  } else {
    /* it cannot walk. It sleeps, and shuffles in its sleep. */
    m.position.y=ch.baseY+Math.sin(t*0.9+ch.ph)*0.03*s;
    m.rotation.y=ch.ph+Math.sin(t*0.3+ch.ph)*0.2;
  }
}

window.CHICKS={ KINDS, kindOf, makeChick, tickChick,
  /* how many are in a brood of this bird — the nest file says, and this is
     the floor under it */
  broodOf:(bird,homeN)=>Math.max(1,Math.min(4,homeN||2)) };
})();
