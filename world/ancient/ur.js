/* ================= UR OF THE KASDIM (ROADMAP Phase D4) =================
   "Teraḥ took Aḇram his son … and they went out with them from Ur of the Kasdim" (Berĕshith 11:31). The
   city of the moon on the Furat, at Tell el-Muqayyar, as Woolley dug her: her anchor is the tower of Nanna
   itself, which world/wonders-true.js raises (three stages of baked brick over mud brick, its three
   stairways meeting at the gatehouse; turned a quarter here to its true bearing, so its stairs climb
   from the west), and about it:
     · the temenos of Nanna, its wall and its gates: the terrace of the tower, the great court of Nanna
       (Ekishnugal) on its east, the Gipar of Ningal and of the high priestess on its south, the
       Edublalmah gate, and the Ekhursag, the palace of Ur-Nammu and Shulgi, at its corner;
     · the royal cemetery south of the temenos, its shafts and the mounds over them;
     · the walled oval of the city, some twelve hundred metres by seven hundred, its rampart of earth
       with the wall of Ur-Nammu upon it, and its gates;
     · the Furat along her west side, and her two harbours within the walls, the west harbour and the
       north harbour, each with its channel to the river;
     · her houses of two storeys about their courts, close on narrow winding lanes (the "AH" quarter of
       the digging), her shrines among them, and her square. */
