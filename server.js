var express         = require('express'),
    app             = express(),
    passport        = require('passport'),
    session         = require('express-session'),
	bodyParser = require('body-parser'),
	mongoose = require('mongoose');  
	var jstz = require('jstimezonedetect');

//log4js framework	
//var logger= require('./logger.js');
//var log=logger.LOG;

var errmiddleware= require('./errormiddleware.js');
var LocalStrategy    = require('passport-local').Strategy;
var FacebookStrategy = require('passport-facebook').Strategy;

// load up the user model
var userfbdata   = require('./database/userfbdata');
var jobdata   = require('./database/jobdata');

// load the auth variables
var configAuth = require('./config/fbAuth');


/* var log4js = require('log4js');
log4js.configure({ // configure to use all types in different files.
    appenders: [
        {   type: 'file',
            filename: "error.log", // specify the path where u want logs folder error.log
            category: 'error',
            maxLogSize: 20480,
            backups: 10
        },
        {   type: "file",
            filename: "info.log", // specify the path where u want logs folder info.log
            category: 'info',
            maxLogSize: 20480,
            backups: 10
        },
        {   type: 'file',
            filename: "debug.log", // specify the path where u want logs folder debug.log
            category: 'debug',
            maxLogSize: 20480,
            backups: 10
        }
    ]
});
var loggerinfo = log4js.getLogger('info'); // initialize the var to use.
var loggererror = log4js.getLogger('error'); // initialize the var to use.
var loggerdebug = log4js.getLogger('debug'); // initialize the var to use.

loggerinfo.info('This is Information Logger');
loggererror.info('This is Error Logger');
loggerdebug.info('This is Debugger');

var logger  = log4js.getLogger('jobEmpl');
            logger.setLevel('DEBUG');
            Object.defineProperty(exports, "LOG", {
                        value:logger,
            });
 */
var log4js = require("log4js");
log4js.configure({
  appenders: [
	            {
	            	type: "console"
	            }, 
	            {
	            	type: "file",
	            	filename: "test.log",
	            	category: "jobEmpl"
	            }, 
				/* {   type: 'file',
                    filename: "error.log", // specify the path where u want logs folder error.log
                    category: "error",
                    //maxLogSize: 20480,
                   // backups: 10
                },
                {   type: "file",
                    filename: "info.log", // specify the path where u want logs folder info.log
                    category: 'info',
                    //maxLogSize: 20480,
                   // backups: 10
                },
                {   type: 'file',
                    filename: "debug.log", // specify the path where u want logs folder debug.log
                    category: 'debug',
                   // maxLogSize: 20480,
                   // backups: 10
                } */
	]
});

//log4js.loadAppender('file');

var logger = log4js.getLogger("jobEmpl");
//var loggerinfo = log4js.getLogger('info'); // initialize the var to use.
//var loggererror = log4js.getLogger('error'); // initialize the var to use.
//var loggerdebug = log4js.getLogger('debug');

logger.setLevel("ALL");
//loggerinfo.setLevel("INFO");
//loggererror.setLevel("ERROR");
//loggerdebug.setLevel("DEBUG");

logger.debug("log test!!!!");
//loggerinfo.info('This is Information Logger');
//loggererror.error('This is Error Logger');
//loggerdebug.debug('This is Debugger');

//var logggg = {logger};

//logggg.push(jobd._id);

app.use(bodyParser.urlencoded({ extended: true}));
app.use(bodyParser.json());

