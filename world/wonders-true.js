/* ================= THE WORKS OF THE NATIONS BY THEIR OWN PLANS (Round 139) =================
   When the earth is drawn at its true measure, a wonder with `tm.form` in world/landmarks.js is laid by
   its plan here instead of the one generic temple: the halls, courts, pylons, stairs and colonnades it
   really had, at their measured sizes, in the stone it was built of. Each is raised whole, as its
   builders finished it.

   Metres about the landmark's site: x to the east, z to the south, y over the site's own ground (the
   engine turns the plan by whole quarters to the place's true bearing; engine.js, lmForm).
   api.box(x0,y0,z0,x1,y1,z1, material[, topMaterial]) lays a box; api.level(x0,z0,x1,z1,top,fill)
   makes a court's ground level with the site; api.ground(x,z) reads the land's height.

   The measures, and where they come from:
     · KARNAK, the house of Amun at No-Amon: first pylon 113 m wide, 15 thick, about 31.5 high
       (never finished); great court 103 × 84 m with the kiosk of Taharqa (ten columns of 21 m); the
       great hall of columns 103 × 52 m, 134 columns, the twelve of the nave 21 m high and 3.57 m
       through with open papyrus heads, the 122 of the aisles about 15 m with closed buds, clerestory
       windows between; obelisks of Thutmose I (21.2 m) and Hatshepsut (29.6 m) of red granite; the
       granite barque shrine; the festival hall of Thutmose III (44 × 16 m, tent-pole columns); the
       sacred lake (120 × 77 m); pylons VII–X on the southern way; the ram-headed sphinxes and the quay;
       the enclosure of mud brick.
     · PETRA, the Treasury (al-Khazneh): a facade about 25 m wide and 39 m high cut into the rose rock
       at the end of the Siq; a portico of six Corinthian columns under a pediment, the great door into
       a chamber 12.5 m square, side chambers; above, a round tholos with its conical roof and urn
       between two halves of a broken pediment. The Siq, a cleft some 3 m wide, opens on it.
     · PERSEPOLIS (Parsa): the terrace 455 × 300 m and 12 m high; the double stair of 111 steps; the
       gate of all nations (25 m square, four columns of 16.5 m, the bulls at its doors); the Apadana on
       its own platform, a hall 60.5 m square of 36 columns about 20 m high, three porticoes of twelve,
       four corner towers, 112 m across in all, its two great stairs; the hall of a hundred columns
       (68.5 m square, 14 m columns) with its porch of sixteen and guardian bulls; the palaces of Darius
       and Xerxes, the council hall, the treasury, the fortification wall.
     · THE PARTHENON: stylobate 69.5 × 30.9 m on three steps; 8 × 17 Doric columns 10.4 m high and 1.9
       through; porches of six at either end; the cella with its two-storey colonnade about the
       statue's base (the image itself is not raised), the west room of four Ionic columns; triglyphs,
       cornice and pediments; roofed in marble.
     · ARTEMIS AT EPHESUS (the late temple): a platform 137 × 69 m on its steps; two rows of Ionic
       columns 18 m high all round, about 120 in all, deep porches; a sekos open to the sky with a small
       shrine in it (no image); the three openings in the west pediment; the altar court to the west.
     · BAALBEK (Heliopolis): the temple of Jupiter on its podium (88 × 48 m), 54 columns about 23 m with
       their capitals, a 5 m entablature; the trilithon in the western wall, three stones of 19 m each;
       the great court (134 × 112 m) with its porticoes of granite columns, exedrae, the tower altar and
       two basins; the hexagonal forecourt and the propylaea with its twelve columns and towers; the
       temple of Bacchus (66 × 35 m, 42 columns).
     · THE ZIGGURAT OF UR: three stages (64 × 46 × 11 m, then 38 × 26, 20 × 14) with buttressed, battered
       walls of baked brick over a mud-brick core; the three stairways of a hundred steps meeting at the
       gatehouse on the first stage; the shrine of the moon on the top.
     · ETEMENANKI: seven stages after the Esagila tablet (91 m square and 33 high, then 78 × 18, four of
       6 m, the shrine 24 m square and 15 high, faced in blue glazed brick); the great stair running out
       from the south face, and the two side stairs along it.
   ============================================================================================ */
