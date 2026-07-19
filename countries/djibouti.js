/* Djibouti — this land's own file. Edit freely; the game rebuilds from it on reload.
   n     : the land's name as shown in the game
   c     : centre of the land [u,v] on the circle of the earth (u=r·sin lon, v=r·cos lon, r=(90-lat)/180)
   p     : coastline rings — arrays of [u,v] points (first point = last point closes the ring)
   verse : OPTIONAL — { t:"the words", ref:"BOOK 1:2" } shown the first time you come ashore here
   site  : OPTIONAL — [lat, lon] to place this land's village at a spot you choose */
EARTH.country({
n:"Djibouti",
c:[0.2935,0.32],
p:[[[0.29,0.318],[0.2925,0.316],[0.2935,0.3135],[0.296,0.3135],[0.297,0.3155],[0.295,0.3195],[0.2985,0.3185],[0.2985,0.3225],[0.2965,0.323],[0.2955,0.3245],[0.292,0.327],[0.291,0.326],[0.2895,0.3255],[0.2895,0.3215],[0.29,0.318]]]
});
