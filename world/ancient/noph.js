/* ================= NOPH OF THE WHITE WALLS (ROADMAP Phase D4) =================
   "The princes of Noph are deceived" (Yeshayahu 19:13); Mennefer, Memphis of the Yawanim, at the mouth of
   the valley where the two lands meet, on the west bank of the Nile south of the later Cairo. Her anchor is
   the house of Ptah (Hut-ka-Ptah, whence the very name of Egypt), at Mit Rahina, and about it, after Petrie
   and the work since:
     · the Nile along her east side, its quay and the dromos up from it to the gate of Ptah;
     · the precinct of Ptah: its wall of mud brick, its pylons facing the river, its courts, its hall of
       columns and its shrine, its sacred lake, the colossi of Ramesses before its gate and the great
       sphinx of alabaster on the way to its south gate, and the house of the embalming of the Apis;
     · Ineb-hedj, "the White Walls", the walled citadel of the kings north of the temple, its walls of
       whitewashed brick and their towers, and the palace on its mound within;
     · her town of mud brick about her market, and the palms and the fields of the valley;
     · and on the desert's edge at her back, three and a half kilometres to the west, the field of the
       pyramids of Saqqara with the step pyramid of Djoser in its walled court: six stages of white
       limestone, a hundred and twenty-one metres by a hundred and nine and sixty-two high, its enclosure
       wall of bastions and false doors, 545 metres by 278, its colonnade and its courts. (The pyramids of
       Giza stand sixteen kilometres north, raised by world/wonders-true.js; they are not raised again.) */
