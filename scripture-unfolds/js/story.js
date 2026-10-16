/* ================= THE STORY =================
   A scroll is a list of scenes; a scene is a stage track (what the world
   does) married to a caption track (what the scripture says while it does
   it). The captions are not written here — they are FETCHED from the
   Besorah by book, chapter and verse as the scene runs, so the scripture
   is quite literally the director: change the scroll and the scene changes
   with it.

   A scene is declared like this:

     STORY.scene({
       id:'creation',
       name:'THE CREATION',
       book:'bereshith',            the scroll it is drawn from
       anchor:'coast',              where the eye is set: 'coast' | 'sea' | 'here'
       stage:[ … ],                 the world's own track (see stage.js)
       caps:[ {t,to,q:['bereshith',1,3]} … ],   or {t,to,text,ref}
       titles:[ {t,to,text} ],
       fades:[ {t,to,hold} ],
       next:'eden'                  what follows when it is done
     });

   THE WATCHER MAY ALWAYS LEAVE: ESC or SPACE ends any scene at once and
   gives the world back — a film nobody can walk out of is a trap.        */
window.STORY=(function(){
  const D=document, $=id=>D.getElementById(id);
  const SCENES={}, ORDER=[];
  let cur=null, capIdx=-1, titleIdx=-1, cardIdx=-1, moodNow=null, blocked=false;

  function scene(s){ SCENES[s.id]=s; ORDER.push(s.id); }
  function get(id){ return SCENES[id]; }
  function list(){ return ORDER.map(id=>SCENES[id]); }

  /* ---- the words of a caption, taken from the scroll ---- */
  function capText(c){
    if(c.text!==undefined) return {text:c.text, ref:c.ref||''};
    if(c.q){ const q=BESORAH.quote.apply(null,c.q); return {text:q.text, ref:q.ref}; }
    return {text:'',ref:''};
  }

  /* ---- NOTHING TOUCHES THE WORLD WHILE A SCENE RUNS ----
     The engine is left running (so the sea moves and the light lives), which
     means its own keys and its own pointer are still listening. They are
     stopped at the capture phase for as long as a scene is on screen. */
  function keyGuard(e){
    if(!cur) return;
    /* ESC leaves; SPACE, ENTER and the arrow onward pass to what comes next (in the whole Bible,
       the next scroll — played alone, the same as leaving) */
    if(e.code==='Escape'||e.code==='Space'||e.code==='Enter'||e.code==='ArrowRight'){
      e.preventDefault(); e.stopPropagation(); skip(e.code); return; }
    if(e.code==='KeyM'&&window.VOICES){ e.preventDefault(); e.stopPropagation(); VOICES.toggle(); return; }
    e.stopPropagation();
  }
  function eatGuard(e){ if(cur){ e.stopPropagation(); } }
  function guards(on){
    if(on===blocked) return; blocked=on;
    const m=on?'addEventListener':'removeEventListener';
    D[m]('keydown',keyGuard,true); D[m]('keyup',eatGuard,true);
    for(const ev of ['pointerdown','pointerup','pointermove','wheel','contextmenu'])
      D[m](ev,eatGuard,true);
  }

  function show(el,on){ if(el) el.classList.toggle('on',!!on); }

  /* ---- WHERE THE EYE IS SET ----
       'here'  wherever the traveller stands
       'sea'   the open water the voyage itself opens on
       'coast' A SHORE. The creation needs this one: 'let the dry land
               appear' is the whole third day, and anchored out on open
               water the land rose faithfully — a hundred miles behind the
               camera, out of frame, where nobody saw it. The nearest
               coast to the opening is found once and the scene is set
               there, so the earth comes up in the middle of the shot. */
  /* ---- OR A PLACE OF THE TRUE EARTH, WHERE THE ACCOUNT HAPPENED ----
     A film of an event is staged where the event was: `anchor` is then an object naming it.
       {ll:[lat,lon]}  {town:'Bĕyth Leḥem'}  {landmark:'Mount Ararat'}  {yahru:'golgothaTrue'}
     with `off:[east,north]` in metres from there, and `seek` to settle on the ground the scene
     needs within `r` metres: 'dry' (the nearest dry ground), 'high' (the highest — a summit, a
     brow), 'flat' (the most level dry ground). `front` is the bearing the eye's first station
     stands at, in turns; or `away:[lat,lon]` — the eye stands on that side and looks away from it
     (Moriyah is staged looking away from the city that was not yet built), `toward:[lat,lon]` —
     it looks toward it. `snap` lays it on a quarter-turn, so a set laid square with the world is
     square with the picture. Found once, and kept. */
  const _places={};
  function placeOf(spec){
    const key=JSON.stringify(spec); if(_places[key]) return _places[key];
    const W=window.__WORLD, K=window.__KIT, S=(K&&K.setScale)||6.5;
    let x=null, z=null, lon=null;
    const ll=(la,lo)=>{ const p=K.llToWorld(la,lo); x=p[0]; z=p[1]; lon=lo; };
    if(spec.x!=null&&spec.z!=null){ x=spec.x; z=spec.z; }      /* (a point of the world itself: where a scroll lies) */
    else if(spec.ll) ll(spec.ll[0],spec.ll[1]);
    else if(spec.town){ const t=((window.EARTH&&EARTH.townList)||[]).find(q=>q.n===spec.town); if(t) ll(t.lat,t.lon); }
    else if(spec.landmark){ const L=(K.landmarks?K.landmarks():[]).find(q=>q.n===spec.landmark); if(L) ll(L.lat,L.lon); }
    else if(spec.yahru){ const m=(K.yahruAs?K.yahruAs(spec.period||'herodes'):null)||(K.yahruMarks?K.yahruMarks():{}), p=K.yahruPos&&K.yahruPos();
      const mk=m&&m[spec.yahru]; if(p&&mk){ x=p.x+mk[0]*S; z=p.z+mk[1]*S; lon=Math.atan2(x,z)*180/Math.PI; } }
    if(x===null){ console.warn('STORY: no such place — '+key+'; the coast is taken'); return anchorFor('coast'); }
    if(spec.off){ const a=Math.atan2(x,z), e=spec.off[0]*S, n=spec.off[1]*S;
      x+=e*Math.cos(a)-n*Math.sin(a); z+=-e*Math.sin(a)-n*Math.cos(a); }
    const dry=(X,Z)=>!!W.landAtWorld(X,Z), hAt=(X,Z)=>{ const c=W.landAtWorld(X,Z); return c?c.h:-1e9; };
    const R=(spec.r||300)*S, step=Math.max(W.B*2,R/24);
    /* the nearest dry ground, out to `far` metres: an island the earth's soundings have lost (Patmos
       is twelve kilometres long, and may be all sea at their grain) gives way to the nearest land */
    const findDry=maxR=>{ let best=null;
      for(let r=step;r<=maxR&&!best;r+=Math.max(step,r*0.04)) for(let k=0;k<36;k++){ const a=k/36*Math.PI*2, X=x+Math.cos(a)*r, Z=z+Math.sin(a)*r;
        if(dry(X,Z)&&dry(X+W.B*3,Z)&&dry(X-W.B*3,Z)&&dry(X,Z+W.B*3)&&dry(X,Z-W.B*3)){ best=[X,Z]; break; } }
      if(best){ x=best[0]; z=best[1]; } };
    if(spec.seek==='dry'&&!dry(x,z)) findDry(Math.max(R,(spec.far||3000)*S));
    else if(spec.seek==='high'){ let best=[x,z], bh=hAt(x,z);
      for(let i=-24;i<=24;i++) for(let j=-24;j<=24;j++){ if(i*i+j*j>576) continue; const X=x+i*step, Z=z+j*step, h=hAt(X,Z); if(h>bh){ bh=h; best=[X,Z]; } }
      x=best[0]; z=best[1]; }
    else if(spec.seek==='flat'){ let best=null, bs=1e9;
      for(let i=-12;i<=12;i++) for(let j=-12;j<=12;j++){ if(i*i+j*j>144) continue; const X=x+i*step/2, Z=z+j*step/2; if(!dry(X,Z)) continue;
        let lo=1e9, hi=-1e9, ok=true; for(let u=-3;u<=3;u++) for(let v=-3;v<=3;v++){ const c=W.landAtWorld(X+u*W.B*2,Z+v*W.B*2); if(!c){ ok=false; break; } lo=Math.min(lo,c.h); hi=Math.max(hi,c.h); }
        if(!ok) continue; const sc=(hi-lo)+Math.hypot(i,j)*0.08; if(sc<bs){ bs=sc; best=[X,Z]; } }
      if(best){ x=best[0]; z=best[1]; } }
    if(spec.seek&&!dry(x,z)) findDry((spec.far||30000)*S);
    let front=spec.front!=null?spec.front:0;
    const aim=spec.away||spec.toward;
    if(aim){ const p=K.llToWorld(aim[0],aim[1]); let a=Math.atan2(p[0]-x,p[1]-z)/(Math.PI*2); if(spec.toward) a+=0.5; front=((a%1)+1)%1; }
    if(spec.snap) front=Math.round(front*4)/4;
    return _places[key]={x,z,front,place:true};
  }
  let _coast=null;
  function anchorFor(kind){
    const W=window.__WORLD;
    if(kind&&typeof kind==='object') return placeOf(kind);
    if(kind==='here'){ const p=W.state.boat; return {x:p.x,z:p.z}; }
    const st=W.findStart();
    if(kind!=='coast') return {x:st[0],z:st[1]};
    if(_coast) return _coast;
    /* a widening ring-search out from the opening for the nearest dry ground */
    let best=null, bd=1e12, r0=0;
    for(let r=200;r<=9000&&!best;r+=200){
      for(let k=0;k<48;k++){
        const a=k/48*Math.PI*2, x=st[0]+Math.cos(a)*r, z=st[1]+Math.sin(a)*r;
        if(!W.landAtWorld(x,z)) continue;
        const d2=(x-st[0])**2+(z-st[1])**2;
        if(d2<bd){ bd=d2; best={x,z,a}; }
      }
      if(best) break;
      r0=r;
    }
    /* AT THE TRUE MEASURE THE SHIP OPENS KILOMETRES OUT, off Yapho, and nine thousand units never
       reached the shore: every scroll was staged on open water, and the third day's dry land rose
       out of sight behind the eye. So there the shore is found by rays cast out from the opening —
       each walked out to the first dry ground and back to the water's edge — and of those shores
       the nearest WILD one is taken: Yapho's own beach is ploughed and walled, and the dry land of
       the third day must not come up with fields on it before there was a man to till the ground
       (Bereshith 2:5). The eye is set a little way up the beach, so a man set there stands on it. */
    if(W.trueEarth&&W.wildAt&&!(best&&W.wildAt(best.x,best.z,1200))){
      const N=360, shore=[];
      for(let k=0;k<N;k++){ const a=k/N*Math.PI*2, c=Math.cos(a), s=Math.sin(a);
        let r0=0, hit=0;
        for(let r=400;r<=90000;r+=400){ if(W.landAtWorld(st[0]+c*r,st[1]+s*r)){ hit=r; break; } r0=r; }
        if(!hit) continue;
        let lo=r0, hi=hit;
        for(let i=0;i<14;i++){ const m=(lo+hi)/2; if(W.landAtWorld(st[0]+c*m,st[1]+s*m)) hi=m; else lo=m; }
        shore.push({r:hi,c,s}); }
      shore.sort((p,q)=>p.r-q.r);
      const p=shore.find(q=>W.wildAt(st[0]+q.c*q.r,st[1]+q.s*q.r,1200))||shore[0];
      if(p){ let r=p.r; for(let k=0;k<6&&W.landAtWorld(st[0]+p.c*(r+30),st[1]+p.s*(r+30));k++) r+=30;
        best={x:st[0]+p.c*r,z:st[1]+p.s*r}; }
    }
    _coast=best?{x:best.x,z:best.z}:{x:st[0],z:st[1]};
    return _coast;
  }

  /* ---- WHICH SCROLLS A SCENE READS, read off the scene ----
     Not declared, DERIVED. A scene names its own book, but a caption track
     may quote another and often should: the garden is told by BERĔSHITH and
     then taken up by ADAM AND HAWWAH 1, because that is the order the two
     accounts happened in. Every `q` is a book, so every book a scene needs
     is already written in its captions and nothing has to be kept in step by
     hand. The engine knows no scene's scrolls by name. */
  function booksOf(s){
    const set={}; if(s.book) set[s.book]=1;
    for(const c of s.caps||[]) if(c.q&&c.q[0]) set[c.q[0]]=1;
    return Object.keys(set);
  }

  /* A SCROLL IS UNROLLED BEFORE IT IS READ. The books are fetched one at a
     time (see js/besorah.js) so a phone is not asked to parse two megabytes
     of scripture to reach a shelf, which means `play` can no longer be
     instantaneous. It answers a promise: true when the scene ran, false when
     the scroll could not be opened — and a caller that ignores it is no
     worse off than before. */
  function play(id){
    const s=SCENES[id]; if(!s){ console.warn('STORY: no scene',id); return Promise.resolve(false); }
    return playScene(s);
  }
  /* a scene that is not on the shelf at all — a card of the whole Bible, made as it is played */
  function playScene(s){
    const want=booksOf(s).filter(b=>!BESORAH.loaded(b));
    if(!want.length){ begin(s); return Promise.resolve(true); }
    return Promise.all(want.map(b=>BESORAH.open(b)))
      .then(()=>{ begin(s); return true; })
      .catch(e=>{ console.warn('STORY: '+(e&&e.message||e)); return false; });
  }

  /* ---- THE TRAVELLER IS STOOD WHERE THE SCENE IS SET ----
     The ground is streamed about him, so a film staged at Bĕyth Leḥem with the traveller left
     on the coast of the creation would play over open air. He is set down at the scene's anchor,
     out of sight, and the ground about it laid at once (a narrower ring than his own, so the
     laying is short; the world widens it again a little at a time while the film plays). */
  let _at=null;
  function standAt(a){
    const W=window.__WORLD; if(!a) return;
    if(_at&&Math.hypot(_at.x-a.x,_at.z-a.z)<200) return;
    W.state.boat.x=a.x; W.state.boat.z=a.z; W.state.boat.speed=0;
    try{ W.updateChunks(a.x,a.z,9999,13); }catch(e){}
    _at={x:a.x,z:a.z};
  }

  function begin(s){
    if(cur) end(true);
    cur=s; capIdx=-1; titleIdx=-1; cardIdx=-1; moodNow=null;
    $('sc-cine').classList.add('on');
    D.body.classList.add('in-scene');
    guards(true);
    let anch=anchorFor(s.anchor);
    standAt(anch);
    STAGE.play(s.stage,anch,()=>done(),s);
    /* the soft piano under the film (js/music.js), in the mood the film names */
    if(window.VOICES) VOICES.mood(s.music||'holy');
    $('sc-skip').classList.add('on');
    tickCaps(0);
    return true;
  }

  function done(){
    const nx=cur&&cur.next, was=cur;
    end(false);
    if(nx&&SCENES[nx]) play(nx); else if(window.__STORY_DONE) window.__STORY_DONE(was);
  }
  function skip(code){ const s=cur; end(false); if(window.__STORY_SKIPPED) window.__STORY_SKIPPED(s,code); }
  function end(quiet){
    if(!cur) return;
    cur=null; guards(false);
    if(window.VOICES) VOICES.stop();
    STAGE.stop();
    show($('sc-cap'),false); show($('sc-title'),false); show($('sc-card'),false);
    $('sc-cine').classList.remove('on');
    $('sc-fade').style.opacity=0;
    $('sc-skip').classList.remove('on');
    D.body.classList.remove('in-scene');
  }

  /* the caption, the title and the fades, all read off the same clock the
     stage is keeping — so the words and the world can never drift apart */
  function tickCaps(){
    if(!cur) return;
    const t=STAGE.elapsed();
    /* ---- captions ---- */
    const cl=cur.caps||[];
    let want=-1;
    for(let i=0;i<cl.length;i++) if(t>=cl[i].t&&t<cl[i].to){ want=i; break; }
    if(want!==capIdx){
      capIdx=want;
      const el=$('sc-cap');
      if(want<0){ show(el,false); if(window.VOICES) VOICES.stop(); }
      else{ const q=capText(cl[want]);
        $('sc-cap-t').textContent=q.text;
        $('sc-cap-r').textContent=q.ref;
        show(el,true);
        /* AND THE VERSE IS READ, where Scripture-Game recorded it (js/voices.js) */
        if(window.VOICES) VOICES.say(voiceKey(cl[want])); }
    }
    /* ---- THE CAPTION IS HELD UNTIL ITS VOICE IS DONE ----
       A verse whose reading runs past its written time keeps the screen: the film's clock stands
       a moment short of the caption's end until the voice falls silent, and then goes on. A verse
       with no recording is held for its written time and no longer. */
    if(window.VOICES&&want>=0){
      const c=cl[want], speaking=VOICES.speaking();
      if(speaking&&t>=c.to-0.2&&!STAGE.waiting()) STAGE.wait(true);
      else if(!speaking&&STAGE.waiting()) STAGE.wait(false);
    } else if(STAGE.waiting()) STAGE.wait(false);
    /* ---- titles ---- */
    const tl=cur.titles||[];
    let tw=-1;
    for(let i=0;i<tl.length;i++) if(t>=tl[i].t&&t<tl[i].to){ tw=i; break; }
    if(tw!==titleIdx){
      titleIdx=tw; const el=$('sc-title');
      if(tw<0) show(el,false);
      else{ el.textContent=tl[tw].text; show(el,true); }
    }
    /* ---- the music changes with the movement of the film (`musicAt`: [[t, mood]]) ---- */
    if(window.VOICES){ let m=cur.music||'holy'; for(const mm of cur.musicAt||[]) if(t>=mm[0]) m=mm[1];
      if(m!==moodNow){ moodNow=m; VOICES.mood(m); } }
    /* ---- the cards of the whole Bible: the age, and where a missing scroll is to be had. They
       are the game's own words and never scripture, so they are set in their own place and their
       own letter, and never in the caption, which carries nothing but the Besorah ---- */
    const kl=cur.cards||[];
    let kw=-1;
    for(let i=0;i<kl.length;i++) if(t>=kl[i].t&&t<kl[i].to){ kw=i; break; }
    if(kw!==cardIdx){
      cardIdx=kw; const el=$('sc-card');
      if(el){ if(kw<0) show(el,false); else{ el.textContent=kl[kw].text; show(el,true); } }
    }
    /* ---- the fades that cut a long passage into movements ---- */
    let op=0;
    for(const f of (cur.fades||[])){
      if(t<f.t||t>f.to) continue;
      const hold=f.hold||0, inT=(f.to-f.t-hold)/2;
      if(t<f.t+inT) op=Math.max(op,(t-f.t)/Math.max(0.001,inT));
      else if(t<f.t+inT+hold) op=1;
      else op=Math.max(op,1-(t-f.t-inT-hold)/Math.max(0.001,inT));
    }
    $('sc-fade').style.opacity=op.toFixed(3);
  }

  /* the name a caption's recordings are filed under (tools/import-voices.js): the verses it reads,
     "book ch:v[-v]" — or, for the card of a scroll, the scroll's own name */
  function voiceKey(c){
    if(c.voice) return c.voice;
    if(c.q) return c.q[0]+' '+c.q[1]+':'+c.q[2]+(c.q[3]!==undefined&&c.q[3]!==c.q[2]?'-'+c.q[3]:'');
    return null; }

  /* driven off the stage's own tick, so one clock rules the whole scene */
  const _st=window.__STAGE_TICK;
  window.__STAGE_TICK=function(dt){ _st(dt); tickCaps(); };

  return {scene,get,list,play,playScene,skip,end,anchorFor,booksOf,capText,voiceKey,
          standAt, here:a=>{ _at=a?{x:a.x,z:a.z}:null; },
          playing:()=>cur,current:()=>cur};
})();
