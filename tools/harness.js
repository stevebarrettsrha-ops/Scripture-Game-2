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
  await page.goto('file://'+path.join(ROOT,'index.html'));
  /* the world builds under the loading screen; the menu is the sign it stands */
  await page.waitForFunction(()=>window.__VDBG&&document.getElementById('menu')&&
    getComputedStyle(document.getElementById('menu')).display!=='none',null,{timeout:180000});
  return {browser,page,errs};
}
/* set forth: the menu's own button, then wait for the voyage to be under way */
async function sail(page,roam){
  await page.evaluate(r=>{ const b=document.getElementById(r?'m-roam':'m-new');
    b.click(); const c=document.getElementById('mc-anew');
    if(c&&getComputedStyle(document.getElementById('m-confirm')).display!=='none') c.click(); },!!roam);
  await page.waitForFunction(()=>window.__VDBG&&window.__VDBG.state&&window.__VDBG.state.begun!==false&&
    getComputedStyle(document.getElementById('boot')).display==='none',null,{timeout:180000});
  await page.waitForTimeout(1500);
}
async function shot(page,file){ await page.screenshot({path:file}); return file; }
module.exports={open,sail,shot,ROOT};
