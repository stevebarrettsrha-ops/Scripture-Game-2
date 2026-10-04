/* THE FULLNESS OF TIME — the page every act is played in.

   One HTML file an act (the design document: "one HTML file per act, loading a shared engine
   core, plus a light launcher"). Each is a few lines naming its act and loading this, and
   this does the rest: it raises the VOYAGE's world — the very engine, earth, blocks, folk,
   sea and sky the voyage is played on, read from where they already live (world/manifest.js),
   never copied — under a loading screen, then loads the story's engine and the act's scenes
   and plays them in that world. The launcher (index.html) shows the road, the Codex and the
   journal, and raises no world at all. */
(function(){
'use strict';
/* THE ROAD: each act, its page and its scenes' file */
const ROAD=window.STORY_ROAD=[
  {id:'prologue',   page:'act-prologue.html',   file:'acts/01-prologue.js',   period:'kings'},
  {id:'bridge',     page:'act-bridge.html',     file:'acts/02-bridge.js',     period:'kings'},
  {id:'coming',     page:'act-coming.html',     file:'acts/03-coming.js',     period:'herodes'},
  {id:'forerunner', page:'act-forerunner.html', file:'acts/04-forerunner.js', period:'herodes'},
  {id:'galil',      page:'act-galil.html',      file:'acts/05-galil.js',      period:'herodes'},
  {id:'road-up',    page:'act-road-up.html',    file:'acts/06-road-up.js',    period:'herodes'},
  {id:'passion',    page:'act-passion.html',    file:'acts/07-passion.js',    period:'herodes'}
];
const ACT=window.STORY_ACT, entry=ROAD.find(r=>r.id===ACT);
if(!entry){ if(ACT) document.body.textContent='No such act: '+ACT; return; }
const q=new URLSearchParams(location.search);

/* the engine is told before it loads that a host drives it (it raises the world and stands
   back), that a story holds it (it never writes the voyage's save), and in which days the
   city of the great king is to be raised */
window.__HOST_BOOT=true; window.__STORY_HOST=true; window.__STORY_PERIOD=entry.period;

const D=document;
D.body.insertAdjacentHTML('afterbegin',`
<canvas id="cv"></canvas>
<div id="gl"></div>
<div id="boot">
  <h1>THE FULLNESS OF TIME</h1>
  <div class="sub">the road from Bĕyth Leḥem to Rome</div>
  <div class="actn" id="boot-act"></div>
  <div id="load-stage"></div>
  <div id="load-bar"><div id="load-fill"></div></div>
  <div id="load-fail"></div>
  <div id="boot-verse"><div id="bv-t"></div><div id="bv-r"></div></div>
</div>
<div id="engine-sockets" aria-hidden="true" style="position:fixed;left:-9999px;top:-9999px;width:0;height:0;overflow:hidden;opacity:0;pointer-events:none">
  ${['b-ashore','b-breath','b-capture','b-daypart','b-dive','b-firm','b-fly','b-jump','b-log','b-map','b-names','b-net','b-pause','b-rail','b-repel','b-season','b-sound','b-spear','b-speed','b-time','b-wind',
     'fp-dn','fp-up','m-confirm','m-continue','m-list','m-new','m-options-btn','mc-anew','mc-keep','opt-back','opt-modal'].map(i=>'<button id="'+i+'"></button>').join('')}
  ${['bigmap','breath','breath-fill','cine','cine-cap','cine-fade','cine-title','clock','flypad','joy','joyk','log-lands','log-stats','logbook','menu','paused','place','prompt','trade','trade-close','trade-sub','verse','verse-r','verse-t'].map(i=>'<div id="'+i+'"></div>').join('')}
  <canvas id="bigcv" width="8" height="8"></canvas><canvas id="mini" width="8" height="8"></canvas><canvas id="compass" width="8" height="8"></canvas>
  <table id="trade-rows"></table>
</div>
<div id="play" class="off">
  <div id="where"></div>
  <div id="goal" class="off"></div>
  <div class="topbtns"><button id="b-voice" title="Voices on or off (V)">🗣 Voices</button><button id="b-codex">📜 Codex</button><button id="b-hub">☰ The road</button></div>
  <div id="sverse" class="off"><canvas id="v-face" width="38" height="38"></canvas><div class="who" id="v-who"></div><div id="v-text"></div><div id="v-ref"></div><div class="vtap">continue ▸</div></div>
  <div id="card" class="off"></div>
  <div id="eras" class="off"></div>
  <div id="choice" class="off"></div>
  <div id="sprompt" class="off"><span id="prompt-t"></span><div id="hold"></div></div>
  <div id="sjoy"><div id="knob"></div></div>
  <button id="actbtn">E</button>
  <div id="keys">WASD move · drag to look · E act · Enter continue · J Codex · V voices</div>
</div>
<div id="toast"></div>
<div id="codex" class="off"><div class="ch"><span>THE PROPHECY CODEX</span><button onclick="document.getElementById('codex').classList.add('off')">✕</button></div><div id="codex-list"></div></div>
<div id="fulfil" class="off">
  <div class="f-h">FULFILLED</div>
  <div id="f-name"></div>
  <div class="f-cols">
    <div class="f-col"><div class="lab">The promise — in your family scroll</div><div class="ref" id="f-pref"></div><div class="txt" id="f-ptext"></div></div>
    <div class="f-col"><div class="lab">The promise kept</div><div class="ref" id="f-fref"></div><div class="txt" id="f-ftext"></div></div>
  </div>
  <div class="tap">continue ▸</div>
</div>
<div id="fade"></div>`);
D.getElementById('boot-act').textContent=D.title.replace(/^.*?—\s*/,'');

/* the loading screen reads the promise while the world is raised */
window.__BOOTUI=(function(){
  const $=id=>D.getElementById(id);
  /* the promise, in the Besorah's own words (story/scripture.js, loaded first) */
  const REFS=['GALATIANS 4:4','YASHAYAHU 7:14','DANI\'AL 2:44'];
  let i=Math.floor(Math.random()*REFS.length);
  const setW=()=>{ const T=(window.STORY&&STORY._t)||{}; const r=REFS[i%REFS.length]; i++; if(!T[r]) return;
    $('bv-t').textContent=T[r].t; $('bv-r').textContent=r; };
  setW(); const timer=setInterval(setW,6400);
  return {
    stage(label,frac){ const s=$('load-stage'), f=$('load-fill'); if(s&&label!=null) s.textContent=label;
      if(f&&frac!=null) f.style.width=Math.round(Math.max(0,Math.min(1,frac))*100)+'%'; },
    fail(msg){ const e=$('load-fail'); if(e){ e.textContent=msg; e.style.display='block'; } clearInterval(timer); },
    done(){ clearInterval(timer); }
  };
})();
const BUI=window.__BOOTUI;
function script(src){ return new Promise((ok,no)=>{ const s=D.createElement('script'); s.src=src; s.onload=ok; s.onerror=()=>no(new Error('could not load '+src)); D.head.appendChild(s); }); }
async function chain(list){ for(const f of list) await script(f); }

(async function open(){
  try{
    window.STORY={scripture(t){ this._t=Object.assign(this._t||{},t); }};
    await script('scripture.js'); BUI.stage('Raising the firmament…',0.03);
    await script('../three.min.js');
    await script('../world/registry.js');
    await script('../world/manifest.js');
    window.__WORLDFILES=MANIFEST.load('../',(done,total)=>{ if(done%24===0) BUI.stage(null,0.03+0.1*(done/total)); });
    await window.__WORLDFILES;
    if(!window.__VOYAGE) throw new Error('the engine of the world could not be raised');
    BUI.stage('Kindling the engine of the world…',0.14);
    window.__VOYAGE();
    await window.__WORLD.buildWorld();
    BUI.stage('Opening the scroll…',0.96);
    await chain(['voices/bank.js','voice.js','world.js','people.js','settings.js','places.js','engine.js','scripture.js','acts/00-codex.js',entry.file]);
    window.__WORLD.setRunning(true);         /* the sea moves, the light lives, the world breathes */
    STORY.page=entry;
    D.getElementById('fulfil').addEventListener('click',()=>window.__STORY.advance());
    STORY.boot({act:ACT, scene:+(q.get('scene')||0)});
    await new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r)));
    BUI.done(); D.getElementById('boot').style.display='none';
  }catch(e){ BUI.fail('The world could not be raised: '+(e&&e.message||e)); console.error(e); }
})();
})();
