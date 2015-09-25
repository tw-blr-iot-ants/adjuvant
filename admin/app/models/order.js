var mongoose = require("mongoose");
var moment = require("moment");

var orderSchema = new mongoose.Schema({
  Date: { type: Date },
  Name: { type: String },
  EmployeeId: String,
  DrinkName: String,
  Quantity: { type: Number },
  expiresAt: { type: Date, default: moment(moment()+moment.duration(6, 'months'))}
});

orderSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 })

module.exports = mongoose.model('Order', orderSchema);
