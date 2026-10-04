/* THE SAVES FOLDER — progress kept in the game's own files.

   Played from the local launchers or the desktop shortcuts, the game's progress is written into
   the `saves/` folder beside it, not only into the browser: where the ship lies, the log and the
   scrolls, the story's acts and choices, the settings, and every block dug or built (one file
   for each edited piece of the world, in saves/world/). So it survives the browser's data being
   cleared, is the same in every browser on the computer, and can be backed up or carried to
   another computer by copying the folder.

   The browser's own storage is kept as the game's working copy; the folder is the master. When
   a page opens, the folder is read (synchronously, from this computer's own server, before any
   of the game's scripts look for a save) and laid into the browser's storage; every change the
   game writes is sent back to the folder. Empty the folder and the game starts afresh.

   Online (a hosted copy) or opened straight from its folder there is no local server to keep the
   files, and this does nothing: the game saves in the browser as it always has. */
(function(){
  'use strict';
  var on=/^(localhost|127\.0\.0\.1|\[::1\])$/.test(location.hostname)&&location.protocol==='http:';
  var LS=null; try{ LS=window.localStorage; }catch(e){}
  var api={on:false,world:null,worldJoined:false,put:function(){},del:function(){},flush:function(){ return Promise.resolve(false); },markWorld:function(){}};
  window.LOCALSAVE=api;
  if(!on||!LS) return;
  var files=null;
  try{ var x=new XMLHttpRequest(); x.open('GET','/__saves',false); x.send();
    if(x.status===200) files=JSON.parse(x.responseText).files; }catch(e){}
  if(!files) return;                                   /* a server without a saves folder: nothing to do */

  var FLAG='__savesFolder';                            /* this browser has been joined to the folder */
  /* and, apart from it, the WORLD: the block edits are carried into the folder only by the voyage
     itself (js/engine.js, editsLoad), and only then is this set — the story's and Scripture
     Unfolds' pages join the folder too but never read the world, so their joining must not count */
  var WFLAG='__savesWorld';
  var mine=function(k){ return k===FLAG||k===WFLAG; };            /* this file's own marks: never mirrored */
  var enc=function(s){ return String(s).replace(/[^A-Za-z0-9._-]/g,function(c){ var h=c.charCodeAt(0).toString(16); return '~'+(h.length<=2?('0'+h).slice(-2):('u'+('000'+h).slice(-4))); }); };
  var proto=Storage.prototype, set0=proto.setItem, rem0=proto.removeItem, clr0=proto.clear;

  /* ---- the folder, read in ---- */
  var keys={}, world={};
  for(var name in files){
    try{ var rec=JSON.parse(files[name]);
      if(name.indexOf('world/')===0) world[name.slice(6)]=rec;
      else if(rec&&typeof rec.key==='string') keys[rec.key]=rec.json?JSON.stringify(rec.value):String(rec.value); }catch(e){}
  }
  var joined=LS.getItem(FLAG)==='1';
  /* the first time this browser meets the folder, what it already holds is carried INTO the folder
     (nothing is lost); after that the folder decides, so a key it no longer has is taken away */
  var carry=[];
  for(var i=LS.length-1;i>=0;i--){ var k=LS.key(i); if(mine(k)) continue;
    if(!(k in keys)){ if(joined) rem0.call(LS,k); else carry.push(k); } }
  for(var k2 in keys) set0.call(LS,k2,keys[k2]);
  set0.call(LS,FLAG,'1');
  api.on=true;
  api.world=world;                                     /* the block edits, for the engine to take up */
  api.worldJoined=LS.getItem(WFLAG)==='1';
  api.markWorld=function(){ set0.call(LS,WFLAG,'1'); api.worldJoined=true; };

  /* ---- and written back ---- */
  var pending={}, timer=null;
  function send(path,body,leaving){
    /* a request that must outlive the page is sent 'keepalive' (the browser allows those about
       64 KB in all); an ordinary one is not, so a large save is never refused for its size */
    var opt={method:body===null?'DELETE':'PUT',keepalive:!!leaving&&(body===null||body.length<60000)};
    if(body!==null){ opt.body=body; opt.headers={'Content-Type':'application/json'}; }
    try{ return fetch('/__saves/'+path,opt).then(function(r){ return r.ok; },function(){ return false; }); }catch(e){ return Promise.resolve(false); }
  }
  /* answers a promise of whether everything sent was written */
  function flush(leaving){ if(timer){ clearTimeout(timer); timer=null; } var p=pending, sent=[]; pending={};
    for(var path in p) sent.push(send(path,p[path],leaving===true));
    return Promise.all(sent).then(function(r){ return r.every(Boolean); }); }
  function queue(path,body){ pending[path]=body; if(!timer) timer=setTimeout(flush,250); }
  function recOf(k,v){ var r={key:k,saved:new Date().toISOString()};
    try{ var o=JSON.parse(v); if(o!==null&&typeof o==='object'){ r.json=true; r.value=o; return JSON.stringify(r,null,1); } }catch(e){}
    r.value=v; return JSON.stringify(r,null,1); }
  api.put=function(path,text){ queue(path,text); };
  api.del=function(path){ queue(path,null); };
  api.flush=function(){ return flush(document.hidden); };
  api.enc=enc;
  proto.setItem=function(k,v){ set0.call(this,k,v); if(this===LS&&!mine(k)) queue(enc(k)+'.json',recOf(k,String(v))); };
  proto.removeItem=function(k){ rem0.call(this,k); if(this===LS&&!mine(k)) queue(enc(k)+'.json',null); };
  proto.clear=function(){ var w=this===LS&&LS.getItem(WFLAG);
    if(this===LS){ for(var i=0;i<LS.length;i++){ var k=LS.key(i); if(!mine(k)) queue(enc(k)+'.json',null); } }
    clr0.call(this); if(this===LS){ set0.call(LS,FLAG,'1'); if(w) set0.call(LS,WFLAG,w); } };
  for(var j=0;j<carry.length;j++) queue(enc(carry[j])+'.json',recOf(carry[j],LS.getItem(carry[j])));
  /* what is still waiting goes before the page does */
  addEventListener('pagehide',function(){ flush(true); });
  addEventListener('visibilitychange',function(){ if(document.hidden) flush(true); });
})();
