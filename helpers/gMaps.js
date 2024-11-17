
/*************************************************
 *  Generate GoogleMaps' marker for friend
 *  Parameter : friends
 *  output : string
 **************************************************/

function getMarker(friend) {
  
  var result = "";
  
  if(friend.city){
    result = "&markers=color:0x333840%7Clabel:" + (friend.name).substring(0, 1) + "%7C" + friend.city;
  } 

  return result;
}

module.exports = { getMarker };
