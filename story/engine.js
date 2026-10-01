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

/* ================= THREE ================= */
let renderer, scene, camera, ctx=null, sky=null;
const clock=new THREE.Clock();
function initGL(){
  renderer=new THREE.WebGLRenderer({canvas:$('gl'),antialias:true});
  renderer.setPixelRatio(Math.min(2,window.devicePixelRatio||1));
  camera=new THREE.PerspectiveCamera(55,1,0.1,2000);
  resize(); window.addEventListener('resize',resize);
}
function resize(){ const w=window.innerWidth, h=window.innerHeight;
  renderer.setSize(w,h); camera.aspect=w/h; camera.updateProjectionMatrix(); }

/* the hour of a scene: sky, sun, fog and how much the stars show */
const TIMES={
  day:  {top:0x5f8fc9,hor:0xd9dccb,fog:0xcfd3c4,sun:0xfff1d6,sunI:1.0,hemi:0.62,stars:0,near:60,far:420},
  dusk: {top:0x2c3a66,hor:0xe0925a,fog:0xb27a5c,sun:0xffb070,sunI:0.55,hemi:0.42,stars:0.25,near:40,far:320},
  night:{top:0x05070f,hor:0x1a2440,fog:0x0d1322,sun:0x8aa0d0,sunI:0.18,hemi:0.2,stars:1,near:24,far:210},
  dawn: {top:0x3a4f84,hor:0xe7b98a,fog:0xc9a88a,sun:0xffd2a0,sunI:0.6,hemi:0.45,stars:0.15,near:40,far:320}
};
let sun, hemi, timeNow=null;
function applyTime(name){
  const T=TIMES[name]||TIMES.day; timeNow=name;
  scene.fog=new THREE.Fog(T.fog,T.near,T.far); scene.background=new THREE.Color(T.fog);
  sun.color.setHex(T.sun); sun.intensity=T.sunI; hemi.intensity=T.hemi;
  if(sky){ sky.paint(T.top,T.hor); sky.stars.material.opacity=T.stars; sky.stars.visible=T.stars>0; }
}

/* ================= A SCENE ================= */
function buildScene(sc){
  if(ctx){ scene.traverse(o=>{ if(o.geometry) o.geometry.dispose(); }); }
  scene=new THREE.Scene();
  hemi=new THREE.HemisphereLight(0xdfe6ff,0x6b5a44,0.6); scene.add(hemi);
  sun=new THREE.DirectionalLight(0xffffff,1); sun.position.set(-80,140,60); scene.add(sun);
  ctx={scene,colliders:[],markers:{},actors:{},things:{},glows:{},water:[],flicker:[],flock:[],groundY:()=>0,bounds:null,wind:[0.5,0.2]};
  const st=new window.STORYWORLD.Static();
  const build=window.STORYSETTINGS[sc.place];
  if(!build) throw new Error('no such place: '+sc.place);
  build(ctx,st);
  scene.add(st.mesh()); ctx.colliders.push(...st.colliders);
  sky=window.STORYWORLD.sky(ctx);
  applyTime(sc.time||'day');
  /* the people of the scene */
  for(const a of sc.actors||[]){
    const g=window.STORYWORLD.person(ctx,a);
    const p=pos(a.at); g.position.set(p[0],ctx.groundY(p[0],p[1]),p[1]);
    g.rotation.y=a.face!==undefined?a.face:0;
    g.userData.id=a.id; g.userData.name=a.name; g.userData.target=null; g.userData.follow=null; g.userData.def=a;
    if(a.y!==undefined){ g.userData.fixedY=a.y; g.position.y=a.y; }
    if(a.hidden) g.visible=false;
    if(a.name) g.userData.label=makeLabel(a.name,g);
    ctx.actors[a.id]=g; }
  /* the things a witness may lay a hand on */
  for(const t of sc.things||[]){
    const p=pos(t.at); let obj;
    if(t.kind==='lamb') obj=window.STORYWORLD.sheep(ctx,p[0],p[1],true);
    else if(t.kind==='camel') obj=window.STORYWORLD.camel(ctx,p[0],p[1]);
    else if(t.kind==='donkey') obj=window.STORYWORLD.donkey(ctx,p[0],p[1]);
    else if(t.kind==='dove'){ obj=window.STORYWORLD.dove(ctx,p[0],t.y||12,p[1]); if(t.hidden) obj.visible=false; }
    else { obj=new THREE.Mesh(new THREE.BoxGeometry(t.w||0.5,t.h||0.5,t.d||0.5),new THREE.MeshLambertMaterial({color:t.color||0xc9b38a}));
      obj.position.set(p[0],(t.y||0)+(t.h||0.5)/2,p[1]); scene.add(obj); }
    if(t.face!==undefined) obj.rotation.y=t.face;
    obj.userData.thing=t; ctx.things[t.id]=obj; }
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
  const pp=pos(P.at||[0,0]); player.position.set(pp[0],0,pp[1]); player.rotation.y=P.face||0;
  camYaw=(P.face||0)+Math.PI; camTarget=null;
  ctx.playerHidden=!!P.hidden; player.visible=!P.hidden;
}
function pos(at){ if(typeof at==='string'){ const m=ctx.markers[at]; if(!m) throw new Error('no marker '+at); return m; } return at; }
function thingPos(id){ const o=ctx.things[id]||ctx.actors[id]; return o?[o.position.x,o.position.z]:null; }

