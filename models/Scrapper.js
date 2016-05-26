var fs = require('fs');
var cheerio = require('cheerio');
var request = require('request');

function parse(html,name,callback) {


    var count = 0;
    var numTweets = 0;
    var data = {
        stream:[],
        min:null,
        max:null
    };

    var $ = cheerio.load(html);

    var elements = $("li.js-stream-item");


    // callback(elements)
    console.log("Fetched "+elements.length+" tweets for "+ name);

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
                }
                else{
                    if(typeof callback === "function")
                        callback(data);
                }
            });
    });
};

function getTweets(html,name,callback){
    
}


// module.exports.getMore = getMore;
module.exports.parse = parse;