/* ============================================================
   THE CROP OF EVERY FIELD — which one, and where in its year
   ------------------------------------------------------------
   "He that observeth the wind shall not sow; and he that regardeth the
    clouds shall not reap."

   THE TWO FILES, AND WHICH IS WHICH
   world/crops.js  the data. What each crop is: its stature, its colour, and
                   whether it turns to straw or is green the day it is lifted.
   js/crop.js      this file. WHICH crop a given field bears, and the shape
                   of the agricultural year — the two halves of §2.4.6.

   ---- WHICH CROP, AND IT IS NOT DECIDED HERE EITHER ----
   A country's growth is already written down, once, in world/flora.js — Egypt
   grows wheat and barley and cotton, Java grows rice, Mali grows millet and
   sorghum. This file asks THAT list, keeps whatever world/crops.js knows how
   to grow in a field, and draws one by a number seeded on the FIELD'S OWN
   PLACE. So a plot bears the same crop for ever, and the two fields of one
   village bear different ones. Nothing here knows the name of a country.

   ---- AND THE YEAR IS IN THE SHADER, WHICH IS THE WHOLE TRICK ----
   A crop that grows in stages is GEOMETRY that changes, and geometry that
   changes means the chunk is built again. A village would be re-meshed every
   few days of the voyage for a field of wheat, which is not a trade worth
   making for any amount of beauty.
   So it is done the way the leaves of the world have gilded since Round 53:
   in the vertex shader, off ONE uniform (the turn of the year) and the
   vertex's own distance from the middle of the disc, which is its latitude.
   The crop is meshed ONCE, at its full stature, and it is SUNK into the
   tilled soil by how far off harvest it is — ploughed ground before sowing,
   shoots after it, standing corn by midsummer, gold at the reaping, stubble
   after. Not one chunk is built twice, and there is not one new draw call in
   a field that turns.
   `YEAR` below is that curve, written in JavaScript as well as in GLSL — not
   because anything in the game reads the JavaScript, but because a curve that
   exists only as a string inside a shader cannot be tested, and acceptance
   test 48 tests this one. The two are kept beside each other on purpose and
   the test asserts they agree.
   ============================================================ */
