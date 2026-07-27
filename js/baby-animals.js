/* ============================================================
   THE YOUNG OF EVERY BEAST — calf, cub, foal, kid, pup and joey
   ------------------------------------------------------------
   "He shall feed his flock like a shepherd: he shall gather the lambs with
    his arm, and carry them in his bosom, and shall gently lead those that
    are with young."

   THE FAULT THIS FILE MENDS. There was not one young beast anywhere in the
   world. Every zebra on the plain was a full-grown zebra; every wolf was a
   grown wolf; nothing was ever born, nothing followed anything, and nothing
   was ever smaller than its own kind's one fixed size. A world of adults is
   a world with no time in it.

   ---- WHAT A YOUNG BEAST IS ----
   It is the SAME MODEL as its mother, drawn small — and with the head left
   big. That last part is the whole trick: a scaled-down adult reads as a
   toy, but shrink the body and leave the head near full size and it reads,
   instantly and without being told, as a baby. It is why every young thing
   on the earth looks the way it does.

   ---- AND WHAT IT DOES ----
   It follows its mother. Not to a waypoint — to HER, at whatever pace she
   is going, falling behind on the turns and catching up in a hurry, and
   never further off than a young thing dares be. When she stops, it stops;
   when she puts her head down to feed, it works its way in under her and
   suckles; when she runs from something, it runs at her flank and does not
   leave it. A hunter that comes on a herd goes for it first, and the herd
   knows that, which is why she puts herself between.
   ============================================================ */
