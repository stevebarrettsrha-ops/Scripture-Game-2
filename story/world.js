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
Static.prototype.ground=function(x,z){ const pd=this.api.inPadL(x,z);
  return pd?(pd.ty!==undefined?(pd.ty*window.__KIT.B-this.api.baseY)/this.api.S:0):this.api.groundY(x,z); };
Static.prototype.box=function(x0,y0,z0,x1,y1,z1,color,opt){
  opt=opt||{};
  if(x1<x0){ const t=x0; x0=x1; x1=t; } if(z1<z0){ const t=z0; z0=z1; z1=t; } if(y1<y0){ const t=y0; y0=y1; y1=t; }
  const cx=(x0+x1)/2, cz=(z0+z1)/2, g=opt.abs?0:this.ground(cx,cz);
  /* a thing laid ON the ground — a path, a floor, cloth spread to dry — is the ground's top course */
  if(!opt.detail&&y1-y0<0.3&&y1<=0.35&&y0>=-0.05&&Math.max(x1-x0,z1-z0)>=0.6){ this.api.top(x0,z0,x1,z1,color); return; }
  /* too small to be a block: kept as a little thing of the scene */
  const span=Math.max(x1-x0,z1-z0);
  /* an awning, a beam, a lintel of a shelter — a thin thing above the ground is drawn, not laid
     as a course of blocks a man would have to stoop under */
  const thinAbove=y1-y0<0.32&&y0>0.6;
  if(opt.detail||span<0.4||(opt.collide===false&&span<0.6)||thinAbove){ this.detail(x0,y0+g,z0,x1,y1+g,z1,typeof color==='number'?color:0x7c7a4e,opt); return; }
  /* ---- AND WHAT STANDS ON THE GROUND STANDS ON IT ALL ALONG ----
     A box was set on the ground at its MIDDLE, so on a slope its downhill side hung and its uphill side
     was buried; a fixed set (abs) had no footing at all, and the upper room floated over Zion. A box
     laid from the ground up (y0 at its own ground, or at the set's level for a fixed set) is footed
     down to the land under the whole of itself; a lintel, a roof or a beam (laid higher) is not.
     `foot:false` opts out, `foot:true` asks for it at any height. (An `abs` box is measured from the set's
     level, so it is footed only where it stands at its OWN ground: an olive's crown laid on low ground was
     below the set's level, and every leaf became a pillar to the earth. A fixed set asks for its own feet.) */
  const foot=opt.foot!==undefined?opt.foot:(color!=='air'&&(opt.abs?y0<=this.ground(cx,cz)+0.3:y0<=0.3));
  this.api.box(x0,y0+g,z0,x1,y1+g,z1,color,foot?{foot:true}:undefined);
};
/* the little things, gathered into one mesh a scene, shaded by the way each face looks */
Static.prototype.detail=function(x0,y0,z0,x1,y1,z1,color,opt){
  opt=opt||{};
  /* (and kept, so a body is not walked through it: the engine keeps those standing on the floor
     at a knee's height and more — a table, a bench, a jar, a palm's foot; `walk` for one that is not) */
  if(!opt.walk) this.colliders.push([x0,y0,z0,x1,y1,z1]);
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
  if(f>0) api.pad(-f,-f,f,f,{round:true,top,blend:o.blend});           /* (`blend`: how far its edge is eased into the land, in blocks) */
  for(const p of [].concat(o.peak||[])) api.mound(p.x,p.z,p.h,p.r,{top});
  return null;   /* ctx.groundY stays the engine's: it looks for the floor under a man, not the roof over him */
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
  /* (in the world's courses: the posts carry the straw roof above the third course, so a man
     stands under it with room to spare and an eye can be set beneath it) */
  for(const [a,b] of [[-2.8,-2],[2.8,-2],[-2.8,2],[2.8,2]]) S.box(x+a-0.3,0,z+b-0.3,x+a+0.3,3.3,z+b+0.3,C.timber);
  S.box(x-3.2,3.3,z-2.5,x+3.2,3.9,z+2.3,'thatch');                             /* the roof of straw */
  S.box(x-3.1,0,z-2.6,x+3.1,1.7,z-2.0,C.stone);                               /* back wall */
  S.box(x-0.8,0,z-0.4,x+0.8,0.55,z+0.4,C.stone);                               /* the trough */
  S.detail(x-0.65,0.5,z-0.28,x+0.65,0.62,z+0.28,C.hay);                        /* straw in it */
  S.box(x+1.8,0,z-1.8,x+2.7,0.9,z-0.9,'hay');                                  /* fodder */
};
W.fold=function(S,x,z,r){                     /* a sheepfold of stacked stone, open on +z */
  for(let a=0;a<28;a++){ const t=a/28*Math.PI*2; if(Math.abs(t-Math.PI/2)<0.35) continue;
    const px=x+Math.cos(t)*r, pz=z+Math.sin(t)*r;
    S.box(px-0.55,0,pz-0.55,px+0.55,1.1,pz+0.55,C.rock); }
};
/* AN OLIVE: a short twisted trunk and a low grey-green crown, as the voyage grows its trees */
/* AN OLIVE, built of the world's blocks as the great olives of the block-builders are (the user's
   examples): a thick twisted bole of olive timber, flared and rooted at the foot, splitting into
   limbs that step out and up a block at a time, and on each limb a ragged clump of olive leaf —
   grey-green, the light through it — the clumps together making one broad, uneven crown.
   `s` scales it (1: some 8 blocks across and 7 high). Every piece is one block, laid on the ground
   where the tree stands (`abs`), so a tree on a slope stays whole. */
W.olive=function(S,x,z,s){ s=s||1; const P=S.api, Bw=K().B, c=Bw/P.S, gy=S.ground(x,z), A={abs:true}, h=c*0.3;
  /* each piece set on the centre of one cell of the world, so it fills that one block and no more */
  const snap=(v,o,sc)=>((Math.floor((o+v*sc)/Bw)+0.5)*Bw-o)/sc;
  const blk=(bx,by,bz,id)=>{ const px=snap(x+bx*c,P.ax,P.S), py=snap(gy+(by+0.5)*c,P.baseY,P.S), pz=snap(z+bz*c,P.az,P.S);
    S.box(px-h,py-h,pz-h,px+h,py+h,pz+h,id,A); };
  const H=(a,b)=>hash(x*1.7+a*3.1,z*2.3+b*5.7);
  /* the bole: two blocks square, three high; its flared foot and roots */
  const th=Math.max(2,Math.round(3*s));
  for(let y=0;y<th;y++) for(const [dx,dz] of [[0,0],[1,0],[0,1],[1,1]]) blk(dx,y,dz,'log-olive');
  for(const [dx,dz] of [[-1,0],[2,1],[0,2],[1,-1]]) if(H(dx,dz)<0.8) blk(dx,0,dz,'log-olive');
  for(const [dx,dz] of [[-1,1],[2,0]]) if(H(dz,dx)<0.5) blk(dx,1,dz,'log-olive');
  /* the limbs: two to four, each stepping out a block and up a block, then up */
  const n=2+Math.floor(H(9,9)*2.99), a0=H(1,7)*6.283, ends=[];
  for(let k=0;k<n;k++){ const a=a0+k*6.283/n+(H(k,3)-0.5)*0.8, dx=Math.cos(a), dz=Math.sin(a);
    let px=0.5, pz=0.5, py=th; const reach=Math.round((2+H(k,5)*1.6)*s);
    for(let j=0;j<reach;j++){ px+=dx; pz+=dz; if(j%2===0) py++; blk(Math.round(px),py,Math.round(pz),'log-olive'); }
    blk(Math.round(px),py+1,Math.round(pz),'log-olive');
    ends.push([Math.round(px),py+1,Math.round(pz)]); }
  ends.push([0.5,th+2,0.5]);                                                        /* and the heart of the crown over the bole */
  /* the clumps of leaf about each limb's end: a flattened heap, ragged at its edge */
  const R=2.3*s, RY=1.3*s, done=new Set();
  ends.forEach(([ex,ey,ez],k)=>{ const r=k===ends.length-1?R*0.9:R;
    for(let by=-1;by<=2;by++) for(let bx=-3;bx<=3;bx++) for(let bz=-3;bz<=3;bz++){
      const d=(bx*bx+bz*bz)/(r*r)+((by-0.4)*(by-0.4))/(RY*RY); if(d>1) continue;
      if(d>0.55&&H(bx+ex*7+k,bz+by*13+ez)<0.35) continue;                        /* the edge broken up, the sky through it */
      if(d<=0.55&&H(bz+ex*5+k,bx+by*11+ez)<0.34) continue;                   /* and holes through the crown, for the sun to come through */
      const X=Math.round(ex+bx), Y=Math.round(ey+by), Z=Math.round(ez+bz), key=X+','+Y+','+Z; if(done.has(key)) continue; done.add(key);
      blk(X,Y,Z,'leaves-olive'); } });
};
/* A FIG: a short trunk and a broad, low crown of big leaves, shade enough to sit under
   (Yahuchanon 1:48, "when you were under the fig tree") */
W.fig=function(S,x,z){
  S.box(x-0.35,0,z-0.35,x+0.35,2.9,z+0.35,'log');
  S.box(x-2.7,2.8,z-2.5,x+2.6,3.7,z+2.6,'leaves');
  S.box(x-1.8,3.6,z-1.7,x+1.8,4.4,z+1.8,'leaves'); };
/* THE DATE PALM: a trunk that leans a little as it climbs, a crown of fronds reaching out and
   bowing at their tips, and the dates hanging in clusters under them */
/* A FIELD OF WHEAT, white for harvest (Yahuchanon 4:35): not blocks but the plant itself — a
   jointed stalk, two narrow leaves drying on it, and at the top the ear of paired grains with
   its bristling beards, nodding over with its own weight; three stalks to a tuft, each a little
   other in height and lean, and the whole field swaying with the wind. Drawn as one shape set
   down a few thousand times (an instanced mesh), so a field costs no more than a house.
   `test(x,z)` keeps a place clear (a path, a swath already reaped). */
function wheatTuft(seed){
  const P=[], C=[], N=[], I=[];
  const R=(k)=>hash(seed*13.1+k,seed*7.7-k);
  const quad=(a,b,c,d,col)=>{ const n=new THREE.Vector3().subVectors(b,a).cross(new THREE.Vector3().subVectors(d,a)).normalize(), o=P.length/3;
    for(const v of [a,b,c,d]){ P.push(v.x,v.y,v.z); N.push(n.x,n.y,n.z); C.push(col.r,col.g,col.b); }
    I.push(o,o+1,o+2,o,o+2,o+3); };
  /* a box along a line from p to q, `w` thick (`t` deep): the stalk's lengths, the grains */
  const bar=(p,q,w,t,hex)=>{ const col=new THREE.Color(hex), d=new THREE.Vector3().subVectors(q,p), up=Math.abs(d.y)>0.9*d.length()?new THREE.Vector3(1,0,0):new THREE.Vector3(0,1,0);
    const s=new THREE.Vector3().crossVectors(d,up).normalize().multiplyScalar(w/2), u=new THREE.Vector3().crossVectors(s,d).normalize().multiplyScalar((t||w)/2);
    const c=[p.clone().sub(s).sub(u),p.clone().add(s).sub(u),p.clone().add(s).add(u),p.clone().sub(s).add(u)], e=c.map(v=>v.clone().add(d));
    quad(c[0],c[1],e[1],e[0],col); quad(c[1],c[2],e[2],e[1],col);
    if((t||w)>0.008){ quad(c[2],c[3],e[3],e[2],col); quad(c[3],c[0],e[0],e[3],col); } };     /* (a hair-thin beard or a blade of leaf: two faces are enough, drawn both sides) */
  for(let k=0;k<3;k++){
    const ox=(R(k*5)-0.5)*0.09, oz=(R(k*5+1)-0.5)*0.09, h=0.82+R(k*5+2)*0.3, lean=0.05+R(k*5+3)*0.1, dir=R(k*5+4)*6.28;
    const lx=Math.cos(dir), lz=Math.sin(dir);
    const at=(t)=>new THREE.Vector3(ox+lx*lean*h*t*t, h*t, oz+lz*lean*h*t*t);            /* the stalk bows a little more as it rises */
    const stalk=[0xc8ae64,0xbfa55c,0xd2b870][k%3];
    let prev=at(0); for(const t of [0.4,0.75,1.0]){ const nx=at(t); bar(prev,nx,0.011,0.011,stalk); prev=nx; }
    /* two leaves from the lower joints, long and narrow, falling away from the stalk */
    for(const [t,a] of [[0.4,dir+2.4],[0.75,dir-2.0]]){ const b=at(t), out=new THREE.Vector3(Math.cos(a),0,Math.sin(a));
      const m=b.clone().addScaledVector(out,0.12).add(new THREE.Vector3(0,0.06,0)), e=b.clone().addScaledVector(out,0.24).add(new THREE.Vector3(0,-0.04,0));
      bar(b,e.clone().lerp(m,0.4),0.02,0.003,0xb09656); }
    /* the ear: nodding over from the top of the stalk, paired grains up it, the beards standing out */
    const top=at(1), nod=new THREE.Vector3(lx*0.55,0.83,lz*0.55).normalize(), side=new THREE.Vector3(-lz,0,lx);
    const L=0.1;
    for(let g=0;g<5;g++){ const c=top.clone().addScaledVector(nod,0.012+g*L/5), sd=g%2?1:-1;
      const a=c.clone().addScaledVector(side,sd*0.006), b=a.clone().addScaledVector(nod,0.022).addScaledVector(side,sd*0.004);
      bar(a,b,0.016,0.012,[0xe6c97c,0xdcbc6a][g%2]);
      if(g%2===0){ const aw=b.clone().addScaledVector(nod,0.11).addScaledVector(side,sd*0.035); bar(b,aw,0.003,0.003,0xd8c486); } }
    bar(top.clone().addScaledVector(nod,L+0.01),top.clone().addScaledVector(nod,L+0.13),0.003,0.003,0xd8c486);   /* the beard at the tip */
  }
  const geo=new THREE.BufferGeometry();
  geo.setAttribute('position',new THREE.Float32BufferAttribute(P,3)); geo.setAttribute('normal',new THREE.Float32BufferAttribute(N,3));
  geo.setAttribute('color',new THREE.Float32BufferAttribute(C,3)); geo.setIndex(I); return geo; }
W.wheatField=function(ctx,area,o){ o=o||{};
  const [x0,z0,x1,z1]=area, n=o.n||2400, test=o.test||(()=>true), mats=[];
  const mat=new THREE.MeshLambertMaterial({vertexColors:true,side:THREE.DoubleSide});
  /* the wind through it: each tuft bends from its foot, the more the higher, in a wave across the field */
  const U={uWT:{value:0}};
  mat.onBeforeCompile=sh=>{ sh.uniforms.uWT=U.uWT; sh.vertexShader='uniform float uWT;\n'+sh.vertexShader.replace('#include <begin_vertex>',
    '#include <begin_vertex>\n  { vec3 ip=vec3(instanceMatrix[3][0],0.0,instanceMatrix[3][2]); float ph=uWT*1.6+ip.x*0.35+ip.z*0.22;\n'+
    '    float b=(sin(ph)*0.6+sin(ph*2.3+ip.z)*0.25)*0.07*transformed.y*transformed.y; transformed.x+=b; transformed.z+=b*0.4; }'); };
  const kinds=[wheatTuft(1),wheatTuft(2),wheatTuft(3)], meshes=kinds.map(g=>new THREE.InstancedMesh(g,mat,Math.ceil(n/3)+4)), count=[0,0,0];
  const m4=new THREE.Matrix4(), q=new THREE.Quaternion(), e=new THREE.Euler(), sc=new THREE.Vector3();
  for(let k=0;k<n*3&&count.reduce((a,b)=>a+b,0)<n;k++){
    const x=x0+hash(k,31)*(x1-x0), z=z0+hash(k,37)*(z1-z0); if(!test(x,z)) continue;
    const v=k%3; if(count[v]>=meshes[v].count) continue;
    e.set(0,hash(k,41)*6.28,0); q.setFromEuler(e); const s=0.9+hash(k,43)*0.22; sc.set(s,s,s);
    m4.compose(new THREE.Vector3(x,ctx.groundY?ctx.groundY(x,z)||0:0,z),q,sc); meshes[v].setMatrixAt(count[v]++,m4); }
  const g=new THREE.Group();
  meshes.forEach((m,i)=>{ m.count=count[i]; m.instanceMatrix.needsUpdate=true; m.frustumCulled=false; g.add(m); });
  ctx.scene.add(g); (ctx.tickers=ctx.tickers||[]).push(dt=>{ U.uWT.value+=dt; });
  return g; };
/* a sheaf the reapers have bound and laid down behind them: a bundle of stalks tied about the
   middle, the ears all at one end */
W.sheaf=function(ctx,x,z,ry){
  const g=new THREE.Group(), M=c=>new THREE.MeshLambertMaterial({color:c});
  for(let i=0;i<9;i++){ const a=i/9*6.28, r=0.05+(i%3)*0.02;
    const s=new THREE.Mesh(new THREE.BoxGeometry(0.016,0.016,0.78),M(0xc8ae64)); s.position.set(Math.cos(a)*r,0.08+Math.sin(a)*r*0.6,0); g.add(s);
    const ear=new THREE.Mesh(new THREE.BoxGeometry(0.03,0.03,0.12),M(0xe2c478)); ear.position.set(Math.cos(a)*r*1.3,0.08+Math.sin(a)*r*0.8,0.44); g.add(ear); }
  const band=new THREE.Mesh(new THREE.BoxGeometry(0.2,0.16,0.05),M(0x9a8448)); band.position.set(0,0.08,-0.02); g.add(band);
  g.position.set(x,ctx.groundY?ctx.groundY(x,z)||0:0,z); g.rotation.y=ry||0; ctx.scene.add(g); return g; };
