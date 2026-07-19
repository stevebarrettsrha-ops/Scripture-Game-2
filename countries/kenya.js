/* Kenya — this land's own file. Edit freely; the game rebuilds from it on reload.
   n     : the land's name as shown in the game
   c     : centre of the land [u,v] on the circle of the earth (u=r·sin lon, v=r·cos lon, r=(90-lat)/180)
   p     : coastline rings — arrays of [u,v] points (first point = last point closes the ring)
   verse : OPTIONAL — { t:"the words", ref:"BOOK 1:2" } shown the first time you come ashore here
   site  : OPTIONAL — [lat, lon] to place this land's village at a spot you choose */
EARTH.country({
n:"Kenya",
c:[0.3025,0.3895],
p:[[[0.3325,0.4075],[0.3185,0.4115],[0.3165,0.409],[0.2835,0.419],[0.282,0.4195],[0.2785,0.4145],[0.2795,0.4115],[0.2805,0.406],[0.281,0.4005],[0.2745,0.3975],[0.272,0.396],[0.2665,0.395],[0.269,0.3895],[0.271,0.383],[0.275,0.3815],[0.277,0.384],[0.2805,0.3835],[0.285,0.3805],[0.2965,0.3775],[0.2985,0.376],[0.3,0.3745],[0.3015,0.374],[0.3065,0.371],[0.307,0.3675],[0.311,0.361],[0.315,0.36],[0.319,0.356],[0.318,0.366],[0.331,0.381],[0.338,0.381],[0.335,0.387],[0.3345,0.39],[0.3325,0.3925],[0.334,0.3965],[0.333,0.4],[0.334,0.404],[0.3325,0.4075]]]
});
