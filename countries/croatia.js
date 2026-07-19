/* Croatia — this land's own file. Edit freely; the game rebuilds from it on reload.
   n     : the land's name as shown in the game
   c     : centre of the land [u,v] on the circle of the earth (u=r·sin lon, v=r·cos lon, r=(90-lat)/180)
   p     : coastline rings — arrays of [u,v] points (first point = last point closes the ring)
   verse : OPTIONAL — { t:"the words", ref:"BOOK 1:2" } shown the first time you come ashore here
   site  : OPTIONAL — [lat, lon] to place this land's village at a spot you choose */
EARTH.country({
n:"Croatia",
c:[0.071,0.2405],
p:[[[0.069,0.2315],[0.0705,0.232],[0.074,0.233],[0.078,0.233],[0.079,0.232],[0.0805,0.2335],[0.0825,0.2345],[0.0815,0.237],[0.0795,0.2365],[0.0765,0.2375],[0.0725,0.238],[0.071,0.2385],[0.07,0.24],[0.0685,0.239],[0.068,0.2415],[0.071,0.2435],[0.0725,0.245],[0.075,0.2465],[0.077,0.247],[0.079,0.2485],[0.0835,0.2495],[0.0835,0.2505],[0.0835,0.2505],[0.079,0.25],[0.0755,0.2485],[0.0715,0.2485],[0.0665,0.2455],[0.0675,0.2445],[0.0645,0.243],[0.064,0.241],[0.0615,0.241],[0.0605,0.2435],[0.059,0.242],[0.0585,0.2405],[0.0585,0.24],[0.0615,0.2395],[0.062,0.2385],[0.064,0.239],[0.0655,0.2385],[0.065,0.237],[0.0665,0.236],[0.066,0.234],[0.069,0.2315]]]
});
