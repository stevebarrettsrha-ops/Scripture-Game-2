/* Belize — this land's own file. Edit freely; the game rebuilds from it on reload.
   n     : the land's name as shown in the game
   c     : centre of the land [u,v] on the circle of the earth (u=r·sin lon, v=r·cos lon, r=(90-lat)/180)
   p     : coastline rings — arrays of [u,v] points (first point = last point closes the ring)
   verse : OPTIONAL — { t:"the words", ref:"BOOK 1:2" } shown the first time you come ashore here
   site  : OPTIONAL — [lat, lon] to place this land's village at a spot you choose */
EARTH.country({
n:"Belize",
c:[-0.403,0.0095],
p:[[[-0.401,0.006],[-0.4,0.006],[-0.4,0.007],[-0.4005,0.008],[-0.397,0.0105],[-0.397,0.012],[-0.398,0.012],[-0.398,0.013],[-0.3995,0.013],[-0.402,0.012],[-0.4025,0.0125],[-0.4045,0.012],[-0.405,0.0125],[-0.408,0.0115],[-0.4095,0.0105],[-0.4095,0.009],[-0.4115,0.0075],[-0.4115,0.0055],[-0.4055,0.006],[-0.401,0.006]]]
});
