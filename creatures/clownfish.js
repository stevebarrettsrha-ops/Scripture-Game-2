/* THE CLOWNFISH — the anemonefish of the warm reefs: orange, three white
   bars edged in black, never more than a dart's length from the anemone
   whose stinging arms are its whole fortress. The engine keeps a family of
   them about every anemone it plants on the reef.
   See creatures/README.md. Change `metres` to change its size. */
EARTH.beast({
name:'clownfish',
realm:'sea',
metres:0.15,
axis:'z',
build:function(T){
  const g=T.group();
  const hide=T.tex(function(gg){
    T.speckle(gg,[236,120,32],14,[220,100,24],0.35);
    gg.fillStyle='rgb(20,16,12)';
    for(const x of [3,8,13]) gg.fillRect(x,0,1,16);        /* the black edges */
    gg.fillStyle='rgb(244,246,248)';
    for(const x of [4,9,14]) gg.fillRect(x,0,2,16);        /* the white bars */
  });
  const m=T.mat(hide);
  const body=new T.THREE.Mesh(new T.THREE.BoxGeometry(0.9,1.1,2.2),m); g.add(body);
  const head=new T.THREE.Mesh(new T.THREE.BoxGeometry(0.8,0.9,0.6),m);
  head.position.set(0,0,1.3); g.add(head);
  const eye=new T.THREE.Mesh(new T.THREE.BoxGeometry(0.18,0.18,0.18),T.matc(0x14100c));
  eye.position.set(0.42,0.2,1.35); g.add(eye);
  const eye2=eye.clone(); eye2.position.x=-0.42; g.add(eye2);
  const fmat=T.matc(0xd86a1e);
  const tail=new T.THREE.Mesh(new T.THREE.BoxGeometry(0.2,0.9,0.7),fmat);
  tail.position.set(0,0,-1.4); g.add(tail);
  const top=new T.THREE.Mesh(new T.THREE.BoxGeometry(0.16,0.5,1.2),fmat);
  top.position.set(0,0.75,0); g.add(top);
  g.userData={tail};
  return g;
}});
