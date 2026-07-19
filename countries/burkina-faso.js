/* Burkina Faso — this land's own file. Edit freely; the game rebuilds from it on reload.
   n     : the land's name as shown in the game
   c     : centre of the land [u,v] on the circle of the earth (u=r·sin lon, v=r·cos lon, r=(90-lat)/180)
   p     : coastline rings — arrays of [u,v] points (first point = last point closes the ring)
   verse : OPTIONAL — { t:"the words", ref:"BOOK 1:2" } shown the first time you come ashore here
   site  : OPTIONAL — [lat, lon] to place this land's village at a spot you choose */
EARTH.country({
n:"Burkina Faso",
c:[-0.0145,0.432],
p:[[[-0.0415,0.4405],[-0.042,0.437],[-0.0395,0.435],[-0.0395,0.433],[-0.033,0.429],[-0.032,0.4255],[-0.0295,0.424],[-0.026,0.425],[-0.023,0.424],[-0.022,0.423],[-0.016,0.4205],[-0.0145,0.419],[-0.008,0.4165],[-0.0035,0.416],[-0.002,0.417],[0.0025,0.417],[0.002,0.4195],[0.003,0.4225],[0.0075,0.426],[0.0075,0.4285],[0.0165,0.4295],[0.0165,0.4335],[0.0145,0.435],[0.011,0.4355],[0.0095,0.438],[0.007,0.439],[0,0.439],[-0.0035,0.4385],[-0.006,0.439],[-0.009,0.4385],[-0.0225,0.4385],[-0.023,0.4415],[-0.022,0.446],[-0.0275,0.444],[-0.031,0.444],[-0.0335,0.4455],[-0.037,0.444],[-0.0385,0.442],[-0.0415,0.4405]]]
});
