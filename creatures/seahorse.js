/* THE SEAHORSE — the upright fish: a horse's head on a curled tail, hanging
   in the seagrass and going nowhere in a hurry. It holds to the weed with
   its tail and bobs on the spot, which is exactly what the engine has it do.
   See creatures/README.md. Change `metres` to change its size. */
EARTH.beast({
name:'seahorse',
realm:'sea',
metres:0.25,
axis:'y',
build:function(T){
  const g=T.group();
  const hide=T.tex(function(gg){ T.speckle(gg,[214,178,92],20,[188,152,72],0.4); });
  const m=T.mat(hide);
  const body=new T.THREE.Mesh(new T.THREE.BoxGeometry(0.7,1.6,0.9),m);
  body.position.y=1.4; g.add(body);
  const neck=new T.THREE.Mesh(new T.THREE.BoxGeometry(0.5,0.7,0.5),m);
  neck.position.set(0,2.35,0.15); g.add(neck);
  const head=new T.THREE.Mesh(new T.THREE.BoxGeometry(0.5,0.5,0.9),m);
  head.position.set(0,2.75,0.45); g.add(head);
  const snout=new T.THREE.Mesh(new T.THREE.BoxGeometry(0.24,0.24,0.6),m);
  snout.position.set(0,2.7,1.05); g.add(snout);
  const eye=new T.THREE.Mesh(new T.THREE.BoxGeometry(0.14,0.14,0.14),T.matc(0x14100c));
  eye.position.set(0.28,2.82,0.55); g.add(eye);
  const eye2=eye.clone(); eye2.position.x=-0.28; g.add(eye2);
  /* the curled tail, in three steps */
  const t1=new T.THREE.Mesh(new T.THREE.BoxGeometry(0.5,0.7,0.6),m); t1.position.set(0,0.45,0.05); g.add(t1);
  const t2=new T.THREE.Mesh(new T.THREE.BoxGeometry(0.4,0.4,0.5),m); t2.position.set(0,0.15,0.35); g.add(t2);
  const t3=new T.THREE.Mesh(new T.THREE.BoxGeometry(0.3,0.3,0.4),m); t3.position.set(0,0.3,0.6); g.add(t3);
  const fin=new T.THREE.Mesh(new T.THREE.BoxGeometry(0.12,0.7,0.5),T.matc(0xc8a86a));
  fin.position.set(0,1.5,-0.55); g.add(fin);
  g.userData={tail:fin};
  return g;
}});
