/* Solomon Is. — this land's own file. Edit freely; the game rebuilds from it on reload.
   n     : the land's name as shown in the game
   c     : centre of the land [u,v] on the circle of the earth (u=r·sin lon, v=r·cos lon, r=(90-lat)/180)
   p     : coastline rings — arrays of [u,v] points (first point = last point closes the ring)
   verse : OPTIONAL — { t:"the words", ref:"BOOK 1:2" } shown the first time you come ashore here
   site  : OPTIONAL — [lat, lon] to place this land's village at a spot you choose */
EARTH.country({
n:"Solomon Is.",
c:[0.194,-0.508],
p:[[[0.1715,-0.5315],[0.1695,-0.534],[0.176,-0.532],[0.1785,-0.5275],[0.173,-0.5305],[0.1715,-0.5315]],[[0.174,-0.5255],[0.1755,-0.526],[0.181,-0.519],[0.1815,-0.515],[0.1785,-0.516],[0.1765,-0.5215],[0.174,-0.5255]],[[0.182,-0.524],[0.1855,-0.523],[0.191,-0.5205],[0.1925,-0.519],[0.1915,-0.517],[0.1855,-0.52],[0.183,-0.5225],[0.182,-0.524]],[[0.1895,-0.5105],[0.188,-0.513],[0.188,-0.514],[0.194,-0.5095],[0.1985,-0.5055],[0.201,-0.5025],[0.1995,-0.5025],[0.196,-0.5055],[0.1895,-0.5105]],[[0.2095,-0.4965],[0.2065,-0.5],[0.2085,-0.4995],[0.212,-0.4965],[0.2145,-0.493],[0.2135,-0.4925],[0.2095,-0.4965]]]
});
