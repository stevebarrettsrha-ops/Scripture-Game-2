/* ================= THE CITIES OF THE ANCIENTS BY THEIR OWN PLANS (Round 139) =================
   The same as world/wonders-true.js, for the walled cities among the works of the ancients: each raised
   whole, at its measured size, as it stood at its height. Metres about the site, x east, z south, y over
   the site's ground; the mason's tools are the wonders' own (window.WONDER_KIT).

     · YAHRIḤO (the tell of the city of palm trees, as Yahushua found it): a tell some 350 by 180 m and
       15 m high; the stone revetment at its foot, 4.5 m, with the wall of mud brick upon it; a second wall
       on the crest; houses built against the outer wall, and the upper city above; the gate toward the
       spring on the east, and the spring itself.
     · MEGIDDO (as the kings built it): a tell 250 by 210 m standing 20 m over the plain of Yizre‛ĕl; the
       wall of offsets and insets on its crest; the gate of six chambers on the north and the ramp up to
       it; the pillared stables north and south; the palace; the great round altar; the silo with its two
       stairs; the shaft of the water system.
     · KNOSSOS (the house of Minos): the central court 53 by 26 m; the west wing of storerooms with their
       jars and the throne room; the east wing of three and four storeys with the grand staircase in its
       light-well and the hall of the double axes; the north entrance and its pillar hall; the paved west
       court with its round pits; the theatral steps; red columns wider at the head, horns on the roofs.
     · MOHENJO-DARO on the Indus: the citadel mound 400 by 200 m and 12 m high, with the great bath (12 by
       7 m and 2.4 deep, a stair at each end) in its court of cells, the granary on its platform and the
       pillared hall; the lower town laid out in a grid, First Street 10 m broad, houses of baked brick
       about their courts, the wells and the covered drains.
     · CARTHAGE OF THE SEA (the city of the Punic days): the round harbour of the warships, 325 m across,
       with its island and the admiralty in the midst, ship-sheds all about both; the channel to the long
       merchant harbour and the sea; the hill of the Byrsa with its houses of many storeys; the triple
       wall across the isthmus.
   ============================================================================================ */
