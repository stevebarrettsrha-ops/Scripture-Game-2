/* Timor-Leste — this land's own file. Edit freely; the game rebuilds from it on reload.
   n     : the land's name as shown in the game
   c     : centre of the land [u,v] on the circle of the earth (u=r·sin lon, v=r·cos lon, r=(90-lat)/180)
   p     : coastline rings — arrays of [u,v] points (first point = last point closes the ring)
   verse : OPTIONAL — { t:"the words", ref:"BOOK 1:2" } shown the first time you come ashore here
   site  : OPTIONAL — [lat, lon] to place this land's village at a spot you choose */
EARTH.country({
n:"Timor-Leste",
c:[0.4445,-0.3215],
p:[[[0.45,-0.315],[0.4485,-0.315],[0.4425,-0.321],[0.4385,-0.3265],[0.4365,-0.328],[0.4345,-0.3315],[0.438,-0.3295],[0.446,-0.323],[0.452,-0.3175],[0.4505,-0.3165],[0.45,-0.315]]]
});
