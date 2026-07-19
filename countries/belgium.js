/* Belgium — this land's own file. Edit freely; the game rebuilds from it on reload.
   n     : the land's name as shown in the game
   c     : centre of the land [u,v] on the circle of the earth (u=r·sin lon, v=r·cos lon, r=(90-lat)/180)
   p     : coastline rings — arrays of [u,v] points (first point = last point closes the ring)
   verse : OPTIONAL — { t:"the words", ref:"BOOK 1:2" } shown the first time you come ashore here
   site  : OPTIONAL — [lat, lon] to place this land's village at a spot you choose */
EARTH.country({
n:"Belgium",
c:[0.017,0.2175],
p:[[[0.0235,0.2165],[0.0235,0.2205],[0.0225,0.2205],[0.022,0.2235],[0.0185,0.2215],[0.0165,0.222],[0.014,0.2195],[0.012,0.2175],[0.01,0.2175],[0.0095,0.2155],[0.0125,0.2145],[0.0125,0.2145],[0.0125,0.2145],[0.015,0.2145],[0.0185,0.213],[0.021,0.2155],[0.0235,0.2165]]]
});
