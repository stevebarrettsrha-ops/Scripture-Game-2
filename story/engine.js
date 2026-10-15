/* THE FULLNESS OF TIME — the story engine.

   The Besorah is the director of this game. Nothing a named figure says is
   written here or in any act: an act cites a passage by reference, and the
   words are the Besorah's own, from story/scripture.js, which only
   tools/extract-besorah.js --story writes (and --check holds to the letter).

   THE WITNESS PRINCIPLE (the design document's own rule):
     · the player observes and takes part — carries, gathers, holds a lamp —
       but never changes what happens, and never puts words in a named mouth;
     · named figures say what the text says, and nothing else;
     · the player's own lines are reactions and questions, marked as his.
   Historical notes (dates, empires) are shown as NOTES, never as scripture.

   An act is data: scenes of beats, run in order by this engine. */
(function(){
'use strict';
const ST=window.STORY=window.STORY||{};
ST.acts=[]; ST.text={}; ST.codexDefs=[];
ST.act=a=>{ ST.acts.push(a); };
ST.scripture=t=>{ Object.assign(ST.text,t); };
ST.codex=d=>{ ST.codexDefs.push(...d); };

/* ================= SAVE — the scroll, the acts, the road walked ================= */
const SAVE_KEY='fullness:v1';
const save={codex:{},acts:{},witnessed:0};
function loadSave(){ try{ const s=localStorage.getItem(SAVE_KEY); if(s) Object.assign(save,JSON.parse(s)); }catch(e){} }
function persist(){ try{ localStorage.setItem(SAVE_KEY,JSON.stringify(save)); }catch(e){} }
ST.save=save;

/* ================= DOM ================= */
const $=id=>document.getElementById(id);
const esc=s=>String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
function textOf(ref){ const e=ST.text[ref]; return e?e.t:null; }

/* ================= THE WORLD IT IS PLAYED IN =================
   The voyage's world, raised by the page before this runs (story/shell.js): its renderer,
   its scene, its sky, sea, sun and blocks, reached through its story kit. A scene's root is
   set at the scene's place in that world and scaled by S, so everything below speaks in
   metres about the place; the story keeps a camera of its own in those metres, and the
   voyage's camera is set from it every frame. */
const K=()=>window.__KIT;
let renderer, scene, camera, ctx=null, root=null, anchor=null, S=6.5;
/* THE SCENE TURNED ABOUT: a place may be `turn`ed half round on the earth (story/places.js), so a set
   written with its lake to the east stands with it to the west, as the east shore of Kinnereth has
   it. Then x and z go out from the anchor the other way: SX is the scale across the ground, S's own
   sign or the other, and the scene's root is turned with it. */
let SX=6.5;
const Q_HALF=new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0,1,0),Math.PI);
const clock=new THREE.Clock();
function initGL(){
  renderer=K().renderer; S=K().setScale;
  camera=new THREE.PerspectiveCamera(55,1,0.05,4000);
  resize(); window.addEventListener('resize',resize);
}
function resize(){ const vc=K().camera; camera.aspect=vc.aspect||window.innerWidth/window.innerHeight; camera.updateProjectionMatrix(); }
/* the voyage's eye, put where the story's is: the same look, scaled out to the world */
function writeCamera(){
  if(!root) return;
  const vc=K().camera;
  vc.position.set(anchor.x+camera.position.x*SX, anchor.y+camera.position.y*S, anchor.z+camera.position.z*SX);
  vc.quaternion.copy(camera.quaternion); if(SX<0) vc.quaternion.premultiply(Q_HALF);
  if(vc.fov!==camera.fov){ vc.fov=camera.fov; vc.updateProjectionMatrix(); }
  if(camera.aspect!==vc.aspect){ camera.aspect=vc.aspect; camera.updateProjectionMatrix(); }
  vc.updateMatrixWorld();
  /* (and the sun's map of shadows is laid about what the shot looks at, not a fixed step ahead of the eye:
     a wide shot of a camp or a crowd far off had them outside it) */
  const L=lookAtNow(); if(L&&K().shadowFocus) K().shadowFocus(anchor.x+L[0]*SX, anchor.y+L[1]*S, anchor.z+L[2]*SX);
}
/* the ground under a point of the scene, in its metres; `ref` the height the asker stands
   at (so a floor under a roof is found, and not the roof) */
/* WATER IS NOT GROUND: where the floor found is the face of a pool, a river or a lake, a man goes
   down through it to its bed — and in water deeper than his chest he is held at his chest, his head
   and shoulders above it, wading or swimming, never standing on it */
function groundAt(x,z,ref){
  const y=groundAt0(x,z,ref), k=K();
  if(!k.waterAt||!anchor) return y;
  const B=k.B, wx=anchor.x+x*SX, wz=anchor.z+z*SX, wy=anchor.y+y*S;
  /* (nor is the Great Sea, which is no blocks: off a beach raised out of it the bed falls away forty metres,
     and an eye set some metres "over the ground" there was set on the bottom of the bay) */
  if(wy<k.WATER_Y&&k.cell&&!k.cell(Math.floor(wx/B),Math.floor(wz/B))) return Math.max(y,(k.WATER_Y-anchor.y)/S-1.25);
  if(!k.waterAt(wx,wy-0.5*B,wz)) return y;
  let b=wy-0.5*B, n=0; while(n<12&&k.waterAt(wx,b,wz)){ b-=B; n++; }
  const bed=(Math.floor(b/B)+1)*B;                                            /* the top of the first block that is not water */
  return Math.max((bed-anchor.y)/S, y-1.25);
}
function groundAt0(x,z,ref){
  const k=K(); let r;
  if(ref!==undefined) r=anchor.y+ref*S;
  else if(ctx&&ctx.api){ const pd=ctx.api.inPadL(x,z);
    /* (its own level ground: a set may lie on more than one — but where something is BUILT on it, a house
       with a floor up a stair, the floor is found from below like any other: read off the level ground,
       the upper room's floor was taken for the street, and none could find a way across it) */
    if(pd){ const py=pd.ty!==undefined?pd.ty*k.B:anchor.y;
      if(!k.solidAt(anchor.x+x*SX,py+0.5*k.B,anchor.z+z*SX)) r=py+2.2*S; }
    /* (or the slope its edge was eased into: cut down a hillside, the land's own top is gone, and a man
       set there was found standing in the air forty metres over the cut) */
    else { const bh=ctx.api.blendL?ctx.api.blendL(x,z):undefined; if(bh!==undefined) r=bh*k.B+2.2*S;
      else { const m=ctx.api.moundL(x,z); if(m!==null) r=anchor.y+(m+0.5)*S; } } }
  /* with nothing to say how high (the city's courts, terraces, houses and the Hĕḵal), the
     floor is found from below: up from under the natural ground, through the stone, to the
     first floor with a man's headroom over it — the platform's top in the courts, the floor
     under a roof, never the roof (the world's own query only looks two courses above the
     land, and would stand a man inside a platform built higher than that) */
  if(r===undefined){ const B=k.B, wx=anchor.x+x*SX, wz=anchor.z+z*SX, c=k.cell(Math.floor(wx/B),Math.floor(wz/B));
    if(c){ let b=c.h-6, n=0;
      while(n<40&&!k.solidAt(wx,(b+0.5)*B,wz)){ b++; n++; }
      for(;n<120;){ while(n<120&&k.solidAt(wx,(b+0.5)*B,wz)){ b++; n++; }
        if(!k.solidAt(wx,(b+1.5)*B,wz)) break;
        b++; n++; }
      return (b*B-anchor.y)/S; } }
  const g=k.groundInfo(anchor.x+x*SX,anchor.z+z*SX,r);
  return ((g&&g.y!=null?g.y:anchor.y)-anchor.y)/S;
}
/* THE GROUND UNDER ONE OF THE SCENE'S PEOPLE as they go: a step of one course is taken up if
   there is room for a man over it; a wall is never climbed course by course onto a roof */
/* ---- A MAN HOPS A BANK OF TWO COURSES ----
   The figures of a scene took a step of a metre and no more, and the player a course; the land of
   the true earth is cut in whole blocks and rises two at a pace on any hillside, so a figure sent up
   a slope walked into it and stood there for ever, and the act waited on him. A rise of two courses
   (with room to stand on top of it) is taken as a man takes it, with a hop; a wall is still a wall. */
/* (CLIMB_REF: how far over his feet the ground is looked for, in metres. The world finds it by going down
   from there to the first block, so it must be under a doorway's lintel — laid in whole blocks it hangs
   at 1.85 — or the lintel's top is the ground, and a door is a wall three metres high: it was 2.4, and
   the doors of every house were climbed or not gone through at all. 1.3 is still over a step of two
   courses, which is the highest a man hops.) */
const CLIMB_M=2.2, CLIMB_REF=1.3;
function stepGround(x,z,cur){
  let f=groundAt(x,z,cur+CLIMB_REF);
  if(f>cur+0.05){ const k=K(), B=k.B, wx=anchor.x+x*SX, wz=anchor.z+z*SX, fy=anchor.y+f*S;
    if(f>cur+CLIMB_M||k.solidAt(wx,fy+0.5*B,wz)||k.solidAt(wx,fy+1.5*B,wz)) f=cur; }
  /* (one found with the ground over his knees and his chest — a step up refused under a bough, and the
     slope rising on under him — comes up out of it to the floor over him, a storey at most: he walked on
     inside the hillside to the upper pool, and only stood up on it when he got there) */
  if(sunkAt(x,z,f)){ const g=groundAt(x,z,f+3.2); if(isFinite(g)&&g>f&&g<=f+3.0&&!sunkAt(x,z,g)) f=g; }
  return f;
}
/* does a body standing at this height touch the blocks, at the knee or the chest? */
function bodyHit(x,z,y){ const k=K(), wx=anchor.x+x*SX, wz=anchor.z+z*SX;
  return k.solidAt(wx,anchor.y+(y+0.9)*S,wz)||k.solidAt(wx,anchor.y+(y+1.5)*S,wz); }
/* is a body standing at this height inside the blocks (at the knee and the chest)? */
function sunkAt(x,z,y){ const k=K(), wx=anchor.x+x*SX, wz=anchor.z+z*SX;
  return k.solidAt(wx,anchor.y+(y+0.9)*S,wz)&&k.solidAt(wx,anchor.y+(y+1.5)*S,wz); }
/* is a man of the scene stopped here? the blocks of the world are what stop him: a step of
   one course he climbs; anything higher, or a lintel at his head, he does not */
function solidFor(x,z,y){
  const k=K(), B=k.B, wx=anchor.x+x*SX, wz=anchor.z+z*SX, foot=anchor.y+y*S;
  const at=d=>k.solidAt(wx,foot+d*B,wz);
  if(!at(0.5)) return at(1.5);                 /* level: room for the body */
  if(!at(1.5)) return at(2.5);                 /* a step of one course, room over it */
  if(at(2.5)) return true;                     /* three courses and more: a wall */
  return at(3.5);                              /* a bank of two, hopped, if a man can stand on it */
}

/* the hour of a scene: sky, sun, fog and how much the stars show */
const TIMES={
  day:  {top:0x5f8fc9,hor:0xd9dccb,fog:0xcfd3c4,sun:0xfff1d6,sunI:1.0,hemi:0.62,stars:0,near:60,far:420},
  dusk: {top:0x2c3a66,hor:0xe0925a,fog:0xb27a5c,sun:0xffb070,sunI:0.55,hemi:0.42,stars:0.25,near:40,far:320},
  night:{top:0x05070f,hor:0x1a2440,fog:0x0d1322,sun:0x8aa0d0,sunI:0.18,hemi:0.2,stars:1,near:24,far:210},
  dawn: {top:0x3a4f84,hor:0xe7b98a,fog:0xc9a88a,sun:0xffd2a0,sunI:0.6,hemi:0.45,stars:0.15,near:40,far:320}
};
/* the hour is the world's own: the sun, the moon and the stars stand where they stand over
   that place at that hour, and the story only names the hour */
/* (dawn and dusk are taken where the voyage's own sun is up and low, not before and after it) */
const HOURS={day:10.5,dusk:17.2,night:23.2,dawn:6.5,darkness:19.4,lamplit:19.1};   /* darkness: the land darkened at midday (Mark 15:33); lamplit: a night still seen by */
let timeNow=null, hourNow=10.5;
function applyTime(name){
  timeNow=name; hourNow=HOURS[name]===undefined?10.5:HOURS[name];
  if(anchor) K().setLocalHour(hourNow,anchor.x,anchor.z);
}

/* ================= A SCENE ================= */
/* the set of the last scene taken up again: its blocks out of the world, its people gone */
function dropScene(){
  if(K().setStorm){ K().setStorm(null); K().lakeHide(null); K().ripple.focus(null); }
  if(root){ K().scene.remove(root); root.traverse(o=>{ if(o.geometry&&!o.userData.keep) o.geometry.dispose(); }); root=null; }
  if(ctx&&ctx.api) ctx.api.drop();
  ctx=null; ring=null;
}
let _smallMarks={}, _smallPlats={};
/* the small city's own marks, for a period: her plan run once with nothing built */
function smallCityMarks(period){
  if(_smallMarks[period]) return _smallMarks[period];
  /* (and her platforms — a box of stone on her level ground broader than a large room: the courts of
     Herodes stand on one three metres high, and a height written in them is over its top) */
  const plats=_smallPlats[period]=[];
  const marks={}, nop=()=>{}, api={S:1,marks,pad:nop,top:nop,water:nop,house:nop,quarter:null,mound:nop,clearTrees:nop,
    box:(x0,y0,z0,x1,y1,z1)=>{ if(Math.min(y0,y1)<=0.05&&Math.abs((x1-x0)*(z1-z0))>=400) plats.push([Math.min(x0,x1),Math.min(z0,z1),Math.max(x0,x1),Math.max(z0,z1),Math.max(y0,y1)]); },
    groundY:()=>0,inPadL:()=>null,moundL:()=>null,mark:(n,x,z)=>{ marks[n]=[x,z]; },X:x=>x,Z:z=>z,Y:y=>y,local:(x,z)=>[x,z],pads:[]};
  try{ window.YAHRU_PLAN(api,period); }catch(e){}
  return (_smallMarks[period]=marks); }
function trueCityAnchor(A,sc){
  const k=K(), S=k.setScale, yp=k.yahruPos(), period=sc.period||A.period||'kings';
  const big=k.yahruAs(period)||{}, small=smallCityMarks(period);
  let off=sc.trueAt||null;
  if(!off){
    /* where the scene is played: its player, else its first actor */
    let P=null; const pl=sc.player&&sc.player.at;
    /* (a place written along the line between two marks, ['gateIn>gateOut',a,s], is read as pos() reads it:
       unread, the siege was anchored on the first plain number it found, the Raḇshaqĕh's at the pool) */
    const plain=at=>{ if(Array.isArray(at)&&typeof at[0]==='number') return at;
      if(typeof at==='string') return small[at]||null;
      if(!Array.isArray(at)||typeof at[0]!=='string') return null;
      if(at[0].indexOf('>')>0){ const [na,nb]=at[0].split('>'), A0=small[na], B0=small[nb]; if(!A0||!B0) return null;
        const dx=B0[0]-A0[0], dz=B0[1]-A0[1], L=Math.hypot(dx,dz)||1, ux=dx/L, uz=dz/L, a=at[3]==='f'?(at[1]||0)*L:(at[1]||0), sd=at[2]||0;
        return [A0[0]+ux*a-uz*sd, A0[1]+uz*a+ux*sd]; }
      const m=small[at[0]]; return m?[m[0]+(at[1]||0),m[1]+(at[2]||0)]:null; };
    P=plain(pl); if(!P) for(const a of sc.actors||[]){ P=plain(a.at); if(P) break; }
    if(P){ let bd=1e9, best=null;
      for(const m in small){ if(/Y$/.test(m)||!big[m]) continue; const d=Math.hypot(small[m][0]-P[0],small[m][1]-P[1]); if(d<bd){ bd=d; best=m; } }
      if(best) off=[big[best][0]-small[best][0],big[best][1]-small[best][1]]; A=Object.assign({},A,{anchorMark:best}); } }
  if(!off) return A;
  const x=yp.x+off[0]*S, z=yp.z+off[1]*S, ix=Math.floor(x/k.B), iz=Math.floor(z/k.B), y=k.topY(ix,iz);
  return Object.assign({},A,{x,z,y,markOff:off,yShift:(A.y-y)/S,byMark:!sc.trueAt,period}); }
/* THE YEAR A SCENE IS PLAYED IN, from its date ('612 BCE', 'c. 28 CE'); else the first dated scene of its
   act; else its period's. The works of the ancients are raised as they stood in it (engine.js, A WONDER
   IN ITS OWN DAY): Ninewĕh whole and burning in 612, Etemenanki whole in 539, Persepolis a ruin and the
   Acropolis crowned in the days of Sha'ul. The voyage has no year, and every work stands whole in it. */
const PERIOD_YEAR={kings:-701,return:-536,herodes:30};
function dateYear(d){ const m=/(\d+)\s*(BCE|CE)\b/.exec(d||''); return m?(m[2]==='BCE'?-1:1)*+m[1]:null; }
function yearOf(sc){ let y=dateYear(sc.date); if(y!==null) return y;
  if(act) for(const s of act.scenes){ y=dateYear(s.date); if(y!==null) return y; }
  const p=sc.period||window.__STORY_PERIOD; return PERIOD_YEAR[p]!==undefined?PERIOD_YEAR[p]:30; }
function buildScene(sc){
  dropScene();
  const k=K();
  if(k.setYear) k.setYear(yearOf(sc));
  /* WHERE IT HAPPENED: the place's anchor in the world (story/places.js) */
  let A=window.STORYPLACES.at(sc.place,act);
  /* AT THE TRUE MEASURE the city stands at her true size, and a scene of hers written about the
     small city is moved to where its own business is in the true one: by its own `trueAt` (the
     courts of the House, the fortress), or else by the mark of hers it was played nearest to,
     from that mark's place in the small city to its place in the true. The scene's own numbers
     stand as they were written, about its new anchor, and her marks are named from it too. */
  if(A.city&&!A.markOff&&K().trueEarth&&K().trueEarth()) A=trueCityAnchor(A,sc);
  anchor=A; SX=A.turn?-S:S;
  /* THE SEASON is the scene's own, not the voyage's year: spring unless the scene names
     another (Rome was founded, by its own reckoning, on 21 April; the shepherds lay out in the
     fields; the lake is crossed in fair weather) — the snow is never laid on a scene by chance */
  if(window.SEASON) SEASON.setSeason(sc.season||act.season||'Spring');
  root=new THREE.Group(); root.name='story-scene'; root.position.set(A.x,A.y,A.z); root.scale.setScalar(S); root.rotation.y=SX<0?Math.PI:0; k.scene.add(root);
  scene=root;
  ctx={scene:root,colliders:[],markers:{},actors:{},things:{},glows:{},water:[],flicker:[],flock:[],bounds:null,wind:[0.5,0.2],place:sc.place,period:sc.period||A.period,anchor:A,
    year:yearOf(sc),trueEarth:!!(k.trueEarth&&k.trueEarth())};
  ctx.groundY=(x,z,ref)=>groundAt(x,z,ref);
  ctx.toWorldXZ=(x,z)=>[A.x+x*SX,A.z+z*SX]; ctx.fromWorldXZ=(wx,wz)=>[(wx-A.x)/SX,(wz-A.z)/SX];   /* (for a set that asks the land itself) */
  /* the traveller is stood there, unseen, so the world is built about the scene */
  standWalker(A.x,A.z,A.y);
  /* the city of the great king is the voyage's own, raised as she stood in the act's days;
     a scene there lays only its own things about her */
  if(A.city){ ctx.markers=Object.assign({},k.yahruAs(sc.period||A.period));     /* a scene may stand in another of her days */
    /* (a set laid at its own true place: her marks are named from its anchor, not hers) */
    if(A.markOff) for(const m in ctx.markers){ const v=ctx.markers[m]; if(!Array.isArray(v)||v.length!==2) continue;
      if(/Y$/.test(m)) ctx.markers[m]=[v[0]+(A.yShift||0),v[1]];          /* a height: from the new anchor's ground */
      else ctx.markers[m]=[v[0]-A.markOff[0],v[1]-A.markOff[1]]; }
    /* ---- AND EVERY PLACE OF THE SCENE GOES WITH THE MARK IT WAS WRITTEN BESIDE ----
       The scene's own numbers were written about the small city, and they were moved to the true
       one by ONE offset — the mark the scene began nearest to. A scene that walks from the gate
       to the upper pool was moved by the gate; but in the true city the pool lies in another
       quarter altogether, so the highway, the sovereign's guards and the stone the sign is
       written on stood inside the walls and down in a valley, the prophet and his son were sent
       there and could not arrive, and the act could not be finished. Now each number is moved
       by the mark nearest to where it was written: a place beside the small city's pool is set
       beside the true pool, a place by the gate by the true gate. */
    if(A.markOff&&A.byMark){ const small=smallCityMarks(A.period||sc.period||'kings'), big=k.yahruAs(sc.period||A.period)||{};
      ctx.remap=[]; for(const m in small){ if(/Y$/.test(m)||!big[m]||!Array.isArray(big[m])) continue;
        const d=[big[m][0]-small[m][0]-A.markOff[0],big[m][1]-small[m][1]-A.markOff[1]];
        ctx.remap.push({n:m,s:small[m],d,t:[small[m][0]+d[0],small[m][1]+d[1]],home:m===A.anchorMark}); }
      if(!ctx.remap.length) ctx.remap=null; } }
  if(k.aimOff) k.aimOff(true);                                    /* (the voyage's mark on the block in reach is not the story's) */
  ctx.api=k.setBuilder(A.x,A.z,A.y,{turn:!!A.turn,overSea:!!A.sea});      /* (a place the earth has only sea at: its ground raised out of it, story/places.js) */
  const st=new window.STORYWORLD.Static(ctx.api);
  const build=window.STORYSETTINGS[sc.place];
  if(!build) throw new Error('no such place: '+sc.place);
  build(ctx,st);
  /* ON THE TRUE EARTH a scene of the city may be played where the small city had streets and the true
     one has open hillside, and the land's own trees stand there: the ground the scene is played over
     (its witness and its people, and some way about them) is taken clear of them, so that no scene
     is watched through a wood that was never written into it. Its own olives and figs are its own. */
  if(k.trueEarth&&k.trueEarth()&&ctx.api.clearTrees){
    let x0=1e9,z0=1e9,x1=-1e9,z1=-1e9;
    const take=at=>{ try{ const p=pos(at); if(p&&isFinite(p[0])&&isFinite(p[1])){
      x0=Math.min(x0,p[0]); z0=Math.min(z0,p[1]); x1=Math.max(x1,p[0]); z1=Math.max(z1,p[1]); } }catch(e){} };
    if(sc.player&&sc.player.at) take(sc.player.at);
    for(const a of sc.actors||[]) if(a.at) take(a.at);
    if(x0<x1+1&&x1-x0<400&&z1-z0<400) ctx.api.clearTrees(x0-24,z0-24,x1+24,z1+24); }
  ctx.api.end();
  root.add(st.mesh());
  k.updateChunks(A.x,A.z,9999);
  /* every chunk the last set was taken out of, and this one laid into, is built again now,
     behind the fade — not a few a frame while the scene plays */
  if(k.flushEdits) for(let n=0;n<40&&k.flushEdits(4000);n++){}
  gatherSoft(st);                                   /* (the set's own little things a body is kept out of, now its floors are laid) */
  applyTime(sc.time||'day');
  setBed(sc.place,sc.time||'day');
  /* the people of the scene */
  for(const a of sc.actors||[]){
    const g=window.STORYWORLD.person(ctx,a);
    const p=pos(a.at); g.position.set(p[0],ctx.groundY(p[0],p[1]),p[1]); g.userData.id=a.id;
    g.rotation.y=faceOf(a.face,p);
    g.userData.id=a.id; g.userData.name=a.name; g.userData.target=null; g.userData.follow=null; g.userData.def=a;
    if(a.y!==undefined&&yOf(a.y)!==undefined){ g.userData.fixedY=yOf(a.y); g.position.y=g.userData.fixedY; }
    if(a.hidden) g.visible=false;
    if(a.sit) g.userData.sit=true;
    if(a.name) g.userData.label=makeLabel(a.name,g);
    ctx.actors[a.id]=g; }
  /* the things a witness may lay a hand on */
  for(const t of sc.things||[]){
    const p=pos(t.at); let obj;
    if(t.kind==='lamb') obj=window.STORYWORLD.sheep(ctx,p[0],p[1],true);
    else if(t.kind==='camel') obj=window.STORYWORLD.camel(ctx,p[0],p[1]);
    else if(t.kind==='donkey') obj=window.STORYWORLD.donkey(ctx,p[0],p[1]);
    else if(t.kind==='garment'){ obj=window.STORYWORLD.garment(ctx,t); obj.position.set(p[0],(ctx.groundY(p[0],p[1])||0)+(t.dy||0),p[1]); }
    else if(t.kind==='chain'){ obj=window.STORYWORLD.chain(ctx,t); }
    else if(t.kind==='beast') { obj=window.STORYWORLD.donkeyFree(ctx,p[0],p[1],t.beast||'ox'); obj.position.y=ctx.groundY(p[0],p[1])||0; }   /* an ox led to the altar (Acts 14:13) */
    else if(t.kind==='wreath'){ obj=window.STORYWORLD.wreath(ctx); obj.position.set(p[0],(ctx.groundY(p[0],p[1])||0)+(t.dy||1.1),p[1]); }
    else if(t.kind==='dove'){ obj=window.STORYWORLD.dove(ctx,p[0],t.y||12,p[1]); if(t.hidden) obj.visible=false; }
    else if(t.kind==='boat'){ obj=window.STORYWORLD.boat(ctx,p[0],p[1],{y:t.y,face:t.face,mast:t.mast,big:t.big,scale:t.scale}); obj.userData.bob=t.bob!==false; }
    else if(t.kind==='net'){ obj=window.STORYWORLD.net(ctx,p[0],p[1],t); }
    else if(t.kind==='jar'){ obj=window.STORYWORLD.stoneJar(ctx,p[0],p[1]); }
    else if(t.kind==='basket'){ obj=window.STORYWORLD.basket(ctx,p[0],p[1],t.full); }
    else if(t.kind==='infant'){ obj=window.STORYWORLD.infant(ctx,p[0],p[1],t); }
    else if(t.kind==='roundStone'){ obj=window.STORYWORLD.roundStone(ctx,p[0],p[1],t); }
    else if(t.kind==='chariot'){ obj=window.STORYWORLD.chariot(ctx,p[0],p[1]); obj.position.y=ctx.groundY(p[0],p[1])||0; }
    else if(t.kind==='fish'){ obj=new THREE.Group(); const n=t.n||1;                     /* the voyage's own fish: one broiled, or a few on the coals */
      for(let i=0;i<n;i++){ const f=window.STORYWORLD.voyageFish(['fish',t.color||0x9a8a70]); if(!f) continue; const h=new THREE.Group(); h.add(f);
        h.rotation.set(0,(i*1.9)%6.28,Math.PI/2); h.position.set((i%3-1)*0.16,0.05,(Math.floor(i/3)-0.5)*0.16); obj.add(h); }
      obj.position.set(p[0],t.y!==undefined?yOf(t.y):(ctx.groundY(p[0],p[1])||0)+(t.dy||0),p[1]); scene.add(obj); }
    else if(t.kind==='vision'){ obj=window.STORYWORLD.vision(ctx,p[0],p[1],t); obj.position.y=t.y!==undefined?yOf(t.y):(ctx.groundY(p[0],p[1])||0); }
    else if(t.kind==='throne'){ obj=window.STORYWORLD.throne(ctx,p[0],p[1],t); obj.position.y=t.y!==undefined?yOf(t.y):(ctx.groundY(p[0],p[1])||0); }
    /* the throne high and lifted up, and the train of the robe filling the Hĕḵal (Yashayahu 6:1) */
    else if(t.kind==='gloryThrone'){ obj=window.STORYWORLD.gloryThrone(ctx,p[0],p[1],t); obj.position.y=(ctx.groundY(p[0],p[1])||0)+(t.dy||0); }
    /* the court of heaven where the vision is seen, and its altar (Yashayahu 6:1, 6:6) */
    else if(t.kind==='heavenCourt'){ obj=window.STORYWORLD.heavenCourt(ctx,p[0],p[1],t); }
    else if(t.kind==='smokeCloud'){ obj=window.STORYWORLD.smokeCloud(ctx,p[0],p[1],t); }
    else if(t.kind==='livingOne'){ obj=window.STORYWORLD.livingOneAt(ctx,p[0],p[1],t); }
    else if(t.kind==='heavenAltar'){ obj=window.STORYWORLD.heavenAltar(ctx,p[0],p[1],t); obj.position.y=(ctx.groundY(p[0],p[1])||0)+(t.dy||0); }
    else if(t.kind==='robeTrain'){ if(t.lenTo){ const q=pos(t.lenTo); t.len=Math.max(3,Math.hypot(q[0]-p[0],q[1]-p[1])*(t.lenK||0.92)); }   /* (as long as the house is) */
      obj=window.STORYWORLD.robeTrain(ctx,p[0],p[1],t); obj.position.y=(ctx.groundY(p[0],p[1])||0)+(t.dy||0); }
    else { obj=new THREE.Mesh(new THREE.BoxGeometry(t.w||0.5,t.h||0.5,t.d||0.5),new THREE.MeshLambertMaterial({color:t.color||0xc9b38a}));
      /* `y` a height in the scene; `dy` (or nothing) above the ground where it lies */
      const gy=t.y!==undefined?t.y:(ctx.groundY(p[0],p[1])||0)+(t.dy||0);
      obj.position.set(p[0],gy+(t.h||0.5)/2,p[1]); scene.add(obj); }
    if(t.face!==undefined) obj.rotation.y=t.face;
    /* `faceTo`: turned toward a place (a throne toward the doors, whichever way the house runs) */
    if(t.faceTo!==undefined){ const q=pos(t.faceTo); obj.rotation.y=Math.atan2(q[0]-obj.position.x,q[1]-obj.position.z); }
    if(t.hidden) obj.visible=false;
    if(t.y!==undefined&&t.kind!=='box'&&t.kind!=='dove'&&t.kind!=='throne'&&t.kind!=='vision'&&t.kind!=='fish') obj.position.y=t.y;
    obj.userData.thing=t; obj.userData.baseY=obj.position.y; obj.userData.soft=thingFoot(t); ctx.things[t.id]=obj; }
  settleActors(sc);
  placeCrowds(sc);
  spawnLife();
  spawnFolk(sc);
  if(K().shadowRescan) K().shadowRescan();          /* (the scene's people and things throw their shade from its first frame) */
  /* THE LAKE'S OWN WAVES, where the set has asked for them (S.galilSea): laid over the still water,
     which is put by beneath them */
  /* ---- AND THE GREAT SEA IS ITS OWN ----
     A set's water at the sea's own level (Melite) is the voyage's live sea, and the lake's waves were laid
     over it: two fields of waves crossing, the sea's crests and their foam standing up through the lake's in
     pale blots. There the voyage's sea is the only one drawn, and a boat rides it (`voyage`; see lakeH).
     Kinnereth lies far under the sea's level, and keeps its own waves. */
  if(ctx.lake&&K().ripple){ const L=ctx.lake, r=L.rect;
    L.voyage=!!(k.seaHeight&&(A.sea||(ctx.trueEarth&&Math.abs(A.y-k.WATER_Y)<=k.B)));
    if(!L.voyage) L.w=window.STORYWORLD.lakeWaves(ctx,r);
    L.A=0.025+0.075*(ctx.rough||1); L.t=0;
    root.updateMatrixWorld(true);                   /* (not yet drawn: its world matrix is not yet worked out) */
    const a=root.localToWorld(new THREE.Vector3(r[0],0,r[1])), b=root.localToWorld(new THREE.Vector3(r[2],0,r[3]));
    K().lakeHide([Math.min(a.x,b.x),Math.min(a.z,b.z),Math.max(a.x,b.x),Math.max(a.z,b.z)]); }
  /* lights. A MAL'AK (`malak`) is seen: a man of dark skin, robed in white, standing within the light
     (or, high in the air, borne up in it), turned toward those he is sent to; `sit` for those the
     Besorah sets sitting (the tomb, Yahuchanon 20:12) */
  for(const gl of sc.glows||[]){
    /* at [x,y,z]; or at a marker (or a marker and a step from it), `y` high, or `dy` above the ground there */
    /* `on`: a light that rests on someone's head and goes with him — "tongues as of fire,
       and one sat upon each of them" (Acts 2:3) — `dy` above the top of the head */
    if(gl.on&&ctx.actors[gl.on]&&!gl.at) gl.at=[0,0,0];
    const p=gl.at.length===3&&typeof gl.at[0]==='number'?remap3(gl.at):(()=>{ const m=pos(gl.at);
      return [m[0],gl.dy!==undefined?(ctx.groundY(m[0],m[1])||0)+gl.dy:(gl.y||2),m[1]]; })();
    const G=window.STORYWORLD.glow(ctx,p[0],p[1],p[2],gl.size||3,gl.color,gl.intensity===undefined?1.2:gl.intensity);
    if(gl.h){ G.sprite.scale.set(gl.size||3,gl.h,1); G.aspect=gl.h/(gl.size||3); }      /* a column of light keeps its height as it pulses or swells */
    if(gl.seraph) seraphFigure(G,gl); else if(gl.malak) malakFigure(G,gl);
    G.visible=!gl.hidden; G.pulse=gl.pulse; if(gl.on&&ctx.actors[gl.on]){ G.on=ctx.actors[gl.on]; G.onDy=gl.dy===undefined?0.18:gl.dy; } ctx.glows[gl.id]=G; }
  ctx.drifts=[];
  if(sc.host){ ctx.host=[]; const h=sc.host;                     /* the heavenly host */
    for(let k=0;k<h.n;k++){ const a=k/h.n*Math.PI*2, r=h.r*(0.5+0.5*Math.random());
      const G=window.STORYWORLD.glow(ctx,h.at[0]+Math.cos(a)*r,h.y+Math.random()*h.h,h.at[1]+Math.sin(a)*r,1.2+Math.random()*1.2,0xfff4d8,0);
      G.visible=false; G.ph=Math.random()*6; ctx.host.push(G); }
    /* and in each light one of the host, robed in white, turned to the field */
    const figs=ctx.host.map(G=>{ const q=G.sprite.position; return {x:q.x,y:q.y-1.2,z:q.z,face:Math.atan2(h.at[0]-q.x,h.at[1]-q.z),s:1.0,sit:false,roman:false,woman:false,
      robe:0xf4f1e8,cloth:0xfbf8ef,skin:MALAK_SKIN[Math.floor(Math.random()*MALAK_SKIN.length)],sash:0xe8dcb0,beard:null}; });
    ctx.hostFigs=window.STORYWORLD.crowd(ctx,figs); ctx.hostFigs.visible=false; }
  ctx.star=null;
  if(sc.star){ const s=sc.star; ctx.star=window.STORYWORLD.glow(ctx,s.at[0],s.y,s.at[1],s.size||14,0xf6f0ff,0); ctx.star.visible=!s.hidden; }
  /* the player */
  const P=sc.player||{};
  player=window.STORYWORLD.person(ctx,Object.assign({robe:0x7a6a8e,cloth:0xcfc6b0,skin:0x8a5a3a},P.look||{}));
  const pp=pos(P.at||[0,0]); player.position.set(pp[0],ctx.groundY(pp[0],pp[1]),pp[1]);
  const pf=faceOf(P.face,pp); player.rotation.y=pf;                              /* (a bearing, or a place to face: it was taken as a number, and the eye went to NaN) */
  camYaw=pf+Math.PI; camTarget=null;
  ctx.playerHidden=!!P.hidden; player.visible=!P.hidden;
}
/* THE MULTITUDE of a scene (`crowds`): beyond its named people, the many — `n` of them, in an
   `area` [x0,z0,x1,z1] or a `ring` [marker, r0, r1] (an `arc` of it, [a0,a1] radians), facing a
   marker (`look`) or a way (`face`), standing or `sit`ting; never in a wall or a house, never on
   one of the named or the witness, kept off `keep` [[x0,z0,x1,z1]…] and a `path` (a road left open). Each is
   one mesh, a thing of the scene, so `show` and `hide` take a crowd in or out by its `id`. */
