/* ================= EVERY LAND ITS OWN — THE READER (Phase D) =================
   world/lands.js says what each land is called, makes, lacks, wears, keeps and
   says; world/workshops.js how its yards are laid out. This is the one place
   that reads them, so that the engine asks a question of a land — "a name for
   a woman of this land", "what does a jar of oil fetch here" — and never knows
   one land from another. Every answer is null where the land says nothing,
   and the engine then does what it always did.

   ---- THE PRICE OF A THING, BY WHERE IT IS MADE ----
   A market used to price a good by a throw of the dice, the same throw for
   ever: 0.6 to 1.6 of its base, with no reason in it. So the purple of Tsor was
   dearer in Tsor than in Norway and the cedar of Leḇanon cheaper in Baḇal than
   under the trees. It is reckoned now as a merchant would reckon it:
     - where a land MAKES a thing it is cheap: 0.60 to 0.74 of the base;
     - where a land WANTS a thing it is dear: 1.44 to 1.60;
     - anywhere else it costs what the road costs — 0.86 at the maker's door,
       rising with every league to the nearest land that makes it, to 1.36 at
       the far side of the world (a little either way, by the land's own
       throw, so no two markets are quite alike);
     - and a thing no land makes keeps the old throw.
   Every number stays inside the old band, so a market can never be priced
   outside what the trade was built to bear. The throw is the land's own, not
   the town's: every market of a land asks the same, day after day.
   ============================================================ */
