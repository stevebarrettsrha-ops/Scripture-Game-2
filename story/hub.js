/* THE FULLNESS OF TIME — the launcher: the road, the Codex, the journal.

   A light page that raises no world: it reads the acts (story/acts/*.js, which are data),
   the family scroll and the journal from the save (localStorage 'fullness:v1', written by
   the acts as they are played), and sends the player to an act's own page to walk it. */
(function(){
'use strict';
const ST=window.STORY, $=id=>document.getElementById(id);
const esc=s=>String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
const save={codex:{},acts:{},witnessed:0,road:{},bonds:{}};
try{ const s=localStorage.getItem('fullness:v1'); if(s) Object.assign(save,JSON.parse(s)); }catch(e){}
const persist=()=>{ try{ localStorage.setItem('fullness:v1',JSON.stringify(save)); }catch(e){} };
const ROAD=[{id:'prologue',page:'act-prologue.html'},{id:'bridge',page:'act-bridge.html'},{id:'coming',page:'act-coming.html'},
  {id:'forerunner',page:'act-forerunner.html'},{id:'galil',page:'act-galil.html'},{id:'road-up',page:'act-road-up.html'}];
const pageOf=id=>(ROAD.find(r=>r.id===id)||{}).page;
const textOf=r=>{ const e=ST.text[r]; return e?e.t:''; };

function codexHTML(){
  let h='';
  for(const d of ST.codexDefs){ const s=save.codex[d.id]||{};
    h+='<div class="cx '+(s.fulfilled?'ful':s.collected?'col':'')+'"><div class="cx-name">'+esc(d.name)+'</div>';
    if(s.collected) h+='<div class="cx-v"><b>'+esc(d.promise)+'</b> '+esc(textOf(d.promise))+'</div>';
    else h+='<div class="cx-v dim">Not yet written into your scroll.</div>';
    if(s.fulfilled) h+='<div class="cx-v ful"><b>'+esc(d.fulfil)+'</b> '+esc(textOf(d.fulfil))+'</div>';
    else if(s.collected) h+='<div class="cx-v dim">Awaiting its fulfilment — '+esc(d.where||'')+'</div>';
    h+='</div>'; }
  return h;
}
function acts(){
  const list=$('acts'); list.innerHTML='';
  /* every act that is built can be begun: the road is best walked in order, and the hub says
     so, but no one is kept from the Galil because the Prologue is not yet finished */
  let open=true;
  for(const a of ST.acts.slice().sort((x,y)=>x.n-y.n)){
    const done=save.acts[a.id]==='done', can=!a.planned&&!!pageOf(a.id), inOrder=open;
    const d=document.createElement(can?'a':'div'); d.className='act'+(done?' done':'')+(can?'':' locked');
    if(can) d.href=pageOf(a.id);
    d.innerHTML='<span class="an">'+esc(a.num||'')+'</span><span class="at">'+esc(a.title)+'</span><span class="as">'+esc(a.sub||'')+'</span>'+
      '<span class="ast">'+(a.planned?'To come':done?'Walked ✓ · again ▸':inOrder?'Begin ▸':'Begin ▸ (best after the act before)')+'</span>';
    list.appendChild(d);
    if(!done&&!a.planned) open=false; }
}

/* ---- THE JOURNAL: the land, and how far along the road ---- */
/* the land between the sea and the rift, drawn plainly: the coast, the lake of Galil, the
   Yardĕn and the Salt Sea; every place a scene was witnessed, lit when it has been */
const COAST=[[33.6,35.42],[33.27,35.2],[33.09,35.1],[32.83,34.97],[32.55,34.9],[32.17,34.8],[31.8,34.64],[31.52,34.45],[31.3,34.24],[30.9,34.2]];
const LAKE=[[32.89,35.53],[32.88,35.62],[32.80,35.65],[32.71,35.6],[32.72,35.55],[32.80,35.52]];
const RIVER=[[33.25,35.63],[32.9,35.62],[32.71,35.57],[32.4,35.56],[32.1,35.53],[31.76,35.56]];
const SALT=[[31.76,35.52],[31.76,35.6],[31.5,35.58],[31.2,35.55],[31.05,35.45],[31.2,35.4],[31.5,35.46]];
const SPOTS=[
  {k:'yahrushalayim',n:'Yahrushalayim',lat:31.78,lon:35.23},{k:'beythlehem',n:'Bĕyth Leḥem',lat:31.705,lon:35.2},
  {k:'fields',n:'',lat:31.70,lon:35.22},{k:'natsareth',n:'Natsareth',lat:32.702,lon:35.297},{k:'qanah',n:'Qanah',lat:32.746,lon:35.342},
  {k:'galil',n:'Kephar Naḥum',lat:32.881,lon:35.575},{k:'galilEast',n:'',lat:32.836,lon:35.65},{k:'galilSea',n:'',lat:32.83,lon:35.585},
  {k:'road',n:'',lat:32.2,lon:35.28},{k:'yarden',n:'Bĕyth Anyah',lat:31.837,lon:35.55},{k:'wilderness',n:'The wilderness',lat:31.6,lon:35.38},
  {k:'mountain',n:'',lat:33.0,lon:35.75},{k:'bethanyah',n:'',lat:31.771,lon:35.262},{k:'shekem',n:'Sheḵem',lat:32.213,lon:35.285},{k:'hillcountry',n:'',lat:31.768,lon:35.162},
  {k:'caesarea',n:'Caesarea Philippi',lat:33.248,lon:35.694},{k:'ginae',n:'',lat:32.461,lon:35.302},{k:'yeriho',n:'Yahriḥo',lat:31.857,lon:35.444},{k:'olives',n:'',lat:31.778,lon:35.245}];
function drawMap(){
  const cv=$('road-map'), g=cv.getContext('2d'), W=cv.width, H=cv.height;
  const lat0=30.95, lat1=33.35, lon0=34.25, lon1=36.0;
  const P=(la,lo)=>[ (lo-lon0)/(lon1-lon0)*W, (lat1-la)/(lat1-lat0)*H ];
  g.fillStyle='#1d2a33'; g.fillRect(0,0,W,H);                         /* the Great Sea */
  g.fillStyle='#3a3222'; g.beginPath(); let p=P(COAST[0][0],COAST[0][1]); g.moveTo(p[0],p[1]);
  for(const c of COAST){ p=P(c[0],c[1]); g.lineTo(p[0],p[1]); }
  g.lineTo(W,H); g.lineTo(W,0); g.closePath(); g.fill();
  const poly=(L,col)=>{ g.fillStyle=col; g.beginPath(); L.forEach((c,i)=>{ const q=P(c[0],c[1]); i?g.lineTo(q[0],q[1]):g.moveTo(q[0],q[1]); }); g.closePath(); g.fill(); };
  poly(LAKE,'#355a6a'); poly(SALT,'#3f5d66');
  g.strokeStyle='#4b7280'; g.lineWidth=2; g.beginPath(); RIVER.forEach((c,i)=>{ const q=P(c[0],c[1]); i?g.lineTo(q[0],q[1]):g.moveTo(q[0],q[1]); }); g.stroke();
  const seen=new Set(Object.values(save.road||{}).map(r=>r.place));
  g.font='12px Georgia, serif';
  for(const s of SPOTS){ const q=P(s.lat,s.lon), on=seen.has(s.k);
    g.fillStyle=on?'#f2d27a':'#6d6250'; g.beginPath(); g.arc(q[0],q[1],on?4.5:3,0,7); g.fill();
    if(on){ g.fillStyle='rgba(242,210,122,0.25)'; g.beginPath(); g.arc(q[0],q[1],9,0,7); g.fill(); }
    if(s.n){ g.fillStyle=on?'#f3e7c7':'#8a7d62'; g.fillText(s.n,q[0]+7,q[1]+4); } }
  /* the whole road, Bĕyth Leḥem to Rome, and how far along it */
  const done=ST.acts.filter(a=>save.acts[a.id]==='done').length, all=ST.acts.length;
  $('road-key').innerHTML='The road from Bĕyth Leḥem to Rome: <b style="color:#f2d27a">'+done+' of '+all+'</b> acts walked · '+
    Object.keys(save.road||{}).length+' scenes witnessed · '+(save.witnessed||0)+' small faithful things done.';
}
function bonds(){
  const B=save.bonds||{}, el=$('bonds'), ids=Object.keys(B);
  if(!ids.length){ el.innerHTML='<div class="cx-v dim">No one yet. Those He calls to follow Him will be walked with here.</div>'; return; }
  const titleOf=k=>{ const r=(save.road||{})[k]; return r?(r.title+(r.date?' · '+r.date:'')):k; };
  el.innerHTML=ids.map(id=>{ const b=B[id], n=b.scenes.length;
    const near=n>=6?'walked with long':n>=3?'walked with often':n>=2?'walked with':'met';
    return '<div class="bond"><span class="bn">'+esc(b.name)+'</span><span class="bs">'+near+' · '+n+' scene'+(n>1?'s':'')+'</span>'+
      '<span class="bw">'+b.scenes.map(titleOf).map(esc).join(' — ')+'</span></div>'; }).join('');
}
/* what the witness said on the road — "the journal will remember that" */
function said(){
  const C=Object.values(save.choices||{}), el=$('said'); if(!el) return;
  el.innerHTML=C.length?C.map(c=>'<div class="bond"><span class="bn">“'+esc(c.said)+'”</span><span class="bs">'+esc(c.where||'')+'</span></div>').join('')
    :'<div class="cx-v dim">Nothing yet. What you say on the road is written here.</div>';
}
function render(){
  const r='GALATIANS 4:4'; if(ST.text[r]){ $('h-verse').textContent=ST.text[r].t; $('h-ref').textContent=r; }
  const q=new URLSearchParams(location.search), d=q.get('done');
  const a=d&&ST.acts.find(x=>x.id===d); $('hub-msg').textContent=a?'The act is complete: '+a.title+'.':'';
  acts(); $('hub-codex').innerHTML=codexHTML(); drawMap(); bonds(); said();
}
$('h-reset').onclick=()=>{ if(!confirm('Wash the family scroll clean and begin the road again?')) return;
  save.codex={}; save.acts={}; save.witnessed=0; save.road={}; save.bonds={}; save.choices={}; persist(); render(); };
window.__HUB={save,render};
render();
})();
