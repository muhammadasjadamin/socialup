var express = require ('express');
var bodyParser = require ('body-parser');
var path = require ('path');


var app = express();

app.set ('view engine','ejs');
app.set ('views', path.join(__dirname,'views') );

app.use(bodyParser.json());
app.use (bodyParser.urlencoded({extended: true}));
app.use (express.static(path.join( __dirname,'static')));


var routes = require('./routes/index');
//var users = require('./routes/users')

app.use('/', routes);
//app.use('/users', users);

app.listen(8000);
console.log('running on port 8000')
