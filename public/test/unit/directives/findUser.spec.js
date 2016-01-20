describe('findUser', function() {
    var element, mockMongooseService, scope, mongooseServicePromise, employee, updatedEmployee;


    beforeEach(function() {
       employee = {employeeId: "123", employeeName: "Ravi", internalNumber: "000"};
       mongooseServicePromise = Q({data: employee})

       updatedEmployee = {employeeId: "123", employeeName: "Jack", internalNumber: "000"};
       mongooseServiceUpdatePromise = Q({data: updatedEmployee})

       mongooseServiceDeletePromise = Q({data: "success"})

       mockMongooseService = { findUser: sinon.stub().returns(mongooseServicePromise), updateUser: sinon.stub().returns(mongooseServiceUpdatePromise), deleteUser: sinon.stub().returns(mongooseServiceDeletePromise) };

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
        expect(isolatedScope.employeeId).to.be.eql('')
        expect(isolatedScope.employeeName).to.be.eql('')
        expect(isolatedScope.result).to.be.eql('')
        expect(isolatedScope.showFindErrorAlert).to.be.eql(false)
        expect(isolatedScope.shouldDisplayResult).to.be.eql(true)
        expect(isolatedScope.showDeleteSuccessAlert).to.be.eql(false)
        expect(isolatedScope.showDeleteErrorAlert).to.be.eql(false)
        expect(isolatedScope.showUpdateSuccessAlert).to.be.eql(false)
        expect(isolatedScope.showUpdateErrorAlert).to.be.eql(false)
    })

    it('should show form', function() {
        var enterEmpIDLabel = element.find('label')
        expect(enterEmpIDLabel.text()).to.contain("Employee ID")
    })

    it('Should find a user on submit', function() {
        var expectedUser = { empId: "16305" }

        var isolatedScope = element.isolateScope();
        isolatedScope.employeeId = "16305";

        element.find('button')[0].click();

        return mongooseServicePromise.then(function() {
            expect(mockMongooseService.findUser).to.be.calledOnce;
            expect(mockMongooseService.findUser).to.be.calledWith(expectedUser);
            expect(isolatedScope.result).to.be.eql(employee);
            expect(isolatedScope.employeeName).to.be.eql(employee.employeeName);
        })
    })

    it('Should set appropriate flags when find service fails', function() {
        var expectedUser = { empId: "16305" }
        mockMongooseService.findUser = sinon.stub().returns(Q.reject());

        var isolatedScope = element.isolateScope();
        isolatedScope.employeeId = "16305";

        element.find('button')[0].click();

        return mongooseServicePromise.then(function() {
            expect(isolatedScope.showFindErrorAlert).to.be.eql(true)
            expect(isolatedScope.shouldDisplayResult).to.be.eql(false)
        })
    })

    it('Should show update and delete buttons', function() {
            var compileElement = element[0];

            var expectedUser = { empId: "16305" }

            var isolatedScope = element.isolateScope();
            isolatedScope.employeeId = "16305";
            isolatedScope.shouldDisplayResult = true;



            element.find('button')[0].click();

            return mongooseServicePromise.then(function() {
                expect(mockMongooseService.findUser).to.be.calledOnce;
                expect(mockMongooseService.findUser).to.be.calledWith(expectedUser);
                expect(isolatedScope.result).to.be.eql(employee);
                expect(isolatedScope.employeeName).to.be.eql(employee.employeeName);
                isolatedScope.$apply();

                var updateButton = angular.element(compileElement.querySelector('#updateButton')).html();

                expect(updateButton).to.be.eql("Update");

            })
    })
})