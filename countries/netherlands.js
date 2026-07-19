/* Netherlands — this land's own file. Edit freely; the game rebuilds from it on reload.
   n     : the land's name as shown in the game
   c     : centre of the land [u,v] on the circle of the earth (u=r·sin lon, v=r·cos lon, r=(90-lat)/180)
   p     : coastline rings — arrays of [u,v] points (first point = last point closes the ring)
   verse : OPTIONAL — { t:"the words", ref:"BOOK 1:2" } shown the first time you come ashore here
   site  : OPTIONAL — [lat, lon] to place this land's village at a spot you choose */
EARTH.country({
n:"Netherlands",
c:[0.02,0.2095],
p:[[[0.0245,0.2015],[0.0255,0.203],[0.025,0.2085],[0.0245,0.2105],[0.022,0.211],[0.0235,0.2165],[0.021,0.2155],[0.0185,0.213],[0.015,0.2145],[0.0125,0.2145],[0.0125,0.2145],[0.014,0.2125],[0.017,0.2045],[0.0215,0.2015],[0.0245,0.2015]]]
});
