describe("invoiceControllerTest", function() {
    var scope, mongooseService, sce, invoiceService;

    var orders = [
    {date: "2015-08-01T18:30:00.000Z", drinkName: "pineapple", employeeId: "16305", name: "Sathi", quantity: 1},
    {date: "2015-08-01T18:30:00.000Z", drinkName: "strawberry",employeeId: "16305", name: "Sathi", quantity: 2},
    {date: "2015-08-01T18:30:00.000Z", drinkName: "pineapple", employeeId: "16305", name: "Sathi", quantity: 3},
    {date: "2015-08-01T18:30:00.000Z", drinkName: "CTL", employeeId: "16305", name: "Sathi", quantity: 3}]

    var beverages = [{available: false, cost: 15, name: "pineapple"},
                     {available: false, cost: 15, name: "strawberry"},
                     {available: false, cost: 6, name: "CTL"}]

    var generatedHtml = "<table border=\"1\" class=\"gridtable\" cellspacing=\"1\" cellpadding=\"5\"><tr><td>" +
                        "Description</td><td>Quantity</td><td>Unit Price</td><td>Line Total</td></tr><tr><td>" +
                        "pineapple</td><td>4</td><td>15*</td><td>60</td></tr><tr><td>strawberry</td><td>2</td>" +
                        "<td>15*</td><td>30</td></tr><tr><th colspan=\"3\">Grand Total</th><td>&#8377; 90</td></tr></table>"

    beforeEach(function() {
        var mockMongooseService = { getOrdersForSelection: sinon.stub().returns(Q({data: orders})),
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
        var today = new Date();
        today.setSeconds(0);
        today.setHours(0);
        today.setMinutes(0);
        var todayMidNight  = new Date();
        todayMidNight.setSeconds(59);
        todayMidNight.setHours(23);
        todayMidNight.setMinutes(59);

        var expectedQuery = {"startDate": today, "endDate": todayMidNight};
        scope.selectedDate = today;

        return scope.getInvoiceForSingleDate().then(function() {
                expect(mongooseService.getOrdersForSelection).to.be.calledOnce;
                expect(mongooseService.getOrdersForSelection).to.be.calledWith(expectedQuery);
                expect(scope.invoiceReady).to.be.true;
        });
    })

    it("should generateInvoice for select period", function() {

        var someDate = new Date();
        someDate.setSeconds(0);
        someDate.setHours(0);
        someDate.setMinutes(0);
        var someAnotherDate  = new Date();
        someAnotherDate.setHours(23);
        someAnotherDate.setSeconds(59);
        someAnotherDate.setMinutes(59);

        var expectedQuery = {"startDate": someDate, "endDate": someAnotherDate};

        scope.startDate = someDate;
        scope.endDate = someAnotherDate;

        return scope.getInvoiceWithInRange().then(function() {
            expect(mongooseService.getOrdersForSelection).to.be.calledOnce;
            expect(mongooseService.getOrdersForSelection).to.be.calledWith(expectedQuery);
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