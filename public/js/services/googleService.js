angular.module('googleService', [])
	.factory('googleService', ['$http',function($http) {
		return {
			getStats : function() {
			  return $http.get('/api/getOrders');

			},
			create : function(request) {
				return $http.post('/api/postOrder', request);
			},
			deleteContents : function() {
				return $http.post('/api/cleanSheet');
			}
		}
}]);