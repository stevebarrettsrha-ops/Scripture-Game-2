/* THE EXTRACTOR — §5 of the brief, and the reason every verse in this game
   can be checked against something rather than taken on trust.

     node tools/extract-besorah.js "Shemoth 20:25"
     node tools/extract-besorah.js "Shemoth 20:25" "Yehoshua 5:2" ...
     node tools/extract-besorah.js --js works "Shemoth 20:25" ...
     node tools/extract-besorah.js --books
     node tools/extract-besorah.js --find "altar of stone"

   THE RULE IT EXISTS TO KEEP. *Do not paraphrase. Do not summarise a verse
   into a caption. Do not invent a reference.* A verse written into this
   project from memory is a verse nobody can check, and a wrong one is worse
   than none at all — this is scripture and it is the whole point of the
   game. So every word of it comes out of the offline Besorah by this tool,
   and the tool is committed so the next person can run it and see the same.

   WHERE THE TEXT IS. `BESORAH - SCRIPTURAL/besorah-offline (1).html` is a
   single 8.8 MB file, and the scripture in it is NOT in the markup — it is
   one JSON blob in a <script id="text-data"> tag, keyed by book id, then by
   chapter, then a list of {n, t}. The `t` carries the site's own markup for
   the Names (<span class="dn">…</span>); that is stripped here, because the
   game draws its verses as plain text, and NOTHING ELSE is touched.

   THE BOOK NAMES ARE THE BESORAH'S OWN. `Shemoth`, not `Exodus`;
   `Beresheeth`/`Bereshith` as the file has it. `--books` prints every id and
   its name, which is the only honest way to find the one you want. A
   reference this file does not have is an error and prints as one: a verse
   that cannot be sourced does not ship. */
const fs=require('fs'), path=require('path');

const SRC=path.join(__dirname,'..','BESORAH - SCRIPTURAL','besorah-offline (1).html');

