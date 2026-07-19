/* Bhutan — this land's own file. Edit freely; the game rebuilds from it on reload.
   n     : the land's name as shown in the game
   c     : centre of the land [u,v] on the circle of the earth (u=r·sin lon, v=r·cos lon, r=(90-lat)/180)
   p     : coastline rings — arrays of [u,v] points (first point = last point closes the ring)
   verse : OPTIONAL — { t:"the words", ref:"BOOK 1:2" } shown the first time you come ashore here
   site  : OPTIONAL — [lat, lon] to place this land's village at a spot you choose */
EARTH.country({
n:"Bhutan",
c:[0.3475,-0.004],
p:[[[0.3455,-0.01],[0.3475,-0.013],[0.3505,-0.0125],[0.351,-0.0075],[0.3505,-0.0025],[0.3515,0.0015],[0.3495,0.007],[0.3485,0.007],[0.344,0.003],[0.343,0],[0.344,-0.0045],[0.344,-0.0075],[0.3455,-0.01]]]
});
