adjuvant.directive('deleteUser', ['mongooseService', '$timeout',
                     function(mongooseService, $timeout) {

    return {
        restrict: 'AE',
        replace: 'true',
        templateUrl: "partials/deleteUser.html",
        scope: {},
        link: function(scope) {

            scope.deleteUser = function() {
                  mongooseService.deleteUser({"empId": scope.employeeId})
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

            var _resetDefaults = function() {
                  scope.employeeId = "";
                  scope.showSuccessAlert = false;
                  scope.showErrorAlert = false;
            }

            _resetDefaults();

        }
    }
}]);



