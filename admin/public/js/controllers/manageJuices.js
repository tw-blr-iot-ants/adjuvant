angular.module('juiceController', [])
                .controller('juiceController', ['$scope', 'mongooseService',
                function($scope, mongooseService) {

    $scope.loading = true;
    mongooseService.getJuices()
                          .then(function(response) {
                            $scope.beverages = response.data;
                            $scope.loading = false;
                          })

    $scope.updateBeverage = function() {
        var beverage = {};
        beverage.Name = ($scope.Name);
        beverage.Cost = parseInt($scope.Cost);
        beverage.Available = true;
        mongooseService.updateBeverage(beverage)
                           .then(function(response) {
                                 $scope.beverages = response.data;
                                 $scope.loading = false;
                                 $scope.juiceName = "";
                                 $scope.juicePrice = "";
                           }, _errorCallBack)
    }

    $scope.updateAvailability = function(beverage) {
        beverage.Available = !beverage.Available;
        mongooseService.updateBeverage(beverage)
                            .then(function(response) {
                                      $scope.juices = response.data;
                                      $scope.loading = false;
                            }, _errorCallBack)
    }

    var _errorCallBack = function(errorMessage) {
        console.log(errorMessage)
    }
}])