const CROWD_ROBES=[0x7c6a52,0x5f6a52,0x8e6f4c,0x6b5a44,0x74604a,0x5c5040,0x8a7a60,0x6e5a70,0x7a5040,0x5a6470,0x8a5a3a,0x4f6a4f,0x9a8466,0x6a4a3a,0x5a5a3a,0x7a6a8e];
const CROWD_CLOTHS=[0xcfc4aa,0xd8ceb4,0xb9ab8e,0xe6e0cf,0xc1b394,0xa89a7e,0xe8e2d2];
const CROWD_VEILS=[0xe8e2d2,0x3c3a44,0x8a6a5a,0x6a5a7a,0x5a3a4a,0xc8b89a,0x2e2a30];
const CROWD_SKIN=[0x5c3a1f,0x643f1c,0x6e4524,0x704a27,0x7a4e29,0x7c5430,0x845634,0x8a5a36,0x8e5c3c,0x6a4426];
function placeCrowds(sc){
  ctx.crowdPts=[];
  if(!sc.crowds||!K().solidAt) return;
  const k=K(), taken=[], foots=[];
  for(const id in ctx.actors){ const g=ctx.actors[id]; taken.push([g.position.x,g.position.z,1.1]); }
  /* (each thing keeps its own footprint clear and a little about it, not a metre about its middle: the money
     changers' tables, two metres long, stood full of the crowd) */
  for(const id in ctx.things){ const o=ctx.things[id], F=o.userData.soft;
    if(F) foots.push(oRect(o.position.x,o.position.z,o.rotation.y,F[0]+0.35,F[1]+0.35)); else taken.push([o.position.x,o.position.z,1.2]); }
  const pp=pos((sc.player&&sc.player.at)||[0,0]); taken.push([pp[0],pp[1],1.6]);
  const ways=storyWays(sc,taken);
  for(const c of sc.crowds){
    let h=2166136261; for(const ch of (act.id+'/'+sc.id+'/'+c.id)) h=Math.imul(h^ch.charCodeAt(0),16777619);
    const r=()=>{ h=Math.imul(h^(h>>>15),2246822507); h=Math.imul(h^(h>>>13),3266489909); h^=h>>>16; return (h>>>0)/4294967296; };
    const look=c.look?pos(c.look):null, gap=c.gap||0.72, figs=[], path=c.path?c.path.map(q=>pos(q)):null;
    /* the level of the ground they stand on (the middle of their area or ring, or `refY`): none is
       set on a wall-top, a roof or a terrace far above or below it (more than `dy`) */
    const mid=c.ring?pos(c.ring[0]):[(c.area[0]+c.area[2])/2,(c.area[1]+c.area[3])/2];
    const refY=c.refY!==undefined?c.refY:ctx.groundY(mid[0],mid[1])||0, dyMax=c.dy||2.6;   /* `path`: a way through them left open, `clear` wide each side */
    for(let t=0;t<c.n*14&&figs.length<c.n;t++){
      let x,z;
      if(c.ring){ const m=pos(c.ring[0]), a=c.arc?c.arc[0]+r()*(c.arc[1]-c.arc[0]):r()*Math.PI*2, d=c.ring[1]+Math.sqrt(r())*(c.ring[2]-c.ring[1]); x=m[0]+Math.sin(a)*d; z=m[1]+Math.cos(a)*d; }
      else { const A=c.area; x=A[0]+r()*(A[2]-A[0]); z=A[1]+r()*(A[3]-A[1]); }
      if(c.keep&&c.keep.some(q=>x>q[0]&&x<q[2]&&z>q[1]&&z<q[3])) continue;
      if(path&&path.some((q,i)=>{ if(!i) return false; const a0=path[i-1], dx=q[0]-a0[0], dz=q[1]-a0[1], L2=dx*dx+dz*dz||1,
          u=Math.max(0,Math.min(1,((x-a0[0])*dx+(z-a0[1])*dz)/L2)); return (x-a0[0]-u*dx)**2+(z-a0[1]-u*dz)**2<(c.clear||2.4)**2; })) continue;
      if(taken.some(q=>(q[0]-x)**2+(q[1]-z)**2<(q[2]||gap)**2)) continue;
      if(foots.some(f=>softDist(f,x,z)<1e-3)) continue;
      if(ways.some(w=>{ const dx=w[2]-w[0], dz=w[3]-w[1], L2=dx*dx+dz*dz||1, u=Math.max(0,Math.min(1,((x-w[0])*dx+(z-w[1])*dz)/L2));
          return (x-w[0]-u*dx)**2+(z-w[1]-u*dz)**2<0.49; })) continue;
      const y=c.top!==undefined?ctx.groundY(x,z,c.top):ctx.groundY(x,z); if(y==null||!isFinite(y)) continue;   /* `top`: found from that height down — the seats of a theatre */
      const wx=anchor.x+x*SX, wz=anchor.z+z*SX;
      if(k.solidAt(wx,anchor.y+(y+0.5)*S,wz)||k.solidAt(wx,anchor.y+(y+1.4)*S,wz)) continue;     /* in a wall, a tree, a house */
      if(softAt(x,z,y,0.25,null,null,1)) continue;                                               /* nor in a bench, a table, a palm's foot */
      if(c.minY!==undefined&&y<c.minY) continue;
      if(Math.abs(y-refY)>dyMax) continue;
      if(k.waterAt&&k.waterAt(wx,anchor.y+(y+0.3)*S,wz)) continue;                         /* nor standing in a pool */
      /* facing what they came to see: a marker, the way through them (`facePath`), or a bearing */
      let tgt=look;
      if(c.facePath&&path){ let bd=1e9; for(let i=1;i<path.length;i++){ const a0=path[i-1], q=path[i], dx=q[0]-a0[0], dz=q[1]-a0[1], L2=dx*dx+dz*dz||1,
          u=Math.max(0,Math.min(1,((x-a0[0])*dx+(z-a0[1])*dz)/L2)), px=a0[0]+u*dx, pz=a0[1]+u*dz, d=(x-px)**2+(z-pz)**2; if(d<bd){ bd=d; tgt=[px,pz]; } } }
      const face=tgt?Math.atan2(tgt[0]-x,tgt[1]-z)+(r()-0.5)*(c.jitter===undefined?0.6:c.jitter):(c.face||0)+(r()-0.5)*(c.jitter===undefined?1.0:c.jitter);
      const woman=!c.roman&&r()<(c.women===undefined?0.42:c.women), child=!c.roman&&!woman&&r()<(c.children===undefined?0.12:c.children);
      figs.push({x,y,z,face,s:child?0.66+r()*0.1:(woman?0.9:0.95)+r()*0.1, sit:!!c.sit, roman:!!c.roman, woman,
        robe:CROWD_ROBES[Math.floor(r()*CROWD_ROBES.length)], cloth:woman?CROWD_VEILS[Math.floor(r()*CROWD_VEILS.length)]:CROWD_CLOTHS[Math.floor(r()*CROWD_CLOTHS.length)],
        skin:CROWD_SKIN[Math.floor(r()*CROWD_SKIN.length)], sash:r()<0.2?0xb08d3c:null,
        beard:!woman&&!child&&r()<0.75?[0x2c241f,0x3a2a1e,0x6d6a66,0x1e1814][Math.floor(r()*4)]:null});
      taken.push([x,z,gap]); ctx.crowdPts.push([x,y,z]); }
    const mesh=window.STORYWORLD.crowd(ctx,figs); mesh.visible=!c.hidden; mesh.userData.crowd=true; ctx.things[c.id]=mesh;
    /* each of them a body the people of the scene go round, while the crowd is seen (one sitting, with his knees) */
    for(let i=ctx.crowdPts.length-figs.length;i<ctx.crowdPts.length;i++) ctx.crowdPts[i][3]=mesh;
    if(ctx.soft) for(const f of figs){ const r=f.sit?0.34:0.2, cx=f.sit?f.x+Math.sin(f.face)*0.25:f.x, cz=f.sit?f.z+Math.cos(f.face)*0.25:f.z;
      softPut({t:1,b:2,cx,cz,r,x0:cx-r,z0:cz-r,x1:cx+r,z1:cz+r,y0:f.y,y1:f.y+(f.sit?1.1:1.7),m:mesh,name:'the crowd '+c.id}); } }
}
/* the places the story sends its people, and the ways it walks them there (from where each then stands), left
   open by the multitude: it stood on the marks the Twelve were sent to, and in the road they were walked along.
   Each mark is kept a stride clear (into `taken`); the ways (no cut across a city) are returned. */
function storyWays(sc,taken){
  const cur={}, ways=[]; for(const id in ctx.actors){ const g=ctx.actors[id]; cur[id]=[g.position.x,g.position.z]; }
  const at=q=>typeof q==='string'&&cur[q]?cur[q]:pos(q);
  for(const B of sc.beats||[]){ try{
    if(B.t==='place'&&cur[B.who]){ const p=at(B.at); cur[B.who]=[p[0],p[1]]; taken.push([p[0],p[1],0.9]); }
    else if(B.t==='move'){ const who=[].concat(B.who), tos=Array.isArray(B.who)||Array.isArray(B.to&&B.to[0])?[].concat(B.to):[B.to];
      who.forEach((w,k)=>{ const a=cur[w]; if(!a) return; const p=at(tos[Math.min(k,tos.length-1)]);
        if(Math.hypot(p[0]-a[0],p[1]-a[1])<90) ways.push([a[0],a[1],p[0],p[1]]);
        taken.push([p[0],p[1],0.9]); cur[w]=[p[0],p[1]]; }); } }catch(e){} }
  return ways; }
/* ---- THE LIFE OF THE WATERS, AND THE WATER STIRRED ----
   Is there water at (x,z) under the face `y`? (a pool's, a river's, a lake's blocks) */
function wetAt(x,z,y){ const k=K(); return !!(k.waterAt&&k.waterAt(anchor.x+x*SX,anchor.y+((y||0)-0.3)*S,anchor.z+z*SX)); }
function toW(x,y,z){ return new THREE.Vector3(anchor.x+x*SX,anchor.y+y*S,anchor.z+z*SX); }
/* the creatures of each water the set asked for (W.waterLife): fish in it, frogs and turtles at its
   edge, egrets in its shallows, dragonflies over it, butterflies over the green about it */
function spawnLife(){
  ctx.life=[]; ctx.hasWater=false;
  for(const o of ctx.lifeSpecs||[]){
    const y=o.y||0, rnd=Math.random;
    const pick=(test,tries)=>{ for(let t=0;t<(tries||60);t++){ const a=rnd()*6.28, d=Math.sqrt(rnd())*o.r, x=o.at[0]+Math.cos(a)*d, z=o.at[1]+Math.sin(a)*d; if(test(x,z)) return [x,z]; } return null; };
    const shore=(x,z)=>!wetAt(x,z,y)&&(wetAt(x+1,z,y)||wetAt(x-1,z,y)||wetAt(x,z+1,y)||wetAt(x,z-1,y));
    const shallow=(x,z)=>wetAt(x,z,y)&&(!wetAt(x+1.4,z,y)||!wetAt(x-1.4,z,y)||!wetAt(x,z+1.4,y)||!wetAt(x,z-1.4,y));
    const add=(kind,p,py,st)=>{ if(!p) return; const g=window.STORYWORLD.creature(ctx,kind); g.position.set(p[0],py,p[1]); g.rotation.y=rnd()*6.28;
      ctx.life.push(Object.assign({g,kind,y,home:p.slice(),t:rnd()*5,o},st||{})); ctx.hasWater=true; };
    for(let i=0;i<(o.fish||0);i++) add('fish',pick((x,z)=>wetAt(x,z,y)&&wetAt(x,z,y-0.5)),y-0.32-rnd()*0.2,{sp:0.4+rnd()*0.5});
    for(let i=0;i<(o.frogs||0);i++){ const p=pick(shore,90); if(p) add('frog',p,ctx.groundY(p[0],p[1])||y,{}); }
    for(let i=0;i<(o.turtles||0);i++){ const p=pick(shore,90); if(p) add('turtle',p,ctx.groundY(p[0],p[1])||y,{}); }
    for(let i=0;i<(o.egrets||0);i++){ const p=pick(shore,90); if(p) add('egret',p,ctx.groundY(p[0],p[1])||y,{}); }
    for(let i=0;i<(o.flies||0);i++) add('fly',pick((x,z)=>wetAt(x,z,y)),y+0.5+rnd()*0.6,{to:null});
    if(o.butterflies&&K().makeBird) for(let i=0;i<o.butterflies;i++){ const p=pick(shore,90); if(!p) continue;
      const b=K().makeBird('butterfly'); if(!b) continue; const g=new THREE.Group(); b.scale.multiplyScalar(1/K().setScale); g.add(b); ctx.scene.add(g);
      g.position.set(p[0],(ctx.groundY(p[0],p[1])||y)+0.8,p[1]); ctx.life.push({g,kind:'butterfly',y,home:p.slice(),t:rnd()*5,o,b}); }
  }
}
function lifeTick(dt){
  if(!ctx.life||!ctx.life.length) return;
  const k=K(), now=performance.now()/1000;
  for(const L of ctx.life){ const g=L.g; L.t+=dt;
    if(L.kind==='fish'){
      /* swimming: on, turning a little, turning hard from the bank; now and then a leap */
      if(L.leap){ L.leap.t+=dt/0.9; const q=L.leap.t; g.position.x+=Math.sin(g.rotation.y)*1.6*dt; g.position.z+=Math.cos(g.rotation.y)*1.6*dt;
        g.position.y=L.y-0.1+Math.sin(Math.min(1,q)*Math.PI)*0.7; g.rotation.x=-Math.cos(Math.min(1,q)*Math.PI)*0.8;
        if(q>=1){ L.leap=null; g.position.y=L.y-0.35; g.rotation.x=0; if(k.splash){ const w=toW(g.position.x,L.y,g.position.z); k.splash(w.x,w.y,w.z,false); } } continue; }
      g.rotation.y+=(Math.sin(L.t*0.7+L.home[0])*0.6)*dt;
      const nx=g.position.x+Math.sin(g.rotation.y)*L.sp*dt, nz=g.position.z+Math.cos(g.rotation.y)*L.sp*dt;
      if(wetAt(nx+Math.sin(g.rotation.y)*0.5,nz+Math.cos(g.rotation.y)*0.5,L.y)){ g.position.x=nx; g.position.z=nz; } else g.rotation.y+=2.2+Math.random();
      if(L.u===undefined) L.u=g.userData; if(L.u.tail) L.u.tail.rotation.y=Math.sin(L.t*9)*0.5; else if(L.u.body) L.u.body.rotation.y=Math.sin(L.t*9)*0.16;   /* the voyage's fish swims with its whole body */
      if(Math.random()<dt/45){ L.leap={t:0}; if(k.splash){ const w=toW(g.position.x,L.y,g.position.z); k.splash(w.x,w.y,w.z,false); } } }
    else if(L.kind==='frog'){
      /* sitting at the edge; a hop now and then — sometimes plop into the water, and back */
      if(L.hop){ L.hop.t+=dt/0.45; const q=Math.min(1,L.hop.t); g.position.x=L.hop.a[0]+(L.hop.b[0]-L.hop.a[0])*q; g.position.z=L.hop.a[1]+(L.hop.b[1]-L.hop.a[1])*q;
        g.position.y=L.hop.y0+(L.hop.y1-L.hop.y0)*q+Math.sin(q*Math.PI)*0.35;
        if(q>=1){ L.hop=null; if(L.inWater&&k.ripple){ const w=toW(g.position.x,0,g.position.z); k.ripple.at(w.x,w.z,-0.5,4,0.2); } } continue; }
      if(L.t>3+Math.random()*4){ L.t=0; const into=!L.inWater&&Math.random()<0.35, back=L.inWater;
        const a=Math.random()*6.28, b=back?L.home:[g.position.x+Math.cos(a)*(into?0.9:0.5),g.position.z+Math.sin(a)*(into?0.9:0.5)];
        if(into&&!wetAt(b[0],b[1],L.y)) continue; if(!into&&!back&&wetAt(b[0],b[1],L.y)) continue;
        L.inWater=into; g.rotation.y=Math.atan2(b[0]-g.position.x,b[1]-g.position.z);
        L.hop={t:0,a:[g.position.x,g.position.z],b,y0:g.position.y,y1:into?L.y-0.06:(ctx.groundY(b[0],b[1])||L.y)}; } }
    else if(L.kind==='fly'){
      /* darting over the water and hanging still, then darting again */
      if(L.u===undefined) L.u=g.userData; for(const w of L.u.wings||[]) w.rotation.z=Math.sin(L.t*60)*0.5;
      if(!L.to||L.t>1.4+Math.random()){ L.t=0; const a=Math.random()*6.28, d=0.6+Math.random()*2.2, x=g.position.x+Math.cos(a)*d, z=g.position.z+Math.sin(a)*d;
        L.to=wetAt(x,z,L.y)?[x,L.y+0.35+Math.random()*0.8,z]:[L.home[0],L.y+0.6,L.home[1]]; }
      const f=Math.min(1,dt*3.2); g.position.x+=(L.to[0]-g.position.x)*f; g.position.y+=(L.to[1]-g.position.y)*f; g.position.z+=(L.to[2]-g.position.z)*f;
      g.rotation.y=Math.atan2(L.to[0]-g.position.x,L.to[2]-g.position.z); }
    else if(L.kind==='egret'){
      /* still as a post; then the neck darts down at a fish, and a slow step or two */
      if(L.u===undefined) L.u=g.userData; const n=L.u.neck;
      const c=(L.t%7)/7; n.rotation.x=c>0.86?Math.sin((c-0.86)/0.14*Math.PI)*1.2:0;
      if(c>0.5&&c<0.56){ const a=g.rotation.y, x=g.position.x+Math.sin(a)*0.25*dt*8, z=g.position.z+Math.cos(a)*0.25*dt*8; if(!wetAt(x,z,L.y)) { g.position.x=x; g.position.z=z; } else g.rotation.y+=0.8*dt*8; } }
    else if(L.kind==='butterfly'){
      g.position.x=L.home[0]+Math.sin(L.t*0.6)*1.6+Math.sin(L.t*1.7)*0.4; g.position.z=L.home[1]+Math.cos(L.t*0.5)*1.6;
      g.position.y=(ctx.groundY(g.position.x,g.position.z)||L.y)+0.7+Math.sin(L.t*2.3)*0.25; g.rotation.y=L.t*0.6+Math.PI/2;
      if(L.b&&L.b.userData&&L.b.userData.wings){ const w=L.b.userData.wings, a=Math.sin(L.t*16)*0.9; if(w[0]) w[0].rotation.z=a; if(w[1]) w[1].rotation.z=-a; } }
  }
}
/* THE WATER STIRRED: the live water's field follows the one who is seen, and whoever stands in water
   rings it — at each step as he wades, and faintly as he stands */
function wadeTick(dt){
  const k=K(); if(!k.ripple||!k.waterAt) return;
  if(!ctx.lake&&(ctx.hasWater||ctx.wet)){ const p=player||null; if(p){ const w=toW(p.position.x,0,p.position.z); k.ripple.focus({x:w.x,y:w.y,z:w.z}); } }
  const ring=(g)=>{ const u=g.userData; if(!g.visible) return; const x=g.position.x, z=g.position.z;
    if(!k.waterAt(anchor.x+x*SX,anchor.y+(g.position.y+0.35)*S,anchor.z+z*SX)) return;
    ctx.wet=true;
    const lp=u._wadeP; u._wadeT=(u._wadeT||0)-dt;
    if(!lp||Math.hypot(x-lp[0],z-lp[1])>0.5){ u._wadeP=[x,z]; const w=toW(x,0,z); k.ripple.at(w.x,w.z,-0.8,5,0.25); u._wadeT=1.6; }
    else if(u._wadeT<=0){ u._wadeT=1.6+Math.random(); const w=toW(x,0,z); k.ripple.at(w.x,w.z,-0.3,4,0.05); } };
  for(const id in ctx.actors){ const g=ctx.actors[id]; if(g.userData.fixedY===undefined||!ctx.lake) ring(g); }
  if(player) ring(player);
}
/* THE PEOPLE OF THE PLACE (W.folk in a set): the town about its day while the story is told in
   it. They are not the scene's actors — no beat moves them, none speaks — and they keep clear of
   those who are: never set down near where the scene's people or the witness stand, stepping
   aside for anyone in their way. Not at night, nor by lamplight (the town is asleep); fewer at
   dawn and dusk. A scene may ask for none (`folk:false`) or more or fewer (`folk:<scale>`). */
const FOLK_MAX=20;
function spawnFolk(sc){
  ctx.folk=[];
  const specs=ctx.folkSpecs; if(!specs||!specs.length||sc.folk===false) return;
  const tm=sc.time||'day';
  if((tm==='night'||tm==='lamplit'||tm==='darkness')&&typeof sc.folk!=='number') return;
  const scale=typeof sc.folk==='number'?sc.folk:(tm==='dusk'||tm==='dawn'?0.6:1), MAX=Math.round(FOLK_MAX*Math.min(1.4,scale));
  let h=2166136261; for(const ch of (act.id+'/'+sc.id+'/folk')) h=Math.imul(h^ch.charCodeAt(0),16777619);
  const r=()=>{ h=Math.imul(h^(h>>>15),2246822507); h=Math.imul(h^(h>>>13),3266489909); h^=h>>>16; return (h>>>0)/4294967296; };
  const pick=a=>a[Math.floor(r()*a.length)%a.length];
  /* the stage: where the scene's people, its things and the witness are at the start */
  const stage=[]; for(const id in ctx.actors){ const g=ctx.actors[id]; if(g.visible) stage.push([g.position.x,g.position.z]); }
  for(const id in ctx.things){ const o=ctx.things[id]; if(o.visible) stage.push([o.position.x,o.position.z]); }
  stage.push(pos((sc.player&&sc.player.at)||[0,0]));
  /* a body's room: the place and a shoulder's breadth all round it free of the world's blocks */
  const room=(x,z,r)=>{ const gy=ctx.groundY(x,z); r=r||0.36; return !wallAt(x,z,gy)&&!wallAt(x+r,z,gy)&&!wallAt(x-r,z,gy)&&!wallAt(x,z+r,gy)&&!wallAt(x,z-r,gy)
    &&!softAt(x,z,gy,r,null,null,5); };                                                   /* (nor a table's, a bench's, a jar's) */
  ctx.folkSolids=[];                                                                       /* their mills, nets, tables: [x,z,r] */
  const clear=(x,z,d)=>stage.every(p=>Math.hypot(p[0]-x,p[1]-z)>=d)&&(ctx.crowdPts||[]).every(q=>Math.hypot(q[0]-x,q[2]-z)>=1.0)
    &&ctx.folk.every(F=>Math.hypot(F.g.position.x-x,F.g.position.z-z)>=0.9)&&ctx.folkSolids.every(q=>Math.hypot(q[0]-x,q[1]-z)>=q[2]+0.45)
    &&room(x,z)&&!(K().waterAt&&wetAt(x,z,ctx.groundY(x,z)+0.2));
  const W=window.STORYWORLD;
  const person=(s,o)=>{ o=o||{}; const woman=o.woman!==undefined?o.woman:r()<0.45, child=!!o.child, folk=s.folk||'yasharal';
    const def={id:'folk'+ctx.folk.length, kind:woman?'woman':(!child&&r()<0.15?'oldman':'man'), small:child||undefined,
      robe:pick(CROWD_ROBES), cloth:woman?pick(CROWD_VEILS):pick(CROWD_CLOTHS), sash:r()<0.5?pick(CROWD_ROBES):undefined,
      beard:!woman&&!child&&r()<0.8?pick([0x2c241f,0x3a2a1e,0x1e1814,0x6d6a66]):null, staff:o.staff, skin:folk==='yasharal'?pick(CROWD_SKIN):pick(W.SKIN[folk]||CROWD_SKIN)};   /* the skin of their people, not (for Romans) a legionary's dress */
    const g=W.person(ctx,def); g.userData.def=def; g.userData.folkG=true; return g; };
  const hold=(g,kind,where)=>{ const p=W.prop(kind), u=g.userData;
    if(where==='head'&&u.head){ p.position.set(0,0.13,0); u.head.add(p); }
    else { const E=u.armR&&u.armR.userData.elbow; if(E){ p.position.set(0,-0.33,0.03); E.add(p); } else g.add(p); }
    return p; };
  const add=(g,x,z,face,st)=>{ const gy=ctx.groundY(x,z)||0; g.position.set(x,gy,z); g.rotation.y=face||0; g.userData.gy=gy;
    const F=Object.assign({g,t:r()*4,ph:r()*6.28,sp:0.95+r()*0.35},st); ctx.folk.push(F); return F; };
  const ptIn=(A,tries)=>{ for(let t=0;t<(tries||30);t++){ const x=A[0]+r()*(A[2]-A[0]), z=A[1]+r()*(A[3]-A[1]); if(clear(x,z,3)) return [x,z]; } return null; };
  for(const s0 of specs){
    if(ctx.folk.length>=MAX) break;
    try{ folkOne(s0); }catch(e){ console.warn('folk:',s0.do,e.message); }      /* one that cannot be placed is left out, not the scene */
  }
  function folkOne(s0){
    const s=s0, n=Math.max(s.n===undefined?1:1,Math.round((s.n||1)*scale)), job=s.do;
    for(let i=0;i<n&&ctx.folk.length<MAX;i++){
      if(job==='walk'){ const P=s.path.map(q=>pos(q)); if(P.length<2) break;
        const seg=Math.floor(r()*(P.length-1)), f=r(), a=P[seg], b=P[seg+1], x=a[0]+(b[0]-a[0])*f, z=a[1]+(b[1]-a[1])*f;
        if(!clear(x,z,2.4)) continue;
        const g=person(s,{woman:r()<0.3}), dir=r()<0.5?1:-1, F=add(g,x,z,0,{job,P,i:dir>0?seg+1:seg,dir,sp:1.0+r()*0.3});
        if(r()<0.4) F.load=hold(g,pick(['sack','basket','wood']),'head');
        if(s.donkey&&r()<(s.beast?0.85:0.6)&&K().makeAnimal){ const d=W.donkeyFree?W.donkeyFree(ctx,x,z,s.beast):null; if(d){ F.beast=d; F.beastKind=s.beast||'donkey'; } }
        continue; }
      if(job==='stroll'){ const p=ptIn(s.area); if(!p) continue; const g=person(s,{child:r()<0.12}), F=add(g,p[0],p[1],r()*6.28,{job,A:s.area,state:'pause'});
        if(r()<0.3) F.load=hold(g,pick(['basket','jar','sack']),'head'); continue; }
      if(job==='water'){ const S=pos(s.from), H=s.to.map(q=>pos(q)), home=pick(H), f=r(), x=S[0]+(home[0]-S[0])*f, z=S[1]+(home[1]-S[1])*f;
        if(!clear(x,z,2.4)) continue;
        const g=person(s,{woman:s.men?false:r()<0.85}), F=add(g,x,z,0,{job,S,H,home,state:r()<0.5?'down':'up'});
        F.jarH=hold(g,'jar','head'); F.jarA=hold(g,'jar','hand'); F.jarA.scale.setScalar(0.85); F.jarA.position.set(0,-0.62,0.05); continue; }
      if(job==='carry'){ const A=pos(s.from), B=pos(s.to), f=r(), x=A[0]+(B[0]-A[0])*f, z=A[1]+(B[1]-A[1])*f; if(!clear(x,z,2.4)) continue;
        const g=person(s,{woman:r()<0.3}), F=add(g,x,z,0,{job,A,B,state:r()<0.5?'to':'back'}); F.load=hold(g,s.load||'sack','head'); continue; }
      if(job==='play'){ const c=pos(s.at), R=s.r||3; let p=null; for(let t=0;t<20&&!p;t++){ const a=r()*6.28, d=r()*R, x=c[0]+Math.cos(a)*d, z=c[1]+Math.sin(a)*d; if(clear(x,z,3)) p=[x,z]; }
        if(!p) continue; const g=person(s,{child:true,woman:r()<0.4}); add(g,p[0],p[1],r()*6.28,{job,c,R,sp:2.0+r()*0.8,state:'pause'}); continue; }
      if(job==='herd'){ const c=pos(s.at); if(!clear(c[0],c[1],2.5)) continue; const g=person(s,{woman:false,staff:true}); add(g,c[0],c[1],r()*6.28,{job,c,R:s.r||5,sp:0.6,state:'pause'}); continue; }
      if(job==='talk'){ const c=pos(s.at); if(!clear(c[0],c[1],3.5)) break; const m=Math.max(2,s.n||2);
        for(let j=0;j<m&&ctx.folk.length<MAX;j++){ const a=j/m*6.28+r()*0.4, x=c[0]+Math.cos(a)*0.62, z=c[1]+Math.sin(a)*0.62;
          const g=person(s,{}), F=add(g,x,z,Math.atan2(c[0]-x,c[1]-z),{job,turn:j,m}); }
        break; }
      if(job==='plough'){ const A=pos(s.from), B=pos(s.to); if(!clear(A[0],A[1],3)) break;
        const g=person(s,{woman:false}), F=add(g,A[0],A[1],Math.atan2(B[0]-A[0],B[1]-A[1]),{job,A,B,state:'to',sp:0.5});
        const pl=W.prop('plough'); g.add(pl); pl.position.set(0,0,0.25); F.prop=pl;
        if(W.donkeyFree){ F.beast=W.donkeyFree(ctx,A[0],A[1],'ox'); F.beastAhead=2.75; }
        break; }
      /* one at their work in one place */
      const c=pos(s.at), jx=i?(r()-0.5)*1.6:0, jz=i?(r()-0.5)*1.6:0, x=c[0]+jx, z=c[1]+jz;
      if(!clear(x,z,3)) continue;
      const seated=job==='grind'||job==='mend'||job==='wash'||(job==='spin'&&r()<0.6)||(job==='hammer'&&r()<0.5);
      /* the thing worked at stands clear of the knees: the mill, the net, the washing, the stall */
      const PD={grind:0.95,mend:1.05,wash:0.9,pick:0.6,sell:0.95}[job]||0, PR={grind:0.42,mend:0.62,wash:0.4,pick:0.3,sell:0.95}[job]||0;
      if(PD){ const f0=s.face!==undefined?s.face:0, px=x+Math.sin(f0)*PD, pz=z+Math.cos(f0)*PD;
        if(!room(px,pz,Math.min(0.5,PR))) continue; }
      const g=person(s,{woman:job==='grind'||job==='spin'||job==='wash'?r()<0.9:job==='mend'||job==='hoe'||job==='hammer'||job==='reap'?r()<0.15:undefined});
      const face=s.face!==undefined?s.face+(r()-0.5)*0.4:r()*6.28, F=add(g,x,z,face,{job,c:[x,z],seated});
      if(seated) g.userData.sit=true;
      const fwd=(d)=>[Math.sin(face)*d,Math.cos(face)*d];
      const ground=(kind,d)=>{ const p=W.prop(kind), f=fwd(d); p.position.set(x+f[0],ctx.groundY(x+f[0],z+f[1])||0,z+f[1]); p.rotation.y=face; ctx.scene.add(p); return p; };
      const solid=(d,rr)=>{ const f=fwd(d); ctx.folkSolids.push([x+f[0],z+f[1],rr]); };
      ctx.folkSolids.push([x,z,seated?0.55:0.35]);                                         /* (the worker, sitting, takes room too) */
      if(job==='grind'){ ground('quern',0.95); solid(0.95,0.42); } else if(job==='mend'){ ground('net',1.05); solid(1.05,0.62); } else if(job==='wash'){ ground('wash',0.9); solid(0.9,0.4); }
      else if(job==='sweep') F.prop=hold(g,'broom'); else if(job==='hoe') F.prop=hold(g,'hoe'); else if(job==='reap') F.prop=hold(g,'sickle'); else if(job==='hammer') F.prop=hold(g,'hammer');
      else if(job==='spin') F.prop=hold(g,'spindle'); else if(job==='pick'){ ground('basket',0.6); solid(0.6,0.3); }
      else if(job==='sell'){ const f=fwd(0.95); W.stall(ctx,x+f[0],z+f[1],face+Math.PI,s.goods); solid(0.95,0.95); }
    }
  }
}
/* the next step of one of them toward [x,z]: round a wall, aside for a person in the way; false when there */
function folkStep(F,to,dt){
  const g=F.g, u=g.userData, dx=to[0]-g.position.x, dz=to[1]-g.position.z, d=Math.hypot(dx,dz);
  if(d<0.2) return false;
  let a=Math.atan2(dx,dz);
  /* someone in the way (one of the story's people, or the witness): go round them, or wait */
  let block=null; const look=(o)=>{ if(!o||!o.visible) return; const ox=o.position.x-g.position.x, oz=o.position.z-g.position.z, od=Math.hypot(ox,oz);
      if(od<1.5&&(ox*Math.sin(a)+oz*Math.cos(a))>0) block=block&&block.d<od?block:{d:od,ox,oz}; };
  for(const id in ctx.actors) look(ctx.actors[id]); if(!ctx.playerHidden) look(player);
  if(block){ const side=(block.ox*Math.cos(a)-block.oz*Math.sin(a))>0?-1:1; a+=side*1.1; F.stuck=(F.stuck||0)+dt; }
  /* the way ahead is free when the body — its middle and both shoulders — would stand clear of
     the world's blocks, of the other townsfolk and of the mills, nets and tables they work at */
  const free=(b)=>{ const fx=Math.sin(b), fz=Math.cos(b), px=g.position.x+fx*0.5, pz=g.position.z+fz*0.5, sx=fz*0.3, sz=-fx*0.3;
    if(wallAt(px,pz,u.gy)||wallAt(px+sx,pz+sz,u.gy)||wallAt(px-sx,pz-sz,u.gy)) return false;
    if(hullCross(g.position.x,g.position.z,px,pz,true)) return false;                         /* nor through a boat */
    if(softAt(px,pz,u.gy,0.25,g,to)) return false;                                            /* nor a table, one sitting, the multitude */
    for(const q of ctx.folkSolids||[]) if(Math.hypot(q[0]-px,q[1]-pz)<q[2]+0.3&&Math.hypot(q[0]-g.position.x,q[1]-g.position.z)>q[2]+0.05) return false;
    for(const O of ctx.folk) if(O!==F&&Math.hypot(O.g.position.x-px,O.g.position.z-pz)<0.62) return false;
    return true; };
  /* come up against the very thing gone to — a well's curb, a table — near enough: there */
  if(d<0.95&&!free(Math.atan2(dx,dz))){ F.near=null; return false; }
  if(!free(a)){
    let ok=false; for(const da of [0.5,-0.5,1.0,-1.0,1.5,-1.5,2.1,-2.1]){ const b=a+da; if(free(b)){ a=b; ok=true; break; } }
    if(!ok){ F.stuck=(F.stuck||0)+dt; return true; } }
  /* and one going round and round a thing without coming nearer is stuck, not going */
  if(!F.near||F.near.to!==to||d<F.near.d-0.15){ F.near={to,d,t:0}; } else { F.near.t+=dt; if(F.near.t>4){ F.stuck=(F.stuck||0)+F.near.t; F.near=null; return false; } }
  const sp=Math.min(d,F.sp*dt);
  g.position.x+=Math.sin(a)*sp; g.position.z+=Math.cos(a)*sp; g.rotation.y=turnTo(g.rotation.y,a,dt*6);
  u.gy=stepGround(g.position.x,g.position.z,u.gy); g.position.y=u.gy;
  return true; }
