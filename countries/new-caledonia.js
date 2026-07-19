/* New Caledonia — this land's own file. Edit freely; the game rebuilds from it on reload.
   n     : the land's name as shown in the game
   c     : centre of the land [u,v] on the circle of the earth (u=r·sin lon, v=r·cos lon, r=(90-lat)/180)
   p     : coastline rings — arrays of [u,v] points (first point = last point closes the ring)
   verse : OPTIONAL — { t:"the words", ref:"BOOK 1:2" } shown the first time you come ashore here
   site  : OPTIONAL — [lat, lon] to place this land's village at a spot you choose */
EARTH.country({
n:"New Caledonia",
c:[0.1545,-0.598],
p:[[[0.1515,-0.598],[0.144,-0.6035],[0.139,-0.6075],[0.143,-0.608],[0.1485,-0.605],[0.1555,-0.6005],[0.1615,-0.596],[0.1675,-0.5905],[0.1685,-0.588],[0.164,-0.5895],[0.1585,-0.593],[0.1545,-0.596],[0.1515,-0.598]]]
});
