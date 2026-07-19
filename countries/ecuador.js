/* Ecuador — this land's own file. Edit freely; the game rebuilds from it on reload.
   n     : the land's name as shown in the game
   c     : centre of the land [u,v] on the circle of the earth (u=r·sin lon, v=r·cos lon, r=(90-lat)/180)
   p     : coastline rings — arrays of [u,v] points (first point = last point closes the ring)
   verse : OPTIONAL — { t:"the words", ref:"BOOK 1:2" } shown the first time you come ashore here
   site  : OPTIONAL — [lat, lon] to place this land's village at a spot you choose */
EARTH.country({
n:"Ecuador",
c:[-0.499,0.0995],
p:[[[-0.4845,0.1265],[-0.4885,0.1285],[-0.4925,0.127],[-0.5005,0.119],[-0.505,0.109],[-0.511,0.1045],[-0.515,0.1035],[-0.518,0.099],[-0.516,0.0945],[-0.516,0.091],[-0.5175,0.087],[-0.5155,0.0865],[-0.5135,0.089],[-0.5115,0.0875],[-0.5065,0.0915],[-0.5045,0.089],[-0.5075,0.086],[-0.506,0.0805],[-0.5045,0.082],[-0.4995,0.0795],[-0.498,0.0825],[-0.4945,0.0835],[-0.4905,0.0865],[-0.4885,0.0855],[-0.4865,0.09],[-0.483,0.095],[-0.4845,0.104],[-0.484,0.106],[-0.486,0.1085],[-0.485,0.1155],[-0.4835,0.118],[-0.4845,0.1225],[-0.4845,0.1265]]]
});
