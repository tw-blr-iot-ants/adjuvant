var Log = require("../models/log");


module.exports.store = function(req, res) {
       console.log("req", req.body);
       req.body["date"] = new Date();
	   return Log.create(req.body , function(error) {
             				if(error) {
             				    res.send(error);
                                return;
             				}
             res.json({"logged": "success"});
       });
};