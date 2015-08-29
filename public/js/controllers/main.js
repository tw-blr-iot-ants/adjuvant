angular.module('todoController', [])

	.controller('mainController', ['$scope','$http','Todos',  function($scope, $http, Todos) {

	$http({method: 'GET', url: '/data.json'}).
        success(function(data) {
            console.log("scope.contents", data)
            $scope.colours = data.juices;
        }).error(function(data, status, headers, config) {
    });

//        	$scope.selected = "none";
        	$scope.employeeId = "16305";
        	$scope.name = "dixith";

			$scope.placeOrder = function() {

				var order = {
					'name' : $scope.name,
					'employeeId': $scope.employeeId,
					'order': $scope.selected
				}

				Todos.create(order)
					.success(function(data) {
						console.log("success")
					});
		};

	}]);