function folkTick(dt){
  if(!ctx.folk||!ctx.folk.length) return;
  const T=(ctx._folkT=(ctx._folkT||0)+dt);
  for(const F of ctx.folk){ const g=F.g, u=g.userData; F.t-=dt; let moving=false;
    const far=()=>{ const c=camera.position; return Math.hypot(c.x-g.position.x,c.z-g.position.z)>70; };
    if(F.job==='walk'){
      if(F.t>0){ /* resting at the end of the way */ }
      else { const to=F.P[F.i]; moving=folkStep(F,to,dt);
        if(!moving||(F.stuck||0)>5){ F.stuck=0;
          const nx=F.i+F.dir; if(nx<0||nx>=F.P.length){ F.dir=-F.dir; F.t=2+Math.random()*5; } F.i=Math.max(0,Math.min(F.P.length-1,F.i+F.dir)); } } }
    else if(F.job==='stroll'||F.job==='play'||F.job==='herd'){
      if(F.state==='pause'){ if(F.t<=0){ let p=null;
          for(let t=0;t<12&&!p;t++){ let x,z; if(F.A){ x=F.A[0]+Math.random()*(F.A[2]-F.A[0]); z=F.A[1]+Math.random()*(F.A[3]-F.A[1]); }
            else { const a=Math.random()*6.28, dd=Math.random()*F.R; x=F.c[0]+Math.cos(a)*dd; z=F.c[1]+Math.sin(a)*dd; }
            const gy=ctx.groundY(x,z); if(!wallAt(x,z,gy)&&!wetAt(x,z,gy+0.2)&&!softAt(x,z,gy,0.3,g,null)) p=[x,z]; }
          if(p){ F.to=p; F.state='go'; F.stuck=0; } else F.t=2; } }
      else { moving=folkStep(F,F.to,dt); if(!moving||(F.stuck||0)>4){ F.state='pause'; F.t=F.job==='play'?0.4+Math.random()*1.2:F.job==='herd'?3+Math.random()*5:3+Math.random()*7; } } }
    else if(F.job==='water'){
      if(F.state==='down'){ moving=folkStep(F,F.S,dt); if(!moving||(F.stuck||0)>8){ F.state='fill'; F.t=3+Math.random()*3; F.stuck=0; } }
      else if(F.state==='fill'){ if(F.t<=0){ F.state='up'; F.home=F.H[Math.floor(Math.random()*F.H.length)]; } }
      else if(F.state==='up'){ moving=folkStep(F,F.home,dt); if(!moving||(F.stuck||0)>8){ F.state='home'; F.t=4+Math.random()*6; F.stuck=0; } }
      else if(F.state==='home'){ if(F.t<=0) F.state='down'; }
      const full=F.state==='up'||F.state==='home'; F.jarH.visible=full; F.jarA.visible=!full; }
    else if(F.job==='carry'){
      const to=F.state==='to'?F.B:F.A;
      if(F.t<=0){ moving=folkStep(F,to,dt); if(!moving||(F.stuck||0)>8){ F.state=F.state==='to'?'back':'to'; F.t=3+Math.random()*4; F.stuck=0; F.load.visible=F.state==='to'; } } }
    else if(F.job==='plough'){
      const to=F.state==='to'?F.B:F.A; moving=folkStep(F,to,dt);
      if(!moving){ F.state=F.state==='to'?'back':'to'; F.t=1.5; }
      if(F.beast){ const b=F.beast, a=g.rotation.y; b.position.set(g.position.x+Math.sin(a)*F.beastAhead,ctx.groundY(g.position.x+Math.sin(a)*F.beastAhead,g.position.z+Math.cos(a)*F.beastAhead)||g.position.y,g.position.z+Math.cos(a)*F.beastAhead); b.rotation.y=a;
        if(b.children[0]&&K().tickGait){ b.userData.ent=b.userData.ent||{m:b.children[0]}; K().tickGait(b.userData.ent,'ox',moving?F.sp*S:0,dt); } } }
    if(F.beast&&F.job==='walk'){ const b=F.beast, a=g.rotation.y, bx=g.position.x-Math.sin(a)*1.5, bz=g.position.z-Math.cos(a)*1.5, dd=Math.hypot(bx-b.position.x,bz-b.position.z);
      if(dd>0.05){ b.position.x+=(bx-b.position.x)*Math.min(1,dt*3); b.position.z+=(bz-b.position.z)*Math.min(1,dt*3); b.rotation.y=turnTo(b.rotation.y,Math.atan2(bx-b.position.x,bz-b.position.z)||a,dt*4); }
      b.position.y=ctx.groundY(b.position.x,b.position.z)||0;
      if(b.children[0]&&K().tickGait){ b.userData.ent=b.userData.ent||{m:b.children[0]}; K().tickGait(b.userData.ent,F.beastKind||'donkey',moving?F.sp*S:0,dt); } }
    if(!moving&&!u.sit) g.position.y=u.gy;
    if(u.sit) g.position.y=u.gy-sitDrop(u);
    if(far()) continue;                           /* far off, the hands need not be worked */
    animFigure(g,dt,moving);
    /* AND THE HANDS AT THEIR WORK */
    const w=T*1+F.ph, A=u.armR, L=u.armL; if(!A||!L) continue;
    const E=x=>x&&x.userData.elbow;
    let bend=0, knees=0;                                     /* how far forward at the waist the work bends them; how far the knees give */
    if(F.job==='water'&&(F.state==='up'||F.state==='home')){ A.rotation.x=-2.25; A.rotation.z=-0.55; if(E(A)) E(A).rotation.x=-1.05; }   /* the hand up to the jar's side, the elbow out */
    else if((F.job==='carry'||F.job==='walk'||F.job==='stroll')&&F.load&&F.load.visible){ L.rotation.x=-2.55; L.rotation.z=-0.42; if(E(L)) E(L).rotation.x=-1.25; }
    else if(F.job==='water'&&F.state==='down'){ A.rotation.x=-0.15; A.rotation.z=-0.12; if(E(A)) E(A).rotation.x=-0.25; }   /* the empty jar swung at the hip */
    else if(F.job==='water'&&F.state==='fill'){ bend=0.7; knees=0.55; A.rotation.x=L.rotation.x=-1.35+Math.sin(w*2)*0.12; }   /* down on her knees at the spring, dipping the jar */
    else if(F.job==='grind'){ const s=Math.sin(w*2.6); bend=0.32+s*0.14;                 /* rocking over the stone as she pushes it round */
      A.rotation.x=L.rotation.x=-1.0+s*0.25; if(E(A)) E(A).rotation.x=E(L).rotation.x=-0.3-s*0.25; }
    else if(F.job==='mend'){ bend=0.42; A.rotation.x=-1.05+Math.sin(w*3.1)*0.12; L.rotation.x=-0.95+Math.sin(w*2.3)*0.1; if(E(A)) E(A).rotation.x=-0.7; }
    else if(F.job==='spin'){ bend=0.08; L.rotation.x=-1.9; L.rotation.z=0.3; A.rotation.x=-0.6+Math.sin(w*4)*0.08; }
    else if(F.job==='wash'){ const s=Math.sin(w*3); bend=0.6+s*0.08; A.rotation.x=L.rotation.x=-1.3+s*0.25; }   /* bent over the washing, scrubbing */
    else if(F.job==='sweep'){ const s=Math.sin(w*2.2); bend=0.32; knees=0.15; A.rotation.x=-0.75; L.rotation.x=-0.85; A.rotation.z=s*0.35; L.rotation.z=s*0.3; }
    else if(F.job==='hoe'){ const ph=(w*0.32)%1, up=ph<0.55?ph/0.55:1-(ph-0.55)/0.45, s=up*up*(3-2*up);   /* raised slowly over the shoulder, brought down hard */
      bend=0.25+(1-s)*0.5; knees=0.22;
      A.rotation.x=L.rotation.x=-0.55-s*2.15; if(E(A)) E(A).rotation.x=E(L).rotation.x=-0.15-0.35*s; }
    else if(F.job==='reap'){ const s=Math.sin(w*2.4); bend=1.0+s*0.08; knees=0.32;         /* bent deep at the waist over the ears, knees given, the sickle sweeping low */
      A.rotation.x=-1.35+s*0.25; A.rotation.z=s*0.45; L.rotation.x=-1.2+Math.max(0,-s)*0.2; L.rotation.z=0.15; if(E(L)) E(L).rotation.x=-0.5; }
    else if(F.job==='hammer'){ const s=Math.max(0,Math.sin(w*4.2)); bend=0.22; A.rotation.x=-0.7-s*1.3; L.rotation.x=-0.8; }
    else if(F.job==='pick'){ const s=Math.sin(w*1.4); bend=-0.08;                         /* reaching up into the tree, leaning back a little */
      A.rotation.x=-2.7+s*0.3; L.rotation.x=-2.3-s*0.3; }
    else if(F.job==='sell'||F.job==='talk'){ const turn=F.job==='talk'?((Math.floor(T/4)%F.m)===F.turn):Math.sin(w*0.3)>0.6;
      u.talkM=turn?0.4+Math.sin(T*7+F.ph)*0.3:undefined; if(u.setFace) u.setFace(turn&&Math.sin(T*11+F.ph)>0?0.5:0,false,'calm'); }
    else if(F.job==='herd'&&E(A)){ const st=moving?Math.sin(u.phase||0):0;                 /* the staff set down ahead with each other step, held upright, its crook forward */
      A.rotation.x=-0.42-st*0.18; A.rotation.z=-0.08; E(A).rotation.x=-A.rotation.x+0.1; bend=moving?0.06:0.02; }
    else if(F.job==='plough'){ bend=0.3; A.rotation.x=L.rotation.x=-0.55; A.rotation.z=-0.1; L.rotation.z=0.1; if(E(A)) E(A).rotation.x=E(L).rotation.x=-0.35; }   /* bent to the handle, both hands on it, pressing the share in */
    if(u.waist){ u.waist.rotation.x+=(bend-u.waist.rotation.x)*Math.min(1,dt*6);
      const onHead=(F.jarH&&F.jarH.visible)||(F.load&&F.load.visible&&F.load.parent===u.head);
      if(u.head&&!u.holy) u.head.rotation.x=onHead?-u.waist.rotation.x:-Math.max(0,u.waist.rotation.x)*0.32; }   /* the head kept up a little, looking at the work — and level under a load */
    if(knees&&!u.sit&&u.legL){ for(const Lg of [u.legL,u.legR]){ Lg.rotation.x=-knees*0.7; if(Lg.userData.knee) Lg.userData.knee.rotation.x=knees*1.4; }
      g.position.y=(u.fixedY!==undefined?u.fixedY:u.gy)-knees*0.12; }   /* (on what he is held on — a boat, a vision's floor — not the ground under it) */                                                       /* the knees given, the body let down on them */
  }
}
function pos(at){ if(typeof at==='string'){ const m=ctx.markers[at]; if(m) return m;
    const g=ctx.actors[at]||ctx.things[at]; if(g) return [g.position.x,g.position.z];   /* a person or a thing: where they are now */
    throw new Error('no marker '+at); }
  /* ALONG A LINE BETWEEN TWO MARKS: ['holyPlace>porchFront', a, s] — `a` metres from the first
     toward the second (or, with a fourth 'f', that fraction of the way), and `s` metres to the
     right of that line. A place written so stands the same in any city whichever way her
     buildings are turned: in the small city the House runs north and south, in the true one
     east and west, and a throne written 'at the far end of the holy place' is there in both. */
  if(Array.isArray(at)&&typeof at[0]==='string'&&at[0].indexOf('>')>0){ const [na,nb]=at[0].split('>'), A0=pos(na), B0=pos(nb);
    const dx=B0[0]-A0[0], dz=B0[1]-A0[1], L=Math.hypot(dx,dz)||1, ux=dx/L, uz=dz/L, a=at[3]==='f'?(at[1]||0)*L:(at[1]||0), sd=at[2]||0;
    return [A0[0]+ux*a-uz*sd, A0[1]+uz*a+ux*sd]; }
  /* a marker and a step from it: ['pinnacle',1.6,-0.7] */
  if(Array.isArray(at)&&typeof at[0]==='string'){ const m=pos(at[0]); return [m[0]+at[1],m[1]+at[2]]; }
  if(Array.isArray(at)&&at.length===2&&typeof at[0]==='number') return remapXZ(at);
  return at; }
/* a place written about the small city, where it stands in the true one (see buildScene) */
/* WHERE A PLACE WRITTEN ABOUT THE SMALL CITY STANDS IN THE TRUE ONE.
   It goes with the mark it was written beside — the one nearest it, unless the mark the scene is
   anchored on is about as near (in the small city the gate and the house of the taught ones stand
   sixteen metres apart; in the true one four hundred and seventy, and a man written between them
   must not be thrown across the city). And a place written BETWEEN two marks — a stone on the road
   from the gate to the upper pool — is set the same part of the way between them in the true city,
   so long as the two stand at much the same distance apart in both (not stretched more than
   fourfold); else it keeps to its one mark. Far from every mark (sixty metres) it keeps to the
   scene's anchor. */
function remapXZ(p){ const R=ctx&&ctx.remap; if(!R) return p;
  const dist=r=>Math.hypot(p[0]-r.s[0],p[1]-r.s[1]);
  let m1=null, d1=1e9; for(const r of R){ const d=dist(r); if(d<d1){ d1=d; m1=r; } }
  const home=R.find(r=>r.home);
  if(home&&dist(home)<=1.5*d1){ m1=home; d1=dist(home); }
  if(!m1||d1>60) return p;
  let m2=null, t2=0, bp=1e9;
  for(const r of R){ if(r===m1) continue;
    const ex=r.s[0]-m1.s[0], ez=r.s[1]-m1.s[1], Ls=Math.hypot(ex,ez); if(Ls<1) continue;
    const Lt=Math.hypot(r.t[0]-m1.t[0],r.t[1]-m1.t[1]); if(Lt>Ls*4||Lt<Ls/4) continue;
    const vx=p[0]-m1.s[0], vz=p[1]-m1.s[1], t=(vx*ex+vz*ez)/(Ls*Ls); if(t<=0.02||t>1.2) continue;
    const perp=Math.abs(vx*ez-vz*ex)/Ls; if(perp>Math.max(8,0.5*Ls)) continue;
    if(perp<bp){ bp=perp; m2=r; t2=Math.min(1,t); } }
  let d=m1.d;
  if(m2) d=[m1.d[0]+(m2.d[0]-m1.d[0])*t2,m1.d[1]+(m2.d[1]-m1.d[1])*t2];
  else if(d1>25&&!m1.home) return p;
  return [p[0]+d[0],p[1]+d[1]]; }
/* (and its height, written over the small city's level ground, is over the true one's ground where it now
   stands: the eye on the highway to the upper pool was set four metres up from the gate's street, and the
   pool is ten metres higher up the hill — it looked at the sovereign from inside the hillside) */
/* (so too a scene set down whole at its own place in the true city, `trueAt`: written over the small
   city's courts, three metres up on their platform, its eye looked over every head in the true ones) */
function remap3(p){ if(!ctx||!Array.isArray(p)||p.length!==3||typeof p[0]!=='number') return p;
  const A=ctx.anchor; if(!ctx.remap&&!(A&&A.byMark===false&&A.markOff&&ctx.trueEarth)) return p;
  const q=ctx.remap?remapXZ([p[0],p[2]]):[p[0],p[2]], g=ctx.groundY(q[0],q[1]);
  let g0=0; for(const P of _smallPlats[ctx.anchor&&ctx.anchor.period||ctx.period||'kings']||[]) if(p[0]>=P[0]&&p[0]<=P[2]&&p[2]>=P[1]&&p[2]<=P[3]) g0=Math.max(g0,P[4]);
  return [q[0],p[1]-g0+(isFinite(g)?g:0),q[1]]; }
/* a height given as a marker's (the city's 'pinnacleY'), or as metres */
/* (a height named by a mark the city does not have — her wall's top, which the true city's walls give
   course by course on the hill and no one number can — is no height: he stands on the floor there) */
function yOf(y){ if(typeof y!=='string') return y; const m=ctx.markers[y]; return m?m[0]:undefined; }
/* a way to face: a bearing, or a place (a mark, a person, a thing) to face toward from `p` — the gate's
   outside is north in one city and south in the other, and a man on her wall looks out of it in both */
function faceOf(f,p){ if(f===undefined) return 0; if(typeof f==='number') return f;
  const q=f==='player'&&player?[player.position.x,player.position.z]:(ctx.actors[f]||ctx.things[f])?thingPos(f):pos(f);
  return Math.atan2(q[0]-p[0],q[1]-p[1]); }
function thingPos(id){ const o=ctx.things[id]||ctx.actors[id]; return o?[o.position.x,o.position.z]:null; }

/* a name floating over a head, shown near or while speaking — a fixed size
   on screen, so it reads the same from across the field or at arm's length */
function makeLabel(name,g){
  const cv=document.createElement('canvas'); cv.width=256; cv.height=48; const c=cv.getContext('2d');
  c.font='600 26px Georgia, serif'; c.textAlign='center'; c.fillStyle='rgba(12,9,6,0.55)';
  const w=Math.min(250,c.measureText(name).width+22); c.fillRect(128-w/2,6,w,36);
  c.fillStyle='#f3e3b3'; c.fillText(name,128,33);
  const sp=new THREE.Sprite(new THREE.SpriteMaterial({map:new THREE.CanvasTexture(cv),transparent:true,depthTest:false,sizeAttenuation:false}));
  sp.scale.set(0.24/S,0.045/S,1); sp.position.set(0,2.4,0);   /* the scene's root is scaled by S: undone, so a name is the same size on the screen */ sp.visible=false; sp.renderOrder=10; g.add(sp); return sp;
}

/* ================= THE PLAYER, THE CAMERA, THE HAND ================= */
let player=null, camYaw=0, camPitch=0.32, camDist=7.5, camTarget=null, camT=0;
const keys={};
let joy={x:0,y:0,active:false}, actHeld=false, actPressed=false;
/* The keys are the story's. They are taken at the window before the voyage's own hands see
   them, so W walks the witness and never the voyage's traveller, and E lays a hand on what the
   scene asks and never breaks a block of the world. */
window.addEventListener('keydown',e=>{ e.stopImmediatePropagation(); keys[e.code]=true;
  if(e.code==='KeyE'||e.code==='KeyF'){ if(!actHeld) actPressed=true; actHeld=true; }
  if(e.code==='Enter'||e.code==='Space'){ advance(); e.preventDefault(); }
  if(e.code==='KeyJ') toggleCodex();
  if(e.code==='KeyV') toggleVoice();
  if(e.code==='Escape') closePanels(); },true);
window.addEventListener('keyup',e=>{ e.stopImmediatePropagation(); keys[e.code]=false; if(e.code==='KeyE'||e.code==='KeyF') actHeld=false; },true);
function wireInput(){
  const gl=$('gl'); let drag=null;
  gl.addEventListener('pointerdown',e=>{ if(e.pointerType==='touch'&&e.clientX<window.innerWidth*0.4) return; drag={x:e.clientX,y:e.clientY}; });
  window.addEventListener('pointermove',e=>{ if(!drag) return; camYaw-=(e.clientX-drag.x)*0.006; camPitch=Math.max(0.05,Math.min(1.1,camPitch+(e.clientY-drag.y)*0.004)); drag={x:e.clientX,y:e.clientY}; });
  window.addEventListener('pointerup',()=>{ drag=null; });
  gl.addEventListener('wheel',e=>{ camDist=Math.max(3.5,Math.min(16,camDist+e.deltaY*0.01)); },{passive:true});
  /* the touch stick, bottom left */
  const pad=$('sjoy'), knob=$('knob'); let jid=null, c0=null;
  pad.addEventListener('pointerdown',e=>{ jid=e.pointerId; const r=pad.getBoundingClientRect(); c0=[r.left+r.width/2,r.top+r.height/2]; joy.active=true; pad.setPointerCapture(jid); moveJoy(e); });
  pad.addEventListener('pointermove',e=>{ if(e.pointerId===jid) moveJoy(e); });
  const endJ=()=>{ jid=null; joy={x:0,y:0,active:false}; knob.style.transform=''; };
  pad.addEventListener('pointerup',endJ); pad.addEventListener('pointercancel',endJ);
  function moveJoy(e){ let dx=e.clientX-c0[0], dy=e.clientY-c0[1]; const L=Math.hypot(dx,dy), m=46;
    if(L>m){ dx*=m/L; dy*=m/L; } joy.x=dx/m; joy.y=dy/m; knob.style.transform='translate('+dx+'px,'+dy+'px)'; }
  const ab=$('actbtn');
  ab.addEventListener('pointerdown',e=>{ actPressed=true; actHeld=true; e.preventDefault(); });
  ab.addEventListener('pointerup',()=>{ actHeld=false; }); ab.addEventListener('pointerleave',()=>{ actHeld=false; });
  $('sverse').addEventListener('click',advance); $('card').addEventListener('click',advance); $('eras').addEventListener('click',advance);
  $('b-codex').addEventListener('click',toggleCodex);
  $('b-voice').addEventListener('click',toggleVoice); $('b-voice').style.opacity=SV.on?'1':'0.45'; $('b-hub').addEventListener('click',()=>{ stopAct(); showHub(); });
}
function blocked(x,z,r,y){
  const b=ctx.bounds; if(b&&(x<b.x0||x>b.x1||z<b.z0||z>b.z1)) return true;
  for(const [dx,dz] of [[r,r],[r,-r],[-r,r],[-r,-r]]) if(solidFor(x+dx,z+dz,y)) return true;
  return false;
}
/* ================= THE WAY SHOWN =================
   A mark the player cannot find his way to is a story that cannot be finished. When he has been
   pressing on for five seconds and come no nearer (a wall, a bank too high, a house in the way),
   the way round is worked out — a walk over the same ground by the same rules his feet keep — and
   he is led along it. If there is no way at all, he is set down at the mark. The playtest
   (ST.playtest) is led the same way from the first, so every mark it reaches a man could reach. */
let guide=null, stuckT=0, stuckAt=null;
function guideGoal(){ const B=beat; if(!B||!player) return null;
  if(B.t==='goal'){ const m=pos(B.goto); return [m[0],m[1],(B.r||2.4)*0.6]; }
  if(B.t==='witness'&&witness){ const W=witness;
    if(W.carrying){ const m=pos(B.deliver); return [m[0],m[1],(B.r||3)*0.6]; }
    let best=null, bd=1e9;
    for(const id of B.items){ if(W.done.has(id)) continue; const p=thingPos(id); if(!p) continue;
      const d=Math.hypot(player.position.x-p[0],player.position.z-p[1]); if(d<bd){ bd=d; best=p; } }
    if(best) return [best[0],best[1],(B.reach||2.2)*0.6]; }
  return null; }
/* a walk from where he stands to within r of (tx,tz), on a half-metre grid: a cell is entered as
   movePlayer would enter it (blocked, the hull of a boat), and stood in at the ground it has */
let lastPlan=null;
function planWay(tx,tz,r,from,noAvoid,hard){
  const F=from||player.position;
  /* (a long way across a city is walked on a coarser grid: a street is wider than a metre) */
  const H=Math.hypot(tx-F.x,tz-F.z)>90?1.0:0.5, sx=F.x, sz=F.z, sy=F.y;
  r=Math.max(r,H*0.75);
  const deck=!from&&ctx.playerY!==undefined;          /* the witness held at a deck's height walks her deck */
  const b=ctx.bounds, pad=Math.max(30,Math.hypot(tx-F.x,tz-F.z)*0.25);   /* (a long way may have to go well round) */
  const x0=Math.max(b?b.x0:-1e9,Math.min(sx,tx)-pad), x1=Math.min(b?b.x1:1e9,Math.max(sx,tx)+pad);
  const z0=Math.max(b?b.z0:-1e9,Math.min(sz,tz)-pad), z1=Math.min(b?b.z1:1e9,Math.max(sz,tz)+pad);
  const key=(i,j)=>i+','+j, seen=new Map();
  /* a binary heap of [f,key] */
  const open={a:[],get length(){ return this.a.length; },
    push(e){ const a=this.a; a.push(e); let i=a.length-1; while(i>0){ const p=(i-1)>>1; if(a[p][0]<=e[0]) break; a[i]=a[p]; i=p; } a[i]=e; },
    pop(){ const a=this.a, top=a[0], last=a.pop(); if(a.length){ let i=0; for(;;){ let c=2*i+1; if(c>=a.length) break; if(c+1<a.length&&a[c+1][0]<a[c][0]) c++; if(a[c][0]>=last[0]) break; a[i]=a[c]; i=c; } a[i]=last; } return top; } };
  let si=Math.round(sx/H), sj=Math.round(sz/H);
  /* (one pressed into a corner, his own spot within a hand of a wall, starts from the nearest spot clear
     of it — the way was never found from where he stood, and he was carried to his mark) */
  if(blocked(si*H,sj*H,0.3,sy)){ let bd=1e9, bi=si, bj=sj;
    for(let di=-3;di<=3;di++) for(let dj=-3;dj<=3;dj++){ const d=di*di+dj*dj; if(d<bd&&!blocked((si+di)*H,(sj+dj)*H,0.3,sy)){ bd=d; bi=si+di; bj=sj+dj; } }
    si=bi; sj=bj; }
  const hOf=(i,j)=>Math.hypot(i*H-tx,j*H-tz);
  /* (one of the scene's people sent to his mark goes round those already standing at theirs — a soldier's
     way to the foot of the spur went through the centurion, and a man at rest does not give way to one
     walking: he was held there, and carried. Not those about his own mark, and if that leaves no way, the
     way is found as before.) */
  const rest=[]; if(from&&!noAvoid) for(const id in ctx.actors){ const g=ctx.actors[id], u=g.userData;
    if(!g.visible||u.target||u.follow||u.aboard||u.ride||u.fixedY!==undefined) continue;
    if(!hard&&(u.sit||u.lie||u.kneel)) continue;                                         /* (one sitting or lying is gone round by his own shape, below) */
    const px=g.position.x, pz=g.position.z; if(Math.hypot(px-sx,pz-sz)<0.6||Math.hypot(px-tx,pz-tz)<1.0) continue;
    rest.push([px,pz]); }
  const byRest=(x,z)=>{ for(const q of rest) if((x-q[0])*(x-q[0])+(z-q[1])*(z-q[1])<0.36) return true; return false; };
  /* (and round a table, one sitting, the multitude — the witness a little wider than his feet keep them, so the
     way he is led does not brush them — unless there is no way but through them: then it is found as before) */
  const me=from?from.g||null:player, goal=[tx,tz], sr=from?0.25:0.3, sm=new Map();
  const soft=(i,j,y)=>{ if(hard) return false; const k2=key(i,j); let v=sm.get(k2); if(v===undefined){ v=softAt(i*H,j*H,y,sr,me,goal,15); sm.set(k2,v); } return v; };
  seen.set(key(si,sj),{i:si,j:sj,y:sy,g:0,from:null,shut:false}); open.push([hOf(si,sj),key(si,sj)]);
  let n=0, end=null;
  while(open.length&&n<150000){
    const ck=open.pop()[1];
    const C=seen.get(ck); if(C.shut) continue; C.shut=true; n++;
    if(hOf(C.i,C.j)<r){ end=C; break; }
    const cx=C.i*H, cz=C.j*H;
    for(const [di,dj] of [[1,0],[-1,0],[0,1],[0,-1],[1,1],[1,-1],[-1,1],[-1,-1]]){
      const ni=C.i+di, nj=C.j+dj, nx=ni*H, nz=nj*H; if(nx<x0||nx>x1||nz<z0||nz>z1) continue;
      const nk=key(ni,nj); const N0=seen.get(nk); if(N0&&N0.shut) continue;
      if(blocked(nx,nz,0.3,C.y)||hullCross(cx,cz,nx,nz,deck)||(rest.length&&byRest(nx,nz))||soft(ni,nj,C.y)) continue;
      if(di&&dj&&(blocked(cx+di*H,cz,0.3,C.y)||blocked(cx,cz+dj*H,0.3,C.y)||soft(C.i+di,C.j,C.y)||soft(C.i,C.j+dj,C.y))) continue;
      const gy=deck?ctx.playerY:ctx.groundY(nx,nz,C.y+CLIMB_REF); if(gy===null||gy===undefined||!isFinite(gy)) continue;
      /* (no higher a step than a man takes, and no cliff dropped: a way that read the top of a door's
         jamb as ground went on along the wall-tops and the roofs, and those sent by it fell off them) */
      if(!deck&&(gy>C.y+CLIMB_M||gy<C.y-2.4)) continue;
      const g=C.g+(di&&dj?1.414:1)+(gy>C.y+0.3?0.6:0);
      if(!N0||g<N0.g){ seen.set(nk,{i:ni,j:nj,y:gy,g,from:ck,shut:false}); open.push([g+hOf(ni,nj)/H,nk]); } } }
  lastPlan={from:[+sx.toFixed(1),+sy.toFixed(1),+sz.toFixed(1)],to:[+tx.toFixed(1),+tz.toFixed(1)],n,box:[Math.round(x0),Math.round(z0),Math.round(x1),Math.round(z1)]};
  if(!end) return rest.length?planWay(tx,tz,r,from,true,hard):hard?null:planWay(tx,tz,r,from,noAvoid,true);
  const pts=[]; for(let c=end;c;c=c.from?seen.get(c.from):null) pts.push([c.i*H,c.j*H]);
  pts.reverse(); pts.push([tx,tz]); if(hard) pts.hard=true; return pts; }
function setOnMark(G,why){
  const x=G[0], z=G[1];
  player.position.set(x,ctx.groundY(x,z),z); guide=null; stuckT=0;
  (ST.stuck=ST.stuck||[]).push({who:'player',act:act&&act.id,scene:act&&act.scenes[sceneIx]&&act.scenes[sceneIx].id,beat:beatIx,why,plan:lastPlan});
  if(!ST.playtest) toast('There was no way through — you are brought to the place.'); }
function startGuide(quiet){
  const G=guideGoal(); if(!G) return false;
  const pts=planWay(G[0],G[1],Math.max(0.4,G[2]));
  if(!pts){ setOnMark(G,'no way'); return true; }
  guide={pts,i:0,G,t:0,best:1e9,bt:0,replans:0};
  if(!quiet&&!ST.playtest) toast('The way round is found — you are led to the place.');
  return true; }
/* the bearing to walk this frame, or null when not led */
function guideSteer(dt){
  if(!guide) return null;
  const G=guideGoal(); if(!G||Math.hypot(G[0]-guide.G[0],G[1]-guide.G[1])>1.5){ guide=null; return null; }   /* the mark moved or was reached */
  const P=player.position;
  while(guide.i<guide.pts.length-1&&Math.hypot(guide.pts[guide.i][0]-P.x,guide.pts[guide.i][1]-P.z)<0.35) guide.i++;
  const w=guide.pts[guide.i], d=Math.hypot(G[0]-P.x,G[1]-P.z);
  guide.t+=dt; if(d<guide.best-0.2){ guide.best=d; guide.bt=0; } else guide.bt+=dt;
  if(guide.bt>4){ if(++guide.replans>2){ setOnMark(G,'led, and held'); return null; }
    const pts=planWay(G[0],G[1],Math.max(0.4,G[2])); if(!pts){ setOnMark(G,'no way'); return null; }
    guide.pts=pts; guide.i=0; guide.bt=0; }
  return Math.atan2(w[0]-P.x,w[1]-P.z); }
function movePlayer(dt){
  if(!player||ctx.playerHidden) return;
  let fx=0, fz=0;
  if(controlsOn&&!ctx.playerLock){
    if(keys.KeyW||keys.ArrowUp) fz+=1; if(keys.KeyS||keys.ArrowDown) fz-=1;
    if(keys.KeyA||keys.ArrowLeft) fx-=1; if(keys.KeyD||keys.ArrowRight) fx+=1;
    if(joy.active){ fx+=joy.x; fz-=joy.y; } }
  /* a man pressing on and getting nowhere, while a mark waits for him */
  const pressing=Math.hypot(fx,fz)>0.05, wants=beat&&(beat.t==='goal'||beat.t==='witness');
  if(!wants) guide=null;
  if(wants&&!guide&&controlsOn&&!ctx.playerLock&&(pressing||ST.playtest)){
    if(ST.playtest) startGuide(true);
    else { if(!stuckAt||Math.hypot(player.position.x-stuckAt[0],player.position.z-stuckAt[1])>0.4){ stuckAt=[player.position.x,player.position.z]; stuckT=0; }
      else if((stuckT+=dt)>5){ stuckT=0; stuckAt=null; startGuide(false); } } }
  else if(!pressing) { stuckT=0; stuckAt=null; }
  const gAng=(controlsOn&&!ctx.playerLock)?guideSteer(dt):null;
  const L=gAng!==null?1:Math.hypot(fx,fz), ud=player.userData;
  if(L>0.05){
    const sp=(keys.ShiftLeft||keys.ShiftRight?6.2:3.6)*Math.min(1,L);
    const fwd=camYaw+Math.PI, ang=gAng!==null?gAng:fwd+Math.atan2(fx,fz);
    const dx=Math.sin(ang)*sp*dt, dz=Math.cos(ang)*sp*dt;
    const x=player.position.x, z=player.position.z;
    const y=player.position.y;
    const onDeck=ctx.playerY!==undefined;                /* (held at a deck's height: her side is a wall both ways) */
    /* (nor into a table, a jar, a beast, one sitting or lying, one of the multitude or the townsfolk — only into: out
       of one he is never held, and one at the mark he is sent to is not in his way) */
    /* (led by a way that had to go through them, or held by them a moment and a half on the way he is led — one of
       the townsfolk stood in it — he goes on: the way shown is never the way that holds him) */
    const GG=wants?guideGoal():null, sOn=!(gAng!==null&&guide&&(guide.pts.hard||guide.sh>1.5));
    const hx=sOn&&softAt(x+dx,z,y,0.22,player,GG);
    if(!blocked(x+dx,z,0.3,y)&&!hullCross(x,z,x+dx,z,onDeck)&&!hx) player.position.x+=dx;
    const hz=sOn&&softAt(player.position.x,z+dz,y,0.22,player,GG);
    if(!blocked(player.position.x,z+dz,0.3,y)&&!hullCross(player.position.x,z,player.position.x,z+dz,onDeck)&&!hz) player.position.z+=dz;
    if(gAng!==null&&guide&&(hx||hz)) guide.sh=(guide.sh||0)+dt;
    player.rotation.y=turnTo(player.rotation.y,ang,dt*10);
    ud.walk=(ud.walk||0)+dt*sp*2.2;
  } else ud.walk=0;
  if(ctx.playerY!==undefined) player.position.y=ctx.playerY;
  else { const gy=stepGround(player.position.x,player.position.z,player.position.y);   /* (a lintel at his head is not a floor to be stood on) */
    /* a step up is taken at once; a drop is fallen, not floated down */
    player.position.y=gy>player.position.y?gy:Math.max(gy,player.position.y-dt*9); }
  animFigure(player,dt,L>0.05); animFace(player,'player',dt);
}
function turnTo(a,b,k){ let d=b-a; while(d>Math.PI) d-=Math.PI*2; while(d<-Math.PI) d+=Math.PI*2; return a+d*Math.min(1,k); }
/* ================= THE LAKE IN A GALE =================
   The height of the lake's waves at a point of the set — the same sum the waves are drawn with
   (STORYWORLD.lakeWaves), so a boat rides and a man walks on exactly the water that is seen.
   Their height follows the wind: a breath of it at rest, a metre and more in the squall (Mark
   4:37), and back to a floor when He speaks to it (4:39). */
