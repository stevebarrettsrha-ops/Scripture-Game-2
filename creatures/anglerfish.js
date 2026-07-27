/* THE ANGLERFISH — the lamp of the hadal dark. Below a thousand metres the
   sun is wholly spent and the only light in the sea is the light the sea
   makes for itself: a pale blue-green bulb on a rod over the mouth, and a
   mouth of glass teeth beneath it.
   See creatures/README.md. Change `metres` to change her size.
   (The common ones run a hand's breadth; Ceratias holboelli, the greatest of
   them, reaches 1.2 m — which is the one worth meeting in the dark.)

   `lure` and `rod` are handed back so the engine can work the lamp. */
EARTH.beast({
name:'anglerfish',
realm:'sea',
metres:1.2,
axis:'z',
build:function(T){
  const g=T.group();
  const skin=T.tex(function(gg){ T.speckle(gg,[46,58,66],14,[36,46,54],0.35); });
  const belly=T.tex(function(gg){ T.speckle(gg,[62,74,80],12,[52,62,70],0.3); });
  const mat=T.mat(skin), bmat=T.mat(belly);
  /* the body: a round bag of a thing, wider than it is long */
  const body=new T.THREE.Mesh(new T.THREE.BoxGeometry(3.4,3.0,3.6),mat); g.add(body);
  const under=new T.THREE.Mesh(new T.THREE.BoxGeometry(3.0,0.8,3.2),bmat);
  under.position.y=-1.5; g.add(under);
  /* the jaw, thrust forward and open */
  const jaw=new T.THREE.Mesh(new T.THREE.BoxGeometry(3.0,1.0,1.4),mat);
  jaw.position.set(0,-1.0,2.2); jaw.rotation.x=0.22; g.add(jaw);
  const roof=new T.THREE.Mesh(new T.THREE.BoxGeometry(3.0,0.7,1.3),mat);
  roof.position.set(0,0.5,2.2); roof.rotation.x=-0.16; g.add(roof);
  /* the teeth — long, glassy and crooked, upper and lower */
  const tmat=T.matc(0xe8f2f0);
  for(let i=0;i<7;i++){ const x=-1.2+i*0.4;
    const up=new T.THREE.Mesh(new T.THREE.BoxGeometry(0.16,0.55+T.hash(i,3.1)*0.5,0.16),tmat);
    up.position.set(x,-0.1,2.7); up.rotation.z=(T.hash(i,7.7)-0.5)*0.4; g.add(up);
    const dn=new T.THREE.Mesh(new T.THREE.BoxGeometry(0.16,0.45+T.hash(i,5.3)*0.45,0.16),tmat);
    dn.position.set(x,-0.75,2.7); dn.rotation.z=(T.hash(i,2.9)-0.5)*0.4; g.add(dn); }
  /* the eye — small, black and turned up toward the lamp */
  const eL=new T.THREE.Mesh(new T.THREE.BoxGeometry(0.5,0.5,0.4),T.matc(0xf4e9c8));
  eL.position.set(1.2,0.7,1.5); g.add(eL);
  const pL=new T.THREE.Mesh(new T.THREE.BoxGeometry(0.26,0.26,0.42),T.matc(0x120e0a));
  pL.position.set(1.25,0.7,1.62); g.add(pL);
  const eR=eL.clone(); eR.position.x=-1.2; g.add(eR);
  const pR=pL.clone(); pR.position.x=-1.25; g.add(pR);
  /* fins and the ragged tail */
  const fmat=T.matc(0x3a4a54);
  const fL=new T.THREE.Mesh(new T.THREE.BoxGeometry(1.5,0.18,0.9),fmat);
  fL.position.set(1.9,-0.5,0.2); fL.rotation.z=-0.3; g.add(fL);
  const fR=fL.clone(); fR.position.x=-1.9; fR.rotation.z=0.3; g.add(fR);
  const tail=new T.THREE.Mesh(new T.THREE.BoxGeometry(0.5,1.9,1.3),fmat);
  tail.position.set(0,0,-2.3); g.add(tail);
  /* ---- THE ROD AND THE LAMP ----
     the illicium arching up and forward over the mouth, and the esca at the
     end of it: a bulb of cold blue-green light, the one lamp in the deep */
  const rod=T.group();
  const s1=new T.THREE.Mesh(new T.THREE.BoxGeometry(0.16,1.7,0.16),fmat);
  s1.position.set(0,0.85,0); rod.add(s1);
  const s2=new T.THREE.Mesh(new T.THREE.BoxGeometry(0.16,0.16,1.9),fmat);
  s2.position.set(0,1.7,0.95); rod.add(s2);
  const lure=new T.THREE.Mesh(new T.THREE.BoxGeometry(0.55,0.55,0.55),
    new T.THREE.MeshBasicMaterial({color:0x9ff6e2,fog:true}));
  lure.position.set(0,1.7,2.0); rod.add(lure);
  rod.position.set(0,1.5,0.4); g.add(rod);
  g.userData={lure,rod};
  return g;
}});
