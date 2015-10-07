angular.module('adjuvant').directive('updateUser', ['mongooseService', '$timeout',
                     function(mongooseService, $timeout) {

    return {
        restrict: 'AE',
        replace: 'true',
        templateUrl: "/partials/updateUser.html",
        scope: {},
        link: function(scope) {

            scope.updateUser = function() {
                 var user = _constructUser();
                 mongooseService.updateUser(user)
                                     .then(_notifySuccess, _notifyError)
            }

            var _notifySuccess = function(response) {
                   scope.showSuccessAlert = true;
                   $timeout(function() {
                        _resetDefaults();
                   }, 1000)
            }

            var _notifyError = function(response) {
                  scope.showErrorAlert = true;
                  $timeout(function() {
                    scope.showErrorAlert = false;
                  }, 1000)
            }

             var _constructUser = function() {
                  return {empId: scope.employeeId,
                          employeeName:  scope.employeeName,
                          internalNumber:  scope.internalNumber};
             }

             var _resetDefaults = function() {
                  scope.employeeId = "";
                  scope.employeeName = "";
                  scope.internalNumber = "";
                  scope.showSuccessAlert = false;
                  scope.showErrorAlert = false;
             }

             _resetDefaults();
        }
    }
}]);



