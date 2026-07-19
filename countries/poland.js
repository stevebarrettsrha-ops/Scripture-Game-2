/* Poland — this land's own file. Edit freely; the game rebuilds from it on reload.
   n     : the land's name as shown in the game
   c     : centre of the land [u,v] on the circle of the earth (u=r·sin lon, v=r·cos lon, r=(90-lat)/180)
   p     : coastline rings — arrays of [u,v] points (first point = last point closes the ring)
   verse : OPTIONAL — { t:"the words", ref:"BOOK 1:2" } shown the first time you come ashore here
   site  : OPTIONAL — [lat, lon] to place this land's village at a spot you choose */
EARTH.country({
n:"Poland",
c:[0.0705,0.2],
p:[[[0.08,0.184],[0.081,0.186],[0.083,0.1875],[0.0835,0.1895],[0.082,0.1915],[0.084,0.1935],[0.085,0.1955],[0.089,0.1995],[0.089,0.201],[0.0875,0.2025],[0.086,0.208],[0.088,0.21],[0.087,0.21],[0.083,0.2095],[0.0805,0.211],[0.0785,0.211],[0.077,0.213],[0.0745,0.212],[0.073,0.213],[0.0725,0.213],[0.07,0.211],[0.0675,0.2115],[0.0665,0.21],[0.0635,0.21],[0.0635,0.2115],[0.0615,0.211],[0.061,0.2095],[0.058,0.21],[0.056,0.2085],[0.0535,0.2055],[0.0535,0.2035],[0.052,0.201],[0.05,0.1995],[0.0505,0.198],[0.049,0.1955],[0.051,0.193],[0.0555,0.189],[0.059,0.186],[0.0625,0.186],[0.0635,0.187],[0.0665,0.186],[0.0705,0.185],[0.0765,0.183],[0.0785,0.1825],[0.08,0.184]]]
});
