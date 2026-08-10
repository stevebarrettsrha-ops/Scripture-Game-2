/* ============================================================
   THE GOING OF A FOUR-FOOTED BEAST — the law of the footfall
   ------------------------------------------------------------
   "Hast thou given the horse strength? hast thou clothed his neck with
    thunder? He paweth in the valley, and rejoiceth in his strength."

   THE FAULT THIS FILE MENDS. Every four-footed thing on this earth moved
   its legs in exactly one pattern, at every speed, from the shrew to the
   elephant: the near fore with the off hind, the off fore with the near
   hind, forever. That is a TROT, and it is the only gait a voxel game has
   ever had. A walking elephant does not trot. A galloping horse does not
   trot. A camel does not trot at all — it PACES, both legs of a side
   swinging together, which is why a man riding one is rocked like a boat
   and why the beast is called the ship of the desert.

   A gait is nothing but four numbers: WHEN in the cycle each of the four
   feet comes down, as a fraction of one stride. Get those four right and
   the beast is alive; get them wrong and no amount of modelling will save
   it. So they are written here, one line to a gait, and the engine reads
   them.

   The four feet are named as a horseman names them:
       LF near fore   ·   RF off fore
       LH near hind   ·   RH off hind

   HOW A GAIT IS CHOSEN. Not by species and not by a flag — by SPEED, in
   the beast's own body lengths a second, exactly as a real animal chooses
   one. A shrew at four body lengths a second is galloping; an elephant at
   four body lengths a second does not exist. That one measure makes every
   creature in the game, from the mouse to the elephant, move correctly
   without a line of data per species.

   Nothing here knows what three.js is, what a chunk is, or what any
   particular beast is called. It is the law of the footfall, and only that.
   ============================================================ */
