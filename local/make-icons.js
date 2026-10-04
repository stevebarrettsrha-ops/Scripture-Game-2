/* Makes the desktop icons from local/icon.svg — icon.png (512), icon.ico (Windows) and
   icon.icns (macOS) — by drawing the SVG in a headless browser at each size. Only needed when
   the mark changes; the made files are committed.   node local/make-icons.js */
const fs=require('fs'), path=require('path');
let chromium; try{ ({chromium}=require('playwright')); }catch(e){ ({chromium}=require(require('child_process').execSync('npm root -g').toString().trim()+'/playwright')); }
const HERE=__dirname, svg=fs.readFileSync(path.join(HERE,'icon.svg'),'utf8');
(async()=>{
  const browser=await chromium.launch(); const png={};
  try{ for(const s of [16,32,48,64,128,256,512,1024]){
      const page=await browser.newPage({viewport:{width:s,height:s}});
      await page.setContent(`<html><body style="margin:0;background:transparent">${svg.replace('<svg ',`<svg width="${s}" height="${s}" `)}</body></html>`);
      png[s]=await page.screenshot({omitBackground:true,clip:{x:0,y:0,width:s,height:s}}); await page.close(); } }
  finally{ await browser.close(); }
  fs.writeFileSync(path.join(HERE,'icon.png'),png[512]);
  /* ICO: a directory of PNG images (Windows Vista and later read PNG inside an ICO) */
  const ico=[16,32,48,64,128,256], head=Buffer.alloc(6+16*ico.length); head.writeUInt16LE(0,0); head.writeUInt16LE(1,2); head.writeUInt16LE(ico.length,4);
  let off=head.length; ico.forEach((s,i)=>{ const e=6+16*i; head.writeUInt8(s>=256?0:s,e); head.writeUInt8(s>=256?0:s,e+1); head.writeUInt16LE(1,e+4); head.writeUInt16LE(32,e+6);
    head.writeUInt32LE(png[s].length,e+8); head.writeUInt32LE(off,e+12); off+=png[s].length; });
  fs.writeFileSync(path.join(HERE,'icon.ico'),Buffer.concat([head,...ico.map(s=>png[s])]));
  /* ICNS: typed PNG entries (ic07 128, ic08 256, ic09 512, ic10 1024, ic11 32 @2x of 16, ic12 64 @2x of 32) */
  const icns=[['icp4',16],['icp5',32],['ic11',32],['ic12',64],['ic07',128],['ic08',256],['ic09',512],['ic10',1024]].map(([t,s])=>{
    const h=Buffer.alloc(8); h.write(t,0,'ascii'); h.writeUInt32BE(png[s].length+8,4); return Buffer.concat([h,png[s]]); });
  const body=Buffer.concat(icns), h=Buffer.alloc(8); h.write('icns',0,'ascii'); h.writeUInt32BE(body.length+8,4);
  fs.writeFileSync(path.join(HERE,'icon.icns'),Buffer.concat([h,body]));
  console.log('icon.png, icon.ico, icon.icns written');
})().catch(e=>{ console.error(e); process.exit(1); });