function load(){
  if(!fs.existsSync(SRC)){
    console.error('the Besorah is not where it should be:\n  '+SRC);
    process.exit(2);
  }
  const s=fs.readFileSync(SRC,'utf8');
  const m=s.match(/<script[^>]*id=["']text-data["'][^>]*>([\s\S]*?)<\/script>/);
  if(!m){ console.error('no <script id="text-data"> in the Besorah'); process.exit(2); }
  return JSON.parse(m[1]);
}

/* the site's own markup for the Names, and nothing else, taken off */
function plain(t){
  return String(t)
    .replace(/<[^>]+>/g,'')
    .replace(/&amp;/g,'&').replace(/&lt;/g,'<').replace(/&gt;/g,'>')
    .replace(/&quot;/g,'"').replace(/&#39;/g,"'").replace(/&nbsp;/g,' ')
    .replace(/\s+/g,' ')
    .trim();
}

/* ---- THE PROJECT'S OWN NAMES FOR THE BOOKS ----
   THE NAMES IN THIS GAME DO NOT CHANGE. The Besorah spells some books
   differently from the way this project has spelled them since its first
   round — DAḆARIM against DEḆARIM, YAHAZQ'AL against YEḤEZQAL, 1 MALAḴIM
   against MELAKIM ALEPH — and the answer to that is NOT to go through the
   world rewriting references. A reader who has seen DEḆARIM on a block since
   the beginning should go on seeing it.

   So the difference is reconciled HERE, once, in the tool. The source is
   consulted for the WORDS OF THE VERSE, which must be exact; the NAME the
   game prints is the project's own. Every alias below is a spelling of the
   same book, and nothing else may be added to this table — an alias that
   pointed at a different book would be a wrong reference wearing a right
   one's name, which is the very thing this tool exists to prevent. */
const ALIAS={
  'deḇarim':'dabarim',   'debarim':'dabarim',    /* Deuteronomy */
  'yeḥezqal':'yahazqal', 'yehezqal':'yahazqal',  /* Ezekiel */
  'ḥanok':'chanok',      'hanok':'chanok',       /* Enoch */
  'melakimaleph':'1malakim', 'melakhimaleph':'1malakim',   /* 1 Kings */
  'melakimbeth':'2malakim',
  'shemoth':'shamoth',                            /* Exodus */
  'yehoshua':'yahusha',  'yahoshua':'yahusha'     /* Joshua */
};
/* "Shemoth 20:25" -> {book:'shemoth', ch:'20', v:25}.  A book is matched on
   its id, its Hebrew name or its English name, spaces and punctuation
   ignored, so "1 Melakim", "1melakim" and "1 MELAKIM" are all the one book. */
/* The names carry marks — Ḇ, Ĕ, Ḥ, Ḏ, ' — and a comparison that simply threw
   away everything outside a-z turned DEḆARIM into "derim" and matched
   nothing. They are DECOMPOSED and their marks dropped, so Ḇ folds to b and
   Ĕ to e, which is what makes ḤANOḴ and ḤANOK the same book without needing
   to be told. */
function norm(s){ return String(s).normalize('NFD').replace(/[\u0300-\u036f]/g,'')
  .toLowerCase().replace(/[^a-z0-9]/g,''); }
function resolve(TEXT,ref){
  /* a RANGE is a reference too — "DANIAL 4:10-11" and the same with an en
     dash — and a verse that spans two is quoted as the two run together,
     which is how it reads on the page and how this project already writes it */
  const m=String(ref).match(/^\s*(.+?)\s+(\d+)\s*:\s*(\d+)\s*(?:[-–—]\s*(\d+))?\s*$/);
  if(!m) return {err:'not a reference: '+ref+'  (wanted e.g. "Shamoth 20:25")'};
  let want=norm(m[1]); if(ALIAS[want]) want=ALIAS[want];
  const ch=m[2], v0=parseInt(m[3],10), v1=m[4]?parseInt(m[4],10):null;
  let book=null;
  for(const k of Object.keys(TEXT)){ const b=TEXT[k];
    if(norm(k)===want||norm(b.hebrew||'')===want||norm(b.english||'')===want){ book=b; break; } }
  if(!book) return {err:'no such book: '+m[1]+'   (run --books)'};
  const c=book.chapters&&book.chapters[ch];
  if(!c) return {err:'no chapter '+ch+' in '+(book.hebrew||book.english)};
  const parts=[];
  for(let v=v0;v<=(v1===null?v0:v1);v++){
    const row=(c.verses||[]).find(q=>q.n===v);
    if(!row) return {err:'no verse '+v+' in '+(book.hebrew||book.english)+' '+ch};
    parts.push(plain(row.t));
  }
  /* AND THE REFERENCE COMES BACK IN THE NAME IT WAS ASKED IN. A tool that
     quietly answered "DAḆARIM" to a question about "DEḆARIM" would walk its
     own spelling into the world one pasted verse at a time. */
  const nm=m[1].trim();
  return {book:book.hebrew||book.english, ref:nm+' '+ch+':'+v0+(v1===null?'':'-'+v1),
          t:parts.join(' ')};
}

const TEXT=load();
const args=process.argv.slice(2);

if(!args.length||args[0]==='--help'){
  console.log(fs.readFileSync(__filename,'utf8').split('*/')[0].replace(/^\/\*\s*/,''));
  process.exit(0);
}

/* --books: every book this file has, so a reference is never guessed at */
if(args[0]==='--books'){
  const rows=Object.keys(TEXT).sort().map(k=>{ const b=TEXT[k];
    return '  '+(b.hebrew||'').padEnd(22)+(b.english||'').padEnd(22)+
           String(b.chapter_count||'?').padStart(3)+' ch   ['+k+']'; });
  console.log(rows.join('\n')+'\n\n'+rows.length+' books');
  process.exit(0);
}

/* --find: search every verse for a phrase, and print the references.
   This is how a verse half-remembered is turned into one that can be cited,
   rather than written down the way it is half-remembered. */
if(args[0]==='--find'){
  const needle=norm(args[1]||'');
  if(!needle){ console.error('--find wants a phrase'); process.exit(2); }
  let n=0;
  for(const k of Object.keys(TEXT)){ const b=TEXT[k];
    for(const ch of Object.keys(b.chapters||{})){
      for(const row of b.chapters[ch].verses||[]){
        const t=plain(row.t);
        if(norm(t).indexOf(needle)<0) continue;
        n++;
        console.log((b.hebrew||b.english)+' '+ch+':'+row.n);
        console.log('    '+t);
        if(n>=40){ console.log('\n(stopped at 40)'); process.exit(0); }
      } } }
  console.log('\n'+n+' found');
  process.exit(0);
}

/* --check: EVERY VERSE THIS PROJECT SHIPS, SET AGAINST THE SOURCE.
   The extractor is only half the rule. A verse can be extracted correctly on
   Monday and edited into a paraphrase on Tuesday, and nothing would say a
   word — so this walks the world's own files, takes every `verse:{t,ref}`
   they register, resolves the reference and compares the text to the letter.

   It does not parse the files by regular expression: it RUNS them, against a
   stand-in `EARTH` that collects what they register, which is exactly how the
   game loads them. So what is checked is what ships. */
if(args[0]==='--check'){
  const files=[];
  for(const dir of ['world','blocks','countries','cities','creatures']){
    const d=path.join(__dirname,'..',dir);
    if(!fs.existsSync(d)) continue;
    for(const f of fs.readdirSync(d)) if(f.endsWith('.js')) files.push(path.join(d,f));
  }
  const got=[];
  const collect=o=>{ if(o&&typeof o==='object') got.push(o); };
  const EARTH=new Proxy({},{ get:(t,k)=>{
    if(k==='mineralList'||k==='blockList') return [];
    return (...a)=>{ for(const x of a) collect(x); }; } });
  const win={EARTH};
  for(const f of files){
    const src=fs.readFileSync(f,'utf8');
    try{ new Function('EARTH','window','MANIFEST','PALETTE','document','console',src)
      (EARTH,win,{load:()=>{}},{},{createElement:()=>({getContext:()=>({})})},console); }
    catch(e){ /* a file that needs more of the world than this is skipped, and
                 says so, rather than being silently counted as clean */
      console.log('SKIP   '+path.relative(path.join(__dirname,'..'),f)+'  ('+e.message+')'); }
  }
  /* every verse anywhere in what was registered, however deep */
  const seen=new Set(), verses=[];
  const walk=(o,where)=>{
    if(!o||typeof o!=='object'||seen.has(o)) return;
    seen.add(o);
    if(o.verse&&o.verse.t&&o.verse.ref){ verses.push({v:o.verse,of:o.id||o.n||where});
      seen.add(o.verse); }                    /* counted once, not once per path */
    if(o.t&&o.ref&&typeof o.t==='string'&&typeof o.ref==='string'&&!o.verse)
      verses.push({v:o,of:where});
    for(const k of Object.keys(o)) walk(o[k],o.id||o.n||where);
  };
  for(const o of got) walk(o,'?');
  let ok=0, wrong=0, missing=0;
  for(const q of verses){
    const r=resolve(TEXT,q.v.ref);
    if(r.err){ missing++;
      console.log('NO SOURCE  '+String(q.of)+'  '+q.v.ref+'\n           '+r.err); continue; }
    const a2=plain(q.v.t), b2=r.t;
    if(a2===b2){ ok++; continue; }
    /* a verse quoted in PART is honest — the whole of Bereshith 14:10 is not
       wanted on a block of slime. What is not honest is words that are not
       in it, so a shipped text that is a contiguous piece of the source
       passes, and anything else does not. */
    if(b2.indexOf(a2)>=0){ ok++; continue; }
    wrong++;
    console.log('PARAPHRASE '+String(q.of)+'  '+q.v.ref);
    console.log('   ships:  '+a2);
    console.log('   source: '+b2);
  }
  console.log('\n'+ok+' exact · '+wrong+' paraphrased · '+missing+' unsourceable  ('+verses.length+' verses)');
  process.exit(wrong||missing?1:0);
}

/* --js <name>: print the verses as this project writes them, ready to paste
   into a world/*.js — which is the whole point, so that what ships and what
   was extracted cannot drift apart. */
let asJs=null, refs=args;
if(args[0]==='--js'){ asJs=args[1]||'verses'; refs=args.slice(2); }

let bad=0;
const out=[];
for(const ref of refs){
  const r=resolve(TEXT,ref);
  if(r.err){ console.error('MISSING  '+r.err); bad++; continue; }
  out.push(r);
}
if(asJs){
  console.log('/* extracted by tools/extract-besorah.js — do not edit by hand */');
  for(const r of out)
    console.log('verse:{ t:'+JSON.stringify(r.t)+',\n        ref:'+JSON.stringify(r.ref)+' },');
}else{
  for(const r of out){ console.log(r.ref); console.log('    '+r.t); }
}
if(bad){ console.error('\n'+bad+' reference(s) could not be sourced — they do not ship.'); process.exit(1); }
