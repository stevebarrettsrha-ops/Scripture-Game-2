/* THE FULLNESS OF TIME — the places the story happens in.

   A setting builds its stage and names its MARKERS (where a figure stands,
   where a thing lies, where the player must go). The acts refer to places
   and markers by name and never to a coordinate, so a place can be rebuilt
   without a scene being rewritten.

   Scale: one unit is about a metre; a man is 1.8. */
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
  W.ground(ctx,{size:420,color:C.grassDry,alt:C.earth,flat:70,hills:9});
  const cx=0, cz=-20, hw=46, hd=58;
  W.wall(st,cx-hw,cz-hd,cx+hw,cz-hd);
  W.wall(st,cx+hw,cz-hd,cx+hw,cz+hd);
  W.wall(st,cx+hw,cz+hd,cx-hw,cz+hd,{gap:[cx-14,cz+hd,5]});
  W.wall(st,cx-hw,cz+hd,cx-hw,cz-hd);
  W.gate(st,cx-14,cz+hd,'x');
  W.hekal(st,cx+6,cz-30);
  const hx=cx-30, hz=cz+44;                             /* the house of the taught ones, below */
  /* the houses of the city, street by street, doors on the lanes */
  for(let r=0;r<4;r++) for(let c=0;c<6;c++){
    const x=cx-38+c*14+(W.hash(r,c)-0.5)*2, z=cz+2+r*12+(W.hash(c,r)-0.5)*2;
    if(Math.abs(x-(cx-14))<5&&r===3) continue;          /* keep the gate street open */
    if(Math.abs(x-(cx-2))<5) continue;                  /* the street up to the Hĕḵal */
    if(Math.abs(x-hx)<12&&Math.abs(z-hz)<11) continue;  /* the taught ones' court */
    W.house(st,x,z,6+W.hash(r*3,c)*2,6+W.hash(c*5,r)*2,{door:r%2?'n':'s',h:3+W.hash(r,c*7)*1.2});
  }
  /* the house where the taught ones keep the words (Yashayahu 8:16):
     a courtyard house near the gate, its court open to the sky */
  st.box(hx-6,0,hz-5,hx+6,0.2,hz+5,C.path,{collide:false});
  st.box(hx-6,0,hz-5,hx+6,2.6,hz-4.6,C.whitewash); st.box(hx-6,0,hz-5,hx-5.6,2.6,hz+5,C.whitewash);
  st.box(hx+5.6,0,hz-5,hx+6,2.6,hz+5,C.whitewash);
  st.box(hx-6,0,hz+4.6,hx-1.2,2.6,hz+5,C.whitewash); st.box(hx+1.2,0,hz+4.6,hx+6,2.6,hz+5,C.whitewash);
  st.box(hx-5.6,2.6,hz-4.6,hx+5.6,2.8,hz-1.8,C.roofEarth,{collide:false});
  W.desk(st,hx,hz-3); W.jar(st,hx+2,hz-3.6); W.jar(st,hx+2.6,hz-3.6);
  st.box(hx-4.8,0,hz-4.4,hx-3.2,1.8,hz-3.6,C.timber);             /* a shelf of scrolls */
  for(let k=0;k<4;k++) st.box(hx-4.7+k*0.4,1.8,hz-4.3,hx-4.4+k*0.4,2.1,hz-3.7,0xe0d4b0,{collide:false});
  mk(ctx,'studyDesk',hx,hz-1.8); mk(ctx,'studyDoor',hx,hz+6.5); mk(ctx,'studyIn',hx+2,hz);
  mk(ctx,'studyShelf',hx-4,hz-2.8);
  /* outside the gate: the highway of the Launderer's Field and the pool */
  const gx=cx-14, gz=cz+hd+6;
  mk(ctx,'gateIn',gx,cz+hd-8); mk(ctx,'gateOut',gx,gz+2);
  for(let k=0;k<30;k++) st.box(gx-2-k*1.6,0,gz+k*0.9-1.2,gx-0.4-k*1.6,0.12,gz+k*0.9+1.2,C.path,{collide:false,jitter:0.1});
  const px=gx-58, pz=gz+34;
  W.pool(ctx,st,px,pz,16,11,{channel:[gx-6,gz+2]});
  mk(ctx,'pool',px+10,pz+2); mk(ctx,'poolEnd',px+9.5,pz-6.5); mk(ctx,'ahaz',px+4,pz-8);
  mk(ctx,'field',px+22,pz+10);
  for(let k=0;k<7;k++){ const fx=px+14+k*3, fz=pz+14+(k%2)*2;       /* cloth laid out to dry: the Launderer's Field */
    st.box(fx,0.02,fz,fx+2.2,0.08,fz+1.4,[0xe8e2d0,0xc9b38a,0xa35a3a,0xe8e2d0][k%4],{collide:false}); }
  for(let k=0;k<26;k++){ const a=W.hash(k,3)*6.28, r=70+W.hash(k,9)*60; W.olive(st,Math.cos(a)*r+cx,Math.sin(a)*r+cz,0.9+W.hash(k,5)*0.4); }
  mk(ctx,'hekalView',cx+6,cz-2); mk(ctx,'hekal',cx+6,cz-24); mk(ctx,'street',cx-2,cz+30);
  ctx.bounds={x0:-200,x1:200,z0:-200,z1:200};
};

