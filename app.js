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

app.listen(3000);
console.log('running on port 3000')

// mongoose.connect('mongodb://localhost/test')
// var db = mongoose.connection;

// app.get ('/state/:id',function(req,res){
// 	var result = worldTrend.getStateTrends (req.params.id, db,function(result){
// 		console.log(result)
// 		res.send(result);
// 	})

// })	

// app.get ('/',function(req,res){


// 	var result = worldTrend.getWorldTrends (db,function(result){
// 		for (var k = 0; k < 10; k++)
// 			console.log(result[k])
// 		res.send(result);
// 	})

// })	