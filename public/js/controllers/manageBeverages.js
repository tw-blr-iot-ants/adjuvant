angular.module('juiceController', [])
    .controller('juiceController', ['$scope', 'mongooseService',
        function ($scope, mongooseService) {

            $scope.loading = true;
            mongooseService.getBeverages()
                .then(function (response) {
                    $scope.beverages = response.data;
                    $scope.loading = false;
                });

            $scope.updateBeverage = function () {
                var beverage = {};
                beverage.name = ($scope.name);
                beverage.cost = parseFloat($scope.cost);
                beverage.available = true;
                beverage.isFruit = $scope.type == "fruit" || false;
                beverage.type = $scope.type;
                mongooseService.updateBeverage(beverage)
                    .then(_successCallback, _errorCallBack)
            };

            $scope.updateAvailability = function (beverage) {
                beverage.available = !beverage.available;
                mongooseService.updateBeverage(beverage)
                    .then(function (response) {
                        $scope.juices = response.data;
                        $scope.loading = false;
                    }, _errorCallBack)
            };

            $scope.deleteBeverage = function (beverage) {
                mongooseService.deleteBeverage(beverage).then(_successCallback, _errorCallBack);
            };

            var _errorCallBack = function (errorMessage) {
                console.log(errorMessage)
            };

            var _successCallback = function (response) {
                $scope.beverages = response.data;
                $scope.loading = false;
                $scope.name = "";
                $scope.cost = "";
                $scope.isFruit = false;
            }
        }]);