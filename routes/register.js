const express = require('express');
var mysql = require('mysql');
var nodemailer = require('nodemailer');

var config = require('../config/config.js');
var secure = require('../utils/secure.js');

//const pool = mysql.createPool(config.local);
const pool = mysql.createPool(config.heroku);
function getConnection() {
  return pool;
}

function sendEmail(email) {
    var transporter = nodemailer.createTransport({
      service: 'Yahoo',
      auth: {
        user: 'ericjones529@yahoo.com',
        pass: 'x41TT#3yR'
      }
    });
    
    var mailOptions = {
      from: 'ericjones529@yahoo.com',
      to: email,
      subject: 'Medici Web Portal Registration',
      text: 'Registration successful!'
    };
    
    transporter.sendMail(mailOptions, function(error, info){
      if (error) {
        console.log(error);
      } else {
        console.log('Email sent: ' + info.response);
      }
    });
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
        //sendEmail(req.body.email);
        res.redirect('/login'); 
    }
  });
});

module.exports = router;