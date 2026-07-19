/* Madagascar — this land's own file. Edit freely; the game rebuilds from it on reload.
   n     : the land's name as shown in the game
   c     : centre of the land [u,v] on the circle of the earth (u=r·sin lon, v=r·cos lon, r=(90-lat)/180)
   p     : coastline rings — arrays of [u,v] points (first point = last point closes the ring)
   verse : OPTIONAL — { t:"the words", ref:"BOOK 1:2" } shown the first time you come ashore here
   site  : OPTIONAL — [lat, lon] to place this land's village at a spot you choose */
EARTH.country({
n:"Madagascar",
c:[0.438,0.409],
p:[[[0.433,0.3695],[0.4365,0.369],[0.441,0.3695],[0.447,0.3725],[0.451,0.372],[0.4525,0.3745],[0.4525,0.377],[0.4475,0.3775],[0.4475,0.38],[0.452,0.381],[0.4535,0.3835],[0.4525,0.3865],[0.4555,0.39],[0.458,0.3975],[0.46,0.4065],[0.4635,0.4185],[0.4665,0.4265],[0.4675,0.4345],[0.4625,0.442],[0.4575,0.451],[0.452,0.4545],[0.444,0.459],[0.44,0.459],[0.436,0.456],[0.43,0.4555],[0.4265,0.4535],[0.425,0.449],[0.428,0.445],[0.427,0.4435],[0.4275,0.437],[0.426,0.434],[0.4225,0.4335],[0.4185,0.4325],[0.414,0.4295],[0.4145,0.425],[0.413,0.4215],[0.4165,0.4175],[0.42,0.4125],[0.422,0.409],[0.425,0.406],[0.4265,0.3995],[0.43,0.391],[0.43,0.387],[0.427,0.3865],[0.4305,0.3835],[0.431,0.377],[0.429,0.3745],[0.429,0.3705],[0.433,0.3695]]]
});