/* a name floating over a head, shown near or while speaking — a fixed size
   on screen, so it reads the same from across the field or at arm's length */
function makeLabel(name,g){
  const cv=document.createElement('canvas'); cv.width=256; cv.height=48; const c=cv.getContext('2d');
  c.font='600 26px Georgia, serif'; c.textAlign='center'; c.fillStyle='rgba(12,9,6,0.55)';
  const w=Math.min(250,c.measureText(name).width+22); c.fillRect(128-w/2,6,w,36);
  c.fillStyle='#f3e3b3'; c.fillText(name,128,33);
  const sp=new THREE.Sprite(new THREE.SpriteMaterial({map:new THREE.CanvasTexture(cv),transparent:true,depthTest:false,sizeAttenuation:false}));
  sp.scale.set(0.24,0.045,1); sp.position.set(0,2.75,0); sp.visible=false; sp.renderOrder=10; g.add(sp); return sp;
}

/* ================= THE PLAYER, THE CAMERA, THE HAND ================= */
let player=null, camYaw=0, camPitch=0.32, camDist=7.5, camTarget=null, camT=0;
const keys={};
let joy={x:0,y:0,active:false}, actHeld=false, actPressed=false;
window.addEventListener('keydown',e=>{ keys[e.code]=true;
  if(e.code==='KeyE'||e.code==='KeyF'){ if(!actHeld) actPressed=true; actHeld=true; }
  if(e.code==='Enter'||e.code==='Space'){ advance(); e.preventDefault(); }
  if(e.code==='KeyJ') toggleCodex();
  if(e.code==='KeyV') toggleVoice();
  if(e.code==='Escape') closePanels(); });
