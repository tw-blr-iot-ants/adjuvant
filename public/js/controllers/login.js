angular.module('loginController', [])
                .controller('loginController', ['$scope', 'appLoginService',
                function($scope, appLoginService) {
                    $scope.username = "";
                    $scope.password = "";
                    $scope.region = "";

                    $scope.onLogin = function() {
                       return appLoginService.loginUser($scope.username, $scope.password, $scope.region).then(function(data) {
                        $scope.info = data;
                       });
                    }
                }
])