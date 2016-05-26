var fs = require('fs');
var cheerio = require('cheerio');
var request = require('request');

var requestCount = 0;
var data = []



function parse(html,data) {

	var $ = cheerio.load(html);

    var elementsCount = 0
    var elements = $("li.js-stream-item");
    console.log("Fetched "+elements.length+" tweets for "+ data.userName);

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

        data.stream[data.count] = {
            header    : tweetHeader,
            content   : tweetText,
            retweets  : retweets,
            favourites: favourites,
            tweetID : tweetID,
            permalink : permalink
        };

        data.count++;
        elementsCount++;
    });


    if (elementsCount === elements.length)
    {
        console.log("returning from parse")
        data.fetchedCount += elementsCount;
        return data;
    }
}

function getTimeLine ( userName, fetchCount, callback ){

    requestCount++
    data[requestCount] = {
        "stream":[],
        "min": 0,
        "max": 0,
        "count": 0,
        "fetchCount": fetchCount,
        "count": 0,
        "fetchedCount": 0,
        "userName":  userName,
        "returnNow": false
    };
   
    getTweets(data[requestCount], function( returnState ){
        
            callback(returnState)
    })
    
}


function getTweets (data, callback){
	if (data.fetchedCount == 0)
		var uri = "http://www.twitter.com/" + data.userName;
	
	else 
		var uri = "http://twitter.com/i/profiles/show/"+data.userName+"/timeline/tweets?max_position=" + data.max;

    console.log("Fetching: "+uri);

    request(uri, function (error, response, html) {

        if (error)
            console.log(error)
        console.log("Html Fetched for " + data.userName)
   	    var jsonResponse;
   	    // console.log(html)
        // if (!error)
        //     jsonResponse = JSON.parse(html);

        //     data.min = jsonResponse.min_position;
        //     html = jsonResponse.items_html;

            data = parse(html,data);

            if (data.stream.length <  data.fetchCount)
            {
                console.log("getTweets recursion for " + data.userName)
                getTweets(data,callback)
            }

            else if ( data.stream.length >  data.fetchCount  || data.stream.length ==  data.fetchCount)
            {
                console.log("getTweets callback for " + data.userName)
                callback(data)
            }
            else
                console.log("dont know what to do")
    });
    
}


module.exports.getTimeLine = getTimeLine;