function lakeH(x,z){ const L=ctx.lake, r=L.rect;
  /* (on the Great Sea, the voyage's own sea's face, from the set's level: a set raised out of it stands a
     course over it, and its boats ride that much lower) */
  if(L.voyage){ const k=K(); return (k.WATER_Y+k.seaHeight(anchor.x+x*SX,anchor.z+z*SX)-anchor.y)/S; }
  const e=Math.min(x-r[0],r[2]-x,z-r[1],r[3]-z); if(e<=0) return 0;
  const ef=e>=6?1:(e/6)*(e/6)*(3-2*e/6);
  const wl=Math.hypot(ctx.wind[0],ctx.wind[1])||1, dx=ctx.wind[0]/wl, dz=ctx.wind[1]/wl;
  let h=0;
  for(const c of window.STORYWORLD.LAKE_WAVES){ const k=2*Math.PI/c[1], om=Math.sqrt(9.8*k), cs=Math.cos(c[0]), sn=Math.sin(c[0]);
    const Dx=cs*dx-sn*dz, Dz=sn*dx+cs*dz; h+=L.A*c[2]*Math.sin(k*(Dx*x+Dz*z)-om*L.t); }
  return h*ef; }
/* A BOAT IS SOLID: her sides are not walked through. Whether a step from (x0,z0) to (x1,z1) would pass
   through a hull — from outside her to inside, or (for the townsfolk) out again — over the gunwale of
   any boat of the scene, beached or afloat. Those the story itself sends aboard are not stopped: their
   going in is the scene's own (Luqas 5:3, "He entered one of the boats"). */
function inHull(o,x,z){ const t=o.userData.thing||{}, B=o.userData.boat||(t.big?{len:window.STORYWORLD.BOAT.len*(t.scale||1),beam:window.STORYWORLD.BOAT.beam*(t.scale||1)}:{len:7,beam:2.1});
  const h=o.rotation.y, dx=x-o.position.x, dz=z-o.position.z;
  const al=dx*Math.sin(h)+dz*Math.cos(h), ac=dx*Math.cos(h)-dz*Math.sin(h);
  return Math.abs(al)<B.len/2+0.15&&Math.abs(ac)<B.beam/2+0.15; }
function hullCross(x0,z0,x1,z1,both){
  for(const id in ctx.things){ const o=ctx.things[id], t=o.userData.thing; if(!t||t.kind!=='boat'||!o.visible) continue;
    const a=inHull(o,x0,z0), b=inHull(o,x1,z1); if(!a&&b) return true; if(both&&a&&!b) return true; }
  return false; }
/* where a point of the set lies in a boat's own frame (along her, across her), and whether it is inside her */
function inBoat(o,x,z){ const B=o.userData.boat; if(!B) return null;
  const h=o.rotation.y, dx=x-o.position.x, dz=z-o.position.z;
  const al=dx*Math.sin(h)+dz*Math.cos(h), ac=dx*Math.cos(h)-dz*Math.sin(h);
  const t=Math.abs(al)/(B.len/2); if(t>=0.97) return null;
  const half=B.beam/2*Math.sqrt(Math.max(0,1-Math.pow(t,al>0?2.6:3.4)));
  return Math.abs(ac)<half?{al,ac}:null; }
const _lw=new THREE.Vector3();
function toWorld(x,y,z){ return root.localToWorld(_lw.set(x,y,z)); }
function lakeTick(dt){
  const L=ctx.lake, KIT=K();
  L.t+=dt;
  const want=0.025+0.075*(ctx.rough||0);
  L.A+=(want-L.A)*Math.min(1,dt*(want<L.A?1.6:0.5));            /* the calm comes at a word; the storm builds */
  const U=L.w?L.w.U:null;                                       /* (none on the Great Sea: the voyage draws it) */
  if(U){ U.uT.value=L.t; U.uA.value=L.A;
    const wl=Math.hypot(ctx.wind[0],ctx.wind[1])||1; U.uDir.value.set(ctx.wind[0]/wl,ctx.wind[1]/wl); }
  const lv=L.voyage?(KIT.WATER_Y-anchor.y)/S:0;                 /* (the sea's level from the set's) */
  /* the boats ride it: heave with the water under her, pitch and roll with its slope, and heel to the wind */
  let main=null;
  for(const id in ctx.things){ const o=ctx.things[id], u=o.userData; if(!u.bob||!o.visible) continue;
    const B=u.boat||{len:7,beam:2}, h=o.rotation.y, fx=Math.sin(h), fz=Math.cos(h), rx=Math.cos(h), rz=-Math.sin(h);
    const x=o.position.x, z=o.position.z, ha=B.len*0.36, hb=B.beam*0.5;
    const hc=lakeH(x,z), hf=lakeH(x+fx*ha,z+fz*ha), hs=lakeH(x-fx*ha,z-fz*ha), hp=lakeH(x+rx*hb,z+rz*hb), hn=lakeH(x-rx*hb,z-rz*hb);
    const cl=(v,m)=>v<-m?-m:v>m?m:v;
    u.heave=lv+((hc*2+hf+hs)/4-lv)*0.9; u.pitch=cl(Math.atan2(hf-hs,2*ha),0.2); u.roll=cl(Math.atan2(hp-hn,2*hb)*0.8,0.24);
    o.position.y=u.baseY+u.heave; o.rotation.x=-u.pitch; o.rotation.z=u.roll;
    if(u.boat&&!main) main=o; }
  if(U){ let n=0; for(const id in ctx.things){ const o=ctx.things[id], t=o.userData.thing; if(n>=8||!o.visible||!t||t.kind!=='boat') continue;
      const B=o.userData.boat||(t.big?{len:window.STORYWORLD.BOAT.len*(t.scale||1),beam:window.STORYWORLD.BOAT.beam*(t.scale||1)}:{len:7,beam:2.1});
      U.uBoats.value[n].set(o.position.x,o.position.z,B.len,B.beam); U.uBoatHs.value[n]=o.rotation.y; n++; }
    for(;n<8;n++) U.uBoats.value[n].w=-99; }
  if(main){ if(U){ U.uBoat.value.set(main.position.x,main.position.z,main.userData.boat.len,main.userData.boat.beam); U.uBoatH.value=main.rotation.y; }
    const w=toWorld(main.position.x,0,main.position.z); KIT.ripple.focus({x:w.x,y:w.y,z:w.z}); }
  /* everyone in her moves with her; everyone on the water stands on its face */
  const ride=(g,base)=>{ if(!main) return false; const b=inBoat(main,g.position.x,g.position.z); if(!b) return false;
    const u=main.userData; g.position.y=base+u.heave+b.al*Math.sin(u.pitch)+b.ac*Math.sin(u.roll); return true; };
  /* (and on the Great Sea, where she is thrown up and down metres at a time, what lies on her deck goes with
     her: the cargo stood still in the air while she fell away under it) */
  L.main=main;
  if(L.voyage) for(const id in ctx.things){ const o=ctx.things[id], u=o.userData;
    if(o!==main&&!u.bob&&o.visible&&u.baseY!==undefined&&!u.following&&!u.goTo&&!u.heldBy) ride(o,u.baseY); }
  const r=L.rect;
  for(const id in ctx.actors){ const g=ctx.actors[id], u=g.userData; if(!g.visible||u.fixedY===undefined) continue;
    const base=g.position.y;
    if(ride(g,base)) continue;
    const x=g.position.x, z=g.position.z;
    if(x<=r[0]||x>=r[2]||z<=r[1]||z>=r[3]||u.fixedY<-2) continue;
    /* on the sea: the wave under His feet; a ring where each step falls; and a man going under throws the water up */
    g.position.y=base+lakeH(x,z);
    const lp=u._lakeP; if(!lp||Math.hypot(x-lp[0],z-lp[1])>0.55){ u._lakeP=[x,z];
      if(lp){ const w=toWorld(x,0,z); KIT.ripple.at(w.x,w.z,-0.9,6,0.35); } }
    if(u.fixedY<-0.8&&!u._sunk){ u._sunk=true; const w=toWorld(x,0.2,z); KIT.splash(w.x,w.y,w.z,true); }
    else if(u.fixedY>-0.45&&u._sunk){ u._sunk=false; const w=toWorld(x,0.1,z); KIT.splash(w.x,w.y,w.z,false); } }
  if(player&&ctx.playerY!==undefined) ride(player,player.position.y);
  /* THE WAVES BEAT INTO THE BOAT (Mark 4:37): in a gale the sea breaks over her weather side in
     sheets of spray, and white water is torn off the crests all about her */
  if(main&&L.A>0.3){ L.spT=(L.spT||0)-dt;
    if(L.spT<=0){ L.spT=0.35+Math.random()*0.7*(0.6/L.A);
      const B=main.userData.boat, h=main.rotation.y, al=(Math.random()-0.3)*B.len*0.8;
      const wl=Math.hypot(ctx.wind[0],ctx.wind[1])||1, side=(ctx.wind[0]*Math.cos(h)-ctx.wind[1]*Math.sin(h))/wl>0?-1:1;
      const ac=side*(B.beam/2+0.25), x=main.position.x+al*Math.sin(h)+ac*Math.cos(h), z=main.position.z+al*Math.cos(h)-ac*Math.sin(h);
      const w=toWorld(x,main.position.y+0.4,z); KIT.splash(w.x,w.y,w.z,true); }
    L.wcT=(L.wcT||0)-dt;
    if(L.wcT<=0){ L.wcT=0.12; const a=Math.random()*6.28, d=4+Math.random()*28;
      const w=toWorld(main.position.x+Math.cos(a)*d,0,main.position.z+Math.sin(a)*d); KIT.ripple.at(w.x,w.z,1.2*L.A,9,0.7); } }
}
/* on the ground, or on something? (one held at a height — in a boat — or set on a bench) */
function groundSit(u){ return (u.def&&u.def.ground)||(u.fixedY===undefined&&!u.ride&&!u.aboard&&!(u.def&&u.def.bench)); }   /* `ground`: on a floor though held at its height (a boat's) */
/* how far one sitting is lowered: on the ground the hips nearly to it, on a bench to its height */
function sitDrop(u){ return u.kneel?0.43*(u.s||1):u.sit?(groundSit(u)?0.63:0.44)*(u.s||1):0; }
/* the pose on all fours (radians, and metres for a man of 1.70): worked so the hands and the feet bear alike */
const FOURS={pitch:1.05,thigh:-2.85,knee:2.1,arm:-1.2,splay:0.3,head:-0.85,lift:-0.034,back:1.12};
function animFigure(g,dt,moving){
  const u=g.userData; u.phase=(u.phase||0)+dt*(moving?7:1.2);
  const sw=moving?Math.sin(u.phase)*0.55:Math.sin(u.phase)*0.03;
  if(u.legL){ u.legL.rotation.x=sw; u.legR.rotation.x=-sw; u.armL.rotation.x=-sw*0.8; u.armR.rotation.x=u.carrying?-0.9:sw*0.8; }
  /* SEATED: on the ground (the grass, a floor) the knees are drawn up and the feet set before
     him; on something (a bench, a boat's thwart, the toll-table) the thighs lie level and the
     shins hang down */
  if(u.sit&&u.legL){ const gr=groundSit(u);
    u.legL.rotation.x=u.legR.rotation.x=gr?-1.92:-1.45; u.armL.rotation.x=u.armR.rotation.x=gr?-0.9:-0.5;
    for(const L of [u.legL,u.legR]) if(L.userData.knee) L.userData.knee.rotation.x=gr?1.42:1.45; }
  /* KNEELING: the thighs upright, the shins laid back along the ground, the head bowed */
  if(u.kneel&&u.legL){ u.legL.rotation.x=u.legR.rotation.x=-0.08;
    for(const L of [u.legL,u.legR]) if(L.userData.knee) L.userData.knee.rotation.x=1.5;
    u.armL.rotation.x=u.armR.rotation.x=-0.35; if(u.head) u.head.rotation.x=0.38; }
  /* THE SPEAKER'S HANDS: one who is speaking and standing still lifts a hand with the words */
  if(u.talkM!==undefined&&!moving&&!u.sit&&!u.carrying&&u.armR){ const k=u.talkM;
    u.armR.rotation.x+=(-0.55-k*0.35+Math.sin(u.phase*0.9)*0.08-u.armR.rotation.x)*Math.min(1,dt*5);
    u.armL.rotation.x+=(-0.18-k*0.15-u.armL.rotation.x)*Math.min(1,dt*4); }
  /* knees and elbows fold as the voyage's folk fold theirs */
  const jt=K().jointTick; if(jt&&u.legL&&!u.sit&&!u.kneel) for(const L of [u.legL,u.legR,u.armL,u.armR]) jt(L,moving);
  /* ON ALL FOURS (a def's `crouch`): the man of the tombs, hunched forward over his hands, his knees
     drawn up by his shoulders and splayed, his feet under him on their toes, his head craned up; going, he scuttles, the
     hands and feet stepping crosswise. The body is pitched about its feet and set back, so hands
     and feet both meet the ground over the place he is at. */
  u.crouching=!!(u.def&&u.def.crouch&&!u.sit&&!u.lie&&u.legL&&u.body);
  if(u.crouching){ const P=FOURS, s=moving?Math.sin(u.phase)*0.32:Math.sin(u.phase)*0.02, k=u.s||1;
    u.body.rotation.x=P.pitch; u.body.position.set(0,P.lift*k,-P.back*k);
    u.legL.rotation.x=P.thigh+s; u.legR.rotation.x=P.thigh-s; u.legL.rotation.z=P.splay; u.legR.rotation.z=-P.splay;   /* the knees splayed */
    u.armL.rotation.x=P.arm-s*1.1; u.armR.rotation.x=P.arm+s*1.1; u.armL.rotation.z=0.1; u.armR.rotation.z=-0.1;
    for(const L of [u.legL,u.legR]) if(L.userData.knee) L.userData.knee.rotation.x=P.knee;
    for(const A of [u.armL,u.armR]) if(A.userData.elbow) A.userData.elbow.rotation.x=0;
    if(u.head) u.head.rotation.x=P.head; u.fours=true; }
  else if(u.fours){ u.fours=false; u.body.rotation.x=0; u.body.position.set(0,0,0); if(u.head) u.head.rotation.x=0;
    for(const P of [u.legL,u.legR,u.armL,u.armR]) P.rotation.z=0; }
  /* ON THE STAKE (the `pose` beat): the Besorah's word is a stake, an upright pole — the hands
     drawn up over the head and nailed together to it, the feet nailed below; still, the legs
     straight and together, the head fallen forward a little */
  /* CARRYING THE CROSSBEAM (`carry`, Luqas 23:26): it lies across the backs of his shoulders, and his arms are
     laid out along its front, a little up and back, the hands on it near its ends; his legs walk on under it */
  if(u.armsOut==='carry'&&u.armL){ u.armL.rotation.set(-0.88,0,1.86); u.armR.rotation.set(-0.88,0,-1.86);
    for(const A of [u.armL,u.armR]) if(A.userData.elbow) A.userData.elbow.rotation.x=0; u.posed=true; }
  else if(u.armsOut&&u.armL){ const up=u.armsOut==='up';
    u.armL.rotation.set(0,0,up?Math.PI+0.36:Math.PI/2); u.armR.rotation.set(0,0,up?-(Math.PI+0.36):-Math.PI/2);
    for(const A of [u.armL,u.armR]) if(A.userData.elbow) A.userData.elbow.rotation.x=0;
    /* (one kneeling or sitting keeps his legs as they are: Kĕpha praying on his knees was stood up straight, sunk
       to the thigh in the floor) */
    if(!u.sit&&!u.kneel){ u.legL.rotation.set(0,0,up?-0.03:0); u.legR.rotation.set(0,0,up?0.03:0);
      for(const L of [u.legL,u.legR]) if(L.userData.knee) L.userData.knee.rotation.x=up?0.08:0; }
    if(up&&u.head) u.head.rotation.x=0.22; u.posed=true; }
  /* HOLDING something in both hands before him (the `hold` beat): the arms forward, the elbows bent */
  else if(u.holding&&u.armL){ u.armL.rotation.set(-0.95,0,-0.16); u.armR.rotation.set(-0.95,0,0.16);
    for(const A of [u.armL,u.armR]) if(A.userData.elbow) A.userData.elbow.rotation.x=-0.55; u.posed=true; }
  /* a pose let go: the arms and legs come back to hang as they do (else they stay where the pose left them) */
  else if(u.posed&&u.armL){ u.posed=false; for(const P of [u.armL,u.armR,u.legL,u.legR]){ P.rotation.y=0; P.rotation.z=0; }
    if(u.head) u.head.rotation.x=0; }
  clothStep(g,dt,moving,sw);
}
/* THE CLOTH. Each panel of a hem, and the back of a head-cloth, hangs on a hinge and is
   swung by a spring and a damper: gravity draws it back to hang straight; the air it
   moves through (the place's wind, in gusts, less the figure's own going) pushes it out
   along its face; the body's starting and stopping throws it; a stride kicks the front
   of the hem. It cannot swing into the body, only away from it. */
const CLOTH={k:34,c:5.5,gain:2.8,drag:1,inertia:0.22,kick:2.6,lo:-0.04,hi:1.05};
function clothStep(g,dt,moving,stride){
  const u=g.userData, C=u.cloth; if(!C||!dt) return;
  /* the seated robe, drawn for the way he sits: on the ground, or on a bench (people.js) */
  const dk=u.sit?(groundSit(u)?'g':'b'):'';
  if(u.drapes&&u.drapeOn!==dk){ u.drapeOn=dk; for(const d of u.drapes) d.visible=!!dk&&(!d.userData.pose||d.userData.pose===dk); }
  const p=g.position;
  if(!u.pp){ u.pp=p.clone(); u.vel=[0,0]; }
  let vx=(p.x-u.pp.x)/dt, vz=(p.z-u.pp.z)/dt; u.pp.copy(p);
  const sp=Math.hypot(vx,vz); if(sp>8){ vx=vx/sp*8; vz=vz/sp*8; }            /* a figure set down elsewhere is not a gale */
  let ax=(vx-u.vel[0])/dt, az=(vz-u.vel[1])/dt; const al=Math.hypot(ax,az); if(al>20){ ax=ax/al*20; az=az/al*20; }
  u.vel[0]+= (vx-u.vel[0])*Math.min(1,dt*12); u.vel[1]+=(vz-u.vel[1])*Math.min(1,dt*12);
  const t=clock.elapsedTime, ph=(u.id||'').length*1.7+p.x*0.13;
  const gust=0.55+0.45*Math.sin(t*0.9+ph)*Math.sin(t*0.37+ph*0.5)+0.25*Math.sin(t*3.1+ph);
  const W=ctx.wind||[0,0];
  const Fx=CLOTH.drag*(W[0]*gust-u.vel[0])-CLOTH.inertia*ax, Fz=CLOTH.drag*(W[1]*gust-u.vel[1])-CLOTH.inertia*az;
  const r=g.rotation.y, cs=Math.cos(r), sn=Math.sin(r);
  for(const q of C){
    const nx=q.n[0]*cs+q.n[2]*sn, nz=-q.n[0]*sn+q.n[2]*cs;
    let f=(Fx*nx+Fz*nz)*CLOTH.gain*(q.light?1.2:1);
    if(moving&&q.axis==='x'&&q.sign>0) f+=CLOTH.kick*Math.max(0,Math.abs(stride)-0.15);   /* the stride lifts the front of the hem */
    q.w+=(f-CLOTH.k*q.a-CLOTH.c*q.w)*dt; q.a+=q.w*dt;
    const hi=q.light?0.75:CLOTH.hi;
    if(q.a<CLOTH.lo){ q.a=CLOTH.lo; if(q.w<0) q.w=0; } else if(q.a>hi){ q.a=hi; if(q.w>0) q.w=0; }
    /* seated: the front of the skirt lies over the lap and falls from the knees; the back
       is sat upon, and lies flat behind */
    /* seated, the hanging skirt is put by for the seated robe (people.js: drapes) */
    if(!q.light) q.pv.visible=!u.sit;
    if(q.axis==='x') q.pv.rotation.x=-q.sign*q.a; else q.pv.rotation.z=q.sign*q.a;
    if(q.low) q.low.rotation.x=q.a*0.3;                          /* the lower length trails the upper */
  }
}
/* is there a block where a man's body would be, standing at height gy here? */
function wallAt(x,z,gy){ if(gy===undefined) return false; const k=K(), wx=anchor.x+x*SX, wz=anchor.z+z*SX;
  if(!(k.solidAt(wx,anchor.y+(gy+0.9)*S,wz)||k.solidAt(wx,anchor.y+(gy+1.5)*S,wz))) return false;
  /* a bank he can hop is not a wall */
  const f=groundAt(x,z,gy+CLIMB_REF);
  if(f>gy+0.05&&f<=gy+CLIMB_M&&!k.solidAt(wx,anchor.y+f*S+0.5*k.B,wz)&&!k.solidAt(wx,anchor.y+f*S+1.5*k.B,wz)) return false;
  return true; }
/* ================= WHAT IS DRAWN, AND NOT LAID AS BLOCKS =================
   The world's blocks were all that stopped a man of the scene: a table, a bench, a jar, the foot of a
   palm, a beast, one of the multitude, a man sitting on the ground were walked through as air, and the
   multitude stood in the money tables. They are gathered here and asked after as the blocks are: the
   set's own little things where they stand on the floor at a knee's height and more (kept in a grid of a
   metre), the multitude, and — where they are now — the scene's things, the townsfolk and those sitting
   or lying. A thing within a stride of where a man is going is not in his way (he goes up to the table's
   side), nor one he already stands in (he steps out of it); so no mark is refused, and no one held. */
let softT=0;                                                     /* (the frame: what moves is gathered once in each) */
const softK=(i,j)=>(i+32768)*65536+(j+32768);
function softPut(e){ const G=ctx.soft.grid;
  for(let i=Math.floor(e.x0);i<=Math.floor(e.x1);i++) for(let j=Math.floor(e.z0);j<=Math.floor(e.z1);j++){ const k=softK(i,j); let L=G.get(k); if(!L) G.set(k,L=[]); L.push(e); } }
function gatherSoft(st){
  ctx.soft={grid:new Map(),q:0,dyn:null,dynT:-1};
  for(const c of st.colliders||[]){ const x0=Math.min(c[0],c[3]), x1=Math.max(c[0],c[3]), z0=Math.min(c[2],c[5]), z1=Math.max(c[2],c[5]), y0=Math.min(c[1],c[4]), y1=Math.max(c[1],c[4]);
    /* (not a reed, a rail, a bar, a cloth laid flat or a floor: those are stepped through or over) */
    if(y1-y0<0.25||Math.min(x1-x0,z1-z0)<0.14||x1-x0>30||z1-z0>30) continue;
    /* (and only what stands on the floor under it, to the knee at least: not a frond, an awning, a lintel) */
    const g=ctx.groundY((x0+x1)/2,(z0+z1)/2,y0+0.6); if(g==null||!isFinite(g)||y0>g+0.35||y1<g+0.3) continue;
    softPut({t:0,b:1,x0,z0,x1,z1,y0,y1,name:'the set at '+((x0+x1)/2).toFixed(1)+','+((z0+z1)/2).toFixed(1)}); } }
/* a thing's footprint, [half across, half along, from, to (over where it stands), a beast], for those a body
   is kept out of: a table, a basket, a jar, the round stone, a car, a beast. Not a boat (her hull is her own),
   nor a cloth, a coin, a fish, a dove, a vision. */
function thingFoot(t){ const k=t.kind||'box';
  if(k==='box'){ const h=t.h||0.5, w=t.w||0.5, d=t.d||0.5; return h>=0.2&&Math.min(w,d)>=0.2?[w/2,d/2,-h/2,h/2]:null; }   /* (not a flask in the hand, a coin, a cloth) */
  if(k==='jar') return [0.37,0.37,0,1.05];
  if(k==='basket') return [0.3,0.3,0,0.45];
  if(k==='roundStone'){ const r=t.r||1.25; return [(t.w||0.45)/2,r,0,2*r]; }
  if(k==='chariot') return [0.85,1.3,0,1.6];
  if(k==='donkey') return [0.3,0.8,0,1.4,1];
  if(k==='camel') return [0.4,1.1,0,2.2,1];
  if(k==='beast') return [0.4,1.0,0,1.6,1];
  if(k==='lamb') return [0.17,0.4,0,0.6,1];
  return null; }
function oRect(x,z,h,hx,hz){ return {t:3,x,z,c:Math.cos(h),s:Math.sin(h),hx,hz}; }
/* what moves, as it stands this frame: the things (not one held, led, carried or ridden), those sitting or
   lying (the legs before one sitting, the shins behind one kneeling, the length of one lying), the townsfolk */
function softDyn(){ const S=ctx.soft; if(S.dyn&&S.dynT===softT) return S.dyn; S.dynT=softT; const L=S.dyn=[];
  const rid={}; for(const id in ctx.actors){ const u=ctx.actors[id].userData; if(u.ride) rid[u.ride]=1; if(u.aboard) rid[u.aboard.id]=1; }
  for(const id in ctx.things){ const o=ctx.things[id], u=o.userData, F=u.soft;
    if(!F||!o.visible||u.heldBy||u.leadBy||u.following||rid[id]) continue;
    L.push(Object.assign(oRect(o.position.x,o.position.z,o.rotation.y,F[0],F[1]),{b:4,y0:o.position.y+F[2],y1:o.position.y+F[3],name:id})); }
  for(const id in ctx.actors){ const g=ctx.actors[id], u=g.userData; if(!g.visible||u.ride||u.aboard||!(u.sit||u.lie||u.kneel)) continue;
    const s=u.s||1, fx=Math.sin(g.rotation.y), fz=Math.cos(g.rotation.y), fl=g.position.y+sitDrop(u)-(u.lie?0.16:0);
    if(u.lie){ const k=(g.rotation.x>0?0.9:-0.9)*s;                 /* (on his back he lies back from his feet; on his face, before them) */
      L.push(Object.assign(oRect(g.position.x+fx*k,g.position.z+fz*k,g.rotation.y,0.275*s,0.95*s),{b:8,y0:fl,y1:fl+0.5,g,a:1,name:id})); }
    else { const k=(u.kneel?-0.45:groundSit(u)?0.62:0.45)*s;
      L.push({t:2,b:8,ax:g.position.x,az:g.position.z,bx:g.position.x+fx*k,bz:g.position.z+fz*k,r:0.2*s,y0:fl,y1:fl+1.3,g,a:1,name:id}); } }
  for(const F of ctx.folk||[]){ const g=F.g, y=g.userData.gy||0; L.push({t:1,b:16,cx:g.position.x,cz:g.position.z,r:0.24,y0:y,y1:y+1.7,g,f:1,name:'one of the townsfolk'}); }
  for(const q of ctx.folkSolids||[]){ if(q[3]===undefined) q[3]=ctx.groundY(q[0],q[1])||0; L.push({t:1,b:8,cx:q[0],cz:q[1],r:q[2],y0:q[3],y1:q[3]+1.5,f:1,name:'the townsfolk at their work'}); }
  return L; }
/* how far (x,z) lies off a soft thing's footprint (0 within it); its nearest point is left in _sc */
const _sc=[0,0];
function softDist(e,px,pz){ let qx,qz,r=0;
  if(e.t===0){ qx=Math.max(e.x0,Math.min(e.x1,px)); qz=Math.max(e.z0,Math.min(e.z1,pz)); }
  else if(e.t===1){ qx=e.cx; qz=e.cz; r=e.r; }
  else if(e.t===2){ const vx=e.bx-e.ax, vz=e.bz-e.az, L2=vx*vx+vz*vz||1, f=Math.max(0,Math.min(1,((px-e.ax)*vx+(pz-e.az)*vz)/L2)); qx=e.ax+vx*f; qz=e.az+vz*f; r=e.r; }
  else { const dx=px-e.x, dz=pz-e.z, lx=Math.max(-e.hx,Math.min(e.hx,dx*e.c-dz*e.s)), lz=Math.max(-e.hz,Math.min(e.hz,dx*e.s+dz*e.c));
    qx=e.x+lx*e.c+lz*e.s; qz=e.z-lx*e.s+lz*e.c; }
  _sc[0]=qx; _sc[1]=qz; return Math.max(0,Math.hypot(px-qx,pz-qz)-r); }
/* is a body of radius r, its feet at y, at (x,z) in a soft thing? `self`, who asks, is not in his own way, nor
   is what he stands in already (the witness: what he touches at all, so he is only kept from going in);
   nor what lies within a stride of his `goal`. `mask`: 1 the set's, 2 the multitude, 4 the things, 8 those sitting
   or lying and the townsfolk's work, 16 the townsfolk going about (not worth a way worked round: they move on). */
function softHit(x,z,y,r,self,goal,mask){
  const S=ctx&&ctx.soft; if(!S||y==null||!isFinite(y)) return null; mask=mask||31;
  const lo=y+0.1, hi=y+1.6, me=self&&self.position, rin=self===player?r:r*0.6, folkG=!!(self&&self.userData&&self.userData.folkG);
  const hit=e=>e.y1>=lo&&e.y0<=hi&&softDist(e,x,z)<r&&!(goal&&softDist(e,goal[0],goal[1])<0.6)&&!(me&&softDist(e,me.x,me.z)<rin);
  if(mask&3){ const q=++S.q;
    for(let i=Math.floor(x-r);i<=Math.floor(x+r);i++) for(let j=Math.floor(z-r);j<=Math.floor(z+r);j++){ const L=S.grid.get(softK(i,j)); if(!L) continue;
      for(const e of L){ if(e.q===q) continue; e.q=q;
        if(!(mask&e.b)||(e.m&&!e.m.visible)) continue;
        if(hit(e)) return e; } } }
  if(mask&28) for(const e of softDyn()){ if(e.g&&e.g===self) continue;
    if(!(mask&e.b)||(e.f&&folkG)) continue;                                /* (the townsfolk keep from each other and their work themselves) */
    if(hit(e)) return e; }
  return null; }
function softAt(x,z,y,r,self,goal,mask){ return !!softHit(x,z,y,r,self,goal,mask); }
/* ---- NONE IS SET DOWN INSIDE A TABLE ----
   One written where a thing of the set or of the scene stands (a scatter of folk over a court of money
   tables) is stepped out of it at the start, to the nearest place clear within a metre and a half, and it is
   written down (ST.stuck) so that the place he was written at can be put right. Not one sat on a bench (it
   is under him), lying, kneeling or held at a height; nor out of a thing the story leads, holds, rides or
   gives the witness to carry; a thing hidden now is minded if the story shows it later. */
function settleActors(sc){
  const skip=new Set(), shown=new Set();
  for(const B of sc.beats||[]){ if(B.t==='lead'||B.t==='hold') for(const i of [].concat(B.id)) skip.add(i);
    if((B.t==='ride'||B.t==='aboard')&&B.on) skip.add(B.on);
    if(B.t==='witness') for(const i of B.items||[]) skip.add(i);
    if(B.t==='show') for(const i of [].concat(B.id)) shown.add(i); }
  const T=[]; for(const id in ctx.things){ const o=ctx.things[id], F=o.userData.soft;
    if(!F||F[4]||skip.has(id)||!(o.visible||shown.has(id))) continue;
    T.push(Object.assign(oRect(o.position.x,o.position.z,o.rotation.y,F[0],F[1]),{y0:o.position.y+F[2],y1:o.position.y+F[3],name:id})); }
  const inOne=(x,z,y)=>{ const e=softHit(x,z,y,0.12,null,null,1); if(e) return e;
    for(const E of T) if(E.y1>=y+0.1&&E.y0<=y+1.6&&softDist(E,x,z)<0.12) return E; return null; };
  for(const id in ctx.actors){ const g=ctx.actors[id], u=g.userData;
    if(u.fixedY!==undefined||u.lie||u.kneel||u.ride||u.aboard||(u.sit&&!groundSit(u))) continue;
    const y=u.gy!==undefined?u.gy:g.position.y, fx=Math.sin(g.rotation.y), fz=Math.cos(g.rotation.y);   /* (the floor: one sitting is not yet let down on it) */
    const at=(x,z,gy)=>inOne(x,z,gy)||(u.sit?inOne(x+fx*0.4,z+fz*0.4,gy):null);       /* (one sitting: his knees too) */
    const e=at(g.position.x,g.position.z,y); if(!e) continue;
    let best=null;
    find: for(let r=0.25;r<=1.5;r+=0.25) for(let q=0;q<16;q++){ const a=q/16*Math.PI*2, x=g.position.x+Math.sin(a)*r, z=g.position.z+Math.cos(a)*r, gy=ctx.groundY(x,z);
      if(gy==null||!isFinite(gy)||Math.abs(gy-y)>0.6||wallAt(x,z,gy)||at(x,z,gy)) continue;
      best=[x,z,gy,r]; break find; }
    if(!best) continue;
    g.position.set(best[0],best[2]-sitDrop(u),best[1]); u.gy=best[2];
    if(g.visible) (ST.stuck=ST.stuck||[]).push({who:id,act:act&&act.id,scene:sc.id,beat:0,why:'settled out of '+e.name,d:best[3]}); } }   /* (one unseen is set somewhere before he is shown) */
