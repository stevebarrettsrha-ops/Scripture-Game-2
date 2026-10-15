/* ================= THE MASON'S KIT OF THE CITIES OF THE ANCIENTS (ROADMAP Phase D4) =================
   The cities of the old world, each built as herself and set at her own latitude and longitude on the
   true earth: Baḇel, Ninewĕh, Ur, Noph, No-Amon, Tsor, Tsidon, Dammeseq and Rome, one file to a city in
   this folder, as the city of the great king is written in world/yahrushalayim-true.js.

   A city's file says:
     n, land        her name, and the nation she is reckoned to (by its name in countries/)
     lat, lon       where she stands; or `at`, the name of a work of the ancients in world/landmarks.js she
                    was built about (Etemenanki, the house of Amun, the gate of Nergal, the tower of the moon),
                    whose site is then her anchor, so the work stands where her plan has it
     base           (optional) her ground, in metres over the sea; else the land's own height at her anchor
     square         [x, z]: her market square, where her well is and her folk gather
     reach          how far her streets and lanes run from the square, in metres (her country lies beyond)
     folk           how many of her houses are given households
     coast          whether she is a city of the sea (her stalls sell fish; a land's own great city of her
                    name, Tsor, is she)
     ground         her ground, as her people made it (see js/engine.js, ancientGround):
                      level: [{x,z,rx,rz,blend,y,kind}]   the plain levelled, eased into the land beyond
                      hills: [[x,z,h,rx,rz,fall,kind]]     tells and hills heaped up over her base
                      waters:[{pts,w,level,depth,sea}]     rivers, canals and moats
                      pools: [[x0,z0,x1,z1,level,depth]]   basins and harbours
                      land:  [[[x,z],...]]                 ground raised out of the sea
                      sea, cut: [[[x,z],...]]              ground given back to it (before and after `land`)
     plan           function*(api): her stone, laid by the set builder (setBuilder in js/engine.js), yielding
                    between its parts so she rises a part to a frame

   Metres about her anchor: x as the world's own x and z as its z (the plan stands square to the blocks, as
   the city of the great king does: "north" in these files is −z, which on the true earth's disc lies a
   little off the true north by the longitude), y over her base. The tools below are the masons'. */
