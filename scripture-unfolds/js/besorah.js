/* ================= THE BESORAH, AS THE DIRECTOR =================
   The scrolls are the script. Not a paraphrase of the script — the script.

   Every caption a cutscene shows and every word a mission speaks is FETCHED
   from here by book, chapter and verse, so nothing in this game can ever say
   a thing the scripture does not say. If a verse reads differently in the
   Besorah, it reads differently in the game the next time it is opened; there
   is no second copy to keep in step.

   The text itself lives in ../scripture/*.js, generated straight out of
   BESORAH - SCRIPTURAL/besorah-offline (1).html.

     BESORAH.v('bereshith',1,3)        one verse, as a string
     BESORAH.ref('bereshith',1,3)      'BERĔSHITH 1:3'
     BESORAH.range('bereshith',1,3,5)  [{n,t}, …] — a run of verses
     BESORAH.chapter('bereshith',1)    the whole chapter
     BESORAH.quote('bereshith',1,3)    {text, ref} — ready for a caption

   ---- AND A SCROLL IS UNROLLED WHEN IT IS TAKEN DOWN ----
   Eight books is two megabytes of scripture, and for a long while three of
   them were `<script src>` tags in the page: every word of Berĕshith and
   both books of Adawm parsed before the shelf could be drawn, whether or not
   anyone meant to read them. Five more would have trebled that, and the
   brief is plain that this has to run on a phone.

   So the page loads ONE small file at boot — `scripture/index.js`, the spine
   of every scroll: its id, its two names, how many chapters. That is enough
   to draw the shelf and name a passage. The book itself is fetched the
   moment somebody chooses it, once, and kept.

     BESORAH.index([…])                the spine, at boot
     BESORAH.titles()                  every scroll the shelf knows of
     BESORAH.name('yobelim')           {id,hebrew,english,chapters} or null
     BESORAH.open('yobelim')           a Promise: the book, fetched and kept
     BESORAH.loaded('yobelim')         is it already in hand?

   `v`, `quote` and the rest still throw on a book that is not open, and that
   is deliberate: a caption fetched before its scroll was unrolled is a bug
   in the caller, not something to paper over with an empty string.        */
window.BESORAH=(function(){
  const BOOKS={};
  /* ---- the spine, and the fetching ---- */
  const SPINE={}, PEND={};
  let DIR='scripture/';
  function index(list){ for(const b of list||[]) SPINE[b.id]=b; }
  function titles(){ return Object.keys(SPINE).map(k=>SPINE[k]); }
  function name(id){ return SPINE[id]||(BOOKS[id]?
    {id:id,hebrew:BOOKS[id].hebrew,english:BOOKS[id].english,
     chapters:Object.keys(BOOKS[id].chapters).length}:null); }
  function loaded(id){ return !!BOOKS[id]; }
  function open(id){
    if(BOOKS[id]) return Promise.resolve(BOOKS[id]);
    if(PEND[id]) return PEND[id];
    if(!SPINE[id]) return Promise.reject(new Error('BESORAH: no such scroll — '+id));
    return PEND[id]=new Promise(function(res,rej){
      const s=document.createElement('script');
      s.src=DIR+id+'.js';
      s.onload=function(){ delete PEND[id];
        if(BOOKS[id]) res(BOOKS[id]);
        else rej(new Error('BESORAH: '+id+'.js was read but held no scroll')); };
      s.onerror=function(){ delete PEND[id];
        rej(new Error('BESORAH: the scroll of '+id+' could not be opened')); };
      document.head.appendChild(s);
    });
  }
  function where(d){ DIR=d; }

  function book(b){ BOOKS[b.id]=b; if(!SPINE[b.id]) SPINE[b.id]=name(b.id); }
  function get(id){ const b=BOOKS[id];
    if(!b) throw new Error('BESORAH: no such scroll — '+id);
    return b; }
  function chapter(id,ch){ const b=get(id), c=b.chapters[String(ch)];
    if(!c) throw new Error('BESORAH: '+b.hebrew+' has no chapter '+ch);
    return c.map(v=>({n:v[0],t:v[1]})); }
  function v(id,ch,n){
    const c=get(id).chapters[String(ch)];
    if(!c) throw new Error('BESORAH: '+id+' has no chapter '+ch);
    for(const row of c) if(row[0]===n) return row[1];
    throw new Error('BESORAH: '+id+' '+ch+':'+n+' is not written');
  }
  function range(id,ch,a,b2){ return chapter(id,ch).filter(x=>x.n>=a&&x.n<=(b2===undefined?a:b2)); }
  function ref(id,ch,n,n2){
    return get(id).hebrew+' '+ch+':'+n+(n2&&n2!==n?'-'+n2:''); }
  function quote(id,ch,n,n2){
    const vs=range(id,ch,n,n2===undefined?n:n2);
    return { text:vs.map(x=>x.t).join(' '), ref:ref(id,ch,n,n2) }; }
  /* every scroll this game KNOWS OF, whether or not it is open yet — which
     is what a shelf is, and what the log must be matched against */
  function shelf(){ return titles(); }
  function list(){ return Object.keys(SPINE); }
  function has(id){ return !!SPINE[id]||!!BOOKS[id]; }
  return {book,get,chapter,v,range,ref,quote,shelf,has,
          index,titles,name,list,open,loaded,where};
})();
