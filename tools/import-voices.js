/* THE VOICES OF THE FILMS — Scripture-Game's own recordings, brought over for the verses the films
   of SCRIPTURE UNFOLDS read, and for no others (ROADMAP Phase F2).

     node tools/import-voices.js [path/to/scripture-game]      (default ../stevebarrettsrha-ops/scripture-game
                                                               beside this repository, or $SG)
     node tools/import-voices.js --dry                          say what would come, copy nothing

   Scripture-Game keeps some thirty-eight thousand clips, one for every line any of its pages can
   speak, each filed under a key made of WHO speaks it and the WORDS spoken (its voice.js, keyOf).
   A key cannot be guessed from a reference: the same verse is cut into parts at its marks, each
   quotation given to the one the verse says spoke it, and every part keyed alone. So the clips are
   found the way Scripture-Game itself finds them — its own voice.js and its own pages are RUN here,
   unchanged, against a stand-in window: every staged slide is cut by its own Stage.parts and cast by
   its own slideItems, every line of a scene by its own lineItems, every verse of a reading book read
   by its narrator — and each key looked up in that page's own bank.

   THE WORDS SHOWN ARE NEVER SCRIPTURE-GAME'S. Its text writes the Name short, which the Besorah
   check refuses, and it is used here for one thing only: to find which of its recordings speaks
   which words of the Besorah's verse. A recording is matched to a caption when the words it speaks
   stand, in order, in that caption's verse as the Besorah has it (marks, case and stops aside, the
   Name read as one word); the captions are cut into the longest such recordings that do not
   overlap, and played in the order the verse has them. What a caption has no recording for is
   simply not voiced — the caption is held for its own time and the music plays on.

   WHAT IS ASKED FOR: every caption (`q`) of every film under scripture-unfolds/scrolls/, and the
   one verse of every scroll in world/scrolls.js (the card a scroll with no film yet is shown as in
   the Library and in the whole Bible). The New Testament has no recordings in Scripture-Game, so its
   films are read by caption alone.

   WHAT IS WRITTEN: scripture-unfolds/voices/<key>.webm for each clip used (copied as they are —
   Opus at some twenty kilobits, which is as small as speech will go and stay clear), and
   scripture-unfolds/voices/bank.js — for each caption the clips in order and how long each runs. */
const fs=require('fs'), path=require('path'), vm=require('vm');
const ROOT=path.join(__dirname,'..');
const args=process.argv.slice(2), DRY=args.includes('--dry');
const SG=args.find(a=>!a.startsWith('--'))||process.env.SG||
  [path.join(ROOT,'..','stevebarrettsrha-ops','scripture-game'),'/home/user/stevebarrettsrha-ops/scripture-game']
    .find(p=>fs.existsSync(path.join(p,'voice.js')));
if(!SG||!fs.existsSync(path.join(SG,'voice.js'))){ console.error('Scripture-Game is not to hand (pass its folder, or set $SG)'); process.exit(2); }
const OUT=path.join(ROOT,'scripture-unfolds','voices');

/* ================= WHAT THE FILMS READ ================= */
const BOOKS={};
const bdir=path.join(ROOT,'scripture-unfolds','scripture');
for(const f of fs.readdirSync(bdir)){ if(!f.endsWith('.js')||f==='index.js') continue;
  const s=fs.readFileSync(path.join(bdir,f),'utf8'), i=s.indexOf('BESORAH.book(');
  if(i<0) continue; const b=JSON.parse(s.slice(i+13,s.lastIndexOf(')'))); BOOKS[b.id]=b; }
const targets=[];                       /* {key, text} — the words a caption shows */
const capKey=q=>q[0]+' '+q[1]+':'+q[2]+(q[3]!==undefined&&q[3]!==q[2]?'-'+q[3]:'');
{ const scenes=[]; const STORY={scene:s=>scenes.push(s)};
  for(const f of fs.readdirSync(path.join(ROOT,'scripture-unfolds','scrolls')).sort()) if(f.endsWith('.js'))
    new Function('STORY',fs.readFileSync(path.join(ROOT,'scripture-unfolds','scrolls',f),'utf8'))(STORY);
  const seen=new Set();
  for(const sc of scenes) for(const c of sc.caps||[]){ if(!c.q) continue;
    const k=capKey(c.q); if(seen.has(k)) continue; seen.add(k);
    const b=BOOKS[c.q[0]], rows=b&&b.chapters[String(c.q[1])]; if(!rows){ console.error('no text for '+k); continue; }
    const t=rows.filter(r=>r[0]>=c.q[2]&&r[0]<=(c.q[3]===undefined?c.q[2]:c.q[3])).map(r=>r[1]).join(' ');
    targets.push({key:k,text:t,film:sc.id}); } }
{ const got=[]; const EARTH=new Proxy({},{get:(t,k)=>k==='scroll'?(s=>got.push(s)):(()=>{})});
  new Function('EARTH','window',fs.readFileSync(path.join(ROOT,'world','scrolls.js'),'utf8'))(EARTH,{EARTH});
  for(const s of got) if(s.verse&&s.verse.t) targets.push({key:'scroll:'+s.id,text:s.verse.t,film:'(card)'}); }

