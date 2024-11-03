
const http = require('http');
const steamLocation = require("../helpers/steamLocation");

//Récupère les détails d'un utilisateur Steam
function getFriendDetails(friendSteamid) {

  return new Promise ((resolve) => {

    //TODO : Récupérer par paquets de 100 amis
    const url = {
      hostname : "api.steampowered.com",
      path : "/ISteamUser/GetPlayerSummaries/v0002/?key="+process.env.STEAM_API+"&steamids="+friendSteamid,
      method : "GET"
    }

    http.get(url, res => {
      let data = [];
      const headerDate = res.headers && res.headers.date ? res.headers.date : 'no response date';
      console.log('Status Code for GET /GetPlayerSummaries :', res.statusCode);

      res.on('data', chunk => {
        data.push(chunk);
      });

      res.on('end', () => {
        const friend = JSON.parse(Buffer.concat(data).toString()).response.players[0];
        
        const location = steamLocation.find(friend.loccountrycode, friend.locstatecode, friend.loccityid);

        let friendDetails = { 
          name : friend.personaname,
          country : location.loccountry ?? '',
          region : location.locstate ?? '',
          city : location.loccity ?? ''
        }
        
        resolve(friendDetails);
      });
    });
  })
}

//Récupére la liste des contacts Steam
function getFriendsList(steamId) {

  return new Promise((resolve) => {
    let friendsList = [];

    const url = {
      hostname : "api.steampowered.com",
      path : "/ISteamUser/GetFriendList/v0001/?key="+process.env.STEAM_API+"&steamid="+steamId+"&relationship=friend",
      method : "GET"
    }
  
    http.get(url, res => {

      let data = [];
    
      const headerDate = res.headers && res.headers.date ? res.headers.date : 'no response date';
      console.log('Status Code for GET /GetFriendList:', res.statusCode);

      res.on('data', chunk => {
        data.push(chunk);
      });
    
      res.on('end', async () => {
        const friendsJson = JSON.parse(Buffer.concat(data).toString());
        for(friend of friendsJson.friendslist.friends) {
          friendsList.push(await getFriendDetails(friend.steamid));
        }

        console.log("friendList: ");
        for(f of friendsList) {
          console.log(JSON.stringify(f));        
        }

        //resolve(res.send(friendsList));
        resolve(friendsList);
      });
    });
  })

}

exports.friends = async function(req, res, next) {
  res.send(await getFriendsList(req.query.steamid));
}