(function(){
const CX=120, CZ=170, RX=380, RZ=600;                              /* the oval of her rampart */
const FX=-470;                                                     /* the Furat's middle */
const DEF={
  n:'Ur', land:'Iraq', lat:30.9627, lon:46.1031, at:'The Ziggurat of Ur',
  square:[330,170], reach:900, folk:72, style:'levant',
  ground:{
    level:[{x:CX-80,z:CZ,rx:RX+320,rz:RZ+260,blend:350}],
    /* the rampart: a ring of earth some forty metres broad at its foot and eight high */
    hills:[[CX,CZ,8,RX,RZ,0.45,'badlands',44]],
    waters:[
      {pts:[[FX-80,-2400],[FX,-600],[FX-10,700],[FX+40,2600]],w:150,level:-2.6,depth:4},
      /* the channels to the harbours, cut through the rampart */
      {pts:[[FX+60,90],[CX-RX+70,90]],w:26,level:-2.6,depth:3.5},
      {pts:[[FX+40,-560],[60,-500],[CX-60,CZ-RZ+70]],w:24,level:-2.6,depth:3.5},
      /* the canal along her east side */
      {pts:[[CX+RX+60,-900],[CX+RX+60,CZ],[CX+RX+20,1400]],w:20,level:-2,depth:2.5}
    ],
    pools:[[CX-RX+60,40,CX-RX+170,140,-2.6,3.5],[CX-120,CZ-RZ+60,CX-10,CZ-RZ+150,-2.6,3.5]]
  },
  plan:function*(api){ const K=ANCIENT_KIT(api,DEF), box=K.box, hsh=K.hsh, M=K.MPB;
    const MB='mudbrick', BR='brick', BT='bitumen', GOLD='gold-leaf', HS='hewn-stone';
    const inOval=(x,z,m)=>Math.hypot((x-CX)/(RX-m),(z-CZ)/(RZ-m))<1;
    /* ================= THE WALL OF UR-NAMMU ON ITS RAMPART ================= */
    { const pts=[]; for(let k=0;k<=40;k++){ const a=k/40*Math.PI*2; pts.push([CX+Math.cos(a)*RX,CZ+Math.sin(a)*RZ]); }
      /* (its gates: the north, the east, the south, and where the harbours' channels come through) */
      const gates=[[CX,CZ-RZ,6,'gateNorth'],[CX+RX,CZ,6,'gateEast'],[CX,CZ+RZ,6,'gateSouth'],[CX-RX,90,16],[CX-50,CZ-RZ+30,14]];
      K.wall(pts,{m:MB,h:7,t:4,towers:60,tw:8,th:3,gates});
      api.mark('gateNorthOut',CX,CZ-RZ-30); api.mark('gateEastOut',CX+RX+30,CZ); }
    yield;
    /* the quays of the two harbours, baked brick in bitumen, and the stairs down to the water */
    for(const Q of DEF.ground.pools){ const [x0,z0,x1,z1]=Q.map(K.sx);
      for(const [a0,b0,a1,b1] of [[x0-M,z0-M,x1+M,z0],[x0-M,z1,x1+M,z1+M],[x0-M,z0,x0,z1],[x1,z0,x1+M,z1]]) box(a0,-6.5,b0,a1,0.9,b1,BR);
      for(let k=0;k<5;k++) box((x0+x1)/2-3,-2.6+k*0.55,z1-1-k*0.9,(x0+x1)/2+3,-2.1+k*0.55,z1-k*0.9,BR);
      for(let x=x0+6;x<x1-6;x+=14) K.hall(x,z0-16,x+11,z0-4,4.2,MB,{doors:[[x+5.5,z0-4]]});   /* the warehouses of the merchants */
    }
    api.mark('westHarbour',CX-RX+115,150); api.mark('northHarbour',CX-65,CZ-RZ+160);
    yield;

    /* ================= THE TEMENOS OF NANNA ================= */
    const T={x0:-120,x1:205,z0:-120,z1:150};
    K.wall([[T.x0,T.z0],[T.x1,T.z0],[T.x1,T.z1],[T.x0,T.z1],[T.x0,T.z0]],{m:MB,h:7,t:3.5,towers:22,tw:5,th:2,gates:[[T.x1,-40,5,'temenosEast'],[60,T.z1,6,'edublalmah'],[T.x0,0,5]],gm:BR});
    /* the terrace of the tower, its retaining wall about it, its way up from the court of Nanna */
    /* (outside the tower's own levelled court, which world/wonders-true.js lays and keeps) */
    { const y=0; for(const [a0,b0,a1,b1] of [[-80,-56,54,-54],[-80,54,54,56],[-80,-56,-78,56],[52,-56,54,-12],[52,12,54,56]]) box(a0,y-M,b0,a1,y+2.6,b1,BR);
      api.mark('ziggurat',-62,0); api.mark('zigguratStair',-58,0); }
    /* the court of Nanna (Ekishnugal) on the east of the terrace: its court, its rooms, its shrine */
    { const y=K.court(55,-110,195,10,8,MB,{t:2.5,rooms:9,door:'w',pave:BR});
      K.hall(150,-80,186,-30,10,BR,{y,doors:[[150,-55,1.8,5]]}); K.altar(110,-50,4,1.4,BR);
      api.mark('courtNanna',105,-50); }
    /* the Gipar: the house of the high priestess and the temple of Ningal, on the south of the temenos */
    { const y=K.court(-10,40,120,140,7,MB,{t:2.5,rooms:10,door:'n',pave:BR});
      K.hall(20,70,60,110,8,BR,{y,courts:[[40,90,6,6]],doors:[[40,70,1.4,4]]});
      api.mark('gipar',55,32); }
    /* the Ekhursag, the palace of the kings, at the corner */
    { const y=K.court(130,40,200,140,7,MB,{t:2.5,rooms:12,door:'w',pave:'path'}); api.mark('ekhursag',165,90); }
    /* the store of Nanna's offerings along the north wall */
    for(let x=-110;x<190;x+=25) if(Math.abs(x+40)>14) K.hall(x,T.z0+3,x+20,T.z0+17,4.2,MB,{doors:[[x+10,T.z0+17]]});
    yield;

    /* ================= THE ROYAL CEMETERY ================= */
    for(let k=0;k<26;k++){ const x=-60+hsh(k,1)*170, z=175+hsh(k,2)*90;
      if(k<6){ box(x-4,-0.2,z-3,x+4,0.6,z+3,'dirt'); box(x-3,-4.5,z-2,x+3,-0.2,z+2,'air'); box(x-3,-5.4,z-2,x+3,-4.5,z+2,BR);   /* a pit opened, the tomb's brick at its foot */
        for(let s=0;s<6;s++) box(x+3,-4.5+s*0.75,z-1,x+3.8+s*0.4,-3.7+s*0.75,z+1,'dirt'); }
      else box(x-3,0,z-3,x+3,1+hsh(k,3)*1.2,z+3,'dirt'); }
    api.mark('royalTombs',30,215);
    yield;

    /* ================= HER STREETS, HER HOUSES AND HER SQUARE ================= */
    const SQ=DEF.square; api.top(SQ[0]-28,SQ[1]-24,SQ[0]+28,SQ[1]+24,BR); api.mark('square',SQ[0],SQ[1]);
    K.street([[CX,CZ-RZ+20],[CX,T.z0-8]],8,'path'); K.street([[T.x1+8,-40],[CX+RX-10,-40],[CX+RX-10,CZ]],8,'path');
    K.street([[60,T.z1+8],[60,CZ+RZ-20]],8,'path'); K.street([[60,330],[SQ[0]-28,330],[SQ[0]-28,SQ[1]+24]],6,'path');
    const busy=[[T.x0-6,T.z0-6,T.x1+6,T.z1+6],[-70,165,120,275],[SQ[0]-32,SQ[1]-28,SQ[0]+32,SQ[1]+28]];
    const water=(x,z,m)=>DEF.ground.pools.some(Q=>x>Q[0]-20-m&&x<Q[2]+20+m&&z>Q[1]-22-m&&z<Q[3]+8+m)||
      Math.abs(z-90)<24+m&&x<CX-RX+80||(z<CZ-RZ+190&&x<CX+20&&x>CX-140);
    const free=(x,z,m)=>{ m=m||0; if(!inOval(x,z,40+m)) return false; if(water(x,z,m)) return false;
      if(Math.abs(x-CX)<6+m&&z<T.z0||Math.abs(z+40)<6+m&&x>T.x1||Math.abs(x-60)<6+m&&z>T.z1||Math.abs(x-(CX+RX-10))<6+m) return false;
      return !busy.some(b=>x>b[0]-6-m&&x<b[2]+6+m&&z>b[1]-6-m&&z<b[3]+6+m); };
    /* the houses of the folk, close on their lanes about the square */
    K.quarter(SQ[0]-160,SQ[1]-140,SQ[0]+130,SQ[1]+330,17,(x,z)=>free(x,z,1),{w:7,wv:3});
    K.quarter(CX-300,300,CX+60,700,22,(x,z)=>free(x,z,1),{w:7,wv:3});
    yield;
    /* and the closer quarters: houses of two storeys wall to wall about their courts, their lanes winding */
    let nm=0;
    for(let bx=CX-RX+40;bx<CX+RX-40;bx+=58) for(let bz=CZ-RZ+60;bz<CZ+RZ-60;bz+=46){
      const x0=bx+5+hsh(bx,bz)*4, x1=bx+50, z0=bz+5, z1=bz+38+hsh(bz,bx)*4;
      if(![[x0,z0],[x1,z0],[x0,z1],[x1,z1],[(x0+x1)/2,(z0+z1)/2]].every(p=>free(p[0],p[1],2))) continue;
      if(Math.hypot((x0+x1)/2-SQ[0],(z0+z1)/2-SQ[1])<170) continue;
      if(hsh(bx*1.7,bz*0.3)<0.35) continue;
      const courts=[]; for(let k=0;k<3;k++) courts.push([x0+8+hsh(bx+k,bz)*(x1-x0-16),z0+7+hsh(bz,bx+k)*(z1-z0-14),3,2.6]);
      K.hall(x0,z0,x1,z1,(hsh(bx,3)<0.6?7.4:4.6),MB,{courts,doors:[[(x0+x1)/2,z0,0.9,2.6],[(x0+x1)/2,z1,0.9,2.6]]});
      if(++nm%12===0) yield; }
    /* her shrines among the houses (the chapels of the AH quarter), and the palms by the river */
    for(const [x,z] of [[250,420],[0,560],[380,-120],[-150,480]]) if(free(x,z,6)){ K.court(x-12,z-10,x+12,z+10,5,MB,{t:1.5,door:'n',pave:BR}); api.mark('shrine'+Math.round(x),x,z-16); }
    for(let k=0;k<120;k++){ const z=-1200+hsh(k,9)*2900, x=FX+(hsh(k,11)<0.5?-1:1)*(85+hsh(k,13)*150); K.palm(x,z,8+hsh(k,15)*5); }
    for(let k=0;k<40;k++){ const a=hsh(k,17)*Math.PI*2, r=1+hsh(k,19)*0.35; const x=CX+Math.cos(a)*RX*r+40, z=CZ+Math.sin(a)*RZ*r; if(x>FX+90) K.palm(x,z,7+hsh(k,21)*4); }
    const ring=[]; for(let k=0;k<24;k++){ const a=k/24*Math.PI*2; ring.push([CX+Math.cos(a)*(RX-24),CZ+Math.sin(a)*(RZ-24)]); }
    api.townGround(ring);
    api.mark('furat',FX+90,0);
  }
};
EARTH.ancient(DEF);
})();
