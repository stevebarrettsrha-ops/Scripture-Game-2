/* Benin — this land's own file. Edit freely; the game rebuilds from it on reload.
   n     : the land's name as shown in the game
   c     : centre of the land [u,v] on the circle of the earth (u=r·sin lon, v=r·cos lon, r=(90-lat)/180)
   p     : coastline rings — arrays of [u,v] points (first point = last point closes the ring)
   verse : OPTIONAL — { t:"the words", ref:"BOOK 1:2" } shown the first time you come ashore here
   site  : OPTIONAL — [lat, lon] to place this land's village at a spot you choose */
EARTH.country({
n:"Benin",
c:[0.018,0.445],
p:[[[0.022,0.4645],[0.015,0.4655],[0.013,0.462],[0.013,0.449],[0.0115,0.448],[0.011,0.4455],[0.0085,0.4435],[0.006,0.442],[0.007,0.439],[0.0095,0.438],[0.011,0.4355],[0.0145,0.435],[0.0165,0.4335],[0.019,0.4315],[0.0215,0.4315],[0.0275,0.4345],[0.027,0.436],[0.029,0.4395],[0.028,0.4415],[0.0285,0.443],[0.025,0.447],[0.023,0.4485],[0.0215,0.452],[0.022,0.4555],[0.022,0.4645]]]
});
