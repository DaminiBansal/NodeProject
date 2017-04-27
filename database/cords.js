var mongoose = require('mongoose');
var Schema       = mongoose.Schema;
 
 var cordsSchema = new mongoose.Schema({
    name: { type : String },
    loc:  {type:[Number],index: '2d'}
	       
});
 cordsSchema.index({ loc: '2dsphere' });
 
 cordsSchema.methods.toJSON =function(){
  var obj = this.toObject();
  delete obj.__v;
  delete obj._id;
  return obj;
   
}

module.exports=mongoose.model('cordsdata', cordsSchema);
 
