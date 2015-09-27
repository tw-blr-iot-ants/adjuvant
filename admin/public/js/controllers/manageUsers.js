angular.module('usersController', [])
                .controller('usersController', ['$scope', 'mongooseService', 'Flash',
                function($scope, mongooseService, Flash) {


       $scope.addUser = function() {
            var user = {};
            user["EmpId"] = $scope.employeeId;
            user["EmployeeName"] = $scope.employeeName;
            user["SerialNumber"] = $scope.serialNumber;
            user["ExternalNumber"] = $scope.externalNumber;
            user["InternalNumber"] = $scope.internalNumber;
            console.log(mongooseService)

            mongooseService.addUser(user)
                               .then(_notifySuccess);
       }

       $scope.deleteUser = function() {
            mongooseService.deleteUser({"EmpId": $scope.employeeId})
                                .then(_notifySuccess)
       }

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
            }
       }

       var _notifySuccess = function(response) {
           var message = '<strong>User updated Successfully </strong> ';
           Flash.create('success', message, 'custom-class');
           $scope.updated = true;
           _resetDefaults();
       }

       var _resetDefaults = function() {
            $scope.employeeId = "";
            $scope.employeeName = "";
            $scope.serialNumber = "";
            $scope.externalNumber = "";
            $scope.internalNumber = "";
            $scope.addUserForm = false;
            $scope.deleteUserForm = false;
            $scope.flushAndUpdateDB = false;

       }
}])