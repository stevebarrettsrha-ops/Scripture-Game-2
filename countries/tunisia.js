/* Tunisia — this land's own file. Edit freely; the game rebuilds from it on reload.
   n     : the land's name as shown in the game
   c     : centre of the land [u,v] on the circle of the earth (u=r·sin lon, v=r·cos lon, r=(90-lat)/180)
   p     : coastline rings — arrays of [u,v] points (first point = last point closes the ring)
   verse : OPTIONAL — { t:"the words", ref:"BOOK 1:2" } shown the first time you come ashore here
   site  : OPTIONAL — [lat, lon] to place this land's village at a spot you choose */
EARTH.country({
n:"Tunisia",
c:[0.053,0.3065],
p:[[[0.0545,0.327],[0.0505,0.3175],[0.047,0.316],[0.0465,0.3145],[0.0415,0.312],[0.0405,0.308],[0.0435,0.3045],[0.044,0.2995],[0.0425,0.2945],[0.043,0.2915],[0.0485,0.2885],[0.052,0.2885],[0.0525,0.2915],[0.056,0.2885],[0.057,0.2895],[0.055,0.2925],[0.055,0.295],[0.057,0.296],[0.0575,0.301],[0.0545,0.3045],[0.056,0.307],[0.059,0.307],[0.0605,0.309],[0.063,0.3095],[0.0635,0.314],[0.061,0.316],[0.0595,0.318],[0.0565,0.321],[0.0575,0.323],[0.057,0.3255],[0.0545,0.327]]]
});
