/* Burundi — this land's own file. Edit freely; the game rebuilds from it on reload.
   n     : the land's name as shown in the game
   c     : centre of the land [u,v] on the circle of the earth (u=r·sin lon, v=r·cos lon, r=(90-lat)/180)
   p     : coastline rings — arrays of [u,v] points (first point = last point closes the ring)
   verse : OPTIONAL — { t:"the words", ref:"BOOK 1:2" } shown the first time you come ashore here
   site  : OPTIONAL — [lat, lon] to place this land's village at a spot you choose */
EARTH.country({
n:"Burundi",
c:[0.2595,0.4485],
p:[[[0.2605,0.4425],[0.262,0.444],[0.264,0.444],[0.265,0.4455],[0.264,0.448],[0.2625,0.452],[0.2605,0.4555],[0.257,0.4575],[0.2535,0.452],[0.25,0.451],[0.255,0.4485],[0.256,0.4445],[0.2605,0.4425]]]
});
