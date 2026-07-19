/* Syria — this land's own file. Edit freely; the game rebuilds from it on reload.
   n     : the land's name as shown in the game
   c     : centre of the land [u,v] on the circle of the earth (u=r·sin lon, v=r·cos lon, r=(90-lat)/180)
   p     : coastline rings — arrays of [u,v] points (first point = last point closes the ring)
   verse : OPTIONAL — { t:"the words", ref:"BOOK 1:2" } shown the first time you come ashore here
   site  : OPTIONAL — [lat, lon] to place this land's village at a spot you choose */
EARTH.country({
n:"Syria",
c:[0.187,0.2405],
p:[[[0.186,0.2585],[0.1855,0.2585],[0.186,0.2575],[0.1845,0.2555],[0.1835,0.2525],[0.185,0.249],[0.183,0.2475],[0.181,0.249],[0.178,0.2455],[0.1775,0.243],[0.178,0.241],[0.1785,0.2395],[0.1765,0.237],[0.1785,0.2365],[0.1825,0.232],[0.185,0.231],[0.1885,0.2285],[0.1915,0.223],[0.1935,0.221],[0.1975,0.2165],[0.198,0.221],[0.1965,0.224],[0.1995,0.2265],[0.2025,0.233],[0.197,0.245],[0.192,0.2565],[0.186,0.2585]]]
});
