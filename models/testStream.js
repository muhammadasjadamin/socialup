

var Twit = require('twit');

var T = new Twit({
    consumer_key:         'lUEfgNKBwe4Mm5YowLtRG8l33', 
    consumer_secret:      'Fmo4BaodU1zSjqAITHjWlBkAJvsjLA9CkulpbXCLBONfKyJzEd', 
    access_token:         '3590486067-OZTgv8yC2i7Nq0zQWGbu8IC2j0NaJz2HVeL2599', 
    access_token_secret:  'gZ26KZuLutQM7lnPqSbqBxa4MtUTmD3uivGWya7nzXl8N'
})


// var karachi = [ '67.01','24.09','67.17','25.8']
// var sanFrancisco = [ '-122.75', '36.8', '-121.75', '37.8' ]
// var Pakistan = [ '62.9', '25.2', '73.3', '35.2' ]
// var USA = [ '-124.4835','31.6423','-95.0250','48.8604']

var stream = T.stream('statuses/filter',{follow: [3590486067]});

var activity = 0
stream.on ('tweet', function(result){
	activity++;

	console.log("*****************************************")
	console.log(activity)
	console.log(result)
})