window.addEventListener('keyup',e=>{ keys[e.code]=false; if(e.code==='KeyE'||e.code==='KeyF') actHeld=false; });
function wireInput(){
  const gl=$('gl'); let drag=null;
  gl.addEventListener('pointerdown',e=>{ if(e.pointerType==='touch'&&e.clientX<window.innerWidth*0.4) return; drag={x:e.clientX,y:e.clientY}; });
  window.addEventListener('pointermove',e=>{ if(!drag) return; camYaw-=(e.clientX-drag.x)*0.006; camPitch=Math.max(0.05,Math.min(1.1,camPitch+(e.clientY-drag.y)*0.004)); drag={x:e.clientX,y:e.clientY}; });
  window.addEventListener('pointerup',()=>{ drag=null; });
  gl.addEventListener('wheel',e=>{ camDist=Math.max(3.5,Math.min(16,camDist+e.deltaY*0.01)); },{passive:true});
  /* the touch stick, bottom left */
  const pad=$('joy'), knob=$('knob'); let jid=null, c0=null;
  pad.addEventListener('pointerdown',e=>{ jid=e.pointerId; const r=pad.getBoundingClientRect(); c0=[r.left+r.width/2,r.top+r.height/2]; joy.active=true; pad.setPointerCapture(jid); moveJoy(e); });
  pad.addEventListener('pointermove',e=>{ if(e.pointerId===jid) moveJoy(e); });
  const endJ=()=>{ jid=null; joy={x:0,y:0,active:false}; knob.style.transform=''; };
  pad.addEventListener('pointerup',endJ); pad.addEventListener('pointercancel',endJ);
  function moveJoy(e){ let dx=e.clientX-c0[0], dy=e.clientY-c0[1]; const L=Math.hypot(dx,dy), m=46;
    if(L>m){ dx*=m/L; dy*=m/L; } joy.x=dx/m; joy.y=dy/m; knob.style.transform='translate('+dx+'px,'+dy+'px)'; }
  const ab=$('actbtn');
  ab.addEventListener('pointerdown',e=>{ actPressed=true; actHeld=true; e.preventDefault(); });
  ab.addEventListener('pointerup',()=>{ actHeld=false; }); ab.addEventListener('pointerleave',()=>{ actHeld=false; });
  $('verse').addEventListener('click',advance); $('card').addEventListener('click',advance); $('eras').addEventListener('click',advance);
  $('b-codex').addEventListener('click',toggleCodex);
  $('b-voice').addEventListener('click',toggleVoice); $('b-voice').style.opacity=SV.on?'1':'0.45'; $('b-hub').addEventListener('click',()=>{ stopAct(); showHub(); });
}
function blocked(x,z,r){
  for(const c of ctx.colliders) if(x>c.x0-r&&x<c.x1+r&&z>c.z0-r&&z<c.z1+r) return true;
  const b=ctx.bounds; if(b&&(x<b.x0||x>b.x1||z<b.z0||z>b.z1)) return true;
  return false;
}
function movePlayer(dt){
  if(!player||ctx.playerHidden) return;
  let fx=0, fz=0;
  if(controlsOn){
    if(keys.KeyW||keys.ArrowUp) fz+=1; if(keys.KeyS||keys.ArrowDown) fz-=1;
    if(keys.KeyA||keys.ArrowLeft) fx-=1; if(keys.KeyD||keys.ArrowRight) fx+=1;
    if(joy.active){ fx+=joy.x; fz-=joy.y; } }
  const L=Math.hypot(fx,fz), ud=player.userData;
  if(L>0.05){
    const sp=(keys.ShiftLeft||keys.ShiftRight?6.2:3.6)*Math.min(1,L);
    const fwd=camYaw+Math.PI, ang=fwd+Math.atan2(fx,fz);
    const dx=Math.sin(ang)*sp*dt, dz=Math.cos(ang)*sp*dt;
    const x=player.position.x, z=player.position.z;
    if(!blocked(x+dx,z,0.35)) player.position.x+=dx;
    if(!blocked(player.position.x,z+dz,0.35)) player.position.z+=dz;
    player.rotation.y=turnTo(player.rotation.y,ang,dt*10);
    ud.walk=(ud.walk||0)+dt*sp*2.2;
  } else ud.walk=0;
  player.position.y=ctx.groundY(player.position.x,player.position.z);
  animFigure(player,dt,L>0.05); animFace(player,'player',dt);
}
function turnTo(a,b,k){ let d=b-a; while(d>Math.PI) d-=Math.PI*2; while(d<-Math.PI) d+=Math.PI*2; return a+d*Math.min(1,k); }
function animFigure(g,dt,moving){
  const u=g.userData; u.phase=(u.phase||0)+dt*(moving?7:1.2);
  const sw=moving?Math.sin(u.phase)*0.55:Math.sin(u.phase)*0.03;
  if(u.legL){ u.legL.rotation.x=sw; u.legR.rotation.x=-sw; u.armL.rotation.x=-sw*0.8; u.armR.rotation.x=u.carrying?-0.9:sw*0.8; }
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
    g.position.y=u.fixedY!==undefined?u.fixedY:ctx.groundY(g.position.x,g.position.z);
    animFigure(g,dt,moving); animFace(g,id,dt);
    if(u.label){ const near=!camTarget&&player&&Math.hypot(player.position.x-g.position.x,player.position.z-g.position.z)<3.6;
      u.label.visible=near||speaking===id; } }
}
/* the flock grazes, and a lamb that has been gathered goes to the fold */
function moveFlock(dt,t){
  for(const s of ctx.flock){ const u=s.userData; u.t-=dt;
    if(u.t<0){ u.t=2+Math.random()*4; u.to=[u.home[0]+(Math.random()-0.5)*4,u.home[1]+(Math.random()-0.5)*4]; }
    if(u.to){ const dx=u.to[0]-s.position.x, dz=u.to[1]-s.position.z, d=Math.hypot(dx,dz);
      if(d>0.1){ s.position.x+=dx/d*dt*0.5; s.position.z+=dz/d*dt*0.5; s.rotation.y=Math.atan2(dx,dz); } } }
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
  if(keys.KeyQ) camYaw+=dt*1.8; if(keys.KeyR) camYaw-=dt*1.8;
  const tx=player.position.x, ty=player.position.y+1.6, tz=player.position.z;
  const want=[tx+Math.sin(camYaw)*Math.cos(camPitch)*camDist, ty+Math.sin(camPitch)*camDist, tz+Math.cos(camYaw)*Math.cos(camPitch)*camDist];
  want[1]=Math.max(want[1],ctx.groundY(want[0],want[2])+0.6);
  const k=Math.min(1,dt*6);
  camera.position.x+=(want[0]-camera.position.x)*k; camera.position.y+=(want[1]-camera.position.y)*k; camera.position.z+=(want[2]-camera.position.z)*k;
  camera.lookAt(tx,ty,tz);
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
   (After Scripture-Game's face.js.) He who is shown as light has no face: His light swells
   with His words instead, and so does a mal'ak's. */
const SV=window.STORYVOICE;
function talkingAs(id){ const T=SV.talk, sp=T&&T.sp; if(!sp) return null;
  return (sp.actor===id||(sp.actors&&sp.actors.indexOf(id)>=0))?T:null; }
function animFace(g,id,dt){
  const u=g.userData, F=u.face, T=talkingAs(id), m=T?(SV.mouth(T.sp.key)||0):0;
  if(u.aura){ const k=1+m*0.22+(T?0.06:0); u.aura.sprite.scale.setScalar(u.aura.base*k); }
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
  if(light){ const gr=g.createRadialGradient(19,18,1,19,18,19);
    const k=0.8+m*0.2+(talking?0.1:0);
    gr.addColorStop(0,'rgba(255,255,255,'+k+')'); gr.addColorStop(0.35,'rgba(255,240,200,'+(0.75*k)+')'); gr.addColorStop(1,'rgba(40,32,20,1)');
    g.fillStyle=gr; g.fillRect(0,0,38,38); return; }
  const L=sp.look||{}, skin=hex(L.skin||0x8a5a3a), cloth=hex(L.cloth||0xd9cfb6), robe=hex(L.robe||0x9a8466);
  R(0,0,38,38,'#2a2219');
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
  $('hub').classList.add('off'); $('play').classList.remove('off');
  startScene();
}
function stopAct(){ SV.stop(); running=false; act=null; closePanels(); hide('verse'); hide('card'); hide('goal'); hide('prompt'); hide('choice'); hide('eras'); ringOff(); witness=null; onFrame=null; }
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
  hide('verse'); hide('card'); hide('prompt'); hide('choice'); speaking=null; waitingAdvance=false; beatT=0; onFrame=null;
  SV.stop(); portrait=null;
  if(beatIx>=sc.beats.length){ endScene(); return; }
  beat=sc.beats[beatIx];
  const B=beat, T=B.t;
  if(ST.stopAt&&ST.stopAt(B)){ ST.fast=false; ST.stopAt=null; }
  if(T==='title'){ showCard('<div class="ttl">'+esc(B.text)+'</div>'+(B.sub?'<div class="sub">'+esc(B.sub)+'</div>':''),'title'); waitingAdvance=true; return; }
  if(T==='note'){ showCard('<div class="note-h">A note on the history</div><div class="note">'+esc(B.text)+'</div>','note'); waitingAdvance=true; return; }
  if(T==='say'||T==='read'){ showVerse(B); return; }
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
  if(T==='place'){ const g=B.who==='player'?player:ctx.actors[B.who]; const p=pos(B.at); if(g){ g.position.set(p[0],ctx.groundY(p[0],p[1]),p[1]); if(B.face!==undefined) g.rotation.y=B.face; } return nextBeat(); }
  if(T==='cam'){ controlsOn=!!B.free;
    if(B.release){ releaseCamera(); controlsOn=true; return nextBeat(); }
    const at=Array.isArray(B.look)&&B.look.length===3?B.look:lookAtSpec(B.look), from=B.from.length===3?B.from:[pos(B.from)[0],B.fy||4,pos(B.from)[1]];
    holdCamera(from,at,ST.fast?0.01:(B.dur||2.5));
    if(B.wait===false) return nextBeat();
    onFrame=()=>{ if(camT>=1) nextBeat(); }; return; }
  if(T==='show'||T==='hide'){ for(const id of [].concat(B.id)){ const o=ctx.glows[id]||ctx.things[id]||ctx.actors[id]; if(o) o.visible=(T==='show'); }
    if(B.host!==undefined&&ctx.host) for(const G of ctx.host) G.visible=!!B.host;
    if(B.star!==undefined&&ctx.star) ctx.star.visible=!!B.star;
    if(B.kingdoms!==undefined&&ctx.kingdoms) for(const G of ctx.kingdoms) G.visible=!!B.kingdoms;
    return nextBeat(); }
  if(T==='time'){ applyTime(B.to); return nextBeat(); }
  if(T==='robe'){ const g=ctx.actors[B.who]; if(g&&g.userData.robeMats) for(const m of g.userData.robeMats) m.color.setHex(B.color); return nextBeat(); }
  if(T==='drift'){ const objs=[], o=ctx.things[B.id]||ctx.actors[B.id], G=ctx.glows[B.id];
    if(o){ objs.push(o); o.visible=true; } if(G){ objs.push(G.sprite); if(G.light) objs.push(G.light); G.visible=true; }
    const D={objs,from:objs.map(q=>q.position.clone()),to:new THREE.Vector3(...B.to),t:0,dur:ST.fast?0.001:(B.dur||3)};
    ctx.drifts.push(D);
    if(B.wait===false) return nextBeat();
    onFrame=()=>{ if(D.t>=1) nextBeat(); }; return; }
  if(T==='wait'){ onFrame=()=>{ if(ST.fast||beatT>=B.s) nextBeat(); }; return; }
  if(T==='player'){ ctx.playerHidden=!!B.hidden; player.visible=!B.hidden; if(B.hidden) controlsOn=false; return nextBeat(); }
  if(T==='era'){ showEra(B); return; }
  if(T==='end') return endScene();
  console.warn('unknown beat',B); nextBeat();
}
function lookAtSpec(l){ if(typeof l==='string'){ if(ctx.actors[l]){ const g=ctx.actors[l]; return [g.position.x,g.position.y+1.5,g.position.z]; }
    if(ctx.glows[l]){ const s=ctx.glows[l].sprite.position; return [s.x,s.y,s.z]; }
    const m=pos(l); return [m[0],1.5,m[1]]; } return l; }
function endScene(){
  sceneIx++;
  if(sceneIx>=act.scenes.length){ finishAct(); return; }
  controlsOn=true; releaseCamera(); startScene();
}
function finishAct(){
  save.acts[act.id]='done'; persist();
  const a=act; stopAct();
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
    portrait=sp&&sp.kind!=='dark'?sp:null; $('verse').classList.toggle('has-face',!!portrait);
    speaking=sp&&sp.actor||null;
    if(sp&&sp.actor&&ctx.actors[sp.actor]&&player&&B.turn!==false&&!camTarget){ const g=ctx.actors[sp.actor];
      g.rotation.y=Math.atan2(player.position.x-g.position.x,player.position.z-g.position.z); } };
  const lightPart=i=>{ const els=$('v-text').querySelectorAll('.pt');
    els.forEach((e,k)=>{ e.classList.toggle('now',k===i); e.classList.toggle('later',k>i); }); };
  $('v-text').classList.add('flow');
  setWho(segs[0].sp); lightPart(0);
  show('verse');
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
  ring.position.set(m[0],ctx.groundY(m[0],m[1])+0.06,m[1]); scene.add(ring);
  ring.userData.beam=window.STORYWORLD.glow(ctx,m[0],2.2,m[1],2.4,0xffe7a0,0); }
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
          if(B.deliver){ W.carrying=near; ctx.things[near].userData.following=true; player.userData.carrying=true; setGoal(B.carryText||('Bring it to its place')); hide('prompt'); }
          else { if(B.send){ ctx.things[near].userData.goTo=pos(B.send); } witnessDone(near); } } }
      else { W.holding=Math.max(0,W.holding-dt*2); setProgress(B.hold?W.holding/B.hold:0); } }
    else { hide('prompt'); W.holding=0; setProgress(0); } };
}
function witnessDone(id){
  const W=witness; if(!W||W.done.has(id)) return; W.done.add(id);
  save.witnessed=(save.witnessed||0)+1; persist(); chime(0.25);
  const B=W.B; setGoal(B.text+'  ('+W.done.size+'/'+B.items.length+')');
  if(W.done.size>=B.items.length){ hide('prompt'); setGoal(''); witness=null; nextBeat(); }
}
function showPrompt(t){ $('prompt-t').textContent='E  '+t; show('prompt'); }
function setProgress(f){ $('hold').style.width=Math.round(Math.max(0,Math.min(1,f))*100)+'%'; }

