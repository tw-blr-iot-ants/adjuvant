  angular.module('orderController', [])
      .controller('orderController', ['$scope', '$http', '$interval', 'mongooseService',  'socket', 'Flash',
            function($scope, $http, $interval, mongooseService, socket, Flash) {

          $scope.employeeId = "";
          $scope.name = "";
          $scope.idCard = "";
          $scope.successMessage = false;
          $scope.placedOrder = false;
          var users = {};
          var dayInMilliseconds = 86400000;
          $scope.idCardDetails = "";

          mongooseService.getJuices()
                               .then(function(response) {
                                    $scope.juices = [];
                                    _.each(response.data, function(menu){
                                        $scope.juices.push(menu["Juice"])
                                    })
                               })


          $http({method: 'GET', url: 'data/users.json'}).
                        success(function(data) {
                            users = data;
          });

          $scope.placeOrder = function() {
            if(_validateOrder()) {
              $scope.placedOrder = true;
              $scope.missingFields = false;
              mongooseService.addJuice(_constructOrder())
                                .then(_notifySuccess);
            } else {
              _notifyError();
            }
          };

          socket.on('data', function(data) {
                console.log("data", data);
                $scope.idCardDetails = data.msg.trim();
                var user = users[$scope.idCardDetails];
                $scope.name  = user && user.Name;
                $scope.employeeId = user && user.EmployeeId;
                $scope.idCardDetails = "";
                $scope.cardSwiped = true;
          });


          var _constructOrder = function() {
             var date = _getTodayDate();
             return {
                  'Name' : $scope.name,
                  'EmployeeId': $scope.employeeId,
                  'Order': $scope.selected,
                  'Date': date
             }
          }

          var _notifySuccess = function(response) {
             var message = '<strong>Thank you!</strong> We successfully placed your Order';
             Flash.create('success', message, 'col-sm-4 col-sm-offset-4');
             $scope.successMessage = true;
             $scope.placedOrder = false;
             resetDefaults();
          }

          var _notifyError = function(response) {
             $scope.successMessage = false;
             var message = '<strong>Error!</strong> Mandatory fields are missing';
             Flash.create('danger', message, 'col-sm-4 col-sm-offset-4');
             $scope.missingFields = true;

          }

          var resetDefaults = function() {
             $scope.name  = "";
             $scope.employeeId = "";
             $scope.selected = "";
          }

          var _validateOrder = function() {
            return  $scope.selected  && $scope.name && $scope.employeeId ;
          }

          var _getTodayDate = function() {
             var today = new Date();
             return today.getDate() + '/' + today.getMonth() + '/' + today.getFullYear();
          }

  }]);
