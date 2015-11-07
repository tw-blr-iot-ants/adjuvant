var mongoose = require("mongoose");

var userSchema = new mongoose.Schema({
  empId: String,
  internalNumber: String,
  employeeName: String
});

module.exports = mongoose.model('Users', userSchema);
