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
     man     0..1  and no man either, until the sixth day
     fogN/fogF     how far the eye reaches

   THE EYE, on the same track:
     cd  how far the eye stands from the anchor
     cy  how high above the water
     ca  swung round the anchor, in turns (0..1 is the whole circle)
     cl  how high it looks
     cfov the lens
   Everything between two keys is eased, so nothing ever snaps — unless the
   key says cut:true, and then it simply IS there.                          */
window.STAGE=(function(){
  const W=window.__WORLD;
  const T=window.__WORLD.THREE;
  let track=null, t=0, playing=false, anchor={x:0,z:0}, onDone=null;
  let held=null;          /* what the world looked like before we borrowed it */

  const DEFAULT={ dark:0, light:1, sky:null, sun:1, moon:1, stars:1, firm:0,
    land:1, sea:1, clouds:1, lifeSea:1, lifeAir:1, lifeLand:1, ship:0, man:0,
    fogN:null, fogF:null,
    cd:120, cy:40, ca:0, cl:10, cfov:62, cut:false };

  function lerp(a,b,u){ return a+(b-a)*u; }
  function smooth(u){ return u*u*(3-2*u); }

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
      if(typeof a==='number'&&typeof b==='number') out[k]=lerp(a,b,u);
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
      voidWall:W.voidWall.visible, cloudOp:W.cloudMat.opacity };
  }
  function give(){
    if(!held) return;
    W.chunkRoot.position.y=held.chunkY;
    W.camera.fov=held.fov; W.camera.updateProjectionMatrix();
    if(W.scene.fog){ W.scene.fog.near=held.fogN; W.scene.fog.far=held.fogF; }
    W.voidWall.visible=held.voidWall;
    W.cloudMat.opacity=held.cloudOp;
    W.boatG.visible=held.ship; W.walkerG.visible=held.man;
    W.chunkRoot.visible=true;
    held=null;
  }

  const _c=new T.Color();
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
    /* THE COARSE CARPET IS NEVER IN A SCENE. It is the engine's stand-in
       for the world BEYOND the streamed chunks, drawn only when the eye is
       high above the earth or drawn far back off it — seen from a shore it
       is a handful of enormous flat planes lying across the whole view,
       which is exactly how it looked when the dry land first rose. Down
       here it is blocks and haze and nothing else, as the voyage's own
       rule has it. */
    if(W.farLand){ W.farLand.visible=false;
      if(W.farLandMat) W.farLandMat.opacity=0; }
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
    /* ---- the waters above ---- */
    W.cloudMat.opacity=d.clouds*0.85;
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
    W.walkerG.visible=d.man>0.5;
    /* ---- how far the eye reaches ---- */
    if(sc.fog){ if(d.fogN!==null&&d.fogN!==undefined) sc.fog.near=d.fogN;
      if(d.fogF!==null&&d.fogF!==undefined) sc.fog.far=d.fogF; }
    W.voidWall.visible=false;     /* no wall of night stands across a making world */
    /* ---- and the eye itself ---- */
    const a=d.ca*Math.PI*2;
    W.camera.position.set(anchor.x+Math.sin(a)*d.cd, d.cy, anchor.z+Math.cos(a)*d.cd);
    W.camera.lookAt(anchor.x,d.cl,anchor.z);
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
