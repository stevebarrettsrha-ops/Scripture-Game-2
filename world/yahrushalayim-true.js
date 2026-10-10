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
  const LIME=0xd8cfb8, STONE=0x9c9486, STONE2=0x7a7266, PATH=0xb49a74, TIMBER=0x6e5238, GOLD='gold-leaf',
        WHITE='marble', BRONZE='bronze', CEDAR=0x7a4a2a, BLUE='veil';
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
    /* ================= THE HOUSE AND ITS COURTS, BY THE MEASURES OF MIDDOT =================
       Laid out as the tractate Middot gives them (and the reconstructions drawn from it), in cubits
       of 0.525 m, everything facing EAST, to the rising sun:
         from east to west the court of the women (135 cubits square), the gate of Nicanor and its
         fifteen steps, the court of Yisra'ĕl (11), the court of the priests (11), the altar (32), the
         space between the altar and the porch (22), the House (100), and behind it (11): 187 in all
         from the gate of Nicanor to the west wall; 135 from north to south.
       Outside the walls the terrace (ḥel, 10 cubits) and its twelve steps, and below it the barrier
       (soreg) beyond which no man of the nations went. */
    const c=0.525, cu=n=>n*c;
    const Xn=62;                                         /* the gate of Nicanor: the west wall of the women's court */
    const WZ=cu(67.5);                                   /* half of 135 cubits, north to south */
    const Xw=Xn+cu(5);                                   /* the women's court, east of the wall of Nicanor (the 187 are measured within the walls) */
    const WE=Xw+cu(135);                                 /* the east wall of the women's court */
    const XI=Xn-cu(11), XP=XI-cu(11);                    /* the court of Yisra'ĕl, then of the priests */
    const AX1=XP, AX0=AX1-cu(32);                        /* the altar */
    const HX1=AX0-cu(22), HX0=HX1-cu(100);               /* the House, its porch front at HX1 */
    const XW=HX0-cu(11);                                 /* the west wall of the inner court */
    const WT=cu(5);                                      /* the walls' thickness */
    const T=PY+cu(6);                                    /* the terrace and the court of the women: twelve steps of half a cubit */
    const C=T+cu(7.5);                                   /* the court of Yisra'ĕl: fifteen steps of half a cubit */
    const Cp=C+cu(2.5);                                  /* the court of the priests: two and a half cubits higher */
    const H0=Cp+cu(6);                                   /* the floor of the House: six cubits more, twelve steps */
    /* ---- THE BARRIER (soreg) and THE TERRACE (ḥel) ---- */
    const K0=XW-WT-cu(10), K1=WE+WT+cu(10), KZ=WZ+WT+cu(10);
    const soreg=(x0,z0,x1,z1)=>{ for(let x=x0;x<x1;x+=2){ if(hash(x,1)<0.06) continue; api.box(x,PY,z0,x+1.6,PY+1,z0+0.3,WHITE); api.box(x,PY,z1-0.3,x+1.6,PY+1,z1,WHITE); }
      for(let z=z0;z<z1;z+=2){ api.box(x0,PY,z,x0+0.3,PY+1,z+1.6,WHITE); api.box(x1-0.3,PY,z,x1,PY+1,z+1.6,WHITE); } };
    soreg(K0-cu(14),-KZ-cu(14),K1+cu(14),KZ+cu(14));
    api.box(K0,PY,-KZ,K1,T,KZ,STONE);                                                  /* the terrace */
    const steps12=(x0,z0,x1,z1,dir)=>{ for(let s=0;s<12;s++){ const o=cu(1)*s, y=T-cu(0.5)*(s+1);   /* down and out from the terrace's edge */
        if(dir==='e') api.box(x1+o,PY,z0,x1+o+cu(1),y+cu(0.5),z1,STONE); else if(dir==='n') api.box(x0,PY,z0-o-cu(1),x1,y+cu(0.5),z0-o,STONE); else api.box(x0,PY,z1+o,x1,y+cu(0.5),z1+o+cu(1),STONE); } };
    steps12(0,-cu(10),K1,cu(10),'e');
    for(const gx of [Xw+cu(67.5), XW+cu(30), XW+cu(85), XW+cu(140)]){ steps12(gx-cu(8),-KZ,gx+cu(8),KZ,'n'); steps12(gx-cu(8),-KZ,gx+cu(8),KZ,'s'); }
    /* a gate through a wall running north-south (the west and east walls) or east-west (north and south) */
    function gateNS(x,z0,z1,y,h,col){ api.box(x-WT/2-0.2,y,z0,x+WT/2+0.2,y+h,z1,'air'); }
    function gateEW(x0,x1,z,y,h){ api.box(x0,y,z-WT/2-0.2,x1,y+h,z+WT/2+0.2,'air'); }
    function towerAt(x,z,w,d,y0,y1){ api.box(x-w/2,y0,z-d/2,x+w/2,y1,z+d/2,WHITE); api.box(x-w/2,y1,z-d/2,x+w/2,y1+0.9,z+d/2,GOLD); }

    /* ================= THE COURT OF THE WOMEN (135 × 135 cubits) ================= */
    const WH=T+cu(30);                                                               /* its walls */
    api.box(Xw,T-0.5,-WZ,WE,T,WZ,LIME);                                              /* its pavement */
    api.box(Xn,T,-WZ-WT,WE+WT,WH,-WZ,WHITE); api.box(Xn,T,WZ,WE+WT,WH,WZ+WT,WHITE);  /* north and south walls */
    api.box(WE,T,-WZ-WT,WE+WT,WH,WZ+WT,WHITE);                                       /* the east wall */
    /* the gates: the eastern (the gate called Beautiful, Ma'asei 3:2), and one north and one south */
    gateNS(WE+WT/2,-cu(5),cu(5),T,cu(20)); gateEW(Xw+cu(62.5),Xw+cu(72.5),-WZ-WT/2,T,cu(20)); gateEW(Xw+cu(62.5),Xw+cu(72.5),WZ+WT/2,T,cu(20));
    api.box(WE+WT,T,-cu(5)-0.4,WE+WT+0.5,T+cu(20),-cu(5),BRONZE); api.box(WE+WT,T,cu(5),WE+WT+0.5,T+cu(20),cu(5)+0.4,BRONZE);   /* its bronze leaves, open */
    api.box(WE-0.3,T+cu(20),-cu(6),WE+WT+0.3,T+cu(21),cu(6),GOLD);
    towerAt(WE+WT+cu(4),-cu(12),cu(8),cu(8),T,WH+cu(8)); towerAt(WE+WT+cu(4),cu(12),cu(8),cu(8),T,WH+cu(8));   /* the gate's towers */
    towerAt(WE+WT/2,-WZ-WT/2,cu(14),cu(14),T,WH+cu(10)); towerAt(WE+WT/2,WZ+WT/2,cu(14),cu(14),T,WH+cu(10));   /* its corners */
    /* THE FOUR CHAMBERS at its corners, forty cubits square and open to the sky (Middot 2:5): the
       lepers' to the north-west, the wood's to the north-east, the oil's and wine's to the south-west,
       the Nazirites' to the south-east */
    const ch40=(x0,z0,doorDir)=>{ const x1=x0+cu(40), z1=z0+cu(40), h=T+cu(12);
      api.box(x0,T,z0,x1,h,z0+1,LIME); api.box(x0,T,z1-1,x1,h,z1,LIME); api.box(x0,T,z0,x0+1,h,z1,LIME); api.box(x1-1,T,z0,x1,h,z1,LIME);
      const mx=(x0+x1)/2, mz=(z0+z1)/2;
      if(doorDir==='s') api.box(mx-1.5,T,z1-1.2,mx+1.5,T+3.2,z1+0.2,'air'); else api.box(mx-1.5,T,z0-0.2,mx+1.5,T+3.2,z0+1.2,'air');
      return [mx,mz]; };
    const lep=ch40(Xw,-WZ,'s'), wood=ch40(WE-cu(40),-WZ,'s'), oil=ch40(Xw,WZ-cu(40),'n'), naz=ch40(WE-cu(40),WZ-cu(40),'n');
    api.mark('chamberLepers',lep[0],lep[1]); api.mark('chamberWood',wood[0],wood[1]); api.mark('chamberOil',oil[0],oil[1]); api.mark('chamberNazirites',naz[0],naz[1]);
    /* THE GALLERY about it, from which the women looked on (Middot 2:5), on columns, between the
       corner chambers; and under it the thirteen chests of the treasury (Mark 12:41) */
    const GY=T+cu(14), gd=cu(10);
    for(const zs of [-1,1]){ const zw=zs*WZ, zc=zw-zs*gd;
      columns(Xw+cu(41),zc,WE-cu(41),zc,T,cu(14),cu(8));
      api.box(Xw+cu(40),GY,Math.min(zw,zc),WE-cu(40),GY+cu(1.5),Math.max(zw,zc),CEDAR); }
    for(const xs of [Xw,WE]){ const xc=xs===Xw?xs+gd:xs-gd;
      for(const [z0,z1] of [[-WZ+cu(41),-cu(8)],[cu(8),WZ-cu(41)]]){ columns(xc,z0,xc,z1,T,cu(14),cu(8));
        api.box(Math.min(xs,xc),GY,z0,Math.max(xs,xc),GY+cu(1.5),z1,CEDAR); } }
    for(let k=0;k<13;k++){ const zs=k<7?-1:1, i=k<7?k:k-7, x=Xw+cu(48)+i*cu(7);
      api.box(x,T,zs*(WZ-gd-cu(2)),x+cu(2),T+cu(2),zs*(WZ-gd-cu(4)),BRONZE); }
    /* THE FOUR LAMPSTANDS OF GOLD, fifty cubits high, with four bowls of gold on each (Sukkah 5:2),
       which lit the city at the feast */
    for(const [lx,lz] of [[Xw+cu(52),-cu(22)],[Xw+cu(52),cu(22)],[WE-cu(52),-cu(22)],[WE-cu(52),cu(22)]]){
      api.box(lx-0.5,T,lz-0.5,lx+0.5,T+cu(50),lz+0.5,GOLD); api.box(lx-1.5,T+cu(50),lz-1.5,lx+1.5,T+cu(50)+1,lz+1.5,GOLD); }

    /* ================= THE GATE OF NICANOR, AND THE FIFTEEN STEPS ================= */
    api.box(Xn,T,-WZ-WT,Xw,C+cu(30),WZ+WT,WHITE);                                 /* the wall between the courts */
    for(let s=0;s<15;s++){ const r=cu(15)-s*cu(0.6);                                  /* the steps, rounded */
      api.box(Xw,T,-r,Xw+r*0.62,T+cu(0.5)*(s+1),r,WHITE); }
    gateNS(Xn+WT/2,-cu(5),cu(5),C,cu(20));
    api.box(Xn-0.1,C,-cu(5)-0.6,Xw+0.1,C+cu(20),-cu(5),BRONZE); api.box(Xn-0.1,C,cu(5),Xw+0.1,C+cu(20),cu(5)+0.6,BRONZE);   /* its doors of bronze, open */
    towerAt(Xn+WT/2,-cu(14),cu(12),cu(12),T,C+cu(40)); towerAt(Xn+WT/2,cu(14),cu(12),cu(12),T,C+cu(40));
    api.box(Xn-0.4,C+cu(20),-cu(8),Xw+0.4,C+cu(22),cu(8),GOLD);
    api.mark('nicanor',Xw+cu(10),0); api.mark('courtWomen',(Xw+WE)/2,0); api.mark('beautifulGate',WE+WT+cu(6),0);

    /* ================= THE INNER COURT (187 × 135 cubits) ================= */
    const IH=C+cu(30);
    api.box(XW,T,-WZ,Xn,C,WZ,STONE);                                                 /* raised over the women's court */
    api.box(XW,C,-WZ,XP,Cp,WZ,STONE);                                                /* and the court of the priests over that of Yisra'ĕl */
    for(let s=0;s<3;s++) api.box(XP,C,-WZ+cu(10),XP+cu(1)*(3-s),C+cu(0.8)*(s+1),WZ-cu(10),WHITE);   /* the platform (dukhan) where the Lewites sang */
    for(let z=-WZ+cu(10);z<WZ-cu(10);z+=2){ if(Math.abs(z)<cu(6)) continue; api.box(XP-0.3,Cp,z,XP,Cp+cu(1),z+1.4,WHITE); }   /* the low rail between the courts */
    api.box(XW-WT,T,-WZ-WT,Xn,IH,-WZ,WHITE); api.box(XW-WT,T,WZ,Xn,IH,WZ+WT,WHITE);   /* north and south walls */
    api.box(XW-WT,T,-WZ-WT,XW,IH,WZ+WT,WHITE);                                       /* the west wall: no gate */
    /* its gates, three to the north and three to the south (Middot 1:4): on the south the gate of
       kindling, the gate of the firstlings, the water gate; on the north the gate of the spark, the
       gate of the offering, and the house of the hearth */
    const GX=[[cu(30),'Kindling','Hearth'],[cu(85),'Firstlings','Offering'],[cu(140),'Water','Spark']];
    for(const [dx,sN,nN] of GX){ const gx=XW+dx;
      for(const zs of [-1,1]){ const zw=zs*(WZ+WT/2);
        gateEW(gx-cu(5),gx+cu(5),zw,Cp,cu(20));
        for(let s=0;s<20;s++){ const z=zs*(WZ+WT)+zs*s*0.26; api.box(gx-cu(5),T,Math.min(z,z+zs*0.26),gx+cu(5),Cp-s*(Cp-T)/20,Math.max(z,z+zs*0.26),STONE); }   /* down to the terrace */
        towerAt(gx-cu(10),zw+zs*cu(3),cu(9),cu(14),T,IH+cu(8)); towerAt(gx+cu(10),zw+zs*cu(3),cu(9),cu(14),T,IH+cu(8));
        api.box(gx-cu(6),Cp+cu(20),zw-WT/2-0.4,gx+cu(6),Cp+cu(21.5),zw+WT/2+0.4,GOLD); }
      api.mark('gate'+sN,gx,WZ+cu(8)); api.mark('gate'+nN,gx,-WZ-cu(8)); }
    for(const [tx,tz] of [[XW-WT/2,-WZ-WT/2],[XW-WT/2,WZ+WT/2],[Xn+WT/2,-WZ-WT/2],[Xn+WT/2,WZ+WT/2]]) towerAt(tx,tz,cu(14),cu(14),T,IH+cu(12));
    /* the chambers along its walls, between the gates (the chamber of hewn stone, where the great
       council sat, half within the court on the south; the chambers of salt, of the hides, of the
       rinsers; the house of the hearth on the north-west) */
    const room=(x0,x1,zs,name)=>{ const zw=zs*WZ, zi=zw-zs*cu(14);
      api.box(x0,Cp,Math.min(zw,zi),x1,Cp+cu(16),Math.max(zw,zi),LIME);
      api.box(x0+1,Cp,Math.min(zw,zi)+(zs<0?1:1),x1-1,Cp+cu(14),Math.max(zw,zi)-1,'air');
      api.box((x0+x1)/2-1,Cp,zi-0.6,(x0+x1)/2+1,Cp+cu(6),zi+0.6,'air');
      api.box(x0,Cp+cu(16),Math.min(zw,zi),x1,Cp+cu(16.6),Math.max(zw,zi),CEDAR);
      api.mark(name,(x0+x1)/2,zi-zs*cu(3)); };
    /* (Middot 5:3-4: on the north the chambers of salt, of the hides, of the rinsers; on the south of the
       wood, of the well of the exiles, and of hewn stone; and the house of the hearth by its gate) */
    room(XW+cu(40),XW+cu(75),-1,'chamberSalt'); room(XW+cu(95),XW+cu(130),-1,'chamberHides'); room(XW+cu(150),Xn-cu(1),-1,'chamberRinsers');
    room(XW+cu(40),XW+cu(75),1,'chamberWoodInner'); room(XW+cu(95),XW+cu(130),1,'chamberGolah'); room(XW+cu(150),Xn-cu(1),1,'chamberHewnStone');
    room(XW+cu(1),XW+cu(15),-1,'houseOfHearth');

    /* ================= THE ALTAR (Middot 3:1) =================
       Thirty-two cubits square at its foot, a cubit high; set in a cubit and up five; in a cubit and
       up three; the horns a cubit at the corners; its ramp thirty-two cubits long and sixteen wide on
       the south; and about it, half way up, the line of red */
    const AZ0=-cu(16)+cu(4), AZ1=AZ0+cu(32), AY=Cp;
    const ALT='plaster';                                 /* of whole stones, untouched by iron, and whitewashed twice a year (Middot 3:4) */
    api.box(AX0,AY,AZ0,AX1,AY+cu(1),AZ1,ALT);
    api.box(AX0+c,AY+cu(1),AZ0+c,AX1-c,AY+cu(6),AZ1-c,ALT);
    api.box(AX0+c*0.6,AY+cu(3.2),AZ0+c*0.6,AX1-c*0.6,AY+cu(3.8),AZ1-c*0.6,'brick');            /* the line of red */
    api.box(AX0+cu(2),AY+cu(6),AZ0+cu(2),AX1-cu(2),AY+cu(9),AZ1-cu(2),ALT);
    for(const [hx,hz] of [[AX0+cu(2),AZ0+cu(2)],[AX1-cu(3),AZ0+cu(2)],[AX0+cu(2),AZ1-cu(3)],[AX1-cu(3),AZ1-cu(3)]]) api.box(hx,AY+cu(9),hz,hx+c*1.8,AY+cu(10),hz+c*1.8,ALT);   /* the horns */
    api.box(AX0+cu(10),AY+cu(9),AZ0+cu(10),AX1-cu(10),AY+cu(9.6),AZ1-cu(10),'brick');          /* the fire on it */
    for(let s=0;s<20;s++){ const z=AZ1+s*cu(32)/20; api.box(AX0+cu(8),AY,z,AX1-cu(8),AY+cu(9)*(1-s/20),z+cu(32)/20,ALT); }   /* the ramp */
    /* THE LAVER, between the porch and the altar and toward the south, of bronze, with its twelve
       spouts (Middot 3:6, Yoma 3:10) */
    const LX=HX1+cu(14), LZ=AZ1+cu(4);
    api.box(LX-cu(2.5),Cp,LZ-cu(2.5),LX+cu(2.5),Cp+cu(4),LZ+cu(2.5),BRONZE); api.box(LX-cu(1.8),Cp+cu(4)-0.6,LZ-cu(1.8),LX+cu(1.8),Cp+cu(4),LZ+cu(1.8),'water');
    api.mark('laver',LX,LZ-cu(5));
    /* THE PLACE OF SLAUGHTER, north of the altar (Middot 3:5, 5:2): the rings in the floor in rows,
       eight tables of marble, and eight short pillars with beams of cedar and hooks of iron on them */
    for(let r=0;r<4;r++) for(let k=0;k<6;k++){ const x=AX0+cu(3)+k*cu(5), z=AZ0-cu(8)-r*cu(4); api.box(x-0.4,Cp,z-0.4,x+0.4,Cp+0.5,z+0.4,BRONZE); }
    for(let k=0;k<8;k++){ const x=AX0+cu(1)+k*cu(4), z=AZ0-cu(28); api.box(x,Cp,z,x+cu(2.5),Cp+cu(2),z+cu(1.5),WHITE); }
    for(let k=0;k<8;k++){ const x=AX0+cu(1)+k*cu(4), z=AZ0-cu(34); api.box(x,Cp,z,x+c*1.8,Cp+cu(4),z+c*1.8,WHITE); }
    for(let k=0;k<4;k++){ const x=AX0+cu(1)+k*cu(8); api.box(x,Cp+cu(4),AZ0-cu(34),x+cu(4)+c*1.8,Cp+cu(4.8),AZ0-cu(34)+c*1.8,CEDAR); }
    api.mark('slaughter',AX0+cu(16),AZ0-cu(20)); api.mark('altarFront',AX1+cu(6),0);

    /* ================= THE HOUSE (Middot 4) =================
       A hundred cubits long, a hundred high, a hundred wide at the porch and seventy behind it, like a
       lion, narrow behind and broad in front; on a plinth of six cubits and twelve steps. From east to
       west: the wall of the porch 5, the porch 11, the wall of the holy place 6, the holy place 40,
       the cubit between the two veils, the most set apart place 20, its wall 6, a cell 6, the cell's
       wall 5. From north to south across the body: wall 5, the winding stair 3, wall 5, a cell 6,
       wall 6, the holy place 20, wall 6, a cell 6, wall 5, the channel for the water 3, wall 5. */
    const HZ=cu(35), PZ=cu(50);
    const xPW=HX1-cu(5), xPI=xPW-cu(11), xHW=xPI-cu(6), xHk=xHW-cu(40), xV1=xHk, xV2=xHk-cu(1), xDb=xV2-cu(20), xDW=xDb-cu(6);
    const xCl=xDW-cu(6);
    api.box(HX0-cu(3),Cp,-PZ-cu(3),HX1+cu(1),H0,PZ+cu(3),WHITE);                       /* the plinth */
    for(let s=0;s<12;s++) api.box(HX1+cu(1)+s*cu(1),Cp,-cu(20),HX1+cu(2)+s*cu(1),H0-cu(0.5)*s,cu(20),WHITE);   /* the twelve steps */
    const HT=H0+cu(100);
    api.box(HX0,H0,-HZ,xPI,HT,HZ,WHITE);                                             /* the body, seventy wide */
    api.box(xPI,H0,-PZ,HX1,HT,PZ,WHITE);                                             /* the porch, a hundred wide */
    /* its face: pilasters with capitals of gold, the whole face banded with gold above, the crown of
       gold and the spikes of gold along the roof that no bird might settle there (Middot 4:6) */
    for(const z of [-cu(44),-cu(26),cu(26),cu(44)]){ api.box(HX1,H0,z-cu(2),HX1+cu(1.6),H0+cu(80),z+cu(2),WHITE); api.box(HX1,H0+cu(80),z-cu(2.5),HX1+cu(2),H0+cu(84),z+cu(2.5),GOLD); }
    api.box(HX1-0.4,H0+cu(84),-PZ,HX1+0.3,H0+cu(96),PZ,GOLD);
    for(const [x0,z0,x1,z1] of [[xPI,-PZ,HX1,-PZ+0.9],[xPI,PZ-0.9,HX1,PZ],[HX0,-HZ,xPI,-HZ+0.9],[HX0,HZ-0.9,xPI,HZ],[HX0,-HZ,HX0+0.9,HZ],[xPI-0.9,-PZ,xPI,-HZ],[xPI-0.9,HZ,xPI,PZ]]){
      api.box(x0,HT-cu(3),z0,x1,HT,z1,GOLD); }
    for(let x=HX0;x<HX1;x+=1.85){ api.box(x,HT,-(x<xPI?HZ:PZ),x+0.9,HT+1,-(x<xPI?HZ:PZ)+0.9,GOLD); api.box(x,HT,(x<xPI?HZ:PZ)-0.9,x+0.9,HT+1,(x<xPI?HZ:PZ),GOLD); }
    for(let z=-PZ;z<PZ;z+=1.85) api.box(HX1-0.9,HT,z,HX1,HT+1,z+0.9,GOLD);
    for(let z=-HZ;z<HZ;z+=1.85) api.box(HX0,HT,z,HX0+0.9,HT+1,z+0.9,GOLD);
    /* THE PORCH (ulam): its open front forty cubits high and twenty wide, with no doors; within, eleven
       deep and the breadth of the house; over its entrance five beams of oak, one over another
       (Middot 3:7) */
    api.box(xPI,H0,-PZ+cu(5),xPW,H0+cu(90),PZ-cu(5),'air');
    api.box(xPW-0.2,H0,-cu(10),HX1+0.2,H0+cu(40),cu(10),'air');
    api.box(HX1-0.3,H0,-cu(11),HX1+0.4,H0+cu(41),-cu(10),GOLD); api.box(HX1-0.3,H0,cu(10),HX1+0.4,H0+cu(41),cu(11),GOLD);   /* the frame of the entrance */
    for(let b=0;b<5;b++) api.box(HX1-0.5,H0+cu(41)+b*cu(1.6),-cu(12)-b*cu(1),HX1+0.5,H0+cu(42)+b*cu(1.6),cu(12)+b*cu(1),CEDAR);
    /* THE ENTRANCE OF THE HOLY PLACE: twenty cubits high and ten wide, its doors of gold folded back,
       and over it the vine of gold, its clusters the height of a man (Middot 3:8) */
    api.box(xHW,H0,-HZ+cu(16),xPI,H0+cu(90),HZ-cu(16),WHITE);
    api.box(xPI-0.1,H0+cu(20),-cu(9),xPI+0.5,H0+cu(25),cu(9),GOLD);                     /* the vine */
    for(let k=0;k<7;k++){ const z=-cu(8)+k*cu(16/6); api.box(xPI-0.1,H0+cu(17),z,xPI+0.6,H0+cu(20),z+0.9,GOLD); }   /* its clusters, hanging */
    api.box(xPI,H0,-cu(9.5),xPI+0.6,H0+cu(20),-cu(5),GOLD); api.box(xPI,H0,cu(5),xPI+0.6,H0+cu(20),cu(9.5),GOLD);   /* the doors, folded back */
    api.box(xPI,H0+cu(1),cu(14),xPI+cu(2),H0+cu(2.4),cu(16),WHITE); api.box(xPI,H0+cu(1),-cu(16),xPI+cu(2),H0+cu(2.4),-cu(14),GOLD);   /* the tables of marble and of gold in the porch (Menachot 11:7) */
    /* THE HOLY PLACE (hekal), forty cubits by twenty and forty high, and THE MOST SET APART PLACE,
       twenty cubits square: one hollow, its walls overlaid with gold */
    api.box(xDb-1,H0,-cu(10)-1,xHW+0.5,H0+cu(40)+1,cu(10)+1,GOLD);
    api.box(xDb,H0,-cu(10),xHW,H0+cu(40),cu(10),'air');
    /* THE TWO VEILS, a cubit between them (Yoma 5:1): the outer one open at its south end, the inner
       at its north; within, nothing but the stone of the foundation, three fingers above the floor */
    api.box(xV1+0.2,H0,-cu(10),xV1+1.1,H0+cu(40),cu(10),BLUE);
    api.box(xV1+0.2,H0,cu(7.5),xV1+1.1,H0+cu(7),cu(10),'air');
    api.box(xV2-1.1,H0,-cu(10),xV2-0.2,H0+cu(40),cu(10),BLUE);
    api.box(xV2-1.1,H0,-cu(10),xV2-0.2,H0+cu(7),-cu(7.5),'air');
    /* its entrance through the wall from the porch, twenty high and ten wide */
    api.box(xHW-0.3,H0,-cu(5),xPI+0.3,H0+cu(20),cu(5),'air');
    api.box(xDb+cu(8),H0,-cu(2),xDb+cu(12),H0+0.5,cu(2),'stone');                          /* the stone of the foundation */
    /* the things of the holy place (Menachot 11:6; Yoma 5:5): the table to the north, the lampstand
       to the south, the altar of incense between them */
    const ia=xV1+cu(14), D=(a,b,c2,d,e,f,col)=>(api.detail?api.detail(a,b,c2,d,e,f,col):api.box(a,b,c2,d,e,f,col));
    /* the golden altar of incense: a cubit square and two high, its four horns (Shemoth 30:2) */
    D(ia-c/2,H0,-c/2,ia+c/2,H0+cu(2),c/2,GOLD);
    for(const [hx,hz] of [[-1,-1],[1,-1],[-1,1],[1,1]]) D(ia+hx*c/2-hx*0.08-0.05,H0+cu(2),hz*c/2-hz*0.08-0.05,ia+hx*c/2-hx*0.08+0.05,H0+cu(2)+0.12,hz*c/2-hz*0.08+0.05,GOLD);
    D(ia-c/2-0.03,H0+cu(1.8),-c/2-0.03,ia+c/2+0.03,H0+cu(1.85),c/2+0.03,GOLD);              /* its crown */
    /* the table of the bread of the presence: two cubits long, one wide, a cubit and a half high, its
       twelve loaves in two rows of six (Wayyiqra 24:6) */
    { const tx=ia+cu(9), tz=-cu(4.5);
      D(tx-c,H0+cu(1.4),tz-c/2,tx+c,H0+cu(1.5),tz+c/2,GOLD);
      for(const [lx,lz] of [[-1,-1],[1,-1],[-1,1],[1,1]]) D(tx+lx*(c-0.05)-0.03,H0,tz+lz*(c/2-0.05)-0.03,tx+lx*(c-0.05)+0.03,H0+cu(1.4),tz+lz*(c/2-0.05)+0.03,GOLD);
      for(const rz of [-1,1]) for(let k=0;k<6;k++) D(tx+rz*0.26-0.2,H0+cu(1.5)+k*0.07,tz-0.14,tx+rz*0.26+0.2,H0+cu(1.5)+(k+1)*0.07-0.01,tz+0.14,'sand'); }
    /* the lampstand of gold to the south, its shaft and six branches, three on either side, each
       rising to a lamp level with the shaft's own (Shemoth 25:31-37) */
    { const lx=ia+cu(9), lz=cu(4.5), lh=1.6, top=H0+lh;
      D(lx-0.22,H0,lz-0.22,lx+0.22,H0+0.12,lz+0.22,GOLD);                                      /* its foot */
      D(lx-0.035,H0+0.12,lz-0.035,lx+0.035,top,lz+0.035,GOLD);                                 /* the shaft */
      for(let k=1;k<=3;k++){ const r=k*0.2, y=top-0.2-k*0.28;
        D(lx-0.025,y,lz-r,lx+0.025,y+0.05,lz+r,GOLD);                                          /* the branch, across */
        for(const sd of [-1,1]) D(lx-0.025,y,lz+sd*r-0.025,lx+0.025,top,lz+sd*r+0.025,GOLD); } /* and up to its lamp */
      for(let k=-3;k<=3;k++) D(lx-0.07,top,lz+k*0.2-0.07,lx+0.07,top+0.06,lz+k*0.2+0.07,GOLD);  /* the seven lamps */
      for(let k=-3;k<=3;k++) D(lx-0.02,top+0.06,lz+k*0.2-0.02,lx+0.02,top+0.14,lz+k*0.2+0.02,'hay'); }   /* their flames */
    /* THE CHAMBERS about the House: thirty-eight cells, fifteen on the north, fifteen on the south and
       eight on the west, three storeys, five cubits, six and seven high (Middot 4:3), each with three
       doors: to the next, to the one above, and to the winding stair */
    const zC0=cu(10)+cu(6), zC1=zC0+cu(6);                                                 /* a cell lies outside the holy place's own wall */
    const store=[[H0,cu(5)],[H0+cu(6),cu(6)],[H0+cu(13),cu(7)]];
    for(const zs of [-1,1]) for(const [sy,sh] of store) for(let k=0;k<5;k++){
      const L=(xPI-cu(6)-xDW)/5, x0=xDW+k*L;
      api.box(x0+0.5,sy,Math.min(zs*zC0,zs*zC1),x0+L-0.5,sy+sh,Math.max(zs*zC0,zs*zC1),'air');
      if(k<4) api.box(x0+L-1,sy,zs*(zC0+cu(2)),x0+L+1,sy+cu(4),zs*(zC0+cu(4)),'air'); }
    for(const [sy,sh,n] of [[H0,cu(5),3],[H0+cu(6),cu(6),3],[H0+cu(13),cu(7),2]]) for(let k=0;k<n;k++){
      const L=cu(20)/n, z0=-cu(10)+k*L; api.box(xCl,sy,z0+0.4,xDW,sy+sh,z0+L-0.4,'air'); }
    /* the winding stair on the north side, by which the priests went up to the roof */
    for(let s=0;s<30;s++){ const x=xPI-cu(6)-s*cu(2.2); if(x<HX0+cu(5)) break;
      api.box(x-cu(2.2),H0+s*cu(1),-HZ+cu(5),x,H0+s*cu(1)+cu(5),-HZ+cu(8),'air'); }
    /* the upper storey over the holy place and the most set apart place */
    api.box(xDb,H0+cu(46),-cu(10),xHW,H0+cu(86),cu(10),'air');
    api.mark('holyPlace',xHk+cu(26),cu(2)); api.mark('incense',ia+cu(2),0); api.mark('incenseAltar',ia,0);
    api.mark('lampstand',ia+cu(8),cu(4.5)); api.mark('table',ia+cu(9),-cu(4.5)); api.mark('veil',xV1+cu(2),0);
    api.mark('mostHoly',xDb+cu(10),0); api.mark('porch',(xPI+xPW)/2,0); api.mark('porchFront',HX1+cu(14),-cu(4));
    api.mark('hekal',(xHk+xHW)/2,0); api.mark('hekalView',Xw+cu(40),0); api.mark('courtPriests',(HX1+AX0)/2,-cu(20)); api.mark('courtIsrael',XI+cu(5),cu(30));
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
  for(let k=0;k<70;k++){ const ox=330+hash(k,3)*520, oz=-420+hash(k,9)*620, y=gY(ox,oz);
    api.box(ox-0.4,y,oz-0.4,ox+0.4,y+2.4,oz+0.4,0x5d4a36); api.box(ox-2,y+2,oz-2,ox+2,y+4,oz+2,0x6d7a4a); }
  api.mark('gethsemane',416,-155); api.mark('olivesTop',833,-44);
  api.mark('westQuarter',-400,300);
  api.mark('golgothaTrue',-548,-33);
  api.houses=houses;
};
})();
