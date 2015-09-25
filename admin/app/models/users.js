var mongoose = require("mongoose");

var userSchema = new mongoose.Schema({
  EmpId: String,
  SNo: String,
  ExternalNumber: String,
  InternalNumber: String,
  EmployeeName: String
});

module.exports = mongoose.model('Users', userSchema);
