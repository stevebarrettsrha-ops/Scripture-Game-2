/* THE FULLNESS OF TIME — the world the story is staged in.

   It is the VOYAGE's world. The story page raises the same earth, sky, sea, blocks and folk
   the voyage is played on (js/engine.js, through its story kit, window.__KIT), and every set
   of a scene is laid into it as blocks of that world, at the place the scene happened: the
   ground made level for it, walls and courts of hewn stone and plaster, the houses of the
   land as the voyage builds them, with their doors and floors. Nothing here draws a world of
   its own.

   A scene still speaks in METRES about its place (a man is 1.85 m): its root is set at the
   place's anchor and scaled by the kit's S (6.5 world units to the metre), so an act written
   in metres needs no other change. Boxes are read as blocks (story/settings.js lays them);
   what is too small to be a block (a reed, a scroll on a shelf, a jar) is kept as a little
   mesh in the scene. The people are the voyage's figures, given the look the story asks for;
   the beasts are the voyage's beasts. */
(function(){
'use strict';
const W = window.STORYWORLD = {};
const K = ()=>window.__KIT;

/* ---- A LITTLE NOISE, THE SAME EVERY TIME ---- */
function hash(x,z){ const s=Math.sin(x*127.1+z*311.7)*43758.5453; return s-Math.floor(s); }
function vnoise(x,z){ const xi=Math.floor(x), zi=Math.floor(z), xf=x-xi, zf=z-zi;
  const u=xf*xf*(3-2*xf), v=zf*zf*(3-2*zf);
  const a=hash(xi,zi), b=hash(xi+1,zi), c=hash(xi,zi+1), d=hash(xi+1,zi+1);
  return a+(b-a)*u+(c-a)*v+(a-b-c+d)*u*v; }
W.hash=hash; W.vnoise=vnoise;

/* ---- THE PALETTE OF THE LAND — each colour is read as the block nearest it ---- */
const C = W.C = {
  limestone:0xd8cfb8, whitewash:0xece6d6, mudbrick:0xa8835a, mudDark:0x8a6a47,
  stone:0x9c9486, stoneDark:0x7a7266, cobble:0x8e877a, earth:0x9b7b55, path:0xb49a74,
  grass:0x7f8f4e, grassDry:0xa99f63, olive:0x6d7a4a, oliveDark:0x55603a, bark:0x5d4a36,
  timber:0x6e5238, water:0x4f7f95, gold:0xd4af37, hay:0xcdb36a, wool:0xefe9dc,
  cedar:0x7a5a3e, dark:0x2b241d, roofEarth:0xa28a66, sand:0xcdbb92, rock:0x8d8272,
  basalt:'basalt', basalt2:'basalt'
};

/* ================= THE SET — blocks of the world, and the little things ================= */
/* `api` is the kit's set builder for this scene (setBuilder): it lays blocks in metres about
   the place's anchor, in one stamp group the scene takes up again when it ends. A box
   standing outside the level ground of the set stands on the ground where it is. */
function Static(api){ this.api=api; this.colliders=[]; this.p=[]; this.c=[]; this.i=[]; this.n=0; }
Static.prototype.ground=function(x,z){ return this.api.inPadL(x,z)?0:this.api.groundY(x,z); };
Static.prototype.box=function(x0,y0,z0,x1,y1,z1,color,opt){
  opt=opt||{};
  if(x1<x0){ const t=x0; x0=x1; x1=t; } if(z1<z0){ const t=z0; z0=z1; z1=t; } if(y1<y0){ const t=y0; y0=y1; y1=t; }
  const cx=(x0+x1)/2, cz=(z0+z1)/2, g=opt.abs?0:this.ground(cx,cz);
  /* a thing laid ON the ground — a path, a floor, cloth spread to dry — is the ground's top course */
  if(!opt.detail&&y1-y0<0.3&&y1<=0.35&&y0>=-0.05&&Math.max(x1-x0,z1-z0)>=0.6){ this.api.top(x0,z0,x1,z1,color); return; }
  /* too small to be a block: kept as a little thing of the scene */
  const span=Math.max(x1-x0,z1-z0);
  if(opt.detail||span<0.4||(opt.collide===false&&span<0.6)){ this.detail(x0,y0+g,z0,x1,y1+g,z1,color,opt); return; }
  this.api.box(x0,y0+g,z0,x1,y1+g,z1,color);
};
/* the little things, gathered into one mesh a scene, shaded by the way each face looks */
Static.prototype.detail=function(x0,y0,z0,x1,y1,z1,color,opt){
  opt=opt||{};
  const j=opt.jitter===undefined?0.06:opt.jitter;
  const k=1+(hash(x0*3.1+z1,z0*1.7+y0)-0.5)*j*2;
  const col=new THREE.Color(typeof color==='number'?color:0x8a8478); col.multiplyScalar(k);
  const P=this.p, Cc=this.c, I=this.i;
  const face=(a,b,c,d,sh)=>{ const o=this.n;
    P.push(...a,...b,...c,...d);
    for(let q=0;q<4;q++) Cc.push(col.r*sh,col.g*sh,col.b*sh);
    I.push(o,o+1,o+2,o,o+2,o+3); this.n+=4; };
  face([x0,y1,z1],[x1,y1,z1],[x1,y1,z0],[x0,y1,z0],1.0);
  face([x1,y0,z1],[x1,y0,z0],[x1,y1,z0],[x1,y1,z1],0.78);
  face([x0,y0,z0],[x0,y0,z1],[x0,y1,z1],[x0,y1,z0],0.70);
  face([x0,y0,z1],[x1,y0,z1],[x1,y1,z1],[x0,y1,z1],0.86);
  face([x1,y0,z0],[x0,y0,z0],[x0,y1,z0],[x1,y1,z0],0.62);
};
Static.prototype.mesh=function(){
  const g=new THREE.BufferGeometry();
  g.setAttribute('position',new THREE.Float32BufferAttribute(this.p,3));
  g.setAttribute('color',new THREE.Float32BufferAttribute(this.c,3));
  g.setIndex(this.i); g.computeVertexNormals();
  const m=new THREE.Mesh(g,new THREE.MeshLambertMaterial({vertexColors:true}));
  m.name='story-details'; return m;
};
W.Static=Static;

/* ================= THE GROUND ================= */
/* The ground is the world's own. A set is given level ground at its middle (`flat` metres
   about the anchor, rounded) and the land beyond is left as it lies; a hill the story needs
   (`peak`) is heaped up of earth, a river's channel and a lake's water are cut and filled. */
W.ground=function(ctx,o){
  const api=ctx.api, f=o.flat===undefined?30:o.flat;
  const top=o.top||(o.color===C.grass?'grass':o.color===0xc9b48a?'sand':'grass');
  if(f>0) api.pad(-f,-f,f,f,{round:true,top});
  for(const p of [].concat(o.peak||[])) api.mound(p.x,p.z,p.h,p.r,{top});
  ctx.groundY=(x,z)=>api.groundY(x,z);
  return null;
};
/* where a river's middle runs at z: a slow meander, straight at the ford (z≈0) */
W.riverX=function(r,z){ return Math.sin(z*(r.f||0.018))*(r.amp===undefined?8:r.amp); };
/* the river's water: its channel cut a course below the bank and filled, along its meander */
W.riverWater=function(ctx,r,len){
  len=len||400; const half=r.w+r.b*0.55;
  ctx.api.water(-r.amp-half-2,-len/2,r.amp+half+2,len/2,{depth:1,bed:'dirt',test:(x,z)=>Math.abs(x-W.riverX(r,z))<half});
  return null;
};

/* ================= BUILDINGS ================= */
/* THE HOUSE OF THE LAND is the voyage's own house — stone footing, walls of mudbrick or
   whitewashed plaster, a doorway with its door, a floor of beaten earth, a bed, a table and
   a hearth — set where the story asks, door on the side it asks. (`color` whitewash →
   plastered; basalt → the black stone of the Galil lake shore.) */
W.house=function(S,x,z,w,d,o){
  o=o||{};
  const style=o.color==='basalt'||o.color===C.basalt?'basalt':null;
  S.api.house(x,z,w,d,{door:o.door||'s',seed:Math.floor(Math.abs(x*31+z*17))+1,
    washed:o.color===C.whitewash?true:o.color===C.mudbrick||o.color===C.limestone?false:undefined,
    wall:style?'basalt':undefined});
};
/* a city wall with walk and crenels, from (x0,z0) to (x1,z1) */
W.wall=function(S,x0,z0,x1,z1,o){
  o=o||{}; const h=o.h||7, t=o.t||2.2, col=o.color||C.limestone;
  const dx=x1-x0, dz=z1-z0, L=Math.hypot(dx,dz), n=Math.max(1,Math.round(L/2));
  for(let k=0;k<n;k++){ const a=k/n, b=(k+1)/n;
    const ax=x0+dx*a, az=z0+dz*a, bx=x0+dx*b, bz=z0+dz*b;
    if(o.gap&&Math.hypot((ax+bx)/2-o.gap[0],(az+bz)/2-o.gap[1])<o.gap[2]) continue;
    const cx=(ax+bx)/2, cz=(az+bz)/2, hw=Math.abs(bx-ax)/2+t/2, hd=Math.abs(bz-az)/2+t/2;
    S.box(cx-hw,0,cz-hd,cx+hw,h,cz+hd,col);
    if(k%2===0) S.box(cx-hw*0.6,h,cz-hd*0.6,cx+hw*0.6,h+0.9,cz+hd*0.6,col); }
};
W.gate=function(S,x,z,axis,o){
  o=o||{}; const w=o.w||4, h=o.h||9, col=o.color||C.limestone;
  if(axis==='x'){ S.box(x-w/2-3,0,z-2.4,x-w/2,h,z+2.4,col); S.box(x+w/2,0,z-2.4,x+w/2+3,h,z+2.4,col);
    S.box(x-w/2,5.2,z-2.2,x+w/2,h-1,z+2.2,col); }
  else { S.box(x-2.4,0,z-w/2-3,x+2.4,h,z-w/2,col); S.box(x-2.4,0,z+w/2,x+2.4,h,z+w/2+3,col);
    S.box(x-2.2,5.2,z-w/2,x+2.2,h-1,z+w/2,col); }
};
/* the upper pool and its channel */
W.pool=function(ctx,S,x,z,w,d,o){
  o=o||{};
  S.box(x-w/2-0.8,0,z-d/2-0.8,x+w/2+0.8,0.5,z+d/2+0.8,C.stone);
  ctx.api.water(x-w/2,z-d/2,x+w/2,z+d/2,{depth:2,bed:'stone'});
  if(o.channel){ const [cx,cz]=o.channel, L=Math.hypot(cx-x,cz-z), n=Math.ceil(L/1.5);
    for(let k=0;k<=n;k++){ const t=k/n, px=x+(cx-x)*t, pz=z+(cz-z)*t; S.api.top(px-0.9,pz-0.9,px+0.9,pz+0.9,C.stoneDark); } }
};
/* a lean-to on posts over a stone feeding trough, beside a house */
W.stable=function(S,x,z){
  for(const [a,b] of [[-2.2,-1.6],[2.2,-1.6],[-2.2,1.6],[2.2,1.6]]) S.box(x+a-0.3,0,z+b-0.3,x+a+0.3,2.6,z+b+0.3,C.timber);
  S.box(x-2.6,2.6,z-2,x+2.6,3.2,z+2,'thatch');                                 /* the roof of straw */
  S.box(x-2.5,0,z-2.2,x+2.5,1.6,z-1.6,C.stone);                               /* back wall */
  S.box(x-0.8,0,z-0.4,x+0.8,0.55,z+0.4,C.stone);                               /* the trough */
  S.detail(x-0.65,0.5,z-0.28,x+0.65,0.62,z+0.28,C.hay);                        /* straw in it */
  S.box(x+1.4,0,z-1.4,x+2.3,0.9,z-0.5,'hay');                                  /* fodder */
};
W.fold=function(S,x,z,r){                     /* a sheepfold of stacked stone, open on +z */
  for(let a=0;a<28;a++){ const t=a/28*Math.PI*2; if(Math.abs(t-Math.PI/2)<0.35) continue;
    const px=x+Math.cos(t)*r, pz=z+Math.sin(t)*r;
    S.box(px-0.55,0,pz-0.55,px+0.55,1.1,pz+0.55,C.rock); }
};
/* AN OLIVE: a short twisted trunk and a low grey-green crown, as the voyage grows its trees */
W.olive=function(S,x,z,s){ s=s||1;
  S.box(x-0.35,0,z-0.35,x+0.35,1.7*s,z+0.35,'log');
  S.box(x-1.5*s,1.6*s,z-1.4*s,x+1.4*s,2.7*s,z+1.5*s,'leaves');
  S.box(x-0.9*s,2.6*s,z-0.9*s,x+1.0*s,3.4*s,z+0.8*s,'leaves'); };
W.palm=function(S,x,z){ S.box(x-0.35,0,z-0.35,x+0.35,5.4,z+0.35,'log');
  S.box(x-2,5.3,z-0.5,x+2,5.9,z+0.5,'leaves'); S.box(x-0.5,5.3,z-2,x+0.5,5.9,z+2,'leaves'); };
/* reeds and rushes at the water's edge — too fine to be blocks */
W.reeds=function(S,x,z,y,n){ y=y||0; n=n||7;
  for(let k=0;k<n;k++){ const a=hash(x+k,z-k)*6.28, r=hash(z+k*3,x)*0.9, px=x+Math.cos(a)*r, pz=z+Math.sin(a)*r, h=1.2+hash(px,pz)*1.1;
    S.detail(px-0.05,y,pz-0.05,px+0.05,y+h,pz+0.05,k%3?0x7d8a45:0xa99a5a,{jitter:0.15});
    if(k%3===0) S.detail(px-0.08,y+h,pz-0.08,px+0.08,y+h+0.25,pz+0.08,0x6e5238); } };
/* the thicket of the Yardĕn: tamarisk, grey-green and feathery */
W.tamarisk=function(S,x,z,s){ s=s||1;
  S.box(x-0.3,0,z-0.3,x+0.3,1.4*s,z+0.3,'log');
  S.box(x-1.4*s,1.1*s,z-1.2*s,x+1.3*s,2.6*s,z+1.3*s,'leaves'); };
/* a booth of poles roofed with branches — a shelter in the wilderness */
W.booth=function(S,x,z,y){ y=y||0;
  for(const [a,b] of [[-1.6,-1.2],[1.6,-1.2],[-1.6,1.2],[1.6,1.2]]) S.detail(x+a-0.1,y,z+b-0.1,x+a+0.1,y+2.2,z+b+0.1,C.timber);
  S.box(x-2,y+2.2,z-1.6,x+2,y+2.7,z+1.6,'thatch');
  S.detail(x-1.8,y,z-1.3,x+1.8,y+0.9,z-1.1,0x8d7a55); };
W.rock=function(S,x,z,s){ s=s||1; S.box(x-0.8*s,0,z-0.6*s,x+0.7*s,0.8*s,z+0.8*s,C.rock); };
W.jar=function(S,x,z){ S.detail(x-0.22,0,z-0.22,x+0.22,0.7,z+0.22,0xa0703f); };
W.desk=function(S,x,z){ S.box(x-0.9,0,z-0.5,x+0.9,0.8,z+0.5,'planks'); S.detail(x-0.5,0.92,z-0.3,x+0.4,0.96,z+0.25,0xe9dfc2); };

/* ================= LIGHTS AND LIVING THINGS ================= */
/* a glow: a sprite of light, and a lamp that lights the blocks about it. The lamp is never
   taken out of the world when the glow is hidden, only darkened — a light added or taken
   away makes every material of the world be built again. */
let _glowTex=null;
function glowTex(){ if(_glowTex) return _glowTex;
  const cv=document.createElement('canvas'); cv.width=cv.height=128; const g=cv.getContext('2d');
  const gr=g.createRadialGradient(64,64,0,64,64,64);
  gr.addColorStop(0,'rgba(255,255,255,1)'); gr.addColorStop(0.25,'rgba(255,244,210,0.85)');
  gr.addColorStop(0.6,'rgba(255,225,160,0.25)'); gr.addColorStop(1,'rgba(255,220,150,0)');
  g.fillStyle=gr; g.fillRect(0,0,128,128);
  _glowTex=new THREE.CanvasTexture(cv); return _glowTex; }
W.glow=function(ctx,x,y,z,size,color,intensity){
  const sp=new THREE.Sprite(new THREE.SpriteMaterial({map:glowTex(),color:color||0xfff2c8,transparent:true,
    depthWrite:false,blending:THREE.AdditiveBlending}));
  sp.position.set(x,y,z); sp.scale.set(size,size,1); ctx.scene.add(sp);
  let light=null; const S=(K()&&K().setScale)||6.5;
  if(intensity){ light=new THREE.PointLight(color||0xffe9b0,intensity,size*6*S,1.6); light.position.set(x,y,z); ctx.scene.add(light);
    light.userData.on=intensity; }
  return {sprite:sp,light,base:size,
    set visible(v){ sp.visible=v; if(light) light.intensity=v?light.userData.on:0; },
    get visible(){ return sp.visible; }};
};
/* a fire of sticks with its flicker */
W.fire=function(ctx,S,x,z){
  for(let k=0;k<5;k++){ const a=k/5*Math.PI*2; S.detail(x+Math.cos(a)*0.45-0.3,0,z+Math.sin(a)*0.45-0.3,x+Math.cos(a)*0.45+0.3,0.28,z+Math.sin(a)*0.45+0.3,C.rock); }
  const f=W.glow(ctx,x,0.7+S.ground(x,z),z,2.2,0xffa347,1.4); f.flicker=true; ctx.flicker.push(f); return f;
};

/* ---- THE PEOPLES, AS THEY LOOKED ----
   Skin follows the palette of Scripture-Game, the game this one continues, and the voyage's
   own folk: the people of Yasharal and all the lands about them (Mitsrayim, Aram, Arabia,
   Baḇal, Persia) brown, deep to medium; the Romans and Greeks olive and tan; the Germans and
   the peoples of the north lightest. A figure given no skin takes one of its people's by its
   name, so a crowd is many faces, not one. */
W.SKIN={
  yasharal:[0x5c3a1f,0x643f1c,0x6e4524,0x704a27,0x7a4e29,0x7c5430,0x855a33,0x8a6038],
  roman:[0xb8845a,0xc08c60,0xc8956a,0xc8a07a], greek:[0xc8956a,0xc8a07a,0xd8b48a],
  north:[0xe8c9a4,0xe2bf9c,0xeccdb0]
};
W.skinFor=function(o){ const P=W.SKIN[o.folk||'yasharal']||W.SKIN.yasharal;
  let h=2166136261; const k=String(o.id||o.name||'')+(o.at||''); for(let i=0;i<k.length;i++){ h^=k.charCodeAt(i); h=Math.imul(h,16777619); }
  return P[(h>>>0)%P.length]; };
/* THE FALLEN, as Scripture-Game draws Satan, Mastema and the Watchers (its `darkAngel`): a
   robe of deep violet-grey (#2a2230), a mantle of dark crimson (#5a1a24), hair and beard near
   black, a shadowed, ashen face, and a dim violet light about him (rgb 120,80,140). */
W.FALLEN={robe:0x2a2230, sash:0x5a1a24, cloth:0x120a0a, beard:0x120a0a, skin:0x4a3a40, under:0x1e1824, brow:0x120a0a};
const WOMEN=/^(Miryam|Elisheḇa|Ḥannah|A widow|The bride|A woman|Her )/;
/* ---- A PERSON IS ONE OF THE VOYAGE'S FOLK ----
   Built by the voyage's own makePerson (through the kit's makeFigure): the same head, face,
   robe, leggings and two-jointed limbs as every villager of the world, dressed in the look
   the story gives it. Returned in metres (the figure itself is built in world units and
   scaled down inside it), so the scene moves it, turns it and sits it down as before. */
W.person=function(ctx,o){
  o=o||{};
  if(o.fallen) o=Object.assign(o,W.FALLEN,{kind:o.kind||'dark'});
  /* YAHUSHA: a body like every other man's — a man of Yasharal, brown, in a plain robe of
     undyed wool with a mantle of blue — and His face never shown: the figure is made with
     no face at all, and the engine keeps every camera from looking on the front of His
     head (story/engine.js, guardFace) */
  if(o.holy) o=Object.assign(o,{robe:o.robe||0xd6c9a8, cloth:o.cloth||0xe2d8c0, sash:o.sash||0x3f5a8a, skin:o.skin||0x704a27, under:0x8a7a62, beard:null});
  if(!o.skin) o.skin=W.skinFor(o);
  const k=K(), S=k.setScale;
  const female=o.kind==='woman'||WOMEN.test(o.name||'');
  let seed=7; for(const ch of String(o.id||o.name||'')+String(o.at)) seed=(seed*31+ch.charCodeAt(0))%100003;
  const fig=k.makeFigure({seed, folk:o.folk==='roman'||o.folk==='greek'?'med':o.folk==='north'?'north':'levant', skin:o.skin, hair:o.hair, robe:o.robe||0x9a8466, sash:o.sash||0x6a3b2a, under:o.under||0x5b4a3a,
    cloth:o.cloth===null?null:(o.cloth||0xd9cfb6), beard:o.beard||null, female, small:o.small?(o.small===true?0.72:o.small):0,
    staff:!!o.staff, holy:!!o.holy, fallen:!!o.fallen, brow:o.brow?'#'+(o.brow>>>0).toString(16).padStart(6,'0'):null});
  fig.scale.multiplyScalar(1/S);
  const g=new THREE.Group(); g.add(fig);
  const u=fig.userData, s=u.s||1;
  if(o.carry){ const it=new THREE.Mesh(new THREE.BoxGeometry(2,2.3,1.6),new THREE.MeshLambertMaterial({color:o.carry}));
    it.position.set(0,-2.9,1.2); u.armR.userData.elbow.add(it); }
  g.userData={legL:u.legL,legR:u.legR,armL:u.armL,armR:u.armR,cloth:u.cloth,setFace:u.setFace,aura:u.aura,
    head:u.head,headY:1.6*s,s,holy:!!o.holy,phase:Math.random()*6,fig,
    robeMeshes:(()=>{ const out=[]; const rm=u.robeMat; fig.traverse(q=>{ if(q.isMesh&&q.material===rm) out.push(q); }); return out; })(),
    face:null, blink:2+Math.random()*4};
  ctx.scene.add(g); return g;
};
/* a dove of light — "the Ruach of Aluahim descending like a dove" (Mattithyahu 3:16) */
W.dove=function(ctx,x,y,z){
  const g=new THREE.Group(), k=K(), bird=k.makeBird?k.makeBird('dove'):null;
  if(bird){ bird.scale.multiplyScalar(1.4/k.setScale); g.add(bird); }
  const G=W.glow({scene:g},0,0,0,2.6,0xfff8e4,0); G.sprite.material.opacity=0.9;
  g.userData.bird=bird; g.position.set(x,y,z); ctx.scene.add(g); return g;
};
/* a fishing boat of the lake: planked hull, a thwart, a mast stepped amidships (the
   Kinnereth boat found at Ginosar, 8 m by 2.3) — a group, so it can be moved on the water */
const PLANK=()=>K().blockMat?K().blockMat('planks'):null;
W.boat=function(ctx,x,z,o){ o=o||{};
  const g=new THREE.Group(), pm=PLANK(), m=c=>pm&&c!==0x4a3220?pm:new THREE.MeshLambertMaterial({color:c});
  const b=(w,h,d,c,px,py,pz)=>{ const q=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),m(c)); q.position.set(px,py,pz); g.add(q); return q; };
  const wood=0x6a4a30, dark=0x4a3220;
  b(2.0,0.25,7.0,dark,0,-0.35,0);
  b(0.18,0.75,7.0,wood,-1.05,0.05,0); b(0.18,0.75,7.0,wood,1.05,0.05,0);
  b(2.1,0.75,0.2,wood,0,0.05,3.5); b(1.6,0.9,0.5,wood,0,0.15,3.9);
  b(2.1,0.75,0.2,wood,0,0.05,-3.5);
  b(2.0,0.1,0.4,0x8a6a48,0,0.2,0.8);
  if(o.mast!==false){ b(0.16,4.5,0.16,0x7a5a3e,0,2.4,1.2); b(2.6,0.1,0.1,0x7a5a3e,0,3.9,1.2); }
  g.position.set(x,o.y===undefined?-0.2:o.y,z); g.rotation.y=o.face||0; ctx.scene.add(g); return g; };
