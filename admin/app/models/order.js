var mongoose = require("mongoose");

var orderSchema = new mongoose.Schema({
  Date: { type: Date },
  Name: { type: String },
  EmployeeId: String,
  DrinkName: String,
  Quantity: { type: Number }
});

module.exports = mongoose.model('Order', orderSchema);
