//This is my test file

var tumblr = require('tumblr.js');
var client = tumblr.createClient({
  consumer_key: '',
  consumer_secret: '',
  token: '',
  token_secret: ''
});

// Make the request
client.userInfo(function (err, data) {
    // console.log(data.user.following);
});

var today = new Date();
var day = {
	day: today.getDate(),
	month: today.getMonth()+1,
	year: today.getFullYear()
}

client.posts('jn-18.tumblr.com', function (err, blog) {
	for (var i=0; i<blog.posts.length; i++) {
		var blogDate = {
			day: Number(blog.posts[i].date.slice(8, 10)),
			month: Number(blog.posts[i].date.slice(5, 7)),
			year: Number(blog.posts[i].date.slice(0, 4))
		}
		if (blogDate['year']===day['year'] && blogDate['month']===day['month']) {
			if (day['day'] - blogDate['day'] < 8) {
				console.log('yes')
				console.log(day['day'] - blogDate['day'])
			}
			else {
				console.log('no')
				console.log(day['day'] - blogDate['day'])
			}
		}
	}
})