/* Bosnia and Herz. — this land's own file. Edit freely; the game rebuilds from it on reload.
   n     : the land's name as shown in the game
   c     : centre of the land [u,v] on the circle of the earth (u=r·sin lon, v=r·cos lon, r=(90-lat)/180)
   p     : coastline rings — arrays of [u,v] points (first point = last point closes the ring)
   verse : OPTIONAL — { t:"the words", ref:"BOOK 1:2" } shown the first time you come ashore here
   site  : OPTIONAL — [lat, lon] to place this land's village at a spot you choose */
EARTH.country({
n:"Bosnia and Herz.",
c:[0.0785,0.242],
p:[[[0.0835,0.2495],[0.079,0.2485],[0.077,0.247],[0.075,0.2465],[0.0725,0.245],[0.071,0.2435],[0.068,0.2415],[0.0685,0.239],[0.07,0.24],[0.071,0.2385],[0.0725,0.238],[0.0765,0.2375],[0.0795,0.2365],[0.0815,0.237],[0.0815,0.237],[0.083,0.2365],[0.083,0.239],[0.0855,0.2405],[0.086,0.243],[0.085,0.244],[0.0845,0.2445],[0.0835,0.2465],[0.0835,0.2495]]]
});
