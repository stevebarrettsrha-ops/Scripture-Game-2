/* ============================================================
   THE VOYAGE — all the earth within the firmament  (v2)
   Rebuilt to read as true Minecraft: 16×16 pixel block textures
   (nearest-filtered), per-face light shading, stepped plank
   roofs on cobblestone-based houses, robed big-nosed villagers,
   a square sun, flat drifting clouds, farms, hay, lamp posts.
   Same earth, same nations, same courses of the lights.
   ============================================================ */
window.__VOYAGE=function(){
'use strict';
const D=document, $=id=>D.getElementById(id);
const COUNTRIES=window.EARTH.list, VERSES=window.EARTH.verseList, RIVERS=window.EARTH.riverList;
/* the great cities (one per land, for the flagship coasts); the rest keep small villages */
const CITIES=window.EARTH.cityList||[]; const CITY_BY_COUNTRY={};
for(const c of CITIES) CITY_BY_COUNTRY[c.country]=c;
function cityFor(i){ return CITY_BY_COUNTRY[COUNTRIES[i].n]; }

/* ---------------- world constants ---------------- */
const R_WORLD=120000, B=6, CH=16, CHW=B*CH, VIEW=8; /* rim = 20,000 km, 1 block = 1 km */
const ICE_UV=0.948, SHELF_UV=0.915, WATER_Y=0.35;
/* [sun-speed, name, ship-speed multiplier] */
const SPEEDS=[[1,'true',1],[1200,'swift',2.2],[14400,'a day in six breaths',5]];

/* ---------------- tiny noise ---------------- */
function hash2(x,y){const n=Math.sin(x*127.1+y*311.7)*43758.5453;return n-Math.floor(n);}
function vnoise(x,y){const xi=Math.floor(x),yi=Math.floor(y),xf=x-xi,yf=y-yi;
  const a=hash2(xi,yi),b=hash2(xi+1,yi),c=hash2(xi,yi+1),d2=hash2(xi+1,yi+1);
  const fx=xf*xf*(3-2*xf),fy=yf*yf*(3-2*yf);
  return a+(b-a)*fx+(c-a)*fy+(a-b-c+d2)*fx*fy;}
function fbm(x,y){return vnoise(x,y)*.55+vnoise(x*2.13,y*2.13)*.3+vnoise(x*4.7,y*4.7)*.15;}

/* ================= MINECRAFT-STYLE PIXEL TEXTURES =================
   Every block face is a 16×16 canvas, nearest-filtered so the pixels
   stay crisp — the heart of the look.                               */
function texCanvas(w,h){ const c=D.createElement('canvas'); c.width=w; c.height=h||w; return c; }
function P(g,x,y,col){ g.fillStyle=col; g.fillRect(x,y,1,1); }
function rgb(r,g2,b2){ return 'rgb('+r+','+g2+','+b2+')'; }
function jit(base,amt,seed){ const t=hash2(seed*7.31,seed*3.7)-0.5;
  return base.map(v=>Math.max(0,Math.min(255,Math.round(v+t*amt)))); }
function speckle(g,base,amt,alt,altP){
  let s=0; for(let y=0;y<16;y++)for(let x=0;x<16;x++){ s++;
    const c=(alt&&hash2(x*3.1+s,y*7.7)<altP)?jit(alt,amt,x+y*16+s):jit(base,amt,x*17+y+s);
    P(g,x,y,rgb(c[0],c[1],c[2])); } }
function mkTex(draw,w,h){ const c=texCanvas(w||16,h); draw(c.getContext('2d'),c);
  const t=new THREE.CanvasTexture(c); t.magFilter=THREE.NearestFilter;
  t.minFilter=THREE.NearestFilter; t.wrapS=t.wrapT=THREE.RepeatWrapping; t.generateMipmaps=false; return t; }

const TEX={};
TEX.grassTop   = mkTex(g=>speckle(g,[124,178,86],26,[104,158,70],0.35));
TEX.grassTopTr = mkTex(g=>speckle(g,[96,190,92],26,[76,168,74],0.35));      // tropic, brighter
TEX.grassTopTu = mkTex(g=>speckle(g,[136,148,96],22,[118,132,84],0.35));    // tundra, dull
TEX.dirt       = mkTex(g=>speckle(g,[134,96,67],24,[110,78,52],0.3));
TEX.grassSide  = mkTex(g=>{ speckle(g,[134,96,67],24,[110,78,52],0.3);
  for(let x=0;x<16;x++){ const d=1+Math.floor(hash2(x,9.1)*3);
    for(let y=0;y<d;y++){ const c=jit([116,170,80],24,x*3+y); P(g,x,y,rgb(c[0],c[1],c[2])); } } });
TEX.path       = mkTex(g=>speckle(g,[148,124,82],20,[132,110,70],0.3));
TEX.sand       = mkTex(g=>speckle(g,[219,207,163],16,[204,192,148],0.3));
TEX.stone      = mkTex(g=>speckle(g,[125,125,125],14,[105,105,105],0.28));
TEX.snow       = mkTex(g=>speckle(g,[240,246,250],8,[226,234,242],0.25));
TEX.ice        = mkTex(g=>{ speckle(g,[160,190,230],12,[145,175,220],0.3);
  for(let k=0;k<5;k++){ const x=Math.floor(hash2(k,1)*16), y=Math.floor(hash2(k,2)*16);
    P(g,x,y,'rgb(210,228,250)'); P(g,(x+1)%16,(y+1)%16,'rgb(210,228,250)'); } });
TEX.cobble     = mkTex(g=>{ speckle(g,[92,92,92],10);
  const st=[[0,0,5,4],[6,0,5,3],[12,0,4,4],[0,5,4,4],[5,4,6,5],[12,5,4,4],[0,10,6,5],[7,10,4,5],[12,10,4,5]];
  for(let i2=0;i2<st.length;i2++){ const s=st[i2], c=jit([132,132,132],26,i2);
    g.fillStyle=rgb(c[0],c[1],c[2]); g.fillRect(s[0]+0.5,s[1]+0.5,s[2]-1,s[3]-1); } });
TEX.planks     = mkTex(g=>{ speckle(g,[168,134,80],14,[156,122,72],0.3);
  g.fillStyle='rgb(96,72,42)';
  for(let y=3;y<16;y+=4) g.fillRect(0,y,16,1);
  g.fillRect(4,0,1,3); g.fillRect(11,4,1,3); g.fillRect(6,8,1,3); g.fillRect(13,12,1,3); });
TEX.roof       = mkTex(g=>{ speckle(g,[122,88,54],14,[110,78,46],0.3);
  g.fillStyle='rgb(66,46,26)';
  for(let y=3;y<16;y+=4) g.fillRect(0,y,16,1);
  g.fillRect(5,0,1,3); g.fillRect(10,4,1,3); g.fillRect(3,8,1,3); g.fillRect(12,12,1,3); });
TEX.logSide    = mkTex(g=>{ speckle(g,[104,82,50],12,[92,72,44],0.3);
  g.fillStyle='rgb(70,54,32)';
  for(const x of [1,5,9,13]) for(let y=0;y<16;y++){ if(hash2(x,y)>0.2) g.fillRect(x,y,1,1); } });
TEX.logTop     = mkTex(g=>{ speckle(g,[104,82,50],10);
  const sh=['rgb(178,148,96)','rgb(150,120,74)','rgb(122,96,58)','rgb(96,74,44)'];
  for(let r=0;r<4;r++){ g.fillStyle=sh[r]; g.fillRect(2+r,2+r,12-2*r,12-2*r); } });
TEX.leaves     = mkTex(g=>{ g.clearRect(0,0,16,16);
  for(let y=0;y<16;y++)for(let x=0;x<16;x++){ if(hash2(x*5.1,y*3.3)<0.86){
    const c=jit([64,120,44],36,x+y*16); P(g,x,y,rgb(c[0],c[1],c[2])); } } });
TEX.leavesTr   = mkTex(g=>{ g.clearRect(0,0,16,16);
  for(let y=0;y<16;y++)for(let x=0;x<16;x++){ if(hash2(x*5.7,y*4.3)<0.87){
    const c=jit([52,138,52],36,x+y*16+9); P(g,x,y,rgb(c[0],c[1],c[2])); } } });
TEX.water      = mkTex(g=>{ speckle(g,[52,94,168],14,[44,82,152],0.4);
  g.fillStyle='rgba(120,160,220,0.6)';
  for(const y of [2,7,12]) for(let x=0;x<16;x++){ if(hash2(x,y*2.2)>0.55) g.fillRect(x,y,2,1); } });
/* cherry blossom — soft pink canopy */
TEX.cherry     = mkTex(g=>{ g.clearRect(0,0,16,16);
  for(let y=0;y<16;y++)for(let x=0;x<16;x++){ if(hash2(x*5.1,y*3.7)<0.9){
    const base=hash2(x*2.3,y*1.9)<0.25?[255,214,232]:[244,170,205];
    const c=jit(base,26,x+y*16); P(g,x,y,rgb(c[0],c[1],c[2])); } } });
/* badlands — orange top, and horizontal strata of red/orange/tan/white clay */
TEX.badTop     = mkTex(g=>speckle(g,[201,120,66],18,[184,104,54],0.3));
TEX.badSide    = mkTex(g=>{ const bands=[[201,120,66],[168,86,50],[212,150,92],[224,206,178],[190,104,58]];
  for(let y=0;y<16;y++){ const bc=bands[Math.floor((y/16)*bands.length+ (hash2(0,y)*0.6))%bands.length];
    for(let x=0;x<16;x++){ const c=jit(bc,14,x*3+y); P(g,x,y,rgb(c[0],c[1],c[2])); } } });
TEX.haySide    = mkTex(g=>{ speckle(g,[196,160,58],22,[176,142,48],0.35);
  g.fillStyle='rgb(130,102,34)'; for(const y of [0,5,10,15]) g.fillRect(0,y,16,1); });
TEX.hayTop     = mkTex(g=>{ speckle(g,[204,168,64],22);
  g.strokeStyle='rgb(140,110,38)'; g.lineWidth=1;
  g.strokeRect(1.5,1.5,13,13); g.strokeRect(4.5,4.5,7,7); });
TEX.wool       = mkTex(g=>speckle(g,[236,233,226],10,[220,216,206],0.3));
TEX.glass      = mkTex(g=>{ g.clearRect(0,0,16,16);
  g.fillStyle='rgba(200,225,235,0.35)'; g.fillRect(0,0,16,16);
  g.fillStyle='rgba(255,255,255,0.85)';
  g.fillRect(0,0,16,1); g.fillRect(0,15,16,1); g.fillRect(0,0,1,16); g.fillRect(15,0,1,16);
  g.fillRect(2,10,3,1); g.fillRect(4,8,1,3); });
TEX.door       = mkTex((g,c)=>{ g.fillStyle='rgb(124,94,56)'; g.fillRect(0,0,16,32);
  g.fillStyle='rgb(92,68,40)';
  g.fillRect(1,1,14,30); g.fillStyle='rgb(140,108,66)'; g.fillRect(2,2,12,28);
  g.fillStyle='rgb(84,62,36)';
  g.fillRect(3,3,4,10); g.fillRect(9,3,4,10); g.fillRect(3,17,4,11); g.fillRect(9,17,4,11);
  g.fillStyle='rgb(40,48,60)'; g.fillRect(4,4,2,3); g.fillRect(10,4,2,3);
  g.fillStyle='rgb(220,220,220)'; g.fillRect(13,15,1,2); },16,32);
TEX.tallgrass  = mkTex(g=>{ g.clearRect(0,0,16,16);
  for(let k=0;k<9;k++){ const x=1+Math.floor(hash2(k,3)*14); const h2=6+Math.floor(hash2(k,5)*9);
    const c=jit([92,160,64],30,k); g.fillStyle=rgb(c[0],c[1],c[2]);
    for(let y=0;y<h2;y++) g.fillRect(x+(y>h2-3?(hash2(k,9)>0.5?1:-1):0),15-y,1,1); } });
TEX.flowerR    = mkTex(g=>{ g.clearRect(0,0,16,16); g.fillStyle='rgb(64,120,48)';
  g.fillRect(7,8,1,8); g.fillRect(5,11,2,1);
  g.fillStyle='rgb(200,44,36)'; g.fillRect(5,3,5,5); g.fillStyle='rgb(230,80,60)'; g.fillRect(6,4,3,3);
  g.fillStyle='rgb(40,40,40)'; g.fillRect(7,5,1,1); });
TEX.flowerY    = mkTex(g=>{ g.clearRect(0,0,16,16); g.fillStyle='rgb(64,120,48)';
  g.fillRect(8,8,1,8);
  g.fillStyle='rgb(232,208,60)'; g.fillRect(6,3,5,5); g.fillStyle='rgb(250,236,120)'; g.fillRect(7,4,3,3); });
TEX.crop       = mkTex(g=>{ g.clearRect(0,0,16,16);
  for(const x of [2,6,10,14]){ const c=jit([96,178,66],26,x); g.fillStyle=rgb(c[0],c[1],c[2]);
    for(let y=0;y<10;y++){ g.fillRect(x,15-y,1,1); if(y>4&&hash2(x,y)>0.5) g.fillRect(x-1,15-y,1,1); } } });
TEX.soil       = mkTex(g=>{ speckle(g,[96,66,42],18,[80,54,34],0.3);
  g.fillStyle='rgb(66,44,28)'; for(const y of [3,8,13]) g.fillRect(0,y,16,2); });
TEX.sun        = mkTex(g=>{ g.fillStyle='rgb(255,238,160)'; g.fillRect(0,0,16,16);
  g.fillStyle='rgb(255,250,214)'; g.fillRect(2,2,12,12);
  g.fillStyle='rgb(255,255,240)'; g.fillRect(4,4,8,8); });
TEX.moon       = mkTex(g=>{ g.fillStyle='rgb(214,222,236)'; g.fillRect(0,0,16,16);
  g.fillStyle='rgb(232,238,248)'; g.fillRect(2,2,12,12);
  g.fillStyle='rgb(196,206,224)'; g.fillRect(4,5,3,3); g.fillRect(9,9,3,2); g.fillRect(10,3,2,2); });
TEX.benchTop   = mkTex(g=>{ speckle(g,[168,134,80],14,[156,122,72],0.3);
  g.strokeStyle='rgb(84,62,36)'; g.lineWidth=1; g.strokeRect(1.5,1.5,13,13);
  g.fillStyle='rgb(120,92,54)'; g.fillRect(4,4,8,8);
  g.fillStyle='rgb(190,160,110)'; g.fillRect(5,5,6,6);
  g.fillStyle='rgb(84,62,36)'; g.fillRect(7,4,1,8); g.fillRect(4,7,8,1); });
TEX.benchSide  = mkTex(g=>{ speckle(g,[168,134,80],14,[156,122,72],0.3);
  g.fillStyle='rgb(96,72,42)'; for(let y2=3;y2<16;y2+=4) g.fillRect(0,y2,16,1);
  g.fillStyle='rgb(140,140,146)'; g.fillRect(3,4,2,5); g.fillStyle='rgb(90,66,40)'; g.fillRect(3,9,2,3);
  g.fillStyle='rgb(150,120,74)'; g.fillRect(10,5,4,2); g.fillStyle='rgb(120,120,126)'; g.fillRect(11,7,2,4); });
TEX.clouds     = mkTex(g=>{ g.clearRect(0,0,64,64);
  g.fillStyle='rgba(255,255,255,0.92)';
  for(let k=0;k<26;k++){ const x=Math.floor(hash2(k,11)*64), y=Math.floor(hash2(k,23)*64);
    const w=4+Math.floor(hash2(k,31)*12), h2=2+Math.floor(hash2(k,41)*5);
    g.fillRect(x,y,w,h2); if(hash2(k,7)>0.4) g.fillRect(x+2,y-1,Math.max(2,w-4),1);
    if(x+w>64) g.fillRect(0,y,x+w-64,h2); } },64);

/* ---------------- shared block materials + global light ---------------- */
const MAT={}, LIT=[];
function blockMat(name,tex,opts){ const m=new THREE.MeshBasicMaterial(Object.assign({
    map:tex, vertexColors:true, side:THREE.DoubleSide },opts||{}));
  MAT[name]=m; LIT.push(m); return m; }
blockMat('grassTop',TEX.grassTop); blockMat('grassTopTr',TEX.grassTopTr); blockMat('grassTopTu',TEX.grassTopTu);
blockMat('grassSide',TEX.grassSide); blockMat('dirt',TEX.dirt); blockMat('path',TEX.path);
blockMat('sand',TEX.sand); blockMat('stone',TEX.stone); blockMat('cobble',TEX.cobble);
blockMat('snow',TEX.snow); blockMat('ice',TEX.ice);
blockMat('planks',TEX.planks); blockMat('roof',TEX.roof);
blockMat('logSide',TEX.logSide); blockMat('logTop',TEX.logTop);
blockMat('haySide',TEX.haySide); blockMat('hayTop',TEX.hayTop); blockMat('wool',TEX.wool);
blockMat('soil',TEX.soil); blockMat('benchTop',TEX.benchTop); blockMat('benchSide',TEX.benchSide);
blockMat('leaves',TEX.leaves,{alphaTest:0.4}); blockMat('leavesTr',TEX.leavesTr,{alphaTest:0.4});
blockMat('cherry',TEX.cherry,{alphaTest:0.4}); blockMat('badTop',TEX.badTop); blockMat('badSide',TEX.badSide);
blockMat('tallgrass',TEX.tallgrass,{alphaTest:0.4}); blockMat('flowerR',TEX.flowerR,{alphaTest:0.4});
blockMat('flowerY',TEX.flowerY,{alphaTest:0.4}); blockMat('crop',TEX.crop,{alphaTest:0.4});
blockMat('glass',TEX.glass,{transparent:true,depthWrite:false});
blockMat('door',TEX.door,{alphaTest:0.1});
blockMat('waterB',TEX.water);
/* breaking surf — clumpy foam that washes the shoreline (scrolled + pulsed) */
TEX.surf = mkTex(g=>{ g.clearRect(0,0,16,16);
  for(let y=0;y<16;y++)for(let x=0;x<16;x++){
    const n=fbm(x*0.5+1.3,y*0.9-2.1);
    if(n>0.52){ const w=210+Math.floor(hash2(x,y)*40);
      g.fillStyle='rgba('+w+','+Math.min(255,w+12)+',255,'+Math.min(1,(n-0.4)*2.2)+')';
      g.fillRect(x,y,1,1); } } });
const surfMat=blockMat('surf',TEX.surf,{transparent:true,alphaTest:0.02,depthWrite:false,opacity:0.6});
/* a swinging door leaf (its own mesh so it can open/close) */
const doorLeafMat=new THREE.MeshBasicMaterial({map:TEX.door,side:THREE.DoubleSide,alphaTest:0.1});
LIT.push(doorLeafMat);
const seaTex=TEX.water.clone(); seaTex.needsUpdate=true; seaTex.repeat.set(R_WORLD/12,R_WORLD/12);
/* the open sea repeats ~10,000× — without mipmaps it aliases into shimmer */
seaTex.generateMipmaps=true; seaTex.minFilter=THREE.LinearMipmapLinearFilter;
const seaMat=new THREE.MeshBasicMaterial({map:seaTex,transparent:true,opacity:0.82,side:THREE.DoubleSide});
LIT.push(seaMat);
const torchMat=new THREE.MeshBasicMaterial({color:0xffd75e});           // full-bright, never dimmed
function setBlockLight(r,g2,b2){ for(const m of LIT) m.color.setRGB(r,g2,b2); }

/* ================= TERRAIN (heightmap voxels) ================= */
const MAPR=2048, HALF=MAPR/2;
/* Country ID map. Canvas polygon fills are anti-aliased, so every coastline
   pixel becomes a blend that decodes to the wrong country (a beach of Israel,
   id 77, at 34% coverage reads as 26 = South Africa). So the ID map is NOT
   drawn with canvas at all: each country is rasterised with an exact even-odd
   scanline fill — every pixel holds a true country id or 0, never a blend.
   Sample points sit at integer canvas coords to match countryAtUV's rounding. */
const IDMAP=(()=>{
  const id=new Uint8Array(MAPR*MAPR);
  for(let i=0;i<COUNTRIES.length;i++){
    const edges=[]; let minY=Infinity, maxY=-Infinity;
    for(const ring of COUNTRIES[i].p){
      for(let k=0;k<ring.length;k++){
        const a=ring[k], b=ring[(k+1)%ring.length];
        const ay=(a[1]+1)*HALF, by=(b[1]+1)*HALF;
        if(ay===by) continue;
        edges.push([(a[0]+1)*HALF,ay,(b[0]+1)*HALF,by]);
        if(ay<minY)minY=ay; if(by<minY)minY=by;
        if(ay>maxY)maxY=ay; if(by>maxY)maxY=by;
      }
    }
    const y0=Math.max(0,Math.ceil(minY)), y1=Math.min(MAPR-1,Math.floor(maxY));
    const xs=[];
    for(let py=y0;py<=y1;py++){
      xs.length=0;
      for(const e of edges){
        const [ax,ay,bx,by]=e;
        if((ay<=py&&by>py)||(by<=py&&ay>py)) xs.push(ax+(py-ay)/(by-ay)*(bx-ax));
      }
      xs.sort((p,q)=>p-q);
      for(let k=0;k+1<xs.length;k+=2){
        const xa=Math.max(0,Math.ceil(xs[k])), xb=Math.min(MAPR-1,Math.floor(xs[k+1]));
        for(let px=xa;px<=xb;px++) id[py*MAPR+px]=i+1;
      }
    }
  }
  return id;
})();
function countryAtUV(u,v){
  const px=Math.round((u+1)*HALF), py=Math.round((v+1)*HALF);
  if(px<0||py<0||px>=MAPR||py>=MAPR) return 0;
  return IDMAP[py*MAPR+px];
}

/* Rivers, rasterised the same exact way (1 = navigable river water).
   Each river is stamped from its mouth upstream: two pixels wide over the
   lower half of its course, one pixel wide toward the source. */
const RIVMAP=(()=>{
  const m=new Uint8Array(MAPR*MAPR);
  if(!RIVERS||!RIVERS.length) return m;
  const toPx=(lat,lon)=>{ const r=(90-lat)/180, a=lon*Math.PI/180;
    return [(r*Math.sin(a)+1)*HALF, (r*Math.cos(a)+1)*HALF]; };
  const stamp=(x,y,wide)=>{ const X=Math.round(x), Y=Math.round(y), e=wide?1:0;
    for(let dy=0;dy<=e;dy++) for(let dx=0;dx<=e;dx++){
      const qx=X+dx, qy=Y+dy;
      if(qx>=0&&qy>=0&&qx<MAPR&&qy<MAPR) m[qy*MAPR+qx]=1; } };
  for(const rv of RIVERS){
    const pts=rv.pts.map(p=>toPx(p[0],p[1]));
    let len=0; for(let k=0;k+1<pts.length;k++) len+=Math.hypot(pts[k+1][0]-pts[k][0],pts[k+1][1]-pts[k][1]);
    let run=0;
    for(let k=0;k+1<pts.length;k++){
      const [ax,ay]=pts[k], [bx,by]=pts[k+1];
      const d=Math.hypot(bx-ax,by-ay), steps=Math.max(1,Math.ceil(d/0.3));
      for(let s=0;s<=steps;s++){ const t=s/steps;
        stamp(ax+(bx-ax)*t, ay+(by-ay)*t, (run+d*t)/len<0.55); }
      run+=d;
    }
  }
  return m;
})();
function riverAtUV(u,v){
  const px=Math.round((u+1)*HALF), py=Math.round((v+1)*HALF);
  if(px<0||py<0||px>=MAPR||py>=MAPR) return 0;
  return RIVMAP[py*MAPR+px];
}

/* ================= THE SHOAL MAP =================
   A distance-to-land field over the whole disc (chamfer transform of the
   country map). The water shader drinks from it: where the bottom lies
   near — along every coast and up every river — the sea stands clear and
   turquoise and the light passes through to the sand; over the true deep
   it keeps its darkness. */
let SHOAL_DATA=null; const SHOAL_RES=1024;
const SHOAL_TEX=(()=>{
  const N=MAPR, d=new Float32Array(N*N), INF=1e9;
  for(let i=0;i<N*N;i++) d[i]=IDMAP[i]?0:INF;
  for(let y=0;y<N;y++) for(let x=0;x<N;x++){ const i=y*N+x; let v=d[i];   /* forward sweep */
    if(x>0&&d[i-1]+1<v) v=d[i-1]+1;
    if(y>0){ if(d[i-N]+1<v) v=d[i-N]+1;
      if(x>0&&d[i-N-1]+1.4<v) v=d[i-N-1]+1.4;
      if(x<N-1&&d[i-N+1]+1.4<v) v=d[i-N+1]+1.4; }
    d[i]=v; }
  for(let y=N-1;y>=0;y--) for(let x=N-1;x>=0;x--){ const i=y*N+x; let v=d[i];   /* backward sweep */
    if(x<N-1&&d[i+1]+1<v) v=d[i+1]+1;
    if(y<N-1){ if(d[i+N]+1<v) v=d[i+N]+1;
      if(x<N-1&&d[i+N+1]+1.4<v) v=d[i+N+1]+1.4;
      if(x>0&&d[i+N-1]+1.4<v) v=d[i+N-1]+1.4; }
    d[i]=v; }
  const R2=SHOAL_RES; let f=new Float32Array(R2*R2);
  for(let y=0;y<R2;y++) for(let x=0;x<R2;x++){
    const dist=d[Math.min(N-1,y*2)*N+Math.min(N-1,x*2)];   /* in map pixels, ≈117 units each */
    f[y*R2+x]=Math.max(0,1-dist/4.5); }
  /* two 3×3 blur passes — no texel facets on the open water */
  for(let pass=0;pass<2;pass++){ const g2=new Float32Array(R2*R2);
    for(let y=0;y<R2;y++) for(let x=0;x<R2;x++){
      let s2=0,n2=0;
      for(let dy=-1;dy<=1;dy++){ const yy=y+dy; if(yy<0||yy>=R2) continue;
        for(let dx=-1;dx<=1;dx++){ const xx=x+dx; if(xx<0||xx>=R2) continue;
          s2+=f[yy*R2+xx]; n2++; } }
      g2[y*R2+x]=s2/n2; }
    f=g2; }
  const data=new Uint8Array(R2*R2*4); SHOAL_DATA=new Uint8Array(R2*R2);
  for(let i=0;i<R2*R2;i++){ const b=Math.round(Math.pow(f[i],1.2)*255);
    data[i*4]=b; data[i*4+1]=b; data[i*4+2]=b; data[i*4+3]=255; SHOAL_DATA[i]=b; }
  const t=new THREE.DataTexture(data,R2,R2,THREE.RGBAFormat);
  t.magFilter=THREE.LinearFilter; t.minFilter=THREE.LinearFilter; t.needsUpdate=true;
  return t;
})();
function shoalAt(x,z){
  const R2=SHOAL_RES;
  const px=Math.min(R2-1,Math.max(0,Math.round((x/R_WORLD+1)*0.5*R2)));
  const pz=Math.min(R2-1,Math.max(0,Math.round((z/R_WORLD+1)*0.5*R2)));
  return SHOAL_DATA[pz*R2+px]/255;
}

/* Each call returns a FRESH object. (A shared scratch object here once meant
   that querying a neighbour clobbered the current cell mid-mesh: cliff side
   faces were skipped and trees were placed with the neighbour's height.) */
function cellRaw(ix,iz){
  const x=(ix+.5)*B, z=(iz+.5)*B, u=x/R_WORLD, v=z/R_WORLD;
  const r=Math.hypot(u,v);
  if(r>0.995) return null;
  const lat=90-r*180;
  const n=fbm(ix*.11,iz*.11), n2=fbm(ix*.023+40,iz*.023-70), j=hash2(ix,iz);
  if(r>=ICE_UV){ const t=(r-ICE_UV)/(0.995-ICE_UV);
    const wh = t<0.72 ? 3+(t/0.72)*46 : 49+(t-0.72)/0.28*4;   /* a climbable ice ramp up to a crowned plateau */
    return {h:Math.floor(wh+n*3), kind:'wall', tree:0, ci:0}; }
  if(r>=SHELF_UV){ if(n>0.62){ return {h:1, kind:'floe', tree:0, ci:0}; } return null; }
  /* domain-warp the coast: sub-pixel fractal detail where the vector data runs out */
  const du2=(fbm(u*760+13.7,v*760-4.2)-0.5)*(2.6/HALF);
  const dv2=(fbm(u*760-8.1,v*760+9.3)-0.5)*(2.6/HALF);
  const wu=u+du2, wv=v+dv2;
  const ci=countryAtUV(wu,wv);
  if(!ci){
    /* UNCHARTED ISLES — small sandy risings of the deep, set on no chart:
       rare mid-ocean landfalls between the great coasts. Palms in the warm
       waters, a bare northern rock elsewhere. They never bear a nation. */
    if(r>0.12&&r<SHELF_UV-0.03){
      const iso=fbm(wu*240+77,wv*240-31);
      if(iso>0.82){
        const t=(iso-0.82)/0.1;
        let ih=1+Math.floor(t*3+n*1.2);
        const trop=lat<=28&&lat>-38;
        let tree=0;
        if(t>0.3){ if(trop&&j<0.09) tree=2; else if(!trop&&lat<58&&j<0.05) tree=1; }
        return {h:Math.min(ih,3), kind:t>0.45?(trop?'tropic':'grass'):'sand', tree, ci:0};
      }
    }
    return null;
  }
  if(riverAtUV(wu,wv)) return null;   /* a river runs here — open water */
  let cnt=0; const s=1.6/HALF;
  if(countryAtUV(wu+s,wv))cnt++; if(countryAtUV(wu-s,wv))cnt++;
  if(countryAtUV(wu,wv+s))cnt++; if(countryAtUV(wu,wv-s))cnt++;
  const inland=cnt/4;
  /* Mostly-flat, walkable ground with mountains gated behind a broad mask —
     plains stay h=1..2 (solid footing, few steps), while ranges rise rocky. */
  const mtnMask=fbm(ix*.018+120,iz*.018-30);
  const mtn=Math.max(0,mtnMask-0.5)/0.5;               // 0 on the plains, →1 in the ranges
  let h=1+Math.floor(n*1.5)+Math.floor(Math.pow(mtn,1.4)*inland*12);
  const snow = lat>72 || lat<-55 || h>=11;
  const tundra = lat>58 && lat<=72;
  const desert = lat>11 && lat<36 && n2>0.42 && inland>0.5;
  const tropic = lat<=11 && lat>-38;
  let kind, tree=0;
  if(!snow&&!tundra&&inland<1){
    /* the shore terraces gently to the water */
    const cap=1+Math.round(inland*4);
    if(h>cap) h=cap;
  }
  /* broad biome regions carve out cherry-blossom hills and badland mesas */
  const region=fbm(ix*.012-70,iz*.012+140);
  const lon=Math.atan2(u,v)*180/Math.PI;              /* longitude upon the disc */
  /* badlands (barren mesas) only in the arid belt — the tan wastes of the map */
  const badlands = !snow&&!tundra&&lat>11&&lat<36&&n2>0.42&&region<0.43&&inland>0.4;
  /* cherry blossom only in the far east — the lands of Yapan, China and Korea */
  const eastAsia = lat>20&&lat<46&&lon>96&&lon<148;
  const cherry   = !snow&&!tundra&&!desert&&eastAsia&&region>0.46;
  /* a broad, flat, walkable beach along every warm/temperate coast */
  const beach = !snow&&!tundra&&!badlands&&(inland<=0.5 || (inland<0.8&&h<=2));
  if(beach){ kind='sand'; h=Math.min(h,2);
    if(tropic&&j<0.03) tree=2;                 /* palms on the strand */
  }
  else if(h<=2 && inland<1 && !snow && !tundra && !badlands){ kind='sand'; h=Math.min(h,2); }
  else if(snow) kind='snow';
  else if(tundra){ kind='tundra'; tree=j<0.02?1:0; }
  else if(badlands){ kind='badlands';
    const bh=fbm(ix*.045+7,iz*.045-3);              /* the badlands' own eroded relief */
    h=2+Math.floor(bh*8)+Math.floor(Math.pow(mtn,1.2)*inland*8);
    h=Math.max(2,Math.floor(h/2)*2);                /* terraced in steps of two */
  }
  else if(desert){ kind='desert'; }
  else if(cherry){ kind='grass'; tree=j<0.10?3:0; } /* cherry-blossom groves */
  else if(tropic){ kind='tropic'; tree=j<0.085?2:0; }
  else { kind='grass'; tree=j<0.06?1:0; }
  if(kind!=='sand'&&kind!=='badlands'&&!cherry&&!snow&&h>=5){ kind='rock'; tree=0; }
  return {h, kind, tree, ci};
}
/* villages flatten the ground around them (computed at boot) */
let SITES=[], siteGrid=new Map();
function siteKey(u,v){ return Math.floor((u+1)*16)+','+Math.floor((v+1)*16); }
function cell(ix,iz){
  const c=cellRaw(ix,iz); if(!c) return null;
  if(SITES.length&&c.kind!=='wall'&&c.kind!=='floe'){
    const x=(ix+.5)*B, z=(iz+.5)*B, u=x/R_WORLD, v=z/R_WORLD;
    const near=siteGrid.get(siteKey(u,v));
    if(near) for(const st of near){
      const d=Math.hypot(x-st.x,z-st.z);
      if(d<86){ const t=Math.min(1,(86-d)/60);
        c.h=Math.max(1,Math.round(c.h+(st.h0-c.h)*t*0.92));
        if(c.kind!=='sand'&&c.h===1) c.h=2;
        break; }
    }
  }
  return c;
}
function topY(ix,iz){ const c=cell(ix,iz); return c? c.h*B : WATER_Y; }
function landAtWorld(x,z){ return cell(Math.floor(x/B),Math.floor(z/B)); }
function computeSites(){
  for(let i=0;i<COUNTRIES.length;i++){
    const co=COUNTRIES[i]; let best=null;
    const tryPt=(u,v)=>{ const ix=Math.floor(u*R_WORLD/B), iz=Math.floor(v*R_WORLD/B);
      const cc=cellRaw(ix,iz);
      if(cc&&cc.kind!=='wall'&&cc.kind!=='floe') return {i,ix,iz,x:(ix+.5)*B,z:(iz+.5)*B,h0:Math.max(2,cc.h)};
      return null; };
    /* a country file may name its own village spot: site:[lat,lon] */
    if(co.site&&co.site.length===2){
      const sr=(90-co.site[0])/180, sa=co.site[1]*Math.PI/180;
      const su=sr*Math.sin(sa), sv=sr*Math.cos(sa);
      for(let rad=0;rad<40&&!best;rad++) for(let aa2=0;aa2<Math.max(1,rad*6)&&!best;aa2++){
        const th=aa2/(rad*6||1)*Math.PI*2;
        const u=su+Math.cos(th)*rad*1.7/HALF, v=sv+Math.sin(th)*rad*1.7/HALF;
        if(countryAtUV(u,v)===i+1) best=tryPt(u,v);
      }
    }
    /* prefer the coast: sample the country's outline for a vertex with open sea beside it */
    const cands=[];
    for(const ring of co.p){ const stepK=Math.max(1,Math.floor(ring.length/60));
      for(let k=0;k<ring.length;k+=stepK){
        const vu=ring[k][0], vv=ring[k][1];
        const cx2=co.c[0]-vu, cz2=co.c[1]-vv; const m=Math.hypot(cx2,cz2)||1;
        const inU=vu+cx2/m*2.4/HALF, inV=vv+cz2/m*2.4/HALF;
        const outU=vu-cx2/m*2.4/HALF, outV=vv-cz2/m*2.4/HALF;
        if(countryAtUV(inU,inV)===i+1&&countryAtUV(outU,outV)===0) cands.push([inU,inV]);
      } }
    if(cands.length){ const o=Math.floor(hash2(i*3.7,i*9.1)*cands.length);
      for(let k=0;k<Math.min(24,cands.length)&&!best;k++){ const c2=cands[(o+k)%cands.length]; best=tryPt(c2[0],c2[1]); } }
    if(!best){ /* landlocked: settle near the midst as before */
      outer:
      for(let rad=0; rad<40; rad++) for(let a=0;a<Math.max(1,rad*6);a++){
        const th=a/(rad*6||1)*Math.PI*2;
        const u=co.c[0]+Math.cos(th)*rad*1.7/HALF, v=co.c[1]+Math.sin(th)*rad*1.7/HALF;
        if(countryAtUV(u,v)===i+1){ best=tryPt(u,v); if(best) break outer; }
      } }
    SITES[i]=best;
    if(best){ const u=best.x/R_WORLD, v=best.z/R_WORLD;
      for(let du=-1;du<=1;du++) for(let dv=-1;dv<=1;dv++){
        const k=(Math.floor((u+1)*16)+du)+','+(Math.floor((v+1)*16)+dv);
        if(!siteGrid.has(k)) siteGrid.set(k,[]); siteGrid.get(k).push(best); } }
  }
}

/* ================= CHUNK MESHER =================
   Merged geometry per material per chunk, per-face MC shading:
   top 1.0 · z-sides 0.8 · x-sides 0.62 · bottom 0.5            */
const scene=new THREE.Scene();
function newG(){ return {}; }
function gm(G,mat){ let g=G[mat]; if(!g){ g={p:[],uv:[],c:[],i:[],n:0}; G[mat]=g; } return g; }
function quad(G,mat, ax,ay,az, bx,by,bz, cx,cy,cz, dx,dy,dz, u0,v0,u1,v1, s){
  const g=gm(G,mat), o=g.n;
  g.p.push(ax,ay,az, bx,by,bz, cx,cy,cz, dx,dy,dz);
  g.uv.push(u0,v0, u1,v0, u1,v1, u0,v1);
  for(let k=0;k<4;k++) g.c.push(s,s,s);
  g.i.push(o,o+1,o+2, o,o+2,o+3); g.n+=4;
}
function faceTop(G,mat,x0,z0,x1,z1,y,s,rep){ const r=rep||1;
  quad(G,mat, x0,y,z1, x1,y,z1, x1,y,z0, x0,y,z0, 0,0,(x1-x0)/B*r,(z1-z0)/B*r, s); }
function faceBottom(G,mat,x0,z0,x1,z1,y,s){ quad(G,mat, x0,y,z0, x1,y,z0, x1,y,z1, x0,y,z1, 0,0,(x1-x0)/B,(z1-z0)/B, s); }
function facePX(G,mat,x,z0,z1,y0,y1,s){ quad(G,mat, x,y0,z1, x,y0,z0, x,y1,z0, x,y1,z1, 0,0,(z1-z0)/B,(y1-y0)/B, s); }
function faceNX(G,mat,x,z0,z1,y0,y1,s){ quad(G,mat, x,y0,z0, x,y0,z1, x,y1,z1, x,y1,z0, 0,0,(z1-z0)/B,(y1-y0)/B, s); }
function facePZ(G,mat,z,x0,x1,y0,y1,s){ quad(G,mat, x0,y0,z, x1,y0,z, x1,y1,z, x0,y1,z, 0,0,(x1-x0)/B,(y1-y0)/B, s); }
function faceNZ(G,mat,z,x0,x1,y0,y1,s){ quad(G,mat, x1,y0,z, x0,y0,z, x0,y1,z, x1,y1,z, 0,0,(x1-x0)/B,(y1-y0)/B, s); }
function emitBox(G, x0,y0,z0, x1,y1,z1, sideMat, topMat, botMat){
  faceTop(G,topMat,x0,z0,x1,z1,y1,1.0);
  if(botMat) faceBottom(G,botMat,x0,z0,x1,z1,y0,0.5);
  facePX(G,sideMat,x1,z0,z1,y0,y1,0.62); faceNX(G,sideMat,x0,z0,z1,y0,y1,0.62);
  facePZ(G,sideMat,z1,x0,x1,y0,y1,0.8);  faceNZ(G,sideMat,z0,x0,x1,y0,y1,0.8);
}
function cross(G,mat,cx,cz,y,size,h,s){
  const r=size/2;
  quad(G,mat, cx-r,y,cz-r, cx+r,y,cz+r, cx+r,y+h,cz+r, cx-r,y+h,cz-r, 0,0,1,1, s);
  quad(G,mat, cx-r,y,cz+r, cx+r,y,cz-r, cx+r,y+h,cz-r, cx-r,y+h,cz+r, 0,0,1,1, s);
}
function topMatFor(kind){
  if(kind==='sand') return 'sand';
  if(kind==='snow'||kind==='wall') return 'snow';
  if(kind==='floe') return 'ice';
  if(kind==='rock') return 'stone';
  if(kind==='desert') return 'sand';
  if(kind==='badlands') return 'badTop';
  if(kind==='tropic') return 'grassTopTr';
  if(kind==='tundra') return 'grassTopTu';
  return 'grassTop';
}
function sideMatsFor(kind){ /* [topBlockSide, lowerSide] */
  if(kind==='sand'||kind==='desert') return ['sand','sand'];
  if(kind==='badlands') return ['badSide','badSide'];
  if(kind==='snow') return ['snow','stone'];
  if(kind==='wall') return ['ice','ice'];
  if(kind==='floe') return ['ice','ice'];
  if(kind==='rock') return ['stone','stone'];
  return ['grassSide','dirt'];
}
function emitColumn(G,ix,iz,cc){
  const x0=ix*B, x1=x0+B, z0=iz*B, z1=z0+B, yT=cc.h*B;
  faceTop(G,topMatFor(cc.kind),x0,z0,x1,z1,yT,1.0);
  const [sTop,sLow]=sideMatsFor(cc.kind);
  const nb=[[1,0],[-1,0],[0,1],[0,-1]];
  for(let d=0;d<4;d++){
    const nc=cell(ix+nb[d][0],iz+nb[d][1]);
    const nh=nc?nc.h:0, base=Math.min(nh,cc.h)*B;
    if(cc.h<=nh) continue;
    const split=(sTop!==sLow)&&(cc.h-1>nh);
    const yMid=split?(cc.h-1)*B:base;
    const put=(mat,ya,yb,sh)=>{ if(yb<=ya) return;
      if(d===0) facePX(G,mat,x1,z0,z1,ya,yb,sh);
      else if(d===1) faceNX(G,mat,x0,z0,z1,ya,yb,sh);
      else if(d===2) facePZ(G,mat,z1,x0,x1,ya,yb,sh);
      else faceNZ(G,mat,z0,x0,x1,ya,yb,sh); };
    const sh=(d<2)?0.62:0.8;
    if(split){ put(sLow,base,yMid,sh); put(sTop,yMid,yT,sh); }
    else put(sTop,base,yT,sh);
  }
}
function emitTree(G,ix,iz,cc){
  const x=(ix+.5)*B, z=(iz+.5)*B, yT=cc.h*B;
  const tropic=cc.tree===2, cherry=cc.tree===3;
  const trunkH=tropic?B*3.2:cherry?B*2.6:B*2.2, tw=B*0.42;
  emitBox(G, x-tw,yT,z-tw, x+tw,yT+trunkH,z+tw, 'logSide','logTop',null);
  const lm=tropic?'leavesTr':cherry?'cherry':'leaves';
  if(tropic){
    emitBox(G, x-B*1.6,yT+trunkH,z-B*0.5, x+B*1.6,yT+trunkH+B*0.6,z+B*0.5, lm,lm,lm);
    emitBox(G, x-B*0.5,yT+trunkH,z-B*1.6, x+B*0.5,yT+trunkH+B*0.6,z+B*1.6, lm,lm,lm);
  } else if(cherry){                         /* a broad, soft pink canopy */
    emitBox(G, x-B*1.8,yT+trunkH-B*0.5,z-B*1.8, x+B*1.8,yT+trunkH+B*0.5,z+B*1.8, lm,lm,lm);
    emitBox(G, x-B*1.1,yT+trunkH+B*0.5,z-B*1.1, x+B*1.1,yT+trunkH+B*1.1,z+B*1.1, lm,lm,lm);
  } else {
    emitBox(G, x-B*1.45,yT+trunkH-B*0.9,z-B*1.45, x+B*1.45,yT+trunkH+B*0.35,z+B*1.45, lm,lm,lm);
    emitBox(G, x-B*0.75,yT+trunkH+B*0.35,z-B*0.75, x+B*0.75,yT+trunkH+B*1.15,z+B*0.75, lm,lm,lm);
  }
}
const chunks=new Map(); const buildQueue=[];
function buildChunk(cx,cz){
  const G=newG();
  for(let a=0;a<CH;a++) for(let b=0;b<CH;b++){
    const ix=cx*CH+a, iz=cz*CH+b, cc=cell(ix,iz);
    if(!cc){ /* the shelf: a sloping sandy bottom, seen through the clear shallows */
      const x0=ix*B, z0=iz*B;
      const nb=cell(ix+1,iz)||cell(ix-1,iz)||cell(ix,iz+1)||cell(ix,iz-1);
      if(nb&&nb.kind!=='wall'&&nb.kind!=='floe'){
        faceTop(G,'sand',x0,z0,x0+B,z0+B,WATER_Y-1.5,0.92);
        /* breaking surf where the swell meets the strand */
        if(nb.kind==='sand'||nb.kind==='tropic'||nb.kind==='grass'||nb.kind==='desert')
          faceTop(G,'surf',x0,z0,x0+B,z0+B,WATER_Y+0.55,1.0);
      } else if(shoalAt(x0+B/2,z0+B/2)>0.08){       /* only worth probing near a coast */
        const nb2=cell(ix+1,iz+1)||cell(ix-1,iz-1)||cell(ix+1,iz-1)||cell(ix-1,iz+1)
          ||cell(ix+2,iz)||cell(ix-2,iz)||cell(ix,iz+2)||cell(ix,iz-2);
        if(nb2&&nb2.kind!=='wall'&&nb2.kind!=='floe')
          faceTop(G,'sand',x0,z0,x0+B,z0+B,WATER_Y-4.6,0.8);
        else {
          const nb3=cell(ix+2,iz+2)||cell(ix-2,iz-2)||cell(ix+2,iz-2)||cell(ix-2,iz+2)
            ||cell(ix+3,iz)||cell(ix-3,iz)||cell(ix,iz+3)||cell(ix,iz-3);
          if(nb3&&nb3.kind!=='wall'&&nb3.kind!=='floe')
            faceTop(G,'sand',x0,z0,x0+B,z0+B,WATER_Y-9.5,0.66);
        }
      }
      continue;
    }
    emitColumn(G,ix,iz,cc);
    const x=(ix+.5)*B, z=(iz+.5)*B, yT=cc.h*B, j=hash2(ix*1.7,iz*2.9);
    if(cc.tree) emitTree(G,ix,iz,cc);
    else if((cc.kind==='grass'||cc.kind==='tropic')&&j<0.16)
      cross(G, j<0.012?'flowerR':(j<0.028?'flowerY':'tallgrass'), x,z,yT,B*0.85,B*0.85,0.95);
    else if(cc.kind==='desert'&&j<0.02)
      cross(G,'tallgrass',x,z,yT,B*0.7,B*0.8,0.8);
    if(cc.kind==='grass'&&j>0.994)
      emitBox(G, x-B*0.5,yT,z-B*0.5, x+B*0.5,yT+B,z+B*0.5,'stone','stone',null);
  }
  const meshes=[];
  for(const mat in G){ const g=G[mat];
    const bg=new THREE.BufferGeometry();
    bg.setAttribute('position',new THREE.Float32BufferAttribute(g.p,3));
    bg.setAttribute('uv',new THREE.Float32BufferAttribute(g.uv,2));
    bg.setAttribute('color',new THREE.Float32BufferAttribute(g.c,3));
    bg.setIndex(g.i);
    const m=new THREE.Mesh(bg,MAT[mat]); m.frustumCulled=true;
    scene.add(m); meshes.push(m); }
  chunks.set(cx+','+cz,{meshes});
}
function updateChunks(px,pz,budget){
  const ccx=Math.floor(px/CHW), ccz=Math.floor(pz/CHW);
  for(let dz=-VIEW;dz<=VIEW;dz++) for(let dx=-VIEW;dx<=VIEW;dx++){
    if(dx*dx+dz*dz>VIEW*VIEW+2) continue;
    const k=(ccx+dx)+','+(ccz+dz);
    if(!chunks.has(k)&&!buildQueue.includes(k)) buildQueue.push(k);
  }
  buildQueue.sort((A,Bq)=>{ const[a1,a2]=A.split(',').map(Number),[b1,b2]=Bq.split(',').map(Number);
    return (a1-ccx)**2+(a2-ccz)**2-((b1-ccx)**2+(b2-ccz)**2); });
  let n=0;
  while(buildQueue.length&&n<budget){ const k=buildQueue.shift();
    if(chunks.has(k)) continue; const[cx,cz]=k.split(',').map(Number); buildChunk(cx,cz); n++; }
  for(const[k,ch] of chunks){ const[cx,cz]=k.split(',').map(Number);
    const d=Math.max(Math.abs(cx-ccx),Math.abs(cz-ccz));
    if(d>VIEW+2){ for(const m of ch.meshes){ scene.remove(m); m.geometry.dispose(); } chunks.delete(k); } }
}

/* ================= RENDERER · SKY · SEA ================= */
scene.fog=new THREE.Fog(0x9fc5e8,260,870); const FOG=scene.fog;
const camera=new THREE.PerspectiveCamera(62,innerWidth/innerHeight,1,R_WORLD*3.2);
const renderer=new THREE.WebGLRenderer({canvas:$('cv'),antialias:false});
renderer.setPixelRatio(Math.min(2,devicePixelRatio||1));
renderer.setSize(innerWidth,innerHeight);
addEventListener('resize',()=>{camera.aspect=innerWidth/innerHeight;camera.updateProjectionMatrix();renderer.setSize(innerWidth,innerHeight);});
scene.background=new THREE.Color(0x9fc5e8);

/* entity lighting (mobs/players use lambert like MC's soft mob shading) */
const hemi=new THREE.HemisphereLight(0xffffff,0x777788,0.9); scene.add(hemi);
const dirL=new THREE.DirectionalLight(0xffffff,0.5); dirL.position.set(0.4,1,0.25); scene.add(dirL);

const seaDeep=new THREE.Mesh(new THREE.CircleGeometry(R_WORLD*1.002,120),
  new THREE.MeshBasicMaterial({color:0x0c2c48}));
seaDeep.rotation.x=-Math.PI/2; seaDeep.position.y=WATER_Y-16; scene.add(seaDeep);
/* beyond the wall of ice — the OUTER DARKNESS, that no man may look past:
   a tall wall of night just outside the rim, so nothing of "the other side"
   is ever seen — only blackness set with stars, by day as by night. */
function makeVoidTex(){ const S=512, c=texCanvas(S,S), g=c.getContext('2d');
  g.fillStyle='#02030a'; g.fillRect(0,0,S,S);
  for(let k=0;k<520;k++){ const x=hash2(k,1.1)*S, y=hash2(k,2.2)*S, rr=hash2(k,3.3)*1.3+0.3, bb=170+Math.floor(hash2(k,4.4)*85);
    g.fillStyle='rgba('+bb+','+bb+','+(Math.min(255,bb+12))+','+(0.45+hash2(k,5.5)*0.55)+')';
    g.beginPath(); g.arc(x,y,rr,0,6.283); g.fill(); }
  const t=new THREE.CanvasTexture(c); t.wrapS=t.wrapT=THREE.RepeatWrapping; return t; }
const voidTex=makeVoidTex(); voidTex.repeat.set(10,2);
/* fog:true — from the lands the wall of night blends into the day's blue sky
   (so daytime is blue where the sun shines), and only stands black-and-starry
   when the traveller is up against the ice wall itself. */
const voidWall=new THREE.Mesh(new THREE.CylinderGeometry(R_WORLD*0.999,R_WORLD*0.999,12000,160,1,true),
  new THREE.MeshBasicMaterial({map:voidTex,color:0x0a0c18,side:THREE.BackSide,fog:true}));
voidWall.position.y=3400; scene.add(voidWall);

/* ---- BLOWING SNOW at the wall of ice — a particle engine (THREE.Points).
   A cold drift of snow and mist streams on the wind about the traveller as he
   nears the rim, and a cold fog closes in. */
const SNOW_N=2800, SNOW_BOX=240, SNOW_TOP=150;
const snowGeo=new THREE.BufferGeometry(), snowPos=new Float32Array(SNOW_N*3);
for(let i=0;i<SNOW_N;i++){ snowPos[i*3]=(Math.random()-0.5)*2*SNOW_BOX; snowPos[i*3+1]=Math.random()*SNOW_TOP; snowPos[i*3+2]=(Math.random()-0.5)*2*SNOW_BOX; }
snowGeo.setAttribute('position',new THREE.BufferAttribute(snowPos,3));
const snowMat=new THREE.PointsMaterial({color:0xeef4ff,size:0.85,transparent:true,opacity:0,depthWrite:false,fog:false,sizeAttenuation:true});
const snow=new THREE.Points(snowGeo,snowMat); snow.frustumCulled=false; snow.visible=false; scene.add(snow);
const _coldFog=new THREE.Color(0xb6c6da);
function updateWallWeather(px,pz,dt){
  if(state.firm){ snow.visible=false; snowMat.opacity=0; return; }
  const r=Math.hypot(px,pz)/R_WORLD, wallF=Math.max(0,Math.min(1,(r-0.85)/0.1));
  if(wallF>0.01 && scene.fog && !state.firm && state.mode!=='dive'){   /* a cold fog closes in at the rim */
    scene.fog.far*=1-wallF*0.55; scene.fog.color.lerp(_coldFog,wallF*0.55); }
  snow.visible = wallF>0.02;
  if(!snow.visible){ snowMat.opacity=0; return; }
  snowMat.opacity=Math.min(0.9,wallF); snow.position.set(px,0,pz);
  const w=windAt(px,pz), gust=1+0.5*Math.sin(performance.now()*0.0013);
  const wx=w.x*(70+150*w.s)*gust, wz=w.z*(70+150*w.s)*gust, a=snowGeo.attributes.position.array;
  for(let i=0;i<SNOW_N;i++){ const j=i*3;
    a[j]+=wx*dt; a[j+2]+=wz*dt; a[j+1]-=(26+i%7*3)*dt;                  /* borne on the wind, and falling */
    if(a[j]>SNOW_BOX)a[j]-=2*SNOW_BOX; else if(a[j]<-SNOW_BOX)a[j]+=2*SNOW_BOX;
    if(a[j+2]>SNOW_BOX)a[j+2]-=2*SNOW_BOX; else if(a[j+2]<-SNOW_BOX)a[j+2]+=2*SNOW_BOX;
    if(a[j+1]<0)a[j+1]+=SNOW_TOP; }
  snowGeo.attributes.position.needsUpdate=true;
}
/* The far ring beyond the wave grid — a PLAIN deep-water colour, no tile
   texture (the old blocky water plane is gone; the Gerstner grid is the only
   surface water now). It sits just under the grid's flat edge, deep in fog. */
/* NOT in LIT — it has no texture, so setBlockLight would tint its flat colour
   to solid white at midday and flood the sea. It keeps a fixed deep blue and
   is lit only by the fog it sits within. */
const farSeaMat=new THREE.MeshBasicMaterial({color:0x123353});
const sea=new THREE.Mesh(new THREE.CircleGeometry(R_WORLD*1.002,120),farSeaMat);
/* the dark bed of the sea sits WELL below the surface now, so the sandy
   shelf along every coast truly shows through the clear shallows above it */
sea.rotation.x=-Math.PI/2; sea.position.y=WATER_Y-12; scene.add(sea);

/* ================= THE WAVES OF THE DEEP =================
   A true trochoidal (Gerstner) sea: several travelling swells summed, so
   crests rise sharp and troughs roll round. The same wave field drives the
   surface (on the GPU) and the ship's heave, pitch and roll (on the CPU),
   so she truly rides the water. Deep-water physics: a swell's speed grows
   with its wavelength (ω = √(g·k)). */
const G_GRAV=16;
const WAVES=(()=>{
  const raw=[[0.86,0.51,190,1.7,0.72],[-0.6,0.8,120,1.05,0.68],
             [0.35,-0.94,70,0.6,0.6],[0.98,-0.2,41,0.3,0.5]];
  return raw.map(r=>{ const m=Math.hypot(r[0],r[1]);
    const k=2*Math.PI/r[2];
    return {dx:r[0]/m,dy:r[1]/m,k,A:r[3],Q:r[4],omega:Math.sqrt(G_GRAV*k)}; });
})();
let seaTime=0, seaAmp=1;                    /* shared clock + storm amplitude */
function seaHeight(x,z){ let y=0;
  for(const w of WAVES){ const f=w.k*(w.dx*x+w.dy*z)+w.omega*seaTime; y+=w.A*seaAmp*Math.sin(f); }
  return y; }
const _slope={x:0,z:0};
function seaSlope(x,z){ let sx=0,sz=0;
  for(const w of WAVES){ const f=w.k*(w.dx*x+w.dy*z)+w.omega*seaTime;
    const c=Math.cos(f)*w.A*seaAmp*w.k; sx+=c*w.dx; sz+=c*w.dy; }
  _slope.x=sx; _slope.z=sz; return _slope; }

/* the GPU wave grid, following the ship/traveller across the deep */
const WG_S=1250, WG_SEG=150;
const waveGeo=(()=>{
  const g=new THREE.BufferGeometry(), pos=[], idx=[], N=WG_SEG+1;
  for(let j=0;j<N;j++) for(let i=0;i<N;i++)
    pos.push(-WG_S+i/WG_SEG*2*WG_S, 0, -WG_S+j/WG_SEG*2*WG_S);
  for(let j=0;j<WG_SEG;j++) for(let i=0;i<WG_SEG;i++){
    const a=j*N+i, b=a+1, c=a+N, d=c+1; idx.push(a,c,b, b,c,d); }
  g.setAttribute('position',new THREE.Float32BufferAttribute(pos,3));
  g.setIndex(idx); return g;
})();
const waveUnroll=WAVES.map(w=>`{
  vec2 D=vec2(${w.dx.toFixed(5)},${w.dy.toFixed(5)});
  float A=amp*${w.A.toFixed(4)}, k=${w.k.toFixed(6)}, Q=${w.Q.toFixed(3)};
  float f=k*dot(D,P)+${w.omega.toFixed(5)}*uTime, c=cos(f), s=sin(f);
  disp.x+=Q*A*D.x*c; disp.z+=Q*A*D.y*c; disp.y+=A*s;
  float WA=k*A; nrm.x-=D.x*WA*c; nrm.z-=D.y*WA*c; nrm.y-=Q*WA*s;
}`).join('\n');
const waveMat=new THREE.ShaderMaterial({
  transparent:true, side:THREE.DoubleSide,
  uniforms:{ uTime:{value:0}, uAmp:{value:1}, uCenter:{value:new THREE.Vector2()},
    uLight:{value:new THREE.Color(1,1,1)}, uFogColor:{value:new THREE.Color(0x9fc5e8)},
    uFogNear:{value:260}, uFogFar:{value:870}, uSunDir:{value:new THREE.Vector3(0.4,1,0.25)},
    uDeep:{value:new THREE.Color(0x0e2c4e)}, uShallow:{value:new THREE.Color(0x2fb3cf)},
    uMap:{value:seaTex}, uOpacity:{value:0.9}, uCamPos:{value:new THREE.Vector3()},
    uShoal:{value:SHOAL_TEX},
    uShip:{value:new THREE.Vector4()}, uShipH:{value:0}, uSunCol:{value:new THREE.Color(1,0.96,0.85)} },
  vertexShader:`
    uniform float uTime, uAmp; uniform vec2 uCenter;
    varying vec3 vNormal, vWorld; varying float vHeight, vFog; varying vec2 vUv, vP;
    void main(){
      vec2 P=position.xz+uCenter;
      float ed=max(abs(position.x),abs(position.z));
      float taper=1.0-smoothstep(${(WG_S*0.55).toFixed(1)},${(WG_S*0.97).toFixed(1)},ed);
      float amp=uAmp*taper;
      vec3 disp=vec3(P.x, ${WATER_Y.toFixed(3)}, P.y);
      vec3 nrm=vec3(0.0,1.0,0.0);
      ${waveUnroll}
      vHeight=disp.y-${WATER_Y.toFixed(3)};
      vNormal=normalize(nrm); vUv=P*0.02; vP=P; vWorld=disp;
      vec4 mv=viewMatrix*vec4(disp,1.0); vFog=-mv.z;
      gl_Position=projectionMatrix*mv;
    }`,
  fragmentShader:`
    precision highp float;
    uniform vec3 uLight, uFogColor, uSunDir, uDeep, uShallow, uCamPos, uSunCol; uniform sampler2D uMap, uShoal;
    uniform float uFogNear, uFogFar, uOpacity, uTime, uShipH; uniform vec4 uShip;
    varying vec3 vNormal, vWorld; varying float vHeight, vFog; varying vec2 vUv, vP;
    float h21(vec2 p){ return fract(sin(dot(p,vec2(41.3,289.1)))*43758.5); }
    void main(){
      vec3 N=normalize(vNormal);
      vec3 V=normalize(uCamPos-vWorld);
      vec3 L=normalize(uSunDir);
      float diff=clamp(dot(N,L),0.0,1.0);
      vec3 tex=texture2D(uMap,vUv).rgb;
      /* how near the land lies beneath: 1 clear shallow → 0 the true deep
         (smoothstepped so the field rolls off without banding) */
      float shoalRaw=texture2D(uShoal, vP*${(0.5/R_WORLD).toFixed(10)}+0.5).r;
      float shoal=smoothstep(0.03,0.9,shoalRaw);
      float deepF=1.0-shoal;
      /* colour by real depth — turquoise over the shallows, dark over the deep —
         with a breath of the old wave-height shading kept within it */
      vec3 base=mix(uShallow,uDeep,deepF);
      base*=0.88+0.24*clamp(vHeight*0.22+0.5,0.0,1.0);
      vec3 col=base*(0.62+0.5*diff)*(0.82+0.36*tex.b);
      /* crest foam — only the very tallest crests, so the sea stays blue */
      float foam=smoothstep(2.3,3.4,vHeight);
      /* the ship's wake: bright collar at the hull, a widening V astern */
      vec2 fwd=vec2(sin(uShipH),cos(uShipH)), rgt=vec2(cos(uShipH),-sin(uShipH));
      vec2 rel=vP-uShip.xy; float along=dot(rel,fwd), side=dot(rel,rgt);
      float spd=uShip.z, near=uShip.w;
      float d=max(0.0,-along+6.0);
      float arm=smoothstep(4.5,0.0,abs(abs(side)-d*0.33))*smoothstep(230.0,0.0,d);
      float cen=smoothstep(9.0+d*0.14,0.0,abs(side))*smoothstep(80.0,0.0,d)*0.6;
      float collar=smoothstep(38.0,13.0,length(rel));
      float wob=0.6+0.4*sin(vP.x*0.6+vP.y*0.55+uTime*7.0);
      float wake=clamp((arm+cen+collar*0.8)*spd*wob*near,0.0,1.0);
      /* SHORE-LAPPING WASH — rings of foam marching down the shoal gradient,
         so each line of surf wraps the coast and runs up the strand in turn,
         broken ragged by the water texture so no two waves break alike */
      float lap=0.0;
      if(shoalRaw>0.5){
        float ring=fract(shoalRaw*7.0-uTime*0.32);
        float crest=smoothstep(0.58,0.88,ring)-smoothstep(0.9,1.0,ring);
        float brk=0.35+0.75*texture2D(uMap, vP*0.008+vec2(uTime*0.006,uTime*0.004)).b;
        lap=clamp(crest,0.0,1.0)*smoothstep(0.5,0.85,shoalRaw)*brk;
        /* and a standing line of white wash right at the water's edge */
        lap+=smoothstep(0.9,0.99,shoalRaw)*brk*(0.5+0.3*sin(uTime*1.7+shoalRaw*40.0));
      }
      float allFoam=clamp(foam*0.32+wake*0.95+lap,0.0,1.0);
      col=mix(col,vec3(0.88,0.93,1.0),allFoam);
      col*=uLight;
      /* sun specular + glitter — the sun's path burning on the swell */
      vec3 H=normalize(V+L);
      float spec=pow(max(dot(N,H),0.0),140.0);
      float glit=pow(max(dot(N,H),0.0),40.0)*(0.5+0.5*h21(floor(vP*1.7)+floor(uTime*9.0)));
      col+=uSunCol*(spec*1.8+glit*0.2)*diff;
      /* caustic sparkle where the light passes through to the sand */
      col+=uSunCol*glit*0.3*shoal*diff;
      /* fresnel — the sky truly mirrored at grazing angles */
      float fres=pow(1.0-max(dot(N,V),0.0),5.0);
      col=mix(col,uFogColor*1.05,fres*0.45);
      /* transparency by depth: the shallows let the bottom show through,
         the deep keeps its darkness; a mirror-skin at grazing angles */
      float aa=mix(0.55,0.93,deepF);
      aa=mix(aa,0.985,fres*0.6);
      aa=max(aa,allFoam*0.95);
      float ff=clamp((vFog-uFogNear)/(uFogFar-uFogNear),0.0,1.0);
      gl_FragColor=vec4(mix(col,uFogColor,ff),aa);
    }`
});
const waveGrid=new THREE.Mesh(waveGeo,waveMat);
waveGrid.frustumCulled=false; scene.add(waveGrid);
const _sunW=new THREE.Vector3();
function waterTick(px,pz,dayF,storm){
  seaTime=performance.now()*0.001; seaAmp=1+storm*1.7;
  const u=waveMat.uniforms;
  u.uTime.value=seaTime; u.uAmp.value=seaAmp;
  u.uCenter.value.set(px,pz);
  u.uLight.value.copy(mix3(0x38405e,0xd9a878,0xffffff,dayF)).multiplyScalar(1-storm*0.34);
  u.uSunCol.value.copy(mix3(0x243048,0xffcf8a,0xfff2d6,dayF));
  if(scene.fog){ u.uFogColor.value.copy(scene.fog.color);
    u.uFogNear.value=scene.fog.near; u.uFogFar.value=scene.fog.far; }
  sun.getWorldPosition(_sunW); u.uSunDir.value.copy(_sunW).normalize();
  u.uCamPos.value.copy(camera.position);
  const spd=Math.min(1,Math.abs(state.boat.speed)/30);
  const shown=(state.mode!=='walk')?1:Math.max(0,1-Math.hypot(px-state.boat.x,pz-state.boat.z)/400);
  u.uShip.value.set(state.boat.x,state.boat.z,spd,shown);
  u.uShipH.value=state.boat.heading;
}

/* flat drifting clouds, minecraft-fashion.
   CLOUD_Y is the floor of cloud the traveller rises through when he takes to
   the air; a higher, thinner cirrus sheet gives the sky depth from above. */
const CLOUD_Y=238, CIRRUS_Y=560;
const cloudMat=new THREE.MeshBasicMaterial({map:TEX.clouds,transparent:true,opacity:0.85,depthWrite:false,fog:false,side:THREE.DoubleSide});
TEX.clouds.repeat.set(7,7);
const clouds=new THREE.Mesh(new THREE.PlaneGeometry(9600,9600),cloudMat);
clouds.rotation.x=-Math.PI/2; clouds.position.y=CLOUD_Y; scene.add(clouds);
/* the high cirrus — a second, fainter, larger-scaled sheet above the first */
const cirrusMat=new THREE.MeshBasicMaterial({map:TEX.clouds,transparent:true,opacity:0.0,depthWrite:false,fog:false,side:THREE.DoubleSide});
const cirrus=new THREE.Mesh(new THREE.PlaneGeometry(15000,15000),cirrusMat);
cirrus.rotation.x=-Math.PI/2; cirrus.position.y=CIRRUS_Y; scene.add(cirrus);

/* ---- THE SEA OF CLOUDS — a bumpy, shaded deck with real relief ------------
   A wide mesh whose vertices are lifted by smooth noise sampled in world
   space, so rolling cloud-hills stream beneath the traveller and catch the
   light of the sun. A thin wispy sheet drifts just above it. Both appear only
   once he has risen above the cloud floor, so the view from below is untouched. */
const CS_SEG=132, CS_SIZE=46000, CS_AMP=140;
const cloudGeo=new THREE.PlaneGeometry(CS_SIZE,CS_SIZE,CS_SEG,CS_SEG); cloudGeo.rotateX(-Math.PI/2);
cloudGeo.setAttribute('color',new THREE.BufferAttribute(new Float32Array(cloudGeo.attributes.position.count*3),3));
const cloudDeckMat=new THREE.MeshLambertMaterial({color:0xffffff,vertexColors:true,transparent:true,opacity:0,side:THREE.DoubleSide});
const cloudDeck=new THREE.Mesh(cloudGeo,cloudDeckMat);
cloudDeck.position.y=CLOUD_Y; cloudDeck.visible=false; cloudDeck.frustumCulled=false; scene.add(cloudDeck);
function updateCloudDeck(px,pz){ const pos=cloudGeo.attributes.position, a=pos.array, col=cloudGeo.attributes.color.array;
  for(let i=0;i<a.length;i+=3){ const wx=(a[i]+px)*0.0011, wz=(a[i+2]+pz)*0.0011;
    const h=Math.pow(fbm(wx,wz),1.4); a[i+1]=h*CS_AMP;                  /* rolling hills of cloud */
    const b=0.55+0.45*h;                                               /* peaks bright, valleys shaded (blue-grey) */
    col[i]=Math.min(1,b*0.9+0.12); col[i+1]=Math.min(1,b*0.93+0.09); col[i+2]=Math.min(1,b*0.98+0.04); }
  pos.needsUpdate=true; cloudGeo.attributes.color.needsUpdate=true; cloudGeo.computeVertexNormals(); }
/* a wispy tops overlay — a soft feathered texture, semi-transparent */
function makeWispTex(){ const S=256, c=texCanvas(S,S), g=c.getContext('2d');
  const img=g.createImageData(S,S), d=img.data;
  function tn(x,y,f){ const X=x/S*f,Y=y/S*f,wx=x/S,wy=y/S;
    return vnoise(X,Y)*(1-wx)*(1-wy)+vnoise(X-f,Y)*wx*(1-wy)+vnoise(X,Y-f)*(1-wx)*wy+vnoise(X-f,Y-f)*wx*wy; }
  for(let y=0;y<S;y++)for(let x=0;x<S;x++){ const i=(y*S+x)*4;
    let h=(tn(x,y,4)*0.6+tn(x,y,9)*0.4-0.5)/0.3; h=Math.max(0,Math.min(1,h));
    d[i]=d[i+1]=255; d[i+2]=255; d[i+3]=Math.round(h*h*150); }
  g.putImageData(img,0,0); const t=new THREE.CanvasTexture(c);
  t.wrapS=t.wrapT=THREE.RepeatWrapping; t.anisotropy=8; return t; }
const wispMat=new THREE.MeshBasicMaterial({map:makeWispTex(),transparent:true,opacity:0,depthWrite:false,fog:true,side:THREE.DoubleSide});
wispMat.map.repeat.set(30,30);
const cloudWisp=new THREE.Mesh(new THREE.PlaneGeometry(100000,100000),wispMat);
cloudWisp.rotation.x=-Math.PI/2; cloudWisp.position.y=CLOUD_Y+64; cloudWisp.visible=false; scene.add(cloudWisp);
/* ---- THE CLOUD COVER over the whole face of the earth — a FIXED sheet the
   size of the disc, so from aloft the entire circle is seen mantled in cloud,
   and at the ice wall the cloud ends at the wall, not about the traveller. */
function makeCoverTex(){ const S=256, c=texCanvas(S,S), g=c.getContext('2d'), img=g.createImageData(S,S), d=img.data;
  function tn(x,y,f){ const X=x/S*f,Y=y/S*f,wx=x/S,wy=y/S; return vnoise(X,Y)*(1-wx)*(1-wy)+vnoise(X-f,Y)*wx*(1-wy)+vnoise(X,Y-f)*(1-wx)*wy+vnoise(X-f,Y-f)*wx*wy; }
  for(let y=0;y<S;y++)for(let x=0;x<S;x++){ const i=(y*S+x)*4; let h=(tn(x,y,3)*0.6+tn(x,y,7)*0.4-0.34)/0.42; h=Math.max(0,Math.min(1,h));
    const L=0.72+0.28*h; d[i]=L*248; d[i+1]=L*250; d[i+2]=L*255; d[i+3]=Math.round((0.4+0.6*h)*255); }
  g.putImageData(img,0,0); const t=new THREE.CanvasTexture(c); t.wrapS=t.wrapT=THREE.RepeatWrapping; t.anisotropy=8; return t; }
const coverTex=makeCoverTex(); coverTex.repeat.set(ICE_UV*R_WORLD/1200,ICE_UV*R_WORLD/1200);
const cloudCover=new THREE.Mesh(new THREE.CircleGeometry(ICE_UV*R_WORLD,140),
  new THREE.MeshBasicMaterial({map:coverTex,transparent:true,opacity:0,depthWrite:false,fog:true,side:THREE.DoubleSide}));
cloudCover.rotation.x=-Math.PI/2; cloudCover.position.y=CLOUD_Y-10; cloudCover.visible=false; scene.add(cloudCover);

/* the stars, circling the pole in the midst */
const starGroup=new THREE.Group(); scene.add(starGroup);
{ const pts=[]; for(let i=0;i<1400;i++){ const a=Math.random()*Math.PI*2, e=Math.acos(Math.random());
    const R2=R_WORLD*1.25; pts.push(R2*Math.sin(e)*Math.cos(a), Math.max(R_WORLD*0.02,R2*Math.cos(e)), R2*Math.sin(e)*Math.sin(a)); }
  const g=new THREE.BufferGeometry(); g.setAttribute('position',new THREE.Float32BufferAttribute(pts,3));
  const m=new THREE.PointsMaterial({color:0xdfe8ff,size:2.4,transparent:true,opacity:0,fog:false,sizeAttenuation:false});
  starGroup.add(new THREE.Points(g,m)); starGroup.userData.mat=m; }

/* the two great lights — square, as they ought to be */
const sunMat2=new THREE.SpriteMaterial({map:TEX.sun,fog:false,transparent:true,depthWrite:false});
const sun=new THREE.Sprite(sunMat2); sun.scale.set(R_WORLD*0.075,R_WORLD*0.075,1); scene.add(sun);
const moonMat2=new THREE.SpriteMaterial({map:TEX.moon,fog:false,transparent:true,depthWrite:false});
const moon=new THREE.Sprite(moonMat2); moon.scale.set(R_WORLD*0.055,R_WORLD*0.055,1); scene.add(moon);
const glowTexCv=(()=>{ const c=texCanvas(128); const g=c.getContext('2d');
  const gr=g.createRadialGradient(64,64,4,64,64,62);
  gr.addColorStop(0,'rgba(255,214,110,0.9)'); gr.addColorStop(1,'rgba(255,190,80,0)');
  g.fillStyle=gr; g.fillRect(0,0,128,128); return new THREE.CanvasTexture(c); })();

/* ================= COURSES OF THE LIGHTS ================= */
const state={ simHours:9.5, speedIdx:1, paused:false,
  mode:'boat', boat:{x:0,z:0,heading:Math.PI*0.9,speed:0},
  walk:{x:0,z:0,heading:0}, deck:{lx:2.4,lz:-21,h:Math.PI},
  fly:{x:0,y:0,z:0,heading:0,vy:0,sp:0}, prevGround:'boat',
  dive:{x:0,y:0,z:0,heading:0,vy:0,sp:0},
  windMode:'true', firm:false, firmDist:0, camYaw:0, camPitch:0.42, camDist:96,
  visited:new Set(), dist:0, fish:0, fishing:null, coins:30, cargo:{}, game:0 };

/* ================= THE WINDS =================
   The bands of the disc mirror the true circulation: trade easterlies in
   the tropics, westerlies in the middle latitudes, polar easterlies near
   the midst and the rim. Run before the wind and the ship flies; beat
   against it and she labours — exactly the age-of-sail routes. */
function windAt(x,z){
  const u=x/R_WORLD, v=z/R_WORLD, r=Math.hypot(u,v)||1e-9;
  const ex=v/r, ez=-u/r;                                   // eastward tangent
  const lat=90-r*180, a=Math.abs(lat);
  let dir,s;
  if(a<30){ dir=-1; s=1.0; } else if(a<60){ dir=1; s=0.85; } else { dir=-1; s=0.6; }
  const edge=Math.min(Math.abs(a-30),Math.abs(a-60))/6;    // lulls at the band borders
  s*=0.45+0.55*Math.min(1,edge);
  const wob=(fbm(u*5+state.simHours*0.02, v*5)-0.5)*0.9;   // slow shifting of the airs
  const cw=Math.cos(wob), sw=Math.sin(wob);
  return {x:dir*(ex*cw+ez*sw), z:dir*(ez*cw-ex*sw), s};
}
function sailFactor(heading){
  if(state.windMode==='calm') return 1;
  if(state.windMode==='fair') return 1.6;
  const w=windAt(state.boat.x,state.boat.z);
  const c=Math.sin(heading)*w.x+Math.cos(heading)*w.z;     // 1 running · 0 beam · -1 beating
  const m=1.15+0.575*c;                                    // 1.7× / 1.15× / 0.575×
  return 1+(m-1)*w.s;
}
const COMPASS8=['N','NE','E','SE','S','SW','W','NW'];
function windLabel(){
  if(state.windMode==='fair') return 'fair, always astern';
  if(state.windMode==='calm') return 'becalmed';
  const p=state.mode==='boat'?state.boat:state.walk;
  const w=windAt(p.x,p.z);
  const pu=p.x/R_WORLD, pv=p.z/R_WORLD, rr=Math.hypot(pu,pv)||1e-9;
  const nX=-pu/rr, nZ=-pv/rr, eX=pv/rr, eZ=-pu/rr;         // north = toward the midst
  const fx=-w.x, fz=-w.z;                                  // named by where it blows FROM
  const ang=Math.atan2(fx*eX+fz*eZ, fx*nX+fz*nZ);
  const idx=(Math.round(ang/(Math.PI/4))+8)%8;
  return COMPASS8[idx]+(w.s>0.75?', fresh':w.s>0.45?', steady':', light');
}

/* ================= STORMS =================
   Wandering cells of foul weather: darkness, close fog, heavy seas and a
   slowed ship. They drift about the deep and show on the maps — steer wide. */
const STORMS=[];
for(let i=0;i<9;i++) STORMS.push({
  a:hash2(i,1.7)*Math.PI*2, r:0.2+hash2(i,2.3)*0.65, R:1600+hash2(i,3.1)*2600,
  va:(hash2(i,4.9)-0.5)*0.004, vr:(hash2(i,5.7)-0.5)*0.0006 });
function stormTick(dt){ for(const s of STORMS){ s.a+=s.va*dt; s.r+=s.vr*dt;
  if(s.r<0.1||s.r>0.9) s.vr*=-1; } }
function stormAt(x,z){ let f=0;
  for(const s of STORMS){ const sx=Math.sin(s.a)*s.r*R_WORLD, sz=Math.cos(s.a)*s.r*R_WORLD;
    const d=Math.hypot(x-sx,z-sz); if(d<s.R) f=Math.max(f,1-d/s.R); }
  return f; }
function dayOfYear(){ return Math.floor(state.simHours/24)%364+1; }
function sunUV(){ const Dd=dayOfYear();
  const R2=0.5-0.13*Math.sin(2*Math.PI*(Dd-1)/364);
  const A=-(state.simHours/24)*2*Math.PI+Math.PI;
  return [R2*Math.sin(A), R2*Math.cos(A)]; }
function moonUV(){ const age=(state.simHours/24)%29.53;
  const A=-(state.simHours/24)*2*Math.PI+Math.PI-2*Math.PI*age/29.53;
  const R2=0.5-0.13*Math.sin(2*Math.PI*(dayOfYear()-16)/364);
  return [R2*Math.sin(A), R2*Math.cos(A)]; }
const _c1=new THREE.Color(), _c2=new THREE.Color(), _c3=new THREE.Color();
function mix3(hexA,hexB,hexC,t){ // 0=night .5=dusk 1=day
  if(t<0.5){ _c1.setHex(hexA); _c2.setHex(hexB); return _c3.copy(_c1).lerp(_c2,t*2); }
  _c1.setHex(hexB); _c2.setHex(hexC); return _c3.copy(_c1).lerp(_c2,(t-0.5)*2);
}
function skyTick(px,pz){
  const [su,sv]=sunUV(); const pu=px/R_WORLD, pv=pz/R_WORLD;
  const dUV=Math.hypot(pu-su,pv-sv);
  const dayF=Math.max(0,Math.min(1,(0.66-dUV)/0.3));
  let sky=mix3(0x0a1024,0xe58a4a,0x9fc5e8,dayF).getHex();
  const st=stormAt(px,pz);
  if(st>0.01){ _c1.setHex(sky); _c2.setHex(0x4c545e); sky=_c1.lerp(_c2,st*0.75).getHex(); }
  scene.background.setHex(sky);
  if(scene.fog){ scene.fog.color.setHex(sky); /* fog is detached in the firmament view */
    scene.fog.near=260*(1-st*0.65); scene.fog.far=870-st*520; }
  const l=mix3(0x38405e,0xd9a878,0xffffff,dayF);
  const dim=1-st*0.38;
  setBlockLight(l.r*dim,l.g*dim,l.b*dim);
  hemi.intensity=0.35+dayF*0.6; dirL.intensity=0.15+dayF*0.45;
  cloudMat.opacity=0.35+dayF*0.5;
  starGroup.userData.mat.opacity=Math.max(0,1-dayF*1.6)*0.95;
  starGroup.rotation.y=-(state.simHours/24)*2*Math.PI;
  const sy=R_WORLD*0.375-R_WORLD*0.155*Math.min(1,dUV/0.9);
  sun.position.set(su*R_WORLD,Math.max(R_WORLD*0.065,sy),sv*R_WORLD);
  sunMat2.opacity=Math.max(0,1-Math.max(0,dUV-0.7)/0.45);
  const [mu,mv]=moonUV(); const mUVd=Math.hypot(pu-mu,pv-mv);
  moon.position.set(mu*R_WORLD,Math.max(R_WORLD*0.06,R_WORLD*0.3375-R_WORLD*0.14*Math.min(1,mUVd/0.9)),mv*R_WORLD);
  moonMat2.opacity=Math.max(0,1-Math.max(0,mUVd-0.7)/0.45);
  return {dayF, nightF:Math.max(0,1-dayF*1.5), storm:st};
}

/* ================= THE SHIP (plank-built) ================= */
/* Entity boxes need their own materials: the shared chunk materials have
   vertexColors on, and BoxGeometry carries no colour attribute — the GPU
   multiplies by black and the whole ship renders as a silhouette. */
const ENTMAT={};
function entMat(name){ let m=ENTMAT[name];
  if(!m){ m=new THREE.MeshBasicMaterial({map:MAT[name].map, side:THREE.DoubleSide});
    ENTMAT[name]=m; LIT.push(m); }
  return m; }
function texBox(w,h,d, matSide, matTop, matBot){
  const g=new THREE.BoxGeometry(w,h,d);
  const ms=entMat(matSide), mt=entMat(matTop||matSide), mb=entMat(matBot||matSide);
  return new THREE.Mesh(g,[ms,ms,mt,mb,ms,ms]);
}
/* A true brig, black-flag-fashion: long hull, two masts of square sails, a
   raised quarterdeck with the ship's wheel, bulwarks you walk between, a
   bowsprit over the bow. Local +z is FORWARD (the bow); the quarterdeck and
   helm sit aft at -z, in view of the following camera. The deck is a real
   place — the traveller stands at the wheel to sail, and can walk the planks. */
/* Hull-local proportions (the hull is built at these, then scaled up whole). */
const DECK_Y=6.2, QDECK_Y=11, FDECK_Y=8.8, FDECK_Z=17.5, QDECK_Z=-17.6, HELM={x:0,z:-22.6}, WHEEL_Z=-20.4;
/* SHIP_S doubles her in every dimension — a great galleon, deck room for
   twelve souls and more, and a walkable cargo hold below the waist deck.
   SHIP_SX widens the beam further still, so she sits broad upon the screen. */
const SHIP_S=2.0, SHIP_SX=SHIP_S*1.4;
const SD={ deckY:DECK_Y*SHIP_S, qdeckY:QDECK_Y*SHIP_S, fdeckY:FDECK_Y*SHIP_S,
  fdeckZ:FDECK_Z*SHIP_S, qdeckZ:QDECK_Z*SHIP_S, helmZ:HELM.z*SHIP_S, wheelZ:WHEEL_Z*SHIP_S };
const HOLD={halfX:2.9*SHIP_SX, z0:-19*SHIP_S, z1:23*SHIP_S, y:0.55*SHIP_S};
const HATCH={x:0, z:4.6*SHIP_S, r:3.8*SHIP_S};
const boatG=new THREE.Group();
const hullG=new THREE.Group(); hullG.scale.set(SHIP_SX,SHIP_S,SHIP_S); boatG.add(hullG);
{ const add=(m,x,y,z)=>{ m.position.set(x,y,z); hullG.add(m); return m; };
  /* ---- hull with rising sheer: waist, stepped prow, stern run ---- */
  add(texBox(14,6.4,52,'planks','planks'),0,3.0,-2);           // waist, deck top 6.2
  add(texBox(13,2.2,8,'planks','planks'),0,1.1,30);
  add(texBox(10,4.4,8,'planks','planks'),0,3.4,30);
  add(texBox(7,5.6,6,'planks','planks'),0,4.6,36);
  add(texBox(13,2.2,6,'planks','planks'),0,1.1,-31);
  add(texBox(12,7.2,6,'planks','planks'),0,4.4,-30);
  /* forecastle with its rail and steps */
  add(texBox(12,2.6,9,'planks','planks'),0,7.5,21.5);          // deck top 8.8
  add(texBox(10,1.6,1,'logSide','logTop'),0,9.6,25.6);
  add(texBox(1,1.6,8,'logSide','logTop'),5.3,9.6,21.5);
  add(texBox(1,1.6,8,'logSide','logTop'),-5.3,9.6,21.5);
  add(texBox(4,1.4,2.2,'planks','planks'),0,6.9,16.6);
  /* bowsprit, steeved upward in two strides */
  add(texBox(1.4,1.4,10,'logSide','logTop'),0,8.2,41);
  add(texBox(1.1,1.1,8,'logSide','logTop'),0,10.0,47);
  /* bulwarks along the waist with a gangway gap amidships */
  for(const s of [1,-1]){
    add(texBox(1.0,2.0,12,'planks','planks'),s*6.4,7.2,10.5);
    add(texBox(1.0,2.0,18,'planks','planks'),s*6.4,7.2,-8.6);
  }
  /* quarterdeck over the great cabin, rails, companion steps */
  add(texBox(14,4.8,10.4,'planks','planks'),0,8.6,-22.8);      // top at 11
  for(const s of [1,-1]) add(texBox(1.0,1.8,10.4,'logSide','logTop'),s*6.4,11.9,-22.8);
  add(texBox(14,1.8,1.0,'logSide','logTop'),0,11.9,-27.6);
  add(texBox(5,1.2,2.4,'planks','planks'),0,6.8,-16.6);
  add(texBox(5,2.4,2.4,'planks','planks'),0,7.4,-18.4);
  /* the wheel */
  add(texBox(1.1,2.4,1.1,'logSide','logTop'),0,12.2,WHEEL_Z);
  const wheel=add(texBox(3.6,3.6,0.6,'benchSide','benchTop'),0,14.6,WHEEL_Z-0.2);
  for(const [hx,hy] of [[0,2.1],[0,-2.1],[2.1,0],[-2.1,0]])
    { const hnd=texBox(0.5,0.5,0.9,'logSide'); hnd.position.set(hx,hy,0); wheel.add(hnd); }
  /* three masts; square sails on fore and main, the mizzen bare-yarded */
  const mkSail=(w,h)=>{ const m=new THREE.MeshBasicMaterial({map:TEX.wool,side:THREE.DoubleSide});
    m.color.setRGB(1,1,1); LIT.push(m);
    return new THREE.Mesh(new THREE.PlaneGeometry(w,h),m); };
  const mast=(z,base,hgt,sails)=>{ add(texBox(1.6,hgt,1.6,'logSide','logTop'),0,base+hgt/2,z);
    if(sails){
      add(texBox(hgt*0.52,0.9,0.9,'logSide'),0,base+hgt*0.62,z);
      add(texBox(hgt*0.36,0.8,0.8,'logSide'),0,base+hgt*0.88,z);
      add(mkSail(hgt*0.5,hgt*0.26),0,base+hgt*0.52,z+0.9);
      add(mkSail(hgt*0.34,hgt*0.18),0,base+hgt*0.82,z+0.9);
    } };
  mast(14,DECK_Y,34,true);
  mast(-4,DECK_Y,46,true);
  mast(-25.5,QDECK_Y,26,false);
  add(texBox(10,0.8,0.8,'logSide'),0,QDECK_Y+26*0.62,-25.5);
  /* stern-cabin windows and a pair of stern lanterns */
  { const gm=new THREE.MeshBasicMaterial({map:TEX.glass,transparent:true,depthWrite:false});
    for(const wx of [-3.5,0,3.5]){ const win=new THREE.Mesh(new THREE.PlaneGeometry(2.2,1.6),gm);
      win.position.set(wx,5.2,-33.06); win.rotation.y=Math.PI; hullG.add(win); } }
  for(const s of [1,-1]){ const lan=new THREE.Mesh(new THREE.BoxGeometry(1,1.2,1),torchMat);
    lan.position.set(s*6.2,13.4,-27.4); hullG.add(lan); }
  const flag=texBox(4,2,0.3,'hayTop'); flag.position.set(2,DECK_Y+48.5,-3); hullG.add(flag);
  /* ---- the fine work, merged into a handful of draw calls: twin wales,
          stays and shrouds as stepped rigging, crow's nests, deck stores ---- */
  const G=newG();
  for(const s of [1,-1]){
    emitBox(G, s*7.02-0.25,1.8,-31, s*7.02+0.25,2.6,32, 'logSide','logSide',null);
    emitBox(G, s*7.02-0.25,4.2,-31, s*7.02+0.25,5.0,30, 'logSide','logSide',null);
  }
  const rig=(x0,y0,z0,x1,y1,z1)=>{ const n=Math.max(3,Math.ceil(Math.hypot(x1-x0,y1-y0,z1-z0)/0.8));
    for(let k=0;k<=n;k++){ const t=k/n, x=x0+(x1-x0)*t, y=y0+(y1-y0)*t, z=z0+(z1-z0)*t;
      emitBox(G, x-0.17,y-0.17,z-0.17, x+0.17,y+0.17,z+0.17, 'logSide','logTop',null); } };
  rig(0,10.6,50.5, 0,DECK_Y+34,14.8);                          // forestay down the sprit
  rig(0,DECK_Y+34,13.2, 0,DECK_Y+46,-3.2);                     // stays between the tops
  rig(0,DECK_Y+46,-4.8, 0,QDECK_Y+26,-24.9);
  for(const s of [1,-1]){                                      // shrouds to the rails
    rig(s*5.8,8.2,17.5, s*1.1,DECK_Y+25,14.3);
    rig(s*5.8,8.2,3.5,  s*1.1,DECK_Y+34,-3.7);
    rig(s*5.8,12.8,-27.0, s*1.0,QDECK_Y+19,-25.6);
  }
  const nest=(z,y)=>{ emitBox(G,-1.9,y,z-1.9, 1.9,y+0.7,z+1.9,'planks','planks','planks');
    emitBox(G,-1.9,y+0.7,z-1.9, -1.4,y+2.0,z+1.9,'planks','planks',null);
    emitBox(G, 1.4,y+0.7,z-1.9,  1.9,y+2.0,z+1.9,'planks','planks',null);
    emitBox(G,-1.4,y+0.7,z-1.9,  1.4,y+2.0,z-1.4,'planks','planks',null);
    emitBox(G,-1.4,y+0.7,z+1.4,  1.4,y+2.0,z+1.9,'planks','planks',null); };
  nest(14,DECK_Y+24.5); nest(-4,DECK_Y+33.5); nest(-25.5,QDECK_Y+18.5);
  /* the hatchway down to the hold, amidships (an open coaming, no cover) */
  emitBox(G,-2.2,DECK_Y,2.4, -1.7,DECK_Y+0.5,6.8,'benchTop','benchTop',null);
  emitBox(G, 1.7,DECK_Y,2.4,  2.2,DECK_Y+0.5,6.8,'benchTop','benchTop',null);
  emitBox(G,-1.7,DECK_Y,2.4,  1.7,DECK_Y+0.5,2.9,'benchTop','benchTop',null);
  emitBox(G,-1.7,DECK_Y,6.3,  1.7,DECK_Y+0.5,6.8,'benchTop','benchTop',null);
  for(const [bx,bz] of [[4.8,8],[-4.8,-2],[4.8,-12]])
    emitBox(G,bx-0.8,DECK_Y,bz-0.8, bx+0.8,DECK_Y+2.0,bz+0.8,'logSide','logTop',null);
  emitBox(G,-4.9,DECK_Y,13.2, -3.3,DECK_Y+1.6,14.8,'planks','benchTop',null);  // a crate
  /* benches along the bulwarks — seats enough for twelve and more */
  for(const s of [1,-1]){
    emitBox(G, s*5.9-0.55,DECK_Y,-14, s*5.9+0.55,DECK_Y+0.9,4,'benchSide','benchTop',null);
    emitBox(G, s*5.9-0.55,DECK_Y, 6.5, s*5.9+0.55,DECK_Y+0.9,15,'benchSide','benchTop',null);
  }
  /* ---- THE CARGO HOLD, below the waist deck: plank floor, ribs, a ladder
          at the hatch, and rows of barrels, crates and grain-sacks ---- */
  faceTop(G,'planks', -6.4,-20.5, 6.4,23.6, 0.5, 0.85);          // the hold floor
  for(const rz of [-16,-8,0,8,16]){                              // hull ribs
    emitBox(G,-6.9,0.5,rz-0.4, -6.3,6.2,rz+0.4,'logSide','logSide',null);
    emitBox(G, 6.3,0.5,rz-0.4,  6.9,6.2,rz+0.4,'logSide','logSide',null); }
  { let n=0;
    for(let z=-17; z<=21; z+=3.4){ n++;
      for(const s of [1,-1]){ const x=s*4.6, kind=(n+(s>0?0:1))%3;
        if(kind===0){ emitBox(G,x-0.95,0.5,z-0.95, x+0.95,2.9,z+0.95,'logSide','logTop',null);       /* barrel */
          if(n%2) emitBox(G,x-0.8,2.9,z-0.8, x+0.8,4.9,z+0.8,'logSide','logTop',null); }
        else if(kind===1){ emitBox(G,x-1.15,0.5,z-1.15, x+1.15,2.7,z+1.15,'planks','benchTop',null); /* crate */
          if(n%3===0) emitBox(G,x-0.9,2.7,z-0.9, x+0.9,4.4,z+0.9,'planks','benchTop',null); }
        else emitBox(G,x-1.0,0.5,z-1.0, x+1.0,1.9,z+1.0,'haySide','hayTop',null);                     /* sacks */
      } } }
  /* the ladder under the hatch */
  for(let r=0;r<7;r++){ const ry=0.9+r*0.8;
    emitBox(G,-0.9,ry,6.05, 0.9,ry+0.28,6.35,'logSide','logSide',null); }
  emitBox(G,-1.05,0.5,6.0, -0.75,6.2,6.4,'logSide','logTop',null);
  emitBox(G, 0.75,0.5,6.0,  1.05,6.2,6.4,'logSide','logTop',null);
  /* hold lanterns, ever burning */
  for(const lz of [-10,10]){ const lan=new THREE.Mesh(new THREE.BoxGeometry(0.7,0.85,0.7),torchMat);
    lan.position.set(0,5.6,lz); hullG.add(lan);
    const gm2=new THREE.SpriteMaterial({map:glowTexCv,transparent:true,opacity:0.4,depthWrite:false});
    const gs=new THREE.Sprite(gm2); gs.scale.set(11,11,1); gs.position.set(0,5,lz); hullG.add(gs); }
  for(const mat in G){ const gg=G[mat]; const bg=new THREE.BufferGeometry();
    bg.setAttribute('position',new THREE.Float32BufferAttribute(gg.p,3));
    bg.setAttribute('uv',new THREE.Float32BufferAttribute(gg.uv,2));
    bg.setAttribute('color',new THREE.Float32BufferAttribute(gg.c,3));
    bg.setIndex(gg.i); hullG.add(new THREE.Mesh(bg,MAT[mat])); }
  boatG.userData={flag,wheel};
  scene.add(boatG); }
/* walkable regions of the deck, in ship-local WORLD coordinates (scaled) */
const DECK_OBS=[[0,14,2.0],[0,-4,2.0],[0,-25.5,1.9],[4.8,8,1.4],[-4.8,-2,1.4],[4.8,-12,1.4],[-4.1,14,1.4]]
  .map(o=>[o[0]*SHIP_SX,o[1]*SHIP_S,o[2]*SHIP_S]);
function deckAllowed(lx,lz){
  if(Math.abs(lx)>5.8*SHIP_SX) return false;
  if(lz>25.2*SHIP_S||lz<-27.0*SHIP_S) return false;
  if(Math.abs(lx)<1.7*SHIP_SX&&lz>2.9*SHIP_S&&lz<6.3*SHIP_S) return false;   /* the open hatchway */
  for(const o of DECK_OBS){ if(Math.hypot(lx-o[0],lz-o[1])<o[2]) return false; }
  if(lz<SD.qdeckZ&&Math.hypot(lx,lz-SD.wheelZ)<1.6*SHIP_SX) return false;
  return true;
}
function deckHeightAt(lz){ return lz<SD.qdeckZ?SD.qdeckY:(lz>SD.fdeckZ?SD.fdeckY:SD.deckY); }
/* walkable aisle of the cargo hold (between the cargo rows) */
function holdAllowed(lx,lz){
  return Math.abs(lx)<HOLD.halfX && lz>HOLD.z0 && lz<HOLD.z1;
}
/* ================= THE CREW =================
   Six sailors keep the deck alive: a lookout at the bow shading his eyes,
   a mate by the helm, and hands who walk the waist and haul on the lines. */
const CREW=[];
function initCrew(){ if(CREW.length) return;
  const posts=[
    {lx:0,lz:21*SHIP_S,kind:'watch'},
    {lx:-2.5*SHIP_SX,lz:-19*SHIP_S,kind:'mate'},
    {lx:3.5*SHIP_SX,lz:8*SHIP_S,kind:'hand'},
    {lx:-3.5*SHIP_SX,lz:-8*SHIP_S,kind:'hand'},
    {lx:4.5*SHIP_SX,lz:-2*SHIP_S,kind:'hand'},
    {lx:-4.5*SHIP_SX,lz:14*SHIP_S,kind:'hand'}];
  for(let k=0;k<posts.length;k++){ const p=posts[k];
    const m=makePerson(9000+k*13,'sailor',false,false);
    m.position.set(p.lx,deckHeightAt(p.lz),p.lz); boatG.add(m);
    CREW.push({m,kind:p.kind,hx:p.lx,hz:p.lz,tx:p.lx,tz:p.lz,t:k*1.7}); } }
function crewTick(dt){ initCrew();
  const ph=performance.now()*0.012;
  for(const c of CREW){
    c.t-=dt;
    const u=c.m.userData;
    if(c.kind==='hand'){
      if(c.t<=0){ c.t=3+Math.random()*5;
        for(let tr=0;tr<6;tr++){ const a=Math.random()*6.28, r=Math.random()*9*SHIP_S;
          const nx=c.hx+Math.cos(a)*r, nz=c.hz+Math.sin(a)*r;
          if(deckAllowed(nx,nz)){ c.tx=nx; c.tz=nz; break; } } }
      const dx=c.tx-c.m.position.x, dz=c.tz-c.m.position.z, d=Math.hypot(dx,dz);
      let moving=false;
      if(d>0.5){ const nx=c.m.position.x+dx/d*6*dt, nz=c.m.position.z+dz/d*6*dt;
        if(deckAllowed(nx,nz)){ c.m.position.x=nx; c.m.position.z=nz;
          c.m.rotation.y=Math.atan2(dx,dz); moving=true; } else c.t=0; }
      c.m.position.y=deckHeightAt(c.m.position.z);
      for(const L of u.legs) L.rotation.x=moving?Math.sin(ph+(L.userData.ph||0))*0.55:0;
      if(!moving&&c.t<1.4){ u.armL.rotation.x=-0.8+Math.sin(ph*0.4)*0.4; u.armR.rotation.x=-0.8-Math.sin(ph*0.4)*0.4; } /* hauling a line */
    } else {
      c.m.position.y=deckHeightAt(c.m.position.z);
      c.m.rotation.y=(c.kind==='watch'?0:Math.PI)+Math.sin(performance.now()*0.0005+c.hx)*0.7;
      if(c.kind==='watch'){ u.armR.rotation.x=-1.5; }   /* a hand shading the eyes */
    }
  }
}
/* ================= PASSING TRADERS — SAILS ON THE HORIZON =================
   Lesser merchantmen ply the same seas: they appear on the horizon, hold
   their course, steer off the land, and pass by — the deep is not empty. */
const TRADERS=[];
function initTraders(){ if(TRADERS.length) return;
  for(let k=0;k<2;k++){ const g=new THREE.Group();
    const h=hullG.clone(); h.scale.set(SHIP_SX*0.62,SHIP_S*0.62,SHIP_S*0.62); g.add(h);
    g.visible=false; scene.add(g);
    TRADERS.push({g,x:0,z:0,h:0,sp:18+k*7,set:false}); } }
function traderTick(px,pz,dt){ initTraders();
  for(const T of TRADERS){
    if(!T.set||Math.hypot(T.x-px,T.z-pz)>4200){
      const a=Math.random()*6.28, r=1400+Math.random()*1800;
      const x=px+Math.cos(a)*r, z=pz+Math.sin(a)*r;
      if(landAtWorld(x,z)||Math.hypot(x,z)/R_WORLD>0.93){ T.g.visible=false; T.set=false; continue; }
      T.x=x; T.z=z; T.h=Math.random()*6.28; T.set=true; T.g.visible=true; }
    if(T.halt&&T.halt>0){ T.halt-=dt; }                                   /* hove to for the trading */
    else {
      const ax=T.x+Math.sin(T.h)*140, az=T.z+Math.cos(T.h)*140;
      if(landAtWorld(ax,az)||Math.hypot(ax,az)/R_WORLD>0.93) T.h+=dt*0.8; /* bear away from the shoals */
      T.x+=Math.sin(T.h)*T.sp*dt; T.z+=Math.cos(T.h)*T.sp*dt;
    }
    const hd=seaHeight(T.x,T.z);
    T.g.position.set(T.x,WATER_Y-1.4+hd*0.6,T.z);
    T.g.rotation.y=T.h; T.g.rotation.z=Math.sin(performance.now()*0.0009+T.x*0.01)*0.04;
  } }
function hideTraders(){ for(const T of TRADERS){ T.g.visible=false; T.set=false; } }

/* ================= THE TRAVELLER (steve-fashion) ================= */
function lam(col){ return new THREE.MeshLambertMaterial({color:col}); }
function lbox(w,h,d,col){ return new THREE.Mesh(new THREE.BoxGeometry(w,h,d),lam(col)); }
/* Steve-fashion: dark brown hair in a clean, straight fringe (no ragged edge),
   sideburns down the temples, a bowl of hair on top and round the back. */
const SKIN_RGB=[199,140,95], HAIR_RGB=[46,32,18], ROBE_A=[56,66,116], ROBE_D=[46,56,100];
const faceTexP=mkTex(g=>{ g.fillStyle=rgb(...SKIN_RGB); g.fillRect(0,0,16,16);
  for(let y=0;y<4;y++) for(let x=0;x<16;x++){                 /* the straight fringe */
    const c=jit(HAIR_RGB,16,x+y*16); P(g,x,y,rgb(c[0],c[1],c[2])); }
  for(let y=4;y<8;y++) for(const x of [0,1,14,15]){           /* sideburns */
    const c=jit(HAIR_RGB,16,x*7+y); P(g,x,y,rgb(c[0],c[1],c[2])); }
  g.fillStyle='rgb(255,255,255)'; g.fillRect(3,8,2,2); g.fillRect(11,8,2,2);  /* eyes */
  g.fillStyle='rgb(84,60,150)';  g.fillRect(5,8,2,2); g.fillRect(9,8,2,2);    /* violet-blue, steve-fashion */
  g.fillStyle='rgb(160,105,70)'; g.fillRect(7,10,2,2);                         /* the nose */
  g.fillStyle='rgb(106,66,40)'; g.fillRect(6,13,4,1); g.fillRect(5,12,1,1); g.fillRect(10,12,1,1); /* the mouth */ });
const hairTopTex=mkTex(g=>speckle(g,HAIR_RGB,14,[38,26,14],0.35));
const hairSideTex=mkTex(g=>{ g.fillStyle=rgb(...SKIN_RGB); g.fillRect(0,0,16,16);
  for(let y=0;y<7;y++) for(let x=0;x<16;x++){                 /* a straight bowl edge */
    const c=jit(HAIR_RGB,14,x*17+y); P(g,x,y,rgb(c[0],c[1],c[2])); } });
const hairBackTex=mkTex(g=>{ g.fillStyle=rgb(...SKIN_RGB); g.fillRect(0,0,16,16);
  for(let y=0;y<8;y++) for(let x=0;x<16;x++){
    const c=jit(HAIR_RGB,14,x*13+y*3); P(g,x,y,rgb(c[0],c[1],c[2])); } });
/* the ancient robe: indigo cloth, folds, gold trim; front carries the neckline */
const robeSideTexP=mkTex(g=>{ speckle(g,ROBE_A,16,ROBE_D,0.3);
  g.fillStyle='rgba(0,0,0,0.25)'; for(const x of [2,7,12]) g.fillRect(x,3,1,13);
  g.fillStyle='rgb(190,158,84)'; g.fillRect(0,9,16,2);
  g.fillStyle='rgb(150,120,58)'; g.fillRect(7,9,2,2);
  g.fillStyle='rgba(0,0,0,0.3)'; g.fillRect(0,15,16,1); });
const robeFrontTexP=mkTex(g=>{ speckle(g,ROBE_A,16,ROBE_D,0.3);
  g.fillStyle='rgba(0,0,0,0.25)'; for(const x of [3,12]) g.fillRect(x,3,1,13);
  g.fillStyle=rgb(...SKIN_RGB); g.fillRect(6,0,4,1); g.fillRect(7,1,2,1);     /* neckline */
  g.fillStyle='rgb(190,158,84)'; g.fillRect(5,0,1,2); g.fillRect(10,0,1,2);   /* collar trim */
  g.fillStyle='rgb(190,158,84)'; g.fillRect(0,9,16,2);
  g.fillStyle='rgb(150,120,58)'; g.fillRect(7,9,2,2);                          /* the clasp */
  g.fillStyle='rgba(0,0,0,0.3)'; g.fillRect(0,15,16,1); });
const sleeveTexP=mkTex(g=>{ speckle(g,ROBE_A,16,ROBE_D,0.3);
  g.fillStyle='rgba(0,0,0,0.22)'; g.fillRect(0,4,16,1);
  g.fillStyle='rgb(190,158,84)'; g.fillRect(0,11,16,1);                        /* cuff trim */
  g.fillStyle=rgb(...SKIN_RGB); g.fillRect(0,12,16,4); });                     /* the hand */
const legTexP=mkTex(g=>{ speckle(g,[46,52,86],14,[38,44,74],0.3);
  g.fillStyle='rgba(0,0,0,0.25)'; g.fillRect(0,7,16,1);
  g.fillStyle='rgb(90,62,38)'; g.fillRect(0,13,16,1);                          /* sandals */
  g.fillStyle='rgb(122,86,52)'; g.fillRect(0,14,16,2); });
const robeMatP=new THREE.MeshLambertMaterial({map:robeSideTexP});
const robeFrontMatP=new THREE.MeshLambertMaterial({map:robeFrontTexP});
const sleeveMatP=new THREE.MeshLambertMaterial({map:sleeveTexP});
const legMatP=new THREE.MeshLambertMaterial({map:legTexP});
const walkerG=new THREE.Group();
{ const hs=new THREE.MeshLambertMaterial({map:hairSideTex});
  const headMats=[hs,hs,
    new THREE.MeshLambertMaterial({map:hairTopTex}),lam(0xc78c5f),
    new THREE.MeshLambertMaterial({map:faceTexP}),
    new THREE.MeshLambertMaterial({map:hairBackTex})];
  const head=new THREE.Mesh(new THREE.BoxGeometry(3,3,3),headMats); head.position.y=10.4; walkerG.add(head);
  /* minecraft proportions: body 8×12×4, limbs 4×12×4, at 0.35 scale */
  const body=new THREE.Mesh(new THREE.BoxGeometry(3,4.6,1.7),
    [robeMatP,robeMatP,robeMatP,robeMatP,robeFrontMatP,robeMatP]);
  body.position.y=6.6; walkerG.add(body);
  const hem=new THREE.Mesh(new THREE.BoxGeometry(3.3,1.0,2.0),robeMatP); hem.position.y=4.1; walkerG.add(hem);
  const legL=new THREE.Mesh(new THREE.BoxGeometry(1.4,4.2,1.5),legMatP);
  legL.geometry.translate(0,-2.1,0);
  legL.position.set(0.74,4.3,0); walkerG.add(legL);
  const legR=legL.clone(); legR.position.x=-0.74; walkerG.add(legR);
  const armL=new THREE.Mesh(new THREE.BoxGeometry(1.4,4.4,1.5),sleeveMatP);
  armL.geometry.translate(0,-2.2,0);
  armL.position.set(2.25,8.7,0); walkerG.add(armL);
  const armR=armL.clone(); armR.position.x=-2.25; walkerG.add(armR);
  walkerG.visible=false; scene.add(walkerG);
  walkerG.userData={legL,legR,armL,armR}; }

/* ================= VILLAGERS & BEASTS (mob-fashion) ================= */
function villagerFaceTex(seed){
  return mkTex(g=>{ const sk=[[199,148,103],[176,124,84],[150,102,66],[124,84,54]][Math.floor(hash2(seed,1)*4)];
    g.fillStyle=rgb(sk[0],sk[1],sk[2]); g.fillRect(0,0,16,16);
    g.fillStyle='rgb(60,44,30)'; g.fillRect(2,4,12,2);            // the brow
    g.fillStyle='rgb(255,255,255)'; g.fillRect(3,7,3,2); g.fillRect(10,7,3,2);
    g.fillStyle='rgb(46,84,46)'; g.fillRect(4,7,2,2); g.fillRect(11,7,2,2);
    g.fillStyle=rgb(Math.max(0,sk[0]-30),Math.max(0,sk[1]-30),Math.max(0,sk[2]-30));
    g.fillRect(7,8,2,6);
    g.fillStyle=rgb(Math.max(0,sk[0]-60),Math.max(0,sk[1]-60),Math.max(0,sk[2]-60));
    g.fillRect(6,14,4,1); });
}
const ROBES=[0x8a5a3a,0x5f7a8a,0x7a6a3f,0x6a4a7a,0x9a5a3a,0x4f6a4f,0x8a8060];
/* pixel-textured robes — folds, a girdle, a dark hem — one texture per colour */
const ROBETEX={};
function robeMatFor(idx){
  let m=ROBETEX[idx]; if(m) return m;
  const col=ROBES[idx], r=col>>16&255, g2=col>>8&255, b2=col&255;
  const t=mkTex(g=>{
    speckle(g,[r,g2,b2],18,[Math.max(0,r-22),Math.max(0,g2-22),Math.max(0,b2-22)],0.3);
    g.fillStyle='rgba(0,0,0,0.22)'; for(const x of [3,8,13]) g.fillRect(x,4,1,12);
    g.fillStyle='rgb(58,44,28)'; g.fillRect(0,10,16,2);
    g.fillStyle='rgba(0,0,0,0.3)'; g.fillRect(0,15,16,1); });
  m=new THREE.MeshLambertMaterial({map:t}); ROBETEX[idx]=m; return m;
}
/* ================= THE PEOPLE OF THE LANDS =================
   Real folk, built like the traveller — hair, an ancient robe, striding
   legs — no more big-nosed villager mobs. Skin, hair and robe vary by seed;
   a role gives each a tool and a task (herding, hunting, teaching, tilling). */
const P_SKIN=[0xc79467,0xb07c54,0x966642,0x7c5436,0xd8a878,0x8a5a36];
const P_HAIR=[[74,50,30],[40,28,20],[96,74,44],[150,130,96],[28,28,32],[110,86,54]];
function hairHex(h){ return (h[0]<<16)|(h[1]<<8)|h[2]; }
const personHead={};
function personFaceTex(skHex,HR){
  const r=(skHex>>16)&255,g2=(skHex>>8)&255,b2=skHex&255;
  return mkTex(g=>{ g.fillStyle=rgb(r,g2,b2); g.fillRect(0,0,16,16);
    for(let y=0;y<6;y++)for(let x=0;x<16;x++){ if(y<4||hash2(x*3.1,y*7.7)>0.5){
      const c=jit(HR,22,x+y*16); P(g,x,y,rgb(c[0],c[1],c[2])); } }
    g.fillStyle='rgb(58,42,28)'; g.fillRect(2,6,5,1); g.fillRect(9,6,5,1);      // brows
    g.fillStyle='rgb(255,255,255)'; g.fillRect(3,8,3,2); g.fillRect(10,8,3,2);  // eyes
    g.fillStyle='rgb(62,86,120)'; g.fillRect(4,8,2,2); g.fillRect(11,8,2,2);
    g.fillStyle=rgb(Math.max(0,r-40),Math.max(0,g2-34),Math.max(0,b2-30)); g.fillRect(7,10,2,2);
    g.fillStyle='rgb(120,72,48)'; g.fillRect(6,13,4,1); }); }
function personHeadMats(si,hi){
  const key=si+','+hi; if(personHead[key]) return personHead[key];
  const sk=P_SKIN[si], hairM=lam(hairHex(P_HAIR[hi]));
  const faceM=new THREE.MeshLambertMaterial({map:personFaceTex(sk,P_HAIR[hi])});
  const mats=[hairM,hairM,hairM,lam(sk),faceM,hairM];   // [px,nx,top,bottom,front,back]
  personHead[key]=mats; return mats;
}
function makePerson(seed, role, child, female){
  const g=new THREE.Group();
  const si=Math.floor(hash2(seed,1.1)*P_SKIN.length);
  const hi=Math.floor(hash2(seed,2.3)*P_HAIR.length);
  const robeM=robeMatFor(Math.floor(hash2(seed,3.7)*ROBES.length));
  const head=new THREE.Mesh(new THREE.BoxGeometry(3,3,3),personHeadMats(si,hi));
  head.position.y=10.4; g.add(head);
  if(female){ /* long hair falling to the shoulders behind and beside */
    const hm=lam(hairHex(P_HAIR[hi]));
    const back=new THREE.Mesh(new THREE.BoxGeometry(3.2,3.6,0.6),hm); back.position.set(0,9.0,-1.6); g.add(back);
    for(const s of [1,-1]){ const fall=new THREE.Mesh(new THREE.BoxGeometry(0.6,2.6,2.6),hm);
      fall.position.set(s*1.75,9.4,-0.3); g.add(fall); } }
  const body=new THREE.Mesh(new THREE.BoxGeometry(3,4.6,1.7),robeM); body.position.y=6.6; g.add(body);
  /* women wear the robe to the ankle; men show sandalled shins */
  const hem=female?new THREE.Mesh(new THREE.BoxGeometry(3.3,3.6,2.1),robeM):lbox(3.2,1.0,2.0,0x3a2c1c);
  hem.position.y=female?2.8:4.1; g.add(hem);
  const legMat=lam(0x2e3350);
  const legL=new THREE.Mesh(new THREE.BoxGeometry(1.35,4.2,1.5),legMat);
  legL.geometry.translate(0,-2.1,0); legL.position.set(0.74,4.3,0); legL.userData.ph=0; g.add(legL);
  const legR=legL.clone(); legR.position.x=-0.74; legR.userData.ph=Math.PI; g.add(legR);
  const armL=new THREE.Mesh(new THREE.BoxGeometry(1.2,4.4,1.5),robeM);
  armL.geometry.translate(0,-2.2,0); armL.position.set(2.15,8.7,0); armL.userData.ph=Math.PI; g.add(armL);
  const armR=armL.clone(); armR.position.x=-2.15; armR.userData.ph=0; g.add(armR);
  if(role==='hunter'){ const spear=lbox(0.34,8,0.34,0x6a4a2a); spear.position.set(2.7,8.4,0.6);
      spear.rotation.x=0.25; g.add(spear);
    const tip=lbox(0.55,0.9,0.2,0xb8bcc4); tip.position.set(2.7,12.4,1.6); g.add(tip); }
  else if(role==='herder'){ const staff=lbox(0.3,8.5,0.3,0x7a5a30); staff.position.set(2.6,8.6,0);
      staff.rotation.z=0.12; g.add(staff); }
  else if(role==='teacher'){ const scroll=lbox(1.3,0.6,0.6,0xe8dfc8); scroll.position.set(2.4,7,1.2); g.add(scroll); }
  else if(role==='farmer'){ const hoe=lbox(0.3,7.5,0.3,0x7a5a30); hoe.position.set(2.6,8.0,0.4);
      hoe.rotation.x=0.2; g.add(hoe);
    const blade=lbox(1.1,0.4,0.9,0x9aa0a8); blade.position.set(2.6,11.5,1.2); g.add(blade); }
  let rod=null;
  if(role==='fisher'){ rod=lbox(0.26,9.5,0.26,0x8a6a3a); rod.position.set(2.5,9.5,2.6);
      rod.rotation.x=1.05; g.add(rod);
    const line=lbox(0.09,4.6,0.09,0x20242c); line.position.set(2.5,7.4,6.6); g.add(line);
    const bob=lbox(0.5,0.5,0.5,0xd0472e); bob.position.set(2.5,5.0,6.6); g.add(bob); }
  else if(role==='feeder'){ const basket=lbox(1.6,1.1,1.1,0xb08a48); basket.position.set(2.3,6.4,0.9); g.add(basket); }
  else if(role==='water'){ const jar=lbox(1.4,1.8,1.4,0x9a6242); jar.position.set(0,12.9,0); g.add(jar);
    const rim=lbox(1.0,0.4,1.0,0x7a4a32); rim.position.set(0,13.9,0); g.add(rim); }
  if(child) g.scale.set(0.62,0.62,0.62);
  g.userData={legs:[legL,legR,armL,armR],armL,armR,rod,female:!!female};
  return g;
}
function makeAnimal(kind){
  const g=new THREE.Group(); const legs=[];
  function fourLegs(w,d,lh,col){ for(const sx of [1,-1]) for(const sz of [1,-1]){
    const L=lbox(0.9,lh,0.9,col); L.geometry.translate(0,-lh/2,0);   // pivot at the hip
    L.position.set(sx*w,lh,sz*d);
    L.userData.ph=(sx*sz>0)?0:Math.PI; g.add(L); legs.push(L); } }
  if(kind==='sheep'){
    const body=new THREE.Mesh(new THREE.BoxGeometry(3.4,2.6,4.6),
      new THREE.MeshLambertMaterial({map:TEX.wool})); body.position.y=3.4; g.add(body);
    const head=lbox(1.6,1.7,1.6,0xead9c8); head.position.set(0,4.3,2.9); g.add(head);
    fourLegs(1.1,1.5,2.1,0xd9d0c0);
  } else if(kind==='cow'){
    const cowTex=mkTex(gg=>{ speckle(gg,[92,64,44],14);
      gg.fillStyle='rgb(235,232,225)';
      gg.fillRect(1,2,5,5); gg.fillRect(9,8,6,6); gg.fillRect(10,1,4,3); });
    const body=new THREE.Mesh(new THREE.BoxGeometry(3.6,2.8,5.4),
      new THREE.MeshLambertMaterial({map:cowTex})); body.position.y=3.8; g.add(body);
    const head=lbox(1.9,1.9,1.6,0x6b4a34); head.position.set(0,4.7,3.3); g.add(head);
    const muz=lbox(1.4,0.9,0.5,0xd9cfc2); muz.position.set(0,4.3,4.2); g.add(muz);
    for(const s of [1,-1]){ const h2=lbox(0.4,0.4,0.7,0xe8e2d2); h2.position.set(s*1.05,5.5,3.2); g.add(h2); }
    fourLegs(1.2,1.9,2.3,0x5a4030);
  } else if(kind==='pig'){
    const body=lbox(3.2,2.4,4.6,0xefa2a2); body.position.y=2.9; g.add(body);
    const head=lbox(2,2,1.4,0xefa2a2); head.position.set(0,3.3,2.9); g.add(head);
    const snout=lbox(1.1,0.8,0.4,0xe58a8a); snout.position.set(0,3.1,3.7); g.add(snout);
    fourLegs(1.05,1.6,1.6,0xdf9494);
  } else if(kind==='chicken'){
    const body=lbox(1.7,1.7,2.3,0xeeeeea); body.position.y=1.9; g.add(body);
    const head=lbox(1,1.4,1,0xf2f2ee); head.position.set(0,3.3,1.1); g.add(head);
    const beak=lbox(0.7,0.4,0.5,0xdf9c2a); beak.position.set(0,3.2,1.75); g.add(beak);
    const wat=lbox(0.4,0.5,0.3,0xc23a2a); wat.position.set(0,2.7,1.6); g.add(wat);
    for(const s of [1,-1]){ const w2=lbox(0.3,1.2,1.9,0xdcdcd6); w2.position.set(s*1,2.1,0.1); g.add(w2); }
    fourLegs(0.45,0.4,0.8,0xdf9c2a);
  } else if(kind==='hare'){       /* a creeping thing of the field */
    const body=lbox(1.1,1.1,1.8,0xb8a184); body.position.y=1.2; g.add(body);
    const head=lbox(0.9,0.9,0.9,0xc8b494); head.position.set(0,1.7,1.1); g.add(head);
    for(const s of [1,-1]){ const ear=lbox(0.3,1.3,0.3,0xc8b494); ear.position.set(s*0.3,2.7,0.9); g.add(ear); }
    const tail=lbox(0.5,0.5,0.4,0xefe8dc); tail.position.set(0,1.3,-1); g.add(tail);
    fourLegs(0.4,0.6,0.7,0xa08868);
  } else if(kind==='lizard'){     /* a creeping thing of the rocks */
    const body=lbox(0.7,0.5,2.2,0x6f7a44); body.position.y=0.6; g.add(body);
    const head=lbox(0.8,0.6,0.9,0x7a854c); head.position.set(0,0.7,1.4); g.add(head);
    const tail=lbox(0.4,0.35,1.8,0x636c3c); tail.position.set(0,0.55,-1.9); g.add(tail);
    fourLegs(0.55,0.7,0.5,0x5c6438);
  } else if(kind==='goat'){
    const body=lbox(2.4,2.2,3.6,0xcfc4b0); body.position.y=3.0; g.add(body);
    const head=lbox(1.3,1.4,1.4,0xdad0be); head.position.set(0,3.9,2.3); g.add(head);
    for(const s of [1,-1]){ const horn=lbox(0.3,0.9,0.3,0x6a5c44); horn.position.set(s*0.4,4.9,2.1);
      horn.rotation.x=-0.5; g.add(horn); }
    fourLegs(0.9,1.3,2.0,0xb7ac98);
  } else if(kind==='camel'){
    const body=lbox(2.8,3,5.6,0xc8a06a); body.position.y=4.8; g.add(body);
    const hump=lbox(1.9,1.4,2,0xb8905a); hump.position.set(0,6.9,0.4); g.add(hump);
    const neck=lbox(1.2,2.8,1.2,0xc8a06a); neck.position.set(0,6.6,2.6); g.add(neck);
    const head=lbox(1.4,1.2,2,0xb8905a); head.position.set(0,8.2,3.2); g.add(head);
    fourLegs(1,2.1,3.3,0xb08a56);
  } else if(kind==='horse'){
    const col=0x6a4a2e; const body=lbox(2.2,2.6,5.4,col); body.position.y=4.2; g.add(body);
    const neck=lbox(1.3,2.6,1.3,col); neck.position.set(0,5.6,2.4); neck.rotation.x=-0.5; g.add(neck);
    const head=lbox(1.2,1.5,2.4,col); head.position.set(0,6.6,3.4); g.add(head);
    const mane=lbox(0.4,2.4,1.3,0x2e2018); mane.position.set(0,6.0,2.0); mane.rotation.x=-0.5; g.add(mane);
    const tail=lbox(0.5,2.4,0.5,0x2e2018); tail.position.set(0,4.4,-2.9); tail.rotation.x=0.5; g.add(tail);
    fourLegs(0.9,2.0,3.2,0x4a3320);
  } else if(kind==='donkey'){
    const col=0x9a938a; const body=lbox(1.8,2.2,4.4,col); body.position.y=3.6; g.add(body);
    const neck=lbox(1.1,2.2,1.1,col); neck.position.set(0,4.8,2.0); neck.rotation.x=-0.5; g.add(neck);
    const head=lbox(1.0,1.3,2.0,col); head.position.set(0,5.6,3.0); g.add(head);
    for(const s of[1,-1]){ const ear=lbox(0.35,1.4,0.35,col); ear.position.set(s*0.4,6.6,2.6); g.add(ear); }
    const tail=lbox(0.4,1.8,0.4,0x5a534a); tail.position.set(0,3.8,-2.4); tail.rotation.x=0.4; g.add(tail);
    fourLegs(0.75,1.6,2.6,0x7a736a);
  } else if(kind==='ox'){
    const body=lbox(3.4,3.0,6.0,0x5a4436); body.position.y=4.2; g.add(body);
    const head=lbox(2.0,2.0,1.8,0x4a3628); head.position.set(0,4.9,3.6); g.add(head);
    for(const s of[1,-1]){ const horn=lbox(0.35,0.35,1.4,0xe8e0d0); horn.position.set(s*1.2,5.6,3.6); horn.rotation.z=s*0.5; g.add(horn); }
    fourLegs(1.3,2.1,2.7,0x4a3628);
  } else if(kind==='wolf'){
    const col=0x8a8f96; const body=lbox(1.6,1.6,3.6,col); body.position.y=2.2; g.add(body);
    const head=lbox(1.3,1.3,1.4,col); head.position.set(0,2.6,2.2); g.add(head);
    const snout=lbox(0.7,0.6,0.8,0x6a6f76); snout.position.set(0,2.4,3.0); g.add(snout);
    for(const s of[1,-1]){ const ear=lbox(0.4,0.7,0.3,col); ear.position.set(s*0.5,3.4,2.1); g.add(ear); }
    const tail=lbox(0.6,0.6,1.8,col); tail.position.set(0,2.6,-2.2); tail.rotation.x=0.4; g.add(tail);
    fourLegs(0.6,1.2,2.0,0x70767c);
  } else if(kind==='dog'){
    const col=0xb98a52; const body=lbox(1.2,1.2,2.8,col); body.position.y=1.9; g.add(body);
    const head=lbox(1.1,1.1,1.2,col); head.position.set(0,2.3,1.7); g.add(head);
    const snout=lbox(0.6,0.5,0.7,0x8a6238); snout.position.set(0,2.1,2.4); g.add(snout);
    for(const s of[1,-1]){ const ear=lbox(0.4,0.6,0.3,0x8a6238); ear.position.set(s*0.5,3.0,1.6); g.add(ear); }
    const tail=lbox(0.4,0.4,1.4,col); tail.position.set(0,2.4,-1.8); tail.rotation.x=0.5; g.add(tail);
    fourLegs(0.45,0.9,1.6,0x9a723e);
  } else if(kind==='lion'){
    const col=0xcaa25a; const body=lbox(2.0,2.0,4.4,col); body.position.y=2.8; g.add(body);
    const mane=lbox(2.4,2.4,1.2,0x8a5a2a); mane.position.set(0,3.4,2.2); g.add(mane);
    const head=lbox(1.6,1.6,1.6,col); head.position.set(0,3.4,2.9); g.add(head);
    const snout=lbox(0.9,0.7,0.7,0xd8b878); snout.position.set(0,3.1,3.7); g.add(snout);
    const tail=lbox(0.4,0.4,2.2,col); tail.position.set(0,3.0,-2.6); tail.rotation.x=0.3; g.add(tail);
    const tuft=lbox(0.6,0.6,0.6,0x8a5a2a); tuft.position.set(0,2.4,-3.6); g.add(tuft);
    fourLegs(0.75,1.5,2.4,0xb08a48);
  } else if(kind==='deer'){
    const col=0x9a6a3a; const body=lbox(1.7,2.0,4.2,col); body.position.y=3.4; g.add(body);
    const neck=lbox(1.0,2.2,1.0,col); neck.position.set(0,4.8,2.0); neck.rotation.x=-0.6; g.add(neck);
    const head=lbox(1.0,1.1,1.8,col); head.position.set(0,5.8,2.9); g.add(head);
    for(const s of[1,-1]){ const ant=lbox(0.25,1.6,0.25,0x6a4a2a); ant.position.set(s*0.5,6.8,2.7); ant.rotation.z=s*0.4; g.add(ant); }
    const tail=lbox(0.5,0.7,0.4,0xefe0d0); tail.position.set(0,3.6,-2.2); g.add(tail);
    fourLegs(0.6,1.5,2.8,0x7a5230);
  } else if(kind==='elephant'){
    const col=0x8f8f96; const body=lbox(4.4,4.2,7.2,col); body.position.y=6.0; g.add(body);
    const head=lbox(3.0,3.0,2.6,col); head.position.set(0,6.6,4.2); g.add(head);
    const trunk=lbox(1.0,3.4,1.0,col); trunk.position.set(0,4.6,5.4); trunk.rotation.x=0.4; g.add(trunk);
    for(const s of[1,-1]){ const ear=lbox(0.4,2.8,2.4,0x82828a); ear.position.set(s*2.0,6.8,3.6); g.add(ear);
      const tusk=lbox(0.4,0.4,2.0,0xefe8d8); tusk.position.set(s*0.9,5.2,5.4); g.add(tusk); }
    fourLegs(1.6,2.6,4.4,0x76767e);
  } else { /* ostrich — two long legs, a tall neck */
    const body=lbox(2.2,2.6,3.4,0x3a3230); body.position.y=6.0; g.add(body);
    const neck=lbox(0.8,4.4,0.8,0xd8b89a); neck.position.set(0,8.4,1.2); neck.rotation.x=-0.2; g.add(neck);
    const head=lbox(0.9,0.9,1.4,0xd8b89a); head.position.set(0,10.6,1.8); g.add(head);
    const beak=lbox(0.5,0.5,0.7,0xd8a030); beak.position.set(0,10.5,2.7); g.add(beak);
    for(const s of[1,-1]){ const L=lbox(0.5,6,0.5,0xc8b0a0); L.geometry.translate(0,-3,0); L.position.set(s*0.7,6,0); L.userData.ph=(s>0)?0:Math.PI; g.add(L); legs.push(L); }
  }
  g.userData={legs};
  return g;
}
/* a bird — a small body with two flapping wings, for the flocks aloft.
   type: crow · gull · dove · eagle · butterfly (variants in colour and size) */
function makeBird(type){ type=type||'crow';
  const S={crow:{b:0x2e3038,w:0x24262c,s:1},gull:{b:0xeef2f6,w:0xc6ccd4,s:1.1},
    dove:{b:0xf2f0ea,w:0xdad6ce,s:0.9},eagle:{b:0x5a4326,w:0x36290f,s:1.8},
    butterfly:{b:0x201820,w:0xff6ea8,s:0.5}}[type]||{b:0x2e3038,w:0x24262c,s:1};
  const g=new THREE.Group();
  const body=lbox(0.8*S.s,0.8*S.s,1.8*S.s,S.b); body.position.y=0; g.add(body);
  const head=lbox(0.7*S.s,0.7*S.s,0.7*S.s,S.b); head.position.set(0,0.2*S.s,1.1*S.s); g.add(head);
  const wingL=lbox(2.4*S.s,0.16,1.1*S.s,S.w); wingL.geometry.translate(-1.2*S.s,0,0); wingL.position.set(0.4*S.s,0.2*S.s,0); g.add(wingL);
  const wingR=lbox(2.4*S.s,0.16,1.1*S.s,S.w); wingR.geometry.translate(1.2*S.s,0,0); wingR.position.set(-0.4*S.s,0.2*S.s,0); g.add(wingR);
  if(type==='eagle'){ const beak=lbox(0.5,0.4,0.6,0xe0b040); beak.position.set(0,0.1,1.9*S.s); g.add(beak);
    const tail=lbox(1.0,0.16,1.2,0xffffff); tail.position.set(0,0,-1.4*S.s); g.add(tail); }
  if(type==='butterfly'){ const w2=lbox(1.4,0.1,1.0,0xffd23a); w2.geometry.translate(-0.7,0,0); w2.position.set(0.2,0,-0.5); g.add(w2);
    const w3=w2.clone(); w3.geometry=w2.geometry.clone(); w3.scale.x=-1; w3.position.set(-0.2,0,-0.5); g.add(w3); }
  g.userData={wingL,wingR,type};
  return g;
}
/* a fish — a body and tail that arcs from the sea (col: tropical variants) */
function makeFish(col){ const c=new THREE.Color(col||0x5f7fa6);
  const g=new THREE.Group();
  const body=new THREE.Mesh(new THREE.BoxGeometry(1.0,1.5,3.2),lam(c.getHex())); body.position.y=0; g.add(body);
  const tail=new THREE.Mesh(new THREE.BoxGeometry(0.4,1.8,1.0),lam(c.clone().multiplyScalar(0.75).getHex())); tail.position.set(0,0,-2.0); g.add(tail);
  const fin=new THREE.Mesh(new THREE.BoxGeometry(0.3,1.2,0.9),lam(c.clone().multiplyScalar(1.3).getHex())); fin.position.set(0,1.1,0.2); g.add(fin);
  return g;
}
/* ================= SEA CREATURES =================
   Fish that break the surface and arc back — near the traveller wherever the
   sea is open. A small reused pool; each leap traces a parabola with a spin. */
const SEAFISH=[]; let seaLifeInit=false, nextLeap=0;
function seaLifeTick(px,pz,dt){
  if(!seaLifeInit){ seaLifeInit=true;
    for(let k=0;k<6;k++){ const f=makeFish(); f.visible=false; scene.add(f);
      SEAFISH.push({m:f,active:false,t:0,dur:1,x:0,z:0,dx:0,dz:0,peak:0}); } }
  nextLeap-=dt;
  const overWater=state.mode!=='walk' || !landAtWorld(px,pz);
  if(nextLeap<=0 && overWater){
    nextLeap=0.7+Math.random()*2.2;
    const fish=SEAFISH.find(f=>!f.active);
    if(fish){ const a=Math.random()*Math.PI*2, r=40+Math.random()*160;
      const x=px+Math.cos(a)*r, z=pz+Math.sin(a)*r;
      if(!landAtWorld(x,z)&&Math.hypot(x,z)/R_WORLD<0.98){
        const dir=Math.random()*Math.PI*2, len=6+Math.random()*10;
        fish.active=true; fish.t=0; fish.dur=1.0+Math.random()*0.7;
        fish.x=x; fish.z=z; fish.dx=Math.cos(dir)*len; fish.dz=Math.sin(dir)*len;
        fish.peak=7+Math.random()*7; fish.m.visible=true; } }
  }
  for(const f of SEAFISH){ if(!f.active) continue;
    f.t+=dt; const u=f.t/f.dur;
    if(u>=1){ f.active=false; f.m.visible=false; continue; }
    const x=f.x+f.dx*u, z=f.z+f.dz*u;
    const y=WATER_Y+seaHeight(x,z)+f.peak*Math.sin(Math.PI*u)-1.5;
    f.m.position.set(x,y,z);
    f.m.rotation.y=Math.atan2(f.dx,f.dz);
    f.m.rotation.x=(u-0.5)*2.6;               /* nose up, then dives */
  }
}

/* ---- underwater block textures, minecraft-fashion pixel art ---- */
TEX.seasand=TEX.sand.clone(); TEX.seasand.needsUpdate=true; TEX.seasand.wrapS=TEX.seasand.wrapT=THREE.RepeatWrapping;
TEX.seasand.generateMipmaps=true; TEX.seasand.minFilter=THREE.NearestMipmapLinearFilter; TEX.seasand.anisotropy=4;
TEX.kelp    =mkTex(g=>{ for(let y=0;y<16;y++)for(let x=0;x<16;x++){ const base=(x%5<2)?[40,118,64]:[58,164,90]; const c=jit(base,26,x*7+y*3); P(g,x,y,rgb(c[0],c[1],c[2])); } });
TEX.seagrass=mkTex(g=>{ for(let y=0;y<16;y++)for(let x=0;x<16;x++){ const base=(x%4<2)?[70,168,86]:[96,198,112]; const c=jit(base,24,x*5+y*2); P(g,x,y,rgb(c[0],c[1],c[2])); } });
TEX.coral   =mkTex(g=>{ for(let y=0;y<16;y++)for(let x=0;x<16;x++){ const n=hash2(x*2.1+y*3.3,y*1.7+x*0.7); const v=n>0.72?150:n>0.42?208:246; const c=jit([v,v,v],18,x+y*4); P(g,x,y,rgb(c[0],c[1],c[2])); } });
TEX.sponge  =mkTex(g=>speckle(g,[224,176,64],28,[190,142,48],0.4));

/* ================= THE DEEP — DIVE & DISCOVER THE SEA =================
   Below the waves lies a world of its own: a bumpy seabed that plunges into
   trenches in the open ocean, forests of kelp and coral, schools of fish and
   squid, rising bubbles, and wrecks of the ancients grown over with the sea.
   From open water the traveller dives (C), swims in three dimensions
   (W/S · A/D · SPACE up · SHIFT down), and comes up again to draw breath. */
const DIVE_TURN=1.7, DIVE_MAXSP=155, DIVE_VMAX=125, DIVE_VACC=320, SEA_SURF=WATER_Y;
let diveHintShown=false, deepShown=false;
function seabedDepth(x,z){
  const roll=fbm(x*0.02+11,z*0.02-7), basin=fbm(x*0.004-5,z*0.004+9);
  const trench=Math.pow(Math.max(0,fbm(x*0.0016+30,z*0.0016)-0.55)/0.45,1.6);
  const ridge=Math.pow(Math.max(0,fbm(x*0.003+70,z*0.003-40)-0.47)/0.53,1.7);   /* undersea mountains */
  const peak=ridge*(360+fbm(x*0.011-3,z*0.011+6)*120);                          /* tall ridges, some breaking the surface */
  return SEA_SURF-(20+roll*30+basin*120+trench*540-peak); }   /* +peaks above the waves … −700 trenches */
/* ---- the seabed: a displaced, shaded floor that follows the diver ---- */
const SB_SEG=96, SB_SIZE=3200;
const sbGeo=new THREE.PlaneGeometry(SB_SIZE,SB_SIZE,SB_SEG,SB_SEG); sbGeo.rotateX(-Math.PI/2);
sbGeo.setAttribute('color',new THREE.BufferAttribute(new Float32Array(sbGeo.attributes.position.count*3),3));
TEX.seasand.repeat.set(SB_SIZE/6,SB_SIZE/6);
const seaFloor=new THREE.Mesh(sbGeo,new THREE.MeshLambertMaterial({map:TEX.seasand,vertexColors:true,side:THREE.DoubleSide}));
seaFloor.visible=false; seaFloor.frustumCulled=false; scene.add(seaFloor);
function updateSeaFloor(px,pz){ const pos=sbGeo.attributes.position, a=pos.array, col=sbGeo.attributes.color.array;
  for(let i=0;i<a.length;i+=3){ const wx=a[i]+px, wz=a[i+2]+pz, y=seabedDepth(wx,wz); a[i+1]=y;
    const depth=SEA_SURF-y, lit=Math.max(0,1-depth/460), alg=fbm(wx*0.03+3,wz*0.03+7);
    let r=0.74+0.26*lit, g=0.76+0.24*lit, b=0.64+0.28*lit;   /* tint the sand: darker deep, green where algae */
    if(alg>0.62){ r*=0.6; g*=0.9; b*=0.55; }
    col[i]=r; col[i+1]=g; col[i+2]=b; }
  pos.needsUpdate=true; sbGeo.attributes.color.needsUpdate=true; sbGeo.computeVertexNormals(); }
/* ---- kelp — tall strands rising from the floor, swaying with the current ---- */
const kelpMat=new THREE.MeshLambertMaterial({map:TEX.kelp,side:THREE.DoubleSide});
function makeKelp(){ const g=new THREE.Group(), segs=[];
  for(let s=0;s<5;s++){ const seg=new THREE.Mesh(new THREE.BoxGeometry(1.1,7,1.1),kelpMat); seg.position.y=s*7+3.5; g.add(seg); segs.push(seg); }
  g.userData={segs}; return g; }
const KELP=[], KELP_N=60, KELP_R=560;
function initKelp(){ if(KELP.length) return; for(let k=0;k<KELP_N;k++){ const m=makeKelp(); m.visible=false; scene.add(m);
  KELP.push({m,x:0,z:0,fy:0,h:0,ph:Math.random()*6.28,set:false}); } }
function placeKelp(k,px,pz){ for(let tr=0;tr<6;tr++){ const a=Math.random()*6.28, r=60+Math.random()*(KELP_R-60);
    const x=px+Math.cos(a)*r, z=pz+Math.sin(a)*r, fy=seabedDepth(x,z);
    if(SEA_SURF-fy>34 && fbm(x*0.012+50,z*0.012-20)>0.5){ k.x=x; k.z=z; k.fy=fy;
      k.h=Math.min(SEA_SURF-fy-6,40+Math.random()*90); k.set=true;
      k.m.position.set(x,fy,z); k.m.scale.set(0.7+Math.random()*0.6,k.h/35,0.7+Math.random()*0.6); k.m.visible=true; return; } }
  k.set=false; k.m.visible=false; }
function updateKelp(px,pz,t){ initKelp(); for(const k of KELP){
    if(!k.set||Math.hypot(k.x-px,k.z-pz)>KELP_R+90) placeKelp(k,px,pz);
    if(!k.set) continue; const sw=Math.sin(t*1.0+k.ph)*0.12, segs=k.m.userData.segs;
    for(let s=0;s<segs.length;s++) segs[s].rotation.z=sw*(s+1)*0.5; } }
/* ---- CORAL REEFS — the glory of the shallows near the coasts ----
   Mounds of coral blocks in living colour, crowned with fans, sponges and
   glowing sea-pickles. They rise thickest where the sea is shallow and warm. */
const CORAL_COLS=[0x2f6fe0,0x8a3fd0,0xd6486f,0xd8c23a,0xdb5aa0,0x2fb0c8,0x4ad06a];
const coralMats=CORAL_COLS.map(c=>new THREE.MeshLambertMaterial({map:TEX.coral,color:c}));
const spongeMat=new THREE.MeshLambertMaterial({map:TEX.sponge});
function cbox(w,h,d,ci){ return new THREE.Mesh(new THREE.BoxGeometry(w,h,d),coralMats[ci]); }
function makeFan(ci){ const g=new THREE.Group();
  for(let i=0;i<4;i++){ const bl=cbox(0.5,2.0+Math.random()*1.6,0.5,ci), a=i/4*6.28;
    bl.position.set(Math.cos(a)*0.8,1.1,Math.sin(a)*0.8); bl.rotation.z=Math.cos(a)*0.6; bl.rotation.x=Math.sin(a)*0.6; g.add(bl); } return g; }
function makeCoral(){ const g=new THREE.Group(), n=9+Math.floor(Math.random()*12);
  for(let i=0;i<n;i++){ const s=3+Math.random()*4, ci=Math.floor(Math.random()*coralMats.length);
    const b=cbox(s,s,s,ci), rr=Math.random()*8, a=Math.random()*6.28, hy=Math.random()*12;
    b.position.set(Math.cos(a)*rr,hy+s*0.5,Math.sin(a)*rr); g.add(b);
    if(Math.random()<0.55){ const fan=makeFan(Math.floor(Math.random()*coralMats.length));
      fan.position.set(b.position.x,hy+s,b.position.z); g.add(fan); } }
  if(Math.random()<0.7){ const sp=new THREE.Mesh(new THREE.BoxGeometry(4,3.4,4),spongeMat); sp.position.set((Math.random()-0.5)*9,2,(Math.random()-0.5)*9); g.add(sp); }  /* sponge */
  if(Math.random()<0.6){ const gl=new THREE.Mesh(new THREE.BoxGeometry(0.9,1.3,0.9),
      new THREE.MeshBasicMaterial({color:0xcdf06a,fog:true})); gl.position.set((Math.random()-0.5)*7,Math.random()*9+1,(Math.random()-0.5)*7); g.add(gl); }  /* sea-pickle glow */
  return g; }
const CORAL=[], CORAL_N=30, CORAL_R=560;
function initCoral(){ if(CORAL.length) return; for(let k=0;k<CORAL_N;k++){ const m=makeCoral(); m.visible=false; scene.add(m); CORAL.push({m,x:0,z:0,set:false}); } }
function updateCoral(px,pz){ initCoral(); for(const r of CORAL){ if(r.set&&Math.hypot(r.x-px,r.z-pz)<=CORAL_R+90) continue;
    for(let tr=0;tr<7;tr++){ const a=Math.random()*6.28, rr=50+Math.random()*CORAL_R, x=px+Math.cos(a)*rr, z=pz+Math.sin(a)*rr, d=SEA_SURF-seabedDepth(x,z);
      if(d>10 && d<150 && fbm(x*0.01-9,z*0.01+4)>0.44){ r.x=x; r.z=z; r.set=true; r.m.position.set(x,seabedDepth(x,z),z); r.m.rotation.y=Math.random()*6.28; r.m.visible=true; break; }
      if(tr===6){ r.set=false; r.m.visible=false; } } } }
/* ---- seagrass — short tufts carpeting the shallow floor ---- */
const seagrassMat=new THREE.MeshLambertMaterial({map:TEX.seagrass,side:THREE.DoubleSide});
function makeSeagrass(){ const g=new THREE.Group(), n=3+Math.floor(Math.random()*4);
  for(let i=0;i<n;i++){ const bl=new THREE.Mesh(new THREE.BoxGeometry(0.6,2+Math.random()*2.6,0.6),seagrassMat);
    bl.position.set((Math.random()-0.5)*3.2,1.2,(Math.random()-0.5)*3.2); bl.rotation.z=(Math.random()-0.5)*0.4; g.add(bl); } return g; }
const GRASS=[], GRASS_N=120, GRASS_R=380;
function initGrass(){ if(GRASS.length) return; for(let k=0;k<GRASS_N;k++){ const m=makeSeagrass(); m.visible=false; scene.add(m); GRASS.push({m,x:0,z:0,ph:Math.random()*6.28,set:false}); } }
function updateGrass(px,pz,t){ initGrass(); for(const r of GRASS){ if(!r.set||Math.hypot(r.x-px,r.z-pz)>GRASS_R+70){
      for(let tr=0;tr<5;tr++){ const a=Math.random()*6.28, rr=30+Math.random()*GRASS_R, x=px+Math.cos(a)*rr, z=pz+Math.sin(a)*rr, d=SEA_SURF-seabedDepth(x,z);
        if(d>6 && d<170){ r.x=x; r.z=z; r.set=true; r.m.position.set(x,seabedDepth(x,z),z); r.m.visible=true; break; } if(tr===4){ r.set=false; r.m.visible=false; } } }
    if(r.set) r.m.rotation.z=Math.sin(t*1.3+r.ph)*0.14; } }
/* ---- god-rays — shafts of light slanting down from the surface ---- */
const RAYS=[], RAY_N=9;
function initRays(){ if(RAYS.length) return; for(let k=0;k<RAY_N;k++){
    const m=new THREE.Mesh(new THREE.PlaneGeometry(22,520),
      new THREE.MeshBasicMaterial({color:0xcdeeff,transparent:true,opacity:0,blending:THREE.AdditiveBlending,depthWrite:false,fog:false,side:THREE.DoubleSide}));
    m.visible=false; scene.add(m); RAYS.push({m,x:0,z:0,rot:Math.random()*6.28,tilt:(Math.random()-0.5)*0.5}); } }
function updateRays(px,py,pz,murk){ initRays();
  for(const r of RAYS){ if(Math.hypot(r.x-px,r.z-pz)>620){ const a=Math.random()*6.28, rr=Math.random()*500; r.x=px+Math.cos(a)*rr; r.z=pz+Math.sin(a)*rr; r.rot=Math.random()*6.28; }
    r.m.position.set(r.x,SEA_SURF-250,r.z); r.m.rotation.set(r.tilt,r.rot,0.12);
    r.m.material.opacity=(1-murk)*0.09; r.m.visible=true; } }
/* ---- fish schools, squid, bubbles ---- */
const DIVEFISH=[], DF_N=30, DF_R=240;
const TROPICAL=[0xff8c2a,0xffd23a,0xff5a7a,0x3ad0ff,0x8a5cff,0xf4f4f4,0x2fd08a,0xff4d4d];
function initDiveFish(){ if(DIVEFISH.length) return; for(let k=0;k<DF_N;k++){ const m=makeFish(TROPICAL[Math.floor(Math.random()*TROPICAL.length)]); m.scale.setScalar(0.6+Math.random()*0.8); m.visible=false; scene.add(m);
  DIVEFISH.push({m,x:0,z:0,y:0,dir:Math.random()*6.28,spd:9+Math.random()*11,ph:Math.random()*6.28,set:false}); } }
function updateDiveFish(px,py,pz,dt,t){ initDiveFish(); for(const f of DIVEFISH){
    if(!f.set||Math.hypot(f.x-px,f.z-pz)>DF_R+70){ const a=Math.random()*6.28, r=40+Math.random()*DF_R; f.x=px+Math.cos(a)*r; f.z=pz+Math.sin(a)*r;
      const fy=seabedDepth(f.x,f.z); f.y=Math.min(SEA_SURF-8,fy+12+Math.random()*Math.max(6,SEA_SURF-fy-16)); f.dir=Math.random()*6.28; f.set=true; f.m.visible=true; }
    f.dir+=Math.sin(t*0.5+f.ph)*0.04; f.x+=Math.cos(f.dir)*f.spd*dt; f.z+=Math.sin(f.dir)*f.spd*dt; f.y+=Math.sin(t*0.8+f.ph)*3*dt;
    const fy=seabedDepth(f.x,f.z); f.y=Math.max(fy+4,Math.min(SEA_SURF-6,f.y));
    f.m.position.set(f.x,f.y,f.z); f.m.rotation.y=Math.atan2(Math.cos(f.dir),Math.sin(f.dir)); f.m.rotation.z=Math.sin(t*3+f.ph)*0.16; } }
function makeSquid(){ const g=new THREE.Group();
  const mant=lbox(2.4,3.2,2.4,0x6a4a86); mant.position.y=0; g.add(mant);
  const head=lbox(2.0,1.2,2.0,0x7a5a96); head.position.y=-1.9; g.add(head);
  const tents=[]; for(let i=0;i<6;i++){ const a=i/6*6.28, tb=lbox(0.5,2.6,0.5,0x5a3a76); tb.position.set(Math.cos(a)*0.8,-3.4,Math.sin(a)*0.8); g.add(tb); tents.push(tb); }
  const eL=lbox(0.5,0.5,0.4,0xffffff); eL.position.set(0.9,0.3,1.2); g.add(eL); const eR=eL.clone(); eR.position.x=-0.9; g.add(eR);
  g.userData={tents}; return g; }
const SQUIDS=[];
function initSquid(){ if(SQUIDS.length) return; for(let k=0;k<3;k++){ const m=makeSquid(); m.visible=false; scene.add(m);
  SQUIDS.push({m,x:0,z:0,y:0,dir:Math.random()*6.28,ph:Math.random()*6.28,set:false}); } }
function updateSquid(px,py,pz,dt,t){ initSquid(); for(const q of SQUIDS){
    if(!q.set||Math.hypot(q.x-px,q.z-pz)>DF_R+140){ const a=Math.random()*6.28, r=90+Math.random()*DF_R; q.x=px+Math.cos(a)*r; q.z=pz+Math.sin(a)*r;
      const fy=seabedDepth(q.x,q.z); q.y=fy+22+Math.random()*40; q.dir=Math.random()*6.28; q.set=true; q.m.visible=true; }
    q.x+=Math.cos(q.dir)*6*dt; q.z+=Math.sin(q.dir)*6*dt; const pulse=0.5+0.5*Math.sin(t*3+q.ph); q.y+=(pulse-0.4)*8*dt;
    const fy=seabedDepth(q.x,q.z); q.y=Math.max(fy+8,Math.min(SEA_SURF-10,q.y));
    q.m.position.set(q.x,q.y,q.z); q.m.rotation.y=q.dir+Math.PI/2;
    q.m.userData.tents.forEach((tb,i)=>{ tb.rotation.x=Math.sin(t*3+i)*0.3-pulse*0.25; }); } }
/* ---- dolphins — playful pods arcing through the shallows ---- */
function makeDolphin(){ const g=new THREE.Group();
  const body=lbox(2.2,2.4,7,0xa9b6c2); g.add(body);
  const belly=lbox(2.0,1.1,5,0xe0e7ee); belly.position.y=-1.0; g.add(belly);
  const snout=lbox(1.0,1.0,2.4,0xb9c4cf); snout.position.set(0,-0.2,4.4); g.add(snout);
  const dorsal=lbox(0.4,1.9,1.6,0x8f9ba8); dorsal.position.set(0,1.9,0); dorsal.rotation.x=-0.3; g.add(dorsal);
  const fluke=lbox(3.4,0.4,1.4,0x9aa7b4); fluke.position.set(0,0,-4.2); g.add(fluke);
  const eL=lbox(0.4,0.4,0.4,0x111820); eL.position.set(0.9,0.3,3.4); g.add(eL); const eR=eL.clone(); eR.position.x=-0.9; g.add(eR);
  return g; }
const DOLPHINS=[], DOL_N=6, DOL_R=440;
function initDolphins(){ if(DOLPHINS.length) return; for(let k=0;k<DOL_N;k++){ const m=makeDolphin(); m.visible=false; scene.add(m);
  DOLPHINS.push({m,x:0,z:0,y:0,dir:Math.random()*6.28,ph:Math.random()*6.28,set:false}); } }
function updateDolphins(px,py,pz,dt,t){ initDolphins();
  for(const d of DOLPHINS){ if(!d.set||Math.hypot(d.x-px,d.z-pz)>DOL_R+150){
      const a=Math.random()*6.28, r=80+Math.random()*260; d.x=px+Math.cos(a)*r; d.z=pz+Math.sin(a)*r;
      const fy=seabedDepth(d.x,d.z); d.y=Math.min(SEA_SURF-6,fy+30+Math.random()*40); d.dir=Math.random()*6.28; d.set=true; d.m.visible=true; }
    d.dir+=Math.sin(t*0.4+d.ph)*0.05; const sp=18; d.x+=Math.cos(d.dir)*sp*dt; d.z+=Math.sin(d.dir)*sp*dt;
    const arc=Math.sin(t*0.9+d.ph); d.y+=arc*10*dt; const fy=seabedDepth(d.x,d.z); d.y=Math.max(fy+8,Math.min(SEA_SURF-4,d.y));
    d.m.position.set(d.x,d.y,d.z); d.m.rotation.y=Math.atan2(Math.cos(d.dir),Math.sin(d.dir)); d.m.rotation.x=-arc*0.4; } }
/* ---- sharks — great grey shapes patrolling the deeper water ---- */
function makeShark(){ const g=new THREE.Group();
  const body=lbox(3.0,3.6,12,0x8894a0); g.add(body);
  const belly=lbox(2.6,1.5,10,0xd6dde4); belly.position.y=-1.5; g.add(belly);
  const snout=lbox(2.0,2.2,3.2,0x94a0ac); snout.position.set(0,0.4,7.2); g.add(snout);
  const mouth=lbox(1.9,0.4,0.5,0xf2f2f2); mouth.position.set(0,-0.9,8.4); g.add(mouth);
  const dorsal=lbox(0.5,3.6,2.6,0x76828e); dorsal.position.set(0,2.9,0); dorsal.rotation.x=-0.35; g.add(dorsal);
  const pecL=lbox(3.4,0.4,1.8,0x808c98); pecL.position.set(2.6,-1,2); pecL.rotation.z=0.5; g.add(pecL); const pecR=pecL.clone(); pecR.position.x=-2.6; pecR.rotation.z=-0.5; g.add(pecR);
  const tailU=lbox(0.5,3.6,1.8,0x8894a0); tailU.position.set(0,1.8,-7.2); tailU.rotation.x=0.5; g.add(tailU);
  const eL=lbox(0.4,0.4,0.4,0x0a0f14); eL.position.set(1.3,0.6,6); g.add(eL); const eR=eL.clone(); eR.position.x=-1.3; g.add(eR);
  const tail=new THREE.Group(); tail.add(tailU); g.userData={tail}; return g; }
const SHARKS=[], SHK_N=2, SHK_R=560;
function initSharks(){ if(SHARKS.length) return; for(let k=0;k<SHK_N;k++){ const m=makeShark(); m.visible=false; scene.add(m);
  SHARKS.push({m,x:0,z:0,y:0,dir:Math.random()*6.28,ph:Math.random()*6.28,set:false}); } }
function updateSharks(px,py,pz,dt,t){ initSharks();
  for(const s of SHARKS){ if(!s.set||Math.hypot(s.x-px,s.z-pz)>SHK_R+180){
      const a=Math.random()*6.28, r=180+Math.random()*320; s.x=px+Math.cos(a)*r; s.z=pz+Math.sin(a)*r;
      const fy=seabedDepth(s.x,s.z); s.y=fy+18+Math.random()*45; s.dir=Math.random()*6.28; s.set=true; s.m.visible=true; }
    s.dir+=Math.sin(t*0.25+s.ph)*0.03; const sp=13; s.x+=Math.cos(s.dir)*sp*dt; s.z+=Math.sin(s.dir)*sp*dt; s.y+=Math.sin(t*0.5+s.ph)*3*dt;
    const fy=seabedDepth(s.x,s.z); s.y=Math.max(fy+10,Math.min(SEA_SURF-8,s.y));
    s.m.position.set(s.x,s.y,s.z); s.m.rotation.y=Math.atan2(Math.cos(s.dir),Math.sin(s.dir));
    s.m.userData.tail.rotation.y=Math.sin(t*4+s.ph)*0.3; } }
/* ---- turtles, rays, whales, pufferfish, jellyfish, crabs ---- */
function makeTurtle(){ const g=new THREE.Group();
  const shell=lbox(3.4,1.6,4.0,0x3f7a4a); g.add(shell);
  const under=lbox(3.0,0.6,3.4,0x9aa86a); under.position.y=-0.9; g.add(under);
  const head=lbox(1.0,1.0,1.4,0x5a8a4a); head.position.set(0,0,2.6); g.add(head);
  const flL=lbox(1.8,0.4,1.0,0x4f8a5a); flL.position.set(2.0,-0.2,1.0); g.add(flL); const flR=flL.clone(); flR.position.x=-2.0; g.add(flR);
  const bkL=lbox(1.2,0.4,0.9,0x4f8a5a); bkL.position.set(1.8,-0.2,-1.6); g.add(bkL); const bkR=bkL.clone(); bkR.position.x=-1.8; g.add(bkR);
  g.userData={flL,flR}; return g; }
function makeRay(){ const g=new THREE.Group();
  const body=lbox(4,0.6,4,0x46566a); g.add(body);
  const wingL=lbox(3,0.35,3.4,0x556676); wingL.position.set(3.4,0,0); g.add(wingL); const wingR=wingL.clone(); wingR.position.x=-3.4; g.add(wingR);
  const tail=lbox(0.3,0.3,5,0x35455a); tail.position.set(0,0,-4); g.add(tail);
  g.userData={wingL,wingR}; return g; }
function makeWhale(){ const g=new THREE.Group();
  const body=lbox(9,10,30,0x3a4756); g.add(body);
  const belly=lbox(8,3.4,24,0x9aa6b2); belly.position.y=-4.6; g.add(belly);
  const head=lbox(8,8,10,0x36434f); head.position.set(0,0,17); g.add(head);
  const fluke=lbox(14,1.2,4,0x30404c); fluke.position.set(0,0,-16); g.add(fluke);
  const fin=lbox(0.7,5,3.4,0x30404c); fin.position.set(0,6,0); g.add(fin);
  const eL=lbox(0.6,0.6,0.6,0x0a0f14); eL.position.set(4.1,0,14); g.add(eL); const eR=eL.clone(); eR.position.x=-4.1; g.add(eR);
  return g; }
function makePuffer(){ const g=new THREE.Group();
  const body=lbox(2.2,2.2,2.4,0xe0b83a); g.add(body);
  for(let i=0;i<10;i++){ const a=i/10*6.28, sp=lbox(0.3,0.3,0.9,0xd0a02a); sp.position.set(Math.cos(a)*1.4,Math.sin(a)*1.4,0); sp.rotation.z=a; g.add(sp); }
  const eL=lbox(0.4,0.4,0.3,0x201818); eL.position.set(0.7,0.4,1.3); g.add(eL); const eR=eL.clone(); eR.position.x=-0.7; g.add(eR);
  return g; }
function makeJelly(){ const g=new THREE.Group();
  const bell=new THREE.Mesh(new THREE.SphereGeometry(2,10,8,0,6.28,0,Math.PI*0.62),new THREE.MeshLambertMaterial({color:0xdf7ad0,transparent:true,opacity:0.72}));
  g.add(bell); const tents=[]; for(let i=0;i<6;i++){ const a=i/6*6.28, t=lbox(0.25,3.4,0.25,0xe89ad8); t.position.set(Math.cos(a)*1.1,-2,Math.sin(a)*1.1); g.add(t); tents.push(t); }
  g.userData={tents}; return g; }
function makeCrab(){ const g=new THREE.Group();
  const body=lbox(2.4,1.2,1.8,0xd0472e); body.position.y=0.8; g.add(body);
  for(const s of[1,-1]){ const claw=lbox(1.0,0.9,0.9,0xe0583a); claw.position.set(s*1.8,0.9,0.9); g.add(claw);
    for(let i=0;i<3;i++){ const leg=lbox(1.2,0.25,0.25,0xb03a24); leg.position.set(s*1.6,0.5,-0.2-i*0.6); leg.rotation.z=s*0.3; g.add(leg); } }
  for(const s of[1,-1]){ const eye=lbox(0.3,0.6,0.3,0x201818); eye.position.set(s*0.5,1.6,0.9); g.add(eye); }
  return g; }
/* a generic wandering sea-mob pool (turtle/ray/whale/puffer) */
function mkSeaMob(make,n,R,rSpawn,near,scl){ const arr=[];
  for(let k=0;k<n;k++){ const m=make(); if(scl) m.scale.setScalar(scl); m.visible=false; scene.add(m); arr.push({m,x:0,z:0,y:0,dir:Math.random()*6.28,ph:Math.random()*6.28,set:false,sp:near?7:12}); }
  arr._R=R; arr._rs=rSpawn; arr._near=near; return arr; }
function updateSeaMob(arr,px,py,pz,dt,t){ for(const o of arr){
    if(!o.set||Math.hypot(o.x-px,o.z-pz)>arr._R+140){ const a=Math.random()*6.28, r=arr._rs*0.3+Math.random()*arr._rs*0.7;
      o.x=px+Math.cos(a)*r; o.z=pz+Math.sin(a)*r; const fy=seabedDepth(o.x,o.z);
      o.y = arr._near ? fy+4+Math.random()*14 : Math.min(SEA_SURF-8,fy+18+Math.random()*60); o.dir=Math.random()*6.28; o.set=true; o.m.visible=true; }
    o.dir+=Math.sin(t*0.3+o.ph)*0.03; o.x+=Math.cos(o.dir)*o.sp*dt; o.z+=Math.sin(o.dir)*o.sp*dt; o.y+=Math.sin(t*0.6+o.ph)*2*dt;
    const fy=seabedDepth(o.x,o.z); o.y=Math.max(fy+3,Math.min(SEA_SURF-4,o.y));
    o.m.position.set(o.x,o.y,o.z); o.m.rotation.y=Math.atan2(Math.cos(o.dir),Math.sin(o.dir));
    if(o.m.userData.flL){ o.m.userData.flL.rotation.z=0.2+Math.sin(t*2+o.ph)*0.3; o.m.userData.flR.rotation.z=-0.2-Math.sin(t*2+o.ph)*0.3; }
    if(o.m.userData.wingL){ o.m.userData.wingL.rotation.z=Math.sin(t*1.6+o.ph)*0.4; o.m.userData.wingR.rotation.z=-Math.sin(t*1.6+o.ph)*0.4; } } }
let TURTLES,RAYS_M,WHALES,PUFFERS,JELLIES,CRABS;
function initSeaMobs(){ if(TURTLES) return;
  TURTLES=mkSeaMob(makeTurtle,4,360,340,true,1.1);
  RAYS_M=mkSeaMob(makeRay,3,460,440,true,1.2);
  WHALES=mkSeaMob(makeWhale,1,700,650,false,1.0);
  PUFFERS=mkSeaMob(makePuffer,6,240,220,true,0.9);
  JELLIES=[]; for(let k=0;k<12;k++){ const m=makeJelly(); m.visible=false; scene.add(m); JELLIES.push({m,x:0,z:0,y:0,ph:Math.random()*6.28,set:false}); }
  CRABS=[]; for(let k=0;k<14;k++){ const m=makeCrab(); m.visible=false; scene.add(m); CRABS.push({m,x:0,z:0,ph:Math.random()*6.28,set:false}); } }
function updateSeaMobs(px,py,pz,dt,t){ initSeaMobs();
  updateSeaMob(TURTLES,px,py,pz,dt,t); updateSeaMob(RAYS_M,px,py,pz,dt,t); updateSeaMob(WHALES,px,py,pz,dt,t); updateSeaMob(PUFFERS,px,py,pz,dt,t);
  for(const j of JELLIES){ if(!j.set||Math.hypot(j.x-px,j.z-pz)>360){ const a=Math.random()*6.28,r=40+Math.random()*320; j.x=px+Math.cos(a)*r; j.z=pz+Math.sin(a)*r; const fy=seabedDepth(j.x,j.z); j.y=fy+30+Math.random()*80; j.set=true; j.m.visible=true; }
    const pulse=0.5+0.5*Math.sin(t*1.4+j.ph); j.y+=(pulse-0.45)*10*dt; const fy=seabedDepth(j.x,j.z); j.y=Math.max(fy+10,Math.min(SEA_SURF-6,j.y));
    j.m.position.set(j.x,j.y,j.z); j.m.scale.y=0.8+pulse*0.4; j.m.userData.tents.forEach((te,i)=>{ te.rotation.x=Math.sin(t*2+i)*0.2; }); }
  for(const c of CRABS){ if(!c.set||Math.hypot(c.x-px,c.z-pz)>300){ for(let tr=0;tr<5;tr++){ const a=Math.random()*6.28,r=30+Math.random()*300, x=px+Math.cos(a)*r,z=pz+Math.sin(a)*r, d=SEA_SURF-seabedDepth(x,z);
        if(d>6&&d<170){ c.x=x; c.z=z; c.set=true; c.m.position.set(x,seabedDepth(x,z)+0.6,z); c.m.rotation.y=Math.random()*6.28; c.m.visible=true; break; } if(tr===4){c.set=false;c.m.visible=false;} } }
    if(c.set) c.m.position.x=c.x+Math.sin(t*2+c.ph)*0.6; } }
function hideSeaMobs(){ if(!TURTLES) return; for(const arr of [TURTLES,RAYS_M,WHALES,PUFFERS]) for(const o of arr) o.m.visible=false;
  for(const j of JELLIES)j.m.visible=false; for(const c of CRABS)c.m.visible=false; }
const BUB=[], BUB_N=26;
function initBub(){ if(BUB.length) return; for(let k=0;k<BUB_N;k++){ const s=new THREE.Sprite(new THREE.SpriteMaterial({color:0xcdeeff,transparent:true,opacity:0,depthWrite:false,fog:false}));
  s.visible=false; scene.add(s); BUB.push({s,life:0,x:0,y:0,z:0,vy:0,sz:0}); } }
function updateBubbles(px,py,pz,dt){ initBub(); for(const b of BUB){
    if(b.life<=0){ if(Math.random()<0.5){ b.life=1+Math.random()*1.4; b.x=px+(Math.random()-0.5)*4; b.y=py+2; b.z=pz+(Math.random()-0.5)*4; b.vy=14+Math.random()*12; b.sz=0.3+Math.random()*0.6; b.s.visible=true; } else continue; }
    b.life-=dt; b.y+=b.vy*dt; b.vy*=0.99; b.s.position.set(b.x,b.y,b.z); b.s.scale.setScalar(b.sz); b.s.material.opacity=Math.min(0.6,Math.max(0,b.life)*0.5);
    if(b.life<=0) b.s.visible=false; } }
/* ---- a wreck of the ancients, at the deep sites of the sea ---- */
const wPlank=new THREE.MeshLambertMaterial({map:TEX.planks,color:0xa08868});
const wDark=new THREE.MeshLambertMaterial({map:TEX.planks,color:0x6f5a44});
const wLog=new THREE.MeshLambertMaterial({map:TEX.logSide,color:0x8a7050});
function wbox(w,h,d,m){ return new THREE.Mesh(new THREE.BoxGeometry(w,h,d),m); }
function makeWreck(){ const g=new THREE.Group();
  const hull=wbox(9,7,30,wDark); hull.position.y=3.5; g.add(hull);
  const keel=wbox(4,3,30,wDark); keel.position.y=0; g.add(keel);
  const bow=wbox(6,6,7,wDark); bow.position.set(0,3.8,17); bow.rotation.x=0.22; g.add(bow);
  const deck=wbox(8,1,26,wPlank); deck.position.y=7.2; g.add(deck);
  for(let i=0;i<7;i++){ const rib=wbox(0.8,4+hash2(i,3)*3,0.8,wDark); rib.position.set(3.7*(i%2?1:-1),8.5,-13+i*4); rib.rotation.z=(i%2?1:-1)*0.16; g.add(rib); }
  const mast=wbox(1.3,22,1.3,wLog); mast.position.set(0,16,-6); mast.rotation.z=0.12; g.add(mast);
  const mast2=wbox(1.0,12,1.0,wLog); mast2.position.set(0,10,9); mast2.rotation.z=-0.22; g.add(mast2);
  const brk=wbox(7,4,6,wDark); brk.position.set(1,3,-15); brk.rotation.z=0.4; g.add(brk);
  for(let i=0;i<12;i++){ const w=wbox(0.5,3+hash2(i,7)*3.5,0.5,seagrassMat);
    w.position.set((hash2(i,1)-0.5)*7,9,(hash2(i,2)-0.5)*24); g.add(w); }   /* seaweed grown over the deck */
  g.rotation.z=0.12; return g; }
const wreckSeen=new Set(), WRECKS=[]; const WRECK_N=2;
function initWrecks(){ if(WRECKS.length) return; for(let k=0;k<WRECK_N;k++){ const m=makeWreck(); m.visible=false; scene.add(m); WRECKS.push(m); } }
function updateWreck(px,pz){ initWrecks();
  const CS=900, ci=Math.round(px/CS), cj=Math.round(pz/CS), sites=[];
  for(let di=-2;di<=2;di++)for(let dj=-2;dj<=2;dj++){ const gi=ci+di,gj=cj+dj;
    if(hash2(gi*1.7,gj*3.1)>0.74){ const wx=gi*CS+(hash2(gi,gj)-0.5)*300, wz=gj*CS+(hash2(gj,gi)-0.5)*300, fy=seabedDepth(wx,wz);
      if(SEA_SURF-fy>36){ sites.push({wx,wz,fy,gi,gj,d:Math.hypot(wx-px,wz-pz)}); } } }
  sites.sort((a,b)=>a.d-b.d);
  for(let k=0;k<WRECKS.length;k++){ const s=sites[k];
    if(s&&s.d<SB_SIZE*0.55){ WRECKS[k].position.set(s.wx,s.fy,s.wz); WRECKS[k].rotation.y=hash2(s.gi,s.gj)*6.28; WRECKS[k].visible=true;
      const key=s.gi+','+s.gj; if(s.d<95&&!wreckSeen.has(key)){ wreckSeen.add(key);
        toast('You have come upon a wreck of the ancients, sunk in the heart of the seas and grown over with the deep.','YONAH 2:3'); } }
    else WRECKS[k].visible=false; } }
function initDeep(){ initKelp(); initCoral(); initGrass(); initRays(); initDiveFish(); initSquid(); initDolphins(); initSharks(); initSeaMobs(); initBub(); initWrecks(); }
function hideDeep(){ seaFloor.visible=false;
  for(const k of KELP)k.m.visible=false; for(const r of CORAL)r.m.visible=false; for(const r of GRASS)r.m.visible=false;
  for(const r of RAYS)r.m.visible=false; for(const f of DIVEFISH)f.m.visible=false; for(const q of SQUIDS)q.m.visible=false;
  for(const d of DOLPHINS)d.m.visible=false; for(const s of SHARKS)s.m.visible=false; hideSeaMobs();
  for(const b of BUB)b.s.visible=false; for(const w of WRECKS)w.visible=false; deepShown=false; }
function updateDeep(px,py,pz,dt,murk){ const t=performance.now()*0.001;
  seaFloor.visible=true; seaFloor.position.set(px,0,pz); updateSeaFloor(px,pz);
  updateKelp(px,pz,t); updateCoral(px,pz); updateGrass(px,pz,t); updateRays(px,py,pz,murk||0);
  updateDiveFish(px,py,pz,dt,t); updateSquid(px,py,pz,dt,t); updateDolphins(px,py,pz,dt,t); updateSharks(px,py,pz,dt,t);
  updateSeaMobs(px,py,pz,dt,t); updateBubbles(px,py,pz,dt); updateWreck(px,pz); deepShown=true; }
function diveTick(dt){ const dv=state.dive; const [f,tn]=axis();
  dv.heading+=tn*dt*DIVE_TURN; const tgt=f*DIVE_MAXSP; dv.sp+=(tgt-dv.sp)*Math.min(1,dt*2.6);
  dv.x+=Math.sin(dv.heading)*dv.sp*dt; dv.z+=Math.cos(dv.heading)*dv.sp*dt;
  let up=flyPad; if(keys.Space) up+=1; if(keys.ShiftLeft||keys.ShiftRight||keys.ControlLeft||keys.ControlRight) up-=1; up=Math.max(-1,Math.min(1,up));
  if(up!==0){ dv.vy+=up*DIVE_VACC*dt; dv.vy=Math.max(-DIVE_VMAX,Math.min(DIVE_VMAX,dv.vy)); } else dv.vy*=Math.max(0,1-dt*1.2);
  dv.y+=dv.vy*dt;
  const floor=seabedDepth(dv.x,dv.z)+3;
  if(dv.y<floor){ dv.y=floor; dv.vy=Math.max(0,dv.vy); }
  if(dv.y>SEA_SURF-2){ dv.y=SEA_SURF-2; dv.vy=Math.min(0,dv.vy); if(up>0){ surface(); return; } }
  if(Math.hypot(dv.x,dv.z)/R_WORLD>0.985){ dv.x-=Math.sin(dv.heading)*dv.sp*dt; dv.z-=Math.cos(dv.heading)*dv.sp*dt; dv.sp*=0.3; }
  state.dist+=Math.abs(dv.sp)*dt;
  const u=walkerG.userData, ph=performance.now()*0.007;
  walkerG.position.set(dv.x,dv.y,dv.z); walkerG.rotation.y=dv.heading;
  /* the swimming model — lying flat, arms reaching forward, legs in a flutter kick */
  const pitch=Math.max(-0.35,Math.min(0.35,-dv.vy/DIVE_VMAX*0.6));
  walkerG.rotation.x=1.45+pitch;
  u.armL.rotation.x=-3.0+Math.sin(ph)*0.22; u.armR.rotation.x=-3.0+Math.sin(ph+0.4)*0.22;
  u.armL.rotation.z=0.14; u.armR.rotation.z=-0.14;
  u.legL.rotation.x=Math.sin(ph*1.5)*0.5; u.legR.rotation.x=-Math.sin(ph*1.5)*0.5; }
function enterDive(){ if(state.mode==='dive'){ surface(); return; }
  let x,z,h;
  if(state.mode==='walk'){ x=state.walk.x; z=state.walk.z; h=state.walk.heading; }
  else if(state.mode==='boat'||state.mode==='deck'){ x=state.boat.x; z=state.boat.z; h=state.boat.heading; }
  else return;
  if(landAtWorld(x,z)||Math.hypot(x,z)/R_WORLD>0.985){ toast('You must be over open water to dive into the deep.'); return; }
  initDeep();
  state.dive.x=x; state.dive.z=z; state.dive.heading=h; state.dive.y=SEA_SURF-6; state.dive.vy=-22; state.dive.sp=0;
  splash(x,SEA_SURF+1,z,true);
  setMode('dive');
  if(!diveHintShown){ diveHintShown=true;
    toast('You slip beneath the waves — SHIFT to dive deeper, SPACE to rise, W/S to swim, C to surface.'); } }
function surface(){ const dv=state.dive;
  state.walk.x=dv.x; state.walk.z=dv.z; state.walk.heading=dv.heading; state.walk.feetY=undefined; state.walk.vy=0; state.walk.grounded=true;
  setMode('walk'); hideDeep(); toast('You break the surface and draw breath.'); }

/* ================= AMBIENT WILDLIFE — THE BEASTS OF THE FIELD & FOWL OF THE AIR =========
   Herds and flocks roam the whole earth, not only the villages: beasts upon
   the land (chosen by the clime — camels and lions in the warm dry south,
   cattle, horses, deer and wolves in the temperate lands), and birds,
   butterflies and eagles wheeling in the air above land and sea. */
const LAND_TEMPERATE=['cow','sheep','horse','donkey','pig','deer','wolf','dog','chicken','hare','goat','ox'];
const LAND_DESERT=['camel','ostrich','lion','goat','donkey','deer'];
function landKindAt(x,z){ const lat=Math.abs(90-Math.hypot(x/R_WORLD,z/R_WORLD)*180), arid=fbm(x*0.0009+5,z*0.0009-8);
  const list=(lat<34&&arid>0.54)?LAND_DESERT:LAND_TEMPERATE;
  return list[Math.floor(hash2(Math.floor(x/48),Math.floor(z/48))*list.length)%list.length]; }
const LANDLIFE=[], LL_N=26, LL_R=360;
const AMBIENT_PREY=new Set(['sheep','goat','pig','chicken','hare','deer','donkey','cow','horse','ostrich']);
function initLandLife(){ if(LANDLIFE.length) return; for(let k=0;k<LL_N;k++) LANDLIFE.push({m:null,kind:null,hx:0,hz:0,x:0,z:0,heading:0,tx:0,tz:0,t:0,set:false}); }
function findLandSpot(px,pz){ for(let tr=0;tr<10;tr++){ const a=Math.random()*6.28, r=70+Math.random()*LL_R, x=px+Math.cos(a)*r, z=pz+Math.sin(a)*r;
    const c=landAtWorld(x,z); if(c&&c.kind!=='wall'&&c.h<=6&&Math.hypot(x,z)/R_WORLD<0.9) return {x,z,y:c.h*B}; } return null; }
function updateLandLife(px,pz,dt,t){ initLandLife();
  for(const a of LANDLIFE){ if(!a.set||Math.hypot(a.hx-px,a.hz-pz)>LL_R+140){ const sp=findLandSpot(px,pz);
      if(!sp){ if(a.m)a.m.visible=false; a.set=false; continue; }
      const kind=landKindAt(sp.x,sp.z);
      if(a.kind!==kind){ if(a.m) scene.remove(a.m); a.m=makeAnimal(kind); scene.add(a.m); a.kind=kind; }
      a.hx=sp.x; a.hz=sp.z; a.x=sp.x; a.z=sp.z; a.tx=sp.x; a.tz=sp.z; a.t=Math.random()*3; a.set=true; a.m.visible=true; a.m.position.set(sp.x,sp.y,sp.z); }
    if(!a.set) continue;
    /* the hunt upon the open field: wolves and lions run down the grazers,
       and the grazers flee — from them, and from the traveller drawn too near */
    let spd=7;
    const predator=(a.kind==='wolf'||a.kind==='lion');
    if(predator){
      a.cool=(a.cool||0)-dt;
      if(a.cool<=0){
        if(!a.prey||!a.prey.set||Math.hypot(a.prey.x-a.x,a.prey.z-a.z)>90){
          a.prey=null; let bd=1e9;
          for(const b of LANDLIFE){ if(b===a||!b.set||!AMBIENT_PREY.has(b.kind)) continue;
            const d2=Math.hypot(b.x-a.x,b.z-a.z); if(d2<70&&d2<bd){ bd=d2; a.prey=b; } } }
        if(a.prey){ a.tx=a.prey.x; a.tz=a.prey.z; spd=11; a.t=Math.max(a.t,0.4);
          if(Math.hypot(a.prey.x-a.x,a.prey.z-a.z)<3){ a.cool=12; a.prey.fear=1.8; a.prey=null; } } }
    } else if(AMBIENT_PREY.has(a.kind)){
      a.fear=(a.fear||0)-dt;
      let fx=null,fz=null;
      if(state.mode==='walk'&&Math.hypot(state.walk.x-a.x,state.walk.z-a.z)<9){ fx=state.walk.x; fz=state.walk.z; }
      else for(const b of LANDLIFE){ if(!b.set||(b.kind!=='wolf'&&b.kind!=='lion')) continue;
        if(Math.hypot(b.x-a.x,b.z-a.z)<16){ fx=b.x; fz=b.z; break; } }
      if(fx!==null){ const dd2=Math.hypot(a.x-fx,a.z-fz)||1;
        a.tx=a.x+(a.x-fx)/dd2*30; a.tz=a.z+(a.z-fz)/dd2*30; a.fear=Math.max(a.fear,0.6); }
      if(a.fear>0){ spd=11; a.t=Math.max(a.t,0.4); }
    }
    a.t-=dt; if(a.t<=0){ a.t=1.6+Math.random()*3; const aa=Math.random()*6.28, rr=Math.random()*14*B; a.tx=a.hx+Math.cos(aa)*rr; a.tz=a.hz+Math.sin(aa)*rr; }
    const dx=a.tx-a.x, dz=a.tz-a.z, dd=Math.hypot(dx,dz)||1, moving=dd>1.5;
    if(moving){ const nx=a.x+dx/dd*spd*dt, nz=a.z+dz/dd*spd*dt, c=landAtWorld(nx,nz);
      if(c&&c.kind!=='wall'&&Math.abs(c.h*B-a.m.position.y)<7){ a.x=nx; a.z=nz; a.heading=Math.atan2(dx,dz); } else a.t=0; }
    const c2=landAtWorld(a.x,a.z); a.m.position.set(a.x,c2?c2.h*B:WATER_Y,a.z); a.m.rotation.y=a.heading;
    if(a.m.userData.legs) for(const L of a.m.userData.legs) L.rotation.x=moving?Math.sin(t*(spd>8?10:7)+(L.userData.ph||0))*0.5:0; } }
function hideLandLife(){ for(const a of LANDLIFE) if(a.m) a.m.visible=false; }
const AIRLIFE=[], AL_N=18, AL_R=440;
function airKind(px,pz,night){ const overSea=!landAtWorld(px,pz);
  if(night) return Math.random()<0.6?'crow':'dove';
  if(overSea) return Math.random()<0.7?'gull':'eagle';
  const r=Math.random(); return r<0.3?'butterfly':r<0.55?'dove':r<0.8?'crow':'eagle'; }
function initAirLife(){ if(AIRLIFE.length) return; for(let k=0;k<AL_N;k++) AIRLIFE.push({m:null,type:null,cx:0,cz:0,rad:0,ph:Math.random()*6.28,h:0,spd:0,set:false}); }
function updateAirLife(px,pz,dt,t,night){ initAirLife();
  for(const b of AIRLIFE){ if(!b.set||Math.hypot(b.cx-px,b.cz-pz)>AL_R+160){ const type=airKind(px,pz,night);
      if(b.type!==type){ if(b.m) scene.remove(b.m); b.m=makeBird(type); scene.add(b.m); b.type=type; }
      const a=Math.random()*6.28, r=60+Math.random()*AL_R; b.cx=px+Math.cos(a)*r; b.cz=pz+Math.sin(a)*r;
      const c=landAtWorld(b.cx,b.cz), base=c?c.h*B:WATER_Y;
      b.h=type==='butterfly'?base+2+Math.random()*5:base+24+Math.random()*70; b.rad=type==='butterfly'?4+Math.random()*6:16+Math.random()*40;
      b.spd=(type==='butterfly'?1.4:0.5)+Math.random()*0.5; b.set=true; b.m.visible=true; }
    b.ph+=dt*b.spd; const x=b.cx+Math.cos(b.ph)*b.rad, z=b.cz+Math.sin(b.ph)*b.rad;
    b.m.position.set(x,b.h+Math.sin(t*2+b.ph)*(b.type==='butterfly'?1.6:2.4),z); b.m.rotation.y=-b.ph+Math.PI/2;
    const fl=b.type==='butterfly'?Math.sin(t*16+b.ph)*0.9:Math.sin(t*10+b.ph)*0.6;
    if(b.m.userData.wingL){ b.m.userData.wingL.rotation.z=fl; b.m.userData.wingR.rotation.z=-fl; } } }
function hideAirLife(){ for(const b of AIRLIFE) if(b.m) b.m.visible=false; }

/* ================= VILLAGES (minecraft-fashion) =================
   Cobblestone bases, oak plank walls with log corner posts, glass
   panes, doors, stepped plank roofs with an overhang; dirt paths,
   fenced farms with crops and a water channel, hay bales, a well,
   and lamp posts that burn when the sun departs.                  */
/* furnish a room: a big bed, a table with chairs, bookshelves along a wall,
   a chest, a woven rug, and corner lamps — scaled to the room, off the door */
function emitFurniture(G, ex, x0,x1,z0,z1, fy, T, hx,hz, doorDir){
  const ix0=x0+T, ix1=x1-T, iz0=z0+T, iz1=z1-T;
  const rw=Math.min(ix1-ix0, iz1-iz0);
  const onZ1=doorDir===0, onZ0=doorDir===1, onX1=doorDir===2, onX0=doorDir===3;
  faceTop(G,'haySide', hx-rw*0.34,hz-rw*0.34, hx+rw*0.34,hz+rw*0.34, fy+0.05, 0.95);   /* rug */
  /* bed in a corner away from the door */
  const bx = onX0? ix1-B*0.95 : ix0+B*0.95;
  const bz = onZ0? iz1-B*1.2  : iz0+B*1.2;
  emitBox(G, bx-B*0.85,fy,bz-B*1.1, bx+B*0.85,fy+B*0.42,bz+B*1.1,'planks','wool',null);
  emitBox(G, bx-B*0.7,fy+B*0.42,bz-B*1.0, bx+B*0.7,fy+B*0.6,bz-B*0.5,'wool','wool',null);
  emitBox(G, bx-B*0.9,fy,bz-B*1.28, bx+B*0.9,fy+B*0.95,bz-B*1.1,'logSide','logTop',null);
  /* table + two chairs near the middle */
  const tx=hx+(onX1?-B*1.5:B*1.3), tz=hz;
  emitBox(G, tx-B*0.15,fy,tz-B*0.15, tx+B*0.15,fy+B*0.72,tz+B*0.15,'logSide','logTop',null);
  emitBox(G, tx-B*0.8,fy+B*0.72,tz-B*0.6, tx+B*0.8,fy+B*0.86,tz+B*0.6,'planks','benchTop',null);
  for(const s of [-1,1]){ const chz=tz+s*B*0.95;
    emitBox(G, tx-B*0.32,fy,chz-B*0.32, tx+B*0.32,fy+B*0.44,chz+B*0.32,'planks','planks',null);
    emitBox(G, tx-B*0.32,fy+B*0.44,chz+s*B*0.2, tx+B*0.32,fy+B*1.05,chz+s*B*0.32,'planks','planks',null); }
  /* bookshelves along a wall that is not the door wall */
  if(!onZ0&&!onZ1){ for(let sx=ix0+B*0.7; sx<ix1-B*0.5; sx+=B*1.05){
      emitBox(G, sx-B*0.45,fy,iz0+0.2, sx+B*0.45,fy+B*2.0,iz0+B*0.5,'logSide','logTop',null);
      emitBox(G, sx-B*0.4,fy+B*0.4,iz0+0.25, sx+B*0.4,fy+B*1.7,iz0+B*0.45,'planks','planks',null); } }
  else { for(let sz=iz0+B*0.7; sz<iz1-B*0.5; sz+=B*1.05){
      emitBox(G, ix0+0.2,fy,sz-B*0.45, ix0+B*0.5,fy+B*2.0,sz+B*0.45,'logSide','logTop',null);
      emitBox(G, ix0+0.25,fy+B*0.4,sz-B*0.4, ix0+B*0.45,fy+B*1.7,sz+B*0.4,'planks','planks',null); } }
  /* a chest in a corner */
  const kx=onX1?ix0+B*0.6:ix1-B*0.6, kz=onZ1?iz0+B*0.6:iz1-B*0.6;
  emitBox(G, kx-B*0.5,fy,kz-B*0.4, kx+B*0.5,fy+B*0.6,kz+B*0.4,'logSide','logTop',null);
  /* corner lamps */
  ex.torchIn.push({x:ix0+B*0.5,y:fy+B*2.2,z:iz0+B*0.5});
  ex.torchIn.push({x:ix1-B*0.5,y:fy+B*2.2,z:iz1-B*0.5});
}
function emitHouse(G,ex, hx,hz,y, w,d, doorDir, seed){
  /* w,d in blocks (odd best); walls 3 blocks; local axis-aligned.
     Houses are HOLLOW: cobble footing, plank floor, four walls with a real
     doorway you can walk through, furniture within (bed, table, chair),
     and a hearth-light that burns when the sun departs. */
  const rnd=k=>hash2(seed*7.7+k*3.1,seed*3.3+k*9.7);
  const x0=hx-w*B/2, x1=hx+w*B/2, z0=hz-d*B/2, z1=hz+d*B/2;
  const wallH=3*B, T=B*0.5, gw=B*0.75;
  /* cobble footing and the plank floor laid upon it */
  emitBox(G, x0,y,z0, x1,y+B*0.55,z1, 'cobble','cobble',null);
  faceTop(G,'planks', x0+T,z0+T, x1-T,z1-T, y+B*0.58, 0.95);
  /* four hollow walls; the doorway is left open on doorDir (0=+z 1=-z 2=+x 3=-x) */
  const wy0=y+B*0.55, wy1=y+wallH, ly=y+B*2.75;   /* ly = lintel underside */
  const wall=(ax0,az0,ax1,az1)=>emitBox(G,ax0,wy0,az0,ax1,wy1,az1,'planks','planks',null);
  if(doorDir===0){ wall(x0,z1-T,hx-gw,z1); wall(hx+gw,z1-T,x1,z1);
    emitBox(G,hx-gw,ly,z1-T,hx+gw,wy1,z1,'planks','planks','planks'); }
  else wall(x0,z1-T,x1,z1);
  if(doorDir===1){ wall(x0,z0,hx-gw,z0+T); wall(hx+gw,z0,x1,z0+T);
    emitBox(G,hx-gw,ly,z0,hx+gw,wy1,z0+T,'planks','planks','planks'); }
  else wall(x0,z0,x1,z0+T);
  if(doorDir===2){ wall(x1-T,z0,x1,hz-gw); wall(x1-T,hz+gw,x1,z1);
    emitBox(G,x1-T,ly,hz-gw,x1,wy1,hz+gw,'planks','planks','planks'); }
  else wall(x1-T,z0,x1,z1);
  if(doorDir===3){ wall(x0,z0,x0+T,hz-gw); wall(x0,hz+gw,x0+T,z1);
    emitBox(G,x0,ly,hz-gw,x0+T,wy1,hz+gw,'planks','planks','planks'); }
  else wall(x0,z0,x0+T,z1);
  /* log corner posts */
  for(const cx of [x0-0.12,x1-B*0.5+0.12]) for(const cz of [z0-0.12,z1-B*0.5+0.12])
    emitBox(G, cx, y, cz, cx+B*0.5, y+wallH+0.15, cz+B*0.5, 'logSide','logTop',null);
  /* windows: glass panes set into two walls (never the door wall) */
  const gy0=y+B*1.4, gy1=y+B*2.4;
  if(rnd(1)>0.3&&doorDir!==1){ const gx=hx-B*0.55;
    quad(G,'glass', gx,gy0,z0-0.12, gx+B*1.1,gy0,z0-0.12, gx+B*1.1,gy1,z0-0.12, gx,gy1,z0-0.12, 0,0,1,1, 0.95); }
  if(rnd(2)>0.3&&doorDir!==2){ const gz=hz-B*0.55;
    quad(G,'glass', x1+0.12,gy0,gz, x1+0.12,gy0,gz+B*1.1, x1+0.12,gy1,gz+B*1.1, x1+0.12,gy1,gz, 0,0,1,1, 0.95); }
  /* the door is a separate swinging leaf, built in spawnVillage (closed by
     default) — see ex.houses[].door below */
  /* stepped roof with a one-block overhang, ridge along the longer axis */
  const alongX = w>=d;
  const steps = Math.ceil(((alongX?d:w)+2)/2);
  for(let i2=0;i2<steps;i2++){
    const ry0=y+wallH+i2*B*0.55, ry1=ry0+B*0.6;
    if(alongX){
      const rz0=z0-B+i2*B, rz1=z1+B-i2*B; if(rz1<=rz0) break;
      emitBox(G, x0-B,ry0,rz0, x1+B,ry1,rz1, 'roof','roof','roof');
    } else {
      const rx0=x0-B+i2*B, rx1=x1+B-i2*B; if(rx1<=rx0) break;
      emitBox(G, rx0,ry0,z0-B, rx1,ry1,z1+B, 'roof','roof','roof');
    }
  }
  emitFurniture(G, ex, x0,x1,z0,z1, y+B*0.58, T, hx,hz, doorDir);
  ex.torchIn.push({x:hx,y:y+B*0.58+B*2.05,z:hz});
  ex.doors.push({x:hx+(doorDir===2?w*B/2+B:doorDir===3?-w*B/2-B:0),
                 z:hz+(doorDir===0?d*B/2+B:doorDir===1?-d*B/2-B:0)});
  const gapCX = doorDir===2?x1-T/2:doorDir===3?x0+T/2:hx;
  const gapCZ = doorDir===0?z1-T/2:doorDir===1?z0+T/2:hz;
  const hingeX = (doorDir<=1)?hx-gw:gapCX;
  const hingeZ = (doorDir>=2)?hz-gw:gapCZ;
  const baseAng = (doorDir>=2)?-Math.PI/2:0;
  const swing = (doorDir===0||doorDir===3)?1.7:-1.7;   /* open outward */
  ex.houses.push({x0,x1,z0,z1, dx:gapCX, dz:gapCZ, gw,
    door:{dir:doorDir, hx:hingeX, hz:hingeZ, base:baseAng, y:y+B*0.05,
      w:gw*2.0, h:B*2.05, swing, open:false, ang:baseAng, target:baseAng}});
}
function emitFarm(G, fx,fz,y, seed){
  const w=B*5, d=B*3.4, x0=fx-w/2, x1=fx+w/2, z0=fz-d/2, z1=fz+d/2;
  /* log border */
  emitBox(G, x0,y,z0, x1,y+B*0.5,z0+B*0.5, 'logSide','logTop',null);
  emitBox(G, x0,y,z1-B*0.5, x1,y+B*0.5,z1, 'logSide','logTop',null);
  emitBox(G, x0,y,z0, x0+B*0.5,y+B*0.5,z1, 'logSide','logTop',null);
  emitBox(G, x1-B*0.5,y,z0, x1,y+B*0.5,z1, 'logSide','logTop',null);
  /* tilled soil + centre water channel + crops */
  faceTop(G,'soil', x0+B*0.5,z0+B*0.5, x1-B*0.5,z1-B*0.5, y+B*0.34, 0.95);
  faceTop(G,'waterB', fx-B*0.35,z0+B*0.5, fx+B*0.35,z1-B*0.5, y+B*0.38, 1.0);
  for(let cx=0;cx<4;cx++) for(let cz=0;cz<3;cz++){
    const px=x0+B*(1+cx), pz=z0+B*(1+cz*0.9);
    if(Math.abs(px-fx)<B*0.6) continue;
    cross(G,'crop',px,pz,y+B*0.36,B*0.8,B*0.7,0.95);
  }
}
function emitWell(G, wx,wz,y){
  emitBox(G, wx-B,y,wz-B, wx+B,y+B*0.8,wz+B, 'cobble','cobble',null);
  faceTop(G,'waterB', wx-B*0.6,wz-B*0.6, wx+B*0.6,wz+B*0.6, y+B*0.55, 0.9);
  for(const sx of [-1,1]) for(const sz of [-1,1])
    emitBox(G, wx+sx*B-B*0.18,y+B*0.8,wz+sz*B-B*0.18, wx+sx*B+B*0.18,y+B*2.4,wz+sz*B+B*0.18, 'logSide','logTop',null);
  emitBox(G, wx-B*1.3,y+B*2.4,wz-B*1.3, wx+B*1.3,y+B*2.9,wz+B*1.3, 'roof','roof','roof');
}
function emitHay(G, x,z,y){ emitBox(G, x-B*0.5,y,z-B*0.5, x+B*0.5,y+B,z+B*0.5, 'haySide','hayTop','haySide'); }
function emitPathCell(G, ix,iz){ const c=cell(ix,iz); if(!c||c.kind==='wall') return;
  faceTop(G,'path', ix*B+0.05, iz*B+0.05, (ix+1)*B-0.05, (iz+1)*B-0.05, c.h*B+0.06, 1.0); }
function emitPathLine(G, x0,z0, x1,z1){
  const steps=Math.ceil(Math.hypot(x1-x0,z1-z0)/(B*0.8));
  let last='';
  for(let s=0;s<=steps;s++){ const t=s/steps;
    const ix=Math.floor((x0+(x1-x0)*t)/B), iz=Math.floor((z0+(z1-z0)*t)/B);
    const k=ix+','+iz; if(k===last) continue; last=k; emitPathCell(G,ix,iz); }
}

function emitFencePost(G,x,z,y){ emitBox(G,x-0.45,y,z-0.45,x+0.45,y+B*1.15,z+0.45,'logSide','logTop',null); }
function emitFenceRail(G,x0,z0,x1,z1,y){
  if(Math.abs(x1-x0)<0.01) emitBox(G,x0-0.28,y+B*0.55,Math.min(z0,z1),x0+0.28,y+B*0.82,Math.max(z0,z1),'logSide','logSide',null);
  else emitBox(G,Math.min(x0,x1),y+B*0.55,z0-0.28,Math.max(x0,x1),y+B*0.82,z0+0.28,'logSide','logSide',null);
}
function emitPen(G,cx,cz,y,w,d){
  const x0=cx-w*B/2,x1=cx+w*B/2,z0=cz-d*B/2,z1=cz+d*B/2;
  for(const X of [x0,cx,x1]){ emitFencePost(G,X,z0,y); emitFencePost(G,X,z1,y); }
  emitFencePost(G,x0,cz,y); emitFencePost(G,x1,cz,y);
  emitFenceRail(G,x0,z0,x1,z0,y);
  emitFenceRail(G,x0,z1,cx-B*0.7,z1,y); emitFenceRail(G,cx+B*0.7,z1,x1,z1,y);
  emitFenceRail(G,x0,z0,x0,z1,y); emitFenceRail(G,x1,z0,x1,z1,y);
  emitHay(G,cx+B*0.4,cz-B*0.35,y);
}
function emitBench(G,x,z,y){ emitBox(G,x-B*0.5,y,z-B*0.5,x+B*0.5,y+B,z+B*0.5,'benchSide','benchTop',null); }
/* ================= CITY PIECES ================= */
/* a paved plaza of cobblestone */
function emitPlaza(G,cx,cz,y,rad){
  const r=Math.ceil(rad/B), ci=Math.floor(cx/B), cj=Math.floor(cz/B);
  for(let a=-r;a<=r;a++) for(let b2=-r;b2<=r;b2++){
    if(a*a+b2*b2>r*r) continue;
    const ix=ci+a, iz=cj+b2, c=cell(ix,iz); if(!c||c.kind==='wall'||c.kind==='floe') continue;
    faceTop(G,'cobble', ix*B+0.04, iz*B+0.04, (ix+1)*B-0.04,(iz+1)*B-0.04, c.h*B+0.06, 0.95);
  }
}
/* a market / fish stall — posts, a striped canopy, a counter, and goods */
function emitStall(G,x,z,y,kind){
  const w=B*1.15, d=B*0.95;
  emitBox(G, x-w,y,z-d, x+w,y+B*0.95,z+d, 'planks','benchTop',null);            // counter
  for(const sx of [-1,1]) for(const sz of [-1,1])
    emitBox(G, x+sx*w-0.22,y,z+sz*d-0.22, x+sx*w+0.22,y+B*2.7,z+sz*d+0.22,'logSide','logTop',null);
  const canopy = kind==='fish' ? 'wool' : 'haySide';
  emitBox(G, x-w-B*0.45,y+B*2.6,z-d-B*0.45, x+w+B*0.45,y+B*2.95,z+d+B*0.45, canopy,canopy,canopy);
  const goods = kind==='fish' ? ['waterB','glass','waterB'] : ['hayTop','flowerR','flowerY'];
  for(let k=0;k<3;k++){ const gx=x-w*0.6+k*w*0.6, gm=goods[k%goods.length];
    emitBox(G, gx-B*0.24,y+B*0.95,z-B*0.24, gx+B*0.24,y+B*1.3,z+B*0.24, gm,gm,gm); }
}
/* build a whole city on the country's site — streets, plaza, market, fish
   stall, and rows of homes (one per resident). Returns {homes, market, fish}. */
function buildCity(G,ex,site,wy,rnd,cfg,torches,solids,i){
  const cx=site.x, cz=site.z, sz2=cfg.size||2, nHomes=cfg.houses||14;
  emitPlaza(G, cx,cz, wy, B*(4.5+sz2));
  emitWell(G, cx,cz, wy); solids.push({x:cx,z:cz,r:B*1.7});
  const spacing=B*7, reach=B*(6+Math.ceil(nHomes/3));
  emitPathLine(G, cx-reach,cz, cx+reach,cz);            // the two main streets
  emitPathLine(G, cx,cz-reach, cx,cz+reach);
  const lots=[];
  for(let gy=-3;gy<=3;gy++) for(let gx=-3;gx<=3;gx++){
    if(Math.abs(gx)<=0&&Math.abs(gy)<=0) continue;
    lots.push([gx,gy,Math.abs(gx)+Math.abs(gy)+rnd(gx*7+gy)*0.3]); }
  lots.sort((a,b)=>a[2]-b[2]);
  const homes=[]; let placed=0;
  for(const lot of lots){ if(placed>=nHomes) break;
    const gx=lot[0], gy=lot[1];
    if(gx===0||gy===0) continue;                        // keep the streets clear
    const hx=cx+gx*spacing+(rnd(placed+1)-0.5)*B*1.5, hz=cz+gy*spacing+(rnd(placed+9)-0.5)*B*1.5;
    const hc=landAtWorld(hx,hz); if(!hc||hc.kind==='wall'||hc.kind==='floe') continue;
    const w=5+Math.floor(rnd(placed+20)*3), d=6+Math.floor(rnd(placed+25)*3);
    const ddx=cx-hx, ddz=cz-hz;
    const doorDir=Math.abs(ddz)>=Math.abs(ddx)?(ddz>0?0:1):(ddx>0?2:3);
    emitHouse(G,ex, hx,hz,hc.h*B, w,d, doorDir, i*100+placed);
    const H=ex.houses[ex.houses.length-1];
    emitPathLine(G, H.dx,H.dz, cx+gx*spacing, cz);      // a lane to the street
    emitPathLine(G, cx+gx*spacing, cz, cx+gx*spacing, cz+gy*spacing);
    homes.push({x:hx,z:hz,doorx:H.dx,doorz:H.dz}); placed++;
  }
  /* the market — a row of stalls along the eastern street */
  let market=null;
  if(cfg.market!==false){ market={x:cx+B*4,z:cz};
    for(let k=0;k<3+sz2;k++){ const sx=cx+B*(3+k*2.6), sz=cz+B*2.3;
      const c=landAtWorld(sx,sz); if(!c||c.kind==='wall') continue;
      emitStall(G,sx,sz,c.h*B,'market'); solids.push({x:sx,z:sz,r:B*1.2});
      ex.stalls.push({x:sx,z:sz}); } }
  /* extra wells of water */
  for(let w2=1;w2<(cfg.wells||1);w2++){ const a=rnd(w2+70)*6.28, rr=B*(6+w2*3);
    const wx=cx+Math.cos(a)*rr, wz=cz+Math.sin(a)*rr, c=landAtWorld(wx,wz);
    if(c&&c.kind!=='wall'){ emitWell(G,wx,wz,c.h*B); solids.push({x:wx,z:wz,r:B*1.7}); } }
  /* lamp posts along the streets */
  for(let t=-3;t<=3;t++){ if(!t) continue;
    for(const p of [[cx+t*spacing*0.5,cz],[cx,cz+t*spacing*0.5]]){
      const c=landAtWorld(p[0],p[1]); if(!c||c.kind==='wall') continue;
      emitBox(G,p[0]-0.5,c.h*B,p[1]-0.5,p[0]+0.5,c.h*B+B*1.9,p[1]+0.5,'logSide','logTop',null);
      torches.push({x:p[0],y:c.h*B+B*1.9,z:p[1]}); } }
  return {homes,market};
}
const deckMap=new Map();
function buildPier(G,ex,site,rnd,torches){
  let best=null;
  for(let a=0;a<16;a++){ const th=(a/16)*Math.PI*2;
    const dx=Math.cos(th), dz=Math.sin(th);
    for(let t=3;t<=40;t++){ const x=site.x+dx*t*B, z=site.z+dz*t*B;
      const c=cell(Math.floor(x/B),Math.floor(z/B));
      if(!c){ const r=Math.hypot(x,z)/R_WORLD;
        if(r<SHELF_UV&&(!best||t<best.t)) best={dx,dz,t};
        break; }
      if(c.kind==='wall'||c.kind==='floe') break;
    } }
  if(!best||best.t>34) return null;
  const dx=best.dx, dz=best.dz, t=best.t;
  const shoreX=site.x+dx*(t-1)*B, shoreZ=site.z+dz*(t-1)*B;
  const yD=WATER_Y+2.8, deckKeys=[]; let lastX=shoreX, lastZ=shoreZ;
  const len=7+Math.floor(rnd(120)*4);
  for(let s2=0;s2<len;s2++){ const x=site.x+dx*(t+s2)*B, z=site.z+dz*(t+s2)*B;
    const ix=Math.floor(x/B), iz=Math.floor(z/B);
    if(cell(ix,iz)) continue;
    const r=Math.hypot(x,z)/R_WORLD; if(r>=SHELF_UV) break;
    const key=ix+','+iz; if(deckMap.has(key)) continue;
    const x0=ix*B, z0=iz*B;
    faceTop(G,'planks',x0+0.2,z0+0.2,x0+B-0.2,z0+B-0.2,yD,1.0);
    faceBottom(G,'planks',x0+0.2,z0+0.2,x0+B-0.2,z0+B-0.2,yD-0.5,0.5);
    facePX(G,'planks',x0+B-0.2,z0+0.2,z0+B-0.2,yD-0.5,yD,0.62);
    faceNX(G,'planks',x0+0.2,z0+0.2,z0+B-0.2,yD-0.5,yD,0.62);
    facePZ(G,'planks',z0+B-0.2,x0+0.2,x0+B-0.2,yD-0.5,yD,0.8);
    faceNZ(G,'planks',z0+0.2,x0+0.2,x0+B-0.2,yD-0.5,yD,0.8);
    if(s2%2===0){
      emitBox(G,x0+0.6,-2,z0+0.6,x0+1.5,yD-0.1,z0+1.5,'logSide','logTop',null);
      emitBox(G,x0+B-1.5,-2,z0+B-1.5,x0+B-0.6,yD-0.1,z0+B-0.6,'logSide','logTop',null);
    }
    deckMap.set(key,yD); deckKeys.push(key);
    lastX=x0+B/2; lastZ=z0+B/2;
  }
  if(!deckKeys.length) return null;
  emitBox(G,lastX-0.5,yD,lastZ-0.5,lastX+0.5,yD+B*1.4,lastZ+0.5,'logSide','logTop',null);
  torches.push({x:lastX,y:yD+B*1.4,z:lastZ});
  emitPathLine(G,site.x,site.z,shoreX,shoreZ);
  ex.pier={x:lastX,z:lastZ};
  return deckKeys;
}
const activeVillages=new Map();
let worldNight=0;   /* 0 by day .. 1 deep night — sends folk home */
const standaloneHouses=[];   /* houses not in a village (the player's treehouse) */
function spawnVillage(i){
  const site=SITES[i]; if(!site){ activeVillages.set(i,{none:true}); return; }
  const rnd=k=>hash2(i*31.7+k*7.7, i*11.3+k*3.9);
  const G=newG(); const ex={doors:[],houses:[],torchIn:[],farms:[],stalls:[],pen:null};
  const wy=topY(site.ix,site.iz);
  const cfg=cityFor(i);                 /* a great city here, or a small village? */
  const torches=[]; const solids=[];
  let cityHomes=null;
  if(cfg){
    const ci=buildCity(G,ex,site,wy,rnd,cfg,torches,solids,i);
    cityHomes=ci.homes;
    /* a fenced pen for the beasts on the outskirts */
    { const a=rnd(130)*6.28, rr=B*(9+(cfg.size||2)*2);
      const px2=site.x+Math.cos(a)*rr, pz2=site.z+Math.sin(a)*rr, pc=landAtWorld(px2,pz2);
      if(pc&&pc.kind!=='wall'&&pc.kind!=='floe'){ emitPen(G,px2,pz2,pc.h*B,5,4);
        emitPathLine(G,site.x,site.z,px2,pz2); ex.pen={x:px2,z:pz2}; } }
  } else {
    /* --- a village proper: a broad ring of homes about the well and square --- */
    const nH=6+Math.floor(rnd(1)*4);
    for(let h=0;h<nH;h++){
      const ang=(h/nH+rnd(h+2)*0.35)*Math.PI*2, rad=(4.5+rnd(h+9)*5.5)*B;
      const hx=site.x+Math.cos(ang)*rad, hz=site.z+Math.sin(ang)*rad;
      const hc=landAtWorld(hx,hz); if(!hc||hc.kind==='wall'||hc.kind==='floe') continue;
      const w=5+Math.floor(rnd(h+20)*3), d=5+Math.floor(rnd(h+25)*3);
      const dx=site.x-hx, dz=site.z-hz;
      const doorDir=Math.abs(dz)>=Math.abs(dx) ? (dz>0?0:1) : (dx>0?2:3);
      emitHouse(G,ex, hx,hz,hc.h*B, w,d, doorDir, i*100+h);
    }
    emitWell(G, site.x, site.z, wy); solids.push({x:site.x,z:site.z,r:B*1.5});
    for(const dr of ex.doors) emitPathLine(G, site.x,site.z, dr.x,dr.z);
    const nF=2+(rnd(40)>0.55?1:0);
    for(let f=0;f<nF;f++){
      const ang=rnd(f+44)*Math.PI*2, rad=(7+rnd(f+48)*4)*B;
      const fx=site.x+Math.cos(ang)*rad, fz=site.z+Math.sin(ang)*rad;
      const fc=landAtWorld(fx,fz); if(!fc||fc.kind==='wall') continue;
      emitFarm(G, fx,fz, fc.h*B, i*100+f); emitPathLine(G, site.x,site.z, fx,fz);
      ex.farms.push({x:fx,z:fz});
    }
    /* a market stall or two upon the square — folk selling their goods */
    for(let s=0;s<1+(rnd(46)>0.5?1:0);s++){
      const sx=site.x+B*(2.6+s*3.1), sz=site.z+B*(2.4-s*4.6);
      const sc=landAtWorld(sx,sz); if(!sc||sc.kind==='wall') continue;
      emitStall(G,sx,sz,sc.h*B, s?'fish':'market'); solids.push({x:sx,z:sz,r:B*1.2});
      ex.stalls.push({x:sx,z:sz});
    }
    for(let hb=0; hb<2+Math.floor(rnd(52)*3); hb++){
      const ang=rnd(hb+54)*Math.PI*2, rad=(3+rnd(hb+58)*6)*B;
      const x=site.x+Math.cos(ang)*rad, z=site.z+Math.sin(ang)*rad;
      const c2=landAtWorld(x,z); if(!c2||c2.kind==='wall') continue;
      emitHay(G,x,z,c2.h*B);
    }
    { const ang=rnd(130)*Math.PI*2, rad=(6+rnd(133)*3)*B;
      const px2=site.x+Math.cos(ang)*rad, pz2=site.z+Math.sin(ang)*rad;
      const pc=landAtWorld(px2,pz2);
      if(pc&&pc.kind!=='wall'&&pc.kind!=='floe'){ emitPen(G,px2,pz2,pc.h*B,4,3);
        emitPathLine(G,site.x,site.z,px2,pz2); ex.pen={x:px2,z:pz2}; } }
    { const bx=site.x+B*1.9, bz=site.z-B*1.4; const bc=landAtWorld(bx,bz);
      if(bc&&bc.kind!=='wall') emitBench(G,bx,bz,bc.h*B); }
    for(let t=0;t<4;t++){ const ang=rnd(t+62)*Math.PI*2, rad=(2.5+rnd(t+66)*5)*B;
      const tx=site.x+Math.cos(ang)*rad, tz=site.z+Math.sin(ang)*rad;
      const tc2=landAtWorld(tx,tz); if(!tc2||tc2.kind==='wall') continue;
      emitBox(G, tx-0.5,tc2.h*B,tz-0.5, tx+0.5,tc2.h*B+B*1.6,tz+0.5, 'logSide','logTop',null);
      torches.push({x:tx,y:tc2.h*B+B*1.6,z:tz});
    }
  }
  torches.push(...ex.torchIn);          /* the hearth-lights within the houses */
  /* the pier, if the sea lies near */
  const deckKeys=buildPier(G,ex,site,rnd,torches)||[];
  /* a fishmonger's stall by the pier, in the great cities */
  if(cfg&&cfg.fishStall!==false&&ex.pier){
    const fx=ex.pier.x, fz=ex.pier.z, fc=landAtWorld(fx-B,fz);
    let px3=fx,pz3=fz;
    for(let rr=1;rr<8;rr++){ const c=landAtWorld(fx+Math.cos(rr)*rr*B, fz+Math.sin(rr)*rr*B);
      if(c&&c.kind!=='wall'){ px3=fx+Math.cos(rr)*rr*B; pz3=fz+Math.sin(rr)*rr*B; break; } }
    const c=landAtWorld(px3,pz3); if(c&&c.kind!=='wall'){ emitStall(G,px3,pz3,c.h*B,'fish');
      solids.push({x:px3,z:pz3,r:B*1.2}); ex.stalls.push({x:px3,z:pz3}); }
  }
  /* build the merged meshes */
  const g=new THREE.Group();
  for(const mat in G){ const gg=G[mat];
    const bg=new THREE.BufferGeometry();
    bg.setAttribute('position',new THREE.Float32BufferAttribute(gg.p,3));
    bg.setAttribute('uv',new THREE.Float32BufferAttribute(gg.uv,2));
    bg.setAttribute('color',new THREE.Float32BufferAttribute(gg.c,3));
    bg.setIndex(gg.i); g.add(new THREE.Mesh(bg,MAT[mat])); }
  /* the doors — each house a swinging leaf, closed to begin */
  for(const H of ex.houses){ if(!H.door) continue; const D2=H.door;
    const dm=new THREE.Mesh(new THREE.BoxGeometry(D2.w,D2.h,0.6),doorLeafMat);
    dm.geometry.translate(D2.w/2,D2.h/2,0);
    dm.position.set(D2.hx,D2.y,D2.hz); dm.rotation.y=D2.base;
    g.add(dm); D2.mesh=dm; }
  /* torch tips + night glow */
  const torchMats=[];
  for(const tp of torches){
    const tip=new THREE.Mesh(new THREE.BoxGeometry(1.4,1.7,1.4),torchMat);
    tip.position.set(tp.x,tp.y+0.9,tp.z); g.add(tip);
    const gm2=new THREE.SpriteMaterial({map:glowTexCv,transparent:true,opacity:0,depthWrite:false});
    const gs=new THREE.Sprite(gm2); gs.scale.set(26,26,1);
    gs.position.set(tp.x,tp.y+2,tp.z); g.add(gs); torchMats.push(gm2);
  }
  /* ============== THE PEOPLE OF THE LAND, EACH AT THEIR LABOUR ==============
     Every soul carries a real task with waypoints — tilling, drawing water,
     feeding the fowl, herding, hunting, selling, buying, fishing, playing —
     walks its rounds by day, and goes home to its own hearth at dusk. */
  const people=[]; const cx=site.x, cz=site.z;
  let homeIdx=0;
  const nextHome=()=>{ if(!ex.houses.length) return null;
    const H=ex.houses[homeIdx++%ex.houses.length];
    return {x:(H.x0+H.x1)/2,z:(H.z0+H.z1)/2}; };
  const addPerson=(role,hx,hz,roamR,child,female,data)=>{
    const seed=i*1000+people.length*7;
    const cc=landAtWorld(hx,hz), onDk=deckMap.get(Math.floor(hx/B)+','+Math.floor(hz/B))!==undefined;
    if((!cc||cc.kind==='wall')&&!onDk){ hx=cx; hz=cz; }
    /* never leave a soul embedded in a wall: nudge into the room, or out to the square */
    for(const H of ex.houses){ if(houseBlocks(hx,hz,H)){
      if(hx>H.x0&&hx<H.x1&&hz>H.z0&&hz<H.z1){ hx=(H.x0+H.x1)/2; hz=(H.z0+H.z1)/2; } else { hx=cx; hz=cz; } break; } }
    const per=makePerson(seed,role,child,female);
    per.position.set(hx,topY(Math.floor(hx/B),Math.floor(hz/B)),hz); g.add(per);
    const ent=Object.assign({m:per,role,hx,hz,roamR:roamR||3,tx:hx,tz:hz,t:hash2(seed,7)*4,
      pt:0,acting:false,seed,child:!!child,female:!!female,home:nextHome(),
      name:personName(seed,female)},data||{});
    people.push(ent); return ent; };
  /* the teacher, and the children who gather for the lesson and play at tag */
  const lx=cx+Math.cos(rnd(200)*6.28)*B*3.5, lz=cz+Math.sin(rnd(200)*6.28)*B*3.5;
  addPerson('teacher',lx,lz,1.0,false,false,{faceX:lx,faceZ:lz+B,post:{x:lx,z:lz}});
  const kids=[];
  for(let k=0;k<4;k++){ const ca=k/4*Math.PI*2;
    kids.push(addPerson('child',lx+Math.cos(ca)*B*1.3,lz+B*0.6+Math.sin(ca)*B*1.0,4,true,k%2===1,
      {teach:{x:lx,z:lz}})); }
  for(let k=0;k<kids.length;k++) kids[k].mate=kids[(k+1)%kids.length];
  if(kids.length) kids[0].it=true;
  /* herdsman, hunter, a farmer for every field, the woman at the well, the
     feeder of the fowl, and folk who walk about or go to the market */
  addPerson('herder',cx-B*5,cz-B*3,4,false,false,{pen:ex.pen||{x:cx,z:cz}});
  addPerson('hunter',cx+B*6.5,cz-B*6.5,10,false,false,{post:{x:cx,z:cz}});
  for(const f of ex.farms) addPerson('farmer',f.x,f.z,3,false,rnd(f.x)>0.6,{farm:f});
  if(!ex.farms.length) addPerson('farmer',cx+B*6,cz+B*3,3,false,false,{farm:{x:cx+B*6,z:cz+B*3}});
  addPerson('water',cx+B*2,cz-B*2,2,false,true,{well:{x:cx,z:cz}});
  addPerson('water',cx-B*2,cz+B*2.5,2,false,true,{well:{x:cx,z:cz}});
  if(ex.pen) addPerson('feeder',ex.pen.x+B,ex.pen.z+B,3,false,true,{pen:ex.pen});
  for(const s of ex.stalls) addPerson('vendor',s.x,s.z-B*1.6,1,false,rnd(s.x)>0.5,{stall:s});
  if(ex.pier) addPerson('fisher',ex.pier.x,ex.pier.z,1,false,false,{spot:{x:ex.pier.x,z:ex.pier.z}});
  const nFolk=2+Math.floor(rnd(70)*3);
  for(let p=0;p<nFolk;p++)
    addPerson(ex.stalls.length&&p%2?'shopper':'folk',
      cx+(rnd(p+30)-0.5)*B*5,cz+(rnd(p+40)-0.5)*B*5,4,false,rnd(p+31)>0.5);
  /* a great city: a resident in every home besides */
  if(cityHomes&&cityHomes.length){
    for(let h=0;h<cityHomes.length;h++){ const hm=cityHomes[h];
      addPerson(h%3===0?'shopper':'folk', hm.x, hm.z, 2.4, false, h%2===0,
        {home:{x:hm.x,z:hm.z}}); }
  }
  /* the beasts of the field, the creeping things — and now and then a wolf
     out of the wilds, come down to hunt the pigs and the fowl */
  const lat=90-Math.hypot(site.x/R_WORLD,site.z/R_WORLD)*180;
  const baseKind=(cellRaw(site.ix,site.iz)||{kind:'grass'}).kind;
  const roster = baseKind==='desert' ? ['camel','camel','goat','lizard','lizard','chicken']
    : baseKind==='rock' ? ['goat','goat','hare','lizard','chicken']
    : lat>55 ? ['sheep','sheep','goat','hare','chicken']
    : ['sheep','cow','pig','goat','chicken','chicken','hare','hare'];
  const beasts=[]; const nA=6+Math.floor(rnd(91)*4);
  const hx0=ex.pen?ex.pen.x:cx, hz0=ex.pen?ex.pen.z:cz;
  for(let a2=0;a2<nA;a2++){ const kind=roster[Math.floor(rnd(a2+95)*roster.length)]||'sheep';
    const an=makeAnimal(kind);
    const bx=(a2%2?hx0:cx)-B+(rnd(a2)-0.5)*B*6, bz=(a2%2?hz0:cz)-B+(rnd(a2+5)-0.5)*B*6;
    an.position.set(bx,wy,bz); g.add(an);
    beasts.push({m:an,kind,hx:bx,hz:bz,tx:bx,tz:bz,t:rnd(a2+97)*4,seed:i*100+50+a2,
      roamR:(kind==='hare'||kind==='lizard')?6:4}); }
  if(baseKind!=='desert'&&rnd(303)>0.45){        /* the wolf come down from the hills */
    const wa=rnd(305)*6.28, an=makeAnimal('wolf');
    const bx=cx+Math.cos(wa)*B*13, bz=cz+Math.sin(wa)*B*13;
    an.position.set(bx,wy,bz); g.add(an);
    beasts.push({m:an,kind:'wolf',hx:bx,hz:bz,tx:bx,tz:bz,t:2,seed:i*100+99,roamR:10,cool:6}); }
  /* birds of the air, wheeling above the land */
  const birds=[]; const nBirds=4+Math.floor(rnd(88)*4);
  for(let b2=0;b2<nBirds;b2++){ const bd=makeBird();
    const ph=rnd(b2+120)*6.28, rad=(6+rnd(b2+124)*10)*B, h2=wy+40+rnd(b2+128)*30;
    bd.position.set(cx+Math.cos(ph)*rad,h2,cz+Math.sin(ph)*rad); g.add(bd);
    birds.push({m:bd,ph,rad,h:h2,spd:0.2+rnd(b2+132)*0.25,cx,cz}); }
  scene.add(g);
  activeVillages.set(i,{g,site,people,beasts,birds,torchMats,deckKeys,houses:ex.houses,solids,
    farms:ex.farms,stalls:ex.stalls,pen:ex.pen,pier:ex.pier,feedT:-99});
}
/* =================== THE LABOURS OF THE PEOPLE ===================
   A little task engine. moveEnt walks a body toward its mark with
   collision and striding legs; nextTask gives each role its next
   waypoint and the work to do there; personTick runs walk → work →
   next; beastTick gives the beasts their fears, their hungers and
   their herding. */
function moveEnt(ent,dt,sp){
  const dx=ent.tx-ent.m.position.x, dz=ent.tz-ent.m.position.z;
  const d=Math.hypot(dx,dz); let moving=d>0.6;
  if(moving){ const nx=ent.m.position.x+dx/d*sp*dt, nz=ent.m.position.z+dz/d*sp*dt;
    const hitPlayer=state.mode==='walk'&&Math.hypot(nx-state.walk.x,nz-state.walk.z)<2.6;
    const gN=groundInfo(nx,nz);
    if(!gN.land||blockedByStructureNPC(nx,nz)||blockedBySolid(nx,nz)||blockedByEntity(nx,nz,ent.m)||hitPlayer){
      moving=false; ent.t=0; ent.stuck=(ent.stuck||0)+1;
      if(ent.stuck>2){ ent.stuck=0; ent.acting=false; ent.pt=0; ent.tx=ent.m.position.x; ent.tz=ent.m.position.z; } }
    else { ent.stuck=0; ent.m.position.x=nx; ent.m.position.z=nz; ent.m.rotation.y=Math.atan2(dx,dz); } }
  const gHere=groundInfo(ent.m.position.x,ent.m.position.z);
  ent.m.position.y=gHere.land?gHere.y:WATER_Y;
  const legs=ent.m.userData.legs;
  if(legs&&legs.length){ const ph=performance.now()*(ent.panic?0.02:0.012);
    for(const L of legs) L.rotation.x=moving?Math.sin(ph+(L.userData.ph||0))*(ent.panic?0.85:0.55):0; }
  else if(moving) ent.m.position.y+=Math.abs(Math.sin(performance.now()*.012))*0.35;
  return moving;
}
/* folk may pass through their own doorways even when the leaf is shut */
function houseBlocksNPC(nx,nz,H){
  const m2=1.2;
  if(nx>H.x0-m2&&nx<H.x1+m2&&nz>H.z0-m2&&nz<H.z1+m2){
    const T2=B*0.5+1.0;
    if(nx>H.x0+T2&&nx<H.x1-T2&&nz>H.z0+T2&&nz<H.z1-T2) return false;
    if(H.door&&Math.hypot(nx-H.dx,nz-H.dz)<H.gw+1.8) return false;
    return true;
  }
  return false;
}
function blockedByStructureNPC(nx,nz){
  for(const[,vv] of activeVillages){ if(!vv.houses||!vv.site) continue;
    if(Math.hypot(nx-vv.site.x,nz-vv.site.z)>420) continue;
    for(const H of vv.houses) if(houseBlocksNPC(nx,nz,H)) return true; }
  for(const H of standaloneHouses) if(houseBlocksNPC(nx,nz,H)) return true;
  return false;
}
function wanderTick(ent,site,dt,speed){
  const ax=ent.hx!==undefined?ent.hx:site.x, az=ent.hz!==undefined?ent.hz:site.z;
  const roamR=ent.roamR||4.6;
  ent.t-=dt;
  if(ent.t<=0){
    ent.t=(ent.role==='teacher'||ent.role==='child'?3.5:2)
      +hash2(ent.seed,(performance.now()%9973)*0.13)*(ent.role==='hunter'?7:5);
    let nx,nz;
    if((worldNight>0.55||ent._shelter)&&ent.home){    /* at dusk or in storm, go home — to the room, not the doorway */
      nx=(ent.home.x!==undefined?ent.home.x:ent.home.doorx)+(Math.random()-0.5)*2;
      nz=(ent.home.z!==undefined?ent.home.z:ent.home.doorz)+(Math.random()-0.5)*2;
    } else { const a=Math.random()*Math.PI*2, r=Math.random()*roamR*B;
      nx=ax+Math.cos(a)*r; nz=az+Math.sin(a)*r; }
    const cc=landAtWorld(nx,nz); if(cc&&cc.kind!=='wall'){ ent.tx=nx; ent.tz=nz; } }
  const moving=moveEnt(ent,dt,speed*(ent.child?0.7:1));
  if(!moving){
    if(state.mode==='walk'&&Math.hypot(state.walk.x-ent.m.position.x,state.walk.z-ent.m.position.z)<9)
      ent.m.rotation.y=Math.atan2(state.walk.x-ent.m.position.x,state.walk.z-ent.m.position.z);
    else if(ent.faceX!==undefined)
      ent.m.rotation.y=Math.atan2(ent.faceX-ent.m.position.x, ent.faceZ-ent.m.position.z);
  }
  return moving;
}
function nextTask(ent,vv){
  const site=vv.site, R=Math.random;
  switch(ent.role){
    case 'farmer': { const f=ent.farm||site;
      ent.tx=f.x+(R()-0.5)*B*3.4; ent.tz=f.z+(R()-0.5)*B*2.2; ent.actT=2.5+R()*3.5; ent.anim='work'; break; }
    case 'water': {                                  /* well → home → well, jar on the head */
      if(ent.leg==='well'&&ent.home){ ent.leg='home'; ent.tx=ent.home.x+(R()-0.5)*2; ent.tz=ent.home.z+(R()-0.5)*2; ent.actT=2+R()*2; ent.anim='idle'; }
      else { ent.leg='well'; const w2=ent.well||site;
        ent.tx=w2.x+(R()-0.5)*B*2.6; ent.tz=w2.z+(R()-0.5)*B*2.6; ent.actT=2.5+R()*2; ent.anim='fill'; }
      break; }
    case 'feeder': { const p2=ent.pen||site;
      ent.tx=p2.x+(R()-0.5)*B*3.4; ent.tz=p2.z+(R()-0.5)*B*3.4; ent.actT=4+R()*3; ent.anim='feed'; break; }
    case 'vendor': { const s=ent.stall||site;
      ent.tx=s.x+(R()-0.5)*1.4; ent.tz=s.z-B*1.5; ent.actT=6+R()*5; ent.anim='hawk';
      ent.faceX=s.x; ent.faceZ=s.z+B*4; break; }
    case 'fisher': { const s=ent.spot||site;
      ent.tx=s.x; ent.tz=s.z; ent.actT=9+R()*7; ent.anim='fish';
      const rr2=Math.hypot(s.x,s.z)||1;             /* face outward, toward the open sea */
      ent.faceX=s.x+s.x/rr2*20; ent.faceZ=s.z+s.z/rr2*20; break; }
    case 'shopper': {
      const st=(vv.stalls&&vv.stalls.length)?vv.stalls[Math.floor(R()*vv.stalls.length)]:null;
      if(st&&ent.leg!=='stall'){ ent.leg='stall'; ent.tx=st.x+(R()-0.5)*3; ent.tz=st.z-B*1.9;
        ent.actT=3+R()*3; ent.anim='idle'; ent.faceX=st.x; ent.faceZ=st.z; }
      else if(ent.home&&ent.leg!=='home'&&R()<0.4){ ent.leg='home'; ent.tx=ent.home.x; ent.tz=ent.home.z; ent.actT=2+R()*3; ent.anim='idle'; }
      else { ent.leg='about'; const a=R()*6.28, r2=R()*(ent.roamR||4)*B;
        ent.tx=site.x+Math.cos(a)*r2; ent.tz=site.z+Math.sin(a)*r2; ent.actT=1.5+R()*2.5; ent.anim='idle'; }
      break; }
    case 'herder': { const pen=ent.pen||site;
      let stray=null,bd=0;
      for(const b of vv.beasts||[]){ if(b.kind!=='sheep'&&b.kind!=='goat'&&b.kind!=='cow') continue;
        const d2=Math.hypot(b.m.position.x-pen.x,b.m.position.z-pen.z);
        if(d2>bd){ bd=d2; stray=b; } }
      if(stray&&bd>B*7){ ent.drive=stray; ent.tx=stray.m.position.x; ent.tz=stray.m.position.z; ent.actT=0.7; ent.anim='idle'; }
      else { ent.drive=null; ent.tx=pen.x+(R()-0.5)*B*5; ent.tz=pen.z+(R()-0.5)*B*5; ent.actT=2.5+R()*3; ent.anim='idle'; }
      break; }
    case 'hunter': {
      let prey=null,bd2=1e9;
      for(const b of vv.beasts||[]){ if(b.kind!=='hare'&&b.kind!=='deer') continue;
        const d2=Math.hypot(b.m.position.x-ent.m.position.x,b.m.position.z-ent.m.position.z);
        if(d2<bd2){ bd2=d2; prey=b; } }
      if(prey&&bd2<B*12){ ent.stalk=prey; ent.tx=prey.m.position.x; ent.tz=prey.m.position.z; ent.actT=0.6; ent.anim='idle'; }
      else { ent.stalk=null; const a=R()*6.28, r2=(9+R()*6)*B;    /* patrol the outskirts */
        ent.tx=site.x+Math.cos(a)*r2; ent.tz=site.z+Math.sin(a)*r2; ent.actT=2+R()*4; ent.anim='idle'; }
      break; }
    case 'child': {
      const hour=state.simHours%24;
      if(hour>=8&&hour<13&&ent.teach){                /* the morning lesson */
        ent.tx=ent.teach.x+(R()-0.5)*B*2.4; ent.tz=ent.teach.z+B*0.7+(R()-0.5)*B*1.8;
        ent.actT=4+R()*3; ent.anim='sit'; ent.faceX=ent.teach.x; ent.faceZ=ent.teach.z; }
      else { ent.anim='play'; ent.actT=0.35; }        /* tag about the square (retargeted live) */
      break; }
    case 'teacher': { const p2=ent.post||site;
      ent.tx=p2.x+(R()-0.5)*2; ent.tz=p2.z+(R()-0.5)*2; ent.actT=5+R()*4; ent.anim='teach'; break; }
    default: { const a=R()*6.28, r2=R()*(ent.roamR||4)*B;
      ent.tx=site.x+Math.cos(a)*r2; ent.tz=site.z+Math.sin(a)*r2; ent.actT=1.5+R()*3; ent.anim='idle'; }
  }
}
function personTick(ent,vv,dt){
  const site=vv.site, u=ent.m.userData, tnow=performance.now()*0.001;
  ent._shelter=(vv.stormF||0)>0.35;                 /* in foul weather, folk keep indoors */
  if((worldNight>0.55||ent._shelter)&&ent.home){ wanderTick(ent,site,dt,ent._shelter?8.5:7); return; }
  if(ent.role==='folk'||!ent.role){ wanderTick(ent,site,dt,7); return; }
  if(ent.actT===undefined) nextTask(ent,vv);
  const px=ent.m.position.x, pz=ent.m.position.z;
  /* live re-aiming for the chasers */
  if(ent.role==='herder'&&ent.drive){ const s=ent.drive;
    ent.tx=s.m.position.x; ent.tz=s.m.position.z;
    if(Math.hypot(px-s.m.position.x,pz-s.m.position.z)<7){ s.driven=true; }       /* drive it penward */
    if(ent.pen&&Math.hypot(s.m.position.x-ent.pen.x,s.m.position.z-ent.pen.z)<B*4){ ent.drive=null; nextTask(ent,vv); } }
  if(ent.role==='hunter'&&ent.stalk){ const s=ent.stalk;
    ent.tx=s.m.position.x; ent.tz=s.m.position.z;
    if(Math.hypot(px-s.m.position.x,pz-s.m.position.z)<5){ s.spooked=tnow; ent.stalk=null; nextTask(ent,vv); } }
  if(ent.role==='child'&&ent.anim==='play'&&ent.mate&&ent.mate.m){
    const mx=ent.mate.m.position.x, mz=ent.mate.m.position.z;
    if(ent.it){ ent.tx=mx; ent.tz=mz;
      if(Math.hypot(px-mx,pz-mz)<2.2){ ent.it=false; ent.mate.it=true; ent.hop=0.5; ent.mate.hop=0.5; } }
    else { const dd=Math.hypot(px-mx,pz-mz)||1;
      let axp=px+(px-mx)/dd*12, azp=pz+(pz-mz)/dd*12;
      const sd=Math.hypot(axp-site.x,azp-site.z);
      if(sd>B*6){ axp=site.x+(axp-site.x)/sd*B*5.4; azp=site.z+(azp-site.z)/sd*B*5.4; }
      ent.tx=axp; ent.tz=azp; } }
  const d=Math.hypot(ent.tx-px,ent.tz-pz);
  if(d>2.2){
    ent.acting=false;
    const sp=ent.role==='child'?(ent.anim==='play'?8.5:5):ent.role==='hunter'?(ent.stalk?4.5:8):ent.role==='water'?6:7;
    moveEnt(ent,dt,sp);
  } else {
    if(!ent.acting){ ent.acting=true; ent.pt=ent.actT||2; }
    ent.pt-=dt;
    /* face the work — or a traveller come close to speak */
    if(state.mode==='walk'&&Math.hypot(state.walk.x-px,state.walk.z-pz)<9)
      ent.m.rotation.y=Math.atan2(state.walk.x-px,state.walk.z-pz);
    else if(ent.faceX!==undefined)
      ent.m.rotation.y=Math.atan2(ent.faceX-px,ent.faceZ-pz);
    /* the work of the hands */
    const A=ent.anim;
    if(A==='work'){ u.armR.rotation.x=-0.8+Math.sin(tnow*6.5)*0.75; u.armL.rotation.x=-0.4+Math.sin(tnow*6.5+0.5)*0.45;
      u.legs[0].rotation.x=0.06; u.legs[1].rotation.x=-0.06; }
    else if(A==='fill'){ u.armL.rotation.x=-0.95; u.armR.rotation.x=-0.95; }
    else if(A==='feed'){ u.armR.rotation.x=-0.7+Math.sin(tnow*5)*0.6; vv.feedT=tnow; vv.feedX=px; vv.feedZ=pz; }
    else if(A==='hawk'){ u.armR.rotation.x=-1.35+Math.sin(tnow*2.4)*0.22; u.armL.rotation.x=-0.2; }
    else if(A==='teach'){ u.armR.rotation.x=-1.0+Math.sin(tnow*1.7)*0.35; }
    else if(A==='fish'&&u.rod){ u.rod.rotation.x=1.05+Math.sin(tnow*1.7)*0.05;
      u.armR.rotation.x=-0.85; u.armL.rotation.x=-0.7;
      if(Math.random()<dt*0.08){ u.rod.rotation.x=0.7; splash(px+Math.sin(ent.m.rotation.y)*7,WATER_Y+1,pz+Math.cos(ent.m.rotation.y)*7,false); } }
    else { u.armR.rotation.x=0; u.armL.rotation.x=0; }
    if(ent.pt<=0){ ent.acting=false; nextTask(ent,vv); }
  }
  if(ent.hop!==undefined&&ent.hop>0){ ent.hop-=dt; ent.m.position.y+=Math.sin(Math.max(0,ent.hop)*6.28)*1.6; }
}
const BEAST_PREY=new Set(['sheep','goat','pig','chicken','hare','deer','donkey']);
const WOLF_PREY=new Set(['pig','sheep','chicken','hare','goat']);
function beastTick(ent,vv,dt){
  const m=ent.m, px=m.position.x, pz=m.position.z, tnow=performance.now()*0.001;
  ent.t-=dt; ent.panic=false;
  let sp=4.5;
  if(ent.kind==='wolf'){
    ent.cool=(ent.cool||0)-dt;
    /* the shepherd and the hunter drive the wolf off */
    let guard=null;
    for(const p of vv.people){ if(p.role!=='herder'&&p.role!=='hunter') continue;
      if(Math.hypot(p.m.position.x-px,p.m.position.z-pz)<11){ guard=p; break; } }
    if(guard){ ent.hunt=null; ent.cool=Math.max(ent.cool,9); ent.panic=true; sp=10;
      const dd=Math.hypot(px-guard.m.position.x,pz-guard.m.position.z)||1;
      ent.tx=px+(px-guard.m.position.x)/dd*30; ent.tz=pz+(pz-guard.m.position.z)/dd*30; }
    else if(ent.cool<=0){
      if(!ent.hunt||!ent.hunt.m.visible||Math.random()<dt*0.05){ let best=null,bd=1e9;
        for(const b of vv.beasts){ if(b===ent||!WOLF_PREY.has(b.kind)) continue;
          const d2=Math.hypot(b.m.position.x-px,b.m.position.z-pz); if(d2<bd){bd=d2;best=b;} }
        ent.hunt=best; }
      if(ent.hunt){ sp=9.5; ent.tx=ent.hunt.m.position.x; ent.tz=ent.hunt.m.position.z;
        if(Math.hypot(px-ent.tx,pz-ent.tz)<2.6){          /* the pounce — the prey bolts for the pen */
          ent.hunt.driven=true; ent.hunt.hop=0.5; ent.hunt=null; ent.cool=10+Math.random()*8; ent.t=0; } }
      else if(ent.t<=0){ ent.t=2+Math.random()*3; const a=Math.random()*6.28, r2=Math.random()*10*B;
        ent.tx=ent.hx+Math.cos(a)*r2; ent.tz=ent.hz+Math.sin(a)*r2; }
    } else if(ent.t<=0){ ent.t=2+Math.random()*3; const a=Math.random()*6.28;   /* skulk the outskirts */
      ent.tx=vv.site.x+Math.cos(a)*B*14; ent.tz=vv.site.z+Math.sin(a)*B*14; }
  } else {
    /* fear: the traveller too close, a wolf on the hunt, a hunter's spear */
    let fx=null,fz=null;
    if(BEAST_PREY.has(ent.kind)){
      if(state.mode==='walk'&&Math.hypot(state.walk.x-px,state.walk.z-pz)<8){ fx=state.walk.x; fz=state.walk.z; }
      for(const b of vv.beasts){ if(b.kind!=='wolf') continue;
        if(Math.hypot(b.m.position.x-px,b.m.position.z-pz)<15){ fx=b.m.position.x; fz=b.m.position.z; break; } }
      if(ent.spooked&&tnow-ent.spooked<2.5&&fx===null){ fx=px+Math.sin(ent.seed); fz=pz+Math.cos(ent.seed); }
    }
    if(fx!==null){ const dd=Math.hypot(px-fx,pz-fz)||1;
      ent.tx=px+(px-fx)/dd*24; ent.tz=pz+(pz-fz)/dd*24; ent.t=0.4; ent.panic=true; sp=9; }
    else if(ent.driven&&vv.pen){ ent.tx=vv.pen.x; ent.tz=vv.pen.z; sp=7;
      if(Math.hypot(px-vv.pen.x,pz-vv.pen.z)<B*3){ ent.driven=false; ent.hx=vv.pen.x; ent.hz=vv.pen.z; } }
    else if((vv.stormF||0)>0.35&&vv.pen&&Math.hypot(px-vv.pen.x,pz-vv.pen.z)>B*4){
      ent.tx=vv.pen.x+(Math.random()-0.5)*B*3; ent.tz=vv.pen.z+(Math.random()-0.5)*B*3; sp=6; } /* huddle at the pen in storm */
    else if(ent.kind==='chicken'&&tnow-(vv.feedT||-99)<1.2&&Math.hypot(vv.feedX-px,vv.feedZ-pz)<45){
      ent.tx=vv.feedX+(Math.random()-0.5)*7; ent.tz=vv.feedZ+(Math.random()-0.5)*7; sp=6.5; }
    else if(ent.t<=0){ ent.t=1.6+Math.random()*3;
      const a=Math.random()*6.28, r2=Math.random()*(ent.roamR||4)*B;
      ent.tx=ent.hx+Math.cos(a)*r2; ent.tz=ent.hz+Math.sin(a)*r2; }
  }
  moveEnt(ent,dt,sp);
  if(ent.hop!==undefined&&ent.hop>0){ ent.hop-=dt; ent.m.position.y+=Math.sin(Math.max(0,ent.hop)*6.28)*1.4; }
}
function birdTick(bd,dt){
  bd.ph+=bd.spd*dt;
  bd.m.position.set(bd.cx+Math.cos(bd.ph)*bd.rad, bd.h+Math.sin(bd.ph*2.1)*3, bd.cz+Math.sin(bd.ph)*bd.rad);
  bd.m.rotation.y=-bd.ph+Math.PI/2;
  const flap=Math.sin(performance.now()*0.02+bd.ph*3)*0.7;
  const u=bd.m.userData; if(u.wingL){ u.wingL.rotation.z=flap; u.wingR.rotation.z=-flap; }
}
function updateVillages(px,pz,dt,nightF){
  worldNight=nightF;
  for(let i=0;i<COUNTRIES.length;i++){
    const s0=SITES[i]; const c=COUNTRIES[i].c;
    const sxp=s0?s0.x:c[0]*R_WORLD, szp=s0?s0.z:c[1]*R_WORLD;
    const d=Math.hypot(px-sxp, pz-szp);
    const has=activeVillages.has(i);
    if(d<1100&&!has) spawnVillage(i);
    else if(d>1500&&has){ const vv=activeVillages.get(i);
      if(vv.deckKeys) for(const k of vv.deckKeys) deckMap.delete(k);
      if(vv.g){ scene.remove(vv.g);
        const sharedT=new Set(Object.values(TEX));
        const sharedM=new Set(Object.values(MAT).concat(Object.values(ROBETEX)));
        for(const rm of Object.values(ROBETEX)) sharedT.add(rm.map);
        vv.g.traverse(o=>{ if(o.geometry)o.geometry.dispose();
          const mats=Array.isArray(o.material)?o.material:(o.material?[o.material]:[]);
          for(const m of mats){ if(sharedM.has(m)||m===torchMat) continue;
            if(m.map&&!sharedT.has(m.map)) m.map.dispose(); m.dispose(); } }); }
      activeVillages.delete(i); }
  }
  for(const[,vv] of activeVillages){ if(vv.none||!vv.g) continue;
    vv.stormF=stormAt(vv.site.x,vv.site.z);      /* foul weather empties the lanes */
    for(const p of vv.people) personTick(p,vv,dt);
    for(const b2 of vv.beasts) beastTick(b2,vv,dt);
    if(vv.birds) for(const bd of vv.birds) birdTick(bd,dt);
    for(const tm of vv.torchMats) tm.opacity=nightF*0.85;
  }
  doorTick(dt);
  promptTick();
}
/* ================= COINS & CARGO — THE TRADE OF THE SEAS =================
   Every market prices its wares by its own land (a fixed factor per land and
   good): buy where a thing is cheap, bear it over the deep in the hold, and
   sell where it is dear. Fish of your own catching sell at every market. */
const GOODS=[
  {k:'grain',n:'Grain',base:4},{k:'oil',n:'Olive oil',base:9},{k:'wine',n:'Wine',base:12},
  {k:'salt',n:'Salt',base:6},{k:'cedar',n:'Cedar wood',base:14},{k:'cloth',n:'Fine cloth',base:18},
  {k:'spice',n:'Spices',base:26},{k:'dye',n:'Purple dye',base:34}];
const CARGO_MAX=24;
function cargoCount(){ let n=0; for(const k in state.cargo) n+=state.cargo[k]; return n; }
function priceAt(profile,gi){ const f=0.6+hash2(profile*3.7+gi*13.1, profile*7.3-gi*2.9);   /* 0.6 .. 1.6 */
  return Math.max(1,Math.round(GOODS[gi].base*f)); }
function fishPriceAt(profile){ return Math.max(2,Math.round(5*(0.7+hash2(profile*5.1,profile*2.3)*0.8))); }
let tradeOpen=false, tradeProfile=0, tradeTitle='', tradeSea=false;
function openTrade(profile,title,sea){
  tradeOpen=true; tradeProfile=profile; tradeTitle=title; tradeSea=!!sea;
  $('trade').style.display='flex'; renderTrade();
}
function closeTrade(){ if(!tradeOpen) return; tradeOpen=false; $('trade').style.display='none'; saveState(); }
function renderTrade(){
  $('trade-sub').textContent=tradeTitle+' — your purse: '+state.coins+' shekels · cargo '+cargoCount()+' / '+CARGO_MAX;
  const T=$('trade-rows'); T.innerHTML='';
  for(let gi=0;gi<GOODS.length;gi++){
    const g=GOODS[gi], p=priceAt(tradeProfile,gi);
    const buy=tradeSea?Math.round(p*1.15):p, sell=Math.max(1,tradeSea?Math.round(p*0.75):Math.round(p*0.85));
    const have=state.cargo[g.k]||0;
    const tr=document.createElement('tr');
    tr.innerHTML='<td class="g">'+g.n+'</td><td class="r">held '+have+'</td>'+
      '<td class="r"><button class="tbtn" data-a="b" data-g="'+gi+'" '+((state.coins<buy||cargoCount()>=CARGO_MAX)?'disabled':'')+'>buy '+buy+'</button></td>'+
      '<td class="r"><button class="tbtn" data-a="s" data-g="'+gi+'" '+(have<1?'disabled':'')+'>sell '+sell+'</button></td>';
    T.appendChild(tr);
  }
  const fp=fishPriceAt(tradeProfile), tr2=document.createElement('tr');
  tr2.innerHTML='<td class="g">Fish (your catch)</td><td class="r">held '+(state.fish||0)+'</td><td class="r"></td>'+
    '<td class="r"><button class="tbtn" data-a="f" '+((state.fish||0)<1?'disabled':'')+'>sell '+fp+'</button></td>';
  T.appendChild(tr2);
}
$('trade-rows').addEventListener('click',e=>{
  const b=e.target.closest('button'); if(!b||b.disabled) return;
  const a=b.dataset.a;
  if(a==='f'){ if((state.fish||0)>0){ state.fish--; state.coins+=fishPriceAt(tradeProfile); } }
  else { const gi=+b.dataset.g, g=GOODS[gi], p=priceAt(tradeProfile,gi);
    if(a==='b'){ const buy=tradeSea?Math.round(p*1.15):p;
      if(state.coins>=buy&&cargoCount()<CARGO_MAX){ state.coins-=buy; state.cargo[g.k]=(state.cargo[g.k]||0)+1; } }
    else { const sell=Math.max(1,tradeSea?Math.round(p*0.75):Math.round(p*0.85));
      if((state.cargo[g.k]||0)>0){ state.cargo[g.k]--; if(!state.cargo[g.k]) delete state.cargo[g.k]; state.coins+=sell; } } }
  renderTrade();
});
$('trade-close').addEventListener('click',closeTrade);
$('trade').addEventListener('click',e=>{ if(e.target.id==='trade') closeTrade(); });
/* the stall the traveller stands before, and the trader hailed at sea */
function nearestStallVillage(){
  if(state.mode!=='walk') return null;
  for(const[i,vv] of activeVillages){ if(vv.none||!vv.stalls||!vv.stalls.length) continue;
    for(const s of vv.stalls){ if(Math.hypot(state.walk.x-s.x,state.walk.z-s.z)<13) return {i,s}; } }
  return null;
}
function nearestTrader(){
  if(state.mode!=='boat'&&state.mode!=='deck') return null;
  for(let k=0;k<TRADERS.length;k++){ const T=TRADERS[k];
    if(T.set&&Math.hypot(T.x-state.boat.x,T.z-state.boat.z)<260) return {T,k}; }
  return null;
}

/* ================= THE PROMPT — every close-at-hand deed on one key =================
   Sleep at home · open and shut doors · go below to the hold and up again ·
   speak with the people of the land · cast a line and fish the waters. */
let promptAction=null, promptPerson=null;
function nearbyPerson(){
  if(state.mode!=='walk') return null;
  let best=null,bd=1e9;
  for(const[,vv] of activeVillages){ if(vv.none||!vv.people||!vv.site) continue;
    if(Math.hypot(state.walk.x-vv.site.x,state.walk.z-vv.site.z)>420) continue;
    for(const p of vv.people){ const d=Math.hypot(state.walk.x-p.m.position.x,state.walk.z-p.m.position.z);
      if(d<7&&d<bd){ bd=d; best=p; } } }
  return best;
}
function canFishHere(){
  if(state.mode!=='walk'||state.fishing) return false;
  const w=state.walk; if(w.inWater||!w.grounded) return false;
  const ahead=groundInfo(w.x+Math.sin(w.heading)*10, w.z+Math.cos(w.heading)*10);
  if(ahead.land) return false;                        /* open water must lie before you */
  return (w.feetY-WATER_Y)<18;                        /* from the strand or a pier, not a cliff */
}
let promptStall=null, promptTrader=null;
function promptTick(){
  const el=$('prompt'); if(!el) return;
  promptDoor=null; promptAction=null; promptPerson=null; promptStall=null; promptTrader=null;
  let label=null;
  if(tradeOpen){ el.style.opacity=0; return; }
  if(state.mode==='deck'){
    const d=state.deck;
    if(d.level==='hold'){ if(Math.hypot(d.lx-HATCH.x,d.lz-HATCH.z)<HATCH.r+2.5){ label='F — climb up to the deck'; promptAction='up'; } }
    else if(Math.hypot(d.lx-HATCH.x,d.lz-HATCH.z)<HATCH.r){ label='F — go below to the hold'; promptAction='down'; }
    if(!label){ promptTrader=nearestTrader();
      if(promptTrader){ label='F — hail the merchantman'; promptAction='hail'; } }
  } else if(state.mode==='boat'){
    promptTrader=nearestTrader();
    if(promptTrader){ label='F — hail the merchantman'; promptAction='hail'; }
  } else if(state.mode==='walk'){
    if(state.fishing){ label=state.fishing.phase==='bite'?'F — STRIKE! a fish is on the line':'F — draw in the line'; promptAction='reel'; }
    else if(canSleep()){ label='F — sleep until morning'; promptAction='sleep'; }
    else {
      promptDoor=nearestDoor(state.walk.x,state.walk.z);
      promptStall=nearestStallVillage();
      if(promptDoor){ label='F — '+(promptDoor.door.open?'close the door':'open the door'); promptAction='door'; }
      else if(promptStall){ label='F — trade at the stall'; promptAction='trade'; }
      else { promptPerson=nearbyPerson();
        if(promptPerson){ label='F — speak'; promptAction='speak'; }
        else if(canFishHere()){ label='F — cast a line'; promptAction='fish'; } }
    }
  }
  if(label){ el.textContent=label; el.style.opacity=1; } else el.style.opacity=0;
}
/* ---- the words of the people, by their callings ---- */
const SPEECH={
  teacher:['“Hear, O children: the fear of YAHUAH is the beginning of wisdom.”',
    '“Every morning we read the scroll under the open sky.”'],
  herder:['“The flock strays ever toward the hills — a staff and a watchful eye bring them home.”',
    '“There was a wolf about at dusk. Keep your distance from the pen.”'],
  hunter:['“There are hares in the high grass beyond the fields — walk softly.”',
    '“A spear, patience, and the wind in your face: that is the whole art.”'],
  farmer:['“The early rain came in its season; the crop stands fair this year.”',
    '“Break the clods, water the furrows, and the land gives bread.”'],
  fisher:['“The fish bite best at first light — cast where the water darkens.”',
    '“The sea gives, and the sea withholds. Today she gives.”'],
  water:['“Fresh from the well — the sweetest water in all this land.”',
    '“Every day to the well and back; the jar grows no lighter.”'],
  feeder:['“These hens know my step — scatter the grain and they come running.”'],
  vendor:['“Fine goods from over the sea! Come and look — the price is fair.”',
    '“Spices, cloth, oil and grain — what does your heart desire?”'],
  child:['“You cannot catch me! No one can!”','“Have you truly sailed past the edge of the map?”'],
  shopper:['“The market is busy today — good bread at the far stall.”'],
  folk:['“Peace be upon you, traveller from the sea.”',
    '“Strange sails in the harbour — from what land do you hail?”'],
  sailor:['“She is trim and true, this ship — room for twelve souls and cargo below.”',
    '“Mind the hatch amidships; the hold is full of good cargo.”'] };
/* every soul bears a name; speak again and the talk goes deeper, and ends
   in a rumour — the way to the nearest coast you have not yet seen */
const NAMES_M=['Yoram','Boaz','Elazar','Achim','Zebadyah','Malachi','Othniel','Yair','Shammah','Ittai','Carmi','Nachum','Eran','Palti'];
const NAMES_F=['Miryam','Tamar','Zilpah','Achsah','Yael','Chuldah','Serach','Naarah','Avigail','Devorah','Keturah','Adah','Bilhah','Peninnah'];
function personName(seed,female){ const pool=female?NAMES_F:NAMES_M;
  return pool[Math.floor(hash2(seed,9.7)*pool.length)%pool.length]; }
function callingOf(p){
  if(p.role==='folk') return p.female?'woman of the town':'man of the town';
  if(p.role==='water') return 'water-bearer';
  if(p.role==='shopper') return p.female?'woman at the market':'man at the market';
  return p.role;
}
function rumourLine(){
  let best=-1,bd=1e9;
  for(let i=0;i<COUNTRIES.length;i++){ if(state.visited.has(i)||!SITES[i]) continue;
    const s=SITES[i], d=Math.hypot(s.x-state.walk.x,s.z-state.walk.z); if(d<bd){bd=d;best=i;} }
  if(best<0) return '“You have walked every coast I ever heard tell of. Go in peace.”';
  const s=SITES[best], px=state.walk.x, pz=state.walk.z;
  const pu=px/R_WORLD, pv=pz/R_WORLD, rr=Math.hypot(pu,pv)||1e-9;
  const nX=-pu/rr, nZ=-pv/rr, eX=pv/rr, eZ=-pu/rr;          /* north = toward the midst */
  const dx=s.x-px, dz=s.z-pz;
  const ang=Math.atan2(dx*eX+dz*eZ, dx*nX+dz*nZ);
  const dir=COMPASS8[(Math.round(ang/(Math.PI/4))+8)%8];
  const km=Math.round(bd/B/50)*50;
  return '“Sailors speak of '+COUNTRIES[best].n+' — away to the '+dir+', some '
    +Math.max(50,km).toLocaleString()+' km over the deep. No one here has seen its coast.”';
}
function speakTo(p){ if(!p) return;
  const lines=SPEECH[p.role]||SPEECH.folk;
  const now=performance.now()*0.001;
  if(!p.talk||now-p.talk.t>25) p.talk={idx:0,t:now};
  p.talk.t=now;
  let line;
  if(p.talk.idx<lines.length) line=lines[p.talk.idx];
  else if(p.talk.idx===lines.length&&!p.child) line=rumourLine();
  else { line='“Go in peace, friend of the sea.”'; p.talk.idx=-1; }
  p.talk.idx++;
  p.m.rotation.y=Math.atan2(state.walk.x-p.m.position.x,state.walk.z-p.m.position.z);
  p.pt=Math.max(p.pt||0,3.5); p.tx=p.m.position.x; p.tz=p.m.position.z;   /* stand and talk a moment */
  toast((p.name?p.name+' the '+callingOf(p)+' — ':'')+line);
}
/* ================= FISHING — CAST A LINE UPON THE WATERS ================= */
const FISH_NAMES=['a bream','a mullet','a carp','a musht','a barbel','a grey eel','a silver sardine','a great catfish'];
let rodG=null, rodLine=null, rodBob=null;
const _fishTip=new THREE.Vector3(), _fishDir=new THREE.Vector3(), _fishUp=new THREE.Vector3(0,1,0);
function ensureRod(){ if(rodG) return;
  rodG=new THREE.Group();
  const rod=new THREE.Mesh(new THREE.BoxGeometry(0.3,10,0.3),new THREE.MeshLambertMaterial({color:0x8a6a3a}));
  rod.geometry.translate(0,5,0); rod.rotation.x=0.85; rodG.add(rod);
  rodLine=new THREE.Mesh(new THREE.BoxGeometry(0.09,1,0.09),new THREE.MeshBasicMaterial({color:0x161a22}));
  rodLine.geometry.translate(0,0.5,0); rodLine.visible=false; scene.add(rodLine);
  rodBob=new THREE.Group();
  const b1=new THREE.Mesh(new THREE.BoxGeometry(0.7,0.4,0.7),new THREE.MeshBasicMaterial({color:0xd0472e}));
  const b2=new THREE.Mesh(new THREE.BoxGeometry(0.7,0.4,0.7),new THREE.MeshBasicMaterial({color:0xf2f2ee}));
  b1.position.y=0.2; b2.position.y=-0.2; rodBob.add(b1); rodBob.add(b2);
  rodBob.visible=false; scene.add(rodBob);
}
function startFishing(){ ensureRod();
  state.fishing={t:0,dur:4+Math.random()*8,phase:'wait'};
  walkerG.add(rodG); rodG.position.set(1.9,7.2,0.8);
  rodLine.visible=true; rodBob.visible=true;
  const w=state.walk;
  splash(w.x+Math.sin(w.heading)*11,WATER_Y+0.6,w.z+Math.cos(w.heading)*11,false);
  toast('You cast the line upon the waters, and wait for the tug.');
}
function endFishing(quiet){
  if(rodG&&rodG.parent) rodG.parent.remove(rodG);
  if(rodLine){ rodLine.visible=false; rodBob.visible=false; }
  if(state.fishing&&!quiet) toast('You draw in the line.');
  state.fishing=null;
  const u=walkerG.userData; u.armL.rotation.x=0; u.armR.rotation.x=0;
}
function reelIn(){
  const F=state.fishing; if(!F) return;
  if(F.phase==='bite'){
    state.fish=(state.fish||0)+1;
    const name=FISH_NAMES[Math.floor(Math.random()*FISH_NAMES.length)];
    const w=state.walk;
    splash(w.x+Math.sin(w.heading)*11,WATER_Y+0.8,w.z+Math.cos(w.heading)*11,true);
    endFishing(true);
    toast('You strike, and draw up '+name+' from the deep — '+state.fish+' taken this voyage.');
    saveState();
  } else endFishing(false);
}
function fishTick(dt){
  const F=state.fishing; if(!F) return;
  if(state.mode!=='walk'){ endFishing(true); return; }
  const w=state.walk, [f2,t2]=axis();
  if(Math.abs(f2)>0.2||Math.abs(t2)>0.2||!w.grounded||w.inWater){ endFishing(false); return; }
  F.t+=dt;
  const bx=w.x+Math.sin(w.heading)*11, bz=w.z+Math.cos(w.heading)*11;
  const by=WATER_Y+seaHeight(bx,bz)+0.3+(F.phase==='bite'?Math.sin(F.t*26)*0.9:Math.sin(F.t*2.1)*0.3);
  rodBob.position.set(bx,by,bz);
  _fishTip.set(w.x+Math.sin(w.heading)*6.4, walkerG.position.y+12.6, w.z+Math.cos(w.heading)*6.4);
  _fishDir.set(bx-_fishTip.x,by-_fishTip.y,bz-_fishTip.z);
  const len=_fishDir.length()||1; _fishDir.divideScalar(len);
  rodLine.position.copy(_fishTip); rodLine.scale.set(1,len,1);
  rodLine.quaternion.setFromUnitVectors(_fishUp,_fishDir);
  const u=walkerG.userData;
  u.armR.rotation.x=-0.9+(F.phase==='bite'?Math.sin(F.t*22)*0.12:0); u.armL.rotation.x=-0.72;
  if(F.phase==='wait'&&F.t>=F.dur){ F.phase='bite'; F.t=0; splash(bx,by,bz,false); }
  else if(F.phase==='bite'&&F.t>2.6){ F.phase='wait'; F.t=0; F.dur=4+Math.random()*8;
    toast('The fish slips the hook — cast on, and watch the float.'); }
}
/* ================= THE SPEAR — HUNT THE BEASTS OF THE FIELD =================
   Q (or the button) casts the spear along your gaze. It arcs, and if it
   finds a hare, a deer, a fowl — or a wolf — the game is taken and tallied
   in the log; else it stands planted where it fell. One spear, ever ready. */
let spearM=null; const spear={active:false,x:0,y:0,z:0,vx:0,vy:0,vz:0,stick:0};
function ensureSpear(){ if(spearM) return;
  spearM=new THREE.Group();
  const shaft=new THREE.Mesh(new THREE.BoxGeometry(0.4,0.4,9),new THREE.MeshLambertMaterial({color:0x6a4a2a}));
  spearM.add(shaft);
  const tip=new THREE.Mesh(new THREE.BoxGeometry(0.6,0.6,1.4),new THREE.MeshLambertMaterial({color:0xb8bcc4}));
  tip.position.z=5.0; spearM.add(tip);
  spearM.visible=false; scene.add(spearM);
}
function throwSpear(){
  if(state.mode!=='walk'||spear.active||state.fishing) return;
  ensureSpear();
  const w=state.walk;
  spear.active=true; spear.stick=0;
  spear.x=w.x+Math.sin(w.heading)*2; spear.z=w.z+Math.cos(w.heading)*2;
  spear.y=(w.feetY||0)+9;
  spear.vx=Math.sin(w.heading)*70; spear.vz=Math.cos(w.heading)*70; spear.vy=7;
  spearM.visible=true;
  const u=walkerG.userData; u.armR.rotation.x=-2.6;   /* the cast */
}
function spearHit(){
  const near=(x,z)=>Math.hypot(x-spear.x,z-spear.z)<3.4;
  for(const[,vv] of activeVillages){ if(vv.none||!vv.beasts) continue;
    for(let k=0;k<vv.beasts.length;k++){ const b=vv.beasts[k];
      if(!BEAST_PREY.has(b.kind)&&b.kind!=='deer'&&b.kind!=='wolf') continue;
      if(near(b.m.position.x,b.m.position.z)&&Math.abs(b.m.position.y+3-spear.y)<8){
        b.m.visible=false; vv.g.remove(b.m); vv.beasts.splice(k,1);
        return b.kind; } } }
  for(const a of LANDLIFE){ if(!a.set||(!AMBIENT_PREY.has(a.kind)&&a.kind!=='wolf'&&a.kind!=='lion')) continue;
    if(near(a.x,a.z)&&Math.abs(a.m.position.y+3-spear.y)<9){ a.set=false; a.m.visible=false; return a.kind; } }
  return null;
}
function spearTick(dt){
  if(!spear.active){
    if(spear.stick>0){ spear.stick-=dt; if(spear.stick<=0&&spearM) spearM.visible=false; }
    return; }
  spear.x+=spear.vx*dt; spear.z+=spear.vz*dt; spear.vy-=26*dt; spear.y+=spear.vy*dt;
  spearM.position.set(spear.x,spear.y,spear.z);
  spearM.rotation.y=Math.atan2(spear.vx,spear.vz);
  spearM.rotation.x=Math.atan2(-spear.vy,Math.hypot(spear.vx,spear.vz))*0.8;
  const kill=spearHit();
  if(kill){ state.game=(state.game||0)+1; spear.active=false; spear.stick=1.4;
    toast(kill==='wolf'?'Your spear finds the wolf — the flock is safe, and the pelt is yours. Game taken: '+state.game+'.'
      :'Your spear finds the '+kill+' — game taken for the voyage: '+state.game+'.');
    saveState(); return; }
  const gy=groundInfo(spear.x,spear.z);
  if(spear.y<=(gy.land?gy.y:WATER_Y)+0.4){
    spear.active=false;
    if(!gy.land){ splash(spear.x,WATER_Y+0.6,spear.z,false); spear.stick=0.5; }
    else { spear.stick=5; spearM.rotation.x=1.15; spearM.position.y=gy.y+1.4; }   /* planted in the earth */
  }
  if(Math.hypot(spear.x-state.walk.x,spear.z-state.walk.z)>150){ spear.active=false; spearM.visible=false; }
}

/* ================= YAHRUSHALAYIM ================= */
let yahruPos=null;
{ const lat=31.78, lon=35.23, r=(90-lat)/180;
  const u=r*Math.sin(lon*Math.PI/180), v=r*Math.cos(lon*Math.PI/180);
  const ix0=Math.floor(u*R_WORLD/B), iz0=Math.floor(v*R_WORLD/B);
  for(let rad=0;rad<30&&!yahruPos;rad++) for(let a=0;a<Math.max(1,rad*6)&&!yahruPos;a++){
    const th=a/(rad*6||1)*Math.PI*2;
    const jx=ix0+Math.round(Math.cos(th)*rad), jz=iz0+Math.round(Math.sin(th)*rad);
    const cc=cellRaw(jx,jz); if(cc&&cc.kind!=='wall') yahruPos={ix:jx,iz:jz,x:(jx+.5)*B,z:(jz+.5)*B};
  } }
function buildYahru(){ if(!yahruPos) return;
  const y=topY(yahruPos.ix,yahruPos.iz), x=yahruPos.x, z=yahruPos.z;
  const G=newG();
  emitBox(G, x-B*2.5,y,z-B*2.5, x+B*2.5,y+B,z+B*2.5, 'stone','stone',null);
  emitBox(G, x-B*1.7,y+B,z-B*1.7, x+B*1.7,y+B*2.6,z+B*1.7, 'planks','planks',null);
  for(const sx of [-1,1]) for(const sz of [-1,1])
    emitBox(G, x+sx*B*2-B*0.25,y+B,z+sz*B*2-B*0.25, x+sx*B*2+B*0.25,y+B*2.6,z+sz*B*2+B*0.25, 'logSide','logTop',null);
  emitBox(G, x-B*0.9,y+B*2.6,z-B*0.9, x+B*0.9,y+B*3.4,z+B*0.9, 'hayTop','hayTop','hayTop');
  const g=new THREE.Group();
  for(const mat in G){ const gg=G[mat]; const bg=new THREE.BufferGeometry();
    bg.setAttribute('position',new THREE.Float32BufferAttribute(gg.p,3));
    bg.setAttribute('uv',new THREE.Float32BufferAttribute(gg.uv,2));
    bg.setAttribute('color',new THREE.Float32BufferAttribute(gg.c,3));
    bg.setIndex(gg.i); g.add(new THREE.Mesh(bg,MAT[mat])); }
  scene.add(g);
}

/* ================= THE TRAVELLER'S TREEHOUSE HOME =================
   A great tree with a fancy house in its canopy, a spiral stair winding up
   the trunk, railed platform, and a big furnished interior with a bed. Found
   on the home coast; come here at night to sleep until morning. */
let homePos=null, HOME=null;
{ const lat=31.9, lon=34.75, r=(90-lat)/180;
  const u=r*Math.sin(lon*Math.PI/180), v=r*Math.cos(lon*Math.PI/180);
  const ix0=Math.floor(u*R_WORLD/B), iz0=Math.floor(v*R_WORLD/B);
  for(let rad=0;rad<50&&!homePos;rad++) for(let a=0;a<Math.max(1,rad*6)&&!homePos;a++){
    const th=a/(rad*6||1)*Math.PI*2;
    const jx=ix0+Math.round(Math.cos(th)*rad), jz=iz0+Math.round(Math.sin(th)*rad);
    const cc=cellRaw(jx,jz); if(cc&&cc.kind!=='wall'&&cc.kind!=='floe') homePos={ix:jx,iz:jz,x:(jx+.5)*B,z:(jz+.5)*B};
  } }
function buildHome(){ if(!homePos) return;
  const gy=topY(homePos.ix,homePos.iz), cx=homePos.x, cz=homePos.z;
  const G=newG(); const ex={doors:[],houses:[],torchIn:[]};
  const tr=B*1.1, plat=gy+B*10;
  /* the great trunk */
  emitBox(G, cx-tr,gy,cz-tr, cx+tr,plat+B*5,cz+tr, 'logSide','logTop',null);
  /* the spiral stair winding up to the platform */
  const nStep=Math.floor((plat-gy)/(B*0.85));
  for(let s2=0;s2<nStep;s2++){ const ang=s2*0.68, rr=tr+B*1.7;
    const sx=cx+Math.cos(ang)*rr, sz=cz+Math.sin(ang)*rr, sy=gy+s2*B*0.85;
    emitBox(G, sx-B*0.75,sy,sz-B*0.75, sx+B*0.75,sy+B*0.4,sz+B*0.75, 'planks','planks',null);
    emitBox(G, sx+Math.cos(ang)*B*0.7-0.25,sy,sz+Math.sin(ang)*B*0.7-0.25,
      sx+Math.cos(ang)*B*0.7+0.25,sy+B*1.2,sz+Math.sin(ang)*B*0.7+0.25,'logSide','logTop',null); }
  /* the railed platform */
  const pr=B*6;
  faceTop(G,'planks', cx-pr,cz-pr, cx+pr,cz+pr, plat, 1.0);
  faceBottom(G,'planks', cx-pr,cz-pr, cx+pr,cz+pr, plat-0.5, 0.5);
  for(const sgn of [[-1,-1],[1,-1],[-1,1],[1,1]])
    emitBox(G, cx+sgn[0]*pr*0.82-0.4,gy,cz+sgn[1]*pr*0.82-0.4, cx+sgn[0]*pr*0.82+0.4,plat,cz+sgn[1]*pr*0.82+0.4,'logSide','logTop',null);
  for(let a=0;a<48;a++){ const ang=a/48*6.283, rx=cx+Math.cos(ang)*pr*0.97, rz=cz+Math.sin(ang)*pr*0.97;
    if(ang>1.2&&ang<1.95) continue;                 /* a gap at the door (+z) */
    emitBox(G, rx-0.28,plat,rz-0.28, rx+0.28,plat+B*1.1,rz+0.28, 'logSide','logTop',null); }
  emitBox(G, cx-pr,plat+B*1.1,cz-pr, cx+pr,plat+B*1.25,cz-pr+0.6, 'logSide','logSide',null);  /* top rail (partial) */
  /* the fancy house upon the platform (a big furnished room) */
  emitHouse(G,ex, cx,cz,plat, 7,7, 0, 7777);
  /* the leafy canopy above */
  const cany=plat+B*8;
  emitBox(G, cx-B*7,cany,cz-B*7, cx+B*7,cany+B*1.4,cz+B*7, 'leaves','leaves','leaves');
  emitBox(G, cx-B*5,cany+B*1.4,cz-B*5, cx+B*5,cany+B*2.4,cz+B*5, 'leaves','leaves','leaves');
  emitBox(G, cx-B*2.5,cany+B*2.4,cz-B*2.5, cx+B*2.5,cany+B*3.2,cz+B*2.5, 'leaves','leaves','leaves');
  /* build the meshes */
  const g=new THREE.Group();
  for(const mat in G){ const gg=G[mat]; const bg=new THREE.BufferGeometry();
    bg.setAttribute('position',new THREE.Float32BufferAttribute(gg.p,3));
    bg.setAttribute('uv',new THREE.Float32BufferAttribute(gg.uv,2));
    bg.setAttribute('color',new THREE.Float32BufferAttribute(gg.c,3));
    bg.setIndex(gg.i); g.add(new THREE.Mesh(bg,MAT[mat])); }
  /* the swinging door + register the room so it collides and enters like a home */
  for(const H of ex.houses){ if(!H.door) continue; const D2=H.door;
    const dm=new THREE.Mesh(new THREE.BoxGeometry(D2.w,D2.h,0.6),doorLeafMat);
    dm.geometry.translate(D2.w/2,D2.h/2,0); dm.position.set(D2.hx,D2.y,D2.hz); dm.rotation.y=D2.base;
    g.add(dm); D2.mesh=dm; standaloneHouses.push(H); }
  /* hearth lanterns within (always a soft glow) */
  for(const tp of ex.torchIn){ const tip=new THREE.Mesh(new THREE.BoxGeometry(1.4,1.7,1.4),torchMat);
    tip.position.set(tp.x,tp.y,tp.z); g.add(tip);
    const gm=new THREE.SpriteMaterial({map:glowTexCv,transparent:true,opacity:0.5,depthWrite:false});
    const gs=new THREE.Sprite(gm); gs.scale.set(24,24,1); gs.position.set(tp.x,tp.y+1,tp.z); g.add(gs); }
  scene.add(g);
  HOME={x:cx,z:cz,plat,house:ex.houses[0],ix:homePos.ix,iz:homePos.iz};
}

/* ================= NAME BANNERS ================= */
const labelCache=new Map(); const shownLabels=new Map(); let namesOn=true;
function makeLabel(text,gold){
  const c=texCanvas(1024,170);
  const g=c.getContext('2d'); g.font='600 74px Georgia,serif'; g.textAlign='center'; g.textBaseline='middle';
  g.shadowColor='rgba(0,0,0,0.85)'; g.shadowBlur=16;
  g.lineWidth=10; g.strokeStyle='rgba(5,7,15,0.9)'; g.strokeText(text.toUpperCase(),512,85);
  g.fillStyle=gold?'#e8c66a':'#efe6cf'; g.fillText(text.toUpperCase(),512,85);
  const sm=new THREE.SpriteMaterial({map:new THREE.CanvasTexture(c),fog:false,transparent:true,depthWrite:false,depthTest:false});
  const sp=new THREE.Sprite(sm); sp.scale.set(300,50,1); return sp;
}
function updateLabels(px,pz){
  for(let i=0;i<COUNTRIES.length;i++){
    const site=SITES[i], c=COUNTRIES[i].c;
    const wx=site?site.x:c[0]*R_WORLD, wz=site?site.z:c[1]*R_WORLD;
    const d=Math.hypot(px-wx,pz-wz);
    const want=namesOn&&d<6000;
    const has=shownLabels.has(i);
    if(want&&!has){ let sp=labelCache.get(i);
      if(!sp){ sp=makeLabel(COUNTRIES[i].n,false); labelCache.set(i,sp); }
      const y=site?topY(site.ix,site.iz):WATER_Y;
      sp.position.set(site?site.x:wx, y+96, site?site.z:wz);
      scene.add(sp); shownLabels.set(i,sp); }
    else if(!want&&has){ scene.remove(shownLabels.get(i)); shownLabels.delete(i); }
    if(shownLabels.has(i)){ const sp=shownLabels.get(i);
      const op=Math.max(0,Math.min(1,(6000-d)/1600));
      sp.material.opacity=op*0.95; const sc=Math.max(200,Math.min(900,d*0.16));
      sp.scale.set(sc,sc/6,1); }
  }
  if(yahruPos&&namesOn){ if(!shownLabels.has(-1)){ const sp=makeLabel('Yahrushalayim',true);
      sp.position.set(yahruPos.x,topY(yahruPos.ix,yahruPos.iz)+120,yahruPos.z);
      scene.add(sp); shownLabels.set(-1,sp); } }
  else if(shownLabels.has(-1)&&!namesOn){ scene.remove(shownLabels.get(-1)); shownLabels.delete(-1); }
}

/* ================= CONTROLS ================= */
const keys={};
addEventListener('keydown',e=>{ keys[e.code]=true;
  if(e.code==='Space'){ e.preventDefault(); if(state.mode==='walk') state.walk.jumpReq=true; }
  if(e.code==='KeyE') toggleAshore();
  if(e.code==='KeyF') interact();
  if(e.code==='KeyQ') throwSpear();
  if(e.code==='KeyG') takeFlight();          /* SPACE (handled above) lifts in flight */
  if(e.code==='KeyC') enterDive();           /* dive the deep / surface */
  if(e.code==='KeyM') toggleMap();
  if(e.code==='KeyL') toggleLog(); });
addEventListener('keyup',e=>{ keys[e.code]=false; });
const cv=$('cv'); let drag=null, joy=null;
const tpts=new Map(); let pinchD=0;      /* two-finger pinch state */
cv.addEventListener('pointerdown',e=>{ cv.setPointerCapture(e.pointerId);
  if(e.pointerType==='touch'){
    tpts.set(e.pointerId,[e.clientX,e.clientY]);
    if(tpts.size===2){ const a=[...tpts.values()];
      pinchD=Math.hypot(a[0][0]-a[1][0],a[0][1]-a[1][1]); drag=null;
      if(joy){ joy=null; $('joy').style.display='none'; $('joyk').style.transform=''; }
      return; }
  }
  if(e.pointerType==='touch'&&e.clientX<innerWidth*0.42&&e.clientY>innerHeight*0.35){
    joy={id:e.pointerId,x0:e.clientX,y0:e.clientY,dx:0,dy:0};
    const j=$('joy'); j.style.display='block'; j.style.left=(e.clientX-52)+'px'; j.style.top=(e.clientY-52)+'px';
  } else drag={id:e.pointerId,x:e.clientX,y:e.clientY,mv:0}; });
cv.addEventListener('pointermove',e=>{
  if(e.pointerType==='touch'&&tpts.has(e.pointerId)){
    tpts.set(e.pointerId,[e.clientX,e.clientY]);
    if(tpts.size===2&&pinchD){ const a=[...tpts.values()];
      const nd=Math.hypot(a[0][0]-a[1][0],a[0][1]-a[1][1])||1;
      const f=pinchD/nd; pinchD=nd;
      if(state.firm){ state.firmDist=Math.max(R_WORLD*0.12,Math.min(R_WORLD*2.4,state.firmDist*f));
        if(state.firmDist<=R_WORLD*0.125&&f<1) exitFirm(); }
      else{ state.camDist=Math.max(14,Math.min(240,state.camDist*f));
        if(state.camDist>=239.5&&f>1) enterFirm(); }
      return; }
  }
  if(joy&&e.pointerId===joy.id){ joy.dx=Math.max(-60,Math.min(60,e.clientX-joy.x0));
    joy.dy=Math.max(-60,Math.min(60,e.clientY-joy.y0));
    const k=$('joyk'); k.style.transform='translate('+joy.dx*0.55+'px,'+joy.dy*0.55+'px)'; return; }
  if(drag&&e.pointerId===drag.id){ const ddx=e.clientX-drag.x, ddy=e.clientY-drag.y;
    drag.mv+=Math.abs(ddx)+Math.abs(ddy);
    state.camYaw-=ddx*0.0048;
    state.camPitch=Math.max(0.04,Math.min(1.52,state.camPitch+ddy*0.004));
    drag.x=e.clientX; drag.y=e.clientY; } });
function endPtr(e){ if(joy&&e.pointerId===joy.id){ joy=null; $('joy').style.display='none'; $('joyk').style.transform=''; }
  tpts.delete(e.pointerId); if(tpts.size<2) pinchD=0;
  if(drag&&e.pointerId===drag.id){ const tap=drag.mv<8; drag=null;
    if(tap&&state.firm&&running) firmTravel(e); } }
cv.addEventListener('pointerup',endPtr); cv.addEventListener('pointercancel',endPtr);

/* tap a visited land in the firmament view and a fair wind carries you there */
const _ray=new THREE.Raycaster(), _ndc=new THREE.Vector2();
const _plane=new THREE.Plane(new THREE.Vector3(0,1,0),-180), _hit=new THREE.Vector3();
function firmTravel(e){
  _ndc.set(e.clientX/innerWidth*2-1, -(e.clientY/innerHeight)*2+1);
  _ray.setFromCamera(_ndc,camera);
  if(!_ray.ray.intersectPlane(_plane,_hit)) return;
  const u=_hit.x/R_WORLD, v=_hit.z/R_WORLD; if(Math.hypot(u,v)>1) return;
  let ci=countryAtUV(u,v);
  if(!ci){ let best=-1,bd=1e9;
    for(let i=0;i<COUNTRIES.length;i++){ const c=COUNTRIES[i].c;
      const d=Math.hypot(u-c[0],v-c[1]); if(d<bd){bd=d;best=i;} }
    if(bd<0.03) ci=best+1; else return; }
  const i=ci-1, co=COUNTRIES[i];
  if(!state.visited.has(i)){
    toast('You have not yet come ashore in '+co.n+' — sail there first, and the winds will learn the way.'); return; }
  const site=SITES[i];
  if(!site){ toast(co.n+' offers no harbour.'); return; }
  let px=null,pz=null;
  for(let aa=0;aa<24&&px===null;aa++){ const th=aa/24*Math.PI*2;
    for(let t=3;t<=50;t++){ const x=site.x+Math.cos(th)*t*B, z=site.z+Math.sin(th)*t*B;
      if(Math.hypot(x,z)/R_WORLD>=SHELF_UV) break;
      if(!landAtWorld(x,z)){ if(t<=46){ px=site.x+Math.cos(th)*(t+4)*B; pz=site.z+Math.sin(th)*(t+4)*B; } break; } } }
  if(px===null){ toast(co.n+' lies far from the sea — no wind can carry a ship there.'); return; }
  state.boat.x=px; state.boat.z=pz; state.boat.speed=0;
  state.boat.heading=Math.atan2(site.x-px,site.z-pz);
  setMode('boat'); exitFirm();
  updateChunks(px,pz,9999);
  toast('A fair wind carries you to the coasts of '+co.n+'.');
  saveState();
}
cv.addEventListener('wheel',e=>{ e.preventDefault();
  if(state.firm){ state.firmDist=Math.max(R_WORLD*0.12,Math.min(R_WORLD*2.4,state.firmDist*Math.exp(e.deltaY*0.0012)));
    if(state.firmDist<=R_WORLD*0.125&&e.deltaY<0) exitFirm(); return; }
  state.camDist=Math.max(14,Math.min(240,state.camDist*Math.exp(e.deltaY*0.0012)));
  if(state.camDist>=239.5&&e.deltaY>0) enterFirm(); },{passive:false});
function axis(){
  let f=0,t=0;
  if(keys.KeyW||keys.ArrowUp)f+=1; if(keys.KeyS||keys.ArrowDown)f-=1;
  if(keys.KeyA||keys.ArrowLeft)t-=1; if(keys.KeyD||keys.ArrowRight)t+=1;
  if(joy){ f+=-joy.dy/48; t+=joy.dx/48; }
  /* turn is negated so A/left steers left and D/right steers right, consistently
     for walking, the deck, and the helm (all read t from here) */
  return [Math.max(-1,Math.min(1,f)), -Math.max(-1,Math.min(1,t))];
}

/* ================= MOVEMENT ================= */
function blockedForBoat(x,z){ const cc=landAtWorld(x,z); if(cc) return true;
  return Math.hypot(x,z)/R_WORLD>0.985; }
function boatTick(dt,helm){
  const bt=state.boat; const [f,t]=helm?axis():[0,0];
  const st=stormAt(bt.x,bt.z);
  seaTime=performance.now()*0.001; seaAmp=1+st*1.7;    /* fix the sea for this frame */
  const target=f*40*SPEEDS[state.speedIdx][2]*sailFactor(bt.heading)*(1-0.45*st);
  bt.speed+=(target-bt.speed)*Math.min(1,dt*1.2);
  if(Math.abs(bt.speed)>0.4) bt.heading+=t*dt*(0.85+Math.min(1,Math.abs(bt.speed)/22)*0.6);
  const nx=bt.x+Math.sin(bt.heading)*bt.speed*dt, nz=bt.z+Math.cos(bt.heading)*bt.speed*dt;
  /* probe ahead of the motion: the bow when sailing, the stern when reversing */
  const sgn=bt.speed>=0?1:-1;
  const bowX=nx+Math.sin(bt.heading)*44*SHIP_S*sgn, bowZ=nz+Math.cos(bt.heading)*44*SHIP_S*sgn;
  if(!blockedForBoat(bowX,bowZ)&&!blockedForBoat(nx,nz)){
    state.dist+=Math.hypot(nx-bt.x,nz-bt.z); bt.x=nx; bt.z=nz; }
  else bt.speed*=-0.15;
  /* ride the swell: heave to the wave height, and lean GENTLY to its slope.
     (Slopes can be large; clamp hard so she rocks like a ship, never flips.) */
  const hd=seaHeight(bt.x,bt.z), sl=seaSlope(bt.x,bt.z);
  const fwdX=Math.sin(bt.heading), fwdZ=Math.cos(bt.heading);
  const cl=(v,m)=>v<-m?-m:v>m?m:v;
  const MAXTILT=0.14;
  let pitch=cl(-(sl.x*fwdX+sl.z*fwdZ)*0.9, MAXTILT) - cl(bt.speed*0.0012,0.03);
  let roll =cl((sl.x*fwdZ-sl.z*fwdX)*0.9, MAXTILT)
    + cl(t*Math.min(1,Math.abs(bt.speed)/24)*0.10, 0.10);      /* lean into the turn */
  boatG.position.set(bt.x, WATER_Y-2.1+hd*0.65, bt.z);   /* she draws deeper now, great as she is */
  boatG.rotation.set(pitch, bt.heading, roll);
  const w=windAt(bt.x,bt.z);                       // the pennant flies downwind
  if(boatG.userData.flag) boatG.userData.flag.rotation.y=Math.atan2(w.x,w.z)-bt.heading;
  if(boatG.userData.wheel) boatG.userData.wheel.rotation.z-=t*dt*2.5;
}
/* solid structures: house walls stop you (save for the doorway), trees stop you */
function houseBlocks(nx,nz,H){
  const m=1.2;
  if(nx>H.x0-m&&nx<H.x1+m&&nz>H.z0-m&&nz<H.z1+m){
    const T2=B*0.5+1.0;
    if(nx>H.x0+T2&&nx<H.x1-T2&&nz>H.z0+T2&&nz<H.z1-T2) return false;   // within the room
    if(H.door&&H.door.open&&Math.hypot(nx-H.dx,nz-H.dz)<H.gw+1.5) return false; // open doorway
    return true;
  }
  return false;
}
function blockedByStructure(nx,nz){
  for(const[,vv] of activeVillages){ if(!vv.houses||!vv.site) continue;
    if(Math.hypot(nx-vv.site.x,nz-vv.site.z)>420) continue;
    for(const H of vv.houses) if(houseBlocks(nx,nz,H)) return true;
  }
  for(const H of standaloneHouses) if(houseBlocks(nx,nz,H)) return true;
  return false;
}
/* the well, hay-bales and pens block the way */
function blockedBySolid(nx,nz){
  for(const[,vv] of activeVillages){ if(!vv.solids||!vv.site) continue;
    if(Math.hypot(nx-vv.site.x,nz-vv.site.z)>420) continue;
    for(const s of vv.solids) if(Math.hypot(nx-s.x,nz-s.z)<s.r) return true;
  }
  return false;
}
/* you cannot walk through people or beasts (nor they through you) */
function blockedByEntity(nx,nz,exclude){
  for(const[,vv] of activeVillages){ if(vv.none||!vv.site) continue;
    if(Math.hypot(nx-vv.site.x,nz-vv.site.z)>360) continue;
    const test=arr=>{ if(!arr) return false;
      for(const e of arr){ if(e.m===exclude) continue;
        const r=(e.child?1.0:1.6);
        if(Math.hypot(nx-e.m.position.x,nz-e.m.position.z)<r+1.4) return true; }
      return false; };
    if(test(vv.people)||test(vv.beasts)) return true;
  }
  return false;
}
/* the nearest shut/open door to a point, within reach and on land */
function nearestDoor(px,pz){
  let best=null,bd=1e9;
  const scan=arr=>{ for(const H of arr){ if(!H.door) continue;
    const d=Math.hypot(px-H.dx,pz-H.dz); if(d<11&&d<bd){ bd=d; best=H; } } };
  for(const[,vv] of activeVillages){ if(!vv.houses||!vv.site) continue;
    if(Math.hypot(px-vv.site.x,pz-vv.site.z)>420) continue; scan(vv.houses); }
  scan(standaloneHouses);
  return best;
}
function doorTick(dt){
  const anim=arr=>{ for(const H of arr){ const D2=H.door; if(!D2||!D2.mesh) continue;
    if(Math.abs(D2.ang-D2.target)>0.001){ D2.ang+=(D2.target-D2.ang)*Math.min(1,dt*8); D2.mesh.rotation.y=D2.ang; } } };
  for(const[,vv] of activeVillages){ if(vv.houses) anim(vv.houses); }
  anim(standaloneHouses);
}
let promptDoor=null;
function canSleep(){ if(state.mode!=='walk'||!HOME||worldNight<=0.45) return false;
  /* inside the room among the boughs, OR standing at the foot of the home tree
     (the platform is high in the canopy and hard to gain, so the base serves) */
  return insideHouse(state.walk.x,state.walk.z)===HOME.house
      || Math.hypot(state.walk.x-HOME.x,state.walk.z-HOME.z) < B*5; }
function sleep(){
  const day=Math.floor(state.simHours/24);
  state.simHours=(day+1)*24+7;                    /* wake at seven, next morning */
  toast('You rest in your home among the boughs, and wake to a new morning.');
  saveState();
}
function interact(){
  if(tradeOpen){ closeTrade(); return; }        /* F also leaves the trading */
  switch(promptAction){
    case 'sleep': sleep(); break;
    case 'door': toggleDoor(); break;
    case 'down': state.deck.level='hold'; state.deck.lx=0; state.deck.lz=HATCH.z; break;
    case 'up': state.deck.level='deck'; state.deck.lx=2.4*SHIP_SX; state.deck.lz=HATCH.z+3*SHIP_S; break;
    case 'speak': speakTo(promptPerson); break;
    case 'fish': startFishing(); break;
    case 'reel': reelIn(); break;
    case 'trade': { const st=promptStall;
      const cty=cityFor(st.i);
      openTrade(st.i,'the market of '+(cty?cty.name+', ':'')+COUNTRIES[st.i].n,false); break; }
    case 'hail': { const h=promptTrader; h.T.halt=25;
      toast('You hail the merchantman; she backs her sails and comes alongside to trade.');
      openTrade(500+h.k*7,'a merchantman upon the deep (her prices are her own)',true); break; }
    default: if(canSleep()) sleep(); else toggleDoor();
  }
}
function toggleDoor(){ if(!promptDoor||!promptDoor.door) return;
  const D2=promptDoor.door; D2.open=!D2.open;
  D2.target=D2.open?D2.base+D2.swing:D2.base; }
function treeBlocked(nx,nz){
  const c=landAtWorld(nx,nz); if(!c||!c.tree) return false;
  const ix=Math.floor(nx/B), iz=Math.floor(nz/B);
  return Math.hypot(nx-(ix+.5)*B, nz-(iz+.5)*B)<B*0.55;
}
/* the walking surface under a point — a pier deck, the land, or the swim line */
function groundInfo(x,z){
  const dk=deckMap.get(Math.floor(x/B)+','+Math.floor(z/B));
  if(dk!==undefined) return {y:dk,land:true};
  const c=landAtWorld(x,z);
  if(c) return {y:c.h*B, land:true, wall:c.kind==='wall'};   /* the ice wall is walkable — one may mount it */
  return {y:WATER_Y-2.2, land:false, water:true};
}
/* is a point within the room of a house (used for the inside-the-home camera) */
function insideHouseIn(x,z,arr){ const T2=B*0.5+0.5;
  for(const H of arr) if(x>H.x0+T2&&x<H.x1-T2&&z>H.z0+T2&&z<H.z1-T2) return H;
  return null; }
function insideHouse(x,z){
  for(const[,vv] of activeVillages){ if(!vv.houses||!vv.site) continue;
    if(Math.hypot(x-vv.site.x,z-vv.site.z)>420) continue;
    const H=insideHouseIn(x,z,vv.houses); if(H) return H;
  }
  return insideHouseIn(x,z,standaloneHouses);
}
/* ---- SPLASH — a burst of white spray where a body meets the water ---- */
const SPLASH=[]; const SPL_N=26;
function initSplash(){ if(SPLASH.length) return;
  for(let k=0;k<SPL_N;k++){ const s=new THREE.Sprite(new THREE.SpriteMaterial({color:0xeaf6ff,transparent:true,opacity:0,depthWrite:false}));
    s.visible=false; scene.add(s); SPLASH.push({s,life:0,x:0,y:0,z:0,vx:0,vy:0,vz:0,sz:0}); } }
function splash(x,y,z,big){ initSplash();
  let n=big?16:8;
  for(const p of SPLASH){ if(n<=0) break; if(p.life>0) continue; n--;
    const a=Math.random()*Math.PI*2, r=(big?10:5)*(0.4+Math.random());
    p.life=0.55+Math.random()*0.35; p.x=x; p.y=y; p.z=z;
    p.vx=Math.cos(a)*r; p.vz=Math.sin(a)*r; p.vy=(big?16:9)*(0.5+Math.random());
    p.sz=(big?1.4:0.8)*(0.6+Math.random()*0.7); p.s.visible=true; } }
function splashTick(dt){ if(!SPLASH.length) return;
  for(const p of SPLASH){ if(p.life<=0) continue;
    p.life-=dt; p.vy-=42*dt; p.x+=p.vx*dt; p.y+=p.vy*dt; p.z+=p.vz*dt;
    p.s.position.set(p.x,p.y,p.z); p.s.scale.setScalar(p.sz);
    p.s.material.opacity=Math.max(0,Math.min(0.85,p.life*1.6));
    if(p.life<=0) p.s.visible=false; } }
const STEP=B*1.2, JUMPH=B*2.3, CLIMBH=B*4.6;   /* step / must-jump / can-climb heights */
function walkTick(dt){
  const w=state.walk, u=walkerG.userData; const [f,t]=axis();
  if(w.feetY===undefined){ w.feetY=groundInfo(w.x,w.z).y; w.vy=0; w.grounded=true; }
  /* ---- a climb in progress: hang, then pull up over the ledge ---- */
  if(w.climb){ const cm=w.climb; cm.t+=dt; const p=Math.min(1,cm.t/cm.dur);
    const e=p<0.5?2*p*p:1-Math.pow(1-p,2);
    w.x=cm.x0+(cm.x1-cm.x0)*p; w.z=cm.z0+(cm.z1-cm.z0)*p; w.feetY=cm.y0+(cm.y1-cm.y0)*e;
    walkerG.position.set(w.x,w.feetY,w.z); walkerG.rotation.y=w.heading;
    const pull=Math.max(0,(p-0.55)/0.45);
    u.armL.rotation.x=-2.5+pull*2.0; u.armR.rotation.x=u.armL.rotation.x;
    u.legL.rotation.x=0.4+pull*1.0; u.legR.rotation.x=0.2;
    if(p>=1){ w.climb=null; w.vy=0; w.grounded=true;
      u.armL.rotation.x=u.armR.rotation.x=u.legL.rotation.x=u.legR.rotation.x=0; }
    return;
  }
  w.heading+=t*dt*2.4;
  const gi=groundInfo(w.x,w.z);
  const swimming=gi.water && Math.hypot(w.x-state.boat.x,w.z-state.boat.z)>=90;
  /* ---- vertical physics: gravity, landing, the jump, and true buoyancy ----
     In the water the body floats AT the surface and rides the swell — prone
     and stroking when swimming forward, treading upright when at rest. */
  const surfY=WATER_Y+seaHeight(w.x,w.z);
  if(swimming){
    if(!w.inWater){ w.inWater=true; splash(w.x,surfY+1,w.z,w.vy<-14); }
    w.feetY=surfY-1.0; w.vy=0; w.grounded=true; w.jumpReq=false;
  }
  else { if(w.inWater){ w.inWater=false; }
    w.vy-=64*dt; w.feetY+=w.vy*dt;
    if(w.feetY<=gi.y){ w.feetY=gi.y; w.vy=0; w.grounded=true; } else w.grounded=false;
    if((keys.Space||w.jumpReq)&&w.grounded){ w.vy=38; w.grounded=false; } w.jumpReq=false; }
  /* ---- horizontal move, gated by the height of the ground ahead ---- */
  const sp=f*(swimming?16:18);
  const nx=w.x+Math.sin(w.heading)*sp*dt, nz=w.z+Math.cos(w.heading)*sp*dt;
  const tg=groundInfo(nx,nz);
  const nearBoat=Math.hypot(nx-state.boat.x,nz-state.boat.z)<90;
  const onDeckNext=deckMap.get(Math.floor(nx/B)+','+Math.floor(nz/B))!==undefined;
  const solidBlock = blockedByStructure(nx,nz)||treeBlocked(nx,nz)||blockedBySolid(nx,nz)||blockedByEntity(nx,nz,walkerG);
  const diff = tg.y - w.feetY;
  let canGo=true;
  if(!tg.land) canGo = nearBoat||onDeckNext||(Math.hypot(nx,nz)/R_WORLD<0.985);  /* swim (the ice wall is land, and climbable) */
  else if(diff<=STEP){ /* a small step — walk up or down freely */ }
  else if(swimming && diff<=JUMPH+3){ /* haul out of the water onto the strand */ }
  else if(diff<=JUMPH) canGo = w.feetY>=tg.y-B*0.4;      /* two blocks: only if jumping onto it */
  else if(diff<=CLIMBH){                                  /* three–four blocks: climb it */
    if(f>0.3 && w.grounded && !solidBlock && !w.climb)
      w.climb={t:0,dur:0.8, x0:w.x,z0:w.z,y0:w.feetY,
        x1:nx+Math.sin(w.heading)*B*0.6, z1:nz+Math.cos(w.heading)*B*0.6, y1:tg.y};
    canGo=false;
  } else canGo=false;                                    /* too high — go around */
  if(solidBlock) canGo=false;
  if(canGo){ state.dist+=Math.hypot(nx-w.x,nz-w.z); w.x=nx; w.z=nz;
    if(w.grounded && diff>=-B*3 && diff<=(swimming?JUMPH+3:STEP)) w.feetY=tg.y; }   /* snap small steps */
  walkerG.position.set(w.x,w.feetY,w.z); walkerG.rotation.y=w.heading;
  /* ---- animation ---- */
  const moving=Math.abs(sp)>0.5;
  if(swimming){ const s=performance.now()*0.008;
    const prone=Math.abs(f)>0.15;                        /* stroking forward, or treading */
    walkerG.rotation.x=prone?1.30+Math.sin(s*0.7)*0.05:0.22;
    walkerG.position.y=w.feetY-(prone?0.1:6.4);          /* the body lies IN the water, not upon it */
    if(prone){                                           /* the front crawl — arms wheeling over */
      u.armL.rotation.x=-(s%6.2832); u.armR.rotation.x=-((s+3.1416)%6.2832);
      u.armL.rotation.z=0.12; u.armR.rotation.z=-0.12;
      u.legL.rotation.x=Math.sin(s*2.6)*0.55; u.legR.rotation.x=-Math.sin(s*2.6)*0.55;
      if(Math.random()<dt*2.2) splash(w.x-Math.sin(w.heading)*4,surfY+0.5,w.z-Math.cos(w.heading)*4,false);
    } else {                                             /* treading water, head above the swell */
      u.armL.rotation.x=-0.45+Math.sin(s)*0.22; u.armR.rotation.x=-0.45-Math.sin(s)*0.22;
      u.armL.rotation.z=0.85; u.armR.rotation.z=-0.85;
      u.legL.rotation.x=Math.sin(s*1.6)*0.45; u.legR.rotation.x=-Math.sin(s*1.6)*0.45;
    }
  } else if(!w.grounded){                                 /* the jump pose */
    walkerG.rotation.x=0; u.armL.rotation.z=0; u.armR.rotation.z=0;
    u.legL.rotation.x=0.55; u.legR.rotation.x=-0.3; u.armL.rotation.x=-0.7; u.armR.rotation.x=-0.7;
  } else { const ph=performance.now()*0.011;
    walkerG.rotation.x=0; u.armL.rotation.z=0; u.armR.rotation.z=0;
    u.legL.rotation.x=moving?Math.sin(ph)*0.7:0; u.legR.rotation.x=moving?-Math.sin(ph)*0.7:0;
    u.armL.rotation.x=moving?-Math.sin(ph)*0.5:0; u.armR.rotation.x=moving?Math.sin(ph)*0.5:0;
  }
}
/* ================= FLIGHT — LEVITATION ABOVE THE CLOUDS =================
   The traveller is borne up off the deck or the shore into the open air.
   W/S bear him forward and back, A/D turn him, SPACE lifts him higher,
   SHIFT (or CTRL) lets him down. He floats — there is no falling. He rises
   through the cloud floor and above it, and the wall of ice turns him back
   at the rim. Bear down onto the ground and he alights. */
const R_DOME=R_WORLD*1.08, FLY_TURN=1.9, FLY_MAXSP=520, FLY_VACC=1150, FLY_VMAX=4800;
let flyHintShown=false, flyPad=0, seenFirmament=false, flyDome=null;
function flyFloorAt(x,z){ return groundInfo(x,z).y+7; }
/* height of the firmament (the hard vault) directly above a point on the disc */
function domeCeilAt(x,z){ return Math.sqrt(Math.max(0,R_DOME*R_DOME-x*x-z*z)); }
function ensureFlyDome(){ if(flyDome) return;
  flyDome=new THREE.Mesh(new THREE.SphereGeometry(R_DOME,64,32,0,Math.PI*2,0,Math.PI*0.5),
    new THREE.MeshBasicMaterial({color:0x9ec7f2,transparent:true,opacity:0,side:THREE.BackSide,fog:false,depthWrite:false}));
  scene.add(flyDome); }
function flyTick(dt){
  const fl=state.fly; const [f,t]=axis();
  fl.heading+=t*dt*FLY_TURN;
  const tgt=f*FLY_MAXSP;
  fl.sp+=(tgt-fl.sp)*Math.min(1,dt*2.4);
  fl.x+=Math.sin(fl.heading)*fl.sp*dt;
  fl.z+=Math.cos(fl.heading)*fl.sp*dt;
  /* vertical: hold to rise, and the longer he holds the faster he climbs —
     up through the clouds, past the sun and moon, to the firmament itself */
  let up=flyPad;                                     /* the on-screen ▲▼ pads (touch) */
  if(keys.Space) up+=1;
  if(keys.ShiftLeft||keys.ShiftRight||keys.ControlLeft||keys.ControlRight) up-=1;
  up=Math.max(-1,Math.min(1,up));
  if(up!==0){ fl.vy+=up*FLY_VACC*dt; fl.vy=Math.max(-FLY_VMAX,Math.min(FLY_VMAX,fl.vy)); }
  else fl.vy*=Math.max(0,1-dt*1.4);                 /* let go and he coasts to a hover */
  fl.y+=fl.vy*dt;
  const floor=flyFloorAt(fl.x,fl.z), ceil=domeCeilAt(fl.x,fl.z)-40;
  if(fl.y>=ceil){ fl.y=ceil; fl.vy=Math.min(0,fl.vy);   /* stuck fast against the firmament */
    if(!seenFirmament){ seenFirmament=true;
      toast('You are come up against the firmament — the hard vault of the shamayim, spread out like a moulded mirror, that no man passes.','IYOB 37:18'); } }
  if(fl.y<floor){ fl.y=floor; fl.vy=Math.max(0,fl.vy);
    if(up<0){ alight(); return; } }                 /* bearing down onto the ground — set down */
  if(Math.hypot(fl.x,fl.z)/R_WORLD>0.994){          /* the wall of ice turns you back */
    fl.x-=Math.sin(fl.heading)*fl.sp*dt; fl.z-=Math.cos(fl.heading)*fl.sp*dt; fl.sp*=0.25; }
  state.dist+=Math.abs(fl.sp)*dt;
  /* pose: borne up with arms outstretched, leaning into the flight */
  const u=walkerG.userData, ph=performance.now()*0.0016, dr=Math.sin(ph)*0.12;
  const glide=Math.min(1,Math.abs(fl.sp)/FLY_MAXSP);
  walkerG.position.set(fl.x,fl.y,fl.z);
  walkerG.rotation.y=fl.heading; walkerG.rotation.x=glide*0.4;   /* lean into the flight */
  u.armL.rotation.z=0.95+dr; u.armR.rotation.z=-0.95-dr;
  u.armL.rotation.x=-0.15; u.armR.rotation.x=-0.15;
  u.legL.rotation.x=0.16+Math.sin(ph*1.3)*0.06; u.legR.rotation.x=-0.10-Math.sin(ph*1.3)*0.06;
}
function takeFlight(){
  if(state.mode==='fly'){ alight(); return; }
  ensureFlyDome();
  let x,z,h;
  if(state.mode==='walk'){ x=state.walk.x; z=state.walk.z; h=state.walk.heading; state.prevGround='walk'; }
  else { x=state.boat.x; z=state.boat.z; h=state.boat.heading; state.prevGround='boat'; }
  state.fly.x=x; state.fly.z=z; state.fly.heading=h;
  state.fly.y=flyFloorAt(x,z)+60; state.fly.vy=60; state.fly.sp=0;
  setMode('fly');
  if(!flyHintShown){ flyHintShown=true;
    toast('You are borne up on the air — hold SPACE to rise higher and higher, past the clouds and the lights, to the firmament; SHIFT to sink, W/S to fly, A/D to turn.'); }
}
function alight(){
  const fl=state.fly, cc=landAtWorld(fl.x,fl.z);
  if(cc){                                             /* land on any ground, the ice wall included */
    state.walk.x=fl.x; state.walk.z=fl.z; state.walk.heading=fl.heading;
    state.walk.feetY=undefined; state.walk.vy=0; state.walk.grounded=true;  /* re-seat on the ground here */
    setMode('walk'); markDiscovery(fl.x,fl.z); toast('You alight softly upon the earth.');
  } else {                                            /* over the deep — settle onto the ship */
    state.boat.x=fl.x; state.boat.z=fl.z; state.boat.speed=0; state.boat.heading=fl.heading;
    setMode('boat'); updateChunks(fl.x,fl.z,9999); toast('You settle back onto the deck.');
  }
  saveState();
}
/* ================= THE SHIP'S LOG ================= */
function ordinal(n){ const s=['th','st','nd','rd'], v=n%100; return n+(s[(v-20)%10]||s[v]||s[0]); }
function markDiscovery(x,z){
  const u=x/R_WORLD, v=z/R_WORLD; let ci=countryAtUV(u,v);
  if(!ci){ let best=-1,bd=1e9;
    for(let i=0;i<COUNTRIES.length;i++){ const c=COUNTRIES[i].c;
      const d=Math.hypot(u-c[0],v-c[1]); if(d<bd){bd=d;best=i;} }
    if(bd<0.055) ci=best+1; }
  if(!ci||state.visited.has(ci-1)) return;
  state.visited.add(ci-1);
  const co=COUNTRIES[ci-1];
  if(co.verse&&co.verse.t) toast(co.verse.t, co.verse.ref||'');
  else toast('You have come ashore in '+co.n+' — the '+ordinal(state.visited.size)+' of the '+COUNTRIES.length+' lands of your voyage.');
  saveState();
}
/* ================= MODES: HELM · DECK · SHORE =================
   The traveller is always a body in the world: at the wheel when sailing,
   walking the planks of the deck, or ashore. E (or the ⚓ button) moves
   between them by where you stand — black-flag-fashion. */
function poseArms(atWheel){
  const u=walkerG.userData;
  u.armL.rotation.x=atWheel?-1.15:0; u.armR.rotation.x=atWheel?-1.15:0;
  u.armL.rotation.z=0; u.armR.rotation.z=0;           /* clear any levitation spread */
  u.legL.rotation.x=0; u.legR.rotation.x=0;
}
function setMode(m){
  state.mode=m;
  if(m!=='fly'&&m!=='dive') walkerG.rotation.x=0;      /* clear the flight/swim lean */
  if(m==='walk'||m==='fly'||m==='dive'){              /* a free body in the world, not aboard */
    if(walkerG.parent!==scene){ if(walkerG.parent) walkerG.parent.remove(walkerG); scene.add(walkerG); }
    poseArms(false);
  } else {
    if(walkerG.parent!==boatG){ if(walkerG.parent) walkerG.parent.remove(walkerG); boatG.add(walkerG); }
    if(m==='boat'){ walkerG.position.set(HELM.x,SD.qdeckY,SD.helmZ); walkerG.rotation.y=0; poseArms(true); }
    else poseArms(false);
  }
  walkerG.visible=true;
  updateAshoreBtn(); updateFlyBtn(); updateDiveBtn();
}
function updateFlyBtn(){ const b=$('b-fly'); if(!b) return;
  b.textContent=state.mode==='fly'?'🕊 Alight':'🕊 Rise up';
  b.classList.toggle('off',state.mode==='fly');
  const fp=$('flypad'); if(fp) fp.style.display=(state.mode==='fly'||state.mode==='dive')?'flex':'none'; }
function updateDiveBtn(){ const b=$('b-dive'); if(!b) return;
  b.textContent=state.mode==='dive'?'🌊 Surface':'🤿 Dive';
  b.classList.toggle('off',state.mode==='dive'); }
function nearWheel(){ return state.mode==='deck'&&state.deck.level!=='hold'
  &&state.deck.lz<SD.qdeckZ+1.5*SHIP_S&&Math.abs(state.deck.lx)<4.2*SHIP_SX; }
function goAshoreFromShip(){
  const bt=state.boat;
  /* pass 1 — a beach or low ground; pass 2 — a pier; pass 3 — any land */
  let anyLand=null;
  for(let rad=1;rad<22;rad++) for(let a=0;a<rad*8;a++){
    const th=a/(rad*8)*Math.PI*2;
    const x=bt.x+Math.cos(th)*rad*B, z=bt.z+Math.sin(th)*rad*B;
    const cc=landAtWorld(x,z);
    if(cc){
      if(cc.kind!=='wall'&&cc.h<=2){ state.walk.x=x; state.walk.z=z; state.walk.heading=bt.heading;
        setMode('walk'); markDiscovery(x,z); return true; }
      if(!anyLand) anyLand={x,z};   /* the ice wall counts — you may go ashore and mount it */
    }
  }
  let bestD=null;
  for(const [k] of deckMap){ const parts=k.split(','),ix=+parts[0],iz=+parts[1];
    const x=(ix+.5)*B, z=(iz+.5)*B, dd=Math.hypot(x-bt.x,z-bt.z);
    if(dd<22*B&&(!bestD||dd<bestD.dd)) bestD={x,z,dd}; }
  if(bestD){ state.walk.x=bestD.x; state.walk.z=bestD.z; state.walk.heading=bt.heading;
    setMode('walk'); markDiscovery(bestD.x,bestD.z); return true; }
  if(anyLand){ state.walk.x=anyLand.x; state.walk.z=anyLand.z; state.walk.heading=bt.heading;
    setMode('walk'); markDiscovery(anyLand.x,anyLand.z); return true; }
  toast('No shore within reach — draw nearer to the land.');
  return false;
}
function toggleAshore(){
  if(state.mode==='fly'){ alight(); return; }    /* come down out of the air */
  if(state.mode==='dive'){ surface(); return; }  /* come up out of the deep */
  if(state.mode==='boat'){                       /* step back from the wheel */
    state.deck={lx:2.4*SHIP_SX,lz:SD.helmZ+1.2*SHIP_S,h:0,level:'deck'};
    setMode('deck'); return;
  }
  if(state.mode==='deck'){
    if(state.deck.level==='hold'){               /* first come up out of the hold */
      state.deck.level='deck'; state.deck.lx=2.4*SHIP_SX; state.deck.lz=HATCH.z+3*SHIP_S; return; }
    if(nearWheel()){ setMode('boat'); return; }  /* take the helm */
    goAshoreFromShip(); return;
  }
  /* ashore: board the ship if she lies near */
  if(Math.hypot(state.walk.x-state.boat.x,state.walk.z-state.boat.z)<95){
    state.deck={lx:4.6*SHIP_SX,lz:2*SHIP_S,h:Math.PI*0.5,level:'deck'};
    setMode('deck');
  } else toast('The ship lies too far off — return to the water\u2019s edge.');
}
function updateAshoreBtn(){ const b=$('b-ashore');
  if(state.mode==='dive') b.textContent='🌊 Surface';
  else if(state.mode==='fly') b.textContent='🕊 Alight';
  else if(state.mode==='boat') b.textContent='⚓ Leave the helm';
  else if(state.mode==='deck') b.textContent=nearWheel()?'⎈ Take the helm':'⚓ Go ashore';
  else b.textContent='⛵ Board the ship';
}
function deckTick(dt){
  const d=state.deck; const [f,t]=axis();
  d.h+=t*dt*2.4;
  const sp=f*14;
  const allowed=d.level==='hold'?holdAllowed:deckAllowed;
  const nx=d.lx+Math.sin(d.h)*sp*dt, nz=d.lz+Math.cos(d.h)*sp*dt;
  if(allowed(nx,d.lz)) d.lx=nx;
  if(allowed(d.lx,nz)) d.lz=nz;
  walkerG.position.set(d.lx,d.level==='hold'?HOLD.y:deckHeightAt(d.lz),d.lz);
  walkerG.rotation.y=d.h;
  const ph=performance.now()*0.011, moving=Math.abs(sp)>0.5, u=walkerG.userData;
  u.legL.rotation.x=moving?Math.sin(ph)*0.7:0; u.legR.rotation.x=moving?-Math.sin(ph)*0.7:0;
  u.armL.rotation.x=moving?-Math.sin(ph)*0.5:0; u.armR.rotation.x=moving?Math.sin(ph)*0.5:0;
}

/* ================= THE FIRMAMENT VIEW ================= */
let firmG=null, firmMark=null;
function buildFirmament(){
  if(firmG) return;
  const size=2048, c=texCanvas(size), g=c.getContext('2d'), Hh=size/2;
  g.fillStyle='#05070f'; g.fillRect(0,0,size,size);
  const grd=g.createRadialGradient(Hh,Hh,0,Hh,Hh,Hh);
  grd.addColorStop(0,'#1c4d7a'); grd.addColorStop(0.7,'#123a5f'); grd.addColorStop(1,'#0b2745');
  g.beginPath(); g.arc(Hh,Hh,Hh*0.999,0,Math.PI*2); g.fillStyle=grd; g.fill();
  for(const co of COUNTRIES){ g.beginPath();
    for(const ring of co.p){ g.moveTo((ring[0][0]+1)*Hh,(ring[0][1]+1)*Hh);
      for(let k=1;k<ring.length;k++) g.lineTo((ring[k][0]+1)*Hh,(ring[k][1]+1)*Hh); g.closePath(); }
    g.fillStyle='#557f45'; g.fill('evenodd'); }
  /* biome tinting pass over the lands */
  for(let py=0;py<size;py+=4) for(let px2=0;px2<size;px2+=4){
    const u=px2/Hh-1, v=py/Hh-1; const r=Math.hypot(u,v); if(r>=SHELF_UV) continue;
    if(!countryAtUV(u,v)) continue;
    const lat=90-r*180; const n2=fbm(u*46+40,v*46-70);
    let col=null;
    if(lat>72||lat<-55) col='#dfe9f0';
    else if(lat>58) col='#8d996f';
    else if(lat>11&&lat<36&&n2>0.42) col='#d3b271';
    else if(lat<=11&&lat>-38) col='#3f8f4a';
    if(col){ g.fillStyle=col; g.globalAlpha=0.8; g.fillRect(px2,py,4,4); g.globalAlpha=1; }
  }
  /* a soft coast line around every land, for definition */
  g.strokeStyle='rgba(24,42,30,0.55)'; g.lineWidth=Math.max(1,size/1500); g.lineJoin='round';
  for(const co of COUNTRIES){ g.beginPath();
    for(const ring of co.p){ g.moveTo((ring[0][0]+1)*Hh,(ring[0][1]+1)*Hh);
      for(let k=1;k<ring.length;k++) g.lineTo((ring[k][0]+1)*Hh,(ring[k][1]+1)*Hh); g.closePath(); }
    g.stroke(); }
  g.strokeStyle='#2e5f8e'; g.lineWidth=2.4; g.lineCap='round'; g.lineJoin='round';
  for(const rv of RIVERS){ g.beginPath();
    rv.pts.forEach((p,k)=>{ const r=(90-p[0])/180, a=p[1]*Math.PI/180;
      const x=(r*Math.sin(a)+1)*Hh, yq=(r*Math.cos(a)+1)*Hh;
      k?g.lineTo(x,yq):g.moveTo(x,yq); });
    g.stroke(); }
  /* the graticule — faint circles of latitude and meridians of longitude */
  g.strokeStyle='rgba(232,198,106,0.09)'; g.lineWidth=1;
  for(let k=1;k<=5;k++){ g.beginPath(); g.arc(Hh,Hh,Hh*ICE_UV*k/6,0,Math.PI*2); g.stroke(); }
  for(let m=0;m<24;m++){ const a=m/24*Math.PI*2; g.beginPath();
    g.moveTo(Hh,Hh); g.lineTo(Hh+Math.cos(a)*Hh*ICE_UV,Hh+Math.sin(a)*Hh*ICE_UV); g.stroke(); }
  /* the ring of ice at the rim, and a dashed circle within it */
  g.beginPath(); g.arc(Hh,Hh,Hh*0.999,0,Math.PI*2); g.arc(Hh,Hh,Hh*ICE_UV,0,Math.PI*2,true);
  g.fillStyle='#e8f0f7'; g.fill('evenodd');
  g.setLineDash([11,9]); g.strokeStyle='rgba(232,240,247,0.6)'; g.lineWidth=2.4;
  g.beginPath(); g.arc(Hh,Hh,Hh*ICE_UV*0.992,0,Math.PI*2); g.stroke(); g.setLineDash([]);
  const tex=new THREE.CanvasTexture(c); tex.anisotropy=4;
  const disc=new THREE.Mesh(new THREE.CircleGeometry(R_WORLD,128),
    new THREE.MeshBasicMaterial({map:tex,fog:false}));
  /* sit well above the sea and terrain: at a 384k-unit far plane the depth
     buffer cannot separate y=2 from the sea at y≈0.35 and the disc flickers */
  disc.rotation.x=-Math.PI/2; disc.position.y=180;
  const dome=new THREE.Mesh(new THREE.SphereGeometry(R_WORLD*1.08,48,24,0,Math.PI*2,0,Math.PI/2),
    new THREE.MeshBasicMaterial({color:0x8fb8e8,transparent:true,opacity:0.1,side:THREE.DoubleSide,fog:false,depthWrite:false}));
  firmG=new THREE.Group(); firmG.add(disc); firmG.add(dome);
  function mkSpr(col){ const cc2=texCanvas(64); const gg=cc2.getContext('2d');
    gg.fillStyle=col; gg.beginPath(); gg.moveTo(32,4); gg.lineTo(58,60); gg.lineTo(6,60); gg.closePath(); gg.fill();
    const sm=new THREE.SpriteMaterial({map:new THREE.CanvasTexture(cc2),fog:false,transparent:true,depthTest:false});
    return new THREE.Sprite(sm); }
  firmMark=mkSpr('#e8c66a'); firmMark.scale.set(R_WORLD*0.028,R_WORLD*0.028,1); firmG.add(firmMark);
  if(yahruPos){ const y2=mkSpr('#fff1c0'); y2.scale.set(R_WORLD*0.015,R_WORLD*0.015,1);
    y2.position.set(yahruPos.x,R_WORLD*0.012,yahruPos.z); firmG.add(y2); }

  /* ---- the bronze frame that bears the disc, and the four corner verses ----
     A great square set under the circle of the earth. The disc is punched out
     of its midst; in the four corners, curving with the rim, stand the words
     of the Scriptures that speak of the ends and the corners of the earth. */
  const fs=2560, fc=texCanvas(fs), fg=fc.getContext('2d'), Fh=fs/2;
  const planeSide=R_WORLD*2.32, discR=Fh*(1/1.16);
  fg.clearRect(0,0,fs,fs);
  const bgr=fg.createRadialGradient(Fh,Fh,discR*0.9,Fh,Fh,Fh*1.35);
  bgr.addColorStop(0,'rgba(58,49,32,0)'); bgr.addColorStop(0.05,'rgba(58,49,32,0.94)');
  bgr.addColorStop(0.55,'rgba(38,32,21,0.96)'); bgr.addColorStop(1,'rgba(12,10,8,0.99)');
  fg.fillStyle=bgr; fg.fillRect(0,0,fs,fs);
  fg.globalCompositeOperation='destination-out';          /* punch out the disc */
  fg.beginPath(); fg.arc(Fh,Fh,discR,0,Math.PI*2); fg.fill();
  fg.globalCompositeOperation='source-over';
  fg.strokeStyle='rgba(232,198,106,0.55)'; fg.lineWidth=fs/340;
  fg.beginPath(); fg.arc(Fh,Fh,discR*1.008,0,Math.PI*2); fg.stroke();
  function arcText(text,R,aMid,aDir,up,color,fpx){
    fg.save(); fg.font='italic '+fpx+'px Georgia,serif'; fg.fillStyle=color;
    fg.textAlign='center'; fg.textBaseline='middle'; fg.shadowColor='rgba(0,0,0,0.8)'; fg.shadowBlur=fpx*0.25;
    const ws=[]; let tot=0; for(const ch of text){ const w=fg.measureText(ch).width+fpx*0.02; ws.push(w); tot+=w; }
    let a=aMid-aDir*(tot/R)/2;
    for(let i=0;i<text.length;i++){ const da=ws[i]/R, ac=a+aDir*da/2;
      fg.save(); fg.translate(Fh+Math.cos(ac)*R,Fh+Math.sin(ac)*R); fg.rotate(ac+up*Math.PI/2);
      fg.fillText(text[i],0,0); fg.restore(); a+=aDir*da; }
    fg.restore(); }
  const VF=[
    {t:'It is changed like clay under a seal, and they stand forth like a garment', r:'IYOB 38:14', aMid:-Math.PI/2, aDir:1, up:1},
    {t:'I saw four messengers standing on the four corners of the earth, holding the four winds', r:'HAZON 7:1', aMid:0, aDir:1, up:-1},
    {t:'and gather the outcasts of Yisharal from the four corners of the earth', r:"YASHA'YAHU 11:12", aMid:Math.PI/2, aDir:-1, up:-1},
    {t:'The earth and all its inhabitants are melted; it is I who set up its columns firm', r:'TEHILLIM 75:3', aMid:Math.PI, aDir:1, up:1},
  ];
  for(const q of VF){ arcText(q.t, discR*1.05, q.aMid, q.aDir, q.up, 'rgba(214,190,140,0.92)', fs*0.0155);
    arcText(q.r, discR*1.115, q.aMid, q.aDir, q.up, 'rgba(232,198,106,0.85)', fs*0.012); }
  const ftex=new THREE.CanvasTexture(fc); ftex.anisotropy=4;
  const frame=new THREE.Mesh(new THREE.PlaneGeometry(planeSide,planeSide),
    new THREE.MeshBasicMaterial({map:ftex,transparent:true,fog:false,depthWrite:false}));
  frame.rotation.x=-Math.PI/2; frame.position.y=176; firmG.add(frame);

  /* the sun's glow standing over the midst of the lands */
  const glowC=texCanvas(128), glg=glowC.getContext('2d');
  const gr2=glg.createRadialGradient(64,64,0,64,64,64);
  gr2.addColorStop(0,'rgba(255,247,214,0.7)'); gr2.addColorStop(0.28,'rgba(255,224,150,0.28)'); gr2.addColorStop(1,'rgba(255,224,150,0)');
  glg.fillStyle=gr2; glg.fillRect(0,0,128,128);
  const glow=new THREE.Sprite(new THREE.SpriteMaterial({map:new THREE.CanvasTexture(glowC),
    blending:THREE.AdditiveBlending,transparent:true,fog:false,depthTest:false}));
  glow.scale.set(R_WORLD*0.3,R_WORLD*0.3,1); glow.position.set(0,R_WORLD*0.03,0); firmG.add(glow);

  firmG.visible=false; scene.add(firmG);
}
let firmHintShown=false;
function enterFirm(){ buildFirmament(); state.firm=true; firmG.visible=true;
  scene.fog=null; state.firmDist=R_WORLD*1.62; state.camPitch=1.02;
  sea.visible=false; seaDeep.visible=false; waveGrid.visible=false;
  if(!firmHintShown&&running){ firmHintShown=true;
    toast('Tap a land you have already visited, and a fair wind will carry you to its coasts.'); }
  clouds.visible=false; cirrus.visible=false;   /* clear the sky \u2014 behold the whole earth */
  cloudDeck.visible=false; cloudWisp.visible=false; cloudCover.visible=false; voidWall.visible=false;
  hideDeep(); hideLandLife(); hideAirLife(); hideTraders();  /* nothing of the deep or the field in the map view */
  $('b-firm').textContent='\u26F5 Return to the ship'; }
function exitFirm(){ state.firm=false; if(firmG) firmG.visible=false;
  scene.fog=FOG; state.camPitch=0.42; state.camDist=200;
  sea.visible=true; seaDeep.visible=true; waveGrid.visible=true;
  clouds.visible=true; clouds.scale.set(1,1,1); clouds.position.y=CLOUD_Y; cirrus.visible=true; voidWall.visible=true;
  $('b-firm').textContent='\uD83D\udd4A The firmament'; }

/* ================= CAMERA ================= */
const camTgt=new THREE.Vector3(), camPos=new THREE.Vector3(), _wv=new THREE.Vector3();
let camInside=false;
function setCamInside(on){ if(on===camInside) return; camInside=on;
  camera.near=on?0.3:1; camera.updateProjectionMatrix();
  if(on){ if(state.mode==='walk'||state.mode==='deck') walkerG.visible=false; } /* hide the body in first-person */
  else walkerG.visible=true;
}
function camInsideShip(wx,wy,wz){
  if(wy>boatG.position.y+56*SHIP_S) return false;
  const dx=wx-boatG.position.x, dz=wz-boatG.position.z, h=state.boat.heading;
  const c=Math.cos(h), sn=Math.sin(h);
  const lx=dx*c-dz*sn, lz=dx*sn+dz*c;
  return Math.abs(lx)<10*SHIP_SX && lz>-35*SHIP_S && lz<50*SHIP_S;
}
const _camHold=new THREE.Vector3();
function cameraTick(dt){
  if(state.firm){ const pit=Math.max(0.3,Math.min(1.5,state.camPitch));
    const Rd=state.firmDist;
    camPos.set(Math.sin(state.camYaw)*Math.cos(pit)*Rd, Math.sin(pit)*Rd+200, Math.cos(state.camYaw)*Math.cos(pit)*Rd);
    camera.position.lerp(camPos,Math.min(1,dt*2.5)); camera.lookAt(0,0,0); return; }
  /* down in the hold — a first-person eye among the cargo */
  if(state.mode==='deck'&&state.deck.level==='hold'){
    setCamInside(true); boatG.updateMatrixWorld();
    const d=state.deck;
    _wv.set(d.lx,HOLD.y+9.6,d.lz); boatG.localToWorld(_wv);
    camera.position.lerp(_wv,Math.min(1,dt*12));
    _camHold.set(d.lx+Math.sin(d.h)*12,HOLD.y+8.2,d.lz+Math.cos(d.h)*12); boatG.localToWorld(_camHold);
    camera.lookAt(_camHold); return; }
  /* inside a home — a first-person view from within, so you truly enter it.
     The camera is clamped well inside the walls (never through them), the near
     plane is pulled in, and the body is hidden so it doesn't fill the view. */
  const Hin = state.mode==='walk' ? insideHouse(state.walk.x,state.walk.z) : null;
  setCamInside(!!Hin);
  if(Hin){ const w=state.walk, H=Hin, hy=walkerG.position.y+8.5, inset=B*0.5+2.2;
    let cxp=w.x+Math.sin(w.heading)*1.0, czp=w.z+Math.cos(w.heading)*1.0;
    cxp=Math.max(H.x0+inset, Math.min(H.x1-inset, cxp));
    czp=Math.max(H.z0+inset, Math.min(H.z1-inset, czp));
    camPos.set(cxp,hy,czp); camera.position.lerp(camPos,Math.min(1,dt*10));
    camTgt.set(w.x+Math.sin(w.heading)*14, hy-2.0, w.z+Math.cos(w.heading)*14);
    camera.lookAt(camTgt); return; }
  let px,pz,phead,baseY,dist;
  if(state.mode==='deck'){ walkerG.getWorldPosition(_wv);
    px=_wv.x; pz=_wv.z; baseY=_wv.y; phead=state.boat.heading+state.deck.h;
    dist=Math.max(10,Math.min(state.camDist,60)); }
  else if(state.mode==='boat'){ const bt=state.boat;
    px=bt.x; pz=bt.z; baseY=boatG.position.y+SD.qdeckY; phead=bt.heading; dist=Math.max(56,Math.min(state.camDist,260)); }
  else if(state.mode==='fly'){ const fl=state.fly;
    px=fl.x; pz=fl.z; baseY=fl.y; phead=fl.heading; dist=Math.max(24,Math.min(state.camDist,300)); }
  else if(state.mode==='dive'){ const dv=state.dive;
    px=dv.x; pz=dv.z; baseY=dv.y; phead=dv.heading; dist=Math.max(16,Math.min(state.camDist,90)); }
  else{ const w=state.walk;
    px=w.x; pz=w.z; baseY=walkerG.position.y; phead=w.heading; dist=Math.max(14,Math.min(state.camDist,150)); }
  const [f2]=axis(); if(Math.abs(f2)>0.2) state.camYaw*=Math.max(0,1-dt*0.5);
  const az=phead+Math.PI+state.camYaw;
  /* ashore, draw the camera in rather than clip through the ship */
  if(state.mode==='walk'){
    for(let k=0;k<8&&dist>20;k++){
      const tx=px+Math.sin(az)*Math.cos(state.camPitch)*dist;
      const tz=pz+Math.cos(az)*Math.cos(state.camPitch)*dist;
      const ty=baseY+8+Math.sin(state.camPitch)*dist;
      if(!camInsideShip(tx,ty,tz)) break;
      dist*=0.82;
    }
  }
  /* swimming, the eye rides low along the waterline — the swell can roll
     right over it (the frame loop tints the world to water-light when it does) */
  const swimCam=state.mode==='walk'&&state.walk.inWater;
  const lift=state.mode==='deck'?5:swimCam?2.2:8;
  const cy=baseY+lift+Math.sin(state.camPitch)*dist;
  camPos.set(px+Math.sin(az)*Math.cos(state.camPitch)*dist, cy, pz+Math.cos(az)*Math.cos(state.camPitch)*dist);
  camera.position.lerp(camPos,Math.min(1,dt*5));
  camTgt.set(px,baseY+(swimCam?4:10),pz);
  camera.lookAt(camTgt);
}

/* ================= HUD ================= */
function toast(txt,ref){ $('verse-t').textContent=txt; $('verse-r').textContent=ref||'';
  const v=$('verse'); v.style.opacity=1;
  clearTimeout(toast._t); toast._t=setTimeout(()=>{v.style.opacity=0;}, ref?11000:5200); }
const seen={wall:false,yahru:false};
function placeTick(){
  updateAshoreBtn();
  const p=state.mode==='walk'?state.walk:state.mode==='fly'?state.fly:state.mode==='dive'?state.dive:state.boat;
  const u=p.x/R_WORLD, v=p.z/R_WORLD, r=Math.hypot(u,v);
  let txt;
  if(state.mode==='fly'){                              /* aloft — name the height above the deep */
    const km=Math.max(0,Math.round((state.fly.y-CLOUD_Y)/6));
    txt = state.fly.y>=domeCeilAt(state.fly.x,state.fly.z)-60 ? 'AGAINST THE FIRMAMENT'
        : state.fly.y>CLOUD_Y+8 ? 'ALOFT — '+km.toLocaleString()+' KM ABOVE THE CLOUDS'
        : 'RISING ON THE AIR'; }
  else if(state.mode==='dive'){                        /* in the deep — name the depth below the waves */
    const m=Math.max(0,Math.round((SEA_SURF-state.dive.y)/6));
    txt = state.dive.y<=seabedDepth(state.dive.x,state.dive.z)+6 ? 'THE FLOOR OF THE DEEP — '+m.toLocaleString()+' M DOWN'
        : 'IN THE DEEP — '+m.toLocaleString()+' M DOWN'; }
  else if(r>0.9){ txt='THE WALL OF ICE';
    if(!seen.wall){ seen.wall=true; const vs=VERSES.find(q=>q.ref.indexOf('26:10')>=0);
      if(vs) toast(vs.t,vs.ref); } }
  else{
    const ci=countryAtUV(u,v);
    if(ci){ const cty=cityFor(ci-1);
      txt=(cty?cty.name+' — '+COUNTRIES[ci-1].n:COUNTRIES[ci-1].n).toUpperCase(); }
    else if(state.mode==='walk'&&landAtWorld(p.x,p.z)) txt='AN UNCHARTED ISLE';
    else{ let best=-1,bd=1e9;
      for(let i=0;i<COUNTRIES.length;i++){ const c=COUNTRIES[i].c;
        const d=Math.hypot(u-c[0],v-c[1]); if(d<bd){bd=d;best=i;} }
      txt = bd<0.055 ? 'the waters off '+COUNTRIES[best].n : 'THE GREAT DEEP'; }
  }
  if(yahruPos&&!seen.yahru&&Math.hypot(p.x-yahruPos.x,p.z-yahruPos.z)<300){
    seen.yahru=true; const vs=VERSES.find(q=>q.ref.indexOf('5:5')>=0); if(vs) toast(vs.t,vs.ref); }
  $('place').textContent=txt;
  const hrs=state.simHours%24, hh=String(Math.floor(hrs)).padStart(2,'0'), mm=String(Math.floor(hrs%1*60)).padStart(2,'0');
  $('clock').innerHTML='DAY '+dayOfYear()+' OF 364<br>'+hh+':'+mm+' \u00b7 course: '+SPEEDS[state.speedIdx][1]
    +'<br>wind: '+windLabel();
}

/* ================= THE MAP OF THE WHOLE EARTH ================= */
const mapBases={};
function drawMapBase(size){
  const c=texCanvas(size); const g=c.getContext('2d');
  const Hh=size/2;
  g.fillStyle='#07101d'; g.fillRect(0,0,size,size);
  g.beginPath(); g.arc(Hh,Hh,Hh*0.998,0,Math.PI*2); g.fillStyle='#0d2f4c'; g.fill();
  g.beginPath(); g.arc(Hh,Hh,Hh*0.998,0,Math.PI*2); g.arc(Hh,Hh,Hh*ICE_UV,0,Math.PI*2,true);
  g.fillStyle='#dfe9f2'; g.fill('evenodd');
  for(const co of COUNTRIES){
    g.beginPath();
    for(const ring of co.p){ g.moveTo((ring[0][0]+1)*Hh,(ring[0][1]+1)*Hh);
      for(let k=1;k<ring.length;k++) g.lineTo((ring[k][0]+1)*Hh,(ring[k][1]+1)*Hh); g.closePath(); }
    g.fillStyle='#4f7a43'; g.fill('evenodd');
    g.strokeStyle='rgba(232,198,106,0.25)'; g.lineWidth=Math.max(0.4,size/1400); g.stroke();
  }
  /* the rivers, threading inland from the coasts */
  g.strokeStyle='#3d6f9e'; g.lineWidth=Math.max(0.8,size/900);
  g.lineCap='round'; g.lineJoin='round';
  for(const rv of RIVERS){ g.beginPath();
    rv.pts.forEach((p,k)=>{ const r=(90-p[0])/180, a=p[1]*Math.PI/180;
      const x=(r*Math.sin(a)+1)*Hh, yq=(r*Math.cos(a)+1)*Hh;
      k?g.lineTo(x,yq):g.moveTo(x,yq); });
    g.stroke(); }
  return c;
}
function drawMapInto(ctx2,size,withNames){
  if(!mapBases[size]) mapBases[size]=drawMapBase(size);
  ctx2.clearRect(0,0,size,size); ctx2.drawImage(mapBases[size],0,0);
  const Hh=size/2;
  if(withNames){ ctx2.textAlign='center'; ctx2.font='600 '+Math.max(9,size/74)+'px Georgia,serif';
    for(const co of COUNTRIES){ let area=0;
      for(const ring of co.p){ for(let k=0;k<ring.length-1;k++) area+=ring[k][0]*ring[k+1][1]-ring[k+1][0]*ring[k][1]; }
      if(Math.abs(area)/2>0.0016){ ctx2.fillStyle='rgba(10,14,26,0.85)';
        ctx2.fillText(co.n,(co.c[0]+1)*Hh+1,(co.c[1]+1)*Hh+1);
        ctx2.fillStyle='#e8dfc8'; ctx2.fillText(co.n,(co.c[0]+1)*Hh,(co.c[1]+1)*Hh); } } }
  /* wandering storms, to be steered around */
  for(const s of STORMS){
    const sx=(Math.sin(s.a)*s.r+1)*Hh, sy=(Math.cos(s.a)*s.r+1)*Hh;
    ctx2.beginPath(); ctx2.arc(sx,sy,s.R/R_WORLD*Hh*2,0,Math.PI*2);
    ctx2.fillStyle='rgba(110,118,132,0.4)'; ctx2.fill();
  }
  const [su,sv]=sunUV();
  ctx2.beginPath(); ctx2.arc((su+1)*Hh,(sv+1)*Hh,Math.max(3,size/120),0,Math.PI*2);
  ctx2.fillStyle='#ffe9a8'; ctx2.fill();
  const p=state.mode==='walk'?state.walk:state.mode==='fly'?state.fly:state.mode==='dive'?state.dive:state.boat;
  const px=(p.x/R_WORLD+1)*Hh, py=(p.z/R_WORLD+1)*Hh;
  ctx2.save(); ctx2.translate(px,py); ctx2.rotate(Math.atan2(Math.sin(p.heading),-Math.cos(p.heading)));
  const s2=Math.max(4,size/90);
  ctx2.beginPath(); ctx2.moveTo(0,-s2); ctx2.lineTo(s2*0.7,s2); ctx2.lineTo(-s2*0.7,s2); ctx2.closePath();
  ctx2.fillStyle='#e8c66a'; ctx2.fill(); ctx2.restore();
}
const mini=$('mini'), minictx=mini.getContext('2d');
let bigOpen=false;
function toggleMap(){ bigOpen=!bigOpen; $('bigmap').style.display=bigOpen?'flex':'none';
  if(bigOpen) sizeBig(); }
function sizeBig(){ const bc=$('bigcv'); const s=Math.floor(Math.min(innerWidth,innerHeight)*0.86);
  bc.width=bc.height=s; drawMapInto(bc.getContext('2d'),s,true); }
$('bigmap').addEventListener('click',toggleMap);

/* ================= PERSISTENCE =================
   localStorage first (works everywhere, incl. GitHub Pages); the sandboxed
   window.storage API is kept as a secondary channel where it exists. */
const SAVE_KEY='voyage:state';
async function saveState(){
  const payload=JSON.stringify({v:6,x:state.boat.x,z:state.boat.z,h:state.boat.heading,
    t:state.simHours,m:state.mode==='walk'?'walk':'boat',wx:state.walk.x,wz:state.walk.z,wh:state.walk.heading,
    vis:[...state.visited],d:Math.round(state.dist),wm:state.windMode,fi:state.fish||0,
    co:state.coins,cg:state.cargo,gm:state.game||0});
  try{ localStorage.setItem(SAVE_KEY,payload); }catch(e){}
  try{ if(window.storage) await window.storage.set(SAVE_KEY,payload); }catch(e){}
}
async function loadSaved(){
  let raw=null;
  try{ if(window.storage){ const r=await window.storage.get(SAVE_KEY); if(r&&r.value) raw=r.value; } }catch(e){}
  if(!raw){ try{ raw=localStorage.getItem(SAVE_KEY); }catch(e){} }
  try{ const o=JSON.parse(raw); if(o&&o.v>=2&&o.v<=6) return o; }catch(e){}
  return null;
}

/* ================= BUTTONS ================= */
$('b-time').onclick=()=>{ state.paused=!state.paused;
  $('b-time').textContent=state.paused?'\u25B6 Loose the sun':'\u23F8 Hold the sun';
  $('b-time').classList.toggle('off',state.paused); };
$('b-speed').onclick=()=>{ state.speedIdx=(state.speedIdx+1)%SPEEDS.length;
  $('b-speed').textContent='\u23E9 Course: '+SPEEDS[state.speedIdx][1]; };
$('b-map').onclick=toggleMap;
$('b-ashore').onclick=toggleAshore;
$('b-fly').onclick=takeFlight;
$('b-dive').onclick=enterDive;
(function(){ const up=$('fp-up'), dn=$('fp-dn'); if(!up||!dn) return;
  function bind(el,val){ el.addEventListener('pointerdown',e=>{ e.preventDefault(); flyPad=val; });
    const off=()=>{ if(flyPad===val) flyPad=0; };
    el.addEventListener('pointerup',off); el.addEventListener('pointercancel',off); el.addEventListener('pointerleave',off); }
  bind(up,1); bind(dn,-1); })();
$('b-names').onclick=()=>{ namesOn=!namesOn;
  $('b-names').textContent='\uD83C\uDFF7 Names: '+(namesOn?'on':'off');
  $('b-names').classList.toggle('off',!namesOn); };
function updateWindBtn(){
  $('b-wind').textContent='\uD83C\udf2C Winds: '+
    (state.windMode==='true'?'true':state.windMode==='fair'?'fair (astern)':'becalmed');
  $('b-wind').classList.toggle('off',state.windMode==='calm');
}
$('b-wind').onclick=()=>{
  state.windMode=state.windMode==='true'?'fair':(state.windMode==='fair'?'calm':'true');
  updateWindBtn(); };
let logOpen=false;
function toggleLog(){
  logOpen=!logOpen; $('logbook').style.display=logOpen?'flex':'none';
  if(!logOpen) return;
  const names=[...state.visited].map(i=>COUNTRIES[i].n).sort();
  const cargoTxt=Object.keys(state.cargo||{}).length
    ? GOODS.filter(g=>state.cargo[g.k]).map(g=>g.n.toLowerCase()+' ×'+state.cargo[g.k]).join(', ')
    : 'the hold stands empty';
  $('log-stats').innerHTML=
    'Lands visited: <b>'+names.length+' / '+COUNTRIES.length+'</b><br>'+
    'Distance sailed: <b>'+Math.round(state.dist/B).toLocaleString()+' km</b><br>'+
    'Purse: <b>'+(state.coins||0)+' shekels</b> · Cargo: <b>'+cargoCount()+' / '+CARGO_MAX+'</b> ('+cargoTxt+')<br>'+
    'Fish drawn from the deep: <b>'+(state.fish||0)+'</b> · Game taken by the spear: <b>'+(state.game||0)+'</b><br>'+
    'Day of the voyage: <b>'+dayOfYear()+'</b>';
  $('log-lands').textContent=names.length?names.join(' \u00B7 '):'No land yet \u2014 the deep awaits.';
}
$('b-log').onclick=toggleLog;
$('prompt').onclick=interact;
$('b-spear').onclick=throwSpear;
$('b-jump').onclick=()=>{ if(state.mode==='walk') state.walk.jumpReq=true; };
$('logbook').addEventListener('click',toggleLog);
$('b-firm').onclick=()=>{ state.firm?exitFirm():enterFirm(); };

/* ================= THE SOUNDS OF THE DEEP =================
   Procedural ambience — the wash of the sea and the breath of the wind,
   swelling with speed and storm. No files, no network. */
let AC=null, seaGain=null, windGain=null, audioOn=true;
function initAudio(){
  if(AC) return;
  try{
    AC=new (window.AudioContext||window.webkitAudioContext)();
    const len=2*AC.sampleRate, buf=AC.createBuffer(1,len,AC.sampleRate), ch=buf.getChannelData(0);
    let last=0;
    for(let i=0;i<len;i++){ const w=Math.random()*2-1; last=(last+0.02*w)/1.02; ch[i]=last*3.5; }
    const sea=AC.createBufferSource(); sea.buffer=buf; sea.loop=true;
    const lp=AC.createBiquadFilter(); lp.type='lowpass'; lp.frequency.value=420;
    seaGain=AC.createGain(); seaGain.gain.value=0.12;
    sea.connect(lp); lp.connect(seaGain); seaGain.connect(AC.destination); sea.start();
    const wind=AC.createBufferSource(); wind.buffer=buf; wind.loop=true; wind.playbackRate.value=0.7;
    const bp=AC.createBiquadFilter(); bp.type='bandpass'; bp.frequency.value=880; bp.Q.value=0.7;
    windGain=AC.createGain(); windGain.gain.value=0;
    wind.connect(bp); bp.connect(windGain); windGain.connect(AC.destination); wind.start();
  }catch(e){ AC=null; }
}
function audioTick(storm){
  if(!AC||!audioOn||!seaGain) return;
  const t=performance.now()*0.001, swell=0.75+0.25*Math.sin(t*0.5);
  const sp=Math.abs(state.boat.speed);
  seaGain.gain.value=(state.mode==='boat'?0.11+Math.min(0.08,sp/500):0.045)*swell;
  windGain.gain.value=0.015+Math.min(0.06,sp/900)+storm*0.1;
}
$('b-sound').onclick=()=>{
  audioOn=!audioOn;
  if(AC){ if(audioOn) AC.resume(); else AC.suspend(); }
  $('b-sound').textContent='🔊 Sound: '+(audioOn?'on':'off');
  $('b-sound').classList.toggle('off',!audioOn); };

/* ================= LAUNCH ================= */
function findStart(){
  let lat=32.1, lon=33.4;
  for(let k=0;k<24;k++){ const r=(90-lat)/180;
    const u=r*Math.sin(lon*Math.PI/180), v=r*Math.cos(lon*Math.PI/180);
    if(!landAtWorld(u*R_WORLD,v*R_WORLD)) return [u*R_WORLD,v*R_WORLD];
    lon-=0.5; }
  return [0.17*R_WORLD,0.26*R_WORLD];
}
let running=false, saveT=0;
async function begin(fresh){
  computeSites(); buildYahru(); buildHome();
  const saved=fresh?null:await loadSaved();
  if(saved){ state.boat.x=saved.x; state.boat.z=saved.z; state.boat.heading=saved.h; state.simHours=saved.t;
    if(saved.v>=3&&saved.m==='walk'){ state.walk.x=saved.wx; state.walk.z=saved.wz;
      state.walk.heading=saved.wh; state.mode='walk'; }
    if(saved.vis) state.visited=new Set(saved.vis);
    if(saved.d) state.dist=saved.d;
    if(saved.fi) state.fish=saved.fi;
    if(saved.co!==undefined) state.coins=saved.co;
    if(saved.cg) state.cargo=saved.cg;
    if(saved.gm) state.game=saved.gm;
    if(saved.wm){ state.windMode=saved.wm; updateWindBtn(); } }
  else{ const [sx,sz]=findStart(); state.boat.x=sx; state.boat.z=sz; state.simHours=9.5; }
  const p0=state.mode==='walk'?state.walk:state.boat;
  updateChunks(p0.x,p0.z,9999);
  $('title-card').style.display='none'; running=true;
  setMode(state.mode); updateWindBtn(); initAudio();
  toast('And Aluahim said, \u201cLet the waters under the shamayim be gathered together into one place, and let the dry land appear.\u201d And it came to be so.','BER\u0114SHITH 1:9');
}
loadSaved().then(s=>{ if(s){ const b=$('btn-continue'); b.style.display='inline-block'; } });
$('btn-sail').onclick=()=>begin(true);
$('btn-continue').onclick=()=>begin(false);

/* a small debug handle — used by the automated smoke tests; harmless in play */
window.__VDBG={state,setMode,updateChunks,SITES,landAtWorld,HATCH,SHIP_S,activeVillages,groundInfo,
  TRADERS,throwSpear,openTrade,cellRaw,sea,seaDeep,waveGrid,shoalAt,camera,scene,seaHeight,WATER_Y};

/* ================= THE GREAT LOOP ================= */
const clock=new THREE.Clock(); let miniT=0, labelT=0;
function frame(){
  requestAnimationFrame(frame);
  const dt=Math.min(0.05,clock.getDelta());
  if(!running){ renderer.render(scene,camera); return; }
  if(!state.paused) state.simHours+=dt*SPEEDS[state.speedIdx][0]/3600;
  stormTick(dt);
  boatTick(dt,state.mode==='boat');
  if(state.mode==='deck') deckTick(dt);
  else if(state.mode==='walk') walkTick(dt);
  else if(state.mode==='fly') flyTick(dt);
  else if(state.mode==='dive') diveTick(dt);
  const p=state.mode==='walk'?state.walk:state.mode==='fly'?state.fly:state.mode==='dive'?state.dive:state.boat;
  const light=skyTick(p.x,p.z);
  /* aloft the air clears and the eye reaches far — open the fog with altitude */
  const eyeY=state.mode==='fly'?state.fly.y:20;
  if(scene.fog&&!state.firm){ const climbF=Math.max(0,eyeY-CLOUD_Y);
    scene.fog.near*=1+climbF/2600;
    scene.fog.far=Math.min(scene.fog.far*(1+climbF/45), R_WORLD*3.0); }
  /* underwater — the light dims and the water closes in with depth */
  if(state.mode==='dive'&&scene.fog){ const depth=SEA_SURF-state.dive.y, murk=Math.min(1,depth/560);
    const wc=mix3(0x061826,0x0f5170,0x36b0d8,1-murk);   /* deep dark → shallow turquoise */
    scene.background.copy(wc); scene.fog.color.copy(wc); scene.fog.near=4; scene.fog.far=470-murk*290;
    hemi.intensity=1.0-murk*0.6; dirL.intensity=0.5-murk*0.32; }
  /* the swimmer's eye dips beneath the swell — the world turns to water-light */
  else if(state.mode==='walk'&&scene.fog){
    const surfC=WATER_Y+seaHeight(camera.position.x,camera.position.z);
    if(camera.position.y<surfC-0.15&&!landAtWorld(camera.position.x,camera.position.z)){
      const wc=mix3(0x0a2836,0x1e7a96,0x3ab2d8,light.dayF);
      scene.background.copy(wc); scene.fog.color.copy(wc);
      scene.fog.near=5; scene.fog.far=320;
      hemi.intensity=0.85; dirL.intensity=0.4;
    }
  }
  /* the firmament vault fades into view the higher he climbs, and stands solid near the top */
  if(flyDome&&!state.firm){ flyDome.material.opacity=Math.max(0,Math.min(1,(eyeY-6000)/42000))*0.34; }
  else if(flyDome){ flyDome.material.opacity=0; }
  updateWallWeather(p.x,p.z,dt);   /* cold fog and blowing snow at the wall of ice */
  waterTick(p.x,p.z,light.dayF,light.storm||0);
  /* below the waterline in the hold, the sea must not wash through the hull;
     and in the dive, the lowered sea-bed plane must not roof the deep */
  if(!state.firm){ const inHold=state.mode==='deck'&&state.deck.level==='hold';
    waveGrid.visible=!inHold; sea.visible=!inHold&&state.mode!=='dive'; }
  seaLifeTick(p.x,p.z,dt);
  splashTick(dt);
  fishTick(dt);
  spearTick(dt);
  crewTick(dt);
  if(!state.firm&&state.mode!=='dive') traderTick(p.x,p.z,dt); else hideTraders();
  audioTick(light.storm||0);
  updateChunks(p.x,p.z,4);
  updateVillages(p.x,p.z,dt,light.nightF);
  cameraTick(dt);
  labelT-=dt; if(labelT<=0){ labelT=0.4; updateLabels(p.x,p.z); placeTick(); }
  miniT-=dt; if(miniT<=0){ miniT=0.5; drawMapInto(minictx,mini.width,false);
    if(bigOpen) sizeBig(); }
  saveT-=dt; if(saveT<=0){ saveT=10; saveState(); }
  if(!state.firm){ const above=Math.max(0,Math.min(1,(eyeY-CLOUD_Y)/90));
    clouds.visible=cirrus.visible=state.mode!=='dive';   /* no sky-clouds seen from under the sea */
    clouds.position.x=p.x; clouds.position.z=p.z;
    TEX.clouds.offset.x=(p.x/9600*7+state.simHours*0.004)%1;
    TEX.clouds.offset.y=(p.z/9600*7)%1;
    /* thin the blocky floor as the eye passes through it, and fade it out well
       above — whether risen on the air or stood high upon the ice wall */
    const pY = state.mode==='fly'?state.fly.y : state.mode==='walk'?(state.walk.feetY!==undefined?state.walk.feetY:20) : 20;
    const highF = Math.max(0,Math.min(1,(pY-CLOUD_Y)/70));
    const gap=Math.abs(eyeY-CLOUD_Y), through=Math.min(1,gap/80);
    cloudMat.opacity*=(0.22+0.78*through)*(1-above*0.9)*(1-highF*0.96);
    cirrus.position.x=p.x; cirrus.position.z=p.z;
    const climb=Math.max(0,Math.min(1,(eyeY-CLOUD_Y)/900));
    cirrusMat.opacity=(0.08+light.dayF*0.16)*Math.min(1,climb*1.5)*(1-above*0.7);
    /* the sea of clouds — a bumpy, shaded deck with wisps drifting above */
    cloudDeck.visible=cloudWisp.visible=cloudCover.visible=above>0.003;
    if(above>0.003){
      cloudDeck.position.set(p.x,CLOUD_Y,p.z); updateCloudDeck(p.x,p.z);
      cloudDeckMat.opacity=above; cloudDeckMat.color.copy(mix3(0x6b7690,0xe6cba4,0xffffff,light.dayF));
      cloudWisp.position.x=p.x; cloudWisp.position.z=p.z;
      wispMat.opacity=above*0.5; wispMat.color.copy(mix3(0x4a5570,0xe0c49c,0xffffff,light.dayF));
      const dr2=state.simHours*0.006;
      wispMat.map.offset.set((p.x/100000*30+dr2)%1,(p.z/100000*30)%1);
      /* the fixed cover mantles the whole earth (does NOT follow the traveller) */
      cloudCover.material.opacity=above*0.97; cloudCover.material.color.copy(mix3(0x59637a,0xe0c6a0,0xffffff,light.dayF));
    } }
  if(!state.firm&&state.mode==='dive') updateDeep(state.dive.x,state.dive.y,state.dive.z,dt,Math.min(1,(SEA_SURF-state.dive.y)/560));
  else if(deepShown) hideDeep();
  /* the beasts of the field and the fowl of the air, over all the earth */
  if(!state.firm&&state.mode!=='dive'){ const tt=performance.now()*0.001, night=(light.nightF||0)>0.5;
    updateAirLife(p.x,p.z,dt,tt,night);
    if(state.mode==='boat'||state.mode==='deck'||state.mode==='walk') updateLandLife(p.x,p.z,dt,tt); else hideLandLife(); }
  else { hideLandLife(); hideAirLife(); }
  if(state.firm&&firmMark) firmMark.position.set(p.x,R_WORLD*0.012,p.z);
  seaTex.offset.x=(performance.now()*0.000012)%1; seaTex.offset.y=(performance.now()*0.000009)%1;
  const _pn=performance.now();
  TEX.surf.offset.x=(_pn*0.00006)%1; TEX.surf.offset.y=(_pn*0.00013)%1;
  surfMat.opacity=0.42+0.28*Math.sin(_pn*0.0022);      /* the wash advancing and drawing back */
  renderer.render(scene,camera);
}
frame();
};
