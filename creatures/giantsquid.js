/* THE GIANT SQUID — the kraken of the charts, and it is real: eyes the size
   of dinner plates (the largest eyes that have ever existed), eight arms and
   two long hunting tentacles, dwelling in the bathypelagic dark where only
   the sperm whale goes to find it. Meet one deep enough and you may see
   that hunt yourself.
   `tents` is handed back so the engine can trail the arms.
   See creatures/README.md. Change `metres` to change its size. */
EARTH.beast({
name:'giantsquid',
realm:'sea',
metres:12,
axis:'z',
build:function(T){
  const g=T.group();
  const hide=T.tex(function(gg){ T.speckle(gg,[150,58,52],14,[126,46,44],0.4); });
  const m=T.mat(hide);
  /* the mantle, forward — built nose toward +z, the arms trailing behind */
  const mantle=new T.THREE.Mesh(new T.THREE.BoxGeometry(1.6,1.8,4.6),m);
  mantle.position.set(0,0,2.6); g.add(mantle);
  const tip=new T.THREE.Mesh(new T.THREE.BoxGeometry(0.9,1.0,1.4),m);
  tip.position.set(0,0,5.4); g.add(tip);
  /* the fins at the point of the mantle */
  const finL=new T.THREE.Mesh(new T.THREE.BoxGeometry(1.6,0.2,1.8),m);
  finL.position.set(1.0,0,5.2); finL.rotation.z=-0.2; g.add(finL);
  const finR=finL.clone(); finR.position.x=-1.0; finR.rotation.z=0.2; g.add(finR);
  /* the head and the great eyes */
  const head=new T.THREE.Mesh(new T.THREE.BoxGeometry(1.3,1.4,1.2),m);
  head.position.set(0,0,-0.4); g.add(head);
  const eye=new T.THREE.Mesh(new T.THREE.BoxGeometry(0.55,0.55,0.3),T.matc(0xe8e2c8));
  eye.position.set(0.75,0.1,-0.4); g.add(eye);
  const pup=new T.THREE.Mesh(new T.THREE.BoxGeometry(0.28,0.28,0.32),T.matc(0x14100c));
  pup.position.set(0.78,0.1,-0.4); g.add(pup);
  const eye2=eye.clone(); eye2.position.x=-0.75; g.add(eye2);
  const pup2=pup.clone(); pup2.position.x=-0.78; g.add(pup2);
  /* eight arms, and the two long hunting tentacles */
  const tents=[];
  for(let i=0;i<8;i++){ const a=i/8*6.283, rr=0.6;
    const arm=new T.THREE.Mesh(new T.THREE.BoxGeometry(0.3,0.3,3.2),m);
    arm.geometry.translate(0,0,-1.7);
    arm.position.set(Math.cos(a)*rr,Math.sin(a)*rr,-1.0);
    arm.rotation.x=-Math.sin(a)*0.18; arm.rotation.y=Math.cos(a)*0.18;
    g.add(arm); tents.push(arm); }
  for(const s of [1,-1]){
    const t2=new T.THREE.Mesh(new T.THREE.BoxGeometry(0.22,0.22,5.6),m);
    t2.geometry.translate(0,0,-2.9);
    t2.position.set(s*0.35,-0.2,-1.0); g.add(t2); tents.push(t2);
    const club=new T.THREE.Mesh(new T.THREE.BoxGeometry(0.4,0.3,1.0),m);
    club.position.set(s*0.35,-0.2,-6.4); g.add(club); }
  g.userData={tents};
  return g;
}});
