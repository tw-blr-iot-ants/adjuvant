angular.module('usersController', [])
                .controller('usersController', ['$scope',
                function($scope) {

       $scope.setSelectedTab = function(selection) {
            if(selection.action == "add") {
              _resetDefaults();
              $scope.addUserForm = true
            } else if (selection.action == "delete") {
                _resetDefaults();
                $scope.deleteUserForm = true;
            } else if (selection.action == "flushAndUpdateDB") {
                  _resetDefaults();
                  $scope.flushAndUpdateDB = true;
            } else if (selection.action == "findUser") {
                  _resetDefaults();
                  $scope.findUserForm = true;
            } else if (selection.action == "updateUser") {
                  _resetDefaults();
                  $scope.updateUserForm = true;
            } else if (selection.action == "authenticateUser") {
                  _resetDefaults();
                  $scope.authenticateUserForm = true;
            }

            $scope.tabs = _getTabs();
       }

       var _resetDefaults = function() {
            $scope.addUserForm = false;
            $scope.deleteUserForm = false;
            $scope.flushAndUpdateDB = false;
            $scope.findUserForm = false;
            $scope.updateUserForm = false;
            $scope.authenticateUserForm = false;
       }

       var _getTabs = function() {
            return [{name: "Add a user", action: "add", isActive: $scope.addUserForm},
                    {name:"Delete a user", action: "delete", isActive: $scope.deleteUserForm},
                    {name:"Update DB From a file", action: "flushAndUpdateDB", isActive: $scope.flushAndUpdateDB},
                    {name:"Find User", action: "findUser", isActive: $scope.findUserForm},
                    {name:"Update User", action: "updateUser", isActive: $scope.updateUserForm},
                    {name:"Authenticate User", action: "authenticateUser", isActive: $scope.authenticateUserForm}];
       }

       _resetDefaults();
       $scope.tabs = _getTabs();

}])