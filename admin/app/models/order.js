var mongoose = require("mongoose");

var orderSchema = new mongoose.Schema({
  Date: { type: Date },
  EmployeeId: String,
  DrinkName: String,
  Quantity: { type: Number },
  expiresAt: { type: Date }
});

orderSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 })

module.exports = mongoose.model('Order', orderSchema);
