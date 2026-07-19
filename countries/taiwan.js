/* Taiwan — this land's own file. Edit freely; the game rebuilds from it on reload.
   n     : the land's name as shown in the game
   c     : centre of the land [u,v] on the circle of the earth (u=r·sin lon, v=r·cos lon, r=(90-lat)/180)
   p     : coastline rings — arrays of [u,v] points (first point = last point closes the ring)
   verse : OPTIONAL — { t:"the words", ref:"BOOK 1:2" } shown the first time you come ashore here
   site  : OPTIONAL — [lat, lon] to place this land's village at a spot you choose */
EARTH.country({
n:"Taiwan",
c:[0.3145,-0.19],
p:[[[0.31,-0.192],[0.3195,-0.1935],[0.325,-0.193],[0.3225,-0.188],[0.3195,-0.185],[0.3125,-0.1855],[0.3065,-0.188],[0.3065,-0.191],[0.31,-0.192]]]
});
