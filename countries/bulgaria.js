/* Bulgaria — this land's own file. Edit freely; the game rebuilds from it on reload.
   n     : the land's name as shown in the game
   c     : centre of the land [u,v] on the circle of the earth (u=r·sin lon, v=r·cos lon, r=(90-lat)/180)
   p     : coastline rings — arrays of [u,v] points (first point = last point closes the ring)
   verse : OPTIONAL — { t:"the words", ref:"BOOK 1:2" } shown the first time you come ashore here
   site  : OPTIONAL — [lat, lon] to place this land's village at a spot you choose */
EARTH.country({
n:"Bulgaria",
c:[0.1095,0.2375],
p:[[[0.098,0.2345],[0.1,0.236],[0.1015,0.235],[0.105,0.2345],[0.111,0.232],[0.1125,0.23],[0.1165,0.2265],[0.1205,0.2265],[0.123,0.226],[0.122,0.229],[0.1225,0.2335],[0.125,0.2355],[0.1215,0.2365],[0.118,0.2405],[0.119,0.243],[0.1155,0.245],[0.1115,0.245],[0.1085,0.2475],[0.1055,0.249],[0.1035,0.2455],[0.101,0.245],[0.1015,0.244],[0.1005,0.2435],[0.1005,0.2415],[0.1015,0.2395],[0.0985,0.238],[0.0975,0.236],[0.098,0.2345]]]
});