/* the actors walk where the story sends them */
function moveActors(dt){
  for(const id in ctx.actors){ const g=ctx.actors[id], u=g.userData;
    if(u.aboard) continue;
    let tgt=u.target;
    if(u.follow){ const f=u.follow==='player'?player:ctx.actors[u.follow];
      if(f){ const d=Math.hypot(f.position.x-g.position.x,f.position.z-g.position.z); tgt=d>2.4?[f.position.x,f.position.z]:null; } }
    let moving=false;
    if(tgt){ const dx=tgt[0]-g.position.x, dz=tgt[1]-g.position.z, d=Math.hypot(dx,dz);
      /* ---- AND NO ONE IS LEFT STANDING AGAINST A WALL FOR EVER ----
         The act waits for everyone it sends to arrive. A figure walked straight at his mark and
         turned a little aside at a wall — so a mark on the far side of a city wall, a house or a
         crowd standing on it held him against it for ever, and the whole story with him, and the
         game could not be finished. Two seconds without drawing nearer and he works out the way
         round (the same walk the witness is led by) and takes it; if there is none, or he is
         still held, he is simply there. Every rescue is written down for the playtest. */
      let way=null;
      if(d>0.15&&!(u.follow&&d<=2.4)){ const P=u._prog||(u._prog={d:d,t:0,tx:tgt[0],tz:tgt[1]});
        if(P.tx!==tgt[0]||P.tz!==tgt[1]){ P.d=d; P.t=0; P.tx=tgt[0]; P.tz=tgt[1]; u._path=null; P.tries=0; P.los=undefined; }
        /* (a wall between him and his mark: the way round is worked out before he sets off, not after he
           has walked into the wall and wedged himself in its corner, where no way could be found) */
        if(P.los===undefined){ P.los=true;
          if(u.fixedY===undefined&&!u.follow&&d>1.2) for(let q=0.4;q<d;q+=0.4){ const x=g.position.x+dx/d*q, z=g.position.z+dz/d*q;
            if(wallAt(x,z,u.gy)||softAt(x,z,u.gy!==undefined?u.gy:g.position.y,0.22,g,tgt,15)){ P.los=false; P.t=2.01; break; } } }   /* (or a table, one sitting, the multitude) */
        else if(d<P.d-0.25){ P.d=d; P.t=0; } else P.t+=dt;
        /* (and one held on a way already worked out — those he was to pass have sat down across it since — works
           out another, round them) */
        if(P.t>2&&(P.tries||0)<3&&!u.follow&&u.fixedY===undefined){ P.tries=(P.tries||0)+1; P.t=0; u._path=null;
          const pts=planWay(tgt[0],tgt[1],0.4,{x:g.position.x,y:u.gy!==undefined?u.gy:g.position.y,z:g.position.z,g});
          if(pts) u._path={pts,i:0}; else P.t=99; }
        if(P.t>(u.follow?6:4)){ u._prog=null; u._path=null;
          const k2=u.follow?Math.max(0,(d-1.6)/d):1;
          g.position.x+=dx*k2; g.position.z+=dz*k2;
          /* (the floor under his head, not the roof over it: a mark in a room is under a roof a man's height up) */
          { const g0=u.gy!==undefined?u.gy:g.position.y, x=g.position.x, z=g.position.z, lo=ctx.groundY(x,z,g0+1.6), hi=ctx.groundY(x,z,g0+3);
            u.gy=(isFinite(lo)&&lo>g0-6)?lo:hi;
            /* (nor in the hill under it: his mark up on the slope, ten metres over where he was held, the floor
               looked for from his own height was inside the hillside, and he was set down in it) */
            if(!isFinite(u.gy)||sunkAt(x,z,u.gy)){ const f=ctx.groundY(x,z); if(isFinite(f)) u.gy=f; } }
          /* (and set down beside his mark, not in the wall it was written in) */
          u._mv='set down by the rescue';
          if(u.fixedY===undefined&&wallAt(g.position.x,g.position.z,u.gy)){ const x0=g.position.x, z0=g.position.z;
            search: for(let r=0.4;r<=2.0;r+=0.4) for(let q=0;q<12;q++){ const t=q/12*Math.PI*2, x=x0+Math.cos(t)*r, z=z0+Math.sin(t)*r, y=ctx.groundY(x,z,u.gy+1.5);
              if(isFinite(y)&&!wallAt(x,z,y)){ g.position.x=x; g.position.z=z; u.gy=y; break search; } } }
          if(u.fixedY===undefined&&isFinite(u.gy)) g.position.y=u.gy-sitDrop(u)+(u.lie?0.16:0);          /* (set down at once, not a frame later) */
          if(g.visible&&d>=0.7) (ST.stuck=ST.stuck||[]).push({who:id,act:act&&act.id,scene:act&&act.scenes[sceneIx]&&act.scenes[sceneIx].id,beat:beatIx,d:+d.toFixed(1),plan:lastPlan});   /* (one gone from sight is no one's concern, nor one set down the last hand's breadth) */
          if(!u.follow) u.target=null; continue; }
        if(u._path){ const W=u._path;
          while(W.i<W.pts.length-1&&Math.hypot(W.pts[W.i][0]-g.position.x,W.pts[W.i][1]-g.position.z)<0.2) W.i++;
          /* (on a way round he is getting there as long as he is getting along it — a way round a house
             first goes away from the mark, and measured by the mark alone he was "held" and carried) */
          if(W.i!==P.wi){ P.wi=W.i; P.t=0; }
          way=W.pts[W.i]; } }
      else { u._prog=null; u._path=null; }
      if(way){ const wx=way[0]-g.position.x, wz=way[1]-g.position.z, wd=Math.hypot(wx,wz);
        if(wd>0.05){ const sp=Math.min(wd,(u.speed||2.6)*dt), a=Math.atan2(wx,wz);
          /* (round a corner, not through it: a step that would stand him in a block slides along it) */
          let mx=Math.sin(a)*sp, mz=Math.cos(a)*sp;
          if(u.fixedY===undefined&&wallAt(g.position.x+mx,g.position.z+mz,u.gy)){
            if(!wallAt(g.position.x+mx,g.position.z,u.gy)) mz=0; else if(!wallAt(g.position.x,g.position.z+mz,u.gy)) mx=0; else mx=mz=0; }
          g.position.x+=mx; g.position.z+=mz; g.rotation.y=turnTo(g.rotation.y,a,dt*8); moving=mx!==0||mz!==0; if(moving) u._mv='on a planned way'; } }
      else
      if(d>0.15){ const sp=Math.min(d,(u.speed||2.6)*dt);
        /* a wall in the way is gone round, not walked through: the step is turned aside, a
           little and then more, until the body would not stand in a block */
        let a0=Math.atan2(dx,dz), a=a0;
        /* (and the step itself must not stand him in one: at a corner the point ahead is clear while
           the way to it goes through the block — so both are asked, and if no way aside will do he
           waits, and in a moment works out the way round) */
        const px=g.position.x, pz=g.position.z, st2=Math.min(sp+0.2,0.45);
        /* (nor up a stair or a bench when his mark is on the ground — he went up the stair at the side
           of a house, along its roof and off the far edge of it — nor over a drop of more than a storey) */
        const P2=u._prog; if(P2&&P2.tgy===undefined) P2.tgy=ctx.groundY(tgt[0],tgt[1],(u.gy||0)+CLIMB_REF);
        const tgy=P2&&isFinite(P2.tgy)?P2.tgy:u.gy;
        const ledge=b=>{ if(u.gy===undefined) return false; const n=stepGround(px+Math.sin(b)*0.45,pz+Math.cos(b)*0.45,u.gy);
          return (n>u.gy+0.5&&tgy<=u.gy+0.3)||n<u.gy-2.4; };
        /* (and a body's half-width kept from a wall at his side: sliding along one he went with his middle on
           its face, half of him in it) */
        const side=b=>{ const lx=px+Math.sin(b)*sp, lz=pz+Math.cos(b)*sp, ox=Math.cos(b)*0.22, oz=-Math.sin(b)*0.22;
          return !wallAt(lx+ox,lz+oz,u.gy)&&!wallAt(lx-ox,lz-oz,u.gy); };
        const clear=b=>!wallAt(px+Math.sin(b)*0.45,pz+Math.cos(b)*0.45,u.gy)&&!wallAt(px+Math.sin(b)*st2,pz+Math.cos(b)*st2,u.gy)&&!wallAt(px+Math.sin(b)*sp,pz+Math.cos(b)*sp,u.gy)&&side(b)&&!ledge(b);
        /* (and round a table, a jar, one sitting, one of the multitude, at the height he walks at — a deck's, an
           upper floor's as well. One who cannot be led round by a way worked out — held at a height, or following —
           and finds no way aside, or is held by them a moment and a half, goes on as he went: they never keep him) */
        const fy=u.fixedY!==undefined?u.fixedY:u.gy!==undefined?u.gy:g.position.y, plans=!u.follow&&u.fixedY===undefined, useSoft=plans||!(P2&&P2.t>1.5);
        const sa=Math.min(0.45,d), soft=b=>!softAt(px+Math.sin(b)*sa,pz+Math.cos(b)*sa,fy,0.22,g,tgt,15)&&!softAt(px+Math.sin(b)*sp,pz+Math.cos(b)*sp,fy,0.22,g,tgt,15);   /* (the townsfolk step aside for him themselves) */
        const pick=f=>{ if(f(a0)) return a0; for(const da of [0.5,-0.5,1.0,-1.0,1.5,-1.5,2.1,-2.1]){ const b=a0+da; if(f(b)) return b; } return null; };
        if(u.fixedY!==undefined){ a=useSoft?pick(soft):null; if(a===null) a=a0; }
        else { a=pick(useSoft?b=>clear(b)&&soft(b):clear); if(a===null&&useSoft&&!plans) a=pick(clear); }
        if(a!==null){ g.position.x+=Math.sin(a)*sp; g.position.z+=Math.cos(a)*sp;
          g.rotation.y=turnTo(g.rotation.y,a,dt*8); moving=true; u._mv='walking to his mark'; }
        /* (a stride from his mark with a wall or the crowd at his elbow, he is there: he was held there four
           seconds and then carried the last fifth of a metre, or the last half of one among the mourners) */
        else if(d<0.7&&!u.follow){ u.target=null; u._prog=null; u._path=null; } }
      else if(!u.follow) u.target=null; }
    if(u.sitOnArrive&&!u.target){ u.sit=true; u.sitOnArrive=false; }
    if(u.fixedY!==undefined) g.position.y=u.fixedY-sitDrop(u)+(u.lie?0.16:0);
    else { u.gy=stepGround(g.position.x,g.position.z,u.gy===undefined?ctx.groundY(g.position.x,g.position.z):u.gy); g.position.y=u.gy-sitDrop(u)+(u.lie?0.16:0); }
    /* riding (Luke 19:35): the beast goes where the rider goes, under him, at its own gait */
    if(u.ride){ const t=ctx.things[u.ride]; if(t){ const gy=u.fixedY!==undefined?u.fixedY:u.gy;
        const tu=t.userData, ro=tu.rideOff||[0,0], c=Math.cos(g.rotation.y), sn=Math.sin(g.rotation.y);
        g.position.y=gy-sitDrop(u)+(tu.seatH||RIDE_H); t.rotation.y=g.rotation.y;
        t.position.set(g.position.x-(ro[0]*c+ro[1]*sn),gy,g.position.z-(-ro[0]*sn+ro[1]*c));      /* a carriage: its rider sits where its seat is */
        if(t.userData.team){ if(K().tickGait) for(const e of t.userData.team) K().tickGait(e,'horse',moving?(u.speed||1)*S:0,dt); }   /* a chariot's pair */
        if(tu.wheels&&moving) for(const w of tu.wheels) w.rotation.x+=(u.speed||1)*dt/w.position.y;            /* and its wheels turn */
        else if(t.children[0]&&K().tickGait){ t.userData.ent=t.userData.ent||{m:t.children[0]}; K().tickGait(t.userData.ent,'donkey',moving?(u.speed||1)*S:0,dt); } } }
    animFigure(g,dt,moving); animFace(g,id,dt);
    if(u.label){ const near=!camTarget&&player&&Math.hypot(player.position.x-g.position.x,player.position.z-g.position.z)<3.6;
      u.label.visible=near||speaking===id; } }
  /* ABOARD (Acts 8:31, "he invited Philip to come up and sit with him"): carried in a carriage at a
     seat of it, after its rider has moved it */
  for(const id in ctx.actors){ const g=ctx.actors[id], u=g.userData; if(!u.aboard) continue;
    const t=ctx.things[u.aboard.id]; if(t){ const o=u.aboard.off, c=Math.cos(t.rotation.y), sn=Math.sin(t.rotation.y);
      g.position.set(t.position.x+o[0]*c+o[2]*sn,t.position.y-sitDrop(u)+(o[1]||t.userData.seatH||RIDE_H),t.position.z-o[0]*sn+o[2]*c);
      g.rotation.y=t.rotation.y+(u.aboard.face||0); }
    animFigure(g,dt,false); animFace(g,id,dt);
    if(u.label) u.label.visible=speaking===id; }
  keepApart(dt);
  /* a beast led by the halter (Luke 19:35): it walks a step behind the one leading it */
  for(const id in ctx.things){ const o=ctx.things[id], u=o.userData; if(!u.leadBy) continue; const g=ctx.actors[u.leadBy]; if(!g) continue;
    /* or carried (`up` off the ground, at `back` behind or on him, turned by `turn`): the crossbeam on Shim‛on's shoulders */
    const bk=u.leadBack!==undefined?u.leadBack:1.3, tx=g.position.x-Math.sin(g.rotation.y)*bk, tz=g.position.z-Math.cos(g.rotation.y)*bk, dx=tx-o.position.x, dz=tz-o.position.z, d=Math.hypot(dx,dz);
    if(u.leadUp){ o.position.x=tx; o.position.z=tz; o.rotation.y=g.rotation.y+(u.leadTurn||0); o.position.y=g.position.y+u.leadUp; continue; }
    if(d>6){ o.position.x=tx; o.position.z=tz; o.rotation.y=g.rotation.y; }   /* the one leading it was set down elsewhere (a cut): it is there with him */
    const step=Math.min(d,dt*3.2); if(d>0.05){ o.position.x+=dx/d*step; o.position.z+=dz/d*step; o.rotation.y=turnTo(o.rotation.y,Math.atan2(dx,dz),dt*6); }
    o.position.y=ctx.groundY(o.position.x,o.position.z);
    if(o.children[0]&&K().tickGait){ u.ent=u.ent||{m:o.children[0]}; K().tickGait(u.ent,u.thing&&u.thing.beast||'donkey',d>0.2?2*S:0,dt); } }
}
/* NO ONE STANDS INSIDE ANOTHER. Two who come closer than a body's breadth step apart, each
   half the way, a little each frame, so a crowd never stands through itself and nobody
   walks through the witness. Those held at a height (in a boat, on a roof), lying down, or
   unseen are left where they are, and so is anyone already at rest on his mark when the one
   coming up to him is walking (the walker gives way). */
const APART=0.46;
const RIDE_H=0.62;                                  /* a rider's seat above the ground, on a young donkey */
/* (a step aside from his neighbour, but never into a wall: twelve followed Him through the gate, pressed
   together, and two of them were shouldered into the stones of its jamb) */
function shove(g,mx,mz){ if(!mx&&!mz) return; const u=g.userData, x=g.position.x+mx, z=g.position.z+mz;
  /* (nor into a heap he could have stepped up onto: shoved, he is not stepping, and stood in its corner) */
  if(u.gy!==undefined&&bodyHit(x,z,u.gy)&&!bodyHit(g.position.x,g.position.z,u.gy)) return;
  /* (nor into a table or a jar: shoved out of a press, he was put through the money changer's board) */
  if(u.gy!==undefined&&softAt(x,z,u.gy,0.18,g,null,5)) return;
  g.position.x=x; g.position.z=z; }
function keepApart(dt){
  const L=[]; for(const id in ctx.actors){ const g=ctx.actors[id], u=g.userData; if(!g.visible||u.lie||u.fixedY!==undefined||u.ride||u.aboard) continue; L.push(g); }
  const k=Math.min(1,dt*6), sat=g=>!!(g.userData.sit||g.userData.kneel);
  for(let i=0;i<L.length;i++){ const a=L[i];
    for(let j=i+1;j<L.length;j++){ const b=L[j], dx=b.position.x-a.position.x, dz=b.position.z-a.position.z, d=Math.hypot(dx,dz);
      if(d>=APART||sat(a)!==sat(b)) continue;                     /* (one sitting and one walking: below) */
      const nx=d>1e-4?dx/d:Math.cos(i+j), nz=d>1e-4?dz/d:Math.sin(i+j), push=(APART-d)*k;
      const am=!!a.userData.target, bm=!!b.userData.target, wa=am===bm?0.5:am?1:0, wb=1-wa;
      shove(a,-nx*push*wa,-nz*push*wa); shove(b,nx*push*wb,nz*push*wb); } }
  if(player&&player.visible) for(const a of L){ const dx=a.position.x-player.position.x, dz=a.position.z-player.position.z, d=Math.hypot(dx,dz);
    if(d<APART&&d>1e-4){ const push=(APART-d)*k; shove(a,dx/d*push,dz/d*push); } }
  /* (and one walking or standing steps out of one sitting — the legs before him — or lying, the length of him on
     the ground; out of one of the multitude; and from under the beam a man carries. They are not moved: a man
     sitting does not give way to one walking.) */
  const S=ctx.soft; if(!S) return;
  const P=softDyn().filter(e=>e.a);
  for(const id in ctx.things){ const o=ctx.things[id], u=o.userData, F=u.soft; if(!o.visible||!u.leadUp||!F||!ctx.actors[u.leadBy]) continue;
    P.push(Object.assign(oRect(o.position.x,o.position.z,o.rotation.y,F[0],F[1]),{g:ctx.actors[u.leadBy],y0:o.position.y+F[2],y1:o.position.y+F[3],beam:1})); }
  for(const a of L){ if(sat(a)) continue; const ax=a.position.x, az=a.position.z, fl=a.userData.gy!==undefined?a.userData.gy:a.position.y;
    const out=(e,need)=>{ const d=softDist(e,ax,az); if(d>=need) return;
      let nx=ax-_sc[0], nz=az-_sc[1], l=Math.hypot(nx,nz);
      if(l<1e-4){ nx=ax-(e.t===3?e.x:e.t===2?e.ax:e.cx); nz=az-(e.t===3?e.z:e.t===2?e.az:e.cz); l=Math.hypot(nx,nz); if(l<1e-4){ nx=1; nz=0; l=1; } }
      const push=(need-d)*k; shove(a,nx/l*push,nz/l*push); };
    for(const e of P){ if(e.g===a) continue;
      if(e.beam?(e.y1<fl+0.9||e.y0>fl+1.9):(e.y1<fl+0.1||e.y0>fl+1.6)) continue;
      out(e,e.beam?0.3:0.22); }
    const q=++S.q, near=[];
    for(let i=Math.floor(ax-0.5);i<=Math.floor(ax+0.5);i++) for(let j=Math.floor(az-0.5);j<=Math.floor(az+0.5);j++){ const C=S.grid.get(softK(i,j)); if(!C) continue;
      for(const e of C){ if(e.q===q) continue; e.q=q; if(e.m&&e.m.visible&&e.y1>=fl+0.1&&e.y0<=fl+1.6) near.push(e); } }
    for(const e of near) out(e,0.22); }
}
/* is a point inside or against someone? (the eye is never set there) */
function inBody(p){
  const near=(g,r)=>{ if(!g||!g.visible) return false; const dx=p[0]-g.position.x, dz=p[2]-g.position.z;
    return dx*dx+dz*dz<r*r&&p[1]>g.position.y-0.2&&p[1]<g.position.y+2.0; };
  for(const id in ctx.actors) if(near(ctx.actors[id],0.5)) return true;
  for(const q of ctx.crowdPts||[]) if((p[0]-q[0])**2+(p[2]-q[2])**2<0.25&&p[1]>q[1]-0.2&&p[1]<q[1]+2.0) return true;   /* nor inside one of the crowd */
  return !ctx.playerHidden&&near(player,0.5);
}
/* INTO THE SEA (Mark 5:13): a beast of a herd driven over runs straight for the edge at a gallop,
   down whatever lies between; where the ground falls away under it, it falls — on, and down, nose
   first — strikes the water in a splash, goes under, and is not seen again. */
/* the ground under a beast where it is now — a headland, a hilltop — not only the ground a man
   would stand on (on a set's level ground that is looked for no higher than a little over him) */
function groundUnder(x,z,y){ return ctx.groundY(x,z,Math.max(y,ctx.groundY(x,z))+1.5); }
function plunge(s,u,dt){
  const P=u.plunge, p=s.position;
  if(P.wait>0){ P.wait-=dt; return; }
  if(P.sunk) return;
  if(!P.fall){
    const dx=P.to[0]-p.x, dz=P.to[1]-p.z, d=Math.hypot(dx,dz)||1, sp=u.sp;
    p.x+=dx/d*dt*sp; p.z+=dz/d*dt*sp; s.rotation.y=Math.atan2(dx,dz);
    const gy=groundUnder(p.x,p.z,p.y);
    if(gy<p.y-1.4){ P.fall=true; P.vx=dx/d*sp*0.45; P.vz=dz/d*sp*0.45; P.vy=0.6; s.rotation.order='YXZ'; }
    else p.y=gy;
    if(s.children[0]&&K().tickGait){ u.ent=u.ent||{m:s.children[0]}; K().tickGait(u.ent,u.kind||'sheep',sp*S,dt); }
    return; }
  if(!P.wet){
    P.vy-=9.8*dt; p.x+=P.vx*dt; p.z+=P.vz*dt; p.y+=P.vy*dt; s.rotation.x=Math.min(1.3,s.rotation.x+dt*1.8);
    const gy=groundUnder(p.x,p.z,p.y);
    if(p.y<=0.02){ P.wet=true; P.vy=-1.2; p.y=0;                                         /* the sea */
      const w=ctx.scene.localToWorld(new THREE.Vector3(p.x,0.1,p.z)); if(K().splash) K().splash(w.x,w.y,w.z,true); }
    else if(gy>0.3&&p.y<=gy){ p.y=gy; P.fall=false; s.rotation.x=0; }                 /* a ledge: on its feet, and on */
    return; }
  P.vx*=Math.max(0,1-dt*3); P.vz*=Math.max(0,1-dt*3); p.x+=P.vx*dt; p.z+=P.vz*dt; p.y+=P.vy*dt;
  if(p.y<-1.4){ P.sunk=true; s.visible=false; }
}
/* the flock grazes, and a lamb that has been gathered goes to the fold */
function moveFlock(dt,t){
  /* (about its ground, but not through a wall, a house, a table or a man: a goat went in at one side of a house
     and out at the other, and the hens walked through those at the meal) */
  const by=(x,z)=>{ for(const id in ctx.actors){ const g=ctx.actors[id], u=g.userData; if(!g.visible||u.sit||u.lie||u.kneel||u.ride||u.aboard) continue;
      if(Math.hypot(g.position.x-x,g.position.z-z)<0.5) return true; }
    return !!player&&!ctx.playerHidden&&Math.hypot(player.position.x-x,player.position.z-z)<0.5; };
  for(const s of ctx.flock){ const u=s.userData; u.t-=dt;
    if(u.plunge){ plunge(s,u,dt); continue; }
    const R=(u.roam||2)*2, sp=u.sp||0.5;
    if(u.t<0){ u.t=2+Math.random()*4; u.to=null;
      for(let n=0;n<6&&!u.to;n++){ const x=u.home[0]+(Math.random()-0.5)*R, z=u.home[1]+(Math.random()-0.5)*R, gy=ctx.groundY(x,z);
        if(isFinite(gy)&&!wallAt(x,z,gy)&&!softAt(x,z,gy,0.3,s,null)&&!by(x,z)) u.to=[x,z]; } }
    let going=false;
    if(u.to){ const dx=u.to[0]-s.position.x, dz=u.to[1]-s.position.z, d=Math.hypot(dx,dz);
      if(d>0.1){ const ax=s.position.x+dx/d*0.35, az=s.position.z+dz/d*0.35;
        if(wallAt(ax,az,s.position.y)||softAt(ax,az,s.position.y,0.25,s,u.to)||by(ax,az)){ u.to=null; u.t=Math.min(u.t,0.6); }   /* (stopped short: another way in a moment) */
        else { s.position.x+=dx/d*dt*sp; s.position.z+=dz/d*dt*sp; s.rotation.y=Math.atan2(dx,dz); going=true; } } }
    if(s.children[0]&&K().tickGait){ u.ent=u.ent||{m:s.children[0]}; K().tickGait(u.ent,u.kind||'sheep',going?sp*S:0,dt); }
    s.position.y=ctx.groundY(s.position.x,s.position.z); }
  for(const id in ctx.things){ const o=ctx.things[id], u=o.userData;
    if(u.goTo){ const dx=u.goTo[0]-o.position.x, dz=u.goTo[1]-o.position.z, d=Math.hypot(dx,dz);
      if(d>0.2){ const sp=u.wheel?1.5:2.4; o.position.x+=dx/d*dt*sp; o.position.z+=dz/d*dt*sp;
        if(u.wheel) u.wheel.rotation.x+=dt*sp/u.r;              /* a round stone rolls in its channel */
        else o.rotation.y=Math.atan2(dx,dz); } else u.goTo=null;
      /* (one set down from the witness's hands lies on the floor he stood on: the basin taken up to the room was
         left in the stone under its floor, at the street's height) */
      if(u.restRef!==undefined){ const f=ctx.groundY(o.position.x,o.position.z,u.restRef); if(f!=null&&isFinite(f)) o.position.y=f-(u.soft?u.soft[2]:0); } }
    /* CARRIED (the witness's `deliver`): in his two hands before him, at their height, its near side clear of his
       body — a beast across his arms — not dragged along the ground behind him through walls and stairs */
    if(u.following&&player){ handAt(player,'L',_h1); handAt(player,'R',_h2);
      const a=player.rotation.y, fx=Math.sin(a), fz=Math.cos(a), F=u.soft, across=!!(F&&F[4]), half=F?(across?F[0]:F[1]):0.12;
      const mx=(_h1.x+_h2.x)/2, mz=(_h1.z+_h2.z)/2, my=(_h1.y+_h2.y)/2, reach=(mx-player.position.x)*fx+(mz-player.position.z)*fz, out=Math.max(reach+0.04,0.22+half);
      o.position.set(player.position.x+fx*out,my-(F?(F[2]+F[3])/2:0)-0.02,player.position.z+fz*out); o.rotation.set(0,a+(across?Math.PI/2:0),0); } }
}
function updateCamera(dt){
  if(camTarget){                                  /* the story holds the camera */
    camT=Math.min(1,camT+dt/(camTarget.dur||2));
    const e=camT<0.5?2*camT*camT:1-Math.pow(-2*camT+2,2)/2;
    const fp=camTarget.from0, tp=camTarget.to;
    const M=camTarget.ride!==undefined&&ctx.lake&&ctx.lake.main, dy=M?(M.userData.heave||0)-camTarget.ride:0;   /* (an eye at sea, riding with her) */
    camera.position.set(fp[0]+(tp[0]-fp[0])*e,fp[1]+(tp[1]-fp[1])*e+dy,fp[2]+(tp[2]-fp[2])*e);
    const la=camTarget.look0, lb=camTarget.look;
    camera.lookAt(la[0]+(lb[0]-la[0])*e,la[1]+(lb[1]-la[1])*e+dy,la[2]+(lb[2]-la[2])*e);
    /* the player is not left filling the lens of a shot the story is holding */
    if(player&&!ctx.playerHidden) player.visible=camera.position.distanceTo(player.position.clone().setY(player.position.y+1))>2.2;
    quake(dt); return; }
  if(player&&!ctx.playerHidden) player.visible=true;
  if(!player) return;
  /* SHOT AND REVERSE SHOT: while one near the witness speaks and the scene has not set a
     camera, the eye goes over the witness's shoulder onto the one speaking — and, when it is
     He who speaks, over His shoulder onto the witness, so His face is never before it */
  const cs=convoShot();
  if(cs){ const k=Math.min(1,dt*3); camera.position.x+=(cs.from[0]-camera.position.x)*k; camera.position.y+=(cs.from[1]-camera.position.y)*k; camera.position.z+=(cs.from[2]-camera.position.z)*k;
    camera.lookAt(...cs.look); return; }
  if(keys.KeyQ) camYaw+=dt*1.8; if(keys.KeyR) camYaw-=dt*1.8;
  /* INDOORS (under a roof, through a doorway): the eye comes in close behind the shoulder and
     down level with the room, under the beams, so it never rides up into the roof or out
     through the wall; out under the sky again it goes back up and out to its own distance */
  const roof=underRoof(player.position.x,player.position.y,player.position.z);
  /* THROUGH A DOOR the eye does not follow him through the doorway: it CUTS, as a told story
     does, to a shot held within the room (or, going out, without it) that sees him come through
     the door, and when he has come in it goes back to his shoulder */
  if(ctx._roofRaw===undefined) ctx._roofRaw=roof;
  if(roof!==ctx._roofRaw){ ctx._roofRaw=roof; ctx.roomCam=null; ctx.doorShot=null;
    if(!ST.fast){ if(roof){ ctx.roomCam=doorShot(true); if(ctx.roomCam) dip(); }
      else { const D=doorShot(false); if(D){ ctx.doorShot=D; dip(); } } } }
  /* INSIDE, the eye is the room's own, as Story Mode's is: held at a place in the room and
     turning to keep him in view, and cut to another place when he is lost from it or comes
     too near it — and W walks him away from it, as the eye sees */
  if(roof){ const p=player.position, head=[p.x,p.y+1.25,p.z]; let R=ctx.roomCam;
    if(R){ R.chk=(R.chk||0)-dt; const d=Math.hypot(p.x-R.from[0],p.z-R.from[2]);
      if(d<1.1||d>7||(R.chk<0&&(R.chk=0.4,!lineClear(R.from,head)))) R=null; }
    if(!R&&!ST.fast){ R=roomCam(); if(R&&ctx.roomCam) dip(); }
    ctx.roomCam=R;
    if(R){ camera.position.set(...R.from); camera.lookAt(...head);
      camYaw=Math.atan2(R.from[0]-p.x,R.from[2]-p.z); player.visible=!ctx.playerHidden; ctx._in=1; quake(dt); return; } }
  if(ctx.doorShot){ const D=ctx.doorShot; D.t+=dt;
    const p=player.position, gone=Math.hypot(p.x-D.at[0],p.z-D.at[1]);
    if(D.t<D.dur&&gone<4.2&&!(keys.KeyQ||keys.KeyR)){
      camera.position.set(...D.from); camera.lookAt(p.x,p.y+1.25,p.z); player.visible=!ctx.playerHidden;
      ctx._in=0; quake(dt); return; }
    ctx.doorShot=null; camYaw=player.rotation.y+Math.PI; }
  ctx._in=(ctx._in||0)+((roof?1:0)-(ctx._in||0))*Math.min(1,dt*(roof?4:2));
  const ins=ctx._in, dist=camDist+(2.3-camDist)*ins, pitch=camPitch+(0.1-camPitch)*ins;
  const tx=player.position.x, ty=player.position.y+1.6-0.12*ins, tz=player.position.z;
  const want=[tx+Math.sin(camYaw)*Math.cos(pitch)*dist, ty+Math.sin(pitch)*dist, tz+Math.cos(camYaw)*Math.cos(pitch)*dist];
  want[1]=Math.max(want[1],ctx.groundY(want[0],want[2])+0.6);
  { const c=pullIn(want,[tx,ty,tz]); want[0]=c[0]; want[1]=c[1]; want[2]=c[2]; }
  /* drawn in toward the witness at once (never left a moment inside a wall); let out again gently */
  const dNow=Math.hypot(camera.position.x-tx,camera.position.y-ty,camera.position.z-tz), dWant=Math.hypot(want[0]-tx,want[1]-ty,want[2]-tz);
  const k=dWant<dNow-0.05&&!camFree([camera.position.x,camera.position.y,camera.position.z])?1:Math.min(1,dt*6);
  camera.position.x+=(want[0]-camera.position.x)*k; camera.position.y+=(want[1]-camera.position.y)*k; camera.position.z+=(want[2]-camera.position.z)*k;
  camera.lookAt(tx,ty,tz);
  /* and so close that the eye would be inside the witness's own head, the witness is not drawn */
  if(!ctx.playerHidden) player.visible=Math.hypot(camera.position.x-tx,camera.position.y-ty,camera.position.z-tz)>0.75;
  quake(dt);
}
/* THE DOORS of the set's houses open before whoever comes to them — the witness, the story's
   people, the townsfolk — and swing shut again behind them; no one walks through a shut leaf */
function doorsTick(dt){
  const k=K(); if(!k.houses||!player) return;
  const near=(x,z)=>{ const r2=2.3*2.3, t=(g)=>g&&g.visible&&(g.position.x-x)**2+(g.position.z-z)**2<r2;
    if(!ctx.playerHidden&&(player.position.x-x)**2+(player.position.z-z)**2<r2) return true;      /* (the witness, though the eye be too close to draw him) */ for(const id in ctx.actors) if(t(ctx.actors[id])) return true;
    for(const F of ctx.folk||[]) if(t(F.g)) return true; return false; };
  for(const H of k.houses()){ const D=H.door; if(!D||!D.mesh) continue;
    const x=(H.dx-anchor.x)/SX, z=(H.dz-anchor.z)/SX;
    if(Math.abs(x-player.position.x)>90||Math.abs(z-player.position.z)>90) continue;
    D.target=near(x,z)?D.base+D.swing:D.base;
    if(Math.abs(D.ang-D.target)>0.001){ D.ang+=(D.target-D.ang)*Math.min(1,dt*5); D.mesh.rotation.y=D.ang; } } }
/* the held shot at a doorway: going in, from deep in the room and to one side, looking back at
   him in the door; going out, from the yard before the door. The first such place clear of
   the walls with a clear line to him is taken; failing all, the eye just follows. */
function doorShot(inside){
  const p=player.position, f=player.rotation.y, fx=Math.sin(f), fz=Math.cos(f), sx=fz, sz=-fx;
  const ds=inside?[3.4,2.9,2.4,1.9]:[5.0,4.2,3.4], ls=inside?[1.3,-1.3,0.8,-0.8,0]:[1.8,-1.8,0.9,-0.9,0], h=inside?1.75:2.3;
  const head=[p.x,p.y+1.3,p.z];
  for(const d of ds) for(const l of ls){
    const x=p.x+fx*d+sx*l, z=p.z+fz*d+sz*l, from=[x,p.y+h,z];
    if(!camFree(from)) continue;
    if(inside!==underRoof(x,p.y,z)) continue;                /* the shot stands on the same side of the door as he is going */
    if(!lineClear(from,head)) continue;
    return {from,at:[p.x,p.z],t:0,dur:inside?2.6:2.2,chk:0.4}; }
  return null; }
/* a place in the room to watch him from: about him at two or three metres, up under the
   beams, clear of the walls and the furniture, under the same roof, with a clear line to him —
   the farthest such, before him rather than behind */
function roomCam(){
  const p=player.position, head=[p.x,p.y+1.25,p.z], f=player.rotation.y; let best=null, bs=-1e9;
  for(const r of [3.0,2.5,2.0,1.6]) for(let i=0;i<12;i++){ const a=i/12*Math.PI*2, x=p.x+Math.sin(a)*r, z=p.z+Math.cos(a)*r;
    const from=[x,p.y+1.95,z];
    if(!camFree(from)||!underRoof(x,p.y,z)) continue;
    let da=a-f; while(da>Math.PI) da-=Math.PI*2; while(da<-Math.PI) da+=Math.PI*2;
    let open=0; for(const [ox,oz] of [[0.75,0],[-0.75,0],[0,0.75],[0,-0.75]]) if(camFree([x+ox,from[1],z+oz])) open++;   /* room about it: no shelf or bed filling the lens */
    const sc=r*2-Math.abs(da)*0.6+open*0.9; if(sc<=bs) continue;
    if(!lineClear(from,head)) continue;
    bs=sc; best={from,chk:0.4}; }
  return best; }
/* the blink of a cut */
function dip(){ const f=$('fade'); if(!f) return; f.style.transition='none'; f.style.opacity=0.85; void f.offsetWidth; f.style.transition='opacity 0.35s'; f.style.opacity=0; }
/* a roof (or the floor of an upper room, or a lintel) over the head here: the world's blocks
   between two and four metres above the feet */
function underRoof(x,y,z){ const k=K(); if(!k.solidAt) return false;
  for(const h of [2.0,2.6,3.2,3.8]) if(k.solidAt(anchor.x+x*SX,anchor.y+(y+h)*S,anchor.z+z*SX)) return true;
  return false; }
