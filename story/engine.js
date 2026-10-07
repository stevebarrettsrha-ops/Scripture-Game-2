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
  vc.position.set(anchor.x+camera.position.x*S, anchor.y+camera.position.y*S, anchor.z+camera.position.z*S);
  vc.quaternion.copy(camera.quaternion);
  if(vc.fov!==camera.fov){ vc.fov=camera.fov; vc.updateProjectionMatrix(); }
  if(camera.aspect!==vc.aspect){ camera.aspect=vc.aspect; camera.updateProjectionMatrix(); }
  vc.updateMatrixWorld();
}
/* the ground under a point of the scene, in its metres; `ref` the height the asker stands
   at (so a floor under a roof is found, and not the roof) */
/* WATER IS NOT GROUND: where the floor found is the face of a pool, a river or a lake, a man goes
   down through it to its bed — and in water deeper than his chest he is held at his chest, his head
   and shoulders above it, wading or swimming, never standing on it */
function groundAt(x,z,ref){
  const y=groundAt0(x,z,ref), k=K();
  if(!k.waterAt||!anchor) return y;
  const B=k.B, wx=anchor.x+x*S, wz=anchor.z+z*S, wy=anchor.y+y*S;
  if(!k.waterAt(wx,wy-0.5*B,wz)) return y;
  let b=wy-0.5*B, n=0; while(n<12&&k.waterAt(wx,b,wz)){ b-=B; n++; }
  const bed=(Math.floor(b/B)+1)*B;                                            /* the top of the first block that is not water */
  return Math.max((bed-anchor.y)/S, y-1.25);
}
function groundAt0(x,z,ref){
  const k=K(); let r;
  if(ref!==undefined) r=anchor.y+ref*S;
  else if(ctx&&ctx.api){ if(ctx.api.inPadL(x,z)) r=anchor.y+2.2*S;
    else { const m=ctx.api.moundL(x,z); if(m!==null) r=anchor.y+(m+0.5)*S; } }
  /* with nothing to say how high (the city's courts, terraces, houses and the Hĕḵal), the
     floor is found from below: up from under the natural ground, through the stone, to the
     first floor with a man's headroom over it — the platform's top in the courts, the floor
     under a roof, never the roof (the world's own query only looks two courses above the
     land, and would stand a man inside a platform built higher than that) */
  if(r===undefined){ const B=k.B, wx=anchor.x+x*S, wz=anchor.z+z*S, c=k.cell(Math.floor(wx/B),Math.floor(wz/B));
    if(c){ let b=c.h-6, n=0;
      while(n<40&&!k.solidAt(wx,(b+0.5)*B,wz)){ b++; n++; }
      for(;n<120;){ while(n<120&&k.solidAt(wx,(b+0.5)*B,wz)){ b++; n++; }
        if(!k.solidAt(wx,(b+1.5)*B,wz)) break;
        b++; n++; }
      return (b*B-anchor.y)/S; } }
  const g=k.groundInfo(anchor.x+x*S,anchor.z+z*S,r);
  return ((g&&g.y!=null?g.y:anchor.y)-anchor.y)/S;
}
/* THE GROUND UNDER ONE OF THE SCENE'S PEOPLE as they go: a step of one course is taken up if
   there is room for a man over it; a wall is never climbed course by course onto a roof */
function stepGround(x,z,cur){
  let f=groundAt(x,z,cur+1.0);
  if(f>cur+0.05){ const k=K(), B=k.B, wx=anchor.x+x*S, wz=anchor.z+z*S, fy=anchor.y+f*S;
    if(f>cur+1.0||k.solidAt(wx,fy+0.5*B,wz)||k.solidAt(wx,fy+1.5*B,wz)) f=cur; }
  return f;
}
/* is a man of the scene stopped here? the blocks of the world are what stop him: a step of
   one course he climbs; anything higher, or a lintel at his head, he does not */
