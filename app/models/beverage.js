var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var beverageSchema = new Schema({
  name: String,
  cost: Number,
  availability: [{region: String, value: Boolean}],
  relevancy: Number,
  lastUpdated: { type: Date },
  isFruit: Boolean
});

module.exports = mongoose.model('Beverage', beverageSchema);
