/* THE TRUE FACE OF THE EARTH — reading world/dem.js.

   The heights of the land and the depths of the sea, in metres, as the open Terrain Tiles give
   them (SRTM, GMTED, ETOPO1 and their fellows, gathered by Mapzen on AWS Open Data). They come
   in LAYERS, each a block of the web-mercator tiles at one zoom: the whole earth coarse, the
   Levant finer, the hills of Yahuḏah finer still, and the city of the great king at some thirty
   metres to a sample. A height is read from the finest layer that holds the point, between its
   four nearest samples.

   The data is packed small (see the head of world/dem.js), and is unpacked here once, on the
   first question, by a raw INFLATE written out below — a few dozen lines of the deflate format,
   so the game needs no library and still opens from a file with no server.

   DEM.heightAt(lat, lon) → metres (negative under the sea), or null where no layer holds it.
   DEM.ready() → whether there is any data at all. */
(function(){
'use strict';

/* ---- INFLATE (RFC 1951), raw: no header ---- */
function inflateRaw(src, outLen){
  const out=new Uint8Array(outLen); let op=0;
  let ip=0, bitBuf=0, bitCnt=0;
  function bits(n){ while(bitCnt<n){ bitBuf|=src[ip++]<<bitCnt; bitCnt+=8; }
    const v=bitBuf&((1<<n)-1); bitBuf>>>=n; bitCnt-=n; return v; }
  /* a Huffman table: counts per length, and the symbols in canonical order */
  function build(lens,n){ const count=new Uint16Array(16), offs=new Uint16Array(16), sym=new Uint16Array(n);
    for(let i=0;i<n;i++) count[lens[i]]++;
    count[0]=0; for(let i=1;i<16;i++) offs[i]=offs[i-1]+count[i-1];
    for(let i=0;i<n;i++) if(lens[i]) sym[offs[lens[i]]++]=i;
    return {count,sym}; }
  function decode(h){ let code=0, first=0, index=0;
    for(let len=1;len<16;len++){ code|=bits(1); const c=h.count[len];
      if(code-c<first) return h.sym[index+(code-first)];
      index+=c; first+=c; first<<=1; code<<=1; }
    throw new Error('inflate: bad code'); }
  const LBASE=[3,4,5,6,7,8,9,10,11,13,15,17,19,23,27,31,35,43,51,59,67,83,99,115,131,163,195,227,258];
  const LEXT=[0,0,0,0,0,0,0,0,1,1,1,1,2,2,2,2,3,3,3,3,4,4,4,4,5,5,5,5,0];
  const DBASE=[1,2,3,4,5,7,9,13,17,25,33,49,65,97,129,193,257,385,513,769,1025,1537,2049,3073,4097,6145,8193,12289,16385,24577];
  const DEXT=[0,0,0,0,1,1,2,2,3,3,4,4,5,5,6,6,7,7,8,8,9,9,10,10,11,11,12,12,13,13];
  let FIXL=null, FIXD=null;
  function fixed(){ if(FIXL) return;
    const l=new Uint8Array(288); for(let i=0;i<144;i++) l[i]=8; for(let i=144;i<256;i++) l[i]=9; for(let i=256;i<280;i++) l[i]=7; for(let i=280;i<288;i++) l[i]=8;
    FIXL=build(l,288); const d=new Uint8Array(30).fill(5); FIXD=build(d,30); }
  function block(L,D){
    for(;;){ const s=decode(L);
      if(s<256){ out[op++]=s; continue; }
      if(s===256) return;
      const li=s-257, len=LBASE[li]+bits(LEXT[li]);
      const di=decode(D), dist=DBASE[di]+bits(DEXT[di]);
      for(let k=0;k<len;k++){ out[op]=out[op-dist]; op++; } } }
  const ORD=[16,17,18,0,8,7,9,6,10,5,11,4,12,3,13,2,14,1,15];
  let last=0;
  while(!last){
    last=bits(1); const type=bits(2);
    if(type===0){ bitBuf=0; bitCnt=0;
      const len=src[ip]|(src[ip+1]<<8); ip+=4;
      out.set(src.subarray(ip,ip+len),op); ip+=len; op+=len; }
    else if(type===1){ fixed(); block(FIXL,FIXD); }
    else if(type===2){
      const nl=bits(5)+257, nd=bits(5)+1, nc=bits(4)+4;
      const cl=new Uint8Array(19); for(let i=0;i<nc;i++) cl[ORD[i]]=bits(3);
      const CH=build(cl,19), lens=new Uint8Array(nl+nd);
      for(let i=0;i<nl+nd;){ const sy=decode(CH);
        if(sy<16){ lens[i++]=sy; continue; }
        let rep=0, v=0;
        if(sy===16){ v=lens[i-1]; rep=3+bits(2); }
        else if(sy===17) rep=3+bits(3);
        else rep=11+bits(7);
        while(rep--) lens[i++]=v; }
      block(build(lens.subarray(0,nl),nl), build(lens.subarray(nl),nd)); }
    else throw new Error('inflate: bad block');
  }
  return out;
}

/* ---- THE LAYERS, UNPACKED ---- */
let LAY=null;
function unpack(){
  if(LAY) return LAY;
  LAY=[];
  const src=(window.EARTH&&window.EARTH.dem&&window.EARTH.dem.layers)||[];
  for(const L of src){
    const bin=atob(L.b), u8=new Uint8Array(bin.length);
    for(let i=0;i<bin.length;i++) u8[i]=bin.charCodeAt(i);
    const raw=inflateRaw(u8,L.w*L.h*2), d=new Int16Array(raw.buffer);
    /* undo the planar prediction */
    const W=L.w, H=L.h, q=new Int16Array(W*H);
    q[0]=d[0];
    for(let x=1;x<W;x++) q[x]=q[x-1]+d[x];
    for(let y=1;y<H;y++){ const r=y*W, p=r-W; q[r]=q[p]+d[r];
      for(let x=1;x<W;x++) q[r+x]=d[r+x]+q[r+x-1]+q[p+x]-q[p+x-1]; }
    LAY.push({z:L.z,x0:L.x0,y0:L.y0,w:W,h:H,s:L.s||1,q});
    L.b=null;                         /* the packed text is not wanted again */
  }
  /* the finest first */
  LAY.sort((a,b)=>(b.z-Math.log2(b.s))-(a.z-Math.log2(a.s)));
  return LAY;
}
/* where a point falls in a layer, in its own samples (fractional), or null outside it */
function pixOf(L,lat,lon){
  const n=256*Math.pow(2,L.z)/L.s;
  const la=Math.max(-85.05,Math.min(85.05,lat))*Math.PI/180;
  const X=(lon+180)/360*n-L.x0, Y=(1-Math.log(Math.tan(la)+1/Math.cos(la))/Math.PI)/2*n-L.y0;
  if(X<0||Y<0||X>L.w-1||Y>L.h-1) return null;
  return [X,Y];
}
function sample(L,X,Y){
  const ix=Math.min(L.w-2,X|0), iy=Math.min(L.h-2,Y|0), tx=X-ix, ty=Y-iy, q=L.q, i=iy*L.w+ix;
  const a=q[i], b=q[i+1], c=q[i+L.w], d=q[i+L.w+1];
  return (a+(b-a)*tx)*(1-ty)+(c+(d-c)*tx)*ty;
}
function heightAt(lat,lon){
  const LS=unpack();
  for(const L of LS){ const p=pixOf(L,lat,lon); if(p) return sample(L,p[0],p[1]); }
  return null;
}
/* the finest layer's own sample spacing at a point, in metres (how much is real there and how much
   must be drawn by the fractal under it) */
function spacingAt(lat,lon){
  const LS=unpack();
  for(const L of LS){ if(pixOf(L,lat,lon)) return 40075016*Math.cos(lat*Math.PI/180)/(256*Math.pow(2,L.z)/L.s); }
  return null;
}
window.DEM={ heightAt, spacingAt, ready:()=>!!(window.EARTH&&window.EARTH.dem&&window.EARTH.dem.layers&&window.EARTH.dem.layers.length),
  layers:()=>unpack().map(L=>({z:L.z,s:L.s,w:L.w,h:L.h})), _inflate:inflateRaw };
})();
