/* Yemen — this land's own file. Edit freely; the game rebuilds from it on reload.
   n     : the land's name as shown in the game
   c     : centre of the land [u,v] on the circle of the earth (u=r·sin lon, v=r·cos lon, r=(90-lat)/180)
   p     : coastline rings — arrays of [u,v] points (first point = last point closes the ring)
   verse : OPTIONAL — { t:"the words", ref:"BOOK 1:2" } shown the first time you come ashore here
   site  : OPTIONAL — [lat, lon] to place this land's village at a spot you choose */
EARTH.country({
n:"Yemen",
c:[0.2995,0.2845],
p:[[[0.311,0.243],[0.3215,0.244],[0.326,0.2445],[0.324,0.2495],[0.325,0.252],[0.3265,0.2535],[0.324,0.2605],[0.3185,0.271],[0.317,0.279],[0.315,0.2815],[0.3135,0.283],[0.312,0.2875],[0.31,0.292],[0.3055,0.2965],[0.3045,0.298],[0.3045,0.3],[0.3035,0.302],[0.3035,0.3035],[0.301,0.306],[0.2995,0.3085],[0.296,0.312],[0.292,0.311],[0.29,0.3085],[0.288,0.308],[0.2845,0.306],[0.2815,0.306],[0.282,0.3045],[0.28,0.3035],[0.28,0.302],[0.278,0.3005],[0.279,0.297],[0.277,0.2955],[0.2765,0.2925],[0.2795,0.2915],[0.2805,0.29],[0.286,0.284],[0.2875,0.2835],[0.2925,0.279],[0.294,0.277],[0.297,0.277],[0.2985,0.2735],[0.2975,0.266],[0.3,0.2595],[0.311,0.243]]]
});