function solidFor(x,z,y){
  const k=K(), B=k.B, wx=anchor.x+x*S, wz=anchor.z+z*S, foot=anchor.y+y*S;
  const at=d=>k.solidAt(wx,foot+d*B,wz);
  if(at(0.5)) return at(1.5)||at(2.5);
  return at(1.5);
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
function buildScene(sc){
  dropScene();
  const k=K();
  /* WHERE IT HAPPENED: the place's anchor in the world (story/places.js) */
  const A=window.STORYPLACES.at(sc.place,act);
  anchor=A;
  /* THE SEASON is the scene's own, not the voyage's year: spring unless the scene names
     another (Rome was founded, by its own reckoning, on 21 April; the shepherds lay out in the
     fields; the lake is crossed in fair weather) — the snow is never laid on a scene by chance */
  if(window.SEASON) SEASON.setSeason(sc.season||act.season||'Spring');
  root=new THREE.Group(); root.name='story-scene'; root.position.set(A.x,A.y,A.z); root.scale.setScalar(S); k.scene.add(root);
  scene=root;
  ctx={scene:root,colliders:[],markers:{},actors:{},things:{},glows:{},water:[],flicker:[],flock:[],bounds:null,wind:[0.5,0.2],place:sc.place,period:sc.period||A.period,anchor:A};
  ctx.groundY=(x,z,ref)=>groundAt(x,z,ref);
  /* the traveller is stood there, unseen, so the world is built about the scene */
  standWalker(A.x,A.z,A.y);
  /* the city of the great king is the voyage's own, raised as she stood in the act's days;
     a scene there lays only its own things about her */
  if(A.city){ ctx.markers=Object.assign({},k.yahruAs(sc.period||A.period)); }   /* a scene may stand in another of her days */
  if(k.aimOff) k.aimOff(true);                                    /* (the voyage's mark on the block in reach is not the story's) */
  ctx.api=k.setBuilder(A.x,A.z,A.y);
  const st=new window.STORYWORLD.Static(ctx.api);
  const build=window.STORYSETTINGS[sc.place];
  if(!build) throw new Error('no such place: '+sc.place);
  build(ctx,st);
  ctx.api.end();
  root.add(st.mesh());
  k.updateChunks(A.x,A.z,9999);
  /* every chunk the last set was taken out of, and this one laid into, is built again now,
     behind the fade — not a few a frame while the scene plays */
  if(k.flushEdits) for(let n=0;n<40&&k.flushEdits(4000);n++){}
  applyTime(sc.time||'day');
  setBed(sc.place,sc.time||'day');
  /* the people of the scene */
  for(const a of sc.actors||[]){
    const g=window.STORYWORLD.person(ctx,a);
    const p=pos(a.at); g.position.set(p[0],ctx.groundY(p[0],p[1]),p[1]); g.userData.id=a.id;
    g.rotation.y=a.face!==undefined?a.face:0;
    g.userData.id=a.id; g.userData.name=a.name; g.userData.target=null; g.userData.follow=null; g.userData.def=a;
    if(a.y!==undefined){ g.userData.fixedY=yOf(a.y); g.position.y=g.userData.fixedY; }
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
    else { obj=new THREE.Mesh(new THREE.BoxGeometry(t.w||0.5,t.h||0.5,t.d||0.5),new THREE.MeshLambertMaterial({color:t.color||0xc9b38a}));
      /* `y` a height in the scene; `dy` (or nothing) above the ground where it lies */
      const gy=t.y!==undefined?t.y:(ctx.groundY(p[0],p[1])||0)+(t.dy||0);
      obj.position.set(p[0],gy+(t.h||0.5)/2,p[1]); scene.add(obj); }
    if(t.face!==undefined) obj.rotation.y=t.face;
    if(t.hidden) obj.visible=false;
    if(t.y!==undefined&&t.kind!=='box'&&t.kind!=='dove'&&t.kind!=='throne'&&t.kind!=='vision'&&t.kind!=='fish') obj.position.y=t.y;
    obj.userData.thing=t; obj.userData.baseY=obj.position.y; ctx.things[t.id]=obj; }
  placeCrowds(sc);
  spawnLife();
  spawnFolk(sc);
  /* THE LAKE'S OWN WAVES, where the set has asked for them (S.galilSea): laid over the still water,
     which is put by beneath them */
  if(ctx.lake&&K().ripple){ const L=ctx.lake, r=L.rect;
    L.w=window.STORYWORLD.lakeWaves(ctx,r); L.A=0.025+0.075*(ctx.rough||1); L.t=0;
    root.updateMatrixWorld(true);                   /* (not yet drawn: its world matrix is not yet worked out) */
    const a=root.localToWorld(new THREE.Vector3(r[0],0,r[1])), b=root.localToWorld(new THREE.Vector3(r[2],0,r[3]));
    K().lakeHide([Math.min(a.x,b.x),Math.min(a.z,b.z),Math.max(a.x,b.x),Math.max(a.z,b.z)]); }
  /* lights: a mal'ak is LIGHT, never a figure; so is the Child (reverent framing) */
  for(const gl of sc.glows||[]){
    /* at [x,y,z]; or at a marker (or a marker and a step from it), `y` high, or `dy` above the ground there */
    /* `on`: a light that rests on someone's head and goes with him — "tongues as of fire,
       and one sat upon each of them" (Acts 2:3) — `dy` above the top of the head */
    if(gl.on&&ctx.actors[gl.on]&&!gl.at) gl.at=[0,0,0];
    const p=gl.at.length===3&&typeof gl.at[0]==='number'?gl.at:(()=>{ const m=pos(gl.at);
      return [m[0],gl.dy!==undefined?(ctx.groundY(m[0],m[1])||0)+gl.dy:(gl.y||2),m[1]]; })();
    const G=window.STORYWORLD.glow(ctx,p[0],p[1],p[2],gl.size||3,gl.color,gl.intensity===undefined?1.2:gl.intensity);
    if(gl.h){ G.sprite.scale.set(gl.size||3,gl.h,1); G.aspect=gl.h/(gl.size||3); }      /* a column of light keeps its height as it pulses or swells */
    G.visible=!gl.hidden; G.pulse=gl.pulse; if(gl.on&&ctx.actors[gl.on]){ G.on=ctx.actors[gl.on]; G.onDy=gl.dy===undefined?0.18:gl.dy; } ctx.glows[gl.id]=G; }
  ctx.drifts=[];
  if(sc.host){ ctx.host=[]; const h=sc.host;                     /* the heavenly host */
    for(let k=0;k<h.n;k++){ const a=k/h.n*Math.PI*2, r=h.r*(0.5+0.5*Math.random());
      const G=window.STORYWORLD.glow(ctx,h.at[0]+Math.cos(a)*r,h.y+Math.random()*h.h,h.at[1]+Math.sin(a)*r,1.2+Math.random()*1.2,0xfff4d8,0);
      G.visible=false; G.ph=Math.random()*6; ctx.host.push(G); } }
  ctx.star=null;
  if(sc.star){ const s=sc.star; ctx.star=window.STORYWORLD.glow(ctx,s.at[0],s.y,s.at[1],s.size||14,0xf6f0ff,0); ctx.star.visible=!s.hidden; }
  /* the player */
  const P=sc.player||{};
  player=window.STORYWORLD.person(ctx,Object.assign({robe:0x7a6a8e,cloth:0xcfc6b0,skin:0x8a5a3a},P.look||{}));
  const pp=pos(P.at||[0,0]); player.position.set(pp[0],ctx.groundY(pp[0],pp[1]),pp[1]); player.rotation.y=P.face||0;
  camYaw=(P.face||0)+Math.PI; camTarget=null;
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
  const k=K(), taken=[];
  for(const id in ctx.actors){ const g=ctx.actors[id]; taken.push([g.position.x,g.position.z,1.1]); }
  for(const id in ctx.things){ const o=ctx.things[id]; taken.push([o.position.x,o.position.z,1.2]); }
  const pp=pos((sc.player&&sc.player.at)||[0,0]); taken.push([pp[0],pp[1],1.6]);
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
      const y=ctx.groundY(x,z); if(y==null||!isFinite(y)) continue;
      const wx=anchor.x+x*S, wz=anchor.z+z*S;
      if(k.solidAt(wx,anchor.y+(y+0.5)*S,wz)||k.solidAt(wx,anchor.y+(y+1.4)*S,wz)) continue;     /* in a wall, a tree, a house */
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
    const mesh=window.STORYWORLD.crowd(ctx,figs); mesh.visible=!c.hidden; mesh.userData.crowd=true; ctx.things[c.id]=mesh; }
}
/* ---- THE LIFE OF THE WATERS, AND THE WATER STIRRED ----
   Is there water at (x,z) under the face `y`? (a pool's, a river's, a lake's blocks) */
