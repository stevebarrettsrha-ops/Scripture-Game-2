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
blockMat('tallgrass',TEX.tallgrass,{alphaTest:0.4}); blockMat('flowerR',TEX.flowerR,{alphaTest:0.4});
blockMat('flowerY',TEX.flowerY,{alphaTest:0.4}); blockMat('crop',TEX.crop,{alphaTest:0.4});
blockMat('glass',TEX.glass,{transparent:true,depthWrite:false});
blockMat('door',TEX.door,{alphaTest:0.1});
blockMat('waterB',TEX.water);
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
    return {h:5+Math.floor(t*16+n*5), kind:'wall', tree:0, ci:0}; }
  if(r>=SHELF_UV){ if(n>0.62){ return {h:1, kind:'floe', tree:0, ci:0}; } return null; }
  /* domain-warp the coast: sub-pixel fractal detail where the vector data runs out */
  const du2=(fbm(u*760+13.7,v*760-4.2)-0.5)*(2.6/HALF);
  const dv2=(fbm(u*760-8.1,v*760+9.3)-0.5)*(2.6/HALF);
  const wu=u+du2, wv=v+dv2;
  const ci=countryAtUV(wu,wv);
  if(!ci) return null;
  if(riverAtUV(wu,wv)) return null;   /* a river runs here — open water */
  let cnt=0; const s=1.6/HALF;
  if(countryAtUV(wu+s,wv))cnt++; if(countryAtUV(wu-s,wv))cnt++;
  if(countryAtUV(wu,wv+s))cnt++; if(countryAtUV(wu,wv-s))cnt++;
  const inland=cnt/4;
  let h=1+Math.floor(Math.pow(n,1.25)*(1+inland*9));
  const snow = lat>72 || lat<-55 || h>=9;
  const tundra = lat>58 && lat<=72;
  const desert = lat>11 && lat<36 && n2>0.42 && inland>0.5;
  const tropic = lat<=11 && lat>-38;
  let kind, tree=0;
  if(h<=2 && inland<1 && !snow && !tundra){ kind='sand'; h=Math.min(h,2); }
  else if(snow) kind='snow';
  else if(tundra){ kind='tundra'; tree=j<0.02?1:0; }
  else if(desert){ kind='desert'; }
  else if(tropic){ kind='tropic'; tree=j<0.085?2:0; }
  else { kind='grass'; tree=j<0.06?1:0; }
  if(kind!=='sand'&&h>=7&&!snow){ kind='rock'; tree=0; }
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
  if(kind==='tropic') return 'grassTopTr';
  if(kind==='tundra') return 'grassTopTu';
  return 'grassTop';
}
function sideMatsFor(kind){ /* [topBlockSide, lowerSide] */
  if(kind==='sand'||kind==='desert') return ['sand','sand'];
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
  const tropic=cc.tree===2;
  const trunkH=tropic?B*3.2:B*2.2, tw=B*0.42;
  emitBox(G, x-tw,yT,z-tw, x+tw,yT+trunkH,z+tw, 'logSide','logTop',null);
  const lm=tropic?'leavesTr':'leaves';
  if(tropic){
    emitBox(G, x-B*1.6,yT+trunkH,z-B*0.5, x+B*1.6,yT+trunkH+B*0.6,z+B*0.5, lm,lm,lm);
    emitBox(G, x-B*0.5,yT+trunkH,z-B*1.6, x+B*0.5,yT+trunkH+B*0.6,z+B*1.6, lm,lm,lm);
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
    if(!cc){ /* shallow shelf where land lies near: sand seen through the water */
      const nb=cell(ix+1,iz)||cell(ix-1,iz)||cell(ix,iz+1)||cell(ix,iz-1);
      if(nb&&nb.kind!=='wall'&&nb.kind!=='floe'){
        const x0=ix*B, z0=iz*B;
        faceTop(G,'sand',x0,z0,x0+B,z0+B,WATER_Y-1.5,0.92);
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
seaDeep.rotation.x=-Math.PI/2; seaDeep.position.y=-2.5; scene.add(seaDeep);
const sea=new THREE.Mesh(new THREE.CircleGeometry(R_WORLD*1.002,120),seaMat);
sea.rotation.x=-Math.PI/2; sea.position.y=WATER_Y; scene.add(sea);

/* flat drifting clouds, minecraft-fashion */
const cloudMat=new THREE.MeshBasicMaterial({map:TEX.clouds,transparent:true,opacity:0.85,depthWrite:false,fog:false,side:THREE.DoubleSide});
TEX.clouds.repeat.set(7,7);
const clouds=new THREE.Mesh(new THREE.PlaneGeometry(9600,9600),cloudMat);
clouds.rotation.x=-Math.PI/2; clouds.position.y=238; scene.add(clouds);

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
  walk:{x:0,z:0,heading:0}, windMode:'true', firm:false, firmDist:0, camYaw:0, camPitch:0.42, camDist:78,
  visited:new Set(), dist:0 };

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
const boatG=new THREE.Group();
{ const hull=texBox(10,4,26,'planks','planks'); hull.position.y=2; boatG.add(hull);
  const bow=texBox(8,3.4,6,'planks'); bow.position.set(0,2.2,-15); boatG.add(bow);
  const stern=texBox(9,5,4,'planks'); stern.position.set(0,3,13.5); boatG.add(stern);
  const rimL=texBox(1.4,2,26,'logSide','logTop'); rimL.position.set(4.6,4.6,0); boatG.add(rimL);
  const rimR=rimL.clone(); rimR.position.x=-4.6; boatG.add(rimR);
  const mast=texBox(1.2,26,1.2,'logSide','logTop'); mast.position.set(0,16,1); boatG.add(mast);
  const boom=texBox(1,1,14,'logSide'); boom.position.set(0,8,-3); boatG.add(boom);
  const sail=new THREE.Mesh(new THREE.PlaneGeometry(13,15),
    new THREE.MeshBasicMaterial({map:TEX.wool,side:THREE.DoubleSide}));
  sail.material.color.setRGB(1,1,1); LIT.push(sail.material);
  sail.position.set(0,16.5,-2.2); boatG.add(sail);
  const flag=texBox(4,2,0.3,'hayTop'); flag.position.set(2,28.5,1); boatG.add(flag);
  boatG.userData={flag};
  scene.add(boatG); }

/* ================= THE TRAVELLER (steve-fashion) ================= */
function lam(col){ return new THREE.MeshLambertMaterial({color:col}); }
function lbox(w,h,d,col){ return new THREE.Mesh(new THREE.BoxGeometry(w,h,d),lam(col)); }
const faceTexP=mkTex(g=>{ g.fillStyle='rgb(199,140,95)'; g.fillRect(0,0,16,16);
  g.fillStyle='rgb(90,58,38)'; g.fillRect(0,0,16,5);
  g.fillStyle='rgb(255,255,255)'; g.fillRect(3,7,3,2); g.fillRect(10,7,3,2);
  g.fillStyle='rgb(70,50,140)'; g.fillRect(4,7,2,2); g.fillRect(11,7,2,2);
  g.fillStyle='rgb(160,105,70)'; g.fillRect(7,9,2,3);
  g.fillStyle='rgb(120,72,48)'; g.fillRect(6,12,4,1); });
const walkerG=new THREE.Group();
{ const skinC=0xc78c5f;
  const headMats=[lam(skinC),lam(skinC),lam(0x4a3524),lam(skinC),
    new THREE.MeshLambertMaterial({map:faceTexP}),lam(skinC)];
  const head=new THREE.Mesh(new THREE.BoxGeometry(3,3,3),headMats); head.position.y=10.4; walkerG.add(head);
  const body=lbox(3,4.6,1.7,0x2a8a8a); body.position.y=6.6; walkerG.add(body);
  /* limbs pivot at the hip and shoulder (geometry shifted so its origin sits
     at the top) — swinging legs no longer sink into the body or the ground */
  const legL=lbox(1.35,4.2,1.5,0x3a3a8a); legL.geometry.translate(0,-2.1,0);
  legL.position.set(0.78,4.3,0); walkerG.add(legL);
  const legR=legL.clone(); legR.position.x=-0.78; walkerG.add(legR);
  const armL=lbox(1.2,4.4,1.5,0x2a8a8a); armL.geometry.translate(0,-2.2,0);
  armL.position.set(2.15,8.7,0); walkerG.add(armL);
  const armR=armL.clone(); armR.position.x=-2.15; walkerG.add(armR);
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
    g.fillRect(7,8,2,6); });
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
function makeVillager(seed){
  const g=new THREE.Group();
  const sk=[0xc79467,0xb07c54,0x966642,0x7c5436][Math.floor(hash2(seed,1)*4)];
  const robeIdx=Math.floor(hash2(seed,2)*ROBES.length), robeM=robeMatFor(robeIdx);
  const body=new THREE.Mesh(new THREE.BoxGeometry(2.8,4.4,1.9),robeM); body.position.y=3.7; g.add(body);
  const hem=lbox(3,0.7,2.05,0x3a2c1c); hem.position.y=1.2; g.add(hem);
  const arms=new THREE.Mesh(new THREE.BoxGeometry(3.4,1.1,1),robeM); arms.position.set(0,5.1,1.05); g.add(arms);
  const headMats=[lam(sk),lam(sk),lam(0x50412e),lam(sk),
    new THREE.MeshLambertMaterial({map:villagerFaceTex(seed)}),lam(sk)];
  const head=new THREE.Mesh(new THREE.BoxGeometry(2.6,2.9,2.6),headMats);
  head.position.y=7.4; g.add(head);
  const nose=lbox(0.65,1.5,0.75,sk); nose.position.set(0,6.9,1.5); g.add(nose);
  g.userData={legs:[]};
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
  } else { /* camel */
    const body=lbox(2.8,3,5.6,0xc8a06a); body.position.y=4.8; g.add(body);
    const hump=lbox(1.9,1.4,2,0xb8905a); hump.position.set(0,6.9,0.4); g.add(hump);
    const neck=lbox(1.2,2.8,1.2,0xc8a06a); neck.position.set(0,6.6,2.6); g.add(neck);
    const head=lbox(1.4,1.2,2,0xb8905a); head.position.set(0,8.2,3.2); g.add(head);
    fourLegs(1,2.1,3.3,0xb08a56);
  }
  g.userData={legs};
  return g;
}

/* ================= VILLAGES (minecraft-fashion) =================
   Cobblestone bases, oak plank walls with log corner posts, glass
   panes, doors, stepped plank roofs with an overhang; dirt paths,
   fenced farms with crops and a water channel, hay bales, a well,
   and lamp posts that burn when the sun departs.                  */
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
  /* the door leaf, swung open against the outside wall beside the gap */
  const dy0=y+B*0.05, dy1=y+B*2.05, dw=B*0.92;
  if(doorDir===0) quad(G,'door', hx+gw,dy0,z1+0.14, hx+gw+dw,dy0,z1+0.14, hx+gw+dw,dy1,z1+0.14, hx+gw,dy1,z1+0.14, 0,0,1,1, 1.0);
  else if(doorDir===1) quad(G,'door', hx-gw,dy0,z0-0.14, hx-gw-dw,dy0,z0-0.14, hx-gw-dw,dy1,z0-0.14, hx-gw,dy1,z0-0.14, 0,0,1,1, 1.0);
  else if(doorDir===2) quad(G,'door', x1+0.14,dy0,hz+gw, x1+0.14,dy0,hz+gw+dw, x1+0.14,dy1,hz+gw+dw, x1+0.14,dy1,hz+gw, 0,0,1,1, 1.0);
  else quad(G,'door', x0-0.14,dy0,hz-gw, x0-0.14,dy0,hz-gw-dw, x0-0.14,dy1,hz-gw-dw, x0-0.14,dy1,hz-gw, 0,0,1,1, 1.0);
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
  /* furnishings — a wool bed in the corner far from the door, a table on a
     log leg, and a chair with a backrest drawn up beside it */
  const fy=y+B*0.58;
  const bx=doorDir===3?x1-T-B*0.85:x0+T+B*0.85, bz=doorDir===1?z1-T-B*1.05:z0+T+B*1.05;
  emitBox(G, bx-B*0.55,fy,bz-B*0.85, bx+B*0.55,fy+B*0.38,bz+B*0.85, 'planks','wool',null);
  emitBox(G, bx-B*0.42,fy+B*0.38,bz-B*0.72, bx+B*0.42,fy+B*0.52,bz-B*0.22, 'wool','hayTop',null);
  const tx=Math.min(Math.max(hx+(doorDir===2?-B*0.9:B*0.7), x0+T+B*0.7), x1-T-B*0.7);
  const tz=Math.min(Math.max(hz+(doorDir===0?-B*0.9:B*0.7), z0+T+B*0.7), z1-T-B*0.7);
  emitBox(G, tx-B*0.1,fy,tz-B*0.1, tx+B*0.1,fy+B*0.62,tz+B*0.1, 'logSide','logTop',null);
  emitBox(G, tx-B*0.5,fy+B*0.62,tz-B*0.5, tx+B*0.5,fy+B*0.74,tz+B*0.5, 'planks','benchTop',null);
  const cx2=Math.min(tx+B*0.95, x1-T-B*0.4), cz2=tz;
  emitBox(G, cx2-B*0.3,fy,cz2-B*0.3, cx2+B*0.3,fy+B*0.42,cz2+B*0.3, 'planks','planks',null);
  emitBox(G, cx2+B*0.18,fy+B*0.42,cz2-B*0.3, cx2+B*0.3,fy+B*1.05,cz2+B*0.3, 'planks','planks',null);
  ex.torchIn.push({x:hx,y:fy+B*2.05,z:hz});
  ex.doors.push({x:hx+(doorDir===2?w*B/2+B:doorDir===3?-w*B/2-B:0),
                 z:hz+(doorDir===0?d*B/2+B:doorDir===1?-d*B/2-B:0)});
  ex.houses.push({x0,x1,z0,z1,
    dx:doorDir===2?x1-T/2:doorDir===3?x0+T/2:hx,
    dz:doorDir===0?z1-T/2:doorDir===1?z0+T/2:hz, gw});
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
function spawnVillage(i){
  const site=SITES[i]; if(!site){ activeVillages.set(i,{none:true}); return; }
  const rnd=k=>hash2(i*31.7+k*7.7, i*11.3+k*3.9);
  const G=newG(); const ex={doors:[],houses:[],torchIn:[]};
  const wy=topY(site.ix,site.iz);
  /* houses in a ring about the well */
  const nH=3+Math.floor(rnd(1)*3);
  const houseAt=[];
  for(let h=0;h<nH;h++){
    const ang=rnd(h+2)*Math.PI*2, rad=(4.2+rnd(h+9)*3.4)*B;
    const hx=site.x+Math.cos(ang)*rad, hz=site.z+Math.sin(ang)*rad;
    const hc=landAtWorld(hx,hz); if(!hc||hc.kind==='wall'||hc.kind==='floe') continue;
    const y=hc.h*B;
    const w=3+Math.floor(rnd(h+20)*2)*1, d=3+Math.floor(rnd(h+25)*3);
    /* the door faces the well */
    const dx=site.x-hx, dz=site.z-hz;
    const doorDir=Math.abs(dz)>=Math.abs(dx) ? (dz>0?0:1) : (dx>0?2:3);
    emitHouse(G,ex, hx,hz,y, w,d, doorDir, i*100+h);
    houseAt.push({x:hx,z:hz});
  }
  emitWell(G, site.x, site.z, wy);
  /* paths from the well to every door */
  for(const dr of ex.doors) emitPathLine(G, site.x,site.z, dr.x,dr.z);
  /* a farm or two */
  const nF=1+(rnd(40)>0.55?1:0);
  for(let f=0;f<nF;f++){
    const ang=rnd(f+44)*Math.PI*2, rad=(7+rnd(f+48)*3)*B;
    const fx=site.x+Math.cos(ang)*rad, fz=site.z+Math.sin(ang)*rad;
    const fc=landAtWorld(fx,fz); if(!fc||fc.kind==='wall') continue;
    emitFarm(G, fx,fz, fc.h*B, i*100+f);
    emitPathLine(G, site.x,site.z, fx,fz);
  }
  /* hay bales */
  for(let hb=0; hb<1+Math.floor(rnd(52)*3); hb++){
    const ang=rnd(hb+54)*Math.PI*2, rad=(3+rnd(hb+58)*5)*B;
    const x=site.x+Math.cos(ang)*rad, z=site.z+Math.sin(ang)*rad;
    const c2=landAtWorld(x,z); if(!c2||c2.kind==='wall') continue;
    emitHay(G,x,z,c2.h*B);
  }
  /* a fenced pen for the beasts */
  { const ang=rnd(130)*Math.PI*2, rad=(6+rnd(133)*3)*B;
    const px2=site.x+Math.cos(ang)*rad, pz2=site.z+Math.sin(ang)*rad;
    const pc=landAtWorld(px2,pz2);
    if(pc&&pc.kind!=='wall'&&pc.kind!=='floe'){ emitPen(G,px2,pz2,pc.h*B,4,3);
      emitPathLine(G,site.x,site.z,px2,pz2); } }
  /* a crafting bench by the well */
  { const bx=site.x+B*1.9, bz=site.z-B*1.4; const bc=landAtWorld(bx,bz);
    if(bc&&bc.kind!=='wall') emitBench(G,bx,bz,bc.h*B); }
  /* lamp posts with torches */
  const torches=[]; const glowSprites=[];
  for(let t=0;t<3;t++){ const ang=rnd(t+62)*Math.PI*2, rad=(2.5+rnd(t+66)*4)*B;
    const tx=site.x+Math.cos(ang)*rad, tz=site.z+Math.sin(ang)*rad;
    const tc2=landAtWorld(tx,tz); if(!tc2||tc2.kind==='wall') continue;
    const ty=tc2.h*B;
    emitBox(G, tx-0.5,ty,tz-0.5, tx+0.5,ty+B*1.6,tz+0.5, 'logSide','logTop',null);
    torches.push({x:tx,y:ty+B*1.6,z:tz});
  }
  torches.push(...ex.torchIn);          /* the hearth-lights within the houses */
  /* the pier, if the sea lies near */
  const deckKeys=buildPier(G,ex,site,rnd,torches)||[];
  /* build the merged meshes */
  const g=new THREE.Group();
  for(const mat in G){ const gg=G[mat];
    const bg=new THREE.BufferGeometry();
    bg.setAttribute('position',new THREE.Float32BufferAttribute(gg.p,3));
    bg.setAttribute('uv',new THREE.Float32BufferAttribute(gg.uv,2));
    bg.setAttribute('color',new THREE.Float32BufferAttribute(gg.c,3));
    bg.setIndex(gg.i); g.add(new THREE.Mesh(bg,MAT[mat])); }
  /* torch tips + night glow */
  const torchMats=[];
  for(const tp of torches){
    const tip=new THREE.Mesh(new THREE.BoxGeometry(1.4,1.7,1.4),torchMat);
    tip.position.set(tp.x,tp.y+0.9,tp.z); g.add(tip);
    const gm2=new THREE.SpriteMaterial({map:glowTexCv,transparent:true,opacity:0,depthWrite:false});
    const gs=new THREE.Sprite(gm2); gs.scale.set(26,26,1);
    gs.position.set(tp.x,tp.y+2,tp.z); g.add(gs); torchMats.push(gm2);
  }
  /* the people of the land */
  const people=[]; const nP=2+Math.floor(rnd(70)*3);
  for(let p=0;p<nP;p++){ const per=makeVillager(i*100+p);
    per.position.set(site.x+B,wy,site.z+B); g.add(per);
    people.push({m:per,tx:site.x,tz:site.z,t:rnd(p+80)*4,seed:i*100+p}); }
  /* the beasts of the field */
  const lat=90-Math.hypot(site.x/R_WORLD,site.z/R_WORLD)*180;
  const baseKind=(cellRaw(site.ix,site.iz)||{kind:'grass'}).kind;
  const roster = baseKind==='desert' ? ['camel','camel','chicken']
    : lat>55 ? ['sheep','sheep','chicken'] : ['sheep','cow','pig','chicken','chicken'];
  const beasts=[]; const nA=2+Math.floor(rnd(91)*3);
  for(let a2=0;a2<nA;a2++){ const kind=roster[Math.floor(rnd(a2+95)*roster.length)]||'sheep';
    const an=makeAnimal(kind);
    an.position.set(site.x-B,wy,site.z-B); g.add(an);
    beasts.push({m:an,tx:site.x,tz:site.z,t:rnd(a2+97)*4,seed:i*100+50+a2}); }
  scene.add(g);
  activeVillages.set(i,{g,site,people,beasts,torchMats,deckKeys,houses:ex.houses});
}
function wanderTick(ent,site,dt,speed){
  ent.t-=dt;
  if(ent.t<=0){ ent.t=2+hash2(ent.seed,(performance.now()%9973)*0.13)*5;
    const a=Math.random()*Math.PI*2, r=Math.random()*4.6*B;
    const nx=site.x+Math.cos(a)*r, nz=site.z+Math.sin(a)*r;
    const cc=landAtWorld(nx,nz); if(cc&&cc.kind!=='wall'){ ent.tx=nx; ent.tz=nz; } }
  const dx=ent.tx-ent.m.position.x, dz=ent.tz-ent.m.position.z;
  const d=Math.hypot(dx,dz); let moving=d>0.6;
  if(moving){ const nx=ent.m.position.x+dx/d*speed*dt, nz=ent.m.position.z+dz/d*speed*dt;
    if(blockedByStructure(nx,nz)){ moving=false; ent.t=0; /* pick a new way */ }
    else { ent.m.position.x=nx; ent.m.position.z=nz; ent.m.rotation.y=Math.atan2(dx,dz); } }
  ent.m.position.y=topY(Math.floor(ent.m.position.x/B),Math.floor(ent.m.position.z/B));
  const legs=ent.m.userData.legs;
  if(legs&&legs.length){ const ph=performance.now()*0.012;
    for(const L of legs) L.rotation.x=moving?Math.sin(ph+L.userData.ph)*0.55:0; }
  else if(moving) ent.m.position.y+=Math.abs(Math.sin(performance.now()*.012))*0.35;
}
function updateVillages(px,pz,dt,nightF){
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
    for(const p of vv.people) wanderTick(p,vv.site,dt,7);
    for(const b2 of vv.beasts) wanderTick(b2,vv.site,dt,4.5);
    for(const tm of vv.torchMats) tm.opacity=nightF*0.85;
  }
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
  if(e.code==='KeyE') toggleAshore();
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
      else{ state.camDist=Math.max(30,Math.min(240,state.camDist*f));
        if(state.camDist>=239.5&&f>1) enterFirm(); }
      return; }
  }
  if(joy&&e.pointerId===joy.id){ joy.dx=Math.max(-60,Math.min(60,e.clientX-joy.x0));
    joy.dy=Math.max(-60,Math.min(60,e.clientY-joy.y0));
    const k=$('joyk'); k.style.transform='translate('+joy.dx*0.55+'px,'+joy.dy*0.55+'px)'; return; }
  if(drag&&e.pointerId===drag.id){ const ddx=e.clientX-drag.x, ddy=e.clientY-drag.y;
    drag.mv+=Math.abs(ddx)+Math.abs(ddy);
    state.camYaw-=ddx*0.0048;
    state.camPitch=Math.max(0.08,Math.min(1.25,state.camPitch+ddy*0.004));
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
  state.mode='boat'; walkerG.visible=false; updateAshoreBtn(); exitFirm();
  updateChunks(px,pz,9999);
  toast('A fair wind carries you to the coasts of '+co.n+'.');
  saveState();
}
cv.addEventListener('wheel',e=>{ e.preventDefault();
  if(state.firm){ state.firmDist=Math.max(R_WORLD*0.12,Math.min(R_WORLD*2.4,state.firmDist*Math.exp(e.deltaY*0.0012)));
    if(state.firmDist<=R_WORLD*0.125&&e.deltaY<0) exitFirm(); return; }
  state.camDist=Math.max(30,Math.min(240,state.camDist*Math.exp(e.deltaY*0.0012)));
  if(state.camDist>=239.5&&e.deltaY>0) enterFirm(); },{passive:false});
