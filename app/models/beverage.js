var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var beverageSchema = new Schema({
    name: String,
    cost: Number,
    available: Boolean,
    relevancy: Number,
    type: String,
    lastUpdated: {type: Date},
    isFruit: Boolean
});

module.exports = mongoose.model('Beverage', beverageSchema);
