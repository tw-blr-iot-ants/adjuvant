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
        httpBackend.expectPOST('/api/beverages/updateWithUpsert', request).respond(response);

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

    it('should get orders for select period', function() {
        var actualResult;
        var request = {startDate: "someDate", endDate: "someOtherDate"}
        var response = {data : {"dummy": "superDummy"}};
        httpBackend.expectGET('/api/orders/someDate/someOtherDate').respond(response);

        var returnPromise = mongooseService.getOrdersForSelection(request);
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
        httpBackend.expectPOST('/api/users/', request).respond(response);

        var returnPromise = mongooseService.addUser(request);
        returnPromise.then(function(res) {
            actualResult = res;
        })
        httpBackend.flush();

        expect(actualResult.data).to.be.eql(response)
    })

    it('should delete a user', function() {
        var actualResult;
        var request = {empId: "16305"}
        var response = {data : {"dummy": "superDummy"}};
        httpBackend.expectDELETE('/api/users/16305').respond(response);

        var returnPromise = mongooseService.deleteUser(request);
        returnPromise.then(function(res) {
            actualResult = res;
        })
        httpBackend.flush();

        expect(actualResult.data).to.be.eql(response)
    })


})