W.palm=function(S,x,z){
  const y0=S.ground(x,z), h=5.2+hash(x,z)*2.4, lean=(hash(z,x)-0.5)*1.1, la=hash(x*1.7,z)*6.28, lx=Math.cos(la)*lean, lz=Math.sin(la)*lean;
  /* the trunk: slim, ringed where the old fronds were cut, leaning as it climbs */
  const seg=14; for(let i=0;i<seg;i++){ const t0=i/seg, t1=(i+1)/seg, ox=lx*t0*t0, oz=lz*t0*t0, w=0.24-0.05*t0;
    S.detail(x+ox-w,y0+h*t0,z+oz-w,x+ox+w,y0+h*t1,z+oz+w,i%2?0x6a5038:0x5a4430,{jitter:0.08}); }
  const tx=x+lx, tz=z+lz, ty=y0+h;
  S.detail(tx-0.3,ty-0.1,tz-0.3,tx+0.3,ty+0.45,tz+0.3,0x4e6a2c);
  /* the fronds: each an arch of leaflets, rising from the crown and bowing to the tip */
  const N=8;
  for(let k=0;k<N;k++){ const a=k/N*Math.PI*2+hash(x+k,z)*0.5, ca=Math.cos(a), sa=Math.sin(a), L=2.8+hash(k,x)*0.9, up=0.5+hash(z,k)*0.5;
    for(let d=0.3;d<=L;d+=0.34){ const t=d/L, y=ty+0.2+up*Math.sin(Math.PI*t*0.8)-1.5*t*t, px=tx+ca*d, pz=tz+sa*d, g=[0x5e7a32,0x6d8a3a,0x55702c][k%3];
      S.detail(px-0.09,y-0.05,pz-0.09,px+0.09,y+0.05,pz+0.09,g);
      const w=0.42*(1-t*0.6), sx=-sa*w, sz=ca*w;                                                 /* the leaflets either side */
      S.detail(px+sx-0.07,y-0.18*t-0.04,pz+sz-0.07,px+sx+0.07,y-0.18*t+0.03,pz+sz+0.07,g);
      S.detail(px-sx-0.07,y-0.18*t-0.04,pz-sz-0.07,px-sx+0.07,y-0.18*t+0.03,pz-sz+0.07,g); } }
  for(let k=0;k<3;k++){ const a=k*2.1+0.5; S.detail(tx+Math.cos(a)*0.38-0.14,ty-0.7,tz+Math.sin(a)*0.38-0.14,tx+Math.cos(a)*0.38+0.14,ty-0.15,tz+Math.sin(a)*0.38+0.14,0xc0702a); }   /* the dates */
};
/* ---- THE LIFE OF THE WATERS: "let the waters swarm with swarms of living beings" (Bereshith 1:20) ----
   Small things, each one mesh: the fish of the lake and the river (the musht of Galil, silver and
   olive), a frog of the reeds, a dragonfly, the white egret that stands in the shallows, a pond
   turtle. The engine sets them about the water and keeps them going (story/engine.js, lifeTick). */
const LIFE_M={};
const lm=(c,o)=>{ const k=c+(o?'t':''); return LIFE_M[k]||(LIFE_M[k]=new THREE.MeshLambertMaterial(Object.assign({color:c},o||{}))); };
const lb=(g,w,h,d,c,x,y,z,o)=>{ const q=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),lm(c,o)); q.position.set(x,y,z); g.add(q); return q; };
W.creature=function(ctx,kind){
  const g=new THREE.Group(); const u=g.userData;
  if(kind==='fish'){ const f=W.voyageFish(); if(f){ g.add(f); u.body=f; } }                     /* the voyage's own fish */
  else if(kind==='frog'){ lb(g,0.15,0.07,0.18,0x4e7a30,0,0.05,0); lb(g,0.11,0.05,0.07,0x5c8a38,0,0.08,0.08);
    lb(g,0.03,0.03,0.03,0xd8c040,0.045,0.11,0.1); lb(g,0.03,0.03,0.03,0xd8c040,-0.045,0.11,0.1);
    lb(g,0.05,0.04,0.12,0x46702c,0.09,0.03,-0.04); lb(g,0.05,0.04,0.12,0x46702c,-0.09,0.03,-0.04); }
  else if(kind==='fly'){ lb(g,0.03,0.03,0.2,[0x2a5ad0,0xc03a2a,0x2a9a6a][Math.floor(Math.random()*3)],0,0,0);
    u.wings=[lb(g,0.32,0.004,0.06,0xe8f0ff,0,0.02,0.03,{transparent:true,opacity:0.55}),lb(g,0.26,0.004,0.05,0xe8f0ff,0,0.02,-0.03,{transparent:true,opacity:0.55})]; }
  else if(kind==='egret'){ lb(g,0.22,0.22,0.42,0xf4f2ec,0,0.72,0); u.neck=new THREE.Group(); u.neck.position.set(0,0.8,0.16); g.add(u.neck);
    lb(u.neck,0.05,0.34,0.05,0xf4f2ec,0,0.17,0.04); lb(u.neck,0.07,0.07,0.1,0xf4f2ec,0,0.36,0.08); lb(u.neck,0.025,0.025,0.14,0xd8b030,0,0.35,0.19);
    lb(g,0.025,0.6,0.025,0x2a2a2a,0.05,0.3,0); lb(g,0.025,0.6,0.025,0x2a2a2a,-0.05,0.3,0); lb(g,0.18,0.03,0.22,0xe8e6e0,0,0.7,-0.24); }
  else if(kind==='turtle'){ lb(g,0.3,0.12,0.36,0x4a4a2a,0,0.08,0); lb(g,0.24,0.06,0.3,0x5a5a34,0,0.16,0); lb(g,0.08,0.06,0.1,0x6a6a3a,0,0.06,0.22);
    for(const [x,z] of [[0.15,0.12],[-0.15,0.12],[0.15,-0.12],[-0.15,-0.12]]) lb(g,0.07,0.04,0.07,0x6a6a3a,x,0.02,z); }
  u.kind=kind; ctx.scene.add(g); return g;
};
/* the life of a water, to be set about it once the set is laid: `at` [x,z] and `r` the reach to look
   for water in, `y` its face; how many of each */
/* THE FISH ARE THE VOYAGE'S OWN: the musht of the lake (a silver-grey of the `fish` file), the
   little Kinneret sardine and the catfish in its mud; each made by the voyage's creature files,
   at its true size, nose to +z */
const FISH_KINDS=[['fish',0x9aa6a0],['fish',0x7a8a80],['fish',0xa8b0a0],['sardine'],['sardine'],['catfish']];
W.voyageFish=function(pick){ const k=K(); if(!k.makeFish) return null;
  const F=pick||FISH_KINDS[Math.floor(Math.random()*FISH_KINDS.length)], m=k.makeFish(F[0],F[1]); if(!m) return null;
  m.scale.multiplyScalar(1/k.setScale); return m; };
W.waterLife=function(ctx,o){ (ctx.lifeSpecs=ctx.lifeSpecs||[]).push(o); };
/* THE PEOPLE OF THE PLACE, about their day: not the ones the story speaks of, but the town they
   live in — women going down to the spring and coming up with the jar on the head (Bereshith
   24:11, Yahuchanon 4:7), a man carrying a jar of water through the street (Marqos 14:13), grinding
   at the mill (Mattithyahu 24:41), the fishers washing and mending their nets (Luqas 5:2, Marqos
   1:19), the sower and the ploughman (Luqas 8:5, 9:62), children calling to one another in the
   market-places (Mattithyahu 11:16), sellers at their tables, travellers on the road with an ass.
   A set lays down what its people do and where; the engine raises them (spawnFolk) and keeps
   them at it, out of the way of the ones the scene is about. `o.folk` the people they are
   (yasharal, greek, roman, north). Each entry's `do` is one of:
     walk   {path:[[x,z]…], n, donkey}   travellers along a way, to and fro
     stroll {area:[x0,z0,x1,z1], n}      going about the town between its places
     water  {from:[x,z], to:[[x,z]…], n} down to the spring with a jar, home with it on the head
     carry  {from, to, n, load}          a load (basket · sack · wood) from one place to another
     grind · mend · spin · wash · sweep · hoe · reap · hammer · pick · sell {at:[x,z], face, goods}
     talk   {at, n}                      a few standing together, talking
     play   {at, r, n}                   children running in a game
     herd   {at, r}                      a shepherd going about his flock, the staff in hand
     plough {from, to}                   a man behind an ox, up and down a furrow */
/* the step before a house's door (`side` as W.house has it), where its people come and go */
W.door=function(x,z,w,d,side){ const o=1.2; return side==='n'?[x,z-d/2-o]:side==='e'?[x+w/2+o,z]:side==='w'?[x-w/2-o,z]:[x,z+d/2+o]; };
W.folk=function(ctx,list,o){ for(const s of list) (ctx.folkSpecs=ctx.folkSpecs||[]).push(Object.assign({},o||{},s)); };
/* the things in their hands, built small and held at the hand (or on the head) */
W.prop=function(kind){
  const g=new THREE.Group(), M=c=>new THREE.MeshLambertMaterial({color:c});
  const bx=(w,h,d,c,x,y,z)=>{ const q=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),M(c)); q.position.set(x,y,z); g.add(q); return q; };
  const cy=(r0,r1,h,c,x,y,z,seg)=>{ const q=new THREE.Mesh(new THREE.CylinderGeometry(r0,r1,h,seg||9),M(c)); q.position.set(x,y,z); g.add(q); return q; };
  if(kind==='jar'){ cy(0.07,0.12,0.26,0xa8643a,0,0.13,0); cy(0.05,0.07,0.08,0x9a5a34,0,0.3,0); cy(0.11,0.07,0.06,0x8a5030,0,0.02,0); }
  else if(kind==='basket'){ cy(0.2,0.15,0.2,0xa88a50,0,0.1,0,10); cy(0.17,0.17,0.04,0x8a4a3a,0,0.2,0,10); }
  else if(kind==='sack'){ bx(0.3,0.22,0.5,0xc8b48a,0,0.11,0); bx(0.1,0.08,0.1,0xb8a07a,0,0.24,0.2); }
  else if(kind==='wood'){ for(let i=0;i<4;i++){ const q=cy(0.035,0.035,0.8,0x6a4a2a,-0.09+i*0.06,0.04+(i%2)*0.05,0,6); q.rotation.x=Math.PI/2; } }
  else if(kind==='broom'){ cy(0.016,0.016,1.1,0x7a5a30,0,-0.45,0,5); bx(0.16,0.2,0.05,0xb89a5a,0,-1.05,0); }
  else if(kind==='hoe'){ cy(0.018,0.018,1.15,0x6a4a2a,0,-0.42,0,5); bx(0.16,0.2,0.04,0x4a4a4a,0,-0.98,0.09); }   /* the blade set across the haft, edge down */
  else if(kind==='hammer'){ cy(0.016,0.016,0.32,0x6a4a2a,0,-0.12,0,5); bx(0.06,0.06,0.13,0x4a4a4a,0,-0.28,0); }
  else if(kind==='spindle'){ cy(0.008,0.008,0.3,0x8a6a40,0,-0.15,0,4); cy(0.04,0.04,0.02,0xd8ceb4,0,-0.26,0,8); }
  else if(kind==='quern'){ cy(0.3,0.34,0.14,0x7a7468,0,0.07,0,12); cy(0.26,0.26,0.08,0x8a8478,0,0.18,0,12); bx(0.03,0.16,0.03,0x6a4a2a,0.18,0.28,0); }
  else if(kind==='net'){ bx(1.1,0.08,0.7,0x8a7a5a,0,0.04,0); for(let i=0;i<4;i++) cy(0.03,0.03,0.04,0xd8c890,-0.4+i*0.27,0.09,0.3,6); }
  else if(kind==='wash'){                                                                 /* a flat stone at the water's edge, a garment wet on it, a bundle waiting */
    const col=[0x8a3a3a,0x3a4a8a,0xd8ceb4,0x6a5a2a,0x5a6a4a][Math.floor(Math.random()*5)];
    bx(0.62,0.1,0.44,0x8e877a,0,0.05,0); bx(0.5,0.08,0.38,0x7a7266,0.04,0.02,0.03);
    const wet=new THREE.Color(col).multiplyScalar(0.8).getHex();
    bx(0.46,0.04,0.3,wet,0,0.12,0); bx(0.3,0.05,0.18,wet,-0.06,0.155,-0.04); bx(0.12,0.04,0.32,wet,0.2,0.08,0.02).rotation.z=-0.6;   /* the garment, rucked and hanging over the edge */
    bx(0.24,0.12,0.2,0xe0d8c0,-0.42,0.06,0.2); bx(0.2,0.08,0.18,col,-0.42,0.15,0.2); }                                          /* the bundle of washing still to do */
  else if(kind==='plough'){                                                               /* the ard: a share in the earth, the handle to his hands, the long beam forward to the yoke on the ox's neck */
    const beam=new THREE.Mesh(new THREE.BoxGeometry(0.07,0.07,3.3),M(0x6a4a2a)); beam.position.set(0,0.62,1.95); beam.rotation.x=-Math.atan2(0.85,3.3); g.add(beam);
    const hd=bx(0.05,0.85,0.05,0x6a4a2a,0,0.42,0.25); hd.rotation.x=-0.5;                 /* the stilt up to the hand */
    bx(0.04,0.04,0.3,0x6a4a2a,0,0.78,0.08);                                              /* its grip */
    bx(0.07,0.07,0.42,0x5a3a20,0,0.06,0.42); bx(0.06,0.05,0.2,0x4a4a4a,0,0.03,0.7);      /* the sole, the iron share */
    bx(1.0,0.08,0.1,0x6a4a2a,0,1.08,3.55); for(const sx of [-1,1]) bx(0.05,0.3,0.05,0x6a4a2a,sx*0.3,0.95,3.55); }   /* the yoke over the neck, its pegs */
  else if(kind==='sickle'){ cy(0.016,0.016,0.22,0x6a4a2a,0,-0.08,0,5); const q=new THREE.Mesh(new THREE.TorusGeometry(0.14,0.014,4,10,Math.PI*1.1),M(0x8a8a8a)); q.position.set(0,-0.22,0.12); q.rotation.y=Math.PI/2; g.add(q); }
  else if(kind==='tree'){ cy(0.02,0.02,1.7,0x6a4a2a,0,-0.6,0,5); }
  return g; };
/* A FISH laid out to sell (the musht of the lake, Luqas 5:6): a deep body tapering to the tail,
   a forked tail-fin, the fin along the back, a pale belly, a dark eye — lying on its side */
W.fishProp=function(col,x,y,z,ry){
  const g=new THREE.Group(), f=W.voyageFish(col===0x7a8a80?['fish',0x7a8a80]:['fish',0x9aa6a0]);
  if(f){ f.scale.multiplyScalar(0.6); g.add(f); }                                     /* a musht, a hand and a half long, laid out on its side */
  g.rotation.z=Math.PI/2; g.rotation.y=ry||0; const h=new THREE.Group(); h.add(g); h.position.set(x,y+0.02,z); return h; };
/* A SELLER'S TABLE in the street: a board on trestles under an awning, its goods laid out —
   loaves, fruit, pots, cloth, fish or doves */
W.stall=function(ctx,x,z,face,goods){
  const g=new THREE.Group(), M=c=>new THREE.MeshLambertMaterial({color:c});
  const bx=(w,h,d,c,px,py,pz)=>{ const q=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),M(c)); q.position.set(px,py,pz); g.add(q); return q; };
  bx(1.6,0.06,0.7,0x7a5a3a,0,0.78,0); for(const sx of [-0.7,0.7]) for(const sz of [-0.28,0.28]) bx(0.06,0.76,0.06,0x5a3a22,sx,0.38,sz);
  for(const sx of [-0.8,0.8]) bx(0.05,2.1,0.05,0x5a3a22,sx,1.05,-0.45);
  const aw=bx(1.9,0.03,1.1,[0xd8ceb4,0x9a5a3a,0x5a6a8a,0xc8a050][(Math.abs(Math.round(x*7+z*3)))%4],0,2.0,0.05); aw.rotation.x=0.22;
  const G={bread:[0xc89a5a,0xb8864a],fruit:[0x8a2a4a,0x5a7a2a,0xd8a030],pots:[0xa8643a,0x9a5a34,0xb87448],cloth:[0x8a3a3a,0x3a4a8a,0xd8ceb4,0x6a5a2a],fish:[0x9aa6a0,0x7a8a80],doves:[0xf2f0ea,0xdad6ce]}[goods||'bread']||[0xc89a5a];
  for(let i=0;i<9;i++){ const c=G[i%G.length], px=-0.6+(i%5)*0.3, pz=i<5?-0.15:0.15;
    if(goods==='pots') { const q=new THREE.Mesh(new THREE.CylinderGeometry(0.06,0.09,0.18,8),M(c)); q.position.set(px,0.9,pz); g.add(q); }
    else if(goods==='cloth') bx(0.28,0.08,0.28,c,px,0.85+(i%3)*0.04,pz);
    else if(goods==='fish') g.add(W.fishProp(c,px,0.84,pz,(i%2?0.3:-0.25)));
    else if(goods==='doves') { bx(0.24,0.18,0.24,0x8a7a5a,px,0.9,pz); bx(0.1,0.08,0.14,c,px,0.92,pz); }
    else { const q=new THREE.Mesh(new THREE.SphereGeometry(goods==='bread'?0.1:0.07,8,6),M(c)); q.scale.y=goods==='bread'?0.55:1; q.position.set(px,0.86,pz); g.add(q); } }
  g.position.set(x,ctx.groundY?ctx.groundY(x,z)||0:0,z); g.rotation.y=face||0; ctx.scene.add(g); return g; };
