adjuvant.directive('findUpdateDeleteUser', ['mongooseService', '$timeout',
                     function(mongooseService, $timeout) {

    return {
        restrict: 'AE',
        replace: 'true',
        templateUrl: "partials/findUpdateDeleteUser.html",
        scope: {},
        link: function(scope) {

            scope.employeeId = "";
            scope.employeeName = "";
            scope.result = "";
            scope.shouldDisplayResult = true;

            scope.findUser = function() {
                      mongooseService.findUser({"empId": scope.employeeId})
                                          .then(function(response){
                                              scope.result = response.data;
                                              scope.employeeName = response.data.employeeName;
                                          }, _notifyError)
            }

            var _notifyError = function(response) {
                  scope.shouldDisplayResult = false;
                  scope.showFindErrorAlert = true;
                  $timeout(function() {
                    _resetDefaults();
                  }, 3000)
            }

            scope.deleteUser = function() {
                  mongooseService.deleteUser({"empId": scope.employeeId})
                                           .then(_notifyDeleteSuccess, _notifyDeleteError)
            }

            var _notifyDeleteSuccess = function(response) {
                  scope.shouldDisplayResult = false;
                  scope.showDeleteSuccessAlert = true;
                  $timeout(function() {
                      _resetDefaults();
                  }, 3000)
            }

            var _notifyDeleteError = function(response) {
                  scope.showDeleteErrorAlert = true;
                  $timeout(function() {
                    _resetDefaults();
                  }, 3000)
            }

            scope.updateUser = function(employeeName) {
                 var user = _constructUser(employeeName);
                 mongooseService.updateUser(user)
                                     .then(_notifyUpdateSuccess, _notifyUpdateError)
            }

            var _notifyUpdateSuccess = function(response) {
                   scope.showUpdateSuccessAlert = true;
                   $timeout(function() {
                        _resetDefaults();
                   }, 3000)
            }

            var _notifyUpdateError = function(response) {
                  scope.showUpdateErrorAlert = true;
                  $timeout(function() {
                    _resetDefaults();
                  }, 3000)
            }

             var _constructUser = function(employeeName) {
                  return {empId: scope.employeeId,
                          employeeName:  employeeName,
                          internalNumber:  scope.result.internalNumber};
             }

            var _resetDefaults = function() {
                  scope.employeeId = "";
                  scope.result = "";
                  scope.showFindErrorAlert = false;
                  scope.shouldDisplayResult = true;
                  scope.showDeleteSuccessAlert = false;
                  scope.showDeleteErrorAlert = false;
                  scope.showUpdateSuccessAlert = false;
                  scope.showUpdateErrorAlert = false;
            }
            _resetDefaults();
        }
    }
}]);



