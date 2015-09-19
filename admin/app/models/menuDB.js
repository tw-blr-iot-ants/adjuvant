var mongoose = require("mongoose");

var menuSchema = new mongoose.Schema({
  Juice: String,
  Cost: String
});

module.exports = mongoose.model('Menu', menuSchema);
