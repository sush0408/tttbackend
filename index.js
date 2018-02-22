//imports of libraries
var express = require('express')
const bodyParser = require('body-parser');//Parse incoming request bodies in a middleware before handlers
const Freq = require('wordfrequenter') //wordfrequenter counts frequency of word in text
var fs = require('fs'); 
var request = require('request'); //to Make http Calls
var theText="";
var app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}) );
//Cors part
app.all("/*", function(req, res, next){
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');
  next();
});

//app runs on port 5000 
app.set('port', (process.env.PORT || 5000))
app.use(express.static(__dirname + '/public'))

//handles get requests to the server
app.get('/', function(request, response) {
  response.send('Hello World!')
})

//below part handles post request to server
app.post('/num', function (req, res) {
	//console.log("I am Getting Tiggered");
	console.log(req.body);
	//request fetches the document from web and data is stored in body
	request('http://terriblytinytales.com/test.txt', function (error, response, body) {
	  theText=body.toString();
	  if(theText!=""){
	  		const testWords = theText;
	  		const wf = new Freq(testWords.split(' '))
	  		wf.set('string')
	  		var sorted=wf.list().reverse(); // as wordfrequenter gives array of word from low to high frequency
	  		sorted.sort(function (a, b) {
	  		  return b.count - a.count;
	  		});
	  	 	res.send(sorted.slice(0,req.body.val))	
	  }
	});	
})

app.listen(app.get('port'), function() {
  console.log("Node app is running at localhost:" + app.get('port'))
})