/* "there was a great earthquake" (Mattithyahu 28:2): the eye is shaken, hard and then less */
function quake(dt){
  if(!ctx||!(ctx.quake>0)) return;
  ctx.quake=Math.max(0,ctx.quake-dt); const a=Math.min(1,ctx.quake)*0.14;
  camera.position.x+=(Math.random()-0.5)*a; camera.position.y+=(Math.random()-0.5)*a; camera.position.z+=(Math.random()-0.5)*a;
}
function convoShot(){
  if(ST.fast||!speaking||!player||ctx.playerHidden||!$('sverse')||$('sverse').classList.contains('off')) return null;
  const g=ctx.actors[speaking]; if(!g||!g.visible) return null;
  const p=player.position, q=g.position, dx=q.x-p.x, dz=q.z-p.z, d=Math.hypot(dx,dz);
  if(d>8||d<0.7) return null;
  const ux=dx/d, uz=dz/d, sx=uz, sz=-ux;
  let from, look;
  if(g.userData.holy){ from=[q.x+ux*2.4+sx*1.1, q.y+2.15, q.z+uz*2.4+sz*1.1]; look=[p.x,p.y+1.45,p.z]; }
  else { from=[p.x-ux*1.6+sx*0.8, p.y+1.95, p.z-uz*1.6+sz*0.8]; look=[q.x,q.y+1.5*(g.userData.s||1),q.z]; }
  if(from[1]<ctx.groundY(from[0],from[2])+0.5) return null;
  const k=K(); if(k.solidAt(anchor.x+from[0]*SX,anchor.y+from[1]*S,anchor.z+from[2]*SX)) return null;
  return {from,look};
}
/* HIS FACE IS NEVER SHOWN. Yahusha has a body like every man's; His face is never seen.
   Every frame, for each figure marked holy (and the Child in the trough), this asks whether
   the camera stands anywhere but behind His head and could see it; if so it tips the camera
   until the head is out of the picture — so a shot frames His body, His arms and hands, or the
   back of His head, and never His face, whoever set the camera there: a scene, or the player. */
const _v=new THREE.Vector3(), _h=new THREE.Vector3();
function holyHeads(){
  const out=[];
  for(const id in ctx.actors){ const g=ctx.actors[id], u=g.userData; if(!u.holy||!g.visible) continue;
    const sc=u.s||1, y=g.position.y+(u.headY||1.82*sc);
    out.push({p:new THREE.Vector3(g.position.x,y,g.position.z), f:new THREE.Vector3(Math.sin(g.rotation.y),0,Math.cos(g.rotation.y)), r:0.26*sc, a:1}); }
  for(const id in ctx.things){ const o=ctx.things[id], u=o.userData; if(!u.holy||!o.visible) continue;
    o.updateMatrixWorld(); const hp=u.head.getWorldPosition(new THREE.Vector3());
    out.push({p:hp, f:u.faceDir.clone().applyQuaternion(o.quaternion), r:0.12}); }
  return out;
}
function seen(H){                                   /* is any of the head inside the picture? */
  for(const dy of [-H.r,0,H.r]) for(const dx of [-H.r,H.r]){
    _v.set(H.p.x+dx,H.p.y+dy,H.p.z).project(camera);
    if(_v.z<1&&Math.abs(_v.x)<1.04&&Math.abs(_v.y)<1.04) return true; }
  return false;
}
/* for the test harness: is a holy face in the picture right now? (it never should be) */
function faceExposed(){
  if(!ctx) return 0; camera.updateMatrixWorld(); let n=0;
  for(const H of holyHeads()){ _h.copy(camera.position).sub(H.p); const d=_h.length(); if(d>45||d<0.01) continue; _h.divideScalar(d);
    if(H.f.y>0.5){ if(_h.y<0.35) continue; } else { if(_h.y>0.82) continue; const fl=Math.hypot(_h.x,_h.z); if(fl<1e-3||(H.f.x*_h.x+H.f.z*_h.z)/fl<-0.05) continue; }
    if(seen(H)) n++; }
  return n;
}
function guardFace(){
  if(!ctx) return;
  camera.updateMatrixWorld();
  for(const H of holyHeads()){
    _h.copy(camera.position).sub(H.p); const d=_h.length(); if(d>45||d<0.01) continue;
    _h.divideScalar(d);
    if(H.f.y>0.5){ if(_h.y<0.35) continue; }         /* lying face-up: only from above could it be seen */
    else { if(_h.y>0.82) continue;                     /* from high above: the head-cloth, not the face */
      const fl=Math.hypot(_h.x,_h.z); if(fl<1e-3||(H.f.x*_h.x+H.f.z*_h.z)/fl<-0.05) continue; }   /* from behind: allowed */
    let tip=0;
    for(let k=0;k<70&&seen(H);k++){                 /* tip the camera until the head leaves the frame */
      _v.copy(H.p).project(camera);
      camera.rotateX(_v.y>=0?-0.025:0.025); camera.updateMatrixWorld(); tip+=0.025; }
    if(tip>0.2&&camTarget&&camT>=1){ const k=(act&&act.scenes[sceneIx].id)+'#'+beatIx; ST.tipped=ST.tipped||{}; ST.tipped[k]=Math.max(ST.tipped[k]||0,tip); }
  }
}
/* A shot set by a scene that would look on His face is taken instead from behind His
   shoulder, looking at what the scene wanted to look at — so a scene can be written with an
   ordinary camera and still never show it. */
const _tc=new THREE.PerspectiveCamera(55,1,0.1,2000);
function exposedFrom(from,at){
  _tc.aspect=camera.aspect; _tc.updateProjectionMatrix(); _tc.position.set(...from); _tc.lookAt(...at); _tc.updateMatrixWorld();
  for(const H of holyHeads()){ _h.set(...from).sub(H.p); const d=_h.length(); if(d>45||d<0.01) continue; _h.divideScalar(d);
    if(H.f.y>0.5){ if(_h.y<0.35) continue; } else { if(_h.y>0.82) continue; const fl=Math.hypot(_h.x,_h.z); if(fl<1e-3||(H.f.x*_h.x+H.f.z*_h.z)/fl<-0.05) continue; }
    /* a wall or a roof between the eye and His head: the face is not seen from there */
    if(H.a&&!lineClear(from,[H.p.x,H.p.y,H.p.z])) continue;
    for(const dy of [-H.r,0,H.r]){ _v.set(H.p.x,H.p.y+dy,H.p.z).project(_tc); if(_v.z<1&&Math.abs(_v.x)<1.04&&Math.abs(_v.y)<1.04) return H; } }
  return null;
}
function faceSafe(from,at){
  const H=exposedFrom(from,at); if(!H||H.f.y>0.5) return from;
  const sd=new THREE.Vector3(H.f.z,0,-H.f.x), side=(from[0]-H.p.x)*sd.x+(from[2]-H.p.z)*sd.z>=0?1:-1;
  const d=Math.min(6,Math.max(3.4,Math.hypot(from[0]-H.p.x,from[2]-H.p.z)*0.6));
  const out=[H.p.x-H.f.x*d+sd.x*1.6*side, H.p.y+0.5, H.p.z-H.f.z*d+sd.z*1.6*side];
  const gy=ctx.groundY(out[0],out[2]); if(out[1]<gy+0.6) out[1]=gy+0.6;
  return out;
}
/* a shot of Him (`cam` with on:'yahusha'): 'back' — over His shoulder toward whom He speaks to;
   'body' — before Him, low, framing hands and robe and no higher than the chest */
function shotOf(B){
  const g=ctx.actors[B.on]; if(!g) return null;
  const f=new THREE.Vector3(Math.sin(g.rotation.y),0,Math.cos(g.rotation.y)), sd=new THREE.Vector3(f.z,0,-f.x), p=g.position;
  const sit=g.userData.sit?-0.62:0;
  if(B.shot==='body'){ /* close, at His chest: the picture runs from the knees to below the chin — hands, arms, robe */
    const k=g.userData.s||1, fx=p.x+f.x*1.6*k+sd.x*0.3, fz=p.z+f.z*1.6*k+sd.z*0.3;
    return {from:[fx,p.y+(1.25+sit)*k,fz], look:[p.x,p.y+(0.95+sit)*k,p.z]}; }
  const m=B.toward&&!ctx.actors[B.toward]&&ctx.markers[B.toward];        /* toward a person, or a place (the city, far off) */
  let ta=B.toward&&ctx.actors[B.toward]||null;
  let t=ta?ta.position:m?new THREE.Vector3(m[0],(m[2]!==undefined?m[2]:(ctx.groundY(m[0],m[1])||0)+1.5)-1.3,m[1]):p.clone().addScaledVector(f,6);
  /* ---- HE IS SPOKEN OVER ONLY TOWARD WHAT IS BEFORE HIM ----
     One He speaks to who stands behind Him or at His side cannot be looked at over His shoulder:
     the eye stood between them and looked away from Him (the gate at 21:10). Then it looks where
     He faces, past Him. */
  { const dx=t.x-p.x, dz=t.z-p.z, d=Math.hypot(dx,dz);
    if(d>0.3&&dx*f.x+dz*f.z<0.25*d){ const L=Math.max(5,d); t=new THREE.Vector3(p.x+f.x*L,p.y,p.z+f.z*L); ta=null; } }
  const side=B.side||1;
  let shot;
  if(B.back!==undefined||B.lift!==undefined){                            /* `back`, `lift`: a hand-set shot keeps its numbers */
    const bk=B.back||3.6, up=B.lift||0;
    shot={from:[p.x-f.x*bk+sd.x*1.5*side,p.y+2.3+sit+up,p.z-f.z*bk+sd.z*1.5*side], look:[t.x,t.y+1.3,t.z]}; }
  else {
    /* ---- AND THE TWO HEADS ARE THE PICTURE ----
       The eye stood half a metre over His head and looked at the chest of one six or eight metres
       off: on the true earth's terraces, with the one He speaks to a step higher, His head dropped
       below the middle of the frame and His body under the verse. It stands close at His shoulder
       now, level with the higher of the two heads, and looks between them — both faces held above
       the words, the one He speaks to near enough to be seen. */
    const k=g.userData.s||1, head=p.y+(1.82+sit)*k;
    const th=t.y+(ta?(ta.userData.sit?0.95:1.55)*(ta.userData.s||1):1.5), eye=Math.max(head,th)+0.12;
    shot={from:[p.x-f.x*2.4+sd.x*1.3*side, eye, p.z-f.z*2.4+sd.z*1.3*side], look:[t.x,(eye+th)/2-0.15,t.z]}; }
  /* ---- NOR ARE THOSE WHO FOLLOW HIM BETWEEN ----
     The disciples walk a pace or two behind Him, which is exactly where the eye stands: the
     picture was their backs. If another figure stands on the line from the eye to His head, the
     eye rises over them, or crosses to His other shoulder, or rises again. */
  const hx=p.x, hy=p.y+(1.6+sit)*(g.userData.s||1), hz=p.z;
  const blockedBy=fr=>{ for(const id in ctx.actors){ const a=ctx.actors[id]; if(a===g||a===ta||!a.visible) continue;
      const q=a.position, s=a.userData.s||1, ax=hx-fr[0], ay=hy-fr[1], az=hz-fr[2], L2=ax*ax+az*az; if(L2<1e-6) continue;
      const u=Math.max(0,Math.min(1,((q.x-fr[0])*ax+(q.z-fr[2])*az)/L2));
      if(u<0.02||u>0.97) continue;
      const cx=fr[0]+ax*u, cz=fr[2]+az*u, cy=fr[1]+ay*u;
      if((q.x-cx)**2+(q.z-cz)**2<0.35*0.35&&cy>q.y&&cy<q.y+1.9*s) return true; }
    return false; };
  if(blockedBy(shot.from)){
    const base=shot.from, other=[p.x+(base[0]-p.x)-2*sd.x*((base[0]-p.x)*sd.x+(base[2]-p.z)*sd.z), base[1], p.z+(base[2]-p.z)-2*sd.z*((base[0]-p.x)*sd.x+(base[2]-p.z)*sd.z)];
    for(const c of [[base[0],base[1]+1.2,base[2]],other,[base[0],base[1]+2.4,base[2]],[other[0],other[1]+1.2,other[2]]])
      if(!blockedBy(c)){ shot.from=c; break; } }
  return shot;
}
function holdCamera(from,look,dur){
  camTarget={from0:[camera.position.x,camera.position.y,camera.position.z],
    look0:camTarget&&camTarget.ride===undefined?camTarget.look:lookNow(),to:clearShot(from,look),look,dur:dur||2}; camT=0;   /* (from one riding with her: where it looked this moment) */
}
/* A CLEAR SHOT: the blocks of the world stand where they stand, and a shot written for a scene
   can find a wall, a roof, a tree or a hillside between the eye and what it looks at. The eye
   is brought in along its line of sight, from what it looks at, to the last point with nothing
   solid between — so the subject is always seen. (Drawn in toward the subject, the eye stays on
   the same side of it: a shot from behind His shoulder stays behind it.) */
const _ray=new THREE.Raycaster();
/* is the line from the eye to a point of the scene open? (blocks of the world, its growing
   things, the set's details — everything drawn but the people and the light) */
function lineClear(from,to){
  const k=K(), W=v=>new THREE.Vector3(anchor.x+v[0]*SX,anchor.y+v[1]*S,anchor.z+v[2]*SX);
  const a=W(to), b=W(from), dir=b.clone().sub(a), L=dir.length(); if(L<0.4*S) return true;
  dir.divideScalar(L);
  const n=Math.ceil(L/(0.25*S));
  for(let i=Math.ceil(0.5*S/(0.25*S));i<=n;i++){ const t=i/n; if(k.solidAt(a.x+dir.x*L*t,a.y+dir.y*L*t,a.z+dir.z*L*t)) return false; }
  const targets=[k.chunkRoot]; root.traverse(o=>{ if(o.name==='story-details') targets.push(o); });
  _ray.set(a.clone().addScaledVector(dir,0.5*S),dir); _ray.far=L-0.5*S;
  /* (still water is no wall to the eye: its face is drawn clear from above, and where a set lays its own
     waves it is not drawn at all — yet the ray met it, and every shot of a man in a boat was lifted
     straight overhead) */
  return !_ray.intersectObjects(targets,true).some(h=>h.object.visible!==false&&!(h.object.material&&(h.object.material.name==='waterB'||(h.object.material.transparent&&h.object.material.opacity<0.5))));
}
/* the follow camera, each frame: brought in along its line until no block stands between */
function pullIn(from,look){
  /* walked out from the head toward where the eye would be, in short steps, stopping a hand's
     breadth short of the first block met — or of one beside the line (a door-jamb) that the
     lens, being a little wide, would cut into */
  const k=K(); let t=1; const L=Math.hypot(from[0]-look[0],from[1]-look[1],from[2]-look[2]), n=Math.max(8,Math.ceil(L/0.18));
  const hit=(x,y,z)=>{ const wx=anchor.x+x*SX, wy=anchor.y+y*S, wz=anchor.z+z*SX, m=0.22*S;
    return k.solidAt(wx,wy,wz)||k.solidAt(wx+m,wy,wz)||k.solidAt(wx-m,wy,wz)||k.solidAt(wx,wy,wz+m)||k.solidAt(wx,wy,wz-m)||k.solidAt(wx,wy+m,wz); };
  for(let i=1;i<=n;i++){ const f=i/n, x=look[0]+(from[0]-look[0])*f, y=look[1]+(from[1]-look[1])*f, z=look[2]+(from[2]-look[2])*f;
    if(hit(x,y,z)){ t=Math.max(0.1,(i-1)/n); break; } }
  return [look[0]+(from[0]-look[0])*t,look[1]+(from[1]-look[1])*t,look[2]+(from[2]-look[2])*t];
}
function camFree(p){ const k=K(), B=k.B, x=anchor.x+p[0]*SX, y=anchor.y+p[1]*S, z=anchor.z+p[2]*SX;
  return !k.solidAt(x,y,z)&&!k.solidAt(x,y+0.35*S,z)&&!k.solidAt(x,y-0.35*S,z)&&!k.solidAt(x+0.4*S,y,z)&&!k.solidAt(x-0.4*S,y,z)&&!k.solidAt(x,y,z+0.4*S)&&!k.solidAt(x,y,z-0.4*S); }
/* A CLEAR SHOT. The blocks of the world stand where they stand, and a shot written for a scene
   can find a wall, a roof, a tree or a hillside between the eye and what it looks at. When it
   does, the eye looks for the nearest place to the one the scene asked for — turned a little
   about the subject, nearer or farther, higher — from which the subject is seen, head and
   feet, with nothing between; never one that would look on His face. Failing every one, it is
   brought in along its own line until the subject is seen. */
function clearShot(from,look){
  if(!anchor||!root) return from;
  /* the feet of what is looked at — never below the ground, as they would be under one lying down */
  const gl=ctx.groundY(look[0],look[2]), low=[look[0],Math.max(look[1]-0.9,(gl==null?look[1]-0.9:gl)+0.2),look[2]];
  const ok=p=>camFree(p)&&!inBody(p)&&lineClear(p,look)&&lineClear(p,low)&&!exposedFrom(p,look);
  if(ok(from)) return from;
  const dx=from[0]-look[0], dz=from[2]-look[2], d0=Math.max(1.5,Math.hypot(dx,dz)), a0=Math.atan2(dx,dz), h0=from[1]-look[1];
  let best=null, bs=1e9;
  for(const da of [0,0.35,-0.35,0.7,-0.7,1.05,-1.05,1.5,-1.5,2.0,-2.0,2.6,-2.6,Math.PI])
    for(const dk of [1,0.75,1.3,0.55,1.7])
      for(const dh of [0,1.2,2.6,4.5]){
        const score=Math.abs(da)*2+Math.abs(Math.log(dk))*2.2+dh*0.45; if(score>=bs) continue;
        const d=d0*dk, a=a0+da, p=[look[0]+Math.sin(a)*d, look[1]+h0+dh, look[2]+Math.cos(a)*d];
        const gy=ctx.groundY(p[0],p[2]); if(p[1]<gy+0.6) p[1]=gy+0.6;
        if(ok(p)){ best=p; bs=score; } }
  if(best) return best;
  /* nothing clear about it: in along the line to the subject */
  for(let t=0.9;t>0.15;t-=0.08){ const p=[look[0]+(from[0]-look[0])*t,look[1]+(from[1]-look[1])*t,look[2]+(from[2]-look[2])*t]; if(camFree(p)&&!inBody(p)&&lineClear(p,look)) return p; }
  return from;
}
function lookNow(){ const d=new THREE.Vector3(); camera.getWorldDirection(d);
  return [camera.position.x+d.x*10,camera.position.y+d.y*10,camera.position.z+d.z*10]; }
/* what the eye is on: the scene's held subject, or the witness, or ten metres ahead */
function lookAtNow(){ if(camTarget) return camTarget.look;
  if(player&&!ctx.playerHidden) return [player.position.x,player.position.y+1.2,player.position.z];
  return lookNow(); }
function releaseCamera(){ camTarget=null; if(player){ camYaw=player.rotation.y+Math.PI; } }

/* ================= FACES THAT SPEAK ================= */
/* The one speaking moves the mouth with the words, vowel by vowel; the brows and the corners
   of the mouth show what the words carry, only joy turning it up; now and then an eye blinks.
   (After Scripture-Game's face.js.) Yahusha has no face drawn and none is ever seen (guardFace);
   a mal'ak is seen within his light, and the light swells with the words. */
const SV=window.STORYVOICE;
function talkingAs(id){ const T=SV.talk, sp=T&&T.sp; if(!sp) return null;
  return (sp.actor===id||(sp.actors&&sp.actors.indexOf(id)>=0)||(sp.glow&&id==='glow:'+sp.glow))?T:null; }
function animFace(g,id,dt){
  const u=g.userData, F=u.face, T=talkingAs(id), m=T?(SV.mouth(T.sp.key)||0):0;
  if(u.aura){ const k=1+m*0.22+(T?0.06:0); u.aura.sprite.scale.setScalar(u.aura.base*k); }
  if(u.setFace){                             /* the voyage's figure: its face drawn in each state */
    u.blink=(u.blink||3)-dt; const shut=u.blink<0||u.mood==='sleep'; if(u.blink<-0.13) u.blink=2.5+Math.random()*4;   /* `sleep`: asleep, or the dead (Acts 9:37) — the eyes kept shut */
    u.talkM=T?m:undefined;
    /* the feeling: the speaker's from the words; a `mood` the scene has set; or, for those
       standing by one who speaks, the words' feeling as it falls on the hearer — gladness on
       the glad, grief on the grieved, fear and wonder spreading; a rebuke does not make them glad */
    let ex=T?SV.expr(T.text):'calm';
    if(u.mood) ex=u.mood==='sleep'?'calm':u.mood;
    else if(!T&&speaking&&speaking!==id&&ctx.actors[speaking]){ const S2=talkingAs(speaking), sp=ctx.actors[speaking];
      if(S2&&Math.hypot(sp.position.x-g.position.x,sp.position.z-g.position.z)<9){ const e2=SV.expr(S2.text);
        ex={joy:'joy',sorrow:'sorrow',weep:'sorrow',fear:'fear',awe:'awe'}[e2]||'calm'; } }
    else if(!T&&SV.talk&&SV.talk.sp&&SV.talk.sp.kind==='narrator'){                     /* "and they were greatly afraid": the Besorah's telling on their faces */
      const e3=SV.expr(SV.talk.text); if(e3==='fear'||e3==='awe'||e3==='joy'||e3==='weep'||e3==='sorrow') ex=e3; }
    u.setFace(Math.min(1,m*1.4),shut,ex);
    /* THE HEAD TURNS TO WHOEVER IS SPEAKING (or, near, to the witness) — never His: the
       direction His head faces is what keeps every camera from His face */
    if(u.head&&!u.holy){ let tgt=null;
      if(speaking&&speaking!==id&&ctx.actors[speaking]) tgt=ctx.actors[speaking].position;
      else if(!T&&player&&!ctx.playerHidden&&g!==player&&Math.hypot(player.position.x-g.position.x,player.position.z-g.position.z)<4) tgt=player.position;
      let want=0;
      if(tgt){ let a=Math.atan2(tgt.x-g.position.x,tgt.z-g.position.z)-g.rotation.y; while(a>Math.PI) a-=Math.PI*2; while(a<-Math.PI) a+=Math.PI*2;
        want=Math.max(-0.75,Math.min(0.75,a)); }
      u.head.rotation.y+=(want-u.head.rotation.y)*Math.min(1,dt*4); }
    return; }
  if(!F) return;
  const ex=T?SV.expr(T.text):'calm';
  F.mIn.scale.y=0.018+m*0.075; F.mIn.position.y=-(0.009+m*0.0375);
  const cy=ex==='joy'?0.011:(ex==='sorrow'||ex==='weep')?-0.011:0;
  F.cL.position.y=F.cR.position.y=cy-0.009; F.cL.visible=F.cR.visible=cy!==0||m>0.05;
  const rot=ex==='stern'?0.32:(ex==='sorrow'||ex==='fear'||ex==='weep')?-0.28:ex==='awe'?-0.12:0;
  F.browL.rotation.z=-rot; F.browR.rotation.z=rot;
  F.browL.position.y=F.browR.position.y=F.by+(ex==='awe'||ex==='fear'?0.012:ex==='stern'?-0.007:0);
  F.blink-=dt; const shut=F.blink<0;
  F.eyeL.scale.y=F.eyeR.scale.y=shut?0.15:(ex==='fear'||ex==='awe'?1.25:ex==='stern'?0.7:1);
  if(F.blink<-0.12) F.blink=2.5+Math.random()*4;
}

/* ================= WHO SPEAKS — the one the Besorah says ================= */
/* A beat names who speaks the words in its quotation marks: `who` (a figure in the scene,
   or one of the act's `cast`), `whoName`, or `voices:[…]` — one for each quotation, in
   order, when a verse has more than one speaker ("Are you Aliyahu?" So he said, "I am not.").
   Everything outside the marks is the telling: the Besorah's own voice. */
const NARR=SV.NARR;
function speakerOf(spec){
  const defs={}; for(const id in ctx.actors) defs[id]=Object.assign({},ctx.actors[id].userData.def,{name:ctx.actors[id].userData.name});
  return SV.speaker(spec,defs,act&&act.cast);
}

/* ================= THE PORTRAIT in the verse box ================= */
/* the face of the one speaking, drawn in pixels, its mouth moving with the words; the
   narrator is the scroll; a mal'ak, the voice out of the shamayim and He who is shown as
   light are light, and have no face */
let portrait=null;
function hex(c){ return '#'+(c>>>0).toString(16).padStart(6,'0'); }
function drawPortrait(){
  const cv=$('v-face'); if(!cv||!portrait) return; const g=cv.getContext('2d'), sp=portrait;
  const R=(x,y,w,h,c)=>{ g.fillStyle=c; g.fillRect(x,y,w,h); };
  g.clearRect(0,0,38,38);
  const light=sp.kind==='angel'||sp.kind==='divine'||sp.kind==='yahusha'||sp.holy||sp.light;
  const T=SV.talk, talking=T&&T.sp&&T.sp.key===sp.key, m=talking?(SV.mouth(sp.key)||0):0;
  if(sp.kind==='narrator'){ R(0,0,38,38,'#201a13');
    R(9,11,20,16,'#e2d3ad'); R(7,9,3,20,'#b89c6a'); R(28,9,3,20,'#b89c6a');
    for(let k=0;k<4;k++) R(12,14+k*3,14-(k%2)*4,1,'#7a6448'); return; }
  if(sp.kind==='yahusha'||sp.holy){ /* His face is never shown: the back of His head, His shoulders (the boy's too) */
    const L=sp.look||{}; R(0,0,38,38,'#2a2219');
    R(6,27,26,11,hex(L.robe||0xd6c9a8)); R(4,30,7,8,hex(L.sash||0x3f5a8a)); R(27,30,7,8,hex(L.sash||0x3f5a8a));
    R(12,8,14,20,hex(L.cloth||0xe2d8c0)); R(11,10,16,6,hex(L.cloth||0xe2d8c0));
    R(13,24,12,4,'rgba(0,0,0,0.12)');
    const T2=SV.talk; if(T2&&T2.sp&&T2.sp.key===sp.key){ const m=SV.mouth(sp.key)||0; g.fillStyle='rgba(242,210,122,'+(0.15+m*0.35)+')'; g.fillRect(0,0,38,2); g.fillRect(0,36,38,2); }
    return; }
  if(light){ const gr=g.createRadialGradient(19,18,1,19,18,19);
    const k=0.8+m*0.2+(talking?0.1:0);
    gr.addColorStop(0,'rgba(255,255,255,'+k+')'); gr.addColorStop(0.35,'rgba(255,240,200,'+(0.75*k)+')'); gr.addColorStop(1,'rgba(40,32,20,1)');
    g.fillStyle=gr; g.fillRect(0,0,38,38); return; }
  const L0=sp.look||{}, L=L0.fallen?Object.assign({},L0,window.STORYWORLD.FALLEN):L0, dr=L.dress||'';
  const skin=hex(L.skin||0x8a5a3a), robe=hex(L.robe||0x9a8466);
  R(0,0,38,38,L.fallen?'#2a1e30':'#2a2219');
  if(L.fallen){ const gr=g.createRadialGradient(19,20,4,19,20,22); gr.addColorStop(0,'rgba(120,80,140,0.55)'); gr.addColorStop(1,'rgba(20,12,24,0)'); g.fillStyle=gr; g.fillRect(0,0,38,38); }
  R(6,29,26,9,dr==='legionary'||dr==='centurion'?'#8a8c90':dr==='tombs'?skin:robe);                  /* shoulders (mail on a soldier of Rome) */
  R(11,9,16,18,skin);                                  /* the face */
  /* what is on the head, by the dress: helmet, turban, cap, diadem, head-cloth — or the hair */
  if(dr==='legionary'||dr==='centurion'){ R(9,5,20,6,'#b08848'); R(9,9,3,12,'#b08848'); R(26,9,3,12,'#b08848'); if(dr==='centurion') R(7,2,24,3,'#a02020'); }
  else if(dr==='kohen'||dr==='levite'){ R(8,3,22,8,'#f4f0e6'); R(10,1,18,3,'#f4f0e6'); }
  else if(dr==='magi'){ const c=hex(L.cloth||0x8a2a2a); R(9,4,20,7,c); R(12,1,14,4,c); R(20,0,8,3,c); }
  else if(dr==='tombs'){ const h=hex(L.hair||0x1e1610); R(10,8,2,14,h); R(14,8,1,6,h); R(25,8,2,16,h); R(22,8,1,5,h); }   /* bare, a few long strands */
  else if(dr==='king'){ R(10,6,18,4,hex(L.hair||0x1e1610)); R(9,8,20,2,'#d4af37'); }
  else if(L.cloth===null||dr==='camelhair'){ const h=hex(L.hair||0x1e1610); R(9,4,20,7,h); R(9,9,3,14,h); R(26,9,3,14,h); }
  else { const cloth=hex(L.cloth||0xd9cfb6); R(9,5,20,6,cloth); R(9,9,3,18,cloth); R(26,9,3,18,cloth); }   /* the head-cloth */
  const ex=talking?SV.expr(T.text):'calm';
  const by=ex==='awe'||ex==='fear'?12:ex==='stern'?14:13;
  const brow=L.beard&&L.beard!==0x6d6a66?hex(L.beard):'#2a1d14';
  if(ex==='stern'){ R(13,by,4,1,brow); R(16,by+1,1,1,brow); R(21,by+1,1,1,brow); R(21,by,4,1,brow); }
  else if(ex==='sorrow'||ex==='fear'||ex==='weep'){ R(13,by+1,4,1,brow); R(16,by,1,1,brow); R(21,by,1,1,brow); R(21,by+1,4,1,brow); }
  else { R(13,by,4,1,brow); R(21,by,4,1,brow); }
  const blink=(performance.now()%4200)<120;
  if(blink){ R(14,16,3,1,'#1c120b'); R(21,16,3,1,'#1c120b'); }
  else { R(13,15,4,2,'#e7ddcf'); R(21,15,4,2,'#e7ddcf'); R(15,15,2,2,'#1c120b'); R(22,15,2,2,'#1c120b'); }
  R(18,17,2,4,'rgba(0,0,0,0.12)');                      /* the nose's shade */
  if(L.beard){ R(12,21,14,7,hex(L.beard)); R(14,27,10,2,hex(L.beard)); }
  const mh=Math.round(1+m*4), my=L.beard?22:23;
  if(m>0.05) R(16,my,6,mh,'#3a1810');
  else { const lip=L.beard?'#3a1810':'#6a3426'; R(16,my,6,1,lip);
    if(ex==='joy'){ R(15,my-1,1,1,lip); R(22,my-1,1,1,lip); }
    if(ex==='sorrow'||ex==='weep'){ R(15,my+1,1,1,lip); R(22,my+1,1,1,lip); } }
}

/* ================= THE STORY — beats run in order ================= */
let act=null, sceneIx=0, beatIx=0, beat=null, running=false, controlsOn=true, speaking=null;
let waitingAdvance=false, beatT=0, witness=null, onFrame=null;
ST.fast=false;                                     /* the test harness sets this: no waiting to read */

function runAct(a,fromScene){
  act=a; sceneIx=fromScene||0; running=true;
  $('play').classList.remove('off');
  recap=sceneIx===0?recapOf(a):null;
  startScene();
}
/* PREVIOUSLY, ON THE ROAD — an act opens on what the witness saw in the act before it, read
   from the journal: the scenes, where and when, and what the witness said there */
