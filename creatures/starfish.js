/* THE STARFISH — the five-armed grazer of the bed, laid flat on the sand or
   over a coral head, going nowhere any eye can see. It is the stillest
   living thing in the sea, and the bed is dressed with them.
   See creatures/README.md. */
EARTH.beast({
name:'starfish',
realm:'sea',
metres:0.35,
axis:'x',
build:function(T){
  const g=T.group();
  const cols=[[208,96,72],[188,72,128],[224,150,52]];
  const col=cols[Math.floor(T.hash(2,9)*3)%3];
  const hide=T.tex(function(gg){ T.speckle(gg,col,20,[col[0]*0.82,col[1]*0.82,col[2]*0.82],0.4); });
  const m=T.mat(hide);
  const hub=new T.THREE.Mesh(new T.THREE.BoxGeometry(0.7,0.28,0.7),m);
  hub.position.y=0.14; g.add(hub);
  for(let i=0;i<5;i++){ const a=i/5*6.283;
    const arm=new T.THREE.Mesh(new T.THREE.BoxGeometry(0.34,0.22,1.0),m);
    arm.geometry.translate(0,0,0.62);
    arm.position.set(Math.sin(a)*0.2,0.13,Math.cos(a)*0.2); arm.rotation.y=a;
    g.add(arm);
    const tip=new T.THREE.Mesh(new T.THREE.BoxGeometry(0.2,0.18,0.4),m);
    tip.position.set(Math.sin(a)*1.25,0.11,Math.cos(a)*1.25); tip.rotation.y=a;
    g.add(tip); }
  return g;
}});
