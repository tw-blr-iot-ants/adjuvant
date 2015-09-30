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
            mongooseService.deleteUser({"empId": $scope.employeeId})
                                .then(_notifySuccess, _notifyError)
       }

       $scope.findUser = function() {
            mongooseService.findUser({"empId": $scope.employeeId})
                                .then(function(response){
                                    $scope.result = response.data;
                                }, _notifyError)
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
            _resetDefaults();
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
           $scope.showSuccess = true;
           var message = '<strong>User updated Successfully </strong> ';
           Flash.create('success', message, 'custom-class');
       }

       var _notifyError = function(response) {
           $scope.showError = true;
           var message = '<strong>User details Not Found</strong> ';
           Flash.create('danger', message, 'custom-class');
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
            $scope.showSuccess = false;
            $scope.result = null;
            $scope.showError = false;
       }
}])