/* AN OASIS (Acts 8:36, "they came to some water"): a pool in a hollow of the desert where a spring
   rises — its edge not drawn with a rule but wandering; shallow at the edge and deep in the middle,
   a ring of grass and dark earth about it where nothing else grows green, stones along its lip,
   reeds and rushes standing in the shallows, lilies on the water, flowers in the grass, date
   palms and an acacia leaning over it, and great boulders the water has rounded. */
W.oasis=function(ctx,S,cx,cz,R,o){ o=o||{};
  const ph=hash(cx,cz)*6.28, rr=a=>R*(1+0.16*Math.sin(3*a+ph)+0.09*Math.sin(5*a+ph*1.7)+0.05*Math.sin(7*a+2));
  const f=(x,z)=>{ const dx=x-cx, dz=z-cz; return Math.hypot(dx,dz)/rr(Math.atan2(dz,dx)); };   /* 1 at the water's edge */
  const E=R*1.5+5;
  /* the green ring, and the dark wet earth at the water */
  for(let x=cx-E;x<=cx+E;x+=0.9) for(let z=cz-E;z<=cz+E;z+=0.9){ const q=f(x,z); if(q<0.98||q>1.55) continue; const h=hash(x*1.3,z*0.7);
    ctx.api.top(x-0.45,z-0.45,x+0.45,z+0.45, q<1.12?(h<0.6?'grass':'dirt'):q<1.35?(h<0.55?'grass':h<0.75?'dirt':'sand'):(h<0.3?'grass':h<0.4?'dirt':'sand')); }
  /* the water: a wading depth all round, deeper in the middle */
  ctx.api.water(cx-E,cz-E,cx+E,cz+E,{depth:1,bed:'sand',test:(x,z)=>f(x,z)<1});
  ctx.api.water(cx-E,cz-E,cx+E,cz+E,{depth:2,bed:'dirt',test:(x,z)=>f(x,z)<0.55});
  /* stones along the lip, lying in the bank, not all the way round */
  const N=Math.round(R*5);
  for(let i=0;i<N;i++){ const a=i/N*Math.PI*2+hash(i,cx)*0.2, h=hash(i,cz); if(h<0.4) continue;
    const r=rr(a)+0.5, x=cx+Math.cos(a)*r, z=cz+Math.sin(a)*r;
    if(h>0.9) S.box(x-0.45,0,z-0.45,x+0.45,0.45,z+0.45,'stone');                          /* one standing proud */
    else ctx.api.top(x-0.45,z-0.45,x+0.45,z+0.45,h<0.7?'stone':'cobble'); }                    /* the rest flat in the bank */
  /* reeds and rushes in the shallows */
  for(let i=0;i<Math.round(R*2.2);i++){ const a=hash(i,7+cx)*6.28; if(o.open&&Math.abs(((a-o.open+Math.PI*3)%(Math.PI*2))-Math.PI)<0.5) continue;
    const r=rr(a)*(0.82+hash(i,9)*0.14); W.reeds(S,cx+Math.cos(a)*r,cz+Math.sin(a)*r,0,6); }
  /* lilies on the water, some in flower */
  for(let i=0;i<Math.round(R*2.6);i++){ const a=hash(i,11)*6.28, r=rr(a)*(0.2+hash(i,12)*0.55), x=cx+Math.cos(a)*r, z=cz+Math.sin(a)*r, s=0.22+hash(i,13)*0.14;
    S.detail(x-s,0.0,z-s,x+s,0.04,z+s,[0x4e7a30,0x5c8a38,0x46702c][i%3],{jitter:0.1});
    if(i%3===0) S.detail(x-0.07,0.04,z-0.07,x+0.07,0.17,z+0.07,[0xe86aa0,0xf2e070,0xf6f2ea,0xd05a8a][i%4]); }
  /* flowers and grass in the green ring */
  for(let i=0;i<Math.round(R*9);i++){ const a=hash(i,21)*6.28, r=rr(a)*(1.04+hash(i,22)*0.42), x=cx+Math.cos(a)*r, z=cz+Math.sin(a)*r, y=S.ground(x,z);
    if(i%3) S.detail(x-0.06,y,z-0.06,x+0.06,y+0.35+hash(i,23)*0.35,z+0.06,[0x7d8a45,0x8a9a4a,0x6d7a3a][i%3],{jitter:0.15});
    else S.detail(x-0.09,y+0.22,z-0.09,x+0.09,y+0.4,z+0.09,[0xd8403a,0xf2d050,0xf0ece0,0xb070c0,0xe88a30][i%5]); }
  /* the palms, an acacia, the boulders */
  for(let i=0;i<(o.palms||4);i++){ const a=ph+i*(Math.PI*2/(o.palms||4))+hash(i,31)*0.6, r=rr(a)+1.6+hash(i,32)*1.8;
    if(o.open&&Math.abs(((a-o.open+Math.PI*3)%(Math.PI*2))-Math.PI)<0.6) continue;
    W.palm(S,cx+Math.cos(a)*r,cz+Math.sin(a)*r); }
  { const a=ph+2.4, r=rr(a)+3.4; W.tamarisk(S,cx+Math.cos(a)*r,cz+Math.sin(a)*r,1.1); }
  for(let i=0;i<2;i++){ const a=ph+1+i*2.6, r=rr(a)+2.8; W.rock(S,cx+Math.cos(a)*r,cz+Math.sin(a)*r,0.55+hash(i,41)*0.25); }
  W.waterLife(ctx,{at:[cx,cz], r:R*1.9, y:0, fish:Math.round(R*1.2), frogs:4, flies:5, egrets:1, turtles:1, butterflies:3});
  return {f,rr};
};
/* THE DESERT FLOOR: not a mat of sand laid level, but the wilderness as it lies — dunes stepped
   with the wind, ribs of rock breaking through, patches of gravel and of hard brown earth, and the
   dry scrub of broom and thorn. `area` [x0,z0,x1,z1]; `keep(x,z)` leaves ground clear (a road). */
W.desert=function(ctx,S,o){ o=o||{};
  const A=o.area||[-90,-90,90,90], keep=o.keep||(()=>false), H=(i,j)=>hash(i*1.37+(o.seed||0),j*2.11);
  /* the ground's own course broken: drifts of hard brown earth and of grit, wandering as the wind
     left them, a stone showing here and there — single cells walked out from a seed, never a tile */
  for(let k=0;k<(o.patches||70);k++){ let x=A[0]+H(k,61)*(A[2]-A[0]), z=A[1]+H(k,62)*(A[3]-A[1]);
    const kind=H(k,63)<0.55?'dirt':H(k,63)<0.9?'path':'stone', n=4+Math.floor(H(k,64)*14);
    for(let i=0;i<n;i++){ if(!keep(x,z)) ctx.api.top(x-0.45,z-0.45,x+0.45,z+0.45,kind);
      const a=H(k*7+i,65)*6.28; x+=Math.cos(a)*0.92; z+=Math.sin(a)*0.92; } }
  /* dunes, stepped */
  for(let k=0;k<(o.dunes||14);k++){ const x=A[0]+H(k,1)*(A[2]-A[0]), z=A[1]+H(k,2)*(A[3]-A[1]); if(keep(x,z)) continue;
    const rx=3+H(k,3)*6, rz=2+H(k,4)*4, n=1+Math.floor(H(k,5)*3);
    if(keep(x-rx,z)||keep(x+rx,z)||keep(x,z-rz)||keep(x,z+rz)) continue;
    for(let s=0;s<n;s++){ const t=1-s/(n+0.5)*0.75; S.box(x-rx*t,s*0.92,z-rz*t,x+rx*t,(s+1)*0.92,z+rz*t,'sand'); } }
  /* ribs of rock */
  for(let k=0;k<(o.rocks||18);k++){ const x=A[0]+H(k,11)*(A[2]-A[0]), z=A[1]+H(k,12)*(A[3]-A[1]); if(keep(x,z)) continue;
    const n=2+Math.floor(H(k,13)*4);
    for(let i=0;i<n;i++){ const dx=(H(k,14+i)-0.5)*3.4, dz=(H(k,20+i)-0.5)*2.4, h=0.6+H(k,26+i)*1.4;
      if(keep(x+dx,z+dz)) continue; S.box(x+dx-0.5,0,z+dz-0.5,x+dx+0.5,h,z+dz+0.5,H(k,30+i)<0.5?'stone':'hewn-stone'); } }
  /* the scrub */
  for(let k=0;k<(o.scrub||60);k++){ const x=A[0]+H(k,41)*(A[2]-A[0]), z=A[1]+H(k,42)*(A[3]-A[1]); if(keep(x,z)) continue; const y=S.ground(x,z);
    const c=[0x8a6a40,0x9a8a58,0x7a6a3a][k%3], hh=0.3+H(k,43)*0.4;
    S.detail(x-0.05,y,z-0.05,x+0.05,y+hh,z+0.05,c); S.detail(x-0.28,y+hh*0.5,z-0.04,x+0.28,y+hh*0.6,z+0.04,c); S.detail(x-0.04,y+hh*0.7,z-0.24,x+0.04,y+hh*0.8,z+0.24,c); }
};
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
/* A PERSON is built in story/people.js: a man or woman of their own day, dressed as the
   finds and writings of the time show them. */
/* a dove of light — "the Ruach of Aluahim descending like a dove" (Mattithyahu 3:16) */
W.dove=function(ctx,x,y,z){
  const g=new THREE.Group(), k=K(), bird=k.makeBird?k.makeBird('dove'):null;
  if(bird){ bird.scale.multiplyScalar(1.4/k.setScale); g.add(bird); }
  const G=W.glow({scene:g},0,0,0,2.6,0xfff8e4,0); G.sprite.material.opacity=0.9;
  g.userData.bird=bird; g.position.set(x,y,z); ctx.scene.add(g); return g;
};
/* a fishing boat of the lake: planked hull, a thwart, a mast stepped amidships (the
   Kinnereth boat found at Ginosar, 8 m by 2.3) — a group, so it can be moved on the water */
/* THE FISHING BOAT OF THE LAKE (`big`), as the one raised from the mud of Kinnereth's shore in
   1986 shows them: a broad open hull some nine metres long and two and a half in the beam, a
   mast stepped forward with its yard, a little deck at bow and at stern, and the crew on thwarts
   across her — and she is made here a little larger, ten and a half metres by three, so that
   the Twelve and their Teacher sit in her as the accounts have them do (Mark 4:36, Mattithyahu
   14:22). Her measures are kept on her for the engine: `len`, `beam`, the height of her floor,
   thwarts and decks above her own waterline. */
W.BOAT={len:10.6,beam:3.1,floor:-0.42,seat:0.0,deck:0.08,gunwale:0.62,thwarts:[3.05,1.65,-1.35,-2.75],mast:2.35};
/* THE WATER IS NOT INSIDE HER. A hull is open, and the lake's water (the world's own blocks of it, or the
   lake's waves) lies level through it — so it stood inside every boat, up to the thwarts. Within her is laid
   a MASK: a shape filling the hold, drawn with no colour at all, only its depth, after the people and the
   things in her and before the water — so the water behind it is not drawn there, and everything else is.
   (A net is drawn before it, so the catch heaped in her is seen.) */
const HULL_MASK=new THREE.MeshBasicMaterial({colorWrite:false,transparent:true,depthWrite:true});
function hullMask(g,parts){ for(const [w,h,d,x,y,z] of parts){ const q=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),HULL_MASK);
    q.position.set(x,y,z); q.renderOrder=-1; q.userData.mask=true; g.add(q); } }
function bigBoat(ctx,x,z,o){
  const g=new THREE.Group(), m=c=>new THREE.MeshLambertMaterial({color:c});
  const wood=m(0x6a4a30), dark=m(0x4a3220), pale=m(0x8a6a48), tar=m(0x2a2018);
  const b=(w,h,d,mt,px,py,pz,ry)=>{ const q=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),mt); q.position.set(px,py,pz); if(ry) q.rotation.y=ry; g.add(q); return q; };
  const P=W.BOAT, L=P.len, HB=P.beam/2;
  /* the half-breadth along her: full through the waist, drawn in to the stem and the stern */
  const half=z=>{ const t=Math.abs(z)/(L/2); return HB*Math.sqrt(Math.max(0,1-Math.pow(t,z>0?2.6:3.4))); };
  /* the bottom, in strakes that narrow as she does */
  for(let i=0;i<14;i++){ const z0=-L/2+0.25+i*(L-0.5)/14, z1=z0+(L-0.5)/14, zc=(z0+z1)/2, w=Math.max(0.3,2*half(zc)-0.25);
    b(w,0.2,z1-z0+0.02,dark,0,P.floor-0.1,zc); }
  /* the sides: three strakes a side, each segment set along the curve of her */
  const N=16;
  for(const sd of [1,-1]) for(let i=0;i<N;i++){
    const z0=-L/2+i*L/N, z1=z0+L/N, x0=sd*half(z0), x1=sd*half(z1), zc=(z0+z1)/2, xc=(x0+x1)/2;
    const len=Math.hypot(x1-x0,z1-z0)+0.04, ang=Math.atan2(x1-x0,z1-z0);
    for(let r=0;r<3;r++){ const y0=P.floor-0.2+r*0.4; b(0.09,0.42,len,r===2?wood:(r?pale:wood),xc,y0+0.21,zc,ang); }
    b(0.16,0.07,len,tar,xc,P.gunwale+0.02,zc,ang); }                                    /* the gunwale's cap */
  /* stem and sternpost, rising a little */
  b(0.22,1.5,0.3,dark,0,P.gunwale-0.2,L/2-0.08); b(0.22,1.35,0.3,dark,0,P.gunwale-0.25,-L/2+0.08);
  /* the thwarts across her, and the little decks at bow and stern */
  for(const tz of P.thwarts) b(2*half(tz)-0.1,0.09,0.32,pale,0,P.seat-0.05,tz);
  b(2*half(4.6)-0.12,0.1,1.25,pale,0,P.deck-0.05,4.55); b(2*half(-4.5)-0.12,0.1,1.15,pale,0,P.deck-0.05,-4.45);
  /* the floor-boards she is walked on */
  b(1.9,0.05,7.6,m(0x7a5a3c),0,P.floor+0.03,0.15);
  /* the mast, its yard, the sail furled along it; the steering oar on her quarter */
  if(o.mast!==false){ b(0.2,6.4,0.2,m(0x7a5a3e),0,P.floor+3.2,P.mast);
    const yd=b(4.6,0.12,0.12,m(0x7a5a3e),0,5.2,P.mast); yd.rotation.z=0.06;
    b(4.3,0.3,0.3,m(0xd8cfb8),0,5.0,P.mast+0.05); }
  const oar=b(0.12,0.12,3.4,dark,HB-0.15,P.gunwale-0.4,-L/2+0.6); oar.rotation.x=0.42; oar.rotation.y=0.18;
  b(0.5,0.08,0.9,dark,HB+0.05,P.gunwale-1.45,-L/2-0.65);
  /* oars shipped along her sides */
  for(const sd of [1,-1]) for(const dz of [-1.0,1.3]){ const q=b(0.09,0.09,3.6,wood,sd*(HB-0.45),P.gunwale-0.05,dz); q.rotation.y=sd*0.04; }
  /* `scale`: a ship of the sea built as she is, larger — the grain ship of Alexandria (Acts 27:37) */
  const sc=o.scale||1; g.scale.setScalar(sc); g.userData.boat={len:L*sc,beam:P.beam*sc};
  { const parts=[]; for(let i=0;i<14;i++){ const z0=-L/2+0.4+i*(L-0.8)/14, z1=z0+(L-0.8)/14, zc=(z0+z1)/2, w=2*half(zc)-0.22; if(w<0.3) continue;
      parts.push([w,P.gunwale-0.06-(P.floor+0.06),z1-z0+0.01,0,(P.gunwale-0.06+P.floor+0.06)/2,zc]); } hullMask(g,parts); }
  g.position.set(x,o.y===undefined?-0.1:o.y,z); g.rotation.order='YXZ'; g.rotation.y=o.face||0; ctx.scene.add(g); return g; }
/* THE LAKE'S OWN WAVES, over the still water of a set (galilSea): a surface of travelling waves
   whose height is the story engine's own (lakeH) on the CPU and here on the GPU, so that a boat
   rides exactly the water that is drawn, and a man walks on it. Lit as the voyage lights its sea,
   by the same light, sun, moon and fog; struck and ringing out of the same live field. */
