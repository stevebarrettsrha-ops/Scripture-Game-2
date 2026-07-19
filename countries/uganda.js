/* Uganda — this land's own file. Edit freely; the game rebuilds from it on reload.
   n     : the land's name as shown in the game
   c     : centre of the land [u,v] on the circle of the earth (u=r·sin lon, v=r·cos lon, r=(90-lat)/180)
   p     : coastline rings — arrays of [u,v] points (first point = last point closes the ring)
   verse : OPTIONAL — { t:"the words", ref:"BOOK 1:2" } shown the first time you come ashore here
   site  : OPTIONAL — [lat, lon] to place this land's village at a spot you choose */
EARTH.country({
n:"Uganda",
c:[0.2605,0.418],
p:[[[0.282,0.4195],[0.267,0.4295],[0.2585,0.4345],[0.2565,0.4365],[0.2525,0.4405],[0.2505,0.4415],[0.2485,0.4375],[0.249,0.435],[0.2475,0.4305],[0.2475,0.4275],[0.249,0.4235],[0.251,0.4205],[0.2525,0.4175],[0.249,0.4185],[0.2465,0.4125],[0.2465,0.4125],[0.2485,0.4095],[0.2535,0.408],[0.2585,0.403],[0.2635,0.4],[0.2665,0.395],[0.272,0.396],[0.2745,0.3975],[0.281,0.4005],[0.2805,0.406],[0.2795,0.4115],[0.2785,0.4145],[0.282,0.4195]]]
});
