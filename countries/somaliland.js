/* Somaliland — this land's own file. Edit freely; the game rebuilds from it on reload.
   n     : the land's name as shown in the game
   c     : centre of the land [u,v] on the circle of the earth (u=r·sin lon, v=r·cos lon, r=(90-lat)/180)
   p     : coastline rings — arrays of [u,v] points (first point = last point closes the ring)
   verse : OPTIONAL — { t:"the words", ref:"BOOK 1:2" } shown the first time you come ashore here
   site  : OPTIONAL — [lat, lon] to place this land's village at a spot you choose */
EARTH.country({
n:"Somaliland",
c:[0.3195,0.3045],
p:[[[0.3295,0.2865],[0.3295,0.2865],[0.3295,0.287],[0.331,0.2885],[0.335,0.292],[0.3375,0.294],[0.3375,0.299],[0.3375,0.306],[0.333,0.311],[0.31,0.3245],[0.3065,0.3255],[0.3025,0.3255],[0.2985,0.325],[0.2985,0.3225],[0.2985,0.3185],[0.301,0.3175],[0.3035,0.318],[0.3075,0.3175],[0.3105,0.3145],[0.3145,0.3085],[0.32,0.302],[0.323,0.296],[0.3255,0.293],[0.3265,0.29],[0.3295,0.2865],[0.3295,0.2865]]]
});
