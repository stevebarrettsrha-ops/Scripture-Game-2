/* Gabon — this land's own file. Edit freely; the game rebuilds from it on reload.
   n     : the land's name as shown in the game
   c     : centre of the land [u,v] on the circle of the earth (u=r·sin lon, v=r·cos lon, r=(90-lat)/180)
   p     : coastline rings — arrays of [u,v] points (first point = last point closes the ring)
   verse : OPTIONAL — { t:"the words", ref:"BOOK 1:2" } shown the first time you come ashore here
   site  : OPTIONAL — [lat, lon] to place this land's village at a spot you choose */
EARTH.country({
n:"Gabon",
c:[0.1035,0.491],
p:[[[0.0955,0.478],[0.099,0.477],[0.1045,0.4765],[0.109,0.4745],[0.1105,0.475],[0.11,0.4775],[0.113,0.4795],[0.1195,0.4775],[0.1215,0.478],[0.1195,0.4855],[0.1245,0.4875],[0.1265,0.4915],[0.126,0.4955],[0.124,0.4985],[0.1165,0.5],[0.111,0.4985],[0.111,0.501],[0.1055,0.503],[0.1025,0.505],[0.1065,0.508],[0.1005,0.5125],[0.0905,0.5085],[0.0835,0.505],[0.0775,0.5],[0.0775,0.4985],[0.079,0.4965],[0.0805,0.492],[0.0815,0.4875],[0.0845,0.487],[0.0965,0.4845],[0.0955,0.478]]]
});
