describe('addUser', function() {
    var element, mockMongooseService, scope;

    beforeEach(function() {
       mockMongooseService = { addUser: sinon.stub().returns(Q({data: ["hii"]})),
                                  };

       module('adjuvant', function($provide) {
           $provide.value('mongooseService', mockMongooseService);
       })
    })

    beforeEach(module('partials/addUser.html'));

    beforeEach(inject(function($rootScope, $compile) {

        element = angular.element('<div add-user></div>');
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
    })

    it('should show add user form', function() {
        var labels = element.find('label')
        expect(labels.text()).to.contain("Employee Name")
        expect(labels.text()).to.contain("Employee ID")
        expect(labels.text()).to.contain("Internal Number")
    })

    it('Should add user on submit', function() {
        var expectedUser = { empId: "16305",
                             employeeName: "someName",
                             internalNumber: "12480" }

        var isolatedScope = element.isolateScope();
        isolatedScope.employeeId = "16305";
        isolatedScope.employeeName = "someName";
        isolatedScope.internalNumber = "12480";
        isolatedScope.addUser();
        expect(mockMongooseService.addUser).to.be.calledOnce;
        expect(mockMongooseService.addUser).to.be.calledWith(expectedUser);
    })

    it('should show error message if form is mandatory fields are missing', function() {

        var isolatedScope = element.isolateScope();
        isolatedScope.employeeId = "16305";
        isolatedScope.addUser();
        expect(mockMongooseService.addUser).not.to.be.called;
        expect(isolatedScope.showErrorAlert).to.be.eql(true)

    })
})