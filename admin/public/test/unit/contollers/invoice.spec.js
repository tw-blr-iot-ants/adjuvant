describe("invoiceControllerTest", function() {
    var scope, mongooseService, sce, invoiceService;

    var orders = [
    {Date: "2015-08-01T18:30:00.000Z", DrinkName: "pineapple", EmployeeId: "16305", Name: "dixith", Quantity: 1},
    {Date: "2015-08-01T18:30:00.000Z", DrinkName: "strawberry", EmployeeId: "16305", Name: "dixith", Quantity: 2},
    {Date: "2015-08-01T18:30:00.000Z", DrinkName: "pineapple", EmployeeId: "16305", Name: "dixith",Quantity: 3}]

    var beverages = [{Available: false, Cost: 15, Name: "pineapple"},
                    {Available: false, Cost: 15, Name: "strawberry"}]

    var generatedHtml = "<table border=\"1\" class=\"gridtable\" cellspacing=\"1\" cellpadding=\"5\"><tr><td>" +
                        "Description</td><td>Quantity</td><td>Unit Price</td><td>Line Total</td></tr><tr><td>" +
                        "pineapple</td><td>4</td><td>15*</td><td>60</td></tr><tr><td>strawberry</td><td>2</td>" +
                        "<td>15*</td><td>30</td></tr><tr><th colspan=\"3\">Grand Total</th><td>&#8377; 90</td></tr></table>"

    beforeEach(function() {
        var mockMongooseService = {getOrders: sinon.stub().returns(Q({data: orders})),
                                    getOrdersWithInRange: sinon.stub().returns(Q({})),
                                    getBeverages: sinon.stub().returns(Q({data: beverages}))
                                   };
        var mockInvoiceService = {
                                  generateInvoice: sinon.stub().returns(generatedHtml)
                                 }
        module('adjuvant', function($provide) {
            $provide.value('mongooseService', mockMongooseService);
            $provide.value('invoiceService', mockInvoiceService);
        })
    })

    beforeEach(inject(function($controller, $sce, $rootScope, _mongooseService_, _invoiceService_) {
        scope = $rootScope.$new();
        mongooseService = _mongooseService_;
        invoiceService = _invoiceService_;
        sce = $sce;

        $controller('invoiceController', {$scope: scope, $sce: sce,
                                            mongooseService: mongooseService,
                                            invoiceService:invoiceService});
        scope.$digest();
    }))


    it("should generateInvoice for single day", function() {

        var someDate = new Date();
        var expectedQuery = {"Date": someDate};
        scope.selectedDate = someDate;

        return scope.getInvoice().then(function() {

        expect(mongooseService.getOrders).to.be.calledOnce;
        expect(mongooseService.getOrders).to.be.calledWith(expectedQuery);
        expect(scope.invoiceReady).to.be.true;
        });

    })

    it("should generateInvoice for select period", function() {

        var someDate = new Date();
        var someOtherDate = new Date();
        scope.startDate = someDate;
        scope.endDate = someOtherDate;
        var expectedQuery = {"startDate": someDate, "endDate": someOtherDate}

        return scope.getInvoiceWithInRange().then(function() {
            expect(mongooseService.getOrdersWithInRange).to.be.calledOnce;
            expect(mongooseService.getOrdersWithInRange).to.be.calledWith(expectedQuery);
            expect(scope.invoiceReady).to.be.true;
        })
    })

    it("should set variables for invoice selected for single day", function() {

         scope.setInvoiceForDate();
         expect(scope.generatedTable).to.be.eql("");
         expect(scope.invoiceForDate).to.be.true;
         expect(scope.invoiceForPeriod).to.be.false;
         expect(scope.invoiceReady).to.be.false;
    })

    it("should set variables for invoice selected for single day", function() {

         scope.setInvoiceForPeriod();
         expect(scope.generatedTable).to.be.eql("");
         expect(scope.invoiceForDate).to.be.false;
         expect(scope.invoiceForPeriod).to.be.true;
         expect(scope.invoiceReady).to.be.false;
    })


})