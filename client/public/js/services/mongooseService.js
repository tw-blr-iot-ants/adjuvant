angular.module("mongooseService", [])
    .factory('mongooseService', ['$http', function($http) {

      return {
        update: function(data) {
            return $http.post("/api/updateDB", data)
        },

        addJuice: function(data) {
            return $http.post("/api/addJuice", data)
        },
        getJuices: function() {
            return $http.get("/api/getJuices")
        },
      }
}]);