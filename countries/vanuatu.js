/* Vanuatu — this land's own file. Edit freely; the game rebuilds from it on reload.
   n     : the land's name as shown in the game
   c     : centre of the land [u,v] on the circle of the earth (u=r·sin lon, v=r·cos lon, r=(90-lat)/180)
   p     : coastline rings — arrays of [u,v] points (first point = last point closes the ring)
   verse : OPTIONAL — { t:"the words", ref:"BOOK 1:2" } shown the first time you come ashore here
   site  : OPTIONAL — [lat, lon] to place this land's village at a spot you choose */
EARTH.country({
n:"Vanuatu",
c:[0.1325,-0.57],
p:[[[0.13,-0.5735],[0.1245,-0.578],[0.128,-0.578],[0.131,-0.575],[0.13,-0.5735]],[[0.134,-0.5715],[0.135,-0.5695],[0.1345,-0.5655],[0.13,-0.5685],[0.1295,-0.573],[0.132,-0.5715],[0.134,-0.5715]]]
});
