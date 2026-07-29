/* THE GLOW-WORM — of Waitomo and a hundred other caves. It is a fly's grub
   that hangs from the roof, lets down lines of silk beaded with glue, and
   LIGHTS ITSELF so the small things of the dark fly up at it and are caught.
   A roof of them is the only sky the deep has. */
EARTH.beast({
name:'glowworm',
realm:'land',
metres:0.02,
build:function(T){
  const g=T.group();
  const body=T.box(0.16,0.14,0.7,0xcfe6c2); body.position.y=0.5; g.add(body);
  /* the lamp at the tail, which is the whole point of it */
  const lamp=new T.THREE.Mesh(new T.THREE.BoxGeometry(0.2,0.18,0.24),
    new T.THREE.MeshBasicMaterial({color:0x9dfbc8,fog:true}));
  lamp.position.set(0,0.5,-0.42); g.add(lamp);
  /* the fishing lines let down out of the roof */
  const lines=[];
  for(let i=0;i<4;i++){ const s=T.box(0.03,1.6,0.03,0xdfeee6);
    s.geometry.translate(0,-0.8,0); s.position.set((i-1.5)*0.13,0.44,0.05); g.add(s); lines.push(s); }
  g.userData={lamp,lines};
  return g;
}});
