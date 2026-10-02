/* THE FULLNESS OF TIME — where each scene happened, in the voyage's world.

   Every scene is set down at its true place on the voyage's earth, by latitude and
   longitude: Natsareth in the hills of the Galil, Qanah over the valley north of it,
   Kephar Naḥum on the north shore of the lake, the Yardĕn below Yeriḥo, the city of the great
   king on her hill. The voyage's earth is drawn at its own scale (a degree is a thousand
   units, so the whole road from Bĕyth Leḥem to Yahrushalayim is some eighty), and a scene is
   built at the scale of a man, so a set is larger than the ground between two towns. Where a
   set cannot stand at its very place — Bĕyth Leḥem would stand inside the walls of
   Yahrushalayim — it is moved out along its true bearing until it is clear, and then to the
   most level ground near there that is dry land, not under another town, a landmark or a
   scroll of the voyage.

   `at(place, act)` → {x,z,y} in world units, the place's anchor, its ground's height; and for
   the city, `city:true` and the period she is raised in for that act. */
(function(){
'use strict';
const K=()=>window.__KIT;
/* the days each act is set in: the city of the kings (Solomon's Hĕḵal), or of Herodes */
const PERIOD={prologue:'kings', bridge:'kings', coming:'herodes', forerunner:'herodes', galil:'herodes', 'road-up':'herodes'};
const PLACES={
  yahrushalayim:{city:true},
  natsareth:  {lat:32.702, lon:35.297, flat:30, why:'Natsareth, in the hills of the lower Galil'},
  qanah:      {lat:32.746, lon:35.342, flat:34, why:'Qanah of Galil (Kafr Kanna), over the valley'},
  galil:      {lat:32.881, lon:35.575, flat:30, why:'Kephar Naḥum, on the north shore of the lake'},
  galilEast:  {lat:32.836, lon:35.650, flat:30, why:'the east shore, below the grassy slopes (Bĕyth Tsaiḏa)'},
  galilSea:   {lat:32.830, lon:35.585, flat:30, why:'out on the lake, between the shores'},
  road:       {lat:32.20,  lon:35.28,  flat:30, why:'the hill road through Shomeron'},
  beythlehem: {lat:31.705, lon:35.200, flat:36, clear:820, why:'Bĕyth Leḥem, south of the city'},
  fields:     {lat:31.700, lon:35.215, flat:34, clear:900, why:'the pasture below Bĕyth Leḥem'},
  yarden:     {lat:31.837, lon:35.550, flat:46, why:'Bĕyth Anyah beyond the Yardĕn, below Yeriḥo'},
  wilderness: {lat:31.70,  lon:35.40,  flat:12, clear:820, why:'the wilderness of Yahuḏah, falling to the rift'},
  hillcountry:{lat:31.768, lon:35.162, flat:30, clear:820, why:'Ayin Kerem in the hill country of Yahuḏah, west of the city'},
  shekem:     {lat:32.213, lon:35.285, flat:34, why:'Ya‛aqoḇ’s fountain at Sheḵem, between Gerizim and Ebal'},
  bethanyah:  {lat:31.771, lon:35.262, flat:28, clear:820, why:'Bĕyth Anyah, beyond the Mount of Olives from the city'},
  /* the road south (Act V) */
  caesarea:   {lat:33.248, lon:35.694, flat:30, why:'Caesarea Philippi, at the springs of the Yardĕn below Ḥermon'},
  ginae:      {lat:32.461, lon:35.302, flat:32, why:'Ayin Gannim, the last village of Shomeron on the road from Galil'},
  yeriho:     {lat:31.857, lon:35.444, flat:36, why:'Yahriḥo, the city of palm trees, below the ascent to Yahrushalayim'},
  olives:     {lat:31.778, lon:35.245, flat:24, clear:1000, why:'the descent of the Mount of Olives, over against the city'},
  /* the seven hundred years: the empires, each at its own seat */
  tiber:      {lat:41.89, lon:12.49, flat:20, why:'by the Tiber, where Rome begins'},
  nineveh:    {lat:36.36, lon:43.15, flat:36, why:'Ninewĕh on the Ḥiddeqel, seat of Ashshur'},
  babel:      {lat:32.54, lon:44.42, flat:40, why:'Baḇal on the Euphrates'},
  pella:      {lat:40.76, lon:22.52, flat:26, why:'Pella of Macedon, the city of Alexander'},
  mountain:   {lat:33.42,  lon:35.86,  flat:6, high:true, why:'"a very high mountain" — the heights of Ḥermon'}
};
const cache={};
function dist(a,b){ return Math.hypot(a.x-b.x,a.z-b.z); }
/* what the world already has standing, which a set must not be laid over */
function standing(){
  const k=K(), out=[], E=window.EARTH||{};
  for(const L of (E.landmarkList||[])) if(isFinite(L.lat)){ const p=k.llToWorld(L.lat,L.lon); out.push({x:p[0],z:p[1],r:300}); }
  for(const L of (E.waterfallList||[])) if(isFinite(L.lat)){ const p=k.llToWorld(L.lat,L.lon); out.push({x:p[0],z:p[1],r:260}); }
  for(const L of (E.placeList||[])) if(isFinite(L.lat)){ const p=k.llToWorld(L.lat,L.lon); out.push({x:p[0],z:p[1],r:260}); }
  for(const L of (E.scrollList||[])) if(isFinite(L.lat)){ const p=k.llToWorld(L.lat,L.lon); out.push({x:p[0],z:p[1],r:200}); }
  /* a village of the voyage spreads its folk, lamps and fields some 300 units about its site,
     and a city's walls 760: a scene is kept well clear of either */
  for(const s of (k.sites()||[])) if(s&&isFinite(s.x)) out.push({x:s.x,z:s.z,r:1100});
  const yp=k.yahruPos(); if(yp) out.push({x:yp.x,z:yp.z,r:760});
  return out;
}
/* how uneven the ground is over a set of `flat` metres about a point (blocks, high − low),
   or null where any of it is water */
function rough(x,z,flat){
  const k=K(), B=k.B, R=Math.max(3,flat)*k.setScale; let lo=1e9, hi=-1e9;
  for(let a=0;a<16;a++) for(const f of [0,0.5,1]){ const t=a/16*Math.PI*2, px=x+Math.cos(t)*R*f, pz=z+Math.sin(t)*R*f;
    const c=k.cell(Math.floor(px/B),Math.floor(pz/B)); if(!c||c.kind==='wall') return null;
    if(c.h*B<=k.WATER_Y+B) return null;
    lo=Math.min(lo,c.h); hi=Math.max(hi,c.h); }
  return {r:hi-lo, h:hi};
}
function find(def){
  const k=K(), p=k.llToWorld(def.lat,def.lon); let P={x:p[0],z:p[1]};
  /* out from under the city along its true bearing, when it would stand in her */
  const yp=k.yahruPos();
  if(yp&&def.clear){ const d=dist(P,yp); if(d<def.clear){ const ux=(P.x-yp.x)/(d||1), uz=(P.z-yp.z)/(d||1); P={x:yp.x+ux*def.clear,z:yp.z+uz*def.clear}; } }
  const busy=standing();
  let best=null, bs=1e18;
  for(let ring=0;ring<=32;ring++){ const n=Math.max(1,ring*8);
    for(let a=0;a<n;a++){ const t=a/n*Math.PI*2, d=ring*45, x=P.x+Math.cos(t)*d, z=P.z+Math.sin(t)*d;
      if(busy.some(b=>Math.hypot(x-b.x,z-b.z)<b.r)) continue;
      const g=rough(x,z,def.flat); if(!g) continue;
      const score=def.high?-g.h*40+d*0.05:g.r*30+d*0.02;
      if(score<bs){ bs=score; best={x,z}; } } }
  if(!best) best=P;
  const B=k.B, ix=Math.floor(best.x/B), iz=Math.floor(best.z/B);
  return {x:(ix+0.5)*B, z:(iz+0.5)*B, y:k.topY(ix,iz)};
}
window.STORYPLACES={
  list:PLACES,
  at(place,act){
    const def=PLACES[place]; if(!def) throw new Error('no such place in the world: '+place);
    const period=PERIOD[act&&act.id]||'herodes';
    if(def.city){ const k=K(), yp=k.yahruPos(); return {x:yp.x,z:yp.z,y:k.topY(yp.ix,yp.iz),city:true,period}; }
    if(!cache[place]) cache[place]=find(def);
    return Object.assign({period},cache[place]);
  }
};
})();
