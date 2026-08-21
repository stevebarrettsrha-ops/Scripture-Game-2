/* ============================================================
   THE GRASS OF THE EARTH — one file, and everything reads it
   ------------------------------------------------------------
   "And the earth brought forth grass, herb yielding seed after his kind."

   THE FAULT THIS FILE MENDS. The grass was drawn by the chunk mesher and
   nowhere else. Nothing else in the world knew where a blade stood. So a
   beast put its head down to feed on whatever ground it happened to be
   standing on — bare dirt, a sand flat, the swept floor of a village, the
   scree of a mountain — and the herds of the earth grazed nothing at all.
   The lion crept low in the open with nothing to creep THROUGH.

   Now there is ONE truth about the grass, and it lives here. The mesher asks
   this file what to draw. The beasts ask this file where to feed, and walk to
   it. The lion asks this file where the cover stands, and lies down in it.
   What you see and what they eat are the same grass, because both of them
   came out of GRASS.at().

   Everything here is a PURE FUNCTION OF THE PLACE — the same ground always
   bears the same grass, on every machine, for ever, with nothing stored.

   ---- AND IT IS THE SWARD ONLY ----
   What STANDS UP out of the ground is this file's. What LIES ON it — leaf
   litter, needle mat, moss, lichen, deadfall, fungi — is js/ground.js, and
   the two do not fight over a cell: the floor is drawn under the sward and
   takes none away from it, so a blade may stand in the litter, and does.
   The rock and the snow are NOT named below and never have been, so not one
   blade has ever stood on either; the floor knows both, which is why a scree
   is no longer clean grey stone.

   ---- WHAT YOU MAY CHANGE ----
   SWARD      the biome table below: how thick the grass grows on each
              ground, how tall it stands, and what colour it is.
   MEADOW_*   the scale and the bite of the broad pasture field — the thing
              that makes some ground rich meadow and some ground thin.
   Change a number, reload the game. The world and the beasts both follow.
   ============================================================ */
