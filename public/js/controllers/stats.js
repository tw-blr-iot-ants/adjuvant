angular.module('statsController', ["chart.js"])
                .controller('statsController', ['$scope', 'statsDisplayService', 'googleService',
                                                function($scope, statsDisplayService, googleService) {

        googleService.getStats()
            .then(function(response) {
                      var graphData = statsDisplayService.extractSamples(response.data);
                      delete graphData["order"]
                      delete graphData["undefined"]
                      $scope.labels = _.keys(graphData);
                      $scope.data = [_.values(graphData)];
                      $scope.totalCount = _.size(response.data.rows)
                      $scope.displayStats = true;
            })
}])