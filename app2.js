var express = require('express');
var fs = require('fs');
var cheerio = require('cheerio');
var request = require('request');
var app = express();

var data = {
    stream:[],
    min:null,
    max:null
};
var count = 0;

var numTweets = 0;

var debug = false;

function parse(html,callback) {
    var $ = cheerio.load(html);

    var elements = $("li.js-stream-item");

    console.log("Fetched "+elements.length+" tweets.");

    if($("#timeline .stream-container").length > 0) {
        data.max = $("#timeline .stream-container").data("max-position");
        data.min = $("#timeline .stream-container").data("min-position");
    }

    elements.each(function (i, elem) {
        var tweetHeader = $(this).find(".stream-item-header").text();
        tweetHeader = tweetHeader.replace(/[\s\n]+/gm, " ");
        var tweetText = $(this).find(".js-tweet-text-container").text();
        tweetText = tweetText.replace(/[\s\n]+/gm, " ");
        var retweets = $(this).find(".ProfileTweet-action--retweet .ProfileTweet-actionCountForAria").text();
        retweets = retweets.replace(/[^\d]*/gm, "");
        var favourites = $(this).find(".ProfileTweet-action--favorite .ProfileTweet-actionCountForAria").text();
        favourites = favourites.replace(/[^\d]*/gm, "");
        var tweetID = $(this).find("div.js-stream-tweet").data('tweet-id');
        var permalink = $(this).find("div.js-stream-tweet").data('permalink-path');
        // console.log(stream);
        data.stream[count] = {
            header    : tweetHeader,
            content   : tweetText,
            retweets  : retweets,
            favourites: favourites,
            tweetID : tweetID,
            permalink : permalink
        };
        count++;
    });



    if(typeof callback === "function")
        callback(data);
}

function getMore(req,res,position,callback){
    var uri = "http://twitter.com/i/profiles/show/"+req.params.user+"/timeline/tweets?max_position=" + position;
        console.log("Fetching: "+uri);
    request(uri, function (error, response, html) {
        if (!error)
            jsonResponse = JSON.parse(html);
            // fs.writeFile('./json.html', html, 'utf8');
            data.min = jsonResponse.min_position;
            html = jsonResponse.items_html;

            parse(html,function(data){
                if(data.stream.length < numTweets){
                    getMore(req,res,data.min,callback);
                }else{
                    if(typeof callback === "function")
                        callback(data);
                }
            });
    });
};


app.get('/scrape/:user/:numtweets', function (req, res) {

    //Reinitialize
    count = 0;
    numTweets = 0;
    data = {
        stream:[],
        min:null,
        max:null
    };

    // console.log(req.params.user);
    // res.send("Scraping user: "+req.params.user);

    numTweets = req.params.numtweets;

    console.log("Fething "+numTweets+" Tweets from "+req.params.user);


    if (debug) {

        fs.access('./twitter.html', fs.R_OK, function (err) {
            if (err) {
                request("http://www.twitter.com/" + req.params.user, function (error, response, html) {
                    if (!error) {
                        fs.writeFile('./twitter.html', html, 'utf8', function (err) {
                            if (err) throw err;
                            console.log('written to twitter.html');
                            parse(html,function(data){
                                res.json(data);
                            });
                        });
                    }
                });
            } else {
                fs.readFile('./twitter.html', function (err, data) {
                    if (err)throw err;
                    parse(data,function(data){
                        res.json(data);
                    });
                });
            }
        });
    } else {
        request("http://www.twitter.com/" + req.params.user, function (error, response, html) {
            if (!error)
                parse(html, function(data){
                    if(data.stream.length < numTweets){
                        getMore(req,res,data.min,function(data){
                            res.json(data);
                        });
                    }else{
                        res.json(data);
                    }
                });
        });
    }
});

app.listen('8000');

exports = module.exports = app;
