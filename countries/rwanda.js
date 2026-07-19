/* Rwanda — this land's own file. Edit freely; the game rebuilds from it on reload.
   n     : the land's name as shown in the game
   c     : centre of the land [u,v] on the circle of the earth (u=r·sin lon, v=r·cos lon, r=(90-lat)/180)
   p     : coastline rings — arrays of [u,v] points (first point = last point closes the ring)
   verse : OPTIONAL — { t:"the words", ref:"BOOK 1:2" } shown the first time you come ashore here
   site  : OPTIONAL — [lat, lon] to place this land's village at a spot you choose */
EARTH.country({
n:"Rwanda",
c:[0.255,0.443],
p:[[[0.2565,0.4365],[0.261,0.4375],[0.262,0.4405],[0.2605,0.4425],[0.2605,0.4425],[0.256,0.4445],[0.255,0.4485],[0.25,0.451],[0.2495,0.448],[0.2505,0.447],[0.249,0.444],[0.2505,0.4415],[0.2525,0.4405],[0.2565,0.4365]]]
});
