describe("mongooseServiceTest", function() {

    var mongooseService, httpBackend;

    beforeEach(function(){
        module('adjuvant');

        inject(function($httpBackend, _mongooseService_) {
            httpBackend = $httpBackend;
            mongooseService = _mongooseService_;
        })
    })

    afterEach(function(){
        httpBackend.verifyNoOutstandingExpectation();
        httpBackend.verifyNoOutstandingRequest();
    })

    it('should update beverages', function() {
        var actualResult;
        var request = {query: "query"}
        var response = {data : {"dummy": "superDummy"}};
        httpBackend.expectPOST('/api/updateBeverage', request).respond(response);

        var returnPromise = mongooseService.updateBeverage(request);

        returnPromise.then(function(res) {
            actualResult = res;
        })

        httpBackend.flush()
        expect(actualResult.data).to.be.eql(response)
    })

    it('should get beverages', function() {
        var actualResult;
        var response = {data : {"dummy": "superDummy"}};
        httpBackend.expectGET('/api/beverages/').respond(response);

        var returnPromise = mongooseService.getBeverages();
        returnPromise.then(function(res) {
            actualResult = res;
        })
        httpBackend.flush();

        expect(actualResult.data).to.be.eql(response)
    })

    it('should get orders for given date', function() {
        var actualResult;
        var request = {date: "someDate"}
        var response = {data : {"dummy": "superDummy"}};
        httpBackend.expectPUT('/api/findOrdersForSingleDay').respond(response);

        var returnPromise = mongooseService.getOrdersForSingleDay(request);
        returnPromise.then(function(res) {
            actualResult = res;
        })
        httpBackend.flush();

        expect(actualResult.data).to.be.eql(response)
    })

    it('should get orders for select period', function() {
        var actualResult;
        var request = {date: "someDate"}
        var response = {data : {"dummy": "superDummy"}};
        httpBackend.expectPUT('/api/findOrdersForSelectPeriod').respond(response);

        var returnPromise = mongooseService.getOrdersForSelectPeriod(request);
        returnPromise.then(function(res) {
            actualResult = res;
        })
        httpBackend.flush();

        expect(actualResult.data).to.be.eql(response)
    })

    it('should add a user', function() {
        var actualResult;
        var request = {user: "someUser"}
        var response = {data : {"dummy": "superDummy"}};
        httpBackend.expectPOST('/api/addUser', request).respond(response);

        var returnPromise = mongooseService.addUser(request);
        returnPromise.then(function(res) {
            actualResult = res;
        })
        httpBackend.flush();

        expect(actualResult.data).to.be.eql(response)
    })


})