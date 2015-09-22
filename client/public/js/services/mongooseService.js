angular.module("mongooseService", [])
    .factory('mongooseService', ['$http', function($http) {

      return {
        update: function(data) {
            return $http.post("/api/updateDB", data)
        },

        placeOrder: function(data) {
            return $http.post("/api/placeOrder", data)
        },
        getJuices: function() {
            return $http.get("/api/getJuices")
        },
      }
}]);