angular.module('ordersController', [])
                .controller('ordersController', ['$scope', '$sce', 'mongooseService',
                function($scope, $sce,  mongooseService) {

       $scope.ordersForDate = false;
       $scope.ordersReady = false;


       $scope.getOrders = function() {
            $scope.generatedTableForOrders = "";
            return mongooseService.getOrdersForSelection({"startDate": _setStartOfDate($scope.selectedDate),
                                                                      "endDate": _setEndOfDate(new Date($scope.selectedDate))})
                                            .then(_extractRegisterOrders)
        }

       var _setStartOfDate = function(startDate) {
            startDate.setSeconds(0);
            startDate.setHours(0);
            startDate.setMinutes(0);
            return startDate;
       }


       var _setEndOfDate = function(endDate) {
             endDate.setHours(23);
             endDate.setMinutes(59);
             endDate.setSeconds(59);
             return endDate;
       }

       var _extractRegisterOrders = function(response) {
            $scope.orders = transform(response.data);
            $scope.ordersReady = true;
       }

       var transform = function(orders) {
            var combinedOrders = [];
            var isAddedToCombinedOrders = false;
            _.each(orders, function(order) {
                isAddedToCombinedOrders = false;
                _.each(combinedOrders, function(combinedOrder) {
                    if(combinedOrder.employeeId == order.employeeId) {
                        combinedOrder.quantity = combinedOrder.quantity + order.quantity;
                        combinedOrder.drinks.push(order.drinkName);
                        isAddedToCombinedOrders = true;
                    }
                })

                if(!isAddedToCombinedOrders) {
                    order.drinks = [];
                    order.drinks.push(order.drinkName);
                    delete order.drinkName;
                    combinedOrders.push(order);
                }
            })

            return combinedOrders;
       }

}])