/* ================= NATSARETH, a village of Galil ================= */
S.natsareth=function(ctx,st){
  W.ground(ctx,{size:360,color:C.grass,alt:C.grassDry,flat:30,hills:14});
  const hs=[[-12,-6],[-4,-10],[6,-8],[14,-2],[-14,6],[10,8],[-3,12],[18,12]];
  hs.forEach(([x,z],k)=>W.house(st,x,z,5.5,5,{door:z<0?'s':'n',color:k%3?C.mudbrick:C.whitewash,h:2.8}));
  st.box(-1,0,-1,3,0.5,3,C.stone); W.jar(st,0,0); W.jar(st,1.2,0.4);            /* the spring */
  for(let k=0;k<18;k++){ const a=W.hash(k,1)*6.28, r=28+W.hash(k,2)*40; W.olive(st,Math.cos(a)*r,Math.sin(a)*r,1); }
  mk(ctx,'miryamHouse',-4,-6.4); mk(ctx,'miryam',-4,-5.2); mk(ctx,'malak',-4,-2.6); mk(ctx,'spring',1,2);
  mk(ctx,'yoseph',14,1.2); mk(ctx,'yosephDream',14,0.6);
  ctx.bounds={x0:-120,x1:120,z0:-120,z1:120};
};

/* ================= THE ROAD TO YAHUḎAH ================= */
S.road=function(ctx,st){
  W.ground(ctx,{size:420,color:C.grassDry,alt:C.sand,flat:8,hills:22});
  for(let k=-60;k<60;k++) st.box(k*1.5-0.8,0,-1.4+Math.sin(k*0.08)*3,k*1.5+0.8,0.1,1.4+Math.sin(k*0.08)*3,C.path,{collide:false,jitter:0.12});
  for(let k=0;k<24;k++){ const x=(W.hash(k,4)-0.5)*170, z=(W.hash(k,6)>0.5?1:-1)*(8+W.hash(k,8)*30); W.rock(st,x,z,1+W.hash(k,2)); if(k%3===0) W.olive(st,x+3,z+2,0.9); }
  mk(ctx,'roadA',-60,Math.sin(-40*0.08)*3); mk(ctx,'roadB',40,Math.sin(26*0.08)*3);
  ctx.bounds={x0:-150,x1:150,z0:-80,z1:80};
};

/* ================= THE FIELDS BY NIGHT, below Bĕyth Leḥem =================
   Pasture on the slope under the village: the fold of stacked stone, the
   shepherds' fire, the flock, and the lamps of the village up on the hill. */
S.fields=function(ctx,st){
  W.ground(ctx,{size:420,color:C.grass,alt:C.grassDry,flat:34,hills:10});
  W.fold(st,-8,-4,5);
  W.fire(ctx,st,4,4);
  for(let k=0;k<16;k++){ const a=W.hash(k,1)*6.28, r=W.hash(k,2)*3.2; ctx.flock.push(W.sheep(ctx,-8+Math.cos(a)*r,-4+Math.sin(a)*r,k%5===0)); }
  for(let k=0;k<30;k++){ const x=(W.hash(k,5)-0.5)*120, z=(W.hash(k,7)-0.5)*120; if(Math.hypot(x,z)<22) continue; W.rock(st,x,z,0.6+W.hash(k,3)); }
  /* the village on the hill, its lamps showing */
  for(let k=0;k<9;k++){ const x=-30+k*7+(W.hash(k,1)-0.5)*3, z=-62-W.hash(k,2)*8; W.house(st,x,z,5,5,{door:'s',h:3,noStair:true});
    if(k%2===0) W.glow(ctx,x,2,z+2.6,1.6,0xffc070,0); }
  mk(ctx,'fold',-8,1.6); mk(ctx,'foldIn',-8,-4); mk(ctx,'fire',4,4); mk(ctx,'sit',4,6.4);
  mk(ctx,'hill',-2,-40); mk(ctx,'villageRoad',-2,-52);
  mk(ctx,'s1',6.2,3.2); mk(ctx,'s2',2,5.8); mk(ctx,'s3',5.6,6.2);
  mk(ctx,'lamb1',22,-14); mk(ctx,'lamb2',-26,12); mk(ctx,'lamb3',16,24);
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
  ctx.bounds={x0:-100,x1:100,z0:-100,z1:100};
};
})();
