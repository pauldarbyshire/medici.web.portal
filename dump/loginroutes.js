var mysql      = require('mysql');

var db_connect = mysql.createConnection({
    host:           'us-cdbr-iron-east-04.cleardb.net', 
    user:           'b5b88de12e7a24', 
    password:       '744e44b0', 
    database:       'heroku_59c60ed070a8546' 
});

    db_connect.connect(function(err){
    if(!err) {
        console.log("Good Luck Your Database is connected ...");
    } else {
        console.log("Sorrey Error connecting database.");
    }
});

module.exports.register = function(datarequest,dataresults){
    var crdate = new Date();
    var students={
      "student_name":datarequest.body.student_name,
      "student_father_name":datarequest.body.student_father_name,
      "email":datarequest.body.email,
      "password":datarequest.body.password,
      "created":crdate,
      "modified":crdate
    }
    db_connect.query('INSERT INTO students SET ?',students, function (error, respnose, fields) {
    if (error) {
      console.log("Sorry error ocurred.!!",error);
      dataresults.send({
        "code":400,
        "failed":"Sorry error ocurred!!"
      })
    }else{
      console.log('The Live solution is: ', respnose);
      dataresults.send({
        "code":200,
        "success":"Good Luck Students registered sucessfully"
          });
    }
    });
  }

  module.exports.login = function(datarequest,dataresults){
    var email= datarequest.body.email;
    var password = datarequest.body.password;
    console.log("Email: " + email);
    console.log("Password: " + password);
    db_connect.query('SELECT * FROM students WHERE email = ?',[email], function (error, response, fields) {
    if (error) {
      dataresults.send({
        "code":400,
        "failed":"Sorry error ocurred!!"
      })
    }else{
      if(response.length >0){
        if(response[0].password == password){
          dataresults.send({
            "code":200,
            "success":"Good Luck login sucessfull"
              });
        }
        else{
          dataresults.send({
            "code":204,
            "success":"Sorry Email and password does not match"
              });
        }
      }
      else{
        dataresults.send({
          "code":204,
          "success":"Sorry Email does not exits"
            });
      }
    }
    });
  }