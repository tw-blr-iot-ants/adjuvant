angular.module('invoiceController', [])
    .controller('invoiceController', ['$scope', '$sce', 'mongooseService', 'invoiceService',
        function ($scope, $sce, mongooseService, invoiceService) {

            $scope.selectedDate = "";
            $scope.invoiceReady = false;
            $scope.generatedTable = "";
            $scope.printDiv = function (divName) {
                var printContents = document.getElementById(divName).innerHTML;
                var popupWin = window.open('', '_blank', 'width=300,height=300,top=200, left=300');
                popupWin.document.open()
                popupWin.document.write('<html><head><link rel="stylesheet" type="text/css" href="style.css" /></head><body onload="window.print()">' + printContents + '</html>');
                popupWin.document.close();
            };

            var orders = {};
            var menu = {};
            var summary = {};
            $scope.getInvoiceForSingleDate = function () {
                $scope.generatedTableForCTL = "";
                $scope.generatedTableForJuices = "";
                $scope.generatedTableForSummary = "";
                return mongooseService.getOrdersForSelection({
                    "startDate": _setStartOfDate($scope.selectedDate),
                    "endDate": _setEndOfDate(new Date($scope.selectedDate))
                })
                    .then(_extractRegisterOrders)
                    .then(_getJuiceMenu)
                    .then(_constructInvoice)
            };

            $scope.getInvoiceWithInRange = function () {
                $scope.generatedTableForCTL = "";
                $scope.generatedTableForJuices = "";
                return mongooseService.getOrdersForSelection({
                    "startDate": _setStartOfDate($scope.startDate),
                    "endDate": _setEndOfDate($scope.endDate)
                })
                    .then(_extractRegisterOrders)
                    .then(_getJuiceMenu)
                    .then(_constructInvoice)
            };

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
                _.each(response.data, function (order) {
                    var drinkName = order.drinkName;
                    _.times(order.quantity, function () {
                        if (order.isFruit == true) {
                            juiceChoice.push(drinkName + " Fruit")
                        } else {
                            juiceChoice.push(drinkName)
                        }
                    })
                });
                orders = _.countBy(juiceChoice, _.identity);
                getSummary(response);
            };

            var getSummary = function (response) {
                var ctl = 0, fruitCount = 0, milkshakeCount = 0, juiceCount = 0;
                _.each(response.data, function (order) {
                    if (order.drinkName.toLowerCase() == "tea" || order.drinkName.toLowerCase().indexOf("coffee") != -1 || order.drinkName.toLowerCase().indexOf("ctl") != -1) {
                        ctl += order.quantity;
                    } else if (order.drinkName.toLowerCase().indexOf("lemon tea") != -1) {
                        ctl += order.quantity;
                    }
                    else if (order.drinkName.toLowerCase()=="ginger tea") {
                        ctl += order.quantity;
                    }
                    else if (order.drinkName.toLowerCase() =="almond milk") {
                        ctl += order.quantity;
                    }
                    else if (order.isFruit == true) {
                        fruitCount += order.quantity;
                    }
                    else if (order.drinkName.toLowerCase()=="milkshake") {
                        milkshakeCount += order.quantity;
                    }
                    else {
                        juiceCount += order.quantity;
                    }
                });
                summary["CTL"] = ctl;
                summary["Fruits"] = fruitCount;
                summary["Milkshakes"] = milkshakeCount;
                summary["Juices"] = juiceCount;
            };

            var _getJuiceMenu = function () {
                return mongooseService.getBeverages()
                    .then(_buildMenu)
            };

            var _constructInvoice = function () {
                _constructCTLInvoice();
                _constructJuiceInvoice();
                _constructSummaryInvoice();
                $scope.invoiceReady = true;
            };

            var _constructCTLInvoice = function () {
                var ctlOrders = getOnlyCTLOrders();
                if (ctlOrders["Tea"] || ctlOrders["Coffee"] || ctlOrders["Lemon Tea"] || ctlOrders["Ginger Tea"] || ctlOrders["Almond Milk"]) {
                    $scope.generatedTableForCTL = $sce.trustAsHtml(invoiceService.generateInvoice(menu, ctlOrders));
                }
            };

            var _constructJuiceInvoice = function () {
                var juiceOrders = getOnlyJuicesOrders();
                $scope.generatedTableForJuices = $sce.trustAsHtml(invoiceService.generateInvoice(menu, juiceOrders));
            };

            var _constructSummaryInvoice = function () {
                var summaryOrders;
                summaryOrders = summary;
                $scope.generatedTableForSummary = $sce.trustAsHtml(invoiceService.generateInvoice(menu, summaryOrders));
            };

            var _buildMenu = function (response) {
                _.each(response.data, function (item) {
                    menu[item.name] = item.cost;
                    if (item.name.indexOf("CTL") != -1 && menu["Coffee"] == null) {
                        menu["Coffee"] = item.cost;
                    }
                    else if (item.name.toLowerCase() == "tea" == null && menu["Tea"] == null) {
                        menu["Tea"] = item.cost;
                    }
                    else if (item.name.toLowerCase() == "lemon tea" && menu["Lemon Tea"] == null) {
                        menu["Lemon Tea"] = item.cost;
                    }
                    else if (item.name.toLowerCase() == "ginger tea" && menu["Ginger Tea"] == null) {
                        menu["Ginger Tea"] = item.cost;
                    }
                    else if (item.name.toLowerCase() == "almond milk" && menu["Almond Milk"] == null) {
                        menu["Almond Milk"] = item.cost;
                    }
                    else if (item.isFruit == true) {
                        menu["Fruits"] = item.cost;
                        menu[item["name"]+" Fruit"] = item.cost;

                    }
                    else if (item.name.indexOf("Milkshake") != -1 && menu["Milkshakes"] == null) {
                        menu["Milkshakes"] = item.cost;
                    }
                    else {
                        menu["Juices"] = item.cost;
                    }
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

            var getOnlyJuicesOrders = function () {
                delete orders["Tea"];
                delete orders["Coffee"];
                delete orders["Almond Milk"];
                delete orders["Ginger Tea"];
                delete orders["Lemon Tea"];
                return orders;
            };

            var getOnlyCTLOrders = function () {
                var tea = orders["Tea"]?orders["Tea"]:0;
                var coffee = orders["Coffee"]?orders["Coffee"]:0;
                var lemonTea = orders["Lemon Tea"]?orders["Lemon Tea"]:0;
                var gingerTea = orders["Ginger Tea"]?orders["Ginger Tea"]:0;
                var almondMilk = orders["Almond Milk"]?orders["Almond Milk"]:0;
                return {
                    "Tea": tea,
                    "Coffee": coffee,
                    "Lemon Tea": lemonTea,
                    "Ginger Tea": gingerTea,
                    "Almond Milk": almondMilk
                };
            }
        }]);