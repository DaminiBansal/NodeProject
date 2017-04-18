module.exports = function(err,req,res,next) {
  console.log(err.status);
  if(err.status == 404){
  console.log('errr');
   res.send({"Error" : "File not found custom"});
      /*  res.render('error', {
            message: err.message, 
            error: err
        }); */
    }
  else 
     // res.status(500).send({"Error" : err.stack});
	   res.send({"Error" : err.stack});
};
