var mongoose = require('mongoose');
 
module.exports = mongoose.model('jobdata',{
    job_id: {type : String,unique: true},
   // user_id:{type:String, default : null},
    amount: String,
	status: String
});