(function(){
const NX=650;                                                      /* the Nile's middle, east of the city */
const SQx=-3600, SQz=-900;                                         /* Saqqara: the step pyramid */
const DEF={
  n:'Noph', land:'Egypt', lat:29.8449, lon:31.2549,
  square:[-150,250], reach:1400, folk:90, style:'levant',
  ground:{
    level:[{x:-60,z:-150,rx:1500,rz:2600,blend:900,kind:'grass'},
           {x:SQx,z:SQz,rx:760,rz:620,blend:700,y:36,kind:'desert'}],
    waters:[{pts:[[NX-80,-4000],[NX,-1000],[NX+40,1000],[NX+20,4000]],w:420,level:-3,depth:6}],
    pools:[[-200,90,-90,170,-1.6,3]]
  },
  plan:function*(api){ const K=ANCIENT_KIT(api,DEF), box=K.box, hsh=K.hsh, M=K.MPB;
    const S='sandstone', MB='mudbrick', LS='hewn-stone', AL='alabaster', RG='red-granite', PL='plaster', GOLD='gold-leaf';
    /* ================= THE HOUSE OF PTAH ================= */
    { const x0=-260, x1=260, z0=-210, z1=210;
      K.wall([[x0,z0],[x1,z0],[x1,z1],[x0,z1],[x0,z0]],{m:MB,h:11,t:7,hollow:true,towers:0,gates:[[x1,0,7,'gatePtah'],[0,z1,6,'gatePtahSouth'],[x0,0,5]],gm:LS});
      const y=K.g(0,0);
      /* the pylons, the courts and the hall of columns, from the river westward to the shrine */
      K.pylon('x',150,162,0,40,22,3,y,LS);
      K.court(40,-48,150,48,10,LS,{y,t:2,pave:LS});
      for(const s of [-1,1]) for(let x=48;x<146;x+=7){ K.round(x,s*38,y,y+8.5,1,LS); }
      K.pylon('x',28,40,0,34,18,2.6,y,LS);
      K.hall(-70,-40,28,40,14,LS,{y,doors:[[28,0,2.4,8]]});
      for(let i=0;i<6;i++) for(let j=0;j<6;j++) K.round(-62+i*15,-30+j*12,y,y+12.5,1.1,LS);
      K.hall(-130,-22,-70,22,10,LS,{y,doors:[[-70,0,1.8,6]]});
      box(-118,y,-3,-110,y+3.5,3,GOLD);                                                  /* the shrine of the god */
      /* the colossi of Ramesses before the pylon, of limestone and of granite */
      K.colossus(176,-22,13,1,LS); K.colossus(176,22,13,1,RG);
      /* the sacred lake within the wall, its stone steps */
      { const Q=DEF.ground.pools[0]; for(const [a0,b0,a1,b1] of [[Q[0]-M,Q[1]-M,Q[2]+M,Q[1]],[Q[0]-M,Q[3],Q[2]+M,Q[3]+M],[Q[0]-M,Q[1],Q[0],Q[3]],[Q[2],Q[1],Q[2]+M,Q[3]]]) box(K.sx(a0),-4.6,K.sx(b0),K.sx(a1),0.6,K.sx(b1),LS);
        api.mark('sacredLakeNoph',(Q[0]+Q[2])/2,Q[1]-6); }
      /* the priests' houses and the stores along the inside of the wall */
      for(let x=x0+12;x<x1-40;x+=30) if(Math.abs(x)>30) K.hall(x,z0+8,x+24,z0+26,5,MB,{doors:[[x+12,z0+26]]});
      api.mark('ptah',100,0); api.mark('ptahGate',200,0); api.mark('ptahShrine',-100,0); }
    /* the great sphinx of alabaster on the way to the south gate, and the house of the Apis */
    { const y=K.g(0,268); box(-4,y-M,250,4,y+1,290,AL,{foot:true}); box(-3,y+1,255,3,y+4,282,AL); box(-3.2,y+1,282,3.2,y+4.4,288,AL); box(-2.2,y+4.4,283,2.2,y+7.6,288,AL);
      for(const s of [-1,1]) box(s*1.4-1,y+1,288,s*1.4+1,y+2.4,294,AL);
      api.mark('sphinxAlabaster',10,270);
      K.court(-160,250,-40,330,8,MB,{t:2.5,rooms:10,door:'n',pave:LS}); for(let k=0;k<3;k++) box(-130+k*30,0,280,-118+k*30,1.6,292,AL);   /* its tables of alabaster */
      api.mark('apisHouse',-100,240); }
    /* the quay on the river and the dromos up to the gate of Ptah */
    for(let x=270;x<NX-212;x+=6){ api.top(x,-7,x+6,7,LS); for(const s of [-1,1]) if((x/6)%2<1) K.sphinx(x+3,s*11,1,'x',false); }
    for(let z=-60;z<60;z+=3) box(K.sx(NX-210)-M,-6.5,z,K.sx(NX-210),0.9,z+3,LS);
    api.mark('quayNoph',NX-225,0);
    yield;

    /* ================= INEB-HEDJ, THE WHITE WALLS ================= */
    { const x0=-460, x1=160, z0=-930, z1=-430;
      K.wall([[x0,z0],[x1,z0],[x1,z1],[x0,z1],[x0,z0]],{m:PL,h:13,t:8,hollow:true,towers:48,tw:11,th:4,gates:[[x1,-700,6,'gateWhiteWalls'],[-150,z1,6,'gateCitadel'],[x0,-680,5]]});
      /* the palace on its mound within, and the barracks of the garrison */
      const y=K.court(-300,-860,-20,-640,12,PL,{y:K.g(-160,-750),t:3,rooms:18,door:'s',pave:LS});
      K.hall(-200,-830,-120,-760,15,PL,{y,doors:[[-160,-760,2.4,7]]}); api.mark('palaceNoph',-160,-660);
      for(let x=x0+20;x<x1-30;x+=48) K.hall(x,z1-60,x+38,z1-20,5,MB,{doors:[[x+19,z1-20]]});
      api.mark('whiteWalls',x1+20,-700); }
    yield;

    /* ================= HER TOWN ================= */
    const SQ=DEF.square; api.top(SQ[0]-30,SQ[1]-26,SQ[0]+30,SQ[1]+26,'path'); api.mark('square',SQ[0],SQ[1]);
    K.street([[SQ[0],SQ[1]-26],[SQ[0],-200]],8,'path'); K.street([[0,210],[0,250]],8,LS);
    const free=(x,z,m)=>{ m=m||0;
      if(x>NX-230-m||x<-820||z<-880||z>760) return false;
      if(x>-270-m&&x<270+m&&z>-220-m&&z<220+m) return false;
      if(x>-470-m&&x<170+m&&z>-940-m&&z<-420+m) return false;
      if(Math.abs(z)<18+m&&x>260) return false;
      if(x>-170-m&&x<20+m&&z>240-m&&z<340+m) return false;
      if(Math.abs(x-SQ[0])<34+m&&Math.abs(z-SQ[1])<30+m) return false;
      if(Math.abs(x-SQ[0])<6+m&&z<SQ[1]&&z>-220) return false;
      return true; };
    K.quarter(SQ[0]-210,SQ[1]-150,SQ[0]+200,SQ[1]+260,19,(x,z)=>free(x,z,1),{w:7,wv:3});
    yield;
    K.quarter(-780,-380,-320,700,46,(x,z)=>free(x,z,1),{w:7,wv:3});
    K.quarter(280,250,NX-240,700,30,(x,z)=>free(x,z,1),{w:7,wv:3});
    let nm=0;
    for(let bx=-800;bx<NX-260;bx+=64) for(let bz=-400;bz<720;bz+=54){
      const x0=bx+5, x1=bx+54, z0=bz+5, z1=bz+44;
      if(![[x0,z0],[x1,z0],[x0,z1],[x1,z1],[(x0+x1)/2,(z0+z1)/2]].every(p=>free(p[0],p[1],3))) continue;
      if(Math.hypot((x0+x1)/2-SQ[0],(z0+z1)/2-SQ[1])<260) continue;
      if(hsh(bx*0.9,bz*1.1)<0.6) continue;
      const courts=[]; for(let k=0;k<3;k++) courts.push([x0+8+hsh(bx+k,bz)*(x1-x0-16),z0+7+hsh(bz,bx+k)*(z1-z0-14),3.2,2.8]);
      K.hall(x0,z0,x1,z1,(hsh(bx,7)<0.4?7.4:4.6),MB,{courts,doors:[[(x0+x1)/2,z0,0.9,2.6],[(x0+x1)/2,z1,0.9,2.6]]});
      if(++nm%10===0) yield; }
    yield;
    for(let k=0;k<180;k++){ const z=-2600+hsh(k,9)*5200, x=NX-210-10-hsh(k,13)*90; if(!free(x,z,2)&&z>-950&&z<770) continue; K.palm(x,z,8+hsh(k,15)*5); }
    for(let k=0;k<70;k++){ const x=-800+hsh(k,21)*1300, z=-400+hsh(k,23)*1100; if(free(x,z,6)&&Math.hypot(x-SQ[0],z-SQ[1])>50) K.palm(x,z,7+hsh(k,25)*4); }
    api.townGround([[-830,-420],[NX-220,-420],[NX-220,770],[-830,770]]);
    yield;

    /* ================= THE STEP PYRAMID OF DJOSER AT SAQQARA ================= */
    { const x=SQx, z=SQz, y=K.sy(K.g(x,z));
      /* six stages, each a casing of white limestone over the core (the core within is not laid) */
      let yy=y; const st=[[121,109,10.5],[111,99,10.5],[101,89,10.3],[91,79,10.2],[81,69,10.2],[71,59,10.3]];
      for(const [w,d,h] of st){ const a0=K.sx(x-w/2), a1=K.sx(x+w/2), b0=K.sx(z-d/2), b1=K.sx(z+d/2), top=K.sy(yy+h);
        K.carve([a0,yy-(yy===y?M:0),b0,a1,top,b1],[[a0+M,yy,b0+M,a1-M,top-M,b1-M]],LS); yy=top; }
      api.mark('stepPyramid',x+70,z); api.mark('stepPyramidTop',x,z);
      /* its enclosure, 545 by 278, its bastions and false doors, its one true gate in the south-east */
      const ex0=x-139, ex1=x+139, ez0=z-300, ez1=z+245;
      K.wall([[ex0,ez0],[ex1,ez0],[ex1,ez1],[ex0,ez1],[ex0,ez0]],{m:LS,h:10.5,t:4,hollow:true,crenel:false,gates:[[ex1,ez1-28,1.6,'djoserGate']]});
      for(let k=0;k*4.6<ex1-ex0;k++){ const xx=ex0+k*4.6; box(xx,y,ez0-1.6,xx+2.4,y+10.5,ez0,LS); box(xx,y,ez1,xx+2.4,y+10.5,ez1+1.6,LS); }
      for(let k=0;k*4.6<ez1-ez0;k++){ const zz=ez0+k*4.6; box(ex0-1.6,y,zz,ex0,y+10.5,zz+2.4,LS); box(ex1,y,zz,ex1+1.6,y+10.5,zz+2.4,LS); }
      /* the entrance colonnade: forty columns like bundled reeds, roofed, from the gate west into the court */
      K.hall(ex1-110,ez1-38,ex1-2,ez1-18,7,LS,{y,doors:[[ex1-2,ez1-28,1.6,5],[ex1-110,ez1-28,1.6,5]]});
      /* the great court south of the pyramid, its altar, and the south tomb along the south wall */
      api.top(x-100,z+62,x+100,ez1-44,'sand'); K.altar(x,z+80,6,1.4,LS);
      K.hall(x-90,ez1-60,x+60,ez1-46,8,LS,{y});
      /* the court of the jubilee: its chapels in a row on either side */
      for(let k=0;k<8;k++) for(const s of [-1,1]){ const cz=z-60+k*15; K.hall(x+s*90-6,cz-5,x+s*90+6,cz+5,7,LS,{y,doors:[[x+s*90-s*6,cz,1,4]]}); }
      api.mark('saqqara',ex1+30,ez1-28); }
    yield;
    /* and the pyramid of Unas beside it, and of Userkaf, smaller and of plain casing */
    /* (each course a ring of casing over the core, broad enough to reach under the course above it) */
    for(const [px,pz,b,h] of [[SQx-250,SQz+420,57,43],[SQx+260,SQz-330,73,49]]){ const y=K.sy(K.g(px,pz)), n=Math.round(h/3), L=[];
      for(let i=0;i<n;i++){ const w=b*(1-i/n)/2; if(w<1.5) break; L.push([K.sx(px-w),K.sx(pz-w),K.sx(px+w),K.sx(pz+w),K.sy(y+h*i/n),K.sy(y+h*(i+1)/n)]); }
      L.forEach((r,i)=>{ const q=L[i+1]; if(q&&q[2]-q[0]>3*M) K.carve([r[0],r[4]-(i?0:M),r[1],r[2],r[5],r[3]],[[q[0]+M,r[4],q[1]+M,q[2]-M,r[5],q[3]-M]],'hewn-stone'); else box(r[0],r[4],r[1],r[2],r[5],r[3],'hewn-stone'); }); }
  }
};
EARTH.ancient(DEF);
})();
