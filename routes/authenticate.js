const express = require('express');
var mysql      = require('mysql');

var secure = require('../utils/secure.js');
var config = require('../config/config.js');

//const pool = mysql.createPool(config.local);
const pool = mysql.createPool(config.heroku);
function getConnection() {
  return pool;
}

const router = express.Router();

router.post('/check_login', function (req, res) {

    var email = req.body.email;
    var password = req.body.password;

    var result = [];
    var  getUserData = function(callback) {

      getConnection().query('SELECT * FROM register WHERE email = ?', [email], function (error, response, fields) {
      if (error) {
        res.send({ "code":400, "failed":"Sorry error ocurred!!" })
      } else {
        if (response.length > 0) {
          if (secure.validate(response[0].password, password)) {
            console.log("User validated!");
            
            for(var i = 0; i<response.length; i++ ) {     
                result.push(response[i]);
            }
            callback(null, result);
            res.redirect('/welcome'); 

          } else {
            console.log("User NOT registered!");
            res.redirect('/login'); 
          }
        }
        else {
          console.log("User NOT registered!");
          res.redirect('/login'); 
        }
      }
    });
  }
  console.log("Call Function");
  getUserData(function (err, result) {
    if (err) console.log("SQL error!");
    //else console.log(result);
  });
});

module.exports = router;