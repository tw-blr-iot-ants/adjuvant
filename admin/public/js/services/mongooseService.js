angular.module("mongooseService", [])
    .factory('mongooseService', ['$http', function($http) {

      return {
        updateBeverage: function(data) {
            return $http.post("/api/updateBeverage", data)
        },
        getBeverages: function() {
            return $http.get("/api/beverages/")
        },
        getOrdersForSingleDay: function(data) {
            return $http.put("/api/findOrdersForSingleDay", data)
        },
        getOrdersForSelectPeriod: function(data) {
            return $http.put("/api/findOrdersForSelectPeriod", data)
        },
        addUser: function(data) {
             return $http.post("/api/addUser", data)
        },
        deleteUser: function(data) {
             return $http.post("/api/deleteUser", data)
        }
      }
    }
]);