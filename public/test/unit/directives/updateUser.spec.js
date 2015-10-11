describe('updateUser', function() {
    var element, mockMongooseService, scope, mongooseServicePromise;

    beforeEach(function() {
       mongooseServicePromise = Q({data: ["hii"]});
       mockMongooseService = { updateUser: sinon.stub().returns(Q({data: ["hii"]}))};

       module('adjuvant', function($provide) {
           $provide.value('mongooseService', mockMongooseService);
       })
    })

    beforeEach(module('partials/updateUser.html'));

    beforeEach(inject(function($rootScope, $compile) {

        element = angular.element('<div update-user></div>');
        scope = $rootScope;
        $compile(element)($rootScope);
        scope.$digest();
    }))

    it('should reset defaults', function() {
        var isolatedScope = element.isolateScope()
        expect(isolatedScope.employeeId).to.be.eql('')
        expect(isolatedScope.employeeName).to.be.eql('')
        expect(isolatedScope.internalNumber).to.be.eql('')
        expect(isolatedScope.showSuccessAlert).to.be.eql(false)
        expect(isolatedScope.showErrorAlert).to.be.eql(false)
    })

    it('should show update user form', function() {
        var labels = element.find('label')
        expect(labels.text()).to.contain("Employee Name")
        expect(labels.text()).to.contain("Employee ID")
        expect(labels.text()).to.contain("Internal Number")
    })

    it('Should update a user on submit', function() {
        var expectedUser = { empId: "16305",
                             employeeName: "someName",
                             internalNumber: "12480" }

        var isolatedScope = element.isolateScope();
        isolatedScope.employeeId = "16305";
        isolatedScope.employeeName = "someName";
        isolatedScope.internalNumber = "12480";
        isolatedScope.updateUser();

        return mongooseServicePromise.then(function() {
            expect(mockMongooseService.updateUser).to.be.calledOnce;
            expect(mockMongooseService.updateUser).to.be.calledWith(expectedUser);
            expect(isolatedScope.showSuccessAlert).to.be.eql(true)
        })
    })

    it('Should scream when service failed to update user', function() {
        var expectedUser = { empId: "16305",
                             employeeName: "someName",
                             internalNumber: "12480" }
        mockMongooseService.updateUser = sinon.stub().returns(Q.reject());

        var isolatedScope = element.isolateScope();
        isolatedScope.employeeId = "16305";
        isolatedScope.employeeName = "someName";
        isolatedScope.internalNumber = "12480";
        isolatedScope.updateUser();

        return mongooseServicePromise.then(function() {
            expect(isolatedScope.showErrorAlert).to.be.eql(true)
        })
    })
})