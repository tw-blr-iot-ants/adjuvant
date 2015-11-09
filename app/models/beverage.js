var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var beverageSchema = new Schema({
  name: String,
  cost: Number,
  available: Boolean,
  relevancy: Number,
  lastUpdated: { type: Date }
});

module.exports = mongoose.model('Beverage', beverageSchema);