(function(){
const F=window.WONDER_FORMS={};

/* ---- the mason's tools, shared by every plan ---- */
function kit(api){
  const box=(x0,y0,z0,x1,y1,z1,m,top)=>api.box(Math.min(x0,x1),Math.min(y0,y1),Math.min(z0,z1),Math.max(x0,x1),Math.max(y0,y1),Math.max(z0,z1),m,top);
  const K={box, level:api.level, ground:api.ground};
  /* a round shaft: three boxes make an octagon (a thin one is a square post) */
  K.round=(cx,cz,y0,y1,r,m)=>{ if(r<0.6){ box(cx-r,y0,cz-r,cx+r,y1,cz+r,m); return; }
    const a=r*0.414, b=r*0.707; box(cx-r,y0,cz-a,cx+r,y1,cz+a,m); box(cx-a,y0,cz-r,cx+a,y1,cz+r,m); box(cx-b,y0,cz-b,cx+b,y1,cz+b,m); };
  /* a solid box with hollows taken out of it (rooms, doors, a recess): cut on every face of every hollow */
  K.carve=(b,holes,m,top)=>{
    const hs=holes.map(h=>[Math.max(Math.min(h[0],h[3]),b[0]),Math.max(Math.min(h[1],h[4]),b[1]),Math.max(Math.min(h[2],h[5]),b[2]),
      Math.min(Math.max(h[0],h[3]),b[3]),Math.min(Math.max(h[1],h[4]),b[4]),Math.min(Math.max(h[2],h[5]),b[5])]).filter(h=>h[0]<h[3]&&h[1]<h[4]&&h[2]<h[5]);
    const cut=i=>[...new Set([b[i],b[i+3],...hs.flatMap(h=>[h[i],h[i+3]])])].sort((p,q)=>p-q);
    const X=cut(0), Y=cut(1), Z=cut(2);
    const solid=(i,j,k)=>{ const x=(X[i]+X[i+1])/2, y=(Y[j]+Y[j+1])/2, z=(Z[k]+Z[k+1])/2;
      return !hs.some(h=>x>h[0]&&x<h[3]&&y>h[1]&&y<h[4]&&z>h[2]&&z<h[5]); };
    /* runs along x, then the same run stacked up y while it holds */
    const done=new Set();
    for(let k=0;k+1<Z.length;k++) for(let j=0;j+1<Y.length;j++){ let i=0;
      while(i+1<X.length){ if(!solid(i,j,k)||done.has(i+','+j+','+k)){ i++; continue; }
        let e=i; while(e+2<X.length&&solid(e+1,j,k)&&!done.has((e+1)+','+j+','+k)) e++;
        let jt=j; for(;;){ if(jt+2>=Y.length) break; let ok=true; for(let q=i;q<=e;q++) if(!solid(q,jt+1,k)||done.has(q+','+(jt+1)+','+k)){ ok=false; break; }
          if(!ok) break; jt++; }
        for(let q=i;q<=e;q++) for(let r=j;r<=jt;r++) done.add(q+','+r+','+k);
        box(X[i],Y[j],Z[k],X[e+1],Y[jt+1],Z[k+1],m,top); i=e+1; } } };
  /* a flight of steps, solid beneath, rising from (u0) to (u1) along x or z; `n` treads */
  K.flight=(ax,u0,u1,v0,v1,y0,y1,n,m)=>{ for(let i=0;i<n;i++){ const a=u0+(u1-u0)*i/n, b=u0+(u1-u0)*(i+1)/n, h=y0+(y1-y0)*(i+1)/n;
      if(ax==='x') box(a,y0-1,v0,b,h,v1,m); else box(v0,y0-1,a,v1,h,b,m); } };
  /* a gabled roof, stepped: the ridge runs along `ax`; the stepped ends are the pediments */
  K.gable=(ax,x0,x1,z0,z1,y,h,n,m,holes)=>{ for(let i=0;i<n;i++){ const f=1-i/n, y0=y+h*i/n, y1=y+h*(i+1)/n;
      let b; if(ax==='x'){ const c=(z0+z1)/2, w=(z1-z0)/2*f; b=[x0,y0,c-w,x1,y1,c+w]; } else { const c=(x0+x1)/2, w=(x1-x0)/2*f; b=[c-w,y0,z0,c+w,y1,z1]; }
      if(holes&&holes.length) K.carve(b,holes,m); else box(b[0],b[1],b[2],b[3],b[4],b[5],m); } };
  /* stepped merlons along a parapet line, Persian and Assyrian */
  K.merlons=(ax,u0,u1,v,y,m,step)=>{ step=step||2; for(let u=u0+step/2;u<u1;u+=step){
      if(ax==='x'){ box(u-0.6,y,v-0.5,u+0.6,y+0.9,v+0.5,m); box(u-0.3,y+0.9,v-0.5,u+0.3,y+1.6,v+0.5,m); }
      else { box(v-0.5,y,u-0.6,v+0.5,y+0.9,u+0.6,m); box(v-0.5,y+0.9,u-0.3,v+0.5,y+1.6,u+0.3,m); } } };
  /* ROCK LEFT AS THE WEATHER LEFT IT: a mass of rock in cells of `c` metres, each standing to its own
     height (rounded domes and gullies, never a flat lid), its outer cells falling away to the ground.
     `face`: the side ('-x','+x','-z','+z') that stands sheer over a way or a court, kept full height */
  K.crag=(x0,z0,x1,z1,yb,h0,h1,m,o)=>{ o=o||{}; const c=o.c||5, seed=o.seed||1;
    const nx=Math.max(1,Math.round((x1-x0)/c)), nz=Math.max(1,Math.round((z1-z0)/c)), dx=(x1-x0)/nx, dz=(z1-z0)/nz;
    const hsh=(i,j)=>{ const v=Math.sin(i*12.9898+j*78.233+seed*37.7)*43758.5453; return v-Math.floor(v); };
    const sm=(i,j)=>{ let t=0; for(let a=-1;a<=1;a++) for(let b=-1;b<=1;b++) t+=hsh(Math.floor((i+a)/2),Math.floor((j+b)/2))*(a||b?1:2); return t/10; };
    for(let i=0;i<nx;i++) for(let j=0;j<nz;j++){
      let f=sm(i,j);
      /* the distance in cells to the sheer face, and to the far edge, where the rock comes down */
      const toFace=o.face==='-x'?i:o.face==='+x'?nx-1-i:o.face==='-z'?j:o.face==='+z'?nz-1-j:99;
      const edge=Math.min(o.face==='-x'?99:i,o.face==='+x'?99:nx-1-i,o.face==='-z'?99:j,o.face==='+z'?99:nz-1-j);
      let h=h0+(h1-h0)*f; if(toFace>1) h-= (h-h0)*0.25*Math.min(1,(toFace-1)/4);
      if(edge<2&&!(o.face&&toFace===0)) h=h0*(0.45+0.25*edge)+hsh(i+7,j+3)*h0*0.2;
      box(x0+i*dx,yb,z0+j*dz,x0+(i+1)*dx,h,z0+(j+1)*dz,m);
      if(h-h0>6){ const r=Math.min(dx,dz)*0.3; box(x0+i*dx+r,h,z0+j*dz+r,x0+(i+1)*dx-r,h+(h-h0)*0.12,z0+(j+1)*dz-r,m); } } };
  /* a wall laid along a polyline, a box every couple of metres */
  K.wallLine=(pts,y0,y1,t,m,follow)=>{ for(let p=0;p+1<pts.length;p++){ const [x0,z0]=pts[p], [x1,z1]=pts[p+1], L=Math.hypot(x1-x0,z1-z0), n=Math.max(1,Math.round(L/2));
      for(let k=0;k<n;k++){ const mx=x0+(x1-x0)*(k+0.5)/n, mz=z0+(z1-z0)*(k+0.5)/n, rx=Math.abs(x1-x0)/n/2+t/2, rz=Math.abs(z1-z0)/n/2+t/2;
        const g=follow?api.ground(mx,mz):0; box(mx-rx,g+y0,mz-rz,mx+rx,g+y1,mz+rz,m); } } };
  /* an obelisk cut whole from granite, its tip sheathed in gold */
  K.obelisk=(cx,cz,h,b,m)=>{ box(cx-b*0.85,-1,cz-b*0.85,cx+b*0.85,0.9,cz+b*0.85,m); const n=6, hs=h*0.93;
    for(let i=0;i<n;i++){ const w=b/2*(1-0.32*i/n); box(cx-w,0.9+hs*i/n,cz-w,cx+w,0.9+hs*(i+1)/n,cz+w,m); }
    const w=b/2*0.68; box(cx-w,0.9+hs,cz-w,cx+w,0.9+hs+h*0.035,cz+w,'goldLeaf'); box(cx-w*0.5,0.9+hs+h*0.035,cz-w*0.5,cx+w*0.5,0.9+h,cz+w*0.5,'goldLeaf'); };
  /* an oval of ground or of building, laid in strips of `st` metres (a tell, a harbour, an island) */
  K.oval=(cx,cz,a,b,y0,y1,m,top,st)=>{ st=st||2; for(let z=-b;z<b;z+=st){ const zm=Math.min(b,Math.abs(z+st/2)), w=a*Math.sqrt(Math.max(0,1-(zm/b)**2));
      if(w>0.3) box(cx-w,y0,cz+z,cx+w,y1,cz+z+st,m,top); } };
  /* an oval wall `t` thick, open where `gaps` say ([angle, half-width in radians], angle 0 is east, +z south) */
  K.ovalRing=(cx,cz,a,b,t,y0,y1,m,gaps,st)=>{ st=st||2; gaps=gaps||[];
    const open=(x,z)=>{ const th=Math.atan2(z/b,x/a); return gaps.some(([g,hw])=>Math.abs(Math.atan2(Math.sin(th-g),Math.cos(th-g)))<hw); };
    for(let z=-b;z<b;z+=st){ const zm=Math.abs(z+st/2), wo=a*Math.sqrt(Math.max(0,1-(zm/b)**2)), wi=zm<b-t?(a-t)*Math.sqrt(Math.max(0,1-(zm/(b-t))**2)):0;
      if(wo<0.3) continue;
      if(wi<0.5){ if(!open(0,z+st/2)) box(cx-wo,y0,cz+z,cx+wo,y1,cz+z+st,m); continue; }
      for(const sx of [-1,1]){ const xm=sx*(wi+wo)/2; if(open(xm,z+st/2)) continue; box(cx+sx*wi,y0,cz+z,cx+sx*wo,y1,cz+z+st,m); } } };
  return K;
}
window.WONDER_KIT=kit;

/* ============================== KARNAK ==============================
   The axis runs east from the river; the first pylon is at the west. */
F.karnak=function(api){ const K=kit(api), box=K.box, S='sandstone', MB='mudbrick', RG='redGranite', HS='hewnStone';
  K.level(-215,-180,262,254,'sand','sand');
  /* a pylon: two battered towers either side of a gate, its cornice, its flagstaffs.
     ax: the axis it stands across ('x': the way runs along x); a0..a1 its thickness along the way */
  const pylon=o=>{ const {ax,a0,a1,c,hw,h,gw,gh}=o, n=5, bat=h*0.1;
    const B=(u0,y0,v0,u1,y1,v1,m)=>ax==='x'?box(u0,y0,c+v0,u1,y1,c+v1,m):box(c+v0,y0,u0,c+v1,y1,u1,m);
    for(const s of [-1,1]){
      for(let i=0;i<n;i++){ const d=bat*i/n, y0=i?h*i/n:-2, y1=h*(i+1)/n; B(a0+d*0.5,y0,s*gw,a1-d*0.5,y1,s*(hw-d),S); }
      const d=bat*(n-1)/n; B(a0+d*0.5-0.8,h,s*gw,a1-d*0.5+0.8,h+1.6,s*(hw-d+0.8),S);          /* the cavetto cornice */
      for(const f of (o.flags||[])) { const fu=a0-1.0, fv=s*f;                                  /* the cedar flagstaffs, tipped with gold */
        ax==='x'?K.round(fu,c+fv,-1,h+8,0.45,'planks'):K.round(c+fv,fu,-1,h+8,0.45,'planks');
        B(fu-0.5,h+8,fv-0.5,fu+0.5,h+9.2,fv+0.5,'goldLeaf'); } }
    const lt=Math.min(h*0.82,gh+h*0.2);                                                             /* the portal over the gate */
    B(a0-0.6,gh,-gw-1.6,a1+0.6,lt,gw+1.6,S); B(a0-1.2,lt,-gw-2.2,a1+1.2,lt+1.2,gw+2.2,S);
    B(a0-0.6,-1,-gw-1.6,a1+0.6,gh,-gw,S); B(a0-0.6,-1,gw,a1+0.6,gh,gw+1.6,S);
    B(a0,-1,-gw,a1,0.05,gw,HS); };
  /* the columns: open papyrus (the nave), closed bud (the aisles) */
  const papOpen=(cx,cz,h,r)=>{ K.round(cx,cz,-0.6,0.9,r*1.35,S); K.round(cx,cz,0.9,h-3.8,r,S); K.round(cx,cz,h-3.8,h-2.4,r*1.12,S);
    K.round(cx,cz,h-2.4,h-1.3,r*1.38,S); K.round(cx,cz,h-1.3,h-0.6,r*1.55,S); box(cx-r*0.75,h-0.6,cz-r*0.75,cx+r*0.75,h,cz+r*0.75,S); };
  const papBud=(cx,cz,h,r)=>{ K.round(cx,cz,-0.6,0.8,r*1.3,S); K.round(cx,cz,0.8,h-3.0,r,S); K.round(cx,cz,h-3.0,h-1.8,r*1.1,S);
    K.round(cx,cz,h-1.8,h-0.6,r*0.82,S); box(cx-r*0.62,h-0.6,cz-r*0.62,cx+r*0.62,h,cz+r*0.62,S); };
  /* a colossus of the king, striding, in granite (no likeness: the stone keeps none) */
  const colossus=(cx,cz,H,m)=>{ const u=H/15; box(cx-3*u,-1,cz-1.9*u,cx+3*u,1.6*u,cz+1.9*u,m);
    box(cx-2.2*u,1.6*u,cz-1.2*u,cx-0.6*u,7.4*u,cz-0.1*u,m); box(cx-0.4*u,1.6*u,cz+0.1*u,cx+1.0*u,7.4*u,cz+1.2*u,m);   /* the striding legs */
    box(cx-1.1*u,6.6*u,cz-1.5*u,cx+1.1*u,8.6*u,cz+1.5*u,HS);                                             /* the kilt */
    box(cx-1.0*u,8.6*u,cz-1.7*u,cx+1.0*u,12.0*u,cz+1.7*u,m);                                            /* the body, the arms at its sides */
    box(cx-0.9*u,12.0*u,cz-1.25*u,cx+0.9*u,13.4*u,cz+1.25*u,m);                                          /* the head-cloth */
    box(cx-0.55*u,13.4*u,cz-0.5*u,cx+0.55*u,15*u,cz+0.5*u,m); };                                          /* the double crown */
  /* ---- the quay, and the way of the rams ---- */
  box(-215,-2.5,-20,-200,1.2,20,HS); K.flight('x',-200,-196,-6,6,0,1.2,3,HS);
  box(-200,-0.8,-6,-139,0.1,6,HS);
  for(let x=-192;x<=-146;x+=5) for(const s of [-1,1]){ const z=s*9.5, hz=z-s*2.2;
    box(x-1.1,-0.5,z-2.5,x+1.1,1.3,z+2.5,S); box(x-0.75,1.3,z-2.0,x+0.75,2.7,z+1.9,S);                    /* the plinth, the lion's body */
    box(x-0.6,2.1,hz-0.4,x+0.6,3.7,hz+0.9,S); box(x-0.9,3.0,hz+0.2,x+0.9,3.5,hz+0.9,S); }                   /* the ram's head and its horns */
  /* ---- the first pylon, and the great court ---- */
  pylon({ax:'x',a0:-139,a1:-124,c:0,hw:56.5,h:31.5,gw:3.8,gh:18});
  box(-124,-0.8,-48.5,-40,0.1,48.5,S);
  for(const s of [-1,1]){
    /* the walls of the court, and the colonnades along them (the south one broken by the temple of Ramesses III) */
    if(s<0) box(-124,-1,-51.5,-40,12,-48.5,S); else { box(-124,-1,48.5,-97,12,51.5,S); box(-71,-1,48.5,-40,12,51.5,S); }
    for(let x=-118;x<=-46;x+=4.5){ if(s>0&&x>-100&&x<-68) continue; papBud(x,s*44.5,9,1.0); }
    const segs=s<0?[[-120,-44]]:[[-120,-98],[-70,-44]];
    for(const [a,b] of segs){ box(a,9,s*45.6,b,10.2,s*43.4,S); box(a,10.2,s*48.5,b,11.0,s*43.2,S); } }
  /* the kiosk of Taharqa: ten columns of 21 m in two rows, low screens between */
  const KX=[-112,-100,-88,-76,-64];
  for(const s of [-1,1]){ for(const x of KX) papOpen(x,s*8.5,21,1.5);
    for(let i=0;i+1<KX.length;i++) box(KX[i]+1.6,-0.5,s*8.5-0.5,KX[i+1]-1.6,3.2,s*8.5+0.5,S); }
  /* the triple shrine of Seti II in the north-west corner */
  K.carve([-118,-0.5,-47,-106,6.5,-37],[[-117,0,-46,-114.4,5,-36.9],[-113.3,0,-46,-110.7,5,-36.9],[-109.6,0,-46,-107,5,-36.9]],HS);
  /* the temple of Ramesses III, its pylon facing into the court */
  pylon({ax:'z',a0:16,a1:21,c:-84,hw:13,h:16,gw:1.8,gh:9});
  for(const s of [-1,1]){ box(-84+s*13,-1,21,-84+s*11,10,44,S);
    for(let z=24;z<=40;z+=4) box(-84+s*8-0.8,-0.5,z-0.8,-84+s*8+0.8,8,z+0.8,S);
    box(-84+s*11,8,21,-84+s*6.6,9,44,S); }
  K.carve([-97,-1,44,-71,9.5,68],[[-95,0,46,-73,8,66],[-85.5,0,43.9,-82.5,6,46.1]],S);
  for(const x of [-88,-80]) for(let z=49;z<=63;z+=4.6) papBud(x,z,8,0.8);
  /* the colossi before the second pylon */
  colossus(-45.5,-8,15,RG); colossus(-45.5,8,10.5,RG);
  /* ---- the second pylon, and the great hall of columns ---- */
  pylon({ax:'x',a0:-40,a1:-26,c:0,hw:51.5,h:29,gw:3.5,gh:20,flags:[11,27]});
  for(const s of [-1,1]) box(-26,-1,s*49,26,19,s*51.5,S);
  box(-26,-0.8,-49,26,0.1,49,S);
  const NX=[-21,-12.6,-4.2,4.2,12.6,21];
  for(const s of [-1,1]){ for(const x of NX) papOpen(x,s*5.4,21,1.78);
    box(-26,21,s*5.4-1.2,26,23.2,s*5.4+1.2,S); }                                                          /* the nave's architraves */
  box(-26,23.2,-11.6,26,24.4,11.6,S);                                                                     /* the nave's high roof */
  const RZ=[11,17,23,29,35,41,47];
  for(const s of [-1,1]){
    for(const rz of RZ){ for(let x=-24;x<=24;x+=6){ if(rz===11&&Math.abs(x)===24) continue; papBud(x,s*rz,15.2,1.35); }
      box(-26,15.2,s*rz-0.9,26,16.8,s*rz+0.9,S); }
    box(-26,16.8,s*11.6,26,17.8,s*49,S);                                                                  /* the aisles' roof */
    /* the clerestory over the first row of the aisle: a stone grille to let in the light */
    box(-26,16.8,s*10.4,26,18.2,s*11.6,S); box(-26,22,s*10.4,26,23.2,s*11.6,S);
    for(let x=-26;x<26;x+=2.6) box(x,18.2,s*10.4,x+0.8,22,s*11.6,S); }
  /* ---- the third pylon, and the court of the obelisks ---- */
  pylon({ax:'x',a0:26,a1:41,c:0,hw:52,h:25,gw:3.5,gh:17});
  for(const s of [-1,1]){ box(41,-1,s*33,46,10,s*35,S); box(50,-1,s*33,56,10,s*35,S); }
  box(41,-0.8,-33,56,0.1,33,S);
  K.obelisk(48.5,-7,21.2,1.84,RG); K.obelisk(48.5,7,21.2,1.84,RG);
  /* ---- the fourth pylon, the hall of Hatshepsut's obelisks, the fifth and sixth ---- */
  pylon({ax:'x',a0:56,a1:62,c:0,hw:33,h:20,gw:2.8,gh:13});
  for(const s of [-1,1]){ box(62,-1,s*31,76,12,s*33,S); for(const x of [64.5,73.5]) for(const z of [14,20,26]) papBud(x,s*z,10,0.9); }
  K.obelisk(69,-7,29.6,2.44,RG); K.obelisk(69,7,29.6,2.44,RG);
  pylon({ax:'x',a0:76,a1:80,c:0,hw:24,h:15,gw:2.4,gh:10});
  for(const s of [-1,1]) box(80,-1,s*20,84,9,s*22,S);
  pylon({ax:'x',a0:84,a1:88,c:0,hw:20,h:13,gw:2.2,gh:9});
  /* the hall of annals with its two granite pillars of the papyrus and the lotus, and the barque shrine */
  for(const s of [-1,1]){ box(88,-1,s*10,118,8,s*12,S); box(91.4,-0.5,s*4.5-0.6,92.6,6.8,s*4.5+0.6,RG); K.round(92,s*4.5,6.8,7.6,0.9,RG); }
  box(88,-0.8,-10,150,0.1,10,S);
  K.carve([97,-0.5,-4.6,115,7.5,4.6],[[98.2,0,-3.4,105.5,6.3,3.4],[106.7,0,-3.4,113.8,6.3,3.4],[96.9,0,-1.2,98.3,4.6,1.2],[105.4,0,-1.1,106.8,4.6,1.1]],RG);
  /* ---- the festival hall of Thutmose III (the Akh-menu) ---- */
  K.carve([150,-1,-40,210,9,40],[[152.5,0,-37.5,207.5,9.1,37.5],[149.9,0,27.5,152.6,6,31]],S);
  for(const s of [-1,1]) box(178,-1,s*1.6,180,9,s*37.5,S);
  box(150,-0.8,-40,210,0.1,40,S);
  for(const x of [161.5,169]) for(let z=-18;z<=18;z+=4){ K.round(x,z,-0.5,4.5,0.7,S); K.round(x,z,4.5,6.6,0.85,S); K.round(x,z,6.6,7.5,1.05,S); }   /* tent-poles */
  for(const x of [156,174.5]) for(let z=-34;z<=34;z+=4.25) box(x-0.55,-0.5,z-0.55,x+0.55,5.6,z+0.55,S);
  box(152.5,5.6,-37.5,159,6.4,37.5,S); box(171.5,5.6,-37.5,178,6.4,37.5,S); box(159,7.5,-37.5,171.5,8.4,37.5,S);
  for(let z=-37.5;z<37.5;z+=3) for(const x of [159,170.7]) box(x,6.4,z,x+0.8,7.5,z+0.9,S);              /* the windows under the high roof */
  for(const z of [-20,0,20]){ box(180,-1,z-0.5,190,6.5,z+0.5,S); box(194,-1,z-0.5,207.5,6.5,z+0.5,S); }
  box(180,6.5,-37.5,207.5,7.3,37.5,S);
  /* ---- the sacred lake, the granite scarab at its corner ---- */
  box(84,-4.8,66,204,0.6,68,HS); box(84,-4.8,141,204,0.6,143,HS); box(84,-4.8,68,86,0.6,141,HS); box(202,-4.8,68,204,0.6,141,HS);
  box(86,-4.4,68,202,-0.5,141,'waterB');
  for(let i=0;i<4;i++) box(86,-4.4,68+i*1.2,96,-0.5-i*0.9,69.2+i*1.2,HS);                          /* steps down into the water */
  box(78.8,-0.5,60.8,81.2,1.8,63.2,RG); box(79.2,1.8,61.2,80.8,3.0,63.0,RG);
  /* ---- the southern way: pylons VII to X and their courts ---- */
  for(const s of [-1,1]) box(48+s*14,-1,52,48+s*16,9,70,S);
  pylon({ax:'z',a0:70,a1:79,c:48,hw:31,h:20,gw:2.6,gh:12});
  for(const s of [-1,1]) box(48+s*24,-1,79,48+s*26,9,118,S);
  pylon({ax:'z',a0:118,a1:128,c:48,hw:30,h:22,gw:2.6,gh:13});
  for(const s of [-1,1]) box(48+s*24,-1,128,48+s*26,9,178,S);
  pylon({ax:'z',a0:178,a1:188,c:48,hw:31,h:19,gw:2.6,gh:12});
  for(const s of [-1,1]) box(48+s*24,-1,188,48+s*26,9,244,S);
  pylon({ax:'z',a0:244,a1:254,c:48,hw:32,h:18,gw:2.6,gh:11});
  box(46,-0.8,52,50,0.1,254,S);
  /* ---- the enclosure of mud brick, with the eastern gate of stone ---- */
  box(-147,-1,-180,-139,15,-56.5,MB); box(-147,-1,56.5,-139,15,254,MB);
  box(-147,-1,-180,262,15,-172,MB);
  box(254,-1,-172,262,15,-9,MB); box(254,-1,9,262,15,254,MB);
  box(-147,-1,246,16,15,254,MB); box(80,-1,246,262,15,254,MB);
  box(252,-1,-9,264,19,-2.5,S); box(252,-1,2.5,264,19,9,S); box(252,13,-2.5,264,19,2.5,S); box(251.4,19,-9.6,264.6,20.2,9.6,S);
};

/* ============================== PETRA: THE TREASURY ==============================
   The facade looks east, down the Siq; the rock stands behind it and about the plaza before it. */
F.petra=function(api){ const K=kit(api), box=K.box, R='roseRock';
  K.level(0,-20,30,20,'sand','sand'); K.level(30,-1.6,85,1.6,'sand','sand'); K.level(85,-0.6,140,3,'sand','sand'); K.level(8,-45,22,-20,'sand','sand');
  /* the cliff behind, the facade cut back into it, the great chamber and its door hollowed in it */
  K.carve([-30,-4,-45,0,47,45],[
    [-6,0,-13.5,0.1,44,13.5],                    /* the recess the facade stands in */
    [-19.5,1.2,-6.25,-7.5,10,6.25],              /* the chamber, 12.5 m square */
    [-7.6,1.2,-1.8,-5.9,9.2,1.8],                /* its door */
    [-21.5,2.6,-2.2,-19.4,7.4,2.2]],R);          /* the niche at its back */
  /* the rock about the plaza, the outer Siq going north, and the Siq itself coming in from the east */
  K.crag(-30,-45,0,45,47,47,66,R,{face:'+x',seed:2});                                                  /* the rock over the facade */
  box(-34,-4,-50,-30,30,50,R); K.crag(-60,-50,-30,50,-4,20,48,R,{seed:9});                             /* and the mountain behind it */
  K.crag(0,20,45,50,-4,40,62,R,{face:'-z',seed:3}); K.crag(0,-50,8,-20,-4,40,60,R,{face:'+z',seed:4}); K.crag(22,-50,45,-20,-4,40,60,R,{face:'+z',seed:5});
  K.crag(30,-20,45,-1.6,-4,44,64,R,{face:'+z',c:4,seed:6}); K.crag(30,1.6,45,20,-4,44,64,R,{face:'-z',c:4,seed:7});
  K.crag(45,-18,85,-1.6,-4,48,72,R,{face:'+z',c:4,seed:8}); K.crag(45,1.6,85,18,-4,48,72,R,{face:'-z',c:4,seed:10});
  K.crag(85,-16,140,-0.6,-4,46,70,R,{face:'+z',c:4,seed:11}); K.crag(85,3.0,140,20,-4,46,70,R,{face:'-z',c:4,seed:12});
  /* the lower storey: the platform and its steps, six columns, the wings with their side chambers */
  box(-6,-0.5,-13.5,1.6,1.2,13.5,R); box(1.6,-0.5,-8.2,2.4,0.8,8.2,R); box(2.4,-0.5,-8.2,3.2,0.4,8.2,R);
  for(const s of [-1,1]){ const z0=s*8.4, z1=s*13.5;
    K.carve([-6,1.2,Math.min(z0,z1),-1.2,12.6,Math.max(z0,z1)],[[-5.2,1.2,s*9.2,-2.0,7.5,s*13.0],[-4.4,1.2,s*8.3,-2.8,6,s*9.3]],R); }
  for(const z of [-11.3,-6.95,-2.4,2.4,6.95,11.3]){ K.round(-0.6,z,1.2,1.8,0.75,R); K.round(-0.6,z,1.8,11.4,0.55,R); K.round(-0.6,z,11.4,12.6,0.8,R); }
  box(-6,12.6,-13.5,0.4,14.4,13.5,R); box(-6,14.4,-13.8,0.8,15.0,13.8,R);                              /* the entablature, the cornice */
  for(let i=0;i<6;i++){ const w=8.4*(1-i/6); box(-2.5,15+i*0.6,-w,0.6,15+(i+1)*0.6,w,R); }                 /* the pediment */
  box(-6,15,-13.5,-2.5,19.8,13.5,R);                                                                    /* the attic */
  /* the great door's frame and its little pediment */
  for(const s of [-1,1]) box(-6.0,1.2,s*1.8,-5.5,9.6,s*2.6,R);
  box(-6.0,9.2,-2.6,-5.5,10.0,2.6,R); for(let i=0;i<3;i++){ const w=2.8*(1-i/3); box(-6,10+i*0.4,-w,-5.4,10.4+i*0.4,w,R); }
  /* the upper storey: the tholos, its cone and its urn, between the halves of the broken pediment */
  box(-6,19.8,-13.5,-1.0,20.6,13.5,R);
  K.round(-4.2,0,20.6,29.6,2.4,R);
  for(let a=-90;a<=90;a+=36){ const t=a*Math.PI/180, cx=-4.2+3.1*Math.cos(t), cz=3.1*Math.sin(t);
    K.round(cx,cz,20.6,28.8,0.42,R); K.round(cx,cz,28.8,29.6,0.6,R); }
  K.round(-4.2,0,29.6,31.0,3.6,R); K.round(-4.2,0,31,32,3.0,R); K.round(-4.2,0,32,33,2.2,R); K.round(-4.2,0,33,34,1.4,R); K.round(-4.2,0,34,34.8,0.8,R);
  K.round(-4.2,0,34.8,35.6,0.7,R); K.round(-4.2,0,35.6,36.2,0.55,R); K.round(-4.2,0,36.2,38.3,1.1,R); K.round(-4.2,0,38.3,39.1,0.5,R);
  for(const s of [-1,1]){ box(-6,20.6,s*6.2,-3.4,29.6,s*13.5,R);
    for(const z of [7.0,12.7]){ K.round(-1.6,s*z,20.6,28.8,0.45,R); K.round(-1.6,s*z,28.8,29.6,0.62,R); }
    box(-6,29.6,s*6.2,-1.0,31.0,s*13.5,R);
    for(let i=0;i<5;i++){ const w=7.3*(1-i/5); box(-6,31+i*0.5,s*6.2,-1.0,31.5+i*0.5,s*(6.2+w),R); } }
};

/* ============================== PERSEPOLIS ==============================
   The terrace against the mountain on the east; the stair on its west face, toward the north. */
F.persepolis=function(api){ const K=kit(api), box=K.box, GS='greyStone', MB='mudbrick', ST='stone', TY=12;
  /* the terrace: its retaining walls of great grey blocks and its paved top */
  box(-150,-4,-230,-146,TY,225,GS); box(146,-4,-230,150,TY,225,GS); box(-150,-4,-230,150,TY,-226,GS); box(-150,-4,221,150,TY,225,GS);
  box(-146,TY-3,-226,146,TY,221,ST);
  box(-150,TY,-226,-148.6,TY+1.0,221,GS); K.merlons('z',-226,221,-149.3,TY+1.0,GS,2.2);
  /* the wall of mud brick on the north, east and south, towered */
  box(138,TY,-226,146,TY+11,221,MB); box(-146,TY,-226,146,TY+11,-218,MB); box(-146,TY,213,146,TY+11,221,MB);
  for(let z=-210;z<=210;z+=30) box(136,TY,z-5,148,TY+14,z+5,MB);
  for(let x=-130;x<=130;x+=40){ box(x-5,TY,-228,x+5,TY+14,-216,MB); box(x-5,TY,211,x+5,TY+14,223,MB); }
  /* the great double stair: two flights out and up, a landing, two flights back to the top */
  const zS=-160;
  for(const s of [-1,1]){ K.flight('z',zS+s*3.5,zS+s*27.5,-164,-157,0,6.6,32,GS);
    box(-164,-1,zS+s*27.5,-150,6.6,zS+s*34.5,GS);
    K.flight('z',zS+s*27.5,zS+s*9.5,-157,-150,6.6,TY,26,GS);
    box(-164.8,-1,zS+s*3.5,-164,7.6,zS+s*34.5,GS); }
  box(-157,-1,zS-9.5,-146,TY,zS+9.5,GS);
  /* a Persian column: the bell of its base, the fluted shaft, the capital of the double bull */
  const col=(cx,cz,y0,h,ax,bull)=>{ box(cx-1.2,y0,cz-1.2,cx+1.2,y0+0.4,cz+1.2,GS); K.round(cx,cz,y0+0.4,y0+1.5,1.25,GS); K.round(cx,cz,y0+1.5,y0+1.9,0.95,GS);
    K.round(cx,cz,y0+1.9,y0+h-(bull?5.0:2.2),0.8,GS);
    if(!bull){ K.round(cx,cz,y0+h-2.2,y0+h-0.6,1.0,GS); box(cx-1.1,y0+h-0.6,cz-1.1,cx+1.1,y0+h,cz+1.1,GS); return; }
    K.round(cx,cz,y0+h-5.0,y0+h-3.6,1.0,GS);
    const L=ax==='x'?[2.7,0.75]:[0.75,2.7], H=ax==='x'?[3.3,0.6]:[0.6,3.3];
    box(cx-1.3,y0+h-3.6,cz-1.3,cx+1.3,y0+h-2.4,cz+1.3,GS);                                           /* the volutes */
    box(cx-L[0],y0+h-2.4,cz-L[1],cx+L[0],y0+h-0.5,cz+L[1],GS);                                          /* the two bulls' bodies */
    box(cx-H[0],y0+h-1.8,cz-H[1],cx+H[0],y0+h-0.2,cz+H[1],GS); };                                        /* their heads, out at the ends */
  /* the guardian bulls at a door: `hu`, the winged bull with the head of a man (the face kept plain) */
  const lamassu=(cx,cz,y0,dir,hu)=>{ const f=dir;                                                     /* dir: ±1, the way it faces along x */
    box(cx-2.8,y0,cz-0.9,cx+2.8,y0+1.1,cz+0.9,GS);
    for(const a of [-2.1,1.6]) box(cx+a*f-0.45,y0+1.1,cz-0.8,cx+a*f+0.45,y0+3.0,cz+0.8,GS);
    box(cx-2.6,y0+3.0,cz-0.85,cx+2.6,y0+5.0,cz+0.85,GS);
    box(cx-1.8,y0+4.4,cz-0.95,cx+1.2,y0+6.4,cz+0.95,GS);                                              /* the wings folded back */
    box(cx+f*2.2-0.7,y0+4.6,cz-0.7,cx+f*2.2+0.7,y0+6.4,cz+0.7,GS);
    if(hu) box(cx+f*2.2-0.6,y0+6.4,cz-0.6,cx+f*2.2+0.6,y0+7.6,cz+0.6,GS); };                           /* the tall crown */
  /* ---- the gate of all nations ---- */
  K.carve([-137.5,TY,-172.5,-112.5,TY+18,-147.5],[[-133.5,TY,-168.5,-116.5,TY+17,-151.5],
    [-137.6,TY,zS-2.4,-133.4,TY+11,zS+2.4],[-116.6,TY,zS-2.4,-112.4,TY+11,zS+2.4],[-127.4,TY,-151.6,-122.6,TY+11,-147.4]],MB);
  for(const s of [-1,1]){ box(-139.5,TY,zS+s*2.4,-135.5,TY+11.5,zS+s*4.4,GS); box(-114.5,TY,zS+s*2.4,-110.5,TY+11.5,zS+s*4.4,GS); }
  box(-139.5,TY+11,zS-4.4,-135.5,TY+12.4,zS+4.4,GS); box(-114.5,TY+11,zS-4.4,-110.5,TY+12.4,zS+4.4,GS);
  for(const s of [-1,1]){ lamassu(-142.5,zS+s*3.4,TY,-1,false); lamassu(-107.5,zS+s*3.4,TY,1,true); }
  for(const sx of [-1,1]) for(const sz of [-1,1]) col(-125+sx*5.8,zS+sz*5.8,TY,16.5,'x',true);
  K.merlons('x',-137.5,-112.5,-172,TY+18,GS); K.merlons('x',-137.5,-112.5,-148,TY+18,GS);
  /* ---- the Apadana on its platform, its two stairs of the tribute-bearers ---- */
  const ax0=-75, az0=-80, PT=TY+2.6, cx=ax0, cz=az0;
  box(cx-60,TY-1,cz-60,cx+60,PT,cz+60,GS);
  for(const s of [-1,1]){
    K.flight('x',cx+s*40,cx+s*8,cz-68,cz-61,TY,PT,13,GS); box(cx-8,TY-1,cz-68,cx+8,PT,cz-60,GS);       /* the north stair */
    K.flight('z',cz+s*40,cz+s*8,cx+61,cx+68,TY,PT,13,GS); box(cx+60,TY-1,cz-8,cx+68,PT,cz+8,GS); }      /* the east stair */
  box(cx-40,PT,cz-68.6,cx+40,PT+1,cz-68,GS); box(cx+68,PT,cz-40,cx+68.6,PT+1,cz+40,GS);
  const HP=[-21.6,-12.96,-4.32,4.32,12.96,21.6];
  K.carve([cx-35.25,PT,cz-35.25,cx+35.25,PT+21.5,cz+35.25],[[cx-30.25,PT,cz-30.25,cx+30.25,PT+20,cz+30.25],
    [cx-2.3,PT,cz-35.3,cx+2.3,PT+9,cz-30.2],[cx+30.2,PT,cz-2.3,cx+35.3,PT+9,cz+2.3],[cx-35.3,PT,cz-2.3,cx-30.2,PT+9,cz+2.3]],MB);
  for(const a of HP) for(const b of HP) col(cx+a,cz+b,PT,20,'x',true);
  /* the porticoes, north, east and west: two rows of six */
  for(const d of [41.5,50]) for(const a of HP){ col(cx+a,cz-d,PT,20,'z',true); col(cx+d,cz+a,PT,20,'x',true); col(cx-d,cz+a,PT,20,'x',true); }
  box(cx-35.25,PT+20,cz-56,cx+35.25,PT+21.5,cz-35.25,MB); box(cx+35.25,PT+20,cz-35.25,cx+56,PT+21.5,cz+35.25,MB); box(cx-56,PT+20,cz-35.25,cx-35.25,PT+21.5,cz+35.25,MB);
  box(cx-35.25,PT,cz+35.25,cx+35.25,PT+21.5,cz+56,MB);                                                 /* the storerooms on the south */
  for(const sx of [-1,1]) for(const sz of [-1,1]){ const x0=cx+sx*35.25, x1=cx+sx*56, z0=cz+sz*35.25, z1=cz+sz*56;
    box(x0,PT,z0,x1,PT+24,z1,MB); K.merlons('x',Math.min(x0,x1),Math.max(x0,x1),Math.min(z0,z1)+0.5,PT+24,GS); K.merlons('x',Math.min(x0,x1),Math.max(x0,x1),Math.max(z0,z1)-0.5,PT+24,GS); }
  K.merlons('x',cx-35.25,cx+35.25,cz-55.5,PT+21.5,GS); K.merlons('z',cz-35.25,cz+35.25,cx+55.5,PT+21.5,GS); K.merlons('z',cz-35.25,cz+35.25,cx-55.5,PT+21.5,GS);
  /* ---- the hall of a hundred columns, its porch of sixteen, its bulls ---- */
  const hx=45, hz=-70, HC=[]; for(let k=0;k<5;k++){ HC.push(3.425+k*6.85); HC.push(-3.425-k*6.85); }
  K.carve([hx-37.75,TY,hz-37.75,hx+37.75,TY+15.5,hz+37.75],[[hx-34.25,TY,hz-34.25,hx+34.25,TY+14,hz+34.25],
    ...[-11.4,11.4].flatMap(a=>[[hx+a-1.6,TY,hz-37.8,hx+a+1.6,TY+7.5,hz-34.2],[hx+a-1.6,TY,hz+34.2,hx+a+1.6,TY+7.5,hz+37.8],
      [hx-37.8,TY,hz+a-1.6,hx-34.2,TY+7.5,hz+a+1.6],[hx+34.2,TY,hz+a-1.6,hx+37.8,TY+7.5,hz+a+1.6]])],MB);
  for(const a of HC) for(const b of HC) col(hx+a,hz+b,TY,14,'x',true);
  for(const d of [42,49]) for(let k=0;k<4;k++) for(const s of [-1,1]) col(hx+s*(3.65+k*7.3),hz-d,TY,14,'z',true);
  box(hx-34,TY+14,hz-52.75,hx+34,TY+15.5,hz-37.75,MB);
  for(const s of [-1,1]){ box(hx+s*34,TY,hz-52.75,hx+s*37.75,TY+15.5,hz-37.75,MB); lamassu(hx+s*30.5,hz-54,TY,1,false); }
  /* ---- the palace of Darius (the Tachara), facing south over its stair ---- */
  const TP=TY+2.6;
  box(-112,TY-1,-10,-78,TP,34,GS);
  K.carve([-108,TP,-8,-82,TP+12,28],[[-104,TP,-5,-86,TP+11,14],[-104,TP,16,-86,TP+11,28.1],[-97.2,TP,13.9,-92.8,TP+7,16.1],
    [-108.1,TP+3,0,-103.9,TP+6,2.4],[-108.1,TP+3,7,-103.9,TP+6,9.4],[-86.1,TP+3,0,-81.9,TP+6,2.4],[-86.1,TP+3,7,-81.9,TP+6,9.4]],MB);
  for(const x of [-100.5,-95,-89.5]) for(const z of [-2,2.5,7,11.5]) col(x,z,TP,11,'x',false);
  for(const x of [-101,-97,-93,-89]) for(const z of [19,24]) col(x,z,TP,11,'x',false);
  K.flight('z',42,34,-100,-90,TY,TP,8,GS);
  /* ---- the council hall (the Tripylon) ---- */
  K.carve([-37.5,TY,-32.5,-12.5,TY+13,-7.5],[[-34.5,TY,-29.5,-15.5,TY+12,-10.5],[-27.2,TY,-32.6,-22.8,TY+8,-29.4],[-27.2,TY,-10.6,-22.8,TY+8,-7.4],[-37.6,TY,-22.2,-34.4,TY+8,-17.8]],MB);
  for(const sx of [-1,1]) for(const sz of [-1,1]) col(-25+sx*4.5,-20+sz*4.5,TY,12,'x',false);
  /* ---- the palace of Xerxes (the Hadish) on its own platform ---- */
  const XP=TY+3;
  box(-82,TY-1,36,-28,XP,100,GS); K.flight('x',-90,-82,40,48,TY,XP,9,GS);
  K.carve([-78,XP,50,-32,XP+15,96],[[-75,XP,53,-35,XP+14,93],[-57.3,XP,49.9,-52.7,XP+8,53.1]],MB);
  for(let i=0;i<6;i++) for(let j=0;j<6;j++) col(-70.25+i*6.1,57.75+j*6.1,XP,14,'x',false);
  for(let i=0;i<6;i++) for(const z of [42.5,47]) col(-70.25+i*6.1,z,XP,14,'x',false);
  box(-78,XP+14,40,-32,XP+15,50,MB);
  /* ---- the treasury: its hall of ninety-nine columns of plastered cedar, and its storerooms ---- */
  K.carve([40,TY,70,135,TY+9,150],[[44,TY,74,88,TY+8,122],[92,TY,74,131,TY+8,100],[92,TY,104,131,TY+8,146],[44,TY,126,88,TY+8,146],
    [60,TY,69.9,64,TY+5,74.1],[88,TY,85,92,TY+5,89],[88,TY,130,92,TY+5,134]],MB);
  for(let i=0;i<9;i++) for(let j=0;j<11;j++) K.round(48+i*4.5,78+j*4.2,TY,TY+8,0.45,'plaster');
  /* ---- the women's palace (the harem), a hall of twelve and its rows of rooms ---- */
  K.carve([-40,TY,110,40,TY+10,170],[[-12,TY,114,12,TY+9,140],[-2,TY,109.9,2,TY+6,114.1],
    ...[-36,-28,-20,20,28].map(x=>[x,TY,146,x+6,TY+8,166]),[-36,TY,114,-16,TY+8,140],[16,TY,114,36,TY+8,140]],MB);
  for(const x of [-7,0,7]) for(const z of [119,126,133]) col(x,z,TY,9,'x',false);
};

/* ============================== THE PARTHENON ==============================
   Its long side east and west; the door of the cella faces the sunrise. */
F.parthenon=function(api){ const K=kit(api), box=K.box, M='marble', BS='basalt';
  K.level(-45,-25,45,25,'stone','stone');
  /* the three steps and the stylobate */
  box(-36.15,-2,-16.85,36.15,0.55,16.85,M); box(-35.45,0.55,-16.15,35.45,1.1,16.15,M); box(-34.75,1.1,-15.45,34.75,1.65,15.45,M);
  const Y0=1.65, CH=10.43, A0=Y0+CH;
  const doric=(cx,cz,y0,h,r)=>{ K.round(cx,cz,y0,y0+h*0.5,r,M); K.round(cx,cz,y0+h*0.5,y0+h-0.8,r*0.88,M);
    K.round(cx,cz,y0+h-0.8,y0+h-0.43,r*1.1,M); box(cx-r*1.12,y0+h-0.43,cz-r*1.12,cx+r*1.12,y0+h,cz+r*1.12,M); };
  /* eight by seventeen, all round */
  for(let i=0;i<8;i++){ const z=-14.5+i*29/7; doric(-33.8,z,Y0,CH,0.95); doric(33.8,z,Y0,CH,0.95); }
  for(let i=1;i<16;i++){ const x=-33.8+i*67.6/16; doric(x,-14.5,Y0,CH,0.95); doric(x,14.5,Y0,CH,0.95); }
  /* the porches of six, east and west, a step up */
  box(-29.2,Y0,-10.9,29.2,Y0+0.35,10.9,M);
  for(let i=0;i<6;i++){ const z=-8.6+i*3.44; doric(27.6,z,Y0+0.35,CH-0.35,0.85); doric(-27.6,z,Y0+0.35,CH-0.35,0.85); }
  /* the cella: the naos, the west room, their doors */
  K.carve([-24.5,Y0+0.35,-10.9,24.5,A0,10.9],[[-23.3,Y0+0.35,-9.7,-6.0,A0+0.1,9.7],[-4.8,Y0+0.35,-9.7,23.3,A0+0.1,9.7],
    [23.2,Y0+0.35,-2.45,24.6,Y0+10.2,2.45],[-24.6,Y0+0.35,-2.0,-23.2,Y0+8.4,2.0]],M);
  /* the naos's two storeys of Doric columns, about the base of the image (no image is raised) */
  for(let i=0;i<10;i++){ const x=-2.6+i*2.5; for(const z of [-5.5,5.5]){ K.round(x,z,Y0+0.35,Y0+5.4,0.5,M); K.round(x,z,Y0+5.9,Y0+9.7,0.38,M); } }
  for(const z of [-2.75,0,2.75]){ K.round(-2.6,z,Y0+0.35,Y0+5.4,0.5,M); K.round(-2.6,z,Y0+5.9,Y0+9.7,0.38,M); }
  for(const s of [-1,1]) box(-3.1,Y0+5.4,s*5.0,20.4,Y0+5.9,s*6.0,M);
  box(-3.1,Y0+5.4,-6,-2.1,Y0+5.9,6,M);
  box(0.5,Y0+0.35,-4.05,4.6,Y0+1.45,4.05,M);                                                          /* the base */
  box(5.6,Y0-0.2,-3,10,Y0+0.3,3,'waterB');                                                             /* the shallow pool before it */
  for(const x of [-17.5,-11.7]) for(const z of [-4.5,4.5]){ K.round(x,z,Y0+0.35,A0-0.6,0.55,M); box(x-0.9,A0-0.6,z-0.6,x+0.9,A0,z+0.6,M); }
  /* the entablature: architrave, the frieze of triglyphs, the cornice */
  box(-34.75,A0,-15.45,34.75,A0+1.35,15.45,M); box(-34.75,A0+1.35,-15.45,34.75,A0+2.7,15.45,M);
  const tri=(x,z,ax)=>ax==='x'?box(x-0.42,A0+1.35,z-0.4,x+0.42,A0+2.7,z+0.4,BS):box(x-0.4,A0+1.35,z-0.42,x+0.4,A0+2.7,z+0.42,BS);
  for(let i=0;i<=32;i++){ const x=-33.8+i*67.6/32; tri(x,-15.45+0.35,'x'); tri(x,15.45-0.35,'x'); }
  for(let i=0;i<=14;i++){ const z=-14.5+i*29/14; tri(-34.75+0.35,z,'z'); tri(34.75-0.35,z,'z'); }
  box(-35.3,A0+2.7,-16.0,35.3,A0+3.3,16.0,M);
  /* the roof of marble tiles; its stepped ends are the pediments; the acroteria */
  K.gable('x',-35.3,35.3,-16.0,16.0,A0+3.3,3.8,7,M);
  for(const x of [-35,35]){ box(x-0.5,A0+7.1,-0.6,x+0.5,A0+8.6,0.6,M); for(const s of [-1,1]) box(x-0.5,A0+3.3,s*15.2,x+0.5,A0+4.6,s*15.9,M); }
};

/* ============================== ARTEMIS AT EPHESUS ==============================
   Two rows of columns all round; the sekos open to the sky; the front to the west. */
F.artemis=function(api){ const K=kit(api), box=K.box, M='marble';
  K.level(-125,-50,80,50,'stone','stone');
  for(let i=0;i<6;i++){ const o=(6-i)*0.85; box(-68.5-o,i?i*0.43:-2,-34.5-o,68.5+o,(i+1)*0.43,34.5+o,M); }
  const Y0=2.6, CH=18;
  const ionic=(cx,cz,sculpt)=>{ K.round(cx,cz,Y0,Y0+0.45,1.4,M); K.round(cx,cz,Y0+0.45,Y0+0.85,1.2,M);
    if(sculpt) K.round(cx,cz,Y0+0.85,Y0+2.8,1.1,M);                                                    /* the sculptured drum */
    K.round(cx,cz,Y0+0.85,Y0+CH-1.0,0.95,M); K.round(cx,cz,Y0+CH-1.0,Y0+CH-0.6,1.05,M);
    box(cx-1.45,Y0+CH-1.0,cz-0.95,cx+1.45,Y0+CH-0.2,cz+0.95,M); box(cx-1.15,Y0+CH-0.2,cz-1.15,cx+1.15,Y0+CH,cz+1.15,M); };
  const XS=[], ZS=[]; for(let i=0;i<21;i++) XS.push(-66.3+i*6.63); for(let i=0;i<8;i++) ZS.push(-32.3+i*9.23);
  for(const x of XS) for(const z of [ZS[0],ZS[7],ZS[1],ZS[6]]){ if((z===ZS[1]||z===ZS[6])&&(x===XS[0]||x===XS[20])) continue; ionic(x,z,x<-50); }
  for(const z of ZS.slice(1,7)) for(const x of [XS[0],XS[20],XS[1],XS[19]]) ionic(x,z,x<0);
  for(const z of ZS.slice(2,6)) for(const x of [XS[2],XS[3],XS[4]]) ionic(x,z,true);                    /* the deep porch at the west */
  for(const z of ZS.slice(2,6)) ionic(XS[18],z,false);                                                  /* and the shallow one at the east */
  /* the sekos, roofless, its door, the little shrine within (no image) */
  K.carve([-36,Y0,-16,48,Y0+CH,16],[[-34.4,Y0,-14.4,46.4,Y0+CH+0.1,14.4],[-36.1,Y0,-3,-34.3,Y0+12,3]],M);
  box(32,Y0,-5,42,Y0+9,5,M); for(const z of [-4.2,-1.5,1.5,4.2]) K.round(30.2,z,Y0,Y0+8.4,0.4,M);
  box(29.6,Y0+8.4,-5.3,42,Y0+9.4,5.3,M); K.gable('x',29.6,42,-5.3,5.3,Y0+9.4,1.6,3,M);
  /* the entablature and the roof, both open over the sekos; the three openings in the west pediment */
  const hole=[-34.4,-1,-14.4,46.4,99,14.4], A=Y0+CH;
  K.carve([-68.5,A,-34.5,68.5,A+1.6,34.5],[hole],M); K.carve([-68.5,A+1.6,-34.5,68.5,A+2.4,34.5],[hole],M); K.carve([-69.1,A+2.4,-35.1,69.1,A+3.0,35.1],[hole],M);
  K.gable('x',-69.1,69.1,-35.1,35.1,A+3.0,6.4,8,M,[hole,[-69.2,A+3.4,-1.4,-66.5,A+6.4,1.4],[-69.2,A+3.4,-9.6,-66.5,A+5.0,-6.8],[-69.2,A+3.4,6.8,-66.5,A+5.0,9.6]]);
  /* the great altar in its court, west of the temple */
  K.carve([-120,-0.5,-17,-92,4.2,17],[[-118,0,-15,-92.1,4.3,15]],M);
  box(-112,-0.5,-6,-104,2.2,6,M); K.flight('x',-96,-104,-3,3,0,2.2,5,M);
};

/* ============================== BAALBEK (HELIOPOLIS) ==============================
   The temple of Jupiter at the west on its podium, its courts going east to the propylaea. */
F.baalbek=function(api){ const K=kit(api), box=K.box, L='sandstone', HS='hewnStone', RG='redGranite', C=5;
  K.level(-55,-60,280,125,'stone','stone');
  /* the outer podium on the west, six courses and then the trilithon, three stones of 19 m */
  box(-48.4,-2,-34,-44,7,34,HS);
  for(const [a,b] of [[-28.65,-9.7],[-9.55,9.55],[9.7,28.65]]) box(-48.4,7,a,-44,11.3,b,L);
  box(-48.4,7,-34,-44,11.3,-28.8,HS); box(-48.4,7,28.8,-44,11.3,34,HS);
  /* the podium of Jupiter's house, and the great court raised before it */
  const Y0=12; box(-44,-2,-24,44,Y0,24,L);
  box(44,-2,-56,190,C,56,HS);
  K.flight('x',58,44,-16,16,C,Y0,14,L);
  /* ten by nineteen columns of 23 m, their bases and Corinthian heads */
  const corin=(cx,cz,y0,h,r,m)=>{ K.round(cx,cz,y0,y0+1.2,r*1.4,L); K.round(cx,cz,y0+1.2,y0+h-2.1,r,m||L); K.round(cx,cz,y0+h-2.1,y0+h-0.6,r*1.25,L);
    box(cx-r*1.5,y0+h-0.6,cz-r*1.5,cx+r*1.5,y0+h,cz+r*1.5,L); };
  for(let i=0;i<10;i++){ const z=-21.8+i*43.6/9; corin(-41.8,z,Y0,22.9,1.1); corin(41.8,z,Y0,22.9,1.1); }
  for(let i=1;i<18;i++){ const x=-41.8+i*83.6/18; corin(x,-21.8,Y0,22.9,1.1); corin(x,21.8,Y0,22.9,1.1); }
  K.carve([-30,Y0,-13,28,Y0+22.9,13],[[-28.4,Y0,-11.4,26.4,Y0+21.4,11.4],[26.3,Y0,-3,28.1,Y0+13,3]],L);
  box(-28.4,Y0,-11.4,-18,Y0+3,11.4,L); K.flight('x',-14,-18,-4,4,Y0,Y0+3,6,L);                        /* the raised adyton */
  const A=Y0+22.9; box(-44,A,-24,44,A+1.7,24,L); box(-44,A+1.7,-24,44,A+3.3,24,L); box(-44.8,A+3.3,-24.8,44.8,A+5,24.8,L);
  K.gable('x',-44.8,44.8,-24.8,24.8,A+5,7,7,L);
  /* the great court: porticoes of granite columns, exedrae in the walls, the tower altar, two basins */
  for(const s of [-1,1]){
    K.carve([56,C,Math.min(s*52,s*56),186,C+12,Math.max(s*52,s*56)],[80,120,160].map(x=>[x-5,C,s>0?52:-55,x+5,C+9,s>0?55:-52]),L);
    for(let x=60;x<=184;x+=6){ K.round(x,s*47,C,C+0.8,0.85,L); K.round(x,s*47,C+0.8,C+7.6,0.6,RG); box(x-0.9,C+7.6,s*47-0.9,x+0.9,C+8.5,s*47+0.9,L); }
    box(56,C+8.5,s*45.8,186,C+10,s*52,L);
    box(130,C-1.2,s*14,160,C+0.8,s*15,HS); box(130,C-1.2,s*24,160,C+0.8,s*25,HS); box(130,C-1.2,s*14,131,C+0.8,s*25,HS); box(159,C-1.2,s*14,160,C+0.8,s*25,HS);
    box(131,C-1.0,s*15,159,C+0.4,s*24,'waterB'); }
  box(186,C,-56,190,C+12,-4,L); box(186,C,4,190,C+12,56,L); box(186,C+9,-4,190,C+12,4,L);
  box(92,C,-10,112,C+17,10,L); K.flight('x',122,112,-3,3,C,C+17,24,L);
  box(118,C,-4,126,C+3,4,L);
  /* the hexagonal forecourt, its ring of granite columns */
  const hc=[217.5,0], hr=28, hp=[]; for(let i=0;i<=6;i++){ const a=Math.PI/6+i*Math.PI/3; hp.push([hc[0]+hr*Math.cos(a),hc[1]+hr*Math.sin(a)]); }
  box(190,-2,-30,245,C,30,HS);
  K.wallLine(hp.slice(0,4),C,C+12,3,L); K.wallLine(hp.slice(4),C,C+12,3,L);
  for(let i=0;i<24;i++){ const a=i/24*Math.PI*2; K.round(hc[0]+21*Math.cos(a),hc[1]+21*Math.sin(a),C,C+8,0.6,RG); }
  /* the propylaea: a portico of twelve between two towers, and the stair down to the east */
  box(245,-2,-32,262,C,32,HS);
  K.carve([245,C,-32,247.5,C+16,32],[[244.9,C,-2.5,247.6,C+9,2.5],[244.9,C,-12,247.6,C+7,-8],[244.9,C,8,247.6,C+7,12]],L);
  for(const s of [-1,1]) box(245,C,s*22,262,C+20,s*32,L);
  for(let i=0;i<12;i++) corin(255,-19.8+i*3.6,C,14,0.65);
  box(247.5,C+14,-22,262,C+16,22,L);
  K.flight('x',276,262,-20,20,0,C,14,L);
  /* the temple of Bacchus, south of the great house, on its own podium */
  const bx=40, bz=100, BY=5;
  box(bx-36,-2,bz-19,bx+33,BY,bz+19,L); K.flight('x',bx+45,bx+33,bz-8,bz+8,0,BY,12,L);
  for(let i=0;i<8;i++){ const z=bz-15.9+i*31.8/7; corin(bx-31.4,z,BY,19,0.95); corin(bx+31.4,z,BY,19,0.95); }
  for(let i=1;i<14;i++){ const x=bx-31.4+i*62.8/14; corin(x,bz-15.9,BY,19,0.95); corin(x,bz+15.9,BY,19,0.95); }
  K.carve([bx-24,BY,bz-11,bx+22,BY+19,bz+11],[[bx-22.5,BY,bz-9.5,bx+20.5,BY+18,bz+9.5],[bx+20.4,BY,bz-3.25,bx+22.1,BY+13,bz+3.25]],L);
  box(bx-33,BY+19,bz-17.5,bx+33,BY+23,bz+17.5,L); K.gable('x',bx-33.6,bx+33.6,bz-18.1,bz+18.1,BY+23,5,6,L);
};

/* ============================== THE ZIGGURAT OF UR ==============================
   The three stairs climb its north-east face (here the north) to the gatehouse on the first stage. */
F.ur=function(api){ const K=kit(api), box=K.box, BR='brick', MB='mudbrick', T=api.tm.tiers;
  K.level(-50,-65,50,40,'sand','sand');
  let y=0;
  for(let t=0;t<T.length;t++){ const [w,d,h]=T[t];
    for(let i=0;i<3;i++){ const o=i*h*0.06; box(-w/2+o,i?y+h*i/3:y-3,-d/2+o,w/2-o,y+h*(i+1)/3,d/2-o,BR,MB); }   /* battered walls */
    for(let x=-w/2+3;x<w/2-2;x+=4.5) for(const s of [-1,1]) box(x-0.7,y,s*d/2-0.5,x+0.7,y+h-0.4,s*d/2+0.5,BR);   /* the buttresses */
    for(let z=-d/2+3;z<d/2-2;z+=4.5) for(const s of [-1,1]) box(s*w/2-0.5,y,z-0.7,s*w/2+0.5,y+h-0.4,z+0.7,BR);
    y+=h; }
  const [w0,d0,h0]=T[0], [,d1,h1]=T[1], [,d2]=T[2];
  /* the central stair, out from the face, and its continuation to the top */
  K.flight('z',-d0/2-30,-d0/2,-4,4,0,h0,34,BR);
  K.flight('z',-d0/2,-d1/2,-3,3,h0,h0+h1,16,BR);
  K.flight('z',-d1/2,-d2/2,-2.5,2.5,h0+h1,h0+h1+T[2][2],12,BR);
  /* the two side stairs along the face, rising to meet it */
  for(const s of [-1,1]) K.flight('x',s*(w0/2-2),s*6,-d0/2-6,-d0/2,0,h0,30,BR);
  /* the gatehouse where the three meet */
  K.carve([-6,h0,-d0/2,6,h0+5.5,-d0/2+6],[[-2,h0,-d0/2-0.1,2,h0+4,-d0/2+6.1]],MB);
  /* the house of the moon on the top */
  const top=h0+h1+T[2][2];
  K.carve([-6,top,-4,6,top+5,4],[[-5,top,-3,5,top+4,3],[-1.2,top,-4.1,1.2,top+3,-2.9]],MB);
  box(-6.4,top+5,-4.4,6.4,top+5.6,4.4,BR);
};

/* ============================== ETEMENANKI ==============================
   Seven stages; the great stair runs out from the south face and climbs to the second. */
F.babylon=function(api){ const K=kit(api), box=K.box, BR='brick', MB='mudbrick', T=api.tm.tiers;
  K.level(-60,-60,60,105,'sand','sand');
  let y=0;
  for(let t=0;t<T.length;t++){ const [w,d,h]=T[t], last=t===T.length-1, m=last?'glazedBrick':BR;
    box(-w/2,t?y:y-3,-d/2,w/2,y+h,d/2,m,last?'glazedBrick':MB);
    if(h>=6) for(let x=-w/2+2.5;x<w/2-1.5;x+=5) for(const s of [-1,1]){ box(x-0.8,y,s*d/2-0.6,x+0.8,y+h-0.3,s*d/2+0.6,m); box(s*w/2-0.6,y,x-0.8,s*w/2+0.6,y+h-0.3,x+0.8,m); }
    y+=h; }
  const [w0,d0,h0]=T[0], [,d1,h1]=T[1];
  /* the great stair out from the south face, 9 m broad, to the top of the second stage */
  K.flight('z',d0/2+50,d0/2,-4.6,4.6,0,h0,60,BR);
  K.flight('z',d0/2,d1/2,-4.6,4.6,h0,h0+h1,24,BR);
  box(-5.4,-1,d0/2,-4.6,h0+1,d0/2+50,BR); box(4.6,-1,d0/2,5.4,h0+1,d0/2+50,BR);
  /* the side stairs along the south face to the first stage */
  for(const s of [-1,1]) K.flight('x',s*(w0/2-1),s*6,d0/2,d0/2+8,0,h0,48,BR);
  /* the doorway of the shrine on the top, facing the stair */
  const top=y-T[T.length-1][2]; box(-2.2,top,T[T.length-1][1]/2-0.2,2.2,top+6,T[T.length-1][1]/2+0.4,'goldLeaf');
};

/* ============================== THE PYRAMIDS OF GIZA AND THEIR TEMPLES ==============================
   Each pyramid footed on its own ground and cased in white limestone as it still was in those days; the
   mortuary temple on its east face, the causeway down to the valley temple; the queens' pyramids; the
   fields of mastaba tombs west and east of Khufu; the Sphinx at the foot of Khafre's causeway, 73 m long
   and 20 high, facing the sunrise, with its temple before it. */
F.giza=function(api){ const K=kit(api), box=K.box, LS='hewnStone', SS='sandstone', RG='redGranite', P=api.tm.parts;
  const pyr=(px,pz,base,h)=>{ const g=api.ground(px,pz), n=Math.max(4,Math.round(h/0.923)), hb=base/2;
    box(px-hb,g-6,pz-hb,px+hb,g,pz+hb,LS);
    for(let i=0;i<n;i++){ const w=hb*(1-i/n); if(w<0.46) break; box(px-w,g+h*i/n,pz-w,px+w,g+h*(i+1)/n,pz+w,LS); } return g; };
  /* a causeway: a walled and roofed way, following the ground, a box every four metres */
  const causeway=(x0,z0,x1,z1)=>{ const L=Math.hypot(x1-x0,z1-z0), n=Math.max(1,Math.round(L/4));
    for(let k=0;k<n;k++){ const a=k/n, b=(k+1)/n, ax=x0+(x1-x0)*a, az=z0+(z1-z0)*a, bx=x0+(x1-x0)*b, bz=z0+(z1-z0)*b, g=api.ground((ax+bx)/2,(az+bz)/2);
      const lx=Math.min(ax,bx)-(Math.abs(bz-az)>Math.abs(bx-ax)?3:0), hx=Math.max(ax,bx)+(Math.abs(bz-az)>Math.abs(bx-ax)?3:0);
      const lz=Math.min(az,bz)-(Math.abs(bx-ax)>=Math.abs(bz-az)?3:0), hz=Math.max(az,bz)+(Math.abs(bx-ax)>=Math.abs(bz-az)?3:0);
      box(lx,g-1,lz,hx,g+1,hz,LS); box(lx,g+5,lz,hx,g+5.8,hz,LS);
      if(Math.abs(bx-ax)>=Math.abs(bz-az)){ box(lx,g+1,lz,hx,g+5,lz+0.8,LS); box(lx,g+1,hz-0.8,hx,g+5,hz,LS); }
      else { box(lx,g+1,lz,lx+0.8,g+5,hz,LS); box(hx-0.8,g+1,lz,hx,g+5,hz,LS); } } };
  const temple=(x0,z0,x1,z1,h,g)=>K.carve([x0,g-1,z0,x1,g+h,z1],[[x0+4,g,z0+4,x1-4,g+h+0.1,z1-4],[x0-0.1,g,(z0+z1)/2-2,x0+4.1,g+5,(z0+z1)/2+2],[x1-4.1,g,(z0+z1)/2-2,x1+0.1,g+5,(z0+z1)/2+2]],LS);
  const T=[[40,52,600],[55,100,494],[30,40,600]];
  P.forEach((p,i)=>{ const px=p.dx, pz=p.dz, hb=p.base/2, g=pyr(px,pz,p.base,p.h), [tl,tw,cl]=T[i];
    /* the enclosure wall */
    const r=hb+11; box(px-r,g-1,pz-r,px+r,g+7,pz-r+2,LS); box(px-r,g-1,pz+r-2,px+r,g+7,pz+r,LS); box(px-r,g-1,pz-r,px-r+2,g+7,pz+r,LS); box(px+r-2,g-1,pz-r,px+r,g+7,pz-tw/2,LS); box(px+r-2,g-1,pz+tw/2,px+r,g+7,pz+r,LS);
    temple(px+hb,pz-tw/2,px+hb+tl,pz+tw/2,9,g);
    if(i!==1) causeway(px+hb+tl,pz,px+hb+tl+cl,pz+(i===0?60:0)); });
  /* the queens' pyramids */
  const K0=P[0], M0=P[2];
  for(let j=0;j<3;j++) pyr(K0.dx+K0.base/2+40,K0.dz-10+j*48,46,30);
  for(let j=0;j<3;j++) pyr(M0.dx-45+j*45,M0.dz+M0.base/2+40,j?31:44,j?21:28);
  /* the fields of the mastabas */
  for(let i=0;i<6;i++) for(let j=0;j<12;j++){ const x=K0.dx-K0.base/2-60-i*30, z=K0.dz-K0.base/2+10+j*19, g=api.ground(x,z); box(x-6,g-1,z-12,x+6,g+5.5,z+5,LS); }
  for(let i=0;i<3;i++) for(let j=0;j<6;j++){ const x=K0.dx+K0.base/2+95+i*30, z=K0.dz-K0.base/2+10+j*19, g=api.ground(x,z); box(x-6,g-1,z-12,x+6,g+5.5,z+5,LS); }
  /* the Sphinx, at the foot of Khafre's causeway, and its temples */
  const C1=P[1], sx=C1.dx+C1.base/2+380, sz=C1.dz+30, g=api.ground(sx,sz);
  causeway(C1.dx+C1.base/2+55,C1.dz,sx+30,sz+48);
  box(sx-42,g-2,sz-14,sx+40,g,sz+14,SS);                                                         /* the floor of its hollow */
  box(sx-36,g,sz-6.5,sx+18,g+11,sz+6.5,SS); box(sx-36,g,sz-7,sx-22,g+12.5,sz+7,SS);                 /* the body and the haunches */
  for(const s of [-1,1]) box(sx+14,g,sz+s*2.2,sx+37,g+3,sz+s*6.6,SS);                             /* the paws */
  box(sx+12,g,sz-5.6,sx+23,g+15,sz+5.6,SS);                                                       /* the breast */
  box(sx+13.5,g+15,sz-4.6,sx+23.5,g+20,sz+4.6,SS);                                                /* the head (the face kept plain) */
  for(const s of [-1,1]) box(sx+15,g+10.5,sz+s*4.6,sx+21,g+18.5,sz+s*6.2,SS);                     /* the lappets of the head-cloth */
  box(sx+14.5,g+20,sz-3.8,sx+22,g+20.8,sz+3.8,SS);
  temple(sx+40,sz-23,sx+86,sz+23,9,g);                                                            /* the Sphinx temple */
  K.carve([sx+25,g-1,sz+30,sx+70,g+13,sz+75],[[sx+29,g,sz+34,sx+66,g+12,sz+71],[sx+69.9,g,sz+50,sx+70.1,g+5,sz+55]],LS);   /* Khafre's valley temple */
  for(let i=0;i<5;i++) for(const z of [sz+44,sz+60]) box(sx+33+i*6.5-0.6,g,z-0.6,sx+33+i*6.5+0.6,g+12,z+0.6,RG);          /* its pillars of granite */
};

/* ============================== THE PHAROS OF ALEXANDRIA ==============================
   On its island in its walled court: a square stage 30 m broad and 56 high, an octagon of 18 m and 27
   high, a round lantern stage, the fire at the top some 100 m over the sea. */
F.pharos=function(api){ const K=kit(api), box=K.box, LS='hewnStone', MB='marble';
  K.level(-62,-62,62,62,'stone','stone');
  K.carve([-48,-2,-48,48,9,48],[[-43,0,-43,43,9.1,43],[-3,0,47,3,6,48.1]],LS);
  for(const sx of [-1,1]) for(const sz of [-1,1]) box(sx*48-6,-2,sz*48-6,sx*48+6,12,sz*48+6,LS);
  K.merlons('x',-48,48,-47.5,9,LS,2.4); K.merlons('x',-48,48,47.5,9,LS,2.4);
  for(let i=0;i<8;i++){ const w=15.25-i*0.18, y0=i?55.9*i/8:-2, y1=55.9*(i+1)/8; box(-w,y0,-w,w,y1,w,LS);
    if(i>0&&i<8) for(const t of [-8,0,8]) { box(-w-0.05,y0+3,t-0.6,-w+0.3,y0+5,t+0.6,'basalt'); box(w-0.3,y0+3,t-0.6,w+0.05,y0+5,t+0.6,'basalt'); box(t-0.6,y0+3,-w-0.05,t+0.6,y0+5,-w+0.3,'basalt'); box(t-0.6,y0+3,w-0.3,t+0.6,y0+5,w+0.05,'basalt'); } }
  box(-15.4,55.9,-15.4,15.4,57.2,15.4,LS); for(const sx of [-1,1]) for(const sz of [-1,1]) box(sx*14-1,57.2,sz*14-1,sx*14+1,60,sz*14+1,LS);
  K.flight('z',30,15.25,-3,3,0,9,14,LS);                                                               /* the ramp up to the door */
  K.round(0,0,57.2,84.6,9.15,LS); K.round(0,0,84.6,85.8,9.8,LS);
  K.round(0,0,85.8,93.2,4.2,LS); K.round(0,0,93.2,94,4.8,LS);
  for(let k=0;k<8;k++){ const a=k/8*Math.PI*2; K.round(Math.cos(a)*3.8,Math.sin(a)*3.8,94,100,0.35,MB); }
  K.round(0,0,100,101,4.6,LS); K.round(0,0,101,102.5,3,LS); K.round(0,0,102.5,103.5,1.6,LS);
  box(-1.4,94,-1.4,1.4,95.2,1.4,'bronze');                                                             /* the brazier of the fire */
};

/* ============================== STONEHENGE ==============================
   The ring of thirty sarsens with their lintels unbroken, the horseshoe of five great trilithons open to
   the midsummer sunrise, the bluestones in their ring and horseshoe, the altar stone, the bank and the
   ditch, the heel stone out on the avenue. */
F.stonehenge=function(api){ const K=kit(api), box=K.box, SA='stone', BL='deepStone', SS='sandstone';
  K.level(-62,-62,62,62,'grassTop','dirt');
  const stone=(x,z,a,w,t,y0,h,m)=>{ const c=Math.abs(Math.cos(a))>Math.abs(Math.sin(a)); /* tangential: broad across the radius */
    if(c) box(x-t/2,y0,z-w/2,x+t/2,y0+h,z+w/2,m); else box(x-w/2,y0,z-t/2,x+w/2,y0+h,z+t/2,m); };
  K.ovalRing(0,0,53,53,3,-0.5,1.2,'dirt',[[-0.87,0.09]],1.5);                                          /* the bank, open to the avenue */
  K.ovalRing(0,0,56.5,56.5,3,-1.6,-0.3,'dirt',[[-0.87,0.09]],1.5);
  const ax=-0.87;                                                                                     /* the axis, toward the midsummer sunrise */
  const P=[]; for(let i=0;i<30;i++){ const a=i/30*Math.PI*2+0.05; P.push([Math.cos(a)*15.6,Math.sin(a)*15.6,a]); }
  for(const [x,z,a] of P) stone(x,z,a,2.1,1.1,-1,5.1,SA);
  for(let i=0;i<30;i++){ const p=P[i], q=P[(i+1)%30]; K.wallLine([[p[0],p[1]],[q[0],q[1]]],4.1,4.9,1.0,SA); }
  /* the five trilithons */
  for(const [d,h] of [[0,7.3],[0.95,6.6],[-0.95,6.6],[1.75,6.0],[-1.75,6.0]]){ const a=ax+Math.PI+d, r=9.2, x=Math.cos(a)*r, z=Math.sin(a)*r;
    const tx=-Math.sin(a), tz=Math.cos(a);
    for(const s of [-1.3,1.3]) stone(x+tx*s,z+tz*s,a,2.2,1.2,-1,h+1,SA);
    K.wallLine([[x-tx*2.6,z-tz*2.6],[x+tx*2.6,z+tz*2.6]],h,h+1,1.1,SA); }
  for(let i=0;i<56;i++){ const a=i/56*Math.PI*2, x=Math.cos(a)*12, z=Math.sin(a)*12; if(i%3===2) continue; stone(x,z,a,1.0,0.6,-0.5,2.0,BL); }
  for(let i=0;i<19;i++){ const a=ax+Math.PI+(i/18-0.5)*3.8, x=Math.cos(a)*6.4, z=Math.sin(a)*6.4; stone(x,z,a,0.8,0.6,-0.5,2.3,BL); }
  { const a=ax+Math.PI, x=Math.cos(a)*4.6, z=Math.sin(a)*4.6; box(x-2.4,-0.3,z-0.6,x+2.4,0.45,z+0.6,SS); }   /* the altar stone */
  box(Math.cos(ax)*77-1.2,-0.5,Math.sin(ax)*77-1,Math.cos(ax)*77+1.2,4.7,Math.sin(ax)*77+1,SA);       /* the heel stone */
  for(let k=0;k<30;k++){ const r=58+k*4; for(const s of [-1,1]){ const x=Math.cos(ax)*r-Math.sin(ax)*11*s, z=Math.sin(ax)*r+Math.cos(ax)*11*s; box(x-2,-0.5,z-2,x+2,0.8,z+2,'dirt'); } }
};

/* ============================== GÖBEKLI TEPE ==============================
   On its hill: round enclosures of drystone with T-shaped pillars set in their walls facing in, and in
   the midst of each two great pillars of 5.5 m. */
F.gobekli=function(api){ const K=kit(api), box=K.box, LS='hewnStone', W='cobble';
  K.oval(0,0,150,150,-3,6,'dirt','grassTop',4); K.oval(0,0,90,90,6,12,'dirt','grassTop',4);
  const tp=(x,z,h,ax,y0)=>{ if(ax==='x'){ box(x-0.8,y0,z-0.28,x+0.8,y0+h-1.2,z+0.28,LS); box(x-1.5,y0+h-1.2,z-0.3,x+1.5,y0+h,z+0.3,LS); }
      else { box(x-0.28,y0,z-0.8,x+0.28,y0+h-1.2,z+0.8,LS); box(x-0.3,y0+h-1.2,z-1.5,x+0.3,y0+h,z+1.5,LS); } };
  for(const [cx,cz,r,n] of [[0,0,10,11],[-18,-20,13,12],[2,-30,7,7],[-30,-2,7,8]]){
    box(cx-r-1,9,cz-r-1,cx+r+1,12.1,cz+r+1,'path');
    K.ovalRing(cx,cz,r+1.2,r+1.2,1.4,9,12,W,[[0.6,0.12]],1);
    for(let i=0;i<n;i++){ const a=i/n*Math.PI*2+0.3, x=cx+Math.cos(a)*(r-0.5), z=cz+Math.sin(a)*(r-0.5);
      tp(x,z,3.6,Math.abs(Math.cos(a))>Math.abs(Math.sin(a))?'z':'x',9); }
    tp(cx-1.8,cz,r>9?5.5:4.2,'z',9); tp(cx+1.8,cz,r>9?5.5:4.2,'z',9); }
  box(-60,-1,-60,60,12,60,'dirt','grassTop');
  for(const [cx,cz,r] of [[0,0,11.5],[-18,-20,14.5],[2,-30,8.5],[-30,-2,8.5]]) K.oval(cx,cz,r,r,9,12.05,'path',null,1);
};

/* ============================== THE LION GATE OF MYCENAE ==============================
   The citadel on its hill inside walls of cyclopean blocks; the Lion Gate in the north-west, its lintel
   and the relieving triangle with the two lions over it, the bastion that makes its approach a trap;
   the grave circle within; the palace's hall with its hearth and four columns on the summit. */
F.mycenae=function(api){ const K=kit(api), box=K.box, CY='stone', LS='hewnStone';
  const wall=[[-14,-8],[-60,-20],[-110,10],[-130,60],[-90,110],[-20,120],[60,95],[110,40],[95,-10],[40,-25],[8,-10]];
  K.wallLine(wall,-2,8,6,CY,true);
  K.wallLine([[-14,-8],[-14,-26]],-2,9,5,CY,true);                                                     /* the bastion */
  const g=api.ground(-2,-9);
  for(const s of [-1,1]) box(-2+s*1.55,g-1,-12,-2+s*4.5,g+8,-6,CY);
  box(-2-1.55,g-0.4,-12,-2+1.55,g+0.1,-6,LS);
  box(-4.25,g+2.95,-11.2,0.25,g+3.95,-6.8,LS);                                                          /* the lintel */
  for(let i=0;i<4;i++){ const w=1.6*(1-i/4); box(-2-w,g+3.95+i*0.82,-11.2,-2+w,g+4.77+i*0.82,-10.6,LS); }   /* the relief of the lions in its triangle */
  box(-2-1.6,g+3.95,-10.6,-2+1.6,g+7.2,-6.8,CY);
  { const gc=api.ground(-25,15); K.ovalRing(-25,15,13.75,13.75,1.2,gc-0.5,gc+1.2,LS,[[-1.6,0.15]],0.8); }   /* grave circle A */
  const top=api.ground(20,55);
  K.carve([5,top-1,47,30,top+6,63],[[7,top,49,28,top+6.1,61],[29.9,top,53,30.1,top+3.5,57],[18,top,49.5,18.6,top+5,60.5]],LS);
  K.round(12,55,top,top+0.5,2.0,'brick'); for(const [x,z] of [[9.5,52.5],[14.5,52.5],[9.5,57.5],[14.5,57.5]]) K.round(x,z,top,top+5,0.35,'brick');
  for(let k=0;k<26;k++){ const x=-90+hsh(k,3)*170, z=0+hsh(3,k)*105; const gg=api.ground(x,z); box(x-3,gg-1,z-3,x+3,gg+3.4,z+3,CY); }
};
const hsh=(i,j)=>{ const v=Math.sin(i*12.9898+j*78.233)*43758.5453; return v-Math.floor(v); };

/* ============================== THE LION GATE OF HATTUSA ==============================
   The upper city's wall on its rampart, faced with a stone glacis, towers every thirty metres; the gate
   between its two towers, the passage closed by a pointed arch of corbelled stones, the lions' foreparts
   carved from the outer jambs. */
F.hattusa=function(api){ const K=kit(api), box=K.box, CY='stone', MB='mudbrick', D='dirt';
  for(let x=-150;x<150;x+=4){ const g=api.ground(x+2,0);
    for(let i=0;i<5;i++) box(x,g-1,-8+i*2,x+4,g+2+i*2,-6+i*2,i<4?'cobble':D);
    box(x,g+10,-1,x+4,g+18,4,MB); box(x,g-1,-1,x+4,g+10,4,D);
    if(((x+150)/4)%8===0&&Math.abs(x)>14) box(x-3,g+10,-3,x+7,g+21,6,MB); }
  const g=api.ground(0,0);
  for(const s of [-1,1]) box(s*1.65,g-1,-6,s*9,g+21,8,CY);
  for(let i=0;i<6;i++){ const w=1.65-(i<3?0:(i-2)*0.32); if(w>1.6) continue; box(-1.65,g+3.2+i*0.7,-6,-w,g+3.9+i*0.7,8,CY); box(w,g+3.2+i*0.7,-6,1.65,g+3.9+i*0.7,8,CY); }
  box(-1.65,g+7.4,-6,1.65,g+21,8,CY);
  for(const s of [-1,1]){ box(s*1.65-0.6,g,-7.6,s*1.65+0.6,g+2.2,-6,CY); box(s*1.65-0.55,g+2.2,-7.4,s*1.65+0.55,g+3.0,-6,CY); }  /* the lions' foreparts */
  box(-1.65,g-0.4,-6,1.65,g+0.1,8,'path');
};

/* ============================== THE GATES OF NINEWĔH ==============================
   The great wall of mud brick on its stone footing and facing, fifteen metres thick and twenty high,
   the moat before it; the gate of Nergal between its towers, two pairs of winged bulls in its passage. */
F.nineveh=function(api){ const K=kit(api), box=K.box, MB='mudbrick', LS='hewnStone', GS='greyStone';
  K.level(-60,-60,60,60,'sand','sand');
  for(let x=-250;x<250;x+=5){ if(Math.abs(x)<12) continue; const g=api.ground(x+2.5,0);
    box(x,g-2,-7.5,x+5,g+4,7.5,LS); box(x,g+4,-7.5,x+5,g+20,7.5,MB);
    if(((x+250)/5)%2===0) box(x+1,g+20,-7.5,x+3.5,g+21.8,-6.5,MB);
    if(((x+250)/5)%7===0) box(x-2,g-2,-11,x+7,g+24,7.5,MB);
    box(x,g-3,-30,x+5,g-0.4,-20,'waterB'); }
  for(const s of [-1,1]){ box(s*4.6,-2,-12,s*20,24,10,MB); box(s*4.6,-2,-12,s*20,4,10,LS); }
  box(-4.6,10,-12,4.6,24,10,MB); box(-4.6,-0.4,-12,4.6,0.1,10,'path');
  /* the winged bulls, their faces kept plain */
  const bull=(x,z,f)=>{ box(x-0.8,0,z-2.8,x+0.8,1.2,z+2.8,GS); for(const a of [-2.0,1.6]) box(x-0.7,1.2,z+a*f-0.45,x+0.7,3.0,z+a*f+0.45,GS);
    box(x-0.85,3.0,z-2.6,x+0.85,5.0,z+2.6,GS); box(x-0.95,4.4,z-1.8,x+0.95,6.4,z+1.2,GS); box(x-0.7,4.8,z+f*2.2-0.7,x+0.7,6.6,z+f*2.2+0.7,GS); box(x-0.6,6.6,z+f*2.2-0.6,x+0.6,7.8,z+f*2.2+0.6,GS); };
  for(const s of [-1,1]){ bull(s*3.7,-8,-1); bull(s*3.7,6,1); }
};
})();
