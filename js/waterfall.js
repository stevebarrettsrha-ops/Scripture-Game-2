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

/* how many metres of true height make one block of the world's own reckoning.
   The engine holds this for the mountains; a fall must use the SAME one or a
   cliff and the summit beside it are drawn at two different scales. */
let M_PER_BLOCK=40;

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
    const drop=Math.max(2,Math.round((f.drop||30)/M_PER_BLOCK));   /* in BLOCKS */
    /* the lip's half-breadth, in blocks. A metre is a block on the ground, so
       the true width is the true number of blocks — but Victoria at 1,708 is
       a wall a quarter of a chunk-ring across, which is right and is why the
       data carries the real figure. */
    const half=Math.max(1,Math.round((f.width||20)/2/ (B/ B) /6));
    /* THE FALL FACES DOWNHILL, and which way that is, is a thing about the
       ground and not about the fall — so it is settled once, here, by asking
       the land which way it drops away. A fall built facing uphill is a
       waterfall running INTO a mountain. */
    const face=K.downhillAt?K.downhillAt(p[0],p[1]):0;
    const F=FORM[f.form]||FORM.plunge;
    FALLS.push({ n:f.n, x:p[0], z:p[1], drop, half,
      form:f.form||'plunge', tiers:Math.max(1,f.tiers||1),
      wood:f.wood||null, girth:f.girth||1,
      face, cs:Math.cos(face), sn:Math.sin(face), F,
      /* the gorge runs away downstream for a few times the drop, and the
         whole claim is a box about that long and three lips wide */
      run:Math.max(8,drop*2.2), R:Math.max(half*6,drop*B*2.6) });
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
    if(v<-f.run*0.5||v>f.run) continue;
    const au=Math.abs(u);
    /* the shoulders of the gorge: outside them the land is the world's own */
    const shoulder=f.half+Math.max(3,f.drop*0.6);
    if(au>shoulder) continue;

    const F=f.F;
    /* the shelf the river runs on, and the floor of the gorge under it */
    const lip=h;                         /* the land above keeps its own height */
    const foot=lip-f.drop;

    /* --- upstream of the lip: the shelf, flat and a little dished so the
       water is gathered to the notch rather than spread over the shelf --- */
    if(v<=0){
      const dish=(au<f.half)?-1:0;
      return lip+dish;
    }
    /* --- the wall --- */
    const set=F.under*f.drop;            /* how far the wall is set back */
    const wallEnd=Math.max(1,f.drop*(1/Math.max(0.3,F.steep)));
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
    const poolR=Math.max(2,f.half*F.pool);
    const dv=v-(set+wallEnd);
    if(dv<poolR&&au<poolR) return foot-Math.max(1,Math.round(f.drop*0.12));
    return foot;
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
   every few blocks along its lip instead, or Victoria would be a trickle. */
function springs(f){
  const out=[];
  const step=Math.max(1,Math.round(f.half/3));
  for(let u=-f.half;u<=f.half;u+=step){
    const x=f.x+( u*K.B)*f.cs+(0)*f.sn;
    const z=f.z+(-u*K.B)*f.sn+(0)*f.cs;
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
  list:()=>FALLS, count:()=>FALLS.length, FORM };
})();
