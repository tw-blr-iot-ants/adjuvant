angular.module('tabsController', [])
                .controller('tabsController', ['$scope', '$location',
                function($scope, $location) {

     $scope.tabs = [
           { link : '#/manageJuices', label : 'Juices' },
           { link : '#/invoice', label : 'Invoices' },
           { link : '#/manageUsers', label : 'Users' }
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