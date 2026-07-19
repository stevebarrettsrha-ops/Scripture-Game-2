/* Fiji — this land's own file. Edit freely; the game rebuilds from it on reload.
   n     : the land's name as shown in the game
   c     : centre of the land [u,v] on the circle of the earth (u=r·sin lon, v=r·cos lon, r=(90-lat)/180)
   p     : coastline rings — arrays of [u,v] points (first point = last point closes the ring)
   verse : OPTIONAL — { t:"the words", ref:"BOOK 1:2" } shown the first time you come ashore here
   site  : OPTIONAL — [lat, lon] to place this land's village at a spot you choose */
EARTH.country({
n:"Fiji",
c:[0.0205,-0.598],
p:[[[0,-0.5895],[0,-0.592],[0.0065,-0.5935],[0.013,-0.5945],[0.0145,-0.5925],[0.0095,-0.591],[0.006,-0.591],[0,-0.5895]],[[0.0195,-0.597],[0.017,-0.596],[0.0135,-0.598],[0.015,-0.6005],[0.0215,-0.601],[0.0275,-0.6005],[0.0285,-0.598],[0.024,-0.596],[0.0195,-0.597]],[[-0.002,-0.589],[-0.001,-0.5915],[0,-0.592],[0,-0.5895],[-0.002,-0.589]]]
});
