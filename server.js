var express    = require("express");
const morgan = require('morgan');
var bodyParser = require('body-parser');

var register = require('./routes/register.js');
var authenticate = require('./routes/authenticate.js');

var app = express();

app.use(bodyParser.urlencoded({ extended: false }));
//app.use(bodyParser.json());

//app.use(express.static('./public'));
var path = __dirname + '/views/';

app.use(morgan('short'));

app.use(register);
app.use(authenticate);

app.get("/", function(req, res) {
    res.sendFile(path + 'index.html');
});

app.get('/login', function (req, res) {  
    res.sendFile(path + "login.html" );  
})  

app.get('/register', function (req, res) {  
    res.sendFile(path + "register.html" );  
})  

app.get('/welcome', function (req, res) {  
    res.sendFile(path + "welcome.html" );  
})  

app.get('/book', function (req, res) {  
    res.sendFile(path + "book.html" );  
})

app.get('/clinic', function (req, res) {  
    res.sendFile(path + "clinic.html" );  
})

app.get('/buy', function (req, res) {  
    res.sendFile(path + "buy.html" );  
})

const PORT = process.env.PORT || 5000;
app.listen(PORT, function() {
  console.log('Server running at Port: '+PORT);
});