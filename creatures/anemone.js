/* THE SEA ANEMONE — a flower that is an animal: a stout column crowned with
   a ring of stinging arms, swaying with the current. On the true reef it
   keeps its clownfish, and here it does the same — the engine plants these
   in the warm shallows and gives each its darting family.
   `tents` is handed back so the engine can sway the arms.
   See creatures/README.md. Change `metres` to change its size. */
EARTH.beast({
name:'anemone',
realm:'sea',
metres:0.6,
axis:'y',
build:function(T){
  const g=T.group();
  const colBase=[[168,84,120],[92,140,168],[178,140,72]][Math.floor(T.hash(1,7)*3)%3];
  const colTex=T.tex(function(gg){ T.speckle(gg,colBase,18,[colBase[0]*0.8,colBase[1]*0.8,colBase[2]*0.8],0.35); });
  const column=new T.THREE.Mesh(new T.THREE.BoxGeometry(1.6,1.2,1.6),T.mat(colTex));
  column.position.y=0.6; g.add(column);
  /* the crown of arms, each on its own sway */
  const tents=[]; const tmat=T.matc(0xd8b8d0);
  const n=10;
  for(let i=0;i<n;i++){ const a=i/n*6.283, rr=0.55+T.hash(i,3)*0.25;
    const te=new T.THREE.Mesh(new T.THREE.BoxGeometry(0.22,1.3+T.hash(i,5)*0.7,0.22),tmat);
    te.geometry.translate(0,0.75,0);
    te.position.set(Math.cos(a)*rr,1.1,Math.sin(a)*rr);
    te.rotation.z=-Math.cos(a)*0.45; te.rotation.x=Math.sin(a)*0.45;
    g.add(te); tents.push(te); }
  g.userData={tents};
  return g;
}});
