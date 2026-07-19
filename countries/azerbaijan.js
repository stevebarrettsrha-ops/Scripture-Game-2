/* Azerbaijan — this land's own file. Edit freely; the game rebuilds from it on reload.
   n     : the land's name as shown in the game
   c     : centre of the land [u,v] on the circle of the earth (u=r·sin lon, v=r·cos lon, r=(90-lat)/180)
   p     : coastline rings — arrays of [u,v] points (first point = last point closes the ring)
   verse : OPTIONAL — { t:"the words", ref:"BOOK 1:2" } shown the first time you come ashore here
   site  : OPTIONAL — [lat, lon] to place this land's village at a spot you choose */
EARTH.country({
n:"Azerbaijan",
c:[0.203,0.1865],
p:[[[0.1935,0.1845],[0.1945,0.1835],[0.1995,0.1835],[0.201,0.182],[0.2005,0.1805],[0.201,0.177],[0.2045,0.177],[0.209,0.178],[0.211,0.1765],[0.213,0.176],[0.2105,0.1795],[0.2135,0.183],[0.2145,0.185],[0.214,0.187],[0.2165,0.189],[0.2155,0.19],[0.2115,0.1905],[0.2105,0.187],[0.2085,0.187],[0.2075,0.189],[0.2065,0.196],[0.2035,0.1935],[0.2015,0.1945],[0.199,0.1945],[0.1985,0.1925],[0.1955,0.193],[0.195,0.1915],[0.193,0.192],[0.1915,0.1915],[0.1915,0.19],[0.195,0.189],[0.197,0.187],[0.197,0.186],[0.1935,0.186],[0.1935,0.1845]],[[0.2055,0.1975],[0.2025,0.199],[0.199,0.199],[0.197,0.1985],[0.1975,0.1975],[0.1995,0.1975],[0.201,0.196],[0.2015,0.1965],[0.2055,0.1975]]]
});
