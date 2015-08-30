angular.module('googleService', [])
	.factory('googleService', ['$http',function($http) {
		return {
			getStats : function() {
			  return $http.get('/api/getOrders');

			},
			create : function(todoData) {
				return $http.post('/api/postOrder', todoData);
			}
		}
}]);