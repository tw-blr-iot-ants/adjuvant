angular.module('detailsController', ['ngSanitize'])
                .controller('detailsController', ['$scope', 'statsService', 'googleService',
                                                function($scope, statsService, googleService) {

        googleService.getStats()
            .then(function(response) {
                 $scope.generatedTable =  statsService.displayDetails(response.data);
                 $scope.displayDetails = true;
             })
}])