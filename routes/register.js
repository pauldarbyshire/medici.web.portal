const express = require('express');
var mysql = require('mysql');

var config = require('../config/config.js');
var secure = require('../utils/secure.js');

//const pool = mysql.createPool(config.local);
const pool = mysql.createPool(config.heroku);
function getConnection() {
  return pool;
}

const router = express.Router();

router.post('/new_user', function (req, res) {

    var theDate = new Date();

    var user = {
      "firstname":req.body.firstname,
      "lastname":req.body.lastname,
      "email":req.body.email,
      "telephone":req.body.telephone,
      "password":secure.hash(req.body.password),
      "created":theDate,
      "modified":theDate
    }

    getConnection().query('INSERT INTO register SET ?', user, function (error, response, fields) {
    if (error) {
        console.log("Error registering user!");
        res.redirect('/register'); 
    } else {
        console.log("New user registered!");
        res.redirect('/login'); 
    }
  });
});

module.exports = router;