/* a net, heaped or hanging, and the fish that fill it */
W.net=function(ctx,x,z,o){ o=o||{};
  const g=new THREE.Group(), mat=new THREE.MeshLambertMaterial({color:0xb8a882,transparent:true,opacity:0.75});
  const q=new THREE.Mesh(new THREE.BoxGeometry(o.w||1.6,o.h||0.4,o.d||1.4),mat); g.add(q);
  const fish=new THREE.Group(), fm=new THREE.MeshLambertMaterial({color:0xc8ccd0,emissive:0x2a2c30});
  for(let k=0;k<(o.n||40);k++){ const f=new THREE.Mesh(new THREE.BoxGeometry(0.34,0.08,0.1),fm);
    f.position.set((hash(k,1)-0.5)*(o.w||1.6)*0.9,(hash(k,2)-0.3)*(o.h||0.4)*1.6,(hash(k,3)-0.5)*(o.d||1.4)*0.9); f.rotation.y=hash(k,4)*6; fish.add(f); }
  fish.visible=!!o.full; g.add(fish); g.userData.fish=fish;
  g.position.set(x,o.y||0,z); ctx.scene.add(g); return g; };
/* a stone water-jug "according to the mode of cleansing" (Yahuchanon 2:6): chalk stone, waist-high */
W.stoneJar=function(ctx,x,z){
  const g=new THREE.Group(), m=new THREE.MeshLambertMaterial({color:0xd8d0bc});
  const a=new THREE.Mesh(new THREE.BoxGeometry(0.62,0.95,0.62),m); a.position.y=0.475; g.add(a);
  const r=new THREE.Mesh(new THREE.BoxGeometry(0.74,0.1,0.74),m); r.position.y=0.95; g.add(r);
  const w=new THREE.Mesh(new THREE.BoxGeometry(0.5,0.02,0.5),new THREE.MeshBasicMaterial({color:0x6f8f9a})); w.position.y=0.94; w.visible=false; g.add(w);
  g.userData.fill=w; g.position.set(x,0,z); ctx.scene.add(g); return g; };