function wetAt(x,z,y){ const k=K(); return !!(k.waterAt&&k.waterAt(anchor.x+x*S,anchor.y+((y||0)-0.3)*S,anchor.z+z*S)); }
function toW(x,y,z){ return new THREE.Vector3(anchor.x+x*S,anchor.y+y*S,anchor.z+z*S); }
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
    if(!k.waterAt(anchor.x+x*S,anchor.y+(g.position.y+0.35)*S,anchor.z+z*S)) return;
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
  const room=(x,z,r)=>{ const gy=ctx.groundY(x,z); r=r||0.36; return !wallAt(x,z,gy)&&!wallAt(x+r,z,gy)&&!wallAt(x-r,z,gy)&&!wallAt(x,z+r,gy)&&!wallAt(x,z-r,gy); };
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
        if(W.donkeyFree){ F.beast=W.donkeyFree(ctx,A[0],A[1],'ox'); F.beastAhead=2.2; }
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
    for(const q of ctx.folkSolids||[]) if(Math.hypot(q[0]-px,q[1]-pz)<q[2]+0.3&&Math.hypot(q[0]-g.position.x,q[1]-g.position.z)>q[2]+0.05) return false;
    for(const O of ctx.folk) if(O!==F&&Math.hypot(O.g.position.x-px,O.g.position.z-pz)<0.62) return false;
    return true; };
  if(!free(a)){
    let ok=false; for(const da of [0.5,-0.5,1.0,-1.0,1.5,-1.5,2.1,-2.1]){ const b=a+da; if(free(b)){ a=b; ok=true; break; } }
    if(!ok){ F.stuck=(F.stuck||0)+dt; return true; } }
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
            if(!wallAt(x,z,ctx.groundY(x,z))&&!wetAt(x,z,ctx.groundY(x,z)+0.2)) p=[x,z]; }
          if(p){ F.to=p; F.state='go'; F.stuck=0; } else F.t=2; } }
      else { moving=folkStep(F,F.to,dt); if(!moving||(F.stuck||0)>4){ F.state='pause'; F.t=F.job==='play'?0.4+Math.random()*1.2:F.job==='herd'?3+Math.random()*5:3+Math.random()*7; } } }
    else if(F.job==='water'){
      if(F.state==='down'){ moving=folkStep(F,F.S,dt); if(!moving||(F.stuck||0)>8){ F.state='fill'; F.t=3+Math.random()*3; F.stuck=0; } }
      else if(F.state==='fill'){ u.sit=true; if(F.t<=0){ u.sit=false; F.state='up'; F.home=F.H[Math.floor(Math.random()*F.H.length)]; } }
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
    if(F.job==='water'&&(F.state==='up'||F.state==='home')){ A.rotation.x=-2.55; A.rotation.z=0.42; if(E(A)) E(A).rotation.x=-1.25; }   /* the hand up on the jar, the elbow out */
    else if((F.job==='carry'||F.job==='walk'||F.job==='stroll')&&F.load&&F.load.visible){ L.rotation.x=-2.55; L.rotation.z=-0.42; if(E(L)) E(L).rotation.x=-1.25; }
    else if(F.job==='water'&&F.state==='down'){ A.rotation.x=-0.15; A.rotation.z=-0.12; if(E(A)) E(A).rotation.x=-0.25; }   /* the empty jar swung at the hip */
    else if(F.job==='water'&&F.state==='fill'){ bend=0.55; A.rotation.x=L.rotation.x=-1.25+Math.sin(w*2)*0.1; }
    else if(F.job==='grind'){ const s=Math.sin(w*2.6); bend=0.32+s*0.14;                 /* rocking over the stone as she pushes it round */
      A.rotation.x=L.rotation.x=-1.0+s*0.25; if(E(A)) E(A).rotation.x=E(L).rotation.x=-0.3-s*0.25; }
    else if(F.job==='mend'){ bend=0.42; A.rotation.x=-1.05+Math.sin(w*3.1)*0.12; L.rotation.x=-0.95+Math.sin(w*2.3)*0.1; if(E(A)) E(A).rotation.x=-0.7; }
    else if(F.job==='spin'){ bend=0.08; L.rotation.x=-1.9; L.rotation.z=0.3; A.rotation.x=-0.6+Math.sin(w*4)*0.08; }
    else if(F.job==='wash'){ const s=Math.sin(w*3); bend=0.6+s*0.08; A.rotation.x=L.rotation.x=-1.3+s*0.25; }   /* bent over the washing, scrubbing */
    else if(F.job==='sweep'){ const s=Math.sin(w*2.2); bend=0.32; knees=0.15; A.rotation.x=-0.75; L.rotation.x=-0.85; A.rotation.z=s*0.35; L.rotation.z=s*0.3; }
    else if(F.job==='hoe'){ const s=(Math.sin(w*1.9)+1)/2; bend=0.15+(1-s)*0.45; knees=0.2;  /* up with the hoe, and down at the waist with the stroke */
      A.rotation.x=L.rotation.x=-0.4-s*2.0; if(E(A)) E(A).rotation.x=E(L).rotation.x=-0.3*s; }
    else if(F.job==='reap'){ const s=Math.sin(w*2.4); bend=1.0+s*0.08; knees=0.32;         /* bent deep at the waist over the ears, knees given, the sickle sweeping low */
      A.rotation.x=-1.35+s*0.25; A.rotation.z=s*0.45; L.rotation.x=-1.2+Math.max(0,-s)*0.2; L.rotation.z=0.15; if(E(L)) E(L).rotation.x=-0.5; }
    else if(F.job==='hammer'){ const s=Math.max(0,Math.sin(w*4.2)); bend=0.22; A.rotation.x=-0.7-s*1.3; L.rotation.x=-0.8; }
    else if(F.job==='pick'){ bend=-0.08; }                                                 /* reaching up into the tree, leaning back a little */
    else if(F.job==='pick'){ const s=Math.sin(w*1.4); A.rotation.x=-2.7+s*0.3; L.rotation.x=-2.3-s*0.3; }
    else if(F.job==='sell'||F.job==='talk'){ const turn=F.job==='talk'?((Math.floor(T/4)%F.m)===F.turn):Math.sin(w*0.3)>0.6;
      u.talkM=turn?0.4+Math.sin(T*7+F.ph)*0.3:undefined; if(u.setFace) u.setFace(turn&&Math.sin(T*11+F.ph)>0?1:0,false,'calm'); }
    else if(F.job==='herd'&&E(A)) {}
    if(u.waist){ u.waist.rotation.x+=(bend-u.waist.rotation.x)*Math.min(1,dt*6);
      if(u.head&&!u.holy) u.head.rotation.x=-Math.max(0,u.waist.rotation.x)*0.32; }          /* the head kept up a little, looking at the work */
    if(knees&&!u.sit&&u.legL){ for(const Lg of [u.legL,u.legR]){ Lg.rotation.x=-knees*0.7; if(Lg.userData.knee) Lg.userData.knee.rotation.x=knees*1.4; }
      g.position.y=u.gy-knees*0.12; }                                                       /* the knees given, the body let down on them */
  }
}
function pos(at){ if(typeof at==='string'){ const m=ctx.markers[at]; if(m) return m;
    const g=ctx.actors[at]||ctx.things[at]; if(g) return [g.position.x,g.position.z];   /* a person or a thing: where they are now */
    throw new Error('no marker '+at); }
  /* a marker and a step from it: ['pinnacle',1.6,-0.7] */
  if(Array.isArray(at)&&typeof at[0]==='string'){ const m=pos(at[0]); return [m[0]+at[1],m[1]+at[2]]; }
  return at; }
