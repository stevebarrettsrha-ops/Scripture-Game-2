/* Dominican Rep. — this land's own file. Edit freely; the game rebuilds from it on reload.
   n     : the land's name as shown in the game
   c     : centre of the land [u,v] on the circle of the earth (u=r·sin lon, v=r·cos lon, r=(90-lat)/180)
   p     : coastline rings — arrays of [u,v] points (first point = last point closes the ring)
   verse : OPTIONAL — { t:"the words", ref:"BOOK 1:2" } shown the first time you come ashore here
   site  : OPTIONAL — [lat, lon] to place this land's village at a spot you choose */
EARTH.country({
n:"Dominican Rep.",
c:[-0.373,0.132],
p:[[[-0.3795,0.1255],[-0.378,0.125],[-0.377,0.123],[-0.3755,0.124],[-0.3735,0.124],[-0.371,0.1225],[-0.3695,0.123],[-0.368,0.128],[-0.368,0.1325],[-0.367,0.134],[-0.3685,0.136],[-0.367,0.1395],[-0.369,0.1395],[-0.368,0.1425],[-0.3685,0.1465],[-0.3715,0.145],[-0.3715,0.1415],[-0.373,0.1385],[-0.3735,0.1365],[-0.375,0.1355],[-0.376,0.133],[-0.375,0.1315],[-0.3765,0.1295],[-0.381,0.1285],[-0.381,0.1265],[-0.3795,0.1255]]]
});