W.lakeWaves=function(ctx,r){
  const KIT=window.__KIT, WU=window.__WORLD.waveMat.uniforms, RP=KIT.ripple;
  const w=r[2]-r[0], d=r[3]-r[1], sx=Math.ceil(w/0.5), sz=Math.ceil(d/0.5);
  const geo=new THREE.PlaneGeometry(w,d,sx,sz); geo.rotateX(-Math.PI/2); geo.translate((r[0]+r[2])/2,0,(r[1]+r[3])/2);
  const U={uT:{value:0},uA:{value:0},uDir:{value:new THREE.Vector2(0,1)},uRect:{value:new THREE.Vector4(r[0],r[1],r[2],r[3])},
    uBoat:{value:new THREE.Vector4(0,0,0,-99)},uBoatH:{value:0},
    /* every boat on the lake, not only the one being sailed: the water is never drawn inside a hull */
    uBoats:{value:[0,1,2,3,4,5,6,7].map(()=>new THREE.Vector4(0,0,0,-99))},uBoatHs:{value:[0,0,0,0,0,0,0,0]},
    uLight:WU.uLight,uSunDir:WU.uSunDir,uSunCol:WU.uSunCol,uZenith:WU.uZenith,uFogColor:WU.uFogColor,uFogNear:WU.uFogNear,uFogFar:WU.uFogFar,
    uSkyHor:WU.uSkyHor,uSkyTop:WU.uSkyTop,
    uCamPos:WU.uCamPos,uMoonDir:WU.uMoonDir,uMoonCol:WU.uMoonCol,uMoon:WU.uMoon,uNoise:WU.uMap,
    uRip:RP.tex,uRipO:RP.o,uRipOn:RP.on,
    uRefl:WU.uRefl,uReflMat:WU.uReflMat,uReflOn:WU.uReflOn,uReflY:WU.uReflY,
    uHzDir:WU.uHzDir,uHzCol:WU.uHzCol,uHzSet:WU.uHzSet,uHzSetAmt:WU.uHzSetAmt,uHzFlat:WU.uHzFlat,
    uCamO:WU.uCamO,uOrg:WU.uOrg};
  const WAVE=W.LAKE_WAVES.map(c=>`{ float a=uA*${c[2].toFixed(3)}, k=${(2*Math.PI/c[1]).toFixed(4)}, om=${Math.sqrt(9.8*2*Math.PI/c[1]).toFixed(4)};
      vec2 D=vec2(cos(${c[0].toFixed(3)})*uDir.x-sin(${c[0].toFixed(3)})*uDir.y, sin(${c[0].toFixed(3)})*uDir.x+cos(${c[0].toFixed(3)})*uDir.y);
      float f=k*dot(D,P)-om*uT, c=cos(f), s=sin(f);
      dp.xz+=0.55*a*D*c; dp.y+=a*s; nr.xz-=D*k*a*c; nr.y-=0.55*k*a*s; }`).join('\n');
  const mat=new THREE.ShaderMaterial({uniforms:U,transparent:true,
    /* (reckoned about the voyage's own origin, as every water of the voyage is: THE EYE'S OWN ORIGIN) */
    vertexShader:KIT.ORG_GLSL+`uniform float uT,uA; uniform vec2 uDir; uniform vec4 uRect; uniform mat4 uReflMat;
      varying vec3 vW,vN; varying float vH,vFog,vEdge; varying vec2 vP; varying vec4 vRefl;
      void main(){ vec2 P=position.xz; vec3 dp=vec3(0.0); vec3 nr=vec3(0.0,1.0,0.0);
        /* the waves lie down within a few metres of the shore */
        float e=smoothstep(0.0,6.0,min(min(P.x-uRect.x,uRect.z-P.x),min(P.y-uRect.y,uRect.w-P.y)));
        ${WAVE}
        dp*=e; vEdge=e; vH=dp.y; vP=P; vN=normalize(mix(vec3(0.0,1.0,0.0),nr,e));
        vec4 mv=modelViewMatrix*vec4(position+dp,1.0); vW=orgOfMv(mv); vRefl=uReflMat*vec4(vW,1.0);
        vFog=-mv.z; gl_Position=projectionMatrix*mv; }`,
    fragmentShader:KIT.ORG_GLSL+`precision highp float;
      uniform vec3 uLight,uSunDir,uSunCol,uZenith,uFogColor,uCamPos,uMoonDir,uMoonCol,uSkyHor,uSkyTop; uniform float uFogNear,uFogFar,uMoon,uA,uT,uBoatH;
      uniform vec4 uBoat; uniform vec4 uBoats[8]; uniform float uBoatHs[8]; uniform sampler2D uNoise,uRip; uniform vec2 uRipO; uniform float uRipOn;
      uniform sampler2D uRefl; uniform float uReflOn,uReflY;
      ${window.__KIT.hazeGLSL||'vec3 hazeOf(vec3 f,vec3 d){ return f; }'}
      /* (the eye's distance, vFog, is in the world's units, the set's metres times its scale: the reaches
         below are written in metres, and were met six and a half times too near: the ripple gone at twenty
         metres, the waves a flat mirror at twenty-six, and only the round blots of foam left on it) */
      const float SC=${(+KIT.setScale||1).toFixed(3)};
      varying vec3 vW,vN; varying float vH,vFog,vEdge; varying vec2 vP; varying vec4 vRefl;
      void main(){
        /* none of it inside the boat's own hull */
        vec2 rb=vP-uBoat.xy; float cb=cos(uBoatH), sb=sin(uBoatH);
        vec2 lb=vec2(cb*rb.x-sb*rb.y, sb*rb.x+cb*rb.y);
        if(abs(lb.y)<uBoat.z*0.5-0.1){ float t=abs(lb.y)/(uBoat.z*0.5); if(abs(lb.x)<uBoat.w*0.5*sqrt(max(0.0,1.0-pow(t,2.8)))-0.06) discard; }
        for(int i=0;i<8;i++){ vec4 Bt=uBoats[i]; if(Bt.w<0.0) continue;
          vec2 rq=vP-Bt.xy; float cq=cos(uBoatHs[i]), sq=sin(uBoatHs[i]); vec2 lq=vec2(cq*rq.x-sq*rq.y, sq*rq.x+cq*rq.y);
          if(abs(lq.y)<Bt.z*0.5-0.1){ float tq=abs(lq.y)/(Bt.z*0.5); if(abs(lq.x)<Bt.w*0.5*sqrt(max(0.0,1.0-pow(tq,2.8)))-0.06) discard; } }
        vec3 N=normalize(vN);
        vec3 n1=texture2D(uNoise,vP*0.11+vec2(uT*0.05,uT*0.03)).rgb, n2=texture2D(uNoise,vP*0.37-vec2(uT*0.08,-uT*0.06)).rgb;
        /* the fine ripple lies down with distance (afar it can only alias into streaks of light) */
        float nearD=1.0-smoothstep(25.0*SC,140.0*SC,vFog);
        N=normalize(N+vec3((n1.r-0.5)*0.26+(n2.r-0.5)*0.12*nearD,0.0,(n1.g-0.5)*0.26+(n2.g-0.5)*0.12*nearD));
        /* and the waves themselves lie flat to the eye far off: a lake seen across is a smooth mirror of its
           far shore, not rows of crests turned light and dark against each other (the lines in the water) */
        N=normalize(mix(N,vec3(0.0,1.0,0.0),smoothstep(18.0*SC,170.0*SC,vFog)*0.85*(1.0-smoothstep(0.15,0.4,uA))));   /* (a gale's lake is no mirror) */
        float rf=0.0;
        if(uRipOn>0.5){ vec2 rc=(vW.xz-uRipO)/${RP.span.toFixed(1)};
          if(rc.x>0.0&&rc.y>0.0&&rc.x<1.0&&rc.y<1.0){ vec4 rp=texture2D(uRip,rc); N=normalize(N+vec3((rp.r-0.5)*2.6,0.0,(rp.g-0.5)*2.6)); rf=rp.a; } }
        vec3 V=normalize(uCamPos-vW), Ls=normalize(uSunDir);
        float above=step(vW.y,uCamPos.y);
        vec3 deep=vec3(0.02,0.12,0.20), shallow=vec3(0.07,0.40,0.38);
        vec3 base=mix(shallow,deep,0.65)*(0.80+0.30*clamp(vH/(uA*1.4+0.05)*0.5+0.5,0.0,1.0));
        float diff=clamp(dot(N,Ls),0.0,1.0);
        vec3 col=base*(0.55+0.55*diff);
        /* white water on the crests the gale tears off them, and the foam of the live field */
        /* (only the tops of the highest crests break, and their white thins with distance, where a crest is a
           few pixels and its foam a pale blot) */
        float crest=smoothstep(0.55,0.95,vH/(uA*1.25+0.001))*smoothstep(0.12,0.4,uA)*(0.55+0.9*n2.b)*mix(1.0,0.35,smoothstep(60.0*SC,250.0*SC,vFog));
        float foam=clamp(crest*0.85+rf*0.95,0.0,1.0);
        col=mix(col,vec3(0.86,0.91,0.96),foam);
        col*=uLight;
        if(uMoon>0.002){ vec3 M=normalize(uMoonDir); float md=clamp(dot(N,M),0.0,1.0); col+=base*uMoonCol*(0.3+0.8*md)*uMoon*1.3;
          vec3 HM=normalize(V+M); col+=uMoonCol*pow(max(dot(N,HM),0.0),110.0)*1.4*md*uMoon; col+=uMoonCol*foam*uMoon*0.4; }
        vec3 H=normalize(V+Ls); col+=uSunCol*(pow(max(dot(N,H),0.0),220.0)*2.2+pow(max(dot(N,H),0.0),48.0)*0.14)*diff*above;
        float fres=0.02+0.98*pow(1.0-max(dot(N,V),0.0),5.0); vec3 R=reflect(-V,N);
        vec3 skyR=mix(uSkyHor,uSkyTop,pow(clamp(R.y,0.0,1.0),0.5));
        /* the hills, the trees, the boats and the people on the shore, in the water (THE WORLD IN THE WATER) */
        if(uReflOn>0.001){ vec2 ruv=vRefl.xy/vRefl.w+N.xz*0.035;
          skyR=mix(skyR,texture2D(uRefl,clamp(ruv,0.002,0.998)).rgb,uReflOn*(1.0-smoothstep(4.0,14.0,abs(vW.y-uReflY)))); }
        col=mix(col,skyR,clamp(fres*0.9,0.0,0.9)*above);
        /* clear: the sand and its light seen through it, a mirror only where the eye looks along it */
        float a=clamp(0.38+fres*0.8,0.0,0.97); a=max(a,foam);
        float ff=clamp((vFog-uFogNear)/(uFogFar-uFogNear),0.0,1.0);
        gl_FragColor=vec4(mix(col,hazeOf(uFogColor,normalize(vW-uCamPos)),ff),a); }`});
  const mesh=new THREE.Mesh(geo,mat); mesh.renderOrder=1; mesh.frustumCulled=false; ctx.scene.add(mesh);
  if(window.__REFLECT) window.__REFLECT.lakes.add(mesh);                       /* the face the world is mirrored in */
  return {mesh,U};
};
/* the waves of the lake: [turned from the wind, wavelength in metres, share of the height] —
   the story engine reads the same table for the height a boat rides and a man walks on */
W.LAKE_WAVES=[[0,9.0,0.46],[0.45,6.4,0.30],[-0.55,4.5,0.22],[1.15,3.1,0.12],[-1.4,2.2,0.07]];
W.boat=function(ctx,x,z,o){ o=o||{};
  if(o.big) return bigBoat(ctx,x,z,o);
  const g=new THREE.Group(), m=c=>new THREE.MeshLambertMaterial({color:c});
  const b=(w,h,d,c,px,py,pz)=>{ const q=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),m(c)); q.position.set(px,py,pz); g.add(q); return q; };
  const wood=0x6a4a30, dark=0x4a3220;
  b(2.0,0.25,7.0,dark,0,-0.35,0);
  b(0.18,0.75,7.0,wood,-1.05,0.05,0); b(0.18,0.75,7.0,wood,1.05,0.05,0);
  b(2.1,0.75,0.2,wood,0,0.05,3.5); b(1.6,0.9,0.5,wood,0,0.15,3.9);
  b(2.1,0.75,0.2,wood,0,0.05,-3.5);
  b(2.0,0.1,0.4,0x8a6a48,0,0.2,0.8);
  if(o.mast!==false){ b(0.16,4.5,0.16,0x7a5a3e,0,2.4,1.2); b(2.6,0.1,0.1,0x7a5a3e,0,3.9,1.2); }
  hullMask(g,[[1.88,0.6,6.75,0,0.075,0]]);                                     /* the hold, floor to gunwale */
  g.position.set(x,o.y===undefined?-0.2:o.y,z); g.rotation.y=o.face||0; ctx.scene.add(g); return g; };
/* a net, heaped or hanging, and the fish that fill it */
W.net=function(ctx,x,z,o){ o=o||{};
  const g=new THREE.Group(), mat=new THREE.MeshLambertMaterial({color:0xb8a882,transparent:true,opacity:0.75});
  const q=new THREE.Mesh(new THREE.BoxGeometry(o.w||1.6,o.h||0.4,o.d||1.4),mat); q.renderOrder=-2; g.add(q);   /* (drawn before a hull's mask) */
  const fish=new THREE.Group();                                                       /* the catch: the voyage's own fish, heaped in the net */
  for(let k=0;k<Math.min(28,o.n||28);k++){ const f=W.voyageFish(FISH_KINDS[Math.floor(hash(k,5)*5)]); if(!f) continue;
    const h=new THREE.Group(); h.add(f); h.position.set((hash(k,1)-0.5)*(o.w||1.6)*0.9,(hash(k,2)-0.3)*(o.h||0.4)*1.6,(hash(k,3)-0.5)*(o.d||1.4)*0.9);
    h.rotation.set(hash(k,6)*0.6,hash(k,4)*6,(hash(k,7)-0.5)*2.4); fish.add(h); }
  fish.visible=!!o.full; g.add(fish); g.userData.fish=fish;
  g.position.set(x,o.y||0,z); ctx.scene.add(g); return g; };
/* a stone water-jug "according to the mode of cleansing" (Yahuchanon 2:6): chalk stone, waist-high */
W.stoneJar=function(ctx,x,z){
  const g=new THREE.Group(), m=new THREE.MeshLambertMaterial({color:0xd8d0bc});
  const a=new THREE.Mesh(new THREE.BoxGeometry(0.62,0.95,0.62),m); a.position.y=0.475; g.add(a);
  for(const [rx,rz,rw,rd] of [[0,0.32,0.74,0.1],[0,-0.32,0.74,0.1],[0.32,0,0.1,0.54],[-0.32,0,0.1,0.54]]){   /* the lip, a ring about the mouth */
    const r=new THREE.Mesh(new THREE.BoxGeometry(rw,0.1,rd),m); r.position.set(rx,0.95,rz); g.add(r); }
  const w=new THREE.Mesh(new THREE.BoxGeometry(0.54,0.02,0.54),new THREE.MeshBasicMaterial({color:0x6f8f9a})); w.position.y=0.965; w.visible=false; g.add(w);   /* what is in it, seen within the lip */
  g.userData.fill=w; g.position.set(x,0,z); ctx.scene.add(g); return g; };
/* the round stone rolled in its channel against the door of a tomb */
W.roundStone=function(ctx,x,z,o){ o=o||{};
  const r=o.r||1.25, g=new THREE.Group();
  const m=new THREE.Mesh(new THREE.CylinderGeometry(r,r,o.w||0.45,14),new THREE.MeshLambertMaterial({color:0xcfc4a8}));
  m.rotation.z=Math.PI/2; m.position.y=r; g.add(m); g.userData.wheel=m; g.userData.r=r;
  g.position.set(x,0,z); g.rotation.y=o.face||0; ctx.scene.add(g); return g; };
/* THE MULTITUDE (Mark 3:9, "because of the crowd, lest they should press upon Him"): the many,
   beyond the named few who move and speak — hundreds of plainer figures, robed, girded, the men
   in head-cloths and beards, the women veiled, each its own colours and height and its own way
   of facing, all welded into one mesh so that a scene can hold a city's worth of them. They
   stand (or `sit` on the ground, legs before them) where the engine has found ground for them
   (story/engine.js, placeCrowd). `figs`: [{x,y,z,face,s,robe,cloth,skin,sash,woman,beard,sit,roman}] */
