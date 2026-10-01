/* ================= YAHRUSHALAYIM — THE CITY OF THE GREAT KING =================
   ONE city for both games. The voyage raises her at boot where her hill is (31.78 N,
   35.23 E, engine.js yahruPos); THE FULLNESS OF TIME plays its scenes in her. She is laid
   through the engine's set builder (`api`, engine.js setBuilder): METRES about her anchor,
   y up from her ground, a man 1.85 m — so a street is a street to the folk that walk it.

   BY PERIOD — the same city, as she stood in the days the story is set:
     'kings'    in the days of Aḥaz and Ḥizqiyahu (and the voyage's own default): the
                Hĕḵal of Shelomoh on the height to the north, its porch and the two pillars,
                Yakin and Boaz, the altar before it, the inner court and the outer;
     'herodes'  in the days of Herodes, who rebuilt the house and raised the great courts
                about it (Yahuchanon 2:20 — "forty-six years this Hĕḵal was being built"):
                a vast platform on walls of great stones, its edges colonnaded, the house
                taller and white, and the fortress at its corner.
   The houses of the city, the wall and its gate, the house of the taught ones (Yashayahu
   8:16), the highway of the Launderer's Field and the upper pool with its channel
   (Yashayahu 7:3) stand in both.

   Her `marks` are where the story's figures stand and walk; a scene asks for them by name.
   The anchor is the city's southern quarter; north is −z, as it is in this world. */
