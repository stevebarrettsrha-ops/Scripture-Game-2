/* ================= ROME ON HER SEVEN HILLS (ROADMAP Phase D4) =================
   "And so we went toward Rome" (Ma'asei 28:14): the city as Sha'ul came to her by the Appian way, in the
   days of Nero, before the fire. Her anchor is the Forum, the valley between the Capitol and the Palatine,
   and about it, after Lanciani's plan and the digging since (the earth's heights are sampled every
   fifteen kilometres here, and her hills are heaped up as they stand, some thirty metres over the Forum):
     · the Tiber on her west, a hundred metres broad, its bend about the Field of Mars, its island shaped
       like a ship with the house of Aesculapius on it, its bridges (the Fabrician and the Cestian to the
       island, the Aemilian below it, the Sublician of timber), and its quays by the Forum of the cattle;
     · the seven hills: the Capitol with the house of Jupiter Best and Greatest on its southern height and
       the Arx on its northern, the Palatine with the houses of Augustus and of Tiberius and the temple of
       Apollo, the Aventine, the Caelian, the Esquiline, the Viminal and the Quirinal;
     · the Forum of Rome: the temples of Saturn, of Castor and Pollux, of the deified Julius and of Vesta,
       the house of the Vestals, the Regia, the Rostra, the Curia, the basilicas Aemilia and Julia, the
       Tabularium at the Capitol's foot, the Sacred Way;
     · the Circus Maximus in the valley between the Palatine and the Aventine, six hundred metres long,
       its spina and the obelisk of Augustus, its stands, its gates; the theatre of Marcellus by the river;
     · the Servian wall of the kings about the hills, much of it built against and over by her houses in
       these days, its gates (the Carmentalis, the Collina, the Esquilina, the Caelimontana, the Capena,
       the Raudusculana and the Trigemina) and its earthwork across the Esquiline;
     · her insulae of five and six storeys in the Subura and the valleys, and her lanes. */
