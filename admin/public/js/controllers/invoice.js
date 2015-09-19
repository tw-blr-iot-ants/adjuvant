angular.module('invoiceController', [])
                .controller('invoiceController', ['$scope', '$sce', 'mongooseService', 'invoiceService',
                function($scope, $sce,  mongooseService, invoiceService) {

        $scope.selectedDate = "";
        $scope.invoiceReady = false;

        var orders = {};
        var menu = {};
        $scope.getInvoice = function() {
            var transformedDate =  _transformDate($scope.selectedDate);
            mongooseService.getRegisterEntries({"Date": transformedDate})
                                .then(_extractRegisterOrders)
                                .then(_getJuiceMenu)
                                .then(_constructInvoice)
        }

        var _extractRegisterOrders = function(response) {
          var juiceChoice = [];
          _.each(response.data, function(entry) {
               juiceChoice.push(entry.Order)
          })
          orders =  _.countBy(juiceChoice , _.identity);

        }

        var _getJuiceMenu = function() {
            return mongooseService.getJuices()
                                .then(function(response) {
                                          _.each(response.data, function(item) {
                                                menu[item.Juice] = item.Cost;
                                          })
                                })
        }

        var _constructInvoice = function() {
            $scope.generatedTable = $sce.trustAsHtml(invoiceService.generateInvoice(menu, orders));
            $scope.invoiceReady = true;
        }

        var _transformDate = function(date) {
            return date.getDate() + '/' + (date.getMonth() + 1)   + '/' + date.getFullYear();
        }

}])