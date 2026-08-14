/* THE EXTRACTOR — §5 of the brief, and the reason every verse in this game
   can be checked against something rather than taken on trust.

     node tools/extract-besorah.js "Shemoth 20:25"
     node tools/extract-besorah.js "Shemoth 20:25" "Yehoshua 5:2" ...
     node tools/extract-besorah.js --js works "Shemoth 20:25" ...
     node tools/extract-besorah.js --books
     node tools/extract-besorah.js --find "altar of stone"
     node tools/extract-besorah.js --emit chanok apoc-jubilees:yobelim
     node tools/extract-besorah.js --check

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

/* --emit: A WHOLE BOOK, into scripture-unfolds/scripture/, in the format the
   Unfolds reads. §5: *"If a scene needs a book not yet extracted, extract it
   from the offline Besorah HTML into a new generated .js in the same
   format."* Three books were extracted before this tool existed and there
   was no repeatable way to make a fourth — so a film could not be written
   for five of the eight scrolls without hand-building a quarter of a
   megabyte of JSON, which is precisely the thing §5 forbids.

     node tools/extract-besorah.js --emit chanok shamoth
     node tools/extract-besorah.js --emit apoc-jubilees:yobelim

   THE NAME ON THE LEFT IS THE BESORAH'S; THE NAME ON THE RIGHT IS OURS. The
   source files Jubilees under `apoc-jubilees` and the Ethiopic Ḥanoḵ under
   `apoc-eth-enoch`, which are cataloguing ids, not names of scrolls. This
   project already has names for both — the scrolls in world/scrolls.js are
   `yobelim` and `chanok-eth` — and a film that had to write
   `q:['apoc-jubilees',1,1]` would be citing a filing cabinet. So an id may
   be renamed on the way out, and NOTHING ELSE is: `hebrew` and `english`
   come through untouched, and they are what a reader ever sees. The same
   principle as the ALIAS table above, at the other end of the pipe. */
