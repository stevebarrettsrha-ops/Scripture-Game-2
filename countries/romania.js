/* Romania — this land's own file. Edit freely; the game rebuilds from it on reload.
   n     : the land's name as shown in the game
   c     : centre of the land [u,v] on the circle of the earth (u=r·sin lon, v=r·cos lon, r=(90-lat)/180)
   p     : coastline rings — arrays of [u,v] points (first point = last point closes the ring)
   verse : OPTIONAL — { t:"the words", ref:"BOOK 1:2" } shown the first time you come ashore here
   site  : OPTIONAL — [lat, lon] to place this land's village at a spot you choose */
EARTH.country({
n:"Romania",
c:[0.104,0.2215],
p:[[[0.117,0.218],[0.119,0.218],[0.1205,0.216],[0.1225,0.216],[0.1235,0.217],[0.122,0.219],[0.121,0.2195],[0.123,0.226],[0.1205,0.2265],[0.1165,0.2265],[0.1125,0.23],[0.111,0.232],[0.105,0.2345],[0.1015,0.235],[0.1,0.236],[0.098,0.2345],[0.097,0.234],[0.0975,0.233],[0.096,0.2325],[0.0955,0.234],[0.0925,0.2335],[0.091,0.2315],[0.0885,0.2315],[0.087,0.23],[0.084,0.2285],[0.087,0.2265],[0.088,0.222],[0.0885,0.218],[0.0905,0.216],[0.0915,0.214],[0.094,0.2135],[0.0965,0.2125],[0.0985,0.213],[0.0995,0.2115],[0.102,0.21],[0.1025,0.2085],[0.104,0.2075],[0.1055,0.2075],[0.107,0.2085],[0.1095,0.21],[0.113,0.2115],[0.1145,0.2135],[0.115,0.216],[0.117,0.218]]]
});
