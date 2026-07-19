/* South Korea — this land's own file. Edit freely; the game rebuilds from it on reload.
   n     : the land's name as shown in the game
   c     : centre of the land [u,v] on the circle of the earth (u=r·sin lon, v=r·cos lon, r=(90-lat)/180)
   p     : coastline rings — arrays of [u,v] points (first point = last point closes the ring)
   verse : OPTIONAL — { t:"the words", ref:"BOOK 1:2" } shown the first time you come ashore here
   site  : OPTIONAL — [lat, lon] to place this land's village at a spot you choose */
EARTH.country({
n:"South Korea",
c:[0.235,-0.18],
p:[[[0.2345,-0.1715],[0.2335,-0.1715],[0.2325,-0.173],[0.2295,-0.1735],[0.227,-0.176],[0.2255,-0.1775],[0.224,-0.177],[0.2265,-0.1845],[0.2285,-0.188],[0.233,-0.192],[0.237,-0.1925],[0.2405,-0.1895],[0.245,-0.1875],[0.2485,-0.1835],[0.2465,-0.1815],[0.2425,-0.1795],[0.239,-0.1745],[0.236,-0.177],[0.2345,-0.1715]]]
});
