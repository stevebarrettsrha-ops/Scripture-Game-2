/* ================= TSIDON, THE FIRSTBORN OF KENAʽAN (ROADMAP Phase D4) =================
   "Kenaʽan brought forth Tsidon his firstborn" (Berĕshith 10:15); "the merchants of Tsidon, who cross the
   sea" (Yeshayahu 23:2), where Sha'ul was let go ashore to his friends (Ma'asei 27:3). The harbour city
   on her low cape on the coast of the land, north of Tsor, as she stood in the days of the Persians and
   of Rome, after the work of Contenau and of the British Museum since:
     · her cape running out into the sea, and the islet off its north-west point, on which the sea castle
       stood (in her own days the tower of her harbour), joined to the cape by a causeway on arches;
     · the north harbour, "the closed harbour", in the bay between the cape and the reef, its mole out
       from the islet and its mouth to the east; the south harbour in the round bay beyond the cape;
     · her walls on the land side and along the sea, her gates; the acropolis on its mound in the south-
       east of the city, where the castle of the land was built after;
     · her houses close and tall on narrow lanes, her market by the north harbour;
     · north of the city by the river, the house of Eshmun on its terraces and its great podium;
     · and south of the city, the strand where the purple-shell mound grew (left clear for the dyers),
       and the ground by the south harbour kept for the glass furnaces of the sand of the Belus. */
