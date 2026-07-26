/* THE JELLYFISH — a drifting bell with trailing stingers.
   `tents` is handed back so the engine can make them stream.
   See creatures/README.md. Change `metres` to change its size. */
EARTH.beast({
name:'jelly',
realm:'sea',
metres:0.9,                  /* bell and trailing tentacles together */
axis:'y',                    /* a jelly is measured top to bottom */
build:function(T){
  const g=T.group();
  const bell=new T.THREE.Mesh(
    new T.THREE.SphereGeometry(2,10,8,0,6.28,0,Math.PI*0.62),
    T.glass(0xdf7ad0,0.72));
  g.add(bell);
  const tents=[];
  for(let i=0;i<6;i++){ const a=i/6*6.28;
    const t=T.box(0.25,3.4,0.25,0xe89ad8);
    t.position.set(Math.cos(a)*1.1,-2,Math.sin(a)*1.1); g.add(t); tents.push(t); }
  g.userData={tents}; return g;
}});