/* ================= SCRIPTURE-GAME, RUN AS IT RUNS ================= */
/* (a JavaScript value read off the page by its brackets, its strings and comments stepped over) */
function closeOf(s,i){ const open=s[i], shut={'(':')','[':']','{':'}'}[open]; let d=0;
  for(let j=i;j<s.length;j++){ const ch=s[j];
    if(ch==='"'||ch==="'"||ch==='`'){ for(j++;j<s.length&&s[j]!==ch;j++) if(s[j]==='\\') j++; continue; }
    if(ch==='/'&&s[j+1]==='/'){ j=s.indexOf('\n',j); if(j<0) return -1; continue; }
    if(ch==='/'&&s[j+1]==='*'){ j=s.indexOf('*/',j+2)+1; continue; }
    if(ch===open) d++; else if(ch===shut&&--d===0) return j; }
  return -1; }
const cinema=fs.readFileSync(path.join(SG,'cinema.js'),'utf8');
/* (its parts are cut by a pattern with a quotation mark in it, so the method is taken up to the
   one that follows it, partTimes, and not by its brackets) */
const pi=cinema.indexOf('parts(text){'), pe=cinema.lastIndexOf('}',cinema.indexOf('partTimes(',pi));
const PARTS_SRC='window.Stage={'+cinema.slice(pi,pe+1)+'};';
const VOICE_SRC=fs.readFileSync(path.join(SG,'voice.js'),'utf8');
function pageWorld(page,html){
  const box={ console, Math, JSON, Object, Array, String, Number, Set, Map, WeakMap, RegExp, Date,
    location:{pathname:'/'+page}, navigator:{}, localStorage:{getItem(){return null;},setItem(){}},
    addEventListener(){}, setTimeout(){}, clearTimeout(){}, setInterval(){},
    performance:{now:()=>0},
    /* a page with no elements on it: what voice.js reaches for at load (its buttons) is simply not there */
    document:{createElement:()=>({canPlayType:()=>'',style:{},appendChild(){},addEventListener(){}}),
      getElementById:()=>null, querySelector:()=>null, querySelectorAll:()=>[], addEventListener(){},
      head:{appendChild(){}}, body:{appendChild(){},classList:{add(){},remove(){},toggle(){}}}, readyState:'complete'} };
  box.window=box; vm.createContext(box);
  vm.runInContext(PARTS_SRC,box); vm.runInContext(VOICE_SRC,box);
  const ci=html.indexOf('const CHARS={');
  if(ci>=0){ const e=closeOf(html,html.indexOf('{',ci)); vm.runInContext(html.slice(ci,e+1)+';',box); }
  let story=null;
  const si=html.indexOf('const STORY=');
  if(si>=0){ const a=html.indexOf('[',si);
    if(html.slice(a,a+3)==='[];'){
      let src='var STORY=[];', k=a;
      for(;;){ const p=html.indexOf('STORY.push(',k); if(p<0) break; const e=closeOf(html,p+10); if(e<0) break;
        src+=html.slice(p,e+1)+';'; k=e; }
      try{ vm.runInContext(src+'__S=STORY;',box); story=box.__S; }catch(e){ console.error('  '+page+': its telling could not be read ('+e.message+')'); } }
    else{ const e=closeOf(html,a);
      try{ vm.runInContext('__S='+html.slice(a,e+1)+';',box); story=box.__S; }catch(e2){ console.error('  '+page+': its telling could not be read ('+e2.message+')'); } } }
  let book=null;
  const bi=html.match(/<script id="book-data" type="application\/json">([\s\S]*?)<\/script>/);
  if(bi) try{ book=JSON.parse(bi[1]); }catch(e){}
  return {V:box.Voice,story,book};
}
function bankOf(page){
  const f=path.join(SG,'voices',page.replace(/\.html$/,'')+'.js'); if(!fs.existsSync(f)) return null;
  const box={}; box.window=box; vm.runInNewContext(fs.readFileSync(f,'utf8'),box);
  return box.VOICE_BANK||null; }