(function(){
const CAPE=[[-600,-340],[-690,-340],[-730,-300],[-735,-170],[-700,-110],[-600,-100]];
const ISLET=[[-800,-385],[-745,-385],[-735,-355],[-740,-290],[-805,-290],[-815,-335]];
const CAUSE=[[-745,-342],[-725,-342],[-725,-326],[-745,-326]];
const C={x0:-610,x1:-150,z0:-430,z1:120};                          /* her walls about the city */
const ACR={x:-250,z:40,rx:95,rz:85,h:22};
const DEF={
  n:'Tsidon', land:'Lebanon', lat:33.5665, lon:35.3640, base:5, coast:true,
  square:[-310,-130], reach:1300, folk:80, style:'levant',
  ground:{
    level:[{x:-430,z:-150,rx:420,rz:340,blend:160}],
    /* (and the hollows the earth's coarse heights leave in the coastal plain about her, which are no sea, filled) */
    land:[CAPE,ISLET,CAUSE,{y:1.8,pts:[[-90,-920],[220,-920],[220,-530],[-90,-530]]},{y:4.6,pts:[[420,-420],[560,-420],[560,-230],[420,-230]]},
          {y:4.6,pts:[[370,-230],[520,-230],[520,-70],[370,-70]]},{y:3.7,pts:[[630,-860],[745,-860],[745,-730],[630,-730]]},{y:5.5,pts:[[655,505],[810,505],[810,660],[655,660]]},
          {y:4.6,pts:[[620,-1150],[730,-1150],[730,-1010],[620,-1010]]}],
    hills:[[ACR.x,ACR.z,ACR.h,ACR.rx,ACR.rz,0.4,'grass']]
  },
  plan:function*(api){ const K=ANCIENT_KIT(api,DEF), box=K.box, hsh=K.hsh, M=K.MPB;
    const HS='hewn-stone', ST='stone', PL='plaster', MAR='marble', GOLD='gold-leaf';
    const SEA=-4.6;                                                       /* the face of the sea, over her base */
    /* ================= THE SEA CASTLE ON ITS ISLET, AND THE CAUSEWAY ================= */
    { const y=0; K.court(-800,-380,-748,-296,10,HS,{y,t:2.5,door:'e',pave:ST});
      K.tower(-775,-366,14,14,22,HS); K.tower(-770,-310,12,12,18,HS);
      for(const [x,z] of [[-800,-380],[-748,-380],[-800,-296],[-748,-296]]) box(x-3,SEA-6,z-3,x+3,y,z+3,HS);
      /* the causeway: its piers in the water, its arches of hewn stone, its road over */
      for(let x=-746;x<=-724;x+=5.5) box(x-1.4,SEA-6,-344,x+1.4,y-0.6,-324,HS);
      box(-748,y-1.8,-342,-722,y,-326,HS);
      api.mark('seaCastle',-774,-338); api.mark('causeway',-735,-334); }
    /* ================= THE NORTH HARBOUR ================= */
    { /* the mole out from the islet, north and then east, the mouth left between it and the shore */
      box(-812,SEA-6,-560,-798,SEA+5,-380,HS); box(-812,SEA-6,-572,-650,SEA+5,-558,HS);
      K.tower(-650,-565,9,9,13,HS,{solid:true});
      /* the quay along the city's shore, and the cape's north face */
      for(let z=-560;z<-345;z+=4) box(K.sx(-600)-M,SEA-4,z,K.sx(-600),0.6,z+4,HS);
      for(let x=-735;x<-600;x+=4) box(x,SEA-4,K.sx(-342)-M,x+4,0.6,K.sx(-342),HS);
      api.mark('harbourNorth',-690,-460); api.mark('harbourMouth',-625,-575); }
    /* ================= THE SOUTH HARBOUR ================= */
    { box(-720,SEA-6,10,-706,SEA+4.5,170,HS); box(-720,SEA-6,170,-560,SEA+4.5,184,HS);
      K.tower(-713,10,9,9,12,HS,{solid:true});
      api.mark('harbourSouth',-600,60); }
    yield;
    /* ================= HER WALLS ================= */
    { const W={m:HS,h:13,t:4,towers:45,tw:8,th:5};
      K.wall([[C.x0,C.z0],[C.x1,C.z0],[C.x1,C.z1],[-480,C.z1],[-560,-20],[-600,-100]],Object.assign({},W,{gates:[[-380,C.z0,5,'gateNorth'],[C.x1,-150,5,'gateEast'],[-320,C.z1,5,'gateSouth']]}));
      K.wall([[-600,-340],[-600,C.z0],[C.x0,C.z0]],Object.assign({},W,{h:11,gates:[[-600,-400,5,'gateHarbour']]}));
      K.wall([[-735,-170],[-735,-300],[-690,-340],[-600,-340]],Object.assign({},W,{h:10,from:SEA-3}));
      api.mark('gateEastOut',C.x1+30,-150); }
    yield;
    /* ================= THE ACROPOLIS ================= */
    { const t=K.sy(ACR.h), y=K.court(ACR.x-55,ACR.z-45,ACR.x+55,ACR.z+45,9,HS,{y:t,t:2.5,rooms:10,door:'n',pave:ST});
      K.tower(ACR.x-55,ACR.z-45,12,12,15,HS); K.tower(ACR.x+55,ACR.z+45,12,12,15,HS);
      K.temple(ACR.x,ACR.z+8,26,15,{dir:'n',podium:2,colH:8,m:MAR});
      for(let k=0;k<26;k++){ const z=ACR.z-ACR.rz-4+k*3.2, y2=K.sy(Math.min(t,(k+1)*t/22)); box(ACR.x-5,y2-2*M,z,ACR.x+5,y2,z+3.2,ST,{foot:true}); }
      api.mark('acropolis',ACR.x,ACR.z-ACR.rz-10); }
    yield;
    /* ================= THE MARKET AND HER HOUSES ================= */
    const SQ=DEF.square; api.top(SQ[0]-34,SQ[1]-28,SQ[0]+34,SQ[1]+28,HS); api.mark('square',SQ[0],SQ[1]); api.mark('market',SQ[0],SQ[1]);
    K.street([[-380,C.z0+6],[-380,SQ[1]-28]],8,HS); K.street([[SQ[0]+34,-150],[C.x1-6,-150]],8,HS); K.street([[SQ[0],SQ[1]+28],[SQ[0],C.z1-6]],8,HS);
    K.street([[-590,-220],[SQ[0]-34,-220]],7,HS);
    const inCity=(x,z)=>x>C.x0+12&&x<C.x1-12&&z>C.z0+12&&z<C.z1-12&&!(z>-100&&x<-560+(z+100)*0.6)&&!(x<-590);
    const free=(x,z,m)=>{ m=m||0; if(!inCity(x,z)) return false;
      if(Math.hypot((x-ACR.x)/(ACR.rx+14+m),(z-ACR.z)/(ACR.rz+14+m))<1) return false;
      if(Math.abs(x+380)<6+m&&z<SQ[1]||Math.abs(z+150)<6+m&&x>SQ[0]||Math.abs(x-SQ[0])<6+m&&z>SQ[1]||Math.abs(z+220)<6+m&&x<SQ[0]) return false;
      return !(Math.abs(x-SQ[0])<38+m&&Math.abs(z-SQ[1])<32+m); };
    K.quarter(SQ[0]-160,SQ[1]-150,SQ[0]+150,SQ[1]+170,16,(x,z)=>free(x,z,1),{w:7,wv:3});
    yield;
    let nm=0;
    for(let bx=C.x0+10;bx<C.x1-20;bx+=38) for(let bz=C.z0+10;bz<C.z1-20;bz+=32){
      const x0=bx+3, x1=bx+33, z0=bz+3, z1=bz+27;
      if(![[x0,z0],[x1,z0],[x0,z1],[x1,z1]].every(p=>free(p[0],p[1],1))) continue;
      if(Math.abs((x0+x1)/2-SQ[0])<160&&Math.abs((z0+z1)/2-SQ[1])<170) continue;
      const h=K.sy(7.5+Math.floor(hsh(bx,bz)*3)*3);
      K.hall(x0,z0,x1,z1,h,hsh(bx,bz*3)<0.6?PL:HS,{courts:[[(x0+x1)/2,(z0+z1)/2,3.6,3]],doors:[[(x0+x1)/2,z0,0.9,2.6],[(x0+x1)/2,z1,0.9,2.6]]});
      if(++nm%14===0) yield; }
    yield;
    /* ================= THE HOUSE OF ESHMUN BY THE RIVER ================= */
    { const x=420, z=-1150, y=K.sy(K.foot(x-60,z-50,x+60,z+50));
      /* its terraces against the hill, the podium of great stones, the temple on it, the pool of the god */
      box(x-60,y-M,z-50,x+60,y+4,z+50,HS,{foot:true}); box(x-38,y+4,z-30,x+38,y+13,z+30,HS);
      for(let k=0;k<12;k++) box(x-8,y+k*0.75,z+50+(11-k)*1.1,x+8,y+(k+1)*0.75,z+51.1+(11-k)*1.1,HS);
      for(let k=0;k<12;k++) box(x-6,y+4+k*0.75,z+30+(11-k)*1.0,x+6,y+4+(k+1)*0.75,z+31+(11-k)*1.0,HS);
      K.temple(x,z,30,18,{dir:'s',podium:1.4,colH:8,m:MAR});
      box(x+62,y-1.6,z-40,x+92,y,z-10,'water'); api.mark('templeEshmun',x,z+66); }
    /* (the strand south of the city kept for the purple dyers, and by the south harbour for the glass) */
    api.mark('dyeworks',-380,420); api.mark('glassworks',-470,220);
    for(let k=0;k<50;k++){ const x=-300+hsh(k,1)*700, z=160+hsh(k,2)*500; if(x>-200||z>360) K.tree(x,z,4+hsh(k,3)*2,'olive'); }
    api.townGround([[C.x0,C.z0],[C.x1,C.z0],[C.x1,C.z1],[-480,C.z1],[-560,-20],[-600,-100],[-735,-170],[-735,-300],[-690,-340],[-600,-340]]);
  }
};
EARTH.ancient(DEF);
})();