W.crowd=function(ctx,figs){
  const P=[], N=[], Cc=[], I=[]; let n=0;
  const col=new THREE.Color();
  const FACES=[[[1,0,0],[[1,-1,-1],[1,1,-1],[1,1,1],[1,-1,1]],0.8],[[-1,0,0],[[-1,-1,1],[-1,1,1],[-1,1,-1],[-1,-1,-1]],0.72],
               [[0,1,0],[[-1,1,1],[1,1,1],[1,1,-1],[-1,1,-1]],1.0],[[0,-1,0],[[-1,-1,-1],[1,-1,-1],[1,-1,1],[-1,-1,1]],0.5],
               [[0,0,1],[[-1,-1,1],[1,-1,1],[1,1,1],[-1,1,1]],0.9],[[0,0,-1],[[1,-1,-1],[-1,-1,-1],[-1,1,-1],[1,1,-1]],0.66]];
  /* a box of the figure: (cx,cy,cz) its middle and (w,h,d) its size, in the figure's own frame */
  const box=(F,cx,cy,cz,w,h,d,hex)=>{ col.setHex(hex); const c=Math.cos(F.face), sn=Math.sin(F.face), k=F.s;
    for(const [nr,vs,sh] of FACES){ const o=n;
      for(const v of vs){ const lx=(cx+v[0]*w/2)*k, ly=(cy+v[1]*h/2)*k, lz=(cz+v[2]*d/2)*k;
        P.push(F.x+lx*c+lz*sn, F.y+ly, F.z-lx*sn+lz*c); N.push(nr[0]*c+nr[2]*sn, nr[1], -nr[0]*sn+nr[2]*c);
        Cc.push(col.r*sh,col.g*sh,col.b*sh); n++; }
      I.push(o,o+1,o+2,o,o+2,o+3); } };
  for(const F of figs){
    const R=F.robe, C=F.cloth, K=F.skin, dark=0x2a2018, belt=F.sash||0x4a3a2a, sit=F.sit;
    if(F.roman){                                                                  /* a soldier of the cohort */
      box(F,0.09,0.42,0,0.12,0.84,0.13,K); box(F,-0.09,0.42,0,0.12,0.84,0.13,K);
      box(F,0,0.86,0,0.42,0.3,0.26,0x8a2a22); box(F,0,1.2,0,0.42,0.42,0.26,0x8a8c90);
      box(F,0.25,1.13,0,0.1,0.56,0.12,0x8a2a22); box(F,-0.25,1.13,0,0.1,0.56,0.12,0x8a2a22);
      box(F,0,1.6,0,0.19,0.22,0.21,K); box(F,0,1.74,0,0.24,0.1,0.25,0xb08d3c); box(F,0,1.82,0,0.04,0.08,0.22,0x8a2a22);
      continue; }
    if(sit){                                                                      /* sitting on the grass */
      box(F,0,0.12,0.28,0.42,0.24,0.62,R); box(F,0.09,0.06,0.62,0.11,0.1,0.14,dark); box(F,-0.09,0.06,0.62,0.11,0.1,0.14,dark);
      box(F,0,0.36,0,0.44,0.3,0.3,R); box(F,0,0.73,0,0.4,0.46,0.24,R); box(F,0,0.5,0,0.42,0.06,0.26,belt);
      box(F,0.24,0.62,0.12,0.1,0.42,0.12,R); box(F,-0.24,0.62,0.12,0.1,0.42,0.12,R);
      box(F,0.24,0.42,0.28,0.08,0.08,0.08,K); box(F,-0.24,0.42,0.28,0.08,0.08,0.08,K); }
    else {
      box(F,0.09,0.05,0.02,0.12,0.1,0.16,dark); box(F,-0.09,0.05,0.02,0.12,0.1,0.16,dark);
      box(F,0,0.12,0,0.2,0.14,0.14,K);                                           /* the ankles under the hem */
      box(F,0,F.woman?0.55:0.57,0,F.woman?0.46:0.44,F.woman?0.92:0.86,0.28,R);  /* the robe from the hem */
      box(F,0,1.22,0,0.4,0.48,0.24,R); box(F,0,0.98,0,0.42,0.07,0.26,belt);
      box(F,0.25,1.14,0,0.1,0.56,0.12,R); box(F,-0.25,1.14,0,0.1,0.56,0.12,R);
      box(F,0.25,0.82,0.01,0.08,0.09,0.07,K); box(F,-0.25,0.82,0.01,0.08,0.09,0.07,K); }
    const hy=sit?1.12:1.61;
    box(F,0,hy,0,0.19,0.22,0.21,K);                                               /* the head */
    box(F,0.045,hy+0.02,0.106,0.035,0.022,0.01,0x1a120c); box(F,-0.045,hy+0.02,0.106,0.035,0.022,0.01,0x1a120c);   /* the eyes */
    if(F.beard!=null) box(F,0,hy-0.075,0.1,0.17,0.08,0.03,F.beard);
    box(F,0,hy+0.12,0,0.23,0.06,0.25,C);                                          /* the head-cloth, or the veil */
    box(F,0.105,hy-0.01,-0.01,0.02,F.woman?0.3:0.18,0.22,C); box(F,-0.105,hy-0.01,-0.01,0.02,F.woman?0.3:0.18,0.22,C);
    const vl=F.woman?(sit?0.4:0.66):0.34; box(F,0,hy+0.1-vl/2,-0.115,0.24,vl,0.03,C); }      /* falling behind, to the shoulders (a woman's to the waist) */
  const geo=new THREE.BufferGeometry();
  geo.setAttribute('position',new THREE.Float32BufferAttribute(P,3)); geo.setAttribute('normal',new THREE.Float32BufferAttribute(N,3));
  geo.setAttribute('color',new THREE.Float32BufferAttribute(Cc,3)); geo.setIndex(I); geo.computeBoundingSphere();
  const mesh=new THREE.Mesh(geo,new THREE.MeshLambertMaterial({vertexColors:true}));
  mesh.name='story-crowd'; ctx.scene.add(mesh); return mesh; };

/* A SEAT OF RULE: the throne of a king (`king`: a high back and arms, gold over purple, a step
   before it for the feet); the governor's judgement seat on the bema (`roman`: ivory and gold,
   low-backed); the seat of the kohen gadol at the head of the council (`kohen`: cedar). The seat
   is at the height a man sits at (the engine's `bench` sitting), facing +z before it is turned. */
W.throne=function(ctx,x,z,o){ o=o||{};
  const st=o.style||'king', g=new THREE.Group(), m=c=>new THREE.MeshLambertMaterial({color:c});
  const b=(w,h,d,c,px,py,pz)=>{ const q=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),m(c)); q.position.set(px,py,pz); g.add(q); return q; };
  const frame=st==='roman'?0xe8e0cc:st==='kohen'?0x7a5a3a:0xb8902c, trim=st==='kohen'?0x5a4028:0xd4af37,
        cushion=st==='roman'?0x8a2a22:st==='kohen'?0x3a3a6a:o.cushion||0x5a2060;
  const H=0.46, W2=0.36, back=st==='king'?1.55:st==='roman'?0.7:1.05;
  for(const sx of [-1,1]) for(const sz of [-1,1]) b(0.08,H,0.08,frame,sx*(W2-0.05),H/2,sz*0.25);   /* the legs */
  b(W2*2,0.07,0.6,frame,0,H-0.035,0);                                                   /* the seat */
  b(W2*2-0.08,0.06,0.52,cushion,0,H+0.03,0.01);                                          /* its cushion */
  b(W2*2,back,0.08,frame,0,H+back/2,-0.29);                                              /* the back */
  b(W2*2-0.12,back-0.16,0.02,cushion,0,H+back/2,-0.245);
  b(W2*2+0.06,0.06,0.12,trim,0,H+back,-0.29);                                            /* its cresting */
  if(st==='king'){ b(0.12,0.16,0.12,trim,W2,H+back+0.08,-0.29); b(0.12,0.16,0.12,trim,-W2,H+back+0.08,-0.29); }
  for(const sx of [-1,1]){ b(0.08,0.06,0.58,trim,sx*W2,H+0.3,0.0); b(0.07,0.3,0.07,frame,sx*W2,H+0.15,0.26); }   /* the arms */
  if(st!=='kohen') b(W2*2+0.2,0.12,0.42,st==='king'?0x6a2440:0xd8d0bb,0,0.06,0.5);          /* the footstool */
  g.position.set(x,0,z); g.rotation.y=o.face||0; ctx.scene.add(g); return g; };
/* ================= WHAT YAHSHAYAHU SAW (Yashayahu 6) =================
   "I saw (YAHUAH) HWHY sitting on a throne, high and lifted up, and the train of His robe filled
   the Hĕḵal. Above it stood seraphim. Each one had six wings: with two he covered his face, with
   two he covered his feet and with two he flew" (6:1-2).
   He who sits on the throne is never drawn: the throne stands in its light, and the light is on
   the seat. The seraphim ("burning ones") are figures of light, their faces and feet covered as
   the verse says, and the third pair beating. */
const lightMat=(c,o)=>new THREE.MeshBasicMaterial({color:c,transparent:o!==undefined&&o<1,opacity:o===undefined?1:o,depthWrite:o===undefined||o>=1,fog:false});
/* one wing: a broad vane of feathers from its root out along +x, its face in the x-y plane; the
   feathers burn gold toward the tips */
function seraphWing(len,wid){
  const w=new THREE.Group();
  const vane=new THREE.Mesh(new THREE.BoxGeometry(len,wid,0.03),lightMat(0xffefc8)); vane.position.x=len/2; w.add(vane);
  for(let k=0;k<5;k++){ const fl=len*(0.55+0.45*(k/4)), fy=-wid/2+wid*(k+0.5)/5;
    const f=new THREE.Mesh(new THREE.BoxGeometry(fl,wid*0.22,0.035),lightMat(k%2?0xffdc8a:0xfff6e0));
    f.position.set(fl/2+len*0.06,fy,0.02*(k%2?1:-1)); w.add(f);
    const tip=new THREE.Mesh(new THREE.BoxGeometry(len*0.18,wid*0.2,0.04),lightMat(k%2?0xff9a30:0xffb84a));     /* the burning ones: their feathers end in fire */
    tip.position.set(fl+len*0.06-len*0.06,fy,0.03); w.add(tip); }
  return w; }
/* the six wings, set on a figure (in the figure's own measure: a man some 1.8 high, facing +z) */
W.seraphWings=function(fig){
  const pair=(len,wid,place)=>[1,-1].map(sx=>{ const w=seraphWing(len,wid); w.scale.x=sx; place(w,sx); fig.add(w); return w; });
  /* two that fly: out from the shoulders, high and wide */
  const fly=pair(2.3,0.62,(w,sx)=>{ w.position.set(sx*0.24,1.38,-0.16); w.rotation.z=sx*0.42; });
  /* two over the face: from the shoulders, folded in across before it */
  /* (each folded wing is turned about, so it lies inward across the body, not out from it) */
  const face=pair(0.54,0.48,(w,sx)=>{ w.position.set(sx*0.42,1.62,0.3); w.rotation.y=Math.PI; w.rotation.z=sx*0.06; });
  /* two over the feet: from the hips, folded down across the legs */
  const feet=pair(0.7,0.62,(w,sx)=>{ w.position.set(sx*0.44,0.36,0.32); w.rotation.y=Math.PI; w.rotation.z=-sx*0.22; });
  fig.userData.wings={fly,face,feet,t:Math.random()*6};
  return fig.userData.wings; };
W.seraphWingsTick=function(fig,dt){ const W2=fig.userData.wings; if(!W2) return;
  W2.t+=dt; const a=Math.sin(W2.t*5.2)*0.42;
  W2.fly[0].rotation.z=0.42+a; W2.fly[1].rotation.z=-(0.42+a); };
/* the throne, high and lifted up: a dais of light in three steps, the seat and its back, all
   white fire edged with gold, borne in the air (`lift` metres over the floor) */
W.gloryThrone=function(ctx,x,z,o){ o=o||{};
  const g=new THREE.Group(), s=o.s||1, lift=o.lift||0;
  const b=(w,h,d,c,px,py,pz,op)=>{ const q=new THREE.Mesh(new THREE.BoxGeometry(w*s,h*s,d*s),lightMat(c,op)); q.position.set(px*s,lift+py*s,pz*s); g.add(q); return q; };
  b(3.6,0.36,3.0,0xf4e6c4,0,0.18,0); b(3.66,0.08,3.06,0xd9a83a,0,0.38,0);
  b(2.9,0.36,2.4,0xf8eed6,0,0.58,-0.15); b(2.96,0.08,2.46,0xd9a83a,0,0.78,-0.15);
  b(2.2,0.36,1.8,0xfdf6e8,0,0.98,-0.3); b(2.26,0.08,1.86,0xd9a83a,0,1.18,-0.3);
  b(1.7,0.28,1.3,0xfffaf0,0,1.48,-0.35); b(1.76,0.06,1.36,0xe8b850,0,1.64,-0.35);         /* the seat */
  b(1.7,2.6,0.26,0xfff6e6,0,2.9,-0.92); b(1.9,0.18,0.34,0xe8b850,0,4.25,-0.92);     /* its back, and the crest */
  for(const sx of [-1,1]){ b(0.2,0.6,1.2,0xfff4dc,sx*0.85,1.95,-0.35); b(0.26,0.1,1.26,0xe8b850,sx*0.85,2.28,-0.35); }   /* its arms */
  g.position.set(x,0,z); g.rotation.y=o.face||0; ctx.scene.add(g); return g; };
/* THE COURT OF HEAVEN, where the vision is seen: "I saw (YAHUAH) HWHY sitting on a throne, high
   and lifted up" — not the stone of the earthly house but the house above it. A vault of golden
   light all about (it is drawn whatever the hour below), a floor of cloud, and the pillars of the
   heavenly house in two rows of light down to the throne. Centred on its own origin; +z toward
   the one who sees, -z toward the throne. */
W.heavenCourt=function(ctx,x,z,o){ o=o||{};
  const g=new THREE.Group(), R=o.r||150;
  /* the vault: gold-white overhead, warm at the horizon, pale under the cloud */
  const sg=new THREE.SphereGeometry(R,40,24), col=new Float32Array(sg.attributes.position.count*3);
  for(let i=0;i<sg.attributes.position.count;i++){ const y=sg.attributes.position.getY(i)/R;
    /* deep azure overhead ("as it were the body of the heavens in clearness", Shemoth 24:10), gold low about
       the horizon where the light of the throne fills it, and pale under the floor of cloud */
    const u=Math.max(0,y), hz=Math.exp(-Math.abs(y)*5);
    const c=y>0?[0.16+0.84*hz,0.30+0.55*hz+0.1*(1-u),0.62+0.18*hz]:[0.96,0.92,0.84];
    col[i*3]=c[0]; col[i*3+1]=c[1]; col[i*3+2]=c[2]; }
  sg.setAttribute('color',new THREE.BufferAttribute(col,3));
  /* (opaque, and writing its depth, so nothing of the earth below shows through it) */
  const vault=new THREE.Mesh(sg,new THREE.MeshBasicMaterial({vertexColors:true,side:THREE.BackSide,fog:false})); g.add(vault);
  /* the floor of cloud: a soft disc, and banks of cloud heaped about its edge and under it */
  const cv=document.createElement('canvas'); cv.width=cv.height=256; const c2=cv.getContext('2d');
  const gr=c2.createRadialGradient(128,128,10,128,128,128); gr.addColorStop(0,'rgba(255,255,255,1)'); gr.addColorStop(0.6,'rgba(255,250,240,0.9)'); gr.addColorStop(1,'rgba(255,248,232,0)');
  c2.fillStyle=gr; c2.fillRect(0,0,256,256);
  for(let k=0;k<160;k++){ const a=Math.random()*6.28, d=Math.random()*110, r=8+Math.random()*26;
    const pg=c2.createRadialGradient(128+Math.cos(a)*d,128+Math.sin(a)*d,0,128+Math.cos(a)*d,128+Math.sin(a)*d,r);
    pg.addColorStop(0,'rgba(255,255,255,0.35)'); pg.addColorStop(1,'rgba(255,255,255,0)'); c2.fillStyle=pg; c2.fillRect(0,0,256,256); }
  const tex=new THREE.CanvasTexture(cv);
  const floor=new THREE.Mesh(new THREE.CircleGeometry(o.floor||70,48),new THREE.MeshBasicMaterial({map:tex,transparent:true,depthWrite:false,fog:false,color:0xf2ecdf}));
  floor.rotation.x=-Math.PI/2; floor.position.y=-0.05; g.add(floor);
  const puff=new THREE.SpriteMaterial({map:tex,transparent:true,depthWrite:false,fog:false,color:0xfffdf6,opacity:0.9});
  for(let k=0;k<46;k++){ const a=k/46*Math.PI*2+Math.random()*0.2, d=(o.floor||70)*(0.72+Math.random()*0.5), sp=new THREE.Sprite(puff);
    const s2=18+Math.random()*26; sp.scale.set(s2,s2*0.55,1); sp.position.set(Math.cos(a)*d,-6+Math.random()*10,Math.sin(a)*d); g.add(sp); }
  for(let k=0;k<20;k++){ const sp=new THREE.Sprite(puff), s2=26+Math.random()*30; sp.scale.set(s2,s2*0.5,1);
    sp.position.set((Math.random()-0.5)*90,-10-Math.random()*8,(Math.random()-0.5)*90); g.add(sp); }
  /* and before the throne, "as it were a paved work of a sapphire stone" (Shemoth 24:10) */
  if(o.pave){ const P=o.pave, tw=1.2;
    for(let ix=0;ix<Math.round(P.w/tw);ix++) for(let iz=0;iz<Math.round(P.d/tw);iz++){
      const c=((ix+iz)%2)?0x2a4fa8:0x1f3f90, m=lamb(c,mixHex(c,0x000000,0.6));
      const q=new THREE.Mesh(new THREE.BoxGeometry(tw*0.97,0.12,tw*0.97),m);
      q.position.set(-P.w/2+(ix+0.5)*tw,0.02,P.z-P.d/2+(iz+0.5)*tw); g.add(q); }
    const edge=lamb(0xe8b850,0x6a4a10);
    for(const sx of [-1,1]){ const e=new THREE.Mesh(new THREE.BoxGeometry(0.2,0.16,P.d),edge); e.position.set(sx*P.w/2,0.04,P.z); g.add(e); }
    const e2=new THREE.Mesh(new THREE.BoxGeometry(P.w,0.16,0.2),edge); e2.position.set(0,0.04,P.z+P.d/2); g.add(e2); }
  /* the pillars of the house above, two rows of light from the one who sees to the throne */
  const pm=new THREE.MeshLambertMaterial({color:0xf6f0e2,emissive:0x8a8070,fog:false});
  const cap=new THREE.MeshLambertMaterial({color:0xe8b850,emissive:0x7a5a20,fog:false});
  for(const sx of [-1,1]) for(let k=0;k<6;k++){ const pz=18-k*7.2, px=sx*(o.aisle||11);
    const col2=new THREE.Mesh(new THREE.CylinderGeometry(0.8,0.95,o.ph||34,14),pm); col2.position.set(px,(o.ph||34)/2,pz); g.add(col2);
    const ring=new THREE.Mesh(new THREE.CylinderGeometry(1.25,1.25,0.5,14),cap); ring.position.set(px,0.25,pz); g.add(ring);
    const top=ring.clone(); top.position.y=(o.ph||34)-0.25; g.add(top); }
  g.position.set(x,o.y||0,z); ctx.scene.add(g); return g; };
/* ---- A FEATHERED WING, BLOCK BY BLOCK ----
   A broad wing, not a fan of sticks: column by column out along its span (+x from the root), each
   column hanging from the leading edge (-y) in three rows — the coverts, the secondaries, and the
   long primaries whose ends are cut unevenly as feathers are — broad through the middle of the wing
   and narrowing to the tip, its colour running from the root's to the tip's along the span. */
const lamb=(c,e)=>new THREE.MeshLambertMaterial({color:c,emissive:e===undefined?0x000000:e,fog:false});
const _matCache={};
function lambC(c,e){ const k=c+':'+e; return _matCache[k]||(_matCache[k]=lamb(c,e)); }
function mixHex(a,b,u){ const ch=(x,s)=>(x>>s)&255, m=s=>Math.round(ch(a,s)+(ch(b,s)-ch(a,s))*u);
  return (m(16)<<16)|(m(8)<<8)|m(0); }
