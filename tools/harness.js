/* THE HARNESS — the world raised in a headless browser, so that nothing in
   the audit is ever claimed without having been seen. Every round since the
   first has been run through something like this; this is that machinery
   made a committed file rather than a throwaway script.

   node tools/harness.js            — boot, shoot, report
   node tools/harness.js --shot out.png
*/
const path=require('path');
const ROOT=path.resolve(__dirname,'..');
let chromium;
try{ ({chromium}=require('playwright')); }
catch(e){ ({chromium}=require(require('child_process')
  .execSync('npm root -g').toString().trim()+'/playwright')); }

const EXEC=process.env.PW_CHROMIUM||undefined;

async function open(opts){
  opts=opts||{};
  const browser=await chromium.launch({
    executablePath:EXEC,
    args:['--use-gl=swiftshader','--enable-unsafe-swiftshader','--disable-gpu-sandbox',
          '--no-sandbox','--ignore-gpu-blocklist','--allow-file-access-from-files']});
  const page=await browser.newPage({viewport:{width:opts.w||1280,height:opts.h||760}});
  const errs=[];
  page.on('pageerror',e=>errs.push(String((e&&e.stack)||(e&&e.message)||e)));
  page.on('console',m=>{ if(m.type()==='error') errs.push('console: '+m.text()); });
  /* the second game is opened by the same machinery — it is the same engine,
     the same world and the same Besorah, and the acceptance suite has to be
     able to ask it questions too (§5's handshake) */
  await page.goto('file://'+path.join(ROOT,opts.page||'index.html'));
  if(opts.page) return {browser,page,errs};
  /* the world builds under the loading screen; the menu is the sign it stands */
  await page.waitForFunction(()=>window.__VDBG&&document.getElementById('menu')&&
    getComputedStyle(document.getElementById('menu')).display!=='none',null,{timeout:180000});
  return {browser,page,errs};
}
/* ---- THE COURSE OF THE DAY IS TAKEN OFF 'live' THE MOMENT WE SET FORTH ----
   THE FAULT THIS MENDS cost Rounds 78, 79 and 80 most of their scratchpad
   readings, and it is silent, which is what makes it worth a guard rather
   than a note. The engine says it plainly beside `setLocalHour` itself:

     "a scene must be able to take the clock off 'live' first, or the
      real-world hour is read back over it four times a second."

   The game opens on DAYPARTS[0], which is 'live' — the hour of the machine
   the game is running on, re-read four times a second. So a tool that calls
   `setLocalHour(14, x, z)` and then measures is not measuring two o'clock. It
   is measuring whatever o'clock the room is in, and it gets no error and no
   warning: the call returns, the number goes in, and a quarter of a second
   later the sky is put back. On the machine this was found on the clock stood
   at 3.9 a.m., so every probe ran in permanent night with the world asleep —
   and read out beasts that never moved, hunts that never landed, and a lion
   "at rest 100% of the time" who is at rest a fifth of it.

   `tools/acceptance.js` was never caught by it, because its shared setup
   takes the clock off 'live' before the first test on the one page they all
   share. Every OTHER tool was, and every future one would be. So it is done
   HERE, once, for everything that sets forth — the suite included, where it
   is simply idempotent. A tool that genuinely wants the room's own clock can
   ask for it back with `page.evaluate` in one line; nothing should get it by
   accident. */
async function holdClock(page,part){
  await page.evaluate(k=>{ const D=window.__VDBG; if(!D||!D.DAYPARTS) return;
    const i=D.DAYPARTS.findIndex(d=>d.k===k);
    if(i>=0){ D.state.dayIdx=i; D.applyDayPart(); } }, part||'noon');
}
/* and the hour itself, set so that it STICKS — the clock is taken off 'live'
   first and then the hour is asked for, which is the only order that works */
async function holdHour(page,h,x,z){
  await holdClock(page);
  await page.evaluate(a=>{ const D=window.__VDBG;
    D.setLocalHour(a.h, a.x===undefined?D.state.walk.x:a.x,
                        a.z===undefined?D.state.walk.z:a.z); },{h,x,z});
}
/* set forth: the menu's own button, then wait for the voyage to be under way */
async function sail(page,roam){
  await page.evaluate(r=>{ const b=document.getElementById(r?'m-roam':'m-new');
    b.click(); const c=document.getElementById('mc-anew');
    if(c&&getComputedStyle(document.getElementById('m-confirm')).display!=='none') c.click(); },!!roam);
  await page.waitForFunction(()=>window.__VDBG&&window.__VDBG.state&&window.__VDBG.state.begun!==false&&
    getComputedStyle(document.getElementById('boot')).display==='none',null,{timeout:180000});
  await page.waitForTimeout(1500);
  await holdClock(page);              /* see above — never the room's clock */
}
async function shot(page,file){ await page.screenshot({path:file}); return file; }
module.exports={open,sail,shot,holdClock,holdHour,ROOT};
