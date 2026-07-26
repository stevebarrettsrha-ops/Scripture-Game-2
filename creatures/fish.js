/* THE FISH OF THE SEA — the small shoaling kind, in every colour.
   Its colour is given at build time (the reefs are stocked from a palette),
   so this one file is every bright fish in the shallows.
   See creatures/README.md. Change `metres` to change its size. */
EARTH.beast({
name:'fish',
realm:'sea',
metres:0.35,                 /* a palm-sized reef fish */
build:function(T,col){
  const c=new T.THREE.Color(col||0x5f7fa6);
  const g=T.group(); g.rotation.order='YXZ';
  /* a striped pixel hide, tinted by this fish's own colour */
  const hide=T.tex(function(gg){
    gg.fillStyle='rgb(255,255,255)'; gg.fillRect(0,0,16,16);
    gg.fillStyle='rgba(0,0,0,0.3)'; [3,7,11].forEach(function(x){ gg.fillRect(x,2,2,12); });
    gg.fillStyle='rgba(255,255,255,0.55)'; gg.fillRect(0,0,16,2); });
  const body=new T.THREE.Mesh(new T.THREE.BoxGeometry(1.0,1.5,3.2),
    new T.THREE.MeshLambertMaterial({map:hide,color:c.getHex()})); g.add(body);
  const tail=new T.THREE.Mesh(new T.THREE.BoxGeometry(0.4,1.8,1.0),
    new T.THREE.MeshLambertMaterial({map:hide,color:c.clone().multiplyScalar(0.75).getHex()}));
  tail.position.set(0,0,-2.0); g.add(tail);
  const eL=T.box(0.22,0.22,0.2,0x14181e); eL.position.set(0.42,0.3,1.4); g.add(eL);
  const eR=eL.clone(); eR.position.x=-0.42; g.add(eR);
  return g;
}});