W.basket=function(ctx,x,z,full){
  const g=new THREE.Group();
  const a=new THREE.Mesh(new THREE.BoxGeometry(0.6,0.4,0.6),new THREE.MeshLambertMaterial({color:0xa8844a})); a.position.y=0.2; g.add(a);
  const f=new THREE.Mesh(new THREE.BoxGeometry(0.5,0.12,0.5),new THREE.MeshLambertMaterial({color:0xd8b878})); f.position.y=0.42; f.visible=!!full; g.add(f);
  g.userData.fill=f; g.position.set(x,0,z); ctx.scene.add(g); return g; };
/* THE CHILD in the feeding trough, wrapped up (Luke 2:7): a swaddled body, the cloth drawn
   over His head, lying with His face toward the back of the stall — and never seen (the
   engine's guard keeps every camera from it) */
W.infant=function(ctx,x,z,o){ o=o||{};
  const g=new THREE.Group(), m=c=>new THREE.MeshLambertMaterial({color:c});
  const body=new THREE.Mesh(new THREE.BoxGeometry(0.62,0.2,0.22),m(0xefe6d2)); g.add(body);
  for(const bx of [-0.18,0,0.18]){ const band=new THREE.Mesh(new THREE.BoxGeometry(0.05,0.21,0.23),m(0xd8ccb0)); band.position.x=bx; g.add(band); }
  const head=new THREE.Mesh(new THREE.BoxGeometry(0.18,0.17,0.17),m(0x704a27)); head.position.set(0.38,0.02,0); g.add(head);
  const hood=new THREE.Mesh(new THREE.BoxGeometry(0.21,0.2,0.19),m(0xefe6d2)); hood.position.set(0.39,0.04,0.012); g.add(hood);
  g.position.set(x,o.y||0.62,z); g.rotation.y=o.face||0; ctx.scene.add(g);
  g.userData.holy=true; g.userData.head=head; g.userData.faceDir=new THREE.Vector3(0,0,-1);
  return g; };
