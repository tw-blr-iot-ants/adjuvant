angular.module('juiceController', [])
                .controller('juiceController', ['$scope', 'mongooseService',
                function($scope, mongooseService) {

    $scope.loading = true;
    mongooseService.getJuices()
                          .then(function(response) {
                            $scope.juices = response.data;
                            $scope.loading = false;
                          })

    $scope.updateJuices = function() {
        var juiceDetails = {};
        juiceDetails.Juice = ($scope.juiceName).split("-")[0];
        juiceDetails.Cost = ($scope.juiceName).split("-")[1];
        mongooseService.setupJuices(juiceDetails)
                           .then(function(response) {
                                 $scope.juices = response.data;
                                 $scope.loading = false;
                           })
    }

    $scope.deleteJuice = function(juiceToBeDeleted) {
        mongooseService.deleteJuice({"juiceToBeDeleted": juiceToBeDeleted})
                            .then(function(response) {
                                      $scope.juices = response.data;
                                      $scope.loading = false;
                            })
    }
}])