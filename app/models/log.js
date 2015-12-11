var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var logSchema = new Schema({
  error: String,
  date: { type: Date }
});

module.exports = mongoose.model('Log', logSchema);