(function(){
const F=window.WONDER_FORMS, kit=window.WONDER_KIT;
const hsh=(i,j)=>{ const v=Math.sin(i*12.9898+j*78.233)*43758.5453; return v-Math.floor(v); };

/* ============================== YAHRIḤO ============================== */
F.jericho=function(api){ const K=kit(api), box=K.box, MB='mudbrick', ST='stone', D='dirt', P='path';
  K.level(-120,-200,130,200,'sand','dirt');
  K.oval(0,0,88,178,-3,4.5,D,P); K.oval(0,0,72,160,4.5,10,D,P); K.oval(0,0,60,142,10,15,D,P);
  const gate=[[0,0.07]];
  K.ovalRing(0,0,89,179,2.5,-3,4.5,ST,gate);                                                         /* the revetment */
  K.ovalRing(0,0,88,178,2,4.5,11,MB,gate);                                                            /* the wall upon it */
  K.ovalRing(0,0,60,142,2,15,21,MB,gate);                                                             /* the wall on the crest */
  /* the houses against the outer wall (one of them a harlot's, with a scarlet cord in its window) */
  for(let k=0;k<64;k++){ const th=k/64*Math.PI*2; if(Math.abs(Math.atan2(Math.sin(th),Math.cos(th)))<0.12) continue;
    const x=Math.cos(th)*80, z=Math.sin(th)*170; box(x-3,4.5,z-3,x+3,8.8,z+3,MB);
    if(k===6){ box(x+3,6.5,z-0.6,x+8.9,7.6,z+0.6,MB); box(x+8.8,2.0,z-0.1,x+9.1,7.0,z+0.1,'brick'); } }
  /* the upper city: houses about narrow ways, and the two streets that cross it */
  for(let x=-54;x<=54;x+=9) for(let z=-136;z<=136;z+=9){ if(Math.abs(x)<5||Math.abs(z)<5) continue;
    if((x/56)**2+(z/138)**2>1) continue; const w=2.6+hsh(x,z)*1.2, h=3.4+hsh(z,x)*1.6;
    box(x-w,15,z-w,x+w,15+h,z+w,MB); if(hsh(x+1,z)>0.6) box(x-w,15+h,z-w,x-w+1.6,15+h+1.8,z-w+1.6,MB); }
  /* the gate toward the spring, the way up to the crest */
  for(const s of [-1,1]){ box(84,-1,s*3.2,93,13,s*9,MB); box(56,10,s*3.2,64,24,s*9,MB); }
  K.flight('x',112,88,-3,3,0,4.5,10,P); K.flight('x',88,72,-3,3,4.5,10,10,P); K.flight('x',72,60,-3,3,10,15,8,P);
  /* the spring, and its pool */
  box(98,-2.4,8,114,0.3,24,ST); box(99.5,-2.2,9.5,112.5,-0.3,22.5,'waterB');
  for(let k=0;k<30;k++){ const x=100+hsh(k,1)*28, z=-40+hsh(1,k)*90; K.round(x,z,0,7+hsh(k,k)*4,0.3,'logSide'); box(x-1.8,7+hsh(k,k)*4,z-1.8,x+1.8,8.2+hsh(k,k)*4,z+1.8,'leaves'); }   /* the palms */
};

/* ============================== MEGIDDO ============================== */
F.megiddo=function(api){ const K=kit(api), box=K.box, HS='hewnStone', ST='stone', MB='mudbrick', D='dirt', P='path', TT=20;
  K.level(-140,-140,140,120,'grassTop','dirt');
  /* the tell, its shaft for the water cut through it */
  const shaft=[-102,-1,-4,-94,TT+1,4];
  for(const [a,b,y0,y1] of [[125,105,-3,7],[112,92,7,14],[100,80,14,TT]]){
    for(let z=-b;z<b;z+=2){ const zm=Math.min(b,Math.abs(z+1)), w=a*Math.sqrt(Math.max(0,1-(zm/b)**2)); if(w<0.3) continue;
      K.carve([-w,y0,z,w,y1,z+2],[shaft],D,P); } }
  /* the wall of offsets and insets on the crest */
  K.ovalRing(0,0,100,80,3.5,TT,TT+7,HS,[[-Math.PI/2,0.06]]);
  for(let k=0;k<36;k++){ const th=k/36*Math.PI*2; if(Math.abs(Math.atan2(Math.sin(th+Math.PI/2),Math.cos(th+Math.PI/2)))<0.1) continue;
    const x=Math.cos(th)*99.5, z=Math.sin(th)*79.5; box(x-2,TT,z-2,x+2,TT+8.5,z+2,HS); }
  /* the gate of six chambers on the north, and the ramp up to it */
  for(let i=0;i<4;i++){ const z=-80+i*6.2; for(const s of [-1,1]) box(s*2.1,TT,z,s*9,TT+8,z+1.6,HS); }
  for(const s of [-1,1]) box(s*9,TT,-80,s*10.6,TT+8,-60,HS);
  box(-10.6,TT+8,-80,10.6,TT+9,-60,HS); box(-2.1,TT-0.8,-80,2.1,TT+0.1,-60,P);
  K.flight('z',-128,-80,-3,3,0,TT,40,P);
  /* the stables: rows of stone pillars, troughs between, a paved way down the middle */
  const stable=(x0,z0,n)=>{ for(let u=0;u<n;u++){ const ux=x0+u*21;
      box(ux,TT,z0,ux+21,TT+0.1,z0+12,'cobble');
      for(const zz of [z0+3.2,z0+8.8]) for(let k=0;k<12;k++){ box(ux+1+k*1.7,TT,zz-0.3,ux+1.6+k*1.7,TT+2.2,zz+0.3,HS); box(ux+1.6+k*1.7,TT,zz-0.3,ux+2.7+k*1.7,TT+0.8,zz+0.3,HS); }
      K.carve([ux,TT,z0,ux+21,TT+3.5,z0+12],[[ux+0.6,TT,z0+0.6,ux+20.4,TT+2.6,z0+11.4],[ux+9,TT,z0-0.1,ux+12,TT+2.4,z0+0.7]],MB); } };
  stable(-60,-62,5); stable(8,30,3);
  /* the palace of the governor, about its court */
  K.carve([-62,TT,18,-26,TT+7,52],[[-54,TT,26,-34,TT+7.1,44],[-46,TT,51.9,-42,TT+4,52.1],[-60,TT,20,-56,TT+5,50],[-32,TT,20,-28,TT+5,50]],HS);
  /* the great round altar, its stair on the east */
  K.round(-40,-10,TT,TT+1.4,4.2,'cobble'); K.flight('x',-31,-35.8,-1,1,TT,TT+1.4,4,'cobble');
  /* the silo, its two stairs winding down */
  box(16,TT-7,-21,28,TT-6.6,-9,'cobble');
  for(const [a,b,c,d] of [[16,-21,28,-20.4],[16,-9.6,28,-9],[16,-21,16.6,-9],[27.4,-21,28,-9]]) box(a,TT-7,b,c,TT+0.6,d,'cobble');
  for(let i=0;i<7;i++){ box(16.6+i*1.4,TT-7,-20.4,18+i*1.4,TT-i,-19.2,'cobble'); box(26-i*1.4,TT-7,-10.8,27.4-i*1.4,TT-i,-9.6,'cobble'); }
  /* the shaft, its steps on the walls */
  for(let i=0;i<10;i++) box(-101.5,TT-2-i*2,-3.5+((i%2)?5:0),-94.5,TT-1-i*2,-1.5+((i%2)?5:0),HS);
  /* the houses of the city in its quarters */
  const busy=[[-62,-62,45,-50],[8,30,71,42],[-62,18,-26,52],[-45,-15,-35,-5],[15,-22,29,-8],[-12,-82,12,-58],[-105,-6,-90,6]];
  for(let x=-90;x<=90;x+=10) for(let z=-70;z<=70;z+=10){ if((x/96)**2+(z/76)**2>0.9) continue;
    if(busy.some(b=>x>b[0]-6&&x<b[2]+6&&z>b[1]-6&&z<b[3]+6)) continue;
    if(Math.abs(x)<3||Math.abs(z+5)<3) continue;
    const w=3+hsh(x,z)*1.4; K.carve([x-w,TT,z-w,x+w,TT+3.6,z+w],[[x-w+0.5,TT,z-w+0.5,x+w-0.5,TT+3.7,z],[x-0.6,TT,z+w-0.6,x+0.6,TT+2.2,z+w+0.1]],MB); }
};

/* ============================== KNOSSOS ============================== */
F.knossos=function(api){ const K=kit(api), box=K.box, GY='alabaster', PL='plaster', RD='brick', BK='basalt', PV='hewnStone';
  K.level(-90,-90,70,70,'stone','dirt');
  /* a Minoan column: red, wider at its head than its foot, a black cushion of a capital */
  const mcol=(x,z,y0,h)=>{ K.round(x,z,y0,y0+0.2,0.55,BK); K.round(x,z,y0+0.2,y0+h*0.55,0.34,RD); K.round(x,z,y0+h*0.55,y0+h-0.5,0.42,RD);
    K.round(x,z,y0+h-0.5,y0+h-0.2,0.62,BK); box(x-0.6,y0+h-0.2,z-0.6,x+0.6,y0+h,z+0.6,BK); };
  const horns=(x,z,y,ax)=>{ if(ax==='x'){ box(x-0.8,y,z-0.25,x+0.8,y+0.35,z+0.25,GY); box(x-0.8,y+0.35,z-0.25,x-0.45,y+1.1,z+0.25,GY); box(x+0.45,y+0.35,z-0.25,x+0.8,y+1.1,z+0.25,GY); }
    else { box(x-0.25,y,z-0.8,x+0.25,y+0.35,z+0.8,GY); box(x-0.25,y+0.35,z-0.8,x+0.25,y+1.1,z-0.45,GY); box(x-0.25,y+0.35,z+0.45,x+0.25,y+1.1,z+0.8,GY); } };
  /* the central court */
  box(-13,-0.8,-26.5,13,0.1,26.5,PV);
  /* the west wing: the long corridor of the storerooms, eighteen of them; the throne room on the court */
  const mags=[]; for(let i=0;i<18;i++) mags.push([-41,0,-40+i*4.2,-24,3.6,-37.4+i*4.2]);
  K.carve([-45,-1,-45,-13,9,40],[...mags,[-24.1,0,-42,-21.8,3.6,38],[-21,0,-14,-14,4.2,-4],[-14.1,0,-12,-12.9,3,-6],[-21,0,2,-14,4.2,10]],GY,PL);
  for(let i=0;i<18;i++) for(let k=0;k<4;k++) K.round(-38+k*3.8,-38.7+i*4.2,0,1.6,0.5,RD);           /* the great jars */
  box(-20.6,0,-13.6,-19.4,1.4,-12.4,GY);                                                            /* the throne, against the north wall */
  for(const z of [-13,-10,-7]) box(-21,0,z,-20.4,0.6,z+2.4,GY);                                       /* the benches */
  box(-19,-1.4,2.6,-15,0,9.4,PV);                                                                    /* the sunken lustral basin */
  for(let z=-24;z<=24;z+=6) mcol(-11.6,z,0,4.2);                                                     /* the colonnade of the west wing on the court */
  box(-13,4.2,-26,-10.6,5,26,PL); for(let z=-24;z<=24;z+=6) mcol(-11.6,z,5,3.6);
  for(let z=-42;z<=38;z+=5) horns(-13.4,z,9,'z');
  /* the east wing, down the slope: three storeys and more, the grand staircase in its light-well */
  K.carve([13,-4,-45,50,12,40],[[15,0,5,24,12.1,15],[25,0,8,40,4,20],[25,0,22,36,4,30],[12.9,0,-2,15.1,3.2,2],[39.9,0,12,40.1,3,16]],GY,PL);
  for(let i=0;i<4;i++) K.flight('z',i%2?14.5:5.5,i%2?5.5:14.5,i<2?15:19.5,i<2?19.5:24,i*3,(i+1)*3,10,GY);
  for(const z of [8,12]) for(const x of [16,23]) mcol(x,z,0,3);
  for(let x=27;x<=38;x+=3.6) box(x,0,13.6,x+0.6,4,14.4,GY);                                          /* the pier-and-door partition of the hall of the double axes */
  for(let z=-42;z<=38;z+=5) horns(13.4,z,12,'z');
  /* the north wing, the north entrance and its pillar hall, the bastion with its portico */
  K.carve([-13,-1,-45,13,7,-26.5],[[-2.5,0,-45.1,2.5,4,-26.4]],GY,PL);
  for(const x of [-8,-3,3,8]) for(const z of [-58,-51]) box(x-0.6,0,z-0.6,x+0.6,4,z+0.6,GY);
  box(-11,4,-61,11,5,-46,PL); for(const z of [-60,-47]) for(const s of [-1,1]) box(s*11,-1,-61,s*10,4,-46,GY);
  for(const z of [-42,-37,-32]) mcol(15.5,z,0,4.2); box(13,4.2,-44,18,5,-30,PL);
  /* the red bands that ran along the Minoan walls under the roofs, and the timber courses in them */
  for(const [x0,z0,x1,z1,h] of [[-45.2,-45.2,-12.8,40.2,9],[12.8,-45.2,50.2,40.2,12],[-13.2,-45.2,13.2,-26.3,7],[-13.2,26.3,13.2,45.2,7]]){
    box(x0,h-1.3,z0,x1,h-0.5,z0+0.25,RD); box(x0,h-1.3,z1-0.25,x1,h-0.5,z1,RD); box(x0,h-1.3,z0,x0+0.25,h-0.5,z1,RD); box(x1-0.25,h-1.3,z0,x1,h-0.5,z1,RD);
    box(x0,3.6,z0,x1,4.0,z0+0.2,'planks'); box(x0,3.6,z1-0.2,x1,4.0,z1,'planks'); }
  /* the south wing and its propylaeum */
  K.carve([-13,-1,26.5,13,7,45],[[-2.5,0,26.4,2.5,4,45.1],[-8,0,32,8,4,40]],GY,PL);
  for(const x of [-5,5]) mcol(x,36,0,4);
  /* the west court, its paving and its three round pits; the theatral steps */
  box(-80,-0.8,-45,-45,0.1,45,PV);
  for(const [x,z] of [[-70,-20],[-62,-5],[-54,10]]) K.ovalRing(x,z,4,4,0.6,-2.5,0.4,'cobble',[],0.8);
  for(let i=0;i<18;i++) box(-40,-1,-75+i*0.6,-10,i*0.3,-74.4+i*0.6,PV);
  box(-40,-1,-64.2,-10,0.1,-55,PV);
};

/* ============================== MOHENJO-DARO ============================== */
F.mohenjo=function(api){ const K=kit(api), box=K.box, BR='brick', MB='mudbrick', P='path', CT=12;
  K.level(-330,-260,260,260,'sand','dirt');
  /* the citadel mound, its baked-brick revetment */
  box(-320,-3,-200,-120,CT-1,200,MB,P); box(-322,-3,-202,-118,CT,-198,BR); box(-322,-3,198,-118,CT,202,BR);
  box(-322,-3,-198,-318,CT,198,BR); box(-122,-3,-198,-118,CT,198,BR);
  box(-320,CT-1,-200,-120,CT,200,P);
  K.flight('x',-105,-118,-6,6,0,CT,16,BR);
  /* the great bath in its court of cells */
  const bx=-220, bz=-60;
  K.carve([bx-27.5,CT,bz-16.5,bx+27.5,CT+5,bz+16.5],[[bx-20,CT,bz-11,bx+20,CT+5.1,bz+11],[bx-1.5,CT,bz+16.4,bx+1.5,CT+3,bz+16.6],
    ...[-24,-17,-10,10,17,24].map(x=>[x+bx-2.6,CT,bz-15,x+bx+2.6,CT+3.2,bz-11.6])],BR);
  box(bx-20,CT-2.6,bz-11,bx+20,CT+0.1,bz+11,BR,P);
  K.carve([bx-4.5,CT-3.0,bz-7.5,bx+4.5,CT+0.1,bz+7.5],[[bx-3.5,CT-2.4,bz-6,bx+3.5,CT+0.2,bz+6]],BR);
  box(bx-3.5,CT-2.4,bz-6,bx+3.5,CT-0.4,bz+6,'waterB');
  for(const s of [-1,1]) K.flight('z',bz+s*3.6,bz+s*6,bx-1.6,bx+1.6,CT-2.4,CT,5,BR);                  /* a stair at either end */
  for(const x of [-18,-12,-6,6,12,18]) for(const s of [-1,1]) box(bx+x-0.6,CT,bz+s*9-0.6,bx+x+0.6,CT+3.2,bz+s*9+0.6,BR);
  for(const s of [-1,1]) box(bx-20,CT+3.2,bz+s*8.2,bx+20,CT+3.8,bz+s*11,'planks');
  /* the granary: its platform cut by air channels, and the hall of timber over it */
  for(let i=0;i<9;i++) for(let j=0;j<3;j++) box(-275+j*8,CT,-82+i*5.2,-269+j*8,CT+3.2,-78.4+i*5.2,BR);
  box(-276,CT+3.2,-83,-250,CT+3.8,-35,'planks'); box(-276,CT+3.8,-83,-250,CT+8,-35,MB);
  /* the pillared hall */
  K.carve([-250,CT,110,-210,CT+5,150],[[-248,CT,112,-212,CT+4.4,148],[-232,CT,109.9,-228,CT+3,112.1]],BR);
  for(let i=0;i<5;i++) for(let j=0;j<4;j++) box(-244+i*7-0.8,CT,117+j*8-0.8,-244+i*7+0.8,CT+4.4,117+j*8+0.8,BR);
  /* the lower town: First Street and its fellows, the lanes, the houses about their courts */
  const NS=[-60,40,140,230], EW=[-240,-130,-20,90,200];
  for(const x of NS) box(x-5,-0.8,-250,x+5,0.1,250,P);
  for(const z of EW) box(-70,-0.8,z-3.5,240,0.1,z+3.5,P);
  for(let x=-50;x<235;x+=17) for(let z=-238;z<245;z+=17){
    if(NS.some(n=>Math.abs(x+7-n)<12)||EW.some(e=>Math.abs(z+7-e)<10)) continue;
    const w=6.2+hsh(x,z)*1.2, cx=x+7, cz=z+7, h=hsh(z,x)>0.45?7:3.8, dz=(hsh(x+3,z)>0.5?1:-1);
    K.carve([cx-w,0,cz-w,cx+w,h,cz+w],[[cx-w+0.6,0,cz-w+0.6,cx+w-0.6,h-0.8,cz+w-0.6],[cx-3,0,cz-3,cx+3,h+0.1,cz+3],[cx-0.8,0,cz+dz*w-0.7,cx+0.8,2.4,cz+dz*w+0.7]],BR);
    if(hsh(x,z+9)>0.7) K.ovalRing(cx+1.8,cz+1.8,0.9,0.9,0.4,0,0.9,BR,[],0.6);                          /* a well in the court */
    box(cx-w,-0.4,cz+w+0.2,cx+w,0.15,cz+w+0.9,BR); }                                                   /* the covered drain along the lane */
};

/* ============================== CARTHAGE ============================== */
F.carthage=function(api0){
  /* (the plan is laid mirrored north for south: the earth's heights put the open sea north of the round
     harbour here, so the merchant harbour opens north into it and the city and the Byrsa stand on the
     land to the south) */
  const api=Object.assign({},api0,{box:(x0,y0,z0,x1,y1,z1,m,t)=>api0.box(x0,y0,-z1,x1,y1,-z0,m,t),
    level:(x0,z0,x1,z1,a,b)=>api0.level(x0,-z1,x1,-z0,a,b), ground:(x,z)=>api0.ground(x,-z)});
  const K=kit(api), box=K.box, HS='hewnStone', PL='plaster', ST='stone', W='waterB', P='path';
  K.level(-420,-460,360,420,'sand','sand');
  /* the round harbour of the warships: its quay all about, the ship-sheds, the island, the admiralty */
  const cx=0, cz=0, R=162, RI=53;
  K.ovalRing(cx,cz,R+14,R+14,14,-4,0.8,HS);
  K.oval(cx,cz,R,R,-4,-0.5,W,null,3);
  for(let k=0;k<135;k++){ const th=k/135*Math.PI*2; if(Math.abs(Math.atan2(Math.sin(th-Math.PI/2),Math.cos(th-Math.PI/2)))<0.06) continue;
    const x=Math.cos(th)*(R+7), z=Math.sin(th)*(R+7); box(x-2.6,0.8,z-2.6,x+2.6,7,z+2.6,PL); box(x-3,7,z-3,x+3,7.6,z+3,'roof'); }
  K.oval(cx,cz,RI,RI,-4,0.8,HS,null,2);
  for(let k=0;k<30;k++){ const th=k/30*Math.PI*2, x=Math.cos(th)*(RI-6), z=Math.sin(th)*(RI-6); box(x-3,0.8,z-3,x+3,7,z+3,PL); box(x-3.4,7,z-3.4,x+3.4,7.6,z+3.4,'roof'); }
  K.carve([-9,0.8,-9,9,22,9],[[-2,0.8,-9.1,2,4,-6],[-7,6,-7,7,21,7]],HS); box(-10,22,-10,10,23.2,10,HS);  /* the admiralty, from whose top the sea is watched */
  for(const s of [-1,1]) for(let k=-3;k<=3;k++) box(k*2.6-0.5,23.2,s*9.6-0.4,k*2.6+0.5,24.4,s*9.6+0.4,HS);
  /* the channel to the merchant harbour, the long harbour, its mouth to the sea */
  box(-11,-4,R-2,11,-0.5,R+40,W); for(const s of [-1,1]) box(s*11,-4,R-2,s*16,0.8,R+40,HS);
  box(-160,-4,R+40,160,-0.5,R+340,W);
  for(const s of [-1,1]) box(s*160,-4,R+30,s*175,0.8,R+340,HS);
  box(-175,-4,R+28,-11,0.8,R+40,HS); box(11,-4,R+28,175,0.8,R+40,HS);
  for(const s of [-1,1]) for(let i=0;i<27;i++) box(s*167-2.5,0.8,R+50+i*11,s*167+2.5,6,R+58+i*11,PL);                /* the warehouses on the quays */
  /* the hill of the Byrsa: a mound with houses of many storeys up its sides, the temple of the city's god left out */
  const bxc=-300, bzc=-300;
  K.oval(bxc,bzc,120,120,-3,14,'dirt','path',3); K.oval(bxc,bzc,85,85,14,32,'dirt','path',3); K.oval(bxc,bzc,50,50,32,46,'dirt','path',3);
  K.carve([bxc-24,46,bzc-16,bxc+24,58,bzc+16],[[bxc-21,46,bzc-13,bxc+21,56,bzc+13],[bxc-2,46,bzc+15.9,bxc+2,52,bzc+16.1]],HS);
  for(let x=-110;x<=110;x+=11) for(let z=-110;z<=110;z+=11){ const r=Math.hypot(x,z); if(r<55||r>115) continue;
    const y=r<85?32:14, h=8+hsh(x,z)*12;
    if(hsh(z,x)<0.3) continue; box(bxc+x-4.2,y,bzc+z-4.2,bxc+x+4.2,y+h,bzc+z+4.2,PL); box(bxc+x-4.4,y+h,bzc+z-4.4,bxc+x+4.4,y+h+0.5,bzc+z+4.4,HS); }
  /* the city between the hill and the harbours, in blocks of tall houses, and the street of the market */
  for(let x=-250;x<=330;x+=24) for(let z=-430;z<=-190;z+=24){ if(Math.hypot(x-bxc,z-bzc)<135) continue;
    for(const [ox,oz] of [[-5,-5],[5,-5],[-5,5],[5,5]]){ const h=10+hsh(x+ox,z+oz)*14;
      box(x+ox-4.4,0,z+oz-4.4,x+ox+4.4,h,z+oz+4.4,PL); box(x+ox-4.6,h,z+oz-4.6,x+ox+4.6,h+0.5,z+oz+4.6,HS); } }
  for(let x=-250;x<=330;x+=24) for(let z=-180;z<=-R-20;z+=24) for(const [ox,oz] of [[-5,-5],[5,-5],[-5,5],[5,5]]){
    const X=x+ox, Z=z+oz; if(Math.hypot(X,Z)<R+30||Math.hypot(X-bxc,Z-bzc)<135) continue; const h=8+hsh(X,Z)*10;
    box(X-4.4,0,Z-4.4,X+4.4,h,Z+4.4,PL); }
  /* the triple wall across the isthmus (the west): ditch, palisade, and the great wall with its towers */
  box(-420,-3,-460,-412,4,420,ST); box(-404,-1,-460,-400,6,420,'planks');
  box(-392,-1,-460,-383,13,420,HS); for(let z=-450;z<=410;z+=60) box(-396,-1,z-6,-379,19,z+6,HS);
  K.merlons('z',-460,420,-388,13,HS,2.4);
};
})();
