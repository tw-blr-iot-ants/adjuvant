var mongoose = require("mongoose");

var userSchema = new mongoose.Schema({
  EmpId: String,
  SerialNumber: String,
  ExternalNumber: String,
  InternalNumber: String,
  EmployeeName: String
});

module.exports = mongoose.model('Users', userSchema);
