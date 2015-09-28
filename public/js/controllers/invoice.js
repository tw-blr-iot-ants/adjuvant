angular.module('invoiceController', [])
                .controller('invoiceController', ['$scope', '$sce', 'mongooseService', 'invoiceService',
                function($scope, $sce,  mongooseService, invoiceService) {

        $scope.selectedDate = "";
        $scope.invoiceReady = false;
        $scope.generatedTable = "";

        var orders = {};
        var menu = {};
        $scope.getInvoice = function() {
            $scope.generatedTable = "";
            var transformedDate =  $scope.selectedDate;
            return mongooseService.getOrdersForSingleDay({"date": transformedDate})
                                .then(_extractRegisterOrders)
                                .then(_getJuiceMenu)
                                .then(_constructInvoice)
        }

        $scope.getInvoiceWithInRange = function() {
            var startDate =  $scope.startDate;
            startDate.setHours(0,0,0,0);
            var endDate =  $scope.endDate;
            endDate.setHours(24,0,0,0)
            return mongooseService.getOrdersForSelectPeriod({"startDate": startDate, "endDate": endDate})
                                .then(_extractRegisterOrders)
                                .then(_getJuiceMenu)
                                .then(_constructInvoice)
        }

        $scope.setInvoiceForDate = function() {
            $scope.generatedTable = "";
            $scope.invoiceForDate = true;
            $scope.invoiceForPeriod = false;
            $scope.invoiceReady = false;
        }

        $scope.setInvoiceForPeriod = function() {
            $scope.generatedTable = "";
            $scope.invoiceForDate = false;
            $scope.invoiceForPeriod = true;
            $scope.invoiceReady = false;
        }

        var _extractRegisterOrders = function(response) {
          var juiceChoice = [];
          _.each(response.data, function(order) {
            var drinkName = order.drinkName;
            _.times(order.quantity, function() {
                juiceChoice.push(drinkName)
            })
          })
          orders =  _.countBy(juiceChoice , _.identity);
        }

        var _getJuiceMenu = function() {
            return mongooseService.getBeverages()
                                .then(_buildMenu)
        }

        var _constructInvoice = function() {
            $scope.generatedTable = $sce.trustAsHtml(invoiceService.generateInvoice(menu, orders));
            $scope.invoiceReady = true;
        }

        var _buildMenu = function(response) {
             _.each(response.data, function(item) {
                     menu[item.Name] = item.Cost;
             })
        }

}])