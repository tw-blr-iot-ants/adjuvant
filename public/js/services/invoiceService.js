angular.module("invoiceService", [])
            .service("invoiceService", function() {

    var isDefaultPrice = false;

    var generateInvoice = function(menu, orders) {
        var html = "";
        html += '<table border="2" style="padding: 10px" class="gridtable"  >';
        var sum = 0;
        var totalCount =0;
        html += _getHeadings();
        _.each(orders, function(quantity, item) {
           var unitPrice = menu[item] ? menu[item] : _setDefaultPrice();
           var individualCost = unitPrice * quantity;
           var tableRow = ""
           tableRow += "<tr><td>" + item + "</td>";
           tableRow += "<td>" + unitPrice;
           if(isDefaultPrice) {
               tableRow += "*"
           }
           tableRow += "</td>";
           tableRow += "<td>" + quantity + "</td>";
           tableRow += "<td>" + individualCost.toString()  + "</td></tr>";
           sum += individualCost;
           totalCount += quantity;
           html += tableRow;
           isDefaultPrice = false;
        })
        html += '<tr><th colspan="2">Summary</th><td>' + totalCount +'</td><td>' + "&#8377; " + sum + '</td></tr>'
        html += '</table>';
        return html;
    }

    var _getHeadings = function() {
        return '<tr><th>Description</th><th>Unit Price</th><th>Quantity</th><th>Line Total</th></tr>';
    }

    var _setDefaultPrice = function() {
        isDefaultPrice = true;
        return 15;
    }
    return {
        generateInvoice : generateInvoice
    }
})
