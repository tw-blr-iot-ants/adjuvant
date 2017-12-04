module.exports = {
	url : process.env.MONGODB_URL ||  'mongodb://localhost:27017/adjuvant',
	testUrl : process.env.MONGODB_TEST_URL || 'mongodb://localhost/testAdjuvant'
};