/* a height given as a marker's (the city's 'pinnacleY'), or as metres */
function yOf(y){ return typeof y==='string'?pos(y)[0]:y; }
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
function movePlayer(dt){
  if(!player||ctx.playerHidden) return;
  let fx=0, fz=0;
  if(controlsOn&&!ctx.playerLock){
    if(keys.KeyW||keys.ArrowUp) fz+=1; if(keys.KeyS||keys.ArrowDown) fz-=1;
    if(keys.KeyA||keys.ArrowLeft) fx-=1; if(keys.KeyD||keys.ArrowRight) fx+=1;
    if(joy.active){ fx+=joy.x; fz-=joy.y; } }
  const L=Math.hypot(fx,fz), ud=player.userData;
  if(L>0.05){
    const sp=(keys.ShiftLeft||keys.ShiftRight?6.2:3.6)*Math.min(1,L);
    const fwd=camYaw+Math.PI, ang=fwd+Math.atan2(fx,fz);
    const dx=Math.sin(ang)*sp*dt, dz=Math.cos(ang)*sp*dt;
    const x=player.position.x, z=player.position.z;
    const y=player.position.y;
    if(!blocked(x+dx,z,0.3,y)) player.position.x+=dx;
    if(!blocked(player.position.x,z+dz,0.3,y)) player.position.z+=dz;
    player.rotation.y=turnTo(player.rotation.y,ang,dt*10);
    ud.walk=(ud.walk||0)+dt*sp*2.2;
  } else ud.walk=0;
  if(ctx.playerY!==undefined) player.position.y=ctx.playerY;
  else { const gy=ctx.groundY(player.position.x,player.position.z,player.position.y+1.5);
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
  const e=Math.min(x-r[0],r[2]-x,z-r[1],r[3]-z); if(e<=0) return 0;
  const ef=e>=6?1:(e/6)*(e/6)*(3-2*e/6);
  const wl=Math.hypot(ctx.wind[0],ctx.wind[1])||1, dx=ctx.wind[0]/wl, dz=ctx.wind[1]/wl;
  let h=0;
  for(const c of window.STORYWORLD.LAKE_WAVES){ const k=2*Math.PI/c[1], om=Math.sqrt(9.8*k), cs=Math.cos(c[0]), sn=Math.sin(c[0]);
    const Dx=cs*dx-sn*dz, Dz=sn*dx+cs*dz; h+=L.A*c[2]*Math.sin(k*(Dx*x+Dz*z)-om*L.t); }
  return h*ef; }
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
  const U=L.w.U; U.uT.value=L.t; U.uA.value=L.A;
  { const wl=Math.hypot(ctx.wind[0],ctx.wind[1])||1; U.uDir.value.set(ctx.wind[0]/wl,ctx.wind[1]/wl); }
  /* the boats ride it: heave with the water under her, pitch and roll with its slope, and heel to the wind */
  let main=null;
  for(const id in ctx.things){ const o=ctx.things[id], u=o.userData; if(!u.bob||!o.visible) continue;
    const B=u.boat||{len:7,beam:2}, h=o.rotation.y, fx=Math.sin(h), fz=Math.cos(h), rx=Math.cos(h), rz=-Math.sin(h);
    const x=o.position.x, z=o.position.z, ha=B.len*0.36, hb=B.beam*0.5;
    const hc=lakeH(x,z), hf=lakeH(x+fx*ha,z+fz*ha), hs=lakeH(x-fx*ha,z-fz*ha), hp=lakeH(x+rx*hb,z+rz*hb), hn=lakeH(x-rx*hb,z-rz*hb);
    const cl=(v,m)=>v<-m?-m:v>m?m:v;
    u.heave=(hc*2+hf+hs)/4*0.9; u.pitch=cl(Math.atan2(hf-hs,2*ha),0.2); u.roll=cl(Math.atan2(hp-hn,2*hb)*0.8,0.24);
    o.position.y=u.baseY+u.heave; o.rotation.x=-u.pitch; o.rotation.z=u.roll;
    if(u.boat&&!main) main=o; }
  if(main){ U.uBoat.value.set(main.position.x,main.position.z,main.userData.boat.len,main.userData.boat.beam); U.uBoatH.value=main.rotation.y;
    const w=toWorld(main.position.x,0,main.position.z); KIT.ripple.focus({x:w.x,y:w.y,z:w.z}); }
  /* everyone in her moves with her; everyone on the water stands on its face */
  const ride=(g,base)=>{ if(!main) return false; const b=inBoat(main,g.position.x,g.position.z); if(!b) return false;
    const u=main.userData; g.position.y=base+u.heave+b.al*Math.sin(u.pitch)+b.ac*Math.sin(u.roll); return true; };
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
function sitDrop(u){ return u.sit?(groundSit(u)?0.63:0.44)*(u.s||1):0; }
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
  /* THE SPEAKER'S HANDS: one who is speaking and standing still lifts a hand with the words */
  if(u.talkM!==undefined&&!moving&&!u.sit&&!u.carrying&&u.armR){ const k=u.talkM;
    u.armR.rotation.x+=(-0.55-k*0.35+Math.sin(u.phase*0.9)*0.08-u.armR.rotation.x)*Math.min(1,dt*5);
    u.armL.rotation.x+=(-0.18-k*0.15-u.armL.rotation.x)*Math.min(1,dt*4); }
  /* knees and elbows fold as the voyage's folk fold theirs */
  const jt=K().jointTick; if(jt&&u.legL&&!u.sit) for(const L of [u.legL,u.legR,u.armL,u.armR]) jt(L,moving);
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
  if(u.armsOut&&u.armL){ const up=u.armsOut==='up';
    u.armL.rotation.set(0,0,up?Math.PI+0.36:Math.PI/2); u.armR.rotation.set(0,0,up?-(Math.PI+0.36):-Math.PI/2);
    for(const A of [u.armL,u.armR]) if(A.userData.elbow) A.userData.elbow.rotation.x=0;
    u.legL.rotation.set(0,0,up?-0.03:0); u.legR.rotation.set(0,0,up?0.03:0);
    for(const L of [u.legL,u.legR]) if(L.userData.knee) L.userData.knee.rotation.x=up?0.08:0;
    if(up&&u.head) u.head.rotation.x=0.22; }
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
function wallAt(x,z,gy){ if(gy===undefined) return false; const k=K(), wx=anchor.x+x*S, wz=anchor.z+z*S;
  return k.solidAt(wx,anchor.y+(gy+0.9)*S,wz)||k.solidAt(wx,anchor.y+(gy+1.5)*S,wz); }
/* the actors walk where the story sends them */
function moveActors(dt){
  for(const id in ctx.actors){ const g=ctx.actors[id], u=g.userData;
    if(u.aboard) continue;
    let tgt=u.target;
    if(u.follow){ const f=u.follow==='player'?player:ctx.actors[u.follow];
      if(f){ const d=Math.hypot(f.position.x-g.position.x,f.position.z-g.position.z); tgt=d>2.4?[f.position.x,f.position.z]:null; } }
    let moving=false;
    if(tgt){ const dx=tgt[0]-g.position.x, dz=tgt[1]-g.position.z, d=Math.hypot(dx,dz);
      if(d>0.15){ const sp=Math.min(d,(u.speed||2.6)*dt);
        /* a wall in the way is gone round, not walked through: the step is turned aside, a
           little and then more, until the body would not stand in a block */
        let a0=Math.atan2(dx,dz), a=a0;
        if(u.fixedY===undefined&&wallAt(g.position.x+Math.sin(a0)*0.45,g.position.z+Math.cos(a0)*0.45,u.gy)){
          for(const da of [0.5,-0.5,1.0,-1.0,1.5,-1.5,2.1,-2.1]){ const b=a0+da+(u.steer||0)*0.0;
            if(!wallAt(g.position.x+Math.sin(b)*0.45,g.position.z+Math.cos(b)*0.45,u.gy)){ a=b; break; } } }
        g.position.x+=Math.sin(a)*sp; g.position.z+=Math.cos(a)*sp;
        g.rotation.y=turnTo(g.rotation.y,a,dt*8); moving=true; }
      else if(!u.follow) u.target=null; }
    if(u.fixedY!==undefined) g.position.y=u.fixedY-sitDrop(u);
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
    const step=Math.min(d,dt*3.2); if(d>0.05){ o.position.x+=dx/d*step; o.position.z+=dz/d*step; o.rotation.y=turnTo(o.rotation.y,Math.atan2(dx,dz),dt*6); }
    o.position.y=ctx.groundY(o.position.x,o.position.z);
    if(o.children[0]&&K().tickGait){ u.ent=u.ent||{m:o.children[0]}; K().tickGait(u.ent,'donkey',d>0.2?2*S:0,dt); } }
}
/* NO ONE STANDS INSIDE ANOTHER. Two who come closer than a body's breadth step apart, each
   half the way, a little each frame, so a crowd never stands through itself and nobody
   walks through the witness. Those held at a height (in a boat, on a roof), lying down, or
   unseen are left where they are, and so is anyone already at rest on his mark when the one
   coming up to him is walking (the walker gives way). */
const APART=0.46;
const RIDE_H=0.62;                                  /* a rider's seat above the ground, on a young donkey */
function keepApart(dt){
  const L=[]; for(const id in ctx.actors){ const g=ctx.actors[id], u=g.userData; if(!g.visible||u.lie||u.fixedY!==undefined||u.ride||u.aboard) continue; L.push(g); }
  const k=Math.min(1,dt*6);
  for(let i=0;i<L.length;i++){ const a=L[i];
    for(let j=i+1;j<L.length;j++){ const b=L[j], dx=b.position.x-a.position.x, dz=b.position.z-a.position.z, d=Math.hypot(dx,dz);
      if(d>=APART) continue;
      const nx=d>1e-4?dx/d:Math.cos(i+j), nz=d>1e-4?dz/d:Math.sin(i+j), push=(APART-d)*k;
      const am=!!a.userData.target, bm=!!b.userData.target, wa=am===bm?0.5:am?1:0, wb=1-wa;
      a.position.x-=nx*push*wa; a.position.z-=nz*push*wa; b.position.x+=nx*push*wb; b.position.z+=nz*push*wb; } }
  if(player&&player.visible) for(const a of L){ const dx=a.position.x-player.position.x, dz=a.position.z-player.position.z, d=Math.hypot(dx,dz);
    if(d<APART&&d>1e-4){ const push=(APART-d)*k; a.position.x+=dx/d*push; a.position.z+=dz/d*push; } }
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
  for(const s of ctx.flock){ const u=s.userData; u.t-=dt;
    if(u.plunge){ plunge(s,u,dt); continue; }
    const R=(u.roam||2)*2, sp=u.sp||0.5;
    if(u.t<0){ u.t=2+Math.random()*4; u.to=[u.home[0]+(Math.random()-0.5)*R,u.home[1]+(Math.random()-0.5)*R]; }
    if(u.to){ const dx=u.to[0]-s.position.x, dz=u.to[1]-s.position.z, d=Math.hypot(dx,dz);
      if(d>0.1){ s.position.x+=dx/d*dt*sp; s.position.z+=dz/d*dt*sp; s.rotation.y=Math.atan2(dx,dz); }
      if(s.children[0]&&K().tickGait){ u.ent=u.ent||{m:s.children[0]}; K().tickGait(u.ent,u.kind||'sheep',d>0.1?sp*S:0,dt); } }
    s.position.y=ctx.groundY(s.position.x,s.position.z); }
  for(const id in ctx.things){ const o=ctx.things[id], u=o.userData;
    if(u.goTo){ const dx=u.goTo[0]-o.position.x, dz=u.goTo[1]-o.position.z, d=Math.hypot(dx,dz);
      if(d>0.2){ const sp=u.wheel?1.5:2.4; o.position.x+=dx/d*dt*sp; o.position.z+=dz/d*dt*sp;
        if(u.wheel) u.wheel.rotation.x+=dt*sp/u.r;              /* a round stone rolls in its channel */
        else o.rotation.y=Math.atan2(dx,dz); } else u.goTo=null; }
    if(u.following&&player){ const dx=player.position.x-o.position.x, dz=player.position.z-o.position.z, d=Math.hypot(dx,dz);
      if(d>1.6){ o.position.x+=dx/d*dt*Math.min(5,d*1.6); o.position.z+=dz/d*dt*Math.min(5,d*1.6); o.rotation.y=Math.atan2(dx,dz); } } }
}
function updateCamera(dt){
  if(camTarget){                                  /* the story holds the camera */
    camT=Math.min(1,camT+dt/(camTarget.dur||2));
    const e=camT<0.5?2*camT*camT:1-Math.pow(-2*camT+2,2)/2;
    const fp=camTarget.from0, tp=camTarget.to;
    camera.position.set(fp[0]+(tp[0]-fp[0])*e,fp[1]+(tp[1]-fp[1])*e,fp[2]+(tp[2]-fp[2])*e);
    const la=camTarget.look0, lb=camTarget.look;
    camera.lookAt(la[0]+(lb[0]-la[0])*e,la[1]+(lb[1]-la[1])*e,la[2]+(lb[2]-la[2])*e);
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
    const x=(H.dx-anchor.x)/S, z=(H.dz-anchor.z)/S;
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
  for(const h of [2.0,2.6,3.2,3.8]) if(k.solidAt(anchor.x+x*S,anchor.y+(y+h)*S,anchor.z+z*S)) return true;
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
  const k=K(); if(k.solidAt(anchor.x+from[0]*S,anchor.y+from[1]*S,anchor.z+from[2]*S)) return null;
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
  const t=B.toward&&ctx.actors[B.toward]?ctx.actors[B.toward].position:m?new THREE.Vector3(m[0],(m[2]!==undefined?m[2]:1.5)-1.3,m[1]):p.clone().addScaledVector(f,6);
  const side=B.side||1;
  const bk=B.back||3.6, up=B.lift||0;                                  /* `back`, `lift`: farther behind Him, higher over Him */
  return {from:[p.x-f.x*bk+sd.x*1.5*side,p.y+2.3+sit+up,p.z-f.z*bk+sd.z*1.5*side], look:[t.x,t.y+1.3,t.z]};
}
function holdCamera(from,look,dur){
  camTarget={from0:[camera.position.x,camera.position.y,camera.position.z],
    look0:camTarget?camTarget.look:lookNow(),to:clearShot(from,look),look,dur:dur||2}; camT=0;
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
  const k=K(), W=v=>new THREE.Vector3(anchor.x+v[0]*S,anchor.y+v[1]*S,anchor.z+v[2]*S);
  const a=W(to), b=W(from), dir=b.clone().sub(a), L=dir.length(); if(L<0.4*S) return true;
  dir.divideScalar(L);
  const n=Math.ceil(L/(0.25*S));
  for(let i=Math.ceil(0.5*S/(0.25*S));i<=n;i++){ const t=i/n; if(k.solidAt(a.x+dir.x*L*t,a.y+dir.y*L*t,a.z+dir.z*L*t)) return false; }
  const targets=[k.chunkRoot]; root.traverse(o=>{ if(o.name==='story-details') targets.push(o); });
  _ray.set(a.clone().addScaledVector(dir,0.5*S),dir); _ray.far=L-0.5*S;
  return !_ray.intersectObjects(targets,true).some(h=>h.object.visible!==false&&!(h.object.material&&h.object.material.transparent&&h.object.material.opacity<0.5));
}
/* the follow camera, each frame: brought in along its line until no block stands between */
function pullIn(from,look){
  /* walked out from the head toward where the eye would be, in short steps, stopping a hand's
     breadth short of the first block met — or of one beside the line (a door-jamb) that the
     lens, being a little wide, would cut into */
  const k=K(); let t=1; const L=Math.hypot(from[0]-look[0],from[1]-look[1],from[2]-look[2]), n=Math.max(8,Math.ceil(L/0.18));
  const hit=(x,y,z)=>{ const wx=anchor.x+x*S, wy=anchor.y+y*S, wz=anchor.z+z*S, m=0.22*S;
    return k.solidAt(wx,wy,wz)||k.solidAt(wx+m,wy,wz)||k.solidAt(wx-m,wy,wz)||k.solidAt(wx,wy,wz+m)||k.solidAt(wx,wy,wz-m)||k.solidAt(wx,wy+m,wz); };
  for(let i=1;i<=n;i++){ const f=i/n, x=look[0]+(from[0]-look[0])*f, y=look[1]+(from[1]-look[1])*f, z=look[2]+(from[2]-look[2])*f;
    if(hit(x,y,z)){ t=Math.max(0.1,(i-1)/n); break; } }
  return [look[0]+(from[0]-look[0])*t,look[1]+(from[1]-look[1])*t,look[2]+(from[2]-look[2])*t];
}
function camFree(p){ const k=K(), B=k.B, x=anchor.x+p[0]*S, y=anchor.y+p[1]*S, z=anchor.z+p[2]*S;
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
   a mal'ak is light, and the light swells with the words. */
const SV=window.STORYVOICE;
function talkingAs(id){ const T=SV.talk, sp=T&&T.sp; if(!sp) return null;
  return (sp.actor===id||(sp.actors&&sp.actors.indexOf(id)>=0))?T:null; }
function animFace(g,id,dt){
  const u=g.userData, F=u.face, T=talkingAs(id), m=T?(SV.mouth(T.sp.key)||0):0;
  if(u.aura){ const k=1+m*0.22+(T?0.06:0); u.aura.sprite.scale.setScalar(u.aura.base*k); }
  if(u.setFace){                             /* the voyage's figure: its face drawn in each state */
    u.blink=(u.blink||3)-dt; const shut=u.blink<0; if(u.blink<-0.13) u.blink=2.5+Math.random()*4;
    u.talkM=T?m:undefined;
    /* the feeling: the speaker's from the words; a `mood` the scene has set; or, for those
       standing by one who speaks, the words' feeling as it falls on the hearer — gladness on
       the glad, grief on the grieved, fear and wonder spreading; a rebuke does not make them glad */
    let ex=T?SV.expr(T.text):'calm';
    if(u.mood) ex=u.mood;
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
  if(T==='goal'){ setGoal(B.text); const m=pos(B.goto); ringAt(m); onFrame=()=>{
      if(Math.hypot(player.position.x-m[0],player.position.z-m[1])<(B.r||2.4)){ ringOff(); setGoal(''); nextBeat(); } }; return; }
  if(T==='witness'){ startWitness(B); return; }
  if(T==='choice'){ showChoice(B); return; }
  if(T==='collect'){ collect(B.id); return; }
  if(T==='fulfil'){ fulfil(B.id); return; }
  if(T==='move'){ const who=[].concat(B.who), tos=Array.isArray(B.who)||Array.isArray(B.to&&B.to[0])?[].concat(B.to):[B.to];   /* one figure, one place — even a place given as [x,z] */ who.forEach((w,k)=>{ const g=ctx.actors[w]; if(!g) return;
      const to=pos(tos[Math.min(k,tos.length-1)]);
      g.userData.follow=null; g.userData.target=to; if(B.speed) g.userData.speed=B.speed;
      if(ST.fast){ g.position.x=to[0]; g.position.z=to[1];
        /* set straight down where he was going: on the floor he would have walked to (a hall
           under a roof), not on the roof over it */
        const top=ctx.groundY(to[0],to[1]), cur=g.position.y, near=ctx.groundY(to[0],to[1],cur+1.6);
        g.userData.gy=near!=null&&isFinite(near)&&top-near>2&&Math.abs(near-cur)<3?near:undefined; } });
    if(B.wait===false) return nextBeat();
    onFrame=()=>{ if(who.every(w=>!ctx.actors[w]||!ctx.actors[w].userData.target)) nextBeat(); }; return; }
  if(T==='follow'){ for(const w of [].concat(B.who)){ const g=ctx.actors[w]; if(g){ g.userData.target=null; g.userData.follow=B.target||'player'; } } return nextBeat(); }
  if(T==='stop'){ for(const w of [].concat(B.who)){ const g=ctx.actors[w]; if(g){ g.userData.follow=null; g.userData.target=null; } } return nextBeat(); }
  if(T==='face'){ const g=ctx.actors[B.who]; const p=B.to==='player'?[player.position.x,player.position.z]:(ctx.actors[B.to]||ctx.things[B.to])?thingPos(B.to):pos(B.to);
    if(g) g.rotation.y=Math.atan2(p[0]-g.position.x,p[1]-g.position.z); return nextBeat(); }
  if(T==='place'){ const g=B.who==='player'?player:ctx.actors[B.who]; const p=pos(B.at);
    if(g){ const onIt=B.y!==undefined&&B.y!==null;
      g.position.set(p[0],onIt?yOf(B.y):ctx.groundY(p[0],p[1]),p[1]); g.userData.gy=g.position.y; if(B.face!==undefined) g.rotation.y=B.face;
      /* `y`: standing on something that is not the ground — the floor of a boat, a roof;
         `y:null` sets him back down on the ground */
      if(onIt&&g!==player) g.userData.fixedY=yOf(B.y); else if(B.y===null) delete g.userData.fixedY; }
    return nextBeat(); }
  if(T==='cam'){ controlsOn=!!B.free;
    if(B.release){ releaseCamera(); controlsOn=true; return nextBeat(); }
    const S=B.on?shotOf(B):null;
    const at=S?S.look:Array.isArray(B.look)&&B.look.length===3&&typeof B.look[0]==='number'?B.look:lookAtSpec(B.look);
    let from;
    if(S) from=S.from;
    else if(B.from&&B.from.rel){ const g=ctx.actors[B.from.rel]||ctx.things[B.from.rel], o=B.from.off; from=[g.position.x+o[0],g.position.y+o[1],g.position.z+o[2]]; }
    else if(Array.isArray(B.from)&&B.from.length===3&&typeof B.from[0]==='number') from=B.from;
    /* a marker (or a marker and a step from it), at `fy` metres, or `fdy` above the ground there */
    else { const m=pos(B.from); from=[m[0],B.fdy!==undefined?(ctx.groundY(m[0],m[1])||0)+B.fdy:(B.fy||4),m[1]]; }
    holdCamera(S?from:faceSafe(from,at),at,ST.fast?0.01:(B.dur||2.5));
    if(B.wait===false) return nextBeat();
    onFrame=()=>{ if(camT>=1) nextBeat(); }; return; }
  if(T==='show'||T==='hide'){ for(const id of [].concat(B.id)){ const o=ctx.glows[id]||ctx.things[id]||ctx.actors[id]; if(o) o.visible=(T==='show'); }
    if(B.host!==undefined&&ctx.host) for(const G of ctx.host) G.visible=!!B.host;
    if(B.star!==undefined&&ctx.star) ctx.star.visible=!!B.star;
    if(B.kingdoms!==undefined&&ctx.kingdoms) for(const G of ctx.kingdoms) G.visible=!!B.kingdoms;
    return nextBeat(); }
  if(T==='time'){ applyTime(B.to); setBed(ctx.place,B.to); return nextBeat(); }
  /* the wind and the waves: "the ruach was against it" … "the ruach ceased" */
  if(T==='weather'){ if(B.wind) ctx.wind=B.wind; if(B.rough!==undefined) ctx.rough=B.rough;
    if(B.storm!==undefined&&K().setStorm) K().setStorm(B.storm||null);      /* the rain, the thunder and the dark of a squall */
    return nextBeat(); }
  /* "Make the people sit down" (Yahuchanon 6:10): on the grass, legs out before them */
  if(T==='sit'||T==='stand'){ for(const w of [].concat(B.who)){ const g=ctx.actors[w]; if(g){ g.userData.sit=(T==='sit'); g.userData.lie=false; g.rotation.x=0; } } return nextBeat(); }
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
  if(T==='pose'){ for(const w of [].concat(B.who)){ const g=ctx.actors[w]; if(g) g.userData.armsOut=B.arms==='out'?true:B.arms==='up'?'up':false; } return nextBeat(); }
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
    /* `hold`: a figure carried up (Acts 1:9) is held where the drift leaves him, not set back on the ground */
    if(B.hold) for(const id of [].concat(B.id)){ const g=ctx.actors[id]; if(g&&g.userData.fixedY===undefined) g.userData.fixedY=g.position.y; }
    const D={objs,from:objs.map(q=>q.position.clone()),to:by?null:new THREE.Vector3(...B.to),by,t:0,dur:ST.fast?0.001:(B.dur||3)};
    ctx.drifts.push(D);
    if(B.wait===false) return nextBeat();
    onFrame=()=>{ if(D.t>=1) nextBeat(); }; return; }
  if(T==='quake'){ ctx.quake=ST.fast?0:(B.s||2.5); return nextBeat(); }
  if(T==='wait'){ onFrame=()=>{ if(ST.fast||beatT>=B.s) nextBeat(); }; return; }
  if(T==='player'){ ctx.playerHidden=!!B.hidden; player.visible=!B.hidden; if(B.hidden) controlsOn=false;
    /* set the player down somewhere — in a boat, say — and hold him there (lock), or let him go */
    const onIt=B.y!==undefined&&B.y!==null;
    if(B.at){ const p=pos(B.at); player.position.set(p[0],onIt?B.y:ctx.groundY(p[0],p[1]),p[1]); }
    if(B.face!==undefined){ player.rotation.y=B.face; camYaw=B.face+Math.PI; }
    if(onIt) ctx.playerY=B.y; else if(B.y===null||B.lock===false) ctx.playerY=undefined;
    if(B.lock!==undefined) ctx.playerLock=!!B.lock;
    return nextBeat(); }
  /* the jars filled, the baskets heaped, the net full of fish; `color` turns water to wine */
  if(T==='fill'){ for(const id of [].concat(B.id)){ const o=ctx.things[id]; if(!o) continue; const f=o.userData.fill||o.userData.fish;
      if(f){ f.visible=B.show!==false; if(B.color!==undefined&&f.material) f.material.color.setHex(B.color); } } return nextBeat(); }
  if(T==='era'){ showEra(B); return; }
  if(T==='end') return endScene();
  console.warn('unknown beat',B); nextBeat();
}
function lookAtSpec(l){ if(typeof l==='string'){ if(ctx.actors[l]){ const g=ctx.actors[l]; return [g.position.x,g.position.y+(g.userData.fours?0.75:1.5),g.position.z]; }
    if(ctx.glows[l]){ const s=ctx.glows[l].sprite.position; return [s.x,s.y,s.z]; }
    const m=pos(l); return [m[0],m[2]!==undefined?m[2]:1.5,m[1]]; }
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
function startWitness(B){
  witness={B,done:new Set(),holding:0,carrying:null};
  setGoal(B.text+'  (0/'+B.items.length+')');
  onFrame=dt=>{
    const W=witness; if(!W) return;
    if(W.carrying){                                    /* taking it to where it goes */
      const m=pos(B.deliver); if(Math.hypot(player.position.x-m[0],player.position.z-m[1])<(B.r||3)){
        const o=ctx.things[W.carrying]; o.userData.following=false; o.userData.goTo=[m[0]+(Math.random()-0.5)*2,m[1]+(Math.random()-0.5)*2];
        player.userData.carrying=false; witnessDone(W.carrying); W.carrying=null; }
      return; }
    let near=null, nd=1e9;
    for(const id of B.items){ if(W.done.has(id)) continue; const p=thingPos(id); if(!p) continue;
      const d=Math.hypot(player.position.x-p[0],player.position.z-p[1]); if(d<nd){ nd=d; near=id; } }
    if(near&&nd<(B.reach||2.2)){ showPrompt((B.verb||'Take it')+(B.hold?'  — hold':'' ));
      if(actHeld||actPressed){ W.holding+=dt; actPressed=false;
        setProgress(B.hold?W.holding/B.hold:1);
        if(!B.hold||W.holding>=B.hold){ W.holding=0; setProgress(0);
          if(B.deliver){ W.carrying=near; ctx.things[near].userData.following=true; player.userData.carrying=true; setGoal(B.carryText||('Bring it to its place')); hide('sprompt'); }
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
  if(W.done.size>=B.items.length){ hide('sprompt'); setGoal(''); witness=null; nextBeat(); }
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
  courts:{crowd:0.7,temple:0.6,wind:0.2},  upperroom:{crowd:0.15,wind:0.15},  highpriest:{crowd:0.3,wind:0.3},  praetorium:{crowd:0.9,wind:0.3},  golgotha:{wind:0.8,crowd:0.3}
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
  const dt=Math.min(0.05,clock.getDelta()), t=clock.elapsedTime;
  if(!running||!ctx){ idleView(t); return; }
  keepWorld();
  beatT+=dt;
  movePlayer(dt); moveActors(dt); moveFlock(dt,t);
  if(ctx.tickers) for(const f of ctx.tickers) f(dt);                                   /* a set's own motion: the wheat in the wind */
  for(const f of ctx.flicker){ const k=0.85+Math.sin(t*13)*0.08+Math.sin(t*7.3)*0.07; f.sprite.scale.setScalar(f.base*k); if(f.light) f.light.intensity=1.4*k; }
  for(const id in ctx.glows){ const G=ctx.glows[id];
    if(G.on){ const g=G.on, u=g.userData, hy=g.position.y+(u.headY||1.6)+0.24*(u.s||1)+G.onDy;   /* on the top of the head, sitting or standing (the figure is already set down for sitting) */
      G.sprite.position.set(g.position.x,hy,g.position.z); if(G.light) G.light.position.set(g.position.x,hy,g.position.z); }
    if(G.pulse){ const k=1+Math.sin(t*2)*0.08; G.sprite.scale.set(G.base*k,G.base*k*(G.aspect||1),1); } }
  if(ctx.host) for(const G of ctx.host){ if(!G.visible) continue; G.sprite.position.y+=Math.sin(t*1.3+G.ph)*0.01; }
  if(ring){ ring.material.opacity=0.55+Math.sin(t*4)*0.25; }
  for(const w of ctx.water) w.material.opacity=0.82+Math.sin(t*1.7)*0.05;
  for(const D of ctx.drifts){ if(D.t>=1) continue; D.t=Math.min(1,D.t+dt/D.dur); const e=D.t<0.5?2*D.t*D.t:1-Math.pow(-2*D.t+2,2)/2;
    D.objs.forEach((o,k)=>{ if(D.by) o.position.copy(D.from[k]).addScaledVector(D.by,e); else o.position.lerpVectors(D.from[k],D.to,e);
      if(o===player&&ctx.playerY!==undefined) ctx.playerY=o.position.y;
      if(o.userData&&o.userData.fixedY!==undefined) o.userData.fixedY=o.position.y;
      if(o.userData&&o.userData.baseY!==undefined) o.userData.baseY=o.position.y; }); }
  for(const id in ctx.things){ const o=ctx.things[id], u=o.userData; const w=u.wings||(u.bird&&u.bird.userData&&u.bird.userData.wings); if(w&&w[0]){ const a=Math.sin(t*9)*0.5; w[0].rotation.z=a; w[1].rotation.z=-a; }
    if(u.tick&&o.visible) u.tick(dt);
    if(u.bob&&!ctx.lake){ const k=ctx.rough||1; o.position.y=u.baseY+Math.sin(t*1.3+o.position.x)*0.06*k; o.rotation.z=Math.sin(t*0.9+o.position.z)*0.025*k; } }
  if(ctx.lake&&ctx.lake.w) lakeTick(dt);
  lifeTick(dt); wadeTick(dt); folkTick(dt); doorsTick(dt);
  if(portrait&&!$('sverse').classList.contains('off')) drawPortrait();
  { const T=SV.talk, g=T&&T.sp&&T.sp.glow&&ctx.glows[T.sp.glow];          /* a mal'ak's light swells with the words */
    if(g){ const m=SV.mouth(T.sp.key)||0, k=1+m*0.12; g.sprite.scale.set(g.base*k,g.base*k*(g.aspect||1),1); } }
  if(ST.fast) fastStep();
  if(onFrame) onFrame(dt);
  actPressed=false;
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
  const roofed=k.solidAt(anchor.x+lx*S,anchor.y+(ly+2.6)*S,anchor.z+lz*S)||k.solidAt(anchor.x+lx*S,anchor.y+(ly+3.6)*S,anchor.z+lz*S);
  const want=timeNow==='night'?0.85:timeNow==='dusk'?0.5:timeNow==='dawn'?0.35:roofed?0.45:0;
  if(!lampLight){ lampLight=new THREE.PointLight(0xffd9a0,0,14*S,1.4); }
  if(lampLight.parent!==root) root.add(lampLight);
  lampLight.position.set(lx,ly+1.6,lz); lampLight.intensity=want*1.3;
  if(want>0) k.lamp(anchor.x+lx*S,anchor.y+(ly+1.2)*S,anchor.z+lz*S,want,12*S);
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
  standWalker(anchor.x+p.x*S,anchor.z+p.z*S,anchor.y+p.y*S);
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

/* ---- THE TEST HARNESS'S HAND: one beat a frame, taken as a player would ---- */
function fastStep(){
  const B=beat; if(!B) return;
  if(fulfilOpen){ closeFulfil(); return; }
  if(!$('choice').classList.contains('off')){ hide('choice'); nextBeat(); return; }
  if(waitingAdvance){ advance(); return; }
  if(B.t==='witness'&&witness){ const W=witness;
    if(W.carrying){ player.userData.carrying=false; ctx.things[W.carrying].userData.following=false; const id=W.carrying; W.carrying=null; witnessDone(id); return; }
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
    advance, get running(){ return running; }, ctx:()=>ctx, faceExposed, dbg:{clearShot,lineClear,camFree,exposedFrom,HOURS,applyTime,free:()=>{ releaseCamera(); controlsOn=true; onFrame=null; }}, player:()=>player, camera:()=>camera,
    reset:()=>{ save.codex={}; save.acts={}; save.witnessed=0; save.road={}; save.bonds={}; persist(); } };
};
})();
