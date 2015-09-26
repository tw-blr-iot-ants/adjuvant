var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var beverageSchema = new Schema({
  Name: String,
  Cost: Number,
  Available: Boolean
});

module.exports = mongoose.model('Beverage', beverageSchema);
