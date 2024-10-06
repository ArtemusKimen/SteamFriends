var express = require('express');
var router = express.Router();
var app = express();
const http = require('http');
require('dotenv').config()

//TODO Rajouter en helpers
function getFriendDetails(friendSteamid) {

  return new Promise ((resolve) => {

    //TODO : Récupérer par paquets de 100 amis
    const getPlayerSummaries = {
      hostname : "api.steampowered.com",
      path : "/ISteamUser/GetPlayerSummaries/v0002/?key="+process.env.STEAM_API+"&steamids="+friendSteamid,
      method : "GET"
    }

    http.get(getPlayerSummaries, res => {
      let data = [];
      const headerDate = res.headers && res.headers.date ? res.headers.date : 'no response date';
      console.log('Status Code:', res.statusCode);
      console.log('Date in Response header:', headerDate);

      res.on('data', chunk => {
        data.push(chunk);
      });

      res.on('end', () => {
        const friend = JSON.parse(Buffer.concat(data).toString()).response.players[0];
        
        let friendDetails = { 
          name : friend.personaname,
          country : friend.loccountrycode ?? '',
          region : friend.locstatecode ?? '',
          city : friend.loccityid ?? ''
        }
        console.log(JSON.stringify(friendDetails));
        resolve(friendDetails);
      });
    });
  })
}

//TODO Rajouter en controller
function getFriends(steamId) {

  return new Promise((resolve) => {
    let friendsList = [];

    const getFriendList = {
      hostname : "api.steampowered.com",
      path : "/ISteamUser/GetFriendList/v0001/?key="+process.env.STEAM_API+"&steamid="+steamId+"&relationship=friend",
      method : "GET"
    }
  
    http.get(getFriendList, res => {

      let data = [];
    
      const headerDate = res.headers && res.headers.date ? res.headers.date : 'no response date';
      console.log('Status Code:', res.statusCode);
      console.log('Date in Response header:', headerDate);

      res.on('data', chunk => {
        data.push(chunk);
      });
    
      res.on('end', async () => {
        console.log('Response ended: ');
        const friends = JSON.parse(Buffer.concat(data).toString());
        for(friend of friends.friendslist.friends) {
          console.log(`Got friend with id: ${friend.steamid}`);
          friendsList.push(await getFriendDetails(friend.steamid));
          
        }

        for(f of friendsList) {
          console.log("f:" + JSON.stringify(f));        
        }

        //resolve(res.send(friendsList));
        resolve(friendsList);
      });
    });
  })

}


/* GET steam friends list */
router.get('/', async function(req, res, next) {

  res.send(await getFriends(req.query.steamid));
  

});

module.exports = router;
