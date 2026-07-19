/* Guyana — this land's own file. Edit freely; the game rebuilds from it on reload.
   n     : the land's name as shown in the game
   c     : centre of the land [u,v] on the circle of the earth (u=r·sin lon, v=r·cos lon, r=(90-lat)/180)
   p     : coastline rings — arrays of [u,v] points (first point = last point closes the ring)
   verse : OPTIONAL — { t:"the words", ref:"BOOK 1:2" } shown the first time you come ashore here
   site  : OPTIONAL — [lat, lon] to place this land's village at a spot you choose */
EARTH.country({
n:"Guyana",
c:[-0.4065,0.2455],
p:[[[-0.4085,0.27],[-0.4095,0.268],[-0.412,0.264],[-0.4145,0.2625],[-0.4175,0.2595],[-0.419,0.2575],[-0.4205,0.2575],[-0.4225,0.2535],[-0.423,0.2475],[-0.421,0.246],[-0.4195,0.2425],[-0.415,0.2415],[-0.412,0.2425],[-0.411,0.2395],[-0.4115,0.2365],[-0.409,0.236],[-0.4085,0.234],[-0.411,0.2305],[-0.41,0.2235],[-0.4075,0.2245],[-0.4055,0.223],[-0.402,0.227],[-0.4005,0.2285],[-0.4,0.225],[-0.398,0.2245],[-0.392,0.2285],[-0.391,0.234],[-0.3915,0.24],[-0.394,0.2415],[-0.3925,0.2445],[-0.3925,0.2495],[-0.392,0.253],[-0.397,0.255],[-0.401,0.2515],[-0.402,0.2525],[-0.405,0.2525],[-0.4065,0.258],[-0.405,0.26],[-0.407,0.263],[-0.4085,0.27]]]
});
