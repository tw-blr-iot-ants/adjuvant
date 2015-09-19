angular.module("mongooseService", [])
    .factory('mongooseService', ['$http', function($http) {

      return {
        setupJuices: function(data) {
            return $http.post("/api/setupJuices", data)
        },
        getRegisterEntries: function(data) {
            return $http.post("/api/getInvoice", data)
        },
        getJuices: function() {
                    return $http.get("/api/getJuices")
        },
        deleteJuice:function(data) {
            console.log("data", data)
            return $http.post("/api/deleteJuice", data)
        }

      }
    }
]);