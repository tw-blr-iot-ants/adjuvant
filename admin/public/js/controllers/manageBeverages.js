angular.module('juiceController', [])
                .controller('juiceController', ['$scope', 'mongooseService',
                function($scope, mongooseService) {

    $scope.loading = true;
    mongooseService.getBeverages()
                          .then(function(response) {
                            $scope.beverages = response.data;
                            $scope.loading = false;
                          })

    $scope.updateBeverage = function() {
        var beverage = {};
        beverage.name = ($scope.name);
        beverage.cost = parseInt($scope.cost);
        beverage.available = true;
        mongooseService.updateBeverage(beverage)
                           .then(_successCallback, _errorCallBack)
    }

    $scope.updateAvailability = function(beverage) {
        beverage.available = !beverage.available;
        mongooseService.updateBeverage(beverage)
                            .then(function(response) {
                                      $scope.juices = response.data;
                                      $scope.loading = false;
                            }, _errorCallBack)
    }

    var _errorCallBack = function(errorMessage) {
        console.log(errorMessage)
    }

    var _successCallback = function(response) {
         $scope.beverages = response.data;
         $scope.loading = false;
         $scope.name = "";
         $scope.cost = "";
    }
}])