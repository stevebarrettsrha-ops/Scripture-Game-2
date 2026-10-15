/* ================= THE STAGE =================
   The voyage needs a world that already stands. The scrolls need a world that
   is BEING MADE — dark and formless, then lit, then vaulted, then dry.

   So this is a dressing layer laid over the shared engine. It holds a track
   of keyframes, eases between them, and writes its values into the world at
   the very END of every frame (window.__STAGE_TICK, called by the engine
   after the sky, the sea and every tick have had their say). Whatever the
   stage sets therefore STAYS set, and nothing in the engine had to be
   rewritten to allow it.

   THE DIALS, and what each does to the world:
     dark    0..1  the sky and the haze go to black — the face of the deep
     light   0..1  illumination WITHOUT a source: the light of the first day,
                   which was made three days before the sun was
     sky     hex   the colour of the firmament overhead
     sun     0..1  the greater light — its body, its halo, its glare
     moon    0..1  the lesser light
     stars   0..1  the host of the shamayim
     firm    0..1  the expanse itself, drawn as the vault
     land    0..1  THE DRY LAND APPEARING. The ground is sunk far beneath the
                   waters at 0 and stands at its true height at 1, so the
                   earth is seen to RISE out of the sea rather than blink on
     sea     0..1  the waters
     clouds  0..1  the waters above
     lifeSea 0..1  the shoals, the great sea creatures and the reef — FIFTH day
     lifeAir 0..1  every winged bird                              — FIFTH day
     lifeLand 0..1 livestock, creeping things, the beasts of the earth — SIXTH
     ship    0..1  the great ship. There is no ship in the creation of the
                   world, so a scene has none unless it asks for one
     man     0..1  and no man either, until the sixth day — stood on the ground before the
                   eye at the anchor: the traveller's own figure rides with the ship, and
                   with no ship in the world he was never seen at all
     beasts  0..1  THE MAKING OF THEM, SEEN: the world's own creatures keep far off from the
     birds   0..1  traveller (a kilometre and more), so a scene that tells of their making
                   asks for them here — cattle, creeping things and the beasts of the earth
                   stood about the anchor, and birds wheeling over it
     traders 0..1  the merchantmen of a later age, which a scene has none of unless it asks
     bush    0..1  THE THINGS THE VERSES NAME, which the world has none of (see `makers`): the
     waters  0..1  bush (at a half a bush and no more; above it, burning by the dial), the sea
     ark     0..1  stood up in two walls with dry ground between (as high as the dial), the ark,
     cave    0..1  the cave in a rock, the garden planted (its trees growing by the dial) and
     garden  0..1  the river that went out of it (filling its bed by the dial)
     river   0..1
     far     0..1  THE COARSE CARPET, and a scene must ASK for it — see below
     hour    0..24 THE HOUR OF THE DAY at the place the scene is staged, and
                   the one dial here that reaches past the dressing into the
                   world's own clock. Every dial above this line changes what
                   the SKY looks like; the ground is lit by the engine's day
                   tint, which knows nothing of any of them — so a film could
                   put a noon sky over a world still shaded for dusk, and did.
                   Absent, the clock is left exactly as it was found.
     fogN/fogF     how far the eye reaches

   THE EYE, on the same track:
     cd  how far the eye stands from the anchor
     cy  how high above the ground at the anchor (above the water while the land is sunk)
     ca  swung round the anchor, in turns (0..1 is the whole circle)
     cl  how high it looks, from the same ground
     cfov the lens
   Everything between two keys is eased, so nothing ever snaps — unless the
   key says cut:true, and then it simply IS there.                          */
