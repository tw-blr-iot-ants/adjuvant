angular.module('detailsController', ['ngSanitize'])
                .controller('detailsController', ['$scope', 'statsDisplayService', 'googleService',
                                                function($scope, statsDisplayService, googleService) {

        googleService.getStats()
            .then(function(response) {
                 $scope.generatedTable =  statsDisplayService.displayDetails(response.data);
             })
}])