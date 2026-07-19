/* Montenegro — this land's own file. Edit freely; the game rebuilds from it on reload.
   n     : the land's name as shown in the game
   c     : centre of the land [u,v] on the circle of the earth (u=r·sin lon, v=r·cos lon, r=(90-lat)/180)
   p     : coastline rings — arrays of [u,v] points (first point = last point closes the ring)
   verse : OPTIONAL — { t:"the words", ref:"BOOK 1:2" } shown the first time you come ashore here
   site  : OPTIONAL — [lat, lon] to place this land's village at a spot you choose */
EARTH.country({
n:"Montenegro",
c:[0.0875,0.2475],
p:[[[0.0905,0.2475],[0.0895,0.2485],[0.089,0.2475],[0.088,0.2505],[0.0885,0.252],[0.0875,0.252],[0.086,0.251],[0.0835,0.2505],[0.0835,0.2495],[0.0835,0.2465],[0.0845,0.2445],[0.085,0.244],[0.0865,0.2445],[0.0875,0.245],[0.089,0.245],[0.091,0.2455],[0.091,0.246],[0.0905,0.2475]]]
});
