/* Suriname — this land's own file. Edit freely; the game rebuilds from it on reload.
   n     : the land's name as shown in the game
   c     : centre of the land [u,v] on the circle of the earth (u=r·sin lon, v=r·cos lon, r=(90-lat)/180)
   p     : coastline rings — arrays of [u,v] points (first point = last point closes the ring)
   verse : OPTIONAL — { t:"the words", ref:"BOOK 1:2" } shown the first time you come ashore here
   site  : OPTIONAL — [lat, lon] to place this land's village at a spot you choose */
EARTH.country({
n:"Suriname",
c:[-0.397,0.269],
p:[[[-0.3965,0.2825],[-0.3985,0.278],[-0.4015,0.275],[-0.403,0.272],[-0.4045,0.272],[-0.405,0.274],[-0.406,0.274],[-0.4085,0.27],[-0.407,0.263],[-0.405,0.26],[-0.4065,0.258],[-0.405,0.2525],[-0.402,0.2525],[-0.401,0.2515],[-0.397,0.255],[-0.392,0.253],[-0.3875,0.262],[-0.3865,0.262],[-0.3825,0.2675],[-0.3785,0.2755],[-0.385,0.2745],[-0.3875,0.2775],[-0.3885,0.282],[-0.391,0.282],[-0.3935,0.283],[-0.3965,0.2825]]]
});
