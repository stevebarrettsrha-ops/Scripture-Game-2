/* Georgia — this land's own file. Edit freely; the game rebuilds from it on reload.
   n     : the land's name as shown in the game
   c     : centre of the land [u,v] on the circle of the earth (u=r·sin lon, v=r·cos lon, r=(90-lat)/180)
   p     : coastline rings — arrays of [u,v] points (first point = last point closes the ring)
   verse : OPTIONAL — { t:"the words", ref:"BOOK 1:2" } shown the first time you come ashore here
   site  : OPTIONAL — [lat, lon] to place this land's village at a spot you choose */
EARTH.country({
n:"Georgia",
c:[0.182,0.1925],
p:[[[0.166,0.1985],[0.166,0.1975],[0.1695,0.1955],[0.175,0.192],[0.1815,0.1895],[0.183,0.19],[0.1845,0.1875],[0.188,0.185],[0.1905,0.1855],[0.1935,0.1845],[0.1935,0.186],[0.197,0.186],[0.197,0.187],[0.195,0.189],[0.1915,0.19],[0.1915,0.1915],[0.1875,0.197],[0.182,0.198],[0.1785,0.2015],[0.1775,0.199],[0.174,0.197],[0.171,0.1975],[0.1685,0.1985],[0.166,0.1985]]]
});
