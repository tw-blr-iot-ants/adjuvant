angular.module("mongooseService", [])
    .factory('mongooseService', ['$http', function($http) {

      return {
        updateBeverage: function(data) {
            return $http.post("/api/beverages/updateWithUpsert", data)
        },
        getBeverages: function() {
            return $http.get("/api/beverages/")
        },
        getOrdersForSelection: function(request) {
            return $http.get("/api/orders/" + request.startDate + "/" + request.endDate)
        },
        addUser: function(data) {
             return $http.post("/api/users/", data)
        },
        findUser: function(request) {
             return $http.get("/api/users/empId/" +  request.empId)
        },
        updateUser: function(request) {
             return $http.put("/api/users/" +  request.empId, request)
        }
      }
    }
]);