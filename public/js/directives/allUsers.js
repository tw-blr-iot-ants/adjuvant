adjuvant.directive('allUsers', ['mongooseService', '$timeout',
                     function(mongooseService, $timeout) {

    return {
        restrict: 'AE',
           replace: 'true',
           templateUrl: "partials/allUsers.html",
           scope: {},
           link: function(scope) {
                scope.users = []
                scope.filterUsers = []
                scope.currentPage = 1
                scope.numPerPage = 10
                scope.maxSize = 10;
                scope.begin = 0;
                scope.end = scope.begin + scope.numPerPage;

                scope.$watch('currentPage + numPerPage', function() {
                    scope.begin = ((scope.currentPage - 1) * scope.numPerPage)
                    scope.end = scope.begin + scope.numPerPage;

                    scope.filterUsers = scope.users.slice(scope.begin, scope.end);

                });

                scope.approve = function(userToBeEdited) {
                      mongooseService.updateUser(userToBeEdited)
                                        .then(_notifySuccess, _notifyError)
                }

                scope.reject = function(userToBeRejected) {
                    return mongooseService.deleteUser(userToBeRejected)
                                      .then(_notifySuccess, _notifyError)
                }

                var _getAllUsers = function() {
                      mongooseService
                          .getAllUsers()
                          .then(function(response){
                              scope.users = response.data;
                              scope.filterUsers = scope.users.slice(scope.begin, scope.end);
                          }, _notifyError)
                }

                var _constructUser = function(userToBeEdited) {
                       return {empId: userToBeEdited.empId,
                               internalNumber: userToBeEdited.internalNumber,
                               employeeName: userToBeEdited.employeeName}
                }

                var _notifyError = function(response) {
                      scope.showErrorAlert = true;
                      $timeout(function() {
                        scope.showErrorAlert = false;
                      }, 1000)
                }

                var _notifySuccess = function(response) {
                      scope.showSuccessAlert = true;
                      $timeout(function() {
                        scope.showSuccessAlert = false;
                      }, 1500);
                }

                _getAllUsers();
        }
    }
}]);



