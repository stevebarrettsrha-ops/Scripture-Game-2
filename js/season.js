/* ============================================================
   THE FOUR SEASONS OF THE YEAR — and the zones that keep them
   ------------------------------------------------------------
   "While the earth remaineth, seedtime and harvest, and cold and heat, and
    summer and winter, and day and night shall not cease."  (Genesis 8:22)

   THE LAW OF THE SEASONS, kept in one place as the beasts' work and the flora
   are kept, so the world and its creatures may take the turn of the year.

   ---- WHAT A SEASON IS, AND WHERE ----
   The earth in this world is a disc: the NORTH POLE stands at its centre and
   the SOUTH POLE at its rim, so a place is known by how far it lies from the
   middle. From that one number — call it latN, +1 at the centre (the far
   north), 0 at the ring of the Equator, -1 at the rim (the far south) — comes
   both its ZONE and its SEASON.

   THE THREE ZONES, and how each keeps the year:
     TROPICAL   |latN| < 0.26  (within the Tropics, ~23.5° of the Line)
                No cold and heat, but WET and DRY. It is warm and green the
                year round; the leaves do not turn and the snow never falls
                (save on the highest peaks). The day is near twelve hours
                always. Its year is the monsoon: a wet half and a dry half.
     TEMPERATE  0.26 .. 0.74   (to ~66.5°, the Polar Circles)
                The full four seasons, and the plainest of them: spring warms
                and the flowers break; summer is hot and the day long; autumn
                cools and the leaves gild and fall; winter is cold, the day
                short and the night long, and the SNOW LIES.
     POLAR      |latN| > 0.74   (within the Polar Circles)
                The year at its most extreme: the midnight sun of summer, when
                there is no true night to hunt by, and the long dark of winter.
                Snow and ice the most of the year, and a brief furious summer
                thaw when everything that grows does so at once.

   And because the disc carries both poles, the two halves of the earth keep
   OPPOSITE seasons: when it is winter in the north it is summer in the south.
   Everything below reckons the NORTHERN season from the day of the year, and
   flips it for anywhere south of the Line.

   ---- THE PLAYER'S HAND ON THE YEAR ----
   The year turns of itself (from the day of the voyage), but the traveller may
   set it where he likes — spring, summer, autumn, winter, or back to its own
   natural course — and the whole world answers: the leaves, the snow, and the
   ways of the beasts. See SEASON.cycle / setSeason / clear.
   ============================================================ */