function voxWing(o){
  const g=new THREE.Group(), L=o.span, C=o.chord, n=o.n||12, w=L/n, P=o.pal, T=o.th||0.09;
  const box=(bw,bh,bd,m,x,y,z)=>{ const q=new THREE.Mesh(new THREE.BoxGeometry(bw,bh,bd),m); q.position.set(x,y,z); g.add(q); return q; };
  const glow=c=>mixHex(c,0x000000,0.72);
  for(let i=0;i<n;i++){ const u=(i+0.5)/n, x=u*L;
    /* broad through the middle, tapering to a point; the tip curls up a little */
    const ch=C*(0.55+0.55*Math.sin(Math.PI*Math.min(1,u*1.15)))*(u>0.82?Math.max(0.25,1-(u-0.82)/0.2):1);
    const lift=C*0.35*u*u;
    const jag=((i*7)%3-1)*0.06*C;                                       /* the feathers' uneven ends */
    const cov=ch*0.3, sec=ch*0.3, pri=ch*0.4+jag;
    const cCov=mixHex(P.covert,P.covertTip,u), cSec=mixHex(P.root,P.mid,u), cPri=mixHex(P.mid,P.tip,Math.pow(u,0.8)), cEnd=mixHex(P.tip,P.end,u);
    box(w*1.06,0.12,T*1.6,lambC(P.bone,glow(P.bone)),x,lift,0.02);                                   /* the leading edge */
    box(w*1.04,cov,T,lambC(cCov,glow(cCov)),x,lift-cov/2,T*0.6);                                     /* the coverts */
    box(w*1.02,sec,T,lambC(cSec,glow(cSec)),x,lift-cov-sec/2,T*0.3);                                 /* the secondaries */
    box(w*0.96,pri*0.7,T,lambC(cPri,glow(cPri)),x,lift-cov-sec-pri*0.35,0);                          /* the primaries */
    box(w*0.9,pri*0.3,T,lambC(cEnd,glow(cEnd)),x,lift-cov-sec-pri*0.85,-T*0.2); }                    /* and their burning ends */
  return g; }
/* the blue and gold of the burning ones' wings, and the gold and ivory of the living ones' */
const WING_SERAPH={bone:0xf2c24a,covert:0x1c3478,covertTip:0x2f57b0,root:0x23428e,mid:0x3e6ac4,tip:0x6f8fd8,end:0xf6c04a};
const WING_LIVING={bone:0xf0d070,covert:0xf8f2e2,covertTip:0xf2e6c4,root:0xf4ecd8,mid:0xeedcae,tip:0xf0d48a,end:0xe8b850};
/* ---- BLOCKS GATHERED INTO ONE ----
   A figure laid block by block, as the land is: every block is put into one of two meshes, the
   lit (shaded by the light of the scene) and the burning (its own light, never shaded), each
   block coloured in its corners — so a figure of some thousands of blocks is two draws. push()
   and pop() carry a frame, so a wing can be laid flat in its own plane and set at its angle. */
const _ub=new THREE.BoxGeometry(1,1,1).toNonIndexed(), _ubP=_ub.attributes.position.array, _ubN=_ub.attributes.normal.array;
const _vm=new THREE.Matrix4(), _vn=new THREE.Matrix3(), _vv=new THREE.Vector3(), _vc=new THREE.Color(), _vq=new THREE.Quaternion(), _ve=new THREE.Euler(), _vs=new THREE.Vector3(), _vp=new THREE.Vector3();
function Vox(){ this.L={p:[],n:[],c:[]}; this.G={p:[],n:[],c:[]}; this.P={p:[],n:[],c:[]}; this.A={p:[],n:[],c:[]}; this.M=new THREE.Matrix4(); this.st=[]; }
Vox.prototype.push=function(x,y,z,rx,ry,rz,sx){ this.st.push(this.M.clone());
  _ve.set(rx||0,ry||0,rz||0); _vq.setFromEuler(_ve); _vm.compose(_vp.set(x,y,z),_vq,_vs.set(sx||1,1,1)); this.M.multiply(_vm); return this; };
Vox.prototype.pop=function(){ this.M=this.st.pop(); return this; };
/* one block: w×h×d about (x,y,z), turned `ry` about its upright; `glow` — it burns, or 'pale' — it is
   white that shines: shaded by the light, but never darkened past a bright shadow */
Vox.prototype.box=function(w,h,d,col,x,y,z,glow,ry){ const B=glow==='pale'?this.P:glow==='aglow'?this.A:glow?this.G:this.L;
  _ve.set(0,ry||0,0); _vq.setFromEuler(_ve); _vm.compose(_vp.set(x,y,z),_vq,_vs.set(w,h,d)).premultiply(this.M);
  _vn.getNormalMatrix(_vm); _vc.setHex(col);
  for(let k=0;k<36;k++){ _vv.fromArray(_ubP,k*3).applyMatrix4(_vm); B.p.push(_vv.x,_vv.y,_vv.z);
    _vv.fromArray(_ubN,k*3).applyMatrix3(_vn).normalize(); B.n.push(_vv.x,_vv.y,_vv.z); B.c.push(_vc.r,_vc.g,_vc.b); }
  return this; };
const VOX_LIT=new THREE.MeshLambertMaterial({vertexColors:true,emissive:0x101018,fog:false}),
      VOX_GLOW=new THREE.MeshBasicMaterial({vertexColors:true,fog:false}),
      VOX_PALE=new THREE.MeshLambertMaterial({vertexColors:true,emissive:0x5a564e,fog:false}),
      VOX_AGLOW=new THREE.MeshLambertMaterial({vertexColors:true,emissive:0x5e5038,fog:false});   /* (the feathers of the burning ones: lit, and warm with their own light in the shadow) */
Vox.prototype.into=function(par){ const out=[];
  for(const [B,m] of [[this.L,VOX_LIT],[this.G,VOX_GLOW],[this.P,VOX_PALE],[this.A,VOX_AGLOW]]){ if(!B.p.length) continue;
    const geo=new THREE.BufferGeometry();
    geo.setAttribute('position',new THREE.Float32BufferAttribute(B.p,3)); geo.setAttribute('normal',new THREE.Float32BufferAttribute(B.n,3));
    geo.setAttribute('color',new THREE.Float32BufferAttribute(B.c,3)); geo.computeBoundingSphere();
    const q=new THREE.Mesh(geo,m); par.add(q); out.push(q); }
  return out; };
/* ---- A WING OF THE BURNING ONES, BLOCK BY BLOCK ----
   Laid flat in its own plane: out along +x from the root, the bone of it along the top, the
   feathers hanging below (-y) — the coverts, the secondaries, then the long feathers in pairs of
   blocks, each ending a step longer or shorter than the next, and each burning at its end.
   Broad through the middle, narrowing to a tip that turns up. */
/* the feathers of the burning ones: white, warmed with gold, their long feathers gold at the ends */
const SER_WHITE={bone:0xe6c886,cov:0xe8dcc0,cov2:0xd8c296,sec:0xeee2c8,sec2:0xdfcca2,pri:0xf1e8d4,pri2:0xe4d2ae,end:0xf0cd7a,fire:0xdcaa48};
const SER_FLY=0.62;   /* (how high the flying wings are lifted from the level) */
function pixWing(V,o){
  const P=o.pal, v=o.v||0.1, L=o.span, C=o.chord, th=o.th||0.08, n=Math.max(4,Math.round(L/v));
  for(let i=0;i<n;i++){ const u=(i+0.5)/n, x=(i+0.5)*v;
    const lift=C*(o.lift===undefined?0.3:o.lift)*u*u+(u>0.86?(u-0.86)*C*1.6:0);                 /* the tip turns up */
    const ch=C*(0.42+0.58*Math.sin(Math.PI*Math.min(1,u*1.12)))*(u>0.84?Math.max(0.22,1-(u-0.84)/0.2):1);
    const rows=Math.max(2,Math.round(ch/v));
    const f=(i>>1), step=((f*5)%3)+((i&1)?0:1);                                                  /* the feathers' stepped ends */
    const R=rows+step, cov=Math.max(1,Math.round(rows*0.3)), sec=Math.max(1,Math.round(rows*0.3));
    for(let j=0;j<R;j++){ const y=lift-j*v; let c, glow=false, z=0;
      if(j===0){ c=P.bone; z=th*0.25; }
      else if(j<=cov){ c=((j+i)%3===0)?P.cov2:P.cov; z=th*0.5; }                                     /* the coverts, scalloped */
      else if(j<=cov+sec){ c=((j+(i>>1))%3===0)?P.sec2:P.sec; z=th*0.25; }
      else if(j>=R-1){ c=P.fire; glow=true; }                                                       /* and every long feather burns at its end */
      else if(j>=R-2){ c=P.end; glow=true; }
      else c=(i&1)?P.pri2:P.pri;
      V.box(v*1.02,v*1.02,th,c,x,y,z,glow||(o.pale?'pale':o.aglow?'aglow':false)); } } }
/* A SERAPH, "a burning one" (Yashayahu 6:2,6), laid in blocks as the land is: "each one had six
   wings; with two he covered his face, and with two he covered his feet, and with two he flew."
   As the director has him: all wings, white and gold. The two over his face rise from his shoulders
   and cross before it, their ends standing up over his head; the two he flies with are spread wide
   behind him; the two over his feet cross before him from the girdle down, their ends at his feet.
   Between them a white robe and a girdle of gold. No face is seen. `tongs`: one hand is put out from
   under his wings with the tongs he takes the live coal with from off the altar — upright, as a torch,
   until the coal is in them; then he bows and reaches down with them. Some 4 high to the tops of his
   wings, facing +z, his feet at the origin. */
W.seraph=function(o){ o=o||{};
  const g=new THREE.Group(), body=new THREE.Group(), V=new Vox(); g.add(body);           /* (the body rides up and down on the wingbeat) */
  const side=s=>{ if(s>0) return body; const m=new THREE.Group(); m.scale.x=-1; body.add(m); return m; };
  const ROBE=0xf6f1e4, ROBE2=0xe9e1cf, GOLD=0xf0bc44, LIGHT=0xfff1c8;
  /* the robe: close about him from the shoulders to the feet, a little fuller below the girdle */
  for(let y=0.1,k=0;y<2.2;y+=0.1,k++){ const r=y<1.5?0.27+0.08*(1-y/1.5):0.27+0.1*((y-1.5)/0.7);
    V.box(2*r,0.1,2*r*0.82,k%2?ROBE:ROBE2,0,y+0.05,0,'pale'); }
  V.box(0.62,0.11,0.5,GOLD,0,1.52,0);                                                              /* the girdle of gold */
  V.box(0.8,0.16,0.44,ROBE,0,2.22,0,'pale');                                                        /* the shoulders */
  V.box(0.32,0.36,0.32,LIGHT,0,2.5,0,true);                                                         /* his head, hidden in light */
  const W6={fly:[],face:[],feet:[]};
  const wing=(P,x,y,z,ang,flip,span,chord,v)=>{ const pv=new THREE.Group(); pv.position.set(x,y,z); pv.rotation.z=ang; if(flip) pv.scale.y=-1; P.add(pv);
    const Vw=new Vox(); pixWing(Vw,{span,chord,v,pal:SER_WHITE,aglow:true,lift:0.08,th:0.07}); Vw.into(pv); return pv; };
  /* the two over his face: from his shoulders up across before it, crossed, their ends over his head */
  for(const s of [-1,1]) W6.face.push(wing(side(s),0.38,1.9,s>0?0.33:0.3,2.12,false,2.3,0.7,0.075));
  /* the two he flies with: from behind his shoulders, spread wide */
  for(const s of [-1,1]){ const P=side(s), pv=new THREE.Group(); pv.position.set(0.22,2.3,-0.24); pv.rotation.set(0,-0.25,SER_FLY); P.add(pv);
    const Vw=new Vox(); pixWing(Vw,{span:3.2,chord:1.5,v:0.1,pal:SER_WHITE,aglow:true}); Vw.into(pv); W6.fly.push(pv); }
  /* the two over his feet: from the girdle down across before him, crossed, their ends at his feet */
  for(const s of [-1,1]) W6.feet.push(wing(side(s),0.3,1.46,s>0?0.37:0.34,-1.9,false,1.62,0.62,0.075));
  V.into(body);
  /* the hand put out from under his wings, with the tongs */
  if(o.tongs){ const sh=new THREE.Group(); sh.position.set(0.42,2.12,0.05); body.add(sh);
    const Va=new Vox(); Va.box(0.18,0.38,0.18,ROBE2,0,-0.18,0,'pale'); Va.into(sh);
    const el=new THREE.Group(); el.position.set(0,-0.36,0); sh.add(el);
    const Vf=new Vox(); Vf.box(0.16,0.16,0.36,ROBE2,0,0,0.16,'pale'); Vf.box(0.17,0.17,0.05,GOLD,0,0,0.33); Vf.box(0.13,0.13,0.12,LIGHT,0,0,0.41,true); Vf.into(el);
    const hd=new THREE.Group(); hd.position.set(0,0,0.42); el.add(hd);
    sh.rotation.order='YXZ'; sh.rotation.x=-0.25; hd.rotation.x=0.25; sh.rotation.z=0.06;
    const Vt=new Vox();
    for(const q of [-1,1]) Vt.box(0.04,1.05,0.04,0xc89a3a,q*0.035,0.42,0);
    Vt.box(0.11,0.05,0.05,0xe8b850,0,-0.1,0); Vt.box(0.12,0.04,0.12,0xe8b850,0,0.9,0); Vt.into(hd);
    g.userData.tongTip=new THREE.Object3D(); g.userData.tongTip.position.set(0,1.02,0); hd.add(g.userData.tongTip);
    /* the live coal in them, shown while he carries it */
    const coal=new THREE.Mesh(new THREE.BoxGeometry(0.15,0.13,0.15),new THREE.MeshBasicMaterial({color:0xff5a10,fog:false})); coal.position.set(0,1.02,0); coal.visible=false; hd.add(coal); g.userData.coal=coal;
    g.userData.arm={sh,el,hd}; }
  const head=new THREE.Object3D(); head.position.set(0,2.5,0); body.add(head);
  g.rotation.order='YXZ';                                                     /* (he bows forward from his feet, whichever way he is turned) */
  for(const w of [...W6.face,...W6.feet]) w.userData.z0=w.rotation.z;
  g.userData.wings6=W6; g.userData.body=body; g.userData.t=Math.random()*6; g.userData.head=head; g.userData.carry=0;
  return g; };
/* "and with two he flew": the wings spread at his sides beat — down hard, swept forward, and up again
   drawn back — and he rides on them, lifted a little on every stroke; the wings over his face and his
   feet stir with it. The tongs are held up as a torch — and while the coal is in them he bows and
   reaches down with them before him, arm and tongs in one line, their end come in under his own
   middle: so a man kneeling before him has the coal brought to his lips (6:7) */
W.seraphTick=function(g,dt){ const u=g.userData, W6=u.wings6; if(!W6) return; u.t+=dt;
  const p=u.t*4.6, sn=Math.sin(p), beat=sn>0?sn:sn*0.75;                     /* (the downstroke the stronger) */
  for(const w of W6.fly){ w.rotation.z=SER_FLY+0.46*beat; w.rotation.y=-0.25-0.18*Math.cos(p); }
  for(const w of [...W6.face,...W6.feet]) w.rotation.z=w.userData.z0+0.035*Math.sin(p-0.9);
  if(u.body) u.body.position.y=0.07*Math.sin(p-1.4);                          /* lifted after each stroke */
  if(u.arm){ const k=u.carry+=((u.coal&&u.coal.visible?1:0)-u.carry)*Math.min(1,dt*2.5), A=u.arm;
    A.sh.rotation.x=-0.25+(-0.96+0.25)*k; A.sh.rotation.y=-0.3*k; A.el.rotation.x=1.57*k; A.hd.rotation.x=0.25+(1.57-0.25)*k;
    g.rotation.x=0.35*k; } };
/* A LIVING ONE about the throne, as Yahazq'al saw them (1:5-11): the likeness of a man, straight
   legs and the sole of a calf's foot sparkling like burnished bronze, the hands of a man under the
   wings, and four faces — a man before, a lion on the right, an ox on the left, an eagle behind —
   their wings joined upward and two covering their bodies; "their appearance like burning coals of
   fire" (1:13). Some 3.2 high, facing +z. */