(function(){
window.EARTH=window.EARTH||{};
EARTH.ancientList=EARTH.ancientList||[];
EARTH.ancient=EARTH.ancient||function(d){ this.ancientList.push(d); };
const MPB=6/6.5;                                   /* a course of the earth, in metres */
const hsh=(x,z)=>{ const s=Math.sin(x*127.1+z*311.7)*43758.5453; return s-Math.floor(s); };

window.ANCIENT_KIT=function(api,def){
  const G=def.ground||{};
  const box=(x0,y0,z0,x1,y1,z1,m,o)=>api.box(Math.min(x0,x1),Math.min(y0,y1),Math.min(z0,z1),Math.max(x0,x1),Math.max(y0,y1),Math.max(z0,z1),m,o);
  const K={api,box,hsh,MPB};
  /* ---- THE MASON'S LINE: A FACE ON A BLOCK'S EDGE ----
     Her anchor stands at the middle of a block and her base on a course, so the edges of the blocks lie at
     x (and z) = (k − ½) courses and y = k courses. A wall a block thick laid off that line is ONE block
     thick; laid anywhere else it straddles two, and a city of such walls is twice the stone she needs. */
  K.sx=v=>(Math.round(v/MPB+0.5)-0.5)*MPB;
  K.sy=v=>Math.round(v/MPB)*MPB;
  /* A HALL OR A HOUSE-BLOCK, as a builder of the plain built them: its walls a block thick, its flat roof a
     course, its rooms dark within; `courts` [[x,z,hw,hd]] open to the sky through the roof, `doors` [[x,z]] on
     its faces, a parapet about its roof. Returns its floor. */
  K.hall=(x0,z0,x1,z1,h,m,o)=>{ o=o||{}; const sx=K.sx, a0=sx(Math.min(x0,x1)), a1=sx(Math.max(x0,x1)), b0=sx(Math.min(z0,z1)), b1=sx(Math.max(z0,z1));
    const y=o.y!==undefined?K.sy(o.y):K.sy(K.foot(a0,b0,a1,b1)), top=y+Math.max(2,K.sy(h)), t=(o.t||1)*MPB;
    /* (its walls footed on the ground under them; a floor laid only where one is asked for) */
    if(o.floor) box(a0,y-MPB,b0,a1,y,b1,o.floor,{foot:true});
    else { box(a0,y-MPB,b0,a1,y,b0+t,m,{foot:true}); box(a0,y-MPB,b1-t,a1,y,b1,m,{foot:true}); box(a0,y-MPB,b0+t,a0+t,y,b1-t,m,{foot:true}); box(a1-t,y-MPB,b0+t,a1,y,b1-t,m,{foot:true}); }
    const holes=[[a0+t,y,b0+t,a1-t,top-MPB,b1-t]];
    for(const c of o.courts||[]) holes.push([sx(c[0]-c[2]),y,sx(c[1]-c[3]),sx(c[0]+c[2]),top+0.1,sx(c[1]+c[3])]);
    for(const d of o.doors||[]){ const onX=Math.abs(d[1]-b0)<t+0.1||Math.abs(d[1]-b1)<t+0.1, w=d[2]||1.4;
      holes.push(onX?[sx(d[0]-w),y,d[1]-t-0.2,sx(d[0]+w),y+Math.min(top-y-MPB,d[3]||3*MPB),d[1]+t+0.2]:[d[0]-t-0.2,y,sx(d[1]-w),d[0]+t+0.2,y+Math.min(top-y-MPB,d[3]||3*MPB),sx(d[1]+w)]); }
    K.carve([a0,y,b0,a1,top,b1],holes,m);
    if(o.roof){ const cs=(o.courts||[]).map(c=>[sx(c[0]-c[2]),top-MPB,sx(c[1]-c[3]),sx(c[0]+c[2]),top+0.1,sx(c[1]+c[3])]);   /* (a roof of tiles, or of earth with a garden on it) */
      if(!cs.length) box(a0+t,top-MPB,b0+t,a1-t,top,b1-t,o.roof); else K.carve([a0+t,top-MPB,b0+t,a1-t,top,b1-t],cs,o.roof); }
    if(o.parapet!==false){ box(a0,top,b0,a1,top+MPB,b0+MPB,m); box(a0,top,b1-MPB,a1,top+MPB,b1,m); box(a0,top,b0,a0+MPB,top+MPB,b1,m); box(a1-MPB,top,b0,a1,top+MPB,b1,m); }
    return y; };
  /* THE GROUND WHERE HER OWN PLAN MADE IT, in metres over her base, laid course by course as the earth lays
     it; beyond her levelled plain, the land's own */
  K.g=(x,z)=>{ let y=null;
    for(const L of G.level||[]) if(Math.hypot((x-L.x)/L.rx,(z-L.z)/L.rz)<=1) y=L.y||0;
    if(y===null) return api.groundY(x,z);
    let top=-1; for(const H of G.hills||[]){ const q=Math.hypot((x-H[0])/H[3],(z-H[1])/H[4]); let f;
      if(H[7]){ const d=Math.abs(q-1)*Math.min(H[3],H[4]); if(d>=H[7]/2) continue; f=Math.min(1,(1-d/(H[7]/2))/(H[5]||0.5)); }
      else { if(q>=1) continue; f=Math.min(1,(1-q)/(H[5]||0.5)); }
      const m=H[2]*f*f*(3-2*f); if(m>top) top=m; }
    return Math.max(Math.round(y/MPB),top>0?Math.round(top/MPB):-1e9)*MPB; };
  /* the lowest ground under a footprint: its corners, its edges' middles and its middle */
  K.foot=(x0,z0,x1,z1)=>{ let m=Infinity; for(const fx of [0,0.5,1]) for(const fz of [0,0.5,1]) m=Math.min(m,K.g(x0+(x1-x0)*fx,z0+(z1-z0)*fz)); return m; };
  /* a mass standing on the ground under the whole of it, sunk a course into it */
  K.mass=(x0,z0,x1,z1,h,m,o)=>{ const y=(o&&o.y!==undefined)?o.y:K.foot(x0,z0,x1,z1); box(x0,y-MPB,z0,x1,y+h,z1,m,{foot:true}); return y; };
  /* the mason's tools of the wonders (a carved block, a round shaft, a flight of steps, a stepped gable,
     merlons, an obelisk, an oval, a ring of wall), on her ground */
  Object.assign(K,window.WONDER_KIT({box:(a,b,c,d,e,f,m)=>box(a,b,c,d,e,f,m),level:()=>{},ground:(x,z)=>K.g(x,z)}));

  /* ---- A WALL ALONG A LINE OF POINTS, with its towers and its gates ----
     o: h (height), t (thickness), m (its stone), towers (every so many metres), tw (a tower's breadth),
        th (a tower over the wall), gates [[x,z,half-width,name]] (the wall open there, a tower either side
        and a lintel over), crenel (merlons on its face), hollow (a wall of many metres is laid as its two
        faces and its walk, the core within never seen) */
  K.wall=(pts,o)=>{ o=o||{}; const h=o.h||10, t=o.t||4, m=o.m||'mudbrick', every=o.towers||0, tw=o.tw||Math.max(6,t+3), th=o.th||5, gates=o.gates||[];
    let run=0;
    for(let p=0;p+1<pts.length;p++){ const [x0,z0]=pts[p], [x1,z1]=pts[p+1], L=Math.hypot(x1-x0,z1-z0), n=Math.max(1,Math.round(L/3));
      const ax=Math.abs(z1-z0)<0.01, az=Math.abs(x1-x0)<0.01;          /* (square to the blocks) */
      for(let k=0;k<n;k++){ const a=k/n, b=(k+1)/n, sx=x0+(x1-x0)*a, sz=z0+(z1-z0)*a, ex=x0+(x1-x0)*b, ez=z0+(z1-z0)*b, mx=(sx+ex)/2, mz=(sz+ez)/2;
        run+=L/n;
        if(gates.some(g=>Math.hypot(mx-g[0],mz-g[1])<g[2])) continue;
        /* (a wall that runs aslant the blocks cannot be laid hollow; it is laid solid and no thicker than five
           metres, its breadth stepped like a stair) */
        const tt=(ax||az)?t:Math.min(t,5), rx=Math.abs(ex-sx)/2+tt/2, rz=Math.abs(ez-sz)/2+tt/2;
        /* (o.from: a wall that rises out of the sea is laid up from the bed, there being no ground to foot it on) */
        const y=o.from!==undefined?K.sy(o.from)+MPB:K.sy(K.foot(mx-rx,mz-rz,mx+rx,mz+rz)), top=K.sy((o.from!==undefined?0:K.g(mx,mz))+h);
        const a0=K.sx(mx-rx), a1=K.sx(mx+rx), b0=K.sx(mz-rz), b1=K.sx(mz+rz);
        if(o.hollow&&(ax||az)&&t>2.5){                                    /* its two faces a block thick, and the walk over the core */
          if(ax){ box(a0,y-MPB,b0,a1,top,b0+MPB,m,{foot:true}); box(a0,y-MPB,b1-MPB,a1,top,b1,m,{foot:true}); box(a0,top-MPB,b0+MPB,a1,top,b1-MPB,m); }
          else { box(a0,y-MPB,b0,a0+MPB,top,b1,m,{foot:true}); box(a1-MPB,y-MPB,b0,a1,top,b1,m,{foot:true}); box(a0+MPB,top-MPB,b0,a1-MPB,top,b1,m); } }
        else box(a0,y-MPB,b0,a1,top,b1,m,{foot:true});
        if(o.crenel!==false&&k%2===0){ const cx=ax?rx*0.45:Math.min(rx,0.55), cz=az?rz*0.45:Math.min(rz,0.55);   /* merlons on the outer face */
          const ox=az?(o.out||1)*(rx-0.55):0, oz=ax?(o.out||1)*(rz-0.55):0;
          box(mx+ox-cx,top,mz+oz-cz,mx+ox+cx,top+1.3,mz+oz+cz,m); }
        if(every&&run>=every){ run=0; K.tower(mx,mz,tw,tw,h+th,m); } } }
    for(const gt of gates){ K.gate(pts,gt,Object.assign({},o,{h,t,m})); } };
  /* a tower standing on its own lowest ground, crenellated */
  K.tower=(x,z,w,d,h,m,o)=>{ const a0=K.sx(x-w/2), a1=K.sx(x+w/2), b0=K.sx(z-d/2), b1=K.sx(z+d/2), y=K.sy(K.foot(a0,b0,a1,b1)), top=K.sy(K.g(x,z)+h);
    if(w>5&&d>5&&!(o&&o.solid)){ box(a0,y-MPB,b0,a1,y,b1,m,{foot:true});                   /* (its walls and its roof; the room within unseen) */
      K.carve([a0,y,b0,a1,top,b1],[[a0+MPB,y,b0+MPB,a1-MPB,top-MPB,b1-MPB]],m); }
    else box(a0,y-MPB,b0,a1,top,b1,m,{foot:true});
    for(let k=0;k<4;k++){ const sx=k&1?1:-1, sz=k&2?1:-1, cx=sx>0?a1:a0, cz=sz>0?b1:b0; box(cx-sx*2*MPB,top,cz-sz*2*MPB,cx,top+2*MPB,cz,m); }
    return top; };
  /* a gate in a wall: its two towers along the wall at either side of the way, the lintel over, the way paved */
  K.gate=(pts,g,o)=>{ const [gx,gz,hw]=g, h=o.h||10, t=o.t||4, m=o.gm||o.m||'mudbrick', gt=o.gt||Math.max(7,t+3);
    let ux=1, uz=0, bd=Infinity;
    for(let p=0;p+1<pts.length;p++){ const [x0,z0]=pts[p], [x1,z1]=pts[p+1], L=Math.hypot(x1-x0,z1-z0)||1, tt=Math.max(0,Math.min(1,((gx-x0)*(x1-x0)+(gz-z0)*(z1-z0))/(L*L)));
      const dd=Math.hypot(gx-(x0+(x1-x0)*tt),gz-(z0+(z1-z0)*tt)); if(dd<bd){ bd=dd; ux=(x1-x0)/L; uz=(z1-z0)/L; } }
    const y=K.g(gx,gz);
    for(const sd of [-1,1]){ const tx=gx+ux*sd*(hw+gt/2), tz=gz+uz*sd*(hw+gt/2); K.tower(tx,tz,Math.abs(ux)*gt+Math.abs(uz)*(t+4),Math.abs(uz)*gt+Math.abs(ux)*(t+4),h+(o.gth||7),m); }
    const lx=Math.abs(ux)*hw+Math.abs(uz)*(t/2+2), lz=Math.abs(uz)*hw+Math.abs(ux)*(t/2+2), oh=Math.min(h-1.5,o.gh||Math.max(5.5,hw*1.6));
    box(gx-lx,y+oh,gz-lz,gx+lx,y+h+1.5,gz+lz,m);
    api.top(gx-lx,gz-lz,gx+lx,gz+lz,o.pave||'hewn-stone');
    if(g[3]) api.mark(g[3],gx,gz); };
  /* columns along a line, every `step` metres, each on its own ground unless y0 is given */
  K.cols=(x0,z0,x1,z1,y0,h,step,r,m)=>{ const L=Math.hypot(x1-x0,z1-z0), n=Math.max(1,Math.round(L/step));
    for(let k=0;k<=n;k++){ const x=x0+(x1-x0)*k/n, z=z0+(z1-z0)*k/n, yb=y0===null?K.g(x,z):y0;
      box(x-r,yb,z-r,x+r,yb+h,z+r,m||'marble',{foot:true}); box(x-r-0.3,yb+h-0.6,z-r-0.3,x+r+0.3,yb+h,z+r+0.3,m||'marble'); } };
  /* a way paved along a line of points, `w` broad */
  K.street=(pts,w,m)=>{ for(let p=0;p+1<pts.length;p++){ const [x0,z0]=pts[p], [x1,z1]=pts[p+1], L=Math.hypot(x1-x0,z1-z0), n=Math.max(1,Math.ceil(L/3));
      for(let k=0;k<n;k++){ const mx=x0+(x1-x0)*(k+0.5)/n, mz=z0+(z1-z0)*(k+0.5)/n, hx=Math.abs(x1-x0)/n/2+w/2*Math.abs(z1-z0)/L+0.2, hz=Math.abs(z1-z0)/n/2+w/2*Math.abs(x1-x0)/L+0.2;
        api.top(mx-Math.max(hx,0.6),mz-Math.max(hz,0.6),mx+Math.max(hx,0.6),mz+Math.max(hz,0.6),m||'path'); } } };
  /* A QUARTER OF HOUSES: lots on a grid of `pitch` metres between x0..x1, z0..z1, each a house of its land
     on the ground where it stands; `keep(x,z)` says where a lot may be (not in a street, a court, the river).
     Returns how many were laid. */
  K.quarter=(x0,z0,x1,z1,pitch,keep,o)=>{ o=o||{}; const list=[], wmin=o.w||7, wv=o.wv===undefined?4:o.wv;
    for(let x=x0;x<=x1;x+=pitch) for(let z=z0;z<=z1;z+=pitch){
      const hx=x+(hsh(x,z)-0.5)*(o.jit||2), hz=z+(hsh(z,x)-0.5)*(o.jit||2);
      if(keep&&!keep(hx,hz)) continue;
      const w=wmin+hsh(x*2,z)*wv, d=wmin+hsh(z*2,x)*wv;
      list.push({x:hx,z:hz,w,d,door:o.door||(hsh(x,z*3)<0.5?'n':'s'),seed:Math.floor(hsh(x*5,z*5)*997)+1}); }
    if(list.length) api.quarter(list,o.style?{style:o.style}:undefined);
    return list.length; };
  /* a date palm, or an olive, or a cypress: its trunk and its crown, on its ground */
  K.palm=(x,z,h)=>{ const y=K.g(x,z); h=h||9; box(x-0.45,y-MPB,z-0.45,x+0.45,y+h,z+0.45,'log'); box(x-2.4,y+h-0.5,z-0.6,x+2.4,y+h+0.6,z+0.6,'leaves'); box(x-0.6,y+h-0.5,z-2.4,x+0.6,y+h+0.6,z+2.4,'leaves'); box(x-1.2,y+h+0.4,z-1.2,x+1.2,y+h+1.4,z+1.2,'leaves'); };
  K.tree=(x,z,h,kind)=>{ const y=K.g(x,z); h=h||4; box(x-0.45,y-MPB,z-0.45,x+0.45,y+h,z+0.45,kind==='olive'?'log-olive':'log'); box(x-2,y+h-1,z-2,x+2,y+h+1.4,z+2,kind==='olive'?'leaves-olive':'leaves'); };
  K.cypress=(x,z,h)=>{ const y=K.g(x,z); h=h||10; box(x-0.45,y-MPB,z-0.45,x+0.45,y+2,z+0.45,'log'); box(x-1,y+1.5,z-1,x+1,y+h,z+1,'leaves'); };
  /* A TEMPLE OF THE NATIONS ON ITS PODIUM: `len` along the way it faces (`dir`: 'n','s','e','w'), `wid` across,
     columns all about (peri) or at its front only (pro), a cella within, a pediment over */
  K.temple=(cx,cz,len,wid,o)=>{ o=o||{}; const dir=o.dir||'s', hp=o.podium||3, ch=o.colH||10, m=o.m||'marble', step=o.step||Math.max(2.4,ch*0.38), r=o.r||Math.max(0.5,ch*0.075);
    const alongX=dir==='e'||dir==='w', s=(dir==='s'||dir==='e')?1:-1;
    const L=len/2, W=wid/2, X=(u,v)=>alongX?cx+u:cx+v, Z=(u,v)=>alongX?cz+v:cz+u;
    const B2=(u0,y0,v0,u1,y1,v1,mm)=>box(X(u0,v0),y0,Z(u0,v0),X(u1,v1),y1,Z(u1,v1),mm);
    const y=K.foot(X(-L,-W),Z(-L,-W),X(L,W),Z(L,W));
    B2(-L,y-1,-W,L,y+hp,W,o.pm||'hewn-stone'); box(Math.min(X(-L,-W),X(L,W)),y-1-MPB,Math.min(Z(-L,-W),Z(L,W)),Math.max(X(-L,-W),X(L,W)),y,Math.max(Z(-L,-W),Z(L,W)),o.pm||'hewn-stone',{foot:true});
    for(let i=0;i<Math.ceil(hp/0.4);i++){ const u=s*(L+i*0.8); B2(Math.min(u,u+s*0.8),y-1,-W*0.6,Math.max(u,u+s*0.8),y+hp-i*0.4,W*0.6,o.pm||'hewn-stone'); }   /* the stair at its front */
    const Y=y+hp, inner=o.pro?0.55:1;
    const cellaL=o.pro?L*0.95:L-step*1.6, cellaW=o.pro?W*0.95:W-step*1.2;
    /* the cella, its door at the front */
    B2(-cellaL+(o.pro?s*L*0.25:0),Y,-cellaW,cellaL+(o.pro?s*L*0.25:0)*0,Y+ch,cellaW,m);
    /* the columns: all about (peripteral), or in rows before the front (prostyle) */
    if(o.pro){ for(let v=-W+r+0.4;v<=W-r-0.4;v+=step) for(let row=0;row<(o.rows||2);row++){ const u=s*(L-r-0.6-row*step); B2(u-r,Y,v-r,u+r,Y+ch,v+r,m); } }
    else { for(let u=-L+r+0.4;u<=L-r-0.4;u+=step) for(const sv of [-1,1]) B2(u-r,Y,sv*(W-r-0.4)-r,u+r,Y+ch,sv*(W-r-0.4)+r,m);
      for(let v=-W+r+0.4+step;v<W-r-0.4;v+=step) for(const su of [-1,1]) B2(su*(L-r-0.4)-r,Y,v-r,su*(L-r-0.4)+r,Y+ch,v+r,m); }
    const eh=ch*0.18; B2(-L,Y+ch,-W,L,Y+ch+eh,W,m);                 /* the entablature */
    const gh=wid*0.13, n=Math.max(3,Math.round(gh/0.9));            /* the roof and its pediments, stepped */
    for(let i=0;i<n;i++){ const f=1-i/n; B2(-L,Y+ch+eh+gh*i/n,-W*f,L,Y+ch+eh+gh*(i+1)/n,W*f,o.roof||'roof-tile'); }
    B2(s*L-s*0.6,Y+ch+eh,-W,s*L,Y+ch+eh+gh*0.95,W,m);                /* the pediment's face in stone */
    /* the doorway */
    const du=s*cellaL; B2(Math.min(du,du-s*1.5),Y,-Math.min(2.2,cellaW*0.4),Math.max(du,du-s*1.5)+(s>0?0.2:0),Y+Math.min(ch*0.7,7),Math.min(2.2,cellaW*0.4),'air');
    return Y; };
  /* AN ALTAR before a temple: a block of stone with its stair */
  K.altar=(x,z,w,h,m)=>{ const y=K.g(x,z); box(x-w/2,y-MPB,z-w/2,x+w/2,y+h,z+w/2,m||'hewn-stone',{foot:true}); };
  /* A ZIGGURAT of stages [[w,d,h],...], battered and buttressed, mud brick within and baked brick without,
     its stairs climbing the face toward −z (or `face`: 'n','s','e','w') */
  K.ziggurat=(cx,cz,tiers,o)=>{ o=o||{}; const y0=K.foot(cx-tiers[0][0]/2,cz-tiers[0][1]/2,cx+tiers[0][0]/2,cz+tiers[0][1]/2); let y=y0;
    for(const [w,d,h] of tiers){ box(cx-w/2,y-(y===y0?MPB:0),cz-d/2,cx+w/2,y+h,cz+d/2,o.m||'brick',y===y0?{foot:true}:undefined);
      for(let x=-w/2+3;x<w/2-2;x+=5) for(const s of [-1,1]) box(cx+x-0.7,y,cz+s*d/2-0.5,cx+x+0.7,y+h-0.4,cz+s*d/2+0.5,o.m||'brick');
      for(let z=-d/2+3;z<d/2-2;z+=5) for(const s of [-1,1]) box(cx+s*w/2-0.5,y,cz+z-0.7,cx+s*w/2+0.5,y+h-0.4,cz+z+0.7,o.m||'brick');
      y+=h; }
    const H=y-y0, d0=tiers[0][1]/2;
    K.flight('z',cz-d0-H*1.1,cz-d0,cx-3,cx+3,y0,y0+tiers[0][2],Math.round(tiers[0][2]/0.3),o.m||'brick');
    let yy=y0+tiers[0][2]; for(let t=1;t<tiers.length;t++){ K.flight('z',cz-tiers[t-1][1]/2,cz-tiers[t][1]/2,cx-2.5,cx+2.5,yy,yy+tiers[t][2],Math.round(tiers[t][2]/0.3),o.m||'brick'); yy+=tiers[t][2]; }
    return y; };
  /* AN EGYPTIAN PYLON across a way: two battered towers either side of a gate, its cornice, its flagstaffs
     (ax 'x': the way runs along x; the pylon's thickness a0..a1 along the way, centred at c across it) */
  K.pylon=(ax,a0,a1,c,hw,h,gw,y,m)=>{ m=m||'sandstone'; const n=5, bat=h*0.1;
    const B2=(u0,y0,v0,u1,y1,v1,mm)=>ax==='x'?box(u0,y0,c+v0,u1,y1,c+v1,mm||m):box(c+v0,y0,u0,c+v1,y1,u1,mm||m);
    for(const s of [-1,1]){ for(let i=0;i<n;i++){ const d=bat*i/n; B2(a0+d*0.5,y+(i?h*i/n:-MPB),s*gw,a1-d*0.5,y+h*(i+1)/n,s*(hw-d)); }
      const d=bat*(n-1)/n; B2(a0+d*0.5-0.8,y+h,s*gw,a1-d*0.5+0.8,y+h+1.4,s*(hw-d+0.8));
      const fu=a0-0.9; for(const f of [hw*0.35,hw*0.7]) B2(fu-0.45,y,s*f-0.45,fu+0.45,y+h+7,s*f+0.45,'planks'); }
    const gh=Math.min(h*0.8,gw*5); B2(a0-0.5,y+gh,-gw-1.4,a1+0.5,y+gh+3,gw+1.4); B2(a0-0.5,y-MPB,-gw-1.4,a1+0.5,y+gh,-gw); B2(a0-0.5,y-MPB,gw,a1+0.5,y+gh,gw+1.4); };
  /* a sphinx on its plinth, the lion's body and a ram's head or a man's (kept plain), facing along `f` (±1 in z,
     or in x when `ax` is 'x') */
  K.sphinx=(x,z,f,ax,ram)=>{ const y=K.g(x,z), m='sandstone', B2=(a,b,c2,d,e,g2)=>ax==='x'?box(x+c2,y+b,z+a,x+g2,y+e,z+d,m):box(x+a,y+b,z+c2,x+d,y+e,z+g2,m);
    B2(-1.1,-MPB,-2.6,1.1,1.2,2.6); B2(-0.8,1.2,-2.2,0.8,2.6,2.0);
    B2(-0.65,2.0,f>0?1.2:-2.4,0.65,3.6,f>0?2.4:-1.2); if(ram) B2(-0.95,2.9,f>0?1.5:-2.3,0.95,3.4,f>0?2.3:-1.5); };
  /* a colossus of a king, seated or striding (no likeness: the stone keeps none) */
  K.colossus=(x,z,H,f,m)=>{ const y=K.g(x,z), u=H/15; m=m||'red-granite';
    box(x-3*u,y-MPB,z-2.2*u,x+3*u,y+2*u,z+2.2*u,m,{foot:true});
    box(x-1.8*u,y+2*u,z-1.4*u,x+1.8*u,y+6.5*u,z+1.4*u,m);                                  /* the throne and the knees */
    box(x-1.4*u,y+6.5*u,z-(f>0?1.4:0.6)*u,x+1.4*u,y+11.5*u,z+(f>0?0.6:1.4)*u,m);           /* the body */
    box(x-0.9*u,y+11.5*u,z-0.8*u,x+0.9*u,y+13.2*u,z+0.8*u,m); box(x-0.55*u,y+13.2*u,z-0.5*u,x+0.55*u,y+15*u,z+0.5*u,m); };
  /* a bridge on piers over water: from (x0,z0) to (x1,z1), `w` broad, its deck at `y`, its piers stood on the bed */
  K.bridge=(x0,z0,x1,z1,w,y,bed,m)=>{ m=m||'brick'; const L=Math.hypot(x1-x0,z1-z0), n=Math.max(2,Math.round(L/9)), alongX=Math.abs(x1-x0)>Math.abs(z1-z0);
    for(let k=0;k<=n;k++){ const x=x0+(x1-x0)*k/n, z=z0+(z1-z0)*k/n; box(x-(alongX?2:w/2),bed,z-(alongX?w/2:2),x+(alongX?2:w/2),y,z+(alongX?w/2:2),m); }
    box(Math.min(x0,x1)-(alongX?0:w/2),y,Math.min(z0,z1)-(alongX?w/2:0),Math.max(x0,x1)+(alongX?0:w/2),y+0.9,Math.max(z0,z1)+(alongX?w/2:0),'planks');
    for(const s of [-1,1]) box(Math.min(x0,x1)-(alongX?0:s*w/2),y+0.9,Math.min(z0,z1)-(alongX?s*w/2:0),Math.max(x0,x1)-(alongX?0:s*w/2-s*0.6),y+1.9,Math.max(z0,z1)-(alongX?s*w/2-s*0.6:0),m); };
  /* a great house about its courts: an outer wall and rooms along it (`rooms` deep), courts left open */
  K.court=(x0,z0,x1,z1,h,m,o)=>{ o=o||{}; const sx=K.sx; x0=sx(x0); x1=sx(x1); z0=sx(z0); z1=sx(z1);
    const y=o.y!==undefined?K.sy(o.y):K.sy(K.foot(x0,z0,x1,z1)), t=Math.max(MPB,K.sy(o.t||2)), rd=o.rooms?K.sy(o.rooms):0, top=y+K.sy(h);
    const mx=sx((x0+x1)/2), mz=sx((z0+z1)/2), dw=o.dw||2.5;
    /* its four walls, the door's gap left in one; a lintel over the door */
    const side=(a0,b0,a1,b1,gap)=>{ if(!gap){ box(a0,y-MPB,b0,a1,top,b1,m,{foot:true}); return; }
      if(gap==='x'){ box(a0,y-MPB,b0,sx(mx-dw),top,b1,m,{foot:true}); box(sx(mx+dw),y-MPB,b0,a1,top,b1,m,{foot:true}); box(sx(mx-dw),y+K.sy(4.6),b0,sx(mx+dw),top,b1,m); }
      else { box(a0,y-MPB,b0,a1,top,sx(mz-dw),m,{foot:true}); box(a0,y-MPB,sx(mz+dw),a1,top,b1,m,{foot:true}); box(a0,y+K.sy(4.6),sx(mz-dw),a1,top,sx(mz+dw),m); } };
    side(x0,z0,x1,z0+t,o.door==='n'?'x':null); side(x0,z1-t,x1,z1,o.door==='s'?'x':null);
    side(x0,z0+t,x0+t,z1-t,o.door==='w'?'z':null); side(x1-t,z0+t,x1,z1-t,o.door==='e'?'z':null);
    /* its rooms along the walls, their doors on the court */
    if(rd>0){ const rh=Math.max(3,h*0.7);
      K.hall(x0+t,z0+t,x1-t,z0+t+rd,rh,m,{y,doors:[[mx,z0+t+rd,1.2]].concat(o.door==='n'?[[mx,z0+t,dw]]:[]),parapet:false});
      K.hall(x0+t,z1-t-rd,x1-t,z1-t,rh,m,{y,doors:[[mx,z1-t-rd,1.2]].concat(o.door==='s'?[[mx,z1-t,dw]]:[]),parapet:false});
      K.hall(x0+t,z0+t+rd,x0+t+rd,z1-t-rd,rh,m,{y,doors:[[x0+t+rd,mz,1.2]].concat(o.door==='w'?[[x0+t,mz,dw]]:[]),parapet:false});
      K.hall(x1-t-rd,z0+t+rd,x1-t,z1-t-rd,rh,m,{y,doors:[[x1-t-rd,mz,1.2]].concat(o.door==='e'?[[x1-t,mz,dw]]:[]),parapet:false}); }
    if(o.pave) api.top(x0+t+rd,z0+t+rd,x1-t-rd,z1-t-rd,o.pave);
    return y; };
  return K;
};
})();