(function(){
'use strict';
const E=window.EARTH||{};
let BY=null, TONGUE=null, SHOPS=null, AT=null;
function init(){ if(BY) return;
  BY=new Map(); TONGUE=new Map(); SHOPS=new Map(); AT=new Map();
  for(const t of E.tongueList||[]) for(const n of t.lands||[]) if(!TONGUE.has(n)) TONGUE.set(n,t);
  for(const l of E.landList||[]) BY.set(l.n,l);
  for(const w of E.workshopList||[]) SHOPS.set(w.k,w);
  for(const c of E.list||[]) if(c&&c.c) AT.set(c.n,c.c); }
const pick=(a,r)=>a[Math.min(a.length-1,Math.floor(r*a.length))];

/* the nearest land that makes `k`, in the measure of the circle of the earth
   (one is twenty thousand kilometres) — null where none does */
const NEAR=new Map();
function nearMaker(n,k){
  const key=n+'|'+k; if(NEAR.has(key)) return NEAR.get(key);
  let best=null; const c=AT.get(n);
  if(c) for(const [m,L] of BY){ if(m===n||!L.makes||L.makes.indexOf(k)<0) continue;
    const d=AT.get(m); if(!d) continue;
    const dd=Math.hypot(c[0]-d[0],c[1]-d[1]); if(best===null||dd<best) best=dd; }
  NEAR.set(key,best); return best; }

/* a workshop's parts turned to face the town: `rot` quarter-turns, +z first
   facing +z, then +x, −z, −x */
function turn(rot,x,z){ return rot===1?[z,-x]:rot===2?[-x,-z]:rot===3?[-z,x]:[x,z]; }
function turnBox(rot,p){ const a=turn(rot,p[0],p[2]), b=turn(rot,p[3],p[5]);
  const q=p.slice(); q[0]=Math.min(a[0],b[0]); q[3]=Math.max(a[0],b[0]); q[2]=Math.min(a[1],b[1]); q[5]=Math.max(a[1],b[1]);
  return q; }

window.LANDS={
  /* the land's own entry, or null */
  of(n){ init(); return BY.get(n)||null; },
  tongueOf(n){ init(); return TONGUE.get(n)||null; },
  /* what the account calls it — null for a land it never names */
  oldName(n){ const L=this.of(n); return L&&L.old&&L.old!==n?L.old:null; },
  /* the land as it is shown: "Mitsrayim (Egypt)", or the city with it, and
     never the city twice where the land is called after it */
  label(n,city,sep){ const o=this.oldName(n); sep=sep||' — ';
    if(!o) return (city?city+sep:'')+n;
    return (city&&o.indexOf(city)<0?city+sep:'')+o+' ('+n+')'; },
  /* a name for one of its people (r in 0..1), or null for the old fourteen */
  name(n,r,female){ const T=this.tongueOf(n); if(!T) return null;
    const a=female?T.f:T.m; return a&&a.length?pick(a,r):null; },
  /* the colours it wears, the beasts of its pens, the beast it rides —
     the land's own word first, then its people's */
  dress(n){ const L=this.of(n), T=this.tongueOf(n); return (L&&L.dress)||(T&&T.dress)||null; },
  flock(n){ const L=this.of(n), T=this.tongueOf(n); return (L&&L.flock)||(T&&T.flock)||null; },
  /* undefined: the land says nothing (the old choice stands); null: none is ridden */
  ride(n){ const L=this.of(n), T=this.tongueOf(n);
    if(L&&L.ride!==undefined) return L.ride; if(T&&T.ride!==undefined) return T.ride; return undefined; },
  /* the trades of its households */
  trades(n){ const L=this.of(n); return L&&L.men&&L.women?{men:L.men,women:L.women}:null; },
  /* a stranger hailed in passing: the stall-keeper with his cry, everyone
     else with the land's greeting (a trade with its own word keeps it) */
  greet(n,role,r){ const L=this.of(n), T=this.tongueOf(n);
    if(role==='vendor') return L&&L.cry?pick(L.cry,r):null;
    if(role!=='folk'&&role!=='shopper') return null;
    if(L&&L.greet) return pick(L.greet,r);
    return T&&T.hail?T.hail:null; },
  /* what is said when spoken to, line after line */
  talk(n,role){ const L=this.of(n); if(!L) return null;
    if(role==='vendor') return L.cry?L.cry.map(c=>'“'+c+'”'):null;
    return (role==='folk'||role==='shopper')&&L.talk?L.talk:null; },
  /* the goods its stalls lay out: what it makes */
  wares(n){ const L=this.of(n); return L&&L.makes&&L.makes.length?L.makes:null; },
  /* ---- the price of good `k` here, as a factor of its base; h is the land's own throw ---- */
  priceFactor(n,k,h){ init(); const L=BY.get(n);
    if(L&&L.makes&&L.makes.indexOf(k)>=0) return 0.60+0.14*h;
    if(L&&L.wants&&L.wants.indexOf(k)>=0) return 1.44+0.16*h;
    const d=nearMaker(n,k);
    if(d===null) return 0.6+h;
    return Math.min(1.36,Math.max(0.82,0.86+d*2.4+(h-0.5)*0.1)); },
  /* the workshops a town raises: those named for it, those the land raises in
     every town, and — in the land's chief town — those named for a town of
     the land that is not standing (the small map has one town to a land) */
  worksAt(n,here,chief,hasTown){ const L=this.of(n); if(!L||!L.works) return [];
    const out=[];
    for(const w of L.works){ const k=typeof w==='string'?w:w.k, town=typeof w==='string'?null:w.town;
      const W=SHOPS.get(k); if(!W) continue;
      if(!town||town===here||(chief&&!(hasTown&&hasTown(town)))) out.push(W); }
    return out; },
  workshop(k){ init(); return SHOPS.get(k)||null; },
  /* a workshop's parts, turned to face the town (still in blocks about its middle) */
  lay(W,rot){
    const T=p=>turnBox(rot,p);
    return { w:rot%2?W.d:W.w, d:rot%2?W.w:W.d,
      build:(W.build||[]).map(T), dress:(W.dress||[]).map(T),
      fire:(W.fire||[]).map(f=>{ const a=turn(rot,f[0],f[2]); return [a[0],f[1],a[1]]; }),
      hands:(W.hands||[]).map(h=>{ const a=turn(rot,h.at[0],h.at[1]), f=turn(rot,h.face[0],h.face[1]);
        return Object.assign({},h,{at:a,face:f,says:W.says||null}); }) }; }
};
})();
