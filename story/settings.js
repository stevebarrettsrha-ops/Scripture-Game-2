/* THE FULLNESS OF TIME — the places the story happens in.

   A setting builds its stage and names its MARKERS (where a figure stands,
   where a thing lies, where the player must go). The acts refer to places
   and markers by name and never to a coordinate, so a place can be rebuilt
   without a scene being rewritten.

   Scale: one unit is a metre; a man is 1.85. The sets are laid as blocks of the voyage's
   world at each scene's true place (story/places.js); a box below is read as the block of
   its colour, and stands on the ground where it is. */
(function(){
'use strict';
const W=window.STORYWORLD, C=W.C;
const S=window.STORYSETTINGS={};
const mk=(ctx,id,x,z)=>{ ctx.markers[id]=[x,z]; };

/* ================= YAHRUSHALAYIM in the days of Aḥaz =================
   A walled city on its ridge: the Hĕḵal on the height to the north, the
   houses of the city below it, a gate in the south-west wall, and outside
   it the road past the Launderer's Field to the upper pool and its channel
   (Yashayahu 7:3). */
S.yahrushalayim=function(ctx,st){
  /* SHE IS THE VOYAGE'S OWN CITY (world/yahrushalayim.js): the same walls, gate, houses, the
     taught ones' court, the highway, the upper pool and its conduit, and the Hĕḵal on the
     height — raised as she stood in the act's days (the kings', or Herodes'). Her marks are
     the scene's markers; nothing is built here. */
  ctx.wind=[0.8,0.3];
  /* in the days of the kings, the house of the sovereign below the courts of the House, and
     beside it the stair of Aḥaz on which the shadow went down (Yashayahu 38:8) */
  if(ctx.period==='kings'){
    room(ctx,st,26,-32,34,-25,{door:'w',wall:C.limestone});                         /* (a box stands on the city's ground where it is) */
    mk(ctx,'palace',30,-28.5); mk(ctx,'palaceIn',28.2,-28.5); mk(ctx,'palaceDoor',24.4,-28.5); mk(ctx,'palaceYard',22,-30.4);
    const g0=ctx.groundY(35.8,-23.85)||0;                                           /* the stair rises from one ground */
    for(let k=0;k<10;k++){ const z=-23.4-(k+0.5)*0.9, d=(ctx.groundY(35.8,z)||0)-g0;
      st.box(34.8,-d,-23.4-(k+1)*0.9,36.8,0.35*(k+1)-d,-23.4-k*0.9,C.limestone); }
    st.box(37.2,0,-33.4,37.8,4.6,-32.8,C.stone);                                    /* the gnomon above the stair */
    mk(ctx,'dial',35.8,-27.6); mk(ctx,'dialFoot',33,-21.6);
  }
  ctx.bounds={x0:-200,x1:200,z0:-200,z1:200};
};

/* ================= THE HILL COUNTRY OF YAHUḎAH (Luke 1:39): the house of Zaḵaryahu =================
   A village on the terraced hills west of the city (Ayin Kerem, "the spring of the vineyard", by
   the old tradition): the house of the kohen, of the white limestone of Yahuḏah, the spring
   below it in a stone basin, the vines and olives on their terraces. */
S.hillcountry=function(ctx,st){
  ctx.wind=[0.7,0.3];
  W.ground(ctx,{color:C.grassDry,flat:30,peak:[{x:-42,z:-30,h:14,r:40},{x:38,z:-46,h:12,r:36},{x:-30,z:44,h:10,r:30}]});
  room(ctx,st,-6,-4,2,2,{door:'e',wall:C.limestone});
  mk(ctx,'zhouse',-2,-1); mk(ctx,'zhouseIn',0,-1); mk(ctx,'zdoor',3.8,-1); mk(ctx,'zyard',6,1.6);
  /* the spring in its basin of stone, and the path up from it */
  st.box(12,0,8,16.4,0.5,8.5,C.stone); st.box(12,0,11.6,16.4,0.5,12.1,C.stone); st.box(12,0,8,12.5,0.5,12.1,C.stone); st.box(15.9,0,8,16.4,0.5,12.1,C.stone);
  ctx.api.water(12.5,8.5,15.9,11.6,{depth:1,bed:'stone'});
  for(let k=0;k<12;k++){ const t=k/11, x=4+t*9, z=1+t*6; st.box(x-0.8,0,z-0.8,x+0.8,0.08,z+0.8,C.path,{collide:false,jitter:0.12}); }
  mk(ctx,'spring',13.6,6.8); mk(ctx,'pathUp',20,14);
  /* the neighbours' houses, the terraces of vines and olives */
  [[-16,8],[12,-12],[20,-2],[-14,-16],[-4,14]].forEach(([x,z],k)=>W.house(st,x,z,6,5.5,{door:k%2?'e':'w',color:k%2?C.limestone:C.whitewash,h:2.8}));
  for(let r=0;r<4;r++) for(let k=0;k<10;k++){ const x=-28+k*2.6, z=22+r*3.2; st.detail(x-0.08,0,z-0.08,x+0.08,1.2,z+0.08,0x5d4a36); st.detail(x-0.5,1.0,z-0.3,x+0.5,1.5,z+0.3,0x6d8a3e); }
  for(let k=0;k<10;k++){ const a=W.hash(k,4)*6.28, r=22+W.hash(k,5)*16; W.olive(st,Math.cos(a)*r,Math.sin(a)*r,0.9); }
  W.wild(ctx,'goat',22,16,3,5,0.4); W.wild(ctx,'chicken',6,4,3,3,0.4);
  ctx.bounds={x0:-120,x1:120,z0:-120,z1:120};
};

/* ================= SHEḴEM: YA‛AQOḆ'S FOUNTAIN (Yahuchanon 4:5-6) =================
   The well Ya‛aqoḇ dug, its mouth a ring of dressed stone on the plain between the two
   mountains; Mount Gerizim, "this mountain" where the fathers of Shomeron worshipped (4:20),
   standing over it to the south-west; the town up the road to the north-east; and the wheat
   on the plain about it, white for harvest (4:35). */
S.shekem=function(ctx,st){
  ctx.wind=[0.9,0.4];
  W.ground(ctx,{color:C.grassDry,flat:34,peak:[{x:-46,z:-52,h:26,r:50},{x:-30,z:66,h:18,r:44}]});
  /* the well-head: a ring of stone about the deep shaft, a stone trough beside it */
  for(let a=0;a<12;a++){ const t=a/12*Math.PI*2, px=Math.cos(t)*1.05, pz=Math.sin(t)*1.05;
    st.box(px-0.32,0,pz-0.32,px+0.32,0.78,pz+0.32,C.stone); }
  st.detail(-0.7,0.02,-0.7,0.7,0.06,0.7,0x1d2830);
  st.box(1.6,0,-1.1,2.8,0.45,-0.5,C.stoneDark,{collide:false});
  /* the road from Yahuḏah, past the well, on to the town and to Galil */
  for(let k=-24;k<24;k++){ const x=k*1.6, z=x*0.55-3; st.box(x-0.9,0,z-1.2,x+0.9,0.08,z+1.2,C.path,{collide:false,jitter:0.12}); }
  /* Sheḵem up the road: houses of stone and the town's gate-way */
  const hs=[[24,16],[30,10],[30,22],[36,16],[24,28],[38,28]];
  hs.forEach(([x,z],k)=>W.house(st,x,z,6,5.5,{door:'w',color:k%2?C.limestone:C.whitewash,h:2.9}));
  /* the wheat, white for harvest, on the plain either side of the road */
  for(let k=0;k<1400;k++){ const x=-30+W.hash(k,3)*52, z=-30+W.hash(k,4)*24;     /* close-sown, in tufts of ripe ears */
    if(Math.hypot(x,z)<7||Math.abs(z-(x*0.55-3))<3.2) continue;
    const r=0.2+W.hash(k,6)*0.12, h=0.7+W.hash(k,5)*0.25;
    st.detail(x-r,0,z-r,x+r,h,z+r,[0xe4d39a,0xd6c27e,0xeadcae,0xcdb874][k%4],{jitter:0.08}); }
  for(let k=0;k<8;k++){ const a=W.hash(k,9)*6.28, r=12+W.hash(k,8)*10; const x=Math.cos(a)*r, z=Math.sin(a)*r+8; if(z<-6) continue; W.olive(st,x,z,0.9); }
  W.wild(ctx,'goat',-20,20,3,5,0.4); W.wild(ctx,'lizard',6,-8,2,4,0.5);
  mk(ctx,'well',0,0); mk(ctx,'wellSeat',1.5,0.6); mk(ctx,'town',22,10); mk(ctx,'townGate',20,9);
  mk(ctx,'gerizim',-46,-52); mk(ctx,'fields',-14,-18);
  ctx.bounds={x0:-120,x1:120,z0:-120,z1:120};
};

/* ================= NATSARETH, a village of Galil ================= */
S.natsareth=function(ctx,st){
  W.ground(ctx,{size:360,color:C.grass,alt:C.grassDry,flat:30,hills:14,peak:{x:52,z:-58,h:16,r:34}});
  /* the qahal where He read (Luke 4:16): a hall of stone on pillars, open along its front so
     the light comes in, benches about the walls, and the place where the scroll is read */
  { const qx=-2, qz=-26;
    st.box(qx-8,0,qz-6,qx+8,0.3,qz+6,C.stone,{collide:false});
    st.box(qx-8,0.3,qz-6,qx+8,4.2,qz-5.5,C.limestone); st.box(qx-8,0.3,qz-6,qx-7.5,4.2,qz+6,C.limestone); st.box(qx+7.5,0.3,qz-6,qx+8,4.2,qz+6,C.limestone);
    for(const px of [-7.6,-4,0,4,7.6]) st.box(qx+px-0.3,0.3,qz+5.5,qx+px+0.3,4.2,qz+6.1,C.limestone);
    st.box(qx-8.3,4.2,qz-6.3,qx+8.3,4.6,qz+6.3,C.roofEarth,{collide:false});
    for(const sd of [-1,1]) st.box(qx-7.4,0.3,qz+sd*4.6-0.5,qx+7.4,0.75,qz+sd*4.6+0.5,C.stoneDark,{collide:false});
    st.box(qx-7.4,0.3,qz-5.4,qx+7.4,0.75,qz-4.4,C.stoneDark,{collide:false});            /* benches about the walls */
    st.box(qx-1,0.3,qz-2.2,qx+1,1.3,qz-1.4,C.timber);                                     /* the reading-desk */
    mk(ctx,'qahal',qx,qz); mk(ctx,'reader',qx,qz-1); mk(ctx,'qahalDoor',qx,qz+9); mk(ctx,'qahalSeat',qx+3.4,qz+2.4); }
  /* the brow of the hill on which their city was built (Luke 4:29): a rock edge and the drop */
  for(let k=0;k<7;k++){ const x=62+k*1.6, z=-66+W.hash(k,9)*3;
    st.box(x-0.9,-3,z-0.9,x+0.9,0.9+W.hash(k,4)*0.6,z+0.9,C.rock); }
  mk(ctx,'brow',56,-60); mk(ctx,'browEdge',60,-63);
  const hs=[[-12,-6],[-4,-10],[6,-8],[14,-2],[-14,6],[10,8],[-3,12],[18,12]];
  hs.forEach(([x,z],k)=>W.house(st,x,z,5.5,5,{door:z<0?'s':'n',color:k%3?C.mudbrick:C.whitewash,h:2.8}));
  st.box(-1,0,-1,3,0.5,3,C.stone); W.jar(st,0,0); W.jar(st,1.2,0.4);            /* the spring */
  for(let k=0;k<18;k++){ const a=W.hash(k,1)*6.28, r=28+W.hash(k,2)*40; W.olive(st,Math.cos(a)*r,Math.sin(a)*r,1); }
  mk(ctx,'miryamHouse',-4,-6.4); mk(ctx,'miryam',-4,-5.2); mk(ctx,'malak',-4,-2.6); mk(ctx,'spring',1,2);
  mk(ctx,'yoseph',14,1.2); mk(ctx,'yosephDream',14,0.6);
  W.wild(ctx,'chicken',8,4,4,3,0.4); W.wild(ctx,'goat',-20,14,3,5,0.4); W.wild(ctx,'lizard',30,-30,2,6,0.5);
  ctx.bounds={x0:-120,x1:120,z0:-120,z1:120};
};

/* ================= THE ROAD TO YAHUḎAH ================= */
S.road=function(ctx,st){
  ctx.wind=[1.1,0.3];
  W.ground(ctx,{size:420,color:C.grassDry,alt:C.sand,flat:30,hills:22});
  for(let k=-60;k<60;k++) st.box(k*1.5-0.8,0,-1.4+Math.sin(k*0.08)*3,k*1.5+0.8,0.1,1.4+Math.sin(k*0.08)*3,C.path,{collide:false,jitter:0.12});
  for(let k=0;k<24;k++){ const x=(W.hash(k,4)-0.5)*170, z=(W.hash(k,6)>0.5?1:-1)*(8+W.hash(k,8)*30); W.rock(st,x,z,1+W.hash(k,2)); if(k%3===0) W.olive(st,x+3,z+2,0.9); }
  mk(ctx,'roadA',-60,Math.sin(-40*0.08)*3); mk(ctx,'roadB',40,Math.sin(26*0.08)*3);
  W.wild(ctx,'lizard',10,-12,3,10,0.6); W.wild(ctx,'gazelle',-30,50,3,14,1.2);
  ctx.bounds={x0:-150,x1:150,z0:-80,z1:80};
};

/* ================= THE FIELDS BY NIGHT, below Bĕyth Leḥem =================
   Pasture on the slope under the village: the fold of stacked stone, the
   shepherds' fire, the flock, and the lamps of the village up on the hill. */
S.fields=function(ctx,st){
  ctx.wind=[0.7,0.35];
  W.ground(ctx,{size:420,color:C.grass,alt:C.grassDry,flat:34,hills:10});
  W.fold(st,-8,-4,5);
  W.fire(ctx,st,4,4);
  for(let k=0;k<16;k++){ const a=W.hash(k,1)*6.28, r=W.hash(k,2)*3.2; ctx.flock.push(W.sheep(ctx,-8+Math.cos(a)*r,-4+Math.sin(a)*r,k%5===0)); }
  for(let k=0;k<30;k++){ const x=(W.hash(k,5)-0.5)*120, z=(W.hash(k,7)-0.5)*120; if(Math.hypot(x,z)<22) continue; W.rock(st,x,z,0.6+W.hash(k,3)); }
  /* the village on the hill, its lamps showing */
  for(let k=0;k<9;k++){ const x=-30+k*7+(W.hash(k,1)-0.5)*3, z=-62-W.hash(k,2)*8; W.house(st,x,z,5,5,{door:'s',h:3,noStair:true});
    if(k%2===0) W.glow(ctx,x,ctx.groundY(x,z+2.6)+2,z+2.6,1.6,0xffc070,0); }
  mk(ctx,'fold',-8,1.6); mk(ctx,'foldIn',-8,-4); mk(ctx,'fire',4,4); mk(ctx,'sit',4,6.4);
  mk(ctx,'hill',-2,-40); mk(ctx,'villageRoad',-2,-52);
  mk(ctx,'s1',6.2,3.2); mk(ctx,'s2',2,5.8); mk(ctx,'s3',5.6,6.2);
  mk(ctx,'lamb1',22,-14); mk(ctx,'lamb2',-26,12); mk(ctx,'lamb3',16,24);
  W.wild(ctx,'dog',0,10,1,3,0.6); W.wild(ctx,'hedgehog',-20,-24,1,6,0.2);
  ctx.bounds={x0:-110,x1:110,z0:-100,z1:100};
};

/* ================= BĔYTH LEḤEM, the city of Dawiḏ =================
   A small town of flat-roofed houses on its hill. There was no room in the
   lodging place (Luke 2:7): the child lies in a feeding trough under a
   lean-to beside a house, where the beasts are kept. */
S.beythlehem=function(ctx,st){
  W.ground(ctx,{size:360,color:C.grassDry,alt:C.earth,flat:36,hills:10});
  const hs=[[-14,-10],[-4,-14],[8,-12],[18,-6],[-18,2],[16,6],[-10,12],[4,14],[20,18],[-22,-18]];
  hs.forEach(([x,z],k)=>W.house(st,x,z,6,5.5,{door:x>0?'w':'e',color:k%3?C.limestone:C.whitewash,h:3.1}));
  W.house(st,-1,-2,9,6,{door:'s',color:C.whitewash,h:3.6,noStair:true});        /* the lodging place */
  W.stable(st,7,-1);
  W.donkey(ctx,9,-2.4).rotation.y=-0.6;
  for(let k=0;k<12;k++){ const a=W.hash(k,4)*6.28, r=30+W.hash(k,6)*30; W.olive(st,Math.cos(a)*r,Math.sin(a)*r,0.9); }
  mk(ctx,'lodging',-1,2.4); mk(ctx,'trough',7,-0.9); mk(ctx,'troughView',7,2.2);
  mk(ctx,'miryam',6,-0.9); mk(ctx,'yoseph',8.4,-1.6); mk(ctx,'enter',-2,34); mk(ctx,'square',0,8);
  mk(ctx,'sh1',5.6,2.6); mk(ctx,'sh2',8.6,2.6); mk(ctx,'sh3',7,3.4);
  mk(ctx,'house',16,6); mk(ctx,'houseDoor',12.5,6); mk(ctx,'camels',6,22); mk(ctx,'well',-6,22);
  st.box(-7,0,21,-5,0.8,23,C.stone); W.jar(st,-4.4,22);
  W.wild(ctx,'chicken',-14,6,4,3,0.4); W.wild(ctx,'goat',22,-14,3,4,0.4); W.wild(ctx,'dog',-18,18,1,4,0.6);
  ctx.bounds={x0:-100,x1:100,z0:-100,z1:100};
};

/* ================= THE YARDĔN, at Bĕyth Anyah beyond the Yardĕn =================
   Yahuchanon immersed "in Bĕyth Anyah beyond the Yardĕn" (Yahuchanon 1:28),
   in the rift below the sea's level: the river brown and winding in its
   green thicket of tamarisk and reed, the pale marl hills over it, and the
   bare wilderness of Yahuḏah rising to the west. The ford is where the
   crowds go down into the water; his booth stands on the east bank. */
const RIVER={w:4.5,b:4,d:1.3,amp:8,f:0.018,level:-0.35};
S.yarden=function(ctx,st){
  ctx.wind=[1.3,0.5];                                  /* the wind down the rift */
  const green=new THREE.Color(0x76844a), marl=new THREE.Color(0xcdbf9e);
  W.ground(ctx,{size:460,color:C.grassDry,alt:C.earth,flat:46,hills:34,river:RIVER,
    tint:(x,z,c,n)=>{ const dx=Math.abs(x-W.riverX(RIVER,z));
      if(dx<RIVER.w+RIVER.b) c.set(0x6f6048).multiplyScalar(0.9+n*0.2);                 /* the mud of the banks */
      else if(dx<24) c.lerp(green,0.75*(1-(dx-8.5)/15.5));
      else c.lerp(marl,Math.min(0.85,(dx-24)/40)); }});
  ctx.api.pad(-34,-132,34,132,{top:'grass'});         /* the floor of the rift, along the river */
  W.riverWater(ctx,RIVER,256);
  const rx=z=>W.riverX(RIVER,z), edge=RIVER.w+RIVER.b;
  /* reeds along both banks, the ford left open */
  for(let z=-124;z<124;z+=3.2) for(const sd of [-1,1]){
    if(Math.abs(z)<9) continue;
    W.reeds(st,rx(z)+sd*(edge-1.2+W.hash(z,sd)*1.6),z,-0.3,6); }
  /* the thicket: tamarisk and willow on the flood-plain */
  for(let k=0;k<140;k++){ const z=(W.hash(k,11)-0.5)*240, sd=W.hash(k,12)<0.5?-1:1, d=edge+2+W.hash(k,13)*16, x=rx(z)+sd*d;
    if(x>-22&&x<-4&&z>-18&&z<18) continue;          /* the crowds' bank */
    if(x>8&&x<24&&z>-14&&z<8) continue;             /* his camp */
    if(x<-4&&Math.abs(z-(0.45*x+2))<5) continue;     /* the road down */
    W.tamarisk(st,x,z,0.8+W.hash(k,14)*0.6); }
  for(let k=0;k<10;k++){ const z=-60+k*13+(W.hash(k,2)-0.5)*6; if(Math.abs(z)<30) continue;   /* the ford's banks kept clear */
    W.palm(st,rx(z)+(k%2?1:-1)*(edge+5+W.hash(k,3)*6),z); }
  /* "where He was staying" (Yahuchanon 1:39): a house of the valley, up from the river */
  W.house(st,-45,-27,5.5,5,{door:'e',color:C.mudbrick,h:2.8}); W.booth(st,-40.5,-30.5); W.jar(st,-41.6,-24.2);
  /* the road down from the west, where the crowds come from Yahrushalayim */
  for(let k=0;k<34;k++){ const x=-10-k*1.7, z=0.45*x+2; st.box(x-1,0,z-1.3,x+1,0.08,z+1.3,C.path,{collide:false,jitter:0.12}); }
  /* his camp on the east bank: a booth of branches, a fire, a skin of water */
  W.booth(st,17,-6); W.fire(ctx,st,13.5,-2.5); W.jar(st,15.2,-4.6);
  for(let k=0;k<6;k++) W.rock(st,-15+W.hash(k,1)*8,-12+W.hash(k,2)*24,0.5);
  mk(ctx,'arrive',-40,-16); mk(ctx,'bank',-10.5,1.5); mk(ctx,'bank2',-10,-3.5);
  mk(ctx,'yahIn',2.4,0.2); mk(ctx,'yahBank',11,-0.5); mk(ctx,'camp',15,-4);
  mk(ctx,'westRoad',-46,-18.7); mk(ctx,'jesusBank',-8.2,-1.2); mk(ctx,'jesusIn',-0.2,-0.6);
  mk(ctx,'jesusOut',-9.5,-2.2); mk(ctx,'wild',-70,-40);
  /* the fig tree Nethanĕ’l sat under (Yahuchanon 1:48), near the house up from the river */
  W.fig(st,-31,-34); mk(ctx,'fig',-31,-34); mk(ctx,'figSeat',-29.4,-32.6);
  mk(ctx,'lambWalk',-9,-6); mk(ctx,'passBy',-14,-10); mk(ctx,'staying',-40.5,-25.5); mk(ctx,'followPt',-22,-14); mk(ctx,'followMe',-16.5,-8.5);
  mk(ctx,'edgeW',-7.4,1); mk(ctx,'edgeE',7.4,-1);
  W.wild(ctx,'boar',-28,60,2,8,0.6); W.wild(ctx,'jackal',30,-60,1,10,0.8); W.wild(ctx,'lizard',-26,-10,2,6,0.5);
  ctx.bounds={x0:-150,x1:150,z0:-150,z1:150};
};

/* ================= THE WILDERNESS OF YAḤUḎAH =================
   Bare chalk hills falling east to the rift: stone and more stone, a little
   broom in the wadis, no water. "He was with the wild beasts" (Mark 1:13). */
function wildGround(ctx,o){
  W.ground(ctx,Object.assign({size:520,color:0xc9b48a,alt:0xa58d68,flat:12,hills:36,
    tint:(x,z,c,n)=>{ if(n>0.72) c.lerp(new THREE.Color(0x8b7c66),0.5); }},o||{}));
}
S.wilderness=function(ctx,st){
  ctx.wind=[1.6,-0.7];
  wildGround(ctx);
  for(let k=0;k<70;k++){ const a=W.hash(k,21)*6.28, r=5+W.hash(k,22)*90, x=Math.cos(a)*r, z=Math.sin(a)*r;
    st.box(x-0.8,-0.2,z-0.6,x+0.7,0.8+W.hash(k,23)*0.8,z+0.8,C.rock); }
  /* the stones, round as loaves */
  for(let k=0;k<9;k++){ const a=k*0.7+0.4, r=2.2+W.hash(k,31)*2.4, x=Math.cos(a)*r, z=Math.sin(a)*r+2;
    st.box(x-0.28,0,z-0.28,x+0.28,0.3,z+0.28,0xb8a888,{collide:false}); }
  st.box(-0.9,0,-1.2,0.9,0.6,-0.1,C.rock);                           /* a rock to sit on */
  for(let k=0;k<18;k++){ const a=W.hash(k,41)*6.28, r=14+W.hash(k,42)*60, x=Math.cos(a)*r, z=Math.sin(a)*r;
    st.box(x-0.6,0,z-0.6,x+0.6,0.9,z+0.6,'leaves'); }   /* broom in the wadis */
  mk(ctx,'seat',0,-0.6); mk(ctx,'stones',0,3);
  /* "He was with the wild beasts" (Mark 1:13) */
  W.wild(ctx,'jackal',24,-30,2,10,0.8); W.wild(ctx,'hyena',-40,36,1,10,0.7); W.wild(ctx,'goat',40,40,3,10,0.6);
  W.wild(ctx,'lizard',6,8,3,6,0.5); W.wild(ctx,'scorpion',-5,6,3,4,0.2); W.wild(ctx,'viper',9,-6,1,4,0.25);
  ctx.bounds={x0:-200,x1:200,z0:-200,z1:200};
};
/* "a very high mountain" (Mattithyahu 4:8): the land falls away on every side */
S.mountain=function(ctx,st){
  ctx.wind=[2.8,1.1];                                  /* high up, the wind is strong */
  wildGround(ctx,{flat:6,top:'stone'});                /* the summit of Ḥermon itself; the land falls away */
  for(let k=0;k<40;k++){ const a=W.hash(k,51)*6.28, r=8+W.hash(k,52)*50, x=Math.cos(a)*r, z=Math.sin(a)*r;
    st.box(x-0.7,-0.3,z-0.6,x+0.7,0.9,z+0.7,C.rock); }
  ctx.kingdoms=[];
  for(let k=0;k<14;k++){ const a=k/14*6.28+W.hash(k,61), r=150+W.hash(k,62)*90, x=Math.cos(a)*r, z=Math.sin(a)*r;
    const G=W.glow(ctx,x,ctx.groundY(x,z)+3,z,10+W.hash(k,63)*8,0xffd9a0,0); G.sprite.material.fog=false; G.visible=false; ctx.kingdoms.push(G); }
  mk(ctx,'summit',0,0);
  W.wild(ctx,'goat',-30,24,3,10,0.6); W.wild(ctx,'leopard',44,-38,1,12,0.7);   /* Ḥermon, "the mountains of the leopards" */
  ctx.bounds={x0:-200,x1:200,z0:-200,z1:200};
};

/* ================= QANAH OF GALIL: the wedding =================
   A courtyard house on the hill village: rooms on three sides, an awning of branches over
   the tables, lamps, the six stone water-jugs by the door (Yahuchanon 2:6), and the village
   well a little way down the lane. */
S.qanah=function(ctx,st){
  W.ground(ctx,{size:360,color:C.grass,alt:C.grassDry,flat:34,hills:16});
  const cx=0, cz=0;
  st.box(cx-10,0,cz-8,cx+10,0.12,cz+8,C.path,{collide:false});
  W.house(st,cx-4,cz-11,12,6,{door:'s',color:C.whitewash,h:3.4,noStair:true});
  W.house(st,cx-13.5,cz,6,14,{door:'e',color:C.mudbrick,h:3.2,noStair:true});
  W.house(st,cx+13.5,cz-2,6,10,{door:'w',color:C.whitewash,h:3.2});
  for(const px of [-7,-2,3,8]) for(const pz of [-6,2]) st.box(cx+px-0.12,0,cz+pz-0.12,cx+px+0.12,2.7,cz+pz+0.12,C.timber,{collide:false});
  st.box(cx-8,2.7,cz-7,cx+9,2.85,cz+3,0x7c7a4e,{collide:false});                    /* the awning */
  for(const [x,z,w] of [[-4,-3.5,4],[2.5,-3.5,4],[-1,0.4,6]]) st.box(cx+x-w/2,0,cz+z-0.6,cx+x+w/2,0.75,cz+z+0.6,C.timber);
  for(let k=0;k<5;k++){ const x=-6+k*3; W.glow(ctx,cx+x,2.3,cz-2,1.1,0xffc070,0); }
  for(let k=0;k<14;k++){ const a=W.hash(k,1)*6.28, r=30+W.hash(k,2)*40; W.olive(st,Math.cos(a)*r,Math.sin(a)*r,1); }
  st.box(cx+7,0,cz+16,cx+9,0.8,cz+18,C.stone); W.jar(st,cx+9.6,cz+17);            /* the well */
  mk(ctx,'well',cx+8,cz+15); mk(ctx,'gate',cx,cz+9); mk(ctx,'lane',cx-2,cz+22); mk(ctx,'master',cx+2.5,cz-5.4);
  W.wild(ctx,'chicken',cx+6,cz+20,4,3,0.4); W.wild(ctx,'dog',cx-6,cz+26,1,4,0.6); W.wild(ctx,'donkey',cx+18,cz+12,1,2,0.3);
  mk(ctx,'jars',cx-6,cz+5.2); mk(ctx,'bride',cx-1,cz-1.2); mk(ctx,'miryam',cx-4,cz+2.6); mk(ctx,'yahusha',cx-1.6,cz+3.6);
  ctx.bounds={x0:-120,x1:120,z0:-120,z1:120};
};

/* ================= BĔYTH ANYAH, near Yahrushalayim =================
   "Now Bĕyth Anyah was near Yahrushalayim, about three kilometers away" (Yahuchanon 11:18): a
   village of the hill country on the far side of the Mount of Olives, houses of stone on the
   slope, olive trees; and outside it, "a cave, and a stone lay against it" (11:38) — a tomb
   cut into the rock of the hillside, closed by a round stone. */
S.bethanyah=function(ctx,st){
  ctx.wind=[0.6,0.3];
  W.ground(ctx,{color:C.grassDry,flat:28,peak:{x:-40,z:-8,h:9,r:26}});
  /* the rock face of the hill, and the tomb cut into it */
  st.box(-27,0,-15,-21,5.2,-1,C.limestone);                                    /* the face of the rock */
  st.box(-26,0,-10,-21.2,2.4,-6,'air');                                       /* the cave */
  st.box(-26.5,0,-10.5,-26,2.8,-5.5,C.limestone);                             /* its back wall */
  st.box(-21.2,0,-11.2,-20.4,0.3,-4.8,C.stone);                               /* the threshold, a channel for the stone */
  const hs=[[-2,14],[8,10],[16,18],[-12,20],[4,26],[18,4],[-8,6]];
  hs.forEach(([x,z],k)=>W.house(st,x,z,6,5.5,{door:x>0?'w':'e',color:k%2?C.limestone:C.whitewash,h:3}));
  for(let k=0;k<16;k++){ const a=W.hash(k,7)*6.28, r=24+W.hash(k,8)*30; const x=Math.cos(a)*r+6, z=Math.sin(a)*r+10; if(x<-14&&z<6) continue; W.olive(st,x,z,0.9+W.hash(k,9)*0.3); }
  W.wild(ctx,'goat',20,-20,3,6,0.4); W.wild(ctx,'chicken',4,18,3,3,0.4);
  mk(ctx,'tomb',-21.8,-8); mk(ctx,'tombIn',-24,-8); mk(ctx,'tombOut',-17.5,-8); mk(ctx,'tombFront',-14,-8);
  mk(ctx,'stone',-20.1,-8); mk(ctx,'stoneAside',-20.1,-12.4);
  mk(ctx,'road',26,-6); mk(ctx,'meet',14,-4); mk(ctx,'house',-8,6); mk(ctx,'houseDoor',-4.2,6);
  ctx.bounds={x0:-120,x1:120,z0:-120,z1:120};
};

/* ================= THE SEVEN HUNDRED YEARS: the seats of the empires =================
   Each is drawn as a glimpse, as the design document's montage asks: what the eye would
   take in from a hilltop as the centuries go by. */
/* a round hut of wattle and daub under a peaked roof of thatch */
function hut(st,x,z,r){ r=r||2.4;
  st.box(x-r,0,z-r,x+r,1.9,z+r,'mudbrick'); st.box(x-0.5,0,z+r-0.4,x+0.5,1.5,z+r+0.1,'air');
  st.box(x-r-0.3,1.9,z-r-0.3,x+r+0.3,2.5,z+r+0.3,'thatch'); st.box(x-r+0.6,2.5,z-r+0.6,x+r-0.6,3.1,z+r-0.6,'thatch'); st.box(x-0.7,3.1,z-0.7,x+0.7,3.6,z+0.7,'thatch'); }
/* ROME, 753 BCE by its own reckoning: huts of wattle on the Palatine above the Tiber */
S.tiber=function(ctx,st){
  ctx.wind=[0.6,0.2];
  W.ground(ctx,{color:C.grass,flat:20,peak:{x:-10,z:-6,h:5,r:30}});
  [[-14,-10],[-6,-14],[2,-8],[-10,0],[6,2],[-2,8],[10,-4]].forEach(([x,z])=>hut(st,x,z,2.2));
  for(let k=0;k<26;k++){ const a=k/26*Math.PI*2, x=Math.cos(a)*19, z=Math.sin(a)*19; if(Math.abs(a-1.6)<0.2) continue; st.box(x-0.25,0,z-0.25,x+0.25,1.8,z+0.25,'log'); }   /* the palisade */
  W.wild(ctx,'sheep',12,12,5,4,0.4); W.wild(ctx,'pig',-16,10,3,4,0.4);
  for(let k=0;k<10;k++){ const a=W.hash(k,3)*6.28, r=26+W.hash(k,4)*20; W.olive(st,Math.cos(a)*r,Math.sin(a)*r,0.9); }
  mk(ctx,'center',0,0);
  ctx.bounds=null;
};
/* NINEWĔH, 612 BCE: the great wall of mud brick and its gate, guarded by winged bulls of stone
   (the lamassu, still standing in Mosul's museum until 2015), the palace mound behind — burning */
S.nineveh=function(ctx,st){
  ctx.wind=[1.2,0.4];
  W.ground(ctx,{color:C.grassDry,flat:36,top:'sand'});
  W.wall(st,-34,10,34,10,{h:9,t:3,color:'mudbrick',gap:[0,10,5]});
  W.gate(st,0,10,'x',{w:5,h:12,color:'mudbrick'});
  for(const sx of [-1,1]){ const x=sx*4.6; st.box(x-0.7,0,12,x+0.7,3.6,16,'alabaster'); st.box(x-0.9,3.6,12.2,x+0.9,4.2,15.6,'alabaster'); }   /* the lamassu */
  st.box(-20,0,-24,20,6,-6,'mudbrick'); st.box(-12,6,-20,12,12,-10,'mudbrick'); st.box(-6,12,-17,6,15,-13,'mudbrick');   /* the palace mound */
  ctx.flames=[];
  for(let k=0;k<14;k++){ const x=-26+W.hash(k,1)*52, z=-24+W.hash(k,2)*30; const f=W.glow(ctx,x,2+W.hash(k,3)*10,z,5+W.hash(k,4)*5,0xff7a2a,0); f.flicker=true; ctx.flicker.push(f); }
  mk(ctx,'gate',0,10);
  ctx.bounds=null;
};
/* BAḆAL, 539 BCE: the stepped temple tower of seven stages and the gate faced with blue glazed
   brick and the beasts of gold that stood on it */
S.babel=function(ctx,st){
  ctx.wind=[1.0,0.2];
  W.ground(ctx,{color:C.grassDry,flat:40,top:'sand'});
  let w=30; for(let k=0;k<7;k++){ const h=k*4.2; st.box(-w/2,h,-30-w/2,w/2,h+4.2,-30+w/2,k%2?'mudbrick':'brick'); w-=4; }
  st.box(-3,0,-30+15,3,6,-30+19,'mudbrick');                                      /* the great stair */
  for(const sx of [-1,1]){ const x=sx*6; st.box(x-3,0,14,x+3,13,20,'sapphire');      /* the gate towers, blue */
    for(let y=2;y<12;y+=3) st.box(x-3.05,y,13.9,x+3.05,y+0.9,14,'hay'); }            /* the beasts of gold */
  st.box(-3,9,14,3,13,20,'sapphire');
  W.wall(st,-40,17,-9,17,{h:10,t:3,color:'mudbrick'}); W.wall(st,9,17,40,17,{h:10,t:3,color:'mudbrick'});
  for(let k=0;k<12;k++){ const a=W.hash(k,6)*6.28, r=30+W.hash(k,7)*20; W.palm(st,Math.cos(a)*r,Math.sin(a)*r+20); }
  mk(ctx,'gate',0,22);
  ctx.bounds=null;
};
/* MACEDON, 331 BCE: a temple of the Greeks in white stone on its stepped base, columns all about */
S.pella=function(ctx,st){
  ctx.wind=[0.8,0.4];
  W.ground(ctx,{color:C.grass,flat:26});
  st.box(-10,0,-16,10,1.2,16,'alabaster'); st.box(-9,1.2,-15,9,1.8,15,'alabaster');
  for(const x of [-8,-4.8,-1.6,1.6,4.8,8]) for(const z of [-14,14]) st.box(x-0.6,1.8,z-0.6,x+0.6,8.8,z+0.6,'alabaster');
  for(const z of [-10,-6,-2,2,6,10]) for(const x of [-8,8]) st.box(x-0.6,1.8,z-0.6,x+0.6,8.8,z+0.6,'alabaster');
  st.box(-9,8.8,-15,9,10,15,'alabaster'); st.box(-7,10,-15,7,11,15,'alabaster'); st.box(-4,11,-15,4,12,15,'alabaster');
  st.box(-5,1.8,-8,5,8.8,8,'plaster');                                             /* the inner shrine */
  for(let k=0;k<12;k++){ const a=W.hash(k,8)*6.28, r=20+W.hash(k,9)*18; W.olive(st,Math.cos(a)*r,Math.sin(a)*r,1); }
  mk(ctx,'temple',0,0);
  ctx.bounds=null;
};

/* ================= THE SEA OF GALIL: Kephar Naḥum on its shore =================
   The lake east of the stage; a beach of pebbles where the boats are drawn up and the nets
   washed (Luke 5:2); the town of black basalt behind it, its qahal of stone; the hills going
   up to the west, where He went up on a mountain (Mattithyahu 5:1). `village:false` is the
   other side of the sea: the shore and the grassy slope where the five thousand sat down
   (Yahuchanon 6:10). */
const SHORE={x:22,d:6,slope:0.16};
/* A HOUSE OF KEPHAR NAḤUM as the digs there show them: one room of black basalt (or of the
   limestone of Yahuḏah, `wall`), the roof of
   beams laid over with earth, reached by a stair up the outside wall (Mark 2:4, "they
   uncovered the roof where He was"). `hole` leaves an opening in the roof, which the scene
   covers with a patch of earth and branches (a thing it can take away). The room is
   (x0,z0)-(x1,z1); the door is in the wall named by `door`, the stair along the south wall. */
function room(ctx,st0,x0,z0,x1,z1,o){ let st;
  o=o||{}; const t=0.5, BAS=o.wall||'basalt', mx=(x0+x1)/2, mz=(z0+z1)/2;
  /* `y`: the floor's height, where the ground is not the set's own level (a terrace of the city) */
  const Y=o.y||0, H=2.8+Y; st={box:(a,b,c,d,e,f,g,h)=>st0.box(a,b+Y,c,d,e+Y,f,g,h)}; 
  st.box(x0,0,z0,x1,0.08,z1,C.path);                                                /* the floor of beaten earth */
  st.detail=(...a)=>st0.detail(a[0],a[1]+Y,a[2],a[3],a[4]+Y,a[5],a[6],a[7]);
  const dz0=mz-0.7, dz1=mz+0.7;
  /* the four walls, the door left open in its own */
  const WH=H-Y;
  if(o.door==='e'){ st.box(x1-t,0,z0,x1,WH,dz0,BAS); st.box(x1-t,0,dz1,x1,WH,z1,BAS); st.box(x1-t,2.2,dz0,x1,WH,dz1,BAS); } else st.box(x1-t,0,z0,x1,WH,z1,BAS);
  if(o.door==='w'){ st.box(x0,0,z0,x0+t,WH,dz0,BAS); st.box(x0,0,dz1,x0+t,WH,z1,BAS); st.box(x0,2.2,dz0,x0+t,WH,dz1,BAS); } else st.box(x0,0,z0,x0+t,WH,z1,BAS);
  st.box(x0,0,z0,x1,WH,z0+t,BAS); st.box(x0,0,z1-t,x1,WH,z1,BAS);
  /* the roof, a course thick, and its opening */
  const h=o.hole, R=H-Y;
  if(h){ st.box(x0,R,z0,x1,R+0.92,h[1],C.roofEarth); st.box(x0,R,h[3],x1,R+0.92,z1,C.roofEarth);
         st.box(x0,R,h[1],h[0],R+0.92,h[3],C.roofEarth); st.box(h[2],R,h[1],x1,R+0.92,h[3],C.roofEarth); }
  else st.box(x0,R,z0,x1,R+0.92,z1,C.roofEarth);
  /* the stair up the outside of the south wall, from the east */
  for(let k=0;k<6;k++){ const sx=x1-0.4-k*0.95; st.box(sx-0.95,0,z1,sx,0.62*(k+1),z1+1.2,C.stoneDark); }
  /* a mat to lie on, a lamp niche, a water jar by the door */
  st.box(x0+t+0.2,0.08,z0+t+0.2,x0+t+2.2,0.2,z0+t+1.2,0xb39a6a,{collide:false});
  return {roofY:H+0.92};
}

function galil(ctx,st,o){
  W.ground(ctx,{color:o.village?C.grassDry:C.grass,flat:30,
    peak:o.village?{x:-80,z:6,h:11,r:72}:{x:-46,z:0,h:8,r:56}});
  /* THE LAKE: its floor levelled and its water laid, from the beach out past where the boats
     go; a beach of pebbles along its edge */
  ctx.api.pad(SHORE.x-8,-80,SHORE.x+92,80,{top:'sand'});
  ctx.api.water(SHORE.x,-78,SHORE.x+90,78,{depth:3,bed:'sand'});
  st.box(SHORE.x-6,0,-80,SHORE.x,0.1,80,'sand');
  for(let k=0;k<26;k++){ const z=-90+k*7, x=SHORE.x-3+W.hash(k,5)*2.2; W.rock(st,x,z,0.35+W.hash(k,6)*0.4); }
  if(o.village){
    const BAS='basalt', BAS2='basalt';                                   /* the black basalt of Kephar Naḥum */
    /* the town lies along the shore; the slope of the hills west of it is left open, for the crowds */
    const hs=[[-8,-24],[2,-26],[-14,-14],[4,10],[-6,24],[8,24],[-4,-34],[10,-32]];
    /* the house of Shim‛on and Andri (Mark 1:29), its roof opened over the room (2:4); the
       house of Ya‛ir, a ruler of the qahal, by the qahal (5:22, 38) */
    room(ctx,st,-14.5,5,-7.5,11,{door:'e',hole:[-12.3,7.1,-10.3,8.9]});
    mk(ctx,'simon',-11,8); mk(ctx,'simonIn',-9,8); mk(ctx,'simonDoor',-5.6,8); mk(ctx,'simonBed',-12.6,6.4);
    mk(ctx,'simonStair',-7.4,11.7); mk(ctx,'simonRoof',-11.3,9.8); mk(ctx,'simonHole',-11.3,8);
    room(ctx,st,2.5,-15.5,10,-8.5,{door:'w'});
    mk(ctx,'yair',6.4,-12); mk(ctx,'yairIn',4.2,-12); mk(ctx,'yairDoor',0.6,-12); mk(ctx,'yairBed',8.2,-14.2);
    hs.forEach(([x,z],k)=>W.house(st,x,z,6,5.5,{door:x>-12?'e':'w',color:k%2?BAS:BAS2,h:2.9}));
    { const qx=-8, qz=-6;                                                /* the qahal (Mark 1:21) */
      st.box(qx-6,0,qz-4.5,qx+6,0.3,qz+4.5,'cobble');
      st.box(qx-6,0.3,qz-4.5,qx-5.5,4,qz+4.5,BAS); st.box(qx+5.5,0.3,qz-4.5,qx+6,4,qz+4.5,BAS); st.box(qx-6,0.3,qz-4.5,qx+6,4,qz-4,BAS);
      for(const pz of [-2.2,0.6,3.4]) st.box(qx+5.3,0.3,pz-0.2+qz-0.6,qx+5.8,4,pz+0.2+qz-0.6,BAS2);
      st.box(qx-6.3,4,qz-4.8,qx+6.3,4.35,qz+4.8,C.roofEarth,{collide:false});
      st.box(qx-5.2,0.3,qz-3.6,qx+4.4,0.75,qz-3,C.stoneDark,{collide:false}); st.box(qx-5.2,0.3,qz+3,qx+4.4,0.75,qz+3.6,C.stoneDark,{collide:false});
      mk(ctx,'qahal',qx,qz); mk(ctx,'qahalIn',qx+2.6,qz); mk(ctx,'qahalDoor',qx+8.5,qz); }
    /* the beach: boats drawn up, nets on their racks */
    for(const z of [-14,-10]){ st.box(SHORE.x-4,0,z-0.1,SHORE.x-0.6,1.6,z+0.1,C.timber,{collide:false}); }
    st.box(SHORE.x-4,1.5,-14.1,SHORE.x-0.6,1.65,-9.9,0xb8a882,{collide:false});
    W.wild(ctx,'chicken',-16,14,4,3,0.4); W.wild(ctx,'goat',-28,-20,3,4,0.4); W.wild(ctx,'dog',-4,18,1,4,0.6);
    mk(ctx,'beach',SHORE.x-3,4); mk(ctx,'street',-2,0); mk(ctx,'house',4,10); mk(ctx,'houseDoor',8,10);
    mk(ctx,'mount',-30,6); mk(ctx,'mountTop',-35,6); mk(ctx,'mountCrowd',-24,6);   /* on the first slope of the hills above the town */
    ctx.api.clearTrees(-42,-6,-20,18);                                                /* the slope He taught and named the Twelve on, open */
  } else {
    for(let k=0;k<70;k++){ const x=-60+W.hash(k,7)*72, z=-50+W.hash(k,8)*100;
      if(Math.hypot(x+20,z)<26) continue; st.detail(x-0.4,ctx.groundY(x,z),z-0.4,x+0.4,ctx.groundY(x,z)+0.35,z+0.4,0x6e8a46); }
    mk(ctx,'beach',SHORE.x-3,0); mk(ctx,'slope',-20,0); mk(ctx,'seat',-30,0);
  }
  ctx.wind=o.wind||[0.9,0.5];
  ctx.bounds={x0:-200,x1:SHORE.x+3,z0:-80,z1:80};
}
S.galil=function(ctx,st){ galil(ctx,st,{village:true}); };
S.galilEast=function(ctx,st){ galil(ctx,st,{village:false}); };
/* the boat in the middle of the sea by night, the wind against it (Mattithyahu 14:24) */
S.galilSea=function(ctx,st){ galil(ctx,st,{village:false,wind:[3.2,-1.4]}); ctx.rough=3.5; ctx.bounds=null; };

/* ================= THE ROAD TO YAHRUSHALAYIM (Act V) ================= */

/* CAESAREA PHILIPPI (Mattithyahu 16:13), where the Yardĕn rises: a great face of rock at the
   foot of Ḥermon, a cave in it out of which the springs come, and the stream running away
   south between oaks; before the cave the white house Herodes built to Caesar, and niches cut
   in the rock for the idols of the nations; down the stream, the city Philip built and named. */
S.caesarea=function(ctx,st){
  ctx.wind=[0.8,0.4];
  W.ground(ctx,{color:C.grass,flat:30,peak:[{x:0,z:-74,h:26,r:46},{x:-52,z:-62,h:18,r:40},{x:48,z:-64,h:16,r:36}]});
  /* the face of the rock, and the cave at its foot */
  st.box(-30,0,-32,24,13,-22,C.limestone);
  st.box(-30,0,-36,24,9,-32,C.rock);
  st.box(-11,0,-27.5,-2,5.4,-22,'air');                                         /* the cave */
  for(const x of [5,9,13,17]) st.box(x-0.7,4.2,-22.6,x+0.7,6.4,-22,'air');      /* the niches for the idols */
  /* the house of Caesar before the cave: a podium, a cella, a porch of columns */
  st.box(2,0,-21.6,12,1,-12,C.whitewash);
  st.box(3,1,-21.4,11,6,-15.6,C.whitewash);
  for(const px of [2.6,5,7,9,11.4]) st.box(px-0.35,1,-13,px+0.35,6,-12.3,C.whitewash);
  st.box(1.6,6,-21.8,12.4,6.8,-11.8,C.limestone);
  /* the springs at the cave's mouth, and the stream they become */
  const sx=z=>-7+Math.sin(z*0.05)*4;
  st.box(-14,0,-21.8,-0.4,0.5,-21.2,C.stone);
  ctx.api.water(-14,-21.2,-0.4,-14,{depth:1,bed:'stone'});
  ctx.api.water(-16,-14,4,110,{depth:1,bed:'dirt',test:(x,z)=>Math.abs(x-sx(z))<2.4});
  for(let z=-12;z<100;z+=4.5) for(const sd of [-1,1]) if(W.hash(z,sd)<0.6) W.reeds(st,sx(z)+sd*3.2,z,0,5);
  /* oaks and planes along the water */
  for(let k=0;k<30;k++){ const z=-8+W.hash(k,3)*100, sd=W.hash(k,4)<0.5?-1:1, x=sx(z)+sd*(5+W.hash(k,5)*16);
    if(x>-2&&x<22&&z>-12&&z<26) continue;
    W.olive(st,x,z,1.2+W.hash(k,6)*0.4); }
  /* the city of Philip, down the stream: houses of the white stone, and the path up to the springs */
  [[30,24],[38,20],[36,32],[44,28],[28,36],[46,40]].forEach(([x,z],k)=>W.house(st,x,z,6,5.5,{door:'w',color:k%2?C.limestone:C.whitewash,h:3}));
  for(let k=0;k<22;k++){ const t=k/21, x=26-t*18, z=22-t*28; st.box(x-0.9,0,z-0.9,x+0.9,0.08,z+0.9,C.path,{collide:false,jitter:0.12}); }
  W.wild(ctx,'goat',-30,-40,3,6,0.5); W.wild(ctx,'lizard',14,-18,2,4,0.5);
  mk(ctx,'cave',-6.5,-20); mk(ctx,'spring',-6,-12.6); mk(ctx,'temple',7,-10.4); mk(ctx,'rock',16,-20.6);
  mk(ctx,'here',8,-2); mk(ctx,'path',24,18); mk(ctx,'city',34,28); mk(ctx,'stream',-3,8); mk(ctx,'foot',8,14);
  mk(ctx,'hermon',0,-74);
  ctx.bounds={x0:-120,x1:120,z0:-120,z1:120};
};

/* AYIN GANNIM, "the spring of gardens", where the plain of Yizre‛ĕl meets the hills of Shomeron:
   the last village of Shomeron on the road down from Galil (Luke 9:52; 17:11-12). Houses about
   a little square and its spring, gardens below it, the road going by to the south, and a field
   being ploughed beside the road (9:62). */
S.ginae=function(ctx,st){
  ctx.wind=[1,0.4];
  W.ground(ctx,{color:C.grassDry,flat:32,peak:[{x:-54,z:-40,h:14,r:40},{x:-44,z:52,h:10,r:34}]});
  const rx=z=>18+Math.sin(z*0.04)*4;
  for(let k=-50;k<50;k++){ const z=k*1.6, x=rx(z); st.box(x-1.1,0,z-0.9,x+1.1,0.08,z+0.9,C.path,{collide:false,jitter:0.12}); }
  const hs=[[-6,-14],[4,-15],[-15,-4],[-15,8],[-5,15],[6,15],[-25,-12],[-25,4]];
  hs.forEach(([x,z],k)=>W.house(st,x,z,6,5.5,{door:z<0?'s':(x<-10?'e':'n'),color:k%2?C.limestone:C.mudbrick,h:2.9}));
  st.box(-1.2,0,-1.2,1.2,0.6,1.2,C.stone); W.jar(st,1.7,0.6); W.jar(st,-1.8,-0.4);   /* the spring */
  /* under the vine before a house, a table: tax collectors and sinners eat at it (Luke 15:1-2) */
  for(const [a,b] of [[-6.4,5],[-0.6,5],[-6.4,9],[-0.6,9]]) st.box(a-0.12,0,b-0.12,a+0.12,2.7,b+0.12,C.timber,{collide:false});
  st.box(-6.8,2.7,4.6,-0.2,2.85,9.4,0x6d8a3e,{collide:false});
  st.box(-5.8,0,6.5,-1.2,0.42,7.5,C.timber);                                          /* low, as they reclined to eat */
  /* the gardens below the spring */
  for(let r=0;r<5;r++) for(let k=0;k<12;k++){ const x=-44+k*2.2, z=24+r*2.4; st.detail(x-0.3,0,z-0.3,x+0.3,0.5,z+0.3,[0x6d8a3e,0x7f8f4e,0x8a9a50][k%3]); }
  /* the field by the road, half ploughed */
  for(let r=0;r<7;r++){ const x=27+r*1.3; st.box(x-0.35,0,18,x+0.35,0.1,38,C.earth,{collide:false}); }
  for(let k=0;k<26;k++){ const a=W.hash(k,1)*6.28, r=34+W.hash(k,2)*40, x=Math.cos(a)*r, z=Math.sin(a)*r;
    if(Math.abs(x-rx(z))<6||(x>24&&x<40&&z>14&&z<42)) continue; W.olive(st,x,z,0.9+W.hash(k,3)*0.3); }
  W.wild(ctx,'chicken',-4,10,4,3,0.4); W.wild(ctx,'goat',-30,20,3,5,0.4); W.wild(ctx,'dog',8,4,1,4,0.6);
  mk(ctx,'spring',0,0); mk(ctx,'square',-2,2.4); mk(ctx,'table',-3.5,7); mk(ctx,'gate',12,1);
  mk(ctx,'roadN',rx(-64),-64); mk(ctx,'roadS',rx(64),64); mk(ctx,'bend',rx(-24),-24); mk(ctx,'by',rx(14),14);
  mk(ctx,'field',31,28); mk(ctx,'plough',30.4,24); mk(ctx,'meetLepers',rx(-50),-50); mk(ctx,'lepers',rx(-36)+4,-36);
  ctx.bounds={x0:-120,x1:120,z0:-120,z1:120};
};

/* YAHRIḤO, the city of palm trees (Deḇarim 34:3), in the deep of the rift: the road from the
   Yardĕn coming in at the east, out at the west and up through the wilderness to Yahrushalayim;
   houses of mudbrick within a low wall, the sycamore by the street (Luke 19:4), the house of
   Zakkai, the palms and gardens of the spring, and the mountains of the wilderness standing over
   the city on the west. */
function sycamore(st,x,z){
  st.box(x-0.55,0,z-0.55,x+0.55,2.5,z+0.55,'log');
  st.box(x,2.2,z-0.3,x+4.4,2.6,z+0.3,'log');                                      /* the low limb over the street */
  st.box(x-3.8,2.9,z-3.4,x+1.6,4.4,z+3.6,'leaves'); st.box(x-2.6,4.3,z-2.4,x+1,5.3,z+2.6,'leaves');
  st.box(x+0.6,4.7,z-1.8,x+3.6,5.5,z+2,'leaves');
}
S.yeriho=function(ctx,st){
  ctx.wind=[0.5,0.2];
  W.ground(ctx,{color:C.grass,flat:36,peak:[{x:-78,z:-10,h:24,r:46},{x:-70,z:44,h:16,r:36}]});
  const rz=x=>Math.sin(x*0.03)*2;
  for(let k=-62;k<62;k++){ const x=k*1.6, z=rz(x); st.box(x-0.9,0,z-1.3,x+0.9,0.08,z+1.3,C.path,{collide:false,jitter:0.12}); }
  /* the low wall, open where the road goes through */
  for(const gx of [-30,30]){ st.box(gx-0.8,0,-24,gx+0.8,3,-3.2,C.mudbrick); st.box(gx-0.8,0,3.2,gx+0.8,3,24,C.mudbrick);
    st.box(gx-1.4,0,-4.4,gx+1.4,3.8,-3.2,C.mudDark); st.box(gx-1.4,0,3.2,gx+1.4,3.8,4.4,C.mudDark); }
  st.box(-30,0,-24.8,30,3,-23.2,C.mudbrick); st.box(-30,0,23.2,30,3,24.8,C.mudbrick);
  [[-20,-10],[-8,-11],[6,-10],[18,-11],[-20,11],[-9,12],[22,11]].forEach(([x,z],k)=>W.house(st,x,z,6,5.5,{door:z<0?'s':'n',color:k%2?C.mudbrick:C.whitewash,h:2.9}));
  W.house(st,9,12.5,8,7,{door:'n',color:C.whitewash,h:3.2});                     /* the house of Zakkai */
  sycamore(st,-2,5);
  /* the palms of the city, and the gardens of the spring */
  for(let k=0;k<26;k++){ const x=-28+W.hash(k,7)*56, z=(W.hash(k,8)<0.5?-1:1)*(15+W.hash(k,9)*7); W.palm(st,x,z); }
  for(let k=0;k<30;k++){ const a=W.hash(k,11)*6.28, r=34+W.hash(k,12)*30, x=Math.cos(a)*r, z=Math.sin(a)*r;
    if(Math.abs(z-rz(x))<5) continue; if(x<-40) continue; W.palm(st,x,z); }
  for(let k=0;k<6;k++){ const x=-40-k*1.4; st.box(x-0.3,0,-3.2,x+0.3,0.5,-2.6,C.stone); }   /* stones by the way out */
  W.wild(ctx,'chicken',4,-6,3,3,0.4); W.wild(ctx,'donkey',26,8,1,2,0.3); W.wild(ctx,'dog',-14,4,1,4,0.6);
  mk(ctx,'gateE',33,0); mk(ctx,'gateW',-33,0); mk(ctx,'street',0,0); mk(ctx,'sycamore',-2,5);
  mk(ctx,'limb',1.2,5); mk(ctx,'zakkai',9,12.5); mk(ctx,'zakkaiDoor',9,7.8); mk(ctx,'zakkaiIn',9,11);
  mk(ctx,'roadE',72,rz(72)); mk(ctx,'plainE',52,rz(52)); mk(ctx,'bartimai',-42,-3.4); mk(ctx,'roadW',-64,rz(-64)); mk(ctx,'roadW2',-52,rz(-52));
  ctx.bounds={x0:-130,x1:130,z0:-120,z1:120};
};

/* THE MOUNT OF OLIVES, over against the city (Luke 19:29-41): Bĕyth Phaḡi on the shoulder of the
   mount, the road over the top and down its western face through the olive groves, and at the
   brow, across the Qidron, the whole city at once — her walls, and the House shining over them.
   The set is laid along the true line from here to her, so "down" is always toward the city. */
S.olives=function(ctx,st){
  ctx.wind=[0.8,0.3];
  const k=window.__KIT, A=ctx.anchor, yp=k.yahruPos&&k.yahruPos();
  let ux=-1, uz=0, dist=300, cy=0;
  if(yp&&A){ const dx=yp.x-A.x, dz=yp.z-A.z, d=Math.hypot(dx,dz)||1; ux=dx/d; uz=dz/d; dist=d/ctx.scene.scale.x;
    const c=k.cell(yp.ix,yp.iz); if(c) cy=(c.h*k.B-A.y)/ctx.scene.scale.x; }
  const vx=-uz, vz=ux, P=(a,b)=>[a*ux+b*vx,a*uz+b*vz];
  const top=P(-56,0);
  W.ground(ctx,{color:C.grassDry,flat:24,peak:[{x:top[0],z:top[1],h:12,r:44}]});
  /* the road from Bĕyth Phaḡi over the mount and down toward the city */
  const rb=a=>Math.sin(a*0.08)*5;
  for(let a=-46;a<=30;a+=1.2){ const p=P(a,rb(a)); st.box(p[0]-1,0,p[1]-1,p[0]+1,0.08,p[1]+1,C.path,{collide:false,jitter:0.12}); }
  /* Bĕyth Phaḡi, a few houses up on the shoulder; a door with a ring for tying a beast */
  [[-36,-12],[-42,-4],[-36,10],[-44,12]].forEach(([a,b],n)=>{ const p=P(a,b); W.house(st,p[0],p[1],5.5,5,{door:'s',color:n%2?C.limestone:C.whitewash,h:2.9}); });
  /* the olive groves either side of the way */
  for(let n=0;n<48;n++){ const a=-44+W.hash(n,3)*72, b=(W.hash(n,4)<0.5?-1:1)*(6+W.hash(n,5)*30);
    if(Math.abs(b-rb(a))<5) continue; const p=P(a,b); W.olive(st,p[0],p[1],0.9+W.hash(n,6)*0.35); }
  /* the stones of the hillside (Luke 19:40) */
  for(let n=0;n<14;n++){ const a=-20+W.hash(n,8)*48, b=rb(a)+(W.hash(n,9)<0.5?-1:1)*(2.4+W.hash(n,10)*2); const p=P(a,b); W.rock(st,p[0],p[1],0.4+W.hash(n,11)*0.3); }
  const M=(id,a,b)=>{ const p=P(a,b===undefined?rb(a):b); mk(ctx,id,p[0],p[1]); };
  M('phagi',-38,0); M('colt',-39,-7); M('wait',-24); M('top',-18); M('d0',-8); M('d1',0); M('d2',8); M('d3',16); M('brow',24); M('browSide',22,rb(22)+3.4);
  M('crowdA',-12,rb(-12)-4); M('crowdB',-4,rb(-4)+4); M('pharisees',18,rb(18)-3.6);
  { const c=Math.min(dist,420), p=P(c,0); ctx.markers.city=[p[0],p[1],cy+8]; }
  ctx.dir=[ux,uz];
  W.wild(ctx,'goat',P(-20,26)[0],P(-20,26)[1],3,5,0.4);
  ctx.bounds={x0:-140,x1:140,z0:-140,z1:140};
};
})();
