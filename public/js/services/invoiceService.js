angular.module("invoiceService", [])
    .service("invoiceService", function () {

        var isDefaultPrice = false;

        var generateDetailedInvoice = function (menu, categories) {
            var html = "";
            html += '<table border="2" style="padding: 10px" class="gridtable"  >';
            var sum = 0;
            var totalCount = 0;
            html += _getInvoiceHeaders();
            _.each(categories, function (order) {
                _.each(order, function (quantity, itemName) {
                    var basePrice = menu[itemName] ? menu[itemName] : _setDefaultPrice();
                    var individualCost = basePrice * quantity;
                    var tableRow = ""
                    tableRow += "<tr><td>" + itemName + "</td>";
                    tableRow += "<td>" + basePrice;
                    if (isDefaultPrice) {
                        tableRow += "*"
                    }
                    tableRow += "</td>";
                    tableRow += "<td>" + quantity + "</td>";
                    tableRow += "<td>" + individualCost.toString() + "</td></tr>";
                    sum += individualCost;
                    totalCount += quantity;
                    html += tableRow;
                    isDefaultPrice = false;
                })
            })
            html += '<tr><th colspan="2">Total</th><td>' + totalCount + '</td><td>' + "&#8377; " + sum + '</td></tr>'
            html += '</table>';
            return html;
        }

        var generateSummaryInvoice = function (orders) {
            var html = "";
            html += '<table border="2" style="padding: 10px" class="gridtable"  >';
            html += '<tr><th>Category</th><th>Quantity Sold</th></tr>';
            _.each(orders, function (item, drinkType) {
                var tableRow = "";
                tableRow += "<tr><td>" + drinkType + "</td>";
                tableRow += "</td>";
                tableRow += "<td>" + item.count + "</td></tr>";
                html += tableRow;
            });
            html += '</table>';
            return html;
        }


        var _getInvoiceHeaders = function () {
            return '<tr><th>Item</th><th>Base Price</th><th>Quantity</th><th>Amount</th></tr>';
        }

        var _setDefaultPrice = function () {
            isDefaultPrice = true;
            return 15;
        }
        return {
            generateSummaryInvoice: generateSummaryInvoice,
            generateDetailedInvoice: generateDetailedInvoice
        }
    })
