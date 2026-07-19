/* Malawi — this land's own file. Edit freely; the game rebuilds from it on reload.
   n     : the land's name as shown in the game
   c     : centre of the land [u,v] on the circle of the earth (u=r·sin lon, v=r·cos lon, r=(90-lat)/180)
   p     : coastline rings — arrays of [u,v] points (first point = last point closes the ring)
   verse : OPTIONAL — { t:"the words", ref:"BOOK 1:2" } shown the first time you come ashore here
   site  : OPTIONAL — [lat, lon] to place this land's village at a spot you choose */
EARTH.country({
n:"Malawi",
c:[0.3205,0.4735],
p:[[[0.2985,0.4635],[0.307,0.4595],[0.309,0.4595],[0.3135,0.46],[0.32,0.4645],[0.32,0.4695],[0.3265,0.474],[0.3295,0.472],[0.333,0.471],[0.339,0.472],[0.344,0.4775],[0.341,0.481],[0.3405,0.486],[0.333,0.487],[0.3305,0.484],[0.3305,0.4805],[0.329,0.479],[0.325,0.4805],[0.3225,0.4825],[0.3165,0.4835],[0.311,0.485],[0.311,0.479],[0.3125,0.4755],[0.3085,0.473],[0.3075,0.468],[0.308,0.466],[0.3035,0.463],[0.2985,0.4635]]]
});
