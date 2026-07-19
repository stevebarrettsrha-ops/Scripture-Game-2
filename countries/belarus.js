/* Belarus — this land's own file. Edit freely; the game rebuilds from it on reload.
   n     : the land's name as shown in the game
   c     : centre of the land [u,v] on the circle of the earth (u=r·sin lon, v=r·cos lon, r=(90-lat)/180)
   p     : coastline rings — arrays of [u,v] points (first point = last point closes the ring)
   verse : OPTIONAL — { t:"the words", ref:"BOOK 1:2" } shown the first time you come ashore here
   site  : OPTIONAL — [lat, lon] to place this land's village at a spot you choose */
EARTH.country({
n:"Belarus",
c:[0.0965,0.179],
p:[[[0.0885,0.1655],[0.0925,0.165],[0.0935,0.166],[0.0945,0.165],[0.098,0.1645],[0.1,0.1665],[0.1,0.168],[0.1035,0.17],[0.1055,0.17],[0.106,0.171],[0.1085,0.1705],[0.11,0.1715],[0.1095,0.173],[0.107,0.1745],[0.1065,0.1755],[0.1085,0.1765],[0.111,0.179],[0.111,0.179],[0.1085,0.181],[0.108,0.1825],[0.109,0.185],[0.1075,0.1855],[0.105,0.187],[0.1035,0.1865],[0.1025,0.188],[0.101,0.188],[0.0985,0.1895],[0.094,0.19],[0.0905,0.1915],[0.088,0.1925],[0.0865,0.195],[0.085,0.1955],[0.084,0.1935],[0.082,0.1915],[0.0835,0.1895],[0.083,0.1875],[0.081,0.186],[0.08,0.184],[0.083,0.1825],[0.0855,0.179],[0.085,0.176],[0.0865,0.173],[0.085,0.171],[0.0865,0.169],[0.0885,0.1655]]]
});
