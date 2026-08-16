/* ============================================================
   THE WATER THAT IS SPILLED — and only that water
   ------------------------------------------------------------
   "He gathereth the waters of the sea together as an heap: he layeth up
    the depth in storehouses."

   ---- WHAT THIS FILE IS FOR, AND WHAT IT MUST NOT TOUCH ----
   THE SEA AND THE RIVERS ARE NOT BLOCKS. The ocean is a travelling Gerstner
   surface with a shaded bed under it; a river is a line stamped in the
   country raster that the terrain reads as it is generated. Neither is made
   of cells and neither passes through this file at any point. That is not a
   promise kept by care — it is kept by construction: nothing here reads or
   writes anything but the EDIT OVERLAY, which is the record of what hands
   have done. Delete this file and the sea and the rivers are exactly as they
   were.

   What DOES pass through here is the water a hand spills, the water a storm
   or a surge throws over a shore, and the water that runs out of either.

   ---- WHY IT IS NOT THE FLOW THAT WAS HERE BEFORE ----
   The engine already carried finite water, and it was a CONSERVATIVE PARCEL:
   one block of water MOVED — its old cell emptied, its new cell filled — and
   the total in the world never changed. That is a defensible model and it
   was deliberate. It cannot produce either of the two things a player asks
   for by name:

     A WATERFALL needs a source that STAYS while a stream runs off it. A
     parcel falls once and is a puddle.
     A BUCKET SPILLED needs one block to become a SHEET seven blocks wide. A
     parcel slides downhill and settles in the first hollow it finds.

   So this is the other model, the one every player already has in his hands:

     A SOURCE (level 0) is never consumed. It feeds.
     FLOWING water carries a level, 1 to 7, and each step out from the source
       is one thinner. At 8 it has run out and there is no water there.
     FALLING water — anything with water directly above it — is a full block
       however far it has fallen, which is why a waterfall is a column and
       not a fading dribble, and it spreads at 1 when it lands.
     A cell with no feeder DRIES, one level a tick, so cutting the source
       drains the stream back the way it came instead of leaving it hanging.

   ---- HOW IT IS TICKED ----
   Not every cell every frame — that is a thousand cells a frame for a puddle
   nobody is looking at. A WAKE QUEUE, exactly as the engine's own falling
   sand keeps: a cell is looked at when something happened to it or to one of
   its six neighbours, and the queue is worked down under a millisecond
   budget. Water also ticks at its own PACE (five to the second, as it does
   in the game everyone knows it from), so a stream visibly runs rather than
   snapping to its final shape in one frame.

   ---- WHAT THE ENGINE LENDS IT ----
   The same arrangement js/flora.js keeps: the engine hands it a kit of the
   few things it needs and this file knows nothing else about the world. It
   cannot reach the sea because it was never given a way to.
   ============================================================ */
