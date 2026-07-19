/* Oman — this land's own file. Edit freely; the game rebuilds from it on reload.
   n     : the land's name as shown in the game
   c     : centre of the land [u,v] on the circle of the earth (u=r·sin lon, v=r·cos lon, r=(90-lat)/180)
   p     : coastline rings — arrays of [u,v] points (first point = last point closes the ring)
   verse : OPTIONAL — { t:"the words", ref:"BOOK 1:2" } shown the first time you come ashore here
   site  : OPTIONAL — [lat, lon] to place this land's village at a spot you choose */
EARTH.country({
n:"Oman",
c:[0.3205,0.2115],
p:[[[0.307,0.2135],[0.3055,0.212],[0.3045,0.209],[0.3025,0.2075],[0.3035,0.2045],[0.302,0.205],[0.2995,0.203],[0.301,0.2],[0.306,0.2],[0.3095,0.198],[0.3125,0.1945],[0.3155,0.1915],[0.3195,0.1905],[0.322,0.19],[0.324,0.1885],[0.325,0.189],[0.3265,0.193],[0.3275,0.1945],[0.3275,0.198],[0.3295,0.202],[0.3275,0.2045],[0.328,0.2065],[0.33,0.209],[0.3335,0.21],[0.3335,0.211],[0.332,0.2135],[0.3315,0.2185],[0.333,0.2205],[0.3335,0.2225],[0.331,0.226],[0.3305,0.229],[0.3325,0.2305],[0.3315,0.234],[0.329,0.237],[0.3275,0.242],[0.326,0.2445],[0.3215,0.244],[0.311,0.243],[0.3185,0.223],[0.312,0.213],[0.307,0.2135]],[[0.297,0.1985],[0.295,0.1985],[0.294,0.1955],[0.295,0.1955],[0.2965,0.197],[0.297,0.1985]]]
});
