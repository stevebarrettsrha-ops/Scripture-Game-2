/* Somalia — this land's own file. Edit freely; the game rebuilds from it on reload.
   n     : the land's name as shown in the game
   c     : centre of the land [u,v] on the circle of the earth (u=r·sin lon, v=r·cos lon, r=(90-lat)/180)
   p     : coastline rings — arrays of [u,v] points (first point = last point closes the ring)
   verse : OPTIONAL — { t:"the words", ref:"BOOK 1:2" } shown the first time you come ashore here
   site  : OPTIONAL — [lat, lon] to place this land's village at a spot you choose */
EARTH.country({
n:"Somalia",
c:[0.337,0.317],
p:[[[0.338,0.381],[0.331,0.381],[0.318,0.366],[0.319,0.356],[0.3195,0.3535],[0.3235,0.3495],[0.326,0.342],[0.3335,0.334],[0.3375,0.306],[0.3375,0.299],[0.3375,0.294],[0.335,0.292],[0.331,0.2885],[0.3295,0.287],[0.3295,0.2865],[0.3295,0.2865],[0.331,0.285],[0.3325,0.2815],[0.3345,0.278],[0.3355,0.274],[0.337,0.272],[0.3385,0.273],[0.3405,0.2755],[0.343,0.277],[0.3435,0.2795],[0.3465,0.285],[0.349,0.292],[0.351,0.3005],[0.353,0.311],[0.3525,0.3205],[0.3515,0.333],[0.349,0.342],[0.3435,0.355],[0.341,0.3635],[0.3385,0.375],[0.3385,0.3785],[0.338,0.381]]]
});
