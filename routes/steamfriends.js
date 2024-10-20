var express = require('express');
var router = express.Router();
//require('dotenv').config()
const friends_controller = require("../controllers/friendsController");

//Récupére la liste des contacts Steam avec leurs détails
router.get('/', friends_controller.friendsList);

module.exports = router;
