/* Austria — this land's own file. Edit freely; the game rebuilds from it on reload.
   n     : the land's name as shown in the game
   c     : centre of the land [u,v] on the circle of the earth (u=r·sin lon, v=r·cos lon, r=(90-lat)/180)
   p     : coastline rings — arrays of [u,v] points (first point = last point closes the ring)
   verse : OPTIONAL — { t:"the words", ref:"BOOK 1:2" } shown the first time you come ashore here
   site  : OPTIONAL — [lat, lon] to place this land's village at a spot you choose */
EARTH.country({
n:"Austria",
c:[0.055,0.2285],
p:[[[0.068,0.2225],[0.0685,0.225],[0.066,0.2255],[0.067,0.2265],[0.067,0.23],[0.0665,0.2315],[0.063,0.2325],[0.061,0.234],[0.0575,0.2345],[0.0515,0.2345],[0.05,0.233],[0.0465,0.2345],[0.046,0.236],[0.0435,0.2355],[0.0415,0.2355],[0.0395,0.235],[0.0395,0.2335],[0.0395,0.2325],[0.0405,0.232],[0.043,0.2335],[0.043,0.232],[0.0465,0.2315],[0.0495,0.2295],[0.0515,0.2295],[0.053,0.2305],[0.053,0.2295],[0.0515,0.226],[0.053,0.225],[0.0535,0.222],[0.057,0.223],[0.0585,0.2205],[0.06,0.2195],[0.0635,0.2205],[0.065,0.2195],[0.067,0.22],[0.067,0.221],[0.068,0.2225]]]
});