(function(){
'use strict';

/* the same little noise the world is built with, kept here so this file
   stands on its own and can be read before anything else */
function hash2(x,y){ const n=Math.sin(x*127.1+y*311.7)*43758.5453; return n-Math.floor(n); }
function vnoise(x,y){ const xi=Math.floor(x), yi=Math.floor(y), xf=x-xi, yf=y-yi;
  const a=hash2(xi,yi), b=hash2(xi+1,yi), c=hash2(xi,yi+1), d=hash2(xi+1,yi+1);
  const fx=xf*xf*(3-2*xf), fy=yf*yf*(3-2*yf);
  return a+(b-a)*fx+(c-a)*fy+(a-b-c+d)*fx*fy; }
function fbm(x,y){ return vnoise(x,y)*0.55+vnoise(x*2.13,y*2.13)*0.3+vnoise(x*4.7,y*4.7)*0.15; }

const B=6;                     /* units to the block — a block is a metre walked */

/* ---- THE PASTURE FIELD ----
   Grass does not lie evenly over a country. It runs in swards: rich bottom
   land where the herds gather, thin worn ground between, and bald patches
   that carry nothing. This broad field says which is which, and it is what
   sends a herd walking half a field to a better bite instead of standing in
   the same square chewing dust. */
const MEADOW_SCALE=0.00042;    /* how broad a sward runs (smaller = broader) */
const MEADOW_BITE=0.62;        /* how hard the poor ground is punished */
function meadow(x,z){
  const m=fbm(x*MEADOW_SCALE+31.7, z*MEADOW_SCALE-12.3);
  /* a second, finer field breaks the swards up so no meadow is a smooth disc */
  const f=fbm(x*MEADOW_SCALE*4.3-8.1, z*MEADOW_SCALE*4.3+5.5);
  const v=m*0.72+f*0.28;
  return Math.max(0, Math.min(1, (v-0.5+MEADOW_BITE*0.5)/MEADOW_BITE));
}

/* ---- WHAT GROWS ON WHAT GROUND ----
   For every kind of ground the world lays down:
     n     how much of it is clothed at all (0..1)
     blade which cross-textured plant stands up out of it
     lo/hi how tall it stands, in blocks
     bush  the share of it that is woody scrub rather than grass
     bloom the share that comes up in flower
     feed  how much a grazing beast gets from a mouthful of it
   A ground not named here bears nothing: sand, stone, snow, the ice. */
const SWARD={
  grass   :{ n:0.62, blade:'tallgrass', lo:0.60, hi:1.45, bush:0.030, bloom:0.045, feed:1.00 },
  tropic  :{ n:0.70, blade:'tallgrass', lo:0.75, hi:1.70, bush:0.055, bloom:0.030, feed:0.85 },
  /* THE PLAIN. Golden grass to the shoulder, standing in a sea of it — the
     one ground in the world a lion can vanish into, and the reason the plain
     of the east reads as the plain of the east. */
  savanna :{ n:0.62, blade:'savgrass', lo:0.95, hi:1.85, bush:0.022, bloom:0.010, feed:0.95 },
  tundra  :{ n:0.26, blade:'tallgrass', lo:0.30, hi:0.62, bush:0.014, bloom:0.020, feed:0.45 },
  alpine  :{ n:0.24, blade:'tallgrass', lo:0.28, hi:0.60, bush:0.012, bloom:0.030, feed:0.40 },
  /* the wadi grass of the dry country: a tussock here and there, and a beast
     must walk a long way between them */
  desert  :{ n:0.055,blade:'savgrass',  lo:0.55, hi:1.10, bush:0.004, bloom:0.002, feed:0.55 },
  badlands:{ n:0.030,blade:'savgrass',  lo:0.45, hi:0.90, bush:0.003, bloom:0.001, feed:0.40 },
  sand    :{ n:0.020,blade:'tallgrass', lo:0.40, hi:0.85, bush:0.002, bloom:0.002, feed:0.30 },
};
/* what a beast must be standing in before it will put its head down at all */
const FEED_MIN=0.18;
/* and how deep that cover must stand before a hunter is hidden in it. A
   block is a metre walked, so this is the grass that comes up over a lion
   lying down in it — met only in the deeper stands of the plain and of the
   tropic forest floor. Set it lower and every acre of the world is cover and
   nothing on it can ever see anything. */
const HIDE_H=1.0;

/* ---- THE ONE DECISION ----
   What stands on this cell — asked by the mesher to draw it, and by every
   beast in the world to know what it is standing in. `wild` is how far this
   ground is from a settled place: a village keeps its own ground grazed and
   cut, so the wilderness is visibly wilder.
   Returns null for bare ground, else:
     m     the material to draw (a cross-plant, or 'bush' for woody scrub)
     w,h   its width and its height, in UNITS
     hb    its height in BLOCKS — what the hunter measures cover by
     feed  what a mouthful of it is worth to a grazer (0 for scrub) */
function at(ix,iz,kind,wild){
  const S=SWARD[kind]; if(!S) return null;
  if(wild===undefined) wild=1;
  const x=(ix+0.5)*B, z=(iz+0.5)*B;
  /* the sward decides how much of THIS ground is clothed; the cell's own
     draw decides whether this particular square is one of the clothed ones */
  const rich=0.35+0.65*meadow(x,z);
  const j=hash2(ix*1.7,iz*2.9);            /* the same per-cell draw the world uses */
  const s=hash2(ix*1.31-4.4,iz*1.77+8.1);  /* and its second, for size and sort */
  const n=S.n*rich*wild;
  const bush=S.bush*wild, bloom=S.bloom*wild;
  if(j<bush){ const r=B*(0.34+s*0.40), hh=B*(0.55+s*0.75);
    return {m:'bush', w:r*2, h:hh, hb:hh/B, feed:0, cap:s>0.62}; }
  if(j<bush+n){
    /* the blade takes its stature from the richness of the ground it stands
       in, so a thin sward is short and a fat one is over your knees */
    const t=s*0.72+rich*0.28;
    const hb=S.lo+(S.hi-S.lo)*t;
    return {m:S.blade, w:B*(0.7+s*0.5), h:B*hb, hb, feed:S.feed*(0.55+0.45*rich)};
  }
  if(j<bush+n+bloom) return {m:(s<0.5?'flowerR':'flowerY'), w:B*0.85, h:B*0.85, hb:0.85, feed:0.15};
  return null;
}

/* ---- HOW GOOD THE BITE IS HERE ----
   Not one cell but the four-square a beast's muzzle can reach, so a grazer
   standing beside a tuft is feeding, not staring at a bald spot. */
function feedAt(x,z,kind,wild){
  const ix=Math.floor(x/B), iz=Math.floor(z/B);
  let best=0;
  for(let a=-1;a<=1;a++) for(let b=-1;b<=1;b++){
    const g=at(ix+a,iz+b,kind,wild);
    if(g&&g.feed>best) best=g.feed; }
  return best;
}
/* ---- AND HOW DEEP THE COVER ----
   How well a beast lying here is screened, measured in blocks. It is NOT
   simply the tallest blade in reach: a screen with holes in it is no screen,
   and one tall tussock on bare ground hides nothing. So it is the tallest
   thing standing, brought down by how much of the nine-square about it is
   clothed at all — deep AND continuous, or it is not cover. */
function coverAt(x,z,kind,wild){
  const ix=Math.floor(x/B), iz=Math.floor(z/B);
  let h=0, n=0;
  for(let a=-1;a<=1;a++) for(let b=-1;b<=1;b++){
    const g=at(ix+a,iz+b,kind,wild);
    if(g){ n++; if(g.hb>h) h=g.hb; } }
  return h*(n/9);
}
/* is a hunter hidden where he lies? */
function hides(x,z,kind,wild){ return coverAt(x,z,kind,wild)>=HIDE_H; }

/* ---- WALK TO THE GRASS ----
   The beast does not know the world; it is handed a `probe` that answers for
   a point — {kind, wild} for ground it may stand on, or null. We spiral out
   from where it stands and hand back the best bite within reach, so a herd
   that has eaten a patch bare gets up and MOVES to the next one.
   `want` is 'feed' for a grazer and 'cover' for a hunter. */
function seek(x,z,rad,probe,want){
  let bx=null,bz=null,bv=want==='cover'?HIDE_H*0.8:FEED_MIN;
  /* three rings and a dozen bearings — cheap, and enough to find a sward */
  for(let r=1;r<=3;r++){
    const d=rad*r/3, turn=hash2(x*0.013,z*0.017)*6.283;
    for(let k=0;k<12;k++){
      const a=turn+k/12*6.283+r*0.5;
      const px=x+Math.cos(a)*d, pz=z+Math.sin(a)*d;
      const p=probe(px,pz); if(!p) continue;
      const v=(want==='cover')?coverAt(px,pz,p.kind,p.wild):feedAt(px,pz,p.kind,p.wild);
      if(v>bv){ bv=v; bx=px; bz=pz; }
    }
    if(bx!==null&&bv>(want==='cover'?HIDE_H*1.1:0.7)) break;   /* good enough — go */
  }
  return bx===null?null:{x:bx,z:bz,v:bv};
}

window.GRASS={
  SWARD, FEED_MIN, HIDE_H,
  meadow, at, feedAt, coverAt, hides,
  findGraze:(x,z,rad,probe)=>seek(x,z,rad,probe,'feed'),
  findCover:(x,z,rad,probe)=>seek(x,z,rad,probe,'cover'),
  /* does any grass at all grow on this ground? — asked when a beast is
     placed, so a grazer is never set down on bare rock or a sand flat */
  bears:kind=>!!SWARD[kind]&&SWARD[kind].n>0.1,
};
})();