let recap=null;
function recapOf(a){
  const R=window.STORY_ROAD||[], i=R.findIndex(r=>r.id===a.id); if(i<=0) return null;
  const prev=R[i-1].id, road=save.road||{}, seen=Object.keys(road).filter(k=>k.indexOf(prev+'/')===0);
  if(!seen.length) return null;
  const said=Object.entries(save.choices||{}).filter(([k])=>k.indexOf(prev+'/')===0).map(([,v])=>v);
  return '<div class="note-h">Previously, on the road</div><div class="note">'+
    seen.map(k=>'· '+esc(road[k].title||'')+(road[k].date?' — '+esc(road[k].date):'')).join('<br>')+
    (said.length?'<br><br><i>You said: “'+said.slice(-2).map(c=>esc(c.said)).join('” · “')+'”</i>':'')+'</div>';
}
function stopAct(){ SV.stop(); running=false; act=null; closePanels(); hide('sverse'); hide('card'); hide('goal'); hide('sprompt'); hide('choice'); hide('eras'); ringOff(); witness=null; onFrame=null; }
function startScene(){
  const sc=act.scenes[sceneIx];
  fade(1,0);
  buildScene(sc);
  $('where').textContent=(sc.title||'')+(sc.date?' · '+sc.date:'');
  beatIx=0; enterBeat();
  fade(0,1.2);
}
function nextBeat(){ beatIx++; enterBeat(); }
function enterBeat(){
  const sc=act.scenes[sceneIx];
  hide('sverse'); hide('card'); hide('sprompt'); hide('choice'); speaking=null; waitingAdvance=false; beatT=0; onFrame=null;
  SV.stop(); portrait=null;
  if(beatIx>=sc.beats.length){ endScene(); return; }
  beat=sc.beats[beatIx];
  if(recap){ const h=recap; recap=null; showCard(h,'note'); waitingAdvance=true; beatIx--; return; }
  const B=beat, T=B.t;
  if(ST.stopAt&&ST.stopAt(B)){ ST.fast=false; ST.stopAt=null; }
  if(T==='title'){ showCard('<div class="ttl">'+esc(B.text)+'</div>'+(B.sub?'<div class="sub">'+esc(B.sub)+'</div>':''),'title'); waitingAdvance=true; narrate(B); return; }
  if(T==='note'){ showCard('<div class="note-h">A note on the history</div><div class="note">'+esc(B.text)+'</div>','note'); waitingAdvance=true; narrate(B); return; }
  if(T==='say'||T==='read'){ showVerse(B); return; }
  /* a goal or a deed is the player's to walk to: the story lets go of the camera first */
  if((T==='goal'||T==='witness')&&camTarget){ releaseCamera(); controlsOn=true; }
  if(T==='goal'){ setGoal(B.text); const m=pos(B.goto); reachBounds(m); ringAt(m);
    const relock=!!ctx.playerLock&&Math.hypot(player.position.x-m[0],player.position.z-m[1])>=(B.r||2.4);   /* (a mark he is held away from: he is let go to it) */
    if(relock){ ctx.playerLock=false; controlsOn=true; }
    onFrame=()=>{
      if(Math.hypot(player.position.x-m[0],player.position.z-m[1])<(B.r||2.4)){ ringOff(); setGoal(''); if(relock) ctx.playerLock=true; nextBeat(); } }; return; }
  if(T==='witness'){ startWitness(B); return; }
  if(T==='choice'){ showChoice(B); return; }
  if(T==='collect'){ collect(B.id); return; }
  if(T==='fulfil'){ fulfil(B.id); return; }
  if(T==='move'){ const who=[].concat(B.who), tos=Array.isArray(B.who)||Array.isArray(B.to&&B.to[0])?[].concat(B.to):[B.to];   /* one figure, one place — even a place given as [x,z] */ who.forEach((w,k)=>{ const g=ctx.actors[w]; if(!g) return;
      const to=pos(tos[Math.min(k,tos.length-1)]);
      g.userData.follow=null; g.userData.target=to; if(B.speed) g.userData.speed=B.speed;
      /* ---- A WALK ACROSS A CITY IS A CUT, NOT A WAIT ----
         The scenes were written about the small city, where the gate stood beside the upper room;
         at the true measure it is six hundred and forty metres off, and the act stood while two
         men walked there at a stroll and back again — minutes of nothing, and twice the playtest's
         patience. No scene was ever written with a walk of ninety metres; one that long now
         happens between one look and the next, and the figure is there. */
      const far=Math.hypot(to[0]-g.position.x,to[1]-g.position.z)>90;
      if(ST.fast||far){ const tdx=to[0]-g.position.x, tdz=to[1]-g.position.z;
        if(tdx*tdx+tdz*tdz>0.09) g.rotation.y=Math.atan2(tdx,tdz);   /* (facing the way he went, as he would have arrived) */
        g.position.x=to[0]; g.position.z=to[1];
        /* set straight down where he was going: on the floor he would have walked to (a hall
           under a roof), not on the roof over it */
        const top=ctx.groundY(to[0],to[1]), cur=g.position.y, near=ctx.groundY(to[0],to[1],cur+1.6);
        /* (and only a floor a man can stand on: sent from the gate to the upper pool, ten metres up the
           hill, the floor looked for at the gate's height was inside the hillside, and there he stood) */
        g.userData.gy=near!=null&&isFinite(near)&&top-near>2&&Math.abs(near-cur)<3&&!sunkAt(to[0],to[1],near)?near:(isFinite(top)?top:undefined);
        if(g.userData.gy!==undefined&&g.userData.fixedY===undefined) g.position.y=g.userData.gy-sitDrop(g.userData); } });   /* (at once: for a frame he stood at the gate's height on the hill) */
    if(B.wait===false) return nextBeat();
    onFrame=()=>{ if(who.every(w=>!ctx.actors[w]||!ctx.actors[w].userData.target)) nextBeat(); }; return; }
  if(T==='follow'){ for(const w of [].concat(B.who)){ const g=ctx.actors[w]; if(g){ g.userData.target=null; g.userData.follow=B.target||'player'; } } return nextBeat(); }
  if(T==='stop'){ for(const w of [].concat(B.who)){ const g=ctx.actors[w]; if(g){ g.userData.follow=null; g.userData.target=null; } } return nextBeat(); }
  if(T==='face'){ const g=ctx.actors[B.who]; const p=B.to==='player'?[player.position.x,player.position.z]:(ctx.actors[B.to]||ctx.things[B.to])?thingPos(B.to):pos(B.to);
    if(g) g.rotation.y=Math.atan2(p[0]-g.position.x,p[1]-g.position.z); return nextBeat(); }
  /* (and a figure set down is no longer walking to where he was last sent: Kĕpha, set in the upper room before
     he had reached the foot of its stair, went on looking for a way down to it from inside the room) */
  if(T==='place'){ const g=B.who==='player'?player:ctx.actors[B.who]; const p=pos(B.at);
    if(g){ const u=g.userData; u._mv=null; if(g!==player){ u.target=null; u._prog=null; u._path=null; } }
    if(g){ const onIt=B.y!==undefined&&B.y!==null&&yOf(B.y)!==undefined;
      g.position.set(p[0],onIt?yOf(B.y):ctx.groundY(p[0],p[1]),p[1]); g.userData.gy=g.position.y; if(B.face!==undefined) g.rotation.y=faceOf(B.face,p);
      /* `y`: standing on something that is not the ground — the floor of a boat, a roof;
         `y:null` sets him back down on the ground */
      if(onIt&&g!==player) g.userData.fixedY=yOf(B.y); else if(B.y===null) delete g.userData.fixedY; }
    return nextBeat(); }
  if(T==='cam'){ controlsOn=!!B.free;
    /* (a scene played at a work of the ancients that stands at its true size frames it from farther off: `trueFrom`, `trueLook`) */
    const Bc=(B.trueFrom&&ctx.trueEarth)?Object.assign({},B,{from:B.trueFrom,look:B.trueLook||B.look}):B;
    if(Bc.release){ releaseCamera(); controlsOn=true; return nextBeat(); }
    const S=Bc.on?shotOf(Bc):null;
    const at=S?S.look:Array.isArray(Bc.look)&&Bc.look.length===3&&typeof Bc.look[0]==='number'?(Bc===B?remap3(Bc.look):Bc.look):lookAtSpec(Bc.look);
    let from;
    if(S) from=S.from;
    else if(Bc.from&&Bc.from.rel){ const g=ctx.actors[Bc.from.rel]||ctx.things[Bc.from.rel], o=Bc.from.off; from=[g.position.x+o[0],g.position.y+o[1],g.position.z+o[2]]; }
    else if(Array.isArray(Bc.from)&&Bc.from.length===3&&typeof Bc.from[0]==='number') from=Bc===B?remap3(Bc.from):Bc.from;
    /* a marker (or a marker and a step from it), at `fy` metres, or `fdy` above the ground there */
    else { const m=pos(Bc.from); from=[m[0],Bc.fdy!==undefined?(ctx.groundY(m[0],m[1])||0)+Bc.fdy:(Bc.fy||4),m[1]]; }
    /* ---- A CAMERA GOES WITH WHAT IT LOOKS AT ----
       Written in bare numbers for the small city and carried into the true one, the eye and the thing
       it looks at were each moved by their OWN nearest landmark: an eye fourteen metres from the camp
       stayed by the study while the camp went seven hundred metres off to the pool. When the carrying
       tears them apart (or crushes them together), the eye is carried as the look was, keeping the
       picture as it was written. (Only a near shot, of people: a wide one over the city, opened wider
       by the true city's greater size, still takes in the whole of it.) */
    if(Bc===B&&!S&&Array.isArray(B.from)&&B.from.length===3&&typeof B.from[0]==='number'&&Array.isArray(B.look)&&B.look.length===3&&typeof B.look[0]==='number'){
      const F0=B.from, L0=B.look, d0=Math.hypot(F0[0]-L0[0],F0[2]-L0[2]), d1=Math.hypot(from[0]-at[0],from[2]-at[2]);
      if(d0<30&&Math.abs(d1-d0)>Math.max(6,0.5*d0)){
        from=[F0[0]+at[0]-L0[0], at[1]+(F0[1]-L0[1]), F0[2]+at[2]-L0[2]];
        const gy=ctx.groundY(from[0],from[2]); if(isFinite(gy)&&from[1]<gy+0.6) from[1]=gy+0.6; } }
    /* ---- AND AN EYE AT SEA RIDES WITH HER ----
       On the Great Sea her boat rides the sea's own swell (lakeH), metres of it in a gale, and an eye held still
       beside her saw her deck thrown up past it and fall away under it. A shot written over the water in
       numbers is reckoned from her as she lies this moment, and rises and falls with her while it is held. */
    let at2=at, r0=null;
    { const L=ctx.lake, m=L&&L.voyage&&L.main;
      if(m&&!S&&Array.isArray(Bc.from)&&typeof Bc.from[0]==='number'&&from[0]>L.rect[0]&&from[0]<L.rect[2]&&from[2]>L.rect[1]&&from[2]<L.rect[3]){
        r0=m.userData.heave||0; from=[from[0],from[1]+r0,from[2]];
        if(Array.isArray(Bc.look)&&typeof Bc.look[0]==='number') at2=[at[0],at[1]+r0,at[2]]; } }
    holdCamera(S?from:faceSafe(from,at2),at2,ST.fast?0.01:(Bc.dur||2.5));
    if(r0!==null) camTarget.ride=r0;
    if(Bc.wait===false) return nextBeat();
    onFrame=()=>{ if(camT>=1) nextBeat(); }; return; }
  if(T==='show'||T==='hide'){ for(const id of [].concat(B.id)){ const o=ctx.glows[id]||ctx.things[id]||ctx.actors[id]; if(o) o.visible=(T==='show'); }
    if(T==='show'&&K().shadowRescan) K().shadowRescan();                     /* (what is shown throws its shade at once) */
    if(B.host!==undefined&&ctx.host){ for(const G of ctx.host) G.visible=!!B.host; if(ctx.hostFigs) ctx.hostFigs.visible=!!B.host; }
    if(B.star!==undefined&&ctx.star) ctx.star.visible=!!B.star;
    if(B.kingdoms!==undefined&&ctx.kingdoms) for(const G of ctx.kingdoms) G.visible=!!B.kingdoms;
    return nextBeat(); }
  if(T==='time'){ applyTime(B.to); setBed(ctx.place,B.to); return nextBeat(); }
  /* the wind and the waves: "the ruach was against it" … "the ruach ceased" */
  if(T==='weather'){ if(B.wind) ctx.wind=B.wind; if(B.rough!==undefined) ctx.rough=B.rough;
    /* the rain, the thunder and the dark of a squall; and the sea's own storm seas, running before the scene's
       wind (its way in the world: a set laid turned blows the other way) */
    if(B.storm!==undefined&&K().setStorm){ const sw=Math.sign(SX)||1; K().setStorm(B.storm||null,ctx.wind?[ctx.wind[0]*sw,ctx.wind[1]*sw]:undefined); }
    return nextBeat(); }
  /* "Make the people sit down" (Yahuchanon 6:10): on the grass, legs out before them */
  /* (one told to sit while still walking to his place sits when he gets there: he went the rest of the way
     through the garden gliding along seated) */
  if(T==='sit'||T==='stand'){ for(const w of [].concat(B.who)){ const g=ctx.actors[w]; if(g){ const u=g.userData, later=T==='sit'&&!!u.target;
      u.sit=T==='sit'&&!later; u.sitOnArrive=later; u.lie=false; u.kneel=false; g.rotation.x=0; } } return nextBeat(); }
  /* "falling on His knees He was praying" (Luqas 22:41) */
  if(T==='kneel'){ for(const w of [].concat(B.who)){ const g=ctx.actors[w]; if(g){ g.userData.kneel=true; g.userData.sit=false; g.userData.lie=false; g.rotation.x=0; } } return nextBeat(); }
  /* lying on the ground: asleep in a camp, or fallen (Yashayahu 37:36) */
  if(T==='lie'){ for(const w of [].concat(B.who)){ const g=ctx.actors[w]; if(g){ g.userData.lie=true; g.userData.sit=false; g.rotation.order='YXZ'; g.rotation.x=B.prone?Math.PI/2:-Math.PI/2; }   /* on the back, along the way he faced; or `prone`, on his face (Mattithyahu 17:6) */ } return nextBeat(); }
  /* set on a beast, and carried by it: `on` a thing (a donkey), or `off` */
  /* a herd of the place driven (`to` a point, at `sp`), or taken from sight (`hide`): "the herd rushed
     down the steep place into the sea" (Mark 5:13) */
  if(T==='herd'){ let n=0; for(const b of ctx.flock){ const u=b.userData; if(u.kind!==B.kind) continue;
      if(B.hide){ b.visible=false; continue; }
      /* `over`: the whole herd rushes down the steep place, each in its own lane, and over the edge */
      if(B.over){ const o=pos(B.over); u.plunge={to:[o[0],o[1]+((n*7)%11-5)*0.32],wait:(n%9)*0.22+Math.random()*0.3}; u.sp=B.sp||5.5; n++; continue; }
      if(B.to){ u.home=pos(B.to); u.roam=B.roam||0.6; u.sp=B.sp||4; u.t=0; } } return nextBeat(); }
  /* `hold`: a thing taken up in both hands and held before him (the widows' garments, Acts 9:39);
     with no `who`, put down where it is */
  if(T==='hold'){ for(const id of [].concat(B.id)){ const o=ctx.things[id]; if(!o) continue; const prev=o.userData.heldBy&&ctx.actors[o.userData.heldBy];
      if(prev) prev.userData.holding=false;
      if(B.who&&ctx.actors[B.who]){ o.userData.heldBy=B.who; ctx.actors[B.who].userData.holding=true; o.visible=true; }
      else { o.userData.heldBy=null; o.position.y=ctx.groundY(o.position.x,o.position.z)||0; o.rotation.x=0; } } return nextBeat(); }
  /* `loose`: chains fallen off the hands (Acts 12:7; 16:26) — the end on the bound one drops where it was */
  if(T==='loose'){ for(const id of [].concat(B.id)){ const o=ctx.things[id]; if(o&&o.userData.ends){ const a=o.userData.ends[0].clone(); a.y=(ctx.groundY(a.x,a.z,a.y+0.5)||0)+0.04; o.userData.looseA=a; } } return nextBeat(); }
  if(T==='pose'){ for(const w of [].concat(B.who)){ const g=ctx.actors[w]; if(g) g.userData.armsOut=B.arms==='out'?true:B.arms==='up'||B.arms==='carry'?B.arms:false; } return nextBeat(); }
  /* "they put it on His head" (Mattithyahu 27:29) */
  if(T==='crown'){ for(const w of [].concat(B.who)){ const g=ctx.actors[w]; if(g&&g.userData.head) window.STORYWORLD.crown(g.userData.head); } return nextBeat(); }
  if(T==='lead'){ const o=ctx.things[B.id]; if(o){ o.userData.leadBy=B.by||null; o.userData.leadBack=B.back; o.userData.leadUp=B.up; o.userData.leadTurn=B.turn; } return nextBeat(); }
  if(T==='ride'){ for(const w of [].concat(B.who)){ const g=ctx.actors[w]; if(!g) continue; const u=g.userData;
      if(B.off){ const t=ctx.things[u.ride]; u.ride=null; u.sit=false; if(t){ const sd=t.userData.side||0.7, ro=t.userData.rideOff||[0,0], c=Math.cos(t.rotation.y), sn=Math.sin(t.rotation.y), x=(ro[0]<0?-sd:sd), z=ro[1];
          g.position.x=t.position.x+x*c+z*sn; g.position.z=t.position.z-x*sn+z*c; } }
      else { const t=ctx.things[B.on]; if(t){ t.userData.leadBy=null; u.ride=B.on; u.sit=true; g.rotation.y=t.rotation.y;
          const ro=t.userData.rideOff||[0,0], c=Math.cos(t.rotation.y), sn=Math.sin(t.rotation.y);
          g.position.x=t.position.x+ro[0]*c+ro[1]*sn; g.position.z=t.position.z-ro[0]*sn+ro[1]*c; } } }
    return nextBeat(); }
  /* `aboard`: up into a carriage at a seat of it (`off` [x,seatY|0,z] in its own frame), or down out of it at its side */
  if(T==='aboard'){ for(const w of [].concat(B.who)){ const g=ctx.actors[w]; if(!g) continue; const u=g.userData;
      if(B.off){ const t=u.aboard&&ctx.things[u.aboard.id]; if(t){ const o=u.aboard.off, sd=t.userData.side||0.9, x=o[0]<0?-sd:sd, c=Math.cos(t.rotation.y), sn=Math.sin(t.rotation.y);
          g.position.x=t.position.x+x*c+o[2]*sn; g.position.z=t.position.z-x*sn+o[2]*c; u.gy=ctx.groundY(g.position.x,g.position.z); }
        u.aboard=null; u.sit=false; u.target=null; }
      else { u.aboard={id:B.on,off:B.at||[0,0,0],face:B.face||0}; u.sit=true; u.target=null; u.follow=null; } }
    return nextBeat(); }
  /* `mood`: the face a scene gives someone until it gives another (`ex`: joy · sorrow · weep ·
     fear · awe · stern; none, to let the words carry it again) */
  if(T==='mood'){ for(const w of [].concat(B.who)){ const g=ctx.actors[w]; if(g) g.userData.mood=B.ex||null; } return nextBeat(); }
  if(T==='robe'){ const g=ctx.actors[B.who]; if(g) window.STORYWORLD.recolor(g,B.color,B.mantle); return nextBeat(); }
  if(T==='drift'){ const objs=[];
    /* one thing to a place (`to`), or several together by the same distance (`by`) — a boat
       and everyone standing in it, the player too */
    for(const id of [].concat(B.id)){ const o=id==='player'?player:(ctx.things[id]||ctx.actors[id]), G=ctx.glows[id];
      if(o){ objs.push(o); if(id!=='player') o.visible=true; } if(G){ objs.push(G.sprite); if(G.light) objs.push(G.light); G.visible=true; } }
    const by=B.by?new THREE.Vector3(...B.by):null;
    /* (those carried — a ship's company driven onto the beach — are not walking to a place left behind: two
       sailors still bound for the bow were held by the drift, and set back on the deck's old place in the sea) */
    for(const id of [].concat(B.id)){ const g=ctx.actors[id]; if(g){ g.userData.target=null; g.userData._prog=null; g.userData._path=null; } }
    /* `hold`: a figure carried up (Acts 1:9) is held where the drift leaves him, not set back on the ground */
    if(B.hold) for(const id of [].concat(B.id)){ const g=ctx.actors[id]; if(g&&g.userData.fixedY===undefined) g.userData.fixedY=g.position.y; }
    /* (`toAt` [a place] with `dy`: to so high over the floor there) */
    const toV=B.toAt?(()=>{ const m=pos(B.toAt); return [m[0],B.y!==undefined?B.y:(ctx.groundY(m[0],m[1])||0)+(B.dy||1.5),m[1]]; })():B.to?remap3(B.to):null;
    /* (on the Great Sea a boat and those in her are taken from where they lie at rest, not from where the swell
       has them this moment: else she kept that moment's heave for ever after, her deck a metre under the sea) */
    const rest=q=>{ const v=q.position.clone(), u=q.userData||{}; if(ctx.lake&&ctx.lake.voyage){
      if(u.bob&&u.baseY!==undefined) v.y=u.baseY; else if(u.fixedY!==undefined) v.y=u.fixedY; else if(q===player&&ctx.playerY!==undefined) v.y=ctx.playerY; } return v; };
    const D={objs,from:objs.map(rest),to:by?null:new THREE.Vector3(...toV),by,t:0,dur:ST.fast?0.001:(B.dur||3)};
    ctx.drifts.push(D);
    if(B.wait===false) return nextBeat();
    onFrame=()=>{ if(D.t>=1) nextBeat(); }; return; }
  /* `carry`: a light taken up in a seraph's tongs (`by`), or set down again (no `by`) — the live coal (Yashayahu 6:6) */
  if(T==='carry'){ const G=ctx.glows[B.id]; if(G){ const was=G.onTongs, F=ctx.glows[B.by||was]&&ctx.glows[B.by||was].fig;
      G.onTongs=B.by||null; if(F&&F.userData.coal) F.userData.coal.visible=!!B.by; }   /* (the coal itself is seen in the tongs) */
    return nextBeat(); }
  /* the screen goes to white or dark (`to` 1) and comes back (`to` 0): the passing into a vision */
  if(T==='fade'){ const f=$('fade'); if(f) f.style.background=B.color||'#000'; fade(B.to===undefined?1:B.to,ST.fast?0:(B.dur||0.8));
    if(ST.fast||B.wait===false) return nextBeat(); onFrame=()=>{ if(beatT>=(B.dur||0.8)) nextBeat(); }; return; }
  if(T==='quake'){ ctx.quake=ST.fast?0:(B.s||2.5); return nextBeat(); }
  if(T==='wait'){ onFrame=()=>{ if(ST.fast||beatT>=B.s) nextBeat(); }; return; }
  if(T==='player'){ ctx.playerHidden=!!B.hidden; player.visible=!B.hidden; if(B.hidden) controlsOn=false;
    /* set the player down somewhere — in a boat, say — and hold him there (lock), or let him go */
    const by=B.y===undefined||B.y===null?B.y:yOf(B.y), onIt=by!==undefined&&by!==null;
    if(B.at){ const p=pos(B.at); player.position.set(p[0],onIt?by:ctx.groundY(p[0],p[1]),p[1]); }
    if(B.face!==undefined){ const f=faceOf(B.face,[player.position.x,player.position.z]); player.rotation.y=f; camYaw=f+Math.PI; }
    if(onIt) ctx.playerY=by; else if(B.y===null||B.lock===false||B.y!==undefined) ctx.playerY=undefined;
    if(B.lock!==undefined) ctx.playerLock=!!B.lock;
    return nextBeat(); }
  /* the jars filled, the baskets heaped, the net full of fish; `color` turns water to wine */
  if(T==='fill'){ for(const id of [].concat(B.id)){ const o=ctx.things[id]; if(!o) continue; const f=o.userData.fill||o.userData.fish;
      if(f){ f.visible=B.show!==false; if(B.color!==undefined&&f.material) f.material.color.setHex(B.color); } } return nextBeat(); }
  if(T==='era'){ showEra(B); return; }
  if(T==='end') return endScene();
  console.warn('unknown beat',B); nextBeat();
}
/* ---- THE MAL'AKIM, SEEN ---- */
const MALAK_SKIN=[0x6e4524,0x704a27,0x7a4e29,0x6a4426];   /* brown, as the people of the land are */
function malakFigure(G,gl){
  const k=Math.abs((gl.id||'').split('').reduce((a,c)=>a*31+c.charCodeAt(0),7))%MALAK_SKIN.length;
  const f=window.STORYWORLD.person(ctx,{id:'glow:'+gl.id, dress:'man', robe:gl.seraph?0xfff6e4:0xf4f1e8, cloth:gl.seraph?0xfffbf0:0xfbf8ef, sash:gl.seraph?0xf0c860:0xe8dcb0, skin:MALAK_SKIN[k], beard:gl.beard||null});

  f.userData.id='glow:'+gl.id; f.userData.def={ground:true}; f.userData.malak=true; f.userData.noShadow=true; f.visible=false;   /* (light throws no shadow) */
  if(gl.sit) f.userData.sit=true;
  f.userData.s=gl.scale||(gl.float||(gl.at&&gl.at.length===3&&gl.at[1]>5)?1.35:1.08); f.scale.setScalar(f.userData.s);
  /* LIT FROM WITHIN: he stands in the light, and is bright with it — each of his surfaces given back its
     own colour as a glow (his own copies of the materials, so no one else shines) */
  f.traverse(m=>{ if(!m.isMesh||!m.material) return; const M=m.material.clone(); m.material=M;
    if(M.emissive){ if(M.map){ M.emissiveMap=M.map; M.emissive.setRGB(0.62,0.58,0.52); } else M.emissive.copy(M.color).multiplyScalar(0.6); } });
  G.sprite.material.opacity=(gl.size||3)>4?0.32:0.5;                         /* the light about him, not over him */
  const S=(K()&&K().setScale)||6.5; G.faceLight=new THREE.PointLight(0xfff4e0,0,6*S,1.6); ctx.scene.add(G.faceLight);
  if(gl.seat!==undefined){ f.userData.sit=true; f.userData.def={bench:true}; }
  if(gl.arms==='hold') f.userData.holding=true;                                /* his hands reached out to the one he strengthens */
  G.fig=f; G.toward=gl.toward; G.float=gl.float; G.seat=gl.seat;
  Object.defineProperty(G,'visible',{configurable:true, get(){ return G.sprite.visible; },
    set(v){ G.sprite.visible=v; if(G.light) G.light.intensity=v?G.light.userData.on:0; f.visible=v; G.faceLight.intensity=v?0.9:0; }}); }
/* ---- A SERAPH, SEEN (Yashayahu 6:2,6) ----
   A figure of his own (story/world.js, W.seraph): a body of fire, his robe, his six wings — and
   borne in the air at his light. `tongs`: he holds the tongs he takes the coal with. */
function seraphFigure(G,gl){
  const f=window.STORYWORLD.seraph({tongs:!!gl.tongs}); f.userData.seraph=true; f.userData.noShadow=true; f.visible=false;
  f.userData.s=gl.scale||2; f.scale.setScalar(f.userData.s); ctx.scene.add(f);
  G.sprite.material.opacity=0.2;                                     /* (a light about him, not a glare over him) */
  const S=(K()&&K().setScale)||6.5; G.faceLight=new THREE.PointLight(0xfff0dc,0,8*S,1.6); ctx.scene.add(G.faceLight);
  G.fig=f; G.float=true; G.toward=gl.toward;
  Object.defineProperty(G,'visible',{configurable:true, get(){ return G.sprite.visible; },
    set(v){ G.sprite.visible=v; if(G.light) G.light.intensity=v?G.light.userData.on:0; f.visible=v; G.faceLight.intensity=v?0.5:0; }}); }
const _cw=new THREE.Vector3(), _tt=new THREE.Vector3();
function malakTick(G,id,dt){
  if(G.fig.userData.seraph){ const f=G.fig, u=f.userData, q=G.sprite.position;
    /* his light about his breast; turned to the one he is sent to, else to whoever is near, else the witness */
    f.position.set(q.x,q.y-1.6*u.s,q.z);
    let tg=G.toward&&ctx.actors[G.toward]; if(!tg){ let bd=1e9; for(const a in ctx.actors){ const g=ctx.actors[a]; if(!g.visible) continue; const d=(g.position.x-q.x)**2+(g.position.z-q.z)**2; if(d<bd&&d<1600){ bd=d; tg=g; } } }
    if(!tg) tg=player;
    f.rotation.y=turnTo(f.rotation.y,Math.atan2(tg.position.x-q.x,tg.position.z-q.z),dt*3);
    G.faceLight.position.set(q.x,q.y,q.z);
    window.STORYWORLD.seraphTick(f,dt); return; }
  const f=G.fig, u=f.userData, q=G.sprite.position, gr=ctx.groundY(q.x,q.z,q.y)||0;
  /* standing on the ground under the light when it is near the ground; else borne up in it */
  const stand=!G.float&&q.y-gr<4.2, feet=stand?gr:q.y-1.25*(u.s||1);
  /* `seat`: sitting on something that high (the stone he rolled back and sat on, Mattithyahu 28:2) */
  if(G.seat!==undefined) f.position.set(q.x,gr+G.seat-0.5*(u.s||1),q.z); else f.position.set(q.x,feet-sitDrop(u),q.z);
  /* turned to the one he is sent to: `toward`, else the nearest of the people of the scene, else the witness */
  let tg=G.toward&&ctx.actors[G.toward]; if(!tg){ let bd=1e9; for(const a in ctx.actors){ const g=ctx.actors[a]; if(!g.visible) continue; const d=(g.position.x-q.x)**2+(g.position.z-q.z)**2; if(d<bd&&d<900){ bd=d; tg=g; } } }
  if(!tg) tg=player;
  f.rotation.y=turnTo(f.rotation.y,Math.atan2(tg.position.x-q.x,tg.position.z-q.z),dt*4);
  /* lit on the side that is seen */
  camera.getWorldPosition(_cw); ctx.scene.worldToLocal(_cw); const dx=_cw.x-q.x, dy=_cw.y-q.y, dz=_cw.z-q.z, L=Math.hypot(dx,dy,dz)||1;
  G.faceLight.position.set(f.position.x+dx/L*1.4,feet+1.7*(u.s||1),f.position.z+dz/L*1.4);
  animFigure(f,dt,false); animFace(f,id&&('glow:'+id),dt);
  if(u.wings) window.STORYWORLD.seraphWingsTick(f,dt); }
/* ---- HELD IN THE HANDS, AND THE CHAINS ---- */
const _h1=new THREE.Vector3(), _h2=new THREE.Vector3(), _Z=new THREE.Vector3(0,0,1);
function handAt(g,side,out){ const A=side==='L'?g.userData.armL:g.userData.armR, h=A&&A.userData.hand;
  if(!h){ return out.set(g.position.x,g.position.y+1.0,g.position.z); }
  h.getWorldPosition(out); return ctx.scene.worldToLocal(out); }
function holdTick(o){ const g=ctx.actors[o.userData.heldBy]; if(!g||!g.visible){ return; }
  handAt(g,'L',_h1); handAt(g,'R',_h2);
  o.position.set((_h1.x+_h2.x)/2,(_h1.y+_h2.y)/2+(o.userData.thing.kind==='garment'?0.04:0),(_h1.z+_h2.z)/2); o.rotation.set(0,g.rotation.y,0); }
/* an end of a chain: [actor, 'L'|'R'] at the wrist, or {at:[x,z], dy} a ring in a wall */
function chainEnd(e,out){ if(Array.isArray(e)&&ctx.actors[e[0]]) return handAt(ctx.actors[e[0]],e[1]||'R',out);
  const m=pos(e.at); return out.set(m[0],e.y!==undefined?e.y:(ctx.groundY(m[0],m[1])||0)+(e.dy||1),m[1]); }   /* `y`: a ring set in a wall at that height (the ground found there would be the wall's top) */
/* NOTHING HANGS THROUGH ANYTHING: a point of a chain (or anything let fall) lies on what is under it — out of a
   block of the world, up onto the floor, and over the bodies of those lying or sitting there */
function restOn(P){ const k=K(), B=k.B;
  for(let n=0;n<60&&k.solidAt(anchor.x+P.x*SX,anchor.y+(P.y-0.015)*S,anchor.z+P.z*SX);n++) P.y+=0.03;
  for(const id in ctx.actors){ const g=ctx.actors[id], u=g.userData; if(!g.visible||!(u.lie||u.sit||u.kneel)) continue;
    const dx=P.x-g.position.x, dz=P.z-g.position.z, s=u.s||1, fx=Math.sin(g.rotation.y), fz=Math.cos(g.rotation.y);
    let inside=false, top=g.position.y;
    if(u.lie){ const al=-(dx*fx+dz*fz), ac=Math.abs(dx*fz-dz*fx); inside=al>-0.15&&al<1.8*s&&ac<0.27*s; top+=0.34*s; }      /* along him, from his feet to his head */
    else { const al=dx*fx+dz*fz, ac=Math.abs(dx*fz-dz*fx); inside=al>-0.3*s&&al<0.6*s&&ac<0.26*s; top+=u.kneel?0.9*s:0.62*s; }
    if(inside&&P.y<top) P.y=top+0.02; } }
/* the chain hung between its two ends: links laid along the sagging line, as many as its length takes,
   each through the last and turned a quarter about the line from it */
const _P=[]; for(let i=0;i<=24;i++) _P.push(new THREE.Vector3());
function chainTick(o){ const u=o.userData, t=u.thing; u.ends=u.ends||[new THREE.Vector3(),new THREE.Vector3()];
  const A=u.looseA?u.ends[0].copy(u.looseA):chainEnd(t.from,u.ends[0]), B=chainEnd(t.to,u.ends[1]);
  const d=A.distanceTo(B), sag=Math.max(0.05,0.38-d*0.07);
  /* the line, and its length */
  let len=0; for(let i=0;i<=24;i++){ const s=i/24, P=_P[i]; P.set(A.x+(B.x-A.x)*s,A.y+(B.y-A.y)*s-sag*4*s*(1-s),A.z+(B.z-A.z)*s);
    restOn(P); if(i) len+=P.distanceTo(_P[i-1]); }
  const n=Math.min(u.links.length,Math.max(2,Math.round(len/u.pitch)));
  let seg=1, acc=0; const step=len/n;
  for(let k=0;k<u.links.length;k++){ const L=u.links[k]; L.visible=k<n; if(k>=n) continue;
    const want=(k+0.5)*step;
    while(seg<24&&acc+_P[seg].distanceTo(_P[seg-1])<want){ acc+=_P[seg].distanceTo(_P[seg-1]); seg++; }
    const a=_P[seg-1], b=_P[seg], sl=a.distanceTo(b)||1, f=(want-acc)/sl;
    L.position.lerpVectors(a,b,Math.min(1,Math.max(0,f)));
    _h1.subVectors(b,a).normalize(); L.quaternion.setFromUnitVectors(_Z,_h1);
    L.rotateZ(k%2?Math.PI/2:0); }
  u.cuffA.position.copy(A); u.cuffB.position.copy(B); }
function lookAtSpec(l){ if(l&&!Array.isArray(l)&&typeof l==='object'&&l.at){ const m=pos(l.at); return [m[0],l.y!==undefined?l.y:(ctx.groundY(m[0],m[1])||0)+(l.dy||1.4),m[1]]; }   /* {at, dy}: a place, so high over its floor (or at `y`) */
  if(typeof l==='string'){ if(ctx.actors[l]){ const g=ctx.actors[l]; return [g.position.x,g.position.y+(g.userData.fours?0.75:1.5),g.position.z]; }
    if(ctx.glows[l]){ const s=ctx.glows[l].sprite.position; return [s.x,s.y,s.z]; }
    const m=pos(l); return [m[0],m[2]!==undefined?m[2]:(ctx.groundY(m[0],m[1])||0)+1.5,m[1]]; }   /* (a bare place: a man's height over ITS ground, not over the anchor's) */
  if(Array.isArray(l)&&typeof l[0]==='string'){ const m=pos(l); return [m[0],(ctx.groundY(m[0],m[1])||0)+1.4,m[1]]; }   /* near a marker: a step from it, at a man's height */
  return l; }   /* a marker may carry its own height: [x,z,y] */
function endScene(){
  journal(act.scenes[sceneIx]);
  sceneIx++;
  if(sceneIx>=act.scenes.length){ finishAct(); return; }
  controlsOn=true; releaseCamera(); startScene();
}
function finishAct(){
  save.acts[act.id]='done'; persist();
  const a=act; ST.doneId=a.id; stopAct();
  showHub('The act is complete: '+a.title+'.');
}

/* ---- the words of the Besorah, as they are said ----
   The verse is shown whole, and read in its parts: the telling by the narrator, each
   quotation by the one the Besorah says spoke it. The part being said is lit, the one
   speaking moves the mouth, and their face is in the corner of the box. */
function showVerse(B){
  const t=textOf(B.ref);
  if(t===null){ /* a passage the generator has not written: it is NOT shown */
    console.error('passage not in story/scripture.js: '+B.ref+' (run tools/extract-besorah.js --story)');
    nextBeat(); return; }
  const segs=SV.segs(t,B,spec=>{ const sp=speakerOf(spec);
      if(!sp) console.error('no speaker for the words in '+B.ref+' — the Besorah says who speaks them; name them');
      return sp||{name:'',key:'unknown',kind:'man'}; },NARR);
  const distinct=new Set(segs.filter(x=>x.q).map(x=>x.sp.key));
  const tags=distinct.size>1;
  $('v-text').innerHTML=segs.map((x,i)=>(tags&&x.q&&(i===0||segs[i-1].sp.key!==x.sp.key||!segs[i-1].q)?'<span class="tag">'+esc(x.sp.name)+'</span>':'')+
    '<span class="pt'+(x.q?' q':'')+'" data-i="'+i+'">'+esc(x.text)+'</span>').join('');
  $('v-ref').textContent=B.ref;
  const main=segs.find(x=>x.q);
  const setWho=sp=>{ const nm=sp&&sp.kind!=='narrator'?sp.name:'';
    $('v-who').textContent=nm||'The Besorah'; $('v-who').className=nm?'who':'who narr';
    /* the trier is never given a shape — no face in the box either */
    portrait=sp&&(sp.kind!=='dark'||sp.look)?sp:null; $('sverse').classList.toggle('has-face',!!portrait);
    speaking=sp&&sp.actor||null;
    if(sp&&sp.actor&&ctx.actors[sp.actor]&&player&&B.turn!==false&&!camTarget){ const g=ctx.actors[sp.actor];
      g.rotation.y=Math.atan2(player.position.x-g.position.x,player.position.z-g.position.z); } };
  const lightPart=i=>{ const els=$('v-text').querySelectorAll('.pt');
    els.forEach((e,k)=>{ e.classList.toggle('now',k===i); e.classList.toggle('later',k>i); }); };
  $('v-text').classList.add('flow');
  setWho(segs[0].sp); lightPart(0);
  show('sverse');
  waitingAdvance=true;
  SV.play(segs.map(x=>({text:x.text,sp:x.sp})),i=>{ setWho(segs[i].sp); lightPart(i); },
    ()=>{ $('v-text').classList.remove('flow'); setWho(main?main.sp:NARR); });
}
function advance(){
  if(fulfilOpen){ closeFulfil(); return; }
  if(advanceHook&&waitingAdvance){ const h=advanceHook; advanceHook=null; h(); }
  if(!running||!waitingAdvance) return;
  waitingAdvance=false; nextBeat();
}
function showCard(html,kind){ const c=$('card'); c.innerHTML=html+'<div class="tap">continue ▸</div>'; c.className='card '+kind; show('card'); }
function setGoal(t){ const g=$('goal'); if(t){ g.textContent=t; show('goal'); } else hide('goal'); }

