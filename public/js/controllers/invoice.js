angular.module('invoiceController', [])
    .controller('invoiceController', ['$scope', '$sce', 'mongooseService', 'invoiceService',
        function ($scope, $sce, mongooseService, invoiceService) {

            $scope.selectedDate = "";
            $scope.invoiceReady = false;
            $scope.generatedTable = "";
            $scope.printDiv = function (divName) {
                var printContents = document.getElementById(divName).innerHTML;
                var popupWin = window.open('', '_blank', 'width=300,height=300,top=200, left=300');
                popupWin.document.open();
                popupWin.document.write('<html><head><link rel="stylesheet" type="text/css" href="style.css" /></head><body onload="window.print()">' + printContents + '</html>');
                popupWin.document.close();
            };

            var allJuices = {};
            var allCTL = {};
            var allFruits = {};
            var allBeverages = [];
            var menu = {};
            var summary = {};
            $scope.getInvoiceForSingleDate = function () {
                $scope.generatedTableForCTL = "";
                $scope.generatedTableForJuices = "";
                $scope.generatedDetailedTable = "";
                $scope.generatedTableForSummary = "";

                return _getJuiceMenu()
                    .then(_buildMenu)
                    .then(mongooseService.getOrdersForSelection({
                    "startDate": _setStartOfDate($scope.selectedDate),
                    "endDate": _setEndOfDate(new Date($scope.selectedDate))
                }).then((res) => {
                    _extractRegisterOrders(res);
                    _constructInvoice();
                }))};

            $scope.getInvoiceWithInRange = function () {
                $scope.generatedTableForCTL = "";
                $scope.generatedTableForJuices = "";

                return _getJuiceMenu()
                    .then(_buildMenu)
                    .then(mongooseService.getOrdersForSelection({
                    "startDate": _setStartOfDate($scope.startDate),
                    "endDate": _setEndOfDate($scope.endDate)
                }).then((res) => {
                    _extractRegisterOrders(res);
                    _constructInvoice();
                }));

            };

            $scope.setInvoiceCategoryToCTL = function () {
                $scope.invoiceForCTL = true;
                $scope.invoiceForJuiceAndFruits = false;
            }

            $scope.setInvoiceCategoryToJuiceAndFruits = function () {
                $scope.invoiceForCTL = false;
                $scope.invoiceForJuiceAndFruits = true;
            }

            $scope.setInvoiceForDate = function () {
                $scope.generatedTable = "";
                $scope.invoiceForDate = true;
                $scope.invoiceForPeriod = false;
                $scope.invoiceReady = false;
            };

            $scope.setInvoiceForPeriod = function () {
                $scope.generatedTable = "";
                $scope.invoiceForDate = false;
                $scope.invoiceForPeriod = true;
                $scope.invoiceReady = false;
            };

            var _extractRegisterOrders = function (response) {
                var juiceChoice = [];
                var ctl = [];
                var fruits = [];
                allBeverages = [];
                _.each(response.data, function (order) {
                    var drinkName = order.drinkName;
                    _.times(order.quantity, function () {
                        if (order.isFruit) {
                            fruits.push(drinkName)
                        } else if (order.type == "juice") {
                            juiceChoice.push(drinkName)
                        } else if (order.type == "ctl") {
                            ctl.push(drinkName)
                        }
                    })
                });
                if($scope.invoiceForJuiceAndFruits){
                    allJuices = _.countBy(juiceChoice, _.identity);
                    allFruits = _.countBy(fruits, _.identity);
                    allBeverages = [allJuices, allFruits];

                }
                else{
                    allCTL = _.countBy(ctl, _.identity);
                    allBeverages = [allCTL];
                }
                getSummary(response);
            };

            var getSummary = function (response) {
                summary = {};
                var ctl = 0, fruitCount = 0, juiceCount = 0;
                var ctlTotalCosts = 0, fruitsTotalCosts = 0, juiceTotalCosts = 0;
                _.each(response.data, function (order) {
                    if (order.type === "juice") {
                        juiceCount += order.quantity;
                        juiceTotalCosts += order.quantity * menu[order.drinkName];
                    } else if (order.type === "ctl") {
                        ctl += order.quantity;
                        ctlTotalCosts += order.quantity * menu[order.drinkName];
                    }
                    else if (order.isFruit) {
                        fruitCount += order.quantity;
                        fruitsTotalCosts += order.quantity * menu[order.drinkName];
                    }
                });

                if($scope.invoiceForJuiceAndFruits){
                    summary['Fruits'] = {'count': fruitCount, 'totalCost': fruitsTotalCosts};
                    summary["Juices"] = {'count': juiceCount, 'totalCost': juiceTotalCosts};
                }
                else{
                    summary['CTL'] = {'count': ctl, 'totalCost': ctlTotalCosts};
                }
            };

            var _getJuiceMenu = function () {
                return mongooseService.getBeverages()
            };

            var _constructInvoice = function () {
                _constructDetailedInvoice();
                _constructSummaryInvoice();
                $scope.invoiceReady = true;
            };

            var _constructDetailedInvoice = function () {
                $scope.generatedDetailedTable = $sce.trustAsHtml(invoiceService.generateDetailedInvoice(menu, allBeverages));
            }

            var _constructSummaryInvoice = function () {
                var summaryOrders;
                summaryOrders = summary;
                $scope.generatedTableForSummary = $sce.trustAsHtml(invoiceService.generateSummaryInvoice(summaryOrders));
            };

            var _buildMenu = function (response) {
                _.each(response.data, function (item) {
                    menu[item.name] = item.cost;
                })

            };

            var _setStartOfDate = function (startDate) {
                startDate.setSeconds(0);
                startDate.setHours(0);
                startDate.setMinutes(0);
                return startDate;
            };

            var _setEndOfDate = function (endDate) {
                endDate.setHours(23);
                endDate.setMinutes(59);
                endDate.setSeconds(59);
                return endDate;
            };

        }]);