describe("usersControllerTest", function() {
    var scope, mongooseService;

    beforeEach(function() {
        var mockMongooseService = {addUser: sinon.stub().returns(Q({})),
                                    deleteUser: sinon.stub().returns(Q({}))
                                   };
        module('adjuvant', function($provide) {
            $provide.value('mongooseService', mockMongooseService);
        })

        inject(function($q) {
            mockMongooseService.response = {data : [
                  {"Name" : "strawberry", "Cost" : 27, "Available" : false },
                  {"Name" : "mango", "Cost" : 19, "Available" : false },
                  {  "Name" : "amla", "Cost" : 21, "Available" : false },
                  {  "Name" : "mosambi", "Cost" : 22, "Available" : false}
            ]};

        })
    })

    beforeEach(inject(function($controller, $rootScope, _mongooseService_) {
        scope = $rootScope.$new();
        mongooseService = _mongooseService_;

        $controller('usersController', {$scope: scope, mongooseService: mongooseService, Flash: {}});

        scope.$digest();
    }))


    it("should add a user", function() {

        scope.employeeId ="16305";
        scope.employeeName = "hit";
        scope.serialNumber = "748" ;
        scope.externalNumber = "10117767";
        scope.internalNumber = "13013";

        scope.addUser();

        expect(mongooseService.addUser).to.be.calledOnce
    })

    it("should delete a user", function() {
        scope.employeeId ="16305";

        scope.deleteUser();

        expect(mongooseService.deleteUser).to.be.calledOnce
        expect(mongooseService.deleteUser).to.be.calledWith({ EmpId: "16305" })
    })

    it("should set scope from setSelctedTab ", function() {
        var selection = {action: "add"}
        scope.setSelectedTab(selection);

        expect(scope.addUserForm).to.be.true
        expect(scope.deleteUserForm).to.be.false
        expect(scope.flushAndUpdateDB).to.be.false
    })
})