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
      if(BESORAH&&BESORAH.list) for(const k of BESORAH.list()){
        const bk=BESORAH.get(k);
        if(!bk) continue;
        if(norm(k)===want||norm(bk.hebrew||'')===want||norm(bk.english||'')===want){
          out.add(k); break; }
      }
      out.add(want);                            /* and by its own folded name */
    }
    return out;
  }

  /* ---------------- THE SHELF ---------------- */
  let sel=0;
  function items(){ return Array.prototype.slice.call(D.querySelectorAll('.sc-item')); }
  function paint(){ items().forEach((b,i)=>b.classList.toggle('sel',i===sel)); }
  function buildShelf(){
    const list=$('shelf-list');
    list.innerHTML='';
    const found=foundBooks();          /* null when there is no voyage at all */
    for(const s of STORY.list()){
      const b=D.createElement('button');
      /* A PASSAGE IS OPEN IF ITS SCROLL HAS BEEN TAKEN UP, or if there is no
         voyage to ask. What is shut is SHOWN and greyed and says why — the
         same rule the works page keeps: a man should be able to see what he
         has not got yet, so he knows what to go and do. */
      const open=!found||found.has(s.book)||found.has(norm(s.book));
      b.className='sc-item'+(open?'':' shut');
      const bk=BESORAH.has(s.book)?BESORAH.get(s.book):null;
      b.innerHTML='<div class="n">'+s.name+'</div>'+
        '<div class="r">'+(open?(bk?bk.hebrew+' &mdash; '+bk.english:'')
          :'the scroll of this passage is still hidden in the earth')+'</div>';
      if(open){
        b.onclick=()=>openScroll(s.id);
        b.onmouseover=()=>{ sel=items().indexOf(b); paint(); };
      }
      list.appendChild(b);
    }
    paint();
  }
  /* ---- THE SHELF STANDS OVER THE LIVING WORLD ----
     With no scene running the engine's own camera takes back over, and it
     sits over the traveller's shoulder — which, with him stood on the shore
     the scenes are staged at, put the eye inside the ship's rigging. The
     shelf gets a long slow orbit of its own instead: the finished world,
     turning quietly behind the scrolls. */
  const IDLE=[
    { t:  0, dark:0, light:1, sky:0x9fc5e8, sun:1, moon:1, stars:1, firm:0.08,
      land:1, sea:1, clouds:1, lifeSea:1, lifeAir:1, lifeLand:1, ship:0, man:0,
      fogN:400, fogF:1080, cd:260, cy:96, ca:0, cl:16, cfov:60, cut:true },
    { t:600, ca:1.0, cd:300, cy:110 },
  ];
  function showShelf(){
    $('shelf').style.display='block'; sel=0; paint();
    STAGE.play(IDLE, STORY.anchorFor('coast'), ()=>showShelf());   /* and round again */
  }
  function hideShelf(){ $('shelf').style.display='none'; }

  function openScroll(id){ hideShelf(); STORY.play(id); }

  /* the voyage's log, and what it has opened — for the acceptance suite */
  window.__UNFOLD={ log:voyageLog, found:foundBooks, rebuild:buildShelf };

  /* when a scroll runs out, or is left, the shelf comes back */
  window.__STORY_DONE=function(){ showShelf(); };
  window.__STORY_SKIPPED=function(){ showShelf(); };

  /* the arrows and ENTER work the shelf; ESC inside a scene is the story's own */
  addEventListener('keydown',function(e){
    if(STORY.playing()) return;                 /* a running scene owns the keys */
    if($('shelf').style.display!=='block') return;
    const it=items(); if(!it.length) return;
    if(e.key==='ArrowDown'){ sel=(sel+1)%it.length; paint(); e.preventDefault(); }
    else if(e.key==='ArrowUp'){ sel=(sel-1+it.length)%it.length; paint(); e.preventDefault(); }
    else if(e.key==='Enter'||e.key===' '){ it[Math.min(sel,it.length-1)].click(); e.preventDefault(); }
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
