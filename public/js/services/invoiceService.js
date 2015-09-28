angular.module("invoiceService", [])
            .service("invoiceService", function() {

    var isDefaultPrice = false;

    var generateInvoice = function(menu, orders) {
        var html = "";
        html += '<table border="1" class="gridtable" cellspacing="1" cellpadding="5">';
        var sum = 0;
        html += _getHeadings();
        _.each(orders, function(quantity, item) {
           var unitPrice = menu[item] ? menu[item] : _setDefaultPrice();
           var individualCost = unitPrice * quantity;
           var tableRow = ""
           tableRow += "<tr><td>" + item + "</td>";
           tableRow += "<td>" + quantity + "</td>";
           tableRow += "<td>" + unitPrice;
           if(isDefaultPrice) {
               tableRow += "*"
           }
           tableRow += "</td>";
           tableRow += "<td>" + individualCost.toString()  + "</td></tr>";
           sum += individualCost;
           html += tableRow;
           isDefaultPrice = false;
        })
        html += '<tr><th colspan="3">Grand Total</th><td>' + "&#8377; " + sum + '</td></tr>'
        html += '</table>';
        return html;
    }

    var _getHeadings = function() {
        return '<tr><td>Description</td><td>Quantity</td><td>Unit Price</td><td>Line Total</td></tr>';
    }

    var _setDefaultPrice = function() {
        isDefaultPrice = true;
        return 15;
    }
    return {
        generateInvoice : generateInvoice
    }
})