/* ---- the marker ring on the ground ---- */
let ring=null;
function ringAt(m){ ringOff();
  const g=new THREE.RingGeometry(0.9,1.25,40); g.rotateX(-Math.PI/2);
  ring=new THREE.Mesh(g,new THREE.MeshBasicMaterial({color:0xf2d27a,transparent:true,opacity:0.8,depthWrite:false}));
  const gy=ctx.groundY(m[0],m[1]); ring.position.set(m[0],gy+0.08,m[1]); scene.add(ring);
  ring.userData.beam=window.STORYWORLD.glow(ctx,m[0],gy+2.2,m[1],2.4,0xffe7a0,0); }
function ringOff(){ if(ring){ scene.remove(ring); ring.userData.beam.sprite.parent&&ring.userData.beam.sprite.parent.remove(ring.userData.beam.sprite); ring=null; } }

/* ---- THE WITNESS: small faithful things to do ----
   items: things to lay a hand on, each `hold` seconds; `deliver` takes it to a
   marker (it follows the player there); `send` sends it on its own. */
/* ---- A MARK IS ALWAYS INSIDE THE GROUND THAT MAY BE WALKED ----
   A scene keeps the witness within its bounds. At the true measure some of its marks are the
   city's own and lie far out of the box written for the small map (the House stands four hundred
   and seventy metres from the house of the taught ones), so the mark could be seen and never
   reached, and the act never finished. The bounds open to take in every place the witness is sent. */
function reachBounds(m){ const b=ctx.bounds; if(!b||!m) return; const M=8;
  if(m[0]-M<b.x0) b.x0=m[0]-M; if(m[0]+M>b.x1) b.x1=m[0]+M; if(m[1]-M<b.z0) b.z0=m[1]-M; if(m[1]+M>b.z1) b.z1=m[1]+M; }
function startWitness(B){
  for(const id of B.items) reachBounds(thingPos(id)); if(B.deliver) reachBounds(pos(B.deliver));
  witness={B,done:new Set(),holding:0,carrying:null};
  /* ---- A THING TO BE TAKEN UP THAT HE CANNOT REACH, HE MUST BE LET WALK TO ----
     The witness is held at his place in a boat (`player … lock`) so the sea cannot throw him
     about; but the grain ship's cargo stood three to six metres off him with an arm's reach of
     2.8, he was not let take a step, and the act could never be finished. If anything to be done
     lies out of his reach he is let walk for this deed (on her deck: he does not step off her),
     and held again after it. */
  if(ctx.playerLock&&player){ const R=B.reach||2.2, P=player.position;
    const out=B.items.some(id=>{ const q=thingPos(id); return q&&Math.hypot(q[0]-P.x,q[1]-P.z)>=R; })||!!B.deliver;
    if(out){ ctx.playerLock=false; witness.relock=true; controlsOn=true; } }
  setGoal(B.text+'  (0/'+B.items.length+')');
  onFrame=dt=>{
    const W=witness; if(!W) return;
    if(W.carrying){                                    /* taking it to where it goes */
      const m=pos(B.deliver); if(Math.hypot(player.position.x-m[0],player.position.z-m[1])<(B.r||3)){
        const o=ctx.things[W.carrying]; o.userData.following=false; o.userData.goTo=[m[0]+(Math.random()-0.5)*2,m[1]+(Math.random()-0.5)*2];
        o.userData.restRef=player.position.y+1.0;                               /* (set down on the floor he stands on) */
        player.userData.carrying=false; player.userData.holding=false; witnessDone(W.carrying); W.carrying=null; }
      return; }
    let near=null, nd=1e9;
    for(const id of B.items){ if(W.done.has(id)) continue; const p=thingPos(id); if(!p) continue;
      const d=Math.hypot(player.position.x-p[0],player.position.z-p[1]); if(d<nd){ nd=d; near=id; } }
    if(near&&nd<(B.reach||2.2)){ showPrompt((B.verb||'Take it')+(B.hold?'  — hold':'' ));
      if(actHeld||actPressed){ W.holding+=dt; actPressed=false;
        setProgress(B.hold?W.holding/B.hold:1);
        if(!B.hold||W.holding>=B.hold){ W.holding=0; setProgress(0);
          if(B.deliver){ W.carrying=near; ctx.things[near].userData.following=true; player.userData.carrying=player.userData.holding=true; setGoal(B.carryText||('Bring it to its place')); hide('sprompt'); }   /* (in both hands before him) */
          else witnessDone(near); } }
      else { W.holding=Math.max(0,W.holding-dt*2); setProgress(B.hold?W.holding/B.hold:0); } }
    else { hide('sprompt'); W.holding=0; setProgress(0); } };
}
function witnessDone(id){
  const W=witness; if(!W||W.done.has(id)) return; W.done.add(id);
  save.witnessed=(save.witnessed||0)+1; persist(); chime(0.25);
  const B=W.B;
  if(B.send&&ctx.things[id]) ctx.things[id].userData.goTo=pos(B.send);   /* sent on its own: the stone rolled aside */
  /* what the hand did shows: the jar filled, the group given its bread */
  if(B.reveal&&B.reveal[id]){ for(const r of [].concat(B.reveal[id])){ const o=ctx.things[r];
      if(o){ if(o.userData.fill) o.userData.fill.visible=true; else o.visible=true; } } } setGoal(B.text+'  ('+W.done.size+'/'+B.items.length+')');
  if(W.done.size>=B.items.length){ hide('sprompt'); setGoal(''); if(W.relock) ctx.playerLock=true; witness=null; nextBeat(); }
}
function showPrompt(t){ $('prompt-t').textContent='E  '+t; show('sprompt'); }
function setProgress(f){ $('hold').style.width=Math.round(Math.max(0,Math.min(1,f))*100)+'%'; }

/* ---- the player's own voice: reactions, never a named figure's ---- */
/* the narrator reads a card: a title, a note, an era; or what follows a choice */
function narrate(B,only){ const L=only!==undefined?[only]:SV.cardLines(B); if(L.length) SV.play(L.map(t=>({text:t,sp:NARR}))); }
function showChoice(B){
  const c=$('choice'); c.innerHTML='<div class="c-h">'+esc(B.prompt||'You')+'</div>';
  B.options.forEach((o,k)=>{ const b=document.createElement('button'); b.textContent=o.text;
    b.onclick=()=>{ hide('choice');
      /* "…will remember that": what the witness said or did is kept in the journal (only the
         witness's own words — no named figure is ever made to answer them) */
      save.choices=save.choices||{}; save.choices[act.id+'/'+act.scenes[sceneIx].id+'#'+beatIx]={said:o.text,where:act.scenes[sceneIx].title||''}; persist();
      toast('Your journal will remember that.');
      if(o.reply){ showCard('<div class="you">You</div><div class="note">'+esc(o.reply)+'</div>','you'); waitingAdvance=true; narrate(B,o.reply); } else nextBeat(); };
    c.appendChild(b); });
  show('choice');
}

/* ================= THE SEVEN HUNDRED YEARS, to scale ================= */
function showEra(B){
  const E=act.eras||[], box=$('eras'), lo=E.length?E[0].from:0, hi=E.length?E[E.length-1].to:1;
  let h='<div class="era-bar">';
  E.forEach((e,k)=>{ h+='<div class="era'+(k===B.i?' on':k<B.i?' past':'')+'" style="width:'+((e.to-e.from)/(hi-lo)*100)+'%;background:'+e.color+'"><span>'+esc(e.name)+'</span></div>'; });
  h+='</div><div class="era-axis"><span>'+Math.abs(lo)+' BCE</span><span>'+(hi>0?hi+' CE':Math.abs(hi)+' BCE')+'</span></div>';
  h+='<div class="note-h">'+esc(B.head||'')+'</div><div class="note">'+esc(B.text)+'</div><div class="tap">continue ▸</div>';
  box.innerHTML=h; show('eras'); waitingAdvance=true; narrate(B);
  const done=()=>{ hide('eras'); };
  const prev=advanceHook; advanceHook=()=>{ done(); advanceHook=prev; };
}
let advanceHook=null;

/* ================= THE PROPHECY CODEX ================= */
function def(id){ return ST.codexDefs.find(d=>d.id===id); }
function collect(id){
  const d=def(id); if(!d){ nextBeat(); return; }
  save.codex[id]=Object.assign(save.codex[id]||{},{collected:true}); persist();
  toast('Written into the family scroll — '+d.promise); chime(0.6);
  setTimeout(()=>{ if(beat&&beat.t==='collect'&&beat.id===id) nextBeat(); },ST.fast?0:1400);
}
let fulfilOpen=false;
function fulfil(id){
  const d=def(id); if(!d){ nextBeat(); return; }
  save.codex[id]=Object.assign(save.codex[id]||{},{collected:true,fulfilled:true}); persist();
  $('f-pref').textContent=d.promise; $('f-ptext').textContent=textOf(d.promise)||'';
  $('f-fref').textContent=d.fulfil; $('f-ftext').textContent=textOf(d.fulfil)||'';
  $('f-name').textContent=d.name;
  show('fulfil'); fulfilOpen=true; motif();
}
function closeFulfil(){ fulfilOpen=false; hide('fulfil'); if(beat&&beat.t==='fulfil') nextBeat(); }
function codexHTML(){
  let h='';
  for(const d of ST.codexDefs){ const s=save.codex[d.id]||{};
    h+='<div class="cx '+(s.fulfilled?'ful':s.collected?'col':'')+'"><div class="cx-name">'+esc(d.name)+'</div>';
    if(s.collected) h+='<div class="cx-v"><b>'+esc(d.promise)+'</b> '+esc(textOf(d.promise)||'')+'</div>';
    else h+='<div class="cx-v dim">Not yet written into your scroll.</div>';
    if(s.fulfilled) h+='<div class="cx-v ful"><b>'+esc(d.fulfil)+'</b> '+esc(textOf(d.fulfil)||'')+'</div>';
    else if(s.collected) h+='<div class="cx-v dim">Awaiting its fulfilment — '+esc(d.where||'')+'</div>';
    h+='</div>'; }
  return h;
}
function toggleCodex(){ const p=$('codex'); if(!p.classList.contains('off')){ hide('codex'); return; }
  $('codex-list').innerHTML=codexHTML(); show('codex'); }
function closePanels(){ hide('codex'); }
function toggleVoice(){ SV.setOn(!SV.on); $('b-voice').style.opacity=SV.on?'1':'0.45'; toast(SV.on?'🗣  Voices on':'Voices off'); }
function toast(t){ const el=$('toast'); el.textContent=t; el.classList.add('on'); clearTimeout(el._t); el._t=setTimeout(()=>el.classList.remove('on'),3800); }

/* ================= SOUND: the air of a place, and the bell of fulfilment ================= */
let AC=null, amb=null;
function audio(){ if(AC) return AC; try{ AC=new (window.AudioContext||window.webkitAudioContext)(); }catch(e){ AC=null; } return AC; }
/* a browser keeps sound shut until the player first touches the page */
['pointerdown','keydown'].forEach(ev=>window.addEventListener(ev,()=>{ const A=audio(); if(A&&A.state==='suspended') A.resume(); if(!amb) ambience(); },true));
function chime(strength){
  const A=audio(); if(!A) return; const t=A.currentTime;
  [523.25,659.25,783.99,1046.5].forEach((f,k)=>{ const o=A.createOscillator(), g=A.createGain();
    o.type='sine'; o.frequency.value=f; g.gain.setValueAtTime(0,t+k*0.12);
    g.gain.linearRampToValueAtTime(0.06*strength,t+k*0.12+0.02); g.gain.exponentialRampToValueAtTime(0.0001,t+k*0.12+1.6);
    o.connect(g).connect(A.destination); o.start(t+k*0.12); o.stop(t+k*0.12+1.7); });
}
/* THE AIR OF A PLACE (the design document: "ambient beds per location — wind, shore, crowd,
   Temple"). Each bed is made of a few voices drawn from noise and tone, and the place a scene
   is set in says which sound and how loud: the wind on the heights and in the wilderness, the
   lap of the lake at Kephar Naḥum, the murmur of a crowd at a wedding or a city gate, the low
   hum of the courts of the Hĕḵal, the running of the Yardĕn, the crickets of a night in the
   fields. They cross-fade from scene to scene. */
const BEDS={
  yahrushalayim:{crowd:0.5,temple:0.6,wind:0.25},  natsareth:{wind:0.35,crowd:0.15},
  road:{wind:0.7},   fields:{wind:0.4,night:0.8},  beythlehem:{wind:0.3,crowd:0.2},
  yarden:{river:0.8,wind:0.35,crowd:0.25},          wilderness:{wind:1.0},  mountain:{wind:1.3},
  qanah:{crowd:0.8,wind:0.2},  galil:{shore:0.8,wind:0.35,crowd:0.2},  galilEast:{shore:0.6,wind:0.4,crowd:0.4},
  galilSea:{shore:1.0,wind:1.4},  gadarenes:{shore:0.8,wind:0.5},  bethanyah:{wind:0.35,crowd:0.45},  shekem:{wind:0.55,crowd:0.12},  hillcountry:{wind:0.45,crowd:0.15},
  caesarea:{wind:0.35,river:0.7,crowd:0.1},  ginae:{wind:0.5,crowd:0.15},  yeriho:{wind:0.2,crowd:0.6},  olivet:{wind:0.5,crowd:0.5},
  courts:{crowd:0.7,temple:0.6,wind:0.2},  upperroom:{crowd:0.15,wind:0.15},  highpriest:{crowd:0.3,wind:0.3},  praetorium:{crowd:0.9,wind:0.3},  golgotha:{wind:0.8,crowd:0.3},
  prison:{wind:0.15},  lystra:{wind:0.6,crowd:0.4},  philippi:{river:0.5,wind:0.4,crowd:0.4},  ephesos:{crowd:0.9,wind:0.4}
};
function noiseBuf(A,brown){ const n=A.createBuffer(1,A.sampleRate*3,A.sampleRate), d=n.getChannelData(0); let last=0;
  for(let k=0;k<d.length;k++){ const w=Math.random()*2-1; if(brown){ last=(last+0.02*w)/1.02; d[k]=last*3.4; } else d[k]=w*0.5; }
  return n; }
function ambience(){ const A=audio(); if(!A||amb) return;
  const out=A.createGain(); out.gain.value=0.9; out.connect(A.destination);
  const loop=(buf)=>{ const s=A.createBufferSource(); s.buffer=buf; s.loop=true; s.start(); return s; };
  const brown=noiseBuf(A,true), white=noiseBuf(A,false);
  const voice=(src,type,freq,q)=>{ const f=A.createBiquadFilter(); f.type=type; f.frequency.value=freq; f.Q.value=q||0.7;
    const g=A.createGain(); g.gain.value=0; src.connect(f).connect(g).connect(out); return {f,g}; };
  const lfo=(hz,depth,target)=>{ const o=A.createOscillator(), g=A.createGain(); o.frequency.value=hz; g.gain.value=depth; o.connect(g).connect(target); o.start(); };
  const V={};
  V.wind=voice(loop(brown),'lowpass',420); lfo(0.07,180,V.wind.f.frequency);
  V.shore=voice(loop(white),'lowpass',900); { const sw=A.createGain(); sw.gain.value=0.5; lfo(0.11,0.5,sw.gain); V.shore.g.disconnect(); V.shore.g.connect(sw).connect(out); }
  V.river=voice(loop(white),'bandpass',1400,0.6); lfo(0.3,200,V.river.f.frequency);
  V.crowd=voice(loop(brown),'bandpass',520,1.4); lfo(0.5,120,V.crowd.f.frequency);
  /* the courts of the Hĕḵal: a low fifth, very quiet, under the city */
  V.temple=(()=>{ const g=A.createGain(); g.gain.value=0; g.connect(out);
    for(const [f,v] of [[73.4,0.5],[110,0.32],[146.8,0.18]]){ const o=A.createOscillator(); o.type='sine'; o.frequency.value=f; const gg=A.createGain(); gg.gain.value=v; o.connect(gg).connect(g); o.start(); }
    return {g}; })();
  /* the crickets of a night in the fields: a high chirp, pulsed */
  V.night=(()=>{ const o=A.createOscillator(); o.type='sine'; o.frequency.value=4300; const am=A.createGain(); am.gain.value=0;
    lfo(14,0.5,am.gain); const g=A.createGain(); g.gain.value=0; o.connect(am).connect(g).connect(out); o.start();
    return {g}; })();
  amb={V,LEVEL:{wind:0.05,shore:0.06,river:0.05,crowd:0.035,temple:0.03,night:0.006}};
  setBed(ctx&&ctx.place, timeNow);
}
/* the bed of a place, faded in over a few seconds */
function setBed(place,time){
  if(!amb||!AC) return; const want=Object.assign({},BEDS[place]||{wind:0.4});
  if(time==='night'&&want.night===undefined) want.night=0.5;
  const t=AC.currentTime;
  for(const k in amb.V){ const g=amb.V[k].g.gain; g.cancelScheduledValues(t); g.setValueAtTime(g.value,t);
    g.linearRampToValueAtTime((want[k]||0)*amb.LEVEL[k]*(SV.on?0.7:1),t+2.5); }
}
/* THE MOTIF OF FULFILMENT: when a promise in the family scroll is kept, a slow chord swells
   under a rising figure — the same few notes each time, so the ear comes to know them */
function motif(){
  const A=audio(); if(!A) return; const t=A.currentTime+0.05;
  const pad=A.createGain(); pad.gain.setValueAtTime(0,t); pad.gain.linearRampToValueAtTime(0.05,t+1.6); pad.gain.linearRampToValueAtTime(0.0001,t+6.5); pad.connect(A.destination);
  for(const f of [146.83,220,293.66,369.99]){ const o=A.createOscillator(); o.type='triangle'; o.frequency.value=f; o.connect(pad); o.start(t); o.stop(t+6.6); }
  [[293.66,0.6],[440,1.2],[587.33,1.8],[554.37,2.5],[587.33,3.0],[739.99,3.6]].forEach(([f,at])=>{
    const o=A.createOscillator(), g=A.createGain(); o.type='sine'; o.frequency.value=f;
    g.gain.setValueAtTime(0,t+at); g.gain.linearRampToValueAtTime(0.07,t+at+0.06); g.gain.exponentialRampToValueAtTime(0.0001,t+at+(at>3.5?2.8:1.2));
    o.connect(g).connect(A.destination); o.start(t+at); o.stop(t+at+3); });
}

/* ================= FADE ================= */
function fade(to,dur){ const f=$('fade'); f.style.transition='opacity '+(dur||0)+'s'; f.style.opacity=to; }
function show(id){ $(id).classList.remove('off'); }
function hide(id){ $(id).classList.add('off'); }

/* ================= THE ROAD BACK TO THE LAUNCHER =================
   An act is played on its own page; the road, the Codex and the journal are on the launcher
   (story/index.html). When an act is finished, or left, the launcher is gone back to. */
function showHub(msg){
  ST.finished=msg||'left';
  if(ST.stay) return;                        /* the test harness stays on the page */
  location.href='index.html'+(ST.doneId?'?done='+encodeURIComponent(ST.doneId):'');
}

/* ================= THE JOURNAL — the road walked, and those walked with =================
   Each scene witnessed is written into the journal: the place on the road from Bĕyth Leḥem
   to Rome, and the day. Those who are called to follow Him (Kepha, Andri, Ya‛aqoḇ,
   Yahuchanon, Philip, Nethan’al …) are walked with, scene by scene: the journal keeps which
   scenes the witness shared with each, and so how near each has become. Nothing is said by
   them that the Besorah does not say — the bond is only what was seen together. */
/* the same man by both his names: Shim‛on is named Kĕpha the day he is brought (Yahuchanon 1:42) */
const FOLLOWERS={kepha:'kepha',shimon:'kepha',andri:'andri',yaaqob:'yaaqob',yahuchanon:'yahuchanon',philip:'philip',nethanel:'nethanel',mattithyahu:'mattithyahu',
  bartholomi:'bartholomi',toma:'toma',yaaqobA:'yaaqobA',shimonZ:'shimonZ',yahudahY:'yahudahY'};
function journal(sc){
  save.road=save.road||{}; save.bonds=save.bonds||{};
  const k=act.id+'/'+sc.id;
  save.road[k]={place:sc.place,title:sc.title||'',date:sc.date||'',act:act.id};
  for(const a of sc.actors||[]){ const id=FOLLOWERS[a.id]; if(!id) continue;
    /* Yahuchanon the immerser is not Yahuchanon son of Zaḇdai */
    if((id==='yahuchanon'||id==='yaaqob')&&!/Zaḇdai/.test(a.key||'')) continue;
    /* nor is the righteous Shim‛on of the courts (Luke 2:25) Shim‛on Kĕpha */
    if(id==='kepha'&&!/Kĕpha/.test(a.key||'')) continue;
    const b=save.bonds[id]=save.bonds[id]||{name:a.name,scenes:[]};
    if(id==='kepha'&&a.id==='kepha') b.name=a.name;
    if(b.scenes.indexOf(k)<0) b.scenes.push(k); }
  persist();
}

/* ================= THE FRAME =================
   The voyage runs the frame — its sea, its sky, its light, its chunks — and calls this at the
   end of each one (window.__STAGE_TICK), before it draws: the story moves its people, holds
   its camera, keeps His face from the lens, and sets the voyage's eye from its own. */
function frame(dtW){
  const dt0=Math.min(0.05,clock.getDelta()), dt=ST.simDt||dt0, t=clock.elapsedTime;
  if(!running||!ctx){ idleView(t); return; }
  keepWorld();
  beatT+=dt;
  if(ST.playtest) playStep();
  if(ST.walkWatch) walkWatch(dt);
  softT++; movePlayer(dt); moveActors(dt); moveFlock(dt,t);
  if(ctx.tickers) for(const f of ctx.tickers) f(dt);                                   /* a set's own motion: the wheat in the wind */
  for(const f of ctx.flicker){ const k=0.85+Math.sin(t*13)*0.08+Math.sin(t*7.3)*0.07; f.sprite.scale.setScalar(f.base*k); if(f.light) f.light.intensity=1.4*k; }
  for(const id in ctx.glows){ const G=ctx.glows[id];
    if(G.on){ const g=G.on, u=g.userData, hy=g.position.y+(u.headY||1.6)+0.24*(u.s||1)+G.onDy;   /* on the top of the head, sitting or standing (the figure is already set down for sitting) */
      G.sprite.position.set(g.position.x,hy,g.position.z); if(G.light) G.light.position.set(g.position.x,hy,g.position.z); }
    if(G.pulse){ const k=1+Math.sin(t*2)*0.08; G.sprite.scale.set(G.base*k,G.base*k*(G.aspect||1),1); }
    /* held in a seraph's tongs (`carry`): it goes where they go */
    if(G.onTongs){ const F=ctx.glows[G.onTongs]&&ctx.glows[G.onTongs].fig, tt=F&&F.userData.tongTip;
      if(tt&&F.visible){ F.updateMatrixWorld(true); tt.getWorldPosition(_tt); ctx.scene.worldToLocal(_tt); G.sprite.position.copy(_tt); if(G.light) G.light.position.copy(_tt); } }
    if(G.fig&&G.sprite.visible) malakTick(G,id,dt); }
  if(ctx.host) for(const G of ctx.host){ if(!G.visible) continue; G.sprite.position.y+=Math.sin(t*1.3+G.ph)*0.01; }
  if(ring){ ring.material.opacity=0.55+Math.sin(t*4)*0.25; }
  for(const w of ctx.water) w.material.opacity=0.82+Math.sin(t*1.7)*0.05;
  for(const D of ctx.drifts){ if(D.t>=1) continue; D.t=Math.min(1,D.t+dt/D.dur); const e=D.t<0.5?2*D.t*D.t:1-Math.pow(-2*D.t+2,2)/2;
    D.objs.forEach((o,k)=>{ if(D.by) o.position.copy(D.from[k]).addScaledVector(D.by,e); else o.position.lerpVectors(D.from[k],D.to,e);
      if(o===player&&ctx.playerY!==undefined) ctx.playerY=o.position.y;
      if(o.userData&&o.userData.fixedY!==undefined) o.userData.fixedY=o.position.y;
      if(o.userData&&o.userData.baseY!==undefined) o.userData.baseY=o.position.y; }); }
  for(const id in ctx.things){ const o=ctx.things[id], u=o.userData; if(u.heldBy) holdTick(o); if(u.thing&&u.thing.kind==='chain'&&o.visible) chainTick(o); }
  for(const id in ctx.things){ const o=ctx.things[id], u=o.userData; const w=u.wings||(u.bird&&u.bird.userData&&u.bird.userData.wings); if(w&&w[0]){ const a=Math.sin(t*9)*0.5; w[0].rotation.z=a; w[1].rotation.z=-a; }
    if(u.tick&&o.visible) u.tick(dt);
    if(u.bob&&!ctx.lake){ const k=ctx.rough||1; o.position.y=u.baseY+Math.sin(t*1.3+o.position.x)*0.06*k; o.rotation.z=Math.sin(t*0.9+o.position.z)*0.025*k; } }
  if(ctx.lake&&(ctx.lake.w||ctx.lake.voyage)) lakeTick(dt);
  lifeTick(dt); wadeTick(dt); folkTick(dt); doorsTick(dt);
  if(portrait&&!$('sverse').classList.contains('off')) drawPortrait();
  { const T=SV.talk, g=T&&T.sp&&T.sp.glow&&ctx.glows[T.sp.glow];          /* a mal'ak's light swells with the words */
    if(g){ const m=SV.mouth(T.sp.key)||0, k=1+m*0.12; g.sprite.scale.set(g.base*k,g.base*k*(g.aspect||1),1); } }
  if(ST.fast) fastStep();
  if(onFrame) onFrame(dt);
  actPressed=false; if(ST.playtest) actHeld=false;
  updateCamera(dt);
  /* the test harness may hold the eye on a point (ST.camHold: {from,look}) — never past the guard */
  if(ST.camHold){ camera.position.set(...ST.camHold.from); camera.lookAt(...ST.camHold.look); }
  guardFace();
  writeCamera();
  sceneLamp();
}
/* THE WITNESS'S LAMP: night in the voyage's world is truly dark. In a scene by night, at dusk,
   or under a roof, what the eye looks at is lit warmly — by the voyage's own torch-light on the
   blocks and beasts, and by a small lamp on the people of the scene. */
let lampLight=null;
function sceneLamp(){
  const k=K(); if(!k.lamp||!root) return;
  const at=lookAtNow(), lx=at[0], ly=at[1], lz=at[2];
  const roofed=k.solidAt(anchor.x+lx*SX,anchor.y+(ly+2.6)*S,anchor.z+lz*SX)||k.solidAt(anchor.x+lx*SX,anchor.y+(ly+3.6)*S,anchor.z+lz*SX);
  const want=timeNow==='night'?0.85:timeNow==='dusk'?0.5:timeNow==='dawn'?0.35:roofed?0.45:0;
  if(!lampLight){ lampLight=new THREE.PointLight(0xffd9a0,0,14*S,1.4); }
  if(lampLight.parent!==root) root.add(lampLight);
  lampLight.position.set(lx,ly+1.6,lz); lampLight.intensity=want*1.3;
  if(want>0) k.lamp(anchor.x+lx*SX,anchor.y+(ly+1.2)*S,anchor.z+lz*SX,want,12*S);
}
/* the world is held for the scene: the hour the scene names, the traveller where the witness
   is (so the ground about him is the ground that is built), and never seen */
function standWalker(x,z,y){
  const k=K(), w=k.state.walk;
  if(k.state.mode!=='walk') k.setMode('walk');
  w.x=x; w.z=z; w.feetY=y; w.vy=0; w.grounded=true;
  const wg=k.walkerG(); if(wg){ wg.visible=false; wg.position.set(x,y,z); }
}
function keepWorld(){
  const k=K();
  if(anchor) k.setLocalHour(hourNow,anchor.x,anchor.z);
  { const cl=k.clouds&&k.clouds(); if(cl&&anchor) cl.position.y=Math.max(k.CLOUD_Y,anchor.y+180*S); }
  const p=player&&!ctx.playerHidden?player.position:{x:0,y:0,z:0};
  standWalker(anchor.x+p.x*SX,anchor.z+p.z*SX,anchor.y+p.y*S);
}
/* with no act running, the eye turns slowly over the city of the great king */
let idleAt=null;
function idleView(t){
  const k=K(); if(!k) return;
  if(!idleAt){ const yp=k.yahruPos&&k.yahruPos(); if(!yp) return; idleAt={x:yp.x,z:yp.z,y:k.topY(yp.ix,yp.iz)}; standWalker(idleAt.x,idleAt.z+60,idleAt.y); }
  const vc=k.camera, a=t*0.035, R=820;
  vc.position.set(idleAt.x+Math.sin(a)*R, idleAt.y+300, idleAt.z+Math.cos(a)*R);
  vc.lookAt(idleAt.x,idleAt.y+30,idleAt.z); vc.updateMatrixWorld();
}

/* ---- THE PLAYTEST'S HAND: every act played as a player plays it, in the game's own time ----
   The fast hand below sets the witness straight down on every mark and every figure straight on
   his, so it can never find a figure who does not arrive or a mark no one can walk to — and that
   is exactly how the game was once left unfinishable. This hand reads nothing (the text is
   advanced as soon as it shows) but WALKS: it is led to each mark by the way a man's feet could
   take (guideSteer), presses E at each thing to be taken up, carries it to its place, and waits
   for every figure the story sends to arrive on his own legs. What could not be done is written
   in ST.stuck. */
function playStep(){
  if(fulfilOpen){ closeFulfil(); return; }
  if(!$('choice').classList.contains('off')){ hide('choice'); nextBeat(); return; }
  if(waitingAdvance){ advance(); return; }
  const B=beat; if(!B) return;
  if(B.t==='cam') camT=1;
  if(B.t==='witness'){ actHeld=true; actPressed=true; }
}
/* ---- WHAT GOES WRONG UNDER A MAN'S FEET (for the playtest) ----
   Every frame: anyone whose body stands inside a block, anyone who drops or jumps more than a
   storey in one step without the story having set him there, anyone whose place is not a number.
   Written once per kind, person and scene into ST.walkErr. */
const _ww=new Map();
function walkWatch(dt){
  const L=ST.walkErr||(ST.walkErr=[]), sid=act&&act.scenes[sceneIx]&&act.scenes[sceneIx].id;
  const note=(who,kind,g)=>{ const key=sid+'|'+who+'|'+kind; if(_ww.get(key)) return; _ww.set(key,1);
    L.push({scene:sid,beat:beatIx,who,kind,at:[Math.round(g.position.x*10)/10,Math.round(g.position.y*10)/10,Math.round(g.position.z*10)/10]}); };
  const look=(who,g,fixed)=>{ if(!g||!g.visible) return; const p=g.position;
    if(!isFinite(p.x)||!isFinite(p.y)||!isFinite(p.z)){ note(who,'not a number',g); return; }
    const u=g.userData, last=u._wwY, cut=u._wwBeat!==beatIx||u._wwScene!==sid;
    u._wwY=p.y; u._wwBeat=beatIx; u._wwScene=sid;
    if(fixed) return;
    if(!cut&&last!==undefined&&Math.abs(p.y-last)>2.5) note(who,(p.y<last?'dropped ':'jumped ')+Math.round(Math.abs(p.y-last)*10)/10+' m in a step',g);
    { const k=K(), wx=anchor.x+p.x*SX, wz=anchor.z+p.z*SX;
      if(k.solidAt(wx,anchor.y+(p.y+0.9)*S,wz)&&k.solidAt(wx,anchor.y+(p.y+1.5)*S,wz)) note(who,'body inside a block'+(g.userData._mv?' ('+g.userData._mv+')':' (where he was set)'),g); } };
  if(!ctx.playerHidden) look('the witness',player,ctx.playerY!==undefined);
  for(const id in ctx.actors){ const g=ctx.actors[id], u=g.userData; look(id,g,u.fixedY!==undefined||!!u.aboard||!!u.ride||!!u.lie); }
}
/* ---- THE TEST HARNESS'S HAND: one beat a frame, taken as a player would ---- */
function fastStep(){
  const B=beat; if(!B) return;
  if(fulfilOpen){ closeFulfil(); return; }
  if(!$('choice').classList.contains('off')){ hide('choice'); nextBeat(); return; }
  if(waitingAdvance){ advance(); return; }
  if(B.t==='witness'&&witness){ const W=witness;
    if(W.carrying){ const o=ctx.things[W.carrying]; player.userData.carrying=player.userData.holding=false; o.userData.following=false;
      { const f=ctx.groundY(o.position.x,o.position.z,player.position.y+1.0); if(f!=null&&isFinite(f)) o.position.y=f-(o.userData.soft?o.userData.soft[2]:0); }   /* (down where he is, on his floor) */
      const id=W.carrying; W.carrying=null; witnessDone(id); return; }
    for(const id of B.items) if(!W.done.has(id)){ witnessDone(id); return; } }
  if(B.t==='goal'){ const m=pos(B.goto); player.position.set(m[0],ctx.groundY(m[0],m[1]),m[1]); return; }
  if(B.t==='cam') camT=1;
}

/* ================= BOOT ================= */
ST.boot=function(opt){
  opt=opt||{};
  loadSave(); initGL(); wireInput();
  /* the world's clock is taken off the room's own ('live'), or the hour a scene names would be
     read back over four times a second */
  { const st=K().state; if(st.dayIdx===0) st.dayIdx=1; }
  K().setNames(false);                     /* no names of the lands written over a scene */
  window.__STAGE_TICK=dt=>{ try{ frame(dt); }catch(e){ console.error(e); } };
  if(opt.act){ const a=ST.acts.find(q=>q.id===opt.act); if(a){ ambience(); runAct(a,opt.scene||0); } }
  else showHub();
  /* for the test harness: where the story stands, and a way to run it */
  window.__STORY={ST,save,get act(){ return act&&act.id; },get scene(){ return act&&act.scenes[sceneIx]&&act.scenes[sceneIx].id; },
    get beat(){ return beat; },get beatIx(){ return beatIx; },run:(id,s)=>{ const a=ST.acts.find(q=>q.id===id); stopAct(); runAct(a,s||0); },
    advance, get running(){ return running; }, ctx:()=>ctx, faceExposed, dbg:{blocked,solidFor,planWay,ground:(x,z,r)=>ctx.groundY(x,z,r),pos:m=>pos(m),clearShot,lineClear,camFree,exposedFrom,HOURS,applyTime,free:()=>{ releaseCamera(); controlsOn=true; onFrame=null; }}, player:()=>player, camera:()=>camera,
    stuck:()=>ST.stuck||[], beatT:()=>beatT,
    reset:()=>{ save.codex={}; save.acts={}; save.witnessed=0; save.road={}; save.bonds={}; persist(); } };
};
})();
