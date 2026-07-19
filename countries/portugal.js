/* Portugal — this land's own file. Edit freely; the game rebuilds from it on reload.
   n     : the land's name as shown in the game
   c     : centre of the land [u,v] on the circle of the earth (u=r·sin lon, v=r·cos lon, r=(90-lat)/180)
   p     : coastline rings — arrays of [u,v] points (first point = last point closes the ring)
   verse : OPTIONAL — { t:"the words", ref:"BOOK 1:2" } shown the first time you come ashore here
   site  : OPTIONAL — [lat, lon] to place this land's village at a spot you choose */
EARTH.country({
n:"Portugal",
c:[-0.039,0.2765],
p:[[[-0.042,0.264],[-0.04,0.263],[-0.038,0.2625],[-0.0375,0.265],[-0.0345,0.2655],[-0.0335,0.265],[-0.031,0.2655],[-0.03,0.2685],[-0.0325,0.2695],[-0.033,0.274],[-0.034,0.2745],[-0.0345,0.2775],[-0.0365,0.2775],[-0.035,0.281],[-0.037,0.2845],[-0.0355,0.2865],[-0.036,0.2875],[-0.0385,0.2895],[-0.038,0.2915],[-0.0405,0.2925],[-0.043,0.2915],[-0.0455,0.2915],[-0.044,0.2875],[-0.044,0.284],[-0.0465,0.283],[-0.047,0.281],[-0.046,0.2775],[-0.044,0.2755],[-0.043,0.2735],[-0.0415,0.2705],[-0.0415,0.268],[-0.042,0.266],[-0.042,0.264]]]
});
