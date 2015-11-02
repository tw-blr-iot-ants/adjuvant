describe('deleteUser', function() {
    var element, mockMongooseService, scope;

    beforeEach(function() {
       mockMongooseService = { deleteUser: sinon.stub().returns(Q({data: ["hii"]})) };

       module('adjuvant', function($provide) {
           $provide.value('mongooseService', mockMongooseService);
       })
    })

    beforeEach(module('partials/deleteUser.html'));

    beforeEach(inject(function($rootScope, $compile) {

        element = angular.element('<div delete-user></div>');
        scope = $rootScope;
        $compile(element)($rootScope);
        scope.$digest();
    }))

    it('should reset defaults', function() {
        var isolatedScope = element.isolateScope()
        expect(isolatedScope.employeeId).to.be.eql('')
    })

    it('should show delete user form', function() {
        var labels = element.find('label')
        expect(labels.text()).to.contain("Employee ID")
    })

    it('Should delete user on submit if present', function() {
        var expectedUser = { empId: "16305" }

        var isolatedScope = element.isolateScope();
        isolatedScope.employeeId = "16305";

        element.find('button')[0].click();

        expect(mockMongooseService.deleteUser).to.be.calledOnce;
        expect(mockMongooseService.deleteUser).to.be.calledWith(expectedUser);
        expect(isolatedScope.showSuccessAlert).to.be.eql.true;
    })

    it('Should throw an error message if trying to delete a user not exisiting', function() {
        var expectedUser = { empId: "16305" }
        mockMongooseService.deleteUser = sinon.stub().returns(Q.reject({"error": "SomeThing"}))
        var isolatedScope = element.isolateScope();
        isolatedScope.employeeId = "16305";

        element.find('button')[0].click();

        expect(mockMongooseService.deleteUser).to.be.calledOnce;
        expect(mockMongooseService.deleteUser).to.be.calledWith(expectedUser);
        expect(isolatedScope.showErrorAlert).to.be.eql.true;

    })
})