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
function groundAt(x,z,ref){
  const k=K(); let r;
  if(ref!==undefined) r=anchor.y+ref*S;
  else r=ctx&&ctx.api&&ctx.api.inPadL(x,z)?anchor.y+2.2*S:undefined;
  const g=k.groundInfo(anchor.x+x*S,anchor.z+z*S,r);
  return ((g&&g.y!=null?g.y:anchor.y)-anchor.y)/S;
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
const HOURS={day:10.5,dusk:18.75,night:23.2,dawn:5.7};
let timeNow=null, hourNow=10.5;
function applyTime(name){
  timeNow=name; hourNow=HOURS[name]===undefined?10.5:HOURS[name];
  if(anchor) K().setLocalHour(hourNow,anchor.x,anchor.z);
}

/* ================= A SCENE ================= */
/* the set of the last scene taken up again: its blocks out of the world, its people gone */
function dropScene(){
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
  root=new THREE.Group(); root.name='story-scene'; root.position.set(A.x,A.y,A.z); root.scale.setScalar(S); k.scene.add(root);
  scene=root;
  ctx={scene:root,colliders:[],markers:{},actors:{},things:{},glows:{},water:[],flicker:[],flock:[],bounds:null,wind:[0.5,0.2],place:sc.place};
  ctx.groundY=(x,z,ref)=>groundAt(x,z,ref);
  /* the traveller is stood there, unseen, so the world is built about the scene */
  standWalker(A.x,A.z,A.y);
  /* the city of the great king is the voyage's own, raised as she stood in the act's days;
     a scene there lays only its own things about her */
  if(A.city){ ctx.markers=Object.assign({},k.yahruAs(A.period)); }
  ctx.api=k.setBuilder(A.x,A.z,A.y);
  const st=new window.STORYWORLD.Static(ctx.api);
  const build=window.STORYSETTINGS[sc.place];
  if(!build) throw new Error('no such place: '+sc.place);
  build(ctx,st);
  ctx.api.end();
  root.add(st.mesh());
  k.updateChunks(A.x,A.z,9999);
  if(k.flushEdits) k.flushEdits();
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
    else if(t.kind==='boat'){ obj=window.STORYWORLD.boat(ctx,p[0],p[1],{y:t.y,face:t.face,mast:t.mast}); obj.userData.bob=t.bob!==false; }
    else if(t.kind==='net'){ obj=window.STORYWORLD.net(ctx,p[0],p[1],t); }
    else if(t.kind==='jar'){ obj=window.STORYWORLD.stoneJar(ctx,p[0],p[1]); }
    else if(t.kind==='basket'){ obj=window.STORYWORLD.basket(ctx,p[0],p[1],t.full); }
    else if(t.kind==='infant'){ obj=window.STORYWORLD.infant(ctx,p[0],p[1],t); }
    else { obj=new THREE.Mesh(new THREE.BoxGeometry(t.w||0.5,t.h||0.5,t.d||0.5),new THREE.MeshLambertMaterial({color:t.color||0xc9b38a}));
      obj.position.set(p[0],(t.y||0)+(t.h||0.5)/2,p[1]); scene.add(obj); }
    if(t.face!==undefined) obj.rotation.y=t.face;
    if(t.hidden) obj.visible=false;
    if(t.y!==undefined&&t.kind!=='box'&&t.kind!=='dove') obj.position.y=t.y;
    obj.userData.thing=t; obj.userData.baseY=obj.position.y; ctx.things[t.id]=obj; }
  /* lights: a mal'ak is LIGHT, never a figure; so is the Child (reverent framing) */
  for(const gl of sc.glows||[]){
    const p=gl.at.length===3?gl.at:[...pos(gl.at).slice(0,1),gl.y||2,pos(gl.at)[1]];
    const G=window.STORYWORLD.glow(ctx,p[0],p[1],p[2],gl.size||3,gl.color,gl.intensity===undefined?1.2:gl.intensity);
    if(gl.h){ G.sprite.scale.set(gl.size||3,gl.h,1); }
    G.visible=!gl.hidden; G.pulse=gl.pulse; ctx.glows[gl.id]=G; }
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
function pos(at){ if(typeof at==='string'){ const m=ctx.markers[at]; if(!m) throw new Error('no marker '+at); return m; }
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
function animFigure(g,dt,moving){
  const u=g.userData; u.phase=(u.phase||0)+dt*(moving?7:1.2);
  const sw=moving?Math.sin(u.phase)*0.55:Math.sin(u.phase)*0.03;
  if(u.legL){ u.legL.rotation.x=sw; u.legR.rotation.x=-sw; u.armL.rotation.x=-sw*0.8; u.armR.rotation.x=u.carrying?-0.9:sw*0.8; }
  if(u.sit&&u.legL){ u.legL.rotation.x=u.legR.rotation.x=-1.45; u.armL.rotation.x=u.armR.rotation.x=-0.5; }
  /* THE SPEAKER'S HANDS: one who is speaking and standing still lifts a hand with the words */
  if(u.talkM!==undefined&&!moving&&!u.sit&&!u.carrying&&u.armR){ const k=u.talkM;
    u.armR.rotation.x+=(-0.55-k*0.35+Math.sin(u.phase*0.9)*0.08-u.armR.rotation.x)*Math.min(1,dt*5);
    u.armL.rotation.x+=(-0.18-k*0.15-u.armL.rotation.x)*Math.min(1,dt*4); }
  /* knees and elbows fold as the voyage's folk fold theirs */
  const jt=K().jointTick; if(jt&&u.legL&&!u.sit) for(const L of [u.legL,u.legR,u.armL,u.armR]) jt(L,moving);
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
    if(q.axis==='x') q.pv.rotation.x=-q.sign*q.a; else q.pv.rotation.z=q.sign*q.a;
  }
}
/* the actors walk where the story sends them */
function moveActors(dt){
  for(const id in ctx.actors){ const g=ctx.actors[id], u=g.userData;
    let tgt=u.target;
    if(u.follow){ const f=u.follow==='player'?player:ctx.actors[u.follow];
      if(f){ const d=Math.hypot(f.position.x-g.position.x,f.position.z-g.position.z); tgt=d>2.4?[f.position.x,f.position.z]:null; } }
    let moving=false;
    if(tgt){ const dx=tgt[0]-g.position.x, dz=tgt[1]-g.position.z, d=Math.hypot(dx,dz);
      if(d>0.15){ const sp=Math.min(d,(u.speed||2.6)*dt); g.position.x+=dx/d*sp; g.position.z+=dz/d*sp;
        g.rotation.y=turnTo(g.rotation.y,Math.atan2(dx,dz),dt*8); moving=true; }
      else if(!u.follow) u.target=null; }
    if(u.fixedY!==undefined) g.position.y=u.fixedY-(u.sit?0.62*(u.s||1):0);
    else { const gy=ctx.groundY(g.position.x,g.position.z,(u.gy===undefined?g.position.y:u.gy)+1.5); u.gy=gy; g.position.y=gy-(u.sit?0.62*(u.s||1):0); }
    animFigure(g,dt,moving); animFace(g,id,dt);
    if(u.label){ const near=!camTarget&&player&&Math.hypot(player.position.x-g.position.x,player.position.z-g.position.z)<3.6;
      u.label.visible=near||speaking===id; } }
}
/* the flock grazes, and a lamb that has been gathered goes to the fold */
function moveFlock(dt,t){
  for(const s of ctx.flock){ const u=s.userData; u.t-=dt;
    const R=(u.roam||2)*2, sp=u.sp||0.5;
    if(u.t<0){ u.t=2+Math.random()*4; u.to=[u.home[0]+(Math.random()-0.5)*R,u.home[1]+(Math.random()-0.5)*R]; }
    if(u.to){ const dx=u.to[0]-s.position.x, dz=u.to[1]-s.position.z, d=Math.hypot(dx,dz);
      if(d>0.1){ s.position.x+=dx/d*dt*sp; s.position.z+=dz/d*dt*sp; s.rotation.y=Math.atan2(dx,dz); }
      if(s.children[0]&&K().tickGait){ u.ent=u.ent||{m:s.children[0]}; K().tickGait(u.ent,u.kind||'sheep',d>0.1?sp*S:0,dt); } }
    s.position.y=ctx.groundY(s.position.x,s.position.z); }
  for(const id in ctx.things){ const o=ctx.things[id], u=o.userData;
    if(u.goTo){ const dx=u.goTo[0]-o.position.x, dz=u.goTo[1]-o.position.z, d=Math.hypot(dx,dz);
      if(d>0.2){ o.position.x+=dx/d*dt*2.4; o.position.z+=dz/d*dt*2.4; o.rotation.y=Math.atan2(dx,dz); } else u.goTo=null; }
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
    return; }
  if(player&&!ctx.playerHidden) player.visible=true;
  if(!player) return;
  /* SHOT AND REVERSE SHOT: while one near the witness speaks and the scene has not set a
     camera, the eye goes over the witness's shoulder onto the one speaking — and, when it is
     He who speaks, over His shoulder onto the witness, so His face is never before it */
  const cs=convoShot();
  if(cs){ const k=Math.min(1,dt*3); camera.position.x+=(cs.from[0]-camera.position.x)*k; camera.position.y+=(cs.from[1]-camera.position.y)*k; camera.position.z+=(cs.from[2]-camera.position.z)*k;
    camera.lookAt(...cs.look); return; }
  if(keys.KeyQ) camYaw+=dt*1.8; if(keys.KeyR) camYaw-=dt*1.8;
  const tx=player.position.x, ty=player.position.y+1.6, tz=player.position.z;
  const want=[tx+Math.sin(camYaw)*Math.cos(camPitch)*camDist, ty+Math.sin(camPitch)*camDist, tz+Math.cos(camYaw)*Math.cos(camPitch)*camDist];
  want[1]=Math.max(want[1],ctx.groundY(want[0],want[2])+0.6);
  const k=Math.min(1,dt*6);
  camera.position.x+=(want[0]-camera.position.x)*k; camera.position.y+=(want[1]-camera.position.y)*k; camera.position.z+=(want[2]-camera.position.z)*k;
  camera.lookAt(tx,ty,tz);
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
    out.push({p:new THREE.Vector3(g.position.x,y,g.position.z), f:new THREE.Vector3(Math.sin(g.rotation.y),0,Math.cos(g.rotation.y)), r:0.26*sc}); }
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
  const t=B.toward&&ctx.actors[B.toward]?ctx.actors[B.toward].position:p.clone().addScaledVector(f,6);
  const side=B.side||1;
  return {from:[p.x-f.x*3.6+sd.x*1.5*side,p.y+2.3+sit,p.z-f.z*3.6+sd.z*1.5*side], look:[t.x,t.y+1.3,t.z]};
}
function holdCamera(from,look,dur){
  camTarget={from0:[camera.position.x,camera.position.y,camera.position.z],
    look0:camTarget?camTarget.look:lookNow(),to:from,look,dur:dur||2}; camT=0;
}
function lookNow(){ const d=new THREE.Vector3(); camera.getWorldDirection(d);
  return [camera.position.x+d.x*10,camera.position.y+d.y*10,camera.position.z+d.z*10]; }
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
    u.setFace(m<0.12?0:m<0.55?1:2,shut,T?SV.expr(T.text):'calm');
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
  const light=sp.kind==='angel'||sp.kind==='divine'||sp.kind==='yahusha'||sp.light;
  const T=SV.talk, talking=T&&T.sp&&T.sp.key===sp.key, m=talking?(SV.mouth(sp.key)||0):0;
  if(sp.kind==='narrator'){ R(0,0,38,38,'#201a13');
    R(9,11,20,16,'#e2d3ad'); R(7,9,3,20,'#b89c6a'); R(28,9,3,20,'#b89c6a');
    for(let k=0;k<4;k++) R(12,14+k*3,14-(k%2)*4,1,'#7a6448'); return; }
  if(sp.kind==='yahusha'){ /* His face is never shown: the back of His head, His shoulders */
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
  const L=sp.look||{}, skin=hex(L.skin||0x8a5a3a), cloth=hex(L.cloth||0xd9cfb6), robe=hex(L.robe||0x9a8466);
  R(0,0,38,38,sp.kind==='dark'?'#2a1e30':'#2a2219');
  if(sp.kind==='dark'&&L.fallen){ const gr=g.createRadialGradient(19,20,4,19,20,22); gr.addColorStop(0,'rgba(120,80,140,0.55)'); gr.addColorStop(1,'rgba(20,12,24,0)'); g.fillStyle=gr; g.fillRect(0,0,38,38); }
  R(6,29,26,9,robe);                                   /* shoulders */
  R(11,9,16,18,skin);                                  /* the face */
  R(9,5,20,6,cloth); R(9,9,3,18,cloth); R(26,9,3,18,cloth);   /* the head-cloth */
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
  if(T==='move'){ const who=[].concat(B.who), tos=Array.isArray(B.who)?[].concat(B.to):[B.to];   /* one figure, one place — even a place given as [x,z] */ who.forEach((w,k)=>{ const g=ctx.actors[w]; if(!g) return;
      const to=pos(tos[Math.min(k,tos.length-1)]);
      g.userData.follow=null; g.userData.target=to; if(B.speed) g.userData.speed=B.speed;
      if(ST.fast){ g.position.x=to[0]; g.position.z=to[1]; } });
    if(B.wait===false) return nextBeat();
    onFrame=()=>{ if(who.every(w=>!ctx.actors[w]||!ctx.actors[w].userData.target)) nextBeat(); }; return; }
  if(T==='follow'){ for(const w of [].concat(B.who)){ const g=ctx.actors[w]; if(g){ g.userData.target=null; g.userData.follow=B.target||'player'; } } return nextBeat(); }
  if(T==='stop'){ for(const w of [].concat(B.who)){ const g=ctx.actors[w]; if(g){ g.userData.follow=null; g.userData.target=null; } } return nextBeat(); }
  if(T==='face'){ const g=ctx.actors[B.who]; const p=B.to==='player'?[player.position.x,player.position.z]:ctx.actors[B.to]?thingPos(B.to):pos(B.to);
    if(g) g.rotation.y=Math.atan2(p[0]-g.position.x,p[1]-g.position.z); return nextBeat(); }
  if(T==='place'){ const g=B.who==='player'?player:ctx.actors[B.who]; const p=pos(B.at);
    if(g){ g.position.set(p[0],B.y!==undefined?B.y:ctx.groundY(p[0],p[1]),p[1]); g.userData.gy=g.position.y; if(B.face!==undefined) g.rotation.y=B.face;
      /* `y`: standing on something that is not the ground — the floor of a boat */
      if(B.y!==undefined&&g!==player) g.userData.fixedY=B.y; else if(B.y===null) delete g.userData.fixedY; }
    return nextBeat(); }
  if(T==='cam'){ controlsOn=!!B.free;
    if(B.release){ releaseCamera(); controlsOn=true; return nextBeat(); }
    const S=B.on?shotOf(B):null;
    const at=S?S.look:Array.isArray(B.look)&&B.look.length===3?B.look:lookAtSpec(B.look);
    let from;
    if(S) from=S.from;
    else if(B.from&&B.from.rel){ const g=ctx.actors[B.from.rel]||ctx.things[B.from.rel], o=B.from.off; from=[g.position.x+o[0],g.position.y+o[1],g.position.z+o[2]]; }
    else from=B.from.length===3?B.from:[pos(B.from)[0],B.fy||4,pos(B.from)[1]];
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
  if(T==='weather'){ if(B.wind) ctx.wind=B.wind; if(B.rough!==undefined) ctx.rough=B.rough; return nextBeat(); }
  /* "Make the people sit down" (Yahuchanon 6:10): on the grass, legs out before them */
  if(T==='sit'||T==='stand'){ for(const w of [].concat(B.who)){ const g=ctx.actors[w]; if(g) g.userData.sit=(T==='sit'); } return nextBeat(); }
  if(T==='robe'){ const g=ctx.actors[B.who]; if(g&&g.userData.robeMeshes){ const m=K().robeMat(B.color); for(const q of g.userData.robeMeshes) q.material=m; } return nextBeat(); }
  if(T==='drift'){ const objs=[];
    /* one thing to a place (`to`), or several together by the same distance (`by`) — a boat
       and everyone standing in it, the player too */
    for(const id of [].concat(B.id)){ const o=id==='player'?player:(ctx.things[id]||ctx.actors[id]), G=ctx.glows[id];
      if(o){ objs.push(o); if(id!=='player') o.visible=true; } if(G){ objs.push(G.sprite); if(G.light) objs.push(G.light); G.visible=true; } }
    const by=B.by?new THREE.Vector3(...B.by):null;
    const D={objs,from:objs.map(q=>q.position.clone()),to:by?null:new THREE.Vector3(...B.to),by,t:0,dur:ST.fast?0.001:(B.dur||3)};
    ctx.drifts.push(D);
    if(B.wait===false) return nextBeat();
    onFrame=()=>{ if(D.t>=1) nextBeat(); }; return; }
  if(T==='wait'){ onFrame=()=>{ if(ST.fast||beatT>=B.s) nextBeat(); }; return; }
  if(T==='player'){ ctx.playerHidden=!!B.hidden; player.visible=!B.hidden; if(B.hidden) controlsOn=false;
    /* set the player down somewhere — in a boat, say — and hold him there (lock), or let him go */
    if(B.at){ const p=pos(B.at); player.position.set(p[0],B.y!==undefined?B.y:ctx.groundY(p[0],p[1]),p[1]); }
    if(B.face!==undefined){ player.rotation.y=B.face; camYaw=B.face+Math.PI; }
    if(B.y!==undefined) ctx.playerY=B.y; else if(B.lock===false) ctx.playerY=undefined;
    if(B.lock!==undefined) ctx.playerLock=!!B.lock;
    return nextBeat(); }
  /* the jars filled, the baskets heaped, the net full of fish; `color` turns water to wine */
  if(T==='fill'){ for(const id of [].concat(B.id)){ const o=ctx.things[id]; if(!o) continue; const f=o.userData.fill||o.userData.fish;
      if(f){ f.visible=B.show!==false; if(B.color!==undefined&&f.material) f.material.color.setHex(B.color); } } return nextBeat(); }
  if(T==='era'){ showEra(B); return; }
  if(T==='end') return endScene();
  console.warn('unknown beat',B); nextBeat();
}
function lookAtSpec(l){ if(typeof l==='string'){ if(ctx.actors[l]){ const g=ctx.actors[l]; return [g.position.x,g.position.y+1.5,g.position.z]; }
    if(ctx.glows[l]){ const s=ctx.glows[l].sprite.position; return [s.x,s.y,s.z]; }
    const m=pos(l); return [m[0],1.5,m[1]]; } return l; }
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
          else { if(B.send){ ctx.things[near].userData.goTo=pos(B.send); } witnessDone(near); } } }
      else { W.holding=Math.max(0,W.holding-dt*2); setProgress(B.hold?W.holding/B.hold:0); } }
    else { hide('sprompt'); W.holding=0; setProgress(0); } };
}
function witnessDone(id){
  const W=witness; if(!W||W.done.has(id)) return; W.done.add(id);
  save.witnessed=(save.witnessed||0)+1; persist(); chime(0.25);
  const B=W.B;
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
  galilSea:{shore:1.0,wind:1.4}
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
const FOLLOWERS={kepha:'kepha',shimon:'kepha',andri:'andri',yaaqob:'yaaqob',yahuchanon:'yahuchanon',philip:'philip',nethanel:'nethanel',mattithyahu:'mattithyahu'};
function journal(sc){
  save.road=save.road||{}; save.bonds=save.bonds||{};
  const k=act.id+'/'+sc.id;
  save.road[k]={place:sc.place,title:sc.title||'',date:sc.date||'',act:act.id};
  for(const a of sc.actors||[]){ const id=FOLLOWERS[a.id]; if(!id) continue;
    /* Yahuchanon the immerser is not Yahuchanon son of Zaḇdai */
    if((id==='yahuchanon'||id==='yaaqob')&&!/Zaḇdai/.test(a.key||'')) continue;
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
  for(const f of ctx.flicker){ const k=0.85+Math.sin(t*13)*0.08+Math.sin(t*7.3)*0.07; f.sprite.scale.setScalar(f.base*k); if(f.light) f.light.intensity=1.4*k; }
  for(const id in ctx.glows){ const G=ctx.glows[id]; if(G.pulse){ const k=1+Math.sin(t*2)*0.08; G.sprite.scale.setScalar(G.base*k); } }
  if(ctx.host) for(const G of ctx.host){ if(!G.visible) continue; G.sprite.position.y+=Math.sin(t*1.3+G.ph)*0.01; }
  if(ring){ ring.material.opacity=0.55+Math.sin(t*4)*0.25; }
  for(const w of ctx.water) w.material.opacity=0.82+Math.sin(t*1.7)*0.05;
  for(const D of ctx.drifts){ if(D.t>=1) continue; D.t=Math.min(1,D.t+dt/D.dur); const e=D.t<0.5?2*D.t*D.t:1-Math.pow(-2*D.t+2,2)/2;
    D.objs.forEach((o,k)=>{ if(D.by) o.position.copy(D.from[k]).addScaledVector(D.by,e); else o.position.lerpVectors(D.from[k],D.to,e);
      if(o===player&&ctx.playerY!==undefined) ctx.playerY=o.position.y;
      if(o.userData&&o.userData.fixedY!==undefined) o.userData.fixedY=o.position.y;
      if(o.userData&&o.userData.baseY!==undefined) o.userData.baseY=o.position.y; }); }
  for(const id in ctx.things){ const o=ctx.things[id], u=o.userData; const w=u.wings||(u.bird&&u.bird.userData&&u.bird.userData.wings); if(w&&w[0]){ const a=Math.sin(t*9)*0.5; w[0].rotation.z=a; w[1].rotation.z=-a; }
    if(u.bob){ const k=ctx.rough||1; o.position.y=u.baseY+Math.sin(t*1.3+o.position.x)*0.06*k; o.rotation.z=Math.sin(t*0.9+o.position.z)*0.025*k; } }
  if(portrait&&!$('sverse').classList.contains('off')) drawPortrait();
  { const T=SV.talk, g=T&&T.sp&&T.sp.glow&&ctx.glows[T.sp.glow];          /* a mal'ak's light swells with the words */
    if(g){ const m=SV.mouth(T.sp.key)||0; g.sprite.scale.setScalar(g.base*(1+m*0.12)); } }
  if(ST.fast) fastStep();
  if(onFrame) onFrame(dt);
  actPressed=false;
  updateCamera(dt);
  guardFace();
  writeCamera();
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
    advance, get running(){ return running; }, ctx:()=>ctx, faceExposed, player:()=>player, camera:()=>camera,
    reset:()=>{ save.codex={}; save.acts={}; save.witnessed=0; save.road={}; save.bonds={}; persist(); } };
};
})();
