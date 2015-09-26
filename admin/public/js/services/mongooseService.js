angular.module("mongooseService", [])
    .factory('mongooseService', ['$http', function($http) {

      return {
        updateBeverage: function(data) {
            return $http.post("/api/updateBeverage", data)
        },
        getJuices: function() {
            return $http.get("/api/beverages/")
        },
        getOrders: function(data) {
            return $http.put("/api/orders", data)
        },
        getOrdersWithInRange: function(data) {
            return $http.put("/api/ordersWithInRange", data)
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