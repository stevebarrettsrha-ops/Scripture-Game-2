/* ================= BAḆEL, AS NEḆUḴAḎNETSTSAR LEFT HER (ROADMAP Phase D4) =================
   "Is not this great Baḇel, that I have built?" (Dani'ĕl 4:30). The city of the plain of Shinʽar on the
   Furat, as she stood when Yahuḏah was carried there. Her anchor is the tower Etemenanki itself, which
   world/wonders-true.js raises by the Esagila tablet (91 m square, seven stages, its great stair to the
   south), and about it her plan, after the diggings of Koldewey and the tablets of her own scribes:
     · the Furat through her from north to south, some hundred and thirty metres broad, the old city on its
       east bank and the new on its west, both banks faced with quays of baked brick laid in bitumen, and
       the bridge of Naḇopolassar on its piers;
     · the double wall about the inner city: Imgur-Enlil within, six and a half metres thick, Nemetti-Enlil
       without it, the road of the chariots between, a tower every forty metres, and the moat beyond; her
       eight gates named for her gods. (She is drawn a little smaller than her two and a half kilometres,
       that she may be raised whole when the traveller comes: her works keep their own measure.)
     · the gate of Ishtar in the north wall, its two gateways one behind the other, faced with blue glazed
       brick and rows of bulls and dragons, and north of it the processional way between the walls of the
       lions, over the moat;
     · the processional way (Aj-ibur-shapu), twenty metres broad and paved with stone, south from the gate
       past the southern palace and the house of Ninmah, along the precinct of the tower, then west between
       the tower and Esagila to the bridge;
     · the precinct of Etemenanki, its wall and gates, and the storehouses and priests' houses along it;
     · Esagila, the house of Marduk, south of the tower: its court, its cella and its forecourt;
     · the southern palace about its five courts, the throne room of the glazed face on the great court,
       and in its north-east corner the vaulted building that may have borne the hanging gardens;
     · her quarters on straight streets: houses wall to wall about their courts, her market by the way,
       the houses of her other gods among them, and the palms of her gardens along the river. */
