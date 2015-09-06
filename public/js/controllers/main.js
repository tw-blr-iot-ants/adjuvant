  angular.module('orderController', ["chart.js"])
      .controller('orderController', ['$scope', '$http', '$interval' , 'googleService',
                                       'mongooseService', 'statsService', 'Flash', 'socket',
            function($scope, $http, $interval, googleService,
                        mongooseService, statsService, Flash, socket) {

          $scope.employeeId = "";
          $scope.name = "";
          $scope.idCard = "";
          $scope.successMessage = false;
          $scope.placedOrder = false;
          var users = {};
          var idCardArray = [];
          var dayInMilliseconds = 86400000;

          $http({method: 'GET', url: 'data/order.json'}).
              success(function(data) {
                  $scope.colours = data.juices;
          });

          $http({method: 'GET', url: 'data/users.json'}).
                        success(function(data) {
                            users = data;
          });

          $scope.successMessage = false;
          $scope.placedOrder = false;
          $scope.users = {};
          var dayInMilliseconds = 86400000;


          $interval(function() {
                googleService.getStats()
                             .then(_updateMongo)
                             .then(_cleanSpreadSheet)
           }, dayInMilliseconds);

          $scope.placeOrder = function() {
              $scope.placedOrder = true;
              googleService.create(_constructOrder())
                      .then(_notifySuccess);
          };


          socket.on('data', function(data) {
                idCardArray.push(data.msg);
                $scope.idCard = idCardArray.join("")
                if($scope.idCard.length == 36) {
                    $scope.IdDetailsReady = !$scope.IdDetailsReady;
                }

            });

          $interval(function() {
                idCardArray =[];
          }, 100);

          $scope.$watch('IdDetailsReady', function() {
              var idCardDetails = $scope.idCard.replace(/(\r\n|\n|\r)/gm,"");
              var user = users[idCardDetails];
              $scope.name  = user && user.Name;
              $scope.employeeId = user && user.EmployeeId;
              $scope.idCard = "";
              idCardArray =[];
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
             $scope.name  = "";
             $scope.employeeId = "";
          }

          var _getTodayDate = function() {
             var today = new Date();
             return today.getDate() + '/' + today.getMonth() + '/' + today.getFullYear();
          }

          var _updateMongoAndCleanSpreadSheet = function(response) {
                  mongooseService
                          .update(statsService.getDetails(response.data).shift())
          }

          var _cleanSpreadSheet = function() {
            googleService.deleteContents();
          }
  }]);