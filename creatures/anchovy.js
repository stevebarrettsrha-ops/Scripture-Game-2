/* THE ANCHOVY — the smallest silver there is, and the most of it: the
   bait-ball fish of every warm coast, the whole living floor of the sea's
   food. Where the anchovies ball, everything comes.
   See creatures/README.md. */
EARTH.beast({
name:'anchovy',
realm:'sea',
metres:0.15,
axis:'z',
build:function(T){
  const g=T.group();
  const hide=T.tex(function(gg){
    T.speckle(gg,[204,212,220],8,[186,196,206],0.3);
    gg.fillStyle='rgb(96,116,136)'; gg.fillRect(0,0,16,4); });
  const m=T.mat(hide);
  const body=new T.THREE.Mesh(new T.THREE.BoxGeometry(0.4,0.6,2.2),m); g.add(body);
  const head=new T.THREE.Mesh(new T.THREE.BoxGeometry(0.34,0.5,0.5),m);
  head.position.set(0,0,1.3); g.add(head);
  const eye=new T.THREE.Mesh(new T.THREE.BoxGeometry(0.12,0.12,0.12),T.matc(0x14100c));
  eye.position.set(0.2,0.1,1.4); g.add(eye);
  const eye2=eye.clone(); eye2.position.x=-0.2; g.add(eye2);
  const tail=new T.THREE.Mesh(new T.THREE.BoxGeometry(0.1,0.55,0.45),T.matc(0x8a9cae));
  tail.position.set(0,0,-1.35); g.add(tail);
  g.userData={tail};
  return g;
}});
