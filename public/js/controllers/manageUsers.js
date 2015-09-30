angular.module('usersController', [])
                .controller('usersController', ['$scope', 'mongooseService', 'Flash',
                function($scope, mongooseService, Flash) {


       $scope.addUser = function() {
            var user = {};
            user["empId"] = $scope.employeeId;
            user["employeeName"] = $scope.employeeName;
            user["serialNumber"] = $scope.serialNumber;
            user["externalNumber"] = $scope.externalNumber;
            user["internalNumber"] = $scope.internalNumber;
            mongooseService.addUser(user)
                               .then(_notifySuccess);
       }

       $scope.deleteUser = function() {
            mongooseService.findUser({"empId": $scope.employeeId})
                                .then(_notifySuccess)
       }

       $scope.findUser = function() {
            mongooseService.findUser({"empId": $scope.employeeId})
                                .then(_notifySuccess)
       }

       $scope.updateUser = function() {
            var user = {};
            user["empId"] = $scope.employeeId;
            user["employeeName"] = $scope.employeeName;
            user["serialNumber"] = $scope.serialNumber;
            user["externalNumber"] = $scope.externalNumber;
            user["internalNumber"] = $scope.internalNumber;
            mongooseService.updateUser(user)
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
            } else if (selection.action == "findUser") {
                  _resetDefaults();
                  $scope.findUserForm = true;
            } else if (selection.action == "updateUser") {
                  _resetDefaults();
                  $scope.updateUserForm = true;
            }
       }


       var _notifySuccess = function(response) {
           $scope.user = response.data;
           var message = '<strong>User updated Successfully </strong> ';
           Flash.create('success', message, 'custom-class');
           _resetDefaults();
           $scope.updated = true;
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
            $scope.findUserForm = false;
            $scope.updateUserForm = false;

       }
}])