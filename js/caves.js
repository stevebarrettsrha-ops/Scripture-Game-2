/* ============================================================
   THE HOLLOW PLACES OF THE EARTH — the law of the caves
   ------------------------------------------------------------
   "He putteth forth his hand upon the rock; he overturneth the
    mountains by the roots. He cutteth out rivers among the rocks;
    and his eye seeth every precious thing."

   THE FAULT THIS FILE MENDS. This world had no caves at all. What the
   ranges called caves were SLOT CANYONS — the height function subtracted
   inside a vein-shaped band of noise, open to the sky along their whole
   length. There was no overhang anywhere on the earth, no arch, no
   tunnel, no chamber, and nothing whatever to go down into, because the
   terrain was a HEIGHT PER COLUMN and a height cannot describe a roof.

   WHAT A CAVE IS, HERE. A column of the world is no longer one number.
   It is a height and, where something has been hollowed out of it, a
   short list of AIR RUNS — the places between bedrock and the surface
   where there is nothing. Air runs and not solid runs, because the
   common carved column has exactly one hole and two solid parts, and one
   hole is half the writing. A column with nothing hollowed out of it
   carries `null`, and `null` costs nothing, which is what keeps the
   ordinary earth exactly as cheap as it was.

   THE SURFACE IS NEVER BROKEN. An air run always stops one block short
   of the top, so the ground a man walks on, a village is laid on, a tree
   grows out of and a beast beds down upon is solid everywhere on the
   earth, exactly as it was before this file existed. Every one of the
   eighty-seven places in the engine that asks a column its height is
   therefore still right, and none of them had to be touched.

   SO WHERE IS THE WAY IN? Sideways, as it is in the world. A tunnel runs
   at its own slow elevation while the land above it rises and falls far
   faster — so where a gully, a ravine or a cliff cuts the ground down
   past the tunnel, the tunnel is laid open on the rock face, and that is
   a cave mouth. Nothing places them; the land does.

   AND IT IS NEVER SAMPLED VOLUMETRICALLY. Three gates, each cutting what
   survives by an order: the whole earth is asked whether it is cave
   country at all (one field), a column is asked whether a worm runs
   through it (one field), and only then is anything worked out about the
   third dimension — and even then it is arithmetic on two numbers, not a
   march up the column. An ocean or a plains column leaves this file
   after a single comparison.

   Nothing here knows what a chunk is, what three.js is, or what any
   particular mountain is called. The seeds are handed in.
   ============================================================ */
