/* THE FULLNESS OF TIME — the world the story is staged in.

   Everything here is SET, not story: the ground, the walls, the houses, the
   Hĕḵal on its hill, the upper pool, the fields and the flock, and the people
   who stand in them. The acts (story/acts/*.js) say where a scene is and who
   is in it; this makes it. It follows the voyage's look — block on block,
   flat-shaded, the colours of the land — and the same research the voyage's
   villages were built on: the pillared house of Iron-Age Yahuḏah, mudbrick
   and whitewash on a stone footing, flat roofs of beaten earth with a
   parapet (Dabarim 22:8), an outside stair.

   Static geometry is gathered into ONE mesh a scene (one draw), each box's
   faces shaded by the way they face so the light reads without a lamp. */
(function(){
'use strict';
const W = window.STORYWORLD = {};

/* ---- A LITTLE NOISE, THE SAME EVERY TIME ---- */
function hash(x,z){ const s=Math.sin(x*127.1+z*311.7)*43758.5453; return s-Math.floor(s); }
function vnoise(x,z){ const xi=Math.floor(x), zi=Math.floor(z), xf=x-xi, zf=z-zi;
  const u=xf*xf*(3-2*xf), v=zf*zf*(3-2*zf);
  const a=hash(xi,zi), b=hash(xi+1,zi), c=hash(xi,zi+1), d=hash(xi+1,zi+1);
  return a+(b-a)*u+(c-a)*v+(a-b-c+d)*u*v; }
W.hash=hash; W.vnoise=vnoise;

/* ---- THE PALETTE OF THE LAND ---- */
const C = W.C = {
  limestone:0xd8cfb8, whitewash:0xece6d6, mudbrick:0xa8835a, mudDark:0x8a6a47,
  stone:0x9c9486, stoneDark:0x7a7266, cobble:0x8e877a, earth:0x9b7b55, path:0xb49a74,
  grass:0x7f8f4e, grassDry:0xa99f63, olive:0x6d7a4a, oliveDark:0x55603a, bark:0x5d4a36,
  timber:0x6e5238, water:0x4f7f95, gold:0xd4af37, hay:0xcdb36a, wool:0xefe9dc,
  cedar:0x7a5a3e, dark:0x2b241d, roofEarth:0xa28a66, sand:0xcdbb92, rock:0x8d8272
};

/* ================= THE STATIC BUILDER — one mesh for the whole set ================= */
function Static(){
  this.p=[]; this.c=[]; this.i=[]; this.n=0; this.colliders=[];
}
Static.prototype.box=function(x0,y0,z0,x1,y1,z1,color,opt){
  opt=opt||{};
  if(x1<x0){ const t=x0; x0=x1; x1=t; } if(z1<z0){ const t=z0; z0=z1; z1=t; } if(y1<y0){ const t=y0; y0=y1; y1=t; }
  const j=opt.jitter===undefined?0.06:opt.jitter;
  const k=1+(hash(x0*3.1+z1,z0*1.7+y0)-0.5)*j*2;
  const col=new THREE.Color(color); col.multiplyScalar(k);
  const P=this.p, Cc=this.c, I=this.i;
  const face=(a,b,c,d,sh)=>{ const o=this.n;
    P.push(...a,...b,...c,...d);
    for(let q=0;q<4;q++) Cc.push(col.r*sh,col.g*sh,col.b*sh);
    I.push(o,o+1,o+2,o,o+2,o+3); this.n+=4; };
  if(!opt.noTop)    face([x0,y1,z1],[x1,y1,z1],[x1,y1,z0],[x0,y1,z0],1.0);
  if(opt.bottom)    face([x0,y0,z0],[x1,y0,z0],[x1,y0,z1],[x0,y0,z1],0.45);
  face([x1,y0,z1],[x1,y0,z0],[x1,y1,z0],[x1,y1,z1],0.78);   /* +x */
  face([x0,y0,z0],[x0,y0,z1],[x0,y1,z1],[x0,y1,z0],0.70);   /* -x */
  face([x0,y0,z1],[x1,y0,z1],[x1,y1,z1],[x0,y1,z1],0.86);   /* +z */
  face([x1,y0,z0],[x0,y0,z0],[x0,y1,z0],[x1,y1,z0],0.62);   /* -z */
  if(opt.collide!==false&&(y1-y0)>0.45) this.colliders.push({x0,x1,z0,z1,y0,y1});
};
Static.prototype.mesh=function(){
  const g=new THREE.BufferGeometry();
  g.setAttribute('position',new THREE.Float32BufferAttribute(this.p,3));
  g.setAttribute('color',new THREE.Float32BufferAttribute(this.c,3));
  g.setIndex(this.i); g.computeVertexNormals();
  const m=new THREE.Mesh(g,new THREE.MeshLambertMaterial({vertexColors:true}));
  m.name='static'; return m;
};
W.Static=Static;

/* ================= THE GROUND ================= */
/* gentle land about a level stage; `rise` lifts one side (the city's ridge) */
W.ground=function(ctx,o){
  const size=o.size||400, seg=Math.min(160,Math.round(size/2.5));
  const g=new THREE.PlaneGeometry(size,size,seg,seg); g.rotateX(-Math.PI/2);
  const pos=g.attributes.position, cols=[];
  const base=new THREE.Color(o.color||C.grassDry), alt=new THREE.Color(o.alt||C.earth);
  const hf=W.heightFn(o);
  for(let k=0;k<pos.count;k++){ const x=pos.getX(k), z=pos.getZ(k);
    pos.setY(k,hf(x,z));
    const n=vnoise(x*0.06,z*0.06), n2=vnoise(x*0.3+7,z*0.3-3);
    const c=base.clone().lerp(alt,Math.min(1,n*0.8+n2*0.25)); c.multiplyScalar(0.88+n2*0.2);
    if(o.tint) o.tint(x,z,c,n2);
    cols.push(c.r,c.g,c.b); }
  g.setAttribute('color',new THREE.Float32BufferAttribute(cols,3)); g.computeVertexNormals();
  const m=new THREE.Mesh(g,new THREE.MeshLambertMaterial({vertexColors:true,flatShading:true}));
  m.name='ground'; ctx.scene.add(m); ctx.groundY=hf; return m;
};
W.heightFn=function(o){
  const flat=o.flat||40, hills=o.hills===undefined?6:o.hills;
  return (x,z)=>{ const d=Math.max(Math.abs(x),Math.abs(z));
    const t=Math.max(0,Math.min(1,(d-flat)/60));
    let h=(vnoise(x*0.02,z*0.02)-0.3)*hills*t + vnoise(x*0.09,z*0.09)*0.6*t;
    if(o.valley) h-=Math.max(0,1-Math.abs(z-o.valley.z)/o.valley.w)*o.valley.d*t;
    if(o.peak){ for(const p of [].concat(o.peak)){ const q=Math.max(0,1-Math.hypot(x-p.x,z-p.z)/p.r); h+=p.h*q*q*(3-2*q); } }
    if(o.shore){ const sh=o.shore, dx=x-sh.x; if(dx>0) return -Math.min(sh.d,dx*(sh.slope||0.12))-0.05; }
    h=Math.max(-0.2,h);
    if(o.river){ const r=o.river, dx=Math.abs(x-W.riverX(r,z));      /* the channel: a flat bed, sloping banks */
      h-=r.d*Math.max(0,Math.min(1,(r.w+r.b-dx)/r.b)); }
    return h; };
};
/* where a river's middle runs at z: a slow meander, straight at the ford (z≈0) */
W.riverX=function(r,z){ return Math.sin(z*(r.f||0.018))*(r.amp===undefined?8:r.amp); };
/* the water of a river, a strip following its meander */
W.riverWater=function(ctx,r,len){
  len=len||400; const n=Math.round(len/4), g=new THREE.PlaneGeometry(1,len,1,n); g.rotateX(-Math.PI/2);
  const P=g.attributes.position, half=r.w+r.b*0.55;
  for(let k=0;k<P.count;k++){ const z=P.getZ(k); P.setX(k,W.riverX(r,z)+(P.getX(k)>0?half:-half)); }
  g.computeVertexNormals();
  const m=new THREE.Mesh(g,new THREE.MeshLambertMaterial({color:r.color||0x5d7f78,transparent:true,opacity:0.86,depthWrite:false}));
  m.position.y=r.level===undefined?-0.35:r.level; m.renderOrder=2; ctx.scene.add(m); ctx.water.push(m); return m;
};

/* ================= BUILDINGS ================= */
/* the house of the land: a stone footing, walls of mudbrick or whitewashed
   plaster, a flat roof of beaten earth on beams whose ends stand out of the
   wall, a parapet about it (Dabarim 22:8) and a stair up the outside */
W.house=function(S,x,z,w,d,o){
  o=o||{}; const h=o.h||3.2, wall=o.color||(hash(x,z)<0.45?C.whitewash:C.mudbrick);
  const x0=x-w/2, x1=x+w/2, z0=z-d/2, z1=z+d/2;
  S.box(x0-0.1,0,z0-0.1,x1+0.1,0.45,z1+0.1,C.stone);                     /* footing */
  S.box(x0,0.45,z0,x1,h,z1,wall);                                       /* the house */
  S.box(x0-0.05,h,z0-0.05,x1+0.05,h+0.28,z1+0.05,C.roofEarth);          /* beaten-earth roof */
  const pt=0.22;                                                         /* parapet */
  S.box(x0,h+0.28,z0,x1,h+0.75,z0+pt,wall); S.box(x0,h+0.28,z1-pt,x1,h+0.75,z1,wall);
  S.box(x0,h+0.28,z0,x0+pt,h+0.75,z1,wall); S.box(x1-pt,h+0.28,z0,x1,h+0.75,z1,wall);
  for(let k=x0+0.6;k<x1-0.3;k+=1.2) S.box(k,h-0.2,z1,k+0.22,h+0.02,z1+0.3,C.timber,{collide:false}); /* beam ends */
  /* the door: a dark opening on the side asked for */
  const dr=o.door||'s', dw=0.9;
  if(dr==='s') S.box(x-dw/2,0.45,z1,x+dw/2,2.2,z1+0.04,C.dark,{collide:false});
  if(dr==='n') S.box(x-dw/2,0.45,z0-0.04,x+dw/2,2.2,z0,C.dark,{collide:false});
  if(dr==='e') S.box(x1,0.45,z-dw/2,x1+0.04,2.2,z+dw/2,C.dark,{collide:false});
  if(dr==='w') S.box(x0-0.04,0.45,z-dw/2,x0,2.2,z+dw/2,C.dark,{collide:false});
  if(!o.noStair){ const sx=dr==='e'?x0-1:x1;                              /* the outside stair */
    for(let s=0;s<4;s++) S.box(sx,0,z0+0.3+s*0.7,sx+1,0.45+s*0.72,z0+1.0+s*0.7,wall); }
  if(o.window!==false) S.box(x-0.3,h-1.1,z0-0.04,x+0.3,h-0.6,z0,C.dark,{collide:false});
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
/* a gate: two towers and a lintel over the road */
W.gate=function(S,x,z,axis,o){
  o=o||{}; const w=o.w||4, h=o.h||9, col=o.color||C.limestone;
  if(axis==='x'){ S.box(x-w/2-3,0,z-2.4,x-w/2,h,z+2.4,col); S.box(x+w/2,0,z-2.4,x+w/2+3,h,z+2.4,col);
    S.box(x-w/2,5.2,z-2.2,x+w/2,h-1,z+2.2,col,{collide:false}); }
  else { S.box(x-2.4,0,z-w/2-3,x+2.4,h,z-w/2,col); S.box(x-2.4,0,z+w/2,x+2.4,h,z+w/2+3,col);
    S.box(x-2.2,5.2,z-w/2,x+2.2,h-1,z+w/2,col,{collide:false}); }
};
/* the Hĕḵal on its platform: courts stepped up, the house with its porch
   and two great pillars before it */
W.hekal=function(S,x,z,o){
  o=o||{}; const col=C.limestone;
  S.box(x-16,0,z-20,x+16,1.2,z+20,C.stone);                   /* the outer court */
  S.box(x-10,1.2,z-14,x+10,2.2,z+14,C.limestone);             /* the inner court */
  for(let s=0;s<3;s++) S.box(x-3,0.4*s,z+20+(2-s)*0.8,x+3,0.4*(s+1),z+21+(2-s)*0.8,C.stone); /* steps */
  S.box(x-5,2.2,z-11,x+5,12,z+3,col);                          /* the house */
  S.box(x-5.6,12,z-11.6,x+5.6,12.6,z+3.6,C.stone);
  S.box(x-5,2.2,z+3,x+5,14,z+6,col);                           /* the porch */
  S.box(x-4.2,2.2,z+7.2,x-2.8,10,z+8.6,0xb08d3c);             /* the two pillars */
  S.box(x+2.8,2.2,z+7.2,x+4.2,10,z+8.6,0xb08d3c);
  S.box(x-1.2,2.2,z+6,x+1.2,7,z+6.05,C.dark,{collide:false}); /* the doorway */
  S.box(x-2,2.2,z+10.5,x+2,3.6,z+13,0xa99c84);                /* the altar */
  if(o.glow) S.box(x-1,7,z+6.1,x+1,7.3,z+6.2,C.gold,{collide:false});
};
/* the upper pool and its channel */
W.pool=function(ctx,S,x,z,w,d,o){
  o=o||{};
  S.box(x-w/2-0.8,0,z-d/2-0.8,x+w/2+0.8,0.5,z-d/2,C.stone); S.box(x-w/2-0.8,0,z+d/2,x+w/2+0.8,0.5,z+d/2+0.8,C.stone);
  S.box(x-w/2-0.8,0,z-d/2,x-w/2,0.5,z+d/2,C.stone); S.box(x+w/2,0,z-d/2,x+w/2+0.8,0.5,z+d/2,C.stone);
  const wg=new THREE.PlaneGeometry(w,d); wg.rotateX(-Math.PI/2);
  const wm=new THREE.Mesh(wg,new THREE.MeshLambertMaterial({color:C.water,transparent:true,opacity:0.88}));
  wm.position.set(x,0.18,z); ctx.scene.add(wm); ctx.water.push(wm);
  if(o.channel){ const [cx,cz]=o.channel;              /* the conduit toward the city */
    const L=Math.hypot(cx-x,cz-z), n=Math.ceil(L/1.5);
    for(let k=0;k<=n;k++){ const t=k/n, px=x+(cx-x)*t, pz=z+(cz-z)*t;
      S.box(px-0.9,0,pz-0.9,px+0.9,0.35,pz+0.9,C.stoneDark,{collide:false}); } }
  ctx.colliders.push({x0:x-w/2,x1:x+w/2,z0:z-d/2,z1:z+d/2,y0:0,y1:1});
};
/* a lean-to on posts over a stone feeding trough, beside a house */
W.stable=function(S,x,z,o){
  o=o||{};
  for(const [a,b] of [[-2.2,-1.6],[2.2,-1.6],[-2.2,1.6],[2.2,1.6]]) S.box(x+a-0.15,0,z+b-0.15,x+a+0.15,2.5,z+b+0.15,C.timber);
  S.box(x-2.6,2.5,z-2,x+2.6,2.75,z+2,C.hay,{collide:false});                     /* the thatch */
  S.box(x-2.5,0,z-2,x+2.5,1.6,z-1.7,C.stone);                                 /* back wall */
  S.box(x-0.8,0,z-0.4,x+0.8,0.55,z+0.4,C.stone);                               /* the trough */
  S.box(x-0.65,0.4,z-0.28,x+0.65,0.58,z+0.28,C.hay,{collide:false});           /* straw in it */
  S.box(x+1.2,0,z-1.4,x+2.2,0.5,z-0.6,C.hay);                                  /* fodder */
};
W.fold=function(S,x,z,r){                     /* a sheepfold of stacked stone, open on +z */
  for(let a=0;a<28;a++){ const t=a/28*Math.PI*2; if(Math.abs(t-Math.PI/2)<0.35) continue;
    const px=x+Math.cos(t)*r, pz=z+Math.sin(t)*r;
    S.box(px-0.55,0,pz-0.55,px+0.55,1.1,pz+0.55,C.rock); }
};
W.olive=function(S,x,z,s){ s=s||1;
  S.box(x-0.25*s,0,z-0.25*s,x+0.25*s,1.6*s,z+0.25*s,C.bark,{collide:false});
  S.box(x-1.3*s,1.5*s,z-1.2*s,x+1.2*s,2.5*s,z+1.3*s,C.olive,{collide:false});
  S.box(x-0.8*s,2.4*s,z-0.8*s,x+0.9*s,3.0*s,z+0.7*s,C.oliveDark,{collide:false});
  S.colliders.push({x0:x-0.3*s,x1:x+0.3*s,z0:z-0.3*s,z1:z+0.3*s,y0:0,y1:1.6*s}); };
W.palm=function(S,x,z){ for(let k=0;k<6;k++) S.box(x-0.18+k*0.04,k*0.9,z-0.18,x+0.18+k*0.04,(k+1)*0.9,z+0.18,C.bark,{collide:false});
  S.box(x-1.6,5.3,z-0.35,x+1.8,5.6,z+0.35,C.olive,{collide:false}); S.box(x-0.35,5.3,z-1.6,x+0.45,5.6,z+1.7,C.olive,{collide:false}); };
/* reeds and rushes at the water's edge */
W.reeds=function(S,x,z,y,n){ y=y||0; n=n||7;
  for(let k=0;k<n;k++){ const a=hash(x+k,z-k)*6.28, r=hash(z+k*3,x)*0.9, px=x+Math.cos(a)*r, pz=z+Math.sin(a)*r, h=1.2+hash(px,pz)*1.1;
    S.box(px-0.05,y,pz-0.05,px+0.05,y+h,pz+0.05,k%3?0x7d8a45:0xa99a5a,{collide:false,jitter:0.15});
    if(k%3===0) S.box(px-0.08,y+h,pz-0.08,px+0.08,y+h+0.25,pz+0.08,0x6e5238,{collide:false}); } };
/* the thicket of the Yardĕn: tamarisk, grey-green and feathery */
W.tamarisk=function(S,x,z,s,y){ s=s||1; y=y||0;
  S.box(x-0.2*s,y,z-0.2*s,x+0.2*s,y+1.4*s,z+0.2*s,C.bark,{collide:false});
  S.box(x-1.4*s,y+1.1*s,z-1.2*s,x+1.3*s,y+2.4*s,z+1.3*s,0x8a9467,{collide:false});
  S.box(x-0.9*s,y+2.3*s,z-0.8*s,x+0.8*s,y+3.1*s,z+0.9*s,0x9aa27a,{collide:false});
  S.colliders.push({x0:x-0.3*s,x1:x+0.3*s,z0:z-0.3*s,z1:z+0.3*s,y0:y,y1:y+1.4*s}); };
/* a booth of poles roofed with branches — a shelter in the wilderness */
W.booth=function(S,x,z,y){ y=y||0;
  for(const [a,b] of [[-1.6,-1.2],[1.6,-1.2],[-1.6,1.2],[1.6,1.2]]) S.box(x+a-0.1,y,z+b-0.1,x+a+0.1,y+2.2,z+b+0.1,C.timber);
  S.box(x-2,y+2.2,z-1.6,x+2,y+2.45,z+1.6,0x7c7a4e,{collide:false});
  S.box(x-1.8,y,z-1.3,x+1.8,y+0.9,z-1.1,0x8d7a55,{collide:false}); };
W.rock=function(S,x,z,s){ s=s||1; S.box(x-0.8*s,0,z-0.6*s,x+0.7*s,0.7*s,z+0.8*s,C.rock); };
W.jar=function(S,x,z){ S.box(x-0.22,0,z-0.22,x+0.22,0.7,z+0.22,0xa0703f,{collide:false}); };
W.desk=function(S,x,z){ S.box(x-0.9,0,z-0.5,x+0.9,0.8,z+0.5,C.timber); S.box(x-0.5,0.8,z-0.3,x+0.4,0.84,z+0.25,0xe9dfc2,{collide:false}); };

/* ================= LIGHTS AND LIVING THINGS ================= */
/* a glow sprite, drawn once into a canvas */
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
  let light=null;
  if(intensity){ light=new THREE.PointLight(color||0xffe9b0,intensity,size*6,1.6); light.position.set(x,y,z); ctx.scene.add(light); }
  return {sprite:sp,light,base:size,set visible(v){ sp.visible=v; if(light) light.visible=v; },get visible(){ return sp.visible; }};
};
/* a fire of sticks with its flicker */
W.fire=function(ctx,S,x,z){
  for(let k=0;k<5;k++){ const a=k/5*Math.PI*2; S.box(x+Math.cos(a)*0.45-0.3,0,z+Math.sin(a)*0.45-0.3,x+Math.cos(a)*0.45+0.3,0.28,z+Math.sin(a)*0.45+0.3,C.rock,{collide:false}); }
  const f=W.glow(ctx,x,0.7,z,2.2,0xffa347,1.4); f.flicker=true; ctx.flicker.push(f); return f;
};

/* ---- A PERSON, block on block ----
   Robe, sash, head-cloth, hands and feet: the voyage's figure, at the scale
   of a man (1.8 units). `o.robe`, `o.cloth`, `o.skin`; a child is `o.small`. */
/* ---- THE PEOPLES, AS THEY LOOKED ----
   Skin follows the palette of Scripture-Game, the game this one continues: the people of
   Yasharal and all the lands about them (Mitsrayim, Aram, Arabia, Baḇal, Persia) brown, deep
   to medium; the Romans and Greeks olive and tan; the Germans and the peoples of the north
   lightest. A figure given no skin takes one of its people's by its name, so a crowd is
   many faces, not one. */
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
W.person=function(ctx,o){
  o=o||{};
  if(o.fallen) o=Object.assign(o,W.FALLEN,{kind:o.kind||'dark'});
  /* YAHUSHA: a body like every other man's — a man of Yasharal, brown, in a plain robe of
     undyed wool with a mantle of blue — and His face never shown: the figure is made with
     no face at all, and the engine keeps every camera from looking on the front of His
     head (story/engine.js, guardFace) */
  if(o.holy) o=Object.assign(o,{robe:o.robe||0xd6c9a8, cloth:o.cloth||0xe2d8c0, sash:o.sash||0x3f5a8a, skin:o.skin||0x704a27, under:0x8a7a62, beard:null});
  if(!o.skin) o.skin=W.skinFor(o);
  const g=new THREE.Group(), s=o.small?0.72:1;
  let mat=c=>new THREE.MeshLambertMaterial({color:c});
  const bx=(w,h,d,c,x,y,z)=>{ const m=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),mat(c)); m.position.set(x,y,z); if(c===robe) robeMats.push(m.material); return m; };
  const robeMats=[];
  const skin=o.skin||0x8a5a3a, robe=o.robe||0x9a8466, clothC=o.cloth||0xd9cfb6;
  const legL=bx(0.26,0.8,0.28,o.under||0x5b4a3a,-0.14,0.4,0), legR=bx(0.26,0.8,0.28,o.under||0x5b4a3a,0.14,0.4,0);
  const body=bx(0.62,0.9,0.36,robe,0,1.15,0);
  const skirt=bx(0.6,0.5,0.34,robe,0,0.7,0);                         /* the robe's body, under its hem */
  /* THE CLOTH: the hem hangs in four panels from the waist, and the back of the head-cloth
     from the crown; each swings on its hinge (the engine moves them: story/engine.js, clothStep) */
  const cloth=[];
  const panel=(w,h,d,c,px,py,pz,axis,sign)=>{ const pv=new THREE.Group(); pv.position.set(px,py,pz);
    const m=bx(w,h,d,c,0,-h/2,0); pv.add(m); g.add(pv); cloth.push({pv,axis,sign,a:0,w:0,n:axis==='x'?[0,0,sign]:[sign,0,0]}); return pv; };
  panel(0.66,0.56,0.04,robe,0,0.955,0.19,'x',1);  panel(0.66,0.56,0.04,robe,0,0.955,-0.19,'x',-1);
  panel(0.04,0.56,0.38,robe,0.32,0.955,0,'z',1);  panel(0.04,0.56,0.38,robe,-0.32,0.955,0,'z',-1);
  const sash=bx(0.64,0.1,0.38,o.sash||0x6a3b2a,0,0.95,0);
  const head=bx(0.4,0.4,0.4,skin,0,1.82,0);
  const hc=bx(0.46,0.22,0.46,clothC,0,2.02,0);
  const hcb=new THREE.Group(); hcb.position.set(0,2.03,-0.2); hcb.add(bx(0.46,0.46,0.12,clothC,0,-0.23,0));
  cloth.push({pv:hcb,axis:'x',sign:-1,a:0,w:0,n:[0,0,-1],light:true});
  const armL=new THREE.Group(), armR=new THREE.Group();
  armL.position.set(-0.4,1.55,0); armR.position.set(0.4,1.55,0);
  armL.add(bx(0.2,0.7,0.24,robe,0,-0.33,0)); armL.add(bx(0.18,0.16,0.2,skin,0,-0.74,0));
  armR.add(bx(0.2,0.7,0.24,robe,0,-0.33,0)); armR.add(bx(0.18,0.16,0.2,skin,0,-0.74,0));
  if(o.beard) g.add(bx(0.36,0.18,0.08,o.beard,0,1.66,0.2));
  /* THE FACE: eyes, brows and a mouth that opens with the words (Scripture-Game's face.js,
     in blocks). Yahusha has none: His face is never shown (reverent framing). */
  if(!o.holy){
    const fm=c=>new THREE.MeshBasicMaterial({color:c});
    const dark=fm(0x1c120b), lipC=fm(0x3a1810), browC=fm(o.brow||(o.beard&&o.beard!==0x6d6a66?o.beard:0x2a1d14));
    const fb=(w,h,m,x,y,z)=>{ const q=new THREE.Mesh(new THREE.BoxGeometry(w,h,0.012),m); q.position.set(x,y,z); g.add(q); return q; };
    const fz=0.206, mz=o.beard?0.246:fz;
    const eyeL=fb(0.065,0.05,dark,-0.09,1.86,fz), eyeR=fb(0.065,0.05,dark,0.09,1.86,fz);
    const browL=fb(0.1,0.022,browC,-0.09,1.905,fz+0.002), browR=fb(0.1,0.022,browC,0.09,1.905,fz+0.002);
    const mouth=new THREE.Group(); mouth.position.set(0,o.beard?1.715:1.735,mz); g.add(mouth);
    const mIn=new THREE.Mesh(new THREE.BoxGeometry(0.1,1,0.012),lipC); mIn.scale.y=0.018; mIn.position.y=-0.009; mouth.add(mIn);
    const cL=new THREE.Mesh(new THREE.BoxGeometry(0.028,0.018,0.012),lipC), cR=cL.clone(); cL.position.x=-0.062; cR.position.x=0.062; mouth.add(cL,cR);
    g.userData.face={eyeL,eyeR,browL,browR,mouth,mIn,cL,cR,blink:2+Math.random()*4,by:1.905};
  }
  g.add(legL,legR,body,skirt,sash,head,hc,hcb,armL,armR);
  if(o.staff){ const st=bx(0.08,2.2,0.08,C.timber,0.12,-0.2,0.18); armR.add(st); }
  if(o.carry){ const it=bx(0.3,0.36,0.24,o.carry,0,-0.85,0.2); armR.add(it); g.userData.carry=it; }
  if(o.fallen){ const G=W.glow({scene:g},0,1.2,0,3.6,0x785090,0); G.sprite.material.opacity=0.6; g.userData.aura=G;
    const sh=W.glow({scene:g},0,0.05,0,2.4,0x3a2244,0); sh.sprite.material.opacity=0.5; }
  if(o.holy) g.userData.holy=true;
  g.scale.setScalar(s);
  g.userData={legL,legR,armL,armR,phase:Math.random()*6,s,robeMats,cloth,...g.userData};
  ctx.scene.add(g); return g;
};
/* a dove of light — "the Ruach of Aluahim descending like a dove" (Mattithyahu 3:16) */
W.dove=function(ctx,x,y,z){
  const g=new THREE.Group(), m=new THREE.MeshBasicMaterial({color:0xfffdf6});
  const b=(w,h,d,px,py,pz)=>{ const q=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),m); q.position.set(px,py,pz); g.add(q); return q; };
  b(0.16,0.14,0.42,0,0,0); b(0.12,0.12,0.14,0,0.06,0.24); b(0.12,0.04,0.2,0,0.02,-0.28);
  const wl=b(0.5,0.03,0.2,-0.3,0.04,0), wr=b(0.5,0.03,0.2,0.3,0.04,0);
  const G=W.glow({scene:g},0,0,0,2.6,0xfff8e4,0); G.sprite.material.opacity=0.9;
  g.userData.wings=[wl,wr]; g.position.set(x,y,z); ctx.scene.add(g); return g;
};
/* a fishing boat of the lake: planked hull, a thwart, a mast stepped amidships (the
   Kinnereth boat found at Ginosar, 8 m by 2.3) — a group, so it can be moved on the water */
