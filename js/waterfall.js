/* ============================================================
   THE FALLING WATERS — the forms, and the cutting of the rock
   ------------------------------------------------------------
   world/waterfalls.js  the data. Which falls exist, where they truly stand,
                        how high and how broad, what FORM each takes and what
                        wood grows in its gorge. Edit it freely.
   js/waterfall.js      this file. How a plunge differs from a cataract from
                        a tiered stair, and how the land is cut so that each
                        one is what it is.

   ---- THE LAND IS CUT, NOT DECORATED ----
   A waterfall painted on a hillside is a blue stripe. A waterfall is a
   SHAPE OF GROUND — a river running on a shelf, a lip where the shelf ends,
   a wall under it, a plunge pool at the foot, and a gorge running away
   downstream that the fall itself cut over ages. So this file works the same
   way the named summits do (see MOUNTS in js/engine.js): it is asked for a
   column of ground while the terrain is being generated, and it answers with
   the height that column ought to stand at. Everything else — the water, the
   spray, the wood — follows the shape once the shape is right.

   ---- THE SIX FORMS, AND WHAT EACH DOES TO THE ROCK ----
     plunge    the lip OVERHANGS: the wall is cut back beneath it so the water
               leaves the rock and touches nothing until the pool. That
               undercut is the whole look of Angel and of Yosemite, and it is
               the one thing a heightmap cannot do — so the lip is cut sharp
               and the wall set back a little way instead, which reads the
               same from every place a man can stand.
     horsetail the wall is STEEP BUT UNBROKEN, so the water keeps the rock all
               the way down and the column follows the face.
     cataract  breadth over height: a long straight lip, a low wall, and a
               wide apron of broken water at the foot. Niagara and Victoria
               are this, and their lips are measured in kilometres.
     tiered    the wall comes down in STEPS with a pool on each — and this is
               the form a world of blocks was made for, because a step IS a
               block. Plitvice, Erawan, Kuang Si.
     fan       the channel WIDENS as it falls, so the sheet spreads over the
               rock and is broader at the foot than at the lip.
     chute     the opposite: the lip is pinched to a narrow gut and the water
               is shot through it. Gullfoss, Murchison.

   ---- AND THEY STAND IN WOOD ----
   The gorge of a fall is always wetter than the plain above it and the growth
   in it is always heavier. `wood` in the data names what grows there and
   `girth` how big the timber runs; this file hands that to js/flora.js at the
   right places and does not know one tree from another.

   ---- WHAT IT COSTS ----
   The terrain hook is on the HOT PATH — cellRaw is asked for every column of
   every chunk — so the first thing it does is a box test that throws out
   every column not near a fall, which is all but a handful in the world. A
   fall claims a box about the size of its own gorge and nothing outside it
   pays more than two comparisons.
   ============================================================ */
