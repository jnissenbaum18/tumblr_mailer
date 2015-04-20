var fs = require('fs');
var ejs = require('ejs');
var tumblr = require('tumblr.js');
var csvFile = fs.readFileSync("friend_list.csv", "utf8");
var emailTemplate = fs.readFileSync('email_template.html', 'utf8')
var client = tumblr.createClient({
  consumer_key: '',
  consumer_secret: '',
  token: '',
  token_secret: '' 
});
var mandrill = require('mandrill-api/mandrill');
var mandrill_client = new mandrill.Mandrill('');
var previousPosts = []

// var csv_data = []

function csvParse(csvFile){
    var arrayOfObjects = [];
    var arr = csvFile.split("\n");
    var newObj;

    keys = arr.shift().split(",");

    arr.forEach(function(contact){
        contact = contact.split(",");
        newObj = {};

        for(var i =0; i < contact.length; i++){
            newObj[keys[i]] = contact[i];
        }

        arrayOfObjects.push(newObj);

    })

    return arrayOfObjects;
}

var today = new Date();
var day = {
    day: today.getDate(),
    month: today.getMonth()+1,
    year: today.getFullYear()
}

function sendEmail(to_name, to_email, from_name, from_email, subject, message_html){
    var message = {
        "html": message_html,
        "subject": subject,
        "from_email": from_email,
        "from_name": from_name,
        "to": [{
                "email": to_email,
                "name": to_name
            }],
        "important": false,
        "track_opens": true,    
        "auto_html": false,
        "preserve_recipients": true,
        "merge": false,
        "tags": [
            "Fullstack_Tumblrmailer_Workshop"
        ]    
    };
    var async = false;
    var ip_pool = "Main Pool";
    mandrill_client.messages.send({"message": message, "async": async, "ip_pool": ip_pool}, function(result) {
        // console.log(message);
        // console.log(result);   
    }, function(e) {
        // Mandrill returns the error as an object with name and message keys
        console.log('A mandrill error occurred: ' + e.name + ' - ' + e.message);
        // A mandrill error occurred: Unknown_Subaccount - No subaccount exists with the id 'customer-123'
    });
 }

friendList = csvParse(csvFile)

friendList.forEach(function(row) {

	var firstName = row["firstName"];
	var numMonthsSinceContact = row['numMonthsSinceContact'];
    var emailAddress = row['emailAddress'];
	// var templateCopy = emailTemplate;
	// templateCopy = templateCopy.replace(/FIRST_NAME/gi, firstName).replace(/NUM_MONTHS_SINCE_CONTACT/gi, numMonthsSinceContact);
	// // // console.log(templateCopy)

    var latestPosts = []
    client.posts('jn-18.tumblr.com', function (err, blog) {
        for (var i=0; i<blog.posts.length; i++) {
            var blogDate = {
                day: Number(blog.posts[i].date.slice(8, 10)),
                month: Number(blog.posts[i].date.slice(5, 7)),
                year: Number(blog.posts[i].date.slice(0, 4))
            }
            if (blogDate['year']===day['year'] && blogDate['month']===day['month']) {
                if (day['day'] - blogDate['day'] < 8) {
                    latestPosts.push(blog.posts[i])
                    // // console.log(blog.posts[i])
                    // console.log(latestPosts)
                }
                else {
                }
            }
        }
        var customizedTemplate = ejs.render(emailTemplate, 
            {firstName: firstName,
            numMonthsSinceContact: numMonthsSinceContact,
            latestPosts: latestPosts
            }
        );
        sendEmail(firstName, emailAddress, 'James', 'jnissenbaum@verizon.net', 'tumblr', customizedTemplate)
    })
})

// Scott,D'Alessandro,0,scott@fullstackacademy.com

// client.userInfo(function (err, data) {
//     // ...
// });

// client.posts('jn-18.tumblr.com', function (err, blog) {
//     console.log(blog);
// })



// csvParse = function (file) {
// 	var myArray = file.split('\n')
// 	for (var i=1; i<myArray.length; i++) {
// 		var myObject = {}
// 		myObject.firstName = myArray[i].split(',')[0]
// 		myObject.lastName = myArray[i].split(',')[1]
// 		myObject.numMonthsSinceContact = myArray[i].split(',')[2]
// 		myObject.emailAddress = myArray[i].split(',')[3]
// 		csv_data.push(myObject)
// 	}
// 	// return csv_data
// }

// csvParse(csvFile)
// console.log(csv_data[0]['emailAddress'])

// Authenticate via OAuth


// Make the request



