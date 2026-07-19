/* Slovenia — this land's own file. Edit freely; the game rebuilds from it on reload.
   n     : the land's name as shown in the game
   c     : centre of the land [u,v] on the circle of the earth (u=r·sin lon, v=r·cos lon, r=(90-lat)/180)
   p     : coastline rings — arrays of [u,v] points (first point = last point closes the ring)
   verse : OPTIONAL — { t:"the words", ref:"BOOK 1:2" } shown the first time you come ashore here
   site  : OPTIONAL — [lat, lon] to place this land's village at a spot you choose */
EARTH.country({
n:"Slovenia",
c:[0.063,0.2355],
p:[[[0.0575,0.2345],[0.061,0.234],[0.063,0.2325],[0.0665,0.2315],[0.067,0.23],[0.0675,0.23],[0.069,0.2315],[0.066,0.234],[0.0665,0.236],[0.065,0.237],[0.0655,0.2385],[0.064,0.239],[0.062,0.2385],[0.0615,0.2395],[0.0585,0.24],[0.0595,0.2395],[0.058,0.2375],[0.0575,0.2345]]]
});