W.boat=function(ctx,x,z,o){ o=o||{};
  const g=new THREE.Group(), m=c=>new THREE.MeshLambertMaterial({color:c});
  const b=(w,h,d,c,px,py,pz)=>{ const q=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),m(c)); q.position.set(px,py,pz); g.add(q); return q; };
  const wood=0x6a4a30, dark=0x4a3220;
  b(2.0,0.25,7.0,dark,0,-0.35,0);                                     /* the bottom */
  b(0.18,0.75,7.0,wood,-1.05,0.05,0); b(0.18,0.75,7.0,wood,1.05,0.05,0);  /* the sides */
  b(2.1,0.75,0.2,wood,0,0.05,3.5); b(1.6,0.9,0.5,wood,0,0.15,3.9);  /* the bow */
  b(2.1,0.75,0.2,wood,0,0.05,-3.5);                                   /* the stern */
  b(2.0,0.1,0.4,0x8a6a48,0,0.2,0.8);                                  /* a thwart */
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
/* a sheep; `lamb` smaller */
W.sheep=function(ctx,x,z,lamb){
  const g=new THREE.Group(), s=lamb?0.62:1, m=c=>new THREE.MeshLambertMaterial({color:c});
  const b=(w,h,d,c,px,py,pz)=>{ const q=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),m(c)); q.position.set(px,py,pz); g.add(q); return q; };
  b(0.7,0.5,1.0,C.wool,0,0.62,0); b(0.32,0.34,0.36,0x3a302a,0,0.8,0.6);
  for(const [a,c] of [[-0.22,-0.32],[0.22,-0.32],[-0.22,0.32],[0.22,0.32]]) b(0.12,0.4,0.12,0x3a302a,a,0.2,c);
  g.scale.setScalar(s); g.position.set(x,0,z); g.rotation.y=Math.random()*6; ctx.scene.add(g);
  g.userData={home:[x,z],t:Math.random()*5}; return g;
};
W.camel=function(ctx,x,z){
  const g=new THREE.Group(), m=c=>new THREE.MeshLambertMaterial({color:c});
  const b=(w,h,d,c,px,py,pz)=>{ const q=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),m(c)); q.position.set(px,py,pz); g.add(q); };
  const tan=0xb89668;
  b(0.9,0.8,2.0,tan,0,1.9,0); b(0.7,0.5,0.8,tan,0,2.45,-0.1); b(0.3,1.0,0.3,tan,0,2.4,1.1); b(0.36,0.34,0.6,tan,0,2.9,1.35);
  for(const [a,c] of [[-0.3,-0.7],[0.3,-0.7],[-0.3,0.7],[0.3,0.7]]) b(0.2,1.5,0.2,0x9a7a52,a,0.75,c);
  b(1.0,0.2,0.9,0x7a2e2a,0,2.35,-0.1);
  g.position.set(x,0,z); ctx.scene.add(g); return g;
};
W.donkey=function(ctx,x,z){
  const g=new THREE.Group(), m=c=>new THREE.MeshLambertMaterial({color:c});
  const b=(w,h,d,c,px,py,pz)=>{ const q=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),m(c)); q.position.set(px,py,pz); g.add(q); };
  const gr=0x7d7468; b(0.55,0.55,1.2,gr,0,1.0,0); b(0.3,0.5,0.5,gr,0,1.3,0.7); b(0.08,0.3,0.06,gr,-0.08,1.65,0.7); b(0.08,0.3,0.06,gr,0.08,1.65,0.7);
  for(const [a,c] of [[-0.18,-0.45],[0.18,-0.45],[-0.18,0.45],[0.18,0.45]]) b(0.12,0.75,0.12,0x5e574d,a,0.37,c);
  g.position.set(x,0,z); ctx.scene.add(g); return g;
};