W.livingOne=function(o){ o=o||{};
  const g=new THREE.Group();
  const add=(w,h,d,m,x,y,z,par)=>{ const q=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),m); q.position.set(x,y,z); (par||g).add(q); return q; };
  const bronze=lamb(0xc8862e,0x5a3008), amber=lamb(0xe8a040,0x7a3a08), dark=lamb(0x1a120c), white=lamb(0xf4f0e6,0x302c24),
        skin=lamb(0x8a5a32,0x2a1608), beard=lamb(0x2a1a10), mane=lamb(0xc88a2e,0x4a2a08), lionF=lamb(0xdca452,0x4a2a08),
        ox=lamb(0x5a3a22,0x1a0c04), horn=lamb(0x2a2018), beak=lamb(0xf0b020,0x5a3a00), red=lamb(0xa02020,0x300808), tooth=lamb(0xf6f2e8);
  /* legs straight, the feet a calf's, bronze */
  for(const sx of [-1,1]){ add(0.26,1.1,0.28,bronze,sx*0.2,0.65,0); add(0.3,0.16,0.4,lamb(0xe0b050,0x6a4a10),sx*0.2,0.08,0.04); }
  add(0.7,0.95,0.42,amber,0,1.65,0);                                                  /* the body, like coals of fire */
  add(0.72,0.1,0.44,bronze,0,1.2,0);
  /* the hands of a man, held out under the wings */
  for(const sx of [-1,1]){ const a=new THREE.Group(); a.position.set(sx*0.47,2.05,0); a.rotation.z=sx*0.55; g.add(a);
    add(0.18,0.62,0.18,amber,0,-0.3,0,a); add(0.2,0.16,0.12,skin,0,-0.66,0.02,a); }
  /* the head of four faces */
  const H=new THREE.Group(); H.position.set(0,2.4,0); g.add(H);
  add(0.5,0.52,0.5,skin,0,0.26,0,H);
  /* a man before */
  add(0.08,0.06,0.02,dark,-0.11,0.32,0.26,H); add(0.08,0.06,0.02,dark,0.11,0.32,0.26,H); add(0.08,0.12,0.06,skin,0,0.22,0.28,H);
  add(0.42,0.16,0.06,beard,0,0.06,0.26,H); add(0.5,0.1,0.52,beard,0,0.54,0,H);
  /* a lion on the right: the mane about, the muzzle out, its mouth open */
  add(0.2,0.7,0.6,mane,0.32,0.26,-0.02,H); add(0.3,0.26,0.32,lionF,0.55,0.24,0.02,H); add(0.06,0.06,0.08,dark,0.71,0.3,0.02,H);
  add(0.22,0.07,0.24,red,0.6,0.1,0.02,H); add(0.04,0.06,0.04,tooth,0.68,0.13,0.1,H); add(0.04,0.06,0.04,tooth,0.68,0.13,-0.06,H);
  add(0.04,0.06,0.04,dark,0.42,0.36,0.17,H);
  /* an ox on the left: the broad muzzle, and the horns */
  add(0.3,0.3,0.34,ox,-0.56,0.2,0.02,H); add(0.06,0.08,0.1,dark,-0.72,0.18,0.02,H);
  const hornL=add(0.08,0.36,0.08,horn,-0.4,0.66,0.12,H); hornL.rotation.z=0.7; const hornR=add(0.08,0.36,0.08,horn,-0.4,0.66,-0.12,H); hornR.rotation.z=0.7;
  /* an eagle behind: white head, the hooked beak of gold */
  add(0.46,0.42,0.18,white,0,0.3,-0.33,H); add(0.12,0.12,0.26,beak,0,0.24,-0.52,H); add(0.12,0.08,0.06,beak,0,0.16,-0.64,H);
  add(0.06,0.06,0.04,dark,0.13,0.36,-0.43,H); add(0.06,0.06,0.04,dark,-0.13,0.36,-0.43,H);
  /* the wings: two joined upward over it, two covering the body */
  const wing=(span,h0,h1,x,y,z,a,flip)=>{ const w=voxWing({span,chord:h1,pal:WING_LIVING,n:10}); w.position.set(x,y,z); w.rotation.z=a; if(flip) w.scale.y=-1; g.add(w); return w; };
  const up=[ wing(2.2,0.5,1.2, 0.3,2.35,-0.3, 1.25), wing(2.2,0.5,1.2,-0.3,2.35,-0.3, Math.PI-1.25,true) ];
  wing(1.5,0.3,0.55, 0.42,2.0,0.3, Math.PI+1.2); wing(1.5,0.3,0.55,-0.42,2.0,0.34,-1.2,true);
  g.userData.up=up; g.userData.t=Math.random()*6; g.userData.headG=H;
  g.userData.tick=dt=>{ g.userData.t+=dt; const a=Math.sin(g.userData.t*1.6)*0.06; up[0].rotation.z=1.25+a; up[1].rotation.z=Math.PI-1.25-a; };
  return g; };
W.livingOneAt=function(ctx,x,z,o){ const g=W.livingOne(o); const s=o&&o.s||1.2; g.scale.setScalar(s); g.position.set(x,0,z); g.rotation.y=(o&&o.face)||0; ctx.scene.add(g); return g; };
/* "and the house was filled with smoke" (Yashayahu 6:4): banks of grey smoke, not light, rolling and
   rising through the court */
W.smokeCloud=function(ctx,x,z,o){ o=o||{};
  const cv=document.createElement('canvas'); cv.width=cv.height=128; const c2=cv.getContext('2d');
  for(let k=0;k<26;k++){ const px=30+Math.random()*68, py=30+Math.random()*68, r=14+Math.random()*26;
    const gr=c2.createRadialGradient(px,py,0,px,py,r); gr.addColorStop(0,'rgba(255,255,255,0.32)'); gr.addColorStop(1,'rgba(255,255,255,0)');
    c2.fillStyle=gr; c2.fillRect(0,0,128,128); }
  const tex=new THREE.CanvasTexture(cv), g=new THREE.Group(), puffs=[];
  const R=o.r||16, H=o.h||14, N=o.n||46;
  for(let k=0;k<N;k++){ const m=new THREE.SpriteMaterial({map:tex,color:k%3?0x8e8a86:0xa8a49e,transparent:true,opacity:0,depthWrite:false,fog:false});
    const sp=new THREE.Sprite(m), s2=6+Math.random()*9; sp.scale.set(s2,s2,1);
    const a=Math.random()*Math.PI*2, d=Math.sqrt(Math.random())*R;
    sp.position.set(Math.cos(a)*d*(o.sx||1),1+Math.random()*H,Math.sin(a)*d+(o.dz||0)); g.add(sp);
    puffs.push({sp,m,base:sp.position.y,ph:Math.random()*6,sp2:0.3+Math.random()*0.5}); }
  let t=0; g.userData.tick=dt=>{ t+=dt;
    for(const p of puffs){ p.sp.position.y=p.base+((t*p.sp2+p.ph)%4)*0.6; const top=(o.rest!==undefined&&t>(o.hold||10))?o.rest:(o.op||0.62);
      p.m.opacity+=Math.max(-dt*0.08,Math.min(dt*0.25,top-(p.m.opacity||0))); } };          /* (`rest`: after `hold` seconds it thins to a haze) */
  g.position.set(x,0,z); ctx.scene.add(g); return g; };
/* the heavenly altar, from which the coal was taken with the tongs (6:6): gold, a fire of coals on it */
W.heavenAltar=function(ctx,x,z,o){ o=o||{};
  const g=new THREE.Group(), s=o.s||1;
  const b=(w,h,d,c,py)=>{ const q=new THREE.Mesh(new THREE.BoxGeometry(w*s,h*s,d*s),lightMat(c)); q.position.y=py*s; g.add(q); return q; };
  b(1.6,1.1,1.6,0xe8b850,0.55); b(1.8,0.12,1.8,0xf6d27a,1.16); b(1.3,0.14,1.3,0xff7a2a,1.28);
  for(const sx of [-1,1]) for(const sz of [-1,1]){ const h=new THREE.Mesh(new THREE.BoxGeometry(0.18*s,0.3*s,0.18*s),lightMat(0xf6d27a)); h.position.set(sx*0.8*s,1.35*s,sz*0.8*s); g.add(h); }   /* its horns */
  g.position.set(x,0,z); ctx.scene.add(g); return g; };
/* the train of His robe, filling the Hĕḵal: a cloth of light from the seat, down over the dais
   and out over the whole floor to the doors, widening as it goes, stirring as cloth does */
W.robeTrain=function(ctx,x,z,o){ o=o||{};
  const L=o.len||14, W0=o.w0||1.2, W1=o.w1||8, H0=o.h0||2, NX=10, NZ=36;
  const geo=new THREE.BufferGeometry(), P=new Float32Array((NX+1)*(NZ+1)*3), Cc=new Float32Array((NX+1)*(NZ+1)*3), I=[];
  const base=[];
  for(let j=0;j<=NZ;j++){ const t=j/NZ, w=W0+(W1-W0)*Math.min(1,t*1.6), drop=t<0.18?H0*(1-t/0.18):0;
    for(let i=0;i<=NX;i++){ const u=i/NX-0.5, k=(j*(NX+1)+i);
      base.push([u*w, 0.03+drop, t*L]);
      const hem=Math.abs(u)>0.44||j>NZ-2?1:0;                        /* its hem worked in gold */
      Cc[k*3]=1; Cc[k*3+1]=hem?0.82:0.97; Cc[k*3+2]=hem?0.5:0.9; } }
  for(let j=0;j<NZ;j++) for(let i=0;i<NX;i++){ const a=j*(NX+1)+i, b2=a+1, c=a+NX+1, d=c+1; I.push(a,c,b2, b2,c,d); }
  geo.setAttribute('position',new THREE.BufferAttribute(P,3)); geo.setAttribute('color',new THREE.BufferAttribute(Cc,3)); geo.setIndex(I);
  const m=new THREE.Mesh(geo,new THREE.MeshBasicMaterial({vertexColors:true,transparent:true,opacity:0.9,side:THREE.DoubleSide,depthWrite:false,fog:false}));
  const g=new THREE.Group(); g.add(m); g.position.set(x,0,z); g.rotation.y=o.face||0; ctx.scene.add(g);
  let t=0; const set=()=>{ for(let k=0;k<base.length;k++){ const q=base[k], ripple=q[1]<0.2?Math.sin(q[2]*1.3-t*1.4+q[0]*0.8)*0.05+0.05:0;
      P[k*3]=q[0]; P[k*3+1]=q[1]+ripple; P[k*3+2]=q[2]; } geo.attributes.position.needsUpdate=true; geo.computeBoundingSphere(); };
  set(); g.userData.tick=dt=>{ t+=dt; set(); };
  return g; };
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
  /* the Child's face is guarded; another newborn (Yahuchanon, Luke 1:57) is `holy:false` */
  g.userData.holy=o.holy!==false; g.userData.head=head; g.userData.faceDir=new THREE.Vector3(0,0,-1);
  return g; };
/* THE BEASTS are the voyage's beasts, at their true size */
function beast(ctx,kind,x,z){
  const k=K(), g=new THREE.Group(), b=k.makeAnimal(kind);
  if(b){ b.scale.multiplyScalar(1/k.setScale); g.add(b); }
  g.position.set(x,0,z); ctx.scene.add(g); return g; }
W.sheep=function(ctx,x,z,lamb){ const g=beast(ctx,'sheep',x,z); if(lamb) g.scale.setScalar(0.62);
  g.rotation.y=Math.random()*6; g.userData={home:[x,z],t:Math.random()*5,kind:'sheep',roam:2,sp:0.5}; return g; };
W.camel=function(ctx,x,z){ return beast(ctx,'camel',x,z); };
/* A CHARIOT of a great man (Acts 8:28): a car of wood and bronze on two wheels, a seat in it, a pole
   forward to the yoke and a pair of horses under it. Ridden (the `ride` beat), it goes where its
   rider goes, the horses walking on the voyage's own gait. Faces +z. */
/* THE CARRIAGE OF A GREAT MAN (Acts 8:27-31): the treasurer of the Kandake, queen of the Kushites,
   over all her treasure, going home from Yahrushalayim, sitting in his carriage and reading the
   prophet; and he "invited Philip to come up and sit with him". Not a war-car to stand in but a
   travelling carriage of state: a long car of red lacquered wood on four spoked wheels shod in
   bronze, gilded along every rail and boss, a cushioned bench for two at the back and the
   driver's bench before it, a canopy striped in white and the blue of the Nile on four gilded
   posts with a fringe of gold, its curtains tied back, a pole and yoke forward to a pair of
   horses under red and gold. Ridden (the `ride` beat), it goes where its rider goes; others sit
   in it (`aboard`). Faces +z; its origin on the ground under the middle of the car.
   `seatH` the height of its benches, `rideOff` where the rider sits (on the left, the right
   kept for a guest), `side` how far out one gets down. */
W.chariot=function(ctx,x,z){
  const k=K(), g=new THREE.Group(), M={}, m=c=>M[c]||(M[c]=new THREE.MeshLambertMaterial({color:c}));
  const b=(w,h,d,c,px,py,pz,par)=>{ const q=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),m(c)); q.position.set(px,py,pz); (par||g).add(q); return q; };
  const GOLD=0xd4a83a, GOLD2=0xb8892a, LAC=0x7a1e16, LAC2=0x5a1410, WOOD=0x4a2e1c, PURP=0x5a2a6a, LIN=0xf0e8d4, NILE=0x22488a, BRONZE=0x9a7030;
  const FL=0.82, ZB=-1.25, ZF=1.35, HW=0.8;                     /* the floor of the car; its back, its front; its half-width */
  /* the car: floor, sides and back of red lacquer, panelled and gilded */
  b(HW*2,0.1,ZF-ZB,WOOD,0,FL,(ZB+ZF)/2);
  for(const sx of [-1,1]){
    b(0.07,0.62,ZF-ZB,LAC,sx*HW,FL+0.31,(ZB+ZF)/2);
    b(0.1,0.07,ZF-ZB+0.06,GOLD,sx*HW,FL+0.64,(ZB+ZF)/2);           /* the gilded rail */
    b(0.1,0.05,ZF-ZB,GOLD2,sx*HW,FL+0.04,(ZB+ZF)/2);
    for(let i=0;i<4;i++){ const pz=ZB+0.33+i*0.62;                  /* panels, each with a gilded boss */
      b(0.02,0.4,0.48,LAC2,sx*(HW+0.04),FL+0.32,pz);
      const d=new THREE.Mesh(new THREE.CylinderGeometry(0.07,0.07,0.03,10),m(GOLD)); d.rotation.z=Math.PI/2; d.position.set(sx*(HW+0.06),FL+0.32,pz); g.add(d); } }
  b(HW*2,0.95,0.08,LAC,0,FL+0.48,ZB); b(HW*2+0.06,0.07,0.12,GOLD,0,FL+0.97,ZB);     /* the back, high */
  b(HW*2,0.5,0.07,LAC,0,FL+0.25,ZF); b(HW*2+0.06,0.07,0.1,GOLD,0,FL+0.52,ZF);        /* the dash before the driver */
  b(0.9,0.42,0.06,GOLD2,0,FL+0.3,ZF+0.04);
  /* the bench for two at the back, cushioned in purple with gold tassels; the driver's bench before */
  const SEAT=1.28;
  b(1.5,0.1,0.62,WOOD,0,SEAT-0.12,ZB+0.42); b(1.46,0.1,0.58,PURP,0,SEAT-0.03,ZB+0.42);
  b(1.46,0.5,0.1,PURP,0,SEAT+0.3,ZB+0.1);
  for(const sx of [-1,1]) b(0.06,0.14,0.06,GOLD,sx*0.72,SEAT-0.14,ZB+0.72);
  b(1.0,0.1,0.42,WOOD,0,SEAT-0.08,ZF-0.42); b(0.96,0.08,0.4,0x8a2a20,0,SEAT,ZF-0.42);
  /* four wheels, spoked and shod: the great ones behind, the lesser before */
  const wheel=(r,px,pz)=>{ const W0=new THREE.Group(); W0.position.set(px,r,pz); g.add(W0);
    const rim=new THREE.Mesh(new THREE.TorusGeometry(r-0.05,0.055,6,22),m(BRONZE)); rim.rotation.y=Math.PI/2; W0.add(rim);
    const gl=new THREE.Mesh(new THREE.TorusGeometry(r-0.12,0.025,4,22),m(GOLD)); gl.rotation.y=Math.PI/2; gl.position.x=Math.sign(px)*0.04; W0.add(gl);
    for(let i=0;i<10;i++){ const sp=b(0.05,r*2-0.16,0.05,WOOD,0,0,0,W0); sp.rotation.x=i*Math.PI/10; }
    const hub=new THREE.Mesh(new THREE.CylinderGeometry(0.11,0.13,0.26,10),m(GOLD)); hub.rotation.z=Math.PI/2; W0.add(hub);
    return W0; };
  const wheels=[]; for(const sx of [-1,1]){ wheels.push(wheel(0.78,sx*(HW+0.2),ZB+0.55)); wheels.push(wheel(0.58,sx*(HW+0.16),ZF-0.3)); }
  b((HW+0.24)*2,0.1,0.1,WOOD,0,0.78,ZB+0.55); b((HW+0.2)*2,0.1,0.1,WOOD,0,0.58,ZF-0.3);       /* the axles */
  /* the canopy: four gilded posts, a roof striped white and Nile blue, a fringe of gold, the curtains tied back */
  const TOP=2.82, PZ=[ZB+0.02,ZF-0.02];
  for(const sx of [-1,1]) for(const pz of PZ){ b(0.07,TOP-FL,0.07,GOLD,sx*(HW-0.02),(TOP+FL)/2,pz);
    const tie=new THREE.Mesh(new THREE.CylinderGeometry(0.1,0.13,0.9,8),m(LIN)); tie.position.set(sx*(HW-0.02),TOP-0.75,pz); g.add(tie);
    b(0.24,0.04,0.24,GOLD,sx*(HW-0.02),TOP-0.75,pz); }
  const n=9, RW=(HW+0.12)*2, L=ZF-ZB+0.3;
  for(let i=0;i<n;i++){ const px=-RW/2+RW*(i+0.5)/n, t=px/(RW/2), y=TOP+0.22*(1-t*t);
    const st=b(RW/n+0.005,0.05,L,i%2?NILE:LIN,px,y,(ZB+ZF)/2); st.rotation.z=Math.atan(-0.44*t/(RW/2)); }
  for(const sz of [-1,1]){ b(RW,0.2,0.03,GOLD,0,TOP-0.06,(ZB+ZF)/2+sz*L/2); for(let i=0;i<14;i++) b(0.04,0.12,0.04,GOLD2,-RW/2+0.06+i*(RW-0.12)/13,TOP-0.22,(ZB+ZF)/2+sz*L/2); }
  for(const sx of [-1,1]){ b(0.03,0.2,L,GOLD,sx*RW/2,TOP-0.06,(ZB+ZF)/2); for(let i=0;i<12;i++) b(0.04,0.12,0.04,GOLD2,sx*RW/2,TOP-0.22,(ZB+ZF)/2-L/2+0.08+i*(L-0.16)/11); }
  const fin=new THREE.Mesh(new THREE.SphereGeometry(0.11,10,8),m(GOLD)); fin.position.set(0,TOP+0.32,(ZB+ZF)/2); g.add(fin);
  /* the step up behind, and the pole and yoke forward */
  b(0.6,0.05,0.24,GOLD2,0,0.42,ZB-0.16); b(0.05,0.4,0.05,GOLD2,-0.26,0.62,ZB-0.06); b(0.05,0.4,0.05,GOLD2,0.26,0.62,ZB-0.06);
  const PZ0=ZF, PZ1=ZF+3.3;
  const pole=b(0.12,0.12,PZ1-PZ0,WOOD,0,0.92,(PZ0+PZ1)/2); b(0.14,0.04,0.3,GOLD,0,0.98,PZ1-0.1);
  b(1.7,0.1,0.12,WOOD,0,1.5,PZ1-0.35); for(const sx of [-1,1]) b(0.14,0.14,0.14,GOLD,sx*0.85,1.5,PZ1-0.35);
  /* the pair, under caparisons of red edged with gold, plumed */
  const team=[];
  for(const sx of [-0.56,0.56]){ const h=k.makeAnimal&&k.makeAnimal('horse'); if(!h) continue;
    const hg=new THREE.Group(); h.scale.multiplyScalar(1/k.setScale); h.updateMatrixWorld(true);
    const bb=new THREE.Box3().setFromObject(h), hh=bb.max.y, hl=bb.max.z-bb.min.z, cz=(bb.max.z+bb.min.z)/2;      /* measured in its own frame */
    hg.add(h); hg.position.set(sx,0,PZ1-1.1); g.add(hg); team.push({m:h});
    const back=hh*0.74;
    b(0.64,0.04,hl*0.42,0x9a1e1a,0,back+0.02,cz-hl*0.06,hg); b(0.66,0.05,0.05,GOLD,0,back+0.04,cz-hl*0.06+hl*0.21,hg); b(0.66,0.05,0.05,GOLD,0,back+0.04,cz-hl*0.06-hl*0.21,hg);
    for(const sd of [-1,1]){ b(0.03,0.42,hl*0.42,0x9a1e1a,sd*0.32,back-0.19,cz-hl*0.06,hg); b(0.035,0.05,hl*0.42,GOLD,sd*0.33,back-0.4,cz-hl*0.06,hg); }
    b(0.08,0.28,0.08,0xc81e1e,0,hh+0.06,bb.max.z-hl*0.12,hg); }                   /* a red plume over the brow */
  g.userData.team=team; g.userData.wheels=wheels; g.userData.seatH=SEAT; g.userData.rideOff=[-0.38,ZB+0.42]; g.userData.side=1.45;
  g.userData.seats={guest:[0.38,0,ZB+0.42],driver:[0,SEAT+0.02,ZF-0.42]};
  g.position.set(x,0,z); ctx.scene.add(g); return g; };
