/* North Macedonia — this land's own file. Edit freely; the game rebuilds from it on reload.
   n     : the land's name as shown in the game
   c     : centre of the land [u,v] on the circle of the earth (u=r·sin lon, v=r·cos lon, r=(90-lat)/180)
   p     : coastline rings — arrays of [u,v] points (first point = last point closes the ring)
   verse : OPTIONAL — { t:"the words", ref:"BOOK 1:2" } shown the first time you come ashore here
   site  : OPTIONAL — [lat, lon] to place this land's village at a spot you choose */
EARTH.country({
n:"North Macedonia",
c:[0.099,0.2495],
p:[[[0.101,0.245],[0.1035,0.2455],[0.1055,0.249],[0.1045,0.2495],[0.1045,0.2505],[0.102,0.2515],[0.1005,0.2535],[0.098,0.255],[0.0955,0.2545],[0.094,0.2525],[0.094,0.2505],[0.094,0.2505],[0.0945,0.25],[0.0945,0.249],[0.0965,0.2475],[0.0975,0.2465],[0.099,0.246],[0.101,0.245]]]
});