window.STAGE=(function(){
  const W=window.__WORLD;
  const T=window.__WORLD.THREE;
  let track=null, t=0, playing=false, anchor={x:0,z:0}, onDone=null;
  let held=null;          /* what the world looked like before we borrowed it */

  const DEFAULT={ dark:0, light:1, sky:null, sun:1, moon:1, stars:1, firm:0,
    land:1, sea:1, clouds:1, lifeSea:1, lifeAir:1, lifeLand:1, ship:0, man:0, beasts:0, birds:0,
    traders:0, bush:0, waters:0, ark:0, cave:0, garden:0, river:0,
    far:0, hour:null, fogN:null, fogF:null,
    cd:120, cy:40, ca:0, cl:10, cfov:62, cut:false };

  function lerp(a,b,u){ return a+(b-a)*u; }
  function smooth(u){ return u*u*(3-2*u); }

  /* ---- A COLOUR IS THREE NUMBERS, NOT ONE ----
     `sky` is the one dial on this track that is a colour, and it was eased
     the way every other dial is eased: straight down the middle between two
     JavaScript numbers. But 0x332c26 IS the number 3,353,638, and halfway
     between it and 0x241f1c is 2,860,705 — which unpacks to 0x2BA5E1, a
     bright blue. The going out ran from one brown to another brown through
     a GREEN SKY, and the creation had been sliding through hues neither of
     its keys named since the day it was written; it was never caught because
     most of that film eases out of black, where the error is small.

     The channels are taken apart and eased one at a time. Every scene on the
     shelf is corrected by this and not one of them had to be touched. */
  const HEX={sky:1};
  function lerpHex(a,b,u){
    const r=Math.round(lerp((a>>16)&255,(b>>16)&255,u));
    const g=Math.round(lerp((a>>8)&255,(b>>8)&255,u));
    const l=Math.round(lerp(a&255,b&255,u));
    return (r<<16)|(g<<8)|l;
  }

  /* the value of one dial at time tt, read off the track */
  function at(tt){
    const out=Object.assign({},DEFAULT);
    if(!track||!track.length) return out;
    let i=0; while(i<track.length-1&&track[i+1].t<=tt) i++;
    const A=track[i], B=track[Math.min(i+1,track.length-1)];
    /* carry forward every dial the later keys do not mention: a track says
       only what CHANGES, exactly as the shot lists do */
    const merged=Object.assign({},DEFAULT);
    for(let k=0;k<=i;k++) Object.assign(merged,track[k]);
    if(A===B){ Object.assign(out,merged); return out; }
    const span=Math.max(1e-6,B.t-A.t);
    const u=B.cut?0:smooth(Math.max(0,Math.min(1,(tt-A.t)/span)));
    Object.assign(out,merged);
    /* and eased toward whatever the NEXT key names */
    for(const k in B){ if(k==='t'||k==='cut') continue;
      const a=merged[k], b=B[k];
      if(typeof a==='number'&&typeof b==='number')
        out[k]=HEX[k]?lerpHex(a,b,u):lerp(a,b,u);
      else if(u>0.5||B.cut) out[k]=b; }
    return out;
  }

  function play(tr,anch,done){
    track=tr.slice().sort((a,b)=>a.t-b.t); t=0; playing=true;
    anchor=anch||{x:0,z:0}; onDone=done||null;
    if(!held) hold();
    return dur();
  }
  function dur(){ return track&&track.length?track[track.length-1].t:0; }
  function elapsed(){ return t; }
  function seek(x){ t=Math.max(0,Math.min(dur(),x)); }
  function stop(){ playing=false; track=null; give(); }

  /* the world is BORROWED, and given back exactly as it was found */
  function hold(){
    held={ chunkY:W.chunkRoot.position.y, fov:W.camera.fov,
      ship:W.boatG.visible, man:W.walkerG.visible,
      fogN:W.scene.fog?W.scene.fog.near:null, fogF:W.scene.fog?W.scene.fog.far:null,
      voidWall:W.voidWall.visible, cloudOp:W.cloudMat.opacity,
      cloudCol:W.cloudMat.color.getHex(),
      farVis:W.farLand?W.farLand.visible:false,
      farOp:W.farLandMat?W.farLandMat.opacity:0,
      /* the world's own clock, which a scene may move and must not keep */
      simHours:W.state.simHours, dayIdx:W.state.dayIdx };
  }
  function give(){
    if(!held) return;
    W.chunkRoot.position.y=held.chunkY;
    W.camera.fov=held.fov; W.camera.updateProjectionMatrix();
    if(W.scene.fog){ W.scene.fog.near=held.fogN; W.scene.fog.far=held.fogF; }
    W.voidWall.visible=held.voidWall;
    W.cloudMat.opacity=held.cloudOp; W.cloudMat.color.setHex(held.cloudCol);
    W.boatG.visible=held.ship; W.walkerG.visible=held.man;
    if(held.manAt){ const m=held.manAt; if(m.parent) m.parent.add(W.walkerG); W.walkerG.position.copy(m.pos); W.walkerG.rotation.y=m.rot; }
    makers.drop();
    if(W.farLand) W.farLand.visible=held.farVis;
    if(W.farLandMat) W.farLandMat.opacity=held.farOp;
    W.state.simHours=held.simHours; W.state.dayIdx=held.dayIdx;
    W.chunkRoot.visible=true;
    held=null;
  }

  const _c=new T.Color();
  /* the ground's top at a place of the world */
  function groundY(x,z){ const c=W.landAtWorld(x,z); return c?c.h*W.B:W.WATER_Y; }
  /* the same, eased between the middles of the blocks, so an eye kept off it does not jump a
     block's height each time it passes over the edge of one */
  function groundAt(x,z){ const B=W.B, fx=x/B-0.5, fz=z/B-0.5, i=Math.floor(fx), k=Math.floor(fz), u=fx-i, v=fz-k;
    const g=(a,b)=>groundY((a+0.5)*B,(b+0.5)*B);
    return (g(i,k)*(1-u)+g(i+1,k)*u)*(1-v)+(g(i,k+1)*(1-u)+g(i+1,k+1)*u)*v; }
  /* THE MAN, stood on the ground a few steps before the anchor, turned to the eye */
  function standMan(){
    if(!held.manAt) held.manAt={parent:W.walkerG.parent,pos:W.walkerG.position.clone(),rot:W.walkerG.rotation.y};
    if(W.walkerG.parent!==W.scene) W.scene.add(W.walkerG);
    const cx=W.camera.position.x, cz=W.camera.position.z, dx=cx-anchor.x, dz=cz-anchor.z, L=Math.hypot(dx,dz)||1;
    const x=anchor.x+dx/L*8, z=anchor.z+dz/L*8;
    W.walkerG.position.set(x,groundY(x,z),z); W.walkerG.rotation.y=Math.atan2(cx-x,cz-z);
  }
  /* THE CREATURES OF THE FIFTH AND SIXTH DAYS, made where they are seen */
  const makers=(function(){
    const K=()=>window.__KIT; let land=null, air=null, t0=performance.now();
    const LAND=['lion','gazelle','gazelle','deer','cow','cow','goat','goat','ox','wildass','camel','lizard','lizard'];
    const AIR=['dove','dove','gull','gull','eagle','dove','crow'];
    function spawnLand(){ land=[]; const k=K(), make=k&&(k.makeAnimal||k.makeBeast); if(!make) return;   /* (makeAnimal: every land beast, at its true size) */
      LAND.forEach((kind,i)=>{ let m=null; try{ m=make(kind); }catch(e){} if(!m) return;
        const a=i/LAND.length*Math.PI*2+0.4, r=26+((i*37)%5)*9, x=anchor.x+Math.cos(a)*r, z=anchor.z+Math.sin(a)*r;
        m.position.set(x,groundY(x,z),z); m.rotation.y=a+Math.PI*(0.3+((i*13)%7)/10); W.scene.add(m); land.push({m,kind,ent:{m}}); }); }
    function spawnAir(){ air=[]; const k=K(); if(!k||!k.makeBird) return;
      AIR.forEach((kind,i)=>{ let m=null; try{ m=k.makeBird(kind); }catch(e){} if(!m) return;
        W.scene.add(m); air.push({m,a:i*0.9,r:50+i*11,h:40+((i*7)%4)*12,sp:0.25+(i%3)*0.08}); }); }
    function drop(){ for(const L of [land,air]) if(L) for(const b of L) if(b.m.parent) b.m.parent.remove(b.m); land=null; air=null; dropProps(); }
    function tick(d){ const now=performance.now(), dt=Math.min(0.1,(now-t0)/1000); t0=now;
      if(d.beasts>0.5&&!land) spawnLand(); else if(d.beasts<=0.5&&land){ for(const b of land) W.scene.remove(b.m); land=null; }
      if(d.birds>0.5&&!air) spawnAir(); else if(d.birds<=0.5&&air){ for(const b of air) W.scene.remove(b.m); air=null; }
      if(land&&K().tickGait) for(const b of land){ try{ K().tickGait(b.ent,b.kind,0,dt); }catch(e){} }
      if(air) for(const b of air){ b.a+=dt*b.sp; const x=anchor.x+Math.cos(b.a)*b.r, z=anchor.z+Math.sin(b.a)*b.r;
        b.m.position.set(x,groundY(anchor.x,anchor.z)+b.h,z); b.m.rotation.y=-b.a; }
      tickProps(d); }

    /* ---- AND THE THINGS THE VERSES NAME ----
       The world has no bush that burns and is not consumed, no sea stood up in two walls, no ark, no
       cave in a rock and no garden planted, and the films said as much in their headers and showed
       an empty shore while the verse was read. Each is a dial here, as the beasts are: raised when
       its dial comes up off nothing, taken down when it goes back to nothing, and every one taken out
       of the world when the world is given back, so that not one is left standing in it after a film.
       They are set by the ANCHOR and the EYE, never at a place in the world's own numbers, because the
       shore a film is staged on is found when it is played; and by the eye as it stood when the dial
       came up, read back off the track, so a film sought into its middle builds them where playing it
       through would have. All are made to the measure of the man and the beasts. */
    const MAKE={}, EASE={}, up={}, M=()=>W.U_PER_M||6;
    function tickProps(d){
      for(const k in MAKE){ const v=+d[k]||0;
        if(v>0.004&&!up[k]){ const g=new T.Group(); MAKE[k](g); W.scene.add(g); up[k]=g; }
        else if(v<=0.004&&up[k]) putAway(k);
        if(up[k]&&EASE[k]) EASE[k](up[k],v); } }
    function putAway(k){ const g=up[k]; delete up[k]; if(g.parent) g.parent.remove(g);
      g.traverse(o=>{ if(o.geometry&&!o.isSprite) o.geometry.dispose(); });
      /* the lamp put out exactly as the torch's own tick puts it out */
      if(g.userData.lit&&K()&&K().lamp) K().lamp(0,-1e7,0,0); }
    function dropProps(){ for(const k in up) putAway(k); }
    let MT=null;
    function mats(){ if(MT) return MT;
      const L=(c,o)=>new T.MeshLambertMaterial(Object.assign({color:c},o||{}));
      const cv=document.createElement('canvas'); cv.width=cv.height=64;
      const c2=cv.getContext('2d'), gr=c2.createRadialGradient(32,32,0,32,32,32);
      gr.addColorStop(0,'rgba(255,240,200,1)'); gr.addColorStop(0.3,'rgba(255,190,90,0.7)'); gr.addColorStop(1,'rgba(255,140,40,0)');
      c2.fillStyle=gr; c2.fillRect(0,0,64,64);
      MT={ stem:L(0x5b4630), leaf:L(0x55702f), leaf2:L(0x41602a), fruit:L(0xb8432e), gold:L(0xd9a63a),
        flame:new T.MeshBasicMaterial({color:0xffa640,transparent:true,opacity:0.85,blending:T.AdditiveBlending,depthWrite:false}),
        glow:new T.SpriteMaterial({map:new T.CanvasTexture(cv),color:0xffc070,transparent:true,depthWrite:false,blending:T.AdditiveBlending}),
        rock:L(0x8a8174), rock2:L(0x6f675c), mouth:new T.MeshBasicMaterial({color:0x090706}), sand:L(0x9d8a66),
        wall:L(0x2d7290,{transparent:true,opacity:0.6,emissive:0x0b2a36}), crest:L(0xd6e8ee,{transparent:true,opacity:0.75}),
        river:L(0x3a7f9a,{emissive:0x0a2430}),
        pitch:L(0x241c15), gopher:L(0x7b5634), strake:L(0x553a22), dark:new T.MeshBasicMaterial({color:0x0d0a08}) };
      return MT; }
    /* a block of the thing, its foot at y, in the group's own frame */
    function blk(g,w,h,dp,x,y,z,m){ const b=new T.Mesh(new T.BoxGeometry(w,h,dp),m); b.position.set(x,y+h/2,z); g.add(b); return b; }
    /* many blocks of one stuff in ONE drawing (a garden is some hundreds of them): each is
       {bx,by,bz} the foot of what it belongs to, {x,y,z} its own foot from there, {w,h,d}, `ry` its
       turn — and is drawn grown `s` of the way out of that foot (a fruit, `ripe`, only at the last) */
    const _m4=new T.Matrix4(), _q=new T.Quaternion(), _p=new T.Vector3(), _s=new T.Vector3(), _Y=new T.Vector3(0,1,0);
    function many(g,list,m){ const im=new T.InstancedMesh(new T.BoxGeometry(1,1,1),m,Math.max(1,list.length));
      im.count=list.length; im.frustumCulled=false; im.userData.list=list; place(im,null); g.add(im); return im; }
    function place(im,sf){ const L=im.userData.list;
      for(let i=0;i<L.length;i++){ const b=L[i], s=sf?sf(b):1, z=Math.max(0.001,b.ripe?(s-0.7)/0.3:s);
        _p.set(b.bx+b.x*s,b.by+(b.y+b.h/2)*s,b.bz+b.z*s); _s.set(b.w*z,b.h*z,b.d*z); _q.setFromAxisAngle(_Y,b.ry||0);
        im.setMatrixAt(i,_m4.compose(_p,_q,_s)); }
      im.instanceMatrix.needsUpdate=true; }
    const dry=(x,z)=>!!W.landAtWorld(x,z);
    /* is the ground dry under the whole of a footprint (L along u, Wd across it), and how high it lies */
    function under(cx,cz,ux,uz,L,Wd){ let ok=true, lo=1e9, hi=-1e9;
      for(let i=-2;i<=2;i++) for(let j=-1;j<=1;j++){ const x=cx+ux*L*i/4+uz*Wd*j/2, z=cz+uz*L*i/4-ux*Wd*j/2;
        if(!dry(x,z)) ok=false; const g=groundY(x,z); if(g<lo) lo=g; if(g>hi) hi=g; }
      return {ok,lo,hi}; }
    /* the eye as it stood when this dial came up off nothing: (fx,fz) the way to it from the anchor */
    function eyeAt(k){ let s=Math.min(t,dur()); while(s>0&&at(s-0.25)[k]>0.004) s-=0.25;
      const d0=at(Math.max(0,s)), a=d0.ca*Math.PI*2, fx=Math.sin(a), fz=Math.cos(a);
      return {fx,fz,x:anchor.x+fx*d0.cd,z:anchor.z+fz*d0.cd}; }
    /* the way down to the sea from the anchor — the bearings nearest (px,pz) tried first, or every
       bearing alike with `all` — and how far off its edge lies, where the water goes on open beyond
       it; null with no such water within a kilometre and more */
    function seaward(px,pz,all){ const b0=Math.atan2(px,pz);
      for(const span of all?[Math.PI]:[Math.PI/3,Math.PI]){ let best=null;
        for(let j=0;j<=48;j++){ const b=b0+(j&1?1:-1)*Math.ceil(j/2)/24*span, ux=Math.sin(b), uz=Math.cos(b); let r0=-1;
          for(let r=0;r<=1400;r+=12) if(!dry(anchor.x+ux*r,anchor.z+uz*r)){ r0=r; break; }
          if(r0<0) continue;
          /* the edge found to within a unit, or a dozen bearings tie and the nearest is not the one taken */
          for(let lo=r0-12,i=0;i<4&&r0>0;i++){ const h=(lo+r0)/2; if(dry(anchor.x+ux*h,anchor.z+uz*h)) lo=h; else r0=h; }
          if(best&&r0>=best.r0) continue;
          let open=true; for(let r=r0+40;r<=r0+280;r+=40) if(dry(anchor.x+ux*r,anchor.z+uz*r)) open=false;
          if(open) best={ux,uz,r0}; }
        if(best) return best; }
      return null; }
    /* the first of these stations ([across the eye's line, toward the eye]) with dry ground under the
       whole footprint — or, asked for `high`, the one of them standing highest */
    function station(e,list,L,Wd,high){ let pick=null;
      const at2=(l,s)=>[anchor.x+e.fz*l+e.fx*s,anchor.z-e.fx*l+e.fz*s];
      for(const [l,s] of list){ const [x,z]=at2(l,s), f=under(x,z,e.fx,e.fz,L,Wd);
        if(f.ok&&(!pick||(high&&f.lo>pick.f.lo))){ pick={x,z,f}; if(!high) break; } }
      if(pick) return pick;
      const [x,z]=at2(list[0][0],list[0][1]); return {x,z,f:under(x,z,e.fx,e.fz,L,Wd)}; }

    /* THE BUSH (Shemoth 3:2): a thorn-bush of the wilderness, of blocks, about a man's height, a few
       steps to one side of the anchor. At a half on its dial a bush and no more; above that a fire in
       the midst of it by the dial — tongues of flame, a glow, and the world's own lamp lit there to
       throw it on the ground — and not one leaf of it burned, for the bush was not consumed. */
    MAKE.bush=g=>{ const m=M(), mt=mats(), e=eyeAt('bush'), st=station(e,[[16,-4],[-16,-4],[26,-8],[-26,-8]],2.6*m,2.6*m);
      g.position.set(st.x,groundY(st.x,st.z),st.z);
      for(let i=0;i<3;i++) blk(g,0.16*m,0.7*m,0.16*m,(i-1)*0.4*m,0,((i*2)%3-1)*0.25*m,mt.stem);
      for(let i=0;i<16;i++){ const a=i*2.4, r=(0.15+0.8*((i*7)%16)/16)*m, y=(0.25+0.85*((i*11)%16)/16)*m*(1-r/(2.4*m));
        blk(g,0.5*m,0.45*m,0.5*m,Math.cos(a)*r,y,Math.sin(a)*r,i%3?mt.leaf:mt.leaf2); }
      g.userData.tongues=[];
      for(let i=0;i<6;i++){ const a=i*1.9+0.5, r=(i%3)*0.22*m, f=new T.Mesh(new T.BoxGeometry(0.22*m,1,0.22*m).translate(0,0.5,0),mt.flame);
        f.position.set(Math.cos(a)*r,(0.35+(i%2)*0.3)*m,Math.sin(a)*r); g.add(f); g.userData.tongues.push(f); }
      const sp=new T.Sprite(mt.glow); sp.position.y=m; sp.scale.set(3.6*m,3.6*m,1); g.add(sp); g.userData.glow=sp; };
    EASE.bush=(g,v)=>{ const f=Math.max(0,Math.min(1,(v-0.5)*2)), s=performance.now()/1000, m=M(), on=f>0.01;
      g.userData.tongues.forEach((q,i)=>{ q.visible=on; q.scale.y=Math.max(0.01,f*(0.9+0.45*Math.sin(s*(8+i*1.7)+i*2.1))*m); });
      g.userData.glow.visible=on; mats().glow.opacity=f*(0.8+0.2*Math.sin(s*11.3)*Math.sin(s*4.7));
      if(on&&K()&&K().lamp){ K().lamp(g.position.x,g.position.y+m,g.position.z,0.6*f*(0.86+0.14*Math.sin(s*11.3))); g.userData.lit=true; } };

    /* THE SEA GONE BACK (Shemoth 14:21-22): from the water's edge straight out to sea, a lane of dry
       ground, and the waters a wall on the right hand and on the left — stood up as the dial comes up,
       and let fall as it goes down again, when the sea returned to its usual flow (14:27-28). The
       floor of the lane is laid just over the face of the sea, so the sea is not seen across it. */
    MAKE.waters=g=>{ const m=M(), mt=mats(), e=eyeAt('waters'), sw=seaward(-e.fx,-e.fz)||{ux:-e.fx,uz:-e.fz,r0:0};
      const lane=30*m, wt=20*m, Lz=1100, unit=()=>new T.BoxGeometry(1,1,1).translate(0,0.5,0);
      g.position.set(anchor.x+sw.ux*sw.r0,0,anchor.z+sw.uz*sw.r0); g.rotation.y=Math.atan2(sw.ux,sw.uz);
      const fl=new T.Mesh(unit(),mt.sand); fl.scale.set(lane,40,Lz+40); fl.position.z=Lz/2-20; g.add(fl);
      Object.assign(g.userData,{floor:fl,walls:[],crests:[],wt,Lz});
      for(const sd of [-1,1]){ const w=new T.Mesh(unit(),mt.wall), c=new T.Mesh(unit(),mt.crest);
        w.position.set(sd*(lane+wt)/2,W.WATER_Y-40,Lz/2); c.position.set(w.position.x,0,Lz/2); c.scale.set(wt,0.6*m,Lz);
        g.add(w); g.add(c); g.userData.walls.push(w); g.userData.crests.push(c); } };
    EASE.waters=(g,v)=>{ const u=g.userData, H=22*M()*v;
      u.floor.position.y=W.WATER_Y-44+8.5*Math.min(1,v*3);          /* (over the crest of a calm sea's tallest wave) */
      for(const w of u.walls){ w.scale.set(u.wt,40+H,u.Lz); w.visible=v>0.02; }
      for(const c of u.crests){ c.position.y=W.WATER_Y+H; c.visible=v>0.05; } };

    /* THE ARK (Bereshith 6:14-16; Yashar 6:1): gopher wood pitched within and without, three hundred
       cubits long, fifty broad and thirty high — 157 by 26 by 16 metres at a cubit of 0.523 — with its
       three decks, the opening of a cubit under the roof, and the door set in its side, on the side
       the eye is. It is laid along the shore on the first dry ground inland of the anchor that will
       hold the whole of it, and it wants a wide shot: the eye three quarters of a kilometre off, not
       the hundred metres a man is framed in. */
    MAKE.ark=g=>{ const m=M(), mt=mats(), cub=0.523*m, L=300*cub, Wd=50*cub, H=30*cub, e=eyeAt('ark');
      const sw=seaward(-e.fx,-e.fz,true)||{ux:-e.fx,uz:-e.fz}, ax=sw.uz, az=-sw.ux;      /* the keel, along the shore */
      let c=null;
      for(const sd of [40,90,140,200,260,330,400,480]){ const x=anchor.x-sw.ux*sd, z=anchor.z-sw.uz*sd, f=under(x,z,ax,az,L,Wd);
        if(!c||f.ok){ c={x,z,f}; if(f.ok) break; } }
      const base=c.f.hi; g.position.set(c.x,base,c.z); g.rotation.y=Math.atan2(ax,az);
      if(base-c.f.lo>0.3) blk(g,Wd*0.7,base-c.f.lo+m,L*0.92,0,c.f.lo-m-base,0,mt.strake);   /* her stocks, where the ground falls away */
      blk(g,Wd,H*0.42,L,0,0,0,mt.pitch);
      blk(g,Wd,H*0.43,L,0,H*0.42,0,mt.gopher);
      for(const y of [H*0.3,H*0.6]) blk(g,Wd+0.3*m,0.4*m,L+0.3*m,0,y,0,mt.strake);       /* lower, second and third decks */
      blk(g,Wd*0.92,cub,L*0.97,0,H*0.85,0,mt.dark);                                      /* "in a cubit shall you finish it above" */
      blk(g,Wd*1.06,H*0.15-cub,L*1.01,0,H*0.85+cub,0,mt.gopher);
      const sd=Math.sign((e.x-c.x)*az-(e.z-c.z)*ax)||1;
      blk(g,0.6*m,4.6*m,3.8*m,sd*(Wd/2+0.2*m),0.4*m,L*0.18,mt.dark); };

    /* THE CAVE OF TREASURES ("a cave in a rock", Adam and Hawwah 1, 1:9): a face of grey stone stood
       on the higher ground to one side of the anchor, the dark of its mouth turned to the eye */
    MAKE.cave=g=>{ const m=M(), mt=mats(), e=eyeAt('cave'),
        st=station(e,[[50,0],[-50,0],[70,-10],[-70,-10],[90,0],[-90,0]],8*m,14*m,true);
      g.position.set(st.x,st.f.lo-0.6*m,st.z); g.rotation.y=Math.atan2(e.x-st.x,e.z-st.z);
      blk(g,9*m,7*m,7*m,0,0,-3.5*m,mt.rock);
      blk(g,4.6*m,5.2*m,6*m,-6*m,0,-3.4*m,mt.rock2);
      blk(g,5*m,3.8*m,5.6*m,6.4*m,0,-3*m,mt.rock2);
      blk(g,7*m,1.8*m,6*m,-0.8*m,7*m,-3.8*m,mt.rock2);
      blk(g,1.6*m,1.3*m,1.5*m,3.4*m,0,1.2*m,mt.rock2);
      blk(g,1.1*m,0.9*m,1.2*m,-4.6*m,0,1.5*m,mt.rock);
      blk(g,2.6*m,3.6*m,0.5*m,-0.6*m,0.6*m,0.15*m,mt.mouth); };

    /* THE RIVER that went out of Ĕḏen to water the garden (Bereshith 2:10): down from inland to the
       sea along the nearest way to it, passing the anchor to one side, laid on the ground a stretch at
       a time so it steps down with the land; it fills its bed by the dial. Its line is found once for
       an anchor, so the garden can keep its trees out of it before it runs. */
    let RL=null, RLa=null;
    function riverLine(){ if(RLa===anchor) return RL; RLa=anchor;
      const sw=seaward(0,1,true); RL=sw?{ux:sw.ux,uz:sw.uz,ox:sw.uz*44,oz:-sw.ux*44}:null; return RL; }
    MAKE.river=g=>{ const m=M(), mt=mats(), rv=riverLine(), list=[]; g.position.set(anchor.x,0,anchor.z);
      if(rv){ let r=0; while(r<1400&&dry(anchor.x+rv.ox+rv.ux*r,anchor.z+rv.oz+rv.uz*r)) r+=6;
        for(let j=0;j<64;j++){ const q=r-6-j*12, x=rv.ox+rv.ux*q, z=rv.oz+rv.uz*q;
          if(!dry(anchor.x+x,anchor.z+z)) continue;
          list.push({bx:0,by:0,bz:0,x,y:groundY(anchor.x+x,anchor.z+z)+0.5-W.B,z,w:5*m,h:W.B,d:12.5,ry:Math.atan2(rv.ux,rv.uz)}); } }
      many(g,list,mt.river); };
    EASE.river=(g,v)=>{ g.position.y=(v-1)*W.B; };

    /* THE GARDEN PLANTED (Bereshith 2:8-9): trees pleasant to the sight and good for food, set about
       the anchor wherever the ground is dry, out of the river's bed, and where no line from the eye to
       the man passes through one — every eye the scene will have while the garden stands is read off
       the track first — and in the midst, behind the man, the tree of life and the tree of knowing.
       They GROW by the dial, out of the ground, as the verse says they were made to. */
    MAKE.garden=g=>{ const m=M(), mt=mats(), eyes=[], rv=riverLine(); let mx=0, mz=0;
      for(let s=0;s<=dur();s+=1){ const d=at(s); if(!(d.garden>0.004)) continue; const a=d.ca*Math.PI*2;
        eyes.push([Math.sin(a)*d.cd,Math.cos(a)*d.cd]); mx+=Math.sin(a); mz+=Math.cos(a); }
      const ml=Math.hypot(mx,mz)||1; mx/=ml; mz/=ml;                    /* the eye's way from the anchor, on the whole */
      const clear=(x,z,R)=>{ if(Math.hypot(x,z)<R+10||!dry(anchor.x+x,anchor.z+z)) return false;
        if(rv&&Math.abs((x-rv.ox)*rv.uz-(z-rv.oz)*rv.ux)<R+3*m) return false;
        for(const [ex,ez] of eyes){ const u=Math.max(0,Math.min(1,(x*ex+z*ez)/(ex*ex+ez*ez||1)));
          if(Math.hypot(x-ex*u,z-ez*u)<R+6) return false; }
        return true; };
      const B={stem:[],leaf:[],leaf2:[],fruit:[],gold:[]}; let n=0;
      const tree=(x,z,sz,gold)=>{ const k=n++, by=groundY(anchor.x+x,anchor.z+z), th=(2.2+sz)*m, cw=(2.6+sz*0.9)*m, tw=0.45*m*(0.8+sz*0.25), o={bx:x,by,bz:z,k};
        B.stem.push(Object.assign({x:0,y:0,z:0,w:tw,h:th+0.6*m,d:tw},o));
        for(let j=0;j<7;j++){ const a=j*0.9+k, r=j?cw*0.32:0;
          B[(j+k)%3?'leaf':'leaf2'].push(Object.assign({x:Math.cos(a)*r,y:th-0.3*m+(j?((j*5)%3)*0.35*m:0.7*m),z:Math.sin(a)*r,w:cw*0.55,h:1.3*m,d:cw*0.55},o)); }
        for(let j=0;j<5;j++){ const a=j*1.3+k*0.7;
          B[gold?'gold':'fruit'].push(Object.assign({x:Math.cos(a)*cw*0.5,y:th+0.2*m+(j%2)*0.6*m,z:Math.sin(a)*cw*0.5,w:0.3*m,h:0.3*m,d:0.3*m,ripe:true},o)); } };
      const rad=sz=>0.6*(2.6+sz*0.9)*m;                                    /* the reach of its crown */
      for(const sd of [-1,1]){ const x=-mx*32+mz*14*sd, z=-mz*32-mx*14*sd; if(clear(x,z,rad(2.6))) tree(x,z,2.6,sd>0); }
      for(let i=0;i<120&&n<26;i++){ const a=i*2.39996, r=40+((i*53)%23)/23*170, sz=((i*7)%4)*0.45;
        if(clear(Math.sin(a)*r,Math.cos(a)*r,rad(sz))) tree(Math.sin(a)*r,Math.cos(a)*r,sz,false); }
      g.position.set(anchor.x,0,anchor.z);
      g.userData.ims=[many(g,B.stem,mt.stem),many(g,B.leaf,mt.leaf),many(g,B.leaf2,mt.leaf2),many(g,B.fruit,mt.fruit),many(g,B.gold,mt.gold)];
      g.userData.n=n; g.userData.v=-1; };
    EASE.garden=(g,v)=>{ if(g.userData.v===v) return; g.userData.v=v; const n=Math.max(1,g.userData.n);
      for(const im of g.userData.ims) place(im,b=>Math.max(0,Math.min(1,v*1.6-0.6*b.k/n))); };
    return {tick,drop};
  })();
  /* HOW FAR THE GROUND IS SUNK when the dry land has not yet appeared. Deep
     enough that not one summit of the highest range shows above the water. */
  const SINK=2600;

  function apply(d){
    const sc=W.scene;
    /* ---- the sky, and the darkness upon the face of the deep ---- */
    if(d.sky!==null&&d.sky!==undefined){ _c.setHex(d.sky); sc.background.copy(_c);
      if(sc.fog) sc.fog.color.copy(_c); }
    if(d.dark>0.001){ _c.setHex(0x000000);
      sc.background.lerp(_c,d.dark); if(sc.fog) sc.fog.color.lerp(_c,d.dark); }
    /* ---- light without a source: the first day ---- */
    W.hemi.intensity=0.06+d.light*1.05;
    W.dirL.intensity=0.04+d.light*0.5;
    /* ---- the two great lights, and the host ---- */
    const lit=(m,o)=>{ if(!m) return; m.opacity=o; m.transparent=true; };
    W.sun.visible=d.sun>0.004; lit(W.sunMat2,d.sun*(W.sun.userData.bright!==undefined?Math.max(0.25,W.sun.userData.bright):1));
    W.moon.visible=d.moon>0.004; lit(W.moonMat2,d.moon*(W.moon.userData.bright!==undefined?Math.max(0.25,W.moon.userData.bright):1));
    if(W.sunHalo) W.sunHalo.visible=W.sunHalo.visible&&d.sun>0.05;
    if(W.moonHalo) W.moonHalo.visible=W.moonHalo.visible&&d.moon>0.05;
    if(W.starGroup&&W.starGroup.userData.mat) W.starGroup.userData.mat.opacity=d.stars*0.95;
    W.starGroup.visible=d.stars>0.004;
    /* ---- the expanse ---- */
    if(d.firm>0.004){ W.ensureFlyDome();
      const fd=W.flyDome(); if(fd){ fd.material.opacity=d.firm*0.62; fd.visible=true; } }
    else { const fd=W.flyDome(); if(fd) fd.material.opacity=0; }
    /* ---- AND LET THE DRY LAND APPEAR ----
       TWO meshes carry the ground, not one: the streamed blocky chunks, and
       the coarse carpet that stands in for the world beyond them. Sinking
       only the chunks left whole countries of the carpet lying on the water
       through the first two days — the dry land was already there before it
       was called for. Both go down, and both come up together. */
    const lf=Math.max(0,Math.min(1,d.land));
    W.chunkRoot.position.y=-SINK*(1-lf);
    W.chunkRoot.visible=d.land>0.0005;
    /* ---- THE COARSE CARPET, AND WHEN A SCENE MAY HAVE IT ----
       It was NEVER in a scene, and for a good reason: it is the engine's
       stand-in for the world BEYOND the streamed chunks, and seen from a
       shore it is a handful of enormous flat planes lying across the whole
       view — which is exactly how it looked when the dry land first rose.
       Down at head height a scene wants blocks and haze and nothing else.

       BUT THAT RULE WAS WRITTEN FOR A SCENE STAGED AT SEA LEVEL, and it was
       then applied to every scene there could ever be. The streamed ring is
       some twelve hundred units across; lift the eye eight hundred units to
       look at the courses of the lights and the earth simply stops, and a
       film about the ends of the earth shows a small patch of blocks adrift
       in the sky. So a scene ASKS, with `far`, and gets nothing unless it
       does — every scene written before this one is unchanged.

       And the carpet must be told where to stand: the engine sizes its ring
       off the TRAVELLER's eye, and in a scene the traveller does not move —
       the camera does. It is given the camera's own height. */
    if(W.farLand){
      if(d.far>0.004){
        if(W.updateFarLand) W.updateFarLand(anchor.x,anchor.z,true,Math.max(1,d.cy));
        W.farLand.visible=true;
        if(W.farLandMat) W.farLandMat.opacity=Math.min(1,d.far);
      }else{
        W.farLand.visible=false;
        if(W.farLandMat) W.farLandMat.opacity=0;
      }
    }
    /* ---- the waters ----
       THE SEA IS LIT BY THE STAGE, NOT BY THE SUN. The water shader takes
       its light off the sun's own station and the hour of the day — which
       is exactly right for the voyage and exactly wrong here, because on
       the FIRST DAY there is light and there is no sun to make it. Left to
       itself the sky came up gold over an ocean still lying in the dark.
       The water is given the same light the rest of the world is given. */
    const seaOn=d.sea>0.004;
    W.sea.visible=seaOn; W.seaDeep.visible=seaOn; W.waveGrid.visible=seaOn;
    if(W.waveMat&&W.waveMat.uniforms){
      const u=W.waveMat.uniforms, lv=Math.max(0.05,d.light)*(1-d.dark*0.92);
      if(u.uLight) u.uLight.value.setRGB(lv,lv,lv);
      if(u.uZenith&&d.sky!==null&&d.sky!==undefined){
        _c.setHex(d.sky); u.uZenith.value.copy(_c).multiplyScalar(0.55*(1-d.dark)); }
      /* no sun on the water until there IS a sun */
      if(u.uSunCol) u.uSunCol.value.setRGB(d.sun*lv,d.sun*lv*0.95,d.sun*lv*0.86);
      if(u.uMoon) u.uMoon.value=d.moon*0.5;
      /* and the flat backdrop discs are painted to match, or the seam
         between them and the grid cuts the ocean in two */
      if(u.uDeep){ const dp=u.uDeep.value;
        const r=dp.r*0.72*lv, g=dp.g*0.72*lv, b=dp.b*0.72*lv;
        if(W.farSeaMat) W.farSeaMat.color.setRGB(r,g,b);
        W.seaDeep.material.color.setRGB(r*0.82,g*0.82,b*0.86); }
    }
    /* ---- the waters above ----
       AND THEY ARE LIT BY THE STAGE TOO, for the same reason the sea is. The
       cloud sheet is drawn white against whatever sky it is over, and the
       engine only ever varies how SOLID it is, never how bright — which is
       right for a world where the sky and the cloud go dark together, and
       wrong the moment a scene darkens the sky on its own. Sinai in smoke had
       a brown-black sky with bright white cloud lying across it. */
    W.cloudMat.opacity=d.clouds*0.85;
    { const cl=Math.max(0.06,d.light)*(1-d.dark*0.88);
      W.cloudMat.color.setRGB(cl,cl,cl); }
    /* ---- EVERY LIVING THING KEEPS OUT OF THE WORLD UNTIL ITS OWN DAY ----
       Not the beasts of the field only. The sea is furnished by a different
       set of pools altogether — the shoals, the turtles, the rays, the great
       whales, the reef and the tenants of the deep — and with those left
       running there were turtles swimming through the SECOND day, three days
       before the waters were told to teem with them. */
    if(d.lifeLand<0.5){ W.hideLandLife(); W.hideBlooms(); W.hideTraders(); }
    if(d.lifeAir<0.5){ W.hideAirLife(); }
    if(d.lifeSea<0.5){
      W.hidePod(); W.hideOrca();
      if(W.hideSeaMobs) W.hideSeaMobs();
      if(W.hideDeepLife) W.hideDeepLife();
      if(W.hideDeep) W.hideDeep();
      /* the leapers and the flying fish keep their own small pool */
      if(W.SEAFISH) for(const f of W.SEAFISH){ f.active=false; if(f.m) f.m.visible=false; }
      if(W.DIVEFISH) for(const f of W.DIVEFISH) if(f.m) f.m.visible=false;
      if(W.SHARKS) for(const f of W.SHARKS) if(f.m) f.m.visible=false;
    }
    /* ---- and neither ship nor man is in the world before its time ---- */
    W.boatG.visible=d.ship>0.5;
    /* ---- nor the merchantmen of a later age ----
       The world's own tick sets the passing galleons out about whoever is at sea, every frame, and
       they were put away only before the sixth day: a pale three-master stood on the horizon of the
       garden and sailed on through the days after it. They are put away every frame now, AFTER the
       world has set them out, unless a scene asks for them. */
    if(!(d.traders>0.5)) W.hideTraders();
    W.walkerG.visible=d.man>0.5;
    if(d.man>0.5) standMan();
    makers.tick(d);
    /* ---- how far the eye reaches ---- */
    if(sc.fog){ if(d.fogN!==null&&d.fogN!==undefined) sc.fog.near=d.fogN;
      if(d.fogF!==null&&d.fogF!==undefined) sc.fog.far=d.fogF; }
    W.voidWall.visible=false;     /* no wall of night stands across a making world */
    /* ---- AND THE HOUR OF THE DAY, WHERE THE SCENE IS STAGED ----
       The clock is taken off 'live' first. Left on it, the engine re-reads
       the machine's own wall clock four times a second and writes it back
       over whatever the scene asked for — so the hour would hold for a
       quarter of a second and then be somebody's real afternoon again. */
    if(d.hour!==null&&d.hour!==undefined&&W.setLocalHour){
      if(W.DAYPARTS&&W.DAYPARTS[W.state.dayIdx]&&W.DAYPARTS[W.state.dayIdx].k==='live'){
        const i=W.DAYPARTS.findIndex(p=>p.k==='noon');
        if(i>=0) W.state.dayIdx=i;
      }
      W.setLocalHour(d.hour,anchor.x,anchor.z);
    }
    /* ---- and the eye itself ----
       ITS HEIGHT IS TAKEN FROM THE GROUND AT THE ANCHOR, NOT FROM THE SEA. The keys were written for
       a scene staged at the water's edge; staged a way up a wild beach, the ground there stands a
       block over the sea and the ground the eye stands over higher yet, so an eye eighteen "up" was
       a metre off the sand and its line of sight went into the dune half way to what it looked at.
       While the dry land is sunk there is no ground to take it from, and the water-level shots of the
       first days are left exactly as they were; as the land rises the eye rises with it. And whatever
       a key asks, the eye is kept a man's height and more off the ground under it, and the line from
       it to what it looks at kept off the ground half way. */
    const a=d.ca*Math.PI*2, ex=anchor.x+Math.sin(a)*d.cd, ez=anchor.z+Math.cos(a)*d.cd;
    const sunk=SINK*(1-lf), g0=Math.max(0,groundY(anchor.x,anchor.z)-W.WATER_Y)*lf, ly=d.cl+g0;
    let ey=Math.max(d.cy+g0,Math.max(W.WATER_Y,groundAt(ex,ez)-sunk)+W.B*1.5);
    { const gm=Math.max(W.WATER_Y,groundAt((ex+anchor.x)/2,(ez+anchor.z)/2)-sunk)+W.B; if((ey+ly)/2<gm) ey=2*gm-ly; }
    W.camera.position.set(ex,ey,ez);
    W.camera.lookAt(anchor.x,ly,anchor.z);
    if(Math.abs(W.camera.fov-d.cfov)>0.01){ W.camera.fov=d.cfov; W.camera.updateProjectionMatrix(); }
  }

  function tick(dt){
    if(!playing||!track) return;
    t+=dt;
    const end=dur();
    apply(at(Math.min(t,end)));
    if(t>=end){ playing=false; const f=onDone; onDone=null; if(f) f(); }
  }
  window.__STAGE_TICK=tick;

  return {play,stop,tick,seek,elapsed,dur,at,anchorAt:a=>{anchor=a;},
    isPlaying:()=>playing, give};
})();
