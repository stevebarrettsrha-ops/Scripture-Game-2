/* ============================================================
   THE TWO GREAT LIGHTS — one file, and it is their whole law
   ------------------------------------------------------------
   "And God made two great lights; the greater light to rule the day, and
    the lesser light to rule the night... and God set them in the
    firmament of the heaven, and they divided the light from the darkness."

   THE FAULT THIS FILE MENDS. The sun and moon each ran a true circuit
   over the disc — but their HEIGHT was clamped: however far the sun
   travelled from the traveller, it was never let sink below a quarter of
   the sky. So the sun never SET. It hung high over the horizon, growing
   pale, and then simply faded out of the air like a lamp turned down —
   and a traveller in Peru could see, dim but high, the very sun that was
   at that hour lighting the middle of Africa. The moon did the same.

   THE LAW NOW, and the whole of it is in this file:

   THE CIRCUIT. Each light runs its own road over the face of the earth,
   never over the traveller's head by right — the SUN makes one turn of
   the disc a day, riding nearer the middle in the northern summer and
   nearer the rim in the northern winter (which is the seasons); the MOON
   runs the same road but falls behind the sun by a whole turn every
   29½ days (which is the month, and the phases). Wherever the traveller
   stands, the lights are where they truly are: when the sun stands over
   Africa it is day in Africa, and a traveller in Peru is in the dark.

   THE ARC. What the traveller SEES follows from where the light truly
   is. When its circuit brings it near him it stands high overhead; as it
   travels on toward other countries he watches it come down the sky,
   REACH THE HORIZON, and slip visibly under it — the sunset — at just
   the distance where its light gives out (dayF reaches zero at the same
   dUV where the altitude reaches zero, so the sky goes dusk-coloured
   exactly as the sun touches the earth's rim, as it ought).

   THE LIGHT. Day is full while the sun stands within SUN_NOON of the
   traveller (in UV — fractions of the world's radius), fails across the
   dusk band, and is gone when the sun is past SUN_SET — which is the
   same moment it dips below his horizon. Brightness of the disc itself
   holds full until it is under the horizon, then dies in the few
   degrees below, as a true sunset does.

   ---- HOW TO RETUNE THE HEAVENS ----
   Change a number here. That is all. The engine asks this file where
   each light stands, how high it rides, and how bright it burns; it
   invents nothing of its own.
   ============================================================ */
(function(){
'use strict';

/* ---- THE ROAD EACH LIGHT RIDES ---- */
const CIRCUIT_MID =0.5;    /* the road's middle distance from the world's centre (UV) */
const CIRCUIT_SWAY=0.13;   /* how far the seasons carry it in and out */
const YEAR_DAYS=364, MOON_DAYS=29.53;

/* ---- THE ARC OVER THE TRAVELLER'S SKY ---- */
const SUN_TOP =0.375;      /* how high (×R) the sun stands when dead overhead */
const MOON_TOP=0.3375;     /* the lesser light rides a little lower */
const HORIZON =0.66;       /* the UV distance at which a light touches the horizon —
                              the SAME distance at which its daylight gives out */
const SET_DEPTH=0.05;      /* how far (×R) below the horizon it sinks before it is gone */

/* ---- THE LIGHT OF DAY ---- */
const SUN_NOON=0.36;       /* full day within this UV distance of the sun */
/* dusk runs from SUN_NOON out to HORIZON, where night is complete */

function dayOfYear(h){ return Math.floor(h/24)%YEAR_DAYS+1; }

/* where the SUN stands over the disc at this hour (UV) */
function sunUV(h){
  const Dd=dayOfYear(h);
  const R2=CIRCUIT_MID-CIRCUIT_SWAY*Math.sin(2*Math.PI*(Dd-1)/YEAR_DAYS);
  const A=-(h/24)*2*Math.PI+Math.PI;
  return [R2*Math.sin(A), R2*Math.cos(A)];
}
/* where the MOON stands — the same road, a month behind */
function moonUV(h){
  const age=(h/24)%MOON_DAYS;
  const A=-(h/24)*2*Math.PI+Math.PI-2*Math.PI*age/MOON_DAYS;
  const R2=CIRCUIT_MID-CIRCUIT_SWAY*Math.sin(2*Math.PI*(dayOfYear(h)-16)/YEAR_DAYS);
  return [R2*Math.sin(A), R2*Math.cos(A)];
}

/* how high a light stands in the traveller's sky (×R), by how far its true
   place lies from him. Overhead at nought; the HORIZON at HORIZON; and past
   that it keeps going DOWN, which is the half of a sunset the old sky never
   had. The curve is eased so it hangs long near the zenith and comes down
   with gathering speed, the way the real one seems to. */
function altitude(dUV, top){
  const t=Math.min(1.8, dUV/HORIZON);
  return top*(1-Math.pow(t,1.35));
}
/* how bright the disc of a light burns: full all the way down to the
   horizon, dying in the little depth below it. y is height ×R. */
function discBright(y){
  return Math.max(0, Math.min(1, (y+SET_DEPTH)/SET_DEPTH));
}
/* the light of day upon a place: 1 under the sun, dusk across the band,
   0 when the sun is at (and past) that place's horizon */
function dayF(dUV){
  return Math.max(0, Math.min(1, (HORIZON-dUV)/(HORIZON-SUN_NOON)));
}

window.SUNMOON={
  SUN_TOP, MOON_TOP, HORIZON, SET_DEPTH, SUN_NOON,
  dayOfYear, sunUV, moonUV, altitude, discBright, dayF,
  /* the whole reckoning for one light, in one call: where it is, how high
     it stands in this traveller's sky, and how bright it burns */
  place(h,px,pz,R,which){
    const [u,v]=(which==='moon'?moonUV:sunUV)(h);
    const dUV=Math.hypot(px/R-u,pz/R-v);
    const y=altitude(dUV, which==='moon'?MOON_TOP:SUN_TOP);
    return {u,v,dUV, x:u*R, z:v*R, y:y*R, bright:discBright(y)};
  },
};
})();