function axis(){
  let f=0,t=0;
  if(keys.KeyW||keys.ArrowUp)f+=1; if(keys.KeyS||keys.ArrowDown)f-=1;
  if(keys.KeyA||keys.ArrowLeft)t-=1; if(keys.KeyD||keys.ArrowRight)t+=1;
  if(joy){ f+=-joy.dy/48; t+=joy.dx/48; }
  return [Math.max(-1,Math.min(1,f)), Math.max(-1,Math.min(1,t))];
}

/* ================= MOVEMENT ================= */
function blockedForBoat(x,z){ const cc=landAtWorld(x,z); if(cc) return true;
  return Math.hypot(x,z)/R_WORLD>0.985; }
function boatTick(dt){
  const bt=state.boat; const [f,t]=axis();
  const st=stormAt(bt.x,bt.z);
  const target=f*40*SPEEDS[state.speedIdx][2]*sailFactor(bt.heading)*(1-0.45*st);
  bt.speed+=(target-bt.speed)*Math.min(1,dt*1.2);
  if(Math.abs(bt.speed)>0.4) bt.heading+=t*dt*(0.85+Math.min(1,Math.abs(bt.speed)/22)*0.6);
  const nx=bt.x+Math.sin(bt.heading)*bt.speed*dt, nz=bt.z+Math.cos(bt.heading)*bt.speed*dt;
  /* probe ahead of the motion: the bow when sailing, the stern when reversing */
  const sgn=bt.speed>=0?1:-1;
  const bowX=nx+Math.sin(bt.heading)*16*sgn, bowZ=nz+Math.cos(bt.heading)*16*sgn;
  if(!blockedForBoat(bowX,bowZ)&&!blockedForBoat(nx,nz)){
    state.dist+=Math.hypot(nx-bt.x,nz-bt.z); bt.x=nx; bt.z=nz; }
  else bt.speed*=-0.15;
  const tnow=performance.now()*0.001, swell=1+st*1.6;
  boatG.position.set(bt.x, WATER_Y+1.1+Math.sin(tnow*1.5)*0.55*swell, bt.z);
  boatG.rotation.set(Math.sin(tnow*1.2)*0.02*swell - bt.speed*0.002, bt.heading,
    Math.sin(tnow*0.9)*0.03*swell + t*Math.min(1,Math.abs(bt.speed)/24)*0.12);
  const w=windAt(bt.x,bt.z);                       // the pennant flies downwind
  if(boatG.userData.flag) boatG.userData.flag.rotation.y=Math.atan2(w.x,w.z)-bt.heading;
}
/* solid structures: house walls stop you (save for the doorway), trees stop you */
function blockedByStructure(nx,nz){
  for(const[,vv] of activeVillages){ if(!vv.houses||!vv.site) continue;
    if(Math.hypot(nx-vv.site.x,nz-vv.site.z)>420) continue;
    for(const H of vv.houses){
      const m=1.2;
      if(nx>H.x0-m&&nx<H.x1+m&&nz>H.z0-m&&nz<H.z1+m){
        const T2=B*0.5+1.0;
        if(nx>H.x0+T2&&nx<H.x1-T2&&nz>H.z0+T2&&nz<H.z1-T2) return false;  // within the room
        if(Math.hypot(nx-H.dx,nz-H.dz)<H.gw+1.5) return false;            // the doorway
        return true;
      }
    }
  }
  return false;
}
function treeBlocked(nx,nz){
  const c=landAtWorld(nx,nz); if(!c||!c.tree) return false;
  const ix=Math.floor(nx/B), iz=Math.floor(nz/B);
  return Math.hypot(nx-(ix+.5)*B, nz-(iz+.5)*B)<B*0.55;
}
function walkTick(dt){
  const w=state.walk; const [f,t]=axis();
  w.heading+=t*dt*2.4;
  const sp=f*18;
  const nx=w.x+Math.sin(w.heading)*sp*dt, nz=w.z+Math.cos(w.heading)*sp*dt;
  const cc=landAtWorld(nx,nz);
  const onDeckNext=deckMap.get(Math.floor(nx/B)+','+Math.floor(nz/B));
  const nearBoat=Math.hypot(nx-state.boat.x,nz-state.boat.z)<26;
  if(((cc&&cc.kind!=='wall')||nearBoat||onDeckNext!==undefined)
     &&!blockedByStructure(nx,nz)&&!treeBlocked(nx,nz)){
    state.dist+=Math.hypot(nx-w.x,nz-w.z); w.x=nx; w.z=nz; }
  const dk=deckMap.get(Math.floor(w.x/B)+','+Math.floor(w.z/B));
  const c2=landAtWorld(w.x,w.z);
  const gy=dk!==undefined?dk:(c2?c2.h*B:WATER_Y);
  walkerG.position.set(w.x,gy,w.z); walkerG.rotation.y=w.heading;
  const ph=performance.now()*0.011;
  const moving=Math.abs(sp)>0.5; const u=walkerG.userData;
  u.legL.rotation.x=moving?Math.sin(ph)*0.7:0; u.legR.rotation.x=moving?-Math.sin(ph)*0.7:0;
  u.armL.rotation.x=moving?-Math.sin(ph)*0.5:0; u.armR.rotation.x=moving?Math.sin(ph)*0.5:0;
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
function toggleAshore(){
  if(state.mode==='boat'){
    const bt=state.boat;
    for(let rad=1;rad<8;rad++) for(let a=0;a<rad*8;a++){
      const th=a/(rad*8)*Math.PI*2;
      const x=bt.x+Math.cos(th)*rad*B, z=bt.z+Math.sin(th)*rad*B;
      const cc=landAtWorld(x,z);
      if(cc&&cc.kind!=='wall'){ state.walk.x=x; state.walk.z=z; state.walk.heading=bt.heading;
        state.mode='walk'; walkerG.visible=true; updateAshoreBtn(); markDiscovery(x,z); return; }
    }
    let bestD=null;
    for(const [k,yv] of deckMap){ const parts=k.split(','),ix=+parts[0],iz=+parts[1];
      const x=(ix+.5)*B, z=(iz+.5)*B, dd=Math.hypot(x-bt.x,z-bt.z);
      if(dd<10*B&&(!bestD||dd<bestD.dd)) bestD={x,z,dd}; }
    if(bestD){ state.walk.x=bestD.x; state.walk.z=bestD.z; state.walk.heading=bt.heading;
      state.mode='walk'; walkerG.visible=true; updateAshoreBtn(); markDiscovery(bestD.x,bestD.z); return; }
    toast('No shore within reach — draw nearer to the land.');
  } else {
    if(Math.hypot(state.walk.x-state.boat.x,state.walk.z-state.boat.z)<40){
      state.mode='boat'; walkerG.visible=false; updateAshoreBtn();
    } else toast('The ship lies too far off — return to the water\u2019s edge.');
  }
}
function updateAshoreBtn(){ $('b-ashore').textContent = state.mode==='boat' ? '\u2693 Go ashore' : '\u26F5 Board the ship'; }

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
  g.strokeStyle='#2e5f8e'; g.lineWidth=2.4; g.lineCap='round'; g.lineJoin='round';
  for(const rv of RIVERS){ g.beginPath();
    rv.pts.forEach((p,k)=>{ const r=(90-p[0])/180, a=p[1]*Math.PI/180;
      const x=(r*Math.sin(a)+1)*Hh, yq=(r*Math.cos(a)+1)*Hh;
      k?g.lineTo(x,yq):g.moveTo(x,yq); });
    g.stroke(); }
  g.beginPath(); g.arc(Hh,Hh,Hh*0.999,0,Math.PI*2); g.arc(Hh,Hh,Hh*ICE_UV,0,Math.PI*2,true);
  g.fillStyle='#e8f0f7'; g.fill('evenodd');
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
  firmG.visible=false; scene.add(firmG);
}
let firmHintShown=false;
function enterFirm(){ buildFirmament(); state.firm=true; firmG.visible=true;
  scene.fog=null; state.firmDist=R_WORLD*1.05; state.camPitch=1.05;
  sea.visible=false; seaDeep.visible=false;
  if(!firmHintShown&&running){ firmHintShown=true;
    toast('Tap a land you have already visited, and a fair wind will carry you to its coasts.'); }
  clouds.scale.set(26,26,1); clouds.position.set(0,R_WORLD*0.03,0);
  $('b-firm').textContent='\u26F5 Return to the ship'; }
