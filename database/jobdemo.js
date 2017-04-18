var mongoose = require('mongoose');
 
module.exports = mongoose.model('jobdemo',{
    job_id: {type : String,unique: true},
    amount: String,
	status: String
});