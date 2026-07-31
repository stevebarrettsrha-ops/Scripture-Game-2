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
*/
window.BESORAH=(function(){
  const BOOKS={};
  function book(b){ BOOKS[b.id]=b; }
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
  /* the scrolls this game has loaded, for the shelf and the log */
  function shelf(){ return Object.keys(BOOKS).map(k=>({id:k,
    hebrew:BOOKS[k].hebrew, english:BOOKS[k].english,
    chapters:Object.keys(BOOKS[k].chapters).length})); }
  function has(id){ return !!BOOKS[id]; }
  return {book,get,chapter,v,range,ref,quote,shelf,has};
})();
