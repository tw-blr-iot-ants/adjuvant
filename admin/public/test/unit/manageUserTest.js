describe("manageJuiceController", function() {
    var scope, mongooseService;

    beforeEach(function() {
        var mockMongooseService = {};
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

            mockMongooseService.addUser = function() {
                var defer = $q.defer();
                defer.resolve(this.response);
                return defer.promise;
            }
        })
    })

    beforeEach(inject(function($controller, $rootScope, _mongooseService_) {
        scope = $rootScope.$new();
        mongooseService = _mongooseService_;

        $controller('juiceController', {$scope: scope, mongooseService: mongooseService});

        scope.$digest();
    }))


    it("should add a user", function() {

        scope.employeeId ="16305";
        scope.employeeName = "hit";
        scope.serialNumber = "748" ;
        scope.externalNumber = "10117767";
        scope.internalNumber = "13013";

        scope.addUser();

        expect(scope.beverages).toEqual(expectedBeverages)
    })


})