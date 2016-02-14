angular.module('usersController', [])
                .controller('usersController', ['$scope',
                function($scope) {

       $scope.setSelectedTab = function(selection) {
            if(selection.action == "add") {
              _resetDefaults();
              $scope.addUserForm = true
            } else if (selection.action == "flushAndUpdateDB") {
                  _resetDefaults();
                  $scope.flushAndUpdateDB = true;
            } else if (selection.action == "findUpdateDeleteUser") {
                  _resetDefaults();
                  $scope.findUpdateDeleteUserForm = true;
            } else if (selection.action == "authenticateUser") {
                  _resetDefaults();
                  $scope.authenticateUserForm = true;
            } else if (selection.action == "allUsers") {
                  _resetDefaults();
                  $scope.allUsersForm = true;
            }

            $scope.tabs = _getTabs();
       }

       var _resetDefaults = function() {
            $scope.addUserForm = false;
            $scope.flushAndUpdateDB = false;
            $scope.findUpdateDeleteUserForm = false;
            $scope.authenticateUserForm = false;
            $scope.allUsersForm = false;
       }

       var _getTabs = function() {
            return [{name: "Add a user", action: "add", isActive: $scope.addUserForm},
                    {name:"Update DB From a file", action: "flushAndUpdateDB", isActive: $scope.flushAndUpdateDB},
                    {name:"Find/Update/Delete User", action: "findUpdateDeleteUser", isActive: $scope.findUpdateDeleteUserForm},
                    {name:"Authenticate User", action: "authenticateUser", isActive: $scope.authenticateUserForm},
                    {name:"All Users", action: "allUsers", isActive: $scope.allUsersForm}];
       }

       _resetDefaults();
       $scope.tabs = _getTabs();

}])