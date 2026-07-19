/* Haiti — this land's own file. Edit freely; the game rebuilds from it on reload.
   n     : the land's name as shown in the game
   c     : centre of the land [u,v] on the circle of the earth (u=r·sin lon, v=r·cos lon, r=(90-lat)/180)
   p     : coastline rings — arrays of [u,v] points (first point = last point closes the ring)
   verse : OPTIONAL — { t:"the words", ref:"BOOK 1:2" } shown the first time you come ashore here
   site  : OPTIONAL — [lat, lon] to place this land's village at a spot you choose */
EARTH.country({
n:"Haiti",
c:[-0.3775,0.1175],
p:[[[-0.371,0.1225],[-0.3735,0.124],[-0.3755,0.124],[-0.377,0.123],[-0.378,0.125],[-0.3795,0.1255],[-0.38,0.121],[-0.3815,0.1175],[-0.3825,0.1135],[-0.384,0.1105],[-0.3835,0.1065],[-0.3815,0.107],[-0.3805,0.113],[-0.3795,0.118],[-0.3775,0.1205],[-0.376,0.1165],[-0.374,0.116],[-0.3745,0.1115],[-0.3725,0.1125],[-0.3715,0.1165],[-0.371,0.1225]]]
});