(function(){
'use strict';

let K=null;              /* the kit the engine lends: B, R_WORLD, llToWorld, fbm, hash2 */
const FALLS=[];          /* the data, turned into world coordinates and blocks */

/* ---- A FALL KEEPS ITS OWN VERTICAL SCALE, AND THAT IS DELIBERATE ----
   The mountains are drawn at forty metres to the block, and they must be: a
   summit is read from MILES OFF, and at any finer measure the great ranges
   would be walls into the firmament. Falls were given that same measure and
   the result was arithmetic rather than a waterfall — Angel 24 blocks, and
   NIAGARA AND IGUAZU TWO. At two blocks there is no room for a lip, a wall
   and a pool; there is a step in the ground.

   A fall is the opposite kind of thing from a summit. Nobody looks at one
   from miles away; a man stands at the foot of it and looks UP. So it is
   drawn at NINE metres to the block, and at that measure the world's falls
   come right: Niagara a six-block wall, Victoria twelve, Iguazu nine, Ein
   Gedi three, Yosemite eighty-two, Angel a hundred and nine.

   THE COST IS REAL AND IS NOT HIDDEN: a fall no longer stands in true
   proportion to the hill beside it. That was weighed and chosen — a world
   whose waterfalls are all one block tall is wrong in a way every player
   sees, and a proportion nobody can measure by eye is wrong in a way none
   of them ever will. */
let M_PER_BLOCK=40;              /* the mountains' measure, for reference */
const FALL_M_PER_BLOCK=9;        /* and a fall's own */

/* ---- THE FORMS, AS NUMBERS ----
   Each answers three questions: how far the wall is set back from the lip
   (`under`), how steep the wall falls (`steep`, 1 = sheer), and how the
   channel's width changes from lip to foot (`flare`). */
const FORM={
  plunge  :{under:0.16, steep:1.00, flare:0.9,  pool:1.5},
  horsetail:{under:0.02, steep:0.92, flare:1.0, pool:1.1},
  cataract:{under:0.05, steep:1.00, flare:1.2,  pool:1.8},
  tiered  :{under:0.00, steep:0.70, flare:1.1,  pool:1.3},
  fan     :{under:0.04, steep:0.88, flare:1.9,  pool:1.6},
  chute   :{under:0.10, steep:1.00, flare:0.45, pool:1.4}
};

function load(list,kit){
  K=kit; FALLS.length=0;
  if(kit&&kit.mPerBlock) M_PER_BLOCK=kit.mPerBlock;
  const B=K.B;
  for(const f of (list||[])){
    const p=K.llToWorld(f.lat,f.lon);
    const drop=Math.max(3,Math.round((f.drop||30)/FALL_M_PER_BLOCK));   /* in BLOCKS */
    /* the lip's half-breadth, in blocks. A metre is a block on the ground, so
       the true width is the true number of blocks — but Victoria at 1,708 is
       a wall a quarter of a chunk-ring across, which is right and is why the
       data carries the real figure. */
    const half=Math.max(1,Math.round((f.width||20)/2/ (B/ B) /6));
    /* WHICH WAY THE FALL FACES. It ought to be downhill, and downhill is a
       question for the terrain — but this file is loaded before the terrain
       can answer (see the note beside the call in js/engine.js: asking it
       there threw as the engine loaded and the world would not boot). The
       facing is drawn off the world's own noise instead: deterministic, the
       same on every machine, and asking nothing of anything. */
    const face=K.faceAt?K.faceAt(p[0],p[1]):0;
    const F=FORM[f.form]||FORM.plunge;
    FALLS.push({ n:f.n, x:p[0], z:p[1], drop, half,
      form:f.form||'plunge', tiers:Math.max(1,f.tiers||1),
      wood:f.wood||null, girth:f.girth||1,
      face, cs:Math.cos(face), sn:Math.sin(face), F,
      /* THE GORGE RUNS AS FAR AS THE CHANNEL NEEDS. It was `drop*2.2` — for
         Niagara thirteen blocks, which is shorter than the seven-block reach
         of the water landing in it, so the fall's own cut ended inside its own
         apron and the water walked out on to the flat. A channel wants room to
         descend and to find the river, and the claim must be a box that
         actually holds it. */
      run:Math.max(40,drop*3), R:Math.max(half*6,drop*B*2.6,Math.max(40,drop*3)*B*1.15),
      /* ---- THE BASIN'S OWN MEASURES, AND WHY THEY ARE NOT ONE NUMBER ----
         The pool was `half * F.pool` in BOTH directions, which for a cataract
         is not a pool but a county: Niagara's half-lip is a hundred blocks, so
         its "pool" came out a hundred and eighty-two blocks deep as well as
         wide — wider than the fall's whole claim, so every column near it was
         pool and the channel had nowhere to begin.
         A plunge basin is the shape of the curtain that fills it: as WIDE as
         the lip and a few blocks DEEP, which is two numbers and not one. */
      bd:Math.max(2,Math.min(5,Math.round(drop*0.35))),
      poolU:half+Math.max(2,Math.min(5,Math.round(drop*0.35)))+2,
      poolV:Math.max(3,Math.min(Math.round(drop*0.35),10)) });
  }
  return FALLS.length;
}

/* ---- WHERE A COLUMN STANDS IN A FALL'S OWN FRAME ----
   u runs ALONG the lip, v runs DOWNSTREAM. Both in blocks. */
function localOf(f,x,z,out){
  const dx=x-f.x, dz=z-f.z;
  out[0]=( dx*f.cs - dz*f.sn)/K.B;      /* u — across the lip */
  out[1]=( dx*f.sn + dz*f.cs)/K.B;      /* v — down the valley */
  return out;
}
const _uv=[0,0];

/* ---- WHERE THIS FALL EMPTIES ITSELF, AND HOW IT IS FOUND ----
   THE POINT OF IT: js/water.js gives up whatever reaches the world's own
   water — "when it reaches the sea and river it goes nowhere but disappear
   out" — so a channel that MEETS a river is a true outfall, and the only
   water then standing at a fall is what is in transit down it. Without one
   the fall fills its basin and stops, which is bounded and is a lake.

   THE SEARCH is a fan of rays out of the plunge pool, downstream and to
   either side, asking `outWater` at every other block: two raster lookups,
   no terrain, no cell, no cache. The nearest hit wins. It is done ONCE per
   fall, the first time the terrain asks about that fall, and there are
   thirty-four falls in the world.

   WHY IT IS NOT DONE AT LOAD. The falls are loaded from module top level,
   above the line that declares RANGES, and the note beside that call says
   what happened the two times something here asked the terrain a question
   from there: the engine threw as it loaded and the world did not boot.
   `outWater` asks the rasters and nothing else and would be safe — but the
   waterline is `SEA_SURF`, declared five thousand lines further down, and
   reading it at load would be the same dead zone again. So the whole of it
   waits until the first column is asked for, by which time the file is
   read and everything in it is standing. */
const OUT_FAN=9;             /* rays, spread across the downstream half */
const OUT_SPREAD=1.25;       /* radians either side of straight downstream */
function findOutfall(f){
  if(!K.outWater) return null;
  const B=K.B, start=f.poolV+2;
  const maxD=Math.min(f.run,Math.round(f.R/B)-2);
  let best=null;
  for(let r=0;r<OUT_FAN;r++){
    const a=(r/(OUT_FAN-1)*2-1)*OUT_SPREAD;
    const su=Math.sin(a), sv=Math.cos(a);
    for(let d=start;d<=maxD;d+=2){
      const u=su*d, v=sv*d;
      const x=f.x+(u*f.cs+v*f.sn)*B, z=f.z+(-u*f.sn+v*f.cs)*B;
      const w=K.outWater(Math.floor(x/B),Math.floor(z/B));
      if(!w) continue;
      if(!best||d<best.d) best={u,v,d,kind:w};
      break;                        /* this ray has found its water */
    }
  }
  return best;
}
/* ---- THE OUTFALL AND THE GRADE ARE ONE ACT, AND ARE DONE IN ONE PLACE ----
   They were two, and it bit within the hour: the read-only probe set the
   outfall and left the grade unset, so the terrain the probe reported was cut
   to a DIFFERENT SHAPE from the terrain the game builds — a flat channel in
   the one and a staircase in the other, off the same fall in the same world.
   A thing worked out once is worked out in one function, and everything that
   wants it calls that.

   ---- AND THE FALL IS RAISED ENOUGH FOR THE CHANNEL TO RUN ----
   THE FAULT, measured: the channel to Niagara's outfall was cut and came out
   DEAD FLAT at height 1 — the waterline — for the whole twenty-five blocks,
   because the basin floor was already there and there was nothing underneath.
   Water reaches seven blocks from a source and no further on the flat, so it
   died a third of the way along and lay in a sheet exactly as before. A stream
   is not a channel; it is a channel with a FALL in it, and it wants a step
   down every few blocks the whole way or it stops being a stream.

   So a fall with an outfall is set high enough to reach it: a block of grade
   for every five blocks of distance, on top of the basin it must also hold.
   Niagara's lip stands some blocks higher than the plain for it, eased back to
   the true land at the edge of the claim as everything else here is — which is
   the same trade this file has made since its first line: a waterfall is a
   SHAPE OF GROUND. Its gorge now reads 7 6 6 6 5 5 5 5 4 4 4 3 3 3 3 2 2 2 2 1
   where it read 1 1 1 1 1 1 1 1 1 1, and that staircase is the stream. */
function prepare(f){
  if(f.out!==undefined) return f;
  f.out=findOutfall(f);
  f.grade=f.out?Math.min(9,Math.ceil(f.out.d/5)):0;
  return f;
}
/* the distance from a column to the channel's own line, and how far along it
   that column stands — the two numbers the cut is made of */
function onChannel(f,u,v,out){
  const o=f.out, u0=0, v0=f.poolV;
  const du=o.u-u0, dv=o.v-v0, len2=du*du+dv*dv;
  let t=len2>0?((u-u0)*du+(v-v0)*dv)/len2:0;
  if(t<0) t=0; else if(t>1) t=1;
  out[0]=Math.hypot(u-(u0+du*t), v-(v0+dv*t));
  out[1]=t;
  return out;
}
const _ch=[0,0];

/* ---- THE HOOK THE TERRAIN CALLS ----
   Given a column and the height the world would otherwise give it, answer
   the height it stands at. Returns the height unchanged for all but the
   handful of columns near a fall, and the FIRST thing it does is throw the
   rest out. */
function heightAt(x,z,h){
  if(!FALLS.length) return h;
  for(let i=0;i<FALLS.length;i++){
    const f=FALLS[i];
    const dx=x-f.x; if(dx>f.R||dx<-f.R) continue;
    const dz=z-f.z; if(dz>f.R||dz<-f.R) continue;
    localOf(f,x,z,_uv);
    const u=_uv[0], v=_uv[1];
    /* ---- THE CHANNEL TO THE OUTFALL, WHICH IS ASKED BEFORE ANYTHING ELSE ----
       It is asked first because it may run ANYWHERE inside the claim — a
       river is where it is, and it is not obliged to lie downstream of the
       lip — and because it must not drag the shelf with it: the shoulder
       easing below raises the ground across its whole width, and a shoulder
       widened to reach a river would raise a county. The channel is a narrow
       CUT and nothing more. It never raises the land, only lowers it: where
       the ground is already lower than the channel would be, the ground is
       left as it is and the water runs down it of its own accord. */
    prepare(f);
    if(f.out){
      onChannel(f,u,v,_ch);
      const cw=Math.max(1,Math.min(f.half,Math.round(2+f.drop*0.12)));
      if(_ch[0]<=cw){
        /* from the basin's floor down to the water it empties into, a step at
           a time, so the water always has a way down within its own reach */
        const top=Math.max(2+f.bd+(f.grade||0),h-2)-f.bd;
        const end=Math.max(1,K.seaBlock?K.seaBlock():1);
        return Math.max(1,Math.round(top+(end-top)*_ch[1]));
      }
    }
    if(v<-f.run*0.5||v>f.run) continue;
    const au=Math.abs(u);
    /* the shoulders of the gorge: outside them the land is the world's own */
    const shoulder=f.half+Math.max(3,f.drop*0.6);
    if(au>shoulder) continue;

    const F=f.F;
    /* ---- THE FALL IS RAISED, NOT DUG ----
       Cutting `drop` blocks DOWN from the natural land was the first draft,
       and at the falls' own scale it is a disaster: Angel's terrain stands at
       one block above the sea, so a hundred-and-nine-block cut is a shaft to
       bedrock and no fall at all. And it is backwards besides — Angel comes
       off a TEPUI, a table mountain standing a kilometre over the forest;
       the land there is high, and the game's coarse terrain simply has not
       got the tepui.

       So the gorge floor is set just under the surrounding land and THE
       SHELF IS RAISED to meet it: the fall builds its own cliff out of the
       ground, which is what the ground did over the ages anyway. Nothing is
       ever taken below the waterline.

       ---- AND IT STANDS HIGH ENOUGH TO HOLD THE POOL IT FALLS INTO ----
       This was `max(2, h-2)`. At Niagara the natural land is three blocks, so
       the foot stood at ONE — the floor of the world, with nothing under it to
       cut into. That is why the water there lay in a sheet: there was no basin
       to gather in and no slope to run down, because there was no room below
       the ground for either. A fall is now never set lower than the basin it
       needs, which is a lift of two or three blocks at the falls that sit on
       low ground, and the shelf eases back to the true land at the edge of the
       claim exactly as it always did. */
    const basin=f.bd;
    const foot=Math.max(2+basin+(f.grade||0),h-2);
    const lip=foot+f.drop;
    /* and the shelf eases back down to the true land at the edge of the
       claim, so a tepui is a headland and not a box dropped on a plain */
    const edge=Math.max(0,Math.min(1,(shoulder-au)/Math.max(1,shoulder*0.45)));

    /* --- upstream of the lip: the shelf, flat and a little dished so the
       water is gathered to the notch rather than spread over the shelf --- */
    if(v<=0){
      const dish=(au<f.half)?-1:0;
      return Math.round(h+(lip-h)*edge)+dish;
    }
    /* --- the wall --- */
    const set=F.under*f.drop;            /* how far the wall is set back */
    /* ---- A SHEER WALL IS SHEER, WHATEVER THE DROP ----
       This read `drop / steep`, so steep:1 — which the table above calls
       SHEER — gave a wall that took as many blocks of ground as it fell:
       a forty-five degree ramp. Angel's profile came back 110 110 110 111
       111 111 111 … flat for every block sampled, because its wall was a
       hundred and nine blocks long. Water does not FALL down a ramp, it RUNS
       down it, and that is half of why a spring at the lip flooded a county.
       `steep` is now what it always said it was: the fraction of the drop the
       wall is allowed to spend in ground. Sheer spends one block. */
    const wallEnd=Math.max(1,Math.round(f.drop*(1-F.steep))+1);
    if(v<=set) return lip;               /* the lip itself, standing proud */
    if(v<=set+wallEnd){
      const t=(v-set)/wallEnd;           /* 0 at the lip, 1 at the foot */
      /* TIERED COMES DOWN IN STEPS, and the step is a block, which is what a
         world of blocks is for */
      if(f.form==='tiered'){
        const s=Math.min(f.tiers-1,Math.floor(t*f.tiers));
        return Math.round(lip-(f.drop*(s+1)/f.tiers));
      }
      return Math.round(lip-f.drop*t);
    }
    /* --- the plunge pool, and the gorge running away from it --- */
    /* ---- THE BASIN THE WATER RUNS INTO AND STOPS IN ----
       THE FAULT, and it came from a player's own screen: at the foot of
       Niagara he stood in a LAKE lying on flat ground. It is not a flood —
       the level rule bounds it at seven blocks from every source and it
       settles — but a sheet of water going nowhere is not the foot of a
       waterfall. The pool here was one block deep and the width of the lip,
       which is a wet mark on a plain, not a pool.

       So it is a BASIN: as deep as the fall can afford and wider than its own
       apron, cut into the ground with the gorge floor standing round it as a
       rim. The water comes down the wall, gathers in it, and stops there —
       which is what the man asked for, and it is also what a plunge pool is.
       Its own rim keeps it: water spreads sideways only when it cannot go
       down, and inside the basin down is always toward the middle. */
    const dv=v-(set+wallEnd);
    const poolFloor=foot-basin;
    if(dv<f.poolV&&au<f.poolU) return poolFloor;
    /* ---- AND THE WATER HAS SOMEWHERE TO GO ----
       THE FAULT, and it was reported from a picture: at the foot of Niagara
       the traveller stood in a LAKE. Not a flood — the level rule bounds it at
       seven blocks from every source and it settles at some three thousand
       cells — but a sheet of water lying on flat ground, going nowhere, which
       is not what the foot of a waterfall looks like.

       The gorge was the reason. This file promised "a gorge running away
       downstream that the fall itself cut", and what it actually cut was
       FLAT: `return foot` for every column past the pool, so the profile below
       Niagara read 1 1 1 1 1 1 1 … for as far as it was sampled. Water on a
       flat plain has no shortest way down, so it takes every way at once and
       spreads as a disc. That is the disc in the picture.

       So the gorge is a CHANNEL now: a cut a few blocks wide running away
       downstream and DESCENDING, with the old gorge floor standing as its
       banks on either side. The flow's own rule does the rest — water spreads
       sideways only when it cannot go down, and down is now always along the
       channel — so the fall runs off in a stream instead of lying in a sheet.

       AND IT RUNS TO THE RIVER WHERE THERE IS ONE. A river is open water in
       this world and js/water.js gives up whatever reaches it ("when it
       reaches the sea and river it goes nowhere but disappear out"), so a
       channel that meets one has a true outfall and the standing water at the
       fall is only what is in transit. Where there is no river within reach,
       the channel's own end is its lowest point and the water gathers there —
       a cistern by construction, and bounded, because the channel is cut and
       the banks are not. */
    /* ---- AND THE GORGE FLOOR COMES BACK DOWN TO THE COUNTRY ----
       It returned `foot` flat to the edge of the claim, which was invisible
       while the foot sat a block or two under the natural land and is a
       PLATEAU WITH A CLIFF ROUND IT the moment a fall is raised to reach its
       outfall. So the floor eases from the foot at the pool to the world's own
       land at the edge of the run, exactly as the shelf above already eases,
       and a man walking away from the fall walks down a slope and not off a
       step. The channel is cut into that slope. */
    const tail=Math.max(1,f.run-f.poolV);
    const tEdge=Math.max(0,Math.min(1,(dv-f.poolV)/tail));
    const floorHere=Math.round(foot+(Math.max(1,h-1)-foot)*tEdge);
    const cw=Math.max(1,Math.min(f.half,Math.round(2+f.drop*0.12)));
    if(au<=cw){
      const d=dv-f.poolV;                          /* how far down the gorge */
      const step=Math.max(2,Math.round(6-f.drop*0.02));   /* a block down every few */
      return Math.max(1,Math.min(poolFloor,floorHere-1,foot-1-Math.floor(d/step)));
    }
    return floorHere;
  }
  return h;
}

/* ---- IS THIS COLUMN IN THE CHANNEL THE WATER RUNS DOWN? ----
   The engine asks this to know where to put water, and js/water.js does the
   rest — the source at the lip, and the falling is its own business. */
function channelAt(x,z){
  for(let i=0;i<FALLS.length;i++){
    const f=FALLS[i];
    const dx=x-f.x; if(dx>f.R||dx<-f.R) continue;
    const dz=z-f.z; if(dz>f.R||dz<-f.R) continue;
    localOf(f,x,z,_uv);
    const u=_uv[0], v=_uv[1];
    if(v<-f.run*0.5||v>f.run) continue;
    /* the channel FLARES or PINCHES with the form as it goes down */
    const t=Math.max(0,Math.min(1,v/Math.max(1,f.drop)));
    const w=f.half*(1+(f.F.flare-1)*t);
    if(Math.abs(u)<=w) return f;
  }
  return null;
}

/* ---- THE LIP OF EVERY FALL, so the engine may set a spring there ----
   One source at the middle of each lip is enough: js/water.js takes it down
   the wall, spreads it at the foot and keeps it running for as long as the
   source stands — which is what a spring IS. A wide cataract gets a source
   every few blocks along its lip instead, or Victoria would be a trickle.

   ---- AND THE HEAD STANDS AT THE BRINK, NOT AT THE MIDDLE OF THE SHELF ----
   THE FAULT, measured: a spring laid at Angel put 549 cells of water into the
   world and NOT ONE OF THEM WENT OVER — shaft 0, and the furthest cell
   nineteen blocks from the head. A hundred-and-nine-block fall stood
   completely dry while a puddle sat on the tabletop behind it.

   The heads were laid at v = 0, and v = 0 is not the brink. `heightAt` holds
   the lip proud for the whole of `under × drop` — which is what an OVERHANG
   is, and it is the making of a plunge fall — so for Angel the brink is
   SEVENTEEN BLOCKS DOWNSTREAM of where the spring stood. Water reaches seven
   blocks from a source and no further, so it never came within ten blocks of
   the edge and had nowhere to fall from.

   The head goes at the brink itself. Niagara (under 0.05 of a six-block drop)
   and Multnomah (under 0, a tiered stair) are unmoved by this — their brink
   already was v = 0, which is why they poured and Angel did not. It is the
   great plunges, the very falls the form was written for, that were dry. */
/* ---- HOW MANY HEADS, AND WHY IT IS STILL SEVEN ----
   Seven was enough while a landed column fed its own sides like a spring:
   the water spread along the brink of itself and the whole breadth poured.
   That rule is gone — it was the same rule that made a plunge pool a
   perpetual-motion machine (js/water.js: a pool is not a fall) — and the
   curtain went with it. Angel is 921 cells now against 24,556: seven threads
   down a cliff twenty-seven blocks wide, which is bounded, drains perfectly,
   and does not look like Angel.

   A HEAD EVERY OTHER BLOCK WAS TRIED AND TAKEN BACK OUT. It gives the volume
   back (Iguazu 12,738 cells) and it will not unwind: with the hundred heads
   taken up, the water went on growing rather than retreating, and the run
   after it inherited a lake. Whatever that is, it is not understood yet, and
   a fall that cannot be turned off is worse than a fall that is thin — so
   this stands at seven until the drain is understood at a hundred.
   Acceptance test 39 is what found it, in the run it was written for. */
function springs(f){
  const out=[];
  const step=Math.max(1,Math.round(f.half/3));
  const v=Math.max(0,Math.floor(f.F.under*f.drop));    /* the brink */
  for(let u=-f.half;u<=f.half;u+=step){
    const x=f.x+( u*f.cs+v*f.sn)*K.B;
    const z=f.z+(-u*f.sn+v*f.cs)*K.B;
    out.push([x,z]);
  }
  return out;
}

/* the growth of a gorge — handed to js/flora.js, which knows the trees */
function woodAt(x,z){
  const f=channelAt(x,z);
  return f?{kinds:f.wood,girth:f.girth}:null;
}
function nearest(x,z,within){
  let best=null,bd=within===undefined?1e9:within;
  for(const f of FALLS){ const d=Math.hypot(x-f.x,z-f.z);
    if(d<bd){ bd=d; best=f; } }
  return best;
}

window.WATERFALL={ load, heightAt, channelAt, springs, woodAt, nearest,
  /* read-only, for the measuring: where this fall was found to empty itself */
  outfall:f=>prepare(f).out, grade:f=>prepare(f).grade,
  list:()=>FALLS, count:()=>FALLS.length, FORM };
})();
