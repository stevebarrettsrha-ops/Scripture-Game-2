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
    /* THE SIGNS, and what the things of a scene are doing (see THE PLAYERS below): YAHUAH is shown
       only as light, cloud and fire — glory, fire — and the rest are the waters, the rain, the bow,
       the earth shaking, the tongues as of fire, the city coming down, the ladder, and the dials a
       thing of the scene names for itself (the stone rolled, the den sealed, the pillar raised) */
    glory:0, fire:0, rain:0, flood:0, bow:0, shake:0, tongues:0, city:0, ladder:0,
    roll:0, seal:0, raise:0, dove:0,
    /* ox, oz: the eye turns about a point this far (metres) across and into the stage from the anchor */
    ox:0, oz:0,
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

  /* `scene`, when a film is played (not the idle turn behind the Library): its players, its
     things and its signs, and `front` — the bearing, in turns, the eye's first station stands at
     from the anchor, which every `ca` of that film is then counted from */
  let front=0, waiting=false;
  function play(tr,anch,done,scene){
    track=tr.slice().sort((a,b)=>a.t-b.t); t=0; playing=true; waiting=false;
    anchor=anch||{x:0,z:0}; onDone=done||null;
    if(!held) hold();
    cast3.drop();
    front=scene&&typeof scene.front==='number'?scene.front:(anch&&anch.front!=null?anch.front:0);
    if(scene&&(scene.cast||scene.crowds||scene.herds||scene.props||scene.signs||scene.set)) cast3.begin(scene);
    return dur();
  }
  function dur(){ return track&&track.length?track[track.length-1].t:0; }
  function elapsed(){ return t; }
  function seek(x){ t=Math.max(0,Math.min(dur(),x)); }
  function stop(){ playing=false; track=null; waiting=false; cast3.drop(); give(); }
  /* THE CAPTION WAITS FOR THE VOICE. While a verse is still being read when its time is up, the
     film's own clock stands still — the world goes on moving, the sea and the folk and the light,
     but nothing of the telling moves on until the reading is done (js/story.js asks for it) */
  function wait(on){ waiting=!!on; }

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
    /* (a thing that cannot be made is left out, and the film plays on without it) */
    function tickProps(d){
      for(const k in MAKE){ const v=+d[k]||0;
        if(v>0.004&&!up[k]){ const g=new T.Group(); try{ MAKE[k](g); }catch(e){ g.userData.broken=true; } W.scene.add(g); up[k]=g; }
        else if(v<=0.004&&up[k]) putAway(k);
        if(up[k]&&EASE[k]&&!up[k].userData.broken) EASE[k](up[k],v); } }
    function putAway(k){ const g=up[k]; delete up[k]; if(g.parent) g.parent.remove(g);
      g.traverse(o=>{ if(o.geometry&&!o.isSprite) o.geometry.dispose(); if(o.isInstancedMesh) o.dispose(); });
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
       whole footprint, or the first of them if none has */
    function station(e,list,L,Wd){
      const at2=(l,s)=>[anchor.x+e.fz*l+e.fx*s,anchor.z-e.fx*l+e.fz*s];
      for(const [l,s] of list){ const [x,z]=at2(l,s), f=under(x,z,e.fx,e.fz,L,Wd); if(f.ok) return {x,z,f}; }
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

    /* THE CAVE OF TREASURES ("a cave in a rock", Adam and Hawwah 1, 1:9): a knoll of grey stone some
       fifteen metres across stood a little beyond the anchor, where the eye is looking, built of the
       world's own blocks one upon another — each stone its own shade, as the hills about it are — and
       sunk a block into the ground under every column of it, so it rises out of the land and does not
       sit on it. The dark of its mouth is turned to the eye: a doorway of the height of a man and a
       little more, a lintel of the rock over it, and the dark going back into the hill behind. */
    MAKE.cave=g=>{ const m=M(), mt=mats(), e=eyeAt('cave'), b=W.B,
        st=station(e,[[0,-30],[0,-45],[24,-30],[-24,-30],[34,-12],[-34,-12]],12*m,15*m);
      const ry=Math.atan2(e.x-st.x,e.z-st.z), cs=Math.cos(ry), sn=Math.sin(ry), y0=st.f.lo-0.6*m;
      g.position.set(st.x,y0,st.z); g.rotation.y=ry;
      const RX=7.5*m, RZ=5.5*m, H=6.5*m, CZ=-4*m, front=CZ+RZ, MW=1.3*m, MH=2.6*m, MD=4.4*m;
      const hs=(i,j)=>{ const q=Math.sin(i*127.1+j*311.7)*43758.5453; return q-Math.floor(q); };
      const gAt=(x,z)=>groundY(st.x+x*cs+z*sn,st.z-x*sn+z*cs)-y0;          /* the ground under (x,z) of the knoll */
      const stones=[], shade=[], scrub=[], SH=[0x8a8174,0x7d7468,0x6f675c,0x958b7c,0x625b51,0x837a6c];
      const gm=gAt(0,front);
      for(let i=-Math.ceil(RX/b);i<=Math.ceil(RX/b);i++) for(let j=-Math.ceil(RZ/b);j<=Math.ceil(RZ/b);j++){
        const x=i*b, z=CZ+j*b, r=Math.hypot(x/RX,(z-CZ)/RZ); if(r>1) continue;
        const gy=Math.floor(gAt(x,z)/b)*b-b;
        let top=Math.round((st.f.hi-y0+H*Math.pow(1-r*r,0.6)*(0.8+0.32*hs(i,j)))/b)*b;
        if(top<gy+2*b) top=gy+2*b;
        /* the doorway: the columns in it are open from the ground to the lintel, and the lintel kept
           only where the rock stands a block and more over it */
        const door=Math.abs(x)<MW&&z>front-MD;
        for(let y=gy;y<top;y+=b){
          if(door&&y+b>gy+b&&y<gm+MH) continue;
          stones.push({bx:0,by:0,bz:0,x,y,z,w:b,h:b,d:b}); shade.push(SH[Math.floor(hs(i*7+y,j*3-y)*SH.length)]); }
        if(!door&&r<0.85&&hs(j,i)<0.13) scrub.push({bx:0,by:0,bz:0,x,y:top,z,w:0.7*b,h:0.5*b,d:0.7*b}); }
      for(const [x,z,s] of [[2.6,2.4,1],[-3.4,2.9,0.8],[4.2,0.6,0.7],[-5.1,1.0,1.1]]){ const k=stones.length;
        stones.push({bx:0,by:0,bz:0,x:x*m,y:Math.floor(gAt(x*m,z*m)/b)*b,z:z*m,w:s*b,h:s*b*0.8,d:s*b*1.1,ry:k}); shade.push(SH[k%SH.length]); }
      const ri=mt.rockI||(mt.rockI=new T.MeshLambertMaterial({color:0xffffff})), im=many(g,stones,ri), cl=new T.Color();
      shade.forEach((c,i)=>im.setColorAt(i,cl.setHex(c))); if(im.instanceColor) im.instanceColor.needsUpdate=true;
      if(scrub.length) many(g,scrub,mt.leaf2);
      /* the dark within: from a block inside the doorway back into the hill */
      blk(g,2*MW+0.2*m,MH+0.6*m,MD-b,0,gm-0.4*m,front-b-(MD-b)/2,mt.mouth); };

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
  /* ================= THE PLAYERS, THE THINGS AND THE SIGNS =================
     Scripture-Game writes every slide as data: the place, the hour, the cast with their poses,
     the crowds, the props and the effects. A film here is written the same way, and this is
     what stands them on the true earth at the scroll's own place.

     THE STAGE IS LAID ONTO THE LAND. Its FRONT is the eye's first station (the scene's `front`,
     in turns, as `ca` is counted); from there `x` runs across the picture to the right and `z`
     runs into it, both in metres from the anchor — so what Scripture-Game calls across the screen
     is across the eye's view, and its depth is distance. A player's `y` is metres over the ground.

       cast:  [{ id, as, keys:[{t,x,z,y,pose,face}], on:[t0,t1], ... }]   one figure each
       crowds:[{ n, as, x0,z0,x1,z1, y, pose, poses:[[t,pose]], face, on }] many at once
       herds: [{ kind, n, x0,z0,x1,z1, face, on }]                          the beasts
       props: [{ k, x, z, turn, s, on, ... }]                                the things the verses name
       signs: { glory:{x,z,h,r}, fire:{x,z,h}, city:{dist,size}, bow:{dist}, flood:{} }
       set:   { clear:[x0,z0,x1,z1], level:[[x0,z0,x1,z1,top]], water:[[x0,z0,x1,z1,depth]] }

     `as` dresses a figure: man · elder · woman · youth · boy · girl · yahusha · infant · malak ·
     giant · soldier · sovereign · prophet. `pose`: stand · walk · kneel · sit · prone (fallen on
     the face) · lie (asleep, on the back) · arms (lifted to the shamayim) · pray (hands before
     him) · wade (waist-deep in the river). `face`: 'eye', another player's id, [x,z], or a
     bearing in turns about the stage (0 toward the eye, 0.5 away, 0.25 to the right).

     THE RULES THIS GAME KEEPS, kept here and not left to the films:
       · EVERYONE IS BROWN. A figure is given a brown skin unless a film names another.
       · YAHUSHA'S FACE IS NEVER DRAWN. `as:'yahusha'` (and the infant) is built holy — the front
         of the head is skin and nothing else — and the eye is never let nearer to His head than
         GUARD metres: if a key would bring it closer, it is held back along its own line.
       · YAHUAH IS SHOWN ONLY AS LIGHT, CLOUD AND FIRE: `glory` and `fire` and nothing more. No
         figure is ever made for Him, and a voice from the shamayim is a light and a caption.
       · MAL'AKIM ARE BROWN MEN LIT FROM WITHIN, with no wings: their robes and skin burn with a
         light of their own, and a glow stands about them.
       · VIOLENCE IS READ, NEVER DRAWN. No blade or blow is made here: Golyath simply falls.  */
  const cast3=(function(){
    const K=()=>window.__KIT;
    const S=()=>(K()&&K().setScale)||6.5;            /* world units to the metre */
    const GUARD=6.5;                                  /* metres the eye keeps from His head */
    let sc=null, root=null, fr={f:[0,-1],r:[1,0],yaw:Math.PI}, figs=[], things=[], api=null, lit=null;
    const TAU=Math.PI*2;
    function setFrame(turns){ const a=turns*TAU;
      fr={f:[-Math.sin(a),-Math.cos(a)], r:[Math.cos(a),-Math.sin(a)], yaw:Math.atan2(-Math.sin(a),-Math.cos(a))}; }
    /* a point of the stage (metres across, metres in) as a point of the world */
    function wpt(x,z){ const s=S(); return [anchor.x+(fr.r[0]*x+fr.f[0]*z)*s, anchor.z+(fr.r[1]*x+fr.f[1]*z)*s]; }
    /* the ground a thing stands on: what is BUILT counts (a set's level floor, a city's paving) */
    function gy(X,Z){ const c=W.landAtWorld(X,Z); let y=c?c.h*W.B:W.WATER_Y;
      try{ const g=K().groundInfo(X,Z,y+24); if(g&&g.y!=null&&isFinite(g.y)) y=g.y; }catch(e){}
      return y; }
    /* a bearing on the stage as a way in the world */
    function dirOf(turns){ const a=turns*TAU, c=Math.cos(a), s=Math.sin(a);
      return [-fr.f[0]*c+fr.r[0]*s, -fr.f[1]*c+fr.r[1]*s]; }

    /* ---- THE STUFF THINGS ARE MADE OF ---- */
    let MT=null;
    function glowTex(inner,outer){ const cv=document.createElement('canvas'); cv.width=cv.height=64;
      const g=cv.getContext('2d'), gr=g.createRadialGradient(32,32,0,32,32,32);
      gr.addColorStop(0,inner); gr.addColorStop(0.35,outer); gr.addColorStop(1,'rgba(0,0,0,0)');
      g.fillStyle=gr; g.fillRect(0,0,64,64); return new T.CanvasTexture(cv); }
    function mats(){ if(MT) return MT;
      const L=(c,o)=>new T.MeshLambertMaterial(Object.assign({color:c},o||{}));
      const add=(c,op)=>new T.MeshBasicMaterial({color:c,transparent:true,opacity:op,blending:T.AdditiveBlending,depthWrite:false});
      MT={ stone:L(0x9a9184), stone2:L(0x80786c), dark:new T.MeshBasicMaterial({color:0x0b0907}), wood:L(0x6a4a2c), wood2:L(0x856038),
        hay:L(0xc8a85a), cloth:L(0xefe8d8), pitch:L(0x2a2018), gopher:L(0x7b5634), leaf:L(0x55702f), leaf2:L(0x41602a), thorn:L(0x5b4630),
        water:L(0x3f7f96,{emissive:0x0c2a36,transparent:true,opacity:0.86}), flood:L(0x2f4652,{emissive:0x0a1418}),
        flame:add(0xffa640,0.85), gold:add(0xffd88a,0.9), shaft:add(0xfff2c8,0.16),
        glow:new T.SpriteMaterial({map:glowTex('rgba(255,252,236,1)','rgba(255,226,150,0.55)'),transparent:true,depthWrite:false,blending:T.AdditiveBlending,fog:false}),
        ember:new T.SpriteMaterial({map:glowTex('rgba(255,236,190,1)','rgba(255,150,60,0.6)'),transparent:true,depthWrite:false,blending:T.AdditiveBlending}),
        rain:new T.MeshBasicMaterial({color:0xaab6c4,transparent:true,opacity:0.4,depthWrite:false}) };
      return MT; }
    function blk(g,w,h,d,x,y,z,m){ const s=S(), b=new T.Mesh(new T.BoxGeometry(w*s,h*s,d*s),m); b.position.set(x*s,(y+h/2)*s,z*s); g.add(b); return b; }
    function sprite(g,mat,x,y,z,size){ const s=S(), sp=new T.Sprite(mat.clone?mat.clone():mat); sp.position.set(x*s,y*s,z*s); sp.scale.set(size*s,size*s,1); g.add(sp); return sp; }

    /* ================= THE PEOPLE ================= */
    const SKIN=[0x8d5524,0x7a4a22,0x6b3f1d,0x9a6438,0x5e3a1c,0x84532c,0x734626,0x8a5a32];
    const ROBE=[0x8a7454,0x6e5a44,0x9a8462,0x5f4b3a,0x7c6a52,0xa08a68,0x6a5a48,0x8c6e4c];
    const CLOTH=[0x6e5a4a,0x4f5f6e,0x7a5040,0x5e6a52,0x8a7a62,0x3f4a5a];
    const LOOK={
      man:{}, prophet:{robe:0x6b5a40,beard:0x2a2018},
      elder:{beard:0xd6d2ca,hair:0xd6d2ca},
      woman:{female:true}, girl:{female:true,small:0.74},
      youth:{small:0.9,beard:false}, boy:{small:0.74,beard:false},
      /* HE IS HOLY: the face is never drawn (makeFigure's `holy`), and a plain head-cloth frames it */
      yahusha:{holy:true,robe:0xe8e0cc,sash:0x8a6a44,cloth:0xe9e3d2},
      malak:{robe:0xf3efe4,beard:false,malak:true},
      giant:{robe:0x8a6a3a,cloth:0x9a7a3e,scale:1.62,under:0x6a5030},
      soldier:{robe:0x8c2a22,cloth:0x9a9aa0,under:0x5a4030},
      sovereign:{robe:0x5a2a6a,sash:0xc8a040,cloth:0xc8a040},
      shepherd:{robe:0x7a6a50,staff:true,cloth:0x8a7a5a}
    };
    function infant(){ const g=new T.Group(), m=mats();
      /* wrapped up (Luke 2:7): a bundle of cloth, and the head of a child — and the face, as His face
         always is here, not drawn: the skin of the head and nothing upon it */
      const sk=new T.MeshLambertMaterial({color:0x8a5a32});
      const body=new T.Mesh(new T.BoxGeometry(2.2,1.3,3.6),m.cloth); body.position.set(0,0.65,0); g.add(body);
      const head=new T.Mesh(new T.BoxGeometry(1.25,1.25,1.25),[sk,sk,sk,sk,sk,sk]); head.position.set(0,1.0,2.2); g.add(head);
      g.userData={head,holy:true,infant:true}; return g; }
    /* lit from within: every stuff of the figure made its own, burning with its own colour */
    function litWithin(g){
      g.traverse(o=>{ if(!o.isMesh) return;
        const one=mt=>{ const c=mt.clone(); if(c.emissive){ c.emissive.copy(c.color||new T.Color(0xffffff)).multiplyScalar(0.62); } return c; };
        o.material=Array.isArray(o.material)?o.material.map(one):one(o.material); });
      const sp=new T.Sprite(mats().glow.clone()); sp.position.y=7; sp.scale.set(30,30,1); sp.material.opacity=0.7; g.add(sp);
      g.userData.halo=sp; g.userData.lit=true; g.userData.noShadow=true; }   /* (and they throw no shade: the mal'akim are light) */
    function makeOne(c,i){
      const k=K(); if(!k||!k.makeFigure) return null;
      const look=Object.assign({},LOOK[c.as]||{},c), seed=look.seed||(i*7+3);
      let fig;
      if(c.as==='infant') fig=infant();
      else{
        const o={seed, skin:look.skin!=null?look.skin:SKIN[seed%SKIN.length],
          hair:look.hair!=null?look.hair:0x1c140f, eye:0x2a1a10,
          robe:look.robe!=null?look.robe:ROBE[(seed*3)%ROBE.length], sash:look.sash, under:look.under,
          cloth:look.cloth!=null?look.cloth:(look.female?CLOTH[seed%CLOTH.length]:undefined),
          female:!!look.female, staff:!!look.staff, holy:!!look.holy, small:look.small, folk:'levant'};
        if(look.beard!==false&&!look.female&&!(look.small<0.95)) o.beard=look.beard!=null?look.beard:o.hair;
        try{ fig=k.makeFigure(o); }catch(e){ return null; }
        if(look.malak) litWithin(fig);
      }
      const h=new T.Group(); h.add(fig); h.scale.setScalar(look.scale||1);
      const P={c,fig,h,holy:!!(look.holy||c.as==='infant'),malak:!!look.malak,ph:(seed%7)*0.9,
        tongue:null,prev:null,id:c.id||null};
      return P; }
    /* ---- THE POSES ---- */
    function pose(P,name,walk){
      const u=P.fig.userData, f=P.fig;
      f.rotation.set(0,0,0); f.position.set(0,0,0);
      const L=[u.legL,u.legR,u.armL,u.armR];
      if(!u.legL){ if(name==='prone'||name==='lie'){ f.rotation.x=name==='prone'?Math.PI/2:-Math.PI/2; f.position.y=0.8; } return; }
      for(const l of L){ if(!l) continue; l.rotation.set(0,0,0); const kn=l.userData.knee||l.userData.elbow; if(kn) kn.rotation.x=l.userData.knee?0.05:-0.14; }
      if(name==='walk'){ const s=Math.sin(walk);
        u.legL.rotation.x=s*0.55; u.legR.rotation.x=-s*0.55; u.armL.rotation.x=-s*0.4; u.armR.rotation.x=s*0.4;
        const jt=K()&&K().jointTick; if(jt) for(const l of L) jt(l,true); }
      else if(name==='kneel'){ for(const l of [u.legL,u.legR]){ l.userData.knee.rotation.x=1.5; } f.position.y=-2.2; }
      else if(name==='sit'){ for(const l of [u.legL,u.legR]) l.rotation.x=-1.45; f.position.y=-3.5; u.armL.rotation.x=u.armR.rotation.x=-0.5; }
      else if(name==='prone'){ f.rotation.x=Math.PI/2; f.position.y=1.0; u.armL.rotation.x=u.armR.rotation.x=-2.9; }
      else if(name==='lie'){ f.rotation.x=-Math.PI/2; f.position.y=1.0; }
      else if(name==='arms'){ u.armL.rotation.x=u.armR.rotation.x=-2.75; u.armL.rotation.z=0.3; u.armR.rotation.z=-0.3; }
      else if(name==='pray'){ u.armL.rotation.x=u.armR.rotation.x=-1.25; u.armL.rotation.z=-0.25; u.armR.rotation.z=0.25; }
      else if(name==='kneelpray'){ for(const l of [u.legL,u.legR]) l.userData.knee.rotation.x=1.5; f.position.y=-2.2; u.armL.rotation.x=u.armR.rotation.x=-2.6; }
      else if(name==='wade'){ u.armL.rotation.x=u.armR.rotation.x=-0.45; }   /* (he stands on the river's bed, and the river is to his waist) */
      else if(name==='reach'){ u.armR.rotation.x=-1.5; }
    }
    /* where a player is at time tt, read off its keys and eased between them */
    function keyAt(c,tt){
      const ks=c.keys||[{t:0,x:c.x||0,z:c.z||0,y:c.y||0,pose:c.pose,face:c.face}];
      let i=0; while(i<ks.length-1&&ks[i+1].t<=tt) i++;
      const A=ks[i], B=ks[Math.min(i+1,ks.length-1)];
      const m={}; for(let j=0;j<=i;j++) Object.assign(m,ks[j]);
      if(A===B||tt<=A.t) return {x:m.x||0,z:m.z||0,y:m.y||0,pose:m.pose||c.pose||'stand',face:m.face!==undefined?m.face:c.face,moving:false};
      const u0=Math.max(0,Math.min(1,(tt-A.t)/Math.max(1e-3,B.t-A.t))), u=B.cut?0:u0;
      const lx=(a,b)=>a+(b-a)*u, bx=B.x!=null?B.x:m.x||0, bz=B.z!=null?B.z:m.z||0, by=B.y!=null?B.y:m.y||0;
      const moving=Math.hypot(bx-(m.x||0),bz-(m.z||0))>0.3&&!B.cut;
      return {x:lx(m.x||0,bx),z:lx(m.z||0,bz),y:lx(m.y||0,by),pose:moving&&!B.glide?'walk':(m.pose||c.pose||'stand'),
        face:moving?null:(m.face!==undefined?m.face:c.face),moving,to:[bx,bz]}; }
    function onAt(c,tt){ return !c.on||(tt>=c.on[0]&&tt<c.on[1]); }

    /* ================= THE THINGS THE VERSES NAME =================
       Each is built about its own foot, in metres, with +z into the picture (`turn` swings it),
       stood on the ground where the film sets it; `ease` is what it does as the film runs. */
    const THING={};
    /* an altar of whole stones (Shamoth 20:25), the wood laid in order on it (Bereshith 22:9) —
       and on Karmel twelve stones and a trench about it (Malakim Aleph 18:31-32) */
    THING.altar=(g,p)=>{ const m=mats(), n=p.stones||12;
      for(let i=0;i<n;i++){ const a=i/n*TAU, r=0.55+(i%2)*0.12;
        blk(g,0.62,0.55+(i%3)*0.08,0.6,Math.cos(a)*r,0,Math.sin(a)*r,i%3?m.stone:m.stone2); }
      blk(g,1.5,0.62,1.5,0,0.05,0,m.stone2); blk(g,1.7,0.3,1.7,0,0.66,0,m.stone);
      if(p.wood!==false) for(let i=0;i<5;i++) blk(g,1.6,0.16,0.18,0,0.96+(i%2)*0.16,-0.6+i*0.3,m.wood);
      if(p.trench){ for(const [w,d,x,z] of [[4,0.5,0,1.9],[4,0.5,0,-1.9],[0.5,3.3,1.9,0],[0.5,3.3,-1.9,0]]){ const b=blk(g,w,0.08,d,x,0.02,z,m.water); b.visible=false; (g.userData.trench=g.userData.trench||[]).push(b); } }
      g.userData.fireAt=[0,1.3,0]; };
    /* (the trench holds water from when it is poured, `wet`, until the fire licks it up, `dry`) */
    THING.altar.ease=(g,p,d,tt)=>{ if(g.userData.trench) for(const b of g.userData.trench)
      b.visible=(!p.wet||tt>=p.wet)&&(d.fire<0.9||!p.dry); };
    /* the ark of gopher wood (Bereshith 6:14-16): three hundred cubits, fifty and thirty — pitched
       within and without, three decks, the light of a cubit under the roof, the door in its side.
       It rides the waters as they rise (`float`) and comes to rest where it was laid. */
    THING.ark=(g,p)=>{ const m=mats(), cub=0.523, L=300*cub, Wd=50*cub, H=30*cub, s=p.scale||1;
      const q=new T.Group(); q.scale.setScalar(s); g.add(q);
      blk(q,Wd,H*0.42,L,0,0,0,m.pitch); blk(q,Wd,H*0.43,L,0,H*0.42,0,m.gopher);
      for(const y of [H*0.3,H*0.6]) blk(q,Wd+0.3,0.4,L+0.3,0,y,0,m.wood);
      blk(q,Wd*0.92,cub,L*0.97,0,H*0.85,0,m.dark); blk(q,Wd*1.06,H*0.15-cub,L*1.01,0,H*0.85+cub,0,m.gopher);
      blk(q,0.6,4.6,3.8,-(Wd/2+0.2),0.4,L*0.18,m.dark); };
    /* the stone at his head, and the same stone set up as a standing column (Bereshith 28:11,18) */
    THING.pillar=(g,p)=>{ const m=mats(); const st=new T.Group(); g.add(st); g.userData.st=st;
      blk(st,0.42,1.25,0.32,0,0,0,m.stone); };
    THING.pillar.ease=(g,p,d)=>{ const st=g.userData.st, r=Math.max(0,Math.min(1,d.raise||0)), s=S();
      st.rotation.x=(1-r)*Math.PI/2; st.position.y=(1-r)*0.16*s; st.position.z=(1-r)*0.62*s; };
    /* a thicket — the ram caught in it by its horns (Bereshith 22:13) is a beast of the herds */
    THING.thicket=(g,p)=>{ const m=mats();
      for(let i=0;i<5;i++) blk(g,0.16,0.9,0.16,(i-2)*0.35,0,((i*2)%3-1)*0.25,m.thorn);
      for(let i=0;i<22;i++){ const a=i*2.4, r=0.2+1.1*((i*7)%16)/16, y=(0.3+1.0*((i*11)%16)/16)*(1-r/2.6);
        blk(g,0.6,0.5,0.6,Math.cos(a)*r,y,Math.sin(a)*r,i%3?m.leaf:m.leaf2); } };
    /* a fire of wood: the shepherds' by night, the fire Aḇrahim carried (Bereshith 22:6) */
    THING.fire=(g,p)=>{ const m=mats(); for(let i=0;i<4;i++){ const b=blk(g,0.9,0.14,0.14,0,0,0,m.wood); b.rotation.y=i*0.8; }
      g.userData.tongues=[]; for(let i=0;i<5;i++){ const f=new T.Mesh(new T.BoxGeometry(0.16*S(),1,0.16*S()).translate(0,0.5,0),m.flame);
        f.position.set(Math.cos(i*1.3)*0.18*S(),0.1*S(),Math.sin(i*1.3)*0.18*S()); g.add(f); g.userData.tongues.push(f); }
      g.userData.lamp=[0,0.8,0,p.light||0.5]; };
    THING.fire.ease=(g,p,d)=>{ const s=performance.now()/1000;
      g.userData.tongues.forEach((q,i)=>{ q.scale.y=Math.max(0.01,(0.55+0.3*Math.sin(s*(9+i*1.3)+i))*S()); }); };
    /* THE DEN OF LIONS (Dani'al 6:16-17): walls of stone about a floor, open above — and the stone
       brought and laid on its mouth, sealed with the signet, by its dial (`seal`) */
    THING.den=(g,p)=>{ const m=mats(), w=p.w||9, d=p.d||9, h=p.h||3.4;
      blk(g,w+1.2,h,0.6,0,0,-d/2,m.stone2); blk(g,w+1.2,h,0.6,0,0,d/2,m.stone2);
      blk(g,0.6,h,d,-w/2,0,0,m.stone); blk(g,0.6,h,d,w/2,0,0,m.stone);
      blk(g,w,0.12,d,0,0,0,m.stone2);
      const lid=blk(g,w+1.4,0.5,d+1.4,0,h,0,m.stone); g.userData.lid=lid; lid.visible=false; };
    THING.den.ease=(g,p,d)=>{ g.userData.lid.visible=(d.seal||0)>0.5; };
    /* THE TOMB hewn out of the rock (Mattithyahu 27:60), and the great stone at its door — rolled
       back from the door by its dial (`roll`) as the mal'ak rolled it (28:2) */
    THING.tomb=(g,p)=>{ const m=mats();
      blk(g,9,4.6,5,0,0,-2.5,m.stone); blk(g,4,3.2,4.4,-5.6,0,-2.4,m.stone2); blk(g,3.6,2.6,4,5.4,0,-2.2,m.stone2);
      blk(g,7,1.4,4.6,0.4,4.6,-2.7,m.stone2);
      blk(g,1.3,1.9,0.3,0,0,0.02,m.dark);
      const st=new T.Mesh(new T.CylinderGeometry(1.15*S(),1.15*S(),0.42*S(),20),m.stone2);
      st.rotation.x=Math.PI/2; st.position.set(0,1.15*S(),0.36*S()); g.add(st); g.userData.stone=st; };
    THING.tomb.ease=(g,p,d)=>{ const st=g.userData.stone, r=Math.max(0,Math.min(1,d.roll||0)), s=S();
      st.position.x=r*2.5*s; st.rotation.y=0; st.rotation.z=-r*2.5/1.15;
      /* rolled back, it is laid down flat, and he sat on it */
      if(r>=1){ st.rotation.x=0; st.position.y=0.21*s; st.position.z=1.4*s; } else { st.rotation.x=Math.PI/2; st.position.y=1.15*s; st.position.z=0.36*s; } };
    /* A SHELTER FOR THE BEASTS against the rock, and the feeding trough the child was laid in */
    THING.stable=(g,p)=>{ const m=mats();
      blk(g,8,3.4,1.6,0,0,-3.2,m.stone2);
      for(const [x,z] of [[-3.6,2.2],[3.6,2.2],[-3.6,-2.4],[3.6,-2.4]]) blk(g,0.24,2.6,0.24,x,0,z,m.wood);
      const roof=blk(g,8.2,0.22,5.4,0,2.6,0,m.hay); roof.rotation.x=-0.12;
      blk(g,1.6,0.55,0.7,0.6,0,0.2,m.wood); blk(g,1.4,0.18,0.5,0.6,0.5,0.2,m.hay);
      g.userData.manger=[0.6,0.62,0.2]; };
    /* the river, for a film that has no river of the world to stand in: a run of water laid across
       the picture on the ground, with its banks of reeds (the Yardĕn is laid as real water by `set`) */
    THING.reeds=(g,p)=>{ const m=mats(), L=p.len||30; for(let i=0;i<L*2;i++){ const x=-L/2+i*0.5+((i*37)%7)/10, z=((i*13)%5)/5-0.5;
      blk(g,0.14,0.9+((i*11)%5)/6,0.14,x,0,z,i%2?m.leaf:m.leaf2); } };
    /* tents of the camp, a little way off (the armies of the valley) */
    THING.tent=(g,p)=>{ const m=mats(); const t=new T.Mesh(new T.ConeGeometry(2.4*S(),2.6*S(),4),new T.MeshLambertMaterial({color:p.col||0x6a5a46}));
      t.position.y=1.3*S(); t.rotation.y=Math.PI/4; g.add(t); };
    /* the dove (Mattithyahu 3:16): down out of the opened shamayim to Him, by its dial */
    THING.dove=(g,p)=>{ const k=K(); let b=null; try{ b=k.makeBird('dove'); }catch(e){}
      if(b){ b.scale.setScalar(2.2); g.add(b); g.userData.b=b; }
      const sp=new T.Sprite(mats().glow.clone()); sp.scale.set(14,14,1); sp.material.opacity=0.6; g.add(sp); g.userData.sp=sp; };
    THING.dove.ease=(g,p,d)=>{ const v=Math.max(0,Math.min(1,d.dove||0)), s=S(), e=v*v*(3-2*v);
      const h=(p.h0||40)+((p.h1||3)-(p.h0||40))*e;
      for(const o of [g.userData.b,g.userData.sp]) if(o){ o.position.set(0,h*s,(1-e)*(p.dz||-12)*s); o.visible=v>0.01; } };
    /* THE LADDER set up on the earth whose top reached to the shamayim (Bereshith 28:12): a way of
       light from beside the sleeper up past the clouds, and the mal'akim going up and coming down
       it (players with `climb`) — and the top of it is where the light of `glory` stands */
    THING.ladder=(g,p)=>{ const m=mats(), H=p.h||260, n=Math.floor(H/1.6), lean=p.lean||0.18;
      const rail=new T.MeshBasicMaterial({color:0xffe0a0,transparent:true,opacity:0.8,blending:T.AdditiveBlending,depthWrite:false,fog:false});
      g.userData.mat=rail;
      /* (leaning away from the eye, into the picture: -z) */
      for(const sd of [-1,1]){ const b=new T.Mesh(new T.BoxGeometry(0.16*S(),H*S(),0.16*S()),rail);
        b.position.set(sd*0.8*S(),H/2*S(),-H/2*lean*S()); b.rotation.x=-lean; g.add(b); }
      const im=new T.InstancedMesh(new T.BoxGeometry(1.6*S(),0.1*S(),0.1*S()),rail,n);
      const M4=new T.Matrix4(); for(let i=0;i<n;i++){ const y=i*1.6+0.6; M4.makeTranslation(0,y*S(),-y*lean*S()); im.setMatrixAt(i,M4); }
      im.frustumCulled=false; g.add(im); g.userData.top=[0,H,H*lean]; };
    THING.ladder.ease=(g,p,d)=>{ g.userData.mat.opacity=0.85*Math.max(0,Math.min(1,d.ladder||0)); g.visible=(d.ladder||0)>0.01; };
    /* A HOUSE'S COURT, walled, for the taught ones sitting together (Acts 2:1-2) where the city
       has none to hand */
    THING.court=(g,p)=>{ const m=mats(), w=p.w||12, d=p.d||10, h=p.h||2.6, plaster=new T.MeshLambertMaterial({color:0xe6dfcd});
      /* (its door in the wall toward the eye: +z is toward the eye, as every thing here is built) */
      blk(g,w,h,0.5,0,0,-d/2,plaster); blk(g,0.5,h,d,-w/2,0,0,plaster); blk(g,0.5,h,d,w/2,0,0,plaster);
      blk(g,w/2-1,h,0.5,-w/4-0.5,0,d/2,plaster); blk(g,w/2-1,h,0.5,w/4+0.5,0,d/2,plaster); blk(g,w,0.1,d,0,0,0,m.stone2); };

    /* ================= THE SIGNS =================
       Not things that stand on the ground but what comes upon it: the light, the fire, the waters,
       the rain, the bow in the cloud, and the city coming down. Each is built once when its dial
       first lifts off nothing, and follows its dial after. */
    const SIGN={};
    /* THE ESTEEM OF (YAHUAH) HWHY — light, and only light: a brightness standing in the air, and a
       shaft of it down to the ground beneath, which the world's own lamp lights the ground under */
    SIGN.glory=(g,p)=>{ const m=mats(), h=p.h||60, r=p.r||40;
      const sp=new T.Sprite(m.glow.clone()); sp.position.y=h*S(); sp.scale.set(r*S(),r*S(),1); g.add(sp); g.userData.sp=sp;
      /* (the shaft is three, one within another, so its light thins toward its edge and has none) */
      g.userData.sh=[1,0.7,0.42].map(k=>{ const sh=new T.Mesh(new T.CylinderGeometry((p.top||4)*k*S(),(p.foot||10)*k*S(),h*S(),28,1,true),m.shaft.clone());
        sh.position.y=h/2*S(); g.add(sh); return sh; });
      g.userData.lamp=[0,2,0,1.2]; };
    SIGN.glory.ease=(g,p,v)=>{ const s=performance.now()/1000; g.userData.sp.material.opacity=Math.min(1,v*(0.92+0.08*Math.sin(s*1.7)));
      for(const sh of g.userData.sh) sh.material.opacity=0.075*v*(p.shaft===false?0:1); g.userData.lamp[3]=1.3*v; };
    /* THE FIRE OF (YAHUAH) HWHY FELL (Malakim Aleph 18:38): a column of fire down out of the
       shamayim, and the fire on what it fell on */
    SIGN.fire=(g,p)=>{ const m=mats(), h=p.h||120;
      g.userData.col=[]; for(let i=0;i<9;i++){ const f=new T.Mesh(new T.BoxGeometry((0.9+(i%3)*0.4)*S(),h*S(),(0.9+(i%2)*0.5)*S()).translate(0,h/2*S(),0),m.flame.clone());
        f.position.set(Math.cos(i*2.1)*0.5*S(),0,Math.sin(i*2.1)*0.5*S()); g.add(f); g.userData.col.push(f); }
      g.userData.on=[]; for(let i=0;i<10;i++){ const f=new T.Mesh(new T.BoxGeometry(0.3*S(),1,0.3*S()).translate(0,0.5,0),m.flame);
        f.position.set(Math.cos(i*1.7)*0.6*S(),(p.y||1.2)*S(),Math.sin(i*1.7)*0.6*S()); g.add(f); g.userData.on.push(f); }
      const sp=new T.Sprite(m.ember.clone()); sp.position.y=(p.y||1.2)*S()+8; sp.scale.set(14*S(),14*S(),1); g.add(sp); g.userData.sp=sp;
      g.userData.lamp=[0,(p.y||1.2)+1,0,1]; };
    SIGN.fire.ease=(g,p,v)=>{ const s=performance.now()/1000, fall=Math.max(0,Math.min(1,v*2)), burn=Math.max(0,Math.min(1,v*2-0.6));
      g.userData.col.forEach((f,i)=>{ f.material.opacity=0.55*fall*(1-burn*0.85); f.scale.y=Math.max(0.01,fall); f.position.y=(1-fall)*(p.h||120)*S(); });
      g.userData.on.forEach((f,i)=>{ f.visible=burn>0.01; f.scale.y=Math.max(0.01,burn*(1.4+0.8*Math.sin(s*(8+i))+i%3*0.4)*S()); });
      g.userData.sp.material.opacity=Math.max(fall*0.5,burn); g.userData.lamp[3]=1.2*Math.max(fall,burn); };
    /* the windows of the shamayim opened (Bereshith 7:11): rain about the eye wherever it is */
    SIGN.rain=(g,p)=>{ const m=mats(), n=900, im=new T.InstancedMesh(new T.BoxGeometry(0.05*S(),1.4*S(),0.05*S()),m.rain.clone(),n);
      im.frustumCulled=false; g.add(im); g.userData.im=im; g.userData.drops=[];
      for(let i=0;i<n;i++) g.userData.drops.push([(Math.random()-0.5)*80,Math.random()*50,(Math.random()-0.5)*80]); g.userData.t0=performance.now(); };
    SIGN.rain.ease=(g,p,v)=>{ const u=g.userData, now=performance.now(), dt=Math.min(0.1,(now-u.t0)/1000); u.t0=now;
      const c=W.camera.position, s=S(), M4=new T.Matrix4();
      g.position.set(0,0,0);
      u.drops.forEach((q,i)=>{ q[1]-=dt*22; if(q[1]<-6){ q[1]+=50; q[0]=(Math.random()-0.5)*80; q[2]=(Math.random()-0.5)*80; }
        M4.makeTranslation(c.x+q[0]*s,c.y+(q[1]-14)*s,c.z+q[2]*s); u.im.setMatrixAt(i,M4); });
      u.im.instanceMatrix.needsUpdate=true; u.im.material.opacity=0.42*v; };
    SIGN.rain.world=true;
    /* AND THE WATERS INCREASED (Bereshith 7:17-19): the face of the flood, raised over the land
       about the scene by its dial, in metres over the ground the scene is played on */
    SIGN.flood=(g,p)=>{ const m=mats(), d=new T.Mesh(new T.CircleGeometry(5200,48),m.flood); d.rotation.x=-Math.PI/2; g.add(d); g.userData.d=d; };
    SIGN.flood.ease=(g,p,v)=>{ g.userData.d.position.y=(v*(p.depth||40)-(p.below||6))*S(); g.visible=v>0.002; };
    /* MY RAINBOW IN THE CLOUD (Bereshith 9:13): seven bands, far off over the land beyond */
    SIGN.bow=(g,p)=>{ const cols=[0xd9473a,0xe8893a,0xecd24a,0x5aa65a,0x3f7fc0,0x4a4aa8,0x7a4aa0], R=(p.r||420), tube=R*0.012;
      g.userData.ms=[];
      cols.forEach((c,i)=>{ const mt=new T.MeshBasicMaterial({color:c,transparent:true,opacity:0,depthWrite:false,fog:false});
        const tor=new T.Mesh(new T.TorusGeometry((R-i*tube*2)*S()/6.5*6.5,tube*S(),6,72,Math.PI),mt); g.add(tor); g.userData.ms.push(mt); });
      g.userData.y=-(p.sink||60); };
    SIGN.bow.ease=(g,p,v)=>{ for(const m of g.userData.ms) m.opacity=0.3*v; };
    /* THE SET-APART CITY, RENEWED YAHRUSHALAYIM, COMING DOWN OUT OF THE SHAMAYIM (Ḥazon 21:2,10-11):
       foursquare (21:16), her light like a jasper stone clear as crystal, twelve gates (21:12-13),
       three to a side — let down by her dial from high in the air to stand over the land */
    SIGN.city=(g,p)=>{ const L=(p.size||360)*S(), H=L*0.62;
      const wall=new T.MeshBasicMaterial({color:0xb8e0c4,transparent:true,opacity:0.32,blending:T.AdditiveBlending,depthWrite:false,fog:false});
      const core=new T.Mesh(new T.BoxGeometry(L,H,L),wall); core.position.y=H/2; g.add(core);
      const edge=new T.LineSegments(new T.EdgesGeometry(new T.BoxGeometry(L,H,L)),new T.LineBasicMaterial({color:0xffe6a0,transparent:true,opacity:0.9,fog:false}));
      edge.position.y=H/2; g.add(edge);
      g.userData.gates=[];
      for(let sd=0;sd<4;sd++) for(let k=-1;k<=1;k++){ const sp=new T.Sprite(mats().glow.clone()); const a=sd*Math.PI/2;
        const u=k*L/3.2, x=Math.cos(a)*L/2+Math.sin(a)*u, z=Math.sin(a)*L/2-Math.cos(a)*u;
        sp.position.set(x,H*0.12,z); sp.scale.set(L*0.16,L*0.16,1); g.add(sp); g.userData.gates.push(sp); }
      const halo=new T.Sprite(mats().glow.clone()); halo.position.y=H*0.5; halo.scale.set(L*2.6,L*2.6,1); g.add(halo);
      g.userData.parts=[wall,edge.material,halo.material].concat(g.userData.gates.map(s=>s.material)); g.userData.H=H; };
    SIGN.city.ease=(g,p,v)=>{ const e=v*v*(3-2*v); g.userData.y=(1-e)*(p.high||1600)*S()+(p.rest||-20)*S();
      const [w,ed,ha,...gs]=g.userData.parts; w.opacity=0.34*Math.min(1,v*3); ed.opacity=0.9*Math.min(1,v*3); ha.opacity=0.55*Math.min(1,v*2);
      for(const s of gs) s.opacity=Math.min(1,v*2); };

    /* ================= THE SET: THE GROUND MADE READY =================
       The voyage's own set builder (THE SET BUILDER, the one the city of the great king is raised
       by): the land's trees taken off the ground the scene is played on, level ground where an
       altar or a tomb is to stand, and real water where the Yardĕn is to run. Laid when the film
       begins and taken up again whole when it ends. The stage's frame is the set's when the film's
       `front` is a quarter-turn; otherwise each rectangle is laid by the square that holds it. */
    function setRect(r){ const s=S(), pts=[[r[0],r[1]],[r[2],r[1]],[r[0],r[3]],[r[2],r[3]]].map(([x,z])=>[fr.r[0]*x+fr.f[0]*z, fr.r[1]*x+fr.f[1]*z]);
      return [Math.min(...pts.map(p=>p[0])),Math.min(...pts.map(p=>p[1])),Math.max(...pts.map(p=>p[0])),Math.max(...pts.map(p=>p[1]))]; }
    function buildSet(st){ const k=K(); if(!k||!k.setBuilder) return;
      const base=gy(anchor.x,anchor.z);
      try{ api=k.setBuilder(anchor.x,anchor.z,base,{});
        if(st.clear){ const r=setRect(st.clear); api.clearTrees(r[0],r[1],r[2],r[3]); }
        for(const L of st.level||[]){ const r=setRect(L); api.pad(r[0],r[1],r[2],r[3],{top:L[4]||'grass',blend:L[5]==null?8:L[5],y:L[6]||0}); }
        for(const w of st.water||[]){ const r=setRect(w); api.water(r[0],r[1],r[2],r[3],{depth:w[4]||2,bed:'sand'}); }
        api.end();
        if(k.flushEdits) for(let n=0;n<60&&k.flushEdits(4000);n++){}
      }catch(e){ console.warn('STAGE: the set could not be laid — '+(e&&e.message||e)); } }

    /* ================= THE SCENE, RAISED AND TAKEN DOWN ================= */
    function begin(scene){
      sc=scene; setFrame(front); root=new T.Group(); root.name='unfold-stage'; W.scene.add(root);
      figs=[]; things=[];
      if(sc.set) buildSet(sc.set);
      let i=0;
      for(const c of sc.cast||[]){ const P=makeOne(c,i++); if(P){ root.add(P.h); figs.push(P); } }
      for(const cw of sc.crowds||[]){
        const n=cw.n||8, cols=Math.ceil(Math.sqrt(n*(Math.abs(cw.x1-cw.x0)+1)/(Math.abs(cw.z1-cw.z0)+1)));
        for(let j=0;j<n;j++){ const as=Array.isArray(cw.as)?cw.as[j%cw.as.length]:(cw.as==='mixed'?['man','woman','elder','man','youth','woman'][j%6]:(cw.as||'man'));
          const cx=j%cols, cz=Math.floor(j/cols), rows=Math.ceil(n/cols);
          const jx=((j*37)%11)/11-0.5, jz=((j*53)%13)/13-0.5;
          const x=cw.x0+(cw.x1-cw.x0)*((cx+0.5+jx*0.6)/cols), z=cw.z0+(cw.z1-cw.z0)*((cz+0.5+jz*0.6)/Math.max(1,rows));
          const c={id:(cw.id||'crowd')+j, as, x, z, y:cw.y?cw.y[0]+(cw.y[1]-cw.y[0])*(((j*29)%17)/17):0,
            pose:cw.pose, face:cw.face, on:cw.on, poses:cw.poses, seed:(cw.seed||11)+j*5, robe:cw.robe, cloth:cw.cloth,
            tongue:cw.tongue, bob:cw.y?1:0};
          const P=makeOne(c,i++); if(P){ root.add(P.h); figs.push(P); } } }
      for(const hd of sc.herds||[]){ const k=K(); if(!k||!k.makeAnimal) break;
        for(let j=0;j<(hd.n||1);j++){ let m=null; try{ m=k.makeAnimal(hd.kind); }catch(e){} if(!m) continue;
          const x=hd.x!=null&&hd.n<=1?hd.x:hd.x0+(hd.x1-hd.x0)*(((j*37)%19)/19), z=hd.z!=null&&hd.n<=1?hd.z:hd.z0+(hd.z1-hd.z0)*(((j*53)%17)/17);
          const g=new T.Group(); g.add(m); root.add(g);
          things.push({beast:true,g,p:Object.assign({},hd,{x,z,turn:hd.turn!=null?hd.turn:((j*0.37)%1)})}); } }
      for(const p of sc.props||[]){ const g=new T.Group(); try{ (THING[p.k]||(()=>{}))(g,p); }catch(e){ console.warn('STAGE: a '+p.k+' could not be made — '+(e&&e.message||e)); }
        root.add(g); things.push({g,p,ease:THING[p.k]&&THING[p.k].ease}); }
      lit=null;
    }
    function drop(){
      if(root){ W.scene.remove(root); root.traverse(o=>{ if(o.geometry&&!o.isSprite) o.geometry.dispose(); }); root=null; }
      if(api){ try{ api.drop(); const k=K(); if(k.flushEdits) for(let n=0;n<60&&k.flushEdits(4000);n++){} }catch(e){} api=null; }
      if(lit&&K()&&K().lamp) K().lamp(0,-1e7,0,0); lit=null;
      figs=[]; things=[]; sc=null; signs={};
    }
    let signs={};
    /* a thing stood on the stage: built facing +z, it faces the eye, with its +x to the right of
       the picture (`turn` swings it, in turns) */
    function stand(g,x,z,turn,y){ const [X,Z]=wpt(x,z); g.position.set(X,gy(X,Z)+(y||0)*S(),Z); g.rotation.y=fr.yaw+Math.PI+(turn||0)*TAU; return [X,Z]; }
    function tick(d,tt){
      if(!sc||!root) return;
      const k=K(), cam=W.camera.position, lamps=[];
      /* ---- the things ---- */
      for(const th of things){ const p=th.p, on=onAt(p,tt); th.g.visible=on; if(!on) continue;
        if(!th.placed||p.float){ const [X,Z]=stand(th.g,p.x||0,p.z||0,p.turn,p.y); th.placed=true; th.gy=th.g.position.y;
          if(p.float&&signs.flood){ const wy=signs.flood.g.position.y+signs.flood.g.userData.d.position.y; th.g.position.y=Math.max(th.gy,wy-(p.draft||4)*S()); } }
        if(th.ease) try{ th.ease(th.g,p,d,tt); }catch(e){}
        const L=th.g.userData.lamp; if(L) lamps.push([th.g.position.x+L[0],th.g.position.y+L[1]*S(),th.g.position.z+L[2],L[3]]); }
      /* ---- the signs ---- */
      for(const name in SIGN){ const v=+d[name]||0, spec=(sc.signs||{})[name];
        if(v>0.004&&!signs[name]&&(spec||SIGN[name].world)){ const g=new T.Group(); try{ SIGN[name](g,spec||{}); }catch(e){ g.userData.broken=true; }
          g.userData.noShadow=true; root.add(g); signs[name]={g,spec:spec||{}}; }
        const s=signs[name]; if(!s) continue;
        s.g.visible=v>0.004; if(!s.g.visible||s.g.userData.broken) continue;
        if(!SIGN[name].world){
          let x=s.spec.x||0, z=s.spec.z!=null?s.spec.z:(s.spec.dist||0);
          if(s.spec.on){ const P=figs.find(f=>f.id===s.spec.on); if(P){ const q=keyAt(P.c,tt); x=q.x; z=q.z; } }
          const [X,Z]=wpt(x,z); s.g.position.set(X,(s.spec.abs!=null?gy(anchor.x,anchor.z)+s.spec.abs*S():gy(X,Z))+(s.g.userData.y||0),Z);
          s.g.rotation.y=fr.yaw; }
        try{ SIGN[name].ease(s.g,s.spec,v); }catch(e){}
        if(!SIGN[name].world&&(s.g.userData.y!==undefined)) s.g.position.y+=0;
        const L=s.g.userData.lamp; if(L&&L[3]>0.01) lamps.push([s.g.position.x+L[0],s.g.position.y+L[1]*S(),s.g.position.z+L[2],L[3]]); }
      /* ---- the players ---- */
      const byId={}; for(const P of figs) if(P.id) byId[P.id]=P;
      for(const P of figs){ const c=P.c, on=onAt(c,tt); P.h.visible=on; if(!on) continue;
        let q=keyAt(c,tt), x=q.x, z=q.z, y=q.y;
        /* the mal'akim going up and coming down on the ladder (Bereshith 28:12) */
        if(c.climb){ const lad=things.find(t=>t.p.k==='ladder'); if(lad){ const tp=lad.g.userData.top||[0,200,30];
          let u=((tt/(c.climb.period||28))+(c.climb.phase||0))%1; if(c.climb.dir<0) u=1-u;
          x=(lad.p.x||0)+(c.climb.side||0); z=(lad.p.z||0)+tp[2]*u+0.6; y=tp[1]*u;
          q={x,z,y,pose:'stand',face:c.climb.dir<0?0:0.5}; } }
        if(c.poses) for(const [pt,pn] of c.poses) if(tt>=pt) q.pose=pn;
        const [X,Z]=wpt(x,z);
        P.h.position.set(X,gy(X,Z)+y*S()+(c.bob?Math.sin(tt*0.9+P.ph)*0.4*S():0),Z);
        /* which way he faces */
        let dir=null; const fc=q.face;
        if(q.moving&&q.to){ const [X2,Z2]=wpt(q.to[0],q.to[1]); dir=[X2-X,Z2-Z]; }
        else if(fc==='eye') dir=[cam.x-X,cam.z-Z];
        else if(typeof fc==='string'&&byId[fc]) dir=[byId[fc].h.position.x-X,byId[fc].h.position.z-Z];
        else if(Array.isArray(fc)){ const [X2,Z2]=wpt(fc[0],fc[1]); dir=[X2-X,Z2-Z]; }
        else if(typeof fc==='number') dir=dirOf(fc);
        if(dir&&Math.hypot(dir[0],dir[1])>1e-3) P.h.rotation.y=Math.atan2(dir[0],dir[1]);
        P.walk=(P.walk||0)+(q.moving?0.16:0);
        pose(P,q.pose,P.walk);
        /* the tongues as of fire, settled on each one of them (Acts 2:3) */
        if(c.tongue){ if(!P.tongue){ const f=new T.Mesh(new T.BoxGeometry(0.9,2.4,0.9).translate(0,1.2,0),mats().flame); const sp=new T.Sprite(mats().ember.clone()); sp.scale.set(7,7,1); sp.position.y=1.4;
            const g=new T.Group(); g.add(f); g.add(sp); g.position.y=14.2; P.fig.add(g); P.tongue=g; }
          const v=Math.max(0,Math.min(1,d.tongues||0)); P.tongue.visible=v>0.01; P.tongue.scale.setScalar(Math.max(0.01,v*(0.9+0.15*Math.sin(tt*9+P.ph)))); }
        if(P.malak){ lamps.push([P.h.position.x,P.h.position.y+8,P.h.position.z,0.55]);
          const hl=P.fig.userData.halo; if(hl) hl.material.opacity=0.55+0.15*Math.sin(tt*1.3+P.ph); }
      }
      /* ---- the beasts stand where they are set, and turn as they are told ---- */
      for(const th of things) if(th.beast){ const p=th.p, on=onAt(p,tt); th.g.visible=on; if(on&&!th.placed){ stand(th.g,p.x,p.z,p.turn); th.placed=true; } }
      /* ---- THE ONE LAMP OF THE WORLD goes to the brightest light the scene has ---- */
      if(k&&k.lamp){ lamps.sort((a,b)=>b[3]-a[3]); const L=lamps[0];
        if(L&&L[3]>0.02){ k.lamp(L[0],L[1],L[2],Math.min(1.4,L[3]),110); lit=true; } else if(lit){ k.lamp(0,-1e7,0,0); lit=null; } }
      /* ---- AND HIS FACE IS GUARDED FROM THE EYE ----
         Whatever a key asks of the eye, it is never let within GUARD metres of His head: it is held
         back along its own line, still looking where it looked. */
      for(const P of figs){ if(!P.holy||!P.h.visible) continue;
        const hp=headOf(P), dx=cam.x-hp.x, dy=cam.y-hp.y, dz=cam.z-hp.z, dd=Math.hypot(dx,dy,dz), g=GUARD*S();
        if(dd<g&&dd>1e-3){ const s=g/dd; W.camera.position.set(hp.x+dx*s,hp.y+dy*s,hp.z+dz*s); } }
    }
    const _v=new T.Vector3();
    function headOf(P){ const hd=P.fig.userData.head; if(hd){ hd.getWorldPosition(_v); return {x:_v.x,y:_v.y,z:_v.z}; }
      return {x:P.h.position.x,y:P.h.position.y+10*S()/6.5,z:P.h.position.z}; }
    /* is a face blank — the front of the head one colour from edge to edge, nothing drawn on it */
    function blankFace(P){ const hd=P.fig.userData.head; if(!hd) return false;
      const mt=Array.isArray(hd.material)?hd.material[4]:hd.material; if(!mt) return false;
      const img=mt.map&&mt.map.image; if(!img) return true;            /* no picture on it at all */
      try{ const cv=document.createElement('canvas'); cv.width=img.width; cv.height=img.height; const g=cv.getContext('2d'); g.drawImage(img,0,0);
        const px=g.getImageData(0,0,cv.width,cv.height).data; for(let i=4;i<px.length;i+=4) if(Math.abs(px[i]-px[0])+Math.abs(px[i+1]-px[1])+Math.abs(px[i+2]-px[2])>6) return false;
        return true; }catch(e){ return false; } }
    function faceRule(){ const out=[]; const cam=W.camera.position;
      for(const P of figs){ if(!P.holy) continue; const hp=headOf(P);
        out.push({id:P.id||P.c.as, shown:P.h.visible, blank:blankFace(P), metres:+(Math.hypot(cam.x-hp.x,cam.y-hp.y,cam.z-hp.z)/S()).toFixed(1)}); }
      return {holy:out, ok:out.every(o=>!o.shown||(o.blank&&o.metres>=GUARD-0.05))}; }
    function list(){ return figs.map(P=>({id:P.id,as:P.c.as,shown:P.h.visible,x:+P.h.position.x.toFixed(1),y:+P.h.position.y.toFixed(1),z:+P.h.position.z.toFixed(1)})); }
    return {begin,drop,tick,wpt,faceRule,list};
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
    /* (a film with a `front` counts its turns from there; ox/oz move the point it turns about) */
    const a=(d.ca+front)*Math.PI*2;
    let cx=anchor.x, cz=anchor.z;
    if(d.ox||d.oz){ const p=cast3.wpt(d.ox,d.oz); cx=p[0]; cz=p[1]; }
    const ex=cx+Math.sin(a)*d.cd, ez=cz+Math.cos(a)*d.cd;
    const sunk=SINK*(1-lf), g0=Math.max(0,groundY(cx,cz)-W.WATER_Y)*lf, ly=d.cl+g0;
    let ey=Math.max(d.cy+g0,Math.max(W.WATER_Y,groundAt(ex,ez)-sunk)+W.B*1.5);
    { const gm=Math.max(W.WATER_Y,groundAt((ex+cx)/2,(ez+cz)/2)-sunk)+W.B; if((ey+ly)/2<gm) ey=2*gm-ly; }
    /* the earth quaking (Mattithyahu 28:2): the eye is shaken, nothing else is */
    let sx=0, sy=0;
    if(d.shake>0.004){ const s=performance.now()/1000; sx=Math.sin(s*31)*Math.sin(s*7.3)*d.shake*2.2; sy=Math.sin(s*23.7)*d.shake*1.4; }
    W.camera.position.set(ex+sx,ey+sy,ez);
    W.camera.lookAt(cx+sx*0.5,ly,cz);
    if(Math.abs(W.camera.fov-d.cfov)>0.01){ W.camera.fov=d.cfov; W.camera.updateProjectionMatrix(); }
    cast3.tick(d,t);            /* the players and the things, and His face guarded from the eye */
  }

  function tick(dt){
    if(!playing||!track) return;
    if(!waiting) t+=dt;
    const end=dur();
    apply(at(Math.min(t,end)));
    if(t>=end&&!waiting){ playing=false; const f=onDone; onDone=null; if(f) f(); }
  }
  window.__STAGE_TICK=tick;

  return {play,stop,tick,seek,elapsed,dur,at,anchorAt:a=>{anchor=a;},
    isPlaying:()=>playing, give, wait, waiting:()=>waiting,
    /* THE FACE RULE, ASKED: every holy figure on the stage this frame, whether its face is blank
       to the last pixel, and how near the eye stands to it — for the probe that plays every film */
    faceRule:()=>cast3.faceRule(), players:()=>cast3.list()};
})();