/* every telling of every page, and every recorded line of each: {page, tell, i, key, ms, text} */
const passages=[], units=[];
const pages=fs.readdirSync(SG).filter(f=>f==='index.html'||/^book-of-.*\.html$/.test(f)).sort();
let nPages=0;
for(const page of pages){
  const bank=bankOf(page); if(!bank||!bank.k) continue;
  const html=fs.readFileSync(path.join(SG,page),'utf8');
  let W; try{ W=pageWorld(page,html); }catch(e){ console.error('  '+page+': '+e.message); continue; }
  if(!W.V) continue; nPages++;
  const clip=(items)=>items.filter(it=>it&&String(it.text||'').trim()).map(it=>{
    const t=String(it.text).replace(/\s+/g,' ').trim(), k=W.V.keyOf(it.who,t); return {key:k,ms:bank.k[k]||0,text:t}; });
  /* A TELLING is one slide, one verse of a reading book, or one run of a scene's lines said one
     after another; every recording in it is a UNIT, numbered in the order it is heard */
  let tid=0;
  const tell=(items,text)=>{ tid++; const cl=clip(items); passages.push({page,text,n:cl.length});
    cl.forEach((c,i)=>units.push({page,tell:page+'#'+tid,i,key:c.key,ms:c.ms,text:c.text})); };
  if(W.story) for(const act of W.story) for(const ch of (act&&act.chapters)||[]){
    for(const ph of ['intro','outro']){ const L=ch[ph]||[];
      for(let i=0;i<L.length;i++){ if(!L[i]||!L[i].text) continue; let P;
        try{ P=W.V.slideItems(L,i); }catch(e){ continue; }
        tell(P.flat||[].concat(...P.byPart),String(L[i].text)); } }
    /* the lines of the playable scene, in the order they are said: a run of them is one telling */
    const seen=new Set();
    const walk=o=>{ if(!o||typeof o!=='object'||seen.has(o)) return; seen.add(o);
      if(Array.isArray(o)){ let run=[];
        const flush=()=>{ if(run.length) tell(run,''); run=[]; };
        for(const x of o){
          if(x&&Array.isArray(x.say)&&typeof x.say[1]==='string'){
            try{ run=run.concat(W.V.lineItems(x.say[0],x.say[1])); }catch(e){}
            continue; }
          flush(); walk(x); }
        flush(); return; }
      for(const k in o){ if(k==='intro'||k==='outro') continue; walk(o[k]); } };
    walk(ch); }
  if(W.book&&W.book.chapters) for(const c in W.book.chapters) for(const v of W.book.chapters[c]){
    let items; try{ items=W.V.lineItems('narrator',v.t); }catch(e){ items=[]; }
    tell(items,v.t); }
}