/* THE BEASTS are the voyage's beasts, at their true size */
function beast(ctx,kind,x,z){
  const k=K(), g=new THREE.Group(), b=k.makeAnimal(kind);
  if(b){ b.scale.multiplyScalar(1/k.setScale); g.add(b); }
  g.position.set(x,0,z); ctx.scene.add(g); return g; }
W.sheep=function(ctx,x,z,lamb){ const g=beast(ctx,'sheep',x,z); if(lamb) g.scale.setScalar(0.62);
  g.rotation.y=Math.random()*6; g.userData={home:[x,z],t:Math.random()*5,kind:'sheep',roam:2,sp:0.5}; return g; };
W.camel=function(ctx,x,z){ return beast(ctx,'camel',x,z); };
/* THE LIVING THINGS OF A PLACE — the voyage's own beasts and creeping things, the kinds of that
   land, wandering about their ground on the voyage's own gait: `n` of a kind about (x,z) within
   `r` metres, going at `sp` metres a second. They are the scene's flock, so they keep to it. */
W.wild=function(ctx,kind,x,z,n,r,sp){
  for(let k=0;k<(n||1);k++){ const a=hash(x+k*7.1,z-k*3.3)*6.28, d=hash(z+k,x-k)*(r||6);
    const px=x+Math.cos(a)*d, pz=z+Math.sin(a)*d, g=beast(ctx,kind,px,pz);
    g.rotation.y=hash(px,pz)*6.28;
    g.userData={home:[x,z],t:hash(k,x)*4,kind,roam:r||6,sp:sp||0.6}; ctx.flock.push(g); } };
W.donkey=function(ctx,x,z){ return beast(ctx,'donkey',x,z); };
})();
