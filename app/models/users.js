var mongoose = require("mongoose");

var userSchema = new mongoose.Schema({
  empId: String,
  serialNumber: String,
  externalNumber: String,
  internalNumber: String,
  employeeName: String
});

module.exports = mongoose.model('Users', userSchema);
