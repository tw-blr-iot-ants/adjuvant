angular.module('loginController', [])
                .controller('loginController', ['$scope', 'loginService',
                function($scope, loginService) {
                    $scope.username = "";
                    $scope.password = "";

                    $scope.onLogin = function() {
                       return loginService.loginUser($scope.username, $scope.password).then(function(data) {
                        $scope.info = data;
                       });
                    }
                }
])