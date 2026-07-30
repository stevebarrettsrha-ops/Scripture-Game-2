/* THE SIPHONOPHORE — not one animal but a chain of them: a colony strung
   out yards long, each link with its own work, the whole of it glowing
   faint blue and drifting through the midwater like a lit rope. Some kinds
   run to forty metres — longer than the whale.
   `tents` is handed back so the engine can ripple the chain.
   See creatures/README.md. */
EARTH.beast({
name:'siphonophore',
realm:'sea',
metres:10,
axis:'z',
build:function(T){
  const g=T.group();
  const links=[];
  const lmat=T.glass(0x9fb0ff,0.45);
  const gmat=new T.THREE.MeshBasicMaterial({color:0x8fa0f0,fog:true,transparent:true,opacity:0.8});
  const n=12;
  for(let i=0;i<n;i++){
    const link=new T.THREE.Mesh(new T.THREE.BoxGeometry(0.5,0.5,1.0),lmat);
    link.position.set(0,Math.sin(i*0.9)*0.3,i*1.4-n*0.7); g.add(link); links.push(link);
    if(i%3===0){ const lamp=new T.THREE.Mesh(new T.THREE.BoxGeometry(0.2,0.2,0.2),gmat);
      lamp.position.copy(link.position); lamp.position.y+=0.35; g.add(lamp); }
    /* the fishing tentacles hung under the chain */
    if(i%2===1){ const te=new T.THREE.Mesh(new T.THREE.BoxGeometry(0.08,1.6,0.08),T.glass(0xb0c0f8,0.4));
      te.geometry.translate(0,-0.8,0); te.position.copy(link.position); g.add(te); links.push(te); } }
  g.userData={tents:links};
  return g;
}});
