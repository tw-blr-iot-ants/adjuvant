var mongoose = require("mongoose");

var NewUserSchema = new mongoose.Schema({
  empId: { type: String, required: true },
  internalNumber: { type: String, required: true },
  employeeName: String,
  date: { type: Date }
});

module.exports = mongoose.model('NewUser', NewUserSchema);
