/* ================= NINEWĔH, THE GREAT CITY (ROADMAP Phase D4) =================
   "Ninewĕh was an exceedingly great city, a three days' journey" (Yonah 3:3): the city of Sanḥeriḇ on the
   east bank of the Ḥiddeqel, opposite the later Mosul. Her anchor is the gate of Nergal in her north wall,
   which world/wonders-true.js raises (its stretch of the great wall, its moat and its winged bulls), and
   about it her plan after Layard, Rassam and Campbell Thompson:
     · the Ḥiddeqel along her west side, near two hundred metres broad;
     · the Khosr, coming down from the east, through her wall and between her two tells to the river;
     · her long wall of mud brick on its stone footing, fifteen metres thick, about her four sides, its
       towers and fifteen gates named for her gods (Nergal, Adad, Shamash, Ninlil, Sin, Ashur, Halzi,
       Mashki and the quay gates), the moat before it on the north and the east; she was some twelve
       kilometres about and is drawn here at near the half of it, her works at their own measure;
     · the tell of Kuyunjik, twenty-five metres over the plain, with the palace "without a rival" of
       Sanḥeriḇ on its south-west, the north palace of Ashurbanipal with his library, and the temples of
       Ishtar and Nabu between them, a stair and a ramp up from the lower town;
     · the tell of Nebi Yunus south of the Khosr, with the arsenal of Esarhaddon on it;
     · her lower town on the plain: the market, the quarters of houses, and the gardens Sanḥeriḇ watered
       with his canals. */
