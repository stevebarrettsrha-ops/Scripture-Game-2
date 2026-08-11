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
/* (Chunks were tried at 32 cells with VIEW halved — the same reach in a
   quarter of the chunks, which cut the draw calls from ~1,250 to ~890. It
   was measurably SLOWER: bigger chunks cull far worse against the frustum,
   and the triangles rose from 274k to 362k. Kept at 16.) */
/* VIEW=13 reaches 1,248 units, so the haze can stand at 1,140 with a hundred
   units of streaming headroom behind it — the fog must always close INSIDE
   the streamed ground, or land would pop in on open view. */
/* ---- THE BREADTH OF THE WORLD ----
   Half again what it was. At 120,000 units the countries stood shoulder to
   shoulder and every living thing in them was packed like sardines in a
   tin; at 180,000 the same map breathes — every land is half again as wide
   and long (two-and-a-quarter times the ground), the herds have their
   distances, and the sea between the nations is a true sea. Old voyages
   are carried over: a save remembers the radius it was made at, and its
   places are scaled to the same spot on the map (see loadSaved). */
const R_WORLD=180000, B=6, CH=16, CHW=B*CH, VIEW=13; /* rim = 30,000 km, 1 block = 1 km */
const ICE_UV=0.948, SHELF_UV=0.915, WATER_Y=0.35;
/* ---- THE HEIGHT OF THE WALL OF ICE ----
   Two thousand feet, and level from there to the rim. A block is a METRE in
   the measure a man walks, swims and dives by (the same U_PER_M every beast
   is built to and the depth-gauge reports), so the wall stands 610 blocks and
   its crown is a plain of ice 350 blocks wide at the edge of the world. */
const WALL_FT=2000, WALL_TOP=Math.round(WALL_FT*0.3048);
const WALL_CLIMB=0.62;      /* how much of the ice band is the climb; the rest is the crown */
/* every land is a stone standing in the water: its flanks plunge past the
   waterline down to the bed of the sea, which lies at SUBSEA_Y */
const SUBSEA_Y=WATER_Y-13;
/* [sun-speed, name, ship-speed multiplier] */
const SPEEDS=[[1,'true',1],[1200,'swift',2.2],[14400,'a day in six breaths',5]];

/* ---------------- tiny noise ---------------- */
function hash2(x,y){const n=Math.sin(x*127.1+y*311.7)*43758.5453;return n-Math.floor(n);}
function vnoise(x,y){const xi=Math.floor(x),yi=Math.floor(y),xf=x-xi,yf=y-yi;
  const a=hash2(xi,yi),b=hash2(xi+1,yi),c=hash2(xi,yi+1),d2=hash2(xi+1,yi+1);
  const fx=xf*xf*(3-2*xf),fy=yf*yf*(3-2*yf);
  return a+(b-a)*fx+(c-a)*fy+(a-b-c+d2)*fx*fy;}
function fbm(x,y){return vnoise(x,y)*.55+vnoise(x*2.13,y*2.13)*.3+vnoise(x*4.7,y*4.7)*.15;}

/* ================= THE PIXEL TEXTURES OF THE EARTH =================
   Every block face is a canvas painted here and nearest-filtered, so the
   pixels stay crisp — and the crispness is kept, because crispness is good.
   What is NOT kept is the coarseness. The faces of this world are drawn at
   THIRTY-TWO texels, not sixteen: four times the grain, which is room for
   real mortar between the stones, a true run of grain in a plank, the
   fissures in bark, the weave in cloth. Sixteen is Minecraft's own
   signature and is inseparable from it; thirty-two reads as another game
   entirely, at a cost of three parts in a thousand of a megabyte per face.

   The art is still composed in the OLD sixteen-unit square — `mkTex` scales
   the brush before the drawing begins — so every hand-placed seam, mortar
   line and growth ring in this file still lands where it was put. What runs
   at the true thirty-two is the GRAIN: `speckle` and its kin lay one true
   pixel at a time, so the noise in every surface is four times finer than
   it was and the eye reads stone and sand and soil rather than confetti.

   And every colour comes out of world/palette.js. Not one raw triple is
   written here. Re-grade that file and the whole earth moves with it. */
const PAL=window.PALETTE, PB=PAL.block, PP=PAL.pigment;
const TEXEL=32, TS=TEXEL/16;         /* the grain of a face, and true pixels to the old texel */
const FG=1/TS;                       /* one true pixel, in the old sixteen-unit space */
/* A canvas of as many TRUE pixels as are asked for, and not one more. Only
   `mkTex` below speaks the old sixteen-unit texel tongue, and it does its own
   reckoning into true pixels before it asks. THIS FUNCTION ONCE DID THAT
   RECKONING FOR EVERY CALLER, and every caller that had always asked in true
   pixels — the chart of the whole earth, the sea-floor sheet, the name
   banners, the glow of the two lights — was handed a canvas twice as wide and
   twice as tall as it painted into, and drew its whole work into the top-left
   quarter of it. The earth was beheld a quarter of her size, in the corner of
   her own face, with the wall of night showing through where the rest of her
   should have been. */
function texCanvas(w,h){ const c=D.createElement('canvas');
  c.width=Math.round(w||16); c.height=Math.round(h||w||16); return c; }
function P(g,x,y,col){ g.fillStyle=col; g.fillRect(x,y,1,1); }
function Pf(g,x,y,col){ g.fillStyle=col; g.fillRect(x,y,FG,FG); }   /* one TRUE pixel */
function rgb(r,g2,b2){ return 'rgb('+r+','+g2+','+b2+')'; }
function C(c){ return 'rgb('+c[0]+','+c[1]+','+c[2]+')'; }          /* a palette colour, as ink */
function jit(base,amt,seed){ const t=hash2(seed*7.31,seed*3.7)-0.5;
  return base.map(v=>Math.max(0,Math.min(255,Math.round(v+t*amt)))); }
/* ---- THE GRAIN OF A SURFACE ----
   Laid one TRUE pixel at a time, so a 32-texel face carries four times the
   grains a 16 did: sand reads as sand and not as gravel, and limestone
   reads as a worked stone and not as static. */
function speckle(g,base,amt,alt,altP,w,h){
  const W=w||16, H=h||W; let s=0;
  for(let y=0;y<H;y+=FG) for(let x=0;x<W;x+=FG){ s++;
    const c=(alt&&hash2(x*3.1+s,y*7.7)<altP)?jit(alt,amt,x+y*16+s):jit(base,amt,x*17+y+s);
    Pf(g,x,y,rgb(c[0],c[1],c[2])); } }
/* ---- THE HEWN EDGE ----
   A rim of one true pixel round every solid face: darker along the bottom
   and the right, lighter along the top and the left. The silhouette of the
   cube does not change by a hair. What changes is that each block stops
   reading as a game cube and starts reading as a DRESSED STONE or a squared
   timber with an arris worked on it — and the joints between blocks stay
   legible at a distance without the hard bright grid that comes of drawing
   them in outline. It is four hundred pixels of work per texture, once, at
   load; it costs nothing whatever at run time. */
function hewnEdge(cv){
  const g=cv.getContext('2d'), W=cv.width, H=cv.height, E=PAL.edge;
  const d=g.getImageData(0,0,W,H), px=d.data;
  const mul=(x,y,f)=>{ const i=((y*W+x)<<2);
    if(px[i+3]<8) return;                         /* nothing is worked into empty air */
    px[i]=Math.min(255,px[i]*f); px[i+1]=Math.min(255,px[i+1]*f); px[i+2]=Math.min(255,px[i+2]*f); };
  for(let k=0;k<E.px;k++){
    for(let x=0;x<W;x++){ mul(x,H-1-k,E.dark); mul(x,k,E.light); }
    for(let y=0;y<H;y++){ mul(W-1-k,y,E.dark);  mul(k,y,E.light); } }
  g.putImageData(d,0,0);
}
/* `rim` asks for the hewn edge. It is given to every SOLID block face and
   withheld from everything drawn with a hole in it — a leaf canopy, a blade
   of grass, a flower, a pane — where a rim would draw a box in mid-air. */
function mkTex(draw,w,h,opt){
  const W=w||16, H=h||W;                    /* asked in old texels, cut in true pixels */
  const c=texCanvas(Math.round(W*TS),Math.round(H*TS)), g=c.getContext('2d');
  g.imageSmoothingEnabled=false;
  g.save(); g.scale(TS,TS); draw(g,c); g.restore();
  if(opt&&opt.rim) hewnEdge(c);
  const t=new THREE.CanvasTexture(c); t.magFilter=THREE.NearestFilter;
  t.minFilter=THREE.NearestFilter; t.wrapS=t.wrapT=THREE.RepeatWrapping; t.generateMipmaps=false; return t; }
const RIM={rim:true};

const TEX={};
TEX.grassTop   = mkTex(g=>speckle(g,PB.grassTop.b,26,PB.grassTop.a,0.35));
TEX.grassTopTr = mkTex(g=>speckle(g,PB.grassTopTr.b,26,PB.grassTopTr.a,0.35));   // tropic — deep, not acid
TEX.grassTopTu = mkTex(g=>speckle(g,PB.grassTopTu.b,22,PB.grassTopTu.a,0.35));   // tundra, dull
/* THE PLAIN — dun gold burnt off by the sun, with the green only in the
   roots of it. This is the floor of the whole east African country. */
TEX.grassTopSv = mkTex(g=>speckle(g,PB.grassTopSv.b,28,PB.grassTopSv.a,0.4));
TEX.dirt       = mkTex(g=>speckle(g,PB.dirt.b,24,PB.dirt.a,0.3));
TEX.grassSide  = mkTex(g=>{ speckle(g,PB.grassSide.b,24,PB.grassSide.a,0.3);
  for(let x=0;x<16;x+=FG){ const d=(1+Math.floor(hash2(x,9.1)*3))*FG*2;
    for(let y=0;y<d;y+=FG){ const c=jit(PB.grassSide.lip,24,x*3+y); Pf(g,x,y,rgb(c[0],c[1],c[2])); } } });
/* and the cut side of it: the same red dirt, with dun stubble on the lip */
TEX.grassSideSv= mkTex(g=>{ speckle(g,PB.grassSideSv.b,24,PB.grassSideSv.a,0.3);
  for(let x=0;x<16;x+=FG){ const d=(1+Math.floor(hash2(x*1.7,3.3)*3))*FG*2;
    for(let y=0;y<d;y+=FG){ const c=jit(PB.grassSideSv.lip,26,x*5+y); Pf(g,x,y,rgb(c[0],c[1],c[2])); } } });
TEX.path       = mkTex(g=>speckle(g,PB.path.b,20,PB.path.a,0.3));
TEX.sand       = mkTex(g=>speckle(g,PB.sand.b,16,PB.sand.a,0.3));
/* ---- THE STONE OF THAT WORLD IS LIMESTONE ----
   Flat neutral grey was granite, and granite is not what that country is
   built of or standing on. It is warm now, and it is BEDDED: faint pale
   veins run across the face, as they do in every limestone quarry. */
TEX.stone      = mkTex(g=>{ speckle(g,PB.stone.b,14,PB.stone.a,0.28);
  for(let k=0;k<3;k++){ const y0=1+hash2(k,4.7)*13;
    for(let x=0;x<16;x+=FG){ const y=y0+Math.sin(x*0.7+k)*0.6;
      if(hash2(x*2.3+k,y)>0.42){ const c=jit(PB.stone.vein,10,x+k); Pf(g,x,Math.round(y/FG)*FG,rgb(c[0],c[1],c[2])); } } } },16,16,RIM);
TEX.snow       = mkTex(g=>speckle(g,PB.snow.b,8,PB.snow.a,0.25));
TEX.ice        = mkTex(g=>{ speckle(g,PB.ice.b,12,PB.ice.a,0.3);
  for(let k=0;k<9;k++){ const x=Math.floor(hash2(k,1)*32)*FG, y=Math.floor(hash2(k,2)*32)*FG;
    Pf(g,x,y,C(PB.ice.glint)); Pf(g,(x+FG)%16,(y+FG)%16,C(PB.ice.glint)); } },16,16,RIM);
/* ---- HEWN, NOT CRUSHED ----
   Nine flat pebbles in a grey field was a crushed-gravel block. This is a
   COURSE of dressed stones with real mortar run between them: the stones
   sit proud and warm, the mortar lies dark and recessed, and the 32-texel
   grain is what makes the mortar readable at all. */
TEX.cobble     = mkTex(g=>{ speckle(g,PB.cobble.mortar,10);
  const st=[[0,0,5,4],[6,0,5,3],[12,0,4,4],[0,5,4,4],[5,4,6,5],[12,5,4,4],[0,10,6,5],[7,10,4,5],[12,10,4,5]];
  for(let i2=0;i2<st.length;i2++){ const s=st[i2], c=jit(PB.cobble.b,26,i2);
    g.fillStyle=rgb(c[0],c[1],c[2]); g.fillRect(s[0]+FG,s[1]+FG,s[2]-2*FG,s[3]-2*FG);
    const hi=jit(PB.cobble.a,14,i2+7);                       /* the worked face catches the light */
    g.fillStyle=rgb(hi[0],hi[1],hi[2]); g.fillRect(s[0]+FG,s[1]+FG,s[2]-2*FG,FG); } },16,16,RIM);
TEX.planks     = mkTex(g=>{ speckle(g,PB.planks.b,14,PB.planks.a,0.3);
  g.fillStyle=C(PB.planks.seam);
  for(let y=3;y<16;y+=4) g.fillRect(0,y,16,FG);
  g.fillRect(4,0,FG,3); g.fillRect(11,4,FG,3); g.fillRect(6,8,FG,3); g.fillRect(13,12,FG,3);
  /* the run of the grain along each board — what 32 texels buys you */
  g.fillStyle='rgba(0,0,0,0.13)';
  for(let y=0;y<16;y+=4) for(let k=0;k<3;k++){ const yy=y+1+k*0.9;
    for(let x=0;x<16;x+=FG) if(hash2(x*1.7+y,k*3.1)>0.42) g.fillRect(x,yy,FG,FG); } },16,16,RIM);
TEX.roof       = mkTex(g=>{ speckle(g,PB.roof.b,14,PB.roof.a,0.3);
  g.fillStyle=C(PB.roof.seam);
  for(let y=3;y<16;y+=4) g.fillRect(0,y,16,FG);
  g.fillRect(5,0,FG,3); g.fillRect(10,4,FG,3); g.fillRect(3,8,FG,3); g.fillRect(12,12,FG,3); },16,16,RIM);
TEX.logSide    = mkTex(g=>{ speckle(g,PB.logSide.b,12,PB.logSide.a,0.3);
  g.fillStyle=C(PB.logSide.fissure);
  for(const x of [1,5,9,13]) for(let y=0;y<16;y+=FG){ if(hash2(x,y)>0.2) g.fillRect(x,y,FG,FG); }
  /* and the fine checks between the deep fissures */
  g.fillStyle='rgba(0,0,0,0.10)';
  for(const x of [2.5,7,10.5,14.5]) for(let y=0;y<16;y+=FG) if(hash2(x*2.7,y*1.3)>0.5) g.fillRect(x,y,FG,FG); },16,16,RIM);
TEX.logTop     = mkTex(g=>{ speckle(g,PB.logTop.b,10);
  const sh=PB.logTop.rings;
  for(let r=0;r<4;r++){ g.fillStyle=C(sh[r]); g.fillRect(2+r,2+r,12-2*r,12-2*r); }
  /* the annual rings, drawn true now that there is grain to draw them in */
  g.strokeStyle='rgba(0,0,0,0.22)'; g.lineWidth=FG;
  for(let r=1;r<7;r++) g.strokeRect(8-r,8-r,r*2,r*2); },16,16,RIM);
TEX.leaves     = mkTex(g=>{ g.clearRect(0,0,16,16);
  for(let y=0;y<16;y+=FG)for(let x=0;x<16;x+=FG){ if(hash2(x*5.1,y*3.3)<0.86){
    const c=jit(PB.leaves.b,36,x+y*16); Pf(g,x,y,rgb(c[0],c[1],c[2])); } } });
TEX.leavesTr   = mkTex(g=>{ g.clearRect(0,0,16,16);
  for(let y=0;y<16;y+=FG)for(let x=0;x<16;x+=FG){ if(hash2(x*5.7,y*4.3)<0.87){
    const c=jit(PB.leavesTr.b,36,x+y*16+9); Pf(g,x,y,rgb(c[0],c[1],c[2])); } } });
TEX.water      = mkTex(g=>{ speckle(g,PB.water.b,14,PB.water.a,0.4);
  g.fillStyle='rgba('+PB.water.sheen[0]+','+PB.water.sheen[1]+','+PB.water.sheen[2]+',0.55)';
  for(const y of [2,7,12]) for(let x=0;x<16;x+=FG){ if(hash2(x,y*2.2)>0.55) g.fillRect(x,y,2*FG,FG); } });
/* cherry blossom — soft pink canopy */
TEX.cherry     = mkTex(g=>{ g.clearRect(0,0,16,16);
  for(let y=0;y<16;y+=FG)for(let x=0;x<16;x+=FG){ if(hash2(x*5.1,y*3.7)<0.9){
    const base=hash2(x*2.3,y*1.9)<0.25?PB.cherry.pale:PB.cherry.b;
    const c=jit(base,26,x+y*16); Pf(g,x,y,rgb(c[0],c[1],c[2])); } } });
/* badlands — banded clay: red, orange, tan and white strata */
TEX.badTop     = mkTex(g=>speckle(g,PB.badTop.b,18,PB.badTop.a,0.3));
TEX.badSide    = mkTex(g=>{ const bands=PB.badSide.bands;
  for(let y=0;y<16;y+=FG){ const bc=bands[Math.floor((y/16)*bands.length+(hash2(0,y)*0.6))%bands.length];
    for(let x=0;x<16;x+=FG){ const c=jit(bc,14,x*3+y); Pf(g,x,y,rgb(c[0],c[1],c[2])); } } },16,16,RIM);
TEX.haySide    = mkTex(g=>{ speckle(g,PB.haySide.b,22,PB.haySide.a,0.35);
  g.fillStyle=C(PB.haySide.band); for(const y of [0,5,10,15]) g.fillRect(0,y,16,FG); },16,16,RIM);
TEX.hayTop     = mkTex(g=>{ speckle(g,PB.hayTop.b,22);
  g.strokeStyle=C(PB.hayTop.twine); g.lineWidth=FG;
  g.strokeRect(1.5,1.5,13,13); g.strokeRect(4.5,4.5,7,7); },16,16,RIM);
/* ---- CLOTH IS WOVEN ----
   Flat speckle read as felt. At 32 texels a true over-and-under weave can
   be drawn, and wool, sailcloth and linen all come off this one tile. */
TEX.wool       = mkTex(g=>{ speckle(g,PB.wool.b,10,PB.wool.a,0.3);
  g.fillStyle='rgba(0,0,0,0.10)';
  for(let y=0;y<16;y+=FG*2) g.fillRect(0,y,16,FG);
  g.fillStyle='rgba(255,255,255,0.09)';
  for(let x=0;x<16;x+=FG*2) g.fillRect(x,0,FG,16); },16,16,RIM);
TEX.glass      = mkTex(g=>{ g.clearRect(0,0,16,16);
  g.fillStyle='rgba('+PB.glass.b[0]+','+PB.glass.b[1]+','+PB.glass.b[2]+',0.30)'; g.fillRect(0,0,16,16);
  g.fillStyle='rgba(255,255,255,0.85)';
  g.fillRect(0,0,16,FG); g.fillRect(0,16-FG,16,FG); g.fillRect(0,0,FG,16); g.fillRect(16-FG,0,FG,16);
  g.fillStyle='rgba(255,255,255,0.55)';
  g.fillRect(2,10,3,FG); g.fillRect(4,8,FG,3); });
TEX.door       = mkTex((g,c)=>{ g.fillStyle=C(PB.door.b); g.fillRect(0,0,16,32);
  g.fillStyle=C(PB.door.frame);
  g.fillRect(1,1,14,30); g.fillStyle=C(PB.door.panel); g.fillRect(2,2,12,28);
  g.fillStyle=C(PB.door.sunk);
  g.fillRect(3,3,4,10); g.fillRect(9,3,4,10); g.fillRect(3,17,4,11); g.fillRect(9,17,4,11);
  g.fillStyle=C(PB.door.glass); g.fillRect(4,4,2,3); g.fillRect(10,4,2,3);
  g.fillStyle=C(PB.door.handle); g.fillRect(13,15,FG,2); },16,32);
TEX.tallgrass  = mkTex(g=>{ g.clearRect(0,0,16,16);
  for(let k=0;k<18;k++){ const x=(1+Math.floor(hash2(k,3)*14))+ (k%2?FG:0); const h2=6+Math.floor(hash2(k,5)*9);
    const c=jit(PB.tallgrass.b,30,k); g.fillStyle=rgb(c[0],c[1],c[2]);
    for(let y=0;y<h2;y+=FG) g.fillRect(x+(y>h2-3?(hash2(k,9)>0.5?FG:-FG):0),16-FG-y,FG,FG); } });
/* THE TALL GRASS OF THE PLAIN — golden, standing to the shoulder, and thick
   enough at the root that a lion lying in it is not there at all. */
TEX.savgrass   = mkTex(g=>{ g.clearRect(0,0,16,16);
  for(let k=0;k<26;k++){ const x=Math.floor(hash2(k,4.1)*32)*FG; const h2=10+Math.floor(hash2(k,2.7)*6);
    const c=jit(PB.savgrass.b,34,k); g.fillStyle=rgb(c[0],c[1],c[2]);
    for(let y=0;y<h2;y+=FG){ const lean=(y>h2-5)?(hash2(k,6.3)>0.5?FG:-FG):0;
      g.fillRect((x+lean+16)%16,16-FG-y,FG,FG); }
    if(hash2(k,9.9)>0.6){ const s2=jit(PB.savgrass.seed,20,k); g.fillStyle=rgb(s2[0],s2[1],s2[2]);
      g.fillRect(x,16-FG-h2,FG,2*FG); } } });                     /* the seed head */
/* the flat crown of the thorn tree, thin and grey-green against the sky */
TEX.acacia     = mkTex(g=>{ for(let y=0;y<16;y+=FG) for(let x=0;x<16;x+=FG){
    const n=hash2(x*2.7+y*1.3,y*3.1);
    if(n<0.30){ g.clearRect(x,y,FG,FG); continue; }
    const c=jit(PB.acacia.b,26,x*5+y); Pf(g,x,y,rgb(c[0],c[1],c[2])); } });
TEX.flowerR    = mkTex(g=>{ g.clearRect(0,0,16,16); g.fillStyle=C(PB.flowerR.stem);
  g.fillRect(7,8,FG,8); g.fillRect(5,11,2,FG);
  g.fillStyle=C(PB.flowerR.b); g.fillRect(5,3,5,5);
  g.fillStyle=C(PB.flowerR.pale); g.fillRect(6,4,3,3);
  g.fillStyle=C(PB.flowerR.eye); g.fillRect(7,5,FG,FG); });
TEX.flowerY    = mkTex(g=>{ g.clearRect(0,0,16,16); g.fillStyle=C(PB.flowerY.stem);
  g.fillRect(8,8,FG,8);
  g.fillStyle=C(PB.flowerY.b); g.fillRect(6,3,5,5);
  g.fillStyle=C(PB.flowerY.pale); g.fillRect(7,4,3,3); });
TEX.crop       = mkTex(g=>{ g.clearRect(0,0,16,16);
  for(const x of [2,6,10,14]){ const c=jit(PB.crop.b,26,x); g.fillStyle=rgb(c[0],c[1],c[2]);
    for(let y=0;y<10;y+=FG){ g.fillRect(x,16-FG-y,FG,FG); if(y>4&&hash2(x,y)>0.5) g.fillRect(x-FG,16-FG-y,FG,FG); } } });
TEX.soil       = mkTex(g=>{ speckle(g,PB.soil.b,18,PB.soil.a,0.3);
  g.fillStyle=C(PB.soil.furrow); for(const y of [3,8,13]) g.fillRect(0,y,16,2); });
TEX.sun        = mkTex(g=>{ g.fillStyle=C(PB.sun.rim); g.fillRect(0,0,16,16);
  g.fillStyle=C(PB.sun.mid); g.fillRect(2,2,12,12);
  g.fillStyle=C(PB.sun.core); g.fillRect(4,4,8,8); });
TEX.moon       = mkTex(g=>{ g.fillStyle=C(PB.moon.rim); g.fillRect(0,0,16,16);
  g.fillStyle=C(PB.moon.mid); g.fillRect(2,2,12,12);
  g.fillStyle=C(PB.moon.mare); g.fillRect(4,5,3,3); g.fillRect(9,9,3,2); g.fillRect(10,3,2,2); });
TEX.benchTop   = mkTex(g=>{ speckle(g,PB.benchTop.b,14,PB.benchTop.a,0.3);
  g.strokeStyle=C(PB.benchTop.groove); g.lineWidth=FG; g.strokeRect(1.5,1.5,13,13);
  g.fillStyle=C(PB.benchTop.groove); g.fillRect(4,4,8,8);
  g.fillStyle=C(PB.benchTop.inlay); g.fillRect(5,5,6,6);
  g.fillStyle=C(PB.benchTop.groove); g.fillRect(7,4,FG,8); g.fillRect(4,7,8,FG); },16,16,RIM);
TEX.benchSide  = mkTex(g=>{ speckle(g,PB.benchSide.b,14,PB.benchSide.a,0.3);
  g.fillStyle=C(PB.benchSide.seam); for(let y2=3;y2<16;y2+=4) g.fillRect(0,y2,16,FG);
  g.fillStyle=C(PB.benchSide.iron); g.fillRect(3,4,2,5);
  g.fillStyle=C(PB.benchSide.seam); g.fillRect(3,9,2,3);
  g.fillStyle=C(PB.benchSide.b); g.fillRect(10,5,4,2);
  g.fillStyle=C(PB.benchSide.iron); g.fillRect(11,7,2,4); },16,16,RIM);
/* ---- AND THE MATERIALS OF SCRIPTURE ----
   Brick, slime and salt: the three the world of §4 is actually built with
   and the three the palette already had pigments for. Every one of them is
   generated here like all the rest — nothing in this game is an image file. */
TEX.brick      = mkTex(g=>{ speckle(g,PB.brick.mortar,8);
  /* courses of squared brick, offset row by row, with the mortar recessed */
  for(let r=0;r<4;r++){ const y=r*4, off=(r%2)?-2:0;
    for(let c=-1;c<3;c++){ const x=off+c*6;
      const t=jit(PB.brick.b,22,r*7+c);
      g.fillStyle=rgb(t[0],t[1],t[2]); g.fillRect(x+FG,y+FG,6-2*FG,4-2*FG);
      const hi=jit(PB.brick.face,12,r*3+c);
      g.fillStyle=rgb(hi[0],hi[1],hi[2]); g.fillRect(x+FG,y+FG,6-2*FG,FG); } } },16,16,RIM);
TEX.bitumen    = mkTex(g=>{ speckle(g,PB.bitumen.b,10,PB.bitumen.a,0.35);
  /* it is WET, and the light lies on it in slicks rather than in grains */
  g.fillStyle='rgba(120,132,140,0.16)';
  for(let k=0;k<7;k++){ const x=hash2(k,3.1)*16, y=hash2(k,7.7)*16;
    g.fillRect(x,y,2+hash2(k,1.3)*3,FG); } },16,16,RIM);
TEX.salt       = mkTex(g=>{ speckle(g,PB.salt.b,14,PB.salt.a,0.3);
  /* crystal: hard little facets that catch the light square-on */
  for(let k=0;k<26;k++){ const x=Math.floor(hash2(k,2.7)*32)*FG, y=Math.floor(hash2(k,5.3)*32)*FG;
    g.fillStyle=C(PB.salt.glint); g.fillRect(x,y,FG,FG);
    if(hash2(k,9.1)>0.5) g.fillRect(x+FG,y,FG,FG); } },16,16,RIM);
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
/* the ice is enrolled in its OWN pool, not in LIT — see setIceLight */
const ICE_MATS=[];
function iceMat(name,tex){ const m=new THREE.MeshBasicMaterial({
    map:tex, vertexColors:true, side:THREE.DoubleSide });
  MAT[name]=m; ICE_MATS.push(m); return m; }
blockMat('grassTop',TEX.grassTop); blockMat('grassTopTr',TEX.grassTopTr); blockMat('grassTopTu',TEX.grassTopTu);
blockMat('grassTopSv',TEX.grassTopSv); blockMat('grassSideSv',TEX.grassSideSv);
blockMat('grassSide',TEX.grassSide); blockMat('dirt',TEX.dirt); blockMat('path',TEX.path);
blockMat('sand',TEX.sand); blockMat('stone',TEX.stone); blockMat('cobble',TEX.cobble);
blockMat('snow',TEX.snow); blockMat('ice',TEX.ice);
iceMat('iceTop',TEX.snow); iceMat('iceSide',TEX.ice);   /* the wall of ice and the floes */
blockMat('planks',TEX.planks); blockMat('roof',TEX.roof);
blockMat('logSide',TEX.logSide); blockMat('logTop',TEX.logTop);
blockMat('haySide',TEX.haySide); blockMat('hayTop',TEX.hayTop); blockMat('wool',TEX.wool);
blockMat('soil',TEX.soil); blockMat('benchTop',TEX.benchTop); blockMat('benchSide',TEX.benchSide);
blockMat('leaves',TEX.leaves,{alphaTest:0.4}); blockMat('leavesTr',TEX.leavesTr,{alphaTest:0.4});
blockMat('cherry',TEX.cherry,{alphaTest:0.4}); blockMat('badTop',TEX.badTop); blockMat('badSide',TEX.badSide);
blockMat('tallgrass',TEX.tallgrass,{alphaTest:0.4}); blockMat('flowerR',TEX.flowerR,{alphaTest:0.4});
blockMat('savgrass',TEX.savgrass,{alphaTest:0.4}); blockMat('acacia',TEX.acacia,{alphaTest:0.4});
/* ---- THE FOUR GREY THINGS THE WHOLE FLORA OF THE EARTH IS DRAWN WITH ----
   Leaf, bark, blade and berry, each painted ONCE and in grey, and tinted per
   species as the faces are laid down. A hundred and seventy kinds of tree in
   the world, and four materials to draw the lot of them: the number of
   species costs nothing whatever in draw calls. (Paint any of these in a
   colour and every plant on the earth inherits it — that is the whole reason
   they are grey.) */
/* At thirty-two texels these four carry what they never could at sixteen:
   the leaf gets a midrib and a serrated edge, the bark gets deep fissures
   with fine checking between them, the blade gets a taper. Every plant on
   the earth is drawn with them, so this is the cheapest detail in the game
   — four textures, and a hundred and seventy species wear the benefit. */
TEX.leafW  = mkTex(g=>{ for(let y=0;y<16;y+=FG) for(let x=0;x<16;x+=FG){
    const n=hash2(x*2.7+y*1.3,y*3.1+x*0.7);
    if(n<0.16){ g.clearRect(x,y,FG,FG); continue; }           /* the light through it */
    let v=196+hash2(x*5.1,y*7.3)*58;
    /* the midribs — a leaf mass is not a fog of dots, it has veins in it */
    const rib=Math.abs(((x*0.9+y*0.35)%4)-2);
    if(rib<0.6) v*=0.86; else if(rib>1.8) v*=1.05;
    Pf(g,x,y,rgb(Math.round(Math.min(255,v)),Math.round(Math.min(255,v)),Math.round(Math.min(255,v)))); } });
TEX.barkW  = mkTex(g=>{ for(let y=0;y<16;y+=FG) for(let x=0;x<16;x+=FG){
    const seam=(x%5<FG||Math.abs(x%7-3)<FG)?0.72:1;           /* the deep fissures */
    const check=hash2(x*0.9,y*4.3)>0.62?0.93:1;               /* and the fine checking between */
    const v=Math.round(Math.min(255,(176+hash2(x*3.3,y*9.1)*62)*seam*check));
    Pf(g,x,y,rgb(v,v,v)); } });
TEX.plantW = mkTex(g=>{ g.clearRect(0,0,16,16);
    for(let k=0;k<20;k++){ const x=(1+Math.floor(hash2(k,3.7)*14))+(k%2?FG:0), h2=7+Math.floor(hash2(k,5.9)*8);
      for(let y=0;y<h2;y+=FG){ const v=Math.round(188+hash2(k*3.1,y)*62);
        g.fillStyle=rgb(v,v,v);
        g.fillRect(x+(y>h2-3?(hash2(k,9.1)>0.5?FG:-FG):0),16-FG-y,FG,FG); } } });
TEX.solidW = mkTex(g=>speckle(g,[228,228,228],26,[198,198,198],0.35),16,16,RIM);
blockMat('leafW',TEX.leafW,{alphaTest:0.4}); blockMat('barkW',TEX.barkW);
blockMat('plantW',TEX.plantW,{alphaTest:0.4}); blockMat('solidW',TEX.solidW);
blockMat('flowerY',TEX.flowerY,{alphaTest:0.4}); blockMat('crop',TEX.crop,{alphaTest:0.4});
blockMat('glass',TEX.glass,{transparent:true,depthWrite:false});
blockMat('door',TEX.door,{alphaTest:0.1});
blockMat('waterB',TEX.water);
blockMat('brick',TEX.brick); blockMat('bitumen',TEX.bitumen); blockMat('salt',TEX.salt);
/* ---- THE WIND IN THE LEAVES ----
   Every leaf canopy, blade of grass, flower and crop sways on the wind: a
   vertex-shader ripple patched into the shared block materials. The chunk
   mesher bakes geometry in WORLD coordinates, so `position` gives each plant
   its own phase and neighbouring trees never sway in lockstep. Grass-like
   crosses are pinned at the root (weighted by uv.y, 0 at the soil); leaf
   canopies breathe as a whole. Amplitude follows the living wind and the
   storms (WIND_A, fed each frame from windAt + stormAt). */
const WIND_T={value:0}, WIND_A={value:1};
/* ---- THE TURN OF THE YEAR IN THE LEAVES ----
   uSeasonY runs 0..1 through the game's 364-day year (fed each frame from
   dayOfYear). A leaf canopy shifts its own baked colour by it: the temperate
   woods gild toward gold in autumn and go grey and dim in winter, while the
   tropics keep their green and the far north, where the evergreens stand,
   hardly turns. The world is a disc with the North Pole at its centre and the
   South at its rim, so the two hemispheres keep OPPOSITE seasons — the south
   is half a year on from the north, worked out per-leaf from its distance to
   the centre. No chunk is ever re-meshed for it; it is all in the shader. */
const SEASON_Y={value:0};
const INV_R_STR=(1/180000).toExponential();   /* 1 / R_WORLD, for the shader */
/* ---- AND IT MUST BE DONE IN THE FRAGMENT, NOT THE VERTEX COLOUR ----
   The vertex colour is MULTIPLIED into the block's texture, so whitening it
   only ever BRIGHTENS what is already there: a white vertex colour over a green
   grass texture is still green, and no snow would lie however hard it was
   driven. The season is therefore worked out per-vertex (where the world
   position is known), handed to the fragment as a varying, and MIXED over the
   sampled texture there — which can truly bury a green field in white. */
const SEASON_VS=                                    /* -> vSeas = (autumn, winter) for a leaf */
  '{ float sr=length(position.xz)*'+INV_R_STR+';\n'+
  '  float latN=1.0-sr*2.0;\n'+                                   /* +1 north pole .. -1 south */
  '  float ph=fract(uSeasonY+(latN<0.0?0.5:0.0));\n'+            /* the south is half a year on */
  '  float autumn=smoothstep(0.50,0.66,ph)*(1.0-smoothstep(0.66,0.82,ph));\n'+
  '  float winter=clamp(smoothstep(0.74,0.90,ph)+(1.0-smoothstep(0.10,0.26,ph)),0.0,1.0);\n'+
  '  float band=clamp(abs(latN),0.0,1.0);\n'+                     /* 0 equator .. 1 pole */
  '  float temperate=smoothstep(0.12,0.42,band)*(1.0-smoothstep(0.72,1.0,band));\n'+
  '  vSeas=vec2(autumn*temperate, winter*temperate); }';
const SEASON_FS=                                    /* the leaf: gilded, then bared */
  '  diffuseColor.rgb=mix(diffuseColor.rgb, vec3(0.78,0.55,0.16), vSeas.x*0.80);\n'+
  '  diffuseColor.rgb=mix(diffuseColor.rgb, vec3(0.42,0.34,0.26), vSeas.y*0.72);';
const SNOW_VS=                                      /* -> vSeas.y = how deep the snow lies */
  '{ float sr=length(position.xz)*'+INV_R_STR+';\n'+
  '  float latN=1.0-sr*2.0;\n'+
  '  float ph=fract(uSeasonY+(latN<0.0?0.5:0.0));\n'+
  '  float winter=clamp(smoothstep(0.74,0.90,ph)+(1.0-smoothstep(0.10,0.26,ph)),0.0,1.0);\n'+
  '  float cold=smoothstep(0.28,0.56,abs(latN));\n'+  /* the tropics never take it; the far north lies deep */
  '  vSeas=vec2(0.0, winter*cold); }';
const SNOW_FS=
  '  diffuseColor.rgb=mix(diffuseColor.rgb, vec3(0.93,0.95,1.00), vSeas.y*0.92);';
function windSway(mat,amp,rooted,tint){
  mat.onBeforeCompile=sh=>{
    sh.uniforms.uWindT=WIND_T; sh.uniforms.uWindA=WIND_A;
    let vs=sh.vertexShader.replace(
      '#include <begin_vertex>',
      '#include <begin_vertex>\n'+
      '{ float wph=position.x*0.161+position.z*0.127;\n'+
      '  float wgt='+(rooted?'clamp(uv.y,0.0,1.0)':'0.55+0.45*sin(position.y*0.21+wph)')+';\n'+
      '  float ws1=sin(uWindT*1.7+wph)+0.5*sin(uWindT*2.9+wph*1.83);\n'+
      '  float ws2=sin(uWindT*1.3+wph*1.31)+0.5*sin(uWindT*2.3+wph*0.77);\n'+
      '  transformed.x+=ws1*'+amp.toFixed(3)+'*uWindA*wgt;\n'+
      '  transformed.z+=ws2*'+(amp*0.7).toFixed(3)+'*uWindA*wgt; }');
    let head='uniform float uWindT; uniform float uWindA;\n';
    /* and the turn of the year: the leaf canopies GILD ('leaf' — gold in autumn,
       bare and brown in winter), while the grass and herb blades take the SNOW */
    if(tint){ sh.uniforms.uSeasonY=SEASON_Y;
      head+='uniform float uSeasonY;\nvarying vec2 vSeas;\n';
      vs=vs.replace('#include <color_vertex>',
        '#include <color_vertex>\n'+(tint==='snow'?SNOW_VS:SEASON_VS));
      sh.fragmentShader='varying vec2 vSeas;\n'+sh.fragmentShader.replace(
        '#include <color_fragment>',
        '#include <color_fragment>\n'+(tint==='snow'?SNOW_FS:SEASON_FS)); }
    sh.vertexShader=head+vs;
  };
  /* ---- EVERY PATCHED MATERIAL MUST KEEP ITS OWN PROGRAM ----
     three.js keys a compiled shader by the SOURCE TEXT of onBeforeCompile, and
     that text is identical for every material patched here — the amplitude and
     the tint live in the closure, not in the source. So without a key of its
     own, every swaying material in the world shared ONE program: whichever
     compiled first, and every other leaf, blade and crop was drawn with that
     one's amplitude and that one's season. (It is why the snow would not lie on
     the grass, and why every plant swayed alike.) */
  mat.customProgramCacheKey=()=>'sway|'+amp+'|'+(rooted?1:0)+'|'+(tint||'');
  mat.needsUpdate=true;
}
/* ---- THE SNOW THAT LIES IN WINTER ----
   The horizontal faces of the ground — the grass tops, the paths, the village
   cobbles — whiten over as winter comes on, and only in the cold zones: the
   temperate lands take it, the far north keeps it the year round, and the
   tropics never take it at all (worked per-face from the distance to the pole,
   the same reckoning the leaves use). No chunk is re-meshed; it is in the
   shader, and the traveller's chosen season drives it. */
function groundSnow(mat){
  mat.onBeforeCompile=sh=>{ sh.uniforms.uSeasonY=SEASON_Y;
    sh.vertexShader='uniform float uSeasonY;\nvarying vec2 vSeas;\n'+sh.vertexShader.replace(
      '#include <color_vertex>','#include <color_vertex>\n'+SNOW_VS);
    sh.fragmentShader='varying vec2 vSeas;\n'+sh.fragmentShader.replace(
      '#include <color_fragment>','#include <color_fragment>\n'+SNOW_FS); };
  mat.customProgramCacheKey=()=>'groundsnow';
  mat.needsUpdate=true;
}
groundSnow(MAT.grassTop); groundSnow(MAT.grassTopTr); groundSnow(MAT.grassTopTu);
groundSnow(MAT.grassTopSv); groundSnow(MAT.path); groundSnow(MAT.cobble);
windSway(MAT.leaves,0.55,false,'leaf'); windSway(MAT.leavesTr,0.62,false,'leaf'); windSway(MAT.cherry,0.55,false);
/* the grass blades take the snow, so they whiten with the ground and do not
   stand green out of a white field */
windSway(MAT.tallgrass,0.9,true,'snow');
/* and the flowers standing in the sward go under the snow with it */
windSway(MAT.flowerR,0.6,true,'snow'); windSway(MAT.flowerY,0.6,true,'snow');
/* the plain moves as one thing when the wind crosses it — the tall grass
   swings further than the sward, and the thorn crowns ride it */
windSway(MAT.savgrass,1.5,true,'snow'); windSway(MAT.acacia,0.5,false,'leaf');
/* and every leaf and every herb on the earth moves with it */
windSway(MAT.leafW,0.55,false,'leaf'); windSway(MAT.plantW,0.85,true,'snow');
windSway(MAT.crop,0.5,true);
/* breaking surf — clumpy foam that washes the shoreline (scrolled + pulsed) */
TEX.surf = mkTex(g=>{ g.clearRect(0,0,16,16);
  const F=PB.surf.b;
  for(let y=0;y<16;y+=FG)for(let x=0;x<16;x+=FG){
    const n=fbm(x*0.5+1.3,y*0.9-2.1);
    if(n>0.52){ const w=Math.min(255,F[0]+Math.floor(hash2(x,y)*40));
      g.fillStyle='rgba('+w+','+Math.min(255,w+10)+','+Math.min(255,F[2]+16)+','+Math.min(1,(n-0.4)*2.2)+')';
      g.fillRect(x,y,FG,FG); } } });
const surfMat=blockMat('surf',TEX.surf,{transparent:true,alphaTest:0.02,depthWrite:false,opacity:0.6});
/* a swinging door leaf (its own mesh so it can open/close) */
const doorLeafMat=new THREE.MeshBasicMaterial({map:TEX.door,side:THREE.DoubleSide,alphaTest:0.1});
LIT.push(doorLeafMat);
const seaTex=TEX.water.clone(); seaTex.needsUpdate=true; seaTex.repeat.set(R_WORLD/12,R_WORLD/12);
/* the open sea repeats ~10,000× — without mipmaps it aliases into shimmer */
seaTex.generateMipmaps=true; seaTex.minFilter=THREE.LinearMipmapLinearFilter;
const seaMat=new THREE.MeshBasicMaterial({map:seaTex,transparent:true,opacity:0.82,side:THREE.DoubleSide});
LIT.push(seaMat);
/* ================= THE LIGHT A MAN CARRIES =================
   A cave you can see in with no light source is not a cave — and a cave you
   CANNOT see in with one is not a place, it is a wall. So the traveller
   carries fire.

   Every block in this world is drawn with an unlit material: the light on a
   face is baked into its vertex colour and the whole set is tinted once by
   the hour of the day. Nothing in it responds to a lamp, and putting a real
   point light in the scene would mean lighting the entire earth per-pixel to
   light nine blocks of it. So the torch is a UNIFORM instead — one position,
   one reach, one strength, shared by every block material in the game and
   worked out in the fragment: three instructions, no extra draw call, and
   nothing whatever paid while it is out.

   (The chunk mesher bakes its geometry in WORLD coordinates — the same
   property the wind in the leaves leans on — so the vertex position IS the
   world position and the distance to the flame is one subtraction.) */
const TORCH_P={value:new THREE.Vector3(0,-1e7,0)}, TORCH_R={value:78}, TORCH_S={value:0};
/* a material may already carry a patch (the wind, the snow, the turn of the
   year). Chain onto it rather than over it — and give the chain its own key,
   or three.js hands every patched material the first one's program. */
function addPatch(mat,fn,key){
  const prev=mat.onBeforeCompile, prevKey=mat.customProgramCacheKey;
  mat.onBeforeCompile=sh=>{ if(prev) prev(sh); fn(sh); };
  /* three.js's OWN default customProgramCacheKey reads `this.onBeforeCompile`
     — so it must be called ON the material. Called bare it throws inside the
     renderer, every frame, out of the render and out of the world with it. */
  mat.customProgramCacheKey=function(){ return (prevKey?prevKey.call(this):'')+'|'+key; };
  mat.needsUpdate=true;
}
function torchLight(mat){
  addPatch(mat,sh=>{
    sh.uniforms.uTorchP=TORCH_P; sh.uniforms.uTorchR=TORCH_R; sh.uniforms.uTorchS=TORCH_S;
    sh.vertexShader='varying vec3 vTPos;\n'+sh.vertexShader.replace(
      '#include <begin_vertex>','#include <begin_vertex>\n  vTPos=position;');
    sh.fragmentShader='uniform vec3 uTorchP;\nuniform float uTorchR;\nuniform float uTorchS;\nvarying vec3 vTPos;\n'+
      sh.fragmentShader.replace('#include <color_fragment>',
        '#include <color_fragment>\n'+
        '  if(uTorchS>0.001){ float d=distance(vTPos,uTorchP);\n'+
        '    float t=max(0.0,1.0-d/uTorchR);\n'+
        '    diffuseColor.rgb*=1.0+uTorchS*t*t*7.0; }');
  },'torch');
}
/* every block material that exists at this point takes the torch, and so
   does every one made later — the far land, the beasts' own materials and
   the villagers' cloth are all enrolled in LIT after this line, and a man
   holding a lamp lights the creature in front of him or he does not have a
   lamp. `torched` is a WeakSet rather than a flag on the material so
   nothing has to remember to set it. */
const _torched=new WeakSet();
function torchAll(){
  for(const m of LIT) if(!_torched.has(m)){ _torched.add(m); torchLight(m); }
  for(const m of ICE_MATS) if(!_torched.has(m)){ _torched.add(m); torchLight(m); }
}
torchAll();
const torchMat=new THREE.MeshBasicMaterial({color:0xffd75e});           // full-bright, never dimmed
function setBlockLight(r,g2,b2){ for(const m of LIT) m.color.setRGB(r,g2,b2); }
/* ---- THE FLAME ITSELF ----
   Where it stands, how far it reaches, and how hard it burns — with a
   flicker, because a steady lamp is a torch nobody believes. */
const TORCH={on:false, s:0, t:0};
function torchTick(dt){
  torchAll();                                  /* anything newly made takes it too */
  TORCH.t+=dt;
  const want=TORCH.on?1:0;
  TORCH.s+=(want-TORCH.s)*Math.min(1,dt*(TORCH.on?5:9));
  if(TORCH.s<0.002){ TORCH_S.value=0; TORCH_P.value.y=-1e7; torchPropTick(); return; }
  const fl=0.86+0.14*Math.sin(TORCH.t*11.3)+0.06*Math.sin(TORCH.t*27.7);
  TORCH_S.value=TORCH.s*fl;
  torchPropTick();
  const p=playerXZ();
  const y=(state.mode==='walk')?(state.walk.feetY!==undefined?state.walk.feetY+B*1.5:WATER_Y)
        :(state.mode==='fly')?state.fly.y:(state.mode==='dive')?state.dive.y:WATER_Y+8;
  TORCH_P.value.set(p.x,y,p.z);
}
/* ---- AND IT IS IN HIS HAND ----
   A light with no lamp under it is a trick. A short haft of wood with a
   knot of flame on its head, hung off the traveller's right arm so it
   swings with his stride and is seen over his shoulder by his own camera. */
let torchProp=null;
function ensureTorchProp(){
  if(torchProp||!walkerG.userData||!walkerG.userData.armR) return torchProp;
  const g=new THREE.Group();
  const haft=new THREE.Mesh(new THREE.BoxGeometry(0.55,3.4,0.55),MAT.logSide||MAT.barkW);
  haft.position.y=-1.7; g.add(haft);
  const fl=new THREE.Mesh(new THREE.BoxGeometry(1.05,1.25,1.05),torchMat);
  fl.position.y=-3.5; g.add(fl);
  const em=new THREE.Mesh(new THREE.BoxGeometry(1.7,1.9,1.7),
    new THREE.MeshBasicMaterial({color:0xffb347,transparent:true,opacity:0.42,depthWrite:false}));
  em.position.y=-3.5; g.add(em);
  g.position.set(0,-4.0,0.9);
  g.userData.flame=fl; g.userData.halo=em;
  walkerG.userData.armR.add(g);
  torchProp=g; g.visible=false;
  return g;
}
function torchPropTick(){
  const g=ensureTorchProp(); if(!g) return;
  const show=TORCH.s>0.01&&(state.mode==='walk'||state.mode==='deck'||state.mode==='fly');
  g.visible=show;
  if(!show) return;
  const f=0.8+0.35*Math.sin(TORCH.t*13.1)+0.1*Math.sin(TORCH.t*31.3);
  g.userData.flame.scale.set(1,f,1);
  g.userData.halo.scale.setScalar(0.9+0.25*f);
  g.userData.halo.material.opacity=0.30+0.18*f;
}
function setTorch(on){ TORCH.on=!!on; updateTorchBtn();
  if(on) toast('You strike a light. The dark of the earth gives back only what the flame reaches — carry it, and go down.'); }
function updateTorchBtn(){ const b=$('b-torch'); if(!b) return;
  b.textContent='\uD83D\uDD25 Torch: '+(TORCH.on?'lit':'out');
  b.classList.toggle('off',!TORCH.on); }
/* ================= THE ICE KEEPS ITS OWN LIGHT =================
   Every block in the world takes one global day-light. Out at the rim the sun
   is always far off — it runs its course between the tropics and never comes
   near — so that light is a dim brown there, and the wall of ice read as a
   wall of SAND. Ice does not go brown at dusk. It is the most reflective
   thing in the world: under a low sun it stands blue-white and luminous, and
   by night it is still cold. So the ice materials are held out of the common
   light and given a floor of their own — never darker than a deep polar
   blue, and never warm. */
const _iceC=new THREE.Color();
const ICE_HUE=new THREE.Color(0x9dc6ee);      /* the blue-white of ice */
function setIceLight(r,g2,b2){
  const lum=r*0.3+g2*0.6+b2*0.1;
  /* Out at the rim the sun never comes near, so the common day-strength is
     squeezed into its lowest fifth and polar noon is barely brighter than
     polar midnight. For the ice that band is STRETCHED back out — so the
     long day is bright and the long night is dark, as they are at the poles
     — and the whole of it is kept cold, and floored, so it can never read as
     brown sand however far off the sun stands. */
  const t=Math.max(0,Math.min(1,(lum-0.26)/0.26));
  _iceC.copy(ICE_HUE).multiplyScalar(0.34+0.72*t);
  for(const m of ICE_MATS) m.color.copy(_iceC);
}

/* ================= THE BLOCKS THE WORLD IS MADE OF =================
   blocks/ holds one file per kind of block, each calling EARTH.block({…}).
   The mesher used to carry a table of ad-hoc material NAMES — 'grassTop',
   'cobble', 'haySide' — which is a table of TEXTURES, not of materials: it
   could say what a thing looked like and nothing whatever about how long it
   took to break, what tool served, what it dropped or whether it stood on
   nothing. This is the table of materials, and like everything else in this
   project it is data.

   A block has TWO names. Its `id` is a string and is stable for ever — it is
   what a save file speaks, and it must never be renumbered. Its number is
   assigned here, in load order, purely so that an edit can be written down
   in two bytes instead of twelve; and because that number is an accident of
   load order, EVERY SAVE CARRIES ITS OWN TABLE of name-to-number, so a block
   inserted into the manifest next year cannot turn a man's house to salt. */
const BLOCK_DEFS=(window.EARTH&&EARTH.blockList)||[];
const BLOCKS=[null], BLOCK_BY_ID=Object.create(null);
for(let i=0;i<BLOCK_DEFS.length;i++){
  const d=BLOCK_DEFS[i];
  const b={ n:i+1, id:d.id, name:d.name||d.id, tex:d.tex||{},
    hardness:(d.hardness===undefined?1.5:d.hardness), tool:d.tool||null,
    drops:(d.drops===undefined?d.id:d.drops),
    light:d.light||0, opaque:d.opaque!==false, gravity:!!d.gravity,
    liquid:!!d.liquid, verse:d.verse||null };
  /* the three faces the mesher asks for, resolved once so it never has to */
  b.mTop=b.tex.top||b.tex.all||'stone';
  b.mSide=b.tex.side||b.tex.all||b.mTop;
  b.mBottom=b.tex.bottom||b.tex.all||b.mSide;
  BLOCKS.push(b); BLOCK_BY_ID[d.id]=b;
}
function blockOf(n){ return BLOCKS[n]||null; }
function blockId(id){ const b=BLOCK_BY_ID[id]; return b?b.n:0; }
function blockName(n){ const b=BLOCKS[n]; return b?b.name:'Air'; }
/* the block a stretch of ground is MADE of, so that breaking the world gives
   back the thing that was there and not a generic lump. The mesher's own
   kinds are the key; anything it has no word for gives stone. */
const KIND_BLOCK={ grass:'grass', tropic:'grass', tundra:'grass', savanna:'grass',
  sand:'sand', desert:'sand', snow:'snow', wall:'ice', floe:'ice',
  rock:'stone', alpine:'dirt', badlands:'clay-band' };
function surfaceBlockOf(kind){ return blockId(KIND_BLOCK[kind]||'stone'); }
function depthBlockOf(kind){
  if(kind==='sand'||kind==='desert') return blockId('sand');
  if(kind==='badlands') return blockId('clay-band');
  if(kind==='wall'||kind==='floe') return blockId('ice');
  return blockId('stone');
}

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

/* ================= THE NAMED PLACES OF THE EARTH =================
   world/landmarks.js names the true summits and the famous works of the
   ancients, each at its real latitude and longitude. The mountains raise
   the very land (cellRaw drinks from MOUNTS below); the built wonders are
   raised as structures when the traveller draws near (updateLandmarks). */
const LANDMARKS=(window.EARTH&&window.EARTH.landmarkList)||[];
function llToWorld(lat,lon){ const r=(90-lat)/180, a=lon*Math.PI/180;
  return [r*Math.sin(a)*R_WORLD, r*Math.cos(a)*R_WORLD]; }
/* ---- THE SCALE OF THE MOUNTAINS ----
   True elevation cannot be laid on the disc as it stands. At 6 units to the
   kilometre, Everest's 8,849 m would stand barely 9 blocks — LOWER than the
   hills beside it. So the heights of the earth are raised by one constant,
   and every mountain keeps its right proportion to every other: retune this
   line and the whole world's relief moves together.
   At 40 m to the block Everest stands 221 blocks — 1,326 units — far above
   the floor of cloud at 238, so the great summits truly stand in the clouds
   and are seen from days away at sea. */
const MTN_M_PER_BLOCK=40;
/* and how high a range that bears no name may climb of itself */
const MTN_MAX=170;
const MOUNTS=[];
for(const L of LANDMARKS){ if(L.kind!=='mount') continue;
  const [mx,mz]=llToWorld(L.lat,L.lon);
  const peak=(L.elev!==undefined)?L.elev/MTN_M_PER_BLOCK:(L.peak||18);
  /* ---- A MOUNTAIN IS AS BROAD AS IT IS HIGH — AND THEN SOME ----
     The heights are drawn at forty metres to the block but the ground at a
     kilometre, so a summit given only its geographic footprint comes out a
     POLE IN THE SKY: Hermon stood seventy blocks tall on a base fifty wide.
     Every named height now claims ground in PROPORTION TO ITS PEAK — flank
     runs at least three-and-a-half times the rise — so the great summits
     are true massifs the traveller ascends: mountain country swelling for
     miles, ridges on the shoulders, and the crown court at the top of the
     long climb. (A rock that is FAMOUS for standing sheer — Uluru, Table
     Mountain — says steep:1 in world/landmarks.js and keeps its walls.) */
  const Rm=L.steep?(L.r||110)*1.75:Math.max((L.r||110)*1.75, peak*B*3.6);
  MOUNTS.push({x:mx,z:mz,R:Rm,peak}); }
/* ---- THE SECRET RANGES — whole fields of peaks, with caves in them ----
   kind:'range' in world/landmarks.js. Where a MOUNT is one summit, a RANGE
   is mountain COUNTRY: ridge-noise over the whole massif raises a dozen
   jagged crests with valleys between ('stony' — bare grey peaks, snow where
   the height takes them; 'cliff' — green hill country broken into sheer
   grey faces and ledges, the classic extreme hills). And they are cut
   through with what no other ground in the world has:
     · CAVES — winding slot canyons, sunk to fourteen blocks where the vein
       pinches, that swallow the sky and give it back at the far end;
     · BLUE HOLES — sheer round shafts of standing water sunk in the rock,
       sisters to the ones in the reefs.
   No banner, no chart mark: these places are found by GOING there. */
const RANGES=[];
for(const L of LANDMARKS){ if(L.kind!=='range') continue;
  const [rx,rz]=llToWorld(L.lat,L.lon);
  const peak=(L.elev!==undefined)?L.elev/MTN_M_PER_BLOCK:(L.peak||30);
  const sd=hash2(rx*0.00013,rz*0.00017)*97;
  const g={x:rx,z:rz,R:L.r||900,peak,style:L.style||'cliff',sd,holes:[],snowcap:!!L.snowcap};
  /* two blue holes to a range, seeded by the range itself */
  for(let k=0;k<2;k++){ const a=hash2(sd,k*3.3)*6.283, rr=g.R*(0.22+hash2(k*7.1,sd)*0.34);
    g.holes.push({x:rx+Math.cos(a)*rr, z:rz+Math.sin(a)*rr, R:26}); }
  RANGES.push(g); }
/* ---- THE SECRET FALLS OF THE CARIBBEAN ----
   kind:'falls' — a whole waterfall PLACE, minecraft-fashion: the land
   itself is raised into a cliff head on one side and sunk into a lagoon
   basin on the other, and when the traveller draws near the water is hung
   on it (lmFalls): the broad blue sheet down the face, white water boiling
   at the foot, the pool, and the stream running away out of it. Dunn's
   River, Kaieteur, Trafalgar and their fellows — each in its own land,
   each secret:1: no banner, no mark, found by walking the island. */
/* ================= AND THE HOLLOW PLACES UNDER THEM =================
   js/caves.js is the whole law of the caves and knows nothing of this
   world; it is handed the countries the caves belong to, once, here. Every
   named range and every named summit carries a cave country about it, so
   the hollow places are where a traveller would go looking for them — and
   js/caves.js adds a sparse worldwide scatter of its own besides, so a man
   who never climbs a named mountain still finds a way down. */
if(window.CAVES){
  const seeds=[];
  for(const g of RANGES) seeds.push({x:g.x,z:g.z,r:Math.max(3200,g.R*3.6)});
  for(const m of MOUNTS) seeds.push({x:m.x,z:m.z,r:Math.max(2200,(m.R||900)*2.4)});
  CAVES.seed(seeds);
}
const FALLS=[];
for(const L of LANDMARKS){ if(L.kind!=='falls') continue;
  const [fx,fz]=llToWorld(L.lat,L.lon);
  /* the face looks a CARDINAL way, so the sheet of water lies square with
     the world the way every minecraft fall does */
  const q=Math.floor(hash2(fx*0.00017,fz*0.00013)*4);
  const dx=[0,1,0,-1][q], dz=[1,0,-1,0][q];
  FALLS.push({x:fx,z:fz,R:L.r||180,dx,dz,
    head:L.elev?Math.max(10,Math.min(30,Math.round(L.elev/8))):14});
}
function fallsShapeAt(x,z){
  let v=0;
  for(const F of FALLS){ const dx=x-F.x; if(dx>F.R||dx<-F.R) continue;
    const dz=z-F.z; if(dz>F.R||dz<-F.R) continue;
    const d=Math.hypot(dx,dz); if(d>=F.R) continue;
    const t=1-d/F.R, broad=t*t*(3-2*t);
    /* + behind the lip (the head), − before it (the pool) */
    const s=(dx*F.dx+dz*F.dz)/(F.R*0.32);
    const rise=Math.min(1,Math.max(0,s*2.6));
    const up=F.head*broad*rise;
    const dip=(s<-0.2&&d<F.R*0.62)?-3*broad:0;
    const q2=up+dip;
    if(Math.abs(q2)>Math.abs(v)) v=q2;
  }
  return v;
}
/* what a range does to one spot of ground: the uplift of its peaks, the
   cut of its canyons and shafts, and whether the cliff-ledge look rules */
function rangeShapeAt(x,z){
  let up=0, cut=0, cliff=0, snowTop=false;
  for(const g of RANGES){
    const dx=x-g.x; if(dx>g.R||dx<-g.R) continue;
    const dz=z-g.z; if(dz>g.R||dz<-g.R) continue;
    const d=Math.hypot(dx,dz); if(d>=g.R) continue;
    const tb=1-d/g.R, broad=tb*tb*(3-2*tb);
    const jag=ridgeNoise(x*0.0042+g.sd, z*0.0042-g.sd);
    const u=g.peak*broad*(0.22+0.78*Math.pow(jag, g.style==='stony'?1.1:1.5));
    if(u>up){ up=u; cliff=(g.style==='cliff')?broad:0;
      /* a researched snowcap whitens the upper crests only */
      snowTop=g.snowcap&&u>g.peak*0.72; }
    /* the caves: slot canyons where the vein-field pinches to nothing */
    const vein=1-Math.abs(2*fbm(x*0.0058-g.sd*2, z*0.0058+g.sd*2)-1);
    if(vein>0.84&&broad>0.2){ const c=(vein-0.84)/0.16*14*Math.min(1,broad*1.7);
      if(c>cut) cut=c; }
    /* the blue holes: sheer round shafts */
    for(const H of g.holes){ const hd=Math.hypot(x-H.x,z-H.z);
      if(hd<H.R){ const t=Math.min(1,(H.R-hd)/(H.R*0.3));
        const c2=17*t*t; if(c2>cut) cut=c2; } }
  }
  return (up>0.5||cut>0.5)?{up,cut,cliff,snowTop}:null;
}
/* ---- THE DEEPS OF THE SEA — the trenches, each at its own place ----
   world/deeps.js names them with their TRUE soundings in metres, and the
   engine sinks the bed to meet them. Unlike the mountains these are not
   scaled at all: a block is a metre in the reckoning a man swims and dives
   by, so the Challenger Deep is 11,034 blocks down and the gauge says so. */
const DEEPS=[];
for(const D2 of ((window.EARTH&&window.EARTH.deepList)||[])){
  const [dx,dz]=llToWorld(D2.lat,D2.lon);
  DEEPS.push({x:dx,z:dz,R:(D2.r||800),m:(D2.m||6000),n:D2.n}); }
/* how deep the named trenches call for the bed to lie at a place, in metres.
   A trench is not a bowl: it is a broad trough with a narrow GUT cut down the
   length of it, so the last two kilometres of the descent come suddenly. */
function trenchDepthAt(x,z){ let m=0;
  for(const t of DEEPS){ const dx=x-t.x; if(dx>t.R||dx<-t.R) continue;
    const dz=z-t.z; if(dz>t.R||dz<-t.R) continue;
    const d=Math.hypot(dx,dz); if(d>=t.R) continue;
    const tb=1-d/t.R, broad=tb*tb*(3-2*tb);
    const rs=t.R*0.24, ts=d<rs?1-d/rs:0, gut=ts*ts*(3-2*ts);
    const v=t.m*(0.56*broad+0.44*gut);
    if(v>m) m=v; }
  return m; }
/* ---- THE BLUE HOLES — sheer shafts sunk through the reefs ----
   Cut AFTER the shelf is drawn and cut sheer: the mouth is a ring of coral in
   a few fathoms of turquoise, and inside it the wall goes straight down into
   ink. It is the one place in the sea where the bed falls hundreds of metres
   without a slope to walk it. */
const HOLES=[];
for(const H of ((window.EARTH&&window.EARTH.holeList)||[])){
  const [hx,hz]=llToWorld(H.lat,H.lon);
  HOLES.push({x:hx,z:hz,R:(H.r||80),m:(H.m||120),n:H.n}); }
/* how much FURTHER the bed drops here than the reef about it. A blue hole is
   not an absolute depth — it is a shaft sunk below whatever floor it opens
   in — so it is added to the bed rather than compared against it, and the
   shaft is as deep below the rim as the charts say it is. */
function holeCutAt(x,z){ let v=0;
  for(const h of HOLES){ const dx=x-h.x; if(dx>h.R||dx<-h.R) continue;
    const dz=z-h.z; if(dz>h.R||dz<-h.R) continue;
    const d=Math.hypot(dx,dz); if(d>=h.R) continue;
    const t=Math.min(1,(h.R-d)/(h.R*0.14));      /* the wall stands up in a seventh of the mouth */
    const q=h.m*(t*t*(3-2*t));
    if(q>v) v=q; }
  return v; }
/* ================= THE BEACHES OF THE WORLD =================
   The shelf ran straight from the water's edge into the break — two metres
   deep at the first step off the sand and five within a dozen paces — so
   there was nowhere for anyone to STAND in the water: no paddling, no wading
   out, no shallows for a village to enjoy its own shore in.
   EVERY coast in the world now carries a WADING SHELF at its foot: a broad,
   near-flat floor of sand a man can walk out across and a village can stand
   in, and only past it does the ground begin to fall away toward the break.
   And a land may name its OWN shores. A beach belongs to the country it is
   in, so it is declared in that country's file (countries/README.md) — Bondi
   in australia.js, Copacabana in brazil.js, the shingle of Chesil in
   united-kingdom.js — each with its own width, its own depth and its own
   sand. They ease into the world's common shore across their radius, so
   there is never a seam where a named beach stops. */
const BEACH_DEF={wadeM:2.2, wadeR:240, roll:0.7};   /* what every coast is, unnamed */
const BEACHES=[];
for(const C of ((window.EARTH&&window.EARTH.list)||[])){
  if(!C.beaches) continue;
  for(const Bh of C.beaches){
    const [bx,bz]=llToWorld(Bh.lat,Bh.lon);
    BEACHES.push({x:bx,z:bz,R:(Bh.r||600),n:Bh.n,land:C.n,
      wadeM:(Bh.wadeM===undefined?BEACH_DEF.wadeM:Bh.wadeM),
      wadeR:(Bh.wadeR===undefined?BEACH_DEF.wadeR:Bh.wadeR),
      roll:(Bh.roll===undefined?BEACH_DEF.roll:Bh.roll),
      sand:Bh.sand||'pale'}); } }
/* the beach at a place: the nearest named one, EASED into the world's own
   common shore across its radius, so there is never a seam where a named
   beach stops and the common one begins. */
const _bch={wadeM:0,wadeR:0,roll:0,sand:'pale',named:null};
function beachAt(x,z){
  let best=null,bw=0;
  for(const b of BEACHES){ const dx=x-b.x; if(dx>b.R||dx<-b.R) continue;
    const dz=z-b.z; if(dz>b.R||dz<-b.R) continue;
    const d=Math.hypot(dx,dz); if(d>=b.R) continue;
    const t=1-d/b.R, w=t*t*(3-2*t);
    if(w>bw){ bw=w; best=b; } }
  if(!best){ _bch.wadeM=BEACH_DEF.wadeM; _bch.wadeR=BEACH_DEF.wadeR;
    _bch.roll=BEACH_DEF.roll; _bch.sand='pale'; _bch.named=null; return _bch; }
  _bch.wadeM=BEACH_DEF.wadeM+(best.wadeM-BEACH_DEF.wadeM)*bw;
  _bch.wadeR=BEACH_DEF.wadeR+(best.wadeR-BEACH_DEF.wadeR)*bw;
  _bch.roll =BEACH_DEF.roll +(best.roll -BEACH_DEF.roll )*bw;
  _bch.sand=bw>0.5?best.sand:'pale'; _bch.named=bw>0.35?best:null;
  return _bch;
}
/* the nearest named beach to a place, and how far off it lies */
function nearestBeach(x,z){ let best=null,bd=1e18;
  for(const b of BEACHES){ const d=Math.hypot(x-b.x,z-b.z); if(d<bd){bd=d;best=b;} }
  return best?{beach:best,d:bd}:null; }
/* the nearest named deep to a place, and how far off it lies */
function nearestDeep(x,z){ let best=null,bd=1e18;
  for(const t of DEEPS){ const d=Math.hypot(x-t.x,z-t.z); if(d<bd){bd=d;best=t;} }
  return best?{deep:best,d:bd}:null; }
/* A summit is not a cone. Every great mountain sits in the midst of a massif
   that swells for hundreds of kilometres about it — the plateau under
   Everest, the Alps under Mont Blanc — with the peak a sharp thing standing
   out of it. So the uplift is TWO lobes: a broad one across the whole radius
   that raises the country itself, and a steep one across a seventh of it
   that raises the summit. One cone gave a pyramid; two give a range. */
function mountUpliftAt(x,z){ let up=0;
  for(const m of MOUNTS){ const dx=x-m.x; if(dx>m.R||dx<-m.R) continue;
    const dz=z-m.z; if(dz>m.R||dz<-m.R) continue;
    const d=Math.hypot(dx,dz); if(d>=m.R) continue;
    const tb=1-d/m.R, broad=tb*tb*(3-2*tb);
    /* the summit cone is seated OUTSIDE the flat crown — measured from the
       court's rim, not the centre — so the cone rises to meet the court and
       carries it, instead of leaving it a table on a pole */
    const d2=Math.max(0,d-MTN_FLAT_R);
    const rs=m.R*0.14, ts=d2<rs?1-d2/rs:0, sharp=ts*ts*(3-2*ts);
    const u2=m.peak*(0.58*broad+0.42*sharp);
    /* A massif is not a smooth dome. The ridge field breaks its flanks into
       spurs and corries, so the shoulders are mountain country and not a
       terraced table. It is ADDED, and dies away at the summit — so a named
       height always keeps its own true measure and is never noised down. */
    const relief=m.peak*0.20*broad*(1-sharp)*ridgeNoise(x*0.0013-21,z*0.0013+33);
    const t2=u2+relief;
    if(t2>up) up=t2; }
  return up; }
/* ---- THE SUMMIT COURT ----
   Every named summit came to a noise-broken point nobody could STAND on —
   and a mountain men go up (Hermon, Sinai, Ararat) has always had room at
   the top for the company that climbs it. The crown of every named height
   is now a LEVEL COURT, about nine blocks across — ground enough for a
   score of souls to stand together on the top of the world with space to
   spare. Inside the ring the height is the mountain's own true measure
   exactly, whatever the ridge noise wanted; the rim falls away as cliff,
   which is what the top of such a mountain is. */
const MTN_FLAT_R=27;
function mountFlatAt(x,z){
  for(const m of MOUNTS){ const dx=x-m.x; if(dx>MTN_FLAT_R||dx<-MTN_FLAT_R) continue;
    const dz=z-m.z; if(dz>MTN_FLAT_R||dz<-MTN_FLAT_R) continue;
    if(dx*dx+dz*dz<=MTN_FLAT_R*MTN_FLAT_R) return 1+Math.round(m.peak); }
  return 0; }
/* ---- RIDGED MULTIFRACTAL — the shape a mountain chain actually takes ----
   Plain fbm makes round blobs. Folding it about its midline (1−|2f−1|) puts
   a CREST wherever it crossed the middle, so the field runs in long
   ridgelines with spurs and saddles between them, as ranges truly lie.
   Squaring each octave sharpens those crests. Held to three LOW octaves on
   purpose: a fine octave here becomes a cliff at every pace, and makes a
   range that cannot be walked at all. */
function ridgeNoise(x,z){
  let s=0, amp=1, f=1, tot=0;
  for(let o=0;o<3;o++){ const r=1-Math.abs(fbm(x*f,z*f)*2-1);
    s+=r*r*amp; tot+=amp; amp*=0.5; f*=2.07; }
  return s/tot;
}

/* ================= THE SHOAL MAP =================
   A distance-to-land field over the whole disc (chamfer transform of the
   country map). The water shader drinks from it: where the bottom lies
   near — along every coast and up every river — the sea stands clear and
   turquoise and the light passes through to the sand; over the true deep
   it keeps its darkness. */
/* the raw field: how far every point of the map lies from the nearest dry
   land, in map pixels (≈117 units each). TWO things are drawn off it — the
   SHOAL, which is the clear turquoise water of a coast, and the OFFSHORE
   REACH, by which the bed of the sea falls away from the strand through the
   shelf, the slope and the rise to the abyssal plain. */
const LAND_PX=(()=>{
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
  return d;
})();
/* a 3×3 blur, run a few times — no texel facets on the open water */
function _blurField(f,R2,passes){
  for(let pass=0;pass<passes;pass++){ const g2=new Float32Array(R2*R2);
    for(let y=0;y<R2;y++) for(let x=0;x<R2;x++){
      let s2=0,n2=0;
      for(let dy=-1;dy<=1;dy++){ const yy=y+dy; if(yy<0||yy>=R2) continue;
        for(let dx=-1;dx<=1;dx++){ const xx=x+dx; if(xx<0||xx>=R2) continue;
          s2+=f[yy*R2+xx]; n2++; } }
      g2[y*R2+x]=s2/n2; }
    f=g2; }
  return f;
}
let SHOAL_DATA=null; const SHOAL_RES=1024;
const SHOAL_TEX=(()=>{
  const N=MAPR, R2=SHOAL_RES; let f=new Float32Array(R2*R2);
  for(let y=0;y<R2;y++) for(let x=0;x<R2;x++){
    const dist=LAND_PX[Math.min(N-1,y*2)*N+Math.min(N-1,x*2)];   /* in map pixels, ≈117 units each */
    f[y*R2+x]=Math.max(0,1-dist/4.5); }
  f=_blurField(f,R2,2);
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
/* ---- HOW FAR OUT TO SEA ----
   0 at the strand, 1 out past the continental rise. OFF_PX map pixels is
   some 470 km of open water — the width of a true shelf, slope and rise laid
   end to end. The whole shape of the bed between the beach and the abyssal
   plain is read off this one number. */
const OFF_RES=512, OFF_PX=24; let OFF_DATA=null;
(()=>{ const N=MAPR, R2=OFF_RES, st=Math.floor(N/R2); let f=new Float32Array(R2*R2);
  for(let y=0;y<R2;y++) for(let x=0;x<R2;x++)
    f[y*R2+x]=Math.min(1,LAND_PX[Math.min(N-1,y*st)*N+Math.min(N-1,x*st)]/OFF_PX);
  f=_blurField(f,R2,3);
  OFF_DATA=new Uint8Array(R2*R2);
  for(let i=0;i<R2*R2;i++) OFF_DATA[i]=Math.round(f[i]*255);
})();
/* read BETWEEN the texels: a texel is 470 units across and the whole
   continental slope is laid within a few of them, so a nearest-neighbour
   reading would cut the descent into three or four sheer steps. */
function offshoreAt(x,z){
  const R2=OFF_RES;
  const fx=Math.min(R2-1.001,Math.max(0,(x/R_WORLD+1)*0.5*R2-0.5));
  const fz=Math.min(R2-1.001,Math.max(0,(z/R_WORLD+1)*0.5*R2-0.5));
  const ix=fx|0, iz=fz|0, tx=fx-ix, tz=fz-iz;
  const a=OFF_DATA[iz*R2+ix],       b=OFF_DATA[iz*R2+ix+1];
  const c=OFF_DATA[(iz+1)*R2+ix],   d=OFF_DATA[(iz+1)*R2+ix+1];
  return ((a+(b-a)*tx)+((c+(d-c)*tx)-(a+(b-a)*tx))*tz)/255;
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
    /* ---- THE WALL OF ICE ----
       It climbs out of the sea to TWO THOUSAND FEET — 610 blocks, a block
       being a metre in the reckoning a man walks, swims and dives by — and
       there it STOPS CLIMBING. From that height out to the rim it is one
       flat field of ice, three hundred and fifty blocks across: a crown a man
       may stand upon and walk to the world's edge, with nothing above him but
       the firmament coming down to meet the ice ahead.
       The climb is kept near a block to the pace so it can be walked, and
       broken by long swells of the ice into buttresses and crevasses — and
       the break dies away exactly where the crown begins, so the plateau is
       LEVEL, and reads as the one flat thing at the end of the world. */
    let wh;
    if(t<WALL_CLIMB){ const p=t/WALL_CLIMB;
      wh=6+Math.pow(p,1.1)*(WALL_TOP-6);          /* the long climb up out of the sea */
      /* buttresses and crevasses, dying away into the crown */
      const rough=1-p;
      wh+=((n2-0.5)*44+(n-0.5)*6)*rough*rough; }
    else wh=WALL_TOP;                             /* THE CROWN — flat, and flat to the rim */
    return {h:Math.max(4,Math.round(wh)), kind:'wall', tree:0, ci:0}; }
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
  /* ---- THE RANGES ----
     The plains stay flat and walkable (h=1..2, solid footing, few steps).
     Where the broad mask says mountains STAND, a ridged multifractal says
     what SHAPE they take there, so they run in chains with ridgelines and
     valleys rather than swelling into round lumps. MTN_MAX is how high a
     nameless range may climb; the named summits are raised on top of it. */
  const mtnMask=fbm(ix*.018+120,iz*.018-30);
  const mtn=Math.max(0,mtnMask-0.52)/0.48;             // 0 on the plains, →1 in the ranges
  let rise=0;
  if(mtn>0.001){
    const rg=ridgeNoise(ix*.0045+9,iz*.0045-14);
    /* THE PASSES — a slow seam crossing every chain, where the rock is drawn
       down into a saddle. These are the roads men and beasts have always
       taken through the mountains; without them a range is a wall, and at
       these heights a wall no one could ever cross. */
    const seam=Math.abs(fbm(ix*.0032-55,iz*.0032+21)*2-1);
    const gate=0.26+0.74*Math.min(1,seam*4.5);
    rise=Math.pow(mtn,2.0)*Math.pow(rg,1.35)*inland*gate*MTN_MAX;
  }
  const mtnF=Math.min(1,rise/40);                      // how mountainous this cell stands
  /* the fine noise is damped on the heights: at full strength upon a mountain
     it puts a step at every pace and the range cannot be climbed */
  let h=1+Math.floor(n*1.5*(1-0.72*mtnF))+Math.floor(rise);
  /* the named summits of the true earth rise out of the land — Ararat,
     Sinai, Everest and their fellows, each at its own place */
  const mUp=mountUpliftAt(x,z);
  if(mUp>0.5) h+=Math.round(mUp);
  /* the crown of a named height is a level court a company can stand on */
  const fh=mountFlatAt(x,z); if(fh){ h=fh; }
  /* ---- THE SECRET RANGES ----
     peaks first; then the cliff-ledge look (the height part-snapped to
     terraces, so the flanks break into sheer faces and standing shelves);
     then the CAVES and BLUE HOLES cut down through all of it */
  const rs=RANGES.length?rangeShapeAt(x,z):null;
  if(rs){
    if(rs.up>0.5) h+=Math.round(rs.up);
    if(rs.cliff>0.3){ const hq=Math.round(h/5)*5; h=Math.round(hq*0.62+h*0.38); }
    if(rs.cut>0.5) h=Math.max(3,h-Math.round(rs.cut));
  }
  /* the secret falls raise their cliff head and sink their lagoon */
  const fv=FALLS.length?fallsShapeAt(x,z):0;
  if(fv>0.5) h+=Math.round(fv);
  else if(fv<-0.5) h=Math.max(2,h+Math.round(fv));
  if(inland<1&&mUp<=0.5&&!(rs&&rs.up>0.5)&&fv<=0.5){
    /* the shore terraces gently to the water, so every coast keeps a landing
       (a named summit is never shorn) — but a range that truly runs down to
       the sea is let stand, as ranges do */
    const cap=1+Math.round(inland*4)+Math.round(mtnF*mtnF*40);
    if(h>cap) h=cap;
  }
  /* ---- THE BANDS OF THE HEIGHTS ----
     Height rules the land as much as latitude does now. The tree line and
     the snow line both ride high over the equator and come down to meet the
     sea at the poles, so a mountain wears forest upon its flanks, bare scree
     above that, and snow upon its crown. (Everything above 5 blocks used to
     be turned to naked rock with its trees stripped off — which was no loss
     when nothing could stand higher than a hill, and would now shear the
     forest off every mountain in the world.) */
  /* The true snow line runs near 5,000 m over the equator and comes down to
     meet the sea about 78° — so it is taken in METRES and put through the
     same scale as the summits, and the two agree by construction. The tree
     line sits at about five-eighths of it, as it does on the earth: forest
     to 1,800 m in the Alps, to 3,000 m on Kilimanjaro. */
  const snowLine=Math.max(3, 5000*(1-Math.pow(Math.min(1,Math.abs(lat)/78),1.6))/MTN_M_PER_BLOCK);
  const treeLine=snowLine*0.62;
  const snow = lat>72 || lat<-55 || h>snowLine || !!(rs&&rs.snowTop);
  const tundra = !snow && lat>58 && lat<=72;
  const alpine = !snow && !tundra && h>treeLine;
  const desert = !alpine && lat>11 && lat<36 && n2>0.42 && inland>0.5;
  const tropic = lat<=11 && lat>-38;
  let kind, tree=0;
  /* broad biome regions carve out cherry-blossom hills and badland mesas */
  const region=fbm(ix*.012-70,iz*.012+140);
  /* ---- THE WOODS STAND IN GROVES ----
     Trees were scattered evenly, one cell in sixteen. At the old stature that
     read as open country with trees in it; grown to their proper height it
     closed overhead into a canopy the traveller walked blind through. They
     are thinner now, and GATHERED: thick where a wood stands, open in the
     glades between, so there is somewhere to walk and something to see. */
  const grove=fbm(ix*.035-17,iz*.035+29);
  const dens=Math.max(0,Math.min(1,(grove-0.36)/0.38));
  const lon=Math.atan2(u,v)*180/Math.PI;              /* longitude upon the disc */
  /* badlands (barren mesas) only in the arid belt — the tan wastes of the map */
  const badlands = !snow&&!tundra&&lat>11&&lat<36&&n2>0.42&&region<0.43&&inland>0.4;
  /* cherry blossom only in the far east — the lands of Yapan, China and Korea */
  const eastAsia = lat>20&&lat<46&&lon>96&&lon<148;
  const cherry   = !snow&&!tundra&&!desert&&eastAsia&&region>0.46;
  /* ---- THE PLAIN ----
     The great grassland of the earth had no existence in this world at all.
     Every acre of the tropics was drawn as either sand or closed jungle — so
     the one country that the herds of the earth actually live upon was the
     one country that was missing, and the elephant, the giraffe and the lion
     had nowhere to stand that was theirs. It is dun grass to the horizon with
     thorn trees standing singly in it, and it is drawn WHERE IT TRULY LIES:
       · the Sahel, and the East African plain from Ethiopia to the Cape
       · the llanos and the cerrado, between the Amazon and the Plate
       · the Deccan of India
       · the north of the great south land
     and not, on any account, in the closed rain forest inside those bounds —
     the Congo basin, the Amazon and the isles of the east keep their trees. */
  const inBox=(a,b,c,d)=>lat>a&&lat<b&&lon>c&&lon<d;
  const savBelt = inBox(-32,17,10,52) || inBox(-24,12,-72,-40)
               || inBox(6,27,68,89)   || inBox(-25,-10,118,151);
  const rainForest = inBox(-6,5,11,31) || inBox(-13,6,-76,-49)
                  || inBox(-11,13,94,132) || inBox(3,9,-17,10);
  /* and it frays at its own edges — the noise breaks the belt into open plain
     and standing wood, so no country changes at a straight line */
  const savanna = savBelt&&!rainForest&&!snow&&!tundra&&!alpine&&!desert&&!badlands
    && fbm(ix*.02+61,iz*.02-44)>0.37;
  /* a broad, flat, walkable beach along every warm/temperate coast
     (but not where a range comes down to the water — there the rock meets
     the sea, as it does at every mountainous coast on the earth) */
  const beach = mUp<=0.5 && !snow&&!tundra&&!badlands&&!alpine&&mtnF<0.35
    &&(inland<=0.5 || (inland<0.8&&h<=2));
  if(beach){ kind='sand'; h=Math.min(h,2);
    if(tropic&&j<0.022*dens) tree=2;           /* palms on the strand */
  }
  else if(h<=2 && inland<1 && !snow && !tundra && !badlands){ kind='sand'; h=Math.min(h,2); }
  else if(snow) kind='snow';
  else if(tundra){ kind='tundra'; tree=j<0.016*dens?1:0; }
  /* the alpine band: scree and stunted pine on the shoulders of the range,
     giving way to bare rock as it nears the snow */
  else if(alpine){
    kind = h>treeLine+(snowLine-treeLine)*0.45 ? 'rock' : 'alpine';
    tree = (kind==='alpine'&&j<0.016*dens) ? 1 : 0;
  }
  else if(badlands){ kind='badlands'; tree=j<0.005?1:0;
    const bh=fbm(ix*.045+7,iz*.045-3);              /* the badlands' own eroded relief */
    h=2+Math.floor(bh*8)+Math.floor(Math.pow(mtn,1.2)*inland*8);
    h=Math.max(2,Math.floor(h/2)*2);                /* terraced in steps of two */
    if(mUp>0.5) h+=Math.round(mUp);                 /* Uluru and its kin rise from the waste */
  }
  /* THE WASTE IS NOT BARE. It bore nothing whatever — not a date palm at a
     well, not a saguaro, not a thorn — because nothing but the temperate and
     tropic grounds was ever given a tree at all. It is still a waste: one
     cell in a hundred and sixty, so what stands there stands ALONE, and is
     worth walking to. */
  else if(desert){ kind='desert'; tree=j<0.006?1:0; }
  /* the plain, and the thorn trees standing SINGLY upon it — a savannah is
     not a thin wood, it is open ground with a tree in the middle distance */
  else if(savanna){ kind='savanna'; tree=j<0.008?4:0; }
  else if(cherry){ kind='grass'; tree=j<0.075*dens?3:0; } /* cherry-blossom groves */
  else if(tropic){ kind='tropic'; tree=j<0.062*dens?2:0; }
  else { kind='grass'; tree=j<0.045*dens?1:0; }
  /* (the old blanket rule turning EVERY cell above 5 blocks to bare rock and
     stripping its trees is gone — it belonged to a world whose tallest thing
     was a hill. The tree line does that work now, and does it by altitude
     and by latitude both, so the forest climbs the flanks.) */
  /* ---- AND WHAT HAS BEEN HOLLOWED OUT OF IT ----
     `spans` is the third dimension, and it is `null` for very nearly every
     column on the earth — which is the whole reason the ordinary world stays
     exactly as cheap as it was. Where it is not null it is a short, sorted,
     disjoint list of AIR RUNS in blocks: solid below the first, solid from
     the last up to h, and nothing in between. The law of them is entirely in
     js/caves.js; the terrain only asks.
     The top block is never taken, so the surface a man walks on, a village
     is laid on and a tree grows out of is solid everywhere on the earth —
     which is why none of the eighty-seven places that read `h` had to move. */
  const spans=window.CAVES?CAVES.spansAt(x,z,h):null;
  return spans?{h, kind, tree, ci, spans}:{h, kind, tree, ci};
}
/* villages flatten the ground around them (computed at boot) */
let SITES=[], siteGrid=new Map();
function siteKey(u,v){ return Math.floor((u+1)*16)+','+Math.floor((v+1)*16); }
/* THE CELL CACHE — cell() is the hottest call in the game: chunk meshing,
   every NPC step, every beast, every ground query. The terrain is immutable
   once the village sites are computed, so the finished cells are memoised.
   (Enabled only after computeSites() — before that the flattening would be
   baked in wrong. Cleared wholesale when it grows past bound.) */
const CELL_CACHE=new Map(); let cellCacheOn=false;
function cell(ix,iz){
  if(!cellCacheOn) return cellCompute(ix,iz);
  const k=(ix+20000)*50000+(iz+20000);
  let c=CELL_CACHE.get(k);
  if(c===undefined){ c=cellCompute(ix,iz);
    if(CELL_CACHE.size>350000) CELL_CACHE.clear();
    CELL_CACHE.set(k,c); }
  return c;
}
/* keep every air run under a surface that has moved: nothing may reach
   within a block of the top, and a run left with no rock over it is gone */
function clipSpans(sp,h){
  const top=h-1; const out=[];
  for(let i=0;i<sp.length;i+=2){
    const lo=sp[i]; let hi=sp[i+1];
    if(lo>=top) continue;
    if(hi>top) hi=top;
    if(hi-lo>=2) out.push(lo,hi);
  }
  return out.length?Int16Array.from(out):null;
}
function cellCompute(ix,iz){
  const c=cellRaw(ix,iz); if(!c) return null;
  if(SITES.length&&c.kind!=='wall'&&c.kind!=='floe'){
    const x=(ix+.5)*B, z=(iz+.5)*B, u=x/R_WORLD, v=z/R_WORLD;
    const near=siteGrid.get(siteKey(u,v));
    if(near) for(const st of near){
      const d=Math.hypot(x-st.x,z-st.z);
      if(d<170){ const t=Math.min(1,(170-d)/120);
        /* ---- AND THE CORE IS LEVEL, NOT NEARLY LEVEL ----
           The flattening only ever reached 92 per cent of the way, so where
           a village stood against a mountain the remaining eight per cent of
           a two-hundred-block peak was still sixteen blocks of rock — coming
           up THROUGH the floors and roofs of the houses built on it. Within
           the ring the houses actually stand in, the ground is now taken to
           the site's own height exactly; the skirt beyond still eases out
           into the true land so no village sits on a cut-out plate. */
        const k=(t>=1)?1:t*0.92;
        const h0=c.h;
        c.h=Math.max(1,Math.round(c.h+(st.h0-c.h)*k));
        if(c.kind!=='sand'&&c.h===1) c.h=2;
        /* ---- AND THE HOLLOW UNDER IT COMES DOWN WITH THE GROUND ----
           A village levels the land for eighty-six units about it. Where it
           levels a hill that had a passage in it the ground can drop THROUGH
           the roof of that passage, and an air run standing over the new
           surface is a hole in the world — you would see daylight from inside
           the rock and fall through the market square. Every run is clipped
           back under the new surface, and any that no longer has rock over it
           is dropped outright. */
        if(c.spans&&c.h<h0) c.spans=clipSpans(c.spans,c.h);
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
    /* Villages settle on LOW GROUND. A site flattens the land for 86 units
       about it, so one that fell on a mountain shoulder would now raise a
       two-hundred-block table into the sky. Every country is searched first
       under a height bar; only if it has no low ground anywhere is the bar
       lifted, so no land is left without a settlement. */
    let maxH=12;
    const tryPt=(u,v)=>{ const ix=Math.floor(u*R_WORLD/B), iz=Math.floor(v*R_WORLD/B);
      const cc=cellRaw(ix,iz);
      if(cc&&cc.kind!=='wall'&&cc.kind!=='floe'&&cc.h<=maxH)
        return {i,ix,iz,x:(ix+.5)*B,z:(iz+.5)*B,h0:Math.max(2,cc.h)};
      return null; };
    for(let pass=0;pass<2&&!best;pass++){
    maxH = pass===0 ? 12 : 1e9;
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
    }
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
/* ---- AND A FACE MAY CARRY A COLOUR, NOT ONLY A SHADE ----
   `s` was one number, the light on the face, written into all three channels.
   It may now be a TRIPLE — the light already multiplied into a colour. That
   one change is what lets a hundred kinds of tree stand in the world without
   a hundred materials to draw them with: the leaf and the bark are drawn in
   grey, ONCE, and every species tints its own faces as they are laid down.
   A hundred greens, and not one extra draw call. */
/* ---- AND EACH OF THE FOUR CORNERS MAY CARRY ITS OWN ----
   `ao` is four multipliers, one to a vertex, in the order the corners are
   pushed. It is what the ambient occlusion of §2.1 is written with: a
   corner with solid ground standing over two of its three diagonals goes
   dark, and the shading between the four is interpolated across the face
   by the rasteriser for nothing. Passed nothing, every corner is 1 and the
   face is exactly the flat-shaded face it always was. */
function quad(G,mat, ax,ay,az, bx,by,bz, cx,cy,cz, dx,dy,dz, u0,v0,u1,v1, s, ao){
  const g=gm(G,mat), o=g.n;
  g.p.push(ax,ay,az, bx,by,bz, cx,cy,cz, dx,dy,dz);
  g.uv.push(u0,v0, u1,v0, u1,v1, u0,v1);
  if(typeof s==='number'){ if(ao) for(let k=0;k<4;k++){ const f=s*ao[k]; g.c.push(f,f,f); }
    else for(let k=0;k<4;k++) g.c.push(s,s,s); }
  else { if(ao) for(let k=0;k<4;k++){ const f=ao[k]; g.c.push(s[0]*f,s[1]*f,s[2]*f); }
    else for(let k=0;k<4;k++) g.c.push(s[0],s[1],s[2]); }
  g.i.push(o,o+1,o+2, o,o+2,o+3); g.n+=4;
}
/* the light on a face, multiplied into a tint — [r,g,b] in 0..1.
   (The scratch triple is REUSED, not freshly made: quad copies it into the
   buffer before anything else can be called, and the mesher lays down tens of
   thousands of faces a chunk — a new array apiece is a great deal of rubbish
   for the collector to sweep up for no reason at all.) */
const _sh=[0,0,0];
function shade(tint,s){ if(!tint) return s;
  _sh[0]=tint[0]*s; _sh[1]=tint[1]*s; _sh[2]=tint[2]*s; return _sh; }
/* Each takes an optional `ao` — four corner multipliers in the same order
   its own vertices are pushed. faceTop's run  (x0,z1) (x1,z1) (x1,z0) (x0,z0);
   the four side faces run bottom-left, bottom-right, top-right, top-left as
   each is wound. */
function faceTop(G,mat,x0,z0,x1,z1,y,s,rep,ao){ const r=rep||1;
  quad(G,mat, x0,y,z1, x1,y,z1, x1,y,z0, x0,y,z0, 0,0,(x1-x0)/B*r,(z1-z0)/B*r, s, ao); }
function faceBottom(G,mat,x0,z0,x1,z1,y,s,ao){ quad(G,mat, x0,y,z0, x1,y,z0, x1,y,z1, x0,y,z1, 0,0,(x1-x0)/B,(z1-z0)/B, s, ao); }
function facePX(G,mat,x,z0,z1,y0,y1,s,ao){ quad(G,mat, x,y0,z1, x,y0,z0, x,y1,z0, x,y1,z1, 0,0,(z1-z0)/B,(y1-y0)/B, s, ao); }
function faceNX(G,mat,x,z0,z1,y0,y1,s,ao){ quad(G,mat, x,y0,z0, x,y0,z1, x,y1,z1, x,y1,z0, 0,0,(z1-z0)/B,(y1-y0)/B, s, ao); }
function facePZ(G,mat,z,x0,x1,y0,y1,s,ao){ quad(G,mat, x0,y0,z, x1,y0,z, x1,y1,z, x0,y1,z, 0,0,(x1-x0)/B,(y1-y0)/B, s, ao); }
function faceNZ(G,mat,z,x0,x1,y0,y1,s,ao){ quad(G,mat, x1,y0,z, x0,y0,z, x0,y1,z, x1,y1,z, 0,0,(x1-x0)/B,(y1-y0)/B, s, ao); }
/* ---- WHAT IS BUILT IS SOLID ----
   While _solidRec is set, every box emitted is also WRITTEN DOWN — so a
   landmark's own builder declares its true collision, brick for brick, and
   nobody keeps a second, hand-guessed table of footprints that drifts from
   the building. (The pyramids, the ziggurats, the walls of the ancients
   were stage scenery: walker, flyer and camera all passed straight through
   the Great Pyramid, which is not what a pyramid is for.) */
let _solidRec=null;
function emitBox(G, x0,y0,z0, x1,y1,z1, sideMat, topMat, botMat, tint){
  /* ---- AND WHILE A STAMP IS OPEN, A BOX IS BLOCKS ----
     No triangles are laid at all: the chunk mesher draws what was written,
     and it is the same rock the pick meets. */
  if(_stampOn){ stampBox(x0,y0,z0,x1,y1,z1, sideMat||topMat); return; }
  if(_solidRec&&y1-y0>3&&Math.min(x1-x0,z1-z0)>2.5)
    _solidRec.push({x0,y0,z0,x1,y1,z1});
  faceTop(G,topMat,x0,z0,x1,z1,y1,shade(tint,1.0));
  if(botMat) faceBottom(G,botMat,x0,z0,x1,z1,y0,shade(tint,0.5));
  facePX(G,sideMat,x1,z0,z1,y0,y1,shade(tint,0.62)); faceNX(G,sideMat,x0,z0,z1,y0,y1,shade(tint,0.62));
  facePZ(G,sideMat,z1,x0,x1,y0,y1,shade(tint,0.8));  faceNZ(G,sideMat,z0,x0,x1,y0,y1,shade(tint,0.8));
}
function cross(G,mat,cx,cz,y,size,h,s){
  const r=size/2;
  quad(G,mat, cx-r,y,cz-r, cx+r,y,cz+r, cx+r,y+h,cz+r, cx-r,y+h,cz-r, 0,0,1,1, s);
  quad(G,mat, cx-r,y,cz+r, cx+r,y,cz-r, cx+r,y+h,cz-r, cx-r,y+h,cz+r, 0,0,1,1, s);
}
function topMatFor(kind){
  if(kind==='sand') return 'sand';
  if(kind==='snow') return 'snow';
  if(kind==='wall'||kind==='floe') return 'iceTop';   /* the rim keeps its own cold light */
  if(kind==='rock') return 'stone';
  if(kind==='alpine') return 'dirt';      /* the scree shoulders below the snow */
  if(kind==='desert') return 'sand';
  if(kind==='badlands') return 'badTop';
  if(kind==='tropic') return 'grassTopTr';
  if(kind==='tundra') return 'grassTopTu';
  if(kind==='savanna') return 'grassTopSv';
  return 'grassTop';
}
function sideMatsFor(kind){ /* [topBlockSide, lowerSide] */
  if(kind==='sand'||kind==='desert') return ['sand','sand'];
  if(kind==='badlands') return ['badSide','badSide'];
  if(kind==='snow') return ['snow','stone'];
  if(kind==='wall'||kind==='floe') return ['iceSide','iceSide'];
  if(kind==='rock') return ['stone','stone'];
  if(kind==='alpine') return ['dirt','stone'];
  if(kind==='savanna') return ['grassSideSv','dirt'];
  return ['grassSide','dirt'];
}
/* ================= THE LIGHT IN THE CORNERS =================
   Minecraft's lighting is flat per face: four values, one to a side, and no
   shading whatever where two faces meet. It is the single loudest tell in
   the whole look, and undoing it is the cheapest thing in this brief.

   A corner of a face is DARKENED by how much solid ground stands about it.
   For a top face the three things that can shadow a corner are the two
   columns edge-on to it and the one on its diagonal; where two of the three
   stand higher than this cell, the corner is in a true inside corner and
   goes darkest. The shading between the four corners is interpolated across
   the face by the rasteriser for nothing at all — so a step, a doorway, a
   gully, an undercut and the foot of every cliff in the world all read with
   real depth, and not one extra triangle is drawn for it.

   It is baked into the vertex colour ONCE, at mesh time, and costs nothing
   per frame. The four extra neighbour lookups a column are cache hits.
   (When the spans of §3.1 land, this same pass is where the floors, the
   ceilings and the cave mouths take their shading too — the neighbour data
   is already in hand here and will never be cheaper.) */
const AO_LV=[0.55,0.72,0.87,1.0];   /* two sides solid · two of three · one · open */
const AO_CREASE=0.70;               /* the crease where a flank meets the ground beside it */
function aoLevel(s1,s2,c){ return (s1&&s2)?AO_LV[0]:AO_LV[3-(s1+s2+c)]; }
/* how high the ground stands in a neighbouring column, in blocks; open water
   and the edge of the world stand at nothing */
function nH(ix,iz){ const c=cell(ix,iz); return c?c.h:0; }
const _aoT=[1,1,1,1], _aoS=[1,1,1,1];
function aoTop(ix,iz,h){
  /* the corners, in faceTop's own winding: (-x,+z) (+x,+z) (+x,-z) (-x,-z) */
  const e=(dx,dz)=>nH(ix+dx,iz+dz)>h?1:0;
  const px=e(1,0), nx=e(-1,0), pz=e(0,1), nz=e(0,-1);
  _aoT[0]=aoLevel(nx,pz,e(-1, 1));
  _aoT[1]=aoLevel(px,pz,e( 1, 1));
  _aoT[2]=aoLevel(px,nz,e( 1,-1));
  _aoT[3]=aoLevel(nx,nz,e(-1,-1));
  return _aoT;
}
/* ================= THE LIGHT THAT REACHES A HOLLOW =================
   A cave you can see in with no light source is not a cave. Every face cut
   inside the rock is baked dark, and how dark is how far it stands from the
   nearest place the daylight can get in — which is any column near enough
   whose SURFACE is lower than the face itself. A mouth is bright; a dozen
   blocks in is dim; the third chamber is black.

   Twenty-four cell reads, and they are paid ONLY by a column that has been
   hollowed out at all — which is a fraction of a fraction of the earth. It
   is baked once at mesh time and costs nothing per frame, exactly as the
   occlusion above it does. */
const CAVE_DARK=0.085;              /* what is left of the light where none reaches */
const _LR=[2,8,18], _LF=[0.92,0.46,0.15];
const _L8=[[1,0],[-1,0],[0,1],[0,-1],[1,1],[1,-1],[-1,1],[-1,-1]];
/* ---- AND IT IS HOW MUCH IS OPEN, NOT WHETHER ANYTHING IS ----
   Asked as "is there ANY direction in which the ground falls below this
   height", a passage running forty blocks under a mountain but hugging its
   flank came out as bright as its own mouth: one grazing line of sight to
   the daylight lit the whole of it. The day is SHARED OUT instead — each of
   the eight bearings at each of three distances contributes its own eighth,
   and the further off it is the less it brings. A mouth, open on half the
   compass at arm's length, is bright; a passage with one distant chink is
   very nearly black, which is the truth of it. */
function caveLightAt(ix,iz,y){
  let f=0;
  for(let k=0;k<3;k++){ const r=_LR[k]; let open=0;
    for(let q=0;q<8;q++) if(nH(ix+_L8[q][0]*r, iz+_L8[q][1]*r) <= y) open++;
    if(open){ f+=_LF[k]*(open/8); if(f>=1) return 1; } }
  return f;
}
/* ---- AND IT IS ASKED ONCE FOR THE WHOLE PASSAGE, NOT ONCE A FACE ----
   The floor, the roof and all four walls of one air run are the same room
   and take the same light. Asked per face it was six times twenty-four cell
   reads for every hollowed column in the chunk; asked once per run it is
   one, and the answer is the same. */
const _lit=[];
function litRuns(ix,iz,sp,out){
  out.length=0;
  for(let i=0;i<sp.length;i+=2){
    const f=caveLightAt(ix,iz,(sp[i]+sp[i+1])*0.5);
    out.push(CAVE_DARK+(1-CAVE_DARK)*f);
  }
  return out;
}
/* which air run of this column a height falls in, and how lit it is; 1 where
   the height is not in any run at all (open sky, and it keeps the day) */
function litAt(sp,lit,y){
  for(let i=0;i<sp.length;i+=2) if(y>=sp[i]-0.5&&y<=sp[i+1]+0.5) return lit[i>>1];
  return lit.length?lit[lit.length-1]:1;
}
/* the solid runs of a column, in BLOCKS, as a flat list [a0,b0,a1,b1,…] —
   the complement of its air runs between its foot and its surface */
function solidRuns(cc,foot,out){
  out.length=0;
  const sp=cc&&cc.spans;
  if(!sp){ if(cc&&cc.h>foot) out.push(foot,cc.h); return out; }
  let y=foot;
  for(let i=0;i<sp.length;i+=2){
    const lo=sp[i], hi=sp[i+1];
    if(lo>y) out.push(y,lo);
    if(hi>y) y=hi;
  }
  if(cc.h>y) out.push(y,cc.h);
  return out;
}
const _myR=[], _nbR=[];
/* ---- A COLUMN AS THE HAND HAS LEFT IT ----
   The procedural air runs with the broken blocks added to them and the
   placed blocks taken out. It hands back a cell-shaped thing the rest of the
   mesher already understands, so nothing below has to know that anybody has
   been digging. Only ever called for a column somebody has touched. */
const _ecc={h:0,kind:'',tree:0,ci:0,spans:null};
function editedCell(ix,iz,cc,em){
  let hi=cc.h-1, lo=0;
  for(const y of em.keys()){ if(y>hi) hi=y; if(y<lo) lo=y; }
  /* the surface may have moved: a man may break the ground he stands on, or
     pile blocks over his head, and the top of the column follows him */
  let top=cc.h;
  for(let y=hi;y>=cc.h;y--) if(blockSolidAt(ix,y,iz)){ top=y+1; break; }
  while(top>0&&!blockSolidAt(ix,top-1,iz)) top--;
  const air=[]; let run=-1;
  for(let y=Math.min(lo,0);y<top;y++){
    if(!blockSolidAt(ix,y,iz)){ if(run<0) run=y; }
    else if(run>=0){ air.push(run,y); run=-1; }
  }
  if(run>=0&&run<top) air.push(run,top);
  _ecc.h=Math.max(1,top); _ecc.kind=cc.kind; _ecc.tree=0; _ecc.ci=cc.ci;
  _ecc.spans=air.length?Int16Array.from(air):null;
  return _ecc;
}
/* and the blocks he SET DOWN are drawn one at a time, each in its own
   material — six faces, every one of them culled against what stands beside
   it. A man's edits are sparse; a cube apiece is the honest price for
   letting him build in whatever he likes. */
function emitPlaced(G,ix,iz,em,surfaceH){
  const x0=ix*B, x1=x0+B, z0=iz*B, z1=z0+B;
  for(const [y,n] of em){
    if(!n) continue;
    const b=blockOf(n); if(!b) continue;
    const ya=y*B, yb=ya+B;
    /* under the ground it takes the cave's darkness; above it, the day */
    const lit=(y<surfaceH-1)?(CAVE_DARK+(1-CAVE_DARK)*caveLightAt(ix,iz,y+0.5)):1;
    if(!blockSolidAt(ix,y+1,iz)) faceTop(G,b.mTop,x0,z0,x1,z1,yb,1.0*lit);
    if(!blockSolidAt(ix,y-1,iz)) faceBottom(G,b.mBottom,x0,z0,x1,z1,ya,0.5*lit);
    if(!blockSolidAt(ix+1,y,iz)) facePX(G,b.mSide,x1,z0,z1,ya,yb,0.62*lit);
    if(!blockSolidAt(ix-1,y,iz)) faceNX(G,b.mSide,x0,z0,z1,ya,yb,0.62*lit);
    if(!blockSolidAt(ix,y,iz+1)) facePZ(G,b.mSide,z1,x0,x1,ya,yb,0.8*lit);
    if(!blockSolidAt(ix,y,iz-1)) faceNZ(G,b.mSide,z0,x0,x1,ya,yb,0.8*lit);
  }
}
function emitColumn(G,ix,iz,cc){
  const x0=ix*B, x1=x0+B, z0=iz*B, z1=z0+B, yT=cc.h*B;
  faceTop(G,topMatFor(cc.kind),x0,z0,x1,z1,yT,1.0,1,aoTop(ix,iz,cc.h));
  const [sTop,sLow]=sideMatsFor(cc.kind);
  const nb=[[1,0],[-1,0],[0,1],[0,-1]];
  /* ---- THE HOLLOW OF THIS COLUMN, IF IT HAS ONE ----
     The floors and the ceilings first — the underside of every roof and the
     top of every floor the caves have cut through this column. */
  let myLit=null;
  if(cc.spans){
    const sp=cc.spans;
    myLit=litRuns(ix,iz,sp,_lit).slice();
    for(let i=0;i<sp.length;i+=2){
      const lo=sp[i], hi=sp[i+1], f=myLit[i>>1];
      faceTop(G,sLow,x0,z0,x1,z1,lo*B,1.0*f);           /* the floor of the passage */
      faceBottom(G,sLow,x0,z0,x1,z1,hi*B,0.5*f);        /* and the roof over it */
    }
  }
  for(let d=0;d<4;d++){
    const nc=cell(ix+nb[d][0],iz+nb[d][1]);
    const nh=nc?nc.h:0, base=Math.min(nh,cc.h)*B;
    const hollow=!!(cc.spans||(nc&&nc.spans));
    if(cc.h<=nh&&!hollow) continue;
    const split=(sTop!==sLow)&&(cc.h-1>nh);
    const yMid=split?(cc.h-1)*B:base;
    /* ---- AND THE FLANKS TAKE IT TOO ----
       A wall face is shadowed at its two upper corners by whatever stands
       beside and behind them — the inside corner of a step, of a gully, of
       a doorway — and along its whole foot by the ground it rises out of.
       The two are worked out once for the face and then carried down it,
       so a face split into an upper and a lower band keeps one unbroken
       gradient across the join instead of showing a seam. */
    const ex=nb[d][0], ez=nb[d][1];
    const perpX=ez, perpZ=ex;                 /* the two ways ALONG the face */
    /* What can shadow the end of a wall face is what stands FORWARD of it
       and beside — the column on the diagonal, out past the low ground this
       face looks over. The column beside us in our own row lies in the same
       plane as the face and shadows nothing; testing it would have laid a
       dark band down every joint of every straight cliff in the world. */
    const endF=dh=> dh>=cc.h ? AO_LV[1] : (dh>nh ? AO_LV[2] : AO_LV[3]);
    const aNear=endF(nH(ix+ex-perpX, iz+ez-perpZ));
    const aFar =endF(nH(ix+ex+perpX, iz+ez+perpZ));
    const put=(mat,ya,yb,sh)=>{ if(yb<=ya) return;
      /* the crease dies away over the first block and a half of the rise */
      const fall=y=>{ const t=Math.max(0,Math.min(1,(y-base)/(B*1.5))); return AO_CREASE+(1-AO_CREASE)*t; };
      const fa=fall(ya), fb=fall(yb);
      /* bottom-left, bottom-right, top-right, top-left, as each face winds */
      if(d===0){ _aoS[0]=aFar*fa; _aoS[1]=aNear*fa; _aoS[2]=aNear*fb; _aoS[3]=aFar*fb;
        facePX(G,mat,x1,z0,z1,ya,yb,sh,_aoS); }
      else if(d===1){ _aoS[0]=aNear*fa; _aoS[1]=aFar*fa; _aoS[2]=aFar*fb; _aoS[3]=aNear*fb;
        faceNX(G,mat,x0,z0,z1,ya,yb,sh,_aoS); }
      else if(d===2){ _aoS[0]=aNear*fa; _aoS[1]=aFar*fa; _aoS[2]=aFar*fb; _aoS[3]=aNear*fb;
        facePZ(G,mat,z1,x0,x1,ya,yb,sh,_aoS); }
      else { _aoS[0]=aFar*fa; _aoS[1]=aNear*fa; _aoS[2]=aNear*fb; _aoS[3]=aFar*fb;
        faceNZ(G,mat,z0,x0,x1,ya,yb,sh,_aoS); } };
    const sh=(d<2)?0.62:0.8;
    /* the sea beside: the flank keeps going below the waterline, all the
       way down to the bed — a stone standing in the glass, not upon it */
    if(!nc){ const jx=ix+nb[d][0], jz=iz+nb[d][1];
      const foot=Math.min(SUBSEA_Y, bedBlockAt((jx+0.5)*B,(jz+0.5)*B)-B);
      put((cc.kind==='wall'||cc.kind==='floe'||cc.kind==='snow')?'stone':'sand',foot,base,sh*0.72); }
    /* ---- THE COMMON CASE, AND IT IS VERY NEARLY EVERY CASE ----
       Neither this column nor the one beside it has been hollowed: the flank
       is one unbroken band from the neighbour's ground to our own, exactly as
       it has always been drawn, and nothing below costs it a thing. */
    if(!hollow){
      if(split){ put(sLow,base,yMid,sh); put(sTop,yMid,yT,sh); }
      else put(sTop,base,yT,sh);
      continue;
    }
    /* ---- AND WHERE SOMETHING HAS BEEN HOLLOWED ----
       The wall is whatever is solid HERE and not solid THERE. Both columns
       are taken as their solid runs and one is subtracted from the other,
       which is the ordinary work of a voxel mesher and the reason a cave has
       walls at all. Two things fall out of it for nothing: the far side of a
       passage is drawn (so a cave is a room and not a hole in a wall), and
       where the neighbour's ground has fallen away past the passage the wall
       is simply absent — and THAT is a cave mouth. Nothing places them. */
    /* both columns must be described from the SAME floor, and that floor has
       to reach under the deepest thing either of them has had cut out — read
       from the shallower of the two grounds, as the unhollowed case is, the
       whole passage would sit below the bottom of the reckoning and no cave
       would have a wall anywhere in the world. */
    let hfoot=Math.min(nh,cc.h);
    if(cc.spans&&cc.spans[0]<hfoot) hfoot=cc.spans[0];
    if(nc&&nc.spans&&nc.spans[0]<hfoot) hfoot=nc.spans[0];
    solidRuns(cc, hfoot, _myR);
    solidRuns(nc, hfoot, _nbR);
    for(let m=0;m<_myR.length;m+=2){
      let y=_myR[m];
      const my1=_myR[m+1];
      for(let k=0;k<=_nbR.length;k+=2){
        const na=(k<_nbR.length)?_nbR[k]:1e9, nbv=(k<_nbR.length)?_nbR[k+1]:1e9;
        if(nbv<=y) continue;
        const cut=Math.min(na,my1);
        if(cut>y){
          /* a face with the neighbour's own rock standing over it is INSIDE
             the earth and takes the cave's darkness; one with open sky over
             it is a cliff, and keeps the day */
          const enclosed=!!nc&&cut<=nc.h-0.001;
          const lit=!enclosed?1
            :(myLit?litAt(cc.spans,myLit,(y+cut)*0.5)
                   :(nc.spans?litAt(nc.spans,litRuns(ix+nb[d][0],iz+nb[d][1],nc.spans,_lit),(y+cut)*0.5)
                             :CAVE_DARK));
          put(my1>=cc.h&&cut>=cc.h-1?sTop:sLow, y*B, cut*B, sh*lit);
        }
        if(nbv>y) y=nbv;
        if(y>=my1) break;
      }
    }
  }
}
/* ---- THE TREES OF THE FIELD ----
   Every tree in the world stood exactly as tall as every other of its kind —
   a plantation of identical saplings, and small ones: a canopy barely twice
   the height of the man beneath it. They are grown now, and they VARY. Each
   takes its stature from its own place (so it is the same tree every time
   the chunk is rebuilt), from a sapling to a great old giant half again as
   tall as its fellows, and the crown is scaled with the trunk. */
/* ---- THE TOOLKIT THE FLORA IS BUILT WITH ----
   js/flora.js knows the SHAPES — how a conifer differs from a palm from a
   baobab — and world/flora.js knows what grows where. Neither of them knows
   anything about chunks, so the mesher lends them the few things they need
   and takes the geometry back. `G` is swapped in per chunk. */
const FKIT={ G:null, emitBox, cross, shade, hash:hash2,
  M:{leaf:'leafW', bark:'barkW', plant:'plantW', solid:'solidW'} };
let floraReady=false;
function initFlora(){ if(floraReady) return; floraReady=true;
  if(window.FLORA) FLORA.load((window.EARTH.floraList||[])[0]||null); }
/* which land this ground belongs to, by name — the key the flora and the
   fauna files are both written against */
function landNameAt(x,z){ const ci=countryAtUV(x/R_WORLD,z/R_WORLD);
  return (ci&&COUNTRIES[ci-1])?COUNTRIES[ci-1].n:null; }
let chunkLand=null;          /* whose country the chunk being built is in */
let chunkEdits=null;         /* and what hands have done in it, by column */
let chunkRiver=false;        /* and whether running water crosses it at all */
/* ---- IS THIS GROUND A RIVER BANK? ----
   A watercourse is stamped one or two map pixels wide — a hundred and
   seventeen units to the pixel — so it is wider than the chunk it runs
   through. The BANK is the strip of dry ground within a bowshot of the water,
   and it is where the reed, the papyrus, the willow and the alder belong.
   It is asked per CELL, but only in the few chunks that carry water at all:
   the whole-chunk test below is twenty-five array reads and answers `no` for
   nearly the whole earth. */
const RIVER_BANK=46;         /* how far from the water the bank reaches, in units */
function riverBankCell(x,z){
  if(riverAtUV(x/R_WORLD,z/R_WORLD)) return true;
  for(const r of [RIVER_BANK*0.5,RIVER_BANK]) for(let k=0;k<8;k++){
    const a2=k*0.785398;
    if(riverAtUV((x+Math.cos(a2)*r)/R_WORLD,(z+Math.sin(a2)*r)/R_WORLD)) return true; }
  return false;
}
function chunkHasRiver(cx,cz){
  for(let a2=0;a2<=4;a2++) for(let b2=0;b2<=4;b2++){
    const x=(cx*CH+a2*CH/4)*B, z=(cz*CH+b2*CH/4)*B;
    if(riverAtUV(x/R_WORLD,z/R_WORLD)) return true; }
  return false;
}
function emitTree(G,ix,iz,cc){
  initFlora();
  if(window.FLORA){
    const wet=chunkRiver&&riverBankCell((ix+0.5)*B,(iz+0.5)*B);
    const K=FLORA.treeAt(chunkLand,cc.kind,cc.h,ix,iz,hash2,wet);
    if(K){ FKIT.G=G; FLORA.emitTree(FKIT,K,ix,iz,cc); FKIT.G=null; return; }
  }
  /* ---- AND IF THE FLORA HAS NOTHING FOR THIS GROUND ----
     the four trees the world had before it did. Nothing should reach here
     now, but a world that cannot draw a tree is worse than a dull one. */
  const x=(ix+.5)*B, z=(iz+.5)*B, yT=cc.h*B;
  const tropic=cc.tree===2, cherry=cc.tree===3, thorn=cc.tree===4;
  /* a long tail toward the giants: most are middling, a few tower */
  const q=hash2(ix*0.73+11.3,iz*0.91-5.7);
  const S=0.62+Math.pow(q,0.55)*1.25 + (hash2(ix*3.1,iz*2.3)>0.965?0.85:0);
  const baseH=tropic?B*4.6:cherry?B*3.4:thorn?B*4.0:B*3.6;
  const trunkH=baseH*S, tw=B*(0.30+0.20*S);
  emitBox(G, x-tw,yT,z-tw, x+tw,yT+trunkH,z+tw, 'logSide','logTop',null);
  const lm=tropic?'leavesTr':cherry?'cherry':thorn?'acacia':'leaves';
  const W=S;                                  /* the crown grows with the bole */
  if(thorn){
    /* THE THORN TREE — the acacia, and the whole silhouette of the plain. The
       bole runs up bare and then throws its branches out FLAT at the top into
       a table of leaf a giraffe can just reach the underside of. Nothing else
       in the world is that shape, and where it stands you know the country. */
    for(const d of [[1,0],[-1,0],[0,1],[0,-1]])
      emitBox(G, x+d[0]*B*0.4*W-B*0.16*W, yT+trunkH-B*0.5*W, z+d[1]*B*0.4*W-B*0.16*W,
                 x+d[0]*B*1.1*W+B*0.16*W, yT+trunkH+B*0.1*W, z+d[1]*B*1.1*W+B*0.16*W,
                 'logSide','logSide',null);
    emitBox(G, x-B*1.9*W,yT+trunkH,z-B*1.9*W, x+B*1.9*W,yT+trunkH+B*0.45*W,z+B*1.9*W, lm,lm,lm);
    emitBox(G, x-B*1.2*W,yT+trunkH+B*0.45*W,z-B*1.2*W, x+B*1.2*W,yT+trunkH+B*0.75*W,z+B*1.2*W, lm,lm,lm);
  }
  else if(tropic){                            /* a palm — fronds thrown out from the head */
    emitBox(G, x-B*1.7*W,yT+trunkH,z-B*0.5*W, x+B*1.7*W,yT+trunkH+B*0.6*W,z+B*0.5*W, lm,lm,lm);
    emitBox(G, x-B*0.5*W,yT+trunkH,z-B*1.7*W, x+B*0.5*W,yT+trunkH+B*0.6*W,z+B*1.7*W, lm,lm,lm);
  } else if(cherry){                          /* a broad, soft pink canopy */
    emitBox(G, x-B*1.9*W,yT+trunkH-B*0.5*W,z-B*1.9*W, x+B*1.9*W,yT+trunkH+B*0.5*W,z+B*1.9*W, lm,lm,lm);
    emitBox(G, x-B*1.15*W,yT+trunkH+B*0.5*W,z-B*1.15*W, x+B*1.15*W,yT+trunkH+B*1.15*W,z+B*1.15*W, lm,lm,lm);
  } else {                                    /* an oak — three tiers, wide at the shoulder */
    emitBox(G, x-B*1.05*W,yT+trunkH-B*1.5*W,z-B*1.05*W, x+B*1.05*W,yT+trunkH-B*0.8*W,z+B*1.05*W, lm,lm,lm);
    emitBox(G, x-B*1.55*W,yT+trunkH-B*0.9*W,z-B*1.55*W, x+B*1.55*W,yT+trunkH+B*0.35*W,z+B*1.55*W, lm,lm,lm);
    emitBox(G, x-B*0.8*W,yT+trunkH+B*0.35*W,z-B*0.8*W, x+B*0.8*W,yT+trunkH+B*1.25*W,z+B*0.8*W, lm,lm,lm);
  }
}
/* is a settled place near — a village site, whose ground is grazed and cut? */
function nearSettled(x,z){
  const near=siteGrid.get(siteKey(x/R_WORLD,z/R_WORLD));
  if(near) for(const st of near) if(Math.hypot(x-st.x,z-st.z)<380) return true;
  return false;
}
/* ---- AND THE UNDERGROWTH ----
   Bare ground between the trees read as a lawn. Away from the settled places
   the wild grows in: bushes, fern and thicket. The nearer a village, the more
   it is grazed and cut back — so the wilderness is visibly wilder.
   WHAT STANDS HERE IS NOT DECIDED HERE. It is asked of js/grass.js, which is
   the one truth about the grass of the earth: the same call the beasts make
   when they go looking for a bite and the lion when he looks for cover. What
   is drawn and what is eaten are the same blade, because both came out of
   GRASS.at(). (Before this the mesher decided alone, nothing else in the
   world knew where a blade stood, and the herds grazed bare dirt.) */
function emitScrub(G,ix,iz,cc,wild){
  /* ---- THE HERB AND THE BUSH COME FIRST ----
     Before the sward, what this COUNTRY grows low: the vine and the lavender
     of the south, the bilberry under the northern spruce, the coffee bush,
     the reed, the agave, the ear of corn. It is a sparser draw than the
     grass and takes its own number, so the two layers never fight over a
     cell — where a bush stands, no blade is drawn under it. */
  initFlora();
  if(window.FLORA){
    const wet=chunkRiver&&riverBankCell((ix+0.5)*B,(iz+0.5)*B);
    const P=FLORA.plantAt(chunkLand,cc.kind,cc.h,ix,iz,hash2,wild,wet);
    if(P){ FKIT.G=G; FLORA.emitPlant(FKIT,P,ix,iz,cc); FKIT.G=null; return; }
    /* ---- AND THE YOUNG GROWTH ----
       A wood with no young trees in it is a plantation, not a wood. A few
       cells in every hundred carry a SAPLING of one of the same kinds that
       stand grown over them — knee-high, the right species for the country,
       and the same one every time you pass. */
    const S=FLORA.saplingAt(chunkLand,cc.kind,cc.h,ix,iz,hash2,wild,wet);
    if(S){ FKIT.G=G; FLORA.emitSapling(FKIT,S,ix,iz,cc); FKIT.G=null; return; }
  }
  const gr=GRASS.at(ix,iz,cc.kind,wild); if(!gr) return;
  const x=(ix+.5)*B, z=(iz+.5)*B, yT=cc.h*B;
  if(gr.m==='bush'){                                   /* a true bush, with a woody heart */
    const lm=cc.kind==='tropic'?'leavesTr':cc.kind==='savanna'?'acacia':'leaves';
    const r=gr.w/2;
    emitBox(G, x-r,yT,z-r, x+r,yT+gr.h,z+r, lm,lm,null);
    if(gr.cap) emitBox(G, x-r*0.55,yT+gr.h,z-r*0.55, x+r*0.55,yT+gr.h+B*0.4,z+r*0.55, lm,lm,lm);
    return;
  }
  cross(G,gr.m,x,z,yT,gr.w,gr.h,0.95);
}
/* how near a coast the chunk mesher lays a blocky shelf of its own. The sea
   bed that follows the diver reads the SAME number and stands aside there, so
   the two never fight for the same ground. */
const SHELF_SHOAL=0.10;
/* ...and HOW DEEP it lays them. The shelf was footed at SUBSEA_Y and would
   lay no block below it, which was right while the near-coast bed sat a
   couple of metres under the waterline. The shelf truly falls to two hundred
   metres at its break now, so a footing there left the mesher drawing nothing
   past the first few paces of sand, and the clear water off every coast had
   no floor under it when seen from the deck. Each cell is a block standing ON
   the bed, however deep it lies — but only while the bottom can still be
   SEEN: past this the water is its own colour, and the bed that follows the
   diver has the ground from there out.
   IT IS TIED TO THE WATER'S OWN CLARITY, and must stay tied. The skin of the
   sea goes shut at some sixty metres (`clear`, in the water shader); laid
   shallower than that and there is bare water where a floor should show from
   the deck, laid deeper and it is triangles no eye will ever meet — at a
   hundred and fifty metres it cost half again as many and changed nothing.
   (360 units — sixty metres, at the six units to the metre everything that
   swims is built by.) */
const SHELF_DEEP=360;
/* ================= AND THE LAND GOES DOWN TO THE BED =================
   Every flank of every land ended at SUBSEA_Y — thirteen units under the
   waterline — because that is where the bed used to lie at every coast. The
   bed now falls two hundred metres to the shelf break and kilometres past it,
   so every island and every continent in the world was left hanging as a SLAB
   with open water under it and the sea floor a long way below, unattached:
   swim down off any strand and you could look up at the underside of Cyprus.
   A block beside the water goes down to WHAT IS BESIDE IT now — the bed of
   the sea at that place, snapped to the same block grid the diver's floor
   uses — so the land is one solid mass of blocks running from the strand
   down the shelf and the slope into the deep, with no daylight anywhere
   under it. */
function bedBlockAt(x,z){ return Math.round(seabedDepth(x,z)/B)*B; }
/* the LOWEST thing standing beside this cell: the bed at each of its four
   neighbours, or the land's own foot where a neighbour is dry ground. What
   stands here drops to that, and there is never a gap at the join. */
function seaFootAt(ix,iz,own){
  let low=own===undefined?SUBSEA_Y:own;
  for(const d of [[1,0],[-1,0],[0,1],[0,-1]]){
    const jx=ix+d[0], jz=iz+d[1];
    const y=cell(jx,jz)?SUBSEA_Y:bedBlockAt((jx+0.5)*B,(jz+0.5)*B);
    if(y<low) low=y; }
  return low-B;              /* a block of overlap, so nothing can crack open */
}
/* the ONE test both floors read, so neither ever lays ground the other has */
function chunkShelfHere(x,z,bedY){
  return shoalAt(x,z)>SHELF_SHOAL && bedY>WATER_Y-SHELF_DEEP;
}
/* ================= THE WORLD MADE MUTABLE =================
   `cellRaw` is a pure function of place: it recomputes the same answer every
   time, so anything the traveller changed was erased the moment the chunk
   was rebuilt. The EDIT OVERLAY is the sparse, persistent record of every
   block he has broken or set down, applied on top of the procedural answer
   at mesh time and read by every collision test in the game:

       procedural spans  →  apply the edits  →  mesh

   `setBlock` is the ONE way terrain is changed. Nothing else in the engine
   may write it — every future hand, tool, work and authored place goes
   through this door, so there is exactly one place where dirtying a chunk,
   marking its neighbour and writing to the record can be got wrong.

   THE INDEX PUTS Y FASTEST ON PURPOSE. A man's edits are towers, walls,
   shafts and staircases — runs UP. Laid out with y fastest, a wall of forty
   blocks is one run of forty in the record instead of forty separate
   entries, and the run-length coding below gets it for nothing. */
const EY_MIN=-64, EY_MAX=1024, EY_SPAN=EY_MAX-EY_MIN;
const EDIT_VER=1;
const EDITS=new Map();          /* chunkKey -> Map<index, block number>  (0 = broken) */
const EDIT_DIRTY=new Set();     /* the chunks awaiting a remesh */
let EDIT_TOUCHED=false;         /* is there anything not yet written down? */
function eIndex(lx,ly,lz){ return (lx*CH+lz)*EY_SPAN + (ly-EY_MIN); }
function eLx(i){ return Math.floor(i/EY_SPAN/CH); }
function eLz(i){ return Math.floor(i/EY_SPAN)%CH; }
function eLy(i){ return (i%EY_SPAN)+EY_MIN; }
function chunkKeyOf(ix,iz){ return Math.floor(ix/CH)+','+Math.floor(iz/CH); }
/* ---- TWO LAYERS, AND THE HAND ALWAYS WINS ----
   A village, a temple, a pyramid is DERIVED: it can be worked out again from
   its site any time it is wanted, so writing every house on the earth to disk
   would be writing down something nobody said. Those go in the STRUCTURE
   layer — stamped when the place is raised, dropped when it is left behind,
   never saved.
   What the traveller himself did is the other thing entirely. It is not
   derivable from anything, it is the only record of him, and it is
   authoritative: a plank he took out of a wall stays out of that wall even
   though the village re-stamps itself from scratch every time he sails back.
   So: player first, structure second, the world underneath. */
const SEDITS=new Map();         /* the structures: derived, dropped, never written down */
function editAt(ix,iy,iz){
  if(!EDITS.size&&!SEDITS.size) return undefined;
  const key=chunkKeyOf(ix,iz), idx=eIndex(((ix%CH)+CH)%CH, iy, ((iz%CH)+CH)%CH);
  if(EDITS.size){ const m=EDITS.get(key); if(m){ const v=m.get(idx); if(v!==undefined) return v; } }
  if(SEDITS.size){ const m=SEDITS.get(key); if(m){ const v=m.get(idx); if(v!==undefined) return v; } }
  return undefined;
}
/* what the world would be here with nobody's hand in it */
function proceduralSolid(ix,iy,iz){
  const c=cell(ix,iz); if(!c) return false;
  if(iy>=c.h||iy<0) return false;
  const sp=c.spans; if(!sp) return true;
  for(let i=0;i<sp.length;i+=2) if(iy>=sp[i]&&iy<sp[i+1]) return false;
  return true;
}
function proceduralBlock(ix,iy,iz){
  if(!proceduralSolid(ix,iy,iz)) return 0;
  const c=cell(ix,iz);
  return (iy>=c.h-1)?surfaceBlockOf(c.kind):depthBlockOf(c.kind);
}
/* and what it IS, hand and all — the one truth every test in the game reads */
function blockAt(ix,iy,iz){
  const e=editAt(ix,iy,iz);
  return e!==undefined ? e : proceduralBlock(ix,iy,iz);
}
function blockSolidAt(ix,iy,iz){
  const e=editAt(ix,iy,iz);
  return e!==undefined ? e!==0 : proceduralSolid(ix,iy,iz);
}
/* ---- THE ONE DOOR ----
   World coordinates in, because everything that will ever call it — the
   hand, a falling block, a stamped house — thinks in the world and not in
   indices. Answers true if anything actually changed. */
function setBlock(wx,wy,wz,n){
  const ix=Math.floor(wx/B), iy=Math.floor(wy/B), iz=Math.floor(wz/B);
  if(iy<EY_MIN||iy>=EY_MAX) return false;
  const key=chunkKeyOf(ix,iz);
  const lx=((ix%CH)+CH)%CH, lz=((iz%CH)+CH)%CH;
  const idx=eIndex(lx,iy,lz);
  let m=EDITS.get(key);
  if(blockAt(ix,iy,iz)===n) return false;           /* it is already that */
  /* an edit that merely restores what would have stood here anyway — the
     world's own rock, or the structure's own stone — is not kept. It is a
     hole in the record, not a fact. But it must be judged against what would
     stand here WITHOUT the hand, which is the structure layer and the ground
     under it, and never against the hand's own earlier work. */
  let under=proceduralBlock(ix,iy,iz);
  { const sm=SEDITS.get(key); if(sm){ const v=sm.get(idx); if(v!==undefined) under=v; } }
  if(under===n){ if(m){ m.delete(idx); if(!m.size) EDITS.delete(key); } }
  else { if(!m){ m=new Map(); EDITS.set(key,m); } m.set(idx,n); }
  EDIT_TOUCHED=true; EDIT_DIRTY.add(key); EDIT_SAVE.add(key); editsTouch();
  /* a block on a chunk's edge changes what its neighbour must draw */
  if(lx===0) EDIT_DIRTY.add((Math.floor(ix/CH)-1)+','+Math.floor(iz/CH));
  if(lx===CH-1) EDIT_DIRTY.add((Math.floor(ix/CH)+1)+','+Math.floor(iz/CH));
  if(lz===0) EDIT_DIRTY.add(Math.floor(ix/CH)+','+(Math.floor(iz/CH)-1));
  if(lz===CH-1) EDIT_DIRTY.add(Math.floor(ix/CH)+','+(Math.floor(iz/CH)+1));
  return true;
}
/* ================= WHAT IS BUILT IS BLOCKS =================
   Every village house, city wall, temple, pyramid, ziggurat, well, farm,
   pier, fence and stall was built by `emitBox` into merged decoration
   geometry. None of it existed in the block world at all: you could not mine
   a temple wall, break into a house, or take a plank from a pier — and the
   moment a man CAN mine, every house on the earth visibly floats on nothing.

   A builder is converted by being RUN IN STAMP MODE, not by being rewritten.
   While `_stampOn` is set, `emitBox` writes blocks instead of triangles and
   the chunk mesher draws them like any other ground. That is deliberate: a
   rewrite is a chance to change the building by accident, and running the
   same code means the diff harness in tools/ is comparing the SAME builder
   against itself.

   THE RULE FOR A THIN THING. House walls are half a block thick and roof
   steps are a little over half a block high. A "centre of the cell inside
   the box" rule loses every one of them — a half-block wall on a block
   boundary has no cell centre in it at all, and the house comes out with no
   walls. So a cell is filled when the box genuinely PASSES THROUGH it: an
   overlap of more than a sixth of a block on every axis. A thin wall becomes
   one block thick, an aligned box fills exactly its own cells, and a box
   merely touching a face fills nothing. */
const MAT_BLOCK=Object.create(null);
for(const b of BLOCKS){ if(!b) continue;
  for(const k of ['top','side','bottom','all']){ const t=b.tex[k];
    if(t&&MAT_BLOCK[t]===undefined) MAT_BLOCK[t]=b.n; } }
/* the mesher's own greys and a few names no block claims */
MAT_BLOCK.iceTop=MAT_BLOCK.iceTop||blockId('ice');
MAT_BLOCK.iceSide=MAT_BLOCK.iceSide||blockId('ice');
MAT_BLOCK.solidW=MAT_BLOCK.solidW||blockId('stone');
MAT_BLOCK.barkW=MAT_BLOCK.barkW||blockId('log');
function blockForMat(m){ const n=MAT_BLOCK[m]; return n===undefined?blockId('stone'):n; }

let _stampOn=null;              /* the group being stamped, or null */
const STAMP_EPS=1/6;            /* how much of a cell a box must cross to fill it */
function stampBegin(){ _stampOn={cells:[]}; return _stampOn; }
function stampEnd(){ const g=_stampOn; _stampOn=null; return g; }
function stampBlock(ix,iy,iz,n){
  if(iy<EY_MIN||iy>=EY_MAX) return;
  const key=chunkKeyOf(ix,iz);
  const idx=eIndex(((ix%CH)+CH)%CH, iy, ((iz%CH)+CH)%CH);
  let m=SEDITS.get(key); if(!m){ m=new Map(); SEDITS.set(key,m); }
  if(!m.has(idx)&&_stampOn) _stampOn.cells.push(key,idx);
  m.set(idx,n);
  EDIT_DIRTY.add(key);
}
function stampBox(x0,y0,z0,x1,y1,z1,mat){
  const n=blockForMat(mat); if(!n) return;
  const e=STAMP_EPS*B;
  const ix0=Math.floor((x0+e)/B), ix1=Math.ceil((x1-e)/B)-1;
  const iy0=Math.floor((y0+e)/B), iy1=Math.ceil((y1-e)/B)-1;
  const iz0=Math.floor((z0+e)/B), iz1=Math.ceil((z1-e)/B)-1;
  for(let ix=ix0;ix<=ix1;ix++) for(let iz=iz0;iz<=iz1;iz++) for(let iy=iy0;iy<=iy1;iy++)
    stampBlock(ix,iy,iz,n);
}
/* and a builder may name a single block outright where a face used to be a
   face — a floor laid, a pane set, water standing in a well */
function stampAt(x,y,z,id){ stampBlock(Math.floor(x/B),Math.floor(y/B),Math.floor(z/B),blockId(id)); }
/* everything a stamp group wrote, taken out again — a village left behind */
function stampDrop(g){
  if(!g) return;
  for(let i=0;i<g.cells.length;i+=2){
    const key=g.cells[i], idx=g.cells[i+1];
    const m=SEDITS.get(key); if(m){ m.delete(idx); if(!m.size) SEDITS.delete(key); }
    EDIT_DIRTY.add(key);
  }
  g.cells.length=0;
}

/* the edits of one column, gathered for the mesher: a small map of
   y -> block number, or null, which is the answer nearly everywhere */
function editColumn(ix,iz){
  if(!EDITS.size&&!SEDITS.size) return null;
  const key=chunkKeyOf(ix,iz);
  const lx=((ix%CH)+CH)%CH, lz=((iz%CH)+CH)%CH;
  const base=(lx*CH+lz)*EY_SPAN;
  let out=null;
  /* structure first, then the hand OVER it — the later write wins, and the
     hand is written later on purpose */
  for(const src of [SEDITS,EDITS]){
    const m=src.get(key); if(!m) continue;
    for(const [i,n] of m){ if(i<base||i>=base+EY_SPAN) continue;
      (out||(out=new Map())).set((i%EY_SPAN)+EY_MIN,n); }
  }
  return out;
}
/* ================= AND IT IS WRITTEN DOWN =================
   localStorage is capped near five megabytes and is SYNCHRONOUS: an hour of
   digging would both overflow it and stall the frame in the act of doing so.
   The block edits go to IndexedDB, one record to an edited chunk, run-length
   coded; the small state — where the ship lies, the log, the scrolls — stays
   in localStorage, which is what it is good for.

   THE RECORD CARRIES ITS OWN BLOCK TABLE. A block's number is an accident of
   the order blocks/ is read in; its `id` is for ever. So every save writes
   the list of ids in number order beside the edits, and a load maps the old
   numbers through it. Insert a block into the manifest next year and an old
   world still opens with its walls the right stone.

   The format is versioned from the first line, and a record of a version
   this build does not know is LEFT ALONE rather than guessed at. */
const EDB={db:null,ready:null,fail:false};
const EDB_NAME='the-voyage', EDB_ST='edits', EDB_MT='meta';
const EDIT_SAVE=new Set();       /* chunks changed since the last writing-down */
function edbOpen(){
  if(EDB.ready) return EDB.ready;
  EDB.ready=new Promise(res=>{
    let rq; try{ rq=indexedDB.open(EDB_NAME,1); }catch(e){ EDB.fail=true; res(null); return; }
    rq.onupgradeneeded=()=>{ const db=rq.result;
      if(!db.objectStoreNames.contains(EDB_ST)) db.createObjectStore(EDB_ST,{keyPath:'k'});
      if(!db.objectStoreNames.contains(EDB_MT)) db.createObjectStore(EDB_MT,{keyPath:'k'}); };
    rq.onsuccess=()=>{ EDB.db=rq.result; res(rq.result); };
    rq.onerror=()=>{ EDB.fail=true; res(null); };
    rq.onblocked=()=>{ EDB.fail=true; res(null); };
  });
  return EDB.ready;
}
/* runs of the same block at neighbouring indices become one entry — and
   because the index runs Y FASTEST, a wall is one entry and not forty */
function rleEncode(m){
  const ks=Array.from(m.keys()).sort((a,b)=>a-b), out=[];
  let i=0;
  while(i<ks.length){
    const s=ks[i], n=m.get(s); let len=1;
    while(i+len<ks.length&&ks[i+len]===s+len&&m.get(ks[i+len])===n) len++;
    out.push(s,len,n); i+=len;
  }
  return Int32Array.from(out);
}
function rleDecode(arr,remap){
  const m=new Map();
  for(let i=0;i<arr.length;i+=3){ const s=arr[i],len=arr[i+1];
    let n=arr[i+2]; if(remap) n=(n===0?0:(remap[n]||0));
    for(let k=0;k<len;k++) m.set(s+k,n); }
  return m;
}
/* ---- THE SAVES STAND IN A LINE, AND WAITING ON ONE WAITS ON ALL ----
   Two writers over the same records is a race, and the loser of a race like
   this is somebody's afternoon of digging. So: the pending timer is cancelled
   (whoever calls IS the save), and — the part that actually bit — a call made
   while another save is still open does not return "done" over the top of it.
   It CHAINS. That is what `await editsSave()` has to mean before a reload or
   a page teardown, or the browser closes the door on a transaction that was
   still writing and the record it was writing is simply not there.
   (Seen as: reload, and one chunk of two comes back. A race loses rarely,
   which is the worst rate there is.) */
let _inFlight=null;
function editsSave(){
  if(EDB.fail) return Promise.resolve(false);
  if(_saveT){ clearTimeout(_saveT); _saveT=null; }
  const prev=_inFlight;
  const p=(async()=>{
    if(prev){ try{ await prev; }catch(e){} }
    return editsWrite();
  })();
  _inFlight=p;
  p.then(()=>{ if(_inFlight===p) _inFlight=null; },
         ()=>{ if(_inFlight===p) _inFlight=null; });
  return p;
}
async function editsWrite(){
  const db=await edbOpen(); if(!db) return false;
  const keys=Array.from(EDIT_SAVE); EDIT_SAVE.clear();
  if(!keys.length) return true;
  try{
    const tx=db.transaction([EDB_ST,EDB_MT],'readwrite');
    const st=tx.objectStore(EDB_ST);
    for(const k of keys){ const m=EDITS.get(k);
      if(!m||!m.size) st.delete(k);
      else st.put({k, v:EDIT_VER, d:rleEncode(m)}); }
    tx.objectStore(EDB_MT).put({k:'blocks', v:EDIT_VER, ids:BLOCKS.map(b=>b?b.id:null)});
    await new Promise((res,rej)=>{ tx.oncomplete=res; tx.onerror=()=>rej(tx.error); });
    return true;
  }catch(e){
    /* it did not land: put the keys back AND ask again in a moment, or they
       would sit unwritten until the next blow of the pick */
    for(const k of keys) EDIT_SAVE.add(k); editsTouch(); return false; }
}
async function editsLoad(){
  const db=await edbOpen(); if(!db) return 0;
  try{
    const tx=db.transaction([EDB_ST,EDB_MT],'readonly');
    const meta=await new Promise(res=>{ const r=tx.objectStore(EDB_MT).get('blocks');
      r.onsuccess=()=>res(r.result); r.onerror=()=>res(null); });
    /* old number -> new number, by the id each stood for when it was saved */
    let remap=null;
    if(meta&&meta.ids){ remap=[];
      for(let i=1;i<meta.ids.length;i++){ const b=BLOCK_BY_ID[meta.ids[i]];
        remap[i]=b?b.n:0; } }
    const all=await new Promise(res=>{ const r=tx.objectStore(EDB_ST).getAll();
      r.onsuccess=()=>res(r.result||[]); r.onerror=()=>res([]); });
    let n=0;
    for(const rec of all){
      if(rec.v!==EDIT_VER) continue;          /* a version we do not know: left alone */
      const m=rleDecode(rec.d,remap);
      if(m.size){ EDITS.set(rec.k,m); n+=m.size; }
    }
    return n;
  }catch(e){ return 0; }
}
/* written down a breath after the last blow, not on every one of them */
let _saveT=null;
function editsTouch(){ if(_saveT) clearTimeout(_saveT);
  _saveT=setTimeout(()=>{ _saveT=null; editsSave(); },900); }
addEventListener('pagehide',()=>{ if(EDIT_SAVE.size) editsSave(); });
addEventListener('visibilitychange',()=>{ if(document.hidden&&EDIT_SAVE.size) editsSave(); });

const chunks=new Map(); const buildQueue=[]; const buildQueued=new Set();
/* all the streamed land under one root, so it can be taken out of the view
   in a single stroke when the charted face of the earth stands in for it */
const chunkRoot=new THREE.Group(); scene.add(chunkRoot);
/* ---- WHAT A CHUNK COSTS TO BUILD ----
   Kept as a running total so the audit can state the mesher's price in
   milliseconds rather than in adjectives. One clock read a chunk. */
const BUILD_STATS={n:0,ms:0};
function buildChunkTimed(cx,cz){ const t0=performance.now();
  buildChunk(cx,cz); BUILD_STATS.ms+=performance.now()-t0; BUILD_STATS.n++; }
function buildChunk(cx,cz){
  const G=newG();
  /* ---- WHOSE COUNTRY THIS CHUNK IS IN ----
     Every tree and every bush asks what land it grows in, and the answer is
     the same for the whole chunk within a pixel or two of the chart. Asked
     per CELL it was two hundred and fifty-six lookups and as many string
     keys built for the flora's cache, for one answer; asked once here it is
     one. (A chunk that straddles a border takes its middle's country — a
     chunk is ninety-six metres across and no wood changes at a line.) */
  chunkLand=landNameAt((cx*CH+CH/2)*B,(cz*CH+CH/2)*B);
  chunkRiver=chunkHasRiver(cx,cz);
  /* the whole chunk's edits, indexed by column, ONCE — asked per column it
     would be two hash lookups apiece for the answer `nothing`, two hundred
     and fifty-six times a chunk, over a world where nobody has dug */
  chunkEdits=null;
  { const key=cx+','+cz;
    /* BOTH LAYERS, and the hand laid over the structure — indexing only the
       player's edits left every stamped well, wall and temple SOLID TO THE
       TOUCH AND INVISIBLE, which is the worst of both worlds. */
    for(const src of [SEDITS,EDITS]){
      const m=src.get(key); if(!m||!m.size) continue;
      if(!chunkEdits) chunkEdits=new Map();
      for(const [i,n] of m){ const k=eLx(i)*CH+eLz(i);
        let c=chunkEdits.get(k); if(!c){ c=new Map(); chunkEdits.set(k,c); }
        c.set(eLy(i),n); }
    } }
  for(let a=0;a<CH;a++) for(let b=0;b<CH;b++){
    const ix=cx*CH+a, iz=cz*CH+b, cc=cell(ix,iz);
    if(!cc){ /* the shelf: solid sandy terraces stepping down from the land,
                each rooted in the bed of the sea — never a floating sheet */
      const x0=ix*B, z0=iz*B;
      const step=(top,mat)=>emitBox(G, x0+0.08,seaFootAt(ix,iz,Math.min(SUBSEA_Y,top)),z0+0.08,
                                      x0+B-0.08,top,z0+B-0.08,mat||'sand',mat||'sand',null);
      const nb=cell(ix+1,iz)||cell(ix-1,iz)||cell(ix,iz+1)||cell(ix,iz-1);
      if(nb&&nb.kind!=='wall'&&nb.kind!=='floe'){
        step(WATER_Y-1.5);                       /* the landing at the water's edge */
        /* breaking surf where the swell meets the strand */
        if(nb.kind==='sand'||nb.kind==='tropic'||nb.kind==='grass'||nb.kind==='desert')
          faceTop(G,'surf',x0,z0,x0+B,z0+B,WATER_Y+0.55,1.0);
      } else {
        /* ---- AND THE SHELF IS BLOCKS TOO ----
           Past the landing the shore used to fall away in exactly two more
           terraces, at four units and at nine, whatever the ground beneath
           actually did — a pair of shelves ringing every coast in the world
           at the same two depths. It steps down in real blocks now, each
           taking the TRUE bed of the sea at that place snapped to the block
           grid, so the shallows carry the same floor the diver swims over and
           the two are one continuous thing. */
        const bedTop=Math.round(seabedDepth(x0+B/2,z0+B/2)/B)*B;
        if(chunkShelfHere(x0+B/2,z0+B/2,bedTop)){
          const top=Math.min(WATER_Y-1.5,bedTop), deep=WATER_Y-top;
          /* and it is FOOTED on what lies beneath it, not on one fixed line:
             where the bed steps down the shelf steps with it, and the riser
             is deep enough that no daylight shows under the tread */
          const mat=deep>26?'stone':'sand';
          emitBox(G, x0+0.08,seaFootAt(ix,iz,bedTop),z0+0.08,
                     x0+B-0.08,top,z0+B-0.08, mat,mat,null);
        }
      }
      continue;
    }
    /* ---- AND WHAT THE HAND HAS DONE HERE ----
       An untouched column is meshed exactly as it always was. A touched one
       is meshed from what it has BECOME, and the blocks set down in it are
       drawn after, each in its own material. */
    const em=chunkEdits&&chunkEdits.get(a*CH+b);
    if(em){
      const ec=editedCell(ix,iz,cc,em);
      emitColumn(G,ix,iz,ec);
      emitPlaced(G,ix,iz,em,ec.h);
      continue;
    }
    emitColumn(G,ix,iz,cc);
    const x=(ix+.5)*B, z=(iz+.5)*B, yT=cc.h*B, j=hash2(ix*1.7,iz*2.9);
    if(cc.tree) emitTree(G,ix,iz,cc);
    else {
      /* thickest where no one lives — a village keeps its ground grazed.
         Every ground the grass file knows is asked; the ones it does not
         know (sand, stone, snow, the ice) simply bear nothing. */
      emitScrub(G,ix,iz,cc,nearSettled(x,z)?0.34:1);
    }
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
    chunkRoot.add(m); meshes.push(m); }
  chunks.set(cx+','+cz,{meshes,cx,cz});
}
/* ---- ONE BLOW, ONE CHUNK, ONE FRAME ----
   A block broken marks its chunk — and its neighbour, if it sat on the join
   — and the mark is answered by rebuilding that chunk and nothing else. The
   per-frame slice is the same idea the streamer already runs on, so a man
   hammering at a wall cannot starve the ground he is walking toward. A chunk
   that is not resident is not built: it will be, with the edit in it, the
   next time he comes near enough to want it. */
let REMESHES=0;                 /* how many chunks a hand has caused to be laid again */
function remeshChunk(key){
  const ch=chunks.get(key); if(!ch) return false;
  REMESHES++;
  for(const m of ch.meshes){ chunkRoot.remove(m); m.geometry.dispose(); }
  chunks.delete(key);
  const p=key.split(',');
  buildChunk(+p[0],+p[1]);
  return true;
}
function flushEdits(ms){
  if(!EDIT_DIRTY.size) return 0;
  const t0=performance.now(); let n=0;
  for(const key of EDIT_DIRTY){
    EDIT_DIRTY.delete(key);
    if(remeshChunk(key)) n++;
    if(performance.now()-t0>(ms||7)) break;
  }
  return n;
}
/* ---- A BUCKET OF FACES, MADE INTO A THING THAT STANDS BY ITSELF ----
   The chunk mesher writes into a bucket and hands it to the renderer. Some
   things are not part of a chunk and must move about on their own — a nest,
   a den, a burrow — but they are built out of exactly the same boxes. This
   makes one group out of a bucket, so the same emit code serves both. */
function groupFromG(G){ const g=new THREE.Group();
  for(const mat in G){ const b=G[mat];
    const bg=new THREE.BufferGeometry();
    bg.setAttribute('position',new THREE.Float32BufferAttribute(b.p,3));
    bg.setAttribute('uv',new THREE.Float32BufferAttribute(b.uv,2));
    bg.setAttribute('color',new THREE.Float32BufferAttribute(b.c,3));
    bg.setIndex(b.i);
    g.add(new THREE.Mesh(bg,MAT[mat])); }
  return g; }
const _chAt=[NaN,NaN];
/* `view` widens the streamed ring past VIEW for a flyer, whose eye covers
   more ground than a walker's — the reap keeps the same measure, so coming
   down again sheds the extra ring */
function updateChunks(px,pz,budget,view){
  view=view||VIEW;
  const ccx=Math.floor(px/CHW), ccz=Math.floor(pz/CHW);
  const moved=(ccx!==_chAt[0]||ccz!==_chAt[1]);
  let added=false;
  for(let dz=-view;dz<=view;dz++) for(let dx=-view;dx<=view;dx++){
    if(dx*dx+dz*dz>view*view+2) continue;
    const cx=ccx+dx, cz=ccz+dz, k=cx+','+cz;
    if(!chunks.has(k)&&!buildQueued.has(k)){ buildQueue.push({k,cx,cz}); buildQueued.add(k); added=true; }
  }
  /* ---- THE QUEUE KEEPS ITS KEYS AS NUMBERS ----
     It was re-sorted on every frame, and every single comparison split two
     keys out of their strings and parsed four numbers out of them — on a
     queue of two hundred waiting chunks that is some six thousand string
     parses a frame, paid to arrive at the order the queue was already in.
     The work was taken out of the very budget meant for building the ground,
     which is why the land came in slowly as the traveller drew near it.
     Nearest first still, so what is underfoot is laid before the horizon. */
  if(added||moved){ _chAt[0]=ccx; _chAt[1]=ccz;
    /* nearest first — but a fast FLYER'S queue is ranked from a point led
       out along his heading, so the ground he is rushing toward is laid
       before the ring behind him, and the frontier never breaks the haze */
    let lcx=ccx, lcz=ccz;
    if(state.mode==='fly'&&(frame._spd||0)>140){
      lcx=ccx+Math.round(Math.sin(state.fly.heading)*2);
      lcz=ccz+Math.round(Math.cos(state.fly.heading)*2); }
    buildQueue.sort((A,Bq)=>((A.cx-lcx)**2+(A.cz-lcz)**2)-((Bq.cx-lcx)**2+(Bq.cz-lcz)**2)); }
  /* ---- THE BUDGET IS TIME, NOT A COUNT ----
     Nine chunks was a fine allowance while every chunk was open sea, and a
     whole frame gone when nine of them were rainforest. The mesher takes a
     time slice now, as the flora and the sea bed and the villages all do:
     it builds until the slice is spent, with a hard cap so no frame is ever
     swallowed whole. Chunks the traveller has left behind are dropped from
     the queue unbuilt — after a fair-wind crossing the tail of the old
     coast's queue was being built only to be reaped the same frame. */
  const rush=budget>100;      /* a landfall set down whole (fair wind, going ashore) */
  const T0=performance.now(), MS=budget>9?14:budget>4?9:4;
  let n=0;
  while(buildQueue.length&&(rush||(n<24&&(n<1||performance.now()-T0<MS)))){
    const q=buildQueue.shift(); buildQueued.delete(q.k);
    if(chunks.has(q.k)) continue;
    if((q.cx-ccx)**2+(q.cz-ccz)**2>(view+2)*(view+2)) continue;   /* left behind */
    buildChunkTimed(q.cx,q.cz); n++; }
  /* and the reaping reads the chunk's own numbers rather than parsing them
     back out of its key, two hundred times a frame */
  /* THE REAP KEEPS THE ADD'S OWN MEASURE. Chunks were added on a Euclidean
     disc of 13 but reaped on a SQUARE of 15 — so the corners of the square,
     which the add would never fill, held nearly twice the needed chunks
     alive: ~960 resident for ~540 wanted, and every one of them a draw call
     and a cull test a frame. The mesher's own frames were being spent
     carrying fog-bound ground, which is what let the land fall behind the
     haze at speed. One ring of hysteresis is kept. */
  /* budgeted: coming down from the widened flight ring used to shed ~680
     chunks in the landing frame — a visible hitch on every touch-down */
  let reaped=0;
  for(const[k,ch] of chunks){
    const dx2=ch.cx-ccx, dz2=ch.cz-ccz;
    if(dx2*dx2+dz2*dz2>(view+2)*(view+2)){
      for(const m of ch.meshes){ chunkRoot.remove(m); m.geometry.dispose(); } chunks.delete(k);
      if(++reaped>=48) break; } }
}

/* ================= THE FAR LAND =================
   The chunk mesher reaches some 768 units and no further, which was ample
   while the tallest thing upon the earth was a hill. It is not ample for a
   mountain 1,300 units high: a range would stand wholly invisible until the
   traveller was upon it, and then rear up out of nothing — and the whole
   point of raising the mountains is that they are SEEN, from a long way off,
   standing over the sea.
   So beyond the chunks the land is drawn a second time at a coarse grain: a
   POLAR ring of triangles centred on the traveller, its rings spaced
   geometrically so the mesh grows coarser the further out it reaches (detail
   where the eye can use it, none where it cannot), each vertex taking the
   true height of the land beneath it. It is rebuilt only when he has
   travelled a good way, and it is SUNK into the ground at its inner edge so
   the real blocky chunks always stand in front of it and never fight it. */
/* The inner radius must stay well within the chunks' own reach (1,248 units
   at VIEW=13), because the mesh is only re-centred when the traveller has
   moved a good way: while it is stale its hole sits off to one side of him,
   and if the hole's near edge ever came out past the chunks there would be
   open sky where the ground should be. R0 + the rebuild threshold is the
   budget. */
/* Four times the detail. At 48x84 the ring was fine while it reached 3,600
   units, but it now opens out past 15,000 as the eye draws back, and at that
   span its quads were whole countries wide. The rebuild costs about four
   times as much for it — it was 5-11 ms every 300 units of travel — and that
   cost cannot be bought back by rebuilding less often (see below). */
/* FL_FADE is how far the inner dip takes to die away. It ran 760 units — out
   to 1,180 from the traveller — while the chunks that are meant to be hiding
   the dipped ground stop at 768. The last four hundred units of it were laid
   bare on open ground. It is spent now while the chunks still cover it. */
/* ---- AND THE FAR COUNTRY IS BUILT OF BLOCKS TOO ----
   The ring was a SHEET: one height per vertex and the triangles ramping
   smoothly from each to the next. Near at hand the world is lego and every
   mountain is a stair of blocks; at the ring's edge that same mountain became
   a smooth brown swell, and the seam between the two was the plainest thing on
   the horizon. "Every single mountain should be lego, no matter how far."
   So the ring is laid as TERRACES. The polar grid is a grid of CELLS now, not
   of points: each cell takes one height and one colour off the land and is
   drawn as a flat top, and between one cell and the next the mesh drops
   almost straight down — a wall, not a ramp. The bricks grow with the
   distance, as they must (a brick the size of a real block would be beneath
   seeing at four thousand units), so the far country is coarse lego and the
   near country is fine lego, and both are lego.
   It is built on a FIXED weave: each cell owns a two-by-two patch of the
   vertex grid, its inner pair set just inside the cell's near edge and its
   outer pair just inside the far one. Every vertex of a patch carries the same
   height, so the patch is flat; the thin quads BETWEEN patches stand up on
   end. One index buffer, built once, serves every rebuild. */
const FL_RINGS=64, FL_SPOKES=112, FL_R0=420, FL_R1=3600, FL_FADE=330, FL_STEP=300;
const FL_NR2=FL_RINGS*2, FL_NS2=FL_SPOKES*2;   /* the woven grid is twice as fine */
const FL_INSET=0.035;         /* how far in from a cell's edge its corners sit */
/* the angle of every vertex column: two per cell, just inside its two edges.
   And the same angles again WITHOUT the inset, on the cell's true edges, for
   the far rings that give up the brick and close into open ground. */
const FL_COS=new Float32Array(FL_NS2), FL_SIN=new Float32Array(FL_NS2);
const FL_COS0=new Float32Array(FL_NS2), FL_SIN0=new Float32Array(FL_NS2);
{ const dth=Math.PI*2/FL_SPOKES;
  for(let s=0;s<FL_SPOKES;s++){ const t0=s*dth;
    const a=t0+dth*FL_INSET, b=t0+dth*(1-FL_INSET);
    FL_COS[s*2]=Math.cos(a); FL_SIN[s*2]=Math.sin(a);
    FL_COS[s*2+1]=Math.cos(b); FL_SIN[s*2+1]=Math.sin(b);
    FL_COS0[s*2]=Math.cos(t0); FL_SIN0[s*2]=Math.sin(t0);
    FL_COS0[s*2+1]=Math.cos(t0+dth); FL_SIN0[s*2+1]=Math.sin(t0+dth); } }
/* ---- A BLOCK IS A BLOCK UNTIL IT IS A COUNTY ----
   Every cell of the ring is laid as one flat-topped brick with a wall down to
   its neighbour, which is right where a cell is a few blocks across: it is
   the same grammar as the chunks it stands beside, and the seam cannot be
   found. But the ring's cells grow with its reach, and drawn back a few
   thousand units a single cell is four hundred units — SIXTY-SIX BLOCKS —
   across. Sixty-six blocks of country flattened to one height with a sheer
   wall round it is not the block grammar at all; it is a terraced wedding
   cake laid over the earth in rings and spokes, and it is exactly what read
   as a coarse overlay thrown over the world instead of the world itself
   drawing away.
   So the brick is kept while a cell is block-sized and GIVEN UP as it grows:
   past about four blocks the corners walk out onto the cell's true edges (the
   walls between cells closing to nothing) and each corner takes the mean of
   the cells that meet at it, so the far country resolves into ground with
   ranges and valleys in it rather than steps.
   THE COASTS ARE NOT SMOOTHED. A corner where dry land meets open water keeps
   the hard step: the one line out there the eye truly reads is the shape of
   the coast, and a shore eased into the sea over four hundred units is a
   world with no coastline at all. */
const FL_SM0=24, FL_SM1=170;      /* cell width, in units, over which the brick is given up */
const flGeo=(()=>{
  const g=new THREE.BufferGeometry(), nv=FL_NR2*FL_NS2;
  const pos=new Float32Array(nv*3), col=new Float32Array(nv*3), idx=[];
  /* WOUND FACE UP. It was wound the other way about, and every triangle of
     the far country pointed at the deep — so the whole of it was thrown away
     by the backface cull the moment it was looked at from above, which is the
     only way it is ever looked at. What survived was the flanks of the
     mountains alone, where the ground tilts past the upright and turns its
     other face to the eye: nothing of France to be seen but the Alps,
     standing out of open water, with the sea drawn straight through where the
     country should have been. */
  for(let i=0;i<FL_NR2-1;i++) for(let j=0;j<FL_NS2;j++){ const j2=(j+1)%FL_NS2;
    const p0=i*FL_NS2+j, p1=i*FL_NS2+j2, p2=(i+1)*FL_NS2+j, p3=(i+1)*FL_NS2+j2;
    idx.push(p0,p1,p2, p1,p3,p2); }
  g.setAttribute('position',new THREE.BufferAttribute(pos,3));
  g.setAttribute('color',new THREE.BufferAttribute(col,3));
  g.setIndex(idx); return g;
})();
/* the colours the blocks read as from far off, where no texture can be seen */
const FL_COL={grass:[0.34,0.52,0.26], tropic:[0.22,0.50,0.22], tundra:[0.44,0.49,0.40],
  sand:[0.80,0.73,0.52], desert:[0.82,0.72,0.48], badlands:[0.64,0.39,0.25],
  rock:[0.50,0.49,0.47], alpine:[0.40,0.34,0.26], snow:[0.86,0.92,1.02],
  /* the far ring wears ONE material for the whole world, so its ice cannot be
     lit apart — the blue is put into the vertex colour instead, strong enough
     that the rim's brown light cannot turn it to sand */
  wall:[0.58,0.80,1.10], floe:[0.54,0.76,1.06]};
const FL_SEA=[0.07,0.20,0.32], FL_VOID=[0.01,0.012,0.03];
/* The SAME kind of material the blocks wear — unlit, vertex-shaded, tinted by
   the one global day-light — and enrolled in LIT with them. A lambert surface
   here took the hemisphere's blue-grey ground colour on every face turned
   from the sun, so the far ranges came out slate blue while the near land
   stood in daylight, and the seam between them was plain. */
const farLandMat=new THREE.MeshBasicMaterial({vertexColors:true,transparent:true,opacity:0}); LIT.push(farLandMat);
const farLand=new THREE.Mesh(flGeo,farLandMat);
farLand.frustumCulled=false; farLand.visible=false; scene.add(farLand);
const FL_NC=FL_RINGS*FL_SPOKES;          /* cells of far country, one sample each */
const FL_NV=FL_NR2*FL_NS2;               /* vertices of the woven grid */
const _flH=new Float32Array(FL_NC);
/* THE RING IS BUILT OFF TO ONE SIDE AND SWAPPED IN WHOLE. Reading fifteen
   thousand cells of far country costs about fifty milliseconds — three whole
   frames — and at flying speed that bill falls due twice a second, which is
   felt as a lurch. So the work is laid out over as many frames as it takes,
   about six milliseconds at a time, into a second pair of buffers; the ring
   on screen keeps its old centre and its old shape until the last vertex is
   ready, and then the whole of it changes at once. A half-built ring is
   never shown. */
const _flPB=new Float32Array(FL_NV*3), _flCB=new Float32Array(FL_NV*3);
const _flLand=new Uint8Array(FL_NC);   /* dry ground, which may never be sunk */
const _flC=new Float32Array(FL_NC*3);  /* the colour each cell read, for the blending */
const _flY=new Float32Array(FL_NC);    /* the height it finally stands at */
const _flSh=new Float32Array(FL_NC);   /* and how the turn of it takes the light */
const _flSm=new Float32Array(FL_RINGS);/* how far each ring has given up the brick */
const _flRad=new Float32Array(FL_RINGS);  /* the middle radius of each cell ring */
const FL_MS=6;                 /* the slice of a frame the rebuild may take */
let _flAt=null, _flR1=FL_R1, _flJob=null;
/* the four vertices of cell (k,s), in the woven grid */
function flCorners(k,s,out){
  const i0=k*2, j0=s*2;
  out[0]=(i0*FL_NS2+j0); out[1]=(i0*FL_NS2+j0+1);
  out[2]=((i0+1)*FL_NS2+j0); out[3]=((i0+1)*FL_NS2+j0+1);
}
const _flQ=new Int32Array(4);
/* one ring of ground: the heights and the colours, read from the world */
function flFillRing(k,px,pz,kr,fine){
  /* the cell's own edges, and the middle of it where the land is read */
  const rIn=FL_R0*Math.exp(kr*k/FL_RINGS), rOut=FL_R0*Math.exp(kr*(k+1)/FL_RINGS);
  const rr=(rIn+rOut)*0.5;
  _flRad[k]=rr;
  /* the two vertex radii of this cell: just inside either edge, so that what
     lies between one cell and the next is a wall standing on end */
  /* — unless the cell has outgrown the block grammar, when they walk out onto
     the true edges and the wall between one cell and the next closes up */
  const sm=Math.max(0,Math.min(1,(rr*6.2832/FL_SPOKES-FL_SM0)/(FL_SM1-FL_SM0)));
  _flSm[k]=sm;
  const ins=FL_INSET*(1-sm);
  const ra=rIn+(rOut-rIn)*ins, rb=rOut-(rOut-rIn)*ins;
  /* ---- A RANGE, NOT A TENT ----
     One point sample per vertex, at a spacing that grows from sixteen units
     at the inner edge to hundreds at the outer, and a massif is barely a
     hundred units across: the sample hit a mountain's shoulder as often as
     its crown, and a whole chain came and went between one vertex and the
     next. What was left standing was a lone smooth triangular tent where a
     mountain wall should be — and it moved and changed shape with every
     rebuild, because a different part of the range was hit each time.
     Each vertex now takes the TALLEST land within its own footprint. A range
     keeps its mass and its true stature, the same summits stand in the same
     places every rebuild, and the ring reads as the land it stands for.
     They are taken ONLY where the middle of the footprint is dry ground that
     already stands like high country. The coastline is read from the one true
     sample, so no land is ever grown out over the water; and the plains — the
     most of the earth, and flat, with nothing for a wider look to find — are
     not made to pay for a thing only the mountains need. */
  const span=fine?Math.min(80,Math.round(rr*6.2832/FL_SPOKES/B*0.34)):0;
  const dth=Math.PI*2/FL_SPOKES;
  for(let s=0;s<FL_SPOKES;s++){
    const c0=k*FL_SPOKES+s;
    /* the land is read at the MIDDLE of the cell — the whole brick stands at
       that one height, as a block does */
    const th=(s+0.5)*dth, wx=Math.cos(th)*rr+px, wz=Math.sin(th)*rr+pz;
    /* cellRaw, not cell — the village flattening is a matter of 86 units and
       cannot be seen out here, and filling the cell cache with far country
       would only thrash it for the ground underfoot */
    const ix=Math.floor(wx/B), iz=Math.floor(wz/B);
    let cc=cellRaw(ix,iz);
    if(cc&&cc.h>6&&span>1){
      const a1=cellRaw(ix+span,iz+span); if(a1&&a1.h>cc.h) cc=a1;
      const a2=cellRaw(ix-span,iz+span); if(a2&&a2.h>cc.h) cc=a2;
      const a3=cellRaw(ix+span,iz-span); if(a3&&a3.h>cc.h) cc=a3;
      const a4=cellRaw(ix-span,iz-span); if(a4&&a4.h>cc.h) cc=a4;
    }
    let y,c;
    if(cc){ y=cc.h*B; c=FL_COL[cc.kind]||FL_COL.grass; }
    else if(Math.hypot(wx,wz)>R_WORLD*0.9955){
      /* past the rim there is no sea and no land — only the outer darkness.
         A sheet of ocean drawn out there hung in the void below the ice. */
      y=-900; c=FL_VOID; }
    else { y=WATER_Y-6; c=FL_SEA; }     /* well under the trough of any wave */
    _flH[c0]=y; _flLand[c0]=cc?1:0;
    _flC[c0*3]=c[0]; _flC[c0*3+1]=c[1]; _flC[c0*3+2]=c[2];
    /* the brick's four corners. The colours and the heights are settled in the
       shading pass, which alone has the whole ring to hand and can ask what
       stands on the other side of a cell's edge; here only the ground plan is
       laid — and it eases from the inset brick to the closed sheet as the
       cells outgrow the blocks they stand for. */
    flCorners(k,s,_flQ);
    for(let q=0;q<4;q++){ const i=_flQ[q]*3;
      const rq=(q<2)?ra:rb, jq=(q&1)?s*2+1:s*2;
      const cs2=FL_COS[jq]+(FL_COS0[jq]-FL_COS[jq])*sm;
      const sn2=FL_SIN[jq]+(FL_SIN0[jq]-FL_SIN[jq])*sm;
      _flPB[i]=cs2*rq; _flPB[i+2]=sn2*rq;
      _flCB[i]=c[0]; _flCB[i+1]=c[1]; _flCB[i+2]=c[2]; }
  }
}
/* a cell index, with the spokes running round and the rings stopping at the
   ends — so the blending at the ring's own two edges leans on itself */
function flAt(k,s){ return (k<0?0:k>=FL_RINGS?FL_RINGS-1:k)*FL_SPOKES
  +((s%FL_SPOKES)+FL_SPOKES)%FL_SPOKES; }
/* which three OTHER cells meet this cell at each of its four corners */
const FL_NB=[[-1,-1,-1,0,0,-1],[-1,0,-1,1,0,1],[1,-1,1,0,0,-1],[1,0,1,1,0,1]];
/* one ring of shading: a brick that stands over its neighbours is darkened on
   the turn, as the flanks of the near blocks are, so a stair of them reads as
   a stair and not as one flat field of colour */
function flShadeRing(k,r1){
  const r=_flRad[k]||FL_R0;
  const step=Math.max(1,Math.min(r*6.283/FL_SPOKES,(r1-FL_R0)/FL_RINGS));
  for(let s=0;s<FL_SPOKES;s++){
    const c0=k*FL_SPOKES+s;
    const cr=(k<FL_RINGS-1?k+1:k-1)*FL_SPOKES+s, cs=k*FL_SPOKES+(s+1)%FL_SPOKES;
    const fall=(Math.abs(_flH[c0]-_flH[cr])+Math.abs(_flH[c0]-_flH[cs]))/(step*1.7);
    _flSh[c0]=1-0.40*Math.min(1,fall);
    /* THE SINK MAY NOT DROWN THE COUNTRY. The ring dips beneath the chunks at
       its inner edge so the seam between coarse and fine ground cannot be
       seen — but the flat country of the world stands ONE BLOCK above the
       waterline, and eight units of dip put whole nations under the sea. What
       was left showing was the mountains alone, standing out of open water
       where France should have been. The dip is now spent before the chunks
       run out, and dry ground is never carried below the waves whatever the
       dip asks for. */
    const sink=Math.max(0,1-Math.max(0,r-FL_R0)/FL_FADE);
    let y=_flH[c0]-sink*B*1.4;
    if(_flLand[c0]) y=Math.max(y,Math.min(_flH[c0],WATER_Y+2.2));
    _flY[c0]=y;
  }
}
/* ---- AND THE CORNERS ARE SET LAST OF ALL ----
   A corner may only be settled once every cell that meets at it has been
   read and shaded, which is why this is a pass of its own and not the tail
   of the one above: the cells that meet at a corner lie in the ring on
   either side, and one of those two has not been shaded yet while the ring
   between them is being walked. */
function flCornerRing(k){
  const sm=_flSm[k];
  for(let s=0;s<FL_SPOKES;s++){
    const c0=k*FL_SPOKES+s;
    flCorners(k,s,_flQ);
    const y0=_flY[c0], sh0=_flSh[c0], land0=_flLand[c0];
    const r0=_flC[c0*3], g0=_flC[c0*3+1], b0=_flC[c0*3+2];
    if(sm<0.004){                    /* a block-sized cell stays a block */
      for(let q=0;q<4;q++){ const i=_flQ[q]*3;
        _flPB[i+1]=y0;
        _flCB[i]=r0*sh0; _flCB[i+1]=g0*sh0; _flCB[i+2]=b0*sh0; }
      continue; }
    /* the corner takes the mean of the cells that meet there — of those
       cells only that are of the same element as this one, so a shore is
       never eased out into the water it stands over. The turn-shading is
       averaged with them: left flat per cell it would put back, in light,
       the very cell edges the blending has just taken out in shape. */
    for(let q=0;q<4;q++){ const i=_flQ[q]*3, nb=FL_NB[q];
      let ys=y0, n=1, cr=r0, cg=g0, cb=b0, ss=sh0;
      for(let m=0;m<6;m+=2){ const c2=flAt(k+nb[m],s+nb[m+1]);
        if(_flLand[c2]!==land0) continue;
        ys+=_flY[c2]; ss+=_flSh[c2];
        cr+=_flC[c2*3]; cg+=_flC[c2*3+1]; cb+=_flC[c2*3+2]; n++; }
      const inv=1/n;
      const sh=sh0+(ss*inv-sh0)*sm;
      _flPB[i+1]=y0+(ys*inv-y0)*sm;
      _flCB[i]  =(r0+(cr*inv-r0)*sm)*sh;
      _flCB[i+1]=(g0+(cg*inv-g0)*sm)*sh;
      _flCB[i+2]=(b0+(cb*inv-b0)*sm)*sh; }
  }
}
function updateFarLand(px,pz,force,eyeY){
  /* THE HIGHER THE EYE, THE FURTHER IT MUST REACH. A ring three thousand
     units across is the whole world when you stand on it and a postage stamp
     when you are miles above it — which is why, aloft, the streamed land
     showed as one small patch adrift on the chart. It opens out with height. */
  /* It must follow the VIEW, not the altitude alone. Drawing the eye back
     over a traveller stood at sea level opens a window thousands of units
     wide while the ring stayed 3,600 across — leaving a patch of world on an
     empty plane, with the chart still far too near to be anything but a
     blur. Whichever reaches further, the height or the pull-back, sets it. */
  const reach=Math.max(eyeY||0, state.camDist*0.75);
  /* SEVEN TIMES, and it must stay seven. The ring is the BRIDGE between the
     streamed chunks (which reach some 768 units) and the charted face; cap
     its reach and the bridge stops short, and what stands between its outer
     edge and the chart is nothing at all — a great hole in the middle of the
     world with the traveller sitting in it. (Tried at three, to keep the
     cells from growing coarse. It made the hole. The coarseness is answered
     by bringing the CHART in over the top of it sooner, which is a thing to
     add and not a thing to take away.) */
  const want=FL_R1*(1+Math.min(7,Math.max(0,reach-120)/2200));
  /* The staleness CANNOT be opened out to pay for the denser mesh, however
     far the ring reaches: while it is stale its hole sits off to one side of
     the traveller, and R0 (420) plus that offset has to stay inside the
     chunks' own reach (~768) or open sky shows where the ground should be.
     ~330 is the whole of the room there is — and now the rebuild takes ten
     frames rather than one, the traveller goes on moving through the whole of
     it, so the work is STARTED earlier, at 220, to leave the rest for the
     ground he covers while it is being laid out. */
  const lag=_flAt?Math.hypot(_flAt[0]-px,_flAt[1]-pz):0;
  const grown=Math.abs(want-_flR1)/_flR1>0.18;
  /* ---- THE RING KEEPS ITS FOOTING BETWEEN REBUILDS ----
     It was re-laid around the RAW eye position, so every rebuild re-sampled
     the whole horizon on a lattice shifted a couple hundred units from the
     last — every terrace on the coarse world reshaping at once, a visible
     whole-horizon reflow each ~220 units of travel. The centre now SNAPS to
     the FL_STEP grid (at last earning that constant its keep), and the
     radius holds steady unless the view truly grew — so a rebuild that lands
     on the same snapped centre is skipped outright, and one that steps does
     so by a whole, regular stride. */
  const sxx=Math.round(px/FL_STEP)*FL_STEP, szz=Math.round(pz/FL_STEP)*FL_STEP;
  const movedC=!_flAt||_flAt[0]!==sxx||_flAt[1]!==szz;
  /* the very first ring has nothing to stand in for it, so it is built whole
     before the frame is drawn rather than showing a black disc for a moment */
  const whole=force||!_flAt;
  if(!_flJob){
    if(!whole&&!grown&&(!movedC||lag<220)) return;
    const r1=(grown||whole)?want:_flR1;
    _flJob={px:sxx,pz:szz,r1,kr:Math.log(r1/FL_R0),k:0,sk:0,ck:0};
  } else if(whole){ _flJob={px:sxx,pz:szz,r1:want,kr:Math.log(want/FL_R0),k:0,sk:0,ck:0}; }
  /* and if he is outrunning it anyway — flying, or the frames themselves so
     slow that ten of them are seconds — the rebuild stops being polite and
     finishes in the one frame rather than let the hole open. That is the old
     50 ms hitch, but only ever in the case where politeness has already lost;
     it is no longer the price of every step. */
  const rush=whole||lag>380;
  /* and the footprint sampling is dropped ONLY when he is outrunning the ring
     — there is no point paying for the true shape of a range that will be
     thrown away and built again before the next second is out. A ring asked
     for outright (the first of all, or a landfall set down by the firmament)
     is built fine whatever the distance: it is built but once, and it is what
     he sees when he arrives. */
  const fine=whole||lag<=380;
  const J=_flJob, t0=performance.now();
  while(J.k<FL_RINGS){ flFillRing(J.k++,J.px,J.pz,J.kr,fine);
    if(!rush&&performance.now()-t0>=FL_MS) return; }
  while(J.sk<FL_RINGS){ flShadeRing(J.sk++,J.r1);
    if(!rush&&performance.now()-t0>=FL_MS) return; }
  while(J.ck<FL_RINGS){ flCornerRing(J.ck++);
    if(!rush&&performance.now()-t0>=FL_MS) return; }
  /* done — the new ring takes the place of the old one in a single step */
  flGeo.attributes.position.array.set(_flPB);
  flGeo.attributes.color.array.set(_flCB);
  flGeo.attributes.position.needsUpdate=true; flGeo.attributes.color.needsUpdate=true;
  farLand.position.set(J.px,0,J.pz);
  _flAt=[J.px,J.pz]; _flR1=J.r1; _flJob=null;
}

/* ================= RENDERER · SKY · SEA ================= */
/* THE FOG IS THE EDGE OF THE WORLD, minecraft-fashion. The streamed chunks
   reach 1,248 units (VIEW=13), and the haze closes JUST INSIDE that, so
   everything the eye can reach is true blocks and nothing else — no coarse
   stand-in beyond them, ever, in gameplay. A far country is simply in the
   fog until the ship draws near, as a far country is in Minecraft. The haze
   only opens when the traveller rises high on the air or draws the eye back
   off the world — the carpet of the whole earth appears there instead. */
const FOG_FAR=1140, FOG_NEAR=500;
/* how high the eye must rise before the far carpet may stand in for the
   world; below this everything is blocks and fog, and nothing else */
const ALOFT_EYE=1000;
scene.fog=new THREE.Fog(0x9fc5e8,FOG_NEAR,FOG_FAR); const FOG=scene.fog;
const camera=new THREE.PerspectiveCamera(62,innerWidth/innerHeight,1,R_WORLD*3.2);
/* antialias ON — a world built of blocks is ALL edges, and smoothed edges
   are half the difference between a tech demo and a finished game */
const renderer=new THREE.WebGLRenderer({canvas:$('cv'),antialias:true});
renderer.setPixelRatio(Math.min(2,devicePixelRatio||1));
renderer.setSize(innerWidth,innerHeight);
addEventListener('resize',()=>{camera.aspect=innerWidth/innerHeight;camera.updateProjectionMatrix();renderer.setSize(innerWidth,innerHeight);});
scene.background=new THREE.Color(0x9fc5e8);

/* entity lighting (mobs/players use lambert like MC's soft mob shading) */
const hemi=new THREE.HemisphereLight(0xffffff,0x777788,0.9); scene.add(hemi);
const dirL=new THREE.DirectionalLight(0xffffff,0.5); dirL.position.set(0.4,1,0.25); scene.add(dirL);

/* ---- THE TWO BACKDROP DISCS STAND WELL APART ----
   They lay four units from one another (−12 and −16) with the wave grid
   eight above, and a depth buffer stretched over a 576,000-unit far plane
   cannot tell planes that close apart at a glancing angle: looked down on
   from a mountain, the far water shimmered and striped as the three fought
   for every pixel — the famous glitch in the sea seen from every summit.
   They are spread by hundreds of units now (the eye cannot tell a flat
   backdrop's depth anyway), and the fighting has nothing left to fight. */
const seaDeep=new THREE.Mesh(new THREE.CircleGeometry(R_WORLD*1.002,120),
  new THREE.MeshBasicMaterial({color:0x0c2c48}));
seaDeep.rotation.x=-Math.PI/2; seaDeep.position.y=WATER_Y-300; scene.add(seaDeep);
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
const _voidC=new THREE.Color(0x02030a);      /* the outer darkness, beyond the rim */
function updateWallWeather(px,pz,dt){
  /* and no drift of snow across the scene at the world's edge: it is lit by
     nothing out there, and it read as grey dust hanging over the deep */
  if(state.firm||sceneFlag('noSnow')){ snow.visible=false; snowMat.opacity=0; return; }
  const r=Math.hypot(px,pz)/R_WORLD, wallF=Math.max(0,Math.min(1,(r-0.85)/0.1));
  if(wallF>0.01 && scene.fog && !state.firm && state.mode!=='dive'){
    /* a cold haze closes in at the rim — it may shorten an OPEN view (the
       flyer's), but it never raises a shut one: the gameplay fog is already
       tighter than its old floor, and lifting it here would punch a window
       through the world's edge just where the ice stands */
    scene.fog.far=Math.max(scene.fog.far*(1-wallF*0.34),Math.min(scene.fog.far,1900));
    scene.fog.color.lerp(_coldFog,wallF*0.5); }
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
sea.rotation.x=-Math.PI/2; sea.position.y=WATER_Y-60; scene.add(sea);

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

/* the GPU wave grid, following the ship/traveller across the deep.
   It has to reach as far as the haze now does, or its flat edge stands out
   as a seam on open water where the fog no longer hides it. */
const WG_S=2500, WG_SEG=200;
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
    uShoal:{value:SHOAL_TEX}, uZenith:{value:new THREE.Color(0x3d76c0)},
    uShip:{value:new THREE.Vector4()}, uShipH:{value:0}, uSunCol:{value:new THREE.Color(1,0.96,0.85)},
    /* the lesser light to rule the night */
    uMoonDir:{value:new THREE.Vector3(0,1,0)}, uMoonCol:{value:new THREE.Color(0.60,0.70,0.96)},
    uMoon:{value:0} },
  vertexShader:`
    uniform float uTime, uAmp; uniform vec2 uCenter; uniform sampler2D uShoal;
    varying vec3 vNormal, vWorld; varying float vHeight, vFog, vTaper; varying vec2 vUv, vP;
    void main(){
      vec2 P=position.xz+uCenter;
      float ed=max(abs(position.x),abs(position.z));
      float taper=1.0-smoothstep(${(WG_S*0.55).toFixed(1)},${(WG_S*0.97).toFixed(1)},ed);
      /* THE SWELL LIES DOWN AS IT COMES ASHORE. A wave in a storm stands
         nearly ten units, and the flattest beach is only six above the
         waterline — so the open-sea swell, carried right up onto the land by
         a grid that now reaches 2,500 units inland, washed straight over
         solid ground. Real water does not do this either: a swell shoals and
         breaks as the bottom rises under it. So the amplitude is damped by
         the same distance-to-land field the surf already reads, and by the
         shore it is all but flat. */
      float shr=texture2D(uShoal, P*${(0.5/R_WORLD).toFixed(10)}+0.5).r;
      float lie=1.0-smoothstep(0.22,0.90,shr);
      float amp=uAmp*taper*(0.10+0.90*lie);
      vec3 disp=vec3(P.x, ${WATER_Y.toFixed(3)}, P.y);
      vec3 nrm=vec3(0.0,1.0,0.0);
      ${waveUnroll}
      vHeight=disp.y-${WATER_Y.toFixed(3)}; vTaper=taper;
      vNormal=normalize(nrm); vUv=P*0.02; vP=P; vWorld=disp;
      vec4 mv=viewMatrix*vec4(disp,1.0); vFog=-mv.z;
      gl_Position=projectionMatrix*mv;
    }`,
  fragmentShader:`
    precision highp float;
    uniform vec3 uLight, uFogColor, uSunDir, uDeep, uShallow, uCamPos, uSunCol, uZenith; uniform sampler2D uMap, uShoal;
    uniform float uFogNear, uFogFar, uOpacity, uTime, uShipH; uniform vec4 uShip;
    uniform vec3 uMoonDir, uMoonCol; uniform float uMoon;
    varying vec3 vNormal, vWorld; varying float vHeight, vFog, vTaper; varying vec2 vUv, vP;
    float h21(vec2 p){ return fract(sin(dot(p,vec2(41.3,289.1)))*43758.5); }
    void main(){
      vec3 N=normalize(vNormal);
      /* fine wind-ripple, two scrolling octaves — the skin of the sea is never
         still: per-pixel normal detail breaks the big Gerstner facets into chop */
      vec3 rA=texture2D(uMap, vP*0.016+vec2(uTime*0.011,uTime*0.008)).rgb;
      vec3 rB=texture2D(uMap, vP*0.058+vec2(-uTime*0.019,uTime*0.014)).rgb;
      N=normalize(N+vec3((rA.r-0.5)*0.34+(rB.r-0.5)*0.20, 0.0, (rA.g-0.5)*0.34+(rB.g-0.5)*0.20));
      vec3 V=normalize(uCamPos-vWorld);
      vec3 L=normalize(uSunDir);
      /* ---- IS THE EYE OVER THIS WATER, OR UNDER IT? ----
         The sea was shaded as though always looked DOWN upon: the sun's
         specular path, the glitter and the mirrored sky were laid on the
         surface whichever side it was seen from. Swim beneath it and that
         burning path hung in the water as a great white blaze across the
         reef, brighter than anything under the sea, and washed the floor and
         the coral clean out of the view. From below there is no sun-path and
         no sky in the water — only the light coming dimly through. */
      float above=step(vWorld.y,uCamPos.y);
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
      /* crest foam — only the tallest crests, torn ragged by the ripple noise */
      float foam=smoothstep(2.1,3.3,vHeight)*(0.45+0.9*rB.b);
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
        /* ---- THE WASH BELONGS TO THE COAST, NOT TO THE RIVERS ----
           The shore-foam is driven by the distance-to-land field, and a
           river lies within a pixel of land on BOTH banks — the field reads
           'water's edge' across its whole surface, and every waterway inland
           burned as one solid sheet of flashing white. Water that is wholly
           ENCLOSED by land (the field at its ceiling) takes no surf at all
           now: the sea still breaks on every beach, and the rivers run
           smooth and clear as rivers do. */
        float open=1.0-smoothstep(0.955,0.985,shoalRaw);
        float ring=fract(shoalRaw*7.0-uTime*0.32);
        float crest=smoothstep(0.58,0.88,ring)-smoothstep(0.9,1.0,ring);
        float brk=0.35+0.75*texture2D(uMap, vP*0.008+vec2(uTime*0.006,uTime*0.004)).b;
        lap=clamp(crest,0.0,1.0)*smoothstep(0.5,0.85,shoalRaw)*brk*open;
        /* and a line of white wash toward the water's edge — on the open
           coast alone */
        lap+=smoothstep(0.9,0.99,shoalRaw)*brk*(0.5+0.3*sin(uTime*1.7+shoalRaw*40.0))*open;
      }
      float allFoam=clamp(foam*0.32+wake*0.95+lap,0.0,1.0);
      /* foam is white ON TOP of the water; from underneath it is only a
         paler patch of ceiling, not a lamp */
      col=mix(col,vec3(0.88,0.93,1.0),allFoam*mix(0.22,1.0,above));
      col*=uLight;
      /* ---- AND THE LESSER LIGHT TO RULE THE NIGHT ----
         The sea had ONE light, and when the sun went down it had none: the day
         tint took it to a flat blue-black, the sun's diffuse and specular both
         fell to nothing, and the whole ocean read as one dead painted slab
         from horizon to shore. The moon lights it now as she lights the earth
         — a soft wash on the swell, a hard silver path burning down her own
         bearing, and the crests of the foam caught white. */
      if(uMoon>0.002&&above>0.5){
        vec3 M=normalize(uMoonDir);
        float md=clamp(dot(N,M),0.0,1.0);
        col+=base*uMoonCol*(0.30+0.85*md)*uMoon*1.35;
        vec3 HM=normalize(V+M);
        float mdot=max(dot(N,HM),0.0);
        float mglit=pow(mdot,34.0)*(0.45+0.55*h21(floor(vP*1.9)+floor(uTime*7.0)));
        col+=uMoonCol*(pow(mdot,120.0)*1.5+mglit*0.42)*md*uMoon;
        col+=uMoonCol*allFoam*uMoon*0.40;
      }
      /* sun specular + glitter — the sun's path burning on the swell */
      vec3 H=normalize(V+L);
      float spec=pow(max(dot(N,H),0.0),140.0);
      float glit=pow(max(dot(N,H),0.0),40.0)*(0.5+0.5*h21(floor(vP*1.7)+floor(uTime*9.0)));
      col+=uSunCol*(spec*1.8+glit*0.2)*diff*above;
      /* caustic sparkle where the light passes through to the sand */
      col+=uSunCol*glit*0.3*shoal*diff*above;
      /* light through the backlit crest — the glassy green heart of a wave */
      /* light through the backlit crest is a thing seen ACROSS the water, not
         from beneath it — from below, V and the sun agree and it blazed */
      float sss=pow(max(dot(V,-L),0.0),3.0)*smoothstep(0.6,2.4,vHeight)*(1.0-deepF*0.5)*above;
      col+=vec3(0.05,0.38,0.36)*sss*(0.35+diff*0.65);
      /* fresnel — the true sky mirrored at grazing angles: the horizon haze
         where the reflected ray runs flat, the deep zenith blue where it climbs */
      float fres=pow(1.0-max(dot(N,V),0.0),5.0);
      vec3 R=reflect(-V,N);
      vec3 skyR=mix(uFogColor*1.06, uZenith, pow(clamp(R.y,0.0,1.0),0.7));
      col=mix(col,skyR,fres*0.6*above);
      /* transparency by depth: the shallows let the bottom show through,
         the deep keeps its darkness; a mirror-skin at grazing angles */
      /* ---- HOW FAR THE EYE SEES DOWN INTO IT ----
         The skin's transparency followed the SHOAL — a distance-from-land
         field — so the bottom stopped showing at a fixed distance off the
         beach whatever the water was actually doing, and it was near enough
         opaque by thirty metres. Every terrace the mesher laid past that was
         geometry nobody could ever see: raising the shelf cap to a hundred
         and fifty metres cost half again as many triangles and changed not
         one pixel of the view from the deck.
         It follows the true DEPTH now, and the shelf profile gives that from
         the very same number (it is how the bed itself is drawn: D_STRAND,
         the break at 200 m, and the ^2.6 between them). Clear to some sixty
         metres, as a clear sea is, and shut below it. */
      float sp=1.0-pow(max(shoalRaw,0.0001),0.83333);
      float shelfM=2.17+197.8*pow(sp,2.6);           /* the depth here, in metres */
      float clear=1.0-smoothstep(8.0,62.0,shelfM);
      float aa=mix(0.93,0.55,clear);
      aa=mix(aa,0.985,fres*0.6*above);
      aa=max(aa,allFoam*0.95*above);
      /* and from beneath, the skin of the sea is thin — the daylight comes
         through it, as it does when you look up from under water */
      aa=mix(0.38,aa,above);
      /* AND THE GRID GIVES OUT WITHOUT AN EDGE. Its swell already lies down at
         the rim; now it thins away there too, into the flat sea of the far
         ring beneath it. Stood on the water the haze has long since taken it
         and nothing of this can be seen — but drawn back off the world, where
         the haze opens, its square corner stood on the ocean like a raft. */
      aa*=smoothstep(0.0,0.35,vTaper);
      float ff=clamp((vFog-uFogNear)/(uFogFar-uFogNear),0.0,1.0);
      gl_FragColor=vec4(mix(col,uFogColor,ff),aa);
    }`
});
const waveGrid=new THREE.Mesh(waveGeo,waveMat);
waveGrid.frustumCulled=false; scene.add(waveGrid);
const _sunW=new THREE.Vector3(), _moonW=new THREE.Vector3();
function waterTick(px,pz,dayF,storm){
  seaTime=performance.now()*0.001; seaAmp=1+storm*1.7;
  const u=waveMat.uniforms;
  u.uTime.value=seaTime; u.uAmp.value=seaAmp;
  u.uCenter.value.set(px,pz);
  u.uLight.value.copy(mix3(0x38405e,0xd9a878,0xffffff,dayF)).multiplyScalar(1-storm*0.34);
  u.uSunCol.value.copy(mix3(0x243048,0xffcf8a,0xfff2d6,dayF));
  u.uZenith.value.copy(mix3(0x05070f,0x27446e,0x3d76c0,dayF)).multiplyScalar(1-storm*0.45);
  if(scene.fog){ u.uFogColor.value.copy(scene.fog.color);
    u.uFogNear.value=scene.fog.near; u.uFogFar.value=scene.fog.far; }
  /* ---- ONE SEA, NOT THREE ----
     Beneath the Gerstner grid lie two flat backdrop discs, and they were
     painted a FIXED cold navy that never moved with the hour. The grid above
     them takes the day's light — so at dawn and at dusk, when the water goes
     warm and pale, the discs stayed winter-blue and the seam between them cut
     a hard straight line across the whole ocean: two, and sometimes three,
     visible layers of water stacked one over another.
     They are given the SAME colour the grid's own deep water reads as under
     this hour's light, and laid into the haze besides, so wherever one shows
     past the other there is nothing to see. */
  { const deep=u.uDeep.value, L=u.uLight.value;
    const fr=scene.fog?scene.fog.color:null;
    /* what the shader makes of deep water: base × light, with no sun on it */
    let r=deep.r*0.72*L.r, g=deep.g*0.72*L.g, b=deep.b*0.72*L.b;
    /* only a touch toward the haze — three's own fog is already on these
       discs, so a heavy pre-mix here lightened them past the grid again */
    if(fr){ const k=0.13; r+=(fr.r-r)*k; g+=(fr.g-g)*k; b+=(fr.b-b)*k; }
    farSeaMat.color.setRGB(r,g,b);
    seaDeep.material.color.setRGB(r*0.82,g*0.82,b*0.86); }
  /* the sprite may be drawn pulled-in for the framed views — the sea's
     specular reads the sun's TRUE station, as the moon's glitter does */
  if(sun.userData.tx!==undefined) _sunW.set(sun.userData.tx,sun.userData.ty,sun.userData.tz);
  else sun.getWorldPosition(_sunW);
  u.uSunDir.value.copy(_sunW).normalize();
  /* the moon rules the water only when she is up and the sun is down, and she
     fades with her own setting as the sun's light comes back over her */
  moon.getWorldPosition(_moonW); u.uMoonDir.value.copy(_moonW).normalize();
  /* the water reads the moon's TRUE local brightness (userData.bright), not
     the sprite's drawn opacity — in the whole-earth views the sprite is
     forced full so the lights never vanish from over the disc, and that
     forcing must not put moon-glitter on a sea whose moon has set */
  const moonB=moon.userData.bright!==undefined?moon.userData.bright:moonMat2.opacity;
  u.uMoon.value=Math.max(0,1-dayF*1.5)*moonB*(1-storm*0.55);
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
/* ---- THE SHEET HAS NO EDGE ----
   The cloud planes are drawn with the fog off (fog at 1,140 would erase the
   whole sheet), so each one used to end in a razor-straight line a few
   degrees over the horizon — a permanent hard rule across the sky that SLID
   with the traveller. Each sheet now fades out over its own outer reach (a
   radial skirt in the shader, cut from the plane's own coordinates), so the
   clouds thin away into open sky and no rim is ever seen. */
function radialSkirt(mat,r0,r1){
  mat.onBeforeCompile=sh=>{
    sh.uniforms.uSkirt={value:new THREE.Vector2(r0,r1)};
    /* the falloff is reckoned PER FRAGMENT from the plane's own coordinates
       — the sheet is a single quad, so anything computed at its four corner
       vertices (all of them out past the skirt) would interpolate to
       nothing across the whole face of it */
    sh.vertexShader=sh.vertexShader
      .replace('#include <common>','#include <common>\nvarying vec2 vSkirtP;')
      .replace('#include <begin_vertex>','#include <begin_vertex>\nvSkirtP=position.xy;');
    sh.fragmentShader=sh.fragmentShader
      .replace('#include <common>','#include <common>\nuniform vec2 uSkirt;\nvarying vec2 vSkirtP;')
      .replace('#include <dithering_fragment>','#include <dithering_fragment>\ngl_FragColor.a*=1.0-smoothstep(uSkirt.x,uSkirt.y,length(vSkirtP));');
  };
  mat.customProgramCacheKey=()=>'radialSkirt';
}
const cloudMat=new THREE.MeshBasicMaterial({map:TEX.clouds,transparent:true,opacity:0.85,depthWrite:false,fog:false,side:THREE.DoubleSide});
radialSkirt(cloudMat,2500,4550);
TEX.clouds.repeat.set(7,7);
const clouds=new THREE.Mesh(new THREE.PlaneGeometry(9600,9600),cloudMat);
clouds.rotation.x=-Math.PI/2; clouds.position.y=CLOUD_Y; scene.add(clouds);
/* the high cirrus — a second, fainter, larger-scaled sheet above the first */
const cirrusMat=new THREE.MeshBasicMaterial({map:TEX.clouds,transparent:true,opacity:0.0,depthWrite:false,fog:false,side:THREE.DoubleSide});
radialSkirt(cirrusMat,3900,7100);
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
/* the three above-cloud sheets are drawn UNFOGGED: they are only ever shown
   to an eye above the cloud floor, where they are the far backdrop the open
   air looks out onto — fogged, they vanished with everything else and the
   middle heights read as a bare sheet of fog colour */
const cloudDeckMat=new THREE.MeshLambertMaterial({color:0xffffff,vertexColors:true,transparent:true,opacity:0,side:THREE.DoubleSide,fog:false});
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
const wispMat=new THREE.MeshBasicMaterial({map:makeWispTex(),transparent:true,opacity:0,depthWrite:false,fog:false,side:THREE.DoubleSide});
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
  new THREE.MeshBasicMaterial({map:coverTex,transparent:true,opacity:0,depthWrite:false,fog:false,side:THREE.DoubleSide}));
cloudCover.rotation.x=-Math.PI/2; cloudCover.position.y=CLOUD_Y-10; cloudCover.visible=false; scene.add(cloudCover);

/* the stars, circling the pole in the midst */
const starGroup=new THREE.Group(); scene.add(starGroup);
{ const pts=[]; for(let i=0;i<1400;i++){ const a=Math.random()*Math.PI*2, e=Math.acos(Math.random());
    const R2=R_WORLD*1.25; pts.push(R2*Math.sin(e)*Math.cos(a), Math.max(R_WORLD*0.02,R2*Math.cos(e)), R2*Math.sin(e)*Math.sin(a)); }
  const g=new THREE.BufferGeometry(); g.setAttribute('position',new THREE.Float32BufferAttribute(pts,3));
  const m=new THREE.PointsMaterial({color:0xdfe8ff,size:2.4,transparent:true,opacity:0,fog:false,sizeAttenuation:false});
  starGroup.add(new THREE.Points(g,m)); starGroup.userData.mat=m; }

/* ================= THE HOST OF THE SHAMAYIM, WITHOUT =================
   The stars above are set in the sky a man stands under: a half-dome of
   them, dimmed out by day, turning once with the sun. That is right for a
   SKY. It is not what is OUTSIDE. Beyond the firmament there is no day and
   no air — only the darkness, and the whole host standing in it about the
   earth, above and below and on every side, wheeling slowly about the height
   while the earth itself does not move. So the outer dark has its own host:
   a full sphere of them, carried with the eye so it can never be flown out
   of, each one keeping its own slow twinkle. */
const voidStars=(()=>{
  const N=1800, pos=new Float32Array(N*3), sz=new Float32Array(N), ph=new Float32Array(N), sp=new Float32Array(N);
  for(let i=0;i<N;i++){
    /* evenly over the whole sphere — cos(e) uniform, or they crowd the poles */
    const a=Math.random()*Math.PI*2, ce=Math.random()*2-1, se=Math.sqrt(1-ce*ce);
    pos[i*3]=se*Math.cos(a); pos[i*3+1]=ce; pos[i*3+2]=se*Math.sin(a);
    sz[i]=0.9+Math.random()*2.1; ph[i]=Math.random()*6.28; sp[i]=0.5+Math.random()*1.4; }
  const g=new THREE.BufferGeometry();
  g.setAttribute('position',new THREE.BufferAttribute(pos,3));
  g.setAttribute('aSize',new THREE.BufferAttribute(sz,1));
  g.setAttribute('aPhase',new THREE.BufferAttribute(ph,1));
  g.setAttribute('aSpd',new THREE.BufferAttribute(sp,1));
  const m=new THREE.ShaderMaterial({
    uniforms:{uTime:{value:0}, uOp:{value:0}, uPx:{value:Math.min(2,devicePixelRatio||1)}},
    transparent:true, depthWrite:false, fog:false,
    vertexShader:`
      attribute float aSize, aPhase, aSpd;
      uniform float uTime, uOp, uPx;
      varying float vA;
      void main(){
        gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0);
        vA=uOp*(0.35+0.5*abs(sin(uTime*aSpd+aPhase)));
        gl_PointSize=aSize*uPx;
      }`,
    fragmentShader:`
      varying float vA;
      void main(){ if(vA<0.01) discard; gl_FragColor=vec4(0.92,0.94,0.98,vA); }`});
  const p2=new THREE.Points(g,m); p2.frustumCulled=false; p2.visible=false;
  /* first of everything that is drawn with a blend: it is the BACKDROP. Left
     to the ordinary sorting it would be reckoned the nearest thing in the
     scene — its centre is the eye itself — and would come out on top of the
     charted earth, which lays down no depth of its own. */
  p2.renderOrder=-1; scene.add(p2);
  p2.userData.mat=m; return p2;
})();
/* carried with the eye, and set just within the far plane so that every
   thing that CAN be drawn is drawn in front of it */
function voidStarTick(op){
  const m=voidStars.userData.mat;
  voidStars.visible=op>0.004;
  if(!voidStars.visible) return;
  m.uniforms.uOp.value=op;
  m.uniforms.uTime.value=performance.now()*0.001;
  voidStars.position.copy(camera.position);
  voidStars.scale.setScalar(camera.far*0.93);
  voidStars.rotation.y=performance.now()*0.0000075;   /* one turn in a quarter hour */
}

/* the two great lights — square, as they ought to be */
const sunMat2=new THREE.SpriteMaterial({map:TEX.sun,fog:false,transparent:true,depthWrite:false});
const sun=new THREE.Sprite(sunMat2); sun.scale.set(R_WORLD*0.075,R_WORLD*0.075,1); scene.add(sun);
const moonMat2=new THREE.SpriteMaterial({map:TEX.moon,fog:false,transparent:true,depthWrite:false});
const moon=new THREE.Sprite(moonMat2); moon.scale.set(R_WORLD*0.055,R_WORLD*0.055,1); scene.add(moon);
const glowTexCv=(()=>{ const c=texCanvas(128); const g=c.getContext('2d');
  const gr=g.createRadialGradient(64,64,4,64,64,62);
  gr.addColorStop(0,'rgba(255,214,110,0.9)'); gr.addColorStop(1,'rgba(255,190,80,0)');
  g.fillStyle=gr; g.fillRect(0,0,128,128); return new THREE.CanvasTexture(c); })();

/* ---- THE HALOES OF THE TWO GREAT LIGHTS ----
   Seen from WITHIN the world the sun and moon are squares, as they ought to
   be. Beheld from without — the whole earth lying under its vault — a bare
   square pasted on the face of the deep reads as a fault in the drawing. So
   out there, and only out there, they are given the glow that stands about
   them. */
const sunHalo=new THREE.Sprite(new THREE.SpriteMaterial({map:glowTexCv,color:0xfff0b4,
  transparent:true,opacity:0,blending:THREE.AdditiveBlending,depthWrite:false,fog:false}));
sunHalo.visible=false; scene.add(sunHalo);
const moonHalo=new THREE.Sprite(new THREE.SpriteMaterial({map:glowTexCv,color:0xbcd0f0,
  transparent:true,opacity:0,blending:THREE.AdditiveBlending,depthWrite:false,fog:false}));
moonHalo.visible=false; scene.add(moonHalo);
/* ---- AND OUT THERE THEY ARE ROUND ----
   Within the world the two lights are SQUARES, and that is deliberate and
   right: it is this game's own signature and it is what a man standing on
   the disc sees. Beheld from without, with the whole earth lying under its
   vault, a hard-edged square reads as a fault in the drawing — and the glow
   set about it was not enough on its own, because the square is still a
   square inside it. (Measured: the sun 76 pixels across and the moon 54,
   thirty-four pixels apart, two hard tiles overlapping inside two soft
   glows — which is exactly what "extra lights floating around the sun and
   moon" looks like.)

   So each light has a SECOND face, round and soft-edged, drawn from the same
   pigments as its square one. The square fades out as the earth comes whole
   into view and the round face fades in with it; neither is ever drawn at
   full strength beside the other, and nothing pops. In the near world the
   round pair costs two invisible sprites and nothing else. */
TEX.sunRound = mkTex(g=>{ g.clearRect(0,0,64,64);
  const R=32, gr=g.createRadialGradient(R,R,0,R,R,R);
  gr.addColorStop(0,   C(PAL.lift(PB.sun.core,0.55)));
  gr.addColorStop(0.42,C(PB.sun.mid));
  gr.addColorStop(0.72,C(PB.sun.rim));
  gr.addColorStop(0.92,'rgba('+PB.sun.rim.join(',')+',0.55)');
  gr.addColorStop(1,   'rgba('+PB.sun.rim.join(',')+',0)');
  g.fillStyle=gr; g.beginPath(); g.arc(R,R,R,0,Math.PI*2); g.fill(); },64);
TEX.moonRound = mkTex(g=>{ g.clearRect(0,0,64,64);
  const R=32, gr=g.createRadialGradient(R*0.86,R*0.86,0,R,R,R);
  gr.addColorStop(0,   C(PAL.lift(PB.moon.mid,0.30)));
  gr.addColorStop(0.55,C(PB.moon.mid));
  gr.addColorStop(0.86,C(PB.moon.rim));
  gr.addColorStop(0.95,'rgba('+PB.moon.rim.join(',')+',0.5)');
  gr.addColorStop(1,   'rgba('+PB.moon.rim.join(',')+',0)');
  g.fillStyle=gr; g.beginPath(); g.arc(R,R,R,0,Math.PI*2); g.fill();
  /* the maria, kept soft so the moon is a body and not a coin */
  g.fillStyle='rgba('+PB.moon.mare.join(',')+',0.55)';
  for(const m of [[26,24,7],[38,40,5],[42,21,4]]){
    g.beginPath(); g.arc(m[0],m[1],m[2],0,Math.PI*2); g.fill(); } },64);
const sunRoundMat=new THREE.SpriteMaterial({map:TEX.sunRound,fog:false,transparent:true,
  opacity:0,depthWrite:false,blending:THREE.AdditiveBlending});
const sunRound=new THREE.Sprite(sunRoundMat); sunRound.visible=false; scene.add(sunRound);
const moonRoundMat=new THREE.SpriteMaterial({map:TEX.moonRound,fog:false,transparent:true,
  opacity:0,depthWrite:false});
const moonRound=new THREE.Sprite(moonRoundMat); moonRound.visible=false; scene.add(moonRound);
function haloTick(whole){
  const so=whole*0.9*sunMat2.opacity, mo=whole*0.55*moonMat2.opacity;
  sunHalo.material.opacity=so; moonHalo.material.opacity=mo;
  sunHalo.visible=so>0.01; moonHalo.visible=mo>0.01;
  /* the haloes keep their proportion to the discs they stand about — the
     discs themselves are resized against the eye in the framed views */
  if(sunHalo.visible){ sunHalo.position.copy(sun.position);
    const h=sun.scale.x*4.0; sunHalo.scale.set(h,h,1); }
  if(moonHalo.visible){ moonHalo.position.copy(moon.position);
    const h=moon.scale.x*3.45; moonHalo.scale.set(h,h,1); }
  /* the round face takes over from the square one as the earth is beheld
     whole — the two never both stand at full strength */
  const rf=Math.max(0,Math.min(1,(whole-0.10)/0.55));
  sunRoundMat.opacity=rf*sunMat2.opacity;
  moonRoundMat.opacity=rf*moonMat2.opacity;
  sunRound.visible=sunRoundMat.opacity>0.01;
  moonRound.visible=moonRoundMat.opacity>0.01;
  if(sunRound.visible){ sunRound.position.copy(sun.position);
    const h=sun.scale.x*1.28; sunRound.scale.set(h,h,1); }
  if(moonRound.visible){ moonRound.position.copy(moon.position);
    const h=moon.scale.x*1.22; moonRound.scale.set(h,h,1); }
  /* and the square face gives way, so no hard tile is left inside the glow */
  if(rf>0){ sunMat2.opacity*=(1-rf); moonMat2.opacity*=(1-rf); }
}

/* ================= COURSES OF THE LIGHTS ================= */
/* THE VOYAGE BEGINS AT TRUE COURSE. It opened at 'swift' — twelve hundred
   times the hour and better than twice the ship's way — so a traveller's
   first sight of the world was the sun tearing across it and the coast
   going by at a gallop. He sets out at the true reckoning now: an hour is
   an hour and the ship makes her own speed. The other courses are still
   there on the button for anyone in a hurry. */
const state={ simHours:9.5, speedIdx:0, dayIdx:0, paused:false,
  mode:'boat', boat:{x:0,z:0,heading:Math.PI*0.9,speed:0},
  walk:{x:0,z:0,heading:0}, deck:{lx:2.4,lz:-21,h:Math.PI},
  fly:{x:0,y:0,z:0,heading:0,vy:0,sp:0}, prevGround:'boat',
  dive:{x:0,y:0,z:0,heading:0,vy:0,sp:0},
  windMode:'true', firm:false, firmDist:0, camYaw:0, camPitch:0.42, camDist:96,
  camYawVel:0, camPitchVel:0,
  visited:new Set(), dist:0, fish:0, fishing:null, coins:30, cargo:{}, game:0,
  breath:1, immBreath:false, pearls:0, repel:false, net:null, rep:{},
  /* ---- FREE ROAM ----
     Some of what the rail offers is not sailing at all: rising bodily into
     the air, stopping the sun in the sky, running the course at five times
     true, choosing the hour, choosing the season. They are the powers of
     somebody LOOKING at the world rather than voyaging in it, and having
     them to hand makes the voyage itself no voyage.
     They belong to FREE ROAM, and are chosen at the menu. Set sail instead
     and the world keeps its own hours, its own seasons and its own weather,
     and the only way up is the mast. */
  freeroam:false };

/* ================= THE ONE ZOOM =================
   The zoom was two disconnected axes with a cliff between them: camDist ran
   14→240 and at the top SNAPPED into the firmament view's own firmDist — so
   one flick of the wheel jumped from over-the-shoulder to a drawn page, and
   the last third of the range did nothing at all, being clamped away per
   mode. It is ONE scalar now: state.zoom, 0 at the shoulder and 1 at the
   whole earth, with distance running exponentially along it so a notch of
   the wheel covers the same PROPORTION near and far. The camera only ever
   EASES toward it, so however fast the wheel is spun the view opens slowly.
   Nothing snaps; the firmament view is entered by its own button alone. */
const CAM_NEAR_D=14, CAM_FAR_D=R_WORLD*1.75, CAM_LN=Math.log(CAM_FAR_D/CAM_NEAR_D);
function zoomToDist(z){ return CAM_NEAR_D*Math.exp(CAM_LN*Math.max(0,Math.min(1,z))); }
function distToZoom(d){ return Math.min(1,Math.max(0,Math.log(Math.max(CAM_NEAR_D,d)/CAM_NEAR_D)/CAM_LN)); }
/* Drawn back this far, the streamed chunks of the world run out (they reach
   some 768 units, and the haze ends the view at 870), so from here the
   earth's own charted face — the TRUE outlines of the countries — is brought
   up beneath the eye and the world is seen whole. */
/* 2,048 pixels across 240,000 units is 117 units to a PIXEL: brought in at
   three thousand units out the charted face is a coloured smear. It waits
   until the eye is far enough back that a pixel of it is smaller than a
   pixel of the screen — and the coarse ring covers the ground between. */
/* ---- AND IT EASES, BUT IT DOES NOT COME EARLIER ----
   Bringing it forward to 0.42 was tried, to shorten the stretch of the
   pull-back that has nothing but the coarse ring in it. It is WRONG, and the
   note above says why: 2,048 pixels across 240,000 units is 117 units to a
   chart pixel, so drawn while the eye is still near, the charted face is not
   the outlines of the countries at all — it is a coloured smear laid over
   the ring, and the view is muddier than with the ring alone. It waits, as
   it did, until a pixel of it is smaller than a pixel of the screen.
   What IS changed is the shape of the fade: eased at both ends rather than
   ramped, because a linear ramp starts and stops with a visible corner and
   this is the one transition in the game the eye follows the whole way. */
const ZOOM_MAP0=0.56, ZOOM_MAP1=0.80;
function zoomMapFade(){
  const t=Math.max(0,Math.min(1,(state.zoom-ZOOM_MAP0)/(ZOOM_MAP1-ZOOM_MAP0)));
  return t*t*(3-2*t);
}
state.zoom=distToZoom(state.camDist);

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
/* the courses themselves live in js/sun-moon.js — the one file that is the
   whole law of the two great lights. These are the engine's thin hands. */
function dayOfYear(){ return SUNMOON.dayOfYear(state.simHours); }
/* ================= THE HOUR OF THE DAY, WHERE YOU STAND =================
   The clock showed the WORLD hour, which is nobody's hour. The sun makes
   one circuit of the disc a day, so a single world-clock reading is a
   different time of day in every country on it: 18:00 is dusk over Kenya
   and the dead of night over Peru. What a man wants to know is the hour
   HERE — with the sun overhead at noon and under his feet at midnight —
   so the longitude is taken out of it, exactly as the cutscene engine
   takes it out of a scene's requested hour. */
function playerXZ(){
  const m=state.mode;
  return m==='fly'?state.fly : m==='dive'?state.dive
       : m==='boat'||m==='deck'?state.boat : state.walk;
}
function localHourAt(x,z){
  const lonR=Math.atan2(x,z);
  return ((state.simHours+12*lonR/Math.PI)%24+24)%24;
}
/* and the other way about: set the world clock so that it is `h` o'clock
   HERE. This is what the real-world clock and the Time of Day option both
   speak through. */
/* ---- AND IT TAKES THE PLACE IT IS NOT GIVEN ----
   Called without a place, `Math.atan2(undefined,undefined)` is NaN, and the
   NaN goes into the world clock — and out of the world clock into the
   courses of the lights, the winds, the ship's way through the water and
   the very sound of the sea, all in one silent stroke. Where the caller
   names no place, the traveller's own is meant. */
function setLocalHour(h,x,z){
  if(!isFinite(x)||!isFinite(z)){ const p=playerXZ(); x=p.x; z=p.z; }
  const lonR=Math.atan2(x,z);
  const world=((h-12*lonR/Math.PI)%24+24)%24;
  if(!isFinite(world)) return;               /* an hour that is not a number sets nothing */
  state.simHours=Math.floor(state.simHours/24)*24+world;
}
/* ---- THE TIMES OF DAY ----
   Dawn about six, noon at twelve, dusk about six again, midnight at twelve:
   the plain round of the day. 'live' is not an hour at all — it is the
   clock of the machine the game is played on. */
const DAYPARTS=[
  {k:'live',    n:'live (your clock)'},
  {k:'morning', n:'morning',  h:8.0},
  {k:'noon',    n:'noon',     h:12.0},
  {k:'evening', n:'evening',  h:18.5},
  {k:'night',   n:'night',    h:23.5},
];
/* what to CALL the hour that it is — the round of the day as it is named:
   morning until noon, afternoon until the sun is down, evening, then night */
function dayPartName(h){
  if(h<5)  return 'night';
  if(h<7)  return 'dawn';
  if(h<12) return 'morning';
  if(h<13) return 'midday';
  if(h<17) return 'afternoon';
  if(h<19) return 'dusk';
  if(h<22) return 'evening';
  return 'night';
}
/* THE HOUR AS A MAN READS IT — twelve to the half, with A.M and P.M, and
   never a "00:" or a "23:" about it. Midnight is 12:00 A.M and noon is
   12:00 P.M, as they are on every clock face. */
function clockFace(h){
  const wh=Math.floor(h), mm=Math.floor((h%1)*60);
  const ap=wh<12?'A.M':'P.M';
  let hh=wh%12; if(hh===0) hh=12;
  return hh+':'+String(mm).padStart(2,'0')+' '+ap;
}
function sunUV(){ return SUNMOON.sunUV(state.simHours); }
function moonUV(){ return SUNMOON.moonUV(state.simHours); }
const _c1=new THREE.Color(), _c2=new THREE.Color(), _c3=new THREE.Color();
function mix3(hexA,hexB,hexC,t){ // 0=night .5=dusk 1=day
  if(t<0.5){ _c1.setHex(hexA); _c2.setHex(hexB); return _c3.copy(_c1).lerp(_c2,t*2); }
  _c1.setHex(hexB); _c2.setHex(hexC); return _c3.copy(_c1).lerp(_c2,(t-0.5)*2);
}
/* ================= THE HAZE OF THE COUNTRY =================
   One fog colour for the whole earth, taken straight off the sky, is
   Minecraft's answer and it is the wrong one: haze is not sky. It is what
   hangs in the air of THAT place — dust blown off a desert, moisture
   standing in a rain forest, ice-crystal over a polar plain, the pale burn
   of a limestone country at noon. world/palette.js names the colour of each;
   here is how much of it is taken.

   Three rules keep it honest. It is worked only against the ground the
   traveller is actually ON — out on the open sea the haze is the sea's own
   and the sky keeps it. It DIES WITH THE LIGHT, because a coloured haze at
   midnight is a lie; and it is put down in a storm, when what hangs in the
   air is the storm. And it is eased rather than set, so crossing from
   forest to plain is a slow turn of the whole horizon and not a switch.

   The sky itself takes a weaker dose of the same colour than the ground fog
   does — which is exactly how real haze reads, thickening down toward the
   horizon — and that keeps the join where the land meets the sky from
   showing as a seam. */
const _hazeC=new THREE.Color(0.62,0.77,0.91), _hazeT=new THREE.Color();
const HAZE_FOG=0.34, HAZE_SKY=0.15;
let _hazeK=0;                          /* how much country there is to take it from */
function gradeHaze(px,pz,dayF,storm){
  /* under the sea the water is the haze, and it has its own law */
  if(state.mode==='dive'||_eyeUnder){ _hazeK*=0.9; return; }
  const c=landAtWorld(px,pz);
  const hz=c&&PAL.haze[c.kind];
  /* the target: this country's own haze, or simply the sky where there is
     no country under the eye at all */
  if(hz) _hazeT.setRGB(hz[0]/255,hz[1]/255,hz[2]/255);
  else _hazeT.copy(scene.fog.color);
  _hazeC.lerp(_hazeT,0.055);           /* a slow turn of the horizon, never a switch */
  const wantK=hz?1:0;
  _hazeK+=(wantK-_hazeK)*0.055;
  /* the strength: full in the middle of the day, gone by night, and put
     down in foul weather when the storm owns the air */
  const k=_hazeK*Math.max(0,dayF*1.15-0.15)*(1-storm*0.85);
  if(k<=0.002) return;
  scene.fog.color.lerp(_hazeC,HAZE_FOG*k);
  scene.background.lerp(_hazeC,HAZE_SKY*k);
}
function skyTick(px,pz){
  /* ---- THE TWO GREAT LIGHTS, WHERE THEY TRULY ARE ----
     js/sun-moon.js is the whole law: each light's own circuit over the
     disc, its height in THIS traveller's sky, and how bright it burns.
     The sun no longer hangs clamped a quarter up the sky and fades like a
     lamp — as its road carries it off toward other countries the
     traveller watches it come down, touch the horizon and slip visibly
     under, at exactly the distance where its daylight gives out. */
  const S=SUNMOON.place(state.simHours,px,pz,R_WORLD,'sun');
  const dayF=SUNMOON.dayF(S.dUV);
  let sky=mix3(0x0a1024,0xe58a4a,0x9fc5e8,dayF).getHex();
  const st=stormAt(px,pz);
  if(st>0.01){ _c1.setHex(sky); _c2.setHex(0x4c545e); sky=_c1.lerp(_c2,st*0.75).getHex(); }
  scene.background.setHex(sky);
  if(scene.fog){ scene.fog.color.setHex(sky); /* fog is detached in the firmament view */
    scene.fog.near=FOG_NEAR*(1-st*0.55); scene.fog.far=FOG_FAR-st*260;
    gradeHaze(px,pz,dayF,st); }
  const l=mix3(0x38405e,0xd9a878,0xffffff,dayF);
  const dim=1-st*0.38;
  setBlockLight(l.r*dim,l.g*dim,l.b*dim);
  setIceLight(l.r*dim,l.g*dim,l.b*dim);
  hemi.intensity=0.35+dayF*0.6; dirL.intensity=0.15+dayF*0.45;
  cloudMat.opacity=0.35+dayF*0.5;
  starGroup.userData.mat.opacity=Math.max(0,1-dayF*1.6)*0.95;
  starGroup.rotation.y=-(state.simHours/24)*2*Math.PI;
  sun.position.set(S.x,S.y,S.z);
  sun.userData.tx=S.x; sun.userData.ty=S.y; sun.userData.tz=S.z;   /* the true station, for the water */
  sunMat2.opacity=S.bright; sun.userData.bright=S.bright;
  const M=SUNMOON.place(state.simHours,px,pz,R_WORLD,'moon');
  moon.position.set(M.x,M.y,M.z);
  moonMat2.opacity=M.bright; moon.userData.bright=M.bright;
  /* and the LIGHT UPON THE LAND falls from where the ruling light truly
     stands — the long shadows of evening lie away from the sunset, and by
     night the land is lit from the moon's quarter */
  if(dayF>0.06) dirL.position.set(S.x-px,Math.max(S.y,R_WORLD*0.03),S.z-pz).normalize();
  else if(M.bright>0.05) dirL.position.set(M.x-px,Math.max(M.y,R_WORLD*0.03),M.z-pz).normalize();
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
const SHIP_S=2.0, SHIP_SX=SHIP_S*1.85;
const SD={ deckY:DECK_Y*SHIP_S, qdeckY:QDECK_Y*SHIP_S, fdeckY:FDECK_Y*SHIP_S,
  fdeckZ:FDECK_Z*SHIP_S, qdeckZ:QDECK_Z*SHIP_S, helmZ:HELM.z*SHIP_S, wheelZ:WHEEL_Z*SHIP_S };
const HOLD={halfX:2.9*SHIP_SX, z0:-19*SHIP_S, z1:23*SHIP_S, y:0.55*SHIP_S};
const HATCH={x:0, z:4.6*SHIP_S, r:3.8*SHIP_S};
const boatG=new THREE.Group();
/* YXZ: yaw first, then pitch/roll IN THE HEADING FRAME — with the default XYZ
   order the wave-pitch was applied about the WORLD x-axis, so the ship leaned
   the wrong way on every heading but due north */
boatG.rotation.order='YXZ';
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
    const sc=0.62, h=hullG.clone(); h.scale.set(SHIP_SX*sc,SHIP_S*sc,SHIP_S*sc); g.add(h);
    /* ---- NO GHOST SHIPS, AND NO SHIP SAILING HERSELF ----
       A living crew works her deck: a watch at the bow, hands in the waist —
       and A MAN AT THE WHEEL. The master used to stand off to one side of the
       helm with his back to the bow, so every merchantman on the sea was
       steering herself while her master looked astern. He stands AT the wheel
       now, exactly where the traveller stands at his own, facing the bow with
       both hands upon it, and he works it as she comes round. */
    const posts=[
      {lx:HELM.x, lz:HELM.z, ry:0, helm:true},          /* the helmsman */
      {lx:0,lz:20*SHIP_S,ry:0},                          /* the watch at the bow */
      {lx:3.4*SHIP_SX,lz:7*SHIP_S,ry:Math.PI*0.55},
      {lx:-3.8*SHIP_SX,lz:-4*SHIP_S,ry:-Math.PI*0.4}];
    const crew=[];
    for(let i=0;i<posts.length;i++){ const p=posts[i];
      const m=makePerson(7300+k*57+i*13,'sailor',false,i===3);
      m.scale.setScalar(0.85);
      /* the helmsman stands on the quarterdeck, not on the waist planks */
      const py=p.helm?QDECK_Y:deckHeightAt(p.lz);
      m.position.set(p.lx*sc,py*sc,p.lz*sc);
      m.rotation.y=p.ry; m.userData.baseRy=p.ry; m.userData.helm=!!p.helm;
      /* both hands out upon the wheel, as the traveller's are */
      if(p.helm&&m.userData.armL){ m.userData.armL.rotation.x=-1.15; m.userData.armR.rotation.x=-1.15; }
      g.add(m); crew.push(m); }
    g.visible=false; scene.add(g);
    TRADERS.push({g,crew,x:0,z:0,h:0,sp:18+k*7,set:false}); } }
function traderTick(px,pz,dt){ initTraders();
  /* a flyer's air is open to ~3,400 — a merchantman must be born beyond his
     sight as she is beyond the sailor's, so both ring and reap widen with
     the wings (frame._flyAir is the eased openness of the flyer's fog) */
  const flyOpen=(typeof frame!=='undefined'&&frame._flyAir>0.1);
  for(const T of TRADERS){
    if(!T.set||Math.hypot(T.x-px,T.z-pz)>(flyOpen?5600:4200)){
      const a=Math.random()*6.28, r=(flyOpen?3600:1400)+Math.random()*1800;
      const x=px+Math.cos(a)*r, z=pz+Math.sin(a)*r;
      if(landAtWorld(x,z)||Math.hypot(x,z)/R_WORLD>0.93){ T.g.visible=false; T.set=false; continue; }
      T.x=x; T.z=z; T.h=Math.random()*6.28; T.set=true; T.g.visible=true; }
    if(T.halt&&T.halt>0){ T.halt-=dt; }                                   /* hove to for the trading */
    else {
      const ax=T.x+Math.sin(T.h)*140, az=T.z+Math.cos(T.h)*140;
      if(landAtWorld(ax,az)||Math.hypot(ax,az)/R_WORLD>0.93) T.h+=dt*0.8; /* bear away from the shoals */
      /* and a merchantman gives way to the traveller's ship as she gives way
         to a shoal — she does not sail through him */
      else if(Math.hypot(ax-state.boat.x,az-state.boat.z)<170) T.h+=dt*0.8;
      T.x+=Math.sin(T.h)*T.sp*dt; T.z+=Math.cos(T.h)*T.sp*dt;
    }
    /* THE HELMSMAN WORKS HER ROUND. His hands stay on the wheel and he leans
       into the turn as she answers it, so the ship is plainly being STEERED
       and not merely drifting on her course. */
    { const turn=(T.h-(T.lastH===undefined?T.h:T.lastH));
      let d=turn; while(d>Math.PI)d-=6.2832; while(d<-Math.PI)d+=6.2832;
      T.wheelLean=(T.wheelLean||0)+((d/Math.max(dt,0.0001))*0.55-(T.wheelLean||0))*Math.min(1,dt*3);
      T.lastH=T.h;
      const lean=Math.max(-0.5,Math.min(0.5,T.wheelLean||0));
      for(const m of T.crew){ if(!m.userData.helm) continue;
        m.rotation.y=m.userData.baseRy+lean*0.7;
        if(m.userData.armL){
          m.userData.armL.rotation.x=-1.15; m.userData.armR.rotation.x=-1.15;
          m.userData.armL.rotation.z= 0.18+lean; m.userData.armR.rotation.z=-0.18+lean; } } }
    const hd=seaHeight(T.x,T.z);
    T.g.position.set(T.x,WATER_Y-1.4+hd*0.6,T.z);
    T.g.rotation.y=T.h; T.g.rotation.z=Math.sin(performance.now()*0.0009+T.x*0.01)*0.04;
    /* hailed and hove to, her crew turn to the rail — and the bow watch waves */
    if(T.crew&&T.crew.length>1){
      /* crew[0] has the wheel; it is the BOW WATCH (crew[1]) who waves */
      const w0=T.crew[1].userData;
      if(T.halt&&T.halt>0){
        const ang=Math.atan2(state.boat.x-T.x,state.boat.z-T.z)-T.h;
        for(const m of T.crew) m.rotation.y=ang;
        w0.armR.rotation.x=-2.7; w0.armR.rotation.z=Math.sin(performance.now()*0.008)*0.5;
      } else {
        /* every hand back to his post — but the helmsman keeps his wheel, and
           his own lean with it, or he would be squared up and let go of it */
        for(const m of T.crew){ if(!m.userData.helm) m.rotation.y=m.userData.baseRy; }
        w0.armR.rotation.x=0; w0.armR.rotation.z=0;
      }
    }
  } }
function hideTraders(){ for(const T of TRADERS){ T.g.visible=false; T.set=false; } }
/* ================= THE TRAWL NET =================
   Cast astern (N or the button), trawl slow and steady — best over
   shoaling water — and the sea fills the mesh. Haul it, and the catch
   joins the fish tally. She drags: the ship loses a quarter of her way. */
let netG=null;
function ensureNet(){ if(netG) return;
  netG=new THREE.Group();
  for(const s of [1,-1]){ const rope=lbox(0.5,0.5,26,0x6a5a3a);
    rope.position.set(s*5,8,-72); rope.rotation.x=0.42; netG.add(rope); }
  const bagM=new THREE.MeshLambertMaterial({color:0x38424e});
  const bag=new THREE.Mesh(new THREE.BoxGeometry(11,5,14),bagM); bag.position.set(0,-1.2,-88); netG.add(bag);
  const bag2=new THREE.Mesh(new THREE.BoxGeometry(7,3.6,8),bagM); bag2.position.set(0,-0.6,-99); netG.add(bag2);
  netG.userData={bag,bag2};
  netG.visible=false; boatG.add(netG); }
function toggleNet(){
  if(state.firm) return;                     /* not from behind the map view */
  if(state.mode!=='boat'&&state.mode!=='deck'){ toast('The net is worked from the ship — take the deck or the helm.'); return; }
  if(!state.net){ ensureNet(); netG.visible=true; state.net={catch:0,t:0};
    $('b-net').textContent='🕸 Haul the net';
    toast('You cast the net astern — trawl slow and steady over shoaling water, and the sea will fill it.'); }
  else { const c=state.net.catch; state.fish=(state.fish||0)+c;
    if(netG) netG.visible=false; state.net=null; $('b-net').textContent='🕸 Cast the net';
    toast(c?('You haul the net — '+c+' fish glisten in the mesh. Fish in the log: '+state.fish+'.')
      :'You haul the net empty — trawl slower, and where the water shoals.');
    saveState(); }
}
function netTick(dt){ if(!state.net) return;
  const sp=Math.abs(state.boat.speed);
  if(sp>2&&sp<34){
    const sh=shoalAt(state.boat.x,state.boat.z);
    if(state.net.gT===undefined||state.net.gT<=0){ state.net.gf=groundFactor(state.boat.x,state.boat.z); state.net.gT=2.5; }
    state.net.gT-=dt;
    state.net.t+=dt*(sh>0.08?1.35:1)*(1+(state.net.gf||0)*2.2);   /* the shoals give more; the grounds give thrice */
    if(state.net.t>=11){ state.net.t=0;
      if(state.net.catch<12){ state.net.catch++;
        if(state.net.catch===12) toast('The net strains at its ropes, full to bursting — haul it in!'); } } }
  if(netG&&netG.visible){ const t2=performance.now()*0.001, u=netG.userData;
    u.bag.position.y=-1.2+Math.sin(t2*1.3)*0.7; u.bag2.position.y=-0.6+Math.sin(t2*1.5+1)*0.8; }
}
/* ================= WHALE SONG \u2014 THE ROAD TO THE FISHING GROUNDS ==========
   Teeming grounds lie scattered over the deep, unmarked on any chart. The
   whale pods know them: they swim toward the nearest ground and circle over
   it, singing \u2014 follow the song, and trawl where they gather (the net
   fills three times as fast over a ground). */
const GROUND_CS=2600;
function groundCenter(gi,gj){ return [gi*GROUND_CS+(hash2(gi*3.1,gj*5.7)-0.5)*800, gj*GROUND_CS+(hash2(gj*5.3,gi*2.9)-0.5)*800]; }
function isGround(gi,gj){ if(hash2(gi*1.3,gj*7.7)<=0.84) return false;
  const c=groundCenter(gi,gj);
  return !landAtWorld(c[0],c[1])&&Math.hypot(c[0],c[1])/R_WORLD<0.9; }
function nearestGround(x,z){ const ci=Math.round(x/GROUND_CS), cj=Math.round(z/GROUND_CS);
  let best=null,bd=1e9;
  for(let di=-3;di<=3;di++)for(let dj=-3;dj<=3;dj++){ const gi=ci+di,gj=cj+dj;
    if(!isGround(gi,gj)) continue; const c=groundCenter(gi,gj);
    const d=Math.hypot(c[0]-x,c[1]-z); if(d<bd){bd=d;best={x:c[0],z:c[1],d};} }
  return best; }
function groundFactor(x,z){ const g=nearestGround(x,z); if(!g) return 0;
  return Math.max(0,1-g.d/420); }
const POD=[]; let podState=null, songT=-99;
/* THE POD IS A FAMILY, not three of a size: a cow, her yearling and a calf,
   and a bull orca running with them. The scale here is a beast's AGE — 1 is
   full grown, and every beast's grown size is the metres in its own file. */
const POD_KINDS=[['whale',1.0],['whale',0.78],['whale',0.52]];
const POD_LEN=[];      /* how long each of them truly is, in world units */
function initPod(){ if(POD.length) return;
  for(const [kind,age] of POD_KINDS){ const m=makeBeast(kind);
    m.scale.setScalar(age); m.visible=false; scene.add(m); POD.push(m);
    POD_LEN.push(beastUnits(kind)*age); } }
/* ================= THE KILLER WHALES KEEP THEIR OWN =================
   A bull orca swam in the whale pod — a fourth member of the humpback family,
   riding at her flank and blowing with her. He is not one of them: an orca is
   a hunter of whales, and the calf she is escorting is what he came for.
   The killer whales run their OWN matriline now — an old cow, her bull, two
   juveniles and a calf — and they run it out in the DEEP, off the fishing
   grounds the humpbacks make for, on their own hunting course. They are
   RARELY SEEN: a pod is only set out at all where the water is a kilometre
   deep or more, and then only about one time in seven that the sea is
   re-seeded, so a voyage may cross an ocean and never meet one. */
const ORCA_KINDS=[['orca',1.0],['orca',0.88],['orca',0.66],['orca',0.62],['orca',0.42]];
const ORCA=[], ORCA_LEN=[]; let orcaState=null, orcaSeenT=-99;
const ORCA_DEEP_M=1000;     /* no killer whale is set out over shallower water */
const ORCA_CHANCE=0.14;     /* and only this often, where the water will bear them */
function initOrca(){ if(ORCA.length) return;
  for(const [kind,age] of ORCA_KINDS){ const m=makeBeast(kind);
    m.scale.setScalar(age); m.visible=false; scene.add(m); ORCA.push(m);
    ORCA_LEN.push(beastUnits(kind)*age); } }
function whaleSong(){ if(!AC||!audioOn) return;
  try{ for(let k=0;k<2;k++){
      const o=AC.createOscillator(), g2=AC.createGain();
      o.type='sine'; const t0=AC.currentTime+k*1.5;
      o.frequency.setValueAtTime(150-k*35,t0);
      o.frequency.exponentialRampToValueAtTime(58,t0+2.3);
      g2.gain.setValueAtTime(0,t0); g2.gain.linearRampToValueAtTime(0.09,t0+0.6);
      g2.gain.linearRampToValueAtTime(0,t0+2.6);
      o.connect(g2); g2.connect(AC.destination); o.start(t0); o.stop(t0+2.7); } }catch(e){}
}
function podTick(px,pz,dt,t){
  initPod();
  if(!podState||Math.hypot(podState.x-px,podState.z-pz)>Math.max(2800,(scene.fog?scene.fog.far:1140)*1.2)){
    /* the pod surfaces beyond the haze (1,250+; fog shuts at 1,140) and
       swims IN — three whales materialising 500 units off the rail, in
       clear air, was the sharpest pop on the whole sea. Under a flyer's
       OPENED air the ring rides the fog's own reach, so whales never
       appear inside his clear view either. */
    const ffP=scene.fog?scene.fog.far:1140;
    const a=Math.random()*6.28, r=Math.min(2600,Math.max(1250,ffP*1.02))+Math.random()*800;
    const x=px+Math.cos(a)*r, z=pz+Math.sin(a)*r;
    if(landAtWorld(x,z)){ for(const m of POD) m.visible=false; return; }
    podState={x,z,dir:0,arrived:false,g:null,gT:0};
  }
  podState.gT-=dt;
  if(podState.gT<=0){ podState.g=nearestGround(podState.x,podState.z); podState.gT=3; }
  const g=podState.g;
  if(g){ const dx=g.x-podState.x, dz=g.z-podState.z, dd=Math.hypot(dx,dz)||1;
    /* when the ship draws near, the pod runs before her at trawling pace */
    const podSp=Math.hypot(podState.x-px,podState.z-pz)<380?32:16;
    if(dd>160){ podState.dir=Math.atan2(dx,dz); podState.arrived=false;
      const nx2=podState.x+dx/dd*podSp*dt, nz2=podState.z+dz/dd*podSp*dt;
      if(!landAtWorld(nx2,nz2)){ podState.x=nx2; podState.z=nz2; }
      else { podState.x+=dz/dd*podSp*dt; podState.z-=dx/dd*podSp*dt; } }   /* slide along the coast */
    else { podState.arrived=true; podState.dir+=dt*0.22;
      podState.x=g.x+Math.sin(podState.dir)*120; podState.z=g.z+Math.cos(podState.dir)*120; } }
  swimPod(POD,POD_LEN,podState,t,dt,0.5,1.0);
  const dNear=Math.hypot(podState.x-px,podState.z-pz);
  if(dNear<430&&t-songT>26){ songT=t; whaleSong();
    if(podState.arrived) toast('The whales sing over teeming waters \u2014 cast the net here, and it will fill.');
    else toast('Whale-song sounds through the hull \u2014 follow the pod, and it will lead you to teeming waters.'); }
}
/* THE POD SPREADS TO ITS OWN STATURE. They swam twenty units apart, which
   was room enough while a whale was seven metres long; grown to sixteen she
   is ninety-six units of beast, and the family swam THROUGH one another.
   They keep a length and a half between them now, whatever that length is,
   so changing `metres` in a creature file spreads its pod to match.
   `beat` is how fast they roll up to blow, `spout` how freely they throw
   water — a killer whale is a quicker, tighter thing than a humpback. */
function swimPod(arr,lens,P,t,dt,beat,spout){
  for(let k=0;k<arr.length;k++){ const m=arr[k], len=lens[k]||60;
    const off=k*2.1, lane=len*1.5;
    const wx=P.x+Math.sin(t*0.13+off)*40+k*lane*0.55;
    const wz=P.z+Math.cos(t*0.11+off)*40-k*lane*0.45;
    if(landAtWorld(wx,wz)){ m.visible=false; continue; }   /* nothing spouts upon the dry land */
    /* and the whole LENGTH of her stays off it: a whale is half a ship long,
       and with only her middle tested her head lay through the coast rock */
    { const nose=len*0.55;
      if(landAtWorld(wx+Math.sin(P.dir)*nose,wz+Math.cos(P.dir)*nose)
       ||landAtWorld(wx-Math.sin(P.dir)*nose,wz-Math.cos(P.dir)*nose)
       ||SEA_SURF-seabedDepth(wx,wz)<len*0.25){ m.visible=false; continue; } }
    const arc=Math.sin(t*beat+off*1.7);
    /* she rides with her back awash and rolls up to blow — both measured off
       her own girth, so a calf does not breach like a bull */
    const draft=len*0.10;
    m.position.set(wx, WATER_Y-draft+Math.max(0,arc)*draft*0.75, wz);
    m.rotation.y=P.dir+Math.sin(t*0.2+off)*0.4; m.rotation.x=-arc*0.22;
    m.visible=true;
    if(arc>0.965&&Math.random()<dt*5*spout) splash(wx,WATER_Y+2.5,wz,true);   /* the spout */
  }
}
/* ---- AND THE KILLER WHALES RUN THE DEEP ----
   They make for no fishing ground: they hold a long straight hunting course
   out over the abyss, and turn only for the land. */
function orcaTick(px,pz,dt,t){
  initOrca();
  if(!orcaState||Math.hypot(orcaState.x-px,orcaState.z-pz)>Math.max(3200,(scene.fog?scene.fog.far:1140)*1.25)){
    const a=Math.random()*6.28,
      r=Math.min(2600,Math.max(1250,(scene.fog?scene.fog.far:1140)*1.02))+Math.random()*800;   /* past the haze, as the humpbacks are */
    const x=px+Math.cos(a)*r, z=pz+Math.sin(a)*r;
    /* deep water, and seldom even then */
    if(landAtWorld(x,z)||Math.random()>ORCA_CHANCE||seabedMetres(x,z)<ORCA_DEEP_M){
      for(const m of ORCA) m.visible=false; orcaState=null; return; }
    orcaState={x,z,dir:Math.random()*6.28};
  }
  /* the hunting course: long and straight, with a slow wander on it */
  orcaState.dir+=Math.sin(t*0.07)*0.12*dt;
  const sp=26;
  const nx=orcaState.x+Math.sin(orcaState.dir)*sp*dt, nz=orcaState.z+Math.cos(orcaState.dir)*sp*dt;
  if(!landAtWorld(nx,nz)&&seabedMetres(nx,nz)>ORCA_DEEP_M*0.6){ orcaState.x=nx; orcaState.z=nz; }
  else orcaState.dir+=2.2;                      /* the shoal turns them back to the deep */
  swimPod(ORCA,ORCA_LEN,orcaState,t,dt,0.85,0.5);
  const dNear=Math.hypot(orcaState.x-px,orcaState.z-pz);
  if(dNear<420&&t-orcaSeenT>90){ orcaSeenT=t;
    toast('Black fins cut the swell far out — a school of killer whales, running the deep on their own road.'); }
}
function hideOrca(){ for(const m of ORCA) m.visible=false; }
function hidePod(){ for(const m of POD) m.visible=false; }

/* ================= THE TRAVELLER (steve-fashion) ================= */
function lam(col){ return new THREE.MeshLambertMaterial({color:col}); }
function lbox(w,h,d,col){ return new THREE.Mesh(new THREE.BoxGeometry(w,h,d),lam(col)); }
/* ---- AND WHAT IS TAKEN OUT OF THE WORLD IS GIVEN BACK ----
   Taking a thing out of the scene does not free it. Its geometry and its
   materials belong to the CARD, uploaded there, and they are held until they
   are told to let go. And every beast, bird, nest and young thing in this
   world is built fresh out of lbox — a new BoxGeometry AND a new material
   for every limb of it — while the slots re-home continually as the
   traveller moves. So what was merely removed piled up, unseen, for the
   whole of a voyage: four thousand geometries at the outset and sixty-one
   thousand after two dozen landfalls, with the scene itself no bigger than
   it began. That is a world that grows heavier the longer it is played in.

   The TEXTURES are not ours to free. Every one of these things wraps a
   texture the whole world shares — the wool of the flocks, the one glow
   behind every lamp and pearl and firefly in the earth — in a material of
   its own. The material is ours to give back; the map beneath it is not,
   and disposing that would strip the world bare. Nor are the terrain and
   billboard materials ours: those tables are held out of the way. */
let _shMats=null, _shN=-1;
function sharedMats(){
  const n=Object.keys(MAT).length+Object.keys(ENTMAT).length;
  if(_shMats&&_shN===n) return _shMats;      /* rebuilt only when a new one is registered */
  _shN=n; _shMats=new Set(Object.values(MAT).concat(Object.values(ENTMAT)));
  return _shMats;
}
function freeTree(o){
  if(!o) return;
  const keep=sharedMats();
  o.traverse(n=>{
    if(n.geometry) n.geometry.dispose();
    const m=n.material; if(!m) return;
    for(const mm of (Array.isArray(m)?m:[m])) if(mm&&!keep.has(mm)) mm.dispose();
  });
}

/* ================= THE LIVING THINGS, ONE TO A FILE =================
   Every beast has its own file in creatures/, and declares there the one
   number that matters — its TRUE ADULT LENGTH IN METRES. The model itself may
   be built at any convenient size: this measures what the file made and scales
   the whole of it so the beast really is as long as it says.
   That is what fixes the whales. They were drawn to look right beside a fish
   and came out at six metres, a third of a humpback and a quarter of a blue —
   the greatest thing that has ever lived, no longer than a rowing boat. Now
   the file says 16 and the beast IS 16, and nothing in the model has to be
   kept in proportion with anything else by hand. */
/* The world is built at six units to the metre — a block is a metre, and the
   traveller stands about two of them, as he does in minecraft. */
const U_PER_M=6;
const BEASTS=(window.EARTH&&window.EARTH.beastList)||[];
const BEAST_BY_NAME={}; for(const b of BEASTS) BEAST_BY_NAME[b.name]=b;
/* the toolkit the creature files build with, so they need no imports */
const BEAST_KIT={
  THREE,
  group:()=>new THREE.Group(),
  box:lbox,
  faces:(w,h,d,mats)=>new THREE.Mesh(new THREE.BoxGeometry(w,h,d),mats),
  mat:t=>new THREE.MeshLambertMaterial({map:t}),
  matc:c=>lam(c),
  glass:(c,o)=>new THREE.MeshLambertMaterial({color:c,transparent:true,opacity:o===undefined?0.7:o}),
  tex:mkTex, speckle, jit, px:P, rgb, hash:hash2,
  /* FOUR LEGS UNDER A BODY — every beast of the field wants them, and every
     one of them wants the same thing: the pivot at the HIP (so the leg swings
     from the shoulder and not from the hoof), and to be enrolled on
     userData.legs, which is what the engine walks. x/z are how far out from
     the middle they stand, h how long they are, t how thick. */
  legs4:function(g,x,z,h,col,t){ t=t||0.9; const out=[];
    /* ---- AND EVERY LEG HAS A KNEE NOW ----
       A leg was one stiff box swung from the hip, so every beast on the
       earth walked like a toy soldier. It is TWO bones now: the thigh
       swings from the hip as before, and the shin hangs from a true knee
       joint at the bottom of it (userData.knee), which the engine folds
       as the leg swings — set it and the beast picks its feet up. */
    for(const sx of [1,-1]) for(const sz of [1,-1]){
      const L=lbox(t,h*0.55,t,col); L.geometry.translate(0,-h*0.275,0);
      L.position.set(sx*x,h,sz*z); L.userData.ph=(sx*sz>0)?0:Math.PI;
      /* AND EVERY FOOT KNOWS WHICH FOOT IT IS — near fore 0, off fore 1,
         near hind 2, off hind 3. The gait law is nothing but four numbers
         against these four names. (The head is built toward +z in every
         creature file, so +z is the fore.) */
      L.userData.foot=(sx>0?0:1)+(sz>0?0:2);
      const S=lbox(t*0.88,h*0.5,t*0.88,col); S.geometry.translate(0,-h*0.25,0);
      S.position.set(0,-h*0.53,0); L.add(S); L.userData.knee=S;
      g.add(L); out.push(L); }
    const u=g.userData||(g.userData={});
    u.legs=(u.legs||[]).concat(out); return out; }
};
/* ---- THE FOLDING OF THE JOINTS ----
   One rule for every knee and every elbow in the world: the shin folds up
   behind as the leg is swept back (the foot is picked up instead of mown
   through the ground), and the forearm bends in as the arm swings forward.
   Any limb that carries userData.knee or userData.elbow — beast, villager
   or the traveller himself — is folded by this and nothing else. */
function jointTick(L,moving,knee){
  const u2=L.userData; if(!u2) return;
  /* `knee` is the fold the GAIT LAW asks for (js/gait.js), in radians. Where
     it is given it wins: a foot in the swing picks itself up over the ground
     it is crossing, which a fold read back off the hip angle can never do —
     that one always folded hardest at the END of the sweep, when the foot is
     planted, which is precisely backwards. Where it is not given, the old
     rule stands, and every biped in the world keeps its own walk. */
  if(u2.knee)  u2.knee.rotation.x = knee!==undefined ? knee
    : (moving? Math.min(1.15,0.10+Math.max(0,L.rotation.x)*1.1) : 0.05);
  if(u2.elbow) u2.elbow.rotation.x= moving? -Math.min(0.85,0.16+Math.max(0,-L.rotation.x)*0.5) : -0.14;
}
/* ================= THE GOING OF A BEAST =================
   js/gait.js is the whole law of the footfall; this is the engine's one
   hand on it. Hand it a body, how fast that body is going and how long it
   is, and every leg under it is set for this frame — walking, pacing,
   trotting, cantering, galloping or bounding, chosen by SPEED IN ITS OWN
   BODY LENGTHS, which is how a real creature chooses. Nothing here names
   a single species, and nothing in gait.js knows what a beast is.

   A body of fewer or more than four legs is left exactly as it was: the
   folk on the deck, the villagers in the street and the fowl of the air
   keep the walk they have always had. */
/* a beast's own length never changes, and it is asked once a frame for every
   beast on the ground — so it is looked up once and remembered */
const _bodyLen=new Map();
function bodyLenOf(kind){ let v=_bodyLen.get(kind);
  if(v===undefined){ v=Math.max(2,beastUnits(kind)||12); _bodyLen.set(kind,v); }
  return v; }
function tickGait(ent,kind,spd,dt,amp0){
  const legs=ent.m&&ent.m.userData&&ent.m.userData.legs;
  if(!legs||legs.length!==4||!window.GAIT||legs[0].userData.foot===undefined) return null;
  const len=bodyLenOf(kind);
  const bl=Math.max(0,spd)/len;                    /* body lengths a second */
  if(bl<0.035){ for(const L of legs){ L.rotation.x=0; jointTick(L,false); } ent.gph=0; return null; }
  const B2=window.BEHAVIOR;
  const g=GAIT.pick(bl, !!(B2&&B2.pacesOf&&B2.pacesOf(kind)),
                        !!(B2&&B2.gaitOf&&B2.gaitOf(kind)==='hop'));
  ent.gph=((ent.gph||0)+GAIT.stridesPerSec(bl,g)*dt)%1;
  const amp=(amp0||0.34)+Math.min(0.40,bl*0.15);
  for(const L of legs){
    const sw=GAIT.legSwing(g,L.userData.foot,ent.gph,amp);
    L.rotation.x=sw.hip; jointTick(L,true,sw.knee); }
  return { gait:g, phase:ent.gph, len,
           rise:GAIT.bodyRise(g,ent.gph)*len*0.42,     /* the withers rise and fall with it */
           roll:GAIT.bodyRoll(g,ent.gph) };            /* and a pacing beast rolls like a ship */
}
/* ---- AND HOW BIG A BEAST IS DRAWN ----
   ONE SCALE, AND IT IS THE MAN'S. There were two: the beasts of the sea were
   built true, at six units to the metre, and the beasts of the field at HALF
   — not by anybody's decision about how big a cow ought to be, but because
   the world's first cattle were built by hand at about half life-size, and
   when eighty new beasts were added they were held down to match. So the
   whole bestiary was in proportion with ITSELF and out of proportion with
   the man standing in the middle of it, and a lion came up to his knee.
   Every creature is built to js/size.js now — the one table of true adult
   sizes — and every one of them at U_PER_M. A model is MEASURED and scaled
   to fit whatever it happened to be drawn at, so no model's own numbers ever
   have to be in proportion with anything. */
function trueMetres(name,spec){
  const m=(window.SIZE&&SIZE.of(name))||0;
  return m||(spec?spec.metres:0);
}
function trueAxis(name,spec){
  if(window.SIZE&&SIZE.metres[name]) return SIZE.axisOf(name);
  return (spec&&spec.axis)||'z';
}
/* how long the built model runs along the axis its file measures it by */
const _bBox=new THREE.Box3(), _bSize=new THREE.Vector3();
function beastSpan(g,axis){
  _bBox.setFromObject(g); _bBox.getSize(_bSize);
  return axis==='x'?_bSize.x : axis==='y'?_bSize.y : _bSize.z;
}
/* build one beast, grown to its true stature. Extra arguments are passed
   through to the file's build (the fish takes its colour that way). */
function makeBeast(name,arg){
  const spec=BEAST_BY_NAME[name];
  if(!spec) throw new Error('no creature file for "'+name+'"');
  const inner=spec.build(BEAST_KIT,arg);
  const span=beastSpan(inner,trueAxis(name,spec));
  /* THE BEAST IS WRAPPED, AND THE WRAPPER GROWS IT. The engine sets scale on
     what it is handed (a calf in the pod, a shark rearing) — so the true
     stature is put on an INNER group where nothing can clobber it, and what
     the engine holds is a plain group at scale 1 that means "unremarkable
     for its kind". */
  const m=trueMetres(name,spec);
  if(span>0.001&&m>0) inner.scale.setScalar((m*U_PER_M)/span);
  const g=new THREE.Group();
  g.rotation.order=inner.rotation.order;
  g.add(inner);
  g.userData=inner.userData||{};      /* tail, tents, wings — the moving parts */
  return g;
}
/* what the file says this beast truly measures, in world units */
function beastUnits(name){ return trueMetres(name,BEAST_BY_NAME[name])*U_PER_M; }
/* Steve-fashion: dark brown hair in a clean, straight fringe (no ragged edge),
   sideburns down the temples, a bowl of hair on top and round the back. */
/* skin, hair and cloth all come out of world/palette.js now — the robe is
   the blue of the veil with gold upon its hem, and not a game primary */
const PF=PAL.folk;
const SKIN_RGB=PF.skin, HAIR_RGB=PF.hair, ROBE_A=PF.robe, ROBE_D=PF.robeDeep;
const TRIM_C=C(PF.trim), CLASP_C=C(PF.clasp);
const faceTexP=mkTex(g=>{ g.fillStyle=rgb(...SKIN_RGB); g.fillRect(0,0,16,16);
  for(let y=0;y<4;y++) for(let x=0;x<16;x++){                 /* the straight fringe */
    const c=jit(HAIR_RGB,16,x+y*16); P(g,x,y,rgb(c[0],c[1],c[2])); }
  for(let y=4;y<8;y++) for(const x of [0,1,14,15]){           /* sideburns */
    const c=jit(HAIR_RGB,16,x*7+y); P(g,x,y,rgb(c[0],c[1],c[2])); }
  g.fillStyle='rgb(255,255,255)'; g.fillRect(3,8,2,2); g.fillRect(11,8,2,2);  /* eyes */
  g.fillStyle=C(PF.eye);         g.fillRect(5,8,2,2); g.fillRect(9,8,2,2);    /* the blue of the veil */
  g.fillStyle=C(PF.nose);        g.fillRect(7,10,2,2);                         /* the nose */
  g.fillStyle=C(PF.mouth); g.fillRect(6,13,4,FG); g.fillRect(5,12,FG,FG); g.fillRect(10,12,FG,FG); /* the mouth */ });
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
  g.fillStyle=TRIM_C; g.fillRect(0,9,16,2);
  g.fillStyle=CLASP_C; g.fillRect(7,9,2,2);
  g.fillStyle='rgba(0,0,0,0.3)'; g.fillRect(0,15,16,1); });
const robeFrontTexP=mkTex(g=>{ speckle(g,ROBE_A,16,ROBE_D,0.3);
  g.fillStyle='rgba(0,0,0,0.25)'; for(const x of [3,12]) g.fillRect(x,3,1,13);
  g.fillStyle=rgb(...SKIN_RGB); g.fillRect(6,0,4,1); g.fillRect(7,1,2,1);     /* neckline */
  g.fillStyle=TRIM_C; g.fillRect(5,0,1,2); g.fillRect(10,0,1,2);   /* collar trim */
  g.fillStyle=TRIM_C; g.fillRect(0,9,16,2);
  g.fillStyle=CLASP_C; g.fillRect(7,9,2,2);                          /* the clasp */
  g.fillStyle='rgba(0,0,0,0.3)'; g.fillRect(0,15,16,1); });
const sleeveTexP=mkTex(g=>{ speckle(g,ROBE_A,16,ROBE_D,0.3);
  g.fillStyle='rgba(0,0,0,0.22)'; g.fillRect(0,4,16,1);
  g.fillStyle=TRIM_C; g.fillRect(0,11,16,1);                        /* cuff trim */
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
  /* the traveller's own limbs, two bones apiece — knees and elbows that
     truly fold, the same joints every soul in the world now carries */
  const mkWLimb=(w2,len,d2,mat,px2,py,elbow)=>{
    const U=new THREE.Mesh(new THREE.BoxGeometry(w2,len*0.55,d2),mat);
    U.geometry.translate(0,-len*0.275,0); U.position.set(px2,py,0);
    const F=new THREE.Mesh(new THREE.BoxGeometry(w2*0.9,len*0.52,d2*0.9),mat);
    F.geometry.translate(0,-len*0.26,0); F.position.set(0,-len*0.53,0);
    U.add(F); U.userData[elbow?'elbow':'knee']=F; walkerG.add(U); return U; };
  const legL=mkWLimb(1.4,4.2,1.5,legMatP,0.74,4.3,false);
  const legR=mkWLimb(1.4,4.2,1.5,legMatP,-0.74,4.3,false);
  const armL=mkWLimb(1.4,4.4,1.5,sleeveMatP,2.25,8.7,true);
  const armR=mkWLimb(1.4,4.4,1.5,sleeveMatP,-2.25,8.7,true);
  walkerG.visible=false; scene.add(walkerG);
  /* YXZ: heading first, then the prone/lean pitch about the body's OWN axis.
     With the default XYZ order the swim/flight pitch was a world-frame tilt,
     so turning while prone rolled and flipped the body sideways. */
  walkerG.rotation.order='YXZ';
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
  /* limbs in TWO BONES apiece: thigh and shin about a knee, upper arm and
     forearm about an elbow — so the folk of the world walk like people and
     not like clothes-pegs. The engine folds the joints as the limbs swing. */
  const legMat=lam(0x2e3350);
  const mkLimb=(w2,len,d2,mat,px2,py,elbow)=>{
    const U=new THREE.Mesh(new THREE.BoxGeometry(w2,len*0.55,d2),mat);
    U.geometry.translate(0,-len*0.275,0); U.position.set(px2,py,0);
    const F=new THREE.Mesh(new THREE.BoxGeometry(w2*0.9,len*0.52,d2*0.9),mat);
    F.geometry.translate(0,-len*0.26,0); F.position.set(0,-len*0.53,0);
    U.add(F); U.userData[elbow?'elbow':'knee']=F; g.add(U); return U; };
  const legL=mkLimb(1.35,4.2,1.5,legMat,0.74,4.3,false); legL.userData.ph=0;
  const legR=mkLimb(1.35,4.2,1.5,legMat,-0.74,4.3,false); legR.userData.ph=Math.PI;
  const armL=mkLimb(1.2,4.4,1.5,robeM,2.15,8.7,true); armL.userData.ph=Math.PI;
  const armR=mkLimb(1.2,4.4,1.5,robeM,-2.15,8.7,true); armR.userData.ph=0;
  if(role==='hunter'){ const spear=lbox(0.34,8,0.34,0x6a4a2a); spear.position.set(2.7,8.4,0.6);
      spear.rotation.x=0.25; g.add(spear);
    const tip=lbox(0.55,0.9,0.2,0xb8bcc4); tip.position.set(2.7,12.4,1.6); g.add(tip); }
  else if(role==='herder'){ const staff=lbox(0.3,8.5,0.3,0x7a5a30); staff.position.set(2.6,8.6,0);
      staff.rotation.z=0.12; g.add(staff); }
  else if(role==='teacher'){ const scroll=lbox(1.3,0.6,0.6,0xe8dfc8); scroll.position.set(2.4,7,1.2); g.add(scroll); }
  else if(role==='farmer'){ const hoe=lbox(0.3,7.5,0.3,0x7a5a30); hoe.position.set(2.6,8.0,0.4);
      hoe.rotation.x=0.2; g.add(hoe);
    const blade=lbox(1.1,0.4,0.9,0x9aa0a8); blade.position.set(2.6,11.5,1.2); g.add(blade); }
  let rod=null, rodLine=null, rodBob=null, rodFish=null;
  if(role==='fisher'){
    /* ---- THE ROD IS HELD IN THE HAND, NOT HUNG BESIDE THE MAN ----
       It used to be parented to the BODY at a fixed offset, so it floated at
       his side and never moved with him: he stood beside a rod rather than
       holding one. It is hung on the FOREARM now — the far end of the arm,
       which is the hand — so it swings with every motion of the arm, and the
       line and float hang from the ROD'S OWN TIP wherever the rod is pointed. */
    const hand=armR.userData.elbow;
    rod=lbox(0.26,9.5,0.26,0x8a6a3a);
    rod.geometry.translate(0,4.75,0);              /* pivot at the butt, in the fist */
    rod.position.set(0,-2.1,0.35); rod.rotation.x=-0.95; hand.add(rod);
    /* the line falls from the tip; it and the float are hung on the ROD */
    rodLine=lbox(0.09,5.2,0.09,0x20242c); rodLine.geometry.translate(0,-2.6,0);
    rodLine.position.set(0,9.4,0); rod.add(rodLine);
    rodBob=lbox(0.5,0.5,0.5,0xd0472e); rodBob.position.set(0,-5.2,0); rodLine.add(rodBob);
    /* and the fish upon the line — unseen until it is drawn up */
    rodFish=lbox(1.5,0.7,0.5,0x9fb6c4); rodFish.position.set(0,-0.9,0);
    rodFish.visible=false; rodBob.add(rodFish);
  }
  else if(role==='feeder'){ const basket=lbox(1.6,1.1,1.1,0xb08a48); basket.position.set(2.3,6.4,0.9); g.add(basket); }
  else if(role==='water'){ const jar=lbox(1.4,1.8,1.4,0x9a6242); jar.position.set(0,12.9,0); g.add(jar);
    const rim=lbox(1.0,0.4,1.0,0x7a4a32); rim.position.set(0,13.9,0); g.add(rim); }
  if(child) g.scale.set(0.62,0.62,0.62);
  g.userData={legs:[legL,legR,armL,armR],armL,armR,rod,rodLine,rodBob,rodFish,female:!!female};
  return g;
}
/* ---- EVERY BEAST OF THE FIELD, AND WHERE IT IS BUILT ----
   The cattle, flocks and beasts of the old world are built here, in this one
   long hand. Everything added since has its OWN FILE in creatures/ with
   realm:'land' — a file is asked for first, so a new beast is a new file and
   nothing in the engine need be touched to have it walk the earth. */
function makeAnimal(kind){
  const spec=BEAST_BY_NAME[kind];
  if(spec&&spec.realm==='land') return makeBeast(kind);
  return sizeToTrue(kind,buildOldAnimal(kind));
}
/* ---- THE HAND-BUILT BEASTS, BROUGHT TO THE SAME MEASURE ----
   The world's first cattle, sheep, horses, wolves and lions were built by
   hand at whatever looked right at the time, which was about half life-size.
   They are not rebuilt — they are MEASURED, exactly as every creature file's
   beast is, and scaled to their true size out of js/size.js. The scale goes
   on an INNER group so the engine may still set scale on what it is handed. */
function sizeToTrue(kind,inner){
  const m=(window.SIZE&&SIZE.of(kind))||0;
  if(!m) return inner;
  const span=beastSpan(inner,(window.SIZE?SIZE.axisOf(kind):'z'));
  if(span>0.001) inner.scale.setScalar((m*U_PER_M)/span);
  const g=new THREE.Group(); g.rotation.order=inner.rotation.order;
  g.add(inner); g.userData=inner.userData||{}; return g;
}
function buildOldAnimal(kind){
  const g=new THREE.Group(); const legs=[]; let tailRef=null;
  function fourLegs(w,d,lh,col){ for(const sx of [1,-1]) for(const sz of [1,-1]){
    const L=lbox(0.9,lh*0.55,0.9,col); L.geometry.translate(0,-lh*0.275,0);   // thigh, pivot at the hip
    L.position.set(sx*w,lh,sz*d);
    const S=lbox(0.8,lh*0.5,0.8,col); S.geometry.translate(0,-lh*0.25,0);     // shin, hung from the knee
    S.position.set(0,-lh*0.53,0); L.add(S); L.userData.knee=S;
    L.userData.ph=(sx*sz>0)?0:Math.PI; L.userData.foot=(sx>0?0:1)+(sz>0?0:2);
    g.add(L); legs.push(L); } }
  /* ---- EVERY BEAST HAS A FACE ----
     Two dark eyes set on the front corners of the head — the one detail that
     turns a box into a creature looking at you. */
  function eyes(hx,hy,hz,sz2,col){ for(const sd of [1,-1]){
    const e=lbox(sz2||0.3,sz2||0.3,0.2,col||0x14100c);
    e.position.set(sd*hx,hy,hz); g.add(e); } }
  if(kind==='sheep'){
    const body=new THREE.Mesh(new THREE.BoxGeometry(3.4,2.6,4.6),
      new THREE.MeshLambertMaterial({map:TEX.wool})); body.position.y=3.4; g.add(body);
    const head=lbox(1.6,1.7,1.6,0xead9c8); head.position.set(0,4.3,2.9); g.add(head);
    eyes(0.5,4.6,3.72,0.3);
    for(const s of [1,-1]){ const ear=lbox(0.6,0.35,0.3,0xdcc9b4); ear.position.set(s*1.0,4.7,2.8); g.add(ear); }
    tailRef=lbox(0.7,0.7,0.5,0xefe8dc); tailRef.position.set(0,3.6,-2.5); g.add(tailRef);
    fourLegs(1.1,1.5,2.1,0xd9d0c0);
  } else if(kind==='cow'){
    const cowTex=mkTex(gg=>{ speckle(gg,[92,64,44],14);
      gg.fillStyle='rgb(235,232,225)';
      gg.fillRect(1,2,5,5); gg.fillRect(9,8,6,6); gg.fillRect(10,1,4,3); });
    const body=new THREE.Mesh(new THREE.BoxGeometry(3.6,2.8,5.4),
      new THREE.MeshLambertMaterial({map:cowTex})); body.position.y=3.8; g.add(body);
    const head=lbox(1.9,1.9,1.6,0x6b4a34); head.position.set(0,4.7,3.3); g.add(head);
    const muz=lbox(1.4,0.9,0.5,0xd9cfc2); muz.position.set(0,4.3,4.2); g.add(muz);
    for(const s of [1,-1]){ const h2=lbox(0.4,0.4,0.7,0xe8e2d2); h2.position.set(s*1.05,5.5,3.2); g.add(h2);
      const ear=lbox(0.55,0.4,0.3,0x5a4030); ear.position.set(s*1.1,5.1,3.1); g.add(ear); }
    eyes(0.6,5.1,4.14,0.34);
    for(const s of [1,-1]){ const nos=lbox(0.25,0.25,0.2,0x8a7a6a); nos.position.set(s*0.4,4.35,4.48); g.add(nos); }
    tailRef=lbox(0.4,2.0,0.4,0x4a3626); tailRef.geometry.translate(0,-1.0,0); tailRef.position.set(0,4.8,-2.8); g.add(tailRef);
    fourLegs(1.2,1.9,2.3,0x5a4030);
  } else if(kind==='pig'){
    const body=lbox(3.2,2.4,4.6,0xefa2a2); body.position.y=2.9; g.add(body);
    const head=lbox(2,2,1.4,0xefa2a2); head.position.set(0,3.3,2.9); g.add(head);
    const snout=lbox(1.1,0.8,0.4,0xe58a8a); snout.position.set(0,3.1,3.7); g.add(snout);
    eyes(0.62,3.8,3.62,0.28);
    for(const s of [1,-1]){ const nos=lbox(0.2,0.3,0.14,0xc87878); nos.position.set(s*0.24,3.1,3.94); g.add(nos);
      const ear=lbox(0.55,0.55,0.25,0xdf9494); ear.position.set(s*0.85,4.35,2.7); ear.rotation.z=s*0.3; g.add(ear); }
    tailRef=lbox(0.3,0.3,0.7,0xe58a8a); tailRef.position.set(0,3.4,-2.5); tailRef.rotation.x=-0.7; g.add(tailRef);
    fourLegs(1.05,1.6,1.6,0xdf9494);
  } else if(kind==='chicken'){
    const body=lbox(1.7,1.7,2.3,0xeeeeea); body.position.y=1.9; g.add(body);
    const head=lbox(1,1.4,1,0xf2f2ee); head.position.set(0,3.3,1.1); g.add(head);
    const beak=lbox(0.7,0.4,0.5,0xdf9c2a); beak.position.set(0,3.2,1.75); g.add(beak);
    const wat=lbox(0.4,0.5,0.3,0xc23a2a); wat.position.set(0,2.7,1.6); g.add(wat);
    const comb=lbox(0.3,0.55,0.8,0xc23a2a); comb.position.set(0,4.2,1.0); g.add(comb);
    eyes(0.52,3.6,1.52,0.22);
    tailRef=lbox(0.9,1.1,0.5,0xdcdcd6); tailRef.position.set(0,2.6,-1.3); tailRef.rotation.x=0.5; g.add(tailRef);
    for(const s of [1,-1]){ const w2=lbox(0.3,1.2,1.9,0xdcdcd6); w2.position.set(s*1,2.1,0.1); g.add(w2); }
    fourLegs(0.45,0.4,0.8,0xdf9c2a);
  } else if(kind==='hare'){       /* a creeping thing of the field */
    const body=lbox(1.1,1.1,1.8,0xb8a184); body.position.y=1.2; g.add(body);
    const head=lbox(0.9,0.9,0.9,0xc8b494); head.position.set(0,1.7,1.1); g.add(head);
    eyes(0.47,1.85,1.4,0.22);
    const nose=lbox(0.24,0.2,0.14,0x8a7060); nose.position.set(0,1.6,1.6); g.add(nose);
    for(const s of [1,-1]){ const ear=lbox(0.3,1.3,0.3,0xc8b494); ear.position.set(s*0.3,2.7,0.9); g.add(ear); }
    const tail=lbox(0.5,0.5,0.4,0xefe8dc); tail.position.set(0,1.3,-1); g.add(tail);
    fourLegs(0.4,0.6,0.7,0xa08868);
  } else if(kind==='lizard'){     /* a creeping thing of the rocks */
    const body=lbox(0.7,0.5,2.2,0x6f7a44); body.position.y=0.6; g.add(body);
    const head=lbox(0.8,0.6,0.9,0x7a854c); head.position.set(0,0.7,1.4); g.add(head);
    eyes(0.42,0.85,1.6,0.18,0xd9c93f);
    const tail=lbox(0.4,0.35,1.8,0x636c3c); tail.position.set(0,0.55,-1.9); g.add(tail); tailRef=tail;
    fourLegs(0.55,0.7,0.5,0x5c6438);
  } else if(kind==='goat'){
    const body=lbox(2.4,2.2,3.6,0xcfc4b0); body.position.y=3.0; g.add(body);
    const head=lbox(1.3,1.4,1.4,0xdad0be); head.position.set(0,3.9,2.3); g.add(head);
    eyes(0.42,4.2,3.02,0.26,0xd9b83f);
    const beard=lbox(0.35,0.7,0.3,0xb7ac98); beard.position.set(0,3.1,2.9); g.add(beard);
    for(const s of [1,-1]){ const horn=lbox(0.3,0.9,0.3,0x6a5c44); horn.position.set(s*0.4,4.9,2.1);
      horn.rotation.x=-0.5; g.add(horn);
      const ear=lbox(0.5,0.3,0.25,0xcfc4b0); ear.position.set(s*0.85,4.3,2.2); ear.rotation.z=s*0.4; g.add(ear); }
    tailRef=lbox(0.35,0.7,0.3,0xb7ac98); tailRef.position.set(0,3.9,-1.9); tailRef.rotation.x=0.6; g.add(tailRef);
    fourLegs(0.9,1.3,2.0,0xb7ac98);
  } else if(kind==='camel'){
    const body=lbox(2.8,3,5.6,0xc8a06a); body.position.y=4.8; g.add(body);
    const hump=lbox(1.9,1.4,2,0xb8905a); hump.position.set(0,6.9,0.4); g.add(hump);
    const neck=lbox(1.2,2.8,1.2,0xc8a06a); neck.position.set(0,6.6,2.6); g.add(neck);
    const head=lbox(1.4,1.2,2,0xb8905a); head.position.set(0,8.2,3.2); g.add(head);
    eyes(0.55,8.5,4.0,0.26);
    for(const s of [1,-1]){ const ear=lbox(0.35,0.4,0.25,0xb8905a); ear.position.set(s*0.6,8.85,2.7); g.add(ear); }
    tailRef=lbox(0.35,1.8,0.35,0xa8834f); tailRef.geometry.translate(0,-0.9,0); tailRef.position.set(0,5.6,-2.9); g.add(tailRef);
    fourLegs(1,2.1,3.3,0xb08a56);
  } else if(kind==='horse'){
    const col=0x6a4a2e; const body=lbox(2.2,2.6,5.4,col); body.position.y=4.2; g.add(body);
    const neck=lbox(1.3,2.6,1.3,col); neck.position.set(0,5.6,2.4); neck.rotation.x=-0.5; g.add(neck);
    const head=lbox(1.2,1.5,2.4,col); head.position.set(0,6.6,3.4); g.add(head);
    eyes(0.5,7.0,4.2,0.28);
    for(const s of [1,-1]){ const ear=lbox(0.3,0.7,0.3,col); ear.position.set(s*0.4,7.6,2.9); g.add(ear);
      const nos=lbox(0.22,0.22,0.16,0x3a2a1a); nos.position.set(s*0.3,6.4,4.62); g.add(nos); }
    const blaze=lbox(0.42,0.9,0.16,0xe8e0d0); blaze.position.set(0,6.9,4.62); g.add(blaze);
    const mane=lbox(0.4,2.4,1.3,0x2e2018); mane.position.set(0,6.0,2.0); mane.rotation.x=-0.5; g.add(mane);
    const tail=lbox(0.5,2.4,0.5,0x2e2018); tail.position.set(0,4.4,-2.9); tail.rotation.x=0.5; g.add(tail); tailRef=tail;
    fourLegs(0.9,2.0,3.2,0x4a3320);
  } else if(kind==='donkey'){
    const col=0x9a938a; const body=lbox(1.8,2.2,4.4,col); body.position.y=3.6; g.add(body);
    const neck=lbox(1.1,2.2,1.1,col); neck.position.set(0,4.8,2.0); neck.rotation.x=-0.5; g.add(neck);
    const head=lbox(1.0,1.3,2.0,col); head.position.set(0,5.6,3.0); g.add(head);
    for(const s of[1,-1]){ const ear=lbox(0.35,1.4,0.35,col); ear.position.set(s*0.4,6.6,2.6); g.add(ear); }
    eyes(0.42,5.9,4.02,0.26);
    const muz2=lbox(0.7,0.5,0.3,0xc8c2ba); muz2.position.set(0,5.3,4.05); g.add(muz2);
    const tail=lbox(0.4,1.8,0.4,0x5a534a); tail.position.set(0,3.8,-2.4); tail.rotation.x=0.4; g.add(tail); tailRef=tail;
    fourLegs(0.75,1.6,2.6,0x7a736a);
  } else if(kind==='ox'){
    const body=lbox(3.4,3.0,6.0,0x5a4436); body.position.y=4.2; g.add(body);
    const head=lbox(2.0,2.0,1.8,0x4a3628); head.position.set(0,4.9,3.6); g.add(head);
    eyes(0.62,5.3,4.52,0.32);
    const muz3=lbox(1.3,0.8,0.4,0xc8bcae); muz3.position.set(0,4.4,4.6); g.add(muz3);
    for(const s of[1,-1]){ const horn=lbox(0.35,0.35,1.4,0xe8e0d0); horn.position.set(s*1.2,5.6,3.6); horn.rotation.z=s*0.5; g.add(horn);
      const ear=lbox(0.55,0.4,0.3,0x4a3628); ear.position.set(s*1.15,5.15,3.4); g.add(ear); }
    tailRef=lbox(0.4,2.2,0.4,0x3a2a1e); tailRef.geometry.translate(0,-1.1,0); tailRef.position.set(0,5.3,-3.1); g.add(tailRef);
    fourLegs(1.3,2.1,2.7,0x4a3628);
  } else if(kind==='wolf'){
    const col=0x8a8f96; const body=lbox(1.6,1.6,3.6,col); body.position.y=2.2; g.add(body);
    const head=lbox(1.3,1.3,1.4,col); head.position.set(0,2.6,2.2); g.add(head);
    const snout=lbox(0.7,0.6,0.8,0x6a6f76); snout.position.set(0,2.4,3.0); g.add(snout);
    eyes(0.4,2.95,2.92,0.22,0xd9c93f);
    const nose=lbox(0.3,0.24,0.16,0x14100c); nose.position.set(0,2.5,3.44); g.add(nose);
    for(const s of[1,-1]){ const ear=lbox(0.4,0.7,0.3,col); ear.position.set(s*0.5,3.4,2.1); g.add(ear); }
    const tail=lbox(0.6,0.6,1.8,col); tail.position.set(0,2.6,-2.2); tail.rotation.x=0.4; g.add(tail); tailRef=tail;
    fourLegs(0.6,1.2,2.0,0x70767c);
  } else if(kind==='dog'){
    const col=0xb98a52; const body=lbox(1.2,1.2,2.8,col); body.position.y=1.9; g.add(body);
    const head=lbox(1.1,1.1,1.2,col); head.position.set(0,2.3,1.7); g.add(head);
    const snout=lbox(0.6,0.5,0.7,0x8a6238); snout.position.set(0,2.1,2.4); g.add(snout);
    eyes(0.34,2.6,2.32,0.2);
    const nose=lbox(0.26,0.2,0.14,0x14100c); nose.position.set(0,2.2,2.8); g.add(nose);
    for(const s of[1,-1]){ const ear=lbox(0.4,0.6,0.3,0x8a6238); ear.position.set(s*0.5,3.0,1.6); g.add(ear); }
    const tail=lbox(0.4,0.4,1.4,col); tail.position.set(0,2.4,-1.8); tail.rotation.x=0.5; g.add(tail); tailRef=tail;
    fourLegs(0.45,0.9,1.6,0x9a723e);
  } else if(kind==='lion'){
    const col=0xcaa25a; const body=lbox(2.0,2.0,4.4,col); body.position.y=2.8; g.add(body);
    const mane=lbox(2.4,2.4,1.2,0x8a5a2a); mane.position.set(0,3.4,2.2); g.add(mane);
    const head=lbox(1.6,1.6,1.6,col); head.position.set(0,3.4,2.9); g.add(head);
    const snout=lbox(0.9,0.7,0.7,0xd8b878); snout.position.set(0,3.1,3.7); g.add(snout);
    eyes(0.46,3.75,3.72,0.24,0xd9b83f);
    const nose2=lbox(0.34,0.24,0.16,0x2a1c12); nose2.position.set(0,3.25,4.08); g.add(nose2);
    for(const s of[1,-1]){ const ear=lbox(0.4,0.4,0.3,0x8a5a2a); ear.position.set(s*0.75,4.25,2.5); g.add(ear); }
    const tail=lbox(0.4,0.4,2.2,col); tail.position.set(0,3.0,-2.6); tail.rotation.x=0.3; g.add(tail); tailRef=tail;
    const tuft=lbox(0.6,0.6,0.6,0x8a5a2a); tuft.position.set(0,2.4,-3.6); g.add(tuft);
    fourLegs(0.75,1.5,2.4,0xb08a48);
  } else if(kind==='deer'){
    const col=0x9a6a3a; const body=lbox(1.7,2.0,4.2,col); body.position.y=3.4; g.add(body);
    const neck=lbox(1.0,2.2,1.0,col); neck.position.set(0,4.8,2.0); neck.rotation.x=-0.6; g.add(neck);
    const head=lbox(1.0,1.1,1.8,col); head.position.set(0,5.8,2.9); g.add(head);
    eyes(0.42,6.05,3.6,0.24);
    const nose3=lbox(0.3,0.24,0.16,0x14100c); nose3.position.set(0,5.7,3.84); g.add(nose3);
    for(const s of[1,-1]){ const ant=lbox(0.25,1.6,0.25,0x6a4a2a); ant.position.set(s*0.5,6.8,2.7); ant.rotation.z=s*0.4; g.add(ant);
      const ear=lbox(0.45,0.3,0.25,col); ear.position.set(s*0.6,6.3,2.7); ear.rotation.z=s*0.5; g.add(ear); }
    const tail=lbox(0.5,0.7,0.4,0xefe0d0); tail.position.set(0,3.6,-2.2); g.add(tail); tailRef=tail;
    fourLegs(0.6,1.5,2.8,0x7a5230);
  } else if(kind==='elephant'){
    const col=0x8f8f96; const body=lbox(4.4,4.2,7.2,col); body.position.y=6.0; g.add(body);
    const head=lbox(3.0,3.0,2.6,col); head.position.set(0,6.6,4.2); g.add(head);
    const trunk=lbox(1.0,3.4,1.0,col); trunk.position.set(0,4.6,5.4); trunk.rotation.x=0.4; g.add(trunk);
    eyes(0.9,7.3,5.52,0.3);
    const etail=lbox(0.35,2.4,0.35,0x76767e); etail.geometry.translate(0,-1.2,0); etail.position.set(0,7.2,-3.7); g.add(etail);
    const ears=[];
    for(const s of[1,-1]){ const ear=lbox(0.4,2.8,2.4,0x82828a); ear.position.set(s*2.0,6.8,3.6); g.add(ear); ears.push(ear);
      const tusk=lbox(0.4,0.4,2.0,0xefe8d8); tusk.position.set(s*0.9,5.2,5.4); g.add(tusk); }
    fourLegs(1.6,2.6,4.4,0x76767e);
    g.userData={legs,ears,tail:etail};
    return g;
  }
  else if(kind==='crocodile'){
    /* long and low, all jaw and tail, with a ridge of scutes down the back —
       it lies in the shallows of the great rivers looking like a log */
    const dk=0x455631, lt=0x63754a, bl=0xa9ad7c;
    const body=lbox(2.4,1.6,6.0,dk); body.position.y=1.5; g.add(body);
    const und=lbox(2.0,0.5,5.4,bl); und.position.y=0.75; g.add(und);
    for(let i=0;i<6;i++){ const s=lbox(0.5,0.5,0.55,lt);
      s.position.set((i%2?0.55:-0.55),2.45,-2.4+i*1.0); g.add(s); }     /* the scutes */
    const neck=lbox(1.9,1.3,1.3,dk); neck.position.set(0,1.55,3.6); g.add(neck);
    const jawT=lbox(1.5,0.7,3.4,dk);  jawT.position.set(0,1.8,5.7); g.add(jawT);
    const jawB=lbox(1.4,0.55,3.2,bl); jawB.position.set(0,1.15,5.6); g.add(jawB);
    for(const s of [1,-1]){ const e=lbox(0.45,0.45,0.45,0xd9c93f); e.position.set(s*0.62,2.45,4.1); g.add(e);
      const p=lbox(0.2,0.2,0.2,0x101010); p.position.set(s*0.62,2.62,4.1); g.add(p); }
    const t1=lbox(1.8,1.2,2.6,dk); t1.position.set(0,1.5,-4.2); g.add(t1);
    const t2=lbox(1.0,0.9,2.8,lt); t2.position.set(0,1.5,-6.7); g.add(t2);
    for(const sx of [1,-1]) for(const sz of [2.0,-2.2]){
      const L=lbox(0.8,1.0,0.8,lt); L.geometry.translate(0,-0.5,0);
      L.position.set(sx*1.55,1.05,sz); L.userData.ph=(sx*sz>0)?0:Math.PI;
      L.userData.foot=(sx>0?0:1)+(sz>0?0:2); g.add(L); legs.push(L); }
    g.userData={legs,jaw:jawB,tail:t2};
    return g;
  } else if(kind==='bear'||kind==='blackbear'){
    /* heavy in the shoulder, small round ears, a pale muzzle — it forages the
       northern woods and fishes the rapids */
    const black=kind==='blackbear';
    const fur=black?0x241f1d:0x6d4526, muz=black?0xa08a5e:0xbfa273;
    const body=lbox(3.4,3.2,5.6,fur); body.position.y=4.4; g.add(body);
    const hump=lbox(3.0,1.0,2.2,fur); hump.position.set(0,6.2,1.2); g.add(hump);   /* the shoulder */
    const head=lbox(2.3,2.1,2.2,fur); head.position.set(0,5.4,3.7); g.add(head);
    const snout=lbox(1.3,1.0,1.2,muz); snout.position.set(0,5.0,4.9); g.add(snout);
    const nose=lbox(0.6,0.45,0.3,0x18140f); nose.position.set(0,5.25,5.55); g.add(nose);
    for(const s of [1,-1]){ const ear=lbox(0.8,0.8,0.4,fur); ear.position.set(s*0.85,6.6,3.5); g.add(ear);
      const eye=lbox(0.28,0.28,0.25,0x120e0a); eye.position.set(s*0.72,5.75,4.8); g.add(eye); }
    const rump=lbox(3.2,2.8,1.2,fur); rump.position.set(0,4.2,-2.9); g.add(rump);
    fourLegs(1.35,1.9,2.9,black?0x1b1715:0x5a3820);
    g.userData={legs,head};
    return g;
  }
  else if(kind==='penguin'){
    /* the one beast of the ice — upright, white-breasted, flippered */
    const body=lbox(1.5,2.2,1.3,0x1b1f26); body.position.y=1.9; g.add(body);
    const belly=lbox(1.1,1.8,0.35,0xf1f1ec); belly.position.set(0,1.9,0.72); g.add(belly);
    const head=lbox(1.2,1.1,1.1,0x1b1f26); head.position.set(0,3.45,0.05); g.add(head);
    const face=lbox(0.8,0.6,0.22,0xf1f1ec); face.position.set(0,3.25,0.6); g.add(face);
    const beak=lbox(0.34,0.3,0.6,0xd8901f); beak.position.set(0,3.2,0.98); g.add(beak);
    for(const sd of [1,-1]){
      const e=lbox(0.2,0.2,0.18,0x0a0a0a); e.position.set(sd*0.33,3.62,0.58); g.add(e);
      const fp=lbox(0.28,1.5,0.72,0x161a20); fp.position.set(sd*0.86,1.9,0); fp.rotation.z=sd*0.17; g.add(fp);
      const L=lbox(0.5,0.7,0.95,0xd8901f); L.geometry.translate(0,-0.35,0);
      L.position.set(sd*0.42,0.75,0.15); L.userData.ph=(sd>0)?0:Math.PI; g.add(L); legs.push(L); }
    g.userData={legs};
    return g;
  }
  else { /* ostrich — two long legs, a tall neck */
    const body=lbox(2.2,2.6,3.4,0x3a3230); body.position.y=6.0; g.add(body);
    const neck=lbox(0.8,4.4,0.8,0xd8b89a); neck.position.set(0,8.4,1.2); neck.rotation.x=-0.2; g.add(neck);
    const head=lbox(0.9,0.9,1.4,0xd8b89a); head.position.set(0,10.6,1.8); g.add(head);
    const beak=lbox(0.5,0.5,0.7,0xd8a030); beak.position.set(0,10.5,2.7); g.add(beak);
    eyes(0.36,10.85,2.3,0.24);
    tailRef=lbox(1.6,1.4,0.8,0xe8e2d6); tailRef.position.set(0,6.6,-1.9); tailRef.rotation.x=0.4; g.add(tailRef);
    for(const s of[1,-1]){ const wing=lbox(0.4,1.8,2.2,0x2a2422); wing.position.set(s*1.2,5.9,0); g.add(wing);
      const L=lbox(0.5,6,0.5,0xc8b0a0); L.geometry.translate(0,-3,0); L.position.set(s*0.7,6,0); L.userData.ph=(s>0)?0:Math.PI; g.add(L); legs.push(L); }
  }
  g.userData={legs};
  if(tailRef) g.userData.tail=tailRef;
  return g;
}
/* a bird — a small body with two flapping wings, for the flocks aloft.
   type: crow · gull · dove · eagle · butterfly (variants in colour and size) */
function makeBird(type){ type=type||'crow';
  const S={crow:{b:0x2e3038,w:0x24262c,s:1},gull:{b:0xeef2f6,w:0xc6ccd4,s:1.1},
    dove:{b:0xf2f0ea,w:0xdad6ce,s:0.9},eagle:{b:0x5a4326,w:0x36290f,s:1.8},
    /* THE SNOWY OWL — white, barred, and the one bird of the high arctic
       that hunts by day, because up there in summer there is no night to
       hunt by. Broad in the wing and silent with it. */
    owl:{b:0xf4f2ee,w:0xe0ded6,s:1.6},
    /* and the puffin of the cold coasts, black above and white beneath */
    puffin:{b:0x22242a,w:0x1a1c22,s:0.7},
    butterfly:{b:0x201820,w:0xff6ea8,s:0.5}}[type]||{b:0x2e3038,w:0x24262c,s:1};
  const g=new THREE.Group();
  const body=lbox(0.8*S.s,0.8*S.s,1.8*S.s,S.b); body.position.y=0; g.add(body);
  const head=lbox(0.7*S.s,0.7*S.s,0.7*S.s,S.b); head.position.set(0,0.2*S.s,1.1*S.s); g.add(head);
  const wingL=lbox(2.4*S.s,0.16,1.1*S.s,S.w); wingL.geometry.translate(-1.2*S.s,0,0); wingL.position.set(0.4*S.s,0.2*S.s,0); g.add(wingL);
  const wingR=lbox(2.4*S.s,0.16,1.1*S.s,S.w); wingR.geometry.translate(1.2*S.s,0,0); wingR.position.set(-0.4*S.s,0.2*S.s,0); g.add(wingR);
  /* ---- A BIRD HAS A FACE ----
     Every fowl was a pair of boxes and read as a toy. Every one of them now
     carries the things a bird is KNOWN by: two dark eyes, a beak of its own
     colour, a fanned tail, feet tucked under — and the wings end in a
     darker row of primary feathers, so they read as wings and not planks. */
  if(type!=='butterfly'){
    const BEAKS={crow:0x1e2026,gull:0xd8a02a,dove:0xb08a72,eagle:0xe0b040,owl:0x2a2620,puffin:0xd8621f};
    const EYES ={crow:0x0c0c10,gull:0x14100c,dove:0x2a1e1a,eagle:0xe8c020,owl:0xe8c020,puffin:0x100c0a};
    if(type!=='owl'&&type!=='puffin'){       /* those two carry their own faces below */
      for(const sd of [1,-1]){ const eye=lbox(0.18*S.s,0.18*S.s,0.12,EYES[type]||0x0c0c10);
        eye.position.set(sd*0.3*S.s,0.34*S.s,1.42*S.s); g.add(eye); }
      if(type!=='eagle'){ const beak=lbox(0.24*S.s,0.2*S.s,0.5*S.s,BEAKS[type]||0xd8a02a);
        beak.position.set(0,0.14*S.s,1.6*S.s); g.add(beak); } }
    if(type!=='eagle'&&type!=='owl'){        /* the fanned tail the rest were missing */
      const tail=lbox(0.9*S.s,0.14,1.1*S.s,S.w); tail.position.set(0,0.05*S.s,-1.35*S.s);
      tail.rotation.x=-0.12; g.add(tail); }
    /* the primaries — a darker feather-row along each wing's trailing edge */
    for(const W of [wingL,wingR]){ const s2=W===wingL?-1:1;
      for(let q=0;q<3;q++){ const f=lbox(0.5*S.s,0.14,0.34*S.s,S.b);
        f.position.set(s2*(0.7+q*0.62)*S.s,-0.02,-0.62*S.s); W.add(f); } }
    /* and feet, drawn up under the belly */
    const feet=lbox(0.34*S.s,0.16,0.3*S.s,0xc8892a); feet.position.set(0,-0.46*S.s,0.2*S.s); g.add(feet);
    /* the gull's grey mantle and the dove's blush, so neither is one flat white */
    if(type==='gull'){ const mantle=lbox(0.82*S.s,0.2,1.2*S.s,0xc6ccd4); mantle.position.set(0,0.42*S.s,-0.1); g.add(mantle); }
    if(type==='dove'){ const blush=lbox(0.72*S.s,0.4*S.s,0.4*S.s,0xd8b8b0); blush.position.set(0,-0.1*S.s,0.9*S.s); g.add(blush); }
  }
  if(type==='eagle'){ const beak=lbox(0.5,0.4,0.6,0xe0b040); beak.position.set(0,0.1,1.9*S.s); g.add(beak);
    const tail=lbox(1.0,0.16,1.2,0xffffff); tail.position.set(0,0,-1.4*S.s); g.add(tail); }
  if(type==='owl'){ const face=lbox(1.0*S.s,0.9*S.s,0.2,0xfbfaf6); face.position.set(0,0.25*S.s,1.4*S.s); g.add(face);
    const beak=lbox(0.26,0.3,0.3,0x2a2620); beak.position.set(0,0.1*S.s,1.55*S.s); g.add(beak);
    for(const sd of [1,-1]){ const eye=lbox(0.3,0.3,0.16,0xe8c020); eye.position.set(sd*0.28*S.s,0.34*S.s,1.5*S.s); g.add(eye); }
    for(let i=0;i<5;i++){ const bar=lbox(0.9*S.s,0.06,0.16,0x9a9a94);
      bar.position.set(0,0.42*S.s,0.8*S.s-i*0.5*S.s); g.add(bar); }
    const tail=lbox(0.9*S.s,0.14,1.0*S.s,0xe8e6e0); tail.position.set(0,0,-1.3*S.s); g.add(tail); }
  if(type==='puffin'){ const belly=lbox(0.7*S.s,0.6*S.s,1.2*S.s,0xf2f0ea); belly.position.set(0,-0.16*S.s,0.2*S.s); g.add(belly);
    const face=lbox(0.62*S.s,0.6*S.s,0.2,0xf2f0ea); face.position.set(0,0.2*S.s,1.42*S.s); g.add(face);
    /* the bill — the whole reason anybody knows what a puffin is */
    const bill=lbox(0.2,0.55*S.s,0.6*S.s,0xd8621f); bill.position.set(0,0.12*S.s,1.75*S.s); g.add(bill);
    const band=lbox(0.22,0.55*S.s,0.16,0xe8c020); band.position.set(0,0.12*S.s,1.62*S.s); g.add(band);
    for(const sd of [1,-1]){ const eye=lbox(0.16,0.16,0.12,0x100c0a); eye.position.set(sd*0.2*S.s,0.3*S.s,1.5*S.s); g.add(eye); }
    const feet=lbox(0.5*S.s,0.12,0.5*S.s,0xd8621f); feet.position.set(0,-0.42*S.s,-0.5*S.s); g.add(feet); }
  if(type==='butterfly'){ const w2=lbox(1.4,0.1,1.0,0xffd23a); w2.geometry.translate(-0.7,0,0); w2.position.set(0.2,0,-0.5); g.add(w2);
    const w3=w2.clone(); w3.geometry=w2.geometry.clone(); w3.scale.x=-1; w3.position.set(-0.2,0,-0.5); g.add(w3); }
  /* what it carries home in its beak — a fish from the sea, or seed from the
     field. Hidden until it has caught something. */
  const carry=lbox(0.75*S.s,0.4*S.s,1.15*S.s,0x9fb6c8);
  carry.position.set(0,-0.42*S.s,1.35*S.s); carry.visible=false; g.add(carry);
  g.userData={wingL,wingR,type,carry};
  /* and a bird is measured wingtip to wingtip, which is the only measure
     anybody uses for one in the air */
  return sizeToTrue(type,g);
}
/* ---- A NEST, AND THE YOUNG IN IT ----
   A ring of woven sticks with two chicks that stretch up when the parent
   comes in to feed them. */
function makeNest(){ const g=new THREE.Group();
  const base=lbox(2.4,0.35,2.4,0x5a4326); base.position.y=-0.3; g.add(base);
  for(let i=0;i<9;i++){ const a=i/9*6.283, s=lbox(1.0,0.4,0.45,0x6b5029);
    s.position.set(Math.cos(a)*1.15,0.05,Math.sin(a)*1.15); s.rotation.y=-a; g.add(s); }
  const chicks=[];
  for(let i=0;i<2;i++){ const c=lbox(0.6,0.6,0.75,0x9c8b68);
    c.position.set(-0.42+i*0.84,0.45,0); g.add(c);
    const bk=lbox(0.22,0.2,0.28,0xd8a030); bk.position.set(-0.42+i*0.84,0.5,0.5); g.add(bk);
    chicks.push({body:c,beak:bk}); }
  g.userData={chicks}; return g;
}
/* ---- PIXEL SKINS FOR THE CREATURES OF THE SEA ----
   Countershading, stripes, scutes and throat-grooves — every beast of the
   water wears a proper minecraft hide, no more flat colours. */
const SEAFISH=[]; let seaLifeInit=false, nextLeap=0;
function seaLifeTick(px,pz,dt){
  if(!seaLifeInit){ seaLifeInit=true;
    /* half the leapers are TRUE FLYING FISH now — they do not merely jump,
       they spread their pectoral sails and GLIDE a bowshot over the swell,
       exactly as they do off every warm bow on the real sea */
    for(let k=0;k<8;k++){ const f=makeBeast(k<4?'fish':'flyingfish'); f.visible=false; scene.add(f);
      SEAFISH.push({m:f,fly:k>=4,active:false,t:0,dur:1,x:0,z:0,dx:0,dz:0,peak:0}); } }
  nextLeap-=dt;
  const overWater=state.mode!=='walk' || !landAtWorld(px,pz);
  if(nextLeap<=0 && overWater){
    nextLeap=0.7+Math.random()*2.2;
    const fish=SEAFISH.find(f=>!f.active);
    if(fish){ const a=Math.random()*Math.PI*2, r=40+Math.random()*160;
      const x=px+Math.cos(a)*r, z=pz+Math.sin(a)*r;
      if(!landAtWorld(x,z)&&Math.hypot(x,z)/R_WORLD<0.98){
        const dir=Math.random()*Math.PI*2, len=fish.fly?(34+Math.random()*36):(6+Math.random()*10);
        fish.active=true; fish.t=0; fish.dur=fish.fly?(1.8+Math.random()*1.0):(1.0+Math.random()*0.7);
        fish.x=x; fish.z=z; fish.dx=Math.cos(dir)*len; fish.dz=Math.sin(dir)*len;
        fish.peak=fish.fly?(4+Math.random()*3):(7+Math.random()*7); fish.m.visible=true; } }
  }
  for(const f of SEAFISH){ if(!f.active) continue;
    f.t+=dt; const u=f.t/f.dur;
    if(u>=1){ f.active=false; f.m.visible=false; continue; }
    const x=f.x+f.dx*u, z=f.z+f.dz*u;
    const y=WATER_Y+seaHeight(x,z)+f.peak*Math.sin(Math.PI*u)-1.5;
    f.m.position.set(x,y,z);
    f.m.rotation.y=Math.atan2(f.dx,f.dz);
    /* a leaper arcs nose-up-then-down; a glider holds nearly level on its sails */
    f.m.rotation.x=(u-0.5)*(f.fly?0.7:2.6);
    if(f.fly&&f.m.userData.tail) f.m.userData.tail.rotation.y=u<0.15?Math.sin(f.t*40)*0.6:0;
  }
}

/* ---- THE BLOCKS UNDER THE WATER ----
   The weed of the sea is drawn out of the same paint box as the land: the
   kelp in green earth gone dark, the eel-grass in green earth lifted, the
   sponge in ochre. The CORAL is left a grey master on purpose — every head
   of it is tinted as it is laid down (madder, terre verte, ochre, tyrian),
   which is how a reef comes up in a hundred colours for one material. */
TEX.seasand=TEX.sand.clone(); TEX.seasand.needsUpdate=true; TEX.seasand.wrapS=TEX.seasand.wrapT=THREE.RepeatWrapping;
TEX.seasand.generateMipmaps=true; TEX.seasand.minFilter=THREE.NearestMipmapLinearFilter; TEX.seasand.anisotropy=4;
const KELP_D=PAL.shade(PAL.mix(PP.terreVerte,PP.malachite,0.5),0.74),
      KELP_L=PAL.mix(PP.malachite,PP.olivine,0.35),
      EEL_D =PAL.mix(PP.malachite,PP.terreVerte,0.35),
      EEL_L =PAL.lift(PAL.mix(PP.malachite,PP.sap,0.4),0.14);
TEX.kelp    =mkTex(g=>{ for(let y=0;y<16;y+=FG)for(let x=0;x<16;x+=FG){ const base=(x%5<2)?KELP_D:KELP_L; const c=jit(base,26,x*7+y*3); Pf(g,x,y,rgb(c[0],c[1],c[2])); } });
TEX.seagrass=mkTex(g=>{ for(let y=0;y<16;y+=FG)for(let x=0;x<16;x+=FG){ const base=(x%4<2)?EEL_D:EEL_L; const c=jit(base,24,x*5+y*2); Pf(g,x,y,rgb(c[0],c[1],c[2])); } });
TEX.coral   =mkTex(g=>{ for(let y=0;y<16;y+=FG)for(let x=0;x<16;x+=FG){ const n=hash2(x*2.1+y*3.3,y*1.7+x*0.7); const v=n>0.72?150:n>0.42?208:246; const c=jit([v,v,v],18,x+y*4); Pf(g,x,y,rgb(c[0],c[1],c[2])); } });
TEX.sponge  =mkTex(g=>speckle(g,PAL.mix(PP.ochre,PP.saffron,0.3),28,PAL.shade(PP.darkOchre,0.96),0.4));

/* ================= THE DEEP — DIVE & DISCOVER THE SEA =================
   Below the waves lies a world of its own: a bumpy seabed that plunges into
   trenches in the open ocean, forests of kelp and coral, schools of fish and
   squid, rising bubbles, and wrecks of the ancients grown over with the sea.
   From open water the traveller dives (C), swims in three dimensions
   (W/S · A/D · SPACE up · SHIFT down), and comes up again to draw breath. */
const DIVE_TURN=1.7, DIVE_MAXSP=155, DIVE_VMAX=125, DIVE_VACC=320, SEA_SURF=WATER_Y;
let diveHintShown=false, deepShown=false, swimDeepHintShown=false;
const seenDeeps=new Set();   /* a named trench is worth the scene once */
/* ================= THE TRUE DEPTHS OF THE SEA =================
   The bed of the open ocean bottomed out at a hundred and sixteen metres —
   shallower than a great many lakes — and the gauge said so to the traveller's
   face. The sea now has its REAL depths, to the metre, on the one measure a
   man walks, swims and dives by (a block is a metre; every beast is built to
   it and the gauge reports it):

       0 –   200 m   the sunlit water over the continental SHELF
     200 – 3,000 m   the continental SLOPE, falling away past the break
   3,000 – 6,000 m   the ABYSSAL PLAINS — the floor of the world ocean
   6,000 –11,000 m   the HADAL trenches, and the Challenger Deep at 10,935

   The average of the whole is near 3,700 m, as the true ocean's is. The bed
   is steep for it — the earth is drawn a kilometre to the block ACROSS and a
   metre to the block DOWN, so any true grade stands up a thousandfold — and
   the great slopes read as escarpments and the trenches as chasms. That is
   the price of true soundings on a walkable earth, and it is worth paying:
   what the gauge says is now what the sea is. */
const D_STRAND=13/6;      /* the bed at the water's very edge (SUBSEA_Y), in metres */
const D_BREAK=200;        /* the shelf break — the floor of the epipelagic */
const D_SLOPE_FOOT=3000;  /* the foot of the continental slope */
const D_PLAIN_MIN=3500, D_PLAIN_MAX=5400;    /* the abyssal plains */
/* the shelf is read off the SHOAL field, which is fine-grained and reaches
   4.5 map pixels (some 88 km) — the true width of a continental shelf; the
   slope and the rise are read off the coarser offshore reach beyond it */
const O_SHELF=4.5/OFF_PX, O_SLOPE=0.62;
/* how far the shoal field reaches out from any shore, in world units: 4.5 map
   pixels at ~117 units each — the true width of a continental shelf */
const SHOAL_REACH=4.5*117;
/* how near the surface the bed of the open sea may EVER come. Nothing that is
   not on the chart is allowed to break the water. */
const SB_MIN_M=180;
/* ---- THE ZONES OF THE DEEP, by their true bounds in metres ---- */
const SEA_ZONES=[[200,'EPIPELAGIC'],[1000,'MESOPELAGIC'],[4000,'BATHYPELAGIC'],
                 [6000,'ABYSSOPELAGIC'],[1e9,'HADAL']];
function seaZone(m){ for(const z of SEA_ZONES) if(m<z[0]) return z[1]; return 'HADAL'; }
/* the depth of the bed at a place, in METRES below the waterline */
function seabedMetres(x,z){
  /* ---- THE ABYSSAL PLAIN ----
     Long, low swells three and a half to five and a half kilometres down.
     The wavelength is deliberately vast (some four kilometres as a swimmer
     measures it): at any shorter one, a two-kilometre change of depth stands
     up as a sheer wall, and the flattest place on earth would read as a
     badland. */
  const basin=fbm(x*0.00026-5,z*0.00026+9);
  let m=D_PLAIN_MIN+basin*(D_PLAIN_MAX-D_PLAIN_MIN);
  /* the unnamed troughs of the open sea, between the named deeps */
  const tr=Math.pow(Math.max(0,fbm(x*0.0016+30,z*0.0016)-0.62)/0.38,1.8);
  if(tr>0.001) m+=tr*Math.max(0,7200-m);
  /* ---- SHELF · SLOPE · RISE ----
     Out from the strand: the SHELF, near flat under the clear water and
     steepening to the break at 200 m; the SLOPE falling away past it to
     3,000; then the RISE levelling out into the plain.
     The shelf is drawn ^2.6 on purpose. A true shelf falls at a tenth of a
     degree for eighty kilometres and then breaks: draw it as a straight ramp
     and the reefs, the kelp and the whole clear-water shallows are crushed
     into a ribbon a few paces wide at the beach. */
  const o=offshoreAt(x,z);
  const s0=shoalAt(x,z);
  if(s0>0.004){ const p=1-Math.pow(s0,1/1.2);          /* 0 at the strand, 1 at the break */
    const dOff=p*SHOAL_REACH;                          /* how far out to sea, in units */
    const Bh=beachAt(x,z);
    let sm;
    if(dOff<Bh.wadeR){
      /* ---- THE WADING SHELF ----
         Near flat, and it takes the first stretch of every coast. A man walks
         out across it; a village stands in it. It falls as the SQUARE of the
         distance, so it is flattest of all right at the water's edge where
         the children are. */
      const q=dOff/Bh.wadeR;
      sm=D_STRAND+(Bh.wadeM-D_STRAND)*q*q;
      /* sandbars and runnels within it — a wading floor is not a table */
      sm+=(fbm(x*0.05+31,z*0.05-17)-0.5)*Bh.roll;
      if(sm<0.4) sm=0.4; }
    else {
      /* and only past it does the ground begin to fall away to the break */
      const q=(dOff-Bh.wadeR)/Math.max(1,SHOAL_REACH-Bh.wadeR);
      sm=Bh.wadeM+(D_BREAK-Bh.wadeM)*Math.pow(q,2.6); }
    if(sm<m) m=sm; }
  else if(o<1){ let sm;
    if(o<O_SLOPE){ const p=Math.min(1,Math.max(0,(o-O_SHELF)/(O_SLOPE-O_SHELF)));
      sm=D_BREAK+(D_SLOPE_FOOT-D_BREAK)*(p*p*(3-2*p)); }
    else { const p=(o-O_SLOPE)/(1-O_SLOPE); sm=D_SLOPE_FOOT+(m-D_SLOPE_FOOT)*(p*p*(3-2*p)); }
    if(sm<m) m=sm; }
  /* ---- the roll of the floor itself, in the measure a swimmer sees ----
     rock and dune and terrace: tens of metres over a hundred, no more, so the
     floor is mostly plain with terraces standing in it, as a sea bed is. */
  m+=(fbm(x*0.006+11,z*0.006-7)-0.5)*Math.min(34,m*0.5)
    +(fbm(x*0.021-3,z*0.021+6)-0.5)*Math.min(7,m*0.2);
  /* ---- SEAMOUNTS — the ridges and guyots of the open bed ----
     NO MOUNTAIN THAT IS NOT ON THE EARTH. The rise is FOLDED: a seamount may
     climb most of the way up the water column it stands in and approaches the
     room there is without ever passing it — so the bed keeps its relief, and
     what stands above the water is the land of the earth and nothing else. */
  const ridge=Math.pow(Math.max(0,fbm(x*0.003+70,z*0.003-40)-0.47)/0.53,1.7);
  /* and they belong to the OPEN sea: a seamount raised on the shelf would be
     a hill of rock standing in the clear water off every beach in the world */
  const peak=ridge*(900+fbm(x*0.011-3,z*0.011+6)*1800)*Math.max(0,1-s0*5);
  const roomM=Math.max(0,m-SB_MIN_M);
  if(peak>0.001&&roomM>0.001) m-=roomM*(1-Math.exp(-peak/roomM));
  /* ---- THE NAMED DEEPS, AND THEY ARE THE LAST WORD ----
     They are cut AFTER the seamounts and after the roll, and nothing that
     comes later may fill them in. Put them in before the fold and the fold
     ate them: the Atacama lost two kilometres to a seamount that had no
     business standing in a trench, and a blue hole 124 m deep came out level
     with the reef around it.
     After the SHELF, though, because in truth they run close inshore (the
     Atacama lies but a hundred miles off Chile) — and eased across it, so no
     trench opens at anybody's beach. */
  const td=trenchDepthAt(x,z);
  if(td>m) m+=(td-m)*Math.min(1,o/O_SHELF);
  /* and the blue holes, which belong to the shelf and are not eased at all */
  if(HOLES.length) m+=holeCutAt(x,z);
  return Math.max(0.5,m); }
/* ONE sea, one bed: at the strand the shelf profile comes out at D_STRAND,
   which IS the foot of the land (SUBSEA_Y, where every island's flank is cut
   off), so a swimmer can walk down a coastal flank and keep going — sand at
   the water's edge, sloping away seamlessly into the kelp and the coral. */
function seabedDepth(x,z){
  let y=SEA_SURF-seabedMetres(x,z)*U_PER_M;
  if(shoalAt(x,z)>0.02) y=Math.min(y,SEA_SURF-6);   /* nothing breaches the water where a coast is near */
  return y; }
/* ---- WHERE A BEAST MAY LIE ----
   Every swimming thing was anchored to the BED — three units off the sand,
   thirty off it, whatever its bulk asked. That was well while the bed was
   ninety metres down; with the true ocean beneath it, it puts dolphins on the
   abyssal plain and reef fish in the hadal dark. A beast is anchored now to
   the higher of the bed and its own deepest haunt, so the sunlit water keeps
   its own and the trenches are left to the things that belong in them. */
/* ---- THE TOP OF THE BED, AS IT IS ACTUALLY DRAWN ----
   seabedDepth is the smooth height FIELD. The sea floor the eye sees is not
   smooth: it is blocks, snapped to the block grid exactly as the land is
   (see sbBlockY). Everything that must MEET the floor — the diver's feet,
   the clearance every swimming thing keeps over the sand — was reading the
   field instead of the blocks, and the two differ by up to half a block. So
   the diver swam through the face of the bed, and the octopus stood with
   half her bulk inside it. There is one bed now, and this is its top. */
function bedTop(x,z){ return Math.round(seabedDepth(x,z)/B)*B; }
function haunt(x,z,maxM){ return Math.max(bedTop(x,z), SEA_SURF-maxM*U_PER_M); }
const H_REEF=90, H_FISH=220, H_DOLPHIN=180, H_SHARK=280, H_SQUID=650, H_JELLY=700, H_WHALE=320;
/* ================= THE BED OF THE SEA IS BLOCKS =================
   It was a SMOOTH SHEET — a plane pushed up and down by the depth field and
   given averaged normals — while every other thing in the world is lego. So
   the diver swam over rolling dunes with no edge anywhere on them, in a game
   whose whole face is blocks, and the sea floor was the one place that gave
   the lie away.
   It is laid as BLOCKS now, at the true block of the world: a grid of cells
   one block wide, each taking one height off the depth field SNAPPED TO THE
   BLOCK GRID, and drawn as a flat top with four walls dropping to whatever
   its neighbours stand at. Step down a terrace and there is a wall there, cut
   square. Nothing is interpolated and nothing is smoothed.
   Every cell also takes a KIND — sand, gravel, clay, dark rock — off the same
   noise the world is made of, so the floor reads as the speckled checkerboard
   of a real sea bed rather than one flat sheet of sand. */
const SB_CS=B;                        /* a cell is one block, as it is ashore */
const SB_N=112;                       /* cells to a side */
const SB_SIZE=SB_CS*SB_N;             /* 672 units of floor about the diver */
const SB_CELLS=SB_N*SB_N;
/* eight vertices to a cell: four at the top, four dropped to the skirt, so
   the top is FLAT and the walls are UPRIGHT. Nothing is shared between one
   cell and the next — that is what keeps the edges square. */
const SB_NV=SB_CELLS*8;
const sbGeo=(()=>{
  const g=new THREE.BufferGeometry();
  const pos=new Float32Array(SB_NV*3), col=new Float32Array(SB_NV*3);
  const uv=new Float32Array(SB_NV*2);
  const idx=new Uint32Array(SB_CELLS*30);
  const half=SB_SIZE/2;
  let ii=0;
  for(let j=0;j<SB_N;j++) for(let i=0;i<SB_N;i++){
    const c=(j*SB_N+i), o=c*8;
    const x0=-half+i*SB_CS, x1=x0+SB_CS, z0=-half+j*SB_CS, z1=z0+SB_CS;
    /* 0..3 the top, 4..7 the skirt directly beneath them */
    const cx=[x0,x1,x1,x0], cz=[z0,z0,z1,z1];
    /* ONE WHOLE TEXTURE TO A BLOCK, as it is ashore — the sixteen pixels of
       sand run across each block face and start again at the next, so the
       floor is a grid of blocks and not one sheet of stretched sand. The
       skirt carries the same u/v as the top corner above it, so a wall shows
       that block's own face down its side. (The u/v themselves are written
       with the bed each rebuild — see below — because they say WHICH KIND of
       ground this block is, and that changes as he swims.) */
    for(let q=0;q<4;q++){
      pos[(o+q)*3]=cx[q];   pos[(o+q)*3+2]=cz[q];
      pos[(o+4+q)*3]=cx[q]; pos[(o+4+q)*3+2]=cz[q]; }
    /* the top, wound face up */
    idx[ii++]=o+0; idx[ii++]=o+2; idx[ii++]=o+1;
    idx[ii++]=o+0; idx[ii++]=o+3; idx[ii++]=o+2;
    /* and the four walls, each from its top edge down to the skirt */
    for(let q=0;q<4;q++){ const a2=o+q, b2=o+(q+1)%4, a3=o+4+q, b3=o+4+(q+1)%4;
      idx[ii++]=a2; idx[ii++]=b2; idx[ii++]=a3;
      idx[ii++]=b2; idx[ii++]=b3; idx[ii++]=a3; }
  }
  g.setAttribute('position',new THREE.BufferAttribute(pos,3));
  g.setAttribute('color',new THREE.BufferAttribute(col,3));
  g.setAttribute('uv',new THREE.BufferAttribute(uv,2));
  g.setIndex(new THREE.BufferAttribute(idx,1));
  return g;
})();
/* ---- THE FACES OF THE SEA FLOOR, IN ONE SHEET ----
   The bed wore a neutral grain and took its colour from a vertex tint, which
   gave the SHAPE of blocks but not the FACE of one: sand, gravel and clay all
   had the same grain and differed only in wash. They are drawn now as they
   are ashore — real sixteen-pixel faces, each block wearing its own — and
   because the whole floor is one mesh in one draw call they are laid side by
   side in a single sheet, four across and two down, and each block is given
   the corner of the sheet that belongs to its kind.
   No mipmaps: an atlas blurred down bleeds one tile into its neighbour, and
   sand would fringe with gravel. Nearest, as minecraft does. */
const SB_ATLAS_W=4, SB_ATLAS_H=2, SB_TILE=16;
const sbTex=(()=>{
  const c=texCanvas(SB_ATLAS_W*SB_TILE,SB_ATLAS_H*SB_TILE);
  const g=c.getContext('2d');
  /* draw one tile at slot n with a per-pixel painter */
  const tile=(n,paint)=>{ const ox=(n%SB_ATLAS_W)*SB_TILE, oy=Math.floor(n/SB_ATLAS_W)*SB_TILE;
    for(let y=0;y<SB_TILE;y++) for(let x=0;x<SB_TILE;x++){
      const col=paint(x,y); g.fillStyle=col; g.fillRect(ox+x,oy+y,1,1); } };
  const sh=(base,amt,seed)=>{ const c2=jit(base,amt,seed); return rgb(c2[0],c2[1],c2[2]); };
  /* 0 — SEA SAND: fine, pale, evenly grained */
  tile(0,(x,y)=>sh([222,209,170],16,x*7.1+y*3.3));
  /* 1 — GRAVEL: coarse grey stones of two sizes */
  tile(1,(x,y)=>{ const n=hash2(x*2.3+y*5.1,y*1.7+x*0.9);
    const b=n>0.78?150:n>0.5?178:n>0.22?196:166; return sh([b,b-4,b-10],12,x+y*5); });
  /* 2 — CLAY: smooth, blue-grey, faintly banded */
  tile(2,(x,y)=>{ const band=(y%4===0)?-10:0; return sh([150,166,182+band],9,x*3.7+y*2.1); });
  /* 3 — DARK ROCK of the deeps, near black and flecked */
  tile(3,(x,y)=>{ const n=hash2(x*1.9+y*4.3,y*2.7); const b=n>0.86?96:70;
    return sh([b,b+8,b+16],10,x*5+y); });
  /* 4 — WEEDED GROUND: sand under a mat of dull olive growth */
  tile(4,(x,y)=>{ const n=hash2(x*3.1+y*1.3,y*2.9+x*0.7);
    return n>0.42?sh([96,124,74],18,x+y*3):sh([176,168,132],14,x*2+y); });
  /* 5 — PRISMARINE: the green-blue stone of the sea, in a woven check */
  tile(5,(x,y)=>{ const q=((x>>2)+(y>>2))&1, b=q?[86,140,132]:[74,124,118];
    const n=hash2(x*2.1,y*3.3); return sh(n>0.8?[104,158,148]:b,10,x*4+y); });
  /* 6 — SHELL SAND, shot through with broken white */
  tile(6,(x,y)=>{ const n=hash2(x*4.7+y*2.2,y*1.1);
    return n>0.88?sh([238,234,222],8,x+y):sh([214,200,162],15,x*3+y*2); });
  /* 7 — DEAD CORAL RUBBLE, pale and knobbled */
  tile(7,(x,y)=>{ const n=hash2(x*1.3+y*3.9,y*2.3+x*1.7);
    return n>0.7?sh([206,196,188],14,x+y*4):sh([176,162,152],12,x*2+y*3); });
  const t=new THREE.CanvasTexture(c);
  t.magFilter=THREE.NearestFilter; t.minFilter=THREE.NearestFilter;
  t.generateMipmaps=false; t.wrapS=t.wrapT=THREE.ClampToEdgeWrapping;
  t.needsUpdate=true; return t;
})();
/* where each kind's tile sits in the sheet, in uv */
const SB_UV=[];
for(let n=0;n<SB_ATLAS_W*SB_ATLAS_H;n++){
  const cx=n%SB_ATLAS_W, cy=Math.floor(n/SB_ATLAS_W);
  /* a half-texel inset, so no filtering ever reaches into the next tile */
  const e=0.5/(SB_ATLAS_W*SB_TILE), f=0.5/(SB_ATLAS_H*SB_TILE);
  SB_UV.push([cx/SB_ATLAS_W+e,(cx+1)/SB_ATLAS_W-e,
              1-(cy+1)/SB_ATLAS_H+f,1-cy/SB_ATLAS_H-f]); }
/* THE SAME KIND OF MATERIAL THE LAND WEARS — unlit, vertex-shaded, so a face
   is exactly as bright as its colour says and no averaged normal can round a
   corner off. (A lambert bed with computed normals smoothed every edge it
   had, which is half of why it never looked like blocks.) */
const seaFloor=new THREE.Mesh(sbGeo,
  new THREE.MeshBasicMaterial({map:sbTex,vertexColors:true}));
seaFloor.visible=false; seaFloor.frustumCulled=false; scene.add(seaFloor);
/* THE KINDS OF GROUND UNDER THE SEA, and the colour each reads as. */
/* the colour the water itself lends to everything under it. The KIND is in
   the block's face now, so all that is left for the vertex tint is the light
   (which fails with depth) and the cold of the water. */
const SB_WATER=[0.42,0.62,0.70], SB_COOL=0.20;
let _sbAt=null;
/* THE BED IS LAID OVER MANY FRAMES AND SWAPPED IN WHOLE — a cell at a time
   into a spare pair of buffers, on a threshold of real travel; the bed on
   screen keeps its old shape and its old anchor until the last cell is ready.
   A half-built bed is never shown. */
const _sbP=new Float32Array(SB_NV*3), _sbC=new Float32Array(SB_NV*3);
const _sbU=new Float32Array(SB_NV*2);
const SB_MS=4;                  /* the slice of a frame the rebuild may take */
const SB_STEP=44;               /* how far he must swim before it is rebuilt */
let _sbJob=null;
/* the height of the bed at a cell, SNAPPED to the block grid */
function sbBlockY(wx,wz){ return Math.round(seabedDepth(wx,wz)/B)*B; }
function updateSeaFloor(px,pz,force){
  /* The very first bed has nothing to stand in for it, so it is built whole
     before the frame is drawn rather than showing a flat sheet for a moment —
     and so is a bed that has been LEFT BEHIND. He may surface here and go down
     again a world away; there is no old bed to keep the view while the new one
     is laid, so it is paid for at once. */
  const lag=_sbAt?Math.hypot(_sbAt[0]-px,_sbAt[1]-pz):0;
  const whole=force||!_sbAt||lag>SB_SIZE*0.25;
  /* ---- THE BED KEEPS ITS BLOCKS BETWEEN REBUILDS ----
     The patch was re-anchored to the RAW eye position, so each rebuild
     sampled the height field on a lattice offset ~2 units from the last —
     every block on the sea floor changing height and colour at once, the
     whole bed reflowing every 44 units swum. The anchor now snaps to the
     block grid, so a cell keeps its world identity across rebuilds and only
     the newly-entered edge rows are new ground. */
  const sbx=Math.round(px/SB_CS)*SB_CS, sbz=Math.round(pz/SB_CS)*SB_CS;
  if(!_sbJob){
    if(!whole&&(lag<SB_STEP||(_sbAt[0]===sbx&&_sbAt[1]===sbz))) return;
    /* the cell heights are read once for the whole patch, so a wall may be
       cut down to exactly what its neighbour stands at */
    _sbJob={px:sbx,pz:sbz,j:0,h:new Float32Array(SB_CELLS),k:new Uint8Array(SB_CELLS),cov:new Uint8Array(SB_CELLS),pass:0};
  } else if(whole||Math.hypot(_sbJob.px-px,_sbJob.pz-pz)>SB_SIZE*0.25){
    _sbJob={px:sbx,pz:sbz,j:0,h:new Float32Array(SB_CELLS),k:new Uint8Array(SB_CELLS),cov:new Uint8Array(SB_CELLS),pass:0}; }
  const J=_sbJob, t0=performance.now(), half=SB_SIZE/2;
  /* ---- first pass: the height and the kind of every cell ---- */
  while(J.pass===0&&J.j<SB_N){
    const j=J.j++;
    for(let i=0;i<SB_N;i++){
      const wx=J.px-half+(i+0.5)*SB_CS, wz=J.pz-half+(j+0.5)*SB_CS;
      const c=j*SB_N+i;
      J.h[c]=sbBlockY(wx,wz);
      /* ---- ONE FLOOR, NOT TWO ----
         Near a coast the chunk mesher lays its own blocky shelf on exactly
         this ground, from exactly this depth field, and two meshes at one
         height tear at each other. So this bed gives that ground up — but
         ONLY where the shelf truly stands, or the floor opens out from under
         a diver over any deep water near a coast. The two read one test. */
      J.cov[c]=chunkShelfHere(wx,wz,J.h[c])?1:0;
      /* the depth of this block, in METRES — a block is a metre in the
         measure a man swims and dives by, and the sea now has its true
         soundings, so every band below is the real one */
      const dm=(SEA_SURF-J.h[c])/U_PER_M;
      const n1=fbm(wx*0.03+3,wz*0.03+7), n2=fbm(wx*0.011-5,wz*0.011+2);
      let kind=0;
      if(dm>1000) kind=3;                         /* below the last light — the dark rock of the deeps */
      else if(n2>0.62) kind=2;                    /* clay beds */
      else if(n2<0.36) kind=1;                    /* gravel */
      else if(n2>0.545) kind=6;                   /* shell sand */
      if(dm>200&&dm<=1000&&n1>0.58) kind=5;       /* prismarine down the slopes */
      if(n1>0.74&&dm<25) kind=4;                  /* weeded ground in the shallows */
      if(dm<12&&n1<0.30) kind=7;                  /* coral rubble on the reef flats */
      J.k[c]=kind;
    }
    if(!whole&&performance.now()-t0>=SB_MS) return;
  }
  if(J.pass===0){ J.pass=1; J.j=0; }
  /* ---- second pass: cut the blocks, their tops and their walls ---- */
  while(J.j<SB_N){
    const j=J.j++;
    for(let i=0;i<SB_N;i++){
      const c=j*SB_N+i, o=c*8;
      if(J.cov[c]){        /* the chunks have this ground — sink out of the way */
        for(let q=0;q<4;q++){ _sbP[(o+q)*3+1]=SUBSEA_Y-460; _sbP[(o+4+q)*3+1]=SUBSEA_Y-462;
          const t0=(o+q)*3, t1=(o+4+q)*3;
          _sbC[t0]=_sbC[t0+1]=_sbC[t0+2]=0; _sbC[t1]=_sbC[t1+1]=_sbC[t1+2]=0;
          _sbU[(o+q)*2]=_sbU[(o+q)*2+1]=0; _sbU[(o+4+q)*2]=_sbU[(o+4+q)*2+1]=0; }
        continue; }
      const y=J.h[c];
      /* the skirt drops to the LOWEST neighbour, so the wall is exactly as
         tall as the step down and never a gap nor a wasted face */
      let low=y;
      if(i>0)      low=Math.min(low,J.h[c-1]);
      if(i<SB_N-1) low=Math.min(low,J.h[c+1]);
      if(j>0)      low=Math.min(low,J.h[c-SB_N]);
      if(j<SB_N-1) low=Math.min(low,J.h[c+SB_N]);
      const skirt=Math.min(low,y)-0.5;
      for(let q=0;q<4;q++){ _sbP[(o+q)*3+1]=y; _sbP[(o+4+q)*3+1]=skirt; }
      /* the colour of this block: its kind, dimmed with the depth (the light
         does not reach the trenches) and jittered a little block by block, as
         a minecraft floor is never two blocks exactly alike */
      /* THE BLOCK'S OWN FACE, taken out of the sheet by its kind */
      const T=SB_UV[J.k[c]];
      const uu=[T[0],T[1],T[1],T[0]], vv=[T[2],T[2],T[3],T[3]];
      for(let q=0;q<4;q++){
        _sbU[(o+q)*2]=uu[q];     _sbU[(o+q)*2+1]=vv[q];
        _sbU[(o+4+q)*2]=uu[q];   _sbU[(o+4+q)*2+1]=vv[q]; }
      /* the light does not reach the trenches, and it fails on its TRUE
         measure: all but spent by 200 m, wholly gone by 1,000 */
      const dm2=(SEA_SURF-y)/U_PER_M, lit=0.34+0.62*Math.max(0,1-dm2/900);
      const jr=0.94+0.12*hash2(i*1.7+j*0.3,j*2.1-i*0.7);
      /* THE WATER LENDS ITS OWN COLOUR to everything beneath it — but by
         MIXING toward the blue of the sea, not by pulling the red channel
         down. Scaling the channels turned sand (whose green already stands
         over its blue) to pond-weed olive, and the whole floor with it. */
      const m=SB_COOL, im=1-m;
      let r =(lit*jr)*im + SB_WATER[0]*m*lit;
      let g2=(lit*jr)*im + SB_WATER[1]*m*lit;
      let b2=(lit*jr)*im + SB_WATER[2]*m*lit;
      /* THE EDGE OF THE PATCH DISSOLVES INTO THE WATER. The bed is a moving
         square 672 across; under the waves the water-fog ends the view well
         inside it, but seen from a DECK through the clear shallows its rim
         stood as a hard square cut in the sand, sliding along with the ship.
         The outer cells lean wholly into the water's own colour now, so the
         floor is lost by degrees into blue — ground fading into deep water —
         and never ends on a line. */
      const eN=SB_N-1, ecl=Math.min(Math.min(i,eN-i),Math.min(j,eN-j));
      const ef=Math.min(1,ecl/9);
      r =r *ef + SB_WATER[0]*lit*(1-ef);
      g2=g2*ef + SB_WATER[1]*lit*(1-ef);
      b2=b2*ef + SB_WATER[2]*lit*(1-ef);
      for(let q=0;q<4;q++){ const t=(o+q)*3;
        _sbC[t]=r; _sbC[t+1]=g2; _sbC[t+2]=b2; }
      /* THE SIDE OF A BLOCK IS DARKER THAN ITS TOP, as it is ashore — that
         shading is what makes a stair of blocks read as a stair (the skirt
         fade eases toward 1 at the rim so the walls dissolve with the tops) */
      const sd=0.58+0.42*(1-ef);
      for(let q=0;q<4;q++){ const t=(o+4+q)*3;
        _sbC[t]=r*sd; _sbC[t+1]=g2*sd; _sbC[t+2]=b2*sd; }
    }
    if(!whole&&performance.now()-t0>=SB_MS) return;
  }
  /* done — the new bed takes the place of the old one in a single step */
  const pa=sbGeo.attributes.position.array, ca=sbGeo.attributes.color.array;
  for(let v=0;v<SB_NV;v++) pa[v*3+1]=_sbP[v*3+1];
  ca.set(_sbC); sbGeo.attributes.uv.array.set(_sbU);
  /* the mesh is anchored WHERE ITS DATA WAS BUILT. Each cell holds a local
     x/z and an absolute world y, so moving the mesh without rebuilding would
     drag the whole sea bed along behind the swimmer. */
  seaFloor.position.set(J.px,0,J.pz);
  _sbAt=[J.px,J.pz]; _sbJob=null;
  sbGeo.attributes.position.needsUpdate=true; sbGeo.attributes.color.needsUpdate=true;
  sbGeo.attributes.uv.needsUpdate=true; }
/* ---- kelp — tall strands rising from the floor, swaying with the current ---- */
const kelpMat=new THREE.MeshLambertMaterial({map:TEX.kelp,side:THREE.DoubleSide});
function makeKelp(){ const g=new THREE.Group(), segs=[];
  for(let s=0;s<5;s++){ const seg=new THREE.Mesh(new THREE.BoxGeometry(1.1,7,1.1),kelpMat); seg.position.y=s*7+3.5; g.add(seg); segs.push(seg); }
  g.userData={segs}; return g; }
const KELP=[], KELP_N=90, KELP_R=330;
function initKelp(){ if(KELP.length) return; for(let k=0;k<KELP_N;k++){ const m=makeKelp(); m.visible=false; scene.add(m);
  KELP.push({m,x:0,z:0,fy:0,h:0,ph:Math.random()*6.28,set:false}); } }
function placeKelp(k,px,pz){ for(let tr=0;tr<6;tr++){ const a=Math.random()*6.28, r=140+Math.random()*(KELP_R-140);
    const x=px+Math.cos(a)*r, z=pz+Math.sin(a)*r, fy=seabedDepth(x,z), d=(SEA_SURF-fy)/U_PER_M;
    /* kelp is rooted in the sunlit water and grows to some forty-five metres
       — it has no business standing on the abyssal plain.
       Never set down nearer than 140 (a strand snapping into being an arm's
       length from the mask is the sharpest pop in the deep), and it GROWS
       up out of the bed over the first moment rather than standing whole. */
    if(d>6 && d<50 && fbm(x*0.012+50,z*0.012-20)>0.5){ k.x=x; k.z=z; k.fy=fy;
      k.h=Math.min(SEA_SURF-fy-6,(14+Math.random()*31)*U_PER_M); k.set=true; k.age=0; k.sy=k.h/35;
      k.m.position.set(x,fy,z); k.m.scale.set(0.7+Math.random()*0.6,k.sy*0.1,0.7+Math.random()*0.6); k.m.visible=true; return; } }
  k.set=false; k.m.visible=false; }
/* ---- THE CURRENT OF THE SEA ----
   One slow, wandering flow that all the weed of the sea leans and streams with
   TOGETHER, so a kelp forest moves as a forest and not as a thousand separate
   blades each on its own clock. The kelp and the seagrass are the 'things' that
   move with the current (js/behavior.js names them so). */
function seaCurrent(t){
  const dir=Math.sin(t*0.05)*0.8+Math.sin(t*0.017+1.3)*0.5;   /* the lean, wandering */
  const str=0.55+0.45*Math.sin(t*0.03+0.7);                   /* the surge, low to full */
  return {dir,str};
}
function updateKelp(px,pz,t){ initKelp(); const cur=seaCurrent(t); for(const k of KELP){
    if(!k.set||Math.hypot(k.x-px,k.z-pz)>KELP_R+90) placeKelp(k,px,pz);
    if(!k.set) continue;
    if(k.age!==undefined&&k.age<1){ k.age=Math.min(1,k.age+0.02);      /* the growing-in */
      k.m.scale.y=k.sy*(0.1+0.9*k.age); }
    /* its own slow ripple, and the shared lean of the current over it */
    const sw=(Math.sin(t*1.0+k.ph)*0.06+cur.dir*0.10)*cur.str, segs=k.m.userData.segs;
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
  /* the sea-pickles — the reef's own lanterns, dim by day and lit after dark.
     Each keeps its own phase so the reef breathes light, not blinks it. */
  const glows=[], nGlow=Math.random()<0.65?(1+Math.floor(Math.random()*3)):0;
  for(let i=0;i<nGlow;i++){ const gl=new THREE.Mesh(new THREE.BoxGeometry(0.9,1.3,0.9),
      new THREE.MeshBasicMaterial({color:0xcdf06a,fog:true}));
    gl.position.set((Math.random()-0.5)*8,Math.random()*9+1,(Math.random()-0.5)*8);
    gl.userData.ph=Math.random()*6.28; g.add(gl); glows.push(gl); }
  g.userData.glows=glows;
  return g; }
const CORAL=[], CORAL_N=34, CORAL_R=330;
function initCoral(){ if(CORAL.length) return; for(let k=0;k<CORAL_N;k++){ const m=makeCoral(); m.visible=false; scene.add(m); CORAL.push({m,x:0,z:0,set:false}); } }
function updateCoral(px,pz){ initCoral(); for(const r of CORAL){ if(!(r.set&&Math.hypot(r.x-px,r.z-pz)<=CORAL_R+90)){
    /* a reef head is never set down within 130 of the mask, and it builds
       itself up from the bed rather than standing whole in one frame */
    for(let tr=0;tr<7;tr++){ const a=Math.random()*6.28, rr=130+Math.random()*(CORAL_R-130), x=px+Math.cos(a)*rr, z=pz+Math.sin(a)*rr, d=SEA_SURF-seabedDepth(x,z);
      if(d>10 && d<45*U_PER_M && fbm(x*0.01-9,z*0.01+4)>0.44){   /* reefs live in the light — 45 m and no deeper */
        /* two heads set within each other's push-off rings teleported a
           diver back and forth between them for ever — a head keeps thirty
           units clear of its neighbours, so no two rings can overlap */
        let crowd=false;
        for(const q of CORAL){ if(q!==r&&q.set&&Math.hypot(q.x-x,q.z-z)<30){ crowd=true; break; } }
        if(crowd) continue;
        r.x=x; r.z=z; r.set=true; r.age=0; r.m.scale.setScalar(0.12); r.m.position.set(x,seabedDepth(x,z),z); r.m.rotation.y=Math.random()*6.28; r.m.visible=true; break; }
      if(tr===6){ r.set=false; r.m.visible=false; } } }
    if(r.set&&r.age!==undefined&&r.age<1){ r.age=Math.min(1,r.age+0.02); r.m.scale.setScalar(0.12+0.88*r.age); } }
  /* ---- THE SEA-PICKLES LIGHT UP AFTER DARK ----
     Bioluminescence — a faint thing by day and a lantern by night. Each pickle
     brightens as the light goes and breathes a slow pulse of its own, so the
     reef glows rather than blinks. (js/behavior.js marks coral a night-glower.) */
  const night=(worldNight||0), tt=performance.now()*0.001;
  for(const r of CORAL){ if(!r.set) continue; const gs=r.m.userData.glows; if(!gs||!gs.length) continue;
    for(const gl of gs){ const pulse=0.72+0.28*Math.sin(tt*1.6+gl.userData.ph);
      const bri=(0.16+0.84*night)*pulse;   /* dim green by day; full lantern by night */
      gl.material.color.setRGB(0.80*bri,0.94*bri,0.42*bri); } } }
/* ---- seagrass — short tufts carpeting the shallow floor ---- */
const seagrassMat=new THREE.MeshLambertMaterial({map:TEX.seagrass,side:THREE.DoubleSide});
function makeSeagrass(){ const g=new THREE.Group(), n=3+Math.floor(Math.random()*4);
  for(let i=0;i<n;i++){ const bl=new THREE.Mesh(new THREE.BoxGeometry(0.6,2+Math.random()*2.6,0.6),seagrassMat);
    bl.position.set((Math.random()-0.5)*3.2,1.2,(Math.random()-0.5)*3.2); bl.rotation.z=(Math.random()-0.5)*0.4; g.add(bl); } return g; }
/* the seagrass on the bed of the sea. (It was called GRASS, which is now
   the name of the file that owns the grass of the DRY land — and the two
   quietly shadowed one another, so every beast ashore read the seagrass
   pool and found no sward anywhere in the world.) */
const SEAGRASS=[], SEAGRASS_N=200, SEAGRASS_R=300;
function initSeagrass(){ if(SEAGRASS.length) return; for(let k=0;k<SEAGRASS_N;k++){ const m=makeSeagrass(); m.visible=false; scene.add(m); SEAGRASS.push({m,x:0,z:0,ph:Math.random()*6.28,set:false}); } }
function updateSeagrass(px,pz,t){ initSeagrass(); const cur=seaCurrent(t); for(const r of SEAGRASS){ if(!r.set||Math.hypot(r.x-px,r.z-pz)>SEAGRASS_R+70){
      /* the tufts keep off the diver's own patch of sand (90+) and sprout
         up out of it rather than appearing full-grown */
      for(let tr=0;tr<5;tr++){ const a=Math.random()*6.28, rr=90+Math.random()*(SEAGRASS_R-90), x=px+Math.cos(a)*rr, z=pz+Math.sin(a)*rr, d=SEA_SURF-seabedDepth(x,z);
        if(d>6 && d<30*U_PER_M){ r.x=x; r.z=z; r.set=true; r.age=0; r.m.scale.y=0.1; r.m.position.set(x,seabedDepth(x,z),z); r.m.visible=true; break; } if(tr===4){ r.set=false; r.m.visible=false; } } }
    if(r.set){ if(r.age!==undefined&&r.age<1){ r.age=Math.min(1,r.age+0.025); r.m.scale.y=0.1+0.9*r.age; }
      r.m.rotation.z=(Math.sin(t*1.3+r.ph)*0.07+cur.dir*0.12)*cur.str; } } }
/* ---- god-rays — shafts of light slanting down from the surface ---- */
const RAYS=[], RAY_N=9;
function initRays(){ if(RAYS.length) return; for(let k=0;k<RAY_N;k++){
    const m=new THREE.Mesh(new THREE.PlaneGeometry(22,520),
      new THREE.MeshBasicMaterial({color:0xcdeeff,transparent:true,opacity:0,blending:THREE.AdditiveBlending,depthWrite:false,fog:false,side:THREE.DoubleSide}));
    m.visible=false; scene.add(m); RAYS.push({m,x:0,z:0,rot:Math.random()*6.28,tilt:(Math.random()-0.5)*0.5}); } }
function updateRays(px,py,pz,murk){ initRays();
  /* THE SHAFTS KEEP THEIR DISTANCE. They are wide additive planes, and one
     standing ON the eye whited out the whole view — the floor, the reef and
     all — which is the brightest thing wrong with a shallow dive. They are
     re-cast no nearer than a hundred units, and thinned, so they light the
     water without drowning what is in it. */
  for(const r of RAYS){ const d=Math.hypot(r.x-px,r.z-pz);
    if(d>620||d<100){ const a=Math.random()*6.28, rr=140+Math.random()*380;
      r.x=px+Math.cos(a)*rr; r.z=pz+Math.sin(a)*rr; r.rot=Math.random()*6.28; }
    /* A SHAFT REACHES FROM THE SURFACE TO THE FLOOR, AND NO FURTHER. They
       were five hundred units tall wherever they stood, so over a shallow
       reef each one ran clean through the sea bed and out the bottom of the
       world — and looked at from a low angle, edge-on along its length, it
       burned as a great white column standing on the sand. Each is cut to
       the water column it stands in. */
    const bed=seabedDepth(r.x,r.z), col=Math.max(12,SEA_SURF-bed);
    r.m.scale.set(1,Math.min(1,col/520),1);
    r.m.position.set(r.x,SEA_SURF-col*0.5,r.z); r.m.rotation.set(r.tilt,r.rot,0.12);
    /* and they fade out as the eye comes up to them, so none is ever met */
    const near=Math.min(1,Math.max(0,(Math.hypot(r.x-px,r.z-pz)-90)/110));
    r.m.material.opacity=(1-murk)*0.05*near; r.m.visible=near>0.02; } }
/* ---- fish schools, squid, bubbles ---- */
/* the bright reef fish — doubled, because a living reef is never sparse */
const DIVEFISH=[], DF_N=60, DF_R=240;
const TROPICAL=[0xff8c2a,0xffd23a,0xff5a7a,0x3ad0ff,0x8a5cff,0xf4f4f4,0x2fd08a,0xff4d4d];
/* ================= THE SHOALS OF THE SEA =================
   The bright reef fish above is every fish there was: one palm-sized shape in
   eight colours, in every water on the face of the earth, from the Arctic to
   the Line. The sea has its OWN NATIONS now, and each keeps to the water it
   belongs in — its latitude, its depth, and how near it stands to a coast.
     lat   the band of latitude it is found in
     m     the depth of water it keeps to, in metres
     n     how many swim together — a sardine bait-ball is not a cod
     tight how close they hold: 1 is a wall of fish, 0 is a loose scatter
     spd   how fast they run
   Add a creature file, add a line here, and that fish is in the sea. */
/* AND THEY BELONG TO THE DEEP. Set out in four metres of water, a school
   thirty units tall stood half of itself in the AIR: fish hanging over the
   swell beside the ship, which is what the shallows cost. Every nation of
   them now wants real water under it — the shallowest asks forty metres, so
   there is no shoal at all over the wading shelf where a village paddles. */
const SHOAL_KINDS=[
  {name:'sardine', n:26, lat:[-58,62],  m:[40,600],  tight:0.90, spd:17, R:220},
  {name:'mackerel',n:16, lat:[-52,66],  m:[45,700],  tight:0.62, spd:21, R:250},
  {name:'salmon',  n:9,  lat:[38,72],   m:[40,400],  tight:0.45, spd:19, R:240},
  {name:'salmon',  n:7,  lat:[-72,-38], m:[40,400],  tight:0.45, spd:19, R:240},
  {name:'cod',     n:6,  lat:[42,76],   m:[60,900],  tight:0.25, spd:9,  R:230, bed:true},
  {name:'tuna',    n:4,  lat:[-42,42],  m:[80,2000], tight:0.35, spd:30, R:300},
  /* the silver the whole sea lives on: the herring of the cold shelves and
     the anchovy of the warm coasts, in the tightest bait-balls of all */
  {name:'herring', n:22, lat:[36,74],   m:[40,500],  tight:0.88, spd:16, R:220},
  {name:'herring', n:14, lat:[-64,-36], m:[40,500],  tight:0.88, spd:16, R:220},
  {name:'anchovy', n:26, lat:[-46,48],  m:[40,300],  tight:0.94, spd:14, R:200},
];
/* how far under the skin of the sea the highest fish of a school may come.
   Nothing of a shoal is ever seen breaking the surface. */
const SHOAL_TOP=26;
const SHOALS=[];
function initShoals(){ if(SHOALS.length) return;
  for(const K of SHOAL_KINDS){ const fish=[];
    for(let k=0;k<K.n;k++){ const m=makeBeast(K.name);
      m.scale.setScalar(0.82+Math.random()*0.4); m.visible=false; scene.add(m);
      fish.push({m,ph:Math.random()*6.28,ox:0,oy:0,oz:0}); }
    SHOALS.push({K,fish,x:0,z:0,y:0,dir:Math.random()*6.28,set:false}); } }
/* is this water fit for this nation of fish? */
function shoalFits(K,x,z,dm){
  if(dm<K.m[0]||dm>K.m[1]) return false;
  const lat=90-(Math.hypot(x,z)/R_WORLD)*180;
  return lat>=K.lat[0]&&lat<=K.lat[1];
}
function updateShoals(px,py,pz,dt,t){ initShoals();
  for(const S of SHOALS){ const K=S.K;
    if(!S.set||Math.hypot(S.x-px,S.z-pz)>K.R+140){
      /* a few tries for water this nation will have; else it is simply not
         here, and nothing of it is shown */
      S.set=false;
      for(let tr=0;tr<5;tr++){ const a=Math.random()*6.28, r=60+Math.random()*K.R;
        const x=px+Math.cos(a)*r, z=pz+Math.sin(a)*r;
        if(landAtWorld(x,z)) continue;
        const fy=seabedDepth(x,z), dm=(SEA_SURF-fy)/U_PER_M;
        if(!shoalFits(K,x,z,dm)) continue;
        S.x=x; S.z=z; S.dir=Math.random()*6.28;
        /* THE SCHOOL IS FITTED TO THE WATER IT STANDS IN. A cod hangs over
           the ground; the rest run in the body of the column — but never in
           the top of it, and never taller than there is room for. */
        const col=SEA_SURF-fy;                       /* the whole column, in units */
        S.spread=Math.min((10+(1-K.tight)*60), Math.max(6,col*0.30));
        S.y=K.bed ? fy+10+Math.random()*Math.min(20,col*0.15)
                  : fy+col*(0.35+Math.random()*0.25);
        S.y=Math.min(S.y, SEA_SURF-SHOAL_TOP-S.spread*0.5);
        S.y=Math.max(S.y, fy+6+S.spread*0.5);
        for(const f of S.fish){ const sp=1-K.tight;
          f.ox=(Math.random()-0.5)*(24+sp*150); f.oy=(Math.random()-0.5)*S.spread;
          f.oz=(Math.random()-0.5)*(30+sp*180); }
        S.set=true; break; }
      if(!S.set){ for(const f of S.fish) f.m.visible=false; continue; } }
    /* the school turns as one thing, and swims as one thing — and when a
       shark has just torn through it, it BURSTS: the ball blows open, every
       fish flying wide and fast, and draws itself together again as the
       fright drains away. That burst is the oldest sight in the sea. */
    S.panic=Math.max(0,(S.panic||0)-dt);
    const panicF=Math.min(1,S.panic);
    S.dir+=Math.sin(t*0.31+S.fish[0].ph)*0.9*dt+(panicF?Math.sin(t*6.3+S.panic*4)*2.4*dt:0);
    const spd2=K.spd*(1+panicF*1.1);
    const nx=S.x+Math.cos(S.dir)*spd2*dt, nz=S.z+Math.sin(S.dir)*spd2*dt;
    if(!landAtWorld(nx,nz)){ S.x=nx; S.z=nz; } else S.dir+=2.1;
    const fy=seabedDepth(S.x,S.z), sp2=S.spread||20;
    /* the MIDDLE of the school was the only thing held under the water, and a
       school is not a point: a fish thirty units above the middle of it stood
       clean out in the air over the swell. Both are held now — the school by
       its own half-height, and then every fish in it on its own account. */
    S.y=S.y+Math.sin(t*0.5+S.fish[0].ph)*4*dt;
    /* ---- THE SCHOOL RISES IN THE DARK AND SINKS BY DAY ----
       The great vertical migration of the sea: the night-feeding nations (the
       sardine, the mackerel) climb toward the top after dark to feed on what
       has risen with them, and go back down into the safe blue by day. Read
       from js/behavior.js — a slow drift, never a jump. */
    { const B3=window.BEHAVIOR;
      if(B3&&B3.seaDayOf(K.name)==='night'){ const night2=(worldNight||0)>0.6;
        const top=SEA_SURF-SHOAL_TOP-sp2*0.5, low=fy+6+sp2*0.5;
        const ty=night2?top:(low+(top-low)*0.25);
        S.y+=(ty-S.y)*Math.min(1,dt*0.05); } }
    S.y=Math.min(S.y, SEA_SURF-SHOAL_TOP-sp2*0.5);
    S.y=Math.max(S.y, fy+6+sp2*0.5);
    const head=Math.atan2(Math.cos(S.dir),Math.sin(S.dir));
    const scat=1+panicF*2.4;                     /* the burst: the ball blown open */
    for(const f of S.fish){
      /* one that was truly taken is gone from the water for a while — the
         sea replaces it in time, but the bite was not a mime */
      if(f.gone){ f.gone-=dt; f.m.visible=false; if(f.gone<=0) f.gone=0; continue; }
      /* each keeps its own place in the school, and breathes about it */
      const wob=Math.sin(t*1.7+f.ph)*2.2;
      const c=Math.cos(S.dir), sn=Math.sin(S.dir);
      const fx=S.x+(f.oz*c-f.ox*sn)*scat, fz=S.z+(f.oz*sn+f.ox*c)*scat;
      const bed=seabedDepth(fx,fz);
      let fyy=S.y+f.oy+wob;
      if(fyy>SEA_SURF-SHOAL_TOP) fyy=SEA_SURF-SHOAL_TOP;   /* never out of the water */
      if(fyy<bed+3) fyy=bed+3;                             /* nor through the ground */
      f.m.position.set(fx, fyy, fz);
      f.m.rotation.y=head; f.m.rotation.z=Math.sin(t*3.1+f.ph)*0.12;
      if(f.m.userData.tail) f.m.userData.tail.rotation.y=Math.sin(t*6+f.ph)*0.35;
      f.m.visible=true; } } }
function hideShoals(){ for(const S of SHOALS){ S.set=false; for(const f of S.fish) f.m.visible=false; } }
function initDiveFish(){ if(DIVEFISH.length) return; for(let k=0;k<DF_N;k++){ const m=makeBeast('fish',TROPICAL[Math.floor(Math.random()*TROPICAL.length)]); m.scale.setScalar(0.6+Math.random()*0.8); m.visible=false; scene.add(m);
  DIVEFISH.push({m,x:0,z:0,y:0,dir:Math.random()*6.28,spd:9+Math.random()*11,ph:Math.random()*6.28,set:false}); } }
function updateDiveFish(px,py,pz,dt,t){ initDiveFish(); for(const f of DIVEFISH){
    if(!f.set||Math.hypot(f.x-px,f.z-pz)>DF_R+70){ const a=Math.random()*6.28, r=120+Math.random()*(DF_R-120); f.x=px+Math.cos(a)*r; f.z=pz+Math.sin(a)*r;
      const fy=haunt(f.x,f.z,H_FISH); f.y=Math.min(SEA_SURF-8,fy+12+Math.random()*Math.max(6,SEA_SURF-fy-16)); f.dir=Math.random()*6.28; f.set=true; f.m.visible=true; }
    f.dir+=Math.sin(t*0.5+f.ph)*0.04; f.x+=Math.cos(f.dir)*f.spd*dt; f.z+=Math.sin(f.dir)*f.spd*dt; f.y+=Math.sin(t*0.8+f.ph)*3*dt;
    const fy=haunt(f.x,f.z,H_FISH), col=SEA_SURF-fy;
    f.y=Math.min(SEA_SURF-6,Math.max(fy+Math.min(4,col-7),f.y));   /* the surface always wins — never above the waves */
    f.m.position.set(f.x,f.y,f.z); f.m.rotation.y=Math.atan2(Math.cos(f.dir),Math.sin(f.dir)); f.m.rotation.z=Math.sin(t*3+f.ph)*0.16; } }
const SQUIDS=[];
function initSquid(){ if(SQUIDS.length) return; for(let k=0;k<3;k++){ const m=makeBeast('squid'); m.visible=false; scene.add(m);
  SQUIDS.push({m,x:0,z:0,y:0,dir:Math.random()*6.28,ph:Math.random()*6.28,set:false}); } }
function updateSquid(px,py,pz,dt,t){ initSquid(); for(const q of SQUIDS){
    if(!q.set||Math.hypot(q.x-px,q.z-pz)>DF_R+140){ const a=Math.random()*6.28, r=90+Math.random()*DF_R; q.x=px+Math.cos(a)*r; q.z=pz+Math.sin(a)*r;
      const fy=haunt(q.x,q.z,H_SQUID); q.y=fy+22+Math.random()*40; q.dir=Math.random()*6.28; q.set=true; q.m.visible=true; }
    q.x+=Math.cos(q.dir)*6*dt; q.z+=Math.sin(q.dir)*6*dt; const pulse=0.5+0.5*Math.sin(t*3+q.ph); q.y+=(pulse-0.4)*8*dt;
    const fy=haunt(q.x,q.z,H_SQUID), col=SEA_SURF-fy;
    q.y=Math.min(SEA_SURF-10,Math.max(fy+Math.min(8,col-11),q.y));
    q.m.position.set(q.x,q.y,q.z); q.m.rotation.y=q.dir+Math.PI/2;
    q.m.userData.tents.forEach((tb,i)=>{ tb.rotation.x=Math.sin(t*3+i)*0.3-pulse*0.25; }); } }
/* ---- dolphins — playful pods arcing through the shallows ---- */
const DOLPHINS=[], DOL_N=6, DOL_R=440;
function initDolphins(){ if(DOLPHINS.length) return; for(let k=0;k<DOL_N;k++){ const m=makeBeast('dolphin'); m.visible=false; scene.add(m);
  DOLPHINS.push({m,x:0,z:0,y:0,dir:Math.random()*6.28,ph:Math.random()*6.28,set:false}); } }
function updateDolphins(px,py,pz,dt,t){ initDolphins();
  /* dolphins RIDE THE BOW when the ship runs fast — two peel off and race
     her flanks, arcing in her pressure wave, as they do on every real sea */
  const sailing=(state.mode==='boat'||state.mode==='deck')&&Math.abs(state.boat.speed)>13;
  let escN=0;
  for(const d of DOLPHINS){ if(!d.set||Math.hypot(d.x-px,d.z-pz)>DOL_R+150){
      const a=Math.random()*6.28, r=80+Math.random()*260; d.x=px+Math.cos(a)*r; d.z=pz+Math.sin(a)*r;
      const fy=haunt(d.x,d.z,H_DOLPHIN); d.y=Math.min(SEA_SURF-6,fy+30+Math.random()*40); d.dir=Math.random()*6.28; d.set=true; d.m.visible=true; }
    let sp=18;
    const escort=sailing&&escN<2&&Math.hypot(d.x-state.boat.x,d.z-state.boat.z)<420;
    if(escort){ const side=(escN===0)?1:-1; escN++;
      const b=state.boat, fx=Math.sin(b.heading), fz=Math.cos(b.heading);
      const tx=b.x+fx*(46+Math.sin(t*0.8+d.ph)*14)+Math.cos(b.heading)*side*15;
      const tz=b.z+fz*(46+Math.sin(t*0.8+d.ph)*14)-Math.sin(b.heading)*side*15;
      const want=Math.atan2(tz-d.z,tx-d.x);
      let da=want-d.dir; while(da>Math.PI)da-=2*Math.PI; while(da<-Math.PI)da+=2*Math.PI;
      d.dir+=da*Math.min(1,dt*2.4);
      sp=Math.min(52,Math.abs(state.boat.speed)+14);
    } else d.dir+=Math.sin(t*0.4+d.ph)*0.05*dt*60;
    { const nx=d.x+Math.cos(d.dir)*sp*dt, nz=d.z+Math.sin(d.dir)*sp*dt;
      if(!landAtWorld(nx+Math.cos(d.dir)*10,nz+Math.sin(d.dir)*10)&&!landAtWorld(nx,nz)){ d.x=nx; d.z=nz; }
      else d.dir+=1.8; }
    const arc=Math.sin(t*(escort?1.4:0.9)+d.ph); d.y+=arc*(escort?16:10)*dt; const fy=haunt(d.x,d.z,H_DOLPHIN), col=SEA_SURF-fy;
    d.y=Math.min(SEA_SURF-4,Math.max(fy+Math.min(8,col-5),d.y));
    d.m.position.set(d.x,d.y,d.z); d.m.rotation.y=Math.atan2(Math.cos(d.dir),Math.sin(d.dir)); d.m.rotation.x=-arc*0.4; } }
/* ---- SHARKS — honest minecraft sharks, no mere grey shapes: countershaded
   blue above and white beneath, gill slits on the flanks, black eyes, a
   toothy open mouth at the front, true dorsal and pectoral fins, and a
   swept two-lobed tail that wags as it swims. ---- */
/* THE HUNTERS OF THE DEEP — a great white and a hammerhead, each from its own
   file. Add 'whaleshark' here and one will cruise with them (he hunts nothing
   at all, but the pool does not know that). */
const SHK_KINDS=['shark','hammerhead','tigershark'];
const SHARKS=[], SHK_N=3, SHK_R=560;
let sharkWarnT=-99, sharkFeedToastT=-99;
function initSharks(){ if(SHARKS.length) return; for(let k=0;k<SHK_N;k++){ const m=makeBeast(SHK_KINDS[k%SHK_KINDS.length]); m.visible=false; scene.add(m);
  SHARKS.push({m,x:0,z:0,y:0,dir:Math.random()*6.28,ph:Math.random()*6.28,set:false,cool:0}); } }
function updateSharks(px,py,pz,dt,t){ initSharks();
  for(const s of SHARKS){ if(!s.set||Math.hypot(s.x-px,s.z-pz)>SHK_R+180){
      const a=Math.random()*6.28, r=180+Math.random()*320; s.x=px+Math.cos(a)*r; s.z=pz+Math.sin(a)*r;
      const fy=haunt(s.x,s.z,H_SHARK); s.y=fy+18+Math.random()*45; s.dir=Math.random()*6.28; s.set=true; s.m.visible=true; }
    s.cool=(s.cool||0)-dt;
    /* THE HUNT — the wolf logic of the land, loosed in the water. A diver
       within scent is run down and bitten: the shark tears fish from the
       catch and steals the breath from the chest (the immortal breath is
       no shield against teeth). The repelling of beasts (🛡) stays them. */
    let sp=13, hunting=false;
    const dvx=px-s.x, dvz=pz-s.z, dvy=py-s.y;
    const dd=Math.sqrt(dvx*dvx+dvz*dvz+dvy*dvy);
    /* prey is a diver below OR a swimmer at the surface — bobbing up is no refuge */
    const preyDive=state.mode==='dive', preySwim=state.mode==='walk'&&state.walk.inWater;
    if((preyDive||preySwim)&&!state.repel&&s.cool<=0&&dd<120){
      hunting=true; sp=27;
      s.dir=Math.atan2(dvz,dvx);
      s.y+=(py-s.y)*Math.min(1,dt*1.4);
      if(t-sharkWarnT>14&&dd<85){ sharkWarnT=t;
        toast('A great grey shape turns toward you — the deep has teeth. Rise, spear it, or take up the repelling of beasts.'); }
      if(dd<6.5){                                     /* the bite */
        s.cool=15;
        const lost=Math.min(state.fish||0,2);
        if(lost) state.fish-=lost;
        const m2=Math.hypot(dvx,dvz)||1;
        if(preyDive){
          state.breath=Math.max(0.08,state.breath-0.35);
          /* the fling is WALKED, not leapt: landAtWorld only knows dry land,
             so the shove could pass through an undersea cliff and the floor
             clamp then hoisted the diver up through the rock. Each stride is
             tested against the land AND the bed's own walls, and the shove
             stops at the first that bars it. */
          const dv2=state.dive;
          for(let k3=0;k3<4;k3++){
            const sx2=dv2.x+dvx/m2*5, sz2=dv2.z+dvz/m2*5;
            if(landAtWorld(sx2,sz2)||seabedDepth(sx2,sz2)+3>dv2.y+8) break;
            dv2.x=sx2; dv2.z=sz2; }
          dv2.vy=70;                                            /* flung surfaceward */
        } else {
          /* struck at the surface — shoved through the water, white water everywhere */
          const w2=state.walk, nx2=w2.x+dvx/m2*16, nz2=w2.z+dvz/m2*16;
          if(!groundInfo(nx2,nz2).land){ w2.x=nx2; w2.z=nz2; }
          splash(w2.x,SEA_SURF+1,w2.z,true);
        }
        toast('The shark strikes!'+(lost?' It tears '+lost+' fish from your catch.':'')+' Make for the light of the surface.');
        saveState();
      }
    }
    /* ---- THE SHARK EARNS ITS LIVING ----
       It did nothing between divers: it cruised, for ever, and the deep had
       no drama in it. Every so often now its hunger comes round, it marks
       the nearest bait-ball, runs it down and TEARS THROUGH it — the school
       bursts apart, a fish or two is truly taken, and the water is all
       fright for a moment. Stand near and you will see the oldest scene in
       the sea play itself. */
    if(!hunting){
      s.feedT=(s.feedT===undefined?10+Math.random()*25:s.feedT-dt);
      if(s.feed>0&&s.prey&&s.prey.set){
        s.feed-=dt; hunting=true; sp=30;
        const pdx=s.prey.x-s.x, pdz=s.prey.z-s.z, pdd=Math.hypot(pdx,pdz);
        s.dir=Math.atan2(pdz,pdx);
        s.y+=((s.prey.y||s.y)-s.y)*Math.min(1,dt*1.8);
        if(pdd<(s.prey.spread||20)+12&&!s.prey.panic){
          s.prey.panic=3.5;                       /* the strike — the ball bursts */
          let ate=0;
          for(const f of s.prey.fish){ if(ate>=2) break;
            if(!f.gone&&Math.random()<0.35){ f.gone=20+Math.random()*20; if(f.m) f.m.visible=false; ate++; } }
          if(Math.hypot(s.x-px,s.z-pz)<340&&t-sharkFeedToastT>35){ sharkFeedToastT=t;
            toast('A great shark tears through the bait-ball — the school bursts like spray, and the water is full of silver and fright.'); }
          s.feed=0; s.prey=null; s.feedT=40+Math.random()*50;
        }
        else if(s.feed<=0){ s.prey=null; s.feedT=20+Math.random()*20; }
      }
      else if(s.feedT<=0){
        let best=null,bd2=1e9;
        for(const S2 of SHOALS){ if(!S2.set||S2.panic) continue;
          const d2=Math.hypot(S2.x-s.x,S2.z-s.z); if(d2<620&&d2<bd2){ bd2=d2; best=S2; } }
        if(best){ s.prey=best; s.feed=9; }
        else s.feedT=8+Math.random()*10;
      }
    }
    if(!hunting) s.dir+=Math.sin(t*0.25+s.ph)*0.03*dt*60;
    { const nx=s.x+Math.cos(s.dir)*sp*dt, nz=s.z+Math.sin(s.dir)*sp*dt;
      const nsx=nx+Math.cos(s.dir)*16, nsz=nz+Math.sin(s.dir)*16;   /* the nose leads */
      if(!landAtWorld(nx,nz)&&!landAtWorld(nsx,nsz)){ s.x=nx; s.z=nz; } else s.dir+=1.9; }   /* no shark swims through stone */
    if(!hunting) s.y+=Math.sin(t*0.5+s.ph)*3*dt;
    /* a hunting shark hugs the bed after a bottom-hugging diver — and rises
       right under the swell to strike a swimmer at the surface */
    const fy=haunt(s.x,s.z,H_SHARK), col=SEA_SURF-fy;
    s.y=Math.min(hunting?SEA_SURF-3:SEA_SURF-8,Math.max(fy+(hunting?3.5:Math.min(10,col-9)),s.y));
    s.m.position.set(s.x,s.y,s.z); s.m.rotation.y=Math.atan2(Math.cos(s.dir),Math.sin(s.dir));
    s.m.userData.tail.rotation.y=Math.sin(t*(hunting?7:4)+s.ph)*(hunting?0.45:0.3); } }
/* ---- turtles, rays, whales, pufferfish, jellyfish, crabs ---- */
/* a generic wandering sea-mob pool (turtle/ray/whale/puffer) */
function mkSeaMob(kind,n,R,rSpawn,near,deepM,lat){ const arr=[];
  for(let k=0;k<n;k++){ const m=makeBeast(kind); m.visible=false; scene.add(m); arr.push({m,x:0,z:0,y:0,dir:Math.random()*6.28,ph:Math.random()*6.28,set:false,sp:near?7:12}); }
  /* EVERY BEAST NEEDS ROOM FOR ITS OWN BULK. A whale grown to sixteen metres
     stands three units off the bed at the old clearance and ploughs the sand
     with her belly. The clearance a beast keeps is read off its own length. */
  arr._R=R; arr._rs=rSpawn; arr._near=near; arr._len=beastUnits(kind); arr._deep=deepM||H_REEF; arr._kind=kind;
  /* AND SOME OF THEM KEEP TO THEIR OWN WATER. A walrus is not met off Ceylon
     and a manatee is not met under the ice: a nation of beasts may name the
     band of latitude it belongs to, and it is simply absent from the rest of
     the sea, as it is on the true earth. */
  arr._lat=lat||null; return arr; }
function updateSeaMob(arr,px,py,pz,dt,t){
  if(arr._lat){ const lat=90-Math.hypot(px/R_WORLD,pz/R_WORLD)*180;
    if(lat<arr._lat[0]||lat>arr._lat[1]){
      for(const o of arr) if(o.set){ o.set=false; o.m.visible=false; } return; } }
  /* ---- WHAT THIS NATION OF THE SEA IS ABOUT ----
     Its pace, its hours, and whether it must come up to breathe are read from
     its line in js/behavior.js. Anything the table has no word for keeps the
     old plain wander, so the sea runs while the table is filled in. */
  const B2=window.BEHAVIOR, kind=arr._kind;
  const air=B2?B2.seaAirOf(kind):false;
  const dayp=B2?B2.seaDayOf(kind):'day';
  const night=(worldNight||0)>0.6;
  /* off its own hours it is slow and quiet — but nothing in the sea stands still */
  const drowsy=(dayp==='all'||dayp==='dusk')?false:(dayp==='night'?!night:night);
  for(const o of arr){
    if(!o.set||Math.hypot(o.x-px,o.z-pz)>arr._R+140){
      /* ---- SET DOWN IN WATER, AND IN WATER THAT HOLDS IT ----
         The pool point was never looked at: a whale could be dropped with
         her middle on the sand — half a leviathan standing out of a beach.
         A spot is drawn until it is open water deep enough for the beast's
         own bulk, or the slot simply waits for the next pass. */
      o.set=false;
      let drew=false;
      for(let tr=0;tr<6;tr++){
        const a=Math.random()*6.28, r=arr._rs*0.3+Math.random()*arr._rs*0.7;
        const x=px+Math.cos(a)*r, z=pz+Math.sin(a)*r;
        if(landAtWorld(x,z)) continue;
        if(SEA_SURF-seabedDepth(x,z)<Math.max(8,(arr._len||24)*0.45)) continue;
        o.x=x; o.z=z; drew=true; break; }
      if(!drew){ o.m.visible=false; continue; }
      const fy=haunt(o.x,o.z,arr._deep||H_REEF);
      const clr=Math.max(4,(arr._len||24)*0.35);   /* she swims a third of her own length clear */
      o.y = arr._near ? fy+clr+Math.random()*14 : Math.min(SEA_SURF-clr,fy+clr+Math.random()*60); o.dir=Math.random()*6.28; o.set=true; o.m.visible=true;
      o.sp=B2?B2.swimOf(kind,arr._near?7:12):(arr._near?7:12);
      o.breath=air?(3+Math.random()*28):0; o.act=null; o.actT=0; o.surf=0; }
    /* the piece of business it is at, and the breath it owes the surface */
    o.actT=(o.actT||0)-dt;
    if(air){ o.breath-=dt; if(o.breath<=0&&!o.surf) o.surf=1; }   /* time to come up and blow */
    if(o.actT<=0&&!o.surf){ o.act=B2?B2.drawSeaAct(kind,Math.random()):null; o.actT=4+Math.random()*7;
      /* a breach is a moment, not an errand — up, out, and back in */
      if(o.act==='breach') o.actT=2.6; }
    /* how fast it goes: its cruise, dropped for its off-hours, and near-stopped
       when it is resting, denned, hovering or lying up */
    let spF=drowsy?0.4:1;
    if(o.act==='logging'||o.act==='den'||o.act==='hover'||o.act==='lure'||o.act==='bask') spF*=0.15;
    o.dir+=Math.sin(t*0.3+o.ph)*0.03*dt*60;
    /* ---- THE NOSE TURNS THE BEAST, NOT THE NAVEL ----
       Only the centre point was ever tested against the land, so a beast
       half a ship long carried her whole head through the face of a cliff
       before the middle of her arrived to be told no. She is steered by
       her own NOSE now — and by the depth ahead: water too shallow for her
       bulk turns her out to sea before she can beach in it. */
    { const nx=o.x+Math.cos(o.dir)*o.sp*spF*dt, nz=o.z+Math.sin(o.dir)*o.sp*spF*dt;
      const nose=(arr._len||24)*0.55;
      const hx2=nx+Math.cos(o.dir)*nose, hz2=nz+Math.sin(o.dir)*nose;
      if(!landAtWorld(nx,nz)&&!landAtWorld(hx2,hz2)
        &&SEA_SURF-seabedDepth(hx2,hz2)>Math.max(6,(arr._len||24)*0.3)){ o.x=nx; o.z=nz; }
      else o.dir+=1.7; }   /* the flank turns the beast */
    /* the water it holds: rising to breathe, sounding to the bed, hanging at
       the top, or the gentle mid-water bob it keeps between whiles */
    const fy=haunt(o.x,o.z,arr._deep||H_REEF);
    const clr=Math.max(3,(arr._len||24)*0.30), loF=fy+clr, hiF=SEA_SURF-clr*0.5;
    if(o.surf){ o.y+=(hiF-o.y)*Math.min(1,dt*0.7); if(o.y>=hiF-2){ o.surf=0; o.breath=20+Math.random()*26; } }
    /* ---- THE BREACH ----
       "There is that leviathan, whom thou hast made to play therein." A
       whale that draws the breach hurls herself at the light, breaks the
       skin of the sea in white water, hangs an instant clear of it, and
       comes down in white water again. */
    else if(o.act==='breach'&&air){
      o.y+=((SEA_SURF+(arr._len||24)*0.22)-o.y)*Math.min(1,dt*1.5);
      if(o.y>SEA_SURF-3&&!o.brs){ o.brs=1; splash(o.x,SEA_SURF+2,o.z,true); }
      if(o.y>=SEA_SURF+(arr._len||24)*0.16){ o.act='sound'; }   /* over the top — down she comes */
    }
    else if(o.act==='sound'||o.act==='bottom'||o.act==='graze'||o.act==='forage'||o.act==='den'||o.act==='bury'){
      const ty=loF+Math.min(6,(hiF-loF)*0.12); o.y+=(ty-o.y)*Math.min(1,dt*0.5); }
    else if(o.act==='logging'||o.act==='bask'){ o.y+=(hiF-o.y)*Math.min(1,dt*0.4); }
    else o.y+=Math.sin(t*0.6+o.ph)*2*dt;
    /* the fall home from the leap ends in spray, and the flag with it */
    if(o.brs&&o.act!=='breach'){ if(o.y<=SEA_SURF-2){ o.brs=0; splash(o.x,SEA_SURF+2,o.z,true); } }
    const hiCap=(o.brs||(o.act==='breach'&&air))?SEA_SURF+(arr._len||24)*0.26:hiF;
    o.y=Math.min(hiCap,Math.max(loF,o.y));
    /* she pitches with her way — nose up rising to blow, nose down sounding */
    { const py2=(o.py===undefined)?o.y:o.py, vy2=(o.y-py2)/Math.max(dt,1e-3); o.py=o.y;
      o.pitch=(o.pitch||0)+(Math.max(-0.5,Math.min(0.5,-vy2*0.03))-(o.pitch||0))*Math.min(1,dt*3); }
    o.m.position.set(o.x,o.y,o.z); o.m.rotation.y=Math.atan2(Math.cos(o.dir),Math.sin(o.dir));
    o.m.rotation.x=o.pitch;
    const beat=(spF<0.4)?1:2;                        /* fins ease when the beast lies up */
    if(o.m.userData.flL){ o.m.userData.flL.rotation.z=0.2+Math.sin(t*beat+o.ph)*0.3; o.m.userData.flR.rotation.z=-0.2-Math.sin(t*beat+o.ph)*0.3; }
    if(o.m.userData.wingL){ o.m.userData.wingL.rotation.z=Math.sin(t*1.6+o.ph)*0.4; o.m.userData.wingR.rotation.z=-Math.sin(t*1.6+o.ph)*0.4; } } }
let TURTLES,RAYS_M,WHALES,PUFFERS,JELLIES,CRABS,SEALS,WALRUS,MANATEES,OCTOPI,SWORDS,CUDAS,BELUGAS,SLEEPERS,NARWHALS;
let PARROTS,ANGELS,LIONFS,MARLINS,SUNFS,WSHARKS,SPERMS;
function initSeaMobs(){ if(TURTLES) return;
  /* the last number is how deep each keeps, in metres: a turtle on the reef,
     a whale sounding to three hundred, a pufferfish never off the shallows */
  TURTLES=mkSeaMob('turtle',7,360,340,true,120);
  RAYS_M=mkSeaMob('ray',4,460,440,true,200);
  WHALES=mkSeaMob('whale',2,700,650,false,H_WHALE);
  PUFFERS=mkSeaMob('puffer',8,240,220,true,60);
  /* ---- THE SEA FILLED OUT TO ITS TRUE COMPANY ----
     The reef gets its grazers and its hovering hunter; the open warm water
     its spear and its swimming head; and the deep its greatest diver — the
     sperm whale, who breathes at the top and sounds two kilometres after
     the giant squid, which is a hunt this engine now actually stages. */
  PARROTS=mkSeaMob('parrotfish',5,300,280,true,55,[-38,38]);
  ANGELS=mkSeaMob('angelfish',6,260,240,true,45,[-38,38]);
  LIONFS=mkSeaMob('lionfish',3,240,220,true,45,[-36,36]);
  MARLINS=mkSeaMob('marlin',2,560,520,false,350,[-48,48]);
  SUNFS=mkSeaMob('sunfish',1,600,560,false,480,[-54,54]);
  WSHARKS=mkSeaMob('whaleshark',1,700,650,false,300,[-36,36]);
  SPERMS=mkSeaMob('spermwhale',2,820,760,false,2200,[-64,64]);
  /* ---- AND THE REST OF THE NATIONS OF THE SEA ----
     Each to its own water and its own depth: the seal and the walrus in the
     cold seas at both ends of the earth, the manatee grazing the weed in the
     warm shallows and the river mouths, the octopus over the reef bed, and
     the swordfish and the barracuda out where the bottom drops away. */
  SEALS=mkSeaMob('seal',5,340,320,true,90,[42,90]);
  /* the white whale of the ice, and the shark that lies under it — four
     hundred years old, blind, and slower than a man walks */
  BELUGAS=mkSeaMob('beluga',3,420,400,true,120,[55,90]);
  /* the unicorn of the sea, in the same cold water as the white whale, its
     long tusk carried before it */
  NARWHALS=mkSeaMob('narwhal',2,440,410,true,150,[58,90]);
  SLEEPERS=mkSeaMob('greenlandshark',1,560,520,false,600,[52,90]);
  WALRUS=mkSeaMob('walrus',2,320,300,true,70,[58,90]);
  MANATEES=mkSeaMob('manatee',2,300,280,true,40,[-30,30]);
  OCTOPI=mkSeaMob('octopus',3,260,240,true,70);
  SWORDS=mkSeaMob('swordfish',2,520,480,false,400,[-46,46]);
  CUDAS=mkSeaMob('barracuda',5,300,280,true,110,[-34,34]);
  JELLIES=[]; for(let k=0;k<16;k++){ const m=makeBeast('jelly'); m.visible=false; scene.add(m); JELLIES.push({m,x:0,z:0,y:0,ph:Math.random()*6.28,set:false}); }
  CRABS=[]; for(let k=0;k<18;k++){ const m=makeBeast('crab'); m.visible=false; scene.add(m); CRABS.push({m,x:0,z:0,ph:Math.random()*6.28,set:false}); } }
function updateSeaMobs(px,py,pz,dt,t){ initSeaMobs();
  updateSeaMob(TURTLES,px,py,pz,dt,t); updateSeaMob(RAYS_M,px,py,pz,dt,t); updateSeaMob(WHALES,px,py,pz,dt,t); updateSeaMob(PUFFERS,px,py,pz,dt,t);
  updateSeaMob(SEALS,px,py,pz,dt,t); updateSeaMob(WALRUS,px,py,pz,dt,t);
  updateSeaMob(MANATEES,px,py,pz,dt,t); updateSeaMob(OCTOPI,px,py,pz,dt,t);
  updateSeaMob(SWORDS,px,py,pz,dt,t); updateSeaMob(CUDAS,px,py,pz,dt,t);
  updateSeaMob(BELUGAS,px,py,pz,dt,t); updateSeaMob(SLEEPERS,px,py,pz,dt,t);
  updateSeaMob(NARWHALS,px,py,pz,dt,t);
  updateSeaMob(PARROTS,px,py,pz,dt,t); updateSeaMob(ANGELS,px,py,pz,dt,t);
  updateSeaMob(LIONFS,px,py,pz,dt,t); updateSeaMob(MARLINS,px,py,pz,dt,t);
  updateSeaMob(SUNFS,px,py,pz,dt,t); updateSeaMob(WSHARKS,px,py,pz,dt,t);
  updateSeaMob(SPERMS,px,py,pz,dt,t);
  for(const j of JELLIES){ if(!j.set||Math.hypot(j.x-px,j.z-pz)>360){ const a=Math.random()*6.28,r=130+Math.random()*230; j.x=px+Math.cos(a)*r; j.z=pz+Math.sin(a)*r; const fy=haunt(j.x,j.z,H_JELLY); j.y=fy+30+Math.random()*80; j.set=true; j.m.visible=true; }
    const pulse=0.5+0.5*Math.sin(t*1.4+j.ph); j.y+=(pulse-0.45)*10*dt; const fy=haunt(j.x,j.z,H_JELLY), col=SEA_SURF-fy;
    j.y=Math.min(SEA_SURF-6,Math.max(fy+Math.min(10,col-7),j.y));
    j.m.position.set(j.x,j.y,j.z); j.m.scale.y=0.8+pulse*0.4; j.m.userData.tents.forEach((te,i)=>{ te.rotation.x=Math.sin(t*2+i)*0.2; }); }
  for(const c of CRABS){ if(!c.set||Math.hypot(c.x-px,c.z-pz)>300){ for(let tr=0;tr<5;tr++){ const a=Math.random()*6.28,r=80+Math.random()*220, x=px+Math.cos(a)*r,z=pz+Math.sin(a)*r, d=SEA_SURF-seabedDepth(x,z);
        if(d>6&&d<H_REEF*U_PER_M){ c.x=x; c.z=z; c.set=true; c.m.position.set(x,seabedDepth(x,z)+0.6,z); c.m.rotation.y=Math.random()*6.28; c.m.visible=true; break; } if(tr===4){c.set=false;c.m.visible=false;} } }
    if(c.set) c.m.position.x=c.x+Math.sin(t*2+c.ph)*0.6; } }
/* ---- THE LAMPS OF THE DARK ----
   Below a thousand metres the sun is wholly spent, and until now the deep
   bottomed out before it ever got there. It does not any more: there are
   kilometres of black water under every keel, and a black room with a floor
   in it is not the deep — the deep is a black room with LIGHTS in it. The
   anglerfish hangs there with her lamp lit over her teeth, and she is the
   only thing to see. She is never met in the sunlit water. */
const ANGLERS=[], ANG_N=6, ANG_R=130, ANG_MIN_M=800;
function initAnglers(){ if(ANGLERS.length) return;
  for(let k=0;k<ANG_N;k++){ const m=makeBeast('anglerfish'); m.visible=false; scene.add(m);
    /* the bloom of the esca, so the lamp is seen before the fish is */
    const gs=new THREE.Sprite(new THREE.SpriteMaterial({map:glowTexCv,color:0x9ff6e2,
      transparent:true,opacity:0.55,depthWrite:false,fog:true}));
    gs.scale.set(16,16,1); scene.add(gs); gs.visible=false;
    ANGLERS.push({m,gs,x:0,y:0,z:0,dir:Math.random()*6.28,ph:Math.random()*6.28,set:false}); } }
function updateAnglers(px,py,pz,dt,t){ initAnglers();
  const deepEnough=(SEA_SURF-py)/U_PER_M>ANG_MIN_M;
  for(const a of ANGLERS){
    if(!deepEnough){ if(a.set){ a.set=false; a.m.visible=false; a.gs.visible=false; } continue; }
    if(!a.set||Math.hypot(a.x-px,a.z-pz)>ANG_R+120){
      const ang=Math.random()*6.28, r=34+Math.random()*ANG_R;
      a.x=px+Math.cos(ang)*r; a.z=pz+Math.sin(ang)*r;
      const fy=seabedDepth(a.x,a.z);
      a.y=Math.max(fy+10, Math.min(py+(Math.random()-0.5)*180, SEA_SURF-ANG_MIN_M*U_PER_M));
      a.dir=Math.random()*6.28; a.set=true; a.m.visible=true; a.gs.visible=true; }
    /* she does not chase: she hangs almost still and waits, and the lamp
       breathes. That is the whole of her hunting. */
    a.dir+=Math.sin(t*0.21+a.ph)*0.02*dt*60;
    a.x+=Math.cos(a.dir)*2.2*dt; a.z+=Math.sin(a.dir)*2.2*dt;
    a.y+=Math.sin(t*0.5+a.ph)*1.6*dt;
    const fy=seabedDepth(a.x,a.z);
    a.y=Math.min(SEA_SURF-ANG_MIN_M*U_PER_M,Math.max(fy+7,a.y));
    a.m.position.set(a.x,a.y,a.z); a.m.rotation.y=Math.atan2(Math.cos(a.dir),Math.sin(a.dir));
    const pulse=0.55+0.45*Math.sin(t*1.3+a.ph);
    const u=a.m.userData;
    if(u.rod) u.rod.rotation.x=Math.sin(t*0.7+a.ph)*0.16;
    if(u.lure) u.lure.material.color.setRGB(0.42*pulse+0.2,0.96*pulse,0.86*pulse+0.1);
    /* the bloom rides on the lure itself, wherever the rod has swung it */
    if(u.lure){ u.lure.getWorldPosition(_wv); a.gs.position.copy(_wv);
      a.gs.material.opacity=0.30+0.34*pulse; } } }
function hideAnglers(){ for(const a of ANGLERS){ a.m.visible=false; a.gs.visible=false; a.set=false; } }
/* ================= THE REEF IN FULL =================
   The clear shallows had fish, coral and weed, and nothing that LIVED
   anywhere: no anemone with its clownfish family, no seahorse holding to
   the grass, no moray in its hole, nothing still upon the sand. The reef
   keeps its whole household now, each thing at its real business. */
const ANEMS=[], ANEM_N=8;
function initAnems(){ if(ANEMS.length) return;
  for(let k=0;k<ANEM_N;k++){
    const m=makeBeast('anemone'); m.visible=false; scene.add(m);
    const fam=[], n=2+Math.floor(Math.random()*2);
    for(let i=0;i<n;i++){ const f=makeBeast('clownfish'); f.visible=false; scene.add(f);
      fam.push({m:f,ph:Math.random()*6.28,r:2.5+Math.random()*3,h:2+Math.random()*2.5,sp:0.9+Math.random()*0.9}); }
    ANEMS.push({m,fam,x:0,z:0,y:0,ph:Math.random()*6.28,set:false}); } }
function updateAnems(px,pz,dt,t){ initAnems();
  for(const A of ANEMS){
    if(!A.set||Math.hypot(A.x-px,A.z-pz)>300){
      A.set=false;
      for(let tr=0;tr<6;tr++){ const a=Math.random()*6.28, rr=90+Math.random()*200;
        const x=px+Math.cos(a)*rr, z=pz+Math.sin(a)*rr;
        const lat=90-Math.hypot(x,z)/R_WORLD*180;
        if(Math.abs(lat)>38) break;                     /* the anemone keeps the warm sea */
        const fy=seabedDepth(x,z), d=(SEA_SURF-fy)/U_PER_M;
        if(d>4&&d<40&&fbm(x*0.01-9,z*0.01+4)>0.4){ A.x=x; A.z=z; A.y=fy;
          A.m.position.set(x,fy,z); A.set=true; A.m.visible=true; break; } }
      if(!A.set){ A.m.visible=false; for(const f of A.fam) f.m.visible=false; continue; } }
    const tents=A.m.userData.tents;
    if(tents) for(let i2=0;i2<tents.length;i2++) tents[i2].rotation.y=Math.sin(t*1.2+A.ph+i2)*0.16;
    /* the family circles the crown — and when a shark stands near, the whole
       household tucks itself down into the arms, which is the entire deal
       the clownfish ever struck */
    let fear=0;
    for(const s of SHARKS){ if(s.set&&Math.hypot(s.x-A.x,s.z-A.z)<70){ fear=1; break; } }
    for(const f of A.fam){ f.ph+=dt*f.sp*(fear?2.2:1);
      const rr=f.r*(fear?0.3:1), hh=fear?1.1:f.h;
      f.m.position.set(A.x+Math.cos(f.ph)*rr, A.y+hh+Math.sin(t*2.2+f.ph)*0.7, A.z+Math.sin(f.ph)*rr);
      f.m.rotation.y=-f.ph;
      if(f.m.userData.tail) f.m.userData.tail.rotation.y=Math.sin(t*8+f.ph)*0.4;
      f.m.visible=true; } } }
/* the seahorse holds to the weed and goes nowhere — bobbing on the spot is
   the whole of its day, and the truest thing about it */
const SEAHORSES=[], SEAH_N=5;
function initSeahorses(){ if(SEAHORSES.length) return;
  for(let k=0;k<SEAH_N;k++){ const m=makeBeast('seahorse'); m.visible=false; scene.add(m);
    SEAHORSES.push({m,x:0,z:0,y:0,ph:Math.random()*6.28,set:false}); } }
function updateSeahorses(px,pz,dt,t){ initSeahorses();
  for(const s of SEAHORSES){
    if(!s.set||Math.hypot(s.x-px,s.z-pz)>260){
      s.set=false;
      for(let tr=0;tr<5;tr++){ const a=Math.random()*6.28, rr=25+Math.random()*220;
        const x=px+Math.cos(a)*rr, z=pz+Math.sin(a)*rr;
        const fy=seabedDepth(x,z), d=(SEA_SURF-fy)/U_PER_M;
        if(d>3&&d<28){ s.x=x; s.z=z; s.y=fy; s.set=true; s.m.visible=true; break; } }
      if(!s.set){ s.m.visible=false; continue; } }
    s.m.position.set(s.x, s.y+1.2+Math.sin(t*0.9+s.ph)*0.6, s.z);
    s.m.rotation.y=Math.sin(t*0.3+s.ph)*0.8;
    if(s.m.userData.tail) s.m.userData.tail.rotation.y=Math.sin(t*10+s.ph)*0.5; } }
/* the moray keeps a hole in the reef and hangs from it to the waist, jaws
   working on its breath — which is how a moray breathes, not a threat,
   though nobody who meets one believes that */
const MORAYS=[], MOR_N=3;
function initMorays(){ if(MORAYS.length) return;
  for(let k=0;k<MOR_N;k++){ const m=makeBeast('moray'); m.visible=false; scene.add(m);
    MORAYS.push({m,x:0,z:0,y:0,ph:Math.random()*6.28,set:false}); } }
function updateMorays(px,pz,dt,t){ initMorays();
  for(const o of MORAYS){
    if(!o.set||Math.hypot(o.x-px,o.z-pz)>280){
      o.set=false;
      for(let tr=0;tr<5;tr++){ const a=Math.random()*6.28, rr=90+Math.random()*180;
        const x=px+Math.cos(a)*rr, z=pz+Math.sin(a)*rr;
        const fy=seabedDepth(x,z), d=(SEA_SURF-fy)/U_PER_M;
        if(d>5&&d<45&&fbm(x*0.01-9,z*0.01+4)>0.44){ o.x=x; o.z=z; o.y=fy;
          o.m.position.set(x,fy+0.8,z); o.m.rotation.y=Math.random()*6.28;
          o.set=true; o.m.visible=true; break; } }
      if(!o.set){ o.m.visible=false; continue; } }
    /* head riding out of the den, swaying; the jaw opens and shuts on the breath */
    o.m.position.y=o.y+0.8+Math.sin(t*0.7+o.ph)*0.3;
    o.m.rotation.y+=Math.sin(t*0.4+o.ph)*0.1*dt;
    if(o.m.userData.jaw) o.m.userData.jaw.rotation.x=0.25+Math.abs(Math.sin(t*1.1+o.ph))*0.3; } }
/* and the still things of the bed: the starfish, the urchin, and the
   lobster walking its slow beat among them by night */
const BEDLIFE=[], BEDL_N=18, BEDL_KINDS=['starfish','starfish','urchin','urchin','lobster'];
function initBedLife(){ if(BEDLIFE.length) return;
  for(let k=0;k<BEDL_N;k++){ const kind=BEDL_KINDS[k%BEDL_KINDS.length];
    const m=makeBeast(kind); m.visible=false; scene.add(m);
    BEDLIFE.push({m,kind,x:0,z:0,dir:Math.random()*6.28,ph:Math.random()*6.28,set:false}); } }
function updateBedLife(px,pz,dt,t){ initBedLife();
  for(const b of BEDLIFE){
    if(!b.set||Math.hypot(b.x-px,b.z-pz)>280){
      b.set=false;
      for(let tr=0;tr<5;tr++){ const a=Math.random()*6.28, rr=25+Math.random()*240;
        const x=px+Math.cos(a)*rr, z=pz+Math.sin(a)*rr;
        const fy=seabedDepth(x,z), d=(SEA_SURF-fy)/U_PER_M;
        if(d>3&&d<70){ b.x=x; b.z=z; b.set=true;
          b.m.position.set(x,fy+0.2,z); b.m.rotation.y=Math.random()*6.28; b.m.visible=true; break; } }
      if(!b.set){ b.m.visible=false; continue; } }
    if(b.kind==='lobster'){                       /* the lobster alone goes anywhere */
      b.dir+=Math.sin(t*0.5+b.ph)*0.05*dt*60;
      const nx=b.x+Math.cos(b.dir)*1.2*dt, nz=b.z+Math.sin(b.dir)*1.2*dt;
      if(!landAtWorld(nx,nz)){ b.x=nx; b.z=nz; }
      b.m.position.set(b.x,seabedDepth(b.x,b.z)+0.2,b.z);
      b.m.rotation.y=Math.atan2(Math.cos(b.dir),Math.sin(b.dir)); } } }
function hideReefLife(){
  for(const A of ANEMS){ A.m.visible=false; for(const f of A.fam) f.m.visible=false; }
  for(const s of SEAHORSES) s.m.visible=false;
  for(const o of MORAYS) o.m.visible=false;
  for(const b of BEDLIFE) b.m.visible=false; }
function updateReefLife(px,py,pz,dt,t){
  /* the reef's household lives in the sunlit water — below it, nothing to do */
  if((SEA_SURF-py)/U_PER_M>230){ hideReefLife(); return; }
  updateAnems(px,pz,dt,t); updateSeahorses(px,pz,dt,t);
  updateMorays(px,pz,dt,t); updateBedLife(px,pz,dt,t); }
/* ================= THE DEEP, PEOPLED AT LAST =================
   Below the sunlit water the sea had the anglerfish and nothing else —
   kilometres of black water with one lamp in it. The true deep is BUSY:
   every zone has its own tenants, and each is met only in its own water.
     200–1,000 m   the TWILIGHT: lanternfish (rising nightly to the top and
                   sinking at dawn — the greatest migration on the earth,
                   made daily), hatchetfish, the barreleye, the siphonophore
   1,000–4,000 m   the MIDNIGHT: viperfish, dragonfish, gulper eel — the
                   lures and the fangs — and the giant squid, with the sperm
                   whale sounding down after it
   3,000–6,000 m   the PLAIN: grenadier, dumbo octopus, tripod fish, the
                   giant isopod and the sea cucumber walking the mud
   6,000 m and down  the TRENCHES: the pale hadal snailfish — the deepest
                   fish ever seen alive — and the swarming amphipods.
   Their lamps are drawn as true lights, because below a thousand metres
   the light the sea makes for itself is all the light there is. */
const DEEP_KINDS=[
  {kind:'lanternfish', n:12, m:[220,1000],  glow:0x9fd8ff, gs:4,  spd:6,   rise:true},
  {kind:'hatchetfish', n:5,  m:[250,1000],  glow:0xa8e0f8, gs:4,  spd:2.5},
  {kind:'barreleye',   n:2,  m:[420,1000],  glow:0x5ad078, gs:4,  spd:1.5},
  {kind:'siphonophore',n:2,  m:[350,2400],  glow:0x9fb0ff, gs:10, spd:0.6},
  {kind:'viperfish',   n:4,  m:[650,2400],  glow:0x9ff6e2, gs:5,  spd:3},
  {kind:'dragonfish',  n:3,  m:[850,2600],  glow:0xff5a48, gs:5,  spd:3},
  {kind:'gulper',      n:3,  m:[900,3400],  glow:0xff8fb0, gs:5,  spd:2},
  {kind:'giantsquid',  n:1,  m:[500,2300],  spd:5},
  {kind:'grenadier',   n:5,  m:[1800,5600], bed:true, spd:2.5},
  {kind:'dumbo',       n:3,  m:[2400,5600], bed:true, spd:1.5},
  {kind:'isopod',      n:5,  m:[1800,6600], bed:true, crawl:true, spd:0.8},
  {kind:'seacucumber', n:6,  m:[2200,6600], bed:true, crawl:true, spd:0.25},
  {kind:'tripodfish',  n:4,  m:[2800,6200], bed:true, still:true},
  {kind:'snailfish',   n:6,  m:[6000,11200],bed:true, spd:2.2},
  {kind:'amphipod',    n:10, m:[6000,11200],bed:true, glow:0xcfe8ff, gs:2.5, crawl:true, spd:1.4},
];
const DEEPLIFE=[];
function initDeepLife(){ if(DEEPLIFE.length) return;
  for(const K of DEEP_KINDS) for(let i=0;i<K.n;i++){
    const m=makeBeast(K.kind); m.visible=false; scene.add(m);
    let gsp=null;
    if(K.glow){ gsp=new THREE.Sprite(new THREE.SpriteMaterial({map:glowTexCv,color:K.glow,
        transparent:true,opacity:0.4,depthWrite:false,fog:true}));
      gsp.scale.set(K.gs||5,K.gs||5,1); gsp.visible=false; scene.add(gsp); }
    DEEPLIFE.push({K,m,gsp,x:0,y:0,z:0,dir:Math.random()*6.28,ph:Math.random()*6.28,set:false}); } }
let squidToastT=-999;
function updateDeepLife(px,py,pz,dt,t){ initDeepLife();
  const pm=(SEA_SURF-py)/U_PER_M, night=(worldNight||0)>0.6;
  for(const o of DEEPLIFE){ const K=o.K;
    if(pm<K.m[0]-180||pm>K.m[1]+500){
      if(o.set){ o.set=false; o.m.visible=false; if(o.gsp)o.gsp.visible=false; } continue; }
    if(!o.set||Math.hypot(o.x-px,o.z-pz)>250){
      const a=Math.random()*6.28, r=80+Math.random()*130;
      const x=px+Math.cos(a)*r, z=pz+Math.sin(a)*r;
      const fy=seabedDepth(x,z), bedM=(SEA_SURF-fy)/U_PER_M;
      if(K.bed){
        /* a walker of the mud wants mud IN ITS OWN BAND under it */
        if(bedM<K.m[0]||bedM>K.m[1]){
          if(o.set){ o.set=false; o.m.visible=false; if(o.gsp)o.gsp.visible=false; } continue; }
        o.x=x; o.z=z; o.y=fy+((K.still||K.crawl)?0.3:3+Math.random()*8); }
      else{ const lo=Math.max(fy+6,SEA_SURF-K.m[1]*U_PER_M), hi=SEA_SURF-K.m[0]*U_PER_M;
        if(hi<lo) continue;
        o.x=x; o.z=z; o.y=Math.max(lo,Math.min(hi,py+(Math.random()-0.5)*160)); }
      o.dir=Math.random()*6.28; o.set=true; o.m.visible=true; if(o.gsp)o.gsp.visible=true; }
    /* its way of going */
    if(!K.still){
      o.dir+=Math.sin(t*0.23+o.ph)*0.03*dt*60;
      let sp=K.spd||2;
      /* ---- THE HUNT OF THE TITANS ----
         The one predation the abyss is famous for: a sperm whale that has
         sounded deep enough turns after the great squid, and the squid
         JETS — full flight into the dark. Stand near it and you are told. */
      if(K.kind==='giantsquid'&&SPERMS){ for(const w of SPERMS){ if(!w.set) continue;
        const dd=Math.hypot(w.x-o.x,w.z-o.z);
        if(dd<280&&Math.abs(w.y-o.y)<200){
          o.dir=Math.atan2(o.z-w.z,o.x-w.x); sp=16;
          w.dir=Math.atan2(o.z-w.z,o.x-w.x); w.y+=(o.y-w.y)*Math.min(1,dt*0.6);
          if(t-squidToastT>150&&Math.hypot(o.x-px,o.z-pz)<320){ squidToastT=t;
            toast('A sperm whale has sounded into the dark after the great squid — two vast shadows contending, and every small lamp about them scattering.'); }
          break; } } }
      const nx=o.x+Math.cos(o.dir)*sp*dt, nz=o.z+Math.sin(o.dir)*sp*dt;
      if(!landAtWorld(nx,nz)){ o.x=nx; o.z=nz; } else o.dir+=1.7;
    }
    const fy=seabedDepth(o.x,o.z);
    if(K.bed) o.y=fy+((K.still||K.crawl)?0.3:Math.max(2,Math.min(o.y-fy,14)));
    else{
      if(K.rise){ const bandLo=SEA_SURF-K.m[1]*U_PER_M, bandHi=SEA_SURF-K.m[0]*U_PER_M;
        const ty=night?bandHi:bandLo+(bandHi-bandLo)*0.3;
        o.y+=(ty-o.y)*Math.min(1,dt*0.02); }               /* the nightly rise — a drift, never a jump */
      o.y+=Math.sin(t*0.5+o.ph)*1.5*dt;
      const lo=Math.max(fy+4,SEA_SURF-K.m[1]*U_PER_M);
      o.y=Math.max(lo,Math.min(SEA_SURF-K.m[0]*0.55*U_PER_M,o.y));
    }
    o.m.position.set(o.x,o.y,o.z);
    if(!K.still) o.m.rotation.y=Math.atan2(Math.cos(o.dir),Math.sin(o.dir));
    const u=o.m.userData||{};
    if(u.tail) u.tail.rotation.y=Math.sin(t*4+o.ph)*0.3;
    if(u.tents) u.tents.forEach((te,i2)=>{ te.rotation.z=Math.sin(t*1.2+i2+o.ph)*0.1; });
    if(u.rod) u.rod.rotation.x=Math.sin(t*0.7+o.ph)*0.2;
    if(u.jaw) u.jaw.rotation.x=0.25+Math.abs(Math.sin(t*0.8+o.ph))*0.3;
    if(u.wingL){ u.wingL.rotation.z=Math.sin(t*2+o.ph)*0.5; u.wingR.rotation.z=-Math.sin(t*2+o.ph)*0.5; }
    if(o.gsp){ o.gsp.position.set(o.x,o.y+1,o.z);
      o.gsp.material.opacity=0.22+0.3*(0.5+0.5*Math.sin(t*1.5+o.ph)); } } }
function hideDeepLife(){ for(const o of DEEPLIFE){ o.set=false; o.m.visible=false; if(o.gsp)o.gsp.visible=false; } }
function hideSeaMobs(){ if(!TURTLES) return;
  for(const arr of [TURTLES,RAYS_M,WHALES,PUFFERS,SEALS,WALRUS,MANATEES,OCTOPI,SWORDS,CUDAS,BELUGAS,SLEEPERS,NARWHALS,
    PARROTS,ANGELS,LIONFS,MARLINS,SUNFS,WSHARKS,SPERMS]) for(const o of arr) o.m.visible=false;
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
  /* the sea-chest upon the deck, banded and agleam — break it open for silver */
  { const chest=new THREE.Group();
    const cbody=wbox(3.2,2.2,2.4,wPlank); cbody.position.y=1.1; chest.add(cbody);
    const clid=wbox(3.4,0.9,2.6,wDark); clid.position.y=2.5; chest.add(clid);
    const band=new THREE.Mesh(new THREE.BoxGeometry(3.5,2.6,0.7),new THREE.MeshLambertMaterial({color:0xc8a84a}));
    band.position.set(0,1.6,0); chest.add(band);
    const gm=new THREE.SpriteMaterial({map:glowTexCv,color:0xffe8a0,transparent:true,opacity:0.5,depthWrite:false});
    const gs=new THREE.Sprite(gm); gs.scale.set(11,11,1); gs.position.y=3.6; chest.add(gs);
    chest.position.set(1,7.8,-6);
    g.add(chest); g.userData.chest=chest; }
  g.rotation.z=0.12; return g; }
const wreckSeen=new Set(), WRECKS=[]; const WRECK_N=2;
function initWrecks(){ if(WRECKS.length) return; for(let k=0;k<WRECK_N;k++){ const m=makeWreck(); m.visible=false; scene.add(m); WRECKS.push(m); } }
function updateWreck(px,pz){ initWrecks();
  const CS=900, ci=Math.round(px/CS), cj=Math.round(pz/CS), sites=[];
  for(let di=-2;di<=2;di++)for(let dj=-2;dj<=2;dj++){ const gi=ci+di,gj=cj+dj;
    if(hash2(gi*1.7,gj*3.1)>0.74){ const wx=gi*CS+(hash2(gi,gj)-0.5)*300, wz=gj*CS+(hash2(gj,gi)-0.5)*300, fy=seabedDepth(wx,wz);
      /* ships founder on the shelf and the upper slope, where ships go — a
         wreck laid on the abyssal plain is four kilometres of black water
         away from anyone who might find it */
      const wd=(SEA_SURF-fy)/U_PER_M;
      if(wd>6&&wd<400){ sites.push({wx,wz,fy,gi,gj,d:Math.hypot(wx-px,wz-pz)}); } } }
  sites.sort((a,b)=>a.d-b.d);
  for(let k=0;k<WRECKS.length;k++){ const s=sites[k];
    if(s&&s.d<SB_SIZE*0.55){ WRECKS[k].position.set(s.wx,s.fy,s.wz); WRECKS[k].rotation.y=hash2(s.gi,s.gj)*6.28; WRECKS[k].visible=true;
      const key=s.gi+','+s.gj; WRECKS[k].userData.key=key;
      WRECKS[k].userData.chest.visible=!wreckLooted.has(key);
      if(s.d<95&&!wreckSeen.has(key)){ wreckSeen.add(key);
        toast('You have come upon a wreck of the ancients, sunk in the heart of the seas and grown over with the deep.','YONAH 2:3'); }
      /* the guardian: an unplundered wreck calls a great shark to circle it */
      if(s.d<80&&!wreckLooted.has(key)&&!wreckGuarded.has(key)&&state.mode==='dive'&&SHARKS.length){
        wreckGuarded.add(key);
        const sh=SHARKS[0]; sh.set=true; sh.m.visible=true;
        sh.x=s.wx+45; sh.z=s.wz+12; sh.y=s.fy+16; sh.cool=0;
        if(!state.repel) toast('A guardian circles the wreck — the deep does not give up its treasure freely.'); } }
    else WRECKS[k].visible=false; } }
const wreckLooted=new Set(), wreckGuarded=new Set();
function nearestWreckChest(){ if(state.mode!=='dive') return null;
  const dv=state.dive;
  for(const w of WRECKS){ if(!w.visible||!w.userData.key||wreckLooted.has(w.userData.key)) continue;
    if(Math.hypot(w.position.x-dv.x,w.position.z-dv.z)<15&&Math.abs(w.position.y+8-dv.y)<15) return w; }
  return null; }
/* ---- PEARLS OF THE DEEP — rare oysters on the sea bed, agleam, and worth
   much silver at any market. Gathered ones do not regrow this voyage. ---- */
/* ================= THE COMPASS THAT LEADS =================
   There was a chevron of light hung at the top of the glass, laid over
   toward the thing sought. It gave a bearing and nothing besides: the
   traveller turned, and it turned with him, and at the end of the turn he
   still did not know which way to walk. A lone arrow on a moving frame is
   unreadable — there is nothing standing still behind it to read it against.

   So it is a MARINER'S COMPASS now, set in the corner over the little
   chart, and it answers both questions at once:

     THE CARD    turns with the world. North on this earth is the MIDST —
                 the centre of the disc — so the rose is set from where the
                 traveller stands, and N always lies toward the midst.
     THE NEEDLE  lies on the mark, and is
                   GOLD — to the nearest scroll he has not yet found; this
                          is what it does when it is left alone.
                   BLUE — to the ship. Pressed once it swings to her and
                          stays there however far he wanders inland; pressed
                          again it goes gold and returns to the scrolls.
     THE LUBBER MARK at the head of the case is fixed, and is AHEAD.

   Which gives one plain rule, and it is the whole of the thing: TURN UNTIL
   THE NEEDLE STANDS UNDER THE MARK AT THE TOP, AND THEN WALK. The card
   turning beneath says how far round he has come, and the reading at the
   foot counts the miles down, so he can see he is closing on it.        */
const GUIDE={mode:'scroll',t:0,shown:false};
const _gF=new THREE.Vector3();
const GUIDE_GOLD='#ffc61e', GUIDE_BLUE='#35a7ff';
const cmpCv=$('compass'), cmpCx=cmpCv?cmpCv.getContext('2d'):null;
let ROSE=null;                     /* the card, drawn but once and turned ever after */
/* ---- THE CARD ----
   Drawn once into a canvas of its own and thereafter only turned under the
   needle: the rim of degrees ticked five by five, the eight-pointed star,
   and the four letters. Laying all of that down again every frame, for a
   thing 140 px across, would be a waste of the world's time. */
function buildRose(S){
  const c=document.createElement('canvas'); c.width=c.height=S;
  const x=c.getContext('2d'), R=S/2, r=R-1, rIn=r*0.845;
  x.translate(R,R);
  /* the case: a dark band, gold-edged, after the manner of a boxed compass */
  x.beginPath(); x.arc(0,0,r,0,6.2832); x.fillStyle='#080d18'; x.fill();
  x.lineWidth=Math.max(1,S*0.013); x.strokeStyle='rgba(232,198,106,.85)'; x.stroke();
  const g=x.createRadialGradient(-r*0.3,-r*0.34,r*0.04,0,0,rIn);
  g.addColorStop(0,'#1c2742'); g.addColorStop(1,'#070d1a');
  x.beginPath(); x.arc(0,0,rIn,0,6.2832); x.fillStyle=g; x.fill();
  x.lineWidth=Math.max(1,S*0.006); x.strokeStyle='rgba(232,198,106,.5)'; x.stroke();
  /* the degrees, ticked five by five round the band, and long at the eight */
  for(let i=0;i<72;i++){
    const a=i*Math.PI/36, maj=i%9===0, mid=i%3===0;
    const l=maj?r*0.125:mid?r*0.082:r*0.048, o=r*0.985;
    x.beginPath();
    x.moveTo(Math.sin(a)*o,-Math.cos(a)*o);
    x.lineTo(Math.sin(a)*(o-l),-Math.cos(a)*(o-l));
    x.lineWidth=maj?Math.max(1.4,S*0.011):mid?Math.max(1,S*0.006):Math.max(0.6,S*0.0035);
    x.strokeStyle=maj?'rgba(232,198,106,.95)':mid?'rgba(232,198,106,.6)':'rgba(232,198,106,.32)';
    x.stroke();
  }
  /* THE STAR. Every point is split down its own axis, one half to the light
     and one to the shade — that is what makes a rose read as a solid star
     and not a shape cut out of paper.

     And the whole star is IVORY AND SLATE, with no gold in it anywhere. The
     first cut of this had a gold north point, and then there were two gold
     spikes on the face — the north point and the needle — and at a glance
     across a corner of the screen you could not tell which of them was the
     one that meant anything. The card is grey; the needle alone has colour;
     the eye goes straight to it. North is known by its longer point and by
     the one gold letter over it. */
  const pt=(a,len,w,lit,shade)=>{
    const s=Math.sin(a), co=Math.cos(a);
    const tx=s*len, ty=-co*len, bx=co*w, by=s*w;
    x.beginPath(); x.moveTo(0,0); x.lineTo(bx,by); x.lineTo(tx,ty); x.closePath();
    x.fillStyle=shade; x.fill();
    x.beginPath(); x.moveTo(0,0); x.lineTo(-bx,-by); x.lineTo(tx,ty); x.closePath();
    x.fillStyle=lit; x.fill();
  };
  for(let k=0;k<4;k++) pt(Math.PI/4+k*Math.PI/2, rIn*0.42, r*0.046, '#9aa2b2', '#3f4658');
  for(let k=1;k<4;k++) pt(k*Math.PI/2,           rIn*0.68, r*0.062, '#cec5ac', '#4a5266');
  pt(0, rIn*0.76, r*0.062, '#f7f1e0', '#6e7789');      /* north stands longest */
  /* the four letters, set between the star's points and the ticked band */
  x.font='600 '+Math.round(S*0.095)+'px Georgia,"Times New Roman",serif';
  x.textAlign='center'; x.textBaseline='middle';
  const CARD=[['N',0,'#ffdf8a'],['E',Math.PI/2,'#d8cead'],
              ['S',Math.PI,'#d8cead'],['W',-Math.PI/2,'#d8cead']];
  for(const q of CARD){ x.fillStyle=q[2];
    x.fillText(q[0],Math.sin(q[1])*rIn*0.905,-Math.cos(q[1])*rIn*0.905); }
  return c;
}
/* what the needle is answering to just now, and where it stands */
function guideTarget(){
  if(GUIDE.mode==='ship') return {x:state.boat.x,z:state.boat.z,ship:true};
  const sc=nextScroll();
  return sc?{x:sc.x,z:sc.z}:null;
}
/* ---- LAYING A BEARING ONTO THE GLASS ----
   The compass is drawn HEAD-UP: whatever is straight ahead of the eye stands
   at the top of it. A world bearing b, seen from an eye facing camYaw, falls
   at the screen angle (camYaw - b) — clockwise on the canvas, which is what
   turning a compass card to the right does. The card and the needle are both
   laid on with that one conversion, so the two can never disagree. */
function guideTick(dt){
  if(!cmpCx) return;
  /* Not behind the chart, not in a scene, not before the voyage begins — and
     not at all when another game is driving this engine. SCRIPTURE UNFOLDS
     plays the scrolls; it does not send anyone out to find them. */
  const off=state.firm||cut||!running||window.__HOST_BOOT;
  if(off){ if(GUIDE.shown){ cmpCv.classList.remove('on'); GUIDE.shown=false; } return; }
  if(!GUIDE.shown){ cmpCv.classList.add('on'); GUIDE.shown=true; }
  GUIDE.t+=dt;
  const S=cmpCv.width, R=S/2, r=R-1;
  if(!ROSE) ROSE=buildRose(S);

  const p=playerXZ();
  _gF.set(0,0,-1).applyQuaternion(camera.quaternion);
  const camYaw=Math.atan2(_gF.x,_gF.z);
  /* north is toward the midst of the disc, and so is read off where he stands */
  const rr=Math.hypot(p.x,p.z)||1e-9;

  const x=cmpCx;
  x.clearRect(0,0,S,S);
  x.save(); x.translate(R,R);
  x.save(); x.rotate(camYaw-Math.atan2(-p.x/rr,-p.z/rr)); x.drawImage(ROSE,-R,-R); x.restore();

  const tgt=guideTarget();
  const col=GUIDE.mode==='ship'?GUIDE_BLUE:GUIDE_GOLD;
  let near=false, txt=null;
  if(tgt){
    const dx=tgt.x-p.x, dz=tgt.z-p.z, d=Math.hypot(dx,dz);
    near=d<=(tgt.ship?70:14);                  /* he is on it, and the needle stands down */
    const km=Math.round(d/B);
    txt=near?'HERE':(km>=1000?(km/1000).toFixed(1).replace('.0','')+'k KM':km+' KM');
    x.save();
    x.rotate(camYaw-Math.atan2(dx,dz));        /* and the needle is laid on the mark */
    x.globalAlpha=near?0.4:1;
    x.shadowColor=col; x.shadowBlur=S*(0.028+0.016*Math.sin(GUIDE.t*2.6));
    /* Every part of the needle is OUTLINED in the dark of the case. It lies
       over a star of ivory points, and a gold edge against an ivory edge is
       no edge at all — the outline cuts it away from the card, so the needle
       is one unbroken shape however the two happen to lie. */
    x.lineJoin='round'; x.lineWidth=Math.max(1.2,S*0.009); x.strokeStyle='rgba(4,8,16,.9)';
    /* the counterweight behind the pivot, so a needle reads as a needle */
    x.beginPath(); x.moveTo(0,r*0.34); x.lineTo(-r*0.05,0); x.lineTo(r*0.05,0); x.closePath();
    x.fillStyle='rgba(226,214,180,.34)'; x.fill(); x.stroke();
    /* the needle itself */
    x.beginPath(); x.moveTo(0,-r*0.80); x.lineTo(r*0.062,0); x.lineTo(-r*0.062,0); x.closePath();
    x.fillStyle=col; x.fill(); x.stroke();
    /* and the lozenge at its head — the pointing end is plain at a glance */
    x.beginPath(); x.moveTo(0,-r*0.675); x.lineTo(r*0.095,-r*0.545);
    x.lineTo(0,-r*0.415); x.lineTo(-r*0.095,-r*0.545); x.closePath();
    x.fillStyle=col; x.fill(); x.stroke();
    x.restore();
  }
  /* the pivot it swings upon */
  x.beginPath(); x.arc(0,0,r*0.055,0,6.2832); x.fillStyle='#080d18'; x.fill();
  x.lineWidth=Math.max(1,S*0.008); x.strokeStyle=tgt?col:'rgba(232,198,106,.7)'; x.stroke();
  /* THE LUBBER MARK — fixed at the head of the case, and never turning with
     the card: it is STRAIGHT AHEAD. Bring the needle under it, and walk. */
  x.beginPath(); x.moveTo(0,-r*0.80); x.lineTo(r*0.095,-r*0.995);
  x.lineTo(-r*0.095,-r*0.995); x.closePath();
  x.fillStyle='#ffe8a8'; x.fill();
  x.lineWidth=Math.max(1,S*0.006); x.strokeStyle='rgba(4,8,16,.8)'; x.stroke();
  /* and how far off the mark lies, counting down as he closes upon it */
  if(txt){
    x.font='600 '+Math.round(S*0.066)+'px Georgia,"Times New Roman",serif';
    x.textAlign='center'; x.textBaseline='middle';
    const w=x.measureText(txt).width, ty=r*0.54;
    x.fillStyle='rgba(6,10,20,.88)';
    x.fillRect(-w/2-S*0.035,ty-S*0.055,w+S*0.07,S*0.11);
    x.fillStyle=near?'#e8dfc8':col;
    x.fillText(txt,0,ty);
  }
  x.restore();
}
function guideLabel(){
  if(GUIDE.mode==='ship') return '\uD83E\uDDED Compass: to the ship';
  const sc=nextScroll();
  return sc?'\uD83E\uDDED Compass: to the scrolls':'\uD83E\uDDED Compass: every scroll found';
}
function updateGuideBtn(){ const b=$('b-guide'); if(!b) return;
  b.textContent=guideLabel(); b.classList.toggle('off',GUIDE.mode==='ship'); }
function toggleGuide(){
  GUIDE.mode=GUIDE.mode==='ship'?'scroll':'ship';
  updateGuideBtn();
  if(GUIDE.mode==='ship') toast('The needle turns blue, and lies on your ship.');
  else { const sc=nextScroll();
    toast(sc?'The needle turns gold, and lies on '+sc.name+', hidden in '+sc.country+'.'
            :'The needle turns gold — but every scroll is gathered, and it has nothing left to lie on.'); }
}

/* ================= THE SCROLLS IN THE EARTH =================
   Declared in world/scrolls.js, one to a land. Each is set down near its
   country's own site, a little way out on its own bearing so two never come
   to the same stone, and it stands there until it is taken up. What has
   been taken is kept in the log, so a voyage remembers its scrolls. */
const SCROLLS=(window.EARTH&&window.EARTH.scrollList)||[];
const scrollTaken=new Set();
let _scrollPlaced=false;
function makeScrollProp(){
  const g=new THREE.Group();
  /* a rolled scroll on a low stone, with a light on it so it is FOUND */
  const stone=lbox(3.2,1.1,3.2,0x8d8578); stone.position.y=0.55; g.add(stone);
  const roll=lbox(3.0,0.95,0.95,0xe8dfc8); roll.position.y=1.6; g.add(roll);
  for(const sx of [-1,1]){ const cap=lbox(0.45,1.15,1.15,0xc8a33a);
    cap.position.set(sx*1.6,1.6,0); g.add(cap); }
  const tie=lbox(3.05,0.42,0.42,0xa8863a); tie.position.set(0,1.6,0.34); g.add(tie);
  const gm=new THREE.SpriteMaterial({map:glowTexCv,color:0xffe89a,transparent:true,
    opacity:0.62,depthWrite:false,fog:false});
  const gs=new THREE.Sprite(gm); gs.scale.set(20,20,1); gs.position.y=2.4; g.add(gs);
  g.userData.glow=gs;
  return g;
}
/* what a scroll's resting place must be: dry, LEVEL, open ground — never a
   cliff face to be buried in, never under a tree, and never in the court of
   a landmark whose masonry would swallow it when the traveller draws near
   (the works of the ancients only BUILD within ~1,600, long after the scroll
   was set down — so they are kept off by their charted stations, which are
   known from the first). */
function scrollSpotClear(x,z){
  const c=landAtWorld(x,z);
  if(!c||c.kind==='wall'||c.kind==='floe'||c.tree) return false;
  const ix=Math.floor(x/B), iz=Math.floor(z/B);
  for(let dx=-1;dx<=1;dx++) for(let dz=-1;dz<=1;dz++){
    if(!dx&&!dz) continue;
    const n=cell(ix+dx,iz+dz);
    if(!n||n.kind==='wall'||Math.abs(n.h-c.h)>2) return false;  /* level, and never at a cliff's foot */
  }
  for(let i=0;i<LANDMARKS.length;i++){ const L=LANDMARKS[i];
    if(L.kind==='mount') continue;                 /* a mount is the land itself — the slope test rules it */
    const w=llToWorld(L.lat,L.lon);
    const keep=L.kind==='range'?1000:L.kind==='wall'?340:L.kind==='city'?220:170;
    if(Math.hypot(x-w[0],z-w[1])<keep) return false; }
  return true;
}
/* set every scroll down once the country sites are known */
function placeScrolls(){
  if(_scrollPlaced||!SITES.length) return; _scrollPlaced=true;
  for(const sc of SCROLLS){
    let ci=-1;
    for(let i=0;i<COUNTRIES.length;i++) if(COUNTRIES[i].n===sc.country){ ci=i; break; }
    const st=ci>=0?SITES[ci]:null;
    if(!st){ sc.gone=true; continue; }        /* a land that is not on this earth */
    /* BEYOND the town's whole footprint, on its own bearing. The old reach
       (74–190) landed squarely inside the ring where a village raises its
       houses — and deeper still inside a great city's lots — which is how
       scrolls came to lie under floors and inside hills the town was cut
       into. A village's outermost works stop near 160 out; a city's near
       380. The scroll starts past them and walks outward, swinging off its
       bearing a little at a time until it finds level, open ground. */
    const r0=cityFor(ci)?400:210, r1=r0+360;
    let x=NaN, z=NaN;
    outer:
    for(let r=r0;r<=r1;r+=16){
      for(let k=0;k<9;k++){                    /* its own bearing first, then swept wider */
        const th=sc.bearing+(k%2?1:-1)*Math.ceil(k/2)*0.55;
        const tx=st.x+Math.sin(th)*r, tz=st.z+Math.cos(th)*r;
        if(scrollSpotClear(tx,tz)){ x=tx; z=tz; break outer; }
      }
    }
    if(isNaN(x)){                              /* no clear court found — any dry ground past the town */
      x=st.x; z=st.z;
      for(let r=r0;r<=r1;r+=22){
        const tx=st.x+Math.sin(sc.bearing)*r, tz=st.z+Math.cos(sc.bearing)*r;
        const c=landAtWorld(tx,tz);
        if(c&&c.kind!=='wall'&&c.kind!=='floe'){ x=tx; z=tz; break; } }
    }
    sc.x=x; sc.z=z; sc.m=null;
  }
}
function updateScrolls(px,pz){
  if(!_scrollPlaced) return;
  for(const sc of SCROLLS){
    if(sc.gone) continue;
    const near=Math.hypot(sc.x-px,sc.z-pz)<620 && !scrollTaken.has(sc.id);
    if(near&&!sc.m){
      /* if the town has since raised a wall, a stall or a well over the very
         stone (an old save, or a layout the placer could not foresee), the
         scroll steps out along its bearing until it stands in the open */
      if(!sc._chk){ sc._chk=true;
        for(let t2=0;t2<24;t2++){
          if(!(blockedByStructureNPC(sc.x,sc.z)||blockedBySolid(sc.x,sc.z,1.0)||treeBlocked(sc.x,sc.z))) break;
          const nx=sc.x+Math.sin(sc.bearing)*12, nz=sc.z+Math.cos(sc.bearing)*12;
          const nc=landAtWorld(nx,nz); if(!nc||nc.kind==='wall'||nc.kind==='floe') break;
          sc.x=nx; sc.z=nz; } }
      sc.m=makeScrollProp(); scene.add(sc.m);
      sc.y=groundInfo(sc.x,sc.z).y;            /* the true walking surface, pier decks included */
      sc.m.position.set(sc.x,sc.y,sc.z); sc.m.rotation.y=hash2(sc.x,sc.z)*6.28; }
    if(sc.m){ sc.m.visible=near;
      if(near&&sc.m.userData.glow)
        sc.m.userData.glow.material.opacity=0.42+0.24*Math.sin(performance.now()*0.0022); }
  }
}
function nearestScrollProp(){
  if(state.mode!=='walk') return null;
  const w=state.walk;
  for(const sc of SCROLLS){ if(sc.gone||scrollTaken.has(sc.id)||!sc.m||!sc.m.visible) continue;
    if(Math.hypot(sc.x-w.x,sc.z-w.z)<9) return sc; }
  return null;
}
function takeScroll(sc){
  if(!sc||scrollTaken.has(sc.id)) return;
  scrollTaken.add(sc.id);
  if(sc.m){ scene.remove(sc.m); freeTree(sc.m); sc.m=null; }
  const left=SCROLLS.filter(x=>!x.gone&&!scrollTaken.has(x.id)).length;
  toast(sc.name+' \u2014 '+sc.words+(left
    ? '  ('+scrollTaken.size+' of '+SCROLLS.filter(x=>!x.gone).length+' scrolls gathered \u2014 the golden needle lies on the next.)'
    : '  EVERY SCROLL IS GATHERED. The whole of it is open to you.'), sc.book);
  saveState();
}
/* the one the golden needle is for: the nearest that is still hidden */
function nextScroll(){
  const p=playerXZ(); let best=null,bd=1e18;
  for(const sc of SCROLLS){ if(sc.gone||scrollTaken.has(sc.id)) continue;
    const d=(sc.x-p.x)**2+(sc.z-p.z)**2; if(d<bd){ bd=d; best=sc; } }
  return best;
}

const PEARLS=[], PEARL_N=6, pearlTaken=new Set();
function makeOyster(){ const g=new THREE.Group();
  const bottom=lbox(2.4,0.7,2.4,0x8a949a); bottom.position.y=0.35; g.add(bottom);
  const top=lbox(2.4,0.6,2.4,0xb0bac0); top.position.set(0,1.4,-0.8); top.rotation.x=-0.8; g.add(top);
  const pearl=lbox(0.8,0.8,0.8,0xf6f2ea); pearl.position.set(0,1.0,0.2); g.add(pearl);
  const gm=new THREE.SpriteMaterial({map:glowTexCv,color:0xeef6ff,transparent:true,opacity:0.55,depthWrite:false});
  const gs=new THREE.Sprite(gm); gs.scale.set(9,9,1); gs.position.set(0,1.8,0.2); g.add(gs);
  return g; }
function initPearls(){ if(PEARLS.length) return;
  for(let k=0;k<PEARL_N;k++){ const m=makeOyster(); m.visible=false; scene.add(m);
    PEARLS.push({m,key:null,x:0,y:0,z:0}); } }
function updatePearls(px,pz){ initPearls();
  const CS=520, ci=Math.round(px/CS), cj=Math.round(pz/CS), sites=[];
  for(let di=-2;di<=2;di++)for(let dj=-2;dj<=2;dj++){ const gi=ci+di,gj=cj+dj;
    if(hash2(gi*2.3,gj*4.7)>0.8){ const key=gi+','+gj; if(pearlTaken.has(key)) continue;
      const wx=gi*CS+(hash2(gi,gj*3)-0.5)*260, wz=gj*CS+(hash2(gj*3,gi)-0.5)*260, fy=seabedDepth(wx,wz);
      const depth=SEA_SURF-fy; if(depth>22&&depth<280) sites.push({key,wx,wz,fy,d:Math.hypot(wx-px,wz-pz)}); } }
  sites.sort((a,b)=>a.d-b.d);
  for(let k=0;k<PEARLS.length;k++){ const s=sites[k], P=PEARLS[k];
    if(s&&s.d<900){ P.key=s.key; P.x=s.wx; P.z=s.wz; P.y=s.fy;
      P.m.position.set(s.wx,s.fy+0.2,s.wz); P.m.rotation.y=hash2(s.wx,s.wz)*6.28; P.m.visible=true; }
    else { P.key=null; P.m.visible=false; } } }
function hidePearls(){ for(const P of PEARLS) P.m.visible=false; }
function nearestPearl(){ if(state.mode!=='dive') return null;
  const dv=state.dive;
  for(const P of PEARLS){ if(!P.key||!P.m.visible) continue;
    if(Math.hypot(P.x-dv.x,P.z-dv.z)<9&&Math.abs(P.y-dv.y)<13) return P; }
  return null; }
function initDeep(){ initKelp(); initCoral(); initSeagrass(); initRays(); initDiveFish(); initShoals(); initSquid(); initDolphins(); initSharks(); initSeaMobs(); initAnglers(); initBub(); initWrecks(); initPearls();
  initAnems(); initSeahorses(); initMorays(); initBedLife(); initDeepLife(); }
function hideDeep(){ seaFloor.visible=false;
  for(const k of KELP)k.m.visible=false; for(const r of CORAL)r.m.visible=false; for(const r of SEAGRASS)r.m.visible=false;
  for(const r of RAYS)r.m.visible=false; for(const f of DIVEFISH)f.m.visible=false; for(const q of SQUIDS)q.m.visible=false;
  for(const d of DOLPHINS)d.m.visible=false; for(const s of SHARKS)s.m.visible=false; hideSeaMobs();
  for(const b of BUB)b.s.visible=false; for(const w of WRECKS)w.visible=false; hidePearls(); hideAnglers(); hideShoals();
  hideReefLife(); hideDeepLife(); deepShown=false; }
/* ---- IS THE EYE BENEATH THE WAVES, AND HOW FAR? ----
   ONE SEA, not two. Whatever puts the eye under the water puts it in the SAME
   sea the diver swims: the bed, the kelp and the fish are all standing there
   when it looks, whether he went down on purpose or a crest simply rolled
   over him. Water you cannot see into is not water — it is a painted floor.
   So the test is made against the TRUE surface of the sea, wave and all.
   What was wrong was never that the water closed over him; it was that it
   closed ALL AT ONCE, and over everything. The instant the swell touched the
   lens the sky, the coast and the whole world were repainted in full-strength
   water-light, and let go again as the crest passed — on and off with every
   wave. So the depth is measured as well as the fact of it, and the sea comes
   in as deep as the eye is under: the skin of a passing crest is a wash over
   the view, and it is only down in the water that the water has it all. */
let _eyeUnder=false, _eyeSub=0;
function eyeUnderwater(){
  if(state.firm){ _eyeUnder=false; _eyeSub=0; return false; }
  /* ---- THE EYE IS UNDER WHEN THE EYE IS UNDER ----
     This used to answer TRUE the instant the mode became 'dive', whatever
     the eye was actually doing. Press dive on the ship and the diver is
     still standing at the rail, mid-leap THROUGH THE AIR — and the whole
     world was repainted in water-light around him: the ship, her masts, the
     sky and the horizon all drowned together. That is the "everything sinks
     into the deep" of it. The dive mode is tested against the true water
     line now, exactly as every other mode is. */
  /* the hold is a room inside a hull. It lies below the waterline by build,
     and the sea has no business in it. */
  if(state.mode==='deck'&&state.deck.level==='hold'){ _eyeUnder=false; _eyeSub=0; return false; }
  const cp=camera.position;
  if(landAtWorld(cp.x,cp.z)){ _eyeUnder=false; _eyeSub=0; return false; }
  /* a little hysteresis at the waterline: the eye must rise clear of the
     swell to come out, or a crest lapping the lens would flicker the whole
     sea on and off from one frame to the next */
  const surf=WATER_Y+seaHeight(cp.x,cp.z);
  _eyeUnder = _eyeUnder ? cp.y<surf+0.55 : cp.y<surf-0.15;
  /* HOW FAR UNDER — 0 at the very skin of the water, whole a few units down */
  /* HOW FAR UNDER. At 3.4 units the whole world went to full water-light
     within half a metre of the surface — a swimmer with his chin wet saw the
     same sea as a diver a kilometre down. It comes in over a fathom and a
     half now, so the skin of the water is a wash and only true depth is
     wholly water. */
  _eyeSub = _eyeUnder ? Math.min(1,Math.max(0,(surf-cp.y)/26)) : 0;
  return _eyeUnder;
}
/* full — the traveller is truly down in the deep, so the wrecks of the
   ancients and the pearl beds are set out for him. Merely looking under the
   surface furnishes the living sea, but not the things he may take. */
function updateDeep(px,py,pz,dt,murk,full){ const t=performance.now()*0.001;
  seaFloor.visible=true; updateSeaFloor(px,pz);   /* updateSeaFloor anchors the mesh itself */
  updateKelp(px,pz,t); updateCoral(px,pz); updateSeagrass(px,pz,t); updateRays(px,py,pz,murk||0);
  updateDiveFish(px,py,pz,dt,t); updateSquid(px,py,pz,dt,t); updateDolphins(px,py,pz,dt,t); updateSharks(px,py,pz,dt,t);
  updateSeaMobs(px,py,pz,dt,t); updateShoals(px,py,pz,dt,t); updateAnglers(px,py,pz,dt,t);
  /* ---- AND BUBBLES ONLY WHERE THERE IS BREATH TO MAKE THEM ----
     The furnished deep is also raised when the traveller merely STANDS BESIDE
     clear shallow water (see shallowView) — and this was spawning a rising
     column of bubbles at his own feet while he stood on dry rock in the
     night. Bubbles belong to a body that is actually under the water. */
  if(full) updateBubbles(px,py,pz,dt);
  else for(const b of BUB) b.s.visible=false;
  updateReefLife(px,py,pz,dt,t); updateDeepLife(px,py,pz,dt,t);
  if(full){ updateWreck(px,pz); updatePearls(px,pz); }
  else { for(const w of WRECKS)w.visible=false; hidePearls(); }
  deepShown=true; }
/* ---- THE CLEAR SHALLOWS TEEM ----
   Fish, turtles and dolphins swim on even when no one dives: seen from the
   deck, the strand or the air wherever the water is shallow and clear. */
function updateShallowLife(px,pz,dt,t){
  initDiveFish(); initDolphins(); initSeaMobs();
  updateDiveFish(px,0,pz,dt,t);
  updateDolphins(px,0,pz,dt,t);
  updateSeaMob(TURTLES,px,0,pz,dt,t);
  /* the seal and the manatee are shallow-water beasts, and both are seen
     from a deck as readily as from under it — the one off the ice at either
     end of the earth, the other grazing the weed in every warm bay */
  updateSeaMob(SEALS,px,0,pz,dt,t); updateSeaMob(MANATEES,px,0,pz,dt,t); updateSeaMob(BELUGAS,px,0,pz,dt,t);
  for(const arr of [SEALS,MANATEES,BELUGAS]) for(const o of arr) if(o.set) o.m.visible=true;
  /* a swimmer in open water is prey — the sharks keep their hunt at the surface */
  if(state.mode==='walk'&&state.walk.inWater&&!landAtWorld(px,pz)){
    updateSharks(px,state.walk.feetY!==undefined?state.walk.feetY:-1,pz,dt,t);
    for(const s of SHARKS) if(s.set) s.m.visible=true;
  }
  /* hideDeep may have blanked them on leaving the dive — show the living */
  for(const f of DIVEFISH) if(f.set) f.m.visible=true;
  /* AND THE SHOALS ARE NOT STIRRED HERE. They are of the DEEP: the little
     bright reef fish above are what is seen through the clear shallows from
     a deck, and the nations of the sea are met by going down to them. */
  hideShoals();
  for(const d2 of DOLPHINS) if(d2.set) d2.m.visible=true;
  if(TURTLES) for(const o of TURTLES) if(o.set) o.m.visible=true;
}
function diveTick(dt){ const dv=state.dive;
  /* ---- the leap from the rail: an arc over the side, head-first in ---- */
  if(dv.jump){ const j=dv.jump; j.t+=dt; const p=Math.min(1,j.t/j.dur);
    dv.x=j.x0+(j.x1-j.x0)*p; dv.z=j.z0+(j.z1-j.z0)*p;
    dv.y=j.y0+(SEA_SURF-2-j.y0)*p*p+Math.sin(p*Math.PI)*7;
    walkerG.position.set(dv.x,dv.y,dv.z); walkerG.rotation.y=dv.heading;
    walkerG.rotation.x=p*1.9;                       /* tipping over into the dive */
    const u=walkerG.userData;
    u.armL.rotation.x=-2.6; u.armR.rotation.x=-2.6; u.armL.rotation.z=0.15; u.armR.rotation.z=-0.15;
    u.legL.rotation.x=0.15; u.legR.rotation.x=-0.1;
    if(p>=1){ dv.jump=null; dv.y=SEA_SURF-3; dv.vy=-42; splash(dv.x,SEA_SURF+1,dv.z,true); }
    return;
  }
  const [f,tn]=axis();
  dv.heading+=tn*dt*DIVE_TURN; const tgt=f*DIVE_MAXSP; dv.sp+=(tgt-dv.sp)*Math.min(1,dt*2.6);
  dv.x+=Math.sin(dv.heading)*dv.sp*dt; dv.z+=Math.cos(dv.heading)*dv.sp*dt;
  /* the land's flank stops the swimmer — no passing through the stone */
  if(landAtWorld(dv.x,dv.z)){
    dv.x-=Math.sin(dv.heading)*dv.sp*dt; dv.z-=Math.cos(dv.heading)*dv.sp*dt; dv.sp*=0.2; }
  /* ---- AND THE BED'S OWN WALLS STOP HIM TOO ----
     The floor clamp was the only law under the sea: swim at an undersea
     cliff and the clamp lifted the body straight UP THROUGH the face of it,
     which read as passing through the stone. Rock standing more than a
     stride over the chest is a WALL now — the way is barred, and the swimmer
     must rise over it as he would climb ashore. A gentle step still rides up. */
  else if(bedTop(dv.x,dv.z)+3>dv.y+8){
    dv.x-=Math.sin(dv.heading)*dv.sp*dt; dv.z-=Math.cos(dv.heading)*dv.sp*dt; dv.sp*=0.2; }
  /* nor through the living reef: a coral head is a standing thing, and the
     diver is set off its rim rather than passing through the polyps */
  for(const r of CORAL){ if(!r.set) continue;
    const dxc=dv.x-r.x, dzc=dv.z-r.z, dc=Math.hypot(dxc,dzc);
    if(dc<12.5&&dv.y<seabedDepth(r.x,r.z)+17){
      /* the set-off point is TESTED first — reefs stand hard against
         shores, and an unchecked shove could put the diver in the rock */
      let ox2,oz2;
      if(dc>0.4){ ox2=r.x+dxc/dc*12.5; oz2=r.z+dzc/dc*12.5; }
      else { ox2=dv.x-Math.sin(dv.heading)*13; oz2=dv.z-Math.cos(dv.heading)*13; }
      if(!landAtWorld(ox2,oz2)&&bedTop(ox2,oz2)+3<=dv.y+8){ dv.x=ox2; dv.z=oz2; }
      dv.sp*=0.4; } }
  /* nor through the timbers of a wreck: her hull is solid, and the way to the
     sea-chest is over the deck, as it is on any honest ship */
  for(const w of WRECKS){ if(!w.visible) continue;
    const dx3=dv.x-w.position.x, dz3=dv.z-w.position.z;
    if(Math.abs(dx3)>44||Math.abs(dz3)>44) continue;
    const cr=Math.cos(w.rotation.y), sr=Math.sin(w.rotation.y);
    const lx=dx3*cr-dz3*sr, lz=dx3*sr+dz3*cr;
    const deckY=w.position.y+8.2;
    if(Math.abs(lx)<7&&Math.abs(lz)<17.5&&dv.y<deckY){
      if(dv.y>deckY-3.5){ dv.y=deckY; dv.vy=Math.max(0,dv.vy); }   /* skimming — he stands on the deck */
      else{ const pux=7-Math.abs(lx), puz=17.5-Math.abs(lz);       /* below it — shoved out the near flank */
        let nlx=lx, nlz=lz;
        if(pux<puz) nlx=(lx>=0?1:-1)*7.2; else nlz=(lz>=0?1:-1)*17.7;
        dv.x=w.position.x+nlx*cr+nlz*sr; dv.z=w.position.z-nlx*sr+nlz*cr; dv.sp*=0.3; } } }
  let up=flyPad; if(keys.Space) up+=1; if(keys.ShiftLeft||keys.ShiftRight||keys.ControlLeft||keys.ControlRight) up-=1; up=Math.max(-1,Math.min(1,up));
  /* ---- THE SOUNDING QUICKENS WITH THE DEPTH ----
     The sea is eleven kilometres deep at the Challenger Deep now, and at a
     swimmer's twenty metres a second that is a nine-minute fall in the dark
     each way. So the descent gathers as it goes, as a weighted sounding does:
     slow and swimmable in the sunlit water where everything is to be seen,
     and running fast by the time the light has gone. */
  const dvDeep=Math.max(0,(SEA_SURF-dv.y)/U_PER_M);            /* how deep he is, in metres */
  const vmax=Math.min(DIVE_VMAX*13, DIVE_VMAX*(1+dvDeep/620));
  const vacc=Math.min(DIVE_VACC*13, DIVE_VACC*(1+dvDeep/620));
  if(up!==0){ dv.vy+=up*vacc*dt; dv.vy=Math.max(-vmax,Math.min(vmax,dv.vy)); }
  else { dv.vy+=(3.4-dv.vy)*Math.min(1,dt*0.8);   /* true buoyancy — a still body drifts up */
    dv.vy=Math.max(-vmax,Math.min(vmax,dv.vy)); }
  dv.y+=dv.vy*dt;
  let floor=bedTop(dv.x,dv.z)+3;
  /* where an undersea mountain breaches the waves, its stone is a WALL, not a
     ramp over the surface — the floor clamp must never fight the surface cap */
  if(floor>SEA_SURF-2){
    dv.x-=Math.sin(dv.heading)*dv.sp*dt; dv.z-=Math.cos(dv.heading)*dv.sp*dt; dv.sp*=0.2;
    floor=Math.min(bedTop(dv.x,dv.z)+3,SEA_SURF-2);
  }
  if(dv.y<floor){ dv.y=floor; dv.vy=Math.max(0,dv.vy); }
  /* ---- AND HE HAS COME DOWN ONTO THE DEEPEST GROUND THERE IS ----
     The other end of the same world from the crown of the ice: eleven
     kilometres of black water over his head and the floor of a named trench
     under his feet. Each one is worth the scene once.
     It is a NEARNESS, not a landing: a still body drifts up of itself, so a
     diver who lets go a body's length off the bed hangs there and never once
     satisfies the floor clamp — and the scene would only ever play for
     someone holding SHIFT at the moment he arrived. */
  if(!cut&&dv.y<floor+16){ const nd=nearestDeep(dv.x,dv.z);
    if(nd&&nd.deep.m>=6000&&nd.d<nd.deep.R*0.4&&!seenDeeps.has(nd.deep.n)){
      seenDeeps.add(nd.deep.n);
      toast('You stand upon the floor of '+nd.deep.n+' \u2014 '
        +Math.round((SEA_SURF-dv.y)/U_PER_M).toLocaleString()+' metres beneath the waves.');
      playScene('hadal',{x:dv.x,y:dv.y,z:dv.z,out:dv.heading}); } }
  /* touch the surface without pressing down, and you break it — the sea
     gives the body back; hold SHIFT to stay under against the buoyancy */
  if(dv.y>SEA_SURF-2){ dv.y=SEA_SURF-2; dv.vy=Math.min(0,dv.vy); if(up>=0){ surface(); return; } }
  { const rr=Math.hypot(dv.x,dv.z)/R_WORLD;         /* the rim: hard, and inward always open */
    if(rr>0.985){ const k=0.985/rr; dv.x*=k; dv.z*=k; dv.sp*=0.3; } }
  state.dist+=Math.abs(dv.sp)*dt;
  const u=walkerG.userData, ph=performance.now()*0.007;
  walkerG.position.set(dv.x,dv.y,dv.z); walkerG.rotation.y=dv.heading;
  /* the swimming model — lying flat, arms reaching forward, legs in a flutter kick */
  const pitch=Math.max(-0.35,Math.min(0.35,-dv.vy/DIVE_VMAX*0.6));
  walkerG.rotation.x=1.45+pitch;
  u.armL.rotation.x=-3.0+Math.sin(ph)*0.22; u.armR.rotation.x=-3.0+Math.sin(ph+0.4)*0.22;
  u.armL.rotation.z=0.14; u.armR.rotation.z=-0.14;
  u.legL.rotation.x=Math.sin(ph*1.5)*0.5; u.legR.rotation.x=-Math.sin(ph*1.5)*0.5; }
function enterDive(){ if(state.firm) return;  /* not from behind the map view */
  if(state.mode==='dive'){ surface(); return; }
  let x,z,h,jump=null;
  if(state.mode==='walk'){ x=state.walk.x; z=state.walk.z; h=state.walk.heading; }
  else if(state.mode==='boat'||state.mode==='deck'){
    /* THE DIVER LEAPS FROM THE RAIL — the ship stays where she rides.
       Find open water abeam of the hull: starboard first, then port, then astern. */
    if(state.mode==='deck'&&state.deck.level==='hold'){ toast('Come up out of the hold first — you dive from the rail.'); return; }
    const b=state.boat, ch=Math.cos(b.heading), sh=Math.sin(b.heading);
    const offs=[[ch,-sh],[-ch,sh],[-sh*1.6,-ch*1.6]];
    for(const o of offs){ const tx=b.x+o[0]*42, tz=b.z+o[1]*42;
      if(!landAtWorld(tx,tz)){ x=tx; z=tz; break; } }
    if(x===undefined){ toast('No open water to leap into — stand off the land first.'); return; }
    walkerG.getWorldPosition(_wv);               /* from where he stands upon the deck */
    h=Math.atan2(x-_wv.x,z-_wv.z);
    jump={x0:_wv.x,y0:_wv.y,z0:_wv.z,x1:x,z1:z,t:0,dur:0.7};
  }
  else return;
  if(landAtWorld(x,z)||Math.hypot(x,z)/R_WORLD>0.985){ toast('You must be over open water to dive into the deep.'); return; }
  initDeep();
  state.dive.x=x; state.dive.z=z; state.dive.heading=h; state.dive.y=SEA_SURF-6; state.dive.vy=-22; state.dive.sp=0;
  if(jump){ state.dive.jump=jump; state.dive.x=jump.x0; state.dive.z=jump.z0; state.dive.y=jump.y0; state.dive.vy=0; }
  else { state.dive.jump=null; splash(x,SEA_SURF+1,z,true); }   /* never let an old leap replay */
  setMode('dive');
  if(!diveHintShown){ diveHintShown=true;
    toast('You slip beneath the waves — SHIFT to dive deeper, SPACE to rise, W/S to swim, C to surface. Left alone, the body floats up of itself.'); } }
function surface(){ const dv=state.dive;
  dv.jump=null;                                       /* an interrupted rail-leap must not replay */
  state.walk.x=dv.x; state.walk.z=dv.z; state.walk.heading=dv.heading; state.walk.feetY=undefined; state.walk.vy=0; state.walk.grounded=true;
  setMode('walk'); hideDeep(); toast('You break the surface and draw breath.'); }

/* ================= AMBIENT WILDLIFE — THE BEASTS OF THE FIELD & FOWL OF THE AIR =========
   Herds and flocks roam the whole earth, not only the villages: beasts upon
   the land (chosen by the clime — camels and lions in the warm dry south,
   cattle, horses, deer and wolves in the temperate lands), and birds,
   butterflies and eagles wheeling in the air above land and sea. */
/* ---- WHERE EACH BEAST BELONGS ----
   Every creature was drawn from one of five short lists by the CLIMATE alone,
   so the same dozen beasts stood in every country on the earth and no land
   had anything of its own: a lion might stand in a Norwegian wood, and an
   elephant was as likely in Peru as in Kenya.
   IT IS THE LAND THAT SAYS NOW. world/fauna.js keeps, for every nation on
   the chart, the beasts that truly walk in it; each beast keeps the grounds
   it will stand upon, how high it goes, and whether it holds to a river. A
   spot is looked up by its COUNTRY first, and the climate table is only the
   floor under the uncharted isles and any land not yet written. */
const FAUNA=(function(){
  const F=(window.EARTH&&window.EARTH.faunaList&&window.EARTH.faunaList[0])||{};
  return {roles:F.roles||{}, prey:F.prey||[], keeps:F.keeps||{},
          wilds:F.wilds||{}, lands:F.lands||{}};
})();
/* the fallback, when a land has no list of its own */
const WILD_TEMPERATE=FAUNA.wilds.grass||['cow','sheep','horse','donkey','pig','deer','wolf','dog','chicken','hare','goat','ox'];
const WILD_DRY=FAUNA.wilds.desert||['camel','ostrich','lion','goat','donkey','lizard','hare'];
const WILD_SAVANNA=FAUNA.wilds.savanna||['ostrich','lion','elephant','deer','goat','donkey'];
const WILD_COLD=FAUNA.wilds.tundra||['wolf','deer','hare','ox','goat'];
const WILD_HIGH=FAUNA.wilds.alpine||['goat','goat','deer','wolf','hare'];
/* a river runs here or hard by — and a RIVER, not the sea: the chart says a
   watercourse, and the ground about it belongs to a country */
function riverBankAt(x,z){
  /* a watercourse is stamped only one or two map pixels wide — about 120 to
     240 units — so a single probe at the point almost never lands on one.
     Two rings, at a bowshot and at three, find the bank it stands on. */
  if(riverAtUV(x/R_WORLD,z/R_WORLD)&&countryAtUV(x/R_WORLD,z/R_WORLD)) return true;
  for(const s of [150,290]) for(let k=0;k<9;k++){ const a=k/9*6.283;
    const u=(x+Math.cos(a)*s)/R_WORLD, v=(z+Math.sin(a)*s)/R_WORLD;
    if(riverAtUV(u,v)&&countryAtUV(u,v)) return true; }
  return false;
}
/* ---- IS THERE A TREE WITHIN REACH OF THIS POINT? ----
   The cell a beast is put down on almost never carries a tree — they are one
   cell in twenty at best. A creature that LIVES in a tree must be looked for
   over a little ground, not on the one square: this walks out four cells in
   a ring and hands back the nearest bole, with the true crown height of that
   species on it. It is what the tree-dwellers are placed by, and what the
   nests of the birds are hung from. */
function treeNear(x,z,reach){
  reach=reach||4;
  const ix0=Math.floor(x/B), iz0=Math.floor(z/B);
  for(let r=0;r<=reach;r++){
    for(let a=-r;a<=r;a++) for(let b2=-r;b2<=r;b2++){
      if(r>0&&Math.abs(a)!==r&&Math.abs(b2)!==r) continue;
      const ix=ix0+a, iz=iz0+b2, c=cell(ix,iz);
      if(!c||!c.tree||c.kind==='wall') continue;
      if(!window.FLORA) return {ix,iz,c,y:c.h*B+B*2.6,x:(ix+0.5)*B,z:(iz+0.5)*B};
      const K=FLORA.treeAt(landNameAt((ix+0.5)*B,(iz+0.5)*B),c.kind,c.h,ix,iz,hash2,false);
      const crown=K?FLORA.crownY(K,ix,iz,hash2):0;
      if(crown<B*1.2) continue;                 /* a shrub is not a home */
      return {ix,iz,c,K,crown,y:c.h*B+crown,x:(ix+0.5)*B,z:(iz+0.5)*B}; } }
  return null;
}
/* ---- MAY THIS BEAST STAND ON THIS GROUND AT ALL? ----
   The ground it keeps and the height it keeps, and nothing else — the
   river and the tree are questions for where it is first SET DOWN, not
   for every step it takes. This is the test a beast's own feet obey as it
   roams: the habitat table gated only spawning before, so a roe deer put
   down in a valley simply walked up out of its band onto the bare rock
   above the tree line and stood there. It turns back at its own frontier
   now, exactly as it turns back at a cliff. */
function beastMayStand(name,c){
  if(!c||c.kind==='wall') return false;
  const K=FAUNA.keeps[name]; if(!K) return true;
  if(K.g&&K.g.indexOf(c.kind)<0) return false;
  if(K.h&&(c.h<K.h[0]||c.h>K.h[1])) return false;
  return true;
}
/* will this beast set foot on this ground, at this height, by this water? */
function beastFits(name,k,hb,river,tree){
  const K=FAUNA.keeps[name]; if(!K) return true;         /* unlisted: it goes anywhere */
  if(K.g&&K.g.indexOf(k)<0) return false;
  if(K.h&&(hb<K.h[0]||hb>K.h[1])) return false;
  if(K.riv&&!river) return false;                        /* it keeps the banks and nothing else */
  /* ---- AND THE ONES THAT LIVE IN THE TREES MUST HAVE ONE ----
     The sloth, the koala, the orangutan and the howler walked about on the
     open ground at six units a second, which is four things wrong at once.
     They are not put down at all where no tree stands. */
  if(K.tr&&!tree) return false;
  return true;
}
/* the beasts of THIS land, or the climate's own if the land has no list */
function faunaFor(x,z,k){
  const ci=countryAtUV(x/R_WORLD,z/R_WORLD);
  if(ci&&COUNTRIES[ci-1]){ const L=FAUNA.lands[COUNTRIES[ci-1].n]; if(L&&L.length) return L; }
  return null;
}
function landKindAt(x,z,c){
  const lat=90-Math.hypot(x/R_WORLD,z/R_WORLD)*180;      /* signed: the midst is north */
  const alat=Math.abs(lat), arid=fbm(x*0.0009+5,z*0.0009-8);
  /* THE DRAW IS SEEDED ON A TILE OF GROUND, not on the beast — so a whole
     field bears the same kind and a herd stands together in it, and the same
     field bears the same kind for ever. */
  const j=hash2(Math.floor(x/48),Math.floor(z/48));
  const k=c?c.kind:'grass', hb=c?c.h:1;
  /* ---- THE ICE KEEPS ITS OWN, AND IT IS NOT THE SAME ICE AT BOTH ENDS ----
     The floes and the foot of the wall short-circuited the whole system and
     handed back ONE of three answers for the entire polar region: a polar
     bear or an arctic fox in the north, a penguin in the south, for ever. The
     ice goes through the fauna file now like everything else — but the ONE
     rule that must never break is that the two ends of the earth do not share
     a creature. A penguin has never seen a polar bear and never will. */
  if(k==='floe'||k==='wall'){
    const L=FAUNA.wilds[k]; if(!L||!L.length) return lat>0?'polarbear':'penguin';
    const south=lat<0, fit=[]; let w=0;
    for(const n of L){ if(south!==(n==='penguin')) continue;
      const K=FAUNA.keeps[n];
      if(K&&K.g&&K.g.indexOf(k)<0) continue;
      fit.push(n); w+=(K&&K.w)||1; }
    if(!fit.length) return south?'penguin':'polarbear';
    let r=j*w;
    for(const n of fit){ r-=((FAUNA.keeps[n]&&FAUNA.keeps[n].w)||1); if(r<=0) return n; }
    return fit[fit.length-1]; }
  const land=faunaFor(x,z,k);
  if(land){
    /* only the beasts that will truly stand HERE — the ground underfoot, the
       height, and whether a watercourse runs by. The river is the dearest
       question to ask, so it is asked once, and only if some beast of this
       land actually cares about the answer. */
    let river=null, wood=null, fit=[], w=0;
    for(const nm of land){ const K=FAUNA.keeps[nm];
      if(K&&K.riv){ if(river===null) river=riverBankAt(x,z); if(!river) continue; }
      if(K&&K.tr&&wood===null) wood=treeNear(x,z,4)||false;
      if(!beastFits(nm,k,hb,river,!!wood)) continue;
      fit.push(nm); w+=(K&&K.w)||1; }
    if(fit.length){
      /* drawn by weight, so the great territorial beasts — the lion, the
         rhinoceros, the leopard — are met as seldom as they ought to be */
      let r=j*w;
      for(const nm of fit){ r-=((FAUNA.keeps[nm]&&FAUNA.keeps[nm].w)||1); if(r<=0) return nm; }
      return fit[fit.length-1];
    }
  }
  /* ---- AND WHERE NO LIST IS WRITTEN ---- the old climate table.
     BUT THE ARCTIC IS NOT A CLIMATE, IT IS A PLACE. The snow table is
     polar bears, arctic foxes and lemmings — and it was reached by ANY
     ground the mesher happened to call 'snow', which now includes the
     crown of a Japanese or Chinese alp. So a polar bear could stand on
     Mount Paektu. Above the true arctic line the table stands; below it,
     a snowfield in a country whose own beasts cannot live there bears
     NOTHING AT ALL, which is exactly what a glacier bears. */
  /* AND THE CLIMATE TABLE MUST OBEY THE HABITATS TOO. It picked blind —
     a plain index into the list, with no test of ground or height at all
     — so a country with no list of its own put roe deer and hares on bare
     rock a thousand metres above the tree line. Every draw is filtered
     now, by exactly the rule the country lists are filtered by. */
  /* ---- AND NO BEAST OUT OF ITS OWN CLIMATE ----
     The fallback tables are named for the GROUND, not the place, so a patch of
     sand in the Amazon reached the desert table and put a jerboa in Brazil,
     and a cold upland in a warm land reached the arctic table. A beast of the
     ice may not be drawn below the cold line, and a beast of the true desert
     may not be drawn in the wet tropics, whatever the ground looks like. */
  const ICE_KIN=new Set(['polarbear','arcticfox','arctichare','arcticwolf','ermine','lemming',
    'ptarmigan','muskox','reindeer','wolverine','penguin','mammoth','narwhal']);
  const DRY_KIN=new Set(['jerboa','camel','addax','oryx','scorpion','viper','bustard','wildass']);
  const wetTropic=alat<24&&arid<=0.54;
  const climateOK=nm=>{ if(ICE_KIN.has(nm)&&alat<52) return false;
    if(DRY_KIN.has(nm)&&wetTropic) return false; return true; };
  const pick=L=>{ if(!L||!L.length) return null;
    const fit=L.filter(nm=>climateOK(nm)&&beastFits(nm,k,hb,false,false));
    if(!fit.length) return null;
    return fit[Math.floor(j*fit.length)%fit.length]; };
  if(k==='snow'&&alat<56) return null;
  const byKind=pick(FAUNA.wilds[k]);
  if(byKind) return byKind;
  if(k==='alpine'||k==='rock'||hb>34) return pick(WILD_HIGH);
  if(k==='snow'||k==='tundra') return pick(WILD_COLD);
  if(k==='desert'||k==='badlands'||(alat<34&&arid>0.54)) return pick(WILD_DRY);
  if(alat<24) return pick(WILD_SAVANNA);
  return pick(WILD_TEMPERATE);
}
/* THE PLAIN CARRIES A CROWD. Six-and-twenty beasts was a thin scattering
   anywhere, and on the great grassland — which is a place of HERDS, and reads
   as nothing at all without them — it was three zebra and a lion. */
/* ---- THE BEASTS COME OUT OF THE HAZE, NEVER OUT OF NOTHING ----
   The pool spawned 70–430 units out — in front of the traveller's face, in
   clear air (the fog only begins at 500) — and was reaped at exactly 500,
   right ON the fog line, so herds materialised and vanished in plain sight.
   A beast is now set down deep IN the haze (850–1,250; the fog runs 500 to
   1,140, so a spawn is at least half-swallowed and mostly whole-swallowed)
   and reaped past it (1,350). The pool is grown to keep the plain as
   thickly peopled as before across the wider ground it now covers. */
const LANDLIFE=[], LL_N=96, LL_R=1250, LL_MIN=850, LL_REAP=1350;
const AMBIENT_PREY=new Set(FAUNA.prey.length?FAUNA.prey
  :['sheep','goat','pig','chicken','hare','deer','donkey','cow','horse','ostrich']);
/* ---- AND WHAT EACH IS ABOUT ----
   Nothing had any business but to walk to a random point and walk to another.
   Every creature now keeps a trade: the grazers feed, herd and bed down; the
   wolves hunt as a PACK and gather to the kill; the lion creeps in low and
   then charges; the bear forages and fishes the rivers; the crocodile lies
   sunk to the eyes and lunges at whatever comes within reach.
   Which beast keeps which trade is in world/fauna.js, with everything else
   about it. */
const WILD_ROLE=Object.assign({wolf:'pack', lion:'stalk', bear:'forage',
  blackbear:'forage', crocodile:'ambush', lizard:'bask'}, FAUNA.roles);
function initLandLife(){ if(LANDLIFE.length) return; for(let k=0;k<LL_N;k++) LANDLIFE.push({m:null,kind:null,hx:0,hz:0,x:0,z:0,heading:0,tx:0,tz:0,t:0,set:false,
  retry:Math.random()*2.2 /* the first filling is STAGGERED — ninety-six beasts built in one frame is a hitch */ }); }
/* the far ring first (out in the haze, where a spawn is unseen) — but a
   SMALL ISLE is narrower than that ring, and a traveller ashore on one
   found it stripped of every living thing: all ten casts landed in the sea.
   The last few casts fall back to a nearer ring (420–850, at least half
   into the fog), used only where the far ring found no land at all. */
function findLandSpot(px,pz,rMin,rMax){ rMin=rMin||LL_MIN; rMax=rMax||LL_R;
  for(let tr=0;tr<10;tr++){ const a=Math.random()*6.28,
    r=tr<6?rMin+Math.random()*(rMax-rMin):Math.max(420,rMin*0.55)+Math.random()*Math.max(430,rMin*0.45),
    x=px+Math.cos(a)*r, z=pz+Math.sin(a)*r;
    /* beasts keep to the charted lands (ci>0 — the countries and true isles);
       the bare rocks and skerries of the open ocean stay bare.
       (The old bar of six blocks kept every creature off the high country —
       now that there IS high country, the goats and wolves may have it.) */
    const c=landAtWorld(x,z); if(!c) continue;
    if(c.tree&&treeBlocked(x,z)) continue;      /* never born inside a bole */
    if(landmarkSolidAt(x,z,c.h*B+1,c.h*B+8)) continue;   /* nor inside the ancients' stones */
    if(c.ci&&c.kind!=='wall'&&Math.hypot(x,z)/R_WORLD<0.9) return {x,z,y:c.h*B,c};
    /* THE ICE BEARS ITS OWN. Penguins stand on the floes and about the FOOT
       of the wall — but the high crown of it, up against the firmament, is
       bare of every living thing, as such a place ought to be. */
    if((c.kind==='floe'||(c.kind==='wall'&&c.h<=60))) return {x,z,y:c.h*B,c};
  } return null; }
/* ---- WHAT THE GRASS FILE NEEDS TO KNOW ABOUT A POINT ----
   The ground it is, and how far it lies from a settled place — a village
   keeps its own ground grazed and cut, which is the same number the chunk
   mesher hands GRASS.at when it draws the blades. The beast walking to a
   bite and the mesher drawing it are asking the same question of the same
   file, so the beast arrives at grass that is really there. */
function grassProbe(x,z){ const c=landAtWorld(x,z);
  if(!c||c.kind==='wall'||!GRASS.SWARD[c.kind]) return null;
  return {kind:c.kind, wild:nearSettled(x,z)?0.34:1}; }
/* give a mother her young, or take them away again */
function setYoung(a,want){
  if(a.kids) for(const y of a.kids){ scene.remove(y.m); freeTree(y.m); }
  a.kids=null;
  if(!want||!window.BABY) return;
  const Y=BABY.youngOf(a.kind); if(!Y) return;
  const n=Math.max(1,Math.round(Y.n*(0.6+Math.random()*0.6)));
  a.kids=[];
  for(let i=0;i<n;i++){
    const m=BABY.makeYoung(makeAnimal,a.kind); if(!m) break;
    scene.add(m);
    a.kids.push({m,x:a.x,z:a.z,heading:a.heading,ph:Math.random()*6.283,suck:0,side:i%2?1:-1}); }
  if(!a.kids.length) a.kids=null;
}
function hideYoung(a){ if(a.kids) for(const y of a.kids) y.m.visible=false; }
/* ---- A PIECE OF THE DAY'S SMALL BUSINESS, TAKEN UP ----
   Drawn by weight from the creature's own list in js/behavior.js — the
   zebra's dust-bath, the meerkat's watch, the elephant's wallow. The acts
   that want water are only performed where a river truly runs by. Hands
   back true if the beast took something up. */
function tryAct(a){
  if(!window.BEHAVIOR||Math.random()>0.45) return false;
  const act=BEHAVIOR.drawAct(a.kind,Math.random());
  if(!act||act==='graze') return false;
  if((act==='drink'||act==='wallow')&&!a.river) return false;
  a.job='act'; a.act=act; a.jt=3+Math.random()*4; a.tx=a.x; a.tz=a.z;
  return true;
}
/* ---- WHERE THIS ONE BEAST SLEEPS ----
   Its OWN bed, not a spot under it when the clock stopped: the built den
   of its own kind if one stands in reach (the same dens js/nest.js raises
   on the ground), else its tree, else a remembered spot of its own ground
   — hashed from its home range, so the same beast makes for the same
   hollow every dusk. The herd beasts of the open answer null and bed
   where the herd stands. */
function findDen(a){
  for(const N of NESTS){ if(!N.set||N.bird) continue;
    if(N.kind&&N.kind.indexOf(a.kind+'|')===0&&Math.hypot(N.x-a.x,N.z-a.z)<280){
      /* ---- AND A BEAST THAT WINTERS IN A CAVE LIES *INSIDE* IT ----
         She used to bed at the mouth, on the doorstep of her own den. The
         chamber runs back from the site, so she is laid well within it — and
         the traveller who walks up to a cave in winter finds her in there. */
      if(N.kind.indexOf('|cave')>0) return {x:N.x, z:N.z-B*1.6};
      return {x:N.x,z:N.z}; } }
  const H=window.BEHAVIOR?BEHAVIOR.homeOf(a.kind):'open';
  if(H==='open') return null;
  if(H==='tree'){ const w2=treeNear(a.hx,a.hz,5); if(w2) return {x:w2.x,z:w2.z}; }
  const aa=hash2(a.hx*0.13,a.hz*0.17)*6.283, rr=18+hash2(a.hz*0.11,a.hx*0.19)*36;
  return {x:a.hx+Math.cos(aa)*rr, z:a.hz+Math.sin(aa)*rr};
}
/* ================= THE SPRING BLOOM =================
   The baked flowers in the chunks are the world's year-round few; this is the
   FLUSH — a scatter of extra flowers that breaks on the grasslands in the
   flowering season (spring in the temperate lands, the wet in the tropics, the
   brief summer at the poles) and dies back as the season turns. Like the sea's
   weed it is a MOVING POOL set down near the traveller, so no chunk is ever
   re-meshed: the flowers are simply shown or hidden by the season where each
   one stands, and thin out toward autumn. */
const bloomMatR=new THREE.MeshBasicMaterial({map:TEX.flowerR,alphaTest:0.4,side:THREE.DoubleSide});
const bloomMatY=new THREE.MeshBasicMaterial({map:TEX.flowerY,alphaTest:0.4,side:THREE.DoubleSide});
windSway(bloomMatR,0.5,true); windSway(bloomMatY,0.5,true);   /* they nod on the wind with the grass */
function makeBloom(){ const g=new THREE.Group(), n=5+Math.floor(Math.random()*6);
  for(let i=0;i<n;i++){ const mat=Math.random()<0.5?bloomMatR:bloomMatY;
    /* two crossed blades apiece, so a flower is seen from any side */
    for(const rot of [0,Math.PI/2]){ const bl=new THREE.Mesh(new THREE.PlaneGeometry(1.5,1.7),mat);
      bl.position.set((Math.random()-0.5)*7,0.85,(Math.random()-0.5)*7); bl.rotation.y=rot+(Math.random()-0.5)*0.5;
      g.add(bl); } }
  return g; }
const BLOOMS=[], BLOOMS_N=70, BLOOMS_R=420;
function initBlooms(){ if(BLOOMS.length) return; for(let k=0;k<BLOOMS_N;k++){ const m=makeBloom(); m.visible=false; scene.add(m); BLOOMS.push({m,x:0,z:0,set:false}); } }
function updateBlooms(px,pz,dt){ initBlooms(); const doy=dayOfYear();
  for(const b of BLOOMS){
    if(!b.set||Math.hypot(b.x-px,b.z-pz)>BLOOMS_R+80){ b.set=false;
      /* set it down on true grassland — never sand, rock, snow or the sea.
         Never at the traveller's feet: a clump breaking ground in clear air
         reads as a glitch, so it is set down from 140 out and GROWS in
         (the sprout ramp below), the way the true spring flush would. */
      for(let tr=0;tr<8;tr++){ const a=Math.random()*6.28, rr=140+Math.random()*(BLOOMS_R-140), x=px+Math.cos(a)*rr, z=pz+Math.sin(a)*rr;
        if(grassProbe(x,z)){ const c=landAtWorld(x,z); b.x=x; b.z=z; b.m.position.set(x,(c?c.h*B:WATER_Y),z); b.set=true; b.age=0; break; } }
      if(!b.set){ b.m.visible=false; continue; } }
    /* shown only where — and while — the flowers are in season, and thinning
       as it wanes (js/season.js reckons the bloom for this latitude and day) */
    const latN=1-Math.hypot(b.x,b.z)/R_WORLD*2;
    const bloom=window.SEASON?SEASON.bloomFactor(latN,doy):0.4;
    /* the sprout ramp — one second, reckoned in SECONDS. Counted per frame
       it grew in a third of the time on a fast screen and three times over
       on a slow one. */
    b.age=Math.min(1,(b.age===undefined?1:b.age)+dt);
    if(bloom>0.08){ b.m.visible=true; b.m.scale.setScalar((0.45+0.55*bloom)*(0.15+0.85*b.age)); }
    else b.m.visible=false;
  } }
function hideBlooms(){ for(const b of BLOOMS) if(b.m) b.m.visible=false; }
function updateLandLife(px,pz,dt,t){ initLandLife();
  const night=(worldNight||0)>0.6;
  /* ---- THE RING RIDES THE HAZE ----
     The spawn ring (850–1,250) was tuned to a fog that shuts at 1,140 — a
     beast was born half-swallowed. A FLYER'S air stands open (the fog eases
     out to thousands of units), so the same numbers set beasts down in clear
     view below him, popping into being. The ring now rides the fog's own
     reach, capped where a beast is beneath seeing anyway — so a spawn is
     born in the haze on the ground and beyond notice from the air alike. */
  const ff=scene.fog?scene.fog.far:1140;
  const llMin=Math.min(2400,Math.max(LL_MIN,ff*0.75));
  const llMax=Math.min(2800,Math.max(LL_R,ff*1.02));
  const llReap=Math.min(3050,Math.max(LL_REAP,ff*1.12));
  for(const a of LANDLIFE){ if(!a.set||Math.hypot(a.hx-px,a.hz-pz)>llReap){
      /* an empty slot cools off between tries — over open water every slot
         was running ten land probes EVERY frame, for nothing */
      a.retry=(a.retry||0)-dt; if(!a.set&&a.retry>0) continue;
      a.retry=1.2+Math.random()*0.8;
      const sp=findLandSpot(px,pz,llMin,llMax);
      if(!sp){ if(a.m)a.m.visible=false; hideYoung(a); a.set=false; continue; }
      const kind=landKindAt(sp.x,sp.z,sp.c);
      /* the ground named no beast — a bare glacier, a crest above the life
         line. It stays bare; the slot tries elsewhere next tick. */
      if(!kind){ if(a.m)a.m.visible=false; hideYoung(a); a.set=false; continue; }
      if(a.kind!==kind){ if(a.m){ scene.remove(a.m); freeTree(a.m); }   /* the old beast is given back */
        a.m=makeAnimal(kind); scene.add(a.m); a.kind=kind; }
      a.hx=sp.x; a.hz=sp.z; a.x=sp.x; a.z=sp.z; a.tx=sp.x; a.tz=sp.z; a.t=Math.random()*3; a.set=true;
      a.role=WILD_ROLE[kind]||'graze'; a.job='roam'; a.jt=Math.random()*3; a.prey=null; a.cool=0;
      a.dead=0; a.den=null; a.act=null; a.burst=0; a.fear=0; a.panicT=0; a.ph=Math.random()*6.283;
      a.m.rotation.set(0,0,0);
      /* ---- UP THE TREE, IF THAT IS WHERE IT LIVES ----
         Set at the true crown height of the tree standing on its own cell,
         the same question the nests ask. It does not roam: it hangs there,
         and shifts about once in a long while, which is the whole of what a
         sloth or a koala does with its day. */
      { const K=FAUNA.keeps[kind]; a.upTree=0;
        if(K&&K.tr){ const w2=treeNear(sp.x,sp.z,4);
          if(w2){ /* it is set IN that tree, not on the ground beside it */
            a.x=a.hx=a.tx=w2.x; a.z=a.hz=a.tz=w2.z;
            a.upTree=Math.max(B*1.5,w2.crown*0.85); } }
        /* ---- AND WHAT HOURS IT KEEPS ----
           Written per creature in js/behavior.js: 'day' beasts sleep the
           night, 'night' beasts sleep the day, 'dusk' and 'all' are never
           caught quite still. The old rule (hunters nocturnal, the rest
           diurnal) stands under anything the behavior file has no line for. */
        a.day=(window.BEHAVIOR&&BEHAVIOR.of(kind))?BEHAVIOR.dayOf(kind)
          :((K&&K.night)||a.role==='stalk'||a.role==='pack')?'night':'day'; }
      a.river=riverBankAt(sp.x,sp.z); a.sink=0; a.crouch=false; a.hidden=false;
      a.m.visible=true; a.m.position.set(sp.x,sp.y,sp.z);
      /* ---- AND SOME OF THEM HAVE YOUNG AT FOOT ----
         Not every beast and not every season: about one in four, and only
         the kinds that keep their young WITH them (js/baby-animals.js says
         which — a fox cub is at the den and is not out here). The young is
         built from its mother's OWN model, so a zebra's is a small zebra
         with a near full-sized head, which is what makes a thing read as
         young without anybody being told. */
      /* ---- THE HERDS HAVE THEIR YOUNG IN THE SPRING ----
         Spring is the time of birth and winter the barren time, by the season
         where the herd stands (js/season.js). So a herd met in spring is thick
         with young at foot, and one met in the snow has almost none. */
      { const breed=window.SEASON?SEASON.breedFactor(1-Math.hypot(sp.x,sp.z)/R_WORLD*2,dayOfYear()):1;
        setYoung(a, window.BABY && BABY.runs(kind) && hash2(sp.x*0.031,sp.z*0.027)<0.26*breed); } }
    if(!a.set) continue;
    /* ---- THE KILL LIES WHERE IT FELL ----
       A caught beast used to shake itself and trot off while its killer
       fed on the bare ground beside it, which made every hunt on the earth
       a mime. The quarry goes DOWN now: it lies on its side where it was
       pulled down, the hunter feeds over the carcass, and only when the
       meal is long done does the slot quietly go back into the world's
       pocket to come out somewhere far off as a living beast again. */
    if(a.dead>0){ a.dead-=dt;
      const cD=landAtWorld(a.x,a.z);
      a.m.position.set(a.x,(cD?cD.h*B:WATER_Y)-0.9,a.z);
      a.m.rotation.set(0,a.heading,1.35);
      if(a.m.userData.legs) for(const L of a.m.userData.legs){ L.rotation.x=0; jointTick(L,false); }
      hideYoung(a);
      if(a.dead<=0){ a.set=false; a.m.visible=false; a.m.rotation.set(0,0,0); }
      continue; }
    /* its own pace, from the behavior file — a hippo does not walk like a
       gazelle, and a cheetah's charge is nothing like a lion's */
    const walkSpd=window.BEHAVIOR?BEHAVIOR.walkOf(a.kind,5):5;
    const runSpd=window.BEHAVIOR?BEHAVIOR.runOf(a.kind,13):13;
    let spd=walkSpd; a.jt=(a.jt||0)-dt; a.cool=(a.cool||0)-dt;
    const role=a.role||'graze';
    /* ---- WHETHER THIS BEAST IS AWAKE AT ALL ----
       Only the grazers ever slept. A badger foraged at noon and a lion
       hunted at noon, and nothing on the earth kept its own hours. A beast
       that keeps the night is up when the diurnal ones are bedded, and down
       when they are up — which halves what you meet at any hour and doubles
       what it is worth meeting. */
    let asleep=(a.day==='all'||a.day==='dusk')?false:(a.day==='night'?!night:night);
    /* ---- AND SOME SLEEP THE WHOLE WINTER THROUGH ----
       The bear, the hedgehog and the badger den up when the snow lies and are
       not seen again until the thaw (js/season.js names the hibernators). They
       bed down wherever the season is winter about them. */
    if(window.SEASON&&SEASON.dormant(a.kind,1-Math.hypot(a.hx,a.hz)/R_WORLD*2,dayOfYear())) asleep=true;
    /* a beast up a tree does not walk anywhere at all */
    if(a.upTree>0){
      a.jt-=0; if(a.jt<=0){ a.jt=8+Math.random()*14;
        const aa=Math.random()*6.28, rr=Math.random()*3;
        a.tx=a.hx+Math.cos(aa)*rr; a.tz=a.hz+Math.sin(aa)*rr; }
      const dxt=a.tx-a.x, dzt=a.tz-a.z, ddt=Math.hypot(dxt,dzt)||1;
      if(ddt>0.6&&!asleep){ a.x+=dxt/ddt*0.7*dt; a.z+=dzt/ddt*0.7*dt; a.heading=Math.atan2(dxt,dzt); }
      const ct=landAtWorld(a.x,a.z);
      a.m.position.set(a.x,(ct?ct.h*B:WATER_Y)+a.upTree,a.z);
      a.m.rotation.y=a.heading; a.m.rotation.x=asleep?0.3:0;
      if(a.m.userData.legs) for(const L of a.m.userData.legs){ L.rotation.x=0; jointTick(L,false); }
      continue;
    }
    /* the ground this beast is standing in: what it can eat here, and how
       deep the cover is over it. Asked four times a second and not sixty —
       grass does not grow that fast, and forty beasts each reading a
       nine-square of it every frame is a great deal of arithmetic for an
       answer that cannot have changed. */
    a.gt=(a.gt||0)-dt;
    if(a.gt<=0){ a.gt=0.25;
      const gp=grassProbe(a.x,a.z);
      a.bare=!gp;                          /* ground that bears no grass at all */
      a.feed=gp?GRASS.feedAt(a.x,a.z,gp.kind,gp.wild):0;
      a.cover=gp?GRASS.coverAt(a.x,a.z,gp.kind,gp.wild):0;
      a.hidden=(a.cover>=GRASS.HIDE_H); }

    /* ---- DUSK SENDS EVERY CREATURE TO ITS OWN BED ----
       When its sleeping hour came, everything on the earth stopped dead in
       its tracks and lay down exactly there, mid-stride, mid-field — the
       world froze like a stopped clock. A beast now WALKS HOME first: to
       the den of its own kind if one stands in reach, to its tree, its
       burrow-ground, its remembered spot — and beds down THERE. The herd
       beasts of the open plain bed where the herd stands, which is what a
       herd is for. */
    if(asleep){
      if(a.job!=='bed'&&a.job!=='home'){
        a.den=findDen(a); a.job=a.den?'home':'bed'; a.act=null; a.prey=null; a.crouch=false; }
      if(a.job==='home'){ const dh=Math.hypot(a.den.x-a.x,a.den.z-a.z);
        if(dh<3.5) a.job='bed';
        else { a.tx=a.den.x; a.tz=a.den.z; spd=walkSpd*1.4; } }
      if(a.job==='bed') spd=0;
    }
    else{
    if(a.job==='bed'||a.job==='home'){ a.job='roam'; a.jt=0.3+Math.random(); }

    if(role==='pack'||role==='stalk'){
      /* ---- THE HUNT ---- */
      if(a.job==='feed'){ spd=0; if(a.jt<=0){ a.job='roam'; a.jt=4+Math.random()*5; } }
      else if(a.cool<=0){
        const see=window.BEHAVIOR?BEHAVIOR.seeOf(a.kind,80):80;
        if(!a.prey||!a.prey.set||a.prey.dead>0||Math.hypot(a.prey.x-a.x,a.prey.z-a.z)>see*1.4){
          a.prey=null; let bd=1e9;
          for(const b of LANDLIFE){ if(b===a||!b.set||b.dead>0||!AMBIENT_PREY.has(b.kind)) continue;
            const d2=Math.hypot(b.x-a.x,b.z-a.z); if(d2<see&&d2<bd){ bd=d2; a.prey=b; } }
          /* a fresh quarry, a fresh wind for the charge */
          if(a.prey) a.burst=window.BEHAVIOR?BEHAVIOR.burstOf(a.kind,7):7;
          /* a wolf does not hunt alone — the pack takes the same quarry */
          if(a.prey&&role==='pack') for(const b of LANDLIFE)
            if(b!==a&&b.set&&b.role==='pack'&&Math.hypot(b.x-a.x,b.z-a.z)<95){ b.prey=a.prey; b.job='roam'; b.burst=a.burst; }
        }
        /* ---- AND IF THERE IS NOTHING TO HUNT, HE LIES UP IN THE GRASS ----
           A lion on open ground with no quarry walked about in plain sight
           all day. He goes to the deep grass instead and lies down in it —
           which is where a lion actually is when you cannot see one, and it
           puts him in the cover he will need when a herd does come by. */
        if(!a.prey&&role==='stalk'){
          if(a.hidden){ a.crouch=true; if(a.jt<=0){ a.jt=6+Math.random()*8; a.tx=a.x; a.tz=a.z; } spd=0; }
          else if(a.job==='act'){ spd=0; if(a.jt<=0){ a.job='roam'; a.act=null; a.jt=3+Math.random()*4; } }
          else if(a.jt<=0){ a.crouch=false;
            /* ---- THE DAY'S SMALL BUSINESS BETWEEN HUNTS ----
               A cat with no quarry only ever walked from one patch of cover to
               the next. It now takes up its own habits — the wash, the watch,
               the claws stropped down the bole of a tree — drawn by weight from
               its line in behavior.js, exactly as a grazer draws its dust-bath. */
            if(!tryAct(a)){ const cv=GRASS.findCover(a.x,a.z,150,grassProbe);
              if(cv){ a.tx=cv.x; a.tz=cv.z; a.jt=3+Math.random()*3; spd=6; } } }
        }
        if(a.prey){ if(a.job==='act'){ a.job='roam'; a.act=null; }   /* quarry sighted — the small business is dropped */
          const d2=Math.hypot(a.prey.x-a.x,a.prey.z-a.z);
          /* the lion creeps in low and long, then breaks into the charge —
             and he creeps THROUGH SOMETHING: while the grass is over him he
             comes on slowly and is not seen, and he keeps coming low until
             the cover runs out under him. Where there is none he must make
             the rush from further off, and the herd has the sight of him. */
          a.crouch=(role==='stalk'&&(d2>26||(a.hidden&&d2>7)));
          a.tx=a.prey.x; a.tz=a.prey.z;
          /* the pounce: the last few strides come faster than anything */
          spd=a.crouch?(a.hidden?4.6:3.4):(d2<12?runSpd*1.18:runSpd); a.jt=Math.max(a.jt,0.4);
          /* ---- THE CHARGE BURNS THE WIND ----
             The chase used to be run at a stroll — hunter 13, quarry 12 —
             so it went on for ever and nothing was ever caught: the whole
             predation of the earth was two animals walking briskly. The
             hunter is truly FASTER now over the burst that is all he has;
             the crouch refills it, the charge drains it, and when it is
             spent he pulls up and lets the herd go, as the real one does. */
          if(a.crouch) a.burst=window.BEHAVIOR?BEHAVIOR.burstOf(a.kind,7):7;
          else{ a.burst-=dt;
            if(a.burst<=0){ a.cool=9+Math.random()*7; a.prey=null; a.job='roam'; a.jt=2; } }
          if(a.prey&&d2<3.4){
            /* the kill lands: the quarry goes down where it stands */
            const vic=a.prey; vic.dead=9+Math.random()*6; vic.fear=0;
            a.cool=20; a.job='feed'; a.jt=7+Math.random()*4; a.crouch=false;
            a.tx=vic.x; a.tz=vic.z;
            /* and the pack comes in to the kill and feeds together */
            if(role==='pack') for(const b of LANDLIFE)
              if(b!==a&&b.set&&b.role==='pack'&&Math.hypot(b.x-a.x,b.z-a.z)<75){
                b.tx=vic.x; b.tz=vic.z; b.job='feed'; b.jt=6+Math.random()*4; b.prey=null; }
            a.prey=null; } }
      }
    }
    else if(role==='ambush'){
      /* ---- THE CROCODILE ---- it does not wander at all. It lies in the
         shallows sunk to the eyes, and takes whatever comes within reach. */
      spd=0; a.sink=Math.min(1,(a.sink||0)+dt*0.5);
      let tx=null,tz=null,td=1e9,vic=null;
      if(state.mode==='walk'){ const d2=Math.hypot(state.walk.x-a.x,state.walk.z-a.z);
        if(d2<24){ tx=state.walk.x; tz=state.walk.z; td=d2; } }
      for(const b of LANDLIFE){ if(!b.set||b.dead>0||!AMBIENT_PREY.has(b.kind)) continue;
        const d2=Math.hypot(b.x-a.x,b.z-a.z); if(d2<22&&d2<td){ td=d2; tx=b.x; tz=b.z; vic=b; } }
      if(tx!==null&&a.cool<=0){ a.tx=tx; a.tz=tz; spd=runSpd; a.sink=0; a.jt=Math.max(a.jt,0.5);
        /* the lunge lands: what it takes at the water's edge is taken */
        if(td<3.6){ a.cool=22;
          if(vic){ vic.dead=10+Math.random()*5; vic.fear=0; a.job='feed'; a.jt=8+Math.random()*4; } } }
      /* ---- AND WHEN NOTHING COMES, IT LIES AND GAPES ----
         The ambusher used only ever to wait. Between one meal and the next it
         now takes up a piece of its own small business — the crocodile and the
         monitor throw their jaws wide in the open-mouthed gape that is half
         threat and half cooling — drawn by weight from its line in behavior.js. */
      else if(a.jt<=0){
        if(a.job==='act'){ a.job='roam'; a.act=null; a.jt=5+Math.random()*6; }
        else if(!tryAct(a)){ a.jt=6+Math.random()*8; a.tx=a.x; a.tz=a.z; a.job='roam'; }
      }
    }
    else if(role==='forage'){
      /* ---- THE BEAR ---- it digs the ground for roots, and where it stands
         by running water it goes down and fishes the shallows.
         And it SLEEPS. A forager worked its way round the clock before. */
      spd=walkSpd;
      if(a.job==='fish'||a.job==='dig'||a.job==='act'){ spd=0;
        if(a.jt<=0){ a.job='roam'; a.act=null; a.jt=5+Math.random()*6; } }
      else if(a.jt<=0){
        if(a.river&&Math.random()<0.45){ a.job='fish'; a.jt=5+Math.random()*5; }
        else if(!tryAct(a)) { a.job='dig'; a.jt=3+Math.random()*4; }
      }
    }
    else if(role==='bask'){
      spd=walkSpd; if(a.jt<=0){ a.job=a.job==='bask'?'roam':'bask'; a.jt=a.job==='bask'?(4+Math.random()*6):(1+Math.random()*2); }
      if(a.job==='bask') spd=0;
    }
    else {
      /* ---- THE GRAZERS ---- heads down in the grass, drawn together into a
         herd, fleeing what hunts them, and bedded down at night.

         AND THEY GRAZE GRASS NOW. A grazer put its head down wherever it
         happened to be standing — a sand flat, bare dirt, the swept floor of
         a village, the scree of a mountain — because nothing in the world but
         the chunk mesher knew where a blade of grass stood. It asks the grass
         file what is under its muzzle: if there is a bite there it feeds, and
         if there is not it WALKS TO WHERE THERE IS and feeds when it arrives.
         So a herd eats a patch down and moves off it, and the ground they
         gather on is the green ground you can see them standing in. */
      a.fear=(a.fear||0)-dt;
      let fx=null,fz=null;
      if(state.mode==='walk'&&Math.hypot(state.walk.x-a.x,state.walk.z-a.z)<9){ fx=state.walk.x; fz=state.walk.z; }
      else for(const b of LANDLIFE){ if(!b.set||b.dead>0||(b.role!=='pack'&&b.role!=='stalk'&&b.role!=='ambush')) continue;
        /* a hunter lying up in the deep grass is NOT SEEN. It is caught at
           arm's length or not at all, and that is the whole use of cover. */
        const see=b.hidden?6:18;
        if(Math.hypot(b.x-a.x,b.z-a.z)<see){ fx=b.x; fz=b.z; break; } }
      if(fx!==null&&a.fear<=0) a.panicT=0;   /* caught flat — a beat to reach full stride */
      if(fx!==null){ const dd2=Math.hypot(a.x-fx,a.z-fz)||1;
        a.tx=a.x+(a.x-fx)/dd2*34; a.tz=a.z+(a.z-fz)/dd2*34; a.fear=Math.max(a.fear,0.7); a.job='flee'; a.jt=0.7; }
      /* ---- THE STARTLE ----
         Full flight is not reached in a stride: the beast that let the
         hunter inside its own ground pays for the surprise with the first
         second of the chase, which is exactly the second the whole hunt
         was ever about. */
      if(a.fear>0){ a.panicT=(a.panicT||0)+dt;
        spd=runSpd*(0.55+0.45*Math.min(1,a.panicT/1.2));
        a.act=null; if(a.job==='act') a.job='flee'; }
      else if(a.jt<=0){
        if(a.job==='act'){ a.job='roam'; a.act=null; a.jt=2.5+Math.random()*3; }
        else if(a.job==='feedhead'){
          /* the meal done, a moment for the day's small business — the
             roll in the dust, the watch, the walk down to the water */
          if(!tryAct(a)){ a.job='roam'; a.jt=2.5+Math.random()*3; } }
        /* ON GROUND THAT BEARS NO GRASS AT ALL — the snow of the far north,
           bare rock, the sand — there is nothing to walk to and nothing to
           look for. The reindeer paws the drift for the moss under it and the
           goat works the scree, as they did before, and as they must. */
        else if(a.bare){ a.job='feedhead'; a.jt=3+Math.random()*4; }
        else if(a.feed>=GRASS.FEED_MIN){ a.job='feedhead'; a.jt=3+Math.random()*4; }
        else {
          /* nothing to eat here — go and find some */
          const gz=GRASS.findGraze(a.x,a.z,190,grassProbe);
          if(gz){ a.tx=gz.x; a.tz=gz.z; a.job='seek'; a.jt=4+Math.random()*3; spd=walkSpd*1.4; }
          else { a.job='roam'; a.jt=2.5+Math.random()*3; }
        }
      }
      /* and it puts its head down the moment it is standing in a bite */
      if(a.job==='seek'&&a.feed>=GRASS.FEED_MIN){ a.job='feedhead'; a.jt=3+Math.random()*4; }
      if(a.job==='feedhead'||a.job==='act') spd=0; else if(a.job==='seek') spd=walkSpd*1.4;
    }
    }   /* end of the waking day's work */

    /* a new place to make for, when the last is reached or the work is done */
    if(a.jt<=0&&(a.job==='roam'||a.job==='flee')){
      a.jt=1.8+Math.random()*3; a.job='roam';
      const aa=Math.random()*6.28, rr=Math.random()*14*B;
      let nx=a.hx+Math.cos(aa)*rr, nz=a.hz+Math.sin(aa)*rr;
      /* the herd holds together — a beast makes for its own kind */
      if(AMBIENT_PREY.has(a.kind)){ let hx=0,hz=0,hn=0;
        for(const b of LANDLIFE) if(b!==a&&b.set&&b.kind===a.kind&&Math.hypot(b.x-a.x,b.z-a.z)<80){ hx+=b.x; hz+=b.z; hn++; }
        if(hn){ nx=nx*0.55+(hx/hn)*0.45; nz=nz*0.55+(hz/hn)*0.45; } }
      a.tx=nx; a.tz=nz;
    }

    const dx=a.tx-a.x, dz=a.tz-a.z, dd=Math.hypot(dx,dz)||1, moving=spd>0&&dd>1.5;
    if(moving){ const nx=a.x+dx/dd*spd*dt, nz=a.z+dz/dd*spd*dt, c=landAtWorld(nx,nz);
      /* the step a beast can take is now measured in blocks, not units — on a
         mountain flank the old flat limit stopped everything dead */
      /* ---- AND NO BEAST TAKES A CLIFF THAT DOES NOT TAKE ONE ----
         Every creature on the earth could step the same block and
         two-thirds, so an elephant went up a crag stride for stride with
         a goat and a bear walked to the crown of an alp. The step is the
         beast's OWN now (js/behavior.js): a goat and a chamois take two
         and a half blocks, a wolf a block and a half, an elephant or a
         hippo barely a kerb. A beast turned back by the rock sheers off
         along it, exactly as it does at any other barrier. */
      const stepH=B*(window.BEHAVIOR?BEHAVIOR.climbOf(a.kind):1.0);
      const rise=c?c.h*B-a.m.position.y:0;
      if(c&&rise<stepH&&rise>-stepH*2.2&&beastMayStand(a.kind,c)
        &&!landmarkSolidAt(nx,nz,a.m.position.y+2,a.m.position.y+8)){   /* no beast strides through the masonry either */
        a.x=nx; a.z=nz; a.heading=Math.atan2(dx,dz); a.stuck=0; }
      else {
        /* ---- A BEAST TURNS AWAY FROM WHAT IT CANNOT CROSS ----
           When the way was barred it only reset its work-timer and kept the
           SAME place to walk to — so it stood against the lip of a crag or a
           cliff head and pushed at it, frame after frame, treading on the
           spot until something else moved it. It now takes a new bearing,
           sheering off to one side; and if that side is barred too it swings
           further each time, so it works its way out of any corner it has
           walked itself into. */
        a.stuck=(a.stuck||0)+1;
        const away=Math.atan2(dx,dz)+(a.stuck%2?1:-1)*(0.7+0.45*Math.min(4,a.stuck));
        const reach=26+Math.random()*34;
        a.tx=a.x+Math.sin(away)*reach; a.tz=a.z+Math.cos(away)*reach;
        a.heading=away; a.jt=Math.max(a.jt,0.6);
        /* and if it has been penned a long while, it gives up that ground and
           looks for another spot of its own country altogether */
        if(a.stuck>14){ a.set=false; a.stuck=0; }
      } }
    const c2=landAtWorld(a.x,a.z);
    /* how the body carries itself at its work */
    let lift=0, lean=0, roll=0;
    /* ---- GRAZING IS A LIVING RHYTHM, NOT A FROZEN TIP ----
       A feeding beast held one fixed pitch for the whole meal and read as a
       propped-up toy. A real grazer NIBBLES — the muzzle works at the grass —
       and every little while the head comes up and it stands chewing, reading
       the wind, before it goes down for the next bite. The whole herd doing
       this out of phase is most of what makes a field look alive. */
    if(a.job==='feedhead'||a.job==='dig'){
      const up=Math.sin(t*0.45+a.ph);                         /* the slow bite-then-look cycle */
      if(up>0.72) lean=-0.06;                                 /* head up, chewing, watching */
      else lean=0.26+Math.sin(t*3.1+a.ph)*0.05;               /* down, and the muzzle working */
    }
    else if(a.job==='fish'){ lean=0.34+Math.sin(t*2.2+a.ph)*0.05; lift=-0.6; }  /* down at the water's edge */
    else if(a.job==='feed') lean=0.30+Math.sin(t*2.6+a.ph)*0.06;  /* tearing at the kill */
    else if(a.job==='bed'){ lift=-1.6; }                      /* bedded down for the night */
    else if(a.job==='act'){
      /* ---- THE SMALL BUSINESS OF THE DAY, PERFORMED ----
         each habit of the behavior file is a real attitude of the body —
         and every attitude MOVES: a held pose with nothing stirring in it
         reads as a glitch, not a habit */
      switch(a.act){
        case 'browse': lean=-0.30+Math.sin(t*1.7+a.ph)*0.05; break;  /* head working in the leaves */
        case 'drink':  lean=0.34+Math.sin(t*2.4+a.ph)*0.04; break;   /* the muzzle lapping */
        case 'wallow': case 'dust':                           /* down and rolling */
          lift=-1.4; roll=Math.sin(t*2.1+a.ph)*0.62; break;
        case 'groom':  lean=0.12+Math.sin(t*2.8+a.ph)*0.05;   /* the head works along the flank */
          roll=0.14+Math.sin(t*1.3+a.ph)*0.06; break;
        case 'alert':  lean=-0.14; roll=Math.sin(t*0.7+a.ph)*0.02; break;  /* head high, ears turning */
        case 'rear':   lean=-0.85+Math.sin(t*1.9+a.ph)*0.06; lift=0.6; break;
        case 'dig':    lean=0.26+Math.sin(t*4.2+a.ph)*0.08; break;   /* the forepaws truly working */
        case 'bask':   lift=-1.3; lean=Math.sin(t*1.1+a.ph)*0.04; break;  /* flat out, the breath moving in it */
        case 'play':   roll=Math.sin(t*5+a.ph)*0.3; lift=Math.abs(Math.sin(t*5+a.ph))*0.8; break;
        case 'gape':   lean=-0.16; break;                     /* head up, and the jaws thrown wide (the jaw is worked below) */
        case 'sharpen':lean=-0.55; lift=0.5+Math.sin(t*3.4+a.ph)*0.1; break;  /* the paws raking down the bole */
        case 'curl':   lift=-0.5; break;                      /* drawn down into a ball (the head is tucked below) */
        case 'earflap':break;                                 /* the body stands still; the ears do the work (below) */
      }
    }
    else if(a.crouch) lift=-0.8;                              /* the lion low in the grass */
    if(role==='ambush') lift=-1.5*(a.sink||0);                /* sunk to the eyes */
    /* THE GOING OF IT — walk, pace, trot, canter, gallop or bound, chosen
       by how fast it is travelling in its own body lengths. The rise and
       fall of the withers comes off the same law, so a bounding hare truly
       leaves the ground and a walking elephant truly does not. */
    const GT=tickGait(a,a.kind,moving?spd:0,dt);
    a.m.position.set(a.x,(c2?c2.h*B:WATER_Y)+lift+(GT?Math.max(0,GT.rise):0),a.z);
    a.m.rotation.y=a.heading; a.m.rotation.x=lean; a.m.rotation.z=roll;
    /* ---- THE BREATH IN THE BODY ----
       Nothing standing still was truly still: no flank moved, no tail
       swished, and a beast at rest read as parked. Every one of them now
       BREATHES — a slow swell of the body, deeper in sleep — and a beast
       under way carries a faint roll of the shoulders with its stride. */
    a.m.scale.y=1+(asleep?0.02:0.012)*Math.sin(t*(asleep?1.1:2.1)+a.ph);
    if(moving) a.m.rotation.z=roll+(GT?GT.roll:Math.sin(t*(spd>8?10:7)+a.ph)*0.03);
    /* a beast with any number of legs but four keeps the walk it had */
    if(!GT&&a.m.userData.legs) for(const L of a.m.userData.legs){
      L.rotation.x=moving?Math.sin(t*(spd>8?10:7)+(L.userData.ph||0))*0.5:0;
      jointTick(L,moving); }
    /* and the tail is never dead: the idle swish, the faster swing on the
       move, the flick that keeps the flies off */
    { const tl=a.m.userData.tail;
      if(tl) tl.rotation.y=Math.sin(t*(moving?5.5:1.5)+a.ph)*(moving?0.3:0.15)
        +(Math.sin(t*0.23+a.ph)>0.94?Math.sin(t*16+a.ph)*0.3:0); }
    /* the crocodile's jaw and the bear's head keep their own motion */
    /* ---- THE YOUNG AT HER FOOT ----
       It keeps station off her flank, falls behind on a turn and hurries to
       catch up, tucks in tight when she is frightened, and works its way in
       under her and suckles when she stands still. */
    if(a.kids&&window.BABY) for(const y of a.kids){
      const r=BABY.tickYoung(y,a,dt,t);
      const yc=landAtWorld(y.x,y.z);
      y.m.visible=true;
      y.m.position.set(y.x,(yc?yc.h*B:WATER_Y)+(r.sucking?-0.5:0),y.z);
      y.m.rotation.y=y.heading;
      y.m.rotation.x=r.sucking?0.34:0;         /* head in under her flank */
      const legs=y.m.userData.legs;
      if(legs) for(const L of legs){
        L.rotation.x=r.moving?Math.sin(t*(r.sp>9?13:9)+(L.userData.ph||0))*0.55:0;
        jointTick(L,r.moving); } }
    const ud=a.m.userData;
    const acting=a.job==='act';
    /* the jaw: thrown wide in a yawn or a threat-gape, else snapped shut but for the strike */
    if(ud.jaw) ud.jaw.rotation.x=(acting&&a.act==='gape')?-0.85:((a.cool>16.4)?-0.6:0);
    if(ud.head&&acting&&a.act==='curl') ud.head.rotation.x=1.15;   /* the nose tucked away under the ball */
    else if(ud.head&&(a.job==='dig'||a.act==='dig')) ud.head.rotation.x=0.4+Math.sin(t*3)*0.18;
    else if(ud.head&&a.act==='groom') ud.head.rotation.y=Math.sin(t*1.6+a.ph)*0.8;
    else if(ud.head){ ud.head.rotation.x=0; ud.head.rotation.y=0; }
    /* the great ears of the elephant, fanned against the heat */
    if(ud.ears){ const f=(acting&&a.act==='earflap')?Math.sin(t*2.6+a.ph)*0.5:0;
      ud.ears[0].rotation.y=-f; ud.ears[1].rotation.y=f; }
  } }
function hideLandLife(){ for(const a of LANDLIFE){ if(a.m) a.m.visible=false; hideYoung(a); }
  for(const r of RIVERLIFE) if(r.m) r.m.visible=false; }
/* ================= THE FISH OF THE RIVERS =================
   The great rivers were open water and nothing else — a road inland with
   nothing living in it, while the sea beside them carried shoals, whales and
   sharks. They keep their own now, and each nation of them to its own water:
   the trout and the salmon in the cold rapids of the north and the south, the
   sturgeon in the great slow rivers of the temperate belt, the catfish on the
   warm muddy bottom, and in the Amazon and the Ganges alone the piranha and
   the pink river dolphin, which never in their lives see the sea.
   Add a creature file, add a line here, and that fish is in the rivers. */
const RIVER_KINDS=[
  {name:'trout',      n:5, lat:[34,72],   spd:9,  y:2.2},
  {name:'trout',      n:3, lat:[-58,-32], spd:9,  y:2.2},
  {name:'salmon',     n:4, lat:[40,70],   spd:11, y:3.0},
  {name:'arcticchar', n:4, lat:[58,84],   spd:8,  y:2.6},
  {name:'sturgeon',   n:2, lat:[30,64],   spd:6,  y:5.0},
  {name:'catfish',    n:4, lat:[-34,46],  spd:5,  y:5.5},
  /* and these two by their own waters, and no others on the earth */
  {name:'piranha',    n:7, lat:[-22,10],  lon:[-78,-42], spd:10, y:2.6},
  {name:'riverdolphin',n:1,lat:[-14,8],   lon:[-76,-48], spd:12, y:4.0},
  {name:'riverdolphin',n:1,lat:[19,29],   lon:[73,93],   spd:12, y:4.0},
];
const RIVERLIFE=[], RL_R=420;
let riverLifeInit=false;
function initRiverLife(){ if(riverLifeInit) return; riverLifeInit=true;
  for(const K of RIVER_KINDS) for(let k=0;k<K.n;k++){
    const m=makeBeast(K.name); m.visible=false; scene.add(m);
    RIVERLIFE.push({m,K,x:0,z:0,y:0,dir:Math.random()*6.28,ph:Math.random()*6.28,set:false}); } }
/* is this point running fresh water — a charted watercourse, in a land, and
   open (the cell is cut away for the river to run through it)? */
function riverWaterAt(x,z){
  const u=x/R_WORLD, v=z/R_WORLD;
  return !!riverAtUV(u,v) && !!countryAtUV(u,v) && !landAtWorld(x,z);
}
function updateRiverLife(px,pz,dt,t){ initRiverLife();
  const lat=90-Math.hypot(px/R_WORLD,pz/R_WORLD)*180;
  const lon=Math.atan2(px/R_WORLD,pz/R_WORLD)*180/Math.PI;
  for(const f of RIVERLIFE){ const K=f.K;
    const fits=lat>=K.lat[0]&&lat<=K.lat[1]&&(!K.lon||(lon>=K.lon[0]&&lon<=K.lon[1]));
    if(!fits){ if(f.set){ f.set=false; f.m.visible=false; } continue; }
    if(!f.set||Math.hypot(f.x-px,f.z-pz)>RL_R+120){
      f.set=false;
      /* a watercourse is a thread across the whole country — a handful of
         tries out from the traveller finds it if he is anywhere near one,
         and finds nothing at all if he is not, which is the right answer */
      /* never set down at the bank the traveller is standing on — from 170
         out a fish below the water's skin arrives unseen */
      for(let tr=0;tr<14;tr++){ const a=Math.random()*6.28, r=170+Math.random()*(RL_R-170);
        const x=px+Math.cos(a)*r, z=pz+Math.sin(a)*r;
        if(!riverWaterAt(x,z)) continue;
        f.x=x; f.z=z; f.y=WATER_Y-K.y; f.dir=Math.random()*6.28; f.set=true; f.m.visible=true; break; }
      if(!f.set){ f.m.visible=false; continue; }
    }
    /* it runs the thread of the water and turns back at the bank */
    f.dir+=Math.sin(t*0.6+f.ph)*0.06*dt*60;
    const nx=f.x+Math.cos(f.dir)*K.spd*dt, nz=f.z+Math.sin(f.dir)*K.spd*dt;
    if(riverWaterAt(nx,nz)){ f.x=nx; f.z=nz; } else f.dir+=2.1+Math.random()*0.8;
    f.m.position.set(f.x, f.y+Math.sin(t*1.1+f.ph)*0.5, f.z);
    f.m.rotation.y=Math.atan2(Math.cos(f.dir),Math.sin(f.dir));
    if(f.m.userData.tail) f.m.userData.tail.rotation.y=Math.sin(t*6+f.ph)*0.4;
  } }
/* ================= THE FOWL OF THE AIR, AND THEIR WORK =================
   Every bird flew a fixed circle about a fixed point, for ever. They keep a
   day's work now: they hunt or forage, carry what they take home in the
   beak, feed the young in the nest, rest, and go again — and at nightfall
   they roost. The gulls and eagles over water STOOP: they fall on the
   surface, break it, and come up with a fish — and the fish they take is a
   real one out of the shoal, not a mime. */
/* the birds spawn AT AND PAST the fog line (430–1,200; fog runs 500–1,140 —
   a wing at 430 is a few pixels against the haze) and are reaped beyond it,
   so no bird snaps into being in clear sky and none of the near sky is left
   birdless; the pool is widened for the larger round. Butterflies are the
   one exception — a thing two units across is invisible past a couple
   hundred anyway, and it must live among the flowers at the traveller's feet. */
const AIRLIFE=[], AL_N=24, AL_R=1150;
const NESTS=[], NEST_N=10, NEST_R=430;
function initNests(){ if(NESTS.length) return;
  for(let k=0;k<NEST_N;k++) NESTS.push({m:null,kind:null,skey:null,species:null,chicks:[],x:0,y:0,z:0,set:false,cheep:0}); }
/* ---- THE HOME OF A CREATURE, BUILT WHERE THAT CREATURE PUTS IT ----
   It was one ring of sticks, put down at a flat three and a third blocks
   above the ground whether a tree stood there or not — so every nest in the
   world either HUNG IN MID AIR over open field or sat buried in a bole. And
   nothing but the birds had a home at all.
   Now the site is looked at and asked WHOSE it is: what flies here, what
   walks here, and what such a creature actually builds (js/nest.js). A
   tree-nester's is set at the TRUE crown height of the tree standing on that
   very cell — asked of the flora, which is the only thing that knows. */
function homeSiteFor(wx,wz,c,gi,gj){
  const ix=Math.floor(wx/B), iz=Math.floor(wz/B), yG=c.h*B;
  const land=landNameAt(wx,wz);
  const pick=hash2(gi*7.1+3.3,gj*4.9-1.7);
  /* a treed cell belongs to whatever nests in trees; bare ground to whatever
     walks on it */
  if(pick<0.6){
    /* a nest is hung from the nearest bole about the site — the site itself
       almost never carries a tree, and that is why every nest in the world
       used to hang in mid air over open field */
    const w2=treeNear(wx,wz,5);
    /* WHOSE nest is drawn by the SITE'S OWN HASH, never the dice — the old
       code rolled airKind() afresh every frame, so the same tree changed
       owners sixty times a second and the nest in it was torn down and
       rebuilt as fast as it could be looked at */
    const lat=90-Math.hypot(wx,wz)/R_WORLD*180, alat=Math.abs(lat);
    const br=hash2(gi*13.7+(w2?w2.ix:ix)*0.37, gj*7.9+(w2?w2.iz:iz)*0.53);
    if(w2){
      const bird=alat>58?(br<0.55?'owl':'crow')
        :(br<0.42?'crow':br<0.8?'dove':'owl');
      const home=NEST.homeOf(bird);
      if(home) return {y:w2.y, x:w2.x, z:w2.z, kind:bird, home, bird:true};
    }
    /* and where no tree stands, the birds of the open ground: the eagle's
       eyrie on the high bare rock, the puffin's burrow in the cold turf,
       the gull's scrape by the warm sand */
    if((c.kind==='rock'||c.kind==='alpine'||c.h>=26)&&br<0.6)
      return {y:yG, kind:'eagle', home:NEST.homeOf('eagle'), bird:true};
    if(alat>56&&(c.kind==='tundra'||c.kind==='snow')&&br<0.5)
      return {y:yG, kind:'puffin', home:NEST.homeOf('puffin'), bird:true};
    if(c.kind==='sand'&&br<0.5)
      return {y:yG, kind:'gull', home:NEST.homeOf('gull'), bird:true};
  }
  /* else it is somebody's den, burrow, lair or scrape. Whose? — whatever
     beast this country puts on this ground, if that beast builds anything. */
  /* three draws, jittered a little apart: most beasts of a plain build
     nothing at all (they drop their young in the open and it is running
     within the hour), so one draw would leave a whole country with no dens */
  /* ---- THE WINTER-SLEEPERS MUST HAVE THEIR HOMES RAISED ----
     The site asked what beast holds this very tile, three times, and took the
     first that built anything. But the beasts that build most — the fox, the
     boar, the crow — are also the commonest, and the bear is drawn so seldom
     that not one of the three draws ever landed on her: her cave was never
     raised anywhere on the earth, and there was nowhere to find her asleep.
     So the question is asked the other way about. We look at what this LAND
     holds (the same list the tile-draw draws from), take the winter-sleepers
     out of it that will truly stand on this ground, and raise ONE OF THEIR
     HOMES on a fair share of the sites. A bear's country now has bear caves
     in it, whether or not the dice ever name her. */
  { const dice=hash2(wx*0.021+11.3, wz*0.019-4.7);
    if(dice<0.42){
      const L2=faunaFor(wx,wz,c.kind)||FAUNA.wilds[c.kind]||null;
      if(L2&&L2.length){
        const sleepers=[];
        for(const nm of L2){ if(!NEST.hibernatesIn(nm)) continue;
          const H=NEST.homeOf(nm); if(!H||H.where==='tree') continue;
          if(!beastFits(nm,c.kind,c.h,false,false)) continue;
          sleepers.push(nm); }
        if(sleepers.length){
          const nm=sleepers[Math.floor(hash2(wz*0.013,wx*0.017)*sleepers.length)%sleepers.length];
          return {y:yG, x:wx, z:wz, kind:nm, home:NEST.homeOf(nm), bird:false}; } } } }
  /* else, as before: whatever beast this tile holds, if it builds at all */
  { let first=null, hib=null;
    for(let q=0;q<3;q++){
      const jx=wx+(q-1)*37, jz=wz+(q-1)*29, jc=landAtWorld(jx,jz)||c;
      const beast=landKindAt(jx,jz,jc);
      const home=NEST.homeOf(beast);
      if(!home||home.where==='tree') continue;
      const site={y:jc.h*B, x:jx, z:jz, kind:beast, home, bird:false};
      if(!first) first=site;
      if(!hib&&NEST.hibernatesIn(beast)) hib=site; }
    if(hib||first) return hib||first; }
  /* and where nothing builds, the plain leaves its own mark: a termite
     mound, which is the one thing standing on half the grassland of the
     earth and belongs to nobody you will ever see */
  if((c.kind==='savanna'||c.kind==='tropic')&&pick>0.82)
    return {y:yG, kind:'termite', home:{form:'termite',where:'ground',n:0,r:1}, bird:false};
  return null;
}
function buildBeastHome(site){
  const G=newG(); FKIT.G=G;
  NEST.emitHome(FKIT,site.home,0,0,0); FKIT.G=null;
  const g=groupFromG(G);
  /* AND THE YOUNG IN IT — its own kind's, never a generic pair of boxes */
  const chicks=[];
  if(site.bird&&window.CHICKS){
    const n=CHICKS.broodOf(site.kind,site.home.n);
    for(let i=0;i<n;i++){ const ch=CHICKS.makeChick(BEAST_KIT,site.kind);
      const a=i/n*6.283, r=B*0.3*(site.home.r||1);
      ch.userData.nx=Math.cos(a)*r; ch.userData.nz=Math.sin(a)*r;
      ch.position.set(ch.userData.nx,B*0.1,ch.userData.nz);
      g.add(ch); chicks.push({m:ch,ph:Math.random()*6.283,baseY:B*0.1,
        nx:ch.userData.nx,nz:ch.userData.nz,cx:0,cz:0,t:0,face:a}); } }
  return {g,chicks};
}
/* the homes stand where their own places put them — seeded by the grid, so
   the same crag or treetop always bears the same nest */
function updateNests(px,pz,dt){ initNests();
  const CS=430, ci=Math.round(px/CS), cj=Math.round(pz/CS), sites=[];
  for(let di=-2;di<=2;di++) for(let dj=-2;dj<=2;dj++){
    const gi=ci+di, gj=cj+dj;
    if(hash2(gi*2.7,gj*5.1)<0.5) continue;
    const wx=gi*CS+(hash2(gi,gj)-0.5)*300, wz=gj*CS+(hash2(gj,gi)-0.5)*300;
    const c=landAtWorld(wx,wz); if(!c||c.kind==='wall'||!c.ci) continue;
    const site=homeSiteFor(wx,wz,c,gi,gj); if(!site) continue;
    sites.push({key:gi+','+gj,wx,wz,site,d:Math.hypot(wx-px,wz-pz)}); }
  /* ---- AND A WINTER-SLEEPER'S HOME IS WORTH A SLOT ----
     Only ten homes stand in the world at once, and they were given to the ten
     NEAREST sites — which in wooded country are all birds' nests. So the
     bear's cave WAS raised by the site-maker (a good seventh of the sites in
     her country carry one) and then never given a slot to stand in, and the
     traveller walked her whole country without seeing one. A home that is
     slept in through the winter now counts as nearer than it truly is, so a
     few of them always stand. */
  for(const s of sites) s.pri=s.d-(NEST.hibernatesIn(s.site.kind)?900:0);
  sites.sort((a,b)=>a.pri-b.pri);
  const night=(worldNight||0)>0.6, t=performance.now()*0.001;
  /* ---- THE HOMES OF THE WORLD DO NOT SHUFFLE UNDERFOOT ----
     The k-th nearest site used to be handed to the k-th slot, so every step
     the traveller took reshuffled which slot held which home — a nest would
     leap half a mile, and the bird bound to that slot would dart across the
     sky after it. A slot now KEEPS its site (by the site's own grid key)
     for as long as that site is wanted at all. */
  const want=new Map();
  for(let k=0;k<sites.length&&want.size<NEST_N;k++){ const s=sites[k];
    /* the reach is measured on the PRIORITY, not the raw distance — so a
       winter-sleeper's home is admitted from half again as far out, which is
       what actually puts a bear's cave in the world (the sort alone could not:
       the gate threw the far ones away before the sort was ever consulted) */
    if(s.pri<NEST_R+300&&!want.has(s.key)) want.set(s.key,s); }
  for(const N of NESTS){
    if(N.set&&want.has(N.skey)){ const s=want.get(N.skey); s.held=true;
      N.x=(s.site.x!==undefined)?s.site.x:s.wx;
      N.z=(s.site.z!==undefined)?s.site.z:s.wz; N.y=s.site.y;
      N.m.position.set(N.x,N.y,N.z); N.m.visible=true; }
    else if(N.set){ N.set=false; N.skey=null; if(N.m) N.m.visible=false; } }
  for(const s of want.values()){ if(s.held) continue;
    let slot=null; for(const N of NESTS) if(!N.set){ slot=N; break; }
    if(!slot) break;
    const kindKey=s.site.kind+'|'+s.site.home.form;
    if(slot.kind!==kindKey||!slot.m){
      if(slot.m){ scene.remove(slot.m); freeTree(slot.m); }   /* nest, chicks and all */
      const built=buildBeastHome(s.site); slot.m=built.g; slot.chicks=built.chicks;
      slot.kind=kindKey; scene.add(slot.m); }
    slot.skey=s.key; slot.species=s.site.kind; slot.bird=s.site.bird;
    slot.x=(s.site.x!==undefined)?s.site.x:s.wx;
    slot.z=(s.site.z!==undefined)?s.site.z:s.wz;
    slot.y=s.site.y; slot.set=true;
    slot.m.position.set(slot.x,slot.y,slot.z); slot.m.visible=true; }
  for(const N of NESTS){
    if(N.set&&N.chicks.length&&window.CHICKS){
      N.cheep=Math.max(0,N.cheep-dt);
      for(const ch of N.chicks) CHICKS.tickChick(ch,ch.m,N.cheep,night,dt,t); } } }
/* ---- EVERY BIRD ITS OWN NEST ----
   All eighteen fowl of the air used to carry every catch to the ONE nearest
   nest, whos-ever it was — a gull feeding a crow's brood in an oak. A bird
   now claims a nest OF ITS OWN KIND, and no nest is claimed by more than
   the pair that keeps it; a bird with no nest of its kind in reach has no
   nest at all, eats its catch where it takes it, and roosts on a perch of
   its own choosing like the honest vagrant it is. */
function claimNest(b){
  if(b.nest&&b.nest.set&&b.nest.bird&&b.nest.species===b.type) return b.nest;
  b.nest=null;
  /* ---- A BIRD JOINS ITS MATE BEFORE IT OPENS A NEW HOUSE ----
     Every bird took the first empty nest of its kind, so the nests stood one
     bird apiece and the pair — which is what a nest is for — hardly ever
     formed. A bird now looks first for a nest of its kind that already holds
     ONE of its kind, and makes the pair; only if there is none does it take an
     empty nest. So the nests fill two-by-two, as they ought. */
  let pair=null, empty=null;
  for(const N of NESTS){ if(!N.set||!N.bird||N.species!==b.type) continue;
    let claims=0; for(const o of AIRLIFE){ if(o!==b&&o.set&&o.nest===N) claims++; }
    if(claims===1){ pair=N; break; }
    if(claims===0&&!empty) empty=N; }
  b.nest=pair||empty;
  return b.nest; }
function airKind(px,pz,night){ const overSea=!landAtWorld(px,pz);
  /* ---- AND THE COLD HAS ITS OWN FOWL ----
     Out over the ice it was gulls and nothing else, at either end of the
     earth, for ever. The snowy owl hunts the tundra — by DAY, because in an
     arctic summer there is no night to hunt by — and the puffin works the
     cold coasts in thousands. */
  const lat=90-Math.hypot(px,pz)/R_WORLD*180, alat=Math.abs(lat);
  if(alat>58){ const r=Math.random();
    if(overSea) return r<0.45?'gull':r<0.8?'puffin':'owl';
    return r<0.42?'owl':r<0.7?'dove':r<0.88?'gull':'crow'; }
  if(Math.hypot(px,pz)/R_WORLD>0.90) return 'gull';
  /* the night sky belongs to the OWL, which is out working it — the crow
     and the dove that share it are on their way to a roost, not abroad */
  if(night){ const r=Math.random(); return r<0.5?'owl':r<0.8?'crow':'dove'; }
  if(overSea) return Math.random()<0.7?'gull':'eagle';
  const r=Math.random(); return r<0.3?'butterfly':r<0.55?'dove':r<0.8?'crow':'eagle'; }
/* how fast a bird flies, and how far ahead of itself it looks on a circle */
const AL_SPD=30, AL_LEAD=0.85;
function initAirLife(){ if(AIRLIFE.length) return; for(let k=0;k<AL_N;k++)
  AIRLIFE.push({m:null,type:null,x:0,y:0,z:0,tx:0,ty:0,tz:0,ph:Math.random()*6.28,heading:0,set:false}); }
/* a place to look for food: over the water for a fisher, on the ground for
   the rest — and near the ship for the gulls that have taken to her */
function forageSpot(b,px,pz){
  for(let tr=0;tr<8;tr++){
    let x,z;
    if(b.follow&&(state.mode==='boat'||state.mode==='deck')){
      const a=Math.random()*6.28, r=20+Math.random()*70; x=state.boat.x+Math.cos(a)*r; z=state.boat.z+Math.sin(a)*r; }
    else { const a=Math.random()*6.28, r=50+Math.random()*AL_R; x=px+Math.cos(a)*r; z=pz+Math.sin(a)*r; }
    const c=landAtWorld(x,z);
    if(b.fisher){ if(!c) return {x,y:WATER_Y+3,z,water:true}; }
    else if(c&&c.kind!=='wall') return {x,y:c.h*B+1.4,z,water:false};
  }
  /* a gull carried inland finds no water to strike — rather than wheel there
     for ever it forages the ground, as gulls do */
  if(b.fisher){ for(let tr=0;tr<6;tr++){
    const a=Math.random()*6.28, r=50+Math.random()*AL_R;
    const x=px+Math.cos(a)*r, z=pz+Math.sin(a)*r, c=landAtWorld(x,z);
    if(c&&c.kind!=='wall') return {x,y:c.h*B+1.4,z,water:false}; } }
  return null;
}
/* the strike: the surface is broken, and a fish is truly taken out of the
   shoal that swims there (it is re-placed elsewhere, so the sea is not
   emptied — but the one that was caught is gone from where it was) */
function takeFish(x,z){
  let best=null,bd=1e9;
  for(const f of DIVEFISH){ if(!f.set) continue;
    const d=Math.hypot(f.x-x,f.z-z); if(d<20&&d<bd){ bd=d; best=f; } }
  if(best){ best.set=false; if(best.m) best.m.visible=false; return true; }
  return false;
}
function updateAirLife(px,pz,dt,t,night){ initAirLife(); updateNests(px,pz,dt);
  /* the fowl ride the haze as the beasts do — born beyond the fog on the
     ground, and beyond noticing under a flyer's opened air */
  const ffA=scene.fog?scene.fog.far:1140;
  const alMin=Math.min(2100,Math.max(430,ffA*0.65));
  const alMax=Math.min(2500,Math.max(1200,ffA*0.98));
  const alReap=Math.min(2750,Math.max(AL_R+220,ffA*1.1));
  for(const b of AIRLIFE){
    if(!b.set||Math.hypot(b.x-px,b.z-pz)>alReap){
      const type=airKind(px,pz,night);
      if(b.type!==type){ if(b.m){ scene.remove(b.m); freeTree(b.m); }   /* and the old fowl with it */
        b.m=makeBird(type); scene.add(b.m); b.type=type; }
      const a=Math.random()*6.28,
        r=type==='butterfly'?60+Math.random()*240:alMin+Math.random()*(alMax-alMin);
      b.x=px+Math.cos(a)*r; b.z=pz+Math.sin(a)*r;
      /* ---- AND NOTHING FLIES BEYOND THE WALL OF ICE ----
         Out on the crown of the ice the ground stands two thousand feet up,
         but the wall is not 'land' to landAtWorld — so every bird set down
         out here took the SEA as its floor and was born six hundred blocks
         underneath the ice, which is the flock seen dropping through the
         world at the rim. Past the foot of the wall there are no fowl. */
      if(Math.hypot(b.x,b.z)/R_WORLD>SHELF_UV){ b.m.visible=false; b.set=false; continue; }
      const c=landAtWorld(b.x,b.z), base=c?c.h*B:WATER_Y;
      b.y=type==='butterfly'?base+3:base+30+Math.random()*60;
      /* WHICH BIRDS FISH is read from js/behavior.js now, not named by hand:
         the gull and the puffin take their living from the water wherever they
         are; the eagle only where there is water under it, and inland it hunts
         the ground like the rest */
      { const bh0=window.BEHAVIOR&&BEHAVIOR.birdOf(type);
        b.fisher=(bh0?bh0.fish:(type==='gull'))||(type==='eagle'&&!landAtWorld(px,pz)); }
      b.follow=type==='gull'&&Math.random()<0.4;   /* some gulls take to a passing ship */
      /* the mark it was making for MUST be dropped with everything else. A
         bird set down beside the traveller while still holding a forage spot
         from wherever it last was would set off for it across the whole
         earth — and the firmament's fair wind carries the ship thousands of
         units at a stroke, so this is not a corner case. */
      b.job='hunt'; b.jt=0; b.food=null; b.nest=null; b.spot=null; b.perch=null;
      b.tx=b.x; b.ty=b.y; b.tz=b.z;
      b.set=true; b.m.visible=true;
    }
    /* and a mark that has somehow come to lie beyond the bird's whole range
       is no mark at all — it looks for another */
    if(b.spot&&Math.hypot(b.spot.x-px,b.spot.z-pz)>AL_R*1.6) b.spot=null;
    const ud=b.m.userData;
    b.jt-=dt;

    if(b.type==='butterfly'){
      /* it goes from flower to flower, and never further — and at night it
         SITS, folded on a stem, as every butterfly on the earth does */
      if(night){ if(b.job!=='sit'){ b.job='sit';
          const c=landAtWorld(b.x,b.z); b.tx=b.x; b.tz=b.z; b.ty=(c?c.h*B:WATER_Y)+1.2; } }
      else if(b.jt<=0||b.job==='sit'){ b.job='fly';
        const a=Math.random()*6.28, r=3+Math.random()*14;
        b.tx=b.x+Math.cos(a)*r; b.tz=b.z+Math.sin(a)*r;
        const c=landAtWorld(b.tx,b.tz); b.ty=(c?c.h*B:WATER_Y)+2+Math.random()*4;
        b.jt=1.2+Math.random()*2; }
    } else {
      claimNest(b);
      /* ---- ITS REAL HOURS, from js/behavior.js ----
         the owl WORKS the night and sleeps the day off in a tree; everything
         else works the day and roosts at dusk */
      const BH=window.BEHAVIOR&&BEHAVIOR.birdOf(b.type);
      const wantRoost=(BH&&BH.night==='hunt')?!night:night;
      if(wantRoost&&b.job!=='roost'){ b.job='roost'; b.perch=null; }
      else if(!wantRoost&&b.job==='roost'){ b.job='hunt'; b.spot=null; }
      switch(b.job){
        case 'hunt': {
          if(!b.spot){ b.spot=forageSpot(b,px,pz);
            if(!b.spot){ b.job='rest'; b.jt=3; break; }
            b.tx=b.spot.x; b.tz=b.spot.z; b.ty=b.spot.y+(b.spot.water?46:26); }
          /* over the mark, it drops on it — the stoop */
          if(Math.hypot(b.x-b.tx,b.z-b.tz)<26){ b.ty=b.spot.y; }
          if(Math.hypot(b.x-b.tx,b.z-b.tz)<8&&Math.abs(b.y-b.spot.y)<6){
            if(b.spot.water){ splash(b.x,WATER_Y+1,b.z,false);
              /* it always comes up with something — the sea holds more fish
                 than the handful we draw — but if one of the DRAWN shoal was
                 under the strike, that one is truly taken and swims there no
                 longer, so the catch is not a mime */
              takeFish(b.x,b.z); b.food='fish'; b.job='carry'; }
            else { b.job='peck'; b.jt=1.6+Math.random()*1.8; }
            b.spot=null; }
          break; }
        case 'peck': {
          if(b.jt<=0){ b.food='seed'; b.job='carry'; }
          break; }
        case 'carry': {
          /* no nest of its own kind — it eats its catch where it stands,
             down on the ground like an honest bird, not hovering in the
             air over somebody else's brood */
          if(!b.nest){ b.job='eat'; b.jt=2+Math.random()*2;
            const c=landAtWorld(b.x,b.z); b.tx=b.x; b.tz=b.z;
            b.ty=(c?c.h*B:WATER_Y+2)+0.8; break; }
          b.tx=b.nest.x; b.tz=b.nest.z; b.ty=b.nest.y+3;
          if(Math.hypot(b.x-b.tx,b.z-b.tz)<7&&Math.abs(b.y-b.ty)<6){
            b.job='feed'; b.jt=2.2+Math.random(); b.nest.cheep=2.6; }
          break; }
        case 'feed': {
          if(b.jt<=0){ b.food=null; b.job='rest'; b.jt=2.5+Math.random()*4; }
          break; }
        case 'eat': {
          if(b.jt<=0){ b.food=null; b.job='rest'; b.jt=2+Math.random()*3; }
          break; }
        case 'roost': {
          /* its own nest if it keeps one; else a perch of its kind — a
             bough for the crow, the open ground for the gull — and it
             SITS there, wings in, until its hour comes round again */
          if(b.nest){ b.tx=b.nest.x; b.tz=b.nest.z; b.ty=b.nest.y+1.1; }
          else{ if(!b.perch){
              const w2=(!BH||BH.perch!=='ground')?treeNear(b.x,b.z,6):null;
              if(w2) b.perch={x:w2.x,y:w2.y+1.0,z:w2.z};
              else{ const c=landAtWorld(b.x,b.z);
                if(c) b.perch={x:b.x,y:c.h*B+0.6,z:b.z};
                /* ---- NO DEAD BIRDS ON THE NIGHT SEA ----
                   A bird benighted over open water used to be set down ON the
                   waves, stone-still, wings folded — a floating corpse to any
                   eye. The sea-fowl truly do sleep afloat, so the gull and the
                   puffin RAFT now: they ride the swell itself, bobbing and
                   rocking, plainly alive. A land bird does not raft at all — it
                   makes for the nearest shore to roost, and if no shore is in
                   reach it simply keeps the air, circling slow till morning. */
                else if(BH&&BH.fish) b.perch={x:b.x,y:WATER_Y+0.9,z:b.z,water:true};
                else{ let fx2=null,fz2=null,fy2=0;
                  for(const rr of [140,280,430]){ for(let q=0;q<10;q++){ const a2=q/10*6.283;
                      const x2=b.x+Math.cos(a2)*rr, z2=b.z+Math.sin(a2)*rr, c2=landAtWorld(x2,z2);
                      if(c2&&c2.kind!=='wall'){ fx2=x2; fz2=z2; fy2=c2.h*B+0.6; break; } }
                    if(fx2!==null) break; }
                  if(fx2!==null) b.perch={x:fx2,y:fy2,z:fz2};
                  else b.perch={x:b.x,y:0,z:b.z,air:true}; } } }
            if(b.perch.air){ /* nowhere to set down — it stays on the wing */
              b.ph+=dt*(AL_SPD/30);          /* the point goes round at the bird's own pace */
              b.tx=b.perch.x+Math.cos(b.ph+AL_LEAD)*30;
              b.tz=b.perch.z+Math.sin(b.ph+AL_LEAD)*30;
              b.ty=WATER_Y+42; }
            else{ b.tx=b.perch.x; b.tz=b.perch.z;
              /* a rafting bird's seat is the swell itself, wherever it stands */
              b.ty=b.perch.water?WATER_Y+seaHeight(b.perch.x,b.perch.z)+0.9:b.perch.y; } }
          break; }
        default: {   /* rest — it circles and gathers itself; a flocking bird
                        circles with its own kind, not alone */
          const n=b.nest;
          let cx=n?n.x:b.x, cz=n?n.z:b.z; const cy=(n?n.y:b.y)+34;
          if(BH&&BH.flock){ let mx=0,mz=0,mn=0;
            for(const o of AIRLIFE){ if(o!==b&&o.set&&o.type===b.type&&Math.hypot(o.x-b.x,o.z-b.z)<120){ mx+=o.x; mz+=o.z; mn++; } }
            if(mn){ cx=cx*0.4+(mx/mn)*0.6; cz=cz*0.4+(mz/mn)*0.6; } }
          /* ---- AND IT FLIES ROUND ITS CIRCLE FORWARDS ----
             The mark went round at 26 × 0.7 = 18 units a second while the
             bird flies at 30, so it overhauled its own target on every lap,
             found it beside and then behind itself, and turned to face it —
             which is the crow over the market flying backwards. The mark now
             travels at exactly the bird's own speed, and is set a little
             AHEAD on the circle, so there is always something in front to
             fly at and the tangent is the way it points. */
          b.ph+=dt*(AL_SPD/26);
          b.tx=cx+Math.cos(b.ph+AL_LEAD)*26; b.tz=cz+Math.sin(b.ph+AL_LEAD)*26; b.ty=cy;
          if(b.jt<=0){ b.job='hunt'; b.spot=null; }
        }
      }
    }

    /* --- the flight itself --- */
    const dx=b.tx-b.x, dz=b.tz-b.z, dy=b.ty-b.y, dd=Math.hypot(dx,dz)||1;
    const spd=b.type==='butterfly'?7:(b.job==='hunt'&&b.spot&&b.ty<=b.spot.y+2)?58:AL_SPD;
    const step=Math.min(dd,spd*dt);
    b.x+=dx/dd*step; b.z+=dz/dd*step;
    b.y+=Math.max(-52*dt,Math.min(52*dt,dy));
    const want=Math.atan2(dx,dz);
    let turn=want-b.heading; while(turn>Math.PI)turn-=6.2832; while(turn<-Math.PI)turn+=6.2832;
    b.heading+=turn*Math.min(1,dt*3.4);
    /* ---- SAT MEANS SAT ----
       A bird at rest used to hang two units off its perch, bobbing on the
       air and slowly milling its wings — the famous mid-air glitch. When it
       is on a sitting job and has all but arrived, it is SNAPPED DOWN onto
       the spot, dead still, wings folded, level — and stays there. */
    const sitting=((b.job==='roost'&&!(b.perch&&b.perch.air))||b.job==='feed'||b.job==='peck'||b.job==='eat'
      ||(b.type==='butterfly'&&b.job==='sit'));
    const rafting=sitting&&b.job==='roost'&&b.perch&&b.perch.water;
    if(sitting&&dd<1.6&&Math.abs(b.ty-b.y)<2){ b.x=b.tx; b.z=b.tz; b.y=b.ty; }
    const bob=sitting?0:Math.sin(t*2+b.ph)*(b.type==='butterfly'?1.4:2.0);
    b.m.position.set(b.x,b.y+bob,b.z);
    b.m.rotation.y=b.heading;
    /* it banks into the turn — but never rolls clean over on a hard retarget.
       A bird rafting on the sea is rocked by the swell it rides — the plainest
       sign of life a sleeping gull can give. */
    b.m.rotation.z=rafting?Math.sin(t*1.2+b.ph)*0.08
      :sitting?0:-Math.max(-0.55,Math.min(0.55,turn))*0.6;
    /* ---- THE PECK IS SEEN ----
       A bird on the ground used to stand bolt still for a second and fly
       off, having visibly taken nothing. It TIPS now: the whole bird rocks
       forward and strikes at the ground, again and again, and rises with
       the seed showing in its beak — a meal anybody can watch happen. */
    b.m.rotation.x=(b.job==='peck'||b.job==='eat')?Math.max(0,Math.sin(t*5.5+b.ph))*0.55
      :(b.job==='feed'?Math.max(0,Math.sin(t*4+b.ph))*0.3:0);
    /* the wings still while it sits, and beat hard on the stoop */
    const fl=sitting?0.06:(b.type==='butterfly'?Math.sin(t*16+b.ph)*0.9:Math.sin(t*10+b.ph)*0.6);
    if(ud.wingL){ ud.wingL.rotation.z=fl; ud.wingR.rotation.z=-fl; }
    if(ud.carry){ ud.carry.visible=!!b.food;
      if(b.food) ud.carry.material.color.setHex(b.food==='fish'?0x9fb6c8:0xc8b46a); }
  } }
function hideAirLife(){ for(const b of AIRLIFE) if(b.m) b.m.visible=false;
  for(const N of NESTS) if(N.m) N.m.visible=false; }

/* ================= VILLAGES (minecraft-fashion) =================
   Cobblestone bases, oak plank walls with log corner posts, glass
   panes, doors, stepped plank roofs with an overhang; dirt paths,
   fenced farms with crops and a water channel, hay bales, a well,
   and lamp posts that burn when the sun departs.                  */
/* furnish a room: a big bed, a table with chairs, bookshelves along a wall,
   a chest, a woven rug, and corner lamps — scaled to the room, off the door */
function emitFurniture(G, ex, x0,x1,z0,z1, fy, T, hx,hz, doorDir){
  /* ---- THE ROOM IS A ROOM, NOT A STOREHOUSE ----
     The table used to stand in the middle of the floor with its chairs
     beside it, square across the way in — a room a man could hardly cross.
     Everything stands against the walls now: the bed in the far corner from
     the door, the table and its chairs against a side wall, the shelves
     along the far wall, the chest by the door — and the way in, door to
     hearth, stays a clear aisle two blocks wide. What will not fit in a
     small room is left out of it rather than crammed in. */
  const ix0=x0+T, ix1=x1-T, iz0=z0+T, iz1=z1-T;
  const rw=ix1-ix0, rd=iz1-iz0, rmin=Math.min(rw,rd);
  faceTop(G,'haySide', hx-rmin*0.26,hz-rmin*0.26, hx+rmin*0.26,hz+rmin*0.26, fy+0.05, 0.95);   /* rug */
  /* a frame laid against the FAR wall (opposite the door): `a` runs from the
     far wall toward the door, `b` across the room from one side wall */
  const ax=(doorDir>=2);                          /* the door stands in an X wall */
  const aDir=(doorDir===0||doorDir===2)?1:-1;
  const aO=ax?(aDir>0?ix0:ix1):(aDir>0?iz0:iz1);
  const bO=ax?iz0:ix0;
  const aLen=ax?rw:rd, bLen=ax?rd:rw;
  const R=(a0,a1,b0,b1)=>{
    const aLo=aDir>0?aO+a0:aO-a1, aHi=aDir>0?aO+a1:aO-a0;
    return ax?[aLo,aHi,bO+b0,bO+b1]:[bO+b0,bO+b1,aLo,aHi]; };   /* [x0,x1,z0,z1] */
  const box=(r,y0,y1,side,top)=>emitBox(G,r[0],y0,r[2],r[1],y1,r[3],side,top,null);
  /* the bed — headboard on the far wall, side against the side wall */
  box(R(0.05,B*0.24,B*0.15,B*1.9),   fy,fy+B*0.95,'logSide','logTop');
  box(R(B*0.24,B*2.5,B*0.2,B*1.85),  fy,fy+B*0.42,'planks','wool');
  box(R(B*0.34,B*0.9,B*0.4,B*1.65),  fy+B*0.42,fy+B*0.6,'wool','wool');
  /* the table and its chairs, drawn back against the OTHER side wall */
  const ta=aLen*0.52, tb1=bLen-B*0.35;
  box(R(ta-B*0.15,ta+B*0.15,bLen-B*1.2,bLen-B*0.9), fy,fy+B*0.72,'logSide','logTop');
  box(R(ta-B*0.8,ta+B*0.8,bLen-B*1.75,tb1),         fy+B*0.72,fy+B*0.86,'planks','benchTop');
  for(const s of [-1,1]){ const ca=ta+s*B*1.15;
    box(R(ca-B*0.3,ca+B*0.3,bLen-B*1.35,bLen-B*0.75), fy,fy+B*0.44,'planks','planks');
    box(R(ca+(s>0?B*0.18:-B*0.3),ca+(s>0?B*0.3:-B*0.18),bLen-B*1.35,bLen-B*0.75),
        fy+B*0.44,fy+B*1.05,'planks','planks'); }
  /* shelves along the far wall, in the span the bed leaves free */
  { const s0=B*2.1, s1=bLen-B*2.0;
    for(let sb=s0; sb+B*0.9<=s1; sb+=B*1.1){
      box(R(0.05,B*0.5,sb,sb+B*0.9),      fy,fy+B*2.0,'logSide','logTop');
      box(R(0.1,B*0.45,sb+0.05,sb+B*0.85),fy+B*0.4,fy+B*1.7,'planks','planks'); } }
  /* a chest by the door, on the bed's side of the way in */
  box(R(aLen-B*0.95,aLen-B*0.2,B*0.3,B*1.2), fy,fy+B*0.6,'logSide','logTop');
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
  /* four blocks to the eaves now, not three — a house a man does not have
     to stoop into reads as a HOUSE, not a hut */
  const wallH=4*B, T=B*0.5, gw=B*0.75;
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
    yb:y, top:y+wallH+steps*B*0.55+B*0.6,   /* footing and ridge — the eye rides over these */
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
/* ---- THE FIRST BUILDER CONVERTED (Phase 3) ----
   A well is the smallest self-contained thing a village raises — a ring of
   coursed stone, four posts and a little roof — and it appears in every
   village on the earth. If the stamp machinery is wrong, it is wrong here in
   twenty blocks rather than in a temple.

   The body of it is UNCHANGED: the same boxes, in the same places, run
   through emitBox. All that differs is that a stamp is open while it runs,
   so the boxes become rock. The one thing added is the water standing in it,
   which used to be a single decorative face and is now a block a man could
   in principle take a bucket from. */
function emitWell(G, wx,wz,y){
  emitBox(G, wx-B,y,wz-B, wx+B,y+B*0.8,wz+B, 'cobble','cobble',null);
  if(_stampOn) stampAt(wx,y+B*0.4,wz,'water');
  else faceTop(G,'waterB', wx-B*0.6,wz-B*0.6, wx+B*0.6,wz+B*0.6, y+B*0.55, 0.9);
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
   stall, and rows of homes (one per resident). Returns {homes, market, fish}.
   A GENERATOR: it yields between homes so the frame driver can spread a
   city's cost over many frames — no single frame pays for a whole town. */
function* buildCity(G,ex,site,wy,rnd,cfg,torches,solids,i,rectFree,addRect){
  /* half again the homes, on lots half again apart — a CITY now stands a
     head taller and a street wider than the villages it lords it over */
  rectFree=rectFree||(()=>true); addRect=addRect||(()=>{});
  const cx=site.x, cz=site.z, sz2=cfg.size||2, nHomes=Math.round((cfg.houses||14)*1.4);
  emitPlaza(G, cx,cz, wy, B*(6+sz2*1.5));
  { stampBegin(); emitWell(G, cx,cz, wy); ex.stamps.push(stampEnd()); }
  solids.push({x:cx,z:cz,r:B*1.7});
  addRect(cx-B*1.7,cx+B*1.7,cz-B*1.7,cz+B*1.7);
  /* lots a street-and-a-garden apart — a city breathes, it does not huddle */
  const spacing=B*15, reach=B*(12+Math.ceil(nHomes/2));
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
    const w=8+Math.floor(rnd(placed+20)*3), d=8+Math.floor(rnd(placed+25)*3);
    if(!rectFree(hx-w*B/2-B,hx+w*B/2+B,hz-d*B/2-B,hz+d*B/2+B,B)) continue;
    const ddx=cx-hx, ddz=cz-hz;
    const doorDir=Math.abs(ddz)>=Math.abs(ddx)?(ddz>0?0:1):(ddx>0?2:3);
    emitHouse(G,ex, hx,hz,hc.h*B, w,d, doorDir, i*100+placed);
    addRect(hx-w*B/2-B,hx+w*B/2+B,hz-d*B/2-B,hz+d*B/2+B);
    const H=ex.houses[ex.houses.length-1];
    emitPathLine(G, H.dx,H.dz, cx+gx*spacing, cz);      // a lane to the street
    emitPathLine(G, cx+gx*spacing, cz, cx+gx*spacing, cz+gy*spacing);
    homes.push({x:hx,z:hz,doorx:H.dx,doorz:H.dz}); placed++;
    if(placed%3===0) yield;                              /* breathe between the houses */
  }
  /* the market — a row of stalls along the eastern street */
  let market=null;
  if(cfg.market!==false){ market={x:cx+B*4,z:cz};
    for(let k=0;k<3+sz2;k++){ const sx=cx+B*(3+k*2.6), sz=cz+B*2.3;
      const c=landAtWorld(sx,sz); if(!c||c.kind==='wall') continue;
      if(!rectFree(sx-B*1.6,sx+B*1.6,sz-B*1.4,sz+B*1.4,0)) continue;
      emitStall(G,sx,sz,c.h*B,'market'); solids.push({x:sx,z:sz,r:B*1.6});
      addRect(sx-B*1.6,sx+B*1.6,sz-B*1.4,sz+B*1.4);
      ex.stalls.push({x:sx,z:sz}); } }
  /* extra wells of water — never inside a home's lot */
  for(let w2=1;w2<(cfg.wells||1);w2++){ const a=rnd(w2+70)*6.28, rr=B*(6+w2*3);
    const wx=cx+Math.cos(a)*rr, wz=cz+Math.sin(a)*rr, c=landAtWorld(wx,wz);
    if(c&&c.kind!=='wall'&&rectFree(wx-B*1.7,wx+B*1.7,wz-B*1.7,wz+B*1.7,B*0.5)){
      { stampBegin(); emitWell(G,wx,wz,c.h*B); ex.stamps.push(stampEnd()); }
      solids.push({x:wx,z:wz,r:B*1.7});
      addRect(wx-B*1.7,wx+B*1.7,wz-B*1.7,wz+B*1.7); } }
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
  ex.deckKeys=deckKeys;   /* visible to the abort path from the first plank */
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
    if(s2%2===0){   /* the piles stand on the bed of the sea, not in the water */
      emitBox(G,x0+0.6,SUBSEA_Y,z0+0.6,x0+1.5,yD-0.1,z0+1.5,'logSide','logTop',null);
      emitBox(G,x0+B-1.5,SUBSEA_Y,z0+B-1.5,x0+B-0.6,yD-0.1,z0+B-0.6,'logSide','logTop',null);
    }
    deckMap.set(key,yD); deckKeys.push(key);
    lastX=x0+B/2; lastZ=z0+B/2;
  }
  if(!deckKeys.length) return null;
  emitBox(G,lastX-0.5,yD,lastZ-0.5,lastX+0.5,yD+B*1.4,lastZ+0.5,'logSide','logTop',null);
  torches.push({x:lastX,y:yD+B*1.4,z:lastZ});
  emitPathLine(G,site.x,site.z,shoreX,shoreZ);
  /* the pier's own bearing is kept — it is the only thing that truly knows
     which way the water lies (radial "outward" is inland on half the coasts) */
  ex.pier={x:lastX,z:lastZ,dx,dz};
  return deckKeys;
}
const activeVillages=new Map();
/* ---- the incremental builder: villages under construction, and the driver
   that advances them a few milliseconds each frame. Nothing of a half-built
   town touches the scene — the group is added whole, at the end. ---- */
const villageBuilds=[];
function villageBuildTick(){
  if(!villageBuilds.length) return;
  const T0=performance.now();
  do{
    const b=villageBuilds[0]; let r;
    try{ r=b.gen.next(); }catch(e){ r={done:true};
      const vv=activeVillages.get(b.i); if(vv&&vv.building) activeVillages.delete(b.i);
      /* an aborted build must give back its pier tiles, or invisible planks
         stand on the water and the retry finds every tile "already laid"
         and raises a village with no pier at all */
      if(b.ex&&b.ex.deckKeys) for(const k of b.ex.deckKeys) deckMap.delete(k); }
    if(r.done){ villageBuilds.shift();
      const vv=activeVillages.get(b.i);
      if(vv&&vv.building) activeVillages.delete(b.i); }   /* ended without registering — allow a retry */
  }while(villageBuilds.length&&performance.now()-T0<5);
}
let worldNight=0;   /* 0 by day .. 1 deep night — sends folk home */
const standaloneHouses=[];   /* houses not in a village (the player's treehouse) */
/* A GENERATOR: driven by villageBuildTick a few milliseconds a frame, so a
   town raises itself over many frames and the traveller never feels a hitch. */
function* spawnVillage(i,exShell){
  const site=SITES[i]; if(!site){ activeVillages.set(i,{none:true}); return; }
  const rnd=k=>hash2(i*31.7+k*7.7, i*11.3+k*3.9);
  const G=newG(); const ex=exShell||{};
  Object.assign(ex,{doors:[],houses:[],torchIn:[],farms:[],stalls:[],pen:null,stamps:[]});
  const wy=topY(site.ix,site.iz);
  const cfg=cityFor(i);                 /* a great city here, or a small village? */
  const torches=[]; const solids=[];
  /* ---- NOTHING IS BUILT INSIDE ANYTHING ELSE ----
     Every footprint laid — house, farm, pen, stall, well — is written down,
     and everything after it must find ground of its own. Houses used to be
     rung out with no regard for one another (two homes could share the same
     stones), and the hay, the torch posts, the farms and the pen were all
     cast by radius alone, so any of them could land inside a house. */
  const rects=[];
  const rectFree=(x0,x1,z0,z1,m)=>{ m=m||0;
    for(const r of rects) if(x0-m<r.x1&&x1+m>r.x0&&z0-m<r.z1&&z1+m>r.z0) return false;
    return true; };
  const addRect=(x0,x1,z0,z1)=>{ rects.push({x0,x1,z0,z1}); };
  let cityHomes=null;
  if(cfg){
    const ci=yield* buildCity(G,ex,site,wy,rnd,cfg,torches,solids,i,rectFree,addRect);
    cityHomes=ci.homes;
    /* a fenced pen for the beasts on the outskirts — on ground of its own */
    for(let tr=0;tr<10;tr++){ const a=rnd(130+tr*7)*6.28, rr=B*(18+(cfg.size||2)*4+tr);
      const px2=site.x+Math.cos(a)*rr, pz2=site.z+Math.sin(a)*rr, pc=landAtWorld(px2,pz2);
      if(pc&&pc.kind!=='wall'&&pc.kind!=='floe'&&rectFree(px2-B*3.5,px2+B*3.5,pz2-B*2.5,pz2+B*2.5,B)){
        emitPen(G,px2,pz2,pc.h*B,7,5);
        emitPathLine(G,site.x,site.z,px2,pz2); ex.pen={x:px2,z:pz2};
        addRect(px2-B*3.5,px2+B*3.5,pz2-B*2.5,pz2+B*2.5); break; } }
  } else {
    /* --- a village proper: a broad ring of homes about the well and square
       --- grown a full size: more homes, bigger homes, a wider ring to
       stand them in, so a town reads as a town and not a huddle of huts */
    const nH=8+Math.floor(rnd(1)*4);
    for(let h=0;h<nH;h++){
      /* a full-grown home (8–10 blocks a side), and a ring wide enough that
         every house keeps its own ground about it — each candidate is tested
         against everything already standing, and drawn again until it fits */
      const w=8+Math.floor(rnd(h+20)*3), d=8+Math.floor(rnd(h+25)*3);
      let hx=0,hz=0,hc=null,found=false;
      for(let tr=0;tr<10&&!found;tr++){
        const ang=(h/nH+rnd(h*10+tr+2)*0.35)*Math.PI*2, rad=(10+rnd(h*10+tr+9)*10)*B;
        const tx=site.x+Math.cos(ang)*rad, tz=site.z+Math.sin(ang)*rad;
        const tc=landAtWorld(tx,tz); if(!tc||tc.kind==='wall'||tc.kind==='floe') continue;
        /* the roof overhangs a block on every side, and a lane runs between */
        if(!rectFree(tx-w*B/2-B,tx+w*B/2+B,tz-d*B/2-B,tz+d*B/2+B,B*1.5)) continue;
        hx=tx; hz=tz; hc=tc; found=true;
      }
      if(!found) continue;
      const dx=site.x-hx, dz=site.z-hz;
      const doorDir=Math.abs(dz)>=Math.abs(dx) ? (dz>0?0:1) : (dx>0?2:3);
      emitHouse(G,ex, hx,hz,hc.h*B, w,d, doorDir, i*100+h);
      addRect(hx-w*B/2-B,hx+w*B/2+B,hz-d*B/2-B,hz+d*B/2+B);
      if(h%2===1) yield;
    }
    { stampBegin(); emitWell(G, site.x, site.z, wy); ex.stamps.push(stampEnd()); }
    solids.push({x:site.x,z:site.z,r:B*1.5});
    addRect(site.x-B*1.5,site.x+B*1.5,site.z-B*1.5,site.z+B*1.5);
    for(const dr of ex.doors) emitPathLine(G, site.x,site.z, dr.x,dr.z);
    const nF=2+(rnd(40)>0.55?1:0);
    for(let f=0;f<nF;f++){
      let fx=0,fz=0,fc=null,found=false;
      for(let tr=0;tr<8&&!found;tr++){
        const ang=rnd(f*9+tr+44)*Math.PI*2, rad=(15+rnd(f*9+tr+48)*7)*B;
        const tx=site.x+Math.cos(ang)*rad, tz=site.z+Math.sin(ang)*rad;
        const tc=landAtWorld(tx,tz); if(!tc||tc.kind==='wall') continue;
        if(!rectFree(tx-B*2.5,tx+B*2.5,tz-B*1.7,tz+B*1.7,B)) continue;
        fx=tx; fz=tz; fc=tc; found=true; }
      if(!found) continue;
      emitFarm(G, fx,fz, fc.h*B, i*100+f); emitPathLine(G, site.x,site.z, fx,fz);
      addRect(fx-B*2.5,fx+B*2.5,fz-B*1.7,fz+B*1.7);
      ex.farms.push({x:fx,z:fz});
    }
    /* a market stall or two upon the square — folk selling their goods */
    for(let s=0;s<1+(rnd(46)>0.5?1:0);s++){
      const sx=site.x+B*(2.6+s*3.1), sz=site.z+B*(2.4-s*4.6);
      const sc=landAtWorld(sx,sz); if(!sc||sc.kind==='wall') continue;
      if(!rectFree(sx-B*1.6,sx+B*1.6,sz-B*1.4,sz+B*1.4,0)) continue;
      emitStall(G,sx,sz,sc.h*B, s?'fish':'market'); solids.push({x:sx,z:sz,r:B*1.6});
      addRect(sx-B*1.6,sx+B*1.6,sz-B*1.4,sz+B*1.4);
      ex.stalls.push({x:sx,z:sz});
    }
    for(let hb=0; hb<2+Math.floor(rnd(52)*3); hb++){
      const ang=rnd(hb+54)*Math.PI*2, rad=(4+rnd(hb+58)*8)*B;
      const x=site.x+Math.cos(ang)*rad, z=site.z+Math.sin(ang)*rad;
      const c2=landAtWorld(x,z); if(!c2||c2.kind==='wall') continue;
      if(!rectFree(x-B*0.5,x+B*0.5,z-B*0.5,z+B*0.5,B*0.4)) continue;
      emitHay(G,x,z,c2.h*B); solids.push({x,z,r:B*0.8});
      addRect(x-B*0.5,x+B*0.5,z-B*0.5,z+B*0.5);
    }
    for(let tr=0;tr<10;tr++){ const ang=rnd(130+tr*7)*Math.PI*2, rad=(14+rnd(133+tr*7)*6)*B;
      const px2=site.x+Math.cos(ang)*rad, pz2=site.z+Math.sin(ang)*rad;
      const pc=landAtWorld(px2,pz2);
      if(pc&&pc.kind!=='wall'&&pc.kind!=='floe'&&rectFree(px2-B*3,px2+B*3,pz2-B*2,pz2+B*2,B)){
        emitPen(G,px2,pz2,pc.h*B,6,4);
        emitPathLine(G,site.x,site.z,px2,pz2); ex.pen={x:px2,z:pz2};
        addRect(px2-B*3,px2+B*3,pz2-B*2,pz2+B*2); break; } }
    { const bx=site.x+B*1.9, bz=site.z-B*1.4; const bc=landAtWorld(bx,bz);
      if(bc&&bc.kind!=='wall'&&rectFree(bx-B*0.5,bx+B*0.5,bz-B*0.5,bz+B*0.5,0)){
        emitBench(G,bx,bz,bc.h*B); solids.push({x:bx,z:bz,r:B*0.8}); } }
    for(let t=0;t<5;t++){ const ang=rnd(t+62)*Math.PI*2, rad=(3+rnd(t+66)*7)*B;
      const tx=site.x+Math.cos(ang)*rad, tz=site.z+Math.sin(ang)*rad;
      const tc2=landAtWorld(tx,tz); if(!tc2||tc2.kind==='wall') continue;
      if(!rectFree(tx-0.5,tx+0.5,tz-0.5,tz+0.5,B*0.3)) continue;
      emitBox(G, tx-0.5,tc2.h*B,tz-0.5, tx+0.5,tc2.h*B+B*1.6,tz+0.5, 'logSide','logTop',null);
      torches.push({x:tx,y:tc2.h*B+B*1.6,z:tz});
    }
  }
  torches.push(...ex.torchIn);          /* the hearth-lights within the houses */
  yield;
  /* the pier, if the sea lies near */
  const deckKeys=buildPier(G,ex,site,rnd,torches)||[];
  /* a fishmonger's stall by the pier, in the great cities */
  if(cfg&&cfg.fishStall!==false&&ex.pier){
    const fx=ex.pier.x, fz=ex.pier.z, fc=landAtWorld(fx-B,fz);
    let px3=fx,pz3=fz;
    for(let rr=1;rr<8;rr++){ const c=landAtWorld(fx+Math.cos(rr)*rr*B, fz+Math.sin(rr)*rr*B);
      if(c&&c.kind!=='wall'){ px3=fx+Math.cos(rr)*rr*B; pz3=fz+Math.sin(rr)*rr*B; break; } }
    const c=landAtWorld(px3,pz3); if(c&&c.kind!=='wall'&&rectFree(px3-B*1.6,px3+B*1.6,pz3-B*1.4,pz3+B*1.4,0)){
      emitStall(G,px3,pz3,c.h*B,'fish');
      solids.push({x:px3,z:pz3,r:B*1.6}); addRect(px3-B*1.6,px3+B*1.6,pz3-B*1.4,pz3+B*1.4);
      ex.stalls.push({x:px3,z:pz3}); }
  }
  /* build the merged meshes */
  const g=new THREE.Group();
  for(const mat in G){ const gg=G[mat];
    const bg=new THREE.BufferGeometry();
    bg.setAttribute('position',new THREE.Float32BufferAttribute(gg.p,3));
    bg.setAttribute('uv',new THREE.Float32BufferAttribute(gg.uv,2));
    bg.setAttribute('color',new THREE.Float32BufferAttribute(gg.c,3));
    bg.setIndex(gg.i); g.add(new THREE.Mesh(bg,MAT[mat])); yield; }
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
  /* ---- NOBODY IS SET DOWN INSIDE ANYTHING ----
     A soul or a beast used to be placed by its calling's radius alone, so it
     could stand embedded in the well, a stall, a hay-bale, a tree, a house
     wall — or in ANOTHER body (most of the clipping seen in every market).
     Every spawn now finds clear ground: outside every footprint, off every
     solid, and a body's breadth from everyone already standing. */
  const placedAt=[];
  const spawnFree=(x,z)=>{
    const c=landAtWorld(x,z);
    if(!c||c.kind==='wall'||c.kind==='floe') return false;
    if(treeBlocked(x,z)) return false;
    for(const H of ex.houses)
      if(x>H.x0-1.2&&x<H.x1+1.2&&z>H.z0-1.2&&z<H.z1+1.2) return false;
    for(const s of solids) if(Math.hypot(x-s.x,z-s.z)<s.r+2.0) return false;
    for(const e of placedAt) if(Math.hypot(x-e.x,z-e.z)<3.6) return false;
    return true; };
  const clearSpawn=(wx,wz)=>{
    if(spawnFree(wx,wz)) return {x:wx,z:wz};
    for(let r=3;r<=66;r+=3) for(let a2=0;a2<10;a2++){
      const th=hash2(wx*0.71+r*1.3,wz*0.93+a2*2.1)*6.2832;
      const x=wx+Math.cos(th)*r, z=wz+Math.sin(th)*r;
      if(spawnFree(x,z)) return {x,z}; }
    return {x:wx,z:wz}; };
  const addPerson=(role,hx,hz,roamR,child,female,data)=>{
    const seed=i*1000+people.length*7;
    const onDk=deckMap.get(Math.floor(hx/B)+','+Math.floor(hz/B))!==undefined;
    if(!onDk){                       /* the fisher stands on his own pier planks */
      const cc=landAtWorld(hx,hz);
      if(!cc||cc.kind==='wall'){ hx=cx; hz=cz; }
      const sp=clearSpawn(hx,hz); hx=sp.x; hz=sp.z; }
    const per=makePerson(seed,role,child,female);
    per.position.set(hx,topY(Math.floor(hx/B),Math.floor(hz/B)),hz); g.add(per);
    placedAt.push({x:hx,z:hz});
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
  yield;
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
  /* a great city: a resident in every home besides — set down at their own
     DOORSTEP, not in the middle of a furnished room */
  if(cityHomes&&cityHomes.length){
    for(let h=0;h<cityHomes.length;h++){ const hm=cityHomes[h];
      addPerson(h%3===0?'shopper':'folk',
        hm.doorx!==undefined?hm.doorx:hm.x, hm.doorz!==undefined?hm.doorz:hm.z,
        2.4, false, h%2===0, {home:{x:hm.x,z:hm.z}});
      if(h%4===3) yield; }
  }
  yield;
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
    let bx=(a2%2?hx0:cx)-B+(rnd(a2)-0.5)*B*6, bz=(a2%2?hz0:cz)-B+(rnd(a2+5)-0.5)*B*6;
    { const sp=clearSpawn(bx,bz); bx=sp.x; bz=sp.z; }
    an.position.set(bx,topY(Math.floor(bx/B),Math.floor(bz/B)),bz); g.add(an);
    placedAt.push({x:bx,z:bz});
    beasts.push({m:an,kind,hx:bx,hz:bz,tx:bx,tz:bz,t:rnd(a2+97)*4,seed:i*100+50+a2,
      roamR:(kind==='hare'||kind==='lizard')?6:4}); }
  if(baseKind!=='desert'&&rnd(303)>0.45){        /* the wolf come down from the hills */
    const wa=rnd(305)*6.28, an=makeAnimal('wolf');
    let bx=cx+Math.cos(wa)*B*13, bz=cz+Math.sin(wa)*B*13;
    { const sp=clearSpawn(bx,bz); bx=sp.x; bz=sp.z; }
    an.position.set(bx,topY(Math.floor(bx/B),Math.floor(bz/B)),bz); g.add(an);
    placedAt.push({x:bx,z:bz});
    beasts.push({m:an,kind:'wolf',hx:bx,hz:bz,tx:bx,tz:bz,t:2,seed:i*100+99,roamR:10,cool:6}); }
  /* birds of the air, wheeling above the land */
  const birds=[]; const nBirds=4+Math.floor(rnd(88)*4);
  for(let b2=0;b2<nBirds;b2++){ const bd=makeBird();
    const ph=rnd(b2+120)*6.28, rad=(6+rnd(b2+124)*10)*B, h2=wy+40+rnd(b2+128)*30;
    bd.position.set(cx+Math.cos(ph)*rad,h2,cz+Math.sin(ph)*rad); g.add(bd);
    birds.push({m:bd,ph,rad,h:h2,spd:0.2+rnd(b2+132)*0.25,cx,cz}); }
  scene.add(g);
  activeVillages.set(i,{g,site,people,beasts,birds,torchMats,deckKeys,houses:ex.houses,solids,
    farms:ex.farms,stalls:ex.stalls,pen:ex.pen,pier:ex.pier,stamps:ex.stamps,feedT:-99});
}
/* =================== THE LABOURS OF THE PEOPLE ===================
   A little task engine. moveEnt walks a body toward its mark with
   collision and striding legs; nextTask gives each role its next
   waypoint and the work to do there; personTick runs walk → work →
   next; beastTick gives the beasts their fears, their hungers and
   their herding. */
/* ---- AND ANYONE ALREADY STANDING IN A THING IS PUT OUT OF IT ----
   moveEnt has always refused to walk a body INTO a standing thing, but
   nothing ever helped one that was SET DOWN in it: the folk are placed when
   the village is raised, and a stall or a well built on the same spot left
   somebody standing inside it for good — which is most of what is seen in
   the market. A body that finds itself inside one is eased out the nearest
   way, and is then kept out by the ordinary rule. */
function pushOutOfSolids(ent,dt){
  const P=1.5;
  for(const[,vv] of activeVillages){ if(!vv.solids||!vv.site) continue;
    if(Math.hypot(ent.m.position.x-vv.site.x,ent.m.position.z-vv.site.z)>420) continue;
    for(const s of vv.solids){
      const ox=ent.m.position.x-s.x, oz=ent.m.position.z-s.z;
      const d=Math.hypot(ox,oz), need=s.r+P;
      if(d>=need) continue;
      let ux,uz;
      if(d>0.05){ ux=ox/d; uz=oz/d; }
      else { const a=hash2(s.x,s.z)*6.2832; ux=Math.cos(a); uz=Math.sin(a); }
      const step=Math.min(need-d, Math.max(6,sp0OfEnt(ent))*dt*2.2);
      const nx=ent.m.position.x+ux*step, nz=ent.m.position.z+uz*step;
      const g=groundInfo(nx,nz);
      if(g.land&&!blockedByStructureNPC(nx,nz)){ ent.m.position.x=nx; ent.m.position.z=nz; }
      ent.tx=ent.m.position.x; ent.tz=ent.m.position.z;   /* and it stops making for wherever it was going */
      return true; } }
  return false;
}
function sp0OfEnt(ent){ return ent.panic?12:6; }
function moveEnt(ent,dt,sp){
  if(pushOutOfSolids(ent,dt)) return true;   /* getting clear IS this frame's business */
  const dx=ent.tx-ent.m.position.x, dz=ent.tz-ent.m.position.z;
  const d=Math.hypot(dx,dz); let moving=d>0.6;
  if(moving){ const nx=ent.m.position.x+dx/d*sp*dt, nz=ent.m.position.z+dz/d*sp*dt;
    const hitPlayer=state.mode==='walk'&&Math.hypot(nx-state.walk.x,nz-state.walk.z)<2.6;
    const gN=groundInfo(nx,nz);
    const tooSteep=gN.land&&Math.abs(gN.y-ent.m.position.y)>B*1.35;   /* folk walk steps, not cliff faces */
    if(!gN.land||tooSteep||blockedByStructureNPC(nx,nz)||blockedBySolid(nx,nz)||blockedByEntity(nx,nz,ent.m)||hitPlayer
      ||!!landmarkSolidAt(nx,nz,ent.m.position.y+2,ent.m.position.y+8)){   /* the ancients' walls bar the folk as they bar the traveller */
      moving=false; ent.t=0; ent.stuck=(ent.stuck||0)+1;
      if(ent.stuck>2){ ent.stuck=0; ent.acting=false; ent.pt=0; ent.tx=ent.m.position.x; ent.tz=ent.m.position.z; } }
    else { ent.stuck=0; ent.m.position.x=nx; ent.m.position.z=nz; ent.m.rotation.y=Math.atan2(dx,dz); } }
  const gHere=groundInfo(ent.m.position.x,ent.m.position.z);
  ent.m.position.y=gHere.land?gHere.y:WATER_Y;
  const legs=ent.m.userData.legs;
  /* the penned and the herded go by the same law as the wild ones */
  const GT=ent.kind?tickGait(ent,ent.kind,moving?sp:0,dt):null;
  if(GT){ if(GT.rise>0) ent.m.position.y+=GT.rise; ent.m.rotation.z=GT.roll; }
  else if(legs&&legs.length){ const ph=performance.now()*(ent.panic?0.02:0.012);
    for(const L of legs){ L.rotation.x=moving?Math.sin(ph+(L.userData.ph||0))*(ent.panic?0.85:0.55):0;
      jointTick(L,moving); } }
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
      /* he faces down the PIER'S OWN LINE where one stands (radial "outward"
         faces inland on every coast that looks toward the world's midst —
         he stood casting into the hillside); the radial guess serves only
         where there is no pier to read */
      const pr=(vv.pier&&vv.pier.dx!==undefined)?vv.pier:null;
      if(pr){ ent.faceX=s.x+pr.dx*20; ent.faceZ=s.z+pr.dz*20; }
      else { const rr2=Math.hypot(s.x,s.z)||1;
        ent.faceX=s.x+s.x/rr2*20; ent.faceZ=s.z+s.z/rr2*20; } break; }
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
    /* every trade goes at its own pace, out of js/behavior.js — the hunter
       strides, the water-bearer walks under her jar, the child runs */
    let sp=window.BEHAVIOR?BEHAVIOR.folkPaceOf(ent.role,7):7;
    if(ent.role==='child'&&ent.anim==='play') sp=8.5;
    else if(ent.role==='hunter'&&ent.stalk) sp=4.5;
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
    else if(A==='fish'&&u.rod){
      /* ---- THE FISHERMAN'S REAL WORK ----
         He waits with the rod out over the water, feels the tug, STRIKES, and
         draws up a fish that hangs and kicks on the line before he unhooks it
         and casts again. It used to be one twitch of a rod that was not even
         in his hand, and no fish was ever seen. */
      ent.fishT=(ent.fishT||0)-dt;
      if(ent.fishT<=0){
        if(ent.fishSt==='hold'){ ent.fishSt='wait'; ent.fishT=5+Math.random()*7; }
        else { ent.fishSt='hold'; ent.fishT=2.4+Math.random()*1.8;   /* the catch, held up */
          splash(px+Math.sin(ent.m.rotation.y)*8,WATER_Y+1,pz+Math.cos(ent.m.rotation.y)*8,true); } }
      const held=ent.fishSt==='hold';
      u.armR.rotation.x=held?-1.55:-0.85+Math.sin(tnow*0.9)*0.05;
      u.armL.rotation.x=held?-1.2:-0.7;
      u.rod.rotation.x=held?-1.5:-0.95+Math.sin(tnow*1.7)*0.05;
      if(u.rodFish) u.rodFish.visible=held;
      if(u.rodFish&&held) u.rodFish.rotation.z=Math.sin(tnow*11)*0.5;   /* it kicks on the line */
      if(u.rodLine) u.rodLine.scale.y=held?0.34:1;                      /* reeled short as it comes up */
    }
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
  const mv=moveEnt(ent,dt,sp);
  if(ent.hop!==undefined&&ent.hop>0){ ent.hop-=dt; ent.m.position.y+=Math.sin(Math.max(0,ent.hop)*6.28)*1.4; }
  /* the pen's beasts breathe and swish like the wild ones — a farmyard of
     parked statues is no better than a plain of them */
  const ph2=(ent.seed||0)*6.28;
  ent.m.scale.y=1+0.012*Math.sin(tnow*2.1+ph2);
  { const tl=ent.m.userData&&ent.m.userData.tail;
    if(tl) tl.rotation.y=Math.sin(tnow*(mv?5.5:1.5)+ph2)*(mv?0.3:0.15); }
  /* and a standing grazer puts its head down to the grass now and then */
  if(!mv&&!ent.panic&&BEAST_PREY.has(ent.kind)){
    const gz=Math.sin(tnow*0.4+ph2);
    ent.m.rotation.x=gz>0.35?0.2+Math.sin(tnow*3+ph2)*0.05:0;
  } else ent.m.rotation.x=0;
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
  villageBuildTick();                          /* advance any towns under construction */
  /* spawn well BEYOND the fog line so a town is standing whole before the
     traveller can see the shore — and under a FLYER'S opened air the line
     rides out with the fog itself, so no town is ever raised inside his
     clear view. The build is spread over frames by villageBuildTick. */
  const trigV=state.mode==='fly'
    ?Math.max(1600,Math.min(3000,(scene.fog?scene.fog.far:1140)*0.92)):1600;
  for(let i=0;i<COUNTRIES.length;i++){
    const s0=SITES[i]; const c=COUNTRIES[i].c;
    const sxp=s0?s0.x:c[0]*R_WORLD, szp=s0?s0.z:c[1]*R_WORLD;
    const d=Math.hypot(px-sxp, pz-szp);
    const has=activeVillages.has(i);
    if(d<trigV&&!has){ activeVillages.set(i,{building:true});
      { const bx={}; villageBuilds.push({i,gen:spawnVillage(i,bx),ex:bx}); } }
    else if(d>Math.max(2100,trigV+500)&&has){ const vv=activeVillages.get(i);
      if(vv.building) continue;                        /* let the build finish; torn down next pass */
      if(vv.deckKeys) for(const k of vv.deckKeys) deckMap.delete(k);
      if(vv.g){ scene.remove(vv.g);
        const sharedT=new Set(Object.values(TEX));
        const sharedM=new Set(Object.values(MAT).concat(Object.values(ROBETEX)));
        for(const rm of Object.values(ROBETEX)) sharedT.add(rm.map);
        /* ---- AND EVERY OTHER SINGLETON THE WHOLE WORLD SHARES ----
           The whitelist covered MAT, ROBETEX and the torch — but the torch
           GLOW sprites carry glowTexCv (the same texture behind the sun's
           halo, the pearls, the fireflies and every landmark light), every
           villager's head shares the personHead material cache with the
           crew and the traders, and every door leaf in the world is ONE
           material. Each village despawn was disposing all three out from
           under the living systems — silently re-uploaded by the renderer,
           but a full texture delete and shader recompile per teardown, and
           a hard break the day the renderer stops forgiving it. */
        sharedT.add(glowTexCv);
        sharedM.add(doorLeafMat);
        for(const arr of Object.values(personHead)) for(const m of arr){
          sharedM.add(m); if(m.map) sharedT.add(m.map); }
        vv.g.traverse(o=>{ if(o.geometry)o.geometry.dispose();
          const mats=Array.isArray(o.material)?o.material:(o.material?[o.material]:[]);
          for(const m of mats){ if(sharedM.has(m)||m===torchMat) continue;
            if(m.map&&!sharedT.has(m.map)) m.map.dispose(); m.dispose(); } }); }
      /* a word spoken by a villager whose town is torn down must die with
         the town — the bubble used to hang over the empty ground */
      if(vv.people) for(const b of BARKS)
        if(b.ent&&vv.people.includes(b.ent)){ b.ent=null; b.t=0; b.sp.visible=false; }
      /* and what it STAMPED into the rock goes with it — a village left
         behind takes its own stone away and leaves the ground as it found
         it. Anything the traveller himself did there is in the other layer
         and is not touched. */
      if(vv.stamps) for(const g2 of vv.stamps) stampDrop(g2);
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
function pearlPriceAt(profile){ return Math.max(25,Math.round(45*(0.7+hash2(profile*7.7,profile*3.1)*0.9))); }
/* REPUTATION — markets that buy your catch learn your name, and pay better:
   +0.6% a point, to +30% at 50. Fish earn a point, pearls three. */
function repOf(profile){ return (state.rep&&state.rep[profile])||0; }
function repMult(profile){ return 1+Math.min(50,repOf(profile))*0.006; }
function repTier(profile){ const r=repOf(profile);
  return r>=40?'honoured':r>=25?'trusted':r>=10?'known':null; }
function addRep(profile,n){ if(tradeSea) return; state.rep=state.rep||{};
  const before=repOf(profile), after=Math.min(50,before+n); state.rep[profile]=after;
  const tiers=[[40,'Your name is honoured at this market \u2014 top silver for your catch.'],
    [25,'You are a trusted fisher at this market \u2014 better prices for fish and pearls.'],
    [10,'Your catch is getting known here \u2014 the mongers pay a little better.']];
  for(const[t2,msg] of tiers){ if(before<t2&&after>=t2){ toast(msg); break; } } }
function fishSellPrice(){ return Math.max(2,Math.round(fishPriceAt(tradeProfile)*(tradeSea?1:repMult(tradeProfile)))); }
function pearlSellPrice(){ return Math.max(15,Math.round(pearlPriceAt(tradeProfile)*(tradeSea?0.75:repMult(tradeProfile)))); }
let tradeOpen=false, tradeProfile=0, tradeTitle='', tradeSea=false, tradeAnchor=null, tradeShip=null;
function openTrade(profile,title,sea){
  tradeOpen=true; tradeProfile=profile; tradeTitle=title; tradeSea=!!sea;
  const p=state.mode==='walk'?state.walk:state.boat;
  tradeAnchor={x:p.x,z:p.z,mode:state.mode};        /* the stall does not follow you */
  $('trade').style.display='flex'; renderTrade();
}
/* walk off (or change mode) and the trading is done — no shop in your pocket */
function tradeGuard(){
  if(!tradeOpen||!tradeAnchor) return;
  const p=state.mode==='walk'?state.walk:state.boat;
  if(state.mode!==tradeAnchor.mode||Math.hypot(p.x-tradeAnchor.x,p.z-tradeAnchor.z)>26) closeTrade();
}
function closeTrade(){ if(!tradeOpen) return; tradeOpen=false; $('trade').style.display='none';
  /* the hailed merchantman fills her sails again a moment after the
     trading ends, instead of lying hove-to and waving out her full watch */
  if(tradeShip){ if(tradeShip.halt>3) tradeShip.halt=3; tradeShip=null; }
  saveState(); }
function renderTrade(){
  const tier=tradeSea?null:repTier(tradeProfile);
  $('trade-sub').textContent=tradeTitle+' — your purse: '+state.coins+' shekels · cargo '+cargoCount()+' / '+CARGO_MAX
    +(tier?' · your name is '+tier+' here':'');
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
  const fp=fishSellPrice(), tr2=document.createElement('tr');
  tr2.innerHTML='<td class="g">Fish (your catch)</td><td class="r">held '+(state.fish||0)+'</td><td class="r"></td>'+
    '<td class="r"><button class="tbtn" data-a="f" '+((state.fish||0)<1?'disabled':'')+'>sell '+fp+'</button></td>';
  T.appendChild(tr2);
  const pp=pearlSellPrice(), tr3=document.createElement('tr');
  tr3.innerHTML='<td class="g">Pearls of the deep</td><td class="r">held '+(state.pearls||0)+'</td><td class="r"></td>'+
    '<td class="r"><button class="tbtn" data-a="e" '+((state.pearls||0)<1?'disabled':'')+'>sell '+pp+'</button></td>';
  T.appendChild(tr3);
}
$('trade-rows').addEventListener('click',e=>{
  const b=e.target.closest('button'); if(!b||b.disabled) return;
  const a=b.dataset.a;
  if(a==='f'){ if((state.fish||0)>0){ state.fish--; state.coins+=fishSellPrice(); addRep(tradeProfile,1); } }
  else if(a==='e'){ if((state.pearls||0)>0){ state.pearls--; state.coins+=pearlSellPrice(); addRep(tradeProfile,3); } }
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
  let bestS=null;
  for(const[i,vv] of activeVillages){ if(vv.none||!vv.stalls||!vv.stalls.length) continue;
    for(const s of vv.stalls){ const d=Math.hypot(state.walk.x-s.x,state.walk.z-s.z);
      if(d<13&&(!bestS||d<bestS.d)) bestS={i,s,d}; } }
  return bestS;
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
let promptAction=null, promptPerson=null, promptScroll=null;
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
let promptStall=null, promptTrader=null, promptPearl=null, promptChest=null;
function promptTick(){
  const el=$('prompt'); if(!el) return;
  /* AN UNSEEN PROMPT TAKES NO CLICKS. The button is faded with opacity, and
     an opacity-nought element still swallows every pointer that lands on it
     — a dead ~190×36 px band sat mid-screen eating look-drags and firmament
     taps, and a click on the empty air could put the traveller to bed
     (interact() falls through to sleep). It follows its own visibility now. */
  const show=v=>{ el.style.opacity=v?1:0; el.style.pointerEvents=v?'auto':'none'; };
  if(cut||state.firm){ show(false); promptAction=null; return; }
  promptDoor=null; promptAction=null; promptPerson=null; promptStall=null; promptTrader=null; promptPearl=null; promptChest=null;
  promptScroll=nearestScrollProp();
  promptMount=null;   /* it was the one mark not cleared — a stale mount could linger */
  let label=null;
  if(tradeOpen){ show(false); return; }
  if(state.mode==='dive'){
    promptPearl=nearestPearl();
    if(promptPearl){ el.textContent='F — gather the pearl'; show(true); promptAction='pearl'; }
    else { promptChest=nearestWreckChest();
      if(promptChest){ el.textContent='F — break open the sea-chest'; show(true); promptAction='chest'; }
      else show(false); }
    return; }
  if(state.mode==='deck'){
    const d=state.deck;
    if(d.level==='hold'){ if(Math.hypot(d.lx-HATCH.x,d.lz-HATCH.z)<HATCH.r+2.5){ label='F — climb up to the deck'; promptAction='up'; } }
    else if(Math.hypot(d.lx-HATCH.x,d.lz-HATCH.z)<HATCH.r){ label='F — go below to the hold'; promptAction='down'; }
    if(!label){ const e=nearestEncounter();
      if(e){ label=e.kind==='flotsam'?'F — haul the flotsam aboard':e.kind==='bottle'?'F — take up the bottle':'F — take the castaway aboard'; promptAction='enc'; }
      else { promptTrader=nearestTrader();
        if(promptTrader){ label='F — hail the merchantman'; promptAction='hail'; } } }
  } else if(state.mode==='boat'){
    const e=nearestEncounter();
    if(e){ label=e.kind==='flotsam'?'F — haul the flotsam aboard':e.kind==='bottle'?'F — take up the bottle':'F — take the castaway aboard'; promptAction='enc'; }
    else { promptTrader=nearestTrader();
      if(promptTrader){ label='F — hail the merchantman'; promptAction='hail'; } }
  } else if(state.mode==='walk'){
    if(state.walk.inWater){ const e=nearestEncounter();
      if(e){ label='F — take up the bottle'; promptAction='enc'; } }
    if(label){ /* the bottle from the water */ }
    else if(state.fishing){ label=state.fishing.phase==='bite'?'F — STRIKE! a fish is on the line':'F — draw in the line'; promptAction='reel'; }
    else if(canSleep()){ label='F — sleep until morning'; promptAction='sleep'; }
    else if(canTouchDome()){ label='F \u2014 touch the firmament'; promptAction='dome'; }
    else if(state.mount){ label='F — dismount'; promptAction='dismount'; }
    else {
      promptDoor=nearestDoor(state.walk.x,state.walk.z);
      promptStall=nearestStallVillage();
      promptMount=nearestMount(state.walk.x,state.walk.z);
      /* a stall STOOD AT wins over a door eleven units off — in a packed
         market square the widest catchment (13) had the lowest word, and a
         trader standing at his own counter was told to open somebody's door */
      if(promptStall&&promptStall.d<7){ label='F — trade at the stall'; promptAction='trade'; }
      else if(promptScroll){ label='F \u2014 take up the scroll'; promptAction='scroll'; }
      else if(promptDoor){ label='F — '+(promptDoor.door.open?'close the door':'open the door'); promptAction='door'; }
      else if(promptMount){ label='F — mount the '+promptMount.kind; promptAction='ride'; }
      else if(promptStall){ label='F — trade at the stall'; promptAction='trade'; }
      else { promptPerson=nearbyPerson();
        /* THE PIER HEAD BELONGS TO THE ROD. The village fisher stands pinned
           at the one spot where a line can be cast, inside the speak
           catchment — so "F — speak" stood there for ever and no village
           pier could be fished from. Where a line CAN be cast and the only
           soul in reach is the working fisher, the cast wins; everyone else
           still stops you for a word first. */
        const fishable=canFishHere();
        if(promptPerson&&!(fishable&&promptPerson.role==='fisher')){ label='F — speak'; promptAction='speak'; }
        else if(fishable){ label='F — cast a line'; promptAction='fish'; promptPerson=null; }
        else if(promptPerson){ label='F — speak'; promptAction='speak'; } }
    }
  }
  if(!label&&state.mode==='fly'&&canTouchDome()){ label='F \u2014 touch the firmament'; promptAction='dome'; }
  if(label){ el.textContent=label; show(true); } else show(false);
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
let rodG=null, rodLine=null, rodBob=null, rodFish=null, landed=null;
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
  /* ---- AND THE FISH ITSELF, UPON THE LINE ----
     The catch was a line of text and a splash: the traveller struck, was told
     he had taken a fish, and nothing whatever was seen. There is a real fish
     on the hook now — it breaks the water, hangs and kicks on the line, and is
     drawn up before him. */
  rodFish=new THREE.Group();
  const fb=new THREE.Mesh(new THREE.BoxGeometry(2.6,1.2,0.8),new THREE.MeshLambertMaterial({color:0x9fb6c4}));
  const fbel=new THREE.Mesh(new THREE.BoxGeometry(2.2,0.5,0.7),new THREE.MeshLambertMaterial({color:0xe8eef2}));
  fbel.position.y=-0.5;
  const ftail=new THREE.Mesh(new THREE.BoxGeometry(0.9,1.3,0.5),new THREE.MeshLambertMaterial({color:0x7f96a6}));
  ftail.position.x=-1.7;
  const feye=new THREE.Mesh(new THREE.BoxGeometry(0.3,0.3,0.3),new THREE.MeshBasicMaterial({color:0x14181e}));
  feye.position.set(0.95,0.3,0.42);
  rodFish.add(fb); rodFish.add(fbel); rodFish.add(ftail); rodFish.add(feye);
  rodFish.visible=false; scene.add(rodFish);
}
function startFishing(){ ensureRod();
  state.fishing={t:0,dur:4+Math.random()*8,phase:'wait'};
  /* the rod goes into the HAND — the far end of the right arm — so it swings
     with him instead of floating at his side */
  { const u0=walkerG.userData, hand=u0&&u0.armR&&u0.armR.userData?u0.armR.userData.elbow:null;
    if(hand){ hand.add(rodG); rodG.position.set(0,-2.1,0.35); rodG.rotation.set(0,0,0); }
    else { walkerG.add(rodG); rodG.position.set(1.9,7.2,0.8); } }
  rodLine.visible=true; rodBob.visible=true;
  const w=state.walk;
  splash(w.x+Math.sin(w.heading)*11,WATER_Y+0.6,w.z+Math.cos(w.heading)*11,false);
  toast('You cast the line upon the waters, and wait for the tug.');
}
function endFishing(quiet){
  if(rodG&&rodG.parent) rodG.parent.remove(rodG);
  if(rodLine){ rodLine.visible=false; rodBob.visible=false; }
  if(rodFish) rodFish.visible=false;
  landed=null;
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
    /* THE FISH IS SEEN. It comes up on the line where the float was, kicks
       there a moment in the air, and is drawn in to the hand. */
    F.phase='landed'; F.t=0;
    landed={t:0, x:w.x+Math.sin(w.heading)*11, z:w.z+Math.cos(w.heading)*11};
    if(rodFish) rodFish.visible=true;
    toast('You strike, and draw up '+name+' from the deep — '+state.fish+' taken this voyage.');
    saveState();
  } else endFishing(false);
}
function fishTick(dt){
  const F=state.fishing; if(!F) return;
  if(state.mode!=='walk'){ endFishing(true); return; }
  const w=state.walk, [f2,t2]=axis();
  /* a fish being drawn up is not interrupted by a step — it is over in a moment */
  if(F.phase!=='landed'&&(Math.abs(f2)>0.2||Math.abs(t2)>0.2||!w.grounded||w.inWater)){ endFishing(false); return; }
  F.t+=dt;
  let bx=w.x+Math.sin(w.heading)*11, bz=w.z+Math.cos(w.heading)*11;
  let by=WATER_Y+seaHeight(bx,bz)+0.3+(F.phase==='bite'?Math.sin(F.t*26)*0.9:Math.sin(F.t*2.1)*0.3);
  /* ---- THE CATCH COMES IN ----
     The float and the fish on it are drawn from the water back to the rod's
     tip over a second and a half, the fish kicking the whole way, and then it
     is his and the line is stowed. */
  if(F.phase==='landed'){
    const q=Math.min(1,F.t/1.5);
    const tipX=w.x+Math.sin(w.heading)*6.4, tipZ=w.z+Math.cos(w.heading)*6.4;
    const tipY=walkerG.position.y+11.0;
    bx=landed.x+(tipX-landed.x)*q; bz=landed.z+(tipZ-landed.z)*q;
    by=(WATER_Y+seaHeight(landed.x,landed.z)+0.3)+(tipY-(WATER_Y+seaHeight(landed.x,landed.z)+0.3))*q;
    if(rodFish){ rodFish.visible=true;
      rodFish.position.set(bx,by-1.4,bz);
      rodFish.rotation.set(Math.sin(F.t*16)*0.35, w.heading, Math.sin(F.t*13)*0.55); }
    if(F.t>=1.9){ endFishing(true); return; }
  }
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
  spearM=new THREE.Group(); spearM.rotation.order='YXZ';
  const shaft=new THREE.Mesh(new THREE.BoxGeometry(0.4,0.4,9),new THREE.MeshLambertMaterial({color:0x6a4a2a}));
  spearM.add(shaft);
  const tip=new THREE.Mesh(new THREE.BoxGeometry(0.6,0.6,1.4),new THREE.MeshLambertMaterial({color:0xb8bcc4}));
  tip.position.z=5.0; spearM.add(tip);
  spearM.visible=false; scene.add(spearM);
}
function throwSpear(){
  if(state.firm||spear.active||state.fishing) return;
  if(state.mode==='walk'){
    ensureSpear();
    const w=state.walk;
    spear.active=true; spear.aqua=false; spear.stick=0;
    spear.x=w.x+Math.sin(w.heading)*2; spear.z=w.z+Math.cos(w.heading)*2;
    spear.y=(w.feetY||0)+9;
    spear.vx=Math.sin(w.heading)*70; spear.vz=Math.cos(w.heading)*70; spear.vy=7;
    spearM.visible=true;
    const u=walkerG.userData; u.armR.rotation.x=-2.6;   /* the cast */
  } else if(state.mode==='dive'){
    /* the spear hunts beneath the waves too — slower, sinking, true to the water */
    ensureSpear();
    const dv=state.dive;
    spear.active=true; spear.aqua=true; spear.stick=0;
    spear.x=dv.x+Math.sin(dv.heading)*3; spear.z=dv.z+Math.cos(dv.heading)*3;
    spear.y=dv.y+2;
    const tilt=Math.max(-0.5,Math.min(0.5,-dv.vy/DIVE_VMAX*0.7));   /* aim follows the swim tilt */
    spear.vx=Math.sin(dv.heading)*54; spear.vz=Math.cos(dv.heading)*54; spear.vy=-2-tilt*24;
    spearM.visible=true;
  }
}
/* the quarry of the deep: fish, squid and puffers are tallied as fish
   taken; a struck SHARK is not food but flees, its hunt broken */
function spearHitDeep(){
  const near=(x,y,z,r)=>Math.hypot(x-spear.x,z-spear.z)<r&&Math.abs(y-spear.y)<r+2.5;
  for(const s of SHARKS){ if(!s.set) continue;
    if(near(s.x,s.y,s.z,5.5)){ s.cool=24;
      s.dir=Math.atan2(s.z-spear.z,s.x-spear.x); return {n:'the great shark',fishy:false}; } }
  for(const f of DIVEFISH){ if(!f.set) continue;
    if(near(f.x,f.y,f.z,3.2)){ f.set=false; f.m.visible=false; return {n:'a fish of the deep',fishy:true}; } }
  for(const q of SQUIDS){ if(!q.set) continue;
    if(near(q.x,q.y,q.z,3.6)){ q.set=false; q.m.visible=false; return {n:'a squid',fishy:true}; } }
  if(PUFFERS) for(const o of PUFFERS){ if(!o.set) continue;
    if(near(o.x,o.y,o.z,3.2)){ o.set=false; o.m.visible=false; return {n:'a puffer of the reef',fishy:true}; } }
  return null;
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
  /* substep the flight so a slow frame can never carry it clean through
     a fish or a beast between one tick and the next */
  const sub=Math.max(1,Math.ceil((Math.hypot(spear.vx,spear.vz)*dt)/2.4));
  const sdt=dt/sub;
  for(let s3=0;s3<sub&&spear.active;s3++){
    if(spear.aqua){                                  /* the water holds it back and draws it down */
      const drag=Math.max(0,1-sdt*0.55);
      spear.vx*=drag; spear.vz*=drag; spear.vy=spear.vy*drag-7*sdt;
    } else spear.vy-=26*sdt;
    spear.x+=spear.vx*sdt; spear.z+=spear.vz*sdt; spear.y+=spear.vy*sdt;
    if(spear.aqua){
      const catch2=spearHitDeep();
      if(catch2){ spear.active=false; spear.stick=1.2;
        if(catch2.fishy){ state.fish=(state.fish||0)+1;
          toast('Your spear takes '+catch2.n+' — '+state.fish+' fish in the log, good silver at any market.'); }
        else toast('Your spear turns '+catch2.n+' — it breaks off the hunt and flees to the deep.');
        saveState(); break; }
      if(landAtWorld(spear.x,spear.z)){ spear.active=false; spear.stick=1.5; break; } /* struck the flank */
      const fy=seabedDepth(spear.x,spear.z);
      if(spear.y<=fy+0.6){ spear.active=false; spear.stick=5;
        spearM.rotation.x=1.15; spearM.position.y=fy+1.3; break; }  /* planted in the sea bed */
      if(spear.y>=SEA_SURF+seaHeight(spear.x,spear.z)){ spear.active=false; spear.stick=0.4;
        splash(spear.x,SEA_SURF+0.6,spear.z,false); break; }
      const dv=state.dive;
      if(Math.hypot(spear.x-dv.x,spear.z-dv.z)>110){ spear.active=false; spearM.visible=false; break; }
    } else {
      const kill=spearHit();
      if(kill){ state.game=(state.game||0)+1; spear.active=false; spear.stick=1.4;
        toast(kill==='wolf'?'Your spear finds the wolf — the flock is safe, and the pelt is yours. Game taken: '+state.game+'.'
          :'Your spear finds the '+kill+' — game taken for the voyage: '+state.game+'.');
        saveState(); break; }
      const gy=groundInfo(spear.x,spear.z);
      if(spear.y<=(gy.land?gy.y:WATER_Y)+0.4){
        spear.active=false;
        if(!gy.land){ splash(spear.x,WATER_Y+0.6,spear.z,false); spear.stick=0.5; }
        else { spear.stick=5; spearM.rotation.x=1.15; spearM.position.y=gy.y+1.4; }  /* planted in the earth */
        break; }
      if(Math.hypot(spear.x-state.walk.x,spear.z-state.walk.z)>150){ spear.active=false; spearM.visible=false; break; }
    }
  }
  if(spear.active){
    spearM.position.set(spear.x,spear.y,spear.z);
    spearM.rotation.y=Math.atan2(spear.vx,spear.vz);
    spearM.rotation.x=Math.atan2(-spear.vy,Math.hypot(spear.vx,spear.vz))*0.8;
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
  const rnd=k=>hash2(k*3.17+9.1,k*7.31-2.2);
  /* ---- THE CITY OF THE GREAT KING, as she stood BCE: a walled hill-city of
     hewn stone. The ancient wall rings the hill with towers and two open
     gates; the Temple courts crown the height — a platform of great stones,
     the house with its cedar courses and crown of gold, Yakin and Boaz at
     the porch, the altar before it; stone houses climb the slopes within,
     and olive groves terrace the hillsides without. ---- */
  const RA=B*15, RB=B*12, segs=72, wallTop=y+B*3.4;
  for(let s2=0;s2<segs;s2++){ const th=s2/segs*6.283;
    if(Math.abs(th-1.5708)<0.14||Math.abs(th-4.7124)<0.14) continue;   /* the two gates stand open */
    const wx=x+Math.cos(th)*RA, wz=z+Math.sin(th)*RB;
    const c=landAtWorld(wx,wz); if(!c||c.kind==='wall'||c.kind==='floe') continue;
    const gy=c.h*B-B*0.5;
    emitBox(G, wx-B*0.66,gy,wz-B*0.66, wx+B*0.66,wallTop,wz+B*0.66, 'cobble','cobble',null);
    if(s2%2===0) emitBox(G, wx-B*0.3,wallTop,wz-B*0.3, wx+B*0.3,wallTop+B*0.5,wz+B*0.3, 'cobble','cobble',null);   /* crenels */
    if(s2%9===0) emitBox(G, wx-B*1.15,gy,wz-B*1.15, wx+B*1.15,wallTop+B*1.4,wz+B*1.15, 'cobble','cobble',null); }  /* towers */
  for(const th of [1.5708,4.7124]) for(const off of [-0.2,0.2]){       /* the gate towers */
    const wx=x+Math.cos(th+off)*RA, wz=z+Math.sin(th+off)*RB;
    const c=landAtWorld(wx,wz); if(!c||c.kind==='wall') continue;
    emitBox(G, wx-B*1.1,c.h*B-B*0.5,wz-B*1.1, wx+B*1.1,wallTop+B*1.8,wz+B*1.1, 'cobble','cobble',null); }
  /* the street of the city: gate to gate, and up to the courts */
  emitPathLine(G, x,z-RB, x,z+RB); emitPathLine(G, x,z, x+B*9,z);
  /* ---- the Temple platform and its stair, eastward ---- */
  const tp=y+B*1.6;
  emitBox(G, x-B*8,y-B*0.5,z-B*6, x+B*8,tp,z+B*6, 'stone','cobble',null);
  for(let i=0;i<5;i++)
    emitBox(G, x+B*8+i*B*0.8, tp-(i+1)*B*0.34, z-B*2, x+B*8+(i+1)*B*0.8, tp-i*B*0.34, z+B*2, 'stone','stone',null);
  /* the court wall about the platform edge */
  for(const sx of [-1,1]) emitBox(G, x+sx*B*7.8-B*0.25,tp,z-B*5.8, x+sx*B*7.8+B*0.25,tp+B*0.9,z+B*5.8, 'stone','stone',null);
  for(const sz of [-1,1]) emitBox(G, x-B*7.8,tp,z+sz*B*5.8-B*0.25, x+B*7.8,tp+B*0.9,z+sz*B*5.8+B*0.25, 'stone','stone',null);
  /* ---- the house: hewn stone, cedar courses, the crown of gold ---- */
  const Hx0=x-B*6.4, Hx1=x+B*1.2, Hz0=z-B*2.2, Hz1=z+B*2.2, Hy1=tp+B*4;
  emitBox(G, Hx0,tp,Hz0, Hx1,Hy1,Hz1, 'stone','stone',null);
  emitBox(G, Hx0-B*0.08,tp+B*0.9,Hz0-B*0.08, Hx1+B*0.08,tp+B*1.12,Hz1+B*0.08, 'planks','planks',null);
  emitBox(G, Hx0-B*0.08,tp+B*2.5,Hz0-B*0.08, Hx1+B*0.08,tp+B*2.72,Hz1+B*0.08, 'planks','planks',null);
  emitBox(G, Hx0-B*0.3,Hy1,Hz0-B*0.3, Hx1+B*0.3,Hy1+B*0.55,Hz1+B*0.3, 'hayTop','hayTop','hayTop');
  /* Yakin and Boaz — the two free pillars of the porch, crowned in gold */
  for(const s of [-1,1]){
    emitBox(G, Hx1+B*1.3-B*0.45,tp,z+s*B*1.5-B*0.45, Hx1+B*1.3+B*0.45,tp+B*3.4,z+s*B*1.5+B*0.45, 'logSide','logTop',null);
    emitBox(G, Hx1+B*1.3-B*0.6,tp+B*3.4,z+s*B*1.5-B*0.6, Hx1+B*1.3+B*0.6,tp+B*3.9,z+s*B*1.5+B*0.6, 'hayTop','hayTop','hayTop'); }
  /* the altar of unhewn stone before the porch */
  emitBox(G, Hx1+B*3.4,tp,z-B*1.1, Hx1+B*4.9,tp+B*1.15,z+B*1.1, 'cobble','stone',null);
  /* ---- the houses of the city, flat-roofed stone on the slopes ---- */
  for(let hI=0;hI<16;hI++){ const a=rnd(hI+30)*6.283, rr=B*5+rnd(hI+50)*B*7;
    const hx=x+Math.cos(a)*rr, hz=z+Math.sin(a)*rr*(RB/RA);
    if(Math.abs(hx-x)<B*9.5&&Math.abs(hz-z)<B*7.5) continue;           /* the courts stay clear */
    const c=landAtWorld(hx,hz); if(!c||c.kind==='wall'||c.kind==='floe') continue;
    const gy=c.h*B, w=B*(1.4+rnd(hI+70)*0.9), hh=B*(1.4+rnd(hI+90)*0.8);
    emitBox(G, hx-w,gy,hz-w, hx+w,gy+hh,hz+w, 'path','path',null);
    emitBox(G, hx-w*0.45,gy+hh,hz-w*0.45, hx+w*0.45,gy+hh+B*0.5,hz+w*0.45, 'path','path',null); }
  /* ---- the olive groves on the terraces without the walls ---- */
  for(let tI=0;tI<18;tI++){ const a=rnd(tI+130)*6.283, rr=RA+B*3+rnd(tI+150)*B*8;
    const tx=x+Math.cos(a)*rr, tz=z+Math.sin(a)*rr*(RB/RA);
    const c=landAtWorld(tx,tz); if(!c||c.kind==='wall'||c.kind==='floe'||c.kind==='sand') continue;
    const gy=c.h*B;
    emitBox(G, tx-B*0.3,gy,tz-B*0.3, tx+B*0.3,gy+B*1.5,tz+B*0.3, 'logSide','logTop',null);
    emitBox(G, tx-B*1.15,gy+B*1.2,tz-B*1.15, tx+B*1.15,gy+B*2.2,tz+B*1.15, 'leaves','leaves','leaves'); }
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

/* ================= THE WONDERS OF THE ANCIENTS =================
   The famous works of the old world stand at their true places: pyramids,
   ziggurats, temples, standing stones, walls, gates, a lighthouse — built
   from the same blocks as the land when the traveller draws near, each
   under its own golden name. The named summits carry a name-banner too. */
function lmPyramid(G,x,z,y,s){ s=s||1; const layers=9, bw=B*7.5*s, step=B*1.15*s;
  for(let i=0;i<layers;i++){ const w=bw*(1-i/layers)+B*0.4;
    emitBox(G, x-w,y+i*step,z-w, x+w,y+(i+1)*step,z+w, 'sand','sand',null); }
  emitBox(G, x-B*0.6,y+layers*step,z-B*0.6, x+B*0.6,y+layers*step+B*0.7,z+B*0.6,'stone','stone',null); }
function lmZiggurat(G,x,z,y){ const ws=[B*7.5,B*5.8,B*4.2,B*2.8], step=B*1.7;
  for(let i=0;i<ws.length;i++)
    emitBox(G, x-ws[i],y+i*step,z-ws[i], x+ws[i],y+(i+1)*step,z+ws[i], 'badSide','badTop',null);
  const H2=ws.length*step;
  emitBox(G, x-B*1.2,y+H2,z-B*1.2, x+B*1.2,y+H2+B*1.7,z+B*1.2, 'cobble','cobble',null);   /* the high shrine */
  for(let i=0;i<14;i++){ const t=i/14;                                                     /* the great stair */
    emitBox(G, x-B*0.9,y+t*H2, z+(ws[0]+B*2)*(1-t)+B*0.6, x+B*0.9,y+t*H2+B*0.55, z+(ws[0]+B*2)*(1-t)+B*2.0, 'badSide','badTop',null); } }
function lmTemple(G,x,z,y,s){ s=s||1; const wx=B*6.5*s, wz=B*4.2*s, colH=B*3.6*s, y0=y+B*0.8;
  emitBox(G, x-wx-B*1.7,y-B*0.4,z-wz-B*1.7, x+wx+B*1.7,y+B*0.35,z+wz+B*1.7, 'stone','stone',null);   /* the steps */
  emitBox(G, x-wx-B,y,z-wz-B, x+wx+B,y0,z+wz+B, 'stone','stone',null);                               /* stylobate */
  const nx=Math.max(4,Math.round(wx/(B*1.5))), nz=Math.max(3,Math.round(wz/(B*1.5)));
  for(let i=0;i<=nx;i++){ const cx2=-wx+i*(2*wx/nx);
    for(const sz of [-1,1]) emitBox(G, x+cx2-B*0.38,y0,z+sz*wz-B*0.38, x+cx2+B*0.38,y0+colH,z+sz*wz+B*0.38,'stone','stone',null); }
  for(let i=1;i<nz;i++){ const cz2=-wz+i*(2*wz/nz);
    for(const sx of [-1,1]) emitBox(G, x+sx*wx-B*0.38,y0,z+cz2-B*0.38, x+sx*wx+B*0.38,y0+colH,z+cz2+B*0.38,'stone','stone',null); }
  emitBox(G, x-wx*0.55,y0,z-wz*0.55, x+wx*0.55,y0+colH,z+wz*0.55, 'stone','stone',null);             /* the cella */
  emitBox(G, x-wx-B*0.7,y0+colH,z-wz-B*0.7, x+wx+B*0.7,y0+colH+B*0.7,z+wz+B*0.7, 'stone','stone',null); /* architrave */
  emitBox(G, x-wx*0.96,y0+colH+B*0.7,z-wz*0.96, x+wx*0.96,y0+colH+B*1.5,z+wz*0.96, 'roof','roof','roof'); }
function lmStoneCircle(G,x,z,y){ const R2=B*5.2, n=10;
  for(let i=0;i<n;i++){ const a=i/n*6.283, sx=x+Math.cos(a)*R2, sz=z+Math.sin(a)*R2;
    emitBox(G, sx-B*0.55,y,sz-B*0.55, sx+B*0.55,y+B*2.6,sz+B*0.55, 'stone','stone',null);
    if(i%2===0){ const am=(i+0.5)/n*6.283, tx=x+Math.cos(am)*R2, tz=z+Math.sin(am)*R2;
      emitBox(G, tx-B*1.35,y+B*2.6,tz-B*1.35, tx+B*1.35,y+B*3.2,tz+B*1.35, 'stone','stone',null); } } }
function lmWall(G,x,z,y,s){ const L2=(s?s*B*22:B*44), segs=Math.round(L2/B);
  for(let s2=0;s2<segs;s2++){ const wx2=x-L2/2+s2*B, wz2=z+Math.sin(s2*0.33)*B*3.2;
    const c=landAtWorld(wx2,wz2); if(!c||c.kind==='wall'||c.kind==='floe') continue;
    const gy=c.h*B;
    emitBox(G, wx2,gy,wz2-B*0.8, wx2+B,gy+B*2.4,wz2+B*0.8, 'cobble','cobble',null);
    if(s2%2===0) emitBox(G, wx2,gy+B*2.4,wz2-B*0.8, wx2+B*0.5,gy+B*2.8,wz2-B*0.45,'cobble','cobble',null);  /* crenels */
    if(s2%9===0) emitBox(G, wx2-B*0.6,gy,wz2-B*1.5, wx2+B*1.6,gy+B*4.2,wz2+B*1.5, 'cobble','cobble',null); } } /* watchtowers */
function lmLighthouse(G,x,z,y){
  emitBox(G, x-B*3,y,z-B*3, x+B*3,y+B*6,z+B*3, 'stone','stone',null);
  emitBox(G, x-B*2,y+B*6,z-B*2, x+B*2,y+B*11,z+B*2, 'stone','stone',null);
  emitBox(G, x-B*1.2,y+B*11,z-B*1.2, x+B*1.2,y+B*14,z+B*1.2, 'stone','stone',null);
  emitBox(G, x-B*1.6,y+B*14,z-B*1.6, x+B*1.6,y+B*14.5,z+B*1.6, 'cobble','cobble',null); }
function lmGate(G,x,z,y){
  for(const s of [-1,1]) emitBox(G, x+s*B*3-B*1.4,y,z-B*1.4, x+s*B*3+B*1.4,y+B*5,z+B*1.4, 'cobble','cobble',null);
  emitBox(G, x-B*4.4,y+B*3.4,z-B*1.1, x+B*4.4,y+B*5,z+B*1.1, 'cobble','cobble',null);
  emitBox(G, x-B*4.4,y+B*5,z-B*0.9, x-B*3.4,y+B*5.7,z+B*0.9, 'cobble','cobble',null);
  emitBox(G, x+B*3.4,y+B*5,z-B*0.9, x+B*4.4,y+B*5.7,z+B*0.9, 'cobble','cobble',null); }
function lmCity(G,x,z,y,s,seed){ seed=seed||7.7; const R2=B*10;
  for(let a=0;a<44;a++){ const th=a/44*6.283, wx2=x+Math.cos(th)*R2, wz2=z+Math.sin(th)*R2;
    if(a===0||a===1) continue;                                       /* the gate gap */
    const c=landAtWorld(wx2,wz2); if(!c||c.kind==='wall'||c.kind==='floe') continue;
    emitBox(G, wx2-B*0.5,c.h*B,wz2-B*0.5, wx2+B*0.5,c.h*B+B*1.8,wz2+B*0.5, 'cobble','cobble',null); }
  for(let hI=0;hI<9;hI++){ const a=hash2(hI*3.1,seed)*6.283, r=B*2+hash2(hI*1.7,seed*2)*R2*0.6;
    const hx=x+Math.cos(a)*r, hz=z+Math.sin(a)*r; const c=landAtWorld(hx,hz); if(!c||c.kind==='wall') continue;
    const gy=c.h*B, w=B*(1.5+hash2(hI,seed*3)*1.2);
    emitBox(G, hx-w,gy,hz-w, hx+w,gy+B*(1.5+hash2(hI,seed*5)),hz+w, 'path','path',null); } }   /* mudbrick, flat-roofed */
function lmStatue(G,x,z,y){
  emitBox(G, x-B*2,y,z-B*2, x+B*2,y+B*0.8,z+B*2, 'stone','stone',null);
  emitBox(G, x-B*1.3,y+B*0.8,z-B*1.3, x+B*1.3,y+B*3.4,z+B*1.3, 'stone','stone',null);
  emitBox(G, x-B*1.35,y+B*2.1,z+B*1.25, x+B*1.35,y+B*2.7,z+B*1.4, 'stone','stone',null); }
const LM_BUILDERS={pyramid:lmPyramid,ziggurat:lmZiggurat,temple:lmTemple,stonecircle:lmStoneCircle,
  wall:lmWall,lighthouse:lmLighthouse,gate:lmGate,city:lmCity,statue:lmStatue};
/* ---- THE DRESSING OF A SECRET RANGE ----
   The land itself (peaks, canyons, shafts) is cut in cellRaw; what is built
   here when the traveller draws near is the WATER AND THE LIGHT of the
   place: the falls hung off the sheer faces with their plunge pools, the
   standing water of the mountain blue holes with a pale glow over it, and
   crystal spires down in the slot canyons that burn faintly in the dark —
   so a cave is worth walking into for what waits at the end of it. */
function lmRange(L){
  const [rx,rz]=llToWorld(L.lat,L.lon);
  let Rg=null,bd=1e9; for(const q of RANGES){ const d=Math.hypot(q.x-rx,q.z-rz); if(d<bd){bd=d;Rg=q;} }
  if(!Rg) return null;
  const G=newG(), glows=[];
  /* the waterfalls — wherever a sheer face drops nine blocks at a stroke */
  const placed=[]; let falls=0;
  for(let a=0;a<44&&falls<3;a++){
    const th=hash2(Rg.sd,a*1.7)*6.283, rr=Rg.R*(0.15+hash2(a*2.9,Rg.sd)*0.5);
    const wx=Rg.x+Math.cos(th)*rr, wz=Rg.z+Math.sin(th)*rr;
    const ix=Math.floor(wx/B), iz=Math.floor(wz/B);
    const c0=cell(ix,iz); if(!c0||c0.kind==='wall') continue;
    let near=false; for(const p of placed) if(Math.hypot(p[0]-wx,p[1]-wz)<300) near=true;
    if(near) continue;
    for(const o of [[2,0],[-2,0],[0,2],[0,-2]]){
      const c1=cell(ix+o[0],iz+o[1]); if(!c1||c1.kind==='wall') continue;
      if(c0.h-c1.h<9) continue;
      const y0=c0.h*B, y1=c1.h*B;
      let bx0,bx1,bz0,bz1;
      if(o[0]!==0){ const bx=(ix+(o[0]>0?1:0))*B+o[0]*0.4;
        bx0=bx-1.0; bx1=bx+1.0; bz0=iz*B-B*0.6; bz1=(iz+1)*B+B*0.6; }
      else { const bz=(iz+(o[1]>0?1:0))*B+o[1]*0.4;
        bz0=bz-1.0; bz1=bz+1.0; bx0=ix*B-B*0.6; bx1=(ix+1)*B+B*0.6; }
      emitBox(G,bx0,y1+0.4,bz0,bx1,y0+1.2,bz1,'waterB','waterB','waterB');
      const px2=(ix+0.5+o[0]*1.6)*B, pz2=(iz+0.5+o[1]*1.6)*B;
      faceTop(G,'waterB',px2-B*1.8,pz2-B*1.8,px2+B*1.8,pz2+B*1.8,y1+0.9,1.0);
      placed.push([wx,wz]); falls++; break;
    }
  }
  /* the blue holes' standing water, and the pale light over it */
  for(const H of Rg.holes){
    const ix=Math.floor(H.x/B), iz=Math.floor(H.z/B), c=cell(ix,iz);
    if(!c||c.kind==='wall') continue;
    const wy=c.h*B+1.4, r=H.R*0.62;
    faceTop(G,'waterB',H.x-r,H.z-r,H.x+r,H.z+r,wy,1.0);
    glows.push({x:H.x,y:wy+6,z:H.z,c:0x66c8ff,s:70,o:0.35});
  }
  /* crystal spires, only down in a true slot where the sky is a strip */
  let cr=0;
  for(let a=0;a<240&&cr<12;a++){
    const th=hash2(a*3.7,Rg.sd*1.3)*6.283, rr=Rg.R*Math.sqrt(hash2(Rg.sd*2.1,a*1.9))*0.75;
    const cx2=Rg.x+Math.cos(th)*rr, cz2=Rg.z+Math.sin(th)*rr;
    const ix=Math.floor(cx2/B), iz=Math.floor(cz2/B), c=cell(ix,iz);
    if(!c||c.kind==='wall') continue;
    let hi=0; for(const o of [[2,0],[-2,0],[0,2],[0,-2]]){ const n2=cell(ix+o[0],iz+o[1]); if(n2&&n2.h>hi) hi=n2.h; }
    if(hi-c.h<7) continue;
    const gy=c.h*B, s=2+hash2(ix,iz)*3;
    emitBox(G,cx2-1.1,gy,cz2-1.1,cx2+1.1,gy+B*0.55+s*2.4,cz2+1.1,'glass','glass','glass');
    glows.push({x:cx2,y:gy+s*1.6,z:cz2,c:0xbfe6ff,s:34,o:0.45});
    cr++;
  }
  const g=new THREE.Group();
  for(const mat in G){ const gg=G[mat]; const bg=new THREE.BufferGeometry();
    bg.setAttribute('position',new THREE.Float32BufferAttribute(gg.p,3));
    bg.setAttribute('uv',new THREE.Float32BufferAttribute(gg.uv,2));
    bg.setAttribute('color',new THREE.Float32BufferAttribute(gg.c,3));
    bg.setIndex(gg.i); g.add(new THREE.Mesh(bg,MAT[mat])); }
  for(const q of glows){
    const gm2=new THREE.SpriteMaterial({map:glowTexCv,color:q.c,transparent:true,opacity:q.o,depthWrite:false});
    const gs=new THREE.Sprite(gm2); gs.scale.set(q.s,q.s,1); gs.position.set(q.x,q.y,q.z); g.add(gs); }
  return g;
}
/* ---- THE HANGING OF A SECRET FALL ----
   The land was already raised (fallsShapeAt); this hangs the WATER on it:
   the lip is found where the ground truly breaks, the broad sheet is hung
   from it to the pool, two lesser sheets terrace beside it, white water
   boils along the foot, the lagoon spreads below and a stream runs away
   out of it down the island. All of it minecraft-fashion: square water,
   square foam, and the roar left to the imagination. */
function lmFalls(L){
  const [fx,fz]=llToWorld(L.lat,L.lon);
  let F=null,bd=1e9; for(const q of FALLS){ const d=Math.hypot(q.x-fx,q.z-fz); if(d<bd){bd=d;F=q;} }
  if(!F) return null;
  const G=newG(), glows=[];
  const pxp=F.dz, pzp=-F.dx;
  /* the lip: the boundary along the axis with the greatest single drop */
  let lipS=null, topH=null, best=0;
  for(let s=Math.round(F.R*0.35/B); s>=-Math.round(F.R*0.35/B); s--){
    const ax=F.x+F.dx*s*B, az=F.z+F.dz*s*B;
    const c0=cell(Math.floor(ax/B),Math.floor(az/B));
    const c1=cell(Math.floor((ax-F.dx*B)/B),Math.floor((az-F.dz*B)/B));
    if(!c0||!c1||c0.kind==='wall') continue;
    const drop=c0.h-c1.h;
    if(drop>best){ best=drop; lipS=s; topH=c0.h; }
  }
  if(lipS===null||best<5) return null;    /* this island did not carry the cliff */
  const lipX=F.x+F.dx*(lipS-0.5)*B, lipZ=F.z+F.dz*(lipS-0.5)*B;
  const poolC=cell(Math.floor((F.x-F.dx*F.R*0.28)/B),Math.floor((F.z-F.dz*F.R*0.28)/B));
  const poolY=(poolC?poolC.h:2)*B;
  const sheet=(cx,cz,halfW,topY)=>{
    const ex=Math.abs(pxp)*halfW+Math.abs(F.dx)*0.8, ez=Math.abs(pzp)*halfW+Math.abs(F.dz)*0.8;
    emitBox(G,cx-ex,poolY+0.4,cz-ez,cx+ex,topY,cz+ez,'waterB','waterB','waterB'); };
  sheet(lipX,lipZ,B*4,topH*B+1.2);                                   /* the great sheet */
  sheet(lipX+pxp*B*5.6,lipZ+pzp*B*5.6,B*2,(topH-3)*B+1.0);           /* and its sisters, terraced */
  sheet(lipX-pxp*B*5.6,lipZ-pzp*B*5.6,B*2,(topH-4)*B+1.0);
  /* white water boiling along the foot */
  for(let k=-5;k<=5;k++){
    const wx=lipX+pxp*k*B*0.95-F.dx*B*0.9, wz=lipZ+pzp*k*B*0.95-F.dz*B*0.9;
    const j=hash2(k*3.1,F.x*0.01), hgt=1.6+j*2.6;
    emitBox(G,wx-1.6,poolY+0.2,wz-1.6,wx+1.6,poolY+hgt,wz+1.6,'wool','wool','wool');
  }
  glows.push({x:lipX-F.dx*B,y:poolY+7,z:lipZ-F.dz*B,c:0xeaf6ff,s:64,o:0.30});
  /* the lagoon below */
  { const cx=F.x-F.dx*F.R*0.28, cz=F.z-F.dz*F.R*0.28;
    const ex=Math.abs(F.dx)*F.R*0.24+Math.abs(pxp)*F.R*0.32;
    const ez=Math.abs(F.dz)*F.R*0.24+Math.abs(pzp)*F.R*0.32;
    faceTop(G,'waterB',cx-ex,cz-ez,cx+ex,cz+ez,poolY+1.1,1.0);
    glows.push({x:cx,y:poolY+5,z:cz,c:0x66c8ff,s:80,o:0.25}); }
  /* and the stream running away out of it */
  let sx=F.x-F.dx*F.R*0.5, sz=F.z-F.dz*F.R*0.5, m=0;
  for(let k=0;k<16;k++){
    m+=(hash2(k*1.7,F.z*0.01)-0.5)*1.2;
    const wx=sx-F.dx*k*B*1.4+pxp*m*B, wz=sz-F.dz*k*B*1.4+pzp*m*B;
    const c=cell(Math.floor(wx/B),Math.floor(wz/B));
    if(!c||c.kind==='wall') break;
    faceTop(G,'waterB',wx-B*0.9,wz-B*0.9,wx+B*0.9,wz+B*0.9,c.h*B+0.5,1.0);
  }
  const g=new THREE.Group();
  for(const mat in G){ const gg=G[mat]; const bg=new THREE.BufferGeometry();
    bg.setAttribute('position',new THREE.Float32BufferAttribute(gg.p,3));
    bg.setAttribute('uv',new THREE.Float32BufferAttribute(gg.uv,2));
    bg.setAttribute('color',new THREE.Float32BufferAttribute(gg.c,3));
    bg.setIndex(gg.i); g.add(new THREE.Mesh(bg,MAT[mat])); }
  for(const q2 of glows){
    const gm2=new THREE.SpriteMaterial({map:glowTexCv,color:q2.c,transparent:true,opacity:q2.o,depthWrite:false});
    const gs=new THREE.Sprite(gm2); gs.scale.set(q2.s,q2.s,1); gs.position.set(q2.x,q2.y,q2.z); g.add(gs); }
  return g;
}
const activeLandmarks=new Map(); const LM_SITE=[];
function landmarkSite(idx){ if(LM_SITE[idx]!==undefined) return LM_SITE[idx];
  const L=LANDMARKS[idx]; const [wx,wz]=llToWorld(L.lat,L.lon);
  const ix0=Math.floor(wx/B), iz0=Math.floor(wz/B); let best=null;
  for(let rad=0;rad<40&&!best;rad++) for(let a=0;a<Math.max(1,rad*6)&&!best;a++){
    const th=a/(rad*6||1)*Math.PI*2;
    const jx=ix0+Math.round(Math.cos(th)*rad), jz=iz0+Math.round(Math.sin(th)*rad);
    const cc=cell(jx,jz); if(cc&&cc.kind!=='wall'&&cc.kind!=='floe') best={ix:jx,iz:jz,x:(jx+.5)*B,z:(jz+.5)*B};
  }
  LM_SITE[idx]=best||null; return LM_SITE[idx];
}
function spawnLandmark(i){
  const L=LANDMARKS[i], site=landmarkSite(i);
  if(!site){ activeLandmarks.set(i,{none:true}); return; }
  const y=topY(site.ix,site.iz), x=site.x, z=site.z;
  let g=null;
  if(L.kind==='range'){ g=lmRange(L); if(g) scene.add(g); }
  else if(L.kind==='falls'){ g=lmFalls(L); if(g) scene.add(g); }
  else if(L.kind!=='mount'){
    const G=newG();
    _solidRec=[];                       /* the builder writes its own collision */
    var lmSolids;
    try{ (LM_BUILDERS[L.kind]||lmTemple)(G,x,z,y,L.s,i*77.7); }
    finally{ lmSolids=_solidRec; _solidRec=null; }   /* never left recording */
    g=new THREE.Group();
    for(const mat in G){ const gg=G[mat]; const bg=new THREE.BufferGeometry();
      bg.setAttribute('position',new THREE.Float32BufferAttribute(gg.p,3));
      bg.setAttribute('uv',new THREE.Float32BufferAttribute(gg.uv,2));
      bg.setAttribute('color',new THREE.Float32BufferAttribute(gg.c,3));
      bg.setIndex(gg.i); g.add(new THREE.Mesh(bg,MAT[mat])); }
    if(L.kind==='lighthouse'){                             /* the fire at the top, ever burning */
      const tip=new THREE.Mesh(new THREE.BoxGeometry(3,3,3),torchMat); tip.position.set(x,y+B*15.4,z); g.add(tip);
      const gm2=new THREE.SpriteMaterial({map:glowTexCv,transparent:true,opacity:0.6,depthWrite:false});
      const gs=new THREE.Sprite(gm2); gs.scale.set(60,60,1); gs.position.set(x,y+B*15.6,z); g.add(gs); }
    scene.add(g);
  }
  /* a SECRET place hangs out no banner — it is found, not signposted */
  let label=null;
  if(!L.secret){
    label=makeLabel(L.n,true);
    label.position.set(x, y+(L.kind==='mount'?(L.peak||18)*B+30:B*16+24), z);
    label.scale.set(220,220/6,1);
    scene.add(label);
  }
  activeLandmarks.set(i,{g,label,x,z,
    solids:(typeof lmSolids!=='undefined'&&lmSolids&&lmSolids.length)?lmSolids:null});
}
/* ---- the works of the ancients bar the way ----
   Is the span [yLo,yHi] inside any standing stone of a built landmark near
   (x,z)? Used by the walker, the flyer and the eye alike. The margin keeps
   a body's breadth out of the faces. */
function landmarkSolidAt(x,z,yLo,yHi){
  for(const[,A] of activeLandmarks){ if(!A.solids) continue;
    if(Math.hypot(x-A.x,z-A.z)>420) continue;
    for(const b of A.solids){
      if(x>b.x0-0.8&&x<b.x1+0.8&&z>b.z0-0.8&&z<b.z1+0.8&&yHi>b.y0&&yLo<b.y1) return b; } }
  return null;
}
/* the top of the tallest landmark masonry standing over a point (or a very
   deep nothing where none stands). refY, when given, ignores masonry whose
   FLOOR is above it — a gate's arch and a trilithon's lintel are roofs over
   open air, not ground: the flyer was snapped thirty units up the moment he
   crossed under the Lion Gate, and the camera hopped onto Stonehenge's
   stones each time it swung beneath one. */
function landmarkTopAt(x,z,refY){
  let top=-1e9;
  for(const[,A] of activeLandmarks){ if(!A.solids) continue;
    if(Math.hypot(x-A.x,z-A.z)>420) continue;
    for(const b of A.solids)
      if(x>b.x0&&x<b.x1&&z>b.z0&&z<b.z1&&(refY===undefined||b.y0<=refY)&&b.y1>top) top=b.y1; }
  return top;
}
/* the height of the tallest SOLID standing over a point — the ground, any
   landmark masonry built upon it, and the roofs of the homes. This is what
   the eye must ride over. */
function solidTopAt(x,z,refY){
  const lc=landAtWorld(x,z);
  /* inside a mountain the eye's floor is the floor of the PASSAGE, not the
     summit overhead — floored on the summit the camera was thrown up
     through the roof and out of the hill the moment its man stepped in */
  let t=Math.max(lc?(lc.spans?groundYIn(lc,refY).y:lc.h*B):WATER_Y, landmarkTopAt(x,z,refY));
  const ht=houseTopAt(x,z); if(ht>t) t=ht;
  return t;
}
function updateLandmarks(px,pz){
  for(let i=0;i<LANDMARKS.length;i++){ const L=LANDMARKS[i];
    const [wx,wz]=llToWorld(L.lat,L.lon);
    const d=Math.hypot(px-wx,pz-wz);
    const has=activeLandmarks.has(i);
    if(has){ const A=activeLandmarks.get(i);      /* the name draws near out of the haze */
      /* and never BEFORE the haze gives its ground up — a title floating on
         pure fog betrays a thing the eye cannot yet have */
      const vis=Math.min(1500, scene.fog?scene.fog.far*1.05:1500);
      /* and a landmark's title is no more readable through the sea than a land's */
      const lblOn=namesOn&&!(state.mode==='dive'||_eyeUnder);
      if(A.label) A.label.material.opacity=lblOn?Math.max(0,Math.min(0.95,(vis-d)/700)):0; }
    /* a range's dressing spreads for a mile — and under a flyer's opened
       air every trigger rides out with the fog, so the works of the
       ancients stand whole before his eye can reach them */
    const open=state.mode==='fly'
      ?Math.max(0,Math.min(1,((scene.fog?scene.fog.far:1140)-1700)/1600)):0;
    const trig=((L.kind==='range')?2600:1600)*(1+open*0.8);
    if(d<trig&&!has) spawnLandmark(i);
    else if(d>trig+500&&has){ const A=activeLandmarks.get(i);
      if(A.g){ scene.remove(A.g); A.g.traverse(o=>{ if(o.geometry) o.geometry.dispose(); }); }
      if(A.label){ scene.remove(A.label);
        if(A.label.material.map) A.label.material.map.dispose(); A.label.material.dispose(); }
      activeLandmarks.delete(i); }
  }
}

/* ================= NAME BANNERS ================= */
const labelCache=new Map(); const shownLabels=new Map(); let namesOn=true;
function makeLabel(text,gold){
  const W=1024, H=170;
  const c=texCanvas(W,H);
  const g=c.getContext('2d'); g.textAlign='center'; g.textBaseline='middle';
  const t=text.toUpperCase();
  /* ---- A NAME IS WRITTEN TO FIT ITS BANNER ----
     The letters were set at one fixed size on a canvas of one fixed width, so
     any name longer than about twenty characters ran off both ends of it and
     was CUT: "TEMPLE OF KARNAK AT NO" arrived as "EMPLE OF KARNAK AT N". The
     name is measured now and the hand shrinks to suit — the banner keeps its
     size on the shore, and the long names are simply written smaller, as they
     would be on a real signboard. */
  let size=74;
  const PAD=34, ROOM=W-PAD*2;
  g.font='600 '+size+'px Georgia,serif';
  const w0=g.measureText(t).width;
  if(w0>ROOM){ size=Math.max(26,Math.floor(size*ROOM/w0));
    g.font='600 '+size+'px Georgia,serif'; }
  g.shadowColor='rgba(0,0,0,0.85)'; g.shadowBlur=16;
  g.lineWidth=Math.max(4,size*0.135); g.strokeStyle='rgba(5,7,15,0.9)'; g.strokeText(t,W/2,85);
  g.fillStyle=gold?'#e8c66a':'#efe6cf'; g.fillText(t,W/2,85);
  const sm=new THREE.SpriteMaterial({map:new THREE.CanvasTexture(c),fog:false,transparent:true,depthWrite:false,depthTest:false});
  const sp=new THREE.Sprite(sm); sp.scale.set(300,50,1); return sp;
}
function updateLabels(px,pz){
  /* A NAME ONLY WHERE THERE IS A LAND TO BEAR IT. The names reached 6,000
     units while the fog now ends the played world at ~740 — so the titles of
     unseen countries hung on empty haze, betraying land the eye cannot have.
     A name is shown only within the fog's own reach (which opens when the
     eye rises or draws back, and the names open with it). */
  const vis=Math.min(6000, scene.fog?scene.fog.far*1.05:6000);
  const fade=Math.max(380,vis*0.27);
  /* ---- AND NO NAME IS READ THROUGH THE SEA ----
     The banners are drawn over everything (no depth test), so from under the
     waves the titles of the lands hung in the water itself. The names belong
     to the air: the moment the eye goes beneath the surface they are gone,
     and they come back with the sky. */
  const under=state.mode==='dive'||_eyeUnder;
  for(let i=0;i<COUNTRIES.length;i++){
    const site=SITES[i], c=COUNTRIES[i].c;
    const wx=site?site.x:c[0]*R_WORLD, wz=site?site.z:c[1]*R_WORLD;
    const d=Math.hypot(px-wx,pz-wz);
    const want=namesOn&&!under&&d<vis;
    const has=shownLabels.has(i);
    if(want&&!has){ let sp=labelCache.get(i);
      if(!sp){ sp=makeLabel(COUNTRIES[i].n,false); labelCache.set(i,sp); }
      const y=site?topY(site.ix,site.iz):WATER_Y;
      sp.position.set(site?site.x:wx, y+96, site?site.z:wz);
      scene.add(sp); shownLabels.set(i,sp); }
    else if(!want&&has){ scene.remove(shownLabels.get(i)); shownLabels.delete(i); }
    if(shownLabels.has(i)){ const sp=shownLabels.get(i);
      const op=Math.max(0,Math.min(1,(vis-d)/fade));
      sp.material.opacity=op*0.95; const sc=Math.max(200,Math.min(900,d*0.16));
      sp.scale.set(sc,sc/6,1); }
  }
  /* the holy city's name is CACHED like every other, in labelCache under -1.
     It alone was built fresh each time it was wanted — and it is wanted again
     every time the names are turned off and on, and every time the traveller
     goes under the sea and comes up — so each of those left a whole canvas
     texture behind it on the card, for ever. */
  if(yahruPos&&namesOn&&!under){ if(!shownLabels.has(-1)){
      let sp=labelCache.get(-1);
      if(!sp){ sp=makeLabel('Yahrushalayim',true); labelCache.set(-1,sp); }
      sp.position.set(yahruPos.x,topY(yahruPos.ix,yahruPos.iz)+120,yahruPos.z);
      scene.add(sp); shownLabels.set(-1,sp); } }
  else if(shownLabels.has(-1)&&(!namesOn||under)){ scene.remove(shownLabels.get(-1)); shownLabels.delete(-1); }
}

/* ================= CONTROLS ================= */
const keys={};
addEventListener('keydown',e=>{ keys[e.code]=true;
  if(!running) return;                        /* the title screen is not the helm — no mode changes before the voyage begins */
  /* ---- A LONG SCENE MUST BE ESCAPABLE ----
     Fourteen seconds may be sat through; two minutes may not, and a film
     nobody can leave is a trap rather than a gift. Any of ESC, F or SPACE
     ends the passage and gives the world straight back. */
  if(cut&&(e.code==='Escape'||e.code==='KeyF'||e.code==='Space')){
    e.preventDefault(); endScene(); return; }
  /* P (or ESC, outside a scene) pauses the whole game and gives it back */
  if(e.code==='KeyP'||(e.code==='Escape'&&!cut)){ e.preventDefault(); togglePause(); return; }
  if(gamePaused) return;                      /* a paused world takes no orders */
  /* a scene has the body: ESC/F/SPACE (above) leave it, and NOTHING else
     acts — M used to lay the chart over the letterbox, G took flight in
     the middle of the film, Q cast a spear through it */
  if(cut) return;
  /* while the whole earth is beheld, the only orders are the view's own:
     ESC/P (above) pauses, and the rest of the world's verbs — going ashore,
     flying, diving, the spear, the net — are not taken from behind the map.
     They used to run underneath it: C set the diver draining breath under
     the overlay, G took flight, E went ashore, all unseen. */
  if(state.firm){ if(e.code==='KeyM') toggleMap(); if(e.code==='KeyL') toggleLog(); return; }
  if(e.code==='Space'){ e.preventDefault(); if(state.mode==='walk') state.walk.jumpReq=true; }
  if(e.code==='KeyE') toggleAshore();
  if(e.code==='KeyF') interact();
  if(e.code==='KeyQ') throwSpear();
  if(e.code==='KeyN') toggleNet();
  if(e.code==='KeyG'){ if(roamOnly()) takeFlight(); }   /* free roam only */
  if(e.code==='KeyC') enterDive();           /* dive the deep / surface */
  if(e.code==='KeyM') toggleMap();
  if(e.code==='KeyK'){ if(roamOnly()) cycleSeason(); }  /* free roam only */
  if(e.code==='KeyT') setTorch(!TORCH.on);   /* strike a light, and put it out */
  if(e.code==='KeyL') toggleLog(); });
addEventListener('keyup',e=>{ keys[e.code]=false; });
const cv=$('cv'); let drag=null, joy=null;
const tpts=new Map(); let pinchD=0;      /* two-finger pinch state */
/* ---- THE FULL SWEEP OF THE EYE ----
   The view turns the whole way round (yaw is unbounded), and the pitch runs
   from looking DOWN upon the traveller to looking UP past him at the sky and
   the firmament — the old floor of 0.04 kept the eye forever above the
   horizon, and the vault overhead could never be looked at from the ground.
   (The camera itself is kept out of the ground by cameraTick, not by
   narrowing the drag.) In the firmament view the disc is the whole sight, so
   there the pitch keeps to the upper half. */
const PITCH_MIN=-1.25, PITCH_MAX=1.52;
function pitchClamp(v){ const lo=state.firm?0.05:PITCH_MIN;
  return Math.max(lo,Math.min(PITCH_MAX,v)); }
cv.addEventListener('pointerdown',e=>{ cv.setPointerCapture(e.pointerId);
  if(e.pointerType==='touch'){
    tpts.set(e.pointerId,[e.clientX,e.clientY]);
    /* two fingers are a PINCH only when neither is the walking-stick: with
       the joystick held, a second finger is the LOOKING finger — walk and
       turn the view at once, as every telephone game has it. And the other
       way about: mid-LOOK, a second finger planted in the stick's own
       corner takes the stick (it used to become a pinch, so look-then-walk
       was impossible in that order). */
    if(tpts.size===2&&!joy){
      const stickZone=!state.firm&&e.clientX<innerWidth*0.42&&e.clientY>innerHeight*0.35;
      if(!(stickZone&&drag)){ const a=[...tpts.values()];
        pinchD=Math.hypot(a[0][0]-a[1][0],a[0][1]-a[1][1]); drag=null;
        return; } }
  }
  /* no walking-stick under the firmament view — a touch there is a LOOK or
     a TAP on a land (the joystick used to swallow every tap in the lower
     left of the map, so a phone could never travel to half the world) */
  if(e.pointerType==='touch'&&!joy&&!state.firm&&e.clientX<innerWidth*0.42&&e.clientY>innerHeight*0.35){
    joy={id:e.pointerId,x0:e.clientX,y0:e.clientY,dx:0,dy:0};
    const j=$('joy'); j.style.display='block'; j.style.left=(e.clientX-52)+'px'; j.style.top=(e.clientY-52)+'px';
  } else if(!drag){ drag={id:e.pointerId,x:e.clientX,y:e.clientY,mv:0,vx:0,vy:0,t:performance.now()};
    state.camYawVel=0; state.camPitchVel=0; } });
cv.addEventListener('pointermove',e=>{
  if(e.pointerType==='touch'&&tpts.has(e.pointerId)){
    tpts.set(e.pointerId,[e.clientX,e.clientY]);
    if(tpts.size===2&&pinchD){ const a=[...tpts.values()];
      const nd=Math.hypot(a[0][0]-a[1][0],a[0][1]-a[1][1])||1;
      const f=pinchD/nd; pinchD=nd;
      if(state.firm){ state.firmDist=Math.max(R_WORLD*0.12,Math.min(R_WORLD*2.4,state.firmDist*f));
        if(state.firmDist<=R_WORLD*0.125&&f<1) exitFirm(); }
      else state.zoom=Math.max(0,Math.min(1,state.zoom+Math.log(f)*0.18));
      return; }
  }
  if(joy&&e.pointerId===joy.id){ joy.dx=Math.max(-60,Math.min(60,e.clientX-joy.x0));
    joy.dy=Math.max(-60,Math.min(60,e.clientY-joy.y0));
    const k=$('joyk'); k.style.transform='translate('+joy.dx*0.55+'px,'+joy.dy*0.55+'px)'; return; }
  if(drag&&e.pointerId===drag.id){ const ddx=e.clientX-drag.x, ddy=e.clientY-drag.y;
    drag.mv+=Math.abs(ddx)+Math.abs(ddy);
    state.camYaw-=ddx*0.0048;
    state.camPitch=pitchClamp(state.camPitch+ddy*0.004);
    /* the pace of the finger, remembered for the glide when it lifts —
       smoothed over the last few moves so one long coalesced event or one
       short one does not swing it wildly. drag.iv is the beat of the move
       events themselves (they ride the frame clock), so stillness can be
       judged in FRAMES and not in milliseconds, whatever the machine. */
    const now=performance.now(), dtm=Math.max(8,now-drag.t)/1000;
    drag.iv=(drag.iv||dtm*1000)*0.6+dtm*1000*0.4;
    drag.vx=drag.vx*0.5-(ddx*0.0048/dtm)*0.5;
    drag.vy=drag.vy*0.5+(ddy*0.004/dtm)*0.5; drag.t=now;
    drag.x=e.clientX; drag.y=e.clientY; } });
function endPtr(e){ if(joy&&e.pointerId===joy.id){ joy=null; $('joy').style.display='none'; $('joyk').style.transform=''; }
  tpts.delete(e.pointerId); if(tpts.size<2) pinchD=0;
  if(drag&&e.pointerId===drag.id){ const tap=drag.mv<8; const d=drag; drag=null;
    /* a flick SLIDES: the view keeps the finger's pace and glides to rest.
       A finger that truly STOPPED before lifting hands over none — but that
       stillness is judged by cameraTick decaying the remembered pace while
       the pointer holds still (measured in the machine's own frames), so a
       laboured frame never eats an honest flick. */
    if(!tap){
      state.camYawVel  =Math.max(-6,Math.min(6,d.vx));
      state.camPitchVel=Math.max(-4,Math.min(4,d.vy)); }
    if(tap&&state.firm&&running) firmTravel(e); }
  /* a pinch let go one finger at a time: the finger still down carries
     straight on as a look-drag, never as a stray tap */
  if(!drag&&!joy&&tpts.size===1){ const [pid,pt]=[...tpts.entries()][0];
    drag={id:pid,x:pt[0],y:pt[1],mv:99,vx:0,vy:0,t:performance.now()}; } }
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
  /* one notch of the wheel is a fixed, small step along the zoom — whatever
     units the browser chooses to report it in (pixels, lines or pages) */
  const unit=e.deltaMode===1?16:e.deltaMode===2?innerHeight:1;
  state.zoom=Math.max(0,Math.min(1,state.zoom+e.deltaY*unit*0.00028)); },{passive:false});
function axis(){
  /* the helm takes no orders while the whole earth is beheld — WASD used to
     sail the ship BLIND under the map view, the camera pinned to the disc
     while the hull ran on toward whatever coast lay ahead */
  if(state.firm) return [0,0];
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
/* is this point within a merchantman's hull? (her true footprint, in her own
   frame). The ship used to sail clean THROUGH a passing trader. */
function insideTraderHull(x,z,margin){
  for(const T of TRADERS){ if(!T.set) continue;
    if(Math.hypot(x-T.x,z-T.z)>110) continue;
    const c=Math.cos(T.h), sn=Math.sin(T.h);
    const dx=x-T.x, dz=z-T.z;
    const lx=dx*c-dz*sn, lz=dx*sn+dz*c;
    if(Math.abs(lx)<15+(margin||0)&&Math.abs(lz)<46+(margin||0)) return T; }
  return null;
}
function boatTick(dt,helm){
  const bt=state.boat; const [f,t]=helm?axis():[0,0];
  const st=stormAt(bt.x,bt.z);
  seaTime=performance.now()*0.001; seaAmp=1+st*1.7;    /* fix the sea for this frame */
  const target=f*40*SPEEDS[state.speedIdx][2]*sailFactor(bt.heading)*(1-0.45*st)*(state.net?0.72:1);
  bt.speed+=(target-bt.speed)*Math.min(1,dt*1.2);
  if(Math.abs(bt.speed)>0.4) bt.heading+=t*dt*(0.85+Math.min(1,Math.abs(bt.speed)/22)*0.6);
  const nx=bt.x+Math.sin(bt.heading)*bt.speed*dt, nz=bt.z+Math.cos(bt.heading)*bt.speed*dt;
  /* probe ahead of the motion: the bow when sailing, the stern when reversing */
  const sgn=bt.speed>=0?1:-1;
  const fX=Math.sin(bt.heading), fZ=Math.cos(bt.heading);
  const bowX=nx+fX*44*SHIP_S*sgn, bowZ=nz+fZ*44*SHIP_S*sgn;
  /* she is a BROAD ship: probe bow, waist and both beams (and the bow
     quarters), so neither flank ever ploughs through a shore or skerry */
  const rX=Math.cos(bt.heading)*7.2*SHIP_SX, rZ=-Math.sin(bt.heading)*7.2*SHIP_SX;   /* the true half-beam of the broad hull */
  const qX=nx+fX*24*SHIP_S*sgn, qZ=nz+fZ*24*SHIP_S*sgn;
  const clear=!blockedForBoat(bowX,bowZ)&&!blockedForBoat(nx,nz)
    &&!blockedForBoat(nx+rX,nz+rZ)&&!blockedForBoat(nx-rX,nz-rZ)
    &&!blockedForBoat(qX+rX,qZ+rZ)&&!blockedForBoat(qX-rX,qZ-rZ)
    /* nor may she plough through a merchantman — the bow probe fetches up
       against a passing trader's hull as it does against a skerry. But a
       ship ALREADY overlapped (the trader crossed a stationary player) may
       always move: without the escape clause she was pinned in the hull
       until the merchantman happened to sail off her. */
    &&(insideTraderHull(bt.x,bt.z,10)?true
       :(!insideTraderHull(bowX,bowZ,10)&&!insideTraderHull(nx,nz,10)));
  if(clear){ state.dist+=Math.hypot(nx-bt.x,nz-bt.z); bt.x=nx; bt.z=nz; }
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
/* the ridge of any house roof standing over a point — for the EYE, which
   must ride over the homes as it rides over the ground and the ancients'
   stones, instead of passing through their walls and rafters. The band is
   the WALLS' footprint and a hand's breadth, NOT the eave: an eye drawn in
   just clear of the wall must stand on open ground, or the camera-floor
   would hoist it onto the roof from under the overhang and the whole frame
   would be rafters again. */
function houseTopAt(x,z){
  let top=-1e9;
  const scan=arr=>{ for(const H of arr){
    if(x>H.x0-0.4&&x<H.x1+0.4&&z>H.z0-0.4&&z<H.z1+0.4){
      const t=H.top!==undefined?H.top:(H.door?H.door.y:0)+B*6.5;
      if(t>top) top=t; } } };
  for(const[,vv] of activeVillages){ if(!vv.houses||!vv.site) continue;
    if(Math.hypot(x-vv.site.x,z-vv.site.z)>420) continue; scan(vv.houses); }
  scan(standaloneHouses);
  return top;
}
/* the crown of the tree standing on a cell — an envelope over the flora's
   true builds, near enough that the eye keeps out of the leaves. The stature
   is drawn from the same hashes the mesher grows the tree by. */
function treeTopAt(x,z,c){
  const ix=Math.floor(x/B), iz=Math.floor(z/B);
  const q=hash2(ix*0.73+11.3,iz*0.91-5.7);
  const S=0.62+Math.pow(q,0.55)*1.25+(hash2(ix*3.1,iz*2.3)>0.965?0.85:0);
  return c.h*B+B*6.0*S;
}
/* the well, hay-bales and pens block the way */
/* ---- A BODY HAS WIDTH ----
   This tested the walker's CENTRE POINT against the standing thing's radius
   and nothing else, so a villager could bring her middle to within a hair of
   a stall post and stand there with half her shoulders inside it — which is
   the clipping seen all over the market. Every walker now keeps its own bulk
   clear, as it does of every other body (see blockedByEntity, which has
   always added exactly this). */
function blockedBySolid(nx,nz,pad){
  const P=(pad===undefined)?1.5:pad;
  for(const[,vv] of activeVillages){ if(!vv.solids||!vv.site) continue;
    if(Math.hypot(nx-vv.site.x,nz-vv.site.z)>420) continue;
    for(const s of vv.solids) if(Math.hypot(nx-s.x,nz-s.z)<s.r+P) return true;
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
/* ================= THE SADDLE =================
   Players wanted to RIDE. Walk up to a horse, a donkey or a camel of the
   open country, and F swings you up: the beast becomes your mount, the
   walking keys become its reins, and it carries you at a canter twice a
   man's stride. F again puts you down — and the beast is not despawned
   like a used tool: it takes a wild slot again and wanders off to graze,
   the same animal, back about its own business. A horse will not swim:
   ride into the sea and you part company at the water's edge. */
const RIDEABLE={horse:1,donkey:1,camel:1,mule:1};
let promptMount=null;
function nearestMount(px,pz){ let best=null,bd=1e9;
  for(const a of LANDLIFE){ if(!a.set||a.dead>0||!RIDEABLE[a.kind]) continue;
    const d=Math.hypot(a.x-px,a.z-pz); if(d<9&&d<bd){ bd=d; best=a; } }
  return best; }
function mountUp(a){
  if(!a||state.mount) return;
  a.set=false; a.m.visible=false; hideYoung(a);
  const m=makeAnimal(a.kind);
  /* saddled for the road: blanket, seat and girth, set at the beast's own back */
  { const bu=beastUnits(a.kind), by=bu*0.74;
    const blanket=lbox(4.4,0.5,5.6,0x8a3030); blanket.position.set(0,by,-0.3); m.add(blanket);
    const seat=lbox(3.4,1.1,4.4,0x5a3a22); seat.position.set(0,by+0.6,-0.3); m.add(seat);
    const pommel=lbox(1.0,1.0,1.0,0x4a2f1c); pommel.position.set(0,by+1.3,1.6); m.add(pommel);
    for(const s of [1,-1]){ const girth=lbox(0.4,bu*0.5,0.5,0x4a2f1c);
      girth.position.set(s*2.1,by-bu*0.25,-0.3); m.add(girth); } }
  scene.add(m);
  state.mount={kind:a.kind,m};
  state.walk.heading=a.heading;
  toast('You swing up onto the '+a.kind+' — ride with the walking keys, and F sets you down again.');
}
function dismount(quiet){
  const M=state.mount; if(!M) return; state.mount=null;
  /* the beast goes back to the wild — a free slot, standing where you left it */
  for(const a of LANDLIFE){ if(a.set) continue;
    if(a.m){ scene.remove(a.m); freeTree(a.m); }   /* the slot's own stale beast */
    /* a free slot may still be HOLDING young from its last life — they were
       only hidden at the reap, and nulling the field bare leaked their
       meshes into the scene for ever. setYoung removes them properly. */
    setYoung(a,false);
    a.m=M.m; a.kind=M.kind; a.set=true;
    a.x=a.hx=a.tx=state.walk.x+Math.sin(state.walk.heading+1.6)*5;
    a.z=a.hz=a.tz=state.walk.z+Math.cos(state.walk.heading+1.6)*5;
    a.heading=state.walk.heading; a.role='graze'; a.job='roam'; a.jt=1+Math.random()*2;
    a.dead=0; a.den=null; a.act=null; a.burst=0; a.fear=0; a.panicT=0; a.upTree=0;
    a.day='day'; a.river=false; a.ph=Math.random()*6.283;
    a.m.visible=true; M.m=null; break; }
  if(M.m){ scene.remove(M.m); freeTree(M.m); }   /* no slot free — it slips away, and is given back */
  if(!quiet) toast('You dismount, and the beast falls to grazing.');
}
function canSleep(){ if(state.mode!=='walk'||!HOME||worldNight<=0.45) return false;
  /* inside the room among the boughs, OR standing at the foot of the home tree
     (the platform is high in the canopy and hard to gain, so the base serves) */
  return insideHouse(state.walk.x,state.walk.z)===HOME.house
      || Math.hypot(state.walk.x-HOME.x,state.walk.z-HOME.z) < B*5; }
function sleep(){
  const day=Math.floor(state.simHours/24);
  state.simHours=(day+1)*24+7;                    /* wake at seven, next morning */
  /* ON THE LIVE CLOCK, SLEEP HELD NOTHING: the machine's own hour is re-read
     four times a second and snapped the sky straight back to real night —
     'wake to a new morning' with no morning in it. Lying down to sleep is
     the traveller choosing the game's morning over the room's night, so the
     course is set to 'morning' and the hour truly holds. */
  /* and from EVERY course of the day, not only 'live' — applyDayPart()
     re-asserts the preset's own hour, so sleeping on the 'night' preset
     woke you into the same night it promised you out of */
  { const mi=DAYPARTS.findIndex(d2=>d2.k==='morning');
    if(state.dayIdx!==mi){ state.dayIdx=mi; updateDayBtn(); } }
  applyDayPart();
  toast('You rest in your home among the boughs, and wake to a new morning.');
  saveState();
}
function interact(){
  if(state.firm) return;                        /* no verbs from behind the map view */
  if(tradeOpen){ closeTrade(); return; }        /* F also leaves the trading */
  switch(promptAction){
    case 'scroll': takeScroll(promptScroll); updateGuideBtn(); break;
    case 'dome': touchDome(); break;
    case 'sleep': sleep(); break;
    case 'door': toggleDoor(); break;
    case 'down': state.deck.level='hold'; state.deck.lx=0; state.deck.lz=HATCH.z; break;
    case 'up': state.deck.level='deck'; state.deck.lx=2.4*SHIP_SX; state.deck.lz=HATCH.z+3*SHIP_S; break;
    case 'ride': mountUp(promptMount); break;
    case 'dismount': dismount(false); break;
    case 'speak': speakTo(promptPerson); break;
    case 'enc': encounterAct(); break;
    case 'fish': startFishing(); break;
    case 'reel': reelIn(); break;
    case 'pearl': { const P=promptPearl; if(!P) break;
      pearlTaken.add(P.key); P.key=null; P.m.visible=false;
      state.pearls=(state.pearls||0)+1;
      toast('\u201cThe price of wisdom is above pearls\u201d \u2014 yet this one will fetch good silver at any market. Pearls gathered: '+state.pearls+'.','IYOB 28:18');
      saveState(); break; }
    case 'chest': { const w=promptChest; if(!w) break;
      const key=w.userData.key; wreckLooted.add(key);
      const gain=30+Math.floor(hash2(w.position.x*0.13,w.position.z*0.17)*50);
      state.coins+=gain; w.userData.chest.visible=false;
      toast('You break open the sea-chest \u2014 '+gain+' shekels of old silver, given up by the deep. Purse: '+state.coins+'.');
      saveState(); break; }
    case 'trade': { const st=promptStall;
      const cty=cityFor(st.i);
      openTrade(st.i,'the market of '+(cty?cty.name+', ':'')+COUNTRIES[st.i].n,false); break; }
    case 'hail': { const h=promptTrader; h.T.halt=25; tradeShip=h.T;
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
/* ================= THE GROUND UNDER A POINT IN THE AIR =================
   The whole of the walker's world used to be one number a column: the
   surface. With the hollow places cut into the earth that is no longer the
   question — the question is what is solid UNDER THIS HEIGHT and what is
   solid OVER IT, and the answer inside a mountain is not the mountain top.

   `refY` is the height the asking body stands at. Given none, the surface
   is meant and the answer is exactly what it always was — which is why the
   fifty other callers of this needed no change at all.

   The runs come sorted, so this walks them from the top down and stops at
   the first one it is at or inside. It is two comparisons for the common
   carved column and NOT ENTERED AT ALL for a column that is not carved. */
function groundYIn(c,refY){
  if(!c.spans||refY===undefined) return {y:c.h*B, ceil:Infinity};
  const sp=c.spans, ry=refY/B;
  let y=c.h*B, ceil=Infinity;
  for(let i=sp.length-2;i>=0;i-=2){
    const lo=sp[i], hi=sp[i+1];
    if(ry>=hi) break;               /* above this hollow: the rock over it is the ground */
    y=lo*B; ceil=hi*B;              /* on the floor of this hollow, with its roof above */
    if(ry>=lo) break;               /* and truly inside it */
  }
  return {y,ceil};
}
/* ---- AND WHERE A HAND HAS BEEN, THE COLUMN IS WALKED ----
   The procedural answer is arithmetic on a sorted list. An edited column has
   no such shape — a man may leave a block hanging in mid air forty above the
   ground and a shaft cut two hundred below it — so that one is WALKED, block
   by block, from the asking height. It is bounded, and it is entered only by
   a column somebody has actually touched. */
const EDIT_SCAN=140;
function groundYEdited(ix,iz,c,refY){
  const top=(refY===undefined)?((c?c.h:0)+2):Math.floor(refY/B);
  let y=top, floor=null;
  for(let k=0;k<EDIT_SCAN&&y>=EY_MIN;k++,y--) if(blockSolidAt(ix,y,iz)){ floor=y; break; }
  let ceil=Infinity;
  let u=(floor===null?top:floor)+1;
  for(let k=0;k<EDIT_SCAN&&u<EY_MAX;k++,u++) if(blockSolidAt(ix,u,iz)){ ceil=u*B; break; }
  return { y:(floor===null?(c?c.h*B:WATER_Y):(floor+1)*B), ceil };
}
function groundInfo(x,z,refY){
  const dk=deckMap.get(Math.floor(x/B)+','+Math.floor(z/B));
  if(dk!==undefined) return {y:dk,land:true};
  const ix=Math.floor(x/B), iz=Math.floor(z/B);
  const c=landAtWorld(x,z);
  const em=EDITS.size?editColumn(ix,iz):null;
  if(em){ const g=groundYEdited(ix,iz,c,refY);
    return {y:g.y, ceil:g.ceil, hollow:true, edited:true, land:true,
      wall:!!(c&&c.kind==='wall')}; }
  if(c){ if(!c.spans) return {y:c.h*B, land:true, wall:c.kind==='wall'};
    const g=groundYIn(c,refY);
    return {y:g.y, ceil:g.ceil, hollow:true, land:true, wall:c.kind==='wall'}; }
  return {y:WATER_Y-2.2, land:false, water:true};
}
/* is this very point inside the rock? The one test every hollow thing in
   the world is judged by, and the one the acceptance tests ask. */
function solidAt(x,y,z){
  return blockSolidAt(Math.floor(x/B),Math.floor(y/B),Math.floor(z/B));
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
const HEAD_R=B*1.9;   /* a man's own height, for the roof of a passage */
const BODY_R=1.9;   /* the traveller's own half-breadth — he is a body, not a point */
function walkTick(dt){
  const w=state.walk, u=walkerG.userData; const [f,t]=axis();
  if(w.feetY===undefined){ w.feetY=groundInfo(w.x,w.z).y; w.vy=0; w.grounded=true; }
  /* ---- a climb in progress: hang, then pull up over the ledge ---- */
  if(w.climb){ const cm=w.climb; cm.t+=dt; const p=Math.min(1,cm.t/cm.dur);
    const e=p<0.5?2*p*p:1-Math.pow(1-p,2);
    w.x=cm.x0+(cm.x1-cm.x0)*p; w.z=cm.z0+(cm.z1-cm.z0)*p; w.feetY=cm.y0+(cm.y1-cm.y0)*e;
    w.stepOff=0;                    /* the climb is its own smooth rise — nothing held back */
    walkerG.position.set(w.x,w.feetY,w.z); walkerG.rotation.y=w.heading;
    const pull=Math.max(0,(p-0.55)/0.45);
    u.armL.rotation.x=-2.5+pull*2.0; u.armR.rotation.x=u.armL.rotation.x;
    u.legL.rotation.x=0.4+pull*1.0; u.legR.rotation.x=0.2;
    if(p>=1){ w.climb=null; w.vy=0; w.grounded=true;
      u.armL.rotation.x=u.armR.rotation.x=u.legL.rotation.x=u.legR.rotation.x=0; }
    return;
  }
  w.heading+=t*dt*2.4;
  const gi=groundInfo(w.x,w.z,w.feetY+0.1);
  /* over water the body SWIMS — no man walks upon the sea. But a body still
     IN THE AIR above the water (a leap off a cliff, a jump from a pier) falls
     under gravity until it truly meets the surface — no mid-air snap-down. */
  const surfY0=WATER_Y+seaHeight(w.x,w.z);
  const swimming=gi.water&&(w.feetY===undefined||w.feetY<=surfY0+0.6);
  /* ---- vertical physics: gravity, landing, the jump, and true buoyancy ----
     In the water the body floats AT the surface and rides the swell — prone
     and stroking when swimming forward, treading upright when at rest. */
  const surfY=WATER_Y+seaHeight(w.x,w.z);
  if(swimming){
    if(state.mount) dismount(true);      /* a horse will not swim — you part at the water's edge */
    if(!w.inWater){
      const plunging=w.vy<-30;
      w.inWater=true; w.spill=0; splash(w.x,surfY+1,w.z,w.vy<-14);
      /* struck the water hard from a height and the water is deep — the body
         drives under, then buoyancy gives it back to the surface */
      if(plunging&&seabedDepth(w.x,w.z)<surfY-10){
        initDeep();
        state.dive.x=w.x; state.dive.z=w.z; state.dive.heading=w.heading;
        state.dive.y=SEA_SURF-3; state.dive.vy=Math.max(-90,w.vy*0.55); state.dive.sp=0;
        state.dive.jump=null;                          /* a plunge is a plunge, not an old leap */
        setMode('dive'); return;
      }
      if(!swimDeepHintShown){ swimDeepHintShown=true;
        toast('You swim the swell — hold SHIFT to slip beneath the waves and dive the deep; make for the shore to haul out.'); } }
    /* hold SHIFT at the surface and slip straight down into the deep —
       the same water, the same place, the bed running from the strand */
    if(keys.ShiftLeft||keys.ShiftRight){ enterDive(); return; }
    /* ---- BUOYANCY, not a weld ----
       The body was pinned to surfY every single frame, so a passing crest
       teleported it and it read as a figure SKATING over the water. A float
       on a spring instead: the swell lifts and drops it with a little lag,
       as a cork rides the sea, and it is bounded so it can neither be flung
       above the crest nor left hanging under it. */
    const rest=surfY-1.0;
    w.vy+=(rest-w.feetY)*26*dt;              /* the water pushes it back to its line */
    w.vy-=w.vy*Math.min(1,7.4*dt);           /* and the water drags that motion down */
    w.vy=Math.max(-46,Math.min(46,w.vy));
    w.feetY+=w.vy*dt;
    /* bounded either side of its line — and the upper bound is kept under
       the swim test's own threshold (surfY+0.6), or the top of a bob would
       drop him out of swimming and into free fall */
    if(w.feetY>rest+0.5){ w.feetY=rest+0.5; if(w.vy>0) w.vy=0; }
    if(w.feetY<rest-4.0){ w.feetY=rest-4.0; if(w.vy<0) w.vy=0; }
    w.grounded=true; w.jumpReq=false;
    /* ---- the water carries him ----
       Not a shove down the slope: a particle in a Gerstner swell travels a
       CIRCLE, so the surface current runs with the wave. It is eased rather
       than applied raw, capped well under a swimmer's own stroke, and mostly
       stilled while he is stroking — the sea sets a resting body adrift, it
       does not sweep a swimming one off his course. */
    const sl=seaSlope(w.x,w.z);
    const stroking=Math.abs(f)>0.15;
    const pull=stroking?2.4:9.0;
    let dxw=-sl.x*pull, dzw=-sl.z*pull;
    const dm=Math.hypot(dxw,dzw);
    if(dm>3.2){ dxw=dxw/dm*3.2; dzw=dzw/dm*3.2; }
    w.driftX=(w.driftX||0)+(dxw-(w.driftX||0))*Math.min(1,dt*2.2);
    w.driftZ=(w.driftZ||0)+(dzw-(w.driftZ||0))*Math.min(1,dt*2.2);
    const px2=w.x+w.driftX*dt, pz2=w.z+w.driftZ*dt;
    if(!groundInfo(px2,pz2).land&&!camInsideShip(px2,surfY,pz2)&&!insideTraderHull(px2,pz2,2)){ w.x=px2; w.z=pz2; }
    /* and he lies along the FACE of the wave — pitch and roll off its slope,
       clamped so a steep crest tilts the body and never tumbles it. A figure
       held bolt upright through a passing swell is the whole look of skating */
    const fwdX=Math.sin(w.heading), fwdZ=Math.cos(w.heading);
    const cl2=(v,m)=>v<-m?-m:v>m?m:v;
    w.wPitch=cl2(-(sl.x*fwdX+sl.z*fwdZ)*2.6,0.32);
    w.wRoll =cl2( (sl.x*fwdZ-sl.z*fwdX)*2.6,0.32);
  }
  else { if(w.inWater){ w.inWater=false; }
    /* (a sprawl is a thing of dry land — water catches him instead) */
    w.driftX=0; w.driftZ=0; w.wPitch=0; w.wRoll=0;   /* out of the water, out of its motion */
    w.vy-=64*dt; w.feetY+=w.vy*dt;
    /* ---- A BODY DOES NOT FALL FASTER THAN IT CAN BE CAUGHT ----
       Off the shoulder of a mountain a thousand units high the fall reached
       hundreds of units a second, and at that speed a frame carries the body
       clean PAST a ledge before anything can test it — which is the whole of
       "he clips through the mountain". The fall is now capped at a speed the
       ground can still be found at, and the step down is walked in slices no
       longer than half a block, so every ledge on the way down is offered to
       him and he stands on the first one that will hold him. */
    if(w.vy<-190) w.vy=-190;
    { const y0=w.feetY-w.vy*dt;          /* where he was before this frame */
      const drop=y0-w.feetY;
      if(drop>B*0.5&&!gi.water){
        const steps=Math.min(24,Math.ceil(drop/(B*0.5)));
        for(let k=1;k<=steps;k++){
          const yk=y0-drop*(k/steps);
          if(yk<=gi.y){ w.feetY=gi.y; break; }
          w.feetY=yk; } } }
    /* land arrests the fall; water does not — the body carries its speed
       through the surface so the plunge can read it */
    /* A JUMP LANDS AT ABOUT -38, and a man is not winded by his own hop —
       only a real drop puts him down. */
    const wasFalling=!w.grounded&&w.vy<-88;
    if(w.feetY<=gi.y&&!gi.water){
      w.feetY=gi.y;
      /* ---- AND HE IS WINDED BY IT ----
         A long drop puts him down hard: he lands sprawled and gathers himself
         up again over a moment, rather than striking the rock at a hundred
         units a second and walking on as though nothing had happened. */
      if(wasFalling&&!w.climb) w.spill=Math.min(1.5,0.45+(-w.vy)/190*1.05);
      w.vy=0; w.grounded=true; } else w.grounded=false;
    if((keys.Space||w.jumpReq)&&w.grounded&&!(w.spill>0)){ w.vy=38; w.grounded=false; } w.jumpReq=false;
    /* ---- AND A ROOF IS A ROOF ----
       In a passage a man may not jump up through the rock over his head.
       Asked only of a column that has actually been hollowed, so nothing
       under the open sky pays a thing for it. */
    if(gi.hollow&&isFinite(gi.ceil)&&w.feetY+HEAD_R>gi.ceil){
      w.feetY=gi.ceil-HEAD_R; if(w.vy>0) w.vy=0; } }
  /* ---- horizontal move, gated by the height of the ground ahead ---- */
  /* mounted, the beast's stride is yours: a canter at twice a man's pace */
  const sp=(w.spill>0&&!swimming)?0:f*(swimming?16:state.mount?38:18);
  const fullX=w.x+Math.sin(w.heading)*sp*dt, fullZ=w.z+Math.cos(w.heading)*sp*dt;
  /* THE BODY IS NOT A POINT. Every test below was made at the traveller's
     midline alone, so he could stand with his centre just inside a cell and
     half of himself buried in the stone beside it — and the face of a wall
     lying between two frames' sample points was walked clean through. His
     whole breadth is tested now, and if the way is barred he SLIDES along
     it (trying each axis alone) instead of sticking fast against it. */
  let nx=fullX, nz=fullZ, tg=groundInfo(nx,nz,w.feetY+0.1), diff=0, solidBlock=false, canGo=false;
  const tryStep=(tx,tz)=>{
    const g2=groundInfo(tx,tz,w.feetY+0.1);
    const d2=g2.y-w.feetY;
    const near2=Math.hypot(tx-state.boat.x,tz-state.boat.z)<90;
    const deck2=deckMap.get(Math.floor(tx/B)+','+Math.floor(tz/B))!==undefined;
    const solid2=blockedByStructure(tx,tz)||treeBlocked(tx,tz)||blockedBySolid(tx,tz)||blockedByEntity(tx,tz,walkerG)
      ||!!landmarkSolidAt(tx,tz,w.feetY+2.2,w.feetY+8);   /* the works of the ancients bar the way */
    let ok=true;
    if(!g2.land) ok = near2||deck2||(Math.hypot(tx,tz)/R_WORLD<0.985)
      ||Math.hypot(tx,tz)<Math.hypot(w.x,w.z);   /* swim; beyond the rim, inward always */
    else if(swimming&&camInsideShip(tx,surfY,tz)&&!camInsideShip(w.x,surfY,w.z)) ok=false;
    else if(d2<=STEP){ /* a small step — walk up or down freely */ }
    else if(swimming && d2<=JUMPH+3){ /* haul out of the water onto the strand */ }
    else if(d2<=JUMPH) ok = w.feetY>=g2.y-B*0.4;   /* two blocks: only if jumping onto it */
    else ok=false;                                  /* higher — climbed, or gone around */
    if(solid2) ok=false;
    /* a merchantman's hull is as solid to a swimmer as the traveller's own */
    if(ok&&swimming&&insideTraderHull(tx,tz,2)&&!insideTraderHull(w.x,w.z,2)) ok=false;
    /* and his shoulders must clear it too, not only his midline */
    if(ok&&!swimming) for(let k=0;k<4;k++){ const aa=k*1.5708;
      const g3=groundInfo(tx+Math.cos(aa)*BODY_R,tz+Math.sin(aa)*BODY_R,w.feetY+0.1);
      if(g3.land&&g3.y-w.feetY>STEP){ ok=false; break; } }
    /* ---- AND HIS HEAD MUST GO WHERE HIS FEET DO ----
       Under the open sky the rise test above is the whole of it: nothing
       stands over a man but air. In a passage it is not — the floor ahead
       may be level with his feet and the rock still come down to his chest.
       Asked only where something has actually been hollowed, so no step,
       no ledge and no climb anywhere else in the world is touched by it. */
    if(ok&&!swimming&&(g2.hollow||gi.hollow||g2.edited||gi.edited)){
      if(solidAt(tx,w.feetY+STEP+1,tz)||solidAt(tx,w.feetY+HEAD_R*0.92,tz)) ok=false; }
    return ok?{g:g2,d:d2,solid:solid2}:null;
  };
  let r0=tryStep(fullX,fullZ);
  if(!r0&&sp!==0){                                  /* barred — slide along the face */
    const rx=tryStep(fullX,w.z);
    if(rx){ nz=w.z; r0=rx; }
    else { const rz=tryStep(w.x,fullZ); if(rz){ nx=w.x; r0=rz; } }
  }
  if(r0){ canGo=true; tg=r0.g; diff=r0.d; solidBlock=r0.solid; }
  else { nx=fullX; nz=fullZ; tg=groundInfo(nx,nz); diff=tg.y-w.feetY;
    solidBlock=blockedByStructure(nx,nz)||treeBlocked(nx,nz)||blockedBySolid(nx,nz)||blockedByEntity(nx,nz,walkerG)
      ||!!landmarkSolidAt(nx,nz,w.feetY+2.2,w.feetY+8);
    /* three or four blocks of rock is not a wall but a ledge — he climbs it */
    if(tg.land&&diff>JUMPH&&diff<=CLIMBH&&f>0.3&&w.grounded&&!solidBlock&&!w.climb)
      w.climb={t:0,dur:0.8, x0:w.x,z0:w.z,y0:w.feetY,
        x1:nx+Math.sin(w.heading)*B*0.6, z1:nz+Math.cos(w.heading)*B*0.6, y1:tg.y};
  }
  const _fy0=w.feetY;                    /* the height he stood at before the step */
  if(canGo){ state.dist+=Math.hypot(nx-w.x,nz-w.z); w.x=nx; w.z=nz;
    /* snap small steps — but NEVER onto open water. groundInfo hands back a
       FLAT WATER_Y-2.2 for every wave in the sea, so this line was pinning
       the swimmer to a dead level plane every frame, overwriting whatever
       height the swell had given him. That is the whole of the skating: a
       body held at one fixed height while the waves ran through it. Over
       water his buoyancy rules; snapping resumes the moment he touches land
       (so he may still haul out onto the strand). */
    if(w.grounded && (!swimming||tg.land) && diff>=-B*3 && diff<=(swimming?JUMPH+3:STEP)) w.feetY=tg.y; }
  /* ---- AND THE STEP IS NOT A JOLT ----
     The ground of this world is cut in whole blocks, so the height under a
     traveller's feet does not RISE as he walks — it JUMPS, seven units at a
     stride going up and as much as three blocks going down. His feet were
     set straight onto it and his body drawn there the same frame; and the
     eye, which takes its height from the body, was thrown up and down the
     face of every rock and every mountain skirt he walked beside. That is
     the shaking, and it was never a collision at all — only the ground
     arriving all at once.

     Nothing of the walking is changed: his feet still stand exactly where
     the rock puts them, and every test of what bars the way, what may be
     stepped up, jumped or climbed, is the same. What is changed is the
     DRAWING of him. The height he was lifted or dropped by is held back as
     an offset and paid off over about a tenth of a second, so the body
     rides up a step instead of being snapped up it. A fall is not touched —
     this is only ever a step taken while he is on his feet. */
  { const rise=w.feetY-_fy0;
    if(rise!==0&&w.grounded&&!swimming&&Math.abs(rise)<=B*3.2){
      const cap=B*3.2;
      w.stepOff=(w.stepOff||0)+rise;
      w.stepOff=w.stepOff>cap?cap:w.stepOff<-cap?-cap:w.stepOff; } }
  w.stepOff=(w.stepOff||0)*Math.max(0,1-dt*13);
  if(Math.abs(w.stepOff)<0.02) w.stepOff=0;
  walkerG.position.set(w.x,w.feetY,w.z); walkerG.rotation.y=w.heading;
  /* ---- animation ---- */
  const moving=Math.abs(sp)>0.5;
  if(swimming){ const s=performance.now()*0.008;
    const prone=Math.abs(f)>0.15;                        /* stroking forward, or treading */
    walkerG.rotation.x=(prone?1.30+Math.sin(s*0.7)*0.05:0.22)+(w.wPitch||0);
    walkerG.rotation.z=w.wRoll||0;                       /* heeled over with the wave's face */
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
  } else if(!w.grounded){
    /* ---- THE JUMP, AND THE FALL ----
       A hop off a step and a drop off a mountain shoulder are not the same
       thing. Up to a little way he keeps the tidy jump pose; past that the
       body knows it is FALLING, and he wheels his arms and kicks for ground
       that is not there — faster the longer he has been dropping. */
    walkerG.rotation.z=0;
    const fall=Math.max(0,Math.min(1,(-w.vy-30)/110));
    if(fall<=0.001){                                    /* the tidy little jump */
      walkerG.rotation.x=0; u.armL.rotation.z=0; u.armR.rotation.z=0;
      u.legL.rotation.x=0.55; u.legR.rotation.x=-0.3;
      u.armL.rotation.x=-0.7; u.armR.rotation.x=-0.7;
    } else {                                            /* windmilling for his life */
      const fp=performance.now()*(0.012+fall*0.024);
      walkerG.rotation.x=-0.30*fall+Math.sin(fp*0.6)*0.10*fall;
      u.armL.rotation.x=-2.5-Math.sin(fp)*1.5*fall;
      u.armR.rotation.x=-2.5+Math.sin(fp+2.1)*1.5*fall;
      u.armL.rotation.z= 0.55*fall+Math.sin(fp*0.8)*0.35*fall;
      u.armR.rotation.z=-0.55*fall-Math.sin(fp*0.8+1.0)*0.35*fall;
      u.legL.rotation.x= 0.75*fall+Math.sin(fp*1.1)*0.55*fall;
      u.legR.rotation.x=-0.45*fall-Math.sin(fp*1.1)*0.55*fall;
    }
  } else if(w.spill>0){
    /* ---- AND HE GATHERS HIMSELF UP AGAIN ----
       Down on the rock where he struck it, and rising slowly out of it: first
       sprawled flat with his arms flung out, then pushing up on them, then
       standing. He cannot walk or jump until he is on his feet. */
    w.spill=Math.max(0,w.spill-dt);
    const p=1-Math.min(1,w.spill/1.5);                  /* 0 just down … 1 up again */
    const rise=Math.max(0,(p-0.35)/0.65);
    const e=rise*rise*(3-2*rise);
    walkerG.rotation.x=(1.30)*(1-e);                    /* flat, then upright */
    walkerG.rotation.z=0;
    walkerG.position.y=w.feetY-5.6*(1-e);               /* sprawled low, then standing */
    u.armL.rotation.x=-2.30+e*2.30; u.armR.rotation.x=-2.30+e*2.30;
    u.armL.rotation.z= 0.95*(1-e);   u.armR.rotation.z=-0.95*(1-e);
    u.legL.rotation.x= 0.55*(1-e);   u.legR.rotation.x=-0.35*(1-e);
  } else { const ph=performance.now()*0.011;
    walkerG.rotation.x=0; walkerG.rotation.z=0; u.armL.rotation.z=0; u.armR.rotation.z=0;
    u.legL.rotation.x=moving?Math.sin(ph)*0.7:0; u.legR.rotation.x=moving?-Math.sin(ph)*0.7:0;
    u.armL.rotation.x=moving?-Math.sin(ph)*0.5:0; u.armR.rotation.x=moving?Math.sin(ph)*0.5:0;
  }
  /* and the traveller's own knees and elbows fold with the stride */
  { const live=moving||swimming||!w.grounded||w.spill>0;
    jointTick(u.legL,live); jointTick(u.legR,live);
    jointTick(u.armL,live); jointTick(u.armR,live); }
  /* ---- IN THE SADDLE ----
     The mount is drawn under the traveller, its legs beating with the
     pace; he sits it astride, knees bent, hands to the reins, and rises
     and falls a little with the canter. */
  if(state.mount&&!swimming){
    const M=state.mount, ph=performance.now()*0.013;
    M.m.visible=true;
    M.m.position.set(w.x,w.feetY,w.z);
    M.m.rotation.set(0,w.heading,0);
    const legs=M.m.userData.legs;
    if(legs) for(const L of legs){
      L.rotation.x=moving?Math.sin(ph+(L.userData.ph||0))*0.62:0;
      jointTick(L,moving); }
    const seat=beastUnits(M.kind)*0.74;
    const bump=moving?Math.abs(Math.sin(ph))*0.9:0;
    walkerG.position.y=w.feetY+seat-4.1+bump;
    walkerG.rotation.x=0;
    u.legL.rotation.x=-1.2; u.legR.rotation.x=-1.2;
    u.legL.rotation.z=0.35; u.legR.rotation.z=-0.35;
    if(u.legL.userData.knee) u.legL.userData.knee.rotation.x=1.25;
    if(u.legR.userData.knee) u.legR.userData.knee.rotation.x=1.25;
    u.armL.rotation.x=-0.55; u.armR.rotation.x=-0.55;
    if(u.armL.userData.elbow) u.armL.userData.elbow.rotation.x=-0.5;
    if(u.armR.userData.elbow) u.armR.userData.elbow.rotation.x=-0.5;
  } else { u.legL.rotation.z=0; u.legR.rotation.z=0; }
  /* the held-back height is paid out of the DRAWING, last of all and over
     every pose above — the body and the beast under it ride the step up
     together, and the eye behind them rides it with them */
  if(w.stepOff){ walkerG.position.y-=w.stepOff;
    if(state.mount&&state.mount.m) state.mount.m.position.y-=w.stepOff; }
}
/* ================= FLIGHT — LEVITATION ABOVE THE CLOUDS =================
   The traveller is borne up off the deck or the shore into the open air.
   W/S bear him forward and back, A/D turn him, SPACE lifts him higher,
   SHIFT (or CTRL) lets him down. He floats — there is no falling. He rises
   through the cloud floor and above it, and the wall of ice turns him back
   at the rim. Bear down onto the ground and he alights. */
/* The firmament after the earth-viewer's own cosmology (Scripture-Game
   earth.html): a tent-vault "spread out like a tent to dwell in"
   (Yashayahu 40:22) — its rim just past the wall of ice, its apex 130,000
   high over the midst of the earth — with THE DEEP, near-black and
   star-strewn, all around and beyond it, and the waters above the expanse
   glowing faintly over its apex. */
/* THE VAULT COMES DOWN TO THE WALL. Its radius stood at 1.06 of the world,
   so the glass never came within 45,000 units of any ground a man could
   stand on — there was no reaching it but by flying half a day. It is set
   just outside the last of the land now, so the firmament sweeps DOWN as the
   traveller walks out across the crown of the ice, and closes to a few
   hundred units of his head at the rim: near enough to put a hand on. Over
   the rest of the earth the change is nothing — at half the world's radius
   the ceiling moves by two per cent. */
const R_DOME=R_WORLD*0.9962, H_DOME=130000, FLY_TURN=1.9, FLY_MAXSP=520, FLY_VACC=1150, FLY_VMAX=4800;
let flyHintShown=false, flyPad=0, seenFirmament=false, flyDome=null, outerDeep=null, _domeRimF=0;
function flyFloorAt(x,z){ return groundInfo(x,z).y+7; }
/* ---- THE HEM OF THE TENT ----
   A tent is PEGGED at its edge. The bare sphere came down to 1,063 blocks
   over the rim and stopped there, which was near enough to reach while the
   ice crown tilted up 1,020 blocks to meet it — but the crown is a level
   plain at 610 now, and a man standing on it would have had two thousand
   feet of empty air between his hand and the glass.
   So the vault keeps its whole shape over the world (at half the earth's
   radius the ceiling moves not at all) and then SWEEPS DOWN over the last
   five hundredths of it, closing onto the ice a few hundred units above the
   crown. Walk out across the flat of the ice and the firmament comes down
   out of the sky in front of you and meets the ground at the world's edge:
   the whole earth shut inside it, plain to the eye. */
const DOME_HEM_R=0.955;                        /* where the vault begins to come down */
/* ---- AND IT COMES DOWN IN TWO STAGES ----
   One smooth fall from the tent straight to the rim put the glass fifty
   metres over his head across the whole of the crown — near enough to see,
   far too far to lay a hand on, and the thing is called TOUCH THE FIRMAMENT.
   So the vault PLUNGES first, from seven leagues up to a low ceiling by the
   time the crown is well begun, and then runs in almost level over the last
   of the ice, closing to a raised hand at the very edge. Two smoothsteps
   joined at the knee, so there is no kink where one becomes the other:
   a colossal wall of glass coming down out of the sky, and then a roof. */
const DOME_KNEE_R=0.986;
const DOME_KNEE_Y=WALL_TOP*B+150;              /* the ceiling where it levels out */
/* and how high the glass stands over the crown at the RIM: a raised hand.
   He must stoop at the last, and there is nothing else it could mean. */
const DOME_HEM_Y=WALL_TOP*B+14;
function domeTentR(r){ const rr=r*R_WORLD/R_DOME; return H_DOME*Math.sqrt(Math.max(0,1-rr*rr)); }
const DOME_HEM_TOP=domeTentR(DOME_HEM_R);
/* the height of the firmament above a point on the disc, by the fraction of
   the world's radius it stands at */
function domeCeilR(r){
  if(r<=DOME_HEM_R) return domeTentR(r);
  if(r>=1) return 0;
  if(r<=DOME_KNEE_R){                          /* the plunge */
    const t=(r-DOME_HEM_R)/(DOME_KNEE_R-DOME_HEM_R), e=t*t*(3-2*t);
    return DOME_HEM_TOP+(DOME_KNEE_Y-DOME_HEM_TOP)*e; }
  if(r<=0.995){                                /* and the low roof over the crown */
    const t=(r-DOME_KNEE_R)/(0.995-DOME_KNEE_R), e=t*t*(3-2*t);
    return DOME_KNEE_Y+(DOME_HEM_Y-DOME_KNEE_Y)*e; }
  const t=(r-0.995)/0.005, e=t*t*(3-2*t);      /* past the last of the ice it is pegged down */
  return DOME_HEM_Y*(1-e);
}
/* height of the firmament (the hard vault) directly above a point on the disc */
function domeCeilAt(x,z){ return domeCeilR(Math.hypot(x,z)/R_WORLD); }
function ensureFlyDome(){ if(flyDome) return;
  /* the glass is turned from the SAME profile the ceiling is measured by, so
     what the eye sees and what the hand reaches are one thing. The points are
     crowded toward the rim, where the whole descent happens. */
  const pts=[], NP=180;
  for(let i=0;i<=NP;i++){ const u=i/NP, r=1-Math.pow(1-u,2.6);
    pts.push(new THREE.Vector2(Math.max(0.001,r*R_WORLD), domeCeilR(r))); }
  const dgeo=new THREE.LatheGeometry(pts,128);
  /* ---- THE LIGHT ON THE GLASS ----
     A vault of one flat colour has no shape to it: stand under it and it is
     a tinted lens over the whole sky, and nothing tells the eye that it is a
     THING coming down to meet the ground. So the glass takes the light along
     its HEM — the last of its descent, where it closes onto the ice — and
     from the crown a man sees a bright curved wall standing at the world's
     edge, and the earth shut inside it. */
  { const pa=dgeo.attributes.position.array, n=pa.length/3;
    const col=new Float32Array(n*3);
    for(let i=0;i<n;i++){
      const rr=Math.hypot(pa[i*3],pa[i*3+2])/R_WORLD;
      /* the light gathers along the whole of the descent, from where the
         vault first bends down (0.93) to where it closes on the ice */
      const t=Math.max(0,Math.min(1,(rr-0.93)/0.062)), hem=t*t*(3-2*t);
      const g2=1+4.5*hem;
      col[i*3]=g2; col[i*3+1]=g2; col[i*3+2]=g2; }
    dgeo.setAttribute('color',new THREE.BufferAttribute(col,3)); }
  flyDome=new THREE.Mesh(dgeo,
    new THREE.MeshBasicMaterial({color:0x9ec7f2,vertexColors:true,transparent:true,opacity:0,side:THREE.BackSide,fog:false,depthWrite:false}));
  flyDome.renderOrder=-2;
  flyDome.frustumCulled=false;
  scene.add(flyDome);
  /* the deep beyond the vault — darkness all around, not a mere circle,
     with the waters above the expanse faint and blue over the apex */
  outerDeep=new THREE.Mesh(new THREE.SphereGeometry(R_WORLD*1.55,48,24),
    new THREE.ShaderMaterial({
      transparent:true, side:THREE.BackSide, fog:false, depthWrite:false,
      uniforms:{ uOp:{value:0} },
      vertexShader:'varying vec3 vP; void main(){ vP=position; gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0); }',
      fragmentShader:`precision highp float; uniform float uOp; varying vec3 vP;
        void main(){
          vec3 col=vec3(0.016,0.024,0.051);                      /* the deep: #04060d */
          float up=clamp(vP.y/${(R_WORLD*1.2).toFixed(1)},0.0,1.0);
          col+=vec3(0.05,0.10,0.18)*pow(up,1.6)*0.9;             /* the waters above, faintly */
          gl_FragColor=vec4(col,uOp);
        }`}));
  outerDeep.renderOrder=-3;
  scene.add(outerDeep); }
/* from on high the eye cannot hold the little chunks of the world — so the
   whole earth resolves into her own true face (the same map the compass rose
   bears), fading in as the traveller climbs: the disc seen in the deep, as
   the earth-viewer shows her */
let aloftDisc=null, aloftCtx=null, aloftTex=null, aloftT=0, aloftMark=null;
const ALOFT_RES=2048;      /* the coastlines must stay true when the whole earth fills the view */
function ensureAloftDisc(){ if(aloftDisc) return;
  aloftTex=buildEarthTex();
  aloftDisc=new THREE.Mesh(new THREE.CircleGeometry(R_WORLD,256),
    new THREE.MeshBasicMaterial({map:aloftTex,transparent:true,opacity:0,fog:false,depthWrite:false}));
  aloftDisc.rotation.x=-Math.PI/2; aloftDisc.position.y=175;
  aloftDisc.visible=false; scene.add(aloftDisc);
  /* the traveller's own mark — a sprite, so it is scaled to the eye's
     distance and reads the same whether he looks on one sea or on all */
  const mc=texCanvas(64), mg=mc.getContext('2d');
  mg.fillStyle='#e8c66a'; mg.beginPath(); mg.moveTo(32,4); mg.lineTo(58,60); mg.lineTo(6,60); mg.closePath(); mg.fill();
  mg.strokeStyle='rgba(24,20,10,0.75)'; mg.lineWidth=3; mg.stroke();
  aloftMark=new THREE.Sprite(new THREE.SpriteMaterial({map:new THREE.CanvasTexture(mc),
    fog:false,transparent:true,depthTest:false}));
  aloftMark.visible=false; scene.add(aloftMark); }
/* The face carries the wandering storms and the sun's place, which move, so
   it is repainted at a slow beat while it is being looked at — and not at
   all while it is not. */
function aloftTick(dt,px,pz){
  if(!aloftDisc||!aloftDisc.visible||aloftDisc.material.opacity<0.02) return;
  if(aloftMark){ aloftMark.visible=true;
    aloftMark.position.set(px,aloftDisc.position.y+40,pz);
    /* the mark fades in WITH the charted face — drawn over everything at
       full gold while the face was two percent in, it appeared from nothing */
    aloftMark.material.opacity=aloftDisc.material.opacity;
    const s=Math.max(120,state.camDist*0.0127); aloftMark.scale.set(s,s,1); }
  /* (the face itself is a made thing, laid brick by brick once and for all —
     only the traveller's own mark upon it moves) */ }
/* ================= TOUCHING THE FIRMAMENT =================
   Walk out along the crown of the ice and the glass sweeps down to meet you.
   Where it comes within reach there is a prompt, and taking it plays a short
   scene: the traveller sets his hand upon the vault and looks out past it,
   into the outer darkness that no man may pass. */
const DOME_REACH=460;                 /* how near the glass must be to be touched */
function canTouchDome(){
  if(state.firm||cut) return false;
  if(state.mode!=='walk'&&state.mode!=='fly') return false;
  const p=state.mode==='fly'?state.fly:state.walk;
  const rr=Math.hypot(p.x,p.z)/R_WORLD;
  const y=state.mode==='fly'?state.fly.y:(walkerG.position.y+8);
  const gap=domeCeilAt(p.x,p.z)-y;
  /* Out upon the crown of the ice the vault stands close overhead. A flyer
     may come against it anywhere; a man on his feet only here, where the
     firmament has come down out of the sky to meet the flat of the ice. */
  if(state.mode==='fly') return gap>=-260&&gap<DOME_REACH;
  /* and only where it is truly WITHIN REACH. At 2,200 units the prompt stood
     ready across ground where the glass was three kilometres over his head,
     and the scene played with nothing above him at all. */
  return rr>0.984&&gap>=-400&&gap<340;
}
/* ================= THE CUTSCENE ENGINE =================
   A scene is DATA. world/scenes.js declares each one — how long it runs, the
   verses it may draw on, how the world is dressed while it plays, what the
   traveller does, and the marks the eye moves through. This is the machine
   that plays them, and it knows nothing about any particular scene.

   What it does: takes the body out of the player's hands, drops the
   letterbox, takes the HUD down, dresses the world on a ramp that comes up at
   the start and goes down before the end (so the world he stands in is back
   before the bars lift), leads the eye from mark to mark, holds a verse, and
   then puts every single thing it touched back as it found it. */
const SCENES={};
for(const S of ((window.EARTH&&window.EARTH.sceneList)||[])) SCENES[S.name]=S;
let cut=null;                       /* the scene now running, if any */
function sceneActive(){ return !!cut; }
/* the dressing ramp: 0 at either end of the scene, 1 across the middle */
function sceneRise(){ return cut?cut.rise:0; }
/* one dressing value, already multiplied by the ramp — 0 when nothing is on */
function sceneSet(k){
  if(!cut||!cut.spec.set) return 0;
  const v=cut.spec.set[k];
  return v===undefined?0:(v===true?cut.rise:v*cut.rise);
}
/* and one that is simply on or off for the whole scene, ramp or no */
function sceneFlag(k){ return !!(cut&&cut.spec.set&&cut.spec.set[k]); }
/* PLAY. `at` says where the scene is anchored: the traveller's place and the
   bearing he faces. Every mark in the shot list is read off those. */
function playScene(name,at){
  const spec=SCENES[name];
  if(!spec||cut||!spec.shots||spec.shots.length<2) return false;
  const lines=spec.lines||[];
  const line=lines.length?lines[Math.floor(Math.random()*lines.length)]:null;
  cut={spec,t:0,dur:spec.dur||10,rise:0,line,x:at.x,y:at.y,z:at.z,out:at.out,
       shotIdx:-1,snap:true,hour0:null,title:null};
  /* the caption track: the new `caps` list, or the old single verse laid out
     as a track of one, so both authoring styles run through the same machine */
  if(spec.caps&&spec.caps.length) cut.track=spec.caps.map(q=>({t:q.t,to:q.to,text:q.text,ref:q.ref||''}));
  else if(line){ const cp=spec.cap||[(spec.dur||10)*0.2,(spec.dur||10)*0.85];
    cut.track=[{t:cp[0],to:cp[1],text:line[0],ref:line[1]}]; }
  else cut.track=[];
  /* ---- A SCENE MAY SET ITS OWN HOUR ----
     A passage written for dusk played at whatever o'clock the traveller
     happened to arrive at. It may now name the hour it wants; the world's
     own clock is put back untouched when the scene ends. */
  if(spec.set&&spec.set.hour!==undefined){ cut.hour0=state.simHours;
    /* and the hour asked for is the LOCAL one, at the place the scene plays.
       The sun goes round the disc, so a world-clock hour is a different hour
       of the day in every country: 18:00 is dusk in one land and midnight in
       the next. The longitude is taken out of it here, so `hour:18.4` means
       what an author means by it — half past six IN THE EVENING, wherever
       the passage is played. */
    const lonR=Math.atan2(at.x,at.z);
    const local=spec.set.hour-12*lonR/Math.PI;
    state.simHours=Math.floor(state.simHours/24)*24+((local%24)+24)%24; }
  cut.fov0=camera.fov;
  ensureFlyDome();
  /* THE WALL OF NIGHT COMES DOWN when a scene asks for it. It is a dark
     cylinder standing at the rim, and it is the right thing to see from
     WITHIN the world — but a man out on the crown of the ice with his hand on
     the glass is not within it, and it stood between him and the whole of the
     deep: a smooth blank filling two thirds of the sight with not one star in
     it. The same is done for the firmament view, and for the same reason. */
  if(spec.set&&spec.set.hideVoidWall) voidWall.visible=false;
  if(spec.actor&&!spec.actor.keep) walkerG.position.set(at.x,at.y,at.z);
  /* AND NOTHING ELSE IS ON THE SCREEN. A cutscene with a toolbar down one
     side of it, and the place-line sitting on top of the verse, is not a
     cutscene. */
  if(spec.set&&spec.set.hideHud) D.body.classList.add('cine');
  if(!spec.set||spec.set.letterbox!==false){ const el=$('cine'); if(el) el.classList.add('on'); }
  const cap=$('cine-cap');
  if(cap) cap.innerHTML=line?(line[0]+'<span class="ref">'+line[1]+'</span>'):'';
  return true;
}
function endScene(){
  if(!cut) return;
  const spec=cut.spec, u=walkerG.userData;
  if(u&&u.armL&&spec.actor&&spec.actor.reach){    /* the arms come down */
    u.armL.rotation.x=u.armR.rotation.x=0; u.armL.rotation.z=u.armR.rotation.z=0; }
  /* every borrowed thing given back: the hour, the lens, the level horizon */
  if(cut.hour0!==null) state.simHours=cut.hour0;
  if(cut.fov0!==undefined&&camera.fov!==cut.fov0){ camera.fov=cut.fov0; camera.updateProjectionMatrix(); }
  camera.rotation.z=0;
  { const fd=$('cine-fade'); if(fd) fd.style.opacity=0;
    const ti=$('cine-title'); if(ti){ ti.classList.remove('on'); ti.textContent=''; } }
  cut=null;
  if(!state.firm) voidWall.visible=true;
  voidStarTick(0);
  D.body.classList.remove('cine');
  const el=$('cine'); if(el) el.classList.remove('on');
  const cap=$('cine-cap'); if(cap) cap.classList.remove('on');
}
/* where the eye stands and looks at time t, read off the marks.
   ---- WHAT A MARK MAY NOW SAY ----
   The old six (d,y,s,L,h and t) placed the eye on a circle about ONE fixed
   point and eased everything. That is a fine ten-second shot and a useless
   ninety-second one, so a mark may now also carry:
     fwd/side/up   MOVE THE ANCHOR ITSELF — paces along the traveller's
                   bearing, to his right, and above him. This is what lets a
                   long scene TRAVEL: away down a valley, up a mountain,
                   out over the sea, instead of turning on one spot for ever.
     lside         and the look-at may swing off the bearing too
     fov           the lens: low is a long lens and flattens, high is wide
                   and throws the world away from you (the dolly-zoom)
     roll          the horizon tipped — the dutch angle
     cut:true      a HARD CUT. The eye does not travel to this mark, it IS
                   at it. Without this every shot in a film blends into the
                   next, which is the whole reason long scenes read as one
                   endless drifting take.
     ease          'smooth' (the default), 'linear' for a steady crawl, or
                   'hold' to sit dead still on the previous mark and then
                   arrive all at once. */
function sceneMark(shots,t){
  let i=0; while(i<shots.length-2&&t>=shots[i+1].t) i++;
  const A=shots[i], Bb=shots[i+1];
  let u=Math.min(1,Math.max(0,(t-A.t)/Math.max(0.001,Bb.t-A.t)));
  const ez=Bb.ease||(Bb.cut?'hold':'smooth');
  const e = ez==='linear'?u : ez==='hold'?(u>=1?1:0) : u*u*(3-2*u);
  const m=(k,dflt)=>{ const a=(A[k]!==undefined)?A[k]:dflt;
    const b=(Bb[k]!==undefined)?Bb[k]:a; return a+(b-a)*e; };
  return { d:m('d',40), y:m('y',10), s:m('s',0), L:m('L',120), h:m('h',10),
           fwd:m('fwd',0), side:m('side',0), up:m('up',0), lside:m('lside',0),
           fov:m('fov',62), roll:m('roll',0), idx:i };
}
/* ---- THE CAPTION TRACK ----
   A scene used to carry ONE verse for its whole length, which is all a
   fourteen-second shot wants and nothing a long passage can use. A scene may
   now carry a TRACK of them — `caps:[{t,to,text,ref}]` — each coming up and
   going down at its own hour, so a long film can be narrated the whole way
   through. The old single `lines`/`cap` pair still works exactly as it did. */
function sceneCaptionAt(C,t){
  const track=C.track;
  if(!track||!track.length) return null;
  for(const q of track) if(t>=q.t&&t<q.to) return q;
  return null;
}
const _cutA=new THREE.Vector3(), _cutB=new THREE.Vector3();
function sceneTick(dt){
  const C=cut, spec=C.spec, set=spec.set||{}; C.t+=dt;
  /* ---- THE CAPTION TRACK, spoken line by line ---- */
  const capEl=$('cine-cap');
  if(capEl){ const q=sceneCaptionAt(C,C.t);
    if(q!==C.capNow){ C.capNow=q;
      if(q) capEl.innerHTML=q.text+(q.ref?'<span class="ref">'+q.ref+'</span>':''); }
    capEl.classList.toggle('on', !!q); }
  /* ---- THE FADES, AND THE TITLES THAT STAND IN THEM ----
     `fades:[{t,to,hold}]` — the screen goes to black across t..t+hold, sits,
     and comes back by `to`. A long film is CUT INTO PASSAGES this way, which
     is the difference between a piece of film and one endless drifting take. */
  { const fd=$('cine-fade');
    if(fd){ let op=0;
      for(const f of (spec.fades||[])){
        if(C.t<f.t||C.t>f.to) continue;
        const hold=f.hold||0.6, dn=f.t+((f.to-f.t)-hold)/2, up=dn+hold;
        op=Math.max(op, C.t<dn?(C.t-f.t)/Math.max(0.001,dn-f.t)
                  : C.t<up?1 : 1-(C.t-up)/Math.max(0.001,f.to-up)); }
      fd.style.opacity=Math.max(0,Math.min(1,op)); } }
  { const ti=$('cine-title');
    if(ti){ let show=null;
      for(const q of (spec.titles||[])) if(C.t>=q.t&&C.t<q.to) show=q;
      if(show!==C.title){ C.title=show; if(show) ti.textContent=show.text; }
      ti.classList.toggle('on', !!show); } }
  /* ---- THE DRESSING COMES UP, AND GOES DOWN AGAIN ---- */
  C.rise=Math.min(1, Math.min(C.t/(set.fadeIn||2.5), (C.dur-C.t)/(set.fadeOut||1.8)));
  /* enough glass that his hand has something to rest on, and NO MORE: at half
     again as much the vault's blue lay over the whole of the abyss, and the
     host in it could barely be made out — which is the sight he came for. */
  if(flyDome&&set.glass!==undefined) flyDome.material.opacity=set.glass*(0.4+0.6*C.rise);
  if(set.stars!==undefined)
    starGroup.userData.mat.opacity=Math.max(starGroup.userData.mat.opacity,set.stars*C.rise);
  if(outerDeep&&set.outerDeep!==undefined) outerDeep.material.uniforms.uOp.value=
    Math.max(outerDeep.material.uniforms.uOp.value,set.outerDeep*C.rise);
  /* ---- THE ACTOR ---- */
  const A=spec.actor||{}, u=walkerG.userData;
  if(!A.keep){
    if(A.reach&&u&&u.armL){ const R=A.reach;
      const up=Math.min(1,Math.max(0,(C.t-R[0])/Math.max(0.001,R[1]-R[0])));
      const dn=1-Math.min(1,Math.max(0,(C.t-R[2])/Math.max(0.001,R[3]-R[2])));
      const reach=Math.min(up,dn);
      u.armL.rotation.x=-2.5*reach; u.armR.rotation.x=-2.3*reach;
      u.armL.rotation.z=0.2*reach; u.armR.rotation.z=-0.2*reach;
      u.legL.rotation.x=0; u.legR.rotation.x=0; }
    if(A.stand) walkerG.rotation.set(0,C.out,0);
    walkerG.visible=true;
  }
  /* ---- THE EYE ---- */
  const F=sceneMark(spec.shots,C.t);
  /* THE ANCHOR TRAVELS. Every mark used to hang on the one spot the scene
     started at, so a long take could only ever circle it. A mark may now
     carry the anchor forward along the traveller's bearing, out to either
     side of it and up — so the eye crosses real ground. */
  const fx=Math.sin(C.out), fz=Math.cos(C.out);      /* the way he faces */
  const sx=Math.cos(C.out), sz=-Math.sin(C.out);     /* and his right hand */
  const ax=C.x+fx*F.fwd+sx*F.side, ay=C.y+F.up, az0=C.z+fz*F.fwd+sz*F.side;
  const az=C.out+Math.PI*(1-F.s);
  _cutA.set(ax+Math.sin(az)*F.d, ay+F.y, az0+Math.cos(az)*F.d);
  /* A HARD CUT puts the eye there; anything else LEADS it, firmly enough
     that it arrives before the beat is out. */
  const shot=spec.shots[F.idx+1];
  if(F.idx!==C.shotIdx){ C.shotIdx=F.idx; if(shot&&shot.cut) C.snap=true; }
  if(C.snap){ camera.position.copy(_cutA); C.snap=false; }
  else camera.position.lerp(_cutA,Math.min(1,dt*3.0));
  _cutB.set(ax+fx*F.L+sx*F.lside, ay+F.h, az0+fz*F.L+sz*F.lside);
  camera.lookAt(_cutB);
  /* the lens, and the horizon tipped off level */
  if(Math.abs(camera.fov-F.fov)>0.01){ camera.fov=F.fov; camera.updateProjectionMatrix(); }
  /* THE DUTCH ANGLE, turned about the camera's OWN line of sight. Writing
     rotation.z outright is wrong twice: lookAt has just decomposed the whole
     orientation (its z is commonly ±pi and means nothing on its own), and a
     roll ADDED frame on frame spins the horizon clean over. Rolled about its
     own forward axis, straight after the look, it is exactly the tilt asked
     for and nothing else. */
  if(F.roll) camera.rotateZ(F.roll);
  if(C.t>=C.dur) endScene();
}
/* ---- and the one that is played by walking out to the end of the world ---- */
function touchDome(){
  if(cut||!canTouchDome()) return;
  const p=state.mode==='fly'?state.fly:state.walk;
  const y=state.mode==='fly'?state.fly.y:walkerG.position.y;
  playScene('firmament',{x:p.x,y,z:p.z,out:Math.atan2(p.x,p.z)});
}
function flyTick(dt){
  const fl=state.fly; const [f,t]=axis();
  fl.heading+=t*dt*FLY_TURN;
  const tgt=f*FLY_MAXSP;
  fl.sp+=(tgt-fl.sp)*Math.min(1,dt*2.4);
  /* ---- A MOUNTAIN IS A WALL TO A FLYER TOO ----
     The only law used to be a floor clamp, so flying AT a cliff warped the
     body up its face — and the works of the ancients had no law at all, so
     a flyer passed clean through the Great Pyramid. A face standing more
     than a short skim above him is not flown through and not teleported up:
     he fetches up against it (sliding along it where an open way lies), and
     climbs over it with SPACE like everything else. The move is walked in
     substeps so no speed can carry him through a wall between two frames. */
  const FLY_STEP=26;
  const flyWall=(tx,tz)=>groundInfo(tx,tz).y+7-fl.y>FLY_STEP
    ||!!landmarkSolidAt(tx,tz,fl.y-1.5,fl.y+6.5);
  { const mvx=Math.sin(fl.heading)*fl.sp*dt, mvz=Math.cos(fl.heading)*fl.sp*dt;
    const dist2=Math.hypot(mvx,mvz), nSub=Math.max(1,Math.ceil(dist2/(B*0.8)));
    for(let k2=0;k2<nSub;k2++){
      const sx=fl.x+mvx/nSub, sz=fl.z+mvz/nSub;
      if(!flyWall(sx,sz)){ fl.x=sx; fl.z=sz; continue; }
      if(!flyWall(sx,fl.z)){ fl.x=sx; fl.sp*=0.94; continue; }   /* slide */
      if(!flyWall(fl.x,sz)){ fl.z=sz; fl.sp*=0.94; continue; }
      fl.sp*=0.2; break;                                          /* fetched up hard */
    } }
  /* vertical: hold to rise, and the longer he holds the faster he climbs —
     up through the clouds, past the sun and moon, to the firmament itself */
  let up=flyPad;                                     /* the on-screen ▲▼ pads (touch) */
  if(keys.Space) up+=1;
  if(keys.ShiftLeft||keys.ShiftRight||keys.ControlLeft||keys.ControlRight) up-=1;
  up=Math.max(-1,Math.min(1,up));
  if(up!==0){ fl.vy+=up*FLY_VACC*dt; fl.vy=Math.max(-FLY_VMAX,Math.min(FLY_VMAX,fl.vy)); }
  else fl.vy*=Math.max(0,1-dt*1.4);                 /* let go and he coasts to a hover */
  fl.y+=fl.vy*dt;
  const terrFloor=flyFloorAt(fl.x,fl.z), lmTop=landmarkTopAt(fl.x,fl.z,fl.y+2);
  const floor=Math.max(terrFloor,lmTop+6), ceil=domeCeilAt(fl.x,fl.z)-40;
  if(fl.y>=ceil){ fl.y=ceil; fl.vy=Math.min(0,fl.vy);   /* stuck fast against the firmament */
    if(!seenFirmament){ seenFirmament=true;
      toast('You are come up against the firmament — the hard vault of the shamayim, spread out like a moulded mirror, that no man passes.','IYOB 37:18'); } }
  if(fl.y<floor){ fl.y=floor; fl.vy=Math.max(0,fl.vy);
    /* bearing down onto the GROUND sets him down; masonry only bears him —
       a walker has no footing on a pyramid's terraces, so alighting waits
       for the earth itself */
    if(up<0&&lmTop+6<terrFloor){ alight(); return; } }
  /* the rim is HARD: never past it, and anyone found beyond (an old save,
     an old bug) is pressed back within — inward flight always works */
  { const rr=Math.hypot(fl.x,fl.z)/R_WORLD;
    if(rr>0.992){ const k=0.992/rr; fl.x*=k; fl.z*=k; fl.sp*=0.25; } }
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
  if(state.firm) return;                     /* not from behind the map view */
  if(state.mode==='fly'){ alight(); return; }
  if(state.mode==='deck'&&state.deck.level==='hold'){ toast('The hold has a roof — come up on deck to take the air.'); return; }
  ensureFlyDome();
  let x,z,h;
  if(state.mode==='walk'){ x=state.walk.x; z=state.walk.z; h=state.walk.heading; state.prevGround='walk'; }
  else if(state.mode==='dive'){                       /* rise from the water where you ARE, not from the distant ship */
    x=state.dive.x; z=state.dive.z; h=state.dive.heading;
    state.dive.jump=null; state.prevGround='walk'; hideDeep();
    splash(x,SEA_SURF+1,z,true); }
  else { x=state.boat.x; z=state.boat.z; h=state.boat.heading; state.prevGround='boat'; }
  state.fly.x=x; state.fly.z=z; state.fly.heading=h;
  state.fly.y=flyFloorAt(x,z)+60; state.fly.vy=60; state.fly.sp=0;
  setMode('fly');
  if(!flyHintShown){ flyHintShown=true;
    toast('You are borne up on the air — hold SPACE to rise higher and higher, past the clouds and the lights, to the firmament; SHIFT to sink, W/S to fly, A/D to turn.'); }
}
function alight(){
  const fl=state.fly;
  /* never set a man down in the void past the rim — draw him in to the wall */
  { const rr=Math.hypot(fl.x,fl.z)/R_WORLD;
    if(rr>0.985&&!landAtWorld(fl.x,fl.z)){ const k=0.98/rr; fl.x*=k; fl.z*=k; } }
  /* nor INSIDE the works of the ancients — over standing masonry he is set
     down on the open ground beside it, never within the stones */
  { const g0=groundInfo(fl.x,fl.z).y;
    if(landmarkSolidAt(fl.x,fl.z,g0+1,g0+9)){
      for(let rr2=8;rr2<=140;rr2+=8){ let done=false;
        for(let a2=0;a2<8&&!done;a2++){ const th=a2/8*Math.PI*2;
          const tx=fl.x+Math.cos(th)*rr2, tz=fl.z+Math.sin(th)*rr2;
          const g2=groundInfo(tx,tz).y;
          if(!landmarkSolidAt(tx,tz,g2+1,g2+9)){ fl.x=tx; fl.z=tz; done=true; } }
        if(done) break; } } }
  const cc=landAtWorld(fl.x,fl.z);
  if(cc){                                             /* land on any ground, the ice wall included */
    state.walk.x=fl.x; state.walk.z=fl.z; state.walk.heading=fl.heading;
    state.walk.feetY=undefined; state.walk.vy=0; state.walk.grounded=true;  /* re-seat on the ground here */
    setMode('walk'); markDiscovery(fl.x,fl.z); toast('You alight softly upon the earth.');
  } else if(Math.hypot(fl.x-state.boat.x,fl.z-state.boat.z)<90){
    /* the ship truly lies below — settle onto her deck where she rides */
    setMode('boat'); toast('You settle back onto the deck.');
  } else {
    /* open water, no ship near: down into the sea itself. The ship stays
       where she was left — swim for her, or for the shore. */
    state.walk.x=fl.x; state.walk.z=fl.z; state.walk.heading=fl.heading;
    state.walk.feetY=undefined; state.walk.vy=0; state.walk.grounded=true; state.walk.inWater=false;
    setMode('walk');
    splash(fl.x,WATER_Y+seaHeight(fl.x,fl.z)+1,fl.z,true);
    toast('You come down upon the open sea and take to the water — swim for your ship, or for the shore.');
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
  /* a scene holds the body and the eye. Changing mode under it — surfacing,
     alighting, a restored voyage — would leave it running over a traveller
     who is no longer where it left him, with the HUD still down. */
  if(cut) endScene();
  /* the ▲▼ pad's press dies with the mode — a hold interrupted by a forced
     surface left the pad's display:none swallowing the pointer-up, and the
     next flight sank of itself on a phantom press */
  flyPad=0;
  state.mode=m;
  /* the eye's boom opens again with the new mode. Carried over, a pull-in
     earned against a cliff ashore would hold the eye jammed against the
     traveller's back for the first half-second of the next thing he did. */
  camClear=1; camFloor=-1e9;
  if(m==='fly') ensureFlyDome();                      /* the vault stands even for a voyage restored aloft */
  if(m==='walk'){ state.walk.climb=null;              /* a climb interrupted elsewhere must not resume here */
    state.walk.stepOff=0; }                           /* nor a step half-paid from a shore he has left */
  if(m!=='fly'&&m!=='dive'){ walkerG.rotation.x=0; walkerG.rotation.z=0; }   /* clear the flight/swim lean and heel */
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
  b.style.display=state.mode==='fly'?'none':'';   /* aloft, the anchor button already reads Alight — one button, not two */
  b.classList.toggle('off',state.mode==='fly');
  const fp=$('flypad'); if(fp) fp.style.display=(state.mode==='fly'||state.mode==='dive')?'flex':'none'; }
function updateDiveBtn(){ const b=$('b-dive'); if(!b) return;
  b.textContent=state.mode==='dive'?'🌊 Surface':'🤿 Dive';
  /* under the sea the anchor button ALREADY reads Surface, so the rail
     carried two identical Surface buttons one above the other. One is
     enough — the same rule the flyer's Alight button keeps. */
  b.style.display=state.mode==='dive'?'none':'';
  b.classList.toggle('off',state.mode==='dive'); }
function nearWheel(){ return state.mode==='deck'&&state.deck.level!=='hold'
  &&state.deck.lz<SD.qdeckZ+1.5*SHIP_S&&Math.abs(state.deck.lx)<4.2*SHIP_SX; }
function setAshore(x,z,h){
  /* every walk re-entry re-seats the body on the LOCAL ground — no stale
     altitude carried over from another coast */
  state.walk.x=x; state.walk.z=z; state.walk.heading=h;
  state.walk.feetY=undefined; state.walk.vy=0; state.walk.grounded=true; state.walk.inWater=false;
  setMode('walk'); markDiscovery(x,z);
}
function goAshoreFromShip(){
  const bt=state.boat;
  /* pass 1 — a beach or low ground; pass 2 — a pier; pass 3 — any land */
  let anyLand=null;
  for(let rad=1;rad<22;rad++) for(let a=0;a<rad*8;a++){
    const th=a/(rad*8)*Math.PI*2;
    const x=bt.x+Math.cos(th)*rad*B, z=bt.z+Math.sin(th)*rad*B;
    const cc=landAtWorld(x,z);
    if(cc){
      if(cc.kind!=='wall'&&cc.h<=2){ setAshore(x,z,bt.heading); return true; }
      if(!anyLand) anyLand={x,z};   /* the ice wall counts — you may go ashore and mount it */
    }
  }
  let bestD=null;
  for(const [k] of deckMap){ const parts=k.split(','),ix=+parts[0],iz=+parts[1];
    const x=(ix+.5)*B, z=(iz+.5)*B, dd=Math.hypot(x-bt.x,z-bt.z);
    if(dd<22*B&&(!bestD||dd<bestD.dd)) bestD={x,z,dd}; }
  if(bestD){ setAshore(bestD.x,bestD.z,bt.heading); return true; }
  if(anyLand){ setAshore(anyLand.x,anyLand.z,bt.heading); return true; }
  toast('No shore within reach — draw nearer to the land.');
  return false;
}
function toggleAshore(){
  if(state.firm) return;                     /* not from behind the map view */
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
  /* THE SAME FACE the whole world wears when it is looked upon entire — laid
     brick by brick, coloured by its clime, the shelf about every coast, the
     tropics in dashed gold and the wall of ice at the rim. It was a second,
     differently-drawn map before, so the earth changed its face between the
     view from aloft and the view in the firmament. There is one earth. */
  const disc=new THREE.Mesh(new THREE.CircleGeometry(R_WORLD,256),
    new THREE.MeshBasicMaterial({map:buildEarthTex(),fog:false}));
  /* sit well above the sea and terrain: at a 384k-unit far plane the depth
     buffer cannot separate y=2 from the sea at y≈0.35 and the disc flickers */
  disc.rotation.x=-Math.PI/2; disc.position.y=180;
  const dome=new THREE.Mesh(new THREE.SphereGeometry(R_DOME,48,24,0,Math.PI*2,0,Math.PI/2),
    new THREE.MeshBasicMaterial({color:0x8fb8e8,transparent:true,opacity:0.16,side:THREE.DoubleSide,fog:false,depthWrite:false}));
  dome.scale.y=H_DOME/R_DOME;                       /* the same low tent-vault as within */
  firmG=new THREE.Group(); firmG.add(disc); firmG.add(dome);
  /* ---- THE COLUMNS OF THE EARTH ----
     "The earth and all its inhabitants are melted; it is I who set up its
     columns firm." The disc is not adrift: it is set upon a table of bronze
     borne on four pillars, and the whole is beheld standing in the dark. */
  const bronze=new THREE.MeshBasicMaterial({color:0x6b5836,fog:false});
  const bronzeDk=new THREE.MeshBasicMaterial({color:0x453922,fog:false});
  const bronzeLt=new THREE.MeshBasicMaterial({color:0x8a7346,fog:false});
  const TS=R_WORLD*2.34, TH=R_WORLD*0.085;      /* the table: its span and its thickness */
  const top=new THREE.Mesh(new THREE.BoxGeometry(TS,TH,TS),
    [bronze,bronze,bronzeLt,bronzeDk,bronze,bronze]);
  top.position.y=180-TH/2-R_WORLD*0.004; firmG.add(top);
  const LEG=R_WORLD*0.20, LEGH=R_WORLD*1.30, LO=TS*0.34;
  for(const sx of [1,-1]) for(const sz of [1,-1]){
    const leg=new THREE.Mesh(new THREE.BoxGeometry(LEG,LEGH,LEG),
      [bronzeDk,bronzeDk,bronze,bronzeDk,bronzeDk,bronzeDk]);
    leg.position.set(sx*LO, top.position.y-TH/2-LEGH/2, sz*LO); firmG.add(leg); }
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
  frame.rotation.x=-Math.PI/2; frame.position.y=60; firmG.add(frame);   /* well clear of the disc at 180 */

  /* (the painted glow that stood fixed over the midst of the lands is gone:
     the TRUE sun and moon now stand over the disc in this view, each above
     the countries where its own hour is, with their haloes about them — a
     second, motionless glow at the centre read as a second sun) */

  firmG.visible=false; scene.add(firmG);
}
let firmHintShown=false;
function enterFirm(){
  if(state.firm) return;
  /* the hold has a roof — there is no beholding the heavens from below
     deck (flight and the dive already refuse it; and the whole-earth near
     plane, left on a first-person eye inside a hull, clipped the whole
     world away) */
  if(state.mode==='deck'&&state.deck.level==='hold'){
    toast('The whole earth cannot be beheld from the hold — climb up to the deck first.'); return; }
  if(cut) endScene();                  /* a running scene must not keep the camera under the map view */
  if(state.mode==='dive') surface();   /* no map-gazing from under the sea — breath would drain beneath the overlay */
  closeTrade();                        /* no shop laid over the whole earth */
  if(state.fishing) endFishing(true);  /* nor a rod left casting under the overlay */
  buildFirmament(); state.firm=true; firmG.visible=true;
  state.camYawVel=0; state.camPitchVel=0;
  scene.fog=null; state.firmDist=R_WORLD*1.62; state.camPitch=1.02;
  sea.visible=false; seaDeep.visible=false; waveGrid.visible=false;
  if(!firmHintShown&&running){ firmHintShown=true;
    toast('Tap a land you have already visited, and a fair wind will carry you to its coasts.'); }
  clouds.visible=false; cirrus.visible=false;   /* clear the sky \u2014 behold the whole earth */
  cloudDeck.visible=false; cloudWisp.visible=false; cloudCover.visible=false; voidWall.visible=false;
  hideDeep(); hideLandLife(); hideAirLife(); hideTraders();  /* nothing of the deep or the field in the map view */
  $('b-firm').textContent='\u26F5 Return to the ship'; }
function exitFirm(){ state.firm=false; if(firmG) firmG.visible=false;
  scene.fog=FOG; state.camPitch=0.42; state.camDist=200; state.zoom=distToZoom(200);
  state.camYawVel=0; state.camPitchVel=0;
  /* the near plane was opened to thousands for the whole-earth depth range —
     hand it straight back, or a first-person eye (a house, the hold) is left
     with the entire world clipped away until the next mode change */
  camera.near=camInside?0.3:1; camera.updateProjectionMatrix();
  sea.visible=true; seaDeep.visible=true; waveGrid.visible=true;
  clouds.visible=true; clouds.scale.set(1,1,1); clouds.position.y=CLOUD_Y; cirrus.visible=true; voidWall.visible=true;
  $('b-firm').textContent='\uD83D\udd4A The firmament'; }

/* ================= CAMERA ================= */
const camTgt=new THREE.Vector3(), camPos=new THREE.Vector3(), _wv=new THREE.Vector3();
let camInside=false;
/* how much of the boom stands clear of the world — carried between frames and
   eased, so the eye is never yanked in and out from one frame to the next */
let camClear=1;
/* and the ground under the eye, rate-limited. The ground of this world is cut
   in whole blocks, so the top beneath the camera does not rise as it travels
   — it JUMPS six units at a column's edge, and clamping the eye straight onto
   it threw the eye up the whole six in a single frame. That was the largest
   jolt of all of them, larger than the step under the traveller's own feet.
   The floor is let up at a PACE instead — quick enough to stay ahead of a
   walking man, who crosses a column every third of a second — and let down
   more gently still, so a ridge passing under the eye lifts it and sets it
   down rather than kicking it. */
let camFloor=-1e9;
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
  if(cut){ sceneTick(dt); return; }
  /* ---- THE SLIDE ----
     A flick of the finger or the mouse hands its pace to the view, and the
     view glides on with it and comes softly to rest — until the next touch,
     which takes the wheel back at once (the drag handler zeroes the pace). */
  if(!drag&&(state.camYawVel||state.camPitchVel)){
    state.camYaw+=state.camYawVel*dt;
    state.camPitch=pitchClamp(state.camPitch+state.camPitchVel*dt);
    const k=Math.max(0,1-dt*3.4);
    state.camYawVel*=k; state.camPitchVel*=k;
    if(Math.abs(state.camYawVel)<0.02) state.camYawVel=0;
    if(Math.abs(state.camPitchVel)<0.02) state.camPitchVel=0;
  }
  /* a HELD-STILL pointer sheds its remembered pace — so a drag that stops
     dead and then lifts hands over no glide, while a true flick (lifted
     within a frame or two of its last move) keeps all of it. Stillness is
     measured against the beat of the move events themselves, which ride the
     frame clock — never against wall time, which a slow machine would fail. */
  if(drag&&drag.t&&(drag.vx||drag.vy)){
    const idle=performance.now()-drag.t;
    if(idle>Math.max(40,(drag.iv||16)*2.5)){
      const k2=Math.max(0,1-dt*6);
      drag.vx*=k2; drag.vy*=k2; } }
  if(state.firm){ const pit=Math.max(0.05,Math.min(1.52,state.camPitch));
    const Rd=state.firmDist;
    camPos.set(Math.sin(state.camYaw)*Math.cos(pit)*Rd, Math.sin(pit)*Rd+200, Math.cos(state.camYaw)*Math.cos(pit)*Rd);
    camera.position.lerp(camPos,Math.min(1,dt*2.5));
    /* This view looks upon a thing a quarter of a million units wide from as
       far again. A near plane of ONE unit against a 384,000-unit far plane
       leaves the depth buffer nothing at all to work with, and the bronze of
       the table tears up through the face of the earth in radial splinters.
       It is opened with the distance, as it is in the world. */
    { const wantNear=Math.max(1,Rd*0.02);
      if(Math.abs(camera.near-wantNear)>Math.max(0.5,camera.near*0.15)){
        camera.near=wantNear; camera.updateProjectionMatrix(); } }
    camera.lookAt(0,0,0); return; }
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
  /* ease the eye toward the zoom target IN LOG SPACE, so it opens at one
     steady rate whether it is closing on the deck or drawing back off the
     whole earth — and so a fast spin of the wheel can never snap the view */
  { const cz=distToZoom(state.camDist);
    state.camDist=zoomToDist(cz+(state.zoom-cz)*Math.min(1,dt*1.9)); }
  let px,pz,phead,baseY,dist;
  /* only a FLOOR per mode now — the ceiling used to clamp the last third of
     the range away, so the far end of the wheel moved nothing */
  if(state.mode==='deck'){ walkerG.getWorldPosition(_wv);
    px=_wv.x; pz=_wv.z; baseY=_wv.y; phead=state.boat.heading+state.deck.h;
    dist=Math.max(10,state.camDist); }
  else if(state.mode==='boat'){ const bt=state.boat;
    px=bt.x; pz=bt.z; baseY=boatG.position.y+SD.qdeckY; phead=bt.heading; dist=Math.max(56,state.camDist); }
  else if(state.mode==='fly'){ const fl=state.fly;
    px=fl.x; pz=fl.z; baseY=fl.y; phead=fl.heading; dist=Math.max(24,state.camDist); }
  else if(state.mode==='dive'){ const dv=state.dive;
    /* under the sea the water itself ends the view — drawing further back
       only buys fog, so the deep keeps a ceiling of its own */
    px=dv.x; pz=dv.z; baseY=dv.y; phead=dv.heading; dist=Math.max(16,Math.min(state.camDist,300)); }
  else{ const w=state.walk;
    px=w.x; pz=w.z; baseY=walkerG.position.y; phead=w.heading; dist=Math.max(14,state.camDist); }
  /* walking on, the view drifts back behind the traveller — but NEVER while
     a finger or the mouse is holding it, and never against a live glide:
     the player's own turn of the eye always wins over the auto-centring */
  const [f2]=axis();
  if(Math.abs(f2)>0.2&&!drag&&!state.camYawVel) state.camYaw*=Math.max(0,1-dt*0.5);
  const az=phead+Math.PI+state.camYaw;
  /* as the eye draws back off the world it also rises over it — the pitch
     the traveller dragged for himself still rules close in, and gives way to
     a near-overhead view of the whole earth as it opens out */
  const zf=zoomMapFade();
  const pit=state.camPitch+(1.45-state.camPitch)*zf;
  const cpit=Math.cos(pit), spit=Math.sin(pit);
  /* ashore, draw the camera in rather than clip through the ship */
  if(state.mode==='walk'){
    for(let k=0;k<8&&dist>20;k++){
      const tx=px+Math.sin(az)*cpit*dist;
      const tz=pz+Math.cos(az)*cpit*dist;
      const ty=baseY+8+spit*dist;
      if(!camInsideShip(tx,ty,tz)) break;
      dist*=0.82;
    }
  }
  /* swimming, the eye rides low along the waterline. The swell rolls over it
     and off again without the world being repainted in water-light: a crest
     passing the lens is not the same thing as going under (see eyeUnderwater). */
  const swimCam=state.mode==='walk'&&state.walk.inWater;
  const lift=state.mode==='deck'?5:swimCam?2.2:8;
  const cy=baseY+lift+spit*dist;
  camPos.set(px+Math.sin(az)*cpit*dist, cy, pz+Math.cos(az)*cpit*dist);
  /* ---- THE BED OF THE SEA IS GROUND ----
     The eye follows the diver from behind and a little below his line; swim
     down to the floor and touch it, and the eye went straight ON THROUGH — out
     the underside of the world, where the bed hangs overhead as a brown ceiling
     and the whole deep is seen from beneath it. The bed is ground: the eye
     rides over it, as it rides over the land ashore. It is lifted at the
     TARGET so the follow settles above the floor rather than fighting it, and
     again after the ease so no lag can carry it under. */
  if(state.mode==='dive'||swimCam){
    /* ---- NOTHING STANDS BETWEEN THE EYE AND THE DIVER ----
       Lifting the eye over the bed was the only law, so with a cliff at the
       diver's back the eye was hoisted up the far side of it — or sat inside
       the stone — and the swimmer was lost from the view. The line from the
       diver to the eye is now WALKED, and the moment it would pass into the
       bed the eye is drawn in along it, just short of the stone: the diver
       is always in sight, and no wall is ever crossed. */
    const ox=px, oy=baseY+8, oz=pz;
    let clear=1;
    for(let k2=1;k2<=12;k2++){ const f3=k2/12;
      const sx=ox+(camPos.x-ox)*f3, sy=oy+(camPos.y-oy)*f3, sz=oz+(camPos.z-oz)*f3;
      const lc3=landAtWorld(sx,sz);
      const fl3=Math.max(seabedDepth(sx,sz), lc3?lc3.h*B:-1e9);
      if(sy<fl3+2.5){ clear=Math.max(0.08,(k2-1)/12); break; } }
    if(clear<1){
      camPos.x=ox+(camPos.x-ox)*clear;
      camPos.y=oy+(camPos.y-oy)*clear;
      camPos.z=oz+(camPos.z-oz)*clear; }
    const lc=landAtWorld(camPos.x,camPos.z);
    const floor=Math.max(seabedDepth(camPos.x,camPos.z), lc?lc.h*B:-1e9)+4.0;
    if(camPos.y<floor) camPos.y=floor;
  }
  /* ---- NOTHING STANDS BETWEEN THE EYE AND THE TRAVELLER, ON LAND OR IN
     THE AIR EITHER ----
     The dive already walked the line from the diver to the eye; ashore and
     aloft the eye only ever tested the ground of its OWN column, so a ridge
     or a pyramid lying BETWEEN the two swallowed the camera whole — the
     whole screen went mountain. The same line-walk runs everywhere now,
     against the ground AND the standing masonry of the landmarks: the eye
     is drawn in along the sight-line just short of the first thing that
     would block it, and it never sits inside anything.

     ---- AND IT RANG LIKE A BELL, WHICH IT NO LONGER DOES ----
     Three faults stood in this, and every one of them showed as shaking:

       IT WAS LAID ON AFTER THE FOLLOW. The pull-in was applied to the
       camera once the ease had already moved it, and the sight-line was
       cast out to WHERE THE CAMERA HAD GOT TO. So the eye pulled itself in,
       the next frame's ease pushed it back out toward the seat it wanted,
       and that longer line found a different answer and pulled it in again
       — a loop that could not settle for as long as you stood by the rock.
       The line is now cast to the eye's true SEAT, which does not move
       under it, the share is applied to the SEAT, and the follow eases
       ONCE, at the end. There is nothing left to ring against.

       IT STOOD ON RUNGS. The walk took the last CLEAR sample of fourteen
       and sat there, so the boom could only ever be one of fourteen
       lengths. A step sideways that moved the blocking sample by a single
       rung moved the eye by a fourteenth of the whole zoom IN ONE FRAME.
       That is the shimmer. The face of the stone is now found between the
       rungs by halving, and the length of the boom is a smooth thing.

       AND IT COULD NOT COME IN. The floor on the pull-in was a THIRD OF
       THE ZOOM, so drawn well back the eye could not come nearer than a
       hundred units however close the mountain was — and simply sat inside
       the thing it was meant to be kept out of. The floor is measured in
       UNITS now, off the traveller's own shoulder. */
  /* (the deep keeps its own law, above — and the boom is handed back whole
     while he is under, so it is not still half drawn-in when he comes out) */
  if(state.mode==='dive'||swimCam) camClear=1;
  else {
    const ox=px, oy=baseY+9, oz=pz;
    /* what stops the sight-line: the ground and the ancients' masonry (1) —
       and now the TREES (2) and the HOUSES (3), which the eye used to pass
       clean through (player-reported: the camera inside homes, foliage and
       hillsides). The KIND is returned, because the answer to a hill and
       the answer to a house are not the same. */
    const blocked=(sx,sy,sz)=>{ const lc4=landAtWorld(sx,sz);
      if(sy<(lc4?lc4.h*B:WATER_Y)+2.0) return 1;
      if(landmarkSolidAt(sx,sz,sy-1.2,sy+1.2)) return 1;
      if(lc4&&lc4.tree&&sy<treeTopAt(sx,sz,lc4)+0.8) return 2;
      return sy<houseTopAt(sx,sz)+0.6?3:0; };
    let want=1, kindHit=0;
    /* (skipped once the map-fade owns the pitch — the near-overhead eye of
       the whole-earth band crosses no ridge, and the walk only wobbled it) */
    if(zf<0.02){
      const N=18, dx4=camPos.x-ox, dy4=camPos.y-oy, dz4=camPos.z-oz;
      for(let k2=1;k2<=N;k2++){ const f3=k2/N;
        const c0=blocked(ox+dx4*f3,oy+dy4*f3,oz+dz4*f3); if(!c0) continue;
        let lo=(k2-1)/N, hi=f3; kindHit=c0;         /* the face lies between these two */
        for(let b2=0;b2<6;b2++){ const mid=(lo+hi)*0.5;
          const cm=blocked(ox+dx4*mid,oy+dy4*mid,oz+dz4*mid);
          if(cm){ hi=mid; kindHit=cm; } else lo=mid; }
        want=lo; break; }
      if(want<1){
        /* a hand's breadth short of the stone — and never in past the
           traveller's own shoulder (the ship being a far larger body than a
           man, the eye keeps further off her). But a HOUSE or a TREE right
           at the traveller's back is not a hillside: held at the shoulder
           floor the eye sat inside the thing and was hoisted onto its roof,
           and the whole frame was rafters. Against a standing structure the
           eye comes in as near as it must, and the traveller stays in it —
           and its step back from the face is a HAND'S BREADTH IN UNITS, not
           a share of the whole boom (a share re-entered the wall band from
           any distance, and the floor hoisted the eye onto the roof anyway). */
        const minD=(kindHit>=2)?3.4:(state.mode==='boat'?34:state.mode==='deck'?14:9);
        const back=(kindHit>=2)?1.0/Math.max(dist,1):0.015;
        want=Math.max(Math.min(0.92,minD/Math.max(dist,minD)),want-back); }
      /* ---- AND THE EYE'S OWN COLUMN STANDS CLEAR OF THE HOMES ----
         A house on a terrace can win the sight-line walk as GROUND (the
         terrace at its foot blocks first), which kept the terrain's wider
         shoulder floor — parking the eye's column inside the wall band,
         where the camera-floor then walked it up onto the roof and the
         whole frame was rafters. The boom is drawn in, a step at a time,
         until the column stands off every house footprint; the traveller
         himself stays in the frame, in front of his own wall. */
      if(want<1){
        const runXZ=Math.max(1,Math.sqrt(dx4*dx4+dz4*dz4));
        const wMin=Math.min(0.5,2.4/Math.max(dist,2.4));
        for(let g2=0;g2<10&&want>wMin+0.001;g2++){
          const ht=houseTopAt(ox+dx4*want,oz+dz4*want);
          if(ht<=-1e8||oy+dy4*want>ht+1.2) break;   /* clear ground, or clear OVER the ridge */
          want=Math.max(wMin,want-1.6/runXZ); }
      }
    }
    /* eased, and never snapped: QUICKLY IN, so no stone ever crosses the
       lens, and SLOWLY OUT, so the view opens again without a lurch.
       The bottom of the ease is measured in UNITS, not in shares: two
       hundredths of a long boom is eight units, which quietly stood the
       eye back inside the very wall the walk had just come in short of. */
    const clearMin=Math.min(0.5,2.4/Math.max(dist,2.4));
    camClear+=(want-camClear)*Math.min(1,dt*(want<camClear?16:2.6));
    camClear=camClear>1?1:camClear<clearMin?clearMin:camClear;
    if(camClear<0.999){
      camPos.x=ox+(camPos.x-ox)*camClear;
      camPos.y=oy+(camPos.y-oy)*camClear;
      camPos.z=oz+(camPos.z-oz)*camClear; }
    /* and the pitch being free to look UP, the ground itself is its floor:
       the eye settles just over the grass, the planks or the water — let up
       and down at a pace, never snapped (see camFloor). A gap too wide to be
       a step at all — a landfall, a mode change, the eye swung right round —
       is taken whole, since a slow climb through a hillside is worse than
       one honest jump. */
    const fWant=solidTopAt(camPos.x,camPos.z,camPos.y+0.5)+1.6;
    /* ONLY THE RISE IS PACED. Ground falling away beneath the eye cannot
       kick it — the floor simply stops holding it, and the follow-ease
       carries it down. Pacing the fall as well was worse than useless: off
       the shoulder of a mountain the floor lagged the true ground by
       hundreds of units, held the eye up in the air behind a falling man,
       and then dropped it the whole way at once when the gap grew too wide
       to be a step. (Measured: a 453-unit kick in a single frame, where the
       thing it was meant to cure was six.) So it falls freely, and climbs
       at a pace — quick enough to stay ahead of a walking man, who crosses
       a column every third of a second, and quicker still when the gap is
       no mere step at all, so a landfall on a mountainside is not spent
       climbing out of the hill. */
    if(camFloor<-1e8||fWant<camFloor) camFloor=fWant;
    else camFloor+=Math.min(fWant-camFloor,Math.max(48*dt,(fWant-camFloor)*0.30));
    let floor=camFloor;
    if(state.mode==='deck') floor=Math.max(floor,baseY+0.8);   /* never under the planks */
    if(camPos.y<floor) camPos.y=floor;
    /* nor within the hull, when the eye comes down at the ship's side */
    if((state.mode==='boat'||state.mode==='deck')&&camInsideShip(camPos.x,camPos.y,camPos.z))
      camPos.y=Math.max(camPos.y,boatG.position.y+SD.qdeckY+3.0);
  }
  /* far out, a near plane of one unit against a 384,000-unit far plane leaves
     the depth buffer nothing to work with and the world z-fights — open it
     with the distance. But with the distance the eye TRULY sits at, now that
     it has been drawn in: reckoned off the full length of the boom, a near
     plane six units out cut clean through the face of the very rock the eye
     had just been pulled in against, and the world was seen through the
     stone. That is the other half of the shimmer. */
  if(!camInside){
    const wantNear=Math.max(1,Math.min(600,
      Math.hypot(camPos.x-px,camPos.y-baseY,camPos.z-pz)*0.02));
    if(Math.abs(camera.near-wantNear)>Math.max(0.5,camera.near*0.15)){
      camera.near=wantNear; camera.updateProjectionMatrix(); } }
  camera.position.lerp(camPos,Math.min(1,dt*5));
  if(state.mode==='dive'||swimCam){ const cp=camera.position;
    const lc=landAtWorld(cp.x,cp.z);
    const floor=Math.max(seabedDepth(cp.x,cp.z), lc?lc.h*B:-1e9)+3.0;
    if(cp.y<floor) cp.y=floor;
  }
  /* a last one-sided catch, so a floor that rises under the ease is never
     walked through. It is set against the PACED floor and not the true one:
     against the true one it was itself the worst snapper in the whole camera
     — it fired exactly when the ground jumped a block, and threw the eye up
     the block in one frame. Against the paced floor it can only ever lift the
     eye by what the pace allows, and it never presses down, so it cannot ring
     against the follow either. */
  else { const cp=camera.position;
    if(cp.y<camFloor-0.4) cp.y=camFloor-0.4; }
  /* the eye stays WITHIN the firmament — never through the glass, whatever
     the pitch: pressed back inside the tent-vault's skin. (Drawn right back
     to behold the whole earth, the eye stands outside the vault of set
     purpose, as it does in the firmament view — so the skin is not pressed
     upon it there.) */
  /* (the vault now hugs the world's edge, so this may no longer press the eye
     back at nine-tenths of the way out — that would shove the camera six
     thousand units inland the moment the traveller stood on the ice. It
     holds the eye just inside the glass itself and no further.) */
  if(zf<0.02){ const cp=camera.position;
    const q=(cp.x*cp.x+cp.z*cp.z)/(R_DOME*R_DOME)+(cp.y>0?(cp.y*cp.y)/(H_DOME*H_DOME):0);
    if(q>0.995){ const k=Math.sqrt(0.995/q); cp.x*=k; cp.z*=k; if(cp.y>0) cp.y*=k; } }
  camTgt.set(px,baseY+(swimCam?4:10),pz);
  camera.lookAt(camTgt);
}

/* ================= HUD ================= */
function toast(txt,ref){ const vt=$('verse-t'), vr=$('verse-r'), v=$('verse');
  if(!vt||!v) return;              /* a host page may carry no verse line at all */
  vt.textContent=txt; if(vr) vr.textContent=ref||'';
  v.style.opacity=1;
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
    const m=Math.max(0,Math.round((SEA_SURF-state.dive.y)/U_PER_M));
    const onFloor=state.dive.y<=seabedDepth(state.dive.x,state.dive.z)+30;
    /* upon the floor of a NAMED trench, the trench is named */
    let where=onFloor?'THE FLOOR OF THE DEEP':'IN THE '+seaZone(m);
    if(onFloor){ const nd=nearestDeep(state.dive.x,state.dive.z);
      if(nd&&nd.d<nd.deep.R*0.55) where=nd.deep.n.toUpperCase(); }
    txt = where+' — '+m.toLocaleString()+' M DOWN'; }
  else if(r>0.9){
    txt = r>=ICE_UV+WALL_CLIMB*(0.995-ICE_UV) ? 'THE CROWN OF THE ICE — 2,000 FT ABOVE THE SEA' : 'THE WALL OF ICE';
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
  /* the hour HERE, on a twelve-hour face, and the name of that hour */
  const pp=playerXZ(), lh=localHourAt(pp.x,pp.z);
  /* THREE LINES, never four: the panel sits above the button rail, and a
     fourth line pushed it down onto the top button at every screen size. */
  /* the season HERE, at the traveller's own latitude (flipped for the south,
     wet/dry in the tropics) \u2014 and a mark if he is holding the year by hand */
  let seasonLabel='';
  if(window.SEASON){ const latN=1-Math.hypot(pp.x,pp.z)/R_WORLD*2;
    seasonLabel=' \u00b7 '+SEASON.seasonAt(latN,dayOfYear()).name+(SEASON.isNatural()?'':'*'); }
  $('clock').innerHTML='DAY '+dayOfYear()+' OF 364'+seasonLabel+'<br>'+clockFace(lh)
    +' \u00b7 '+dayPartName(lh)+'<br>'+SPEEDS[state.speedIdx][1]+' \u00b7 '+windLabel();
}

/* ================= THE FACE OF THE EARTH =================
   ONE texture for every view that looks upon the whole world: the charted
   face seen from aloft or from a drawn-back eye, and the disc set in the
   firmament view. It is the azimuthal-equidistant projection of the true
   country outlines — laid as BRICKS with studs upon them, as everything in
   this world is made — coloured by its clime, with the shelf shoaling round
   every coast, the borders of the nations faint over it, the two tropics and
   the equator in dashed gold, and the wall of ice about the rim. */
function earthBiome(lat,lon,n){
  if(lat>72 || (lat>60&&lon>-75&&lon<-12)) return ['#e6ebf2','#f4f7fb'];        /* the ice of the north */
  if(lat>62) return n<.5?['#8a9a74','#9aa984']:['#7f9070','#8f9f80'];           /* tundra */
  const desert=(lat>10&&lat<34&&lon>-17&&lon<62)||(lat>18&&lat<33&&lon>62&&lon<76)||
    (lat>-33&&lat<-17&&lon>112&&lon<147)||(lat>-29&&lat<-17&&lon>11&&lon<26)||
    (lat>-28&&lat<-16&&lon>-73&&lon<-65)||(lat>34&&lat<47&&lon>76&&lon<108);
  if(desert) return n<.5?['#cfb26a','#dcc17c']:['#c6a75e','#d4b671'];           /* the dry lands */
  if(lat>-13&&lat<9) return n<.5?['#3f7a35','#4b8a40']:['#356c2e','#417c38'];   /* the rain forests */
  return n<.34?['#6a9a4a','#78a857']:(n<.67?['#5f8f42','#6d9d4f']:['#74a352','#82b160']);
}
let _earthTex=null;
function buildEarthTex(){
  if(_earthTex) return _earthTex;
  const N4=2048, Tc=N4/2, Tr=N4/2;
  /* 1) the land mask, from the real country polygons */
  const M=texCanvas(N4,N4), mg=M.getContext('2d');
  mg.fillStyle='#000'; mg.fillRect(0,0,N4,N4);
  mg.fillStyle='#fff';
  for(const c of COUNTRIES) for(const ring of c.p){
    mg.beginPath();
    for(let i=0;i<ring.length;i++){ const x=Tc+ring[i][0]*Tr, y=Tc+ring[i][1]*Tr;
      i?mg.lineTo(x,y):mg.moveTo(x,y); }
    mg.closePath(); mg.fill(); }
  const mask=mg.getImageData(0,0,N4,N4).data;
  /* 2) lay the studs, brick by brick */
  const c4=texCanvas(N4,N4), t=c4.getContext('2d');
  const CELL=8, N=N4/CELL;
  const land=new Uint8Array(N*N);
  for(let j=0;j<N;j++) for(let i=0;i<N;i++){
    const px=(i*CELL+CELL/2)|0, py=(j*CELL+CELL/2)|0;
    land[j*N+i]=mask[(py*N4+px)*4]>128?1:0; }
  for(let j=0;j<N;j++) for(let i=0;i<N;i++){
    const x=i*CELL, y=j*CELL;
    const u=(x+CELL/2-Tc)/Tr, v=(y+CELL/2-Tc)/Tr;
    const r=Math.hypot(u,v);
    if(r>1.004) continue;                                  /* beyond the rim: nothing */
    const n=hash2(i*1.13,j*2.07);
    const lat=90-r*180, lon=Math.atan2(u,v)*180/Math.PI;
    let base,lit;
    if(r>ICE_UV){ base=n<.5?'#dfe7ee':'#eef3f8'; lit='#ffffff'; }   /* the wall of ice */
    else if(land[j*N+i]){ const b=earthBiome(lat,lon,n); base=b[0]; lit=b[1]; }
    else { const shelf=(land[j*N+i-1]||land[j*N+i+1]||land[(j-1)*N+i]||land[(j+1)*N+i]);
      base=shelf?'#4a7fae':(n<.5?'#2f5f92':'#356a9e'); lit=shelf?'#5f92bd':'#4478a8'; }
    t.fillStyle=base; t.fillRect(x,y,CELL,CELL);
    t.fillStyle=lit;  t.fillRect(x,y,CELL,1.6);            /* the lit top edge of the brick */
    t.fillStyle='rgba(0,0,0,.16)'; t.fillRect(x+CELL-1.4,y,1.4,CELL);
    t.beginPath(); t.arc(x+CELL/2,y+CELL/2,CELL*.30,0,Math.PI*2);      /* the stud */
    t.fillStyle='rgba(255,255,255,.10)'; t.fill();
    t.beginPath(); t.arc(x+CELL/2,y+CELL/2+.8,CELL*.30,0,Math.PI*2);
    t.strokeStyle='rgba(0,0,0,.10)'; t.lineWidth=1; t.stroke(); }
  /* 3) the borders of the nations, faint over the bricks */
  t.strokeStyle='rgba(20,16,8,.32)'; t.lineWidth=2.2; t.lineJoin='round';
  for(const c of COUNTRIES) for(const ring of c.p){
    t.beginPath();
    for(let i=0;i<ring.length;i++){ const x=Tc+ring[i][0]*Tr, y=Tc+ring[i][1]*Tr;
      i?t.lineTo(x,y):t.moveTo(x,y); }
    t.closePath(); t.stroke(); }
  /* 4) the rivers, threading inland from the coasts */
  t.strokeStyle='rgba(46,95,142,.75)'; t.lineWidth=2.6; t.lineCap='round';
  for(const rv of RIVERS){ t.beginPath();
    rv.pts.forEach((p,k)=>{ const rr=(90-p[0])/180, a=p[1]*Math.PI/180;
      const x=Tc+rr*Math.sin(a)*Tr, y=Tc+rr*Math.cos(a)*Tr;
      k?t.lineTo(x,y):t.moveTo(x,y); });
    t.stroke(); }
  /* 5) the courses of the sun: the two tropics and the equator */
  for(const [rr,al] of [[.37,.16],[.5,.10],[.63,.16]]){
    t.beginPath(); t.arc(Tc,Tc,rr*Tr,0,Math.PI*2);
    t.strokeStyle='rgba(232,198,106,'+al+')'; t.lineWidth=3; t.setLineDash([16,22]); t.stroke();
    t.setLineDash([]); }
  /* 6) the rim of the deep, where the ice meets the sea */
  t.beginPath(); t.arc(Tc,Tc,ICE_UV*Tr,0,Math.PI*2);
  t.strokeStyle='rgba(220,235,245,.35)'; t.lineWidth=4.5; t.stroke();
  _earthTex=new THREE.CanvasTexture(c4); _earthTex.anisotropy=8;
  return _earthTex;
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
/* noMark — the charted face laid under the whole earth carries no traveller's
   arrow of its own. Drawn into the texture it was a fixed span of WORLD, so
   it stood a proper size only when the whole disc filled the view and swelled
   into a great yellow wedge at every zoom short of that. A sprite scaled to
   the eye's distance stands in its place (see aloftMark). */
function drawMapInto(ctx2,size,withNames,noMark){
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
  /* and the MOON'S station beside it — the chart knew where the sun stood
     and not the moon, though the helper had waited unused all along */
  const [mu,mv]=moonUV();
  ctx2.beginPath(); ctx2.arc((mu+1)*Hh,(mv+1)*Hh,Math.max(2.4,size/150),0,Math.PI*2);
  ctx2.fillStyle='#cfd8e8'; ctx2.fill();
  if(noMark) return;
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
/* ---- THE TRAVELLER'S HAND ON THE YEAR (the K key) ----
   Step round the ring — Spring, Summer, Autumn, Winter, and back to the year's
   own natural course — and the whole world answers: the leaves gild or green,
   the snow lies or melts, and the beasts take their season. What the traveller
   sets is the NORTHERN season; where he himself stands may be the other half
   of the year, and the word tells him which. */
function updateSeasonBtn(){ const b=$('b-season'); if(!b||!window.SEASON) return;
  const n=SEASON.overrideName();
  b.textContent='🍂 Season: '+(n==='Natural'?'natural':n.toLowerCase());
  b.classList.toggle('off',false); }
function cycleSeason(){ if(!window.SEASON) return;
  const r=SEASON.cycle();
  updateSeasonBtn(); saveState();
  const pp=playerXZ(), latN=1-Math.hypot(pp.x,pp.z)/R_WORLD*2;
  const here=SEASON.seasonAt(latN,dayOfYear()), z=here.zone;
  const where=' · '+here.name+(z==='tropical'?' (the tropics keep no winter)':z==='polar'?' (the far cold)':'')+' where you stand';
  toast(r==='Natural'?('The year runs its own course again'+where+'.')
                     :('You turn the year to '+r+where+'.'));
}
function sizeBig(){ const bc=$('bigcv'); const s=Math.floor(Math.min(innerWidth,innerHeight)*0.86);
  bc.width=bc.height=s; drawMapInto(bc.getContext('2d'),s,true); }
$('bigmap').addEventListener('click',toggleMap);

/* ================= PERSISTENCE =================
   localStorage first (works everywhere, incl. GitHub Pages); the sandboxed
   window.storage API is kept as a secondary channel where it exists. */
const SAVE_KEY='voyage:state';
async function saveState(){
  /* NOTHING IS WRITTEN BEFORE THE VOYAGE BEGINS. The menu's options lean on
     the rail buttons, and several of those save on click — fired before
     begin() they would write the menu's empty stand-in state straight over
     a real voyage. (The error handler saves too, and a fault at the menu
     must not wash the log away either.) */
  if(!running) return;
  const payload=JSON.stringify({v:7,R:R_WORLD,x:state.boat.x,z:state.boat.z,h:state.boat.heading,
    t:state.simHours,m:state.mode==='walk'?'walk':'boat',wx:state.walk.x,wz:state.walk.z,wh:state.walk.heading,
    vis:[...state.visited],d:Math.round(state.dist),wm:state.windMode,fi:state.fish||0,
    co:state.coins,cg:state.cargo,gm:state.game||0,ib:state.immBreath?1:0,pe:state.pearls||0,rp:state.repel?1:0,rr:state.rep||{},wl:[...wreckLooted],
    /* v7: the PLACES of the gathered pearls. The count was kept and the sites
       were not, so every reload regrew every pearl bed — one seabed tile was
       an unbounded silver farm. */
    pt:[...pearlTaken],vf:state.vf||0,dp:state.dayIdx,fr:state.freeroam?1:0,
    /* the scrolls gathered — SCRIPTURE UNFOLDS reads the same log, and
       opens the passage of every scroll that has been found */
    sr:[...scrollTaken],
    /* the chosen season was the one rail toggle NOT saved - every reload
       silently turned the year back to Natural */
    sn:(window.SEASON&&!SEASON.isNatural())?SEASON.overrideName():null});
  try{ localStorage.setItem(SAVE_KEY,payload); }catch(e){}
  try{ if(window.storage) await window.storage.set(SAVE_KEY,payload); }catch(e){}
}
async function loadSaved(){
  let raw=null;
  try{ if(window.storage){ const r=await window.storage.get(SAVE_KEY); if(r&&r.value) raw=r.value; } }catch(e){}
  if(!raw){ try{ raw=localStorage.getItem(SAVE_KEY); }catch(e){} }
  try{ const o=JSON.parse(raw); if(o&&o.v>=2&&o.v<=7){
    /* a voyage saved when the world was narrower is carried to the SAME
       SPOT ON THE MAP: places scale with the radius they were kept at */
    const sc=R_WORLD/(o.R||120000);
    if(sc!==1){ o.x*=sc; o.z*=sc;
      if(o.wx!==undefined) o.wx*=sc; if(o.wz!==undefined) o.wz*=sc; }
    return o; } }catch(e){}
  return null;
}

/* ================= BUTTONS ================= */
/* ---- THE POWERS THAT BELONG TO FREE ROAM ALONE ----
   One list, obeyed by the rail, by the keyboard and by the menu, so the
   three can never disagree about what a voyage may and may not do. */
const FREEROAM_ONLY=['b-fly','b-time','b-speed','b-daypart','b-season'];
/* The gate is a BODY CLASS and a stylesheet rule, never an inline display:
   updateFlyBtn sets its own inline display on b-fly whenever the mode
   changes, and an inline style beats anything set here — so the Rise Up
   button came back on a voyage the moment the traveller went ashore. */
function applyFreeroam(){ D.body.classList.toggle('roaming',!!state.freeroam); }
/* and the keys those buttons stand for are shut with them */
function roamOnly(what){
  if(state.freeroam) return true;
  toast('That belongs to FREE ROAM. On a voyage the world keeps its own hours, its own seasons and its own weather \u2014 and the only way up is the mast.');
  return false;
}

/* ---- A TRUE PAUSE ----
   'Hold the sun' only pinned the hour; the beasts, the sea and the ship all
   ran on. This stops the whole simulation dead — nothing ticks, nothing
   moves, nothing hunts — and gives it back exactly as it stood. */
let gamePaused=false;
function setPaused(p){ if(gamePaused===p) return; gamePaused=p;
  const el=$('paused'); if(el) el.style.display=p?'flex':'none';
  const b=$('b-pause'); if(b){ b.textContent=p?'▶ Carry on':'⏸ Pause the game';
    b.classList.toggle('off',p); }
  if(AC){ if(p) AC.suspend(); else if(audioOn) AC.resume(); }
}
function togglePause(){ if(!running) return; setPaused(!gamePaused); }
$('b-pause').onclick=togglePause;
/* ---- AND THE PAUSE IS A WAY OUT, NOT ONLY A WAY TO STAND STILL ----
   The log is written first, so nothing of the voyage is lost, and the world
   itself is left standing exactly as it is — it was built once and there is
   no reason on earth to build it again to show a menu over it. */
function backToMenu(){
  if(!running) return;
  saveState();
  setPaused(false);
  running=false; _begun=false; _launching=false;
  D.body.classList.add('pregame');
  const el=$('paused'); if(el) el.style.display='none';
  if(cut) endScene();
  if(state.firm) exitFirm();
  loadSaved().then(sv=>{ menuSave=sv;
    const c=$('m-continue'); if(c) c.style.display=sv?'block':'none';
    const l=$('m-list'), cf=$('m-confirm');
    if(l) l.style.display='flex'; if(cf) cf.style.display='none';
    openMenu(); });
}
{ const pm=$('p-menu');
  if(pm) pm.onclick=e=>{ e.stopPropagation(); backToMenu(); }; }
$('paused').addEventListener('click',()=>setPaused(false));
$('b-time').onclick=()=>{ state.paused=!state.paused;
  $('b-time').textContent=state.paused?'\u25B6 Loose the sun':'\u23F8 Hold the sun';
  $('b-time').classList.toggle('off',state.paused); };
/* the button reads its word off the STATE, and is set from it at boot \u2014 the
   label used to be written into the page by hand, so the two could disagree
   and did: it said one course while the ship kept another */
/* ---- THE RAIL FOLDS AWAY ON A NARROW SCREEN ----
   It begins folded there, so the traveller's first sight is the world and
   not a wall of buttons; on a wide screen it is always out and the ☰ is
   never shown. Turning a telephone on its side gives it back. */
function railFits(){ return innerWidth>900; }
/* opening OR closing with the width — it only ever opened before, so turning
   a phone back upright left the full wall of buttons across half the screen */
let _railWide=railFits();
function syncRail(){ const wide=railFits();
  if(wide) D.body.classList.remove('rail-shut');
  else if(_railWide) D.body.classList.add('rail-shut');
  _railWide=wide; }
$('b-rail').onclick=()=>{ D.body.classList.toggle('rail-shut'); };
if(!railFits()) D.body.classList.add('rail-shut');
addEventListener('resize',syncRail);
function updateSpeedBtn(){ $('b-speed').textContent='\u23E9 Course: '+SPEEDS[state.speedIdx][1]; }
$('b-speed').onclick=()=>{ state.speedIdx=(state.speedIdx+1)%SPEEDS.length; updateSpeedBtn(); };
updateSpeedBtn();
/* ---- THE TIME OF THE DAY ----
   The traveller chooses the hour he sails in: the morning, the noon, the
   evening, the night \u2014 or LIVE, which takes the hour off the clock of the
   machine he is playing on, so the game's sky keeps the same time as the
   room he is sitting in. Live re-reads that clock as it runs, so an
   afternoon's play carries him into a real evening. */
function updateDayBtn(){ $('b-daypart').textContent='\uD83D\uDD51 Time of day: '+DAYPARTS[state.dayIdx].n; }
function applyDayPart(){
  const D2=DAYPARTS[state.dayIdx], p=playerXZ();
  if(D2.k==='live'){ const d=new Date();
    setLocalHour(d.getHours()+d.getMinutes()/60+d.getSeconds()/3600, p.x, p.z); }
  else setLocalHour(D2.h, p.x, p.z);
}
$('b-daypart').onclick=()=>{ state.dayIdx=(state.dayIdx+1)%DAYPARTS.length;
  updateDayBtn(); applyDayPart(); saveState();
  const D2=DAYPARTS[state.dayIdx];
  toast(D2.k==='live'
    ? 'The sky now keeps your own clock \u2014 the hour in the game is the hour where you sit.'
    : 'You set out in the '+D2.n+'.'); };
updateDayBtn();
$('b-map').onclick=toggleMap;
$('b-season').onclick=()=>{ if(roamOnly()) cycleSeason(); };
updateSeasonBtn();
$('b-ashore').onclick=toggleAshore;
$('b-fly').onclick=()=>{ if(roamOnly()) takeFlight(); };
$('b-dive').onclick=enterDive;
function updateBreathBtn(){ $('b-breath').textContent='🫧 Breath: '+(state.immBreath?'immortal':'mortal'); }
$('b-breath').onclick=()=>{ state.immBreath=!state.immBreath; updateBreathBtn();
  if(state.immBreath) toast('“The Ruach of Aluah has made me, and the breath of the Almighty gives me life.” You will not want for air beneath the waves.','IYOB 33:4');
  else toast('Your breath is your own again — watch the bar below, and rise to breathe.');
  saveState(); };
function updateRepelBtn(){ $('b-repel').textContent='🛡 Repel beasts: '+(state.repel?'on':'off'); }
{ const bt=$('b-torch'); if(bt) bt.onclick=()=>setTorch(!TORCH.on); }
updateTorchBtn();
$('b-repel').onclick=()=>{ state.repel=!state.repel; updateRepelBtn();
  if(state.repel) toast('“You shall tread upon the lion and the adder…” — no beast of the deep will touch you.','TEHILLIM 91:13');
  else toast('The beasts of the deep are wild again — mind the great grey shapes.');
  saveState(); };
$('b-net').onclick=toggleNet;
(function(){ const up=$('fp-up'), dn=$('fp-dn'); if(!up||!dn) return;
  function bind(el,val){ el.addEventListener('pointerdown',e=>{ e.preventDefault(); flyPad=val; });
    const off=()=>{ if(flyPad===val) flyPad=0; };
    el.addEventListener('pointerup',off); el.addEventListener('pointercancel',off); el.addEventListener('pointerleave',off); }
  bind(up,1); bind(dn,-1);
  /* and any pointer-up ANYWHERE lets go of the pad — a button hidden mid-press
     (display:none) never receives its own up, and the press held for ever */
  addEventListener('pointerup',()=>{ flyPad=0; });
  addEventListener('pointercancel',()=>{ flyPad=0; }); })();
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
    'Fish drawn from the deep: <b>'+(state.fish||0)+'</b> · Game taken by the spear: <b>'+(state.game||0)+'</b> · Pearls: <b>'+(state.pearls||0)+'</b><br>'+
    'Scrolls gathered: <b>'+scrollTaken.size+' / '+SCROLLS.filter(x=>!x.gone).length+'</b>'+
      (function(){ const nx=nextScroll();
        return nx?' \u2014 next: <b>'+nx.name+'</b>, in '+nx.country:' \u2014 <b>all found</b>'; })()+'<br>'+
    'Day of the voyage: <b>'+dayOfYear()+'</b><br>'+
    (function(){ const nl=nextLandfall();
      return nl?('Next landfall: <b>'+nl.n+'</b> — away to the <b>'+nl.dir+'</b>, some '+nl.km.toLocaleString()+' km over the deep.')
               :'<b>The voyage is fulfilled</b> — every land under the shamayim is written in this log.'; })();
  $('log-lands').textContent=names.length?names.join(' \u00B7 '):'No land yet \u2014 the deep awaits.';
}
$('b-log').onclick=toggleLog;
{ const gb=$('b-guide'); if(gb) gb.onclick=toggleGuide; }
updateGuideBtn();
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
  /* a gain that is not a number is not a quiet sea — it THROWS, out of the
     tick and out of the whole frame with it, and the world stands still
     with its last picture on the glass. Whatever comes in, what goes to
     the ear is a number between silence and full. */
  const num=(v,d)=>isFinite(v)?v:d;
  const sp=Math.abs(num(state.boat.speed,0)), st=Math.max(0,Math.min(1,num(storm,0)));
  seaGain.gain.value=(state.mode==='boat'?0.11+Math.min(0.08,sp/500):0.045)*swell;
  windGain.gain.value=0.015+Math.min(0.06,sp/900)+st*0.1;
}
$('b-sound').onclick=()=>{
  audioOn=!audioOn;
  if(AC){ if(audioOn) AC.resume(); else AC.suspend(); }
  $('b-sound').textContent='🔊 Sound: '+(audioOn?'on':'off');
  $('b-sound').classList.toggle('off',!audioOn); };

/* ================= THE LIVING WORLD =================
   The small true things that make the earth feel dwelt-in, after the manner
   of the great open worlds: weather you can feel, smoke over the hearths,
   fireflies in the evening grass, chance meetings on the deep, dolphins at
   the bow, gulls with the ship, the murmur of the living, and an end to the
   voyage worth reaching. */

/* ---- RAIN & THUNDER — the storm is no longer only a darkening ---- */
const RAIN_N=800, RAIN_BOX=240, RAIN_TOP=170;
const rainGeo=new THREE.BufferGeometry();
{ const rp=new Float32Array(RAIN_N*3);
  for(let i=0;i<RAIN_N;i++){ rp[i*3]=(Math.random()-0.5)*2*RAIN_BOX; rp[i*3+1]=Math.random()*RAIN_TOP; rp[i*3+2]=(Math.random()-0.5)*2*RAIN_BOX; }
  rainGeo.setAttribute('position',new THREE.BufferAttribute(rp,3)); }
const rainMat=new THREE.PointsMaterial({color:0xa9c2d8,size:1.4,transparent:true,opacity:0,depthWrite:false,fog:true,sizeAttenuation:true});
const rain=new THREE.Points(rainGeo,rainMat); rain.frustumCulled=false; rain.visible=false; scene.add(rain);
const _boltWhite=new THREE.Color(0xeaf2ff);
let boltT=6, boltFlash=0;
function thunderClap(){ if(!AC||!audioOn) return;
  try{ const dur=1.6, sr=AC.sampleRate, buf=AC.createBuffer(1,sr*dur,sr), d=buf.getChannelData(0);
    for(let i=0;i<d.length;i++){ const tt=i/sr; d[i]=(Math.random()*2-1)*Math.exp(-tt*3.0)*(tt<0.05?tt/0.05:1); }
    const src=AC.createBufferSource(); src.buffer=buf;
    const lp=AC.createBiquadFilter(); lp.type='lowpass'; lp.frequency.value=380;
    const g2=AC.createGain(); g2.gain.value=0.5;
    src.connect(lp); lp.connect(g2); g2.connect(AC.destination); src.start();
  }catch(e){} }
function weatherTick(px,pz,dt,storm){
  const wet=Math.max(0,(storm-0.22)/0.78);
  const inHold=state.mode==='deck'&&state.deck.level==='hold';
  const show=wet>0.02&&state.mode!=='dive'&&!state.firm&&!inHold;
  rain.visible=show;
  if(show){
    rainMat.opacity=Math.min(0.6,wet*0.8);
    rain.position.set(px,0,pz);
    const w=windAt(px,pz), a=rainGeo.attributes.position.array;
    for(let i=0;i<RAIN_N;i++){ const j=i*3;
      a[j+1]-=(140+(i%9)*9)*dt; a[j]+=w.x*36*dt; a[j+2]+=w.z*36*dt;
      if(a[j+1]<0) a[j+1]+=RAIN_TOP;
      if(a[j]>RAIN_BOX)a[j]-=2*RAIN_BOX; else if(a[j]<-RAIN_BOX)a[j]+=2*RAIN_BOX;
      if(a[j+2]>RAIN_BOX)a[j+2]-=2*RAIN_BOX; else if(a[j+2]<-RAIN_BOX)a[j+2]+=2*RAIN_BOX; }
    rainGeo.attributes.position.needsUpdate=true;
  }
  /* at the storm's height the sky cracks open */
  boltFlash=Math.max(0,boltFlash-dt*3.2);
  if(storm>0.55&&!state.firm){ boltT-=dt;
    if(boltT<=0){ boltT=5+Math.random()*10; boltFlash=1; thunderClap(); } }
  if(boltFlash>0.01&&!state.firm&&state.mode!=='dive'){
    hemi.intensity+=boltFlash*1.5; dirL.intensity+=boltFlash*0.7;
    scene.background.lerp(_boltWhite,boltFlash*0.4);
    /* THE LIGHTNING LIGHTS THE SKY, NOT THE SEA. The haze was whitened as
       hard as the sky was — and the water drinks the haze twice over, once
       for its own colour at range and again for the sky it mirrors — so every
       bolt threw a white sheet across the whole ocean. The sky still cracks
       open; the water only catches a little of it, as water does. */
    if(scene.fog) scene.fog.color.lerp(_boltWhite,boltFlash*0.12);
  }
}

/* ---- THE SMOKE OF HEARTHS — morning and evening, the houses breathe ---- */
const SMOKES=[], SMOKE_N=26;
function initSmoke(){ if(SMOKES.length) return;
  for(let k=0;k<SMOKE_N;k++){ const m=new THREE.Mesh(new THREE.BoxGeometry(1.5,1.5,1.5),
      new THREE.MeshLambertMaterial({color:0x9aa0a8,transparent:true,opacity:0.5}));
    m.visible=false; scene.add(m); SMOKES.push({m,t:0,dur:1,x:0,y:0,z:0,ph:0}); } }
let smokeT=0;
function smokeTick(px,pz,dt){
  if(state.firm||state.mode==='dive') return;
  initSmoke();
  const hh=((state.simHours%24)+24)%24;
  const hearth=(hh>5.2&&hh<9.2)||(hh>16.3&&hh<21.8);
  smokeT-=dt;
  if(hearth&&smokeT<=0){ smokeT=0.45;
    outer:
    for(const [,vv] of activeVillages){ if(vv.none||!vv.houses||!vv.houses.length) continue;
      for(let tr=0;tr<2;tr++){
        const H=vv.houses[Math.floor(Math.random()*vv.houses.length)];
        const hx=(H.x0+H.x1)/2, hz=(H.z0+H.z1)/2;
        if(Math.hypot(hx-px,hz-pz)>430) continue;
        const s=SMOKES.find(q=>!q.m.visible); if(!s) break outer;
        s.m.visible=true; s.t=0; s.dur=3.4+Math.random()*1.6; s.ph=Math.random()*6.28;
        s.x=hx+(Math.random()-0.5)*3; s.z=hz+(Math.random()-0.5)*3;
        s.y=groundInfo(hx,hz).y+B*3.6;
        break outer;
      } } }
  const w=windAt(px,pz);
  for(const s of SMOKES){ if(!s.m.visible) continue;
    s.t+=dt; const p2=s.t/s.dur;
    if(p2>=1){ s.m.visible=false; continue; }
    s.y+=dt*(3.4-p2*1.5); s.x+=w.x*2.6*dt+Math.sin(s.t*2+s.ph)*0.5*dt; s.z+=w.z*2.6*dt;
    s.m.position.set(s.x,s.y,s.z);
    s.m.scale.setScalar(0.7+p2*2.0);
    s.m.material.opacity=0.45*(1-p2);
    s.m.rotation.y=s.t*0.6+s.ph; }
}

/* ---- FIREFLIES — sparks of the evening over the good grass ---- */
const FIREFLIES=[], FF_N=14;
function initFireflies(){ if(FIREFLIES.length) return;
  for(let k=0;k<FF_N;k++){ const sp=new THREE.Sprite(new THREE.SpriteMaterial({
      map:glowTexCv,color:0xd8f086,transparent:true,opacity:0,fog:false,depthWrite:false}));
    sp.scale.set(1.7,1.7,1); sp.visible=false; scene.add(sp);
    FIREFLIES.push({m:sp,x:0,y:0,z:0,ph:Math.random()*6.28,set:false}); } }
function fireflyTick(px,pz,dt,t,nightF){
  initFireflies();
  const on=nightF>0.45&&state.mode!=='dive'&&!state.firm;
  for(const f of FIREFLIES){
    if(!on){ f.m.visible=false; f.set=false; continue; }
    if(!f.set||Math.hypot(f.x-px,f.z-pz)>170){
      f.set=false;
      for(let tr=0;tr<6;tr++){ const a=Math.random()*6.28, r=14+Math.random()*120;
        const x=px+Math.cos(a)*r, z=pz+Math.sin(a)*r, c=landAtWorld(x,z);
        if(c&&c.ci&&(c.kind==='grass'||c.kind==='tropic')){ f.x=x; f.z=z; f.y=c.h*B+2+Math.random()*3.5; f.set=true; break; } }
      if(!f.set){ f.m.visible=false; continue; }
    }
    f.x+=Math.sin(t*0.7+f.ph)*2.4*dt; f.z+=Math.cos(t*0.5+f.ph*1.7)*2.4*dt;
    f.m.visible=true;
    f.m.position.set(f.x,f.y+Math.sin(t*1.3+f.ph)*0.9,f.z);
    /* a spark at the edge of its round dims away instead of blinking out —
       the pool edge (170) used to cut a lit fly off in one frame */
    const edge=Math.max(0,Math.min(1,(170-Math.hypot(f.x-px,f.z-pz))/45));
    f.m.material.opacity=(0.2+0.6*Math.max(0,Math.sin(t*2.1+f.ph*3)))*edge; }
}

/* ---- CHANCE MEETINGS ON THE DEEP — the sea has stories in it ----
   Flotsam to salvage, a word in a bottle, a castaway on a raft. One at a
   time, drifting on the wind, gone if you pass it by. */
const ENC={kind:null,x:0,z:0,cool:45,models:{}};
const BOTTLE_WORDS=[
  ['“Cast your bread upon the waters, for you shall find it after many days.”','QOHELETH 11:1'],
  ['“They that go down to the sea in ships, that do business in great waters — these see the works of YAHUAH.”','TEHILLIM 107:23'],
  ['“The sea is His, and He made it, and His hands formed the dry land.”','TEHILLIM 95:5'],
  ['“He makes the storm a calm, so that the waves thereof are still.”','TEHILLIM 107:29']];
function encModel(kind){
  if(ENC.models[kind]) return ENC.models[kind];
  const g=new THREE.Group();
  if(kind==='flotsam'){
    const c1=texBox(4.5,4.5,4.5,'planks','planks'); c1.position.set(0,1.2,0); g.add(c1);
    const c2=texBox(3.6,3.6,3.6,'planks','planks'); c2.position.set(4.6,0.7,1.8); c2.rotation.y=0.5; g.add(c2);
    const bar=texBox(3,4.4,3,'logSide','logTop'); bar.position.set(-4.2,0.9,-1.4); bar.rotation.z=1.35; g.add(bar);
  } else if(kind==='bottle'){
    const bd=lbox(1.4,2.6,1.4,0x3f7a58); bd.position.y=0.9; g.add(bd);
    const nk=lbox(0.6,1.2,0.6,0x3f7a58); nk.position.y=2.7; g.add(nk);
    const ck=lbox(0.7,0.5,0.7,0x8a6a3a); ck.position.y=3.5; g.add(ck);
  } else {
    const raft=texBox(12,1.4,9,'planks','planks'); raft.position.y=0.4; g.add(raft);
    for(const zz of [-3.6,0,3.6]){ const lg=texBox(1.4,1.5,9.4,'logSide','logTop'); lg.position.set(0,-0.4,0); lg.position.x=zz; g.add(lg); }
    const man=makePerson(4177,'folk',false,false); man.position.set(0,1.1,0); g.add(man);
    g.userData.man=man;
  }
  g.visible=false; scene.add(g);
  ENC.models[kind]=g; return g;
}
function retireEnc(){ if(ENC.kind&&ENC.models[ENC.kind]) ENC.models[ENC.kind].visible=false; ENC.kind=null; ENC.cool=55+Math.random()*75; }
function encounterTick(px,pz,dt,t){
  if(state.firm||state.mode==='dive'){ if(ENC.kind&&ENC.models[ENC.kind]) ENC.models[ENC.kind].visible=false; return; }
  if(!ENC.kind){
    ENC.cool-=dt;
    if(ENC.cool>0) return;
    ENC.cool=8;                                          /* try again soon if this spot fails */
    const a=Math.random()*6.28, r=700+Math.random()*520;   /* born in the haze, met by sailing */
    const x=px+Math.cos(a)*r, z=pz+Math.sin(a)*r;
    if(landAtWorld(x,z)||shoalAt(x,z)>0.55||Math.hypot(x,z)/R_WORLD>0.93) return;
    const roll=Math.random();
    ENC.kind=roll<0.5?'flotsam':(roll<0.8?'bottle':'castaway');
    ENC.x=x; ENC.z=z;
    const g=encModel(ENC.kind); g.visible=true;
    return;
  }
  const g=encModel(ENC.kind), w=windAt(ENC.x,ENC.z);
  g.visible=true;
  ENC.x+=w.x*3*dt; ENC.z+=w.z*3*dt;
  if(landAtWorld(ENC.x,ENC.z)||Math.hypot(ENC.x-px,ENC.z-pz)>2400){ retireEnc(); return; }
  const hd=seaHeight(ENC.x,ENC.z);
  g.position.set(ENC.x,WATER_Y+hd*0.6-0.5,ENC.z);
  g.rotation.y+=dt*0.06; g.rotation.z=Math.sin(t*0.8+ENC.x*0.01)*0.06;
  if(ENC.kind==='castaway'&&g.userData.man){ const u=g.userData.man.userData;
    u.armR.rotation.x=-2.6; u.armR.rotation.z=Math.sin(t*5)*0.5;   /* waving for his life */
    g.userData.man.rotation.y=Math.atan2(px-ENC.x,pz-ENC.z); }
}
function nearestEncounter(){
  if(!ENC.kind) return null;
  const p=state.mode==='walk'?state.walk:state.boat;
  const reach=ENC.kind==='bottle'?34:52;
  if(Math.hypot(ENC.x-p.x,ENC.z-p.z)>reach) return null;
  if(state.mode==='walk'&&ENC.kind!=='bottle') return null;   /* a swimmer can take up only the bottle */
  return ENC;
}
function encounterAct(){
  const e=nearestEncounter(); if(!e) return;
  if(e.kind==='flotsam'){
    const good=GOODS[Math.floor(Math.random()*GOODS.length)];
    const take=Math.min(1+Math.floor(Math.random()*3),CARGO_MAX-cargoCount());
    if(take<=0){ toast('The hold is full to the beams — no room for salvage.'); return; }
    state.cargo[good.k]=(state.cargo[good.k]||0)+take;
    toast('You haul the flotsam aboard — '+take+' '+good.n.toLowerCase()+' saved from the sea. Cargo: '+cargoCount()+' / '+CARGO_MAX+'.');
  } else if(e.kind==='bottle'){
    const wd=BOTTLE_WORDS[Math.floor(Math.random()*BOTTLE_WORDS.length)];
    state.coins+=5;
    toast('A sealed bottle, and a word within — '+wd[0]+' (…and five shekels, for good measure.)',wd[1]);
  } else {
    state.coins+=25;
    let best=-1,bd=1e9; const p=state.boat;
    for(let i=0;i<COUNTRIES.length;i++){ const c=COUNTRIES[i].c;
      const d=Math.hypot(p.x/R_WORLD-c[0],p.z/R_WORLD-c[1]); if(d<bd){bd=d;best=i;} }
    if(best>=0){ state.rep=state.rep||{}; state.rep[best]=Math.min(50,(state.rep[best]||0)+3);   /* capped, as addRep caps */ }
    toast('You take the castaway aboard. He weeps, presses 25 shekels into your hand, and blesses your ship — word of this kindness will reach the ports.','MATTITHYAHU 25:35');
  }
  retireEnc(); saveState();
}

/* ---- THE MURMUR OF THE LIVING — passers-by greet the traveller ---- */
const BARKS=[];
function initBarks(){ if(BARKS.length) return;
  for(let k=0;k<3;k++){
    const cv=document.createElement('canvas'); cv.width=512; cv.height=96;
    const tex=new THREE.CanvasTexture(cv);
    const sp=new THREE.Sprite(new THREE.SpriteMaterial({map:tex,transparent:true,opacity:0,fog:false,depthWrite:false,depthTest:false}));
    sp.visible=false; scene.add(sp);
    BARKS.push({sp,cv,tex,t:0,dur:0,ent:null}); } }
function barkAt(ent,text){
  initBarks();
  const b=BARKS.find(q=>!q.ent)||BARKS[0];
  const g=b.cv.getContext('2d'); g.clearRect(0,0,512,96);
  g.font='500 30px Georgia,serif';
  const wpx=Math.min(492,g.measureText(text).width+36);
  g.fillStyle='rgba(12,16,26,0.78)';
  g.beginPath();
  if(g.roundRect) g.roundRect((512-wpx)/2,16,wpx,60,14); else g.rect((512-wpx)/2,16,wpx,60);
  g.fill();
  g.fillStyle='#f0e8d2'; g.textAlign='center'; g.textBaseline='middle';
  g.fillText(text,256,47);
  b.tex.needsUpdate=true;
  b.ent=ent; b.t=0; b.dur=3.4;
  b.sp.scale.set(26*(wpx/512)+8,6,1);
  b.sp.visible=true;
}
const GREETS_DAY=['Shalom, traveller.','Peace be upon you.','Fair winds brought you in?','A good day under the sun.','You are welcome in this place.'];
const GREETS_NIGHT=['A quiet night, friend.','Peace to you, night-walker.','The lamps are lit — rest well.'];
const GREETS_ROLE={vendor:'Fresh wares, friend — come and see!',child:'Come and play! You cannot catch me!',fisher:'The fish bite well today.',water:'Sweet water, drawn this hour.'};
let greetScanT=0;
function greetTick(dt,nightF){
  greetScanT-=dt;
  for(const b of BARKS){ if(!b.ent) continue;
    b.t+=dt;
    if(b.t>=b.dur||!b.ent.m||!b.ent.m.visible){ b.ent=null; b.sp.visible=false; continue; }
    b.sp.position.set(b.ent.m.position.x,b.ent.m.position.y+16,b.ent.m.position.z);
    b.sp.material.opacity=Math.min(1,(b.dur-b.t)/0.5)*Math.min(1,b.t/0.25); }
  if(greetScanT>0||state.mode!=='walk') return;
  greetScanT=1.2;
  const now=performance.now()*0.001, w=state.walk;
  for(const [,vv] of activeVillages){ if(vv.none||!vv.people) continue;
    for(const p of vv.people){ if(!p.m||!p.m.visible) continue;
      const d=Math.hypot(p.m.position.x-w.x,p.m.position.z-w.z);
      if(d>3&&d<9&&(!p.greetT||now-p.greetT>40)){
        p.greetT=now;
        const line=GREETS_ROLE[p.role]||(nightF>0.5?GREETS_NIGHT[Math.floor(Math.random()*GREETS_NIGHT.length)]
                                                    :GREETS_DAY[Math.floor(Math.random()*GREETS_DAY.length)]);
        barkAt(p,line);
        return; } } }
}

/* ---- GULL CRIES & CRICKETS — the air itself is alive ---- */
let gullT=8, cricketGain=null;
function gullCry(){ if(!AC||!audioOn) return;
  try{ const t0=AC.currentTime;
    for(let k=0;k<2;k++){ const o=AC.createOscillator(); o.type='triangle';
      const g2=AC.createGain(); o.connect(g2); g2.connect(AC.destination);
      const s=t0+k*0.34;
      o.frequency.setValueAtTime(1240-k*140,s);
      o.frequency.exponentialRampToValueAtTime(790,s+0.26);
      g2.gain.setValueAtTime(0.0001,s);
      g2.gain.exponentialRampToValueAtTime(0.05,s+0.05);
      g2.gain.exponentialRampToValueAtTime(0.0001,s+0.3);
      o.start(s); o.stop(s+0.34); }
  }catch(e){} }
function ensureCricket(){ if(!AC||cricketGain) return;
  try{ cricketGain=AC.createGain(); cricketGain.gain.value=0; cricketGain.connect(AC.destination);
    const osc=AC.createOscillator(); osc.type='sine'; osc.frequency.value=4300;
    const am=AC.createGain(); am.gain.value=0; osc.connect(am); am.connect(cricketGain); osc.start();
    const lfo=AC.createOscillator(); lfo.type='square'; lfo.frequency.value=12.5;
    const lg=AC.createGain(); lg.gain.value=0.5; lfo.connect(lg); lg.connect(am.gain); lfo.start();
  }catch(e){ cricketGain=null; } }
function ambientAudioTick(dt,light,p){
  if(!AC||!audioOn) return;
  const day=(light.dayF||0)>0.45, storm=(light.storm||0);
  if((state.mode==='boat'||state.mode==='deck'||(state.mode==='walk'&&state.walk.inWater))&&day&&storm<0.4){
    gullT-=dt; if(gullT<=0){ gullT=8+Math.random()*16; gullCry(); } }
  ensureCricket();
  if(cricketGain){
    const onLand=state.mode==='walk'&&!state.walk.inWater&&landAtWorld(p.x,p.z);
    /* they were the loudest thing in the world at night — a wall of chirp
       over the sea, the wind and the whole of the rest of it. They are an
       AMBIENCE now: heard, and not listened to. */
    const want=(onLand&&(light.nightF||0)>0.5&&storm<0.3)?0.0075:0;
    cricketGain.gain.value+=(want-cricketGain.gain.value)*Math.min(1,dt*2); }
}

/* ---- THE VOYAGE FULFILLED — an explorer's game has an ending ---- */
function nextLandfall(){
  const p=state.mode==='walk'?state.walk:state.boat;
  let best=-1,bd=1e9;
  for(let i=0;i<COUNTRIES.length;i++){ if(state.visited.has(i)) continue;
    const c=COUNTRIES[i].c, d=Math.hypot(p.x/R_WORLD-c[0],p.z/R_WORLD-c[1]);
    if(d<bd){bd=d;best=i;} }
  if(best<0) return null;
  const pu=p.x/R_WORLD, pv=p.z/R_WORLD, rr=Math.hypot(pu,pv)||1e-9;
  const nX=-pu/rr, nZ=-pv/rr, eX=pv/rr, eZ=-pu/rr;
  const dx=COUNTRIES[best].c[0]*R_WORLD-p.x, dz=COUNTRIES[best].c[1]*R_WORLD-p.z;
  const ang=Math.atan2(dx*eX+dz*eZ, dx*nX+dz*nZ);
  return { n:COUNTRIES[best].n, dir:COMPASS8[(Math.round(ang/(Math.PI/4))+8)%8],
    km:Math.max(50,Math.round(bd*R_WORLD/B/50)*50) };
}
function checkFulfilled(){
  if(state.vf||state.visited.size<COUNTRIES.length) return;
  state.vf=1; saveState();
  toast('THE VOYAGE IS FULFILLED — you have come ashore in every land under the whole shamayim, '+COUNTRIES.length+' coasts written in your log. “They that go down to the sea in ships… these see the works of YAHUAH, and His wonders in the deep.”','TEHILLIM 107:23-24');
}

/* the voyage survives its wounds: if anything ever throws, the log is saved */
window.addEventListener('error',()=>{ try{ saveState(); }catch(e){} });

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
let _begun=false;
/* the loading screen and the menu, both standing in the page itself */
const BOOT=window.__BOOTUI||{stage:function(){},fail:function(){},done:function(){}};
let menuView=null;    /* {x,z,yaw,t} — the slow drift behind the menu; null once sailing */
let menuSave=null;    /* the save as the menu read it, for the CONTINUE line */
async function begin(fresh,roam){
  if(_begun) return; _begun=true;   /* a double-click on Set sail built the cities twice */
  try{
  /* the sites, Yahru, the home port and the anchorage's chunks were all
     built by preload() while the loading screen stood — none of it may run
     twice (twice-computed sites double the villages; twice-built ports
     stand two houses in one place) */
  /* ---- AND ANEW MEANS ANEW ----
     'Wash it away — begin anew' set the ship's place and the hour, and
     nothing else. Everything a voyage GATHERS — the silver, the catch, the
     pearls, the cargo, the lands seen, the miles run, the standing at every
     market, the scrolls taken up, the wrecks broken open, the pearl beds
     already stripped, the immortal breath, the repelling of beasts — lives
     in this module and not in the log, and so it lived straight through the
     washing. A voyage begun anew after another began with the whole of the
     old one still in hand, and wrote it back over the log at the next save.
     Worse: the MODE came through with it, so a traveller who went to the
     menu from dry land began his new voyage standing in the old land, half
     a world from his ship.

     (Reloading the page washed it clean, which is the only reason this was
     ever survivable — and the reason it never showed on a first launch.)

     Everything is emptied here, BEFORE the log is read back, so a continued
     voyage lays its own record over a clean state and carries nothing of
     whatever was played before it either. */
  if(state.mount) dismount(true);
  state.mode='boat'; state.prevGround='boat'; state.firm=false;
  state.visited=new Set(); state.dist=0; state.fish=0; state.fishing=null;
  state.coins=30; state.cargo={}; state.game=0; state.pearls=0; state.rep={};
  state.breath=1; state.immBreath=false; state.repel=false; state.vf=0;
  state.windMode='true'; state.speedIdx=0; state.dayIdx=0; state.paused=false;
  state.simHours=9.5; state.freeroam=false;
  if(state.net){ state.net=null; if(typeof netG!=='undefined'&&netG) netG.visible=false; }
  Object.assign(state.walk,{x:0,z:0,heading:0,feetY:undefined,vy:0,grounded:true,
    stepOff:0,climb:null,inWater:false,spill:0});
  Object.assign(state.boat,{heading:Math.PI*0.9,speed:0});
  state.camYaw=0; state.camPitch=0.42; state.camYawVel=0; state.camPitchVel=0;
  camClear=1; camFloor=-1e9;
  scrollTaken.clear(); pearlTaken.clear(); wreckLooted.clear();
  GUIDE.mode='scroll';
  if(window.SEASON&&SEASON.clear) SEASON.clear();

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
    if(saved.ib){ state.immBreath=true; updateBreathBtn(); }
    if(saved.pe) state.pearls=saved.pe;
    if(saved.rp){ state.repel=true; updateRepelBtn(); }
    if(saved.rr) state.rep=saved.rr;
    if(saved.wl) for(const k of saved.wl) wreckLooted.add(k);
    if(saved.pt) for(const k of saved.pt) pearlTaken.add(k);
    if(saved.sn&&window.SEASON){ SEASON.setSeason(saved.sn); updateSeasonBtn(); }
    if(saved.vf) state.vf=1;
    if(saved.wm){ state.windMode=saved.wm; updateWindBtn(); }
    if(saved.dp!==undefined&&DAYPARTS[saved.dp]){ state.dayIdx=saved.dp; updateDayBtn(); }
    state.freeroam=!!saved.fr;
    if(saved.sr) for(const k of saved.sr) scrollTaken.add(k); }
  else{ const [sx,sz]=findStart(); state.boat.x=sx; state.boat.z=sz; state.simHours=9.5; }
  /* a NEW beginning takes the manner it was chosen with; a continued one
     keeps whatever manner it was begun in, out of the log */
  if(fresh) state.freeroam=!!roam;
  applyFreeroam();
  const p0=state.mode==='walk'?state.walk:state.boat;
  /* the hour is set only NOW — it is a LOCAL hour, and until the traveller
     has his place there is no longitude to reckon it against */
  applyDayPart(); updateDayBtn();
  updateChunks(p0.x,p0.z,9999);
  { const bo=$('boot'); if(bo) bo.style.display='none';
    if(window.__MENUUI) __MENUUI.close();
    else { const mu=$('menu'); if(mu) mu.style.display='none'; } }
  D.body.classList.remove('pregame');       /* the HUD stands up with the voyage */
  menuView=null; running=true;
  setMode(state.mode);
  /* every switch on the rail reads its word off the STATE, and is set from
     it here — after the washing AND after the log has been read back, so the
     rail can never stand telling one tale while the voyage keeps another
     (a voyage begun anew still offered the immortal breath on its button) */
  updateWindBtn(); updateBreathBtn(); updateRepelBtn(); updateSpeedBtn();
  updateSeasonBtn(); updateGuideBtn();
  initAudio();
  if(state.freeroam) toast('FREE ROAM \u2014 the air, the sun, the hour and the season are yours. Rise up (G), hold the sun, turn the year, and go where you will.');
  else toast('And Aluahim said, \u201cLet the waters under the shamayim be gathered together into one place, and let the dry land appear.\u201d And it came to be so.','BER\u0114SHITH 1:9');
  }catch(e){ _begun=false; throw e; }   /* a failed launch frees the buttons for another try */
}
/* ================= THE WORLD, LENT OUT =================
   SCRIPTURE UNFOLDS (../scripture-unfolds/) is a second game built on this
   same engine — the same earth, the same beasts, the same sea — telling the
   scrolls scene by scene. It needs to DRESS the world in ways the voyage
   never does: to put out the lights and hang the darkness on the face of
   the deep, to raise the expanse, to make the dry land appear.

   So the world's own furniture is lent out here, and a hook is called at
   the very END of every frame — after the sky, the sea and every tick have
   had their say — so that whatever the other game sets, STAYS set for that
   frame. When nothing is hooked (the voyage, played by itself) both of
   these cost one undefined check a frame and change nothing whatever. */
window.__WORLD={
  scene,camera,renderer,THREE,
  sun,moon,sunMat2,moonMat2,sunHalo,moonHalo,starGroup,
  chunkRoot,sea,seaDeep,waveGrid,voidWall,cloudMat,surfMat,
  waveMat,farSeaMat,farLand,farLandMat,
  hemi,dirL,walkerG,boatG,
  ensureFlyDome,flyDome:()=>flyDome,
  R_WORLD,B,WATER_Y,SEA_SURF,CLOUD_Y,U_PER_M,
  state,setMode,updateChunks,landAtWorld,seaHeight,findStart,
  hideLandLife,hideAirLife,hidePod,hideOrca,hideBlooms,hideDeep,hideTraders,
  hideSeaMobs,hideDeepLife,SEAFISH,DIVEFISH,SHARKS,
  toast,playScene,endScene,sceneActive,
  running:()=>running, setRunning:v=>{running=v;},
  /* read-only probes for the audit harness (nothing in the game reads these) */
  sites:()=>SITES, villages:()=>activeVillages, scrolls:()=>SCROLLS,
  cell,groundInfo,solidTopAt,houseTopAt,takeFlight,alight,
  camDbg:()=>({seat:{x:camPos.x,y:camPos.y,z:camPos.z},camClear,camFloor}),
};
function stageHook(dt){ if(window.__STAGE_TICK){ try{ window.__STAGE_TICK(dt); }catch(e){} } }

/* ================= THE LOADING OF THE WORLD =================
   The whole build runs UNDER the loading screen, stage by stage on a true
   bar, so the menu — when it comes — stands over a world already made:
   the sites of every nation, Yahru and the home port, and the full disc of
   chunks about the anchorage, laid a slice a frame so the bar can move. */
async function buildWorld(){
  const raf=()=>new Promise(r=>requestAnimationFrame(r));
  BOOT.stage('Charting the coasts of every nation…',0.16); await raf(); await raf();
  /* what other hands have done here is read BEFORE the first chunk is laid,
     so no chunk is ever built once without the edits and again with them */
  try{ const n=await editsLoad(); if(n) console.info('the voyage: '+n+' blocks remembered'); }
  catch(e){}
  computeSites();
  cellCacheOn=true; CELL_CACHE.clear();   /* sites are fixed — the terrain is now immutable and memoisable */
  BOOT.stage('Raising Yahru and the home port…',0.30); await raf();
  buildYahru(); buildHome();
  placeScrolls(); updateGuideBtn();   /* the scrolls are set in their lands, and the arrow can now name the next */
  menuSave=await loadSaved();
  /* the backdrop is built where the voyage will open: the ship's saved
     berth, or the harbour of the first sailing */
  let ax,az;
  if(menuSave){ ax=menuSave.x; az=menuSave.z; }
  else { const s0=findStart(); ax=s0[0]; az=s0[1]; }
  state.boat.x=ax; state.boat.z=az;       /* begin() sets it again from the save */
  if(menuSave&&menuSave.h!==undefined) state.boat.heading=menuSave.h;
  applyDayPart();                          /* the menu keeps the traveller's own hour */
  BOOT.stage('Laying the dry land, block by block…',0.34); await raf();
  updateChunks(ax,az,1);
  const total=Math.max(1,buildQueue.length+1);
  while(buildQueue.length){
    updateChunks(ax,az,50);                /* a 9 ms slice a frame, so the bar moves */
    BOOT.stage(null,0.34+0.64*(1-buildQueue.length/total));
    await raf(); }
  BOOT.stage('The world stands ready',1); await raf();
}
/* the voyage's own opening: raise the world, then offer the menu */
async function preload(){ await buildWorld(); openMenu(); }

/* ================= THE MENU ================= */
function openMenu(){
  BOOT.done();
  $('boot').style.display='none';
  if(menuSave) $('m-continue').style.display='block';
  if(window.__MENUUI) __MENUUI.open(); else $('menu').style.display='block';
  menuView={x:state.boat.x, z:state.boat.z, yaw:Math.random()*Math.PI*2, t:0};
}
/* the world sails on behind the menu: its own sky, its own sea, the ship at
   her anchorage — and the eye carried slowly round her */
function menuTick(dt){
  const a=menuView; a.t+=dt; a.yaw+=dt*0.03;
  boatTick(dt,false);                      /* she rides the swell while the menu stands */
  const light=skyTick(a.x,a.z);
  waterTick(a.x,a.z,light.dayF,light.storm||0);
  WIND_T.value=performance.now()*0.001;
  { const wnd=windAt(a.x,a.z); WIND_A.value=(0.35+wnd.s*0.9)*(1+(light.storm||0)*1.6); }
  SEASON_Y.value=window.SEASON?SEASON.yearPhase(dayOfYear()):(dayOfYear()-1)/364;
  seaTex.offset.x=(performance.now()*0.000012)%1; seaTex.offset.y=(performance.now()*0.000009)%1;
  const _pn=performance.now();
  TEX.surf.offset.x=(_pn*0.00006)%1; TEX.surf.offset.y=(_pn*0.00013)%1;
  surfMat.opacity=0.42+0.28*Math.sin(_pn*0.0022);
  updateChunks(a.x,a.z,4);                 /* keep the ring whole if anything was left */
  const R2=235, h=62+Math.sin(a.t*0.11)*7;
  camera.position.set(a.x+Math.sin(a.yaw)*R2, h, a.z+Math.cos(a.yaw)*R2);
  camera.lookAt(a.x,22,a.z);
}
/* setting forth from the menu: the near work is already built, so this is a
   breath — save for a voyage saved far ASHORE, whose ground is rush-built
   here, which is what the returned loading screen stands over */
let _launching=false;
function menuLaunch(fresh,roam){
  if(_begun||_launching) return; _launching=true;
  if(window.__MENUUI) __MENUUI.close(); else $('menu').style.display='none';
  const bo=$('boot'); bo.style.display='flex';
  BOOT.stage(roam?'Opening the whole world…':fresh?'Setting sail…':'Returning to the voyage…',1);
  /* two frames, so the loading screen is truly painted before the rush */
  requestAnimationFrame(()=>requestAnimationFrame(()=>{
    begin(fresh,roam).then(()=>{ _launching=false; },
      e=>{ _launching=false;
        BOOT.fail('The voyage could not be launched: '+(e&&e.message||e));
        throw e; });
  }));
}
$('m-continue').onclick=()=>menuLaunch(false);
/* WHICH new beginning was asked for, while the confirm is up */
let _pendingRoam=false;
function askOrBegin(roam){
  _pendingRoam=roam;
  if(!menuSave){ menuLaunch(true,roam); return; }
  /* a voyage stands in the log — it is not washed away on one click */
  $('m-list').style.display='none'; $('m-confirm').style.display='flex';
  if(window.__MENUUI) __MENUUI.refresh(); }
$('m-new').onclick=()=>askOrBegin(false);
{ const r=$('m-roam'); if(r) r.onclick=()=>askOrBegin(true); }
$('mc-keep').onclick=()=>{
  $('m-confirm').style.display='none'; $('m-list').style.display='flex';
  if(window.__MENUUI) __MENUUI.refresh(); };
$('mc-anew').onclick=()=>menuLaunch(true,_pendingRoam);
/* the options lean on the rail's own buttons, so the two can never disagree */
const OPTMAP=[['mo-sound','b-sound'],['mo-names','b-names'],
  ['mo-daypart','b-daypart'],['mo-season','b-season'],['mo-wind','b-wind']];
function syncOpts(){ for(const[a,b] of OPTMAP){
  const A=$(a), B2=$(b); if(A&&B2) A.textContent=B2.textContent; } }
for(const[a,b] of OPTMAP){ const A=$(a);
  if(A) A.onclick=()=>{ const B2=$(b); if(B2) B2.click(); syncOpts(); }; }
$('m-options-btn').onclick=()=>{ syncOpts(); $('opt-modal').style.display='flex'; };
$('opt-back').onclick=()=>{ $('opt-modal').style.display='none'; };

/* ---- ANOTHER GAME MAY RAISE THIS SAME WORLD ----
   SCRIPTURE UNFOLDS sets __HOST_BOOT before loading the engine and then
   drives the opening itself: it wants this earth, these beasts and this sea,
   but its own loading screen, its own menu and its own first scene. Played
   by itself the voyage boots exactly as it always did. */
window.__WORLD.buildWorld=buildWorld;
window.__WORLD.beginVoyage=begin;
if(!window.__HOST_BOOT){
  preload().catch(e=>{
    BOOT.fail('The world could not be built: '+(e&&e.message||e));
    throw e; });
}

/* a small debug handle — used by the automated smoke tests; harmless in play */
window.__VDBG={BUILD_STATS,state,setMode,updateChunks,SITES,landAtWorld,HATCH,SHIP_S,activeVillages,groundInfo,
  /* the light in the corners, and the count of standing chunks — tools/acceptance.js */
  aoLevel,aoTop,chunkCount:()=>chunks.size,bodyLenOf,
  /* ---- THE THIRD DIMENSION, FOR tools/acceptance.js ----
     Read-only probes. Nothing in the game reads any of these; they exist so
     the acceptance tests can ask the RUNNING WORLD rather than the source. */
  cellSpans:(ix,iz)=>{ const c=cell(ix,iz); return c&&c.spans||null; },
  caveLightAt,solidRuns,solidAt,groundInfo,
  caveAt:(x,z)=>window.CAVES?CAVES.regionAt(x,z):0,
  caveSeeds:()=>RANGES.map(g=>({ix:Math.floor(g.x/B),iz:Math.floor(g.z/B)})),
  lightTorch:on=>{ setTorch(on); TORCH.s=on?1:0; TORCH_S.value=on?1:0;
    const p=playerXZ(); TORCH_P.value.set(p.x,(state.walk.feetY||0)+B*1.5,p.z); },
  /* the light truly standing on a point: what the mesher baked there, and
     what the flame adds to it */
  lightAt:(x,y,z)=>{ const c=landAtWorld(x,z);
    let base=1;
    if(c&&c.spans){ const yb=y/B; let inRun=false;
      for(let i=0;i<c.spans.length;i+=2) if(yb>=c.spans[i]&&yb<=c.spans[i+1]) inRun=true;
      if(inRun) base=CAVE_DARK+(1-CAVE_DARK)*caveLightAt(Math.floor(x/B),Math.floor(z/B),y/B); }
    const d=Math.hypot(x-TORCH_P.value.x,y-TORCH_P.value.y,z-TORCH_P.value.z);
    const t=Math.max(0,1-d/TORCH_R.value);
    return Math.min(1,base*(1+TORCH_S.value*t*t*7)); },
  /* what stands over a point, if anything */
  solidAbove:(x,y,z,maxDy)=>{ for(let d=1;d<=(maxDy||40);d++){
      if(solidAt(x,y+d*B,z)) return {dy:d}; } return null; },
  /* the best walk-in cave mouth near a named range, and a point well inside it */
  nearestCaveMouth:()=>{
    let best=null;
    for(const g of RANGES){
      const cx=Math.floor(g.x/B), cz=Math.floor(g.z/B);
      for(let a=-90;a<=90;a+=2) for(let b=-90;b<=90;b+=2){
        const ix=cx+a, iz=cz+b, c=cell(ix,iz); if(!c||!c.spans) continue;
        const lo=c.spans[0], hi=c.spans[1];
        for(const d of [[1,0],[-1,0],[0,1],[0,-1]]){
          const n=cell(ix+d[0],iz+d[1]); if(!n||n.h>lo+1) continue;
          let run=0; const my=Math.floor((lo+hi)/2);
          for(let k=1;k<=60;k++){ const q=cell(ix-d[0]*k,iz-d[1]*k);
            if(!q||!q.spans||my<q.spans[0]||my>q.spans[1]) break; run=k; }
          const score=run*3+(hi-lo)*2+Math.min(40,c.h);
          if(!best||score>best.score) best={score,ix,iz,lo,hi,my,run,
            dx:d[0],dz:d[1],x:(ix+0.5)*B,y:(lo+0.6)*B,z:(iz+0.5)*B};
          break; } } }
    return best; },
  caveWalkIn:(m,n)=>{ const k=Math.min(n,m.run);
    if(k<1) return null;
    const ix=m.ix-m.dx*k, iz=m.iz-m.dz*k, c=cell(ix,iz);
    if(!c||!c.spans) return null;
    return {x:(ix+0.5)*B,y:(c.spans[0]+0.6)*B,z:(iz+0.5)*B,ix,iz}; },
  /* drive the traveller at the rock for a while and report whether his body
     was EVER found inside it — the plainest reading of "he passes through
     nothing", and it exercises the real walker, not a proxy for him */
  shoveWalker:async(m,dir,frames)=>{
    const inn=Math.min(m.run,6);
    state.walk.x=(m.ix-m.dx*inn+0.5)*B; state.walk.z=(m.iz-m.dz*inn+0.5)*B;
    state.walk.feetY=(m.lo+0.4)*B; state.walk.vy=0; state.walk.climb=null; state.walk.spill=0;
    setMode('walk');
    await new Promise(r=>requestAnimationFrame(r));
    const y0=state.walk.feetY;
    if(dir[0]||dir[2]) state.walk.heading=Math.atan2(dir[0],dir[2]);
    keys.KeyW=!!(dir[0]||dir[2]); keys.Space=dir[1]>0;
    let inside=0, worst=null;
    for(let k=0;k<frames;k++){
      await new Promise(r=>requestAnimationFrame(r));
      const w=state.walk;
      for(const dy of [0.6,B*1.0,B*1.7]){
        if(solidAt(w.x,w.feetY+dy,w.z)){ inside++;
          if(!worst) worst={x:Math.round(w.x),y:Math.round(w.feetY),z:Math.round(w.z),dy}; } }
      if(dir[1]<0&&w.feetY<y0-B*3) { worst=worst||{fell:Math.round((y0-w.feetY)/B)}; }
    }
    keys.KeyW=false; keys.Space=false;
    const w=state.walk;
    const fellThrough=dir[1]<0&&w.feetY<y0-B*3;
    return {escaped:inside>0||fellThrough, inside, worst,
      moved:Math.round(Math.hypot(w.x-(m.ix-m.dx*inn+0.5)*B, w.z-(m.iz-m.dz*inn+0.5)*B)/B)}; },
  settle:async n=>{ for(let k=0;k<(n||2);k++) await new Promise(r=>requestAnimationFrame(r));
    flushEdits(1e9); await new Promise(r=>requestAnimationFrame(r)); },
  /* ---- THE MUTABLE WORLD, FOR tools/acceptance.js ---- */
  setBlock, blockId, blockAt, blockOf, blockSolidAt, editsSave, editsLoad,
  remeshes:()=>REMESHES,
  /* the remesh ALONE, in milliseconds — not the frame it happens to sit in */
  flushNow:()=>{ const t=performance.now(); const n=flushEdits(1e9);
    return {ms:performance.now()-t, chunks:n}; },
  BLOCKS:()=>BLOCKS, edits:()=>EDITS, sedits:()=>SEDITS,
  stampCells:()=>{ let n=0; for(const m of SEDITS.values()) n+=m.size; return n; },
  /* the topmost solid block under a point, in world coordinates */
  blockUnder:(x,z)=>{ const ix=Math.floor(x/B), iz=Math.floor(z/B), c=cell(ix,iz);
    if(!c) return null;
    for(let y=c.h+8;y>EY_MIN;y--) if(blockSolidAt(ix,y,iz))
      return {ix,iy:y,iz,x:(ix+0.5)*B,y:(y+0.5)*B,z:(iz+0.5)*B,cx:Math.floor(ix/CH),cz:Math.floor(iz/CH)};
    return null; },
  chunkTriangleCount:(cx,cz)=>{ const ch=chunks.get(cx+','+cz); if(!ch) return -1;
    let n=0; for(const m of ch.meshes){ const idx=m.geometry.getIndex(); n+=idx?idx.count/3:0; }
    return n; },
  /* what the world remembers of two particular deeds, after a reload */
  editMark:(x,y,z)=>blockAt(Math.floor(x/B),Math.floor(y/B),Math.floor(z/B)),
  timeFrames:async n=>{ const t=[]; let last=performance.now();
    for(let k=0;k<(n||120);k++){ await new Promise(r=>requestAnimationFrame(r));
      const now=performance.now(); t.push(now-last); last=now; }
    t.sort((a,b)=>a-b); return t.reduce((a,b)=>a+b,0)/t.length; },
  /* set the traveller down well inside a passage, with the ground about him
     laid, so the frame there can be timed against open ground */
  standInCave:async()=>{ const m=window.__VDBG.nearestCaveMouth(); if(!m) return null;
    const inn=Math.min(m.run,14);
    state.walk.x=(m.ix-m.dx*inn+0.5)*B; state.walk.z=(m.iz-m.dz*inn+0.5)*B;
    state.walk.feetY=(m.lo+0.4)*B; state.walk.vy=0; setMode('walk');
    for(let k=0;k<40;k++){ updateChunks(state.walk.x,state.walk.z,400);
      await new Promise(r=>requestAnimationFrame(r)); }
    return {x:state.walk.x,z:state.walk.z,run:m.run}; },
  TRADERS,throwSpear,openTrade,cellRaw,sea,seaDeep,waveGrid,shoalAt,camera,scene,seaHeight,WATER_Y,seabedDepth,
  farLand,updateFarLand,mountUpliftAt,MOUNTS,ridgeNoise,B,R_WORLD,
  AIRLIFE,NESTS,landKindAt,riverBankAt,WILD_ROLE,RANGES,FALLS,activeLandmarks,LANDMARKS,
  llToWorld,landmarkSolidAt,landmarkTopAt,solidTopAt,insideTraderHull,CORAL,
  mountUp,dismount,nearestMount,promptState:()=>promptAction,
  camera,sceneStep:dt=>{ if(cut) sceneTick(dt); },cutTime:()=>cut?cut.t:-1,
  playerXZ,localHourAt,setLocalHour,clockFace,dayPartName,DAYPARTS,applyDayPart,
  domeCeilAt,canTouchDome,touchDome,playScene,endScene,SCENES,sceneActive,sceneRise,seenDeeps,BEACHES,SHOALS,ORCA,beachAt,nearestBeach,seabedMetres,orcaState:()=>orcaState,chunkRoot,R_DOME,H_DOME,ICE_UV,walkerY:()=>walkerG.position.y,hash2,renderer,MAT,farOuter:()=>_flR1,aloftInfo:()=>aloftDisc?{vis:aloftDisc.visible,op:aloftDisc.material.opacity,y:aloftDisc.position.y}:null,setKey:(k,v)=>{keys[k]=v;},
  DIVEFISH,DOLPHINS,SHARKS,PEARLS,pearlTaken,toggleNet,nearestPearl,updatePearls,
  /* the scrolls and the compass that leads to them, for the smoke tests */
  SCROLLS,scrollTaken,nextScroll,takeScroll,nearestScrollProp,toggleGuide,
  /* the eye's boom and its near plane, for the smoke tests — the shaking
     beside a rock was read off these two */
  camInfo:()=>({clear:camClear, near:camera.near, stepOff:state.walk.stepOff||0}),
  guideMesh:()=>cmpCv,             /* it is on the glass now, not in the scene */
  guideInfo:()=>({mode:GUIDE.mode,
    colour:GUIDE.mode==='ship'?'blue':'gold',
    visible:GUIDE.shown,
    aimedAt:(function(){const t=guideTarget(); if(!t) return null;
      const p=playerXZ(); return {km:Math.round(Math.hypot(t.x-p.x,t.z-p.z)/B),ship:!!t.ship};})(),
    taken:[...scrollTaken], left:SCROLLS.filter(x=>!x.gone&&!scrollTaken.has(x.id)).length}),
  WRECKS,wreckLooted,updateWreck,nearestGround,groundFactor,podInfo:()=>podState,LANDLIFE,
  domeInfo:()=>({dome:flyDome?flyDome.material.opacity:0, deep:outerDeep?outerDeep.material.uniforms.uOp.value:0, stars:starGroup.userData.mat.opacity}),
  ENC,nearestEncounter,encounterAct,BARKS,FIREFLIES,SMOKES,rain,rainMat,nextLandfall,checkFulfilled,AIRLIFE,stormAt,COUNTRIES,STORMS,R_WORLD,
  seaPools:()=>({TURTLES,RAYS_M,WHALES,PUFFERS,JELLIES,POD,
    SEALS,WALRUS,MANATEES,OCTOPI,SWORDS,CUDAS,BELUGAS,SLEEPERS,NARWHALS,
    PARROTS,ANGELS,LIONFS,MARLINS,SUNFS,WSHARKS,SPERMS}),
  /* the reef household and the tenants of the deep, for the smoke tests */
  DEEPLIFE,DEEP_KINDS,ANEMS,SEAHORSES,MORAYS,BEDLIFE,SHOALS,
  /* the reef's lanterns and the spring flush — for the smoke tests */
  coral:()=>CORAL, blooms:()=>BLOOMS, seaCurrent,
  /* the home-raising itself, so a test may ask WHY a den was or was not built */
  homeSiteFor, beastFits, faunaFor, FAUNA, villageBuildTick, SITES,
  seaFloor,eyeUnderwater,eyeSub:()=>_eyeSub,
  lights:()=>({ sunY:Math.round(sun.position.y), moonY:Math.round(moon.position.y),
    sunR:+(Math.hypot(sun.position.x,sun.position.z)/R_WORLD).toFixed(3),
    moonR:+(Math.hypot(moon.position.x,moon.position.z)/R_WORLD).toFixed(3),
    domeR:+(R_DOME/R_WORLD).toFixed(3), faceY:aloftDisc?Math.round(aloftDisc.position.y):null,
    sunVis:sun.visible, moonVis:moon.visible,
    sunOp:+sunMat2.opacity.toFixed(3), moonOp:+moonMat2.opacity.toFixed(3),
    sunPd:Math.round(Math.hypot(sun.position.x-playerXZ().x,sun.position.z-playerXZ().z)),
    moonPd:Math.round(Math.hypot(moon.position.x-playerXZ().x,moon.position.z-playerXZ().z)),
    sunScale:Math.round(sun.scale.x) }),
  makeBeast,makeAnimal,makeBird,beastUnits,BEASTS,U_PER_M,POD,initPod,SHARKS,initSharks,initSeaMobs,
  seaMobs:()=>({TURTLES,RAYS_M,WHALES,PUFFERS,JELLIES,CRABS})};

/* ================= AND THE NEAR WORLD GOES WITH THE NEAR LAND =================
   Taking the streamed chunks out of the view left EIGHTY-SEVEN SPRITES still
   being drawn: every torch-glow of every village, every name banner, the
   splashes, the fireflies, the hearth-smoke, the traveller and his ship. Each
   of them is a thing sized for a man's own distance; seen from three hundred
   thousand units off they are bright specks of nothing scattered over the
   face of the deep and out among the stars — which is exactly what they look
   like, and why they read as extra lights floating about the sun.

   A whole-earth view has one thing in it: the earth, its vault, and the two
   great lights. Everything belonging to the near world is put away, and it
   costs nothing to draw besides. The traveller's own station is not lost —
   the gold mark on the chart is what shows it, and it is drawn for that. */
let _nearHidden=false, _nearWas=null;
function setNearWorldVisible(on,zF){
  /* the banners go long before the rest: a country's NAME over a country
     twenty pixels wide is a smear, and they are the first thing to look
     wrong on the way out */
  const lblF=Math.max(0,1-Math.max(0,(zF||0))*3.2);
  for(const[,L] of shownLabels) if(L&&L.material) L.material.opacity=Math.min(L.material.opacity,lblF);
  if(on===!_nearHidden) return;                 /* nothing to change this frame */
  _nearHidden=!on;
  for(const[,vv] of activeVillages) if(vv.g) vv.g.visible=on;
  for(const[,A] of activeLandmarks){ if(A.g) A.g.visible=on; if(A.label) A.label.visible=on; }
  for(const[,L] of shownLabels) if(L) L.visible=on;
  for(const p2 of SPLASH) if(p2.s&&p2.life<=0) p2.s.visible=false;
  if(!on){
    for(const p2 of SPLASH) if(p2.s) p2.s.visible=false;
    for(const f of FIREFLIES) if(f.s) f.s.visible=false;
    for(const k of SMOKES) if(k.s) k.s.visible=false;
    for(const b of BARKS){ if(b.sp) b.sp.visible=false; }
    if(rain) rain.visible=false;
  }
  /* the ship and the body are put away and GIVEN BACK — remembering what
     the walker's own visibility was, or coming home from the whole-earth
     view would leave the traveller invisible to himself for ever */
  if(!on){ _nearWas={boat:boatG.visible, walk:walkerG.visible};
    boatG.visible=false; walkerG.visible=false; }
  else if(_nearWas){ boatG.visible=_nearWas.boat; walkerG.visible=_nearWas.walk; _nearWas=null; }
}
/* ================= THE GREAT LOOP ================= */
const clock=new THREE.Clock(); let miniT=0, labelT=0, liveT=0;
function frame(){
  requestAnimationFrame(frame);
  const dt=Math.min(0.05,clock.getDelta());
  /* before the voyage begins the MENU stands over the living world: the sky
     keeps its hour, the sea runs, the ship rides the swell at her anchorage,
     and the eye is carried slowly round her */
  if(!running){ if(menuView) menuTick(dt); stageHook(dt); renderer.render(scene,camera); return; }
  /* paused — the world is drawn as it stands, and not one thing in it stirs */
  if(gamePaused){ stageHook(dt); renderer.render(scene,camera); return; }
  /* ---- THE SKY KEEPS YOUR OWN CLOCK, IF YOU ASK IT TO ----
     On 'live' the hour is not run forward by the course at all: it is read
     off the machine's own clock a few times a second, and set as the LOCAL
     hour wherever the traveller happens to be standing. So the game's sun
     stands where the real one does, and a whole afternoon's sailing carries
     him into a real evening. (It is re-read as he moves, too — cross a
     third of the world and noon is still noon where he now stands.) */
  if(!state.paused){
    if(DAYPARTS[state.dayIdx].k==='live'){
      liveT=(liveT||0)-dt;
      if(liveT<=0){ liveT=0.25; applyDayPart(); }
    }
    else state.simHours+=dt*SPEEDS[state.speedIdx][0]/3600;
  }
  stormTick(dt);
  boatTick(dt,state.mode==='boat');
  /* the traveller does not stir while he stands with his hand on the glass */
  if(cut){ /* the scene has the body */ }
  else if(state.mode==='deck') deckTick(dt);
  else if(state.mode==='walk') walkTick(dt);
  else if(state.mode==='fly') flyTick(dt);
  else if(state.mode==='dive') diveTick(dt);
  const p=state.mode==='walk'?state.walk:state.mode==='fly'?state.fly:state.mode==='dive'?state.dive:state.boat;
  const light=skyTick(p.x,p.z);
  /* the wind in the leaves — phase clock and strength for the sway shader */
  WIND_T.value=performance.now()*0.001;
  { const wnd=windAt(p.x,p.z); WIND_A.value=(0.35+wnd.s*0.9)*(1+(light.storm||0)*1.6); }
  /* and the turn of the year, for the seasonal gilding of the leaves and the
     snow that lies — from the season engine, so the traveller's chosen season
     drives the whole world's look */
  SEASON_Y.value=window.SEASON?SEASON.yearPhase(dayOfYear()):(dayOfYear()-1)/364;
  /* aloft the air clears and the eye reaches far — but ONLY aloft, or with
     the eye deliberately drawn back off the world. Down in the played world
     the fog stays shut at the chunks' edge, so gameplay is blocks and haze
     and nothing else; it opens where the carpet takes over. */
  const eyeY=state.mode==='fly'?state.fly.y:20;
  const viewReach=Math.max(eyeY,state.camDist);
  /* the whole-earth fade is reckoned HERE, once — the flyer's fog and the
     carpet both need it before the old computation point further down */
  const zMapF=state.firm?0:Math.max(
      Math.max(0,Math.min(1,(eyeY-9000)/9000)),      /* risen high upon the air */
      zoomMapFade());                                 /* or the eye drawn far back */
  /* ---- THE FLYER SEES TRUE LAND, AND MORE OF IT ----
     The streamed ring itself WIDENS with the wings (13 → 19 chunks with the
     first few hundred units of height), and the fog opens with it — easing
     out on takeoff and shut again on alighting, a storm still closing the
     sky. But the fog is also BOUND inside the true blocks while the flyer
     is below the charted face: the coarse carpet is no longer shown to a
     flyer at all (its terraced blobs read as a broken world from the middle
     heights), so what fills his whole view is real land, and past it the
     haze — and above the cloud floor, the mantle of the cloud cover. */
  /* the ring widens with HEIGHT (13 → 19) and, riding fast, with SPEED as
     well (+2) — at full wing (520 u/s) the frontier is crossed in seconds,
     and the extra ring keeps the new ground rising behind the haze instead
     of popping inside the view */
  /* ---- AND THE DRAWN-BACK EYE IS SHOWN TRUE LAND, AS FAR AS TRUE LAND CAN
         BE GIVEN ----
     Pulling the eye back off the world opens the haze with it — at three
     thousand units out the view runs for miles — but the streamed ring stayed
     at thirteen chunks (1,248 units) whatever the eye did. So the whole of
     the middle of the pull-back was the COARSE CARPET with one small crisp
     patch of true blocks under the ship: the world did not zoom out, it
     handed over to a lego stand-in and then that stand-in zoomed out.
     The ring widens with the pull-back now exactly as it widens with the
     wings, and to the same cap of twenty-one chunks — 2,016 units, which
     carries true blocks to about 3,400 units of pull-back, better than half
     the way to the charted face. Past that no ring of real chunks could fill
     the view and the carpet fairly inherits it.
     And it is GIVEN BACK as the chart comes over the top: chunks under a
     charted face at half strength are chunks nobody can see, and the frame
     should not be paying for them at the very moment the whole earth is
     being drawn. */
  /* AND IT IS SPENT WHERE IT BUYS THE VIEW AND NOWHERE ELSE. Held on all the
     way out, the widened ring went on costing five thousand draw calls a
     frame at seven thousand units of pull-back — where 2,016 units of true
     blocks is a coin in the middle of the window and the carpet has the rest
     of it regardless. It comes in as the haze opens and goes out again as the
     view outgrows anything the mesher could fill. */
  const _cd=state.camDist;
  const backF=Math.max(0,Math.min(1,(_cd-820)/2200))
             *Math.max(0,Math.min(1,(9000-_cd)/4500));
  const backW=Math.round(8*backF*(1-Math.max(0,Math.min(1,(zMapF-0.35)/0.35))));
  /* the ring widens with HEIGHT (13 → 19) and, riding fast, with SPEED as
     well (+2) — at full wing (520 u/s) the frontier is crossed in seconds,
     and the extra ring keeps the new ground rising behind the haze instead
     of popping inside the view */
  const viewEff=Math.min(21,(state.mode==='fly'
    ?13+Math.round(Math.max(0,eyeY-200)/200)+Math.min(2,Math.round((frame._spd||0)/260))
    :VIEW)+backW);
  frame._flyAir=(frame._flyAir||0)
    +(((state.mode==='fly'&&!state.firm)?1:0)-(frame._flyAir||0))*Math.min(1,dt*1.4);
  if(frame._flyAir<0.005) frame._flyAir=0;
  if(scene.fog&&!state.firm){ const climbF=Math.max(0,viewReach-ALOFT_EYE);
    scene.fog.near*=1+climbF/800;
    scene.fog.far=Math.min(scene.fog.far*(1+climbF/22), R_WORLD*3.0);
    if(state.mode==='fly'){ const st2=light.storm||0, bound=viewEff*CHW-150;
      const flyFar=(FOG_FAR+(bound-FOG_FAR)*frame._flyAir)*(1-st2*0.5);
      if(scene.fog.far<flyFar) scene.fog.far=flyFar;
      /* bound inside the blocks in LOW flight; released by HEIGHT as well
         as by the charted face. It used to hold to 9,180 on the face's
         ramp alone while the near-fog went on growing PAST it — a flyer in
         the middle heights lost the whole world to a sheet of fog colour,
         and above ~2,900 near overtook far, which no shader defines. */
      if(scene.fog.far>bound){
        const rel=Math.max(Math.max(0,Math.min(1,(zMapF-0.02)/0.23)),
                           Math.max(0,Math.min(1,(eyeY-1600)/1600)));
        scene.fog.far=bound+(scene.fog.far-bound)*rel; }
      const flyNear=Math.min(scene.fog.far*0.45, FOG_NEAR+(980-FOG_NEAR)*frame._flyAir);
      if(scene.fog.near<flyNear) scene.fog.near=flyNear;
      /* and the near may NEVER cross the far, whatever the two asked for */
      scene.fog.near=Math.min(scene.fog.near, scene.fog.far*0.55); } }
  /* ---- UNDER THE WAVES — the light dims and the water closes in with depth.
     Keyed on the EYE, not on the mode: a swimmer whose camera has rolled
     under the swell stands in the same water as a diver, and must be shown
     the same sea. Near the surface the view stays long, so a coast does not
     vanish a few metres down; it shortens as the deep darkens. */
  const underEye=eyeUnderwater();
  /* ---- THE CLEAR SHALLOWS SHOW WHAT LIVES IN THEM ----
     From the deck the sea read as a painted skin: the kelp, the coral, the
     crabs and the whole blocky bed were only furnished once the eye went
     UNDER, so the living reef sailed beneath every keel unseen and the ocean
     looked dead from above. Whenever the traveller is on or beside water
     with a sunlit bed (to ~70 m), the same sea the diver swims is set out
     under him — floor, weed, reef and beasts — and the flat backdrop discs
     are taken away so the clear water truly opens down onto it. */
  let shallowView=false;
  if(!state.firm&&!underEye&&(state.mode==='boat'||state.mode==='deck'||state.mode==='walk')){
    let wx3=p.x, wz3=p.z;
    if(state.mode==='walk'&&landAtWorld(wx3,wz3)){
      wx3=p.x+Math.sin(state.walk.heading)*36; wz3=p.z+Math.cos(state.walk.heading)*36; }
    /* WITH A BAND OF HYSTERESIS, exactly as the underwater eye has (and for
       the same written reason): the bed is a continuous field, and a ship
       sailing ALONG the 70 m line flipped this every frame — and each flip
       hid or refurnished the whole reef, kelp, fish and floor in one go.
       It opens at 70 m and does not close again until 86 m. */
    if(!landAtWorld(wx3,wz3)){ const bedM=seabedMetres(wx3,wz3);
      shallowView=frame._shv?bedM<86:bedM<70; }
  }
  frame._shv=shallowView;
  /* ---- THE TWO GREAT LIGHTS ARE NOT SEEN FROM UNDER THE SEA ----
     They are drawn with the fog off, so from beneath the waves the sun stood
     as a white blaze straight through the water and washed the floor, the
     reef and everything in front of it clean out of the view. Under the water
     there is light, but there is no sun to look at. */
  { const up=!underEye;
    if(sun) sun.visible=up; if(moon) moon.visible=up;
    if(sunHalo) sunHalo.visible=sunHalo.visible&&up;
    if(moonHalo) moonHalo.visible=moonHalo.visible&&up;
    /* NOR ARE THE STARS. They are drawn with the fog off, so once the sea was
       given its true depths — kilometres of black water, and the water-light
       at full strength — the whole night sky came up THROUGH the deep, and a
       diver a mile down at midnight hung in a field of stars. There is no sky
       under the water. */
    starGroup.visible=up; }
  if(underEye&&scene.fog){
    const eyeY2=state.mode==='dive'?state.dive.y:camera.position.y;
    /* THE LIGHT FAILS ON ITS TRUE MEASURE. Sunlight is spent by a thousand
       metres — below that the sea is black whatever the hour — so the murk is
       whole at 1,000 m and not at the ninety-odd the old bed bottomed out at. */
    const murk=Math.min(1,Math.max(0,SEA_SURF-eyeY2)/(1000*U_PER_M));
    /* deep dark → shallow turquoise. The shallow end was a pale sky-cyan, and
       with the view now closing at three hundred units it washed the whole
       reef out to one flat wash of it. A deeper sea-green holds the blocks
       and the coral up against it. */
    const wc=mix3(0x061826,0x0e4a68,0x2b8ba8,1-murk);
    /* AS DEEP AS THE EYE IS UNDER, and no deeper. A crest washing over the
       lens used to snap the whole world — sky, coast and all — to full
       water-light for the seconds it took to pass, and snap it back again:
       the sea flickering on and off with every wave. It comes in by degrees
       now, so the skin of a wave is a wash and only the true deep is wholly
       water. */
    const w=_eyeSub;
    scene.background.lerp(wc,w); scene.fog.color.lerp(wc,w);
    /* THE WATER IS THE EDGE OF THE VIEW UNDER THE SEA, as it is in minecraft:
       a short blue reach that closes to nothing in the trenches. It is held
       INSIDE the blocky bed's own patch (672 units across), so the eye never
       reaches the rim of the floor — and the deep looks as it should besides,
       the far kelp going to shadow rather than standing sharp to the horizon. */
    scene.fog.near+=(4-scene.fog.near)*w;
    scene.fog.far+=((330-murk*190)-scene.fog.far)*w;
    hemi.intensity+=((1.0-murk*0.6)-hemi.intensity)*w;
    dirL.intensity+=((0.5-murk*0.32)-dirL.intensity)*w; }
  /* ---- BREATH — the diver's chest against the deep ----
     It drains below, refills above; fails, and you break for the surface.
     The immortal breath (🫧) frees you of it altogether. */
  if(state.mode==='dive'){
    if(state.immBreath) state.breath=1;
    else { state.breath-=dt/75;
      if(state.breath<0.3&&!state._breathWarn){ state._breathWarn=true;
        toast('Your chest tightens — the surface is life. Rise and breathe, or take the immortal breath.'); }
      if(state.breath<=0){ state.breath=0.15; state._breathWarn=false; surface();
        toast('Your breath fails — you break for the surface, gasping.'); } }
  } else { state.breath=Math.min(1,state.breath+dt/6); if(state.breath>0.5) state._breathWarn=false; }
  { const bEl=$('breath'); if(bEl){ const show=state.mode==='dive';
      bEl.style.display=show?'block':'none';
      if(show){ $('breath-fill').style.width=Math.round(state.breath*100)+'%';
        bEl.classList.toggle('low',!state.immBreath&&state.breath<0.3);
        bEl.classList.toggle('imm',!!state.immBreath); } } }
  /* the firmament vault fades into view the higher he climbs, and stands solid
     near the top; beyond it THE DEEP closes around — darkness on every side,
     the waters above glowing faint over the apex, the stars seen through the glass */
  /* AND IT IS SEEN FROM THE GROUND, out at the rim. The vault used to fade in
     with height alone, so a man standing on the crown of the ice — with the
     glass a few hundred units over his head — saw nothing there at all. */
  { const pw=state.mode==='fly'?state.fly:state.mode==='walk'?state.walk
        :state.mode==='dive'?state.dive:state.boat;
    _domeRimF=Math.max(0,Math.min(1,(Math.hypot(pw.x,pw.z)/R_WORLD-0.928)/0.03));
    if(_domeRimF>0.01&&!flyDome&&!state.firm) ensureFlyDome(); }
  if(flyDome&&!state.firm){
    const climbF=Math.max(0,Math.min(1,(eyeY-3000)/26000));
    /* from the ground it is a GLAZE, not a lid. At the strength it takes to
       read from thirty thousand units up, the vault stood a hand's breadth
       over the crown of the ice and painted the whole world — sky, ice and
       all — one flat blue. Close to, it is a sheen on glass and the earth
       shows through it. */
    /* while the scene at the world's edge is running it owns the glass — it
       is set there, after this, and to a lower strength on purpose */
    if(!sceneActive()) flyDome.material.opacity=Math.max(climbF*0.55,_domeRimF*0.30);
    /* and it is never the colour of the night sky itself: a vault that goes
       as dark as what is behind it cannot be seen at all */
    flyDome.material.color.copy(mix3(0x2b3d61,0x5f7ca8,0x9ec7f2,light.dayF));
    if(outerDeep) outerDeep.material.uniforms.uOp.value=Math.max(0,Math.min(1,(eyeY-CLOUD_Y*2)/9000))*0.94;
    const aloftF=Math.max(0,Math.min(1,(eyeY-CLOUD_Y*3)/20000));
    if(aloftF>0) starGroup.userData.mat.opacity=Math.max(starGroup.userData.mat.opacity,aloftF*0.85);
  }
  else if(flyDome){ flyDome.material.opacity=0; if(outerDeep) outerDeep.material.uniforms.uOp.value=0; }
  /* ---- THE EARTH'S OWN FACE ----
     Two things call for it and they are one and the same sight: rising high
     enough on the air, and drawing the eye far enough back. Either way the
     little streamed chunks can no longer be read, so the CHARTED earth is
     brought up under the eye — the true outlines of the countries, their
     real size and shape, not a drawn page — and the world is seen whole. */
  /* (zMapF is reckoned once, up beside the flyer's fog) */
  if(zMapF>0.02){ ensureAloftDisc();
    aloftDisc.visible=true; aloftDisc.material.opacity=zMapF;
    aloftDisc.position.y=175+Math.min(2200,Math.max(0,eyeY-9000)*0.06);  /* over the chunk tops, under the flyer */
    aloftTick(dt,p.x,p.z); }
  else if(aloftDisc){ aloftDisc.visible=false; if(aloftMark) aloftMark.visible=false; }
  /* ---- THE TWO LIGHTS KEEP WITHIN THE FIRMAMENT ----
     The sun and moon ride their true courses some forty-five thousand units
     up. That is right when the eye is under them, but the whole-earth view
     lays the CHARTED face of the world a few hundred units off the ground —
     so the lights, forty-five thousand nearer the eye than the earth they
     light, swung wide with the parallax and sailed off past the rim of the
     world into the outer darkness. Drawn back on the wheel, or risen high
     enough that the chart takes over, they are brought down to hang just over
     that charted face, and keep their place above the earth as they should. */
  /* AND THE FIRMAMENT VIEW IS A WHOLE-EARTH VIEW LIKE ANY OTHER: it used to
     be passed over here (!state.firm), so the lights kept the TRAVELLER's
     own sky — a sun that had set where he stood sat half a world's radius
     BELOW the disc, under the bronze table, and the view from the firmament
     had no sun and no moon in it at all. */
  const wholeF=state.firm?1:zMapF;
  if(wholeF>0.02){
    const face=state.firm?180:(aloftDisc?aloftDisc.position.y:175);
    const sk=Math.min(1,wholeF*1.15);
    /* ---- AND THE LIGHTS ARE ALWAYS IN THE FRAME ----
       Each light stands over its own station — the sun above the lands
       where it is now midday — which is right when the WHOLE disc is in
       frame, as the firmament view keeps it. But the drawn-back and aloft
       views frame only a REGION: stand over Taiwan while the sun stands
       off Peru, and both lights were simply absent from that part of the
       sky, returning only when the voyage neared their stations — which
       read as the lights winking out of the world. In the framed views
       each light is drawn IN toward the traveller along its own true
       bearing, just near enough to stand within the frame's reach; it
       slides back out to its exact station as the view widens, and no
       quarter of the earth is ever without its lights. */
    if(!state.firm){
      const reach=viewReach*0.42+1500;
      for(const L of [sun,moon]){
        const dx=L.position.x-p.x, dz=L.position.z-p.z, d=Math.hypot(dx,dz);
        /* the pull-in RIDES THE SAME RAMP as the height (sk), so crossing
           into the whole-earth band never snaps a light across the world */
        if(d>reach){ const k2=(reach+(d-reach)*(1-sk))/d;
          L.position.x=p.x+dx*k2; L.position.z=p.z+dz*k2; } }
    }
    sun.position.y +=((face+R_WORLD*0.030)-sun.position.y)*sk;
    moon.position.y+=((face+R_WORLD*0.026)-moon.position.y)*sk;
    /* the discs were SIZED for the full-disc views (a quarter-million units
       off); drawn near, at the framed views' distances, that size is the
       whole screen. Each keeps a steady angular size against its own
       distance from the eye instead, easing back to the great square of the
       ground sky as the band is left. */
    for(const L of [sun,moon]){
      const baseS=(L===sun?R_WORLD*0.075:R_WORLD*0.055);
      const cd=camera.position.distanceTo(L.position);
      const want=Math.min(baseS, Math.max(900, cd*(L===sun?0.052:0.040)));
      const s2=baseS+(want-baseS)*sk;
      L.scale.set(s2,s2,1);
    }
    /* THE WHOLE EARTH NEVER LOSES ITS LIGHTS. The discs kept the traveller's
       local brightness — zero once a light had set at his own feet — so
       beholding the world entire at his local midnight, the sun (and often
       the moon with it) simply vanished from over the face of the earth.
       Seen from without, the sun is always shining on some country of the
       disc: both lights burn full in the whole-earth views, each standing
       over the lands where its own hour is now. */
    const opF=state.firm?1:Math.max(0,(wholeF-0.35)/0.65);   /* no ghost discs at a mere half-zoom */
    sunMat2.opacity =Math.max(sunMat2.opacity, opF);
    moonMat2.opacity=Math.max(moonMat2.opacity,opF);
    /* and never outside the vault, whatever the hour or the season */
    for(const L of [sun,moon]){ const rr=Math.hypot(L.position.x,L.position.z);
      if(rr>R_DOME*0.94){ const k2=R_DOME*0.94/rr; L.position.x*=k2; L.position.z*=k2; } }
  }
  /* leaving the whole-earth band, the lights take back their ground size */
  if(wholeF<=0.02){ sun.scale.set(R_WORLD*0.075,R_WORLD*0.075,1);
    moon.scale.set(R_WORLD*0.055,R_WORLD*0.055,1); }
  haloTick(wholeF);               /* the lights get their glow when the earth is beheld whole */
  /* drawn right back, the sky about the disc gives way to the outer darkness,
     and the earth is beheld standing within it — as she is.
     AND WITH HIS HAND ON THE GLASS HE IS LOOKING STRAIGHT OUT INTO IT: that
     is the whole of what the scene at the world's edge is for, so the dark
     and the host come up there too, on the scene's own ramp. */
  const voidF=state.firm?1:Math.max(zMapF, sceneSet('voidDark'));
  if(voidF>0.002) scene.background.lerp(_voidC,Math.min(1,voidF*1.14));
  voidStarTick(voidF);            /* and the host of the shamayim stands in it */
  /* and the haze of the near world must not blind an eye drawn back off it */
  if(scene.fog&&voidF>0.002){
    scene.fog.near+=(R_WORLD*0.5-scene.fog.near)*voidF;
    scene.fog.far +=(R_WORLD*3.0-scene.fog.far )*voidF;
    /* the wall of night at the rim takes its colour from the fog, so that it
       blends into the day's sky when stood under — out here it must go dark
       with everything else, or it rings the earth in a band of sunset */
    scene.fog.color.lerp(_voidC,Math.min(1,voidF*1.06)); }
  updateWallWeather(p.x,p.z,dt);   /* cold fog and blowing snow at the wall of ice */
  waterTick(p.x,p.z,light.dayF,light.storm||0);
  /* below the waterline in the hold, the sea must not wash through the hull;
     and in the dive, the lowered sea-bed plane must not roof the deep */
  if(!state.firm){ const inHold=state.mode==='deck'&&state.deck.level==='hold';
    /* ONE water, not layers: the opaque far-sea sheets (at −12 and −16) are a
       surface-view backdrop only. The moment the eye is beneath the waves —
       diving, or a swimmer's camera rolled under the swell — they are hidden,
       or they read as a second sea hanging in the deep with fish above and
       below it. */
    /* THE DETAILED WAVES ARE A 5,000-UNIT SQUARE. Seen from miles up they
       read as a pale dotted patch riding the middle of the ocean — the
       "little square" — so above ~5,000 the grid hands the sea to the
       colour-matched backdrop discs (the two are deliberately painted alike,
       so nothing is seen to change hands) and takes it back on the way down. */
    /* keyed on the VIEW's reach, not the flyer's height alone — the eye
       drawn far back from the deck sees the same pale square from the same
       distance, and must lose it the same way */
    frame._wgHi = frame._wgHi ? viewReach>4800 : viewReach>5200;
    waveGrid.visible=!inHold&&!frame._wgHi;
    sea.visible=seaDeep.visible=!inHold&&!underEye;
    /* over the furnished shallows the discs drop far beneath the lit bed, so
       the true floor and its life show through the clear water — while the
       water past the patch still has the deep's own blue standing under it */
    /* the discs EASE between their two stations — dropped 460 units in one
       frame, what showed through the water everywhere changed in one frame
       with them, a whole-ocean flicker at every crossing of the shelf line */
    sea.position.y    +=((shallowView?WATER_Y-520:WATER_Y-60 )-sea.position.y    )*Math.min(1,dt*2.5);
    seaDeep.position.y+=((shallowView?WATER_Y-820:WATER_Y-300)-seaDeep.position.y)*Math.min(1,dt*2.5); }
  seaLifeTick(p.x,p.z,dt);
  splashTick(dt);
  fishTick(dt);
  spearTick(dt);
  crewTick(dt);
  netTick(dt);
  if(!state.firm&&state.mode!=='dive') traderTick(p.x,p.z,dt); else hideTraders();
  audioTick(light.storm||0);
  torchTick(dt);                     /* the flame the traveller carries */
  flushEdits(7);                     /* and any chunk a hand has changed is laid again */
  /* stream faster when the traveller outruns the mesher — judged by how fast
     he is TRULY moving, whatever is carrying him (ship, wings, or a fair
     wind), so the ground always arrives behind the haze and never inside it */
  const trueSpd=Math.hypot(p.x-(frame._px!==undefined?frame._px:p.x),
                           p.z-(frame._pz!==undefined?frame._pz:p.z))/Math.max(dt,1e-3);
  frame._px=p.x; frame._pz=p.z; frame._spd=trueSpd;
  /* at full wing the mesher takes a deeper slice — the widened ring must be
     FILLED at 520 u/s, or the frontier is built inside the opened air */
  /* and the widened ring of a pull-back must be FILLED while the eye is going
     out, or the wheel is turned faster than the ground can be laid and the
     traveller watches his own world arrive in pieces behind him */
  const chunkBudget=(state.mode==='fly'&&trueSpd>260)?14
    :(state.mode==='fly'||trueSpd>50||backW>0)?9:4;
  updateChunks(p.x,p.z,chunkBudget,viewEff);
  /* ---- NOTHING BUT BLOCKS IN GAMEPLAY ----
     The coarse far ring is BANISHED from the played world. Down on the sea,
     ashore, on a summit, rising low over a coast — everything in view is true
     blocks, and what lies past the chunks lies in the fog, as it does in
     Minecraft. The ring exists for one purpose only: it is the CARPET that
     comes up under the eye on the way out to the whole-earth view — risen
     high on the air, or the eye drawn far back — where the blocks below can
     no longer be read anyway. It is never drawn over land the traveller can
     walk to and look at. */
  /* ---- WHAT STANDS IN THE VIEW, AND WHEN ----
     The streamed chunks reach 1,248 units. Seen from miles up they are one
     small crisp patch adrift on a blurred chart, which is the whole of the
     complaint: a fragment of the world instead of the world. Once the
     charted face is more than half in, the chunks and the coarse ring are
     taken out of the view altogether and the earth is shown whole. */
  /* the cut waits until the charted face is nearly OPAQUE (0.97, not 0.75) —
     at three-quarters faded a quarter of the near world still showed, and
     then vanished in a single frame */
  const showNear = !state.firm && zMapF<0.97;
  chunkRoot.visible = showNear;
  setNearWorldVisible(showNear, zMapF);
  /* the near WATER goes with the near land. The wave grid is a flat square
     5,000 units on a side: left standing while the charted face came up
     under it, it sat on the middle of the world as a pale rectangle with the
     little patch of streamed land inside it — which is worse than either on
     its own. The two backdrop sheets go with it. */
  if(!showNear){ waveGrid.visible=false; sea.visible=false; seaDeep.visible=false; }
  /* THE CARPET NEITHER BLINKS NOR POPS: the on/off line has a band of
     hysteresis (hover at exactly y=1000 used to flick the whole coarse world
     on and off frame by frame), and the ring FADES in and out instead of
     appearing whole in one frame.
     AND IT STANDS UNDER EVERY FLYER, however low — the flyer's opened air
     reaches past the chunks, and what fills that reach is the carpet, or it
     would be bare haze-line and void. */
  /* AND A LOW FLYER IS NOT SHOWN IT — his fog is bound inside the true
     blocks instead, so his whole view is real land. But in the MIDDLE
     heights, where the fog is released and the charted face is still far
     off, the world used to simply END at the chunk ring: bare backdrop
     where countries should stand, and every new chunk popping into open
     air. There the carpet DOES stand under him — coarse lego beyond the
     fine — so the earth runs unbroken to the horizon at every height. */
  const flyNoCarpet = state.mode==='fly'&&zMapF<0.02&&eyeY<1400;
  const carpet = !flyNoCarpet && (frame._carpetOn ? (viewReach>ALOFT_EYE*0.85||zMapF>0.012)
                                                  : (viewReach>ALOFT_EYE||zMapF>0.02));
  frame._carpetOn = showNear&&!underEye&&carpet;
  /* ---- AND THE RING HOLDS UNTIL THE CHART TRULY COVERS IT ----
     Fading it against the chart was tried and it was wrong: the chart is a
     disc laid OVER the ring, so as the ring thinned there was a moment with
     neither — a hole where the world should be. It stays at full strength
     and the chart simply covers it, which is what a cross-dissolve between a
     near thing and a far thing has to be. It goes out only at the very end,
     when the chart is all but opaque and there is nothing of the ring left
     to see anyway. */
  const carpetWant=(frame._carpetOn?1:0)*(1-Math.max(0,Math.min(1,(zMapF-0.90)/0.07)));
  farLandMat.opacity+=(carpetWant-farLandMat.opacity)*Math.min(1,dt*2.5);
  farLand.visible=farLandMat.opacity>0.02;
  if(frame._carpetOn) updateFarLand(p.x,p.z,false,eyeY);
  updateVillages(p.x,p.z,dt,light.nightF);
  updateLandmarks(p.x,p.z);
  /* the living world — weather, hearths, fireflies, meetings, murmurs */
  if(!state.firm){ const _t=performance.now()*0.001;
    weatherTick(p.x,p.z,dt,light.storm||0);
    smokeTick(p.x,p.z,dt);
    fireflyTick(p.x,p.z,dt,_t,light.nightF||0);
    encounterTick(p.x,p.z,dt,_t);
    greetTick(dt,light.nightF||0);
    ambientAudioTick(dt,light,p);
    checkFulfilled();
  } else { rain.visible=false; if(ENC.kind&&ENC.models[ENC.kind]) ENC.models[ENC.kind].visible=false;
    for(const b of BARKS){ b.ent=null; b.sp.visible=false; } }
  tradeGuard();
  updateScrolls(p.x,p.z);        /* the scrolls stand in their places */
  guideTick(dt);                 /* and the compass needle lies on the next of them */
  cameraTick(dt);
  labelT-=dt; if(labelT<=0){ labelT=0.4; updateLabels(p.x,p.z); placeTick(); }
  miniT-=dt; if(miniT<=0){ miniT=0.5; drawMapInto(minictx,mini.width,false);
    if(bigOpen) sizeBig(); }
  saveT-=dt; if(saveT<=0){ saveT=10; saveState(); }
  if(!state.firm){ const above=Math.max(0,Math.min(1,(eyeY-CLOUD_Y)/90));
    /* ---- THE CLOUDS ARE NOT A LID ----
       The sheets of cloud are a thing to fly THROUGH and to look down upon
       from just above. Draw the eye BACK from a traveller who is only a
       little over the cloud floor, and they become an opaque white ceiling
       across the whole world — and all that can be seen of the earth is the
       few mountain tops that stand out of them. (That is the whole of "the
       countries are not loading, only the mountains out of the water": the
       land was there all along, under a lid.) They thin as the eye draws
       back, and are gone well before it is far enough to want the chart. */
    /* — but ONLY for a traveller who is UNDER them. A flyer is above the
       floor of cloud: the sheets are his ground-cover, not his ceiling, and
       fading them with the follow-camera's distance made the whole sky of
       clouds vanish the moment his eye rode past 800 out. For him they
       stand, and thin only with his own height, as they always did. */
    const cloudFade=above>0.5?1:1-Math.max(0,Math.min(1,(state.camDist-200)/600));
    clouds.visible=cirrus.visible=!underEye;   /* no sky-clouds seen from under the sea */
    clouds.position.x=p.x; clouds.position.z=p.z;
    TEX.clouds.offset.x=(p.x/9600*7+state.simHours*0.004)%1;
    TEX.clouds.offset.y=(p.z/9600*7)%1;
    /* thin the blocky floor as the eye passes through it, and fade it out well
       above — whether risen on the air or stood high upon the ice wall */
    const pY = state.mode==='fly'?state.fly.y : state.mode==='walk'?(state.walk.feetY!==undefined?state.walk.feetY:20) : 20;
    const highF = Math.max(0,Math.min(1,(pY-CLOUD_Y)/70));
    const gap=Math.abs(eyeY-CLOUD_Y), through=Math.min(1,gap/80);
    cloudMat.opacity*=(0.22+0.78*through)*(1-above*0.9)*(1-highF*0.96)*(1-zMapF)*cloudFade;
    cirrus.position.x=p.x; cirrus.position.z=p.z;
    const climb=Math.max(0,Math.min(1,(eyeY-CLOUD_Y)/900));
    cirrusMat.opacity=(0.08+light.dayF*0.16)*Math.min(1,climb*1.5)*(1-above*0.7)*(1-zMapF)*cloudFade;
    /* the sea of clouds — a bumpy, shaded deck with wisps drifting above */
    /* the LOCAL deck patch is for skimming just over the clouds — from far
       above it is a floating grey slab with an edge; fade it away and let the
       whole-earth cover carry the view */
    const deckFade=Math.max(0,1-Math.max(0,eyeY-2600)/6000);
    cloudCover.visible=above>0.003&&cloudFade>0.01;
    cloudDeck.visible=cloudWisp.visible=above>0.003&&deckFade>0.01&&cloudFade>0.01;
    if(above>0.003){
      /* the deck's 17k-vertex re-noise ran EVERY frame however far above it
         the eye stood — a steady tax paid exactly when the flyer needs the
         frames. Close over the deck it still runs each frame (there it must
         be glassy-smooth); high above, where a lagging edge cannot be seen,
         it takes a breath between rebuilds. */
      const nearDeck=Math.abs(eyeY-CLOUD_Y)<520;
      frame._cdT=(frame._cdT||0)-dt;
      if(nearDeck||frame._cdT<=0){ frame._cdT=0.28;
        cloudDeck.position.set(p.x,CLOUD_Y,p.z); updateCloudDeck(p.x,p.z); }
      cloudDeckMat.opacity=above*deckFade*cloudFade; cloudDeckMat.color.copy(mix3(0x6b7690,0xe6cba4,0xffffff,light.dayF));
      cloudWisp.position.x=p.x; cloudWisp.position.z=p.z;
      wispMat.opacity=above*0.5*deckFade*cloudFade; wispMat.color.copy(mix3(0x4a5570,0xe0c49c,0xffffff,light.dayF));
      const dr2=state.simHours*0.006;
      wispMat.map.offset.set((p.x/100000*30+dr2)%1,(p.z/100000*30)%1);
      /* the fixed cover mantles the whole earth (does NOT follow the traveller);
         from on high it thins, and the earth's charted face shows through it */
      const mapF2=Math.max(0,Math.min(1,(eyeY-9000)/9000));
      /* and it thins with the ZOOM as well as with the climb — drawn back to
         behold the whole earth from a low altitude, this sheet is a solid
         white lid over the world and nothing of her can be seen at all */
      cloudCover.material.opacity=above*0.97*(1-mapF2*0.82)*(1-zMapF)*cloudFade;
      cloudCover.material.color.copy(mix3(0x59637a,0xe0c6a0,0xffffff,light.dayF));
    } }
  /* THE DEEP IS FURNISHED WHENEVER THE EYE IS IN IT — diving, swimming, or a
     camera dipped under a wave from the strand. It follows the eye, not the
     mode, so there is no longer a seam where one world ends and another
     begins. */
  if(!state.firm&&(underEye||shallowView)){
    frame._deepHold=0.75;
    const dv=state.mode==='dive';
    const dx2=dv?state.dive.x:(underEye?camera.position.x:p.x), dz2=dv?state.dive.z:(underEye?camera.position.z:p.z);
    const dy2=dv?state.dive.y:(underEye?camera.position.y:SEA_SURF-6);
    initDeep();
    updateDeep(dx2,dy2,dz2,dt,underEye?Math.min(1,Math.max(0,SEA_SURF-dy2)/560):0,dv);
  }
  /* the furnished deep is not struck the instant the eye leaves it — a short
     hold rides out a wave crest or a step ashore, so the reef never strobes */
  else if(deepShown){ frame._deepHold=(frame._deepHold||0)-dt;
    if(frame._deepHold<=0) hideDeep(); }
  /* the beasts of the field and the fowl of the air, over all the earth */
  if(!state.firm&&state.mode!=='dive'){ const tt=performance.now()*0.001, night=(light.nightF||0)>0.5;
    updateAirLife(p.x,p.z,dt,tt,night);
    /* the same fish are stirred by updateDeep when the eye is under — or when
       the clear shallows are furnished from above — moving them twice in one
       frame doubled their speed and tore the schools apart */
    if(!underEye&&!shallowView) updateShallowLife(p.x,p.z,dt,tt);   /* fish and turtles seen through the clear shallows */
    podTick(p.x,p.z,dt,tt);             /* the whale pods, making for the fishing grounds */
    orcaTick(p.x,p.z,dt,tt);            /* and the killer whales, on their own road in the deep */
    if(state.mode==='boat'||state.mode==='deck'||state.mode==='walk'){
      updateLandLife(p.x,p.z,dt,tt); updateRiverLife(p.x,p.z,dt,tt); updateBlooms(p.x,p.z,dt); }
    else { hideLandLife(); hideBlooms(); } }
  else { hideLandLife(); hideAirLife(); hidePod(); hideOrca(); hideBlooms(); }
  if(state.firm&&firmMark) firmMark.position.set(p.x,R_WORLD*0.012,p.z);
  seaTex.offset.x=(performance.now()*0.000012)%1; seaTex.offset.y=(performance.now()*0.000009)%1;
  const _pn=performance.now();
  TEX.surf.offset.x=(_pn*0.00006)%1; TEX.surf.offset.y=(_pn*0.00013)%1;
  surfMat.opacity=0.42+0.28*Math.sin(_pn*0.0022);      /* the wash advancing and drawing back */
  stageHook(dt);
  renderer.render(scene,camera);
}
frame();
};
