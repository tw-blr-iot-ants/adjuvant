angular.module('adjuvant').directive('authenticateUser', ['mongooseService', '$timeout',
                     function(mongooseService, $timeout) {

    return {
        restrict: 'AE',
        replace: 'true',
        templateUrl: "/partials/authenticateUser.html",
        scope: {},
        link: function(scope) {

            scope.approve = function(userTobeApproved) {
                mongooseService.approveUser(_constructUser(userTobeApproved))
                                  .then(_deleteUserFromNewUsers)
                                  .then(_getUsersTobeAuthenticated, _notifyError)
            }

            scope.reject = function(userToBeRejected) {
                return mongooseService.deleteUserFromNewUsers(userToBeRejected)
                                  .then(_getUsersTobeAuthenticated, _notifyError)
            }

            var _notifyError = function(response) {
                  scope.showErrorAlert = true;
                  $timeout(function() {
                    scope.showErrorAlert = false;
                  }, 1000)
            }

            var _getUsersTobeAuthenticated = function() {
                 mongooseService
                     .getUsersTobeAuthenticated()
                     .then(function(response){
                         scope.newUsers = response.data;
                     }, _notifyError)
            }

            var _notifySuccess = function(response) {
                  scope.showErrorAlert = true;
                  $timeout(function() {
                    scope.showErrorAlert = false;
                  }, 1000)
            }

            var _constructUser = function(userTobeApproved) {
               return {empId: userTobeApproved.empId,
                       internalNumber: userTobeApproved.internalNumber,
                       employeeName: userTobeApproved.employeeName}
            }

            var _deleteUserFromNewUsers = function(response) {
                var userToBeDeleted = response.data;
                return mongooseService.deleteUserFromNewUsers(userToBeDeleted);
            }

            _getUsersTobeAuthenticated();
        }
    }
}]);



