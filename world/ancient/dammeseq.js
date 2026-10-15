/* ================= DAMMESEQ, ON THE BARADA (ROADMAP Phase D4) =================
   "Arise and go to the street called Straight, and seek in the house of Yahuḏah one called Sha'ul of
   Tarsos" (Ma'asei 9:11). The oldest of the cities, on the plain at the foot of Qasiyun where the Barada
   comes out of the Anti-Leḇanon and is spent in the orchards of the Ghouta; as she stood in the first
   century, a city of Rome laid out on the old one, after Sauvaget, Watzinger and Wulzinger:
     · her wall about the old city, some fifteen hundred metres from east to west and eight hundred from
       north to south, its corners rounded, its gates: the eastern gate of three arches where the Straight
       street goes out, the gate of Jabiya where it comes in on the west, the gate of Thomas, the gate of
       Kisan where Sha'ul was let down by the wall in a basket (Ma'asei 9:25), the little gate on the
       south, and the gates of Paradise and of Peace on the north toward the river;
     · the street called Straight from the gate of Jabiya to the eastern gate, twenty-six metres from
       house to house with its porticoes on either hand, and the arch where it bends;
     · the house of Hadad-Jupiter, her god: the outer precinct some three hundred and eighty metres by three
       hundred with its markets, the inner precinct of a hundred and fifty by a hundred with its towers at
       the corners, its gateways east and west, the god's house in the midst;
     · the theatre south of the street, the citadel at the north-west corner;
     · the Barada along her north wall, its channels and its gardens, and her houses about their courts on
       their lanes; the house of Yahuḏah on the Straight, and the house of Ḥananyah near the eastern gate. */
