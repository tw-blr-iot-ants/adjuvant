angular.module("mongooseService", [])
    .factory('mongooseService', ['$http', function($http) {

      return {
        updateBeverage: function(data) {
            return $http.post("/api/beverages/updateWithUpsert", data)
        },
        getBeverages: function() {
            return $http.get("/api/beverages/")
        },
        getOrdersForSingleDay: function(request) {
            return $http.get("/api/orders/" +  request.date)
        },
        getOrdersForSelectPeriod: function(request) {
            return $http.get("/api/orders/" + request.startDate + "/" + request.endDate)
        },
        addUser: function(data) {
             return $http.post("/api/users/", data)
        },
        deleteUser: function(request) {
             return $http.delete("/api/users/" +  request.empId)
        }
      }
    }
]);