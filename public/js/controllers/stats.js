angular.module('statsController', ["chart.js"])
                .controller('statsController', ['$scope', function($scope) {

      $scope.data = [[65, 59, 80, 81]];
      $scope.labels = ["1", "2", "3", "4"]
}])