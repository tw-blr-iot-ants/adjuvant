describe('addUser', function() {
    var element, mockMongooseService, scope,
        getUsersTobeAuthenticatedPromise, approveUserPromise,
        deleteUserFromNewUsersPromise;


    var newUsers = [{internalNumber: "1245" , empId: "16305", employeeName: "someG"},
                    {internalNumber: "1246", empId: "16306", employeeName: "someb"},
                    {internalNumber: "1247", empId: "16307", employeeName: "someh"}]

    var user = { empId: "16305", employeeName: "someName", internalNumber: "12480" }

    beforeEach(function() {

       approveUserPromise = Q({data: user});
       getUsersTobeAuthenticatedPromise = Q({data: newUsers});
       deleteUserFromNewUsersPromise = Q({data: newUsers});

       mockMongooseService = { approveUser: sinon.stub().returns(approveUserPromise),
                               deleteUserFromNewUsers: sinon.stub().returns(deleteUserFromNewUsersPromise),
                               getUsersTobeAuthenticated: sinon.stub().returns(getUsersTobeAuthenticatedPromise)
                              };

       module('adjuvant', function($provide) {
           $provide.value('mongooseService', mockMongooseService);
       })
    })

    beforeEach(module('partials/authenticateUser.html'));

    beforeEach(inject(function($rootScope, $compile) {

        element = angular.element('<div authenticate-user></div>');
        scope = $rootScope;
        $compile(element)($rootScope);
        scope.$digest();
    }))

    it('should get users to be authenticated', function() {
        var expectedNewUsers = [{internalNumber: "1245" , empId: "16305", employeeName: "someG"},
                                {internalNumber: "1246", empId: "16306", employeeName: "someb"},
                                {internalNumber: "1247", empId: "16307", employeeName: "someh"}]
        var isolatedScope = element.isolateScope()

        return getUsersTobeAuthenticatedPromise.then(function() {
            expect(mockMongooseService.getUsersTobeAuthenticated).to.be.calledOnce;
            expect(isolatedScope.newUsers).to.be.eql(expectedNewUsers);
        })
    })

    it('should approve user on selecting approve button', function() {
         var expectedUser = { empId: "16305",
                                     employeeName: "someName",
                                     internalNumber: "12480" }
         var userTobeApproved = { empId: "16305",
                                  employeeName: "someName",
                                  internalNumber: "12480" }

         var isolatedScope = element.isolateScope();
         isolatedScope.approve(userTobeApproved);
         expect(mockMongooseService.approveUser).to.be.calledOnce;
         expect(mockMongooseService.approveUser).to.be.calledWith(expectedUser);
    })

    it('should remove user from newUsers after approving the user', function() {
         var expectedUser = { empId: "16305",
                                     employeeName: "someName",
                                     internalNumber: "12480" }
         var userTobeApproved = { empId: "16305",
                                  employeeName: "someName",
                                  internalNumber: "12480" }

         var isolatedScope = element.isolateScope();
         isolatedScope.approve(userTobeApproved);

         return getUsersTobeAuthenticatedPromise.then(function() {

            expect(mockMongooseService.approveUser).to.be.calledOnce;
            expect(mockMongooseService.approveUser).to.be.calledWith(expectedUser);

            expect(mockMongooseService.deleteUserFromNewUsers).to.be.calledOnce;
            expect(mockMongooseService.deleteUserFromNewUsers).to.be.calledWith(expectedUser);
         })
    })

    it('should reject user on selecting reject button', function() {
         var expectedUser = { empId: "16305",
                                     employeeName: "someName",
                                     internalNumber: "12480" }
         var userToBeRejected = { empId: "16305",
                                  employeeName: "someName",
                                  internalNumber: "12480" }

         var isolatedScope = element.isolateScope();
         isolatedScope.reject(userToBeRejected);

          return getUsersTobeAuthenticatedPromise.then(function() {

               expect(mockMongooseService.deleteUserFromNewUsers).to.be.calledOnce;
               expect(mockMongooseService.deleteUserFromNewUsers).to.be.calledWith(expectedUser);
               expect(mockMongooseService.getUsersTobeAuthenticated).to.be.calledTwice;
          })
    })

})