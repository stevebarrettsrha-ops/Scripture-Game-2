/* Bangladesh — this land's own file. Edit freely; the game rebuilds from it on reload.
   n     : the land's name as shown in the game
   c     : centre of the land [u,v] on the circle of the earth (u=r·sin lon, v=r·cos lon, r=(90-lat)/180)
   p     : coastline rings — arrays of [u,v] points (first point = last point closes the ring)
   verse : OPTIONAL — { t:"the words", ref:"BOOK 1:2" } shown the first time you come ashore here
   site  : OPTIONAL — [lat, lon] to place this land's village at a spot you choose */
EARTH.country({
n:"Bangladesh",
c:[0.37,-0.004],
p:[[[0.377,-0.0175],[0.381,-0.0175],[0.3805,-0.0155],[0.385,-0.016],[0.382,-0.014],[0.379,-0.0135],[0.3765,-0.012],[0.3735,-0.009],[0.3735,-0.003],[0.3755,-0.004],[0.3785,-0.002],[0.3775,0.001],[0.3785,0.002],[0.378,0.004],[0.3775,0.0065],[0.373,0.0075],[0.3685,0.0095],[0.3655,0.0085],[0.3635,0.012],[0.3615,0.0105],[0.3595,0.0065],[0.3565,0.011],[0.353,0.009],[0.3555,0.004],[0.3555,0.001],[0.3595,0.0005],[0.3605,-0.0055],[0.36,-0.0115],[0.361,-0.015],[0.3655,-0.012],[0.366,-0.0095],[0.3695,-0.0075],[0.372,-0.011],[0.3685,-0.012],[0.3685,-0.014],[0.377,-0.0175]]]
});
