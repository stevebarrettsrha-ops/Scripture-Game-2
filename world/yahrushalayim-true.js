/* ================= YAHRUSHALAYIM AT HER TRUE MEASURE (ROADMAP Phase T7) =================
   When the earth is drawn at the people's own measure (engine.js, TRUE_EARTH) the city of the great
   king stands at her true size on her own hills, read from the earth's heights (world/dem.js): the
   Mount of the House over the Qidron, the western hill across the Tyropoeon, the ridge of the city of
   Dawiḏ running south to the pool of Shiloaḥ, and the Mount of Olives across the Qidron.
   The measures are in TRUE-MEASURES.md, and these are they:
     · Herodes' platform: west side 488 m, east 470, north 315, south 280; the royal porch along the
       whole south side, 32 m deep, its nave 30 m high; double porches 15 m deep on the other three;
       the House 100 cubits (52.5 m) long and high, its porch 100 wide, its back 70; the court of the
       women 70.9 m square; the inner court 98.2 by 70.9 m; the altar 32 cubits square (16.8 m); the
       fortress at the north-west corner some 115 by 40 m.
     · Shelomoh's house: 60 by 20 cubits within, 30 high (31.5 × 10.5 × 15.75 m), its porch 20 wide
       and 10 deep, the side chambers three storeys about it; Yakin and Boaz 12 m; the bronze altar
       20 × 20 × 10 cubits; the great court a square of 500 cubits (262.5 m).
   Cubits are the royal cubit of 0.525 m. Metres here are about the anchor, which is the rock of the
   House itself (31.7781 N, 35.2354 E); north is −z, east is +x, and y is metres over the rock's own
   ground. The marks keep the names the story's scenes ask for.

   The same periods as the city of the small map: 'kings', 'herodes', 'return'. */
