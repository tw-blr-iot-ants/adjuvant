describe("AllUsers", function() {
    var getAllUserRejectionPromise, getAllUsersPromise, isolatedScope, mockMongooseService, deleteUserPromise;
    var users = []

    var generateUsers = function() {
        for (var i =0 ; i <1000 ; i++) {
            var user = {}
            user.empId = i;
            user.employeeName = 'someOne'
            users.push(user);
        }
    }

    generateUsers();
    beforeEach(function() {
       getAllUserRejectionPromise = Q.reject('no reason');
       getAllUsersPromise = Q({data: users })
       updateUserPromise = Q({data: {}})
       deleteUserPromise = Q({data: {}})
       mockMongooseService = { getAllUsers: sinon.stub().returns(getAllUsersPromise),
                               updateUser: sinon.stub().returns(updateUserPromise),
                               deleteUser: sinon.stub().returns(deleteUserPromise)};

       module('adjuvant', function($provide) {
           $provide.value('mongooseService', mockMongooseService);
       })
    });

    beforeEach(module('partials/allUsers.html'));

    beforeEach(inject(function($rootScope, $compile) {

            element = angular.element('<div all-users></div>');
            scope = $rootScope;
            $compile(element)($rootScope);
            scope.$apply();
            isolatedScope = element.isolateScope();
            isolatedScope.numPerPage = 10;
            scope.$apply();
    }))


    it('should get all users', function() {
        return getAllUsersPromise.then(function() {
            expect(mockMongooseService.getAllUsers).to.be.calledOnce;
            expect(isolatedScope.users).to.be.eql(users)
        })
    })

    it('should select first page by default', function() {

        return getAllUsersPromise.then(function() {
            expect(mockMongooseService.getAllUsers).to.be.calledOnce;
            expect(isolatedScope.filterUsers).to.be.eql(users.slice(0, 10))
        });
    });

    it('should select navigate to second page on selecting page 2', function() {
        isolatedScope.currentPage = 2
        isolatedScope.$apply();

        return getAllUsersPromise.then(function() {
            expect(mockMongooseService.getAllUsers).to.be.calledOnce;
            expect(isolatedScope.filterUsers).to.be.eql(users.slice(10, 20))
        });
    });

    it('should update a user on clicking tick button', function() {
        var compileElement, updateButton;
        return getAllUsersPromise.then(function() {
            isolatedScope.$apply();
            compileElement = element[0];
            UpdateButton = angular.element(compileElement.querySelector('#updateUser-0'));
            UpdateButton[0].click();

            expect(mockMongooseService.updateUser).to.be.calledOnce;

            return updateUserPromise.then(function() {
               expect(isolatedScope.showSuccessAlert).to.be.true;
            })
        });
    });

    it('should show error alert when update fails', function() {
        var updateUserRejectionPromise = Q.reject();
        mockMongooseService.updateUser = sinon.stub().returns(updateUserRejectionPromise);
        var compileElement, updateButton;

        return getAllUsersPromise.then(function() {
            isolatedScope.$apply();
            compileElement = element[0];
            UpdateButton = angular.element(compileElement.querySelector('#updateUser-0'));
            UpdateButton[0].click();

            return updateUserRejectionPromise.then(undefined, function() {
               expect(isolatedScope.showErrorAlert).to.be.true;
            })
        });
    });

    it('should remove the user on clicking cross button', function() {
        var updateUserRejectionPromise = Q.reject();
        var compileElement, removeButton;

        return getAllUsersPromise.then(function() {
            isolatedScope.$apply();
            compileElement = element[0];
            removeButton = angular.element(compileElement.querySelector('#removeUser-0'));
            removeButton[0].click();

            expect(mockMongooseService.deleteUser).to.be.calledOnce;

            return deleteUserPromise.then(undefined, function() {
              expect(isolatedScope.showSuccessAlert).to.be.true;
            })
        });
    });
});