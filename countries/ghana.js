/* Ghana — this land's own file. Edit freely; the game rebuilds from it on reload.
   n     : the land's name as shown in the game
   c     : centre of the land [u,v] on the circle of the earth (u=r·sin lon, v=r·cos lon, r=(90-lat)/180)
   p     : coastline rings — arrays of [u,v] points (first point = last point closes the ring)
   verse : OPTIONAL — { t:"the words", ref:"BOOK 1:2" } shown the first time you come ashore here
   site  : OPTIONAL — [lat, lon] to place this land's village at a spot you choose */
EARTH.country({
n:"Ghana",
c:[-0.008,0.454],
p:[[[0,0.439],[-0.0005,0.4405],[0.003,0.4435],[0.003,0.4475],[0.0035,0.452],[0.0055,0.454],[0.004,0.459],[0.0045,0.4615],[0.007,0.465],[0.0085,0.467],[-0.004,0.4705],[-0.009,0.472],[-0.016,0.4735],[-0.0235,0.4715],[-0.023,0.4695],[-0.0265,0.4645],[-0.024,0.4585],[-0.0205,0.454],[-0.022,0.446],[-0.023,0.4415],[-0.0225,0.4385],[-0.009,0.4385],[-0.006,0.439],[-0.0035,0.4385],[0,0.439]]]
});
