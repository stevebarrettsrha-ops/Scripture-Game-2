/* Hungary — this land's own file. Edit freely; the game rebuilds from it on reload.
   n     : the land's name as shown in the game
   c     : centre of the land [u,v] on the circle of the earth (u=r·sin lon, v=r·cos lon, r=(90-lat)/180)
   p     : coastline rings — arrays of [u,v] points (first point = last point closes the ring)
   verse : OPTIONAL — { t:"the words", ref:"BOOK 1:2" } shown the first time you come ashore here
   site  : OPTIONAL — [lat, lon] to place this land's village at a spot you choose */
EARTH.country({
n:"Hungary",
c:[0.078,0.2235],
p:[[[0.087,0.214],[0.0895,0.2145],[0.0905,0.216],[0.0885,0.218],[0.088,0.222],[0.087,0.2265],[0.084,0.2285],[0.0815,0.2295],[0.079,0.232],[0.079,0.232],[0.078,0.233],[0.074,0.233],[0.0705,0.232],[0.069,0.2315],[0.0675,0.23],[0.067,0.23],[0.067,0.2265],[0.066,0.2255],[0.0685,0.225],[0.068,0.2225],[0.0705,0.2235],[0.072,0.2235],[0.075,0.2215],[0.075,0.2205],[0.0765,0.22],[0.078,0.2185],[0.0785,0.2185],[0.08,0.217],[0.0805,0.2155],[0.0815,0.215],[0.0865,0.215],[0.087,0.214]]]
});
