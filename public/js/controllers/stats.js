angular.module('statsController', ["chart.js"])
                .controller('statsController', ['$scope', 'statsService', 'googleService',
                                                function($scope, statsService, googleService) {

        googleService.getStats()
            .then(function(response) {
                      var graphData = statsService.extractSamples(response.data);
                      delete graphData["Order"]
                      delete graphData["undefined"]
                      $scope.labels = _.keys(graphData);
                      $scope.data = [_.values(graphData)];
                      $scope.totalCount = _.size(response.data.rows)
                      $scope.displayStats = true;
            })
}])