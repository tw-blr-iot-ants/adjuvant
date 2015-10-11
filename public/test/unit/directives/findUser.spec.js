describe('findUser', function() {
    var element, mockMongooseService, scope, mongooseServicePromise


    beforeEach(function() {
       mongooseServicePromise = Q({data: ["dummy"]})
       mockMongooseService = { findUser: sinon.stub().returns(mongooseServicePromise) };

       module('adjuvant', function($provide) {
           $provide.value('mongooseService', mockMongooseService);
       })
    })

    beforeEach(module('partials/findUser.html'));

    beforeEach(inject(function($rootScope, $compile) {

        element = angular.element('<div find-user></div>');
        scope = $rootScope;
        $compile(element)($rootScope);
        scope.$digest();
    }))

    it('should reset defaults', function() {
        var isolatedScope = element.isolateScope()
        expect(isolatedScope.showSuccessAlert).to.be.eql(false)
        expect(isolatedScope.employeeId).to.be.eql('')
    })

    it('should show form', function() {
        var labels = element.find('label')
        expect(labels.text()).to.contain("Employee ID")
    })

    it('Should delete user on submit', function() {
        var expectedUser = { empId: "16305" }

        var isolatedScope = element.isolateScope();
        isolatedScope.employeeId = "16305";

        element.find('button')[0].click();

        return mongooseServicePromise.then(function() {
            expect(mockMongooseService.findUser).to.be.calledOnce;
            expect(mockMongooseService.findUser).to.be.calledWith(expectedUser);
            expect(isolatedScope.result).to.be.eql(["dummy"]);
        })
    })

    it('Should set showErrorAlert flag to true when service fails', function() {
        var expectedUser = { empId: "16305" }
        mockMongooseService.findUser = sinon.stub().returns(Q.reject());

        var isolatedScope = element.isolateScope();
        isolatedScope.employeeId = "16305";

        element.find('button')[0].click();

        return mongooseServicePromise.then(function() {
            expect(isolatedScope.showErrorAlert).to.be.eql(true)
        })
    })
})