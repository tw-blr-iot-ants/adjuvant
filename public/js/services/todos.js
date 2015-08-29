angular.module('todoService', [])
	.factory('Todos', ['$http',function($http) {
		return {
			get : function() {
				return $http.get('/api/todos');
			},
			create : function(todoData) {
			console.log(todoData, "todoData")
				return $http.post('/api/todos', todoData);
			}
		}
	}]);