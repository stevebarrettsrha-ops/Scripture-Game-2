/* THE FULLNESS OF TIME — where each scene happened, in the voyage's world.

   Every scene is set down at its true place on the voyage's earth, by latitude and
   longitude: Natsareth in the hills of the Galil, Qanah over the valley north of it,
   Kephar Naḥum on the north shore of the lake, the Yardĕn below Yeriḥo, the city of the great
   king on her hill. At the true measure of the earth (Phase T) the map is drawn at the scale
   of a man, as the sets are: Bĕyth Leḥem stands nine kilometres from the city, as it does, and
   every set stands at its very place, on the most level dry ground near it. On the old small map
   (a degree a thousand units, the road from Bĕyth Leḥem to Yahrushalayim some eighty) a set was
   larger than the ground between two towns, so a set that would stand inside the walls of
   Yahrushalayim is moved out along its true bearing until it is clear (`clear`), which at the
   true measure never happens; and either way it keeps off another town, a landmark or a scroll
   of the voyage.

   `at(place, act)` → {x,z,y} in world units, the place's anchor, its ground's height; and for
   the city, `city:true` and the period she is raised in for that act. */
(function(){
'use strict';
const K=()=>window.__KIT;
/* the days each act is set in: the city of the kings (Solomon's Hĕḵal), or of Herodes */
const PERIOD={prologue:'kings', bridge:'kings', coming:'herodes', forerunner:'herodes', galil:'herodes', 'road-up':'herodes', passion:'herodes', risen:'herodes', 'ends-of-earth':'herodes'};
const PLACES={
  yahrushalayim:{city:true},
  natsareth:  {lat:32.702, lon:35.297, flat:30, why:'Natsareth, in the hills of the lower Galil'},
  qanah:      {lat:32.746, lon:35.342, flat:34, why:'Qanah of Galil (Kafr Kanna), over the valley'},
  galil:      {lat:32.88037, lon:35.57552, flat:30, shore:true, why:'Kephar Naḥum, on the north shore of the lake'},
  galilEast:  {lat:32.83682, lon:35.64603, flat:30, shore:true, turn:true, why:'the east shore, below the grassy slopes (Bĕyth Tsaiḏa)'},
  galilSea:   {lat:32.830, lon:35.585, flat:30, shore:true, why:'out on the lake, between the shores'},
  gadarenes:  {lat:32.82414, lon:35.64767, flat:30, shore:true, turn:true, why:'the country of the Gaḏarenes, the steep east shore of the lake (Mark 5:1)'},
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
  ginae:      {lat:32.461, lon:35.302, flat:56, why:'Ayin Gannim, the last village of Shomeron on the road from Galil'},
  yeriho:     {lat:31.857, lon:35.444, flat:64, why:'Yahriḥo, the city of palm trees, below the ascent to Yahrushalayim'},
  olivet:     {city:true, trueAt:[355,-97], why:'the descent of the Mount of Olives, across the Qidron from her walls'},
  /* Passion Week (Act VI): each on the city's own ground */
  courts:     {city:true, why:'the courts of the House, on its platform'},
  upperroom:  {city:true, trueAt:[-622,692], why:'a house of two storeys in the upper city, on the south-western hill'},
  highpriest: {city:true, trueAt:[-429,692], why:'the courtyard of the kohen gadol, on the eastern slope of the western hill'},
  praetorium: {city:true, why:'the Pavement, before the fortress at the corner of the courts'},
  prison:     {city:true, why:'the fortress at the corner of the courts, where Kĕpha was kept (Acts 12:4)'},
  golgotha:   {city:true, trueAt:[-484,-13], why:'outside the second wall, by the Gennath gate: the knoll and the garden'},
  /* The Rising (Act VII) */
  emmaus:     {lat:31.840, lon:35.130, flat:34, clear:820, why:'Amma’us, twelve kilometres from Yahrushalayim (Luke 24:13), in the hills to the west'},
  tiberias:   {lat:32.87291, lon:35.54847, flat:30, shore:true, why:'the shore of the Sea of Kinnereth below the hills, west of Kephar Naḥum (Yahuchanon 21:1)'},
  /* To the End of the Earth (Act VIII) */
  gazaroad:   {lat:31.58,  lon:34.92,  flat:46, why:'the way down from Yahrushalayim to Azzah, "this is desert" (Acts 8:26)'},
  damascus:   {lat:33.51,  lon:36.29,  flat:60, why:'Damascus, the road in from the south-west and the street called Straight (Acts 9:11)'},
  /* (the coast's set lays its sea toward its +x, and the Great Sea lies west-north-west of both: `turn`ed, its
     +x looks out over the true sea, which a set laid unturned had put inland, toward the hills; and over the town
     of the voyage on that shore, which its pool is kept short of: story/settings.js, coast) */
  yapho:      {lat:32.054, lon:34.752, flat:34, turn:true, why:'Yapho by the sea, the house of Shim‛on the tanner (Acts 10:6)'},
  caesareaM:  {lat:32.50,  lon:34.892, flat:34, turn:true, why:'Caesarea by the sea, the house of the captain Cornelius (Acts 10:24)'},
  antioch:    {lat:36.20,  lon:36.16,  flat:46, why:'Antioch on the Orontes, where they were first called Natsarim (Acts 11:26)'},
  lystra:     {lat:37.578,  lon:32.453, flat:46, why:'Lustra in Lukaonia, the house of Zeus before its gate (Acts 14:13)'},
  philippi:   {lat:41.013,  lon:24.287, flat:60, why:'Philippi of Makedonia, a colony, its river outside the gate (Acts 16:12-13)'},
  ephesos:    {lat:37.941,  lon:27.342, flat:62, why:'Ephesos, the great theatre under Mount Pion (Acts 19:29)'},
  athens:     {lat:37.972, lon:23.722, flat:40, why:'Athens, the hill of Ares below the Acropolis (Acts 17:22)'},
  malta:      {lat:35.95,  lon:14.42,  flat:30, why:'Melite, the bay where the ship ran aground (Acts 27:39, 28:1)'},
  rome:       {lat:41.89,  lon:12.485, flat:50, why:'Rome, by the Tiber under the Palatine (Acts 28:16)'},
  /* the seven hundred years: the empires, each at its own seat */
  tiber:      {lat:41.89, lon:12.49, flat:20, why:'by the Tiber, where Rome begins'},
  nineveh:    {lat:36.36, lon:43.15, flat:36, wonder:'The Gates of Ninewĕh', why:'Ninewĕh on the Ḥiddeqel, seat of Ashshur'},
  babel:      {lat:32.54, lon:44.42, flat:40, wonder:'Baḇal (Baḇylon) — Etemenanki', why:'Baḇal on the Euphrates'},
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
/* A SET ON THE SHORE OF KINNERETH (`shore`) stands at its very place — the place was chosen so its
   water lies over the lake's and its town over the land (and `turn`ed where the lake is on its other
   side) — and at the height of the lake's own face, so its beach and boats are at the water and the
   water it lays is the lake's. (The finder below would not do: the whole rift lies under the level of
   the sea, which it takes for water, and a set out on the lake was laid on its bed, forty metres
   under the water.) */
function findShore(def){
  const k=K(), B=k.B, p=k.llToWorld(def.lat,def.lon), ix=Math.floor(p[0]/B), iz=Math.floor(p[1]/B);
  let lake=null;
  for(let r=0;r<=80&&lake===null;r+=2) for(let a=0;a<Math.max(1,r*4)&&lake===null;a++){ const t=a/Math.max(1,r*4)*Math.PI*2;
    const c=k.cell(ix+Math.round(Math.cos(t)*r),iz+Math.round(Math.sin(t)*r)); if(c&&c.lake!==undefined&&c.lake>c.h) lake=c.lake; }
  return {x:(ix+0.5)*B, z:(iz+0.5)*B, y:lake!==null?lake*B:k.topY(ix,iz)};
}
function find(def){
  if(def.shore&&K().trueEarth&&K().trueEarth()) return findShore(def);
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
  /* ---- AND WHERE THE EARTH HAS ONLY SEA ----
     The soundings lose a small island (Melite, sampled every sixteen kilometres, is all sea), and the set
     was quietly anchored in open water at the sea's own face: its ground and its hills were laid nowhere,
     and its beach was awash. Such a place is said to be at sea (`sea`), and its set is built up out of the
     sea from the bed (the kit's overSea), its level one course above the water so its beach stands dry. */
  /* (said once: a place is found once, and kept) */
  if(!k.cell(ix,iz)){ console.warn('STORYPLACES: no dry ground near '+def.lat+','+def.lon+' ('+def.why+'): its set is raised out of the sea');
    return {x:(ix+0.5)*B, z:(iz+0.5)*B, y:(Math.floor(k.WATER_Y/B)+1)*B, sea:true}; }
  return {x:(ix+0.5)*B, z:(iz+0.5)*B, y:k.topY(ix,iz)};
}
window.STORYPLACES={
  list:PLACES,
  at(place,act){
    const def=PLACES[place]; if(!def) throw new Error('no such place in the world: '+place);
    const period=PERIOD[act&&act.id]||'herodes';
    if(def.city){ const k=K(), yp=k.yahruPos();
      /* AT THE TRUE MEASURE the city stands at her true size (world/yahrushalayim-true.js), and a
         set of her that stands by itself — Golgotha and its garden, the upper room, the court of the
         kohen gadol, the garden over the Qidron — is laid at its own true place: the set as it was
         drawn, moved by `trueAt` metres from her anchor, and the city's marks moved back by the same
         so they still name her own places */
      if(def.trueAt&&k.trueEarth&&k.trueEarth()){ const S=k.setScale, x=yp.x+def.trueAt[0]*S, z=yp.z+def.trueAt[1]*S;
        const ix=Math.floor(x/k.B), iz=Math.floor(z/k.B);
        const y=k.topY(ix,iz);
        return {x,z,y,city:true,period,markOff:def.trueAt,yShift:(k.topY(yp.ix,yp.iz)-y)/S}; }
      return {x:yp.x,z:yp.z,y:k.topY(yp.ix,yp.iz),city:true,period}; }
    /* AT A WORK OF THE ANCIENTS (`wonder`: its name in world/landmarks.js) the scene is played at the work's own
       site on the true earth, not at the flattest ground near it: the gate of Ninewĕh, the tower of Baḇal */
    if(def.wonder&&!cache[place]){ const k=K(); if(k.trueEarth&&k.trueEarth()&&k.landmarks){
      const L=k.landmarks().find(q=>q.n===def.wonder), st=L&&k.landmarkSiteOf(L.i);
      if(st) cache[place]={x:st.x,z:st.z,y:k.topY(st.ix,st.iz)}; } }
    if(!cache[place]) cache[place]=find(def);
    /* (`turn`: the set laid half round, its east to the west — see story/engine.js, SX) */
    return Object.assign({period,turn:!!(def.turn&&K().trueEarth&&K().trueEarth())},cache[place]);
  }
};
})();
