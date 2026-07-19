/* Czechia — this land's own file. Edit freely; the game rebuilds from it on reload.
   n     : the land's name as shown in the game
   c     : centre of the land [u,v] on the circle of the earth (u=r·sin lon, v=r·cos lon, r=(90-lat)/180)
   p     : coastline rings — arrays of [u,v] points (first point = last point closes the ring)
   verse : OPTIONAL — { t:"the words", ref:"BOOK 1:2" } shown the first time you come ashore here
   site  : OPTIONAL — [lat, lon] to place this land's village at a spot you choose */
EARTH.country({
n:"Czechia",
c:[0.061,0.215],
p:[[[0.056,0.2085],[0.058,0.21],[0.061,0.2095],[0.0615,0.211],[0.0635,0.2115],[0.0635,0.21],[0.0665,0.21],[0.0675,0.2115],[0.07,0.211],[0.0725,0.213],[0.0715,0.2135],[0.0715,0.2145],[0.0705,0.215],[0.0705,0.2165],[0.07,0.217],[0.07,0.2175],[0.069,0.218],[0.0675,0.2185],[0.067,0.22],[0.065,0.2195],[0.0635,0.2205],[0.06,0.2195],[0.0585,0.2205],[0.057,0.223],[0.0535,0.222],[0.051,0.22],[0.0485,0.2195],[0.048,0.217],[0.047,0.2155],[0.0495,0.214],[0.0505,0.2125],[0.0525,0.2105],[0.0535,0.2095],[0.0545,0.2095],[0.056,0.2085]]]
});