(function(){
'use strict';

/* ---- THE LEVELS ---- */
const SOURCE=0;        /* a spring, a spilled bucket, the sea's own edge */
const THINNEST=7;      /* the last step a sheet reaches before it is nothing */
const FALLING=8;       /* fed from above: drawn full, spreads at 1 when it lands */

/* how often the water moves, and how much of a frame it may have */
const TICK=1/5;                 /* five moves to the second, as water does */
const MS_PER_FRAME=1.2;         /* and never more of a frame than this */
const WAKE_MAX=20000;           /* a runaway is capped rather than trusted */

let K=null;                     /* the kit the engine lends */
/* the level of every cell of spilled water, by its own key. The BLOCK is set
   through the engine so the mesher, the collision and the save all see it;
   this holds only the LEVEL, which is a thing the block table has no room
   for and which nothing outside this file needs to know. */
const LEV=new Map();
const WAKE=[];                  /* ix,iy,iz, flat, oldest first */
const INQ=new Set();            /* what is already waiting, so it is not queued twice */
let acc=0, moved=0, dried=0, ticks=0;

function key(ix,iy,iz){ return ix+','+iy+','+iz; }

/* ---- WHAT IS AT A CELL ----
   `water` here means water THIS FILE put there. Water that was always part
   of the world — a village trough, a stamped pool — is left alone: it has no
   level, and a thing with no level is not flowing and never dries. */
function levelAt(ix,iy,iz){
  const v=LEV.get(key(ix,iy,iz));
  return v===undefined?null:v;
}
function isWater(ix,iy,iz){ return K.isLiquid(K.blockAt(ix,iy,iz)); }
/* a cell water may run into: empty air, and nothing else. It does not wash
   away what a hand has built, and it does not eat the world's own rock. */
function open(ix,iy,iz){ return K.blockAt(ix,iy,iz)===0; }

function wake(ix,iy,iz){
  if(iy<K.EY_MIN||iy>=K.EY_MAX) return;
  const k=key(ix,iy,iz);
  if(INQ.has(k)) return;
  if(WAKE.length>=WAKE_MAX*3) return;
  INQ.add(k); WAKE.push(ix,iy,iz);
}
function wakeAround(ix,iy,iz){
  wake(ix,iy,iz);
  wake(ix+1,iy,iz); wake(ix-1,iy,iz);
  wake(ix,iy,iz+1); wake(ix,iy,iz-1);
  wake(ix,iy+1,iz); wake(ix,iy-1,iz);
}

/* ---- SETTING AND UNSETTING, THE ONLY TWO DOORS ---- */
function put(ix,iy,iz,lev){
  LEV.set(key(ix,iy,iz),lev);
  K.setBlock((ix+0.5)*K.B,(iy+0.5)*K.B,(iz+0.5)*K.B, K.waterN);
  moved++; wakeAround(ix,iy,iz);
}
function clear(ix,iy,iz){
  LEV.delete(key(ix,iy,iz));
  K.setBlock((ix+0.5)*K.B,(iy+0.5)*K.B,(iz+0.5)*K.B, 0);
  dried++; wakeAround(ix,iy,iz);
}

/* ---- WHAT LEVEL A CELL OUGHT TO HAVE ----
   A source answers for itself. Everything else is one thinner than the best
   of its feeders: the cell above if that is water at all (which makes it
   FALLING, and a fall is full whatever the height it fell from), or the
   thinnest of its four sides. Nothing feeds it — it dries. */
function wants(ix,iy,iz){
  if(isWater(ix,iy+1,iz)) return FALLING;
  let best=THINNEST+1;
  for(let d=0;d<4;d++){
    const q=DIR[d], tx=ix+q[0], tz=iz+q[1];
    if(!isWater(tx,iy,tz)) continue;
    const l=levelAt(tx,iy,tz);
    /* water that was always in the world — a stamped trough — feeds like a
       source and is never drained by anything here */
    const eff=(l===null)?SOURCE:(l===FALLING?SOURCE:l);
    if(eff+1<best) best=eff+1;
  }
  return best>THINNEST?null:best;
}
const DIR=[[1,0],[0,1],[-1,0],[0,-1]];

/* ---- ONE CELL, LOOKED AT ---- */
function visit(ix,iy,iz){
  const lev=levelAt(ix,iy,iz);
  const here=isWater(ix,iy,iz);

  /* (a) a cell this file believes is water, but the world says is not —
     a hand has taken it up, or a block was laid in it. Forget it. */
  if(lev!==null&&!here){ LEV.delete(key(ix,iy,iz)); wakeAround(ix,iy,iz); return; }

  /* (b) not our water at all, and nothing to do but tell the neighbours it
     is there — a hollow beside a stream is a place the stream may go */
  if(lev===null){
    if(!here&&K.blockAt(ix,iy,iz)===0){
      /* an empty cell: does anything above or beside it feed it? */
      const w=wants(ix,iy,iz);
      if(w!==null&&w<=THINNEST) put(ix,iy,iz,w);
    }
    return;
  }

  /* (c) OUR water. Does it still have a feeder? A source always does. */
  if(lev!==SOURCE){
    const w=wants(ix,iy,iz);
    if(w===null){ clear(ix,iy,iz); return; }
    if(w!==lev){ LEV.set(key(ix,iy,iz),w); wakeAround(ix,iy,iz); }
  }

  /* (d) DOWN FIRST, and if it can go down it does nothing else. That single
     rule is the whole difference between a waterfall and a wet patch. */
  if(iy-1>=K.EY_MIN&&open(ix,iy-1,iz)){ put(ix,iy-1,iz,FALLING); return; }

  /* (e) and otherwise it spreads, one level thinner, to every side it can.
     A falling column spreads at 1 where it lands, as a source does. */
  const out=(lev===FALLING?SOURCE:lev)+1;
  if(out>THINNEST) return;
  for(let d=0;d<4;d++){
    const q=DIR[d], tx=ix+q[0], tz=iz+q[1];
    if(!open(tx,iy,tz)) continue;
    const cur=levelAt(tx,iy,tz);
    if(cur===null||cur>out) put(tx,iy,tz,out);
  }
}

/* ---- THE TICK ---- */
function step(dt){
  if(!K||!WAKE.length) return;
  acc+=dt;
  if(acc<TICK) return;
  acc=0; ticks++;
  const t0=(K.now?K.now():0);
  let n=0;
  /* the queue as it stands at the start of this tick, and no further — what
     this tick wakes is looked at on the NEXT one, so a stream runs a block a
     tick and is seen to run rather than arriving all at once */
  let left=WAKE.length/3;
  while(left-->0&&WAKE.length){
    const ix=WAKE.shift(), iy=WAKE.shift(), iz=WAKE.shift();
    INQ.delete(key(ix,iy,iz));
    visit(ix,iy,iz);
    if(((++n)&15)===0&&K.now&&K.now()-t0>MS_PER_FRAME) break;
  }
}

/* ---- THE THREE WAYS WATER GETS INTO THE WORLD ---- */
/* A HAND SPILLS IT. One source, laid where he says, and it finds its own
   level from there — down every fall it meets and seven blocks out over
   every flat. */
function spill(ix,iy,iz){
  if(!K) return false;
  if(!open(ix,iy,iz)&&!isWater(ix,iy,iz)) return false;
  put(ix,iy,iz,SOURCE);
  return true;
}
/* A HAND TAKES IT UP AGAIN. The source goes and the stream that hung on it
   drains back the way it came, a level at a time. */
function take(ix,iy,iz){
  if(!K||levelAt(ix,iy,iz)===null) return false;
  clear(ix,iy,iz);
  return true;
}
/* A SURGE THROWS IT ASHORE — a storm sea, or the great wave. A line of
   sources is laid along the front at the height the water has risen to, and
   from there it is ordinary spilled water: it runs inland over whatever is
   lower than itself and drains back off the land when the surge passes,
   because the sources go with it.
   `cells` is a list of [ix,iy,iz]; the caller decides WHERE a surge reaches,
   because that is a question about the sea and the shore and not about the
   water once it is over the wall. */
function surge(cells){
  if(!K||!cells) return 0;
  let n=0;
  for(const c of cells) if(spill(c[0],c[1],c[2])) n++;
  return n;
}
/* and the same water let go of again when the wave draws back */
function withdraw(cells){
  if(!K||!cells) return 0;
  let n=0;
  for(const c of cells) if(take(c[0],c[1],c[2])) n++;
  return n;
}

/* ---- WHAT THE ENGINE MUST TELL IT ---- */
/* a cell was changed by something that is not this file — a block broken, a
   block laid, a bank of sand come down. Its neighbourhood is looked at. */
function disturb(ix,iy,iz){ if(K) wakeAround(ix,iy,iz); }

function load(kit){
  K=kit;
  LEV.clear(); WAKE.length=0; INQ.clear();
  acc=0; moved=0; dried=0; ticks=0;
}
/* the whole of the spilled water, for a save — and to be put back on a load.
   Nothing of the sea or the rivers is in it, because nothing of them was
   ever in this file. */
function serialise(){ const o=[]; for(const [k,v] of LEV) o.push(k+':'+v); return o; }
function restore(list){
  if(!K||!list) return 0;
  let n=0;
  for(const s of list){
    const i=s.lastIndexOf(':'); if(i<0) continue;
    const p=s.slice(0,i).split(','), v=+s.slice(i+1);
    if(p.length!==3) continue;
    LEV.set(s.slice(0,i),v); wakeAround(+p[0],+p[1],+p[2]); n++;
  }
  return n;
}

window.WATER={
  load, step, spill, take, surge, withdraw, disturb,
  levelAt, serialise, restore,
  /* read-only, for tools/acceptance.js and for nothing else */
  count:()=>LEV.size, waiting:()=>WAKE.length/3,
  stats:()=>({cells:LEV.size,waiting:WAKE.length/3,ticks,moved,dried}),
  SOURCE, THINNEST, FALLING
};
})();
