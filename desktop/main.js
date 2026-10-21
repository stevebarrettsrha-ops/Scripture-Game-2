/* THE VOYAGE AS A GAME OF ITS OWN — the desktop program for Linux and Windows.

   The same game as the folder and the launchers, played in a window of its own instead of a browser:
   - drawn on the computer's real graphics card always (a browser may quietly fall back to drawing in
     software, a frame a second, and then the land comes in over minutes as if it were not there);
   - given room: the page may use as much memory as the true earth wants;
   - the game's files served from within the program, as the launchers serve them (local/serve.js), and
     the saves kept where the computer keeps a program's own data, so they outlive an update.

   The window opens on the voyage; the menu bar takes you to The Fullness of Time or Scripture Unfolds.
   F11 is the whole screen. */
const {app,BrowserWindow,Menu,shell}=require('electron');
const path=require('path'), http=require('http'), fs=require('fs');

/* ---- THE GRAPHICS CARD, ALWAYS ----
   The block list is what makes a browser refuse an older or less common card and draw in software;
   the game wants the card whatever the list says. */
app.commandLine.appendSwitch('ignore-gpu-blocklist');
app.commandLine.appendSwitch('enable-gpu-rasterization');
app.commandLine.appendSwitch('enable-zero-copy');
app.commandLine.appendSwitch('force_high_performance_gpu');              /* the strong card of two, on a laptop */
app.commandLine.appendSwitch('js-flags','--max-old-space-size=8192');    /* the true earth wants room */
app.commandLine.appendSwitch('autoplay-policy','no-user-gesture-required');
/* ON LINUX: Ubuntu 24.04 forbids the namespaces Chromium's sandbox is built on, and an AppImage cannot carry
   the helper that would stand in for them, so the program would not open at all; the window shows only the
   game's own files from this computer, so it goes without that sandbox. And it runs on Wayland or X alike. */
if(process.platform==='linux'){ app.commandLine.appendSwitch('no-sandbox'); app.commandLine.appendSwitch('ozone-platform-hint','auto'); }

/* where the game's files are: beside this file while it is being made (desktop/game, staged by
   stage.js, or the repository itself), and in the program's resources once it is installed */
function gameRoot(){
  for(const p of [path.join(process.resourcesPath||'','game'),path.join(__dirname,'game'),path.resolve(__dirname,'..')])
    if(fs.existsSync(path.join(p,'index.html'))&&fs.existsSync(path.join(p,'local','serve.js'))) return p;
  throw new Error('the game files were not found'); }

let base=null;
function serve(root){
  const {handler}=require(path.join(root,'local','serve.js'));
  const h=handler({saves:path.join(app.getPath('userData'),'saves')});
  return new Promise((res,rej)=>{ const srv=http.createServer(h);
    srv.once('error',rej); srv.listen(0,'127.0.0.1',()=>res('http://127.0.0.1:'+srv.address().port+'/')); }); }

/* ---- THE SAVES KEEP THEIR PORT ----
   The browser's own storage, which the game keeps as its working copy, is held per address; a new port
   every time would show the folder's saves to a page that had never seen them. The folder is the master
   (local/saves.js), so this is only a matter of what loads first — but one fixed port keeps it simple. */
async function serveFixed(root){
  const {handler}=require(path.join(root,'local','serve.js'));
  const h=handler({saves:path.join(app.getPath('userData'),'saves')});
  for(let port=48642;port<48662;port++){
    const ok=await new Promise(r=>{ const srv=http.createServer(h); srv.once('error',()=>r(false)); srv.listen(port,'127.0.0.1',()=>r(true)); });
    if(ok) return 'http://127.0.0.1:'+port+'/'; }
  return serve(root); }

function menu(win){
  const go=p=>()=>win.loadURL(base+p);
  return Menu.buildFromTemplate([
    {label:'Play',submenu:[
      {label:'The Voyage',accelerator:'CmdOrCtrl+1',click:go('index.html')},
      {label:'The Fullness of Time (story)',accelerator:'CmdOrCtrl+2',click:go('story/index.html')},
      {label:'Scripture Unfolds (the scrolls)',accelerator:'CmdOrCtrl+3',click:go('scripture-unfolds/index.html')},
      {type:'separator'},
      {label:'Whole screen',accelerator:'F11',click:()=>win.setFullScreen(!win.isFullScreen())},
      {label:'Reload',accelerator:'CmdOrCtrl+R',click:()=>win.reload()},
      {type:'separator'},
      {label:'Open the saves folder',click:()=>shell.openPath(path.join(app.getPath('userData'),'saves'))},
      {label:'What draws the game (GPU report)',click:()=>{ const w=new BrowserWindow({width:900,height:700,autoHideMenuBar:true}); w.loadURL('chrome://gpu'); }},
      {type:'separator'},
      {role:'quit',label:'Quit'} ]},
    {label:'View',submenu:[{role:'zoomIn'},{role:'zoomOut'},{role:'resetZoom'},{type:'separator'},{role:'toggleDevTools',label:'Developer tools'}]} ]); }

app.whenReady().then(async()=>{
  const root=gameRoot();
  fs.mkdirSync(path.join(app.getPath('userData'),'saves'),{recursive:true});
  base=await serveFixed(root);
  const win=new BrowserWindow({width:1600,height:900,minWidth:960,minHeight:600,backgroundColor:'#0b0806',
    title:'The Voyage',icon:path.join(root,'local','icon.png'),show:false,
    webPreferences:{backgroundThrottling:false,spellcheck:false}});
  Menu.setApplicationMenu(menu(win));
  win.once('ready-to-show',()=>{ win.maximize(); win.show(); });
  /* a link out of the game (a reference, a source) opens in the computer's browser, never in the game's window */
  win.webContents.setWindowOpenHandler(({url})=>{ if(!url.startsWith(base)) shell.openExternal(url); return {action:url.startsWith(base)?'allow':'deny'}; });
  const page=process.argv.includes('story')?'story/index.html':process.argv.includes('unfolds')?'scripture-unfolds/index.html':'index.html';
  win.loadURL(base+page);
});
app.on('window-all-closed',()=>app.quit());