(function(){
'use strict';

/* ---------------- THE GAITS ----------------
   [LF, RF, LH, RH] — the moment in the stride each foot is set down,
   as a fraction of the cycle. `duty` is the part of the cycle that foot
   spends ON THE GROUND: a walk keeps three feet down at once and is
   never airborne; a gallop keeps one, and has a moment with none. */
const G = {
  /* FOUR-BEAT LATERAL WALK — the going of everything that walks.
     Near hind, near fore, off hind, off fore: the sequence Muybridge
     photographed and the one every quadruped on the earth keeps. Three or
     four feet are down at every instant and the body is never once in the
     air — which is why a walking beast does not bob, and why raising the
     duty above three quarters matters more here than any other number in
     this table. */
  walk:   { f:[0.25, 0.75, 0.00, 0.50], duty:0.76, lift:0.55, rise:0.030, sway:0.020 },

  /* TWO-BEAT DIAGONAL TROT — the diagonal pairs together. The one gait
     the game had, now in its proper place: a middling speed and no other. */
  trot:   { f:[0.00, 0.50, 0.50, 0.00], duty:0.46, lift:0.85, rise:0.075, sway:0.015 },

  /* TWO-BEAT LATERAL PACE — both legs of a side together. The camel, the
     giraffe and the elephant at speed truly move this way, and it is the
     roll of it that makes a camel a ship. */
  pace:   { f:[0.00, 0.50, 0.00, 0.50], duty:0.48, lift:0.75, rise:0.055, sway:0.085 },

  /* THREE-BEAT CANTER — off hind, then the diagonal pair, then near fore,
     then a moment of suspension. It is asymmetric, and that asymmetry is
     the whole rocking-horse feel of it. */
  canter: { f:[0.62, 0.31, 0.31, 0.00], duty:0.33, lift:1.05, rise:0.110, sway:0.030 },

  /* FOUR-BEAT TRANSVERSE GALLOP — the two hinds, then the two fores, and
     the body gathered and stretched between. Flat out. */
  gallop: { f:[0.52, 0.62, 0.00, 0.10], duty:0.32, lift:1.25, rise:0.150, sway:0.020 },

  /* THE BOUND — both hinds together, both fores together: the rabbit, the
     hare, the squirrel, and every small thing that goes in leaps. */
  bound:  { f:[0.45, 0.45, 0.00, 0.00], duty:0.35, lift:1.20, rise:0.230, sway:0.010 }
};

/* ---------------- WHICH GAIT, AT WHAT SPEED ----------------
   In body lengths a second. A beast walks until walking will not keep up,
   then breaks into its middle gait, then into a canter, then runs. The
   thresholds are the real ones: a horse breaks to a trot around 1.4 body
   lengths a second and to a canter around 2.6.

   `paces` is the one thing a species may say about itself — that its
   middle gait is a pace and not a trot. It comes from the behaviour table
   (js/behavior.js), so no engine and no gait law ever names a camel. */
const TROT_AT=1.15, CANTER_AT=2.55, GALLOP_AT=4.10;
function pick(bodyLenPerSec, paces, bounds){
  const v=bodyLenPerSec;
  if(bounds) return v<TROT_AT?'walk':'bound';
  if(v<TROT_AT)   return 'walk';
  if(v<CANTER_AT) return paces?'pace':'trot';
  if(v<GALLOP_AT) return 'canter';
  return 'gallop';
}

/* ---------------- THE SWING OF ONE LEG ----------------
   Given the gait, which foot this is, and where the stride has got to,
   answer how far forward the leg is thrown (radians at the hip) and how
   hard the knee is folding under it.

   A leg's cycle is two unequal halves. Through the STANCE it is planted:
   the foot does not move over the ground, so the hip sweeps steadily
   backward and the knee stays straight — this is what makes a footfall
   look planted rather than skated. Through the SWING it is in the air and
   must cover the same ground the other way in less time, so it comes
   forward faster, and the knee folds to pick the foot up over the ground
   it is crossing. Every gait in the table above is that same one leg,
   four times, at four different moments. */
function legSwing(gait, footIdx, phase, amp){
  const g=G[gait]||G.walk;
  const A=amp===undefined?0.5:amp;
  /* where this foot is in ITS own cycle: 0 at set-down, 1 at set-down again */
  let u=phase-g.f[footIdx]; u-=Math.floor(u);
  if(u<g.duty){                                  /* PLANTED — swept steadily back */
    const t=u/g.duty;
    return { hip: A*(1-2*t), knee: 0 };
  }
  /* IN THE AIR — thrown forward, and the knee folded to clear the ground */
  const t=(u-g.duty)/(1-g.duty);
  const e=t*t*(3-2*t);                           /* eased, so nothing snaps */
  return { hip: A*(-1+2*e), knee: g.lift*Math.sin(t*Math.PI) };
}

window.GAIT={
  gaits:G, pick, legSwing,
  /* how the BODY moves under the gait: the rise and fall of the withers,
     and the roll from side to side. A pacing camel rolls; a trotting dog
     bounces; a walking elephant does neither, and that is correct. */
  bodyRise:(gait,phase)=>{ const g=G[gait]||G.walk;
    const beats=(gait==='trot'||gait==='pace')?2:(gait==='walk'?4:1);
    return g.rise*Math.sin(phase*Math.PI*2*beats); },
  bodyRoll:(gait,phase)=>{ const g=G[gait]||G.walk;
    return g.sway*Math.sin(phase*Math.PI*2); },
  /* how many strides a second, for a beast of this length going this fast.
     A short-legged beast takes more, shorter steps for the same ground —
     which is why a terrier's legs blur and a giraffe's do not. */
  stridesPerSec:(bodyLenPerSec,gait)=>{
    const g=G[gait]||G.walk;
    /* a stride carries the body about six tenths of its own length at a
       walk and a length and a half at a gallop */
    const reach=gait==='walk'?0.55:gait==='bound'?1.5:(0.55+(g.lift-0.55)*0.8);
    return Math.max(0.35, Math.min(4.2, bodyLenPerSec/Math.max(0.2,reach)));
  }
};
})();
