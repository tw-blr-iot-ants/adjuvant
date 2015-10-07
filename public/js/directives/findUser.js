angular.module('adjuvant').directive('findUser', ['mongooseService', '$timeout',
                     function(mongooseService, $timeout) {

    return {
        restrict: 'AE',
        replace: 'true',
        templateUrl: "/partials/findUser.html",
        scope: {},
        link: function(scope) {

            scope.showSuccessAlert = false;
            scope.employeeId = "";

            scope.findUser = function() {
                      mongooseService.findUser({"empId": scope.employeeId})
                                          .then(function(response){
                                              scope.result = response.data;
                                          }, _notifyError)
            }

            var _notifyError = function(response) {
                  scope.showErrorAlert = true;
                  $timeout(function() {
                    scope.showErrorAlert = false;
                  }, 1000)
            }
        }
    }
}]);



