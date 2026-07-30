/* THE SEA URCHIN — the pincushion of the rocks: a dark ball of spines
   wedged in the reef, grazing the stone bare a hand's breadth a day.
   See creatures/README.md. */
EARTH.beast({
name:'urchin',
realm:'sea',
metres:0.2,
axis:'x',
build:function(T){
  const g=T.group();
  const m=T.matc(0x201828);
  const ball=new T.THREE.Mesh(new T.THREE.BoxGeometry(0.8,0.7,0.8),m);
  ball.position.y=0.45; g.add(ball);
  const smat=T.matc(0x342a44);
  for(let i=0;i<14;i++){
    const sp=new T.THREE.Mesh(new T.THREE.BoxGeometry(0.07,0.9,0.07),smat);
    sp.geometry.translate(0,0.45,0);
    sp.position.y=0.45;
    sp.rotation.z=(T.hash(i,3.3)-0.5)*3.0; sp.rotation.x=(T.hash(i,7.7)-0.5)*3.0;
    g.add(sp); }
  return g;
}});
