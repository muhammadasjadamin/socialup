var express = require('express');
var router = express.Router();
var userTimeLine = require ('../models/getTimeLine');
var scrapper = require ('../models/twitterScrapper');
var scrapperObj = require ('../models/Scrapper');
var myObj = require ('../models/myScrapper');

var mongo = require ('mongodb')
var mongoose = require ('mongoose');
var assert = require ('assert');
var request = require('request');

var debug = false;

router.get ('/user/:id',function(req,res){
	userTimeLine.getUserTimeLine(req.params.id, function(result){
		for (var key in result)
			console.log(result[key].text)
		console.log(result.length)
		res.send(result)
	})
})

router.get('/scrape/:user/:numtweets', function (req, res) {


    numTweets = req.params.numtweets;

    console.log("Fething "+numTweets+" Tweets from "+req.params.user);

    // request gets data, passes it to parse function in scrapper
    // request("http://www.twitter.com/" + req.params.user, function (error, response, html) {
    //     if (!error)
            myObj.getTimeLine(req.params.user,numTweets, function(data){
                console.log("sending data")
                res.send(data)
            });
    // });
   
});


router.get('/scrape/:user', function (req, res) {
	var name = req.params.user
	for (var i=0;i<50000;i++)
		name+=i;

	res.send(name);
});



module.exports = router;