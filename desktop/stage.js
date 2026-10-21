/* STAGING THE GAME FOR THE DESKTOP BUILD: the files the game plays from, copied into desktop/game, and
   nothing it does not (the tools, the screenshots, the saves of whoever builds it, git's own history). */
const fs=require('fs'), path=require('path');
const SRC=path.resolve(__dirname,'..'), DST=path.join(__dirname,'game');
const SKIP=new Set(['.git','.github','.claude','desktop','node_modules','tools','saves','AUDIT.md','PLAN.md','REVIEW.md','TRUE-MEASURES.md','ROADMAP-LIVING-WORLD.md']);
const skip=n=>SKIP.has(n)||/^screenshots/.test(n)||/^Install-Desktop-Shortcut|^Play-/.test(n)||n.endsWith('.pdf');
fs.rmSync(DST,{recursive:true,force:true});
let files=0, bytes=0;
(function copy(a,b,top){ fs.mkdirSync(b,{recursive:true});
  for(const e of fs.readdirSync(a,{withFileTypes:true})){ if(top&&skip(e.name)) continue; if(e.name==='.DS_Store') continue;
    const s=path.join(a,e.name), d=path.join(b,e.name);
    if(e.isDirectory()) copy(s,d,false); else if(e.isFile()){ fs.copyFileSync(s,d); files++; bytes+=fs.statSync(s).size; } } })(SRC,DST,true);
console.log('staged '+files+' files, '+(bytes/1048576).toFixed(1)+' MB, in desktop/game');