/* ================= THE SKY ================= */
/* a dome whose colours follow the hour, and the stars for the night */
W.sky=function(ctx){
  const g=new THREE.SphereGeometry(900,32,16), cols=[];
  for(let k=0;k<g.attributes.position.count;k++) cols.push(1,1,1);
  g.setAttribute('color',new THREE.Float32BufferAttribute(cols,3));
  const m=new THREE.Mesh(g,new THREE.MeshBasicMaterial({vertexColors:true,side:THREE.BackSide,fog:false,depthWrite:false}));
  ctx.scene.add(m);
  const sp=[]; for(let k=0;k<1400;k++){ const u=Math.random()*2-1, t=Math.random()*Math.PI*2, r=880;
    const y=Math.abs(u)*r; const rr=Math.sqrt(1-u*u)*r; sp.push(Math.cos(t)*rr,y,Math.sin(t)*rr); }
  const sg=new THREE.BufferGeometry(); sg.setAttribute('position',new THREE.Float32BufferAttribute(sp,3));
  const stars=new THREE.Points(sg,new THREE.PointsMaterial({color:0xffffff,size:1.6,sizeAttenuation:false,transparent:true,fog:false,depthWrite:false}));
  ctx.scene.add(stars);
  const paint=(top,hor)=>{ const P=g.attributes.position, C2=g.attributes.color, a=new THREE.Color(top), b=new THREE.Color(hor);
    for(let k=0;k<P.count;k++){ const t=Math.max(0,Math.min(1,P.getY(k)/500)); const c=b.clone().lerp(a,Math.pow(t,0.6)); C2.setXYZ(k,c.r,c.g,c.b); }
    C2.needsUpdate=true; };
  return {mesh:m,stars,paint};
};
})();