/* ================= THE WORDS, SET SIDE BY SIDE ================= */
/* the Name is one word whichever way it is written; marks, case and stops are not words */
function norm(t){ return String(t||'').replace(/\(\s*YAHU[ĂA]H\s*\)\s*HWHY/g,' yahuah ').replace(/\bHWHY\b/g,' yahuah ')
  .normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[‘’‚‛ʻʼʹ׳'`´ʿʾ]/g,'')
  .toLowerCase().replace(/[^a-z0-9]+/g,' ').trim(); }
for(const u of units) u.n=norm(u.text);
const usable=units.filter(u=>u.ms>0&&u.n.length>=2);
console.log(nPages+' pages of Scripture-Game read · '+passages.length+' tellings · '+units.length+' lines heard · '+usable.length+' of them recorded');
/* an index by the line's first word-pair, so each caption is not set against forty thousand */
const byHead=new Map();
for(const u of usable){ const w=u.n.split(' '), h=w.slice(0,2).join(' ');
  if(!byHead.has(h)) byHead.set(h,[]); byHead.get(h).push(u); }
function cover(T){
  const n=norm(T), cand=[];
  const words=n.split(' '); let pos=0; const starts=[];
  for(const w of words){ starts.push(pos); pos+=w.length+1; }
  for(let i=0;i<words.length;i++){
    const L=(byHead.get(words[i]+' '+(words[i+1]||''))||[]).concat(byHead.get(words[i])||[]);
    for(const u of L){ if(n.startsWith(u.n,starts[i])&&(starts[i]+u.n.length===n.length||n[starts[i]+u.n.length]===' '))
      cand.push({a:starts[i],b:starts[i]+u.n.length,u}); } }
  /* LINES ARE TAKEN IN CHAINS: a line, and the line heard after it in the same telling where it
     stands word for word next in the verse, and so on. "And Aluahim said," — "Let light come to
     be," — "and light came to be." is three short lines and one chain. A chain of some length is
     sure of itself; a few words alone ("And he said,") could be anybody's, and are not taken. */
  const next=c=>cand.filter(d=>d.u.tell===c.u.tell&&d.u.i===c.u.i+1&&Math.abs(d.a-c.b)<=1);
  const chains=[];
  for(const c of cand){ let run=[c], cur=c;
    for(let k=0;k<40;k++){ const nx=next(cur); if(!nx.length) break; cur=nx[0]; run.push(cur); }
    chains.push(run); }
  const take=[];
  for(const ch of chains.map(r=>({r,a:r[0].a,b:r[r.length-1].b})).filter(x=>x.b-x.a>=24||x.b-x.a>=n.length*0.9).sort((x,y)=>(y.b-y.a)-(x.b-x.a)))
    if(!take.some(t=>ch.a<t.b&&t.a<ch.b)) for(const c of ch.r) take.push(c);
  take.sort((x,y)=>x.a-y.a);
  const got=take.reduce((s,t)=>s+(t.b-t.a),0);
  return {clips:take.map(t=>t.u),share:n.length?got/n.length:0,from:[...new Set(take.map(t=>t.u.page))]};
}

/* ================= AND WHAT IS BROUGHT OVER ================= */
const bank={}, files=new Map(); let voiced=0, silent=[];
for(const T of targets){
  const c=cover(T.text);
  if(!c.clips.length||c.share<0.2){ silent.push(T); continue; }
  voiced++;
  bank[T.key]=c.clips.map(x=>[x.key,x.ms]);
  for(const x of c.clips) files.set(x.key,path.join(SG,'voices',x.key.slice(0,2),x.key+'.webm'));
  console.log('  '+T.key.padEnd(26)+String(Math.round(c.share*100)).padStart(4)+'% of the verse  '+String(c.clips.length).padStart(2)+' clip(s)  '+c.from.join(','));
}
let bytes=0, lost=0;
for(const [k,f] of files){ if(fs.existsSync(f)) bytes+=fs.statSync(f).size; else lost++; }
console.log('\n'+voiced+' of '+targets.length+' captions voiced · '+files.size+' clips · '+(bytes/1048576).toFixed(2)+' MB'+(lost?' · '+lost+' clip file(s) MISSING':''));
const byFilm={}; for(const T of silent) (byFilm[T.film]=byFilm[T.film]||[]).push(T.key);
for(const f in byFilm) console.log('  not voiced  '+f.padEnd(12)+byFilm[f].join('  '));
/* (required by another tool, it lends the matching and copies nothing) */
if(require.main!==module){ module.exports={passages,units,norm,targets,cover}; return; }
if(DRY) process.exit(0);

fs.mkdirSync(OUT,{recursive:true});
const keep=new Set([...files.keys()].map(k=>k+'.webm'));
for(const f of fs.readdirSync(OUT)) if(f.endsWith('.webm')&&!keep.has(f)) fs.unlinkSync(path.join(OUT,f));
for(const [k,f] of files) if(fs.existsSync(f)) fs.copyFileSync(f,path.join(OUT,k+'.webm'));
fs.writeFileSync(path.join(OUT,'bank.js'),
  '/* GENERATED by tools/import-voices.js from Scripture-Game\'s own recordings — do not hand-edit.\n'+
  '   For each caption of the films ("book ch:v[-v]"), and for each scroll\'s own verse ("scroll:<id>"),\n'+
  '   the recordings that speak its words, in the order the verse has them: [key, milliseconds]. */\n'+
  'window.UNFOLD_VOICES='+JSON.stringify({ext:'webm',v:bank})+';\n');
console.log('written: scripture-unfolds/voices/bank.js and '+files.size+' clips');
