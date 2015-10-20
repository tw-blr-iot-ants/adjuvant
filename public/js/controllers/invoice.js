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
            return mongooseService.getOrdersForSelection({"startDate": _setStartOfDate($scope.selectedDate),
                                                          "endDate": _setEndOfDate(new Date(startDate))})
                                .then(_extractRegisterOrders)
                                .then(_getJuiceMenu)
                                .then(_constructInvoice)
        }

        $scope.getInvoiceWithInRange = function() {
            return mongooseService.getOrdersForSelection({"startDate": _setStartOfDate($scope.startDate),
                                                          "endDate": _setEndOfDate($scope.endDate)})
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
            $scope.generatedTableForJuices = $sce.trustAsHtml(invoiceService.generateInvoice(menu, orders));
            $scope.generatedTableForCTL = $sce.trustAsHtml(invoiceService.generateInvoice(menu, {CTL : orders.CTL}));
            $scope.invoiceReady = true;
        }

        var _buildMenu = function(response) {
             _.each(response.data, function(item) {
                     menu[item.name] = item.cost;
             })
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
}])