(function(){
const RX=-335;                                                     /* the Furat's middle, west of the tower */
const N=-860, S=560, Wt=-920, E=820;                               /* the inner wall (Imgur-Enlil) */
const O=18;                                                        /* Nemetti-Enlil, so far out from it */
const PW=300, PZ=175;                                              /* the processional way: south from the gate at x=PW, then west at z=PZ */
const DEF={
  n:'Baḇel', land:'Iraq', lat:32.5363, lon:44.4209, at:'Baḇal (Baḇylon) — Etemenanki',
  square:[560,-130], reach:1250, folk:96, style:'levant',
  ground:{
    level:[{x:-50,z:-150,rx:1250,rz:1050,blend:450}],
    waters:[
      {pts:[[RX+40,-2800],[RX+15,-1400],[RX,0],[RX+10,900],[RX-25,2800]],w:130,level:-2.8,depth:4.5},
      /* the moat about the double wall, fed from the river */
      {pts:[[RX,N-O-34],[E+O+34,N-O-34],[E+O+34,S+O+34],[Wt-O-34,S+O+34],[Wt-O-34,N-O-34],[RX,N-O-34]],w:36,level:-2.4,depth:3},
      /* the canal Libil-ḫegalla, west to east south of the palace */
      {pts:[[RX+60,-570],[-40,-570],[-40,-480],[E-50,-480]],w:10,level:-1.8,depth:2}
    ]
  },
  plan:function*(api){ const K=ANCIENT_KIT(api,DEF), box=K.box, hsh=K.hsh, M=K.MPB;
    const MB='mudbrick', BR='brick', GB='glazed-brick', HS='hewn-stone', GOLD='gold-leaf', ST='sandstone';
    const riverAt=z=>{ const P=DEF.ground.waters[0].pts; for(let i=0;i+1<P.length;i++) if(z>=P[i][1]&&z<=P[i+1][1]){ const t=(z-P[i][1])/(P[i+1][1]-P[i][1]); return P[i][0]+(P[i+1][0]-P[i][0])*t; } return RX; };
    const WR=65;                                                    /* the river's half-breadth */

    /* ================= THE DOUBLE WALL, ITS GATES AND ITS QUAYS ================= */
    const G={ishtar:PW, sin:-700, marduk:-350, zababa:260, enlil:200, urash:-640, shamash:-200, adad:330};
    for(const [d,t,h,tw,ev] of [[0,6.5,13,9,56],[O,3.7,9,7,80]]){
      const n=N-d, s=S+d, w=Wt-d, e=E+d, rn=riverAt(n), rs=riverAt(s), og=d>0;
      const o={m:BR,hollow:true,h,t,towers:ev,tw,th:4};
      K.wall([[rn+WR+6,n],[e,n],[e,s],[rs+WR+6,s]],Object.assign({},o,{gates:[[G.ishtar,n,og?5:6],[e,G.marduk,5],[e,G.zababa,5],[G.enlil,s,5]]}));
      yield;
      K.wall([[rs-WR-6,s],[w,s],[w,n],[rn-WR-6,n]],Object.assign({},o,{gates:[[G.urash,s,5],[w,G.shamash,5],[w,G.adad,5],[G.sin,n,5]]}));
      if(d===0) for(const [x,z] of [[e,n],[e,s],[w,s],[w,n]]) K.tower(x,z,13,13,h+7,BR);
      /* where the walls come down to the river they end in towers, and the river gates stand there */
      for(const [x,z] of [[rn+WR+6,n],[rn-WR-6,n],[rs+WR+6,s],[rs-WR-6,s]]) K.tower(x,z,tw+2,tw+2,h+5,BR);
      yield; }
    api.mark('gateMarduk',E+30,G.marduk); api.mark('gateEnlil',G.enlil,S+30); api.mark('gateShamash',Wt-30,G.shamash);
    /* the quays of the river within the walls: baked brick laid in bitumen, both banks, from the bed to a
       parapet at the street, and stairs down to the water every so often */
    for(const side of [-1,1]) for(let z=N+12;z<=S-12;z+=3){ const x=K.sx(riverAt(z)+side*(WR-0.5));
      box(side<0?x:x-M,-7.4,z-1.6,side<0?x+M:x,0.9,z+1.6,BR);
      if(Math.abs(z-PZ)>14&&((z-N)%150)<3) for(let k=0;k<7;k++) box(x-side*(1+k*0.8)-0.45,-3.2+k*0.5,z-2,x-side*(1+k*0.8)+0.45,-2.7+k*0.5,z+2,BR); }
    yield;

    /* ================= THE GATE OF ISHTAR, AND THE WAY OF THE LIONS ================= */
    { const x=PW, yI=K.g(x,N);
      /* the main gate in the inner wall: two great towers either side of the passage, and the outer gate in
         the outer wall before it; blue glazed brick, the bulls of Adad and the dragons of Marduk in rows */
      for(const [z0,z1,hg,hw] of [[N-4.5,N+18,25,17],[N-O-3,N-O+3.5,15,12]]){
        for(const s of [-1,1]){ K.hall(x+s*4.2,z0,x+s*hw,z1,hg,GB,{y:yI,parapet:false});
          for(let k=0;k<3;k++){ const yy=yI+2.5+k*(hg-6)/3;                                    /* the rows of beasts */
            for(let u=x+s*5.4;Math.abs(u-x)<hw-1;u+=s*2.8){ box(u-0.6,yy,z0-0.4,u+0.6,yy+1.5,z0,k%2?ST:GOLD); box(u-0.6,yy,z1,u+0.6,yy+1.5,z1+0.4,k%2?ST:GOLD); } }
          for(let u=x+s*4.8;Math.abs(u-x)<hw;u+=s*1.85) box(u-0.46,yI+hg,z0,u+0.46,yI+hg+1.4,z0+0.9,GB); }       /* its stepped merlons */
        box(x-4.2,yI+Math.min(hg-4,12),z0,x+4.2,yI+hg,z1,GB);                                    /* over the arch */
        box(x-4.2,yI+Math.min(hg-4,12)-0.6,z0,x+4.2,yI+Math.min(hg-4,12),z1,GOLD); }
      api.top(x-4.2,N-O-3,x+4.2,N+18,HS);
      api.mark('ishtarGate',x,N+26); api.mark('ishtarOut',x,N-O-14);
      /* the way of the lions north of the gate, across the moat to the outer town: walls of blue brick with
         lions of yellow brick striding toward the gate */
      box(x-10,-3.6,N-O-54,x+10,0,N-O-14,BR);                                                  /* (the causeway over the moat) */
      for(let z=N-O-8;z>N-O-230;z-=3){ api.top(x-10,z-3,x+10,z,HS);
        for(const s of [-1,1]){ const gy=K.g(x+s*12.5,z); box(K.sx(x+s*12.5)-(s<0?0:M),gy-M,z-3,K.sx(x+s*12.5)+(s<0?M:0),gy+7,z,GB,{foot:true});
          if(((z-N)%9)<3) box(x+s*11.9-0.25,gy+2.2,z-2.6,x+s*11.9+0.25,gy+3.6,z-0.4,ST); } }
      api.mark('lionWay',x,N-O-120); }
    yield;

    /* ================= THE PROCESSIONAL WAY ================= */
    K.street([[PW,N+18],[PW,PZ]],20,HS); K.street([[PW+10,PZ],[riverAt(PZ)+WR,PZ]],20,HS);
    for(let z=N+20;z<PZ-12;z+=6){ box(PW-10.6,0,z,PW-10,0.45,z+6,'red-granite'); box(PW+10,0,z,PW+10.6,0.45,z+6,'red-granite'); }   /* its kerbs */
    /* the wall of blue brick along the palace side, its lions striding south */
    for(let z=N+24;z<-662;z+=3){ box(K.sx(PW-14),-M,z,K.sx(PW-14)+M,8,z+3,GB); if(((z-N)%9)<3) box(PW-13.6,2.6,z+0.3,PW-13.2,4.1,z+2.6,ST); }
    /* the bridge of Naḇopolassar: piers of baked brick in the river, a deck of cedar and palm */
    { const rx=riverAt(PZ); K.bridge(rx+WR+2,PZ,rx-WR-2,PZ,11,0.2,-7.3,BR); api.mark('bridge',rx,PZ); }
    yield;

    /* ================= THE PRECINCT OF ETEMENANKI ================= */
    { const x0=-205, x1=205, z0=-225, z1=150;
      K.wall([[x0,z0],[x1,z0],[x1,z1],[x0,z1],[x0,z0]],{m:MB,h:7,t:3,towers:24,tw:5,th:2,gates:[[0,z1,8],[x1,-40,5],[x1,90,5],[x0,-40,5],[0,z0,5]],gm:BR});
      /* the storehouses and the houses of the priests along its walls */
      for(let x=x0+8;x<x1-20;x+=26){ if(Math.abs(x+10)<20) continue; K.hall(x,z0+3,x+20,z0+19,4.6,MB,{doors:[[x+10,z0+19]]}); K.hall(x,z1-19,x+20,z1-3,4.6,MB,{doors:[[x+10,z1-19]]}); }
      for(let z=z0+30;z<z1-40;z+=26){ if(Math.abs(z+50)<20||Math.abs(z-80)<20) continue; K.hall(x0+3,z,x0+19,z+20,4.6,MB,{doors:[[x0+19,z+10]]}); K.hall(x1-19,z,x1-3,z+20,4.6,MB,{doors:[[x1-19,z+10]]}); }
      api.mark('etemenanki',0,112); api.mark('precinct',-120,-150); api.mark('precinctGate',0,z1+12); }
    yield;

    /* ================= ESAGILA, THE HOUSE OF MARDUK ================= */
    { const cx=-45, cz=265;
      const y=K.court(cx-43,cz-39,cx+43,cz+40,12,BR,{t:3,rooms:13,door:'e',pave:HS});
      for(const [x,z] of [[cx-43,cz-39],[cx+43,cz-39],[cx-43,cz+40],[cx+43,cz+40]]) K.tower(x,z,9,9,17,BR);
      for(const z of [cz-39,cz+40]) for(let x=cx-38;x<cx+40;x+=5) box(x-0.7,y,z-0.6,x+0.7,y+11.5,z+0.6,BR);      /* the buttresses */
      /* the cella of Marduk on the west of the court, and his dais of gold */
      K.hall(cx-27,cz-12,cx-13,cz+12,14,BR,{y,doors:[[cx-13,cz,2.4,7]]}); box(cx-25,y,cz-2.5,cx-23,y+2.8,cz+2.5,GOLD);
      /* the forecourt to the east, its gate toward the processional way */
      K.court(cx+43,cz-46,cx+150,cz+46,8,MB,{t:2.5,door:'n',pave:'path'});
      K.altar(cx+95,cz,6,1.6,HS);
      api.mark('esagila',cx+60,cz); api.mark('esagilaGate',cx+96,cz-54); api.mark('marduk',cx-6,cz); }
    yield;

    /* ================= THE SOUTHERN PALACE ================= */
    { const x0=-200, x1=PW-17, z0=N+12, z1=-655;
      const y=K.court(x0,z0,x1,z1,14,BR,{t:4,door:'e'});
      /* its five courts in a row, west to east, the ranges of rooms about each */
      const cuts=[x0+4,x0+92,x0+192,x0+302,x0+386,x1-4];
      for(let k=0;k+1<cuts.length;k++){ const a=cuts[k], b=cuts[k+1];
        K.hall(a,z0+4,b,z0+30,10,BR,{y,doors:[[(a+b)/2,z0+30]],parapet:false});
        if(k!==2) K.hall(a,z1-58,b,z1-4,10,BR,{y,doors:[[(a+b)/2,z1-58]],courts:[[(a+b)/2,z1-30,10,8]],parapet:false});
        if(k>0) K.hall(a,z0+30,a+14,z1-58,10,BR,{y,doors:[[a+14,(z0+z1)/2-14]],parapet:false});
        api.top(a+(k>0?14:0),z0+30,b,z1-58,HS); }
      /* the throne room on the south side of the great court: 52 by 17 metres, its face of blue glazed brick
         with palms of yellow upon it, its three doors and the dais of the throne */
      { const tx=x0+247, tz=z1-58;
        K.hall(tx-26,tz,tx+26,tz+17,18,BR,{y,doors:[[tx-12,tz,2.2,6],[tx,tz,2.6,9],[tx+12,tz,2.2,6]]});
        box(tx-26,y+1,tz-0.5,tx+26,y+16,tz,GB);
        for(const u of [-12,0,12]) box(tx+u-(u?2.2:2.6),y,tz-0.6,tx+u+(u?2.2:2.6),y+(u?6:9),tz+0.1,'air');
        for(let u=-23;u<=23;u+=4.6) if(Math.abs(Math.abs(u)-12)>3&&Math.abs(u)>3) box(tx+u-0.4,y+3,tz-0.8,tx+u+0.4,y+12,tz-0.5,ST);
        box(tx-3,y,tz+12.5,tx+3,y+1.4,tz+15,GOLD);
        api.mark('throneRoom',tx,tz+8); api.mark('palaceCourt',tx,tz-40); }
      /* the vaulted building in its north-east corner, and the gardens on its terraces */
      { const gx0=x1-84, gx1=x1-8, gz0=z0+34, gz1=z0+96;
        for(let k=0;k<3;k++){ const ins=k*9; K.hall(gx0+ins,gz0+ins,gx1-ins,gz1-ins,6+k*6,BR,{y,roof:'grass',parapet:k===2});
          for(let a=gx0+ins+4;a<gx1-ins-3;a+=7) for(const b of [gz0+ins+3.5,gz1-ins-3.5]) K.tree(a,b,3.5+hsh(a,b)*2,'olive'); }
        for(let a=gx0+32;a<gx1-28;a+=7) K.palm(a,(gz0+gz1)/2,5+hsh(a,1)*3);
        api.mark('gardens',(gx0+gx1)/2,gz1+8); }
      api.mark('palace',x0+200,z1+12); api.mark('palaceGate',x1+10,(z0+z1)/2); }
    yield;

    /* ================= THE HOUSES OF HER OTHER GODS ================= */
    const shrine=(cx,cz,w,d,name,door)=>{ const y=K.court(cx-w/2,cz-d/2,cx+w/2,cz+d/2,9,MB,{t:2.5,rooms:8,door:door||'n',pave:'path'});
      const f=door==='w'||door==='e';
      for(let k=-w/2+2;k<w/2;k+=4) for(const s of [-1,1]) if(f) box(cx+s*w/2-0.5,y,cz+k*d/w-0.6,cx+s*w/2+0.5,y+8.6,cz+k*d/w+0.6,MB); else box(cx+k-0.6,y,cz+s*d/2-0.5,cx+k+0.6,y+8.6,cz+s*d/2+0.5,MB);
      K.hall(cx-6,cz-6,cx+6,cz+6,11,MB,{y,doors:[[cx,door==='s'?cz+6:cz-6,1.6,5]]});
      api.mark(name,door==='w'?cx-w/2-8:door==='e'?cx+w/2+8:cx,door==='w'||door==='e'?cz:door==='s'?cz+d/2+8:cz-d/2-8); };
    shrine(PW+48,N+44,54,37,'templeNinmah','w');
    shrine(620,-420,60,44,'templeIshtar','n');
    shrine(520,420,58,46,'templeNinurta','n');
    shrine(-700,-330,50,40,'templeWest','e');
    shrine(-120,470,44,36,'templeGula','n');
    yield;

    /* ================= HER STREETS AND HER QUARTERS ================= */
    const NSs=[80,560,760], EWs=[-600,-300,-130,400];               /* her straight streets, named for her gods */
    const SQ=DEF.square; api.top(SQ[0]-34,SQ[1]-28,SQ[0]+34,SQ[1]+28,HS); api.mark('square',SQ[0],SQ[1]); api.mark('market',SQ[0],SQ[1]+20);
    const busy=[[-205,-225,205,150],[-90,220,210,320],[-200,N+8,PW-12,-650],[PW+18,N+22,PW+78,N+66],[585,-447,655,-393],[486,392,554,448],[-730,-355,-670,-305],[-146,448,-94,492],
                [SQ[0]-38,SQ[1]-32,SQ[0]+38,SQ[1]+32]];
    const canal=DEF.ground.waters[2].pts;
    const free=(x,z,m)=>{ m=m||0; if(Math.abs(x-PW)<16+m&&z<PZ+16) return false; if(Math.abs(z-PZ)<16+m&&x<PW+16&&x>riverAt(PZ)) return false;
      if(NSs.some(s=>Math.abs(x-s)<8+m)||EWs.some(s=>Math.abs(z-s)<8+m)) return false;
      if(Math.abs(x+560)<8+m||(Math.abs(z+200)<8+m&&x<0)||(Math.abs(z-G.marduk)<8+m&&x>0)||(Math.abs(x-G.enlil)<8+m&&z>PZ)) return false;
      if(x<Wt+28||x>E-28||z<N+28||z>S-28) return false;               /* (the wall's own road within it) */
      const rx=riverAt(z); if(Math.abs(x-rx)<WR+16+m) return false;
      for(let i=0;i+1<canal.length;i++){ const ax=canal[i][0], az=canal[i][1], dx=canal[i+1][0]-ax, dz=canal[i+1][1]-az, t=Math.max(0,Math.min(1,((x-ax)*dx+(z-az)*dz)/(dx*dx+dz*dz)));
        if(Math.hypot(x-ax-dx*t,z-az-dz*t)<11+m) return false; }
      return !busy.some(b=>x>b[0]-8-m&&x<b[2]+8+m&&z>b[1]-8-m&&z<b[3]+8+m); };
    /* the houses of the folk about the square and down the streets from it */
    K.quarter(SQ[0]-150,SQ[1]-200,SQ[0]+170,SQ[1]+200,19,(x,z)=>free(x,z,1),{w:7,wv:3});
    yield;
    K.quarter(-180,-560,250,-300,27,(x,z)=>free(x,z,1)&&!(x>-215&&x<215&&z>-235),{w:7,wv:3});
    K.quarter(320,200,780,520,30,(x,z)=>free(x,z,1),{w:7,wv:3});
    K.quarter(-860,-500,-470,300,40,(x,z)=>free(x,z,1),{w:7,wv:3});
    yield;
    /* and the rest of her old city, close-built: each block between her streets house wall to house wall,
       flat-roofed, its courts open to the sky and its doors on the lanes */
    const mass=(x0,z0,x1,z1,seed)=>{ const courts=[], doors=[];
      for(let k=0;k<3;k++) courts.push([x0+9+hsh(seed+k,z0)*(x1-x0-18),z0+8+hsh(z0,seed+k)*(z1-z0-16),3.5,3]);
      for(let k=0;k<3;k++){ const dx=x0+7+k*(x1-x0-14)/2; doors.push([dx,z0,0.9,2.6]); doors.push([dx,z1,0.9,2.6]); }
      K.hall(x0,z0,x1,z1,4.6+Math.floor(hsh(seed,1)*3)*M,MB,{courts,doors}); };
    let nm=0;
    for(let bx=-240;bx<E-40;bx+=76) for(let bz=N+40;bz<S-40;bz+=60){
      const x0=bx+6, x1=bx+62, z0=bz+6, z1=bz+48, mx=(x0+x1)/2, mz=(z0+z1)/2;
      if(!free(mx,mz,0)||!free(x0,z0)||!free(x1,z1)||!free(x0,z1)||!free(x1,z0)) continue;
      if(Math.hypot(mx-SQ[0],mz-SQ[1])<230) continue;                  /* (the folk's own houses stand there) */
      if(x0>-215&&x1<250&&z0>-560&&z1<-300) continue;
      if(x0>300&&z0>190) continue;
      if(hsh(bx*0.7,bz*1.3)<0.3) continue;                             /* (a garden of palms, a yard of a temple) */
      mass(x0,z0,x1,z1,bx+bz); if(++nm%8===0) yield; }
    yield;
    /* the new city across the river: her blocks and her gardens */
    for(let bx=Wt+40;bx<-460;bx+=72) for(let bz=N+40;bz<S-40;bz+=58){
      const x0=bx+6, x1=bx+60, z0=bz+6, z1=bz+48, mx=(x0+x1)/2, mz=(z0+z1)/2;
      if(!free(mx,mz,0)||!free(x0,z0)||!free(x1,z1)||!free(x0,z1)||!free(x1,z0)) continue;
      if(hsh(bx,bz)<0.7) continue;
      mass(x0,z0,x1,z1,bx*3+bz); }
    yield;
    /* her ground within the walls is trodden; the palms of her gardens by the river and in her empty blocks */
    api.townGround([[Wt,N],[E,N],[E,S],[Wt,S]]);
    for(let k=0;k<170;k++){ const z=(k<85?N-O-70-hsh(k,3)*900:S+O+70+hsh(k,3)*900), side=hsh(k,7)<0.5?-1:1, x=riverAt(z)+side*(WR+10+hsh(k,11)*170);
      K.palm(x,z,8+hsh(k,13)*5); }
    for(let k=0;k<70;k++){ const x=Wt+40+hsh(k,21)*(E-Wt-80), z=N+40+hsh(k,23)*(S-N-80); if(free(x,z,6)&&Math.hypot(x-SQ[0],z-SQ[1])>60) K.palm(x,z,7+hsh(k,25)*4); }
    api.mark('river',riverAt(0)+WR+10,0);
  }
};
EARTH.ancient(DEF);
})();
