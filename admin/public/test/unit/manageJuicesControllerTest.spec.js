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

            mockMongooseService.getJuices = function() {
                var defer = $q.defer();
                defer.resolve(this.response);
                return defer.promise;
            }

            mockMongooseService.updateBeverage = function(beverage) {
                var defer = $q.defer();
                this.response.data.push(beverage);
                defer.resolve(this.data);
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

    it("should get all juices on the admin portal", function() {
        var expectedBeverages =  [ { Name : 'strawberry', Cost : 27, Available : false },
                                    { Name : 'mango', Cost : 19, Available : false },
                                    { Name : 'amla', Cost : 21, Available : false },
                                    { Name : 'mosambi', Cost : 22, Available : false } ]
        expect(scope.beverages).toEqual(expectedBeverages)
        expect(scope.loading).toEqual(false)
    })

    it("should add a beverage", function() {
        var expectedBeverages =  [ { Name : 'strawberry', Cost : 27, Available : false },
                                    { Name : 'mango', Cost : 19, Available : false },
                                    { Name : 'amla', Cost : 21, Available : false },
                                    { Name : 'mosambi', Cost : 22, Available : false },
                                    {Name : 'beer', Cost : 12, Available : true}]
        scope.Name = "beer";
        scope.Cost = 12;
        scope.Available = true;

        scope.updateBeverage();

        expect(scope.beverages).toEqual(expectedBeverages)
    })

    it("should be able to set availability", function() {
        var expectedBeverages =  [ { Name : 'strawberry', Cost : 27, Available : false },
                                    { Name : 'mango', Cost : 19, Available : false },
                                    { Name : 'amla', Cost : 21, Available : false },
                                    { Name : 'mosambi', Cost : 22, Available : false },
                                    { Name : 'amla', Cost : 21, Available : true },]

        var beverageToBeUpdate = {Name : 'amla', Cost : 21, Available : false};

        scope.updateAvailability(beverageToBeUpdate);

        expect(scope.beverages).toEqual(expectedBeverages)
    })
})