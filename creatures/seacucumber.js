/* THE SEA CUCUMBER — the earthworm of the abyss: a soft tube working its
   way over the plain, eating the mud itself for the snow that has settled
   in it. On the true abyssal floor they are most of everything alive.
   See creatures/README.md. */
EARTH.beast({
name:'seacucumber',
realm:'sea',
metres:0.5,
axis:'z',
build:function(T){
  const g=T.group();
  const hide=T.tex(function(gg){ T.speckle(gg,[122,74,96],14,[104,62,84],0.4); });
  const m=T.mat(hide);
  const body=new T.THREE.Mesh(new T.THREE.BoxGeometry(0.9,0.6,2.4),m);
  body.position.y=0.35; g.add(body);
  const head=new T.THREE.Mesh(new T.THREE.BoxGeometry(0.7,0.5,0.5),m);
  head.position.set(0,0.32,1.4); g.add(head);
  /* the feeding tentacles at the mouth */
  for(let i=0;i<4;i++){ const a=(i/4-0.4)*1.6;
    const te=new T.THREE.Mesh(new T.THREE.BoxGeometry(0.1,0.1,0.4),T.matc(0x9a6080));
    te.position.set(Math.sin(a)*0.25,0.25,1.75); te.rotation.y=a*0.4; g.add(te); }
  /* the little papillae along the back */
  for(let i=0;i<4;i++){ const p=new T.THREE.Mesh(new T.THREE.BoxGeometry(0.12,0.2,0.12),m);
    p.position.set((T.hash(i,3)-0.5)*0.5,0.72,0.9-i*0.6); g.add(p); }
  return g;
}});
