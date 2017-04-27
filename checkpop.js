var express         = require('express'),
    app             = express(),
    passport        = require('passport'),
    session         = require('express-session'),
	bodyParser = require('body-parser'),
	mongoose = require('mongoose');  

var errmiddleware= require('./errormiddleware.js');
// load up the user model
var userdemo   = require('./database/userdemo');
var jobdemo   = require('./database/jobdemo');

app.use(bodyParser.urlencoded({ extended: true}));
app.use(bodyParser.json());

var url = "mongodb://damini:damini5@ds121190.mlab.com:21190/practicenode"
mongoose.connect(url, function(err, database) {
  
    if (err) {
    console.log(err);
    }


	app.post('/userjobb',function(req, res,next) {
	  
		var userd = new userdemo(req.body);		

		userd.save(function(err,r) {
			if (err)
				return next(err);
			res.json("user was saved successfully");
		});
	
  });
  
	app.get('/userjobb', function(req, res,next) {
	  userdemo.find().populate('jobs').exec(function(err, c) {
      if (err) { return console.log(err); }
      res.json(c);
    console.log(c.jobs);
});
});

app.put('/jobdemo',function(req, res,next) {
	  userdemo.findOne({user_id: 'user1'}).exec(function(err,user){
	  if (err)
               res.send(err);
			
		var jobd = new jobdemo(req.body);		
  		 //user.jobs= jobd._id;
		 user.jobs.push(jobd._id);
		user.save(function(err,r) {
			if (err)
				return next(err);
			jobd.save(function(err,r) {
			if (err)
				return next(err);
			res.json("job was saved successfully");
		});
		});
});
});
  
	app.get('/jobdemo', function(req, res,next) {
	  jobdemo.find({}).exec(function(err, c) {
      if (err) { return console.log(err); }
      res.json(c);
   
});
});

  app.use(errmiddleware);
  
 var server = app.listen(process.env.PORT || 3000, function () {
    var port = server.address().port;
    console.log("App now running on port", port);
	});
});
