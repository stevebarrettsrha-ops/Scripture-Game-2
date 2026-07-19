/* Togo — this land's own file. Edit freely; the game rebuilds from it on reload.
   n     : the land's name as shown in the game
   c     : centre of the land [u,v] on the circle of the earth (u=r·sin lon, v=r·cos lon, r=(90-lat)/180)
   p     : coastline rings — arrays of [u,v] points (first point = last point closes the ring)
   verse : OPTIONAL — { t:"the words", ref:"BOOK 1:2" } shown the first time you come ashore here
   site  : OPTIONAL — [lat, lon] to place this land's village at a spot you choose */
EARTH.country({
n:"Togo",
c:[0.007,0.4505],
p:[[[0.007,0.439],[0.006,0.442],[0.0085,0.4435],[0.011,0.4455],[0.0115,0.448],[0.013,0.449],[0.013,0.462],[0.015,0.4655],[0.0085,0.467],[0.007,0.465],[0.0045,0.4615],[0.004,0.459],[0.0055,0.454],[0.0035,0.452],[0.003,0.4475],[0.003,0.4435],[-0.0005,0.4405],[0,0.439],[0.007,0.439]]]
});
