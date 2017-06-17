module.exports = {
	url : process.env.MONGODB_URL ||  'mongodb://10.132.127.212:27017/adjuvant',
	testUrl : process.env.MONGODB_TEST_URL || 'mongodb://localhost/testAdjuvant'
}
