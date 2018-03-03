//imports of libraries
var express = require('express')
const bodyParser = require('body-parser');//Parse incoming request bodies in a middleware before handlers
//const Freq = require('wordfrequenter') //wordfrequenter counts frequency of word in text
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
	request('http://terriblytinytales.com/test.txt', function (error, response, body) {
	  theText=body.toString();
	  if(theText!=""){
	  	var arrayOfWords = theText.toLowerCase().split(/\s+/);
	  	var mapWord = {};
	  	arrayOfWords.forEach(function (key) {
	  	    if (mapWord.hasOwnProperty(key)) {
	  	      mapWord[key]++;
	  	    } else {
	  	      mapWord[key] = 1;
	  	    }
	  	  });
	  	var sortedArray = [];
	  	  sortedArray = Object.keys(mapWord).map(function(key) {
	  	    return {
	  	      word: key,
	  	      count: mapWord[key]
	  	    };
	  	  });

	  	  sortedArray.sort(function(a, b) {
	  	    return b.count - a.count;
	  	  });
			//OLD CODE
	  		// const testWords = theText;
	  		// const wf = new Freq(testWords.split(' '))
	  		// wf.set('string')
	  		// //console.dir(wf.get('cool'))
	  		// //console.dir(wf.list())
	  		// var sorted=wf.list().reverse();
	  		// sorted.sort(function (a, b) {
	  		//   return b.count - a.count;
	  		// });
	  		if(parseInt(req.body.val)<sortedArray.length)
	  	 		res.send(sortedArray.slice(0,req.body.val))	
	  	 	else
	  	 		res.send(sortedArray)	
	  }
	});	
})

app.listen(app.get('port'), function() {
  console.log("Node app is running at localhost:" + app.get('port'))
})
