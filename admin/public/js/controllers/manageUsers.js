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

            mongooseService.addUser(user)
                               .then(_notifySuccess);
       }

       $scope.deleteUser = function() {
            mongooseService.deleteUser({"EmpId": $scope.employeeId})
                                .then(_notifySuccess)
       }

       var _notifySuccess = function(response) {
            console.log("in success")
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
       }
}])