(function(){
window.YAHRU_PLAN_TRUE=function(api,period){
  const herod=period==='herodes', ruin=period==='return';
  const LIME=0xd8cfb8, STONE=0x9c9486, STONE2=0x7a7266, PATH=0xb49a74, TIMBER=0x6e5238, GOLD='hay',
        WHITE=0xece6d6, BRONZE=0x8a6a3a, CEDAR=0x7a4a2a, BLUE=0x4a2a6a;
  const hash=(x,z)=>{ const s=Math.sin(x*127.1+z*311.7)*43758.5453; return s-Math.floor(s); };
  const gY=(x,z)=>api.groundY(x,z);

  /* ---- A WALL ALONG A LINE OF POINTS, on the ground under it, with towers and gates ----
     gates: [[x,z,halfWidth],...] — the wall left open there */
  function wallLine(pts,o){ o=o||{}; const h=o.h||12, t=o.t||4, every=o.towers||60, gates=o.gates||[];
    let run=0;
    for(let p=0;p+1<pts.length;p++){ const [x0,z0]=pts[p], [x1,z1]=pts[p+1], L=Math.hypot(x1-x0,z1-z0), n=Math.max(1,Math.round(L/3));
      for(let k=0;k<n;k++){ const a=k/n, b=(k+1)/n, ax=x0+(x1-x0)*a, az=z0+(z1-z0)*a, bx=x0+(x1-x0)*b, bz=z0+(z1-z0)*b;
        const mx=(ax+bx)/2, mz=(az+bz)/2; run+=L/n;
        if(gates.some(g=>Math.hypot(mx-g[0],mz-g[1])<g[2])) continue;
        const y=gY(mx,mz), rx=Math.abs(bx-ax)/2+t/2, rz=Math.abs(bz-az)/2+t/2;
        if(ruin){ const r=hash(mx,mz); if(r<0.35) continue; api.box(mx-rx,y-1,mz-rz,mx+rx,y+1+r*h*0.5,mz+rz,STONE2); continue; }
        api.box(mx-rx,y-1,mz-rz,mx+rx,y+h,mz+rz,o.col||LIME);
        if(k%2===0) api.box(mx-rx*0.5,y+h,mz-rz*0.5,mx+rx*0.5,y+h+1.2,mz+rz*0.5,o.col||LIME);   /* crenels */
        if(run>=every){ run=0; api.box(mx-4,y-1,mz-4,mx+4,y+h+6,mz+4,o.col||LIME); } } }
    for(const g of gates){ const y=gY(g[0],g[1]);                                                   /* the gate towers */
      if(ruin) continue;
      api.box(g[0]-g[2]-5,y-1,g[1]-5,g[0]-g[2],y+h+5,g[1]+5,o.col||LIME); api.box(g[0]+g[2],y-1,g[1]-5,g[0]+g[2]+5,y+h+5,g[1]+5,o.col||LIME); } }
  function tower(x,z,w,d,h,col){ const y=gY(x,z); api.box(x-w/2,y-2,z-d/2,x+w/2,y+h,z+d/2,col||LIME); }
  /* columns along a line, every `step` metres, from y0 up h */
  function columns(x0,z0,x1,z1,y0,h,step,col){ const L=Math.hypot(x1-x0,z1-z0), n=Math.max(1,Math.round(L/step));
    for(let k=0;k<=n;k++){ const x=x0+(x1-x0)*k/n, z=z0+(z1-z0)*k/n; api.box(x-0.7,y0,z-0.7,x+0.7,y0+h,z+0.7,col||WHITE); } }
  /* houses in a block of the city, on the ground where each stands (some six hundred of them in all:
     the city held tens of thousands, and the rest of her are for a later round, drawn far off) */
  function quarter(x0,z0,x1,z1,pitch,keep){ const list=[];
    for(let x=x0;x<=x1;x+=pitch) for(let z=z0;z<=z1;z+=pitch){
      if(keep&&!keep(x,z)) continue;
      if(ruin&&hash(x*0.3,z*0.7)<0.7) continue;
      const w=7+hash(x*2,z)*4, d=7+hash(z*2,x)*4;
      list.push({x:x+(hash(x,z)-0.5)*2, z:z+(hash(z,x)-0.5)*2, w, d, door:hash(x,z*3)<0.5?'n':'s', seed:Math.floor(hash(x*5,z*5)*997)+1}); }
    if(api.quarter) api.quarter(list); else for(const q of list) api.house(q.x,q.z,q.w,q.d,{door:q.door,seed:q.seed});
    return list.length; }

  /* ================= THE MOUNT OF THE HOUSE ================= */
  const PY=-6;                                                          /* the courts' level, metres over the rock's ground */
  if(herod){
    /* Herodes' platform, a trapezium: west 488, east 470, north 315, south 280 */
    const N=-267, S=220, xw=z=>-132+(z-N)/(S-N)*4, xe=z=>183-(z-N)/(S-N)*31;
    for(let z=N;z<S;z+=8){ const z1=Math.min(S,z+8); api.pad(xw(z),z,xe(z1),z1,{y:PY,fill:'hewn-stone',top:'cobble',blend:0}); }
    /* the parapet about its edge */
    for(let z=N;z<S;z+=4){ api.box(xw(z)-1,PY,z,xw(z),PY+1.4,z+4,LIME); api.box(xe(z),PY,z,xe(z)+1,PY+1.4,z+4,LIME); }
    /* THE PORCHES of the court of the nations: double colonnades 15 m deep along west, north and
       east (Shelomoh's porch the eastern, Yahuchanon 10:23), their roofs 13 m up */
    for(let z=N+15;z<186;z+=5){ api.box(xw(z),PY,z,xw(z)+1.2,PY+13,z+5,LIME); api.box(xe(z)-1.2,PY,z,xe(z),PY+13,z+5,LIME); }
    columns(xw(N)+6,N+15,xw(186)+6,186,PY,12.5,5); columns(xw(N)+11,N+15,xw(186)+11,186,PY,12.5,5);
    columns(xe(N)-6,N+15,xe(186)-6,186,PY,12.5,5); columns(xe(N)-11,N+15,xe(186)-11,186,PY,12.5,5);
    api.box(xw(N),PY+12.5,N,xw(N)+15,PY+13.5,186,TIMBER); api.box(xe(N)-15,PY+12.5,N,xe(N),PY+13.5,186,TIMBER);
    api.box(xw(N),PY,N,xe(N),PY+13,N+1.2,LIME); columns(xw(N)+15,N+6,xe(N)-15,N+6,PY,12.5,5); columns(xw(N)+15,N+11,xe(N)-15,N+11,PY,12.5,5);
    api.box(xw(N),PY+12.5,N,xe(N),PY+13.5,N+15,TIMBER);
    /* THE ROYAL PORCH along the whole south side: four rows of 162 columns, its aisles 15 m high and
       its nave 30, the back wall on the south edge */
    const RS0=186, RS1=218, rw=xw(S), re=xe(S);
    api.box(rw,PY,RS1,re,PY+16,S,LIME);
    columns(rw+2,RS0+3,re-2,RS0+3,PY,15,6.9); columns(rw+2,RS1-3,re-2,RS1-3,PY,15,6.9);
    columns(rw+2,RS0+12,re-2,RS0+12,PY,30,6.9); columns(rw+2,RS0+21,re-2,RS0+21,PY,30,6.9);
    api.box(rw,PY+15,RS0,re,PY+16,RS0+12,TIMBER); api.box(rw,PY+15,RS0+21,re,PY+16,RS1,TIMBER);
    api.box(rw,PY+16,RS0+11.5,re,PY+30,RS0+12.5,LIME); api.box(rw,PY+16,RS0+20.5,re,PY+30,RS0+21.5,LIME);   /* the clerestory */
    api.box(rw,PY+30,RS0+11.5,re,PY+31.2,RS0+21.5,TIMBER);
    /* the stair up from the street at the south-west corner, over the great arch */
    for(let s=0;s<24;s++) api.box(rw-14-s*1.2,PY-1-s*0.9,RS0+2,rw-13-s*1.2+1.2,PY-s*0.9,RS0+15,STONE);
    /* the gates of Ḥuldah in the south wall, and the broad steps up to them from the city */
    for(const gx of [-55,25]) for(let s=0;s<20;s++) api.box(gx-20,PY-1-s*0.6,S+s*1.1,gx+20,PY-s*0.6,S+(s+1)*1.1,STONE);
    /* THE BALUSTRADE (soreg), and the terrace of the inner courts within it */
    const soreg=(x0,z0,x1,z1)=>{ for(let x=x0;x<x1;x+=2){ if(hash(x,1)<0.08) continue; api.box(x,PY,z0,x+1.6,PY+1.5,z0+0.3,WHITE); api.box(x,PY,z1-0.3,x+1.6,PY+1.5,z1,WHITE); }
      for(let z=z0;z<z1;z+=2){ api.box(x0,PY,z,x0+0.3,PY+1.5,z+1.6,WHITE); api.box(x1-0.3,PY,z,x1,PY+1.5,z+1.6,WHITE); } };
    soreg(-62,-56,148,56);
    api.box(-50,PY,-44,138,PY+3,44,STONE);                                            /* the terrace (ḥel) */
    for(let s=0;s<6;s++) api.box(138+s*0.5,PY+s*0.5-0.5,-12,138.5+s*0.5,PY+3-s*0.5,12,STONE);
    const T=PY+3;                                                                     /* the court of the women's floor */
    /* THE COURT OF THE WOMEN: 70.9 m square, its walls 12 m, a chamber at each corner, the gate east */
    const W0=62, W1=133, WZ=35.45;
    for(const [x0,z0,x1,z1] of [[W0,-WZ,W1,-WZ+1.5],[W0,WZ-1.5,W1,WZ],[W1-1.5,-WZ,W1,-6],[W1-1.5,6,W1,WZ]]) api.box(x0,T,z0,x1,T+12,z1,WHITE);
    for(const [cx,cz] of [[W0+10,-WZ+10],[W0+10,WZ-10],[W1-10,-WZ+10],[W1-10,WZ-10]]){
      api.box(cx-10,T,cz-10,cx+10,T+5,cz-9.4,LIME); api.box(cx-10,T,cz+9.4,cx+10,T+5,cz+10,LIME);
      api.box(cx-10,T,cz-10,cx-9.4,T+5,cz+10,LIME); api.box(cx+9.4,T,cz-10,cx+10,T+5,cz+10,LIME); }
    api.box(W1-2,T,-11,W1+3,T+20,-6,WHITE); api.box(W1-2,T,6,W1+3,T+20,11,WHITE);    /* the Beautiful gate (Acts 3:2) */
    api.box(W1-2,T+14,-6,W1+3,T+20,6,GOLD);
    /* THE NICANOR GATE and its fifteen steps up to the court of Yisra'ĕl */
    const C=T+4.5;
    for(let s=0;s<15;s++) api.box(W0-0.3*s,T+s*0.3,-9,W0+6-0.3*s,T+(s+1)*0.3,9,WHITE);
    api.box(W0-3,T,-15,W0+3,C+21,-9,WHITE); api.box(W0-3,T,9,W0+3,C+21,15,WHITE); api.box(W0-3,C+15,-9,W0+3,C+21,9,GOLD);
    /* THE INNER COURT: 98.2 by 70.9 m, raised over the women's court, its walls 20 m and three gates
       on either side */
    const I0=-41.7, I1=W0-1;
    api.box(I0,T,-WZ,I1,C,WZ,STONE);
    for(const z0 of [-WZ,WZ-2]) for(let x=I0;x<I1;x+=4){ if([-12,13,38].some(g=>Math.abs(x+2-g)<3)) continue; api.box(x,C,z0,x+4,C+20,z0+2,WHITE); }
    api.box(I0,C,-WZ,I0+2,C+20,WZ,WHITE);
    /* THE HOUSE: on its own platform six cubits over the court; its porch 100 cubits wide and high
       to the east, its body 70 wide behind; the holy place 40 cubits long, the most set apart place
       20, a veil between; gold along its crown */
    const H0=C+3.15, HX0=-30, HXP=12, HX1=22.5;
    api.box(HX0-3,C,-27,HX1+1,H0,27,WHITE);
    for(let s=0;s<12;s++) api.box(HX1+1+s*0.5,C,-10,HX1+1.5+s*0.5,H0-s*0.26,10,WHITE);
    api.box(HX0,H0,-18.4,HXP,H0+52.5,18.4,WHITE);                                       /* the body */
    api.box(HXP,H0,-26.25,HX1,H0+52.5,26.25,WHITE);                                     /* the porch */
    api.box(HX0,H0+52.5,-18.4,HXP,H0+53.5,18.4,GOLD); api.box(HXP,H0+52.5,-26.25,HX1,H0+53.5,26.25,GOLD);
    api.box(HXP+1.5,H0,-10,HX1-1.5,H0+40,10,'air');                                     /* within the porch */
    api.box(HX1-1.5,H0,-5.25,HX1+0.1,H0+21,5.25,'air');                                 /* its open front, 20 by 40 cubits */
    api.box(HX1-0.2,H0+21,-6,HX1+0.2,H0+23,6,GOLD);                                     /* the golden vine over it */
    api.box(HXP-1,H0,-2.6,HXP+1.6,H0+10.5,2.6,'air');                                   /* the door of the holy place */
    api.box(HXP+1.4,H0,-2.6,HXP+1.6,H0+10.5,2.6,GOLD);                                  /* its leaves of gold */
    api.box(HX0+10.5,H0,-5.25,HXP-1,H0+21,5.25,'air');                                  /* the holy place, 40 cubits */
    api.box(HX0+0.5,H0,-5.25,HX0+10.5,H0+21,5.25,'air');                                /* the most set apart place, 20 */
    api.box(HX0+10.3,H0,-5.25,HX0+10.6,H0+21,5.25,BLUE);                                /* the veil */
    api.box(HX0+10.5,H0,-5.25,HXP-1,H0+0.05,5.25,0x8a7a5a);                            /* its floor */
    const ia=HX0+12.6;
    api.box(ia-0.5,H0,-0.5,ia+0.5,H0+1,0.5,GOLD);                                       /* the altar of incense */
    api.box(ia+5,H0,3.5,ia+5.24,H0+1.6,3.74,GOLD); api.box(ia+5,H0+1.5,2.8,ia+5.24,H0+1.7,4.4,GOLD);   /* the lampstand, south */
    api.box(ia+4.5,H0,-4.2,ia+5.5,H0+0.9,-3,GOLD);                                      /* the table, north */
    api.mark('holyPlace',HX0+21,1); api.mark('incense',ia+1.2,0); api.mark('incenseAltar',ia,0);
    api.mark('lampstand',ia+5.1,3.6); api.mark('porchFront',HX1+3,0);
    /* THE ALTAR, 32 cubits square and 15 high, its ramp from the south; the laver between it and
       the porch; the place of slaughter to the north of it */
    const AX0=HX1+8, AX1=AX0+16.8;
    api.box(AX0,C,-6.4,AX1,C+7.9,10.4,0xa99c84);
    for(let s=0;s<16;s++) api.box(AX0+4,C,10.4+s*1.2,AX1-4,C+7.9-s*0.49,11.6+s*1.2,0xa99c84);
    api.box(HX1+3,C,-14,HX1+5,C+1.6,-12,BRONZE);
    for(let k=0;k<6;k++) api.box(AX0+k*2.6,C,-22,AX0+k*2.6+1,C+1.2,-21,STONE2);
    api.mark('altarFront',AX1+6,0); api.mark('hekal',HX0+20,0); api.mark('hekalView',W0+20,0);
    /* the corner over the Qidron, the highest of the courts (Mattithyahu 4:5) */
    api.mark('pinnacle',xe(S)-6,S-6); api.mark('pinnacleY',PY+31.2,0);
    /* THE FORTRESS AT THE CORNER (the Antonia): four towers over the north-west of the courts */
    const A={x0:-150,x1:-35,z0:-307,z1:-267};
    api.pad(A.x0,A.z0,A.x1,A.z1,{y:PY,fill:'hewn-stone',top:'cobble',blend:0});
    api.box(A.x0,PY,A.z0,A.x1,PY+20,A.z0+2,LIME); api.box(A.x0,PY,A.z1-2,A.x1,PY+20,A.z1,LIME);
    api.box(A.x0,PY,A.z0,A.x0+2,PY+20,A.z1,LIME); api.box(A.x1-2,PY,A.z0,A.x1,PY+20,A.z1,LIME);
    for(const [tx,tz,h] of [[A.x0,A.z0,32],[A.x1,A.z0,32],[A.x0,A.z1,32],[A.x1,A.z1,42]]) api.box(tx-6,PY,tz-6,tx+6,PY+h,tz+6,LIME);
    api.mark('antonia',(A.x0+A.x1)/2,(A.z0+A.z1)/2);
    /* THE POOL OF BĔYTH ḤESDA, north of the courts: two pools and a porch between and about them
       (Yahuchanon 5:2) */
    const BX=10, BZ=-345;
    const BY=gY(BX,BZ)-0.6;
    api.water(BX-40,BZ-22,BX-2,BZ+22,{depth:4,bed:'stone',y:BY}); api.water(BX+2,BZ-22,BX+44,BZ+22,{depth:4,bed:'stone',y:BY});
    columns(BX,BZ-22,BX,BZ+22,gY(BX,BZ),6,4); columns(BX-42,BZ-24,BX+46,BZ-24,gY(BX,BZ),6,4); columns(BX-42,BZ+24,BX+46,BZ+24,gY(BX,BZ),6,4);
    api.mark('bethesda',BX,BZ+28);
  } else {
    /* SHELOMOH'S HOUSE on the threshing floor of Arawnah: the great court a square of 500 cubits,
       the inner court of three courses of hewn stone and a course of cedar (1 Kings 6:36) */
    const G0x=-120, G1x=142.5, G0z=-150, G1z=112.5;
    api.pad(G0x,G0z,G1x,G1z,{y:PY,fill:'hewn-stone',top:'cobble',blend:0});
    if(ruin){
      api.box(-20,PY,-30,60,PY+1.2,30,STONE2);
      api.box(40,PY+1.2,-2,44,PY+2.6,2,0xa99c84);                                       /* the altar built again (Ezra 3:2-3) */
      const fo=(x0,z0,x1,z1)=>api.box(x0,PY+1.2,z0,x1,PY+2.1,z1,LIME);
      fo(-10,-13.5,31.5,-12.7); fo(-10,12.7,31.5,13.5); fo(-10,-13.5,-9.2,13.5); fo(30.7,-13.5,31.5,13.5);
      for(let k=0;k<9;k++){ const x=-20+hash(k,3)*50, z=18+hash(k,5)*10; api.box(x-0.7,PY+1.2,z-0.5,x+0.7,PY+1.9,z+0.5,LIME); }
      api.mark('foundation',10,0); api.mark('altarFront',50,0); api.mark('pinnacle',20,0); api.mark('pinnacleY',PY+2,0);
    } else {
      for(const [x0,z0,x1,z1] of [[G0x,G0z,G1x,G0z+1.5],[G0x,G1z-1.5,G1x,G1z],[G0x,G0z,G0x+1.5,G1z],[G1x-1.5,G0z,G1x,-8],[G1x-1.5,8,G1x,G1z]]){
        api.box(x0,PY,z0,x1,PY+6,z1,LIME); }
      const IC0=-25, IC1=75, IZ=35;
      for(const [x0,z0,x1,z1] of [[IC0,-IZ,IC1,-IZ+1],[IC0,IZ-1,IC1,IZ],[IC0,-IZ,IC0+1,IZ],[IC1-1,-IZ,IC1,-5],[IC1-1,5,IC1,IZ]]){
        api.box(x0,PY,z0,x1,PY+2.4,z1,STONE); api.box(x0,PY+2.4,z0,x1,PY+3.2,z1,CEDAR); }
      const C=PY+1.2; api.box(IC0+1,PY,-IZ+1,IC1-1,C,IZ-1,LIME);                         /* the inner court, raised */
      /* the house: within 60 × 20 cubits and 30 high; the side chambers three storeys about it */
      api.box(-10,C,-13.5,31.5,C+9.5,13.5,STONE);                                       /* the side chambers */
      api.box(-5.25,C,-5.25-1.6,26.25,C+15.75+1.6,5.25+1.6,LIME);                       /* the house's own walls */
      api.box(-5.25,C+15.75+1.6,-7,26.25,C+15.75+2.4,7,CEDAR);
      api.box(26.25,C,-6.6,31.5,C+15.75,6.6,LIME);                                      /* the porch, 20 wide and 10 deep */
      api.box(26.25,C+15.75,-6.6,31.5,C+16.4,6.6,GOLD);
      api.box(27,C,-4,31.6,C+12,4,'air');
      api.box(25.8,C,-1.4,26.6,C+6,1.4,'air');                                          /* the doors into the house */
      api.box(5.25,C,-5.25,25.8,C+15.75,5.25,'air');                                    /* the holy place, 40 cubits */
      api.box(-5.25+0.5,C,-5.25,5.25,C+10.5,5.25,'air');                                /* the inner room, a cube of 20 */
      api.box(5.1,C,-5.25,5.4,C+10.5,5.25,BLUE);                                        /* the veil (2 Diḇre haYamim 3:14) */
      api.box(5.25,C,-5.25,25.8,C+0.05,5.25,0x8a7a5a);
      const ia=8;
      api.box(ia-0.5,C,-0.5,ia+0.5,C+1,0.5,GOLD); api.box(ia+6,C,3.5,ia+6.24,C+1.6,3.74,GOLD);
      api.box(ia+6,C+1.5,2.8,ia+6.24,C+1.7,4.4,GOLD); api.box(ia+5.5,C,-4.2,ia+6.5,C+0.9,-3,GOLD);
      api.mark('holyPlace',15,1); api.mark('incense',ia+1.2,0); api.mark('incenseAltar',ia,0);
      api.mark('lampstand',ia+6.1,3.6); api.mark('porchFront',34,0);
      /* Yakin and Boaz before the porch: eighteen cubits and a capital of five */
      for(const z of [-4.2,4.2]){ api.box(32.5,C,z-1,34.5,C+9.45,z+1,BRONZE); api.box(32.2,C+9.45,z-1.3,34.8,C+12.1,z+1.3,BRONZE); }
      /* the bronze altar, 20 × 20 × 10 cubits; the sea on its twelve oxen to the south-east */
      api.box(42,C,-5.25,52.5,C+5.25,5.25,BRONZE);
      for(let s=0;s<8;s++) api.box(44,C,5.25+s*1.2,50.5,C+5.25-s*0.66,6.45+s*1.2,BRONZE);
      api.box(30,C,16,35.25,C+1.5,21.25,BRONZE); api.box(29.6,C+1.5,15.6,35.65,C+4.1,21.65,BRONZE);
      api.mark('altarFront',58,0); api.mark('hekal',12,0); api.mark('hekalView',62,0);
      api.mark('pinnacle',29,0); api.mark('pinnacleY',C+16.4,0);
      /* the house of the king and the house of the forest of Leḇanon, south of the courts on the
         Ophel: 100 × 50 × 30 cubits on forty-five pillars of cedar (1 Kings 7:2) */
      api.pad(-30,130,40,190,{y:PY-8,fill:'hewn-stone',top:'cobble',blend:6});
      api.box(-22,PY-8,140,30.5,PY-8+15.75,166.25,LIME); api.box(-21,PY-8,141,29.5,PY-8+15,165.25,'air');
      for(let r=0;r<3;r++) for(let k=0;k<15;k++){ const x=-19+k*3.3, z=146+r*6.5; api.box(x-0.4,PY-8,z-0.4,x+0.4,PY-8+15,z+0.4,CEDAR); }
      api.mark('palace',4,172);
    }
  }

  /* ================= THE CITY ABOUT IT ================= */
  let houses=0;
  if(herod){
    /* the lower city on the ridge of the city of Dawiḏ, south to the pool of Shiloaḥ */
    houses+=quarter(-50,250,110,780,22,(x,z)=>!(Math.abs(x-28)<4)&&!(Math.abs(z-500)<4));
    /* the Tyropoeon, the valley between the hills */
    houses+=quarter(-215,-30,-150,620,24);
    /* the upper city on the western hill, about the palace of Herodes */
    houses+=quarter(-620,20,-230,700,30,(x,z)=>!(x<-600&&z<420));
    /* the new quarter within the second wall, north-west of the courts */
    houses+=quarter(-420,-260,-170,-30,30);
    /* THE PALACE OF HERODES and its three towers, Phasael, Hippicus and Mariamne */
    api.pad(-790,100,-650,420,{y:gY(-720,260)+4,fill:'hewn-stone',top:'cobble',blend:6});
    const PYp=gY(-720,260)+4;
    api.box(-790,PYp,100,-650,PYp+14,102,LIME); api.box(-790,PYp,418,-650,PYp+14,420,LIME);
    api.box(-790,PYp,100,-788,PYp+14,420,LIME); api.box(-652,PYp,100,-650,PYp+14,420,LIME);
    api.box(-760,PYp,160,-680,PYp+12,230,WHITE); api.box(-760,PYp,300,-680,PYp+12,370,WHITE);
    tower(-690,72,20,20,45); tower(-745,78,14,14,40); tower(-718,95,11,11,26);
    api.mark('palaceHerodes',-720,260);
    /* the first wall, the west and south walls about Tsiyon to Shiloaḥ, the east wall along the ridge */
    wallLine([[-790,62],[-560,45],[-360,10],[-140,-30]],{gates:[[-520,42,6]]});
    wallLine([[-795,62],[-800,420],[-790,640],[-700,770],[-450,830],[-160,850],[-30,835]],{gates:[[-430,832,6]]});
    wallLine([[-30,835],[90,760],[140,520],[156,226]],{gates:[[30,820,5]]});
    /* the second wall, about the new quarter, from the Gennath gate to the fortress */
    wallLine([[-520,45],[-470,-80],[-440,-250],[-150,-306]],{gates:[[-462,-120,6]]});
    /* the pool of Shiloaḥ at the foot of the ridge (Yahuchanon 9:7) */
    const sx=-20, sz=800;
    api.water(sx-25,sz-12,sx+25,sz+12,{depth:3,bed:'stone',y:gY(sx,sz)-0.6});
    for(let s=0;s<5;s++) api.box(sx-27,gY(sx,sz)-s*0.4,sz-14-s,sx+27,gY(sx,sz)-s*0.4+0.4,sz-13-s,STONE);
    api.mark('siloam',sx,sz-20);
    /* the street up from the lower city to the courts, and the market square on it */
    for(let z=230;z<780;z+=3) api.top(26,z,30,z+3,PATH);
    api.top(-10,480,60,520,PATH); api.mark('square',25,500); api.mark('street',28,420);
    /* the gate out to the south, by the pool: the Dung gate's way to the valley */
    api.mark('gateIn',30,800); api.mark('gateOut',30,846);
  } else {
    /* the city of Dawiḏ on its ridge, and the western hill Ḥizqiyahu walled in */
    houses+=quarter(-40,240,100,790,22,(x,z)=>!(Math.abs(x-28)<4)&&!(Math.abs(z-500)<4));
    houses+=quarter(-210,0,-150,600,24);
    houses+=quarter(-560,60,-230,700,30);
    /* the walls of Ḥizqiyahu: the broad wall across the north-west (Neḥemyah 3:8), seven metres
       thick, about the western hill, down to the pool and up the eastern ridge */
    wallLine([[-150,-40],[-450,-10],[-600,120]],{t:7,gates:[[-300,-25,6]]});
    wallLine([[-600,120],[-620,420],[-560,680],[-330,820],[-30,835]],{gates:[[-330,820,6]]});
    wallLine([[-30,835],[90,760],[140,520],[150,120]],{gates:[[30,820,5]]});
    for(let z=230;z<780;z+=3) api.top(26,z,30,z+3,PATH);
    api.top(-10,480,60,520,PATH); api.mark('square',25,500); api.mark('street',28,420);
    api.mark('gateIn',-300,-15); api.mark('gateOut',-300,-50);
    /* OUTSIDE THE GATE: the highway of the Launderer's Field and the upper pool (Yashayahu 7:3) */
    const px=-360, pz=-150, pw=26, pd=16;
    api.water(px-pw/2,pz-pd/2,px+pw/2,pz+pd/2,{depth:2,bed:'stone',y:gY(px,pz)-0.6});
    api.mark('pool',px+10,pz+2); api.mark('poolEnd',px+9.5,pz-6.5); api.mark('ahaz',px+4,pz-8); api.mark('field',px+30,pz+14);
    for(let k=0;k<30;k++) api.top(-300-k*2,-50-k*1.6,-297-k*2,-47-k*1.6,PATH);
  }
  /* THE HOUSE OF THE TAUGHT ONES (Yashayahu 8:16), in the lower city by the square */
  { const tx=60, tz=470, ty=gY(60,470);
    api.box(tx-6,ty,tz-5,tx+6,ty+2.6,tz-4.4,WHITE); api.box(tx-6,ty,tz-5,tx-5.4,ty+2.6,tz+5,WHITE); api.box(tx+5.4,ty,tz-5,tx+6,ty+2.6,tz+5,WHITE);
    api.box(tx-6,ty,tz+4.4,tx-1.2,ty+2.6,tz+5,WHITE); api.box(tx+1.2,ty,tz+4.4,tx+6,ty+2.6,tz+5,WHITE);
    api.box(tx-0.9,ty,tz-3.5,tx+0.9,ty+0.8,tz-2.5,TIMBER); api.box(tx-4.8,ty,tz-4.4,tx-3.2,ty+1.8,tz-3.6,TIMBER);
    api.mark('studyDesk',tx,tz-1.8); api.mark('studyDoor',tx,tz+6.5); api.mark('studyIn',tx+2,tz); api.mark('studyShelf',tx-4,tz-2.8); }
  /* olives on the slopes of the Mount of Olives, across the Qidron, and Gat Shemanim at its foot */
  for(let k=0;k<160;k++){ const ox=330+hash(k,3)*520, oz=-420+hash(k,9)*620, y=gY(ox,oz);
    api.box(ox-0.4,y,oz-0.4,ox+0.4,y+2.4,oz+0.4,0x5d4a36); api.box(ox-2,y+2,oz-2,ox+2,y+4,oz+2,0x6d7a4a); }
  api.mark('gethsemane',416,-155); api.mark('olivesTop',833,-44);
  api.mark('westQuarter',-400,300);
  api.mark('golgothaTrue',-548,-33);
  api.houses=houses;
};
})();