(function(){
const N=0, E=560, S=2600, Wn=-1000, Ws=-1000;                     /* her walls: north, east, south, and the west along the river */
const TX=-1260;                                                    /* the Ḥiddeqel's middle */
const KY={x:-560,z:650,rx:430,rz:300,h:25}, NY={x:-430,z:1850,rx:240,rz:200,h:18};
const DEF={
  n:'Ninewĕh', land:'Iraq', lat:36.36, lon:43.15, at:'The Gates of Ninewĕh',
  square:[250,1100], reach:2000, folk:96, style:'levant',
  ground:{
    level:[{x:-250,z:1350,rx:1250,rz:1750,blend:500}],
    hills:[[KY.x,KY.z,KY.h,KY.rx,KY.rz,0.2,'badlands'],[NY.x,NY.z,NY.h,NY.rx,NY.rz,0.25,'badlands']],
    waters:[
      {pts:[[TX-60,-1800],[TX,0],[TX+40,1400],[TX+120,3000],[TX+60,4600]],w:180,level:-3.2,depth:5},
      {pts:[[1600,1080],[E,1240],[200,1300],[-150,1260],[-330,1330],[-760,1300],[TX+80,1310]],w:34,level:-2.4,depth:2.5},
      /* the moat before the north wall (the gate of Nergal keeps its own) and the east */
      {pts:[[Wn-60,-34],[-262,-34]],w:22,level:-2.2,depth:2.5},{pts:[[262,-34],[E+38,-34],[E+38,S+38],[Ws,S+38]],w:22,level:-2.2,depth:2.5}
    ]
  },
  plan:function*(api){ const K=ANCIENT_KIT(api,DEF), box=K.box, hsh=K.hsh, M=K.MPB;
    const MB='mudbrick', LS='hewn-stone', GS='grey-stone', BR='brick', GOLD='gold-leaf';
    const westAt=z=>Wn+(Ws-Wn)*z/S;                                 /* the west wall, along the river */
    const khosr=DEF.ground.waters[1].pts;
    const nearKhosr=(x,z,m)=>{ for(let i=0;i+1<khosr.length;i++){ const ax=khosr[i][0], az=khosr[i][1], dx=khosr[i+1][0]-ax, dz=khosr[i+1][1]-az, t=Math.max(0,Math.min(1,((x-ax)*dx+(z-az)*dz)/(dx*dx+dz*dz)));
      if(Math.hypot(x-ax-dx*t,z-az-dz*t)<m) return true; } return false; };
    const kz=x=>{ for(let i=0;i+1<khosr.length;i++){ const a=khosr[i], b=khosr[i+1]; if((x<=a[0]&&x>=b[0])||(x>=a[0]&&x<=b[0])) return a[1]+(b[1]-a[1])*(x-a[0])/(b[0]-a[0]); } return 1300; };

    /* ================= THE GREAT WALL AND ITS GATES ================= */
    /* (its stone footing a course of hewn stone, the mud brick over it, as the gate of Nergal's own stretch) */
    const W={m:MB,h:17,t:15,hollow:true,towers:46,tw:12,th:5};
    K.wall([[Wn,N],[-256,N]],Object.assign({},W,{gates:[[-640,N,5,'gateSin']]}));
    K.wall([[256,N],[E,N]],Object.assign({},W,{gates:[[400,N,5,'gateAdad']]}));
    yield;
    K.wall([[E,N],[E,S]],Object.assign({},W,{gates:[[E,700,5,'gateShamash'],[E,kz(E),20],[E,1750,5,'gateNinlil'],[E,2350,5,'gateHalzi']]}));
    yield;
    K.wall([[E,S],[Ws,S]],Object.assign({},W,{gates:[[200,S,5,'gateAshur'],[-350,S,5,'gateSouth']]}));
    K.wall([[Ws,S],[westAt(kz(-900)+30),kz(-900)+30]],Object.assign({},W,{gates:[[westAt(2150),2150,5,'gateQuay']]}));
    K.wall([[westAt(kz(-900)-30),kz(-900)-30],[Wn,N]],Object.assign({},W,{gates:[[westAt(900),900,5,'gateMashki']]}));
    for(const [x,z] of [[Wn,N],[E,N],[E,S],[Ws,S]]) K.tower(x,z,20,20,24,MB);
    /* where the Khosr comes through, towers either side of its water gate, and the stone of the sluice */
    for(const s of [-1,1]){ K.tower(E,kz(E)+s*24,16,16,22,MB); const xw=westAt(kz(-900)), zw=kz(-900); K.tower(xw,zw+s*36,16,16,22,MB); }
    box(E-8,-2.2,kz(E)-18,E+8,-1.2,kz(E)+18,LS);
    /* the stone footing along the foot of every wall, its face toward the field */
    for(let x=Wn;x<E;x+=3) if(Math.abs(x)>256) box(x,-M,N-8.6,x+3,1.8,N-7.4,LS);
    for(let z=N;z<S;z+=3) box(E+7.4,-M,z,E+8.6,1.8,z+3,LS);
    yield;

    /* ================= KUYUNJIK, AND THE PALACES ON IT ================= */
    const KYt=K.sy(KY.h);                                            /* the tell's level top */
    /* the palace without a rival: its courts, its halls lined with the reliefs of Lakhish, its gate of bulls */
    { const x0=KY.x-230, x1=KY.x-30, z0=KY.z-10, z1=KY.z+190;
      const y=K.court(x0,z0,x1,z1,13,MB,{y:KYt,t:3,door:'e'});
      K.hall(x0+3,z0+3,x1-3,z0+40,11,MB,{y,doors:[[(x0+x1)/2,z0+40,2.5,6]]});
      K.hall(x0+3,z1-60,x1-3,z1-3,11,MB,{y,courts:[[(x0+x1)/2,z1-30,22,14]],doors:[[(x0+x1)/2,z1-60,2.5,6]]});
      K.hall(x0+3,z0+40,x0+50,z1-60,11,MB,{y,courts:[[x0+26,(z0+z1)/2,10,18]],doors:[[x0+50,(z0+z1)/2,2,5]]});
      /* the throne room on the great court, its doorway guarded by the winged bulls */
      K.hall(x1-62,z0+60,x1-3,z0+120,15,MB,{y,doors:[[x1-62,z0+90,3,8]]});
      for(const s of [-1,1]){ box(x1-66,y,z0+90+s*4.2-0.8,x1-60,y+2,z0+90+s*4.2+0.8,GS); box(x1-65,y+2,z0+90+s*4.2-0.7,x1-61,y+5.6,z0+90+s*4.2+0.7,GS); }
      api.top(x0+50,z0+40,x1-62,z1-60,LS);
      api.mark('palaceSennacherib',(x0+x1)/2,z0+80); api.mark('throneNinewe',x1-30,z0+90); }
    yield;
    /* the north palace of Ashurbanipal, and his library of tablets */
    { const x0=KY.x-60, x1=KY.x+170, z0=KY.z-220, z1=KY.z-100;
      const y=K.court(x0,z0,x1,z1,12,MB,{y:KYt,t:3,rooms:16,door:'s',pave:LS});
      K.hall(x0+40,z0+40,x0+110,z0+80,9,MB,{y,doors:[[x0+75,z0+80,1.6,4]]});
      api.mark('library',x0+75,z0+88); api.mark('palaceAshurbanipal',(x0+x1)/2,z1+8); }
    /* the temples of Ishtar and of Nabu between them */
    { const t1=K.court(KY.x-20,KY.z-80,KY.x+80,KY.z-10,10,BR,{y:KYt,t:2.5,rooms:10,door:'s',pave:LS}); K.tower(KY.x+30,KY.z-60,14,14,22,BR); api.mark('templeIshtarNinewe',KY.x+30,KY.z+4);
      const t2=K.court(KY.x+100,KY.z-60,KY.x+190,KY.z+10,9,BR,{y:KYt,t:2.5,rooms:9,door:'s',pave:LS}); api.mark('templeNabu',KY.x+145,KY.z+22); }
    /* the ramp up to the tell from the lower town, and its stair */
    { const rx=KY.x+KY.rx*0.66, rz=KY.z+60;
      for(let k=0;k<30;k++){ const x=rx+k*3, y=K.sy(KYt*(1-k/30)); box(x,y-2*M,rz-6,x+3,y,rz+6,LS,{foot:true}); }
      api.mark('kuyunjikRamp',rx+95,rz); api.mark('kuyunjikTop',rx-20,rz); }
    yield;

    /* ================= NEBI YUNUS, AND THE ARSENAL ================= */
    { const t=K.sy(NY.h), x0=NY.x-110, x1=NY.x+90, z0=NY.z-90, z1=NY.z+80;
      const y=K.court(x0,z0,x1,z1,12,MB,{y:t,t:3.5,rooms:18,door:'n',pave:'path'});
      for(const [x,z] of [[x0,z0],[x1,z0],[x0,z1],[x1,z1]]) K.tower(x,z,12,12,16,MB);
      for(let k=0;k<24;k++){ const z=z0-4-k*3, y2=K.sy(t*(1-k/24)); box(NY.x-6,y2-2*M,z-3,NY.x+6,y2,z,LS,{foot:true}); }
      api.mark('nebiYunus',NY.x,z0-80); api.mark('arsenal',NY.x,NY.z); }
    yield;

    /* ================= THE LOWER TOWN ================= */
    const SQ=DEF.square; api.top(SQ[0]-32,SQ[1]-26,SQ[0]+32,SQ[1]+26,LS); api.mark('square',SQ[0],SQ[1]);
    /* the royal road from the gate of Nergal south to the Khosr, and from the gate of Shamash west */
    K.street([[0,N+30],[0,kz(0)-24]],14,LS); K.street([[E-10,700],[E-260,700]],12,'path');
    /* bridges over the Khosr on the way south, and by the square */
    for(const x of [0,280]){ const z=kz(x); K.bridge(x,z-22,x,z+22,9,0.2,-4.9,LS); }
    K.street([[0,kz(0)+24],[0,kz(0)+400]],12,'path');
    const onTell=(x,z,T,m)=>Math.hypot((x-T.x)/(T.rx+m),(z-T.z)/(T.rz+m))<1;
    const free=(x,z,m)=>{ m=m||0;
      if(z<N+30||z>S-30||x>E-30||x<westAt(z)+30) return false;
      if(onTell(x,z,KY,24+m)||onTell(x,z,NY,24+m)) return false;
      if(nearKhosr(x,z,34+m)) return false;
      if(Math.abs(x)<12+m||Math.abs(x-280)<10+m&&z>kz(280)||Math.abs(z-700)<11+m&&x>-110) return false;
      if(Math.abs(x-SQ[0])<38+m&&Math.abs(z-SQ[1])<32+m) return false;
      return true; };
    /* her houses about the market and along the roads */
    K.quarter(SQ[0]-150,SQ[1]-180,SQ[0]+190,SQ[1]+110,21,(x,z)=>free(x,z,1),{w:7,wv:3});
    yield;
    K.quarter(-60,140,500,520,34,(x,z)=>free(x,z,1),{w:7,wv:3});
    K.quarter(-150,1500,480,2250,42,(x,z)=>free(x,z,1),{w:7,wv:3});
    yield;
    /* the closer quarters: blocks of houses wall to wall about their courts */
    let nm=0;
    for(let bx=-180;bx<E-60;bx+=72) for(let bz=150;bz<S-60;bz+=60){
      const x0=bx+6, x1=bx+60, z0=bz+6, z1=bz+48;
      if(![[x0,z0],[x1,z0],[x0,z1],[x1,z1],[(x0+x1)/2,(z0+z1)/2]].every(p=>free(p[0],p[1],2))) continue;
      if(Math.hypot((x0+x1)/2-SQ[0],(z0+z1)/2-SQ[1])<240) continue;
      if(hsh(bx*1.3,bz*0.7)<0.72) continue;                             /* (her gardens, watered from the canals) */
      const courts=[]; for(let k=0;k<3;k++) courts.push([x0+9+hsh(bx+k,bz)*(x1-x0-18),z0+8+hsh(bz,bx+k)*(z1-z0-16),3.5,3]);
      K.hall(x0,z0,x1,z1,4.6+Math.floor(hsh(bx,1)*3)*M,MB,{courts,doors:[[(x0+x1)/2,z0,0.9,2.6],[(x0+x1)/2,z1,0.9,2.6]]});
      if(++nm%10===0) yield; }
    yield;
    /* the gardens of the king, their trees in rows, and the palms along the river */
    for(let k=0;k<120;k++){ const x=-150+hsh(k,3)*650, z=1450+hsh(k,5)*1100; if(free(x,z,4)) K.tree(x,z,4+hsh(k,7)*3,k%3?'olive':null); }
    for(let k=0;k<110;k++){ const z=-900+hsh(k,9)*4200, x=TX+(hsh(k,11)<0.5?-1:1)*(100+hsh(k,13)*140); K.palm(x,z,8+hsh(k,15)*5); }
    api.townGround([[Wn,N],[E,N],[E,S],[Ws,S]]);
    api.mark('tigris',TX+100,900); api.mark('khosr',-100,kz(-100)-24); api.mark('gateNergal',0,30);
  }
};
EARTH.ancient(DEF);
})();
