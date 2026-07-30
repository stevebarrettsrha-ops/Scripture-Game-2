/* THE LANTERNFISH — the commonest fish on the earth, and almost nobody has
   seen one: a finger of silver with rows of light-organs down the belly. By
   day it hangs in the twilight at four hundred metres; every night it rises
   toward the surface to feed and sinks again at dawn — the greatest
   migration on the planet, made every single day.
   See creatures/README.md. */
EARTH.beast({
name:'lanternfish',
realm:'sea',
metres:0.12,
axis:'z',
build:function(T){
  const g=T.group();
  const hide=T.tex(function(gg){ T.speckle(gg,[142,158,176],12,[120,138,158],0.35); });
  const m=T.mat(hide);
  const body=new T.THREE.Mesh(new T.THREE.BoxGeometry(0.5,0.8,2.2),m); g.add(body);
  const head=new T.THREE.Mesh(new T.THREE.BoxGeometry(0.44,0.65,0.5),m);
  head.position.set(0,0,1.3); g.add(head);
  const eye=new T.THREE.Mesh(new T.THREE.BoxGeometry(0.22,0.22,0.22),T.matc(0x14100c));
  eye.position.set(0.24,0.15,1.4); g.add(eye);
  const eye2=eye.clone(); eye2.position.x=-0.24; g.add(eye2);
  /* the photophores — the lamps in rows along the belly */
  const pmat=new T.THREE.MeshBasicMaterial({color:0x9fd8ff,fog:true});
  for(let i=0;i<4;i++){ const p=new T.THREE.Mesh(new T.THREE.BoxGeometry(0.12,0.12,0.12),pmat);
    p.position.set(0,-0.45,0.9-i*0.55); g.add(p); }
  const tail=new T.THREE.Mesh(new T.THREE.BoxGeometry(0.1,0.6,0.5),T.matc(0x8a9cb0));
  tail.position.set(0,0,-1.35); g.add(tail);
  g.userData={tail};
  return g;
}});
