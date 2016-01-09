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
        var expectedHtml =  '<table border="2" style="padding: 10px" class="gridtable"  >' +
        '<tr><th>Description</th><th>Unit Price</th><th>Quantity</th><th>Line Total</th>' +
        '</tr><tr><td>pineapple</td><td>15*</td><td>4</td><td>60</td></tr><tr><td>strawberry</td>' +
        '<td>27</td><td>2</td><td>54</td></tr><tr><th colspan="2">Summary</th><td>6</td><td>&#8377; 114</td></tr></table>'


        var generatedHtml = invoiceService.generateInvoice(menu, orders);
        expect(generatedHtml).to.be.eql(expectedHtml);
    })
})