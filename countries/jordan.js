/* Jordan — this land's own file. Edit freely; the game rebuilds from it on reload.
   n     : the land's name as shown in the game
   c     : centre of the land [u,v] on the circle of the earth (u=r·sin lon, v=r·cos lon, r=(90-lat)/180)
   p     : coastline rings — arrays of [u,v] points (first point = last point closes the ring)
   verse : OPTIONAL — { t:"the words", ref:"BOOK 1:2" } shown the first time you come ashore here
   site  : OPTIONAL — [lat, lon] to place this land's village at a spot you choose */
EARTH.country({
n:"Jordan",
c:[0.195,0.2625],
p:[[[0.186,0.2605],[0.186,0.2585],[0.192,0.2565],[0.197,0.245],[0.203,0.249],[0.203,0.2505],[0.1955,0.2595],[0.2035,0.2605],[0.2025,0.2625],[0.203,0.2645],[0.2,0.2675],[0.2,0.27],[0.199,0.273],[0.193,0.276],[0.1925,0.2755],[0.1895,0.2665],[0.1885,0.265],[0.188,0.263],[0.186,0.2605]]]
});