function exitFirm(){ state.firm=false; if(firmG) firmG.visible=false;
  scene.fog=FOG; state.camPitch=0.42; state.camDist=200;
  sea.visible=true; seaDeep.visible=true;
  clouds.scale.set(1,1,1); clouds.position.y=238;
  $('b-firm').textContent='\uD83D\udd4A The firmament'; }

/* ================= CAMERA ================= */
const camTgt=new THREE.Vector3(), camPos=new THREE.Vector3();
function cameraTick(dt){
  if(state.firm){ const pit=Math.max(0.3,Math.min(1.5,state.camPitch));
    const Rd=state.firmDist;
    camPos.set(Math.sin(state.camYaw)*Math.cos(pit)*Rd, Math.sin(pit)*Rd+200, Math.cos(state.camYaw)*Math.cos(pit)*Rd);
    camera.position.lerp(camPos,Math.min(1,dt*2.5)); camera.lookAt(0,0,0); return; }
  const p=state.mode==='boat'?state.boat:state.walk;
  const [f2]=axis(); if(Math.abs(f2)>0.2) state.camYaw*=Math.max(0,1-dt*0.5);
  const baseY=state.mode==='boat'?boatG.position.y:walkerG.position.y;
  const dist=state.mode==='boat'?state.camDist:Math.min(state.camDist,60);
  const az=p.heading+Math.PI+state.camYaw;
  const cy=baseY+8+Math.sin(state.camPitch)*dist;
  camPos.set(p.x+Math.sin(az)*Math.cos(state.camPitch)*dist, cy, p.z+Math.cos(az)*Math.cos(state.camPitch)*dist);
  camera.position.lerp(camPos,Math.min(1,dt*5));
  camTgt.set(p.x,baseY+12,p.z);
  camera.lookAt(camTgt);
}