(function(){
const W0=-650, E0=900, N0=-250, S0=470, SZ=330;                    /* her walls; the Straight's line */
const DEF={
  n:'Dammeseq', land:'Syria', lat:33.5115, lon:36.3066,
  square:[330,100], reach:1000, folk:90, style:'levant',
  ground:{
    level:[{x:120,z:110,rx:1000,rz:560,blend:320}],
    waters:[{pts:[[-1800,-380],[-900,-330],[-300,-300],[300,-310],[1000,-290],[1800,-250]],w:24,level:-2,depth:2.5},
            {pts:[[-900,-330],[-700,-520],[-200,-560],[500,-520],[1200,-480]],w:9,level:-1.5,depth:1.6}]
  },
  plan:function*(api){ const K=ANCIENT_KIT(api,DEF), box=K.box, hsh=K.hsh, M=K.MPB;
    const HS='hewn-stone', ST='stone', BA='basalt', PL='plaster', MAR='marble', MB='mudbrick', GOLD='gold-leaf';
    /* ================= HER WALL AND HER GATES ================= */
    const R=40, ring=[[W0+R,N0],[E0-R,N0],[E0,N0+R],[E0,S0-R],[E0-R,S0],[W0+R,S0],[W0,S0-R],[W0,N0+R],[W0+R,N0]];
    K.wall(ring,{m:HS,h:12,t:4.5,hollow:true,towers:46,tw:9,th:5,gates:[[E0,SZ,9,'gateEast'],[W0,SZ,6,'gateJabiya'],[620,N0,5,'gateThomas'],[560,S0,4,'gateKisan'],[100,S0,5,'gateSmall'],[-150,N0,5,'gateParadise'],[260,N0,5,'gatePeace']]});
    /* the eastern gate's three arches: the great one for the street and a lesser either side */
    { const y=K.g(E0,SZ); for(const s of [-1,1]) box(E0-4,y,SZ+s*3.6,E0+4,y+11,SZ+s*5,HS); box(E0-4,y+8.5,SZ-9,E0+4,y+13,SZ+9,HS); api.mark('gateEastOut',E0+40,SZ); }
    /* the window in the wall by the gate of Kisan, whence they let him down in a basket */
    api.mark('basketWall',575,S0+6); api.mark('gateJabiyaOut',W0-40,SZ);
    yield;
    /* ================= THE STREET CALLED STRAIGHT ================= */
    K.street([[W0+6,SZ],[E0-6,SZ]],14,BA);
    for(const s of [-1,1]){ for(let x=W0+12;x<E0-12;x+=5){ const z=SZ+s*8.5; if(Math.abs(x-300)<10) continue; box(x-0.45,0,z-0.45,x+0.45,6,z+0.45,MAR); }
      box(W0+10,6,SZ+s*8.1,E0-10,6.8,SZ+s*13,'roof-tile'); for(let x=W0+10;x<E0-10;x+=3) box(x,0,K.sx(SZ+s*13),x+3,6,K.sx(SZ+s*13)+s*M,PL); }
    /* the arch where the street bends, of four piers */
    { const y=K.g(300,SZ); for(const s of [-1,1]) for(const t of [-1,1]) box(300+s*7-2,y,SZ+t*7-2,300+s*7+2,y+11,SZ+t*7+2,MAR); box(293,y+9,SZ-9,307,y+13,SZ+9,MAR); api.mark('arch',300,SZ-14); }
    api.mark('straight',-200,SZ); api.mark('straightEast',700,SZ);
    yield;
    /* ================= THE HOUSE OF HADAD-JUPITER ================= */
    { /* the outer precinct, its walls and the markets along them */
      K.wall([[-190,-160],[190,-160],[190,150],[-190,150],[-190,-160]],{m:HS,h:8,t:2.5,towers:0,crenel:false,gates:[[190,0,7,'propylaeaEast'],[-190,0,6,'propylaeaWest'],[0,150,6]]});
      for(let x=-180;x<180;x+=12){ if(Math.abs(x)<14) continue; K.hall(x,-156,x+10,-146,4.6,HS,{doors:[[x+5,-146]]}); K.hall(x,140,x+10,150-1.2,4.6,HS,{doors:[[x+5,140]]}); }
      /* the inner precinct and its towers, its porticoes within */
      const y=K.court(-75,-50,75,50,11,HS,{t:2.5,door:'e',pave:MAR});
      for(const [x,z] of [[-75,-50],[75,-50],[-75,50],[75,50]]) K.tower(x,z,8,8,18,HS);
      K.cols(-68,-43,68,-43,y,9,4.5,0.5,MAR); K.cols(-68,43,68,43,y,9,4.5,0.5,MAR);
      /* the propylaeum of the east, its columns and its pediment */
      for(let z=-14;z<=14;z+=5.6) K.round(84,z,y,y+14,0.9,MAR); box(80,y+14,-17,90,y+16,17,MAR); K.gable('z',80,90,-17,17,y+16,4,5,MAR);
      /* the god's house in the midst */
      K.temple(0,0,46,26,{dir:'e',podium:3,colH:12,m:MAR});
      api.mark('templeHadad',95,0); api.mark('templeCourt',30,30); api.mark('agoraDammeseq',150,110); }
    yield;
    /* ================= THE THEATRE, AND THE CITADEL ================= */
    { const cx=-260, cz=SZ+80, r=48, y=K.g(cx,cz);
      /* its cavea of stone in a half ring facing north to the stage, its stage building */
      for(let k=0;k<10;k++){ const rr=r-k*3.6, hh=1+k*0.9; for(let a=0;a<=12;a++){ const t=Math.PI*(a/12), x=cx+Math.cos(t)*rr, z=cz+Math.sin(t)*rr*0.85; box(x-2.2,y,z-1.8,x+2.2,y+hh,z+1.8,HS); } }
      box(cx-r,y,cz-14,cx+r,y+12,cz-10,HS); box(cx-r+6,y,cz-10,cx+r-6,y+1.2,cz-4,HS);
      api.mark('theatre',cx,cz-20); }
    { const y=K.court(W0+30,N0+20,W0+160,N0+130,12,HS,{t:3,rooms:12,door:'s',pave:ST}); K.tower(W0+30,N0+20,14,14,18,HS); K.tower(W0+160,N0+20,12,12,16,HS); api.mark('citadel',W0+95,N0+140); }
    yield;
    /* ================= THE HOUSES OF THE STREET, AND HER QUARTERS ================= */
    const SQ=DEF.square; api.top(SQ[0]-32,SQ[1]-28,SQ[0]+32,SQ[1]+28,HS); api.mark('square',SQ[0],SQ[1]);
    K.street([[SQ[0],SQ[1]+28],[SQ[0],SZ-14]],7,BA); K.street([[620,N0+6],[620,SZ-14]],7,BA); K.street([[100,SZ+14],[100,S0-6]],7,BA); K.street([[560,SZ+14],[560,S0-6]],6,BA);
    const free=(x,z,m)=>{ m=m||0;
      if(x<W0+22||x>E0-22||z<N0+22||z>S0-22) return false;
      if(Math.abs(z-SZ)<16+m) return false;
      if(x>-196-m&&x<196+m&&z>-166-m&&z<156+m) return false;
      if(x>W0+24-m&&x<W0+166+m&&z<N0+136+m) return false;
      if(Math.hypot(x+260,z-SZ-80)<58+m&&z>SZ) return false;
      if(Math.abs(x-SQ[0])<36+m&&Math.abs(z-SQ[1])<32+m) return false;
      if(Math.abs(x-SQ[0])<6+m&&z>SQ[1]&&z<SZ||Math.abs(x-620)<6+m&&z<SZ||Math.abs(x-100)<6+m&&z>SZ||Math.abs(x-560)<5+m&&z>SZ) return false;
      return true; };
    /* the houses about the square and along the Straight on either hand */
    K.quarter(SQ[0]-120,SQ[1]-120,SQ[0]+230,SQ[1]+330,17,(x,z)=>free(x,z,1),{w:7,wv:3});
    yield;
    K.quarter(-560,180,-60,420,22,(x,z)=>free(x,z,1),{w:7,wv:3});
    let nm=0;
    for(let bx=W0+30;bx<E0-40;bx+=52) for(let bz=N0+30;bz<S0-30;bz+=44){
      const x0=bx+4, x1=bx+46, z0=bz+4, z1=bz+38;
      if(![[x0,z0],[x1,z0],[x0,z1],[x1,z1],[(x0+x1)/2,(z0+z1)/2]].every(p=>free(p[0],p[1],2))) continue;
      if((x0+x1)/2>SQ[0]-130&&(x0+x1)/2<SQ[0]+240&&(z0+z1)/2>SQ[1]-130&&(z0+z1)/2<SQ[1]+340) continue;
      if((x0+x1)/2>-570&&(x0+x1)/2<-50&&(z0+z1)/2>170&&(z0+z1)/2<430) continue;
      if(hsh(bx,bz)<0.25) continue;
      const courts=[]; for(let k=0;k<2;k++) courts.push([x0+8+hsh(bx+k,bz)*(x1-x0-16),z0+7+hsh(bz,bx+k)*(z1-z0-14),3.6,3.2]);
      K.hall(x0,z0,x1,z1,(hsh(bx,9)<0.5?7.4:4.6),hsh(bz,bx)<0.5?PL:MB,{courts,doors:[[(x0+x1)/2,z0,0.9,2.6],[(x0+x1)/2,z1,0.9,2.6]]});
      if(++nm%12===0) yield; }
    api.mark('houseJudas',40,SZ+18); api.mark('houseAnanias',780,SZ-40);
    yield;
    /* ================= THE BARADA AND THE ORCHARDS OF THE GHOUTA ================= */
    for(const x of [-150,260]){ const z=-305; K.bridge(x,z-15,x,z+15,7,0.3,-4.5,HS); }
    for(let k=0;k<180;k++){ const x=-1500+hsh(k,1)*3200, z=(k%2?-650:S0+40)+hsh(k,2)*(k%2?300:420); K.tree(x,z,3.5+hsh(k,3)*2.5,k%3?'olive':null); if(k%60===59) yield; }
    for(let k=0;k<60;k++){ const x=-1200+hsh(k,4)*2600, z=-380-hsh(k,5)*120; K.cypress(x,z,8+hsh(k,6)*5); }
    api.townGround(ring);
  }
};
EARTH.ancient(DEF);
})();
