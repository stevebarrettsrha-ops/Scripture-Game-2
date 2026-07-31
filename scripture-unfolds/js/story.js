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
  let cur=null, capIdx=-1, titleIdx=-1, blocked=false;

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
    if(e.code==='Escape'||e.code==='Space'||e.code==='Enter'){
      e.preventDefault(); e.stopPropagation(); skip(); return; }
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
  let _coast=null;
  function anchorFor(kind){
    const W=window.__WORLD;
    if(kind==='here'){ const p=W.state.boat; return {x:p.x,z:p.z}; }
    const st=W.findStart();
    if(kind!=='coast') return {x:st[0],z:st[1]};
    if(_coast) return _coast;
    /* a widening ring-search out from the opening for the nearest dry ground */
    let best=null, bd=1e12;
    for(let r=200;r<=9000&&!best;r+=200){
      for(let k=0;k<48;k++){
        const a=k/48*Math.PI*2, x=st[0]+Math.cos(a)*r, z=st[1]+Math.sin(a)*r;
        if(!W.landAtWorld(x,z)) continue;
        const d2=(x-st[0])**2+(z-st[1])**2;
        if(d2<bd){ bd=d2; best={x,z}; }
      }
      if(best) break;
    }
    _coast=best||{x:st[0],z:st[1]};
    return _coast;
  }

  function play(id){
    const s=SCENES[id]; if(!s){ console.warn('STORY: no scene',id); return false; }
    if(cur) end(true);
    cur=s; capIdx=-1; titleIdx=-1;
    $('sc-cine').classList.add('on');
    D.body.classList.add('in-scene');
    guards(true);
    let anch=anchorFor(s.anchor);
    STAGE.play(s.stage,anch,()=>done());
    $('sc-skip').classList.add('on');
    tickCaps(0);
    return true;
  }

  function done(){
    const nx=cur&&cur.next;
    end(false);
    if(nx&&SCENES[nx]) play(nx); else if(window.__STORY_DONE) window.__STORY_DONE();
  }
  function skip(){ const s=cur; end(false); if(window.__STORY_SKIPPED) window.__STORY_SKIPPED(s); }
  function end(quiet){
    if(!cur) return;
    cur=null; guards(false);
    STAGE.stop();
    show($('sc-cap'),false); show($('sc-title'),false);
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
      if(want<0) show(el,false);
      else{ const q=capText(cl[want]);
        $('sc-cap-t').textContent=q.text;
        $('sc-cap-r').textContent=q.ref;
        show(el,true); }
    }
    /* ---- titles ---- */
    const tl=cur.titles||[];
    let tw=-1;
    for(let i=0;i<tl.length;i++) if(t>=tl[i].t&&t<tl[i].to){ tw=i; break; }
    if(tw!==titleIdx){
      titleIdx=tw; const el=$('sc-title');
      if(tw<0) show(el,false);
      else{ el.textContent=tl[tw].text; show(el,true); }
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

  /* driven off the stage's own tick, so one clock rules the whole scene */
  const _st=window.__STAGE_TICK;
  window.__STAGE_TICK=function(dt){ _st(dt); tickCaps(); };

  return {scene,get,list,play,skip,end,anchorFor,playing:()=>cur,current:()=>cur};
})();