/* ================= HUD ================= */
function toast(txt,ref){ $('verse-t').textContent=txt; $('verse-r').textContent=ref||'';
  const v=$('verse'); v.style.opacity=1;
  clearTimeout(toast._t); toast._t=setTimeout(()=>{v.style.opacity=0;}, ref?11000:5200); }
const seen={wall:false,yahru:false};
function placeTick(){
  const p=state.mode==='boat'?state.boat:state.walk;
  const u=p.x/R_WORLD, v=p.z/R_WORLD, r=Math.hypot(u,v);
  let txt;
  if(r>0.9){ txt='THE WALL OF ICE';
    if(!seen.wall){ seen.wall=true; const vs=VERSES.find(q=>q.ref.indexOf('26:10')>=0);
      if(vs) toast(vs.t,vs.ref); } }
  else{
    const ci=countryAtUV(u,v);
    if(ci) txt=COUNTRIES[ci-1].n.toUpperCase();
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
  const p=state.mode==='boat'?state.boat:state.walk;
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
  const payload=JSON.stringify({v:4,x:state.boat.x,z:state.boat.z,h:state.boat.heading,
    t:state.simHours,m:state.mode,wx:state.walk.x,wz:state.walk.z,wh:state.walk.heading,
    vis:[...state.visited],d:Math.round(state.dist),wm:state.windMode});
  try{ localStorage.setItem(SAVE_KEY,payload); }catch(e){}
  try{ if(window.storage) await window.storage.set(SAVE_KEY,payload); }catch(e){}
}
async function loadSaved(){
  let raw=null;
  try{ if(window.storage){ const r=await window.storage.get(SAVE_KEY); if(r&&r.value) raw=r.value; } }catch(e){}
  if(!raw){ try{ raw=localStorage.getItem(SAVE_KEY); }catch(e){} }
  try{ const o=JSON.parse(raw); if(o&&o.v>=2&&o.v<=4) return o; }catch(e){}
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
  $('log-stats').innerHTML=
    'Lands visited: <b>'+names.length+' / '+COUNTRIES.length+'</b><br>'+
    'Distance sailed: <b>'+Math.round(state.dist/B).toLocaleString()+' km</b><br>'+
    'Day of the voyage: <b>'+dayOfYear()+'</b>';
  $('log-lands').textContent=names.length?names.join(' \u00B7 '):'No land yet \u2014 the deep awaits.';
}
$('b-log').onclick=toggleLog;
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
  computeSites(); buildYahru();
  const saved=fresh?null:await loadSaved();
  if(saved){ state.boat.x=saved.x; state.boat.z=saved.z; state.boat.heading=saved.h; state.simHours=saved.t;
    if(saved.v>=3&&saved.m==='walk'){ state.walk.x=saved.wx; state.walk.z=saved.wz;
      state.walk.heading=saved.wh; state.mode='walk'; walkerG.visible=true; }
    if(saved.vis) state.visited=new Set(saved.vis);
    if(saved.d) state.dist=saved.d;
    if(saved.wm){ state.windMode=saved.wm; updateWindBtn(); } }
  else{ const [sx,sz]=findStart(); state.boat.x=sx; state.boat.z=sz; state.simHours=9.5; }
  const p0=state.mode==='walk'?state.walk:state.boat;
  updateChunks(p0.x,p0.z,9999);
  $('title-card').style.display='none'; running=true;
  updateAshoreBtn(); updateWindBtn(); initAudio();
  toast('And Aluahim said, \u201cLet the waters under the shamayim be gathered together into one place, and let the dry land appear.\u201d And it came to be so.','BER\u0114SHITH 1:9');
}
loadSaved().then(s=>{ if(s){ const b=$('btn-continue'); b.style.display='inline-block'; } });
$('btn-sail').onclick=()=>begin(true);
$('btn-continue').onclick=()=>begin(false);