(function(){
'use strict';

function hash2(x,y){ const n=Math.sin(x*127.1+y*311.7)*43758.5453; return n-Math.floor(n); }

let KINDS={}, LANDS=null, WILDS=null;
/* the field crops of a country, worked out once and kept — the mesher asks
   this for every field of every village it builds */
const listCache=new Map();

function load(crops,flora){
  KINDS=(crops&&crops.kinds)||{};
  LANDS=(flora&&flora.lands)||null;
  WILDS=(flora&&flora.wilds)||null;
  listCache.clear();
}

/* ---- WHAT THIS COUNTRY SOWS ----
   Its own growth, out of world/flora.js, with everything this file cannot
   grow in a field thrown away. A country whose list names no field crop at
   all — an ice shelf, an atoll of coconut — falls back to barley, which is
   the commonest cultivated thing on the earth and is grown from Iceland to
   Ethiopia. A village with a fenced, tilled, watered field in it is not
   growing nothing. */
const FALLBACK=['barley','wheat'];
function sownIn(land){
  let L=listCache.get(land);
  if(L!==undefined) return L;
  const names=(land&&LANDS&&LANDS[land])||null;
  const out=[];
  if(names) for(const n of names) if(KINDS[n]&&out.indexOf(n)<0) out.push(n);
  if(!out.length) for(const n of FALLBACK) if(KINDS[n]) out.push(n);
  if(listCache.size>400) listCache.clear();
  listCache.set(land,out);
  return out;
}
/* ---- AND WHICH OF THEM STANDS IN *THIS* FIELD ----
   Seeded on the field's own corner, so the plot is sown with the same thing
   every time the village is built, and the next plot along is not. */
/* THE SWITCH. With it off, `forField` answers nothing and the mesher falls
   back to exactly the field it drew before — twelve anonymous crosses at one
   stature in `crop`, the same in every country. That is not a debug toy: the
   second material (`cropEver`, for what does not turn) is a draw call, and a
   draw call is measured beside the thing it replaced, in one page, on the
   same chunks. See AUDIT Round 68. */
let ON=true;
function forField(land,fx,fz){
  if(!ON) return null;
  const L=sownIn(land); if(!L.length) return null;
  const j=hash2(Math.floor(fx*0.037)+7.7, Math.floor(fz*0.041)-3.1);
  const K=KINDS[L[Math.min(L.length-1,Math.floor(j*L.length))]];
  return K||null;
}

/* ============================================================
   THE YEAR
   ------------------------------------------------------------
   `ph` is the turn of the year, 0..1, from js/season.js — the same number the
   leaves gild by. `latN` is +1 at the north pole, 0 at the equator, -1 at the
   south, which is what the shader can work out from a vertex and nothing else.

   THE SOUTH IS HALF A YEAR ON, and the higher the latitude the later the
   sowing and the shorter the season between it and the sickle. That is the
   whole of the agricultural year and it is very nearly the whole truth: a
   Norwegian harvest and an Egyptian one are four months apart, and a Norwegian
   barley harvest and a Norwegian oat harvest are a fortnight apart.

   THE TROPICS HAVE NO DEAD SEASON. Within about ten degrees of the line there
   is no winter to stop for, two and three crops come off the same ground in a
   year, and a field is never bare for long. That is `warm` below, and without
   it every rice paddy on the equator would go to stubble in January.
   ============================================================ */
const SOW0=0.04, SOW1=0.34;     /* seedtime: at the line, and how much later at the pole */
const RIPE0=0.28, RIPE1=0.40;   /* and when it comes ready */
const REAP=0.06;                /* how long it stands ripe before the sickle */
const STUBBLE=0.16;             /* what is left standing after the reaping */
const GOLD=0.11;                /* how long before the reaping it begins to turn */

function smooth(a,b,x){ const t=Math.max(0,Math.min(1,(x-a)/(b-a))); return t*t*(3-2*t); }

/* how far on this field is, 0 (ploughed, bare) .. 1 (standing full), and how
   far it has turned to straw. Pure, and the GLSL below is the same arithmetic
   line for line — test 48 puts them side by side. */
function yearAt(ph,latN){
  const p=(ph+(latN<0?0.5:0))%1;
  const band=Math.min(1,Math.abs(latN));
  const sow=SOW0+band*SOW1, ripe=RIPE0+band*RIPE1, reap=ripe+REAP;
  let grow, gold;
  if(p<sow)       { grow=0;                          gold=0; }
  else if(p<ripe) { grow=smooth(sow,ripe,p);         gold=smooth(ripe-GOLD,ripe,p); }
  else if(p<reap) { grow=1;                          gold=1; }
  else            { grow=STUBBLE;                    gold=1; }
  /* and where there is no winter, the ground is never long empty */
  const warm=1-smooth(0.06,0.30,band);
  const ever=0.78+0.22*Math.sin(p*Math.PI*6);
  return { grow:grow+(ever-grow)*warm, gold:gold*(1-warm*0.75), sow, ripe, reap };
}

/* ---- THE SAME CURVE, IN GLSL ----
   It is built from the constants above so the two cannot be edited apart.
   `uSeasonY` is the turn of the year; the latitude is the vertex's own
   distance from the middle of the disc, which is how the leaves and the snow
   have always found theirs. */
function glsl(invR){
  const f=n=>n.toFixed(4);
  return (
  '{ float sr=length(position.xz)*'+invR+';\n'+
  '  float latN=1.0-sr*2.0;\n'+
  '  float p=fract(uSeasonY+(latN<0.0?0.5:0.0));\n'+
  '  float band=clamp(abs(latN),0.0,1.0);\n'+
  '  float sow='+f(SOW0)+'+band*'+f(SOW1)+';\n'+
  '  float ripe='+f(RIPE0)+'+band*'+f(RIPE1)+';\n'+
  '  float reap=ripe+'+f(REAP)+';\n'+
  '  float grow = (p<sow) ? 0.0\n'+
  '             : (p<ripe) ? smoothstep(sow,ripe,p)\n'+
  '             : (p<reap) ? 1.0 : '+f(STUBBLE)+';\n'+
  '  float gold = (p<ripe) ? smoothstep(ripe-'+f(GOLD)+',ripe,p) : 1.0;\n'+
  '  float warm=1.0-smoothstep(0.06,0.30,band);\n'+
  '  float ever=0.78+0.22*sin(p*'+f(Math.PI*6)+');\n'+
  '  vCrop=vec2(mix(grow,ever,warm), gold*(1.0-warm*0.75)); }');
}

window.CROP={
  load, forField, sownIn, yearAt, glsl,
  on:v=>{ if(v!==undefined) ON=!!v; return ON; },
  kinds:()=>KINDS,
  /* the constants, so the suite can put the GLSL beside the JavaScript */
  YEAR:{SOW0,SOW1,RIPE0,RIPE1,REAP,STUBBLE,GOLD},
  /* does this crop turn to straw, or is it green the day it is lifted? */
  turns:K=>!K||K.turns!==false,
};
})();
