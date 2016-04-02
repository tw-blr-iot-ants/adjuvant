require('./app/database.js');

console.log("********************************************");
console.log("Mongo url", process.env.MONGODB_URL);
console.log("********************************************");

console.log("********************************************");
console.log("Mongo url", process.env.MONGODB_TEST_URL);
console.log("********************************************");

console.log("********************************************");
console.log("Mongo url", process.env.MONGO_SESSION_URL);
console.log("********************************************");
console.log("******************");

var server = require('./app/server.js');
server.start();