/* Lebanon — this land's own file. Edit freely; the game rebuilds from it on reload.
   n     : the land's name as shown in the game
   c     : centre of the land [u,v] on the circle of the earth (u=r·sin lon, v=r·cos lon, r=(90-lat)/180)
   p     : coastline rings — arrays of [u,v] points (first point = last point closes the ring)
   verse : OPTIONAL — { t:"the words", ref:"BOOK 1:2" } shown the first time you come ashore here
   site  : OPTIONAL — [lat, lon] to place this land's village at a spot you choose */
EARTH.country({
n:"Lebanon",
c:[0.183,0.253],
p:[[[0.1845,0.2555],[0.1835,0.2565],[0.1835,0.2575],[0.182,0.2585],[0.181,0.254],[0.181,0.249],[0.181,0.249],[0.183,0.2475],[0.185,0.249],[0.1835,0.2525],[0.1845,0.2555]]]
});
