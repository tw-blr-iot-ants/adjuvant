angular.module('juiceController', ['ngMaterial'])
    .controller('juiceController', ['$scope', 'mongooseService','$mdToast',
        function ($scope, mongooseService, $mdToast) {

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
                $scope.showToast = function () {
                    $mdToast.show(
                        $mdToast.simple()
                            .textContent(errorMessage.data)
                            .hideDelay(3000)
                    );
                }();
            };

            var _successCallback = function (response) {
                $scope.beverages = response.data;
                $scope.loading = false;
                $scope.name = "";
                $scope.cost = "";
                $scope.isFruit = false;
            }
        }]);