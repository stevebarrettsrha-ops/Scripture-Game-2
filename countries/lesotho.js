/* Lesotho — this land's own file. Edit freely; the game rebuilds from it on reload.
   n     : the land's name as shown in the game
   c     : centre of the land [u,v] on the circle of the earth (u=r·sin lon, v=r·cos lon, r=(90-lat)/180)
   p     : coastline rings — arrays of [u,v] points (first point = last point closes the ring)
   verse : OPTIONAL — { t:"the words", ref:"BOOK 1:2" } shown the first time you come ashore here
   site  : OPTIONAL — [lat, lon] to place this land's village at a spot you choose */
EARTH.country({
n:"Lesotho",
c:[0.3155,0.5845],
p:[[[0.32,0.578],[0.3245,0.5775],[0.3225,0.5815],[0.322,0.5845],[0.3165,0.588],[0.3155,0.5905],[0.312,0.593],[0.3025,0.5935],[0.306,0.5875],[0.3105,0.5825],[0.315,0.579],[0.32,0.578]]]
});
