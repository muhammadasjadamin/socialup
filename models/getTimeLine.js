var twit =  require ('twit');

var obj = new twit({
	consumer_key:         'TAjIJswVt6T2WQaWqUNuPyaDv',
  	consumer_secret:      '1UGLQ25bW7Rzb3xfQX6VnuKbnORJMow6AQFDT2U8HlhjKkGn2I',
  	access_token:         '3590486067-sRoD1kAhNXz2C1OE6U7H39mYwZHWYyKJ9Lz84RM',
  	access_token_secret:  'eIpoYQ538dWjABHLBnMRtEip0kt1El0MokfG4oqT7f1YC'
});


function getTimeLine(screenName,callback){

	var param = {
		screen_name: screenName,
		include_rts: true
	}

	obj.get('statuses/user_timeline', param,  function (err, data, response) {
		callback(data)
	})

}


module.exports.getUserTimeLine = getTimeLine;