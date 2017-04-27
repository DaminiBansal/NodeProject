var express         = require('express'),
    app             = express(),
    passport        = require('passport'),
    session         = require('express-session'),
	bodyParser = require('body-parser'),
	mongoose = require('mongoose');  

var errmiddleware= require('./errormiddleware.js');
// load up the user model
var cordsdata =  require('./database/cords');

app.use(bodyParser.urlencoded({ extended: true}));
app.use(bodyParser.json());

var url = "mongodb://damini:damini5@ds121190.mlab.com:21190/practicenode"
mongoose.connect(url, function(err, database) {
  
    if (err) {
    console.log(err);
    }


	app.post('/cords',function(req, res,next) {
	  
		var cordsdatad = new cordsdata(req.body);		

		cordsdatad.save(function(err,r) {
			if (err)
				return next(err);
			res.json("user was saved successfully");
		});
	
  });
  //30.717899,76.798947
	app.get('/cords', function(req, res,next) {
	var lat= req.query.lat;
	var lng= req.query.lng;
	var filter1 =  { 
	           loc :
                  { $geoWithin :
                                 { $center :
                                    [ [ lat,lng] , 10000 /3963.2 ]
                      } } 
			}
			
	   console.log(filter1);
	  cordsdata.find(filter1).exec(function(err, c) {
      if (err) { return console.log(err); }
      res.json(c);
   
});
});


  app.use(errmiddleware);
  
 var server = app.listen(process.env.PORT ||3000, function () {
    var port = server.address().port;
    console.log("App now running on port", port);
	});
});
