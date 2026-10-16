/* ================= NO-AMON, THE CITY OF AMUN (ROADMAP Phase D4) =================
   "Are you better than No-Amon, that sat by the rivers, the waters round about her?" (Naḥum 3:8): Waset
   of the hundred gates, Thebes of the Yawanim, on the east bank of the Nile. Her anchor is the house of
   Amun at Karnak, which world/wonders-true.js raises whole (its pylons, its great hall of columns, its
   obelisks, its sacred lake, its southern way of pylons and its quay with the rams); about it:
     · the Nile along her west side, some three hundred and sixty metres broad here, and the harbour of
       the god cut in from it to the quay before the first pylon;
     · the precinct of Mut south of the tenth pylon, her temple within its wall and the crescent lake
       Isheru about it, and the way of the rams between;
     · the way of the sphinxes, the dromos of Nectanebo, from the gate of Mut down to the house of Amun in
       the south, Ipet-resyt at Luxor (here some two kilometres, she being drawn a little closer than her
       three): its pylon of Ramesses with its two obelisks and its colossi, the court of Ramesses, the
       colonnade of Amenhotep's fourteen great columns, the court of Amenhotep, the hall and the shrine;
     · the town of Waset between them, houses of mud brick about their courts, her market by the dromos,
       and the palms and the fields of the valley along the river. */
