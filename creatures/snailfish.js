/* THE HADAL SNAILFISH — the deepest fish that has ever been seen alive:
   a soft, pale, tadpole thing with no scales and no swim bladder, quite at
   home eight kilometres down in the trenches where nothing else with a
   backbone can live at all. In the deepest water of the game, this is who
   lives there. See creatures/README.md. */
EARTH.beast({
name:'snailfish',
realm:'sea',
metres:0.25,
axis:'z',
build:function(T){
  const g=T.group();
  const hide=T.tex(function(gg){ T.speckle(gg,[218,206,214],10,[200,188,198],0.3); });
  const m=T.mat(hide);
  const head=new T.THREE.Mesh(new T.THREE.BoxGeometry(0.9,0.8,1.0),m);
  head.position.set(0,0,0.9); g.add(head);
  const eye=new T.THREE.Mesh(new T.THREE.BoxGeometry(0.14,0.14,0.14),T.matc(0x3a3440));
  eye.position.set(0.35,0.2,1.2); g.add(eye);
  const eye2=eye.clone(); eye2.position.x=-0.35; g.add(eye2);
  /* the tadpole body, thinning to a ribbon tail */
  const b1=new T.THREE.Mesh(new T.THREE.BoxGeometry(0.6,0.6,1.0),m);
  b1.position.set(0,0,0); g.add(b1);
  const b2=new T.THREE.Mesh(new T.THREE.BoxGeometry(0.4,0.45,1.0),m);
  b2.position.set(0,0,-0.9); g.add(b2);
  const tail=new T.THREE.Mesh(new T.THREE.BoxGeometry(0.16,0.4,0.9),m);
  tail.position.set(0,0,-1.8); g.add(tail);
  const pfL=new T.THREE.Mesh(new T.THREE.BoxGeometry(0.5,0.1,0.4),T.glass(0xd8ccd4,0.7));
  pfL.position.set(0.5,-0.2,0.5); g.add(pfL);
  const pfR=pfL.clone(); pfR.position.x=-0.5; g.add(pfR);
  g.userData={tail};
  return g;
}});