(function(){
'use strict';

/* ---------------- ITS OWN SMALL NOISE ----------------
   The same value noise the world is built with, kept here so the law of
   the caves depends on nothing and can be reasoned about by itself. */
function hash2(x,y){ const n=Math.sin(x*127.1+y*311.7)*43758.5453; return n-Math.floor(n); }
function vnoise(x,y){ const xi=Math.floor(x),yi=Math.floor(y),xf=x-xi,yf=y-yi;
  const a=hash2(xi,yi),b=hash2(xi+1,yi),c=hash2(xi,yi+1),d=hash2(xi+1,yi+1);
  const fx=xf*xf*(3-2*xf),fy=yf*yf*(3-2*yf);
  return a+(b-a)*fx+(c-a)*fy+(a-b-c+d)*fx*fy; }
function fbm(x,y){ return vnoise(x,y)*0.55+vnoise(x*2.13,y*2.13)*0.3+vnoise(x*4.7,y*4.7)*0.15; }
/* ---- WHERE THE VEIN RUNS, AND HOW FAR OFF IT WE STAND ----
   A cave is not "the noise is high here". It is a LINE through the rock
   with a bore about it. The line is where `2·fbm − 1` crosses zero; how far
   this column stands from that line is that value divided by how steeply it
   is changing, which is two more reads of the field and turns a hairline
   threshold into a round tunnel of a stated width.

   (Thresholding the ridge directly was tried first and measured: at a
   threshold thin enough to keep the passages from becoming a sponge — one
   column in fifty — the band on the ground is seven tenths of a block wide.
   That is a slot, not a passage. The bore has to be a stated distance, and
   a distance is what this returns.) */
function veinDist(u,v){       /* in NOISE units; the caller scales it to the world */
  const s=2*fbm(u,v)-1;
  const a=Math.abs(s);
  if(a>0.14) return 1e9;      /* the cheap reject: one read, and nearly all leave here */
  const e=0.05;
  const gx=(fbm(u+e,v)-fbm(u-e,v))/e;      /* d(2f-1)/du = 2·df/du, and the 2s cancel */
  const gz=(fbm(u,v+e)-fbm(u,v-e))/e;      /* against the 2 in s — so this IS the gradient */
  const g=Math.sqrt(gx*gx+gz*gz);
  /* ---- AND A FLAT PLACE IN THE FIELD IS NOT A CAVERN ----
     Where the field barely changes, "distance to the line" comes out small
     over a great blank patch, and the carve spreads into a hall sixty
     blocks across with no passage leading anywhere. Measured on the vein,
     the gradient runs about 0.94; below about a quarter of that the answer
     is not a distance at all, it is a flat spot. Those are refused. */
  return g>0.34 ? a/g : 1e9;
}

/* ---------------- THE NUMBERS ----------------
   Every one of them is in this block, and every one is commented, because
   the difference between a cave system and a colander is about four of
   them and the next person will want to move them. */
const MIN_H      = 9;        /* no cave under ground lower than this, in blocks */
const ROOF       = 3;        /* blocks of rock always left over a tunnel's head.
                                At one, a passage running near the surface came
                                out as a ROOFED TRENCH — a block of stone laid
                                over a ditch, lit like open ground and reading
                                like a mistake. Three is a cave. */
const FLOOR      = 2;        /* and always left under its foot */
const CY_LO      = 7;        /* the band the tunnels run in, in blocks... */
const CY_HI      = 52;       /* ...low enough to be cut open by a valley */
const CY_FREQ    = 0.00042;  /* and how slowly that elevation wanders (~2,400 units) */
const W_FREQ     = 0.00110;  /* the run of the worms (~900 units to the turn, so the
                                passages are long, and stand some sixty blocks
                                apart rather than breaking into one another) */
const R_H        = 3.6;      /* the bore of a passage across, in BLOCKS */
const R_V        = 4.2;      /* and up and down — a man walks these upright */
const U_PER_B    = 6;        /* world units to the block (the engine's own B) */
const SCATTER_F  = 0.00058;  /* the worldwide scatter of cave country */
const SCATTER_TH = 0.735;    /* how much of the earth is cave country at all */
/* the two worm systems, offset from one another. Where they cross, the two
   openings join and the place is a CHAMBER rather than a passage. */
const WORMS = [ {ox:  0.0,  oz:  0.0,  dy: 0.0},
                {ox: 91.3,  oz:-57.9,  dy: 6.5} ];
/* how many world units to one unit of the worm field. Derived, never
   written twice — a hand-copied inverse here was a bore of the wrong width
   waiting for the first person to retune W_FREQ. */
const W_SCALE=1/W_FREQ;

/* ---------------- CAVE COUNTRY ----------------
   Where in all the earth there are caves at all. Two things say so: the
   named ranges and summits handed in from world/landmarks.js, each with a
   country of its own about it, and a sparse worldwide scatter so that a
   traveller who never goes near a named mountain still finds a way down.
   Returns 0 where there are none, rising to 1 in the heart of one. */
let SEEDS=[];                 /* [{x,z,r}] in world units */
/* ---- AND THE SEEDS ARE BUCKETED ----
   `regionAt` is asked once for every column of every mountain in the world.
   Walked as a flat list of sixty named ranges that is sixty distance tests a
   column, which is more work than the caves themselves. Each seed is written
   into the cells of a coarse grid its country reaches, and a column reads one
   cell — nearly always empty, and never more than a handful long. */
const BKT=8000;               /* world units to a bucket */
let BUCKETS=new Map();
function bkey(x,z){ return Math.floor(x/BKT)+','+Math.floor(z/BKT); }
function regionAt(x,z){
  let best=0;
  const near=BUCKETS.get(bkey(x,z));
  if(near) for(let i=0;i<near.length;i++){
    const s=near[i], dx=x-s.x, dz=z-s.z;
    const d2=dx*dx+dz*dz;
    if(d2>=s.r2) continue;
    const f=1-Math.sqrt(d2)/s.r;
    if(f>best){ best=f; if(best>0.999) return 1; }
  }
  if(best>0.55) return best;              /* already deep in a named country */
  const n=fbm(x*SCATTER_F+311.7, z*SCATTER_F-88.1);
  if(n>SCATTER_TH){
    const f=Math.min(1,(n-SCATTER_TH)/0.10);
    if(f>best) best=f;
  }
  return best;
}

/* ---------------- THE HOLLOW OF ONE COLUMN ----------------
   `x,z` in world units, `h` the height of the ground in blocks. Answers
   null — which is nearly always — or a flat list of air runs, sorted and
   disjoint, in blocks: [lo0,hi0, lo1,hi1, …], each solid below lo and
   solid from hi to h.

   The three gates, in the order that makes them cheap:
     1. is the ground high enough to have anything under it        (a compare)
     2. is this cave country at all                                (one field)
     3. does a worm actually run through this column               (one field)  */
/* ---- AND A QUIET TILE IS ANSWERED ONCE FOR ALL OF IT ----
   Gate 2 is one field read, and it is cheap. It is not cheap TWO HUNDRED AND
   FIFTY-SIX TIMES A CHUNK, over a world where very nearly every column has no
   cave within a mile of it — and each of those reads builds a bucket key
   string and, finding nothing, evaluates the scatter noise in full. That is
   the standing cost of the caves upon the whole earth, paid most heavily by
   the countries that have none.

   So the question is asked of a TILE rather than a column, and remembered. A
   tile that no cave country touches answers `null` for every column in it
   after seven-and-forty reads instead of two hundred and fifty-six.

   IT CANNOT LOSE A CAVE. The scatter field's own feature is some seventeen
   hundred units across and a named country's is larger still; the tile is
   ninety-six, sampled every sixteen units and carried a quarter of a tile
   PAST its own edges, so nothing that could reach a column of this tile can
   fall between the samples. And it is asked only to say `quiet` — a tile that
   answers anything else is walked column by column exactly as before. */
const TILE=96;                /* the mesher's own chunk, in world units */
const QUIET=new Map();
function tileQuiet(x,z){
  const tx=Math.floor(x/TILE), tz=Math.floor(z/TILE), k=tx+','+tz;
  const m=QUIET.get(k); if(m!==undefined) return m;
  const mg=TILE/4, x0=tx*TILE-mg, z0=tz*TILE-mg, span=TILE+2*mg;
  let quiet=true;
  for(let a=0;a<=6&&quiet;a++) for(let b=0;b<=6;b++)
    if(regionAt(x0+a*span/6, z0+b*span/6)>0.02){ quiet=false; break; }
  if(QUIET.size>40000) QUIET.clear();     /* a voyage round the world, and then some */
  QUIET.set(k,quiet);
  return quiet;
}
/* ---- THE UNDERCUT — Phase 5 step 1 ----
   A CENSUS FIRST, because the plan says measure before carving. Eighteen
   thousand columns of range country: 899 hollowed, every one of them with
   rock standing over air — and ELEVEN of them open to the side. Of 1,211
   cliff faces, NINE were undercut. The rock is full of holes and the faces
   never show one.

   The reason is `ROOF`: three blocks of stone are always left over a
   tunnel's head, on purpose, so the ground is never broken. That is right
   for a tunnel and it is what keeps the surface sound, but it means the
   carve is always DEEP, and a cliff only ever cuts a round hole in the
   middle of a face.

   AN UNDERCUT IS NOT A CAVE. It is a cliff with its FOOT EATEN OUT — and in
   the rock it is not a tube at all but a BAND: a course or two of softer
   stone lying at one elevation across the whole country, weathered back
   further than the hard rock above it, which is left standing over the
   hollow. Every undercut cliff on the earth is made that way.

   So it is written as a band and not as a worm. Its elevation wanders very
   slowly — far slower than the ground does — so the land rises and falls
   THROUGH it, and wherever the surface comes down to within a few courses of
   the band, the band is laid open along the face. That is the same trick the
   cave mouths already turn, and nothing places these either.

   AND IT IS CUT ONLY WHERE IT WOULD SHOW. The one condition is that the rock
   over it be thin — at least ROOF, and no more than a few courses beyond it.
   Thicker than that and nothing is carved at all, so the band never becomes
   a buried plate under a plain: it exists only in the narrow ribbon of
   country where the ground surface passes through it, which on steep ground
   is exactly the foot of the cliff. */
/* ---- THE SEA CAVES — Phase 5 step 4 ----
   §8: "Sea caves at the waterline, now possible: half-flooded, entered by
   boat or swimming, dark, with something at the back."

   Censused first: of 2,629 coastal columns and 628 of them true sea CLIFF,
   seven had any hollow at the waterline at all. One in ninety.

   The reason is the same one as everything else in this file: `MIN_H` keeps
   the carve out of low country and `FLOOR` keeps it off the bottom, both of
   them right for a mountain tunnel and both of them exactly wrong for a cave
   the sea cut. A sea cave is not deep. It is a notch at the waterline in a
   cliff the swell has been working at, and it is LOW by definition.

   So it is a band like the soft courses above, but pinned to the WATERLINE
   rather than to the bedding — and gated on the column being LOW, which on
   this earth means a coast or a valley floor. Where the sea lies beside it
   the band is laid open and a man may swim or row in; where it does not, it
   is a small hollow in low ground and nothing is harmed.

   WHAT IS NOT HERE: the something at the back. §8 asks for it and §7 is where
   it belongs — authored places, a schematic format and a capture tool, none
   of which exist yet. A wreck or a hoard invented here would be the same
   placeholder §14 forbids, and it would have to be moved when Phase 8 comes.
   The CAVE ships; what is in it waits for the phase that authors places. */
const SEA_LO     = 1;         /* the band sits at the waterline itself */
const SEA_T      = 4;         /* three courses — a man swims or rows in */
const SEA_MIN_H  = 6;         /* the lowest cliff the sea will cut */
const SEA_MAX_H  = 17;        /* and the highest: above this it is not a notch */
const SEA_TH     = 0.50;      /* how much of the coast the swell has worked at */

const LEDGE_P    = 13;        /* the BEDDING: how often a soft course recurs */
const LEDGE_FREQ = 0.00026;   /* and how slowly the bedding tilts (~4,000 units) */
const LEDGE_TH   = 0.575;     /* how much of cave country is bedded at all */
const LEDGE_T    = 2;         /* how thick a soft course is — a recess, not a room */
const LEDGE_NEAR = 5;         /* how thin the rock over it must be for it to show.
                                 TIGHT ON PURPOSE, and it is a COST gate as much
                                 as a look one: a soft course under level ground
                                 is a void nobody can ever see, and it still
                                 costs the mesher every face of it. At five the
                                 plains chunk went from 1.86 ms to 3.08 and test
                                 12 said so. Only the courses nearest the surface
                                 are cut, which are the ones a cliff lays open. */

/* the bedding may be switched off from outside — NOT a game setting, but so
   that the cost of it can be measured against the very same chunks in the very
   same page. A machine under load makes absolute milliseconds meaningless; the
   only honest question is what THIS change costs, and that wants a control. */
let BEDS=true;

/* ---- THE BORES — the arches and the ways through a ridge ----
   Handed in from the engine at boot, each a horizontal cylinder: a place, a
   bearing, a length, a radius and the elevation of its axis. Where the ridge
   it is driven through is thick this is a TUNNEL a man walks through and out
   the far side; where the ridge is thin the same cylinder is an ARCH, with
   the sky on both sides of it and rock standing over. It is the land that
   decides which, not a flag.

   They are held in the same kind of bucket the range seeds are, so a column
   asks a short list and nearly always an empty one. */
let BORES=[], BOREB=new Map();
const BORE_BKT=4000;
function boresNear(x,z){
  return BOREB.get(Math.floor(x/BORE_BKT)+','+Math.floor(z/BORE_BKT));
}

const _iv=[];                 /* scratch: the intervals of this column, reused */
function spansAt(x,z,h){
  /* a SEA CAVE is low by nature and must be let past the gate that keeps
     tunnels out of low country — but only in the narrow band of heights a
     sea cliff actually stands at */
  const lowCoast=(h>=SEA_MIN_H&&h<=SEA_MAX_H);
  if(h<MIN_H&&!lowCoast) return null;                        /* gate 1 */
  /* A BORE IS NOT A WORM and does not pass the worms' gates: it is placed,
     it is rare, and its bucket is empty for all but a few thousand columns
     on the earth, which is a cheaper gate than either of the two below. */
  const bores=boresNear(x,z);
  if(!bores){
    if(tileQuiet(x,z)) return null;                          /* gate 1b */
  }
  const reg=regionAt(x,z);
  if(!bores&&reg<=0.02) return null;                          /* gate 2 */
  /* a passage thins away toward the edge of its country, so no cave ever
     stops dead at a straight line on the chart */
  const bore=Math.min(1,0.42+reg*0.86);
  const rh=R_H*bore;
  _iv.length=0;
  let cy=-1;                  /* the elevation is not asked for until a worm hits */
  for(let k=0;k<WORMS.length;k++){                           /* gate 3 */
    const W=WORMS[k];
    const dN=veinDist(x*W_FREQ+W.ox, z*W_FREQ+W.oz);
    if(dN>1e8) continue;
    const dB=dN*W_SCALE/U_PER_B;               /* how far off the line, in blocks */
    if(dB>=rh) continue;
    /* a round bore: full height over the line, closing to nothing at its edge */
    const vr=R_V*bore*Math.sqrt(1-(dB/rh)*(dB/rh));
    if(vr<1.2) continue;
    if(cy<0) cy=CY_LO+(CY_HI-CY_LO)*fbm(x*CY_FREQ+13.1, z*CY_FREQ-7.7);
    const c=cy+W.dy;
    _iv.push(c-vr, c+vr);
  }
  /* ---- AND ANY BORE DRIVEN THROUGH HERE ----
     A cylinder, so the opening is a true round arch: full height on its axis
     and closing to nothing at the springing. Asked before the soft band and
     outside the worms entirely, because a bore is neither. */
  { const bl=bores;
    if(bl) for(let k=0;k<bl.length;k++){ const b2=bl[k];
      const dx=x-b2.x, dz=z-b2.z;
      /* along the bearing, and across it */
      const al=dx*b2.cos+dz*b2.sin, pe=-dx*b2.sin+dz*b2.cos;
      if(al<-b2.len||al>b2.len) continue;
      const pb=pe/U_PER_B;                       /* across, in blocks */
      if(pb<=-b2.R||pb>=b2.R) continue;
      const vr=b2.R*Math.sqrt(1-(pb/b2.R)*(pb/b2.R));
      if(vr<1.4) continue;
      _iv.push(b2.y-vr*0.55, b2.y+vr);           /* a round head on a low springing */
    } }
  /* ---- AND THE SEA CAVE, where the swell has been at a low cliff ----
     Pinned to the waterline, so wherever the land falls to the sea beside it
     the notch is laid open and can be swum or rowed into. */
  if(lowCoast){
    const swell=fbm(x*0.00094+77.3, z*0.00094-12.9);
    if(swell>SEA_TH) _iv.push(SEA_LO, SEA_LO+SEA_T);
  }
  /* ---- AND THE SOFT BAND, asked whether a worm ran here or not ----
     An undercut is not a cave and does not wait on one. Two fields, and both
     of them behind the three gates above, so the ordinary earth never asks. */
  { const soft=BEDS?fbm(x*0.00071-31.3, z*0.00071+58.9):0;
    if(soft>LEDGE_TH){
      /* ---- ROCK IS BEDDED, AND THAT IS WHY A CLIFF HAS MANY LEDGES ----
         One soft seam gives one undercut on one contour of one hill, which
         measured at two cliff faces in a hundred. Sedimentary rock does not
         work that way: soft and hard alternate all the way up, which is why
         a real limestone face is a stack of recesses and not a wall with a
         single notch in it. So the seam RECURS every LEDGE_P courses, and the
         whole bedding is tilted by a field that wanders far more slowly than
         the ground — so the courses are level over a valley and rise across a
         range, as beds do. The one nearest under the surface is the one that
         shows; the rest are rock and cost nothing to leave alone. */
      const ph=LEDGE_P*fbm(x*LEDGE_FREQ+41.7, z*LEDGE_FREQ-19.3);
      const want=h-ROOF-LEDGE_T;                     /* the deepest that could show */
      const ly=ph+Math.floor((want-ph)/LEDGE_P)*LEDGE_P;
      const over=h-(ly+LEDGE_T);
      /* thin rock over it, or nothing: the gate that keeps a soft course from
         becoming a plate buried under level country */
      if(ly>=FLOOR&&over>=ROOF&&over<=ROOF+LEDGE_NEAR) _iv.push(ly,ly+LEDGE_T);
    } }
  if(!_iv.length) return null;
  /* clip to the rock: never through the surface, never into the bedrock */
  const top=h-ROOF, bot=FLOOR;
  let n=0;
  for(let i=0;i<_iv.length;i+=2){
    let lo=Math.max(bot,Math.floor(_iv[i])), hi=Math.min(top,Math.ceil(_iv[i+1]));
    if(hi-lo<2) continue;                        /* nothing narrower than a crawl */
    _iv[n++]=lo; _iv[n++]=hi;
  }
  if(!n) return null;
  /* sort and merge what overlaps — two worms crossing make one chamber */
  if(n>2 && _iv[0]>_iv[2]){ const a=_iv[0],b=_iv[1]; _iv[0]=_iv[2]; _iv[1]=_iv[3]; _iv[2]=a; _iv[3]=b; }
  const out=[];
  let lo=_iv[0], hi=_iv[1];
  for(let i=2;i<n;i+=2){
    if(_iv[i]<=hi+1){ if(_iv[i+1]>hi) hi=_iv[i+1]; }        /* they join */
    else { out.push(lo,hi); lo=_iv[i]; hi=_iv[i+1]; }
  }
  out.push(lo,hi);
  return Int16Array.from(out);
}

window.CAVES={
  /* the engine hands in the named ranges and summits once, at boot */
  seed(list){
    SEEDS=list.map(s=>({x:s.x,z:s.z,r:s.r,r2:s.r*s.r}));
    BUCKETS=new Map();
    QUIET.clear();            /* the countries have changed; forget every answer */
    for(const s of SEEDS){
      const i0=Math.floor((s.x-s.r)/BKT), i1=Math.floor((s.x+s.r)/BKT);
      const j0=Math.floor((s.z-s.r)/BKT), j1=Math.floor((s.z+s.r)/BKT);
      for(let i=i0;i<=i1;i++) for(let j=j0;j<=j1;j++){
        const k=i+','+j; let a=BUCKETS.get(k); if(!a){ a=[]; BUCKETS.set(k,a); } a.push(s); }
    } },
  seeds:()=>SEEDS,
  regionAt, spansAt,
  beds(on){ BEDS=!!on; },
  /* the engine hands in the bores once, at boot, after the heights are ready */
  arches(list){
    BORES=list.map(a=>({x:a.x,z:a.z,y:a.y,R:a.R,len:a.len,
      cos:Math.cos(a.ang), sin:Math.sin(a.ang)}));
    BOREB=new Map();
    for(const b of BORES){
      /* every bucket the cylinder can reach, so no column has to search */
      const rad=b.len+b.R*U_PER_B+BORE_BKT;
      const i0=Math.floor((b.x-rad)/BORE_BKT), i1=Math.floor((b.x+rad)/BORE_BKT);
      const j0=Math.floor((b.z-rad)/BORE_BKT), j1=Math.floor((b.z+rad)/BORE_BKT);
      for(let i=i0;i<=i1;i++) for(let j=j0;j<=j1;j++){
        const k=i+','+j; let a=BOREB.get(k); if(!a){ a=[]; BOREB.set(k,a); } a.push(b); }
    } },
  bores:()=>BORES,
  /* is there ANY cave country in this chunk? Twenty-five reads, and it
     answers `no` for very nearly the whole earth — the same shape of test
     the rivers already use, and paid at the same rate. */
  chunkHas(x0,z0,w){
    for(let a=0;a<=4;a++) for(let b=0;b<=4;b++)
      if(regionAt(x0+a*w/4, z0+b*w/4)>0.02) return true;
    return false; },
  /* what the quiet-tile table has learned, for the audit */
  quietStats:()=>{ let q=0; for(const v of QUIET.values()) if(v) q++;
    return {tiles:QUIET.size, quiet:q}; },
  /* named, so the audit and the acceptance tests can speak about them */
  MIN_H, ROOF, FLOOR, CY_LO, CY_HI, R_H, R_V
};
})();