/* KEPHA'S VISION (Acts 10:11-12): "a vessel like a great linen sheet, bound at the four corners,
   descending to him and let down to the earth, in which were all kinds of four-footed beasts of
   the earth, wild beasts, creeping creatures and the birds of the shamayim." A sheet of linen
   sagging under its load, its four corners held up by cords of light that go up into the opened
   shamayim (light, never figures), and in it the beasts of the field and the wild, the creeping
   things and the birds, clean and unclean together, alive and moving. Centred, `n` metres across. */
W.vision=function(ctx,x,z,o){
  o=o||{}; const k=K(), g=new THREE.Group(), N=o.n||7, H=N/2, SAG=1.25;
  /* the sag of the cloth at (u,v) in -1..1: deepest in the middle, its edges dropping a little between the corners */
  const sag=(u,v)=>-SAG*(1-u*u)*(1-v*v)-0.28*(u*u*(1-v*v)+v*v*(1-u*u));
  const geo=new THREE.PlaneGeometry(N,N,20,20); geo.rotateX(-Math.PI/2);
  const P=geo.attributes.position; for(let i=0;i<P.count;i++){ const u=P.getX(i)/H, v=P.getZ(i)/H;
    P.setY(i,sag(u,v)+Math.sin(u*9+v*5)*0.025); }
  geo.computeVertexNormals();
  const linen=new THREE.MeshLambertMaterial({color:0xe8e0cc,emissive:0x141210,side:THREE.DoubleSide});
  g.add(new THREE.Mesh(geo,linen));
  /* a hem along each edge, the corners bound and knotted */
  const hem=new THREE.MeshLambertMaterial({color:0xd8ceb4,emissive:0x2a2418});
  for(let s=0;s<4;s++){ const pts=[]; for(let i=0;i<=20;i++){ const a=-1+i/10, u=s<2?a:(s===2?-1:1), v=s<2?(s===0?-1:1):a; pts.push(new THREE.Vector3(u*H,sag(u,v)+0.02,v*H)); }
    g.add(new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts),40,0.05,5,false),hem)); }
  /* the cords of light from its four corners up into the opened shamayim */
  const beam=new THREE.MeshBasicMaterial({color:0xfff6dc,transparent:true,opacity:0.4,blending:THREE.AdditiveBlending,depthWrite:false});
  const UP=60, TOP=[0,UP,0];
  for(const [u,v] of [[-1,-1],[1,-1],[-1,1],[1,1]]){
    const a=new THREE.Vector3(u*H,0.05,v*H), b=new THREE.Vector3(TOP[0]+u*1.2,TOP[1],TOP[2]+v*1.2), L=a.distanceTo(b);
    const c=new THREE.Mesh(new THREE.CylinderGeometry(0.05,0.12,L,6,1,true),beam);
    c.position.copy(a).add(b).multiplyScalar(0.5); c.lookAt(b); c.rotateX(Math.PI/2); g.add(c);
    const knot=new THREE.Mesh(new THREE.SphereGeometry(0.16,8,6),hem); knot.position.copy(a); g.add(knot); }
  /* and in it, all kinds — set where the cloth bears them up, each facing its own way */
  const live=[], put=(kind,u,v,ry,sc)=>{ let b=null;
    if(kind==='frog'||kind==='turtle') b=W.creature(ctx,kind);
    else if(k.makeAnimal){ b=k.makeAnimal(kind); if(b) b.scale.multiplyScalar((sc||1)/k.setScale); }
    if(!b) return null; const h=new THREE.Group(); h.add(b);
    if(kind==='frog'||kind==='turtle') b.scale.multiplyScalar(sc||1.6);
    h.position.set(u*H,sag(u,v),v*H); h.rotation.y=ry; g.add(h); live.push({h,b,ry,ph:hash(u*7,v*5)*6.28,kind,ent:{m:b}}); return h; };
  /* the four-footed beasts of the earth */
  put('camel',-0.42,-0.30,0.6); put('pig',0.10,-0.52,2.2); put('hare',-0.68,0.42,1.0); put('goat',0.52,-0.15,-1.9);
  put('donkey',-0.15,0.58,2.8,0.9);
  /* the wild beasts */
  put('lion',0.38,0.36,-2.4); put('bear',-0.02,0.05,-0.5); put('leopard',0.70,0.62,3.6); put('wolf',-0.62,0.05,1.8);
  put('boar',0.30,-0.70,-0.9); put('hyena',-0.40,-0.72,0.3);
  /* the creeping creatures */
  put('viper',0.62,0.12,1.2); put('lizard',-0.10,-0.26,-2.6); put('scorpion',0.15,0.30,0.4); put('hedgehog',-0.80,-0.55,2.0);
  put('frog',0.82,-0.48,0.2); put('turtle',-0.32,0.80,-1.1); put('crocodile',0.05,0.82,1.57,0.45);
  /* and the birds of the shamayim: some come down on it, some about it on the wing */
  const birds=[];
  if(k.makeBird){
    for(const [type,u,v,ry] of [['eagle',-0.98,-0.98,0.8],['owl',0.98,-0.98,-0.8],['crow',0.98,0.98,-2.4],['dove',-0.55,0.20,2.0],['gull',0.45,-0.45,-1.2]]){
      const b=k.makeBird(type); if(!b) continue; b.scale.multiplyScalar(1/k.setScale); const h=new THREE.Group(); h.add(b);
      h.position.set(u*H,sag(u,v)+(Math.abs(u)>0.9?0.22:0.12),v*H); h.rotation.y=ry; g.add(h);
      birds.push({h,b,perch:true,ph:hash(u,v)*6}); }
    ['eagle','crow','dove','gull','crow','dove','eagle'].forEach((type,i)=>{ const b=k.makeBird(type); if(!b) return;
      b.scale.multiplyScalar(1/k.setScale); const h=new THREE.Group(); h.add(b); g.add(h);
      birds.push({h,b,perch:false,r:H*0.8+i*0.55,y:2.2+(i%3)*1.1,w:(i%2?1:-1)*(0.45+i*0.05),ph:i*0.9}); }); }
  let T=0;
  g.userData.tick=dt=>{ T+=dt;
    for(const L of live){ L.h.rotation.y=L.ry+Math.sin(T*0.5+L.ph)*0.35;               /* each looking about it */
      if(k.tickGait&&L.kind!=='frog'&&L.kind!=='turtle') k.tickGait(L.ent,L.kind,Math.max(0,Math.sin(T*0.4+L.ph))*0.6,dt); }
    for(const B of birds){ const w=B.b.userData&&B.b.userData.wings;
      if(B.perch){ if(w&&w[0]){ const a=Math.max(0,Math.sin(T*1.1+B.ph))>0.97?Math.sin(T*14)*0.6:0.05; w[0].rotation.z=a; w[1].rotation.z=-a; } continue; }
      const a=T*B.w+B.ph; B.h.position.set(Math.cos(a)*B.r,B.y+Math.sin(T*1.3+B.ph)*0.3,Math.sin(a)*B.r); B.h.rotation.y=-a+(B.w>0?0:Math.PI);
      if(w&&w[0]){ const f=Math.sin(T*8+B.ph)*0.6; w[0].rotation.z=f; w[1].rotation.z=-f; } } };
  g.position.set(x,o.y||0,z); ctx.scene.add(g); return g; };
/* THE LIVING THINGS OF A PLACE —the voyage's own beasts and creeping things, the kinds of that
   land, wandering about their ground on the voyage's own gait: `n` of a kind about (x,z) within
   `r` metres, going at `sp` metres a second. They are the scene's flock, so they keep to it. */
W.wild=function(ctx,kind,x,z,n,r,sp){
  for(let k=0;k<(n||1);k++){ const a=hash(x+k*7.1,z-k*3.3)*6.28, d=hash(z+k,x-k)*(r||6);
    const px=x+Math.cos(a)*d, pz=z+Math.sin(a)*d, g=beast(ctx,kind,px,pz);
    g.rotation.y=hash(px,pz)*6.28;
    g.userData={home:[x,z],t:hash(k,x)*4,kind,roam:r||6,sp:sp||0.6}; ctx.flock.push(g); } };
W.donkey=function(ctx,x,z){ return beast(ctx,'donkey',x,z); };
/* A GARMENT made by hand, held up by its shoulders (Acts 9:39): a tunic hanging from where it is held —
   its body, its short sleeves, a band at the hem, the folds of the cloth — the group's origin at its top */
W.garment=function(ctx,t){ const g=new THREE.Group(), c=new THREE.Color(t.color||0xe6dcc0), w=t.w||0.62, h=t.h||0.95;
  const M=k=>new THREE.MeshLambertMaterial({color:c.clone().multiplyScalar(k),side:THREE.DoubleSide});
  const bx=(W2,H,D,m,x,y,z)=>{ const q=new THREE.Mesh(new THREE.BoxGeometry(W2,H,D),m); q.position.set(x,y,z); g.add(q); return q; };
  bx(w,h,0.025,M(1),0,-h/2,0.12);                                                  /* the body of it */
  for(const sx of [-1,1]) bx(0.2,0.2,0.025,M(0.96),sx*(w/2+0.09),-0.12,0.12);     /* the sleeves */
  bx(w,0.07,0.03,M(t.hem?1:0.78),0,-h+0.035,0.12);                                 /* the hem */
  for(const fx of [-0.18,0.02,0.2]) bx(0.03,h*0.8,0.03,M(0.86),fx*w/0.62,-h*0.55,0.125);   /* its folds */
  ctx.scene.add(g); return g; };
/* A CHAIN between two wrists, or a wrist and a ring in the wall (Acts 12:6; 16:26): links of iron the
   engine hangs between its two ends, each frame (story/engine.js, chainTick), and a cuff at each end */
W.chain=function(ctx,t){ const g=new THREE.Group(), n=t.n||40;
  const m=new THREE.MeshLambertMaterial({color:0x2e3036}), hi=new THREE.MeshLambertMaterial({color:0x4a4d55});
  /* ONE LINK: an oblong loop of iron bars, open in the middle, `LK` long — the next link passes through it */
  const LK=0.2, W2=0.12, T=0.035;
  const link=()=>{ const L=new THREE.Group();
    for(const sx of [-1,1]){ const q=new THREE.Mesh(new THREE.BoxGeometry(T,T,LK),sx<0?m:hi); q.position.set(sx*(W2/2-T/2),0,0); L.add(q); }
    for(const sz of [-1,1]){ const q=new THREE.Mesh(new THREE.BoxGeometry(W2,T,T),m); q.position.set(0,0,sz*(LK/2-T/2)); L.add(q); }
    g.add(L); return L; };
  const links=[]; for(let i=0;i<n;i++) links.push(link());
  const cuff=()=>{ const C=new THREE.Group();                                         /* the manacle: a squared band */
    for(const [x,z,w,d] of [[0,-0.055,0.13,0.025],[0,0.055,0.13,0.025],[-0.055,0,0.025,0.13],[0.055,0,0.025,0.13]]){ const q=new THREE.Mesh(new THREE.BoxGeometry(w,0.06,d),hi); q.position.set(x,0,z); C.add(q); }
    g.add(C); return C; };
  g.userData.links=links; g.userData.pitch=LK-T*1.6; g.userData.cuffA=cuff(); g.userData.cuffB=cuff();
  ctx.scene.add(g); return g; };
/* A BROKEN LENGTH OF CHAIN lying on the ground: `n` links along the bearing `ry`, every other one lying
   flat and the one between standing on its edge through them, as iron links fall */
W.chainPiece=function(S,x,z,n,ry){ ry=Math.round(ry/(Math.PI/2))*(Math.PI/2);   /* square to the world, as its blocks are */
  const y0=S.ground(x,z), c=Math.cos(ry), s=Math.sin(ry), IR=0x2e3036, HI=0x4a4d55, LK=0.2, W2=0.12, T=0.035, P=LK-T*1.6;
  const seg=(ax,az,bx,bz,y,h,col)=>{ const x0=Math.min(ax,bx)-T/2, x1=Math.max(ax,bx)+T/2, z0=Math.min(az,bz)-T/2, z1=Math.max(az,bz)+T/2; S.detail(x0,y0+y,z0,x1,y0+y+h,z1,col,{jitter:0}); };
  for(let i=0;i<n;i++){ const d=(i-(n-1)/2)*P, cx=x+c*d, cz=z+s*d, ax=c*LK/2, az=s*LK/2, px=-s*W2/2, pz=c*W2/2;
    if(i%2===0){ for(const k of [-1,1]) seg(cx-ax+px*k*0.85,cz-az+pz*k*0.85,cx+ax+px*k*0.85,cz+az+pz*k*0.85,0,T,k<0?IR:HI);      /* lying flat: its two sides */
      for(const k of [-1,1]) seg(cx+ax*k*0.85-px,cz+az*k*0.85-pz,cx+ax*k*0.85+px,cz+az*k*0.85+pz,0,T,IR); }                         /* and its two ends */
    else { seg(cx-ax,cz-az,cx+ax,cz+az,0,T,IR); seg(cx-ax,cz-az,cx+ax,cz+az,W2-T,T,HI);                                               /* on its edge: its foot and its top */
      for(const k of [-1,1]) seg(cx+ax*k*0.85,cz+az*k*0.85,cx+ax*k*0.85,cz+az*k*0.85,0,W2,IR); } } };                              /* and its two ends upright */
/* a fetter burst open: a squared band of iron, one side of it sprung */
W.shackle=function(S,x,z,ry){ ry=Math.round(ry/(Math.PI/2))*(Math.PI/2); const y0=S.ground(x,z), c=Math.cos(ry), s=Math.sin(ry), r=0.075, T=0.035;
  const pt=(u,v)=>[x+c*u-s*v,z+s*u+c*v], seg=(a,b)=>{ S.detail(Math.min(a[0],b[0])-T/2,y0,Math.min(a[1],b[1])-T/2,Math.max(a[0],b[0])+T/2,y0+0.06,Math.max(a[1],b[1])+T/2,0x3a3c42,{jitter:0}); };
  seg(pt(-r,-r),pt(r,-r)); seg(pt(-r,-r),pt(-r,r)); seg(pt(-r,r),pt(0,r)); seg(pt(r,-r),pt(r+0.05,r*0.4)); W.chainPiece(S,x+c*0.22,z+s*0.22,2,ry); };
/* a garland of leaves and flowers, such as were hung on the beasts brought to an altar of the nations (Acts 14:13) */
W.wreath=function(ctx){ const g=new THREE.Group();
  g.add(new THREE.Mesh(new THREE.TorusGeometry(0.22,0.05,6,14),new THREE.MeshLambertMaterial({color:0x4e7a30})));
  for(let k=0;k<7;k++){ const a=k/7*6.28, f=new THREE.Mesh(new THREE.BoxGeometry(0.07,0.07,0.07),new THREE.MeshLambertMaterial({color:[0xe8d040,0xf0ece0,0xc03a2a][k%3]}));
    f.position.set(Math.cos(a)*0.22,Math.sin(a)*0.22,0.04); g.add(f); }
  g.rotation.x=Math.PI/2; const h=new THREE.Group(); h.add(g); ctx.scene.add(h); return h; };
/* a beast of the townsfolk's (W.folk): an ass on the road, an ox at the plough — theirs to lead, not the scene's flock */
W.donkeyFree=function(ctx,x,z,kind){ return beast(ctx,kind||'donkey',x,z); };
})();
