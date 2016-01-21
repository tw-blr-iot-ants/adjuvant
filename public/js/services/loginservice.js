angular.module("loginService", [])
    .factory('loginService', ['$http', '$window', function($http, $window) {
      return {
        loginUser: function(username, password, region) {
                    return $http.post("/api/login", {"username": username, "password": password, "region": region}).then(function(data) {
                        if(data.data.redirect) {
                            $window.location.href = data.data.redirect;
                        }
                        else {
                            return data.data;
                        }
                    });
                },
        destroyLoginSession: function() {
            return $http.delete("/api/login");
        }
      }
    }
]);