(function(){
window.YAHRU_PLAN=function(api,period){
  const LIME=0xd8cfb8, STONE=0x9c9486, STONE2=0x7a7266, PATH=0xb49a74, TIMBER=0x6e5238, GOLD='hay', WHITE=0xece6d6;
  const hash=(x,z)=>{ const s=Math.sin(x*127.1+z*311.7)*43758.5453; return s-Math.floor(s); };
  const cx=0, cz=-20, hw=46, hd=58;
  const herod=period==='herodes';

  /* ---- the ground made level within the walls, and about the pool without them ---- */
  /* she stands on Mount Moriyah (world/landmarks.js): where her level ground stands out over
     the mountain's flank it is held up as the city's terraces were, in coursed stone */
  api.pad(cx-hw-6,cz-hd-6,cx+hw+6,cz+hd+8,{fill:'cobble'});
  api.pad(-98,38,-6,100,{round:true,fill:'cobble'});

  /* ---- THE WALL, with crenels, and the gate in the south-west ---- */
  const wall=(x0,z0,x1,z1,gap)=>{ const h=7, t=2.2, dx=x1-x0, dz=z1-z0, L=Math.hypot(dx,dz), n=Math.max(1,Math.round(L/2));
    for(let k=0;k<n;k++){ const a=k/n, b=(k+1)/n, ax=x0+dx*a, az=z0+dz*a, bx=x0+dx*b, bz=z0+dz*b;
      if(gap&&Math.hypot((ax+bx)/2-gap[0],(az+bz)/2-gap[1])<gap[2]) continue;
      const mx=(ax+bx)/2, mz=(az+bz)/2, rx=Math.abs(bx-ax)/2+t/2, rz=Math.abs(bz-az)/2+t/2;
      api.box(mx-rx,0,mz-rz,mx+rx,h,mz+rz,LIME);
      if(k%2===0) api.box(mx-rx*0.6,h,mz-rz*0.6,mx+rx*0.6,h+1,mz+rz*0.6,LIME);
      if(k%9===0) api.box(mx-2.4,0,mz-2.4,mx+2.4,h+2.6,mz+2.4,LIME); } };   /* towers */
  wall(cx-hw,cz-hd,cx+hw,cz-hd); wall(cx+hw,cz-hd,cx+hw,cz+hd);
  wall(cx+hw,cz+hd,cx-hw,cz+hd,[cx-14,cz+hd,5]); wall(cx-hw,cz+hd,cx-hw,cz-hd);
  { const x=cx-14, z=cz+hd, w=4, h=9;                                         /* the gate */
    api.box(x-w/2-3,0,z-2.4,x-w/2,h,z+2.4,LIME); api.box(x+w/2,0,z-2.4,x+w/2+3,h,z+2.4,LIME);
    api.box(x-w/2,5.4,z-2.2,x+w/2,h-1,z+2.2,LIME); }

  /* ---- THE HOUSE OF ALUAHIM, on the height to the north ---- */
  const hx=cx+6, hz=cz-30;
  if(!herod){
    api.box(hx-16,0,hz-20,hx+16,1.2,hz+20,STONE);                       /* the outer court */
    api.box(hx-10,1.2,hz-14,hx+10,2.2,hz+14,LIME);                      /* the inner court */
    for(let s=0;s<3;s++) api.box(hx-3,0.4*s,hz+20+(2-s)*0.8,hx+3,0.4*(s+1),hz+21+(2-s)*0.8,STONE);
    api.box(hx-5,2.2,hz-11,hx+5,12,hz+3,LIME);                            /* the house */
    api.box(hx-5.6,12,hz-11.6,hx+5.6,12.6,hz+3.6,STONE);
    api.box(hx-5,2.2,hz+3,hx+5,14,hz+6,LIME);                             /* the porch */
    api.box(hx-4.2,2.2,hz+7.2,hx-2.8,10,hz+8.6,GOLD);                     /* Yakin and Boaz */
    api.box(hx+2.8,2.2,hz+7.2,hx+4.2,10,hz+8.6,GOLD);
    api.box(hx-1.2,2.2,hz+6,hx+1.2,7,hz+6.4,'air');                       /* the doorway */
    api.box(hx-2,2.2,hz+10.5,hx+2,3.6,hz+13,0xa99c84);                    /* the altar */
    api.mark('pinnacle',hx,hz+4.4); api.mark('pinnacleY',14,0);
  } else {
    /* the great courts of Herodes: a platform on walls of great stones, colonnades about
       its edges (the porches of the court), the house raised high and white in the midst,
       the court of the women before it, and the fortress at the north-west corner */
    const P={x0:cx-40,x1:cx+40,z0:cz-58+2,z1:cz-26}, ph=3.2;
    api.box(P.x0,0,P.z0,P.x1,ph,P.z1,STONE);
    for(let x=P.x0;x<P.x1;x+=4) api.box(x+0.2,ph-0.4,P.z1-0.6,x+3.8,ph,P.z1,STONE2);   /* the courses of great stones */
    for(let s=0;s<4;s++) api.box(cx-14+s*0.8,0,P.z1+s*0.9,cx-8-s*0.8,ph-s*0.8,P.z1+(s+1)*0.9,STONE);   /* the steps up from the south */
    const colonnade=(x0,z0,x1,z1)=>{ const L=Math.hypot(x1-x0,z1-z0), n=Math.floor(L/3.2);
      for(let k=0;k<=n;k++){ const x=x0+(x1-x0)*k/n, z=z0+(z1-z0)*k/n; api.box(x-0.5,ph,z-0.5,x+0.5,ph+6,z+0.5,WHITE); }
      api.box(Math.min(x0,x1)-1.2,ph+6,Math.min(z0,z1)-1.2,Math.max(x0,x1)+1.2,ph+6.7,Math.max(z0,z1)+1.2,TIMBER); };
    colonnade(P.x0+1,P.z1-1.5,P.x1-1,P.z1-1.5);                           /* the royal porch, south */
    colonnade(P.x1-1.5,P.z0+1,P.x1-1.5,P.z1-1);                            /* Shelomoh's porch, east */
    colonnade(P.x0+1,P.z0+1.5,P.x1-1,P.z0+1.5);
    api.box(hx-14,ph,hz-16,hx+14,ph+1.2,hz+14,LIME);                       /* the inner courts */
    api.box(hx-11,ph+1.2,hz+8,hx+11,ph+1.4,hz+14,PATH);                    /* the court of the women */
    api.box(hx-6,ph+1.2,hz-13,hx+6,ph+17,hz+1,WHITE);                      /* the house, raised high */
    api.box(hx-9,ph+1.2,hz+1,hx+9,ph+19,hz+4.5,WHITE);                     /* the porch, broad and taller */
    api.box(hx-9.4,ph+19,hz+0.6,hx+9.4,ph+19.6,hz+4.9,GOLD);               /* gold along its crown */
    api.box(hx-1.6,ph+1.2,hz+4.5,hx+1.6,ph+10,hz+4.9,'air');              /* its great doorway */
    api.box(hx-3,ph+1.2,hz+6.5,hx+3,ph+3.4,hz+10,0xa99c84);                /* the altar */
    /* the fortress at the corner, its four towers (later called Antonia) */
    const A={x0:P.x0-2,x1:P.x0+14,z0:P.z0-2,z1:P.z0+12};
    api.box(A.x0,0,A.z0,A.x1,ph+9,A.z1,LIME);
    for(const [tx,tz] of [[A.x0,A.z0],[A.x1,A.z0],[A.x0,A.z1],[A.x1,A.z1]]) api.box(tx-2,0,tz-2,tx+2,ph+14,tz+2,LIME);
    api.mark('pinnacle',hx,hz+2.8); api.mark('pinnacleY',ph+19.6,0);
  }

  /* ---- THE HOUSES OF THE CITY, street by street, doors on the lanes ---- */
  const tx=cx-30, tz=cz+44;                                                 /* the taught ones' court */
  for(let r=0;r<4;r++) for(let c=0;c<6;c++){
    const x=cx-38+c*14+(hash(r,c)-0.5)*2, z=cz+2+r*12+(hash(c,r)-0.5)*2;
    if(Math.abs(x-(cx-14))<5&&r===3) continue;                             /* the gate street */
    if(Math.abs(x-tx)<12&&Math.abs(z-tz)<11) continue;
    if(x>4&&x<26&&r===3) continue;                                         /* the square before the south wall */
    api.house(x,z,6+hash(r*3,c)*2,6+hash(c*5,r)*2,{door:r%2?'n':'s',seed:r*7+c+3});
  }
  /* the street up to the house of Aluahim */
  api.top(cx-3.2,cz-20,cx-0.8,cz+56,PATH);
  /* ---- THE HOUSE OF THE TAUGHT ONES (Yashayahu 8:16): a courtyard open to the sky ---- */
  api.top(tx-6,tz-5,tx+6,tz+5,PATH);
  api.box(tx-6,0,tz-5,tx+6,2.6,tz-4.4,WHITE); api.box(tx-6,0,tz-5,tx-5.4,2.6,tz+5,WHITE);
  api.box(tx+5.4,0,tz-5,tx+6,2.6,tz+5,WHITE);
  api.box(tx-6,0,tz+4.4,tx-1.2,2.6,tz+5,WHITE); api.box(tx+1.2,0,tz+4.4,tx+6,2.6,tz+5,WHITE);
  api.box(tx-5.4,2.6,tz-4.4,tx+5.4,3.0,tz-1.6,0xa28a66);                   /* the roofed side */
  api.box(tx-0.9,0,tz-3.5,tx+0.9,0.8,tz-2.5,TIMBER);                         /* the desk */
  api.box(tx-4.8,0,tz-4.4,tx-3.2,1.8,tz-3.6,TIMBER);                         /* the shelf of scrolls */
  api.mark('studyDesk',tx,tz-1.8); api.mark('studyDoor',tx,tz+6.5); api.mark('studyIn',tx+2,tz); api.mark('studyShelf',tx-4,tz-2.8);

  /* ---- OUTSIDE THE GATE: the highway of the Launderer's Field, and the upper pool ---- */
  const gx=cx-14, gz=cz+hd+6;
  api.mark('gateIn',gx,cz+hd-8); api.mark('gateOut',gx,gz+2);
  for(let k=0;k<30;k++) api.top(gx-2-k*1.6,gz+k*0.9-1.2,gx-0.4-k*1.6,gz+k*0.9+1.2,PATH);
  const px=gx-58, pz=gz+34, pw=16, pd=11;
  api.water(px-pw/2,pz-pd/2,px+pw/2,pz+pd/2,{depth:2,bed:'stone'});
  api.box(px-pw/2-1,0,pz-pd/2-1,px+pw/2+1,0.6,pz-pd/2,STONE); api.box(px-pw/2-1,0,pz+pd/2,px+pw/2+1,0.6,pz+pd/2+1,STONE);
  api.box(px-pw/2-1,0,pz-pd/2,px-pw/2,0.6,pz+pd/2,STONE); api.box(px+pw/2,0,pz-pd/2,px+pw/2+1,0.6,pz+pd/2,STONE);
  { const L=Math.hypot(gx-6-px,gz+2-pz), n=Math.ceil(L/1.6);                 /* the conduit toward the city */
    for(let k=0;k<=n;k++){ const t=k/n, qx=px+(gx-6-px)*t, qz=pz+(gz+2-pz)*t; api.top(qx-0.8,qz-0.8,qx+0.8,qz+0.8,STONE2); } }
  api.mark('pool',px+10,pz+2); api.mark('poolEnd',px+9.5,pz-6.5); api.mark('ahaz',px+4,pz-8); api.mark('field',px+22,pz+10);
  for(let k=0;k<7;k++){ const fx=px+14+k*3, fz=pz+14+(k%2)*2;               /* cloth laid out to dry */
    api.top(fx,fz,fx+2.2,fz+1.4,[0xefe9dc,0xcdb36a,0xa8835a,0xefe9dc][k%4]); }
  /* ---- olives on the terraces without the walls ---- */
  for(let k=0;k<26;k++){ const a=hash(k,3)*6.28, r=70+hash(k,9)*50, ox=Math.cos(a)*r+cx, oz=Math.sin(a)*r+cz;
    if(ox<-60&&oz>30) continue;                                              /* the pool's field stays open */
    const y=api.groundY(ox,oz);
    api.box(ox-0.4,y,oz-0.4,ox+0.4,y+2.2,oz+0.4,0x5d4a36);
    api.box(ox-1.8,y+1.8,oz-1.8,ox+1.8,y+3.6,oz+1.8,0x6d7a4a); }

  api.mark('hekalView',cx+6,cz-2); api.mark('hekal',cx+6,cz-24); api.mark('street',cx-2,cz+30);
  api.mark('square',15,30);
};
})();