/* ================= THE GREAT LOOP ================= */
const clock=new THREE.Clock(); let miniT=0, labelT=0;
function frame(){
  requestAnimationFrame(frame);
  const dt=Math.min(0.05,clock.getDelta());
  if(!running){ renderer.render(scene,camera); return; }
  if(!state.paused) state.simHours+=dt*SPEEDS[state.speedIdx][0]/3600;
  stormTick(dt);
  if(state.mode==='boat') boatTick(dt); else walkTick(dt);
  const p=state.mode==='boat'?state.boat:state.walk;
  const light=skyTick(p.x,p.z);
  audioTick(light.storm||0);
  updateChunks(p.x,p.z,4);
  updateVillages(p.x,p.z,dt,light.nightF);
  cameraTick(dt);
  labelT-=dt; if(labelT<=0){ labelT=0.4; updateLabels(p.x,p.z); placeTick(); }
  miniT-=dt; if(miniT<=0){ miniT=0.5; drawMapInto(minictx,mini.width,false);
    if(bigOpen) sizeBig(); }
  saveT-=dt; if(saveT<=0){ saveT=10; saveState(); }
  if(!state.firm){ clouds.position.x=p.x; clouds.position.z=p.z;
    TEX.clouds.offset.x=(p.x/9600*7+state.simHours*0.004)%1;
    TEX.clouds.offset.y=(p.z/9600*7)%1; }
  if(state.firm&&firmMark) firmMark.position.set(p.x,R_WORLD*0.012,p.z);
  sea.position.y=WATER_Y+Math.sin(performance.now()*0.0009)*0.18;
  seaTex.offset.x=(performance.now()*0.000012)%1; seaTex.offset.y=(performance.now()*0.000009)%1;
  renderer.render(scene,camera);
}
frame();
};
