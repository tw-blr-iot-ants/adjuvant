describe("invoiceServiceTest", function() {

    var invoiceService;
     var orders = {pineapple: 4, strawberry: 2};
     var menu = {a: 20, apple: 24, mosambi: 22, amla: 21, mango: 19, strawberry: 27, CTL: 15}

    beforeEach(function(){
        module('adjuvant');

        inject(function(_invoiceService_) {
            invoiceService = _invoiceService_;
        })
    })

    it('should have generateInvoice function', function() {
       expect(angular.isFunction(invoiceService.generateInvoice)).to.be.true;
    })

    it('should generate html from menu and orders', function() {
        var expectedHtml = '<table border="1" class="gridtable" cellspacing="1" cellpadding="5">' +
                            '<tr><td>Description</td><td>Quantity</td><td>Unit Price</td><td>Line Total</td>' +
                            '</tr><tr><td>pineapple</td><td>4</td><td>15*</td><td>60</td></tr>' +
                            '<tr><td>strawberry</td><td>2</td><td>27</td><td>54</td></tr>' +
                            '<tr><th colspan="3">Grand Total</th><td>&#8377; 114</td></tr></table>'

        var generatedHtml = invoiceService.generateInvoice(menu, orders);
        expect(generatedHtml).to.be.eql(expectedHtml);
    })
})