/* ---- the player's own voice: reactions, never a named figure's ---- */
function showChoice(B){
  const c=$('choice'); c.innerHTML='<div class="c-h">'+esc(B.prompt||'You')+'</div>';
  B.options.forEach((o,k)=>{ const b=document.createElement('button'); b.textContent=o.text;
    b.onclick=()=>{ hide('choice'); if(o.reply){ showCard('<div class="you">You</div><div class="note">'+esc(o.reply)+'</div>','you'); waitingAdvance=true; } else nextBeat(); };
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
  box.innerHTML=h; show('eras'); waitingAdvance=true;
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
  show('fulfil'); fulfilOpen=true; chime(1.4);
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
function chime(strength){
  const A=audio(); if(!A) return; const t=A.currentTime;
  [523.25,659.25,783.99,1046.5].forEach((f,k)=>{ const o=A.createOscillator(), g=A.createGain();
    o.type='sine'; o.frequency.value=f; g.gain.setValueAtTime(0,t+k*0.12);
    g.gain.linearRampToValueAtTime(0.06*strength,t+k*0.12+0.02); g.gain.exponentialRampToValueAtTime(0.0001,t+k*0.12+1.6);
    o.connect(g).connect(A.destination); o.start(t+k*0.12); o.stop(t+k*0.12+1.7); });
}
function ambience(){ const A=audio(); if(!A||amb) return;
  const n=A.createBuffer(1,A.sampleRate*2,A.sampleRate), d=n.getChannelData(0); let last=0;
  for(let k=0;k<d.length;k++){ last=(last+0.02*(Math.random()*2-1))/1.02; d[k]=last*3.2; }
  const src=A.createBufferSource(); src.buffer=n; src.loop=true;
  const f=A.createBiquadFilter(); f.type='lowpass'; f.frequency.value=520;
  const g=A.createGain(); g.gain.value=0.05; src.connect(f).connect(g).connect(A.destination); src.start(); amb={g}; }

/* ================= FADE ================= */
function fade(to,dur){ const f=$('fade'); f.style.transition='opacity '+(dur||0)+'s'; f.style.opacity=to; }
function show(id){ $(id).classList.remove('off'); }
function hide(id){ $(id).classList.add('off'); }

/* ================= THE HUB ================= */
function showHub(msg){
  $('play').classList.add('off'); $('hub').classList.remove('off');
  const list=$('acts'); list.innerHTML='';
  const acts=ST.acts.slice().sort((a,b)=>a.n-b.n);
  let open=true;
  for(const a of acts){
    const done=save.acts[a.id]==='done', can=open&&!a.planned;
    const d=document.createElement('button'); d.className='act'+(done?' done':'')+(can?'':' locked');
    d.innerHTML='<span class="an">'+esc(a.num||'')+'</span><span class="at">'+esc(a.title)+'</span><span class="as">'+esc(a.sub||'')+'</span>'+
      '<span class="ast">'+(a.planned?'To come':done?'Walked ✓':can?'Begin ▸':'After the act before')+'</span>';
    if(can) d.onclick=()=>{ ambience(); runAct(a); };
    list.appendChild(d);
    if(!done&&!a.planned) open=false; }
  $('hub-codex').innerHTML=codexHTML();
  $('hub-msg').textContent=msg||'';
}

/* ================= THE FRAME ================= */
function frame(){
  requestAnimationFrame(frame);
  const dt=Math.min(0.05,clock.getDelta()), t=clock.elapsedTime;
  if(!running||!ctx) return;
  beatT+=dt;
  movePlayer(dt); moveActors(dt); moveFlock(dt,t);
  for(const f of ctx.flicker){ const k=0.85+Math.sin(t*13)*0.08+Math.sin(t*7.3)*0.07; f.sprite.scale.setScalar(f.base*k); if(f.light) f.light.intensity=1.4*k; }
  for(const id in ctx.glows){ const G=ctx.glows[id]; if(G.pulse){ const k=1+Math.sin(t*2)*0.08; G.sprite.scale.setScalar(G.base*k); } }
  if(ctx.host) for(const G of ctx.host){ if(!G.visible) continue; G.sprite.position.y+=Math.sin(t*1.3+G.ph)*0.01; }
  if(ring){ ring.material.opacity=0.55+Math.sin(t*4)*0.25; }
  for(const w of ctx.water) w.material.opacity=0.82+Math.sin(t*1.7)*0.05;
  for(const D of ctx.drifts){ if(D.t>=1) continue; D.t=Math.min(1,D.t+dt/D.dur); const e=D.t<0.5?2*D.t*D.t:1-Math.pow(-2*D.t+2,2)/2;
    D.objs.forEach((o,k)=>o.position.lerpVectors(D.from[k],D.to,e)); }
  for(const id in ctx.things){ const w=ctx.things[id].userData.wings; if(w){ const a=Math.sin(t*9)*0.5; w[0].rotation.z=a; w[1].rotation.z=-a; } }
  if(portrait&&!$('verse').classList.contains('off')) drawPortrait();
  { const T=SV.talk, g=T&&T.sp&&T.sp.glow&&ctx.glows[T.sp.glow];          /* a mal'ak's light swells with the words */
    if(g){ const m=SV.mouth(T.sp.key)||0; g.sprite.scale.setScalar(g.base*(1+m*0.12)); } }
  if(ST.fast) fastStep();
  if(onFrame) onFrame(dt);
  actPressed=false;
  updateCamera(dt);
  renderer.render(scene,camera);
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
  if(B.t==='goal'){ const m=pos(B.goto); player.position.set(m[0],0,m[1]); return; }
  if(B.t==='cam') camT=1;
}

/* ================= BOOT ================= */
ST.boot=function(){
  loadSave(); initGL(); wireInput();
  scene=new THREE.Scene();
  showHub();
  requestAnimationFrame(frame);
  /* for the test harness: where the story stands, and a way to run it */
  window.__STORY={ST,save,get act(){ return act&&act.id; },get scene(){ return act&&act.scenes[sceneIx]&&act.scenes[sceneIx].id; },
    get beat(){ return beat; },get beatIx(){ return beatIx; },run:(id,s)=>{ const a=ST.acts.find(q=>q.id===id); stopAct(); runAct(a,s||0); },
    advance, get running(){ return running; }, ctx:()=>ctx, player:()=>player, camera:()=>camera,
    reset:()=>{ save.codex={}; save.acts={}; save.witnessed=0; persist(); showHub(); } };
};
})();
