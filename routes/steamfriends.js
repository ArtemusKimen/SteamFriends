var express = require('express');
var router = express.Router();
//require('dotenv').config()
const steamController = require("../controllers/steamController");

//Récupére la liste des contacts Steam avec leurs détails
router.get('/', steamController.friends);

module.exports = router;