(function(){
'use strict';

const B=6;

/* ---- WHAT THE YOUNG OF EACH KIND IS CALLED, AND HOW MANY ----
   name   what it is called, so the log and the toasts can say it properly
   n      how many are born at once
   s      how big it is drawn, against its mother
   head   how much of her head size it keeps (1 = the whole of it — a fox cub
          really does have a head nearly as big as its mother's)
   fast   OPTIONAL true — it is up and running within the hour of being born
          and never leaves her side. Every beast of the open plain is this;
          it has to be, because there is nowhere to hide a calf on a plain.
   den    OPTIONAL true — it is born blind and helpless and stays at the den
          for weeks. Every hunter is this. */
const YOUNG={
  /* ---- the herds: born running ---- */
  zebra   :{name:'foal', n:1, s:0.55, head:0.85, fast:true},
  wildebeest:{name:'calf',n:1,s:0.5,  head:0.85, fast:true},
  gazelle :{name:'fawn', n:1, s:0.5,  head:0.9,  fast:true},
  oryx    :{name:'calf', n:1, s:0.52, head:0.85, fast:true},
  addax   :{name:'calf', n:1, s:0.52, head:0.85, fast:true},
  blackbuck:{name:'fawn',n:1, s:0.5,  head:0.9,  fast:true},
  buffalo :{name:'calf', n:1, s:0.5,  head:0.8,  fast:true},
  waterbuffalo:{name:'calf',n:1,s:0.5,head:0.8,  fast:true},
  giraffe :{name:'calf', n:1, s:0.58, head:0.8,  fast:true},
  elephant:{name:'calf', n:1, s:0.45, head:0.72, fast:true},
  mammoth :{name:'calf', n:1, s:0.42, head:0.72, fast:true},
  rhino   :{name:'calf', n:1, s:0.5,  head:0.8,  fast:true},
  hippo   :{name:'calf', n:1, s:0.48, head:0.8,  fast:true},
  camel   :{name:'calf', n:1, s:0.5,  head:0.85, fast:true},
  llama   :{name:'cria', n:1, s:0.55, head:0.9,  fast:true},
  alpaca  :{name:'cria', n:1, s:0.55, head:0.9,  fast:true},
  yak     :{name:'calf', n:1, s:0.5,  head:0.85, fast:true},
  bison   :{name:'calf', n:1, s:0.48, head:0.8,  fast:true},
  muskox  :{name:'calf', n:1, s:0.5,  head:0.85, fast:true},
  moose   :{name:'calf', n:1, s:0.48, head:0.85, fast:true},
  reindeer:{name:'calf', n:1, s:0.5,  head:0.88, fast:true},
  saiga   :{name:'calf', n:2, s:0.5,  head:0.9,  fast:true},
  pronghorn:{name:'fawn',n:2, s:0.5,  head:0.9,  fast:true},
  wildass :{name:'foal', n:1, s:0.55, head:0.88, fast:true},
  okapi   :{name:'calf', n:1, s:0.55, head:0.85, fast:true},
  tapir   :{name:'calf', n:1, s:0.5,  head:0.85, fast:true},
  warthog :{name:'piglet',n:3,s:0.4,  head:0.8,  fast:true},
  cow     :{name:'calf', n:1, s:0.52, head:0.85, fast:true},
  ox      :{name:'calf', n:1, s:0.5,  head:0.85, fast:true},
  horse   :{name:'foal', n:1, s:0.55, head:0.85, fast:true},
  donkey  :{name:'foal', n:1, s:0.55, head:0.88, fast:true},
  sheep   :{name:'lamb', n:2, s:0.5,  head:0.9,  fast:true},
  goat    :{name:'kid',  n:2, s:0.48, head:0.9,  fast:true},
  deer    :{name:'fawn', n:1, s:0.48, head:0.9,  fast:true},
  chamois :{name:'kid',  n:1, s:0.5,  head:0.9,  fast:true},
  pig     :{name:'piglet',n:4,s:0.4,  head:0.8,  fast:true},
  kangaroo:{name:'joey', n:1, s:0.42, head:0.85, fast:true},
  emu     :{name:'chick',n:3, s:0.4,  head:0.85, fast:true},
  ostrich :{name:'chick',n:4, s:0.35, head:0.85, fast:true},
  bustard :{name:'chick',n:2, s:0.4,  head:0.85, fast:true},
  ptarmigan:{name:'chick',n:4,s:0.4,  head:0.85, fast:true},
  cassowary:{name:'chick',n:2,s:0.4,  head:0.85, fast:true},
  peacock :{name:'chick',n:3, s:0.4,  head:0.85, fast:true},
  chicken :{name:'chick',n:4, s:0.4,  head:0.85, fast:true},
  /* ---- the hunters: born blind, and kept at the den ---- */
  lion    :{name:'cub',  n:2, s:0.4,  head:0.8,  den:true},
  tiger   :{name:'cub',  n:2, s:0.4,  head:0.8,  den:true},
  leopard :{name:'cub',  n:2, s:0.4,  head:0.8,  den:true},
  jaguar  :{name:'cub',  n:2, s:0.4,  head:0.8,  den:true},
  cheetah :{name:'cub',  n:3, s:0.42, head:0.85, den:true},
  cougar  :{name:'cub',  n:2, s:0.42, head:0.8,  den:true},
  lynx    :{name:'kitten',n:2,s:0.42, head:0.85, den:true},
  caracal :{name:'kitten',n:2,s:0.42, head:0.85, den:true},
  snowleopard:{name:'cub',n:2,s:0.42, head:0.8,  den:true},
  wolf    :{name:'pup',  n:3, s:0.4,  head:0.82, den:true},
  arcticwolf:{name:'pup',n:3, s:0.4,  head:0.82, den:true},
  fox     :{name:'cub',  n:3, s:0.38, head:0.85, den:true},
  arcticfox:{name:'cub', n:3, s:0.38, head:0.85, den:true},
  jackal  :{name:'pup',  n:3, s:0.4,  head:0.85, den:true},
  coyote  :{name:'pup',  n:3, s:0.4,  head:0.85, den:true},
  dingo   :{name:'pup',  n:3, s:0.4,  head:0.85, den:true},
  hyena   :{name:'cub',  n:2, s:0.42, head:0.82, den:true},
  dog     :{name:'pup',  n:3, s:0.4,  head:0.85, den:true},
  bear    :{name:'cub',  n:2, s:0.35, head:0.75, den:true},
  blackbear:{name:'cub', n:2, s:0.35, head:0.75, den:true},
  polarbear:{name:'cub', n:2, s:0.35, head:0.75, den:true},
  wolverine:{name:'kit', n:2, s:0.4,  head:0.85, den:true},
  ermine  :{name:'kit',  n:4, s:0.45, head:0.9,  den:true},
  badger  :{name:'cub',  n:2, s:0.45, head:0.85, den:true},
  otter   :{name:'pup',  n:2, s:0.45, head:0.88, den:true},
  beaver  :{name:'kit',  n:3, s:0.45, head:0.88, den:true},
  raccoon :{name:'kit',  n:3, s:0.42, head:0.88, den:true},
  skunk   :{name:'kit',  n:3, s:0.42, head:0.88, den:true},
  /* ---- and the rest ---- */
  hare    :{name:'leveret',n:3,s:0.4, head:0.88},
  arctichare:{name:'leveret',n:3,s:0.4,head:0.88},
  lemming :{name:'pup',  n:4, s:0.45, head:0.9},
  jerboa  :{name:'pup',  n:3, s:0.45, head:0.9},
  hedgehog:{name:'hoglet',n:3,s:0.45, head:0.88},
  meerkat :{name:'pup',  n:3, s:0.45, head:0.9},
  wombat  :{name:'joey', n:1, s:0.45, head:0.88},
  koala   :{name:'joey', n:1, s:0.45, head:0.88},
  sloth   :{name:'pup',  n:1, s:0.45, head:0.88},
  tasdevil:{name:'imp',  n:2, s:0.42, head:0.88},
  armadillo:{name:'pup', n:3, s:0.45, head:0.88},
  anteater:{name:'pup',  n:1, s:0.42, head:0.85},
  capybara:{name:'pup',  n:3, s:0.45, head:0.88, fast:true},
  platypus:{name:'puggle',n:2,s:0.45, head:0.9},
  boar    :{name:'piglet',n:4,s:0.4,  head:0.8,  fast:true},
  gorilla :{name:'infant',n:1,s:0.4,  head:0.8},
  chimpanzee:{name:'infant',n:1,s:0.4,head:0.8},
  orangutan:{name:'infant',n:1,s:0.4, head:0.8},
  baboon  :{name:'infant',n:1,s:0.42, head:0.85},
  macaque :{name:'infant',n:1,s:0.42, head:0.85},
  howler  :{name:'infant',n:1,s:0.42, head:0.85},
  lemur   :{name:'infant',n:1,s:0.42, head:0.88},
  panda   :{name:'cub',  n:1, s:0.35, head:0.78},
  redpanda:{name:'cub',  n:2, s:0.42, head:0.88},
  crocodile:{name:'hatchling',n:5,s:0.22,head:0.6},
  komodo  :{name:'hatchling',n:4,s:0.25,head:0.6},
  lizard  :{name:'hatchling',n:3,s:0.4, head:0.8},
  viper   :{name:'hatchling',n:4,s:0.35,head:0.7},
  penguin :{name:'chick',n:1, s:0.5,  head:0.9},
  wildcard:null,
};
function youngOf(kind){ return YOUNG[kind]||null; }

/* ---- BUILD A YOUNG ONE FROM ITS MOTHER'S OWN MODEL ----
   `make` is the engine's beast-builder. The model comes back scaled to the
   young's size — and then the HEAD is scaled back UP, so it keeps near the
   whole of its mother's, which is what makes it read as young at a glance.
   (A beast whose file names no `head` is simply drawn small; a hatchling
   crocodile is a small crocodile and that is correct.) */
function makeYoung(make,kind){
  const Y=youngOf(kind); if(!Y) return null;
  const g=make(kind); if(!g) return null;
  g.scale.setScalar(Y.s);
  const head=g.userData&&g.userData.head;
  if(head){ const k=Y.head/Y.s;      /* undo the shrink, to the share it keeps */
    head.scale.setScalar(Math.max(1,Math.min(2.2,k*0.55))); }
  g.userData.young=true;
  return g;
}

/* ---- AND WHAT IT DOES ----
   Called every frame for one young beast beside its mother.
     y   the young's own state {x,z,heading,ph,suck}
     m   its mother — {x,z,heading,job,fear}
   It keeps station off her flank, falls behind on a turn, hurries to catch
   up, and works its way in under her when she is standing still. */
const KEEP=7.5;                /* how far off her flank it walks, in units */
function tickYoung(y,mum,dt,t){
  y.ph=(y.ph===undefined)?Math.random()*6.283:y.ph;
  /* the place it wants to be: at her shoulder, on its own side of her */
  const side=(y.side===undefined)?(y.side=(Math.random()<0.5?1:-1)):y.side;
  const ch=Math.cos(mum.heading), sh=Math.sin(mum.heading);
  const fear=(mum.fear||0)>0;
  /* IT RUNS AT HER FLANK AND DOES NOT LEAVE IT. When she is frightened it
     tucks in tight — which is the whole reason a calf survives a plain. */
  const off=fear?KEEP*0.55:KEEP;
  const tx=mum.x - sh*side*off*0.55 - ch*off*0.5;
  const tz=mum.z - ch*side*off*0.55 + sh*off*0.5;
  const dx=tx-y.x, dz=tz-y.z, d=Math.hypot(dx,dz);
  /* it can outrun her over a few paces and cannot over many — so it falls
     behind on a turn and then hurries */
  const sp=fear?15:(d>26?13:d>10?9:4.5);
  let moving=false;
  if(d>1.6){ const k=Math.min(d, sp*dt);
    y.x+=dx/d*k; y.z+=dz/d*k; y.heading=Math.atan2(dx,dz); moving=true; }
  else y.heading=mum.heading;
  /* SUCKLING — she is standing still with her head down, so it gets in under
     her and butts. It is the one thing a young beast does that its mother
     visibly puts up with. */
  y.suck=(y.suck||0)-dt;
  const still=!moving && !fear && (mum.job==='feedhead'||mum.job==='bed'||mum.job==='roam');
  if(still && y.suck<=0 && Math.random()<0.4*dt){ y.suck=3+Math.random()*4; }
  return {moving, sp, sucking:y.suck>0 && still};
}

window.BABY={ YOUNG, youngOf, makeYoung, tickYoung, KEEP,
  /* is this kind's young kept at a den, or does it run with its mother? */
  atDen:kind=>{ const Y=YOUNG[kind]; return !!(Y&&Y.den); },
  runs:kind=>{ const Y=YOUNG[kind]; return !!(Y&&!Y.den); } };
})();
