/* ================= THE UNFOLDING =================
   The opening of this game: raise the shared world under the loading screen,
   then set out the shelf of scrolls, then play the one that is chosen.

   The world raised here is the VOYAGE's world, entire — the same hundred and
   seventy nations, the same beasts, the same sea and sky. Only what is done
   with it differs. */
(function(){
  const W=window.__WORLD, D=document, $=id=>D.getElementById(id);
  const BOOT=window.__BOOTUI;

  /* ---- the world is entered without the voyage's own chrome ----
     begin() belongs to the voyage: it sets the helm, the rail and the log.
     This game wants only a living world to set a scene in, so it takes the
     few things it needs and leaves the rest of that machinery alone. */
  function enterWorld(){
    /* THE GROUND IS BUILT WHERE THE SCENE IS SET. The engine streams chunks
       around the traveller, so with him left out on open water the coast the
       creation is staged on was never meshed at all — the dry land rose as a
       coarse smear on the horizon instead of as blocks under the eye. He is
       stood at the same shore the scene is anchored to. */
    const a=STORY.anchorFor('coast');
    W.state.boat.x=a.x; W.state.boat.z=a.z;
    W.state.mode='boat'; W.state.boat.speed=0;
    W.state.simHours=9.5;
    W.updateChunks(a.x,a.z,9999);
    STORY.here(a);                 /* (the films staged here need not lay it again) */
    W.setRunning(true);            /* the sea moves, the light lives, the world breathes */
    return a;
  }

  /* ================= THE HANDSHAKE WITH THE VOYAGE =================
     §5: taking a scroll up in the voyage must *"unlock its long-form passage
     in Scripture Unfolds, which reads the same log."*

     IT DID NOT. Neither this file nor any other under scripture-unfolds/ so
     much as mentioned the voyage's save; the shelf listed every passage it
     had, always, to everybody. The two games shared an engine, a world and a
     Besorah, and shared nothing at all about what the traveller had actually
     done — which is the whole of what makes finding a scroll matter.

     THE LOG IS ONE STRING UNDER ONE KEY. `voyage:state`, written by the
     voyage's own `saveState`, carrying `sr` — the ids of the scrolls taken
     up. This reads it and never writes it: the second game is a READER of
     the first, and a bug here must never be able to cost anybody a voyage.

     AND WITH NO VOYAGE AT ALL, EVERYTHING IS OPEN. Someone who opens this
     page on its own has not failed to find anything — they have simply not
     played the other game, and locking them out of their own scrolls to
     enforce a rule about a save file they do not have would be absurd. The
     gate closes only when there IS a log to gate against. */
  const VOYAGE_KEY='voyage:state';
  function voyageLog(){
    let raw=null;
    try{ raw=localStorage.getItem(VOYAGE_KEY); }catch(e){}
    if(!raw) return null;
    try{ return JSON.parse(raw); }catch(e){ return null; }
  }
  /* the marks fold away — ḆERĔSHITH and bereshith are the one book */
  function norm(t){ return String(t).normalize('NFD').replace(/[\u0300-\u036f]/g,'')
    .toLowerCase().replace(/[^a-z0-9]/g,''); }
  /* WHICH BOOKS HE HAS FOUND. The voyage's scrolls name their book the way a
     man reads it ('BERĔSHITH'); a passage here names it the way the Besorah
     files it ('bereshith'). They are matched on the folded name, through
     world/scrolls.js, which both games load. */
  function foundBooks(){
    const log=voyageLog();
    if(!log||!log.sr) return null;              /* no voyage: nothing is gated */
    const taken=new Set(log.sr);
    const out=new Set();
    const list=(window.EARTH&&EARTH.scrollList)||[];
    for(const sc of list){
      if(!taken.has(sc.id)) continue;
      const want=norm(sc.book||'');
      /* THE SPINE, NOT THE BOOK. This asked BESORAH for each scroll in turn
         and read its names off the open book — which worked only while every
         book was loaded at boot, and would now have fetched two megabytes of
         scripture to answer a question about a save file. The index carries
         both names of every scroll and is a kilobyte. */
      for(const bk of (BESORAH.titles?BESORAH.titles():[])){
        if(norm(bk.id)===want||norm(bk.hebrew||'')===want||norm(bk.english||'')===want){
          out.add(bk.id); break; }
      }
      out.add(want);                            /* and by its own folded name */
    }
    return out;
  }

  /* ---------------- THE LIBRARY ----------------
     THE SHELF WAS A LIST OF FILMS; IT IS THE SCROLL LIBRARY NOW (ROADMAP Phase F5). Every scroll
     of the voyage stands in it, in the Besorah's order from Berĕshith to Ḥazon, under the age it
     belongs to (js/library.js) — the ones gathered can be played, and the ones not gathered are
     SHOWN, greyed, and say where the scroll lies or who will give it, so a man can see what he has
     not got yet and knows what to go and do.

     AN ENTRY IS OPEN WHEN EVERY SCROLL IT IS FILED UNDER HAS BEEN TAKEN UP, or when there is no
     voyage to ask. It was the BOOK once (taking any scroll of Berĕshith opened every film of
     Berĕshith); now that the events have scrolls of their own — the flood on Ararat, Moriyah,
     Bĕyth ʼĔl — each is opened by its own, and the garden still by both the scrolls it reads. */
  let sel=0;
  function items(){ return Array.prototype.slice.call(D.querySelectorAll('#shelf .sc-pick')); }
  function paint(){ items().forEach((b,i)=>b.classList.toggle('sel',i===sel));
    const it=items()[sel]; if(it&&it.scrollIntoView) try{ it.scrollIntoView({block:'nearest'}); }catch(e){} }
  function taken(){ const log=voyageLog(); return log&&log.sr?new Set(log.sr):null; }
  function buildShelf(){
    const list=$('shelf-list');
    list.innerHTML='';
    const got=taken();                  /* null when there is no voyage at all */
    /* PLAY THE WHOLE BIBLE — every gathered scroll back to back, in order */
    const all=D.createElement('button'); all.className='sc-pick sc-whole';
    const ents=LIBRARY.entries(), st=ents.map(e=>LIBRARY.state(e,got)), nOpen=st.filter(s=>s.open).length;
    all.innerHTML='<div class="n">&#9654; PLAY THE WHOLE BIBLE</div><div class="r">'+nOpen+' of '+ents.length+' scrolls gathered &middot; Berĕshith to Ḥazon</div>';
    all.onclick=()=>playBible();
    all.onmouseover=()=>{ sel=items().indexOf(all); paint(); };
    list.appendChild(all);
    let age=null;
    ents.forEach((e,i)=>{
      const s=st[i];
      if(e.age!==age){ age=e.age; const h=D.createElement('div'); h.className='sc-age'; h.textContent=LIBRARY.AGES[age]; list.appendChild(h); }
      const b=D.createElement('button');
      b.className='sc-item sc-pick'+(s.open?'':' shut')+(s.film?'':' verse');
      b.dataset.entry=e.scrolls.join(',');
      const sc=s.scroll, ref=sc&&sc.verse?sc.verse.ref:'';
      let row;
      if(!s.open) row='not yet gathered &mdash; '+s.where.map(x=>x.replace(/^[^:]*: /,'')).join(' &middot; ');
      else if(s.film) row=(ref?ref+' &middot; ':'')+'a film';
      else row=(ref?ref+' &middot; ':'')+'the verse alone &mdash; no film yet';
      b.innerHTML='<div class="n">'+s.title+'</div><div class="r">'+row+'</div>';
      b.onclick=()=>openEntry(e,s);
      b.onmouseover=()=>{ sel=items().indexOf(b); paint(); };
      list.appendChild(b);
    });
    sel=Math.min(sel,items().length-1); paint();
  }
  /* ---- THE LIBRARY STANDS OVER THE LIVING WORLD ----
     With no scene running the engine's own camera takes back over, and it
     sits over the traveller's shoulder — which, with him stood on the shore
     the scenes are staged at, put the eye inside the ship's rigging. The
     shelf gets a long slow orbit of its own instead: the finished world,
     turning quietly behind the scrolls. (After a film played far off, the
     traveller is stood back on that shore first, and the ground laid there.) */
  const IDLE=[
    { t:  0, dark:0, light:1, sky:0x9fc5e8, sun:1, moon:1, stars:1, firm:0.08,
      land:1, sea:1, clouds:1, lifeSea:1, lifeAir:1, lifeLand:1, ship:0, man:0,
      fogN:400, fogF:1080, cd:260, cy:96, ca:0, cl:16, cfov:60, cut:true },
    { t:600, ca:1.0, cd:300, cy:110 },
  ];
  function showShelf(){
    $('shelf').style.display='block'; buildShelf();
    const a=STORY.anchorFor('coast'); STORY.standAt(a);
    if(window.VOICES) VOICES.mood('eden');
    STAGE.play(IDLE, a, ()=>showShelf());   /* and round again */
  }
  function hideShelf(){ $('shelf').style.display='none'; }

  /* the scroll is fetched here, and if it cannot be the shelf comes straight
     back rather than leaving a man staring at an idling world */
  function openScroll(id){
    hideShelf();
    Promise.resolve(STORY.play(id)).then(function(ok){ if(!ok) showShelf(); });
  }
  /* an entry of the Library: its film, or its verse over its own land, or — not gathered — its
     gap card, which says where it is to be had */
  function openEntry(e,s){
    if(s.open&&s.film){ openScroll(s.film.id); return; }
    hideShelf();
    const item={kind:s.open?'verse':'gap',e,s};
    Promise.resolve(STORY.playScene(LIBRARY.card(item))).then(ok=>{ if(!ok) showShelf(); });
  }
  function playBible(){
    hideShelf();
    LIBRARY.start(taken(),()=>showShelf());
  }

  /* the voyage's log, and what it has opened — for the acceptance suite */
  window.__UNFOLD={ log:voyageLog, found:foundBooks, taken, rebuild:buildShelf, bible:playBible,
    library:()=>{ const got=taken(); return LIBRARY.entries().map(e=>{ const s=LIBRARY.state(e,got);
      return {scrolls:e.scrolls, age:e.age, film:s.film?s.film.id:null, open:s.open, title:s.title, where:s.where}; }); } };

  /* when a scroll runs out, or is left, the Library comes back — or, in the whole Bible, the
     next scroll comes on (ESC leaves the whole Bible; SPACE or → passes on to the next) */
  window.__STORY_DONE=function(){ if(LIBRARY.running()){ LIBRARY.next(); return; } showShelf(); };
  window.__STORY_SKIPPED=function(s,code){
    if(LIBRARY.running()){ if(code==='Escape') LIBRARY.stop(); else LIBRARY.next(); return; }
    showShelf(); };

  /* the arrows and ENTER work the Library; B plays the whole Bible; ESC inside a scene is the story's own */
  addEventListener('keydown',function(e){
    if(STORY.playing()) return;                 /* a running scene owns the keys */
    if($('shelf').style.display!=='block') return;
    const it=items(); if(!it.length) return;
    if(e.key==='ArrowDown'){ sel=(sel+1)%it.length; paint(); e.preventDefault(); }
    else if(e.key==='ArrowUp'){ sel=(sel-1+it.length)%it.length; paint(); e.preventDefault(); }
    else if(e.key==='Enter'||e.key===' '){ it[Math.min(sel,it.length-1)].click(); e.preventDefault(); }
    else if(e.key==='b'||e.key==='B'){ playBible(); e.preventDefault(); }
    else if((e.key==='m'||e.key==='M')&&window.VOICES){ VOICES.toggle(); e.preventDefault(); }
  });

  /* ---------------- THE OPENING ITSELF ---------------- */
  (async function open(){
    try{
      await W.buildWorld();          /* the shared engine's own staged build */
      BOOT.stage('Setting the first scene…',1);
      enterWorld();
      /* the world is entered but nothing of it is shown yet: the stage is
         put into the creation's opening frame BEFORE the loading screen is
         taken away, so the first thing seen is darkness on the face of the
         deep and never a sunlit ocean for half a second first */
      await new Promise(r=>requestAnimationFrame(r));
      buildShelf();
      BOOT.done();
      $('boot').style.display='none';
      /* the first scroll unrolls straight away — the creation of the world
         is this game's opening, exactly as it is the scripture's */
      STORY.play('creation');
    }catch(e){
      BOOT.fail('The world could not be raised: '+(e&&e.message||e));
      throw e;
    }
  })();
})();
