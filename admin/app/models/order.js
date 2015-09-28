var mongoose = require("mongoose");

var orderSchema = new mongoose.Schema({
  date: { type: Date },
  employeeId: String,
  drinkName: String,
  quantity: { type: Number },
  expiresAt: { type: Date }
});

orderSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 })

module.exports = mongoose.model('Order', orderSchema);
