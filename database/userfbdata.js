var mongoose = require('mongoose');
var Schema = mongoose.Schema; 
module.exports = mongoose.model('userfbdata',{
    user_id: String,
    token: String,
    email: String,
	jobs : [{ type: Schema.Types.ObjectId, ref: 'jobdata' }]
});

