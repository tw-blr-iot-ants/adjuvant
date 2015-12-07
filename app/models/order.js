var mongoose = require("mongoose");

var orderSchema = new mongoose.Schema({
  date: { type: Date },
  employeeId: String,
  employeeName: String,
  drinkName: String,
  quantity: { type: Number },
  isSwipe: Boolean,
  region: String
});

module.exports = mongoose.model('Order', orderSchema);

