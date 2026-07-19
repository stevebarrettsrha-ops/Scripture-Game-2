/* Nepal — this land's own file. Edit freely; the game rebuilds from it on reload.
   n     : the land's name as shown in the game
   c     : centre of the land [u,v] on the circle of the earth (u=r·sin lon, v=r·cos lon, r=(90-lat)/180)
   p     : coastline rings — arrays of [u,v] points (first point = last point closes the ring)
   verse : OPTIONAL — { t:"the words", ref:"BOOK 1:2" } shown the first time you come ashore here
   site  : OPTIONAL — [lat, lon] to place this land's village at a spot you choose */
EARTH.country({
n:"Nepal",
c:[0.3415,0.0325],
p:[[[0.345,0.0115],[0.3475,0.012],[0.351,0.011],[0.353,0.012],[0.353,0.017],[0.351,0.0245],[0.3505,0.029],[0.347,0.0325],[0.3455,0.0405],[0.3415,0.048],[0.338,0.053],[0.335,0.0585],[0.33,0.0555],[0.3285,0.0515],[0.3275,0.049],[0.3295,0.0445],[0.334,0.039],[0.335,0.036],[0.338,0.034],[0.3395,0.0295],[0.3425,0.025],[0.344,0.0185],[0.345,0.0115]]]
});
