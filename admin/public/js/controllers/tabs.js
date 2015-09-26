angular.module('tabsController', [])
                .controller('tabsController', ['$scope',
                function($scope) {

     $scope.tabs = [
           { link : '#/manageJuices', label : 'Juices' },
           { link : '#/invoice', label : 'Invoices' }
     ];


      $scope.selectedTab = $scope.tabs[0];
      $scope.setSelectedTab = function(tab) {
         $scope.selectedTab = tab;
      }

      $scope.tabClass = function(tab) {
         if ($scope.selectedTab == tab) {
           return "active";
         } else {
           return "";
         }
      }

}])