  angular.module('orderController', ["chart.js"])
      .controller('orderController', ['$scope', '$http', 'googleService', 'Flash',
            function($scope, $http, googleService, Flash) {

          $http({method: 'GET', url: '/data.json'}).
              success(function(data) {
                  $scope.colours = data.juices;
          });

          $scope.employeeId = "16305";
          $scope.name = "dixith";
          $scope.successMessage = false;
          $scope.placedOrder = false;



          $scope.placeOrder = function() {
              $scope.placedOrder = true;
              var order = _constructOrder();
              googleService.create(order)
                      .success(_notifySuccess);
          };

          var _constructOrder = function() {
             return {
                  'name' : $scope.name,
                  'employeeId': $scope.employeeId,
                  'order': $scope.selected
             }
          }

          var _notifySuccess = function(data) {
             var message = '<strong>Thank you!</strong> We successfully placed your Order';
             Flash.create('success', message, 'col-sm-4 col-sm-offset-4');
             $scope.successMessage = true;
             $scope.placedOrder = false;
          }
  }]);