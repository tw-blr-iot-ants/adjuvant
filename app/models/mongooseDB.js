var mongoose = require("mongoose");

var registerSchema = new mongoose.Schema({
  Date: String,
  Name: { type: String },
  EmployeeId: String,
  Order: String
});

module.exports = mongoose.model('Register', registerSchema);

