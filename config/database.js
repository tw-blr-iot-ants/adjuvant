var mongoose = require('mongoose');

var db = mongoose.connection;
mongoose.connect('mongodb://localhost/test');

db.on('error', console.error);
db.once('open', function() {
  // Create your schemas and models here.
});

var movieSchema = new mongoose.Schema({
  name: { type: String }
, employeeID: String
, option: String
});

var Movie = mongoose.model('Movie', movieSchema);

var thor = new Movie({
  name: 'Dixith2'
, employeeID: '16305'
, option: 'juic'
});

thor.save(function(err, thor) {
  if (err) return console.error(err);
  console.dir(thor);
});