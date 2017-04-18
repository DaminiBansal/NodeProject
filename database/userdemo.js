var mongoose = require('mongoose');
var Schema = mongoose.Schema; 
module.exports = mongoose.model('userdemo',{
    user_id: String,
	jobs : [{ type: Schema.Types.ObjectId, ref: 'jobdemo' }]
});