(function(){
'use strict';

/* the four, in their order round the year (spring first, as the year wakes) */
const NAMES=['Spring','Summer','Autumn','Winter'];
/* where each season sits in the year, as a phase 0..1 (0 = the turn of the
   year, deep winter). These centres are what the shader gilding and the snow
   are cut to, so the LABEL and the LOOK always agree. */
const CENTRE=[0.25, 0.50, 0.72, 0.96];   /* spring, summer, autumn, winter */

/* ---- WHAT EACH SEASON DOES, by its nature ----
   warmth  — how warm it runs, -1 (deep cold) .. +1 (high heat)
   day     — the length of daylight against the mean, -1 (short) .. +1 (long)
   foliage — what the temperate leaf does: 'fresh','full','gold','bare'
   bloom   — how the flowers stand, 0 (none) .. 1 (the meadow in flower)
   snow    — the snow that lies in the TEMPERATE zone, 0 .. 1 (the poles keep
             their own snow the year round; the tropics never take it)
   breed   — how the herds bear their young, against the mean (spring is the
             time of the young) */
const SEASONS={
  Spring: {warmth:0.2,  day:0.2,  foliage:'fresh', bloom:1.0, snow:0.05, breed:1.8, tint:'#8fd06a'},
  Summer: {warmth:1.0,  day:1.0,  foliage:'full',  bloom:0.5, snow:0.0,  breed:1.0, tint:'#4fae3c'},
  Autumn: {warmth:-0.1, day:-0.2, foliage:'gold',  bloom:0.15,snow:0.1,  breed:0.5, tint:'#d69836'},
  Winter: {warmth:-1.0, day:-1.0, foliage:'bare',  bloom:0.0, snow:1.0,  breed:0.2, tint:'#bcd2e8'},
};

/* the tropical year is not cold-and-heat but WET-and-DRY: the wet half falls
   in the local warm half of the year, the dry in the cool half. */
const TROPIC={ Wet:{tint:'#3fa05a', bloom:0.6}, Dry:{tint:'#b7a24a', bloom:0.1} };

const TROPIC_BAND=0.26, POLAR_BAND=0.74;

/* ---- THE BEASTS THAT SLEEP THE WINTER THROUGH ----
   Not every cold-country beast, but the true hibernators: they den up when the
   snow lies and are not seen again until the thaw. (The bear's is not a true
   hibernation but it keeps to the den, which is all the world sees.) */
const HIBERNATE=new Set(['bear','blackbear','hedgehog','badger','marmot','wombat']);

let _override=null;   /* null = the natural year; else 0..3 into NAMES */

/* the effective year-phase 0..1: the override if the traveller has set one,
   else straight from the day of the voyage (day 1 of 364 is the turn of the
   year, deep in the northern winter). */
function yearPhase(doy){
  if(_override!=null) return CENTRE[_override];
  return (((doy||1)-1)/364);
}
/* which of the four the given phase is, for the NORTHERN half of the earth */
function indexOfPhase(ph){ ph=((ph%1)+1)%1;
  if(ph>=0.85||ph<0.15) return 3;   /* Winter, about the turn of the year */
  if(ph<0.40) return 0;             /* Spring */
  if(ph<0.61) return 1;             /* Summer */
  return 2;                          /* Autumn */
}
/* the zone at a normalised latitude */
function zoneOf(latN){ const a=Math.abs(latN);
  return a<TROPIC_BAND?'tropical':a<POLAR_BAND?'temperate':'polar'; }

/* the SEASON at a place (its normalised latitude) on a given day — the season
   flipped for the southern half, and named wet/dry in the tropics. Returns
   {name, zone, S} where S is the SEASONS (or TROPIC) descriptor. */
function seasonAt(latN, doy){
  const zone=zoneOf(latN);
  let ph=yearPhase(doy);
  if(latN<0) ph=(ph+0.5)%1;                 /* the south is half a year on */
  if(zone==='tropical'){
    /* warm half of the local year = wet; cool half = dry */
    const north=indexOfPhase(ph);            /* 0 spring..3 winter (local) */
    const wet=(north===0||north===1);        /* spring & summer → the rains */
    const name=wet?'Wet':'Dry';
    return {name, zone, S:TROPIC[name]};
  }
  const i=indexOfPhase(ph);
  return {name:NAMES[i], zone, S:SEASONS[NAMES[i]]};
}

/* ---- what the traveller sees written, for his own place ---- */
function label(latN, doy){ const s=seasonAt(latN,doy);
  const nat=_override==null?'':' (set)';
  return s.name+nat; }

/* ---- the beasts and the year ---- */
/* true if this kind sleeps the winter through, and it is winter where it
   stands (temperate or polar only — nothing hibernates on the Line) */
function dormant(kind, latN, doy){
  if(!HIBERNATE.has(kind)) return false;
  const s=seasonAt(latN,doy);
  return s.name==='Winter';
}
/* how freely the herds bear young here and now, against the mean — spring is
   the time of birth, winter the barren time */
function breedFactor(latN, doy){
  const s=seasonAt(latN,doy);
  return (s.S&&s.S.breed!==undefined)?s.S.breed:1.0;
}
/* how thick the flowers stand here and now, 0 (none) .. 1 (the meadow in full
   bloom) — spring is the flush, the tropics flower in the wet, winter is bare */
function bloomFactor(latN, doy){
  const s=seasonAt(latN,doy);
  return (s.S&&s.S.bloom!==undefined)?s.S.bloom:0;
}

window.SEASON={
  NAMES, SEASONS, CENTRE, HIBERNATE,
  TROPIC_BAND, POLAR_BAND,
  yearPhase, indexOfPhase, zoneOf, seasonAt, label, dormant, breedFactor, bloomFactor,
  /* is the year on its natural course, or held by the traveller? */
  isNatural:()=>_override==null,
  overrideName:()=>_override==null?'Natural':NAMES[_override],
  /* the traveller's hand: set a season, clear back to the natural year, or
     step round the ring (Spring→Summer→Autumn→Winter→Natural→Spring…) */
  setSeason:s=>{ if(typeof s==='string'){ const i=NAMES.indexOf(s); _override=i<0?null:i; }
    else _override=(s==null)?null:(((s%4)+4)%4); },
  clear:()=>{ _override=null; },
  cycle:()=>{ _override=(_override==null)?0:(_override>=3?null:_override+1);
    return _override==null?'Natural':NAMES[_override]; },
};
})();
