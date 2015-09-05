var mongoose = require('mongoose');

module.exports = mongoose.model('JC', {
	text : {type : String, default: ''}
});