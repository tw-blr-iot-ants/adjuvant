angular.module("mongooseService", [])
    .factory('mongooseService', ['$http', function($http) {

      return {
        update : function(data) {
            return $http.post("/api/updateDB", data)
        }
      }
}]);