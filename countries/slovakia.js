/* Slovakia — this land's own file. Edit freely; the game rebuilds from it on reload.
   n     : the land's name as shown in the game
   c     : centre of the land [u,v] on the circle of the earth (u=r·sin lon, v=r·cos lon, r=(90-lat)/180)
   p     : coastline rings — arrays of [u,v] points (first point = last point closes the ring)
   verse : OPTIONAL — { t:"the words", ref:"BOOK 1:2" } shown the first time you come ashore here
   site  : OPTIONAL — [lat, lon] to place this land's village at a spot you choose */
EARTH.country({
n:"Slovakia",
c:[0.076,0.216],
p:[[[0.087,0.21],[0.0865,0.2115],[0.087,0.214],[0.0865,0.215],[0.0815,0.215],[0.0805,0.2155],[0.08,0.217],[0.0785,0.2185],[0.078,0.2185],[0.0765,0.22],[0.075,0.2205],[0.075,0.2215],[0.072,0.2235],[0.0705,0.2235],[0.068,0.2225],[0.067,0.221],[0.067,0.22],[0.0675,0.2185],[0.069,0.218],[0.07,0.2175],[0.07,0.217],[0.0705,0.2165],[0.0705,0.215],[0.0715,0.2145],[0.0715,0.2135],[0.0725,0.213],[0.073,0.213],[0.0745,0.212],[0.077,0.213],[0.0785,0.211],[0.0805,0.211],[0.083,0.2095],[0.087,0.21]]]
});
