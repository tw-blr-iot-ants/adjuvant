var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var beverageSchema = new Schema({
  name: String,
  cost: Number,
  available: Boolean
});

module.exports = mongoose.model('Beverage', beverageSchema);
