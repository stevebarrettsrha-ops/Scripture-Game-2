/* Falkland Is. — this land's own file. Edit freely; the game rebuilds from it on reload.
   n     : the land's name as shown in the game
   c     : centre of the land [u,v] on the circle of the earth (u=r·sin lon, v=r·cos lon, r=(90-lat)/180)
   p     : coastline rings — arrays of [u,v] points (first point = last point closes the ring)
   verse : OPTIONAL — { t:"the words", ref:"BOOK 1:2" } shown the first time you come ashore here
   site  : OPTIONAL — [lat, lon] to place this land's village at a spot you choose */
EARTH.country({
n:"Falkland Is.",
c:[-0.679,0.3985],
p:[[[-0.6905,0.3795],[-0.6795,0.3925],[-0.675,0.403],[-0.6685,0.409],[-0.665,0.4195],[-0.669,0.417],[-0.68,0.402],[-0.6815,0.396],[-0.6895,0.387],[-0.6905,0.3795]]]
});