(function(){
const TIBER=[[-950,-2700],[-1450,-1400],[-1240,-830],[-940,-280],[-650,210],[-730,720],[-980,1500],[-1200,2600]];
const ISL=[[-690,140],[-640,150],[-610,215],[-640,285],[-680,280],[-700,210]];
const HILL={cap:[-230,-10,30,105,230,0.38],pal:[190,340,32,250,205,0.3],ave:[-560,1050,30,330,320,0.42],cae:[800,700,30,330,250,0.45],
            esq:[1050,-320,34,520,430,0.55],vim:[720,-880,30,330,200,0.5],qui:[120,-900,32,420,250,0.5]};
const DEF={
  n:'Rome', land:'Italy', lat:41.8925, lon:12.4853, style:'med',
  square:[380,-300], reach:1900, folk:110,
  ground:{
    level:[{x:100,z:150,rx:1900,rz:1800,blend:500,kind:'grass'}],
    hills:Object.values(HILL).map(h=>[...h,'grass']),
    waters:[{pts:TIBER,w:110,level:-6,depth:4}],
    land:[ISL]
  },
  plan:function*(api){ const K=ANCIENT_KIT(api,DEF), box=K.box, hsh=K.hsh, M=K.MPB;
    const TR='hewn-stone', MAR='marble', TF='stone', BR='brick', PL='plaster', RT='roof-tile', GOLD='gold-leaf', RG='red-granite';
    const riverX=z=>{ for(let i=0;i+1<TIBER.length;i++){ const a=TIBER[i], b=TIBER[i+1]; if(z>=a[1]&&z<=b[1]) return a[0]+(b[0]-a[0])*(z-a[1])/(b[1]-a[1]); } return -900; };
    const hy=k=>K.sy(HILL[k][2]);                                          /* the top of a hill, over the Forum */
    /* ================= THE FORUM OF ROME ================= */
    { api.top(-160,-38,70,38,TR); api.mark('forum',-40,0); api.mark('square',DEF.square[0],DEF.square[1]);
      /* the temple of Saturn at its western end, the treasury of the people in its podium */
      K.temple(-140,52,40,22,{dir:'n',podium:6,colH:11,m:MAR,pro:true}); api.mark('templeSaturn',-140,22);
      /* the Tabularium across the foot of the Capitol, its arcade */
      { const y=0; K.hall(-205,-40,-175,60,18,TF,{y,doors:[[-175,10,2,6]]}); for(let z=-34;z<56;z+=6) box(-175,y+9,z,-174,y+15,z+3.4,'air'); api.mark('tabularium',-168,10); }
      /* the Rostra, the Curia, the basilica Aemilia on the north side and Julia on the south */
      box(-118,0,-14,-100,3.6,14,MAR); api.mark('rostra',-95,0);
      K.hall(-70,-92,-36,-58,20,BR,{doors:[[-53,-58,2.4,7]]}); api.mark('curia',-53,-50);
      { const y=K.hall(-30,-82,80,-44,14,MAR,{doors:[[25,-44,3,9]],roof:RT}); for(let x=-27;x<78;x+=4.5) K.round(x,-41,0,9,0.6,MAR); api.mark('basilicaAemilia',25,-36); }
      { K.hall(-125,44,-28,92,14,MAR,{doors:[[-76,44,3,9]],roof:RT}); for(let x=-122;x<-30;x+=4.5) K.round(x,41,0,9,0.6,MAR); api.mark('basilicaJulia',-76,36); }
      /* the temple of Castor and Pollux on its high podium, and of the deified Julius at the east end */
      K.temple(5,72,40,28,{dir:'n',podium:7,colH:12.5,m:MAR}); api.mark('templeCastor',5,44);
      K.temple(82,0,26,18,{dir:'w',podium:5,colH:9,m:MAR,pro:true}); api.mark('templeJulius',62,0);
      /* the round house of Vesta, the Regia, and the house of the Vestals behind them */
      { const y=K.g(100,52); K.round(100,52,y,y+2,7.5,TR); for(let k=0;k<20;k++){ const a=k/20*Math.PI*2; box(100+Math.cos(a)*6.4-0.4,y+2,52+Math.sin(a)*6.4-0.4,100+Math.cos(a)*6.4+0.4,y+9,52+Math.sin(a)*6.4+0.4,MAR); }
        K.round(100,52,y+2,y+8.6,4.6,MAR); K.round(100,52,y+9,y+10.4,7,RT); K.round(100,52,y+10.4,y+11.6,4,RT); api.mark('templeVesta',100,40); }
      K.hall(78,14,108,34,8,TF,{doors:[[93,14,1.4,4]]}); api.mark('regia',93,8);
      K.court(112,40,190,100,9,BR,{t:1.5,rooms:9,door:'w',pave:MAR}); api.mark('atriumVestae',150,70);
      /* the Sacred Way up to the Velia */
      K.street([[70,8],[200,20],[420,60]],8,TR); api.mark('viaSacra',260,30); }
    yield;
    /* ================= THE CAPITOL ================= */
    { const t=hy('cap');
      /* the house of Jupiter Best and Greatest on the southern height: its podium 62 by 53 metres, its
         three cellae, its columns, its roof of gilded tiles */
      K.temple(-235,110,62,53,{dir:'s',podium:4,colH:15,m:MAR,roof:GOLD}); api.mark('capitolium',-235,152);
      /* the Arx on the northern height, the temple of Juno Moneta */
      K.temple(-220,-150,32,20,{dir:'s',podium:3,colH:9,m:MAR}); api.mark('arx',-220,-122);
      /* the clivus Capitolinus winding up from the Forum, and the Gemonian stair */
      for(let k=0;k<26;k++){ const z=36+k*3, y=K.sy(Math.min(t,(k+1)*t/24)); box(-170-k*0.4,y-2*M,z,-160-k*0.4,y,z+3,TR,{foot:true}); }
      for(let k=0;k<30;k++){ const y=K.sy(Math.min(t,(k+1)*t/28)); box(-152-k*1.1,y-2*M,-60,-150-k*1.1,y,-52,TR,{foot:true}); }
      K.wall([[-330,-230],[-330,200],[-130,230]],{m:TF,h:8,t:3,towers:0,from:undefined}); api.mark('capitolStair',-155,-56); }
    yield;
    /* ================= THE PALATINE ================= */
    { const t=hy('pal');
      /* the house of Augustus and of Livia, the temple of Apollo with its porticoes, the house of Tiberius */
      K.court(60,330,200,440,10,BR,{y:t,t:2,rooms:12,door:'n',pave:MAR}); api.mark('domusAugusti',130,322);
      K.temple(140,250,44,24,{dir:'s',podium:4,colH:11,m:MAR}); api.mark('templeApollo',140,282);
      K.court(90,160,300,250,14,BR,{y:t,t:2.5,rooms:16,door:'s',pave:MAR}); api.mark('domusTiberiana',195,258);
      K.court(240,300,380,430,12,BR,{y:t,t:2,rooms:14,door:'w',pave:MAR});
      /* the clivus Palatinus up from the Sacred Way */
      for(let k=0;k<30;k++){ const z=40+k*3.4, y=K.sy(Math.min(t,(k+1)*t/28)); box(196,y-2*M,z,206,y,z+3.4,TR,{foot:true}); }
      api.mark('palatine',190,340); api.mark('clivusPalatinus',201,50); }
    yield;
    /* ================= THE CIRCUS MAXIMUS ================= */
    { const cx=-20, cz=720, L=300, Wd=42, y=0;
      api.top(cx-L,cz-Wd,cx+L,cz+Wd,'sand');
      /* the spina down its middle, its turning posts, and the obelisk of Augustus from On */
      box(cx-200,y,cz-3,cx+200,y+1.4,cz+3,MAR); for(const s of [-1,1]) for(let k=0;k<3;k++) K.round(cx+s*205,cz-2+k*2,y,y+5,0.8,'gold-leaf');
      K.obelisk(cx,cz,23.7,2.4,RG);
      /* its stands, rising in stone and timber on both sides and about the curved end; the arcade outside */
      for(const s of [-1,1]){ for(let k=0;k<12;k++){ const z0=cz+s*(Wd+k*2.6), yy=K.sy(0.9+k*1.5); box(cx-L,yy-M,Math.min(z0,z0+s*2.6),cx+L,yy,Math.max(z0,z0+s*2.6),k<6?TF:'planks'); box(cx-L,yy-M-1.5,K.sx(z0+s*2.6)-(s>0?0:M),cx+L,yy-M,K.sx(z0+s*2.6)+(s>0?M:0),TF); }
        const zo=cz+s*(Wd+31.2); box(cx-L,y-M,K.sx(zo)-(s>0?0:M),cx+L,y+22,K.sx(zo)+(s>0?M:0),TF);
        for(let x=cx-L+3;x<cx+L-3;x+=6) box(x,y,K.sx(zo)-(s>0?0:M),x+3.6,y+7,K.sx(zo)+(s>0?M:0),'air'); }
      for(let a=0;a<=16;a++){ const t=Math.PI*(a/16-0.5), r=Wd+16; const x=cx+L+Math.cos(t)*r*0.9, z=cz+Math.sin(t)*r; box(x-4,y-M,z-4,x+4,y+16,z+4,TF); }
      /* the starting gates at the west end, twelve, and the towers over them */
      for(let k=0;k<12;k++){ const z=cz-Wd+4+k*(2*Wd-8)/11; box(cx-L-6,y,z-1.2,cx-L,y+6,z+1.2,TF); }
      K.tower(cx-L-3,cz-Wd-6,10,10,16,TF); K.tower(cx-L-3,cz+Wd+6,10,10,16,TF);
      api.mark('circus',cx,cz-Wd+6); api.mark('circusObelisk',cx,cz-10); }
    yield;
    /* ================= THE TIBER: ITS ISLAND, ITS BRIDGES, ITS QUAYS ================= */
    { /* the island, its prow of travertine, the house of Aesculapius */
      for(let z=150;z<285;z+=4) for(const s of [-1,1]){ const x=s<0?-700:-612; box(x,-10,z,x+4,0.6,z+4,TR); }
      K.temple(-655,215,22,14,{dir:'n',podium:2,colH:7,m:MAR}); api.mark('insula Tiberina',-655,190);
      /* the bridges: the Fabrician and the Cestian to the island, the Aemilian below, the Sublician of timber */
      K.bridge(-612,180,-585,180,9,0.2,-10,TR); K.bridge(-700,250,-715,250,8,0.2,-10,TR);
      { const z=360, x=riverX(z); K.bridge(x+57,z,x-57,z,10,0.3,-10,TR); api.mark('pontesAemilius',x+66,z); }
      { const z=500, x=riverX(z); K.bridge(x+57,z,x-57,z,8,0.6,-10,'planks'); api.mark('pontesSublicius',x+66,z); }
      /* the quays and the warehouses by the Forum of the cattle */
      for(let z=300;z<640;z+=4){ const x=K.sx(riverX(z)+55.5); box(x-M,-10,z,x,0.7,z+4,TR); }
      for(let k=0;k<6;k++){ const z=320+k*45; K.hall(riverX(z)+70,z,riverX(z)+110,z+30,9,BR,{doors:[[riverX(z)+70,z+15,2,4]],roof:RT}); }
      /* the Forum of the cattle: the round temple of Hercules the Victor and the temple of Portunus */
      { const x=-470, z=330, y=K.g(x,z); K.round(x,z,y,y+1.4,8,TR); for(let k=0;k<20;k++){ const a=k/20*Math.PI*2; box(x+Math.cos(a)*7-0.4,y+1.4,z+Math.sin(a)*7-0.4,x+Math.cos(a)*7+0.4,y+11,z+Math.sin(a)*7+0.4,MAR); }
        K.round(x,z,y+1.4,y+10,4.8,MAR); K.round(x,z,y+11,y+12.4,7.6,RT); api.mark('templeHercules',x,z-12); }
      K.temple(-430,250,20,12,{dir:'n',podium:2.5,colH:8,m:TR,pro:true}); api.mark('templePortunus',-430,236); }
    yield;
    /* ================= THE THEATRE OF MARCELLUS ================= */
    { const cx=-480, cz=120, r=64, y=0;
      /* its outer face of three storeys of arches in travertine, and its seats stepping down within */
      for(let k=0;k<34;k++){ const a=Math.PI*(1+k/33); const x=cx+Math.cos(a)*r, z=cz+Math.sin(a)*r*0.95; box(x-3.6,y-M,z-3.6,x+3.6,y+30,z+3.6,TR);
        for(let f=0;f<3;f++) box(x-1.6,y+1+f*10,z-3.7,x+1.6,y+7+f*10,z+3.7,'air'); }
      for(let k=0;k<11;k++){ const rr=r-6-k*4.6, hh=K.sy(28-k*2.5); for(let a2=0;a2<=14;a2++){ const a=Math.PI*(1+a2/14), x=cx+Math.cos(a)*rr, z=cz+Math.sin(a)*rr*0.95; box(x-2.6,y+hh-2*M,z-2.2,x+2.6,y+hh,z+2.2,TF); } }
      box(cx-r,y,cz-2,cx+r,y+24,cz+4,TR); box(cx-r+10,y,cz-10,cx+r-10,y+1.4,cz-2,MAR);
      api.mark('theatreMarcellus',cx,cz-20); }
    yield;
    /* ================= THE SERVIAN WALL ================= */
    { const W={m:TF,h:9,t:4,towers:70,tw:8,th:3};
      K.wall([[-420,150],[-360,-180]],Object.assign({},W,{gates:[[-395,40,5,'portaCarmentalis']]}));
      K.wall([[100,-1100],[550,-1160],[900,-1000]],Object.assign({},W,{gates:[[550,-1160,6,'portaCollina']]}));
      yield;
      /* the earthwork across the Esquiline, its ditch before it */
      K.wall([[1380,-760],[1380,-60]],Object.assign({},W,{h:12,t:5,hollow:true,gates:[[1380,-300,6,'portaEsquilina']]}));
      K.wall([[1060,900],[520,1060]],Object.assign({},W,{gates:[[1060,900,5,'portaCaelimontana'],[640,1025,6,'portaCapena']]}));
      yield;
      /* (on the Aventine and along the river the old wall is mostly gone under the houses: its gates stand) */
      K.wall([[-60,1360],[-200,1410]],Object.assign({},W,{gates:[[-120,1385,5,'portaRaudusculana']]}));
      K.wall([[-860,640],[-780,560]],Object.assign({},W,{gates:[[-820,600,5,'portaTrigemina']]}));
      api.mark('aggerServii',1400,-300); api.mark('viaAppia',640,1160); }
    yield;
    /* ================= HER INSULAE AND HER HOUSES ================= */
    const SQ=DEF.square; api.top(SQ[0]-32,SQ[1]-28,SQ[0]+32,SQ[1]+28,TR);
    K.street([[SQ[0]-32,SQ[1]],[-30,-60]],8,TR); K.street([[SQ[0]+32,SQ[1]],[900,-300]],7,TR);
    const onHill=(x,z,k,m)=>{ const h=HILL[k]; return Math.hypot((x-h[0])/(h[3]+m),(z-h[1])/(h[4]+m))<1; };
    const busy=[[-210,-100,220,110],[-330,-260,-110,240],[-330,600,320,820],[-560,40,-400,210],[-500,220,-380,360],[40,140,400,460]];
    const free=(x,z,m)=>{ m=m||0;
      if(Math.abs(x-riverX(z))<70+m) return false;
      if(busy.some(b=>x>b[0]-8-m&&x<b[2]+8+m&&z>b[1]-8-m&&z<b[3]+8+m)) return false;
      if(Math.abs(x-SQ[0])<36+m&&Math.abs(z-SQ[1])<32+m) return false;
      if(x>1340||z<-1150||z>1400||x<-900) return false;
      if(onHill(x,z,'pal',10+m)||onHill(x,z,'cap',10+m)) return false;          /* (the hills of the gods and of Caesar) */
      return true; };
    /* the houses of her folk about the square in the Subura */
    K.quarter(SQ[0]-170,SQ[1]-180,SQ[0]+190,SQ[1]+170,17,(x,z)=>free(x,z,1)&&!onHill(x,z,'esq',-40),{w:7,wv:3,style:'med'});
    yield;
    /* the insulae, five and six storeys, block on block along the valleys and the lower slopes, their shops
       at the street, their courts within, their roofs of tile */
    /* (the nearest blocks to the Forum and the Subura first, as the city was thickest there) */
    const lots=[];
    for(let bx=-880;bx<1320;bx+=46) for(let bz=-1120;bz<1380;bz+=40){
      const x0=bx+4, x1=bx+40, z0=bz+4, z1=bz+34, mx=(x0+x1)/2, mz=(z0+z1)/2;
      if(![[x0,z0],[x1,z0],[x0,z1],[x1,z1]].every(p=>free(p[0],p[1],2))) continue;
      if(Math.abs(mx-SQ[0])<190&&Math.abs(mz-SQ[1])<190) continue;
      const g0=K.foot(x0,z0,x1,z1), g1=Math.max(K.g(x0,z0),K.g(x1,z1),K.g(x0,z1),K.g(x1,z0));
      if(g1-g0>3) continue;                                                   /* (not on a hill's steep flank) */
      const valley=g0<4, d=Math.hypot(mx-150,mz+80)*(valley?1:1.6)*(0.8+hsh(bx,bz)*0.5);
      if(hsh(bz,bx)<(valley?0.2:0.55)) continue;                              /* (her gardens on the hills, the houses of the great) */
      lots.push({x0,z0,x1,z1,mx,mz,valley,d,bx,bz}); }
    lots.sort((a,b)=>a.d-b.d);
    let nm=0;
    for(const L of lots.slice(0,175)){ const {x0,z0,x1,z1,mx,mz,valley,bx,bz}=L;
      const h=valley?K.sy(12+Math.floor(hsh(bx*3,bz)*3)*2.6):K.sy(7.4);
      K.hall(x0,z0,x1,z1,h,valley?BR:PL,{courts:[[mx,mz,4.4,3.6]],doors:[[mx,z0,1.2,3],[mx,z1,1.2,3],[x0,mz,1.2,3]],roof:RT});
      if(++nm%16===0) yield; }
    yield;
    /* the cypresses and the pines of her gardens on the hills */
    for(let k=0;k<160;k++){ const ks=Object.keys(HILL), h=HILL[ks[k%ks.length]], a=hsh(k,1)*Math.PI*2, r=Math.sqrt(hsh(k,2))*0.8;
      const x=h[0]+Math.cos(a)*h[3]*r, z=h[1]+Math.sin(a)*h[4]*r; if(free(x,z,4)) K.cypress(x,z,9+hsh(k,3)*6); }
    api.townGround([[-420,150],[-360,-180],[-250,-700],[100,-1100],[550,-1160],[900,-1000],[1380,-560],[1380,-60],[1150,420],[1060,900],[520,1060],[100,1320],[-350,1460],[-820,1300],[-920,1020],[-780,560]]);
  }
};
EARTH.ancient(DEF);
})();