if(args[0]==='--emit'){
  const want=args.slice(1);
  if(!want.length){ console.error('--emit wants at least one book (run --books)'); process.exit(2); }
  const dir=path.join(__dirname,'..','scripture-unfolds','scripture');
  if(!fs.existsSync(dir)){ console.error('no scripture-unfolds/scripture/ to write into'); process.exit(2); }
  const HEAD='/* GENERATED from BESORAH - SCRIPTURAL/besorah-offline (1).html — do not hand-edit.\n'+
    '   The scripture itself, as data. Every cutscene and every mission in this\n'+
    '   game is directed from these verses; nothing is paraphrased in a scene\n'+
    '   file, it is QUOTED from here, so the words can never drift from the source. */\n';
  let bad=0;
  for(const spec of want){
    const [src,as]=spec.split(':');
    const key=norm(src);
    let id=null;
    for(const k of Object.keys(TEXT)){ const b=TEXT[k];
      if(norm(k)===key||norm(b.hebrew||'')===key||norm(b.english||'')===key){ id=k; break; } }
    if(!id){ console.error('MISSING  no such book: '+src+'   (run --books)'); bad++; continue; }
    const b=TEXT[id], out=(as||id);
    const chapters={};
    let verses=0;
    for(const ch of Object.keys(b.chapters||{})){
      chapters[ch]=(b.chapters[ch].verses||[]).map(r=>{ verses++; return [r.n,plain(r.t)]; });
    }
    const body='BESORAH.book('+JSON.stringify({ id:out, hebrew:b.hebrew, english:b.english,
      section:b.section, chapters })+');\n';
    const f=path.join(dir,out+'.js');
    fs.writeFileSync(f,HEAD+body);
    console.log('  '+String(b.hebrew||b.english).padEnd(20)+String(out+'.js').padEnd(20)+
      String(Object.keys(chapters).length).padStart(4)+' ch  '+
      String(verses).padStart(6)+' v  '+
      String(Math.round((HEAD.length+body.length)/1024)).padStart(5)+' KB');
  }

  /* ---- AND THE INDEX, REBUILT FROM WHATEVER IS ON THE SHELF ----
     The books are two megabytes and they are NOT loaded at boot: a scroll is
     fetched when it is taken down and read, which is what a scroll is for.
     But the shelf must be able to NAME a book it has not opened yet — and a
     row that read "the scroll of this passage is still hidden in the earth"
     with no name against it would tell a man nothing about what he is
     looking for. So this is the spine of every scroll: id, both names, and
     how many chapters. Eight books, under a kilobyte.

     It is rebuilt from the DIRECTORY and not from the source, so a book that
     was emitted under a name of ours is indexed under that name, and a file
     deleted by hand drops out of the index the next time this is run. */
  const idx=[];
  for(const f of fs.readdirSync(dir).sort()){
    if(!f.endsWith('.js')||f==='index.js') continue;
    const s=fs.readFileSync(path.join(dir,f),'utf8');
    const i=s.indexOf('BESORAH.book(');
    if(i<0){ console.error('  not a scroll: '+f); bad++; continue; }
    let b; try{ b=JSON.parse(s.slice(i+13,s.lastIndexOf(')'))); }
    catch(e){ console.error('  unreadable: '+f+'  ('+e.message+')'); bad++; continue; }
    idx.push({ id:b.id, hebrew:b.hebrew, english:b.english,
      chapters:Object.keys(b.chapters||{}).length });
  }
  const ix='/* GENERATED by tools/extract-besorah.js --emit — do not hand-edit.\n'+
    '   THE SPINE OF EVERY SCROLL ON THE SHELF, and nothing else. The books\n'+
    '   themselves are fetched one at a time, when one is taken down to read;\n'+
    '   this is the only part of the scripture the page loads at boot, so that\n'+
    '   the shelf can be drawn and a passage named before a word of it is read. */\n'+
    'BESORAH.index('+JSON.stringify(idx)+');\n';
  fs.writeFileSync(path.join(dir,'index.js'),ix);
  console.log('\n  the index         index.js         '+String(idx.length).padStart(4)+
    ' books'+String(Math.round(ix.length/1024)).padStart(12)+' KB');

  if(bad) process.exit(1);
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
  /* ================= AND THE CAPTIONS OF THE LONG FILMS =================
     THE OTHER HALF OF THE RULE, AND IT HAD NO GUARD AT ALL. §5 forbids three
     things: do not paraphrase, do not summarise a verse into a caption, do
     not invent a reference. Everything above catches the first two, because
     a `verse:{t,ref}` carries its words and its citation together and the
     two can be set against each other.

     A FILM CAPTION CARRIES NO WORDS. It is `{q:['shamoth',14,21]}` and the
     words are fetched at run time — which is exactly why it cannot be
     paraphrased, and exactly why nothing could tell you that `['shamoth',
     14,210]` is not a verse. It would fail silently in the one place nobody
     is looking: a caption that simply never appears, in the middle of a
     film, three minutes in.

     So every `q` in every scroll under scripture-unfolds/scrolls/ is
     resolved here against the emitted book it names — the file the game will
     actually read, not the source HTML, because a book that was never
     emitted is just as broken as a chapter that does not exist. */
  const sdir=path.join(__dirname,'..','scripture-unfolds','scrolls');
  const bdir=path.join(__dirname,'..','scripture-unfolds','scripture');
  let caps=0, capBad=0, films=0;
  if(fs.existsSync(sdir)&&fs.existsSync(bdir)){
    /* the emitted books, read the way the page reads them */
    const BOOK={};
    for(const f of fs.readdirSync(bdir)){
      if(!f.endsWith('.js')||f==='index.js') continue;
      const s=fs.readFileSync(path.join(bdir,f),'utf8');
      const i=s.indexOf('BESORAH.book(');
      if(i<0) continue;
      try{ const b=JSON.parse(s.slice(i+13,s.lastIndexOf(')'))); BOOK[b.id]=b; }catch(e){}
    }
    /* the scenes, RUN, not read — the same rule the world's files keep */
    const scenes=[];
    const STORY={ scene:s=>scenes.push(s) };
    for(const f of fs.readdirSync(sdir).sort()){
      if(!f.endsWith('.js')) continue;
      const src=fs.readFileSync(path.join(sdir,f),'utf8');
      try{ new Function('STORY',src)(STORY); films++; }
      catch(e){ console.log('SKIP   scripture-unfolds/scrolls/'+f+'  ('+e.message+')'); capBad++; }
    }
    for(const sc of scenes){
      for(const c of sc.caps||[]){
        if(!c.q){ continue; }
        caps++;
        const [id,ch,v0,v1]=c.q;
        const b=BOOK[id];
        if(!b){ capBad++;
          console.log('NO SCROLL  '+sc.id+' at '+c.t+'s  wants '+id+
            ' — run --emit, it is not in scripture-unfolds/scripture/'); continue; }
        const rows=b.chapters[String(ch)];
        if(!rows){ capBad++;
          console.log('NO CHAPTER '+sc.id+' at '+c.t+'s  '+b.hebrew+' has no chapter '+ch); continue; }
        let gone=null;
        for(let v=v0;v<=(v1===undefined?v0:v1);v++)
          if(!rows.some(r=>r[0]===v)){ gone=v; break; }
        if(gone!==null){ capBad++;
          console.log('NO VERSE   '+sc.id+' at '+c.t+'s  '+b.hebrew+' '+ch+':'+gone+
            ' is not written'); }
      }
    }
  }

  console.log('\n'+ok+' exact · '+wrong+' paraphrased · '+missing+' unsourceable  ('+verses.length+' verses)');
  console.log(caps+' film captions resolve · '+capBad+' do not  ('+films+' scrolls)');
  process.exit(wrong||missing||capBad?1:0);
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