(function(){
const NX=-430;                                                     /* the Nile's middle, west of the quay */
const LX=-170, LZ=1900;                                            /* Luxor: the face of its first pylon */
const MUT={x:48,z:640};
const DEF={
  n:'No-Amon', land:'Egypt', lat:25.7188, lon:32.6573, at:'The Temple of Karnak at No-Amon',
  square:[-120,1100], reach:1400, folk:96, style:'levant',
  ground:{
    level:[{x:-150,z:950,rx:760,rz:1650,blend:450,kind:'grass'}],
    waters:[
      {pts:[[NX+60,-3200],[NX,0],[NX-40,1500],[NX-120,3000],[NX-160,4600]],w:360,level:-3,depth:6},
      /* the crescent lake of Mut, about the south of her temple */
      {pts:[[MUT.x-90,MUT.z+20],[MUT.x-70,MUT.z+90],[MUT.x,MUT.z+120],[MUT.x+70,MUT.z+90],[MUT.x+90,MUT.z+20]],w:24,level:-1.8,depth:3}
    ],
    /* the harbour of the god, from the river to the quay of Karnak */
    pools:[[NX+150,-34,-216,34,-3,4]]
  },
  plan:function*(api){ const K=ANCIENT_KIT(api,DEF), box=K.box, hsh=K.hsh, M=K.MPB;
    const S='sandstone', MB='mudbrick', RG='red-granite', HS='hewn-stone', GOLD='gold-leaf', PL='plaster';
    /* ================= THE PRECINCT OF MUT ================= */
    { const x0=MUT.x-130, x1=MUT.x+130, z0=MUT.z-190, z1=MUT.z+170;
      K.wall([[x0,z0],[x1,z0],[x1,z1],[x0,z1],[x0,z0]],{m:MB,h:10,t:6,hollow:true,towers:0,gates:[[MUT.x,z0,6,'gateMut']],gm:S});
      const y=K.g(MUT.x,MUT.z);
      K.pylon('z',MUT.z-110,MUT.z-102,MUT.x,30,16,2.4,y,S);
      K.court(MUT.x-28,MUT.z-102,MUT.x+28,MUT.z-40,9,S,{y,t:2,pave:HS});
      for(const s of [-1,1]) for(let z=MUT.z-95;z<MUT.z-45;z+=6) K.round(MUT.x+s*20,z,y,y+7,0.9,S);
      K.hall(MUT.x-22,MUT.z-40,MUT.x+22,MUT.z+20,10,S,{y,doors:[[MUT.x,MUT.z-40,2,6]]});
      /* the statues of Sekhmet, row on row of black stone, about the court */
      for(let k=0;k<30;k++){ const x=MUT.x-60+(k%10)*12, z=MUT.z-160+Math.floor(k/10)*10; box(x-0.5,y,z-0.6,x+0.5,y+2.2,z+0.6,'basalt'); }
      api.mark('templeMut',MUT.x,MUT.z-118); }
    /* the way of the rams from the tenth pylon to the gate of Mut */
    for(let z=262;z<MUT.z-196;z+=5){ api.top(42,z,54,z+5,HS); for(const s of [-1,1]) K.sphinx(48+s*9,z+2.5,1,'z',true); }
    yield;

    /* ================= THE HARBOUR OF AMUN ================= */
    { const Q=DEF.ground.pools[0]; for(const z of [Q[1],Q[3]]) for(let x=Q[0]+40;x<Q[2];x+=3) box(x,-7,z-(z<0?M:0),x+3,0.9,z+(z<0?0:M),S);
      api.mark('quayAmun',-205,0); api.mark('harbourAmun',(Q[0]+Q[2])/2,0); }
    /* ================= THE WAY OF THE SPHINXES TO IPET-RESYT ================= */
    const dromos=[[MUT.x-130-20,MUT.z-180],[-60,1000],[LX,LZ-70]];
    { let run=0;
      for(let p=0;p+1<dromos.length;p++){ const [x0,z0]=dromos[p], [x1,z1]=dromos[p+1], L=Math.hypot(x1-x0,z1-z0), ux=(x1-x0)/L, uz=(z1-z0)/L;
        for(let s=0;s<L;s+=6){ const x=x0+ux*s, z=z0+uz*s; api.top(x-6,z-3.5,x+6,z+3.5,HS);
          if(((run+s)%6)<1) for(const sd of [-1,1]) K.sphinx(x+(-uz)*sd*9,z+ux*sd*9,1,'z',false); }
        run+=L; } }
    api.mark('dromos',-60,1000); api.mark('dromosNorth',MUT.x-150,MUT.z-180);
    yield;

    /* ================= IPET-RESYT, THE SOUTHERN HOUSE OF AMUN ================= */
    { const x=LX, z=LZ, y=K.g(x,z);
      /* before the pylon: the two obelisks of red granite, the two seated colossi and the standing ones */
      K.obelisk(x-14,z-40,25,2.5,RG); K.obelisk(x+14,z-40,22,2.4,RG);
      K.colossus(x-22,z-14,15,-1); K.colossus(x+22,z-14,15,-1);
      for(const s of [-1,1]) K.colossus(x+s*30,z-10,11,-1,'grey-stone');
      /* the first pylon of Ramesses, sixty-five metres broad, and his court of the double colonnade */
      K.pylon('z',z-8,z+6,x,32.5,24,3.2,y,S);
      K.court(x-30,z+6,x+30,z+60,11,S,{y,t:2,pave:HS});
      for(const s of [-1,1]) for(let zz=z+12;zz<z+56;zz+=6){ K.round(x+s*24,zz,y,y+9,1,S); K.round(x+s*18,zz,y,y+9,1,S); }
      /* the colonnade of Amenhotep: fourteen columns of open papyrus, nineteen metres, and its walls */
      for(const s of [-1,1]){ box(x+s*14,y-M,z+60,x+s*16,y+12,z+112,S); for(let zz=z+64;zz<z+110;zz+=7.2){ K.round(x+s*6,zz,y,y+17,1.6,S); box(x+s*6-2.3,y+17,zz-2.3,x+s*6+2.3,y+19,zz+2.3,S); } }
      box(x-8,y+19,z+60,x+8,y+20.6,z+112,S);
      /* the court of Amenhotep, its double rows of bundled columns about three sides */
      K.court(x-42,z+112,x+42,z+170,12,S,{y,t:2,pave:HS});
      for(let zz=z+116;zz<z+168;zz+=5.4) for(const s of [-1,1]) for(const d of [34,29]) K.round(x+s*d,zz,y,y+10,0.9,S);
      for(let xx=x-26;xx<=x+26;xx+=5.2) for(const d of [164,159]) K.round(xx,z+d,y,y+10,0.9,S);
      /* the hall of columns, the shrines and the sanctuary of the barque */
      K.hall(x-30,z+170,x+30,z+262,12,S,{y,doors:[[x,z+170,2.4,7]]});
      for(let k=0;k<4;k++) for(let j=0;j<8;j++) K.round(x-15+k*10,z+176+j*4.4,y,y+11,0.8,S);
      box(x-3,y,z+228,x+3,y+3,z+236,GOLD);
      /* its wall of mud brick about it all */
      K.wall([[x-90,z-70],[x+90,z-70],[x+90,z+290],[x-90,z+290],[x-90,z-70]],{m:MB,h:9,t:5,hollow:true,towers:0,gates:[[x,z-70,10,'luxorGate'],[x-90,z+140,5]]});
      api.mark('luxorPylon',x,z-24); api.mark('luxorCourt',x,z+30); api.mark('luxorColonnade',x,z+86); api.mark('luxorSanctuary',x,z+232); }
    yield;

    /* ================= THE TOWN OF WASET ================= */
    const SQ=DEF.square; api.top(SQ[0]-30,SQ[1]-26,SQ[0]+30,SQ[1]+26,'path'); api.mark('square',SQ[0],SQ[1]);
    const segD=(x,z)=>{ let b=1e9; for(let i=0;i+1<dromos.length;i++){ const [ax,az]=dromos[i], dx=dromos[i+1][0]-ax, dz=dromos[i+1][1]-az, t=Math.max(0,Math.min(1,((x-ax)*dx+(z-az)*dz)/(dx*dx+dz*dz))); b=Math.min(b,Math.hypot(x-ax-dx*t,z-az-dz*t)); } return b; };
    const free=(x,z,m)=>{ m=m||0;
      if(x<NX+215+m) return false;                                        /* (the bank and its palms) */
      if(segD(x,z)<16+m) return false;
      if(x>-160-m&&x<275+m&&z<268+m) return false;                         /* Karnak and its enclosure */
      if(x>MUT.x-136-m&&x<MUT.x+136+m&&z>MUT.z-196-m&&z<MUT.z+176+m) return false;
      if(x>LX-96-m&&x<LX+96+m&&z>LZ-76-m&&z<LZ+296+m) return false;
      if(Math.abs(x-SQ[0])<34+m&&Math.abs(z-SQ[1])<30+m) return false;
      if(x>420||z>2350) return false;
      return true; };
    K.quarter(SQ[0]-190,SQ[1]-220,SQ[0]+190,SQ[1]+220,19,(x,z)=>free(x,z,1),{w:7,wv:3});
    yield;
    K.quarter(-200,1400,300,1850,30,(x,z)=>free(x,z,1),{w:7,wv:3});
    K.quarter(-120,300,380,800,32,(x,z)=>free(x,z,1),{w:7,wv:3});
    yield;
    let nm=0;
    for(let bx=-200;bx<380;bx+=66) for(let bz=300;bz<2100;bz+=54){
      const x0=bx+5, x1=bx+56, z0=bz+5, z1=bz+44;
      if(![[x0,z0],[x1,z0],[x0,z1],[x1,z1],[(x0+x1)/2,(z0+z1)/2]].every(p=>free(p[0],p[1],3))) continue;
      if(Math.hypot((x0+x1)/2-SQ[0],(z0+z1)/2-SQ[1])<250) continue;
      if(hsh(bx*1.1,bz*0.9)<0.55) continue;                               /* (her gardens and her granaries' yards) */
      const courts=[]; for(let k=0;k<3;k++) courts.push([x0+8+hsh(bx+k,bz)*(x1-x0-16),z0+7+hsh(bz,bx+k)*(z1-z0-14),3.2,2.8]);
      K.hall(x0,z0,x1,z1,(hsh(bx,5)<0.4?7.4:4.6),MB,{courts,doors:[[(x0+x1)/2,z0,0.9,2.6],[(x0+x1)/2,z1,0.9,2.6]]});
      if(++nm%10===0) yield; }
    /* the palms and the fields along the river, and the palms of her gardens */
    for(let k=0;k<200;k++){ const z=-1500+hsh(k,9)*4500, x=NX+180+12+hsh(k,13)*70; K.palm(x,z,8+hsh(k,15)*5); if(k%60===59) yield; }
    for(let k=0;k<80;k++){ const x=-200+hsh(k,21)*600, z=300+hsh(k,23)*1900; if(free(x,z,6)&&Math.hypot(x-SQ[0],z-SQ[1])>50) K.palm(x,z,7+hsh(k,25)*4); }
    api.townGround([[-200,280],[400,280],[400,2300],[-200,2300]]);
    api.mark('nile',NX+190,800);
  }
};
EARTH.ancient(DEF);
})();