var url = "mongodb://damini:damini5@ds121190.mlab.com:21190/practicenode"
mongoose.connect(url, function(err, database) {
  
    if (err) {
    console.log(err);
    }
	//, format:':method :url'
    app.use(log4js.connectLogger(logger, { level:  'auto' }));
	//app.use(log4js.connectLogger(logger, { level: log4js.levels.DEBUG }));
	//app.use(log4js.connectLogger(loggerinfo, { level: log4js.levels.INFO }));
	//app.use(log4js.connectLogger(loggererror, { level: log4js.levels.ERROR }));
	//app.use(log4js.connectLogger(loggerdebug, { level: log4js.levels.DEBUG }));
	
	app.use(function(err,req,res,next){
	req.timezone = jstz.determine().name();
//	req.timezone = jstz.name().determine().name();
	if(err){
	logger.error(err);
	return next(err);
	}
	//console.log(req.timezone+"");	
	next();
	});
	
  // =========================================================================
    // FACEBOOK ================================================================
    // =========================================================================
    passport.use('facebook',new FacebookStrategy({

        // pull in our app id and secret from our auth.js file
        clientID        : configAuth.facebookAuth.clientID,
        clientSecret    : configAuth.facebookAuth.clientSecret,
        callbackURL     : configAuth.facebookAuth.callbackURL,
		profileFields: ['id', 'displayName', 'photos', 'email'],
        enableProof: true
    },

    // facebook will send back the token and profile
    function(token, refreshToken, profile, done) {
      console.log("Auth done"+profile.id);
	 
   
	 // asynchronous
        process.nextTick(function() {
       
            // find the user in the database based on their facebook id
			userfbdata.findOne({ user_id : profile.id }).exec(function(err, user) {
		    
                // if there is an error, stop everything and return that
                // ie an error connecting to the database
                if (err)
                    return done(err,null);

	       
                // if the user is found, then log them in
                if (user) {
				   return done(null, profile); // user found, return that user
                } else {
			     // if there is no user found with that facebook id, create them
				  console.log("else");
                    var newUser            = new userfbdata();

                    // set all of the facebook information in our user model
                    newUser.user_id    = profile.id; // set the users facebook id                   
                    newUser.token = token; // we will save the token that facebook provides to the user                    
                    newUser.email = profile.emails[0].value; // facebook can return multiple emails so we'll take the first
					//newUser.jobs = jobdata;
                   // console.log("else"+token+newUser.email);
					
                    // save our user to the database
                    newUser.save(function(err) {
                        if (err)
                            return done(err);

                        // if successful, return the new user
						//console.log("else"+profile);
					    return done(null, profile);
                    });
                }

            });
        });

    }));
	
	  // used to serialize the user for the session
    passport.serializeUser(function(user, done) {
        done(null, user);
    });

    // used to deserialize the user
    passport.deserializeUser(function(obj, done) {
       /*  userfb.findById(_id, function(err, user) {
            done(err, user);
        }); */
		done(null, obj);
    });
	
	app.use(session({
    secret: "tHiSiSasEcRetStr",
    resave: true,
    saveUninitialized: true
    //passReqToCallback: true,
    //session: false	
	}));
	
	app.use(passport.initialize());
	app.use(passport.session());
	
	
	
	 app.get('/', function(req, res) {
        res.send('Logged in first'); // load the index.ejs file
    });
	
   /*  // route for showing the user jobs data
    app.get('/userjob', isLoggedIn, function(req, res,next) {
		var user = req.user;
		var userid = user.id;
		console.log(userid);
	    jobdata.find({
			user_id: userid
		},
		 function(err, jobdata) {
			if (err)
				return next(err);
				console.log(res);
			res.json(jobdata);
		});
	}); */

	//user jobss
	  //var user = req.user;
		//var userid = user.id;
	  app.get('/userearning', function(req, res,next) {
	  userfbdata.find().populate('jobs','amount',{'status':'occupied'}).exec(function(err, c) {
      if (err) { return console.log(err); }
	  var arr = c[0].jobs;
	  var sum = 0;
	  //arr.aggregate([{$group : { total : {$sum : "$amount"}}}]) ;
	  arr.forEach(function(current_value) {
	  sum += parseInt(current_value.amount);
            console.log(current_value);
        });
      res.json(sum);
    
});
});
	
	
	 app.get('/userjob', function(req, res,next) {
	    //var user = req.user;
		//var userid = user.id;
	   /* if (!sessionStorage.getItem('timezone')) {
      var tz = jstz.determine() || 'UTC';
      sessionStorage.setItem('timezone', tz.name());
       }
     var currTz = sessionStorage.getItem('timezone'); */
	    //var sid = req.sessionID;
		throw new Error("no data");
		console.log(req.timezone+"");
		userfbdata.findOne({user_id: '753820661459403'}).populate('jobs').exec(function(err, c) {
        if (err) { return console.log(err); }
        res.json(c);
		});
	});
	
	/* // route for showing the user jobs data
    app.get('/userearning', isLoggedIn, function(req, res,next) {
		var user = req.user;
		var userid = user.id;
		var sum=0;
	    jobdata.find({ $and:[{
			user_id: userid
		},{
		    status : 'completed'
		}
		]},
		 function(err, jobdata) {
			if (err)
				return next(err);
				for(var i=0;i<jobdata.length;i++){
				 sum += parseInt(jobdata[i].amount);
				 }
				console.log(sum+"");
				
			res.json({"userearning":sum});
		});
	}); */
    // =====================================
    // FACEBOOK ROUTES =====================
    // =====================================
    // route for facebook authentication and login
    app.get('/auth/facebook', passport.authenticate('facebook',  {scope : 'email' }));
	
    // handle the callback after facebook has authenticated the user
    app.get('/auth/facebook/callback',
        passport.authenticate('facebook', {
            successRedirect : '/checkdata',
            failureRedirect : '/'
        }));

    // route for logging out
    app.get('/logout', function(req, res) {
        req.logout();
        res.redirect('/');
    });


app.get("/checkdata", isLoggedIn, function (req, res) {
    res.send("user data.");
});

  
  //http://localhost:8080
	/* app.post('/job',function(req, res,next) {
	  
		var jobd = new jobdata(req.body);		

		jobd.save(function(err,r) {
			if (err)
				return next(err);
			res.json("Jobs was saved successfully");
		});
	
  }); */
  
  //save jobs
  app.put('/job',function(req, res,next) {
  
        //var user = req.user;
		//var userid = user.id;
		
	  userfbdata.findOne({user_id: '753820661459403'}).exec(function(err,user){
	  if (err)
               res.send(err);
			
		var jobd = new jobdata(req.body);		
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
  
  
  //get list of jobs
   app.get('/job',function(req, res,next) {
		
     jobdata.find({}).exec(function(err, jobd) {
	 if(err)return next(error);
     if (!jobd) return next(new Error('No jobs found.'))
			
			 res.json(jobd);
			
		});
	});
	
	/* //get list of unoccupied jobs
   app.get('/unjob',function(req, res,next) {
		var summ = 0;
	
       jobdata.find({ $and:[{
			user_id: null
		},{
		    status : 'unoccupied'
		}
		]},
	
	function(err, jobd) {
	 if(err)return next(error);
     if (!jobd) return next(new Error('No jobs found.'))
			 res.json(jobd);
			
		});
	}); */
/*  function sum( obj ) {
  var sum = 0;
  for( var el in obj ) {
      sum +=  parseInt(obj[el].amount) ;
  }
  return sum;
}; */

   // route middleware to make sure a user is logged in
   function isLoggedIn(req, res, next) {

    // if user is authenticated in the session, carry on
    if (req.isAuthenticated())
        return next();

    // if they aren't redirect them to the home page
    res.redirect('/');
};

  app.use(errmiddleware);
  
 var server = app.listen(process.env.PORT || 8080, function () {
    var port = server.address().port;
    console.log("App now running on port", port);
	});
});
